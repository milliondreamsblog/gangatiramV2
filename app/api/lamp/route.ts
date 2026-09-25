import { paymentProofError, normalizeWhatsapp, MAX_NAMES } from "@/lib/payment";
import { getSql, json, badRequest, fieldStr } from "@/lib/server/db";
import { compressProof, toBytea, type Proof } from "@/lib/server/proof";
import { sendLampEmail } from "@/lib/server/notify";

/**
 * Dev Deepawali diya offering — same durability order as the book flow:
 * validate → compress proof → INSERT (one row per name, shared proof) →
 * notify fail-soft → record alert flags.
 *
 * Two entry points share this route:
 *   - /dev-deepawali sends the screenshot up front → status "received".
 *   - /diya (the QR page) saves *before* the UPI app opens, with no proof →
 *     status "awaiting_payment"; /api/lamp/confirm moves it on once paid.
 */
export async function POST(request: Request): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequest("Expected multipart form data.");
  }

  let names: string[] = [];
  try {
    const parsed = JSON.parse(fieldStr(form.get("names"), 4000) || "[]");
    if (!Array.isArray(parsed) || parsed.some((name) => typeof name !== "string")) {
      return badRequest("Every diya needs a valid name.");
    }
    names = parsed.map((name: string) => name.trim().replace(/\s+/g, " "));
    if (names.some((name) => name.length < 2 || name.length > 80)) {
      return badRequest("Every diya needs a name between 2 and 80 characters.");
    }
  } catch {
    return badRequest("Could not read the names.");
  }
  if (!names.length) return badRequest("At least one name is required.");
  if (names.length > MAX_NAMES) {
    return badRequest(`At most ${MAX_NAMES} names per offering.`);
  }

  const dedication = fieldStr(form.get("dedication"), 300);
  const gotra = fieldStr(form.get("gotra"), 80);
  const email = fieldStr(form.get("email"), 200);
  const rawWhatsapp = fieldStr(form.get("whatsapp"), 30);
  const whatsapp = rawWhatsapp ? normalizeWhatsapp(rawWhatsapp) : null;
  const screenshot = form.get("screenshot");

  if (rawWhatsapp && !whatsapp) {
    return badRequest("That WhatsApp number doesn't look right — 10 digits, please.");
  }
  if (email && !/.+@.+\..+/.test(email)) {
    return badRequest("That email doesn't look right.");
  }
  if (!email && !whatsapp) {
    return badRequest("A WhatsApp number is required — your clip is sent there.");
  }

  let proof: Proof | null = null;
  if (screenshot instanceof File && screenshot.size > 0) {
    const proofError = paymentProofError(screenshot);
    if (proofError) return badRequest(proofError);
    proof = await compressProof(screenshot, "lamp");
  } else if (form.get("pay_later") !== "1") {
    return badRequest("Payment screenshot is required.");
  }

  let ids: number[];
  try {
    const sql = getSql();
    // One statement is atomic: every name is stored, or none is.
    const rows = (await sql`
      INSERT INTO lamp_offerings (name_on_lamp, dedication, gotra, email, whatsapp, status, screenshot_filename, screenshot_mime, screenshot)
      SELECT name, ${dedication || null}, ${gotra || null}, ${email || null}, ${whatsapp},
             ${proof ? "received" : "awaiting_payment"},
             ${proof?.filename ?? null}, ${proof?.mime ?? null}, ${proof ? toBytea(proof.buffer) : null}
      FROM unnest(${names}::text[]) WITH ORDINALITY AS offerings(name, position)
      ORDER BY position
      RETURNING id
    `) as { id: number }[];
    ids = rows.map((row) => row.id);
  } catch (error) {
    console.error("lamp insert failed", error);
    return json({ ok: false, error: "Could not save your offering. Please try again." }, 500);
  }

  // Unpaid offerings alert on /api/lamp/confirm instead, so abandoned
  // checkouts never reach the inbox.
  if (proof) {
    const emailSent = await sendLampEmail({ firstId: ids[0], names, dedication, gotra, email, whatsapp }, proof);
    try {
      const sql = getSql();
      await sql`UPDATE lamp_offerings SET email_sent = ${emailSent} WHERE id = ANY(${ids})`;
    } catch (error) {
      console.error("lamp flag update failed", error);
    }
  }

  return json({ ok: true, ids, names });
}

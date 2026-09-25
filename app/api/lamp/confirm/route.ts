import { paymentProofError, normalizeWhatsapp, MAX_NAMES } from "@/lib/payment";
import { getSql, json, badRequest, fieldStr } from "@/lib/server/db";
import { compressProof, toBytea, type Proof } from "@/lib/server/proof";
import { sendLampEmail } from "@/lib/server/notify";

/**
 * "I've paid" from the /diya page: awaiting_payment → received, with an
 * optional screenshot. The WhatsApp number must match the one stored, so a
 * guessed id alone can't flip someone else's offering. This is the payer's
 * claim — the admin still checks the UPI statement for the GT reference.
 */
export async function POST(request: Request): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequest("Expected multipart form data.");
  }

  let ids: number[];
  try {
    const parsed = JSON.parse(fieldStr(form.get("ids"), 1000) || "[]");
    if (!Array.isArray(parsed) || !parsed.length || parsed.length > MAX_NAMES) throw new Error();
    ids = parsed.map(Number);
    if (ids.some((id) => !Number.isInteger(id) || id <= 0)) throw new Error();
  } catch {
    return badRequest("Could not read which diyas to confirm.");
  }

  const whatsapp = normalizeWhatsapp(fieldStr(form.get("whatsapp"), 30));
  if (!whatsapp) return badRequest("WhatsApp number is required.");

  let proof: Proof | null = null;
  const screenshot = form.get("screenshot");
  if (screenshot instanceof File && screenshot.size > 0) {
    const proofError = paymentProofError(screenshot);
    if (proofError) return badRequest(proofError);
    proof = await compressProof(screenshot, "lamp confirm");
  }

  let rows: { id: number; name_on_lamp: string; gotra: string | null; dedication: string | null; email: string | null }[];
  try {
    const sql = getSql();
    rows = (await sql`
      UPDATE lamp_offerings
      SET status = 'received',
          screenshot_filename = COALESCE(${proof?.filename ?? null}, screenshot_filename),
          screenshot_mime = COALESCE(${proof?.mime ?? null}, screenshot_mime),
          screenshot = COALESCE(${proof ? toBytea(proof.buffer) : null}::bytea, screenshot)
      WHERE id = ANY(${ids}) AND whatsapp = ${whatsapp} AND status = 'awaiting_payment'
      RETURNING id, name_on_lamp, gotra, dedication, email
    `) as typeof rows;
  } catch (error) {
    console.error("lamp confirm failed", error);
    return json({ ok: false, error: "Could not record your payment. Please try again." }, 500);
  }
  // Nothing matched: already confirmed (double tap, second device) or not ours.
  if (!rows.length) return json({ ok: true, ids: [] });

  rows.sort((a, b) => a.id - b.id);
  const updated = rows.map((row) => row.id);
  const emailSent = await sendLampEmail(
    {
      firstId: updated[0],
      names: rows.map((row) => row.name_on_lamp),
      dedication: rows[0].dedication ?? "",
      gotra: rows[0].gotra ?? "",
      email: rows[0].email ?? "",
      whatsapp,
    },
    proof
  );
  try {
    const sql = getSql();
    await sql`UPDATE lamp_offerings SET email_sent = ${emailSent} WHERE id = ANY(${updated})`;
  } catch (error) {
    console.error("lamp confirm flag update failed", error);
  }

  return json({ ok: true, ids: updated });
}

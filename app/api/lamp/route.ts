import sharp from "sharp";
import { paymentProofError, MAX_NAMES } from "@/lib/payment";
import { getSql, json, badRequest, fieldStr } from "@/lib/server/db";
import { sendLampEmail } from "@/lib/server/notify";

/**
 * Dev Deepawali diya offering — same durability order as the book flow:
 * validate → compress proof → INSERT (one row per name, shared proof) →
 * notify fail-soft → record alert flags.
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
  const email = fieldStr(form.get("email"), 200);
  const whatsapp = fieldStr(form.get("whatsapp"), 30);
  const screenshot = form.get("screenshot");

  if (!/.+@.+\..+/.test(email)) {
    return badRequest("A working email is required — your clip is sent there.");
  }
  if (!(screenshot instanceof File) || screenshot.size === 0) {
    return badRequest("Payment screenshot is required.");
  }
  const proofError = paymentProofError(screenshot);
  if (proofError) return badRequest(proofError);

  let bytes = Buffer.from(await screenshot.arrayBuffer());
  let mime = screenshot.type;
  let filename = screenshot.name.slice(0, 300);
  if (/^image\//i.test(mime)) {
    try {
      bytes = Buffer.from(
        await sharp(bytes)
          .rotate()
          .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 72, mozjpeg: true })
          .toBuffer()
      );
      mime = "image/jpeg";
      filename = filename.replace(/\.\w+$/, "") + ".jpg";
    } catch (error) {
      console.error("lamp screenshot compression failed, storing original", error);
    }
  }

  let ids: number[];
  try {
    const sql = getSql();
    const hex = "\\x" + bytes.toString("hex");
    // One statement is atomic: every name is stored, or none is.
    const rows = (await sql`
      INSERT INTO lamp_offerings (name_on_lamp, dedication, email, whatsapp, screenshot_filename, screenshot_mime, screenshot)
      SELECT name, ${dedication || null}, ${email}, ${whatsapp || null}, ${filename}, ${mime}, ${hex}
      FROM unnest(${names}::text[]) WITH ORDINALITY AS offerings(name, position)
      ORDER BY position
      RETURNING id
    `) as { id: number }[];
    ids = rows.map((row) => row.id);
  } catch (error) {
    console.error("lamp insert failed", error);
    return json({ ok: false, error: "Could not save your offering. Please try again." }, 500);
  }

  const emailSent = await sendLampEmail(
    { firstId: ids[0], names, dedication, email, whatsapp },
    { buffer: bytes, mime, filename }
  );
  try {
    const sql = getSql();
    await sql`UPDATE lamp_offerings SET email_sent = ${emailSent} WHERE id = ANY(${ids})`;
  } catch (error) {
    console.error("lamp flag update failed", error);
  }

  return json({ ok: true, ids, names });
}

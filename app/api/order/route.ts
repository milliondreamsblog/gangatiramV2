import sharp from "sharp";
import { paymentProofError } from "@/lib/payment";
import { getSql, json, badRequest, fieldStr } from "@/lib/server/db";
import { sendOrderEmail, sendOrderWhatsApp } from "@/lib/server/notify";

/**
 * Order flow, durability-first:
 *   1. validate
 *   2. compress the payment screenshot (images → ≤1200px JPEG, ~10x smaller,
 *      so free-tier Postgres holds many thousands of orders)
 *   3. INSERT into Neon — the source of truth; only this decides success
 *   4. notify (email with proof attached, WhatsApp ping) — fail-soft
 *   5. record which alerts went out on the order row
 */
export async function POST(request: Request): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequest("Expected multipart form data.");
  }

  const name = fieldStr(form.get("name"), 200);
  const phone = fieldStr(form.get("phone"), 20);
  const address = fieldStr(form.get("address"));
  const pincode = fieldStr(form.get("pincode"), 20);
  const country = fieldStr(form.get("country"), 100);
  const state = fieldStr(form.get("state"), 100);
  const screenshot = form.get("screenshot");

  if (!name || !address || !pincode || !country || !state) {
    return badRequest("All delivery fields are required.");
  }
  if (!/^\d{10,15}$/.test(phone.replace(/[^\d]/g, ""))) {
    return badRequest("A working phone number is required — we use it for delivery updates.");
  }
  if (!(screenshot instanceof File) || screenshot.size === 0) {
    return badRequest("Payment screenshot is required.");
  }
  const proofError = paymentProofError(screenshot);
  if (proofError) return badRequest(proofError);

  // Compress images; PDFs pass through untouched.
  let bytes = Buffer.from(await screenshot.arrayBuffer());
  let mime = screenshot.type;
  let filename = screenshot.name.slice(0, 300);
  if (/^image\//i.test(mime)) {
    try {
      bytes = Buffer.from(
        await sharp(bytes)
          .rotate() // respect EXIF orientation from phone cameras
          .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 72, mozjpeg: true })
          .toBuffer()
      );
      mime = "image/jpeg";
      filename = filename.replace(/\.\w+$/, "") + ".jpg";
    } catch (error) {
      // Unreadable image (e.g. exotic HEIC build) — store the original bytes.
      console.error("screenshot compression failed, storing original", error);
    }
  }

  let orderId: number;
  try {
    const sql = getSql();
    const rows = (await sql`
      INSERT INTO book_orders (name, phone, address, pincode, country, state, screenshot_filename, screenshot_mime, screenshot)
      VALUES (${name}, ${phone}, ${address}, ${pincode}, ${country}, ${state}, ${filename}, ${mime}, ${"\\x" + bytes.toString("hex")})
      RETURNING id
    `) as { id: number }[];
    orderId = rows[0].id;
  } catch (error) {
    console.error("order insert failed", error);
    return json({ ok: false, error: "Could not save your order. Please try again." }, 500);
  }

  // Notifications — fail-soft, flags recorded for the admin panel.
  const order = { orderId, name, phone, address, pincode, state, country };
  const [emailSent, whatsappSent] = await Promise.all([
    sendOrderEmail(order, { buffer: bytes, mime, filename }),
    sendOrderWhatsApp(order),
  ]);
  try {
    const sql = getSql();
    await sql`UPDATE book_orders SET email_sent = ${emailSent}, whatsapp_sent = ${whatsappSent} WHERE id = ${orderId}`;
  } catch (error) {
    console.error("notification flag update failed", error);
  }

  return json({ ok: true, orderId });
}

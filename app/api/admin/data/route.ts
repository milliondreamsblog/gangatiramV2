import { getSql, json } from "@/lib/server/db";
import { isAuthed, unauthorized } from "@/lib/server/auth";

export async function GET(request: Request): Promise<Response> {
  if (!isAuthed(request)) return unauthorized();

  try {
    const sql = getSql();
    const [orders, volunteers, contributions, lamps] = await Promise.all([
      sql`
        SELECT id, name, address, pincode, country, state, screenshot_filename, status, email_sent, whatsapp_sent, created_at
        FROM book_orders ORDER BY created_at DESC LIMIT 500
      `,
      sql`
        SELECT id, name, email, place, interest, availability, message, created_at
        FROM volunteer_signups ORDER BY created_at DESC LIMIT 500
      `,
      sql`
        SELECT id, name, email, amount, payment_method, message, created_at
        FROM contributions ORDER BY created_at DESC LIMIT 500
      `,
      sql`
        SELECT id, name_on_lamp, dedication, email, whatsapp, screenshot_filename, status, email_sent, whatsapp_sent, created_at
        FROM lamp_offerings ORDER BY created_at DESC LIMIT 1000
      `,
    ]);
    return json({ ok: true, orders, volunteers, contributions, lamps });
  } catch (error) {
    console.error("admin data fetch failed", error);
    return json({ ok: false, error: "Could not load data." }, 500);
  }
}

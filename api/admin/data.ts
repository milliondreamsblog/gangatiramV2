import { getSql, json } from '../_db.js';
import { isAuthed, unauthorized } from '../_auth.js';

export async function GET(request: Request): Promise<Response> {
  if (!isAuthed(request)) return unauthorized();

  try {
    const sql = getSql();
    const [orders, volunteers, contributions] = await Promise.all([
      sql`
        SELECT id, name, address, pincode, country, state, screenshot_filename, status, created_at
        FROM book_orders ORDER BY created_at DESC LIMIT 500
      `,
      sql`
        SELECT id, name, email, place, interest, availability, message, created_at
        FROM volunteer_signups ORDER BY created_at DESC LIMIT 500
      `,
      sql`
        SELECT id, name, email, amount, payment_method, message, created_at
        FROM contributions ORDER BY created_at DESC LIMIT 500
      `
    ]);
    return json({ ok: true, orders, volunteers, contributions });
  } catch (error) {
    console.error('admin data fetch failed', error);
    return json({ ok: false, error: 'Could not load data.' }, 500);
  }
}

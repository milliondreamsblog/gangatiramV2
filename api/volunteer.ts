import { getSql, json, badRequest } from './_db.js';

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Expected a JSON body.');
  }

  const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const name = str(body.name, 200);
  const email = str(body.email, 320);
  const place = str(body.place, 200);
  const interest = str(body.interest, 100);
  const availability = str(body.availability, 100);
  const message = str(body.message);

  if (!name || !email || !place || !interest || !availability) {
    return badRequest('Name, email, place, interest, and availability are required.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest('Please provide a valid email address.');
  }

  try {
    const sql = getSql();
    await sql`
      INSERT INTO volunteer_signups (name, email, place, interest, availability, message)
      VALUES (${name}, ${email}, ${place}, ${interest}, ${availability}, ${message})
    `;
    return json({ ok: true });
  } catch (error) {
    console.error('volunteer insert failed', error);
    return json({ ok: false, error: 'Could not save your registration. Please try again.' }, 500);
  }
}

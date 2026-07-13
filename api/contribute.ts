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
  const amount = str(body.amount, 50);
  const paymentMethod = str(body.paymentMethod, 50);
  const message = str(body.message);

  if (!name || !email || !amount || !paymentMethod) {
    return badRequest('Name, email, amount, and payment method are required.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest('Please provide a valid email address.');
  }

  try {
    const sql = getSql();
    await sql`
      INSERT INTO contributions (name, email, amount, payment_method, message)
      VALUES (${name}, ${email}, ${amount}, ${paymentMethod}, ${message})
    `;
    return json({ ok: true });
  } catch (error) {
    console.error('contribution insert failed', error);
    return json({ ok: false, error: 'Could not save your contribution. Please try again.' }, 500);
  }
}

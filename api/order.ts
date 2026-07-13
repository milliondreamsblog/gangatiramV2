import { getSql, json, badRequest, fieldStr } from './_db.js';

const MAX_SCREENSHOT_BYTES = 4 * 1024 * 1024; // Vercel's request body limit is 4.5 MB
const ALLOWED_MIME = /^(image\/(png|jpe?g|webp|heic|heif)|application\/pdf)$/i;

export async function POST(request: Request): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequest('Expected multipart form data.');
  }

  const name = fieldStr(form.get('name'), 200);
  const address = fieldStr(form.get('address'));
  const pincode = fieldStr(form.get('pincode'), 20);
  const country = fieldStr(form.get('country'), 100);
  const state = fieldStr(form.get('state'), 100);
  const screenshot = form.get('screenshot');

  if (!name || !address || !pincode || !country || !state) {
    return badRequest('All delivery fields are required.');
  }
  if (!(screenshot instanceof File) || screenshot.size === 0) {
    return badRequest('Payment screenshot is required.');
  }
  if (screenshot.size > MAX_SCREENSHOT_BYTES) {
    return badRequest('Screenshot must be under 4 MB.');
  }
  if (!ALLOWED_MIME.test(screenshot.type)) {
    return badRequest('Screenshot must be an image or a PDF.');
  }

  const bytes = Buffer.from(await screenshot.arrayBuffer());

  try {
    const sql = getSql();
    const rows = (await sql`
      INSERT INTO book_orders (name, address, pincode, country, state, screenshot_filename, screenshot_mime, screenshot)
      VALUES (${name}, ${address}, ${pincode}, ${country}, ${state}, ${screenshot.name.slice(0, 300)}, ${screenshot.type}, ${'\\x' + bytes.toString('hex')})
      RETURNING id
    `) as { id: number }[];
    return json({ ok: true, orderId: rows[0].id });
  } catch (error) {
    console.error('order insert failed', error);
    return json({ ok: false, error: 'Could not save your order. Please try again.' }, 500);
  }
}

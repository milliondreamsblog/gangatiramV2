import { getSql, json } from '../_db.js';
import { isAuthed, unauthorized } from '../_auth.js';

export async function GET(request: Request): Promise<Response> {
  if (!isAuthed(request)) return unauthorized();

  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isInteger(id) || id <= 0) {
    return json({ ok: false, error: 'Invalid order id.' }, 400);
  }

  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT screenshot, screenshot_mime, screenshot_filename FROM book_orders WHERE id = ${id}
    `) as { screenshot: unknown; screenshot_mime: string | null; screenshot_filename: string | null }[];
    if (!rows.length || !rows[0].screenshot) {
      return json({ ok: false, error: 'No screenshot for that order.' }, 404);
    }

    const raw = rows[0].screenshot;
    let bytes: Buffer;
    if (Buffer.isBuffer(raw)) {
      bytes = raw;
    } else if (raw instanceof Uint8Array) {
      bytes = Buffer.from(raw);
    } else if (typeof raw === 'string') {
      // Postgres bytea text format: \x-prefixed hex
      bytes = Buffer.from(raw.startsWith('\\x') ? raw.slice(2) : raw, 'hex');
    } else {
      return json({ ok: false, error: 'Unreadable screenshot data.' }, 500);
    }

    return new Response(bytes, {
      status: 200,
      headers: {
        'Content-Type': rows[0].screenshot_mime || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${(rows[0].screenshot_filename || `order-${id}`).replace(/"/g, '')}"`,
        'Cache-Control': 'private, no-store'
      }
    });
  } catch (error) {
    console.error('screenshot fetch failed', error);
    return json({ ok: false, error: 'Could not load screenshot.' }, 500);
  }
}

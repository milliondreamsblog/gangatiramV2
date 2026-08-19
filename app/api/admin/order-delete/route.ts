import { getSql, json, badRequest } from "@/lib/server/db";
import { isAuthed, unauthorized } from "@/lib/server/auth";

/** Permanently remove an order (junk/test rows). The panel confirms first. */
export async function POST(request: Request): Promise<Response> {
  if (!isAuthed(request)) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Expected a JSON body.");
  }

  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) return badRequest("Invalid order id.");

  try {
    const sql = getSql();
    const rows = (await sql`
      DELETE FROM book_orders WHERE id = ${id} RETURNING id
    `) as { id: number }[];
    if (!rows.length) return json({ ok: false, error: "Order not found." }, 404);
    return json({ ok: true });
  } catch (error) {
    console.error("order delete failed", error);
    return json({ ok: false, error: "Could not delete order." }, 500);
  }
}

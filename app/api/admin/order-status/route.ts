import { getSql, json, badRequest } from "@/lib/server/db";
import { isAuthed, unauthorized } from "@/lib/server/auth";

const STATUSES = ["new", "verified", "shipped"] as const;

/** Move an order through the fulfilment flow: new → verified → shipped. */
export async function POST(request: Request): Promise<Response> {
  if (!isAuthed(request)) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Expected a JSON body.");
  }

  const id = Number(body.id);
  const status = String(body.status ?? "");
  if (!Number.isInteger(id) || id <= 0) return badRequest("Invalid order id.");
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return badRequest("Status must be one of: " + STATUSES.join(", "));
  }

  try {
    const sql = getSql();
    const rows = (await sql`
      UPDATE book_orders SET status = ${status} WHERE id = ${id} RETURNING id
    `) as { id: number }[];
    if (!rows.length) return json({ ok: false, error: "Order not found." }, 404);
    return json({ ok: true });
  } catch (error) {
    console.error("status update failed", error);
    return json({ ok: false, error: "Could not update status." }, 500);
  }
}

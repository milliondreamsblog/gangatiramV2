import { getSql, json } from "@/lib/server/db";

/**
 * Weekly order backup — Vercel Cron hits this every Sunday and the full
 * orders table (minus screenshot bytes) lands in the notify inbox as CSV.
 * Third copy of the data: Neon has it, Gmail has each order individually,
 * and this snapshot has the whole table.
 */
export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!key || !to) return json({ ok: false, error: "Notify env not configured" }, 503);

  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT id, name, address, pincode, state, country, status, email_sent, whatsapp_sent, created_at
      FROM book_orders ORDER BY id
    `) as Record<string, unknown>[];

    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = "id,name,address,pincode,state,country,status,email_sent,whatsapp_sent,created_at";
    const csv = [
      header,
      ...rows.map((r) => header.split(",").map((c) => esc(r[c])).join(",")),
    ].join("\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Ganga Tiram Orders <onboarding@resend.dev>",
        to: [to],
        subject: `Weekly order backup — ${rows.length} orders`,
        text: `Attached: the full book_orders table as CSV (${rows.length} rows). Screenshots live in Neon and in each order's alert email.`,
        attachments: [
          {
            filename: `gangatiram-orders-backup.csv`,
            content: Buffer.from(csv, "utf8").toString("base64"),
          },
        ],
      }),
    });
    return json({ ok: res.ok, rows: rows.length });
  } catch (error) {
    console.error("backup cron failed", error);
    return json({ ok: false, error: "Backup failed." }, 500);
  }
}

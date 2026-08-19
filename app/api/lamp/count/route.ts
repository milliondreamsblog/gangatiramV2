import { getSql, json } from "@/lib/server/db";

export const dynamic = "force-dynamic";

/**
 * Public feed for the lamp page: how many diyas are pledged, and the most
 * recent names — shown as chips and on the procession belt. Names appear on
 * the ghat by design, so listing them here is the point, not a leak.
 */
export async function GET(): Promise<Response> {
  try {
    const sql = getSql();
    const [countRows, nameRows] = await Promise.all([
      sql`SELECT count(*)::int AS count FROM lamp_offerings`,
      sql`SELECT id, name_on_lamp FROM lamp_offerings ORDER BY id DESC LIMIT 14`,
    ]);
    return new Response(
      JSON.stringify({
        ok: true,
        count: (countRows as { count: number }[])[0]?.count ?? 0,
        names: (nameRows as { id: number; name_on_lamp: string }[]).map((r) => ({
          id: r.id,
          name: r.name_on_lamp,
        })),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("lamp count failed", error);
    return json({ ok: false, count: 0, names: [] }, 500);
  }
}

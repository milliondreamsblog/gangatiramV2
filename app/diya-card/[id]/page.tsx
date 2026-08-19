import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSql } from "@/lib/server/db";
import { DiyaCardDownload } from "@/components/sections/lamp/DiyaCardDownload";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Diya Card — Dev Deepawali",
  robots: { index: false },
};

/** One named diya's shareable card. Names are public by design — the same
 *  name already rides the procession on /dev-deepawali. */
export default async function DiyaCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  let name = "";
  let issuedOn = "";
  let dedication: string | null = null;
  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT name_on_lamp, dedication, created_at FROM lamp_offerings WHERE id = ${id}
    `) as { name_on_lamp: string; dedication: string | null; created_at: string }[];
    if (!rows.length) notFound();
    name = rows[0].name_on_lamp;
    dedication = rows[0].dedication;
    issuedOn = new Date(rows[0].created_at)
      .toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      .toUpperCase();
  } catch (error) {
    console.error("diya card lookup failed", error);
    notFound();
  }

  return <DiyaCardDownload name={name} diyaNo={id} issuedOn={issuedOn} dedication={dedication} />;
}

// One-off, idempotent: schema for the /diya QR checkout.
//   gotra  — optional; null means "not known" (priest uses Kashyap)
//   email  — optional; /diya collects WhatsApp only
// Run: node scripts/migrate-diya-qr.mjs   (reads DATABASE_URL from .env.local)
import fs from "node:fs";
import { neon } from "@neondatabase/serverless";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split(/\r?\n/).filter((l) => l.includes("=")).map((l) => {
    const i = l.indexOf("=");
    return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, "")];
  })
);
const sql = neon(process.env.DATABASE_URL || env.DATABASE_URL);

await sql`ALTER TABLE lamp_offerings ADD COLUMN IF NOT EXISTS gotra text`;
await sql`ALTER TABLE lamp_offerings ALTER COLUMN email DROP NOT NULL`;
console.log(await sql`
  SELECT column_name, is_nullable FROM information_schema.columns
  WHERE table_name = 'lamp_offerings' AND column_name IN ('gotra', 'email')
`);

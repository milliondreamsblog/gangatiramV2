// One-time database setup for the Ganga Tiram forms.
// Usage: node scripts/init-db.mjs   (reads DATABASE_URL from .env.local)
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL missing — run `vercel env pull .env.local` first.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS book_orders (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    pincode TEXT NOT NULL,
    country TEXT NOT NULL,
    state TEXT NOT NULL,
    screenshot_filename TEXT,
    screenshot_mime TEXT,
    screenshot BYTEA,
    status TEXT NOT NULL DEFAULT 'pending_review',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS volunteer_signups (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    place TEXT NOT NULL,
    interest TEXT NOT NULL,
    availability TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS contributions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    amount TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

const tables = await sql`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' ORDER BY table_name
`;
console.log('Tables ready:', tables.map((t) => t.table_name).join(', '));

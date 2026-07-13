import { neon } from '@neondatabase/serverless';

let _sql: ReturnType<typeof neon> | null = null;

export function getSql() {
  if (!_sql) _sql = neon(process.env.DATABASE_URL!);
  return _sql;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function badRequest(message: string): Response {
  return json({ ok: false, error: message }, 400);
}

export function fieldStr(value: FormDataEntryValue | null | undefined, max = 2000): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

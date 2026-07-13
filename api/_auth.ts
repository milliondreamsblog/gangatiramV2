import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { json } from './_db.js';

const SESSION_HOURS = 12;

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET!;
}

function hmac(value: string): string {
  return createHmac('sha256', secret()).update(value).digest('hex');
}

/** Constant-time comparison of two strings of any length. */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function makeSessionCookie(): string {
  const exp = Date.now() + SESSION_HOURS * 3600 * 1000;
  const token = `${exp}.${hmac(String(exp))}`;
  return `admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_HOURS * 3600}`;
}

export function clearSessionCookie(): string {
  return 'admin_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0';
}

export function isAuthed(request: Request): boolean {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)admin_session=([^;]+)/);
  if (!match) return false;
  const [expStr, sig] = match[1].split('.');
  const exp = Number(expStr);
  if (!exp || !sig || Date.now() > exp) return false;
  return safeEqual(sig, hmac(expStr));
}

export function unauthorized(): Response {
  return json({ ok: false, error: 'Unauthorized' }, 401);
}

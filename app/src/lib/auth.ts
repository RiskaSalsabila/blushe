import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getDb } from './db';

const SESSION_COOKIE_NAME = 'blushe_admin_session';

export async function verifyAdminCredentials(username: string, passwordPlain: string): Promise<boolean> {
  const db = getDb();
  const user = db.prepare('SELECT password_hash FROM admin_users WHERE username = ? AND is_active = 1').get(username) as { password_hash: string } | undefined;

  if (!user) return false;
  return bcrypt.compareSync(passwordPlain, user.password_hash);
}

export async function setAdminSession(username: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, `session_${username}_${Date.now()}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 jam
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return Boolean(session && session.value);
}

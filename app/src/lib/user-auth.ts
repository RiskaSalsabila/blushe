import { cookies } from 'next/headers';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getDb } from './db';

export const USER_SESSION_COOKIE_NAME = 'blushe_user_session';
export const PRIVACY_NOTICE_VERSION = 'v1.0';

const SESSION_SECRET = process.env.SESSION_SECRET || 'blushe_user_auth_secret_key_skripsi_2026';

export interface UserSessionPayload {
  userId: number;
  email: string;
  displayName: string;
  createdAt: number;
}

export interface SanitizedUser {
  id: number;
  displayName: string;
  email: string;
}

/**
 * Sign session data with HMAC SHA-256
 */
export function signToken(payload: UserSessionPayload): string {
  const json = JSON.stringify(payload);
  const base64Data = Buffer.from(json, 'utf-8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(base64Data)
    .digest('base64url');
  return `${base64Data}.${signature}`;
}

/**
 * Verify signed token and return payload if valid
 */
export function verifyToken(token: string): UserSessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [base64Data, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(base64Data)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const json = Buffer.from(base64Data, 'base64url').toString('utf-8');
    return JSON.parse(json) as UserSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Hash password securely with bcrypt
 */
export function hashPassword(plainText: string): string {
  return bcrypt.hashSync(plainText, 10);
}

/**
 * Compare plain password against bcrypt hash
 */
export function verifyPassword(plainText: string, hash: string): boolean {
  return bcrypt.compareSync(plainText, hash);
}

/**
 * Set user session cookie (HttpOnly, Secure in prod, SameSite Lax)
 */
export async function setUserSession(user: { id: number; email: string; display_name: string }) {
  const payload: UserSessionPayload = {
    userId: user.id,
    email: user.email,
    displayName: user.display_name,
    createdAt: Date.now(),
  };

  const token = signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(USER_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}

/**
 * Clear user session cookie
 */
export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_SESSION_COOKIE_NAME);
}

/**
 * Get current authenticated user from session cookie
 * Never returns password or password_hash!
 */
export async function getCurrentUser(): Promise<SanitizedUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(USER_SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) return null;

    const payload = verifyToken(sessionCookie.value);
    if (!payload || !payload.userId) return null;

    // Pastikan user masih ada di database
    const db = getDb();
    const user = db
      .prepare('SELECT id, display_name, email FROM users WHERE id = ?')
      .get(payload.userId) as { id: number; display_name: string; email: string } | undefined;

    if (!user) return null;

    return {
      id: user.id,
      displayName: user.display_name,
      email: user.email,
    };
  } catch {
    return null;
  }
}

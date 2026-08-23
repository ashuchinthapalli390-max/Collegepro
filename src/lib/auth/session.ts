import { randomBytes, createHmac } from 'node:crypto';

const SESSION_SECRET = process.env.SESSION_HMAC_SECRET || 'nec_session_default_hmac_secret_2026_super_secure';

/**
 * Generate a cryptographically random 32-byte opaque base64url session token
 */
export function createSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

/**
 * Compute the HMAC-SHA256 digest of the session token for database lookup
 */
export function hashSessionToken(token: string): string {
  return createHmac('sha256', SESSION_SECRET)
    .update(token)
    .digest('hex');
}

/**
 * Cookie options for pre-auth cookie (temporary 10-minute window for OTP challenge)
 */
export const PREAUTH_COOKIE_NAME = 'nec_preauth';
export const getPreAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: Number(process.env.PREAUTH_SESSION_TTL_SECONDS) || 600, // 10 minutes
});

/**
 * Cookie options for verified session cookie (12 hours normal, 7 days remember-device)
 */
export const SESSION_COOKIE_NAME = 'nec_session';
export const getSessionCookieOptions = (rememberDevice: boolean = false) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: rememberDevice 
    ? (Number(process.env.REMEMBER_SESSION_DAYS) || 7) * 24 * 60 * 60 
    : (Number(process.env.PORTAL_SESSION_TTL_HOURS) || 12) * 60 * 60,
});

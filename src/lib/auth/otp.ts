import { randomInt, createHmac, timingSafeEqual } from 'node:crypto';

const OTP_SECRET = process.env.OTP_HMAC_SECRET || 'nec_otp_default_hmac_secret_2026_super_secure';

/**
 * Generate a cryptographically secure 6-digit integer OTP string (100000 - 999999)
 */
export function generateOtp(): string {
  return randomInt(100000, 1000000).toString();
}

/**
 * Create an HMAC-SHA256 digest of the challenge ID and OTP
 */
export function hashOtp(challengeId: string, otp: string): string {
  return createHmac('sha256', OTP_SECRET)
    .update(`${challengeId}:${otp.trim()}`)
    .digest('hex');
}

/**
 * Constant-time string comparison to prevent side-channel timing attacks
 */
export function safeCompare(a: string, b: string): boolean {
  try {
    const left = Buffer.from(a, 'hex');
    const right = Buffer.from(b, 'hex');
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

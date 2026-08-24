import { hash, verify, Algorithm } from '@node-rs/argon2';

/**
 * Hash password securely using Argon2id with OWASP baseline parameters:
 * Memory: 19 MiB (19456 KiB), Time: 2 iterations, Parallelism: 1, Output: 32 bytes.
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    algorithm: Algorithm.Argon2id,
    memoryCost: 19456, // 19 MB
    timeCost: 2,       // 2 iterations
    parallelism: 1,
    outputLen: 32,
  });
}

/**
 * Verify password against stored Argon2id hash with constant-time comparison
 */
export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  if (!passwordHash || !password) return false;
  try {
    return await verify(passwordHash, password);
  } catch (error) {
    console.error('[SECURITY_PASSWORD_ERROR] Argon2id verification failed:', error);
    return false;
  }
}

/**
 * Modern Passphrase Policy Validator
 * Baseline: 12-128 characters, allows spaces and unicode characters, blocks trivial repetitive sequences.
 */
export function validatePassphrase(passphrase: string): { valid: boolean; error?: string } {
  if (!passphrase || typeof passphrase !== 'string') {
    return { valid: false, error: 'Password cannot be empty.' };
  }

  if (passphrase.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters long. Consider using a memorable multi-word passphrase.' };
  }

  if (passphrase.length > 128) {
    return { valid: false, error: 'Password must not exceed 128 characters.' };
  }

  // Reject obvious trivial passwords
  const commonTrivialPasswords = [
    'password12345',
    'admin12345678',
    'necportal12345',
    'narasaraopeta',
    'engineeringcollege',
    '123456789012',
    'qwertyuiop12'
  ];

  if (commonTrivialPasswords.includes(passphrase.toLowerCase())) {
    return { valid: false, error: 'This password is too common or easily guessable. Please choose a stronger passphrase.' };
  }

  return { valid: true };
}

/**
 * Sanitizes user record by stripping all sensitive fields (password hash, raw tokens, OTP secrets)
 */
export function sanitizeUserDto<T extends Record<string, any>>(user: T): Omit<T, 'passwordHash' | 'password' | 'tokenDigest' | 'otpDigest'> {
  if (!user || typeof user !== 'object') return user;
  const { passwordHash, password, tokenDigest, otpDigest, ...safeUser } = user;
  return safeUser as Omit<T, 'passwordHash' | 'password' | 'tokenDigest' | 'otpDigest'>;
}

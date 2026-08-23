import { hash, verify, Algorithm } from '@node-rs/argon2';

/**
 * Hash password securely using Argon2id with high-memory cost
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
  try {
    return await verify(passwordHash, password);
  } catch (error) {
    console.error('Argon2id password verification error:', error);
    return false;
  }
}

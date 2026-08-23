import { Resend } from 'resend';

// Validate environment variables server-side without exposing values
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn('[SECURITY] RESEND_API_KEY is not defined in environment variables. Outgoing emails will be simulated.');
}

export const resend = new Resend(apiKey || 're_placeholder_dev_key');

export const AUTH_EMAIL_FROM = process.env.AUTH_EMAIL_FROM || 'NEC Secure Portal <security@codeaxisapply.xyz>';
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@codeaxisapply.xyz';

/**
 * Validate Resend configuration health on startup
 */
export function validateEmailConfig(): { valid: boolean; from: string; hasKey: boolean } {
  return {
    valid: Boolean(apiKey && AUTH_EMAIL_FROM),
    from: AUTH_EMAIL_FROM,
    hasKey: Boolean(apiKey && apiKey.startsWith('re_'))
  };
}

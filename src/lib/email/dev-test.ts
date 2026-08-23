import { sendLoginOtpEmail } from './service.ts';
import { validateEmailConfig } from './resend.ts';

/**
 * Development-only test function to verify Resend dispatch connectivity
 * Strictly disabled in production
 */
export async function devTestEmailDispatch(recipientEmail: string) {
  if (process.env.NODE_ENV === 'production') {
    return { error: 'Test dispatch disabled in production.' };
  }

  const config = validateEmailConfig();
  if (!config.valid) {
    return { error: 'Email configuration is incomplete.' };
  }

  return await sendLoginOtpEmail({
    to: recipientEmail,
    code: '849201',
    expiresMinutes: 5,
    recipientName: 'Development Test Recipient'
  });
}

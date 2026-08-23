import { resend, AUTH_EMAIL_FROM, SUPPORT_EMAIL } from './resend.ts';
import { LoginOtpEmailTemplate } from './templates/login-otp.tsx';
import { AccountSetupEmailTemplate } from './templates/account-setup.tsx';
import { PasswordResetEmailTemplate } from './templates/password-reset.tsx';
import { PasswordChangedEmailTemplate } from './templates/password-changed.tsx';
import { SecurityAlertEmailTemplate } from './templates/security-alert.tsx';

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * 1. Dispatch Login 6-Digit OTP Email via Resend
 * Strictly waits for Resend API response.
 * Never logs or prints plaintext OTP in exceptions.
 */
export async function sendLoginOtpEmail({
  to,
  code,
  expiresMinutes = 5,
  recipientName = 'Faculty / Staff Member',
  portalUserId = null
}: {
  to: string;
  code: string;
  expiresMinutes?: number;
  recipientName?: string;
  portalUserId?: string | null;
}): Promise<EmailDispatchResult> {
  const recipientDomain = to.split('@')[1] || 'unknown';

  try {
    const { data, error } = await resend.emails.send({
      from: AUTH_EMAIL_FROM,
      to,
      subject: 'Your NEC verification code',
      react: LoginOtpEmailTemplate({ code, expiresMinutes, recipientName })
    });

    if (error) {
      console.error(`[EMAIL_DELIVERY_FAILED] Resend rejected dispatch. Domain: ${recipientDomain}. Reason: ${error.message}`);
      return { 
        success: false, 
        error: 'Unable to send verification code. Please try again.' 
      };
    }

    console.log(`[EMAIL_DELIVERY_SUCCESS] OTP email accepted by provider. ProviderMessageId=${data?.id}`);
    return { success: true, messageId: data?.id };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown provider error';
    console.error(`[EMAIL_DELIVERY_EXCEPTION] Delivery error: ${errMsg}`);
    return { 
      success: false, 
      error: 'Unable to send verification code. Please try again.' 
    };
  }
}

/**
 * 2. Dispatch Account Setup Invitation Email with one-time token
 */
export async function sendAccountSetupEmail({
  to,
  setupUrl,
  recipientName = 'Faculty Member',
  departmentName = 'Academic Department',
  roleTitle = 'Faculty'
}: {
  to: string;
  setupUrl: string;
  recipientName?: string;
  departmentName?: string;
  roleTitle?: string;
}): Promise<EmailDispatchResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: AUTH_EMAIL_FROM,
      to,
      subject: 'Set your NEC Portal password',
      react: AccountSetupEmailTemplate({ recipientName, setupUrl, departmentName, roleTitle })
    });

    if (error) {
      console.error('[EMAIL_DELIVERY_ERROR] Resend Account Setup dispatch failed');
      return { success: false, error: 'Unable to dispatch account activation email.' };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('[EMAIL_DELIVERY_EXCEPTION] Account setup email dispatch error:', err instanceof Error ? err.message : 'Unknown');
    return { success: false, error: 'Unable to dispatch account activation email.' };
  }
}

/**
 * 3. Dispatch Password Reset Link Email
 */
export async function sendPasswordResetEmail({
  to,
  resetUrl,
  recipientName = 'Faculty / Staff Member',
  expiresMinutes = 30
}: {
  to: string;
  resetUrl: string;
  recipientName?: string;
  expiresMinutes?: number;
}): Promise<EmailDispatchResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: AUTH_EMAIL_FROM,
      to,
      subject: 'Reset your NEC Portal password',
      react: PasswordResetEmailTemplate({ recipientName, resetUrl, expiresMinutes })
    });

    if (error) {
      console.error('[EMAIL_DELIVERY_ERROR] Resend Password Reset dispatch failed');
      return { success: false, error: 'Unable to send password reset email.' };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('[EMAIL_DELIVERY_EXCEPTION] Password reset email dispatch error:', err instanceof Error ? err.message : 'Unknown');
    return { success: false, error: 'Unable to send password reset email.' };
  }
}

/**
 * 4. Dispatch Password Changed Security Notice
 */
export async function sendPasswordChangedEmail({
  to,
  recipientName = 'Faculty / Staff Member',
  timestamp = new Date().toUTCString()
}: {
  to: string;
  recipientName?: string;
  timestamp?: string;
}): Promise<EmailDispatchResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: AUTH_EMAIL_FROM,
      to,
      subject: 'Your NEC Portal password was changed',
      react: PasswordChangedEmailTemplate({ recipientName, timestamp, supportEmail: SUPPORT_EMAIL })
    });

    if (error) {
      return { success: false, error: 'Failed to dispatch security notification.' };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: 'Failed to dispatch security notification.' };
  }
}

/**
 * 5. Dispatch Security Alert Notification
 */
export async function sendSecurityAlertEmail({
  to,
  title = 'NEC Portal Security Alert',
  message,
  eventType = 'SECURITY_ALERT',
  ipAddress = '192.168.1.1',
  recipientName = 'User'
}: {
  to: string;
  title?: string;
  message: string;
  eventType?: string;
  ipAddress?: string;
  recipientName?: string;
}): Promise<EmailDispatchResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: AUTH_EMAIL_FROM,
      to,
      subject: `[Security Alert] ${title}`,
      react: SecurityAlertEmailTemplate({
        recipientName,
        title,
        message,
        eventType,
        timestamp: new Date().toUTCString(),
        ipAddress,
        supportEmail: SUPPORT_EMAIL
      })
    });

    if (error) {
      return { success: false, error: 'Failed to dispatch security alert.' };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: 'Failed to dispatch security alert.' };
  }
}

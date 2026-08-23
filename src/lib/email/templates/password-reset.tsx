import React from 'react';

interface PasswordResetEmailProps {
  recipientName?: string;
  resetUrl: string;
  expiresMinutes?: number;
}

export const PasswordResetEmailTemplate: React.FC<PasswordResetEmailProps> = ({
  recipientName = 'Faculty / Staff Member',
  resetUrl = '#',
  expiresMinutes = 30
}) => {
  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#F8FAFC',
      padding: '40px 20px',
      color: '#0F172A'
    }}>
      <div style={{
        maxWidth: '560px',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #E2E8F0'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#070F1E',
          padding: '28px 24px',
          textAlign: 'center',
          borderBottom: '3px solid #D4AF37'
        }}>
          <h2 style={{
            margin: 0,
            color: '#FFFFFF',
            fontSize: '17px',
            letterSpacing: '1.2px',
            fontFamily: 'Georgia, serif',
            fontWeight: 800
          }}>
            NARASARAOPETA ENGINEERING COLLEGE
          </h2>
          <div style={{ color: '#D4AF37', fontSize: '11px', marginTop: '6px', fontWeight: 600, letterSpacing: '0.6px' }}>
            AUTONOMOUS • ACADEMIC & RESEARCH PORTAL
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '36px 32px' }}>
          <h3 style={{ fontSize: '19px', color: '#0B192C', marginTop: 0, marginBottom: '12px', fontWeight: 700 }}>
            Password Reset Request
          </h3>

          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px 0' }}>
            Hello {recipientName},<br />
            We received a request to reset the password for your NEC portal account. Click the button below to choose a new password:
          </p>

          {/* Reset Button */}
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <a
              href={resetUrl}
              style={{
                backgroundColor: '#0B192C',
                color: '#F1C40F',
                padding: '14px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '15px',
                display: 'inline-block',
                border: '1.5px solid #D4AF37',
                boxShadow: '0 4px 12px rgba(11, 25, 44, 0.2)'
              }}
            >
              Reset Your Password
            </a>
          </div>

          <div style={{
            backgroundColor: '#FEF3C7',
            borderLeft: '4px solid #D97706',
            padding: '12px 16px',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#92400E',
            marginBottom: '24px'
          }}>
            ⏱️ This password reset link expires in <strong>{expiresMinutes} minutes</strong>. If you did not request a password reset, please ignore this email or notify security if you suspect unauthorized activity.
          </div>

          <p style={{ color: '#94A3B8', fontSize: '12px', lineHeight: '1.5', margin: 0, wordBreak: 'break-all' }}>
            Link URL: <span style={{ color: '#2B5784' }}>{resetUrl}</span>
          </p>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: '#F1F5F9',
          padding: '18px 32px',
          textAlign: 'center',
          fontSize: '11px',
          color: '#64748B',
          borderTop: '1px solid #E2E8F0'
        }}>
          Narasaraopeta Engineering College (Autonomous) • Security Operations Center
        </div>
      </div>
    </div>
  );
};

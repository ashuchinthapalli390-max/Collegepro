import React from 'react';

interface LoginOtpEmailProps {
  fullName?: string;
  code: string;
  expiresMinutes?: number;
}

export const LoginOtpEmail: React.FC<LoginOtpEmailProps> = ({
  fullName = 'Faculty / Staff Member',
  code = '123456',
  expiresMinutes = 5
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
          padding: '28px',
          textAlign: 'center',
          borderBottom: '3px solid #D4AF37'
        }}>
          <h2 style={{
            margin: 0,
            color: '#FFFFFF',
            fontSize: '18px',
            letterSpacing: '1px',
            fontFamily: 'Georgia, serif'
          }}>
            NARASARAOPETA ENGINEERING COLLEGE
          </h2>
          <div style={{ color: '#D4AF37', fontSize: '12px', marginTop: '6px', fontWeight: 600, letterSpacing: '0.5px' }}>
            AUTONOMOUS • ACADEMIC & RESEARCH PORTAL
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '36px 32px' }}>
          <h3 style={{ fontSize: '20px', color: '#0B192C', marginTop: 0, marginBottom: '12px', fontWeight: 700 }}>
            Secure Portal Verification
          </h3>

          <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
            Hello {fullName},<br />
            A sign-in attempt was initiated for your authorized NEC portal account. Use the 6-digit verification code below to complete your login:
          </p>

          {/* OTP Code Display Box */}
          <div style={{
            backgroundColor: '#0B192C',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            margin: '28px 0',
            border: '1.5px solid #D4AF37'
          }}>
            <div style={{
              fontSize: '38px',
              fontWeight: 800,
              letterSpacing: '10px',
              color: '#F1C40F',
              fontFamily: 'monospace'
            }}>
              {code}
            </div>
            <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '8px' }}>
              Valid for {expiresMinutes} minutes • Single-use only
            </div>
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
            🔒 <strong>Security Warning:</strong> Never share this code with anyone. NEC administrators will never ask for your verification code or password.
          </div>

          <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
            If you did not attempt to sign in to the NEC Academic & Research Portal, please contact the institution IT helpdesk immediately at <a href="mailto:support@nrtec.in" style={{ color: '#0B192C', fontWeight: 600 }}>support@nrtec.in</a>.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: '#F1F5F9',
          padding: '20px 32px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#64748B',
          borderTop: '1px solid #E2E8F0'
        }}>
          Narasaraopeta Engineering College (Autonomous)<br />
          Kotappakonda Road, Yellamanda (P.O), Narasaraopet, Palnadu Dist., AP - 522601
        </div>
      </div>
    </div>
  );
};

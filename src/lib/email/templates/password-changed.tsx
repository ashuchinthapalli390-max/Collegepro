import React from 'react';

interface PasswordChangedEmailProps {
  recipientName?: string;
  timestamp?: string;
  supportEmail?: string;
}

export const PasswordChangedEmailTemplate: React.FC<PasswordChangedEmailProps> = ({
  recipientName = 'Faculty / Staff Member',
  timestamp = new Date().toUTCString(),
  supportEmail = 'support@codeaxisapply.xyz'
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
            Your Password Was Changed
          </h3>

          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px 0' }}>
            Hello {recipientName},<br />
            This is a confirmation that the password for your NEC portal account was successfully updated on <strong>{timestamp}</strong>.
          </p>

          <div style={{
            backgroundColor: '#FEF2F2',
            borderLeft: '4px solid #DC2626',
            padding: '14px 16px',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#991B1B',
            margin: '24px 0'
          }}>
            ⚠️ <strong>Did you not perform this change?</strong><br />
            If you did not authorize this password update, your account may be compromised. Please contact the security team immediately at <a href={`mailto:${supportEmail}`} style={{ color: '#991B1B', fontWeight: 700 }}>{supportEmail}</a> to lock your credentials and restore access.
          </div>

          <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
            All previous active web sessions have been terminated for security.
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
          Narasaraopeta Engineering College (Autonomous) • Security Incident Response
        </div>
      </div>
    </div>
  );
};

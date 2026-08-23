import React from 'react';

interface AccountSetupEmailProps {
  recipientName: string;
  setupUrl: string;
  departmentName?: string;
  roleTitle?: string;
  expiresHours?: number;
}

export const AccountSetupEmailTemplate: React.FC<AccountSetupEmailProps> = ({
  recipientName = 'Faculty Member',
  setupUrl = '#',
  departmentName = 'Academic Department',
  roleTitle = 'Faculty',
  expiresHours = 24
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
            Welcome to the NEC Portal
          </h3>

          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px 0' }}>
            Hello {recipientName},<br />
            An institutional account has been provisioned for you as <strong>{roleTitle}</strong> ({departmentName}).
          </p>

          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: '0 0 28px 0' }}>
            Please activate your account and configure your secure personal password using the button below:
          </p>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <a
              href={setupUrl}
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
              Set Your Password
            </a>
          </div>

          <div style={{
            backgroundColor: '#F1F5F9',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#64748B',
            marginBottom: '24px'
          }}>
            ⏱️ This invitation link is unique and will expire in {expiresHours} hours.
          </div>

          <p style={{ color: '#94A3B8', fontSize: '12px', lineHeight: '1.5', margin: 0, wordBreak: 'break-all' }}>
            If the button above does not work, copy and paste this URL into your browser:<br />
            <span style={{ color: '#2B5784' }}>{setupUrl}</span>
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
          Narasaraopeta Engineering College (Autonomous) • IT & Academic Directorate
        </div>
      </div>
    </div>
  );
};

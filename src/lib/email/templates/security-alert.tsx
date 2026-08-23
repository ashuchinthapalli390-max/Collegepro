import React from 'react';

interface SecurityAlertEmailProps {
  recipientName?: string;
  title?: string;
  message?: string;
  eventType?: string;
  timestamp?: string;
  ipAddress?: string;
  supportEmail?: string;
}

export const SecurityAlertEmailTemplate: React.FC<SecurityAlertEmailProps> = ({
  recipientName = 'User',
  title = 'Institutional Security Notification',
  message = 'A critical security action occurred on your NEC portal account.',
  eventType = 'ACCOUNT_EVENT',
  timestamp = new Date().toUTCString(),
  ipAddress = '192.168.1.1',
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
            {title}
          </h3>

          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: '0 0 18px 0' }}>
            Hello {recipientName},<br />
            {message}
          </p>

          {/* Event Details Summary */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '13px',
            color: '#334155',
            margin: '20px 0'
          }}>
            <div style={{ marginBottom: '6px' }}><strong>Event Type:</strong> {eventType}</div>
            <div style={{ marginBottom: '6px' }}><strong>Timestamp:</strong> {timestamp}</div>
            <div><strong>Origin IP:</strong> {ipAddress}</div>
          </div>

          <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.5', margin: '0 0 16px 0' }}>
            If this activity was initiated by you, no further action is required. If you suspect unauthorized access, contact the NEC Security Operations Team immediately at <a href={`mailto:${supportEmail}`} style={{ color: '#0B192C', fontWeight: 700 }}>{supportEmail}</a>.
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
          Narasaraopeta Engineering College (Autonomous) • Automated Security Guard
        </div>
      </div>
    </div>
  );
};

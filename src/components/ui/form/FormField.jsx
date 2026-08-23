import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function FormField({
  label,
  required = false,
  badge = null,
  description = null,
  error = null,
  children,
  style = {}
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%', ...style }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            {label}
            {required && <span style={{ color: '#DC2626' }}>*</span>}
          </label>
          {badge && (
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B' }}>
              {badge}
            </span>
          )}
        </div>
      )}

      {description && (
        <p style={{ fontSize: '0.74rem', color: '#64748B', margin: '0 0 0.15rem 0' }}>
          {description}
        </p>
      )}

      {children}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: '#DC2626', marginTop: '0.15rem' }}>
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

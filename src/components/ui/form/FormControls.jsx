import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input({
  type = 'text',
  error = false,
  className = '',
  style = {},
  icon: Icon = null,
  ...props
}, ref) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {Icon && (
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#94A3B8',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <Icon size={16} />
        </div>
      )}
      <input
        ref={ref}
        type={type}
        className={`nec-form-input ${className}`}
        style={{
          width: '100%',
          height: '46px',
          padding: Icon ? '0 0.85rem 0 2.25rem' : '0 0.85rem',
          borderRadius: '10px',
          border: `1.5px solid ${error ? '#EF4444' : '#CBD5E1'}`,
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          fontSize: '0.82rem',
          outline: 'none',
          boxSizing: 'border-box',
          ...style
        }}
        {...props}
      />
    </div>
  );
});

export const DateInput = forwardRef(function DateInput({
  error = false,
  className = '',
  style = {},
  ...props
}, ref) {
  return (
    <input
      ref={ref}
      type="date"
      className={`nec-form-date ${className}`}
      style={{
        width: '100%',
        height: '46px',
        padding: '0 0.85rem',
        borderRadius: '10px',
        border: `1.5px solid ${error ? '#EF4444' : '#CBD5E1'}`,
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
        fontSize: '0.82rem',
        outline: 'none',
        colorScheme: 'light',
        boxSizing: 'border-box',
        ...style
      }}
      {...props}
    />
  );
});

export const Select = forwardRef(function Select({
  error = false,
  className = '',
  style = {},
  children,
  ...props
}, ref) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <select
        ref={ref}
        className={`nec-form-select ${className}`}
        style={{
          width: '100%',
          height: '46px',
          padding: '0 2rem 0 0.85rem',
          borderRadius: '10px',
          border: `1.5px solid ${error ? '#EF4444' : '#CBD5E1'}`,
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          fontSize: '0.82rem',
          outline: 'none',
          colorScheme: 'light',
          appearance: 'none',
          boxSizing: 'border-box',
          cursor: 'pointer',
          ...style
        }}
        {...props}
      >
        {children}
      </select>
      <div style={{
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        color: '#64748B',
        fontSize: '0.75rem',
        fontWeight: 800
      }}>
        ▼
      </div>
    </div>
  );
});

export const Textarea = forwardRef(function Textarea({
  error = false,
  className = '',
  rows = 3,
  style = {},
  ...props
}, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`nec-form-textarea ${className}`}
      style={{
        width: '100%',
        padding: '0.65rem 0.85rem',
        borderRadius: '10px',
        border: `1.5px solid ${error ? '#EF4444' : '#CBD5E1'}`,
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
        fontSize: '0.82rem',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        resize: 'vertical',
        ...style
      }}
      {...props}
    />
  );
});

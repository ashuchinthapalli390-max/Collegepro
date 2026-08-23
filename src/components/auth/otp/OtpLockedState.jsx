import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function OtpLockedState({ onBackToSignIn }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '1rem 0'
      }}
    >
      <div style={{
        width: '62px',
        height: '62px',
        borderRadius: '50%',
        background: '#FEF2F2',
        border: '2px solid #F87171',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#DC2626',
        marginBottom: '1rem',
        boxShadow: '0 8px 20px rgba(220, 38, 38, 0.15)'
      }}>
        <ShieldAlert size={32} />
      </div>

      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B192C', marginBottom: '0.35rem' }}>
        Too many incorrect attempts
      </div>

      <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0 0 1.5rem 0', maxWidth: '320px', lineHeight: 1.5 }}>
        For your security, this verification attempt has been locked. Please start a new session.
      </p>

      <button
        type="button"
        onClick={onBackToSignIn}
        className="btn-primary"
        style={{
          padding: '0.65rem 1.6rem',
          fontSize: '0.88rem',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem'
        }}
      >
        <ArrowLeft size={14} /> Back to Sign In
      </button>
    </motion.div>
  );
}

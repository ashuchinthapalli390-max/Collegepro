import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Clock, Send } from 'lucide-react';

export default function OtpExpiredState({ onSendNewCode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
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
      {/* Animated Clock Icon */}
      <motion.div
        animate={shouldReduceMotion ? {} : { scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#FEF2F2',
          border: '2px solid #FECACA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#DC2626',
          marginBottom: '1rem'
        }}
      >
        <Clock size={28} />
      </motion.div>

      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0B192C', marginBottom: '0.3rem' }}>
        This code has expired
      </div>

      <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0 0 1.4rem 0', maxWidth: '300px', lineHeight: 1.5 }}>
        Verification codes are valid for 5 minutes. Request a new code to continue.
      </p>

      <button
        type="button"
        onClick={onSendNewCode}
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
        <Send size={14} /> Send new code
      </button>
    </motion.div>
  );
}

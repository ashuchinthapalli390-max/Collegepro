import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function OtpSuccessState() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div style={{
      height: '160px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Expanding Success Ring with SVG Animated Checkmark */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.7, opacity: 0 }}
        animate={{ scale: [0.7, 1.08, 1], opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          width: '74px',
          height: '74px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 28px rgba(16, 185, 129, 0.35)',
          border: '3px solid #ECFDF5'
        }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M20 6L9 17L4 12"
            initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.38, delay: 0.15, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>

      {/* Success Status Labels */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.25 }}
        style={{ textAlign: 'center', marginTop: '1rem' }}
      >
        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#065F46', marginBottom: '0.2rem' }}>
          Verified successfully
        </div>
        <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
          Opening your portal...
        </div>
      </motion.div>
    </div>
  );
}

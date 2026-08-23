import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function OtpResendState({ isSent = false }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div style={{
      height: '160px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      {!isSent ? (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.9, y: 10 }}
          animate={{ scale: [0.9, 1.05, 1], y: [10, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#F1F5F9',
            border: '2px solid #CBD5E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0B192C',
            marginBottom: '1rem'
          }}
        >
          <Mail size={28} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#ECFDF5',
            border: '2px solid #A7F3D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#059669',
            marginBottom: '1rem'
          }}
        >
          <CheckCircle2 size={32} />
        </motion.div>
      )}

      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0B192C' }}>
        {!isSent ? 'Sending a new code...' : 'New code sent'}
      </div>
      <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.25rem' }}>
        {!isSent ? 'Connecting to Resend security identity...' : 'Check your inbox for the fresh 6-digit code'}
      </div>
    </div>
  );
}

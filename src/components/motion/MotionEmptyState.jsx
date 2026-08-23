import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import MotionButton from './MotionButton.jsx';

export default function MotionEmptyState({
  icon: Icon,
  title = "No Records Found",
  message = "No data has been recorded in this module yet.",
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  className = '',
  style = {}
}) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{
        padding: '3.5rem 1.5rem',
        background: '#F8FAFC',
        borderRadius: '16px',
        border: '1px dashed #CBD5E1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {Icon && (
        <motion.div
          initial={shouldReduce ? false : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            marginBottom: '1rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
          }}
        >
          <Icon size={26} />
        </motion.div>
      )}

      <motion.h3
        initial={shouldReduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.08 }}
        style={{
          margin: '0 0 0.35rem 0',
          fontSize: '1.05rem',
          fontWeight: 800,
          color: '#0F172A'
        }}
      >
        {title}
      </motion.h3>

      <motion.p
        initial={shouldReduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22, delay: 0.12 }}
        style={{
          margin: '0 0 1.25rem 0',
          fontSize: '0.82rem',
          color: '#64748B',
          maxWidth: '420px',
          lineHeight: 1.45
        }}
      >
        {message}
      </motion.p>

      {actionLabel && onAction && (
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.16 }}
        >
          <MotionButton
            variant="gold"
            icon={ActionIcon}
            onClick={onAction}
          >
            {actionLabel}
          </MotionButton>
        </motion.div>
      )}
    </motion.div>
  );
}

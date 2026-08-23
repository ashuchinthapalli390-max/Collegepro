import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { modalBackdropVariants, modalContentVariants } from '../../lib/motion/variants.js';

export default function MotionModal({
  isOpen = false,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '680px',
  showClose = true
}) {
  const shouldReduce = useReducedMotion();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            boxSizing: 'border-box'
          }}
        >
          {/* Backdrop */}
          <motion.div
            variants={shouldReduce ? undefined : modalBackdropVariants}
            initial={shouldReduce ? false : "hidden"}
            animate="visible"
            exit={shouldReduce ? undefined : "exit"}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(7, 15, 30, 0.72)',
              backdropFilter: 'blur(5px)',
              zIndex: 1
            }}
          />

          {/* Modal Dialog Content */}
          <motion.div
            variants={shouldReduce ? undefined : modalContentVariants}
            initial={shouldReduce ? false : "hidden"}
            animate="visible"
            exit={shouldReduce ? undefined : "exit"}
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              maxWidth,
              maxHeight: '90vh',
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            {(title || showClose) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.2rem 1.5rem',
                  borderBottom: '1px solid #F1F5F9',
                  background: '#F8FAFC'
                }}
              >
                <div>
                  {title && (
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Cinzel, Georgia, serif' }}>
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#64748B' }}>
                      {subtitle}
                    </p>
                  )}
                </div>

                {showClose && (
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={shouldReduce ? undefined : { scale: 1.1, rotate: 90 }}
                    whileTap={shouldReduce ? undefined : { scale: 0.9 }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '0.4rem',
                      color: '#64748B',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={18} />
                  </motion.button>
                )}
              </div>
            )}

            {/* Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

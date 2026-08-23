import React from 'react';
import { motion } from 'motion/react';
import { useSafeMotion } from '../../lib/motion/reducedMotion.js';

/**
 * Standardized Media Card Shell for campus photography and videography
 */
export default function MediaCardShell({
  children,
  title,
  category,
  description,
  onClick,
  className = '',
  style = {},
  ...props
}) {
  const { shouldReduceMotion } = useSafeMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.012 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={`glass-card-dark ${className}`}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        background: 'linear-gradient(180deg, #0B192C 0%, #070F1E 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
        ...style
      }}
      {...props}
    >
      {/* Media Top Container */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {children}
      </div>

      {/* Metadata Bottom Container */}
      {(title || description) && (
        <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {category && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#D4AF37',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                {category}
              </span>
            </div>
          )}

          {title && (
            <h4
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0,
                lineHeight: 1.35
              }}
            >
              {title}
            </h4>
          )}

          {description && (
            <p
              style={{
                fontSize: '0.82rem',
                color: '#94A3B8',
                margin: 0,
                lineHeight: 1.5
              }}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

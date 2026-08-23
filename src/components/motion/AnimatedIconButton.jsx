import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSafeMotion } from '../../lib/motion/reducedMotion.js';

/**
 * Universal Animated Icon Button
 * Provides spring hover lift, tap scale, loading spin, and tooltip accessibility.
 */
export default function AnimatedIconButton({
  icon: Icon,
  onClick,
  label,
  tooltip,
  variant = 'default', // 'default' | 'primary' | 'success' | 'danger' | 'ghost'
  isLoading = false,
  isSpinning = false,
  isSwaying = false,
  rotateOnHover = 0, // e.g. 90 or 18
  badgeCount = 0,
  className = '',
  style = {},
  disabled = false,
  size = 16,
  buttonSize = 34,
  ariaLabel
}) {
  const { shouldReduceMotion } = useSafeMotion();
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
          color: '#070F1E',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          boxShadow: isHovered && !disabled ? '0 4px 14px rgba(212, 175, 55, 0.45)' : '0 2px 8px rgba(212, 175, 55, 0.25)'
        };
      case 'success':
        return {
          background: 'rgba(16, 185, 129, 0.12)',
          color: '#10B981',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: isHovered && !disabled ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
        };
      case 'danger':
        return {
          background: 'rgba(239, 68, 68, 0.12)',
          color: '#EF4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: isHovered && !disabled ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: '#94A3B8',
          border: '1px solid transparent',
          boxShadow: 'none'
        };
      case 'default':
      default:
        return {
          background: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
          color: isHovered ? '#FFFFFF' : '#CBD5E1',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: isHovered && !disabled ? '0 4px 12px rgba(0, 0, 0, 0.25)' : 'none'
        };
    }
  };

  const spinAnimation = (isLoading || isSpinning) && !shouldReduceMotion
    ? {
        rotate: 360,
        transition: {
          repeat: Infinity,
          duration: 0.85,
          ease: 'linear'
        }
      }
    : isHovered && rotateOnHover && !shouldReduceMotion
    ? {
        rotate: rotateOnHover,
        scale: 1.08,
        transition: { type: 'spring', stiffness: 360, damping: 22 }
      }
    : isSwaying && isHovered && !shouldReduceMotion
    ? {
        rotate: [-6, 6, -4, 4, 0],
        scale: 1.06,
        transition: { duration: 0.4, ease: 'easeInOut' }
      }
    : {
        rotate: 0,
        scale: 1,
        transition: { duration: 0.18 }
      };

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <motion.button
        type="button"
        onClick={onClick}
        disabled={disabled || isLoading}
        aria-label={ariaLabel || label || tooltip || 'Action button'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={disabled || shouldReduceMotion ? undefined : { scale: 1.05, y: -2 }}
        whileTap={disabled || shouldReduceMotion ? undefined : { scale: 0.93 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${buttonSize}px`,
          height: `${buttonSize}px`,
          borderRadius: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.45 : 1,
          outline: 'none',
          boxSizing: 'border-box',
          ...getVariantStyles(),
          ...style
        }}
        className={`animated-icon-button ${className}`}
      >
        {Icon && (
          <motion.div
            animate={spinAnimation}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transformOrigin: 'center center'
            }}
          >
            <Icon size={size} />
          </motion.div>
        )}

        {/* Badge count indicator */}
        {badgeCount > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#DC2626',
              color: '#FFFFFF',
              fontSize: '0.62rem',
              fontWeight: 800,
              minWidth: '18px',
              height: '18px',
              padding: '0 4px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #070F1E',
              boxShadow: '0 2px 5px rgba(220, 38, 38, 0.5)'
            }}
          >
            {badgeCount > 99 ? '99+' : badgeCount}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}

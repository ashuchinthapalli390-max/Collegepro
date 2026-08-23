import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSafeMotion } from '../../lib/motion/reducedMotion.js';

/**
 * Universal Animated Action Button (Icon + Label)
 * Provides spring hover elevation, icon micro-movements, and responsive scaling.
 */
export default function AnimatedActionButton({
  children,
  icon: Icon,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  isLoading = false,
  className = '',
  style = {},
  iconPosition = 'left' // 'left' | 'right'
}) {
  const { shouldReduceMotion } = useSafeMotion();
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
          color: '#070F1E',
          border: '1px solid rgba(212, 175, 55, 0.5)',
          boxShadow: isHovered && !disabled ? '0 4px 16px rgba(212, 175, 55, 0.4)' : '0 2px 8px rgba(212, 175, 55, 0.25)',
          fontWeight: 700
        };
      case 'secondary':
        return {
          background: 'rgba(255, 255, 255, 0.08)',
          color: '#FFFFFF',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: isHovered && !disabled ? '0 4px 14px rgba(0, 0, 0, 0.25)' : 'none',
          fontWeight: 600
        };
      case 'outline':
        return {
          background: 'transparent',
          color: '#D4AF37',
          border: '1px solid #D4AF37',
          fontWeight: 600
        };
      case 'danger':
        return {
          background: 'rgba(239, 68, 68, 0.12)',
          color: '#EF4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          fontWeight: 600
        };
      case 'ghost':
      default:
        return {
          background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
          color: '#E2E8F0',
          border: '1px solid transparent',
          fontWeight: 500
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '0.35rem 0.75rem', fontSize: '0.76rem', gap: '0.35rem', borderRadius: '7px' };
      case 'lg':
        return { padding: '0.65rem 1.4rem', fontSize: '0.92rem', gap: '0.55rem', borderRadius: '10px' };
      case 'md':
      default:
        return { padding: '0.45rem 1rem', fontSize: '0.82rem', gap: '0.45rem', borderRadius: '8px' };
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={disabled || shouldReduceMotion ? undefined : { scale: 1.035, y: -1.5 }}
      whileTap={disabled || shouldReduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
      className={`animated-action-button ${className}`}
    >
      {Icon && iconPosition === 'left' && (
        <motion.div
          animate={isHovered && !shouldReduceMotion ? { scale: 1.1, rotate: variant === 'primary' ? 8 : 0 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.18 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Icon size={size === 'sm' ? 13 : size === 'lg' ? 17 : 15} />
        </motion.div>
      )}

      <span>{children}</span>

      {Icon && iconPosition === 'right' && (
        <motion.div
          animate={isHovered && !shouldReduceMotion ? { x: 2, scale: 1.08 } : { x: 0, scale: 1 }}
          transition={{ duration: 0.18 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Icon size={size === 'sm' ? 13 : size === 'lg' ? 17 : 15} />
        </motion.div>
      )}
    </motion.button>
  );
}

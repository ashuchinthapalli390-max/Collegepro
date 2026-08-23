import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import { buttonSpring } from '../../lib/motion/tokens.js';

export default function MotionButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'gold', 'secondary', 'outline', 'danger', 'ghost'
  size = 'md',        // 'sm', 'md', 'lg'
  icon: Icon,
  loading = false,
  success = false,
  disabled = false,
  className = '',
  style = {},
  ...props
}) {
  const shouldReduce = useReducedMotion();

  // Base Style mappings
  const getVariantStyles = () => {
    switch (variant) {
      case 'gold':
        return {
          background: 'linear-gradient(135deg, #D4AF37 0%, #B38600 100%)',
          color: '#070F1E',
          border: '1px solid #F1C40F',
          boxShadow: '0 4px 12px rgba(212, 175, 55, 0.25)'
        };
      case 'primary':
      case 'navy':
        return {
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          border: '1px solid #334155',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
        };
      case 'outline':
        return {
          background: '#FFFFFF',
          color: '#334155',
          border: '1px solid #CBD5E1',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        };
      case 'secondary':
        return {
          background: '#F1F5F9',
          color: '#0F172A',
          border: '1px solid #E2E8F0'
        };
      case 'danger':
        return {
          background: '#DC2626',
          color: '#FFFFFF',
          border: '1px solid #B91C1C'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: '#64748B',
          border: 'none'
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '0.4rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px' };
      case 'lg':
        return { padding: '0.75rem 1.4rem', fontSize: '0.92rem', borderRadius: '10px' };
      case 'md':
      default:
        return { padding: '0.55rem 1rem', fontSize: '0.82rem', borderRadius: '8px' };
    }
  };

  return (
    <motion.button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      whileHover={shouldReduce || disabled || loading ? undefined : { scale: 1.025, y: -1 }}
      whileTap={shouldReduce || disabled || loading ? undefined : { scale: 0.97 }}
      transition={buttonSpring}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.45rem',
        fontWeight: 700,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        outline: 'none',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : success ? (
        <Check size={16} style={{ color: '#10B981' }} />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </motion.button>
  );
}

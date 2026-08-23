import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafeMotion } from '../../lib/motion/reducedMotion.js';

/**
 * Universal Animated Badge Component
 * Handles count change transitions, pop-in scaling, and smooth collapse when count is zero.
 */
export default function AnimatedBadge({
  count = 0,
  max = 99,
  variant = 'danger', // 'danger' | 'warning' | 'success' | 'gold' | 'navy'
  size = 'md', // 'sm' | 'md'
  className = '',
  style = {}
}) {
  const { shouldReduceMotion } = useSafeMotion();

  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  const getVariantStyles = () => {
    switch (variant) {
      case 'gold':
        return {
          background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
          color: '#070F1E',
          boxShadow: '0 2px 6px rgba(212, 175, 55, 0.4)'
        };
      case 'success':
        return {
          background: '#10B981',
          color: '#FFFFFF',
          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)'
        };
      case 'warning':
        return {
          background: '#F59E0B',
          color: '#070F1E',
          boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)'
        };
      case 'navy':
        return {
          background: '#0B192C',
          color: '#F1C40F',
          boxShadow: '0 2px 6px rgba(11, 25, 44, 0.4)'
        };
      case 'danger':
      default:
        return {
          background: '#DC2626',
          color: '#FFFFFF',
          boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)'
        };
    }
  };

  const isSmall = size === 'sm';

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={count}
        initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.6, opacity: 0 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.6, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 22 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '9999px',
          fontWeight: 800,
          fontSize: isSmall ? '0.62rem' : '0.68rem',
          minWidth: isSmall ? '16px' : '19px',
          height: isSmall ? '16px' : '19px',
          padding: isSmall ? '0 3px' : '0 5px',
          lineHeight: 1,
          border: '1.5px solid #070F1E',
          boxSizing: 'border-box',
          ...getVariantStyles(),
          ...style
        }}
        className={`animated-badge ${className}`}
      >
        {displayCount}
      </motion.span>
    </AnimatePresence>
  );
}

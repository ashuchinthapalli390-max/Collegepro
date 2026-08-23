import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cardSpring } from '../../lib/motion/tokens.js';

export default function MotionCard({
  children,
  onClick,
  hoverLift = true,
  className = '',
  style = {}
}) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={shouldReduce || !hoverLift ? undefined : {
        y: -4,
        scale: 1.01,
        boxShadow: "0 12px 24px -6px rgba(0, 0, 0, 0.09), 0 6px 10px -4px rgba(0, 0, 0, 0.04)"
      }}
      transition={cardSpring}
      onClick={onClick}
      className={className}
      style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        padding: '1.25rem',
        boxSizing: 'border-box',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {children}
    </motion.div>
  );
}

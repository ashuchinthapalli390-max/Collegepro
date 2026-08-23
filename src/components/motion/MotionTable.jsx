import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { tableContainerVariants, tableRowVariants } from '../../lib/motion/variants.js';

export function MotionTable({ children, className = '', style = {} }) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduce ? undefined : tableContainerVariants}
      initial={shouldReduce ? false : "hidden"}
      animate="visible"
      className={className}
      style={{
        width: '100%',
        overflowX: 'auto',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        background: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        ...style
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
        {children}
      </table>
    </motion.div>
  );
}

export function MotionTableRow({ children, onClick, className = '', style = {}, isAnimated = true }) {
  const shouldReduce = useReducedMotion();

  if (!isAnimated || shouldReduce) {
    return (
      <tr onClick={onClick} className={className} style={{ borderBottom: '1px solid #F1F5F9', ...style }}>
        {children}
      </tr>
    );
  }

  return (
    <motion.tr
      variants={tableRowVariants}
      whileHover="hover"
      onClick={onClick}
      className={className}
      style={{
        borderBottom: '1px solid #F1F5F9',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {children}
    </motion.tr>
  );
}

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { pageVariants } from '../../lib/motion/variants.js';

/**
 * Top-level page entrance wrapper.
 * Guarantees smooth entrance, staggered child orchestration, and zero opacity lock.
 */
export default function MotionPage({ children, className = '', style = {} }) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduce ? undefined : pageVariants}
      initial={shouldReduce ? false : "hidden"}
      animate="visible"
      exit={shouldReduce ? undefined : "exit"}
      className={className}
      style={{ width: '100%', ...style }}
    >
      {children}
    </motion.div>
  );
}

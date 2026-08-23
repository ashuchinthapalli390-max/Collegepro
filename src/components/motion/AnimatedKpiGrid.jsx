import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { kpiGridVariants } from '../../lib/motion/variants.js';

export default function AnimatedKpiGrid({
  children,
  minWidth = '140px',
  gap = '0.85rem',
  className = '',
  style = {}
}) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduce ? undefined : kpiGridVariants}
      initial={shouldReduce ? false : "hidden"}
      animate="visible"
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`,
        gap,
        width: '100%',
        ...style
      }}
    >
      {children}
    </motion.div>
  );
}

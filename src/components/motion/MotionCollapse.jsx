import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { collapseVariants } from '../../lib/motion/variants.js';

export default function MotionCollapse({
  isOpen = false,
  children,
  className = '',
  style = {}
}) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return isOpen ? <div className={className} style={style}>{children}</div> : null;
  }

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          variants={collapseVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={className}
          style={style}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

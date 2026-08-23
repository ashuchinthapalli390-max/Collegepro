import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { kpiCardVariants, kpiIconVariants } from '../../lib/motion/variants.js';
import MotionNumber from './MotionNumber.jsx';

export default function MotionKpiCard({
  label,
  value = 0,
  icon: Icon,
  color = '#0F172A',
  bg = '#F8FAFC',
  border = '1px solid #E2E8F0',
  prefix = '',
  suffix = '',
  onClick,
  className = '',
  style = {}
}) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduce ? undefined : kpiCardVariants}
      whileHover={shouldReduce ? undefined : "hover"}
      onClick={onClick}
      className={className}
      style={{
        background: bg,
        padding: '1rem',
        borderRadius: '12px',
        border,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        boxSizing: 'border-box',
        ...style
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>{label}</span>
        {Icon && (
          <motion.div
            variants={shouldReduce ? undefined : kpiIconVariants}
            style={{ display: 'inline-flex', color }}
          >
            <Icon size={17} />
          </motion.div>
        )}
      </div>

      <div
        style={{
          fontSize: '1.45rem',
          fontWeight: 800,
          color,
          fontFamily: 'Cinzel, serif',
          lineHeight: 1.2
        }}
      >
        <MotionNumber value={value} prefix={prefix} suffix={suffix} />
      </div>
    </motion.div>
  );
}

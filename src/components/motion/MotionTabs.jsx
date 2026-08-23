import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function MotionTabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'pills', // 'pills' or 'underline'
  className = '',
  style = {}
}) {
  const shouldReduce = useReducedMotion();

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        gap: '0.4rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        position: 'relative',
        ...style
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: variant === 'underline' ? '0.6rem 1rem' : '0.45rem 0.9rem',
              borderRadius: variant === 'underline' ? '0px' : '8px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.8rem',
              fontWeight: isActive ? 800 : 600,
              color: isActive ? '#0F172A' : '#64748B',
              cursor: 'pointer',
              outline: 'none',
              zIndex: 1
            }}
          >
            {Icon && <Icon size={15} style={{ color: isActive ? '#D4AF37' : '#94A3B8' }} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '10px',
                  background: isActive ? '#0F172A' : '#E2E8F0',
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontWeight: 700
                }}
              >
                {tab.count}
              </span>
            )}

            {/* Sliding Active Indicator */}
            {isActive && (
              <motion.div
                layoutId={shouldReduce ? undefined : "motionTabActivePill"}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: variant === 'underline' ? 'transparent' : '#F1F5F9',
                  borderBottom: variant === 'underline' ? '3px solid #D4AF37' : 'none',
                  borderRadius: variant === 'underline' ? '0px' : '8px',
                  zIndex: -1
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

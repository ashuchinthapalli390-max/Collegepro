import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';

const STEPS = [
  { step: 1, label: 'Basic Details' },
  { step: 2, label: 'Members' },
  { step: 3, label: 'Meeting & Agenda' },
  { step: 4, label: 'Documents' },
  { step: 5, label: 'Review & Submit' }
];

export default function BosStepper({ currentStep, onSelectStep, maxStepReached = 5 }) {
  const shouldReduceMotion = useReducedMotion();
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div style={{ position: 'relative', width: '100%', padding: '0.5rem 0' }}>
      {/* Background Track */}
      <div style={{
        position: 'absolute',
        top: '18px',
        left: '5%',
        right: '5%',
        height: '3px',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '9999px',
        zIndex: 0
      }}>
        {/* Animated Active Progress Fill */}
        <motion.div
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeInOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #10B981 0%, #F1C40F 100%)',
            borderRadius: '9999px'
          }}
        />
      </div>

      {/* Stepper Nodes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        {STEPS.map((s) => {
          const isCompleted = currentStep > s.step;
          const isCurrent = currentStep === s.step;
          const isClickable = s.step <= maxStepReached;

          return (
            <button
              key={s.step}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onSelectStep(s.step)}
              aria-current={isCurrent ? 'step' : undefined}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: isClickable ? 'pointer' : 'default',
                outline: 'none',
                minWidth: '60px'
              }}
            >
              {/* Circle Node */}
              <motion.div
                initial={false}
                animate={shouldReduceMotion ? {} : {
                  scale: isCurrent ? 1.08 : 1,
                  boxShadow: isCurrent ? '0 0 12px rgba(241, 196, 15, 0.5)' : 'none'
                }}
                transition={{ duration: 0.25 }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isCompleted 
                    ? '#10B981' 
                    : (isCurrent ? 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)' : '#0B192C'),
                  border: isCurrent 
                    ? '2px solid #FFFFFF' 
                    : (isCompleted ? '2px solid #10B981' : '2px solid rgba(255, 255, 255, 0.25)'),
                  color: isCurrent ? '#070F1E' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  transition: 'background 0.2s ease, border-color 0.2s ease'
                }}
              >
                {isCompleted ? (
                  <motion.span
                    initial={shouldReduceMotion ? {} : { scale: 0, rotate: -30 }}
                    animate={shouldReduceMotion ? {} : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check size={16} strokeWidth={3} />
                  </motion.span>
                ) : (
                  s.step
                )}
              </motion.div>

              {/* Step Label */}
              <span style={{
                fontSize: '0.72rem',
                fontWeight: isCurrent ? 800 : (isCompleted ? 600 : 500),
                color: isCurrent ? '#F1C40F' : (isCompleted ? '#E2E8F0' : '#94A3B8'),
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

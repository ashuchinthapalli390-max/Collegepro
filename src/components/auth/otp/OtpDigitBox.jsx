import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function OtpDigitBox({
  index,
  digit,
  isFocused,
  isDisabled = false,
  inputRef,
  onChange,
  onKeyDown,
  onFocus
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.92 }}
      animate={
        shouldReduceMotion 
          ? { opacity: isDisabled ? 0.45 : 1 } 
          : {
              opacity: isDisabled ? 0.45 : 1,
              y: isFocused ? -2 : 0,
              scale: isFocused ? 1.025 : 1
            }
      }
      transition={{
        duration: 0.28,
        delay: shouldReduceMotion ? 0 : index * 0.05,
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{
        position: 'relative',
        width: '46px',
        height: '54px',
        borderRadius: '10px',
        background: digit ? '#FEFBF2' : '#FFFFFF',
        border: digit
          ? '2px solid #D4AF37'
          : isFocused
          ? '2px solid #0B192C'
          : '1.5px solid #CBD5E1',
        boxShadow: isFocused 
          ? '0 0 0 3px rgba(212, 175, 55, 0.25), 0 4px 12px rgba(11, 25, 44, 0.08)' 
          : '0 2px 4px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDisabled ? 'not-allowed' : 'text',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        value={digit}
        disabled={isDisabled}
        onChange={(e) => onChange(index, e.target.value)}
        onKeyDown={(e) => onKeyDown(index, e)}
        onFocus={() => onFocus(index)}
        aria-label={`Digit ${index + 1} of 6`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: isDisabled ? 'not-allowed' : 'text',
          zIndex: 2
        }}
      />

      {/* Animated Digit Display */}
      {digit ? (
        <motion.span
          key={`digit-${digit}-${index}`}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#0B192C',
            fontFamily: 'monospace',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          {digit}
        </motion.span>
      ) : (
        isFocused && (
          <motion.div
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
            style={{
              width: '2px',
              height: '22px',
              backgroundColor: '#0B192C',
              borderRadius: '1px'
            }}
          />
        )
      )}
    </motion.div>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Animated number counter component.
 * Animates from 0 to real value on initial mount, and smoothly transitions when value changes.
 * Safely handles 0 and non-numeric suffixes. Never invents fake targets.
 */
export default function MotionNumber({ 
  value = 0, 
  duration = 600, 
  prefix = '', 
  suffix = '',
  className = '',
  style = {} 
}) {
  const shouldReduce = useReducedMotion();
  const numericTarget = typeof value === 'number' ? value : parseFloat(value) || 0;
  const isDecimal = String(value).includes('.');

  const [displayValue, setDisplayValue] = useState(() => (shouldReduce ? numericTarget : 0));
  const prevTargetRef = useRef(shouldReduce ? numericTarget : 0);

  useEffect(() => {
    if (shouldReduce) {
      setDisplayValue(numericTarget);
      prevTargetRef.current = numericTarget;
      return;
    }

    const startValue = prevTargetRef.current;
    const endValue = numericTarget;
    prevTargetRef.current = numericTarget;

    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    let startTime = null;
    let animationFrameId = null;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const current = startValue + (endValue - startValue) * easedProgress;
      setDisplayValue(isDecimal ? parseFloat(current.toFixed(1)) : Math.round(current));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [numericTarget, duration, shouldReduce, isDecimal]);

  return (
    <span className={className} style={style}>
      {prefix}{displayValue.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

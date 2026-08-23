import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Universal Safe Motion Hook
 * Supports both:
 * 1) Destructuring: const { shouldReduceMotion, safeVariant } = useSafeMotion();
 * 2) Direct variant wrapping: const resolvedVariants = useSafeMotion(variants);
 */
export function useSafeMotion(variants, fallback = { opacity: 1, y: 0, x: 0, scale: 1 }) {
  const shouldReduce = useFramerReducedMotion() || false;

  // If called directly with a variant object
  if (variants && typeof variants === 'object') {
    if (shouldReduce) {
      return {
        hidden: fallback,
        visible: fallback,
        show: fallback,
        exit: fallback
      };
    }
    return variants;
  }

  // If called as a parameterless hook for destructuring
  return {
    shouldReduceMotion: shouldReduce,
    safeVariant: (v) => {
      if (!v) return fallback;
      if (shouldReduce) {
        return {
          hidden: fallback,
          visible: fallback,
          show: fallback,
          exit: fallback
        };
      }
      return v;
    }
  };
}

export const safeTransition = (shouldReduce, standardTransition) => {
  if (shouldReduce) {
    return { duration: 0.01 };
  }
  return standardTransition;
};

export { useFramerReducedMotion as useReducedMotion };

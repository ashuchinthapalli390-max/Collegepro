import { useReducedMotion } from 'framer-motion';

/**
 * Hook or helper to safely resolve animation variants when reduced motion is preferred
 */
export function useSafeMotion(variants, fallback = { opacity: 1, y: 0, x: 0, scale: 1 }) {
  const shouldReduce = useReducedMotion();
  if (shouldReduce) {
    return {
      hidden: fallback,
      visible: fallback,
      exit: fallback
    };
  }
  return variants;
}

export const safeTransition = (shouldReduce, standardTransition) => {
  if (shouldReduce) {
    return { duration: 0.01 };
  }
  return standardTransition;
};

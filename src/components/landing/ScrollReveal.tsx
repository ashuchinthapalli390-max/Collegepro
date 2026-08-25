import React from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { useRef } from 'react'
import { useReducedMotion } from '../../hooks/useAnimationHooks'

type RevealVariant =
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeLeft'
  | 'fadeRight'
  | 'scale'
  | 'blurReveal'
  | 'rotateIn'

const variantMap: Record<RevealVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9, filter: 'blur(8px)' },
    visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  },
  blurReveal: {
    hidden: { opacity: 0, filter: 'blur(12px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -3, y: 20 },
    visible: { opacity: 1, rotate: 0, y: 0 },
  },
}

interface ScrollRevealProps {
  children: React.ReactNode
  variant?: RevealVariant
  delay?: number
  duration?: number
  className?: string
  /** If true, wraps children in a stagger container */
  stagger?: boolean
  staggerDelay?: number
  once?: boolean
  threshold?: number
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.7,
  className = '',
  stagger = false,
  staggerDelay = 0.08,
  once = true,
  threshold = 0.15,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, amount: threshold })
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  const variants = variantMap[variant]

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: staggerDelay,
              delayChildren: delay,
            },
          },
        }}
      >
        {React.Children.map(children, (child) => (
          <motion.div
            variants={{
              hidden: variants.hidden,
              visible: {
                ...variants.visible,
                transition: {
                  duration,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            duration,
            ease: [0.16, 1, 0.3, 1],
            delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// ─── ScrollRevealItem (for use inside stagger containers) ────────
export const ScrollRevealItem: React.FC<{
  children: React.ReactNode
  variant?: RevealVariant
  duration?: number
  className?: string
}> = ({ children, variant = 'fadeUp', duration = 0.7, className = '' }) => {
  const variants = variantMap[variant]
  return (
    <motion.div
      className={className}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            duration,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

// ─── Reduced Motion ───────────────────────────────────────────────
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mql.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])
  return reduced
}

// ─── Mouse Position (normalized -0.5 … 0.5) ──────────────────────
export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0, px: 0, py: 0 })
  useEffect(() => {
    let raf: number
    const handler = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setPos({
          x: e.clientX / window.innerWidth - 0.5,
          y: e.clientY / window.innerHeight - 0.5,
          px: e.clientX,
          py: e.clientY,
        })
      })
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handler)
      cancelAnimationFrame(raf)
    }
  }, [])
  return pos
}

// ─── Scroll Progress (0 … 1 for an element) ──────────────────────
export function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf: number
    const handler = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const p = Math.max(0, Math.min(1, 1 - rect.top / vh))
        setProgress(p)
      })
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => {
      window.removeEventListener('scroll', handler)
      cancelAnimationFrame(raf)
    }
  }, [ref])
  return progress
}

// ─── InView (Intersection Observer) ───────────────────────────────
export function useInView(
  options: IntersectionObserverInit = { threshold: 0.15 }
) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.unobserve(el) // trigger once
      }
    }, options)
    observer.observe(el)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])
  return { ref, inView }
}

// ─── Count Up ─────────────────────────────────────────────────────
export function useCountUp(
  target: number,
  trigger: boolean,
  duration = 2000
): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start: number | null = null
    let raf: number
    const step = (ts: number) => {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [trigger, target, duration])
  return value
}

// ─── Magnetic Effect ──────────────────────────────────────────────
export function useMagneticEffect(strength = 0.3) {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      setOffset({
        x: (e.clientX - cx) * strength,
        y: (e.clientY - cy) * strength,
      })
    },
    [strength]
  )

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 })
  }, [])

  return { ref, offset, handleMouseMove, handleMouseLeave }
}

// ─── Card 3D Tilt ─────────────────────────────────────────────────
export function useCardTilt(maxDeg = 6) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setTransform(
        `perspective(800px) rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg) scale3d(1.02, 1.02, 1.02)`
      )
    },
    [maxDeg]
  )

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)')
  }, [])

  return { ref, transform, handleMouseMove, handleMouseLeave }
}

// ─── Stagger Variants (Framer Motion) ─────────────────────────────
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const fadeUpItem = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export const fadeDownItem = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export const scaleItem = {
  hidden: { opacity: 0, scale: 0.92, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export const fadeLeftItem = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export const fadeRightItem = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition, useReducedMotion } from '../../hooks/useAnimationHooks'

// ─── Floating Particle ───────────────────────────────────────────
const Particle: React.FC<{ i: number }> = ({ i }) => {
  const style = useMemo(() => {
    const size = 2 + Math.random() * 3
    const x = Math.random() * 100
    const y = Math.random() * 100
    const delay = Math.random() * 8
    const dur = 12 + Math.random() * 16
    return {
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${dur}s`,
    } as React.CSSProperties
  }, [i])

  return (
    <div
      className="landing-particle"
      style={style}
    />
  )
}

// ─── Aurora Background ───────────────────────────────────────────
export const AuroraBackground: React.FC = () => {
  const { px, py } = useMousePosition()
  const reduced = useReducedMotion()

  const particles = useMemo(
    () => Array.from({ length: 30 }, (_, i) => <Particle key={i} i={i} />),
    []
  )

  if (reduced) {
    // Static fallback — no animations
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-indigo-500/8 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-8%] w-[45vw] h-[45vw] rounded-full bg-emerald-500/5 blur-[140px]" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Aurora gradient blobs */}
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-blob aurora-blob-4" />

      {/* Animated grid */}
      <div className="landing-grid" />

      {/* Mouse-reactive glow */}
      <div
        className="landing-mouse-glow"
        style={{
          background: `radial-gradient(600px circle at ${px}px ${py}px, rgba(99, 102, 241, 0.06), transparent 60%)`,
        }}
      />

      {/* Floating particles */}
      {particles}

      {/* Noise texture overlay */}
      <div className="landing-noise" />
    </div>
  )
}

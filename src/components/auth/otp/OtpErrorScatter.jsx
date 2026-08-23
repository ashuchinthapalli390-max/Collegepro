import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function OtpErrorScatter({
  attemptsRemaining = 3,
  onReenterCode
}) {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(shouldReduceMotion ? 'ready' : 'impulse'); // 'impulse' -> 'blast' -> 'ready' -> 'reconstructing'
  
  const blastRadius = 115; // Desktop radius in pixels (contained inside auth card)

  // 6 specific radial angles and rotation offsets
  const scatterAngles = [-150, -90, -30, 30, 90, 150];
  const tileRotations = [-40, 25, -28, 38, -22, 35];

  const burstPoints = scatterAngles.map((deg, i) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: Math.cos(rad) * blastRadius,
      y: Math.sin(rad) * blastRadius,
      rotate: tileRotations[i]
    };
  });

  // 14 tiny decorative particle vectors
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2 + (i % 3) * 0.2;
    const dist = 50 + (i % 4) * 22;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 3 + (i % 3),
      color: i % 2 === 0 ? '#DC2626' : (i % 3 === 0 ? '#F59E0B' : '#EF4444')
    };
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      setPhase('ready');
      return;
    }

    // Step 1: Error impulse (120ms) -> Step 2: Radial blast (480ms) -> Step 3: Error card
    const t1 = setTimeout(() => setPhase('blast'), 140);
    const t2 = setTimeout(() => setPhase('ready'), 620);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [shouldReduceMotion]);

  const handleReenterClick = () => {
    if (shouldReduceMotion) {
      onReenterCode();
      return;
    }

    setPhase('reconstructing');
    setTimeout(() => {
      onReenterCode();
    }, 450);
  };

  return (
    <div style={{
      minHeight: '175px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* PHASE 1 & 2: Error Impulse + Radial Blast + Decorative Particles */}
      {(phase === 'impulse' || phase === 'blast') && (
        <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Central Impulse Flash */}
          <motion.div
            initial={{ scale: 1, opacity: 0.9 }}
            animate={
              phase === 'impulse'
                ? { scale: [1, 0.92, 1.05], opacity: 1, backgroundColor: '#EF4444' }
                : { scale: 0, opacity: 0 }
            }
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#DC2626',
              boxShadow: '0 0 24px rgba(220, 38, 38, 0.7)'
            }}
          />

          {/* 6 Radial Blast Tiles */}
          {burstPoints.map((pt, idx) => (
            <motion.div
              key={idx}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
              animate={
                phase === 'blast'
                  ? {
                      x: pt.x,
                      y: pt.y,
                      scale: [1, 1.15, 0.5],
                      opacity: [1, 0.85, 0],
                      rotate: pt.rotate
                    }
                  : { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }
              }
              transition={{ duration: 0.48, ease: [0.25, 1, 0.5, 1] }}
              style={{
                position: 'absolute',
                width: '26px',
                height: '30px',
                borderRadius: '6px',
                background: '#DC2626',
                border: '1.5px solid #FCA5A5',
                boxShadow: '0 0 16px rgba(220, 38, 38, 0.5)'
              }}
            />
          ))}

          {/* 14 Micro Blast Particles */}
          {phase === 'blast' &&
            particles.map((p, idx) => (
              <motion.div
                key={`p-${idx}`}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{ x: p.x, y: p.y, scale: [0, 1.2, 0], opacity: [1, 0.9, 0] }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: idx * 0.015 }}
                style={{
                  position: 'absolute',
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  borderRadius: '50%',
                  backgroundColor: p.color,
                  boxShadow: `0 0 6px ${p.color}`
                }}
              />
            ))}
        </div>
      )}

      {/* PHASE 4: Reverse Reconstruction Animation */}
      {phase === 'reconstructing' && (
        <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {burstPoints.map((pt, idx) => (
            <motion.div
              key={`recon-${idx}`}
              initial={{
                x: pt.x * 0.8,
                y: pt.y * 0.8,
                scale: 0.4,
                opacity: 0,
                rotate: pt.rotate
              }}
              animate={{
                x: (idx - 2.5) * 50,
                y: 0,
                scale: 1,
                opacity: 1,
                rotate: 0
              }}
              transition={{ duration: 0.42, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                position: 'absolute',
                width: '44px',
                height: '52px',
                borderRadius: '8px',
                background: '#FFFFFF',
                border: '1.5px solid #D4AF37',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
              }}
            />
          ))}
        </div>
      )}

      {/* PHASE 3: Error Message State with Re-enter Action */}
      {phase === 'ready' && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{ textAlign: 'center', padding: '0.6rem 0' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#DC2626',
            fontWeight: 800,
            fontSize: '1.08rem',
            marginBottom: '0.35rem'
          }}>
            <AlertCircle size={20} /> Code didn't match
          </div>

          <p style={{ color: '#475569', fontSize: '0.86rem', margin: '0 0 0.35rem 0', lineHeight: 1.5 }}>
            The verification code you entered is incorrect.
          </p>

          <div style={{
            fontSize: '0.8rem',
            color: attemptsRemaining <= 2 ? '#DC2626' : '#64748B',
            fontWeight: 700,
            marginBottom: '1.3rem'
          }}>
            {attemptsRemaining} {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining
          </div>

          <button
            type="button"
            onClick={handleReenterClick}
            className="btn-primary"
            style={{
              padding: '0.7rem 1.75rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(11, 25, 44, 0.18)'
            }}
          >
            <RefreshCw size={14} /> Re-enter code
          </button>
        </motion.div>
      )}
    </div>
  );
}

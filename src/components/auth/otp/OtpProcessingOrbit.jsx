import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function OtpProcessingOrbit({ isMerging = false }) {
  const shouldReduceMotion = useReducedMotion();
  const radius = 44; // Orbit radius in pixels

  // 6 radial orbit positions at 60 degree intervals
  const orbitPoints = Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 6;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  });

  if (shouldReduceMotion) {
    return (
      <div style={{ height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #D4AF37', borderTopColor: '#0B192C', animation: 'spin 1s linear infinite' }} />
        <div style={{ marginTop: '1rem', fontSize: '0.88rem', fontWeight: 600, color: '#0B192C' }}>
          Checking code...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '150px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Central Rotating Orbit Stage */}
      <motion.div
        animate={isMerging ? { rotate: 0 } : { rotate: 360 }}
        transition={
          isMerging
            ? { duration: 0.3, ease: 'easeOut' }
            : { duration: 1.4, ease: 'linear', repeat: Infinity }
        }
        style={{
          width: '100px',
          height: '100px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {orbitPoints.map((pt, idx) => (
          <motion.div
            key={idx}
            initial={{
              x: (idx - 2.5) * 52, // Start from horizontal positions
              y: 0,
              scale: 0.95,
              opacity: 0.9
            }}
            animate={
              isMerging
                ? { x: 0, y: 0, scale: 0.5, opacity: 0 }
                : {
                    x: pt.x,
                    y: pt.y,
                    scale: 0.82,
                    opacity: 1
                  }
            }
            transition={{
              duration: isMerging ? 0.35 : 0.45,
              ease: [0.34, 1.56, 0.64, 1],
              delay: isMerging ? 0 : idx * 0.03
            }}
            style={{
              position: 'absolute',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: idx % 2 === 0 ? '#D4AF37' : '#0B192C',
              boxShadow: idx % 2 === 0 
                ? '0 0 10px rgba(212, 175, 55, 0.5)' 
                : '0 0 10px rgba(11, 25, 44, 0.3)',
              border: '1.5px solid #FFFFFF'
            }}
          />
        ))}

        {/* Center Glow Node during merge */}
        {isMerging && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0B192C 0%, #D4AF37 100%)',
              boxShadow: '0 0 18px rgba(212, 175, 55, 0.6)'
            }}
          />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginTop: '0.8rem',
          fontSize: '0.88rem',
          fontWeight: 700,
          color: '#0B192C',
          letterSpacing: '0.3px'
        }}
      >
        Checking code...
      </motion.div>
    </div>
  );
}

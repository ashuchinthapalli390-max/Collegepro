import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Layers, 
  FlaskConical,
  GraduationCap
} from 'lucide-react';
import { useSafeMotion } from '../../lib/motion/reducedMotion.js';
import { staggerContainer, staggerChild } from '../../lib/motion/variants.js';

export default function Hero({ 
  onExploreClick, 
  onExploreCampus, 
  onGoToResearch, 
  onGoToDepartments,
  onOpenPortal 
}) {
  const { safeVariant } = useSafeMotion();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const heroVideoClips = [
    "/assets/NEC Videos/Aerial View Of campus_.mp4",
    "/assets/NEC Videos/NEC Aerial View & Admin blck.mp4",
    "/assets/NEC Videos/Blocks view.mp4",
    "/assets/NEC Videos/Main block inside view.mp4"
  ];

  const handleExplore = onExploreClick || onExploreCampus || (() => {
    const el = document.getElementById('campus-tour');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });

  const handleDepartments = onGoToDepartments || (() => {
    const el = document.getElementById('departments-hub');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });

  const handleResearch = onGoToResearch || (() => {
    const el = document.getElementById('research-hub');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });

  // Rotate video clips seamlessly without exposing text or controls
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnded = () => {
      setCurrentVideoIndex((prev) => (prev + 1) % heroVideoClips.length);
    };

    video.addEventListener('ended', handleVideoEnded);
    return () => {
      if (video) video.removeEventListener('ended', handleVideoEnded);
    };
  }, [heroVideoClips.length]);

  return (
    <section 
      aria-label="Welcome to Narasaraopeta Engineering College"
      style={{ 
        position: 'relative', 
        minHeight: '88vh', 
        display: 'flex', 
        alignItems: 'center', 
        overflow: 'hidden', 
        background: '#070F1E',
        width: '100%'
      }}
    >
      {/* Seamless Looping Cinematic Background Video or Poster Fallback */}
      {!videoError && (
        <video
          ref={videoRef}
          key={heroVideoClips[currentVideoIndex]}
          autoPlay
          muted
          loop={false}
          playsInline
          poster="/assets/NEC Buildings/College main building.jpg"
          onError={() => setVideoError(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            opacity: 0.65,
            filter: 'brightness(0.72) contrast(1.08)',
            pointerEvents: 'none'
          }}
          src={heroVideoClips[currentVideoIndex]}
        />
      )}

      {/* Cinematic Ambient Overlays */}
      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          background: 'linear-gradient(180deg, rgba(7, 15, 30, 0.72) 0%, rgba(7, 15, 30, 0.4) 50%, rgba(7, 15, 30, 0.96) 100%)',
          pointerEvents: 'none'
        }} 
      />

      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          background: 'radial-gradient(circle at 25% 45%, rgba(30, 62, 98, 0.42) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} 
      />

      {/* Main Hero Typography & CTAs */}
      <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '3.5rem', paddingBottom: '3.5rem', width: '100%' }}>
        <motion.div 
          style={{ maxWidth: '850px' }}
          variants={safeVariant(staggerContainer)}
          initial="hidden"
          animate="show"
        >
          {/* Eyebrow Accreditation Tag */}
          <motion.div variants={safeVariant(staggerChild)} style={{ marginBottom: '1.2rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              background: 'rgba(212, 175, 55, 0.18)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              color: '#F1C40F',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Autonomous • Estd. 1998 • Affiliated to JNTUK
            </span>
          </motion.div>

          {/* Main Institution Title with Responsive clamp() */}
          <motion.h1 
            variants={safeVariant(staggerChild)}
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(2.2rem, 5.2vw, 3.8rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.15,
              marginBottom: '1.1rem',
              textShadow: '0 4px 25px rgba(0,0,0,0.7)'
            }}
          >
            NARASARAOPETA <br />
            <span style={{
              background: 'linear-gradient(135deg, #FFF6D6 0%, #D4AF37 50%, #F5A623 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ENGINEERING COLLEGE
            </span>
          </motion.h1>

          {/* Concise Institutional Subtitle */}
          <motion.p 
            variants={safeVariant(staggerChild)}
            style={{
              fontSize: 'clamp(0.98rem, 1.8vw, 1.2rem)',
              color: '#E2E8F0',
              lineHeight: 1.65,
              marginBottom: '2.2rem',
              maxWidth: '720px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            Engineering • Research • Innovation. Nurturing multidisciplinary research in AICTE IDEA Labs, 
            cutting-edge patents, and global leadership across 13 departments.
          </motion.p>

          {/* Clean Action Buttons */}
          <motion.div variants={safeVariant(staggerChild)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <motion.button 
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExplore}
              className="btn-primary"
              style={{ padding: '0.8rem 1.8rem', fontSize: '0.96rem' }}
            >
              <Compass size={18} /> Explore NEC
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDepartments}
              className="btn-secondary"
              style={{ padding: '0.8rem 1.8rem', fontSize: '0.96rem' }}
            >
              <Layers size={18} /> Explore Departments
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleResearch}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: '#D4AF37',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '0.8rem 1rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#F1C40F'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#D4AF37'}
            >
              <FlaskConical size={17} /> Research & Innovation →
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

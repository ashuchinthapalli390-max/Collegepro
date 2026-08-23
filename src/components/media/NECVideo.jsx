import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, AlertCircle, RefreshCw, Film } from 'lucide-react';
import { useSafeMotion } from '../../lib/motion/reducedMotion.js';

/**
 * Universal Production-Grade Video Component for Narasaraopeta Engineering College
 * - Replaces black 0:00 boxes with verified high-definition poster frames
 * - Single-play coordination (pauses other playing videos when one starts)
 * - Safe URL encoding for spaces and special characters
 * - Responsive metadata duration extraction & graceful error recovery
 */
export default function NECVideo({
  id,
  src,
  poster,
  title = 'NEC Campus Tour',
  category = 'Campus',
  duration = '--:--',
  aspectRatio = '16/9',
  preload = 'metadata',
  autoPlay = false,
  muted = false,
  controls = true,
  playsInline = true,
  className = '',
  style = {},
  showDurationBadge = true,
  showCategoryBadge = true,
  onPlay,
  onPause,
  onEnded,
  ...props
}) {
  const { shouldReduceMotion } = useSafeMotion();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'LOADING' | 'READY' | 'ERROR'
  const [actualDuration, setActualDuration] = useState(duration);
  const [videoUrl, setVideoUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');

  // 1. URL Safety & Encoding
  useEffect(() => {
    if (!src) {
      setStatus('ERROR');
      return;
    }
    try {
      setVideoUrl(src.startsWith('http') ? src : encodeURI(src));
    } catch {
      setVideoUrl(src);
    }

    if (poster) {
      try {
        setPosterUrl(poster.startsWith('http') ? poster : encodeURI(poster));
      } catch {
        setPosterUrl(poster);
      }
    }
    setStatus('READY');
  }, [src, poster]);

  // 2. Global Video Playback Coordination (Only 1 video plays at a time)
  useEffect(() => {
    const handleGlobalPlay = (e) => {
      if (e.detail?.id && e.detail.id !== id && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener('nec-global-video-play', handleGlobalPlay);
    return () => {
      window.removeEventListener('nec-global-video-play', handleGlobalPlay);
    };
  }, [id]);

  // 3. Play / Pause Handlers
  const handleStartPlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    // Dispatch global event to pause other playing videos
    window.dispatchEvent(new CustomEvent('nec-global-video-play', { detail: { id: id || src } }));

    setHasStarted(true);
    video.play().then(() => {
      setIsPlaying(true);
      if (onPlay) onPlay();
    }).catch(err => {
      console.warn(`[NECVideo] Playback failed:`, err);
      // Auto-fallback to muted playback if browser blocks unmuted audio
      video.muted = true;
      video.play().then(() => setIsPlaying(true)).catch(() => setStatus('ERROR'));
    });
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
      const mins = Math.floor(video.duration / 60);
      const secs = Math.floor(video.duration % 60);
      setActualDuration(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    }
    setStatus('READY');
  };

  const handleRetry = () => {
    setStatus('READY');
    setHasStarted(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <div
      className={`nec-video-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: aspectRatio,
        background: '#070F1E',
        borderRadius: '12px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style
      }}
      {...props}
    >
      {/* HTML5 Native Video Player */}
      {status !== 'ERROR' && videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl || undefined}
          preload={preload}
          controls={hasStarted && controls}
          playsInline={playsInline}
          muted={muted}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => {
            setIsPlaying(true);
            window.dispatchEvent(new CustomEvent('nec-global-video-play', { detail: { id: id || src } }));
            if (onPlay) onPlay();
          }}
          onPause={() => {
            setIsPlaying(false);
            if (onPause) onPause();
          }}
          onEnded={() => {
            setIsPlaying(false);
            setHasStarted(false);
            if (onEnded) onEnded();
          }}
          onError={() => {
            console.warn(`[NECVideo] Failed to stream video: ${src}`);
            setStatus('ERROR');
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1
          }}
        />
      )}

      {/* Poster Overlay with Centered Play Button (Shown before playback starts) */}
      {(!hasStarted || !isPlaying) && status !== 'ERROR' && (
        <div
          onClick={handleStartPlayback}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: posterUrl ? `url("${posterUrl}")` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0B192C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2,
            transition: 'background 0.3s ease'
          }}
        >
          {/* Subtle Ambient Darkening Filter */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(7, 15, 30, 0.35) 0%, rgba(7, 15, 30, 0.7) 100%)',
              zIndex: 1
            }}
          />

          {/* Interactive Golden Play Button */}
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
            style={{
              position: 'relative',
              zIndex: 2,
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#070F1E',
              boxShadow: '0 6px 25px rgba(212, 175, 55, 0.65)'
            }}
          >
            <Play size={26} style={{ marginLeft: '4px' }} />
          </motion.div>

          {/* Category Badge */}
          {showCategoryBadge && category && (
            <span
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(11, 25, 44, 0.9)',
                backdropFilter: 'blur(8px)',
                color: '#D4AF37',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: '6px',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                zIndex: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              {category}
            </span>
          )}

          {/* Duration Badge */}
          {showDurationBadge && (
            <span
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(7, 15, 30, 0.85)',
                backdropFilter: 'blur(6px)',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                zIndex: 3
              }}
            >
              {actualDuration}
            </span>
          )}
        </div>
      )}

      {/* Error Fallback with Retry Option */}
      {status === 'ERROR' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #070F1E 0%, #151D2A 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.2rem',
            textAlign: 'center',
            color: '#94A3B8',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 4
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F87171',
              marginBottom: '0.6rem'
            }}
          >
            <Film size={22} />
          </div>

          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '0.2rem' }}>
            {title}
          </span>

          <span style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '0.75rem' }}>
            Video stream currently unavailable
          </span>

          <button
            type="button"
            onClick={handleRetry}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={12} /> Retry Stream
          </button>
        </div>
      )}
    </div>
  );
}

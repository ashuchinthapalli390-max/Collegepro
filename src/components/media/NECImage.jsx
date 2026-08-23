import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useSafeMotion } from '../../lib/motion/reducedMotion.js';

/**
 * Robust Universal Image Component for Narasaraopeta Engineering College
 * - Eliminates broken browser icons and faint alt-text artifacts
 * - Automatic URL encoding for special characters and spaces
 * - Loading skeleton shimmer & graceful error fallback
 * - Full reduced-motion and aspect-ratio compliance
 */
export default function NECImage({
  src,
  alt = 'Narasaraopeta Engineering College Media',
  aspectRatio = '16/9',
  objectFit = 'cover',
  className = '',
  style = {},
  fallbackTitle = 'Campus Image',
  showFallbackMessage = true,
  onClick,
  priority = false,
  ...props
}) {
  const { shouldReduceMotion } = useSafeMotion();
  const [status, setStatus] = useState('LOADING'); // 'LOADING' | 'LOADED' | 'ERROR'
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (!src) {
      setStatus('ERROR');
      return;
    }

    // Safely encode URI to handle spaces and special characters seamlessly
    let safeUrl = src;
    try {
      if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:')) {
        // Local path: encode URI components while preserving slashes
        safeUrl = encodeURI(src);
      }
    } catch {
      safeUrl = src;
    }

    setStatus('LOADING');
    setImgSrc(safeUrl);
  }, [src]);

  return (
    <div
      className={`nec-image-wrapper ${className}`}
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: aspectRatio,
        overflow: 'hidden',
        background: '#0B192C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      {...props}
    >
      {/* 1. Loading Skeleton / Shimmer */}
      {status === 'LOADING' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #0B192C 0%, #17283E 50%, #0B192C 100%)',
            backgroundSize: '200% 100%',
            animation: shouldReduceMotion ? 'none' : 'necShimmer 1.6s infinite linear',
            zIndex: 1
          }}
        />
      )}

      {/* 2. Actual Image with Error Guard */}
      {status !== 'ERROR' && imgSrc && (
        <motion.img
          src={imgSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('LOADED')}
          onError={() => {
            console.warn(`[NECImage] Asset failed to load: ${src}`);
            setStatus('ERROR');
          }}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.015 }}
          animate={status === 'LOADED' ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: objectFit,
            zIndex: 2
          }}
        />
      )}

      {/* 3. Controlled Professional Fallback UI (Zero Broken Icons) */}
      {status === 'ERROR' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #070F1E 0%, #0F1F35 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            textAlign: 'center',
            color: '#94A3B8',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxSizing: 'border-box',
            zIndex: 3
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D4AF37',
              marginBottom: '0.5rem'
            }}
          >
            <ImageIcon size={20} />
          </div>

          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '0.2rem' }}>
            {fallbackTitle}
          </span>

          {showFallbackMessage && (
            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
              Media temporarily unavailable
            </span>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

/**
 * Robust Public Media Component
 * States: LOADING | READY | ERROR
 * Never shows browser broken-image icons.
 * Gracefully renders fallback placeholder on error.
 */
export default function NECImage({
  src,
  alt = 'NEC Institutional Asset',
  width,
  height,
  className = '',
  style = {},
  objectFit = 'cover',
  objectPosition = 'center',
  priority = false,
  fallbackText = null,
  aspectRatio = null,
  onClick = null
}) {
  const [imageState, setImageState] = useState('LOADING'); // 'LOADING' | 'READY' | 'ERROR'

  const handleLoad = () => {
    setImageState('READY');
  };

  const handleError = () => {
    setImageState('ERROR');
  };

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        height: height ? (typeof height === 'number' ? `${height}px` : height) : '100%',
        aspectRatio: aspectRatio || (width && height ? `${width} / ${height}` : undefined),
        background: '#F1F5F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
      className={`nec-image-wrapper ${className}`}
      onClick={onClick}
    >
      {/* Loading Skeleton */}
      {imageState === 'LOADING' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #F1F5F9 0%, #E2E8F0 50%, #F1F5F9 100%)',
            backgroundSize: '200% 100%',
            animation: 'necShimmer 1.5s infinite',
            zIndex: 1
          }}
        />
      )}

      {/* Main Image */}
      {imageState !== 'ERROR' && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            objectPosition,
            opacity: imageState === 'READY' ? 1 : 0,
            transform: imageState === 'READY' ? 'scale(1)' : 'scale(1.02)',
            transition: 'opacity 0.35s ease, transform 0.4s ease',
            zIndex: 2
          }}
        />
      )}

      {/* Error / Controlled Fallback */}
      {imageState === 'ERROR' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94A3B8',
            padding: '1rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            width: '100%',
            height: '100%',
            background: '#F8FAFC'
          }}
        >
          <ImageIcon size={22} style={{ marginBottom: '0.35rem', opacity: 0.6 }} />
          <span>{fallbackText || alt || 'Image Preview'}</span>
        </div>
      )}

      <style>{`
        @keyframes necShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

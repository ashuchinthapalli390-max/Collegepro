import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Maximize2 } from 'lucide-react';
import NECImage from './NECImage.jsx';
import NECVideo from './NECVideo.jsx';

/**
 * Accessible Fullscreen Media Lightbox Modal
 */
export default function MediaLightboxModal({
  isOpen,
  onClose,
  items = [],
  currentIndex = 0,
  onNavigate
}) {
  const currentItem = items[currentIndex] || null;

  // Keyboard navigation listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && items.length > 1) {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      } else if (e.key === 'ArrowRight' && items.length > 1) {
        onNavigate((currentIndex + 1) % items.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  if (!isOpen || !currentItem) return null;

  const isVideo = currentItem.mediaType === 'VIDEO' || currentItem.file?.endsWith('.mp4');

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(7, 15, 30, 0.92)',
            backdropFilter: 'blur(12px)'
          }}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Lightbox"
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'background 0.2s'
          }}
        >
          <X size={22} />
        </button>

        {/* Previous Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((currentIndex - 1 + items.length) % items.length)}
            aria-label="Previous Media"
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <ChevronLeft size={26} />
          </button>
        )}

        {/* Next Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((currentIndex + 1) % items.length)}
            aria-label="Next Media"
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <ChevronRight size={26} />
          </button>
        )}

        {/* Main Content Modal Container */}
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            zIndex: 5,
            width: '90vw',
            maxWidth: '1000px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#0B192C',
            borderRadius: '20px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
          }}
        >
          {/* Media Player / Image Area */}
          <div style={{ position: 'relative', width: '100%', maxHeight: '68vh', background: '#000000', overflow: 'hidden' }}>
            {isVideo ? (
              <NECVideo
                id={`modal-${currentItem.id}`}
                src={currentItem.publicUrl || currentItem.storagePath || currentItem.file}
                poster={currentItem.posterUrl || currentItem.poster}
                title={currentItem.title}
                category={currentItem.category}
                duration={currentItem.durationFormatted || currentItem.duration}
                aspectRatio="16/9"
                style={{ width: '100%', height: '100%', maxHeight: '68vh' }}
              />
            ) : (
              <NECImage
                src={currentItem.publicUrl || currentItem.storagePath || currentItem.file}
                alt={currentItem.altText || currentItem.title}
                aspectRatio="16/9"
                style={{ width: '100%', height: '100%', maxHeight: '68vh', objectFit: 'contain' }}
              />
            )}
          </div>

          {/* Caption & Metadata Footer */}
          <div style={{ padding: '1.2rem 1.8rem', background: '#0B192C', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {currentItem.category}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>•</span>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {currentIndex + 1} of {items.length}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {currentItem.title}
              </h3>
              {currentItem.description && (
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.3rem 0 0 0', maxWidth: '750px' }}>
                  {currentItem.description}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

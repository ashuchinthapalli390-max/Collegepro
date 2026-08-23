import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Image as ImageIcon, 
  Sparkles,
  Camera,
  Film
} from 'lucide-react';
import { MEDIA_ASSETS, getMediaByType } from '../../data/mediaAssets.js';
import { MediaImageCard, MediaVideoCard, MediaLightboxModal } from '../media/index.js';
import { staggerContainer, staggerChild } from '../../lib/motion/variants.js';

export default function VirtualTour() {
  const [activeMediaTab, setActiveMediaTab] = useState('videos'); // 'videos' | 'photos'
  const [photoCategory, setPhotoCategory] = useState('All');
  const [videoCategory, setVideoCategory] = useState('All');

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allPhotos = getMediaByType('IMAGE');
  const allVideos = getMediaByType('VIDEO');

  // Dynamically extract unique verified categories
  const photoCategories = ['All', ...Array.from(new Set(allPhotos.map(p => p.category)))];
  const videoCategories = ['All', ...Array.from(new Set(allVideos.map(v => v.category)))];

  const filteredPhotos = allPhotos.filter(p => photoCategory === 'All' || p.category === photoCategory);
  const filteredVideos = allVideos.filter(v => videoCategory === 'All' || v.category === videoCategory);

  const currentMediaList = activeMediaTab === 'videos' ? filteredVideos : filteredPhotos;

  const handleOpenPhotoLightbox = (photo) => {
    const idx = filteredPhotos.findIndex(p => p.id === photo.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  return (
    <section 
      aria-label="NEC Virtual Campus Tour and Media Gallery"
      style={{ padding: '5.5rem 0', background: '#070F1E', color: '#FFFFFF', position: 'relative' }}
    >
      <div className="container">
        {/* Section Header */}
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <span className="badge badge-gold" style={{ marginBottom: '0.6rem' }}>
            Cinematic Campus Experience
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#FFFFFF', marginBottom: '0.8rem', fontFamily: 'Cinzel, Georgia, serif' }}>
            Virtual Campus Tour & Media Gallery
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '750px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Explore our 40-acre lush green campus, monumental academic blocks, high-tech digital laboratories, sports arenas, transport fleets, and vibrant student life through authentic high-definition videos and verified photography.
          </p>
        </motion.div>

        {/* Media Switcher (Videos vs Photography) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '2.5rem' }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveMediaTab('videos')}
            style={{
              padding: '0.75rem 1.8rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              background: activeMediaTab === 'videos' ? 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)' : 'rgba(255,255,255,0.08)',
              color: activeMediaTab === 'videos' ? '#070F1E' : '#FFFFFF',
              border: '1px solid ' + (activeMediaTab === 'videos' ? '#D4AF37' : 'rgba(255,255,255,0.15)'),
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: activeMediaTab === 'videos' ? '0 4px 20px rgba(212, 175, 55, 0.4)' : 'none'
            }}
          >
            <Video size={18} /> Campus Videos ({allVideos.length} Clips)
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveMediaTab('photos')}
            style={{
              padding: '0.75rem 1.8rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              background: activeMediaTab === 'photos' ? 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)' : 'rgba(255,255,255,0.08)',
              color: activeMediaTab === 'photos' ? '#070F1E' : '#FFFFFF',
              border: '1px solid ' + (activeMediaTab === 'photos' ? '#D4AF37' : 'rgba(255,255,255,0.15)'),
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: activeMediaTab === 'photos' ? '0 4px 20px rgba(212, 175, 55, 0.4)' : 'none'
            }}
          >
            <ImageIcon size={18} /> Campus Photography ({allPhotos.length} Views)
          </motion.button>
        </div>

        {/* VIDEOS SHOWCASE */}
        {activeMediaTab === 'videos' && (
          <div>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {videoCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setVideoCategory(cat)}
                  style={{
                    padding: '0.45rem 1.1rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: videoCategory === cat ? '#D4AF37' : 'rgba(255,255,255,0.06)',
                    color: videoCategory === cat ? '#070F1E' : '#CBD5E1',
                    border: '1px solid ' + (videoCategory === cat ? '#D4AF37' : 'rgba(255,255,255,0.1)'),
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Video Cards Grid */}
            {filteredVideos.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.15)' }}>
                <Film size={32} style={{ color: '#D4AF37', marginBottom: '0.8rem' }} />
                <h4 style={{ color: '#FFFFFF', marginBottom: '0.3rem' }}>No Verified Videos in Category</h4>
                <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>Please select another category above.</p>
              </div>
            ) : (
              <motion.div 
                className="grid-3" 
                style={{ gap: '1.8rem' }}
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
              >
                {filteredVideos.map(video => (
                  <motion.div key={video.id} variants={staggerChild}>
                    <MediaVideoCard item={video} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* PHOTOGRAPHY MASONRY */}
        {activeMediaTab === 'photos' && (
          <div>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {photoCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setPhotoCategory(cat)}
                  style={{
                    padding: '0.45rem 1.1rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: photoCategory === cat ? '#D4AF37' : 'rgba(255,255,255,0.06)',
                    color: photoCategory === cat ? '#070F1E' : '#CBD5E1',
                    border: '1px solid ' + (photoCategory === cat ? '#D4AF37' : 'rgba(255,255,255,0.1)'),
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Photo Grid */}
            {filteredPhotos.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.15)' }}>
                <Camera size={32} style={{ color: '#D4AF37', marginBottom: '0.8rem' }} />
                <h4 style={{ color: '#FFFFFF', marginBottom: '0.3rem' }}>No Verified Photos in Category</h4>
                <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>Please select another category above.</p>
              </div>
            ) : (
              <motion.div 
                className="grid-4" 
                style={{ gap: '1.5rem' }}
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
              >
                {filteredPhotos.map(photo => (
                  <motion.div key={photo.id} variants={staggerChild}>
                    <MediaImageCard 
                      item={photo} 
                      onClick={() => handleOpenPhotoLightbox(photo)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Media Lightbox Modal */}
      <MediaLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={currentMediaList}
        currentIndex={lightboxIndex}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </section>
  );
}

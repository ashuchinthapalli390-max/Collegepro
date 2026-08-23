import React, { useState } from 'react';
import { 
  Play, 
  Video, 
  Image as ImageIcon, 
  Camera, 
  X, 
  Maximize2, 
  Filter, 
  Layers, 
  Eye, 
  Sparkles 
} from 'lucide-react';
import { CAMPUS_VIDEOS, CAMPUS_PHOTOS } from '../../data/masterData.js';

export default function VirtualTour() {
  const [activeMediaTab, setActiveMediaTab] = useState('videos');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoCategory, setPhotoCategory] = useState('All');
  const [videoCategory, setVideoCategory] = useState('All');

  const photoCategories = ['All', 'Campus', 'Infrastructure', 'Night Views', 'Student Life'];
  const videoCategories = ['All', 'Campus Overview', 'Infrastructure', 'Campus Life', 'Sports', 'Student Life', 'Facilities'];

  const filteredPhotos = CAMPUS_PHOTOS.filter(p => photoCategory === 'All' || p.category === photoCategory);
  const filteredVideos = CAMPUS_VIDEOS.filter(v => videoCategory === 'All' || v.category === videoCategory);

  return (
    <section style={{ padding: '5rem 0', background: '#070F1E', color: '#FFFFFF' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.6rem' }}>
            Cinematic Campus Experience
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#FFFFFF', marginBottom: '0.8rem' }}>
            Virtual Campus Tour & Media Gallery
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '750px', margin: '0 auto', fontSize: '1.05rem' }}>
            Explore our 40-acre lush green campus, monumental academic blocks, high-tech digital laboratories, sports arenas, transport fleets, and vibrant student life through authentic high-definition videos and photography.
          </p>
        </div>

        {/* Media Switcher (Videos vs Photography) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '2.5rem' }}>
          <button
            onClick={() => setActiveMediaTab('videos')}
            style={{
              padding: '0.75rem 1.8rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              background: activeMediaTab === 'videos' ? 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)' : 'rgba(255,255,255,0.08)',
              color: activeMediaTab === 'videos' ? '#070F1E' : '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Video size={18} /> Campus Videos ({CAMPUS_VIDEOS.length} Clips)
          </button>

          <button
            onClick={() => setActiveMediaTab('photos')}
            style={{
              padding: '0.75rem 1.8rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              background: activeMediaTab === 'photos' ? 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)' : 'rgba(255,255,255,0.08)',
              color: activeMediaTab === 'photos' ? '#070F1E' : '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ImageIcon size={18} /> Campus Photography ({CAMPUS_PHOTOS.length} Views)
          </button>
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
                    padding: '0.4rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: videoCategory === cat ? '#D4AF37' : 'rgba(255,255,255,0.06)',
                    color: videoCategory === cat ? '#070F1E' : '#CBD5E1',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Video Cards Grid */}
            <div className="grid-3" style={{ gap: '1.8rem' }}>
              {filteredVideos.map(video => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="glass-card-dark card-hover"
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255,255,255,0.12)'
                  }}
                >
                  {/* Video Thumbnail Wrapper with Hover Overlay */}
                  <div style={{ position: 'relative', width: '100%', height: '200px', background: '#000000', overflow: 'hidden' }}>
                    <video
                      src={video.file}
                      muted
                      preload="metadata"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(7, 15, 30, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.3s ease'
                    }}>
                      <div style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#070F1E',
                        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.6)'
                      }}>
                        <Play size={24} style={{ marginLeft: '4px' }} />
                      </div>
                    </div>

                    <span style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      background: 'rgba(0,0,0,0.75)',
                      color: '#FFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {video.duration}
                    </span>

                    <span style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(11, 25, 44, 0.85)',
                      color: '#D4AF37',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(212, 175, 55, 0.3)'
                    }}>
                      {video.category}
                    </span>
                  </div>

                  {/* Video Metadata */}
                  <div style={{ padding: '1.2rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                      {video.title}
                    </h4>
                    <p style={{ color: '#94A3B8', fontSize: '0.82rem', lineHeight: 1.5 }}>
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
                    padding: '0.4rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: photoCategory === cat ? '#D4AF37' : 'rgba(255,255,255,0.06)',
                    color: photoCategory === cat ? '#070F1E' : '#CBD5E1',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Photo Grid */}
            <div className="grid-3" style={{ gap: '1.8rem' }}>
              {filteredPhotos.map(photo => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="glass-card-dark card-hover"
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: '#0D1B2A'
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
                    <img
                      src={photo.file}
                      alt={photo.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(7, 15, 30, 0.85)',
                      color: '#D4AF37',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(212, 175, 55, 0.3)'
                    }}>
                      {photo.category}
                    </div>
                  </div>

                  <div style={{ padding: '1.2rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.3rem' }}>
                      {photo.title}
                    </h4>
                    <p style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                      {photo.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Video Player Modal */}
      {selectedVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.92)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4000,
          padding: '1.5rem'
        }}>
          <div style={{
            maxWidth: '1000px',
            width: '100%',
            background: '#070F1E',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.8)',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedVideo(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <X size={22} />
            </button>

            <div style={{ position: 'relative', width: '100%', height: '520px', background: '#000' }}>
              <video
                src={selectedVideo.file}
                autoPlay
                controls
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ padding: '1.5rem 2rem', background: '#0B192C' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className="badge badge-gold">{selectedVideo.category}</span>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Duration: {selectedVideo.duration}</span>
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', marginBottom: '0.4rem' }}>
                {selectedVideo.title}
              </h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.92rem' }}>
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 4000,
            padding: '1.5rem',
            cursor: 'pointer'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '900px',
              width: '100%',
              background: '#070F1E',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>

            <img
              src={selectedPhoto.file}
              alt={selectedPhoto.title}
              style={{ width: '100%', maxHeight: '600px', objectFit: 'contain', display: 'block', background: '#000' }}
            />

            <div style={{ padding: '1.2rem 1.8rem', background: '#0B192C' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.3rem' }}>{selectedPhoto.category}</span>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '0.2rem' }}>{selectedPhoto.title}</h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.88rem' }}>{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

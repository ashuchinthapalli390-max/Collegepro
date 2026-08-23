import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  ExternalLink,
  ChevronRight,
  UploadCloud,
  X,
  Sparkles
} from 'lucide-react';
import { MEDIA_ASSETS, getMediaByType } from '../../../data/mediaAssets.js';
import { MotionPage, ModulePageHeader } from '../../motion/index.js';
import { NECImage, NECVideo, MediaLightboxModal } from '../../media/index.js';

export default function MediaGalleryManager({ currentUser }) {
  const [activeTab, setActiveTab] = useState('PHOTOS');
  const [search, setSearch] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const photos = getMediaByType('IMAGE');
  const videos = getMediaByType('VIDEO');

  const filteredPhotos = photos.filter(p => {
    const q = search.toLowerCase();
    return !q || (p.title && p.title.toLowerCase().includes(q)) || (p.category && p.category.toLowerCase().includes(q));
  });

  const filteredVideos = videos.filter(v => {
    const q = search.toLowerCase();
    return !q || (v.title && v.title.toLowerCase().includes(q)) || (v.category && v.category.toLowerCase().includes(q));
  });

  const currentList = activeTab === 'PHOTOS' ? filteredPhotos : filteredVideos;

  const handleOpenLightbox = (item) => {
    const idx = currentList.findIndex(i => i.id === item.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  return (
    <MotionPage style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      {/* Module Header */}
      <ModulePageHeader
        breadcrumb={["Dashboard", "Events & Outreach", "Campus Media & Gallery"]}
        eyebrow="Institutional Digital Assets"
        title="Media & Campus Gallery Governance"
        description="Curate and govern verified photographic archives, aerial campus videography, and institutional branding materials."
        actions={
          <button
            type="button"
            onClick={() => alert('New media item upload modal is ready for institutional administrator.')}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)', 
              color: '#070F1E', 
              padding: '0.55rem 1.05rem', 
              borderRadius: '8px', 
              fontWeight: 800, 
              fontSize: '0.8rem', 
              border: 'none', 
              cursor: 'pointer' 
            }}
          >
            <Plus size={15} /> Upload Media Asset
          </button>
        }
      />

      {/* Tabs & Search */}
      <div style={{ background: '#FFFFFF', padding: '0.9rem 1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('PHOTOS')}
            style={{ padding: '0.45rem 0.95rem', borderRadius: '8px', border: 'none', background: activeTab === 'PHOTOS' ? '#070F1E' : '#F1F5F9', color: activeTab === 'PHOTOS' ? '#F1C40F' : '#475569', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Photos Archive ({photos.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('VIDEOS')}
            style={{ padding: '0.45rem 0.95rem', borderRadius: '8px', border: 'none', background: activeTab === 'VIDEOS' ? '#070F1E' : '#F1F5F9', color: activeTab === 'VIDEOS' ? '#F1C40F' : '#475569', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Campus Videos ({videos.length})
          </button>
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search media by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.45rem 0.6rem 0.45rem 2rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Media Grid */}
      {activeTab === 'PHOTOS' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id} 
              onClick={() => handleOpenLightbox(photo)}
              style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                <NECImage 
                  src={photo.publicUrl || photo.storagePath} 
                  alt={photo.altText || photo.title} 
                  aspectRatio="16/9"
                />
                <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(7, 15, 30, 0.85)', color: '#F1C40F', fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '4px', backdropFilter: 'blur(4px)', zIndex: 5 }}>
                  {photo.category}
                </span>
              </div>
              <div style={{ padding: '0.95rem' }}>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.86rem', marginBottom: '0.25rem' }}>{photo.title}</div>
                <div style={{ fontSize: '0.74rem', color: '#64748B', lineHeight: 1.4 }}>{photo.description}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredVideos.map((video) => (
            <div 
              key={video.id} 
              style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                <NECVideo 
                  id={`portal-${video.id}`}
                  src={video.publicUrl || video.storagePath} 
                  poster={video.posterUrl}
                  title={video.title}
                  category={video.category}
                  duration={video.durationFormatted}
                  aspectRatio="16/9"
                />
              </div>
              <div style={{ padding: '0.95rem' }}>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.86rem', marginBottom: '0.25rem' }}>{video.title}</div>
                <div style={{ fontSize: '0.74rem', color: '#64748B', lineHeight: 1.4 }}>{video.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <MediaLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={currentList}
        currentIndex={lightboxIndex}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </MotionPage>
  );
}

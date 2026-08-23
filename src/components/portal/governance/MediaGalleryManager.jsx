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
  X
} from 'lucide-react';
import { CAMPUS_PHOTOS, CAMPUS_VIDEOS } from '../../../data/masterData.js';

export default function MediaGalleryManager({ currentUser }) {
  const [activeTab, setActiveTab] = useState('PHOTOS');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const photos = CAMPUS_PHOTOS || [];
  const videos = CAMPUS_VIDEOS || [];

  const filteredPhotos = photos.filter(p => {
    const q = search.toLowerCase();
    return !q || (p.title && p.title.toLowerCase().includes(q)) || (p.category && p.category.toLowerCase().includes(q));
  });

  const filteredVideos = videos.filter(v => {
    const q = search.toLowerCase();
    return !q || (v.title && v.title.toLowerCase().includes(q)) || (v.category && v.category.toLowerCase().includes(q));
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Events & Outreach</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Campus Media & Gallery</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Media & Campus Gallery Governance
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Manage verified photographic archives, aerial campus videography, and event press releases.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('New media item upload modal is ready for institutional administrator.')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)', color: '#070F1E', padding: '0.55rem 1.05rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={15} /> Upload Media Asset
        </button>
      </div>

      {/* Tabs & Search */}
      <div style={{ background: '#FFFFFF', padding: '0.9rem 1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('PHOTOS')}
            style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', border: 'none', background: activeTab === 'PHOTOS' ? '#070F1E' : '#F1F5F9', color: activeTab === 'PHOTOS' ? '#F1C40F' : '#475569', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Photos Archive ({photos.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('VIDEOS')}
            style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', border: 'none', background: activeTab === 'VIDEOS' ? '#070F1E' : '#F1F5F9', color: activeTab === 'VIDEOS' ? '#F1C40F' : '#475569', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Campus Videos ({videos.length})
          </button>
        </div>

        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search media by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.45rem 0.6rem 0.45rem 2rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Media Grid */}
      {activeTab === 'PHOTOS' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {filteredPhotos.map((photo, i) => (
            <div key={photo.id || i} style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', background: '#070F1E', position: 'relative', overflow: 'hidden' }}>
                <img src={photo.url || photo.src} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(7, 15, 30, 0.75)', color: '#F1C40F', fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', backdropFilter: 'blur(4px)' }}>
                  {photo.category || 'Campus'}
                </span>
              </div>
              <div style={{ padding: '0.85rem' }}>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.84rem', marginBottom: '0.2rem' }}>{photo.title}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{photo.description || 'Verified Campus Photograph'}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filteredVideos.map((video, i) => (
            <div key={video.id || i} style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', background: '#000000', position: 'relative' }}>
                <video src={video.url || video.src} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '0.85rem' }}>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.84rem', marginBottom: '0.2rem' }}>{video.title}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{video.category || 'Campus Videography'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Users, 
  Building2, 
  FileText, 
  Lightbulb, 
  Trophy, 
  Video, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { FACULTY_DATA, DEPARTMENTS } from '../../data/masterData.js';
import { MEDIA_ASSETS, getMediaByType } from '../../data/mediaAssets.js';
import { getPublications, getPatents, getStudentAchievements } from '../../data/portalStore.js';

export default function GlobalSearchModal({ 
  isOpen, 
  onClose, 
  onSelectFaculty, 
  onSelectDepartment, 
  onNavigateTab 
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingFaculty = q ? FACULTY_DATA.filter(f => 
    f.name.toLowerCase().includes(q) || 
    f.id.toLowerCase().includes(q) || 
    f.department.toLowerCase().includes(q) ||
    f.qualification.toLowerCase().includes(q)
  ).slice(0, 5) : [];

  const matchingDepartments = q ? DEPARTMENTS.filter(d => 
    d.name.toLowerCase().includes(q) || 
    d.code.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchingPubs = q ? getPublications().filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.firstAuthor.toLowerCase().includes(q) ||
    (p.doi || '').toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchingPatents = q ? getPatents().filter(pat => 
    pat.title.toLowerCase().includes(q) || 
    pat.facultyName.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchingVideos = q ? getMediaByType('VIDEO').filter(v => 
    v.title.toLowerCase().includes(q) || 
    v.category.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const totalMatches = matchingFaculty.length + matchingDepartments.length + matchingPubs.length + matchingPatents.length + matchingVideos.length;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(7, 15, 30, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 9000,
        padding: '5rem 1.5rem 2rem'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '680px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          position: 'relative'
        }}
      >
        {/* Search Input Bar */}
        <div style={{
          padding: '1.2rem 1.5rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: '#F8FAFC'
        }}>
          <Search size={22} style={{ color: '#D4AF37' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search 418 faculty, 13 departments, publications, patents, videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '1.05rem',
              color: '#0B192C',
              fontWeight: 500
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: '#94A3B8' }}>
              <X size={18} />
            </button>
          )}
          <span style={{ fontSize: '0.72rem', background: '#E2E8F0', padding: '3px 8px', borderRadius: '4px', color: '#64748B', fontWeight: 600 }}>
            ESC
          </span>
        </div>

        {/* Search Results Container */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '1rem' }}>
          {!query && (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
              Type a name (e.g. <em>Dr. B. Jhansi Vazram</em>, <em>Dr. V. Venkata Rao</em>), department (<em>CSE</em>, <em>ECE</em>), or keyword to search the entire institution.
            </div>
          )}

          {query && totalMatches === 0 && (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
              No institutional records matching "<strong>{query}</strong>".
            </div>
          )}

          {/* 1. Faculty Results */}
          {matchingFaculty.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                Verified Faculty Members
              </div>
              {matchingFaculty.map(f => (
                <div
                  key={f.id}
                  onClick={() => {
                    onSelectFaculty(f);
                    onNavigateTab('faculty');
                    onClose();
                  }}
                  style={{
                    padding: '0.7rem 0.9rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0B192C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontWeight: 700, fontSize: '0.75rem' }}>
                      {f.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0B192C', fontSize: '0.92rem' }}>{f.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{f.designation} • {f.department} ({f.id})</div>
                    </div>
                  </div>
                  <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>View Bio</span>
                </div>
              ))}
            </div>
          )}

          {/* 2. Department Results */}
          {matchingDepartments.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                Academic Departments
              </div>
              {matchingDepartments.map(d => (
                <div
                  key={d.id}
                  onClick={() => {
                    onSelectDepartment(d);
                    onNavigateTab('departments');
                    onClose();
                  }}
                  style={{
                    padding: '0.7rem 0.9rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#0B192C', fontSize: '0.92rem' }}>Department of {d.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>HOD: {d.hodName} • Code: {d.code}</div>
                  </div>
                  <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>Department Portal</span>
                </div>
              ))}
            </div>
          )}

          {/* 3. Publications & Patents */}
          {matchingPubs.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                Research Publications
              </div>
              {matchingPubs.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    onNavigateTab('research');
                    onClose();
                  }}
                  style={{
                    padding: '0.6rem 0.9rem',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontWeight: 600, color: '#0B192C', fontSize: '0.88rem' }}>{p.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{p.firstAuthor} • {p.journalConference}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div style={{
          padding: '0.7rem 1.5rem',
          background: '#070F1E',
          color: '#94A3B8',
          fontSize: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Press <strong>Ctrl+K</strong> to launch search anywhere</span>
          <span>Narasaraopeta Engineering College Portal</span>
        </div>
      </div>
    </div>
  );
}

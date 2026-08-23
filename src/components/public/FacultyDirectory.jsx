import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  BookOpen, 
  Award, 
  ExternalLink, 
  Grid, 
  List, 
  X, 
  Building2, 
  GraduationCap, 
  FileText, 
  Lightbulb, 
  CheckCircle2,
  User
} from 'lucide-react';
import { FACULTY_DATA } from '../../data/masterData.js';
import { getPublications, getPatents, getMemberships, getNPTEL } from '../../data/portalStore.js';
import FacultyAvatar from '../common/FacultyAvatar.jsx';

export default function FacultyDirectory({ selectedFacultyFromParent, onClearSelectedFaculty }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDesignation, setSelectedDesignation] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFaculty, setSelectedFaculty] = useState(selectedFacultyFromParent || null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;

  const departmentFilters = [
    'All', 'CSE', 'ECE', 'EEE', 'MEC', 'CE', 'IT', 'CSE (AI)', 'CSE (AI&ML / CS / DS)', 'MCA', 'MBA', 'BS&H (English)', 'BS&H (Mathematics)', 'BS&H (Physics)', 'BS&H (Chemistry)'
  ];

  const filteredFaculty = useMemo(() => {
    return (FACULTY_DATA || []).filter(f => {
      if (!f) return false;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
                            (f.name || '').toLowerCase().includes(q) || 
                            (f.department || '').toLowerCase().includes(q) || 
                            (f.qualification || '').toLowerCase().includes(q) ||
                            (f.summary || '').toLowerCase().includes(q);

      const matchesDept = selectedDept === 'All' || 
                          (selectedDept === 'CSE' && f.department === 'CSE') ||
                          (f.department || '').toLowerCase().includes(selectedDept.toLowerCase());

      const desig = f.designation || '';
      const matchesDesig = selectedDesignation === 'All' || 
                           (selectedDesignation === 'Professor' && (desig.includes('Professor') && !desig.includes('Assoc') && !desig.includes('Asst'))) ||
                           (selectedDesignation === 'Assoc. Professor' && desig.includes('Assoc')) ||
                           (selectedDesignation === 'Asst. Professor' && desig.includes('Asst'));

      return matchesSearch && matchesDept && matchesDesig;
    });
  }, [searchQuery, selectedDept, selectedDesignation]);

  const totalPages = Math.max(1, Math.ceil(filteredFaculty.length / itemsPerPage));
  const paginatedFaculty = filteredFaculty.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const facultyPubs = selectedFaculty ? (getPublications() || []).filter(p => p.facultyName === selectedFaculty.name || p.firstAuthor === selectedFaculty.name) : [];
  const facultyPatents = selectedFaculty ? (getPatents() || []).filter(p => p.facultyName === selectedFaculty.name) : [];

  return (
    <section style={{ padding: '4.5rem 0', background: '#F8FAFC', width: '100%' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-navy" style={{ marginBottom: '0.5rem' }}>
            Official Institutional Repository
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.6rem)', color: '#0B192C', marginBottom: '0.6rem' }}>
            Faculty Directory ({FACULTY_DATA.length} Verified Scholars)
          </h2>
          <p style={{ color: '#64748B', maxWidth: '750px', margin: '0 auto', fontSize: '1rem' }}>
            Explore our 418 permanent faculty across 13 engineering, computing, management, and basic science departments with verified scholarly research identifiers.
          </p>
        </div>

        {/* Filter & Search Dashboard */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.4rem',
          border: '1px solid #E2E8F0',
          boxShadow: 'var(--shadow-xs)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by faculty name, qualification, department, specialization..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="form-control"
                style={{ paddingLeft: '2.4rem', paddingRight: '1rem', fontSize: '0.92rem' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Designation Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>Designation:</span>
              <select
                value={selectedDesignation}
                onChange={(e) => { setSelectedDesignation(e.target.value); setPage(1); }}
                className="form-control"
                style={{ width: 'auto', padding: '0.55rem 0.9rem' }}
              >
                <option value="All">All Designations</option>
                <option value="Professor">Professors</option>
                <option value="Assoc. Professor">Associate Professors</option>
                <option value="Asst. Professor">Assistant Professors</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '6px' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '4px',
                  background: viewMode === 'grid' ? '#0B192C' : 'transparent',
                  color: viewMode === 'grid' ? '#FFF' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem'
                }}
              >
                <Grid size={14} /> Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '4px',
                  background: viewMode === 'list' ? '#0B192C' : 'transparent',
                  color: viewMode === 'list' ? '#FFF' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem'
                }}
              >
                <List size={14} /> List
              </button>
            </div>
          </div>

          {/* Department Filter Pills */}
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', borderTop: '1px solid #F1F5F9', paddingTop: '0.8rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
              <Filter size={13} /> Department:
            </span>
            {departmentFilters.map(dept => (
              <button
                key={dept}
                onClick={() => { setSelectedDept(dept); setPage(1); }}
                style={{
                  padding: '0.25rem 0.7rem',
                  borderRadius: '9999px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  background: selectedDept === dept ? '#0B192C' : '#F1F5F9',
                  color: selectedDept === dept ? '#FFFFFF' : '#334155',
                  border: '1px solid ' + (selectedDept === dept ? '#0B192C' : 'transparent'),
                  transition: 'all 0.15s ease'
                }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', color: '#64748B', fontSize: '0.85rem' }}>
          <span>Showing <strong>{filteredFaculty.length}</strong> verified faculty profiles</span>
          <span>Page {page} of {totalPages || 1}</span>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
            {paginatedFaculty.map(fac => (
              <div
                key={fac.id}
                onClick={() => setSelectedFaculty(fac)}
                className="glass-card-light card-hover"
                style={{
                  padding: '1.5rem',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem', gap: '0.8rem' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.4rem' }}>
                        <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>{fac.department}</span>
                        <span className="badge badge-navy" style={{ fontSize: '0.68rem' }}>Verified Faculty</span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B192C', marginBottom: '0.15rem' }}>
                        {fac.name}
                      </h3>
                      <div style={{ color: '#C59B27', fontSize: '0.82rem', fontWeight: 700 }}>
                        {fac.designation}
                      </div>
                      <div style={{ color: '#64748B', fontSize: '0.75rem', fontStyle: 'italic' }}>
                        {fac.qualification}
                      </div>
                    </div>

                    <FacultyAvatar 
                      photo={fac.photo} 
                      name={fac.name} 
                      width="56px" 
                      height="64px" 
                      borderRadius="8px" 
                      showLabel={false}
                    />
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.45, marginBottom: '1rem' }}>
                    {fac.summary.length > 110 ? fac.summary.slice(0, 110) + '...' : fac.summary}
                  </p>
                </div>

                <div>
                  {/* Research Badges */}
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', borderTop: '1px solid #F1F5F9', paddingTop: '0.6rem', marginBottom: '0.8rem' }}>
                    {fac.orcid && <span className="badge" style={{ background: '#A6CE3920', color: '#5B8C00', fontSize: '0.65rem' }}>ORCID</span>}
                    {fac.scopus && <span className="badge" style={{ background: '#FF6C0020', color: '#D4380D', fontSize: '0.65rem' }}>Scopus</span>}
                    {fac.scholar && <span className="badge" style={{ background: '#4285F420', color: '#1D39C4', fontSize: '0.65rem' }}>Scholar</span>}
                    {fac.vidwan && <span className="badge" style={{ background: '#FAAD1420', color: '#D48806', fontSize: '0.65rem' }}>Vidwan</span>}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748B' }}>
                    <span>Citations: <strong style={{ color: '#0B192C' }}>{fac.citations}</strong></span>
                    <span style={{ color: '#D4AF37', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      View Profile <ExternalLink size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ background: '#0B192C', color: '#FFFFFF' }}>
                    <th style={{ padding: '0.8rem 1rem' }}>Faculty Scholar</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Designation</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Department</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Qualification</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Research Profiles</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFaculty.map((fac, idx) => (
                    <tr 
                      key={fac.id} 
                      onClick={() => setSelectedFaculty(fac)}
                      style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC', cursor: 'pointer' }}
                    >
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 700, color: '#0B192C' }}>{fac.name}</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#334155' }}>{fac.designation}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <span className="badge badge-navy">{fac.department}</span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: '#64748B', fontSize: '0.8rem' }}>{fac.qualification}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {fac.orcid && <span className="badge" style={{ background: '#A6CE3920', color: '#5B8C00', fontSize: '0.62rem' }}>ORCID</span>}
                          {fac.scopus && <span className="badge" style={{ background: '#FF6C0020', color: '#D4380D', fontSize: '0.62rem' }}>Scopus</span>}
                        </div>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>
                        <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.8rem' }}>View</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                fontWeight: 600,
                color: page === 1 ? '#CBD5E1' : '#0B192C',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.82rem'
              }}
            >
              Previous
            </button>

            {Array.from({ length: Math.min(6, totalPages) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    background: page === p ? '#0B192C' : '#FFFFFF',
                    color: page === p ? '#FFFFFF' : '#334155',
                    border: '1px solid ' + (page === p ? '#0B192C' : '#E2E8F0'),
                    fontWeight: 700,
                    fontSize: '0.82rem'
                  }}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                fontWeight: 600,
                color: page === totalPages ? '#CBD5E1' : '#0B192C',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '0.82rem'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Comprehensive Faculty Profile Modal */}
      {selectedFaculty && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(7, 15, 30, 0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3500,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '820px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            <button
              onClick={() => { setSelectedFaculty(null); if (onClearSelectedFaculty) onClearSelectedFaculty(); }}
              style={{
                position: 'absolute',
                top: '1.2rem',
                right: '1.2rem',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>

            {/* Profile Header */}
            <div style={{
              background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 60%, #122846 100%)',
              padding: '2.5rem 2rem',
              color: '#FFFFFF',
              display: 'flex',
              gap: '1.8rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <FacultyAvatar
                photo={selectedFaculty.photo}
                name={selectedFaculty.name}
                width="100px"
                height="110px"
                borderRadius="12px"
              />

              <div style={{ flex: 1 }}>
                <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>{selectedFaculty.department}</span>
                <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>
                  {selectedFaculty.name}
                </h2>
                <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.92rem' }}>
                  {selectedFaculty.designation}
                </div>
                <div style={{ color: '#CBD5E1', fontSize: '0.82rem', fontStyle: 'italic' }}>
                  {selectedFaculty.qualification}
                </div>
              </div>
            </div>

            {/* Profile Body */}
            <div style={{ padding: '2rem' }}>
              {/* Research Identifiers Card */}
              <div style={{
                background: '#070F1E',
                borderRadius: '14px',
                padding: '1.2rem 1.4rem',
                color: '#FFFFFF',
                marginBottom: '1.5rem',
                border: '1px solid rgba(212, 175, 55, 0.25)'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                  Scholarly Research Identifiers & Citations
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.7rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>ORCID ID</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#A6CE39' }}>{selectedFaculty.orcid || 'Registered'}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Scopus ID</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FF7A45' }}>{selectedFaculty.scopus || 'Linked'}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Google Scholar</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#40A9FF' }}>{selectedFaculty.scholar || 'Verified'}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Vidwan ID</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFC53D' }}>{selectedFaculty.vidwan || 'Govt INFLIBNET'}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Citations / h-index</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#52C41A' }}>{selectedFaculty.citations} / h-{selectedFaculty.hIndex}</div>
                  </div>
                </div>
              </div>

              {/* Research Summary */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0B192C', marginBottom: '0.4rem' }}>
                  Professional Profile & Research Focus
                </h4>
                <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.6, background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  {selectedFaculty.summary}
                </p>
              </div>

              {/* Associated Publications / Patents */}
              {(facultyPubs.length > 0 || facultyPatents.length > 0) && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0B192C', marginBottom: '0.6rem' }}>
                    Verified Scholarly Outputs ({facultyPubs.length} Papers, {facultyPatents.length} Patents)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {facultyPubs.map(p => (
                      <div key={p.id} style={{ padding: '0.8rem', background: '#F1F5F9', borderRadius: '8px', borderLeft: '3px solid #D4AF37' }}>
                        <div style={{ fontWeight: 700, color: '#0B192C', fontSize: '0.86rem' }}>{p.title}</div>
                        <div style={{ color: '#64748B', fontSize: '0.76rem' }}>{p.journalConference} • {p.publicationDate} {p.doi && `• DOI: ${p.doi}`}</div>
                      </div>
                    ))}
                    {facultyPatents.map(pat => (
                      <div key={pat.id} style={{ padding: '0.8rem', background: '#FEF3C7', borderRadius: '8px', borderLeft: '3px solid #F59E0B' }}>
                        <div style={{ fontWeight: 700, color: '#92400E', fontSize: '0.86rem' }}>Patent: {pat.title}</div>
                        <div style={{ color: '#B45309', fontSize: '0.76rem' }}>Status: {pat.patentStatus}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ textAlign: 'right', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                <button
                  onClick={() => setSelectedFaculty(null)}
                  className="btn-navy"
                  style={{ padding: '0.5rem 1.4rem', fontSize: '0.84rem' }}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

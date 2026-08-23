import React, { useState } from 'react';
import { 
  FlaskConical, 
  Lightbulb, 
  FileText, 
  Award, 
  Search, 
  ExternalLink, 
  Filter, 
  CheckCircle2, 
  Cpu, 
  Handshake, 
  Layers, 
  Download,
  Users,
  Globe,
  Sparkles,
  BookOpen,
  X,
  Database
} from 'lucide-react';
import { getPublications, getPatents, getMoUs, getDatasetVersions } from '../../data/portalStore.js';
import { BRANDING_LOGOS, AICTE_IDEA_LAB_TEAM, FACULTY_DATA } from '../../data/masterData.js';
import { INDEXED_NEC_AUTHORS } from '../../lib/research/localIndex/datasetStore.js';
import { normalizeDOI } from '../../lib/research/localDiscoveryEngine.js';

export default function ResearchHub({ onOpenPortal }) {
  const [activeTab, setActiveTab] = useState('publications');
  const [pubSearch, setPubSearch] = useState('');
  const [patentSearch, setPatentSearch] = useState('');
  const [indexingFilter, setIndexingFilter] = useState('All');
  const [patentStatusFilter, setPatentStatusFilter] = useState('All');
  const [selectedResearcher, setSelectedResearcher] = useState(null);

  // Only display APPROVED + PUBLIC publications in the public website
  const allPublications = getPublications();
  const approvedPublicPubs = allPublications.filter(p => !p.isDeleted && p.workflowStatus !== 'REJECTED' && p.workflowStatus !== 'ARCHIVED');
  const patents = getPatents();
  const mous = getMoUs();
  const datasetVersions = getDatasetVersions();

  const filteredPubs = approvedPublicPubs.filter(p => {
    const q = pubSearch.toLowerCase().trim();
    if (!q) {
      if (indexingFilter === 'All') return true;
      if (indexingFilter === 'Scopus') return p.scopusIndexed === 'Yes';
      if (indexingFilter === 'WoS') return p.wosIndexed === 'Yes';
      if (indexingFilter === 'OpenAccess') return p.openAccess === true;
      return true;
    }

    const matchesSearch = (p.title || '').toLowerCase().includes(q) || 
                          (p.firstAuthor || '').toLowerCase().includes(q) || 
                          (p.journalConference || p.journalName || '').toLowerCase().includes(q) || 
                          (p.department || '').toLowerCase().includes(q) ||
                          (p.doi || '').toLowerCase().includes(q);

    const matchesIndex = indexingFilter === 'All' || 
                         (indexingFilter === 'Scopus' && p.scopusIndexed === 'Yes') ||
                         (indexingFilter === 'WoS' && p.wosIndexed === 'Yes') ||
                         (indexingFilter === 'OpenAccess' && p.openAccess === true);

    return matchesSearch && matchesIndex;
  });

  const filteredPatents = patents.filter(pat => {
    const q = patentSearch.toLowerCase();
    const matchesSearch = pat.title.toLowerCase().includes(q) || 
                          pat.facultyName.toLowerCase().includes(q) || 
                          pat.applicationNo.toLowerCase().includes(q) || 
                          pat.department.toLowerCase().includes(q);

    const matchesStatus = patentStatusFilter === 'All' || pat.patentStatus === patentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <section style={{ padding: '4.5rem 0', background: '#FFFFFF' }}>
      <div className="container">
        {/* Research Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 60%, #122846 100%)',
          borderRadius: '24px',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          color: '#FFFFFF',
          marginBottom: '2.5rem',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) 240px',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <span className="badge badge-gold">R&D Directorate & Innovation Hub</span>
              <span className="badge badge-navy">AICTE IDEA Lab Approved</span>
            </div>

            <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: '0.8rem', fontFamily: 'Cinzel, Georgia, serif' }}>
              Research, Patents & Global Inventions
            </h1>

            <p style={{ color: '#E2E8F0', fontSize: '1rem', lineHeight: 1.6, maxWidth: '750px', marginBottom: '1.5rem' }}>
              Explore peer-reviewed publications, granted patents, and verified faculty researchers indexed from open scholarly datasets. <strong>No login required.</strong>
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('publications')}
                className="btn-primary"
              >
                Browse Publications ({approvedPublicPubs.length})
              </button>
              <button
                onClick={() => setActiveTab('researchers')}
                className="btn-secondary"
              >
                Faculty Researchers ({INDEXED_NEC_AUTHORS.length})
              </button>
              <button
                onClick={() => setActiveTab('patents')}
                style={{
                  padding: '0.75rem 1.4rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFF',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Patents ({patents.length})
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={BRANDING_LOGOS.rdLogoNoBg || BRANDING_LOGOS.rdLogo}
              alt="R&D Logo"
              style={{ width: '130px', height: '130px', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
            />
            <div style={{ marginTop: '0.5rem', color: '#D4AF37', fontWeight: 700, fontSize: '0.85rem' }}>
              Centre of Research Excellence
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {[
            { id: 'publications', label: `Publications Directory (${approvedPublicPubs.length})`, icon: FileText },
            { id: 'researchers', label: `Faculty Researchers (${INDEXED_NEC_AUTHORS.length})`, icon: Users },
            { id: 'patents', label: `Patents Portfolio (${patents.length})`, icon: Lightbulb },
            { id: 'idea-lab', label: 'AICTE IDEA Lab', icon: Cpu },
            { id: 'mous', label: `MoUs & Collaborations (${mous.length})`, icon: Handshake }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  background: activeTab === tab.id ? '#0B192C' : '#F8FAFC',
                  color: activeTab === tab.id ? '#FFFFFF' : '#475569',
                  border: '1.5px solid ' + (activeTab === tab.id ? '#0B192C' : '#E2E8F0'),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <Icon size={16} style={{ color: activeTab === tab.id ? '#D4AF37' : 'inherit' }} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PUBLICATIONS DIRECTORY */}
        {activeTab === 'publications' && (
          <div>
            {/* Search & Filter Bar */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              marginBottom: '2rem',
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <div style={{ position: 'relative', flex: '1 1 300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search faculty author, paper title, DOI, department, or journal..."
                  value={pubSearch}
                  onChange={(e) => setPubSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem',
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['All', 'Scopus', 'WoS', 'OpenAccess'].map(f => (
                  <button
                    key={f}
                    onClick={() => setIndexingFilter(f)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: 'none',
                      background: indexingFilter === f ? '#070F1E' : '#FFFFFF',
                      color: indexingFilter === f ? '#F1C40F' : '#475569',
                      border: '1px solid ' + (indexingFilter === f ? '#070F1E' : '#CBD5E1'),
                      cursor: 'pointer'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Publications Grid */}
            {filteredPubs.length === 0 ? (
              <div style={{ padding: '3.5rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', color: '#64748B' }}>
                No approved publications match your search criteria.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
                {filteredPubs.map(pub => (
                  <div
                    key={pub.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      padding: '1.5rem',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#EFF6FF', color: '#1E40AF' }}>
                          {pub.department} • {pub.publicationYear || pub.academicYear}
                        </span>

                        {pub.doi && (
                          <a
                            href={`https://doi.org/${normalizeDOI(pub.doi)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}
                          >
                            DOI <ExternalLink size={11} />
                          </a>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.4, margin: '0 0 0.5rem' }}>
                        {pub.title}
                      </h3>

                      <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.4rem' }}>
                        <strong>Author(s):</strong> {pub.firstAuthor || pub.facultyName || 'NEC Faculty'}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#64748B', fontStyle: 'italic' }}>
                        {pub.journalConference || pub.journalName || 'Peer-Reviewed Publication'}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#94A3B8' }}>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {pub.scopusIndexed === 'Yes' && (
                          <span style={{ padding: '0.1rem 0.35rem', borderRadius: '4px', background: '#FFF7ED', color: '#C2410C', fontWeight: 700, border: '1px solid #FFEDD5' }}>
                            Scopus
                          </span>
                        )}
                        {pub.wosIndexed === 'Yes' && (
                          <span style={{ padding: '0.1rem 0.35rem', borderRadius: '4px', background: '#EFF6FF', color: '#1D4ED8', fontWeight: 700, border: '1px solid #DBEAFE' }}>
                            WoS
                          </span>
                        )}
                        {pub.sources && (
                          <span style={{ padding: '0.1rem 0.35rem', borderRadius: '4px', background: '#F1F5F9', color: '#475569', fontWeight: 700 }}>
                            {pub.sources.join(' • ')}
                          </span>
                        )}
                      </div>

                      <span style={{ fontWeight: 700, color: '#059669' }}>
                        ✓ Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FACULTY RESEARCHERS DIRECTORY */}
        {activeTab === 'researchers' && (
          <div>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem', fontFamily: 'Cinzel, serif' }}>
                Verified Faculty Researchers
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                Explore scholarly output, OpenAlex profiles, citations, and research areas of NEC faculty members.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {INDEXED_NEC_AUTHORS.map(author => (
                <div
                  key={author.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    padding: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#F1F5F9', color: '#334155' }}>
                        {author.department}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={13} /> OpenAlex Verified
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.2rem' }}>
                      {author.canonicalName}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '0.85rem' }}>
                      {author.designation}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '10px', marginBottom: '0.85rem', textAlign: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Works</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>{author.worksCount}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Citations</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669' }}>{author.citedByCount}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>h-index</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563EB' }}>{author.hIndex}</div>
                      </div>
                    </div>

                    {/* Topics */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {author.topics?.map((t, idx) => (
                        <span key={idx} style={{ fontSize: '0.66rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: '#EFF6FF', color: '#1E40AF', fontWeight: 600 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      {author.orcid && <span>ORCID: <strong>{author.orcid}</strong></span>}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedResearcher(author)}
                      style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', cursor: 'pointer' }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PATENTS PORTFOLIO */}
        {activeTab === 'patents' && (
          <div>
            <div style={{
              background: '#F8FAFC',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              marginBottom: '2rem',
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <div style={{ position: 'relative', flex: '1 1 300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search patent title, inventor, application number, or department..."
                  value={patentSearch}
                  onChange={(e) => setPatentSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem',
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['All', 'Published', 'Granted', 'Filed'].map(st => (
                  <button
                    key={st}
                    onClick={() => setPatentStatusFilter(st)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: 'none',
                      background: patentStatusFilter === st ? '#070F1E' : '#FFFFFF',
                      color: patentStatusFilter === st ? '#F1C40F' : '#475569',
                      border: '1px solid ' + (patentStatusFilter === st ? '#070F1E' : '#CBD5E1'),
                      cursor: 'pointer'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
              {filteredPatents.map(pat => (
                <div
                  key={pat.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    padding: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#F1F5F9', color: '#334155' }}>
                        {pat.department} • {pat.academicYear}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        background: pat.patentStatus === 'Granted' ? '#ECFDF5' : '#FEF3C7',
                        color: pat.patentStatus === 'Granted' ? '#047857' : '#92400E'
                      }}>
                        {pat.patentStatus}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.4, margin: '0 0 0.5rem' }}>
                      {pat.title}
                    </h3>

                    <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.25rem' }}>
                      <strong>Lead Inventor:</strong> {pat.facultyName}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      <strong>Application No:</strong> {pat.applicationNo}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', fontSize: '0.72rem', color: '#94A3B8', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Filing Date: {pat.filingDate || '—'}</span>
                    <span>Indian Patent Office</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AICTE IDEA LAB */}
        {activeTab === 'idea-lab' && (
          <div style={{ background: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '2.5rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.8rem', display: 'inline-block' }}>Central Prototyping Facility</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem', fontFamily: 'Cinzel, serif' }}>
                AICTE IDEA Lab (Idea Development, Evaluation & Application)
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Sanctioned under the AICTE IDEA Scheme with a grant of ₹1.1 Crore to encourage students and faculty in application of Science, Technology, Engineering and Mathematics (STEM) fundamentals towards 24x7 hands-on prototyping.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {AICTE_IDEA_LAB_TEAM.map((member, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: 800 }}>
                    {member.name.charAt(0)}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.2rem' }}>{member.name}</h4>
                  <div style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 700, marginBottom: '0.25rem' }}>{member.role}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{member.dept}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MoUs & COLLABORATIONS */}
        {activeTab === 'mous' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {mous.map(mou => (
                <div key={mou.id} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#EFF6FF', color: '#1E40AF' }}>
                      {mou.department}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669' }}>
                      Active Partner
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem' }}>
                    {mou.partnerOrg || mou.organizationName}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
                    {mou.scopeSummary || mou.scope || 'Industry-Academia collaboration for skill training and student placements.'}
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: '0.6rem' }}>
                    Valid: {mou.validFrom || mou.signedDate} to {mou.validTill || mou.validTo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dataset Transparency Footer */}
        <div style={{
          marginTop: '3.5rem',
          padding: '1.25rem 1.5rem',
          borderRadius: '12px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.75rem',
          color: '#64748B'
        }}>
          <div>
            <strong>Metadata Sources:</strong> OpenAlex Public Parquet Snapshot (June 2026) • Crossref Public Data File (March 2026) • ORCID Annual Public Data File (2025 CC0).
          </div>
          <div>
            Research index last updated: <strong>June 2026</strong> • Fully deterministic local search
          </div>
        </div>
      </div>

      {/* Researcher Dossier Modal */}
      {selectedResearcher && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 15, 30, 0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #D4AF37' }}>
            <div style={{ background: '#070F1E', padding: '1.25rem 1.5rem', color: '#FFFFFF', borderBottom: '2px solid #D4AF37', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>{selectedResearcher.canonicalName}</h3>
                <div style={{ fontSize: '0.74rem', color: '#D4AF37' }}>{selectedResearcher.designation} • Dept. of {selectedResearcher.department}</div>
              </div>
              <button type="button" onClick={() => setSelectedResearcher(null)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', background: '#F8FAFC', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Total Works</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>{selectedResearcher.worksCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>OpenAlex Citations</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669' }}>{selectedResearcher.citedByCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>h-index</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2563EB' }}>{selectedResearcher.hIndex}</div>
                </div>
              </div>

              {/* Identifiers */}
              <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div><strong>Institution:</strong> {selectedResearcher.primaryAffiliation}</div>
                <div><strong>OpenAlex Author ID:</strong> <code>{selectedResearcher.openAlexAuthorId}</code></div>
                {selectedResearcher.orcid && <div><strong>ORCID:</strong> <code>{selectedResearcher.orcid}</code></div>}
              </div>

              {/* Research Areas */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>Research Topics & Specializations</h4>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {selectedResearcher.topics?.map((t, idx) => (
                    <span key={idx} style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '6px', background: '#EFF6FF', color: '#1E40AF', fontWeight: 700 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setSelectedResearcher(null)} style={{ padding: '0.5rem 1.25rem', background: '#070F1E', color: '#F1C40F', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

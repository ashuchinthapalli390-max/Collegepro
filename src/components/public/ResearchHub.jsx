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
  Download 
} from 'lucide-react';
import { getPublications, getPatents, getMoUs } from '../../data/portalStore.js';
import { BRANDING_LOGOS, AICTE_IDEA_LAB_TEAM } from '../../data/masterData.js';

export default function ResearchHub({ onOpenPortal }) {
  const [activeTab, setActiveTab] = useState('publications');
  const [pubSearch, setPubSearch] = useState('');
  const [patentSearch, setPatentSearch] = useState('');
  const [indexingFilter, setIndexingFilter] = useState('All');
  const [patentStatusFilter, setPatentStatusFilter] = useState('All');

  const publications = getPublications();
  const patents = getPatents();
  const mous = getMoUs();

  const filteredPubs = publications.filter(p => {
    const q = pubSearch.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(q) || 
                          p.firstAuthor.toLowerCase().includes(q) || 
                          p.journalConference.toLowerCase().includes(q) || 
                          p.department.toLowerCase().includes(q) ||
                          (p.doi || '').toLowerCase().includes(q);

    const matchesIndex = indexingFilter === 'All' || 
                         (indexingFilter === 'Scopus' && p.scopusIndexed === 'Yes') ||
                         (indexingFilter === 'WoS' && p.wosIndexed === 'Yes') ||
                         (indexingFilter === 'IEEE' && (p.ieeeLink || p.publisher?.includes('IEEE') || p.journalConference?.includes('IEEE')));

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
          marginBottom: '3rem',
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

            <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: '0.8rem' }}>
              Research, Patents & Global Inventions
            </h1>

            <p style={{ color: '#E2E8F0', fontSize: '1rem', lineHeight: 1.6, maxWidth: '750px', marginBottom: '1.5rem' }}>
              Narasaraopeta Engineering College fosters a vibrant research ecosystem with 125+ SCI/Scopus publications, 35+ patents, state-of-the-art AICTE IDEA prototyping labs, and collaborative MoUs with premier industries and universities.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('publications')}
                className="btn-primary"
              >
                Browse Publications ({publications.length})
              </button>
              <button
                onClick={() => setActiveTab('patents')}
                className="btn-secondary"
              >
                View Patents ({patents.length})
              </button>
              <button
                onClick={onOpenPortal}
                style={{
                  padding: '0.75rem 1.4rem',
                  borderRadius: '12px',
                  background: 'rgba(212, 175, 55, 0.2)',
                  color: '#FFF',
                  border: '1.5px solid #D4AF37',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                Sync Scholarly Profile
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
            { id: 'publications', label: `Publications Directory (${publications.length})`, icon: FileText },
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
                  gap: '0.5rem'
                }}
              >
                <Icon size={16} style={{ color: activeTab === tab.id ? '#D4AF37' : 'inherit' }} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Publications Tab */}
        {activeTab === 'publications' && (
          <div>
            {/* Search & Filter Bar */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '1.2rem 1.5rem',
              border: '1px solid #E2E8F0',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search papers by title, author, journal, DOI, department..."
                  value={pubSearch}
                  onChange={(e) => setPubSearch(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>Indexing:</span>
                <select
                  value={indexingFilter}
                  onChange={(e) => setIndexingFilter(e.target.value)}
                  className="form-control"
                  style={{ width: 'auto', padding: '0.55rem 1rem' }}
                >
                  <option value="All">All Indexing</option>
                  <option value="Scopus">Scopus Indexed</option>
                  <option value="WoS">Web of Science</option>
                  <option value="IEEE">IEEE Explorer</option>
                </select>
              </div>
            </div>

            {/* Publications List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredPubs.map(p => (
                <div
                  key={p.id}
                  className="glass-card-light card-hover"
                  style={{
                    padding: '1.5rem',
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: '4px solid #0B192C'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-navy">{p.department}</span>
                      <span className="badge badge-gold">{p.publicationType}</span>
                      {p.scopusIndexed === 'Yes' && <span className="badge badge-success">Scopus</span>}
                      {p.wosIndexed === 'Yes' && <span className="badge badge-info">Web of Science</span>}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                      Academic Year: {p.academicYear || p.publicationDate}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B192C', lineHeight: 1.4, marginBottom: '0.4rem' }}>
                    {p.title}
                  </h3>

                  <div style={{ color: '#475569', fontSize: '0.88rem', marginBottom: '0.6rem' }}>
                    <strong>Authors:</strong> {p.firstAuthor} {p.secondAuthor && `, ${p.secondAuthor}`} {p.additionalAuthors && `, ${p.additionalAuthors}`}
                  </div>

                  <div style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: '0.8rem' }}>
                    <em>{p.journalConference}</em> {p.volume && `• Vol. ${p.volume}`} {p.issue && `(Issue ${p.issue})`} {p.pages && `• pp. ${p.pages}`}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.8rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
                      {p.doi && (
                        <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" style={{ color: '#0284C7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          DOI: {p.doi} <ExternalLink size={12} />
                        </a>
                      )}
                      {p.scopusEid && <span>Scopus EID: {p.scopusEid}</span>}
                    </div>

                    <span className="badge badge-navy" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      Verified Institutional Record
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patents Tab */}
        {activeTab === 'patents' && (
          <div>
            {/* Search & Filter Bar */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '1.2rem 1.5rem',
              border: '1px solid #E2E8F0',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search patents by title, inventor, application #, department..."
                  value={patentSearch}
                  onChange={(e) => setPatentSearch(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>Status:</span>
                <select
                  value={patentStatusFilter}
                  onChange={(e) => setPatentStatusFilter(e.target.value)}
                  className="form-control"
                  style={{ width: 'auto', padding: '0.55rem 1rem' }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Granted">Granted</option>
                  <option value="Published">Published</option>
                  <option value="Filed">Filed</option>
                </select>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1.5rem' }}>
              {filteredPatents.map(pat => (
                <div
                  key={pat.id}
                  className="glass-card-light card-hover"
                  style={{
                    padding: '1.8rem',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: '4px solid #D4AF37'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                      <span className={pat.patentStatus === 'Granted' ? 'badge badge-success' : 'badge badge-gold'}>
                        {pat.patentStatus}
                      </span>
                      <span className="badge badge-navy">{pat.department}</span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B192C', lineHeight: 1.35, marginBottom: '0.6rem' }}>
                      {pat.title}
                    </h3>

                    <div style={{ background: '#F8FAFC', padding: '0.8rem', borderRadius: '8px', marginBottom: '0.8rem', fontSize: '0.85rem' }}>
                      <div>Application No: <strong style={{ color: '#0B192C' }}>{pat.applicationNo || 'Registered'}</strong></div>
                      <div>Filing Date: <span style={{ color: '#475569' }}>{pat.filingDate || pat.applicationDate}</span></div>
                      {pat.publicationDate && <div>Publication Date: <span style={{ color: '#475569' }}>{pat.publicationDate}</span></div>}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                      <strong>Inventors:</strong> {pat.authors?.map(a => a.name).join(', ') || pat.facultyName}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.8rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{pat.patentType || 'Utility Patent'}</span>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Verified Gazette Record</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AICTE IDEA Lab Tab */}
        {activeTab === 'idea-lab' && (
          <div>
            <div style={{
              background: '#070F1E',
              borderRadius: '20px',
              padding: '2.5rem',
              color: '#FFFFFF',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              marginBottom: '2rem'
            }}>
              <h2 style={{ color: '#FFFFFF', fontSize: '1.8rem', marginBottom: '0.8rem' }}>
                AICTE IDEA Lab (Idea Development, Evaluation & Application)
              </h2>
              <p style={{ color: '#CBD5E1', fontSize: '1rem', lineHeight: 1.6, maxWidth: '850px', marginBottom: '1.5rem' }}>
                Sanctioned by the All India Council for Technical Education (AICTE), the IDEA Lab at NEC provides round-the-clock rapid prototyping, laser cutting, 3D printing, advanced CNC milling, and IoT testing infrastructure for multidisciplinary student-faculty innovation teams.
              </p>

              <div className="grid-4" style={{ gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ color: '#F1C40F', fontWeight: 800, fontSize: '1.2rem' }}>3D Printing</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Industrial SLA/FDM rapid polymer prototyping</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ color: '#F1C40F', fontWeight: 800, fontSize: '1.2rem' }}>CNC Milling</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Precision metal & composite machining</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ color: '#F1C40F', fontWeight: 800, fontSize: '1.2rem' }}>Laser Cutter</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>High power CO2 contour cutting & engraving</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ color: '#F1C40F', fontWeight: 800, fontSize: '1.2rem' }}>Embedded IoT</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>ARM, LoRa, ESP32 and sensor instrumentation</div>
                </div>
              </div>
            </div>

            <div className="grid-3" style={{ gap: '1.5rem' }}>
              {AICTE_IDEA_LAB_TEAM.map(member => (
                <div key={member.id} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>{member.role}</span>
                  <h4 style={{ fontSize: '1.1rem', color: '#0B192C', fontWeight: 800 }}>{member.name}</h4>
                  <div style={{ color: '#64748B', fontSize: '0.85rem' }}>{member.designation} ({member.department})</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MoUs Tab */}
        {activeTab === 'mous' && (
          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {mous.map(mou => (
              <div
                key={mou.id}
                style={{
                  padding: '1.8rem',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  borderLeft: mou.status === 'Active' ? '4px solid #10B981' : '4px solid #94A3B8'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span className={mou.status === 'Active' ? 'badge badge-success' : 'badge badge-danger'}>
                    {mou.status}
                  </span>
                  <span className="badge badge-navy">{mou.department}</span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B192C', marginBottom: '0.4rem' }}>
                  {mou.organization}
                </h3>

                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '0.8rem' }}>
                  {mou.natureOfCollaboration}
                </p>

                <div style={{ background: '#F8FAFC', padding: '0.8rem', borderRadius: '8px', fontSize: '0.82rem', color: '#64748B' }}>
                  <div>Signed Date: <strong>{mou.mouDate}</strong> (Validity: {mou.validity})</div>
                  <div>Expiry Date: <strong>{mou.expiryDate}</strong></div>
                  <div>Lead Contact: <strong>{mou.contactPerson}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

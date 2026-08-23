import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  FlaskConical, 
  BookOpen, 
  Award, 
  Briefcase, 
  Lightbulb, 
  Layers, 
  ChevronRight, 
  ArrowLeft, 
  ExternalLink,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { DEPARTMENTS, FACULTY_DATA } from '../../data/masterData.js';
import { getPublications, getPatents, getStudentAchievements, getInternships } from '../../data/portalStore.js';
import FacultyAvatar from '../common/FacultyAvatar.jsx';

export default function DepartmentsHub({ selectedDepartment, onSelectDepartment, onSelectFaculty }) {
  const [activeDeptTab, setActiveDeptTab] = useState('overview');

  const dept = selectedDepartment || null;

  // Filter department specific faculty
  const deptFaculty = dept ? FACULTY_DATA.filter(f => f.department.toLowerCase().includes(dept.code.toLowerCase()) || (dept.code === 'CSE' && f.department === 'CSE')) : [];
  const deptPublications = dept ? getPublications().filter(p => p.department.toLowerCase().includes(dept.code.toLowerCase())) : [];
  const deptPatents = dept ? getPatents().filter(p => p.department.toLowerCase().includes(dept.code.toLowerCase())) : [];
  const deptAchievements = dept ? getStudentAchievements().filter(a => a.department.toLowerCase().includes(dept.code.toLowerCase())) : [];
  const deptInternships = dept ? getInternships().filter(i => (i.branch || '').toLowerCase().includes(dept.code.toLowerCase())) : [];

  if (!dept) {
    return (
      <section style={{ padding: '5rem 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-navy" style={{ marginBottom: '0.6rem' }}>
              Academic & Engineering Excellence
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#0B192C', marginBottom: '0.8rem' }}>
              Academic Departments (13)
            </h2>
            <p style={{ color: '#64748B', maxWidth: '750px', margin: '0 auto', fontSize: '1.05rem' }}>
              Discover our 13 specialized engineering, computational, management, and basic science departments equipped with industry-aligned CBCS curricula, state-of-the-art laboratories, and active research cells.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1.8rem' }}>
            {DEPARTMENTS.map(d => (
              <div
                key={d.id}
                onClick={() => onSelectDepartment(d)}
                className="glass-card-light card-hover"
                style={{
                  padding: '1.8rem',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="badge badge-gold" style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                      {d.code}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                      Estd. {d.established}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', marginBottom: '0.6rem', lineHeight: 1.3 }}>
                    {d.name}
                  </h3>

                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                    {d.description}
                  </p>

                  <div style={{ background: '#F8FAFC', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.2rem' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Head of Department:</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0B192C' }}>{d.hodName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{d.hodQualification}</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #E2E8F0',
                  paddingTop: '0.8rem'
                }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0B192C' }}>
                    {d.facultyCount} Verified Faculty
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#D4AF37', fontWeight: 700, fontSize: '0.85rem' }}>
                    Explore Portal <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Selected Department Comprehensive View
  return (
    <section style={{ padding: '3.5rem 0', background: '#F8FAFC' }}>
      <div className="container">
        {/* Back Button */}
        <button
          onClick={() => onSelectDepartment(null)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            color: '#0B192C',
            fontWeight: 600,
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}
        >
          <ArrowLeft size={16} /> Back to All Departments
        </button>

        {/* Department Banner Header */}
        <div style={{
          background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 60%, #122846 100%)',
          borderRadius: '20px',
          padding: '2.5rem',
          color: '#FFFFFF',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
            <span className="badge badge-gold">{dept.code}</span>
            <span className="badge badge-navy">Autonomous • Estd. {dept.established}</span>
            <span className="badge badge-success">Approved Intake: {dept.intake} Students</span>
          </div>

          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: '0.6rem' }}>
            Department of {dept.name}
          </h1>

          <p style={{ color: '#CBD5E1', maxWidth: '850px', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {dept.description}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
            {dept.programs.map((prog, idx) => (
              <span key={idx} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', color: '#FFF' }}>
                🎓 {prog}
              </span>
            ))}
          </div>
        </div>

        {/* Sticky Sub Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          padding: '0.6rem',
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          marginBottom: '2rem',
          position: 'sticky',
          top: '80px',
          zIndex: 50
        }}>
          {[
            { id: 'overview', label: 'Overview & Vision' },
            { id: 'hod', label: 'HOD Profile' },
            { id: 'faculty', label: `Faculty (${deptFaculty.length})` },
            { id: 'labs', label: 'Laboratories' },
            { id: 'research', label: `Research & Patents (${deptPublications.length + deptPatents.length})` },
            { id: 'achievements', label: `Student Achievements (${deptAchievements.length})` },
            { id: 'internships', label: `Internships (${deptInternships.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDeptTab(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                background: activeDeptTab === tab.id ? '#0B192C' : 'transparent',
                color: activeDeptTab === tab.id ? '#FFFFFF' : '#475569',
                border: 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview, Vision & Mission */}
        {activeDeptTab === 'overview' && (
          <div className="grid-2" style={{ gap: '2rem' }}>
            <div className="glass-card-light" style={{ padding: '2rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0B192C' }}>
                <Award size={22} style={{ color: '#D4AF37' }} />
                <h3 style={{ fontSize: '1.3rem' }}>Department Vision</h3>
              </div>
              <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '0.95rem' }}>
                "{dept.vision}"
              </p>
            </div>

            <div className="glass-card-light" style={{ padding: '2rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0B192C' }}>
                <CheckCircle2 size={22} style={{ color: '#10B981' }} />
                <h3 style={{ fontSize: '1.3rem' }}>Department Mission</h3>
              </div>
              <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {dept.mission}
              </p>
            </div>

            <div style={{ gridColumn: 'span 2', background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0B192C', marginBottom: '1rem' }}>Department Key Highlights</h3>
              <div className="grid-2" style={{ gap: '1rem' }}>
                {dept.highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#334155' }}>
                    <CheckCircle2 size={18} style={{ color: '#D4AF37' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: HOD Profile */}
        {activeDeptTab === 'hod' && (
          <div className="glass-card-light" style={{ padding: '2.5rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <FacultyAvatar
                photo={deptFaculty.find(f => f.name.includes(dept.hodName) || dept.hodName.includes(f.name))?.photo || null}
                name={dept.hodName}
                width="160px"
                height="180px"
                borderRadius="14px"
              />
              <div style={{ flex: 1 }}>
                <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>Head of the Department</span>
                <h2 style={{ fontSize: '1.6rem', color: '#0B192C', marginBottom: '0.2rem' }}>{dept.hodName}</h2>
                <div style={{ color: '#64748B', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.8rem' }}>{dept.hodQualification}</div>
                <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Leading the Department of {dept.name} with outcome-based pedagogical innovation, industry internship alignment, and continuous student mentorship.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Faculty List */}
        {activeDeptTab === 'faculty' && (
          <div>
            <div className="grid-3" style={{ gap: '1.5rem' }}>
              {deptFaculty.map(fac => (
                <div
                  key={fac.id}
                  onClick={() => onSelectFaculty(fac)}
                  className="glass-card-light card-hover"
                  style={{
                    padding: '1.4rem',
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', gap: '0.5rem' }}>
                      <div>
                        <div style={{ marginBottom: '0.35rem' }}>
                          <span className="badge badge-gold">{fac.designation}</span>
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0B192C', marginBottom: '0.15rem' }}>
                          {fac.name}
                        </h4>
                        <div style={{ color: '#64748B', fontSize: '0.78rem', fontStyle: 'italic' }}>
                          {fac.qualification}
                        </div>
                      </div>
                      <FacultyAvatar photo={fac.photo} name={fac.name} width="52px" height="60px" borderRadius="8px" showLabel={false} />
                    </div>

                    <p style={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.4, marginBottom: '0.8rem' }}>
                      {fac.summary.length > 100 ? fac.summary.slice(0, 100) + '...' : fac.summary}
                    </p>
                  </div>

                  {/* Research Badges */}
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', borderTop: '1px solid #F1F5F9', paddingTop: '0.6rem' }}>
                    {fac.orcid && <span className="badge" style={{ background: '#A6CE3920', color: '#5B8C00', fontSize: '0.68rem' }}>ORCID</span>}
                    {fac.scopus && <span className="badge" style={{ background: '#FF6C0020', color: '#D4380D', fontSize: '0.68rem' }}>Scopus</span>}
                    {fac.scholar && <span className="badge" style={{ background: '#4285F420', color: '#1D39C4', fontSize: '0.68rem' }}>Scholar</span>}
                    {fac.vidwan && <span className="badge" style={{ background: '#FAAD1420', color: '#D48806', fontSize: '0.68rem' }}>Vidwan</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Laboratories */}
        {activeDeptTab === 'labs' && (
          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {dept.labs.map((lab, idx) => (
              <div key={idx} style={{ background: '#FFFFFF', padding: '1.8rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
                  <FlaskConical size={22} style={{ color: '#D4AF37' }} />
                  <h4 style={{ fontSize: '1.15rem', color: '#0B192C' }}>{lab}</h4>
                </div>
                <p style={{ color: '#64748B', fontSize: '0.88rem' }}>
                  Fully equipped with modern industry standard software licenses, hardware kits, high-speed networking, and computing infrastructure.
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Department Research */}
        {activeDeptTab === 'research' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Publications */}
            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0B192C', marginBottom: '1rem' }}>
                Department Publications ({deptPublications.length})
              </h3>
              {deptPublications.length === 0 ? (
                <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>No direct publications recorded for this filter. Check the central Research Hub.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {deptPublications.map(p => (
                    <div key={p.id} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontWeight: 700, color: '#0B192C', fontSize: '0.95rem' }}>{p.title}</div>
                      <div style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '0.2rem' }}>{p.firstAuthor} • {p.journalConference} ({p.publicationDate})</div>
                      {p.doi && (
                        <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" style={{ color: '#0284C7', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem' }}>
                          DOI: {p.doi} <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Patents */}
            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0B192C', marginBottom: '1rem' }}>
                Department Patents ({deptPatents.length})
              </h3>
              {deptPatents.length === 0 ? (
                <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>No patents filed under this specific department code.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {deptPatents.map(pat => (
                    <div key={pat.id} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="badge badge-gold">{pat.patentStatus}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>App #{pat.applicationNo}</span>
                      </div>
                      <div style={{ fontWeight: 700, color: '#0B192C', fontSize: '0.95rem', marginTop: '0.4rem' }}>{pat.title}</div>
                      <div style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '0.2rem' }}>Lead: {pat.facultyName} • Filed: {pat.filingDate}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 6: Student Achievements */}
        {activeDeptTab === 'achievements' && (
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0B192C', marginBottom: '1rem' }}>
              Department Student Achievements ({deptAchievements.length})
            </h3>
            {deptAchievements.length === 0 ? (
              <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Check Central Student Life tab for cross-departmental competitions and SIH winners.</div>
            ) : (
              <div className="grid-2" style={{ gap: '1rem' }}>
                {deptAchievements.map(a => (
                  <div key={a.id} style={{ padding: '1.2rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="badge badge-success">{a.position}</span>
                      <span className="badge badge-navy">{a.level}</span>
                    </div>
                    <div style={{ fontWeight: 800, color: '#0B192C', fontSize: '1rem', marginTop: '0.5rem' }}>{a.studentName} ({a.rollNumber})</div>
                    <div style={{ color: '#334155', fontSize: '0.88rem', marginTop: '0.2rem' }}>{a.eventName}</div>
                    <div style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.4rem' }}>{a.eventDetails}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Internships */}
        {activeDeptTab === 'internships' && (
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0B192C', marginBottom: '1rem' }}>
              Department Student Internships ({deptInternships.length})
            </h3>
            {deptInternships.length === 0 ? (
              <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>No individual records on this filter.</div>
            ) : (
              <div className="grid-2" style={{ gap: '1rem' }}>
                {deptInternships.map(i => (
                  <div key={i.id} style={{ padding: '1.2rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="badge badge-info">{i.internshipType}</span>
                      <span className="badge badge-gold">{i.weeks} Weeks Duration</span>
                    </div>
                    <div style={{ fontWeight: 800, color: '#0B192C', fontSize: '1rem', marginTop: '0.5rem' }}>{i.studentName} ({i.rollNumber})</div>
                    <div style={{ color: '#0284C7', fontWeight: 700, fontSize: '0.88rem' }}>{i.organization}</div>
                    <div style={{ color: '#475569', fontSize: '0.82rem', marginTop: '0.2rem' }}>{i.internshipTitle} ({i.domain})</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

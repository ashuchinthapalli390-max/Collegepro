import React, { useState } from 'react';
import { 
  Trophy, 
  Briefcase, 
  Code, 
  BookOpen, 
  Calendar, 
  Award, 
  Users, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  Download,
  Building,
  GraduationCap
} from 'lucide-react';
import { 
  getStudentAchievements, 
  getInternships, 
  getStudentProjects, 
  getFDPs, 
  getFacultyAchievements, 
  getEvents, 
  getMemberships, 
  getNPTEL, 
  getPlacementStats, 
  getPlacementRecords,
  getBoSMeetings
} from '../../data/portalStore.js';

export default function MadamShowcase({ onOpenPortal }) {
  const [activeModuleTab, setActiveModuleTab] = useState('achievements');

  const achievements = getStudentAchievements();
  const internships = getInternships();
  const projects = getStudentProjects();
  const bosMeetings = getBoSMeetings();
  const fdps = getFDPs();
  const facultyAch = getFacultyAchievements();
  const events = getEvents();
  const memberships = getMemberships();
  const nptelList = getNPTEL();
  const placementStats = getPlacementStats();
  const placementRecords = getPlacementRecords();

  const moduleTabs = [
    { id: 'achievements', label: `Student Achievements (${achievements.length})`, icon: Trophy },
    { id: 'internships', label: `Student Internships (${internships.length})`, icon: Briefcase },
    { id: 'projects', label: `Capstone Projects (${projects.length})`, icon: Code },
    { id: 'bos', label: `Board of Studies (BoS)`, icon: BookOpen },
    { id: 'fdps', label: `FDPs Organized (${fdps.length})`, icon: Calendar },
    { id: 'faculty-ach', label: `Faculty Achievements (${facultyAch.length})`, icon: Award },
    { id: 'events', label: `Workshops & Events (${events.length})`, icon: Users },
    { id: 'memberships', label: `Professional Memberships (${memberships.length})`, icon: CheckCircle2 },
    { id: 'nptel', label: `NPTEL / MOOCs (${nptelList.length})`, icon: GraduationCap },
    { id: 'placements', label: `Placement Records`, icon: TrendingUp }
  ];

  return (
    <section style={{ padding: '5rem 0', background: '#FFFFFF' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.6rem' }}>
            Madam's Academic Modules & Student Showcase
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#0B192C', marginBottom: '0.8rem' }}>
            Academic Excellence & Institutional Activities
          </h2>
          <p style={{ color: '#64748B', maxWidth: '750px', margin: '0 auto', fontSize: '1.05rem' }}>
            Comprehensive institutional records covering student awards, national hackathons, global internships, Board of Studies meetings, faculty development programs, and enterprise placements.
          </p>
        </div>

        {/* Horizontal Module Scrollbar */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          padding: '0.8rem',
          background: '#0B192C',
          borderRadius: '16px',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          {moduleTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeModuleTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModuleTab(tab.id)}
                style={{
                  padding: '0.6rem 1.1rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  whiteSpace: 'nowrap',
                  background: isActive ? 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#070F1E' : '#E2E8F0',
                  border: '1px solid ' + (isActive ? '#D4AF37' : 'rgba(255,255,255,0.1)'),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* 1. Student Achievements */}
        {activeModuleTab === 'achievements' && (
          achievements.length === 0 ? (
            <div style={{ padding: '3.5rem 1.5rem', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>No Student Achievements Recorded</div>
              <div style={{ fontSize: '0.84rem' }}>Verified state and national level competition achievements will appear here once approved.</div>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: '1.5rem' }}>
              {achievements.map(ach => (
                <div
                  key={ach.id}
                  className="glass-card-light card-hover"
                  style={{
                    padding: '1.8rem',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    borderTop: '4px solid #D4AF37',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                      <span className="badge badge-success">{ach.position}</span>
                      <span className="badge badge-navy">{ach.level} Level</span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B192C', marginBottom: '0.3rem' }}>
                      {ach.studentName}
                    </h3>

                    <div style={{ color: '#64748B', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.8rem' }}>
                      Roll No: {ach.rollNumber} • {ach.department} ({ach.year})
                    </div>

                    <div style={{ background: '#F8FAFC', padding: '0.8rem', borderRadius: '8px', marginBottom: '0.8rem' }}>
                      <div style={{ color: '#0B192C', fontWeight: 700, fontSize: '0.9rem' }}>{ach.eventName}</div>
                      <div style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.2rem' }}>Organized by: {ach.organizedBy}</div>
                    </div>

                    <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {ach.eventDetails}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '0.8rem' }}>
                    {ach.prizeAmount > 0 ? (
                      <span style={{ color: '#B38600', fontWeight: 800, fontSize: '0.95rem' }}>
                        🏆 Cash Award: ₹{ach.prizeAmount.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.82rem' }}>
                        Certificate of Merit
                      </span>
                    )}
                    <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>{ach.achievementType}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* 2. Internships */}
        {activeModuleTab === 'internships' && (
          internships.length === 0 ? (
            <div style={{ padding: '3.5rem 1.5rem', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>No Student Internships Recorded</div>
              <div style={{ fontSize: '0.84rem' }}>Verified corporate and research internships will appear here once approved by department coordinators.</div>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: '1.5rem' }}>
              {internships.map(intern => (
                <div
                  key={intern.id}
                  className="glass-card-light card-hover"
                  style={{
                    padding: '1.8rem',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    borderTop: '4px solid #0EA5E9',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                      <span className="badge badge-info">{intern.internshipType}</span>
                      <span className="badge badge-gold">{intern.weeks} Weeks Duration</span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B192C', marginBottom: '0.2rem' }}>
                      {intern.studentName}
                    </h3>

                    <div style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: '0.8rem' }}>
                      {intern.rollNumber} • {intern.branch} ({intern.batch})
                    </div>

                    <div style={{ background: '#F0F9FF', padding: '0.8rem', borderRadius: '8px', marginBottom: '0.8rem', border: '1px solid #BAE6FD' }}>
                      <div style={{ color: '#0369A1', fontWeight: 800, fontSize: '0.95rem' }}>{intern.organization}</div>
                      <div style={{ color: '#0284C7', fontSize: '0.82rem', fontWeight: 600 }}>{intern.internshipTitle}</div>
                      <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '0.2rem' }}>Domain: {intern.domain}</div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.8rem' }}>
                      Period: {intern.startDate} to {intern.endDate} (Mode: <strong>{intern.mode}</strong>)
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '0.8rem' }}>
                    {intern.stipend === 'Yes' ? (
                      <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.9rem' }}>
                        Stipend: ₹{intern.stipendAmount.toLocaleString('en-IN')}/mo
                      </span>
                    ) : (
                      <span style={{ color: '#64748B', fontSize: '0.8rem' }}>Academic Internship</span>
                    )}
                    <span className="badge badge-success">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* 3. Student Capstone Projects */}
        {activeModuleTab === 'projects' && (
          projects.length === 0 ? (
            <div style={{ padding: '3.5rem 1.5rem', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>No Capstone Projects Recorded</div>
              <div style={{ fontSize: '0.84rem' }}>Approved major and mini student projects will appear here once verified.</div>
            </div>
          ) : (
            <div className="grid-2" style={{ gap: '1.8rem' }}>
              {projects.map(proj => (
                <div
                  key={proj.id}
                  className="glass-card-light"
                  style={{
                    padding: '2rem',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    borderLeft: '5px solid #0B192C'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <span className="badge badge-gold">{proj.projectType} Project</span>
                    <span className="badge badge-navy">{proj.branch} ({proj.academicYear})</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', lineHeight: 1.35, marginBottom: '0.6rem' }}>
                    {proj.projectTitle}
                  </h3>

                  <div style={{ background: '#F8FAFC', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    <div><strong>Faculty Guide:</strong> <span style={{ color: '#D4AF37', fontWeight: 700 }}>{proj.guide}</span></div>
                    <div><strong>Team Lead:</strong> {proj.teamLeader}</div>
                    <div><strong>Team Members:</strong> {proj.member1} {proj.member2 && `, ${proj.member2}`} {proj.member3 && `, ${proj.member3}`}</div>
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                    {proj.abstract}
                  </p>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                    {proj.githubLink && (
                      <a href={proj.githubLink} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0F172A', fontWeight: 600, fontSize: '0.85rem', background: '#F1F5F9', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
                        <Code size={14} /> GitHub Repository <ExternalLink size={12} />
                      </a>
                    )}
                    {proj.demoLink && (
                      <a href={proj.demoLink} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0284C7', fontWeight: 600, fontSize: '0.85rem', background: '#E0F2FE', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* 4. Board of Studies (BoS) */}
        {activeModuleTab === 'bos' && (
          <div>
            <div style={{
              background: '#070F1E',
              borderRadius: '16px',
              padding: '2rem',
              color: '#FFFFFF',
              marginBottom: '2rem',
              border: '1px solid rgba(212, 175, 55, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                <BookOpen size={24} style={{ color: '#D4AF37' }} />
                <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem' }}>Autonomous Board of Studies (BoS) Hub</h3>
              </div>
              <p style={{ color: '#CBD5E1', fontSize: '0.95rem', maxWidth: '850px' }}>
                Board of Studies meetings across R16, R19, R20, R23, and upcoming R26 regulations are convened annually with JNTUK University nominees, IIT academicians, and corporate industry architects to continually modernize undergraduate and postgraduate course structures.
              </p>
            </div>

            {bosMeetings.length === 0 ? (
              <div style={{ padding: '3.5rem 1.5rem', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1', textAlign: 'center', color: '#64748B' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>No BoS Minutes Uploaded</div>
                <div style={{ fontSize: '0.84rem' }}>Official signed Board of Studies meeting minutes will be displayed here.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {bosMeetings.map(bos => (
                  <div
                    key={bos.id}
                    style={{
                      padding: '2rem',
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span className="badge badge-gold">{bos.regulation} Regulation</span>
                        <span className="badge badge-navy">{bos.department}</span>
                      </div>
                      <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                        Ref No: <strong>{bos.bosNo}</strong> • Date: <strong>{bos.bosDate}</strong>
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', marginBottom: '0.6rem' }}>
                      {bos.chairman}
                    </h3>

                    <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                      {bos.summary}
                    </p>

                    <div className="grid-3" style={{ gap: '1rem', background: '#F8FAFC', padding: '1.2rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <div>
                        <div style={{ color: '#0284C7', fontWeight: 700 }}>University Nominee</div>
                        <div style={{ fontWeight: 600, color: '#0B192C' }}>{bos.universityNominee?.name || '—'}</div>
                        <div style={{ color: '#64748B', fontSize: '0.78rem' }}>{bos.universityNominee?.designation}, {bos.universityNominee?.institution}</div>
                      </div>

                      <div>
                        <div style={{ color: '#D4AF37', fontWeight: 700 }}>External Academicians</div>
                        <div style={{ color: '#334155' }}>{bos.academician1 || '—'}</div>
                        <div style={{ color: '#334155' }}>{bos.academician2 || '—'}</div>
                      </div>

                      <div>
                        <div style={{ color: '#10B981', fontWeight: 700 }}>Industry & Alumni</div>
                        <div style={{ color: '#334155' }}>{bos.industryMember || '—'}</div>
                        <div style={{ color: '#334155' }}>{bos.alumniMember || '—'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. FDPs Organized */}
        {activeModuleTab === 'fdps' && (
          fdps.length === 0 ? (
            <div style={{ padding: '3.5rem 1.5rem', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>No Faculty Development Programmes Recorded</div>
              <div style={{ fontSize: '0.84rem' }}>FDP records organized under AICTE / institutional sponsorships will appear here once verified.</div>
            </div>
          ) : (
            <div className="grid-2" style={{ gap: '1.5rem' }}>
              {fdps.map(f => (
                <div key={f.id} style={{ padding: '1.8rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <span className="badge badge-gold">{f.department}</span>
                    <span className="badge badge-navy">{f.academicYear}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#0B192C', fontWeight: 800, marginBottom: '0.4rem' }}>
                    {f.fdpTitle}
                  </h3>
                  <div style={{ background: '#F8FAFC', padding: '0.8rem', borderRadius: '8px', fontSize: '0.82rem', color: '#475569', marginBottom: '0.8rem' }}>
                    <div>Coordinators: <strong>{f.coordinator}</strong></div>
                    <div>Resource Persons: <strong>{f.resourcePerson}</strong></div>
                    <div>Grant Amount: <strong>₹{f.amount?.toLocaleString('en-IN') || 0}</strong></div>
                    <div>Participants: <strong>{f.noParticipants} Faculty Members</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* 6. Professional Memberships */}
        {activeModuleTab === 'memberships' && (
          memberships.length === 0 ? (
            <div style={{ padding: '3.5rem 1.5rem', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>No Faculty Memberships Recorded</div>
              <div style={{ fontSize: '0.84rem' }}>Professional society memberships (IEEE, ISTE, IEI, ACM, CSI) will appear here once added.</div>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: '1.5rem' }}>
              {memberships.map(mem => (
                <div key={mem.id} style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <span className="badge badge-navy" style={{ marginBottom: '0.4rem' }}>{mem.membershipType} Member</span>
                  <h4 style={{ fontSize: '1.1rem', color: '#0B192C', fontWeight: 800 }}>{mem.organization}</h4>
                  <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.88rem', margin: '0.3rem 0' }}>{mem.facultyName}</div>
                  <div style={{ color: '#64748B', fontSize: '0.8rem' }}>Membership No: <strong>{mem.membershipNumber}</strong></div>
                </div>
              ))}
            </div>
          )
        )}

        {/* 7. NPTEL */}
        {activeModuleTab === 'nptel' && (
          nptelList.length === 0 ? (
            <div style={{ padding: '3.5rem 1.5rem', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>No NPTEL / MOOC Certifications Recorded</div>
              <div style={{ fontSize: '0.84rem' }}>Faculty and student Elite/Gold SWAYAM-NPTEL course certifications will appear here once verified.</div>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: '1.5rem' }}>
              {nptelList.map(n => (
                <div key={n.id} style={{ padding: '1.6rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>{n.badge}</span>
                  <h4 style={{ fontSize: '1.1rem', color: '#0B192C', fontWeight: 800 }}>{n.course}</h4>
                  <div style={{ color: '#0284C7', fontWeight: 700, fontSize: '0.9rem', margin: '0.3rem 0' }}>{n.name} ({n.participant})</div>
                  <div style={{ color: '#64748B', fontSize: '0.82rem' }}>Score: <strong style={{ color: '#059669' }}>{n.score}%</strong> • Duration: {n.duration}</div>
                </div>
              ))}
            </div>
          )
        )}

        {/* 8. Placements */}
        {activeModuleTab === 'placements' && (
          <div>
            <div className="grid-4" style={{ gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ background: '#0B192C', color: '#FFF', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F1C40F' }}>44.0 LPA</div>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Highest Package (Amazon)</div>
              </div>
              <div style={{ background: '#0B192C', color: '#FFF', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#60A5FA' }}>6.2 LPA</div>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Average Package</div>
              </div>
              <div style={{ background: '#0B192C', color: '#FFF', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34D399' }}>1200+</div>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Total Job Offers</div>
              </div>
              <div style={{ background: '#0B192C', color: '#FFF', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F472B6' }}>120+</div>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Recruiting Companies</div>
              </div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '1.2rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontWeight: 700, color: '#0B192C' }}>
                Department-Wise Placement Statistics (Academic Year 2024-25)
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#0B192C', color: '#FFFFFF' }}>
                      <th style={{ padding: '0.9rem' }}>Department</th>
                      <th style={{ padding: '0.9rem' }}>Eligible Students</th>
                      <th style={{ padding: '0.9rem' }}>Placed Students</th>
                      <th style={{ padding: '0.9rem' }}>Highest Package</th>
                      <th style={{ padding: '0.9rem' }}>Average Package</th>
                      <th style={{ padding: '0.9rem' }}>Offers Made</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placementStats.map((stat, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                        <td style={{ padding: '0.9rem', fontWeight: 700, color: '#0B192C' }}>{stat.department}</td>
                        <td style={{ padding: '0.9rem' }}>{stat.eligible}</td>
                        <td style={{ padding: '0.9rem', fontWeight: 600, color: '#059669' }}>{stat.placed} ({Math.round((stat.placed/stat.eligible)*100)}%)</td>
                        <td style={{ padding: '0.9rem', fontWeight: 700, color: '#B38600' }}>{stat.highestPackage}</td>
                        <td style={{ padding: '0.9rem' }}>{stat.avgPackage}</td>
                        <td style={{ padding: '0.9rem', fontWeight: 700 }}>{stat.offers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

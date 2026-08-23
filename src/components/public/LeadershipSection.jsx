import React, { useState } from 'react';
import { 
  Award, 
  Quote, 
  ChevronRight, 
  BookOpen, 
  Compass, 
  Target, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import { LEADERSHIP_PROFILES, COLLEGE_INFO } from '../../data/masterData.js';

export default function LeadershipSection() {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [activeAboutTab, setActiveAboutTab] = useState('vision');

  const chairman = LEADERSHIP_PROFILES[0];
  const otherLeaders = LEADERSHIP_PROFILES.slice(1);

  return (
    <section style={{ padding: '5rem 0', background: '#FFFFFF' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-navy" style={{ marginBottom: '0.6rem' }}>
            Institutional Governance & Leadership
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#0B192C', marginBottom: '0.8rem' }}>
            Guiding Vision & Management
          </h2>
          <p style={{ color: '#64748B', maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem' }}>
            Dedicated visionaries shaping world-class technical education, ethical leadership, and groundbreaking industrial research at Narasaraopeta Engineering College.
          </p>
        </div>

        {/* Chairman Feature Box (Split Layout) */}
        <div style={{
          background: 'linear-gradient(135deg, #0B192C 0%, #122846 100%)',
          borderRadius: '24px',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          color: '#FFFFFF',
          marginBottom: '4rem',
          boxShadow: '0 20px 50px rgba(11, 25, 44, 0.2)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 360px) 1fr',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          {/* Chairman Photo Frame */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              position: 'relative',
              display: 'inline-block',
              padding: '8px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 50%, #B38600 100%)',
              boxShadow: '0 12px 35px rgba(212, 175, 55, 0.3)'
            }}>
              <img
                src={chairman.photo}
                alt={chairman.name}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: '350px',
                  objectFit: 'cover',
                  borderRadius: '14px',
                  display: 'block'
                }}
              />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>{chairman.name}</div>
              <div style={{ color: '#D4AF37', fontSize: '0.85rem', fontWeight: 600 }}>{chairman.designation}</div>
            </div>
          </div>

          {/* Chairman Message & Bio */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4AF37', marginBottom: '1rem' }}>
              <Quote size={28} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Chairman's Visionary Message
              </span>
            </div>

            <h3 style={{ color: '#FFFFFF', fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', lineHeight: 1.3, marginBottom: '1.2rem' }}>
              "Empowering Rural & Urban Youth through Global Engineering Standards and Innovation."
            </h3>

            <p style={{ color: '#E2E8F0', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.2rem' }}>
              When we founded the Gayatri Educational Development Society in 1998, our driving ambition was to establish an institution of global distinction right in the heart of Palnadu. Today, Narasaraopeta Engineering College stands tall as an autonomous beacon of excellence with NAAC 'A+' Grade accreditation, NBA-accredited programs, and thriving research ecosystems.
            </p>

            <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.8rem' }}>
              {chairman.summary} We continuously invest in advanced infrastructure, AICTE IDEA Labs, student incubation grants, and international faculty enablement to ensure every graduate steps into the corporate world as a confident, ethical, and inventive engineering leader.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedLeader(chairman)}
                className="btn-primary"
              >
                Read Full Profile <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Leadership Grid */}
        <div style={{ marginBottom: '4.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0B192C' }}>
              Executive Leadership & Deans
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              Experienced leaders driving academic quality, campus operations, research breakthroughs, and corporate partnerships.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1.8rem' }}>
            {otherLeaders.map(leader => (
              <div
                key={leader.id}
                className="glass-card-light card-hover"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF'
                }}
              >
                <div>
                  <div style={{
                    width: '100%',
                    height: '240px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '1.2rem',
                    background: '#070F1E',
                    position: 'relative'
                  }}>
                    <img
                      src={leader.photo}
                      alt={leader.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      padding: '0.5rem 0.8rem',
                      background: 'linear-gradient(180deg, transparent 0%, rgba(7, 15, 30, 0.9) 100%)',
                      color: '#FFFFFF'
                    }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                        {leader.role}
                      </span>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B192C', marginBottom: '0.25rem' }}>
                    {leader.name}
                  </h4>

                  <div style={{ color: '#C59B27', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    {leader.designation}
                  </div>

                  <div style={{ color: '#64748B', fontSize: '0.78rem', marginBottom: '0.8rem', fontStyle: 'italic' }}>
                    {leader.qualification}
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    "{leader.message}"
                  </p>
                </div>

                <button
                  onClick={() => setSelectedLeader(leader)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.6rem 0.9rem',
                    borderRadius: '8px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    color: '#0B192C',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0B192C';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.color = '#0B192C';
                  }}
                >
                  <span>View Details & Scholarly Bio</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Vision, Mission & Core Values Interactive Tabs */}
        <div style={{
          background: '#070F1E',
          borderRadius: '24px',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          color: '#FFFFFF',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button
              onClick={() => setActiveAboutTab('vision')}
              style={{
                padding: '0.7rem 1.6rem',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: activeAboutTab === 'vision' ? 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)' : 'rgba(255,255,255,0.08)',
                color: activeAboutTab === 'vision' ? '#070F1E' : '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              <Compass size={16} style={{ display: 'inline', marginRight: '6px' }} /> Institutional Vision
            </button>

            <button
              onClick={() => setActiveAboutTab('mission')}
              style={{
                padding: '0.7rem 1.6rem',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: activeAboutTab === 'mission' ? 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)' : 'rgba(255,255,255,0.08)',
                color: activeAboutTab === 'mission' ? '#070F1E' : '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              <Target size={16} style={{ display: 'inline', marginRight: '6px' }} /> Mission Statements
            </button>

            <button
              onClick={() => setActiveAboutTab('values')}
              style={{
                padding: '0.7rem 1.6rem',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: activeAboutTab === 'values' ? 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)' : 'rgba(255,255,255,0.08)',
                color: activeAboutTab === 'values' ? '#070F1E' : '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              <Sparkles size={16} style={{ display: 'inline', marginRight: '6px' }} /> Core Values & Quality Policy
            </button>
          </div>

          {activeAboutTab === 'vision' && (
            <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto' }}>
              <div style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                color: '#FFF6D6',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
                fontStyle: 'italic'
              }}>
                "To emerge as a Centre of Excellence in Technical Education and Research, moulding globally competent, socially responsible, and ethically upright engineering professionals capable of driving technological progress."
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
                Adopted by the Governing Body and Academic Council to guide long-term autonomous development.
              </p>
            </div>
          )}

          {activeAboutTab === 'mission' && (
            <div className="grid-2" style={{ gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.04)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <CheckCircle2 size={24} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '0.3rem' }}>Academic Rigor & Outcome Education</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.88rem' }}>Impart high quality, student-centric outcome-based technical education through dynamic CBCS curriculum and continuous industry immersion.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.04)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <CheckCircle2 size={24} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '0.3rem' }}>Research & Prototyping Ecosystem</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.88rem' }}>Establish world-class research laboratories, AICTE IDEA prototyping hubs, and patent incubation centres to nurture indigenous inventions.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.04)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <CheckCircle2 size={24} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '0.3rem' }}>Industry Partnerships & Entrepreneurship</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.88rem' }}>Foster robust collaborations with global multinational companies, startup incubators, and industry bodies for 100% employability.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.04)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <CheckCircle2 size={24} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '0.3rem' }}>Ethics & Sustainable Community Progress</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.88rem' }}>Instil human values, professional ethics, environmental stewardship, and social commitment to serve regional and national development.</div>
                </div>
              </div>
            </div>
          )}

          {activeAboutTab === 'values' && (
            <div className="grid-3" style={{ gap: '1.5rem', maxWidth: '1050px', margin: '0 auto' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1.4rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)' }}>
                <div style={{ color: '#F1C40F', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>Excellence & Quality</div>
                <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Commitment to the highest standards of teaching, research publications in SCI/Scopus, and ISO 9001:2015 institutional benchmarks.</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1.4rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)' }}>
                <div style={{ color: '#F1C40F', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>Innovation & Integrity</div>
                <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Fostering creative problem-solving, patent filing, open inquiry, academic honesty, and transparent governance.</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1.4rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)' }}>
                <div style={{ color: '#F1C40F', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>Inclusivity & Student Care</div>
                <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Ensuring an equitable, empowering, and supportive learning campus for students from all socio-economic backgrounds.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leader Bio Modal */}
      {selectedLeader && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '650px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedLeader(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F172A'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', gap: '1.5rem', padding: '2rem', background: '#0B192C', color: '#FFFFFF', alignItems: 'center' }}>
              <img
                src={selectedLeader.photo}
                alt={selectedLeader.name}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '2px solid #D4AF37'
                }}
              />
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '0.3rem' }}>{selectedLeader.role}</span>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.3rem', marginBottom: '0.2rem' }}>{selectedLeader.name}</h3>
                <div style={{ color: '#D4AF37', fontSize: '0.85rem', fontWeight: 600 }}>{selectedLeader.designation}</div>
                <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{selectedLeader.qualification}</div>
              </div>
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Leadership Statement
                </div>
                <p style={{ color: '#0F172A', fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.6, background: '#F8FAFC', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #D4AF37' }}>
                  "{selectedLeader.message}"
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Professional Profile & Institutional Contributions
                </div>
                <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {selectedLeader.summary}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button
                  onClick={() => setSelectedLeader(null)}
                  className="btn-navy"
                  style={{ padding: '0.6rem 1.4rem' }}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .chairman-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

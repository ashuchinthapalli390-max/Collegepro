import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Award, 
  BookOpen, 
  Search, 
  ShieldCheck, 
  Phone, 
  LogIn, 
  Menu, 
  X, 
  ChevronDown, 
  GraduationCap, 
  FlaskConical, 
  Users, 
  Briefcase, 
  Camera, 
  Calendar,
  Sparkles,
  Trophy,
  Layers,
  MapPin
} from 'lucide-react';
import { COLLEGE_INFO, BRANDING_LOGOS, DEPARTMENTS } from '../../data/masterData.js';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenPortal, 
  onSelectDepartment, 
  onOpenGlobalSearch,
  isAuthenticated = false,
  currentUser = null
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); // 'about' | 'academics' | 'departments' | 'research' | 'students' | 'campus'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMegaMenu = () => setActiveMegaMenu(null);
  const userFirstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Portal';

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      {/* 1. TOP COMPACT UTILITY BAR */}
      <div style={{
        background: 'linear-gradient(90deg, #040811 0%, #070F1E 50%, #0B192C 100%)',
        color: '#E2E8F0',
        fontSize: '0.78rem',
        padding: '0.35rem 0',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D4AF37', fontWeight: 700 }}>
              <Award size={13} /> NAAC "A+" Grade (Cycle-2) | NBA Accredited (Tier-1) | Autonomous Institution
            </span>
            <span className="hide-mobile" style={{ color: '#94A3B8' }}>
              • EAMCET / ECET Code: <strong style={{ color: '#FFFFFF' }}>NARA</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href={`tel:${COLLEGE_INFO.admissionsHelpline.split('/')[0]}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#E2E8F0', fontSize: '0.75rem' }}>
              <Phone size={12} style={{ color: '#D4AF37' }} /> <span className="hide-mobile">Admissions:</span> +91 9440757039
            </a>
            <button 
              onClick={onOpenGlobalSearch}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.35rem', 
                background: 'rgba(255,255,255,0.08)', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '4px', 
                color: '#FFF', 
                fontSize: '0.72rem',
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              <Search size={11} /> Search (Ctrl+K)
            </button>
            <button
              onClick={onOpenPortal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: isAuthenticated 
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                color: isAuthenticated ? '#FFFFFF' : '#070F1E',
                padding: '0.25rem 0.85rem',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '0.74rem',
                boxShadow: isAuthenticated ? '0 2px 10px rgba(16, 185, 129, 0.4)' : '0 2px 8px rgba(212, 175, 55, 0.35)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isAuthenticated ? (
                <>
                  <ShieldCheck size={13} /> Enter Portal ({userFirstName})
                </>
              ) : (
                <>
                  <LogIn size={12} /> Portal Login
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR WITH MEGA MENUS */}
      <nav 
        onMouseLeave={closeMegaMenu}
        style={{
          background: isScrolled ? 'rgba(7, 15, 30, 0.96)' : 'rgba(11, 25, 44, 0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          transition: 'all 0.3s ease',
          boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.35)' : '0 4px 20px rgba(0,0,0,0.15)',
          position: 'relative'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem clamp(1rem, 2.5vw, 2rem)' }}>
          {/* Logo & College Identity */}
          <div 
            onClick={() => { setActiveTab('home'); closeMegaMenu(); }} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <img 
              src={BRANDING_LOGOS.collegeLogo} 
              alt="NEC Logo" 
              style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.4)' }} 
            />
            <div>
              <div style={{ 
                fontFamily: 'Cinzel, serif', 
                fontWeight: 800, 
                fontSize: '1.02rem', 
                color: '#FFFFFF', 
                letterSpacing: '0.03em',
                lineHeight: 1.2
              }}>
                NARASARAOPETA <span style={{ color: '#D4AF37' }}>ENGINEERING COLLEGE</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 500 }}>
                Autonomous Institution • Affiliated to JNTUK • Estd. 1998
              </div>
            </div>
          </div>

          {/* Desktop Primary Navigation Items */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
            <button
              onClick={() => { setActiveTab('home'); closeMegaMenu(); }}
              style={{
                padding: '0.45rem 0.65rem',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: activeTab === 'home' ? '#F1C40F' : '#E2E8F0',
                borderBottom: activeTab === 'home' ? '2px solid #F1C40F' : '2px solid transparent'
              }}
            >
              Home
            </button>

            {/* Mega Menu 1: About */}
            <div onMouseEnter={() => setActiveMegaMenu('about')}>
              <button
                onClick={() => { setActiveTab('about'); closeMegaMenu(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: ['about', 'leadership', 'governance'].includes(activeTab) ? '#F1C40F' : '#E2E8F0'
                }}
              >
                About <ChevronDown size={13} />
              </button>
            </div>

            {/* Mega Menu 2: Academics */}
            <div onMouseEnter={() => setActiveMegaMenu('academics')}>
              <button
                onClick={() => { setActiveTab('bos'); closeMegaMenu(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: ['bos', 'exam-cell'].includes(activeTab) ? '#F1C40F' : '#E2E8F0'
                }}
              >
                Academics <ChevronDown size={13} />
              </button>
            </div>

            {/* Mega Menu 3: Departments (13) */}
            <div onMouseEnter={() => setActiveMegaMenu('departments')}>
              <button
                onClick={() => { setActiveTab('departments'); closeMegaMenu(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: activeTab === 'departments' ? '#F1C40F' : '#E2E8F0'
                }}
              >
                Departments <ChevronDown size={13} />
              </button>
            </div>

            {/* Faculty Directory */}
            <button
              onClick={() => { setActiveTab('faculty'); closeMegaMenu(); }}
              style={{
                padding: '0.45rem 0.65rem',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: activeTab === 'faculty' ? '#F1C40F' : '#E2E8F0',
                borderBottom: activeTab === 'faculty' ? '2px solid #F1C40F' : '2px solid transparent'
              }}
            >
              Faculty (418)
            </button>

            {/* Mega Menu 5: Students */}
            <div onMouseEnter={() => setActiveMegaMenu('students')}>
              <button
                onClick={() => { setActiveTab('student-life'); closeMegaMenu(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: activeTab === 'student-life' ? '#F1C40F' : '#E2E8F0'
                }}
              >
                Students <ChevronDown size={13} />
              </button>
            </div>

            {/* Placements */}
            <button
              onClick={() => { setActiveTab('placements'); closeMegaMenu(); }}
              style={{
                padding: '0.45rem 0.65rem',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: activeTab === 'placements' ? '#F1C40F' : '#E2E8F0',
                borderBottom: activeTab === 'placements' ? '2px solid #F1C40F' : '2px solid transparent'
              }}
            >
              Placements
            </button>

            {/* Mega Menu 6: Campus & More */}
            <div onMouseEnter={() => setActiveMegaMenu('campus')}>
              <button
                onClick={() => { setActiveTab('virtual-tour'); closeMegaMenu(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: ['virtual-tour', 'contact'].includes(activeTab) ? '#F1C40F' : '#E2E8F0'
                }}
              >
                Campus & Media <ChevronDown size={13} />
              </button>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div style={{ display: 'none' }} className="show-mobile">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: '#FFFFFF', padding: '0.4rem' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* 3. MEGA MENU DROPDOWN PANELS (Desktop) */}
        {activeMegaMenu && (
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              background: 'rgba(7, 15, 30, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '2px solid #D4AF37',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              padding: '1.5rem 0',
              zIndex: 2000
            }}
          >
            <div className="container">
              {/* About Mega Menu */}
              {activeMegaMenu === 'about' && (
                <div className="grid-3" style={{ gap: '1.5rem' }}>
                  <div 
                    onClick={() => { setActiveTab('about'); closeMegaMenu(); }} 
                    style={{ padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ color: '#F1C40F', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>About NEC & Society</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Gayatri Educational Development Society (GEDS), institutional milestones, and campus evolution since 1998.</div>
                  </div>
                  <div 
                    onClick={() => { setActiveTab('leadership'); closeMegaMenu(); }} 
                    style={{ padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ color: '#F1C40F', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Management & Leadership</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Chairman Sri M. V. Koteswara Rao message, Vice Chairman, Secretary, Director, Principal, Vice Principal & Dean R&D.</div>
                  </div>
                  <div 
                    onClick={() => { setActiveTab('governance'); closeMegaMenu(); }} 
                    style={{ padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ color: '#F1C40F', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Governing Body & Academic Council</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>13 Governing Body members & 23 Academic Council statutory members guiding institutional policies.</div>
                  </div>
                </div>
              )}

              {/* Academics Mega Menu */}
              {activeMegaMenu === 'academics' && (
                <div className="grid-3" style={{ gap: '1.5rem' }}>
                  <div 
                    onClick={() => { setActiveTab('bos'); closeMegaMenu(); }} 
                    style={{ padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ color: '#F1C40F', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Board of Studies (BoS) Hub</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Autonomous regulation structures across R16, R19, R20, R23, and R26 with university nominees.</div>
                  </div>
                  <div 
                    onClick={() => { setActiveTab('exam-cell'); closeMegaMenu(); }} 
                    style={{ padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ color: '#F1C40F', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Autonomous Examination Cell</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Semester timetables, results portals, academic calendars, and revaluation circulars.</div>
                  </div>
                  <div 
                    onClick={() => { setActiveTab('departments'); closeMegaMenu(); }} 
                    style={{ padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ color: '#F1C40F', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Academic Programs & Degrees</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>13 Undergraduate B.Tech specializations, M.Tech postgraduation, MBA, and MCA degrees.</div>
                  </div>
                </div>
              )}

              {/* Departments Mega Menu (13 Depts Grid) */}
              {activeMegaMenu === 'departments' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      13 Academic & Engineering Departments
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Select any department for specialized curriculum, HOD bio, and faculty list</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
                    {DEPARTMENTS.map(d => (
                      <div
                        key={d.id}
                        onClick={() => {
                          onSelectDepartment(d);
                          closeMegaMenu();
                        }}
                        style={{
                          padding: '0.5rem 0.7rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                          e.currentTarget.style.borderColor = '#D4AF37';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        }}
                      >
                        <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.82rem' }}>{d.name}</div>
                        <div style={{ color: '#94A3B8', fontSize: '0.7rem' }}>HOD: {d.hodName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Students Mega Menu */}
              {activeMegaMenu === 'students' && (
                <div className="grid-3" style={{ gap: '1.5rem' }}>
                  <div 
                    onClick={() => { setActiveTab('student-life'); closeMegaMenu(); }} 
                    style={{ padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ color: '#F1C40F', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Student Achievements & Awards</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Smart India Hackathon 1st Prize (₹1,00,000), national competitions, and university medals.</div>
                  </div>
                  <div 
                    onClick={() => { setActiveTab('student-life'); closeMegaMenu(); }} 
                    style={{ padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ color: '#F1C40F', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Industry Internships & Projects</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Corporate internships at AWS, Oracle, Qualcomm, Schneider, and capstone engineering projects.</div>
                  </div>
                  <div 
                    onClick={() => { setActiveTab('student-life'); closeMegaMenu(); }} 
                    style={{ padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ color: '#F1C40F', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>NPTEL / MOOCs & Student Clubs</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>SWAYAM certifications, NCC, Sports arenas, Dance & Photography clubs.</div>
                  </div>
                </div>
              )}

              {/* Campus Mega Menu */}
              {activeMegaMenu === 'campus' && (
                <div className="grid-3" style={{ gap: '1.5rem' }}>
                  <div 
                    onClick={() => { setActiveTab('virtual-tour'); closeMegaMenu(); }} 
                    style={{ padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ color: '#F1C40F', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Virtual Campus Tour (14 Videos)</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>High-definition aerial drone footage, admin blocks, basketball courts, and student walkway.</div>
                  </div>
                  <div 
                    onClick={() => { setActiveTab('virtual-tour'); closeMegaMenu(); }} 
                    style={{ padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ color: '#F1C40F', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Campus Photography Gallery</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Lush green 40-acre campus architecture, digital libraries, and night illumination views.</div>
                  </div>
                  <div 
                    onClick={() => { setActiveTab('contact'); closeMegaMenu(); }} 
                    style={{ padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ color: '#F1C40F', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Contact & Location Details</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Kotappakonda Road, Yellamanda campus, helplines, and direct admissions enquiry.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. MOBILE DRAWER WITH ACCORDIONS */}
        {mobileMenuOpen && (
          <div style={{
            background: 'rgba(7, 15, 30, 0.98)',
            borderTop: '1px solid rgba(212, 175, 55, 0.2)',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About NEC & Management' },
              { id: 'departments', label: '13 Departments Portals' },
              { id: 'faculty', label: 'Faculty Directory (418 Scholars)' },
              { id: 'bos', label: 'Board of Studies (BoS)' },
              { id: 'student-life', label: 'Student Achievements & Life' },
              { id: 'placements', label: 'Campus Placements' },
              { id: 'virtual-tour', label: 'Virtual Tour & Media' },
              { id: 'exam-cell', label: 'Autonomous Exam Cell' },
              { id: 'contact', label: 'Contact & Admissions' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  textAlign: 'left',
                  padding: '0.7rem 1rem',
                  color: activeTab === item.id ? '#F1C40F' : '#FFFFFF',
                  background: activeTab === item.id ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => {
                onOpenPortal();
                setMobileMenuOpen(false);
              }}
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.8rem', padding: '0.75rem' }}
            >
              <LogIn size={16} /> Portal Login
            </button>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 1080px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </header>
  );
}

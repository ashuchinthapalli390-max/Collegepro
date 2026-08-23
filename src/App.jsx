import React, { useState, useEffect } from 'react';
import './styles/design-system.css';

// Master Data & Store
import { USER_ROLES } from './data/portalStore.js';
import { firebaseAuth } from './lib/firebase/client.ts';
import { signOut } from 'firebase/auth';
import { BRANDING_LOGOS } from './data/masterData.js';

// Public Website Components
import Header from './components/public/Header.jsx';
import Hero from './components/public/Hero.jsx';
import StatsCounter from './components/public/StatsCounter.jsx';
import LeadershipSection from './components/public/LeadershipSection.jsx';
import GovernanceSection from './components/public/GovernanceSection.jsx';
import DepartmentsHub from './components/public/DepartmentsHub.jsx';
import FacultyDirectory from './components/public/FacultyDirectory.jsx';
import ResearchHub from './components/public/ResearchHub.jsx';
import VirtualTour from './components/public/VirtualTour.jsx';
import MadamShowcase from './components/public/MadamShowcase.jsx';
import ExamCellAndContact from './components/public/ExamCellAndContact.jsx';

// Portal Components
import PortalAuth from './components/portal/PortalAuth.jsx';
import PortalDashboard from './components/portal/PortalDashboard.jsx';

// Global Search Palette
import GlobalSearchModal from './components/common/GlobalSearchModal.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleResetStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#070F1E', color: '#FFF', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#D4AF37', marginBottom: '1rem', fontFamily: 'Cinzel, serif' }}>
            Narasaraopeta Engineering College Portal
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '500px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            A temporary display error occurred while rendering the page data. You can refresh or reset cached records.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{ padding: '0.6rem 1.4rem' }}
            >
              Reload Page
            </button>
            <button
              onClick={this.handleResetStorage}
              className="btn-secondary"
              style={{ padding: '0.6rem 1.4rem' }}
            >
              Reset Cache & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

function MainApp() {
  // Authentication & Session Persistence State
  const [authState, setAuthState] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'
  const [currentUser, setCurrentUser] = useState(USER_ROLES[0]);
  const [viewMode, setViewMode] = useState('public'); // 'public' | 'portal'
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // Global Search
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // 1. Authoritative Server Session Check on Page Load / Refresh
  useEffect(() => {
    let isMounted = true;

    async function checkServerSession() {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'same-origin',
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated && data.user) {
            setCurrentUser(data.user);
            setViewMode('portal');
            setAuthState('authenticated');
            return;
          }
        }
      } catch (err) {
        console.warn('Session verification fallback to public:', err);
      }

      if (isMounted) {
        setAuthState('unauthenticated');
      }
    }

    checkServerSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, viewMode]);

  const handleOpenPortal = async () => {
    if (authState === 'authenticated') {
      setViewMode('portal');
      return;
    }

    // Authoritative check against server session cookie
    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          setAuthState('authenticated');
          setViewMode('portal');
          return;
        }
      }
    } catch (e) {
      console.warn('Live session check fallback:', e);
    }

    setAuthModalOpen(true);
  };

  // Pure navigation to Public Website (Preserves active verified session!)
  const handleGoToPublicWebsite = () => {
    setViewMode('public');
    setActiveTab('home');
  };

  // Explicit User Logout (Revokes server session cookie)
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin'
      });
    } catch (err) {
      console.error('Server logout error:', err);
    }

    try {
      await signOut(firebaseAuth);
    } catch (err) {}

    setViewMode('public');
    setActiveTab('home');
    setAuthState('unauthenticated');
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
    setViewMode('portal');
    setAuthState('authenticated');
  };

  const handleSelectDepartment = (dept) => {
    setSelectedDepartment(dept);
    setActiveTab('departments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFaculty = (fac) => {
    setSelectedFaculty(fac);
    setActiveTab('faculty');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Loading State During Session Hydration (Prevents Login Screen Flash)
  if (authState === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#070F1E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <img
          src={BRANDING_LOGOS.collegeLogo}
          alt="NEC Crest"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            border: '2px solid #D4AF37',
            boxShadow: '0 0 25px rgba(212, 175, 55, 0.4)',
            marginBottom: '1.5rem',
            animation: 'pulse 2s infinite'
          }}
        />
        <div style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          letterSpacing: '0.5px',
          color: '#F1C40F'
        }}>
          Verifying Authorized Portal Session...
        </div>
        <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.35rem' }}>
          Narasaraopeta Engineering College (Autonomous)
        </div>
      </div>
    );
  }

  // 3. Authenticated Secure Portal View Mode (Survives Refresh & Public Navigation!)
  if (viewMode === 'portal' && authState === 'authenticated') {
    return (
      <div className="nec-app">
        <PortalDashboard
          currentUser={currentUser}
          onNavigatePublic={handleGoToPublicWebsite}
          onLogout={handleLogout}
          onExitPortal={handleGoToPublicWebsite}
        />
      </div>
    );
  }

  // 4. Public College Website View Mode
  return (
    <div className="nec-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedDepartment(null);
          setActiveTab(tab);
        }}
        isAuthenticated={authState === 'authenticated'}
        currentUser={currentUser}
        onOpenPortal={handleOpenPortal}
        onSelectDepartment={handleSelectDepartment}
        onOpenGlobalSearch={() => setSearchModalOpen(true)}
      />

      {/* PUBLIC TAB 1: HOME (Complete Cinematic Experience) */}
      {activeTab === 'home' && (
        <main>
          {/* Cinematic Hero Background Video */}
          <Hero
            onExploreClick={() => {
              const el = document.getElementById('departments-preview');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenPortal={handleOpenPortal}
            onGoToResearch={() => setActiveTab('research')}
            onGoToDepartments={() => setActiveTab('departments')}
          />

          {/* Live Dynamic Stats Counter */}
          <StatsCounter />

          {/* Leadership & Vision Section */}
          <LeadershipSection />

          {/* 13 Departments Showcase Preview */}
          <div id="departments-preview">
            <DepartmentsHub
              selectedDepartment={selectedDepartment}
              onSelectDepartment={handleSelectDepartment}
              onSelectFaculty={handleSelectFaculty}
            />
          </div>

          {/* Research & Patents Showcase Preview */}
          <ResearchHub onOpenPortal={handleOpenPortal} />

          {/* Virtual Campus Tour & Media Showcase */}
          <VirtualTour />

          {/* Dr. S. N. Tirumala Rao Madam Showcase */}
          <MadamShowcase />

          {/* Exam Cell, Contact & Footer */}
          <ExamCellAndContact />
        </main>
      )}

      {/* PUBLIC TAB 2: GOVERNANCE & BOS */}
      {activeTab === 'governance' && (
        <main>
          <GovernanceSection onOpenPortal={handleOpenPortal} />
          <ExamCellAndContact />
        </main>
      )}

      {/* PUBLIC TAB 3: DEPARTMENTS HUB */}
      {activeTab === 'departments' && (
        <main>
          <DepartmentsHub
            selectedDepartment={selectedDepartment}
            onSelectDepartment={handleSelectDepartment}
            onSelectFaculty={handleSelectFaculty}
          />
          <ExamCellAndContact />
        </main>
      )}

      {/* PUBLIC TAB 4: FACULTY DIRECTORY */}
      {activeTab === 'faculty' && (
        <main>
          <FacultyDirectory
            selectedFaculty={selectedFaculty}
            onSelectFaculty={handleSelectFaculty}
            onOpenPortal={handleOpenPortal}
          />
          <ExamCellAndContact />
        </main>
      )}

      {/* PUBLIC TAB 5: RESEARCH & IPR */}
      {activeTab === 'research' && (
        <main>
          <ResearchHub onOpenPortal={handleOpenPortal} />
          <ExamCellAndContact />
        </main>
      )}

      {/* Authentication Modal */}
      {authModalOpen && (
        <PortalAuth
          currentUser={currentUser}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setAuthModalOpen(false)}
        />
      )}

      {/* Global Search Modal */}
      {searchModalOpen && (
        <GlobalSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          onNavigate={(targetTab, item) => {
            setSearchModalOpen(false);
            if (targetTab === 'portal') {
              handleOpenPortal();
            } else {
              setActiveTab(targetTab);
              if (item?.dept) setSelectedDepartment(item.dept);
              if (item?.faculty) setSelectedFaculty(item.faculty);
            }
          }}
        />
      )}
    </div>
  );
}

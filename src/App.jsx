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
import VirtualTour from './components/public/VirtualTour.jsx';
import MadamShowcase from './components/public/MadamShowcase.jsx';
import ExamCellAndContact from './components/public/ExamCellAndContact.jsx';

// Portal Components
import PortalAuth from './components/portal/PortalAuth.jsx';
import PortalDashboard from './components/portal/PortalDashboard.jsx';

// Global Search Palette & Error Boundaries
import GlobalSearchModal from './components/common/GlobalSearchModal.jsx';
import PublicSectionErrorBoundary from './components/common/PublicSectionErrorBoundary.jsx';
import { resetUiPreferences } from './lib/storage/preferenceStorage.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AppErrorBoundary caught:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    // Automatically reset error state on navigation
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  // Safe UI cache reset (Never wipes auth cookies, tokens or server session!)
  handleResetStorage = () => {
    resetUiPreferences();
    this.setState({ hasError: false, error: null });
  };

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#070F1E', color: '#FFF', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#D4AF37', marginBottom: '0.8rem', fontFamily: 'Cinzel, serif' }}>
            Narasaraopeta Engineering College
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '540px', marginBottom: '1.5rem', fontSize: '0.92rem', lineHeight: 1.6 }}>
            A temporary display issue occurred while rendering this module. You can try reloading the view or resetting cached display preferences.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleTryAgain}
              className="btn-primary"
              style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}
            >
              Try Again
            </button>
            <button
              onClick={this.handleResetStorage}
              className="btn-secondary"
              style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}
            >
              Reset Display Preferences
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return <MainApp />;
}

function MainApp() {
  // Authentication & Session Persistence State
  const [authState, setAuthState] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'
  const [currentUser, setCurrentUser] = useState(null); // Never default to Super Admin
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
    if (authState === 'authenticated' && currentUser) {
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

  // 2. Loading State During Session Hydration (Prevents Privilege/Role Flash)
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
  if (viewMode === 'portal' && authState === 'authenticated' && currentUser) {
    return (
      <ErrorBoundary resetKey="portal-dashboard">
        <PortalDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigatePublic={handleGoToPublicWebsite}
        />
      </ErrorBoundary>
    );
  }

  // 4. Public Institutional Website (Accessible to both Guest and Authenticated visitors)
  return (
    <ErrorBoundary resetKey={`public-${activeTab}`}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
        {/* Dynamic Header with Session-Aware Portal Indicator */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenPortal={handleOpenPortal}
          onSelectDepartment={handleSelectDepartment}
          onOpenGlobalSearch={() => setSearchModalOpen(true)}
          isAuthenticated={authState === 'authenticated'}
          currentUser={currentUser}
        />

        {/* Main Public Body Switching by activeTab */}
        <main style={{ flex: 1 }}>
          {activeTab === 'home' && (
            <>
              <PublicSectionErrorBoundary sectionName="Hero">
                <Hero onExploreCampus={() => setActiveTab('campus')} onOpenPortal={handleOpenPortal} />
              </PublicSectionErrorBoundary>

              <PublicSectionErrorBoundary sectionName="StatsCounter">
                <StatsCounter />
              </PublicSectionErrorBoundary>

              <PublicSectionErrorBoundary sectionName="LeadershipSection">
                <LeadershipSection />
              </PublicSectionErrorBoundary>

              <PublicSectionErrorBoundary sectionName="DepartmentsHub">
                <DepartmentsHub 
                  selectedDepartment={selectedDepartment} 
                  onSelectDepartment={handleSelectDepartment}
                  onSelectFaculty={handleSelectFaculty}
                />
              </PublicSectionErrorBoundary>

              <PublicSectionErrorBoundary sectionName="VirtualTour">
                <VirtualTour />
              </PublicSectionErrorBoundary>

              <PublicSectionErrorBoundary sectionName="ExamCellAndContact">
                <ExamCellAndContact />
              </PublicSectionErrorBoundary>
            </>
          )}

          {activeTab === 'about' && (
            <>
              <PublicSectionErrorBoundary sectionName="LeadershipSection">
                <LeadershipSection />
              </PublicSectionErrorBoundary>
              <PublicSectionErrorBoundary sectionName="GovernanceSection">
                <GovernanceSection />
              </PublicSectionErrorBoundary>
            </>
          )}

          {activeTab === 'departments' && (
            <PublicSectionErrorBoundary sectionName="DepartmentsHub">
              <DepartmentsHub 
                selectedDepartment={selectedDepartment} 
                onSelectDepartment={handleSelectDepartment}
                onSelectFaculty={handleSelectFaculty}
              />
            </PublicSectionErrorBoundary>
          )}

          {activeTab === 'faculty' && (
            <PublicSectionErrorBoundary sectionName="FacultyDirectory">
              <FacultyDirectory 
                selectedFacultyFromParent={selectedFaculty}
                onClearSelectedFaculty={() => setSelectedFaculty(null)}
              />
            </PublicSectionErrorBoundary>
          )}

          {activeTab === 'campus' && (
            <PublicSectionErrorBoundary sectionName="VirtualTour">
              <VirtualTour />
            </PublicSectionErrorBoundary>
          )}

          {activeTab === 'governance' && (
            <PublicSectionErrorBoundary sectionName="GovernanceSection">
              <GovernanceSection />
            </PublicSectionErrorBoundary>
          )}

          {['madam', 'student-life', 'placements', 'bos'].includes(activeTab) && (
            <PublicSectionErrorBoundary sectionName="MadamShowcase">
              <MadamShowcase onSelectFaculty={handleSelectFaculty} />
            </PublicSectionErrorBoundary>
          )}

          {activeTab === 'contact' && (
            <PublicSectionErrorBoundary sectionName="ExamCellAndContact">
              <ExamCellAndContact />
            </PublicSectionErrorBoundary>
          )}
        </main>

        {/* Authentication Modal with 2-Step OTP Verification */}
        {authModalOpen && (
          <PortalAuth
            onClose={() => setAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* Global Instant Search Palette (Ctrl + K) */}
        <GlobalSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          onSelectFaculty={(fac) => {
            setSelectedFaculty(fac);
            setActiveTab('faculty');
          }}
          onSelectDepartment={(dept) => {
            setSelectedDepartment(dept);
            setActiveTab('departments');
          }}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      </div>
    </ErrorBoundary>
  );
}

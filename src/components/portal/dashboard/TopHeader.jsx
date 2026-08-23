import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  RefreshCw, 
  Globe, 
  ChevronRight, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { BRANDING_LOGOS } from '../../../data/masterData.js';
import ProfileDropdown from './ProfileDropdown.jsx';
import { 
  AnimatedIconButton, 
  AnimatedActionButton, 
  AnimatedQuickAction, 
  AnimatedBadge 
} from '../../motion/index.js';

export default function TopHeader({
  currentUser,
  sidebarExpanded,
  onToggleSidebar,
  activeModule,
  activeCategoryLabel,
  activeModuleLabel,
  onOpenSync,
  onOpenQuickAction,
  onNavigatePublic,
  onLogout,
  onOpenSettings,
  onOpenNotifications,
  unreadAlertsCount = 3
}) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncClick = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      if (onOpenSync) {
        await onOpenSync();
      }
    } finally {
      // Settle gracefully
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  return (
    <header style={{
      background: 'rgba(7, 15, 30, 0.95)',
      backdropFilter: 'blur(16px)',
      color: '#FFFFFF',
      borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
      padding: '0.65rem 1.25rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        {/* Left Section: Menu Toggle + College Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <AnimatedIconButton
            icon={Menu}
            onClick={onToggleSidebar}
            tooltip="Toggle Navigation Sidebar"
            ariaLabel="Toggle Sidebar"
            size={18}
            buttonSize={36}
            variant="default"
          />

          {/* Logo & Portal Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img 
              src={BRANDING_LOGOS.collegeLogo} 
              alt="NEC Logo" 
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            />
            <div>
              <div style={{
                fontFamily: 'Cinzel, Georgia, serif',
                fontWeight: 800,
                fontSize: '0.95rem',
                letterSpacing: '0.5px',
                color: '#FFFFFF',
                lineHeight: 1.1
              }}>
                NEC PORTAL
              </div>
              <div style={{ fontSize: '0.68rem', color: '#D4AF37', fontWeight: 600 }}>
                Academic & Research Administration
              </div>
            </div>
          </div>
        </div>

        {/* Center: Dynamic Breadcrumbs */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.78rem',
          color: '#94A3B8',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '0.3rem 0.8rem',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}
        className="md:flex"
        >
          <span>Dashboard</span>
          <ChevronRight size={12} style={{ color: '#64748B' }} />
          <span style={{ color: '#CBD5E1' }}>{activeCategoryLabel || 'Overview'}</span>
          <ChevronRight size={12} style={{ color: '#64748B' }} />
          <span style={{ color: '#F1C40F', fontWeight: 700 }}>{activeModuleLabel || 'Home'}</span>
        </div>

        {/* Right Section: Actions & Authenticated Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Quick Action (+) Button */}
          <AnimatedQuickAction
            onSelectAction={onOpenQuickAction}
            currentUser={currentUser}
            buttonLabel="New Entry"
          />

          {/* Research Auto-Sync / Refresh Trigger */}
          <AnimatedActionButton
            icon={RefreshCw}
            onClick={handleSyncClick}
            isLoading={isSyncing}
            variant="secondary"
            size="sm"
            style={{ display: 'none' }}
            className="sm:inline-flex"
          >
            {isSyncing ? 'Syncing...' : 'Auto-Sync'}
          </AnimatedActionButton>

          {/* Icon-only Refresh for mobile */}
          <div className="sm:hidden">
            <AnimatedIconButton
              icon={RefreshCw}
              onClick={handleSyncClick}
              isSpinning={isSyncing}
              rotateOnHover={18}
              tooltip="Sync Repository Data"
              ariaLabel="Sync Repository Data"
              size={14}
              buttonSize={34}
            />
          </div>

          {/* Notifications Bell with Animated Badge */}
          <div style={{ position: 'relative' }}>
            <AnimatedIconButton
              icon={Bell}
              onClick={onOpenNotifications}
              isSwaying={true}
              tooltip="Institutional Notifications & Alerts"
              ariaLabel="View Notifications"
              size={16}
              buttonSize={34}
            />
            {unreadAlertsCount > 0 && (
              <div style={{ position: 'absolute', top: '-4px', right: '-4px', pointerEvents: 'none' }}>
                <AnimatedBadge count={unreadAlertsCount} variant="danger" size="sm" />
              </div>
            )}
          </div>

          {/* Public Website Link (Navigation only! Preserves session!) */}
          <AnimatedActionButton
            icon={Globe}
            onClick={onNavigatePublic}
            variant="ghost"
            size="sm"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#E2E8F0',
              display: 'none'
            }}
            className="md:inline-flex"
          >
            Public Website
          </AnimatedActionButton>

          {/* Icon-only Globe for tablet/mobile */}
          <div className="md:hidden">
            <AnimatedIconButton
              icon={Globe}
              onClick={onNavigatePublic}
              rotateOnHover={12}
              tooltip="Go to Public Website"
              ariaLabel="Public Website"
              size={14}
              buttonSize={34}
            />
          </div>

          {/* Profile Dropdown */}
          <ProfileDropdown
            currentUser={currentUser}
            onNavigatePublic={onNavigatePublic}
            onLogout={onLogout}
            onOpenSettings={onOpenSettings}
          />
        </div>
      </div>
    </header>
  );
}

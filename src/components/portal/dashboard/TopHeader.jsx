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
  unreadAlertsCount = 0
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
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  return (
    <header style={{
      background: 'rgba(7, 15, 30, 0.96)',
      backdropFilter: 'blur(16px)',
      color: '#FFFFFF',
      borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
      padding: '0.55rem clamp(0.75rem, 2vw, 1.25rem)',
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
        gap: '0.75rem',
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        {/* Left Section: Menu Toggle + Compact NEC Crest Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
          <AnimatedIconButton
            icon={Menu}
            onClick={onToggleSidebar}
            tooltip="Toggle Navigation Sidebar"
            ariaLabel="Toggle Sidebar"
            size={18}
            buttonSize={36}
            variant="default"
          />

          {/* Compact Verified NEC Crest & Portal Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              border: '1px solid #D4AF37',
              background: '#070F1E',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              <img 
                src="/assets/NEC Logos/College-logo.jpeg" 
                alt="NEC Crest" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }}
              />
            </div>
            
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{
                fontFamily: 'Cinzel, Georgia, serif',
                fontWeight: 800,
                fontSize: 'clamp(0.88rem, 2vw, 1rem)',
                letterSpacing: '0.5px',
                color: '#FFFFFF',
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                NEC PORTAL
              </div>
              <div 
                className="desktop-only"
                style={{ fontSize: '0.66rem', color: '#D4AF37', fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                Academic & Research Administration
              </div>
            </div>
          </div>
        </div>

        {/* Center: Dynamic Breadcrumbs (Desktop Only) */}
        <div 
          className="desktop-flex"
          style={{
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.78rem',
            color: '#94A3B8',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '0.3rem 0.8rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <span>Dashboard</span>
          <ChevronRight size={12} style={{ color: '#64748B' }} />
          <span style={{ color: '#CBD5E1' }}>{activeCategoryLabel || 'Overview'}</span>
          <ChevronRight size={12} style={{ color: '#64748B' }} />
          <span style={{ color: '#F1C40F', fontWeight: 700 }}>{activeModuleLabel || 'Home'}</span>
        </div>

        {/* Right Section: Actions & Authenticated Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
          {/* Quick Action (+) Button (Tablet & Desktop) */}
          <div className="desktop-only">
            <AnimatedQuickAction
              onSelectAction={onOpenQuickAction}
              currentUser={currentUser}
              buttonLabel="New Entry"
            />
          </div>

          {/* Research Auto-Sync / Refresh Trigger (Desktop) */}
          <div className="desktop-only">
            <AnimatedActionButton
              icon={RefreshCw}
              onClick={handleSyncClick}
              isLoading={isSyncing}
              variant="secondary"
              size="sm"
            >
              {isSyncing ? 'Syncing...' : 'Auto-Sync'}
            </AnimatedActionButton>
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
              buttonSize={36}
            />
            {unreadAlertsCount > 0 && (
              <div style={{ position: 'absolute', top: '-3px', right: '-3px', pointerEvents: 'none' }}>
                <AnimatedBadge count={unreadAlertsCount} variant="danger" size="sm" />
              </div>
            )}
          </div>

          {/* Public Website Link (Desktop) */}
          <div className="desktop-only">
            <AnimatedActionButton
              icon={Globe}
              onClick={onNavigatePublic}
              variant="ghost"
              size="sm"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#E2E8F0'
              }}
            >
              Public Website
            </AnimatedActionButton>
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

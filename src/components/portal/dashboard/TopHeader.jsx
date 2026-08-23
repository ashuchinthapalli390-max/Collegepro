import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  RefreshCw, 
  Globe, 
  ChevronRight, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { BRANDING_LOGOS } from '../../../data/masterData.js';
import ProfileDropdown from './ProfileDropdown.jsx';

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
          <button
            type="button"
            onClick={onToggleSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F1C40F',
              cursor: 'pointer'
            }}
            className="hover:bg-white/15"
            aria-label="Toggle Sidebar"
          >
            <Menu size={18} />
          </button>

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
          {/* Quick Action Button */}
          {onOpenQuickAction && (
            <button
              type="button"
              onClick={onOpenQuickAction}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                color: '#070F1E',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.76rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(212, 175, 55, 0.35)'
              }}
              className="hover:scale-105 transition-transform"
            >
              <Plus size={14} /> <span style={{ display: 'none' }} className="sm:inline">New Entry</span>
            </button>
          )}

          {/* Research Auto-Sync Trigger */}
          <button
            type="button"
            onClick={onOpenSync}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.76rem',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              cursor: 'pointer'
            }}
            className="hover:bg-white/15"
          >
            <RefreshCw size={13} style={{ color: '#F1C40F' }} />
            <span style={{ display: 'none' }} className="sm:inline">Auto-Sync</span>
          </button>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#CBD5E1',
              cursor: 'pointer'
            }}
            className="hover:bg-white/15 hover:text-white"
            aria-label="View Notifications"
          >
            <Bell size={16} />
            {unreadAlertsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#DC2626',
                color: '#FFFFFF',
                fontSize: '0.62rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #070F1E'
              }}>
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Public Website Link (Navigation only! Preserves session!) */}
          <button
            type="button"
            onClick={onNavigatePublic}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#E2E8F0',
              padding: '0.4rem 0.7rem',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 600,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              cursor: 'pointer'
            }}
            className="hover:bg-white/15"
          >
            <Globe size={13} style={{ color: '#60A5FA' }} />
            <span style={{ display: 'none' }} className="md:inline">Public Website</span>
          </button>

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

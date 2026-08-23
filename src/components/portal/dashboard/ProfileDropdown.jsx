import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Bell, 
  ExternalLink, 
  Mail, 
  Globe,
  CheckCircle2 
} from 'lucide-react';
import { getInitials, getRolePresentation } from '../../../lib/auth/rolePresentation.js';

export default function ProfileDropdown({ currentUser, onNavigatePublic, onLogout, onOpenSettings, onOpenProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = currentUser?.name || currentUser?.fullName || 'Academic Officer';
  const rolePresentation = getRolePresentation(currentUser?.role, currentUser?.dept, displayName);
  const displayRole = rolePresentation.shortLabel || currentUser?.label || currentUser?.role || 'Staff';
  const displayEmail = currentUser?.email || 'portal@nrtec.in';
  const initials = getInitials(displayName);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '9999px',
          padding: '0.3rem 0.75rem 0.3rem 0.35rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
        className="hover:bg-white/10"
      >
        {/* Avatar Circle */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 50%, #AA820A 100%)',
          color: '#070F1E',
          fontWeight: 800,
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(212, 175, 55, 0.35)',
          flexShrink: 0
        }}>
          {initials}
        </div>

        {/* User Details (Desktop) */}
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
            {displayName.length > 18 ? displayName.slice(0, 16) + '...' : displayName}
          </span>
          <span style={{ fontSize: '0.68rem', color: '#D4AF37', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ShieldCheck size={10} /> {displayRole}
          </span>
        </div>

        <ChevronDown 
          size={14} 
          style={{ 
            color: '#94A3B8', 
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }} 
        />
      </button>

      {/* Floating Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '280px',
              background: '#070F1E',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '14px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.15)',
              padding: '0.75rem',
              zIndex: 1000,
              overflow: 'hidden'
            }}
          >
            {/* Header User Identity Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '10px',
              padding: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                  color: '#070F1E',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {initials}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {displayName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 600 }}>
                    {displayRole}
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '0.72rem',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                wordBreak: 'break-all',
                paddingTop: '0.35rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <Mail size={11} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <span>{displayEmail}</span>
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenProfile) onOpenProfile();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#E2E8F0',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 0.15s ease'
                }}
                className="hover:bg-white/10 hover:text-white"
              >
                <User size={15} style={{ color: '#D4AF37' }} /> My Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenSettings) onOpenSettings();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#E2E8F0',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 0.15s ease'
                }}
                className="hover:bg-white/10 hover:text-white"
              >
                <Settings size={15} style={{ color: '#D4AF37' }} /> Security & Policies
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onNavigatePublic) onNavigatePublic();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#E2E8F0',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 0.15s ease'
                }}
                className="hover:bg-white/10 hover:text-white"
              >
                <Globe size={15} style={{ color: '#60A5FA' }} /> Public Website
              </button>

              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '0.35rem 0' }} />

              {/* Explicit Sign Out (Revokes Server Session) */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onLogout) onLogout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  color: '#EF4444',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 0.15s ease'
                }}
                className="hover:bg-red-500/20"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

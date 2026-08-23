import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Bell, 
  Globe,
  Mail 
} from 'lucide-react';
import { getInitials, getRolePresentation } from '../../../lib/auth/rolePresentation.js';
import { useSafeMotion } from '../../../lib/motion/reducedMotion.js';

export default function ProfileDropdown({ currentUser, onNavigatePublic, onLogout, onOpenSettings, onOpenProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { shouldReduceMotion } = useSafeMotion();
  const dropdownRef = useRef(null);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const displayName = currentUser?.name || currentUser?.fullName || 'Academic Officer';
  const rolePresentation = getRolePresentation(currentUser?.role, currentUser?.dept, displayName);
  const displayRole = rolePresentation.shortLabel || currentUser?.label || currentUser?.role || 'Staff';
  const displayEmail = currentUser?.email || 'portal@nrtec.in';
  const initials = getInitials(displayName);

  const menuItems = [
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      color: '#D4AF37',
      onClick: () => { setIsOpen(false); if (onOpenProfile) onOpenProfile(); }
    },
    {
      id: 'settings',
      label: 'Security & Policies',
      icon: Settings,
      color: '#D4AF37',
      onClick: () => { setIsOpen(false); if (onOpenSettings) onOpenSettings(); }
    },
    {
      id: 'public',
      label: 'Public Website',
      icon: Globe,
      color: '#60A5FA',
      onClick: () => { setIsOpen(false); if (onNavigatePublic) onNavigatePublic(); }
    }
  ];

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Profile Trigger Button as One Cohesive Surface */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={shouldReduceMotion ? undefined : { y: -1, scale: 1.02 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: isHovered || isOpen ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.06)',
          border: '1px solid ' + (isHovered || isOpen ? 'rgba(212, 175, 55, 0.45)' : 'rgba(212, 175, 55, 0.25)'),
          borderRadius: '9999px',
          padding: '0.3rem 0.75rem 0.3rem 0.35rem',
          cursor: 'pointer',
          boxShadow: isHovered || isOpen ? '0 4px 14px rgba(0, 0, 0, 0.3)' : 'none',
          outline: 'none'
        }}
        aria-expanded={isOpen}
        aria-label="User Profile and Menu"
      >
        {/* Avatar Circle with Subtle Glow */}
        <motion.div
          animate={isHovered && !shouldReduceMotion ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.18 }}
          style={{
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
            boxShadow: isHovered
              ? '0 0 12px rgba(212, 175, 55, 0.6)'
              : '0 2px 8px rgba(212, 175, 55, 0.35)',
            flexShrink: 0
          }}
        >
          {initials}
        </motion.div>

        {/* User Details (Desktop) */}
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
            {displayName.length > 18 ? displayName.slice(0, 16) + '...' : displayName}
          </span>
          <span style={{ fontSize: '0.68rem', color: '#D4AF37', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ShieldCheck size={10} /> {displayRole}
          </span>
        </div>

        {/* Animated Chevron */}
        <motion.div
          animate={shouldReduceMotion ? {} : { rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 24 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <ChevronDown size={14} style={{ color: '#94A3B8' }} />
        </motion.div>
      </motion.button>

      {/* Floating Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '280px',
              background: '#070F1E',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '14px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.15)',
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

            {/* Staggered Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={item.onClick}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.16 }}
                    whileHover={{ x: 3, backgroundColor: 'rgba(255, 255, 255, 0.09)' }}
                    whileTap={{ scale: 0.98 }}
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
                      outline: 'none',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <Icon size={15} style={{ color: item.color }} />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}

              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '0.35rem 0' }} />

              {/* Sign Out Action */}
              <motion.button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onLogout) onLogout();
                }}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12, duration: 0.16 }}
                whileHover={{ x: 3, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  outline: 'none',
                  transition: 'background 0.15s ease'
                }}
              >
                <LogOut size={15} /> Sign Out of Portal
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

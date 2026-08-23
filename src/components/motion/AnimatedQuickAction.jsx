import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  BookOpen, 
  FileText, 
  Handshake, 
  Trophy, 
  Calendar, 
  Mail,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useSafeMotion } from '../../lib/motion/reducedMotion.js';

/**
 * Animated Quick Action (+) Button & Contextual Dropdown
 * Features 0° → 90° rotation, spring elevation, and staggered quick-creation actions.
 */
export default function AnimatedQuickAction({
  onSelectAction,
  currentUser,
  buttonLabel = "New Entry"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { shouldReduceMotion } = useSafeMotion();
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
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

  const quickActions = [
    { id: 'bos', label: 'Create BoS Meeting', desc: 'Schedule curriculum & board review', icon: BookOpen, color: '#3B82F6' },
    { id: 'publication', label: 'Add Research Publication', desc: 'Register SCI / Scopus paper', icon: FileText, color: '#10B981' },
    { id: 'mou', label: 'Establish Industry MoU', desc: 'Record corporate collaboration', icon: Handshake, color: '#EC4899' },
    { id: 'achievement', label: 'Add Student Achievement', desc: 'Record hackathons & awards', icon: Trophy, color: '#F59E0B' },
    { id: 'events', label: 'Organize Academic Event', desc: 'Create workshop / FDP', icon: Calendar, color: '#8B5CF6' },
    { id: 'circulars-notices', label: 'Issue Official Circular', desc: 'Publish institutional order', icon: Mail, color: '#EF4444' }
  ];

  const handleActionClick = (actionId) => {
    setIsOpen(false);
    if (onSelectAction) {
      onSelectAction(actionId);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      {/* Primary + Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -2 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
          color: '#070F1E',
          padding: '0.42rem 0.85rem',
          borderRadius: '8px',
          fontWeight: 800,
          fontSize: '0.78rem',
          border: '1px solid rgba(212, 175, 55, 0.6)',
          cursor: 'pointer',
          boxShadow: isHovered || isOpen
            ? '0 4px 16px rgba(212, 175, 55, 0.5)'
            : '0 2px 8px rgba(212, 175, 55, 0.35)',
          outline: 'none'
        }}
        aria-expanded={isOpen}
        aria-label="Quick Action Menu"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  rotate: isOpen ? 90 : isHovered ? 90 : 0,
                  scale: isHovered || isOpen ? 1.12 : 1
                }
          }
          transition={{ type: 'spring', stiffness: 360, damping: 22 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={15} strokeWidth={2.8} />
        </motion.div>
        <span style={{ display: 'none' }} className="sm:inline">{buttonLabel}</span>
      </motion.button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '290px',
              background: '#070F1E',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '14px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.15)',
              padding: '0.65rem',
              zIndex: 1000,
              transformOrigin: 'top right',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.4rem 0.6rem 0.6rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '0.45rem'
            }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#F1C40F', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ⚡ Quick Actions
              </span>
              <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Verified Entry</span>
            </div>

            {/* Quick Action List with Stagger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {quickActions.map((act, index) => {
                const Icon = act.icon;
                return (
                  <motion.button
                    key={act.id}
                    type="button"
                    onClick={() => handleActionClick(act.id)}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.035, duration: 0.18 }}
                    whileHover={{ x: 3, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.55rem 0.65rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#FFFFFF',
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%',
                      outline: 'none',
                      transition: 'border-color 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: `${act.color}20`,
                      color: act.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={14} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E2E8F0', lineHeight: 1.2 }}>
                        {act.label}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {act.desc}
                      </div>
                    </div>
                    <ChevronRight size={13} style={{ color: '#64748B', flexShrink: 0 }} />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

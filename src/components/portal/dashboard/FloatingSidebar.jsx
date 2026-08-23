import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Bell, 
  Activity, 
  Users, 
  Camera, 
  UserCheck, 
  Award, 
  BookOpen, 
  Building2, 
  ShieldAlert, 
  FileText, 
  Lightbulb, 
  RefreshCw, 
  Calendar, 
  Trophy, 
  Briefcase, 
  Code, 
  GraduationCap, 
  Handshake, 
  Mail, 
  Megaphone, 
  Image as ImageIcon, 
  Download, 
  FileSpreadsheet, 
  Sliders, 
  Grid, 
  Smartphone, 
  Trash2, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  X
} from 'lucide-react';

import { NAVIGATION_CATEGORIES } from './navigationCategories.js';
import { getInitials, getRolePresentation } from '../../../lib/auth/rolePresentation.js';

export default function FloatingSidebar({
  activeModule,
  onSelectModule,
  sidebarExpanded,
  onToggleSidebar,
  currentUser,
  onNavigatePublic,
  onLogout,
  onExitPortal,
  isMobileDrawer,
  onCloseMobileDrawer
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  const userRole = currentUser?.role || 'FACULTY';
  const displayName = currentUser?.name || currentUser?.fullName || 'Academic Officer';
  const rolePresentation = getRolePresentation(userRole, currentUser?.dept, displayName);
  const displayRole = rolePresentation.shortLabel || currentUser?.label || currentUser?.role || 'Staff';
  const initials = getInitials(displayName);

  // Auto-expand category containing active module
  useEffect(() => {
    NAVIGATION_CATEGORIES.forEach(cat => {
      const hasActive = cat.items.some(item => item.id === activeModule);
      if (hasActive) {
        setExpandedCategories(prev => ({ ...prev, [cat.id]: true }));
      }
    });
  }, [activeModule]);

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Filter categories by user permissions/roles & search query
  const filteredCategories = NAVIGATION_CATEGORIES.map(cat => {
    // Hide IAM / Administration category for non-admin users
    if (cat.id === 'cat-admin' && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
      const hasIamPerm = currentUser?.permissions?.some(p => p.startsWith('users.') || p.startsWith('iam.'));
      if (!hasIamPerm) return null;
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return cat;

    const matchesCat = cat.label.toLowerCase().includes(q);
    const matchingItems = cat.items.filter(item => item.label.toLowerCase().includes(q));

    if (matchesCat || matchingItems.length > 0) {
      return {
        ...cat,
        items: matchingItems.length > 0 ? matchingItems : cat.items
      };
    }
    return null;
  }).filter(Boolean);

  const sidebarWidth = isMobileDrawer ? '290px' : (sidebarExpanded ? '310px' : '82px');

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileDrawer && (
        <div
          onClick={onCloseMobileDrawer}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 15, 30, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 1050
          }}
        />
      )}

      {/* Floating Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        style={{
          position: isMobileDrawer ? 'fixed' : 'sticky',
          top: isMobileDrawer ? 0 : 'calc(65px + var(--portal-shell-y, 18px))',
          left: isMobileDrawer ? 0 : 'auto',
          bottom: isMobileDrawer ? 0 : 'auto',
          height: isMobileDrawer ? '100vh' : 'calc(100vh - 65px - (2 * var(--portal-shell-y, 18px)))',
          background: 'linear-gradient(180deg, #070F1E 0%, #0B192C 60%, #081220 100%)',
          borderRadius: isMobileDrawer ? '0 20px 20px 0' : '20px',
          border: '1px solid rgba(212, 175, 55, 0.22)',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.35), 0 0 15px rgba(212, 175, 55, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: isMobileDrawer ? 1100 : 90,
          overflow: 'hidden',
          flexShrink: 0,
          margin: 0
        }}
      >
        {/* Header Block with Search */}
        <div style={{
          padding: '1rem 0.9rem 0.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          flexShrink: 0
        }}>
          {isMobileDrawer && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Navigation Hub
              </span>
              <button
                type="button"
                onClick={onCloseMobileDrawer}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#94A3B8',
                  borderRadius: '6px',
                  padding: '0.3rem',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {(sidebarExpanded || isMobileDrawer) ? (
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748B'
                }}
              />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.65rem 0.45rem 2rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '0.7rem'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(212, 175, 55, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F1C40F',
                border: '1px solid rgba(212, 175, 55, 0.25)'
              }}>
                <Sparkles size={16} />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Category Accordion Tree */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0.65rem 0.55rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem'
        }}>
          {filteredCategories.map(cat => {
            const CatIcon = cat.icon;
            const isCatExpanded = (sidebarExpanded || isMobileDrawer) ? (expandedCategories[cat.id] ?? false) : false;
            const hasActiveModule = cat.items.some(item => item.id === activeModule);

            return (
              <div key={cat.id} style={{ marginBottom: '0.2rem' }}>
                {/* Category Header Button */}
                {(sidebarExpanded || isMobileDrawer) ? (
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      background: hasActiveModule ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: hasActiveModule ? '#F1C40F' : '#94A3B8',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left'
                    }}
                    className="hover:bg-white/5"
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CatIcon size={14} style={{ color: hasActiveModule ? '#F1C40F' : '#64748B' }} />
                      <span>{cat.label}</span>
                    </span>
                    <motion.span
                      animate={{ rotate: isCatExpanded ? 90 : 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ display: 'inline-flex' }}
                    >
                      <ChevronRight size={12} />
                    </motion.span>
                  </button>
                ) : null}

                {/* Submenu Items */}
                <AnimatePresence initial={false}>
                  {((sidebarExpanded || isMobileDrawer) ? isCatExpanded : true) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.18rem',
                        paddingLeft: (sidebarExpanded || isMobileDrawer) ? '0.4rem' : '0',
                        marginTop: (sidebarExpanded || isMobileDrawer) ? '0.2rem' : '0'
                      }}
                    >
                      {cat.items.map(item => {
                        const ItemIcon = item.icon;
                        const isActive = activeModule === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              onSelectModule(item.id);
                              if (isMobileDrawer && onCloseMobileDrawer) onCloseMobileDrawer();
                            }}
                            title={!sidebarExpanded && !isMobileDrawer ? item.label : undefined}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: (sidebarExpanded || isMobileDrawer) ? 'space-between' : 'center',
                              width: '100%',
                              padding: (sidebarExpanded || isMobileDrawer) ? '0.48rem 0.65rem' : '0.65rem 0',
                              borderRadius: '8px',
                              background: isActive
                                ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.12) 100%)'
                                : 'transparent',
                              border: isActive ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid transparent',
                              color: isActive ? '#FFFFFF' : '#CBD5E1',
                              fontSize: '0.79rem',
                              fontWeight: isActive ? 700 : 500,
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.15s ease',
                              position: 'relative'
                            }}
                            className={isActive ? 'shadow-sm' : 'hover:bg-white/5 hover:text-white'}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <ItemIcon
                                size={15}
                                style={{
                                  color: isActive ? '#F1C40F' : '#94A3B8',
                                  flexShrink: 0
                                }}
                              />
                              {(sidebarExpanded || isMobileDrawer) && (
                                <span style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {item.label}
                                </span>
                              )}
                            </span>

                            {(sidebarExpanded || isMobileDrawer) && item.badge && (
                              <span style={{
                                fontSize: '0.62rem',
                                fontWeight: 700,
                                padding: '0.12rem 0.45rem',
                                borderRadius: '9999px',
                                background: isActive ? '#F1C40F' : 'rgba(255, 255, 255, 0.1)',
                                color: isActive ? '#070F1E' : '#CBD5E1',
                                marginLeft: '0.4rem'
                              }}>
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Footer Identity & Collapse Button */}
        <div style={{
          padding: '0.75rem 0.85rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.25)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: (sidebarExpanded || isMobileDrawer) ? 'space-between' : 'center',
          gap: '0.5rem'
        }}>
          {(sidebarExpanded || isMobileDrawer) ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', overflow: 'hidden' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                color: '#070F1E',
                fontWeight: 800,
                fontSize: '0.76rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {initials}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {displayName.length > 15 ? displayName.slice(0, 13) + '...' : displayName}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#D4AF37', fontWeight: 600 }}>
                  {displayRole}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
              color: '#070F1E',
              fontWeight: 800,
              fontSize: '0.76rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {initials}
            </div>
          )}

          {(sidebarExpanded || isMobileDrawer) && (
            <button
              type="button"
              onClick={onLogout || onExitPortal}
              title="Sign Out"
              aria-label="Sign Out of Portal"
              style={{
                background: 'rgba(220, 38, 38, 0.12)',
                border: '1px solid rgba(220, 38, 38, 0.25)',
                color: '#EF4444',
                borderRadius: '6px',
                padding: '0.35rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="hover:bg-red-500/20"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}


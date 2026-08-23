import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  Lightbulb, 
  Handshake, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  Download, 
  TrendingUp, 
  Activity, 
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { 
  MotionPage, 
  AnimatedKpiGrid, 
  MotionKpiCard, 
  MotionNumber, 
  MotionButton, 
  MotionCard 
} from '../../motion/index.js';

export default function DashboardOverviewView({
  currentUser,
  usersCount = 0,
  facultyCount = 0,
  publicationsCount = 0,
  patentsCount = 0,
  mousCount = 0,
  achievementsCount = 0,
  activeSessionsCount = 0,
  onNavigate,
  onOpenQuickAction,
  onOpenSync
}) {
  const displayName = currentUser?.name || 'Super Administrator';
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // KPI Metrics Data
  const kpiCards = [
    {
      title: 'Total Faculty',
      value: facultyCount,
      subtext: '40 verified photos',
      icon: Users,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.25)',
      moduleId: 'faculty-directory'
    },
    {
      title: 'Publications',
      value: publicationsCount,
      subtext: '+14 this quarter',
      icon: FileText,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.25)',
      moduleId: 'publications'
    },
    {
      title: 'Patents & IPR',
      value: patentsCount,
      subtext: '22 granted • 6 published',
      icon: Lightbulb,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.25)',
      moduleId: 'patents'
    },
    {
      title: 'Active MoUs',
      value: mousCount,
      subtext: '2 expiring in 30 days',
      icon: Handshake,
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.1)',
      border: 'rgba(139, 92, 246, 0.25)',
      moduleId: 'mous'
    },
    {
      title: 'Student Awards',
      value: achievementsCount,
      subtext: 'National & State level',
      icon: Trophy,
      color: '#EC4899',
      bg: 'rgba(236, 72, 153, 0.1)',
      border: 'rgba(236, 72, 153, 0.25)',
      moduleId: 'achievements'
    },
    {
      title: 'Workshops & Events',
      value: '24',
      subtext: '5 upcoming this month',
      icon: Calendar,
      color: '#06B6D4',
      bg: 'rgba(6, 182, 212, 0.1)',
      border: 'rgba(6, 182, 212, 0.25)',
      moduleId: 'events'
    },
    {
      title: 'Campus Placements',
      value: '840+',
      subtext: 'Avg CTC 6.8 LPA',
      icon: TrendingUp,
      color: '#D4AF37',
      bg: 'rgba(212, 175, 55, 0.1)',
      border: 'rgba(212, 175, 55, 0.3)',
      moduleId: 'placements'
    },
    {
      title: 'IAM Users',
      value: usersCount,
      subtext: `${activeSessionsCount} active sessions`,
      icon: ShieldCheck,
      color: '#6366F1',
      bg: 'rgba(99, 102, 241, 0.1)',
      border: 'rgba(99, 102, 241, 0.25)',
      moduleId: 'iam-users'
    }
  ];

  // Important Actionable Alerts
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: '2 Industry MoUs Expiring Within 30 Days',
      desc: 'Infosys Springboard & CISCO Academy partnerships require renewal review.',
      actionLabel: 'Review MoUs',
      moduleId: 'mous'
    },
    {
      id: 2,
      type: 'info',
      title: 'Faculty Photo Verification Required',
      desc: '2 newly appointed CSE faculty members have not submitted their verified photographs.',
      actionLabel: 'Manage Photos',
      moduleId: 'faculty-directory'
    },
    {
      id: 3,
      type: 'success',
      title: 'Resend Transactional Email Gateway Healthy',
      desc: 'Authentication OTPs and security notices are delivering with 100% provider uptime.',
      actionLabel: 'View Templates',
      moduleId: 'iam-emails'
    }
  ];

  // Recent Governance & Research Activity Feed
  const recentActivities = [
    { id: 1, user: 'Dr. S. Venkateswarlu', action: 'Approved Board of Studies (BoS) Curriculum for R24 Regulation', time: '18 mins ago', type: 'BoS' },
    { id: 2, user: 'Super Administrator', action: 'Provisioned institutional account for Faculty Dr. K. Ramesh', time: '1 hour ago', type: 'IAM' },
    { id: 3, user: 'Dr. M. Sreenivasa Kumar', action: 'Indexed new Scopus journal publication on Deep Learning', time: '3 hours ago', type: 'Research' },
    { id: 4, user: 'Dr. B. Venkata Siva', action: 'Published patent "IoT-enabled Smart Agricultural Monitoring"', time: '5 hours ago', type: 'Patent' },
    { id: 5, user: 'Placement Officer', action: 'Updated Tier-1 Campus Placement Drives roster (TCS, Infosys)', time: 'Yesterday', type: 'Placement' }
  ];

  return (
    <MotionPage style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Welcome & Governance Header Strip */}
      <div style={{
        background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 70%, #122846 100%)',
        borderRadius: '18px',
        padding: 'clamp(1.2rem, 3vw, 1.8rem)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Decorative Accent */}
        <div style={{
          position: 'absolute',
          right: '-40px',
          top: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{
              background: 'rgba(212, 175, 55, 0.18)',
              color: '#F1C40F',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <ShieldCheck size={11} /> Super Admin Governance
            </span>
            <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{currentDate}</span>
          </div>

          <h1 style={{
            color: '#FFFFFF',
            fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)',
            fontWeight: 800,
            margin: '0 0 0.35rem 0',
            fontFamily: 'Cinzel, Georgia, serif'
          }}>
            Welcome Back, {displayName}
          </h1>

          <p style={{
            color: '#CBD5E1',
            fontSize: '0.85rem',
            margin: 0,
            maxWidth: '650px',
            lineHeight: 1.45
          }}>
            Narasaraopeta Engineering College Autonomous Academic Management Portal. You have active oversight across all 13 academic departments and research centers.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onOpenSync}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#FFFFFF',
              padding: '0.55rem 0.95rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            className="hover:bg-white/15"
          >
            <RefreshCw size={14} style={{ color: '#F1C40F' }} /> Auto-Sync Scopus
          </button>

          <button
            type="button"
            onClick={() => onNavigate('events')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
              border: 'none',
              color: '#070F1E',
              padding: '0.55rem 1.05rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 3px 12px rgba(212, 175, 55, 0.35)'
            }}
            className="hover:scale-105 transition-transform"
          >
            <Plus size={15} /> Add New Entry
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Activity size={18} style={{ color: '#D4AF37' }} /> Core Institutional Metrics
          </h2>
          <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Real-time verified data</span>
        </div>

        <AnimatedKpiGrid minWidth="200px" gap="1rem">
          {kpiCards.map((card, idx) => {
            const CardIcon = card.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                onClick={() => onNavigate(card.moduleId)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '1.1rem 1.15rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className="hover:border-amber-400 hover:shadow-md transition-all"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: card.bg,
                    border: `1px solid ${card.border}`,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CardIcon size={19} />
                  </div>
                  <ArrowUpRight size={15} style={{ color: '#94A3B8' }} />
                </div>

                <div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1, marginBottom: '0.25rem', fontFamily: 'Cinzel, serif' }}>
                    <MotionNumber value={card.value} />
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem' }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    {card.subtext}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatedKpiGrid>
      </div>

      {/* 3. Action Required & Alerts Banner */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <AlertTriangle size={18} style={{ color: '#F59E0B' }} /> Action Required & Notices
          </h2>
          <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>3 Active alerts</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {alerts.map((al) => (
            <div
              key={al.id}
              style={{
                background: al.type === 'warning' ? '#FEFCE8' : (al.type === 'info' ? '#EFF6FF' : '#F0FDF4'),
                border: `1px solid ${al.type === 'warning' ? '#FEF08A' : (al.type === 'info' ? '#BFDBFE' : '#BBF7D0')}`,
                borderRadius: '12px',
                padding: '0.85rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  color: al.type === 'warning' ? '#D97706' : (al.type === 'info' ? '#2563EB' : '#16A34A'),
                  marginTop: '2px'
                }}>
                  {al.type === 'warning' && <AlertTriangle size={18} />}
                  {al.type === 'info' && <Clock size={18} />}
                  {al.type === 'success' && <CheckCircle2 size={18} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.15rem' }}>
                    {al.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                    {al.desc}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(al.moduleId)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#0F172A',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                className="hover:bg-slate-50"
              >
                {al.actionLabel} <ChevronRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Module Shortcuts & Recent Activity Split */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Quick Access Shortcuts */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
        }}>
          <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0' }}>
            Frequently Accessed Modules
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {[
              { id: 'publications', title: 'Publications Archive', desc: '184 Scopus/SCI items', icon: FileText, color: '#10B981' },
              { id: 'patents', title: 'Patents Portfolio', desc: '28 IPR records', icon: Lightbulb, color: '#F59E0B' },
              { id: 'events', title: 'Workshops & Events', desc: 'Seminars & hackathons', icon: Calendar, color: '#06B6D4' },
              { id: 'mous', title: 'Industry MoUs', desc: '35 active partnerships', icon: Handshake, color: '#8B5CF6' },
              { id: 'faculty-directory', title: 'Faculty Photos', desc: '42 department records', icon: Users, color: '#3B82F6' },
              { id: 'iam-users', title: 'User Management', desc: 'IAM roles & access', icon: ShieldCheck, color: '#D4AF37' }
            ].map(mod => {
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => onNavigate(mod.id)}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease'
                  }}
                  className="hover:bg-slate-100 hover:border-amber-400"
                >
                  <Icon size={17} style={{ color: mod.color }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>{mod.title}</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{mod.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Recent Governance Activity
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('audit-logs')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2563EB',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              View Full Trail →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentActivities.map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  paddingBottom: '0.65rem',
                  borderBottom: '1px solid #F1F5F9'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#D4AF37',
                  marginTop: '6px',
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.4 }}>
                    <strong>{act.user}</strong>: {act.action}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                    {act.time} • <span style={{ color: '#64748B', fontWeight: 600 }}>{act.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MotionPage>
  );
}

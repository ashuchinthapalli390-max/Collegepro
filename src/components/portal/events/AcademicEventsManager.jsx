import React, { useState, useMemo } from 'react';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Building2, 
  Trash2, 
  ChevronRight, 
  ExternalLink, 
  Sparkles, 
  Printer, 
  Calendar, 
  Users, 
  Award, 
  Trophy, 
  Code, 
  Video, 
  Layers, 
  Star, 
  Image as ImageIcon,
  Tag,
  Check,
  X
} from 'lucide-react';
import { DEPARTMENTS } from '../../../data/masterData.js';
import { 
  getAcademicEvents, 
  reviewAcademicEvent, 
  updateAcademicEventStatus, 
  saveAcademicEventWinners, 
  softDeleteAcademicEvent,
  exportToCSV,
  exportToExcel,
  exportToPDF
} from '../../../data/portalStore.js';
import AcademicEventWizardModal from './AcademicEventWizardModal.jsx';

const EVENT_TYPE_TABS = [
  { id: 'ALL', label: 'All Events' },
  { id: 'Workshop', label: 'Workshops', icon: Layers },
  { id: 'Seminar', label: 'Seminars', icon: Megaphone },
  { id: 'Guest Lecture', label: 'Guest Lectures', icon: Users },
  { id: 'Hackathon', label: 'Hackathons', icon: Trophy },
  { id: 'Code-a-thon', label: 'Code-a-thons', icon: Code },
  { id: 'Conference', label: 'Conferences', icon: Award },
  { id: 'Bootcamp', label: 'Bootcamps', icon: Sparkles },
  { id: 'Technical Talk', label: 'Technical Talks', icon: Video }
];

export default function AcademicEventsManager({ currentUser, onDataChange, initialTypeFilter = 'ALL' }) {
  const [dataVersion, setDataVersion] = useState(0);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [dossierModalItem, setDossierModalItem] = useState(null);
  const [dossierActiveTab, setDossierActiveTab] = useState('overview');
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [reviewAction, setReviewAction] = useState('APPROVE');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [winnersModalItem, setWinnersModalItem] = useState(null);

  // Filters State
  const [selectedTypeTab, setSelectedTypeTab] = useState(initialTypeFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState(currentUser?.role === 'HOD' ? (currentUser.dept || 'ALL') : 'ALL');
  const [selectedAy, setSelectedAy] = useState('ALL');
  const [selectedEventStatus, setSelectedEventStatus] = useState('ALL');
  const [selectedWorkflowStatus, setSelectedWorkflowStatus] = useState('ALL');
  const [selectedMode, setSelectedMode] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  const refresh = () => {
    setDataVersion(v => v + 1);
    if (onDataChange) onDataChange();
  };

  // Live Records
  const events = useMemo(() => {
    return getAcademicEvents();
  }, [dataVersion]);

  // KPIs
  const stats = useMemo(() => {
    const total = events.length;
    const upcoming = events.filter(e => e.eventStatus === 'PLANNED' || e.eventStatus === 'REGISTRATION_OPEN').length;
    const ongoing = events.filter(e => e.eventStatus === 'ONGOING').length;
    const completed = events.filter(e => e.eventStatus === 'COMPLETED').length;
    const pendingReview = events.filter(e => e.workflowStatus === 'SUBMITTED' || e.workflowStatus === 'UNDER_REVIEW').length;
    const thisYear = events.filter(e => e.academicYear === '2025-26' || e.academicYear === '2024-25').length;
    return { total, upcoming, ongoing, completed, pendingReview, thisYear };
  }, [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        (item.eventNumber && item.eventNumber.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.coordinatorName && item.coordinatorName.toLowerCase().includes(q)) ||
        (item.resourcePersons && item.resourcePersons.some(rp => rp.name && rp.name.toLowerCase().includes(q)));

      const matchTab = selectedTypeTab === 'ALL' || item.eventType === selectedTypeTab;
      const itemDept = item.department || '';
      const matchDept = selectedDept === 'ALL' || itemDept.toLowerCase().includes(selectedDept.toLowerCase());
      const matchAy = selectedAy === 'ALL' || item.academicYear === selectedAy;
      const matchEventStatus = selectedEventStatus === 'ALL' || item.eventStatus === selectedEventStatus;
      const matchWorkflowStatus = selectedWorkflowStatus === 'ALL' || item.workflowStatus === selectedWorkflowStatus;
      const matchMode = selectedMode === 'ALL' || item.mode === selectedMode;
      const matchLevel = selectedLevel === 'ALL' || item.level === selectedLevel;

      return matchSearch && matchTab && matchDept && matchAy && matchEventStatus && matchWorkflowStatus && matchMode && matchLevel;
    });
  }, [events, searchQuery, selectedTypeTab, selectedDept, selectedAy, selectedEventStatus, selectedWorkflowStatus, selectedMode, selectedLevel]);

  // Permissions
  const canCreate = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || currentUser?.role === 'HOD' || currentUser?.role === 'FACULTY';
  const canReview = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || currentUser?.role === 'HOD';

  const handleExecuteReview = () => {
    if (!reviewModalItem) return;
    reviewAcademicEvent(reviewModalItem.id, reviewAction, reviewRemarks, currentUser);
    setReviewModalItem(null);
    setReviewRemarks('');
    refresh();
  };

  const handleDelete = (item) => {
    if (confirm(`Are you sure you want to delete event record ${item.eventNumber || item.id} (${item.title})?`)) {
      softDeleteAcademicEvent(item.id, currentUser);
      refresh();
    }
  };

  const getWorkflowBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', icon: CheckCircle2, label: 'APPROVED' };
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', icon: Clock, label: 'UNDER REVIEW' };
      case 'NEEDS_REVISION':
        return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', icon: AlertTriangle, label: 'REVISION REQ.' };
      case 'ARCHIVED':
        return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1', icon: Clock, label: 'ARCHIVED' };
      case 'DRAFT':
      default:
        return { bg: '#FEFCE8', text: '#A16207', border: '#FEF08A', icon: Edit3, label: 'DRAFT' };
    }
  };

  const getEventLifecycleBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: '#ECFDF5', text: '#047857', label: 'COMPLETED' };
      case 'ONGOING':
        return { bg: '#FEF08A', text: '#854D0E', label: 'ONGOING' };
      case 'REGISTRATION_OPEN':
        return { bg: '#EFF6FF', text: '#1E40AF', label: 'REG. OPEN' };
      case 'POSTPONED':
        return { bg: '#FFF7ED', text: '#C2410C', label: 'POSTPONED' };
      case 'CANCELLED':
        return { bg: '#FEF2F2', text: '#DC2626', label: 'CANCELLED' };
      case 'PLANNED':
      default:
        return { bg: '#F1F5F9', text: '#334155', label: 'PLANNED' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      {/* 1. Header & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Events & Outreach</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Academic Events</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Academic Events
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Manage workshops, seminars, guest lectures, hackathons, code-a-thons and institutional events.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => exportToCSV('events')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
          >
            <Download size={14} /> CSV
          </button>
          <button
            type="button"
            onClick={() => exportToExcel('events')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#10B981', cursor: 'pointer' }}
          >
            <FileText size={14} /> Excel
          </button>
          <button
            type="button"
            onClick={() => exportToPDF('events')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#DC2626', cursor: 'pointer' }}
          >
            <Printer size={14} /> PDF
          </button>

          {canCreate && (
            <button
              type="button"
              onClick={() => { setEditingItem(null); setWizardOpen(true); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                color: '#070F1E',
                padding: '0.55rem 1.05rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.8rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(212, 175, 55, 0.35)'
              }}
              className="hover:scale-105 transition-transform"
            >
              <Plus size={15} /> Create Event
            </button>
          )}
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.85rem' }}>
        {[
          { label: 'Total Events', value: stats.total, color: '#0F172A', icon: Megaphone, bg: '#F8FAFC' },
          { label: 'Upcoming', value: stats.upcoming, color: '#2563EB', icon: Calendar, bg: '#EFF6FF' },
          { label: 'Ongoing Now', value: stats.ongoing, color: '#D97706', icon: Clock, bg: '#FEFCE8' },
          { label: 'Completed', value: stats.completed, color: '#059669', icon: CheckCircle2, bg: '#ECFDF5' },
          { label: 'Pending Review', value: stats.pendingReview, color: '#9333EA', icon: Sparkles, bg: '#FDF4FF' },
          { label: 'This Academic Year', value: stats.thisYear, color: '#0D9488', icon: Building2, bg: '#F0FDFA' }
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} style={{ background: k.bg, padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>{k.label}</span>
                <Icon size={16} style={{ color: k.color }} />
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: k.color, fontFamily: 'Cinzel, serif' }}>{k.value}</div>
            </div>
          );
        })}
      </div>

      {/* 3. Event Type Horizontal Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
        {EVENT_TYPE_TABS.map((tab) => {
          const isSelected = selectedTypeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTypeTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '9999px',
                border: isSelected ? '1px solid #D4AF37' : '1px solid #E2E8F0',
                background: isSelected ? '#070F1E' : '#FFFFFF',
                color: isSelected ? '#F1C40F' : '#475569',
                fontSize: '0.76rem',
                fontWeight: isSelected ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {Icon && <Icon size={13} />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Search & Multi-Filter Toolbar */}
      <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by event number, title, speaker, coordinator, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.25rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem', outline: 'none', color: '#0F172A', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={selectedDept}
              disabled={currentUser?.role === 'HOD'}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFFFFF', color: '#0F172A', fontWeight: 600 }}
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.code}</option>)}
            </select>

            <select
              value={selectedAy}
              onChange={(e) => setSelectedAy(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFFFFF', color: '#0F172A', fontWeight: 600 }}
            >
              <option value="ALL">All AYs</option>
              <option value="2026-27">2026-27</option>
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
            </select>

            <select
              value={selectedEventStatus}
              onChange={(e) => setSelectedEventStatus(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFFFFF', color: '#0F172A', fontWeight: 600 }}
            >
              <option value="ALL">Event Status: All</option>
              <option value="PLANNED">Planned</option>
              <option value="REGISTRATION_OPEN">Registration Open</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="POSTPONED">Postponed</option>
            </select>

            <select
              value={selectedWorkflowStatus}
              onChange={(e) => setSelectedWorkflowStatus(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFFFFF', color: '#0F172A', fontWeight: 600 }}
            >
              <option value="ALL">Approval: All</option>
              <option value="APPROVED">Approved</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="DRAFT">Draft</option>
            </select>

            {(searchQuery || selectedTypeTab !== 'ALL' || selectedDept !== 'ALL' || selectedAy !== 'ALL' || selectedEventStatus !== 'ALL' || selectedWorkflowStatus !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTypeTab('ALL');
                  if (currentUser?.role !== 'HOD') setSelectedDept('ALL');
                  setSelectedAy('ALL');
                  setSelectedEventStatus('ALL');
                  setSelectedWorkflowStatus('ALL');
                }}
                style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#F8FAFC', color: '#64748B', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. Events Data Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Event No. & Title</th>
                <th style={{ padding: '0.85rem 1rem' }}>Type</th>
                <th style={{ padding: '0.85rem 1rem' }}>Department & AY</th>
                <th style={{ padding: '0.85rem 1rem' }}>Dates & Mode</th>
                <th style={{ padding: '0.85rem 1rem' }}>Coordinator(s)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Key Speaker / Expert</th>
                <th style={{ padding: '0.85rem 1rem' }}>Attendees</th>
                <th style={{ padding: '0.85rem 1rem' }}>Event Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Approval</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                    No academic events recorded matching current filters.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((item, idx) => {
                  const wfBadge = getWorkflowBadge(item.workflowStatus);
                  const evBadge = getEventLifecycleBadge(item.eventStatus);
                  const WfIcon = wfBadge.icon;
                  const firstSpeaker = item.resourcePersons?.[0]?.name || (item.resourcePersons?.length ? '1 Expert' : 'TBD');

                  return (
                    <tr key={item.id || idx} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50">
                      <td style={{ padding: '0.85rem 1rem', maxWidth: '260px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 800 }}>
                          {item.eventNumber || item.id}
                        </div>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {item.title || item.name}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0369A1', background: '#E0F2FE', padding: '0.15rem 0.45rem', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                          {item.eventType}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}>{item.department}</span>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{item.academicYear}</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.76rem', color: '#0F172A', fontWeight: 700 }}>
                          {item.startDate}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          {item.mode} • {item.venue || 'Online'}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.78rem' }}>
                          {item.coordinatorName || 'TBD'}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', maxWidth: '180px' }}>
                        <div style={{ fontSize: '0.78rem', color: '#334155', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {firstSpeaker}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A' }}>
                          {item.actualParticipants || item.expectedParticipants || 0}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                          {item.actualParticipants ? 'Attended' : 'Expected'}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, background: evBadge.bg, color: evBadge.text, padding: '0.15rem 0.5rem', borderRadius: '9999px', whiteSpace: 'nowrap' }}>
                          {evBadge.label}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          background: wfBadge.bg,
                          color: wfBadge.text,
                          border: `1px solid ${wfBadge.border}`,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          whiteSpace: 'nowrap'
                        }}>
                          <WfIcon size={11} /> {wfBadge.label}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => { setDossierModalItem(item); setDossierActiveTab('overview'); }}
                            title="View Event Dossier"
                            style={{ padding: '0.35rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#334155', cursor: 'pointer' }}
                          >
                            <Eye size={13} />
                          </button>

                          {canReview && (
                            <button
                              type="button"
                              onClick={() => { setReviewModalItem(item); setReviewAction('APPROVE'); }}
                              title="Review / Approve Event"
                              style={{ padding: '0.35rem 0.55rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', color: '#059669', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Review
                            </button>
                          )}

                          {canCreate && (
                            <button
                              type="button"
                              onClick={() => { setEditingItem(item); setWizardOpen(true); }}
                              title="Edit Event"
                              style={{ padding: '0.35rem', background: '#FEFCE8', border: '1px solid #FEF08A', borderRadius: '6px', color: '#A16207', cursor: 'pointer' }}
                            >
                              <Edit3 size={13} />
                            </button>
                          )}

                          {canReview && (
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              title="Delete / Archive"
                              style={{ padding: '0.35rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', color: '#DC2626', cursor: 'pointer' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Guided 6-Step Creation / Edit Wizard */}
      {wizardOpen && (
        <AcademicEventWizardModal
          isOpen={wizardOpen}
          onClose={() => { setWizardOpen(false); setEditingItem(null); }}
          initialData={editingItem}
          currentUser={currentUser}
          onSaved={() => refresh()}
        />
      )}

      {/* 7. Comprehensive Multi-Tab Dossier Inspection Modal */}
      {dossierModalItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 15, 30, 0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: '1rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '820px',
            width: '100%',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
            border: '1px solid #D4AF37',
            overflow: 'hidden'
          }}>
            <div style={{ background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 100%)', padding: '1.25rem 1.5rem', color: '#FFFFFF', borderBottom: '2px solid #D4AF37', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase' }}>
                  {dossierModalItem.eventNumber || dossierModalItem.id} • {dossierModalItem.eventType}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#FFFFFF', fontFamily: 'Cinzel, serif' }}>
                  {dossierModalItem.title || dossierModalItem.name}
                </h3>
              </div>
              <button type="button" onClick={() => setDossierModalItem(null)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Dossier Tabs */}
            <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '0.5rem 1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'schedule', label: `Sessions (${dossierModalItem.sessions?.length || 0})` },
                { id: 'speakers', label: `Resource Persons (${dossierModalItem.resourcePersons?.length || 0})` },
                { id: 'evidence', label: `Evidence (${dossierModalItem.documents?.length || 0})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDossierActiveTab(tab.id)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: dossierActiveTab === tab.id ? '#070F1E' : 'transparent',
                    color: dossierActiveTab === tab.id ? '#F1C40F' : '#64748B',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dossier Body Canvas */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {dossierActiveTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Department & Academic Year</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.department} • {dossierModalItem.academicYear}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Date & Mode</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.startDate} to {dossierModalItem.endDate} ({dossierModalItem.mode})</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{dossierModalItem.venue || dossierModalItem.platformName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Primary Coordinator</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.coordinatorName || 'TBD'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Audience & Attendance</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.targetAudience} ({dossierModalItem.actualParticipants || dossierModalItem.expectedParticipants} Delegates)</div>
                    </div>
                  </div>

                  {dossierModalItem.description && (
                    <div>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Description</h4>
                      <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>{dossierModalItem.description}</p>
                    </div>
                  )}

                  {dossierModalItem.outcomeSummary && (
                    <div style={{ background: '#ECFDF5', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                      <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#065F46', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Outcome & Feedback</div>
                      <p style={{ fontSize: '0.8rem', color: '#047857', margin: 0 }}>{dossierModalItem.outcomeSummary}</p>
                    </div>
                  )}
                </div>
              )}

              {dossierActiveTab === 'schedule' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {dossierModalItem.sessions?.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem' }}>No individual sessions recorded.</div>
                  ) : (
                    dossierModalItem.sessions?.map((sess, idx) => (
                      <div key={idx} style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>Session {sess.sessionNo}: {sess.title}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{sess.date} ({sess.startTime} - {sess.endTime}) • {sess.speaker || 'Assigned Expert'}</div>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700 }}>{sess.venue || 'Hall'}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {dossierActiveTab === 'speakers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {dossierModalItem.resourcePersons?.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem' }}>No resource persons recorded.</div>
                  ) : (
                    dossierModalItem.resourcePersons?.map((rp, idx) => (
                      <div key={idx} style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.84rem' }}>{rp.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{rp.designation} — <strong>{rp.organization}</strong></div>
                        {rp.topic && <div style={{ fontSize: '0.72rem', color: '#0284C7', marginTop: '0.2rem' }}>Topic: {rp.topic}</div>}
                      </div>
                    ))
                  )}
                </div>
              )}

              {dossierActiveTab === 'evidence' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {dossierModalItem.documents?.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem' }}>No evidence files attached.</div>
                  ) : (
                    dossierModalItem.documents?.map(doc => (
                      <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.9rem', background: '#F1F5F9', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <FileText size={16} style={{ color: '#D4AF37' }} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}>{doc.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{doc.category || 'Proof'} ({doc.size})</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div style={{ padding: '1rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setDossierModalItem(null)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Review & Decision Modal */}
      {reviewModalItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 15, 30, 0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '500px', width: '100%', border: '1px solid #D4AF37', overflow: 'hidden' }}>
            <div style={{ background: '#070F1E', padding: '1rem 1.25rem', color: '#FFFFFF', borderBottom: '2px solid #D4AF37' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Review & Approve Academic Event</h3>
              <div style={{ fontSize: '0.75rem', color: '#D4AF37' }}>{reviewModalItem.eventNumber || reviewModalItem.id}: {reviewModalItem.title || reviewModalItem.name}</div>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>DECISION *</label>
                <select value={reviewAction} onChange={(e) => setReviewAction(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}>
                  <option value="APPROVE">Approve Event (Institutional Verified)</option>
                  <option value="UNDER_REVIEW">Mark Under Verification</option>
                  <option value="REQUEST_REVISION">Request Revision from Coordinator</option>
                  <option value="PUBLISH">Approve & Mark Eligible for Website</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>APPROVAL REMARKS</label>
                <textarea rows={3} placeholder="Add verification remarks..." value={reviewRemarks} onChange={(e) => setReviewRemarks(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ padding: '0.85rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setReviewModalItem(null)} style={{ padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
              <button type="button" onClick={handleExecuteReview} style={{ padding: '0.45rem 1.15rem', borderRadius: '6px', border: 'none', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Submit Decision</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

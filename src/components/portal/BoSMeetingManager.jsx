import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Users, 
  Building2, 
  FileText, 
  Layers, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  UploadCloud, 
  Lock, 
  Eye, 
  Copy, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Briefcase, 
  GraduationCap, 
  Printer,
  Archive,
  RefreshCw,
  FileSpreadsheet,
  FileCheck,
  History,
  Send,
  AlertTriangle,
  MapPin,
  Globe,
  Video,
  Info
} from 'lucide-react';
import { 
  getBoSMeetings, 
  saveBoSMeeting, 
  updateBoSMeetingStatus, 
  archiveBoSMeeting,
  softDeleteBoSMeeting, 
  generateBoSNumber,
  exportToCSV,
  exportToExcel,
  exportToPDF
} from '../../data/portalStore.js';
import { DEPARTMENTS, BRANDING_LOGOS } from '../../data/masterData.js';
import BosWizardModal from './bos/BosWizardModal.jsx';
import { 
  MotionPage, 
  ModulePageHeader, 
  AnimatedKpiGrid, 
  MotionKpiCard, 
  MotionTable, 
  MotionTableRow, 
  MotionEmptyState,
  MotionButton 
} from '../motion/index.js';

export default function BoSMeetingManager({ currentUser, onDataChange }) {
  const [meetings, setMeetings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState(
    currentUser?.role === 'HOD' ? (currentUser.dept || 'CSE') : 'ALL'
  );
  const [selectedRegulationFilter, setSelectedRegulationFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedAcademicYearFilter, setSelectedAcademicYearFilter] = useState('ALL');

  // Wizard Modal State
  const [wizardModalOpen, setWizardModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  // Detail Dossier Modal State
  const [detailModalMeeting, setDetailModalMeeting] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');

  // Review & Approval Action Modal State
  const [reviewModalMeeting, setReviewModalMeeting] = useState(null);
  const [reviewAction, setReviewAction] = useState('APPROVED'); // 'APPROVED' | 'NEEDS_REVISION'
  const [reviewComments, setReviewComments] = useState('');

  // Regulations Master List
  const availableRegulations = ['R16', 'R19', 'R20', 'R23', 'R26'];

  // Load BoS Data
  const refreshMeetings = () => {
    const data = getBoSMeetings();
    setMeetings(data);
  };

  useEffect(() => {
    refreshMeetings();
  }, []);

  // Role Permissions
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isAdmin = currentUser?.role === 'ADMIN';
  const isHOD = currentUser?.role === 'HOD';
  const canCreate = isSuperAdmin || isAdmin || isHOD;
  const canApprove = isSuperAdmin || isAdmin;

  const canEditRecord = (meeting) => {
    if (isSuperAdmin || isAdmin) return true;
    if (isHOD && meeting.department === currentUser?.dept) {
      return ['DRAFT', 'NEEDS_REVISION'].includes(meeting.workflowStatus);
    }
    return false;
  };

  // Filtered Meetings List
  const filteredMeetings = meetings.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (m.bosNumber && m.bosNumber.toLowerCase().includes(q)) ||
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.chairmanName && m.chairmanName.toLowerCase().includes(q)) ||
      (m.chairman && m.chairman.toLowerCase().includes(q)) ||
      (m.department && m.department.toLowerCase().includes(q)) ||
      (m.universityNominee?.name && m.universityNominee.name.toLowerCase().includes(q)) ||
      (m.regulations && m.regulations.some(r => r.toLowerCase().includes(q)));

    // HOD Department Restriction
    const matchesDept = currentUser?.role === 'HOD' 
      ? m.department === currentUser.dept 
      : (selectedDeptFilter === 'ALL' || m.department === selectedDeptFilter);

    const matchesReg = selectedRegulationFilter === 'ALL' || (m.regulations && m.regulations.includes(selectedRegulationFilter));
    const matchesStatus = selectedStatusFilter === 'ALL' || m.workflowStatus === selectedStatusFilter;
    const matchesYear = selectedAcademicYearFilter === 'ALL' || m.academicYear === selectedAcademicYearFilter;

    return matchesSearch && matchesDept && matchesReg && matchesStatus && matchesYear;
  });

  // KPI Metrics Summary
  const totalCount = meetings.length;
  const draftCount = meetings.filter(m => m.workflowStatus === 'DRAFT').length;
  const reviewCount = meetings.filter(m => ['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION'].includes(m.workflowStatus)).length;
  const approvedCount = meetings.filter(m => m.workflowStatus === 'APPROVED').length;
  const currentYearCount = meetings.filter(m => m.academicYear === '2025-26').length;

  // Open Create Wizard (100% EMPTY initial state)
  const handleOpenCreate = () => {
    setEditingMeeting(null);
    setWizardModalOpen(true);
  };

  // Open Edit Wizard
  const handleOpenEdit = (meeting) => {
    setEditingMeeting(meeting);
    setWizardModalOpen(true);
  };

  // Save Draft Handler
  const handleSaveDraft = (data) => {
    const payload = {
      ...data,
      workflowStatus: 'DRAFT'
    };
    const saved = saveBoSMeeting(payload, currentUser);
    refreshMeetings();
    setWizardModalOpen(false);
    alert(`Draft saved successfully for ${saved.bosNumber}.`);
  };

  // Submit for Review Handler
  const handleSubmitForReview = (data) => {
    const payload = {
      ...data,
      workflowStatus: 'SUBMITTED',
      workflowComments: 'Submitted for College Academic Admin & Super Admin review.'
    };
    const saved = saveBoSMeeting(payload, currentUser);
    refreshMeetings();
    setWizardModalOpen(false);
    alert(`BoS Meeting ${saved.bosNumber} submitted for Administrative Review!`);
  };

  // Handle Review Action (Approve / Request Revision)
  const handleExecuteReview = () => {
    if (!reviewModalMeeting) return;
    if (reviewAction === 'NEEDS_REVISION' && !reviewComments.trim()) {
      alert('Please provide specific feedback/revision requirements in the comments box.');
      return;
    }

    updateBoSMeetingStatus(
      reviewModalMeeting.id,
      reviewAction,
      reviewComments || (reviewAction === 'APPROVED' ? 'Approved by Academic Governance Committee.' : 'Changes requested.'),
      currentUser
    );

    refreshMeetings();
    setReviewModalMeeting(null);
    setReviewComments('');
    alert(`BoS record ${reviewModalMeeting.bosNumber} marked as ${reviewAction}!`);
  };

  // Handle Delete Draft
  const handleDeleteDraft = (meeting) => {
    if (confirm(`Are you sure you want to delete draft ${meeting.bosNumber}? This cannot be undone.`)) {
      try {
        softDeleteBoSMeeting(meeting.id, currentUser);
        refreshMeetings();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', icon: CheckCircle2, label: 'APPROVED' };
      case 'SUBMITTED':
        return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', icon: Clock, label: 'SUBMITTED' };
      case 'UNDER_REVIEW':
        return { bg: '#FDF4FF', text: '#9333EA', border: '#F0ABFC', icon: Sparkles, label: 'UNDER REVIEW' };
      case 'NEEDS_REVISION':
        return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', icon: AlertTriangle, label: 'NEEDS REVISION' };
      case 'ARCHIVED':
        return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1', icon: Archive, label: 'ARCHIVED' };
      case 'DRAFT':
      default:
        return { bg: '#FEFCE8', text: '#A16207', border: '#FEF08A', icon: Edit3, label: 'DRAFT' };
    }
  };

  return (
    <MotionPage style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      {/* 1. Page Title & Action Header */}
      <ModulePageHeader
        breadcrumbs={[
          { label: 'Dashboard' },
          { label: 'Academic Governance' },
          { label: 'Board of Studies (BoS)' }
        ]}
        title="Board of Studies (BoS) Academic Governance"
        subtitle="Statutory repository for department BoS regulations, external nominees, meeting minutes, and compliance approvals."
        onExportCSV={() => exportToCSV('bos_meetings')}
        onExportExcel={() => exportToExcel('bos_meetings')}
        onExportPDF={() => exportToPDF('bos_meetings')}
        primaryAction={canCreate ? {
          label: 'Create BoS Record',
          icon: Plus,
          onClick: handleOpenCreate
        } : null}
      />

      {/* 2. Mini KPI Stats Summary Row */}
      <AnimatedKpiGrid minWidth="180px">
        <MotionKpiCard label="Total BoS Meetings" value={totalCount} icon={BookOpen} color="#3B82F6" bg="rgba(59, 130, 246, 0.08)" />
        <MotionKpiCard label="Draft Meetings" value={draftCount} icon={Edit3} color="#F59E0B" bg="rgba(245, 158, 11, 0.08)" />
        <MotionKpiCard label="Awaiting Review" value={reviewCount} icon={Clock} color="#8B5CF6" bg="rgba(139, 92, 246, 0.08)" />
        <MotionKpiCard label="Approved Records" value={approvedCount} icon={CheckCircle2} color="#10B981" bg="rgba(16, 185, 129, 0.08)" />
        <MotionKpiCard label="AY 2025-26 Meetings" value={currentYearCount} icon={Calendar} color="#D4AF37" bg="rgba(212, 175, 55, 0.08)" />
      </AnimatedKpiGrid>

      {/* 3. Filter & Search Toolbar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '1rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search BoS number, title, chairman, university nominee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.82rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <button
              type="button"
              onClick={() => alert('Exporting Board of Studies dataset to Excel...')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#334155', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
              className="hover:bg-slate-100"
            >
              <FileSpreadsheet size={14} style={{ color: '#10B981' }} /> Export Excel
            </button>
            <button
              type="button"
              onClick={() => alert('Generating formal BoS governance PDF summary...')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#334155', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
              className="hover:bg-slate-100"
            >
              <FileText size={14} style={{ color: '#EF4444' }} /> Export PDF
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.65rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.2rem' }}>
              DEPARTMENT {currentUser?.role === 'HOD' && '(LOCKED)'}
            </label>
            <select
              value={selectedDeptFilter}
              disabled={currentUser?.role === 'HOD'}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', outline: 'none', background: currentUser?.role === 'HOD' ? '#F1F5F9' : '#FFFFFF' }}
            >
              {currentUser?.role !== 'HOD' && <option value="ALL">All Departments</option>}
              {DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.2rem' }}>
              ACADEMIC YEAR
            </label>
            <select
              value={selectedAcademicYearFilter}
              onChange={(e) => setSelectedAcademicYearFilter(e.target.value)}
              style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', outline: 'none', background: '#FFFFFF' }}
            >
              <option value="ALL">All Academic Years</option>
              <option value="2026-27">2026-27</option>
              <option value="2025-26">2025-26 (Current)</option>
              <option value="2024-25">2024-25</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.2rem' }}>
              REGULATION
            </label>
            <select
              value={selectedRegulationFilter}
              onChange={(e) => setSelectedRegulationFilter(e.target.value)}
              style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', outline: 'none', background: '#FFFFFF' }}
            >
              <option value="ALL">All Regulations</option>
              {availableRegulations.map(r => <option key={r} value={r}>{r} Regulation</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.2rem' }}>
              GOVERNANCE STATUS
            </label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', outline: 'none', background: '#FFFFFF' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">DRAFT</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="NEEDS_REVISION">NEEDS REVISION</option>
              <option value="APPROVED">APPROVED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. BoS Data Table */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.75rem 1rem' }}>BoS Number & Title</th>
                <th style={{ padding: '0.75rem 1rem' }}>Dept / Year</th>
                <th style={{ padding: '0.75rem 1rem' }}>Regulations</th>
                <th style={{ padding: '0.75rem 1rem' }}>Meeting Date & Mode</th>
                <th style={{ padding: '0.75rem 1rem' }}>Chairman / Nominee</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Documents</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeetings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
                    <BookOpen size={36} style={{ color: '#CBD5E1', margin: '0 auto 0.5rem auto' }} />
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>No Board of Studies meetings found</div>
                    <div style={{ fontSize: '0.76rem', marginTop: '0.2rem' }}>
                      {canCreate ? 'Click "+ Create BoS Record" to register a departmental BoS meeting.' : 'No records match the active search filters.'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMeetings.map((meeting) => {
                  const badge = getStatusBadge(meeting.workflowStatus);
                  const BadgeIcon = badge.icon;
                  const canEdit = canEditRecord(meeting);

                  return (
                    <tr
                      key={meeting.id}
                      style={{ borderBottom: '1px solid #F1F5F9' }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                          {meeting.bosNumber}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '0.15rem' }}>
                          {meeting.title || `${meeting.department} BoS Meeting`}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{meeting.department}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{meeting.academicYear}</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {meeting.regulations?.map(r => (
                            <span
                              key={r}
                              style={{
                                background: '#F1F5F9',
                                color: '#334155',
                                border: '1px solid #E2E8F0',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '4px',
                                fontSize: '0.68rem',
                                fontWeight: 700
                              }}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A' }}>{meeting.bosDate}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {meeting.meetingMode === 'Online' && <Video size={11} />}
                          {meeting.meetingMode === 'Hybrid' && <Globe size={11} />}
                          {meeting.meetingMode === 'Offline' && <MapPin size={11} />}
                          {meeting.meetingMode}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', maxWidth: '220px' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {meeting.chairmanName || meeting.chairman?.split('(')[0]}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          🎓 Nominee: {meeting.universityNominee?.name || 'Assigned'}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          background: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <BadgeIcon size={11} /> {badge.label}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontSize: '0.74rem', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FileText size={13} style={{ color: '#3B82F6' }} /> {meeting.documents?.length || 0} Docs
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            title="Inspect BoS Dossier"
                            onClick={() => {
                              setDetailModalMeeting(meeting);
                              setActiveDetailTab('overview');
                            }}
                            style={{ background: 'transparent', border: '1px solid #CBD5E1', color: '#334155', padding: '0.3rem 0.45rem', borderRadius: '6px', cursor: 'pointer' }}
                            className="hover:bg-slate-100"
                          >
                            <Eye size={13} />
                          </button>

                          {canEdit && (
                            <button
                              type="button"
                              title="Edit Record"
                              onClick={() => handleOpenEdit(meeting)}
                              style={{ background: 'transparent', border: '1px solid #CBD5E1', color: '#334155', padding: '0.3rem 0.45rem', borderRadius: '6px', cursor: 'pointer' }}
                              className="hover:bg-slate-100"
                            >
                              <Edit3 size={13} />
                            </button>
                          )}

                          {canApprove && ['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION'].includes(meeting.workflowStatus) && (
                            <button
                              type="button"
                              title="Review & Decision"
                              onClick={() => {
                                setReviewModalMeeting(meeting);
                                setReviewAction('APPROVED');
                                setReviewComments('');
                              }}
                              style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', padding: '0.3rem 0.55rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                              className="hover:bg-emerald-100"
                            >
                              Review
                            </button>
                          )}

                          {meeting.workflowStatus === 'DRAFT' && canEdit && (
                            <button
                              type="button"
                              title="Delete Draft"
                              onClick={() => handleDeleteDraft(meeting)}
                              style={{ background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.2)', color: '#DC2626', padding: '0.3rem 0.45rem', borderRadius: '6px', cursor: 'pointer' }}
                              className="hover:bg-red-100"
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

      {/* 5. Production-Grade Wizard Stepper Modal */}
      {wizardModalOpen && (
        <BosWizardModal
          isOpen={wizardModalOpen}
          onClose={() => setWizardModalOpen(false)}
          initialData={editingMeeting}
          currentUser={currentUser}
          onSaveDraft={handleSaveDraft}
          onSubmitForReview={handleSubmitForReview}
        />
      )}

      {/* 6. Detailed Inspection Dossier Modal */}
      {detailModalMeeting && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 15, 30, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1100
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              maxWidth: '860px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              overflow: 'hidden'
            }}
          >
            <div style={{ background: '#070F1E', padding: '1.25rem 1.5rem', color: '#FFFFFF', borderBottom: '2px solid #D4AF37', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.92rem', color: '#F1C40F' }}>
                    {detailModalMeeting.bosNumber}
                  </span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                    v{detailModalMeeting.version || 1}.0
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                  {detailModalMeeting.department} Department • {detailModalMeeting.academicYear} • Regulations: {detailModalMeeting.regulations?.join(', ')}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => alert(`Printing official dossier for ${detailModalMeeting.bosNumber}...`)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.74rem', cursor: 'pointer' }}
                >
                  <Printer size={13} /> Print
                </button>
                <button
                  type="button"
                  onClick={() => setDetailModalMeeting(null)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFFFFF', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '0 1.5rem', display: 'flex', gap: '1rem', overflowX: 'auto' }}>
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'members', label: 'Statutory Members' },
                { id: 'agenda', label: 'Agenda & Resolutions' },
                { id: 'documents', label: 'Documents & Minutes' },
                { id: 'history', label: 'Approval Trail' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDetailTab(tab.id)}
                  style={{
                    padding: '0.85rem 0.5rem',
                    border: 'none',
                    background: 'transparent',
                    borderBottom: `2px solid ${activeDetailTab === tab.id ? '#D4AF37' : 'transparent'}`,
                    color: activeDetailTab === tab.id ? '#0F172A' : '#64748B',
                    fontWeight: activeDetailTab === tab.id ? 800 : 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {activeDetailTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
                  <div><strong>Meeting Date:</strong> {detailModalMeeting.bosDate}</div>
                  <div><strong>Timing:</strong> {detailModalMeeting.startTime || 'N/A'} to {detailModalMeeting.endTime || 'N/A'}</div>
                  <div><strong>Mode:</strong> {detailModalMeeting.meetingMode}</div>
                  <div><strong>Venue:</strong> {detailModalMeeting.venue || 'N/A'}</div>
                  <div><strong>Meeting Status:</strong> {detailModalMeeting.meetingStatus}</div>
                  <div><strong>Governance Status:</strong> {detailModalMeeting.workflowStatus}</div>
                </div>
              )}

              {activeDetailTab === 'members' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase' }}>BoS Chairman</div>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{detailModalMeeting.chairmanName || detailModalMeeting.chairman}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{detailModalMeeting.chairmanEmail} • {detailModalMeeting.chairmanPhone}</div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>University Nominee</div>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{detailModalMeeting.universityNominee?.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                      {detailModalMeeting.universityNominee?.designation}, {detailModalMeeting.universityNominee?.institution}
                    </div>
                  </div>
                </div>
              )}

              {activeDetailTab === 'agenda' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {detailModalMeeting.agendaItems?.map((it, idx) => (
                    <div key={idx} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D4AF37', marginBottom: '0.2rem' }}>AGENDA ITEM #{it.itemNo}</div>
                      <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>{it.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#475569', background: '#FFFFFF', padding: '0.65rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <strong>Resolution / Decision:</strong> {it.decision || 'Approved without amendments.'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeDetailTab === 'documents' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {detailModalMeeting.documents?.map(doc => (
                    <div key={doc.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={20} style={{ color: '#EF4444' }} />
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{doc.title}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                            {doc.filename} • {(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB • {doc.version}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(`Downloading verified document ${doc.filename}...`)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <Download size={12} /> Download
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeDetailTab === 'history' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {detailModalMeeting.approvalHistory?.map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D4AF37', marginTop: '6px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                          {h.actor} — <span style={{ color: '#2563EB' }}>{h.toStatus}</span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '0.15rem' }}>{h.comments}</div>
                        <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                          {new Date(h.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 7. Review & Decision Modal */}
      {reviewModalMeeting && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 15, 30, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1100
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
              Academic Governance Review Decision
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>
              Record: <strong>{reviewModalMeeting.bosNumber}</strong> ({reviewModalMeeting.department})
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => setReviewAction('APPROVED')}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: `2px solid ${reviewAction === 'APPROVED' ? '#10B981' : '#E2E8F0'}`,
                  background: reviewAction === 'APPROVED' ? '#ECFDF5' : '#FFFFFF',
                  color: reviewAction === 'APPROVED' ? '#047857' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Approve BoS Record
              </button>

              <button
                type="button"
                onClick={() => setReviewAction('NEEDS_REVISION')}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: `2px solid ${reviewAction === 'NEEDS_REVISION' ? '#DC2626' : '#E2E8F0'}`,
                  background: reviewAction === 'NEEDS_REVISION' ? '#FEF2F2' : '#FFFFFF',
                  color: reviewAction === 'NEEDS_REVISION' ? '#DC2626' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Request Revision
              </button>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                REVIEWER COMMENTS & INSTRUCTIONS *
              </label>
              <textarea
                rows={4}
                required
                placeholder={reviewAction === 'APPROVED' ? 'Formal approval remarks for Academic Council...' : 'Specify items requiring revision from the department HOD...'}
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => setReviewModalMeeting(null)}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReview}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: reviewAction === 'APPROVED' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Submit Decision
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </MotionPage>
  );
}

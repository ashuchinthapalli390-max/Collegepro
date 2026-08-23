import React, { useState, useMemo } from 'react';
import { 
  Award, 
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
  Check, 
  X,
  GraduationCap,
  User,
  Star,
  BookOpen,
  Layers
} from 'lucide-react';
import { DEPARTMENTS, FACULTY_DATA } from '../../../data/masterData.js';
import { 
  getNPTEL, 
  reviewNPTEL, 
  softDeleteNPTEL,
  exportToCSV,
  exportToExcel,
  exportToPDF
} from '../../../data/portalStore.js';
import NptelCertificationWizardModal from './NptelCertificationWizardModal.jsx';

export default function NptelCertificationsManager({ currentUser, onDataChange }) {
  const [dataVersion, setDataVersion] = useState(0);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [dossierModalItem, setDossierModalItem] = useState(null);
  const [dossierActiveTab, setDossierActiveTab] = useState('overview');
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [reviewAction, setReviewAction] = useState('APPROVE');
  const [reviewRemarks, setReviewRemarks] = useState('');

  // Quick Tab Filter
  const [quickTab, setQuickTab] = useState('ALL');

  // Multi-Filter Toolbar
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState(currentUser?.role === 'HOD' ? (currentUser.dept || 'ALL') : 'ALL');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');
  const [selectedResult, setSelectedResult] = useState('ALL');
  const [selectedWorkflowStatus, setSelectedWorkflowStatus] = useState('ALL');

  const refresh = () => {
    setDataVersion(v => v + 1);
    if (onDataChange) onDataChange();
  };

  // Live Records
  const certifications = useMemo(() => {
    return getNPTEL();
  }, [dataVersion]);

  // KPIs
  const stats = useMemo(() => {
    const total = certifications.length;
    const students = certifications.filter(c => c.holderType === 'STUDENT').length;
    const faculty = certifications.filter(c => c.holderType === 'FACULTY').length;
    const nptel = certifications.filter(c => c.platform === 'NPTEL' || c.platform === 'SWAYAM').length;
    const elite = certifications.filter(c => c.certificationResult === 'Elite').length;
    const silver = certifications.filter(c => c.certificationResult === 'Elite + Silver').length;
    const gold = certifications.filter(c => c.certificationResult === 'Elite + Gold' || c.certificationResult === 'Topper').length;
    const pendingReview = certifications.filter(c => c.workflowStatus === 'SUBMITTED' || c.workflowStatus === 'UNDER_REVIEW').length;

    return { total, students, faculty, nptel, elite, silver, gold, pendingReview };
  }, [certifications]);

  // Filtered Certifications
  const filteredCertifications = useMemo(() => {
    return certifications.filter(item => {
      // Quick Tab Filter
      if (quickTab === 'STUDENTS' && item.holderType !== 'STUDENT') return false;
      if (quickTab === 'FACULTY' && item.holderType !== 'FACULTY') return false;
      if (quickTab === 'NPTEL' && item.platform !== 'NPTEL' && item.platform !== 'SWAYAM') return false;
      if (quickTab === 'ELITE' && !item.certificationResult?.includes('Elite')) return false;
      if (quickTab === 'PENDING' && item.workflowStatus !== 'SUBMITTED' && item.workflowStatus !== 'UNDER_REVIEW') return false;

      const q = searchQuery.toLowerCase().trim();
      const holderName = item.holderType === 'STUDENT' ? (item.studentDetails?.name || '') : (item.facultyDetails?.name || '');
      const rollNo = item.studentDetails?.rollNumber || '';

      const matchSearch = !q ||
        (item.certificationNumber && item.certificationNumber.toLowerCase().includes(q)) ||
        (item.courseName && item.courseName.toLowerCase().includes(q)) ||
        (item.certificateId && item.certificateId.toLowerCase().includes(q)) ||
        holderName.toLowerCase().includes(q) ||
        rollNo.toLowerCase().includes(q);

      const matchDept = selectedDept === 'ALL' || item.department.toLowerCase().includes(selectedDept.toLowerCase());
      const matchPlatform = selectedPlatform === 'ALL' || item.platform === selectedPlatform;
      const matchResult = selectedResult === 'ALL' || item.certificationResult === selectedResult;
      const matchWorkflow = selectedWorkflowStatus === 'ALL' || item.workflowStatus === selectedWorkflowStatus;

      return matchSearch && matchDept && matchPlatform && matchResult && matchWorkflow;
    });
  }, [certifications, quickTab, searchQuery, selectedDept, selectedPlatform, selectedResult, selectedWorkflowStatus]);

  // Permissions
  const canCreate = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || currentUser?.role === 'HOD' || currentUser?.role === 'FACULTY';
  const canReview = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || currentUser?.role === 'HOD';

  const handleExecuteReview = () => {
    if (!reviewModalItem) return;
    reviewNPTEL(reviewModalItem.id, reviewAction, reviewRemarks, currentUser);
    setReviewModalItem(null);
    setReviewRemarks('');
    refresh();
  };

  const handleDelete = (item) => {
    if (confirm(`Are you sure you want to soft-delete certification ${item.certificationNumber || item.id}?`)) {
      softDeleteNPTEL(item.id, currentUser);
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

  const getResultBadge = (result) => {
    switch (result) {
      case 'Elite + Gold':
      case 'Topper':
        return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', label: 'ELITE + GOLD' };
      case 'Elite + Silver':
        return { bg: '#F1F5F9', text: '#334155', border: '#CBD5E1', label: 'ELITE + SILVER' };
      case 'Elite':
        return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', label: 'ELITE' };
      case 'Successfully Completed':
      default:
        return { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0', label: 'COMPLETED' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      {/* 1. Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Accreditation & Skills</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>NPTEL & MOOC Certifications</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            NPTEL & MOOC Certifications
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Manage verified online certifications for students and faculty across NPTEL, SWAYAM, Coursera, and edX.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => exportToCSV('nptel')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
          >
            <Download size={14} /> CSV
          </button>
          <button
            type="button"
            onClick={() => exportToExcel('nptel')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#10B981', cursor: 'pointer' }}
          >
            <FileText size={14} /> Excel
          </button>
          <button
            type="button"
            onClick={() => exportToPDF('nptel')}
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
              <Plus size={15} /> Record Certification
            </button>
          )}
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '0.85rem' }}>
        {[
          { label: 'Total Certifications', value: stats.total, color: '#0F172A', icon: Award, bg: '#F8FAFC' },
          { label: 'Student Certifications', value: stats.students, color: '#2563EB', icon: GraduationCap, bg: '#EFF6FF' },
          { label: 'Faculty Certifications', value: stats.faculty, color: '#0D9488', icon: User, bg: '#F0FDFA' },
          { label: 'NPTEL / SWAYAM', value: stats.nptel, color: '#7C3AED', icon: BookOpen, bg: '#F5F3FF' },
          { label: 'Elite Badges', value: stats.elite, color: '#0284C7', icon: Star, bg: '#F0F9FF' },
          { label: 'Elite + Silver', value: stats.silver, color: '#475569', icon: ShieldCheck, bg: '#F1F5F9' },
          { label: 'Elite + Gold / Topper', value: stats.gold, color: '#D97706', icon: Sparkles, bg: '#FEFCE8' },
          { label: 'Pending Review', value: stats.pendingReview, color: '#DC2626', icon: Clock, bg: '#FEF2F2' }
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

      {/* 3. Quick Tabs & Multi-Filter Toolbar */}
      <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Quick Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.65rem' }}>
          {[
            { id: 'ALL', label: 'All Certifications' },
            { id: 'STUDENTS', label: 'Student Learners' },
            { id: 'FACULTY', label: 'Faculty Learners' },
            { id: 'NPTEL', label: 'NPTEL / SWAYAM Only' },
            { id: 'ELITE', label: 'Elite Badges' },
            { id: 'PENDING', label: 'Pending Review' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setQuickTab(tab.id)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: quickTab === tab.id ? '#070F1E' : '#F1F5F9',
                color: quickTab === tab.id ? '#F1C40F' : '#475569',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by learner name, roll no, course name, certificate ID..."
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
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFFFFF', color: '#0F172A', fontWeight: 600 }}
            >
              <option value="ALL">All Platforms</option>
              <option value="NPTEL">NPTEL</option>
              <option value="SWAYAM">SWAYAM</option>
              <option value="Coursera">Coursera</option>
              <option value="edX">edX</option>
              <option value="Infosys Springboard">Infosys Springboard</option>
            </select>

            <select
              value={selectedResult}
              onChange={(e) => setSelectedResult(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFFFFF', color: '#0F172A', fontWeight: 600 }}
            >
              <option value="ALL">All Results</option>
              <option value="Elite + Gold">Elite + Gold</option>
              <option value="Elite + Silver">Elite + Silver</option>
              <option value="Elite">Elite</option>
              <option value="Successfully Completed">Successfully Completed</option>
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

            {(searchQuery || selectedDept !== 'ALL' || selectedPlatform !== 'ALL' || selectedResult !== 'ALL' || selectedWorkflowStatus !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  if (currentUser?.role !== 'HOD') setSelectedDept('ALL');
                  setSelectedPlatform('ALL');
                  setSelectedResult('ALL');
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

      {/* 4. Certifications Data Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Learner / Candidate</th>
                <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem' }}>Platform & Course</th>
                <th style={{ padding: '0.85rem 1rem' }}>Duration</th>
                <th style={{ padding: '0.85rem 1rem' }}>Score & Badge</th>
                <th style={{ padding: '0.85rem 1rem' }}>Credits</th>
                <th style={{ padding: '0.85rem 1rem' }}>Approval</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertifications.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                    No NPTEL/MOOC certification records found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredCertifications.map((item, idx) => {
                  const wfBadge = getWorkflowBadge(item.workflowStatus);
                  const resBadge = getResultBadge(item.certificationResult);
                  const WfIcon = wfBadge.icon;
                  const isStudent = item.holderType === 'STUDENT';
                  const candidateName = isStudent ? item.studentDetails?.name : item.facultyDetails?.name;
                  const candidateSubtitle = isStudent ? item.studentDetails?.rollNumber : item.facultyDetails?.designation;

                  return (
                    <tr key={item.id || idx} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50">
                      <td style={{ padding: '0.85rem 1rem', maxWidth: '240px' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.84rem' }}>
                          {candidateName || 'Learner'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          {candidateSubtitle} • Dept: {item.department}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          background: isStudent ? '#EFF6FF' : '#F0FDFA',
                          color: isStudent ? '#1D4ED8' : '#0D9488'
                        }}>
                          {isStudent ? <GraduationCap size={12} /> : <User size={12} />}
                          {isStudent ? 'Student' : 'Faculty'}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', maxWidth: '260px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.courseName}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700 }}>
                          {item.platform} • {item.offeredBy}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
                          {item.duration}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          Exam: {item.examDate}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          background: resBadge.bg,
                          color: resBadge.text,
                          border: `1px solid ${resBadge.border}`,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          whiteSpace: 'nowrap'
                        }}>
                          {resBadge.label} ({item.scores?.finalScore}%)
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669' }}>
                          {item.academicCredits?.creditsEarned || 0} Credits
                        </div>
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
                            title="View Certificate Dossier"
                            style={{ padding: '0.35rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#334155', cursor: 'pointer' }}
                          >
                            <Eye size={13} />
                          </button>

                          {canReview && (
                            <button
                              type="button"
                              onClick={() => { setReviewModalItem(item); setReviewAction('APPROVE'); }}
                              title="Review / Verify Certification"
                              style={{ padding: '0.35rem 0.55rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', color: '#059669', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Verify
                            </button>
                          )}

                          {canCreate && (
                            <button
                              type="button"
                              onClick={() => { setEditingItem(item); setWizardOpen(true); }}
                              title="Edit Record"
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

      {/* 5. Certification Wizard Modal */}
      {wizardOpen && (
        <NptelCertificationWizardModal
          isOpen={wizardOpen}
          onClose={() => { setWizardOpen(false); setEditingItem(null); }}
          initialData={editingItem}
          currentUser={currentUser}
          onSaved={() => refresh()}
        />
      )}

      {/* 6. Multi-Tab Dossier Modal */}
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
            maxWidth: '800px',
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
                  {dossierModalItem.certificationNumber} • {dossierModalItem.platform}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#FFFFFF', fontFamily: 'Cinzel, serif' }}>
                  {dossierModalItem.courseName}
                </h3>
              </div>
              <button type="button" onClick={() => setDossierModalItem(null)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Dossier Tabs */}
            <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '0.5rem 1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              {[
                { id: 'overview', label: 'Course & Scores' },
                { id: 'candidate', label: 'Learner Profile' },
                { id: 'credits', label: 'Credits Transfer' },
                { id: 'evidence', label: `Certificate (${dossierModalItem.documents?.length || 0})` }
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

            {/* Dossier Canvas */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {dossierActiveTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Certificate ID</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>{dossierModalItem.certificateId || 'Pending'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Final Score & Badge</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#059669' }}>{dossierModalItem.certificationResult} ({dossierModalItem.scores?.finalScore}%)</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Offered By</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.offeredBy}</div>
                    </div>
                  </div>

                  {dossierModalItem.certificateVerificationUrl && (
                    <div style={{ padding: '0.75rem', background: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                      <a href={dossierModalItem.certificateVerificationUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1D4ED8', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 700 }}>
                        <ExternalLink size={14} /> Open Official Verification Link
                      </a>
                    </div>
                  )}
                </div>
              )}

              {dossierActiveTab === 'candidate' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>Learner Details</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                    {dossierModalItem.holderType === 'STUDENT' ? dossierModalItem.studentDetails?.name : dossierModalItem.facultyDetails?.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Category: <strong>{dossierModalItem.holderType}</strong> • Department of {dossierModalItem.department}
                  </div>
                </div>
              )}

              {dossierActiveTab === 'credits' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>Academic Credit Mapping</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>
                    {dossierModalItem.academicCredits?.creditsEarned || 0} Academic Credits Earned
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Academic Year: {dossierModalItem.academicYear} • Policy: AICTE / SWAYAM Credit Transfer Regulation
                  </div>
                </div>
              )}

              {dossierActiveTab === 'evidence' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {dossierModalItem.documents?.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem' }}>No certificate files attached.</div>
                  ) : (
                    dossierModalItem.documents?.map(doc => (
                      <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.9rem', background: '#F1F5F9', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <FileText size={16} style={{ color: '#D4AF37' }} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}>{doc.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{doc.type} ({doc.size})</div>
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

      {/* 7. Review Decision Modal */}
      {reviewModalItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 15, 30, 0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '500px', width: '100%', border: '1px solid #D4AF37', overflow: 'hidden' }}>
            <div style={{ background: '#070F1E', padding: '1rem 1.25rem', color: '#FFFFFF', borderBottom: '2px solid #D4AF37' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Verify & Approve Certification</h3>
              <div style={{ fontSize: '0.75rem', color: '#D4AF37' }}>{reviewModalItem.courseName}</div>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>DECISION *</label>
                <select value={reviewAction} onChange={(e) => setReviewAction(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}>
                  <option value="APPROVE">Verify & Approve (Accreditation & Credit Transfer)</option>
                  <option value="UNDER_REVIEW">Mark Under Verification</option>
                  <option value="REQUEST_REVISION">Request Revision from Learner</option>
                  <option value="ARCHIVE">Archive Record</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>VERIFICATION REMARKS</label>
                <textarea rows={3} placeholder="Add official verification remarks..." value={reviewRemarks} onChange={(e) => setReviewRemarks(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem', boxSizing: 'border-box' }} />
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

import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
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
  Layers
} from 'lucide-react';
import { DEPARTMENTS } from '../../../data/masterData.js';
import { 
  getInternships, 
  reviewInternship, 
  softDeleteInternship,
  exportToCSV,
  exportToExcel,
  exportToPDF
} from '../../../data/portalStore.js';
import StudentInternshipWizardModal from './StudentInternshipWizardModal.jsx';

export default function StudentInternshipsManager({ currentUser, onDataChange }) {
  const [dataVersion, setDataVersion] = useState(0);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [dossierModalItem, setDossierModalItem] = useState(null);
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [reviewAction, setReviewAction] = useState('VERIFY');
  const [reviewRemarks, setReviewRemarks] = useState('');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState(currentUser?.role === 'HOD' ? (currentUser.dept || 'ALL') : 'ALL');
  const [selectedAy, setSelectedAy] = useState('ALL');
  const [selectedMode, setSelectedMode] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStipend, setSelectedStipend] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const refresh = () => {
    setDataVersion(v => v + 1);
    if (onDataChange) onDataChange();
  };

  const internships = useMemo(() => {
    return getInternships();
  }, [dataVersion]);

  // KPIs
  const stats = useMemo(() => {
    const total = internships.length;
    const ongoing = internships.filter(i => i.internshipStatus === 'Ongoing').length;
    const completed = internships.filter(i => i.internshipStatus === 'Completed' || i.workflowStatus === 'COMPLETED').length;
    const paid = internships.filter(i => i.hasStipend === 'Yes' || i.stipend === 'Yes').length;
    const industry = internships.filter(i => i.organizationType === 'Company' || i.organizationType === 'Startup' || !i.organizationType).length;
    const pendingReview = internships.filter(i => i.workflowStatus === 'SUBMITTED' || i.workflowStatus === 'UNDER_REVIEW').length;
    return { total, ongoing, completed, paid, industry, pendingReview };
  }, [internships]);

  const filteredInternships = useMemo(() => {
    return internships.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        (item.rollNumber && item.rollNumber.toLowerCase().includes(q)) ||
        (item.studentName && item.studentName.toLowerCase().includes(q)) ||
        (item.organization && item.organization.toLowerCase().includes(q)) ||
        (item.internshipTitle && item.internshipTitle.toLowerCase().includes(q)) ||
        (item.domain && item.domain.toLowerCase().includes(q));

      const itemDept = item.department || item.branch || '';
      const matchDept = selectedDept === 'ALL' || itemDept.toLowerCase().includes(selectedDept.toLowerCase());
      const matchAy = selectedAy === 'ALL' || item.academicYear === selectedAy;
      const matchMode = selectedMode === 'ALL' || item.mode === selectedMode;
      const matchType = selectedType === 'ALL' || item.internshipType === selectedType;
      const matchStipend = selectedStipend === 'ALL' || (selectedStipend === 'YES' ? (item.hasStipend === 'Yes' || item.stipend === 'Yes') : (item.hasStipend === 'No' || item.stipend === 'No'));
      
      const itemStatus = item.workflowStatus || (item.status === 'Verified' ? 'VERIFIED' : 'DRAFT');
      const matchStatus = selectedStatus === 'ALL' || itemStatus === selectedStatus;

      return matchSearch && matchDept && matchAy && matchMode && matchType && matchStipend && matchStatus;
    });
  }, [internships, searchQuery, selectedDept, selectedAy, selectedMode, selectedType, selectedStipend, selectedStatus]);

  const canCreate = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || currentUser?.role === 'HOD' || currentUser?.role === 'FACULTY' || currentUser?.role === 'DATA_ENTRY';
  const canReview = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || currentUser?.role === 'HOD';

  const handleExecuteReview = () => {
    if (!reviewModalItem) return;
    reviewInternship(reviewModalItem.id, reviewAction, reviewRemarks, currentUser);
    setReviewModalItem(null);
    setReviewRemarks('');
    refresh();
  };

  const handleDelete = (item) => {
    if (confirm(`Are you sure you want to delete internship record for ${item.studentName} at ${item.organization}?`)) {
      softDeleteInternship(item.id, currentUser);
      refresh();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'APPROVED':
        return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', icon: CheckCircle2, label: 'COMPLETED' };
      case 'VERIFIED':
        return { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', icon: ShieldCheck, label: 'VERIFIED' };
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', icon: Clock, label: 'SUBMITTED' };
      case 'NEEDS_REVISION':
        return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', icon: AlertTriangle, label: 'REVISION REQ.' };
      case 'DRAFT':
      default:
        return { bg: '#FEFCE8', text: '#A16207', border: '#FEF08A', icon: Edit3, label: 'DRAFT' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', width: '100%' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Student Development</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Student Internships</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Industry Internships & Practical Training
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Comprehensive institutional record for Summer, Short-Term, Long-Term, and Industry Internships (NBA Criterion 4 Evidence).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => exportToCSV('internships')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
          >
            <Download size={14} /> CSV
          </button>
          <button
            type="button"
            onClick={() => exportToExcel('internships')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#10B981', cursor: 'pointer' }}
          >
            <FileText size={14} /> Excel
          </button>
          <button
            type="button"
            onClick={() => exportToPDF('internships')}
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
              <Plus size={15} /> Record Internship
            </button>
          )}
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
        {[
          { label: 'Total Internships', value: stats.total, color: '#0F172A', icon: Briefcase, bg: '#F8FAFC' },
          { label: 'Ongoing Training', value: stats.ongoing, color: '#2563EB', icon: Clock, bg: '#EFF6FF' },
          { label: 'Completed Internships', value: stats.completed, color: '#059669', icon: CheckCircle2, bg: '#ECFDF5' },
          { label: 'Paid / Stipendiary', value: stats.paid, color: '#D97706', icon: Sparkles, bg: '#FEFCE8' },
          { label: 'Industry Partners', value: stats.industry, color: '#7C3AED', icon: Building2, bg: '#F5F3FF' },
          { label: 'Pending Verification', value: stats.pendingReview, color: '#DC2626', icon: AlertTriangle, bg: '#FEF2F2' }
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div
              key={i}
              style={{ background: k.bg, padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>{k.label}</span>
                <Icon size={16} style={{ color: k.color }} />
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: k.color, fontFamily: 'Cinzel, serif' }}>
                {k.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Search & Filter Bar */}
      <div style={{
        background: '#FFFFFF',
        padding: '1rem 1.25rem',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by student roll no, company, domain, title..."
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
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
            </select>

            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFFFFF', color: '#0F172A', fontWeight: 600 }}
            >
              <option value="ALL">All Modes</option>
              <option value="Offline">Offline</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            <select
              value={selectedStipend}
              onChange={(e) => setSelectedStipend(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFFFFF', color: '#0F172A', fontWeight: 600 }}
            >
              <option value="ALL">Stipend: All</option>
              <option value="YES">Paid Only</option>
              <option value="NO">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Table */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Student & Roll No</th>
                <th style={{ padding: '0.85rem 1rem' }}>Branch & AY</th>
                <th style={{ padding: '0.85rem 1rem' }}>Organization & Domain</th>
                <th style={{ padding: '0.85rem 1rem' }}>Role / Title</th>
                <th style={{ padding: '0.85rem 1rem' }}>Duration</th>
                <th style={{ padding: '0.85rem 1rem' }}>Stipend</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInternships.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                    No student internship records found.
                  </td>
                </tr>
              ) : (
                filteredInternships.map((item, idx) => {
                  const statusKey = item.workflowStatus || (item.status === 'Verified' ? 'VERIFIED' : 'DRAFT');
                  const badge = getStatusBadge(statusKey);
                  const BadgeIcon = badge.icon;

                  return (
                    <tr key={item.id || idx} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50">
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.82rem' }}>{item.rollNumber}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{item.studentName}</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}>{item.department || item.branch}</span>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{item.academicYear} • {item.year || 'IV Year'}</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>{item.organization}</div>
                        <div style={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 600 }}>{item.domain} ({item.mode})</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', maxWidth: '240px' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.8rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {item.internshipTitle}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.76rem', color: '#0F172A', fontWeight: 700 }}>
                          {item.weeks || item.durationWeeks || 8} Weeks
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          {item.startDate} to {item.endDate}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        {(item.hasStipend === 'Yes' || item.stipend === 'Yes') ? (
                          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#059669' }}>
                            ₹{Number(item.stipendAmount || 0).toLocaleString('en-IN')}/mo
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Unpaid</span>
                        )}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          background: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          fontSize: '0.68rem',
                          fontWeight: 800
                        }}>
                          <BadgeIcon size={11} /> {badge.label}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => setDossierModalItem(item)}
                            title="View Dossier"
                            style={{ padding: '0.35rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#334155', cursor: 'pointer' }}
                          >
                            <Eye size={13} />
                          </button>

                          {canReview && (
                            <button
                              type="button"
                              onClick={() => { setReviewModalItem(item); setReviewAction('VERIFY'); }}
                              title="Verify Record"
                              style={{ padding: '0.35rem 0.55rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', color: '#059669', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Verify
                            </button>
                          )}

                          {canCreate && (
                            <button
                              type="button"
                              onClick={() => { setEditingItem(item); setWizardOpen(true); }}
                              style={{ padding: '0.35rem', background: '#FEFCE8', border: '1px solid #FEF08A', borderRadius: '6px', color: '#A16207', cursor: 'pointer' }}
                            >
                              <Edit3 size={13} />
                            </button>
                          )}

                          {canReview && (
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
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

      {wizardOpen && (
        <StudentInternshipWizardModal
          isOpen={wizardOpen}
          onClose={() => { setWizardOpen(false); setEditingItem(null); }}
          initialData={editingItem}
          currentUser={currentUser}
          onSaved={() => refresh()}
        />
      )}

      {/* Dossier Modal */}
      {dossierModalItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 15, 30, 0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #D4AF37' }}>
            <div style={{ background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 100%)', padding: '1.25rem 1.5rem', color: '#FFFFFF', borderBottom: '2px solid #D4AF37', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase' }}>{dossierModalItem.internshipNumber || dossierModalItem.id}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#FFFFFF' }}>{dossierModalItem.internshipTitle}</h3>
              </div>
              <button type="button" onClick={() => setDossierModalItem(null)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Student Details</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.studentName} ({dossierModalItem.rollNumber})</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B' }}>{dossierModalItem.department || dossierModalItem.branch} • {dossierModalItem.academicYear}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Host Organization</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.organization}</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B' }}>{dossierModalItem.domain} ({dossierModalItem.mode})</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Period & Duration</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.startDate} to {dossierModalItem.endDate}</div>
                  <div style={{ fontSize: '0.74rem', color: '#16A34A', fontWeight: 700 }}>{dossierModalItem.weeks || 8} Weeks ({dossierModalItem.durationDays || 60} Days)</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Stipend Package</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.stipendAmount ? `₹${dossierModalItem.stipendAmount}/mo` : 'Unpaid'}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{dossierModalItem.internshipStatus || 'Ongoing'}</div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Attached Evidence Files</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {dossierModalItem.offerLetter && <div style={{ padding: '0.5rem 0.8rem', background: '#F1F5F9', borderRadius: '6px', fontSize: '0.78rem' }}><strong>Offer Letter:</strong> {dossierModalItem.offerLetter}</div>}
                  {dossierModalItem.certificate && <div style={{ padding: '0.5rem 0.8rem', background: '#F1F5F9', borderRadius: '6px', fontSize: '0.78rem' }}><strong>Completion Certificate:</strong> {dossierModalItem.certificate}</div>}
                  {dossierModalItem.documents?.map(d => <div key={d.id} style={{ padding: '0.5rem 0.8rem', background: '#F1F5F9', borderRadius: '6px', fontSize: '0.78rem' }}>{d.name} ({d.size})</div>)}
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setDossierModalItem(null)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 15, 30, 0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '500px', width: '100%', border: '1px solid #D4AF37', overflow: 'hidden' }}>
            <div style={{ background: '#070F1E', padding: '1rem 1.25rem', color: '#FFFFFF', borderBottom: '2px solid #D4AF37' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Verify Internship Record</h3>
              <div style={{ fontSize: '0.75rem', color: '#D4AF37' }}>{reviewModalItem.studentName} at {reviewModalItem.organization}</div>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>REVIEW DECISION *</label>
                <select value={reviewAction} onChange={(e) => setReviewAction(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}>
                  <option value="VERIFY">Mark Verified (Audit Approved)</option>
                  <option value="COMPLETE">Mark Completed (Certificate Validated)</option>
                  <option value="REQUEST_REVISION">Request Revision / Missing Proof</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>VERIFICATION REMARKS</label>
                <textarea rows={3} placeholder="Verification comments, attendance check..." value={reviewRemarks} onChange={(e) => setReviewRemarks(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem', boxSizing: 'border-box' }} />
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

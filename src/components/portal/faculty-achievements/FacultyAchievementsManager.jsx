import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
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
  Award,
  BookOpen
} from 'lucide-react';
import { DEPARTMENTS, FACULTY_DATA } from '../../../data/masterData.js';
import { 
  getFacultyAchievements, 
  reviewFacultyAchievement, 
  softDeleteFacultyAchievement,
  exportToCSV,
  exportToExcel,
  exportToPDF
} from '../../../data/portalStore.js';
import FacultyAchievementWizardModal from './FacultyAchievementWizardModal.jsx';

export default function FacultyAchievementsManager({ currentUser, onDataChange }) {
  const [dataVersion, setDataVersion] = useState(0);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [dossierModalItem, setDossierModalItem] = useState(null);
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [reviewAction, setReviewAction] = useState('APPROVE');
  const [reviewRemarks, setReviewRemarks] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState(currentUser?.role === 'HOD' ? (currentUser.dept || 'ALL') : 'ALL');
  const [selectedAy, setSelectedAy] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const refresh = () => {
    setDataVersion(v => v + 1);
    if (onDataChange) onDataChange();
  };

  const achievements = useMemo(() => {
    return getFacultyAchievements();
  }, [dataVersion]);

  // KPIs
  const stats = useMemo(() => {
    const total = achievements.length;
    const uniqueFaculty = new Set(achievements.map(a => a.facultyName || a.facultyId)).size;
    const fdps = achievements.filter(a => a.type && a.type.includes('FDP')).length;
    const training = achievements.filter(a => a.type && a.type.includes('Training')).length;
    const awards = achievements.filter(a => a.type && (a.type.includes('Award') || a.type.includes('Certification'))).length;
    const pending = achievements.filter(a => a.workflowStatus === 'SUBMITTED' || a.workflowStatus === 'UNDER_REVIEW').length;
    return { total, uniqueFaculty, fdps, training, awards, pending };
  }, [achievements]);

  const filteredAchievements = useMemo(() => {
    return achievements.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        (item.facultyName && item.facultyName.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.organizedBy && item.organizedBy.toLowerCase().includes(q)) ||
        (item.facultyId && item.facultyId.toLowerCase().includes(q));

      const itemDept = item.department || '';
      const matchDept = selectedDept === 'ALL' || itemDept.toLowerCase().includes(selectedDept.toLowerCase());
      const matchAy = selectedAy === 'ALL' || item.academicYear === selectedAy;
      const matchType = selectedType === 'ALL' || item.type === selectedType;
      const matchRole = selectedRole === 'ALL' || item.participationRole === selectedRole;
      
      const itemStatus = item.workflowStatus || (item.status === 'Verified' ? 'VERIFIED' : 'DRAFT');
      const matchStatus = selectedStatus === 'ALL' || itemStatus === selectedStatus;

      return matchSearch && matchDept && matchAy && matchType && matchRole && matchStatus;
    });
  }, [achievements, searchQuery, selectedDept, selectedAy, selectedType, selectedRole, selectedStatus]);

  const canCreate = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || currentUser?.role === 'HOD' || currentUser?.role === 'FACULTY';
  const canReview = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || currentUser?.role === 'HOD';

  const handleExecuteReview = () => {
    if (!reviewModalItem) return;
    reviewFacultyAchievement(reviewModalItem.id, reviewAction, reviewRemarks, currentUser);
    setReviewModalItem(null);
    setReviewRemarks('');
    refresh();
  };

  const handleDelete = (item) => {
    if (confirm(`Are you sure you want to delete achievement for ${item.facultyName}?`)) {
      softDeleteFacultyAchievement(item.id, currentUser);
      refresh();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', icon: CheckCircle2, label: 'APPROVED' };
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
            <span>Faculty Development</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Faculty Achievements</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Faculty Achievements & Professional Development
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Individual faculty professional achievements: FDP attendance, external workshops, certifications, invited lectures, and awards (NAAC Criterion 6 Evidence).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => exportToCSV('faculty-ach')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
          >
            <Download size={14} /> CSV
          </button>
          <button
            type="button"
            onClick={() => exportToExcel('faculty-ach')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#10B981', cursor: 'pointer' }}
          >
            <FileText size={14} /> Excel
          </button>
          <button
            type="button"
            onClick={() => exportToPDF('faculty-ach')}
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
              <Plus size={15} /> Record Faculty Achievement
            </button>
          )}
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
        {[
          { label: 'Total Achievements', value: stats.total, color: '#0F172A', icon: GraduationCap, bg: '#F8FAFC' },
          { label: 'Active Faculty', value: stats.uniqueFaculty, color: '#059669', icon: CheckCircle2, bg: '#ECFDF5' },
          { label: 'FDPs Completed', value: stats.fdps, color: '#2563EB', icon: BookOpen, bg: '#EFF6FF' },
          { label: 'Training Programmes', value: stats.training, color: '#7C3AED', icon: Award, bg: '#F5F3FF' },
          { label: 'Awards & Honors', value: stats.awards, color: '#D97706', icon: Sparkles, bg: '#FEFCE8' },
          { label: 'Pending Verification', value: stats.pending, color: '#DC2626', icon: AlertTriangle, bg: '#FEF2F2' }
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

      {/* 3. Search & Filters */}
      <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by faculty name, achievement title, institution, role..."
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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFFFFF', color: '#0F172A', fontWeight: 600 }}
            >
              <option value="ALL">All Types</option>
              <option value="Faculty Development Programme (FDP)">FDP</option>
              <option value="Workshop">Workshop</option>
              <option value="Award / Academic Recognition">Award</option>
              <option value="Professional Certification">Certification</option>
              <option value="Resource Person / Guest Lecture">Resource Person</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFFFFF', color: '#0F172A', fontWeight: 600 }}
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="VERIFIED">Verified</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Faculty Member</th>
                <th style={{ padding: '0.85rem 1rem' }}>Department & AY</th>
                <th style={{ padding: '0.85rem 1rem' }}>Activity Type & Role</th>
                <th style={{ padding: '0.85rem 1rem' }}>Programme / Award Title</th>
                <th style={{ padding: '0.85rem 1rem' }}>Organized By</th>
                <th style={{ padding: '0.85rem 1rem' }}>Dates & Duration</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAchievements.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                    No faculty achievement records found.
                  </td>
                </tr>
              ) : (
                filteredAchievements.map((item, idx) => {
                  const statusKey = item.workflowStatus || (item.status === 'Verified' ? 'VERIFIED' : 'DRAFT');
                  const badge = getStatusBadge(statusKey);
                  const BadgeIcon = badge.icon;

                  return (
                    <tr key={item.id || idx} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50">
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.82rem' }}>{item.facultyName}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{item.designation || item.facultyId}</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}>{item.department}</span>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{item.academicYear}</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0369A1', background: '#E0F2FE', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                          {item.type || 'FDP'}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.2rem' }}>
                          Role: <strong>{item.participationRole || 'Participant'}</strong>
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', maxWidth: '260px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {item.title}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.78rem', color: '#0F172A', fontWeight: 600 }}>{item.organizedBy}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{item.venue || item.mode}</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.76rem', color: '#0F172A', fontWeight: 700 }}>
                          {item.startDate} to {item.endDate}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 600 }}>
                          {item.durationDays || 5} Days ({item.mode || 'Online'})
                        </div>
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
                          <button type="button" onClick={() => setDossierModalItem(item)} title="View Dossier" style={{ padding: '0.35rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#334155', cursor: 'pointer' }}>
                            <Eye size={13} />
                          </button>

                          {canReview && (
                            <button type="button" onClick={() => { setReviewModalItem(item); setReviewAction('APPROVE'); }} title="Approve Record" style={{ padding: '0.35rem 0.55rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', color: '#059669', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                              Approve
                            </button>
                          )}

                          {canCreate && (
                            <button type="button" onClick={() => { setEditingItem(item); setWizardOpen(true); }} title="Edit Record" style={{ padding: '0.35rem', background: '#FEFCE8', border: '1px solid #FEF08A', borderRadius: '6px', color: '#A16207', cursor: 'pointer' }}>
                              <Edit3 size={13} />
                            </button>
                          )}

                          {canReview && (
                            <button type="button" onClick={() => handleDelete(item)} title="Delete / Archive" style={{ padding: '0.35rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', color: '#DC2626', cursor: 'pointer' }}>
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
        <FacultyAchievementWizardModal
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
                <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase' }}>{dossierModalItem.achievementNumber || dossierModalItem.id}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#FFFFFF' }}>{dossierModalItem.title}</h3>
              </div>
              <button type="button" onClick={() => setDossierModalItem(null)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Faculty Member</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.facultyName}</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B' }}>{dossierModalItem.designation || dossierModalItem.facultyId}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Department & AY</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.department} • {dossierModalItem.academicYear}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Organizing Body</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.organizedBy}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Duration</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.startDate} to {dossierModalItem.endDate} ({dossierModalItem.durationDays || 5} Days)</div>
                </div>
              </div>

              {/* Evidence */}
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Evidence Documents</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {dossierModalItem.certificate && <div style={{ padding: '0.5rem 0.8rem', background: '#F1F5F9', borderRadius: '6px', fontSize: '0.78rem' }}><strong>Certificate:</strong> {dossierModalItem.certificate}</div>}
                  {dossierModalItem.proof && <div style={{ padding: '0.5rem 0.8rem', background: '#F1F5F9', borderRadius: '6px', fontSize: '0.78rem' }}><strong>Proof / Photo:</strong> {dossierModalItem.proof}</div>}
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
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Approve Faculty Achievement</h3>
              <div style={{ fontSize: '0.75rem', color: '#D4AF37' }}>{reviewModalItem.facultyName} - {reviewModalItem.title}</div>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>DECISION *</label>
                <select value={reviewAction} onChange={(e) => setReviewAction(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}>
                  <option value="APPROVE">Approve Achievement (NAAC/NBA Validated)</option>
                  <option value="VERIFY">Mark Verified (Department Audit)</option>
                  <option value="REQUEST_REVISION">Request Revision from Faculty</option>
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

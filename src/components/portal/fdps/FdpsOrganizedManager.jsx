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
  Handshake
} from 'lucide-react';
import { DEPARTMENTS } from '../../../data/masterData.js';
import { 
  getFDPs, 
  reviewFDP, 
  softDeleteFDP,
  exportToCSV,
  exportToExcel,
  exportToPDF
} from '../../../data/portalStore.js';
import FdpOrganizedWizardModal from './FdpOrganizedWizardModal.jsx';

export default function FdpsOrganizedManager({ currentUser, onDataChange }) {
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
  const [selectedMode, setSelectedMode] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const refresh = () => {
    setDataVersion(v => v + 1);
    if (onDataChange) onDataChange();
  };

  const fdps = useMemo(() => {
    return getFDPs();
  }, [dataVersion]);

  // KPIs
  const stats = useMemo(() => {
    const total = fdps.length;
    const completed = fdps.filter(f => f.programmeStatus === 'COMPLETED' || f.workflowStatus === 'APPROVED').length;
    const ongoing = fdps.filter(f => f.programmeStatus === 'ONGOING' || f.programmeStatus === 'PLANNED').length;
    const participants = fdps.reduce((sum, f) => sum + Number(f.noParticipants || 0), 0);
    const mouAssociated = fdps.filter(f => f.isMouAssociated === 'Yes' || f.associatedMoU).length;
    const totalFunding = fdps.reduce((sum, f) => sum + Number(f.amount || f.financials?.amount || 0), 0);
    return { total, completed, ongoing, participants, mouAssociated, totalFunding };
  }, [fdps]);

  const filteredFDPs = useMemo(() => {
    return fdps.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        (item.fdpTitle && item.fdpTitle.toLowerCase().includes(q)) ||
        (item.coordinator && item.coordinator.toLowerCase().includes(q)) ||
        (item.coordinatorName && item.coordinatorName.toLowerCase().includes(q)) ||
        (item.resourcePerson && item.resourcePerson.toLowerCase().includes(q)) ||
        (item.associatedMoU && item.associatedMoU.toLowerCase().includes(q));

      const itemDept = item.department || '';
      const matchDept = selectedDept === 'ALL' || itemDept.toLowerCase().includes(selectedDept.toLowerCase());
      const matchAy = selectedAy === 'ALL' || item.academicYear === selectedAy;
      const matchMode = selectedMode === 'ALL' || item.mode === selectedMode;
      const matchType = selectedType === 'ALL' || (item.programmeType && item.programmeType.includes(selectedType));
      
      const itemStatus = item.workflowStatus || (item.status === 'Approved' ? 'APPROVED' : 'DRAFT');
      const matchStatus = selectedStatus === 'ALL' || itemStatus === selectedStatus;

      return matchSearch && matchDept && matchAy && matchMode && matchType && matchStatus;
    });
  }, [fdps, searchQuery, selectedDept, selectedAy, selectedMode, selectedType, selectedStatus]);

  const canCreate = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || currentUser?.role === 'HOD' || currentUser?.role === 'FACULTY';
  const canReview = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || currentUser?.role === 'HOD';

  const handleExecuteReview = () => {
    if (!reviewModalItem) return;
    reviewFDP(reviewModalItem.id, reviewAction, reviewRemarks, currentUser);
    setReviewModalItem(null);
    setReviewRemarks('');
    refresh();
  };

  const handleDelete = (item) => {
    if (confirm(`Are you sure you want to delete FDP record: ${item.fdpTitle}?`)) {
      softDeleteFDP(item.id, currentUser);
      refresh();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', icon: CheckCircle2, label: 'APPROVED' };
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
        return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', icon: Clock, label: 'UNDER REVIEW' };
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
            <span style={{ color: '#0F172A', fontWeight: 700 }}>FDPs Organized</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Faculty Development Programmes (FDPs Organized)
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Institutional repository for college/department-organized FDPs, AICTE/UGC sponsored workshops, training programmes, and MoU collaborations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => exportToCSV('fdps')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
          >
            <Download size={14} /> CSV
          </button>
          <button
            type="button"
            onClick={() => exportToExcel('fdps')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#10B981', cursor: 'pointer' }}
          >
            <FileText size={14} /> Excel
          </button>
          <button
            type="button"
            onClick={() => exportToPDF('fdps')}
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
              <Plus size={15} /> Record Organized FDP
            </button>
          )}
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
        {[
          { label: 'Total Programmes', value: stats.total, color: '#0F172A', icon: Award, bg: '#F8FAFC' },
          { label: 'Completed FDPs', value: stats.completed, color: '#059669', icon: CheckCircle2, bg: '#ECFDF5' },
          { label: 'Scheduled / Ongoing', value: stats.ongoing, color: '#2563EB', icon: Clock, bg: '#EFF6FF' },
          { label: 'Total Participants', value: stats.participants, color: '#9333EA', icon: Users, bg: '#FDF4FF' },
          { label: 'MoU Associated', value: stats.mouAssociated, color: '#D97706', icon: Handshake, bg: '#FEFCE8' },
          { label: 'Grants / Funding', value: `₹${(stats.totalFunding / 100000).toFixed(1)}L`, color: '#0D9488', icon: Building2, bg: '#F0FDFA' }
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
              placeholder="Search by FDP title, coordinator, resource person, MoU..."
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFFFFF', color: '#0F172A', fontWeight: 600 }}
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="UNDER_REVIEW">Under Review</option>
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
                <th style={{ padding: '0.85rem 1rem' }}>FDP / Workshop Title</th>
                <th style={{ padding: '0.85rem 1rem' }}>Department & AY</th>
                <th style={{ padding: '0.85rem 1rem' }}>Coordinator(s)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Dates & Duration</th>
                <th style={{ padding: '0.85rem 1rem' }}>Participants</th>
                <th style={{ padding: '0.85rem 1rem' }}>MoU Collab</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFDPs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                    No organized FDP records found.
                  </td>
                </tr>
              ) : (
                filteredFDPs.map((item, idx) => {
                  const statusKey = item.workflowStatus || (item.status === 'Approved' ? 'APPROVED' : 'DRAFT');
                  const badge = getStatusBadge(statusKey);
                  const BadgeIcon = badge.icon;

                  return (
                    <tr key={item.id || idx} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50">
                      <td style={{ padding: '0.85rem 1rem', maxWidth: '280px' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.82rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {item.fdpTitle}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          {item.programmeType || 'FDP'} • {item.venue || 'Campus'}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}>{item.department}</span>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{item.academicYear}</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}>
                          {item.coordinatorName || item.coordinator}
                        </div>
                        {item.coCoordinatorName && <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{item.coCoordinatorName}</div>}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.76rem', color: '#0F172A', fontWeight: 700 }}>
                          {item.startDate} to {item.endDate}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 600 }}>
                          {item.durationDays || 6} Days ({item.mode || 'Offline'})
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9333EA' }}>
                          {item.noParticipants || item.participantCount || 60}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Delegates</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        {(item.isMouAssociated === 'Yes' || item.associatedMoU) ? (
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#D97706', background: '#FEFCE8', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                            MoU Partnered
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Autonomous</span>
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
        <FdpOrganizedWizardModal
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
                <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase' }}>{dossierModalItem.fdpNumber || dossierModalItem.id}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#FFFFFF' }}>{dossierModalItem.fdpTitle}</h3>
              </div>
              <button type="button" onClick={() => setDossierModalItem(null)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Department & AY</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.department} • {dossierModalItem.academicYear}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Coordinator</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.coordinatorName || dossierModalItem.coordinator}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Duration & Mode</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{dossierModalItem.startDate} to {dossierModalItem.endDate} ({dossierModalItem.mode || 'Offline'})</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Funding / Grant</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>₹{dossierModalItem.amount || dossierModalItem.financials?.amount || 0} ({dossierModalItem.invoiceNumber || 'NA'})</div>
                </div>
              </div>

              {/* Resource Persons */}
              {dossierModalItem.resourcePersons?.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Key Experts & Resource Persons</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {dossierModalItem.resourcePersons.map((r, i) => (
                      <div key={i} style={{ padding: '0.5rem 0.8rem', background: '#F1F5F9', borderRadius: '6px', fontSize: '0.78rem' }}>
                        <strong>{r.name}</strong> ({r.designation} - {r.organization}) — <em>{r.topic}</em>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Review & Approve FDP Record</h3>
              <div style={{ fontSize: '0.75rem', color: '#D4AF37' }}>{reviewModalItem.fdpTitle}</div>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>DECISION *</label>
                <select value={reviewAction} onChange={(e) => setReviewAction(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}>
                  <option value="APPROVE">Approve FDP (NBA/NAAC Verified)</option>
                  <option value="UNDER_REVIEW">Mark Under Verification</option>
                  <option value="REQUEST_REVISION">Request Revision from Coordinator</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>APPROVAL REMARKS</label>
                <textarea rows={3} placeholder="Verification notes, sanction check..." value={reviewRemarks} onChange={(e) => setReviewRemarks(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem', boxSizing: 'border-box' }} />
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

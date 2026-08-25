import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Globe, 
  Briefcase, 
  Users, 
  Award, 
  MapPin, 
  ShieldCheck, 
  ExternalLink,
  DollarSign,
  X
} from 'lucide-react';
import { 
  MotionPage, 
  ModulePageHeader, 
  AnimatedKpiGrid, 
  MotionKpiCard, 
  MotionTable, 
  MotionTableRow, 
  MotionEmptyState, 
  MotionButton,
  MotionModal
} from '../../motion/index.js';
import { ET_DEPARTMENTS } from '../../../data/masterData.js';
import { 
  getCompanyVisits, 
  saveCompanyVisit, 
  deleteCompanyVisit,
  exportToCSV,
  exportToPDF
} from '../../../data/portalStore.js';
import ConfirmDeleteDialog from '../common/ConfirmDeleteDialog.jsx';

export default function CompaniesVisitedManager({ currentUser, onDataChange }) {
  const [dataVersion, setDataVersion] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAy, setSelectedAy] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState(
    currentUser?.role === 'HOD' ? (currentUser.dept || 'ALL') : 'ALL'
  );
  const [selectedDriveType, setSelectedDriveType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal states
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [detailVisit, setDetailVisit] = useState(null);
  const [deleteConfirmVisit, setDeleteConfirmVisit] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const visitsList = useMemo(() => {
    return getCompanyVisits();
  }, [dataVersion]);

  // Filtered Visits
  const filteredVisits = useMemo(() => {
    return visitsList.filter(v => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        v.companyName.toLowerCase().includes(q) ||
        (v.sector || '').toLowerCase().includes(q) ||
        (v.rolesOffered || []).some(r => (r.roleTitle || '').toLowerCase().includes(q))
      );

      const matchesAy = selectedAy === 'ALL' || v.academicYear === selectedAy;
      const matchesDept = selectedDept === 'ALL' || (v.eligibleDepartments || []).includes(selectedDept);
      const matchesDriveType = selectedDriveType === 'ALL' || v.driveType === selectedDriveType;
      const matchesStatus = selectedStatus === 'ALL' || v.status === selectedStatus;

      return matchesSearch && matchesAy && matchesDept && matchesDriveType && matchesStatus;
    });
  }, [visitsList, searchQuery, selectedAy, selectedDept, selectedDriveType, selectedStatus]);

  // KPIs
  const stats = useMemo(() => {
    const totalVisits = filteredVisits.length;
    const uniqueCompanies = new Set(filteredVisits.map(v => v.companyName.trim().toLowerCase())).size;
    const activeDrives = filteredVisits.filter(v => v.status === 'Ongoing' || v.status === 'Scheduled').length;
    const totalOffers = filteredVisits.reduce((acc, v) => acc + (v.offersCount != null ? Number(v.offersCount) : 0), 0);

    return {
      totalVisits,
      uniqueCompanies,
      activeDrives,
      totalOffers
    };
  }, [filteredVisits]);

  // Wizard Form State
  const [formData, setFormData] = useState({
    companyName: '',
    sector: '',
    companyType: '',
    website: '',
    academicYear: '2026-27',
    visitDate: new Date().toISOString().split('T')[0],
    driveType: 'On-Campus',
    mode: 'In-Person',
    venue: '',
    status: 'SCHEDULED',
    eligibleDepartments: ['CYS', 'DS', 'AI', 'AIML'],
    roleTitle: '',
    ctcLpa: '',
    stipendMonthly: '',
    eligibleCount: '',
    attendedCount: '',
    shortlistedCount: '',
    selectedCount: '',
    offersCount: '',
    hrContactName: '',
    hrEmail: '',
    hrPhone: ''
  });

  const handleOpenCreate = () => {
    setEditingVisit(null);
    setFormData({
      companyName: '',
      sector: '',
      companyType: '',
      website: '',
      academicYear: '2026-27',
      visitDate: new Date().toISOString().split('T')[0],
      driveType: 'On-Campus',
      mode: 'In-Person',
      venue: '',
      status: 'SCHEDULED',
      eligibleDepartments: ['CYS', 'DS', 'AI', 'AIML'],
      roleTitle: '',
      ctcLpa: '',
      stipendMonthly: '',
      eligibleCount: '',
      attendedCount: '',
      shortlistedCount: '',
      selectedCount: '',
      offersCount: '',
      hrContactName: '',
      hrEmail: '',
      hrPhone: ''
    });
    setWizardOpen(true);
  };

  const handleOpenEdit = (visit) => {
    setEditingVisit(visit);
    setFormData({
      ...visit,
      roleTitle: visit.rolesOffered?.[0]?.roleTitle || '',
      ctcLpa: visit.rolesOffered?.[0]?.ctcLpa || '',
      stipendMonthly: visit.rolesOffered?.[0]?.stipendMonthly || ''
    });
    setWizardOpen(true);
  };

  const handleToggleDept = (code) => {
    setFormData(prev => {
      const exists = prev.eligibleDepartments.includes(code);
      return {
        ...prev,
        eligibleDepartments: exists 
          ? prev.eligibleDepartments.filter(c => c !== code)
          : [...prev.eligibleDepartments, code]
      };
    });
  };

  const handleSaveVisit = (e) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      showToast('Please enter the Company Name.');
      return;
    }

    const payload = {
      ...formData,
      rolesOffered: [
        {
          roleTitle: formData.roleTitle || 'Graduate Trainee',
          ctcLpa: formData.ctcLpa ? Number(formData.ctcLpa) : null,
          stipendMonthly: formData.stipendMonthly ? Number(formData.stipendMonthly) : null
        }
      ],
      eligibleCount: formData.eligibleCount ? Number(formData.eligibleCount) : null,
      attendedCount: formData.attendedCount ? Number(formData.attendedCount) : null,
      shortlistedCount: formData.shortlistedCount ? Number(formData.shortlistedCount) : null,
      selectedCount: formData.selectedCount ? Number(formData.selectedCount) : null,
      offersCount: formData.offersCount ? Number(formData.offersCount) : null
    };

    const saved = saveCompanyVisit(payload, currentUser);
    setDataVersion(v => v + 1);
    setWizardOpen(false);
    showToast(`Company visit for "${saved.companyName}" recorded successfully.`);
    if (onDataChange) onDataChange();
  };

  const handleDelete = () => {
    if (!deleteConfirmVisit) return;
    deleteCompanyVisit(deleteConfirmVisit.id);
    setDataVersion(v => v + 1);
    setDeleteConfirmVisit(null);
    showToast('Company visit deleted.');
    if (onDataChange) onDataChange();
  };

  const handleExportCSV = () => {
    const exportRows = filteredVisits.map(v => ({
      'Company Name': v.companyName,
      'Sector': v.sector,
      'Company Type': v.companyType,
      'Academic Year': v.academicYear,
      'Visit Date': v.visitDate,
      'Drive Type': v.driveType,
      'Mode': v.mode,
      'Status': v.status,
      'Eligible ET Depts': (v.eligibleDepartments || []).join(', '),
      'Roles Offered': (v.rolesOffered || []).map(r => `${r.roleTitle} (${r.ctcLpa} LPA)`).join('; '),
      'Selected Count': v.selectedCount != null ? v.selectedCount : 'N/A',
      'Total Offers': v.offersCount != null ? v.offersCount : 'N/A'
    }));
    exportToCSV(exportRows, `ET_Companies_Visited_${selectedAy}`);
    showToast('Exported filtered company visits to CSV.');
  };

  const handleExportPDF = () => {
    const headers = ['Company', 'Sector', 'Visit Date', 'Drive Type', 'Eligible Depts', 'Roles (CTC)', 'Offers', 'Status'];
    const rows = filteredVisits.map(v => [
      v.companyName,
      v.sector,
      v.visitDate,
      v.driveType,
      (v.eligibleDepartments || []).join(', '),
      (v.rolesOffered || []).map(r => `${r.roleTitle} (${r.ctcLpa}L)`).join(', '),
      v.offersCount != null ? v.offersCount.toString() : '-',
      v.status
    ]);
    exportToPDF('Companies Visited & Recruitment Drives (ET Departments)', headers, rows, `ET_Companies_Visited_${selectedAy}`);
    showToast('Exported filtered company visits to PDF.');
  };

  const isAdminOrSuper = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';

  return (
    <MotionPage style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <ModulePageHeader
        breadcrumbs={[
          { label: 'Dashboard' },
          { label: 'Placements & Career' },
          { label: 'Companies Visited' }
        ]}
        title="Companies Visited"
        subtitle="Recruitment drives, hiring schedules, corporate partner visits, and selection rounds for ET cohorts."
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        primaryAction={{
          label: 'Record Company Drive',
          icon: Plus,
          onClick: handleOpenCreate
        }}
      />

      {/* KPI Grid */}
      <AnimatedKpiGrid>
        <MotionKpiCard
          label="Unique Companies"
          value={stats.uniqueCompanies}
          subtext="Corporate Employers"
          icon={Building2}
          color="#3B82F6"
          bg="rgba(59, 130, 246, 0.1)"
          border="rgba(59, 130, 246, 0.25)"
        />
        <MotionKpiCard
          label="Total Drives"
          value={stats.totalVisits}
          subtext="Recruitment Events"
          icon={Briefcase}
          color="#10B981"
          bg="rgba(16, 185, 129, 0.1)"
          border="rgba(16, 185, 129, 0.25)"
        />
        <MotionKpiCard
          label="Active Drives"
          value={stats.activeDrives}
          subtext="Scheduled / Ongoing"
          icon={Clock}
          color="#F59E0B"
          bg="rgba(245, 158, 11, 0.1)"
          border="rgba(245, 158, 11, 0.25)"
        />
        <MotionKpiCard
          label="Total Offers"
          value={stats.totalOffers}
          subtext="Resulting from Drives"
          icon={Award}
          color="#8B5CF6"
          bg="rgba(139, 92, 246, 0.1)"
          border="rgba(139, 92, 246, 0.25)"
        />
      </AnimatedKpiGrid>

      {/* Filters Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        padding: '1rem 1.25rem',
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, sector, role..."
            style={{
              width: '100%',
              padding: '0.5rem 0.85rem 0.5rem 2.2rem',
              background: 'rgba(7, 15, 30, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: '#F8FAFC',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* Academic Year */}
        <select
          value={selectedAy}
          onChange={(e) => setSelectedAy(e.target.value)}
          style={{
            padding: '0.5rem 0.85rem',
            background: 'rgba(7, 15, 30, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            color: '#F8FAFC',
            fontSize: '0.85rem'
          }}
        >
          <option value="ALL">All Academic Years</option>
          <option value="2026-27">2026-27</option>
          <option value="2025-26">2025-26</option>
          <option value="2024-25">2024-25</option>
        </select>

        {/* Department Filter (Only ET) */}
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          disabled={currentUser?.role === 'HOD'}
          style={{
            padding: '0.5rem 0.85rem',
            background: 'rgba(7, 15, 30, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            color: '#F8FAFC',
            fontSize: '0.85rem'
          }}
        >
          <option value="ALL">All Eligible ET Depts</option>
          {ET_DEPARTMENTS.map(d => (
            <option key={d.code} value={d.code}>{d.name}</option>
          ))}
        </select>

        {/* Drive Type */}
        <select
          value={selectedDriveType}
          onChange={(e) => setSelectedDriveType(e.target.value)}
          style={{
            padding: '0.5rem 0.85rem',
            background: 'rgba(7, 15, 30, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            color: '#F8FAFC',
            fontSize: '0.85rem'
          }}
        >
          <option value="ALL">All Drive Types</option>
          <option value="On-Campus">On-Campus</option>
          <option value="Off-Campus">Off-Campus</option>
          <option value="Pool Campus">Pool Campus</option>
          <option value="Virtual">Virtual</option>
        </select>

        {/* Status */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: '0.5rem 0.85rem',
            background: 'rgba(7, 15, 30, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            color: '#F8FAFC',
            fontSize: '0.85rem'
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      {filteredVisits.length === 0 ? (
        <MotionEmptyState
          icon={Building2}
          title="No Companies Visited Recorded"
          description="No recruitment drives found matching the filter criteria."
          actionText="Record Recruitment Drive"
          onAction={handleOpenCreate}
        />
      ) : (
        <MotionTable
          headers={['Company & Sector', 'Drive Info', 'Eligible ET Branches', 'Roles Offered', 'Selection Results', 'Status', 'Actions']}
        >
          {filteredVisits.map(visit => (
            <MotionTableRow key={visit.id}>
              {/* Company */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700 }}>
                    {visit.companyName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {visit.sector} • {visit.companyType}
                  </span>
                </div>
              </td>

              {/* Drive Info */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#CBD5E1' }}>
                    <Calendar size={13} style={{ color: '#60A5FA' }} />
                    {visit.visitDate}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {visit.driveType} ({visit.mode})
                  </span>
                </div>
              </td>

              {/* Eligible Branches */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {(visit.eligibleDepartments || []).map(d => (
                    <span
                      key={d}
                      style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60A5FA'
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </td>

              {/* Roles */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  {(visit.rolesOffered || []).map((r, i) => (
                    <span key={i} style={{ fontSize: '0.82rem', color: '#F1F5F9', fontWeight: 600 }}>
                      {r.roleTitle} {r.ctcLpa ? `(${r.ctcLpa} LPA)` : ''}
                    </span>
                  ))}
                </div>
              </td>

              {/* Selection Results */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#A7F3D0', fontWeight: 700 }}>
                    {visit.offersCount != null ? `${visit.offersCount} Offers` : 'Results Pending'}
                  </span>
                  {visit.selectedCount != null && (
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                      {visit.selectedCount} Students Selected
                    </span>
                  )}
                </div>
              </td>

              {/* Status */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: visit.status === 'Completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: visit.status === 'Completed' ? '#34D399' : '#FBBF24'
                }}>
                  {visit.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {visit.status}
                </span>
              </td>

              {/* Actions */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    onClick={() => setDetailVisit(visit)}
                    title="View Details"
                    style={{ padding: '0.35rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', cursor: 'pointer' }}
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(visit)}
                    title="Edit Drive"
                    style={{ padding: '0.35rem', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#60A5FA', cursor: 'pointer' }}
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmVisit(visit)}
                    title="Delete Drive"
                    style={{ padding: '0.35rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#F87171', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </MotionTableRow>
          ))}
        </MotionTable>
      )}

      {/* Wizard Modal */}
      {wizardOpen && (
        <MotionModal
          isOpen={wizardOpen}
          onClose={() => setWizardOpen(false)}
          title={editingVisit ? `Edit Drive: ${formData.companyName}` : 'Record Company Recruitment Drive'}
        >
          <form onSubmit={handleSaveVisit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Company Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="e.g. Infosys, TCS, Cognizant, Cisco"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Company Type
                </label>
                <select
                  value={formData.companyType}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyType: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
                >
                  <option value="MNC">MNC</option>
                  <option value="Product">Product Company</option>
                  <option value="Service">Service Company</option>
                  <option value="Startup">Startup</option>
                  <option value="Core">Core Engineering</option>
                </select>
              </div>
            </div>

            {/* Grid 2: Date, Drive Type, Status, AY */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Drive Date</label>
                <input
                  type="date"
                  value={formData.visitDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
                  style={{ width: '100%', padding: '0.55rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Drive Type</label>
                <select
                  value={formData.driveType}
                  onChange={(e) => setFormData(prev => ({ ...prev, driveType: e.target.value }))}
                  style={{ width: '100%', padding: '0.55rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                >
                  <option value="On-Campus">On-Campus</option>
                  <option value="Off-Campus">Off-Campus</option>
                  <option value="Pool Campus">Pool Campus</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Drive Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  style={{ width: '100%', padding: '0.55rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Eligible ET Departments Checkboxes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                Eligible Emerging Technologies Departments
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {ET_DEPARTMENTS.map(d => (
                  <label key={d.code} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#E2E8F0', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.eligibleDepartments.includes(d.code)}
                      onChange={() => handleToggleDept(d.code)}
                    />
                    {d.code}
                  </label>
                ))}
              </div>
            </div>

            {/* Role & Package */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Role Title</label>
                <input
                  type="text"
                  value={formData.roleTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, roleTitle: e.target.value }))}
                  placeholder="e.g. Associate Software Engineer"
                  style={{ width: '100%', padding: '0.55rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>CTC (LPA)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.ctcLpa}
                  onChange={(e) => setFormData(prev => ({ ...prev, ctcLpa: e.target.value }))}
                  placeholder="e.g. 7.5"
                  style={{ width: '100%', padding: '0.55rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
            </div>

            {/* Counts: Eligible, Selected, Offers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.2rem' }}>Eligible</label>
                <input
                  type="number"
                  value={formData.eligibleCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, eligibleCount: e.target.value }))}
                  placeholder="Count"
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.2rem' }}>Attended</label>
                <input
                  type="number"
                  value={formData.attendedCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, attendedCount: e.target.value }))}
                  placeholder="Count"
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.2rem' }}>Selected</label>
                <input
                  type="number"
                  value={formData.selectedCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, selectedCount: e.target.value }))}
                  placeholder="Count"
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.2rem' }}>Total Offers</label>
                <input
                  type="number"
                  value={formData.offersCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, offersCount: e.target.value }))}
                  placeholder="Count"
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <MotionButton type="button" variant="outline" onClick={() => setWizardOpen(false)}>
                Cancel
              </MotionButton>
              <MotionButton type="submit" variant="primary">
                {editingVisit ? 'Save Changes' : 'Record Drive'}
              </MotionButton>
            </div>
          </form>
        </MotionModal>
      )}

      {/* Detail Dossier Modal */}
      {detailVisit && (
        <MotionModal
          isOpen={!!detailVisit}
          onClose={() => setDetailVisit(null)}
          title={`Drive Details: ${detailVisit.companyName}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700 }}>{detailVisit.sector} • {detailVisit.companyType}</span>
                <h3 style={{ fontSize: '1.25rem', color: '#FFF', fontWeight: 700 }}>{detailVisit.companyName}</h3>
              </div>
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.8rem', fontWeight: 700 }}>
                {detailVisit.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', padding: '1rem', background: 'rgba(7, 15, 30, 0.6)', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Drive Date</span>
                <p style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 600 }}>{detailVisit.visitDate}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Format / Mode</span>
                <p style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 600 }}>{detailVisit.driveType} ({detailVisit.mode})</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Offers Issued</span>
                <p style={{ fontSize: '0.9rem', color: '#34D399', fontWeight: 700 }}>{detailVisit.offersCount != null ? detailVisit.offersCount : 'Pending'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Eligible Branches</span>
                <p style={{ fontSize: '0.9rem', color: '#60A5FA', fontWeight: 600 }}>{(detailVisit.eligibleDepartments || []).join(', ')}</p>
              </div>
            </div>

            {/* Roles */}
            <div>
              <h4 style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 700, marginBottom: '0.4rem' }}>Roles Offered</h4>
              {(detailVisit.rolesOffered || []).map((r, i) => (
                <div key={i} style={{ padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#FFF', fontWeight: 600 }}>{r.roleTitle}</span>
                  <span style={{ color: '#F1C40F', fontWeight: 700 }}>{r.ctcLpa} LPA</span>
                </div>
              ))}
            </div>
          </div>
        </MotionModal>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmVisit && (
        <ConfirmDeleteDialog
          isOpen={!!deleteConfirmVisit}
          title="Delete Company Recruitment Drive"
          message={`Are you sure you want to delete the drive record for "${deleteConfirmVisit.companyName}" on ${deleteConfirmVisit.visitDate}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmVisit(null)}
        />
      )}

      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          padding: '0.75rem 1.25rem',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: '8px',
          color: '#F8FAFC',
          fontSize: '0.88rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 9999
        }}>
          {toastMessage}
        </div>
      )}
    </MotionPage>
  );
}

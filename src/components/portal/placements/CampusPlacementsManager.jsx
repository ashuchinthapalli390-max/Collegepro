import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Building2, 
  UserCheck, 
  Users, 
  TrendingUp, 
  ExternalLink, 
  DollarSign, 
  Calendar,
  X,
  Sparkles
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
} from '../motion/index.js';
import { ET_DEPARTMENTS } from '../../data/masterData.js';
import { 
  getCampusPlacements, 
  saveCampusPlacement, 
  deleteCampusPlacement,
  getStudents,
  exportToCSV,
  exportToPDF
} from '../../data/portalStore.js';
import ConfirmDeleteDialog from '../common/ConfirmDeleteDialog.jsx';

export default function CampusPlacementsManager({ currentUser, onDataChange }) {
  const [dataVersion, setDataVersion] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAy, setSelectedAy] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState(
    currentUser?.role === 'HOD' ? (currentUser.dept || 'ALL') : 'ALL'
  );
  const [selectedOfferType, setSelectedOfferType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal states
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [detailOffer, setDetailOffer] = useState(null);
  const [deleteConfirmOffer, setDeleteConfirmOffer] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const placementsList = useMemo(() => {
    return getCampusPlacements();
  }, [dataVersion]);

  const studentsMaster = useMemo(() => {
    return getStudents();
  }, []);

  // Filtered Placements
  const filteredPlacements = useMemo(() => {
    return placementsList.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        p.studentName.toLowerCase().includes(q) ||
        p.studentRoll.toLowerCase().includes(q) ||
        p.companyName.toLowerCase().includes(q) ||
        (p.role || '').toLowerCase().includes(q)
      );

      const matchesAy = selectedAy === 'ALL' || p.academicYear === selectedAy;
      const matchesDept = selectedDept === 'ALL' || p.department === selectedDept;
      const matchesOfferType = selectedOfferType === 'ALL' || p.offerType === selectedOfferType;
      const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;

      return matchesSearch && matchesAy && matchesDept && matchesOfferType && matchesStatus;
    });
  }, [placementsList, searchQuery, selectedAy, selectedDept, selectedOfferType, selectedStatus]);

  // Real KPIs (strictly calculated, no fake placeholders)
  const stats = useMemo(() => {
    const totalOffers = filteredPlacements.length;
    const uniqueStudents = new Set(filteredPlacements.map(p => p.studentRoll.trim().toUpperCase())).size;
    const hiringCompanies = new Set(filteredPlacements.map(p => p.companyName.trim().toLowerCase())).size;

    const validPackages = filteredPlacements
      .map(p => p.packageLpa)
      .filter(pkg => typeof pkg === 'number' && !isNaN(pkg) && pkg > 0);

    const highestPackage = validPackages.length > 0 ? Math.max(...validPackages) : 0;
    const avgPackage = validPackages.length > 0 
      ? (validPackages.reduce((a, b) => a + b, 0) / validPackages.length).toFixed(2)
      : 0;

    return {
      uniqueStudents,
      totalOffers,
      hiringCompanies,
      highestPackage: highestPackage > 0 ? `${highestPackage} LPA` : 'N/A',
      avgPackage: avgPackage > 0 ? `${avgPackage} LPA` : 'N/A'
    };
  }, [filteredPlacements]);

  // Form State
  const [formData, setFormData] = useState({
    studentRoll: '',
    studentName: '',
    department: currentUser?.role === 'HOD' ? (currentUser.dept || 'CYS') : 'CYS',
    academicYear: '2026-27',
    companyName: '',
    role: 'Cyber Security Analyst',
    offerType: 'Full-Time',
    packageLpa: '7.5',
    stipendMonthly: '',
    offerDate: new Date().toISOString().split('T')[0],
    status: 'OFFERED'
  });

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setFormData({
      studentRoll: '',
      studentName: '',
      department: currentUser?.role === 'HOD' ? (currentUser.dept || 'CYS') : 'CYS',
      academicYear: '2026-27',
      companyName: '',
      role: 'Associate Software Engineer',
      offerType: 'Full-Time',
      packageLpa: '6.5',
      stipendMonthly: '',
      offerDate: new Date().toISOString().split('T')[0],
      status: 'OFFERED'
    });
    setWizardOpen(true);
  };

  const handleOpenEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      ...offer,
      packageLpa: offer.packageLpa ? offer.packageLpa.toString() : ''
    });
    setWizardOpen(true);
  };

  const handleRollChange = (roll) => {
    const cleanRoll = roll.trim().toUpperCase();
    const found = studentsMaster.find(sm => sm.rollNumber.toUpperCase() === cleanRoll);
    setFormData(prev => ({
      ...prev,
      studentRoll: roll,
      studentName: found ? found.name : prev.studentName,
      department: found && found.department ? found.department : prev.department
    }));
  };

  const handleSavePlacement = (e) => {
    e.preventDefault();
    if (!formData.studentRoll.trim() || !formData.companyName.trim()) {
      showToast('Please provide Student Roll Number and Company Name.');
      return;
    }

    const payload = {
      ...formData,
      packageLpa: formData.packageLpa ? Number(formData.packageLpa) : null,
      stipendMonthly: formData.stipendMonthly ? Number(formData.stipendMonthly) : null
    };

    const saved = saveCampusPlacement(payload, currentUser);
    setDataVersion(v => v + 1);
    setWizardOpen(false);
    showToast(`Placement offer for "${saved.studentName}" at ${saved.companyName} recorded.`);
    if (onDataChange) onDataChange();
  };

  const handleDelete = () => {
    if (!deleteConfirmOffer) return;
    deleteCampusPlacement(deleteConfirmOffer.id);
    setDataVersion(v => v + 1);
    setDeleteConfirmOffer(null);
    showToast('Placement offer removed.');
    if (onDataChange) onDataChange();
  };

  const handleExportCSV = () => {
    const exportRows = filteredPlacements.map(p => ({
      'Roll Number': p.studentRoll,
      'Student Name': p.studentName,
      'Department': p.department,
      'Academic Year': p.academicYear,
      'Company Name': p.companyName,
      'Designation / Role': p.role,
      'Offer Type': p.offerType,
      'Package (LPA)': p.packageLpa != null ? p.packageLpa : 'N/A',
      'Offer Date': p.offerDate,
      'Status': p.status
    }));
    exportToCSV(exportRows, `ET_Campus_Placements_${selectedAy}`);
    showToast('Exported filtered placement records to CSV.');
  };

  const handleExportPDF = () => {
    const headers = ['Roll No', 'Student Name', 'Dept', 'Company', 'Role', 'Package', 'Status'];
    const rows = filteredPlacements.map(p => [
      p.studentRoll,
      p.studentName,
      p.department,
      p.companyName,
      p.role,
      p.packageLpa != null ? `${p.packageLpa} LPA` : '-',
      p.status
    ]);
    exportToPDF('Campus Placements Report (Emerging Technologies)', headers, rows, `ET_Placements_${selectedAy}`);
    showToast('Exported filtered placement records to PDF.');
  };

  return (
    <MotionPage style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <ModulePageHeader
        badge="Placements & Career"
        badgeIcon={Award}
        title="Campus Placements"
        description="Student placement outcomes, enterprise offers, salary packages, and career milestone tracking."
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MotionButton
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export CSV
            </MotionButton>
            <MotionButton
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExportPDF}
            >
              Export PDF
            </MotionButton>
            <MotionButton
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={handleOpenCreate}
            >
              Record Placement Offer
            </MotionButton>
          </div>
        }
      />

      {/* KPI Summary Grid */}
      <AnimatedKpiGrid>
        <MotionKpiCard
          title="Students Placed"
          value={stats.uniqueStudents}
          subtext="Unique ET Students"
          icon={UserCheck}
          color="#10B981"
          bg="rgba(16, 185, 129, 0.1)"
          border="rgba(16, 185, 129, 0.25)"
        />
        <MotionKpiCard
          title="Total Offers"
          value={stats.totalOffers}
          subtext="Offer Letters Issued"
          icon={Award}
          color="#3B82F6"
          bg="rgba(59, 130, 246, 0.1)"
          border="rgba(59, 130, 246, 0.25)"
        />
        <MotionKpiCard
          title="Highest Package"
          value={stats.highestPackage}
          subtext="Top Campus CTC"
          icon={DollarSign}
          color="#F59E0B"
          bg="rgba(245, 158, 11, 0.1)"
          border="rgba(245, 158, 11, 0.25)"
        />
        <MotionKpiCard
          title="Average Package"
          value={stats.avgPackage}
          subtext="Mean Cohort CTC"
          icon={TrendingUp}
          color="#8B5CF6"
          bg="rgba(139, 92, 246, 0.1)"
          border="rgba(139, 92, 246, 0.25)"
        />
      </AnimatedKpiGrid>

      {/* Filter Bar */}
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
            placeholder="Search student, roll, company, role..."
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
          <option value="ALL">All ET Departments</option>
          {ET_DEPARTMENTS.map(d => (
            <option key={d.code} value={d.code}>{d.name}</option>
          ))}
        </select>

        {/* Offer Type */}
        <select
          value={selectedOfferType}
          onChange={(e) => setSelectedOfferType(e.target.value)}
          style={{
            padding: '0.5rem 0.85rem',
            background: 'rgba(7, 15, 30, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            color: '#F8FAFC',
            fontSize: '0.85rem'
          }}
        >
          <option value="ALL">All Offer Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="FTE + Internship">FTE + Internship</option>
          <option value="Internship PPO">Internship PPO</option>
          <option value="Direct PPO">Direct PPO</option>
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
          <option value="OFFERED">Offered</option>
          <option value="SELECTED">Selected</option>
          <option value="JOINED">Joined</option>
          <option value="DECLINED">Declined</option>
        </select>
      </div>

      {/* Table */}
      {filteredPlacements.length === 0 ? (
        <MotionEmptyState
          icon={Award}
          title="No Campus Placement Records"
          description="No student placement offers match the active filters."
          actionText="Record Placement Offer"
          onAction={handleOpenCreate}
        />
      ) : (
        <MotionTable
          headers={['Student Info', 'Department', 'Company & Role', 'Package (LPA)', 'Offer Date', 'Status', 'Actions']}
        >
          {filteredPlacements.map(placement => (
            <MotionTableRow key={placement.id}>
              {/* Student Info */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 700 }}>
                    {placement.studentRoll}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600 }}>
                    {placement.studentName}
                  </span>
                </div>
              </td>

              {/* Department */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <span style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#60A5FA'
                }}>
                  {placement.department}
                </span>
              </td>

              {/* Company & Role */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 700 }}>
                    {placement.companyName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {placement.role} ({placement.offerType})
                  </span>
                </div>
              </td>

              {/* Package */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#F1C40F', fontWeight: 700 }}>
                  {placement.packageLpa != null ? `${placement.packageLpa} LPA` : 'Unspecified'}
                </span>
              </td>

              {/* Date */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                  {placement.offerDate}
                </span>
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
                  background: ['JOINED', 'OFFERED', 'SELECTED'].includes(placement.status) ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: ['JOINED', 'OFFERED', 'SELECTED'].includes(placement.status) ? '#34D399' : '#FBBF24'
                }}>
                  <CheckCircle2 size={12} />
                  {placement.status}
                </span>
              </td>

              {/* Actions */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    onClick={() => setDetailOffer(placement)}
                    title="View Details"
                    style={{ padding: '0.35rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', cursor: 'pointer' }}
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(placement)}
                    title="Edit Offer"
                    style={{ padding: '0.35rem', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#60A5FA', cursor: 'pointer' }}
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmOffer(placement)}
                    title="Delete Offer"
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
          title={editingOffer ? `Edit Placement: ${formData.studentRoll}` : 'Record Student Placement Offer'}
        >
          <form onSubmit={handleSavePlacement} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem' }}>
            {/* Student Roll & Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Student Roll Number <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentRoll}
                  onChange={(e) => handleRollChange(e.target.value)}
                  placeholder="e.g. 23CYS001"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Student Full Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                  placeholder="Student Name"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {/* Dept, Academic Year */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Department <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
                >
                  {ET_DEPARTMENTS.map(d => (
                    <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Academic Year
                </label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
                >
                  <option value="2026-27">2026-27</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                </select>
              </div>
            </div>

            {/* Company Name & Role */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Company Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="e.g. Amazon, Cisco, Accenture"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g. Associate Security Engineer"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {/* Package & Offer Type */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Package (LPA)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.packageLpa}
                  onChange={(e) => setFormData(prev => ({ ...prev, packageLpa: e.target.value }))}
                  placeholder="e.g. 8.5"
                  style={{ width: '100%', padding: '0.55rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Offer Type</label>
                <select
                  value={formData.offerType}
                  onChange={(e) => setFormData(prev => ({ ...prev, offerType: e.target.value }))}
                  style={{ width: '100%', padding: '0.55rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="FTE + Internship">FTE + Internship</option>
                  <option value="Internship PPO">Internship PPO</option>
                  <option value="Direct PPO">Direct PPO</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Offer Date</label>
                <input
                  type="date"
                  value={formData.offerDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, offerDate: e.target.value }))}
                  style={{ width: '100%', padding: '0.55rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  style={{ width: '100%', padding: '0.55rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                >
                  <option value="OFFERED">Offered</option>
                  <option value="SELECTED">Selected</option>
                  <option value="JOINED">Joined</option>
                  <option value="DECLINED">Declined</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <MotionButton type="button" variant="outline" onClick={() => setWizardOpen(false)}>
                Cancel
              </MotionButton>
              <MotionButton type="submit" variant="primary">
                {editingOffer ? 'Save Changes' : 'Record Offer'}
              </MotionButton>
            </div>
          </form>
        </MotionModal>
      )}

      {/* Detail Dossier Modal */}
      {detailOffer && (
        <MotionModal
          isOpen={!!detailOffer}
          onClose={() => setDetailOffer(null)}
          title={`Placement Offer: ${detailOffer.studentRoll}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 700 }}>{detailOffer.studentRoll} • {detailOffer.department}</span>
                <h3 style={{ fontSize: '1.25rem', color: '#FFF', fontWeight: 700 }}>{detailOffer.studentName}</h3>
              </div>
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.8rem', fontWeight: 700 }}>
                {detailOffer.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', padding: '1rem', background: 'rgba(7, 15, 30, 0.6)', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Company</span>
                <p style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 700 }}>{detailOffer.companyName}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Role / Designation</span>
                <p style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 600 }}>{detailOffer.role}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Salary Package</span>
                <p style={{ fontSize: '0.95rem', color: '#F1C40F', fontWeight: 700 }}>{detailOffer.packageLpa != null ? `${detailOffer.packageLpa} LPA` : 'N/A'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Offer Date</span>
                <p style={{ fontSize: '0.9rem', color: '#CBD5E1', fontWeight: 600 }}>{detailOffer.offerDate}</p>
              </div>
            </div>
          </div>
        </MotionModal>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmOffer && (
        <ConfirmDeleteDialog
          isOpen={!!deleteConfirmOffer}
          title="Delete Placement Offer"
          message={`Are you sure you want to delete the placement offer for "${deleteConfirmOffer.studentName}" at ${deleteConfirmOffer.companyName}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmOffer(null)}
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

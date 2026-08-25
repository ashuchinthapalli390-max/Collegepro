import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartHandshake, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  Building2, 
  Calendar, 
  FileText, 
  Layers, 
  ExternalLink, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  X,
  UploadCloud,
  Check,
  Award
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
  getCommunityProjects, 
  saveCommunityProject, 
  deleteCommunityProject,
  getStudents,
  exportToCSV,
  exportToPDF
} from '../../../data/portalStore.js';
import ConfirmDeleteDialog from '../common/ConfirmDeleteDialog.jsx';

export default function CommunityServiceProjectsManager({ currentUser, onDataChange }) {
  const [dataVersion, setDataVersion] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState(
    currentUser?.role === 'HOD' ? (currentUser.dept || 'ALL') : 'ALL'
  );
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedWorkflowStatus, setSelectedWorkflowStatus] = useState('ALL');

  // Wizard Modal State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // Detail Dossier Modal State
  const [detailProject, setDetailProject] = useState(null);
  
  // Delete Dialog State
  const [deleteConfirmProject, setDeleteConfirmProject] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live Data
  const projectsList = useMemo(() => {
    return getCommunityProjects();
  }, [dataVersion]);

  const studentsMaster = useMemo(() => {
    return getStudents();
  }, []);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projectsList.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        p.title.toLowerCase().includes(q) ||
        p.projectNumber.toLowerCase().includes(q) ||
        (p.community || '').toLowerCase().includes(q) ||
        (p.facultyGuideName || '').toLowerCase().includes(q) ||
        (p.students || []).some(s => s.studentName.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q))
      );

      const matchesDept = selectedDept === 'ALL' || p.department === selectedDept;
      const matchesYear = selectedYear === 'ALL' || p.year === selectedYear;
      const matchesSem = selectedSemester === 'ALL' || p.semester === selectedSemester;
      const matchesSec = selectedSection === 'ALL' || p.section === selectedSection;
      const matchesType = selectedType === 'ALL' || p.projectType === selectedType;
      const matchesStage = selectedStage === 'ALL' || p.stage === selectedStage;
      const matchesStatus = selectedWorkflowStatus === 'ALL' || p.workflowStatus === selectedWorkflowStatus;

      return matchesSearch && matchesDept && matchesYear && matchesSem && matchesSec && matchesType && matchesStage && matchesStatus;
    });
  }, [projectsList, searchQuery, selectedDept, selectedYear, selectedSemester, selectedSection, selectedType, selectedStage, selectedWorkflowStatus]);

  // Real KPIs (strictly calculated from canonical data, no fake metrics)
  const stats = useMemo(() => {
    const total = filteredProjects.length;
    const active = filteredProjects.filter(p => p.stage === 'ACTIVE').length;
    const completed = filteredProjects.filter(p => p.stage === 'COMPLETED').length;
    
    // Unique participating students
    const participatingRolls = new Set();
    filteredProjects.forEach(p => {
      (p.students || []).forEach(s => {
        if (s.rollNumber) participatingRolls.add(s.rollNumber);
      });
    });

    return {
      total,
      active,
      completed,
      studentsCount: participatingRolls.size
    };
  }, [filteredProjects]);

  // Wizard Form State
  const [formData, setFormData] = useState({
    title: '',
    department: currentUser?.role === 'HOD' ? (currentUser.dept || 'CYS') : 'CYS',
    academicYear: '2026-27',
    year: 'III',
    semester: 'III-I',
    section: 'A',
    batch: '2023-2027',
    projectType: 'Rural Field Survey',
    community: '',
    partnerOrganization: '',
    startDate: '',
    endDate: '',
    durationWeeks: 4,
    facultyGuideName: '',
    facultyGuideDesignation: 'Assistant Professor',
    objective: '',
    activities: '',
    findings: '',
    outcomes: '',
    recommendations: '',
    beneficiaryType: '',
    beneficiaryCount: '',
    stage: 'ACTIVE',
    workflowStatus: 'DRAFT',
    students: []
  });

  const [studentInputRoll, setStudentInputRoll] = useState('');

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      department: currentUser?.role === 'HOD' ? (currentUser.dept || 'CYS') : 'CYS',
      academicYear: '2026-27',
      year: 'III',
      semester: 'III-I',
      section: 'A',
      batch: '2023-2027',
      projectType: 'Rural Field Survey',
      community: '',
      partnerOrganization: '',
      startDate: '',
      endDate: '',
      durationWeeks: 4,
      facultyGuideName: '',
      facultyGuideDesignation: 'Assistant Professor',
      objective: '',
      activities: '',
      findings: '',
      outcomes: '',
      recommendations: '',
      beneficiaryType: '',
      beneficiaryCount: '',
      stage: 'ACTIVE',
      workflowStatus: 'DRAFT',
      students: []
    });
    setWizardOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({ ...project });
    setWizardOpen(true);
  };

  const handleAddStudent = () => {
    if (!studentInputRoll.trim()) return;
    const cleanRoll = studentInputRoll.trim().toUpperCase();
    
    // Check if already in list
    if (formData.students.some(s => s.rollNumber.toUpperCase() === cleanRoll)) {
      showToast('Student already added to this project.');
      return;
    }

    // Lookup in Student Master
    const found = studentsMaster.find(sm => sm.rollNumber.toUpperCase() === cleanRoll);
    if (!found) {
      showToast(`Student roll "${cleanRoll}" not found in Student Master. Please verify the roll number.`);
      return;
    }

    const newStudent = {
      rollNumber: cleanRoll,
      studentName: found.name || found.fullName || cleanRoll,
      department: found.department || formData.department,
      isLeader: formData.students.length === 0
    };

    setFormData(prev => ({
      ...prev,
      students: [...prev.students, newStudent]
    }));
    setStudentInputRoll('');
  };

  const handleRemoveStudent = (idx) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.filter((_, i) => i !== idx)
    }));
  };

  const handleToggleLeader = (idx) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.map((s, i) => ({
        ...s,
        isLeader: i === idx
      }))
    }));
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter the Project Title.');
      return;
    }
    if (!formData.department) {
      showToast('Please select a valid ET Department.');
      return;
    }

    const saved = saveCommunityProject(formData, currentUser);
    setDataVersion(v => v + 1);
    setWizardOpen(false);
    showToast(`Community Service Project "${saved.title}" saved successfully.`);
    if (onDataChange) onDataChange();
  };

  const handleDelete = () => {
    if (!deleteConfirmProject) return;
    deleteCommunityProject(deleteConfirmProject.id);
    setDataVersion(v => v + 1);
    setDeleteConfirmProject(null);
    showToast('Project removed successfully.');
    if (onDataChange) onDataChange();
  };

  const handleExportCSV = () => {
    const exportRows = filteredProjects.map(p => ({
      'Project Number': p.projectNumber,
      'Project Title': p.title,
      'Department': p.department,
      'Academic Year': p.academicYear,
      'Year & Sem': `${p.year} - ${p.semester} (${p.section})`,
      'Project Type': p.projectType,
      'Location / Community': p.community,
      'Faculty Guide': p.facultyGuideName || 'N/A',
      'Student Count': (p.students || []).length,
      'Student Leader': (p.students || []).find(s => s.isLeader)?.studentName || 'N/A',
      'Stage': p.stage,
      'Status': p.workflowStatus
    }));
    exportToCSV(exportRows, `ET_Community_Service_Projects_${selectedDept}`);
    showToast('Exported filtered projects to CSV.');
  };

  const handleExportPDF = () => {
    const headers = ['Project No.', 'Title', 'Dept', 'Year/Sem', 'Type', 'Community', 'Students', 'Stage'];
    const rows = filteredProjects.map(p => [
      p.projectNumber,
      p.title,
      p.department,
      `${p.year}-${p.semester} (${p.section})`,
      p.projectType,
      p.community,
      (p.students || []).length.toString(),
      p.stage
    ]);
    exportToPDF('Community Service Projects Report (ET Departments)', headers, rows, `ET_Community_Service_${selectedDept}`);
    showToast('Exported filtered projects to PDF.');
  };

  return (
    <MotionPage style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <ModulePageHeader
        breadcrumbs={[
          { label: 'Dashboard' },
          { label: 'Student Development' },
          { label: 'Community Service Projects' }
        ]}
        title="Community Service Projects"
        subtitle="Field outreach, community problem-solving, and societal impact initiatives conducted by ET students."
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        primaryAction={{
          label: 'Add Project',
          icon: Plus,
          onClick: handleOpenCreate
        }}
      />

      {/* KPI Summary Grid */}
      <AnimatedKpiGrid>
        <MotionKpiCard
          label="Total Projects"
          value={stats.total}
          subtext="ET Community Initiatives"
          icon={HeartHandshake}
          color="#3B82F6"
          bg="rgba(59, 130, 246, 0.1)"
          border="rgba(59, 130, 246, 0.25)"
        />
        <MotionKpiCard
          label="Active Projects"
          value={stats.active}
          subtext="In Progress in Community"
          icon={Clock}
          color="#F59E0B"
          bg="rgba(245, 158, 11, 0.1)"
          border="rgba(245, 158, 11, 0.25)"
        />
        <MotionKpiCard
          label="Completed Projects"
          value={stats.completed}
          subtext="Evaluated & Documented"
          icon={CheckCircle2}
          color="#10B981"
          bg="rgba(16, 185, 129, 0.1)"
          border="rgba(16, 185, 129, 0.25)"
        />
        <MotionKpiCard
          label="Participating Students"
          value={stats.studentsCount}
          subtext="Enrolled in Projects"
          icon={Users}
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
            placeholder="Search title, community, guide, roll..."
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

        {/* Year */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{
            padding: '0.5rem 0.85rem',
            background: 'rgba(7, 15, 30, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            color: '#F8FAFC',
            fontSize: '0.85rem'
          }}
        >
          <option value="ALL">All Years</option>
          <option value="I">Year I</option>
          <option value="II">Year II</option>
          <option value="III">Year III</option>
          <option value="IV">Year IV</option>
        </select>

        {/* Section */}
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          style={{
            padding: '0.5rem 0.85rem',
            background: 'rgba(7, 15, 30, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            color: '#F8FAFC',
            fontSize: '0.85rem'
          }}
        >
          <option value="ALL">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
          <option value="C">Section C</option>
          <option value="D">Section D</option>
        </select>

        {/* Stage */}
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          style={{
            padding: '0.5rem 0.85rem',
            background: 'rgba(7, 15, 30, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            color: '#F8FAFC',
            fontSize: '0.85rem'
          }}
        >
          <option value="ALL">All Stages</option>
          <option value="PLANNED">Planned</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Projects Table */}
      {filteredProjects.length === 0 ? (
        <MotionEmptyState
          icon={HeartHandshake}
          title="No Community Service Projects Found"
          description="No community projects match the active filters or search criteria."
          actionText="Create Project"
          onAction={handleOpenCreate}
        />
      ) : (
        <MotionTable
          headers={['Project Details', 'Department & Cohort', 'Location / Partner', 'Faculty Guide', 'Students', 'Stage', 'Actions']}
        >
          {filteredProjects.map(project => (
            <MotionTableRow key={project.id}>
              {/* Details */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.5px' }}>
                    {project.projectNumber}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600, lineHeight: 1.3 }}>
                    {project.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {project.projectType} • {project.academicYear}
                  </span>
                </div>
              </td>

              {/* Department & Cohort */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'rgba(59, 130, 246, 0.15)',
                    color: '#60A5FA',
                    width: 'fit-content'
                  }}>
                    {project.department}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                    Year {project.year} - Sem {project.semester} ({project.section})
                  </span>
                </div>
              </td>

              {/* Location & Partner */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#E2E8F0' }}>
                    <MapPin size={13} style={{ color: '#F59E0B' }} />
                    {project.community || 'Local Area'}
                  </span>
                  {project.partnerOrganization && (
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      Partner: {project.partnerOrganization}
                    </span>
                  )}
                </div>
              </td>

              {/* Faculty Guide */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#F1F5F9', fontWeight: 600 }}>
                    {project.facultyGuideName || 'Not Assigned'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {project.facultyGuideDesignation}
                  </span>
                </div>
              </td>

              {/* Students */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#A7F3D0', fontWeight: 600 }}>
                    {(project.students || []).length} Students
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Leader: {(project.students || []).find(s => s.isLeader)?.studentName || 'None'}
                  </span>
                </div>
              </td>

              {/* Stage */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: project.stage === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: project.stage === 'COMPLETED' ? '#34D399' : '#FBBF24'
                }}>
                  {project.stage === 'COMPLETED' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {project.stage}
                </span>
              </td>

              {/* Actions */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    onClick={() => setDetailProject(project)}
                    title="View Details"
                    style={{
                      padding: '0.35rem',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#94A3B8',
                      cursor: 'pointer'
                    }}
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(project)}
                    title="Edit Project"
                    style={{
                      padding: '0.35rem',
                      borderRadius: '6px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      color: '#60A5FA',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmProject(project)}
                    title="Delete Project"
                    style={{
                      padding: '0.35rem',
                      borderRadius: '6px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#F87171',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </MotionTableRow>
          ))}
        </MotionTable>
      )}

      {/* Add / Edit Wizard Modal */}
      {wizardOpen && (
        <MotionModal
          isOpen={wizardOpen}
          onClose={() => setWizardOpen(false)}
          title={editingProject ? `Edit Project: ${formData.projectNumber}` : 'Create Community Service Project'}
        >
          <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                Project Title <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Cyber Safety Awareness Campaign in Yellamanda High School"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  background: 'rgba(7, 15, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            {/* Grid 1: Dept, Academic Year, Type, Stage */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Department <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(7, 15, 30, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem'
                  }}
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
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(7, 15, 30, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem'
                  }}
                >
                  <option value="2026-27">2026-27</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Project Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(7, 15, 30, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem'
                  }}
                >
                  <option value="Awareness Campaign">Awareness Campaign</option>
                  <option value="Rural Field Survey">Rural Field Survey</option>
                  <option value="Digital Literacy">Digital Literacy</option>
                  <option value="Health & Hygiene">Health & Hygiene</option>
                  <option value="Environmental Sustainability">Environmental Sustainability</option>
                  <option value="School Outreach">School Outreach</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Operational Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(7, 15, 30, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem'
                  }}
                >
                  <option value="PLANNED">Planned</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            {/* Grid 2: Cohort details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.25rem' }}>Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                >
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.25rem' }}>Semester</label>
                <input
                  type="text"
                  value={formData.semester}
                  onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                  placeholder="e.g. III-I"
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.25rem' }}>Section</label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.25rem' }}>Batch</label>
                <input
                  type="text"
                  value={formData.batch}
                  onChange={(e) => setFormData(prev => ({ ...prev, batch: e.target.value }))}
                  placeholder="2023-2027"
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
            </div>

            {/* Location & Guide */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Target Location / Community
                </label>
                <input
                  type="text"
                  value={formData.community}
                  onChange={(e) => setFormData(prev => ({ ...prev, community: e.target.value }))}
                  placeholder="e.g. Yellamanda Village / Narasaraopet Municipal School"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Faculty Guide Name
                </label>
                <input
                  type="text"
                  value={formData.facultyGuideName}
                  onChange={(e) => setFormData(prev => ({ ...prev, facultyGuideName: e.target.value }))}
                  placeholder="e.g. Dr. K. Ramesh"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFF' }}
                />
              </div>
            </div>

            {/* Student Linkage Section */}
            <div style={{
              padding: '1rem',
              background: 'rgba(7, 15, 30, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F1C40F' }}>
                  Student Team ({formData.students.length} added)
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  Linked to Student Master
                </span>
              </div>

              {/* Add input */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={studentInputRoll}
                  onChange={(e) => setStudentInputRoll(e.target.value)}
                  placeholder="Enter Student Roll No (e.g. 23CYS001)"
                  style={{ flex: 1, padding: '0.5rem 0.75rem', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFF', fontSize: '0.85rem' }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddStudent(); } }}
                />
                <button
                  type="button"
                  onClick={handleAddStudent}
                  style={{ padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '6px', color: '#60A5FA', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Add Student
                </button>
              </div>

              {/* Student list tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {formData.students.map((s, idx) => (
                  <div
                    key={s.rollNumber}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.3rem 0.6rem',
                      background: s.isLeader ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      border: s.isLeader ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      color: s.isLeader ? '#FDE047' : '#E2E8F0'
                    }}
                  >
                    <span>{s.rollNumber} - {s.studentName}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleLeader(idx)}
                      title={s.isLeader ? 'Leader' : 'Set as Leader'}
                      style={{ background: 'none', border: 'none', color: s.isLeader ? '#FDE047' : '#64748B', cursor: 'pointer', padding: 0 }}
                    >
                      ★
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(idx)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0 }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative Objectives & Outcomes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Objectives / Problem Statement
                </label>
                <textarea
                  rows={3}
                  value={formData.objective}
                  onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                  placeholder="Describe the societal issue addressed..."
                  style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Outcomes & Impact
                </label>
                <textarea
                  rows={3}
                  value={formData.outcomes}
                  onChange={(e) => setFormData(prev => ({ ...prev, outcomes: e.target.value }))}
                  placeholder="Key deliverables, awareness metrics, community feedback..."
                  style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(7, 15, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <MotionButton
                type="button"
                variant="outline"
                onClick={() => setWizardOpen(false)}
              >
                Cancel
              </MotionButton>
              <MotionButton
                type="submit"
                variant="primary"
              >
                {editingProject ? 'Save Changes' : 'Create Project'}
              </MotionButton>
            </div>
          </form>
        </MotionModal>
      )}

      {/* Detail Dossier Modal */}
      {detailProject && (
        <MotionModal
          isOpen={!!detailProject}
          onClose={() => setDetailProject(null)}
          title={`Project Dossier: ${detailProject.projectNumber}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 700 }}>
                {detailProject.projectType} • {detailProject.academicYear}
              </span>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 700, marginTop: '0.2rem' }}>
                {detailProject.title}
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', padding: '1rem', background: 'rgba(7, 15, 30, 0.6)', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Department</span>
                <p style={{ fontSize: '0.9rem', color: '#60A5FA', fontWeight: 700 }}>{detailProject.department}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Cohort</span>
                <p style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 600 }}>Year {detailProject.year} - Sem {detailProject.semester} ({detailProject.section})</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Location</span>
                <p style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 600 }}>{detailProject.community || 'Local Community'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Faculty Guide</span>
                <p style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 600 }}>{detailProject.facultyGuideName || 'N/A'}</p>
              </div>
            </div>

            {/* Students Team */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#CBD5E1', fontWeight: 700, marginBottom: '0.5rem' }}>
                Participating Students ({(detailProject.students || []).length})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(detailProject.students || []).map(s => (
                  <span key={s.rollNumber} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: s.isLeader ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', color: s.isLeader ? '#FDE047' : '#E2E8F0', fontSize: '0.82rem' }}>
                    {s.rollNumber} - {s.studentName} {s.isLeader ? '★ (Leader)' : ''}
                  </span>
                ))}
              </div>
            </div>

            {/* Narrative */}
            {detailProject.objective && (
              <div>
                <h4 style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, marginBottom: '0.2rem' }}>Objective</h4>
                <p style={{ fontSize: '0.88rem', color: '#E2E8F0', lineHeight: 1.5 }}>{detailProject.objective}</p>
              </div>
            )}

            {detailProject.outcomes && (
              <div>
                <h4 style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, marginBottom: '0.2rem' }}>Outcomes & Feedback</h4>
                <p style={{ fontSize: '0.88rem', color: '#E2E8F0', lineHeight: 1.5 }}>{detailProject.outcomes}</p>
              </div>
            )}
          </div>
        </MotionModal>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmProject && (
        <ConfirmDeleteDialog
          isOpen={!!deleteConfirmProject}
          title="Delete Community Service Project"
          message={`Are you sure you want to delete "${deleteConfirmProject.title}" (${deleteConfirmProject.projectNumber})?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmProject(null)}
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

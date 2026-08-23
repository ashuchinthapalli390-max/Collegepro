import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Check, 
  Upload, 
  FileText, 
  Briefcase, 
  User, 
  Building2, 
  Calendar, 
  Clock, 
  Search, 
  AlertCircle, 
  Trash2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { DEPARTMENTS } from '../../../data/masterData.js';
import { 
  searchStudents, 
  saveInternship, 
  calculateInternshipDuration 
} from '../../../data/portalStore.js';
import FormField from '../../ui/form/FormField.jsx';
import { Input, DateInput, Select, Textarea } from '../../ui/form/FormControls.jsx';

const INTERNSHIP_TYPES = [
  'Long Term',
  'Short Term',
  'Summer Internship',
  'Winter Internship',
  'Research Internship',
  'Industry Internship',
  'Virtual Internship',
  'Other'
];

const ORGANIZATION_TYPES = [
  'Company',
  'Startup',
  'University',
  'Research Lab',
  'Government Organization',
  'NGO',
  'Other'
];

const INTERNSHIP_DOMAINS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Cyber Security',
  'Web Development',
  'Cloud Computing',
  'Embedded Systems',
  'VLSI & SoC',
  'Internet of Things (IoT)',
  'Mechanical Design & CAD',
  'Manufacturing & Automation',
  'Civil & Structural Engineering',
  'Power Systems & Solar',
  'Business Analytics / Management',
  'Other'
];

export default function StudentInternshipWizardModal({
  isOpen,
  onClose,
  initialData = null,
  currentUser,
  onSaved
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [unsavedConfirmOpen, setUnsavedConfirmOpen] = useState(false);
  const [rollSearchQuery, setRollSearchQuery] = useState('');
  const [rollSearchResults, setRollSearchResults] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        documents: initialData.documents || []
      };
    }

    const defaultDept = currentUser?.role === 'HOD' ? (currentUser.dept || 'CSE') : 'CSE';

    return {
      rollNumber: '',
      studentName: '',
      department: defaultDept,
      branch: defaultDept,
      year: 'III Year',
      semester: 'II Sem',
      batch: '2022-2026',
      academicYear: '2025-26',
      internshipType: 'Long Term',
      organization: '',
      organizationType: 'Company',
      organizationAddress: '',
      organizationWebsite: '',
      city: 'Hyderabad',
      mode: 'Hybrid',
      internshipTitle: '',
      domain: 'Cloud Computing',
      description: '',
      mentorName: '',
      mentorDesignation: '',
      mentorEmail: '',
      mentorPhone: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hasStipend: 'Yes',
      stipendAmount: 25000,
      stipendFrequency: 'Monthly',
      currency: 'INR',
      internshipStatus: 'Ongoing',
      documents: []
    };
  });

  // Auto duration
  const duration = calculateInternshipDuration(formData.startDate, formData.endDate);

  const handleRollSearch = (q) => {
    setRollSearchQuery(q);
    setFormData(prev => ({ ...prev, rollNumber: q }));
    if (q && q.trim().length >= 2) {
      const results = searchStudents(q);
      setRollSearchResults(results);
    } else {
      setRollSearchResults([]);
    }
  };

  const handleSelectStudent = (student) => {
    setFormData(prev => ({
      ...prev,
      rollNumber: student.rollNumber,
      studentName: student.name,
      department: student.department,
      branch: student.department,
      year: student.year,
      semester: student.semester,
      batch: student.batch,
      academicYear: student.academicYear || '2025-26'
    }));
    setRollSearchQuery(student.rollNumber);
    setRollSearchResults([]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc = {
      id: 'DOC-' + Date.now(),
      name: file.name,
      type: file.name.endsWith('.pdf') ? 'PDF' : 'Image',
      category: 'Offer Letter / Certificate',
      size: (file.size / 1024).toFixed(1) + ' KB',
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file)
    };

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDoc]
    }));
  };

  const handleRemoveDoc = (docId) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== docId)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.rollNumber) newErrors.rollNumber = 'Roll number is required';
      if (!formData.studentName) newErrors.studentName = 'Student name is required';
      if (!formData.department) newErrors.department = 'Department is required';
    } else if (step === 2) {
      if (!formData.organization) newErrors.organization = 'Organization name is required';
    } else if (step === 3) {
      if (!formData.internshipTitle) newErrors.internshipTitle = 'Internship title / role is required';
    } else if (step === 4) {
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.endDate) newErrors.endDate = 'End date is required';
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(5, prev + 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    const saved = saveInternship({
      ...formData,
      workflowStatus: 'DRAFT'
    }, currentUser);

    setTimeout(() => {
      setIsSavingDraft(false);
      setDraftSavedToast(true);
      if (onSaved) onSaved(saved);
      setTimeout(() => setDraftSavedToast(false), 2500);
    }, 400);
  };

  const [submitError, setSubmitError] = useState('');

  const handleSubmit = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      setSubmitError('Please fill all mandatory fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    const saved = saveInternship({
      ...formData,
      workflowStatus: 'SUBMITTED'
    }, currentUser);

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSaved) onSaved(saved);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 15, 30, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1rem'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          overflow: 'hidden'
        }}
      >
        {/* 1. Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 100%)',
          padding: '1.25rem 1.75rem',
          borderBottom: '2px solid #D4AF37',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#FFFFFF'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4AF37', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Briefcase size={14} /> Student Internships • Industry Ecosystem
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#FFFFFF', fontFamily: 'Cinzel, serif' }}>
              {initialData ? 'Edit Student Internship Record' : 'Record Student Internship'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setUnsavedConfirmOpen(true)}
            aria-label="Close"
            style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#94A3B8', borderRadius: '8px', padding: '0.45rem', cursor: 'pointer' }}
            className="hover:bg-white/20 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. 5-Step Stepper Header */}
        <div style={{
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          padding: '0.75rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {[
            { step: 1, label: 'Student Info' },
            { step: 2, label: 'Organization & Mode' },
            { step: 3, label: 'Role & Mentor' },
            { step: 4, label: 'Duration & Stipend' },
            { step: 5, label: 'Documents & Submit' }
          ].map((s) => {
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;
            return (
              <div
                key={s.step}
                onClick={() => isDone && setCurrentStep(s.step)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: isDone ? 'pointer' : 'default',
                  opacity: isActive ? 1 : (isDone ? 0.85 : 0.45)
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isActive ? '#070F1E' : (isDone ? '#10B981' : '#CBD5E1'),
                  color: isActive ? '#F1C40F' : '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isActive ? '2px solid #D4AF37' : 'none'
                }}>
                  {isDone ? <Check size={13} /> : s.step}
                </div>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0F172A' : '#64748B',
                  whiteSpace: 'nowrap'
                }}>
                  {s.label}
                </span>
                {s.step < 5 && <ChevronRight size={14} style={{ color: '#CBD5E1', marginLeft: '0.25rem' }} />}
              </div>
            );
          })}
        </div>

        {/* 3. Form Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          {submitError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{submitError}</span>
            </div>
          )}
          <AnimatePresence mode="wait">
            {/* ──────── STEP 1: STUDENT INFO ──────── */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}
              >
                <div style={{ position: 'relative' }}>
                  <FormField label="ROLL NUMBER *" description="Search student master by roll number" error={errors.rollNumber}>
                    <div style={{ position: 'relative' }}>
                      <Input
                        type="text"
                        placeholder="e.g. 21471A0512, 22471A0445"
                        value={formData.rollNumber}
                        onChange={(e) => handleRollSearch(e.target.value)}
                        error={!!errors.rollNumber}
                      />
                      <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    </div>
                  </FormField>

                  {rollSearchResults.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#FFFFFF',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                      border: '1px solid #D4AF37',
                      zIndex: 100,
                      maxHeight: '180px',
                      overflowY: 'auto',
                      marginTop: '4px'
                    }}>
                      {rollSearchResults.map(student => (
                        <div
                          key={student.rollNumber}
                          onClick={() => handleSelectStudent(student)}
                          style={{ padding: '0.55rem 0.85rem', borderBottom: '1px solid #F1F5F9', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                          className="hover:bg-slate-100"
                        >
                          <div>
                            <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>{student.rollNumber}</span>
                            <span style={{ color: '#64748B', fontSize: '0.78rem', marginLeft: '0.5rem' }}>{student.name}</span>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 600 }}>{student.department}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="STUDENT NAME *" error={errors.studentName}>
                    <Input
                      type="text"
                      placeholder="Student full name"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      error={!!errors.studentName}
                    />
                  </FormField>

                  <FormField label="DEPARTMENT / BRANCH *" error={errors.department}>
                    <Select
                      value={formData.department}
                      disabled={currentUser?.role === 'HOD'}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value, branch: e.target.value })}
                    >
                      {DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}
                    </Select>
                  </FormField>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                  <FormField label="YEAR OF STUDY">
                    <Select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option value="II Year">II Year</option>
                      <option value="III Year">III Year</option>
                      <option value="IV Year">IV Year</option>
                    </Select>
                  </FormField>

                  <FormField label="SEMESTER">
                    <Select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    >
                      <option value="I Sem">I Semester</option>
                      <option value="II Sem">II Semester</option>
                    </Select>
                  </FormField>

                  <FormField label="BATCH">
                    <Input
                      type="text"
                      placeholder="e.g. 2022-2026"
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    />
                  </FormField>

                  <FormField label="ACADEMIC YEAR">
                    <Select
                      value={formData.academicYear}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    >
                      <option value="2026-27">2026-27</option>
                      <option value="2025-26">2025-26</option>
                      <option value="2024-25">2024-25</option>
                    </Select>
                  </FormField>
                </div>
              </motion.div>
            )}

            {/* ──────── STEP 2: ORGANIZATION & MODE ──────── */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}
              >
                <FormField label="ORGANIZATION / COMPANY NAME *" error={errors.organization}>
                  <Input
                    type="text"
                    placeholder="e.g. Amazon Web Services (AWS) / Qualcomm / TCS"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    error={!!errors.organization}
                  />
                </FormField>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="ORGANIZATION TYPE">
                    <Select
                      value={formData.organizationType}
                      onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                    >
                      {ORGANIZATION_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                    </Select>
                  </FormField>

                  <FormField label="INTERNSHIP TYPE">
                    <Select
                      value={formData.internshipType}
                      onChange={(e) => setFormData({ ...formData, internshipType: e.target.value })}
                    >
                      {INTERNSHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                  </FormField>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <FormField label="MODE OF INTERNSHIP">
                    <Select
                      value={formData.mode}
                      onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    >
                      <option value="Offline">Offline (On-Site)</option>
                      <option value="Online">Online (Virtual)</option>
                      <option value="Hybrid">Hybrid</option>
                    </Select>
                  </FormField>

                  <FormField label="CITY / LOCATION">
                    <Input
                      type="text"
                      placeholder="e.g. Hyderabad / Bengaluru"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </FormField>

                  <FormField label="OFFICIAL WEBSITE">
                    <Input
                      type="text"
                      placeholder="https://company.com"
                      value={formData.organizationWebsite}
                      onChange={(e) => setFormData({ ...formData, organizationWebsite: e.target.value })}
                    />
                  </FormField>
                </div>
              </motion.div>
            )}

            {/* ──────── STEP 3: ROLE & MENTOR ──────── */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}
              >
                <FormField label="INTERNSHIP TITLE / DESIGNATION *" error={errors.internshipTitle}>
                  <Input
                    type="text"
                    placeholder="e.g. Cloud DevOps & Platform Engineering Intern"
                    value={formData.internshipTitle}
                    onChange={(e) => setFormData({ ...formData, internshipTitle: e.target.value })}
                    error={!!errors.internshipTitle}
                  />
                </FormField>

                <FormField label="TECHNICAL DOMAIN *">
                  <Select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  >
                    {INTERNSHIP_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </FormField>

                <div style={{ background: '#F8FAFC', padding: '1.1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                    INDUSTRY / EXTERNAL MENTOR DETAILS (OPTIONAL)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <Input
                      placeholder="Mentor Name (e.g. Mr. Rajesh Sharma)"
                      value={formData.mentorName}
                      onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                    />
                    <Input
                      placeholder="Mentor Designation (e.g. Lead Architect)"
                      value={formData.mentorDesignation}
                      onChange={(e) => setFormData({ ...formData, mentorDesignation: e.target.value })}
                    />
                    <Input
                      placeholder="Mentor Email"
                      value={formData.mentorEmail}
                      onChange={(e) => setFormData({ ...formData, mentorEmail: e.target.value })}
                    />
                    <Input
                      placeholder="Mentor Phone"
                      value={formData.mentorPhone}
                      onChange={(e) => setFormData({ ...formData, mentorPhone: e.target.value })}
                    />
                  </div>
                </div>

                <FormField label="WORK & PROJECT SUMMARY">
                  <Textarea
                    rows={2}
                    placeholder="Key responsibilities, tools utilized, and project deliverables..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </FormField>
              </motion.div>
            )}

            {/* ──────── STEP 4: DURATION & STIPEND ──────── */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="START DATE *" error={errors.startDate}>
                    <DateInput
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      error={!!errors.startDate}
                    />
                  </FormField>

                  <FormField label="END DATE *" error={errors.endDate}>
                    <DateInput
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      error={!!errors.endDate}
                    />
                  </FormField>
                </div>

                {/* Duration Auto Calculation Widget */}
                <div style={{
                  background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid #86EFAC',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={18} style={{ color: '#16A34A' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#14532D' }}>
                      Calculated Internship Duration:
                    </span>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#15803D' }}>
                    {duration.days} Days ({duration.weeks} Weeks)
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="STIPEND PROVIDED?">
                    <Select
                      value={formData.hasStipend}
                      onChange={(e) => setFormData({ ...formData, hasStipend: e.target.value })}
                    >
                      <option value="Yes">Yes (Paid Internship)</option>
                      <option value="No">No (Unpaid)</option>
                    </Select>
                  </FormField>

                  <FormField label="INTERNSHIP LIFECYCLE STATUS">
                    <Select
                      value={formData.internshipStatus}
                      onChange={(e) => setFormData({ ...formData, internshipStatus: e.target.value })}
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Planned">Planned</option>
                      <option value="Discontinued">Discontinued</option>
                    </Select>
                  </FormField>
                </div>

                {formData.hasStipend === 'Yes' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormField label="STIPEND AMOUNT (₹)">
                      <Input
                        type="number"
                        placeholder="e.g. 25000"
                        value={formData.stipendAmount}
                        onChange={(e) => setFormData({ ...formData, stipendAmount: e.target.value })}
                      />
                    </FormField>

                    <FormField label="FREQUENCY">
                      <Select
                        value={formData.stipendFrequency}
                        onChange={(e) => setFormData({ ...formData, stipendFrequency: e.target.value })}
                      >
                        <option value="Monthly">Per Month</option>
                        <option value="Weekly">Per Week</option>
                        <option value="Total">Total Lumpsum</option>
                      </Select>
                    </FormField>
                  </div>
                )}
              </motion.div>
            )}

            {/* ──────── STEP 5: DOCUMENTS & SUBMIT ──────── */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <div style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: '#F8FAFC'
                }}>
                  <Upload size={28} style={{ color: '#D4AF37', margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                    Attach Offer Letter, Joining Letter or Completion Certificate
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 1rem' }}>
                    Secure evidence files are accessible only to verified institution auditors and HODs.
                  </p>
                  <label style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#070F1E',
                    color: '#F1C40F',
                    padding: '0.5rem 1.15rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}>
                    <Upload size={14} /> Upload Internship Proof
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>

                {/* Attached Documents List */}
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    ATTACHED DOCUMENTS ({formData.documents.length})
                  </div>
                  {formData.documents.length === 0 ? (
                    <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '8px', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem' }}>
                      No documents attached yet. Offer letter can be uploaded now; completion certificate upon finishing.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {formData.documents.map(doc => (
                        <div
                          key={doc.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.65rem 0.9rem',
                            background: '#F1F5F9',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <FileText size={16} style={{ color: '#D4AF37' }} />
                            <div>
                              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}>{doc.name}</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{doc.category} • {doc.size}</div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(doc.id)}
                            style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', borderRadius: '4px', padding: '0.3rem', cursor: 'pointer' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ padding: '0.85rem 1rem', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065F46', fontSize: '0.8rem' }}>
                  <Sparkles size={16} /> Ready to submit for departmental verification and NBA Criterion-4 documentation.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Action Footer */}
        <div style={{
          background: '#F8FAFC',
          padding: '1rem 1.75rem',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {currentStep === 1 ? (
            <button
              type="button"
              onClick={() => setUnsavedConfirmOpen(true)}
              style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
            >
              <X size={15} /> Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#334155', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
            >
              <ChevronLeft size={15} /> Back
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
              style={{ padding: '0.55rem 1.05rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {draftSavedToast ? <><Check size={14} style={{ color: '#10B981' }} /> Saved</> : (isSavingDraft ? 'Saving...' : 'Save Draft')}
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.55rem 1.25rem', borderRadius: '8px', border: 'none', background: '#070F1E', color: '#F1C40F', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
              >
                Continue <ChevronRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.35rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
              >
                <Check size={15} /> {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            )}
          </div>
        </div>

        {/* Unsaved Changes Confirmation Modal */}
        {unsavedConfirmOpen && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(7, 15, 30, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '1rem' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.5rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
              <AlertCircle size={36} style={{ color: '#F59E0B', margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem' }}>Unsaved Internship Record</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 1.25rem' }}>Do you want to save draft before closing?</p>
              <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
                <button type="button" onClick={() => { setUnsavedConfirmOpen(false); onClose(); }} style={{ padding: '0.45rem 0.9rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.78rem', color: '#DC2626', fontWeight: 700, cursor: 'pointer' }}>
                  Discard
                </button>
                <button type="button" onClick={() => { handleSaveDraft(); setUnsavedConfirmOpen(false); onClose(); }} style={{ padding: '0.45rem 1.1rem', borderRadius: '6px', border: 'none', background: '#070F1E', color: '#F1C40F', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>
                  Save Draft & Close
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

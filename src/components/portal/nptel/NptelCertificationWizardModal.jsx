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
  Award, 
  GraduationCap, 
  User, 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Globe, 
  ExternalLink,
  Sparkles,
  Search,
  BookOpen,
  Layers,
  Clock
} from 'lucide-react';
import { DEPARTMENTS, FACULTY_DATA } from '../../../data/masterData.js';
import { 
  STUDENT_DIRECTORY, 
  lookupStudentByRollNumber, 
  saveNPTEL 
} from '../../../data/portalStore.js';
import FormField from '../../ui/form/FormField.jsx';
import { Input, DateInput, Select, Textarea } from '../../ui/form/FormControls.jsx';

const PLATFORMS = [
  'NPTEL',
  'SWAYAM',
  'Coursera',
  'edX',
  'Infosys Springboard',
  'Cisco Networking Academy',
  'AWS Academy',
  'Google Cloud Skills',
  'Microsoft Learn',
  'IBM SkillsBuild',
  'Other'
];

const OFFERING_INSTITUTES = [
  'IIT Madras',
  'IIT Kharagpur',
  'IIT Bombay',
  'IIT Delhi',
  'IIT Roorkee',
  'IIT Kanpur',
  'IIT Guwahati',
  'IISc Bangalore',
  'IIM Bangalore',
  'Stanford University',
  'MIT',
  'Google',
  'Amazon Web Services',
  'Other'
];

const DURATIONS = [
  '4 Weeks',
  '8 Weeks',
  '12 Weeks',
  'Custom'
];

const CERTIFICATION_RESULTS = [
  'Successfully Completed',
  'Elite',
  'Elite + Silver',
  'Elite + Gold',
  'Topper',
  'Participation'
];

export default function NptelCertificationWizardModal({
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
  const [errors, setErrors] = useState({});

  // Student Search
  const [studentRollQuery, setStudentRollQuery] = useState('');
  const [studentLookupError, setStudentLookupError] = useState('');

  const defaultDept = currentUser?.role === 'HOD' ? (currentUser.dept || 'CSE') : 'CSE';

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        scores: initialData.scores || { assignmentScore: 24, examScore: 62, finalScore: 86 },
        academicCredits: initialData.academicCredits || { creditsEarned: 3, creditTransferRequested: false },
        documents: initialData.documents || []
      };
    }

    const defaultFac = FACULTY_DATA.find(f => f.id === currentUser?.facultyId) || FACULTY_DATA[0];

    return {
      holderType: 'STUDENT', // 'STUDENT' or 'FACULTY'
      
      studentDetails: {
        rollNumber: '22471A0589',
        name: 'K. Sai Praneeth',
        department: defaultDept,
        batch: '2022-2026',
        year: 'IV Year',
        semester: 'II Sem'
      },
      
      facultyDetails: {
        facultyId: defaultFac?.id || '',
        name: defaultFac?.name || 'Dr. S. V. N. Sreenivasu',
        department: defaultDept,
        designation: defaultFac?.designation || 'Professor'
      },
      
      department: defaultDept,
      academicYear: '2025-26',
      platform: 'NPTEL',
      courseName: '',
      courseCode: '',
      offeredBy: 'IIT Kharagpur',
      instructor: '',
      duration: '12 Weeks',
      examDate: new Date().toISOString().split('T')[0],
      
      scores: {
        assignmentScore: 24,
        examScore: 62,
        finalScore: 86
      },
      certificationResult: 'Elite + Silver',
      
      academicCredits: {
        creditsEarned: 3,
        creditTransferRequested: false,
        creditTransferApproved: false,
        approvedCredits: 3,
        approvalReference: ''
      },
      
      certificateDate: new Date().toISOString().split('T')[0],
      certificateId: '',
      certificateVerificationUrl: '',
      
      documents: [],
      workflowStatus: 'DRAFT'
    };
  });

  // Handle Student Lookup
  const handleStudentLookup = () => {
    if (!studentRollQuery.trim()) return;
    const clean = studentRollQuery.trim().toUpperCase();
    const found = lookupStudentByRollNumber(clean);
    if (!found) {
      setStudentLookupError(`Student Roll No "${clean}" not found in verified student directory.`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      studentDetails: {
        rollNumber: found.rollNumber,
        name: found.name,
        department: found.department,
        batch: found.batch,
        year: found.year,
        semester: found.semester
      },
      department: found.department
    }));
    setStudentRollQuery('');
    setStudentLookupError('');
  };

  // Auto calculate final score when assignment or exam changes
  const handleScoreChange = (field, val) => {
    const num = parseFloat(val) || 0;
    setFormData(prev => {
      const updatedScores = { ...prev.scores, [field]: num };
      if (field === 'assignmentScore' || field === 'examScore') {
        updatedScores.finalScore = Math.round((updatedScores.assignmentScore || 0) + (updatedScores.examScore || 0));
        
        // Auto badge
        let badge = 'Successfully Completed';
        if (updatedScores.finalScore >= 90) badge = 'Elite + Gold';
        else if (updatedScores.finalScore >= 75) badge = 'Elite + Silver';
        else if (updatedScores.finalScore >= 60) badge = 'Elite';
        
        return { ...prev, scores: updatedScores, certificationResult: badge };
      }
      return { ...prev, scores: updatedScores };
    });
  };

  // Document Upload
  const handleFileUpload = (e, category) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc = {
      id: 'DOC-' + Date.now(),
      name: file.name,
      type: category || 'NPTEL Certificate PDF',
      size: (file.size / 1024).toFixed(1) + ' KB',
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file)
    };

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDoc]
    }));
  };

  // Step Validation
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (formData.holderType === 'STUDENT' && !formData.studentDetails?.name) {
        newErrors.holder = 'Valid student selection is required';
      }
      if (formData.holderType === 'FACULTY' && !formData.facultyDetails?.name) {
        newErrors.holder = 'Valid faculty selection is required';
      }
    } else if (step === 2) {
      if (!formData.courseName) newErrors.courseName = 'Course name is required';
      if (!formData.platform) newErrors.platform = 'Platform is required';
    } else if (step === 3) {
      if (!formData.certificationResult) newErrors.certificationResult = 'Certification result is required';
    } else if (step === 4) {
      if (!formData.certificateId) newErrors.certificateId = 'Certificate ID / Roll No is required';
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
    try {
      const saved = saveNPTEL({
        ...formData,
        workflowStatus: 'DRAFT'
      }, currentUser);

      setTimeout(() => {
        setIsSavingDraft(false);
        setDraftSavedToast(true);
        if (onSaved) onSaved(saved);
        setTimeout(() => setDraftSavedToast(false), 2500);
      }, 400);
    } catch (err) {
      setIsSavingDraft(false);
      alert(err.message);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      alert('Please fill all mandatory fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      saveNPTEL({
        ...formData,
        workflowStatus: 'SUBMITTED'
      }, currentUser);

      setTimeout(() => {
        setIsSubmitting(false);
        if (onSaved) onSaved();
        onClose();
      }, 500);
    } catch (err) {
      setIsSubmitting(false);
      alert(err.message);
    }
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
        transition={{ duration: 0.25 }}
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '880px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          overflow: 'hidden'
        }}
      >
        {/* 1. Header */}
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
              <Award size={14} /> Accreditation & Skills • NPTEL & MOOC Certifications
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#FFFFFF', fontFamily: 'Cinzel, serif' }}>
              {initialData ? `Edit Certification (${initialData.certificationNumber || initialData.id})` : 'Record NPTEL / MOOC Online Certification'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#94A3B8', borderRadius: '8px', padding: '0.45rem', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Stepper Header */}
        <div style={{
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          padding: '0.75rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.4rem',
          overflowX: 'auto'
        }}>
          {[
            { step: 1, label: 'Learner / Holder' },
            { step: 2, label: 'Course & Platform' },
            { step: 3, label: 'Results & Scores' },
            { step: 4, label: 'Certificate & Evidence' },
            { step: 5, label: 'Review & Submit' }
          ].map((s) => {
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;
            return (
              <div
                key={s.step}
                onClick={() => isDone && setCurrentStep(s.step)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: isDone ? 'pointer' : 'default', opacity: isActive ? 1 : (isDone ? 0.85 : 0.45) }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isActive ? '#070F1E' : (isDone ? '#10B981' : '#CBD5E1'),
                  color: isActive ? '#F1C40F' : '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isActive ? '2px solid #D4AF37' : 'none'
                }}>
                  {isDone ? <Check size={12} /> : s.step}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#0F172A' : '#64748B', whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
                {s.step < 5 && <ChevronRight size={13} style={{ color: '#CBD5E1', marginLeft: '0.2rem' }} />}
              </div>
            );
          })}
        </div>

        {/* 3. Form Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          <AnimatePresence mode="wait">
            {/* ──────── STEP 1: HOLDER TYPE & SEARCH ──────── */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {/* Switch: Student vs Faculty */}
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', display: 'block', marginBottom: '0.45rem' }}>
                    SELECT LEARNER CATEGORY *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div
                      onClick={() => setFormData({ ...formData, holderType: 'STUDENT' })}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: formData.holderType === 'STUDENT' ? '2px solid #D4AF37' : '1px solid #CBD5E1',
                        background: formData.holderType === 'STUDENT' ? '#FFFDF5' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <GraduationCap size={24} style={{ color: formData.holderType === 'STUDENT' ? '#D4AF37' : '#64748B' }} />
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>Student Learner</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>B.Tech / M.Tech Student Certification</div>
                      </div>
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, holderType: 'FACULTY' })}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: formData.holderType === 'FACULTY' ? '2px solid #D4AF37' : '1px solid #CBD5E1',
                        background: formData.holderType === 'FACULTY' ? '#FFFDF5' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <User size={24} style={{ color: formData.holderType === 'FACULTY' ? '#D4AF37' : '#64748B' }} />
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>Faculty Learner</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Faculty Development & FDP MOOC</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Learner Directory Lookup */}
                {formData.holderType === 'STUDENT' ? (
                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                      SEARCH STUDENT ROLL NUMBER
                    </span>

                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                      <input
                        type="text"
                        placeholder="e.g. 22471A0589, 23BQ1A0501..."
                        value={studentRollQuery}
                        onChange={(e) => { setStudentRollQuery(e.target.value); setStudentLookupError(''); }}
                        style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                      />
                      <button
                        type="button"
                        onClick={handleStudentLookup}
                        style={{ padding: '0.5rem 1.15rem', background: '#070F1E', color: '#F1C40F', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Lookup
                      </button>
                    </div>

                    {studentLookupError && (
                      <div style={{ color: '#DC2626', fontSize: '0.74rem', fontWeight: 700, marginTop: '0.4rem' }}>
                        {studentLookupError}
                      </div>
                    )}

                    {formData.studentDetails?.name && (
                      <div style={{ marginTop: '0.85rem', padding: '0.75rem 1rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #D4AF37', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>{formData.studentDetails.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                            Roll: {formData.studentDetails.rollNumber} • {formData.studentDetails.department} • {formData.studentDetails.batch} ({formData.studentDetails.year})
                          </div>
                        </div>
                        <CheckCircle2 size={18} style={{ color: '#059669' }} />
                      </div>
                    )}
                  </div>
                ) : (
                  /* Faculty Learner Directory Selector */
                  <FormField label="SELECT FACULTY MEMBER *">
                    <Select
                      value={formData.facultyDetails?.name}
                      onChange={(e) => {
                        const fac = FACULTY_DATA.find(f => f.name === e.target.value);
                        setFormData({
                          ...formData,
                          facultyDetails: {
                            facultyId: fac?.id || '',
                            name: fac?.name || e.target.value,
                            department: fac?.department || formData.department,
                            designation: fac?.designation || 'Faculty'
                          },
                          department: fac?.department || formData.department
                        });
                      }}
                    >
                      {FACULTY_DATA.map(f => <option key={f.id} value={f.name}>{f.name} ({f.department} - {f.designation})</option>)}
                    </Select>
                  </FormField>
                )}
              </motion.div>
            )}

            {/* ──────── STEP 2: COURSE & PLATFORM ──────── */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                  <FormField label="CERTIFICATION PLATFORM *" error={errors.platform}>
                    <Select value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} error={!!errors.platform}>
                      {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </Select>
                  </FormField>

                  <FormField label="OFFERING INSTITUTE / IIT *">
                    <Select value={formData.offeredBy} onChange={(e) => setFormData({ ...formData, offeredBy: e.target.value })}>
                      {OFFERING_INSTITUTES.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                    </Select>
                  </FormField>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <FormField label="COURSE NAME *" error={errors.courseName}>
                    <Input
                      placeholder="e.g. Cloud Computing & Distributed Systems / Deep Learning"
                      value={formData.courseName}
                      onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                      error={!!errors.courseName}
                    />
                  </FormField>

                  <FormField label="COURSE CODE (OPTIONAL)">
                    <Input placeholder="noc26-cs14" value={formData.courseCode} onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })} />
                  </FormField>
                </div>

                {/* Duration Chips */}
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    COURSE DURATION *
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {DURATIONS.map(dur => {
                      const isSel = formData.duration === dur;
                      return (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setFormData({ ...formData, duration: dur, academicCredits: { ...formData.academicCredits, creditsEarned: dur.includes('12') ? 3 : (dur.includes('8') ? 2 : 1) } })}
                          style={{
                            padding: '0.45rem 1rem',
                            borderRadius: '9999px',
                            border: isSel ? '1px solid #D4AF37' : '1px solid #CBD5E1',
                            background: isSel ? '#070F1E' : '#FFFFFF',
                            color: isSel ? '#F1C40F' : '#475569',
                            fontSize: '0.76rem',
                            fontWeight: isSel ? 800 : 600,
                            cursor: 'pointer'
                          }}
                        >
                          {isSel ? '✓ ' : ''}{dur}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                  <FormField label="COURSE INSTRUCTOR / PROFESSOR">
                    <Input placeholder="e.g. Prof. Soumya K. Ghosh" value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} />
                  </FormField>

                  <FormField label="EXAM / COMPLETION DATE *">
                    <DateInput value={formData.examDate} onChange={(e) => setFormData({ ...formData, examDate: e.target.value })} />
                  </FormField>
                </div>
              </motion.div>
            )}

            {/* ──────── STEP 3: RESULTS & SCORES ──────── */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <FormField label="ASSIGNMENT SCORE (25M)">
                    <Input type="number" step="0.5" value={formData.scores.assignmentScore} onChange={(e) => handleScoreChange('assignmentScore', e.target.value)} />
                  </FormField>

                  <FormField label="PROCTORED EXAM (75M)">
                    <Input type="number" step="0.5" value={formData.scores.examScore} onChange={(e) => handleScoreChange('examScore', e.target.value)} />
                  </FormField>

                  <FormField label="FINAL SCORE (100M)">
                    <Input type="number" step="0.5" value={formData.scores.finalScore} onChange={(e) => handleScoreChange('finalScore', e.target.value)} />
                  </FormField>
                </div>

                {/* Certification Result Badges */}
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    CERTIFICATION RESULT BADGE *
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {CERTIFICATION_RESULTS.map(res => {
                      const isSel = formData.certificationResult === res;
                      return (
                        <button
                          key={res}
                          type="button"
                          onClick={() => setFormData({ ...formData, certificationResult: res })}
                          style={{
                            padding: '0.45rem 0.95rem',
                            borderRadius: '9999px',
                            border: isSel ? '1px solid #D4AF37' : '1px solid #CBD5E1',
                            background: isSel ? '#070F1E' : '#FFFFFF',
                            color: isSel ? '#F1C40F' : '#475569',
                            fontSize: '0.76rem',
                            fontWeight: isSel ? 800 : 600,
                            cursor: 'pointer'
                          }}
                        >
                          {isSel ? '★ ' : ''}{res}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Academic Credits Transfer Container */}
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    ACADEMIC CREDIT TRANSFER (SWAYAM / NEP POLICY)
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormField label="RECOMMENDED CREDITS">
                      <Input type="number" value={formData.academicCredits.creditsEarned} onChange={(e) => setFormData({ ...formData, academicCredits: { ...formData.academicCredits, creditsEarned: parseInt(e.target.value, 10) || 0 } })} />
                    </FormField>

                    <FormField label="ACADEMIC YEAR">
                      <Select value={formData.academicYear} onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}>
                        <option value="2026-27">2026-27</option>
                        <option value="2025-26">2025-26</option>
                        <option value="2024-25">2024-25</option>
                      </Select>
                    </FormField>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ──────── STEP 4: CERTIFICATE & EVIDENCE ──────── */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="CERTIFICATE ID / ROLL NO *" error={errors.certificateId}>
                    <Input placeholder="e.g. NPTEL26CS14S3412098" value={formData.certificateId} onChange={(e) => setFormData({ ...formData, certificateId: e.target.value })} error={!!errors.certificateId} />
                  </FormField>

                  <FormField label="CERTIFICATE ISSUE DATE *">
                    <DateInput value={formData.certificateDate} onChange={(e) => setFormData({ ...formData, certificateDate: e.target.value })} />
                  </FormField>
                </div>

                <FormField label="CERTIFICATE VERIFICATION URL (NPTEL / SWAYAM)">
                  <Input placeholder="https://nptel.ac.in/noc/E_Certificate/..." value={formData.certificateVerificationUrl} onChange={(e) => setFormData({ ...formData, certificateVerificationUrl: e.target.value })} />
                </FormField>

                {/* Certificate Dropzone */}
                <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', background: '#F8FAFC' }}>
                  <Upload size={28} style={{ color: '#D4AF37', margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                    Upload Official Certificate PDF
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 1rem' }}>
                    Attach verified electronic NPTEL/SWAYAM certificate PDF or score card.
                  </p>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#070F1E', color: '#F1C40F', padding: '0.5rem 1.15rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <Upload size={14} /> Attach Certificate PDF
                    <input type="file" accept=".pdf,.png,.jpg" onChange={(e) => handleFileUpload(e, 'NPTEL E-Certificate PDF')} style={{ display: 'none' }} />
                  </label>
                </div>

                <div>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    ATTACHED CERTIFICATE DOCUMENTS ({formData.documents.length})
                  </span>
                  {formData.documents.length === 0 ? (
                    <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '8px', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem' }}>
                      No certificate PDF attached yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {formData.documents.map(doc => (
                        <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.9rem', background: '#F1F5F9', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <FileText size={16} style={{ color: '#D4AF37' }} />
                            <div>
                              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}>{doc.name}</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{doc.type} ({doc.size})</div>
                            </div>
                          </div>
                          <button type="button" onClick={() => setFormData(prev => ({ ...prev, documents: prev.documents.filter(d => d.id !== doc.id) }))} style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', borderRadius: '4px', padding: '0.3rem', cursor: 'pointer' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ──────── STEP 5: REVIEW & SUBMIT ──────── */}
            {currentStep === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', padding: '1.25rem', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase' }}>
                    {formData.platform} • {formData.certificationResult}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>
                    {formData.courseName}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Learner: <strong>{formData.holderType === 'STUDENT' ? formData.studentDetails?.name : formData.facultyDetails?.name}</strong> ({formData.department})
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Final Score</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>{formData.scores.finalScore}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Offered By</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A' }}>{formData.offeredBy}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Credits</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563EB' }}>{formData.academicCredits.creditsEarned} Credits</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0.85rem 1rem', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065F46', fontSize: '0.8rem' }}>
                  <Sparkles size={16} /> Submitting initiates departmental certificate verification and NAAC Criterion 1 & 2 accreditation mapping.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Action Footer */}
        <div style={{ background: '#F8FAFC', padding: '1rem 1.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {currentStep === 1 ? (
            <button type="button" onClick={onClose} style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              Cancel
            </button>
          ) : (
            <button type="button" onClick={handleBack} style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#334155', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              <ChevronLeft size={15} /> Back
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button type="button" onClick={handleSaveDraft} disabled={isSavingDraft} style={{ padding: '0.55rem 1.05rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              {draftSavedToast ? <><Check size={14} style={{ color: '#10B981' }} /> Saved</> : (isSavingDraft ? 'Saving...' : 'Save Draft')}
            </button>

            {currentStep < 5 ? (
              <button type="button" onClick={handleNext} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.55rem 1.25rem', borderRadius: '8px', border: 'none', background: '#070F1E', color: '#F1C40F', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                Continue <ChevronRight size={15} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={isSubmitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.35rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                <Check size={15} /> {isSubmitting ? 'Submitting...' : 'Submit Certification'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

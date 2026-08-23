import React, { useState, useEffect } from 'react';
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
  Building2, 
  User, 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Globe, 
  FileCheck, 
  Sparkles,
  Layers
} from 'lucide-react';
import { DEPARTMENTS, FACULTY_DATA } from '../../../data/masterData.js';
import { savePatent, getPatents } from '../../../data/portalStore.js';
import FormField from '../../ui/form/FormField.jsx';
import { Input, DateInput, Select, Textarea } from '../../ui/form/FormControls.jsx';

const PATENT_TYPES = [
  'Indian Patent',
  'Design Patent',
  'PCT / International',
  'Utility Patent',
  'Plant Patent',
  'Provisional Patent',
  'Complete Specification',
  'Other'
];

const TECHNOLOGY_DOMAINS = [
  'Artificial Intelligence / Machine Learning',
  'IoT & Smart Sensors',
  'CleanTech & Renewable Energy',
  'VLSI & Microelectronics',
  'Robotics & Automation',
  'Healthcare & Biomedical',
  'Agriculture Technology & Precision Farming',
  'Cyber Security & Cryptography',
  'Structural & Civil Engineering',
  'Advanced Materials & Manufacturing',
  'Cloud & Distributed Systems',
  'Other'
];

const LEGAL_STATUSES = [
  { id: 'DRAFT', label: 'Draft / In Preparation' },
  { id: 'FILED', label: 'Filed (Application Submitted)' },
  { id: 'PUBLISHED', label: 'Published in Official Journal' },
  { id: 'UNDER_EXAMINATION', label: 'Under Examination (FER)' },
  { id: 'GRANTED', label: 'Granted (Patent Issued)' },
  { id: 'COMMERCIALIZED', label: 'Commercialized / Licensed' },
  { id: 'ABANDONED', label: 'Abandoned / Withdrawn' }
];

export default function PatentWizardModal({
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

  const defaultDept = currentUser?.role === 'HOD' ? (currentUser.dept || 'CSE') : 'CSE';

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        inventors: initialData.inventors || [],
        documents: initialData.documents || []
      };
    }

    return {
      title: '',
      department: defaultDept,
      academicYear: '2025-26',
      patentType: 'Indian Patent',
      countryCode: 'India',
      patentOffice: 'Indian Patent Office (Chennai)',
      technologyDomain: 'Artificial Intelligence / Machine Learning',
      abstract: '',
      keywords: '',
      
      // Filing & Status
      applicationNumber: '',
      applicationDate: new Date().toISOString().split('T')[0],
      filingDate: new Date().toISOString().split('T')[0],
      publicationDate: '',
      grantNumber: '',
      grantDate: '',
      priorityDate: '',
      ferDate: '',
      expiryDate: '',
      legalStatus: 'FILED',
      
      // Ownership
      applicantName: 'Narasaraopeta Engineering College (Autonomous)',
      ownershipType: 'Narasaraopeta Engineering College',
      partnerOrg: '',
      ownershipPercent: 100,
      
      // Inventors
      inventors: [
        {
          inventorOrder: 1,
          personType: 'INTERNAL_FACULTY',
          facultyId: currentUser?.facultyId || '',
          name: currentUser?.name || '',
          department: defaultDept,
          designation: 'Faculty',
          affiliation: 'Narasaraopeta Engineering College',
          email: currentUser?.email || '',
          isLead: true,
          isCorresponding: true
        }
      ],
      
      // Documents
      documents: [],
      workflowStatus: 'DRAFT'
    };
  });

  // Dynamic Inventor Management
  const handleAddInventor = () => {
    const nextOrder = formData.inventors.length + 1;
    setFormData(prev => ({
      ...prev,
      inventors: [
        ...prev.inventors,
        {
          inventorOrder: nextOrder,
          personType: 'INTERNAL_FACULTY',
          facultyId: '',
          name: '',
          department: formData.department,
          designation: 'Faculty',
          affiliation: 'Narasaraopeta Engineering College',
          email: '',
          isLead: false,
          isCorresponding: false
        }
      ]
    }));
  };

  const handleUpdateInventor = (index, field, value) => {
    const updated = [...formData.inventors];
    updated[index] = { ...updated[index], [field]: value };
    
    // If faculty ID changed, populate snapshot from directory
    if (field === 'facultyId') {
      const fac = FACULTY_DATA.find(f => f.id === value);
      if (fac) {
        updated[index].name = fac.name;
        updated[index].department = fac.department;
        updated[index].designation = fac.designation;
        updated[index].email = fac.email || '';
      }
    }
    
    // If setting lead, clear other lead flags
    if (field === 'isLead' && value === true) {
      updated.forEach((inv, i) => {
        if (i !== index) inv.isLead = false;
      });
    }

    setFormData(prev => ({ ...prev, inventors: updated }));
  };

  const handleRemoveInventor = (index) => {
    setFormData(prev => ({
      ...prev,
      inventors: prev.inventors.filter((_, i) => i !== index).map((inv, idx) => ({ ...inv, inventorOrder: idx + 1 }))
    }));
  };

  // Document Upload
  const handleFileUpload = (e, category) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc = {
      id: 'DOC-' + Date.now(),
      name: file.name,
      type: category || 'Supporting Proof PDF',
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
      if (!formData.title) newErrors.title = 'Patent title is required';
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.technologyDomain) newErrors.technologyDomain = 'Technology domain is required';
    } else if (step === 2) {
      if (!formData.inventors || formData.inventors.length === 0) {
        newErrors.inventors = 'At least one inventor is required';
      } else if (!formData.inventors[0]?.name) {
        newErrors.inventors = 'Lead inventor name is required';
      }
    } else if (step === 3) {
      if (!formData.applicationNumber) newErrors.applicationNumber = 'Official Application Number is required';
      if (!formData.filingDate) newErrors.filingDate = 'Filing Date is required';
      if (formData.legalStatus === 'GRANTED' && !formData.grantNumber) {
        newErrors.grantNumber = 'Grant Number is required when status is Granted';
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

  const [submitError, setSubmitError] = useState('');

  const handleSaveDraft = () => {
    if (!formData.title.trim()) {
      setSubmitError('Please provide at least a Patent Title to save draft.');
      return;
    }

    setIsSavingDraft(true);
    setSubmitError('');
    try {
      const saved = savePatent({
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
      setSubmitError(err.message);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setSubmitError('Please complete all mandatory fields across steps 1, 2, and 3.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const saved = savePatent({
        ...formData,
        workflowStatus: 'SUBMITTED'
      }, currentUser);

      setTimeout(() => {
        setIsSubmitting(false);
        if (onSaved) onSaved(saved);
        onClose();
      }, 500);
    } catch (err) {
      setIsSubmitting(false);
      setSubmitError(err.message);
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
          maxWidth: '920px',
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
              <Award size={14} /> Research & Innovation • IPR Governance
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#FFFFFF', fontFamily: 'Cinzel, serif' }}>
              {initialData ? `Edit Patent Record (${initialData.patentRecordNumber || initialData.id})` : 'Record New Patent Application'}
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
            { step: 1, label: 'Patent Details' },
            { step: 2, label: 'Inventors' },
            { step: 3, label: 'Filing & Ownership' },
            { step: 4, label: 'Evidence & Proof' },
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
          {submitError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{submitError}</span>
            </div>
          )}
          <AnimatePresence mode="wait">
            {/* ──────── STEP 1: PATENT DETAILS ──────── */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <FormField label="PATENT TITLE *" error={errors.title}>
                  <Input
                    placeholder="e.g. Hybrid Solar-Wind Power Converter with Adaptive Load Balancing"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    error={!!errors.title}
                  />
                </FormField>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <FormField label="DEPARTMENT *" error={errors.department}>
                    <Select
                      value={formData.department}
                      disabled={currentUser?.role === 'HOD'}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      error={!!errors.department}
                    >
                      {DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}
                    </Select>
                  </FormField>

                  <FormField label="ACADEMIC YEAR *">
                    <Select value={formData.academicYear} onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}>
                      <option value="2026-27">2026-27</option>
                      <option value="2025-26">2025-26</option>
                      <option value="2024-25">2024-25</option>
                      <option value="2023-24">2023-24</option>
                    </Select>
                  </FormField>

                  <FormField label="PATENT TYPE *">
                    <Select value={formData.patentType} onChange={(e) => setFormData({ ...formData, patentType: e.target.value })}>
                      {PATENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                  </FormField>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <FormField label="APPLICATION COUNTRY *">
                    <Select value={formData.countryCode} onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}>
                      <option value="India">India (IN)</option>
                      <option value="United States">United States (USPTO)</option>
                      <option value="WIPO / PCT">WIPO / PCT International</option>
                      <option value="United Kingdom">United Kingdom (UKIPO)</option>
                      <option value="European Patent Office">European Patent Office (EPO)</option>
                      <option value="Other">Other Country</option>
                    </Select>
                  </FormField>

                  <FormField label="PATENT OFFICE">
                    <Input placeholder="e.g. Indian Patent Office (Chennai)" value={formData.patentOffice} onChange={(e) => setFormData({ ...formData, patentOffice: e.target.value })} />
                  </FormField>

                  <FormField label="TECHNOLOGY DOMAIN *" error={errors.technologyDomain}>
                    <Select value={formData.technologyDomain} onChange={(e) => setFormData({ ...formData, technologyDomain: e.target.value })} error={!!errors.technologyDomain}>
                      {TECHNOLOGY_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                    </Select>
                  </FormField>
                </div>

                <FormField label="ABSTRACT / TECHNICAL SCOPE">
                  <Textarea rows={3} placeholder="Provide concise abstract describing the novelty, invention methodology, and industrial applicability..." value={formData.abstract} onChange={(e) => setFormData({ ...formData, abstract: e.target.value })} />
                </FormField>

                <FormField label="KEYWORDS">
                  <Input placeholder="e.g. Solar Converter, Adaptive MPPT, Microgrid, Renewable Energy" value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })} />
                </FormField>
              </motion.div>
            )}

            {/* ──────── STEP 2: INVENTORS ──────── */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                      INVENTORS & RESEARCHERS ({formData.inventors.length})
                    </span>
                    <p style={{ fontSize: '0.74rem', color: '#64748B', margin: 0 }}>Map internal faculty, student innovators, or external collaborative researchers.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddInventor}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.85rem', background: '#070F1E', color: '#F1C40F', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    <Plus size={13} /> Add Inventor
                  </button>
                </div>

                {errors.inventors && (
                  <div style={{ color: '#DC2626', fontSize: '0.75rem', fontWeight: 700 }}>{errors.inventors}</div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {formData.inventors.map((inv, idx) => (
                    <div key={idx} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D4AF37' }}>
                          INVENTOR #{inv.inventorOrder} {inv.isLead && '(LEAD INVENTOR)'}
                        </span>
                        {formData.inventors.length > 1 && (
                          <button type="button" onClick={() => handleRemoveInventor(idx)} style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer' }}>
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '0.65rem' }}>
                        <FormField label="PERSON TYPE">
                          <Select value={inv.personType} onChange={(e) => handleUpdateInventor(idx, 'personType', e.target.value)}>
                            <option value="INTERNAL_FACULTY">Internal Faculty</option>
                            <option value="INTERNAL_STUDENT">Internal Student</option>
                            <option value="EXTERNAL_INVENTOR">External Researcher</option>
                          </Select>
                        </FormField>

                        {inv.personType === 'INTERNAL_FACULTY' ? (
                          <FormField label="SELECT FROM DIRECTORY">
                            <Select value={inv.facultyId} onChange={(e) => handleUpdateInventor(idx, 'facultyId', e.target.value)}>
                              <option value="">Select Faculty Name</option>
                              {FACULTY_DATA.map(f => (
                                <option key={f.id} value={f.id}>{f.name} ({f.department} - {f.designation})</option>
                              ))}
                            </Select>
                          </FormField>
                        ) : (
                          <FormField label="INVENTOR FULL NAME *">
                            <Input placeholder="Full Name" value={inv.name} onChange={(e) => handleUpdateInventor(idx, 'name', e.target.value)} />
                          </FormField>
                        )}

                        <FormField label="DEPARTMENT / AFFILIATION">
                          <Input placeholder="Department" value={inv.department} onChange={(e) => handleUpdateInventor(idx, 'department', e.target.value)} />
                        </FormField>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.65rem', alignItems: 'center' }}>
                        <FormField label="DESIGNATION">
                          <Input placeholder="e.g. Professor" value={inv.designation} onChange={(e) => handleUpdateInventor(idx, 'designation', e.target.value)} />
                        </FormField>

                        <FormField label="EMAIL (OPTIONAL)">
                          <Input placeholder="Official Email" value={inv.email} onChange={(e) => handleUpdateInventor(idx, 'email', e.target.value)} />
                        </FormField>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.2rem' }}>
                          <input type="checkbox" id={`lead_${idx}`} checked={inv.isLead} onChange={(e) => handleUpdateInventor(idx, 'isLead', e.target.checked)} />
                          <label htmlFor={`lead_${idx}`} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A' }}>Lead Inventor</label>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.2rem' }}>
                          <input type="checkbox" id={`corr_${idx}`} checked={inv.isCorresponding} onChange={(e) => handleUpdateInventor(idx, 'isCorresponding', e.target.checked)} />
                          <label htmlFor={`corr_${idx}`} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A' }}>Corresponding</label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ──────── STEP 3: FILING & OWNERSHIP ──────── */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="LEGAL STATUS *">
                    <Select value={formData.legalStatus} onChange={(e) => setFormData({ ...formData, legalStatus: e.target.value })}>
                      {LEGAL_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </Select>
                  </FormField>

                  <FormField label="OFFICIAL APPLICATION NUMBER *" error={errors.applicationNumber}>
                    <Input placeholder="e.g. 202541114378" value={formData.applicationNumber} onChange={(e) => setFormData({ ...formData, applicationNumber: e.target.value })} error={!!errors.applicationNumber} />
                  </FormField>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <FormField label="FILING DATE *" error={errors.filingDate}>
                    <DateInput value={formData.filingDate} onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })} error={!!errors.filingDate} />
                  </FormField>

                  <FormField label="PUBLICATION DATE">
                    <DateInput value={formData.publicationDate} onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })} />
                  </FormField>

                  <FormField label="PRIORITY DATE">
                    <DateInput value={formData.priorityDate} onChange={(e) => setFormData({ ...formData, priorityDate: e.target.value })} />
                  </FormField>
                </div>

                {formData.legalStatus === 'GRANTED' && (
                  <div style={{ background: '#ECFDF5', padding: '1rem', borderRadius: '10px', border: '1px solid #A7F3D0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormField label="PATENT GRANT NUMBER *" error={errors.grantNumber}>
                      <Input placeholder="e.g. IN-542918" value={formData.grantNumber} onChange={(e) => setFormData({ ...formData, grantNumber: e.target.value })} error={!!errors.grantNumber} />
                    </FormField>
                    <FormField label="GRANT DATE">
                      <DateInput value={formData.grantDate} onChange={(e) => setFormData({ ...formData, grantDate: e.target.value })} />
                    </FormField>
                  </div>
                )}

                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', display: 'block', marginBottom: '0.65rem' }}>
                    APPLICANT & INSTITUTIONAL OWNERSHIP
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                    <FormField label="APPLICANT / OWNER NAME *">
                      <Input value={formData.applicantName} onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })} />
                    </FormField>

                    <FormField label="OWNERSHIP TYPE">
                      <Select value={formData.ownershipType} onChange={(e) => setFormData({ ...formData, ownershipType: e.target.value })}>
                        <option value="Narasaraopeta Engineering College">Narasaraopeta Engineering College (100%)</option>
                        <option value="Individual Inventor">Individual Inventor</option>
                        <option value="Joint Institution">Joint Institution Collaboration</option>
                        <option value="Company / Industry Partner">Company / Industry Partner</option>
                      </Select>
                    </FormField>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ──────── STEP 4: EVIDENCE & PROOF ──────── */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', background: '#F8FAFC' }}>
                  <Upload size={28} style={{ color: '#D4AF37', margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                    Upload Official Patent Receipts & Certificates
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 1rem' }}>
                    Filing receipt, patent journal extract, examination report, or grant certificate (PDF format).
                  </p>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#070F1E', color: '#F1C40F', padding: '0.5rem 1.15rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <Upload size={14} /> Attach Proof Document
                    <input type="file" accept=".pdf,.png,.jpg" onChange={(e) => handleFileUpload(e, 'Official Proof')} style={{ display: 'none' }} />
                  </label>
                </div>

                <div>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    ATTACHED EVIDENCE ({formData.documents.length})
                  </span>
                  {formData.documents.length === 0 ? (
                    <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '8px', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem' }}>
                      No documents attached yet.
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
                    {formData.patentType} • {formData.legalStatus}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>
                    {formData.title || 'Untitled Patent'}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Application No: <strong>{formData.applicationNumber || 'Pending'}</strong> • {formData.department} ({formData.academicYear})
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Inventors</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{formData.inventors.length} Researcher(s)</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Filing Date</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{formData.filingDate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Applicant</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{formData.applicantName}</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0.85rem 1rem', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065F46', fontSize: '0.8rem' }}>
                  <Sparkles size={16} /> Submitting initiates departmental IPR review and NAAC Criterion 3 compliance validation.
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
                <Check size={15} /> {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

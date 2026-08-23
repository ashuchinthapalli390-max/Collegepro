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
  BookOpen, 
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
  Sparkles,
  ExternalLink,
  Search,
  Layers,
  Award
} from 'lucide-react';
import { DEPARTMENTS, FACULTY_DATA } from '../../../data/masterData.js';
import { savePublication } from '../../../data/portalStore.js';
import { fetchCrossrefMetadata, normalizeDOI, isValidDOI } from '../../../lib/research/doiService.js';
import FormField from '../../ui/form/FormField.jsx';
import { Input, DateInput, Select, Textarea } from '../../ui/form/FormControls.jsx';

const PUBLICATION_TYPES = [
  'Journal Article',
  'Conference Paper',
  'Book Chapter',
  'Book',
  'Review Article',
  'Proceedings Paper',
  'Editorial',
  'Short Communication',
  'Other'
];

const INDEXING_OPTIONS = [
  'Scopus',
  'Web of Science',
  'SCI / SCIE',
  'ESCI',
  'IEEE Xplore',
  'PubMed',
  'UGC CARE',
  'Google Scholar',
  'DOAJ'
];

export default function PublicationWizardModal({
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
  const [doiLookupLoading, setDoiLookupLoading] = useState(false);
  const [doiLookupSuccess, setDoiLookupSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const defaultDept = currentUser?.role === 'HOD' ? (currentUser.dept || 'CSE') : 'CSE';

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        authors: initialData.authors || [],
        indexing: initialData.indexing || [],
        documents: initialData.documents || []
      };
    }

    return {
      title: '',
      publicationType: 'Journal Article',
      paperOwnerType: 'Faculty Publication',
      department: defaultDept,
      academicYear: '2025-26',
      publicationDate: new Date().toISOString().split('T')[0],
      publicationYear: new Date().getFullYear(),
      journalName: '',
      conferenceName: '',
      organizedBy: '',
      conferenceLocation: '',
      publisher: '',
      volume: '',
      issue: '',
      pages: '',
      articleNumber: '',
      issn: '',
      eissn: '',
      isbn: '',
      doi: '',
      scopusEid: '',
      wosUid: '',
      pubmedId: '',
      url: '',
      indexing: ['Scopus', 'Web of Science'],
      impactFactor: '',
      impactFactorSource: 'JCR',
      impactFactorYear: '2025',
      quartile: '',
      abstract: '',
      keywords: '',
      researchDomain: 'Artificial Intelligence',
      
      // Authors
      authors: [
        {
          authorOrder: 1,
          authorType: 'INTERNAL_FACULTY',
          facultyId: currentUser?.facultyId || '',
          name: currentUser?.name || '',
          department: defaultDept,
          designation: 'Faculty',
          affiliation: 'Narasaraopeta Engineering College',
          isFirstAuthor: true,
          isCorresponding: true
        }
      ],
      
      // Documents
      documents: [],
      workflowStatus: 'DRAFT'
    };
  });

  const [doiLookupError, setDoiLookupError] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Crossref DOI Instant Lookup Handler
  const handleCrossrefLookup = async () => {
    if (!formData.doi) {
      setDoiLookupError('Please enter a DOI to search (e.g. 10.1109/TCE.2025.3421098)');
      return;
    }

    setDoiLookupLoading(true);
    setDoiLookupSuccess(false);
    setDoiLookupError('');

    const result = await fetchCrossrefMetadata(formData.doi);
    setDoiLookupLoading(false);

    if (result.success && result.data) {
      const data = result.data;
      setFormData(prev => ({
        ...prev,
        doi: data.doi,
        title: data.title || prev.title,
        journalName: data.journalName || prev.journalName,
        publisher: data.publisher || prev.publisher,
        publicationType: data.publicationType || prev.publicationType,
        publicationDate: data.publicationDate || prev.publicationDate,
        publicationYear: data.publicationYear || prev.publicationYear,
        volume: data.volume || prev.volume,
        issue: data.issue || prev.issue,
        pages: data.pages || prev.pages,
        articleNumber: data.articleNumber || prev.articleNumber,
        issn: data.issn || prev.issn,
        isbn: data.isbn || prev.isbn,
        url: data.url || prev.url,
        abstract: data.abstract || prev.abstract,
        authors: data.authors?.length ? data.authors : prev.authors,
        indexing: Array.from(new Set([...prev.indexing, 'Crossref']))
      }));
      setDoiLookupSuccess(true);
      setTimeout(() => setDoiLookupSuccess(false), 3000);
    } else {
      setDoiLookupError(result.error || 'Could not fetch DOI metadata. Please check the DOI format or enter manually.');
    }
  };

  // Dynamic Authors
  const handleAddAuthor = () => {
    const nextOrder = formData.authors.length + 1;
    setFormData(prev => ({
      ...prev,
      authors: [
        ...prev.authors,
        {
          authorOrder: nextOrder,
          authorType: 'INTERNAL_FACULTY',
          facultyId: '',
          name: '',
          department: formData.department,
          designation: 'Faculty',
          affiliation: 'Narasaraopeta Engineering College',
          isFirstAuthor: false,
          isCorresponding: false
        }
      ]
    }));
  };

  const handleUpdateAuthor = (index, field, value) => {
    const updated = [...formData.authors];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'facultyId') {
      const fac = FACULTY_DATA.find(f => f.id === value);
      if (fac) {
        updated[index].name = fac.name;
        updated[index].department = fac.department;
        updated[index].designation = fac.designation;
      }
    }
    
    if (field === 'isFirstAuthor' && value === true) {
      updated.forEach((a, i) => {
        if (i !== index) a.isFirstAuthor = false;
      });
    }

    setFormData(prev => ({ ...prev, authors: updated }));
  };

  const handleRemoveAuthor = (index) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index).map((a, idx) => ({ ...a, authorOrder: idx + 1 }))
    }));
  };

  // Indexing Badge Toggle
  const toggleIndexing = (indexName) => {
    setFormData(prev => {
      const exists = prev.indexing.includes(indexName);
      const updated = exists 
        ? prev.indexing.filter(i => i !== indexName)
        : [...prev.indexing, indexName];
      return { ...prev, indexing: updated };
    });
  };

  // File Upload
  const handleFileUpload = (e, category) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc = {
      id: 'DOC-' + Date.now(),
      name: file.name,
      type: category || 'Paper Proof PDF',
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
      if (!formData.title) newErrors.title = 'Publication title is required';
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.publicationDate) newErrors.publicationDate = 'Publication date is required';
      if (formData.publicationType === 'Journal Article' && !formData.journalName) {
        newErrors.journalName = 'Journal name is required for Journal Article';
      }
      if (formData.publicationType === 'Conference Paper' && !formData.conferenceName) {
        newErrors.conferenceName = 'Conference name is required for Conference Paper';
      }
    } else if (step === 2) {
      if (!formData.authors || formData.authors.length === 0) {
        newErrors.authors = 'At least one author is required';
      } else if (!formData.authors[0]?.name) {
        newErrors.authors = 'First author name is required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(6, prev + 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    try {
      const saved = savePublication({
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
    if (!validateStep(1) || !validateStep(2)) {
      setSubmitError('Please fill mandatory fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const saved = savePublication({
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
          maxWidth: '940px',
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
              <BookOpen size={14} /> Research & Publications • Bibliographic Registry
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#FFFFFF', fontFamily: 'Cinzel, serif' }}>
              {initialData ? `Edit Publication (${initialData.publicationRecordNumber || initialData.id})` : 'Record Research Publication'}
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
            { step: 1, label: 'Publication Type' },
            { step: 2, label: 'Bibliographic Details' },
            { step: 3, label: 'Authors' },
            { step: 4, label: 'Indexing & IDs' },
            { step: 5, label: 'Evidence & Proof' },
            { step: 6, label: 'Review & Submit' }
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
                {s.step < 6 && <ChevronRight size={13} style={{ color: '#CBD5E1', marginLeft: '0.2rem' }} />}
              </div>
            );
          })}
        </div>

        {/* 3. Form Body Canvas */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          {submitError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{submitError}</span>
            </div>
          )}
          {doiLookupError && (
            <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', color: '#B45309', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{doiLookupError}</span>
            </div>
          )}
          <AnimatePresence mode="wait">
            {/* ──────── STEP 1: TYPE & OWNERSHIP ──────── */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="RESEARCH OUTPUT TYPE *">
                    <Select value={formData.publicationType} onChange={(e) => setFormData({ ...formData, publicationType: e.target.value })}>
                      {PUBLICATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                  </FormField>

                  <FormField label="OWNERSHIP & CONTRIBUTION">
                    <Select value={formData.paperOwnerType} onChange={(e) => setFormData({ ...formData, paperOwnerType: e.target.value })}>
                      <option value="Faculty Publication">Faculty Publication</option>
                      <option value="Student Publication">Student Publication</option>
                      <option value="Joint Faculty + Student">Joint Faculty + Student</option>
                      <option value="External Collaborative">External Collaborative Research</option>
                    </Select>
                  </FormField>
                </div>

                {/* Instant Crossref Auto-Lookup Box */}
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    QUICK AUTOFILL VIA OFFICIAL CROSSREF DOI
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <Input
                        placeholder="Enter DOI (e.g. 10.1109/TCE.2025.3421098)"
                        value={formData.doi}
                        onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCrossrefLookup}
                      disabled={doiLookupLoading}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#070F1E',
                        color: '#F1C40F',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Sparkles size={14} /> {doiLookupLoading ? 'Fetching...' : 'Autofill via Crossref'}
                    </button>
                  </div>
                  {doiLookupSuccess && (
                    <div style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={13} /> Official Crossref metadata retrieved successfully!
                    </div>
                  )}
                </div>

                <FormField label="PUBLICATION TITLE *" error={errors.title}>
                  <Input
                    placeholder="Enter official paper title as published..."
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

                  <FormField label="PUBLICATION DATE *" error={errors.publicationDate}>
                    <DateInput value={formData.publicationDate} onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value, publicationYear: new Date(e.target.value).getFullYear() })} error={!!errors.publicationDate} />
                  </FormField>
                </div>
              </motion.div>
            )}

            {/* ──────── STEP 2: BIBLIOGRAPHIC DETAILS ──────── */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {formData.publicationType === 'Journal Article' ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                      <FormField label="JOURNAL NAME *" error={errors.journalName}>
                        <Input placeholder="e.g. IEEE Transactions on Consumer Electronics" value={formData.journalName} onChange={(e) => setFormData({ ...formData, journalName: e.target.value })} error={!!errors.journalName} />
                      </FormField>

                      <FormField label="PUBLISHER">
                        <Input placeholder="e.g. IEEE / Elsevier / Springer" value={formData.publisher} onChange={(e) => setFormData({ ...formData, publisher: e.target.value })} />
                      </FormField>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                      <FormField label="VOLUME">
                        <Input placeholder="Vol (e.g. 71)" value={formData.volume} onChange={(e) => setFormData({ ...formData, volume: e.target.value })} />
                      </FormField>
                      <FormField label="ISSUE">
                        <Input placeholder="Issue (e.g. 3)" value={formData.issue} onChange={(e) => setFormData({ ...formData, issue: e.target.value })} />
                      </FormField>
                      <FormField label="PAGE NUMBERS">
                        <Input placeholder="e.g. 1042-1055" value={formData.pages} onChange={(e) => setFormData({ ...formData, pages: e.target.value })} />
                      </FormField>
                      <FormField label="ISSN / eISSN">
                        <Input placeholder="0098-3063" value={formData.issn} onChange={(e) => setFormData({ ...formData, issn: e.target.value })} />
                      </FormField>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                      <FormField label="CONFERENCE NAME *" error={errors.conferenceName}>
                        <Input placeholder="e.g. IEEE International Conference on Smart Computing" value={formData.conferenceName} onChange={(e) => setFormData({ ...formData, conferenceName: e.target.value })} error={!!errors.conferenceName} />
                      </FormField>

                      <FormField label="ORGANIZED BY *">
                        <Input placeholder="e.g. IIT Madras & IEEE Computer Society" value={formData.organizedBy} onChange={(e) => setFormData({ ...formData, organizedBy: e.target.value })} />
                      </FormField>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                      <FormField label="VENUE / LOCATION">
                        <Input placeholder="e.g. Chennai, India" value={formData.conferenceLocation} onChange={(e) => setFormData({ ...formData, conferenceLocation: e.target.value })} />
                      </FormField>
                      <FormField label="ISBN / PROCEEDINGS">
                        <Input placeholder="ISBN (e.g. 978-1-6654-2109-8)" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} />
                      </FormField>
                    </div>
                  </>
                )}

                <FormField label="ABSTRACT">
                  <Textarea rows={3} placeholder="Comprehensive publication abstract describing research methodology, dataset, and findings..." value={formData.abstract} onChange={(e) => setFormData({ ...formData, abstract: e.target.value })} />
                </FormField>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                  <FormField label="KEYWORDS">
                    <Input placeholder="e.g. Edge AI, Deep Learning, Video Analytics, IoT" value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })} />
                  </FormField>
                  <FormField label="RESEARCH DOMAIN">
                    <Input placeholder="e.g. Artificial Intelligence / VLSI" value={formData.researchDomain} onChange={(e) => setFormData({ ...formData, researchDomain: e.target.value })} />
                  </FormField>
                </div>
              </motion.div>
            )}

            {/* ──────── STEP 3: AUTHORS ──────── */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                      AUTHORS & AFFILIATIONS ({formData.authors.length})
                    </span>
                    <p style={{ fontSize: '0.74rem', color: '#64748B', margin: 0 }}>Map internal faculty authors, student researchers, or external collaborative co-authors.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAuthor}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.85rem', background: '#070F1E', color: '#F1C40F', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    <Plus size={13} /> Add Author
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {formData.authors.map((auth, idx) => (
                    <div key={idx} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D4AF37' }}>
                          AUTHOR #{auth.authorOrder} {auth.isFirstAuthor && '(FIRST AUTHOR)'} {auth.isCorresponding && '• (CORRESPONDING)'}
                        </span>
                        {formData.authors.length > 1 && (
                          <button type="button" onClick={() => handleRemoveAuthor(idx)} style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer' }}>
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '0.65rem' }}>
                        <FormField label="AUTHOR TYPE">
                          <Select value={auth.authorType} onChange={(e) => handleUpdateAuthor(idx, 'authorType', e.target.value)}>
                            <option value="INTERNAL_FACULTY">Internal Faculty</option>
                            <option value="INTERNAL_STUDENT">Internal Student</option>
                            <option value="EXTERNAL_AUTHOR">External Author</option>
                          </Select>
                        </FormField>

                        {auth.authorType === 'INTERNAL_FACULTY' ? (
                          <FormField label="SELECT FROM DIRECTORY">
                            <Select value={auth.facultyId} onChange={(e) => handleUpdateAuthor(idx, 'facultyId', e.target.value)}>
                              <option value="">Select Faculty Name</option>
                              {FACULTY_DATA.map(f => (
                                <option key={f.id} value={f.id}>{f.name} ({f.department} - {f.designation})</option>
                              ))}
                            </Select>
                          </FormField>
                        ) : (
                          <FormField label="AUTHOR FULL NAME *">
                            <Input placeholder="Full Name" value={auth.name} onChange={(e) => handleUpdateAuthor(idx, 'name', e.target.value)} />
                          </FormField>
                        )}

                        <FormField label="DEPARTMENT / AFFILIATION">
                          <Input placeholder="Department / Org" value={auth.department || auth.affiliation} onChange={(e) => handleUpdateAuthor(idx, 'department', e.target.value)} />
                        </FormField>
                      </div>

                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <input type="checkbox" id={`first_${idx}`} checked={auth.isFirstAuthor} onChange={(e) => handleUpdateAuthor(idx, 'isFirstAuthor', e.target.checked)} />
                          <label htmlFor={`first_${idx}`} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A' }}>First / Primary Author</label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <input type="checkbox" id={`corr_${idx}`} checked={auth.isCorresponding} onChange={(e) => handleUpdateAuthor(idx, 'isCorresponding', e.target.checked)} />
                          <label htmlFor={`corr_${idx}`} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A' }}>Corresponding Author</label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ──────── STEP 4: INDEXING & IDS ──────── */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <FormField label="CANONICAL DOI">
                    <Input placeholder="10.1109/TCE.2025.3421098" value={formData.doi} onChange={(e) => setFormData({ ...formData, doi: e.target.value })} />
                  </FormField>
                  <FormField label="SCOPUS EID">
                    <Input placeholder="2-s2.0-85150091234" value={formData.scopusEid} onChange={(e) => setFormData({ ...formData, scopusEid: e.target.value })} />
                  </FormField>
                  <FormField label="WOS UID">
                    <Input placeholder="WOS:000789123000008" value={formData.wosUid} onChange={(e) => setFormData({ ...formData, wosUid: e.target.value })} />
                  </FormField>
                </div>

                {/* Indexing Badges Multi-Select */}
                <div>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    SELECT REPUTABLE INDEXING (NAAC / NBA COMPLIANT)
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {INDEXING_OPTIONS.map(opt => {
                      const isSelected = formData.indexing.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleIndexing(opt)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: '9999px',
                            border: isSelected ? '1px solid #D4AF37' : '1px solid #CBD5E1',
                            background: isSelected ? '#070F1E' : '#FFFFFF',
                            color: isSelected ? '#F1C40F' : '#475569',
                            fontSize: '0.76rem',
                            fontWeight: isSelected ? 800 : 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isSelected ? '✓ ' : '+ '} {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '10px' }}>
                  <FormField label="IMPACT FACTOR">
                    <Input placeholder="e.g. 4.2" value={formData.impactFactor} onChange={(e) => setFormData({ ...formData, impactFactor: e.target.value })} />
                  </FormField>
                  <FormField label="IMPACT SOURCE">
                    <Select value={formData.impactFactorSource} onChange={(e) => setFormData({ ...formData, impactFactorSource: e.target.value })}>
                      <option value="JCR">Clarivate JCR</option>
                      <option value="Scopus">Scopus CiteScore</option>
                      <option value="SJR">SCImago SJR</option>
                    </Select>
                  </FormField>
                  <FormField label="QUARTILE">
                    <Select value={formData.quartile} onChange={(e) => setFormData({ ...formData, quartile: e.target.value })}>
                      <option value="">Select Quartile</option>
                      <option value="Q1">Q1 (Top 25%)</option>
                      <option value="Q2">Q2 (25% - 50%)</option>
                      <option value="Q3">Q3 (50% - 75%)</option>
                      <option value="Q4">Q4 (75% - 100%)</option>
                    </Select>
                  </FormField>
                </div>
              </motion.div>
            )}

            {/* ──────── STEP 5: EVIDENCE ──────── */}
            {currentStep === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', background: '#F8FAFC' }}>
                  <Upload size={28} style={{ color: '#D4AF37', margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                    Upload Paper PDF, Acceptance Letter & Certificates
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 1rem' }}>
                    Official proof files for research repository verification and accreditation.
                  </p>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#070F1E', color: '#F1C40F', padding: '0.5rem 1.15rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <Upload size={14} /> Attach Proof Document
                    <input type="file" accept=".pdf,.png,.jpg" onChange={(e) => handleFileUpload(e, 'Full Paper PDF')} style={{ display: 'none' }} />
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

            {/* ──────── STEP 6: REVIEW & SUBMIT ──────── */}
            {currentStep === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', padding: '1.25rem', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase' }}>
                    {formData.publicationType} • {formData.academicYear}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>
                    {formData.title || 'Untitled Publication'}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    {formData.journalName || formData.conferenceName} ({formData.publicationYear})
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Authors</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{formData.authors.length} Author(s)</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>DOI</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284C7' }}>{formData.doi || 'None Provided'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Indexing</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>{formData.indexing.join(', ') || 'General'}</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0.85rem 1rem', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065F46', fontSize: '0.8rem' }}>
                  <Sparkles size={16} /> Submitting initiates departmental review and NAAC Criterion 3 / Scopus compliance validation.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Footer */}
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

            {currentStep < 6 ? (
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

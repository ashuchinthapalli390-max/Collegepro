import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Send, 
  UploadCloud, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Info,
  Calendar,
  Clock,
  Video,
  Globe,
  MapPin
} from 'lucide-react';
import { ET_DEPARTMENTS } from '../../../data/masterData.js';
import BosStepper from './BosStepper.jsx';
import MembersStep from './MembersStep.jsx';
import FormField from '../../ui/form/FormField.jsx';
import { Input, DateInput, Select, Textarea } from '../../ui/form/FormControls.jsx';

export default function BosWizardModal({
  isOpen,
  onClose,
  initialData = null,
  currentUser,
  onSaveDraft,
  onSubmitForReview
}) {
  const shouldReduceMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [unsavedConfirmOpen, setUnsavedConfirmOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [modalError, setModalError] = useState('');

  const availableRegulations = ['R16', 'R19', 'R20', 'R23', 'R26'];

  // Clean, 100% EMPTY initial form state
  const getInitialState = () => {
    if (initialData) {
      return {
        ...initialData,
        startTime: initialData.startTime || '10:00',
        endTime: initialData.endTime || '13:00',
        rescheduleHistory: initialData.rescheduleHistory || [],
        universityNominee: initialData.universityNominee || { name: '', institution: '', designation: '', email: '', phone: '', isSaved: false },
        academicians: initialData.academicians || [],
        industryMember: initialData.industryMember || { name: '', company: '', designation: '', isSaved: false },
        alumniMember: initialData.alumniMember || { name: '', company: '', designation: '', isSaved: false },
        agendaItems: initialData.agendaItems || [],
        documents: initialData.documents || []
      };
    }

    const defaultDept = currentUser?.role === 'HOD' ? (currentUser.dept || 'CYS') : 'CYS';

    return {
      department: defaultDept,
      regulations: ['R23'],
      academicYear: '2025-26',
      title: '',
      bosDate: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '13:00',
      meetingMode: 'Hybrid', // 'Hybrid' | 'Offline' | 'Online'
      venue: '',
      meetingLink: '',
      meetingStatus: 'SCHEDULED',
      rescheduleHistory: [],
      newBosDate: '',
      newStartTime: '',
      newEndTime: '',
      postponeReason: '',
      postponeRemarks: '',

      // Members - Direct Manual Form Defaults
      chairmanFacultyId: '',
      chairmanName: '',
      chairmanDesignation: 'Professor & HOD',
      chairmanDepartment: defaultDept,
      chairmanInstitution: 'Narasaraopeta Engineering College (Autonomous)',
      chairmanEmail: '',
      chairmanPhone: '',
      chairmanPhoto: null,

      universityNominee: {
        name: '',
        institution: '',
        designation: '',
        email: '',
        phone: '',
        department: '',
        remarks: '',
        isSaved: false
      },

      academicians: [],

      industryMember: {
        name: '',
        company: '',
        designation: '',
        domain: '',
        email: '',
        phone: '',
        remarks: '',
        isSaved: false
      },

      alumniMember: {
        name: '',
        company: '',
        designation: '',
        batch: '',
        department: '',
        email: '',
        phone: '',
        remarks: '',
        isSaved: false
      },

      // Agenda & Documents
      agendaItems: [
        { itemNo: 1, title: '', description: '', decision: '', startTime: '10:00', endTime: '10:45' }
      ],
      documents: [],
      internalNotes: ''
    };
  };

  const [formData, setFormData] = useState(getInitialState);

  if (!isOpen) return null;

  // Handle Regulation Chip Toggle
  const handleToggleRegulation = (reg) => {
    setFormData(prev => {
      const exists = prev.regulations.includes(reg);
      const updated = exists ? prev.regulations.filter(r => r !== reg) : [...prev.regulations, reg];
      return { ...prev, regulations: updated };
    });
    if (validationErrors.regulations) {
      setValidationErrors(prev => ({ ...prev, regulations: null }));
    }
  };

  // Agenda Item Actions
  const handleAddAgenda = () => {
    setFormData(prev => ({
      ...prev,
      agendaItems: [
        ...prev.agendaItems,
        { itemNo: prev.agendaItems.length + 1, title: '', description: '', decision: '', startTime: '', endTime: '' }
      ]
    }));
  };

  const handleUpdateAgenda = (idx, field, val) => {
    setFormData(prev => {
      const updated = [...prev.agendaItems];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, agendaItems: updated };
    });
  };

  const handleRemoveAgenda = (idx) => {
    setFormData(prev => ({
      ...prev,
      agendaItems: prev.agendaItems.filter((_, i) => i !== idx).map((it, i) => ({ ...it, itemNo: i + 1 }))
    }));
  };

  // Shift Agenda Times Helper
  const handleShiftAgendaTimes = () => {
    if (!formData.newStartTime) return;
    setFormData(prev => {
      return {
        ...prev,
        agendaItems: prev.agendaItems.map((item, idx) => ({
          ...item,
          startTime: idx === 0 ? prev.newStartTime : item.startTime
        }))
      };
    });
  };

  // Document Upload
  const handleFileUpload = (e, type = 'MINUTES') => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setModalError('Only verified PDF files are supported for statutory records.');
      return;
    }

    setModalError('');
    const newDoc = {
      id: 'doc_' + Date.now(),
      title: type === 'MINUTES' ? 'Minutes of Meeting (Signed)' : file.name.replace('.pdf', ''),
      filename: file.name,
      type,
      sizeBytes: file.size || 1048576,
      version: 'v1.0',
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser?.name || 'Administrator'
    };

    setFormData(prev => ({
      ...prev,
      documents: [newDoc, ...prev.documents]
    }));
  };

  // Step Validation Logic
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.department) errors.department = 'Department is required';
      if (!formData.regulations || formData.regulations.length === 0) errors.regulations = 'Select at least one regulation';
      if (!formData.bosDate) errors.bosDate = 'Meeting date is required';
      if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
        errors.meetingTimes = 'Start time must be earlier than End time';
      }
    } else if (step === 2) {
      if (!formData.chairmanName?.trim()) errors.chairman = 'Chairman name is required';
      if (!formData.chairmanDesignation?.trim()) errors.chairmanDesignation = 'Chairman designation is required';
      if (!formData.universityNominee?.name?.trim() || !formData.universityNominee?.institution?.trim()) {
        errors.universityNominee = 'University Nominee name and institution are required';
      }
    } else if (step === 3) {
      if (formData.meetingStatus === 'POSTPONED') {
        if (!formData.newBosDate) errors.postpone = 'Please specify the rescheduled meeting date';
        if (formData.newStartTime && formData.newEndTime && formData.newStartTime >= formData.newEndTime) {
          errors.postponeTimes = 'Rescheduled Start time must be earlier than End time';
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setModalError('');
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevStep = () => {
    setModalError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDraftClick = async () => {
    setIsSavingDraft(true);
    setModalError('');
    try {
      await onSaveDraft(formData);
      setDraftSavedToast(true);
      setTimeout(() => setDraftSavedToast(false), 3000);
    } catch (err) {
      setModalError(err.message);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmitReviewClick = () => {
    if (!validateStep(1) || !validateStep(2)) {
      setModalError('Please ensure all required fields in Basic Details and Members are completed.');
      return;
    }
    setModalError('');
    onSubmitForReview(formData);
  };

  // Contextual Continue Button Label
  const getContinueLabel = () => {
    switch (currentStep) {
      case 1:
        return 'Continue to Members';
      case 2:
        return 'Continue to Meeting & Agenda';
      case 3:
        return 'Continue to Documents';
      case 4:
        return 'Review Meeting Dossier';
      case 5:
      default:
        return 'Submit for Review';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 15, 30, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 1100
    }}>
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 15 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 15 }}
        style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden'
        }}
      >
        {/* 1. Modal Top Header */}
        <div style={{
          background: '#070F1E',
          padding: '1.25rem 1.75rem',
          color: '#FFFFFF',
          borderBottom: '2px solid #D4AF37'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Cinzel, Georgia, serif' }}>
                {initialData ? 'Edit Board of Studies Record' : 'Create Board of Studies Meeting'}
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '0.2rem' }}>
                {formData.department} Department • Academic Governance
              </div>
            </div>

            <button
              type="button"
              onClick={() => setUnsavedConfirmOpen(true)}
              aria-label="Close"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="hover:bg-white/20"
            >
              <X size={17} />
            </button>
          </div>

          {/* Stepper Bar */}
          <BosStepper
            currentStep={currentStep}
            onSelectStep={(s) => {
              if (validateStep(currentStep)) setCurrentStep(s);
            }}
          />
        </div>

        {/* 2. Step Content Canvas */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, backgroundColor: '#FFFFFF' }}>
          {modalError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{modalError}</span>
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {/* ──────── STEP 1: BASIC DETAILS ──────── */}
              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormField label="DEPARTMENT" required error={validationErrors.department}>
                      <Select
                        value={formData.department}
                        disabled={currentUser?.role === 'HOD'}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        error={!!validationErrors.department}
                      >
                        {ET_DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}
                      </Select>
                    </FormField>

                    <FormField label="ACADEMIC YEAR" required>
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

                  {/* Multi-Regulation Chips */}
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      REGULATIONS COVERED <span style={{ color: '#DC2626' }}>*</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {availableRegulations.map(reg => {
                        const isSelected = formData.regulations.includes(reg);
                        return (
                          <button
                            key={reg}
                            type="button"
                            onClick={() => handleToggleRegulation(reg)}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              border: `1.5px solid ${isSelected ? '#D4AF37' : '#CBD5E1'}`,
                              background: isSelected ? 'rgba(212, 175, 55, 0.12)' : '#FFFFFF',
                              color: isSelected ? '#B45309' : '#334155',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span>{reg} Regulation</span>
                            {isSelected && <Check size={14} style={{ color: '#D4AF37' }} />}
                          </button>
                        );
                      })}
                    </div>
                    {validationErrors.regulations && (
                      <div style={{ fontSize: '0.72rem', color: '#DC2626', marginTop: '0.3rem' }}>
                        {validationErrors.regulations}
                      </div>
                    )}
                  </div>

                  {/* Meeting Date & Mode */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormField label="MEETING DATE" required error={validationErrors.bosDate}>
                      <DateInput
                        required
                        value={formData.bosDate}
                        onChange={(e) => setFormData({ ...formData, bosDate: e.target.value })}
                        error={!!validationErrors.bosDate}
                      />
                    </FormField>

                    <FormField label="MEETING MODE" required>
                      <Select
                        value={formData.meetingMode}
                        onChange={(e) => setFormData({ ...formData, meetingMode: e.target.value })}
                      >
                        <option value="Hybrid">Hybrid (In-person + Virtual)</option>
                        <option value="Offline">Offline (Campus Only)</option>
                        <option value="Online">Online (Virtual Only)</option>
                      </Select>
                    </FormField>
                  </div>

                  {/* Meeting Time Slots */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormField label="START TIME (24h or HH:MM)" error={validationErrors.meetingTimes}>
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        icon={Clock}
                      />
                    </FormField>
                    <FormField label="END TIME (24h or HH:MM)">
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        icon={Clock}
                      />
                    </FormField>
                  </div>

                  {/* Conditional Animated Venue / Meeting Link Sections */}
                  <AnimatePresence>
                    {(formData.meetingMode === 'Offline' || formData.meetingMode === 'Hybrid') && (
                      <motion.div
                        layout
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
                        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto', y: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
                      >
                        <FormField label="VENUE / ROOM DETAILS" description="Physical meeting room on campus.">
                          <Input
                            type="text"
                            placeholder="e.g. Conference Hall - 1, Admin Block, NEC"
                            value={formData.venue}
                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                            icon={MapPin}
                          />
                        </FormField>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {(formData.meetingMode === 'Online' || formData.meetingMode === 'Hybrid') && (
                      <motion.div
                        layout
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
                        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto', y: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
                      >
                        <FormField label="PRIVATE MEETING LINK (INTERNAL ONLY)" description="Encrypted virtual room link for external & remote members.">
                          <Input
                            type="url"
                            placeholder="https://meet.google.com/..."
                            value={formData.meetingLink}
                            onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                            icon={Video}
                          />
                        </FormField>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ──────── STEP 2: MEMBERS STEP (100% EMPTY START) ──────── */}
              {currentStep === 2 && (
                <MembersStep
                  formData={formData}
                  setFormData={setFormData}
                  validationErrors={validationErrors}
                  setValidationErrors={setValidationErrors}
                />
              )}

              {/* ──────── STEP 3: MEETING & AGENDA ──────── */}
              {currentStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <FormField label="START TIME">
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        icon={Clock}
                      />
                    </FormField>

                    <FormField label="END TIME">
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        icon={Clock}
                      />
                    </FormField>

                    <FormField label="MEETING STATUS">
                      <Select
                        value={formData.meetingStatus}
                        onChange={(e) => setFormData({ ...formData, meetingStatus: e.target.value })}
                      >
                        <option value="SCHEDULED">SCHEDULED</option>
                        <option value="HELD">HELD</option>
                        <option value="POSTPONED">POSTPONED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </Select>
                    </FormField>
                  </div>

                  {/* Rescheduled Section on POSTPONED */}
                  {formData.meetingStatus === 'POSTPONED' && (
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1.5px dashed rgba(245, 158, 11, 0.4)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#B45309', fontWeight: 800, fontSize: '0.88rem' }}>
                          <AlertCircle size={16} /> Rescheduled Meeting Schedule
                        </div>
                        <button
                          type="button"
                          onClick={handleShiftAgendaTimes}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            color: '#0F172A'
                          }}
                        >
                          Shift Agenda Times to New Start Time
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                            NEW MEETING DATE <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          <DateInput
                            value={formData.newBosDate || ''}
                            onChange={(e) => setFormData({ ...formData, newBosDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                            NEW START TIME
                          </label>
                          <Input
                            type="time"
                            value={formData.newStartTime || ''}
                            onChange={(e) => setFormData({ ...formData, newStartTime: e.target.value })}
                            icon={Clock}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                            NEW END TIME
                          </label>
                          <Input
                            type="time"
                            value={formData.newEndTime || ''}
                            onChange={(e) => setFormData({ ...formData, newEndTime: e.target.value })}
                            icon={Clock}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                            REASON FOR POSTPONEMENT
                          </label>
                          <Input
                            type="text"
                            placeholder="e.g. University Nominee availability conflict"
                            value={formData.postponeReason || ''}
                            onChange={(e) => setFormData({ ...formData, postponeReason: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                            REMARKS
                          </label>
                          <Input
                            type="text"
                            placeholder="Additional notes for members..."
                            value={formData.postponeRemarks || ''}
                            onChange={(e) => setFormData({ ...formData, postponeRemarks: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Agenda Table */}
                  <div style={{ background: '#F8FAFC', padding: '1.1rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                        Structured Agenda & Resolutions ({formData.agendaItems.length})
                      </div>
                      <button
                        type="button"
                        onClick={handleAddAgenda}
                        style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        + Add Agenda Item
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {formData.agendaItems.map((item, idx) => (
                        <div key={idx} style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#D4AF37' }}>ITEM #{item.itemNo}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <input
                                  type="time"
                                  value={item.startTime || ''}
                                  onChange={(e) => handleUpdateAgenda(idx, 'startTime', e.target.value)}
                                  style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                />
                                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>to</span>
                                <input
                                  type="time"
                                  value={item.endTime || ''}
                                  onChange={(e) => handleUpdateAgenda(idx, 'endTime', e.target.value)}
                                  style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAgenda(idx)}
                              style={{ color: '#DC2626', background: 'transparent', border: 'none', cursor: 'pointer' }}
                              aria-label="Remove agenda item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <Input
                            type="text"
                            placeholder="Agenda Item Title (e.g. R23 Syllabus Approval)"
                            value={item.title}
                            onChange={(e) => handleUpdateAgenda(idx, 'title', e.target.value)}
                            style={{ marginBottom: '0.4rem' }}
                          />
                          <Textarea
                            rows={2}
                            placeholder="Decision / Resolution Summary..."
                            value={item.decision}
                            onChange={(e) => handleUpdateAgenda(idx, 'decision', e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ──────── STEP 4: DOCUMENTS ──────── */}
              {currentStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{
                    border: '2px dashed #CBD5E1',
                    borderRadius: '14px',
                    padding: '2rem',
                    textAlign: 'center',
                    background: '#F8FAFC'
                  }}>
                    <UploadCloud size={40} style={{ color: '#3B82F6', margin: '0 auto 0.5rem auto' }} />
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                      Upload Signed Minutes of Meeting (PDF)
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: '1rem' }}>
                      Official PDF document (Max 20MB) • Authenticated storage
                    </div>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: '#070F1E',
                      color: '#F1C40F',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}>
                      <UploadCloud size={15} /> Browse PDF File
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e, 'MINUTES')}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                      Attached Statutory Documents ({formData.documents.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {formData.documents.length === 0 ? (
                        <div style={{ fontSize: '0.78rem', color: '#64748B', fontStyle: 'italic' }}>
                          No documents attached yet.
                        </div>
                      ) : (
                        formData.documents.map(doc => (
                          <div
                            key={doc.id}
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid #E2E8F0',
                              borderRadius: '10px',
                              padding: '0.75rem 1rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <FileText size={20} style={{ color: '#EF4444' }} />
                              <div>
                                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>{doc.title}</div>
                                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                  {doc.filename} • {(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB • {doc.version}
                                </div>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 700, background: '#ECFDF5', padding: '0.15rem 0.55rem', borderRadius: '4px' }}>
                              Uploaded
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ──────── STEP 5: REVIEW & SUBMIT ──────── */}
              {currentStep === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0' }}>
                      Board of Studies Executive Overview
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', fontSize: '0.82rem' }}>
                      <div><strong>Department:</strong> {formData.department}</div>
                      <div><strong>Academic Year:</strong> {formData.academicYear}</div>
                      <div><strong>Regulations:</strong> {formData.regulations?.join(', ') || 'N/A'}</div>
                      <div><strong>Meeting Date:</strong> {formData.bosDate}</div>
                      <div><strong>Mode:</strong> {formData.meetingMode}</div>
                      <div><strong>Chairman:</strong> {formData.chairmanName || 'Unassigned'}</div>
                      <div><strong>Nominee:</strong> {formData.universityNominee?.name || 'Unassigned'} ({formData.universityNominee?.institution || 'N/A'})</div>
                      <div><strong>Academic Experts:</strong> {formData.academicians?.length || 0} members</div>
                      <div><strong>Documents Attached:</strong> {formData.documents?.length || 0} files</div>
                    </div>
                  </div>

                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '0.85rem', fontSize: '0.78rem', color: '#1E40AF', display: 'flex', gap: '0.6rem' }}>
                    <Info size={18} style={{ flexShrink: 0 }} />
                    <div>
                      Submitting this statutory record will lock its state to <strong>SUBMITTED</strong> and notify the College Academic Administration & Super Admin for compliance review.
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. Fixed Bottom Action Bar */}
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
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#475569',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              className="hover:bg-slate-100"
            >
              <X size={15} /> Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePrevStep}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#334155',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              className="hover:bg-slate-100"
            >
              <ChevronLeft size={15} /> Back
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Save Draft Button */}
            <button
              type="button"
              onClick={handleSaveDraftClick}
              disabled={isSavingDraft}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.55rem 1.05rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#0F172A',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              className="hover:bg-slate-100"
            >
              {draftSavedToast ? <><Check size={14} style={{ color: '#10B981' }} /> Saved</> : (isSavingDraft ? 'Saving...' : 'Save Draft')}
            </button>

            {/* Contextual Continue / Submit Button */}
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#070F1E',
                  color: '#F1C40F',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
                className="hover:scale-105 transition-transform"
              >
                {getContinueLabel()} <ChevronRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitReviewClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.55rem 1.35rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                  color: '#070F1E',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 3px 12px rgba(212, 175, 55, 0.35)'
                }}
                className="hover:scale-105 transition-transform"
              >
                <Send size={14} /> Submit for Review
              </button>
            )}
          </div>
        </div>

        {/* Unsaved Changes Confirmation Modal */}
        {unsavedConfirmOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 15, 30, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1300
          }}>
            <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.5rem', maxWidth: '420px', width: '100%', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
                You have unsaved changes
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
                Closing this window will discard entered details unless you save a draft.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setUnsavedConfirmOpen(false)}
                  style={{ padding: '0.45rem 0.95rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Continue Editing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUnsavedConfirmOpen(false);
                    onClose();
                  }}
                  style={{ padding: '0.45rem 1rem', borderRadius: '8px', border: 'none', background: '#DC2626', color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

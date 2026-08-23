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
  User, 
  Users, 
  Calendar, 
  Clock, 
  Building2, 
  DollarSign, 
  AlertCircle, 
  Trash2,
  ExternalLink,
  Sparkles,
  Plus
} from 'lucide-react';
import { DEPARTMENTS, FACULTY_DATA } from '../../../data/masterData.js';
import { saveFDP, getMoUs } from '../../../data/portalStore.js';
import FormField from '../../ui/form/FormField.jsx';
import { Input, DateInput, Select, Textarea } from '../../ui/form/FormControls.jsx';

const PROGRAMME_TYPES = [
  'Faculty Development Programme (FDP)',
  'Training Programme',
  'Workshop',
  'Refresher Course',
  'Orientation Programme',
  'Capacity Building Programme',
  'Certification Programme',
  'Other'
];

export default function FdpOrganizedWizardModal({
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
  const [errors, setErrors] = useState({});

  const mousList = getMoUs ? getMoUs() : [];

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        resourcePersons: initialData.resourcePersons || [],
        documents: initialData.documents || [],
        financials: initialData.financials || { hasFinance: false, amount: 0, invoiceNumber: '', paymentStatus: 'Paid' }
      };
    }

    const defaultDept = currentUser?.role === 'HOD' ? (currentUser.dept || 'CSE') : 'CSE';

    return {
      department: defaultDept,
      academicYear: '2025-26',
      fdpTitle: '',
      programmeType: 'Faculty Development Programme (FDP)',
      mode: 'Offline',
      venue: 'Main Seminar Hall',
      platformName: '',
      privateMeetingUrl: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      durationDays: 6,
      totalHours: 36,
      coordinatorFacultyId: '',
      coordinatorName: '',
      coordinatorDesignation: '',
      coCoordinatorName: '',
      resourcePersons: [
        { name: '', designation: '', organization: '', topic: '', isExternal: true }
      ],
      noParticipants: 60,
      internalParticipants: 45,
      externalParticipants: 15,
      isMouAssociated: 'No',
      associatedMoU: '',
      financials: {
        hasFinance: 'Yes',
        amount: 50000,
        invoiceNumber: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        fundingSource: 'AICTE / College Sponsored',
        sponsor: '',
        paymentStatus: 'Paid'
      },
      objectives: '',
      topicsCovered: '',
      programmeStatus: 'COMPLETED',
      documents: []
    };
  });

  const handleCoordinatorSelect = (facId) => {
    const fac = FACULTY_DATA.find(f => f.id === facId);
    if (fac) {
      setFormData(prev => ({
        ...prev,
        coordinatorFacultyId: fac.id,
        coordinatorName: fac.name,
        coordinatorDesignation: fac.designation
      }));
    }
  };

  const handleAddResourcePerson = () => {
    setFormData(prev => ({
      ...prev,
      resourcePersons: [
        ...prev.resourcePersons,
        { name: '', designation: '', organization: '', topic: '', isExternal: true }
      ]
    }));
  };

  const handleUpdateResourcePerson = (index, field, value) => {
    const updated = [...formData.resourcePersons];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, resourcePersons: updated }));
  };

  const handleRemoveResourcePerson = (index) => {
    setFormData(prev => ({
      ...prev,
      resourcePersons: prev.resourcePersons.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc = {
      id: 'DOC-' + Date.now(),
      name: file.name,
      type: file.name.endsWith('.pdf') ? 'PDF' : 'Image',
      category: 'Brochure / Report / Photos',
      size: (file.size / 1024).toFixed(1) + ' KB',
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file)
    };

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDoc]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fdpTitle) newErrors.fdpTitle = 'Programme title is required';
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.endDate) newErrors.endDate = 'End date is required';
    } else if (step === 2) {
      if (!formData.coordinatorName && !formData.coordinatorFacultyId) {
        newErrors.coordinatorName = 'Primary coordinator is required';
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
    const saved = saveFDP({
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

  const handleSubmit = () => {
    if (!validateStep(1) || !validateStep(2)) {
      alert('Please fill mandatory fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    const saved = saveFDP({
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
        {/* Header */}
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
              <Award size={14} /> Faculty Development • Institutional Programmes
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#FFFFFF', fontFamily: 'Cinzel, serif' }}>
              {initialData ? 'Edit FDP / Training Record' : 'Record Organized FDP / Workshop'}
            </h2>
          </div>
          <button type="button" onClick={() => setUnsavedConfirmOpen(true)} style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#94A3B8', borderRadius: '8px', padding: '0.45rem', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Stepper */}
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
            { step: 1, label: 'Programme Info' },
            { step: 2, label: 'Coordinators & Experts' },
            { step: 3, label: 'Participants & MoU' },
            { step: 4, label: 'Financials' },
            { step: 5, label: 'Documents & Submit' }
          ].map((s) => {
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;
            return (
              <div
                key={s.step}
                onClick={() => isDone && setCurrentStep(s.step)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: isDone ? 'pointer' : 'default', opacity: isActive ? 1 : (isDone ? 0.85 : 0.45) }}
              >
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: isActive ? '#070F1E' : (isDone ? '#10B981' : '#CBD5E1'), color: isActive ? '#F1C40F' : '#FFFFFF', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: isActive ? '2px solid #D4AF37' : 'none' }}>
                  {isDone ? <Check size={13} /> : s.step}
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#0F172A' : '#64748B', whiteSpace: 'nowrap' }}>{s.label}</span>
                {s.step < 5 && <ChevronRight size={14} style={{ color: '#CBD5E1', marginLeft: '0.25rem' }} />}
              </div>
            );
          })}
        </div>

        {/* Body Canvas */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="DEPARTMENT / ORGANIZING CELL *" error={errors.department}>
                    <Select value={formData.department} disabled={currentUser?.role === 'HOD'} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                      {DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}
                    </Select>
                  </FormField>

                  <FormField label="ACADEMIC YEAR *">
                    <Select value={formData.academicYear} onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}>
                      <option value="2026-27">2026-27</option>
                      <option value="2025-26">2025-26</option>
                      <option value="2024-25">2024-25</option>
                    </Select>
                  </FormField>
                </div>

                <FormField label="PROGRAMME TITLE *" error={errors.fdpTitle}>
                  <Input
                    placeholder="e.g. AICTE Sponsored One-Week National FDP on Generative AI Engineering"
                    value={formData.fdpTitle}
                    onChange={(e) => setFormData({ ...formData, fdpTitle: e.target.value })}
                    error={!!errors.fdpTitle}
                  />
                </FormField>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="PROGRAMME TYPE">
                    <Select value={formData.programmeType} onChange={(e) => setFormData({ ...formData, programmeType: e.target.value })}>
                      {PROGRAMME_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                    </Select>
                  </FormField>

                  <FormField label="DELIVERY MODE">
                    <Select value={formData.mode} onChange={(e) => setFormData({ ...formData, mode: e.target.value })}>
                      <option value="Offline">Offline (On-Campus)</option>
                      <option value="Online">Online (Virtual)</option>
                      <option value="Hybrid">Hybrid</option>
                    </Select>
                  </FormField>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <FormField label="START DATE *" error={errors.startDate}>
                    <DateInput value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} error={!!errors.startDate} />
                  </FormField>

                  <FormField label="END DATE *" error={errors.endDate}>
                    <DateInput value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} error={!!errors.endDate} />
                  </FormField>

                  <FormField label="VENUE / PLATFORM">
                    <Input placeholder="e.g. Main Seminar Hall / Zoom" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />
                  </FormField>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ background: '#F8FAFC', padding: '1.1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                    FACULTY COORDINATORS (FROM DIRECTORY)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormField label="PRIMARY COORDINATOR *" error={errors.coordinatorName}>
                      <Select
                        value={formData.coordinatorFacultyId}
                        onChange={(e) => handleCoordinatorSelect(e.target.value)}
                      >
                        <option value="">Select Faculty Coordinator</option>
                        {FACULTY_DATA.map(f => (
                          <option key={f.id} value={f.id}>{f.name} ({f.department} - {f.designation})</option>
                        ))}
                      </Select>
                    </FormField>

                    <FormField label="CO-COORDINATOR(S)">
                      <Input
                        placeholder="e.g. Dr. B. Jhansi Vazram & Dr. K. Raju"
                        value={formData.coCoordinatorName}
                        onChange={(e) => setFormData({ ...formData, coCoordinatorName: e.target.value })}
                      />
                    </FormField>
                  </div>
                </div>

                {/* Resource Persons */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                      RESOURCE PERSONS & EXPERTS ({formData.resourcePersons.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddResourcePerson}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem', background: '#070F1E', color: '#F1C40F', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                      <Plus size={13} /> Add Resource Person
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {formData.resourcePersons.map((rp, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr 1fr 30px', gap: '0.5rem', alignItems: 'center', background: '#F1F5F9', padding: '0.6rem', borderRadius: '8px' }}>
                        <Input placeholder="Expert Name (e.g. Dr. K. Srinivas)" value={rp.name} onChange={(e) => handleUpdateResourcePerson(idx, 'name', e.target.value)} />
                        <Input placeholder="Designation" value={rp.designation} onChange={(e) => handleUpdateResourcePerson(idx, 'designation', e.target.value)} />
                        <Input placeholder="Institution / Company (e.g. IIT Madras)" value={rp.organization} onChange={(e) => handleUpdateResourcePerson(idx, 'organization', e.target.value)} />
                        <Input placeholder="Topic / Domain" value={rp.topic} onChange={(e) => handleUpdateResourcePerson(idx, 'topic', e.target.value)} />
                        {formData.resourcePersons.length > 1 && (
                          <button type="button" onClick={() => handleRemoveResourcePerson(idx)} style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', borderRadius: '4px', height: '36px', cursor: 'pointer' }}>
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <FormField label="TOTAL PARTICIPANTS">
                    <Input type="number" value={formData.noParticipants} onChange={(e) => setFormData({ ...formData, noParticipants: e.target.value })} />
                  </FormField>
                  <FormField label="INTERNAL FACULTY">
                    <Input type="number" value={formData.internalParticipants} onChange={(e) => setFormData({ ...formData, internalParticipants: e.target.value })} />
                  </FormField>
                  <FormField label="EXTERNAL DELEGATES">
                    <Input type="number" value={formData.externalParticipants} onChange={(e) => setFormData({ ...formData, externalParticipants: e.target.value })} />
                  </FormField>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="CONDUCTED UNDER AN MOU?">
                    <Select value={formData.isMouAssociated} onChange={(e) => setFormData({ ...formData, isMouAssociated: e.target.value })}>
                      <option value="Yes">Yes (MoU Partner Collab)</option>
                      <option value="No">No (Independent / Autonomous)</option>
                    </Select>
                  </FormField>

                  {formData.isMouAssociated === 'Yes' && (
                    <FormField label="LINKED INSTITUTIONAL MOU">
                      <Select value={formData.associatedMoU} onChange={(e) => setFormData({ ...formData, associatedMoU: e.target.value })}>
                        <option value="">Select Associated MoU</option>
                        {mousList.map(m => (
                          <option key={m.id} value={m.organization || m.title}>{m.organization || m.title}</option>
                        ))}
                        <option value="MoU with Tata Consultancy Services (TCS)">MoU with TCS</option>
                        <option value="MoU with Cadence Design Systems">MoU with Cadence</option>
                      </Select>
                    </FormField>
                  )}
                </div>

                <FormField label="PROGRAMME OBJECTIVES & OUTCOMES">
                  <Textarea rows={3} placeholder="Key objectives, pedagogical outcomes, faculty benefits..." value={formData.objectives} onChange={(e) => setFormData({ ...formData, objectives: e.target.value })} />
                </FormField>
              </motion.div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="FINANCIAL TRANSACTION INVOLVED?">
                    <Select
                      value={formData.financials.hasFinance}
                      onChange={(e) => setFormData({ ...formData, financials: { ...formData.financials, hasFinance: e.target.value } })}
                    >
                      <option value="Yes">Yes (Sponsored / Invoiced)</option>
                      <option value="No">No (Non-Financial / Internal)</option>
                    </Select>
                  </FormField>

                  {formData.financials.hasFinance === 'Yes' && (
                    <FormField label="TOTAL GRANT / EXPEDIENT AMOUNT (₹)">
                      <Input
                        type="number"
                        placeholder="e.g. 150000"
                        value={formData.financials.amount}
                        onChange={(e) => setFormData({ ...formData, financials: { ...formData.financials, amount: e.target.value } })}
                      />
                    </FormField>
                  )}
                </div>

                {formData.financials.hasFinance === 'Yes' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <FormField label="INVOICE / SANCTION NUMBER">
                      <Input
                        placeholder="e.g. AICTE/FDP/2024/7821"
                        value={formData.financials.invoiceNumber}
                        onChange={(e) => setFormData({ ...formData, financials: { ...formData.financials, invoiceNumber: e.target.value } })}
                      />
                    </FormField>

                    <FormField label="FUNDING SPONSOR">
                      <Input
                        placeholder="e.g. AICTE / UGC / DST / Industry"
                        value={formData.financials.fundingSource}
                        onChange={(e) => setFormData({ ...formData, financials: { ...formData.financials, fundingSource: e.target.value } })}
                      />
                    </FormField>

                    <FormField label="PAYMENT / GRANT STATUS">
                      <Select
                        value={formData.financials.paymentStatus}
                        onChange={(e) => setFormData({ ...formData, financials: { ...formData.financials, paymentStatus: e.target.value } })}
                      >
                        <option value="Paid">Paid / Disbursed</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Pending">Pending Audit</option>
                      </Select>
                    </FormField>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5 */}
            {currentStep === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', background: '#F8FAFC' }}>
                  <Upload size={28} style={{ color: '#D4AF37', margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                    Upload FDP Brochure, Final Attendance Report, and Invoices
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 1rem' }}>
                    Upload supporting documents for NAAC Criterion-6 & NBA Tier-1 Faculty Development evidence.
                  </p>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#070F1E', color: '#F1C40F', padding: '0.5rem 1.15rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <Upload size={14} /> Attach Files
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>

                {/* Uploaded Documents List */}
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    ATTACHED EVIDENCE ({formData.documents.length})
                  </div>
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
                              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{doc.size}</div>
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
          </AnimatePresence>
        </div>

        {/* Action Footer */}
        <div style={{ background: '#F8FAFC', padding: '1rem 1.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {currentStep === 1 ? (
            <button type="button" onClick={() => setUnsavedConfirmOpen(true)} style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              <X size={15} /> Cancel
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
                <Check size={15} /> {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            )}
          </div>
        </div>

        {/* Confirmation modal */}
        {unsavedConfirmOpen && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(7, 15, 30, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '1rem' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.5rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
              <AlertCircle size={36} style={{ color: '#F59E0B', margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem' }}>Unsaved FDP Record</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 1.25rem' }}>Do you want to save draft before closing?</p>
              <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
                <button type="button" onClick={() => { setUnsavedConfirmOpen(false); onClose(); }} style={{ padding: '0.45rem 0.9rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.78rem', color: '#DC2626', fontWeight: 700, cursor: 'pointer' }}>Discard</button>
                <button type="button" onClick={() => { handleSaveDraft(); setUnsavedConfirmOpen(false); onClose(); }} style={{ padding: '0.45rem 1.1rem', borderRadius: '6px', border: 'none', background: '#070F1E', color: '#F1C40F', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Save Draft & Close</button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

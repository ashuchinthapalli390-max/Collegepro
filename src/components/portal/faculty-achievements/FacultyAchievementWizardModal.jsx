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
  GraduationCap, 
  User, 
  Building2, 
  Calendar, 
  Clock, 
  Search, 
  AlertCircle, 
  Trash2,
  ExternalLink,
  Sparkles,
  Award
} from 'lucide-react';
import { DEPARTMENTS, FACULTY_DATA } from '../../../data/masterData.js';
import { saveFacultyAchievement } from '../../../data/portalStore.js';
import FormField from '../../ui/form/FormField.jsx';
import { Input, DateInput, Select, Textarea } from '../../ui/form/FormControls.jsx';

const FACULTY_ACHIEVEMENT_TYPES = [
  'Faculty Development Programme (FDP)',
  'Workshop',
  'Training Programme',
  'Faculty Internship',
  'Mentoring Recognition',
  'Seminar',
  'Conference Participation',
  'Invited Talk / Keynote Speaker',
  'Resource Person / Guest Lecture',
  'Award / Academic Recognition',
  'Professional Certification',
  'Research Training',
  'Industry Training',
  'Professional Development',
  'Other'
];

const PARTICIPATION_ROLES = [
  'Participant',
  'Coordinator',
  'Resource Person',
  'Keynote Speaker',
  'Mentor',
  'Trainer',
  'Judge / Evaluator',
  'Reviewer',
  'Organizer',
  'Awardee / Honoree',
  'Other'
];

export default function FacultyAchievementWizardModal({
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

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        documents: initialData.documents || []
      };
    }

    const defaultDept = currentUser?.role === 'HOD' ? (currentUser.dept || 'CSE') : 'CSE';

    // Pre-populate if current user is faculty
    const defaultFac = currentUser?.facultyRef 
      ? FACULTY_DATA.find(f => f.id === currentUser.facultyRef)
      : null;

    return {
      facultyId: defaultFac?.id || '',
      facultyName: defaultFac?.name || '',
      department: defaultFac?.department || defaultDept,
      designation: defaultFac?.designation || 'Associate Professor',
      email: defaultFac?.email || '',
      academicYear: '2025-26',
      type: 'Faculty Development Programme (FDP)',
      customType: '',
      title: '',
      organizedBy: '',
      venue: '',
      mode: 'Online',
      participationRole: 'Participant',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      durationDays: 5,
      verificationUrl: '',
      description: '',
      activityStatus: 'Completed',
      documents: []
    };
  });

  const handleFacultySelect = (facId) => {
    const fac = FACULTY_DATA.find(f => f.id === facId);
    if (fac) {
      setFormData(prev => ({
        ...prev,
        facultyId: fac.id,
        facultyName: fac.name,
        department: fac.department,
        designation: fac.designation,
        email: fac.email
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc = {
      id: 'DOC-' + Date.now(),
      name: file.name,
      type: file.name.endsWith('.pdf') ? 'PDF' : 'Image',
      category: 'Certificate / Award Letter',
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
      if (!formData.facultyName && !formData.facultyId) newErrors.facultyId = 'Please select a faculty member';
      if (!formData.department) newErrors.department = 'Department is required';
    } else if (step === 2) {
      if (!formData.title) newErrors.title = 'Achievement / Activity title is required';
      if (!formData.organizedBy) newErrors.organizedBy = 'Organizing institution / body is required';
    } else if (step === 3) {
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.endDate) newErrors.endDate = 'End date is required';
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
    const saved = saveFacultyAchievement({
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
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setSubmitError('Please complete all mandatory fields across steps before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    const saved = saveFacultyAchievement({
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
              <GraduationCap size={14} /> Faculty Development • Evidence Management
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#FFFFFF', fontFamily: 'Cinzel, serif' }}>
              {initialData ? 'Edit Faculty Achievement Record' : 'Record Faculty Achievement & Training'}
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
            { step: 1, label: 'Faculty Profile' },
            { step: 2, label: 'Activity Details' },
            { step: 3, label: 'Dates & Role' },
            { step: 4, label: 'Certificate Evidence' },
            { step: 5, label: 'Review & Submit' }
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
          {submitError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{submitError}</span>
            </div>
          )}
          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <FormField label="SELECT FACULTY MEMBER *" error={errors.facultyId}>
                  <Select
                    value={formData.facultyId}
                    onChange={(e) => handleFacultySelect(e.target.value)}
                  >
                    <option value="">-- Select from Verified Directory --</option>
                    {FACULTY_DATA.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.department} - {f.designation})</option>
                    ))}
                  </Select>
                </FormField>

                {formData.facultyName && (
                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Designation</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{formData.designation}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Department</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{formData.department}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Faculty ID / Ref</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#D4AF37' }}>{formData.facultyId}</div>
                    </div>
                  </div>
                )}

                <FormField label="ACADEMIC YEAR *">
                  <Select value={formData.academicYear} onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}>
                    <option value="2026-27">2026-27</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2024-25">2024-25</option>
                  </Select>
                </FormField>
              </motion.div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="ACHIEVEMENT / ACTIVITY TYPE *">
                    <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                      {FACULTY_ACHIEVEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                  </FormField>

                  <FormField label="PARTICIPATION ROLE *">
                    <Select value={formData.participationRole} onChange={(e) => setFormData({ ...formData, participationRole: e.target.value })}>
                      {PARTICIPATION_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </Select>
                  </FormField>
                </div>

                <FormField label="TITLE OF PROGRAMME / AWARD *" error={errors.title}>
                  <Input
                    placeholder="e.g. National Award for Excellence in Teaching / FDP on Advanced VLSI EDA Tools"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    error={!!errors.title}
                  />
                </FormField>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="ORGANIZED BY / INSTITUTION *" error={errors.organizedBy}>
                    <Input
                      placeholder="e.g. IIT Madras / IEEE / Institute of Scholars (InSc)"
                      value={formData.organizedBy}
                      onChange={(e) => setFormData({ ...formData, organizedBy: e.target.value })}
                      error={!!errors.organizedBy}
                    />
                  </FormField>

                  <FormField label="VENUE / CITY">
                    <Input placeholder="e.g. Chennai / Virtual" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />
                  </FormField>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="START DATE *" error={errors.startDate}>
                    <DateInput value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} error={!!errors.startDate} />
                  </FormField>

                  <FormField label="END DATE *" error={errors.endDate}>
                    <DateInput value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} error={!!errors.endDate} />
                  </FormField>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="DELIVERY MODE">
                    <Select value={formData.mode} onChange={(e) => setFormData({ ...formData, mode: e.target.value })}>
                      <option value="Online">Online (Virtual)</option>
                      <option value="Offline">Offline (On-Site)</option>
                      <option value="Hybrid">Hybrid</option>
                    </Select>
                  </FormField>

                  <FormField label="ACTIVITY STATUS">
                    <Select value={formData.activityStatus} onChange={(e) => setFormData({ ...formData, activityStatus: e.target.value })}>
                      <option value="Completed">Completed</option>
                      <option value="Ongoing">Ongoing</option>
                    </Select>
                  </FormField>
                </div>

                <FormField label="DESCRIPTION & KEY TAKEAWAYS">
                  <Textarea rows={2} placeholder="Brief summary of learnings, certifications, or contributions..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </FormField>
              </motion.div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <FormField label="ONLINE VERIFICATION / CERTIFICATE URL (OPTIONAL)">
                  <Input placeholder="https://verify.certificate.com/id/12345" value={formData.verificationUrl} onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })} />
                </FormField>

                <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', background: '#F8FAFC' }}>
                  <Upload size={28} style={{ color: '#D4AF37', margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                    Upload Certificate / Felicitation Proof / Award Photo
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 1rem' }}>
                    Supporting evidence is securely cataloged for NAAC Criterion-6 & NBA Tier-1 Faculty Appraisal.
                  </p>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#070F1E', color: '#F1C40F', padding: '0.5rem 1.15rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <Upload size={14} /> Attach Certificate File
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

            {/* Step 5 */}
            {currentStep === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', padding: '1.25rem', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase' }}>
                    {formData.type} • {formData.participationRole}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>
                    {formData.title || 'Untitled Achievement'}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    {formData.organizedBy} • {formData.startDate} to {formData.endDate}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Faculty Member</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{formData.facultyName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{formData.designation}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Department & AY</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{formData.department}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{formData.academicYear}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Evidence Files</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{formData.documents.length} Files Attached</div>
                      <div style={{ fontSize: '0.72rem', color: '#10B981' }}>Ready for Verification</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0.85rem 1rem', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065F46', fontSize: '0.8rem' }}>
                  <Sparkles size={16} /> Ready to submit for HOD/Dean verification.
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
                <Check size={15} /> {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            )}
          </div>
        </div>

        {/* Confirmation modal */}
        {unsavedConfirmOpen && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(7, 15, 30, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '1rem' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.5rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
              <AlertCircle size={36} style={{ color: '#F59E0B', margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem' }}>Unsaved Achievement Record</h3>
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

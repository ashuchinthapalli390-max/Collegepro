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
  ExternalLink,
  Sparkles,
  Clock,
  RefreshCw,
  Search
} from 'lucide-react';
import { DEPARTMENTS, FACULTY_DATA } from '../../../data/masterData.js';
import { saveMembership, renewMembership, calculateMembershipStatus } from '../../../data/portalStore.js';
import FormField from '../../ui/form/FormField.jsx';
import { Input, DateInput, Select, Textarea } from '../../ui/form/FormControls.jsx';
import FacultyAvatar from '../../common/FacultyAvatar.jsx';

const PROFESSIONAL_ORGANIZATIONS = [
  'IEEE (Institute of Electrical and Electronics Engineers)',
  'ISTE (Indian Society for Technical Education)',
  'CSI (Computer Society of India)',
  'IETE (Institution of Electronics and Telecommunication Engineers)',
  'IEI (Institution of Engineers India)',
  'ACM (Association for Computing Machinery)',
  'IAENG (International Association of Engineers)',
  'ASME (American Society of Mechanical Engineers)',
  'ASCE (American Society of Civil Engineers)',
  'IET (Institution of Engineering and Technology)',
  'Other'
];

const MEMBERSHIP_TYPES = [
  'Life Membership',
  'Annual Membership',
  'Fellow',
  'Associate',
  'Professional',
  'Institutional',
  'Other'
];

export default function MembershipWizardModal({
  isOpen,
  onClose,
  initialData = null,
  isRenewalMode = false,
  currentUser,
  onSaved
}) {
  const [currentStep, setCurrentStep] = useState(isRenewalMode ? 3 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [facultySearch, setFacultySearch] = useState('');
  const [errors, setErrors] = useState({});

  // Renewal Form state
  const [renewalForm, setRenewalForm] = useState({
    renewalDate: new Date().toISOString().split('T')[0],
    newEndDate: '',
    receiptNumber: '',
    remarks: 'Annual membership renewal extension'
  });

  const defaultDept = currentUser?.role === 'HOD' ? (currentUser.dept || 'CSE') : 'CSE';

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        documents: initialData.documents || []
      };
    }

    const defaultFac = FACULTY_DATA.find(f => f.id === currentUser?.facultyId) || FACULTY_DATA[0];

    return {
      facultyId: defaultFac?.id || '',
      facultyName: defaultFac?.name || '',
      department: defaultFac?.department || defaultDept,
      designation: defaultFac?.designation || 'Faculty',
      email: defaultFac?.email || '',
      
      organization: 'IEEE (Institute of Electrical and Electronics Engineers)',
      organizationName: '',
      organizationWebsite: '',
      membershipType: 'Life Membership',
      membershipCategory: 'Professional',
      membershipNumber: '',
      
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      memberSince: new Date().getFullYear().toString(),
      academicYear: '2025-26',
      verificationUrl: '',
      remarks: '',
      
      documents: [],
      workflowStatus: 'DRAFT'
    };
  });

  // Calculate live validity status
  const validityStatus = calculateMembershipStatus(formData.membershipType, formData.endDate);

  // Selected faculty record
  const selectedFaculty = FACULTY_DATA.find(f => f.id === formData.facultyId) || null;

  // Filtered faculty list for search
  const filteredFaculty = FACULTY_DATA.filter(f => {
    const q = facultySearch.toLowerCase().trim();
    if (!q) return true;
    return (f.name && f.name.toLowerCase().includes(q)) || 
           (f.department && f.department.toLowerCase().includes(q)) || 
           (f.id && f.id.toLowerCase().includes(q));
  });

  const handleSelectFaculty = (fac) => {
    setFormData(prev => ({
      ...prev,
      facultyId: fac.id,
      facultyName: fac.name,
      department: fac.department,
      designation: fac.designation,
      email: fac.email || ''
    }));
  };

  // Document Upload
  const handleFileUpload = (e, category) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc = {
      id: 'DOC-' + Date.now(),
      name: file.name,
      type: category || 'Membership Certificate PDF',
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
      if (!formData.facultyId || !formData.facultyName) newErrors.facultyId = 'Please select a verified faculty member.';
    } else if (step === 2) {
      if (!formData.organization) newErrors.organization = 'Professional organization is required';
      if (formData.organization === 'Other' && !formData.organizationName) {
        newErrors.organizationName = 'Custom organization name is required';
      }
      if (!formData.membershipNumber) newErrors.membershipNumber = 'Official Membership Number is required';
    } else if (step === 3) {
      if (formData.membershipType === 'Annual Membership' && !formData.endDate) {
        newErrors.endDate = 'Valid Until / End Date is required for Annual Memberships';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(4, prev + 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    try {
      const saved = saveMembership({
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
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert('Please fill all mandatory fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRenewalMode && initialData?.id) {
        renewMembership(initialData.id, renewalForm, currentUser);
      } else {
        saveMembership({
          ...formData,
          workflowStatus: 'SUBMITTED'
        }, currentUser);
      }

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
              <Award size={14} /> Faculty Development • Professional Bodies
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#FFFFFF', fontFamily: 'Cinzel, serif' }}>
              {isRenewalMode ? `Renew Membership (${initialData.membershipRecordNumber || initialData.id})` : (initialData ? `Edit Membership (${initialData.membershipRecordNumber || initialData.id})` : 'Record Faculty Professional Membership')}
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
            { step: 1, label: 'Faculty Member' },
            { step: 2, label: 'Membership Details' },
            { step: 3, label: isRenewalMode ? 'Renewal Period' : 'Validity & Certificate' },
            { step: 4, label: 'Review & Submit' }
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
                {s.step < 4 && <ChevronRight size={13} style={{ color: '#CBD5E1', marginLeft: '0.2rem' }} />}
              </div>
            );
          })}
        </div>

        {/* 3. Form Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          <AnimatePresence mode="wait">
            {/* ──────── STEP 1: FACULTY SELECTION ──────── */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                    SELECT FACULTY MEMBER *
                  </span>
                  <p style={{ fontSize: '0.74rem', color: '#64748B', margin: '0.15rem 0 0.75rem' }}>
                    Select from verified institutional directory. Verified photo and profile snapshot will be mapped automatically.
                  </p>

                  <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input
                      type="text"
                      placeholder="Search faculty by name, department, or ID..."
                      value={facultySearch}
                      onChange={(e) => setFacultySearch(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.25rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Selected Faculty Expansion Card */}
                  {selectedFaculty && (
                    <motion.div
                      layout
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
                        border: '2px solid #D4AF37',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <FacultyAvatar faculty={selectedFaculty} size={52} shape="circle" ringColor="#D4AF37" />
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                            {selectedFaculty.name}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                            {selectedFaculty.designation} • <strong style={{ color: '#D4AF37' }}>Department of {selectedFaculty.department}</strong>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#0284C7', marginTop: '0.15rem' }}>
                            {selectedFaculty.email}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.76rem', fontWeight: 800 }}>
                        <CheckCircle2 size={16} /> Selected
                      </div>
                    </motion.div>
                  )}

                  {/* Directory Quick Selector Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.65rem', maxHeight: '240px', overflowY: 'auto' }}>
                    {filteredFaculty.map(fac => {
                      const isSel = formData.facultyId === fac.id;
                      return (
                        <div
                          key={fac.id}
                          onClick={() => handleSelectFaculty(fac)}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            border: isSel ? '2px solid #D4AF37' : '1px solid #E2E8F0',
                            background: isSel ? '#FFFDF5' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            cursor: 'pointer'
                          }}
                        >
                          <FacultyAvatar faculty={fac} size={36} shape="circle" />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {fac.name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                              {fac.department} • {fac.designation}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ──────── STEP 2: MEMBERSHIP DETAILS ──────── */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <FormField label="PROFESSIONAL ORGANIZATION *" error={errors.organization}>
                  <Select
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    error={!!errors.organization}
                  >
                    {PROFESSIONAL_ORGANIZATIONS.map(org => <option key={org} value={org}>{org}</option>)}
                  </Select>
                </FormField>

                {formData.organization === 'Other' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}
                  >
                    <FormField label="ORGANIZATION NAME *" error={errors.organizationName}>
                      <Input placeholder="e.g. Computer Science Teachers Association" value={formData.organizationName} onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} error={!!errors.organizationName} />
                    </FormField>
                    <FormField label="ORGANIZATION WEBSITE">
                      <Input placeholder="https://..." value={formData.organizationWebsite} onChange={(e) => setFormData({ ...formData, organizationWebsite: e.target.value })} />
                    </FormField>
                  </motion.div>
                )}

                {/* Membership Type Chips */}
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    MEMBERSHIP TYPE *
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {MEMBERSHIP_TYPES.map(type => {
                      const isSel = formData.membershipType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, membershipType: type })}
                          style={{
                            padding: '0.45rem 0.9rem',
                            borderRadius: '9999px',
                            border: isSel ? '1px solid #D4AF37' : '1px solid #CBD5E1',
                            background: isSel ? '#070F1E' : '#FFFFFF',
                            color: isSel ? '#F1C40F' : '#475569',
                            fontSize: '0.78rem',
                            fontWeight: isSel ? 800 : 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isSel ? '✓ ' : ''}{type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1rem' }}>
                  <FormField label="OFFICIAL MEMBERSHIP NUMBER *" error={errors.membershipNumber}>
                    <Input placeholder="e.g. 98451203 / LM-10492" value={formData.membershipNumber} onChange={(e) => setFormData({ ...formData, membershipNumber: e.target.value })} error={!!errors.membershipNumber} />
                  </FormField>

                  <FormField label="MEMBERSHIP CATEGORY">
                    <Select value={formData.membershipCategory} onChange={(e) => setFormData({ ...formData, membershipCategory: e.target.value })}>
                      <option value="Professional">Professional</option>
                      <option value="Senior Member">Senior Member</option>
                      <option value="Fellow">Fellow</option>
                      <option value="Life Member">Life Member</option>
                      <option value="Associate">Associate</option>
                      <option value="Institutional">Institutional</option>
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
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                  <FormField label="VERIFICATION / PROFILE URL">
                    <Input placeholder="https://ieee.org/profile/..." value={formData.verificationUrl} onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })} />
                  </FormField>

                  <FormField label="MEMBER SINCE (YEAR)">
                    <Input placeholder="e.g. 2018" value={formData.memberSince} onChange={(e) => setFormData({ ...formData, memberSince: e.target.value })} />
                  </FormField>
                </div>

                <FormField label="REMARKS">
                  <Input placeholder="e.g. Senior Section Committee Member" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} />
                </FormField>
              </motion.div>
            )}

            {/* ──────── STEP 3: VALIDITY & CERTIFICATE ──────── */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {isRenewalMode ? (
                  /* Renewal Mode Inputs */
                  <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      RENEWAL EXTENSION DETAILS
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <FormField label="RENEWAL DATE *">
                        <DateInput value={renewalForm.renewalDate} onChange={(e) => setRenewalForm({ ...renewalForm, renewalDate: e.target.value })} />
                      </FormField>

                      <FormField label="NEW EXPIRY DATE *">
                        <DateInput value={renewalForm.newEndDate} onChange={(e) => setRenewalForm({ ...renewalForm, newEndDate: e.target.value })} />
                      </FormField>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
                      <FormField label="RENEWAL RECEIPT / TRANSACTION ID">
                        <Input placeholder="e.g. TXN-IEEE-2026-981" value={renewalForm.receiptNumber} onChange={(e) => setRenewalForm({ ...renewalForm, receiptNumber: e.target.value })} />
                      </FormField>
                      <FormField label="REMARKS">
                        <Input placeholder="Renewal remarks" value={renewalForm.remarks} onChange={(e) => setRenewalForm({ ...renewalForm, remarks: e.target.value })} />
                      </FormField>
                    </div>
                  </div>
                ) : (
                  /* Standard Creation Dates */
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <FormField label="START DATE / JOINING DATE">
                        <DateInput value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                      </FormField>

                      {formData.membershipType !== 'Life Membership' && (
                        <FormField label="VALID UNTIL / EXPIRY DATE *" error={errors.endDate}>
                          <DateInput value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} error={!!errors.endDate} />
                        </FormField>
                      )}
                    </div>

                    {/* Calculated Validity Status Badge */}
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      background: validityStatus.status === 'ACTIVE' || validityStatus.status === 'LIFETIME' ? '#ECFDF5' : (validityStatus.status === 'EXPIRING_SOON' ? '#FEF3C7' : '#FEF2F2'),
                      border: `1px solid ${validityStatus.status === 'ACTIVE' || validityStatus.status === 'LIFETIME' ? '#A7F3D0' : (validityStatus.status === 'EXPIRING_SOON' ? '#FDE68A' : '#FECACA')}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: validityStatus.status === 'ACTIVE' || validityStatus.status === 'LIFETIME' ? '#065F46' : (validityStatus.status === 'EXPIRING_SOON' ? '#92400E' : '#DC2626')
                    }}>
                      <Clock size={16} /> Status: {validityStatus.label}
                    </div>
                  </>
                )}

                {/* Certificate Dropzone */}
                <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', background: '#F8FAFC' }}>
                  <Upload size={28} style={{ color: '#D4AF37', margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                    Upload Membership Certificate or Card
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 1rem' }}>
                    Attach official certificate PDF, membership ID card, or renewal receipt.
                  </p>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#070F1E', color: '#F1C40F', padding: '0.5rem 1.15rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <Upload size={14} /> Attach Certificate PDF
                    <input type="file" accept=".pdf,.png,.jpg" onChange={(e) => handleFileUpload(e, 'Membership Certificate')} style={{ display: 'none' }} />
                  </label>
                </div>

                <div>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    ATTACHED DOCUMENTS ({formData.documents.length})
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

            {/* ──────── STEP 4: REVIEW & SUBMIT ──────── */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', padding: '1.25rem', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase' }}>
                    {formData.membershipType} • {formData.academicYear}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>
                    {formData.organization === 'Other' ? formData.organizationName : formData.organization}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Faculty: <strong>{formData.facultyName}</strong> ({formData.department})
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Membership No.</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A' }}>{formData.membershipNumber || 'Pending'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Validity Status</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#059669' }}>{validityStatus.status}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Certificates</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0284C7' }}>{formData.documents.length} File(s) Attached</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0.85rem 1rem', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065F46', fontSize: '0.8rem' }}>
                  <Sparkles size={16} /> Submitting initiates departmental verification and NAAC Criterion 3 / NBA accreditation mapping.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Action Footer */}
        <div style={{ background: '#F8FAFC', padding: '1rem 1.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {currentStep === 1 || (isRenewalMode && currentStep === 3) ? (
            <button type="button" onClick={onClose} style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              Cancel
            </button>
          ) : (
            <button type="button" onClick={handleBack} style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#334155', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              <ChevronLeft size={15} /> Back
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {!isRenewalMode && (
              <button type="button" onClick={handleSaveDraft} disabled={isSavingDraft} style={{ padding: '0.55rem 1.05rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                {draftSavedToast ? <><Check size={14} style={{ color: '#10B981' }} /> Saved</> : (isSavingDraft ? 'Saving...' : 'Save Draft')}
              </button>
            )}

            {currentStep < 4 ? (
              <button type="button" onClick={handleNext} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.55rem 1.25rem', borderRadius: '8px', border: 'none', background: '#070F1E', color: '#F1C40F', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                Continue <ChevronRight size={15} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={isSubmitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.35rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                <Check size={15} /> {isSubmitting ? 'Submitting...' : (isRenewalMode ? 'Confirm Renewal Extension' : 'Submit for Verification')}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

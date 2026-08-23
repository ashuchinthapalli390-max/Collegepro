import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  UserCheck, 
  Briefcase, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { DEPARTMENTS } from '../../../data/masterData.js';

export const STAFF_TYPES = [
  'Technical Cadre',
  'Administrative Staff',
  'Laboratory Assistant',
  'Workshop Superintendent',
  'Network & Systems Administrator',
  'Library Cadre',
  'Office Executive',
  'Support Services',
  'Other Functional Unit'
];

export const EMPLOYMENT_TYPES = [
  'Permanent Regular',
  'Contractual Appointment',
  'Probationary',
  'Visiting / Special Cadre'
];

export default function AddStaffRecordDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  currentUser,
  editRecord = null 
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    staffType: 'Technical Cadre',
    designation: '',
    department: currentUser?.dept || 'CSE',
    officialStaffId: '',
    qualification: '',
    experienceYears: '',
    dateOfJoining: '',
    employmentType: 'Permanent Regular',
    officialEmail: '',
    officialPhone: '',
    specialization: '',
    responsibilities: '',
    status: 'Active'
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (editRecord) {
      setFormData({
        fullName: editRecord.name || editRecord.fullName || '',
        staffType: editRecord.staffType || 'Technical Cadre',
        designation: editRecord.designation || '',
        department: editRecord.department || 'CSE',
        officialStaffId: editRecord.id || editRecord.officialStaffId || '',
        qualification: editRecord.qualification || '',
        experienceYears: editRecord.experienceYears || editRecord.experience || '',
        dateOfJoining: editRecord.dateOfJoining || '',
        employmentType: editRecord.employmentType || 'Permanent Regular',
        officialEmail: editRecord.email || editRecord.officialEmail || '',
        officialPhone: editRecord.phone || editRecord.officialPhone || '',
        specialization: editRecord.specialization || '',
        responsibilities: editRecord.responsibilities || '',
        status: editRecord.status || 'Active'
      });
      setIsDirty(false);
    } else {
      setFormData({
        fullName: '',
        staffType: 'Technical Cadre',
        designation: '',
        department: currentUser?.dept || 'CSE',
        officialStaffId: '',
        qualification: '',
        experienceYears: '',
        dateOfJoining: '',
        employmentType: 'Permanent Regular',
        officialEmail: '',
        officialPhone: '',
        specialization: '',
        responsibilities: '',
        status: 'Active'
      });
      setIsDirty(false);
    }
    setFieldErrors({});
    setSaveSuccess(false);
    setShowDiscardConfirm(false);
  }, [isOpen, editRecord, currentUser]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }
    if (!formData.designation.trim()) {
      errors.designation = 'Official designation is required.';
    }
    if (!formData.staffType) {
      errors.staffType = 'Staff Type is required.';
    }
    if (!formData.department) {
      errors.department = 'Department / Unit is required.';
    }
    if (formData.officialEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.officialEmail.trim())) {
        errors.officialEmail = 'Please provide a valid institutional email format.';
      }
    }
    if (formData.experienceYears && isNaN(Number(formData.experienceYears))) {
      errors.experienceYears = 'Experience must be a numeric value.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        id: editRecord?.id || undefined,
        name: formData.fullName.trim(),
        fullName: formData.fullName.trim(),
        staffType: formData.staffType,
        designation: formData.designation.trim(),
        department: formData.department,
        officialStaffId: formData.officialStaffId.trim(),
        qualification: formData.qualification.trim(),
        experience: formData.experienceYears ? `${formData.experienceYears} Years` : '',
        experienceYears: formData.experienceYears,
        dateOfJoining: formData.dateOfJoining,
        employmentType: formData.employmentType,
        email: formData.officialEmail.trim(),
        officialEmail: formData.officialEmail.trim(),
        phone: formData.officialPhone.trim(),
        officialPhone: formData.officialPhone.trim(),
        specialization: formData.specialization.trim(),
        responsibilities: formData.responsibilities.trim(),
        status: formData.status
      };

      const result = await onSave(payload);

      if (result && result.success === false) {
        setFieldErrors({ form: result.error || 'Failed to save staff record. Please verify fields.' });
        setIsSubmitting(false);
        return;
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Save staff error:', err);
      setFieldErrors({ form: err.message || 'An unexpected error occurred while saving.' });
      setIsSubmitting(false);
    }
  };

  const handleRequestClose = () => {
    if (isDirty && !saveSuccess) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 15, 30, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 6000,
      padding: 'clamp(1rem, 3vw, 2.5rem)'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '740px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.45)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.4rem 1.8rem',
          background: '#0B192C',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={18} style={{ color: '#D4AF37' }} />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                {editRecord ? 'Edit Staff Profile' : 'Add Staff Record'}
              </h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
              Create a verified institutional non-teaching / technical cadre entry
            </p>
          </div>

          <button
            type="button"
            onClick={handleRequestClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
          {fieldErrors.form && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{fieldErrors.form}</span>
            </div>
          )}

          {saveSuccess && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>Staff record saved successfully!</span>
            </div>
          )}

          {/* Section 1: Basic Identity */}
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
              1. Basic Identity & Cadre
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri/Smt. Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: `1px solid ${fieldErrors.fullName ? '#EF4444' : '#CBD5E1'}`,
                    fontSize: '0.84rem',
                    boxSizing: 'border-box'
                  }}
                />
                {fieldErrors.fullName && <span style={{ color: '#EF4444', fontSize: '0.72rem' }}>{fieldErrors.fullName}</span>}
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Staff Type *
                </label>
                <select
                  value={formData.staffType}
                  onChange={(e) => handleChange('staffType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                    background: '#FFFFFF'
                  }}
                >
                  {STAFF_TYPES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Official Designation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Lab Programmer / Tech Asst"
                  value={formData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: `1px solid ${fieldErrors.designation ? '#EF4444' : '#CBD5E1'}`,
                    fontSize: '0.84rem',
                    boxSizing: 'border-box'
                  }}
                />
                {fieldErrors.designation && <span style={{ color: '#EF4444', fontSize: '0.72rem' }}>{fieldErrors.designation}</span>}
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Department / Unit *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                    background: '#FFFFFF'
                  }}
                >
                  {DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}
                  <option value="Administration">Central Administration</option>
                  <option value="Examinations">Exam Cell</option>
                  <option value="Library">Central Library</option>
                  <option value="Maintenance">Campus Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Employment & Qualifications */}
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
              2. Employment & Qualifications
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Official Staff ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. NEC-STF-014"
                  value={formData.officialStaffId}
                  onChange={(e) => handleChange('officialStaffId', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Qualification
                </label>
                <input
                  type="text"
                  placeholder="e.g. Diploma, B.Tech, MCA"
                  value={formData.qualification}
                  onChange={(e) => handleChange('qualification', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  placeholder="e.g. 8"
                  value={formData.experienceYears}
                  onChange={(e) => handleChange('experienceYears', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Employment Type
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleChange('employmentType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                    background: '#FFFFFF'
                  }}
                >
                  {EMPLOYMENT_TYPES.map(et => <option key={et} value={et}>{et}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Official Contact */}
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
              3. Official Contact
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Official Email
                </label>
                <input
                  type="email"
                  placeholder="staffname@nrtec.in"
                  value={formData.officialEmail}
                  onChange={(e) => handleChange('officialEmail', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: `1px solid ${fieldErrors.officialEmail ? '#EF4444' : '#CBD5E1'}`,
                    fontSize: '0.84rem',
                    boxSizing: 'border-box'
                  }}
                />
                {fieldErrors.officialEmail && <span style={{ color: '#EF4444', fontSize: '0.72rem' }}>{fieldErrors.officialEmail}</span>}
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Official Extension / Contact
                </label>
                <input
                  type="text"
                  placeholder="+91 8647 239903 / Ext 204"
                  value={formData.officialPhone}
                  onChange={(e) => handleChange('officialPhone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Cadre Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                    background: '#FFFFFF'
                  }}
                >
                  <option value="Active">Active Duty</option>
                  <option value="Inactive">On Leave / Inactive</option>
                  <option value="Archived">Archived / Relieved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Functional Responsibilities */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
              Functional Responsibilities / Specialization
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Lab maintenance, networking infrastructure, equipment calibration, inventory logs"
              value={formData.responsibilities}
              onChange={(e) => handleChange('responsibilities', e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.84rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Footer Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.8rem',
            borderTop: '1px solid #E2E8F0',
            paddingTop: '1.2rem',
            marginTop: '0.5rem'
          }}>
            <button
              type="button"
              onClick={handleRequestClose}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                color: '#475569',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                border: 'none',
                color: '#070F1E',
                padding: '0.65rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: '0 2px 10px rgba(212, 175, 55, 0.35)'
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Saving Record...</span>
                </>
              ) : (
                <span>{editRecord ? 'Update Staff Record' : 'Create Staff Record'}</span>
              )}
            </button>
          </div>
        </form>

        {/* Custom Unsaved Changes Confirmation Modal */}
        {showDiscardConfirm && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(7, 15, 30, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 10
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.8rem',
              maxWidth: '380px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <AlertCircle size={32} style={{ color: '#F59E0B', margin: '0 auto 0.6rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
                Discard Unsaved Changes?
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1.2rem', lineHeight: 1.5 }}>
                You have unsaved changes in this staff form. Are you sure you want to close?
              </p>
              <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowDiscardConfirm(false)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Continue Editing
                </button>
                <button
                  type="button"
                  onClick={() => { setShowDiscardConfirm(false); onClose(); }}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  UserCheck, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle, 
  Search, 
  Sparkles,
  Phone,
  Mail,
  Building2,
  X
} from 'lucide-react';
import FacultyAvatar from '../../common/FacultyAvatar.jsx';
import FacultySelectorModal from './FacultySelectorModal.jsx';
import FormField from '../../ui/form/FormField.jsx';
import { Input } from '../../ui/form/FormControls.jsx';

export default function MembersStep({
  formData,
  setFormData,
  validationErrors = {},
  setValidationErrors
}) {
  const shouldReduceMotion = useReducedMotion();
  const [facultyModalOpen, setFacultyModalOpen] = useState(false);

  // Active expanded form states for external cards
  const [nomineeFormOpen, setNomineeFormOpen] = useState(
    !!(formData.universityNominee?.name && !formData.universityNominee?.isSaved)
  );
  const [industryFormOpen, setIndustryFormOpen] = useState(
    !!(formData.industryMember?.name && !formData.industryMember?.isSaved)
  );
  const [alumniFormOpen, setAlumniFormOpen] = useState(
    !!(formData.alumniMember?.name && !formData.alumniMember?.isSaved)
  );

  // Active editing index for academic experts
  const [editingExpertIdx, setEditingExpertIdx] = useState(null);

  // 1. Chairman Select Handler (Optional directory autofill helper)
  const handleSelectChairman = (faculty) => {
    setFormData(prev => ({
      ...prev,
      chairmanFacultyId: faculty.id || '',
      chairmanName: faculty.name || '',
      chairmanDesignation: faculty.designation || 'Professor & HOD',
      chairmanDepartment: faculty.department || 'CYS',
      chairmanInstitution: 'Narasaraopeta Engineering College (Autonomous)',
      chairmanEmail: faculty.email || '',
      chairmanPhone: faculty.phone || '',
      chairmanPhoto: faculty.photo || null
    }));
    if (validationErrors.chairman) {
      setValidationErrors(prev => ({ ...prev, chairman: null }));
    }
  };

  const handleRemoveChairman = () => {
    setFormData(prev => ({
      ...prev,
      chairmanFacultyId: '',
      chairmanName: '',
      chairmanDesignation: '',
      chairmanDepartment: '',
      chairmanInstitution: 'Narasaraopeta Engineering College (Autonomous)',
      chairmanEmail: '',
      chairmanPhone: '',
      chairmanPhoto: null
    }));
  };

  // 2. University Nominee Handlers
  const handleSaveNominee = () => {
    if (!formData.universityNominee?.name?.trim() || !formData.universityNominee?.institution?.trim()) {
      if (setValidationErrors) {
        setValidationErrors(prev => ({ ...prev, universityNominee: 'Please fill in Nominee Name and Institution.' }));
      }
      return;
    }
    setFormData(prev => ({
      ...prev,
      universityNominee: {
        ...prev.universityNominee,
        isSaved: true
      }
    }));
    setNomineeFormOpen(false);
    if (validationErrors.universityNominee) {
      setValidationErrors(prev => ({ ...prev, universityNominee: null }));
    }
  };

  const handleRemoveNominee = () => {
    setFormData(prev => ({
      ...prev,
      universityNominee: {
        name: '',
        institution: '',
        designation: '',
        email: '',
        phone: '',
        department: '',
        remarks: '',
        isSaved: false
      }
    }));
    setNomineeFormOpen(false);
  };

  // 3. Academic Experts Handlers
  const handleAddExpert = () => {
    const newExpert = {
      id: 'exp_' + Date.now(),
      name: '',
      institution: '',
      designation: '',
      department: '',
      email: '',
      phone: '',
      remarks: '',
      isSaved: false
    };
    setFormData(prev => ({
      ...prev,
      academicians: [...(prev.academicians || []), newExpert]
    }));
    setEditingExpertIdx((formData.academicians || []).length);
  };

  const handleUpdateExpert = (idx, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.academicians || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, academicians: updated };
    });
  };

  const handleSaveExpert = (idx) => {
    const expert = (formData.academicians || [])[idx];
    if (!expert?.name?.trim() || !expert?.institution?.trim()) {
      if (setValidationErrors) {
        setValidationErrors(prev => ({ ...prev, academicians: 'Please enter Expert Name and Institution.' }));
      }
      return;
    }
    handleUpdateExpert(idx, 'isSaved', true);
    setEditingExpertIdx(null);
    if (validationErrors.academicians) {
      setValidationErrors(prev => ({ ...prev, academicians: null }));
    }
  };

  const handleRemoveExpert = (idx) => {
    setFormData(prev => ({
      ...prev,
      academicians: (prev.academicians || []).filter((_, i) => i !== idx)
    }));
    if (editingExpertIdx === idx) setEditingExpertIdx(null);
  };

  // 4. Industry Member Handlers
  const handleSaveIndustry = () => {
    if (!formData.industryMember?.name?.trim() || !formData.industryMember?.company?.trim()) {
      if (setValidationErrors) {
        setValidationErrors(prev => ({ ...prev, industryMember: 'Please fill in Industry Representative Name and Organization.' }));
      }
      return;
    }
    setFormData(prev => ({
      ...prev,
      industryMember: {
        ...prev.industryMember,
        isSaved: true
      }
    }));
    setIndustryFormOpen(false);
    if (validationErrors.industryMember) {
      setValidationErrors(prev => ({ ...prev, industryMember: null }));
    }
  };

  const handleRemoveIndustry = () => {
    setFormData(prev => ({
      ...prev,
      industryMember: {
        name: '',
        company: '',
        designation: '',
        domain: '',
        email: '',
        phone: '',
        remarks: '',
        isSaved: false
      }
    }));
    setIndustryFormOpen(false);
  };

  // 5. Alumni Member Handlers
  const handleSaveAlumni = () => {
    if (!formData.alumniMember?.name?.trim()) {
      if (setValidationErrors) {
        setValidationErrors(prev => ({ ...prev, alumniMember: 'Please fill in Alumni Representative Name.' }));
      }
      return;
    }
    setFormData(prev => ({
      ...prev,
      alumniMember: {
        ...prev.alumniMember,
        isSaved: true
      }
    }));
    setAlumniFormOpen(false);
    if (validationErrors.alumniMember) {
      setValidationErrors(prev => ({ ...prev, alumniMember: null }));
    }
  };

  const handleRemoveAlumni = () => {
    setFormData(prev => ({
      ...prev,
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
      }
    }));
    setAlumniFormOpen(false);
  };

  // Derived Completion Progress
  const isChairmanFilled = !!formData.chairmanName;
  const isNomineeFilled = !!(formData.universityNominee?.name && formData.universityNominee?.institution);
  const isExpertsFilled = (formData.academicians || []).some(e => e.name && e.isSaved);
  const isIndustryFilled = !!(formData.industryMember?.name && formData.industryMember?.isSaved);
  const isAlumniFilled = !!(formData.alumniMember?.name && formData.alumniMember?.isSaved);

  const completedCount = [isChairmanFilled, isNomineeFilled, isExpertsFilled, isIndustryFilled, isAlumniFilled].filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* 1. Header & Section Progress Indicator */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '1.1rem 1.25rem',
        border: '1px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.2rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Statutory BoS Members Roster
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
            Configure authorized academic leaders, affiliating university nominees, and industry experts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
              {completedCount} of 5 sections complete
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
              * Chairman & Nominee required
            </div>
          </div>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: completedCount >= 2 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(212, 175, 55, 0.12)',
            border: `2px solid ${completedCount >= 2 ? '#10B981' : '#D4AF37'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.82rem',
            color: completedCount >= 2 ? '#047857' : '#B45309'
          }}>
            {completedCount}/5
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* CARD 1: BoS CHAIRMAN (INTERNAL NEC - REQUIRED *) */}
      {/* ────────────────────────────────────────────────────────── */}
      <motion.div
        layout
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '1.25rem',
          border: `1.5px solid ${validationErrors.chairman ? '#EF4444' : (isChairmanFilled ? '#A7F3D0' : '#E2E8F0')}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                BoS Chairman
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#FEF3C7', color: '#B45309', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                REQUIRED *
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#EFF6FF', color: '#1D4ED8', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                Manual Entry / ET HOD
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              Enter Chairman details directly below, or optionally autofill from Faculty Directory.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setFacultyModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#070F1E',
                color: '#F1C40F',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
              className="hover:scale-105 transition-transform"
            >
              <Search size={13} /> Autofill from Directory
            </button>
            {isChairmanFilled && (
              <button
                type="button"
                onClick={handleRemoveChairman}
                title="Clear Chairman Fields"
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  background: '#FEE2E2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {validationErrors.chairman && (
          <div style={{ fontSize: '0.75rem', color: '#DC2626', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <AlertCircle size={13} /> {validationErrors.chairman}
          </div>
        )}

        {/* Direct Editable Inputs for Chairman */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                Chairman Full Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.chairmanName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, chairmanName: e.target.value }))}
                placeholder="e.g. Dr. V. V. A. S. Lakshmi"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: '#0F172A'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                Designation <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.chairmanDesignation || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, chairmanDesignation: e.target.value }))}
                placeholder="e.g. Professor & HOD"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: '#0F172A'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                Department <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                value={formData.chairmanDepartment || 'CYS'}
                onChange={(e) => setFormData(prev => ({ ...prev, chairmanDepartment: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: '#0F172A'
                }}
              >
                <option value="CYS">CSE (Cyber Security) - CYS</option>
                <option value="DS">CSE (Data Science) - DS</option>
                <option value="AI">Artificial Intelligence - AI</option>
                <option value="AIML">AI & Machine Learning - AIML</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748B', marginBottom: '0.25rem' }}>
                Institution
              </label>
              <input
                type="text"
                value={formData.chairmanInstitution || 'Narasaraopeta Engineering College (Autonomous)'}
                onChange={(e) => setFormData(prev => ({ ...prev, chairmanInstitution: e.target.value }))}
                placeholder="Institution Name"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: '#0F172A'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748B', marginBottom: '0.25rem' }}>
                Email (Optional)
              </label>
              <input
                type="email"
                value={formData.chairmanEmail || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, chairmanEmail: e.target.value }))}
                placeholder="e.g. hod.cys@nrtec.in"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: '#0F172A'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748B', marginBottom: '0.25rem' }}>
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={formData.chairmanPhone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, chairmanPhone: e.target.value }))}
                placeholder="e.g. +91 94400 12345"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: '#0F172A'
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* CARD 2: UNIVERSITY NOMINEE (EXTERNAL - REQUIRED *) */}
      {/* ────────────────────────────────────────────────────────── */}
      <motion.div
        layout
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '1.25rem',
          border: `1.5px solid ${validationErrors.universityNominee ? '#EF4444' : (isNomineeFilled ? '#A7F3D0' : '#E2E8F0')}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                University Nominee
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#FEF3C7', color: '#B45309', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                REQUIRED *
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#F1F5F9', color: '#475569', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                Affiliating University (JNTUK)
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              Representative nominated by the affiliating university governing body.
            </p>
          </div>

          {!nomineeFormOpen && !formData.universityNominee?.isSaved && (
            <button
              type="button"
              onClick={() => setNomineeFormOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                color: '#0F172A',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} /> Add University Nominee
            </button>
          )}
        </div>

        {validationErrors.universityNominee && (
          <div style={{ fontSize: '0.75rem', color: '#DC2626', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <AlertCircle size={13} /> {validationErrors.universityNominee}
          </div>
        )}

        {/* Nominee Editable Form */}
        <AnimatePresence>
          {nomineeFormOpen && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '0.5rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                <FormField label="FULL NAME" required>
                  <Input
                    type="text"
                    required
                    placeholder="Prof. Full Name"
                    value={formData.universityNominee?.name || ''}
                    onChange={(e) => setFormData({ ...formData, universityNominee: { ...formData.universityNominee, name: e.target.value } })}
                  />
                </FormField>

                <FormField label="UNIVERSITY / INSTITUTION" required>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. JNTUK Kakinada"
                    value={formData.universityNominee?.institution || ''}
                    onChange={(e) => setFormData({ ...formData, universityNominee: { ...formData.universityNominee, institution: e.target.value } })}
                  />
                </FormField>

                <FormField label="DESIGNATION">
                  <Input
                    type="text"
                    placeholder="Professor & Director"
                    value={formData.universityNominee?.designation || ''}
                    onChange={(e) => setFormData({ ...formData, universityNominee: { ...formData.universityNominee, designation: e.target.value } })}
                  />
                </FormField>

                <FormField label="OFFICIAL EMAIL">
                  <Input
                    type="email"
                    placeholder="nominee@university.ac.in"
                    value={formData.universityNominee?.email || ''}
                    onChange={(e) => setFormData({ ...formData, universityNominee: { ...formData.universityNominee, email: e.target.value } })}
                  />
                </FormField>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.85rem' }}>
                <button
                  type="button"
                  onClick={() => setNomineeFormOpen(false)}
                  style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNominee}
                  style={{ padding: '0.45rem 1.15rem', borderRadius: '8px', border: 'none', background: '#070F1E', color: '#F1C40F', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Nominee Record
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Saved Card */}
        {!nomineeFormOpen && formData.universityNominee?.isSaved && (
          <div style={{
            background: '#F8FAFC',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            border: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>
                {formData.universityNominee.name}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                {formData.universityNominee.designation || 'Nominated Member'} • <strong>{formData.universityNominee.institution}</strong>
              </div>
              {formData.universityNominee.email && (
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>
                  {formData.universityNominee.email}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={() => setNomineeFormOpen(true)}
                style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '0.76rem', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleRemoveNominee}
                title="Remove Nominee"
                aria-label="Remove Nominee"
                style={{ padding: '0.4rem 0.7rem', borderRadius: '8px', background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Empty State Prompt */}
        {!nomineeFormOpen && !formData.universityNominee?.isSaved && (
          <div style={{
            background: '#F8FAFC',
            borderRadius: '10px',
            padding: '1.25rem',
            textAlign: 'center',
            border: '1px dashed #CBD5E1',
            color: '#64748B'
          }}>
            <GraduationCap size={28} style={{ color: '#CBD5E1', margin: '0 auto 0.35rem auto' }} />
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>No university nominee added yet</div>
            <div style={{ fontSize: '0.74rem', marginTop: '0.15rem' }}>Click "+ Add University Nominee" to register the statutory university representative.</div>
          </div>
        )}
      </motion.div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* CARD 3: ACADEMIC EXPERTS (EXTERNAL - RECOMMENDED) */}
      {/* ────────────────────────────────────────────────────────── */}
      <motion.div
        layout
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '1.25rem',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                Academic Experts
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#F1F5F9', color: '#475569', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                External NIT / IIT / University Professors
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              External academicians invited to evaluate curriculum and course outcomes.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddExpert}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              color: '#0F172A',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Plus size={14} /> Add Academic Expert
          </button>
        </div>

        {/* Experts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {(formData.academicians || []).length === 0 ? (
            <div style={{
              background: '#F8FAFC',
              borderRadius: '10px',
              padding: '1.25rem',
              textAlign: 'center',
              border: '1px dashed #CBD5E1',
              color: '#64748B'
            }}>
              <BookOpen size={28} style={{ color: '#CBD5E1', margin: '0 auto 0.35rem auto' }} />
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>No academic experts added yet</div>
              <div style={{ fontSize: '0.74rem', marginTop: '0.15rem' }}>Click "+ Add Academic Expert" to invite external professors from premier institutions.</div>
            </div>
          ) : (
            formData.academicians.map((expert, idx) => {
              const isEditing = editingExpertIdx === idx || !expert.isSaved;

              return (
                <div key={expert.id || idx}>
                  {isEditing ? (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                        Academic Expert #{idx + 1}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                        <FormField label="NAME" required>
                          <Input
                            type="text"
                            placeholder="Dr. Full Name"
                            value={expert.name || ''}
                            onChange={(e) => handleUpdateExpert(idx, 'name', e.target.value)}
                          />
                        </FormField>

                        <FormField label="INSTITUTION" required>
                          <Input
                            type="text"
                            placeholder="e.g. NIT Warangal / IIT Madras"
                            value={expert.institution || ''}
                            onChange={(e) => handleUpdateExpert(idx, 'institution', e.target.value)}
                          />
                        </FormField>

                        <FormField label="DESIGNATION">
                          <Input
                            type="text"
                            placeholder="Professor & Head"
                            value={expert.designation || ''}
                            onChange={(e) => handleUpdateExpert(idx, 'designation', e.target.value)}
                          />
                        </FormField>

                        <FormField label="EMAIL">
                          <Input
                            type="email"
                            placeholder="expert@nitw.ac.in"
                            value={expert.email || ''}
                            onChange={(e) => handleUpdateExpert(idx, 'email', e.target.value)}
                          />
                        </FormField>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.45rem', marginTop: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveExpert(idx)}
                          style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#475569', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Cancel / Remove
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveExpert(idx)}
                          style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: 'none', background: '#070F1E', color: '#F1C40F', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          Save Expert
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div style={{
                      background: '#F8FAFC',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A' }}>
                          {expert.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                          {expert.designation || 'Academician'} • <strong>{expert.institution}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => setEditingExpertIdx(idx)}
                          style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '0.74rem', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExpert(idx)}
                          title="Remove Expert"
                          aria-label="Remove Expert"
                          style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* CARD 4: INDUSTRY REPRESENTATIVE (RECOMMENDED) */}
      {/* ────────────────────────────────────────────────────────── */}
      <motion.div
        layout
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '1.25rem',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                Industry Representative
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#F1F5F9', color: '#475569', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                Corporate Leader
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              Corporate liaison to align curriculum with current industrial standards and employability.
            </p>
          </div>

          {!industryFormOpen && !formData.industryMember?.isSaved && (
            <button
              type="button"
              onClick={() => setIndustryFormOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                color: '#0F172A',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} /> Add Industry Member
            </button>
          )}
        </div>

        <AnimatePresence>
          {industryFormOpen && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '0.5rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                <FormField label="FULL NAME" required>
                  <Input
                    type="text"
                    placeholder="Industry Leader Name"
                    value={formData.industryMember?.name || ''}
                    onChange={(e) => setFormData({ ...formData, industryMember: { ...formData.industryMember, name: e.target.value } })}
                  />
                </FormField>

                <FormField label="COMPANY / ORGANIZATION" required>
                  <Input
                    type="text"
                    placeholder="e.g. TCS / Microsoft / Infosys"
                    value={formData.industryMember?.company || ''}
                    onChange={(e) => setFormData({ ...formData, industryMember: { ...formData.industryMember, company: e.target.value } })}
                  />
                </FormField>

                <FormField label="DESIGNATION">
                  <Input
                    type="text"
                    placeholder="Senior Architect / Director"
                    value={formData.industryMember?.designation || ''}
                    onChange={(e) => setFormData({ ...formData, industryMember: { ...formData.industryMember, designation: e.target.value } })}
                  />
                </FormField>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.85rem' }}>
                <button
                  type="button"
                  onClick={() => setIndustryFormOpen(false)}
                  style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveIndustry}
                  style={{ padding: '0.45rem 1.15rem', borderRadius: '8px', border: 'none', background: '#070F1E', color: '#F1C40F', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Industry Record
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!industryFormOpen && formData.industryMember?.isSaved && (
          <div style={{
            background: '#F8FAFC',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            border: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>
                {formData.industryMember.name}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                {formData.industryMember.designation || 'Lead Member'} • <strong>{formData.industryMember.company}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={() => setIndustryFormOpen(true)}
                style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '0.76rem', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleRemoveIndustry}
                title="Remove Industry Member"
                aria-label="Remove Industry Member"
                style={{ padding: '0.4rem 0.7rem', borderRadius: '8px', background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}

        {!industryFormOpen && !formData.industryMember?.isSaved && (
          <div style={{
            background: '#F8FAFC',
            borderRadius: '10px',
            padding: '1.25rem',
            textAlign: 'center',
            border: '1px dashed #CBD5E1',
            color: '#64748B'
          }}>
            <Briefcase size={28} style={{ color: '#CBD5E1', margin: '0 auto 0.35rem auto' }} />
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>No industry member added yet</div>
            <div style={{ fontSize: '0.74rem', marginTop: '0.15rem' }}>Click "+ Add Industry Member" to add a professional sector leader.</div>
          </div>
        )}
      </motion.div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* CARD 5: ALUMNI REPRESENTATIVE (RECOMMENDED) */}
      {/* ────────────────────────────────────────────────────────── */}
      <motion.div
        layout
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '1.25rem',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                Alumni Representative
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#F1F5F9', color: '#475569', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                NEC Alumnus/Alumna
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              Distinguished alumni providing feedback from the industry and post-graduate pathways.
            </p>
          </div>

          {!alumniFormOpen && !formData.alumniMember?.isSaved && (
            <button
              type="button"
              onClick={() => setAlumniFormOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                color: '#0F172A',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} /> Add Alumni Member
            </button>
          )}
        </div>

        <AnimatePresence>
          {alumniFormOpen && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '0.5rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                <FormField label="FULL NAME" required>
                  <Input
                    type="text"
                    placeholder="Alumnus Name"
                    value={formData.alumniMember?.name || ''}
                    onChange={(e) => setFormData({ ...formData, alumniMember: { ...formData.alumniMember, name: e.target.value } })}
                  />
                </FormField>

                <FormField label="CURRENT ORGANIZATION">
                  <Input
                    type="text"
                    placeholder="e.g. Google / Microsoft / Qualcomm"
                    value={formData.alumniMember?.company || ''}
                    onChange={(e) => setFormData({ ...formData, alumniMember: { ...formData.alumniMember, company: e.target.value } })}
                  />
                </FormField>

                <FormField label="BATCH / YEAR OF GRADUATION">
                  <Input
                    type="text"
                    placeholder="e.g. Batch of 2018"
                    value={formData.alumniMember?.batch || ''}
                    onChange={(e) => setFormData({ ...formData, alumniMember: { ...formData.alumniMember, batch: e.target.value } })}
                  />
                </FormField>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.85rem' }}>
                <button
                  type="button"
                  onClick={() => setAlumniFormOpen(false)}
                  style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAlumni}
                  style={{ padding: '0.45rem 1.15rem', borderRadius: '8px', border: 'none', background: '#070F1E', color: '#F1C40F', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Alumni Record
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!alumniFormOpen && formData.alumniMember?.isSaved && (
          <div style={{
            background: '#F8FAFC',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            border: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>
                {formData.alumniMember.name} {formData.alumniMember.batch ? `(${formData.alumniMember.batch})` : ''}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                {formData.alumniMember.designation || 'Alumni Lead'} • <strong>{formData.alumniMember.company || 'Industry'}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={() => setAlumniFormOpen(true)}
                style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '0.76rem', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleRemoveAlumni}
                title="Remove Alumni Member"
                aria-label="Remove Alumni Member"
                style={{ padding: '0.4rem 0.7rem', borderRadius: '8px', background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}

        {!alumniFormOpen && !formData.alumniMember?.isSaved && (
          <div style={{
            background: '#F8FAFC',
            borderRadius: '10px',
            padding: '1.25rem',
            textAlign: 'center',
            border: '1px dashed #CBD5E1',
            color: '#64748B'
          }}>
            <Users size={28} style={{ color: '#CBD5E1', margin: '0 auto 0.35rem auto' }} />
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>No alumni representative added yet</div>
            <div style={{ fontSize: '0.74rem', marginTop: '0.15rem' }}>Click "+ Add Alumni Member" to register a distinguished graduate.</div>
          </div>
        )}
      </motion.div>

      {/* Faculty Selector Modal */}
      <FacultySelectorModal
        isOpen={facultyModalOpen}
        onClose={() => setFacultyModalOpen(false)}
        onSelectFaculty={handleSelectChairman}
        defaultDepartment={formData.department || 'CSE'}
        selectedFacultyId={formData.chairmanFacultyId}
      />
    </div>
  );
}

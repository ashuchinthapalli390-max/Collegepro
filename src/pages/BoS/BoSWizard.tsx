import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  UserPlus,
  Plus,
  Trash2,
  Clock,
  Calendar,
  AlertTriangle,
  Upload,
  Sparkles,
  FileText,
  Building2,
  Layers,
  FileCheck
} from 'lucide-react'
import type { BoSMeeting, BoSMember, BoSAgendaItem, BoSMemberCategory, BoSMeetingStatus, BoSDocument } from '../../types/nec'
import { DepartmentResolver } from '../../utils/departmentResolver'
import { useBoSStore } from '../../store/useBoSStore'
import { useETPortalStore } from '../../store/useETPortalStore'

interface BoSWizardProps {
  onClose: () => void
  onSaveSuccess: (meetingId: string) => void
}

export const BoSWizard: React.FC<BoSWizardProps> = ({ onClose, onSaveSuccess }) => {
  const addMeeting = useBoSStore((s) => s.addMeeting)
  const facultyList = useETPortalStore((s) => s.faculty)

  const [currentStep, setCurrentStep] = useState<number>(1)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Form State
  const [departmentId, setDepartmentId] = useState<string>('dept-cys')
  const [regulation, setRegulation] = useState<string>('R23')
  const [academicYear, setAcademicYear] = useState<string>('2026-27')
  const [meetingNumber, setMeetingNumber] = useState<string>('BOS/CYS/2026/05')

  // Step 2: Chairman (Manual First)
  const [chairmanName, setChairmanName] = useState<string>('Dr. M. Sreenivasa Rao')
  const [chairmanDesig, setChairmanDesig] = useState<string>('Professor & Head')
  const [chairmanDept, setChairmanDept] = useState<string>('CSE (Cyber Security)')
  const [chairmanInst, setChairmanInst] = useState<string>('Narasaraopeta Engineering College (Autonomous)')
  const [chairmanEmail, setChairmanEmail] = useState<string>('hod.cys@nrtec.in')
  const [chairmanPhone, setChairmanPhone] = useState<string>('9440123456')
  const [chairmanRemarks, setChairmanRemarks] = useState<string>('')

  // Members List (Manual First)
  const [members, setMembers] = useState<BoSMember[]>([
    {
      id: 'mem-01',
      name: 'Dr. Ch. Satyanarayana',
      designation: 'Professor of CSE',
      department: 'Computer Science & Engineering',
      institution: 'JNTUK Kakinada',
      email: 'ch.satya@jntuk.edu.in',
      phone: '9848011223',
      category: 'University Nominee',
      isManual: true
    },
    {
      id: 'mem-02',
      name: 'Sri. K. Ramesh Kumar',
      designation: 'Principal Security Architect',
      department: 'Cyber Defense Division',
      institution: 'Tata Consultancy Services (TCS)',
      email: 'ramesh.k@tcs.com',
      category: 'Industry Expert',
      isManual: true
    }
  ])

  // Step 3: Meeting Schedule & Postponement
  const [meetingStatus, setMeetingStatus] = useState<BoSMeetingStatus>('SCHEDULED')
  const [bosDate, setBosDate] = useState<string>('2026-09-10')
  const [startTime, setStartTime] = useState<string>('10:00 AM')
  const [endTime, setEndTime] = useState<string>('01:00 PM')
  const [meetingMode, setMeetingMode] = useState<'Offline' | 'Online' | 'Hybrid'>('Hybrid')
  const [venue, setVenue] = useState<string>('Board Room (Block-3) & Microsoft Teams')
  const [meetingLink, setMeetingLink] = useState<string>('')

  // Postponement details
  const [rescheduledDate, setRescheduledDate] = useState<string>('')
  const [rescheduledStartTime, setRescheduledStartTime] = useState<string>('11:00 AM')
  const [rescheduledEndTime, setRescheduledEndTime] = useState<string>('02:00 PM')
  const [postponeReason, setPostponeReason] = useState<string>('')

  // Agenda Items
  const [agendaItems, setAgendaItems] = useState<BoSAgendaItem[]>([
    {
      id: 'agenda-1',
      itemNo: 1,
      title: 'Opening Remarks & Approval of Previous Minutes',
      startTime: '10:00 AM',
      endTime: '10:20 AM',
      description: 'Welcome address by Chairman and review of Action Taken Report.',
      decisionResolution: 'Resolved to approve previous minutes unanimously.'
    },
    {
      id: 'agenda-2',
      itemNo: 2,
      title: 'Review of R23 IV-Year Curriculum Structure & Electives',
      startTime: '10:20 AM',
      endTime: '11:45 AM',
      description: 'Deliberations on Cloud Security, DevSecOps, and Cyber Threat Hunting courses.',
      decisionResolution: 'Curriculum structure recommended for Academic Council approval.'
    }
  ])

  // Documents
  const [documents, setDocuments] = useState<BoSDocument[]>([])

  // Helper: Autofill Chairman from Faculty Directory
  const handleAutofillChairman = (facId: string) => {
    const fac = facultyList.find((f) => f.id === facId)
    if (!fac) return
    setChairmanName(fac.name)
    setChairmanDesig(fac.designation)
    setChairmanDept(DepartmentResolver.getDisplayName(fac.departmentId))
    setChairmanEmail(fac.email)
    setChairmanPhone(fac.phone)
  }

  // Member Management
  const addEmptyMember = () => {
    setMembers([
      ...members,
      {
        id: `mem_${Date.now()}`,
        name: '',
        designation: '',
        department: '',
        institution: '',
        category: 'Academic Expert',
        isManual: true
      }
    ])
  }

  const updateMember = (idx: number, updated: Partial<BoSMember>) => {
    const next = [...members]
    next[idx] = { ...next[idx], ...updated }
    setMembers(next)
  }

  const removeMember = (idx: number) => {
    setMembers(members.filter((_, i) => i !== idx))
  }

  // Agenda Management
  const addAgendaItem = () => {
    setAgendaItems([
      ...agendaItems,
      {
        id: `agenda_${Date.now()}`,
        itemNo: agendaItems.length + 1,
        title: '',
        startTime: '',
        endTime: '',
        description: '',
        decisionResolution: ''
      }
    ])
  }

  const updateAgendaItem = (idx: number, updated: Partial<BoSAgendaItem>) => {
    const next = [...agendaItems]
    next[idx] = { ...next[idx], ...updated }
    setAgendaItems(next)
  }

  const removeAgendaItem = (idx: number) => {
    const next = agendaItems.filter((_, i) => i !== idx).map((item, i) => ({ ...item, itemNo: i + 1 }))
    setAgendaItems(next)
  }

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const newDoc: BoSDocument = {
      id: `doc_${Date.now()}`,
      name: file.name,
      type: file.name.toLowerCase().includes('minutes') ? 'Minutes' : 'Curriculum Structure',
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: chairmanName || 'BoS Chairperson',
      sizeBytes: file.size
    }

    setDocuments([...documents, newDoc])
  }

  // Final Save Handler
  const handleSave = () => {
    if (!chairmanName.trim()) {
      setErrorMsg('Please enter Chairman Name.')
      setCurrentStep(2)
      return
    }

    const chairman: BoSMember = {
      id: `mem_chair_${Date.now()}`,
      name: chairmanName,
      designation: chairmanDesig,
      department: chairmanDept,
      institution: chairmanInst,
      email: chairmanEmail.trim() ? chairmanEmail : undefined,
      phone: chairmanPhone.trim() ? chairmanPhone : undefined,
      category: 'Chairman',
      remarks: chairmanRemarks,
      isManual: true
    }

    const postponementHistory = []
    if (meetingStatus === 'POSTPONED' && rescheduledDate) {
      postponementHistory.push({
        id: `postpone_${Date.now()}`,
        previousDate: bosDate,
        previousStartTime: startTime,
        previousEndTime: endTime,
        newDate: rescheduledDate,
        newStartTime: rescheduledStartTime,
        newEndTime: rescheduledEndTime,
        reason: postponeReason || 'Rescheduled per committee request.',
        changedAt: new Date().toISOString(),
        changedBy: chairmanName
      })
    }

    const newMeetingId = `bos_${Date.now()}`
    const meeting: BoSMeeting = {
      id: newMeetingId,
      meetingNumber,
      departmentId,
      regulation,
      academicYear,
      bosDate: meetingStatus === 'POSTPONED' && rescheduledDate ? rescheduledDate : bosDate,
      startTime: meetingStatus === 'POSTPONED' && rescheduledStartTime ? rescheduledStartTime : startTime,
      endTime: meetingStatus === 'POSTPONED' && rescheduledEndTime ? rescheduledEndTime : endTime,
      meetingMode,
      venue,
      meetingLink,
      meetingStatus,
      chairman,
      members,
      agendaItems,
      postponementHistory,
      documents
    }

    addMeeting(meeting)
    onSaveSuccess(newMeetingId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col text-text-primary"
      >
        {/* Wizard Header */}
        <div className="px-6 py-4 border-b border-border bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight">Create Board of Studies (BoS) Record</h2>
            <p className="text-xs text-slate-400">Step-by-step academic governance meeting and agenda builder</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700">
            Exit Wizard
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 border-b border-border bg-muted/30 text-xs font-bold">
          {[
            { num: 1, label: 'Department & Reg' },
            { num: 2, label: 'Chairman & Members' },
            { num: 3, label: 'Schedule & Agenda' },
            { num: 4, label: 'Minutes & Documents' }
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`py-3 px-4 flex items-center gap-2 cursor-pointer border-b-2 transition-all ${
                currentStep === s.num
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-surface'
                  : currentStep > s.num
                  ? 'border-emerald-500 text-emerald-600 bg-surface/50'
                  : 'border-transparent text-text-secondary hover:bg-muted/50'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                  currentStep === s.num
                    ? 'bg-indigo-600 text-white'
                    : currentStep > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-text-secondary'
                }`}
              >
                {currentStep > s.num ? '✓' : s.num}
              </span>
              <span className="truncate">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Department Scope & Academic Regulation</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">
                    Canonical ET Department *
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl font-bold focus:outline-none focus:border-indigo-500 text-text-primary"
                  >
                    {DepartmentResolver.getETOptions().map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-text-secondary mt-1">
                    All historical aliases (CYS, Cyber Security, CSE (Cyber Security)) resolve to this canonical ID.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Regulation *</label>
                  <select
                    value={regulation}
                    onChange={(e) => setRegulation(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl font-bold focus:outline-none focus:border-indigo-500 text-text-primary"
                  >
                    <option value="R23">R23 Autonomous Academic Regulation</option>
                    <option value="R20">R20 Autonomous Academic Regulation</option>
                    <option value="R19">R19 Autonomous Academic Regulation</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Academic Year *</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="2026-27"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl font-semibold focus:outline-none focus:border-indigo-500 text-text-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Meeting Reference # *</label>
                  <input
                    type="text"
                    value={meetingNumber}
                    onChange={(e) => setMeetingNumber(e.target.value)}
                    placeholder="BOS/CYS/2026/05"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl font-mono font-semibold focus:outline-none focus:border-indigo-500 text-text-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Chairman Manual Form */}
              <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/10 dark:bg-indigo-950/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-indigo-600" />
                    <span>BoS Chairman Details (100% Manual Entry First)</span>
                  </h3>
                  {facultyList.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className="text-text-secondary">Or helper:</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleAutofillChairman(e.target.value)
                        }}
                        className="px-2 py-1 bg-surface border border-border rounded text-xs font-medium"
                      >
                        <option value="">Autofill from Faculty Directory...</option>
                        {facultyList.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} ({f.designation})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Name *</label>
                    <input
                      type="text"
                      value={chairmanName}
                      onChange={(e) => setChairmanName(e.target.value)}
                      placeholder="Dr. M. Sreenivasa Rao"
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500 text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Designation *</label>
                    <input
                      type="text"
                      value={chairmanDesig}
                      onChange={(e) => setChairmanDesig(e.target.value)}
                      placeholder="Professor & Head"
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Department *</label>
                    <input
                      type="text"
                      value={chairmanDept}
                      onChange={(e) => setChairmanDept(e.target.value)}
                      placeholder="CSE (Cyber Security)"
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Institution</label>
                    <input
                      type="text"
                      value={chairmanInst}
                      onChange={(e) => setChairmanInst(e.target.value)}
                      placeholder="Narasaraopeta Engineering College (Autonomous)"
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      value={chairmanEmail}
                      onChange={(e) => setChairmanEmail(e.target.value)}
                      placeholder="hod.cys@nrtec.in (or leave blank)"
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Phone (Optional)</label>
                    <input
                      type="text"
                      value={chairmanPhone}
                      onChange={(e) => setChairmanPhone(e.target.value)}
                      placeholder="9440123456 (or leave blank)"
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none text-text-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary">
                    BoS Committee Members ({members.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addEmptyMember}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus size={14} />
                    <span>Add Member</span>
                  </button>
                </div>

                {members.map((mem, idx) => (
                  <div key={mem.id} className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-text-secondary">Member #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeMember(idx)}
                        className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-semibold"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-text-secondary block">Full Name *</label>
                        <input
                          type="text"
                          value={mem.name}
                          onChange={(e) => updateMember(idx, { name: e.target.value })}
                          placeholder="Dr. Ch. Satyanarayana"
                          className="w-full px-2 py-1 bg-surface border border-border rounded text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary block">Designation</label>
                        <input
                          type="text"
                          value={mem.designation}
                          onChange={(e) => updateMember(idx, { designation: e.target.value })}
                          placeholder="Professor of CSE"
                          className="w-full px-2 py-1 bg-surface border border-border rounded text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary block">Category *</label>
                        <select
                          value={mem.category}
                          onChange={(e) => updateMember(idx, { category: e.target.value as BoSMemberCategory })}
                          className="w-full px-2 py-1 bg-surface border border-border rounded text-xs font-semibold focus:outline-none"
                        >
                          <option value="University Nominee">University Nominee</option>
                          <option value="Academic Expert">Academic Expert</option>
                          <option value="Industry Expert">Industry Expert</option>
                          <option value="Alumni Member">Alumni Member</option>
                          <option value="Internal Member">Internal Member</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary block">Institution / Org</label>
                        <input
                          type="text"
                          value={mem.institution}
                          onChange={(e) => updateMember(idx, { institution: e.target.value })}
                          placeholder="JNTUK Kakinada / TCS"
                          className="w-full px-2 py-1 bg-surface border border-border rounded text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary block">Email (Optional)</label>
                        <input
                          type="email"
                          value={mem.email || ''}
                          onChange={(e) => updateMember(idx, { email: e.target.value })}
                          placeholder="Official email"
                          className="w-full px-2 py-1 bg-surface border border-border rounded text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary block">Phone (Optional)</label>
                        <input
                          type="text"
                          value={mem.phone || ''}
                          onChange={(e) => updateMember(idx, { phone: e.target.value })}
                          placeholder="Contact phone"
                          className="w-full px-2 py-1 bg-surface border border-border rounded text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Meeting Schedule */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Meeting Schedule & Status</span>
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Status</label>
                    <select
                      value={meetingStatus}
                      onChange={(e) => setMeetingStatus(e.target.value as BoSMeetingStatus)}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-bold focus:outline-none text-text-primary"
                    >
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="POSTPONED">POSTPONED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Meeting Date *</label>
                    <input
                      type="date"
                      value={bosDate}
                      onChange={(e) => setBosDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold focus:outline-none text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Time Slot (Start)</label>
                    <input
                      type="text"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="10:00 AM"
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold focus:outline-none text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Time Slot (End)</label>
                    <input
                      type="text"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      placeholder="01:00 PM"
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold focus:outline-none text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Meeting Mode</label>
                    <select
                      value={meetingMode}
                      onChange={(e) => setMeetingMode(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold focus:outline-none text-text-primary"
                    >
                      <option value="Hybrid">Hybrid</option>
                      <option value="Offline">Offline</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-xs font-bold text-text-secondary block mb-1">Venue / Online Link</label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="Cyber Security Seminar Hall & Teams link"
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none text-text-primary"
                    />
                  </div>
                </div>

                {/* POSTPONEMENT SECTION */}
                {meetingStatus === 'POSTPONED' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900 space-y-2 mt-3"
                  >
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold">
                      <AlertTriangle size={15} />
                      <span>Rescheduled Postponement Details</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-text-secondary block mb-1">New Rescheduled Date *</label>
                        <input
                          type="date"
                          value={rescheduledDate}
                          onChange={(e) => setRescheduledDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary block mb-1">New Time Slot (Start)</label>
                        <input
                          type="text"
                          value={rescheduledStartTime}
                          onChange={(e) => setRescheduledStartTime(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary block mb-1">New Time Slot (End)</label>
                        <input
                          type="text"
                          value={rescheduledEndTime}
                          onChange={(e) => setRescheduledEndTime(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="text-[10px] font-bold text-text-secondary block mb-1">Reason for Postponement *</label>
                        <input
                          type="text"
                          value={postponeReason}
                          onChange={(e) => setPostponeReason(e.target.value)}
                          placeholder="e.g. University Nominee requested postponement due to external academic inspection."
                          className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Agenda Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Agenda Items & Time Slots ({agendaItems.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addAgendaItem}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus size={14} />
                    <span>Add Agenda Item</span>
                  </button>
                </div>

                {agendaItems.map((item, idx) => (
                  <div key={item.id} className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-indigo-600">Item #{item.itemNo}</span>
                      <button
                        type="button"
                        onClick={() => removeAgendaItem(idx)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Remove Item</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-text-secondary block">Agenda Title *</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateAgendaItem(idx, { title: e.target.value })}
                          placeholder="Title of Discussion / Resolution"
                          className="w-full px-2 py-1.5 bg-surface border border-border rounded text-xs font-semibold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary block">Start Time</label>
                        <input
                          type="text"
                          value={item.startTime || ''}
                          onChange={(e) => updateAgendaItem(idx, { startTime: e.target.value })}
                          placeholder="10:00 AM"
                          className="w-full px-2 py-1.5 bg-surface border border-border rounded text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary block">End Time</label>
                        <input
                          type="text"
                          value={item.endTime || ''}
                          onChange={(e) => updateAgendaItem(idx, { endTime: e.target.value })}
                          placeholder="10:30 AM"
                          className="w-full px-2 py-1.5 bg-surface border border-border rounded text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-text-secondary block">Discussion Notes / Abstract</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateAgendaItem(idx, { description: e.target.value })}
                        placeholder="Context of curriculum changes or course additions..."
                        className="w-full px-2.5 py-1.5 bg-surface border border-border rounded text-xs focus:outline-none min-h-[50px]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-text-secondary block">Formal BoS Decision / Resolution</label>
                      <input
                        type="text"
                        value={item.decisionResolution}
                        onChange={(e) => updateAgendaItem(idx, { decisionResolution: e.target.value })}
                        placeholder="e.g. Resolved and approved unanimously."
                        className="w-full px-2.5 py-1.5 bg-surface border border-border rounded text-xs font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>Minutes, Curriculum Structure & Signed Documents</span>
              </h3>

              <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-muted/20 flex flex-col items-center justify-center gap-2">
                <input
                  type="file"
                  id="bos-file-input"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="bos-file-input"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <Upload size={14} />
                  <span>Select Signed PDF Document</span>
                </label>
                <p className="text-[11px] text-text-secondary">
                  Real file size and bytes will be linked directly to this BoS package.
                </p>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-text-secondary uppercase">Attached Documents</h4>
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <div>
                          <span className="font-bold text-xs block text-text-primary">{doc.name}</span>
                          <span className="text-[10px] text-text-secondary">
                            {doc.type} • {(doc.sizeBytes / 1024).toFixed(1)} KB • Uploaded on {doc.uploadedAt}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Ready
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="px-4 py-2 text-xs font-bold border border-border rounded-xl hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-text-secondary"
          >
            <ChevronLeft size={15} />
            <span>Previous</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold border border-border hover:bg-muted rounded-xl text-text-secondary"
            >
              Cancel
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-1 shadow-sm"
              >
                <span>Next Step</span>
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 size={15} />
                <span>Create & Commit BoS Record</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageSquare, UserCheck, Mail, X, CheckCircle2, ShieldCheck } from 'lucide-react'
import type { AttendanceRecord, ParentContactStatus } from '../../types/nec'
import { DepartmentResolver } from '../../utils/departmentResolver'
import { useAttendanceStore } from '../../store/useAttendanceStore'

interface ParentContactModalProps {
  isOpen: boolean
  onClose: () => void
  record: AttendanceRecord | null
}

export const ParentContactModal: React.FC<ParentContactModalProps> = ({
  isOpen,
  onClose,
  record
}) => {
  const updateParentContact = useAttendanceStore((s) => s.updateParentContact)

  const [status, setStatus] = useState<ParentContactStatus>(record?.parentContactStatus || 'Called')
  const [notes, setNotes] = useState(record?.contactNotes || '')
  const [contactedDate, setContactedDate] = useState(
    record?.lastContactedAt || new Date().toISOString().split('T')[0]
  )
  const [isSaved, setIsSaved] = useState(false)

  if (!isOpen || !record) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateParentContact(record.id, status, notes, contactedDate)
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
      onClose()
    }, 800)
  }

  const isRisk = record.percentage < 65.0

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Guardian Contact & Condonation Alert</h3>
                <p className="text-[11px] text-slate-400">Authorized student mentor & HOD communication log</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSave} className="p-6 space-y-4 text-xs text-text-primary">
            {/* Student & Parent Details Card */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-text-primary block">{record.studentName}</span>
                  <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{record.rollNumber}</span>
                </div>
                <div className="text-right">
                  <span className={`text-base font-black ${isRisk ? 'text-red-600 dark:text-red-400' : 'text-emerald-600'}`}>
                    {record.percentage.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {record.classesAttended} / {record.classesHeld} classes
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-[11px]">
                <div>
                  <span className="text-text-secondary block">Department</span>
                  <span className="font-semibold">{DepartmentResolver.getDisplayName(record.departmentId)}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Class Cohort</span>
                  <span className="font-semibold">{record.year} Year • Sec {record.section}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Guardian Name</span>
                  <span className="font-semibold text-text-primary">{record.guardianName || 'Parent / Guardian'}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Unmasked Contact Phone</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {record.guardianPhone || '9848123402'}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-text-secondary block mb-1">Contact Status</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
                  {(['Called', 'SMS Sent', 'Parent Met', 'Notice Dispatched'] as ParentContactStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border transition-all ${
                        status === s
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                          : 'bg-muted/40 border-border text-text-secondary hover:bg-muted'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-secondary block mb-1">Date of Communication</label>
                <input
                  type="date"
                  value={contactedDate}
                  onChange={(e) => setContactedDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-muted/40 border border-border focus:border-indigo-500 rounded-lg text-xs font-semibold focus:outline-none text-text-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-secondary block mb-1">Discussion Remarks / Action Taken</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Informed father regarding 60.9% attendance; requested medical leave certificate and parent undertaking letter."
                  className="w-full px-3 py-2 bg-muted/40 border border-border focus:border-indigo-500 rounded-lg text-xs focus:outline-none min-h-[70px] text-text-primary"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold border border-border hover:bg-muted text-text-secondary rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
              >
                {isSaved ? <CheckCircle2 size={15} /> : <Phone size={15} />}
                <span>{isSaved ? 'Saved Log' : 'Save Communication Log'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

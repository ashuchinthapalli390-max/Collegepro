import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertOctagon, X, Trash2 } from 'lucide-react'
import type { AttendanceBatch } from '../../types/nec'
import { DepartmentResolver } from '../../utils/departmentResolver'
import { useAttendanceStore } from '../../store/useAttendanceStore'

interface ClearCurrentModalProps {
  isOpen: boolean
  onClose: () => void
  activeBatch: AttendanceBatch | null
  onSuccess: () => void
}

export const ClearCurrentModal: React.FC<ClearCurrentModalProps> = ({
  isOpen,
  onClose,
  activeBatch,
  onSuccess
}) => {
  const clearCurrentBatch = useAttendanceStore((s) => s.clearCurrentBatch)
  const [confirmText, setConfirmText] = useState('')
  const [error, setError] = useState('')

  if (!isOpen || !activeBatch) return null

  const handleClear = () => {
    if (confirmText.trim().toUpperCase() !== 'REMOVE') {
      setError('Please type REMOVE exactly to confirm deletion.')
      return
    }

    const res = clearCurrentBatch({
      batchId: activeBatch.id,
      removedBy: 'Dr. M. Sreenivasa Rao (HOD CYS)'
    })

    if (res.success) {
      onSuccess()
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-surface border border-red-200 dark:border-red-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-red-500/10 text-red-600 dark:text-red-400">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-600 flex items-center justify-center">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight text-text-primary">
                  Clear Active Attendance Dataset
                </h3>
                <p className="text-[11px] text-text-secondary">Destructive administrative action</p>
              </div>
            </div>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 text-xs text-text-primary">
            <p className="text-text-secondary leading-relaxed">
              You are about to remove the currently active attendance dataset for this cohort. This will clear active condonation alerts until a new spreadsheet is imported.
            </p>

            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-text-secondary">Department:</span>
                <span className="font-bold">{DepartmentResolver.getDisplayName(activeBatch.departmentId)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Cohort:</span>
                <span className="font-bold">{activeBatch.year} Year • Section {activeBatch.section} ({activeBatch.monthYear})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Enrolled:</span>
                <span className="font-bold">{activeBatch.totalStudents} Students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Active Risk Alerts:</span>
                <span className="font-bold text-red-600 dark:text-red-400">{activeBatch.riskStudentsCount} Students (&lt;65%)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary block">
                Type <span className="text-red-600 font-mono font-black">REMOVE</span> to proceed:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value)
                  setError('')
                }}
                placeholder="REMOVE"
                className="w-full px-3 py-2 bg-muted/40 border border-border focus:border-red-500 rounded-xl text-sm font-mono focus:outline-none text-text-primary"
              />
              {error && <p className="text-[11px] text-red-600 font-semibold">{error}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2 bg-muted/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold border border-border hover:bg-muted text-text-secondary rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={confirmText.trim().toUpperCase() !== 'REMOVE'}
              className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-lg shadow-red-500/20 flex items-center gap-1.5 transition-all"
            >
              <Trash2 size={15} />
              <span>Clear Attendance Data</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

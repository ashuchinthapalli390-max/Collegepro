import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, AlertTriangle, X, CheckSquare, Square, ShieldAlert } from 'lucide-react'
import type { AttendanceBatch } from '../../types/nec'
import { DepartmentResolver } from '../../utils/departmentResolver'
import { useAttendanceStore } from '../../store/useAttendanceStore'

interface RemovePreviousModalProps {
  isOpen: boolean
  onClose: () => void
  previousBatch: AttendanceBatch | null
  onSuccess: (removedCount: number) => void
}

export const RemovePreviousModal: React.FC<RemovePreviousModalProps> = ({
  isOpen,
  onClose,
  previousBatch,
  onSuccess
}) => {
  const removePreviousBatch = useAttendanceStore((s) => s.removePreviousBatch)

  const [removeSnapshots, setRemoveSnapshots] = useState(true)
  const [removeAlerts, setRemoveAlerts] = useState(true)
  const [retainParentContact, setRetainParentContact] = useState(true)

  if (!isOpen || !previousBatch) return null

  const handleConfirm = () => {
    const res = removePreviousBatch({
      batchId: previousBatch.id,
      removeSnapshots,
      removeAlerts,
      retainParentContact,
      removedBy: 'Dr. M. Sreenivasa Rao (HOD CYS)'
    })

    if (res.success) {
      onSuccess(res.removedCount)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight text-text-primary">
                  Remove Previous Attendance Dataset
                </h3>
                <p className="text-[11px] text-text-secondary">
                  Clean up old monthly records safely while preserving audit history
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 text-xs text-text-primary">
            {/* Target Batch Info Card */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-text-secondary uppercase">Previous Month Dataset</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                  REPLACED
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-text-secondary block text-[10px]">Month / Period</span>
                  <span className="font-bold">{previousBatch.monthYear}</span>
                </div>
                <div>
                  <span className="text-text-secondary block text-[10px]">Department</span>
                  <span className="font-bold">{DepartmentResolver.getShortName(previousBatch.departmentId)}</span>
                </div>
                <div>
                  <span className="text-text-secondary block text-[10px]">Cohort</span>
                  <span className="font-bold">{previousBatch.year} Year • Section {previousBatch.section}</span>
                </div>
                <div>
                  <span className="text-text-secondary block text-[10px]">Students / Risk Alerts</span>
                  <span className="font-bold">{previousBatch.totalStudents} total • <span className="text-red-500 font-bold">{previousBatch.riskStudentsCount} alerts</span></span>
                </div>
              </div>
            </div>

            {/* Granular Removal Selection */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
                Cleanup Options
              </label>

              <div
                onClick={() => setRemoveSnapshots(!removeSnapshots)}
                className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-surface cursor-pointer hover:bg-muted/30 transition-colors"
              >
                {removeSnapshots ? <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" /> : <Square className="w-4 h-4 text-text-secondary shrink-0" />}
                <div>
                  <span className="font-semibold block">Attendance student snapshot rows</span>
                  <span className="text-[10px] text-text-secondary">Purges detailed student attendance percentages for {previousBatch.monthYear}</span>
                </div>
              </div>

              <div
                onClick={() => setRemoveAlerts(!removeAlerts)}
                className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-surface cursor-pointer hover:bg-muted/30 transition-colors"
              >
                {removeAlerts ? <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" /> : <Square className="w-4 h-4 text-text-secondary shrink-0" />}
                <div>
                  <span className="font-semibold block">Previous monthly condonation risk alerts</span>
                  <span className="text-[10px] text-text-secondary">Removes old &lt;65% alert badges from active risk views</span>
                </div>
              </div>

              <div
                onClick={() => setRetainParentContact(!retainParentContact)}
                className="flex items-center gap-2.5 p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-900 bg-indigo-50/20 dark:bg-indigo-950/20 cursor-pointer transition-colors"
              >
                {retainParentContact ? <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" /> : <Square className="w-4 h-4 text-text-secondary shrink-0" />}
                <div>
                  <span className="font-semibold text-indigo-900 dark:text-indigo-200 block">Retain parent contact history (Recommended)</span>
                  <span className="text-[10px] text-indigo-700/80 dark:text-indigo-300/80">Preserves guardian SMS and call logs as official institutional evidence</span>
                </div>
              </div>
            </div>

            {/* Audit Preserved Notice */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-text-secondary flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong>Audit Record Preserved: </strong> Batch metadata (filename, upload date, record count, checksum, and deletion timestamp) will remain in the Audit Log for NAAC/NBA compliance inspections.
              </span>
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
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
            >
              <Trash2 size={15} />
              <span>Remove Previous Dataset</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

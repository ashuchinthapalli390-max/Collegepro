import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FileCheck2,
  Plus,
  Download,
  Calendar,
  Clock,
  Users,
  FileText,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  CheckCircle2,
  Building2,
  Eye,
  Trash2
} from 'lucide-react'
import { useBoSStore } from '../../store/useBoSStore'
import { DepartmentResolver } from '../../utils/departmentResolver'
import { ExportService } from '../../utils/exportUtils'
import type { BoSMeeting } from '../../types/nec'
import { BoSWizard } from './BoSWizard'

export const BoSPage: React.FC = () => {
  const { meetings, deleteMeeting } = useBoSStore()

  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')
  const [selectedReg, setSelectedReg] = useState<string>('ALL')
  const [wizardOpen, setWizardOpen] = useState(false)
  const [detailMeeting, setDetailMeeting] = useState<BoSMeeting | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      if (selectedDept !== 'ALL_ET') {
        const resolved = DepartmentResolver.resolve(selectedDept)
        if (resolved.success && m.departmentId !== resolved.department.id) return false
      }
      if (selectedReg !== 'ALL' && m.regulation !== selectedReg) return false
      return true
    })
  }, [meetings, selectedDept, selectedReg])

  const handleExportPDF = (meeting: BoSMeeting) => {
    ExportService.exportBoSPDF(meeting)
    showToast(`Exported formal BoS Governance Report for ${meeting.meetingNumber}.`)
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white shadow-2xl border border-indigo-500/40 flex items-center gap-3 text-xs font-semibold"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              ACADEMIC GOVERNANCE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              AUTONOMOUS STATUTORY BODY
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Board of Studies (BoS) Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Syllabus framing, curriculum revisions, expert committee resolutions, postponement audit tracking, and signed minutes repository.
          </p>
        </div>

        <button
          onClick={() => setWizardOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Add BoS Meeting Record</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500 text-text-primary"
            >
              <option value="ALL_ET">All ET Departments (AI, AIML, CYS, DS)</option>
              {DepartmentResolver.getETOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Regulation</label>
            <select
              value={selectedReg}
              onChange={(e) => setSelectedReg(e.target.value)}
              className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500 text-text-primary"
            >
              <option value="ALL">All Regulations</option>
              <option value="R23">R23 Regulation</option>
              <option value="R20">R20 Regulation</option>
              <option value="R19">R19 Regulation</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-text-secondary font-medium">
          Showing <strong>{filteredMeetings.length}</strong> official BoS meeting packages
        </span>
      </div>

      {/* Meeting Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeetings.map((meeting) => {
          const isPostponed = meeting.meetingStatus === 'POSTPONED'
          const deptName = DepartmentResolver.getDisplayName(meeting.departmentId)
          const latestPostpone = meeting.postponementHistory?.[meeting.postponementHistory.length - 1]

          return (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                        {meeting.regulation}
                      </span>
                      <span className="font-mono text-xs font-bold text-text-secondary">
                        {meeting.meetingNumber}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-text-primary mt-1">{deptName}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                      isPostponed
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                        : meeting.meetingStatus === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900'
                    }`}
                  >
                    {meeting.meetingStatus}
                  </span>
                </div>

                {/* Schedule Box */}
                <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-text-primary font-semibold">
                    <Calendar size={14} className="text-indigo-600 shrink-0" />
                    <span>{new Date(meeting.bosDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="text-text-secondary">•</span>
                    <Clock size={14} className="text-indigo-600 shrink-0" />
                    <span>{meeting.startTime} – {meeting.endTime}</span>
                  </div>

                  <p className="text-[11px] text-text-secondary truncate">
                    Mode: {meeting.meetingMode} ({meeting.venue || 'Campus Board Room'})
                  </p>

                  {/* Postponement History Notice */}
                  {isPostponed && latestPostpone && (
                    <div className="mt-2 pt-2 border-t border-border text-[11px] text-amber-700 dark:text-amber-400 space-y-0.5">
                      <div className="flex items-center gap-1 font-bold">
                        <AlertTriangle size={12} />
                        <span>Rescheduled Notice</span>
                      </div>
                      <p className="text-[10px]">
                        Original: {latestPostpone.previousDate} ({latestPostpone.previousStartTime}–{latestPostpone.previousEndTime})
                      </p>
                      <p className="text-[10px] italic">
                        Reason: {latestPostpone.reason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Stats Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-[10px] text-text-secondary block">Chairman</span>
                    <span className="font-bold text-text-primary truncate block">{meeting.chairman.name.split(' ')[1] || meeting.chairman.name}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-[10px] text-text-secondary block">Members</span>
                    <span className="font-bold text-text-primary block">{meeting.members.length + 1} Committee</span>
                  </div>

                  <div className="p-2 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-[10px] text-text-secondary block">Agenda Items</span>
                    <span className="font-bold text-text-primary block">{meeting.agendaItems.length} Topics</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportPDF(meeting)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-text-primary text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download size={13} />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => setDetailMeeting(meeting)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Eye size={13} />
                    <span>View Agenda</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    deleteMeeting(meeting.id)
                    showToast('BoS Meeting record deleted.')
                  }}
                  className="p-1.5 text-text-secondary hover:text-red-600 transition-colors"
                  title="Delete record"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Details View Modal */}
      {detailMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] overflow-hidden flex flex-col text-text-primary">
            <div className="px-6 py-4 border-b border-border bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">{detailMeeting.meetingNumber}</span>
                <h3 className="font-bold text-base">{DepartmentResolver.getDisplayName(detailMeeting.departmentId)}</h3>
              </div>
              <button onClick={() => setDetailMeeting(null)} className="text-slate-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700">
                Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Committee Members Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-text-primary flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Committee Members</span>
                </h4>
                <div className="border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-muted/50 text-text-secondary border-b border-border">
                      <tr>
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3">Designation</th>
                        <th className="py-2 px-3">Institution / Org</th>
                        <th className="py-2 px-3">Category</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="bg-indigo-50/20 dark:bg-indigo-950/10 font-semibold">
                        <td className="py-2 px-3 text-indigo-600 dark:text-indigo-400">{detailMeeting.chairman.name}</td>
                        <td className="py-2 px-3">{detailMeeting.chairman.designation}</td>
                        <td className="py-2 px-3">{detailMeeting.chairman.institution}</td>
                        <td className="py-2 px-3 font-bold">Chairman (HoD)</td>
                      </tr>
                      {detailMeeting.members.map((m) => (
                        <tr key={m.id}>
                          <td className="py-2 px-3 font-medium">{m.name}</td>
                          <td className="py-2 px-3 text-text-secondary">{m.designation}</td>
                          <td className="py-2 px-3 text-text-secondary">{m.institution}</td>
                          <td className="py-2 px-3 font-bold text-text-secondary">{m.category}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Agenda & Resolutions */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-text-primary flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Agenda & Formal Resolutions</span>
                </h4>
                <div className="space-y-2">
                  {detailMeeting.agendaItems.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-text-primary">
                          Item #{item.itemNo}: {item.title}
                        </span>
                        <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                          {item.startTime} – {item.endTime}
                        </span>
                      </div>
                      <p className="text-text-secondary text-[11px]">{item.description}</p>
                      <div className="mt-1 pt-1.5 border-t border-border/60 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                        ✓ Resolution: {item.decisionResolution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
              <button
                onClick={() => handleExportPDF(detailMeeting)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Download size={14} />
                <span>Export Official Signed Minutes PDF</span>
              </button>
              <button
                onClick={() => setDetailMeeting(null)}
                className="px-4 py-2 border border-border rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Dialog */}
      {wizardOpen && (
        <BoSWizard
          onClose={() => setWizardOpen(false)}
          onSaveSuccess={(id) => {
            setWizardOpen(false)
            showToast('New BoS meeting package committed successfully!')
          }}
        />
      )}
    </div>
  )
}

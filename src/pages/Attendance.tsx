import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Trash2,
  Database,
  ChevronDown,
  ShieldCheck,
  Phone,
  Eye,
  AlertCircle,
  FileText,
  Clock,
  UserCheck,
  X
} from 'lucide-react'
import { useAttendanceStore } from '../store/useAttendanceStore'
import { DepartmentResolver } from '../utils/departmentResolver'
import { ExportService } from '../utils/exportUtils'
import type { AttendanceRecord, AttendanceBatch } from '../types/nec'
import { AttendanceImportModal } from '../components/attendance/AttendanceImportModal'
import { RemovePreviousModal } from '../components/attendance/RemovePreviousModal'
import { ClearCurrentModal } from '../components/attendance/ClearCurrentModal'
import { ParentContactModal } from '../components/attendance/ParentContactModal'

export const AttendancePage: React.FC = () => {
  const { batches, records, auditLogs } = useAttendanceStore()

  // Filter States
  const [selectedDept, setSelectedDept] = useState<string>('dept-cys')
  const [selectedYear, setSelectedYear] = useState<string>('III')
  const [selectedSection, setSelectedSection] = useState<string>('A')
  const [riskOnly, setRiskOnly] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [contactFilter, setContactFilter] = useState<string>('ALL')

  // Modals
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [removePrevModalOpen, setRemovePrevModalOpen] = useState(false)
  const [clearCurrentModalOpen, setClearCurrentModalOpen] = useState(false)
  const [contactModalRecord, setContactModalRecord] = useState<AttendanceRecord | null>(null)
  const [dataManagementOpen, setDataManagementOpen] = useState(false)
  const [auditDrawerOpen, setAuditDrawerOpen] = useState(false)

  // Success Notification toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Active & Previous Batch for current cohort
  const currentActiveBatch = useMemo(() => {
    return batches.find(
      (b) =>
        b.status === 'ACTIVE' &&
        (selectedDept === 'ALL_ET' || b.departmentId === selectedDept) &&
        (selectedYear === 'ALL' || b.year === selectedYear) &&
        (selectedSection === 'ALL' || b.section === selectedSection)
    ) || batches.find((b) => b.status === 'ACTIVE')
  }, [batches, selectedDept, selectedYear, selectedSection])

  const previousReplacedBatch = useMemo(() => {
    if (!currentActiveBatch) return null
    return batches.find(
      (b) =>
        b.status === 'REPLACED' &&
        b.departmentId === currentActiveBatch.departmentId &&
        b.year === currentActiveBatch.year &&
        b.section === currentActiveBatch.section
    )
  }, [batches, currentActiveBatch])

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Cohort match
      if (selectedDept !== 'ALL_ET' && r.departmentId !== selectedDept) return false
      if (selectedYear !== 'ALL' && r.year !== selectedYear) return false
      if (selectedSection !== 'ALL' && r.section !== selectedSection) return false

      // Risk condition (strictly < 65%)
      if (riskOnly && r.percentage >= 65.0) return false

      // Contact filter
      if (contactFilter !== 'ALL' && r.parentContactStatus !== contactFilter) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const rollMatch = r.rollNumber.toLowerCase().includes(q)
        const nameMatch = r.studentName.toLowerCase().includes(q)
        if (!rollMatch && !nameMatch) return false
      }

      return true
    })
  }, [records, selectedDept, selectedYear, selectedSection, riskOnly, contactFilter, searchQuery])

  // Computed metrics
  const totalEnrolled = records.filter(
    (r) =>
      (selectedDept === 'ALL_ET' || r.departmentId === selectedDept) &&
      (selectedYear === 'ALL' || r.year === selectedYear) &&
      (selectedSection === 'ALL' || r.section === selectedSection)
  ).length

  const totalRiskCount = records.filter(
    (r) =>
      r.percentage < 65.0 &&
      (selectedDept === 'ALL_ET' || r.departmentId === selectedDept) &&
      (selectedYear === 'ALL' || r.year === selectedYear) &&
      (selectedSection === 'ALL' || r.section === selectedSection)
  ).length

  const contactedCount = records.filter(
    (r) =>
      r.percentage < 65.0 &&
      r.parentContactStatus !== 'Pending' &&
      (selectedDept === 'ALL_ET' || r.departmentId === selectedDept) &&
      (selectedYear === 'ALL' || r.year === selectedYear) &&
      (selectedSection === 'ALL' || r.section === selectedSection)
  ).length

  // Handlers for CSV & PDF exports
  const handleExportCSV = () => {
    const deptName = selectedDept === 'ALL_ET' ? 'All_ET' : DepartmentResolver.getShortName(selectedDept)
    const filename = `NEC_Attendance_${deptName}_${selectedYear}_${selectedSection}_${riskOnly ? 'Risk_Below_65' : 'All'}.csv`
    ExportService.exportAttendanceCSV(filteredRecords, filename, true)
    showToast(`Exported CSV with ${filteredRecords.length} records matching current filter scope.`)
  }

  const handleExportPDF = () => {
    const deptName = selectedDept === 'ALL_ET' ? 'All Emerging Technologies' : DepartmentResolver.getDisplayName(selectedDept)
    ExportService.exportAttendancePDF(filteredRecords, {
      academicYear: currentActiveBatch?.academicYear || '2026-27',
      departmentName: deptName,
      year: selectedYear,
      section: selectedSection,
      monthYear: currentActiveBatch?.monthYear || 'Current Active'
    })
    showToast(`Generated institutional PDF for ${filteredRecords.length} student records.`)
  }

  // Mask Phone helper (e.g. "9848123402" -> "98******02")
  const maskPhone = (phone?: string) => {
    if (!phone || phone.length < 6) return '98******21'
    const start = phone.slice(0, 2)
    const end = phone.slice(-2)
    return `${start}******${end}`
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              AUTONOMOUS CONDONATION TRACKING
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              STRICT &lt;65% THRESHOLD
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Attendance Risk & Parent Contact Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Automated monthly import, Student Master authority validation, detention prevention, and verified guardian communication logs for ET departments.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setImportModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet size={15} />
            <span>Import Attendance</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <FileText size={14} />
            <span>Export PDF</span>
          </button>

          {/* Data Management Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDataManagementOpen(!dataManagementOpen)}
              className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Database size={14} />
              <span>Data Management</span>
              <ChevronDown size={13} />
            </button>

            {dataManagementOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border rounded-xl shadow-2xl p-1.5 z-40 text-xs text-text-primary">
                <button
                  onClick={() => {
                    setDataManagementOpen(false)
                    setAuditDrawerOpen(true)
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted font-medium flex items-center gap-2"
                >
                  <Clock size={14} className="text-text-secondary" />
                  <span>Import & Audit History</span>
                </button>

                {previousReplacedBatch && (
                  <button
                    onClick={() => {
                      setDataManagementOpen(false)
                      setRemovePrevModalOpen(true)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    <span>Remove Previous ({previousReplacedBatch.monthYear})</span>
                  </button>
                )}

                {currentActiveBatch && (
                  <button
                    onClick={() => {
                      setDataManagementOpen(false)
                      setClearCurrentModalOpen(true)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold flex items-center gap-2 border-t border-border mt-1"
                  >
                    <AlertTriangle size={14} />
                    <span>Clear Current Active Data</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-text-secondary">Target Cohort</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs">
              {selectedYear}
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-base font-bold text-text-primary truncate">
              {DepartmentResolver.getShortName(selectedDept)}
            </h4>
            <span className="text-[11px] text-text-secondary">
              Year {selectedYear} • Sec {selectedSection} ({currentActiveBatch?.monthYear || 'August 2026'})
            </span>
          </div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-text-secondary">Total Enrolled</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
              <Users size={16} />
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-text-primary">{totalEnrolled}</h4>
            <span className="text-[11px] text-emerald-600 font-semibold">Active in Student Master</span>
          </div>
        </div>

        <div className="bg-surface border border-red-200 dark:border-red-900/50 p-4 rounded-2xl shadow-sm bg-red-50/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-red-600 dark:text-red-400">Low Attendance (&lt;65%)</span>
            <span className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
              <AlertTriangle size={16} />
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-red-600 dark:text-red-400">{totalRiskCount}</h4>
            <span className="text-[11px] text-red-600/80 font-medium">Critical Condonation Risk</span>
          </div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-text-secondary">Guardians Contacted</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              <UserCheck size={16} />
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-emerald-600">{contactedCount} / {totalRiskCount}</h4>
            <span className="text-[11px] text-text-secondary font-medium">Formal Logs Recorded</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Department Select */}
            <div className="min-w-[200px]">
              <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500 text-text-primary"
              >
                <option value="ALL_ET">All ET Branches (AI, AIML, CYS, DS)</option>
                {DepartmentResolver.getETOptions().map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500 text-text-primary"
              >
                <option value="ALL">All Years</option>
                <option value="I">I Year</option>
                <option value="II">II Year</option>
                <option value="III">III Year</option>
                <option value="IV">IV Year</option>
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500 text-text-primary"
              >
                <option value="ALL">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>

            {/* Contact Status */}
            <div>
              <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Contact Status</label>
              <select
                value={contactFilter}
                onChange={(e) => setContactFilter(e.target.value)}
                className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-text-primary"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending Contact</option>
                <option value="Called">Called</option>
                <option value="SMS Sent">SMS Sent</option>
                <option value="Parent Met">Parent Met</option>
                <option value="Notice Dispatched">Notice Dispatched</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-64">
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Search Student</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Roll No / Name..."
                className="w-full pl-9 pr-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-text-primary placeholder:text-text-secondary/50"
              />
            </div>
          </div>
        </div>

        {/* Quick Filter Toggle Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRiskOnly(true)}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                riskOnly
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-muted/50 text-text-secondary hover:bg-muted'
              }`}
            >
              Below 65% Only ({totalRiskCount} Risk)
            </button>
            <button
              onClick={() => setRiskOnly(false)}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                !riskOnly
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-muted/50 text-text-secondary hover:bg-muted'
              }`}
            >
              All Students ({totalEnrolled})
            </button>
          </div>

          <span className="text-[11px] text-text-secondary font-medium">
            Showing <strong className="text-text-primary">{filteredRecords.length}</strong> matching student records
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/50 text-text-secondary border-b border-border">
              <tr>
                <th className="py-3 px-4 font-bold">#</th>
                <th className="py-3 px-4 font-bold">Roll Number</th>
                <th className="py-3 px-4 font-bold">Student Name</th>
                <th className="py-3 px-4 font-bold">Department</th>
                <th className="py-3 px-4 font-bold text-center">Class</th>
                <th className="py-3 px-4 font-bold text-center">Classes (Att/Held)</th>
                <th className="py-3 px-4 font-bold text-center">Attendance %</th>
                <th className="py-3 px-4 font-bold text-center">Risk Status</th>
                <th className="py-3 px-4 font-bold">Guardian Contact</th>
                <th className="py-3 px-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-text-secondary">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-sm">No student records found matching current filters.</p>
                    <p className="text-xs text-text-secondary/70 mt-1">
                      Try toggling "All Students" or adjust department/year criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => {
                  const isRisk = r.percentage < 65.0
                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-muted/30 transition-colors ${
                        isRisk ? 'bg-red-50/20 dark:bg-red-950/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-text-secondary">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {r.rollNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold text-text-primary">{r.studentName}</td>
                      <td className="py-3 px-4 text-text-secondary">
                        {DepartmentResolver.getShortName(r.departmentId)}
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        {r.year}-{r.section}
                      </td>
                      <td className="py-3 px-4 text-center text-text-secondary font-mono">
                        {r.classesAttended} / {r.classesHeld}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-black text-sm ${
                            isRisk ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {r.percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isRisk ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300 border border-red-200 dark:border-red-900">
                            &lt;65% Risk
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-[11px] text-text-secondary">
                            {maskPhone(r.guardianPhone)}
                          </span>
                          <span
                            className={`text-[10px] font-bold ${
                              r.parentContactStatus === 'Pending'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {r.parentContactStatus}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setContactModalRecord(r)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                        >
                          <Eye size={13} />
                          <span>View Contact</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit History Drawer / Modal */}
      {auditDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Attendance Import & Audit Trail</h3>
              </div>
              <button onClick={() => setAuditDrawerOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-xl bg-muted/40 border border-border space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-indigo-600 dark:text-indigo-400">{log.monthYear} • {log.fileName}</span>
                    <span className="text-text-secondary text-[11px]">{new Date(log.importedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-text-secondary">{log.retentionNote}</p>
                  <div className="flex items-center gap-4 text-[10px] text-text-secondary/80 font-mono pt-1">
                    <span>Records: {log.totalRecords}</span>
                    <span>Risk Count: {log.riskCount}</span>
                    <span>By: {log.importedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AttendanceImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={() => showToast('Attendance imported and marked as active dataset!')}
      />

      <RemovePreviousModal
        isOpen={removePrevModalOpen}
        onClose={() => setRemovePrevModalOpen(false)}
        previousBatch={previousReplacedBatch || null}
        onSuccess={(count) => showToast(`Removed previous dataset (${count} student rows cleaned). Audit retained.`)}
      />

      <ClearCurrentModal
        isOpen={clearCurrentModalOpen}
        onClose={() => setClearCurrentModalOpen(false)}
        activeBatch={currentActiveBatch || null}
        onSuccess={() => showToast('Active attendance dataset cleared successfully.')}
      />

      <ParentContactModal
        isOpen={!!contactModalRecord}
        onClose={() => setContactModalRecord(null)}
        record={contactModalRecord}
      />
    </div>
  )
}

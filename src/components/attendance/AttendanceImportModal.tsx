import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  X,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react'
import { FileSignatureService, type AttendanceParseResult } from '../../utils/fileSignature'
import { useAttendanceStore } from '../../store/useAttendanceStore'
import { DepartmentResolver } from '../../utils/departmentResolver'
import { type ETDepartmentCode } from '../../types/nec'

interface AttendanceImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: (batchId: string) => void
}

export const AttendanceImportModal: React.FC<AttendanceImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const importBatch = useAttendanceStore((s) => s.importBatch)

  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  const [parseResult, setParseResult] = useState<AttendanceParseResult | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  // Form metadata
  const [academicYear, setAcademicYear] = useState('2026-27')
  const [departmentId, setDepartmentId] = useState('dept-cys')
  const [year, setYear] = useState<'I' | 'II' | 'III' | 'IV'>('III')
  const [semester, setSemester] = useState<'I' | 'II'>('I')
  const [section, setSection] = useState<'A' | 'B' | 'C' | 'D'>('A')
  const [monthYear, setMonthYear] = useState('August 2026')

  // Column override mapping
  const [colRoll, setColRoll] = useState('')
  const [colName, setColName] = useState('')
  const [colHeld, setColHeld] = useState('')
  const [colAttended, setColAttended] = useState('')
  const [colPercentage, setColPercentage] = useState('')

  if (!isOpen) return null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const processFile = async (file: File) => {
    setSelectedFile(file)
    setParsing(true)
    setParseError(null)

    try {
      const res = await FileSignatureService.parseAttendanceFile(file)
      setParseResult(res)

      // Initialize mapping selects
      setColRoll(res.columnMapping.rollNumber || res.headers[0] || '')
      setColName(res.columnMapping.studentName || '')
      setColHeld(res.columnMapping.classesHeld || '')
      setColAttended(res.columnMapping.classesAttended || '')
      setColPercentage(res.columnMapping.percentage || '')

      // Auto-detect Department if mentioned in filename or content
      const lowerName = file.name.toLowerCase()
      for (const opt of DepartmentResolver.getETOptions()) {
        if (lowerName.includes(opt.code.toLowerCase()) || lowerName.includes(opt.label.toLowerCase())) {
          setDepartmentId(opt.value)
          break
        }
      }

      if (lowerName.includes('iii') || lowerName.includes('3rd') || lowerName.includes('year3')) setYear('III')
      else if (lowerName.includes('iv') || lowerName.includes('4th')) setYear('IV')
      else if (lowerName.includes('ii') || lowerName.includes('2nd')) setYear('II')
      else if (lowerName.includes('i') || lowerName.includes('1st')) setYear('I')

      if (lowerName.includes('sec-b') || lowerName.includes('_b.')) setSection('B')
      else if (lowerName.includes('sec-c') || lowerName.includes('_c.')) setSection('C')
      else if (lowerName.includes('sec-d') || lowerName.includes('_d.')) setSection('D')
      else setSection('A')

      setStep('preview')
    } catch (err: any) {
      setParseError(err?.message || 'Failed to read spreadsheet/table format. Please ensure valid CSV or Excel.')
    } finally {
      setParsing(false)
    }
  }

  const handleCommitImport = () => {
    if (!parseResult) return

    const rowsToImport = parseResult.validRows.map((r) => {
      let held = r.classesHeld || 100
      let attended = r.classesAttended || 0
      let pct = r.percentage || 0

      if (r.classesHeld && r.classesAttended) {
        held = r.classesHeld
        attended = r.classesAttended
        pct = parseFloat(((attended / held) * 100).toFixed(2))
      }

      return {
        rollNumber: r.rollNumber,
        studentName: r.studentName,
        classesHeld: held,
        classesAttended: attended,
        percentage: pct
      }
    })

    const res = importBatch({
      fileName: parseResult.fileName,
      fileChecksum: parseResult.fileChecksum,
      academicYear,
      departmentId,
      year,
      semester,
      section,
      monthYear,
      importedBy: 'Dr. M. Sreenivasa Rao (HOD CYS)',
      rows: rowsToImport
    })

    onImportSuccess(res.batchId)
    onClose()
  }

  const validCount = parseResult?.validRows.length || 0
  const riskCount = parseResult?.validRows.filter((r) => (r.percentage || 0) < 65).length || 0
  const conflictCount = parseResult?.validRows.filter((r) => r.hasConflict).length || 0

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base tracking-tight">Smart Attendance Importer</h3>
                <p className="text-xs text-slate-400">
                  Supports CSV, XLSX, XLS, TSV • Auto-detects columns & flags condonation risks (&lt;65%)
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-text-primary">
            {step === 'upload' && (
              <div className="space-y-4">
                {/* Cohort Definition */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Department</label>
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500 text-text-primary"
                    >
                      {DepartmentResolver.getETOptions().map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Year & Sem</label>
                    <div className="flex gap-1">
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value as any)}
                        className="w-1/2 px-2 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500 text-text-primary"
                      >
                        <option value="I">I Year</option>
                        <option value="II">II Year</option>
                        <option value="III">III Year</option>
                        <option value="IV">IV Year</option>
                      </select>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value as any)}
                        className="w-1/2 px-2 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500 text-text-primary"
                      >
                        <option value="I">Sem-I</option>
                        <option value="II">Sem-II</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Section</label>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500 text-text-primary"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Month / Period</label>
                    <input
                      type="text"
                      value={monthYear}
                      onChange={(e) => setMonthYear(e.target.value)}
                      placeholder="e.g. August 2026"
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500 text-text-primary"
                    />
                  </div>
                </div>

                {/* Dropzone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-indigo-500 bg-muted/20 hover:bg-indigo-50/5 dark:hover:bg-indigo-950/10 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls,.tsv,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-text-primary">
                      Drop attendance file here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      Supports standard CSV, Excel (.xlsx, .xls), TSV exports from biometric or college ERP
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {['CSV', 'XLSX', 'XLS', 'TSV'].map((fmt) => (
                      <span key={fmt} className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-text-secondary border border-border">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                {parsing && (
                  <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold animate-pulse">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing file structure, verifying signature, and detecting header columns...</span>
                  </div>
                )}

                {parseError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{parseError}</span>
                  </div>
                )}
              </div>
            )}

            {step === 'preview' && parseResult && (
              <div className="space-y-4">
                {/* Summary Banner */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">File & Format</span>
                    <p className="font-bold text-sm text-text-primary truncate">{parseResult.fileName}</p>
                    <span className="text-[10px] text-text-secondary font-mono">Format: {parseResult.detectedFormat}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Valid Students</span>
                    <p className="font-bold text-base text-emerald-700 dark:text-emerald-300">{validCount} Students</p>
                    <span className="text-[10px] text-emerald-600/80">Matched with Student Master</span>
                  </div>

                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
                    <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400">Risk Alerts (&lt;65%)</span>
                    <p className="font-bold text-base text-red-700 dark:text-red-300">{riskCount} Students</p>
                    <span className="text-[10px] text-red-600/80">Condonation / Detention risk</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Target Cohort</span>
                    <p className="font-bold text-xs text-text-primary truncate">{DepartmentResolver.getShortName(departmentId)}</p>
                    <span className="text-[10px] text-text-secondary">{year} Year • Sec {section} ({monthYear})</span>
                  </div>
                </div>

                {/* Conflict Warnings if any */}
                {conflictCount > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      {conflictCount} rows have slight percentage conflicts between source column and calculated (Attended/Held). Calculated mathematical values have been prioritized.
                    </span>
                  </div>
                )}

                {/* Replacement Policy Info Alert */}
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Monthly Replacement Lifecycle: </span>
                    <span>
                      Upon clicking Commit Import, <strong>{monthYear}</strong> will become the <strong>ACTIVE</strong> dataset. Any previous dataset for {year}-{section} will be safely marked as <strong>REPLACED</strong> (and can be removed later from Data Management).
                    </span>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="border border-border rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-muted/60 text-text-secondary sticky top-0 border-b border-border">
                      <tr>
                        <th className="py-2 px-3 font-bold">#</th>
                        <th className="py-2 px-3 font-bold">Roll No</th>
                        <th className="py-2 px-3 font-bold">Student Name</th>
                        <th className="py-2 px-3 font-bold text-center">Held</th>
                        <th className="py-2 px-3 font-bold text-center">Attended</th>
                        <th className="py-2 px-3 font-bold text-center">Attendance %</th>
                        <th className="py-2 px-3 font-bold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {parseResult.validRows.slice(0, 10).map((r, idx) => {
                        const isRisk = (r.percentage || 0) < 65.0
                        return (
                          <tr key={idx} className={isRisk ? 'bg-red-50/40 dark:bg-red-950/10' : ''}>
                            <td className="py-2 px-3 text-text-secondary">{idx + 1}</td>
                            <td className="py-2 px-3 font-mono font-bold text-text-primary">{r.rollNumber}</td>
                            <td className="py-2 px-3 text-text-primary">{r.studentName || '-'}</td>
                            <td className="py-2 px-3 text-center">{r.classesHeld ?? '-'}</td>
                            <td className="py-2 px-3 text-center">{r.classesAttended ?? '-'}</td>
                            <td className="py-2 px-3 text-center font-bold">
                              <span className={isRisk ? 'text-red-600 dark:text-red-400 font-black' : 'text-emerald-600 dark:text-emerald-400'}>
                                {r.percentage ? `${r.percentage.toFixed(1)}%` : '-'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              {isRisk ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                                  &lt;65% Risk
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                  Safe
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {parseResult.validRows.length > 10 && (
                  <p className="text-[11px] text-text-secondary text-right">
                    Showing top 10 of {parseResult.validRows.length} parsed records...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
            {step === 'preview' ? (
              <>
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="px-4 py-2 text-xs font-semibold border border-border hover:bg-muted text-text-secondary rounded-xl transition-all"
                >
                  Back to Upload
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold border border-border hover:bg-muted text-text-secondary rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCommitImport}
                    className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 size={15} />
                    <span>Commit Import & Activate Dataset</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-end w-full">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold border border-border hover:bg-muted text-text-secondary rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

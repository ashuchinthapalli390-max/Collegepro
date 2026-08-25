import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Sparkles,
  Plus,
  Download,
  Filter,
  Search,
  CheckCircle2,
  FileText,
  Building2,
  Image as ImageIcon,
  User,
  Users,
  Clock,
  Layers,
  Trash2,
  X,
  ExternalLink
} from 'lucide-react'
import { useAcademicEventsStore } from '../store/useAcademicEventsStore'
import { DepartmentResolver } from '../utils/departmentResolver'
import { ExportService } from '../utils/exportUtils'
import type { EventType, AcademicEvent } from '../types/nec'

export const AcademicEventsPage: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, getFlattenedSectionRows } = useAcademicEventsStore()

  // Filters
  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')
  const [selectedYear, setSelectedYear] = useState<string>('ALL')
  const [selectedSection, setSelectedSection] = useState<string>('ALL')
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [activePosterUrl, setActivePosterUrl] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Get flattened section rows
  const flattenedRows = useMemo(() => {
    const rawRows = getFlattenedSectionRows({
      departmentId: selectedDept,
      year: selectedYear,
      section: selectedSection,
      eventType: selectedType,
      status: selectedStatus
    })

    if (!searchQuery.trim()) return rawRows
    const q = searchQuery.toLowerCase().trim()
    return rawRows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.resourcePerson.toLowerCase().includes(q) ||
        r.resourcePersonOrg.toLowerCase().includes(q)
    )
  }, [getFlattenedSectionRows, selectedDept, selectedYear, selectedSection, selectedType, selectedStatus, searchQuery])

  // Exports
  const handleExportCSV = () => {
    ExportService.exportEventsCSV(flattenedRows, `NEC_Academic_Events_${Date.now()}.csv`)
    showToast(`Exported CSV with ${flattenedRows.length} section-wise event rows.`)
  }

  const handleExportPDF = () => {
    const deptName = selectedDept === 'ALL_ET' ? 'All Emerging Technologies' : DepartmentResolver.getDisplayName(selectedDept)
    ExportService.exportEventsPDF(flattenedRows, { departmentName: deptName, academicYear: '2026-27' })
    showToast(`Generated section-wise PDF for ${flattenedRows.length} event rows.`)
  }

  // Form State for New Event
  const [title, setTitle] = useState('')
  const [eventType, setEventType] = useState<EventType>('Workshop')
  const [departmentId, setDepartmentId] = useState('dept-cys')
  const [academicYear, setAcademicYear] = useState('2026-27')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [mode, setMode] = useState<'Offline' | 'Online' | 'Hybrid'>('Offline')
  const [venue, setVenue] = useState('Cyber Security COE Lab (Block-3)')
  const [resourcePerson, setResourcePerson] = useState('')
  const [resourcePersonDesig, setResourcePersonDesig] = useState('')
  const [resourcePersonOrg, setResourcePersonOrg] = useState('')
  const [totalParticipants, setTotalParticipants] = useState(120)
  const [posterUrl, setPosterUrl] = useState('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80')
  const [description, setDescription] = useState('')

  // Multi-section audience selection
  const [targetYear, setTargetYear] = useState<'I' | 'II' | 'III' | 'IV'>('III')
  const [targetSem, setTargetSem] = useState<'I' | 'II'>('I')
  const [selectedSecs, setSelectedSecs] = useState<('A' | 'B' | 'C' | 'D')[]>(['A', 'B', 'C', 'D'])

  const toggleSection = (sec: 'A' | 'B' | 'C' | 'D') => {
    if (selectedSecs.includes(sec)) {
      if (selectedSecs.length > 1) {
        setSelectedSecs(selectedSecs.filter((s) => s !== sec))
      }
    } else {
      setSelectedSecs([...selectedSecs, sec])
    }
  }

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !resourcePerson.trim()) return

    const sections = selectedSecs.map((sec) => ({
      id: `sec_${Date.now()}_${sec}`,
      eventId: '',
      departmentId,
      year: targetYear,
      semester: targetSem,
      section: sec
    }))

    addEvent({
      title,
      eventType,
      academicYear,
      departmentId,
      startDate,
      endDate,
      mode,
      venue,
      resourcePerson,
      resourcePersonDesignation: resourcePersonDesig,
      resourcePersonOrg,
      totalParticipants: Number(totalParticipants),
      posterUrl,
      status: 'Upcoming',
      workflowStatus: 'Approved',
      description,
      sections
    })

    setCreateModalOpen(false)
    showToast(`Created event "${title}" with ${selectedSecs.length} audience section relationships!`)
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              SECTION-EXPANDED ARCHITECTURE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              EXACT ET BRANCH FILTERS
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Workshops & Academic Events Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            1 canonical event automatically maps across multiple audience sections. Single-source updates update all section representations instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <Plus size={15} />
            <span>Add Event / Workshop</span>
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
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Department */}
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

            {/* Event Type */}
            <div>
              <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Event Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
              >
                <option value="ALL">All Types</option>
                <option value="Workshop">Workshop</option>
                <option value="FDP">Faculty Dev Program (FDP)</option>
                <option value="Guest Lecture">Guest Lecture</option>
                <option value="Seminar">Seminar</option>
                <option value="Conference">Conference</option>
                <option value="Hackathon">Hackathon</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
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
                className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
              >
                <option value="ALL">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
              >
                <option value="ALL">All Statuses</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="w-full md:w-64">
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Search Events</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Title / Expert..."
                className="w-full pl-9 pr-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none text-text-primary placeholder:text-text-secondary/50"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-text-secondary">
          <span>
            Displaying <strong className="text-text-primary">{flattenedRows.length}</strong> section-expanded event rows ({events.length} parent records)
          </span>
        </div>
      </div>

      {/* Main Section-wise Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/50 text-text-secondary border-b border-border">
              <tr>
                <th className="py-3 px-4 font-bold">#</th>
                <th className="py-3 px-4 font-bold">Event Title</th>
                <th className="py-3 px-4 font-bold">Type</th>
                <th className="py-3 px-4 font-bold">Department</th>
                <th className="py-3 px-4 font-bold text-center">Class / Sec</th>
                <th className="py-3 px-4 font-bold">Date & Mode</th>
                <th className="py-3 px-4 font-bold">Resource Person</th>
                <th className="py-3 px-4 font-bold text-center">Status</th>
                <th className="py-3 px-4 font-bold text-center">Media</th>
                <th className="py-3 px-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {flattenedRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-text-secondary">
                    <p className="font-semibold text-sm">No section event records matching criteria.</p>
                  </td>
                </tr>
              ) : (
                flattenedRows.map((r, idx) => (
                  <tr key={r.rowId} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-text-secondary">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-text-primary max-w-xs">
                      <div className="line-clamp-2">{r.title}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                        {r.eventType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-text-secondary">
                      {DepartmentResolver.getShortName(r.departmentId)}
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      <span className="px-2 py-0.5 rounded bg-muted text-text-primary border border-border">
                        {r.year}-{r.section}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      <div className="font-medium text-text-primary">{r.startDate}</div>
                      <div className="text-[10px]">{r.mode}</div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary max-w-[200px]">
                      <div className="font-semibold text-text-primary truncate">{r.resourcePerson}</div>
                      <div className="text-[10px] truncate">{r.resourcePersonOrg}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'Ongoing'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : r.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {r.posterUrl ? (
                        <button
                          onClick={() => setActivePosterUrl(r.posterUrl || null)}
                          className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1 text-[11px] font-bold"
                        >
                          <ImageIcon size={13} />
                          <span>Poster</span>
                        </button>
                      ) : (
                        <span className="text-text-secondary/40 text-[10px]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          deleteEvent(r.eventId)
                          showToast('Deleted event and all associated section rows.')
                        }}
                        className="p-1 text-text-secondary hover:text-red-600 transition-colors"
                        title="Delete entire event"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Poster Modal */}
      {activePosterUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setActivePosterUrl(null)}>
          <div className="bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden max-w-xl max-h-[85vh] flex flex-col p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
              <span className="font-bold text-xs">Official Event Poster Preview</span>
              <button onClick={() => setActivePosterUrl(null)} className="text-text-secondary hover:text-text-primary">
                <X size={16} />
              </button>
            </div>
            <img src={activePosterUrl} alt="Event Poster" className="rounded-xl object-contain max-h-[70vh] w-full shadow" />
          </div>
        </div>
      )}

      {/* Create Event Dialog Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col text-text-primary"
          >
            <div className="px-6 py-4 border-b border-border bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Academic Event / Workshop (Multi-Section)</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="text-xs font-bold text-text-secondary block mb-1">Event Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Advanced Robotics with AI & Threat Vectors"
                  required
                  className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl font-semibold focus:outline-none focus:border-indigo-500 text-text-primary"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Event Type *</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full px-2.5 py-1.5 bg-muted/40 border border-border rounded-xl font-bold focus:outline-none text-text-primary"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="FDP">FDP</option>
                    <option value="Guest Lecture">Guest Lecture</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Conference">Conference</option>
                    <option value="Hackathon">Hackathon</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Department *</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-muted/40 border border-border rounded-xl font-bold focus:outline-none text-text-primary"
                  >
                    {DepartmentResolver.getETOptions().map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Mode *</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-muted/40 border border-border rounded-xl font-semibold focus:outline-none text-text-primary"
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Multi-section audience */}
              <div className="p-3.5 rounded-xl bg-indigo-50/20 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 space-y-2">
                <span className="font-bold text-xs text-indigo-900 dark:text-indigo-200 block">
                  Target Audience Sections (Creates individual linked section rows)
                </span>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-[10px] text-text-secondary font-bold block mb-0.5">Year</label>
                    <select
                      value={targetYear}
                      onChange={(e) => setTargetYear(e.target.value as any)}
                      className="px-2 py-1 bg-surface border border-border rounded text-xs font-bold"
                    >
                      <option value="I">I Year</option>
                      <option value="II">II Year</option>
                      <option value="III">III Year</option>
                      <option value="IV">IV Year</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="text-[10px] text-text-secondary font-bold block mb-0.5">Select Sections</label>
                    <div className="flex gap-1.5">
                      {(['A', 'B', 'C', 'D'] as ('A' | 'B' | 'C' | 'D')[]).map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => toggleSection(sec)}
                          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                            selectedSecs.includes(sec)
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-surface border border-border text-text-secondary'
                          }`}
                        >
                          Sec {sec}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-muted/40 border border-border rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-muted/40 border border-border rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Venue</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Innovation Lab / Seminar Hall"
                    className="w-full px-2.5 py-1.5 bg-muted/40 border border-border rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Resource Person *</label>
                  <input
                    type="text"
                    value={resourcePerson}
                    onChange={(e) => setResourcePerson(e.target.value)}
                    placeholder="Dr. S. K. Praveen Kumar"
                    required
                    className="w-full px-2.5 py-1.5 bg-muted/40 border border-border rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Designation</label>
                  <input
                    type="text"
                    value={resourcePersonDesig}
                    onChange={(e) => setResourcePersonDesig(e.target.value)}
                    placeholder="Principal Security Architect"
                    className="w-full px-2.5 py-1.5 bg-muted/40 border border-border rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Organization</label>
                  <input
                    type="text"
                    value={resourcePersonOrg}
                    onChange={(e) => setResourcePersonOrg(e.target.value)}
                    placeholder="Qualcomm / Microsoft"
                    className="w-full px-2.5 py-1.5 bg-muted/40 border border-border rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-secondary block mb-1">Poster Image URL</label>
                <input
                  type="text"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-muted/40 border border-border rounded-xl focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-end gap-2 -mx-6 -mb-6 mt-4">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl font-semibold text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Create Event Record
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

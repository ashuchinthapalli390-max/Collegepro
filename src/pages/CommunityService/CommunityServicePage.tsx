import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HeartHandshake,
  Plus,
  Download,
  Search,
  Filter,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  ChevronRight,
  Eye,
  Trash2,
  Sparkles,
  X,
  Layers
} from 'lucide-react'
import { useCommunityServiceStore } from '../../store/useCommunityServiceStore'
import { DepartmentResolver } from '../../utils/departmentResolver'
import { ExportService } from '../../utils/exportUtils'
import type { CommunityServiceProject, CSPType, CSPStatus } from '../../types/nec'

export const CommunityServicePage: React.FC = () => {
  const { projects, addProject, deleteProject, getStats } = useCommunityServiceStore()

  // Filters
  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [viewingProject, setViewingProject] = useState<CommunityServiceProject | null>(null)

  // Add form state
  const [newTitle, setNewTitle] = useState('')
  const [newDept, setNewDept] = useState('dept-cys')
  const [newYear, setNewYear] = useState<'I' | 'II' | 'III' | 'IV'>('III')
  const [newSem, setNewSem] = useState<'I' | 'II'>('I')
  const [newSection, setNewSection] = useState<'A' | 'B' | 'C' | 'D'>('A')
  const [newBatch, setNewBatch] = useState('2024-2028')
  const [newType, setNewType] = useState<CSPType>('Awareness')
  const [newGuide, setNewGuide] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [newDistrict, setNewDistrict] = useState('Palnadu District')
  const [newPartner, setNewPartner] = useState('')
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0])
  const [newEndDate, setNewEndDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0])
  const [newObjective, setNewObjective] = useState('')
  const [newBeneficiaryType, setNewBeneficiaryType] = useState('High School Students / Villagers')
  const [newBeneficiaryCount, setNewBeneficiaryCount] = useState(100)
  const [newImpact, setNewImpact] = useState('')
  const [leaderRoll, setLeaderRoll] = useState('')
  const [leaderName, setLeaderName] = useState('')

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedDept !== 'ALL_ET') {
        const resolved = DepartmentResolver.resolve(selectedDept)
        if (resolved.success && p.departmentId !== resolved.department.id) return false
      }
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false
      if (selectedType !== 'ALL' && p.projectType !== selectedType) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match =
          p.projectTitle.toLowerCase().includes(q) ||
          p.projectNumber.toLowerCase().includes(q) ||
          p.villageOrLocation.toLowerCase().includes(q) ||
          p.facultyGuideName.toLowerCase().includes(q) ||
          p.students.some((s) => s.studentName.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q))
        if (!match) return false
      }
      return true
    })
  }, [projects, selectedDept, selectedStatus, selectedType, searchQuery])

  // Computed KPIs
  const stats = getStats('2026-27', selectedDept)

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newGuide.trim() || !newLocation.trim()) {
      alert('Please fill all mandatory project fields.')
      return
    }

    const start = new Date(newStartDate)
    const end = new Date(newEndDate)
    const diffDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)))

    addProject({
      projectTitle: newTitle,
      academicYear: '2026-27',
      departmentId: newDept,
      year: newYear,
      semester: newSem,
      section: newSection,
      batch: newBatch,
      projectType: newType,
      students: [
        {
          rollNumber: leaderRoll || '23CYS999',
          studentName: leaderName || 'Student Team Lead',
          departmentId: newDept,
          year: newYear,
          section: newSection,
          role: 'Team Leader'
        }
      ],
      facultyGuideName: newGuide,
      villageOrLocation: newLocation,
      district: newDistrict,
      partnerOrganization: newPartner,
      startDate: newStartDate,
      endDate: newEndDate,
      durationDays: diffDays,
      objective: newObjective,
      activities: [
        {
          id: `act-${Date.now()}`,
          activityDate: newStartDate,
          activityTitle: 'Initial Community Survey & Briefing',
          description: 'Conducted field baseline assessment.',
          location: newLocation,
          participantsCount: newBeneficiaryCount
        }
      ],
      beneficiaryType: newBeneficiaryType,
      beneficiaryCount: newBeneficiaryCount,
      outcomeImpact: newImpact,
      status: 'SUBMITTED',
      documentsCount: 1
    })

    setIsAddModalOpen(false)
    setNewTitle('')
    setNewGuide('')
    setNewLocation('')
    setNewObjective('')
    setNewImpact('')
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              SOCIAL IMPACT & COMMUNITY OUTREACH
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              R23 / R20 MANDATORY CSP
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Community Service Projects (CSP)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Field-oriented student community outreach, rural technology support, digital literacy, and social impact tracking for ET branches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => ExportService.exportCSPCSV(filteredProjects)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Plus size={15} />
            <span>Add Community Project</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-surface border border-border p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-text-secondary">Total Projects</span>
          <h3 className="text-xl font-black text-text-primary mt-1">{stats.totalProjects}</h3>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Registered Teams</span>
        </div>
        <div className="bg-surface border border-border p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-emerald-600">Completed Projects</span>
          <h3 className="text-xl font-black text-emerald-600 mt-1">{stats.completedProjects}</h3>
          <span className="text-[10px] text-text-secondary">Approved & Evaluated</span>
        </div>
        <div className="bg-surface border border-border p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-amber-600">Active / Under Review</span>
          <h3 className="text-xl font-black text-amber-600 mt-1">{stats.activeProjects}</h3>
          <span className="text-[10px] text-text-secondary">Field Work in Progress</span>
        </div>
        <div className="bg-surface border border-border p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-text-secondary">Students Involved</span>
          <h3 className="text-xl font-black text-text-primary mt-1">{stats.totalStudentsParticipated}</h3>
          <span className="text-[10px] text-text-secondary">ET Student Master</span>
        </div>
        <div className="bg-surface border border-border p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-text-secondary">Villages / Locations</span>
          <h3 className="text-xl font-black text-text-primary mt-1">{stats.uniqueLocationsCount}</h3>
          <span className="text-[10px] text-text-secondary">Palnadu & Guntur District</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500 text-text-primary"
            >
              <option value="ALL_ET">All ET Branches (AI, AIML, CYS, DS)</option>
              {DepartmentResolver.getETOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="APPROVED">Approved</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Project Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
            >
              <option value="ALL">All Project Types</option>
              <option value="Awareness">Awareness Campaign</option>
              <option value="Technology Support">Technology Support</option>
              <option value="Survey">Field Survey</option>
              <option value="Training">Training & Workshops</option>
              <option value="Community Development">Community Development</option>
              <option value="Environmental Activity">Environmental Activity</option>
            </select>
          </div>
        </div>

        <div className="w-full md:w-64 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Project / Village / Student..."
            className="w-full pl-9 pr-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none text-text-primary placeholder:text-text-secondary/50"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {p.projectNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted border border-border">
                    {DepartmentResolver.getDisplayName(p.departmentId)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {p.projectType}
                  </span>
                </div>
                <h3 className="font-bold text-base text-text-primary">{p.projectTitle}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{p.objective}</p>
              </div>

              <div className="flex items-center gap-2 self-start shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    p.status === 'COMPLETED' || p.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300'
                      : p.status === 'UNDER_REVIEW'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300'
                      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300'
                  }`}
                >
                  {p.status}
                </span>
                <button
                  onClick={() => setViewingProject(p)}
                  className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-text-primary transition-colors"
                  title="View Project Details"
                >
                  <Eye size={15} />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this community service project?')) deleteProject(p.id)
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Meta Row */}
            <div className="p-3 rounded-xl bg-muted/30 border border-border/60 grid grid-cols-1 md:grid-cols-4 gap-2 text-xs text-text-secondary">
              <div>
                <span className="text-[10px] text-text-secondary/70 font-bold block">LOCATION & PARTNER</span>
                <span className="font-semibold text-text-primary">{p.villageOrLocation}</span>
                <span className="block text-[11px] text-text-secondary">{p.district}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-secondary/70 font-bold block">FACULTY GUIDE</span>
                <span className="font-semibold text-text-primary">{p.facultyGuideName}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-secondary/70 font-bold block">STUDENT PARTICIPANTS</span>
                <span className="font-semibold text-text-primary">{p.students.length} Students</span>
                <span className="block text-[10px] text-indigo-600 font-mono">
                  {p.students.map((s) => s.rollNumber).join(', ')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-text-secondary/70 font-bold block">BENEFICIARIES / IMPACT</span>
                <span className="font-bold text-emerald-600">
                  {p.beneficiaryCount ? `${p.beneficiaryCount.toLocaleString()} Beneficiaries` : 'General Community'}
                </span>
                <span className="block text-[10px] text-text-secondary">{p.durationDays} Days Fieldwork</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {viewingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[88vh]"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-900 text-white">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold block">
                    {viewingProject.projectNumber}
                  </span>
                  <h3 className="font-bold text-base">{viewingProject.projectTitle}</h3>
                </div>
                <button onClick={() => setViewingProject(null)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs text-text-primary">
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-text-secondary block">Project Objective</span>
                  <p className="text-xs leading-relaxed">{viewingProject.objective}</p>
                </div>

                {/* Team Roster */}
                <div>
                  <h4 className="font-bold text-xs uppercase text-text-secondary mb-2">Student Team Members</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {viewingProject.students.map((s, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-surface border border-border flex items-center justify-between">
                        <div>
                          <span className="font-bold text-text-primary block">{s.studentName}</span>
                          <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">{s.rollNumber}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted">
                          {s.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities Breakdown */}
                <div>
                  <h4 className="font-bold text-xs uppercase text-text-secondary mb-2">Activities Conducted</h4>
                  <div className="space-y-2">
                    {viewingProject.activities.map((act) => (
                      <div key={act.id} className="p-3 rounded-xl bg-muted/30 border border-border/80 space-y-1">
                        <div className="flex items-center justify-between font-semibold">
                          <span>{act.activityTitle}</span>
                          <span className="text-[10px] text-text-secondary">{act.activityDate}</span>
                        </div>
                        <p className="text-text-secondary text-[11px]">{act.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold pt-1">
                          <span>Location: {act.location}</span>
                          <span>Participants: {act.participantsCount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcomes */}
                {viewingProject.outcomeImpact && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    <span className="text-[10px] font-bold uppercase block mb-1">Measured Outcome & Impact:</span>
                    <p className="text-xs">{viewingProject.outcomeImpact}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-900 text-white">
                <h3 className="font-bold text-sm">Register New Community Service Project</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-text-secondary block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Rural Water Testing & Sensor Analytics"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-text-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Department *</label>
                    <select
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs font-bold text-text-primary"
                    >
                      {DepartmentResolver.getETOptions().map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Project Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as CSPType)}
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs font-semibold text-text-primary"
                    >
                      <option value="Awareness">Awareness</option>
                      <option value="Technology Support">Technology Support</option>
                      <option value="Survey">Survey</option>
                      <option value="Training">Training</option>
                      <option value="Community Development">Community Development</option>
                      <option value="Environmental Activity">Environmental Activity</option>
                      <option value="Social Outreach">Social Outreach</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Team Leader Roll No *</label>
                    <input
                      type="text"
                      required
                      value={leaderRoll}
                      onChange={(e) => setLeaderRoll(e.target.value.toUpperCase())}
                      placeholder="e.g. 23CYS001"
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs font-mono font-bold text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Team Leader Name *</label>
                    <input
                      type="text"
                      required
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      placeholder="e.g. A. Sai Teja"
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs text-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Faculty Guide *</label>
                    <input
                      type="text"
                      required
                      value={newGuide}
                      onChange={(e) => setNewGuide(e.target.value)}
                      placeholder="e.g. Dr. M. Sreenivasa Rao"
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Village / Location *</label>
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Jonnalagadda Village"
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs text-text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-text-secondary block mb-1">Objective</label>
                  <textarea
                    rows={2}
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Describe identified community problem and objective..."
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs text-text-primary"
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border text-text-secondary text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

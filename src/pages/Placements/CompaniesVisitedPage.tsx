import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  Plus,
  Download,
  Search,
  Filter,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  MapPin,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Trash2,
  Eye,
  X,
  Layers,
  Sparkles
} from 'lucide-react'
import { usePlacementsStore } from '../../store/usePlacementsStore'
import { DepartmentResolver } from '../../utils/departmentResolver'
import { ExportService } from '../../utils/exportUtils'
import type { CompanyVisit, DriveType, DriveMode, CompanyVisitStatus } from '../../types/nec'

export const CompaniesVisitedPage: React.FC = () => {
  const { companies, companyVisits, addCompanyVisit, deleteCompanyVisit, addCompany } = usePlacementsStore()

  // Filters
  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [selectedDriveType, setSelectedDriveType] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [viewingVisit, setViewingVisit] = useState<CompanyVisit | null>(null)

  // Form state
  const [companyName, setCompanyName] = useState('')
  const [companySector, setCompanySector] = useState('IT & Cybersecurity')
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0])
  const [driveType, setDriveType] = useState<DriveType>('Campus Recruitment')
  const [driveMode, setDriveMode] = useState<DriveMode>('Offline')
  const [venue, setVenue] = useState('NEC Campus Auditorium')
  const [eligibleDepts, setEligibleDepts] = useState<string[]>(['dept-cys', 'dept-ai', 'dept-aiml', 'dept-ds'])
  const [roleTitle, setRoleTitle] = useState('')
  const [packageLPA, setPackageLPA] = useState<number>(8.0)
  const [coordinator, setCoordinator] = useState('Dr. S. Tirumala Rao (Dean Placements)')

  // Filtered visits
  const filteredVisits = useMemo(() => {
    return companyVisits.filter((v) => {
      if (selectedDept !== 'ALL_ET') {
        const resolved = DepartmentResolver.resolve(selectedDept)
        if (resolved.success && !v.eligibleDepartmentIds.includes(resolved.department.id)) return false
      }
      if (selectedStatus !== 'ALL' && v.status !== selectedStatus) return false
      if (selectedDriveType !== 'ALL' && v.driveType !== selectedDriveType) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match =
          v.companyName.toLowerCase().includes(q) ||
          v.roles.some((r) => r.roleName.toLowerCase().includes(q)) ||
          v.venue.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [companyVisits, selectedDept, selectedStatus, selectedDriveType, searchQuery])

  // Real KPIs
  const uniqueCompaniesCount = new Set(companyVisits.map((v) => v.companyId || v.companyName)).size
  const totalDrives = companyVisits.length
  const totalAttended = companyVisits.reduce((acc, v) => acc + (v.participation.attendedStudentsCount || 0), 0)
  const totalOffers = companyVisits.reduce((acc, v) => acc + (v.participation.offersReleasedCount || 0), 0)

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim() || !roleTitle.trim()) {
      alert('Please fill company name and primary role title.')
      return
    }

    // Ensure company exists in master
    let matchedComp = companies.find((c) => c.name.toLowerCase() === companyName.trim().toLowerCase())
    let compId = matchedComp ? matchedComp.id : addCompany({ name: companyName.trim(), sector: companySector, isActive: true })

    addCompanyVisit({
      companyId: compId,
      companyName: companyName.trim(),
      academicYear: '2026-27',
      visitDate,
      driveType,
      mode: driveMode,
      venue,
      eligibleDepartmentIds: eligibleDepts,
      roles: [
        {
          id: `role-${Date.now()}`,
          roleName: roleTitle.trim(),
          jobType: 'Full-Time',
          location: 'Hyderabad / Bengaluru',
          packageLPA
        }
      ],
      rounds: ['Online Assessment', 'Technical Interview', 'HR'],
      participation: {
        eligibleStudentsCount: 150,
        registeredStudentsCount: 140,
        attendedStudentsCount: 0,
        shortlistedStudentsCount: 0,
        selectedStudentsCount: 0,
        offersReleasedCount: 0
      },
      placementCoordinatorName: coordinator,
      status: 'SCHEDULED'
    })

    setIsAddModalOpen(false)
    setCompanyName('')
    setRoleTitle('')
  }

  const toggleDept = (deptId: string) => {
    if (eligibleDepts.includes(deptId)) {
      if (eligibleDepts.length > 1) setEligibleDepts(eligibleDepts.filter((d) => d !== deptId))
    } else {
      setEligibleDepts([...eligibleDepts, deptId])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              CORPORATE RECRUITMENT DRIVES
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              CAMPUS & POOL DRIVES
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Companies Visited & Recruitment Drives
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Institutional record of visiting corporations, pool campus schedules, eligible ET criteria, and recruitment rounds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => ExportService.exportCompanyVisitsCSV(filteredVisits)}
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
            <span>Add Company Visit</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-text-secondary">Unique Companies</span>
          <h3 className="text-2xl font-black text-text-primary mt-1">{uniqueCompaniesCount}</h3>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">In Company Master</span>
        </div>
        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-text-secondary">Placement Drives</span>
          <h3 className="text-2xl font-black text-text-primary mt-1">{totalDrives}</h3>
          <span className="text-[10px] text-text-secondary">Conducted / Scheduled</span>
        </div>
        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-text-secondary">Students Attended</span>
          <h3 className="text-2xl font-black text-text-primary mt-1">{totalAttended}</h3>
          <span className="text-[10px] text-text-secondary">ET Candidate Footprint</span>
        </div>
        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-emerald-600">Offers Released</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{totalOffers}</h3>
          <span className="text-[10px] text-text-secondary">Across All Drives</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Eligible Branch</label>
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
              <option value="SCHEDULED">Scheduled</option>
              <option value="PLANNED">Planned</option>
              <option value="POSTPONED">Postponed</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Drive Type</label>
            <select
              value={selectedDriveType}
              onChange={(e) => setSelectedDriveType(e.target.value)}
              className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
            >
              <option value="ALL">All Drive Types</option>
              <option value="Campus Recruitment">Campus Recruitment</option>
              <option value="Pool Campus">Pool Campus</option>
              <option value="Internship Hiring">Internship Hiring</option>
              <option value="Pre-Placement Talk">Pre-Placement Talk</option>
            </select>
          </div>
        </div>

        <div className="w-full md:w-64 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Company / Role..."
            className="w-full pl-9 pr-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none text-text-primary placeholder:text-text-secondary/50"
          />
        </div>
      </div>

      {/* Grid of Visits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVisits.map((v) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-text-primary">{v.companyName}</h3>
                  <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                    <span>{v.visitDate}</span>
                    <span>•</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{v.driveType} ({v.mode})</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    v.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300'
                  }`}
                >
                  {v.status}
                </span>
              </div>

              {/* Roles Offered */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-text-secondary uppercase block">Roles Offered:</span>
                <div className="space-y-1">
                  {v.roles.map((r) => (
                    <div
                      key={r.id}
                      className="p-2.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-text-primary block">{r.roleName}</span>
                        <span className="text-[10px] text-text-secondary">{r.location}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-600 text-xs">
                        {r.packageLPA ? `${r.packageLPA} LPA` : r.stipendMonthly ? `₹${r.stipendMonthly}/mo` : '-'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligible ET Departments */}
              <div>
                <span className="text-[10px] font-bold text-text-secondary uppercase block mb-1">Eligible ET Branches:</span>
                <div className="flex flex-wrap gap-1">
                  {v.eligibleDepartmentIds.map((deptId) => (
                    <span
                      key={deptId}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900"
                    >
                      {DepartmentResolver.getShortName(deptId)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Drive Stats Row */}
              <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[9px] text-text-secondary uppercase block">Attended</span>
                  <span className="font-bold text-text-primary">{v.participation.attendedStudentsCount || '-'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-secondary uppercase block">Shortlisted</span>
                  <span className="font-bold text-text-primary">{v.participation.shortlistedStudentsCount || '-'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-emerald-600 uppercase block font-bold">Offers</span>
                  <span className="font-bold text-emerald-600">{v.participation.offersReleasedCount || '-'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Company Visit Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-900 text-white">
                <h3 className="font-bold text-sm">Schedule Company Recruitment Visit</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateVisit} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-text-secondary block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Cisco Systems"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-text-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Visit Date *</label>
                    <input
                      type="date"
                      required
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Drive Type</label>
                    <select
                      value={driveType}
                      onChange={(e) => setDriveType(e.target.value as DriveType)}
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs font-semibold text-text-primary"
                    >
                      <option value="Campus Recruitment">Campus Recruitment</option>
                      <option value="Pool Campus">Pool Campus</option>
                      <option value="Internship Hiring">Internship Hiring</option>
                      <option value="Pre-Placement Talk">Pre-Placement Talk</option>
                    </select>
                  </div>
                </div>

                {/* Eligible ET Departments */}
                <div>
                  <label className="text-[11px] font-bold text-text-secondary block mb-1">Eligible ET Departments</label>
                  <div className="grid grid-cols-2 gap-2">
                    {DepartmentResolver.getETOptions().map((opt) => {
                      const isSelected = eligibleDepts.includes(opt.value)
                      return (
                        <div
                          key={opt.value}
                          onClick={() => toggleDept(opt.value)}
                          className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                              : 'bg-muted/30 border-border text-text-secondary'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <CheckCircle2 size={14} />}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Primary Role Title *</label>
                    <input
                      type="text"
                      required
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="e.g. Software Engineer"
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Package (LPA)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={packageLPA}
                      onChange={(e) => setPackageLPA(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs font-mono font-bold text-text-primary"
                    />
                  </div>
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
                    Save Company Visit
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

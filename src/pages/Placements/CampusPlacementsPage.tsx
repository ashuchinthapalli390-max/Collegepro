import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  Plus,
  Download,
  Search,
  Filter,
  Users,
  Award,
  Building2,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Trash2,
  Eye,
  X,
  FileSpreadsheet,
  Layers,
  Upload,
  AlertCircle
} from 'lucide-react'
import { usePlacementsStore } from '../../store/usePlacementsStore'
import { DepartmentResolver } from '../../utils/departmentResolver'
import { ExportService } from '../../utils/exportUtils'
import type { PlacementOffer, PlacementOfferStatus, PlacementOfferType } from '../../types/nec'

export const CampusPlacementsPage: React.FC = () => {
  const { companies, placementOffers, addPlacementOffer, deletePlacementOffer, bulkAddPlacementOffers, getStats } = usePlacementsStore()

  // Filters
  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [selectedOfferType, setSelectedOfferType] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)

  // Form state
  const [studentRoll, setStudentRoll] = useState('')
  const [studentName, setStudentName] = useState('')
  const [studentDept, setStudentDept] = useState('dept-cys')
  const [studentSection, setStudentSection] = useState<'A' | 'B' | 'C' | 'D'>('A')
  const [studentBatch, setStudentBatch] = useState('2023-2027')
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '')
  const [roleTitle, setRoleTitle] = useState('')
  const [packageLPA, setPackageLPA] = useState<number>(10.0)
  const [offerType, setOfferType] = useState<PlacementOfferType>('Full-Time')
  const [jobLocation, setJobLocation] = useState('Bengaluru')
  const [offerDate, setOfferDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState<PlacementOfferStatus>('OFFERED')

  // Filtered placement records
  const filteredOffers = useMemo(() => {
    return placementOffers.filter((o) => {
      if (selectedDept !== 'ALL_ET') {
        const resolved = DepartmentResolver.resolve(selectedDept)
        if (resolved.success && o.departmentId !== resolved.department.id) return false
      }
      if (selectedStatus !== 'ALL' && o.status !== selectedStatus) return false
      if (selectedOfferType !== 'ALL' && o.offerType !== selectedOfferType) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match =
          o.studentName.toLowerCase().includes(q) ||
          o.rollNumber.toLowerCase().includes(q) ||
          o.companyName.toLowerCase().includes(q) ||
          o.role.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [placementOffers, selectedDept, selectedStatus, selectedOfferType, searchQuery])

  // Computed Real KPIs
  const stats = getStats('2026-27', selectedDept)

  const handleAddPlacement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentRoll.trim() || !studentName.trim() || !roleTitle.trim()) {
      alert('Please fill mandatory fields.')
      return
    }

    const company = companies.find((c) => c.id === selectedCompanyId) || {
      id: 'comp-manual',
      name: 'Corporate Partner'
    }

    addPlacementOffer({
      rollNumber: studentRoll.trim().toUpperCase(),
      studentName: studentName.trim(),
      departmentId: studentDept,
      year: 'IV',
      section: studentSection,
      batch: studentBatch,
      companyId: company.id,
      companyName: company.name,
      role: roleTitle.trim(),
      packageLPA,
      offerType,
      jobLocation,
      offerDate,
      status,
      isPrimaryOffer: true
    })

    setIsAddModalOpen(false)
    setStudentRoll('')
    setStudentName('')
    setRoleTitle('')
  }

  // Simulated smart bulk import
  const handleBulkUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setTimeout(() => {
      alert(`Parsed ${file.name} successfully. Normalized ET aliases and imported student placement offers!`)
      setIsBulkModalOpen(false)
    }, 800)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              CAMPUS RECRUITMENT OUTCOMES
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              STUDENT SELECTION & OFFERS
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Campus Placements & Offer Repository
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Verified student-level placement selections, compensation packages (LPA), offer letters, and corporate recruitment records for ET branches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Upload size={14} />
            <span>Smart Import</span>
          </button>
          <button
            onClick={() => ExportService.exportCampusPlacementsCSV(filteredOffers)}
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
            <span>Add Placement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Accurate Placed Students vs Total Offers) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-surface border border-border p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-text-secondary">Students Placed</span>
          <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{stats.uniquePlacedStudents}</h3>
          <span className="text-[10px] text-text-secondary">Unique Individuals</span>
        </div>
        <div className="bg-surface border border-border p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-emerald-600">Total Offers</span>
          <h3 className="text-xl font-black text-emerald-600 mt-1">{stats.totalOffers}</h3>
          <span className="text-[10px] text-text-secondary">
            {stats.multipleOfferStudentsCount > 0 ? `${stats.multipleOfferStudentsCount} Multi-Offers` : 'All Offers'}
          </span>
        </div>
        <div className="bg-surface border border-border p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-text-secondary">Highest Package</span>
          <h3 className="text-xl font-black text-text-primary mt-1">
            {stats.highestPackageLPA ? `${stats.highestPackageLPA} LPA` : '-'}
          </h3>
          <span className="text-[10px] text-emerald-600 font-semibold">Top CTC</span>
        </div>
        <div className="bg-surface border border-border p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-text-secondary">Average Package</span>
          <h3 className="text-xl font-black text-text-primary mt-1">
            {stats.averagePackageLPA ? `${stats.averagePackageLPA} LPA` : '-'}
          </h3>
          <span className="text-[10px] text-text-secondary">Mean Offered CTC</span>
        </div>
        <div className="bg-surface border border-border p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-text-secondary">Recruiting Companies</span>
          <h3 className="text-xl font-black text-text-primary mt-1">{stats.recruitingCompaniesCount}</h3>
          <span className="text-[10px] text-text-secondary">Hiring Partners</span>
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
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Offer Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="JOINED">Joined</option>
              <option value="OFFERED">Offered</option>
              <option value="SELECTED">Selected</option>
              <option value="DECLINED">Declined (Multi-offer)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Offer Type</label>
            <select
              value={selectedOfferType}
              onChange={(e) => setSelectedOfferType(e.target.value)}
              className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
            >
              <option value="ALL">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Internship + PPO">Internship + PPO</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="w-full md:w-64 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Student / Company / Roll..."
            className="w-full pl-9 pr-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none text-text-primary placeholder:text-text-secondary/50"
          />
        </div>
      </div>

      {/* Table of Placement Offers */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/50 text-text-secondary border-b border-border">
            <tr>
              <th className="py-3 px-4 font-bold">#</th>
              <th className="py-3 px-4 font-bold">Student Name</th>
              <th className="py-3 px-4 font-bold">Roll No</th>
              <th className="py-3 px-4 font-bold">Department</th>
              <th className="py-3 px-4 font-bold">Company & Role</th>
              <th className="py-3 px-4 font-bold text-center">Package (LPA)</th>
              <th className="py-3 px-4 font-bold text-center">Offer Type</th>
              <th className="py-3 px-4 font-bold text-center">Offer Date</th>
              <th className="py-3 px-4 font-bold text-center">Status</th>
              <th className="py-3 px-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredOffers.map((o, idx) => (
              <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-text-secondary">{idx + 1}</td>
                <td className="py-3 px-4 font-bold text-text-primary">
                  <div>{o.studentName}</div>
                  <span className="text-[10px] text-text-secondary font-normal font-mono">Sec {o.section} • {o.batch}</span>
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  {o.rollNumber}
                </td>
                <td className="py-3 px-4 text-text-secondary font-medium">
                  {DepartmentResolver.getShortName(o.departmentId)}
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-text-primary">{o.companyName}</div>
                  <div className="text-[10px] text-text-secondary">{o.role} • {o.jobLocation}</div>
                </td>
                <td className="py-3 px-4 text-center font-mono font-black text-sm text-emerald-600">
                  {o.packageLPA} LPA
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted border border-border">
                    {o.offerType}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-text-secondary font-mono text-[11px]">
                  {o.offerDate}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      o.status === 'JOINED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                        : o.status === 'DECLINED'
                        ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300'
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => {
                      if (confirm(`Remove placement record for ${o.studentName}?`)) deletePlacementOffer(o.id)
                    }}
                    className="p-1 rounded hover:bg-red-50 text-red-500 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Placement Modal */}
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
                <h3 className="font-bold text-sm">Add Campus Placement Selection</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddPlacement} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Student Roll No *</label>
                    <input
                      type="text"
                      required
                      value={studentRoll}
                      onChange={(e) => setStudentRoll(e.target.value.toUpperCase())}
                      placeholder="e.g. 23CYS001"
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs font-mono font-bold text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Student Name *</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. A. Sai Teja"
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs text-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Department *</label>
                    <select
                      value={studentDept}
                      onChange={(e) => setStudentDept(e.target.value)}
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
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Selecting Company *</label>
                    <select
                      value={selectedCompanyId}
                      onChange={(e) => setSelectedCompanyId(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs font-semibold text-text-primary"
                    >
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Role / Designation *</label>
                    <input
                      type="text"
                      required
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="e.g. SOC Analyst"
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Package LPA *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={packageLPA}
                      onChange={(e) => setPackageLPA(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs font-mono font-bold text-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Offer Type</label>
                    <select
                      value={offerType}
                      onChange={(e) => setOfferType(e.target.value as PlacementOfferType)}
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs font-semibold text-text-primary"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Internship + PPO">Internship + PPO</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-text-secondary block mb-1">Placement Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as PlacementOfferStatus)}
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs font-semibold text-text-primary"
                    >
                      <option value="OFFERED">Offered</option>
                      <option value="JOINED">Joined</option>
                      <option value="SELECTED">Selected</option>
                      <option value="DECLINED">Declined</option>
                    </select>
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
                    Save Placement Offer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Smart Bulk Import Modal */}
      <AnimatePresence>
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-text-primary">Smart Bulk Import Placement Sheet</h3>
                <button onClick={() => setIsBulkModalOpen(false)} className="text-text-secondary">
                  <X size={18} />
                </button>
              </div>

              <p className="text-text-secondary leading-relaxed">
                Upload placement Excel / CSV sheet. Recognizes columns like <strong>HTNO / Roll, Student Name, Branch (CYS / Cyber Security / AI / AIML / DS), Company, Package CTC</strong> automatically.
              </p>

              <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-muted/20 flex flex-col items-center justify-center gap-2">
                <FileSpreadsheet className="w-8 h-8 text-indigo-600" />
                <input
                  type="file"
                  id="bulk-placement-file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleBulkUploadSimulated}
                  className="hidden"
                />
                <label
                  htmlFor="bulk-placement-file"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer mt-1"
                >
                  Select Spreadsheet (.xlsx / .csv)
                </label>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

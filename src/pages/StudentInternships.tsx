import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Building, Search, Filter, CheckCircle2, DollarSign, Clock, MapPin } from 'lucide-react'
import { useETPortalStore } from '../store/useETPortalStore'
import { DepartmentResolver } from '../utils/departmentResolver'

export const StudentInternshipsPage: React.FC = () => {
  const { internships } = useETPortalStore()
  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredInternships = useMemo(() => {
    return internships.filter((i) => {
      if (selectedDept !== 'ALL_ET') {
        const resolved = DepartmentResolver.resolve(selectedDept)
        if (resolved.success && i.departmentId !== resolved.department.id) return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match = i.studentName.toLowerCase().includes(q) || i.companyName.toLowerCase().includes(q) || i.rollNumber.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [internships, selectedDept, searchQuery])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              INDUSTRY CONNECT & PLACEMENTS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              VERIFIED OFFER LETTERS
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Student Internships & Industry Training
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Stipend-based summer internships, remote engineering fellowships, and corporate training tracking for ET students.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-bold uppercase text-text-secondary">Department:</label>
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

        <div className="w-full md:w-64 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Company / Student..."
            className="w-full pl-9 pr-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none text-text-primary placeholder:text-text-secondary/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/50 text-text-secondary border-b border-border">
            <tr>
              <th className="py-3 px-4 font-bold">#</th>
              <th className="py-3 px-4 font-bold">Student Name</th>
              <th className="py-3 px-4 font-bold">Roll No</th>
              <th className="py-3 px-4 font-bold">Department</th>
              <th className="py-3 px-4 font-bold">Company & Role</th>
              <th className="py-3 px-4 font-bold text-center">Stipend</th>
              <th className="py-3 px-4 font-bold text-center">Duration</th>
              <th className="py-3 px-4 font-bold text-center">Mode</th>
              <th className="py-3 px-4 font-bold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredInternships.map((i, idx) => (
              <tr key={i.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-text-secondary">{idx + 1}</td>
                <td className="py-3 px-4 font-bold text-text-primary">{i.studentName}</td>
                <td className="py-3 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">{i.rollNumber}</td>
                <td className="py-3 px-4 text-text-secondary">{DepartmentResolver.getShortName(i.departmentId)}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-text-primary">{i.companyName}</div>
                  <div className="text-[10px] text-text-secondary font-medium">{i.role}</div>
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                  {i.stipendAmount ? `₹${i.stipendAmount.toLocaleString()}/mo` : 'Unpaid / Certificate'}
                </td>
                <td className="py-3 px-4 text-center font-medium">{i.durationWeeks} Weeks</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted border border-border">
                    {i.mode}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      i.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    }`}
                  >
                    {i.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

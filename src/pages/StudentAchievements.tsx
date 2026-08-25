import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Award, Search, Filter, CheckCircle2, FileText, Calendar, Building2 } from 'lucide-react'
import { useETPortalStore } from '../store/useETPortalStore'
import { DepartmentResolver } from '../utils/departmentResolver'

export const StudentAchievementsPage: React.FC = () => {
  const { achievements } = useETPortalStore()
  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredAchievements = useMemo(() => {
    return achievements.filter((a) => {
      if (selectedDept !== 'ALL_ET') {
        const resolved = DepartmentResolver.resolve(selectedDept)
        if (resolved.success && a.departmentId !== resolved.department.id) return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match = a.studentName.toLowerCase().includes(q) || a.eventTitle.toLowerCase().includes(q) || a.rollNumber.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [achievements, selectedDept, searchQuery])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              NATIONAL & STATE AWARDS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              SIH • HACKATHONS • ICPC
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Student Achievements & Honors
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Verified competitive programming victories, national hackathon prizes, cash awards, and paper presentation honors.
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
            placeholder="Search Student / Event..."
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
              <th className="py-3 px-4 font-bold">Event & Organizer</th>
              <th className="py-3 px-4 font-bold text-center">Category</th>
              <th className="py-3 px-4 font-bold text-center">Prize / Honor</th>
              <th className="py-3 px-4 font-bold text-center">Cash Prize</th>
              <th className="py-3 px-4 font-bold text-center">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAchievements.map((a, idx) => (
              <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-text-secondary">{idx + 1}</td>
                <td className="py-3 px-4 font-bold text-text-primary">{a.studentName}</td>
                <td className="py-3 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">{a.rollNumber}</td>
                <td className="py-3 px-4 text-text-secondary">{DepartmentResolver.getShortName(a.departmentId)}</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-text-primary">{a.eventTitle}</div>
                  <div className="text-[10px] text-text-secondary">{a.organizedBy} ({a.eventDate})</div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted border border-border">
                    {a.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-bold text-amber-600 dark:text-amber-400">
                  {a.prizePosition}
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                  {a.cashPrize ? `₹${a.cashPrize.toLocaleString()}` : '-'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Verified
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

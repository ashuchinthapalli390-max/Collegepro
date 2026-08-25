import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Award, Search, Filter, CheckCircle2, GraduationCap, Trophy, BookOpen, Layers } from 'lucide-react'
import { useETPortalStore } from '../store/useETPortalStore'
import { DepartmentResolver } from '../utils/departmentResolver'

export const NPTELCertificationsPage: React.FC = () => {
  const { nptel } = useETPortalStore()
  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')
  const [candidateType, setCandidateType] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredNPTEL = useMemo(() => {
    return nptel.filter((n) => {
      if (selectedDept !== 'ALL_ET') {
        const resolved = DepartmentResolver.resolve(selectedDept)
        if (resolved.success && n.departmentId !== resolved.department.id) return false
      }
      if (candidateType !== 'ALL' && n.candidateType !== candidateType) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match = n.name.toLowerCase().includes(q) || n.courseName.toLowerCase().includes(q) || n.rollOrId.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [nptel, selectedDept, candidateType, searchQuery])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              IIT / SWAYAM CERTIFICATION REPOSITORY
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              ELITE + GOLD • TOPPER CREDITS
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            NPTEL & MOOC Certifications
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Official repository of IIT NPTEL, Coursera, and SWAYAM course certifications with credit transfer records for ET students and faculty.
          </p>
        </div>
      </div>

      {/* Filters */}
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
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Candidate Type</label>
            <select
              value={candidateType}
              onChange={(e) => setCandidateType(e.target.value)}
              className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
            >
              <option value="ALL">All Candidates</option>
              <option value="Student">Students Only</option>
              <option value="Faculty">Faculty Only</option>
            </select>
          </div>
        </div>

        <div className="w-full md:w-64 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Course / Name..."
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
              <th className="py-3 px-4 font-bold">Candidate Name</th>
              <th className="py-3 px-4 font-bold">ID / Roll No</th>
              <th className="py-3 px-4 font-bold">Department</th>
              <th className="py-3 px-4 font-bold">NPTEL Course Title</th>
              <th className="py-3 px-4 font-bold">Domain</th>
              <th className="py-3 px-4 font-bold text-center">Score</th>
              <th className="py-3 px-4 font-bold text-center">Certificate Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredNPTEL.map((n, idx) => (
              <tr key={n.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-text-secondary">{idx + 1}</td>
                <td className="py-3 px-4 font-bold text-text-primary">
                  <div>{n.name}</div>
                  <span className="text-[10px] text-text-secondary font-normal">{n.candidateType}</span>
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">{n.rollOrId}</td>
                <td className="py-3 px-4 text-text-secondary">{DepartmentResolver.getShortName(n.departmentId)}</td>
                <td className="py-3 px-4 font-semibold text-text-primary">{n.courseName}</td>
                <td className="py-3 px-4 text-text-secondary">{n.courseDomain}</td>
                <td className="py-3 px-4 text-center font-mono font-bold text-base text-text-primary">
                  {n.score}%
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      n.certificateType.includes('Gold')
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300'
                        : n.certificateType.includes('Silver')
                        ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                    }`}
                  >
                    {n.certificateType}
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

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users, Mail, Phone, Award, BookOpen, GraduationCap, Search, Filter, ShieldCheck, Briefcase } from 'lucide-react'
import { useETPortalStore } from '../store/useETPortalStore'
import { DepartmentResolver } from '../utils/departmentResolver'

export const FacultyDirectoryPage: React.FC = () => {
  const { faculty } = useETPortalStore()
  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredFaculty = useMemo(() => {
    return faculty.filter((f) => {
      if (selectedDept !== 'ALL_ET') {
        const resolved = DepartmentResolver.resolve(selectedDept)
        if (resolved.success && f.departmentId !== resolved.department.id) return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const nameMatch = f.name.toLowerCase().includes(q)
        const specMatch = f.specialization.toLowerCase().includes(q)
        if (!nameMatch && !specMatch) return false
      }
      return true
    })
  }, [faculty, selectedDept, searchQuery])

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              EMERGING TECHNOLOGIES FACULTY
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              AUTONOMOUS BODY
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Faculty Directory (AI, AIML, CYS, DS)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Verified academic profiles, research specializations, laboratory leads, and contact information.
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
            placeholder="Search Faculty Name / Research..."
            className="w-full pl-9 pr-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none text-text-primary placeholder:text-text-secondary/50"
          />
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFaculty.map((fac) => (
          <motion.div
            key={fac.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <img
                  src={fac.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={fac.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/20 shadow"
                />
                <div>
                  <h3 className="font-bold text-sm text-text-primary">{fac.name}</h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{fac.designation}</p>
                  <span className="text-[11px] text-text-secondary">{DepartmentResolver.getShortName(fac.departmentId)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-text-secondary">
                  <GraduationCap size={14} className="text-indigo-600 shrink-0" />
                  <span className="truncate">{fac.qualification}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Briefcase size={14} className="text-indigo-600 shrink-0" />
                  <span>{fac.experienceYears} Years Teaching & Research</span>
                </div>
                <div className="flex items-start gap-2 text-text-secondary pt-1 border-t border-border/40">
                  <BookOpen size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 text-[11px] font-medium text-text-primary">{fac.specialization}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-secondary">
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Mail size={13} className="text-indigo-600" />
                <span>{fac.email}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Phone size={13} className="text-indigo-600" />
                <span>{fac.phone}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Award, ShieldCheck, Search, Filter, CheckCircle2, FileText, Calendar, Building2 } from 'lucide-react'
import { useETPortalStore } from '../store/useETPortalStore'
import { DepartmentResolver } from '../utils/departmentResolver'

export const PatentsPage: React.FC = () => {
  const { patents } = useETPortalStore()
  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredPatents = useMemo(() => {
    return patents.filter((p) => {
      if (selectedDept !== 'ALL_ET') {
        const resolved = DepartmentResolver.resolve(selectedDept)
        if (resolved.success && p.departmentId !== resolved.department.id) return false
      }
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match = p.title.toLowerCase().includes(q) || p.applicationNumber.toLowerCase().includes(q) || p.inventorNames.some((i) => i.toLowerCase().includes(q))
        if (!match) return false
      }
      return true
    })
  }, [patents, selectedDept, selectedStatus, searchQuery])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              INTELLECTUAL PROPERTY RIGHTS (IPR)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              PATENTS & INNOVATIONS
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Patents & Intellectual Property
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Indian Patent Office (IPO) and international patents filed, published, and granted to ET faculty and student inventors.
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
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Patent Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="Granted">Granted Patents</option>
              <option value="Published">Published</option>
              <option value="Filed">Filed</option>
            </select>
          </div>
        </div>

        <div className="w-full md:w-64 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Application No / Title..."
            className="w-full pl-9 pr-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none text-text-primary placeholder:text-text-secondary/50"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatents.map((pat) => (
          <motion.div
            key={pat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                    {pat.applicationNumber}
                  </span>
                  <span className="text-[10px] text-text-secondary font-semibold">
                    {DepartmentResolver.getDisplayName(pat.departmentId)}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    pat.status === 'Granted'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300'
                  }`}
                >
                  {pat.status}
                </span>
              </div>

              <h3 className="font-bold text-sm text-text-primary leading-snug">{pat.title}</h3>

              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1 text-xs text-text-secondary">
                <div className="flex items-center justify-between">
                  <span>Inventors:</span>
                  <span className="font-semibold text-text-primary">{pat.inventorNames.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Patent Jurisdiction:</span>
                  <span className="font-medium text-text-primary">{pat.patentOffice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Filing Date:</span>
                  <span className="font-medium text-text-primary">{pat.filingDate}</span>
                </div>
                {pat.grantDate && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold pt-1 border-t border-border/40">
                    <span>Date of Grant:</span>
                    <span>{pat.grantDate}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

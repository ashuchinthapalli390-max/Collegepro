import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Handshake, Building2, Search, CheckCircle2, Calendar, FileText, ExternalLink } from 'lucide-react'
import { useETPortalStore } from '../store/useETPortalStore'
import { DepartmentResolver } from '../utils/departmentResolver'

export const IndustryMoUsPage: React.FC = () => {
  const { mous } = useETPortalStore()
  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredMoUs = useMemo(() => {
    return mous.filter((m) => {
      if (selectedDept !== 'ALL_ET') {
        const resolved = DepartmentResolver.resolve(selectedDept)
        if (resolved.success && m.departmentId !== resolved.department.id) return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match = m.companyName.toLowerCase().includes(q) || m.nodalOfficerName.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [mous, selectedDept, searchQuery])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              INDUSTRY COLLABORATION
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CORPORATE PARTNERSHIPS
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Industry MoUs & Strategic Alliances
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Memoranda of Understanding signed with leading technology corporations, center of excellence (COE) labs, and training bootcamps.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMoUs.map((mou) => (
          <motion.div
            key={mou.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-text-primary">{mou.companyName}</h3>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    {DepartmentResolver.getDisplayName(mou.departmentId)}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300">
                  {mou.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1.5 text-xs text-text-secondary">
                <div className="flex items-center justify-between">
                  <span>Validity Period:</span>
                  <span className="font-semibold text-text-primary">{mou.signingDate} to {mou.expiryDate} ({mou.validityYears} Years)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Department Nodal Lead:</span>
                  <span className="font-semibold text-text-primary">{mou.nodalOfficerName}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-text-secondary uppercase block">Joint Activities Executed:</span>
                <ul className="space-y-1 text-xs text-text-primary">
                  {mou.activitiesConducted.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ExternalLink, Search, Filter, Award, Sparkles, FileText } from 'lucide-react'
import { useETPortalStore } from '../store/useETPortalStore'
import { DepartmentResolver } from '../utils/departmentResolver'

export const ResearchPublicationsPage: React.FC = () => {
  const { publications } = useETPortalStore()
  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')
  const [selectedIndexing, setSelectedIndexing] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredPublications = useMemo(() => {
    return publications.filter((p) => {
      if (selectedDept !== 'ALL_ET') {
        const resolved = DepartmentResolver.resolve(selectedDept)
        if (resolved.success && p.departmentId !== resolved.department.id) return false
      }
      if (selectedIndexing !== 'ALL' && p.indexing !== selectedIndexing) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match = p.title.toLowerCase().includes(q) || p.facultyAuthorNames.some((a) => a.toLowerCase().includes(q))
        if (!match) return false
      }
      return true
    })
  }, [publications, selectedDept, selectedIndexing, searchQuery])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              RESEARCH & SCHOLARSHIP
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              SCI • SCOPUS • IEEE XPLORE
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Research Publications & Papers
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Peer-reviewed journal publications, international conference proceedings, citation indices, and DOIs for ET faculty.
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
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Indexing</label>
            <select
              value={selectedIndexing}
              onChange={(e) => setSelectedIndexing(e.target.value)}
              className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
            >
              <option value="ALL">All Indexing</option>
              <option value="SCI">SCI / SCIE Indexed</option>
              <option value="Scopus">Scopus Indexed</option>
              <option value="UGC CARE">UGC CARE</option>
              <option value="IEEE Xplore">IEEE Xplore</option>
            </select>
          </div>
        </div>

        <div className="w-full md:w-64 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Paper Title / Author..."
            className="w-full pl-9 pr-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none text-text-primary placeholder:text-text-secondary/50"
          />
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-3">
        {filteredPublications.map((pub) => (
          <motion.div
            key={pub.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                    {pub.indexing}
                  </span>
                  <span className="text-[10px] text-text-secondary font-bold">
                    {DepartmentResolver.getShortName(pub.departmentId)} • {pub.publicationType}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-text-primary leading-snug">{pub.title}</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                  {pub.facultyAuthorNames.join(', ')}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-muted text-text-primary border border-border block">
                  {pub.citationsCount} Citations
                </span>
                {pub.impactFactor && (
                  <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                    IF: {pub.impactFactor}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs text-text-secondary">
              <div className="font-medium text-text-primary truncate">
                {pub.journalOrConfName} {pub.volumeIssue ? `(${pub.volumeIssue})` : ''}
              </div>
              <div className="flex items-center gap-3 shrink-0 text-[11px]">
                <span>Date: {pub.publicationDate}</span>
                {pub.doi && (
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 font-mono font-bold flex items-center gap-1 hover:underline"
                  >
                    <span>DOI</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

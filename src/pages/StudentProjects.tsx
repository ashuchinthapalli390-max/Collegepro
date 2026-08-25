import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FolderKanban, Plus, Download, GitBranch, ExternalLink, Search, CheckCircle2, User, Layers, Tag } from 'lucide-react'
import { useETPortalStore } from '../store/useETPortalStore'
import { DepartmentResolver } from '../utils/departmentResolver'

export const StudentProjectsPage: React.FC = () => {
  const { projects } = useETPortalStore()
  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedDept !== 'ALL_ET') {
        const resolved = DepartmentResolver.resolve(selectedDept)
        if (resolved.success && p.departmentId !== resolved.department.id) return false
      }
      if (selectedType !== 'ALL' && p.projectType !== selectedType) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const titleMatch = p.title.toLowerCase().includes(q)
        const domainMatch = p.domain.toLowerCase().includes(q)
        const rollMatch = p.teamLeaderRoll.toLowerCase().includes(q)
        if (!titleMatch && !domainMatch && !rollMatch) return false
      }
      return true
    })
  }, [projects, selectedDept, selectedType, searchQuery])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              STUDENT INNOVATION
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              CAPSTONE & MINI PROJECTS
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Student Projects Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Major capstone projects, industry-sponsored prototypes, research papers, and code repositories for ET students.
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
            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Project Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
            >
              <option value="ALL">All Types</option>
              <option value="Capstone">Capstone Project</option>
              <option value="Mini Project">Mini Project</option>
              <option value="Industry Project">Industry Project</option>
            </select>
          </div>
        </div>

        <div className="w-full md:w-64 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Project Title / Roll..."
            className="w-full pl-9 pr-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none text-text-primary placeholder:text-text-secondary/50"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                      {p.projectType}
                    </span>
                    <span className="text-[10px] text-text-secondary font-semibold">
                      {DepartmentResolver.getShortName(p.departmentId)} • Batch {p.batch}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-text-primary mt-1 leading-snug">{p.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  {p.status}
                </span>
              </div>

              <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">{p.abstract}</p>

              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-text-secondary">
                  <span>Domain / Tech:</span>
                  <span className="font-semibold text-text-primary">{p.domain}</span>
                </div>
                <div className="flex items-center justify-between text-text-secondary">
                  <span>Guide Faculty:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{p.guideFacultyName}</span>
                </div>
                <div className="flex items-center justify-between text-text-secondary">
                  <span>Team Leader:</span>
                  <span className="font-semibold text-text-primary">{p.teamLeaderName} ({p.teamLeaderRoll})</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-[11px] text-text-secondary">{p.teamMembers.length} Student Collaborators</span>
              <div className="flex items-center gap-2">
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-text-primary flex items-center gap-1 text-[11px] font-semibold"
                  >
                    <GitBranch size={13} />
                    <span>Code</span>
                  </a>
                )}
                {p.demoUrl && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center gap-1 text-[11px] font-semibold"
                  >
                    <ExternalLink size={13} />
                    <span>Demo</span>
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

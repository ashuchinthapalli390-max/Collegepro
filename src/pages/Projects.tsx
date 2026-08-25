import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, FolderKanban, ArrowRight, Users, CheckCircle2,
  Circle, Clock, AlertCircle, ChevronRight, X, Flag, Activity,
  LayoutGrid, Columns3, GitBranch, CalendarDays, Trash2
} from 'lucide-react'
import { useProjectStore } from '../store/useProjectStore'
import type { Project, Issue } from '../store/useProjectStore'

const STATUS_COLS: { key: Issue['status']; label: string; color: string; icon: React.ReactNode }[] = [
  { key: 'backlog', label: 'Backlog', color: '#64748b', icon: <Circle size={12} /> },
  { key: 'todo', label: 'To Do', color: '#6366f1', icon: <Circle size={12} /> },
  { key: 'in_progress', label: 'In Progress', color: '#f59e0b', icon: <Clock size={12} /> },
  { key: 'review', label: 'Review', color: '#8b5cf6', icon: <AlertCircle size={12} /> },
  { key: 'done', label: 'Done', color: '#10b981', icon: <CheckCircle2 size={12} /> },
]

const PRIORITY_COLORS: Record<string, string> = { low: '#64748b', medium: '#f59e0b', high: '#f43f5e', urgent: '#ef4444' }

export const ProjectsPage: React.FC = () => {
  const { projects, selectedProjectId, projectView, setSelectedProject, setProjectView, updateIssueStatus, addIssue, toggleMilestone } = useProjectStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewIssue, setShowNewIssue] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  const project = projects.find((p) => p.id === selectedProjectId) || null

  // Filtered issues
  const filteredIssues = useMemo(() => {
    if (!project) return []
    return project.issues.filter((i) =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.labels.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [project, searchQuery])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <FolderKanban size={20} className="text-amber-500" />
            Projects
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">{projects.length} projects · {projects.reduce((s, p) => s + p.issues.length, 0)} total issues</p>
        </div>
      </motion.div>

      {/* Project Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <motion.button
            key={p.id}
            onClick={() => setSelectedProject(p.id)}
            whileHover={{ y: -2 }}
            className={`text-left p-5 rounded-2xl border shadow-apple transition-all ${
              selectedProjectId === p.id
                ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-apple-floating'
                : 'border-border bg-surface hover:shadow-apple-floating'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black" style={{ backgroundColor: p.color }}>
                  {p.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">{p.name}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    p.status === 'active' ? 'text-emerald-500' : p.status === 'paused' ? 'text-amber-500' : 'text-text-secondary'
                  }`}>{p.status}</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-text-secondary/50 mt-1" />
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed mb-3 line-clamp-2">{p.description}</p>
            <div className="flex items-center justify-between">
              {/* Progress */}
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
                </div>
                <span className="text-[10px] font-bold text-text-secondary">{p.progress}%</span>
              </div>
              {/* Members */}
              <div className="flex -space-x-2">
                {p.members.slice(0, 3).map((m, i) => (
                  <img key={i} src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full border-2 border-surface object-cover" />
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Project Detail View */}
      {project && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* View Tabs & Search */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex bg-muted/60 rounded-xl border border-border p-0.5">
              {([
                { v: 'dashboard', icon: LayoutGrid, label: 'Overview' },
                { v: 'kanban', icon: Columns3, label: 'Kanban' },
                { v: 'roadmap', icon: GitBranch, label: 'Roadmap' },
                { v: 'sprint', icon: CalendarDays, label: 'Sprint' },
                { v: 'activity', icon: Activity, label: 'Activity' },
              ] as const).map(({ v, icon: Icon, label }) => (
                <button
                  key={v}
                  onClick={() => setProjectView(v)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                    projectView === v ? 'bg-surface text-text-primary shadow-apple' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon size={12} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2 text-text-secondary" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 pr-3 py-1.5 bg-muted/50 border border-border rounded-xl text-xs focus:outline-none focus:border-indigo-500 w-48 text-text-primary" placeholder="Search issues..." />
              </div>
              <button onClick={() => setShowNewIssue(true)} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-apple transition-colors">
                <Plus size={14} /> Issue
              </button>
            </div>
          </div>

          {/* Dashboard Overview */}
          {projectView === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Stats */}
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STATUS_COLS.filter(s => s.key !== 'backlog').map((s) => {
                  const count = project.issues.filter((i) => i.status === s.key).length
                  return (
                    <div key={s.key} className="p-4 bg-surface border border-border rounded-2xl shadow-apple text-center">
                      <span className="text-2xl font-black text-text-primary">{count}</span>
                      <p className="text-[10px] font-bold text-text-secondary mt-1 uppercase tracking-wider">{s.label}</p>
                    </div>
                  )
                })}
              </div>
              {/* Milestones */}
              <div className="p-4 bg-surface border border-border rounded-2xl shadow-apple">
                <h3 className="text-xs font-bold text-text-primary mb-3 flex items-center gap-1.5"><Flag size={12} className="text-rose-500" /> Milestones</h3>
                <div className="space-y-2">
                  {project.milestones.map((m) => (
                    <button key={m.id} onClick={() => toggleMilestone(project.id, m.id)} className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${m.completed ? 'bg-emerald-500 border-emerald-500' : 'border-border'}`}>
                        {m.completed && <CheckCircle2 size={10} className="text-white" />}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold ${m.completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>{m.title}</p>
                        <p className="text-[10px] text-text-secondary">{m.dueDate}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {/* Recent Issues */}
              <div className="lg:col-span-2 p-4 bg-surface border border-border rounded-2xl shadow-apple">
                <h3 className="text-xs font-bold text-text-primary mb-3">Recent Issues</h3>
                <div className="space-y-1.5">
                  {filteredIssues.slice(0, 6).map((issue) => (
                    <IssueRow key={issue.id} issue={issue} onClick={() => setSelectedIssue(issue)} />
                  ))}
                </div>
              </div>
              {/* Members */}
              <div className="p-4 bg-surface border border-border rounded-2xl shadow-apple">
                <h3 className="text-xs font-bold text-text-primary mb-3 flex items-center gap-1.5"><Users size={12} className="text-indigo-500" /> Team</h3>
                <div className="space-y-2.5">
                  {project.members.map((m, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover shadow-apple" />
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{m.name}</p>
                        <p className="text-[10px] text-text-secondary">{m.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Kanban Board */}
          {projectView === 'kanban' && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STATUS_COLS.map((col) => {
                const colIssues = filteredIssues.filter((i) => i.status === col.key)
                return (
                  <div key={col.key} className="min-w-[260px] w-[260px] shrink-0">
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                      <span className="text-xs font-bold text-text-primary">{col.label}</span>
                      <span className="text-[10px] text-text-secondary bg-muted px-1.5 py-0.5 rounded-md font-bold">{colIssues.length}</span>
                    </div>
                    <div className="space-y-2">
                      {colIssues.map((issue) => (
                        <motion.div
                          key={issue.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => setSelectedIssue(issue)}
                          className="p-3 bg-surface border border-border rounded-xl shadow-apple cursor-pointer hover:shadow-apple-floating transition-all"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex gap-1 flex-wrap">
                              {issue.labels.map((l) => (
                                <span key={l} className="px-1.5 py-0.5 text-[8px] font-bold bg-muted border border-border/60 rounded text-text-secondary uppercase">{l}</span>
                              ))}
                            </div>
                            <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: PRIORITY_COLORS[issue.priority] }} />
                          </div>
                          <p className="text-xs font-semibold text-text-primary mb-2">{issue.title}</p>
                          <div className="flex items-center justify-between">
                            <img src={issue.assignee.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                            <span className="text-[9px] text-text-secondary font-medium">{issue.id.toUpperCase()}</span>
                          </div>
                        </motion.div>
                      ))}
                      {colIssues.length === 0 && (
                        <div className="text-center py-8 text-text-secondary/40 text-xs">No issues</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Roadmap */}
          {projectView === 'roadmap' && (
            <div className="space-y-4">
              {project.epics.map((epic) => {
                const epicIssues = project.issues.filter((i) => i.epicId === epic.id)
                return (
                  <div key={epic.id} className="p-4 bg-surface border border-border rounded-2xl shadow-apple">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: epic.color }} />
                        <h3 className="text-sm font-bold text-text-primary">{epic.title}</h3>
                      </div>
                      <span className="text-[10px] text-text-secondary font-semibold">{epic.startDate} → {epic.endDate}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full mb-3 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${epic.progress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full rounded-full" style={{ backgroundColor: epic.color }} />
                    </div>
                    <div className="space-y-1.5">
                      {epicIssues.map((issue) => (
                        <IssueRow key={issue.id} issue={issue} onClick={() => setSelectedIssue(issue)} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Sprint Board */}
          {projectView === 'sprint' && (
            <div className="space-y-4">
              {project.sprints.filter((s) => s.isActive).map((sprint) => {
                const sprintIssues = project.issues.filter((i) => i.sprintId === sprint.id)
                const done = sprintIssues.filter((i) => i.status === 'done').length
                return (
                  <div key={sprint.id}>
                    <div className="flex items-center justify-between mb-4 p-4 bg-surface border border-border rounded-2xl shadow-apple">
                      <div>
                        <h3 className="text-sm font-bold text-text-primary">{sprint.name}</h3>
                        <p className="text-[10px] text-text-secondary">{sprint.startDate} → {sprint.endDate}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-text-primary">{done}/{sprintIssues.length}</span>
                        <p className="text-[10px] text-text-secondary">Completed</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {sprintIssues.map((issue) => (
                        <div key={issue.id} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-xl shadow-apple">
                          <select
                            value={issue.status}
                            onChange={(e) => updateIssueStatus(project.id, issue.id, e.target.value as Issue['status'])}
                            className="text-[10px] font-bold bg-muted border border-border rounded-lg px-2 py-1 text-text-primary focus:outline-none"
                          >
                            {STATUS_COLS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                          </select>
                          <span className="flex-1 text-xs font-semibold text-text-primary truncate">{issue.title}</span>
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PRIORITY_COLORS[issue.priority] }} />
                          <img src={issue.assignee.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
              {project.sprints.filter((s) => s.isActive).length === 0 && (
                <div className="text-center py-12 text-text-secondary/50 text-sm">No active sprints</div>
              )}
            </div>
          )}

          {/* Activity Feed */}
          {projectView === 'activity' && (
            <div className="p-4 bg-surface border border-border rounded-2xl shadow-apple">
              <div className="space-y-4">
                {project.activity.map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <img src={a.avatar} alt="" className="w-7 h-7 rounded-full object-cover mt-0.5 shadow-apple" />
                    <div>
                      <p className="text-xs text-text-primary">
                        <span className="font-bold">{a.user}</span>{' '}
                        <span className="text-text-secondary">{a.action}</span>{' '}
                        <span className="font-semibold">{a.target}</span>
                      </p>
                      <span className="text-[10px] text-text-secondary/60">{a.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Issue Detail Drawer */}
      <AnimatePresence>
        {selectedIssue && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40" onClick={() => setSelectedIssue(null)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface border-l border-border shadow-apple-floating z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-[10px] font-mono font-bold text-text-secondary bg-muted px-2 py-0.5 rounded">{selectedIssue.id.toUpperCase()}</span>
                <button onClick={() => setSelectedIssue(null)} className="p-2 hover:bg-muted rounded-lg text-text-secondary"><X size={16} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <h3 className="text-lg font-black text-text-primary">{selectedIssue.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{selectedIssue.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Status</span>
                    <p className="text-xs font-semibold text-text-primary mt-1 capitalize">{selectedIssue.status.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Priority</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[selectedIssue.priority] }} />
                      <span className="text-xs font-semibold text-text-primary capitalize">{selectedIssue.priority}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Assignee</span>
                    <div className="flex items-center gap-2 mt-1">
                      <img src={selectedIssue.assignee.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-xs font-semibold text-text-primary">{selectedIssue.assignee.name}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Created</span>
                    <p className="text-xs font-semibold text-text-primary mt-1">{selectedIssue.createdAt}</p>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Labels</span>
                  <div className="flex gap-1.5 flex-wrap mt-1.5">
                    {selectedIssue.labels.map((l) => (
                      <span key={l} className="px-2 py-0.5 text-[10px] font-bold bg-muted border border-border rounded-lg text-text-secondary">{l}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Issue Modal */}
      <AnimatePresence>
        {showNewIssue && project && (
          <NewIssueModal projectId={project.id} onClose={() => setShowNewIssue(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Issue Row ────────────────────────────────────────────────────
const IssueRow: React.FC<{ issue: Issue; onClick: () => void }> = ({ issue, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-3 w-full text-left p-2.5 rounded-xl hover:bg-muted/50 transition-colors">
    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PRIORITY_COLORS[issue.priority] }} />
    <span className="flex-1 text-xs font-semibold text-text-primary truncate">{issue.title}</span>
    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
      issue.status === 'done' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' :
      issue.status === 'in_progress' ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' :
      'text-text-secondary bg-muted'
    }`}>{issue.status.replace('_', ' ')}</span>
    <img src={issue.assignee.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
  </button>
)

// ─── New Issue Modal ──────────────────────────────────────────────
const NewIssueModal: React.FC<{ projectId: string; onClose: () => void }> = ({ projectId, onClose }) => {
  const addIssue = useProjectStore((s) => s.addIssue)
  const project = useProjectStore((s) => s.projects.find((p) => p.id === projectId))
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [priority, setPriority] = useState<Issue['priority']>('medium')
  const [status, setStatus] = useState<Issue['status']>('backlog')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    addIssue(projectId, {
      title, description: desc, status, priority,
      assignee: project?.members[0] ? { name: project.members[0].name, avatar: project.members[0].avatar } : { name: 'Unassigned', avatar: '' },
      labels: [],
    })
    onClose()
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-50" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="fixed inset-x-4 top-10 max-w-lg md:mx-auto md:top-24 bg-surface rounded-2xl border border-border shadow-apple-floating p-6 z-50">
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <h3 className="font-bold text-text-primary text-base">New Issue</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
          <div>
            <label className="text-xs font-bold text-text-secondary block mb-1">Title</label>
            <input value={title} onChange={(e) => { setTitle(e.target.value); setError('') }} className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary" placeholder="Implement feature X" />
          </div>
          <div>
            <label className="text-xs font-bold text-text-secondary block mb-1">Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary min-h-[60px]" placeholder="Add details..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Issue['priority'])} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none text-text-primary">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as Issue['status'])} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none text-text-primary">
                {STATUS_COLS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-border hover:bg-muted text-xs font-semibold text-text-secondary rounded-xl transition-all">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-apple transition-all">Create</button>
          </div>
        </form>
      </motion.div>
    </>
  )
}

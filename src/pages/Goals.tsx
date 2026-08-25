import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Plus, CheckCircle2, Circle, Trophy, Flag, Sparkles,
  Calendar, ArrowUpRight, Flame, Layers, ChevronRight, X, Edit3, Trash2
} from 'lucide-react'
import { useGoalsStore } from '../store/useGoalsStore'
import type { Goal } from '../store/useGoalsStore'

const CATEGORY_COLORS: Record<string, string> = {
  career: '#6366f1',
  finance: '#10b981',
  health: '#f59e0b',
  learning: '#8b5cf6',
  personal: '#ec4899',
}

export const GoalsPage: React.FC = () => {
  const { goals, selectedGoalId, filterCategory, setSelectedGoal, setFilterCategory, addGoal, updateKeyResult, toggleMilestone, deleteGoal } = useGoalsStore()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'okr' | 'vision' | 'timeline'>('dashboard')
  const [showNewGoal, setShowNewGoal] = useState(false)

  const selectedGoal = goals.find((g) => g.id === selectedGoalId) || null

  const filteredGoals = useMemo(() => {
    if (filterCategory === 'all') return goals
    return goals.filter((g) => g.category === filterCategory)
  }, [goals, filterCategory])

  const totalProgress = useMemo(() => {
    if (goals.length === 0) return 0
    return Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
  }, [goals])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <Target size={20} className="text-red-500" />
            Goals & OKRs
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">{goals.length} active goals · {totalProgress}% overall completion rate</p>
        </div>
        <button onClick={() => setShowNewGoal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-apple transition-colors">
          <Plus size={14} /> New Goal
        </button>
      </motion.div>

      {/* Hero Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 flex items-center justify-center font-black text-lg">
            {totalProgress}%
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Overall OKR Score</span>
            <h3 className="text-lg font-black text-text-primary mt-0.5">{goals.filter((g) => g.progress >= 70).length}/{goals.length} On Track</h3>
          </div>
        </div>
        <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center font-black text-lg">
            {goals.reduce((s, g) => s + g.keyResults.length, 0)}
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Key Results</span>
            <h3 className="text-lg font-black text-text-primary mt-0.5">Active Targets</h3>
          </div>
        </div>
        <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center font-black text-lg">
            {goals.reduce((s, g) => s + g.milestones.filter(m => m.completed).length, 0)}
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Completed Milestones</span>
            <h3 className="text-lg font-black text-text-primary mt-0.5">Quarterly Checkpoints</h3>
          </div>
        </div>
        <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/30 text-purple-500 flex items-center justify-center font-black text-lg">
            {goals.reduce((s, g) => s + g.linkedHabits.length, 0)}
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Linked Habits</span>
            <h3 className="text-lg font-black text-text-primary mt-0.5">System Integration</h3>
          </div>
        </div>
      </div>

      {/* Tabs & Category Filter */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex bg-muted/60 rounded-xl border border-border p-0.5">
          {([
            { key: 'dashboard', label: 'Dashboard' },
            { key: 'okr', label: 'OKRs Breakdown' },
            { key: 'vision', label: 'Vision Board' },
            { key: 'timeline', label: 'Timeline' },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                activeTab === t.key ? 'bg-surface text-text-primary shadow-apple' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          {['all', 'career', 'finance', 'health', 'learning', 'personal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-apple'
                  : 'bg-muted/50 text-text-secondary hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Goals Cards */}
            <div className="lg:col-span-2 space-y-4">
              {filteredGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`p-5 rounded-2xl border shadow-apple cursor-pointer transition-all ${
                    selectedGoalId === goal.id
                      ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20'
                      : 'border-border bg-surface hover:shadow-apple-floating'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-apple" style={{ backgroundColor: goal.color }}>
                        {goal.title[0]}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-text-primary">{goal.title}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">{goal.category} · Due {goal.targetDate}</span>
                      </div>
                    </div>
                    <span className="text-lg font-black text-text-primary">{goal.progress}%</span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-2">{goal.description}</p>

                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${goal.progress}%`, backgroundColor: goal.color }} />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-text-secondary">
                    <span>{goal.keyResults.length} Key Results</span>
                    <span>{goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length} Milestones</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Goal Detail Drawer Sidebar */}
            {selectedGoal ? (
              <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">{selectedGoal.category}</span>
                    <h2 className="text-base font-black text-text-primary mt-0.5">{selectedGoal.title}</h2>
                  </div>
                  <button onClick={() => deleteGoal(selectedGoal.id)} className="p-1.5 text-red-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"><Trash2 size={14} /></button>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">{selectedGoal.description}</p>

                {/* Key Results Progress Adjuster */}
                <div>
                  <h4 className="text-xs font-bold text-text-primary mb-3 flex items-center gap-1.5"><Flag size={12} className="text-indigo-500" /> Key Results</h4>
                  <div className="space-y-3">
                    {selectedGoal.keyResults.map((kr) => {
                      const pct = Math.min(100, Math.round((kr.currentValue / kr.targetValue) * 100))
                      return (
                        <div key={kr.id} className="p-3 bg-muted/30 border border-border rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-text-primary">{kr.title}</span>
                            <span className="font-bold text-indigo-600">{kr.currentValue}/{kr.targetValue} {kr.unit}</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={kr.targetValue}
                            value={kr.currentValue}
                            onChange={(e) => updateKeyResult(selectedGoal.id, kr.id, Number(e.target.value))}
                            className="w-full accent-indigo-600 cursor-pointer"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Milestones Checkbox */}
                <div>
                  <h4 className="text-xs font-bold text-text-primary mb-3 flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Milestones</h4>
                  <div className="space-y-2">
                    {selectedGoal.milestones.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => toggleMilestone(selectedGoal.id, m.id)}
                        className="flex items-center gap-2.5 w-full text-left p-2 rounded-xl hover:bg-muted/50 transition-colors"
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${m.completed ? 'bg-emerald-500 border-emerald-500' : 'border-border'}`}>
                          {m.completed && <CheckCircle2 size={10} className="text-white" />}
                        </div>
                        <span className={`text-xs ${m.completed ? 'text-text-secondary line-through' : 'text-text-primary font-medium'}`}>{m.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-surface border border-border rounded-2xl shadow-apple text-center text-text-secondary text-xs">
                Select a goal to view OKR breakdown and adjust progress
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'okr' && (
          <motion.div key="okr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {filteredGoals.map((goal) => (
              <div key={goal.id} className="p-5 bg-surface border border-border rounded-2xl shadow-apple">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: goal.color }}>
                      {goal.title[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">{goal.title}</h3>
                      <span className="text-[10px] font-bold text-text-secondary uppercase">{goal.category}</span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-indigo-600">{goal.progress}%</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {goal.keyResults.map((kr) => (
                    <div key={kr.id} className="p-3 bg-muted/40 border border-border rounded-xl">
                      <p className="text-xs font-semibold text-text-primary mb-1">{kr.title}</p>
                      <p className="text-[10px] text-text-secondary font-mono">{kr.currentValue} / {kr.targetValue} {kr.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'vision' && (
          <motion.div key="vision" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGoals.map((goal) => (
              <div key={goal.id} className="p-6 bg-surface border border-border rounded-2xl shadow-apple flex flex-col justify-between min-h-[200px]" style={{ borderTop: `4px solid ${goal.color}` }}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">{goal.category}</span>
                  <h3 className="text-base font-black text-text-primary mt-1 mb-2">{goal.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{goal.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-text-primary">{goal.progress}% Completed</span>
                  <span className="text-[10px] text-text-secondary">Target: {goal.targetDate}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 bg-surface border border-border rounded-2xl shadow-apple space-y-6">
            {filteredGoals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-4">
                <div className="w-24 text-[10px] font-bold text-text-secondary text-right shrink-0">{goal.targetDate}</div>
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: goal.color }} />
                <div className="flex-1 p-3 bg-muted/30 border border-border rounded-xl">
                  <h4 className="text-xs font-bold text-text-primary">{goal.title}</h4>
                  <p className="text-[10px] text-text-secondary">{goal.progress}% completed · {goal.keyResults.length} key results</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Goal Modal */}
      <AnimatePresence>
        {showNewGoal && (
          <NewGoalModal onClose={() => setShowNewGoal(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

const NewGoalModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const addGoal = useGoalsStore((s) => s.addGoal)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [category, setCategory] = useState<Goal['category']>('career')
  const [targetDate, setTargetDate] = useState('2026-12-31')
  const [color, setColor] = useState('#6366f1')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addGoal({
      title,
      description: desc,
      category,
      status: 'in_progress',
      targetDate,
      color,
      icon: 'Target',
      keyResults: [],
      milestones: [],
      linkedHabits: [],
    })
    onClose()
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-50" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="fixed inset-x-4 top-10 max-w-lg md:mx-auto md:top-24 bg-surface rounded-2xl border border-border shadow-apple-floating p-6 z-50">
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <h3 className="font-bold text-text-primary text-base">New Goal</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-text-secondary block mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none text-text-primary" placeholder="Master Full Stack System Architecture" />
          </div>
          <div>
            <label className="text-xs font-bold text-text-secondary block mb-1">Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none text-text-primary min-h-[60px]" placeholder="Add context..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Goal['category'])} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none text-text-primary">
                <option value="career">Career</option>
                <option value="finance">Finance</option>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
                <option value="personal">Personal</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Target Date</label>
              <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none text-text-primary" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-border hover:bg-muted text-xs font-semibold text-text-secondary rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-apple">Create Goal</button>
          </div>
        </form>
      </motion.div>
    </>
  )
}

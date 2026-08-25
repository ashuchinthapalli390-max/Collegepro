import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/useAuthStore'
import { 
  Sparkles, CheckSquare, Flame, Wallet, Calendar, 
  FileText, Heart, GraduationCap, ChevronRight, CheckCircle2 
} from 'lucide-react'

type OnboardingStep = 'greeting' | 'role' | 'modules' | 'loading'

export const Welcome: React.FC = () => {
  const navigate = useNavigate()
  const { user, updateOnboarding } = useAuthStore()
  const [step, setStep] = useState<OnboardingStep>('greeting')
  const [role, setRole] = useState<'student' | 'professional' | 'business' | 'freelancer' | 'custom'>('professional')
  const [selectedModules, setSelectedModules] = useState<string[]>(['Tasks', 'Habits', 'Finance'])

  const roles = [
    { id: 'student', title: 'Student', desc: 'Manage exam logs, study planners, and hydration logs.', icon: <GraduationCap size={18} /> },
    { id: 'professional', title: 'Professional', desc: 'Sync work sprints, tasks backlog, and note boards.', icon: <CheckSquare size={18} /> },
    { id: 'business', title: 'Business Owner', desc: 'Track business ledgers, budget lines, and project milestones.', icon: <Wallet size={18} /> },
    { id: 'freelancer', title: 'Freelancer', desc: 'Manage project delivery, invoices, and focus blocks.', icon: <Sparkles size={18} /> },
    { id: 'custom', title: 'Custom Fit', desc: 'Assemble individual custom settings tools.', icon: <Heart size={18} /> },
  ] as const

  const modules = [
    { id: 'Tasks', name: 'Task Management', desc: 'Backlog, Kanban, and Table views.', icon: <CheckSquare className="text-indigo-500" /> },
    { id: 'Habits', name: 'Habit Tracker', desc: 'Streaks XP and heatmaps.', icon: <Flame className="text-amber-500" /> },
    { id: 'Finance', name: 'Money Management', desc: 'Ledger income, expenses, and budgets.', icon: <Wallet className="text-emerald-500" /> },
    { id: 'Calendar', name: 'Calendar Schedule', desc: 'Timebox slots and appointments planner.', icon: <Calendar className="text-blue-500" /> },
    { id: 'Notes', name: 'Notes & Outlines', desc: 'Notion slash edits and markdown exports.', icon: <FileText className="text-slate-500" /> },
  ]

  const handleToggleModule = (modId: string) => {
    setSelectedModules((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    )
  }

  const triggerWorkspacePreparation = () => {
    setStep('loading')
    // Save onboarding selections in auth store
    updateOnboarding(role, selectedModules)

    // Simulate setup delay
    setTimeout(() => {
      navigate('/dashboard')
    }, 2500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 select-none overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 'greeting' && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg glass-panel p-8 rounded-3xl border border-border shadow-apple-floating text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl">
                <Sparkles className="w-10 h-10 text-indigo-500 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                Welcome to LifeOS, {user?.fullName || 'Varun'}
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-medium">
                Let's configure your workspace parameters to align with your focus needs. This only takes a minute.
              </p>
            </div>
            <button
              onClick={() => setStep('role')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-apple transition-colors flex items-center justify-center gap-2 text-xs"
            >
              <span>Setup Workspace</span>
              <ChevronRight size={14} />
            </button>
          </motion.div>
        )}

        {step === 'role' && (
          <motion.div
            key="role"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-xl glass-panel p-8 rounded-3xl border border-border shadow-apple-floating space-y-6"
          >
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">Step 1 of 2</span>
              <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                Select your focus profile
              </h2>
              <p className="text-xs text-text-secondary">
                We will pre-load configurations matching your routine goals.
              </p>
            </div>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {roles.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    role === item.id 
                      ? 'border-indigo-500 bg-indigo-50/15 dark:bg-indigo-950/20' 
                      : 'border-border/80 bg-muted/20 hover:bg-muted/50'
                  }`}
                >
                  <div className={`p-2 rounded-xl border transition-colors ${
                    role === item.id 
                      ? 'bg-indigo-500 text-white border-indigo-500' 
                      : 'bg-surface text-text-secondary border-border'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-text-primary">{item.title}</span>
                    <span className="text-[10px] text-text-secondary truncate">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('modules')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-apple transition-colors flex items-center justify-center gap-2 text-xs"
            >
              <span>Continue</span>
              <ChevronRight size={14} />
            </button>
          </motion.div>
        )}

        {step === 'modules' && (
          <motion.div
            key="modules"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-xl glass-panel p-8 rounded-3xl border border-border shadow-apple-floating space-y-6"
          >
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">Step 2 of 2</span>
              <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                Preferred workspace modules
              </h2>
              <p className="text-xs text-text-secondary">
                Turn on the modules you wish to activate on your left sidebar menu.
              </p>
            </div>

            <div className="space-y-2.5">
              {modules.map((item) => {
                const isActive = selectedModules.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleModule(item.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isActive 
                        ? 'border-indigo-500 bg-indigo-50/15 dark:bg-indigo-950/20' 
                        : 'border-border/80 bg-muted/20 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="p-2 rounded-xl bg-surface border border-border shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-text-primary">{item.name}</span>
                        <span className="text-[10px] text-text-secondary truncate">{item.desc}</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-border'
                    }`}>
                      {isActive && <CheckCircle2 size={12} className="stroke-[3]" />}
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={triggerWorkspacePreparation}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-apple transition-colors flex items-center justify-center gap-2 text-xs"
            >
              <span>Build My Workspace</span>
              <ChevronRight size={14} />
            </button>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm glass-panel p-8 rounded-3xl border border-border shadow-apple-floating text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full dark:border-indigo-950/40" />
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-text-primary">Preparing Sandbox Environment...</h3>
              <p className="text-[10px] text-text-secondary">Encrypting local cache database and mapping active modules.</p>
            </div>
            
            {/* Simulation feedback items loading */}
            <div className="space-y-1.5 text-left text-[9px] font-bold text-text-secondary/70 bg-muted/30 p-3 rounded-xl border border-border/80">
              <div className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                <span>Generating secure keys... Done</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                <span>Injecting mock databases... Done</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/40" />
                <span>Starting LifeOS shell...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

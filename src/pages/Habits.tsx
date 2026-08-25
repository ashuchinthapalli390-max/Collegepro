import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Flame, Plus, Check, Sparkles, Trophy, Award, 
  Trash2, X, AlertCircle, ChevronRight
} from 'lucide-react'
import { useHabitStore } from '../store/useHabitStore'
import type { Habit, Challenge, Achievement } from '../store/useHabitStore'

export const HabitsPage: React.FC = () => {
  const { 
    habits, xp, level, coins, achievements, challenges, 
    toggleHabit, addHabit, deleteHabit, claimDailyQuest 
  } = useHabitStore()
  
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'habits' | 'challenges' | 'achievements'>('habits')

  // Form Fields State
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Habit['category']>('productivity')
  const [difficulty, setDifficulty] = useState<Habit['difficulty']>('medium')
  const [targetCount, setTargetCount] = useState('1')
  const [error, setError] = useState('')

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Habit name is required')
      return
    }

    addHabit({
      name,
      description,
      category,
      difficulty,
      targetFrequency: 'daily',
      reminderTime: '08:00 AM',
      targetCount: Number(targetCount) || 1,
    })

    setIsCreateOpen(false)
    setName('')
    setDescription('')
    setError('')
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const completedTodayCount = habits.filter((h) => h.history[todayStr] === 'completed').length

  return (
    <div className="space-y-6 select-none relative">
      
      {/* Top Header stats */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary">Habit Tracker</h2>
          <div className="flex items-center gap-2 text-xs text-text-secondary font-medium mt-0.5">
            <span>Completed Today: <span className="text-amber-500 font-bold">{completedTodayCount} / {habits.length}</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex bg-muted p-1 rounded-xl border border-border">
            {[
              { id: 'habits', label: 'My Habits' },
              { id: 'challenges', label: 'Challenges' },
              { id: 'achievements', label: 'Achievements' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                  activeTab === tab.id 
                    ? 'bg-surface text-amber-600 dark:text-amber-400 shadow-apple' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-apple transition-colors"
          >
            <Plus size={14} />
            <span>New Habit</span>
          </button>
        </div>
      </section>

      {/* Gamification Level Summary Panel */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-surface border border-border rounded-2xl shadow-apple flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl text-amber-500 shrink-0">
            <Trophy size={20} />
          </div>
          <div className="flex-1 space-y-1">
            <span className="text-[10px] text-text-secondary font-bold uppercase block">Character Level</span>
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-text-primary">LEVEL {level}</span>
              <span className="text-text-secondary/60 font-semibold">{xp} / {level * 300} XP</span>
            </div>
            <div className="h-1.5 bg-muted border border-border/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${(xp / (level * 300)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-surface border border-border rounded-2xl shadow-apple flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl text-indigo-500 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="text-[10px] text-text-secondary font-bold uppercase block mb-0.5">LifeOS Coins</span>
            <h4 className="text-lg font-black text-text-primary">{coins} COINS</h4>
            <span className="text-[9px] text-text-secondary">Spend on upcoming customization items</span>
          </div>
        </div>

        {/* Claim daily quest indicator */}
        <div 
          onClick={claimDailyQuest}
          className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl shadow-apple flex items-center justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <span className="text-[9px] text-white/80 font-bold uppercase block">Daily Quest Active</span>
            <h4 className="text-xs font-bold">Check off all items today</h4>
            <span className="text-[9px] text-white/70">Claim bonus +50 XP and +15 Coins</span>
          </div>
          <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </section>

      {/* Main tab content views */}
      <section className="min-h-[50vh]">
        <AnimatePresence mode="wait">
          {activeTab === 'habits' && (
            <motion.div 
              key="habits"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* GitHub style contributions Heatmap */}
              <div className="p-5 bg-surface border border-border rounded-3xl shadow-apple space-y-3.5">
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Consistency Heatmap (Last 90 Days)</h3>
                  <span className="text-[9px] text-text-secondary/60">Hover blocks for status logs</span>
                </div>
                <div className="flex flex-wrap gap-1 md:gap-1.5 justify-center py-2">
                  {[...Array(60)].map((_, idx) => {
                    const d = new Date()
                    d.setDate(d.getDate() - (59 - idx))
                    const dateStr = d.toISOString().split('T')[0]
                    
                    // Simple check across all habits to count consistency
                    const completedCount = habits.filter(h => h.history[dateStr] === 'completed').length
                    const color = completedCount >= 3 
                      ? 'bg-emerald-500' 
                      : completedCount >= 1 
                      ? 'bg-emerald-300 dark:bg-emerald-700/60' 
                      : 'bg-muted border border-border/60'

                    return (
                      <div 
                        key={idx}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded ${color} transition-colors`}
                        title={`${dateStr}: ${completedCount} habits completed`}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Habit Checklist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map((habit) => {
                  const completed = habit.history[todayStr] === 'completed'
                  return (
                    <motion.div
                      key={habit.id}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedHabit(habit)}
                      className="p-5 bg-surface border border-border rounded-3xl shadow-apple hover:shadow-apple-floating transition-all cursor-pointer flex flex-col justify-between min-h-[180px] relative overflow-hidden group"
                    >
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase ${
                            habit.category === 'health' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20' : 
                            habit.category === 'fitness' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' :
                            habit.category === 'learning' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20' : 
                            'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                          }`}>
                            {habit.category}
                          </span>
                          <span className="text-[10px] text-text-secondary/60">Reminder: {habit.reminderTime}</span>
                        </div>

                        <h3 className="text-sm font-bold text-text-primary tracking-tight">{habit.name}</h3>
                        <p className="text-[11px] text-text-secondary leading-normal line-clamp-2">{habit.description}</p>
                      </div>

                      <div className="flex justify-between items-center border-t border-border/80 pt-3.5 mt-4">
                        <div className="flex items-center gap-1 font-bold text-xs text-amber-500">
                          <Flame size={14} className="animate-pulse" />
                          <span>{habit.currentStreak}d Streak</span>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleHabit(habit.id, todayStr)
                          }}
                          className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                            completed 
                              ? 'bg-amber-500 border-amber-500 text-white' 
                              : 'border-border bg-surface text-text-secondary hover:bg-muted'
                          }`}
                        >
                          {completed ? <Check size={14} className="stroke-[3]" /> : <Plus size={14} />}
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'challenges' && (
            <motion.div 
              key="challenges"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {challenges.map((ch) => (
                <div key={ch.id} className="p-5 bg-surface border border-border rounded-3xl shadow-apple space-y-4">
                  <div className="flex items-center justify-between border-b border-border/80 pb-3">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Active Challenge</span>
                    {ch.completed ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase">Completed</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[9px] uppercase">Ongoing</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-text-primary">{ch.title}</h3>
                  <p className="text-xs text-text-secondary leading-normal">{ch.description}</p>
                  
                  {/* Progress Indicator */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between items-center text-[10px] text-text-secondary font-semibold">
                      <span>Progress</span>
                      <span>{ch.progressDays} / {ch.durationDays} Days</span>
                    </div>
                    <div className="h-2 bg-muted border border-border/80 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${(ch.progressDays / ch.durationDays) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div 
              key="achievements"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {achievements.map((ach) => (
                <div 
                  key={ach.id} 
                  className={`p-4 border rounded-2xl text-center flex flex-col items-center justify-center space-y-3 ${
                    ach.unlocked 
                      ? 'bg-surface border-border shadow-apple' 
                      : 'bg-muted/30 border-border/40 opacity-60'
                  }`}
                >
                  <div className={`p-3 rounded-xl border ${
                    ach.unlocked 
                      ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500 border-amber-200' 
                      : 'bg-muted text-text-secondary border-border'
                  }`}>
                    <Award size={20} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-text-primary block">{ach.title}</span>
                    <span className="text-[10px] text-text-secondary block leading-normal">{ach.description}</span>
                  </div>
                  {ach.unlocked && (
                    <span className="text-[9px] text-text-secondary/60 block font-semibold">Unlocked {ach.unlockedAt}</span>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Habit Details side drawer */}
      <AnimatePresence>
        {selectedHabit && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSelectedHabit(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-surface z-50 p-6 flex flex-col shadow-apple-floating"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4 shrink-0">
                <span className="text-xs font-bold text-text-secondary uppercase">Habit Detail</span>
                <button onClick={() => setSelectedHabit(null)} className="text-text-secondary hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-1 text-left">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-text-primary tracking-tight leading-snug">{selectedHabit.name}</h3>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{selectedHabit.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/20 border border-border/80 text-xs">
                  <div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase block mb-1">Difficulty</span>
                    <span className="capitalize font-bold text-text-primary">{selectedHabit.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase block mb-1">Best Streak</span>
                    <span className="font-bold text-text-primary">{selectedHabit.longestStreak} Days</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase block mb-1">Completion Rate</span>
                    <span className="font-bold text-text-primary">{selectedHabit.completionRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase block mb-1">XP Value</span>
                    <span className="font-bold text-text-primary">
                      +{selectedHabit.difficulty === 'easy' ? 10 : selectedHabit.difficulty === 'medium' ? 20 : 35} XP
                    </span>
                  </div>
                </div>

                {/* Subtask / Habit calendar logs */}
                <div>
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5">Check-In Log</h4>
                  <div className="space-y-2">
                    {Object.keys(selectedHabit.history).slice(0, 7).map((d) => (
                      <div key={d} className="flex justify-between items-center text-xs p-2 bg-muted/20 border border-border/60 rounded-xl">
                        <span className="font-semibold text-text-primary">{d}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold uppercase">
                          Completed
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    deleteHabit(selectedHabit.id)
                    setSelectedHabit(null)
                  }}
                  className="w-full py-2.5 border border-red-200 dark:border-red-950/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/15 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>Delete Habit</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Habit Creation Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsCreateOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="fixed inset-x-4 top-10 max-w-lg md:mx-auto md:top-24 bg-surface rounded-2xl border border-border shadow-apple-floating p-6 z-50"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <h3 className="font-bold text-text-primary text-base">New Habit</h3>
                <button onClick={() => setIsCreateOpen(false)} className="text-text-secondary hover:text-text-primary">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateHabit} className="space-y-4">
                {error && (
                  <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500 text-xs font-semibold flex items-center gap-1.5 border border-red-100 dark:border-red-950/40">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Habit Title</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => { setName(e.target.value); setError('') }}
                    className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none placeholder:text-text-secondary/50 text-text-primary"
                    placeholder="Drink 3L Water"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Description</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none placeholder:text-text-secondary/50 min-h-[70px] text-text-primary"
                    placeholder="Brief motivations notes..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Category</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary"
                    >
                      <option value="productivity">Productivity</option>
                      <option value="health">Health</option>
                      <option value="fitness">Fitness</option>
                      <option value="learning">Learning</option>
                      <option value="mindfulness">Mindfulness</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Difficulty</label>
                    <select 
                      value={difficulty} 
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Target Daily Count</label>
                  <input 
                    type="number" 
                    value={targetCount} 
                    onChange={(e) => setTargetCount(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary"
                    placeholder="1"
                    min="1"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 border border-border hover:bg-muted text-xs font-semibold text-text-secondary rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-apple transition-all"
                  >
                    Create Habit
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

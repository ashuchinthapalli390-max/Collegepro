import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ReactFlow, Background, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { 
  Plus, Search, Calendar as CalendarIcon, CheckSquare, 
  Trash2, X, Pin
} from 'lucide-react'
import { useTaskStore } from '../store/useTaskStore'
import type { Task } from '../store/useTaskStore'
import { useAuthStore } from '../store/useAuthStore'

// Zod Task validation schema
const taskValidationSchema = z.object({
  name: z.string().min(2, 'Task title is required and must be at least 2 characters'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  category: z.enum(['work', 'personal', 'study', 'fitness', 'finance', 'shopping']),
  dueDate: z.string().min(1, 'Due date is required'),
  estimatedTime: z.string().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
    message: 'Must be a positive number',
  }),
})

type TaskFormInputs = z.infer<typeof taskValidationSchema>

export const TasksPage: React.FC = () => {
  const { 
    tasks, currentView, setView, sortBy, setSortBy, filters, setFilters, 
    addTask, deleteTask, updateTask, toggleSubtask, addComment, pinTask,
    timeTracking, startTimer, pauseTimer, stopTimer 
  } = useTaskStore()
  const { user } = useAuthStore()

  // Modals & Panels State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [commentInput, setCommentInput] = useState('')

  // Validation Form Setup
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormInputs>({
    defaultValues: {
      name: '',
      description: '',
      priority: 'medium',
      category: 'work',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedTime: '',
    }
  })

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus Search: F key (when not typing in inputs)
      if (e.key.toLowerCase() === 'f' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        const searchInput = document.getElementById('task-search')
        searchInput?.focus()
      }
      // New Task: N key
      if (e.key.toLowerCase() === 'n' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        setIsCreateOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filter and Sort implementation
  const processedTasks = tasks
    .filter((task) => {
      const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory
      return matchesSearch && matchesPriority && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { urgent: 0, high: 1, medium: 2, low: 3 }
        return order[a.priority] - order[b.priority]
      }
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      if (sortBy === 'progress') {
        return b.progress - a.progress
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const handleCreateTask = (data: TaskFormInputs) => {
    addTask({
      name: data.name,
      description: data.description || '',
      priority: data.priority,
      status: 'todo',
      category: data.category,
      dueDate: data.dueDate,
      estimatedTime: data.estimatedTime ? Number(data.estimatedTime) : undefined,
      actualTime: 0,
      progress: 0,
      subtasks: [],
      dependencies: { blockedBy: [], blocking: [] },
      tags: [data.category.toUpperCase()],
      assignee: { name: user?.fullName || 'Varun', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80' },
    })
    setIsCreateOpen(false)
    reset()
  }

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentInput.trim() || !selectedTask) return
    addComment(selectedTask.id, commentInput, user?.fullName || 'Varun')
    setCommentInput('')
    // Refresh side drawer reference
    const updated = tasks.find((t) => t.id === selectedTask.id)
    if (updated) setSelectedTask(updated)
  }

  // Count metrics
  const pendingCount = tasks.filter((t) => t.status !== 'completed').length
  const completedCount = tasks.filter((t) => t.status === 'completed').length

  return (
    <div className="space-y-6 select-none relative">
      
      {/* Top Header stats */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary">Task Management</h2>
          <div className="flex items-center gap-2 text-xs text-text-secondary font-medium mt-0.5">
            <span>Pending: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{pendingCount}</span></span>
            <span className="text-border">•</span>
            <span>Completed: <span className="text-emerald-500 font-bold">{completedCount}</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switching Tabs */}
          <div className="flex bg-muted p-1 rounded-xl border border-border">
            {(['list', 'kanban', 'calendar', 'table', 'mindmap'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setView(view)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                  currentView === view 
                    ? 'bg-surface text-indigo-600 dark:text-indigo-400 shadow-apple' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-apple transition-colors"
          >
            <Plus size={14} />
            <span>Add Task</span>
          </button>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="flex flex-col sm:flex-row gap-3 bg-surface p-4 rounded-2xl border border-border shadow-apple">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-2.5 text-text-secondary" />
          <input 
            type="text"
            id="task-search"
            placeholder="Search task index... (Press 'F')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-muted/40 border border-border/80 focus:border-indigo-500 rounded-xl text-xs focus:outline-none transition-all placeholder:text-text-secondary/50 text-text-primary"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none text-text-primary"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none text-text-primary"
          >
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="fitness">Fitness</option>
            <option value="finance">Finance</option>
            <option value="personal">Personal</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none text-text-primary"
          >
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="progress">Sort by Progress</option>
            <option value="createdAt">Sort by Created</option>
          </select>
        </div>
      </section>

      {/* Active View Render */}
      <section className="min-h-[50vh]">
        <AnimatePresence mode="wait">
          {currentView === 'list' && (
            <motion.div 
              key="list" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="space-y-2.5"
            >
              {processedTasks.length === 0 ? (
                <EmptyTasksState />
              ) : (
                processedTasks.map((task) => (
                  <TaskListItem 
                    key={task.id} 
                    task={task} 
                    onOpen={() => setSelectedTask(task)} 
                    onDelete={() => deleteTask(task.id)}
                    onToggleSub={(subId) => toggleSubtask(task.id, subId)}
                    onPin={() => pinTask(task.id)}
                  />
                ))
              )}
            </motion.div>
          )}

          {currentView === 'kanban' && (
            <motion.div 
              key="kanban" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {(['todo', 'in_progress', 'review', 'completed'] as const).map((status) => {
                const statusTasks = processedTasks.filter((t) => t.status === status)
                return (
                  <div key={status} className="bg-surface p-4 border border-border rounded-2xl flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between border-b border-border pb-2.5 mb-3">
                      <span className="text-xs font-bold text-text-primary uppercase tracking-wider">{status.replace('_', ' ')}</span>
                      <span className="px-2 py-0.5 text-[9px] bg-muted border border-border rounded-full font-bold text-text-secondary">
                        {statusTasks.length}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto">
                      {statusTasks.map((task) => (
                        <div 
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className="p-3.5 bg-muted/20 border border-border/80 rounded-xl hover:bg-muted/40 transition-all cursor-pointer shadow-apple space-y-3"
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-xs font-bold text-text-primary leading-snug line-clamp-2">{task.name}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 ${
                              task.priority === 'urgent' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-text-secondary line-clamp-2">{task.description}</p>
                          
                          <div className="flex justify-between items-center pt-2 border-t border-border/60 text-[9px] text-text-secondary">
                            <span>Due {task.dueDate}</span>
                            <span className="font-bold text-text-primary">{task.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}

          {currentView === 'calendar' && (
            <motion.div 
              key="calendar" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="bg-surface p-6 border border-border rounded-3xl shadow-apple text-center"
            >
              <CalendarIcon className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-text-primary mb-2">Calendar Schedule View</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
                Drag-and-drop tasks onto agenda date blocks to instantly re-plan sprints.
              </p>
              <div className="grid grid-cols-7 gap-2 max-w-2xl mx-auto pt-4 border-t border-border">
                {[...Array(31)].map((_, idx) => {
                  const dayTasks = tasks.filter(t => new Date(t.dueDate).getDate() === idx + 1)
                  return (
                    <div key={idx} className="aspect-square border border-border/80 rounded-xl p-1 flex flex-col justify-between hover:bg-muted/30">
                      <span className="text-[10px] font-bold text-text-secondary">{idx + 1}</span>
                      {dayTasks.length > 0 && (
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 self-center" />
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {currentView === 'table' && (
            <motion.div 
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-surface border border-border rounded-2xl shadow-apple overflow-x-auto"
            >
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-text-secondary font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3.5">Task</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Due Date</th>
                    <th className="p-3.5">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {processedTasks.map((task) => (
                    <tr 
                      key={task.id} 
                      onClick={() => setSelectedTask(task)}
                      className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                    >
                      <td className="p-3.5 font-bold text-text-primary">{task.name}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          task.priority === 'urgent' ? 'bg-red-50 text-red-600' : 'bg-muted text-text-secondary'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-3.5 capitalize font-semibold">{task.status.replace('_', ' ')}</td>
                      <td className="p-3.5 capitalize">{task.category}</td>
                      <td className="p-3.5">{task.dueDate}</td>
                      <td className="p-3.5 font-bold text-text-primary">{task.progress}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {currentView === 'mindmap' && (
            <motion.div 
              key="mindmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[500px] border border-border rounded-3xl overflow-hidden bg-surface relative"
            >
              <ReactFlow
                nodes={[
                  { id: '1', data: { label: 'LifeOS Workspace' }, position: { x: 250, y: 5 }, style: { background: 'var(--primary)', color: '#fff', fontWeight: 'bold', borderRadius: '10px' } },
                  { id: '2', data: { label: 'Tasks' }, position: { x: 100, y: 100 }, style: { border: '1px solid var(--border)', borderRadius: '10px' } },
                  { id: '3', data: { label: 'Habits' }, position: { x: 400, y: 100 }, style: { border: '1px solid var(--border)', borderRadius: '10px' } },
                  { id: '4', data: { label: 'Microservices Setup' }, position: { x: 20, y: 200 }, style: { fontSize: '10px', width: '150px' } },
                  { id: '5', data: { label: 'Landing UI Polish' }, position: { x: 190, y: 200 }, style: { fontSize: '10px', width: '150px' } },
                ]}
                edges={[
                  { id: 'e1-2', source: '1', target: '2', animated: true },
                  { id: 'e1-3', source: '1', target: '3', animated: true },
                  { id: 'e2-4', source: '2', target: '4' },
                  { id: 'e2-5', source: '2', target: '5' },
                ]}
                fitView
              >
                <Background />
                <Controls />
              </ReactFlow>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Task Details Drawer */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSelectedTask(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-surface z-50 p-6 flex flex-col shadow-apple-floating"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4 shrink-0">
                <button
                  onClick={() => pinTask(selectedTask.id)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    selectedTask.isPinned ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'border-border hover:bg-muted'
                  }`}
                >
                  <Pin size={16} />
                </button>
                <button onClick={() => setSelectedTask(null)} className="text-text-secondary hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-text-primary tracking-tight leading-snug">{selectedTask.name}</h3>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{selectedTask.description}</p>
                </div>

                {/* Task Parameters Table */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/20 border border-border/80 text-xs">
                  <div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase block mb-1">Priority</span>
                    <span className="capitalize font-bold text-text-primary">{selectedTask.priority}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase block mb-1">Category</span>
                    <span className="capitalize font-bold text-text-primary">{selectedTask.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase block mb-1">Due Date</span>
                    <span className="font-bold text-text-primary">{selectedTask.dueDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase block mb-1">Estimated Hours</span>
                    <span className="font-bold text-text-primary">{selectedTask.estimatedTime || 'N/A'} hrs</span>
                  </div>
                </div>

                {/* Subtasks tree */}
                <div>
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5">Subtasks Checklist</h4>
                  {selectedTask.subtasks.length === 0 ? (
                    <span className="text-xs text-text-secondary block italic">No subtasks created.</span>
                  ) : (
                    <div className="space-y-2">
                      {selectedTask.subtasks.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2.5 text-xs text-text-primary select-none">
                          <input
                            type="checkbox"
                            checked={sub.completed}
                            onChange={() => {
                              toggleSubtask(selectedTask.id, sub.id)
                              // Refresh drawer state
                              const updated = tasks.find(t => t.id === selectedTask.id)
                              if (updated) setSelectedTask(updated)
                            }}
                            className="w-4 h-4 rounded border-border accent-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span className={sub.completed ? 'line-through text-text-secondary' : 'font-medium'}>
                            {sub.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comments threaded list */}
                <div>
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5">Comments</h4>
                  <div className="space-y-3 mb-4">
                    {selectedTask.comments.map((c) => (
                      <div key={c.id} className="p-3 bg-muted/20 border border-border/80 rounded-2xl space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-text-primary">{c.userName}</span>
                          <span className="text-text-secondary/60">{c.timestamp}</span>
                        </div>
                        <p className="text-xs text-text-secondary leading-normal">{c.content}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handlePostComment} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add comment context..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-muted/40 border border-border focus:border-indigo-500 rounded-xl text-xs focus:outline-none text-text-primary"
                    />
                    <button 
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-apple transition-colors"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Task Creation Modal */}
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
              className="fixed inset-x-4 top-10 max-w-lg md:mx-auto md:top-20 bg-surface rounded-2xl border border-border shadow-apple-floating p-6 z-50 overflow-y-auto max-h-[85vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <h3 className="font-bold text-text-primary text-base">Create New Task</h3>
                <button onClick={() => setIsCreateOpen(false)} className="text-text-secondary hover:text-text-primary">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleCreateTask)} className="space-y-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary block">Task Title</label>
                  <input 
                    type="text"
                    {...register('name')}
                    placeholder="Complete Hibernate config schema mappings"
                    className={`w-full px-3.5 py-2.5 bg-muted/40 border rounded-xl text-sm focus:outline-none transition-all placeholder:text-text-secondary/50 text-text-primary ${
                      errors.name ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-indigo-500'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-[10px] text-red-500 font-semibold">{errors.name.message}</span>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary block">Description</label>
                  <textarea 
                    {...register('description')}
                    placeholder="Provide context and dependency files mappings..."
                    className="w-full px-3.5 py-2 bg-muted/40 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none placeholder:text-text-secondary/50 min-h-[80px] text-text-primary"
                  />
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary block">Priority</label>
                    <select 
                      {...register('priority')}
                      className="w-full px-3.5 py-2 bg-muted/40 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary block">Category</label>
                    <select 
                      {...register('category')}
                      className="w-full px-3.5 py-2 bg-muted/40 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary"
                    >
                      <option value="work">Work</option>
                      <option value="study">Study</option>
                      <option value="fitness">Fitness</option>
                      <option value="finance">Finance</option>
                      <option value="shopping">Shopping</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                </div>

                {/* Grid Inputs 2 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary block">Due Date</label>
                    <input 
                      type="date"
                      {...register('dueDate')}
                      className={`w-full px-3.5 py-2 bg-muted/40 border rounded-xl text-sm focus:outline-none text-text-primary ${
                        errors.dueDate ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-indigo-500'
                      }`}
                    />
                    {errors.dueDate && (
                      <span className="text-[10px] text-red-500 font-semibold">{errors.dueDate.message}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary block">Est. Hours</label>
                    <input 
                      type="text"
                      {...register('estimatedTime')}
                      placeholder="e.g. 6"
                      className={`w-full px-3.5 py-2 bg-muted/40 border rounded-xl text-sm focus:outline-none text-text-primary ${
                        errors.estimatedTime ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-indigo-500'
                      }`}
                    />
                    {errors.estimatedTime && (
                      <span className="text-[10px] text-red-500 font-semibold">{errors.estimatedTime.message}</span>
                    )}
                  </div>
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
                    Save Task
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

// Subcomponent: Task List Item
interface TaskListItemProps {
  task: Task
  onOpen: () => void
  onDelete: () => void
  onToggleSub: (subId: string) => void
  onPin: () => void
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, onOpen, onDelete, onToggleSub, onPin }) => {
  return (
    <motion.div 
      layout
      className="p-4 bg-surface border border-border rounded-2xl hover:border-indigo-500 transition-all flex items-center justify-between gap-4 cursor-pointer group shadow-apple"
      onClick={onOpen}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 ${
          task.priority === 'urgent' 
            ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400' 
            : task.priority === 'high' 
            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
            : 'bg-muted text-text-secondary'
        }`}>
          {task.priority}
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-text-primary truncate">{task.name}</span>
          <span className="text-[10px] text-text-secondary truncate">{task.description}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* Statistics info badges */}
        {task.subtasks.length > 0 && (
          <span className="text-[9px] font-bold text-text-secondary bg-muted px-2 py-0.5 rounded-full border border-border/80">
            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
          </span>
        )}

        <span className="text-[9px] font-semibold text-text-secondary/60">
          Due {task.dueDate}
        </span>

        {/* Action Triggers */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onPin}
            className={`p-1.5 rounded-lg border transition-colors ${
              task.isPinned ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'border-border bg-surface text-text-secondary hover:bg-muted'
            }`}
          >
            <Pin size={12} />
          </button>
          <button 
            onClick={onDelete}
            className="p-1.5 rounded-lg border border-border bg-surface text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const EmptyTasksState: React.FC = () => {
  return (
    <div className="text-center py-12 bg-surface border border-border rounded-3xl shadow-apple max-w-sm mx-auto space-y-4">
      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 rounded-full flex items-center justify-center mx-auto text-indigo-500">
        <CheckSquare size={24} />
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-text-primary">No tasks matched your indexes</h3>
        <p className="text-[10px] text-text-secondary">Try searching for other tags or add a new checklist item.</p>
      </div>
    </div>
  )
}

import { create } from 'zustand'

export interface Comment {
  id: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  name: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'completed'
  category: 'work' | 'personal' | 'study' | 'fitness' | 'finance' | 'shopping'
  tags: string[]
  dueDate: string
  startDate?: string
  assignee: { name: string; avatar: string }
  estimatedTime?: number // In hours
  actualTime?: number // In hours
  progress: number // Percentage
  subtasks: Subtask[]
  dependencies: { blockedBy: string[]; blocking: string[] }
  comments: Comment[]
  attachments: { id: string; name: string; type: string; url: string; size: string }[]
  createdAt: string
  isPinned?: boolean
}

type TaskView = 'list' | 'kanban' | 'calendar' | 'timeline' | 'table' | 'mindmap' | 'gantt'

interface TaskFilters {
  priority: string
  status: string
  category: string
  tag: string
  search: string
  overdue: boolean
}

interface TaskState {
  tasks: Task[]
  currentView: TaskView
  filters: TaskFilters
  sortBy: 'priority' | 'dueDate' | 'createdAt' | 'estimatedTime' | 'progress' | 'status'
  timeTracking: {
    trackingTaskId: string | null
    isTrackingActive: boolean
    elapsedSeconds: number
    todayTimeSeconds: number
    weeklyTimeSeconds: number
  }
  setView: (view: TaskView) => void
  setFilters: (filters: Partial<TaskFilters>) => void
  setSortBy: (sortBy: TaskState['sortBy']) => void
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'comments' | 'attachments'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  addComment: (taskId: string, content: string, userName: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  startTimer: (taskId: string) => void
  pauseTimer: () => void
  stopTimer: () => void
  tickTimer: () => void
  pinTask: (taskId: string) => void
}

const mockTasks: Task[] = [
  {
    id: 't1',
    name: 'Complete Java Full Stack Roadmap',
    description: 'Read Spring Boot docs, study Hibernate mappings, and build a containerized microservices dashboard using Kubernetes.',
    priority: 'urgent',
    status: 'in_progress',
    category: 'study',
    tags: ['Backend', 'Java', 'Sprint Boot'],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
    startDate: new Date().toISOString().split('T')[0],
    assignee: { name: 'Varun', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80' },
    estimatedTime: 24,
    actualTime: 12,
    progress: 50,
    subtasks: [
      { id: 'st1', title: 'Study Hibernate entity relations', completed: true },
      { id: 'st2', title: 'Implement Spring Security configuration', completed: true },
      { id: 'st3', title: 'Dockerize databases & configure yaml environments', completed: false },
      { id: 'st4', title: 'Set up Kubernetes services and ingress controller', completed: false },
    ],
    dependencies: { blockedBy: [], blocking: [] },
    comments: [
      { id: 'c1', userName: 'Alex Rivera', content: 'Make sure to use Spring Boot 3.3 for latest features.', timestamp: '10 mins ago' },
      { id: 'c2', userName: 'Varun', content: 'Will do, using Postgres 16 too.', timestamp: '5 mins ago' },
    ],
    attachments: [
      { id: 'att1', name: 'java_roadmap.pdf', type: 'application/pdf', url: '#', size: '2.4 MB' },
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isPinned: true,
  },
  {
    id: 't2',
    name: 'Redesign Landing Page UI Aesthetics',
    description: 'Create glassmorphism overlays, custom svg illustration animations, and mouse-hover responsive statistics gradients.',
    priority: 'high',
    status: 'todo',
    category: 'work',
    tags: ['Design', 'Frontend', 'Framer Motion'],
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    assignee: { name: 'Sarah Miller', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&auto=format&q=80' },
    estimatedTime: 12,
    actualTime: 0,
    progress: 15,
    subtasks: [
      { id: 'st5', title: 'Design gradient background blobs', completed: true },
      { id: 'st6', title: 'Integrate Framer Motion on viewport entry', completed: false },
      { id: 'st7', title: 'Optimize for mobile overlays', completed: false },
    ],
    dependencies: { blockedBy: [], blocking: [] },
    comments: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    isPinned: true,
  },
  {
    id: 't3',
    name: 'Weekly Workout & Cardio routine',
    description: 'Follow 4-day split: Chest/Tricpes, Back/Biceps, Shoulders/Abs, Legs/Lats. Maintain daily caloric intake below 2400kcal.',
    priority: 'medium',
    status: 'in_progress',
    category: 'fitness',
    tags: ['Fitness', 'Cardio'],
    dueDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
    assignee: { name: 'Varun', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80' },
    estimatedTime: 8,
    actualTime: 4,
    progress: 50,
    subtasks: [
      { id: 'st8', title: 'HIIT Cardio 30 min', completed: true },
      { id: 'st9', title: 'Heavy squat session', completed: false },
    ],
    dependencies: { blockedBy: [], blocking: [] },
    comments: [],
    attachments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't4',
    name: 'Audit Monthly Spending Patterns',
    description: 'Export all CSV transactions from banking apps, aggregate by food/rent/travel, and verify budget safety margins.',
    priority: 'medium',
    status: 'completed',
    category: 'finance',
    tags: ['Finance', 'Audit'],
    dueDate: new Date().toISOString().split('T')[0],
    assignee: { name: 'Varun', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80' },
    estimatedTime: 3,
    actualTime: 2.5,
    progress: 100,
    subtasks: [
      { id: 'st10', title: 'Download bank credit statements', completed: true },
      { id: 'st11', title: 'Categorize receipts', completed: true },
    ],
    dependencies: { blockedBy: [], blocking: [] },
    comments: [],
    attachments: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

export const useTaskStore = create<TaskState>((set) => ({
  tasks: mockTasks,
  currentView: 'list',
  filters: {
    priority: 'all',
    status: 'all',
    category: 'all',
    tag: 'all',
    search: '',
    overdue: false,
  },
  sortBy: 'priority',
  timeTracking: {
    trackingTaskId: null,
    isTrackingActive: false,
    elapsedSeconds: 0,
    todayTimeSeconds: 4200, // 1h 10m
    weeklyTimeSeconds: 28800, // 8h
  },

  setView: (currentView) => set({ currentView }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSortBy: (sortBy) => set({ sortBy }),

  addTask: (taskData) =>
    set((state) => {
      const newTask: Task = {
        ...taskData,
        id: `t_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        comments: [],
        attachments: [],
      }
      return { tasks: [newTask, ...state.tasks] }
    }),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  addComment: (taskId, content, userName) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id !== taskId) return t
        const newComment: Comment = {
          id: `c_${Math.random().toString(36).substr(2, 9)}`,
          userName,
          content,
          timestamp: 'Just now',
        }
        return { ...t, comments: [...t.comments, newComment] }
      }),
    })),

  toggleSubtask: (taskId, subtaskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id !== taskId) return t
        const updatedSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        )
        const completedCount = updatedSubtasks.filter((st) => st.completed).length
        const totalCount = updatedSubtasks.length
        const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : t.progress
        return {
          ...t,
          subtasks: updatedSubtasks,
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : t.status,
        }
      }),
    })),

  startTimer: (taskId) =>
    set((state) => ({
      timeTracking: {
        ...state.timeTracking,
        trackingTaskId: taskId,
        isTrackingActive: true,
      },
    })),

  pauseTimer: () =>
    set((state) => ({
      timeTracking: {
        ...state.timeTracking,
        isTrackingActive: false,
      },
    })),

  stopTimer: () =>
    set((state) => {
      const { trackingTaskId, elapsedSeconds, todayTimeSeconds, weeklyTimeSeconds } = state.timeTracking
      if (!trackingTaskId) return state

      // Add elapsed hours to the task actual time
      const elapsedHours = elapsedSeconds / 3600
      const updatedTasks = state.tasks.map((t) => {
        if (t.id !== trackingTaskId) return t
        return {
          ...t,
          actualTime: (t.actualTime || 0) + elapsedHours,
        }
      })

      return {
        tasks: updatedTasks,
        timeTracking: {
          trackingTaskId: null,
          isTrackingActive: false,
          elapsedSeconds: 0,
          todayTimeSeconds: todayTimeSeconds + elapsedSeconds,
          weeklyTimeSeconds: weeklyTimeSeconds + elapsedSeconds,
        },
      }
    }),

  tickTimer: () =>
    set((state) => {
      if (!state.timeTracking.isTrackingActive) return state
      return {
        timeTracking: {
          ...state.timeTracking,
          elapsedSeconds: state.timeTracking.elapsedSeconds + 1,
        },
      }
    }),

  pinTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, isPinned: !t.isPinned } : t)),
    })),
}))

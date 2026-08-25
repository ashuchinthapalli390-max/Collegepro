import { create } from 'zustand'

export interface KeyResult {
  id: string
  title: string
  targetValue: number
  currentValue: number
  unit: string
}

export interface Milestone {
  id: string
  title: string
  dueDate: string
  completed: boolean
}

export interface Goal {
  id: string
  title: string
  description: string
  category: 'career' | 'health' | 'finance' | 'personal' | 'learning'
  status: 'not_started' | 'in_progress' | 'completed' | 'at_risk'
  progress: number
  targetDate: string
  color: string
  icon: string
  keyResults: KeyResult[]
  milestones: Milestone[]
  linkedHabits: string[]
}

interface GoalsState {
  goals: Goal[]
  selectedGoalId: string | null
  filterCategory: string
  setSelectedGoal: (id: string | null) => void
  setFilterCategory: (category: string) => void
  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  updateKeyResult: (goalId: string, krId: string, currentValue: number) => void
  toggleMilestone: (goalId: string, milestoneId: string) => void
}

const mockGoals: Goal[] = [
  {
    id: 'g1',
    title: 'Master Full Stack System Architecture',
    description: 'Build enterprise-grade microservices with Spring Boot, Docker, Kubernetes, and React 19.',
    category: 'career',
    status: 'in_progress',
    progress: 70,
    targetDate: '2026-10-31',
    color: '#6366f1',
    icon: 'Terminal',
    keyResults: [
      { id: 'kr1', title: 'Complete Spring Boot Microservices Course', targetValue: 100, currentValue: 85, unit: '%' },
      { id: 'kr2', title: 'Deploy 3 Kubernetes Clusters on Cloud', targetValue: 3, currentValue: 2, unit: 'clusters' },
      { id: 'kr3', title: 'System Architecture Articles Published', targetValue: 5, currentValue: 3, unit: 'articles' },
    ],
    milestones: [
      { id: 'm1', title: 'Finish Spring Security JWT Deep Dive', dueDate: '2026-06-15', completed: true },
      { id: 'm2', title: 'Dockerize LifeOS Backend APIs', dueDate: '2026-07-20', completed: true },
      { id: 'm3', title: 'Configure Helm Charts & Ingress Controller', dueDate: '2026-08-30', completed: false },
    ],
    linkedHabits: ['h2', 'h5'],
  },
  {
    id: 'g2',
    title: 'Build $50,000 Investment Portfolio',
    description: 'Grow net worth via disciplined monthly index fund investing, tech equities, and emergency reserves.',
    category: 'finance',
    status: 'in_progress',
    progress: 77,
    targetDate: '2026-12-31',
    color: '#10b981',
    icon: 'TrendingUp',
    keyResults: [
      { id: 'kr4', title: 'Total Portfolio Capital Saved', targetValue: 50000, currentValue: 38650, unit: '$' },
      { id: 'kr5', title: 'Maintain 6-Month Emergency Cash Reserve', targetValue: 15000, currentValue: 10500, unit: '$' },
    ],
    milestones: [
      { id: 'm4', title: 'Reach $25k Portfolio Milestone', dueDate: '2026-03-31', completed: true },
      { id: 'm5', title: 'Automate SIP Transfers on 1st of Every Month', dueDate: '2026-05-01', completed: true },
      { id: 'm6', title: 'Reach $40k Portfolio Milestone', dueDate: '2026-09-30', completed: false },
    ],
    linkedHabits: ['h4'],
  },
  {
    id: 'g3',
    title: 'Run a 21K Half Marathon',
    description: 'Develop cardiovascular endurance and leg strength to complete an official half marathon under 2 hours.',
    category: 'health',
    status: 'in_progress',
    progress: 55,
    targetDate: '2026-11-15',
    color: '#f59e0b',
    icon: 'Activity',
    keyResults: [
      { id: 'kr6', title: 'Longest Continuous Distance Run', targetValue: 21, currentValue: 14, unit: 'km' },
      { id: 'kr7', title: 'Weekly Running Volume', targetValue: 35, currentValue: 22, unit: 'km/wk' },
    ],
    milestones: [
      { id: 'm7', title: '10K Continuous Run under 55 mins', dueDate: '2026-05-20', completed: true },
      { id: 'm8', title: '15K Continuous Run Pace Check', dueDate: '2026-08-10', completed: false },
    ],
    linkedHabits: ['h1', 'h3'],
  },
  {
    id: 'g4',
    title: 'Read 24 Non-Fiction Books',
    description: 'Expand knowledge across psychology, business strategy, technology trends, and personal finance.',
    category: 'learning',
    status: 'in_progress',
    progress: 50,
    targetDate: '2026-12-31',
    color: '#8b5cf6',
    icon: 'BookOpen',
    keyResults: [
      { id: 'kr8', title: 'Books Read & Summarized', targetValue: 24, currentValue: 12, unit: 'books' },
    ],
    milestones: [
      { id: 'm9', title: 'Finish 6 Books in Q1', dueDate: '2026-03-31', completed: true },
      { id: 'm10', title: 'Finish 12 Books in Q2', dueDate: '2026-06-30', completed: true },
    ],
    linkedHabits: ['h2'],
  },
  {
    id: 'g5',
    title: 'Solo Travel to Japan',
    description: '14-day trip exploring Tokyo, Kyoto, Osaka, and Mount Fuji during autumn foliage season.',
    category: 'personal',
    status: 'not_started',
    progress: 30,
    targetDate: '2026-10-15',
    color: '#ec4899',
    icon: 'Compass',
    keyResults: [
      { id: 'kr9', title: 'Japan Travel Fund Saved', targetValue: 5000, currentValue: 1800, unit: '$' },
      { id: 'kr10', title: 'Basic Conversational Japanese Phrases', targetValue: 50, currentValue: 15, unit: 'phrases' },
    ],
    milestones: [
      { id: 'm11', title: 'Book Flights & JR Rail Pass', dueDate: '2026-07-31', completed: false },
      { id: 'm12', title: 'Finalize Day-by-Day Itinerary', dueDate: '2026-08-31', completed: false },
    ],
    linkedHabits: [],
  },
]

export const useGoalsStore = create<GoalsState>((set) => ({
  goals: mockGoals,
  selectedGoalId: 'g1',
  filterCategory: 'all',

  setSelectedGoal: (id) => set({ selectedGoalId: id }),
  setFilterCategory: (filterCategory) => set({ filterCategory }),

  addGoal: (goalData) =>
    set((state) => ({
      goals: [
        ...state.goals,
        {
          ...goalData,
          id: `g_${Math.random().toString(36).substr(2, 9)}`,
          progress: 0,
        },
      ],
    })),

  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })),

  deleteGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
      selectedGoalId: state.selectedGoalId === id ? null : state.selectedGoalId,
    })),

  updateKeyResult: (goalId, krId, currentValue) =>
    set((state) => ({
      goals: state.goals.map((g) => {
        if (g.id !== goalId) return g
        const updatedKrs = g.keyResults.map((kr) =>
          kr.id === krId ? { ...kr, currentValue } : kr
        )
        const totalProgress = updatedKrs.length > 0
          ? Math.round(
              updatedKrs.reduce((acc, kr) => acc + Math.min(100, (kr.currentValue / kr.targetValue) * 100), 0) / updatedKrs.length
            )
          : g.progress
        return {
          ...g,
          keyResults: updatedKrs,
          progress: totalProgress,
          status: totalProgress >= 100 ? 'completed' : g.status,
        }
      }),
    })),

  toggleMilestone: (goalId, milestoneId) =>
    set((state) => ({
      goals: state.goals.map((g) => {
        if (g.id !== goalId) return g
        return {
          ...g,
          milestones: g.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          ),
        }
      }),
    })),
}))

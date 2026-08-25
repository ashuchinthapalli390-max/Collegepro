import { create } from 'zustand'

export interface Issue {
  id: string
  title: string
  description: string
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: { name: string; avatar: string }
  labels: string[]
  epicId?: string
  sprintId?: string
  createdAt: string
}

export interface Epic {
  id: string
  title: string
  color: string
  progress: number
  startDate: string
  endDate: string
}

export interface Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
}

export interface Milestone {
  id: string
  title: string
  dueDate: string
  completed: boolean
}

export interface ActivityItem {
  id: string
  user: string
  avatar: string
  action: string
  target: string
  timestamp: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'completed' | 'archived'
  color: string
  icon: string
  members: { name: string; avatar: string; role: string }[]
  progress: number
  issues: Issue[]
  epics: Epic[]
  sprints: Sprint[]
  milestones: Milestone[]
  activity: ActivityItem[]
  createdAt: string
}

interface ProjectState {
  projects: Project[]
  selectedProjectId: string | null
  projectView: 'dashboard' | 'kanban' | 'roadmap' | 'sprint' | 'activity'
  setSelectedProject: (id: string | null) => void
  setProjectView: (view: ProjectState['projectView']) => void
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'activity'>) => void
  updateIssueStatus: (projectId: string, issueId: string, status: Issue['status']) => void
  addIssue: (projectId: string, issue: Omit<Issue, 'id' | 'createdAt'>) => void
  toggleMilestone: (projectId: string, milestoneId: string) => void
}

const av = (n: number) => `https://images.unsplash.com/photo-${
  ['1534528741775-53994a69daeb', '1494790108377-be9c29b29330', '1500648767791-00dcc994a43e', '1507003211169-0a1dd7228f2d'][n % 4]
}?w=80&fit=crop&auto=format&q=80`

const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'LifeOS Platform',
    description: 'Build and ship the all-in-one productivity operating system with task management, habit tracking, finance ledger, and AI assistant.',
    status: 'active',
    color: '#6366f1',
    icon: 'Sparkles',
    members: [
      { name: 'Varun', avatar: av(0), role: 'Lead' },
      { name: 'Sarah', avatar: av(1), role: 'Designer' },
      { name: 'Marcus', avatar: av(2), role: 'Backend' },
    ],
    progress: 62,
    issues: [
      { id: 'i1', title: 'Implement Kanban drag-and-drop', description: 'Add DND support to task board.', status: 'done', priority: 'high', assignee: { name: 'Varun', avatar: av(0) }, labels: ['Frontend', 'UX'], epicId: 'e1', sprintId: 'sp1', createdAt: '2026-07-01' },
      { id: 'i2', title: 'Finance pie charts', description: 'Build spending category pie chart with Recharts.', status: 'in_progress', priority: 'medium', assignee: { name: 'Varun', avatar: av(0) }, labels: ['Frontend', 'Charts'], epicId: 'e1', sprintId: 'sp1', createdAt: '2026-07-05' },
      { id: 'i3', title: 'Calendar month view', description: 'CSS grid calendar with event pills.', status: 'in_progress', priority: 'high', assignee: { name: 'Sarah', avatar: av(1) }, labels: ['Frontend'], epicId: 'e1', sprintId: 'sp1', createdAt: '2026-07-08' },
      { id: 'i4', title: 'AI chat streaming effect', description: 'Typewriter animation for AI responses.', status: 'todo', priority: 'medium', assignee: { name: 'Marcus', avatar: av(2) }, labels: ['AI', 'UX'], epicId: 'e2', sprintId: 'sp1', createdAt: '2026-07-10' },
      { id: 'i5', title: 'Habit heatmap component', description: 'GitHub-style contribution graph.', status: 'done', priority: 'high', assignee: { name: 'Varun', avatar: av(0) }, labels: ['Frontend'], epicId: 'e1', sprintId: 'sp1', createdAt: '2026-07-02' },
      { id: 'i6', title: 'Settings page build', description: 'Profile, appearance, security tabs.', status: 'backlog', priority: 'low', assignee: { name: 'Sarah', avatar: av(1) }, labels: ['Frontend'], epicId: 'e2', createdAt: '2026-07-12' },
      { id: 'i7', title: 'Global search command palette', description: 'Ctrl+K search across all modules.', status: 'todo', priority: 'urgent', assignee: { name: 'Varun', avatar: av(0) }, labels: ['UX', 'Frontend'], epicId: 'e2', sprintId: 'sp1', createdAt: '2026-07-14' },
      { id: 'i8', title: 'Notification center', description: 'Build notification list with filters.', status: 'backlog', priority: 'medium', assignee: { name: 'Marcus', avatar: av(2) }, labels: ['Frontend'], epicId: 'e2', createdAt: '2026-07-15' },
    ],
    epics: [
      { id: 'e1', title: 'Core Modules', color: '#6366f1', progress: 75, startDate: '2026-06-01', endDate: '2026-08-15' },
      { id: 'e2', title: 'Utility & Polish', color: '#8b5cf6', progress: 20, startDate: '2026-07-15', endDate: '2026-09-30' },
    ],
    sprints: [
      { id: 'sp1', name: 'Sprint 7 — July', startDate: '2026-07-01', endDate: '2026-07-31', isActive: true },
    ],
    milestones: [
      { id: 'm1', title: 'Alpha Release', dueDate: '2026-07-31', completed: false },
      { id: 'm2', title: 'All Modules Live', dueDate: '2026-08-15', completed: false },
      { id: 'm3', title: 'Design System V1', dueDate: '2026-06-30', completed: true },
    ],
    activity: [
      { id: 'a1', user: 'Varun', avatar: av(0), action: 'completed', target: 'Implement Kanban drag-and-drop', timestamp: '2 hours ago' },
      { id: 'a2', user: 'Sarah', avatar: av(1), action: 'moved to In Progress', target: 'Calendar month view', timestamp: '4 hours ago' },
      { id: 'a3', user: 'Marcus', avatar: av(2), action: 'created', target: 'Notification center', timestamp: '1 day ago' },
      { id: 'a4', user: 'Varun', avatar: av(0), action: 'completed', target: 'Habit heatmap component', timestamp: '2 days ago' },
    ],
    createdAt: '2026-06-01',
  },
  {
    id: 'p2',
    name: 'Portfolio Website',
    description: 'Personal portfolio with project showcase, blog, and contact form. Next.js + Framer Motion.',
    status: 'active',
    color: '#10b981',
    icon: 'Globe',
    members: [
      { name: 'Varun', avatar: av(0), role: 'Owner' },
    ],
    progress: 85,
    issues: [
      { id: 'i9', title: 'Hero section animations', description: 'Parallax scroll and text reveal.', status: 'done', priority: 'high', assignee: { name: 'Varun', avatar: av(0) }, labels: ['Design'], createdAt: '2026-06-20' },
      { id: 'i10', title: 'Blog MDX integration', description: 'Set up MDX for blog posts.', status: 'in_progress', priority: 'medium', assignee: { name: 'Varun', avatar: av(0) }, labels: ['Content'], createdAt: '2026-07-01' },
      { id: 'i11', title: 'Contact form validation', description: 'Zod + React Hook Form.', status: 'done', priority: 'medium', assignee: { name: 'Varun', avatar: av(0) }, labels: ['Frontend'], createdAt: '2026-07-05' },
    ],
    epics: [
      { id: 'e3', title: 'Website Build', color: '#10b981', progress: 85, startDate: '2026-06-15', endDate: '2026-07-31' },
    ],
    sprints: [],
    milestones: [
      { id: 'm4', title: 'Go Live', dueDate: '2026-07-25', completed: false },
    ],
    activity: [
      { id: 'a5', user: 'Varun', avatar: av(0), action: 'completed', target: 'Contact form validation', timestamp: '1 day ago' },
    ],
    createdAt: '2026-06-15',
  },
  {
    id: 'p3',
    name: 'Mobile Fitness Tracker',
    description: 'React Native app for workout logging, progress photos, and macro tracking.',
    status: 'paused',
    color: '#f59e0b',
    icon: 'Dumbbell',
    members: [
      { name: 'Varun', avatar: av(0), role: 'Lead' },
      { name: 'David', avatar: av(3), role: 'Mobile Dev' },
    ],
    progress: 35,
    issues: [
      { id: 'i12', title: 'Workout log screen', description: 'Exercise cards with sets/reps.', status: 'in_progress', priority: 'high', assignee: { name: 'David', avatar: av(3) }, labels: ['Mobile'], createdAt: '2026-06-25' },
      { id: 'i13', title: 'Progress photos feature', description: 'Camera + gallery integration.', status: 'backlog', priority: 'medium', assignee: { name: 'David', avatar: av(3) }, labels: ['Mobile'], createdAt: '2026-07-01' },
    ],
    epics: [
      { id: 'e4', title: 'MVP Build', color: '#f59e0b', progress: 35, startDate: '2026-06-20', endDate: '2026-09-01' },
    ],
    sprints: [],
    milestones: [
      { id: 'm5', title: 'TestFlight Beta', dueDate: '2026-08-30', completed: false },
    ],
    activity: [
      { id: 'a6', user: 'David', avatar: av(3), action: 'started', target: 'Workout log screen', timestamp: '3 days ago' },
    ],
    createdAt: '2026-06-20',
  },
]

export const useProjectStore = create<ProjectState>((set) => ({
  projects: mockProjects,
  selectedProjectId: 'p1',
  projectView: 'dashboard',

  setSelectedProject: (id) => set({ selectedProjectId: id }),
  setProjectView: (projectView) => set({ projectView }),

  addProject: (projectData) =>
    set((state) => ({
      projects: [
        ...state.projects,
        {
          ...projectData,
          id: `p_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          activity: [],
        },
      ],
    })),

  updateIssueStatus: (projectId, issueId, status) =>
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id !== projectId) return p
        const updatedIssues = p.issues.map((i) =>
          i.id === issueId ? { ...i, status } : i
        )
        const done = updatedIssues.filter((i) => i.status === 'done').length
        const total = updatedIssues.length
        return {
          ...p,
          issues: updatedIssues,
          progress: total > 0 ? Math.round((done / total) * 100) : p.progress,
        }
      }),
    })),

  addIssue: (projectId, issueData) =>
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id !== projectId) return p
        const newIssue: Issue = {
          ...issueData,
          id: `i_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString().split('T')[0],
        }
        return { ...p, issues: [...p.issues, newIssue] }
      }),
    })),

  toggleMilestone: (projectId, milestoneId) =>
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id !== projectId) return p
        return {
          ...p,
          milestones: p.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          ),
        }
      }),
    })),
}))

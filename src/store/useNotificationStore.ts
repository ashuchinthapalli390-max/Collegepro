import { create } from 'zustand'

export interface NotificationItem {
  id: string
  title: string
  message: string
  category: 'task' | 'habit' | 'finance' | 'system' | 'goal'
  priority: 'low' | 'medium' | 'high'
  isRead: boolean
  timestamp: string
  actionUrl?: string
}

interface NotificationState {
  notifications: NotificationItem[]
  filterCategory: string
  setFilterCategory: (category: string) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
}

const mockNotifications: NotificationItem[] = [
  { id: 'n1', title: 'Task Deadline Approaching', message: 'Complete Java Full Stack Roadmap is due in 2 days.', category: 'task', priority: 'high', isRead: false, timestamp: '10 mins ago', actionUrl: '/tasks' },
  { id: 'n2', title: 'Habit Streak Milestone!', message: 'You reached a 12-day streak on Hydrate (Drink 3L Water).', category: 'habit', priority: 'medium', isRead: false, timestamp: '1 hour ago', actionUrl: '/habits' },
  { id: 'n3', title: 'Bill Payment Due', message: 'Broadband Fiber internet bill ($75) is due in 3 days.', category: 'finance', priority: 'high', isRead: false, timestamp: '3 hours ago', actionUrl: '/finance' },
  { id: 'n4', title: 'Goal Milestone Achieved', message: 'You reached 77% progress on $50,000 Investment Portfolio.', category: 'goal', priority: 'low', isRead: true, timestamp: '1 day ago', actionUrl: '/goals' },
  { id: 'n5', title: 'System Backup Successful', message: 'Automated local storage snapshot saved clean.', category: 'system', priority: 'low', isRead: true, timestamp: '2 days ago', actionUrl: '/settings' },
]

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: mockNotifications,
  filterCategory: 'all',

  setFilterCategory: (filterCategory) => set({ filterCategory }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),
}))

import { create } from 'zustand'

export interface CalendarEvent {
  id: string
  title: string
  description: string
  start: string // ISO date-time
  end: string
  color: string
  category: 'work' | 'personal' | 'health' | 'meeting' | 'social' | 'other'
  isAllDay: boolean
  isRecurring: boolean
  location?: string
}

type CalendarView = 'month' | 'week' | 'day' | 'agenda'

interface CalendarState {
  events: CalendarEvent[]
  view: CalendarView
  selectedDate: string // ISO date
  setView: (view: CalendarView) => void
  setSelectedDate: (date: string) => void
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
}

const today = new Date()
const y = today.getFullYear()
const m = today.getMonth()

const d = (day: number, hour = 9, min = 0) => {
  const dt = new Date(y, m, day, hour, min)
  return dt.toISOString()
}

const mockEvents: CalendarEvent[] = [
  { id: 'ev1', title: 'Sprint Planning', description: 'Q3 sprint kickoff and backlog grooming session with the team.', start: d(today.getDate(), 9, 0), end: d(today.getDate(), 10, 30), color: '#6366f1', category: 'meeting', isAllDay: false, isRecurring: true, location: 'Room A' },
  { id: 'ev2', title: 'Gym — Upper Body', description: 'Chest press, shoulder press, tricep dips, bicep curls.', start: d(today.getDate(), 17, 0), end: d(today.getDate(), 18, 30), color: '#f59e0b', category: 'health', isAllDay: false, isRecurring: false },
  { id: 'ev3', title: 'Team Standup', description: 'Daily standup sync with engineering.', start: d(today.getDate() + 1, 10, 0), end: d(today.getDate() + 1, 10, 15), color: '#6366f1', category: 'meeting', isAllDay: false, isRecurring: true, location: 'Virtual' },
  { id: 'ev4', title: 'Design Review', description: 'Review new dashboard mockups and provide feedback.', start: d(today.getDate() + 1, 14, 0), end: d(today.getDate() + 1, 15, 0), color: '#8b5cf6', category: 'work', isAllDay: false, isRecurring: false },
  { id: 'ev5', title: 'Dentist Appointment', description: 'Regular dental checkup at SmileCare clinic.', start: d(today.getDate() + 2, 11, 0), end: d(today.getDate() + 2, 12, 0), color: '#10b981', category: 'personal', isAllDay: false, isRecurring: false, location: 'SmileCare Dental' },
  { id: 'ev6', title: 'React Conf Livestream', description: 'Watch React Conf 2026 keynote and Server Components talk.', start: d(today.getDate() + 3, 18, 0), end: d(today.getDate() + 3, 21, 0), color: '#06b6d4', category: 'other', isAllDay: false, isRecurring: false },
  { id: 'ev7', title: 'Weekly Review', description: 'Review completed tasks, habit streaks, and financial goals.', start: d(today.getDate() + 4, 16, 0), end: d(today.getDate() + 4, 17, 0), color: '#6366f1', category: 'work', isAllDay: false, isRecurring: true },
  { id: 'ev8', title: 'Coffee with Alex', description: 'Catch up at Blue Bottle downtown.', start: d(today.getDate() + 5, 10, 30), end: d(today.getDate() + 5, 11, 30), color: '#f43f5e', category: 'social', isAllDay: false, isRecurring: false, location: 'Blue Bottle Coffee' },
  { id: 'ev9', title: 'Product Launch Prep', description: 'Final checks on landing page, marketing copy, and analytics.', start: d(today.getDate() - 1, 9, 0), end: d(today.getDate() - 1, 17, 0), color: '#8b5cf6', category: 'work', isAllDay: true, isRecurring: false },
  { id: 'ev10', title: 'Meditation & Journal', description: 'Morning mindfulness session and gratitude journaling.', start: d(today.getDate(), 6, 30), end: d(today.getDate(), 7, 0), color: '#10b981', category: 'health', isAllDay: false, isRecurring: true },
  { id: 'ev11', title: 'API Architecture Meeting', description: 'Plan REST vs GraphQL for the next microservice.', start: d(today.getDate() + 2, 14, 0), end: d(today.getDate() + 2, 15, 30), color: '#6366f1', category: 'meeting', isAllDay: false, isRecurring: false, location: 'Room B' },
  { id: 'ev12', title: 'Grocery Run', description: 'Weekly groceries — Whole Foods.', start: d(today.getDate() + 6, 10, 0), end: d(today.getDate() + 6, 11, 0), color: '#f59e0b', category: 'personal', isAllDay: false, isRecurring: true },
]

export const useCalendarStore = create<CalendarState>((set) => ({
  events: mockEvents,
  view: 'month',
  selectedDate: today.toISOString().split('T')[0],

  setView: (view) => set({ view }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),

  addEvent: (eventData) =>
    set((state) => ({
      events: [
        ...state.events,
        { ...eventData, id: `ev_${Math.random().toString(36).substr(2, 9)}` },
      ],
    })),

  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),

  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),
}))

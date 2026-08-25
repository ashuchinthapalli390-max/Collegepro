import { create } from 'zustand'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  durationDays: number
  progressDays: number
  habitsLinked: string[]
  completed: boolean
}

export interface Habit {
  id: string
  name: string
  description: string
  category: 'health' | 'fitness' | 'learning' | 'study' | 'finance' | 'productivity' | 'mindfulness' | 'personal'
  difficulty: 'easy' | 'medium' | 'hard' | 'challenge'
  currentStreak: number
  longestStreak: number
  completionRate: number // Percentage
  targetFrequency: 'daily' | 'weekly' | 'monthly'
  reminderTime: string
  history: Record<string, 'completed' | 'partial' | 'missed'> // 'YYYY-MM-DD' -> status
  targetCount: number
  currentCountToday: number
  isArchived?: boolean
}

interface HabitState {
  habits: Habit[]
  xp: number
  level: number
  coins: number
  achievements: Achievement[]
  challenges: Challenge[]
  toggleHabit: (id: string, date: string, status?: 'completed' | 'partial' | 'missed') => void
  addHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'completionRate' | 'history' | 'currentCountToday'>) => void
  deleteHabit: (id: string) => void
  claimDailyQuest: () => void
  gainXP: (amount: number) => void
}

const generateHeatmapHistory = (streakDays: number, totalDays = 90) => {
  const history: Record<string, 'completed' | 'partial' | 'missed'> = {}
  const today = new Date()
  
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    
    if (i < streakDays) {
      history[dateStr] = 'completed'
    } else if (Math.random() > 0.45) {
      history[dateStr] = Math.random() > 0.85 ? 'partial' : 'completed'
    } else {
      history[dateStr] = 'missed'
    }
  }
  return history
}

const mockHabits: Habit[] = [
  {
    id: 'h1',
    name: 'Hydrate (Drink 3L Water)',
    description: 'Consume 8-10 glasses of water daily to stay hydrated and energetic.',
    category: 'health',
    difficulty: 'easy',
    currentStreak: 12,
    longestStreak: 24,
    completionRate: 88,
    targetFrequency: 'daily',
    reminderTime: '10:00 AM',
    history: generateHeatmapHistory(12),
    targetCount: 4,
    currentCountToday: 3,
  },
  {
    id: 'h2',
    name: 'Read Tech Articles / Books',
    description: 'Read engineering blogs, architecture docs, or productivity books for 30 minutes.',
    category: 'learning',
    difficulty: 'medium',
    currentStreak: 5,
    longestStreak: 15,
    completionRate: 75,
    targetFrequency: 'daily',
    reminderTime: '09:00 PM',
    history: generateHeatmapHistory(5),
    targetCount: 1,
    currentCountToday: 1,
  },
  {
    id: 'h3',
    name: 'Hit the Gym / Cardio Session',
    description: '60 minutes of progressive weight lifting or high-intensity interval training.',
    category: 'fitness',
    difficulty: 'hard',
    currentStreak: 3,
    longestStreak: 8,
    completionRate: 64,
    targetFrequency: 'daily',
    reminderTime: '06:00 PM',
    history: generateHeatmapHistory(3),
    targetCount: 1,
    currentCountToday: 0,
  },
  {
    id: 'h4',
    name: '15 Minutes Mindfulness Meditation',
    description: 'Morning breath focus and mental clarity scanning to align state.',
    category: 'mindfulness',
    difficulty: 'easy',
    currentStreak: 9,
    longestStreak: 18,
    completionRate: 80,
    targetFrequency: 'daily',
    reminderTime: '07:30 AM',
    history: generateHeatmapHistory(9),
    targetCount: 1,
    currentCountToday: 1,
  },
  {
    id: 'h5',
    name: 'Practice Coding (Java & React)',
    description: 'Write algorithms, debug systems, or code project modules.',
    category: 'productivity',
    difficulty: 'hard',
    currentStreak: 18,
    longestStreak: 30,
    completionRate: 92,
    targetFrequency: 'daily',
    reminderTime: '02:00 PM',
    history: generateHeatmapHistory(18),
    targetCount: 1,
    currentCountToday: 1,
  },
]

const mockAchievements: Achievement[] = [
  { id: 'a1', title: 'First Habit Set', description: 'Begin your journey towards habit building.', icon: 'CheckCircle', unlocked: true, unlockedAt: '3 weeks ago' },
  { id: 'a2', title: 'Early Bird', description: 'Complete a habit before 8:00 AM.', icon: 'Sun', unlocked: true, unlockedAt: '2 days ago' },
  { id: 'a3', title: '7-Day Streak Warrior', description: 'Maintain any habit for 7 consecutive days.', icon: 'Flame', unlocked: true, unlockedAt: '1 week ago' },
  { id: 'a4', title: 'Consistency Overlord', description: 'Reach a 30-day streak on any habit.', icon: 'Award', unlocked: false },
  { id: 'a5', title: 'Habit Explorer', description: 'Set up habits in 5 different categories.', icon: 'Compass', unlocked: true, unlockedAt: '1 week ago' },
  { id: 'a6', title: 'Perfect Week', description: 'Complete all daily habits for 7 consecutive days.', icon: 'Star', unlocked: false },
]

const mockChallenges: Challenge[] = [
  { id: 'ch1', title: '30-Day Mind & Body Reset', description: 'Complete Hydrate, Meditation, and Gym sessions daily.', durationDays: 30, progressDays: 14, habitsLinked: ['h1', 'h3', 'h4'], completed: false },
  { id: 'ch2', title: '100 Days of Code Sprint', description: 'Practice coding habits continuously for 100 days.', durationDays: 100, progressDays: 45, habitsLinked: ['h5'], completed: false },
  { id: 'ch3', title: 'Intellectual Upgrade', description: 'Read articles and write journal logs for 21 days straight.', durationDays: 21, progressDays: 21, habitsLinked: ['h2'], completed: true },
]

export const useHabitStore = create<HabitState>((set) => ({
  habits: mockHabits,
  xp: 450,
  level: 2,
  coins: 85,
  achievements: mockAchievements,
  challenges: mockChallenges,

  toggleHabit: (id, date, status = 'completed') =>
    set((state) => {
      let earnedXP = 0
      let earnedCoins = 0

      const updatedHabits = state.habits.map((h) => {
        if (h.id !== id) return h

        const currentStatus = h.history[date]
        const historyCopy = { ...h.history }
        
        let newStreak = h.currentStreak
        let newCount = h.currentCountToday

        if (status === 'completed') {
          if (currentStatus !== 'completed') {
            historyCopy[date] = 'completed'
            newCount = h.currentCountToday + 1
            if (newCount >= h.targetCount) {
              newStreak = h.currentStreak + 1
              earnedXP += h.difficulty === 'easy' ? 10 : h.difficulty === 'medium' ? 20 : 35
              earnedCoins += h.difficulty === 'easy' ? 2 : h.difficulty === 'medium' ? 5 : 10
            }
          } else {
            // Toggle off
            historyCopy[date] = 'missed'
            newCount = Math.max(0, h.currentCountToday - 1)
            newStreak = Math.max(0, h.currentStreak - 1)
          }
        } else {
          historyCopy[date] = status
          if (status === 'missed') {
            newStreak = 0
          }
        }

        const dates = Object.keys(historyCopy)
        const completedDates = dates.filter((d) => historyCopy[d] === 'completed').length
        const totalDates = dates.length
        const completionRate = totalDates > 0 ? Math.round((completedDates / totalDates) * 100) : 0

        return {
          ...h,
          history: historyCopy,
          currentStreak: newStreak,
          longestStreak: Math.max(h.longestStreak, newStreak),
          currentCountToday: newCount,
          completionRate,
        }
      })

      // Level check
      const currentXP = state.xp + earnedXP
      const nextLevelThreshold = state.level * 300
      let newLevel = state.level
      let remainingXP = currentXP

      if (remainingXP >= nextLevelThreshold) {
        remainingXP -= nextLevelThreshold
        newLevel += 1
      }

      return {
        habits: updatedHabits,
        xp: remainingXP,
        level: newLevel,
        coins: state.coins + earnedCoins,
      }
    }),

  addHabit: (habitData) =>
    set((state) => {
      const newHabit: Habit = {
        ...habitData,
        id: `h_${Math.random().toString(36).substr(2, 9)}`,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
        currentCountToday: 0,
        history: {},
      }
      return { habits: [...state.habits, newHabit] }
    }),

  deleteHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    })),

  claimDailyQuest: () =>
    set((state) => ({
      xp: state.xp + 50,
      coins: state.coins + 15,
    })),

  gainXP: (amount) =>
    set((state) => {
      const totalXP = state.xp + amount
      const threshold = state.level * 300
      if (totalXP >= threshold) {
        return {
          xp: totalXP - threshold,
          level: state.level + 1,
        }
      }
      return { xp: totalXP }
    }),
}))

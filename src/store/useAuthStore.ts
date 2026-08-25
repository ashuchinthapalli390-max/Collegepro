import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  fullName: string
  email: string
  role?: string
  departmentCode?: string
  departmentName?: string
  designation?: string
  age?: number
  profession?: string
  preferredModules?: string[]
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, fullName?: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  updateOnboarding: (role: any, modules: string[]) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        fullName: 'Dr. M. Sreenivasa Rao',
        email: 'hod.cys@nrtec.in',
        role: 'HOD',
        departmentCode: 'CYS',
        departmentName: 'CSE (Cyber Security)',
        designation: 'Professor & Head'
      },
      isAuthenticated: true,
      isLoading: false,

      login: async (email, fullName = 'Dr. M. Sreenivasa Rao') => {
        set({ isLoading: true })
        set({
          user: {
            fullName,
            email,
            role: 'HOD',
            departmentCode: 'CYS',
            departmentName: 'CSE (Cyber Security)',
            designation: 'Professor & Head'
          },
          isAuthenticated: true,
          isLoading: false
        })
      },

      register: async (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false
        })
      },

      logout: () => {
        set({
          user: {
            fullName: 'Guest Faculty / Auditor',
            email: 'guest@nrtec.in',
            role: 'Faculty',
            departmentCode: 'CYS',
            departmentName: 'CSE (Cyber Security)',
            designation: 'Faculty'
          },
          isAuthenticated: true
        })
      },

      updateOnboarding: (role, modules) => {
        set((state) => ({
          user: state.user ? { ...state.user, role, preferredModules: modules } : null
        }))
      }
    }),
    {
      name: 'nec_auth_store_v4'
    }
  )
)

import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { RightSidebar } from './RightSidebar'
import { useAuthStore } from '../../store/useAuthStore'
import { useThemeStore } from '../../store/useThemeStore'
import {
  X,
  FileSpreadsheet,
  FileCheck2,
  Calendar,
  FolderKanban,
  Trophy,
  Briefcase,
  Users,
  Award,
  BookOpen,
  Landmark,
  ShieldCheck,
  Building2,
  Database
} from 'lucide-react'

export const AppLayout: React.FC = () => {
  const { applyTheme } = useThemeStore()
  const location = useLocation()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    applyTheme()
  }, [])

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      {/* Sidebar Layout */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-surface z-50 p-4 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                    NEC
                  </div>
                  <span className="font-bold text-sm text-text-primary">NEC ET Portal</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-text-secondary">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 py-4 space-y-1 overflow-y-auto">
                {[
                  { name: 'Portal Dashboard', path: '/dashboard', icon: Building2 },
                  { name: 'Attendance & Parent Contact', path: '/attendance', icon: FileSpreadsheet },
                  { name: 'Student Projects', path: '/student-projects', icon: FolderKanban },
                  { name: 'Student Achievements', path: '/student-achievements', icon: Trophy },
                  { name: 'Student Internships', path: '/student-internships', icon: Briefcase },
                  { name: 'Board of Studies (BoS)', path: '/bos', icon: FileCheck2 },
                  { name: 'Workshops & Events', path: '/events', icon: Calendar },
                  { name: 'NPTEL & MOOCs', path: '/nptel', icon: Award },
                  { name: 'Faculty Directory', path: '/faculty', icon: Users },
                  { name: 'Curriculum & Regulations', path: '/curriculum-regulations', icon: BookOpen },
                  { name: 'Bulk Data Center', path: '/data-center', icon: Database }
                ].map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 font-bold'
                          : 'text-text-secondary hover:bg-muted'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Workspace Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onToggleMobileSidebar={() => setMobileMenuOpen(true)}
          onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
          isRightSidebarOpen={rightSidebarOpen}
        />

        {/* Content Outlet */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Right Drawer */}
      <AnimatePresence>
        {rightSidebarOpen && <RightSidebar isOpen={rightSidebarOpen} />}
      </AnimatePresence>
    </div>
  )
}

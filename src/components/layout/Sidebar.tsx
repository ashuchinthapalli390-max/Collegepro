import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FileSpreadsheet,
  FolderKanban,
  Trophy,
  Briefcase,
  HeartHandshake,
  Building2,
  GraduationCap,
  Clock,
  FileCheck2,
  Landmark,
  BookOpen,
  Calendar,
  Handshake,
  Image as ImageIcon,
  Bell,
  Award,
  Users,
  FileText,
  ShieldCheck,
  Database,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

interface NavGroup {
  groupName: string
  items: {
    name: string
    path: string
    icon: React.ComponentType<{ className?: string; size?: number }>
    badge?: string
    isRiskBadge?: boolean
  }[]
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { logout } = useAuthStore()

  const navGroups: NavGroup[] = [
    {
      groupName: 'ACADEMIC ANALYTICS',
      items: [
        { name: 'Mid Exam Analysis', path: '/exam-analysis/mid', icon: Clock, badge: 'Pending' },
        { name: 'External Exam Analysis', path: '/exam-analysis/external', icon: FileCheck2, badge: 'Pending' }
      ]
    },
    {
      groupName: 'STUDENT DEVELOPMENT',
      items: [
        { name: 'Attendance & Parent Contact', path: '/attendance', icon: FileSpreadsheet, badge: '<65% Risk', isRiskBadge: true },
        { name: 'Student Projects', path: '/student-projects', icon: FolderKanban },
        { name: 'Student Achievements', path: '/student-achievements', icon: Trophy },
        { name: 'Student Internships', path: '/student-internships', icon: Briefcase },
        { name: 'Community Service (CSP)', path: '/community-service-projects', icon: HeartHandshake }
      ]
    },
    {
      groupName: 'PLACEMENTS & CAREER',
      items: [
        { name: 'Companies Visited', path: '/placements/companies', icon: Building2 },
        { name: 'Campus Placements', path: '/placements/campus', icon: GraduationCap }
      ]
    },
    {
      groupName: 'ACADEMIC GOVERNANCE',
      items: [
        { name: 'Board of Studies (BoS)', path: '/bos', icon: FileCheck2 },
        { name: 'Academic Council', path: '/academic-council', icon: Landmark },
        { name: 'Curriculum & Regulations', path: '/curriculum-regulations', icon: BookOpen }
      ]
    },
    {
      groupName: 'EVENTS & OUTREACH',
      items: [
        { name: 'Workshops & Events', path: '/events', icon: Calendar },
        { name: 'Industry MoUs', path: '/mous', icon: Handshake },
        { name: 'Media Gallery', path: '/media-gallery', icon: ImageIcon },
        { name: 'Circulars & Notices', path: '/circulars', icon: Bell }
      ]
    },
    {
      groupName: 'ACCREDITATION & DATA',
      items: [
        { name: 'NPTEL & MOOCs', path: '/nptel', icon: Award }
      ]
    },
    {
      groupName: 'FACULTY & RESEARCH',
      items: [
        { name: 'Faculty Directory', path: '/faculty', icon: Users },
        { name: 'Research Publications', path: '/research', icon: FileText },
        { name: 'Patents & IPR', path: '/patents', icon: ShieldCheck },
        { name: 'Bulk Data Center', path: '/data-center', icon: Database }
      ]
    }
  ]

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen sticky top-0 left-0 bg-surface border-r border-border z-30 overflow-hidden"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border bg-slate-900 text-white">
        <NavLink to="/dashboard" className="flex items-center gap-3 font-semibold text-sm overflow-hidden shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-sm shadow-md border border-indigo-400/40">
            NEC
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-w-0">
              <span className="text-xs font-black tracking-tight text-white leading-tight">NEC ET Portal</span>
              <span className="text-[10px] text-slate-400 font-mono">Autonomous • ET Hub</span>
            </motion.div>
          )}
        </NavLink>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
        {/* Dashboard Link */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-text-secondary hover:bg-muted hover:text-text-primary'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Portal Dashboard</span>}
        </NavLink>

        {/* Grouped Links */}
        {navGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            {!collapsed && (
              <span className="text-[10px] font-black uppercase text-text-secondary/70 tracking-wider px-3 block mb-1">
                {group.groupName}
              </span>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 font-bold'
                      : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <item.icon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      item.isRiskBadge
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300'
                        : 'bg-muted text-text-secondary border border-border'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer User Section */}
      <div className="p-3 border-t border-border bg-muted/20">
        {!collapsed && (
          <div className="flex items-center gap-2.5 mb-2 p-2 rounded-xl bg-muted/40 border border-border">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              HOD
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-text-primary truncate">Dr. M. Sreenivasa Rao</span>
              <span className="text-[10px] text-text-secondary font-mono truncate">HOD • CSE (Cyber Security)</span>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
        >
          <LogOut size={15} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  )
}

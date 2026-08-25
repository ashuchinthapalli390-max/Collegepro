import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sun,
  Moon,
  Laptop,
  Bell,
  Sparkles,
  Search,
  Plus,
  Menu,
  FileSpreadsheet,
  FileCheck2,
  Calendar,
  Building2,
  Users,
  Award
} from 'lucide-react'
import { useThemeStore } from '../../store/useThemeStore'
import { useAuthStore } from '../../store/useAuthStore'

interface NavbarProps {
  onToggleMobileSidebar: () => void
  onToggleRightSidebar: () => void
  isRightSidebarOpen: boolean
  onOpenQuickAdd?: (type: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  onToggleRightSidebar,
  isRightSidebarOpen
}) => {
  const navigate = useNavigate()
  const { theme, setTheme } = useThemeStore()
  const { user } = useAuthStore()
  const [showQuickAddDropdown, setShowQuickAddDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={17} className="text-amber-500" />
    if (theme === 'dark') return <Moon size={17} className="text-indigo-400" />
    return <Laptop size={17} className="text-slate-500" />
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/attendance?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-20 h-16 w-full bg-surface/90 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Mobile Menu & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-muted text-text-secondary transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-sm shadow">
            NEC
          </div>
          <span className="font-bold text-xs text-text-primary">ET Portal</span>
        </div>
      </div>

      {/* Global ET Portal Search */}
      <div className="hidden sm:flex items-center max-w-md w-full relative mx-4">
        <Search size={15} className="absolute left-3.5 text-text-secondary" />
        <input
          type="text"
          placeholder="Search ET students, faculty, BoS, events, publications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="w-full pl-9 pr-4 py-1.5 bg-muted/50 border border-border focus:border-indigo-500 focus:bg-surface rounded-xl text-xs focus:outline-none transition-all placeholder:text-text-secondary/60 text-text-primary"
        />
        <div className="absolute right-3 top-2 px-1.5 py-0.5 rounded text-[9px] bg-surface border border-border text-text-secondary font-mono leading-none">
          ET
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Institutional Action Button */}
        <div className="relative">
          <button
            onClick={() => setShowQuickAddDropdown(!showQuickAddDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
          >
            <Plus size={14} />
            <span className="hidden xs:inline">Quick Action</span>
          </button>

          {showQuickAddDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowQuickAddDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-2xl p-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150 text-xs text-text-primary">
                <Link
                  to="/attendance"
                  onClick={() => setShowQuickAddDropdown(false)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-muted font-medium transition-colors"
                >
                  <FileSpreadsheet size={14} className="text-amber-500" />
                  <span>Import Attendance Sheet</span>
                </Link>
                <Link
                  to="/bos"
                  onClick={() => setShowQuickAddDropdown(false)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-muted font-medium transition-colors"
                >
                  <FileCheck2 size={14} className="text-indigo-500" />
                  <span>Create BoS Meeting Package</span>
                </Link>
                <Link
                  to="/events"
                  onClick={() => setShowQuickAddDropdown(false)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-muted font-medium transition-colors"
                >
                  <Calendar size={14} className="text-emerald-500" />
                  <span>Add Academic Workshop</span>
                </Link>
                <Link
                  to="/data-center"
                  onClick={() => setShowQuickAddDropdown(false)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-muted font-medium transition-colors"
                >
                  <Building2 size={14} className="text-blue-500" />
                  <span>Bulk Data Importer</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={cycleTheme}
          className="p-2 rounded-xl border border-border hover:bg-muted text-text-secondary transition-all"
          title="Toggle Theme"
        >
          {getThemeIcon()}
        </button>

        {/* Notification Bell */}
        <button
          onClick={onToggleRightSidebar}
          className={`p-2 rounded-xl border border-border hover:bg-muted text-text-secondary transition-all relative ${
            isRightSidebarOpen ? 'bg-muted' : ''
          }`}
          title="Notifications & Alerts"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* User Info Header */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow">
            HOD
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-text-primary leading-tight">Dr. M. Sreenivasa Rao</span>
            <span className="text-[10px] text-text-secondary font-mono leading-tight">HOD • CSE (Cyber Security)</span>
          </div>
        </div>
      </div>
    </header>
  )
}

import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Calendar, FileText, Pin, Clock, CheckCircle2, AlertTriangle, FileSpreadsheet, ShieldAlert, Award } from 'lucide-react'

interface RightSidebarProps {
  isOpen: boolean
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen }) => {
  if (!isOpen) return null

  const notifications = [
    {
      id: 1,
      type: 'attendance',
      title: 'Condonation Risk Alert (<65%)',
      desc: '4 students in III Year CYS (Sec A) are below 65% attendance for August 2026.',
      time: '15 mins ago',
      unread: true,
      isRisk: true
    },
    {
      id: 2,
      type: 'bos',
      title: 'BoS Postponement Notice',
      desc: 'Artificial Intelligence BoS rescheduled to 28-Aug-2026 per University Nominee request.',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'award',
      title: 'SIH 2025 Grand Finale Prize',
      desc: 'A. Sai Teja (23CYS001) won 1st Prize of ₹1,00,000 at Ministry of Education Hackathon.',
      time: '3 hours ago',
      unread: false
    }
  ]

  const upcomingGovernance = [
    {
      id: 1,
      title: 'R23 BoS Meeting (AI Department)',
      time: '28 Aug 2026 • 11:00 AM – 02:00 PM',
      color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
      badge: 'Rescheduled'
    },
    {
      id: 2,
      title: 'Robotics Threat Simulation Workshop',
      time: '18-20 Aug 2026 • Innovation Lab',
      color: 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20',
      badge: 'CYS III (A,B,C,D)'
    }
  ]

  const documents = [
    { name: 'BoS_CYS_04_Signed_Minutes.pdf', size: '1.4 MB', date: 'Jul 13, 2026' },
    { name: 'R23_CYS_IV_Year_Syllabus.pdf', size: '2.8 MB', date: 'Jul 13, 2026' },
    { name: 'III_CYS_A_August_Attendance.xlsx', size: '48 KB', date: 'Aug 20, 2026' }
  ]

  return (
    <motion.aside
      initial={{ opacity: 0, x: 280 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 280 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="hidden xl:flex flex-col w-[320px] h-screen sticky top-0 right-0 bg-surface border-l border-border z-10 overflow-y-auto"
    >
      <div className="p-4 border-b border-border flex items-center justify-between bg-slate-900 text-white">
        <h3 className="font-bold text-xs flex items-center gap-2">
          <Bell size={15} className="text-indigo-400" />
          <span>Institutional Notification Stream</span>
        </h3>
        <span className="px-2 py-0.5 text-[9px] rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30">
          2 Unread
        </span>
      </div>

      <div className="flex-1 p-4 space-y-6 text-xs text-text-primary">
        {/* Notifications */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-black uppercase text-text-secondary tracking-wider">
            Critical Alerts & Activity
          </h4>
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border transition-all ${
                  notif.isRisk
                    ? 'bg-red-50/30 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                    : notif.unread
                    ? 'bg-indigo-50/20 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-950/40'
                    : 'bg-muted/40 border-border/80'
                }`}
              >
                <div className="flex justify-between items-start gap-1 mb-1">
                  <span className={`text-xs font-bold ${notif.isRisk ? 'text-red-600 dark:text-red-400' : 'text-text-primary'}`}>
                    {notif.title}
                  </span>
                  {notif.unread && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1" />}
                </div>
                <p className="text-[11px] text-text-secondary leading-normal">{notif.desc}</p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-text-secondary/60">
                  <Clock size={10} />
                  <span>{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Governance & Events */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-black uppercase text-text-secondary tracking-wider">
            Scheduled Governance & Workshops
          </h4>
          <div className="space-y-2">
            {upcomingGovernance.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border-l-4 border-t border-r border-b border-border shadow-sm ${item.color}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-text-primary">{item.title}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-surface border border-border">
                    {item.badge}
                  </span>
                </div>
                <span className="text-[10px] text-text-secondary block">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Governance Documents */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-black uppercase text-text-secondary tracking-wider">
            Recent Institutional Files
          </h4>
          <div className="space-y-1.5">
            {documents.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={14} className="text-indigo-600 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-text-primary truncate">{file.name}</span>
                    <span className="text-[10px] text-text-secondary">{file.size}</span>
                  </div>
                </div>
                <span className="text-[9px] text-text-secondary shrink-0">{file.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  )
}

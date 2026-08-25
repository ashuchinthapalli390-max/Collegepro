import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Bell, CheckSquare, Flame, Wallet, Target, HardDrive,
  CheckCircle2, Trash2, Search, ArrowRight, Shield
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNotificationStore } from '../store/useNotificationStore'

const CATEGORY_ICON_MAP = {
  task: <CheckSquare size={16} className="text-indigo-500" />,
  habit: <Flame size={16} className="text-amber-500" />,
  finance: <Wallet size={16} className="text-emerald-500" />,
  goal: <Target size={16} className="text-red-500" />,
  system: <HardDrive size={16} className="text-slate-500" />,
}

export const NotificationsPage: React.FC = () => {
  const { notifications, filterCategory, setFilterCategory, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore()

  const filteredNotifications = useMemo(() => {
    if (filterCategory === 'all') return notifications
    if (filterCategory === 'unread') return notifications.filter((n) => !n.isRead)
    return notifications.filter((n) => n.category === filterCategory)
  }, [notifications, filterCategory])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <Bell size={20} className="text-amber-500" />
            Notifications Center
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">{unreadCount} unread alerts requiring attention</p>
        </div>

        <div className="flex gap-2">
          <button onClick={markAllAsRead} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl hover:bg-indigo-100 transition-colors">
            Mark All Read
          </button>
          <button onClick={clearAll} className="px-3 py-1.5 border border-border text-text-secondary hover:bg-muted text-xs font-bold rounded-xl transition-colors">
            Clear All
          </button>
        </div>
      </motion.div>

      {/* Category Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {['all', 'unread', 'task', 'habit', 'finance', 'goal', 'system'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-xl uppercase tracking-wider transition-all ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-apple'
                : 'bg-surface border border-border text-text-secondary hover:bg-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
              !n.isRead
                ? 'bg-surface border-indigo-200 dark:border-indigo-900 shadow-apple'
                : 'bg-surface/50 border-border opacity-75'
            }`}
          >
            <div className="p-2.5 bg-muted/50 rounded-xl shrink-0 mt-0.5">
              {CATEGORY_ICON_MAP[n.category]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-xs font-bold text-text-primary truncate">{n.title}</h4>
                <span className="text-[10px] text-text-secondary shrink-0">{n.timestamp}</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-2">{n.message}</p>

              {n.actionUrl && (
                <Link to={n.actionUrl} className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:underline">
                  View details <ArrowRight size={10} />
                </Link>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {!n.isRead && (
                <button onClick={() => markAsRead(n.id)} className="p-1 hover:bg-muted rounded-lg text-indigo-500" title="Mark Read">
                  <CheckCircle2 size={16} />
                </button>
              )}
              <button onClick={() => deleteNotification(n.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-400 rounded-lg" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-16 bg-surface border border-border rounded-2xl">
            <Bell size={36} className="mx-auto text-text-secondary/30 mb-2" />
            <p className="text-xs font-bold text-text-secondary">No notifications to display</p>
          </div>
        )}
      </div>
    </div>
  )
}

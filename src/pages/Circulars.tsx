import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, FileText, Download, Pin, Calendar, Search } from 'lucide-react'
import { useETPortalStore } from '../store/useETPortalStore'

export const CircularsPage: React.FC = () => {
  const { circulars } = useETPortalStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCirculars = circulars.filter((c) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return c.title.toLowerCase().includes(q) || c.referenceNo.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              OFFICIAL ORDERS & NOTICES
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Institutional Circulars & Academic Orders
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Official announcements, examination notifications, and administrative circulars for Emerging Technologies.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {filteredCirculars.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-900">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-muted text-text-secondary border border-border">
                    {c.referenceNo}
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    {c.category}
                  </span>
                  {c.isPinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      <Pin size={11} />
                      <span>Pinned</span>
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-text-primary">{c.title}</h3>
                <p className="text-xs text-text-secondary">
                  Issued by: <strong className="text-text-primary">{c.issuedBy}</strong> • Target: {c.targetAudience} • Date: {c.issueDate}
                </p>
              </div>
            </div>

            <button
              onClick={() => alert(`Downloading official PDF for circular ${c.referenceNo}...`)}
              className="px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted text-text-primary text-xs font-bold flex items-center gap-1.5 shrink-0 self-start md:self-auto transition-colors"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Search, Tag, Calendar, Building2 } from 'lucide-react'
import { useETPortalStore } from '../store/useETPortalStore'
import { DepartmentResolver } from '../utils/departmentResolver'

export const MediaGalleryPage: React.FC = () => {
  const { gallery } = useETPortalStore()
  const [selectedDept, setSelectedDept] = useState<string>('ALL_ET')

  const filteredGallery = useMemo(() => {
    return gallery.filter((g) => {
      if (selectedDept !== 'ALL_ET') {
        const resolved = DepartmentResolver.resolve(selectedDept)
        if (resolved.success && g.departmentId !== resolved.department.id) return false
      }
      return true
    })
  }, [gallery, selectedDept])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              CAMPUS HIGHLIGHTS
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Media Gallery & Event Captures
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            High-resolution event photographs, lab bootcamps, and press releases for Emerging Technologies branches.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGallery.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
          >
            <div className="relative h-48 bg-muted overflow-hidden group">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-slate-900/80 text-white backdrop-blur-sm border border-slate-700">
                {item.eventType}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block">
                  {DepartmentResolver.getShortName(item.departmentId)} • {item.eventDate}
                </span>
                <h3 className="font-bold text-sm text-text-primary mt-0.5">{item.title}</h3>
                <p className="text-xs text-text-secondary mt-1">{item.caption}</p>
              </div>

              <div className="flex flex-wrap gap-1 pt-2 border-t border-border/60">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-text-secondary">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

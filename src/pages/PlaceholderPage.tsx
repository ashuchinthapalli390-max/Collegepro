import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, LayoutDashboard, Clock } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description = "Our engineers are putting the finishing touches on this advanced module. Check back soon for premium analytics and smooth sync engines.",
  icon = <Sparkles className="w-12 h-12 text-indigo-500 animate-pulse" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center max-w-lg mx-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="glass-panel border-border/80 p-8 rounded-3xl shadow-apple-floating flex flex-col items-center w-full"
      >
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl mb-6">
          {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary mb-2">
          {title} Module
        </h2>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-950/30 text-[10px] font-bold uppercase tracking-wider mb-6">
          <Clock size={12} />
          <span>Active Development Preview</span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed mb-8">
          {description}
        </p>

        {/* Shimmer Placeholder Skeletons to make it feel alive */}
        <div className="w-full space-y-3 mb-8">
          <div className="h-4 w-3/4 bg-muted border border-border/40 rounded-lg shimmer mx-auto" />
          <div className="h-4 w-1/2 bg-muted border border-border/40 rounded-lg shimmer mx-auto" />
        </div>

        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-apple group"
        >
          <LayoutDashboard size={14} />
          <span>Go to Command Center</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </motion.div>
    </div>
  )
}

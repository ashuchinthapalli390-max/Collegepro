import React from 'react'
import { motion } from 'framer-motion'
import { FileSpreadsheet, Clock, Sparkles, Building2, Info, CheckCircle2 } from 'lucide-react'

export const MidExamAnalysisPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            ACADEMIC ANALYTICS
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/50 text-slate-300 border border-slate-700">
            CONFIGURATION PENDING
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight">
          Mid Exam Analysis
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Internal assessment and examination performance tracking module for Emerging Technologies.
        </p>
      </div>

      {/* Institutional Placeholder Shell */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-3xl p-8 md:p-12 shadow-sm text-center flex flex-col items-center justify-center space-y-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-900/60 shadow-sm">
          <Clock className="w-8 h-8" />
        </div>

        <div className="max-w-md space-y-2">
          <h2 className="text-lg font-bold text-text-primary">
            Institutional Configuration Pending
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Module structure and data schema will be configured according to the official institutional examination-analysis format upon confirmation.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 text-xs text-text-secondary max-w-lg text-left space-y-2 mt-2">
          <div className="flex items-center gap-2 text-text-primary font-semibold text-xs">
            <Info size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>Autonomous Examination Guidelines:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-text-secondary">
            No analysis configuration or calculation rules have been initialized. Direct schema integration will occur after formal academic guidelines are finalized.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

import React from 'react'
import { motion } from 'framer-motion'
import { FileCheck2, Clock, Info } from 'lucide-react'

export const ExternalExamAnalysisPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            ACADEMIC ANALYTICS
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/50 text-slate-300 border border-slate-700">
            CONFIGURATION PENDING
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight">
          External Exam Analysis
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          End-semester university & autonomous external examination result analytics repository for Emerging Technologies.
        </p>
      </div>

      {/* Institutional Placeholder Shell */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-3xl p-8 md:p-12 shadow-sm text-center flex flex-col items-center justify-center space-y-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-900/60 shadow-sm">
          <Clock className="w-8 h-8" />
        </div>

        <div className="max-w-md space-y-2">
          <h2 className="text-lg font-bold text-text-primary">
            Institutional Configuration Pending
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Module configuration will be added after the final examination-analysis requirements and schema are officially confirmed.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 text-xs text-text-secondary max-w-lg text-left space-y-2 mt-2">
          <div className="flex items-center gap-2 text-text-primary font-semibold text-xs">
            <Info size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>Autonomous Evaluation Guidelines:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-text-secondary">
            No external marks databases, grade distributions, or result analytics reports have been initialized pending controller of examination (COE) specifications.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

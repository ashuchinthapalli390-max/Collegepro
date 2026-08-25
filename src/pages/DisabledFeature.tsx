import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, Home, Layers } from 'lucide-react'

export const DisabledFeature: React.FC = () => {
  const location = useLocation()
  const path = location.pathname.replace('/', '').toUpperCase()

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center text-text-primary">
      <div className="max-w-md p-8 rounded-3xl bg-surface border border-border shadow-xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-muted text-text-secondary border border-border inline-block">
            MODULE CURRENTLY INACTIVE ({path})
          </span>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">
            This compliance module is disabled
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Per institutional portal policy, this module has been cleanly disabled. All official Emerging Technologies workflows are accessible via active student development and governance modules.
          </p>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Home size={15} />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            to="/attendance"
            className="px-4 py-2.5 border border-border hover:bg-muted rounded-xl text-xs font-semibold text-text-secondary transition-all"
          >
            Attendance Hub
          </Link>
        </div>
      </div>
    </div>
  )
}

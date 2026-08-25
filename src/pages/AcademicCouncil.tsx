import React from 'react'
import { motion } from 'framer-motion'
import { Landmark, FileCheck, CheckCircle2, Download, Calendar, Users } from 'lucide-react'

export const AcademicCouncilPage: React.FC = () => {
  const councilMeetings = [
    {
      id: 'ac-2026-02',
      meetingNo: 'AC/2026/02',
      date: '2026-07-25',
      academicYear: '2026-27',
      status: 'APPROVED & RATIFIED',
      title: 'Ratification of R23 IV-Year Curriculum Structure for AI, AIML, CYS, DS',
      keyResolutions: [
        'Unanimously approved BoS recommendations for Cloud Security & DevSecOps course additions in CYS.',
        'Ratified Generative AI & Agentic Architectures curriculum for Artificial Intelligence department.',
        'Approved 20-week mandatory full-semester industry internship guidelines for final year students.'
      ]
    },
    {
      id: 'ac-2025-01',
      meetingNo: 'AC/2025/01',
      date: '2025-08-10',
      academicYear: '2025-26',
      status: 'COMPLETED',
      title: 'Establishment of Advanced Center of Excellence in Emerging Technologies',
      keyResolutions: [
        'Sanctioned establishment of Cyber Defense and Edge AI innovation computing clusters.',
        'Approved credit transfer policy for NPTEL / SWAYAM Elite+Gold certifications.'
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              SUPREME ACADEMIC BODY
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Academic Council Resolutions & Minutes
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Statutory council approvals, BoS resolution ratifications, academic guidelines, and autonomous governance records.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {councilMeetings.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{m.meetingNo}</span>
                  <span className="text-[10px] text-text-secondary font-semibold">• {m.date} ({m.academicYear})</span>
                </div>
                <h3 className="font-bold text-sm text-text-primary mt-1">{m.title}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300">
                {m.status}
              </span>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border/60">
              <span className="text-[10px] font-bold uppercase text-text-secondary block">Major Council Resolutions:</span>
              <ul className="space-y-1 text-xs text-text-primary">
                {m.keyResolutions.map((res, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">✓</span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Layers, Download, CheckCircle2, FileText, ChevronRight } from 'lucide-react'
import { DepartmentResolver } from '../utils/departmentResolver'

export const CurriculumRegulationsPage: React.FC = () => {
  const [activeReg, setActiveReg] = useState<'R23' | 'R20'>('R23')
  const [selectedDept, setSelectedDept] = useState('dept-cys')

  const curriculumData = {
    R23: [
      { sem: 'Semester I', credits: 20.5, courses: ['Linear Algebra & Calculus', 'Engineering Physics', 'C Programming & Data Structures', 'Basic Electrical & Electronics', 'Design Thinking & Innovation'] },
      { sem: 'Semester II', credits: 19.5, courses: ['Differential Equations & Numerical Methods', 'Engineering Chemistry', 'Python for Problem Solving', 'Digital Logic Design', 'Universal Human Values'] },
      { sem: 'Semester III', credits: 21.0, courses: ['Discrete Mathematics', 'Computer Organization & Architecture', 'Database Management Systems', 'Object Oriented Programming via Java', 'Cyber Security Fundamentals'] },
      { sem: 'Semester IV', credits: 21.0, courses: ['Design & Analysis of Algorithms', 'Operating Systems & System Programming', 'Computer Networks & Protocols', 'Cryptography & Network Security', 'Web Application Security'] },
      { sem: 'Semester V', credits: 21.5, courses: ['Software Engineering & Agile', 'Cloud Security & DevSecOps', 'Professional Elective - I', 'Professional Elective - II', 'Open Elective - I'] },
      { sem: 'Semester VI', credits: 21.5, courses: ['Ethical Hacking & Penetration Testing', 'Malware Analysis & Reverse Engineering', 'Professional Elective - III', 'Professional Elective - IV', 'Skill Course: SIEM Operations'] },
      { sem: 'Semester VII', credits: 18.0, courses: ['Digital Forensics & Incident Response', 'Zero Trust Architecture', 'Professional Elective - V', 'Open Elective - II', 'Major Project Phase - I'] },
      { sem: 'Semester VIII', credits: 12.0, courses: ['Full Semester Industry Internship', 'Major Project Phase - II & Viva Voce'] }
    ]
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              ACADEMIC FRAMEWORK
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Curriculum Structure & Regulations
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Autonomous R23 / R20 credit frameworks, semester-wise course structures, and syllabus schemes for ET departments.
          </p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 rounded-xl bg-muted/60 border border-border">
            {(['R23', 'R20'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setActiveReg(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeReg === r ? 'bg-indigo-600 text-white shadow' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {r} Regulation
              </button>
            ))}
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs font-bold focus:outline-none text-text-primary"
          >
            {DepartmentResolver.getETOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {curriculumData.R23.map((sem, idx) => (
          <div key={idx} className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="font-bold text-sm text-text-primary">{sem.sem}</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                {sem.credits} Credits
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              {sem.courses.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                  <span className="text-text-primary font-medium">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

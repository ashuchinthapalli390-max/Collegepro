import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  AlertTriangle,
  FileSpreadsheet,
  FileCheck2,
  Calendar,
  Award,
  BookOpen,
  Building2,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Handshake,
  CheckCircle2,
  HeartHandshake,
  GraduationCap,
  Clock
} from 'lucide-react'
import { CANONICAL_ET_DEPARTMENTS, DepartmentResolver } from '../utils/departmentResolver'
import { useAttendanceStore } from '../store/useAttendanceStore'
import { useBoSStore } from '../store/useBoSStore'
import { useAcademicEventsStore } from '../store/useAcademicEventsStore'
import { useETPortalStore } from '../store/useETPortalStore'
import { usePlacementsStore } from '../store/usePlacementsStore'
import { useCommunityServiceStore } from '../store/useCommunityServiceStore'

export const Dashboard: React.FC = () => {
  const { records, batches } = useAttendanceStore()
  const { meetings } = useBoSStore()
  const { events } = useAcademicEventsStore()
  const { faculty, publications, mous, projects } = useETPortalStore()
  const { getStats: getPlacementStats, companyVisits } = usePlacementsStore()
  const { getStats: getCSPStats } = useCommunityServiceStore()

  // Calculated metrics
  const totalStudents = records.length
  const totalRiskCount = records.filter((r) => r.percentage < 65.0).length
  const activeBatch = batches.find((b) => b.status === 'ACTIVE')

  const placementStats = getPlacementStats('2026-27', 'ALL_ET')
  const cspStats = getCSPStats('2026-27', 'ALL_ET')

  return (
    <div className="space-y-6 text-text-primary">
      {/* Institutional Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              AUTONOMOUS INSTITUTION • NAAC A+ GRADE
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              EMERGING TECHNOLOGIES PORTAL
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Narasaraopeta Engineering College
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Unified governance, academic operations, community outreach, and placements portal for <strong>CSE (Cyber Security), Artificial Intelligence, AI & ML, and CSE (Data Science)</strong> departments.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/attendance"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <FileSpreadsheet size={15} />
              <span>Attendance Risk Hub</span>
            </Link>
            <Link
              to="/placements/campus"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <GraduationCap size={15} />
              <span>Campus Placements</span>
            </Link>
            <Link
              to="/community-service-projects"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <HeartHandshake size={15} />
              <span>Community Service (CSP)</span>
            </Link>
            <Link
              to="/bos"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <FileCheck2 size={15} />
              <span>Board of Studies (BoS)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Attendance Risk Card */}
        <Link
          to="/attendance"
          className="bg-surface border border-red-200 dark:border-red-900/50 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all bg-red-50/10 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-red-600 dark:text-red-400">
              Low Attendance (&lt;65%)
            </span>
            <span className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
              <AlertTriangle size={16} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-red-600 dark:text-red-400">{totalRiskCount}</h3>
            <span className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
              <span>Immediate Condonation Alert</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
        </Link>

        {/* Placed Students & Offers */}
        <Link
          to="/placements/campus"
          className="bg-surface border border-border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-text-secondary">Students Placed</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
              <GraduationCap size={16} />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-text-primary">{placementStats.uniquePlacedStudents}</h3>
              <span className="text-xs font-bold text-emerald-600 font-mono">({placementStats.totalOffers} Offers)</span>
            </div>
            <span className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
              <span>Max: {placementStats.highestPackageLPA} LPA</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
        </Link>

        {/* Community Service Projects */}
        <Link
          to="/community-service-projects"
          className="bg-surface border border-border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-text-secondary">Community Projects</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
              <HeartHandshake size={16} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-text-primary">{cspStats.totalProjects}</h3>
            <span className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
              <span>{cspStats.totalStudentsParticipated} Students • {cspStats.uniqueLocationsCount} Locations</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
        </Link>

        {/* BoS Packages */}
        <Link
          to="/bos"
          className="bg-surface border border-border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-text-secondary">BoS Packages</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
              <FileCheck2 size={16} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-text-primary">{meetings.length}</h3>
            <span className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
              <span>R23 Autonomous Records</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
        </Link>
      </div>

      {/* Academic Analytics Placeholder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/exam-analysis/mid"
          className="bg-surface border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Clock size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-text-primary">Mid Exam Analysis</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                  Pending
                </span>
              </div>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Internal examination performance module (Structure to be configured)
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/exam-analysis/external"
          className="bg-surface border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <FileCheck2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-text-primary">External Exam Analysis</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
                  Pending
                </span>
              </div>
              <p className="text-[11px] text-text-secondary mt-0.5">
                End-semester university & autonomous external results repository
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Canonical ET Departments Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">Emerging Technologies Department Scope</h2>
            <p className="text-xs text-text-secondary">
              Canonical 4 ET departments with unified alias resolution (CYS = Cyber Security = CSE (Cyber Security) | DS = Data Science = CSE (Data Science))
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CANONICAL_ET_DEPARTMENTS.map((dept) => (
            <div
              key={dept.id}
              className="bg-surface border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                    {dept.code}
                  </span>
                  <span className="text-[10px] text-text-secondary font-mono">Est. {dept.establishedYear}</span>
                </div>
                <h3 className="font-bold text-sm text-text-primary mt-2">{dept.officialName}</h3>
                <p className="text-[11px] text-text-secondary mt-1 line-clamp-2">{dept.description}</p>
              </div>

              <div className="pt-3 border-t border-border text-xs text-text-secondary">
                <span className="block text-[10px] font-semibold text-text-secondary">Head of Department:</span>
                <span className="font-bold text-text-primary text-[11px]">{dept.hodName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launchpad & Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Batch Summary */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              <span>Current Active Attendance</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              ACTIVE
            </span>
          </div>

          {activeBatch ? (
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Month / Period:</span>
                <span className="font-bold">{activeBatch.monthYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Department:</span>
                <span className="font-bold">{DepartmentResolver.getShortName(activeBatch.departmentId)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Target Cohort:</span>
                <span className="font-bold">{activeBatch.year} Year • Sec {activeBatch.section}</span>
              </div>
              <div className="flex justify-between text-red-600 dark:text-red-400 font-bold pt-1 border-t border-border">
                <span>Condonation Risk:</span>
                <span>{activeBatch.riskStudentsCount} Students (&lt;65%)</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-text-secondary">No active attendance batch uploaded yet.</p>
          )}

          <Link
            to="/attendance"
            className="w-full py-2 bg-muted hover:bg-muted/80 text-text-primary rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <span>Open Attendance Module</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Latest Recruitment Drive */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Latest Recruitment Drive</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
              CAMPUS HIRING
            </span>
          </div>

          {companyVisits.length > 0 && (
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
              <div className="font-bold text-text-primary">{companyVisits[0].companyName}</div>
              <div className="flex items-center justify-between text-[11px] text-text-secondary">
                <span>{companyVisits[0].visitDate} ({companyVisits[0].mode})</span>
                <span className="font-bold text-emerald-600">{companyVisits[0].status}</span>
              </div>
              <p className="text-[10px] text-text-secondary">
                Roles: {companyVisits[0].roles.map((r) => `${r.roleName} (${r.packageLPA} LPA)`).join(', ')}
              </p>
            </div>
          )}

          <Link
            to="/placements/companies"
            className="w-full py-2 bg-muted hover:bg-muted/80 text-text-primary rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <span>View All Company Drives</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Key Quick Actions */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Direct Portal Shortcuts</span>
          </h3>

          <div className="space-y-2 text-xs">
            <Link
              to="/attendance"
              className="p-2.5 rounded-xl border border-border hover:border-indigo-500 flex items-center justify-between hover:bg-muted/30 transition-all"
            >
              <span className="font-semibold">Import Attendance Spreadsheet</span>
              <ChevronRight size={14} className="text-text-secondary" />
            </Link>
            <Link
              to="/community-service-projects"
              className="p-2.5 rounded-xl border border-border hover:border-indigo-500 flex items-center justify-between hover:bg-muted/30 transition-all"
            >
              <span className="font-semibold">Add Community Service Project</span>
              <ChevronRight size={14} className="text-text-secondary" />
            </Link>
            <Link
              to="/placements/campus"
              className="p-2.5 rounded-xl border border-border hover:border-indigo-500 flex items-center justify-between hover:bg-muted/30 transition-all"
            >
              <span className="font-semibold">Add Campus Placement Offer</span>
              <ChevronRight size={14} className="text-text-secondary" />
            </Link>
            <Link
              to="/bos"
              className="p-2.5 rounded-xl border border-border hover:border-indigo-500 flex items-center justify-between hover:bg-muted/30 transition-all"
            >
              <span className="font-semibold">Create BoS Meeting Package</span>
              <ChevronRight size={14} className="text-text-secondary" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

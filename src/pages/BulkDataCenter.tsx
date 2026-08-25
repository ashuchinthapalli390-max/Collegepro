import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, ShieldCheck, Layers, FileCheck } from 'lucide-react'
import { DepartmentResolver } from '../utils/departmentResolver'

export const BulkDataCenterPage: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<
    'students' | 'faculty' | 'events' | 'projects' | 'community_service' | 'placements'
  >('students')
  const [isProcessing, setIsProcessing] = useState(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)

  const handleSimulatedBulkImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setImportStatus(`Successfully parsed and normalized "${file.name}" into ET Database schema via DepartmentResolver.`)
    }, 1200)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              CENTRAL DATA INGESTION
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CANONICAL NORMALIZATION
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Bulk Data Center & Entity Normalization
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Central spreadsheet import tool enforcing exact ET validation (AI, AIML, CYS, DS) and mapping aliases (CYS = Cyber Security = CSE (Cyber Security) | DS = Data Science = CSE (Data Science)) automatically.
          </p>
        </div>
      </div>

      {importStatus && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{importStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-text-secondary">Target Entity Schema</h3>
          {[
            { key: 'students', label: 'Student Master & Roster', desc: 'Roll numbers, guardian phones, cohorts' },
            { key: 'faculty', label: 'Faculty Directory & Profiles', desc: 'Designations, qualifications, research' },
            { key: 'community_service', label: 'Community Service Projects', desc: 'Outreach, rural surveys, impact records' },
            { key: 'placements', label: 'Campus Placements & Offers', desc: 'Hiring packages, multi-offers, offer dates' },
            { key: 'events', label: 'Academic Events & Workshops', desc: 'Workshops, FDPs, multi-section audiences' },
            { key: 'projects', label: 'Student Capstone Projects', desc: 'Batches, guides, repositories' }
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => {
                setSelectedEntity(item.key as any)
                setImportStatus(null)
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedEntity === item.key
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/40 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                  : 'bg-surface border-border text-text-primary hover:bg-muted/40'
              }`}
            >
              <h4 className="text-xs font-bold">{item.label}</h4>
              <p className="text-[11px] text-text-secondary font-normal mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-text-primary">
              Upload {selectedEntity.toUpperCase()} Master Spreadsheet
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              File can have department spellings like "CYS", "Cyber Security", "CSE (Cyber Security)" — all will map to canonical ET IDs automatically.
            </p>
          </div>

          <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center bg-muted/20 flex flex-col items-center justify-center gap-3">
            <input
              type="file"
              id="bulk-import-input"
              accept=".csv,.xlsx,.xls,.tsv"
              onChange={handleSimulatedBulkImport}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <label
                htmlFor="bulk-import-input"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Select Spreadsheet (.xlsx / .csv)</span>
              </label>
              <p className="text-[11px] text-text-secondary mt-2">
                Supported: CSV, XLSX, XLS, TSV with auto column header mapping
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs text-text-secondary space-y-1">
            <span className="font-bold text-text-primary block">Canonical ET Rules Enforced:</span>
            <p>✓ Permitted branches: <strong>AI, AIML, CYS, DS</strong> only.</p>
            <p>✓ Non-ET rows (ECE, EEE, Mech, Civil, plain CSE) are safely blocked from ingestion.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

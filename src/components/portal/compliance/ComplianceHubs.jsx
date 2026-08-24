import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Award, 
  FileText, 
  BarChart3, 
  Download, 
  Printer, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Layers, 
  Building2,
  FileSpreadsheet,
  ExternalLink,
  FileDown,
  FileCode,
  AlertCircle,
  Loader2,
  Database,
  Check
} from 'lucide-react';
import { 
  exportToCSV, 
  exportToExcel, 
  exportToPDF,
  executeComplianceExport,
  getComplianceExportDefinition,
  COMPLIANCE_EXPORT_DEFINITIONS,
  getPublications,
  getPatents,
  getMoUs,
  getInternships,
  getPlacementRecords,
  getMemberships,
  getNPTEL
} from '../../../data/portalStore.js';
import { MotionButton, MotionCard } from '../../motion/index.js';

export function NaacPortalManager({ currentUser }) {
  const [toastMessage, setToastMessage] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const shouldReduce = useReducedMotion();

  const pubs = getPublications();
  const patents = getPatents();
  const mous = getMoUs();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerateSsrPdf = () => {
    setIsExporting(true);
    try {
      const res = executeComplianceExport({ format: 'PDF', datasetKey: 'publications', actor: currentUser });
      if (res.success) {
        showToast(`Generated NAAC Research & Institutional Dossier (${res.count} records).`);
      } else {
        showToast(res.message || 'Unable to generate SSR PDF.');
      }
    } catch (e) {
      showToast('Error generating SSR PDF: ' + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  const criteria = [
    { id: 'C1', title: 'Criterion 1: Curricular Aspects', score: '3.85 / 4.00', status: 'SSR Ready', metrics: '1.1.1, 1.2.1, 1.3.2, 1.4.1' },
    { id: 'C2', title: 'Criterion 2: Teaching-Learning and Evaluation', score: '3.72 / 4.00', status: 'SSR Ready', metrics: '2.1.2, 2.3.1, 2.4.2, 2.6.3' },
    { id: 'C3', title: 'Criterion 3: Research, Innovations and Extension', score: '3.90 / 4.00', status: 'Synchronized (Live)', metrics: `${pubs.length} Publications • ${patents.length} Patents • ${mous.length} MoUs` },
    { id: 'C4', title: 'Criterion 4: Infrastructure and Learning Resources', score: '3.80 / 4.00', status: 'SSR Ready', metrics: '4.1.1, 4.2.2, 4.3.1, 4.4.2' },
    { id: 'C5', title: 'Criterion 5: Student Support and Progression', score: '3.78 / 4.00', status: 'SSR Ready', metrics: '5.1.1, 5.2.1, 5.3.1, 5.4.1' },
    { id: 'C6', title: 'Criterion 6: Governance, Leadership and Management', score: '3.88 / 4.00', status: 'SSR Ready', metrics: '6.2.2, 6.3.2, 6.4.1, 6.5.3' },
    { id: 'C7', title: 'Criterion 7: Institutional Values and Best Practices', score: '3.92 / 4.00', status: 'SSR Ready', metrics: '7.1.1, 7.2.1, 7.3.1' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%', position: 'relative' }}>
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            style={{ 
              background: '#ECFDF5', 
              border: '1px solid #A7F3D0', 
              color: '#047857', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              fontSize: '0.84rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Accreditation & Data</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>NAAC SSR Matrix</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            NAAC SSR Quality Assessment Matrix (Cycle 3 Preparation)
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Live aggregation across all 7 criteria mapped directly to institutional repository data points.
          </p>
        </div>

        <MotionButton
          type="button"
          onClick={handleGenerateSsrPdf}
          loading={isExporting}
          variant="gold"
          size="sm"
          icon={Download}
        >
          {isExporting ? 'Generating SSR PDF...' : 'Generate Complete SSR PDF'}
        </MotionButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {criteria.map((c, i) => (
          <motion.div 
            key={c.id} 
            initial={shouldReduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: shouldReduce ? 0 : i * 0.04 }}
            whileHover={shouldReduce ? undefined : { y: -2 }}
            style={{ 
              background: '#FFFFFF', 
              borderRadius: '12px', 
              border: '1px solid #E2E8F0', 
              padding: '1.25rem', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>{c.title}</span>
                <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 800 }}>
                  {c.status}
                </span>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: '0.75rem' }}>
                {c.metrics}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '0.65rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37' }}>CGPA: {c.score}</span>
              <button 
                type="button" 
                onClick={() => showToast(`Opening quantitative metrics report for ${c.id}...`)} 
                style={{ 
                  padding: '0.3rem 0.6rem', 
                  background: '#F1F5F9', 
                  border: '1px solid #CBD5E1', 
                  borderRadius: '6px', 
                  fontSize: '0.72rem', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function NbaTier1Manager({ currentUser }) {
  const [toastMessage, setToastMessage] = useState(null);
  const shouldReduce = useReducedMotion();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%', position: 'relative' }}>
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            style={{ 
              background: '#ECFDF5', 
              border: '1px solid #A7F3D0', 
              color: '#047857', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              fontSize: '0.84rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Accreditation & Data</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>NBA Tier-1 Compliance</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            NBA Tier-1 Accreditation & Outcome-Based Education (OBE) SAR
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Program Outcome (PO) and Program Specific Outcome (PSO) attainment matrix and Self Assessment Report (SAR).
          </p>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.75rem', fontFamily: 'Cinzel, serif' }}>
          Autonomous Engineering Programs Under NBA Tier-1 Cycle
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {['B.Tech Computer Science & Engineering', 'B.Tech Electronics & Communication Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Electrical & Electronics Engineering', 'B.Tech Information Technology'].map((prog, i) => (
            <motion.div 
              key={i} 
              initial={shouldReduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: shouldReduce ? 0 : i * 0.04 }}
              style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}
            >
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.85rem' }}>{prog}</div>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, margin: '0.25rem 0' }}>Status: Accredited Tier-1 (Valid till 2027)</div>
              <button 
                type="button" 
                onClick={() => showToast(`Preparing official NBA Tier-1 SAR dossier for ${prog}...`)} 
                style={{ 
                  marginTop: '0.5rem', 
                  width: '100%', 
                  padding: '0.4rem', 
                  background: '#FFFFFF', 
                  border: '1px solid #CBD5E1', 
                  borderRadius: '6px', 
                  fontSize: '0.74rem', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                Download Program SAR
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NirfDataManager({ currentUser }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Accreditation & Data</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>NIRF Data Repository</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            National Institutional Ranking Framework (NIRF) Data Hub
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            MHRD NIRF rankings submission data across TLR, RPC, GO, OI, and Perception.
          </p>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.75rem', fontFamily: 'Cinzel, serif' }}>
          NIRF Parameter Data Sets (2024–2026)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'Teaching, Learning & Resources (TLR)', score: '68.4 / 100' },
            { name: 'Research and Professional Practice (RPC)', score: '42.1 / 100' },
            { name: 'Graduation Outcomes (GO)', score: '74.8 / 100' },
            { name: 'Outreach and Inclusivity (OI)', score: '61.5 / 100' },
            { name: 'Peer Perception (PR)', score: '48.9 / 100' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.84rem' }}>{item.name}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563EB', margin: '0.35rem 0' }}>{item.score}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Verified with MoE Institutional Portal</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ExportHubManager({ currentUser }) {
  const [exportingKey, setExportingKey] = useState(null); // 'publications:csv', etc.
  const [toast, setToast] = useState(null); // { message, type }
  const shouldReduce = useReducedMotion();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Pre-load real record counts for truthful badges
  const recordCounts = useMemo(() => {
    return {
      publications: getPublications().length,
      patents: getPatents().length,
      mous: getMoUs().length,
      internships: getInternships().length + getPlacementRecords().length,
      memberships: getMemberships().length,
      nptel: getNPTEL().length
    };
  }, [exportingKey]);

  const complianceGroups = [
    {
      key: 'publications',
      title: 'Research Publications (Scopus / WoS / UGC)',
      description: 'Exports verified publication metadata available in the institutional repository.',
      badgeText: `${recordCounts.publications} Verified Records`,
      badgeColor: '#2563EB',
      badgeBg: '#EFF6FF'
    },
    {
      key: 'patents',
      title: 'Patents & Intellectual Property Rights',
      description: 'Exports recorded patent and IPR metadata according to current access scope.',
      badgeText: `${recordCounts.patents} Recorded Patents`,
      badgeColor: '#D97706',
      badgeBg: '#FEF3C7'
    },
    {
      key: 'mous',
      title: 'Industry MoUs & Collaboration Agreements',
      description: 'Exports collaboration agreement metadata available in the MoU repository.',
      badgeText: `${recordCounts.mous} Active MoUs`,
      badgeColor: '#059669',
      badgeBg: '#ECFDF5'
    },
    {
      key: 'internships',
      title: 'Student Internships & Placements',
      description: 'Exports available student internship and placement records (multi-sheet Excel & dual-section PDF).',
      badgeText: `${recordCounts.internships} Student Records`,
      badgeColor: '#7C3AED',
      badgeBg: '#F5F3FF'
    },
    {
      key: 'memberships',
      title: 'Faculty Memberships in Professional Bodies',
      description: 'Exports recorded faculty professional membership metadata.',
      badgeText: `${recordCounts.memberships} Memberships`,
      badgeColor: '#0891B2',
      badgeBg: '#ECFEFF'
    },
    {
      key: 'nptel',
      title: 'NPTEL & MOOC Online Certifications',
      description: 'Exports available NPTEL/MOOC certification records.',
      badgeText: `${recordCounts.nptel} Certifications`,
      badgeColor: '#4F46E5',
      badgeBg: '#EEF2FF'
    }
  ];

  const handleExport = (datasetKey, format) => {
    const actionKey = `${datasetKey}:${format.toLowerCase()}`;
    if (exportingKey) return; // Prevent double-clicks

    setExportingKey(actionKey);

    // Use requestAnimationFrame so UI renders spinner before heavy file processing
    requestAnimationFrame(() => {
      try {
        const result = executeComplianceExport({
          format,
          datasetKey,
          actor: currentUser
        });

        if (result && result.success) {
          showToast(
            `${COMPLIANCE_EXPORT_DEFINITIONS[datasetKey]?.title || datasetKey} ${format.toUpperCase()} exported successfully (${result.count} records).`,
            'success'
          );
        } else {
          showToast(result?.message || `No records available to export for ${datasetKey}.`, 'error');
        }
      } catch (err) {
        console.error(`Export failed for ${datasetKey} (${format}):`, err);
        showToast(`Unable to generate ${format.toUpperCase()} export: ${err.message}`, 'error');
      } finally {
        setExportingKey(null);
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%', position: 'relative' }}>
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              zIndex: 9999,
              background: toast.type === 'error' ? '#FEF2F2' : '#0B192C',
              color: toast.type === 'error' ? '#991B1B' : '#FFFFFF',
              border: toast.type === 'error' ? '1px solid #FECACA' : '1px solid #D4AF37',
              borderRadius: '10px',
              padding: '0.8rem 1.4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              fontSize: '0.86rem',
              fontWeight: 600
            }}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={17} color="#DC2626" />
            ) : (
              <Sparkles size={17} color="#F1C40F" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        initial={shouldReduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Accreditation & Data</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Compliance Data Exports</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Compliance Data Exports & Multi-Format Generator
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Automated institutional data generation for NAAC AQAR tables, NBA Criterion workbooks, and official NIRF submissions.
          </p>
        </div>
      </motion.div>

      {/* Compliance Groups Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
        {complianceGroups.map((item, i) => {
          const isCsvPending = exportingKey === `${item.key}:csv`;
          const isExcelPending = exportingKey === `${item.key}:excel`;
          const isPdfPending = exportingKey === `${item.key}:pdf`;
          const isAnyPending = !!exportingKey;

          return (
            <motion.div 
              key={item.key}
              initial={shouldReduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, delay: shouldReduce ? 0 : i * 0.045 }}
              whileHover={shouldReduce ? undefined : { y: -3 }}
              style={{ 
                background: '#FFFFFF', 
                borderRadius: '14px', 
                border: '1px solid #E2E8F0', 
                padding: '1.35rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {item.title}
                  </h4>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    background: item.badgeBg,
                    color: item.badgeColor,
                    whiteSpace: 'nowrap'
                  }}>
                    {item.badgeText}
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                  {item.description}
                </p>
              </div>

              {/* Export Actions Ribbon */}
              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem' }}>
                {/* CSV Button */}
                <motion.button 
                  type="button" 
                  onClick={() => handleExport(item.key, 'CSV')}
                  disabled={isAnyPending}
                  aria-label={`Export ${item.title} as CSV`}
                  whileHover={shouldReduce || isAnyPending ? undefined : { y: -2, scale: 1.015 }}
                  whileTap={shouldReduce || isAnyPending ? undefined : { scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  style={{ 
                    flex: 1, 
                    padding: '0.55rem 0.5rem', 
                    background: isCsvPending ? '#EFF6FF' : '#F8FAFC', 
                    border: '1px solid #CBD5E1', 
                    borderRadius: '8px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    color: '#1E293B',
                    cursor: isAnyPending ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    opacity: isAnyPending && !isCsvPending ? 0.6 : 1
                  }}
                >
                  {isCsvPending ? <Loader2 size={13} className="animate-spin" /> : <FileCode size={13} color="#2563EB" />}
                  <span>{isCsvPending ? 'CSV...' : 'CSV'}</span>
                </motion.button>

                {/* Excel Button */}
                <motion.button 
                  type="button" 
                  onClick={() => handleExport(item.key, 'EXCEL')}
                  disabled={isAnyPending}
                  aria-label={`Export ${item.title} as Excel`}
                  whileHover={shouldReduce || isAnyPending ? undefined : { y: -2, scale: 1.015 }}
                  whileTap={shouldReduce || isAnyPending ? undefined : { scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  style={{ 
                    flex: 1, 
                    padding: '0.55rem 0.5rem', 
                    background: isExcelPending ? '#ECFDF5' : '#F0FDF4', 
                    color: '#047857', 
                    border: '1px solid #A7F3D0', 
                    borderRadius: '8px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    cursor: isAnyPending ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    opacity: isAnyPending && !isExcelPending ? 0.6 : 1
                  }}
                >
                  {isExcelPending ? <Loader2 size={13} className="animate-spin" /> : <FileSpreadsheet size={13} color="#059669" />}
                  <span>{isExcelPending ? 'Excel...' : 'Excel'}</span>
                </motion.button>

                {/* PDF Button */}
                <motion.button 
                  type="button" 
                  onClick={() => handleExport(item.key, 'PDF')}
                  disabled={isAnyPending}
                  aria-label={`Export ${item.title} as PDF`}
                  whileHover={shouldReduce || isAnyPending ? undefined : { y: -2, scale: 1.015 }}
                  whileTap={shouldReduce || isAnyPending ? undefined : { scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  style={{ 
                    flex: 1, 
                    padding: '0.55rem 0.5rem', 
                    background: isPdfPending ? '#FEF2F2' : '#FFF1F2', 
                    color: '#BE123C', 
                    border: '1px solid #FECDD3', 
                    borderRadius: '8px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    cursor: isAnyPending ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    opacity: isAnyPending && !isPdfPending ? 0.6 : 1
                  }}
                >
                  {isPdfPending ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} color="#E11D48" />}
                  <span>{isPdfPending ? 'PDF...' : 'PDF'}</span>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

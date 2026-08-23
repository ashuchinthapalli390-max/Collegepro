import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Award, 
  FileText, 
  Lightbulb, 
  Users, 
  Briefcase, 
  BookOpen, 
  Download, 
  Printer, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { 
  getPublications, 
  getPatents, 
  getMoUs, 
  getInternships, 
  getStudentAchievements,
  getFDPs,
  getFacultyAchievements,
  getMemberships,
  getNPTEL,
  exportToExcel,
  exportToPDF,
  exportToCSV
} from '../../../data/portalStore.js';
import { DEPARTMENTS } from '../../../data/masterData.js';
import { 
  MotionPage, 
  ModulePageHeader, 
  AnimatedKpiGrid, 
  MotionKpiCard, 
  MotionTable, 
  MotionTableRow, 
  MotionEmptyState,
  MotionButton 
} from '../../motion/index.js';

export default function AnalyticsView({ currentUser, onNavigate }) {
  const pubs = getPublications();
  const patents = getPatents();
  const mous = getMoUs();
  const internships = getInternships();
  const achievements = getStudentAchievements();
  const fdps = getFDPs();
  const memberships = getMemberships();
  const nptel = getNPTEL();

  // Departmental Research Velocity Breakdown
  const deptBreakdown = useMemo(() => {
    return DEPARTMENTS.map(d => {
      const dPubs = pubs.filter(p => (p.department || '').toLowerCase().includes(d.code.toLowerCase())).length;
      const dPatents = patents.filter(p => (p.department || '').toLowerCase().includes(d.code.toLowerCase())).length;
      const dInternships = internships.filter(i => (i.branch || i.department || '').toLowerCase().includes(d.code.toLowerCase())).length;
      const dMemberships = memberships.filter(m => (m.department || '').toLowerCase().includes(d.code.toLowerCase())).length;
      const dNptel = nptel.filter(n => (n.department || '').toLowerCase().includes(d.code.toLowerCase())).length;
      const score = dPubs * 3 + dPatents * 5 + dInternships * 1 + dMemberships * 2 + dNptel * 2;
      return {
        code: d.code,
        name: d.name,
        pubs: dPubs,
        patents: dPatents,
        internships: dInternships,
        memberships: dMemberships,
        nptel: dNptel,
        score
      };
    }).sort((a, b) => b.score - a.score);
  }, [pubs, patents, internships, memberships, nptel]);

  return (
    <MotionPage style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      {/* 1. Header */}
      <ModulePageHeader
        breadcrumbs={[
          { label: 'Dashboard' },
          { label: 'Governance' },
          { label: 'Executive Analytics' }
        ]}
        title="Institutional Velocity & Performance Analytics"
        subtitle="Cross-departmental research indexing velocity, IP generation, MoUs, faculty achievements, and accreditation indices."
        onExportCSV={() => exportToCSV('analytics_overview')}
        onExportExcel={() => exportToExcel('analytics_overview')}
        onExportPDF={() => exportToPDF('analytics_overview')}
      />

      {/* 2. KPI Summary Cards */}
      <AnimatedKpiGrid minWidth="150px">
        <MotionKpiCard label="Research Papers" value={pubs.length} icon={FileText} color="#2563EB" bg="#EFF6FF" />
        <MotionKpiCard label="Patents / IPR" value={patents.length} icon={Lightbulb} color="#D97706" bg="#FEFCE8" />
        <MotionKpiCard label="Active MoUs" value={mous.length} icon={Award} color="#7C3AED" bg="#F5F3FF" />
        <MotionKpiCard label="Student Internships" value={internships.length} icon={Briefcase} color="#0D9488" bg="#F0FDFA" />
        <MotionKpiCard label="Student Honors" value={achievements.length} icon={Sparkles} color="#EC4899" bg="#FDF2F8" />
        <MotionKpiCard label="Faculty Memberships" value={memberships.length} icon={Users} color="#059669" bg="#ECFDF5" />
      </AnimatedKpiGrid>

      {/* 3. Departmental Velocity Leaderboard */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0' }}>
          Departmental Research & Accreditation Velocity Breakdown
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Department</th>
                <th style={{ padding: '0.75rem 1rem' }}>Publications</th>
                <th style={{ padding: '0.75rem 1rem' }}>Patents</th>
                <th style={{ padding: '0.75rem 1rem' }}>Memberships</th>
                <th style={{ padding: '0.75rem 1rem' }}>NPTEL / MOOC</th>
                <th style={{ padding: '0.75rem 1rem' }}>Internships</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Velocity Index</th>
              </tr>
            </thead>
            <tbody>
              {deptBreakdown.map((dept, idx) => (
                <tr key={dept.code} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50">
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{dept.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700 }}>Code: {dept.code}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#2563EB' }}>{dept.pubs}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#D97706' }}>{dept.patents}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>{dept.memberships}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0D9488' }}>{dept.nptel}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#7C3AED' }}>{dept.internships}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.75rem' }}>
                      {dept.score} pts
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MotionPage>
  );
}

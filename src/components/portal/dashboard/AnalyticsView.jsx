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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Executive Intelligence</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Quick Analytics</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Executive Analytics & Performance Insights
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Real-time cross-departmental research velocity, NAAC Criterion 3 indexing, student outcome metrics, and MoUs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => exportToCSV('publications')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => exportToExcel('publications')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#10B981', cursor: 'pointer' }}
          >
            <FileText size={14} /> Excel Summary
          </button>
        </div>
      </div>

      {/* Top Level Metric Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem' }}>
        {[
          { label: 'Total Publications', value: pubs.length, color: '#2563EB', icon: FileText, bg: '#EFF6FF' },
          { label: 'Patents & IPR', value: patents.length, color: '#D97706', icon: Lightbulb, bg: '#FEFCE8' },
          { label: 'Active MoUs', value: mous.length, color: '#059669', icon: Award, bg: '#ECFDF5' },
          { label: 'Student Internships', value: internships.length, color: '#7C3AED', icon: Briefcase, bg: '#F5F3FF' },
          { label: 'Student Awards', value: achievements.length, color: '#DC2626', icon: Award, bg: '#FEF2F2' },
          { label: 'NPTEL Certified', value: nptel.length, color: '#0D9488', icon: BookOpen, bg: '#F0FDFA' }
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} style={{ background: k.bg, padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>{k.label}</span>
                <Icon size={16} style={{ color: k.color }} />
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: k.color, fontFamily: 'Cinzel, serif' }}>{k.value}</div>
            </div>
          );
        })}
      </div>

      {/* Departmental Performance Matrix */}
      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0', fontFamily: 'Cinzel, serif' }}>
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
    </div>
  );
}

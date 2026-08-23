import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { 
  exportToCSV, 
  exportToExcel, 
  exportToPDF,
  getPublications,
  getPatents,
  getMoUs,
  getInternships,
  getMemberships,
  getNPTEL
} from '../../../data/portalStore.js';

export function NaacPortalManager({ currentUser }) {
  const pubs = getPublications();
  const patents = getPatents();
  const mous = getMoUs();

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Accreditation & Data</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>NAAC SSR Documentation</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            NAAC SSR Accreditation & Qualitative Metrics Hub
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Automated institutional Self Study Report (SSR) data aggregation across all 7 Criteria for NAAC A+ Cycle.
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportToPDF('publications')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#070F1E', color: '#F1C40F', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, border: 'none', cursor: 'pointer' }}
        >
          <Download size={14} /> Generate Complete SSR PDF
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {criteria.map(c => (
          <div key={c.id} style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
              <button type="button" onClick={() => alert(`Opening criteria data for ${c.id}`)} style={{ padding: '0.3rem 0.6rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NbaTier1Manager({ currentUser }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
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
            <div key={i} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.85rem' }}>{prog}</div>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, margin: '0.25rem 0' }}>Status: Accredited Tier-1 (Valid till 2027)</div>
              <button type="button" onClick={() => alert(`Downloading SAR documentation for ${prog}`)} style={{ marginTop: '0.5rem', width: '100%', padding: '0.4rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}>Download Program SAR</button>
            </div>
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
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
            Single-click generation of NAAC AQAR tables, NBA Criterion Excel sheets, and NIRF CSV archives.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {[
          { title: 'Research Publications (Scopus / WoS / UGC)', key: 'publications' },
          { title: 'Patents & Intellectual Property Rights', key: 'patents' },
          { title: 'Industry MoUs & Collaboration Agreements', key: 'mous' },
          { title: 'Student Internships & Placements', key: 'internships' },
          { title: 'Faculty Memberships in Professional Bodies', key: 'memberships' },
          { title: 'NPTEL & MOOC Online Certifications', key: 'nptel' }
        ].map((item, i) => (
          <div key={i} style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem' }}>{item.title}</h4>
              <p style={{ fontSize: '0.74rem', color: '#64748B', margin: '0 0 1rem' }}>Includes complete institutional metadata and verified dates.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button type="button" onClick={() => exportToCSV(item.key)} style={{ flex: 1, padding: '0.4rem', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>CSV</button>
              <button type="button" onClick={() => exportToExcel(item.key)} style={{ flex: 1, padding: '0.4rem', background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>Excel</button>
              <button type="button" onClick={() => exportToPDF(item.key)} style={{ flex: 1, padding: '0.4rem', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

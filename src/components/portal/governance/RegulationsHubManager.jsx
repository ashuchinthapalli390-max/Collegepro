import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Download, 
  ChevronRight, 
  Layers, 
  CheckCircle2,
  Plus
} from 'lucide-react';

export default function RegulationsHubManager({ currentUser }) {
  const regulations = [
    { code: 'R24', title: 'Autonomous Academic Regulations R24 (CBCS & NEP-2020 Aligned)', effectiveBatch: '2024-2028 Onwards', programs: 'B.Tech, M.Tech, MCA, MBA', credits: 160, status: 'Active (Current)', pdf: 'NEC_R24_Academic_Regulations.pdf' },
    { code: 'R20', title: 'Autonomous Academic Regulations R20 (Outcome Based Education)', effectiveBatch: '2020-2024 Batches', programs: 'B.Tech, M.Tech, MCA, MBA', credits: 160, status: 'Active (Graduating)', pdf: 'NEC_R20_Academic_Regulations.pdf' },
    { code: 'R19', title: 'Autonomous Academic Regulations R19', effectiveBatch: '2019-2023 Batches', programs: 'B.Tech, M.Tech', credits: 160, status: 'Archived', pdf: 'NEC_R19_Academic_Regulations.pdf' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Academic Governance</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Curriculum & Regulations</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Autonomous Academic Regulations & Course Schemes
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Institutional credit framework, evaluation guidelines, minor/honors degrees, and curriculum structures.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('New Academic Regulation upload dialog.')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)', color: '#070F1E', padding: '0.55rem 1.05rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={15} /> Upload Regulation Document
        </button>
      </div>

      {/* Regulations List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {regulations.map(r => (
          <div key={r.code} style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ maxWidth: '650px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Cinzel, serif' }}>{r.title}</span>
                <span style={{ background: r.status.includes('Active') ? '#ECFDF5' : '#F1F5F9', color: r.status.includes('Active') ? '#047857' : '#64748B', border: `1px solid ${r.status.includes('Active') ? '#A7F3D0' : '#CBD5E1'}`, padding: '0.15rem 0.55rem', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 800 }}>
                  {r.status}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                Applicability: <strong>{r.effectiveBatch}</strong> • Applicable Programs: <strong>{r.programs}</strong> • Total Graduation Credits: <strong>{r.credits} Credits</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Downloading official PDF for ${r.code} Academic Regulations`)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', background: '#070F1E', color: '#F1C40F', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
            >
              <Download size={14} /> Download {r.code} Regulations PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

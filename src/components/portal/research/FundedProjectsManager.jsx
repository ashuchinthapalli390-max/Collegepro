import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Building2,
  DollarSign
} from 'lucide-react';
import { DEPARTMENTS } from '../../../data/masterData.js';

export default function FundedProjectsManager({ currentUser }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const fundedProjects = [
    { id: 'FND-2024-001', projectTitle: 'Design and Development of AI-powered Edge IoT Gateway for Smart Agriculture', fundingAgency: 'DST-SERB (Government of India)', sanctionedAmount: '₹ 28,50,000', principalInvestigator: 'Dr. S. Venkateswarlu', coPi: 'Dr. B. Jhansi Vazram', department: 'CSE', duration: '3 Years (2024-2027)', status: 'Ongoing', sanctionLetter: 'DST_SERB_Sanction_2024.pdf' },
    { id: 'FND-2023-002', projectTitle: 'AICTE IDEA Lab Establishment for Hands-on Prototyping and STEM Education', fundingAgency: 'AICTE (New Delhi)', sanctionedAmount: '₹ 55,00,000', principalInvestigator: 'Dr. M. Sreenivasa Kumar', coPi: 'Dr. V. Venkata Rao', department: 'Institutional', duration: '2 Years (2023-2025)', status: 'Active & Operational', sanctionLetter: 'AICTE_IDEA_Lab_Grant.pdf' },
    { id: 'FND-2022-003', projectTitle: 'Modernization of Advanced VLSI and Embedded Systems Laboratory (MODROBS)', fundingAgency: 'AICTE MODROBS Scheme', sanctionedAmount: '₹ 18,20,000', principalInvestigator: 'Dr. V. Venkata Rao', coPi: 'Dr. P. Lakshmanan', department: 'ECE', duration: '2 Years (2022-2024)', status: 'Successfully Completed', sanctionLetter: 'MODROBS_Sanction_ECE.pdf' }
  ];

  const filtered = fundedProjects.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.projectTitle.toLowerCase().includes(q) || p.fundingAgency.toLowerCase().includes(q) || p.principalInvestigator.toLowerCase().includes(q);
    const matchDept = deptFilter === 'ALL' || p.department.toLowerCase().includes(deptFilter.toLowerCase());
    return matchQ && matchDept;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Research & Publications</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Funded Research Projects</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Extramural Funded Research Projects & Grants
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Track sponsored research grants from DST, SERB, AICTE, UGC, DRDO, and private industrial bodies.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('New funded research project grant dialog opened.')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)', color: '#070F1E', padding: '0.55rem 1.05rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={15} /> Record Funded Grant
        </button>
      </div>

      {/* Filter Row */}
      <div style={{ background: '#FFFFFF', padding: '0.9rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search projects by title, agency, PI name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '220px', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
        />
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
        >
          <option value="ALL">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.code}</option>)}
        </select>
      </div>

      {/* Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.74rem', color: '#D4AF37', fontWeight: 800 }}>{p.id} • {p.department}</span>
                <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 800 }}>
                  {p.status}
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem', fontFamily: 'Cinzel, serif' }}>
                {p.projectTitle}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4 }}>
                Funding Agency: <strong>{p.fundingAgency}</strong> • Sanctioned Grant: <strong style={{ color: '#059669' }}>{p.sanctionedAmount}</strong>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '0.35rem' }}>
                Principal Investigator (PI): <strong>{p.principalInvestigator}</strong> (Co-PI: {p.coPi}) • Duration: {p.duration}
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Downloading Sanction Order Copy for ${p.id}`)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.85rem', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}
            >
              <Download size={13} /> Sanction Order Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

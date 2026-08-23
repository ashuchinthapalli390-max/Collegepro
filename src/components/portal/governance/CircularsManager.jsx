import React, { useState } from 'react';
import { 
  Mail, 
  Plus, 
  Search, 
  Download, 
  FileText, 
  Calendar, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer
} from 'lucide-react';
import { INITIAL_NEWS, INITIAL_EXAM_NOTIFICATIONS } from '../../../data/masterData.js';

export default function CircularsManager({ currentUser }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const newsItems = (INITIAL_NEWS || []).map((n, i) => ({
    id: `CIR-${100 + i}`,
    title: n.title,
    category: 'Official Notice',
    date: n.date || '2026-08-20',
    department: 'Institutional',
    status: 'Active',
    signedBy: 'Principal / Dean Academic'
  }));

  const examItems = (INITIAL_EXAM_NOTIFICATIONS || []).map((e, i) => ({
    id: `EXAM-${200 + i}`,
    title: e.title || e.subject,
    category: 'Examination Circular',
    date: e.date || '2026-08-18',
    department: e.department || 'Autonomous Cell',
    status: 'Published',
    signedBy: 'Controller of Examinations (CoE)'
  }));

  const allCirculars = [...newsItems, ...examItems];

  const filtered = allCirculars.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    const matchType = filterType === 'ALL' || c.category === filterType;
    return matchQ && matchType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Events & Outreach</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Official Circulars & Notices</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Official Circulars & Institutional Orders
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Dispatch, publish, and archive autonomous examination notices, administrative circulars, and orders.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Publishing dialog opened for CoE / Dean Admin.')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)', color: '#070F1E', padding: '0.55rem 1.05rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={15} /> Issue New Circular
        </button>
      </div>

      {/* Filter Row */}
      <div style={{ background: '#FFFFFF', padding: '0.9rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search circulars by title, reference ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '220px', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
        >
          <option value="ALL">All Categories</option>
          <option value="Official Notice">Official Notices</option>
          <option value="Examination Circular">Examination Circulars</option>
        </select>
      </div>

      {/* Circulars Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Reference ID & Date</th>
              <th style={{ padding: '0.75rem 1rem' }}>Subject / Circular Title</th>
              <th style={{ padding: '0.75rem 1rem' }}>Category</th>
              <th style={{ padding: '0.75rem 1rem' }}>Issuing Authority</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50">
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontWeight: 800, color: '#0F172A' }}>{c.id}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{c.date}</div>
                </td>
                <td style={{ padding: '0.85rem 1rem', maxWidth: '380px' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.84rem' }}>{c.title}</div>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, background: c.category === 'Examination Circular' ? '#EFF6FF' : '#FEFCE8', color: c.category === 'Examination Circular' ? '#1D4ED8' : '#A16207' }}>
                    {c.category}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                  {c.signedBy}
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading PDF copy of ${c.id}`)}
                    style={{ padding: '0.35rem 0.65rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#334155', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

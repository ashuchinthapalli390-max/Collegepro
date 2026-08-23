import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Building2,
  Mail,
  Phone
} from 'lucide-react';
import { DEPARTMENTS } from '../../../data/masterData.js';

export default function StaffProfilesManager({ currentUser }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const staffMembers = [
    { id: 'STF-001', name: 'Sri K. Srinivasa Rao', designation: 'Senior Lab Programmer', department: 'CSE', qualification: 'B.Tech, MCA', email: 'ksrao@nrtec.in', phone: '+91 98480 12345', experience: '14 Years' },
    { id: 'STF-002', name: 'Smt. M. Lakshmi', designation: 'Technical Assistant (VLSI)', department: 'ECE', qualification: 'Diploma, B.Tech', email: 'mlakshmi@nrtec.in', phone: '+91 98480 23456', experience: '9 Years' },
    { id: 'STF-003', name: 'Sri P. Venkat Reddy', designation: 'Workshop Superintendent', department: 'Mechanical', qualification: 'DME, B.E.', email: 'pvreddy@nrtec.in', phone: '+91 98480 34567', experience: '18 Years' },
    { id: 'STF-004', name: 'Sri Ch. Anjaneyulu', designation: 'Assistant Administrative Officer', department: 'Administration', qualification: 'M.Com, MBA', email: 'aao@nrtec.in', phone: '+91 98480 45678', experience: '22 Years' },
    { id: 'STF-005', name: 'Sri G. Rajesh', designation: 'Network Administrator & Cyber Ops', department: 'IT', qualification: 'CCNA, B.Tech', email: 'rajesh.net@nrtec.in', phone: '+91 98480 56789', experience: '11 Years' }
  ];

  const filtered = staffMembers.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || s.name.toLowerCase().includes(q) || s.designation.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
    const matchDept = deptFilter === 'ALL' || s.department.toLowerCase().includes(deptFilter.toLowerCase());
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
            <span>Faculty Development</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Staff Profiles</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Technical Cadre & Non-Teaching Staff Directory
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Manage technical lab assistants, network engineers, administrative officers, and workshop cadre records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('New staff profile dialog opened.')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)', color: '#070F1E', padding: '0.55rem 1.05rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={15} /> Add Staff Record
        </button>
      </div>

      {/* Filter Row */}
      <div style={{ background: '#FFFFFF', padding: '0.9rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search staff by name, designation, ID..."
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

      {/* Staff Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map(staff => (
          <div key={staff.id} style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>{staff.name}</div>
                <div style={{ fontSize: '0.74rem', color: '#D4AF37', fontWeight: 700 }}>{staff.designation}</div>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#F1F5F9', color: '#475569' }}>
                {staff.department}
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748B', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div><strong>Qualification:</strong> {staff.qualification}</div>
              <div><strong>Experience:</strong> {staff.experience}</div>
              <div><strong>Email:</strong> {staff.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Award, 
  Search, 
  ShieldCheck, 
  Cpu, 
  GraduationCap, 
  ChevronRight, 
  Filter 
} from 'lucide-react';
import { GOVERNING_BODY, ACADEMIC_COUNCIL, AICTE_IDEA_LAB_TEAM } from '../../data/masterData.js';

export default function GovernanceSection() {
  const [activeTab, setActiveTab] = useState('governing-body');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredGoverningBody = GOVERNING_BODY.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredAcademicCouncil = ACADEMIC_COUNCIL.filter(m => {
    return m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           m.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
           m.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
           m.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <section style={{ padding: '5rem 0', background: '#F8FAFC' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-navy" style={{ marginBottom: '0.6rem' }}>
            Statutory Bodies & Committees
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#0B192C', marginBottom: '0.8rem' }}>
            Institutional Governance
          </h2>
          <p style={{ color: '#64748B', maxWidth: '700px', margin: '0 auto', fontSize: '1rem' }}>
            Narasaraopeta Engineering College operates under statutory guidance from distinguished University nominees, IIT academicians, industry executives, and senior college leadership.
          </p>
        </div>

        {/* Committee Switcher Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <button
            onClick={() => setActiveTab('governing-body')}
            style={{
              padding: '0.75rem 1.6rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.92rem',
              background: activeTab === 'governing-body' ? '#0B192C' : '#FFFFFF',
              color: activeTab === 'governing-body' ? '#FFFFFF' : '#475569',
              border: '1.5px solid ' + (activeTab === 'governing-body' ? '#0B192C' : '#E2E8F0'),
              boxShadow: activeTab === 'governing-body' ? '0 8px 20px rgba(11,25,44,0.15)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ShieldCheck size={18} style={{ color: '#D4AF37' }} /> Governing Body ({GOVERNING_BODY.length})
          </button>

          <button
            onClick={() => setActiveTab('academic-council')}
            style={{
              padding: '0.75rem 1.6rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.92rem',
              background: activeTab === 'academic-council' ? '#0B192C' : '#FFFFFF',
              color: activeTab === 'academic-council' ? '#FFFFFF' : '#475569',
              border: '1.5px solid ' + (activeTab === 'academic-council' ? '#0B192C' : '#E2E8F0'),
              boxShadow: activeTab === 'academic-council' ? '0 8px 20px rgba(11,25,44,0.15)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <GraduationCap size={18} style={{ color: '#D4AF37' }} /> Academic Council ({ACADEMIC_COUNCIL.length})
          </button>

          <button
            onClick={() => setActiveTab('idea-lab')}
            style={{
              padding: '0.75rem 1.6rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.92rem',
              background: activeTab === 'idea-lab' ? '#0B192C' : '#FFFFFF',
              color: activeTab === 'idea-lab' ? '#FFFFFF' : '#475569',
              border: '1.5px solid ' + (activeTab === 'idea-lab' ? '#0B192C' : '#E2E8F0'),
              boxShadow: activeTab === 'idea-lab' ? '0 8px 20px rgba(11,25,44,0.15)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Cpu size={18} style={{ color: '#D4AF37' }} /> AICTE IDEA Lab Team ({AICTE_IDEA_LAB_TEAM.length})
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '1rem 1.5rem',
          border: '1px solid #E2E8F0',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by member name, role, organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          {activeTab === 'governing-body' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>Filter Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-control"
                style={{ width: 'auto', padding: '0.5rem 1rem' }}
              >
                <option value="All">All Categories</option>
                <option value="Management">Management</option>
                <option value="Teachers of the College">Teachers of College</option>
                <option value="University Nominee">University Nominee</option>
                <option value="State Govt. Nominee">State Govt. Nominee</option>
                <option value="Industrialist">Industrialist</option>
                <option value="Principal of College">Principal</option>
              </select>
            </div>
          )}
        </div>

        {/* Governing Body Table / Cards */}
        {activeTab === 'governing-body' && (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#0B192C', color: '#FFFFFF' }}>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>#</th>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>Member Name</th>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>Designation / Organization</th>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>Category</th>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>Role in GB</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGoverningBody.map((member, idx) => (
                    <tr key={member.id} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#64748B' }}>{idx + 1}</td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#0B192C' }}>{member.name}</td>
                      <td style={{ padding: '1rem', color: '#475569' }}>{member.organization}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-navy" style={{ fontSize: '0.75rem' }}>{member.category}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={member.role === 'Chairman' || member.role === 'Member Secretary' ? 'badge badge-gold' : 'badge badge-info'} style={{ fontWeight: 700 }}>
                          {member.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Academic Council Table / Cards */}
        {activeTab === 'academic-council' && (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#0B192C', color: '#FFFFFF' }}>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>#</th>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>Council Member</th>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>Official Designation & Institution</th>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>Affiliation / Domain</th>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>Council Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAcademicCouncil.map((member, idx) => (
                    <tr key={member.id} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#64748B' }}>{idx + 1}</td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#0B192C' }}>{member.name}</td>
                      <td style={{ padding: '1rem', color: '#475569' }}>
                        <div>{member.designation}</div>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{member.organization}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-navy">{member.department}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={member.role === 'Chairman' || member.role === 'Member Secretary' ? 'badge badge-gold' : member.role === 'University Nominee' ? 'badge badge-success' : 'badge badge-info'}>
                          {member.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AICTE IDEA Lab Team */}
        {activeTab === 'idea-lab' && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #070F1E 0%, #122846 100%)',
              borderRadius: '16px',
              padding: '2rem',
              color: '#FFFFFF',
              marginBottom: '2rem',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <Cpu size={28} style={{ color: '#D4AF37' }} />
                <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem' }}>AICTE IDEA Lab Leadership & Mentors</h3>
              </div>
              <p style={{ color: '#CBD5E1', fontSize: '0.95rem', maxWidth: '850px' }}>
                The AICTE IDEA (Idea Development, Evaluation & Application) Lab at Narasaraopeta Engineering College empowers students and faculty across disciplines to convert creative concepts into functional prototypes through rapid manufacturing, embedded IoT, 3D printing, and laser cutting.
              </p>
            </div>

            <div className="grid-3" style={{ gap: '1.5rem' }}>
              {AICTE_IDEA_LAB_TEAM.map(member => (
                <div
                  key={member.id}
                  className="glass-card-light card-hover"
                  style={{
                    padding: '1.5rem',
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <span className="badge badge-gold">{member.role}</span>
                    <span className="badge badge-navy">{member.department}</span>
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B192C', marginBottom: '0.2rem' }}>
                    {member.name}
                  </h4>
                  <div style={{ color: '#64748B', fontSize: '0.85rem' }}>
                    {member.designation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

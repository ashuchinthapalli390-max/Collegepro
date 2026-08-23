import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  FileText, 
  Download, 
  Calendar, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2,
  Users,
  Plus
} from 'lucide-react';
import { ACADEMIC_COUNCIL, GOVERNING_BODY } from '../../../data/masterData.js';

export default function AcademicCouncilManager({ currentUser }) {
  const members = ACADEMIC_COUNCIL || [];

  const councilMeetings = [
    { id: 'ACM-2025-02', meetingNumber: '14th Academic Council Meeting', date: '2025-11-20', venue: 'Board Room, Administrative Block', status: 'Approved & Implemented', agenda: 'Approval of R24 Autonomous Curriculum, AICTE Major/Minor Degrees, and Credit Transfer Regulations.', minutesPdf: 'Academic_Council_14th_Minutes.pdf' },
    { id: 'ACM-2025-01', meetingNumber: '13th Academic Council Meeting', date: '2025-05-18', venue: 'Conference Hall', status: 'Approved & Implemented', agenda: 'Review of End Semester Examination Results, NAAC SSR criterion verification, and new M.Tech Specializations.', minutesPdf: 'Academic_Council_13th_Minutes.pdf' }
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
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Academic Council</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Academic Council Governance & Statutory Minutes
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Official council constitution, statutory meeting resolutions, curriculum ratification, and examination orders.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Record Academic Council meeting dialog opened.')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)', color: '#070F1E', padding: '0.55rem 1.05rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={15} /> Record Council Meeting
        </button>
      </div>

      {/* Council Meetings History */}
      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0', fontFamily: 'Cinzel, serif' }}>
          Statutory Council Meeting Proceedings
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {councilMeetings.map(m => (
            <div key={m.id} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '1.25rem', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>{m.meetingNumber}</span>
                  <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 800 }}>
                    {m.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: '0.5rem' }}>
                  Date: <strong>{m.date}</strong> • Venue: {m.venue}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                  <strong>Agenda & Resolutions:</strong> {m.agenda}
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Downloading signed minutes PDF for ${m.meetingNumber}`)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}
              >
                <Download size={13} /> Signed Minutes PDF
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Council Constitution Grid */}
      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0', fontFamily: 'Cinzel, serif' }}>
          Statutory Academic Council Members & University Nominees ({members.length})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.85rem' }}>
          {members.map((mem, i) => (
            <div key={i} style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.84rem' }}>{mem.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700 }}>{mem.role || mem.designation}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{mem.institution || 'Narasaraopeta Engineering College'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

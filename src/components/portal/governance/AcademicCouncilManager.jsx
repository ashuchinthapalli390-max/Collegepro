import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  Plus, 
  Download, 
  ChevronRight, 
  FileText, 
  Calendar, 
  Award,
  CheckCircle2,
  X
} from 'lucide-react';
import { ACADEMIC_COUNCIL } from '../../../data/masterData.js';

export default function AcademicCouncilManager({ currentUser }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [councilMeetings, setCouncilMeetings] = useState([
    { id: 'ACM-018', meetingNumber: '18th Academic Council Meeting', date: '2024-06-15', venue: 'Board Room, Administrative Block', status: 'Resolutions Ratified', agenda: 'Approval of R24 Autonomous Curriculum Structure, AICTE IDEA lab course integrations, and examination reforms.', minutesPdf: '18th_Academic_Council_Minutes.pdf' },
    { id: 'ACM-017', meetingNumber: '17th Academic Council Meeting', date: '2023-11-20', venue: 'Board Room, Administrative Block', status: 'Minutes Approved', agenda: 'Review of BoS recommendations for AI&ML and Data Science specializations, MOOC credits transfer guidelines.', minutesPdf: '17th_Academic_Council_Minutes.pdf' }
  ]);

  const [newMeeting, setNewMeeting] = useState({
    meetingNumber: '',
    date: '',
    venue: 'Board Room, Administrative Block',
    agenda: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRecordMeeting = (e) => {
    e.preventDefault();
    if (!newMeeting.meetingNumber || !newMeeting.date) return;

    setCouncilMeetings([{
      ...newMeeting,
      id: `ACM-${String(councilMeetings.length + 1).padStart(3, '0')}`,
      status: 'Minutes Approved',
      minutesPdf: 'Academic_Council_Minutes.pdf'
    }, ...councilMeetings]);

    setModalOpen(false);
    showToast('Academic Council meeting recorded successfully!');
    setNewMeeting({
      meetingNumber: '',
      date: '',
      venue: 'Board Room, Administrative Block',
      agenda: ''
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: '#0B192C',
          color: '#FFFFFF',
          padding: '0.75rem 1.4rem',
          borderRadius: '10px',
          border: '1px solid #D4AF37',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          zIndex: 7000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.86rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} style={{ color: '#10B981' }} />
          <span>{toastMessage}</span>
        </div>
      )}

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
            Academic Council Proceedings & Constitution
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Official council constitution, statutory meeting resolutions, curriculum ratification, and examination orders.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
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
                onClick={() => showToast(`Signed minutes downloaded for ${m.meetingNumber}`)}
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
          Statutory Council Members ({ACADEMIC_COUNCIL.length})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
          {ACADEMIC_COUNCIL.map(member => (
            <div key={member.id} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '1rem', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#D4AF37' }}>{member.role}</span>
                <span style={{ fontSize: '0.68rem', color: '#64748B' }}>{member.category}</span>
              </div>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem', marginBottom: '0.2rem' }}>
                {member.name}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                {member.designation}, {member.organization}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Meeting Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 15, 30, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 6000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '560px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ padding: '1.2rem 1.5rem', background: '#0B192C', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Record Academic Council Meeting</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleRecordMeeting} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>Meeting Title / Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 19th Academic Council Meeting"
                  value={newMeeting.meetingNumber}
                  onChange={(e) => setNewMeeting({ ...newMeeting, meetingNumber: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>Date *</label>
                  <input
                    type="date"
                    required
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>Venue *</label>
                  <input
                    type="text"
                    required
                    value={newMeeting.venue}
                    onChange={(e) => setNewMeeting({ ...newMeeting, venue: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>Agenda & Resolutions Summary</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Curriculum ratification, autonomous examination reforms..."
                  value={newMeeting.agenda}
                  onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.55rem 1.3rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)', color: '#070F1E', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Proceedings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

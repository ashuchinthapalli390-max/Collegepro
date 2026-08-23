import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Download, 
  ChevronRight, 
  Layers, 
  CheckCircle2,
  Plus,
  X
} from 'lucide-react';

export default function RegulationsHubManager({ currentUser }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [regulations, setRegulations] = useState([
    { code: 'R24', title: 'Autonomous Academic Regulations R24 (CBCS & NEP-2020 Aligned)', effectiveBatch: '2024-2028 Onwards', programs: 'B.Tech, M.Tech, MCA, MBA', credits: 160, status: 'Active (Current)', pdf: 'NEC_R24_Academic_Regulations.pdf' },
    { code: 'R20', title: 'Autonomous Academic Regulations R20 (Outcome Based Education)', effectiveBatch: '2020-2024 Batches', programs: 'B.Tech, M.Tech, MCA, MBA', credits: 160, status: 'Active (Graduating)', pdf: 'NEC_R20_Academic_Regulations.pdf' },
    { code: 'R19', title: 'Autonomous Academic Regulations R19', effectiveBatch: '2019-2023 Batches', programs: 'B.Tech, M.Tech', credits: 160, status: 'Archived', pdf: 'NEC_R19_Academic_Regulations.pdf' }
  ]);

  const [newReg, setNewReg] = useState({
    code: '',
    title: '',
    effectiveBatch: '',
    programs: 'B.Tech, M.Tech, MCA, MBA',
    credits: 160,
    status: 'Active (Current)'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newReg.code || !newReg.title) return;

    setRegulations([{
      ...newReg,
      pdf: `NEC_${newReg.code}_Regulations.pdf`
    }, ...regulations]);
    setModalOpen(false);
    showToast(`Regulations document ${newReg.code} uploaded successfully!`);
    setNewReg({
      code: '',
      title: '',
      effectiveBatch: '',
      programs: 'B.Tech, M.Tech, MCA, MBA',
      credits: 160,
      status: 'Active (Current)'
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
          onClick={() => setModalOpen(true)}
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
              onClick={() => showToast(`Initiating download for ${r.code} official document (${r.pdf})`)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', background: '#070F1E', color: '#F1C40F', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
            >
              <Download size={14} /> Download {r.code} Regulations PDF
            </button>
          </div>
        ))}
      </div>

      {/* Upload Regulation Modal */}
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Upload Academic Regulation Document</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleUpload} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>Regulation Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. R25"
                  value={newReg.code}
                  onChange={(e) => setNewReg({ ...newReg, code: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>Regulation Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Academic Regulations R25"
                  value={newReg.title}
                  onChange={(e) => setNewReg({ ...newReg, title: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>Effective Batches *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2025-2029 Onwards"
                  value={newReg.effectiveBatch}
                  onChange={(e) => setNewReg({ ...newReg, effectiveBatch: e.target.value })}
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
                  Save Regulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

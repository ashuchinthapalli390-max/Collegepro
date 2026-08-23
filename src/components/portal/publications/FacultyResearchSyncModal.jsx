import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Download, 
  FileText, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  CheckSquare, 
  Square,
  Sparkles,
  Award,
  Globe,
  BookOpen,
  User,
  Database,
  Check,
  Search,
  Filter
} from 'lucide-react';
import { FACULTY_DATA } from '../../../data/masterData.js';
import { runResearchSyncJob } from '../../../lib/research/researchSyncEngine.js';
import { importPublicationsBatch } from '../../../data/portalStore.js';

export default function FacultyResearchSyncModal({
  isOpen,
  onClose,
  currentUser,
  onSyncComplete
}) {
  const [selectedFacultyId, setSelectedFacultyId] = useState(currentUser?.facultyId || 'NEC-PER-0284');
  const facultyRecord = FACULTY_DATA.find(f => f.id === selectedFacultyId) || FACULTY_DATA[0];

  // Identifiers state
  const [identifiers, setIdentifiers] = useState({
    orcid: '0000-0002-5550-9651',
    scopusAuthorId: '57215069303',
    wosResearcherId: 'ABC-1234-2024',
    googleScholarId: '',
    vidwanId: ''
  });

  // Sync execution state
  const [syncing, setSyncing] = useState(false);
  const [progressState, setProgressState] = useState({ stage: 'IDLE', message: '', percent: 0 });
  const [syncResult, setSyncResult] = useState(null);
  const [selectedCandidateKeys, setSelectedCandidateKeys] = useState({});
  const [activeCandidateTab, setActiveCandidateTab] = useState('NEW');
  const [comparisonCandidate, setComparisonCandidate] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleStartSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    setSelectedCandidateKeys({});

    const result = await runResearchSyncJob(identifiers, (prog) => {
      setProgressState(prog);
    });

    setSyncing(false);

    if (result.success) {
      setSyncResult(result);
      // Auto-select all NEW candidates
      const initialSelection = {};
      result.candidates.forEach(c => {
        if (c.classification === 'NEW') {
          initialSelection[c.candidateId] = true;
        }
      });
      setSelectedCandidateKeys(initialSelection);
    } else {
      alert(result.error || 'Failed to sync with research registries.');
    }
  };

  const toggleSelectCandidate = (id) => {
    setSelectedCandidateKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelectAll = (select) => {
    if (!syncResult) return;
    const updated = {};
    syncResult.candidates.forEach(c => {
      if (select) {
        if (activeCandidateTab === 'ALL' || c.classification === activeCandidateTab) {
          updated[c.candidateId] = true;
        }
      }
    });
    setSelectedCandidateKeys(updated);
  };

  const handleImportSelected = () => {
    if (!syncResult) return;
    const toImport = syncResult.candidates.filter(c => selectedCandidateKeys[c.candidateId]);
    if (toImport.length === 0) {
      alert('Please select at least one publication to import.');
      return;
    }

    setImporting(true);
    const preparedCandidates = toImport.map(c => ({
      ...c,
      department: facultyRecord.department,
      facultyId: facultyRecord.id,
      facultyName: facultyRecord.name,
      academicYear: '2025-26',
      authors: c.authors?.length ? c.authors : [
        {
          authorOrder: 1,
          authorType: 'INTERNAL_FACULTY',
          facultyId: facultyRecord.id,
          name: facultyRecord.name,
          department: facultyRecord.department,
          affiliation: 'Narasaraopeta Engineering College',
          isFirstAuthor: true,
          isCorresponding: true
        }
      ]
    }));

    importPublicationsBatch(preparedCandidates, currentUser);

    setTimeout(() => {
      setImporting(false);
      alert(`Successfully imported ${toImport.length} verified publication(s) into the departmental review pipeline (Status: IMPORTED_PENDING_REVIEW).`);
      if (onSyncComplete) onSyncComplete();
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  const filteredCandidates = syncResult?.candidates.filter(c => {
    if (activeCandidateTab === 'ALL') return true;
    return c.classification === activeCandidateTab;
  }) || [];

  const selectedCount = Object.values(selectedCandidateKeys).filter(Boolean).length;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 15, 30, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '980px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          overflow: 'hidden'
        }}
      >
        {/* 1. Header */}
        <div style={{
          background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 100%)',
          padding: '1.25rem 1.75rem',
          borderBottom: '2px solid #D4AF37',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#FFFFFF'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4AF37', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              <RefreshCw size={14} /> Official Research Discovery & Profile Sync
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#FFFFFF', fontFamily: 'Cinzel, serif' }}>
              Research Auto-Sync (ORCID, Scopus, Web of Science & Crossref)
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#94A3B8', borderRadius: '8px', padding: '0.45rem', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Faculty & Identifiers Configuration Bar */}
        <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '1rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '0.75rem', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>FACULTY RESEARCHER *</label>
              <select
                value={selectedFacultyId}
                disabled={currentUser?.role === 'FACULTY'}
                onChange={(e) => setSelectedFacultyId(e.target.value)}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFFFFF', color: '#0F172A', fontWeight: 600 }}
              >
                {FACULTY_DATA.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.department} - {f.designation})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', display: 'block', marginBottom: '0.25rem' }}>ORCID iD (0000-000X-...)</label>
              <input
                type="text"
                placeholder="0000-0002-5550-9651"
                value={identifiers.orcid}
                onChange={(e) => setIdentifiers({ ...identifiers, orcid: e.target.value })}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0284C7', display: 'block', marginBottom: '0.25rem' }}>Scopus Author ID</label>
              <input
                type="text"
                placeholder="57215069303"
                value={identifiers.scopusAuthorId}
                onChange={(e) => setIdentifiers({ ...identifiers, scopusAuthorId: e.target.value })}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#D97706', display: 'block', marginBottom: '0.25rem' }}>WoS ResearcherID</label>
              <input
                type="text"
                placeholder="ABC-1234-2024"
                value={identifiers.wosResearcherId}
                onChange={(e) => setIdentifiers({ ...identifiers, wosResearcherId: e.target.value })}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
              Connected Identifiers for <strong>{facultyRecord.name}</strong> ({facultyRecord.department})
            </div>

            <button
              type="button"
              onClick={handleStartSync}
              disabled={syncing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.15rem',
                borderRadius: '8px',
                border: 'none',
                background: syncing ? '#94A3B8' : 'linear-gradient(135deg, #070F1E 0%, #0B192C 100%)',
                color: '#F1C40F',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: syncing ? 'default' : 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
              }}
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing Registries...' : 'Sync All Research Data'}
            </button>
          </div>
        </div>

        {/* 3. Live Progress Tracker */}
        {syncing && (
          <div style={{ background: '#EFF6FF', padding: '1rem 1.75rem', borderBottom: '1px solid #BFDBFE' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1E40AF' }}>
                STAGE: {progressState.stage}
              </span>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#2563EB' }}>
                {progressState.percent}%
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#DBEAFE', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${progressState.percent}%`, height: '100%', background: '#2563EB', transition: 'width 0.3s ease' }} />
            </div>
            <p style={{ fontSize: '0.76rem', color: '#3B82F6', margin: '0.4rem 0 0', fontWeight: 500 }}>
              {progressState.message}
            </p>
          </div>
        )}

        {/* 4. Discovered Candidates Results Canvas */}
        <div style={{ padding: '1.25rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          {!syncResult && !syncing && (
            <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
              <Sparkles size={36} style={{ color: '#D4AF37', margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem' }}>
                Ready to Discover Official Publications
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', maxWidth: '480px', margin: '0 auto' }}>
                Click "Sync All Research Data" to connect to ORCID, Scopus, Web of Science, and Crossref registries. Duplicate records will be automatically detected.
              </p>
            </div>
          )}

          {syncResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Summary KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Total Discovered</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{syncResult.summary.totalDiscovered}</div>
                </div>
                <div style={{ background: '#ECFDF5', padding: '0.75rem', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#065F46' }}>New Ready to Import</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>{syncResult.summary.newRecords}</div>
                </div>
                <div style={{ background: '#FEF3C7', padding: '0.75rem', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                  <div style={{ fontSize: '0.7rem', color: '#92400E' }}>Duplicates in Portal</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#D97706' }}>{syncResult.summary.duplicates}</div>
                </div>
                <div style={{ background: '#EFF6FF', padding: '0.75rem', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                  <div style={{ fontSize: '0.7rem', color: '#1E40AF' }}>Cross-Source Enriched</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563EB' }}>{syncResult.candidates.filter(c => c.sources.length > 1).length}</div>
                </div>
              </div>

              {/* Filter Tabs & Bulk Select */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[
                    { id: 'NEW', label: `New (${syncResult.summary.newRecords})` },
                    { id: 'ALL', label: `All (${syncResult.candidates.length})` },
                    { id: 'EXACT_DUPLICATE', label: `Duplicates (${syncResult.summary.duplicates})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCandidateTab(tab.id)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: activeCandidateTab === tab.id ? '#070F1E' : '#F1F5F9',
                        color: activeCandidateTab === tab.id ? '#F1C40F' : '#475569',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => handleSelectAll(true)} style={{ fontSize: '0.72rem', color: '#2563EB', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Select Visible</button>
                  <button type="button" onClick={() => handleSelectAll(false)} style={{ fontSize: '0.72rem', color: '#64748B', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Deselect</button>
                </div>
              </div>

              {/* Candidate Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {filteredCandidates.map(c => {
                  const isChecked = !!selectedCandidateKeys[c.candidateId];
                  const isNew = c.classification === 'NEW';

                  return (
                    <div
                      key={c.candidateId}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '10px',
                        border: isChecked ? '1px solid #D4AF37' : '1px solid #E2E8F0',
                        background: isChecked ? '#FFFDF5' : '#FFFFFF',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectCandidate(c.candidateId)}
                        style={{ marginTop: '0.25rem', cursor: 'pointer' }}
                      />

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.25rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: isNew ? '#059669' : '#D97706', background: isNew ? '#ECFDF5' : '#FEF3C7', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                            {c.classification}
                          </span>

                          {c.sources.map((src, i) => (
                            <span key={i} style={{ fontSize: '0.66rem', fontWeight: 700, color: '#0F172A', background: '#F1F5F9', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                              {src}
                            </span>
                          ))}

                          {c.doi && (
                            <span style={{ fontSize: '0.66rem', color: '#0284C7' }}>
                              doi:{c.doi}
                            </span>
                          )}
                        </div>

                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.2rem' }}>
                          {c.title}
                        </h4>

                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                          {c.journalName || 'Journal'} ({c.publicationYear}) • {c.publicationType}
                        </div>

                        {c.matchReason && !isNew && (
                          <div style={{ fontSize: '0.7rem', color: '#DC2626', marginTop: '0.25rem' }}>
                            ⚠ {c.matchReason}
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.72rem', color: '#475569' }}>
                          {c.scopusCitations ? <span>Scopus Citations: <strong>{c.scopusCitations}</strong></span> : null}
                          {c.wosCitations ? <span>WoS Citations: <strong>{c.wosCitations}</strong></span> : null}
                          <button
                            type="button"
                            onClick={() => setComparisonCandidate(c)}
                            style={{ color: '#0284C7', background: 'none', border: 'none', padding: 0, fontWeight: 700, cursor: 'pointer' }}
                          >
                            Compare Sources →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. Footer Actions */}
        <div style={{ background: '#F8FAFC', padding: '1rem 1.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            Close
          </button>

          {syncResult && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                {selectedCount} publication(s) selected
              </span>

              <button
                type="button"
                onClick={handleImportSelected}
                disabled={importing || selectedCount === 0}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedCount > 0 ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#CBD5E1',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: selectedCount > 0 ? 'pointer' : 'default'
                }}
              >
                <Check size={14} /> {importing ? 'Importing...' : `Import Selected (${selectedCount})`}
              </button>
            </div>
          )}
        </div>

        {/* Metadata Source Comparison Modal */}
        {comparisonCandidate && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 15, 30, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2100, padding: '1rem' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '14px', maxWidth: '640px', width: '100%', padding: '1.25rem', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Cross-Source Metadata Comparison</h3>
                <button type="button" onClick={() => setComparisonCandidate(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={16} /></button>
              </div>

              <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div><strong>Title:</strong> {comparisonCandidate.title}</div>
                <div><strong>DOI:</strong> {comparisonCandidate.doi || 'None'}</div>
                <div><strong>Scopus EID:</strong> {comparisonCandidate.scopusEid || 'None'}</div>
                <div><strong>WoS UID:</strong> {comparisonCandidate.wosUid || 'None'}</div>
                <div><strong>Sources:</strong> {comparisonCandidate.sources.join(', ')}</div>
                <div><strong>Journal / Venue:</strong> {comparisonCandidate.journalName}</div>
                <div><strong>Publication Year:</strong> {comparisonCandidate.publicationYear}</div>
                <div><strong>Scopus Citations:</strong> {comparisonCandidate.scopusCitations || 0}</div>
                <div><strong>WoS Citations:</strong> {comparisonCandidate.wosCitations || 0}</div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setComparisonCandidate(null)} style={{ padding: '0.4rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.76rem', cursor: 'pointer' }}>Done</button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

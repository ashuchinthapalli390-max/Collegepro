import React, { useState } from 'react';
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
  Square 
} from 'lucide-react';
import { simulateResearchProfileSync, savePublication, addAuditLog } from '../../data/portalStore.js';
import { FACULTY_DATA } from '../../data/masterData.js';

export default function PublicationSyncModal({ currentUser, onSyncComplete, onClose }) {
  const [selectedFacultyId, setSelectedFacultyId] = useState(currentUser?.facultyId || 'NEC-PER-0284');
  const [syncing, setSyncing] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState('');
  const [fetchedResults, setFetchedResults] = useState(null);
  const [selectedPaperIds, setSelectedPaperIds] = useState({});

  const facultyRecord = FACULTY_DATA.find(f => f.id === selectedFacultyId) || FACULTY_DATA[0];

  const handleStartSync = async () => {
    setSyncing(true);
    setFetchedResults(null);
    setSelectedPaperIds({});

    const results = await simulateResearchProfileSync(facultyRecord, (status) => {
      setSyncStatusText(status);
    });

    setFetchedResults(results);
    setSyncing(false);

    // Default select non-duplicates
    const initialSelection = {};
    results.forEach(r => {
      if (!r.isDuplicate) {
        initialSelection[r.id] = true;
      }
    });
    setSelectedPaperIds(initialSelection);
  };

  const togglePaperSelection = (id) => {
    setSelectedPaperIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleImportSelected = () => {
    if (!fetchedResults) return;
    const toImport = fetchedResults.filter(p => selectedPaperIds[p.id]);
    if (toImport.length === 0) {
      alert('Please select at least one paper to import.');
      return;
    }

    let count = 0;
    toImport.forEach(paper => {
      savePublication({
        ...paper,
        id: 'PUB-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        facultyId: facultyRecord.id,
        facultyName: facultyRecord.name,
        verificationStatus: currentUser?.canApprove ? 'Published' : 'Pending Review'
      }, currentUser);
      count++;
    });

    addAuditLog('SYNC_IMPORT', 'Publications', `Imported ${count} publications from ORCID/Scopus for ${facultyRecord.name}`, currentUser);

    alert(`Successfully staged and imported ${count} publication(s) into the institutional verification pipeline! Status: ${currentUser?.canApprove ? 'Published' : 'Pending Review by HOD'}.`);
    if (onSyncComplete) onSyncComplete();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(7, 15, 30, 0.9)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5000,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        maxWidth: '880px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 60%, #122846 100%)',
          padding: '2rem',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <RefreshCw size={22} style={{ color: '#D4AF37' }} />
            <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF' }}>
              Multi-Source Research Profile Auto-Sync Engine
            </h2>
          </div>
          <p style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>
            Connects to ORCID Public API, Elsevier Scopus, and Web of Science to fetch, preview, deduplicate, and stage faculty publications.
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem' }}>
          {/* Target Faculty Selector */}
          <div style={{ background: '#F8FAFC', padding: '1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700 }}>Select Faculty to Sync Research IDs:</label>
            <select
              value={selectedFacultyId}
              onChange={(e) => { setSelectedFacultyId(e.target.value); setFetchedResults(null); }}
              disabled={syncing}
              className="form-control"
              style={{ fontWeight: 600 }}
            >
              {FACULTY_DATA.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.id}) - {f.department} [{f.orcid ? 'ORCID: ' + f.orcid : 'ID Ready'}]
                </option>
              ))}
            </select>

            {/* Research Identifiers Summary */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
              <span className="badge badge-navy">ORCID: {facultyRecord.orcid || 'Registered'}</span>
              <span className="badge badge-gold">Scopus ID: {facultyRecord.scopus || '57215069303'}</span>
              <span className="badge badge-info">Scholar: {facultyRecord.scholar || 'Linked'}</span>
              <span className="badge badge-success">Vidwan: {facultyRecord.vidwan || 'INFLIBNET'}</span>
            </div>
          </div>

          {/* Sync Trigger Action */}
          {!fetchedResults && !syncing && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <button
                onClick={handleStartSync}
                className="btn-primary"
                style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}
              >
                <RefreshCw size={18} /> Run Publication Auto-Fetch & Duplicate Detection
              </button>
              <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '0.8rem' }}>
                Fetches new works from Elsevier Scopus and ORCID without exposing confidential IDs.
              </div>
            </div>
          )}

          {/* Syncing Progress Spinner */}
          {syncing && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <RefreshCw size={44} style={{ color: '#D4AF37', animation: 'spin 1s linear infinite', margin: '0 auto 1.2rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#0B192C', marginBottom: '0.4rem' }}>
                Querying External Scholarly Repositories...
              </h3>
              <p style={{ color: '#0284C7', fontWeight: 600, fontSize: '0.95rem' }}>
                {syncStatusText}
              </p>
            </div>
          )}

          {/* Fetched Results & Deduplication Preview Table */}
          {fetchedResults && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#0B192C' }}>
                    Fetched External Candidate Publications ({fetchedResults.length})
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                    Duplicate detection automatically flags existing papers by DOI and Scopus EID.
                  </div>
                </div>

                <button
                  onClick={handleStartSync}
                  style={{ fontSize: '0.8rem', color: '#0284C7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RefreshCw size={13} /> Re-sync
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {fetchedResults.map(item => (
                  <div
                    key={item.id}
                    style={{
                      padding: '1.2rem',
                      borderRadius: '12px',
                      background: item.isDuplicate ? '#FEF2F2' : '#F0FDF4',
                      border: '1.5px solid ' + (item.isDuplicate ? '#FCA5A5' : '#86EFAC'),
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start'
                    }}
                  >
                    <button
                      onClick={() => togglePaperSelection(item.id)}
                      style={{ marginTop: '2px', color: item.isDuplicate ? '#94A3B8' : '#059669' }}
                    >
                      {selectedPaperIds[item.id] ? <CheckSquare size={20} /> : <Square size={20} />}
                    </button>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <span className={item.isDuplicate ? 'badge badge-danger' : 'badge badge-success'}>
                          {item.isDuplicate ? `⚠️ Duplicate: ${item.duplicateReason}` : '✓ New Paper Ready to Import'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Source: {item.importedSource}</span>
                      </div>

                      <div style={{ fontWeight: 800, color: '#0B192C', fontSize: '0.98rem', lineHeight: 1.35, marginBottom: '0.2rem' }}>
                        {item.title}
                      </div>

                      <div style={{ color: '#475569', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                        {item.journalConference} • Published: {item.publicationDate} • DOI: {item.doi}
                      </div>

                      {item.isDuplicate && (
                        <div style={{ fontSize: '0.75rem', color: '#DC2626', background: '#FEE2E2', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                          Already present in repository as ID: <strong>{item.matchedId}</strong>. Importing this will create a duplicate record.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.2rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Selected: <strong>{Object.values(selectedPaperIds).filter(Boolean).length}</strong> paper(s) to import
                </div>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    onClick={onClose}
                    className="btn-outline"
                    style={{ padding: '0.6rem 1.2rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportSelected}
                    className="btn-primary"
                    style={{ padding: '0.6rem 1.4rem' }}
                  >
                    <Download size={16} /> Import Selected into Review Pipeline
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

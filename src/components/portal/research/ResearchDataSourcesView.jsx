import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Download, 
  ShieldCheck, 
  RefreshCw,
  FileSpreadsheet,
  Globe,
  Award,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { getDatasetVersions, saveDatasetVersion, importPublicationsBatch } from '../../../data/portalStore.js';
import { parseScopusExportCSV, parseWosExport } from '../../../lib/research/exportParsers.js';

export default function ResearchDataSourcesView({ currentUser }) {
  const [datasets, setDatasets] = useState(getDatasetVersions());
  const [activeTab, setActiveTab] = useState('DATASETS'); // 'DATASETS' | 'SCOPUS_IMPORT' | 'WOS_IMPORT'

  // Upload / Ingestion state
  const [uploadText, setUploadText] = useState('');
  const [parsedRecords, setParsedRecords] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [parseError, setParseError] = useState('');

  const handleParseFile = (type) => {
    if (!uploadText.trim()) {
      setParseError('Please paste or upload file content to parse.');
      return;
    }

    setParseError('');
    try {
      let records = [];
      if (type === 'SCOPUS') {
        records = parseScopusExportCSV(uploadText);
      } else {
        records = parseWosExport(uploadText);
      }

      if (records.length === 0) {
        setParseError('No valid records found in the provided export text. Ensure valid CSV/Tab-delimited format.');
        return;
      }

      setParsedRecords(records);
      setImportResult(null);
    } catch (err) {
      setParseError('Failed to parse export file: ' + err.message);
    }
  };

  const handleExecuteImport = () => {
    if (!parsedRecords || parsedRecords.length === 0) return;

    setImporting(true);
    const prepared = parsedRecords.map(r => ({
      ...r,
      department: currentUser?.dept || 'CSE',
      academicYear: '2025-26',
      workflowStatus: 'IMPORTED_PENDING_REVIEW',
      authors: [
        {
          authorOrder: 1,
          name: currentUser?.name || 'Imported Author',
          affiliation: 'Narasaraopeta Engineering College',
          isFirstAuthor: true,
          isCorresponding: true
        }
      ]
    }));

    importPublicationsBatch(prepared, currentUser);

    setTimeout(() => {
      setImporting(false);
      setImportResult({
        count: prepared.length,
        message: `Successfully imported ${prepared.length} record(s) from authorized export file into review queue (Status: IMPORTED_PENDING_REVIEW).`
      });
      setParsedRecords(null);
      setUploadText('');
    }, 500);
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 60%, #122846 100%)',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        color: '#FFFFFF',
        border: '1px solid #D4AF37',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F1C40F'
          }}>
            <Database size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#FFFFFF', fontFamily: 'Cinzel, Georgia, serif' }}>
                Scholarly Research Datasets & Offline Index Hub
              </h1>
              <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#2563EB', color: '#FFFFFF', fontWeight: 800 }}>
                PUBLIC BULK SNAPSHOTS
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#CBD5E1', margin: 0 }}>
              Track OpenAlex, Crossref, and ORCID snapshot versions. Ingest authorized Scopus and WoS institutional export files.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.8rem' }}>
        {[
          { id: 'DATASETS', label: 'Authorized Research Repositories', icon: Database },
          { id: 'SCOPUS_IMPORT', label: 'Import Scopus CSV Export', icon: FileSpreadsheet },
          { id: 'WOS_IMPORT', label: 'Import Web of Science Export', icon: Globe }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setActiveTab(tab.id); setParsedRecords(null); setImportResult(null); setParseError(''); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#070F1E' : '#F1F5F9',
                color: isActive ? '#F1C40F' : '#475569',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {parseError && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{parseError}</span>
        </div>
      )}

      {/* 1. Dataset Snapshots View */}
      {activeTab === 'DATASETS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {datasets.map(ds => (
            <div
              key={ds.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    background: ds.source === 'OPENALEX' ? '#0F172A' : (ds.source === 'CROSSREF' ? '#D97706' : '#059669'),
                    color: '#FFFFFF'
                  }}>
                    {ds.source}
                  </span>

                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={13} /> {ds.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem' }}>
                  {ds.name}
                </h3>

                <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 0.85rem' }}>
                  {ds.description || 'Public scholarly dataset ingested offline and indexed for NEC researchers.'}
                </p>

                <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.73rem', color: '#475569' }}>
                  <div><strong>Snapshot Version:</strong> {ds.datasetVersion}</div>
                  <div><strong>Published Date:</strong> {ds.publishedDate}</div>
                  <div><strong>Global Dataset Size:</strong> {ds.totalGlobalRecords}</div>
                  <div><strong>Relevant NEC Records:</strong> <span style={{ color: '#059669', fontWeight: 800 }}>{ds.relevantRecordCount}</span></div>
                  <div><strong>Checksum:</strong> <code style={{ fontSize: '0.65rem' }}>{ds.checksum?.substring(0, 24)}...</code></div>
                </div>
              </div>

              <div style={{ fontSize: '0.7rem', color: '#94A3B8', borderTop: '1px solid #E2E8F0', paddingTop: '0.65rem' }}>
                Ingested: {new Date(ds.ingestedAt).toLocaleDateString()} • Verified Active
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Scopus & WoS Export Ingestion Tool */}
      {(activeTab === 'SCOPUS_IMPORT' || activeTab === 'WOS_IMPORT') && (
        <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem' }}>
              Ingest Authorized {activeTab === 'SCOPUS_IMPORT' ? 'Elsevier Scopus (CSV)' : 'Clarivate Web of Science'} Export
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
              Paste the exported CSV or Tab-delimited text from your institutional access. Records will be normalized and marked with provenance <code>{activeTab === 'SCOPUS_IMPORT' ? 'SCOPUS_IMPORT' : 'WOS_IMPORT'}</code>.
            </p>
          </div>

          <textarea
            rows={8}
            placeholder={
              activeTab === 'SCOPUS_IMPORT'
                ? `"Title","Authors","Year","Source title","Volume","Issue","Art. No.","Page count","DOI","Link","EID"\n"Real-Time Edge Video Analytics","Venkateswarlu S.","2025","IEEE TCE","71","2","104","12","10.1109/tce.2025.3421098","https://...","2-s2.0-85199201923"`
                : `PT\tTI\tAU\tSO\tVL\tIS\tPY\tDI\tUT\nJ\tReal-Time Edge Video Analytics\tVenkateswarlu S.\tIEEE TCE\t71\t2\t2025\t10.1109/tce.2025.3421098\tWOS:00092847101`
            }
            value={uploadText}
            onChange={(e) => setUploadText(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', fontFamily: 'monospace', boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={() => handleParseFile(activeTab === 'SCOPUS_IMPORT' ? 'SCOPUS' : 'WOS')}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', background: '#070F1E', color: '#F1C40F', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Parse Export Content
            </button>
          </div>

          {/* Parsed Preview Table */}
          {parsedRecords && (
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>
                  ✓ Parsed {parsedRecords.length} record(s) ready for review
                </span>

                <button
                  type="button"
                  disabled={importing}
                  onClick={handleExecuteImport}
                  style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', background: '#059669', color: '#FFFFFF', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  {importing ? 'Importing...' : `Confirm Import (${parsedRecords.length})`}
                </button>
              </div>

              <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                    <tr>
                      <th style={{ padding: '0.5rem 0.75rem' }}>#</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Title</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Journal</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Year</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>DOI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRecords.map((r, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '0.45rem 0.75rem', color: '#64748B' }}>{idx + 1}</td>
                        <td style={{ padding: '0.45rem 0.75rem', fontWeight: 700, color: '#0F172A' }}>{r.title}</td>
                        <td style={{ padding: '0.45rem 0.75rem', color: '#475569' }}>{r.journalName || '—'}</td>
                        <td style={{ padding: '0.45rem 0.75rem', color: '#475569' }}>{r.publicationYear}</td>
                        <td style={{ padding: '0.45rem 0.75rem', color: '#2563EB' }}>{r.doi || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {importResult && (
            <div style={{ background: '#ECFDF5', padding: '0.85rem 1.25rem', borderRadius: '8px', border: '1px solid #A7F3D0', color: '#065F46', fontSize: '0.82rem', fontWeight: 700 }}>
              {importResult.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

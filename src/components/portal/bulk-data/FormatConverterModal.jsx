import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  ArrowRight, 
  Check, 
  X, 
  RefreshCw,
  Sparkles,
  Sliders,
  Database,
  Layers,
  FileText
} from 'lucide-react';
import { inspectAndParseUploadedFile } from '../../../lib/importer/smartFileDetector.js';
import { MODULE_CANONICAL_SCHEMAS, matchHeadersToSchema } from '../../../lib/importer/semanticColumnMapper.js';
import { convertRawDataToCanonical, exportCanonicalDataset } from '../../../lib/importer/formatConverterEngine.js';
import { validateCanonicalRecords, generateBatchMetadata, commitCanonicalBatchToStore } from '../../../lib/importer/universalValidator.js';
import { MotionModal } from '../../motion/index.js';

export default function FormatConverterModal({ isOpen, onClose, initialModuleKey = 'attendance', currentUser, onImportSuccess }) {
  const [step, setStep] = useState(1); // 1 = Upload, 2 = Mapping, 3 = Preview & Actions, 4 = Success
  const [selectedModuleKey, setSelectedModuleKey] = useState(initialModuleKey);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // File & Parsing State
  const [parsedFile, setParsedFile] = useState(null);
  const [selectedSheetIdx, setSelectedSheetIdx] = useState(0);
  const [mappingResult, setMappingResult] = useState(null);
  const [canonicalResult, setCanonicalResult] = useState(null);
  const [validatedResult, setValidatedResult] = useState(null);
  const [commitResult, setCommitResult] = useState(null);
  const [previewFilterTab, setPreviewFilterTab] = useState('ALL');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setError(null);
    setLoading(true);
    try {
      const inspected = await inspectAndParseUploadedFile(file);
      setParsedFile(inspected);
      setSelectedSheetIdx(inspected.selectedSheetIndex || 0);

      // Auto-match headers with current module schema
      const mapped = matchHeadersToSchema(inspected.headers, selectedModuleKey);
      setMappingResult(mapped);
      setStep(2);
    } catch (err) {
      console.error('File parsing failed:', err);
      setError(err.message || 'Failed to inspect file structure.');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleChange = (newModuleKey) => {
    setSelectedModuleKey(newModuleKey);
    if (parsedFile && parsedFile.headers) {
      const mapped = matchHeadersToSchema(parsedFile.headers, newModuleKey);
      setMappingResult(mapped);
    }
  };

  const handleSheetChange = (sheetIdx) => {
    if (!parsedFile || !parsedFile.sheets[sheetIdx]) return;
    const sheet = parsedFile.sheets[sheetIdx];
    setSelectedSheetIdx(sheetIdx);
    const headers = sheet.headers || [];
    const mapped = matchHeadersToSchema(headers, selectedModuleKey);
    setMappingResult(mapped);
  };

  const handleMappingOverride = (fieldKey, newSourceIdx) => {
    if (!mappingResult) return;
    const idx = parseInt(newSourceIdx, 10);
    const sourceHeader = idx >= 0 ? (parsedFile.headers[idx] || null) : null;

    const updated = {
      ...mappingResult,
      mappings: mappingResult.mappings.map(m => {
        if (m.targetField === fieldKey) {
          return {
            ...m,
            sourceIndex: idx,
            sourceHeader,
            status: idx >= 0 ? 'USER_MAPPED' : (m.required ? 'MISSING_REQUIRED' : 'UNMAPPED'),
            confidence: idx >= 0 ? 100 : 0
          };
        }
        return m;
      })
    };
    setMappingResult(updated);
  };

  const handleRunConversion = () => {
    if (!parsedFile || !mappingResult) return;
    setLoading(true);
    try {
      const activeSheet = parsedFile.sheets[selectedSheetIdx] || parsedFile;
      const dataRows = (activeSheet.matrix || []).slice((activeSheet.headerRowIndex || 0) + 1);

      const converted = convertRawDataToCanonical(dataRows, mappingResult, selectedModuleKey);
      setCanonicalResult(converted);

      const validated = validateCanonicalRecords(converted, currentUser);
      setValidatedResult(validated);

      setStep(3);
    } catch (err) {
      setError(err.message || 'Conversion error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    if (!canonicalResult) return;
    exportCanonicalDataset(canonicalResult, 'xlsx', 'ET_Portal_Converted');
  };

  const handleDownloadCsv = () => {
    if (!canonicalResult) return;
    exportCanonicalDataset(canonicalResult, 'csv', 'ET_Portal_Converted');
  };

  const handleCommitImport = () => {
    if (!validatedResult || !validatedResult.canCommit) return;
    setLoading(true);
    try {
      const batchMeta = generateBatchMetadata(selectedModuleKey, parsedFile.fileName, parsedFile.fileSha256, currentUser);
      const res = commitCanonicalBatchToStore(validatedResult, batchMeta);
      setCommitResult(res);
      setStep(4);
      if (onImportSuccess) onImportSuccess(res);
    } catch (err) {
      setError(err.message || 'Failed to commit import records to portal.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPreviewRecords = (validatedResult?.records || []).filter(r => {
    if (previewFilterTab === 'VALID') return r._validationStatus === 'VALID';
    if (previewFilterTab === 'NEEDS_MAPPING') return r._validationStatus === 'NEEDS_MAPPING';
    if (previewFilterTab === 'OUT_OF_SCOPE') return r._validationStatus === 'OUT_OF_SCOPE_DEPARTMENT';
    if (previewFilterTab === 'ISSUES') return r._validationStatus !== 'VALID';
    return true;
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 15, 30, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 6000,
      padding: '1.25rem'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '920px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        border: '1px solid #CBD5E1'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 100%)',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(241, 196, 15, 0.15)',
              border: '1px solid #D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F1C40F'
            }}>
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, fontFamily: 'Cinzel, Georgia, serif', color: '#FFFFFF' }}>
                Smart Universal Importer & Format Converter
              </h2>
              <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '0.15rem 0 0' }}>
                Converts any arbitrary Excel or CSV file into clean canonical ET schema with instant 1-click import.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.35rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Wizard Steps Indicator */}
        <div style={{ display: 'flex', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '0.75rem 1.5rem', gap: '1rem', overflowX: 'auto' }}>
          {[
            { num: 1, label: '1. Upload File' },
            { num: 2, label: '2. Schema Mapping' },
            { num: 3, label: '3. Preview & Convert' },
            { num: 4, label: '4. Complete' }
          ].map(s => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: step === s.num ? 800 : 600, color: step === s.num ? '#D97706' : (step > s.num ? '#059669' : '#64748B') }}>
              <span style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: step === s.num ? '#D97706' : (step > s.num ? '#059669' : '#E2E8F0'),
                color: step === s.num || step > s.num ? '#FFFFFF' : '#64748B',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.68rem'
              }}>
                {step > s.num ? <Check size={12} /> : s.num}
              </span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: FILE UPLOAD & MODULE SELECTION */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '0.4rem' }}>
                  SELECT TARGET PORTAL MODULE
                </label>
                <select
                  value={selectedModuleKey}
                  onChange={(e) => handleModuleChange(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem', fontWeight: 600, background: '#FFFFFF', color: '#0F172A' }}
                >
                  {Object.entries(MODULE_CANONICAL_SCHEMAS).map(([key, schema]) => (
                    <option key={key} value={key}>{schema.title} ({schema.category})</option>
                  ))}
                </select>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging ? '2px dashed #D4AF37' : '2px dashed #CBD5E1',
                  borderRadius: '16px',
                  background: isDragging ? '#FEFCE8' : '#F8FAFC',
                  padding: '3rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  textAlign: 'center',
                  gap: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.tsv,.txt,.json"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37'
                }}>
                  <UploadCloud size={28} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem' }}>
                    Drag and drop your spreadsheet here
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                    Supports <strong>Excel (.xlsx, .xls)</strong>, <strong>CSV</strong>, <strong>TSV</strong>, or <strong>JSON</strong> files.
                  </p>
                </div>
                <button
                  type="button"
                  style={{
                    padding: '0.45rem 1.15rem',
                    background: '#070F1E',
                    color: '#F1C40F',
                    border: '1px solid #D4AF37',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Browse Files
                </button>
              </div>

              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '0.85rem 1rem', fontSize: '0.76rem', color: '#1E40AF', lineHeight: 1.5 }}>
                <strong>Adaptive AI Structure Detection:</strong> The converter automatically scans for multi-sheet tables, skips institution titles or merged banner rows, and identifies canonical ET department codes.
              </div>
            </div>
          )}

          {/* STEP 2: SCHEMA MAPPING */}
          {step === 2 && mappingResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Column Mapping & Verification
                  </h3>
                  <p style={{ fontSize: '0.76rem', color: '#64748B', margin: '0.15rem 0 0' }}>
                    Source file: <strong>{parsedFile.fileName}</strong> ({parsedFile.rowCount} rows detected)
                  </p>
                </div>

                {parsedFile.sheets && parsedFile.sheets.length > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>Sheet:</label>
                    <select
                      value={selectedSheetIdx}
                      onChange={(e) => handleSheetChange(parseInt(e.target.value, 10))}
                      style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.76rem', fontWeight: 600 }}
                    >
                      {parsedFile.sheets.map((s, idx) => (
                        <option key={idx} value={idx}>{s.name} ({s.rowCount} rows)</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Mappings Table */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: '#334155' }}>Canonical Field</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: '#334155' }}>Matched Source Column</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: '#334155' }}>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappingResult.mappings.map((m) => (
                      <tr key={m.targetField} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>
                            {m.targetLabel}
                            {m.required && <span style={{ color: '#DC2626', marginLeft: '0.25rem' }}>*</span>}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                            {m.targetField} ({m.targetType})
                          </div>
                        </td>

                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <select
                            value={m.sourceIndex}
                            onChange={(e) => handleMappingOverride(m.targetField, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.4rem 0.65rem',
                              borderRadius: '6px',
                              border: m.required && m.sourceIndex < 0 ? '1px solid #DC2626' : '1px solid #CBD5E1',
                              background: m.sourceIndex >= 0 ? '#FFFFFF' : '#FEF2F2',
                              fontSize: '0.78rem',
                              fontWeight: 600
                            }}
                          >
                            <option value="-1">-- Unmapped --</option>
                            {parsedFile.headers.map((h, hIdx) => (
                              <option key={hIdx} value={hIdx}>Column {hIdx + 1}: {h || `(Header ${hIdx + 1})`}</option>
                            ))}
                          </select>
                        </td>

                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          {m.sourceIndex >= 0 ? (
                            <span style={{
                              background: m.confidence >= 85 ? '#ECFDF5' : '#FEF3C7',
                              color: m.confidence >= 85 ? '#047857' : '#B45309',
                              border: `1px solid ${m.confidence >= 85 ? '#A7F3D0' : '#FDE68A'}`,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.68rem',
                              fontWeight: 800
                            }}>
                              {m.confidence}% Matched
                            </span>
                          ) : (
                            <span style={{ background: '#F1F5F9', color: '#64748B', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 700 }}>
                              {m.required ? 'Missing Required' : 'Optional'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ padding: '0.55rem 1.1rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleRunConversion}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1.35rem',
                    background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                    color: '#070F1E',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Convert & Preview Data <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW & ACTIONS */}
          {step === 3 && validatedResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Validation Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.75rem', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>{validatedResult.totalRecords}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>Total Rows</div>
                </div>
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.75rem', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>{validatedResult.validCount}</div>
                  <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>Ready to Import</div>
                </div>
                <div style={{ background: '#FEFCE8', border: '1px solid #FEF08A', padding: '0.75rem', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#A16207' }}>{validatedResult.needsMappingCount}</div>
                  <div style={{ fontSize: '0.7rem', color: '#A16207', fontWeight: 700 }}>Needs Mapping</div>
                </div>
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '0.75rem', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#DC2626' }}>{validatedResult.outOfScopeCount}</div>
                  <div style={{ fontSize: '0.7rem', color: '#DC2626', fontWeight: 700 }}>Out of Scope</div>
                </div>
              </div>

              {/* Filter Tabs for Preview */}
              <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.4rem' }}>
                {[
                  { id: 'ALL', label: `All Rows (${validatedResult.totalRecords})` },
                  { id: 'VALID', label: `Valid (${validatedResult.validCount})` },
                  { id: 'NEEDS_MAPPING', label: `Needs Mapping (${validatedResult.needsMappingCount})` },
                  { id: 'OUT_OF_SCOPE', label: `Out of Scope (${validatedResult.outOfScopeCount})` }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPreviewFilterTab(t.id)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: previewFilterTab === t.id ? '#070F1E' : '#F1F5F9',
                      color: previewFilterTab === t.id ? '#F1C40F' : '#475569',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Preview Table */}
              <div style={{ maxHeight: '240px', overflow: 'auto', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0 }}>
                      <th style={{ padding: '0.5rem 0.65rem', textAlign: 'left', color: '#334155', fontWeight: 800 }}>#</th>
                      <th style={{ padding: '0.5rem 0.65rem', textAlign: 'left', color: '#334155', fontWeight: 800 }}>Status</th>
                      {MODULE_CANONICAL_SCHEMAS[selectedModuleKey].fields.slice(0, 5).map(f => (
                        <th key={f.key} style={{ padding: '0.5rem 0.65rem', textAlign: 'left', color: '#334155', fontWeight: 800 }}>{f.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPreviewRecords.slice(0, 50).map((r, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '0.45rem 0.65rem', color: '#64748B' }}>{r._sourceRowIndex}</td>
                        <td style={{ padding: '0.45rem 0.65rem' }}>
                          <span style={{
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            background: r._validationStatus === 'VALID' ? '#ECFDF5' : (r._validationStatus === 'NEEDS_MAPPING' ? '#FEFCE8' : '#FEF2F2'),
                            color: r._validationStatus === 'VALID' ? '#047857' : (r._validationStatus === 'NEEDS_MAPPING' ? '#A16207' : '#DC2626')
                          }}>
                            {r._validationStatus}
                          </span>
                        </td>
                        {MODULE_CANONICAL_SCHEMAS[selectedModuleKey].fields.slice(0, 5).map(f => (
                          <td key={f.key} style={{ padding: '0.45rem 0.65rem', color: '#0F172A' }}>
                            {String(r[f.key] !== undefined && r[f.key] !== null ? r[f.key] : '—')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{ padding: '0.55rem 1rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Adjust Mappings
                </button>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleDownloadCsv}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.55rem 0.95rem',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={14} /> Download Converted CSV
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadExcel}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.55rem 0.95rem',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      cursor: 'pointer'
                    }}
                  >
                    <FileSpreadsheet size={14} style={{ color: '#059669' }} /> Download Converted Excel
                  </button>

                  <button
                    type="button"
                    disabled={!validatedResult.canCommit || loading}
                    onClick={handleCommitImport}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.55rem 1.25rem',
                      background: validatedResult.canCommit ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#94A3B8',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: validatedResult.canCommit ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <CheckCircle2 size={16} /> Direct 1-Click Import ({validatedResult.validCount} Rows)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && commitResult && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 1rem', gap: '1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#ECFDF5',
                border: '2px solid #A7F3D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669'
              }}>
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem', fontFamily: 'Cinzel, Georgia, serif' }}>
                  Import Completed Successfully!
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', maxWidth: '480px', margin: 0 }}>
                  Committed <strong>{commitResult.committedCount}</strong> records into <strong>{MODULE_CANONICAL_SCHEMAS[selectedModuleKey].title}</strong>. Batch ID: <code>{commitResult.batchMeta.batchCode}</code>.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '0.55rem 1.5rem',
                    background: '#070F1E',
                    color: '#F1C40F',
                    border: '1px solid #D4AF37',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

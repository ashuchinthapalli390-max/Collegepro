import React, { useState, useRef } from 'react';
import { 
  FolderArchive, 
  Download, 
  Video, 
  Eye, 
  Lock
} from 'lucide-react';
import { 
  parseFolderMediaUpload, 
  downloadBulkMediaFolderTemplateZip 
} from '../../../lib/bulk-import/bulkMediaEngine.js';
import { 
  getAcademicEvents, 
  saveBulkMediaJob, 
  saveBulkMediaFolders, 
  saveBulkMediaItems, 
  executeBulkMediaImport 
} from '../../../data/portalStore.js';
import { VERIFIED_EVENT_MEDIA_REGISTRY } from '../../../data/verified-event-media.js';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ShieldCheck, 
  Image as ImageIcon,
  Sparkles 
} from 'lucide-react';

export default function BulkMediaUploadView({ currentUser, onImportComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedFolderIds, setSelectedFolderIds] = useState([]);
  const [mappingModalFolder, setMappingModalFolder] = useState(null);
  const [inspectFolder, setInspectFolder] = useState(null);
  const [coverPickerFolder, setCoverPickerFolder] = useState(null);
  const [importing, setImporting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const folderInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const existingEvents = getAcademicEvents();

  const handleFilesSelected = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    try {
      const result = await parseFolderMediaUpload(fileList, existingEvents);
      setScanResult(result);
      // Auto select matched folders
      const matchedIds = result.folders.filter(f => f.mappingStatus === 'MATCHED').map(f => f.id);
      setSelectedFolderIds(matchedIds);
    } catch (err) {
      console.error('Folder scan error:', err);
      showToast('Failed to scan folder. Please ensure valid files.');
    }
  };

  const handleManualMapFolder = (targetEvent) => {
    if (!mappingModalFolder) return;
    
    setScanResult(prev => {
      if (!prev) return prev;
      const updatedFolders = prev.folders.map(f => {
        if (f.id === mappingModalFolder.id) {
          return {
            ...f,
            mappingStatus: 'MATCHED',
            matchedRecordId: targetEvent.id,
            matchedRecordTitle: targetEvent.title || targetEvent.name,
            matchReason: `Manually mapped by ${currentUser?.name || 'Admin'}.`
          };
        }
        return f;
      });

      const matchedCount = updatedFolders.filter(f => f.mappingStatus === 'MATCHED').length;
      const unmatchedCount = updatedFolders.length - matchedCount;

      return {
        ...prev,
        matchedFolders: matchedCount,
        unmatchedFolders: unmatchedCount,
        folders: updatedFolders
      };
    });

    setSelectedFolderIds(prev => Array.from(new Set([...prev, mappingModalFolder.id])));
    setMappingModalFolder(null);
    showToast(`Folder "${mappingModalFolder.folderName}" mapped to "${targetEvent.title || targetEvent.name}".`);
  };

  const handleSelectPrimaryCover = (item) => {
    if (!coverPickerFolder) return;

    setScanResult(prev => {
      if (!prev) return prev;
      const updatedFolders = prev.folders.map(f => {
        if (f.id === coverPickerFolder.id) {
          const updatedItems = f.items.map(i => {
            if (i.id === item.id) return { ...i, mediaRole: 'COVER' };
            if (i.mediaRole === 'COVER') return { ...i, mediaRole: 'GALLERY' };
            return i;
          });
          return { ...f, items: updatedItems, hasMultipleCovers: false };
        }
        return f;
      });
      return { ...prev, folders: updatedFolders };
    });

    setCoverPickerFolder(null);
    showToast('Primary cover image selected.');
  };

  const handleCommitMedia = () => {
    if (!scanResult || selectedFolderIds.length === 0) return;
    setImporting(true);

    const nowTime = Date.now();
    const jobId = `med_job_${nowTime}`;
    const newJob = {
      id: jobId,
      jobNumber: `MED-${nowTime.toString().slice(-6)}`,
      moduleKey: 'academic_events',
      academicYear: '2026-27',
      departmentScope: currentUser?.dept || 'ALL',
      rootFolderName: scanResult.folders[0]?.folderName || 'Bulk Media Upload',
      uploadedBy: currentUser?.name || 'Administrator',
      totalFolders: scanResult.totalFolders,
      totalFiles: scanResult.totalFiles,
      imageCount: scanResult.imageCount,
      videoCount: scanResult.videoCount,
      matchedFolders: scanResult.matchedFolders,
      unmatchedFolders: scanResult.unmatchedFolders,
      duplicateFiles: 0,
      failedFiles: 0,
      status: 'SCANNED',
      createdAt: new Date().toISOString()
    };

    saveBulkMediaJob(newJob);
    saveBulkMediaFolders(jobId, scanResult.folders);
    
    const allItems = scanResult.folders.flatMap(f => f.items.map(i => ({ ...i, folderId: f.id })));
    saveBulkMediaItems(jobId, allItems);

    const result = executeBulkMediaImport(jobId, selectedFolderIds, currentUser);
    setImporting(false);

    if (result.success) {
      showToast(`Successfully attached ${result.attachedCount} media items to events! Visibility: PRIVATE.`);
      setScanResult(null);
      setSelectedFolderIds([]);
      if (onImportComplete) onImportComplete();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Toast */}
      {toastMessage && (
        <div style={{ padding: '0.65rem 1rem', borderRadius: '8px', background: '#0F172A', color: '#F1C40F', fontSize: '0.82rem', fontWeight: 700 }}>
          {toastMessage}
        </div>
      )}

      {/* Header & Quick Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
            Folder-Based Bulk Media Ingestion
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
            Upload entire event media folders directly without CSV manifests. Folders are automatically mapped to events by S.No or Event Number.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadBulkMediaFolderTemplateZip}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '0.45rem 0.85rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#1E293B',
            cursor: 'pointer'
          }}
        >
          <Download size={14} /> Download Folder Template (.zip)
        </button>
      </div>

      {/* Upload Drop Zone */}
      {!scanResult && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) handleFilesSelected(e.dataTransfer.files);
          }}
          style={{
            border: `2px dashed ${isDragging ? '#2563EB' : '#CBD5E1'}`,
            borderRadius: '16px',
            background: isDragging ? '#EFF6FF' : '#F8FAFC',
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => folderInputRef.current?.click()}
        >
          <input
            type="file"
            ref={folderInputRef}
            webkitdirectory="true"
            directory="true"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFilesSelected(e.target.files)}
          />

          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <FolderArchive size={28} />
          </div>

          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
            Drop Complete Event Media Folder Here
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748B', maxWidth: '460px', margin: '0 auto 1.25rem auto', lineHeight: '1.45' }}>
            Select an extracted folder containing event subfolders (e.g. <code>SNO-1_Code-a-thon/gallery/...</code>). The portal will automatically detect cover, poster, gallery, and video roles.
          </p>

          <button
            type="button"
            style={{
              padding: '0.55rem 1.25rem',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#F1C40F',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Select Media Folder
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.74rem', color: '#64748B' }}>
            <span>✓ JPG, PNG, WebP (Up to 10MB)</span>
            <span>✓ MP4, WebM (Up to 100MB)</span>
            <span>✓ Default Privacy: <Lock size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> PRIVATE</span>
          </div>
        </div>
      )}

      {/* Institutional Verified Event Media Ingestion Status */}
      {!scanResult && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Institutional Verified Media Repository (AY 2026-27)
                </h3>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  Source: Google Drive (<code>1xrMwf1fCGGjFGkL9yVjdRhqZPNoKo8W1</code>) • Locally Served & WebP Optimized
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', background: '#ECFDF5', color: '#047857', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, border: '1px solid #A7F3D0' }}>
                14 Folders Ingested
              </span>
              <span style={{ fontSize: '0.72rem', background: '#EFF6FF', color: '#1D4ED8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, border: '1px solid #BFDBFE' }}>
                37 Assets (13 Posters • 24 Gallery)
              </span>
              <span style={{ fontSize: '0.72rem', background: '#F8FAFC', color: '#64748B', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, border: '1px solid #E2E8F0' }}>
                5 Duplicates Skipped (SHA-256)
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #F1F5F9', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Source Folder</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Target Event</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Mapping Status</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Poster</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Gallery</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Visibility</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(VERIFIED_EVENT_MEDIA_REGISTRY).map((entry, idx) => {
                  const isExact = entry.mappingStatus === 'EXACT';
                  const isAlias = entry.mappingStatus === 'CONFIRMED_ALIAS';
                  const isReview = entry.mappingStatus === 'NEEDS_REVIEW';
                  const isUnmatched = entry.mappingStatus === 'UNMATCHED';

                  const badgeStyle = isExact
                    ? { bg: '#ECFDF5', text: '#065F46', label: 'EXACT MATCH' }
                    : isAlias
                    ? { bg: '#EFF6FF', text: '#1E40AF', label: 'CONFIRMED ALIAS' }
                    : isReview
                    ? { bg: '#FFFBEB', text: '#92400E', label: 'NEEDS REVIEW' }
                    : { bg: '#FEF2F2', text: '#991B1B', label: 'UNMATCHED' };

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, color: '#0F172A' }}>
                        {entry.folderName}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#334155' }}>
                        {entry.eventTitle ? (
                          <div>
                            <div style={{ fontWeight: 600 }}>{entry.eventTitle}</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{entry.eventNumber || entry.eventId}</div>
                          </div>
                        ) : (
                          <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>No DB event record (0 fake events created)</span>
                        )}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px', background: badgeStyle.bg, color: badgeStyle.text }}>
                          {badgeStyle.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        {entry.poster ? (
                          <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                            ✓ Poster ({entry.poster.width}x{entry.poster.height})
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>NULL</span>
                        )}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#475569', fontWeight: 600 }}>
                        {entry.gallery.length} Photo{entry.gallery.length === 1 ? '' : 's'}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        <span style={{ fontSize: '0.68rem', background: '#F1F5F9', color: '#475569', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                          <Lock size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} />
                          PRIVATE
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scan Results & Event Mapping */}
      {scanResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>EVENT FOLDERS</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>{scanResult.totalFolders}</div>
            </div>
            <div style={{ background: '#ECFDF5', padding: '0.85rem', borderRadius: '10px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 700 }}>MATCHED EVENTS</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857' }}>{scanResult.matchedFolders}</div>
            </div>
            <div style={{ background: '#FFFBEB', padding: '0.85rem', borderRadius: '10px', border: '1px solid #FDE68A' }}>
              <div style={{ fontSize: '0.7rem', color: '#B45309', fontWeight: 700 }}>NEEDS MAPPING</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B45309' }}>{scanResult.unmatchedFolders}</div>
            </div>
            <div style={{ background: '#EFF6FF', padding: '0.85rem', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
              <div style={{ fontSize: '0.7rem', color: '#1D4ED8', fontWeight: 700 }}>TOTAL IMAGES / VIDEOS</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D4ED8' }}>{scanResult.imageCount} imgs • {scanResult.videoCount} vids</div>
            </div>
          </div>

          {/* Folder Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
            {scanResult.folders.map(f => {
              const isMatched = f.mappingStatus === 'MATCHED';
              const isSelected = selectedFolderIds.includes(f.id);

              return (
                <div
                  key={f.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    border: `1px solid ${isMatched ? '#CBD5E1' : '#FCD34D'}`,
                    padding: '1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          disabled={!isMatched}
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFolderIds(prev => [...prev, f.id]);
                            } else {
                              setSelectedFolderIds(prev => prev.filter(id => id !== f.id));
                            }
                          }}
                          style={{ cursor: isMatched ? 'pointer' : 'not-allowed' }}
                        />
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                            {f.folderName}
                          </h4>
                          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                            {f.items.length} files ({f.items.filter(i => i.mediaType === 'IMAGE').length} images, {f.items.filter(i => i.mediaType === 'VIDEO').length} videos)
                          </span>
                        </div>
                      </div>

                      <span
                        style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          background: isMatched ? '#ECFDF5' : '#FFFBEB',
                          color: isMatched ? '#047857' : '#B45309'
                        }}
                      >
                        {isMatched ? 'MATCHED' : 'NEEDS MAPPING'}
                      </span>
                    </div>

                    {/* Target Event Info */}
                    <div style={{ background: '#F8FAFC', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '0.75rem', fontSize: '0.75rem' }}>
                      <div style={{ fontWeight: 700, color: isMatched ? '#15803D' : '#B45309' }}>
                        {isMatched ? `✓ Event: ${f.matchedRecordTitle}` : '⚠ Target event unresolved'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.15rem' }}>
                        {f.matchReason}
                      </div>
                    </div>

                    {/* Multiple covers warning */}
                    {f.hasMultipleCovers && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFBEB', padding: '0.45rem 0.65rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.72rem', color: '#B45309' }}>
                        <span>Multiple covers detected ({f.items.filter(i => i.mediaRole === 'COVER').length})</span>
                        <button
                          type="button"
                          onClick={() => setCoverPickerFolder(f)}
                          style={{ padding: '0.2rem 0.45rem', borderRadius: '4px', border: '1px solid #FCD34D', background: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', color: '#B45309' }}
                        >
                          Pick Primary
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                    <button
                      type="button"
                      onClick={() => setInspectFolder(f)}
                      style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.72rem', cursor: 'pointer', color: '#334155' }}
                    >
                      <Eye size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} /> Preview Media
                    </button>

                    {!isMatched && (
                      <button
                        type="button"
                        onClick={() => setMappingModalFolder(f)}
                        style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: 'none', background: '#0F172A', color: '#F1C40F', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Confirm Event Mapping
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Bar */}
          <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>
              Selected <strong>{selectedFolderIds.length}</strong> of {scanResult.totalFolders} folders ready for ingestion.
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setScanResult(null)}
                style={{ padding: '0.5rem 0.95rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                Scan Another Folder
              </button>
              <button
                type="button"
                disabled={selectedFolderIds.length === 0 || importing}
                onClick={handleCommitMedia}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedFolderIds.length > 0 ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#CBD5E1',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: selectedFolderIds.length > 0 ? 'pointer' : 'not-allowed'
                }}
              >
                {importing ? 'Attaching Media...' : `Attach Media to ${selectedFolderIds.length} Event(s) (PRIVATE)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Mapping Modal */}
      {mappingModalFolder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(7, 15, 30, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
              Select Event for "{mappingModalFolder.folderName}"
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 1rem 0' }}>
              Choose the target event record from the academic events repository:
            </p>

            <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {existingEvents.map(evt => (
                <div
                  key={evt.id}
                  onClick={() => handleManualMapFolder(evt)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>
                    {evt.title || evt.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    {evt.eventNumber || 'EVT-DRAFT'} • {evt.startDate || '2026-06-29'} • {evt.department || 'CSE'}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setMappingModalFolder(null)}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cover Picker Modal */}
      {coverPickerFolder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(7, 15, 30, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '580px', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
              Select Primary Cover for "{coverPickerFolder.folderName}"
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 1rem 0' }}>
              Multiple cover images were found in the <code>cover/</code> folder. Please pick one to be used as the primary card cover:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {coverPickerFolder.items.filter(i => i.mediaRole === 'COVER').map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectPrimaryCover(item)}
                  style={{
                    border: '2px solid #E2E8F0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: '#F8FAFC'
                  }}
                >
                  <img src={item.previewUrl} alt={item.originalFilename} style={{ width: '100%', height: '90px', objectFit: 'cover' }} />
                  <div style={{ padding: '0.35rem', fontSize: '0.68rem', fontWeight: 700, color: '#334155', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {item.originalFilename}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setCoverPickerFolder(null)}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Media Modal */}
      {inspectFolder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(7, 15, 30, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '750px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '1.15rem 1.5rem', background: '#0F172A', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Media in "{inspectFolder.folderName}"
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {inspectFolder.items.length} items detected
                </span>
              </div>
              <button type="button" onClick={() => setInspectFolder(null)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {inspectFolder.items.map(item => (
                <div key={item.id} style={{ background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                  {item.mediaType === 'IMAGE' ? (
                    <img src={item.previewUrl} alt={item.originalFilename} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100px', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F1C40F' }}>
                      <Video size={28} />
                    </div>
                  )}
                  <div style={{ padding: '0.45rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.originalFilename}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.65rem', background: '#EFF6FF', color: '#1D4ED8', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                        {item.mediaRole}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#64748B' }}>
                        {(item.fileSize / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '0.85rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setInspectFolder(null)}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

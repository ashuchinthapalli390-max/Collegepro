/**
 * ET Portal - Secure Document & PDF Viewer
 * Fetches document bytes directly via authenticated fetch, constructs an in-memory
 * Blob URL to bypass iframe cross-origin / X-Frame-Options framing blocks on Vercel,
 * and manages memory cleanup and fallback downloads.
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  X, 
  AlertTriangle, 
  RefreshCw,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export default function NECDocumentViewer({
  isOpen,
  onClose,
  title = 'Document Viewer',
  subtitle = 'Official Signed Institutional Document',
  documentUrl,
  fileName = 'document.pdf',
  documentMeta = null
}) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !documentUrl) {
      setBlobUrl(null);
      setError(null);
      return;
    }

    let active = true;
    let createdUrl = null;

    const loadDocumentBlob = async () => {
      setLoading(true);
      setError(null);
      try {
        // If already a data URI or blob URI
        if (documentUrl.startsWith('blob:') || documentUrl.startsWith('data:')) {
          setBlobUrl(documentUrl);
          setLoading(false);
          return;
        }

        const response = await fetch(documentUrl, {
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error(`Document server returned status ${response.status} (${response.statusText})`);
        }

        const contentType = response.headers.get('content-type') || '';
        const blob = await response.blob();

        if (blob.size === 0) {
          throw new Error('Retrieved document is 0 bytes (empty).');
        }

        createdUrl = URL.createObjectURL(blob);
        if (active) {
          setBlobUrl(createdUrl);
          setLoading(false);
        }
      } catch (err) {
        console.warn('PDF Blob construction fallback triggered:', err);
        if (active) {
          setError(err.message || 'Unable to load PDF preview in browser.');
          setLoading(false);
        }
      }
    };

    loadDocumentBlob();

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [isOpen, documentUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const targetUrl = blobUrl || documentUrl;
    if (!targetUrl) return;

    const a = document.createElement('a');
    a.href = targetUrl;
    a.download = fileName || 'NEC_Document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenNewTab = () => {
    const targetUrl = blobUrl || documentUrl;
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 15, 30, 0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 8000,
      padding: '1.25rem'
    }}>
      <div style={{
        background: '#0B192C',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1000px',
        height: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 100%)',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(241, 196, 15, 0.15)',
              border: '1px solid #D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F1C40F'
            }}>
              <FileCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, fontFamily: 'Cinzel, Georgia, serif', color: '#FFFFFF' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '0.15rem 0 0' }}>
                {subtitle} • <span style={{ color: '#CBD5E1', fontFamily: 'monospace' }}>{fileName}</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleOpenNewTab}
              title="Open in new window"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: 'rgba(255,255,255,0.08)',
                color: '#CBD5E1',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <ExternalLink size={13} /> Open
            </button>

            <button
              type="button"
              onClick={handleDownload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                color: '#070F1E',
                border: 'none',
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Download size={13} /> Download PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#94A3B8',
                border: 'none',
                padding: '0.45rem 0.65rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginLeft: '0.35rem'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Viewer Content Area */}
        <div style={{ flex: 1, background: '#070F1E', position: 'relative', overflow: 'hidden' }}>
          {loading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              color: '#F1C40F'
            }}>
              <RefreshCw size={28} className="animate-spin" />
              <span style={{ fontSize: '0.84rem', color: '#94A3B8', fontWeight: 600 }}>
                Loading verified document stream...
              </span>
            </div>
          )}

          {error && !loading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              textAlign: 'center',
              gap: '1rem',
              color: '#FFFFFF'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444'
              }}>
                <AlertTriangle size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.35rem', color: '#F87171' }}>
                  Document Preview Unavailable
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', maxWidth: '440px', margin: 0, lineHeight: 1.5 }}>
                  The browser inline preview could not be constructed ({error}). You can still download the document directly using the button below.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1.4rem',
                  background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                  color: '#070F1E',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <Download size={15} /> Download Document File
              </button>
            </div>
          )}

          {blobUrl && !loading && !error && (
            <object
              data={blobUrl}
              type="application/pdf"
              style={{ width: '100%', height: '100%', border: 'none' }}
            >
              <iframe
                src={blobUrl}
                title={title}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </object>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { 
  Layers, 
  ArrowLeft, 
  Plus, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Building2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function PortalModuleFallback({ 
  activeModule = 'module', 
  currentUser, 
  onBackToOverview,
  title,
  subtitle,
  children
}) {
  const formattedTitle = title || activeModule.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const formattedSubtitle = subtitle || `Institutional records, compliance criteria, and verification governance for ${formattedTitle}.`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span style={{ cursor: 'pointer' }} onClick={onBackToOverview}>Dashboard</span>
            <ChevronRight size={12} />
            <span>Governance & Administration</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>{formattedTitle}</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            {formattedTitle}
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            {formattedSubtitle}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onBackToOverview}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
          >
            <ArrowLeft size={14} /> Back to Overview
          </button>
        </div>
      </div>

      {children ? children : (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#D4AF37' }}>
            <Layers size={28} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem' }}>
            {formattedTitle} Management Suite
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748B', maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
            This governance workspace is active and synchronized with institutional NAAC/NBA criteria data stores.
          </p>
          <div style={{ display: 'inline-flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onBackToOverview}
              style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 100%)', color: '#F1C40F', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
            >
              Return to Executive Overview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  HelpCircle 
} from 'lucide-react';
import { BULK_IMPORT_MODULE_REGISTRY, BULK_MODULE_CATEGORIES } from '../../../lib/bulk-import/moduleRegistry.js';
import { 
  generateModuleTemplateCsv, 
  generateModuleTemplateXlsx, 
  triggerFileDownload 
} from '../../../lib/bulk-import/bulkImportCore.js';

export default function TemplateLibraryView({ onSelectModuleToImport }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [inspectModule, setInspectModule] = useState(null);

  const modules = Object.values(BULK_IMPORT_MODULE_REGISTRY);

  const filteredModules = modules.filter(mod => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || 
      mod.title.toLowerCase().includes(q) || 
      mod.description.toLowerCase().includes(q) ||
      mod.key.toLowerCase().includes(q);
    
    const matchCat = selectedCategory === 'ALL' || mod.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleDownloadCsv = (moduleKey) => {
    const csvContent = generateModuleTemplateCsv(moduleKey);
    const filename = `NEC_${moduleKey.toUpperCase()}_Template_${BULK_IMPORT_MODULE_REGISTRY[moduleKey].version}.csv`;
    triggerFileDownload(csvContent, filename, 'text/csv;charset=utf-8;');
  };

  const handleDownloadXlsx = (moduleKey) => {
    const buffer = generateModuleTemplateXlsx(moduleKey);
    if (!buffer) return;
    const filename = `NEC_${moduleKey.toUpperCase()}_Template_${BULK_IMPORT_MODULE_REGISTRY[moduleKey].version}.xlsx`;
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
            Institutional Template Library
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
            Download verified versioned CSV & XLSX templates with built-in schema instructions for all 17+ administrative modules.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem 0.45rem 2rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.78rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.78rem',
              background: '#FFFFFF',
              color: '#334155',
              fontWeight: 600
            }}
          >
            <option value="ALL">All Categories</option>
            {BULK_MODULE_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Templates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {filteredModules.map(mod => (
          <div
            key={mod.key}
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileSpreadsheet size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {mod.title}
                    </h3>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B' }}>
                      Version: {mod.version} • {mod.columns.length} columns
                    </span>
                  </div>
                </div>

                <span style={{ padding: '0.2rem 0.5rem', borderRadius: '9999px', background: '#F1F5F9', color: '#475569', fontSize: '0.68rem', fontWeight: 700 }}>
                  {mod.columns.filter(c => c.required).length} Required
                </span>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: '1.4', margin: '0 0 0.85rem 0' }}>
                {mod.description}
              </p>
            </div>

            <div style={{ paddingTop: '0.85rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setInspectModule(mod)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#475569',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                <HelpCircle size={13} /> View Schema
              </button>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => handleDownloadCsv(mod.key, mod.title)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#15803D',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer'
                  }}
                  title="Download clean CSV format"
                >
                  <Download size={13} /> CSV
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadXlsx(mod.key, mod.title)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#1D4ED8',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer'
                  }}
                  title="Download Excel spreadsheet with Instructions sheet"
                >
                  <Download size={13} /> XLSX
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schema Inspector Modal */}
      {inspectModule && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(7, 15, 30, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '750px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.15rem 1.5rem', background: '#0F172A', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {inspectModule.title} — Schema Documentation
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Template Version: {inspectModule.version} • {inspectModule.columns.length} columns defined
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInspectModule(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Table Content */}
            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.5rem 0.65rem' }}>Column Key</th>
                    <th style={{ padding: '0.5rem 0.65rem' }}>Field Label</th>
                    <th style={{ padding: '0.5rem 0.65rem' }}>Type</th>
                    <th style={{ padding: '0.5rem 0.65rem' }}>Required?</th>
                    <th style={{ padding: '0.5rem 0.65rem' }}>Example Format</th>
                  </tr>
                </thead>
                <tbody>
                  {inspectModule.columns.map((col, idx) => (
                    <tr key={col.key} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                      <td style={{ padding: '0.55rem 0.65rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A' }}>
                        {col.key}
                      </td>
                      <td style={{ padding: '0.55rem 0.65rem', fontWeight: 600, color: '#334155' }}>
                        {col.label}
                      </td>
                      <td style={{ padding: '0.55rem 0.65rem', color: '#64748B' }}>
                        <span style={{ background: '#F1F5F9', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                          {col.type}
                        </span>
                      </td>
                      <td style={{ padding: '0.55rem 0.65rem' }}>
                        {col.required ? (
                          <span style={{ color: '#DC2626', fontWeight: 800, fontSize: '0.7rem' }}>REQUIRED</span>
                        ) : (
                          <span style={{ color: '#64748B', fontSize: '0.7rem' }}>Optional</span>
                        )}
                      </td>
                      <td style={{ padding: '0.55rem 0.65rem', color: '#475569', fontStyle: 'italic' }}>
                        {col.example || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '0.85rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setInspectModule(null)}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const mod = inspectModule;
                  setInspectModule(null);
                  if (onSelectModuleToImport) onSelectModuleToImport(mod.key);
                }}
                style={{ padding: '0.45rem 1rem', borderRadius: '6px', border: 'none', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#F1C40F', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
              >
                Import into {inspectModule.title} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

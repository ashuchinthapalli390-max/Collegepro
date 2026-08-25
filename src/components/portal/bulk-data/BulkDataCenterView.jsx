import React, { useState, useMemo } from 'react';
import { 
  UploadCloud, 
  Download, 
  GitBranch, 
  FolderArchive, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  ShieldAlert
} from 'lucide-react';
import { 
  BULK_MODULE_CATEGORIES, 
  BULK_IMPORT_MODULE_REGISTRY, 
  getAccessibleModules 
} from '../../../lib/bulk-import/moduleRegistry.js';
import { 
  getBulkImportJobs 
} from '../../../data/portalStore.js';
import UniversalImportWizard from './UniversalImportWizard.jsx';
import BulkMediaUploadView from './BulkMediaUploadView.jsx';
import TemplateLibraryView from './TemplateLibraryView.jsx';
import ImportHistoryView from './ImportHistoryView.jsx';
import AliasMappingsView from './AliasMappingsView.jsx';
import FormatConverterModal from './FormatConverterModal.jsx';
import { 
  MotionPage, 
  MotionKpiCard, 
  AnimatedKpiGrid 
} from '../../motion/index.js';
import ModulePageHeader from '../../motion/ModulePageHeader.jsx';
import { Sparkles, FileSpreadsheet } from 'lucide-react';

export default function BulkDataCenterView({ currentUser, initialModuleKey = null }) {
  const [activeTab, setActiveTab] = useState(initialModuleKey ? 'wizard' : 'overview');
  const [selectedWizardModule, setSelectedWizardModule] = useState(initialModuleKey || 'academic_events');
  const [converterModalOpen, setConverterModalOpen] = useState(false);
  const [converterModuleKey, setConverterModuleKey] = useState('attendance');
  const [, setDataVersion] = useState(0);
  const [searchModuleQuery, setSearchModuleQuery] = useState('');

  const refresh = () => {
    setDataVersion(v => v + 1);
  };

  const importJobs = getBulkImportJobs();

  // Real KPIs (0 when empty, no fake metrics)
  const kpis = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const jobsThisMonth = importJobs.filter(j => {
      if (!j.createdAt) return false;
      const d = new Date(j.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && j.status !== 'ROLLED_BACK';
    }).length;

    const totalImportedRows = importJobs
      .filter(j => j.status !== 'ROLLED_BACK')
      .reduce((sum, j) => sum + (j.importedRows || 0), 0);

    const rowsRequiringReview = importJobs
      .filter(j => j.status === 'COMPLETED_WITH_ERRORS' || j.status === 'READY')
      .reduce((sum, j) => sum + ((j.totalRows || 0) - (j.importedRows || 0)), 0);

    const failedImports = importJobs.filter(j => j.status === 'FAILED').length;
    const pendingJobs = importJobs.filter(j => j.status === 'READY' || j.status === 'UPLOADED').length;

    return {
      jobsThisMonth,
      totalImportedRows,
      rowsRequiringReview,
      failedImports,
      pendingJobs
    };
  }, [importJobs]);

  const accessibleModules = getAccessibleModules(currentUser);

  const filteredCategories = useMemo(() => {
    const q = searchModuleQuery.toLowerCase().trim();
    if (!q) return BULK_MODULE_CATEGORIES;

    return BULK_MODULE_CATEGORIES.map(cat => {
      const matchingModuleKeys = cat.moduleKeys.filter(k => {
        const mod = BULK_IMPORT_MODULE_REGISTRY[k];
        return mod && (
          mod.title.toLowerCase().includes(q) ||
          mod.description.toLowerCase().includes(q) ||
          mod.key.toLowerCase().includes(q)
        );
      });

      if (matchingModuleKeys.length > 0) {
        return { ...cat, moduleKeys: matchingModuleKeys };
      }
      return null;
    }).filter(Boolean);
  }, [searchModuleQuery]);

  const handleStartImportForModule = (moduleKey) => {
    setSelectedWizardModule(moduleKey);
    setActiveTab('wizard');
  };

  return (
    <MotionPage>
      {/* 1. Page Header & Quick Navigation */}
      <ModulePageHeader
        breadcrumbs={[
          { label: 'Dashboard' },
          { label: 'Administration & IAM' },
          { label: 'Bulk Data Center' }
        ]}
        title="Bulk Data Center"
        subtitle="Import, validate, review, and manage institutional datasets and media using controlled CSV, Excel, and folder workflows."
        customActions={
          <>
            <button
              type="button"
              onClick={() => {
                setConverterModuleKey('attendance');
                setConverterModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.48rem 0.85rem',
                background: 'linear-gradient(135deg, #070F1E 0%, #1E293B 100%)',
                border: '1px solid #D4AF37',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#F1C40F',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={14} /> Smart Converter & Import
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.48rem 0.85rem',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#1E293B',
                cursor: 'pointer'
              }}
            >
              <Download size={14} /> Templates
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('media')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.48rem 0.85rem',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#2563EB',
                cursor: 'pointer'
              }}
            >
              <FolderArchive size={14} /> Bulk Media
            </button>
          </>
        }
        primaryAction={{
          label: 'Start New Import',
          icon: UploadCloud,
          onClick: () => {
            setSelectedWizardModule('academic_events');
            setActiveTab('wizard');
          }
        }}
      />

      {/* 2. Real Live Institutional KPIs */}
      <AnimatedKpiGrid minWidth="150px">
        <MotionKpiCard label="Imports This Month" value={kpis.jobsThisMonth} icon={UploadCloud} color="#2563EB" bg="#EFF6FF" />
        <MotionKpiCard label="Rows Imported" value={kpis.totalImportedRows} icon={CheckCircle2} color="#059669" bg="#ECFDF5" />
        <MotionKpiCard label="Rows Requiring Review" value={kpis.rowsRequiringReview} icon={AlertTriangle} color="#D97706" bg="#FEFCE8" />
        <MotionKpiCard label="Failed Import Jobs" value={kpis.failedImports} icon={ShieldAlert} color="#DC2626" bg="#FEF2F2" />
        <MotionKpiCard label="Staged / Pending Jobs" value={kpis.pendingJobs} icon={Clock} color="#9333EA" bg="#FDF4FF" />
      </AnimatedKpiGrid>

      {/* 3. Horizontal Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Overview & Modules', icon: Layers },
          { id: 'wizard', label: 'Import Wizard', icon: UploadCloud },
          { id: 'media', label: 'Bulk Media Upload', icon: FolderArchive },
          { id: 'templates', label: 'Template Library', icon: Download },
          { id: 'history', label: 'Import History & Rollback', icon: Clock },
          { id: 'mappings', label: 'Alias Mappings', icon: GitBranch }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.75rem 1.15rem',
                border: 'none',
                background: 'transparent',
                borderBottom: isActive ? '2.5px solid #F1C40F' : '2.5px solid transparent',
                color: isActive ? '#0F172A' : '#64748B',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={15} color={isActive ? '#0F172A' : '#94A3B8'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: OVERVIEW & MODULES GRID */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Smart Universal Importer & Converter Hero Card */}
          <div style={{
            background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 100%)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '650px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(241, 196, 15, 0.15)',
                border: '1px solid #D4AF37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F1C40F',
                flexShrink: 0
              }}>
                <Sparkles size={26} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.25rem', fontFamily: 'Cinzel, Georgia, serif', color: '#F1C40F' }}>
                  Smart Universal Importer & Format Converter
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#CBD5E1', margin: 0, lineHeight: 1.5 }}>
                  Upload arbitrary Excel or CSV spreadsheets directly. The engine automatically detects table headers, multi-sheet workbooks, maps student/faculty columns via semantic aliases, and normalizes ET department boundaries.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setConverterModuleKey('attendance');
                setConverterModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.35rem',
                background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                color: '#070F1E',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(241, 196, 15, 0.3)'
              }}
            >
              <FileSpreadsheet size={16} /> Open Smart Converter
            </button>
          </div>

          {/* Search bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.2rem 0' }}>
                Available Institutional Modules ({accessibleModules.length})
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                Select an institutional domain to initiate schema-validated bulk data ingestion.
              </p>
            </div>

            <div style={{ position: 'relative', width: '250px' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchModuleQuery}
                onChange={(e) => setSearchModuleQuery(e.target.value)}
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
          </div>

          {/* Module Categories */}
          {filteredCategories.map(cat => (
            <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.35rem' }}>
                <h4 style={{ margin: '0 0 0.15rem 0', fontSize: '0.88rem', fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {cat.label}
                </h4>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748B' }}>
                  {cat.description}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '0.85rem' }}>
                {cat.moduleKeys.map(k => {
                  const mod = BULK_IMPORT_MODULE_REGISTRY[k];
                  if (!mod) return null;

                  return (
                    <div
                      key={mod.key}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                          <h5 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                            {mod.title}
                          </h5>
                          <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: '#F1F5F9', color: '#475569', fontWeight: 700 }}>
                            {mod.version}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                          {mod.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.65rem', borderTop: '1px solid #F1F5F9' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                          {mod.columns.length} columns • {mod.columns.filter(c => c.required).length} required
                        </span>

                        <button
                          type="button"
                          onClick={() => handleStartImportForModule(mod.key)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                            color: '#F1C40F',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          Import →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: UNIVERSAL WIZARD */}
      {activeTab === 'wizard' && (
        <UniversalImportWizard
          initialModuleKey={selectedWizardModule}
          currentUser={currentUser}
          onImportComplete={() => {
            refresh();
          }}
          onCancel={() => setActiveTab('overview')}
        />
      )}

      {/* TAB 3: BULK MEDIA UPLOAD */}
      {activeTab === 'media' && (
        <BulkMediaUploadView
          currentUser={currentUser}
          onImportComplete={() => {
            refresh();
          }}
        />
      )}

      {/* TAB 4: TEMPLATE LIBRARY */}
      {activeTab === 'templates' && (
        <TemplateLibraryView
          onSelectModuleToImport={(modKey) => {
            setSelectedWizardModule(modKey);
            setActiveTab('wizard');
          }}
        />
      )}

      {/* TAB 5: IMPORT HISTORY */}
      {activeTab === 'history' && (
        <ImportHistoryView
          currentUser={currentUser}
          onRefreshNeeded={refresh}
        />
      )}

      {/* TAB 6: ALIAS MAPPINGS */}
      {activeTab === 'mappings' && (
        <AliasMappingsView
          currentUser={currentUser}
        />
      )}

      {/* Format Converter & Smart Importer Modal */}
      <FormatConverterModal
        isOpen={converterModalOpen}
        onClose={() => setConverterModalOpen(false)}
        initialModuleKey={converterModuleKey}
        currentUser={currentUser}
        onImportSuccess={() => {
          refresh();
        }}
      />
    </MotionPage>
  );
}

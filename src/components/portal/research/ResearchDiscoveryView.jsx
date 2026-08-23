import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Layers, 
  UserCheck, 
  UserX, 
  BookOpen, 
  Award, 
  Globe, 
  CheckSquare, 
  Square, 
  Download, 
  RefreshCw, 
  X, 
  Info,
  Database,
  Filter,
  Eye,
  Unlink,
  Check,
  Building2,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { FACULTY_DATA } from '../../../data/masterData.js';
import { matchResearcherProfiles } from '../../../lib/research/matchingEngine.js';
import { runLocalResearchDiscovery } from '../../../lib/research/localDiscoveryEngine.js';
import { 
  getFacultyResearchProfile, 
  linkFacultyResearcher, 
  unlinkFacultyResearcher, 
  importPublicationsBatch 
} from '../../../data/portalStore.js';

export default function ResearchDiscoveryView({ currentUser, onNavigate }) {
  const initialFacultyId = currentUser?.facultyId || (currentUser?.role === 'FACULTY' ? currentUser.facultyId : FACULTY_DATA[0]?.id) || 'NEC-PER-0284';
  const [selectedFacultyId, setSelectedFacultyId] = useState(initialFacultyId);
  const facultyRecord = FACULTY_DATA.find(f => f.id === selectedFacultyId) || FACULTY_DATA[0];

  // Current Research Profile State
  const [currentProfile, setCurrentProfile] = useState(null);

  // Discovery / Matching State
  const [searching, setSearching] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState({ stage: 'IDLE', message: '', percent: 0 });
  const [matchResult, setMatchResult] = useState(null);

  // Publication Extraction State
  const [extractingWorks, setExtractingWorks] = useState(false);
  const [extractProgress, setExtractProgress] = useState({ stage: 'IDLE', message: '', percent: 0 });
  const [discoveredCandidates, setDiscoveredCandidates] = useState(null);
  const [selectedCandidateKeys, setSelectedCandidateKeys] = useState({});
  const [activeTab, setActiveTab] = useState('NEW');
  const [comparisonCandidate, setComparisonCandidate] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importNotice, setImportNotice] = useState('');

  // Load faculty's current stored profile when faculty changes
  useEffect(() => {
    if (selectedFacultyId) {
      const stored = getFacultyResearchProfile(selectedFacultyId);
      setCurrentProfile(stored);
      // Reset discovery & selection state
      setMatchResult(null);
      setDiscoveredCandidates(null);
      setSelectedCandidateKeys({});
      setImportNotice('');
      setMatchingProgress({ stage: 'IDLE', message: '', percent: 0 });
      setExtractProgress({ stage: 'IDLE', message: '', percent: 0 });
    }
  }, [selectedFacultyId]);

  // Handle "Discover Research Profile"
  const handleDiscoverProfile = async () => {
    setSearching(true);
    setMatchResult(null);
    setDiscoveredCandidates(null);
    setImportNotice('');

    setMatchingProgress({ stage: 'SEARCHING', message: 'Preparing faculty identity & normalized tokens...', percent: 25 });
    await new Promise(r => setTimeout(r, 250));

    setMatchingProgress({ stage: 'MATCHING', message: 'Scanning local OpenAlex index for Narasaraopeta Engineering College researchers...', percent: 55 });
    await new Promise(r => setTimeout(r, 300));

    setMatchingProgress({ stage: 'RESOLVING', message: 'Evaluating deterministic multi-tier evidence (ORCID, name variants, affiliation)...', percent: 85 });
    await new Promise(r => setTimeout(r, 250));

    const result = matchResearcherProfiles(facultyRecord);
    setSearching(false);
    setMatchResult(result);
    setMatchingProgress({ stage: 'COMPLETE', message: 'Candidate researcher matching complete.', percent: 100 });
  };

  // Handle Human Confirmation of Candidate
  const handleConfirmCandidate = async (candidate) => {
    const updated = linkFacultyResearcher(selectedFacultyId, candidate, currentUser);
    setCurrentProfile(updated);
    setMatchResult(null);

    // Auto-trigger publication extraction from local dataset for confirmed researcher
    handleDiscoverWorks(candidate);
  };

  // Handle Unlinking Researcher Profile
  const handleUnlinkProfile = () => {
    if (window.confirm(`Are you sure you want to unlink the research profile for ${facultyRecord.name}?`)) {
      unlinkFacultyResearcher(selectedFacultyId, currentUser);
      setCurrentProfile(getFacultyResearchProfile(selectedFacultyId));
      setDiscoveredCandidates(null);
      setSelectedCandidateKeys({});
    }
  };

  // Handle Discovering Works for Confirmed Researcher
  const handleDiscoverWorks = async (confirmedCandidate = null) => {
    const candidateToQuery = confirmedCandidate || {
      openAlexAuthorId: currentProfile?.openAlexAuthorId,
      canonicalName: facultyRecord.name,
      orcid: currentProfile?.orcid || facultyRecord.orcid
    };

    if (!candidateToQuery.openAlexAuthorId) {
      alert('No confirmed OpenAlex researcher ID linked to this faculty member.');
      return;
    }

    setExtractingWorks(true);
    setDiscoveredCandidates(null);
    setSelectedCandidateKeys({});

    const result = await runLocalResearchDiscovery(candidateToQuery, (prog) => {
      setExtractProgress(prog);
    });

    setExtractingWorks(false);

    if (result.success) {
      setDiscoveredCandidates(result);
      // Auto-select all NEW candidates
      const initialSelection = {};
      result.candidates.forEach(c => {
        if (c.classification === 'NEW') {
          initialSelection[c.candidateId] = true;
        }
      });
      setSelectedCandidateKeys(initialSelection);
    } else {
      alert(result.error || 'Failed to extract publications from local index.');
    }
  };

  const toggleSelectCandidate = (id) => {
    setSelectedCandidateKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelectAll = (select) => {
    if (!discoveredCandidates) return;
    const updated = {};
    discoveredCandidates.candidates.forEach(c => {
      if (select) {
        if (activeTab === 'ALL' || c.classification === activeTab) {
          updated[c.candidateId] = true;
        }
      }
    });
    setSelectedCandidateKeys(updated);
  };

  // Import Selected / Add All New
  const handleImportCandidates = (onlyNew = false) => {
    if (!discoveredCandidates) return;
    let toImport = [];
    if (onlyNew) {
      toImport = discoveredCandidates.candidates.filter(c => c.classification === 'NEW');
    } else {
      toImport = discoveredCandidates.candidates.filter(c => selectedCandidateKeys[c.candidateId]);
    }

    if (toImport.length === 0) {
      alert(onlyNew ? 'No NEW publications ready to import.' : 'Please select at least one publication to import.');
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
      setImportNotice(`Successfully imported ${toImport.length} publication(s) into institutional review queue (Status: IMPORTED_PENDING_REVIEW).`);
      // Update candidate selections
      setSelectedCandidateKeys({});
    }, 450);
  };

  const filteredCandidates = discoveredCandidates?.candidates.filter(c => {
    if (activeTab === 'ALL') return true;
    return c.classification === activeTab;
  }) || [];

  const selectedCount = Object.values(selectedCandidateKeys).filter(Boolean).length;
  const isProfileLinked = currentProfile?.openAlexAuthorId && currentProfile?.openAlexMatchStatus === 'MANUALLY_CONFIRMED';

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header Banner */}
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
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#FFFFFF', fontFamily: 'Cinzel, Georgia, serif' }}>
                NEC Research Discovery & Local Scholarly Index
              </h1>
              <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#059669', color: '#FFFFFF', fontWeight: 800 }}>
                ZERO RUNTIME APIS • 100% LOCAL
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#CBD5E1', margin: 0 }}>
              Deterministic OpenAlex Parquet snapshot matching, Crossref DOI enrichment, and institutional deduplication.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#94A3B8' }}>
            <div>Dataset: <strong>OpenAlex June 2026</strong></div>
            <div>Crossref: <strong>March 2026</strong> • ORCID: <strong>2025</strong></div>
          </div>
        </div>
      </div>

      {/* 2. Faculty Researcher Selector & Identity Status */}
      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
              FACULTY RESEARCHER *
            </label>
            <select
              value={selectedFacultyId}
              onChange={(e) => setSelectedFacultyId(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', background: '#F8FAFC', fontWeight: 700, color: '#0F172A' }}
            >
              {FACULTY_DATA.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.department} - {f.designation})
                </option>
              ))}
            </select>
          </div>

          <div style={{ background: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Research Identity Binding
            </div>
            {isProfileLinked ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={15} /> Confirmed: {currentProfile.openAlexAuthorId.replace('https://openalex.org/', '')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    Works: {currentProfile.openAlexWorksCount || 0} • Citations: {currentProfile.openAlexCitedByCount || 0} • h-index: {currentProfile.openAlexHIndex || 0}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleUnlinkProfile}
                  title="Unlink this OpenAlex author profile"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.65rem', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '6px', fontSize: '0.7rem', color: '#DC2626', fontWeight: 700, cursor: 'pointer' }}
                >
                  <Unlink size={12} /> Unlink
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
                  No OpenAlex profile connected yet.
                </span>
                <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: '#FEF3C7', color: '#92400E', fontWeight: 800 }}>
                  UNLINKED
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            {!isProfileLinked ? (
              <button
                type="button"
                disabled={searching}
                onClick={handleDiscoverProfile}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                  color: '#070F1E',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: searching ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'
                }}
              >
                <Search size={14} className={searching ? 'animate-spin' : ''} />
                {searching ? 'Searching Local Index...' : 'Discover Research Profile'}
              </button>
            ) : (
              <button
                type="button"
                disabled={extractingWorks}
                onClick={() => handleDiscoverWorks()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #070F1E 0%, #0B192C 100%)',
                  color: '#F1C40F',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: extractingWorks ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(7, 15, 30, 0.25)'
                }}
              >
                <RefreshCw size={14} className={extractingWorks ? 'animate-spin' : ''} />
                {extractingWorks ? 'Extracting Works...' : 'Discover Publications'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Real Step Progress Banner */}
      {(searching || extractingWorks) && (
        <div style={{ background: '#EFF6FF', borderRadius: '12px', border: '1px solid #BFDBFE', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E40AF' }}>
              {searching ? matchingProgress.message : extractProgress.message}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB' }}>
              {searching ? matchingProgress.percent : extractProgress.percent}%
            </span>
          </div>
          <div style={{ height: '6px', background: '#DBEAFE', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${searching ? matchingProgress.percent : extractProgress.percent}%`, height: '100%', background: '#2563EB', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* 4. Candidate Researcher Profiles (Confirmation Gate) */}
      {matchResult && !isProfileLinked && (
        <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.2rem' }}>
                Possible Researcher Profiles in Local Scholarly Index
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                Please verify researcher identity before binding to prevent cross-author attribution errors.
              </p>
            </div>
            <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', background: '#F1F5F9', fontWeight: 800, color: '#334155' }}>
              {matchResult.candidates.length} Candidate(s) Found
            </span>
          </div>

          {matchResult.candidates.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '10px', color: '#64748B', fontSize: '0.84rem' }}>
              No matching researcher records found in the local OpenAlex/ORCID index for <strong>{facultyRecord.name}</strong>.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {matchResult.candidates.map(candidate => (
                <div
                  key={candidate.id}
                  style={{
                    background: '#FAFBFF',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.85rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {candidate.canonicalName}
                      </h4>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: candidate.classification === 'EXACT_MATCH' ? '#ECFDF5' : (candidate.classification === 'HIGH_CONFIDENCE' ? '#EFF6FF' : '#FEF3C7'),
                        color: candidate.classification === 'EXACT_MATCH' ? '#047857' : (candidate.classification === 'HIGH_CONFIDENCE' ? '#1E40AF' : '#92400E'),
                        border: `1px solid ${candidate.classification === 'EXACT_MATCH' ? '#A7F3D0' : (candidate.classification === 'HIGH_CONFIDENCE' ? '#BFDBFE' : '#FDE68A')}`
                      }}>
                        {candidate.classification.replace('_', ' ')} ({candidate.matchScore} pts)
                      </span>
                    </div>

                    <div style={{ fontSize: '0.74rem', color: '#475569', marginBottom: '0.5rem' }}>
                      <strong>Institution:</strong> {candidate.primaryAffiliation}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.72rem', color: '#64748B', marginBottom: '0.65rem' }}>
                      <span><strong>Works:</strong> {candidate.worksCount}</span>
                      <span><strong>Citations:</strong> {candidate.citedByCount}</span>
                      <span><strong>h-index:</strong> {candidate.hIndex}</span>
                      {candidate.orcid && <span><strong>ORCID:</strong> {candidate.orcid}</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                      {candidate.topics?.map((t, idx) => (
                        <span key={idx} style={{ fontSize: '0.64rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: '#F1F5F9', color: '#334155', fontWeight: 600 }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div style={{ fontSize: '0.7rem', color: '#059669', background: '#ECFDF5', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                      {candidate.evidence.map((ev, evi) => (
                        <div key={evi}>✓ {ev}</div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => handleConfirmCandidate(candidate)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.76rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <UserCheck size={14} /> This Is The Correct Researcher
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatchResult(null)}
                      style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.76rem', fontWeight: 700, color: '#64748B', cursor: 'pointer' }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Import Success Notice */}
      {importNotice && (
        <div style={{ background: '#ECFDF5', borderRadius: '10px', border: '1px solid #A7F3D0', padding: '0.85rem 1.25rem', color: '#065F46', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} /> {importNotice}
          </span>
          <button type="button" onClick={() => setImportNotice('')} style={{ background: 'none', border: 'none', color: '#047857', cursor: 'pointer' }}><X size={14} /></button>
        </div>
      )}

      {/* 6. Discovered Publications List */}
      {discoveredCandidates && (
        <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {[
              { label: 'Total Discovered', value: discoveredCandidates.summary.totalDiscovered, color: '#0F172A', bg: '#F8FAFC' },
              { label: 'New Ready to Import', value: discoveredCandidates.summary.newRecords, color: '#059669', bg: '#ECFDF5' },
              { label: 'Duplicates in Portal', value: discoveredCandidates.summary.duplicates, color: '#D97706', bg: '#FEFCE8' },
              { label: 'Cross-Source Enriched', value: discoveredCandidates.summary.crossSourceEnriched, color: '#2563EB', bg: '#EFF6FF' }
            ].map((k, idx) => (
              <div key={idx} style={{ background: k.bg, padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{k.label}</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: k.color, fontFamily: 'Cinzel, serif' }}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Candidate Tabs & Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[
                { id: 'NEW', label: `New (${discoveredCandidates.summary.newRecords})` },
                { id: 'ALL', label: `All Discovered (${discoveredCandidates.candidates.length})` },
                { id: 'EXACT_DUPLICATE', label: `Duplicates (${discoveredCandidates.summary.duplicates})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeTab === tab.id ? '#070F1E' : '#F1F5F9',
                    color: activeTab === tab.id ? '#F1C40F' : '#475569',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => handleSelectAll(true)}
                style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Select All
              </button>
              <span style={{ color: '#CBD5E1' }}>•</span>
              <button
                type="button"
                onClick={() => handleSelectAll(false)}
                style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Deselect All
              </button>
              <span style={{ color: '#CBD5E1' }}>•</span>
              <button
                type="button"
                disabled={importing || discoveredCandidates.summary.newRecords === 0}
                onClick={() => handleImportCandidates(true)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#059669',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: discoveredCandidates.summary.newRecords === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Add All New ({discoveredCandidates.summary.newRecords})
              </button>
            </div>
          </div>

          {/* Cards List */}
          {filteredCandidates.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem' }}>
              No candidate publications found for the selected tab filter.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredCandidates.map(c => {
                const isSelected = !!selectedCandidateKeys[c.candidateId];
                const isNew = c.classification === 'NEW';

                return (
                  <div
                    key={c.candidateId}
                    style={{
                      background: isSelected ? '#FAFBFF' : '#FFFFFF',
                      borderRadius: '12px',
                      border: isSelected ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectCandidate(c.candidateId)}
                      style={{ marginTop: '4px', width: '16px', height: '16px', cursor: 'pointer' }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>
                          {c.title}
                        </div>
                        <span style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          background: isNew ? '#ECFDF5' : '#FEFCE8',
                          color: isNew ? '#047857' : '#92400E',
                          border: `1px solid ${isNew ? '#A7F3D0' : '#FDE68A'}`,
                          whiteSpace: 'nowrap'
                        }}>
                          {c.classification.replace('_', ' ')}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: '0.45rem' }}>
                        {c.journalName ? `${c.journalName} • ` : ''}Year: {c.publicationYear} {c.doi ? `• DOI: ${c.doi}` : ''}
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {c.sources?.map((s, si) => (
                          <span key={si} style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px', background: s === 'OPENALEX' ? '#0F172A' : (s === 'CROSSREF' ? '#D97706' : '#2563EB'), color: '#FFFFFF' }}>
                            {s}
                          </span>
                        ))}

                        {c.openAlexCitations !== undefined && (
                          <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>
                            OpenAlex Citations: {c.openAlexCitations}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => setComparisonCandidate(c)}
                          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          Compare Sources <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Import Selected Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              <strong>{selectedCount}</strong> publication(s) selected for import.
            </div>

            <button
              type="button"
              disabled={importing || selectedCount === 0}
              onClick={() => handleImportCandidates(false)}
              style={{
                padding: '0.55rem 1.4rem',
                borderRadius: '8px',
                border: 'none',
                background: selectedCount === 0 ? '#CBD5E1' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
                boxShadow: selectedCount === 0 ? 'none' : '0 2px 10px rgba(16, 185, 129, 0.3)'
              }}
            >
              {importing ? 'Importing Selected...' : `Import Selected (${selectedCount})`}
            </button>
          </div>
        </div>
      )}

      {/* 7. Compare Sources Dialog */}
      {comparisonCandidate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 15, 30, 0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '650px', width: '100%', border: '1px solid #D4AF37', overflow: 'hidden' }}>
            <div style={{ background: '#070F1E', padding: '1rem 1.25rem', color: '#FFFFFF', borderBottom: '2px solid #D4AF37', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Compare Discovered Metadata</h3>
              <button type="button" onClick={() => setComparisonCandidate(null)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
              <div><strong>Title:</strong> {comparisonCandidate.title}</div>
              <div><strong>DOI:</strong> {comparisonCandidate.doi || '—'}</div>
              <div><strong>Journal:</strong> {comparisonCandidate.journalName || '—'}</div>
              <div><strong>Publisher:</strong> {comparisonCandidate.publisher || '—'}</div>
              <div><strong>OpenAlex Citations:</strong> {comparisonCandidate.openAlexCitations}</div>
              <div><strong>Sources Supplying Metadata:</strong> {comparisonCandidate.sources?.join(', ')}</div>
            </div>
            <div style={{ padding: '0.75rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setComparisonCandidate(null)} style={{ padding: '0.4rem 0.85rem', background: '#070F1E', color: '#F1C40F', border: 'none', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

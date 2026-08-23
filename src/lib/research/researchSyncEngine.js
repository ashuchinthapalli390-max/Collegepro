/**
 * Unified Multi-Source Research Profile & Publication Synchronization Engine
 * Connects ORCID, Elsevier Scopus, Clarivate Web of Science, and Crossref
 */

import { fetchCrossrefMetadata, normalizeDOI, isValidDOI } from './doiService.js';
import { fetchOrcidData, isValidOrcid, normalizeOrcid } from './orcidService.js';
import { fetchScopusData, isValidScopusAuthorId, normalizeScopusAuthorId } from './scopusService.js';
import { fetchWosData, isValidWosResearcherId, normalizeWosResearcherId } from './wosService.js';
import { getPublications } from '../../data/portalStore.js';

/**
 * Normalizes title string for duplicate fuzzy matching
 * @param {string} title 
 * @returns {string}
 */
export function normalizeTitle(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Executes a full multi-source research discovery and deduplication pipeline
 * @param {object} identifiers { orcid, scopusAuthorId, wosResearcherId }
 * @param {function} onProgress (statusObj) => void
 * @returns {Promise<{success: boolean, summary: object, candidates: Array, profiles: object, error?: string}>}
 */
export async function runResearchSyncJob(identifiers = {}, onProgress = null) {
  const emit = (stage, message, percent) => {
    if (onProgress) onProgress({ stage, message, percent });
  };

  const orcid = normalizeOrcid(identifiers.orcid);
  const scopusId = normalizeScopusAuthorId(identifiers.scopusAuthorId);
  const wosId = normalizeWosResearcherId(identifiers.wosResearcherId);

  if (!orcid && !scopusId && !wosId) {
    return {
      success: false,
      error: 'Please provide at least one valid researcher identifier (ORCID, Scopus Author ID, or WoS ResearcherID).'
    };
  }

  const profiles = {
    orcid: null,
    scopus: null,
    wos: null
  };

  const collectedWorks = [];

  try {
    // ──────── STAGE 1: ORCID DISCOVERY ────────
    if (orcid) {
      emit('ORCID', `Connecting to official ORCID registry for ${orcid}...`, 15);
      const orcidRes = await fetchOrcidData(orcid);
      if (orcidRes.success) {
        profiles.orcid = orcidRes.profile;
        if (Array.isArray(orcidRes.works)) {
          collectedWorks.push(...orcidRes.works);
        }
        emit('ORCID', `✓ Loaded ORCID profile and ${orcidRes.works?.length || 0} works`, 30);
      } else {
        emit('ORCID', `⚠ ORCID Notice: ${orcidRes.error}`, 30);
      }
    }

    // ──────── STAGE 2: SCOPUS DISCOVERY ────────
    if (scopusId) {
      emit('SCOPUS', `Querying Elsevier Scopus Author ID ${scopusId}...`, 40);
      const scopusRes = await fetchScopusData(scopusId);
      if (scopusRes.success) {
        profiles.scopus = scopusRes.profile;
        if (Array.isArray(scopusRes.documents)) {
          collectedWorks.push(...scopusRes.documents);
        }
        emit('SCOPUS', `✓ Loaded Scopus author profile and ${scopusRes.documents?.length || 0} documents`, 55);
      }
    }

    // ──────── STAGE 3: WEB OF SCIENCE DISCOVERY ────────
    if (wosId) {
      emit('WOS', `Retrieving Web of Science ResearcherID ${wosId}...`, 60);
      const wosRes = await fetchWosData(wosId);
      if (wosRes.success) {
        profiles.wos = wosRes.profile;
        if (Array.isArray(wosRes.documents)) {
          collectedWorks.push(...wosRes.documents);
        }
        emit('WOS', `✓ Loaded WoS profile and ${wosRes.documents?.length || 0} documents`, 70);
      }
    }

    // ──────── STAGE 4: CROSSREF DOI METADATA ENRICHMENT ────────
    emit('CROSSREF', 'Enriching publication records with Crossref bibliographic metadata...', 75);
    const enrichedMap = new Map();

    for (let i = 0; i < collectedWorks.length; i++) {
      const work = collectedWorks[i];
      const canonicalDoi = normalizeDOI(work.doi);

      if (canonicalDoi && isValidDOI(canonicalDoi) && !enrichedMap.has(canonicalDoi)) {
        try {
          const crossrefRes = await fetchCrossrefMetadata(canonicalDoi);
          if (crossrefRes.success) {
            enrichedMap.set(canonicalDoi, crossrefRes.data);
          }
        } catch {
          // Graceful fallback
        }
      }
    }
    emit('CROSSREF', `✓ Enriched metadata for ${enrichedMap.size} publications with official DOI registration`, 85);

    // ──────── STAGE 5: MERGING & DEDUPLICATION ────────
    emit('DEDUPLICATION', 'Matching existing institutional records and removing cross-source duplicates...', 90);

    const existingPubs = getPublications(true);
    const candidateMap = new Map();

    collectedWorks.forEach(work => {
      const canonicalDoi = normalizeDOI(work.doi);
      const key = canonicalDoi || work.scopusEid || work.wosUid || normalizeTitle(work.title);

      if (candidateMap.has(key)) {
        // Merge into existing candidate
        const existing = candidateMap.get(key);
        existing.sources = Array.from(new Set([...existing.sources, work.source]));
        if (!existing.doi && canonicalDoi) existing.doi = canonicalDoi;
        if (!existing.scopusEid && work.scopusEid) existing.scopusEid = work.scopusEid;
        if (!existing.wosUid && work.wosUid) existing.wosUid = work.wosUid;
        if (work.scopusCitations) existing.scopusCitations = work.scopusCitations;
        if (work.wosCitations) existing.wosCitations = work.wosCitations;
      } else {
        const enriched = canonicalDoi ? enrichedMap.get(canonicalDoi) : null;

        const candidate = {
          candidateId: 'CAND-' + Math.random().toString(36).substring(2, 9),
          title: enriched?.title || work.title,
          publicationType: enriched?.publicationType || work.publicationType || 'Journal Article',
          journalName: enriched?.journalName || work.journalName || '',
          publisher: enriched?.publisher || work.publisher || '',
          publicationDate: enriched?.publicationDate || work.publicationDate || `${new Date().getFullYear()}-01-01`,
          publicationYear: enriched?.publicationYear || work.publicationYear || new Date().getFullYear(),
          volume: enriched?.volume || work.volume || '',
          issue: enriched?.issue || work.issue || '',
          pages: enriched?.pages || work.pages || '',
          articleNumber: enriched?.articleNumber || work.articleNumber || '',
          issn: enriched?.issn || work.issn || '',
          isbn: enriched?.isbn || work.isbn || '',
          doi: canonicalDoi || work.doi || '',
          scopusEid: work.scopusEid || '',
          wosUid: work.wosUid || '',
          url: enriched?.url || work.url || (canonicalDoi ? `https://doi.org/${canonicalDoi}` : ''),
          sources: [work.source, ...(enriched ? ['CROSSREF'] : [])],
          authors: enriched?.authors?.length ? enriched.authors : (work.authors || []),
          scopusCitations: work.scopusCitations || null,
          wosCitations: work.wosCitations || null,
          indexing: [
            ...(work.scopusEid || work.scopusIndexed === 'Yes' ? ['Scopus'] : []),
            ...(work.wosUid || work.wosIndexed === 'Yes' ? ['Web of Science'] : []),
            'Crossref'
          ],
          classification: 'NEW', // Default
          matchReason: '',
          existingRecordId: null,
          selected: true
        };

        // Classify duplicate against existing institutional database
        const exactDoiMatch = canonicalDoi ? existingPubs.find(p => normalizeDOI(p.doi) === canonicalDoi) : null;
        const exactEidMatch = work.scopusEid ? existingPubs.find(p => p.scopusEid === work.scopusEid) : null;
        const exactWosMatch = work.wosUid ? existingPubs.find(p => p.wosUid === work.wosUid) : null;
        const titleMatch = existingPubs.find(p => normalizeTitle(p.title) === normalizeTitle(work.title) && p.publicationYear === work.publicationYear);

        if (exactDoiMatch) {
          candidate.classification = 'EXACT_DUPLICATE';
          candidate.matchReason = `Exact DOI match with existing record ${exactDoiMatch.publicationRecordNumber || exactDoiMatch.id}`;
          candidate.existingRecordId = exactDoiMatch.id;
          candidate.selected = false;
        } else if (exactEidMatch) {
          candidate.classification = 'EXACT_DUPLICATE';
          candidate.matchReason = `Scopus EID match with existing record ${exactEidMatch.publicationRecordNumber || exactEidMatch.id}`;
          candidate.existingRecordId = exactEidMatch.id;
          candidate.selected = false;
        } else if (exactWosMatch) {
          candidate.classification = 'EXACT_DUPLICATE';
          candidate.matchReason = `Web of Science UID match with existing record ${exactWosMatch.publicationRecordNumber || exactWosMatch.id}`;
          candidate.existingRecordId = exactWosMatch.id;
          candidate.selected = false;
        } else if (titleMatch) {
          candidate.classification = 'LIKELY_DUPLICATE';
          candidate.matchReason = `Title and Year match with existing record ${titleMatch.publicationRecordNumber || titleMatch.id}`;
          candidate.existingRecordId = titleMatch.id;
          candidate.selected = false;
        } else {
          candidate.classification = 'NEW';
          candidate.matchReason = 'Unique research record';
          candidate.selected = true;
        }

        candidateMap.set(key, candidate);
      }
    });

    const candidateList = Array.from(candidateMap.values());

    const summary = {
      totalDiscovered: collectedWorks.length,
      uniqueWorks: candidateList.length,
      newRecords: candidateList.filter(c => c.classification === 'NEW').length,
      duplicates: candidateList.filter(c => c.classification === 'EXACT_DUPLICATE' || c.classification === 'LIKELY_DUPLICATE').length,
      updates: candidateList.filter(c => c.classification === 'UPDATE_AVAILABLE').length
    };

    emit('COMPLETE', `Sync complete: ${summary.newRecords} new publications ready for review.`, 100);

    return {
      success: true,
      summary: summary,
      candidates: candidateList,
      profiles: profiles
    };
  } catch (err) {
    emit('ERROR', `Sync error: ${err.message}`, 100);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred during research sync.'
    };
  }
}

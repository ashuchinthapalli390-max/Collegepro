/**
 * Local Research Discovery, Extraction & Deduplication Engine
 * 
 * Extracts publications from local OpenAlex/Crossref/ORCID indexes.
 * Deduplicates against institutional portal repository.
 * ZERO runtime external API dependencies.
 */

import { INDEXED_NEC_WORKS, INDEXED_CROSSREF_METADATA } from './localIndex/datasetStore.js';
import { getPublications } from '../../data/portalStore.js';

/**
 * Normalizes DOI string
 * @param {string} rawDoi 
 * @returns {string}
 */
export function normalizeDOI(rawDoi) {
  if (!rawDoi) return '';
  return rawDoi
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '');
}

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
 * Executes a full local scholarly discovery job for a confirmed researcher
 * @param {object} confirmedAuthor { openAlexAuthorId, canonicalName, orcid }
 * @param {function} onProgress (statusObj) => void
 * @returns {Promise<{success: boolean, summary: object, candidates: Array, error?: string}>}
 */
export async function runLocalResearchDiscovery(confirmedAuthor, onProgress = null) {
  const emit = (stage, message, percent) => {
    if (onProgress) onProgress({ stage, message, percent });
  };

  if (!confirmedAuthor || !confirmedAuthor.openAlexAuthorId) {
    return {
      success: false,
      error: 'Please select and confirm a researcher profile before discovering publications.'
    };
  }

  try {
    // ──────── STAGE 1: LOCAL AUTHORSHIP RETRIEVAL ────────
    emit('EXTRACTING', `Scanning local OpenAlex index for author: ${confirmedAuthor.canonicalName}...`, 20);
    await new Promise(r => setTimeout(r, 200));

    const matchedWorks = INDEXED_NEC_WORKS.filter(
      w => w.openAlexAuthorId === confirmedAuthor.openAlexAuthorId
    );

    emit('EXTRACTING', `✓ Retrieved ${matchedWorks.length} indexed publications from local snapshot`, 40);
    await new Promise(r => setTimeout(r, 200));

    // ──────── STAGE 2: LOCAL CROSSREF DOI ENRICHMENT ────────
    emit('CROSSREF', 'Cross-referencing verified DOIs with local Crossref metadata...', 60);
    await new Promise(r => setTimeout(r, 200));

    const enrichedWorks = matchedWorks.map(w => {
      const canonicalDoi = normalizeDOI(w.doi);
      const crossrefMeta = canonicalDoi ? INDEXED_CROSSREF_METADATA[canonicalDoi] : null;

      const sources = Array.from(new Set([...(w.sources || ['OPENALEX']), ...(crossrefMeta ? ['CROSSREF'] : [])]));

      return {
        ...w,
        doi: canonicalDoi || w.doi || '',
        journalName: crossrefMeta?.containerTitle || w.journalName || '',
        publisher: crossrefMeta?.publisher || w.publisher || '',
        issn: crossrefMeta?.issn || '',
        sources: sources,
        crossrefEnriched: !!crossrefMeta
      };
    });

    emit('CROSSREF', `✓ Enriched DOI bibliographic data from local Crossref snapshot`, 75);
    await new Promise(r => setTimeout(r, 180));

    // ──────── STAGE 3: DEDUPLICATION AGAINST PORTAL STORE ────────
    emit('DEDUPLICATION', 'Checking existing institutional records and identifying duplicates...', 85);
    await new Promise(r => setTimeout(r, 180));

    const existingPubs = getPublications(true);
    const candidateList = [];

    enrichedWorks.forEach((work, idx) => {
      const canonicalDoi = normalizeDOI(work.doi);
      const normTitle = normalizeTitle(work.title);

      // Check duplicates in order of priority:
      // 1. Exact normalized DOI match
      const exactDoiMatch = canonicalDoi ? existingPubs.find(p => normalizeDOI(p.doi) === canonicalDoi) : null;
      // 2. OpenAlex Work ID match
      const exactOpenAlexMatch = work.openAlexShortId ? existingPubs.find(p => p.openAlexWorkId === work.openAlexShortId || p.openAlexWorkId === work.openAlexWorkId) : null;
      // 3. Title + Year match
      const titleYearMatch = existingPubs.find(p => normalizeTitle(p.title) === normTitle && p.publicationYear === work.publicationYear);

      let classification = 'NEW';
      let matchReason = 'Unique research record discovered in local index';
      let existingRecordId = null;
      let selected = true;

      if (exactDoiMatch) {
        classification = 'EXACT_DUPLICATE';
        matchReason = `Exact DOI match with existing record ${exactDoiMatch.publicationRecordNumber || exactDoiMatch.id}`;
        existingRecordId = exactDoiMatch.id;
        selected = false;
      } else if (exactOpenAlexMatch) {
        classification = 'EXACT_DUPLICATE';
        matchReason = `OpenAlex Work ID match with existing record ${exactOpenAlexMatch.publicationRecordNumber || exactOpenAlexMatch.id}`;
        existingRecordId = exactOpenAlexMatch.id;
        selected = false;
      } else if (titleYearMatch) {
        classification = 'LIKELY_DUPLICATE';
        matchReason = `Title and Year match with existing record ${titleYearMatch.publicationRecordNumber || titleYearMatch.id}`;
        existingRecordId = titleYearMatch.id;
        selected = false;
      }

      candidateList.push({
        candidateId: `CAND-LOCAL-${idx + 1}-${Date.now().toString(36)}`,
        title: work.title,
        publicationType: work.publicationType || 'Journal Article',
        journalName: work.journalName || '',
        publisher: work.publisher || '',
        publicationDate: work.publicationDate || `${work.publicationYear || new Date().getFullYear()}-01-01`,
        publicationYear: work.publicationYear || new Date().getFullYear(),
        volume: work.volume || '',
        issue: work.issue || '',
        pages: work.pages || '',
        articleNumber: work.articleNumber || '',
        issn: work.issn || '',
        doi: canonicalDoi,
        openAlexWorkId: work.openAlexShortId || work.openAlexWorkId || '',
        openAccess: work.openAccess || false,
        openAlexCitations: work.citedByCount || 0,
        sources: work.sources || ['OPENALEX'],
        authors: work.authors || [],
        topics: work.topics || [],
        classification: classification,
        matchReason: matchReason,
        existingRecordId: existingRecordId,
        selected: selected
      });
    });

    const summary = {
      totalDiscovered: candidateList.length,
      uniqueWorks: candidateList.length,
      newRecords: candidateList.filter(c => c.classification === 'NEW').length,
      duplicates: candidateList.filter(c => c.classification === 'EXACT_DUPLICATE' || c.classification === 'LIKELY_DUPLICATE').length,
      crossSourceEnriched: candidateList.filter(c => c.sources && c.sources.length >= 2).length,
      updates: candidateList.filter(c => c.classification === 'UPDATE_AVAILABLE').length
    };

    emit('COMPLETE', `Discovery complete: ${summary.newRecords} new publications ready for institutional review.`, 100);

    return {
      success: true,
      summary: summary,
      candidates: candidateList
    };
  } catch (err) {
    emit('ERROR', `Discovery error: ${err.message}`, 100);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred during local research discovery.'
    };
  }
}

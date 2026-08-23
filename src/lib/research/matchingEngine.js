/**
 * Deterministic Researcher Matching Engine
 * 
 * Compares selected NEC faculty against the local OpenAlex/ORCID author index.
 * ZERO LLM / AI hallucination. 100% deterministic, auditable multi-tier scoring.
 */

import { INDEXED_NEC_AUTHORS, INSTITUTION_MAPPINGS } from './localIndex/datasetStore.js';

/**
 * Normalizes researcher names for deterministic matching
 * Strips prefixes (Dr., Prof., Mr., Mrs.), dots, extra spaces, lowercases.
 * @param {string} name 
 * @returns {string}
 */
export function normalizeResearcherName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\b(dr|prof|professor|mr|mrs|ms|assoc|asst)\b\.?/gi, '')
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes ORCID string
 * @param {string} orcid 
 * @returns {string}
 */
export function normalizeOrcid(orcid) {
  if (!orcid) return '';
  return orcid.trim().replace(/^https?:\/\/orcid\.org\//i, '').toUpperCase();
}

/**
 * Matches a selected faculty member against the local indexed researcher repository
 * @param {object} faculty { id, name, department, orcid, designation }
 * @returns {{candidates: Array, matchStatus: string, exactMatch: object|null}}
 */
export function matchResearcherProfiles(faculty) {
  if (!faculty) {
    return { candidates: [], matchStatus: 'NO_FACULTY', exactMatch: null };
  }

  const facultyNormName = normalizeResearcherName(faculty.name);
  const facultyOrcid = normalizeOrcid(faculty.orcid);
  const facultyDept = (faculty.department || '').toUpperCase().trim();

  const scoredCandidates = [];

  INDEXED_NEC_AUTHORS.forEach(author => {
    let score = 0;
    const evidence = [];
    const authorNormName = normalizeResearcherName(author.canonicalName);
    const authorOrcid = normalizeOrcid(author.orcid);
    const authorDept = (author.department || '').toUpperCase().trim();

    // 1. TIER 1: Exact High-Confidence Identifier Matches
    if (facultyOrcid && authorOrcid && facultyOrcid === authorOrcid) {
      score += 100;
      evidence.push(`Exact ORCID match (${authorOrcid})`);
    }

    // 2. TIER 2: Name Evidence
    const isExactName = facultyNormName === authorNormName;
    const isVariantMatch = (author.nameVariants || []).some(v => normalizeResearcherName(v) === facultyNormName);

    if (isExactName) {
      score += 50;
      evidence.push(`Exact full name match: "${author.canonicalName}"`);
    } else if (isVariantMatch) {
      score += 40;
      evidence.push(`Published name variant match: "${author.canonicalName}"`);
    } else if (facultyNormName.includes(authorNormName) || authorNormName.includes(facultyNormName)) {
      score += 20;
      evidence.push(`Partial token match: "${author.canonicalName}"`);
    }

    // 3. TIER 3: Institutional & Departmental Affiliation Evidence
    const hasNecAffiliation = author.primaryAffiliation.toLowerCase().includes('narasaraopeta') ||
                              author.primaryAffiliation.toLowerCase().includes('nec');
    if (hasNecAffiliation) {
      score += 30;
      evidence.push(`Verified institutional affiliation: ${author.primaryAffiliation}`);
    }

    if (facultyDept && authorDept && facultyDept === authorDept) {
      score += 20;
      evidence.push(`Department match: ${facultyDept}`);
    }

    // Only consider candidates with meaningful correlation (score >= 40)
    if (score >= 40) {
      let classification = 'POSSIBLE_MATCH';
      if (score >= 100) classification = 'EXACT_MATCH';
      else if (score >= 70) classification = 'HIGH_CONFIDENCE';
      else if (score >= 50) classification = 'AMBIGUOUS';

      scoredCandidates.push({
        ...author,
        matchScore: score,
        classification: classification,
        evidence: evidence
      });
    }
  });

  // Sort descending by match score
  scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

  const exactMatch = scoredCandidates.find(c => c.classification === 'EXACT_MATCH') || 
                     (scoredCandidates.length === 1 && scoredCandidates[0].matchScore >= 80 ? scoredCandidates[0] : null);

  let overallStatus = 'NO_MATCH';
  if (exactMatch) overallStatus = 'EXACT_MATCH';
  else if (scoredCandidates.length > 1) overallStatus = 'MULTIPLE_CANDIDATES';
  else if (scoredCandidates.length === 1) overallStatus = 'CANDIDATE_FOUND';

  return {
    candidates: scoredCandidates,
    matchStatus: overallStatus,
    exactMatch: exactMatch
  };
}

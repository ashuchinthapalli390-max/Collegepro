/**
 * Authorized Export File Parsers for Scopus and Web of Science
 * 
 * Ingests officially exported CSV/Excel/TSV files from Elsevier Scopus and Clarivate WoS.
 * ZERO scraping. Maintains strict institutional provenance as SCOPUS_IMPORT / WOS_IMPORT.
 * ZERO fabrication of authors or browser-context defaults.
 */

import { normalizeDOI } from './localDiscoveryEngine.js';

/**
 * Splits an author string from Scopus or WoS exports into distinct individual author names
 * @param {string} authorsStr 
 * @returns {Array<string>}
 */
export function splitAuthors(authorsStr) {
  if (!authorsStr || typeof authorsStr !== 'string') return [];
  const trimmed = authorsStr.trim();
  if (!trimmed) return [];

  // Scopus/WoS uses semicolons or newlines to delimit distinct authors
  if (trimmed.includes(';')) {
    return trimmed.split(';').map(a => a.trim()).filter(Boolean);
  }
  if (trimmed.includes('\n')) {
    return trimmed.split('\n').map(a => a.trim()).filter(Boolean);
  }

  // If comma-separated multiple authors (e.g. "Venkateswarlu, S., Krishna, K.R.")
  if (trimmed.includes(',')) {
    const parts = trimmed.split(/(?<=[A-Z]\.|\b[A-Z]\b),\s*/);
    if (parts.length > 1) {
      return parts.map(a => a.trim()).filter(Boolean);
    }
  }

  return [trimmed];
}

/**
 * Parses Scopus CSV export content into normalized research publication records
 * @param {string} csvText 
 * @returns {Array<object>}
 */
export function parseScopusExportCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const rawHeaders = lines[0].split(',').map(h => h.replace(/["']/g, '').trim().toLowerCase());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    // RFC 4180 CSV line regex parser
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const values = [];
    let match;
    while ((match = regex.exec(lines[i])) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++;
      let val = match[1] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      values.push(val.trim());
      if (regex.lastIndex >= lines[i].length) break;
    }

    const row = {};
    rawHeaders.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });

    const title = row['title'] || row['document title'] || row['article title'] || '';
    if (!title) continue;

    const rawAuthorsStr = row['authors'] || row['author(s)'] || row['author names'] || '';
    const authorNames = splitAuthors(rawAuthorsStr);
    const affiliationsStr = row['affiliations'] || row['authors with affiliations'] || '';
    const authorIdsStr = row['author(s) id'] || row['author ids'] || '';
    const authorIdsList = authorIdsStr ? authorIdsStr.split(';').map(id => id.trim()).filter(Boolean) : [];

    const structuredAuthors = authorNames.map((authorName, aIdx) => ({
      authorOrder: aIdx + 1,
      name: authorName,
      affiliation: affiliationsStr.includes(authorName) ? affiliationsStr : (aIdx === 0 ? affiliationsStr : ''),
      isFirstAuthor: aIdx === 0,
      isCorresponding: false,
      scopusAuthorId: authorIdsList[aIdx] || null,
      matchStatus: 'UNRESOLVED',
      facultyId: null,
      departmentCode: null
    }));

    const doi = normalizeDOI(row['doi'] || '');
    const eid = (row['eid'] || '').trim();
    const citations = parseInt(row['cited by'] || row['citation count'] || '0', 10) || 0;
    const rawYear = row['year'] || '';
    const publicationYear = parseInt(rawYear, 10) || null;

    const pageStart = row['page start'] || '';
    const pageEnd = row['page end'] || '';
    const pages = (pageStart && pageEnd) ? `${pageStart}-${pageEnd}` : (row['art. no.'] || row['page count'] || '');

    records.push({
      id: `SCOPUS-EXP-${Date.now()}-${i}`,
      title: title,
      doi: doi,
      scopusEid: eid,
      scopusCitations: citations > 0 ? { count: citations, capturedAt: new Date().toISOString() } : null,
      journalName: row['source title'] || row['journal'] || '',
      publisher: row['publisher'] || '',
      volume: row['volume'] || '',
      issue: row['issue'] || '',
      pages: pages,
      articleNumber: row['art. no.'] || '',
      publicationYear: publicationYear,
      publicationType: row['document type'] || 'Journal Article',
      authors: structuredAuthors,
      issn: row['issn'] || '',
      isbn: row['isbn'] || '',
      url: row['link'] || (doi ? `https://doi.org/${doi}` : ''),
      indexing: ['Scopus'],
      isScopusIndexed: true,
      source: 'SCOPUS_IMPORT',
      sources: ['SCOPUS_IMPORT'],
      workflowStatus: 'IMPORTED_PENDING_REVIEW',
      matchStatus: 'POSSIBLE_NEC_MATCH',
      department: null
    });
  }

  return records;
}

/**
 * Parses Web of Science Tab-Delimited, CSV, or Plain Text (Field Tagged) export content
 * @param {string} text 
 * @returns {Array<object>}
 */
export function parseWosExport(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  // Check if this is Plain Text Field Tagged format (e.g. lines starting with PT, AU, TI, etc.)
  const isTaggedFormat = lines.some(l => /^[A-Z0-9]{2}\s/.test(l));

  if (isTaggedFormat) {
    const records = [];
    let currentRecord = {};
    let currentTag = null;

    for (const line of lines) {
      if (line.startsWith('ER')) {
        // End of record
        if (currentRecord['TI'] || currentRecord['TITLE']) {
          records.push(currentRecord);
        }
        currentRecord = {};
        currentTag = null;
        continue;
      }

      const match = line.match(/^([A-Z0-9]{2})\s+(.*)$/);
      if (match) {
        currentTag = match[1];
        const val = match[2].trim();
        if (currentRecord[currentTag]) {
          currentRecord[currentTag] += '; ' + val;
        } else {
          currentRecord[currentTag] = val;
        }
      } else if (currentTag && line.startsWith('   ')) {
        // Continuation line
        currentRecord[currentTag] += ' ' + line.trim();
      }
    }

    if (currentRecord['TI'] || currentRecord['TITLE']) {
      records.push(currentRecord);
    }

    return records.map((row, i) => {
      const title = row['TI'] || row['TITLE'] || '';
      const rawAuthorsStr = row['AF'] || row['AU'] || '';
      const authorNames = splitAuthors(rawAuthorsStr);
      const affiliationsStr = row['C1'] || '';

      const structuredAuthors = authorNames.map((authorName, aIdx) => ({
        authorOrder: aIdx + 1,
        name: authorName,
        affiliation: affiliationsStr,
        isFirstAuthor: aIdx === 0,
        isCorresponding: false,
        matchStatus: 'UNRESOLVED',
        facultyId: null,
        departmentCode: null
      }));

      const doi = normalizeDOI(row['DI'] || row['DOI'] || '');
      const uid = (row['UT'] || '').trim();
      const citations = parseInt(row['TC'] || '0', 10) || 0;
      const rawYear = row['PY'] || '';
      const publicationYear = parseInt(rawYear, 10) || null;

      return {
        id: `WOS-EXP-${Date.now()}-${i}`,
        title: title,
        doi: doi,
        wosUid: uid,
        wosCitations: citations > 0 ? { count: citations, capturedAt: new Date().toISOString() } : null,
        journalName: row['SO'] || '',
        publisher: row['PU'] || '',
        volume: row['VL'] || '',
        issue: row['IS'] || '',
        pages: (row['BP'] && row['EP']) ? `${row['BP']}-${row['EP']}` : (row['AR'] || ''),
        articleNumber: row['AR'] || '',
        publicationYear: publicationYear,
        publicationType: row['DT'] || 'Journal Article',
        authors: structuredAuthors,
        issn: row['SN'] || '',
        isbn: row['BN'] || '',
        url: doi ? `https://doi.org/${doi}` : '',
        indexing: ['Web of Science'],
        isWosIndexed: true,
        source: 'WOS_IMPORT',
        sources: ['WOS_IMPORT'],
        workflowStatus: 'IMPORTED_PENDING_REVIEW',
        matchStatus: 'POSSIBLE_NEC_MATCH',
        department: null
      };
    });
  }

  // Tab-delimited or CSV table format
  if (lines.length < 2) return [];
  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(delimiter).map(h => h.replace(/["']/g, '').trim().toUpperCase());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.replace(/^["']|["']$/g, '').trim());
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });

    const title = row['TI'] || row['TITLE'] || row['DOCUMENT TITLE'] || '';
    if (!title) continue;

    const rawAuthorsStr = row['AF'] || row['AU'] || row['AUTHORS'] || '';
    const authorNames = splitAuthors(rawAuthorsStr);
    const affiliationsStr = row['C1'] || row['ADDRESSES'] || '';

    const structuredAuthors = authorNames.map((authorName, aIdx) => ({
      authorOrder: aIdx + 1,
      name: authorName,
      affiliation: affiliationsStr,
      isFirstAuthor: aIdx === 0,
      isCorresponding: false,
      matchStatus: 'UNRESOLVED',
      facultyId: null,
      departmentCode: null
    }));

    const doi = normalizeDOI(row['DI'] || row['DOI'] || '');
    const uid = (row['UT'] || row['ACCESSION NUMBER'] || '').trim();
    const citations = parseInt(row['TC'] || row['TIMES CITED'] || row['CITATION COUNT'] || '0', 10) || 0;
    const rawYear = row['PY'] || row['YEAR'] || '';
    const publicationYear = parseInt(rawYear, 10) || null;

    const pageStart = row['BP'] || '';
    const pageEnd = row['EP'] || '';
    const pages = (pageStart && pageEnd) ? `${pageStart}-${pageEnd}` : (row['AR'] || row['PAGE COUNT'] || '');

    records.push({
      id: `WOS-EXP-${Date.now()}-${i}`,
      title: title,
      doi: doi,
      wosUid: uid,
      wosCitations: citations > 0 ? { count: citations, capturedAt: new Date().toISOString() } : null,
      journalName: row['SO'] || row['SOURCE TITLE'] || '',
      publisher: row['PU'] || row['PUBLISHER'] || '',
      volume: row['VL'] || row['VOLUME'] || '',
      issue: row['IS'] || row['ISSUE'] || '',
      pages: pages,
      articleNumber: row['AR'] || '',
      publicationYear: publicationYear,
      publicationType: row['DT'] || 'Journal Article',
      authors: structuredAuthors,
      issn: row['SN'] || row['ISSN'] || '',
      isbn: row['BN'] || row['ISBN'] || '',
      url: doi ? `https://doi.org/${doi}` : '',
      indexing: ['Web of Science'],
      isWosIndexed: true,
      source: 'WOS_IMPORT',
      sources: ['WOS_IMPORT'],
      workflowStatus: 'IMPORTED_PENDING_REVIEW',
      matchStatus: 'POSSIBLE_NEC_MATCH',
      department: null
    });
  }

  return records;
}

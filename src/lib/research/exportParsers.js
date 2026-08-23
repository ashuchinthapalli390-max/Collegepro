/**
 * Authorized Export File Parsers for Scopus and Web of Science
 * 
 * Ingests officially exported CSV/Excel files from Elsevier Scopus and Clarivate WoS.
 * ZERO scraping. Maintains strict institutional provenance as SCOPUS_IMPORT / WOS_IMPORT.
 */

import { normalizeDOI } from './localDiscoveryEngine.js';

/**
 * Parses Scopus CSV export content into normalized research publication records
 * @param {string} csvText 
 * @returns {Array<object>}
 */
export function parseScopusExportCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.replace(/["']/g, '').trim().toLowerCase());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    // Simple robust CSV row splitter taking quotes into account
    const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const row = {};
    headers.forEach((h, idx) => {
      let val = (values[idx] || '').trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      row[h] = val;
    });

    const title = row['title'] || row['document title'] || '';
    if (!title) continue;

    const doi = normalizeDOI(row['doi'] || '');
    const eid = row['eid'] || '';
    const citations = parseInt(row['cited by'] || row['citation count'] || '0', 10) || 0;
    const year = parseInt(row['year'] || '', 10) || new Date().getFullYear();

    records.push({
      id: `SCOPUS-EXP-${Date.now()}-${i}`,
      title: title,
      doi: doi,
      scopusEid: eid,
      scopusCitations: citations,
      journalName: row['source title'] || row['journal'] || '',
      publisher: row['publisher'] || '',
      volume: row['volume'] || '',
      issue: row['issue'] || '',
      pages: row['page count'] || row['art. no.'] || '',
      publicationYear: year,
      publicationType: row['document type'] || 'Journal Article',
      source: 'SCOPUS_IMPORT',
      sources: ['SCOPUS_IMPORT']
    });
  }

  return records;
}

/**
 * Parses Web of Science Tab-Delimited or CSV export content
 * @param {string} text 
 * @returns {Array<object>}
 */
export function parseWosExport(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
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

    const title = row['TI'] || row['TITLE'] || '';
    if (!title) continue;

    const doi = normalizeDOI(row['DI'] || row['DOI'] || '');
    const uid = row['UT'] || row['ACCESSION NUMBER'] || '';
    const citations = parseInt(row['TC'] || row['TIMES CITED'] || '0', 10) || 0;
    const year = parseInt(row['PY'] || row['YEAR'] || '', 10) || new Date().getFullYear();

    records.push({
      id: `WOS-EXP-${Date.now()}-${i}`,
      title: title,
      doi: doi,
      wosUid: uid,
      wosCitations: citations,
      journalName: row['SO'] || row['SOURCE TITLE'] || '',
      publisher: row['PU'] || row['PUBLISHER'] || '',
      volume: row['VL'] || row['VOLUME'] || '',
      issue: row['IS'] || row['ISSUE'] || '',
      pages: row['BP'] || row['PAGE COUNT'] || '',
      publicationYear: year,
      publicationType: row['DT'] || 'Journal Article',
      source: 'WOS_IMPORT',
      sources: ['WOS_IMPORT']
    });
  }

  return records;
}

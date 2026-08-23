/**
 * DOI Normalization and Live Crossref Metadata Lookup Service
 */

/**
 * Normalizes any DOI input (URL, DOI string, prefix) to canonical format: 10.xxxx/xxxx
 * @param {string} rawDoi 
 * @returns {string} canonical DOI or trimmed string
 */
export function normalizeDOI(rawDoi) {
  if (!rawDoi) return '';
  let cleaned = rawDoi.trim();
  
  // Remove URL schemes
  cleaned = cleaned.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
  // Remove doi: prefix
  cleaned = cleaned.replace(/^doi:\s*/i, '');
  
  // Ensure valid DOI regex (starts with 10.)
  const match = cleaned.match(/\b(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)\b/);
  return match ? match[1].toLowerCase() : cleaned.toLowerCase();
}

/**
 * Validates whether a string is a valid DOI syntax
 * @param {string} doi 
 * @returns {boolean}
 */
export function isValidDOI(doi) {
  const canonical = normalizeDOI(doi);
  return /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/i.test(canonical);
}

/**
 * Fetches publication metadata directly from official Crossref REST API
 * @param {string} doi 
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function fetchCrossrefMetadata(doi) {
  const canonical = normalizeDOI(doi);
  if (!isValidDOI(canonical)) {
    return { success: false, error: 'Invalid DOI syntax. DOI must begin with 10.xxxx/...' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(canonical)}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NEC-Academic-Portal/2.0 (mailto:research@nec.edu.in)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'DOI not found in Crossref registry.' };
      }
      return { success: false, error: `Crossref API returned HTTP ${response.status}` };
    }

    const json = await response.json();
    const message = json.message;

    if (!message) {
      return { success: false, error: 'No metadata payload returned from Crossref.' };
    }

    // Extract title
    const title = Array.isArray(message.title) ? message.title[0] : (message.title || '');
    
    // Extract container / journal name
    const journalName = Array.isArray(message['container-title']) 
      ? message['container-title'][0] 
      : (message['container-title'] || '');

    // Extract publication year and date
    let pubDate = '';
    let pubYear = new Date().getFullYear();
    if (message.published?.['date-parts']?.[0]) {
      const parts = message.published['date-parts'][0];
      pubYear = parts[0] || pubYear;
      const month = String(parts[1] || 1).padStart(2, '0');
      const day = String(parts[2] || 1).padStart(2, '0');
      pubDate = `${parts[0]}-${month}-${day}`;
    } else if (message['published-print']?.['date-parts']?.[0]) {
      const parts = message['published-print']['date-parts'][0];
      pubYear = parts[0] || pubYear;
      pubDate = `${parts[0]}-${String(parts[1] || 1).padStart(2, '0')}-01`;
    }

    // Extract authors
    const authors = Array.isArray(message.author) ? message.author.map((a, idx) => {
      const given = a.given || '';
      const family = a.family || '';
      const fullName = (given + ' ' + family).trim() || a.name || 'Author ' + (idx + 1);
      const affiliation = Array.isArray(a.affiliation) && a.affiliation[0]?.name ? a.affiliation[0].name : '';
      return {
        authorOrder: idx + 1,
        name: fullName,
        affiliation: affiliation,
        orcid: a.ORCID ? a.ORCID.replace(/https?:\/\/orcid\.org\//i, '') : '',
        isFirstAuthor: idx === 0,
        isCorresponding: a.sequence === 'first' || false
      };
    }) : [];

    // Extract ISSN / ISBN
    const issn = Array.isArray(message.ISSN) ? message.ISSN[0] : (message.ISSN || '');
    const isbn = Array.isArray(message.ISBN) ? message.ISBN[0] : (message.ISBN || '');

    // Normalized Metadata
    const normalized = {
      doi: canonical,
      title: title,
      journalName: journalName,
      publisher: message.publisher || '',
      publicationType: message.type === 'journal-article' ? 'Journal Article' : (message.type === 'proceedings-article' ? 'Conference Paper' : 'Book Chapter'),
      publicationDate: pubDate || `${pubYear}-01-01`,
      publicationYear: pubYear,
      volume: message.volume || '',
      issue: message.issue || '',
      pages: message.page || '',
      articleNumber: message['article-number'] || '',
      issn: issn,
      isbn: isbn,
      url: message.URL || `https://doi.org/${canonical}`,
      authors: authors,
      abstract: message.abstract ? message.abstract.replace(/<[^>]*>?/gm, '') : '',
      source: 'CROSSREF'
    };

    return { success: true, data: normalized };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { success: false, error: 'Crossref lookup timed out (network latency).' };
    }
    return { success: false, error: err.message || 'Failed to fetch DOI metadata from Crossref' };
  }
}

/**
 * Elsevier Scopus Author and Document Integration Service
 * Uses official Elsevier API (when configured) with zero mock fallbacks.
 */

/**
 * Validates Scopus Author ID format (10 to 11 digits)
 * @param {string} authorId 
 * @returns {boolean}
 */
export function isValidScopusAuthorId(authorId) {
  if (!authorId) return false;
  return /^\d{10,11}$/.test(authorId.trim());
}

/**
 * Normalizes Scopus Author ID
 * @param {string} rawId 
 * @returns {string}
 */
export function normalizeScopusAuthorId(rawId) {
  if (!rawId) return '';
  return rawId.trim();
}

/**
 * Fetches Scopus author profile and documents from official Elsevier APIs
 * @param {string} rawAuthorId 
 * @param {string} apiKey (optional server key)
 * @returns {Promise<{success: boolean, status: string, profile?: object, documents?: Array, error?: string}>}
 */
export async function fetchScopusData(rawAuthorId, apiKey = null) {
  const authorId = normalizeScopusAuthorId(rawAuthorId);
  if (!isValidScopusAuthorId(authorId)) {
    return { 
      success: false, 
      status: 'INVALID_ID',
      error: 'Invalid Scopus Author ID. Must be a 10-11 digit numeric identifier.' 
    };
  }

  // Check for server-configured or environment Scopus API key
  const activeApiKey = apiKey || (typeof process !== 'undefined' ? process.env?.SCOPUS_API_KEY : null);

  if (!activeApiKey) {
    // Honest status reporting: API key not configured
    return {
      success: false,
      status: 'NOT_CONFIGURED',
      error: 'Elsevier Scopus API key is not configured in institutional server environment.'
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(`https://api.elsevier.com/content/author/author_id/${authorId}?view=ENHANCED`, {
      headers: {
        'Accept': 'application/json',
        'X-ELS-APIKey': activeApiKey
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          status: 'LIMITED_ACCESS',
          error: `Scopus API access restricted (HTTP ${response.status}). Check institutional entitlement.`
        };
      }
      if (response.status === 429) {
        return {
          success: false,
          status: 'RATE_LIMITED',
          error: 'Scopus API rate limit reached. Please try again later.'
        };
      }
      if (response.status === 404) {
        return {
          success: false,
          status: 'NOT_FOUND',
          error: `Scopus author profile ${authorId} not found.`
        };
      }
      return {
        success: false,
        status: 'ERROR',
        error: `Scopus API returned HTTP ${response.status}`
      };
    }

    const json = await response.json();
    const authorProfile = json['author-retrieval-response']?.[0];
    if (!authorProfile) {
      return {
        success: false,
        status: 'NOT_FOUND',
        error: 'No author retrieval response returned by Scopus.'
      };
    }

    const docCount = parseInt(authorProfile?.['coredata']?.['document-count'] || '0', 10);
    const citedBy = parseInt(authorProfile?.['coredata']?.['cited-by-count'] || '0', 10);
    const hIndex = parseInt(authorProfile?.['h-index'] || '0', 10);
    const preferredName = authorProfile?.['author-profile']?.['preferred-name'];
    const fullName = `${preferredName?.['given-name'] || ''} ${preferredName?.['surname'] || ''}`.trim() || 'Scopus Author';
    
    // Now fetch real author documents using Scopus Search API if documents exist
    let documents = [];
    if (docCount > 0) {
      try {
        const searchResp = await fetch(`https://api.elsevier.com/content/search/scopus?query=AU-ID(${authorId})&count=25`, {
          headers: {
            'Accept': 'application/json',
            'X-ELS-APIKey': activeApiKey
          }
        });
        if (searchResp.ok) {
          const searchJson = await searchResp.json();
          const entries = searchJson['search-results']?.['entry'] || [];
          documents = entries.map((e, idx) => ({
            id: `SCOPUS-${authorId}-${idx + 1}`,
            scopusEid: e['eid'] || '',
            title: e['dc:title'] || 'Untitled Scopus Document',
            publicationType: e['subtypeDescription'] || 'Journal Article',
            journalName: e['prism:publicationName'] || '',
            publicationYear: parseInt((e['prism:coverDate'] || '').substring(0, 4), 10) || new Date().getFullYear(),
            publicationDate: e['prism:coverDate'] || '',
            doi: e['prism:doi'] || '',
            volume: e['prism:volume'] || '',
            issue: e['prism:issueIdentifier'] || '',
            pages: e['prism:pageRange'] || '',
            scopusIndexed: 'Yes',
            scopusCitations: parseInt(e['citedby-count'] || '0', 10),
            source: 'SCOPUS',
            url: e['prism:doi'] ? `https://doi.org/${e['prism:doi']}` : (e['eid'] ? `https://www.scopus.com/record/display.uri?eid=${e['eid']}&origin=resultslist` : '')
          }));
        }
      } catch (err) {
        console.warn('Scopus document search warning:', err);
      }
    }

    return {
      success: true,
      status: 'VERIFIED',
      profile: {
        scopusAuthorId: authorId,
        fullName: fullName,
        documentCount: docCount,
        citationCount: citedBy,
        hIndex: hIndex,
        subjectAreas: []
      },
      documents: documents
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { success: false, status: 'TIMEOUT', error: 'Scopus API request timed out.' };
    }
    return { success: false, status: 'ERROR', error: err.message || 'Failed to fetch Scopus data' };
  }
}

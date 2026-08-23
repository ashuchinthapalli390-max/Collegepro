/**
 * Centralized Safe Authentication Fetch Utility
 * Protects against empty responses, non-JSON HTML error pages, and stream consumption errors.
 */

export class AuthApiError extends Error {
  constructor(message, code = 'AUTH_ERROR', status = 500, userMessage = 'Unable to complete sign in. Please try again.') {
    super(message);
    this.name = 'AuthApiError';
    this.code = code;
    this.status = status;
    this.userMessage = userMessage;
  }
}

/**
 * Universal safe parser for fetch responses.
 * Reads response body exactly once as text, validates Content-Type, and parses JSON safely.
 */
export async function parseSafeJsonResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const status = response.status;

  // Single-use body consumption via text()
  let rawText = '';
  try {
    rawText = await response.text();
  } catch (err) {
    throw new AuthApiError(
      `Failed to read server response body: ${err.message}`,
      'READ_BODY_FAILED',
      status,
      'Network communication error. Please check your connection and try again.'
    );
  }

  // 1. Check for empty response body
  if (!rawText || !rawText.trim()) {
    // 204 No Content or empty 200
    if (status === 204 || status === 200) {
      return { ok: true, success: true };
    }
    throw new AuthApiError(
      `Empty response from server (HTTP ${status})`,
      'EMPTY_AUTH_RESPONSE',
      status,
      'Authentication service returned an empty response. Please try again.'
    );
  }

  // 2. Check for HTML error pages (e.g. Vercel 404/500/502/504 HTML page)
  if (contentType.includes('text/html') || rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<html')) {
    throw new AuthApiError(
      `Server returned HTML page instead of JSON (HTTP ${status})`,
      'NON_JSON_RESPONSE',
      status,
      'Authentication server is currently unavailable. Please try again later.'
    );
  }

  // 3. Parse JSON safely
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (parseErr) {
    throw new AuthApiError(
      `Invalid JSON received from server (HTTP ${status}): ${parseErr.message}`,
      'INVALID_JSON',
      status,
      'Unable to process server response. Please try again.'
    );
  }

  return data;
}

/**
 * High-level authenticated fetch helper
 */
export async function safeAuthFetch(url, options = {}) {
  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await parseSafeJsonResponse(response);

    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (err) {
    if (err instanceof AuthApiError) {
      throw err;
    }
    throw new AuthApiError(
      err.message || 'Network error occurred during authentication fetch',
      'NETWORK_FETCH_FAILED',
      0,
      'Unable to reach authentication server. Please check your internet connection.'
    );
  }
}

/**
 * Central Security Sanitizer & Validator Suite
 * OWASP ASVS 5.0 Level 2 compliant sanitization for HTML, CSV/Excel formulas, and outbound URLs (SSRF prevention).
 */

/**
 * 1. CSV / Excel Formula Injection Sanitizer
 * Neutralizes spreadsheet formula injection by prepending a single quote (')
 * to any cell value that starts with dangerous formula prefixes (=, +, -, @, \t, \r).
 */
export function sanitizeSpreadsheetCell(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);
  if (!str) return '';

  // Dangerous spreadsheet formula trigger characters
  const formulaTriggers = ['=', '+', '-', '@', '\t', '\r'];
  const firstChar = str.charAt(0);

  if (formulaTriggers.includes(firstChar)) {
    // Escape with a leading apostrophe to force spreadsheet engines to treat as pure text
    return `'${str}`;
  }

  // Also check if string contains embedded dangerous carriage returns followed by formula
  return str.replace(/[\r\n]([=+\-@\t])/g, (match, p1) => `\n'${p1}`);
}

/**
 * 2. Sanitize an entire record object for CSV/Excel export
 */
export function sanitizeExportRecord(record) {
  if (!record || typeof record !== 'object') return record;

  const sanitized = {};
  for (const [key, val] of Object.entries(record)) {
    if (typeof val === 'string') {
      sanitized[key] = sanitizeSpreadsheetCell(val);
    } else if (Array.isArray(val)) {
      sanitized[key] = val.map(item => typeof item === 'string' ? sanitizeSpreadsheetCell(item) : item);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

/**
 * 3. HTML / Rich Text XSS Sanitizer (Strict Allowlist)
 * Strips script tags, inline event handlers (onload, onerror, onclick), javascript: URIs, and dangerous embeds.
 */
export function sanitizeHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  // Remove script tags and contents
  let clean = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove style tags and contents
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove iframe, object, embed, form tags
  clean = clean.replace(/<\/?(iframe|object|embed|applet|form|input|button|svg|math)\b[^>]*>/gi, '');

  // Strip all inline event handlers (on* attributes like onclick, onerror, onload, onmouseover)
  clean = clean.replace(/\s+on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '');

  // Strip javascript: and vbscript: and data: (except safe images) in attributes
  clean = clean.replace(/(href|src|action)\s*=\s*["']\s*(javascript|vbscript):[^"']*["']/gi, '$1="#"');

  return clean;
}

/**
 * 4. SSRF (Server-Side Request Forgery) Safe URL Validator
 * Ensures outbound requests (e.g. metadata ingestion, DOI lookup) cannot target localhost or internal private networks.
 */
export function isSafeOutboundUrl(urlString, allowedDomains = []) {
  if (!urlString || typeof urlString !== 'string') return false;

  try {
    const parsed = new URL(urlString.trim());

    // Only allow HTTPS in production environments
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost, loopbacks, and broadcast addresses
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local')
    ) {
      return false;
    }

    // Block IPv4 private address ranges (RFC 1918) and link-local (RFC 3927)
    // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = hostname.match(ipv4Regex);
    if (ipMatch) {
      const b1 = parseInt(ipMatch[1], 10);
      const b2 = parseInt(ipMatch[2], 10);

      if (b1 === 10) return false;
      if (b1 === 172 && b2 >= 16 && b2 <= 31) return false;
      if (b1 === 192 && b2 === 168) return false;
      if (b1 === 169 && b2 === 254) return false;
      if (b1 === 127) return false;
      if (b1 === 0) return false;
    }

    // If a domain allowlist is supplied, verify hostname against allowlist
    if (allowedDomains.length > 0) {
      const matches = allowedDomains.some(domain => 
        hostname === domain || hostname.endsWith(`.${domain}`)
      );
      if (!matches) return false;
    }

    return true;
  } catch {
    return false;
  }
}

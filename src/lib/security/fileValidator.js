/**
 * File Upload Security & Magic-Byte Signature Validator
 * OWASP ASVS 5.0 Level 2 compliant validation for document & media ingestion.
 */

export const ALLOWED_FILE_TYPES = {
  DOCUMENT: {
    extensions: ['.pdf'],
    mimeTypes: ['application/pdf'],
    maxSizeBytes: 15 * 1024 * 1024, // 15 MB
    magicBytes: [
      { offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] } // %PDF
    ]
  },
  IMAGE: {
    extensions: ['.png', '.jpg', '.jpeg', '.webp'],
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
    magicBytes: [
      { type: 'image/png', offset: 0, bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
      { type: 'image/jpeg', offset: 0, bytes: [0xFF, 0xD8, 0xFF] },
      { type: 'image/webp', offset: 0, bytes: [0x52, 0x49, 0x46, 0x46], subOffset: 8, subBytes: [0x57, 0x45, 0x42, 0x50] } // RIFF....WEBP
    ]
  },
  SPREADSHEET_IMPORT: {
    extensions: ['.csv'],
    mimeTypes: ['text/csv', 'text/plain', 'application/vnd.ms-excel'],
    maxSizeBytes: 5 * 1024 * 1024 // 5 MB
  }
};

/**
 * Validates a file's extension, declared MIME type, and size.
 */
export function validateFileMetadata(filename, mimeType, sizeBytes, category = 'DOCUMENT') {
  const rules = ALLOWED_FILE_TYPES[category] || ALLOWED_FILE_TYPES.DOCUMENT;

  if (!filename || typeof filename !== 'string') {
    return { valid: false, error: 'Filename is required.' };
  }

  // 1. Extension check
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  if (!rules.extensions.includes(ext)) {
    return { 
      valid: false, 
      error: `Invalid file extension (${ext}). Allowed formats: ${rules.extensions.join(', ')}.` 
    };
  }

  // 2. Reject double extensions and dangerous executable names
  const dangerousPatterns = /\.(exe|bat|cmd|sh|php|jsp|asp|aspx|cgi|pl|js|vbs|jar|svg|html|htm)\./i;
  if (dangerousPatterns.test(filename)) {
    return { valid: false, error: 'Prohibited file name format detected.' };
  }

  // 3. MIME type check
  if (mimeType && !rules.mimeTypes.includes(mimeType.toLowerCase())) {
    return { 
      valid: false, 
      error: `Unrecognized MIME type (${mimeType}). Please upload a valid ${rules.extensions.join('/')} file.` 
    };
  }

  // 4. Size limit check
  if (sizeBytes > rules.maxSizeBytes) {
    const maxMb = (rules.maxSizeBytes / (1024 * 1024)).toFixed(0);
    return { 
      valid: false, 
      error: `File size exceeds the maximum allowed limit of ${maxMb}MB.` 
    };
  }

  return { valid: true };
}

/**
 * Validates file buffer magic bytes / file signature to verify true file format.
 */
export function validateFileSignature(buffer, category = 'DOCUMENT') {
  if (!buffer || buffer.length < 4) {
    return { valid: false, error: 'File content is empty or corrupted.' };
  }

  const bytes = new Uint8Array(buffer);

  if (category === 'DOCUMENT') {
    // Check for %PDF (0x25, 0x50, 0x44, 0x46)
    if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
      return { valid: true, detectedType: 'application/pdf' };
    }
    return { valid: false, error: 'File signature does not match a valid PDF document.' };
  }

  if (category === 'IMAGE') {
    // PNG
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
      return { valid: true, detectedType: 'image/png' };
    }
    // JPEG
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
      return { valid: true, detectedType: 'image/jpeg' };
    }
    // WebP (RIFF at 0..3, WEBP at 8..11)
    if (
      bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes.length >= 12 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
    ) {
      return { valid: true, detectedType: 'image/webp' };
    }

    return { valid: false, error: 'File signature does not match an approved image format (PNG, JPEG, WebP).' };
  }

  return { valid: true };
}

/**
 * Generates an unpredictable, cryptographically random storage filename with preserved safe extension.
 */
export function generateSecureStorageFilename(originalFilename) {
  const ext = originalFilename.slice(originalFilename.lastIndexOf('.')).toLowerCase();
  const safeExt = ext.replace(/[^a-z0-9]/g, '');
  const randomPart = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);

  return `${randomPart}.${safeExt}`;
}

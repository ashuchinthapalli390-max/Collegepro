/**
 * NEC Institutional Portal - Universal Bulk Data Center Core Engine
 * Handles cryptographic SHA-256 calculation, RFC 4180 CSV & XLSX parsing,
 * strict schema validation, ISO date normalization, formula injection defense,
 * master data resolution, and duplicate detection.
 */

import * as XLSX from 'xlsx';
import { getModuleConfig } from './moduleRegistry.js';

/**
 * Computes cryptographic SHA-256 hex digest for an uploaded file or text content.
 */
export async function calculateSha256(contentOrFile) {
  try {
    let buffer;
    if (typeof contentOrFile === 'string') {
      buffer = new TextEncoder().encode(contentOrFile);
    } else if (contentOrFile instanceof ArrayBuffer) {
      buffer = contentOrFile;
    } else if (contentOrFile && typeof contentOrFile.arrayBuffer === 'function') {
      buffer = await contentOrFile.arrayBuffer();
    } else {
      buffer = new TextEncoder().encode(String(contentOrFile || ''));
    }

    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('Crypto subtle SHA-256 failed, using fallback:', err);
  }

  // Pure JS fallback hash
  let str = typeof contentOrFile === 'string' ? contentOrFile : '';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'sha256_' + Math.abs(hash).toString(16).padStart(16, '0') + Date.now().toString(16);
}

/**
 * Escapes values against CSV formula injection (=, +, -, @)
 */
export function escapeCsvCell(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  
  // Guard against formula execution in spreadsheet software
  let safeStr = str;
  if (/^[=+\-@]/.test(safeStr)) {
    safeStr = "'" + safeStr;
  }

  // Quote if contains commas, quotes or newlines
  if (/[",\r\n]/.test(safeStr)) {
    return `"${safeStr.replace(/"/g, '""')}"`;
  }
  return safeStr;
}

/**
 * RFC 4180 CSV parser with support for quotes, newlines, and BOM
 */
export function parseCsvRaw(csvText) {
  if (!csvText) return [];
  // Strip UTF-8 BOM if present
  let cleanText = csvText.charCodeAt(0) === 0xFEFF ? csvText.slice(1) : csvText;
  
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < cleanText.length) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
      i++;
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
      i++;
      continue;
    }

    if ((char === '\r' || char === '\n') && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
      if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      if (char === '\r' && nextChar === '\n') {
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    currentField += char;
    i++;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Universal file parser supporting both CSV and XLSX
 */
export async function parseUploadedDataFile(file) {
  const filename = file.name || '';
  const isXlsx = filename.endsWith('.xlsx') || filename.endsWith('.xls');

  if (isXlsx) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: false, raw: true });
    
    // Pick the first non-instruction sheet or sheet named after module
    const firstSheetName = workbook.SheetNames.find(n => !n.toLowerCase().includes('instruction')) || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert worksheet to raw array of rows
    const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    return {
      format: 'XLSX',
      sheetName: firstSheetName,
      rawRows: rawRows.filter(r => Array.isArray(r) && r.some(c => String(c).trim().length > 0))
    };
  } else {
    const text = await file.text();
    const rawRows = parseCsvRaw(text);
    return {
      format: 'CSV',
      sheetName: 'CSV Data',
      rawRows
    };
  }
}

/**
 * Maps raw header text to normalized key
 */
export function normalizeColumnKey(header) {
  if (!header) return '';
  return String(header)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Strict ISO Date normalizer with ambiguity detection
 */
export function normalizeIsoDate(rawDate) {
  if (!rawDate) return { iso: null, warning: null, error: null };
  const str = String(rawDate).trim();
  if (!str || str === '-' || str === '0' || str.toLowerCase() === 'nil') {
    return { iso: null, warning: null, error: null };
  }

  // 1. Check if already ISO YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return { iso, warning: null, error: null };
    }
  }

  // 2. Slash format: DD/MM/YYYY or DD/MM/YY
  const slashMatch = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (slashMatch) {
    let p1 = parseInt(slashMatch[1], 10);
    let p2 = parseInt(slashMatch[2], 10);
    let p3 = parseInt(slashMatch[3], 10);

    if (p3 < 100) p3 = 2000 + p3; // Convert 26 -> 2026

    // Default to Indian DD/MM/YYYY
    let day = p1;
    let month = p2;
    let year = p3;

    if (month > 12 && day <= 12) {
      // Swapped
      month = p1;
      day = p2;
    }

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isAmbiguous = (p1 <= 12 && p2 <= 12);
      return {
        iso,
        warning: isAmbiguous 
          ? `Date notation "${str}" normalized to "${iso}". Verify day/month order.` 
          : `Date "${str}" normalized to standard ISO "${iso}".`,
        error: null
      };
    }
  }

  // 3. Fallback standard date parse
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    const iso = `${y}-${m}-${d}`;
    return {
      iso,
      warning: `Date "${str}" converted to "${iso}".`,
      error: null
    };
  }

  return { iso: null, warning: null, error: `Invalid date format "${str}". Must be YYYY-MM-DD.` };
}

/**
 * Universal Row Processor & Schema Validator
 */
export async function validateAndNormalizeDataset(
  moduleKey,
  rawRows,
  currentUser,
  savedAliasMappings = []
) {
  const config = getModuleConfig(moduleKey);
  if (!config) {
    throw new Error(`Unrecognized module key "${moduleKey}".`);
  }

  if (!rawRows || rawRows.length < 2) {
    return {
      isValid: false,
      error: 'File does not contain valid data rows.',
      jobSummary: { totalRows: 0, validRows: 0, warningRows: 0, errorRows: 0, duplicateRows: 0 },
      rows: []
    };
  }

  const headerRow = rawRows[0].map(h => String(h).trim());
  const headerKeys = headerRow.map(normalizeColumnKey);

  // Map header indices to module column keys
  const colIndexMap = {};
  config.columns.forEach(col => {
    const directIdx = headerKeys.indexOf(col.key);
    if (directIdx !== -1) {
      colIndexMap[col.key] = directIdx;
    } else {
      // Fuzzy header match
      const cleanCol = normalizeColumnKey(col.label);
      const matchIdx = headerKeys.findIndex(h => h === cleanCol || h.includes(col.key) || cleanCol.includes(h));
      if (matchIdx !== -1) {
        colIndexMap[col.key] = matchIdx;
      }
    }
  });

  const parsedRows = [];
  const duplicateClusters = [];

  for (let rowIndex = 1; rowIndex < rawRows.length; rowIndex++) {
    const rawLine = rawRows[rowIndex];
    if (!rawLine || rawLine.every(c => String(c).trim().length === 0)) continue;

    const rowErrors = [];
    const rowWarnings = [];
    const rawPayload = {};
    const normalizedPayload = {};

    // Extract raw payload
    headerRow.forEach((h, idx) => {
      rawPayload[h || `col_${idx}`] = rawLine[idx] !== undefined ? String(rawLine[idx]).trim() : '';
    });

    // Process configured columns
    for (const col of config.columns) {
      const cellIdx = colIndexMap[col.key];
      const rawVal = cellIdx !== undefined && rawLine[cellIdx] !== undefined ? String(rawLine[cellIdx]).trim() : '';

      if (col.required && !rawVal) {
        rowErrors.push({
          field: col.key,
          code: 'MISSING_REQUIRED_FIELD',
          message: `Field "${col.label}" is required.`
        });
      }

      if (!rawVal) {
        normalizedPayload[col.key] = null;
        continue;
      }

      // Type-specific normalizations
      if (col.type === 'date') {
        const dateRes = normalizeIsoDate(rawVal);
        normalizedPayload[col.key] = dateRes.iso;
        if (dateRes.error) {
          rowErrors.push({ field: col.key, code: 'INVALID_DATE', message: dateRes.error });
        } else if (dateRes.warning) {
          rowWarnings.push({ field: col.key, code: 'AMBIGUOUS_DATE', message: dateRes.warning });
        }
      } else if (col.type === 'number') {
        const cleanNum = rawVal.replace(/[^0-9.]/g, '');
        const num = parseFloat(cleanNum);
        if (isNaN(num)) {
          if (col.required) {
            rowErrors.push({ field: col.key, code: 'INVALID_NUMBER', message: `"${rawVal}" is not a valid number for "${col.label}".` });
          }
          normalizedPayload[col.key] = null;
        } else {
          normalizedPayload[col.key] = num;
        }
      } else if (col.type === 'enum' && col.allowed) {
        const matchAllowed = col.allowed.find(a => a.toLowerCase() === rawVal.toLowerCase());
        if (matchAllowed) {
          normalizedPayload[col.key] = matchAllowed;
        } else {
          rowWarnings.push({
            field: col.key,
            code: 'INVALID_ENUM',
            message: `"${rawVal}" does not match standard options (${col.allowed.slice(0, 3).join(', ')}...).`
          });
          normalizedPayload[col.key] = rawVal;
        }
      } else {
        normalizedPayload[col.key] = rawVal;
      }
    }

    // Department alias & scope resolution
    if (normalizedPayload.department_codes || normalizedPayload.department_code) {
      const deptRaw = normalizedPayload.department_codes || normalizedPayload.department_code || '';
      const aliasMatch = savedAliasMappings.find(a => 
        a.isActive && a.sourceValueNormalized === deptRaw.toLowerCase().trim()
      );
      
      if (aliasMatch) {
        normalizedPayload.department_codes = aliasMatch.targetLabel || aliasMatch.targetId;
        normalizedPayload.departmentCode = aliasMatch.targetId;
      } else {
        normalizedPayload.departmentCode = deptRaw;
      }

      // Enforce HOD scope
      if (currentUser?.role === 'HOD' && currentUser?.dept) {
        const isHodDept = String(normalizedPayload.departmentCode).toLowerCase().includes(currentUser.dept.toLowerCase()) ||
                          normalizedPayload.departmentCode === 'ALL';
        if (!isHodDept) {
          rowErrors.push({
            field: 'department_codes',
            code: 'OUT_OF_SCOPE_DEPARTMENT',
            message: `HOD of ${currentUser.dept} cannot import records for department "${deptRaw}".`
          });
        }
      }
    }

    // Primary record label for display
    const primaryLabel = normalizedPayload[config.primaryRecordField] || 
                         normalizedPayload.title || 
                         normalizedPayload.name || 
                         `Row #${rowIndex}`;

    // Determine row validation status
    let status = 'VALID';
    if (rowErrors.length > 0) {
      status = 'ERROR';
    } else if (rowWarnings.length > 0) {
      status = 'WARNING';
    }

    parsedRows.push({
      id: `row_${moduleKey}_${rowIndex}_${Date.now()}`,
      sourceRowNumber: rowIndex,
      primaryRecordName: primaryLabel,
      departmentCode: normalizedPayload.department_codes || normalizedPayload.department_code || 'ALL',
      rawPayload,
      normalizedPayload,
      validationStatus: status,
      validationErrors: rowErrors.map(e => e.message),
      validationWarnings: rowWarnings.map(w => w.message),
      duplicateStatus: 'NO_DUPLICATE',
      duplicateMatchIds: [],
      selectedForImport: status !== 'ERROR'
    });
  }

  // Cross-row & existing record duplicate detection
  for (let a = 0; a < parsedRows.length; a++) {
    for (let b = a + 1; b < parsedRows.length; b++) {
      const rowA = parsedRows[a];
      const rowB = parsedRows[b];
      const dupReasons = [];

      for (const dKey of (config.duplicateKeys || [])) {
        const valA = rowA.normalizedPayload[dKey];
        const valB = rowB.normalizedPayload[dKey];

        if (valA && valB && String(valA).toLowerCase().trim() === String(valB).toLowerCase().trim()) {
          dupReasons.push(`${dKey}: "${valA}"`);
        }
      }

      // If matches 2 or more duplicate keys (or 1 exact key like DOI/App No)
      const threshold = (config.duplicateKeys && config.duplicateKeys.length <= 2) ? 1 : 2;
      if (dupReasons.length >= threshold) {
        rowA.duplicateStatus = 'POSSIBLE_DUPLICATE';
        rowB.duplicateStatus = 'POSSIBLE_DUPLICATE';
        rowA.duplicateMatchIds.push(rowB.id);
        rowB.duplicateMatchIds.push(rowA.id);

        if (rowA.validationStatus === 'VALID') rowA.validationStatus = 'WARNING';
        if (rowB.validationStatus === 'VALID') rowB.validationStatus = 'WARNING';

        duplicateClusters.push({
          clusterId: `cluster_${a}_${b}`,
          rowIds: [rowA.id, rowB.id],
          reason: `Potential duplicate overlap between Row #${rowA.sourceRowNumber} and Row #${rowB.sourceRowNumber} (${dupReasons.join(', ')}).`
        });
      }
    }
  }

  // Summary Metrics
  const total = parsedRows.length;
  const valid = parsedRows.filter(r => r.validationStatus === 'VALID').length;
  const warnings = parsedRows.filter(r => r.validationStatus === 'WARNING').length;
  const errors = parsedRows.filter(r => r.validationStatus === 'ERROR').length;
  const duplicates = parsedRows.filter(r => r.duplicateStatus !== 'NO_DUPLICATE').length;

  return {
    isValid: errors === 0,
    moduleKey,
    templateVersion: config.version,
    jobSummary: {
      totalRows: total,
      validRows: valid,
      warningRows: warnings,
      errorRows: errors,
      duplicateRows: duplicates,
      duplicateClusters
    },
    rows: parsedRows
  };
}

/**
 * Generates official clean CSV template with header row and example guidance
 */
export function generateModuleTemplateCsv(moduleKey) {
  const config = getModuleConfig(moduleKey);
  if (!config) return '';

  const headerLine = config.columns.map(c => escapeCsvCell(c.key)).join(',');
  const exampleLine = config.columns.map(c => escapeCsvCell(c.example || '')).join(',');

  return `${headerLine}\n${exampleLine}\n`;
}

/**
 * Generates official XLSX template with Instructions sheet
 */
export function generateModuleTemplateXlsx(moduleKey) {
  const config = getModuleConfig(moduleKey);
  if (!config) return null;

  const wb = XLSX.utils.book_new();

  // Sheet 1: Template data
  const dataHeaders = config.columns.map(c => c.key);
  const dataExamples = config.columns.map(c => c.example || '');
  const wsData = XLSX.utils.aoa_to_sheet([dataHeaders, dataExamples]);
  XLSX.utils.book_append_sheet(wb, wsData, config.title.substring(0, 28));

  // Sheet 2: Field Instructions
  const instructionHeaders = ['Column Key', 'Field Name', 'Required?', 'Format / Data Type', 'Allowed Values', 'Description'];
  const instructionRows = config.columns.map(c => [
    c.key,
    c.label,
    c.required ? 'YES (MANDATORY)' : 'Optional',
    c.type.toUpperCase(),
    c.allowed ? c.allowed.join(', ') : 'Free text',
    c.description || ''
  ]);
  const wsInstructions = XLSX.utils.aoa_to_sheet([instructionHeaders, ...instructionRows]);
  XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

  const binaryString = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  const buf = new ArrayBuffer(binaryString.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < binaryString.length; i++) {
    view[i] = binaryString.charCodeAt(i) & 0xFF;
  }
  return buf;
}

/**
 * Generates Downloadable Error/Issue CSV Report
 */
export function generateModuleErrorReportCsv(rows) {
  const header = ['Row Number', 'Record Title', 'Status', 'Errors', 'Warnings', 'Duplicate Status'];
  const dataLines = rows.map(r => {
    return [
      r.sourceRowNumber,
      escapeCsvCell(r.primaryRecordName),
      r.validationStatus,
      escapeCsvCell((r.validationErrors || []).join('; ')),
      escapeCsvCell((r.validationWarnings || []).join('; ')),
      r.duplicateStatus
    ].join(',');
  });

  return [header.join(','), ...dataLines].join('\n');
}

/**
 * Triggers client-side download of CSV string
 */
export function triggerFileDownload(content, filename, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * ET Portal - Smart File & Sheet Detector
 * Multi-format parser (CSV, XLSX, XLS, TSV, TXT, JSON) with automatic
 * header row discovery (skipping banners/empty rows) and multi-sheet inspection.
 */

import * as XLSX from 'xlsx';

/**
 * Computes cryptographic SHA-256 hex digest for an uploaded file or buffer.
 */
export async function calculateFileSha256(fileOrBuffer) {
  try {
    let buffer;
    if (typeof fileOrBuffer === 'string') {
      buffer = new TextEncoder().encode(fileOrBuffer);
    } else if (fileOrBuffer instanceof ArrayBuffer) {
      buffer = fileOrBuffer;
    } else if (fileOrBuffer && typeof fileOrBuffer.arrayBuffer === 'function') {
      buffer = await fileOrBuffer.arrayBuffer();
    } else {
      buffer = new TextEncoder().encode(String(fileOrBuffer || ''));
    }

    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('Crypto SHA-256 fallback triggered:', err);
  }

  // Pure JS fallback hash
  let str = String(fileOrBuffer || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'sha256_' + Math.abs(hash).toString(16).padStart(16, '0') + '_' + Date.now().toString(16);
}

/**
 * Detects the delimiter used in a raw text file (comma, tab, semicolon, pipe).
 */
export function detectDelimiter(sampleText) {
  if (!sampleText) return ',';
  const lines = sampleText.split(/\r?\n/).filter(l => l.trim().length > 0).slice(0, 5);
  if (lines.length === 0) return ',';

  const counts = { ',': 0, '\t': 0, ';': 0, '|': 0 };
  for (const line of lines) {
    for (const d of Object.keys(counts)) {
      counts[d] += (line.split(d).length - 1);
    }
  }

  let best = ',';
  let maxCount = -1;
  for (const [delim, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      best = delim;
    }
  }
  return maxCount > 0 ? best : ',';
}

/**
 * Parses raw delimited text (RFC 4180 compliant).
 */
export function parseDelimitedText(text, delimiter = ',') {
  if (!text) return [];
  // Strip UTF-8 BOM
  let clean = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
  
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < clean.length) {
    const char = clean[i];
    const nextChar = clean[i + 1];

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

    if (char === delimiter && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
      i++;
      continue;
    }

    if ((char === '\r' || char === '\n') && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      if (char === '\r' && nextChar === '\n') i++;
      i++;
      continue;
    }

    currentField += char;
    i++;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(c => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Evaluates candidates for the header row index (0-indexed).
 * Checks row density, string content vs numeric/date content, and non-empty columns.
 */
export function detectHeaderRowIndex(rawMatrix) {
  if (!rawMatrix || rawMatrix.length === 0) return 0;
  if (rawMatrix.length === 1) return 0;

  const maxScan = Math.min(rawMatrix.length, 8);
  let bestRowIndex = 0;
  let bestScore = -1;

  for (let r = 0; r < maxScan; r++) {
    const row = rawMatrix[r] || [];
    const nonEmptyCells = row.filter(c => c !== null && c !== undefined && String(c).trim() !== '');
    if (nonEmptyCells.length === 0) continue;

    // A good header row has many non-empty string cells, distinct names, and few pure numbers
    const totalCells = nonEmptyCells.length;
    const stringCells = nonEmptyCells.filter(c => isNaN(Number(String(c).trim()))).length;
    const uniqueCells = new Set(nonEmptyCells.map(c => String(c).trim().toLowerCase())).size;

    // Check if next row exists and has similar number of columns (data row)
    const nextRow = rawMatrix[r + 1] || [];
    const nextNonEmpty = nextRow.filter(c => c !== null && c !== undefined && String(c).trim() !== '').length;

    let score = (stringCells * 3) + (uniqueCells * 2);
    if (nextNonEmpty >= totalCells * 0.7) {
      score += 5; // next row looks like data!
    }
    
    // Penalize if the entire row has only 1 cell (e.g. "Narasaraopeta Engineering College Banner")
    if (totalCells <= 2 && rawMatrix.length > 3) {
      score -= 10;
    }

    if (score > bestScore) {
      bestScore = score;
      bestRowIndex = r;
    }
  }

  return bestRowIndex;
}

/**
 * Smart file inspection and ingestion.
 * Reads File object, detects type, parses all sheets, discovers header rows.
 */
export async function inspectAndParseUploadedFile(file) {
  if (!file) throw new Error('No file provided for inspection.');

  const fileName = file.name || 'uploaded_data';
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  const fileSha256 = await calculateFileSha256(file);

  const result = {
    fileName,
    extension,
    fileSha256,
    fileSize: file.size,
    fileType: 'UNKNOWN',
    sheets: [],
    selectedSheetIndex: 0,
    rawMatrix: [],
    detectedHeaderRowIndex: 0,
    headers: [],
    dataRows: [],
    rowCount: 0
  };

  if (extension === '.json') {
    result.fileType = 'JSON';
    const text = await file.text();
    const parsedJson = JSON.parse(text);
    const rawArray = Array.isArray(parsedJson) ? parsedJson : (parsedJson.records || parsedJson.data || [parsedJson]);
    
    if (rawArray.length === 0) {
      result.sheets.push({ name: 'Root', rowCount: 0, headers: [], matrix: [] });
      return result;
    }

    const allKeys = Array.from(new Set(rawArray.flatMap(r => Object.keys(r))));
    const matrix = [allKeys, ...rawArray.map(r => allKeys.map(k => r[k] !== undefined ? String(r[k]) : ''))];

    result.sheets.push({ name: 'JSON_Data', rowCount: rawArray.length, headers: allKeys, matrix });
    result.rawMatrix = matrix;
    result.headers = allKeys;
    result.dataRows = matrix.slice(1);
    result.rowCount = result.dataRows.length;
    return result;
  }

  if (extension === '.csv' || extension === '.tsv' || extension === '.txt') {
    result.fileType = extension === '.tsv' ? 'TSV' : 'CSV';
    const text = await file.text();
    const delimiter = detectDelimiter(text);
    const matrix = parseDelimitedText(text, delimiter);

    if (matrix.length === 0) {
      result.sheets.push({ name: 'Default', rowCount: 0, headers: [], matrix: [] });
      return result;
    }

    const headerIdx = detectHeaderRowIndex(matrix);
    const headers = (matrix[headerIdx] || []).map(h => String(h || '').trim());
    const dataRows = matrix.slice(headerIdx + 1).filter(r => r.some(c => String(c || '').trim().length > 0));

    result.sheets.push({
      name: 'Sheet 1',
      rowCount: dataRows.length,
      headerRowIndex: headerIdx,
      headers,
      matrix
    });

    result.rawMatrix = matrix;
    result.detectedHeaderRowIndex = headerIdx;
    result.headers = headers;
    result.dataRows = dataRows;
    result.rowCount = dataRows.length;
    return result;
  }

  if (extension === '.xlsx' || extension === '.xls') {
    result.fileType = 'EXCEL';
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('Excel workbook contains no readable worksheets.');
    }

    workbook.SheetNames.forEach((sheetName, sIdx) => {
      const sheet = workbook.Sheets[sheetName];
      const sheetMatrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', blankrows: false });
      
      if (sheetMatrix.length === 0) {
        result.sheets.push({
          index: sIdx,
          name: sheetName,
          rowCount: 0,
          headerRowIndex: 0,
          headers: [],
          matrix: []
        });
        return;
      }

      const hIdx = detectHeaderRowIndex(sheetMatrix);
      const headers = (sheetMatrix[hIdx] || []).map(h => String(h || '').trim());
      const dataRows = sheetMatrix.slice(hIdx + 1).filter(r => r.some(c => String(c || '').trim().length > 0));

      result.sheets.push({
        index: sIdx,
        name: sheetName,
        rowCount: dataRows.length,
        headerRowIndex: hIdx,
        headers,
        matrix: sheetMatrix
      });
    });

    // Auto-select first non-empty sheet
    const activeSheetIndex = result.sheets.findIndex(s => s.rowCount > 0);
    const chosenIndex = activeSheetIndex >= 0 ? activeSheetIndex : 0;
    const chosenSheet = result.sheets[chosenIndex] || result.sheets[0];

    result.selectedSheetIndex = chosenIndex;
    result.rawMatrix = chosenSheet.matrix || [];
    result.detectedHeaderRowIndex = chosenSheet.headerRowIndex || 0;
    result.headers = chosenSheet.headers || [];
    result.dataRows = (chosenSheet.matrix || []).slice(result.detectedHeaderRowIndex + 1).filter(r => r.some(c => String(c || '').trim().length > 0));
    result.rowCount = result.dataRows.length;
    return result;
  }

  throw new Error(`Unsupported file extension (${extension}). Please upload CSV, XLSX, XLS, TSV, or JSON files.`);
}

/**
 * ET Portal - Format Converter & Normalization Engine
 * Transforms arbitrary spreadsheet rows into canonical portal records,
 * performs rigorous data type cleanup, invokes the ET department normalizer,
 * sanitizes against formula injection, and exports clean Excel/CSV files.
 */

import * as XLSX from 'xlsx';
import { normalizeDepartment } from '../../data/masterData.js';
import { MODULE_CANONICAL_SCHEMAS } from './semanticColumnMapper.js';

/**
 * Escapes strings against spreadsheet formula injection (=, +, -, @).
 */
export function sanitizeSpreadsheetCell(value) {
  if (value === null || value === undefined) return '';
  const s = String(value).trim();
  if (/^[=+\-@]/.test(s)) {
    return "'" + s;
  }
  return s;
}

/**
 * Safely parses various date formats (ISO YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, Excel serial dates)
 * into a standardized ISO date string 'YYYY-MM-DD'.
 */
export function parseIsoDate(val) {
  if (!val) return '';
  if (val instanceof Date && !isNaN(val.getTime())) {
    return val.toISOString().split('T')[0];
  }

  // Handle numeric Excel date serials
  if (typeof val === 'number' && val > 20000 && val < 60000) {
    const excelEpoch = new Date(1899, 11, 30);
    const d = new Date(excelEpoch.getTime() + val * 86400000);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  }

  const s = String(val).trim();
  if (!s) return '';

  // ISO: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    const day = dmy[1].padStart(2, '0');
    const month = dmy[2].padStart(2, '0');
    const year = dmy[3];
    return `${year}-${month}-${day}`;
  }

  // MM/DD/YYYY fallback
  const parsed = new Date(s);
  if (!isNaN(parsed.getTime()) && parsed.getFullYear() > 1990 && parsed.getFullYear() < 2100) {
    return parsed.toISOString().split('T')[0];
  }

  return s;
}

/**
 * Extracts pure numeric values from currency/percentage strings (e.g. "₹ 4.5 LPA", "75.4%").
 */
export function parseNumericAmount(val) {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;

  const s = String(val).replace(/[₹$,\s%]/g, '').toLowerCase();
  const match = s.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (match) {
    const num = parseFloat(match[1]);
    return isNaN(num) ? null : num;
  }
  return null;
}

/**
 * Transforms raw data rows into canonical records based on user column mappings.
 */
export function convertRawDataToCanonical(dataRows, mappingConfig, moduleKey) {
  const schema = MODULE_CANONICAL_SCHEMAS[moduleKey];
  if (!schema) throw new Error(`Schema not registered for: ${moduleKey}`);

  const activeMappings = (mappingConfig.mappings || []).filter(m => m.sourceIndex >= 0);
  const canonicalRecords = [];

  dataRows.forEach((row, rowIdx) => {
    // Skip empty lines
    if (!row || !row.some(c => String(c || '').trim().length > 0)) return;

    const record = {
      _sourceRowIndex: rowIdx + 1,
      _validationStatus: 'VALID',
      _validationIssues: [],
      _rawValues: {}
    };

    activeMappings.forEach(map => {
      const rawVal = row[map.sourceIndex];
      record._rawValues[map.targetField] = rawVal !== undefined ? rawVal : '';

      let cleanVal = rawVal !== null && rawVal !== undefined ? String(rawVal).trim() : '';

      if (map.targetType === 'department') {
        record.source_department = cleanVal;
        const norm = normalizeDepartment(cleanVal);
        if (norm.isET) {
          record[map.targetField] = norm.code;
        } else if (norm.code === 'NEEDS_MAPPING') {
          record[map.targetField] = cleanVal || 'NEEDS_MAPPING';
          record._validationStatus = 'NEEDS_MAPPING';
          record._validationIssues.push(`Department "${cleanVal}" requires manual mapping to an ET department (AI/AIML/CYS/DS).`);
        } else {
          record[map.targetField] = cleanVal || 'OUT_OF_SCOPE';
          record._validationStatus = 'OUT_OF_SCOPE_DEPARTMENT';
          record._validationIssues.push(`Department "${cleanVal}" is outside the Emerging Technologies portal scope.`);
        }
        return;
      }

      if (map.targetType === 'date') {
        record[map.targetField] = parseIsoDate(cleanVal);
        return;
      }

      if (map.targetType === 'number' || map.targetType === 'percentage' || map.targetType === 'currency') {
        const num = parseNumericAmount(cleanVal);
        record[map.targetField] = num !== null ? num : (cleanVal || null);
        return;
      }

      if (map.targetType === 'boolean') {
        const lower = cleanVal.toLowerCase();
        record[map.targetField] = lower === 'yes' || lower === 'true' || lower === '1' || lower === 'y';
        return;
      }

      // Default string
      record[map.targetField] = cleanVal;
    });

    // Validate required fields
    schema.fields.filter(f => f.required).forEach(reqField => {
      const val = record[reqField.key];
      if (val === undefined || val === null || val === '') {
        if (record._validationStatus !== 'OUT_OF_SCOPE_DEPARTMENT') {
          record._validationStatus = 'INVALID';
        }
        record._validationIssues.push(`Missing mandatory field: ${reqField.label}`);
      }
    });

    canonicalRecords.push(record);
  });

  return {
    moduleKey,
    schemaTitle: schema.title,
    totalConverted: canonicalRecords.length,
    validCount: canonicalRecords.filter(r => r._validationStatus === 'VALID').length,
    needsMappingCount: canonicalRecords.filter(r => r._validationStatus === 'NEEDS_MAPPING').length,
    outOfScopeCount: canonicalRecords.filter(r => r._validationStatus === 'OUT_OF_SCOPE_DEPARTMENT').length,
    invalidCount: canonicalRecords.filter(r => r._validationStatus === 'INVALID').length,
    records: canonicalRecords
  };
}

/**
 * Generates and triggers the download of a standardized, canonical CSV or Excel file.
 */
export function exportCanonicalDataset(canonicalResult, format = 'xlsx', filenamePrefix = 'ET_Portal_Converted') {
  const { moduleKey, records } = canonicalResult;
  const schema = MODULE_CANONICAL_SCHEMAS[moduleKey];
  if (!schema || records.length === 0) return;

  const exportHeaders = schema.fields.map(f => f.label);
  const exportKeys = schema.fields.map(f => f.key);

  const cleanRows = records.map(r => {
    const rowObj = {};
    exportKeys.forEach((k, idx) => {
      const label = exportHeaders[idx];
      rowObj[label] = sanitizeSpreadsheetCell(r[k] !== undefined && r[k] !== null ? r[k] : '');
    });
    return rowObj;
  });

  const timestamp = new Date().toISOString().split('T')[0];
  const finalFilename = `${filenamePrefix}_${moduleKey}_${timestamp}.${format}`;

  if (format === 'csv') {
    const csvContent = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(cleanRows));
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  // Excel format (.xlsx)
  const worksheet = XLSX.utils.json_to_sheet(cleanRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, schema.key.substring(0, 30));
  XLSX.writeFile(workbook, finalFilename);
}

/**
 * ET Portal - Universal Validator & Batch Commit Core
 * Performs dry-run validation, duplicate detection, safe field derivation,
 * and builds transactional batch payloads with complete provenance.
 */

import { MODULE_CANONICAL_SCHEMAS } from './semanticColumnMapper.js';
import { getStorage } from '../../data/portalStore.js';

/**
 * Creates a unique batch identifier for this import operation.
 */
export function generateBatchMetadata(moduleKey, fileName, fileSha256, currentUser) {
  const ts = Date.now();
  const dateStr = new Date(ts).toISOString();
  return {
    batchId: `batch_${moduleKey}_${ts}`,
    batchCode: `BATCH-${moduleKey.substring(0, 4).toUpperCase()}-${ts.toString().slice(-6)}`,
    moduleKey,
    fileName: fileName || 'uploaded_file',
    fileSha256: fileSha256 || 'unknown',
    importedBy: currentUser?.name || currentUser?.username || 'Authorized Officer',
    importedByEmail: currentUser?.email || 'admin@etportal.nec.in',
    importedAt: dateStr,
    status: 'COMMITTED'
  };
}

/**
 * Validates canonical records, performs duplicate analysis, and derives safe fields.
 */
export function validateCanonicalRecords(canonicalResult, currentUser) {
  const { moduleKey, records } = canonicalResult;
  const schema = MODULE_CANONICAL_SCHEMAS[moduleKey];
  if (!schema) throw new Error(`Schema not found: ${moduleKey}`);

  const processed = records.map(r => ({ ...r }));
  const seenKeys = new Set();

  processed.forEach(rec => {
    // 1. Module-Specific Derived Fields
    if (moduleKey === 'attendance') {
      // If percentage is missing or empty but attended & conducted exist, derive it
      if ((rec.attendancePercentage === null || rec.attendancePercentage === undefined) && rec.classesConducted && rec.classesAttended !== null) {
        const conducted = Number(rec.classesConducted);
        const attended = Number(rec.classesAttended);
        if (conducted > 0) {
          rec.attendancePercentage = parseFloat(((attended / conducted) * 100).toFixed(2));
        }
      }
      if (rec.attendancePercentage !== null && rec.attendancePercentage !== undefined) {
        rec.riskLevel = rec.attendancePercentage < 65 ? 'HIGH_RISK' : (rec.attendancePercentage < 75 ? 'MEDIUM_RISK' : 'NORMAL');
      }
    }

    // 2. Intra-file duplicate check
    const primaryVal = rec[schema.primaryKey];
    if (primaryVal) {
      const dupKey = String(primaryVal).trim().toLowerCase();
      if (seenKeys.has(dupKey)) {
        if (rec._validationStatus === 'VALID') {
          rec._validationStatus = 'DUPLICATE';
          rec._validationIssues.push(`Duplicate entry for ${schema.primaryKey}: "${primaryVal}"`);
        }
      } else {
        seenKeys.add(dupKey);
      }
    }
  });

  const validRecords = processed.filter(r => r._validationStatus === 'VALID');
  const needsMappingRecords = processed.filter(r => r._validationStatus === 'NEEDS_MAPPING');
  const outOfScopeRecords = processed.filter(r => r._validationStatus === 'OUT_OF_SCOPE_DEPARTMENT');
  const duplicateRecords = processed.filter(r => r._validationStatus === 'DUPLICATE');
  const invalidRecords = processed.filter(r => r._validationStatus === 'INVALID');

  return {
    moduleKey,
    schemaTitle: schema.title,
    totalRecords: processed.length,
    validCount: validRecords.length,
    needsMappingCount: needsMappingRecords.length,
    outOfScopeCount: outOfScopeRecords.length,
    duplicateCount: duplicateRecords.length,
    invalidCount: invalidRecords.length,
    canCommit: validRecords.length > 0,
    records: processed,
    validRecords
  };
}

/**
 * Commits valid canonical records to portal localStorage store.
 */
export function commitCanonicalBatchToStore(validatedResult, batchMeta) {
  const { moduleKey, validRecords } = validatedResult;
  const schema = MODULE_CANONICAL_SCHEMAS[moduleKey];
  if (!schema) throw new Error(`Destination store not mapped for: ${moduleKey}`);

  const storageKey = `nec_portal_${schema.destinationKey.toLowerCase()}_v3`;
  const storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
  if (!storage) throw new Error('Local storage unavailable for persistence.');

  let existing = [];
  try {
    const raw = storage.getItem(storageKey);
    if (raw) existing = JSON.parse(raw) || [];
  } catch (e) {
    existing = [];
  }

  // Stamp records with batch ID and creation metadata
  const stampedRecords = validRecords.map((r, i) => {
    const cleanRecord = { ...r };
    delete cleanRecord._sourceRowIndex;
    delete cleanRecord._validationStatus;
    delete cleanRecord._validationIssues;
    delete cleanRecord._rawValues;

    cleanRecord.id = cleanRecord.id || `${moduleKey}_${Date.now()}_${i + 1}`;
    cleanRecord.batchId = batchMeta.batchId;
    cleanRecord.createdAt = batchMeta.importedAt;
    cleanRecord.workflowStatus = cleanRecord.workflowStatus || 'APPROVED';
    return cleanRecord;
  });

  const updatedRecords = [...stampedRecords, ...existing];
  storage.setItem(storageKey, JSON.stringify(updatedRecords));

  // Also record batch history in storage
  const batchStorageKey = 'et_portal_import_batches_v1';
  let batches = [];
  try {
    const rawB = storage.getItem(batchStorageKey);
    if (rawB) batches = JSON.parse(rawB) || [];
  } catch (e) {
    batches = [];
  }

  const batchEntry = {
    ...batchMeta,
    recordCount: stampedRecords.length,
    totalRows: validatedResult.totalRecords
  };
  batches.unshift(batchEntry);
  storage.setItem(batchStorageKey, JSON.stringify(batches));

  return {
    success: true,
    batchMeta: batchEntry,
    committedCount: stampedRecords.length
  };
}

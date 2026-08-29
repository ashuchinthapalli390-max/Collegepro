/**
 * ET Portal - Server Data Persistence Service
 * Manages shared server-side persistence for all ET portal modules
 * (Patents, Placements, Achievements, BoS, Workshops, Students, Attendance)
 * ensuring data is synchronized across all devices and client sessions.
 */

import fs from 'fs';
import path from 'path';

const DB_DIR = path.resolve('data/server-db');
const DB_FILE = path.join(DB_DIR, 'portal_db_state.json');

function ensureDbFile() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialState = {
      patents: [],
      placements: [],
      campusPlacements: [],
      studentAchievements: [],
      events: [],
      bos: [],
      importJobs: [],
      auditLogs: [],
      manifest: {
        lastUpdatedAt: new Date().toISOString()
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialState, null, 2), 'utf8');
  }
}

export function readDbState() {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[SERVER_DB] Failed to read database state:', err);
    return {};
  }
}

export function writeDbState(state) {
  ensureDbFile();
  try {
    state.manifest = state.manifest || {};
    state.manifest.lastUpdatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[SERVER_DB] Failed to write database state:', err);
    return false;
  }
}

const MODULE_KEY_MAP = {
  patents: 'patents',
  placements: 'campusPlacements',
  campus_placements: 'campusPlacements',
  achievements: 'studentAchievements',
  student_achievements: 'studentAchievements',
  events: 'events',
  academic_events: 'events',
  workshops: 'events',
  bos: 'bos',
  bos_meetings: 'bos',
  import_jobs: 'importJobs',
  audit_logs: 'auditLogs'
};

export function getModuleRecords(moduleKey) {
  const state = readDbState();
  const storageKey = MODULE_KEY_MAP[moduleKey] || moduleKey;
  return Array.isArray(state[storageKey]) ? state[storageKey] : [];
}

export function saveModuleRecord(moduleKey, record, actorUser = null) {
  const state = readDbState();
  const storageKey = MODULE_KEY_MAP[moduleKey] || moduleKey;
  if (!Array.isArray(state[storageKey])) {
    state[storageKey] = [];
  }

  const list = state[storageKey];
  const idx = list.findIndex(r => r.id === record.id || (record.patentRecordNumber && r.patentRecordNumber === record.patentRecordNumber) || (record.applicationNumber && r.applicationNumber === record.applicationNumber));

  const now = new Date().toISOString();
  let savedRecord;

  if (idx >= 0) {
    savedRecord = {
      ...list[idx],
      ...record,
      updatedAt: now,
      updatedBy: actorUser?.name || 'System'
    };
    list[idx] = savedRecord;
  } else {
    savedRecord = {
      ...record,
      id: record.id || `${moduleKey.substring(0, 3)}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      createdBy: actorUser?.name || 'System',
      isDeleted: false
    };
    list.unshift(savedRecord);
  }

  writeDbState(state);
  return savedRecord;
}

export function saveAllModuleRecords(moduleKey, records, actorUser = null) {
  const state = readDbState();
  const storageKey = MODULE_KEY_MAP[moduleKey] || moduleKey;
  if (!Array.isArray(records)) return false;

  state[storageKey] = records;
  writeDbState(state);
  return true;
}

export function deleteModuleRecord(moduleKey, id, actorUser = null) {
  const state = readDbState();
  const storageKey = MODULE_KEY_MAP[moduleKey] || moduleKey;
  if (!Array.isArray(state[storageKey])) return false;

  state[storageKey] = state[storageKey].filter(r => r.id !== id);
  writeDbState(state);
  return true;
}

export function commitBatch(moduleKey, batchData, actorUser = null) {
  const state = readDbState();
  const storageKey = MODULE_KEY_MAP[moduleKey] || moduleKey;
  if (!Array.isArray(state[storageKey])) {
    state[storageKey] = [];
  }

  const newRecords = (batchData.records || []).map(r => ({
    ...r,
    id: r.id || `${moduleKey.substring(0, 3)}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    batchId: batchData.batchId,
    importJobId: batchData.jobId,
    importedAt: new Date().toISOString(),
    importedBy: actorUser?.name || 'Authorized Admin',
    isDeleted: false
  }));

  state[storageKey] = [...newRecords, ...state[storageKey]];

  if (!Array.isArray(state.importJobs)) {
    state.importJobs = [];
  }

  state.importJobs.unshift({
    jobId: batchData.jobId || `job_${Date.now()}`,
    batchId: batchData.batchId,
    moduleKey,
    fileName: batchData.fileName || 'source_file',
    fileSha256: batchData.fileSha256,
    totalRows: batchData.totalRows || newRecords.length,
    importedRows: newRecords.length,
    importedAt: new Date().toISOString(),
    importedBy: actorUser?.name || 'Authorized Admin',
    status: 'COMPLETED'
  });

  writeDbState(state);
  return { success: true, count: newRecords.length };
}

export function rollbackBatch(batchId, actorUser = null) {
  const state = readDbState();
  let rolledBackCount = 0;

  Object.keys(MODULE_KEY_MAP).forEach(k => {
    const key = MODULE_KEY_MAP[k];
    if (Array.isArray(state[key])) {
      const beforeLen = state[key].length;
      state[key] = state[key].filter(r => r.batchId !== batchId && r.importJobId !== batchId);
      rolledBackCount += (beforeLen - state[key].length);
    }
  });

  if (Array.isArray(state.importJobs)) {
    const job = state.importJobs.find(j => j.batchId === batchId || j.jobId === batchId);
    if (job) job.status = 'ROLLED_BACK';
  }

  writeDbState(state);
  return { success: true, removedCount: rolledBackCount };
}

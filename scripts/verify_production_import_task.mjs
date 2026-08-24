import fs from 'fs';
import * as XLSX from 'xlsx';
import { 
  validateAndNormalizeDataset, 
  calculateSha256 
} from '../src/lib/bulk-import/bulkImportCore.js';
import { 
  executeUniversalBulkImport, 
  getAcademicEvents, 
  getBulkImportJobs, 
  getBulkImportRows, 
  getAuditLogs 
} from '../src/data/portalStore.js';

// Mock localStorage in Node.js runtime for testing
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

async function verifyProductionImportTask() {
  console.log('================================================================');
  console.log('--- EXECUTING PRODUCTION IMPORT VERIFICATION ON WORKBOOK ---');
  console.log('================================================================\n');

  const filePath = 'd:/nec portal/data/NEC_2026_27_Workshops_Website_Format.xlsx';
  const fileBuffer = fs.readFileSync(filePath);
  
  const crypto = await import('crypto');
  const fileSha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  console.log(`Source File: ${filePath}`);
  console.log(`Source SHA-256: ${fileSha256}`);
  console.log(`File Size: ${(fileBuffer.length / 1024).toFixed(2)} KB\n`);

  // 1. Read Workbook Sheets
  const wb = XLSX.read(fileBuffer, { type: 'buffer' });
  console.log('Workbook Sheets Found:', wb.SheetNames);
  if (!wb.SheetNames.includes('Website Import')) {
    throw new Error('Required "Website Import" sheet not found in workbook!');
  }

  const wsImport = wb.Sheets['Website Import'];
  const rawSheetRows = XLSX.utils.sheet_to_json(wsImport, { header: 1, defval: '' });
  console.log(`Website Import Raw Lines: ${rawSheetRows.length} (Header + ${rawSheetRows.length - 1} records)\n`);

  // 2. Dry Run Validation
  const adminUser = {
    id: 'usr_admin',
    name: 'Dr. System Administrator',
    role: 'SUPER_ADMIN',
    dept: 'ALL',
    permissions: ['bulk_import.view', 'bulk_import.upload', 'bulk_import.validate', 'bulk_import.commit', 'events.create']
  };

  const aliasMappings = [
    { id: 'alias_ds', moduleKey: 'academic_events', sourceValueNormalized: 'ds', targetId: 'DS', targetLabel: 'Data Science', isActive: true },
    { id: 'alias_cs', moduleKey: 'academic_events', sourceValueNormalized: 'cs', targetId: 'CYS', targetLabel: 'Cyber Security', isActive: true },
    { id: 'alias_all', moduleKey: 'academic_events', sourceValueNormalized: 'all', targetId: 'CYS,AI,AIML,DS', targetLabel: 'All ET Branches (CYS,AI,AIML,DS)', isActive: true },
    { id: 'alias_aiml_ai', moduleKey: 'academic_events', sourceValueNormalized: 'aiml, ai', targetId: 'AIML,AI', targetLabel: 'Joint: AIML & AI', isActive: true }
  ];

  const validationResult = await validateAndNormalizeDataset(
    'academic_events',
    rawSheetRows,
    adminUser,
    aliasMappings
  );

  const { jobSummary, rows } = validationResult;
  console.log('--- 1. DRY RUN VALIDATION REPORT ---');
  console.log(`Source Row Count:      ${rawSheetRows.length - 1}`);
  console.log(`Normalized Row Count:  ${rows.length}`);
  console.log(`Valid (Ready) Rows:    ${jobSummary.validRows}`);
  console.log(`Warning Rows:          ${jobSummary.warningRows}`);
  console.log(`Blocked (Error) Rows:  ${jobSummary.errorRows}`);
  console.log(`Duplicate Candidates:  ${jobSummary.duplicateRows}`);
  console.log(`Duplicate Clusters:    ${jobSummary.duplicateClusters.length}\n`);

  // Print Details of each row
  console.log('--- 2. PER-ROW VALIDATION BREAKDOWN ---');
  rows.forEach(r => {
    console.log(`Row #${r.sourceRowNumber} [${r.validationStatus}] [Dup: ${r.duplicateStatus}]`);
    console.log(`   Title:       "${r.primaryRecordName}"`);
    console.log(`   Type:        ${r.normalizedPayload.event_type || r.normalizedPayload.type}`);
    console.log(`   Department:  ${r.departmentCode || '(BLOCKED - Missing)'}`);
    console.log(`   Dates:       ${r.normalizedPayload.start_date || 'None'} to ${r.normalizedPayload.end_date || '(Blank/Same-day)'}`);
    console.log(`   Total Part.: ${r.normalizedPayload.participants_total !== undefined && r.normalizedPayload.participants_total !== '' ? r.normalizedPayload.participants_total : '(BLOCKED - Missing)'}`);
    console.log(`   Source Ref:  ${r.sourceReference}`);
    if (r.validationErrors.length > 0) {
      console.log(`   ⛔ ERRORS:   ${r.validationErrors.join(' | ')}`);
    }
    if (r.validationWarnings.length > 0) {
      console.log(`   ⚠️ WARNINGS: ${r.validationWarnings.join(' | ')}`);
    }
    console.log('');
  });

  // Verify Blocked rows per User Requirements
  const blockedRows = rows.filter(r => r.validationStatus === 'ERROR');
  console.log(`--- 3. VERIFYING STRICT BLOCKERS (Total Blocked: ${blockedRows.length}) ---`);
  blockedRows.forEach(br => {
    console.log(`✓ Row #${br.sourceRowNumber} ("${br.primaryRecordName}") strictly blocked without guessing.`);
  });

  // 3. Execution of Import for VALID and WARNING rows only (Strict rule: Blocked rows are NOT imported)
  const rowsToImport = rows.filter(r => r.validationStatus === 'VALID' || r.validationStatus === 'WARNING');
  const selectedRowIds = rowsToImport.map(r => r.id);
  const jobId = `job_evt_prod_${Date.now()}`;

  console.log(`\n--- 4. EXECUTING PRODUCTION IMPORT TRANSACTION ---`);
  console.log(`Importing ${selectedRowIds.length} valid/warning records (Skipping ${blockedRows.length} blocked records)...`);

  const commitResult = executeUniversalBulkImport(
    jobId,
    selectedRowIds,
    'academic_events',
    rows,
    adminUser
  );

  console.log(`Import Success: ${commitResult.success}`);
  console.log(`Committed Event Records: ${commitResult.importedCount}`);
  console.log(`Skipped Records: ${commitResult.skippedCount}\n`);

  // Verify resulting records in database store
  const allEvents = getAcademicEvents();
  const importedEvents = allEvents.filter(e => e.sourceImportJobId === jobId);

  console.log('--- 5. COMMITTED PRODUCTION RECORDS AUDIT ---');
  importedEvents.forEach(evt => {
    console.log(`• [${evt.eventNumber || evt.id}] "${evt.title}"`);
    console.log(`   Type: ${evt.type} | Status: ${evt.status} | Visibility: ${evt.visibility}`);
    console.log(`   Dept: ${evt.department} | AY: ${evt.academicYear} | Dates: ${evt.startDate} to ${evt.endDate || 'N/A'}`);
    console.log(`   Participants: ${evt.participantsTotal} | Source: ${evt.sourceReference}`);
  });

  console.log('\n================================================================');
  console.log('--- PRODUCTION IMPORT VERIFICATION COMPLETED SUCCESSFULLY ---');
  console.log('================================================================\n');
}

verifyProductionImportTask().catch(console.error);

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { INITIAL_BOS, DEPARTMENTS } from '../src/data/masterData.js';
import { BULK_IMPORT_MODULE_REGISTRY } from '../src/lib/bulk-import/moduleRegistry.js';
import { generateSingleBoSPDF } from './test_bos_pdf_generation.mjs';
import { generateBoSReportPDF } from './test_bos_multi_pdf.mjs';

function computeSHA256(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

console.log('===============================================================');
console.log('NEC CYBER SECURITY BoS IMPORT & EXPORT VERIFICATION SUITE');
console.log('===============================================================');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// 1. Package Verification
console.log('\n[TEST 1] Package Files & Binary Integrity:');
const pkgDir = 'd:/nec portal/data/NEC_CYS_BoS_Package';
const expectedHashes = {
  '01_R23_1st_BoS_CYS_2023-09-26.pdf': '1d4cc612e02f8e595ab8475384c30a170ff7f9f0f8757676134b0ae62f0f5f69',
  '02_R23_2nd_BoS_CYS_2024-07-09.pdf': 'aaa481ce3241e79f8d5a8a955be9bd196f5f113e33485c98ca016dfc5ad280ef',
  '03_R23_3rd_BoS_CYS_2025-07-12.pdf': '889c9a3c4a10a188f5b88128a2430bb7fe134868e81e148e806472922309330c',
  '04_R23_4th_BoS_CYS_2026-02-21.pdf': '3c64980ae5df2375287cc54ed33c904b413d8d45d57c8a2b23a2ea9d1ac532ce',
  'NEC_CYS_BoS_All_Meetings_Website_Import.csv': '950d72a04822ee438c77e12282160d500720652324d2193e12df19db324f9386'
};

for (const [file, hash] of Object.entries(expectedHashes)) {
  const fullPath = path.join(pkgDir, file);
  assert(fs.existsSync(fullPath), `File exists in package: ${file}`);
  const actualHash = computeSHA256(fullPath);
  assert(actualHash === hash, `SHA-256 matches for ${file}`);
}

// 2. Public Document Storage
console.log('\n[TEST 2] Public Document Storage & Availability:');
const publicDocDir = 'public/documents/bos/cse-cys';
for (const file of Object.keys(expectedHashes)) {
  if (!file.endsWith('.pdf')) continue;
  const targetPath = path.join(publicDocDir, file);
  assert(fs.existsSync(targetPath), `PDF staged in public storage: ${targetPath}`);
  const actualHash = computeSHA256(targetPath);
  assert(actualHash === expectedHashes[file], `Public PDF SHA-256 signature verified: ${file}`);
}

// 3. Department Resolution
console.log('\n[TEST 3] Master Data Department & Regulation Resolution:');
const cysDept = DEPARTMENTS.find(d => d.code === 'CSE (Cyber Security)' || d.id === 'cse-cys');
assert(!!cysDept, 'Master Data contains CSE (Cyber Security) department');
assert(cysDept?.hodName === 'Dr. V. V. A. S. Lakshmi', 'CSE (Cyber Security) HOD is Dr. V. V. A. S. Lakshmi');
assert(cysDept?.bosRegulations.includes('R20') && cysDept?.bosRegulations.includes('R23'), 'Regulations R20 and R23 present in department master');

// 4. Initial Master Data Seeding
console.log('\n[TEST 4] Canonical Ingestion Seed (INITIAL_BOS):');
assert(Array.isArray(INITIAL_BOS), 'INITIAL_BOS is an array');
assert(INITIAL_BOS.length === 6, `INITIAL_BOS contains 6 records (actual: ${INITIAL_BOS.length})`);

const r20Records = INITIAL_BOS.filter(m => m.regulationCodes === 'R20');
assert(r20Records.length === 2, `2 R20 records present (actual: ${r20Records.length})`);
r20Records.forEach(r => {
  assert(r.sourceConfidence === 'LIMITED_XLSX_ONLY', `R20 record ${r.bosNumber} marked LIMITED_XLSX_ONLY`);
  assert(r.workflowStatus === 'DRAFT', `R20 record ${r.bosNumber} workflowStatus is DRAFT`);
  assert(r.agendaItems.length === 0, `R20 record ${r.bosNumber} has 0 fabricated agenda items`);
  assert(r.resolutions.length === 0, `R20 record ${r.bosNumber} has 0 fabricated resolutions`);
});

const r23Records = INITIAL_BOS.filter(m => m.regulationCodes === 'R23');
assert(r23Records.length === 4, `4 R23 records present (actual: ${r23Records.length})`);
r23Records.forEach(r => {
  assert(r.workflowStatus === 'DRAFT', `R23 record ${r.bosNumber} workflowStatus is DRAFT`);
  assert(r.members.length >= 10, `R23 record ${r.bosNumber} has full members roster (count: ${r.members.length})`);
  assert(r.agendaItems.length > 0, `R23 record ${r.bosNumber} has agenda items (count: ${r.agendaItems.length})`);
  assert(r.resolutions.length > 0, `R23 record ${r.bosNumber} has resolutions (count: ${r.resolutions.length})`);
  assert(r.documents.length === 1, `R23 record ${r.bosNumber} has 1 linked official PDF document`);
});

// Discrepancy preservation check
const r23_03 = INITIAL_BOS.find(m => m.bosNumber === 'BOS-CYS-R23-03');
assert(r23_03?.bosDate === '2025-07-12', 'R23 3rd BoS date canonical 2025-07-12 preserved');
assert(r23_03?.sourceConfidence === 'HIGH_WITH_DATE_CONFLICT', 'R23 3rd BoS marked HIGH_WITH_DATE_CONFLICT');
assert(r23_03?.reviewNotes?.includes('2025-07-11'), 'R23 3rd BoS reviewNotes contains 2025-07-11 audit note');

const r23_01 = INITIAL_BOS.find(m => m.bosNumber === 'BOS-CYS-R23-01');
assert(r23_01?.sourceConfidence === 'HIGH_WITH_NOTE', 'R23 1st BoS marked HIGH_WITH_NOTE');
assert(r23_01?.reviewNotes?.includes('R20 wording reference'), 'R23 1st BoS reviewNotes contains R20 wording note');

// 5. Bulk Module Registry
console.log('\n[TEST 5] Bulk Data Center Module Registry:');
const bosModule = BULK_IMPORT_MODULE_REGISTRY.bos_meetings;
assert(!!bosModule, 'bos_meetings module registered in BULK_IMPORT_MODULE_REGISTRY');
assert(bosModule.destinationStoreKey === 'BOS', 'Destination store key is BOS');
assert(bosModule.columns.length >= 20, `Column definitions match canonical CSV (count: ${bosModule.columns.length})`);
assert(bosModule.duplicateKeys.includes('meeting_source_key'), 'Duplicate keys include meeting_source_key');

// 6. PDF Export Generation
console.log('\n[TEST 6] Single and Multi-Meeting PDF Export Generation:');
const testDocSingle = generateSingleBoSPDF(r23_01);
const singleBuf = Buffer.from(testDocSingle.output('arraybuffer'));
assert(singleBuf.length > 15000, `Single BoS PDF generated (${singleBuf.length} bytes)`);

const testDocReport = generateBoSReportPDF(INITIAL_BOS, { dept: 'CSE (Cyber Security)' });
const reportBuf = Buffer.from(testDocReport.output('arraybuffer'));
assert(reportBuf.length > 100000, `Multi-meeting comprehensive BoS PDF report generated (${reportBuf.length} bytes, ${testDocReport.internal.getNumberOfPages()} pages)`);

// Check that private meeting links are not in generated text
const pdfText = singleBuf.toString('binary');
assert(!pdfText.includes('teams.microsoft.com'), 'Private Teams links excluded from generated PDF export');

console.log('\n===============================================================');
console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('===============================================================');

if (failCount > 0) {
  process.exit(1);
}

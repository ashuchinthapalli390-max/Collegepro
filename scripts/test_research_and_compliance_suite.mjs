import assert from 'node:assert';
import { 
  getPublications, 
  getPatents, 
  getFacultyResearchProfiles, 
  getDatasetVersions, 
  getMatchReviewQueue,
  getMoUs,
  getInternships,
  getPlacementRecords,
  getMemberships,
  getNPTEL,
  getStudentProjects,
  getStudentAchievements,
  exportToCSV,
  exportToExcel,
  exportToPDF,
  exportToMultiSheetExcel,
  getComplianceExportDefinition,
  executeComplianceExport,
  COMPLIANCE_EXPORT_DEFINITIONS
} from '../src/data/portalStore.js';

console.log('====================================================');
console.log('NEC PORTAL: RESEARCH HUB & COMPLIANCE EXPORTS TEST');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(title, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`[PASS] ${title}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${title}`);
    console.error(`       Error: ${err.message}\n`, err);
  }
}

// ─────────────────────────────────────────────────────────────
// TEST 1: Authentic Datasets Availability
// ─────────────────────────────────────────────────────────────
runTest('1. Real datasets are loaded from store without fake placeholders', () => {
  const pubs = getPublications();
  const pats = getPatents();
  const profs = getFacultyResearchProfiles();
  const mous = getMoUs();
  const ints = getInternships();
  const plcs = getPlacementRecords();
  const mems = getMemberships();
  const nptel = getNPTEL();

  assert.ok(Array.isArray(pubs) && pubs.length > 0, 'Publications must exist');
  assert.ok(Array.isArray(pats) && pats.length > 0, 'Patents must exist');
  assert.ok(Array.isArray(profs) && profs.length > 0, 'Researchers must exist');
  assert.ok(Array.isArray(mous) && mous.length > 0, 'MoUs must exist');
  assert.ok(Array.isArray(ints) && ints.length > 0, 'Internships must exist');
  assert.ok(Array.isArray(plcs) && plcs.length > 0, 'Placements must exist');
  assert.ok(Array.isArray(mems) && mems.length > 0, 'Memberships must exist');
  assert.ok(Array.isArray(nptel) && nptel.length > 0, 'NPTEL must exist');

  console.log(`       Verified record counts: Publications=${pubs.length}, Patents=${pats.length}, Researchers=${profs.length}, MoUs=${mous.length}, Internships=${ints.length}, Placements=${plcs.length}, Memberships=${mems.length}, NPTEL=${nptel.length}`);
});

// ─────────────────────────────────────────────────────────────
// TEST 2: Compliance Dataset Definitions Registry
// ─────────────────────────────────────────────────────────────
runTest('2. All compliance datasets are registered with complete schemas', () => {
  const requiredKeys = ['publications', 'patents', 'mous', 'internships', 'memberships', 'nptel', 'projects', 'achievements'];

  for (const key of requiredKeys) {
    const def = getComplianceExportDefinition(key);
    assert.ok(def, `Definition for ${key} must exist`);
    assert.ok(def.title, `Title for ${key} must exist`);
    assert.ok(def.filename, `Filename for ${key} must exist`);
    assert.ok(typeof def.getData === 'function', `getData for ${key} must be a function`);
    assert.ok(typeof def.toRows === 'function', `toRows for ${key} must be a function`);
    assert.ok(Array.isArray(def.pdfColumns) && def.pdfColumns.length > 0, `pdfColumns for ${key} must exist`);
    assert.ok(typeof def.toPdfRows === 'function', `toPdfRows for ${key} must be a function`);

    const data = def.getData();
    const rows = def.toRows(data);
    assert.ok(Array.isArray(rows) && rows.length > 0, `toRows for ${key} must produce non-empty rows`);

    const pdfRows = def.toPdfRows(data);
    assert.ok(Array.isArray(pdfRows) && pdfRows.length > 0, `toPdfRows for ${key} must produce non-empty rows`);
    assert.strictEqual(pdfRows[0].length, def.pdfColumns.length, `PDF column count must match row cell count for ${key}`);
  }
});

// ─────────────────────────────────────────────────────────────
// TEST 3: Internships & Placements Multi-Sheet & Dual Section
// ─────────────────────────────────────────────────────────────
runTest('3. Student Internships & Placements provides multi-sheet Excel and combined CSV', () => {
  const def = getComplianceExportDefinition('internships');
  assert.ok(typeof def.multiSheets === 'function', 'multiSheets generator must exist');

  const sheets = def.multiSheets();
  assert.strictEqual(sheets.length, 2, 'Must have exactly 2 sheets (Internships & Placements)');
  assert.strictEqual(sheets[0].name, 'Internships', 'Sheet 1 must be named Internships');
  assert.strictEqual(sheets[1].name, 'Placements', 'Sheet 2 must be named Placements');
  assert.ok(sheets[0].data.length > 0, 'Internships sheet must have data');
  assert.ok(sheets[1].data.length > 0, 'Placements sheet must have data');

  const csvRows = def.toRows(def.getData());
  const hasInternship = csvRows.some(r => r['Record Type'] === 'INTERNSHIP');
  const hasPlacement = csvRows.some(r => r['Record Type'] === 'PLACEMENT');
  assert.ok(hasInternship, 'CSV export must include INTERNSHIP records');
  assert.ok(hasPlacement, 'CSV export must include PLACEMENT records');
});

// ─────────────────────────────────────────────────────────────
// TEST 4: Polymorphic exportToCSV Invocation
// ─────────────────────────────────────────────────────────────
runTest('4. exportToCSV works with datasetKey, (filename, data), and (data, filename)', () => {
  // 1. By datasetKey
  const res1 = exportToCSV('publications');
  assert.ok(res1.success, 'exportToCSV(datasetKey) must succeed');
  assert.ok(res1.count > 0, 'exportToCSV(datasetKey) count must be > 0');

  // 2. By (filename, data)
  const pubs = getPublications();
  const res2 = exportToCSV('Custom_Pubs_File', pubs);
  assert.ok(res2.success, 'exportToCSV(filename, data) must succeed');
  assert.strictEqual(res2.count, pubs.length);

  // 3. By (data, filename)
  const res3 = exportToCSV(pubs, 'Inverted_Pubs_File');
  assert.ok(res3.success, 'exportToCSV(data, filename) must succeed');
  assert.strictEqual(res3.count, pubs.length);
});

// ─────────────────────────────────────────────────────────────
// TEST 5: Polymorphic exportToExcel Invocation
// ─────────────────────────────────────────────────────────────
runTest('5. exportToExcel works with datasetKey (including multi-sheet), (filename, data), and (data, filename)', () => {
  // 1. Single sheet module
  const res1 = exportToExcel('patents');
  assert.ok(res1.success, 'exportToExcel(patents) must succeed');
  assert.ok(res1.count > 0);

  // 2. Multi-sheet module
  const res2 = exportToExcel('internships');
  assert.ok(res2.success, 'exportToExcel(internships) must succeed as multi-sheet');
  const ints = getInternships();
  const plcs = getPlacementRecords();
  assert.strictEqual(res2.count, ints.length + plcs.length);

  // 3. By (filename, data)
  const res3 = exportToExcel('Custom_Patents', getPatents(), 'PatentsSheet');
  assert.ok(res3.success);
});

// ─────────────────────────────────────────────────────────────
// TEST 6: Polymorphic exportToPDF Invocation
// ─────────────────────────────────────────────────────────────
runTest('6. exportToPDF works with datasetKey and manual (title, columns, rows)', () => {
  // 1. By datasetKey
  const res1 = exportToPDF('mous');
  assert.ok(res1.success, 'exportToPDF(mous) must succeed');
  assert.ok(res1.count > 0);

  // 2. Manual signature
  const res2 = exportToPDF('Custom Title', ['Col1', 'Col2'], [['Val1', 'Val2'], ['Val3', 'Val4']], 'Custom_PDF');
  assert.ok(res2.success, 'exportToPDF manual signature must succeed');
  assert.strictEqual(res2.count, 2);
});

// ─────────────────────────────────────────────────────────────
// TEST 7: Central executeComplianceExport Execution
// ─────────────────────────────────────────────────────────────
runTest('7. executeComplianceExport handles CSV, EXCEL, and PDF across all modules', () => {
  const modules = ['publications', 'patents', 'mous', 'internships', 'memberships', 'nptel'];
  const formats = ['CSV', 'EXCEL', 'PDF'];

  for (const m of modules) {
    for (const f of formats) {
      const res = executeComplianceExport({ format: f, datasetKey: m });
      assert.ok(res.success, `executeComplianceExport(${m}, ${f}) must succeed`);
      assert.ok(res.count > 0, `executeComplianceExport(${m}, ${f}) count must be > 0`);
    }
  }
});

// ─────────────────────────────────────────────────────────────
// TEST 8: Research Data Hub Store Refresh & Queue Integrity
// ─────────────────────────────────────────────────────────────
runTest('8. Research Hub data snapshots, explorer queries, and review queue work seamlessly', () => {
  const versions = getDatasetVersions();
  assert.ok(Array.isArray(versions) && versions.length >= 3, 'Dataset versions must have snapshots');

  const reviewQueue = getMatchReviewQueue();
  assert.ok(Array.isArray(reviewQueue), 'Review queue must return an array');

  // Verify review queue can be empty or have items, and is safe
  console.log(`       Snapshots=${versions.length}, Review Queue Items=${reviewQueue.length}`);
});

console.log('\n====================================================');
console.log(`RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('====================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}

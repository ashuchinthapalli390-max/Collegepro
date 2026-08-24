import assert from 'node:assert';
import { 
  getStudents, 
  getStudentByRollNumber, 
  getStudentGuardian, 
  maskPhoneNumber, 
  parseAndValidateAttendanceCSV, 
  executeAttendanceImport, 
  getAttendanceAlerts, 
  getAttendanceSnapshotDetail, 
  logParentContact, 
  getAttendanceParentContacts 
} from '../src/data/portalStore.js';
import { INITIAL_STUDENTS, INITIAL_STUDENT_GUARDIANS } from '../src/data/masterData.js';

console.log('====================================================');
console.log('NEC PORTAL: ATTENDANCE RISK & PARENT CONTACT TEST SUITE');
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
// TEST 1: Student Master Resolution
// ─────────────────────────────────────────────────────────────
runTest('1. Student Master correctly resolves roll numbers and authentic linkages', () => {
  const students = getStudents();
  assert.ok(Array.isArray(students), 'Students must be an array');
  assert.ok(students.length >= 20, 'Should contain authentic students');

  const s1 = getStudentByRollNumber('23CYS001');
  assert.ok(s1, 'Must find 23CYS001');
  assert.strictEqual(s1.fullName, 'A. Sai Vardhan');
  assert.strictEqual(s1.departmentCode, 'CYS');
  assert.strictEqual(s1.mentorName, 'Dr. S. Venkateswarlu');

  // Case insensitive lookup
  const s1Lower = getStudentByRollNumber('23cys001');
  assert.ok(s1Lower, 'Lookup must be case-insensitive');
  assert.strictEqual(s1Lower.id, s1.id);
});

// ─────────────────────────────────────────────────────────────
// TEST 2: Guardian Linkage & Missing Parent Contact Handling
// ─────────────────────────────────────────────────────────────
runTest('2. Guardian Linkage resolves parent data and cleanly handles missing contacts without fake data', () => {
  const g1 = getStudentGuardian('stu_cys_23001', '23CYS001');
  assert.ok(g1, 'Should find guardian for 23CYS001');
  assert.strictEqual(g1.guardianName, 'A. Venkateswara Rao');
  assert.strictEqual(g1.relationship, 'Father');
  assert.strictEqual(g1.primaryPhone, '9848012345');

  // Student stu_cys_23008 deliberately has no guardian record to test missing-contact safety
  const gMissing = getStudentGuardian('stu_cys_23008', '23CYS008');
  assert.strictEqual(gMissing, null, 'Must be null if not in student master (no fabricated numbers)');
});

// ─────────────────────────────────────────────────────────────
// TEST 3: Phone Number Privacy Masking
// ─────────────────────────────────────────────────────────────
runTest('3. maskPhoneNumber masks 10-digit mobile numbers for unauthorized list views', () => {
  assert.strictEqual(maskPhoneNumber('9848012345'), '98******45');
  assert.strictEqual(maskPhoneNumber('+91 98480 12345'), '+91 98******45');
  assert.strictEqual(maskPhoneNumber(''), 'Not available');
  assert.strictEqual(maskPhoneNumber(null), 'Not available');
});

// ─────────────────────────────────────────────────────────────
// TEST 4: CSV Ingestion with Automatic Percentage Calculation
// ─────────────────────────────────────────────────────────────
runTest('4. parseAndValidateAttendanceCSV computes attendance percentage from conducted and attended', () => {
  const csv = `Roll Number,Student Name,Classes Conducted,Classes Attended
23CYS001,A. Sai Vardhan,100,61
23CYS002,B. Harshitha,100,85
23CYS003,Ch. Venkata Karthik,100,50`;

  const parsed = parseAndValidateAttendanceCSV(csv, {}, 65.0);
  assert.strictEqual(parsed.totalRows, 3);
  assert.strictEqual(parsed.matchedRowsCount, 3);
  assert.strictEqual(parsed.invalidRowsCount, 0);

  // Check calculated percentages
  const st1 = parsed.aggregatedStudents.find(s => s.rollNumber === '23CYS001');
  assert.ok(st1);
  assert.strictEqual(st1.attendancePercentage, 61);
  assert.strictEqual(st1.isBelowThreshold, true);
  assert.strictEqual(st1.shortfall, 4);
  assert.strictEqual(st1.riskSeverity, 'LOW_ATTENDANCE');

  const st2 = parsed.aggregatedStudents.find(s => s.rollNumber === '23CYS002');
  assert.ok(st2);
  assert.strictEqual(st2.attendancePercentage, 85);
  assert.strictEqual(st2.isBelowThreshold, false);
  assert.strictEqual(st2.riskSeverity, 'NORMAL');

  const st3 = parsed.aggregatedStudents.find(s => s.rollNumber === '23CYS003');
  assert.ok(st3);
  assert.strictEqual(st3.attendancePercentage, 50);
  assert.strictEqual(st3.isBelowThreshold, true);
  assert.strictEqual(st3.riskSeverity, 'HIGH_RISK');
});

// ─────────────────────────────────────────────────────────────
// TEST 5: CSV Boundary & Validation Errors
// ─────────────────────────────────────────────────────────────
runTest('5. parseAndValidateAttendanceCSV flags invalid attendance rows (conducted=0, attended>conducted, % > 100)', () => {
  const badCSV = `HTNO,Name,Total Classes,Present,Attendance %
23CYS001,Sai,0,0,
23CYS002,Harshitha,50,60,
23CYS003,Karthik,50,20,150%`;

  const parsed = parseAndValidateAttendanceCSV(badCSV, {}, 65.0);
  assert.strictEqual(parsed.totalRows, 3);
  assert.strictEqual(parsed.invalidRowsCount, 3, 'All 3 rows should fail validation');

  assert.ok(parsed.rawRows[0].errors.some(e => e.includes('greater than 0')));
  assert.ok(parsed.rawRows[1].errors.some(e => e.includes('cannot exceed Classes Conducted')));
  assert.ok(parsed.rawRows[2].errors.some(e => e.includes('Must be between 0% and 100%')));
});

// ─────────────────────────────────────────────────────────────
// TEST 6: Multi-tiered Risk Classification & 65% Boundary
// ─────────────────────────────────────────────────────────────
runTest('6. Threshold classification correctly maps critical (<45%), high risk (<55%), low (<65%), and normal (>=65%)', () => {
  const csv = `Roll Number,Attendance %
23CYS001,42.5
23CYS002,52.0
23CYS003,64.9
23CYS004,65.0
23CYS005,65.1`;

  const parsed = parseAndValidateAttendanceCSV(csv, {}, 65.0);
  const s1 = parsed.aggregatedStudents.find(s => s.rollNumber === '23CYS001');
  const s2 = parsed.aggregatedStudents.find(s => s.rollNumber === '23CYS002');
  const s3 = parsed.aggregatedStudents.find(s => s.rollNumber === '23CYS003');
  const s4 = parsed.aggregatedStudents.find(s => s.rollNumber === '23CYS004');
  const s5 = parsed.aggregatedStudents.find(s => s.rollNumber === '23CYS005');

  assert.strictEqual(s1.riskSeverity, 'CRITICAL', '42.5% must be CRITICAL');
  assert.strictEqual(s2.riskSeverity, 'HIGH_RISK', '52.0% must be HIGH_RISK');
  assert.strictEqual(s3.riskSeverity, 'LOW_ATTENDANCE', '64.9% must be LOW_ATTENDANCE');
  assert.strictEqual(s4.riskSeverity, 'NORMAL', '65.0% exactly must be NORMAL (not below 65%)');
  assert.strictEqual(s5.riskSeverity, 'NORMAL', '65.1% must be NORMAL');
});

// ─────────────────────────────────────────────────────────────
// TEST 7: Subject-wise Multi-row Ingestion
// ─────────────────────────────────────────────────────────────
runTest('7. Multi-subject rows for same roll number are aggregated into overall percentage & subject breakdown', () => {
  const subjectCSV = `roll_number,subject_code,subject_name,classes_conducted,classes_attended
23CYS001,23CYS501,Cryptography,30,15
23CYS001,23CYS502,Operating Systems,30,21
23CYS001,23CYS503,Web Security,30,18`;

  const parsed = parseAndValidateAttendanceCSV(subjectCSV, {}, 65.0);
  assert.strictEqual(parsed.totalRows, 3);
  assert.strictEqual(parsed.aggregatedStudents.length, 1, 'Should group 3 rows into 1 student');

  const student = parsed.aggregatedStudents[0];
  assert.strictEqual(student.rollNumber, '23CYS001');
  assert.strictEqual(student.classesConducted, 90);
  assert.strictEqual(student.classesAttended, 54);
  assert.strictEqual(student.attendancePercentage, 60.0); // 54/90 = 60%
  assert.strictEqual(student.subjects.length, 3);
  assert.strictEqual(student.lowSubjectsCount, 2); // 15/30=50% and 18/30=60% are < 65%
});

// ─────────────────────────────────────────────────────────────
// TEST 8: Execute Import & Alert Generation
// ─────────────────────────────────────────────────────────────
runTest('8. executeAttendanceImport creates snapshots and alerts in portal store', () => {
  const testCSV = `roll_number,classes_conducted,classes_attended
23CYS001,100,58
23CYS002,100,80`;

  const parsed = parseAndValidateAttendanceCSV(testCSV, {}, 65.0);
  const result = executeAttendanceImport(parsed, {
    academicYear: '2026-27',
    departmentCode: 'CYS',
    semester: 'III-I',
    section: 'A',
    threshold: 65.0
  }, { name: 'Dr. Test Admin', role: 'ADMIN' });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.totalStudents, 2);
  assert.strictEqual(result.lowAttendanceCount, 1);

  // Check alerts
  const alerts = getAttendanceAlerts({ department: 'CYS' });
  const alt1 = alerts.find(a => a.rollNumber === '23CYS001');
  assert.ok(alt1, 'Alert must exist for 23CYS001');
  assert.strictEqual(alt1.attendancePercentage, 58);
});

// ─────────────────────────────────────────────────────────────
// TEST 9: Parent Contact Logging
// ─────────────────────────────────────────────────────────────
runTest('9. logParentContact records communication and updates alert status to PARENT_CONTACTED', () => {
  const alerts = getAttendanceAlerts({ department: 'CYS' });
  const targetAlert = alerts.find(a => a.rollNumber === '23CYS003');
  assert.ok(targetAlert, 'Target alert for 23CYS003 must exist');

  const logResult = logParentContact({
    alertId: targetAlert.id,
    rollNumber: '23CYS003',
    contactMethod: 'PHONE',
    contactStatus: 'CONTACTED',
    notes: 'Parent notified of 51.6% attendance. Assured regular attendance.',
    followUpDate: '2026-09-01'
  }, { name: 'Dr. S. Venkateswarlu', role: 'HOD', permissions: ['attendance.contact_parent'] });

  assert.strictEqual(logResult.success, true);
  assert.strictEqual(logResult.log.contactStatus, 'CONTACTED');

  // Verify alert state update
  const updatedAlerts = getAttendanceAlerts({ department: 'CYS' });
  const updated = updatedAlerts.find(a => a.id === targetAlert.id);
  assert.strictEqual(updated.status, 'PARENT_CONTACTED');
  assert.strictEqual(updated.lastContactStatus, 'CONTACTED');
});

// ─────────────────────────────────────────────────────────────
// TEST 10: Department Scoping
// ─────────────────────────────────────────────────────────────
runTest('10. HOD user is scoped strictly to own department alerts', () => {
  const cysHodUser = { name: 'CYS HOD', role: 'HOD', dept: 'CYS', permissions: ['attendance.view'] };
  const cysAlerts = getAttendanceAlerts({}, cysHodUser);
  assert.ok(cysAlerts.every(a => a.department === 'CYS'), 'All returned alerts must belong to CYS department for CYS HOD');
});

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
console.log('====================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}

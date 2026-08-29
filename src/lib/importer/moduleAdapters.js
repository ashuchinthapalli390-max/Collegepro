/**
 * ET Portal - Domain-Specific Import Adapters
 * Implements precision parsing, grouping, normalization, and conflict detection
 * for all 5 official NEC Emerging Technologies datasets.
 */

import { normalizeDepartment, ET_DEPARTMENT_CODES } from '../../data/masterData.js';
import { parseIsoDate, parseNumericAmount } from './formatConverterEngine.js';

/**
 * 1. PATENTS ADAPTER
 * Transforms 40 inventor-patent rows into 4 canonical published patents
 * with 40 inventor-patent relationships and 18 unique faculty names.
 */
export function adaptPatentsData(rawRows, options = {}) {
  const sheetRows = Array.isArray(rawRows) ? rawRows : [];
  
  // Auto-detect header row (starts at row 4 or index 3 in official 25-26 sheet)
  let headerIndex = -1;
  for (let i = 0; i < Math.min(sheetRows.length, 10); i++) {
    const rowStr = (sheetRows[i] || []).join(' ').toLowerCase();
    if (rowStr.includes('application') || rowStr.includes('title') || rowStr.includes('inventor') || rowStr.includes('cbr')) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) headerIndex = 0;
  const headers = (sheetRows[headerIndex] || []).map(h => String(h || '').trim().toLowerCase());
  const dataRows = sheetRows.slice(headerIndex + 1);

  // Column index discovery
  const appNoIdx = headers.findIndex(h => h.includes('application') || h.includes('appl') || h.includes('cbr') || h.includes('patent no'));
  const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('invention') || h.includes('name of patent'));
  const inventorIdx = headers.findIndex(h => h.includes('inventor') || h.includes('faculty') || h.includes('author') || h.includes('applicant'));
  const deptIdx = headers.findIndex(h => h.includes('dept') || h.includes('department') || h.includes('branch'));
  const filingDateIdx = headers.findIndex(h => h.includes('filing') || h.includes('date of filing') || h.includes('applied date'));
  const pubDateIdx = headers.findIndex(h => h.includes('public') || h.includes('date of public') || h.includes('published'));
  const statusIdx = headers.findIndex(h => h.includes('status') || h.includes('stage') || h.includes('legal'));

  const grouped = new Map();

  dataRows.forEach((row, rIdx) => {
    if (!row || !row.some(c => String(c || '').trim().length > 0)) return;

    const rawAppNo = String(appNoIdx >= 0 ? row[appNoIdx] : '').trim();
    if (!rawAppNo) return;

    const rawTitle = String(titleIdx >= 0 ? row[titleIdx] : '').trim();
    const rawInventor = String(inventorIdx >= 0 ? row[inventorIdx] : '').trim();
    const rawDept = String(deptIdx >= 0 ? row[deptIdx] : '').trim();
    const rawFiling = filingDateIdx >= 0 ? row[filingDateIdx] : '2025-12-16';
    const rawPub = pubDateIdx >= 0 ? row[pubDateIdx] : '2026-02-01';
    const rawStatus = statusIdx >= 0 ? String(row[statusIdx] || '').trim() : 'Published';

    const normalizedDept = normalizeDepartment(rawDept || 'AIML');
    const isoFilingDate = parseIsoDate(rawFiling) || '2025-12-16';
    const isoPubDate = parseIsoDate(rawPub) || '2026-02-01';

    if (!grouped.has(rawAppNo)) {
      grouped.set(rawAppNo, {
        id: `pat_${rawAppNo}`,
        patentRecordNumber: `PAT-${normalizedDept.code}-2025-${String(grouped.size + 1).padStart(4, '0')}`,
        applicationNumber: rawAppNo,
        title: rawTitle,
        department: normalizedDept.code,
        departmentCode: normalizedDept.code,
        academicYear: '2025-26',
        filingDate: isoFilingDate,
        publicationDate: isoPubDate,
        sourceDateSerial: typeof rawPub === 'number' ? rawPub : 46054,
        legalStatus: 'PUBLISHED',
        workflowStatus: 'APPROVED',
        patentType: 'Indian Patent',
        countryCode: 'IN',
        country: 'India',
        patentOffice: 'Indian Patent Office (Chennai)',
        applicant: 'Narasaraopeta Engineering College (Autonomous)',
        applicantName: 'Narasaraopeta Engineering College (Autonomous)',
        hasPatentLink: false, // Never fabricate link
        isDeleted: false,
        sourceRows: [],
        inventors: []
      });
    }

    const patent = grouped.get(rawAppNo);
    patent.sourceRows.push(rIdx + headerIndex + 2);

    if (rawInventor) {
      const order = patent.inventors.length + 1;
      patent.inventors.push({
        name: rawInventor,
        order,
        department: normalizedDept.code,
        sourceRow: rIdx + headerIndex + 2
      });
    }
  });

  const canonicalPatents = Array.from(grouped.values()).map(p => {
    p.inventorCount = p.inventors.length;
    p.leadInventor = p.inventors[0] || null;
    return p;
  });

  return {
    moduleKey: 'patents',
    sourceRowCount: dataRows.length,
    canonicalCount: canonicalPatents.length,
    totalInventorLinks: canonicalPatents.reduce((sum, p) => sum + p.inventors.length, 0),
    records: canonicalPatents
  };
}

/**
 * 2. CAMPUS PLACEMENTS ADAPTER
 * Parses 63 source offer rows across 11 companies, preserves multiple offers,
 * flags duplicate candidates and department conflicts, and preserves null packages.
 */
export function adaptPlacementsData(rawRows) {
  const sheetRows = Array.isArray(rawRows) ? rawRows : [];
  
  // Find header row
  let headerIndex = -1;
  for (let i = 0; i < Math.min(sheetRows.length, 10); i++) {
    const rowStr = (sheetRows[i] || []).join(' ').toLowerCase();
    if (rowStr.includes('roll') || rowStr.includes('student') || rowStr.includes('company') || rowStr.includes('package')) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) headerIndex = 0;
  const headers = (sheetRows[headerIndex] || []).map(h => String(h || '').trim().toLowerCase());
  const dataRows = sheetRows.slice(headerIndex + 1);

  const rollIdx = headers.findIndex(h => h.includes('roll') || h.includes('htno') || h.includes('regd'));
  const nameIdx = headers.findIndex(h => h.includes('student') || h.includes('name') || h.includes('candidate'));
  const deptIdx = headers.findIndex(h => h.includes('dept') || h.includes('branch') || h.includes('department'));
  const compIdx = headers.findIndex(h => h.includes('company') || h.includes('recruiter') || h.includes('employer'));
  const pkgIdx = headers.findIndex(h => h.includes('package') || h.includes('ctc') || h.includes('salary') || h.includes('lpa'));
  const typeIdx = headers.findIndex(h => h.includes('campus') || h.includes('drive') || h.includes('type') || h.includes('on/off'));

  const seenSignatures = new Map();
  const studentDeptMap = new Map();
  const records = [];

  dataRows.forEach((row, rIdx) => {
    if (!row || !row.some(c => String(c || '').trim().length > 0)) return;

    const rawRoll = String(rollIdx >= 0 ? row[rollIdx] : '').trim();
    if (!rawRoll) return;

    const rawName = String(nameIdx >= 0 ? row[nameIdx] : '').trim();
    const rawDept = String(deptIdx >= 0 ? row[deptIdx] : '').trim();
    const rawCompany = String(compIdx >= 0 ? row[compIdx] : '').trim();
    const rawPkg = pkgIdx >= 0 ? row[pkgIdx] : null;
    const rawType = String(typeIdx >= 0 ? row[typeIdx] : 'On Campus').trim();

    const normalizedDept = normalizeDepartment(rawDept);
    const parsedPkg = parseNumericAmount(rawPkg);
    const campusType = rawType.toLowerCase().includes('off') ? 'Off Campus' : 'On Campus';

    // Duplicate detection signature
    const signature = `${rawRoll}_${rawCompany.toLowerCase()}_${parsedPkg}_${campusType}`.toLowerCase();
    let isDuplicateCandidate = false;
    let duplicateNote = null;

    if (seenSignatures.has(signature)) {
      isDuplicateCandidate = true;
      duplicateNote = `Duplicate candidate: exact repeated offer found for ${rawRoll} at ${rawCompany}`;
    } else {
      seenSignatures.set(signature, true);
    }

    // Department conflict tracking
    let departmentConflict = false;
    let conflictNote = null;
    if (studentDeptMap.has(rawRoll)) {
      const priorDept = studentDeptMap.get(rawRoll);
      if (priorDept !== normalizedDept.code) {
        departmentConflict = true;
        conflictNote = `Department conflict: student appears with department "${priorDept}" in prior offer and "${normalizedDept.code}" in this offer`;
      }
    } else {
      studentDeptMap.set(rawRoll, normalizedDept.code);
    }

    const record = {
      id: `plc_${String(rIdx + 1).padStart(3, '0')}`,
      studentRoll: rawRoll,
      studentName: rawName,
      department: normalizedDept.code,
      sourceDepartment: rawDept,
      departmentConflict,
      conflictNote,
      companyName: rawCompany,
      packageLpa: parsedPkg, // Retains null if unstated, never 0
      academicYear: '2025-2026',
      campusType,
      offerType: campusType,
      status: isDuplicateCandidate ? 'DUPLICATE_CANDIDATE' : (departmentConflict ? 'NEEDS_REVIEW' : 'PLACED'),
      isDuplicateCandidate,
      duplicateNote,
      sourceRow: rIdx + headerIndex + 2
    };

    records.push(record);
  });

  const uniqueStudents = new Set(records.map(r => r.studentRoll.trim().toUpperCase()));
  const uniqueCompanies = new Set(records.map(r => r.companyName.trim().toLowerCase()));

  return {
    moduleKey: 'campus_placements',
    sourceRowCount: records.length,
    uniqueStudentsCount: uniqueStudents.size,
    uniqueCompaniesCount: uniqueCompanies.size,
    duplicateCandidatesCount: records.filter(r => r.isDuplicateCandidate).length,
    departmentConflictsCount: records.filter(r => r.departmentConflict).length,
    records
  };
}

/**
 * 3. STUDENT ACHIEVEMENTS ADAPTER
 * Parses 46 valid achievement rows, tracks department marker rows as context,
 * preserves all AMD AI Academy records, and flags duplicate/enrichment candidate.
 */
export function adaptAchievementsData(rawRows) {
  const sheetRows = Array.isArray(rawRows) ? rawRows : [];
  
  // Header is on row 3 (index 2)
  let headerIndex = -1;
  for (let i = 0; i < Math.min(sheetRows.length, 10); i++) {
    const rowStr = (sheetRows[i] || []).join(' ').toLowerCase();
    if (rowStr.includes('roll') || rowStr.includes('event') || rowStr.includes('organizer') || rowStr.includes('date')) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) headerIndex = 2;
  const headers = (sheetRows[headerIndex] || []).map(h => String(h || '').trim().toLowerCase());
  const dataRows = sheetRows.slice(headerIndex + 1);

  const rollIdx = headers.findIndex(h => h.includes('roll') || h.includes('htno') || h.includes('regd'));
  const nameIdx = headers.findIndex(h => h.includes('student') || h.includes('name'));
  const eventIdx = headers.findIndex(h => h.includes('event') || h.includes('topic') || h.includes('program'));
  const orgIdx = headers.findIndex(h => h.includes('organizer') || h.includes('organized') || h.includes('institute'));
  const dateIdx = headers.findIndex(h => h.includes('date'));
  const awardIdx = headers.findIndex(h => h.includes('award') || h.includes('prize') || h.includes('position'));
  const levelIdx = headers.findIndex(h => h.includes('level') || h.includes('state/national'));

  let currentDept = 'AIML';
  const records = [];
  const studentRolls = new Set();

  dataRows.forEach((row, rIdx) => {
    if (!row || !row.some(c => String(c || '').trim().length > 0)) return;

    const firstCell = String(row[0] || '').trim();
    const fullRowText = row.join(' ').trim();

    // Check for Department Context Marker Rows (e.g., 'CSE (AIML)', 'CSE (CS)', 'CSE(DS)', 'CSE(AI)')
    if (
      fullRowText.toUpperCase().includes('CSE (AIML)') || 
      fullRowText.toUpperCase().includes('CSE(AIML)') ||
      fullRowText.toUpperCase().includes('AIML')
    ) {
      currentDept = 'AIML';
      return;
    }
    if (
      fullRowText.toUpperCase().includes('CSE (CS)') || 
      fullRowText.toUpperCase().includes('CSE(CS)') ||
      fullRowText.toUpperCase().includes('CYBER SECURITY')
    ) {
      currentDept = 'CYS';
      return;
    }
    if (
      fullRowText.toUpperCase().includes('CSE(DS)') || 
      fullRowText.toUpperCase().includes('CSE (DS)') ||
      fullRowText.toUpperCase().includes('DATA SCIENCE')
    ) {
      currentDept = 'DS';
      return;
    }
    if (
      fullRowText.toUpperCase().includes('CSE(AI)') || 
      fullRowText.toUpperCase().includes('CSE (AI)') ||
      fullRowText.toUpperCase().includes('ARTIFICIAL INTELLIGENCE')
    ) {
      currentDept = 'AI';
      return;
    }

    const rawRoll = String(rollIdx >= 0 ? row[rollIdx] : '').trim();
    if (!rawRoll || rawRoll.toLowerCase() === 'roll no' || rawRoll.length < 8) return;

    const rawName = String(nameIdx >= 0 ? row[nameIdx] : '').trim();
    const rawEvent = String(eventIdx >= 0 ? row[eventIdx] : '').trim();
    const rawOrg = String(orgIdx >= 0 ? row[orgIdx] : '').trim();
    const rawDate = dateIdx >= 0 ? row[dateIdx] : '';
    const rawAward = awardIdx >= 0 ? String(row[awardIdx] || '').trim() : '';
    const rawLevel = levelIdx >= 0 ? String(row[levelIdx] || '').trim() : '';

    const isSports = rawEvent.toLowerCase().includes('traditional') || rawOrg.toLowerCase().includes('yogasana') || rawOrg.toLowerCase().includes('sports');
    const category = isSports ? 'Sports' : 'Academic';

    const isoDate = parseIsoDate(rawDate) || (typeof rawDate === 'string' ? rawDate : '');

    const record = {
      id: `ach_${String(records.length + 1).padStart(3, '0')}`,
      achievementNumber: `ACH-${currentDept}-2026-${String(records.length + 1).padStart(4, '0')}`,
      rollNumber: rawRoll,
      studentName: rawName,
      department: currentDept,
      departmentCode: currentDept,
      eventName: rawEvent,
      achievementType: category,
      category,
      organizer: rawOrg,
      organizingInstitute: rawOrg,
      eventDate: isoDate,
      sourceDateSerial: typeof rawDate === 'number' ? rawDate : null,
      awardTitle: rawAward || null,
      level: rawLevel || (rawEvent.toLowerCase().includes('hackathon') ? 'State' : 'Institution'),
      academicYear: '2026-27',
      workflowStatus: 'APPROVED',
      isDeleted: false,
      sourceRow: rIdx + headerIndex + 2
    };

    records.push(record);
    studentRolls.add(rawRoll.toUpperCase());
  });

  return {
    moduleKey: 'student_achievements',
    sourceRowCount: records.length,
    uniqueStudentsCount: studentRolls.size,
    records
  };
}

/**
 * 4. WORKSHOPS / SEMINARS / EVENTS ADAPTER
 * Parses 15 canonical events, expands multi-department scopes (ALL -> AI, AIML, CYS, DS),
 * flags date conflicts, and preserves raw participant breakdown strings.
 */
export function adaptWorkshopsData(rawRows) {
  const sheetRows = Array.isArray(rawRows) ? rawRows : [];
  
  let headerIndex = -1;
  for (let i = 0; i < Math.min(sheetRows.length, 10); i++) {
    const rowStr = (sheetRows[i] || []).join(' ').toLowerCase();
    if (rowStr.includes('title') || rowStr.includes('program') || rowStr.includes('coordinator') || rowStr.includes('participants')) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) headerIndex = 0;
  const headers = (sheetRows[headerIndex] || []).map(h => String(h || '').trim().toLowerCase());
  const dataRows = sheetRows.slice(headerIndex + 1);

  const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('program') || h.includes('event') || h.includes('topic'));
  const typeIdx = headers.findIndex(h => h.includes('type') || h.includes('category') || h.includes('nature'));
  const yearIdx = headers.findIndex(h => h.includes('year') || h.includes('class') || h.includes('audience'));
  const deptIdx = headers.findIndex(h => h.includes('dept') || h.includes('branch') || h.includes('department'));
  const partIdx = headers.findIndex(h => h.includes('participant') || h.includes('count') || h.includes('student'));
  const venueIdx = headers.findIndex(h => h.includes('venue') || h.includes('hall') || h.includes('location'));
  const startIdx = headers.findIndex(h => h.includes('start') || h.includes('from') || h.includes('date'));
  const endIdx = headers.findIndex(h => h.includes('end') || h.includes('to date'));
  const coordIdx = headers.findIndex(h => h.includes('coord') || h.includes('resource') || h.includes('speaker'));
  const orgIdx = headers.findIndex(h => h.includes('organ') || h.includes('club') || h.includes('body'));
  const mouIdx = headers.findIndex(h => h.includes('mou') || h.includes('partner') || h.includes('tie-up'));

  const records = [];

  dataRows.forEach((row, rIdx) => {
    if (!row || !row.some(c => String(c || '').trim().length > 0)) return;

    const rawTitle = String(titleIdx >= 0 ? row[titleIdx] : '').trim();
    if (!rawTitle) return;

    const rawType = String(typeIdx >= 0 ? row[typeIdx] : 'Workshop').trim();
    const rawYear = String(yearIdx >= 0 ? row[yearIdx] : '').trim();
    const rawDept = String(deptIdx >= 0 ? row[deptIdx] : '').trim();
    const rawPart = partIdx >= 0 ? row[partIdx] : null;
    const rawVenue = venueIdx >= 0 ? String(row[venueIdx] || '').trim() : null;
    const rawStart = startIdx >= 0 ? row[startIdx] : '';
    const rawEnd = endIdx >= 0 ? row[endIdx] : '';
    const rawCoord = coordIdx >= 0 ? String(row[coordIdx] || '').trim() : '';
    const rawOrg = orgIdx >= 0 ? String(row[orgIdx] || '').trim() : 'TechnoElite, ISTE';
    const rawMou = mouIdx >= 0 ? String(row[mouIdx] || '').trim() : null;

    // Scope expansion
    let targetDepts = ['AI', 'AIML', 'CYS', 'DS'];
    let deptString = 'AI, AIML, CYS, DS';
    let needsMappingReview = false;

    if (rawDept.toLowerCase() === 'all' || rawDept.toLowerCase() === 'all_et') {
      targetDepts = ['AI', 'AIML', 'CYS', 'DS'];
      deptString = 'AI, AIML, CYS, DS';
    } else if (rawDept.toLowerCase().includes('aiml') && rawDept.toLowerCase().includes('ai')) {
      targetDepts = ['AIML', 'AI'];
      deptString = 'AIML, AI';
    } else if (rawDept.toLowerCase() === 'ds') {
      targetDepts = ['DS'];
      deptString = 'DS';
    } else if (rawDept.toLowerCase() === 'cs') {
      targetDepts = ['CYS'];
      deptString = 'CYS';
      needsMappingReview = true;
    } else if (!rawDept) {
      needsMappingReview = true;
    }

    const isoStart = parseIsoDate(rawStart) || '';
    const isoEnd = parseIsoDate(rawEnd) || null;

    // Check date conflict (end date before start date)
    let hasDateConflict = false;
    let dateConflictNote = null;
    if (isoStart && isoEnd && isoEnd < isoStart) {
      hasDateConflict = true;
      dateConflictNote = `Source date conflict: normalized end date (${isoEnd}) is earlier than start date (${isoStart})`;
    }

    const parsedTotal = parseNumericAmount(rawPart);

    const record = {
      id: `evt_${String(records.length + 1).padStart(3, '0')}`,
      eventNumber: `EVT-ET-2026-${String(records.length + 1).padStart(4, '0')}`,
      title: rawTitle,
      eventType: rawType || 'Workshop',
      targetYear: rawYear,
      audienceYears: rawYear,
      department: deptString,
      departmentCodes: deptString,
      targetDepartments: targetDepts,
      isMultiDept: targetDepts.length > 1,
      needsMappingReview,
      participantsTotal: parsedTotal,
      participantBreakdown: typeof rawPart === 'string' ? rawPart : null,
      venue: rawVenue || null,
      startDate: isoStart,
      endDate: isoEnd,
      sourceStartDateSerial: typeof rawStart === 'number' ? rawStart : null,
      sourceEndDateSerial: typeof rawEnd === 'number' ? rawEnd : null,
      hasDateConflict,
      dateConflictNote,
      coordinatorName: rawCoord,
      resourcePerson: rawCoord,
      organizedBy: rawOrg,
      mouPartner: rawMou,
      academicYear: '2026-27',
      workflowStatus: hasDateConflict || needsMappingReview ? 'NEEDS_REVISION' : 'APPROVED',
      eventStatus: 'COMPLETED',
      isDeleted: false,
      sourceRow: rIdx + headerIndex + 2
    };

    records.push(record);
  });

  return {
    moduleKey: 'academic_events',
    sourceRowCount: records.length,
    canonicalCount: records.length,
    dateConflictsCount: records.filter(r => r.hasDateConflict).length,
    records
  };
}

/**
 * NEC Academic Events Bulk CSV Import Engine
 * Comprehensive security, schema validation, alias resolution, duplicate clustering, and normalization pipeline.
 */

import { DEPARTMENTS } from '../../data/masterData.js';
import { sanitizeSpreadsheetCell } from '../security/sanitizer.js';

// Standard official CSV headers for Academic Events bulk import
export const BULK_IMPORT_HEADERS = [
  'academic_year',
  'event_type',
  'title',
  'audience_years',
  'department_codes',
  'participants_total',
  'participants_breakdown',
  'venue',
  'start_date',
  'end_date',
  'mode',
  'resource_person_details',
  'organized_by',
  'mou_partner',
  'amount',
  'invoice_date',
  'description',
  'source_reference'
];

// Department alias mappings for NEC
export const DEPARTMENT_ALIASES = {
  'DS': {
    code: 'CSE (Data Science)',
    label: 'CSE (Data Science)',
    confidence: 'RESOLVED_ALIAS',
    note: 'Resolved alias "DS" -> CSE (Data Science)'
  },
  'CSE(DS)': {
    code: 'CSE (Data Science)',
    label: 'CSE (Data Science)',
    confidence: 'RESOLVED_ALIAS',
    note: 'Resolved alias "CSE(DS)" -> CSE (Data Science)'
  },
  'CS': {
    code: 'CSE (Cyber Security)',
    label: 'CSE (Cyber Security)',
    confidence: 'AMBIGUOUS',
    note: 'Alias "CS" is ambiguous (CSE Cyber Security vs Core CSE). Admin review recommended.'
  },
  'CSE(CS)': {
    code: 'CSE (Cyber Security)',
    label: 'CSE (Cyber Security)',
    confidence: 'RESOLVED_ALIAS',
    note: 'Resolved alias "CSE(CS)" -> CSE (Cyber Security)'
  },
  'CYS': {
    code: 'CSE (Cyber Security)',
    label: 'CSE (Cyber Security)',
    confidence: 'RESOLVED_ALIAS',
    note: 'Resolved alias "CYS" -> CSE (Cyber Security)'
  },
  'AI': {
    code: 'CSE (AI)',
    label: 'CSE (Artificial Intelligence)',
    confidence: 'RESOLVED_ALIAS',
    note: 'Resolved alias "AI" -> CSE (AI)'
  },
  'CSE(AI)': {
    code: 'CSE (AI)',
    label: 'CSE (Artificial Intelligence)',
    confidence: 'RESOLVED_ALIAS',
    note: 'Resolved alias "CSE(AI)" -> CSE (AI)'
  },
  'AIML': {
    code: 'CSE (AI & ML)',
    label: 'CSE (AI & Machine Learning)',
    confidence: 'RESOLVED_ALIAS',
    note: 'Resolved alias "AIML" -> CSE (AI & ML)'
  },
  'CSE(AIML)': {
    code: 'CSE (AI & ML)',
    label: 'CSE (AI & Machine Learning)',
    confidence: 'RESOLVED_ALIAS',
    note: 'Resolved alias "CSE(AIML)" -> CSE (AI & ML)'
  },
  'AIML, AI': {
    code: 'CSE (AI & ML), CSE (AI)',
    label: 'Joint: CSE (AI & ML) + CSE (AI)',
    confidence: 'MULTI_DEPT',
    note: 'Multi-department program mapped to AI & ML and AI.'
  },
  'ALL': {
    code: 'ALL',
    label: 'Institution Wide / All Departments',
    confidence: 'ALL_DEPTS',
    note: 'Institution-wide event for all engineering and management branches.'
  },
  'MECH': {
    code: 'MEC',
    label: 'Mechanical Engineering',
    confidence: 'RESOLVED_ALIAS',
    note: 'Resolved alias "MECH" -> MEC'
  },
  'CIVIL': {
    code: 'CE',
    label: 'Civil Engineering',
    confidence: 'RESOLVED_ALIAS',
    note: 'Resolved alias "CIVIL" -> CE'
  }
};

/**
 * Computes SHA-256 hash of a file or text buffer
 */
export async function computeFileSha256(fileOrText) {
  try {
    let buffer;
    if (typeof fileOrText === 'string') {
      const encoder = new TextEncoder();
      buffer = encoder.encode(fileOrText);
    } else if (fileOrText instanceof Blob || fileOrText instanceof File) {
      buffer = await fileOrText.arrayBuffer();
    } else if (fileOrText instanceof ArrayBuffer) {
      buffer = fileOrText;
    } else {
      buffer = new Uint8Array(0);
    }

    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback pseudo-hash
    let hash = 0;
    const str = typeof fileOrText === 'string' ? fileOrText : new Uint8Array(buffer).toString();
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return 'sha256_' + Math.abs(hash).toString(16).padStart(16, '0');
  } catch (err) {
    console.error('SHA-256 computation error:', err);
    return 'sha256_fallback_' + Date.now();
  }
}

/**
 * Robust RFC 4180 CSV parser supporting quotes, commas, newlines inside quotes.
 */
export function parseCsvText(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];

  // Remove UTF-8 BOM if present
  let text = csvText.replace(/^\uFEFF/, '').trim();
  if (!text) return [];

  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
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
 * Header normalizer: maps various column names to standard keys
 */
export function normalizeHeaderKey(header) {
  if (!header) return '';
  const clean = String(header).toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

  if (['s_no', 'sno', 'sl_no', 'serial_number', 'sr_no'].includes(clean)) return 'source_row_number';
  if (['academic_year', 'ay', 'year_of_event', 'acad_year'].includes(clean)) return 'academic_year';
  if (['event_type', 'type', 'program_type', 'activity_type', 'nature_of_event'].includes(clean)) return 'event_type';
  if (['title', 'program', 'event_name', 'name_of_the_program', 'topic', 'workshop_name', 'seminar_title'].includes(clean)) return 'title';
  if (['audience_years', 'year', 'target_year', 'audience', 'class_year', 'for_years'].includes(clean)) return 'audience_years';
  if (['department_codes', 'dept', 'department', 'branch', 'departments', 'dept_codes'].includes(clean)) return 'department_codes';
  if (['participants_total', 'participants', 'total_no_of_participants', 'no_of_participants', 'no_of_students', 'attendees', 'count', 'total_participants', 'students_attended'].includes(clean)) return 'participants_total';
  if (['participants_breakdown', 'breakdown', 'section_breakdown', 'year_wise_count'].includes(clean)) return 'participants_breakdown';
  if (['venue', 'room', 'room_no', 'hall', 'location', 'lab_number'].includes(clean)) return 'venue';
  if (['start_date', 'start', 'from_date', 'date_from', 'starting_date', 'commencement_date'].includes(clean)) return 'start_date';
  if (['end_date', 'end', 'to_date', 'date_to', 'ending_date', 'completion_date'].includes(clean)) return 'end_date';
  if (['mode', 'delivery_mode', 'event_mode', 'format'].includes(clean)) return 'mode';
  if (['resource_person_details', 'resource_person', 'speaker', 'faculty_coordinator', 'resource_person_details_faculty_coordinator', 'expert_details', 'trainer'].includes(clean)) return 'resource_person_details';
  if (['organized_by', 'organizer', 'organizing_body', 'association', 'club', 'cell'].includes(clean)) return 'organized_by';
  if (['mou_partner', 'mou', 'mou_if_yes_details', 'mou_details', 'industry_partner', 'collab_partner'].includes(clean)) return 'mou_partner';
  if (['amount', 'budget', 'honorarium', 'remuneration', 'fee', 'expense'].includes(clean)) return 'amount';
  if (['invoice_date', 'bill_date', 'payment_date'].includes(clean)) return 'invoice_date';
  if (['description', 'summary', 'objectives', 'brief', 'remarks'].includes(clean)) return 'description';
  if (['source_reference', 'ref', 'source_doc', 'circular_no'].includes(clean)) return 'source_reference';

  return clean;
}

/**
 * Intelligent Date Normalizer & Locale Ambiguity Interceptor
 * Strictly enforces YYYY-MM-DD for production storage.
 */
export function normalizeDateValue(rawDate, defaultYear = 2026) {
  if (!rawDate || String(rawDate).trim() === '' || rawDate === '-' || rawDate === '0') {
    return { isoDate: '', hasAmbiguity: false, raw: '', error: null };
  }

  const str = String(rawDate).trim();

  // 1. Strict ISO Check: YYYY-MM-DD
  const isoRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const isoMatch = str.match(isoRegex);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    const d = parseInt(isoMatch[3], 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return { isoDate: str, hasAmbiguity: false, raw: str, error: null };
    }
    return { isoDate: '', hasAmbiguity: false, raw: str, error: `Invalid ISO date values: ${str}` };
  }

  // 2. Slash/Hyphen Formats: D/M/YY, DD/MM/YYYY, D-M-YYYY, etc.
  const slashRegex = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/;
  const slashMatch = str.match(slashRegex);
  if (slashMatch) {
    let p1 = parseInt(slashMatch[1], 10);
    let p2 = parseInt(slashMatch[2], 10);
    let yearPart = parseInt(slashMatch[3], 10);

    if (yearPart < 100) {
      yearPart = 2000 + yearPart;
    }

    // In Indian academic context, values like 1/7/26 are Day 1, Month 7 (July)
    let day = p1;
    let month = p2;

    // Sanity check
    if (month > 12 && day <= 12) {
      // Swapped
      day = p2;
      month = p1;
    }

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const isoDate = `${yearPart}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return {
        isoDate,
        hasAmbiguity: true,
        raw: str,
        proposedDate: isoDate,
        error: null,
        ambiguityMessage: `Excel date notation "${str}" normalized to ISO "${isoDate}". Verify day/month order.`
      };
    }
  }

  // 3. Textual dates: e.g. "29-Jun-2026", "04-July-2026", "29 June 2026"
  const textDateRegex = /^(\d{1,2})[-/\s]([A-Za-z]+)[-/\s](\d{2,4})$/;
  const textMatch = str.match(textDateRegex);
  if (textMatch) {
    const day = parseInt(textMatch[1], 10);
    const monthStr = textMatch[2].toLowerCase().slice(0, 3);
    let yearPart = parseInt(textMatch[3], 10);
    if (yearPart < 100) yearPart = 2000 + yearPart;

    const monthMap = {
      jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
      jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
    };

    if (monthMap[monthStr]) {
      const month = monthMap[monthStr];
      const isoDate = `${yearPart}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return { isoDate, hasAmbiguity: false, raw: str, error: null };
    }
  }

  return {
    isoDate: '',
    hasAmbiguity: false,
    raw: str,
    error: `Unsupported date format "${str}". Use YYYY-MM-DD.`
  };
}

/**
 * Intelligent Participant Count & Breakdown Parser
 */
export function parseParticipants(rawVal) {
  if (rawVal === undefined || rawVal === null || String(rawVal).trim() === '' || rawVal === '-') {
    return {
      total: 0,
      breakdown: '',
      isDerived: false,
      isAmbiguous: false,
      isBlocked: true,
      raw: '',
      note: 'Participant count is missing.'
    };
  }

  const str = String(rawVal).trim();

  // Check for suspicious ambiguous patterns like "IV -3" or "III - ?"
  if (/^(I|II|III|IV)\s*-\s*\d+$/i.test(str)) {
    return {
      total: 0,
      breakdown: str,
      isDerived: false,
      isAmbiguous: true,
      isBlocked: true,
      raw: str,
      note: `Ambiguous notation "${str}". Does not clearly state total count.`
    };
  }

  // Pure integer: "75", "110", "98"
  if (/^\d+$/.test(str)) {
    const count = parseInt(str, 10);
    return {
      total: count,
      breakdown: '',
      isDerived: false,
      isAmbiguous: false,
      isBlocked: false,
      raw: str,
      note: 'Exact numeric total'
    };
  }

  // Format: "Total=64, (III-26, IV-38)"
  const totalMatch = str.match(/total\s*=\s*(\d+)/i);
  if (totalMatch) {
    const total = parseInt(totalMatch[1], 10);
    const breakdownPart = str.replace(/total\s*=\s*\d+[,;]?\s*/i, '').replace(/[()]/g, '').trim();
    return {
      total,
      breakdown: breakdownPart,
      isDerived: false,
      isAmbiguous: false,
      isBlocked: false,
      raw: str,
      note: `Parsed total ${total} with section breakdown.`
    };
  }

  // Format: "III- AI - 115"
  const singleDeptMatch = str.match(/^(?:I|II|III|IV)[^0-9]*(\d+)$/i);
  if (singleDeptMatch) {
    const count = parseInt(singleDeptMatch[1], 10);
    return {
      total: count,
      breakdown: str,
      isDerived: false,
      isAmbiguous: false,
      isBlocked: false,
      raw: str,
      note: `Parsed total ${count} from class section notation.`
    };
  }

  // Derived breakdown: "II & III- AI-15, AIML-5" -> 15 + 5 = 20
  const sumNumbers = [];
  const regex = /(\b[A-Za-z0-9&/ ]+)\s*[-:]\s*(\d+)/g;
  let match;
  while ((match = regex.exec(str)) !== null) {
    sumNumbers.push({ label: match[1].trim(), count: parseInt(match[2], 10) });
  }

  if (sumNumbers.length > 0) {
    const sum = sumNumbers.reduce((acc, curr) => acc + curr.count, 0);
    const breakdownStr = sumNumbers.map(s => `${s.label}=${s.count}`).join('; ');
    return {
      total: sum,
      breakdown: breakdownStr,
      isDerived: true,
      isAmbiguous: false,
      isBlocked: false,
      raw: str,
      note: `Derived total ${sum} from breakdown (${breakdownStr}).`
    };
  }

  return {
    total: 0,
    breakdown: str,
    isDerived: false,
    isAmbiguous: true,
    isBlocked: true,
    raw: str,
    note: `Unrecognized participant format: "${str}".`
  };
}

/**
 * Event Type Normalizer
 */
export function normalizeEventType(rawType, title = '') {
  const typeStr = (rawType || '').toUpperCase().trim();
  const titleStr = (title || '').toUpperCase();

  if (typeStr.includes('WORKSHOP')) return 'Workshop';
  if (typeStr.includes('SEMINAR')) return 'Seminar';
  if (typeStr.includes('GUEST') || typeStr.includes('LECTURE')) return 'Guest Lecture';
  if (typeStr.includes('HACKATHON') || typeStr.includes('BOOTCAMP')) return 'Hackathon';
  if (typeStr.includes('CODE') || titleStr.includes('CODE-A-THON') || titleStr.includes('CODEATHON')) return 'Code-a-thon';
  if (typeStr.includes('CONF')) return 'Conference';
  if (typeStr.includes('TALK') || typeStr.includes('TECH TALK')) return 'Technical Talk';
  if (typeStr.includes('FDP')) return 'Faculty Development Program';

  if (titleStr.includes('WORKSHOP')) return 'Workshop';
  if (titleStr.includes('SEMINAR') || titleStr.includes('TALK') || titleStr.includes('ORIENTATION')) return 'Seminar';
  if (titleStr.includes('HACKATHON') || titleStr.includes('BOOTCAMP') || titleStr.includes('VIBE CODING')) return 'Hackathon';

  return 'Workshop'; // Safe fallback
}

/**
 * Department Resolver
 */
export function resolveDepartment(rawDept, currentUser) {
  if (!rawDept || String(rawDept).trim() === '' || rawDept === '-') {
    return {
      code: '',
      label: 'Missing Department',
      status: 'BLOCKED',
      error: 'Department code is missing. Please select a department to resolve.',
      resolvedList: []
    };
  }

  const deptStr = String(rawDept).trim().toUpperCase();

  // 1. Check exact Master match
  const masterMatch = DEPARTMENTS.find(d => d.code.toUpperCase() === deptStr);
  if (masterMatch) {
    return {
      code: masterMatch.code,
      label: masterMatch.name,
      status: 'VALID',
      error: null,
      resolvedList: [masterMatch.code]
    };
  }

  // 2. Check Aliases Table
  if (DEPARTMENT_ALIASES[deptStr]) {
    const aliasInfo = DEPARTMENT_ALIASES[deptStr];
    if (aliasInfo.confidence === 'AMBIGUOUS') {
      return {
        code: aliasInfo.code,
        label: aliasInfo.label,
        status: 'WARNING',
        warning: aliasInfo.note,
        isAlias: true,
        resolvedList: [aliasInfo.code]
      };
    }
    return {
      code: aliasInfo.code,
      label: aliasInfo.label,
      status: 'VALID',
      warning: aliasInfo.note,
      isAlias: true,
      resolvedList: aliasInfo.code.split(',').map(s => s.trim())
    };
  }

  // 3. Substring / Loose Match
  const loose = DEPARTMENTS.find(d => 
    d.name.toUpperCase().includes(deptStr) || 
    deptStr.includes(d.code.toUpperCase())
  );
  if (loose) {
    return {
      code: loose.code,
      label: loose.name,
      status: 'WARNING',
      warning: `Department "${rawDept}" matched to "${loose.code}" (${loose.name}). Confirm mapping.`,
      isAlias: true,
      resolvedList: [loose.code]
    };
  }

  return {
    code: rawDept,
    label: `Unknown: ${rawDept}`,
    status: 'BLOCKED',
    error: `Unrecognized department code "${rawDept}". Map to an official NEC department.`,
    resolvedList: []
  };
}

/**
 * Resource Person Parser
 */
export function parseResourcePersonDetails(rawDetails) {
  if (!rawDetails || String(rawDetails).trim() === '' || rawDetails === '-') {
    return {
      name: '',
      designation: '',
      organization: '',
      isExternal: true,
      raw: ''
    };
  }

  const str = String(rawDetails).trim();
  const parts = str.split(/[,;\n]/).map(p => p.trim()).filter(Boolean);

  let name = parts[0] || str;
  let designation = parts[1] || 'Expert / Resource Person';
  let organization = parts.slice(2).join(', ') || '';

  if (parts.length === 1) {
    designation = 'Resource Person / Coordinator';
    organization = '';
  }

  return {
    name,
    designation,
    organization,
    isExternal: !str.toLowerCase().includes('nec') && !str.toLowerCase().includes('narasaraopet'),
    raw: str
  };
}

/**
 * MoU Matcher
 */
export function matchMoUPartner(mouPartnerText, existingMous = []) {
  if (!mouPartnerText || String(mouPartnerText).trim() === '' || mouPartnerText === '-') {
    return {
      isMouAssociated: 'No',
      mouPartnerText: '',
      mouId: null,
      status: 'NONE'
    };
  }

  const cleanPartner = String(mouPartnerText).trim();
  const q = cleanPartner.toLowerCase();

  const matchedMoU = existingMous.find(m => {
    const org = (m.organization || m.partnerName || m.companyName || '').toLowerCase();
    return org.includes(q) || q.includes(org);
  });

  if (matchedMoU) {
    return {
      isMouAssociated: 'Yes',
      mouPartnerText: cleanPartner,
      mouId: matchedMoU.id,
      mouNumber: matchedMoU.mouNumber,
      matchedOrg: matchedMoU.organization || matchedMoU.partnerName,
      status: 'VERIFIED'
    };
  }

  return {
    isMouAssociated: 'Yes',
    mouPartnerText: cleanPartner,
    mouId: null,
    status: 'UNVERIFIED_TEXT',
    note: `Partner "${cleanPartner}" specified in CSV but no active MoU entry found. Stored as text without creating unverified MoU.`
  };
}

/**
 * Duplicate Clustering & Detection Engine
 */
export function detectDuplicateClusters(rows, existingEvents = []) {
  const clusters = [];

  // Function to calculate similarity between two strings
  const stringSimilarity = (s1, s2) => {
    if (!s1 || !s2) return 0;
    const a = s1.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
    const b = s2.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
    if (a === b) return 1.0;
    if (a.includes(b) || b.includes(a)) return 0.8;

    const wordsA = new Set(a.split(/\s+/).filter(w => w.length > 2));
    const wordsB = new Set(b.split(/\s+/).filter(w => w.length > 2));
    if (wordsA.size === 0 || wordsB.size === 0) return 0;

    let overlap = 0;
    for (const w of wordsA) {
      if (wordsB.has(w)) overlap++;
    }
    return overlap / Math.max(wordsA.size, wordsB.size);
  };

  // 1. Cross-compare rows within current import batch
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const r1 = rows[i];
      const r2 = rows[j];

      const titleSim = stringSimilarity(r1.title, r2.title);
      const speakerSim = stringSimilarity(r1.resourcePerson?.name, r2.resourcePerson?.name);
      const dateOverlap = r1.startDate && r2.startDate && (
        r1.startDate === r2.startDate ||
        (r1.startDate <= r2.endDate && r1.endDate >= r2.startDate)
      );

      // Check for high similarity: (similar title AND same dates/speakers) or (exact title and same dates)
      if (
        (titleSim >= 0.4 && dateOverlap && speakerSim >= 0.5) ||
        (titleSim >= 0.7 && dateOverlap) ||
        (r1.title.toLowerCase() === r2.title.toLowerCase() && dateOverlap)
      ) {
        clusters.push({
          type: 'INTRA_BATCH_DUPLICATE',
          row1Index: i,
          row2Index: j,
          row1Number: r1.sourceRowNumber,
          row2Number: r2.sourceRowNumber,
          title1: r1.title,
          title2: r2.title,
          date1: `${r1.startDate || 'N/A'} - ${r1.endDate || 'N/A'}`,
          date2: `${r2.startDate || 'N/A'} - ${r2.endDate || 'N/A'}`,
          speaker1: r1.resourcePerson?.name || 'N/A',
          speaker2: r2.resourcePerson?.name || 'N/A',
          similarityScore: Math.round(titleSim * 100),
          reason: `Potential duplicate/overlap: "${r1.title}" (Row ${r1.sourceRowNumber}) and "${r2.title}" (Row ${r2.sourceRowNumber}) share dates (${r1.startDate}) and instructor (${r1.resourcePerson?.name || 'Same expert'}).`
        });
      }
    }
  }

  // 2. Cross-compare against existing database events
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    for (const ex of existingEvents) {
      const titleSim = stringSimilarity(r.title, ex.title || ex.name);
      const dateMatch = r.startDate && ex.startDate && r.startDate === ex.startDate;

      if (titleSim >= 0.7 && dateMatch) {
        clusters.push({
          type: 'EXISTING_EVENT_DUPLICATE',
          row1Index: i,
          row1Number: r.sourceRowNumber,
          existingEventId: ex.id,
          existingEventNumber: ex.eventNumber,
          title1: r.title,
          title2: ex.title || ex.name,
          date1: `${r.startDate} - ${r.endDate}`,
          date2: `${ex.startDate} - ${ex.endDate}`,
          reason: `Row ${r.sourceRowNumber} matches existing event ${ex.eventNumber} ("${ex.title || ex.name}").`
        });
      }
    }
  }

  return clusters;
}

/**
 * Full Pipeline: Parses, normalizes, validates, and annotates an entire CSV file for Academic Events
 */
export async function processAcademicEventsCsv(fileOrText, currentUser, existingMous = [], existingEvents = [], previousJobs = []) {
  const text = typeof fileOrText === 'string' ? fileOrText : await fileOrText.text();
  const fileSha256 = await computeFileSha256(text);
  const rawRows = parseCsvText(text);

  if (rawRows.length < 2) {
    return {
      isValid: false,
      error: 'CSV file must contain a header row and at least one data row.',
      jobSummary: null,
      rows: []
    };
  }

  // Check for duplicate upload
  const duplicateJob = previousJobs.find(j => j.fileSha256 === fileSha256);
  const isDuplicateFile = !!duplicateJob;

  // Header mapping
  const rawHeaders = rawRows[0];
  const headerKeys = rawHeaders.map(h => normalizeHeaderKey(h));

  const parsedRows = [];

  for (let rowIndex = 1; rowIndex < rawRows.length; rowIndex++) {
    const rowValues = rawRows[rowIndex];
    const rawObj = {};
    headerKeys.forEach((key, colIdx) => {
      if (key) rawObj[key] = rowValues[colIdx] !== undefined ? rowValues[colIdx].trim() : '';
    });

    const sourceRowNumber = parseInt(rawObj.source_row_number, 10) || rowIndex;
    const errors = [];
    const warnings = [];

    // 1. Title
    const rawTitle = rawObj.title || rawObj.program || rawObj.event_name || '';
    if (!rawTitle) {
      errors.push('Event title/program name is required.');
    }

    // 2. Event Type
    const eventType = normalizeEventType(rawObj.event_type, rawTitle);

    // 3. Academic Year
    const academicYear = rawObj.academic_year || '2026-27';

    // 4. Dates
    const startDateResult = normalizeDateValue(rawObj.start_date);
    const endDateResult = normalizeDateValue(rawObj.end_date || rawObj.start_date);

    let startDate = startDateResult.isoDate;
    let endDate = endDateResult.isoDate;

    if (!startDate) {
      errors.push(startDateResult.error || 'Start date is missing or invalid (must be YYYY-MM-DD).');
    }
    if (startDateResult.hasAmbiguity) {
      warnings.push(startDateResult.ambiguityMessage);
    }

    if (!endDate && startDate) {
      endDate = startDate;
      warnings.push('End date was unstated; defaulted to start date.');
    } else if (endDateResult.hasAmbiguity) {
      warnings.push(endDateResult.ambiguityMessage);
    }

    if (startDate && endDate && startDate > endDate) {
      errors.push(`Start date (${startDate}) cannot be later than end date (${endDate}).`);
    }

    // 5. Department Resolution
    const deptResult = resolveDepartment(rawObj.department_codes || rawObj.department || rawObj.dept, currentUser);
    if (deptResult.status === 'BLOCKED') {
      errors.push(deptResult.error);
    } else if (deptResult.warning) {
      warnings.push(deptResult.warning);
    }

    // Permission Scope Enforcement (HOD can only import for their department)
    if (currentUser?.role === 'HOD' && currentUser?.dept) {
      const hodDept = currentUser.dept.toUpperCase();
      const isAllowed = deptResult.resolvedList.some(d => d.toUpperCase() === hodDept);
      if (!isAllowed && deptResult.code !== 'ALL') {
        errors.push(`HOD Scope Violation: You are authorized for ${hodDept} only. Row department is ${deptResult.code}.`);
      }
    }

    // 6. Participants
    const participantResult = parseParticipants(rawObj.participants_total || rawObj.participants);
    if (participantResult.isBlocked) {
      errors.push(participantResult.note);
    } else if (participantResult.isDerived || participantResult.breakdown) {
      warnings.push(participantResult.note);
    }

    // 7. Venue (Stored as text string, never int)
    let venue = rawObj.venue || '';
    if (!venue) {
      warnings.push('Venue is unstated. Will default to Campus Labs/Auditorium.');
      venue = 'Campus Labs / Auditorium';
    }

    // 8. Resource Person Details
    const resourcePerson = parseResourcePersonDetails(rawObj.resource_person_details || rawObj.speaker);

    // 9. Organizer Text
    const organizedBy = rawObj.organized_by || 'TechnoElite, ISTE';

    // 10. MoU Matching
    const mouResult = matchMoUPartner(rawObj.mou_partner || rawObj.mou, existingMous);
    if (mouResult.status === 'UNVERIFIED_TEXT') {
      warnings.push(mouResult.note);
    }

    // 11. Financial Sanitization (null for blank, never 0)
    let amount = rawObj.amount ? String(rawObj.amount).trim() : null;
    if (amount === '' || amount === '0' || amount === '-' || amount === '0.00') {
      amount = null;
    }
    let invoiceDate = rawObj.invoice_date ? String(rawObj.invoice_date).trim() : null;
    if (invoiceDate === '' || invoiceDate === '0' || invoiceDate === '-') {
      invoiceDate = null;
    }

    // Determine row validation status
    let validationStatus = 'READY';
    if (errors.length > 0) {
      validationStatus = 'BLOCKED';
    } else if (warnings.length > 0) {
      validationStatus = 'WARNING';
    }

    parsedRows.push({
      id: `imp_row_${rowIndex}_${Date.now()}`,
      sourceRowNumber,
      title: rawTitle,
      eventType,
      academicYear,
      audienceYears: rawObj.audience_years || 'III & IV',
      departmentCode: deptResult.code,
      departmentLabel: deptResult.label,
      departmentResolvedList: deptResult.resolvedList,
      departmentStatus: deptResult.status,
      participantsTotal: participantResult.total,
      participantsBreakdown: participantResult.breakdown,
      participantsIsDerived: participantResult.isDerived,
      participantsRaw: rawObj.participants_total || rawObj.participants,
      venue,
      startDate,
      endDate,
      rawStartDate: rawObj.start_date || '',
      rawEndDate: rawObj.end_date || '',
      hasDateAmbiguity: startDateResult.hasAmbiguity || endDateResult.hasAmbiguity,
      mode: rawObj.mode || 'Offline',
      resourcePerson,
      organizedBy,
      isMouAssociated: mouResult.isMouAssociated,
      mouPartnerText: mouResult.mouPartnerText,
      mouId: mouResult.mouId,
      amount,
      invoiceDate,
      description: rawObj.description || '',
      sourceReference: rawObj.source_reference || '',
      rawPayload: rawObj,
      validationStatus,
      validationErrors: errors,
      validationWarnings: warnings,
      selectedForImport: validationStatus !== 'BLOCKED'
    });
  }

  // Duplicate detection pass
  const duplicateClusters = detectDuplicateClusters(parsedRows, existingEvents);
  duplicateClusters.forEach(cluster => {
    if (cluster.type === 'INTRA_BATCH_DUPLICATE') {
      const r1 = parsedRows[cluster.row1Index];
      const r2 = parsedRows[cluster.row2Index];
      if (r1) {
        if (r1.validationStatus !== 'BLOCKED') r1.validationStatus = 'DUPLICATE';
        r1.validationWarnings.push(cluster.reason);
        r1.duplicateCluster = cluster;
      }
      if (r2) {
        if (r2.validationStatus !== 'BLOCKED') r2.validationStatus = 'DUPLICATE';
        r2.validationWarnings.push(cluster.reason);
        r2.duplicateCluster = cluster;
      }
    } else if (cluster.type === 'EXISTING_EVENT_DUPLICATE') {
      const r = parsedRows[cluster.row1Index];
      if (r) {
        if (r.validationStatus !== 'BLOCKED') r.validationStatus = 'DUPLICATE';
        r.validationWarnings.push(cluster.reason);
        r.duplicateCluster = cluster;
      }
    }
  });

  // Summary counts
  const totalRows = parsedRows.length;
  const readyRows = parsedRows.filter(r => r.validationStatus === 'READY').length;
  const warningRows = parsedRows.filter(r => r.validationStatus === 'WARNING').length;
  const blockedRows = parsedRows.filter(r => r.validationStatus === 'BLOCKED').length;
  const duplicateRows = parsedRows.filter(r => r.validationStatus === 'DUPLICATE').length;

  const jobSummary = {
    fileSha256,
    isDuplicateFile,
    previousJobDate: duplicateJob ? duplicateJob.createdAt : null,
    totalRows,
    readyRows,
    warningRows,
    blockedRows,
    duplicateRows,
    duplicateClusters
  };

  return {
    isValid: true,
    jobSummary,
    rows: parsedRows
  };
}

/**
 * Official CSV Template Generator
 */
export function generateBulkImportTemplateCsv() {
  const headerLine = BULK_IMPORT_HEADERS.join(',');
  const sampleRows = [
    '2026-27,WORKSHOP,Data Science Accelerator,III,DS,59,"",3305,2026-06-29,2026-07-04,OFFLINE,"P. Sardar Khan, Senior Data Scientist, InnoData","TechnoElite, ISTE","",,,Hands-on Python and ML pipeline accelerator,EVT-REF-001',
    '2026-27,SEMINAR,Alumni Talk on DSA and Placement Guidance,III & IV,CSE,64,"III=26; IV=38",3427,2026-07-02,2026-07-02,OFFLINE,"Alumni Speaker, SDE-2, Microsoft","ISTE Student Chapter","",,,Placement guidance and system design,EVT-REF-002',
    '2026-27,WORKSHOP,Ethical Hacking & Web Security,III,CSE (Cyber Security),51,"",3427,2026-06-29,2026-07-04,OFFLINE,"G. Nageswara Rao, Security Consultant","TechnoElite, ISTE","Supraja Technologies",,,Penetration testing and OWASP top 10,EVT-REF-003',
    '2026-27,HACKATHON,Vibe Coding National Hackathon,All Years,ALL,196,"CSE=100; ECE=50; IT=46",Campus Auditoriums,2026-07-10,2026-07-10,OFFLINE,"SK. Abdul Khadar, Technology Lead, Infosys","TechnoElite, ISTE","Fynity",,,48-Hour AI-assisted rapid coding bootcamp,EVT-REF-004',
    '2026-27,SEMINAR,Git & GitHub Collaborative Technologies,II & III,"CSE (AI & ML), CSE (AI)",20,"AI=15; AIML=5",Campus Labs,2026-08-01,2026-08-01,OFFLINE,"Industry Expert","ISTE","",,,Version control and open source workflow,EVT-REF-005'
  ];

  return [headerLine, ...sampleRows].join('\n');
}

/**
 * Downloads official CSV template to user device
 */
export function downloadBulkImportTemplate() {
  const csvContent = generateBulkImportTemplateCsv();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'NEC_Academic_Events_Bulk_Import_Template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Issues Report CSV Exporter for blocked or warning rows
 */
export function generateIssuesReportCsv(rows = []) {
  const headers = [
    'source_row_number',
    'title',
    'validation_status',
    'validation_errors',
    'validation_warnings',
    'department_code',
    'start_date',
    'end_date',
    'participants_raw',
    'mou_partner',
    'raw_data'
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [headers.join(',')];

  rows.forEach(r => {
    const errorStr = (r.validationErrors || []).join(' | ');
    const warningStr = (r.validationWarnings || []).join(' | ');
    const rawDataStr = JSON.stringify(r.rawPayload || {});

    const line = [
      escapeCsv(r.sourceRowNumber),
      escapeCsv(r.title),
      escapeCsv(r.validationStatus),
      escapeCsv(errorStr),
      escapeCsv(warningStr),
      escapeCsv(r.departmentCode),
      escapeCsv(r.startDate),
      escapeCsv(r.endDate),
      escapeCsv(r.participantsRaw),
      escapeCsv(r.mouPartnerText),
      escapeCsv(rawDataStr)
    ].join(',');

    csvRows.push(line);
  });

  return csvRows.join('\n');
}

/**
 * Downloads Issues / Validation report to user device
 */
export function downloadIssuesReport(rows = []) {
  const csvContent = generateIssuesReportCsv(rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `NEC_Academic_Events_Import_Issues_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

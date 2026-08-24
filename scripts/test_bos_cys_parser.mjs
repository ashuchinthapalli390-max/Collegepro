import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const pkgDir = 'd:/nec portal/data/NEC_CYS_BoS_Package';
const csvPath = path.join(pkgDir, 'NEC_CYS_BoS_All_Meetings_Website_Import.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse RFC 4180 multiline CSV
function parseRFC4180CSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
      continue;
    }

    if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      currentField = '';
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(c => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

const allRows = parseRFC4180CSV(csvContent);
const headers = allRows[0];
const rawRecords = allRows.slice(1).map(row => {
  const obj = {};
  headers.forEach((h, idx) => {
    obj[h] = row[idx] || '';
  });
  return obj;
});

// PDF mapping reference
const PDF_MAP = {
  'BOS-CYS-R23-01': {
    filename: '01_R23_1st_BoS_CYS_2023-09-26.pdf',
    sha256: '1d4cc612e02f8e595ab8475384c30a170ff7f9f0f8757676134b0ae62f0f5f69',
    sizeBytes: 4889167
  },
  'BOS-CYS-R23-02': {
    filename: '02_R23_2nd_BoS_CYS_2024-07-09.pdf',
    sha256: 'aaa481ce3241e79f8d5a8a955be9bd196f5f113e33485c98ca016dfc5ad280ef',
    sizeBytes: 4097445
  },
  'BOS-CYS-R23-03': {
    filename: '03_R23_3rd_BoS_CYS_2025-07-12.pdf',
    sha256: '889c9a3c4a10a188f5b88128a2430bb7fe134868e81e148e806472922309330c',
    sizeBytes: 4740600
  },
  'BOS-CYS-R23-04': {
    filename: '04_R23_4th_BoS_CYS_2026-02-21.pdf',
    sha256: '3c64980ae5df2375287cc54ed33c904b413d8d45d57c8a2b23a2ea9d1ac532ce',
    sizeBytes: 1883773
  }
};

export function normalizeBoSRecord(raw, index) {
  const isR20 = raw.regulation_codes === 'R20';
  const sourceKey = raw.meeting_source_key || `BOS-CYS-${raw.regulation_codes || 'R23'}-${String(index + 1).padStart(2, '0')}`;
  
  // Department mapping: CYS -> CSE (Cyber Security)
  const deptCode = 'CSE (Cyber Security)';
  const deptShort = 'CYS';
  
  // Parse members JSON
  let members = [];
  try {
    members = raw.member_list_json ? JSON.parse(raw.member_list_json) : [];
  } catch (e) {
    console.error(`Failed to parse members for ${sourceKey}:`, e.message);
  }

  // Categorize members for child entities & backward compatibility
  let chairman = raw.chairperson || '';
  let universityNominee = null;
  const academicians = [];
  let industryMember = null;
  let alumniMember = null;
  const facultyMembers = [];

  members.forEach(m => {
    const type = (m.member_type || m.category || '').toUpperCase();
    const inst = m.organization || m.institution || '';
    const desig = m.designation || '';

    if (type.includes('CHAIRMAN') || type.includes('CHAIRPERSON')) {
      if (!chairman) chairman = m.name;
    } else if (type.includes('UNIVERSITY') || type.includes('NOMINEE')) {
      if (!universityNominee) {
        universityNominee = { name: m.name, institution: inst, designation: desig, email: m.email || '', phone: m.phone || '' };
      }
    } else if (type.includes('ACADEMIC') || type.includes('EXPERT') || type.includes('SUBJECT')) {
      academicians.push({ name: m.name, institution: inst, designation: desig, email: m.email || '', phone: m.phone || '' });
    } else if (type.includes('INDUSTRY')) {
      if (!industryMember) {
        industryMember = { name: m.name, company: inst, designation: desig, email: m.email || '', phone: m.phone || '' };
      }
    } else if (type.includes('ALUMNI')) {
      if (!alumniMember) {
        alumniMember = { name: m.name, company: inst, designation: desig, email: m.email || '', phone: m.phone || '' };
      }
    } else if (type.includes('INTERNAL') || type.includes('FACULTY') || type.includes('MEMBER')) {
      facultyMembers.push(m.name);
    }
  });

  // Parse agenda items JSON
  let agendaItems = [];
  try {
    const rawAgenda = raw.agenda_items_json ? JSON.parse(raw.agenda_items_json) : [];
    agendaItems = rawAgenda.map((item, i) => {
      if (typeof item === 'string') {
        return { itemNo: i + 1, title: item, description: item, decision: '' };
      }
      return {
        itemNo: item.item_no || item.itemNo || i + 1,
        title: item.title || item.agenda_title || `Agenda Item ${i + 1}`,
        description: item.description || item.agenda_description || item.title || '',
        decision: item.decision || ''
      };
    });
  } catch (e) {
    console.error(`Failed to parse agenda for ${sourceKey}:`, e.message);
  }

  // Parse resolutions JSON
  let resolutions = [];
  try {
    const rawRes = raw.resolutions_json ? JSON.parse(raw.resolutions_json) : [];
    resolutions = rawRes.map((res, i) => {
      if (typeof res === 'string') {
        return { resolutionNumber: i + 1, title: `Resolution ${i + 1}`, resolutionText: res, agendaRef: '' };
      }
      return {
        resolutionNumber: res.resolution_no || res.resolutionNumber || i + 1,
        title: res.title || `Resolution ${i + 1}`,
        resolutionText: res.resolution_text || res.text || res.description || '',
        agendaRef: res.agenda_ref || ''
      };
    });
  } catch (e) {
    console.error(`Failed to parse resolutions for ${sourceKey}:`, e.message);
  }

  // Attach PDF documents if matched
  const documents = [];
  const pdfInfo = PDF_MAP[sourceKey];
  if (pdfInfo) {
    documents.push({
      id: `doc_${sourceKey.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      title: `${raw.meeting_title} (Official Signed Minutes)`,
      filename: pdfInfo.filename,
      type: 'MINUTES',
      documentType: 'MINUTES_PACKAGE',
      containsAgenda: true,
      containsAttendance: true,
      containsMeetingEvidence: true,
      storagePath: `/documents/bos/cse-cys/${pdfInfo.filename}`,
      downloadUrl: `/documents/bos/cse-cys/${pdfInfo.filename}`,
      sizeBytes: pdfInfo.sizeBytes,
      sha256: pdfInfo.sha256,
      visibility: 'PRIVATE',
      version: 'v1.0',
      uploadedAt: '2026-08-24T00:00:00.000Z',
      uploadedBy: 'BoS Package Importer'
    });
  }

  const cleanYear = raw.academic_year || (raw.meeting_date ? `${raw.meeting_date.slice(0, 4)}-${Number(raw.meeting_date.slice(2, 4)) + 1}` : '2023-24');

  return {
    id: `bos_cys_${raw.regulation_codes?.toLowerCase() || 'r23'}_${String(index + 1).padStart(2, '0')}`,
    bosNumber: sourceKey,
    meetingSourceKey: sourceKey,
    department: deptCode,
    departmentCode: deptShort,
    departmentName: raw.department_name || 'CSE (Cyber Security)',
    academicYear: cleanYear,
    targetYear: raw.target_year || 'All Years',
    title: raw.meeting_title,
    bosDate: raw.meeting_date,
    meetingDate: raw.meeting_date,
    startTime: raw.meeting_time ? `${raw.meeting_time} ${Number(raw.meeting_time.split(':')[0]) < 12 ? 'AM' : 'PM'}` : '10:00 AM',
    endTime: raw.meeting_time ? `${Number(raw.meeting_time.split(':')[0]) + 3}:00 PM` : '01:00 PM',
    meetingMode: raw.meeting_mode || (isR20 ? 'Offline' : 'Online'),
    venue: raw.platform ? `${raw.platform} (Online)` : (isR20 ? 'CSE Department Conference Hall' : 'Online Microsoft Teams'),
    platform: raw.platform || '',
    privateMeetingLink: raw.private_meeting_link || '',
    circularReference: raw.circular_reference || '',
    circularDate: raw.circular_date || '',
    regulations: raw.regulation_codes ? [raw.regulation_codes] : ['R23'],
    regulationCodes: raw.regulation_codes || 'R23',
    regulationMeetingNumber: Number(raw.regulation_meeting_number) || (index + 1),
    meetingStatus: 'HELD',
    workflowStatus: isR20 ? 'DRAFT' : 'DRAFT', // Strictly DRAFT
    status: isR20 ? 'Needs Review' : 'Draft',
    sourceConfidence: raw.source_confidence || (isR20 ? 'LIMITED_XLSX_ONLY' : 'HIGH'),
    reviewNotes: raw.review_notes || '',
    version: 1,
    chairmanType: 'INTERNAL',
    chairman: chairman || 'Dr. V. V. A. S. Lakshmi (Professor & HOD, CSE (Cyber Security))',
    chairperson: chairman || 'Dr. V. V. A. S. Lakshmi',
    members,
    universityNominee,
    academicians,
    industryMember,
    alumniMember,
    facultyMembers,
    agendaItems,
    resolutions,
    documents,
    approvalHistory: [
      {
        action: 'BOS_BULK_IMPORTED',
        fromStatus: null,
        toStatus: 'DRAFT',
        actor: 'Bulk Data Center (System Ingestion)',
        comments: isR20 
          ? 'Imported summary R20 record from XLSX staging. Marked DRAFT / NEEDS_REVIEW for missing minutes.' 
          : `Imported official R23 record with ${members.length} members, ${agendaItems.length} agenda items, and ${documents.length} linked PDF minutes package.`,
        timestamp: new Date().toISOString()
      }
    ],
    sourceType: 'BULK_IMPORT',
    sourceFiles: raw.source_files || '',
    sourceSha256Json: raw.source_sha256_json ? JSON.parse(raw.source_sha256_json) : null,
    publicVisibility: 'INTERNAL_ONLY',
    isVerified: !isR20,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

console.log('Testing normalization on all 6 rows...');
const normalizedRecords = rawRecords.map((r, i) => normalizeBoSRecord(r, i));
console.log(`Successfully normalized ${normalizedRecords.length} BoS records:`);
normalizedRecords.forEach(nr => {
  console.log(`\n• [${nr.bosNumber}] "${nr.title}"`);
  console.log(`   Dept: ${nr.department} | Reg: ${nr.regulationCodes} | Date: ${nr.bosDate} | Status: ${nr.workflowStatus}`);
  console.log(`   Members: ${nr.members.length} | Agenda: ${nr.agendaItems.length} | Resolutions: ${nr.resolutions.length} | Documents: ${nr.documents.length}`);
  console.log(`   Confidence: ${nr.sourceConfidence}`);
  if (nr.reviewNotes) console.log(`   Notes: ${nr.reviewNotes}`);
});

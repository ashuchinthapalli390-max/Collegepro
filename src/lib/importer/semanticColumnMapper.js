/**
 * ET Portal - Semantic Column Mapper
 * Provides schema definitions and alias dictionaries for all portal domains.
 * Automatically aligns user header variations (e.g. HTNO -> rollNumber)
 * and computes mapping confidence scores.
 */

export const MODULE_CANONICAL_SCHEMAS = {
  // 1. Student Master
  students: {
    key: 'students',
    title: 'Student Master Directory',
    category: 'Students',
    primaryKey: 'rollNumber',
    destinationKey: 'STUDENTS',
    fields: [
      { key: 'rollNumber', label: 'Roll Number / HTNO', required: true, type: 'string', aliases: ['roll no', 'roll number', 'htno', 'hall ticket no', 'hall ticket number', 'regd no', 'registration no', 'reg no', 'pin', 'pin no', 'student id', 'admn no', 'admission no'] },
      { key: 'name', label: 'Student Full Name', required: true, type: 'string', aliases: ['student name', 'name', 'full name', 'name of student', 'candidate name', 'student_name'] },
      { key: 'department', label: 'Department / Branch', required: true, type: 'department', aliases: ['department', 'dept', 'branch', 'course', 'specialization', 'dept code', 'department code'] },
      { key: 'year', label: 'Year of Study (I-IV)', required: true, type: 'string', aliases: ['year', 'year of study', 'class year', 'curr year', 'academic year class'] },
      { key: 'semester', label: 'Semester (I/II)', required: false, type: 'string', aliases: ['semester', 'sem', 'current sem'] },
      { key: 'section', label: 'Section (A/B/C)', required: true, type: 'string', aliases: ['section', 'sec', 'class section'] },
      { key: 'batch', label: 'Academic Batch / AY', required: false, type: 'string', aliases: ['batch', 'admission batch', 'academic year', 'ay', 'joining year'] },
      { key: 'gender', label: 'Gender', required: false, type: 'string', aliases: ['gender', 'sex'] },
      { key: 'email', label: 'Student Email', required: false, type: 'email', aliases: ['email', 'student email', 'email id', 'college email', 'mail'] },
      { key: 'phone', label: 'Student Mobile', required: false, type: 'phone', aliases: ['phone', 'mobile', 'mobile no', 'contact no', 'phone number', 'student mobile'] },
      { key: 'fatherName', label: 'Father / Guardian Name', required: false, type: 'string', aliases: ['father name', 'father', 'guardian name', 'parent name', 'father_name'] },
      { key: 'guardianPhone', label: 'Parent / Guardian Phone', required: false, type: 'phone', aliases: ['parent phone', 'parent mobile', 'guardian phone', 'guardian mobile', 'father mobile', 'emergency contact'] }
    ]
  },

  // 2. Attendance Snapshots & Risk
  attendance: {
    key: 'attendance',
    title: 'Monthly Attendance Records',
    category: 'Students',
    primaryKey: 'rollNumber',
    destinationKey: 'ATTENDANCE_SNAPSHOTS',
    fields: [
      { key: 'rollNumber', label: 'Roll Number / HTNO', required: true, type: 'string', aliases: ['roll no', 'roll number', 'htno', 'regd no', 'reg no', 'pin', 'student id'] },
      { key: 'studentName', label: 'Student Name', required: true, type: 'string', aliases: ['student name', 'name', 'full name', 'name of the student'] },
      { key: 'department', label: 'Department Code', required: true, type: 'department', aliases: ['department', 'dept', 'branch', 'specialization'] },
      { key: 'year', label: 'Year (I/II/III/IV)', required: true, type: 'string', aliases: ['year', 'class year', 'study year'] },
      { key: 'semester', label: 'Semester', required: false, type: 'string', aliases: ['semester', 'sem'] },
      { key: 'section', label: 'Section', required: true, type: 'string', aliases: ['section', 'sec'] },
      { key: 'academicYear', label: 'Academic Year', required: true, type: 'string', aliases: ['academic year', 'ay', 'year of study'] },
      { key: 'month', label: 'Attendance Month', required: true, type: 'string', aliases: ['month', 'attendance month', 'period', 'assessment month'] },
      { key: 'classesConducted', label: 'Classes Conducted (Total)', required: false, type: 'number', aliases: ['conducted', 'total classes', 'total periods', 'classes held', 'max classes', 'held'] },
      { key: 'classesAttended', label: 'Classes Attended', required: false, type: 'number', aliases: ['attended', 'classes attended', 'periods attended', 'present'] },
      { key: 'attendancePercentage', label: 'Attendance Percentage (%)', required: true, type: 'percentage', aliases: ['percentage', 'attendance %', 'overall %', 'total percentage', 'att %', '% of attendance', 'attendance percentage', 'percent'] },
      { key: 'guardianName', label: 'Parent / Guardian Name', required: false, type: 'string', aliases: ['parent name', 'guardian name', 'father name', 'parent'] },
      { key: 'guardianPhone', label: 'Guardian Contact Number', required: false, type: 'phone', aliases: ['parent phone', 'parent mobile', 'guardian mobile', 'guardian phone', 'contact number'] }
    ]
  },

  // 3. Academic Events & Workshops
  academic_events: {
    key: 'academic_events',
    title: 'Workshops, Hackathons & Seminars',
    category: 'Events',
    primaryKey: 'title',
    destinationKey: 'EVENTS',
    fields: [
      { key: 'title', label: 'Program / Workshop Title', required: true, type: 'string', aliases: ['title', 'program name', 'event title', 'workshop name', 'event name', 'topic', 'name of event'] },
      { key: 'eventType', label: 'Event Type', required: true, type: 'string', aliases: ['event type', 'type', 'category', 'activity type', 'nature of event'] },
      { key: 'department', label: 'Department / Target Branch', required: true, type: 'department', aliases: ['department', 'dept', 'branch', 'target dept', 'departments'] },
      { key: 'academicYear', label: 'Academic Year', required: true, type: 'string', aliases: ['academic year', 'ay', 'year'] },
      { key: 'startDate', label: 'Start Date (YYYY-MM-DD)', required: true, type: 'date', aliases: ['start date', 'from date', 'commencement date', 'date from', 'date'] },
      { key: 'endDate', label: 'End Date (YYYY-MM-DD)', required: false, type: 'date', aliases: ['end date', 'to date', 'conclusion date', 'date to'] },
      { key: 'totalParticipants', label: 'Participant Count', required: false, type: 'number', aliases: ['participants', 'total participants', 'student count', 'attendees', 'count', 'no of participants'] },
      { key: 'sectionBreakdown', label: 'Sections / Year Breakdown', required: false, type: 'string', aliases: ['sections', 'section breakdown', 'target class', 'target sections', 'audience'] },
      { key: 'venue', label: 'Venue / Hall', required: false, type: 'string', aliases: ['venue', 'location', 'hall', 'room no', 'lab'] },
      { key: 'resourcePerson', label: 'Resource Person / Expert Details', required: false, type: 'string', aliases: ['resource person', 'speaker', 'expert', 'trainer', 'resource person details', 'guest'] },
      { key: 'organizedBy', label: 'Organized By / Coordinator', required: false, type: 'string', aliases: ['coordinator', 'organized by', 'faculty coordinator', 'convener'] },
      { key: 'mouPartner', label: 'Industry MoU Partner', required: false, type: 'string', aliases: ['mou partner', 'partner company', 'industry tie-up', 'collaborator'] },
      { key: 'budgetAmount', label: 'Financial Budget / Expense', required: false, type: 'currency', aliases: ['budget', 'amount', 'expenditure', 'sanctioned amount', 'financial grant'] }
    ]
  },

  // 4. Campus Placements
  campus_placements: {
    key: 'campus_placements',
    title: 'Campus Placements & Offers',
    category: 'Career',
    primaryKey: 'rollNumber',
    destinationKey: 'CAMPUS_PLACEMENTS',
    fields: [
      { key: 'rollNumber', label: 'Student Roll Number', required: true, type: 'string', aliases: ['roll no', 'htno', 'regd no', 'roll number', 'student id', 'student roll'] },
      { key: 'studentName', label: 'Student Name', required: true, type: 'string', aliases: ['student name', 'name', 'candidate name', 'full name'] },
      { key: 'department', label: 'Department', required: true, type: 'department', aliases: ['department', 'dept', 'branch', 'specialization'] },
      { key: 'academicYear', label: 'Academic Year / Passout Batch', required: true, type: 'string', aliases: ['academic year', 'batch', 'passout year', 'graduating year', 'ay'] },
      { key: 'companyName', label: 'Company / Recruiter Name', required: true, type: 'string', aliases: ['company', 'company name', 'recruiter', 'employer', 'organization', 'hiring company'] },
      { key: 'packageLpa', label: 'Salary Package (LPA in ₹)', required: true, type: 'currency', aliases: ['package', 'package (lpa)', 'ctc', 'salary', 'ctc in lpa', 'lpa', 'salary package', 'annual package'] },
      { key: 'jobRole', label: 'Designation / Job Role', required: false, type: 'string', aliases: ['designation', 'job role', 'profile', 'role', 'position'] },
      { key: 'placementType', label: 'Placement Type (On/Off Campus)', required: false, type: 'string', aliases: ['type', 'placement type', 'drive type', 'campus type', 'on/off campus'] },
      { key: 'offerDate', label: 'Offer / Selection Date', required: false, type: 'date', aliases: ['offer date', 'selection date', 'drive date', 'date of offer', 'placed date'] },
      { key: 'offerLetterRef', label: 'Offer Letter Ref / Number', required: false, type: 'string', aliases: ['offer letter no', 'ref no', 'offer id', 'reference'] }
    ]
  },

  // 5. Companies Visited
  companies_visited: {
    key: 'companies_visited',
    title: 'Companies Visited & Drives',
    category: 'Career',
    primaryKey: 'companyName',
    destinationKey: 'COMPANY_VISITS',
    fields: [
      { key: 'companyName', label: 'Company Name', required: true, type: 'string', aliases: ['company name', 'company', 'organization', 'recruiter name', 'employer'] },
      { key: 'visitDate', label: 'Drive / Visit Date', required: true, type: 'date', aliases: ['drive date', 'visit date', 'date of visit', 'recruitment date', 'date'] },
      { key: 'academicYear', label: 'Academic Year', required: true, type: 'string', aliases: ['academic year', 'ay', 'batch year'] },
      { key: 'eligibleDepartments', label: 'Eligible Departments', required: true, type: 'string', aliases: ['eligible departments', 'eligible branches', 'branches', 'depts', 'departments eligible'] },
      { key: 'packageMax', label: 'Highest Package (LPA)', required: false, type: 'currency', aliases: ['max package', 'highest package', 'package max', 'top ctc', 'highest ctc'] },
      { key: 'packageMin', label: 'Minimum / Base Package (LPA)', required: false, type: 'currency', aliases: ['min package', 'base ctc', 'package min', 'average package', 'ctc'] },
      { key: 'studentsSelected', label: 'Students Selected (Total)', required: false, type: 'number', aliases: ['selected', 'total selected', 'students placed', 'offers made', 'selections'] },
      { key: 'driveMode', label: 'Drive Mode (On-Campus/Virtual)', required: false, type: 'string', aliases: ['mode', 'drive mode', 'virtual/physical', 'location'] }
    ]
  },

  // 6. Community Service Projects
  community_projects: {
    key: 'community_projects',
    title: 'Community Service Projects',
    category: 'Students',
    primaryKey: 'projectTitle',
    destinationKey: 'COMMUNITY_PROJECTS',
    fields: [
      { key: 'projectTitle', label: 'Project Title / Social Initiative', required: true, type: 'string', aliases: ['project title', 'title', 'initiative name', 'activity title', 'service project'] },
      { key: 'department', label: 'Department', required: true, type: 'department', aliases: ['department', 'dept', 'branch'] },
      { key: 'academicYear', label: 'Academic Year', required: true, type: 'string', aliases: ['academic year', 'ay', 'year'] },
      { key: 'targetVillage', label: 'Target Village / Community Location', required: true, type: 'string', aliases: ['village', 'location', 'adopted village', 'community', 'place', 'target area'] },
      { key: 'studentLeader', label: 'Student Team Leader', required: true, type: 'string', aliases: ['team leader', 'student leader', 'student name', 'leader roll', 'lead'] },
      { key: 'teamSize', label: 'Number of Student Volunteers', required: false, type: 'number', aliases: ['team size', 'students count', 'volunteers', 'no of students'] },
      { key: 'facultyMentor', label: 'Faculty Mentor / Guide', required: true, type: 'string', aliases: ['faculty mentor', 'guide', 'coordinator', 'faculty guide', 'mentor'] },
      { key: 'durationDays', label: 'Project Duration (Days/Weeks)', required: false, type: 'string', aliases: ['duration', 'days', 'period', 'duration in days'] },
      { key: 'beneficiaryCount', label: 'Beneficiary Count (Estimated)', required: false, type: 'number', aliases: ['beneficiaries', 'people impacted', 'impact count', 'villagers served'] }
    ]
  },

  // 7. Research Publications
  publications: {
    key: 'publications',
    title: 'Research Publications',
    category: 'Research',
    primaryKey: 'title',
    destinationKey: 'PUBLICATIONS',
    fields: [
      { key: 'title', label: 'Publication / Paper Title', required: true, type: 'string', aliases: ['title', 'paper title', 'article title', 'manuscript title', 'publication title'] },
      { key: 'authors', label: 'Authors List', required: true, type: 'string', aliases: ['authors', 'author names', 'author list', 'faculty author', 'all authors', 'name of authors'] },
      { key: 'department', label: 'Department Code', required: true, type: 'department', aliases: ['department', 'dept', 'branch'] },
      { key: 'publicationType', label: 'Type (Journal / Conference)', required: true, type: 'string', aliases: ['type', 'publication type', 'journal/conference', 'category'] },
      { key: 'journalName', label: 'Journal / Conference Name', required: true, type: 'string', aliases: ['journal name', 'journal', 'conference name', 'conference', 'publisher', 'venue'] },
      { key: 'publicationYear', label: 'Publication Year', required: true, type: 'string', aliases: ['year', 'publication year', 'pub year', 'year of publication'] },
      { key: 'doi', label: 'DOI / Digital Object Identifier', required: false, type: 'string', aliases: ['doi', 'doi link', 'doi url', 'digital object identifier'] },
      { key: 'issn', label: 'ISSN / ISBN Number', required: false, type: 'string', aliases: ['issn', 'isbn', 'eissn', 'issn number'] },
      { key: 'isScopusIndexed', label: 'Scopus Indexed (Yes/No)', required: false, type: 'boolean', aliases: ['scopus', 'scopus indexed', 'is scopus', 'scopus (yes/no)'] },
      { key: 'isWosIndexed', label: 'Web of Science (Yes/No)', required: false, type: 'boolean', aliases: ['wos', 'web of science', 'wos indexed', 'sci', 'scie'] }
    ]
  },

  // 8. Patents & IPR
  patents: {
    key: 'patents',
    title: 'Patents & IPR Records',
    category: 'Research',
    primaryKey: 'patentTitle',
    destinationKey: 'PATENTS',
    fields: [
      { key: 'patentTitle', label: 'Patent Title / Invention', required: true, type: 'string', aliases: ['patent title', 'title', 'title of patent', 'invention title', 'name of patent'] },
      { key: 'applicationNumber', label: 'Application / Patent Number', required: true, type: 'string', aliases: ['application no', 'application number', 'patent no', 'patent number', 'appl no', 'cbr no'] },
      { key: 'inventors', label: 'Inventors List', required: true, type: 'string', aliases: ['inventors', 'inventor names', 'applicant', 'applicants', 'authors'] },
      { key: 'department', label: 'Department', required: true, type: 'department', aliases: ['department', 'dept', 'branch'] },
      { key: 'filingDate', label: 'Filing Date (YYYY-MM-DD)', required: true, type: 'date', aliases: ['filing date', 'date of filing', 'applied date', 'filing'] },
      { key: 'publishedDate', label: 'Publication Date (YYYY-MM-DD)', required: false, type: 'date', aliases: ['publication date', 'date of publication', 'published date', 'journal pub date'] },
      { key: 'grantedDate', label: 'Grant Date (YYYY-MM-DD)', required: false, type: 'date', aliases: ['grant date', 'date of grant', 'granted date', 'award date'] },
      { key: 'legalStatus', label: 'Legal Status (Filed / Published / Granted)', required: true, type: 'string', aliases: ['status', 'patent status', 'legal status', 'stage'] }
    ]
  },

  // 9. Faculty Memberships
  faculty_memberships: {
    key: 'faculty_memberships',
    title: 'Faculty Professional Memberships',
    category: 'Faculty',
    primaryKey: 'membershipNumber',
    destinationKey: 'MEMBERSHIPS',
    fields: [
      { key: 'facultyName', label: 'Faculty Name', required: true, type: 'string', aliases: ['faculty name', 'name of faculty', 'faculty', 'professor name', 'member name'] },
      { key: 'facultyId', label: 'Faculty ID / Employee Code', required: false, type: 'string', aliases: ['faculty id', 'emp id', 'employee id', 'staff id'] },
      { key: 'department', label: 'Department', required: true, type: 'department', aliases: ['department', 'dept', 'branch'] },
      { key: 'societyName', label: 'Professional Body (IEEE, ISTE, ACM, CSI)', required: true, type: 'string', aliases: ['society', 'professional body', 'society name', 'association', 'organization'] },
      { key: 'membershipNumber', label: 'Membership ID / Number', required: true, type: 'string', aliases: ['membership no', 'membership id', 'membership number', 'member id', 'member no'] },
      { key: 'membershipType', label: 'Type (Life / Annual / Senior Member)', required: false, type: 'string', aliases: ['membership type', 'grade', 'membership grade', 'type'] },
      { key: 'validityStatus', label: 'Validity (ACTIVE / LIFETIME / EXPIRED)', required: false, type: 'string', aliases: ['validity', 'status', 'validity status', 'active/expired'] }
    ]
  },

  // 10. Board of Studies
  bos_meetings: {
    key: 'bos_meetings',
    title: 'Board of Studies (BoS) Meetings',
    category: 'Governance',
    primaryKey: 'bosNumber',
    destinationKey: 'BOS',
    fields: [
      { key: 'bosNumber', label: 'Meeting Number / Code', required: true, type: 'string', aliases: ['meeting no', 'bos no', 'meeting number', 'bos meeting no', 'reference no'] },
      { key: 'department', label: 'Department', required: true, type: 'department', aliases: ['department', 'dept', 'branch'] },
      { key: 'academicYear', label: 'Academic Year', required: true, type: 'string', aliases: ['academic year', 'ay', 'year'] },
      { key: 'regulation', label: 'Regulation (R20 / R23 / R26)', required: true, type: 'string', aliases: ['regulation', 'regulations', 'curriculum regulation'] },
      { key: 'meetingDate', label: 'Meeting Date (YYYY-MM-DD)', required: true, type: 'date', aliases: ['meeting date', 'date', 'conducted date', 'date of meeting'] },
      { key: 'meetingTime', label: 'Meeting Time Slot', required: false, type: 'string', aliases: ['time', 'meeting time', 'slot', 'timing'] },
      { key: 'chairmanName', label: 'BoS Chairman Name', required: true, type: 'string', aliases: ['chairman', 'chairman name', 'bos chairman', 'hod name'] },
      { key: 'agenda', label: 'Agenda & Resolutions Summary', required: true, type: 'string', aliases: ['agenda', 'resolutions', 'meeting agenda', 'minutes summary', 'topics'] }
    ]
  }
};

/**
 * Normalizes a header string for fuzzy matching (lowercase, no symbols, trimmed).
 */
export function cleanHeaderString(header) {
  if (!header) return '';
  return String(header)
    .trim()
    .toLowerCase()
    .replace(/[_\-\.\/\\#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Matches raw file headers to canonical fields of a target module.
 * Returns an array of field mappings with confidence level.
 */
export function matchHeadersToSchema(fileHeaders, moduleKey) {
  const schema = MODULE_CANONICAL_SCHEMAS[moduleKey];
  if (!schema) throw new Error(`Schema not defined for module: ${moduleKey}`);

  const rawHeaders = fileHeaders || [];
  const mappings = [];
  const usedHeaderIndices = new Set();

  schema.fields.forEach(field => {
    let bestMatch = null;
    let bestScore = 0;
    let bestIndex = -1;

    rawHeaders.forEach((rawH, idx) => {
      if (usedHeaderIndices.has(idx)) return;
      const cleanRaw = cleanHeaderString(rawH);
      if (!cleanRaw) return;

      // 1. Exact canonical key match
      if (cleanRaw === cleanHeaderString(field.key)) {
        bestScore = 100;
        bestMatch = rawH;
        bestIndex = idx;
        return;
      }

      // 2. Exact label match
      if (cleanRaw === cleanHeaderString(field.label)) {
        bestScore = 98;
        bestMatch = rawH;
        bestIndex = idx;
        return;
      }

      // 3. Alias match
      if (field.aliases) {
        for (const alias of field.aliases) {
          const cleanAlias = cleanHeaderString(alias);
          if (cleanRaw === cleanAlias) {
            if (95 > bestScore) {
              bestScore = 95;
              bestMatch = rawH;
              bestIndex = idx;
            }
          } else if (cleanRaw.includes(cleanAlias) || cleanAlias.includes(cleanRaw)) {
            const partialScore = Math.min(85, Math.round((cleanAlias.length / Math.max(cleanRaw.length, cleanAlias.length)) * 85));
            if (partialScore > bestScore) {
              bestScore = partialScore;
              bestMatch = rawH;
              bestIndex = idx;
            }
          }
        }
      }
    });

    if (bestScore >= 50 && bestIndex >= 0) {
      usedHeaderIndices.add(bestIndex);
      mappings.push({
        targetField: field.key,
        targetLabel: field.label,
        targetType: field.type,
        required: field.required,
        sourceHeader: bestMatch,
        sourceIndex: bestIndex,
        confidence: bestScore,
        status: bestScore >= 85 ? 'AUTO_MATCHED' : 'SUGGESTED'
      });
    } else {
      mappings.push({
        targetField: field.key,
        targetLabel: field.label,
        targetType: field.type,
        required: field.required,
        sourceHeader: null,
        sourceIndex: -1,
        confidence: 0,
        status: field.required ? 'MISSING_REQUIRED' : 'UNMAPPED'
      });
    }
  });

  // Track extra headers not mapped to any field
  const unmappedSourceHeaders = rawHeaders
    .map((h, i) => ({ header: h, index: i }))
    .filter(h => !usedHeaderIndices.has(h.index));

  return {
    moduleKey,
    schemaTitle: schema.title,
    mappings,
    unmappedSourceHeaders,
    isComplete: mappings.filter(m => m.required).every(m => m.sourceIndex >= 0)
  };
}

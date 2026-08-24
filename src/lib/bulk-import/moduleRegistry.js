/**
 * NEC Institutional Portal - Universal Bulk Data Center Module Registry
 * Defines module schemas, validation rules, alias resolution targets, 
 * duplicate keys, and template definitions across all 17+ academic & administrative domains.
 */

export const BULK_MODULE_CATEGORIES = [
  {
    id: 'events_outreach',
    label: 'Events & Outreach',
    description: 'Institutional workshops, seminars, hackathons, FDPs, and formal industry collaborations.',
    moduleKeys: ['academic_events', 'fdps_organized', 'mous']
  },
  {
    id: 'research_innovation',
    label: 'Research & Innovation',
    description: 'Scholarly publications, patent filings, grant tracking, and researcher identifiers.',
    moduleKeys: ['publications', 'patents']
  },
  {
    id: 'people_identity',
    label: 'People & Identity',
    description: 'Faculty directory, staff rosters, and institutional administrative profiles.',
    moduleKeys: ['faculty_directory', 'staff_profiles']
  },
  {
    id: 'faculty_development',
    label: 'Faculty Development',
    description: 'Professional body memberships, external achievements, awards, and certifications.',
    moduleKeys: ['faculty_memberships', 'faculty_achievements']
  },
  {
    id: 'student_development',
    label: 'Student Development',
    description: 'Capstone projects, student competitions, internships, and skill honors.',
    moduleKeys: ['student_projects', 'student_achievements', 'student_internships']
  },
  {
    id: 'accreditation_compliance',
    label: 'Accreditation & Compliance',
    description: 'MOOC/NPTEL certifications, placement packages, and accreditation datasets.',
    moduleKeys: ['nptel_certifications', 'placements']
  },
  {
    id: 'academic_governance',
    label: 'Academic Governance',
    description: 'Board of Studies minutes, Academic Council resolutions, and official circulars.',
    moduleKeys: ['bos_meetings', 'academic_council', 'circulars']
  }
];

export const BULK_IMPORT_MODULE_REGISTRY = {
  // ─────────────────────────────────────────────────────────────
  // 1. ACADEMIC EVENTS & WORKSHOPS
  // ─────────────────────────────────────────────────────────────
  academic_events: {
    key: 'academic_events',
    title: 'Academic Events & Workshops',
    category: 'events_outreach',
    description: 'Workshops, Seminars, Guest Lectures, Hackathons, Code-a-thons, Conferences & Bootcamps.',
    version: 'v2',
    destinationPermission: 'events.create',
    destinationStoreKey: 'EVENTS',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'title',
    columns: [
      { key: 'academic_year', label: 'Academic Year', required: true, type: 'string', example: '2026-27', description: 'Academic Year notation (e.g. 2026-27)' },
      { key: 'event_type', label: 'Event Type', required: true, type: 'enum', allowed: ['Workshop', 'Seminar', 'Guest Lecture', 'Hackathon', 'Code-a-thon', 'Conference', 'Bootcamp', 'Technical Talk', 'Training'], example: 'Workshop' },
      { key: 'title', label: 'Title / Program Name', required: true, type: 'string', example: 'Advanced Robotics With AI', description: 'Official title of the event' },
      { key: 'audience_years', label: 'Target Audience / Class Year', required: false, type: 'string', example: 'III & IV', description: 'Target student year (I, II, III, IV, All)' },
      { key: 'department_codes', label: 'Department Codes', required: true, type: 'string', example: 'CSE, DS', description: 'Department code(s), ALL for institute-wide' },
      { key: 'participants_total', label: 'Total Participants', required: true, type: 'number', example: '75', description: 'Total verified participant count' },
      { key: 'participants_breakdown', label: 'Section Breakdown', required: false, type: 'string', example: 'III-26, IV-38', description: 'Year-wise or branch-wise breakdown' },
      { key: 'venue', label: 'Venue / Hall', required: false, type: 'string', example: '3427', description: 'Room number or auditorium name' },
      { key: 'start_date', label: 'Start Date (YYYY-MM-DD)', required: true, type: 'date', example: '2026-06-29', description: 'Commencement date in ISO format' },
      { key: 'end_date', label: 'End Date (YYYY-MM-DD)', required: false, type: 'date', example: '2026-07-01', description: 'Conclusion date in ISO format' },
      { key: 'mode', label: 'Mode', required: false, type: 'enum', allowed: ['Offline', 'Online', 'Hybrid'], example: 'Offline' },
      { key: 'resource_person_details', label: 'Resource Person / Expert', required: false, type: 'string', example: 'K. M. Srinivas Rao, Lead AI Engineer', description: 'Name, designation, and organization of expert' },
      { key: 'organized_by', label: 'Organized By / Club', required: false, type: 'string', example: 'TechnoElite, ISTE', description: 'Organizing body or student club' },
      { key: 'mou_partner', label: 'MoU Partner', required: false, type: 'string', example: 'Supraja Technologies', description: 'Industry partner if tied to an active MoU' },
      { key: 'amount', label: 'Financial Budget / Expense', required: false, type: 'number', example: '', description: 'Leave blank if not applicable (never 0)' },
      { key: 'invoice_date', label: 'Invoice Date', required: false, type: 'date', example: '', description: 'Billing date if financial expense incurred' },
      { key: 'description', label: 'Summary / Objectives', required: false, type: 'string', example: 'Hands-on workshop on generative AI', description: 'Brief summary' },
      { key: 'source_reference', label: 'Source Ref / Circular No', required: false, type: 'string', example: 'SNO-47', description: 'Reference ID from source sheet' }
    ],
    duplicateKeys: ['title', 'start_date', 'resource_person_details']
  },

  // ─────────────────────────────────────────────────────────────
  // 2. RESEARCH PUBLICATIONS
  // ─────────────────────────────────────────────────────────────
  publications: {
    key: 'publications',
    title: 'Research Publications',
    category: 'research_innovation',
    description: 'Scopus, Web of Science, IEEE, Springer, and UGC-CARE indexed journal & conference papers.',
    version: 'v2',
    destinationPermission: 'publications.manage',
    destinationStoreKey: 'PUBLICATIONS',
    defaultWorkflowStatus: 'IMPORTED_PENDING_REVIEW',
    primaryRecordField: 'title',
    columns: [
      { key: 'publication_type', label: 'Publication Type', required: true, type: 'enum', allowed: ['Journal', 'Conference Paper', 'Book Chapter', 'Review Article'], example: 'Journal' },
      { key: 'title', label: 'Paper Title', required: true, type: 'string', example: 'Deep Learning for Edge AI in Autonomous Drones', description: 'Exact published title' },
      { key: 'publication_year', label: 'Year', required: true, type: 'number', example: '2026', description: 'Publication year' },
      { key: 'journal_or_conference', label: 'Journal / Conference Name', required: true, type: 'string', example: 'IEEE Transactions on Industrial Informatics' },
      { key: 'publisher', label: 'Publisher', required: false, type: 'string', example: 'IEEE' },
      { key: 'volume', label: 'Volume', required: false, type: 'string', example: '18' },
      { key: 'issue', label: 'Issue', required: false, type: 'string', example: '4' },
      { key: 'pages', label: 'Pages (From-To)', required: false, type: 'string', example: '1120-1135' },
      { key: 'doi', label: 'DOI', required: false, type: 'string', example: '10.1109/TII.2026.1234567', description: 'Digital Object Identifier' },
      { key: 'scopus_eid', label: 'Scopus EID', required: false, type: 'string', example: '2-s2.0-85123456789' },
      { key: 'wos_uid', label: 'WoS Accession UID', required: false, type: 'string', example: 'WOS:00087654321' },
      { key: 'issn', label: 'ISSN / eISSN', required: false, type: 'string', example: '1551-3203' },
      { key: 'indexing_sources', label: 'Indexing (Scopus/WoS/UGC)', required: false, type: 'string', example: 'Scopus, WoS (SCIE)' },
      { key: 'author_identifiers', label: 'Faculty Authors (Email / Name)', required: true, type: 'string', example: 'dr.principal@nec.edu.in, dr.hodcse@nec.edu.in' },
      { key: 'department_codes', label: 'Department Codes', required: true, type: 'string', example: 'CSE' }
    ],
    duplicateKeys: ['doi', 'scopus_eid', 'wos_uid', 'title']
  },

  // ─────────────────────────────────────────────────────────────
  // 3. PATENTS & IPR RECORDS
  // ─────────────────────────────────────────────────────────────
  patents: {
    key: 'patents',
    title: 'Patents & IPR Records',
    category: 'research_innovation',
    description: 'National and international patents filed, published, and granted.',
    version: 'v1',
    destinationPermission: 'patents.manage',
    destinationStoreKey: 'PATENTS',
    defaultWorkflowStatus: 'IMPORTED_PENDING_REVIEW',
    primaryRecordField: 'title',
    columns: [
      { key: 'title', label: 'Patent Title', required: true, type: 'string', example: 'Automated Real-Time AI Pest Detection System for Agriculture' },
      { key: 'patent_type', label: 'Patent Type', required: true, type: 'enum', allowed: ['Indian Utility', 'Design Patent', 'International Patent (PCT)', 'Copyright'], example: 'Indian Utility' },
      { key: 'country', label: 'Country / Jurisdiction', required: true, type: 'string', example: 'India' },
      { key: 'application_number', label: 'Application Number', required: true, type: 'string', example: '202641012345' },
      { key: 'filing_date', label: 'Filing Date (YYYY-MM-DD)', required: true, type: 'date', example: '2026-03-15' },
      { key: 'publication_date', label: 'Publication Date', required: false, type: 'date', example: '2026-05-20' },
      { key: 'grant_number', label: 'Grant Number', required: false, type: 'string', example: '' },
      { key: 'grant_date', label: 'Grant Date', required: false, type: 'date', example: '' },
      { key: 'legal_status', label: 'Legal Status', required: true, type: 'enum', allowed: ['Filed', 'Published', 'Under Examination', 'FER Issued', 'Granted', 'Abandoned'], example: 'Published' },
      { key: 'technology_domain', label: 'Technology Domain', required: false, type: 'string', example: 'Artificial Intelligence, AgriTech' },
      { key: 'inventors', label: 'Inventors (Faculty / Students)', required: true, type: 'string', example: 'Dr. Principal, Dr. HOD CSE' },
      { key: 'department_codes', label: 'Department Codes', required: true, type: 'string', example: 'CSE, ECE' },
      { key: 'applicant', label: 'Applicant / Assignee', required: true, type: 'string', example: 'Narasaraopeta Engineering College' }
    ],
    duplicateKeys: ['application_number', 'grant_number', 'title']
  },

  // ─────────────────────────────────────────────────────────────
  // 4. INDUSTRY MoUs & TIE-UPS
  // ─────────────────────────────────────────────────────────────
  mous: {
    key: 'mous',
    title: 'Industry MoUs & Tie-Ups',
    category: 'events_outreach',
    description: 'Formal agreements with corporate organizations, research institutes, and universities.',
    version: 'v1',
    destinationPermission: 'mous.manage',
    destinationStoreKey: 'MOUS',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'partnerName',
    columns: [
      { key: 'partner_name', label: 'Partner Organization', required: true, type: 'string', example: 'Supraja Technologies' },
      { key: 'partner_type', label: 'Partner Type', required: true, type: 'enum', allowed: ['Industry / Corporate', 'Academic Institution', 'R&D Laboratory', 'Startup / Incubator'], example: 'Industry / Corporate' },
      { key: 'mou_title', label: 'MoU Title / Purpose', required: true, type: 'string', example: 'Center of Excellence in Cybersecurity & Ethical Hacking' },
      { key: 'execution_date', label: 'Execution Date (YYYY-MM-DD)', required: true, type: 'date', example: '2025-06-10' },
      { key: 'start_date', label: 'Start Date', required: true, type: 'date', example: '2025-06-10' },
      { key: 'expiry_date', label: 'Expiry Date', required: false, type: 'date', example: '2028-06-09', description: 'Leave blank if perpetual/active indefinitely' },
      { key: 'department_codes', label: 'Beneficiary Departments', required: true, type: 'string', example: 'CSE, CS, IT' },
      { key: 'scope', label: 'Scope of Collaboration', required: false, type: 'string', example: 'Student internships, faculty development, hackathons' },
      { key: 'status', label: 'Status', required: true, type: 'enum', allowed: ['Active', 'Expiring Soon', 'Under Renewal', 'Terminated'], example: 'Active' },
      { key: 'contact_person', label: 'Contact Person & Email', required: false, type: 'string', example: 'Santosh Kumar (director@suprajatech.com)' }
    ],
    duplicateKeys: ['partner_name', 'execution_date']
  },

  // ─────────────────────────────────────────────────────────────
  // 5. FACULTY MEMBERSHIPS
  // ─────────────────────────────────────────────────────────────
  faculty_memberships: {
    key: 'faculty_memberships',
    title: 'Faculty Memberships',
    category: 'faculty_development',
    description: 'IEEE, ACM, CSI, ISTE, IETE, and professional body affiliations.',
    version: 'v1',
    destinationPermission: 'faculty.create',
    destinationStoreKey: 'FACULTY_MEMBERSHIPS',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'organization',
    columns: [
      { key: 'faculty_identifier', label: 'Faculty Name or Email', required: true, type: 'string', example: 'dr.faculty@nec.edu.in' },
      { key: 'department_code', label: 'Department', required: true, type: 'string', example: 'CSE' },
      { key: 'organization', label: 'Professional Body', required: true, type: 'string', example: 'ISTE (Indian Society for Technical Education)' },
      { key: 'membership_type', label: 'Membership Type', required: true, type: 'enum', allowed: ['Life Member', 'Annual Member', 'Senior Member', 'Fellow', 'Student Member'], example: 'Life Member' },
      { key: 'membership_number', label: 'Membership ID / Number', required: true, type: 'string', example: 'LM-102938' },
      { key: 'start_date', label: 'Admission / Start Date', required: true, type: 'date', example: '2022-01-15' },
      { key: 'expiry_date', label: 'Expiry Date', required: false, type: 'date', example: '', description: 'Leave blank for Life Memberships' },
      { key: 'remarks', label: 'Remarks / Chapter Office', required: false, type: 'string', example: 'Executive Committee Member' }
    ],
    duplicateKeys: ['faculty_identifier', 'organization', 'membership_number']
  },

  // ─────────────────────────────────────────────────────────────
  // 6. STUDENT PROJECTS (CAPSTONE)
  // ─────────────────────────────────────────────────────────────
  student_projects: {
    key: 'student_projects',
    title: 'Student Projects & Capstone',
    category: 'student_development',
    description: 'Major capstone, minor projects, community service projects & patents.',
    version: 'v1',
    destinationPermission: 'student_data.manage',
    destinationStoreKey: 'STUDENT_PROJECTS',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'title',
    columns: [
      { key: 'academic_year', label: 'Academic Year', required: true, type: 'string', example: '2026-27' },
      { key: 'department_code', label: 'Department', required: true, type: 'string', example: 'CSE' },
      { key: 'batch', label: 'Batch (e.g. 2023-2027)', required: true, type: 'string', example: '2023-2027' },
      { key: 'project_type', label: 'Project Type', required: true, type: 'enum', allowed: ['Major Capstone Project', 'Minor Project', 'Community Service Project', 'Industry Sponsored Project'], example: 'Major Capstone Project' },
      { key: 'title', label: 'Project Title', required: true, type: 'string', example: 'Autonomous Drone Navigation using LiDAR and Edge Neural Networks' },
      { key: 'domain', label: 'Domain', required: false, type: 'string', example: 'AI & Robotics' },
      { key: 'guide_identifier', label: 'Faculty Guide (Name/Email)', required: true, type: 'string', example: 'dr.faculty@nec.edu.in' },
      { key: 'team_leader_roll', label: 'Team Leader Roll Number', required: true, type: 'string', example: '23471A0501' },
      { key: 'member_rolls', label: 'Team Member Roll Numbers', required: true, type: 'string', example: '23471A0502, 23471A0503, 23471A0504' },
      { key: 'repository_url', label: 'GitHub / GitLab Repo', required: false, type: 'string', example: 'https://github.com/nec-cse/drone-ai' }
    ],
    duplicateKeys: ['academic_year', 'team_leader_roll', 'title']
  },

  // ─────────────────────────────────────────────────────────────
  // 7. STUDENT ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────
  student_achievements: {
    key: 'student_achievements',
    title: 'Student Achievements & Honors',
    category: 'student_development',
    description: 'Hackathon prizes, coding competitions, sports, technical symposiums & paper awards.',
    version: 'v1',
    destinationPermission: 'student_data.manage',
    destinationStoreKey: 'STUDENT_ACHIEVEMENTS',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'title',
    columns: [
      { key: 'roll_number', label: 'Student Roll Number', required: true, type: 'string', example: '23471A0501' },
      { key: 'academic_year', label: 'Academic Year', required: true, type: 'string', example: '2026-27' },
      { key: 'achievement_type', label: 'Achievement Type', required: true, type: 'enum', allowed: ['Hackathon Winner', 'Coding Contest', 'Technical Paper Award', 'Project Expo', 'Sports & Games', 'Cultural Honor'], example: 'Hackathon Winner' },
      { key: 'title', label: 'Achievement Title / Description', required: true, type: 'string', example: '1st Prize at National Smart India Hackathon' },
      { key: 'event_name', label: 'Event / Competition Name', required: true, type: 'string', example: 'Smart India Hackathon 2026' },
      { key: 'organized_by', label: 'Organizing Institution', required: true, type: 'string', example: 'Ministry of Education / AICTE' },
      { key: 'event_date', label: 'Event Date (YYYY-MM-DD)', required: true, type: 'date', example: '2026-08-15' },
      { key: 'level', label: 'Level', required: true, type: 'enum', allowed: ['National', 'International', 'State', 'Inter-Collegiate', 'Institutional'], example: 'National' },
      { key: 'position', label: 'Prize / Position', required: false, type: 'string', example: '1st Place (Winner)' },
      { key: 'prize_amount', label: 'Cash Prize (INR)', required: false, type: 'number', example: '100000' }
    ],
    duplicateKeys: ['roll_number', 'event_name', 'event_date']
  },

  // ─────────────────────────────────────────────────────────────
  // 8. STUDENT INTERNSHIPS
  // ─────────────────────────────────────────────────────────────
  student_internships: {
    key: 'student_internships',
    title: 'Student Internships & Training',
    category: 'student_development',
    description: 'Corporate internships, research internships, virtual summer training programs.',
    version: 'v1',
    destinationPermission: 'internships.manage',
    destinationStoreKey: 'INTERNSHIPS',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'organization',
    columns: [
      { key: 'roll_number', label: 'Student Roll Number', required: true, type: 'string', example: '23471A0501' },
      { key: 'academic_year', label: 'Academic Year', required: true, type: 'string', example: '2026-27' },
      { key: 'internship_type', label: 'Internship Type', required: true, type: 'enum', allowed: ['Corporate Industry', 'Research Lab', 'Virtual / Online', 'Start-up Incubator'], example: 'Corporate Industry' },
      { key: 'organization', label: 'Company / Organization', required: true, type: 'string', example: 'Infosys' },
      { key: 'domain', label: 'Technical Domain', required: false, type: 'string', example: 'Cloud Architecture & DevOps' },
      { key: 'mode', label: 'Mode', required: true, type: 'enum', allowed: ['Offline', 'Online', 'Hybrid'], example: 'Offline' },
      { key: 'start_date', label: 'Start Date (YYYY-MM-DD)', required: true, type: 'date', example: '2026-05-15' },
      { key: 'end_date', label: 'End Date (YYYY-MM-DD)', required: true, type: 'date', example: '2026-07-15' },
      { key: 'stipend_amount', label: 'Monthly Stipend (INR)', required: false, type: 'number', example: '25000' },
      { key: 'mentor', label: 'Company Mentor Name', required: false, type: 'string', example: 'Rajesh Sharma, Senior Architect' }
    ],
    duplicateKeys: ['roll_number', 'organization', 'start_date']
  },

  // ─────────────────────────────────────────────────────────────
  // 9. NPTEL / MOOC CERTIFICATIONS
  // ─────────────────────────────────────────────────────────────
  nptel_certifications: {
    key: 'nptel_certifications',
    title: 'NPTEL & MOOC Certifications',
    category: 'accreditation_compliance',
    description: 'Swayam, NPTEL, Coursera, edX certifications for students and faculty.',
    version: 'v1',
    destinationPermission: 'student_data.manage',
    destinationStoreKey: 'NPTEL_CERTIFICATIONS',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'courseName',
    columns: [
      { key: 'person_type', label: 'Person Type', required: true, type: 'enum', allowed: ['STUDENT', 'FACULTY'], example: 'STUDENT' },
      { key: 'person_identifier', label: 'Roll Number or Faculty Email', required: true, type: 'string', example: '23471A0501' },
      { key: 'department_code', label: 'Department', required: true, type: 'string', example: 'CSE' },
      { key: 'course_name', label: 'Course Name', required: true, type: 'string', example: 'Deep Learning by IIT Madras' },
      { key: 'provider', label: 'Provider / Platform', required: true, type: 'enum', allowed: ['NPTEL / Swayam', 'Coursera', 'edX', 'AWS Academy', 'Oracle Academy'], example: 'NPTEL / Swayam' },
      { key: 'duration_weeks', label: 'Duration (Weeks)', required: false, type: 'number', example: '12' },
      { key: 'certificate_date', label: 'Certificate Date (YYYY-MM-DD)', required: true, type: 'date', example: '2026-04-30' },
      { key: 'score', label: 'Final Score (%)', required: false, type: 'number', example: '88' },
      { key: 'medal', label: 'Medal / Honor (Elite/Gold/Silver)', required: false, type: 'string', example: 'Elite + Silver' },
      { key: 'certificate_reference', label: 'Certificate Roll / Ref ID', required: false, type: 'string', example: 'NPTEL26CS12S1234567' }
    ],
    duplicateKeys: ['person_identifier', 'course_name', 'certificate_date']
  },

  // ─────────────────────────────────────────────────────────────
  // 10. FDPs ORGANIZED (HOST)
  // ─────────────────────────────────────────────────────────────
  fdps_organized: {
    key: 'fdps_organized',
    title: 'FDPs Organized (Host)',
    category: 'events_outreach',
    description: 'AICTE / ATAL / ISTE sponsored faculty development programs organized by NEC.',
    version: 'v1',
    destinationPermission: 'fdp.manage',
    destinationStoreKey: 'FDPS_ORGANIZED',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'title',
    columns: [
      { key: 'academic_year', label: 'Academic Year', required: true, type: 'string', example: '2026-27' },
      { key: 'title', label: 'FDP Title', required: true, type: 'string', example: 'AICTE ATAL FDP on Quantum Computing and Cryptography' },
      { key: 'department_codes', label: 'Organizing Department(s)', required: true, type: 'string', example: 'CSE' },
      { key: 'sponsoring_agency', label: 'Sponsoring Agency', required: true, type: 'string', example: 'AICTE ATAL' },
      { key: 'start_date', label: 'Start Date (YYYY-MM-DD)', required: true, type: 'date', example: '2026-09-01' },
      { key: 'end_date', label: 'End Date (YYYY-MM-DD)', required: true, type: 'date', example: '2026-09-06' },
      { key: 'mode', label: 'Mode', required: true, type: 'enum', allowed: ['Offline', 'Online', 'Hybrid'], example: 'Offline' },
      { key: 'coordinator_identifier', label: 'Faculty Coordinator Email', required: true, type: 'string', example: 'dr.hodcse@nec.edu.in' },
      { key: 'participant_count', label: 'Registered Faculty Participants', required: true, type: 'number', example: '60' },
      { key: 'grant_amount', label: 'Sanctioned Grant Amount (INR)', required: false, type: 'number', example: '350000' }
    ],
    duplicateKeys: ['title', 'start_date', 'department_codes']
  },

  // ─────────────────────────────────────────────────────────────
  // 11. FACULTY ACHIEVEMENTS & AWARDS
  // ─────────────────────────────────────────────────────────────
  faculty_achievements: {
    key: 'faculty_achievements',
    title: 'Faculty Achievements & FDPs Attended',
    category: 'faculty_development',
    description: 'External awards, session chair recognitions, review invitations, and FDPs attended.',
    version: 'v1',
    destinationPermission: 'faculty.create',
    destinationStoreKey: 'FACULTY_ACHIEVEMENTS',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'title',
    columns: [
      { key: 'faculty_identifier', label: 'Faculty Email / Name', required: true, type: 'string', example: 'dr.faculty@nec.edu.in' },
      { key: 'department_code', label: 'Department', required: true, type: 'string', example: 'CSE' },
      { key: 'achievement_type', label: 'Type', required: true, type: 'enum', allowed: ['External FDP Attended', 'Best Teacher Award', 'Keynote Speaker / Session Chair', 'Research Grant Sanctioned', 'Fellowship Honor'], example: 'External FDP Attended' },
      { key: 'title', label: 'Title / Program Name', required: true, type: 'string', example: 'One Week National FDP on Generative AI Architectures' },
      { key: 'organizer', label: 'Organizing Institution', required: true, type: 'string', example: 'IIT Hyderabad' },
      { key: 'start_date', label: 'Start Date (YYYY-MM-DD)', required: true, type: 'date', example: '2026-05-10' },
      { key: 'end_date', label: 'End Date (YYYY-MM-DD)', required: false, type: 'date', example: '2026-05-15' },
      { key: 'mode', label: 'Mode', required: false, type: 'enum', allowed: ['Offline', 'Online', 'Hybrid'], example: 'Online' },
      { key: 'verification_url', label: 'Verification / Proof Link', required: false, type: 'string', example: '' }
    ],
    duplicateKeys: ['faculty_identifier', 'title', 'start_date']
  },

  // ─────────────────────────────────────────────────────────────
  // 12. FACULTY DIRECTORY & PROFILES
  // ─────────────────────────────────────────────────────────────
  faculty_directory: {
    key: 'faculty_directory',
    title: 'Faculty Directory & Profiles',
    category: 'people_identity',
    description: 'Official faculty rosters, designations, educational qualifications, and joining dates.',
    version: 'v1',
    destinationPermission: 'faculty.create',
    destinationStoreKey: 'USERS',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'name',
    columns: [
      { key: 'full_name', label: 'Full Name with Title', required: true, type: 'string', example: 'Dr. S. K. Ramesh' },
      { key: 'official_email', label: 'Institutional Email', required: true, type: 'string', example: 'sk.ramesh@nec.edu.in' },
      { key: 'department_code', label: 'Department', required: true, type: 'string', example: 'CSE' },
      { key: 'designation', label: 'Designation', required: true, type: 'enum', allowed: ['Professor', 'Associate Professor', 'Assistant Professor', 'Professor & HOD', 'Dean', 'Principal'], example: 'Associate Professor' },
      { key: 'qualification', label: 'Highest Qualification', required: true, type: 'string', example: 'Ph.D in Computer Science' },
      { key: 'experience_years', label: 'Total Experience (Years)', required: false, type: 'number', example: '14' },
      { key: 'date_of_joining', label: 'Date of Joining (YYYY-MM-DD)', required: true, type: 'date', example: '2018-07-01' },
      { key: 'employment_status', label: 'Employment Status', required: true, type: 'enum', allowed: ['Active', 'On Study Leave', 'Sabbatical', 'Resigned', 'Retired'], example: 'Active' }
    ],
    duplicateKeys: ['official_email']
  },

  // ─────────────────────────────────────────────────────────────
  // 13. STAFF PROFILES
  // ─────────────────────────────────────────────────────────────
  staff_profiles: {
    key: 'staff_profiles',
    title: 'Staff Profiles',
    category: 'people_identity',
    description: 'Technical assistants, lab technicians, administrative officers & support personnel.',
    version: 'v1',
    destinationPermission: 'users.create',
    destinationStoreKey: 'STAFF_PROFILES',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'full_name',
    columns: [
      { key: 'full_name', label: 'Full Name', required: true, type: 'string', example: 'K. Venkateswara Rao' },
      { key: 'staff_type', label: 'Staff Cadre', required: true, type: 'enum', allowed: ['Technical Assistant / Lab Technician', 'Administrative Staff', 'Office Assistant', 'Maintenance & Support'], example: 'Technical Assistant / Lab Technician' },
      { key: 'designation', label: 'Designation', required: true, type: 'string', example: 'Senior Lab Programmer' },
      { key: 'department_code', label: 'Department', required: true, type: 'string', example: 'CSE' },
      { key: 'qualification', label: 'Qualification', required: false, type: 'string', example: 'B.Sc (Comp. Sci), CCNA' },
      { key: 'official_email', label: 'Official Email', required: false, type: 'string', example: 'venkat.staff@nec.edu.in' },
      { key: 'status', label: 'Status', required: true, type: 'enum', allowed: ['Active', 'Relieved', 'Transferred'], example: 'Active' }
    ],
    duplicateKeys: ['full_name', 'department_code', 'designation']
  },

  // ─────────────────────────────────────────────────────────────
  // 14. OFFICIAL CIRCULARS & NOTICES
  // ─────────────────────────────────────────────────────────────
  circulars: {
    key: 'circulars',
    title: 'Official Circulars & Notices',
    category: 'academic_governance',
    description: 'Principal office notices, exam cell announcements, holiday notifications.',
    version: 'v1',
    destinationPermission: 'cms.publish',
    destinationStoreKey: 'CIRCULARS',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'title',
    columns: [
      { key: 'reference_number', label: 'Circular Reference Number', required: true, type: 'string', example: 'NEC/PO/CIR/2026/045' },
      { key: 'title', label: 'Circular Subject / Title', required: true, type: 'string', example: 'Commencement of AY 2026-27 Classwork for II, III & IV B.Tech' },
      { key: 'category', label: 'Category', required: true, type: 'enum', allowed: ['Academic Schedule', 'Examinations', 'Fee & Admission', 'Holiday Notice', 'Administrative Orders'], example: 'Academic Schedule' },
      { key: 'issuing_authority', label: 'Issuing Authority', required: true, type: 'string', example: 'Principal' },
      { key: 'issue_date', label: 'Issue Date (YYYY-MM-DD)', required: true, type: 'date', example: '2026-06-20' },
      { key: 'academic_year', label: 'Academic Year', required: true, type: 'string', example: '2026-27' },
      { key: 'summary', label: 'Brief Summary', required: false, type: 'string', example: 'All students are instructed to report to respective classrooms by 9:00 AM.' }
    ],
    duplicateKeys: ['reference_number']
  },

  // ─────────────────────────────────────────────────────────────
  // 15. BOARD OF STUDIES (BoS)
  // ─────────────────────────────────────────────────────────────
  bos_meetings: {
    key: 'bos_meetings',
    title: 'Board of Studies (BoS)',
    category: 'academic_governance',
    description: 'Departmental syllabus revisions, curriculum reviews, meeting minutes.',
    version: 'v1',
    destinationPermission: 'bos.create',
    destinationStoreKey: 'BOS_MEETINGS',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'meetingNumber',
    columns: [
      { key: 'department_code', label: 'Department', required: true, type: 'string', example: 'CSE' },
      { key: 'meeting_number', label: 'Meeting Number / Reference', required: true, type: 'string', example: '14th BoS Meeting' },
      { key: 'regulation', label: 'Curriculum Regulation', required: true, type: 'string', example: 'R23' },
      { key: 'meeting_date', label: 'Meeting Date (YYYY-MM-DD)', required: true, type: 'date', example: '2026-04-18' },
      { key: 'venue', label: 'Meeting Venue', required: false, type: 'string', example: 'CSE Conference Hall & Hybrid Zoom' },
      { key: 'academic_year', label: 'Academic Year', required: true, type: 'string', example: '2026-27' },
      { key: 'key_deliberations', label: 'Key Deliberations / Agenda', required: false, type: 'string', example: 'Approval of V & VI semester syllabus with AI & Cloud elective tracks' }
    ],
    duplicateKeys: ['department_code', 'meeting_number', 'meeting_date']
  },

  // ─────────────────────────────────────────────────────────────
  // 16. ACADEMIC COUNCIL
  // ─────────────────────────────────────────────────────────────
  academic_council: {
    key: 'academic_council',
    title: 'Academic Council Meetings',
    category: 'academic_governance',
    description: 'Autonomous statutory academic council meetings, regulations, pass percentages.',
    version: 'v1',
    destinationPermission: 'bos.create',
    destinationStoreKey: 'ACADEMIC_COUNCIL',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'meetingTitle',
    columns: [
      { key: 'meeting_number', label: 'Meeting Ref Number', required: true, type: 'string', example: '22nd Academic Council Meeting' },
      { key: 'meeting_date', label: 'Date (YYYY-MM-DD)', required: true, type: 'date', example: '2026-05-12' },
      { key: 'academic_year', label: 'Academic Year', required: true, type: 'string', example: '2026-27' },
      { key: 'regulations_approved', label: 'Regulations Approved', required: false, type: 'string', example: 'R23 Course Structure Revision' },
      { key: 'summary_resolutions', label: 'Summary of Resolutions', required: false, type: 'string', example: 'Ratification of BoS recommendations across all engineering departments' }
    ],
    duplicateKeys: ['meeting_number', 'meeting_date']
  },

  // ─────────────────────────────────────────────────────────────
  // 17. PLACEMENT RECORDS
  // ─────────────────────────────────────────────────────────────
  placements: {
    key: 'placements',
    title: 'Student Placement Offers',
    category: 'accreditation_compliance',
    description: 'On-campus and off-campus recruitment offers, salaries, and company tiers.',
    version: 'v1',
    destinationPermission: 'student_data.manage',
    destinationStoreKey: 'PLACEMENTS',
    defaultWorkflowStatus: 'DRAFT',
    primaryRecordField: 'company',
    columns: [
      { key: 'student_roll_number', label: 'Student Roll Number', required: true, type: 'string', example: '23471A0501' },
      { key: 'academic_year', label: 'Academic Year', required: true, type: 'string', example: '2026-27' },
      { key: 'department_code', label: 'Department', required: true, type: 'string', example: 'CSE' },
      { key: 'company', label: 'Company / Recruiter Name', required: true, type: 'string', example: 'TCS Digital' },
      { key: 'role', label: 'Job Role', required: true, type: 'string', example: 'Systems Engineer - AI' },
      { key: 'package_lpa', label: 'Salary Package (LPA in Lakhs)', required: true, type: 'number', example: '7.5' },
      { key: 'offer_type', label: 'Offer Type', required: true, type: 'enum', allowed: ['On-Campus', 'Off-Campus', 'Dream Offer', 'Internship with PPO'], example: 'On-Campus' },
      { key: 'offer_date', label: 'Offer Date (YYYY-MM-DD)', required: true, type: 'date', example: '2026-08-01' }
    ],
    duplicateKeys: ['student_roll_number', 'company', 'academic_year']
  }
};

/**
 * Returns module configuration by module key
 */
export function getModuleConfig(moduleKey) {
  return BULK_IMPORT_MODULE_REGISTRY[moduleKey] || null;
}

/**
 * Returns all modules accessible by user role and permissions
 */
export function getAccessibleModules(currentUser) {
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isAdmin = currentUser?.role === 'ADMIN';
  const userPerms = currentUser?.permissions || [];

  return Object.values(BULK_IMPORT_MODULE_REGISTRY).filter(mod => {
    if (isSuperAdmin || isAdmin) return true;
    if (userPerms.includes('bulk_import.view') && userPerms.includes(mod.destinationPermission)) {
      return true;
    }
    return false;
  });
}

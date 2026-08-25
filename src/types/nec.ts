export type ETDepartmentCode = 'CYS' | 'AI' | 'AIML' | 'DS'

export interface Department {
  id: string
  code: ETDepartmentCode
  officialName: string
  shortName: string
  aliases: string[]
  hodName: string
  establishedYear: number
  isActiveET: boolean
  description?: string
}

export interface Student {
  id: string
  rollNumber: string
  name: string
  departmentId: string
  year: 'I' | 'II' | 'III' | 'IV'
  semester: 'I' | 'II'
  section: 'A' | 'B' | 'C' | 'D'
  batch: string // e.g. "2023-2027"
  mentorName: string
  guardianName: string
  guardianPhone: string
  guardianEmail?: string
}

export interface Faculty {
  id: string
  name: string
  departmentId: string
  designation: string
  email: string
  phone: string
  qualification: string
  experienceYears: number
  specialization: string
  avatarUrl?: string
}

export type BoSMemberCategory = 
  | 'Chairman' 
  | 'University Nominee' 
  | 'Academic Expert' 
  | 'Industry Expert' 
  | 'Alumni Member' 
  | 'Internal Member' 
  | 'Other'

export interface BoSMember {
  id: string
  name: string
  designation: string
  department: string
  institution: string
  email?: string
  phone?: string
  category: BoSMemberCategory
  remarks?: string
  isManual: boolean
  facultyId?: string
}

export interface BoSAgendaItem {
  id: string
  itemNo: number
  title: string
  startTime?: string // "10:00 AM" or "10:00"
  endTime?: string   // "10:30 AM" or "10:30"
  description: string
  decisionResolution: string
}

export interface BoSScheduleHistory {
  id: string
  previousDate: string
  previousStartTime: string
  previousEndTime: string
  newDate: string
  newStartTime: string
  newEndTime: string
  reason: string
  changedAt: string
  changedBy: string
}

export interface BoSDocument {
  id: string
  name: string
  type: 'Minutes' | 'Curriculum Structure' | 'Syllabus Copy' | 'Action Taken Report' | 'Other'
  uploadedAt: string
  uploadedBy: string
  sizeBytes: number
  fileDataUrl?: string
}

export type BoSMeetingStatus = 'SCHEDULED' | 'POSTPONED' | 'COMPLETED' | 'CANCELLED'

export interface BoSMeeting {
  id: string
  meetingNumber: string
  departmentId: string // e.g. "dept-cys"
  regulation: string   // "R23" | "R20" | "R19"
  academicYear: string // "2026-27"
  bosDate: string      // "2026-07-12"
  startTime: string    // "10:00 AM"
  endTime: string      // "01:00 PM"
  meetingMode: 'Offline' | 'Online' | 'Hybrid'
  venue?: string
  meetingLink?: string
  meetingStatus: BoSMeetingStatus
  chairman: BoSMember
  members: BoSMember[]
  agendaItems: BoSAgendaItem[]
  postponementHistory: BoSScheduleHistory[]
  documents: BoSDocument[]
  notes?: string
}

export type AttendanceBatchStatus = 'ACTIVE' | 'REPLACED' | 'ARCHIVED'

export interface AttendanceBatch {
  id: string
  academicYear: string
  departmentId: string
  year: 'I' | 'II' | 'III' | 'IV'
  semester: 'I' | 'II'
  section: 'A' | 'B' | 'C' | 'D'
  monthYear: string // e.g. "August 2026"
  fileName: string
  fileChecksum: string
  totalStudents: number
  riskStudentsCount: number
  importedAt: string
  importedBy: string
  status: AttendanceBatchStatus
  removedAt?: string
  removedBy?: string
}

export type ParentContactStatus = 'Pending' | 'SMS Sent' | 'Called' | 'Parent Met' | 'Notice Dispatched'

export interface AttendanceRecord {
  id: string
  batchId: string
  rollNumber: string
  studentName: string
  departmentId: string
  year: 'I' | 'II' | 'III' | 'IV'
  semester: 'I' | 'II'
  section: 'A' | 'B' | 'C' | 'D'
  classesHeld: number
  classesAttended: number
  percentage: number
  riskStatus: 'RISK' | 'NORMAL' // strictly < 65% is RISK
  parentContactStatus: ParentContactStatus
  lastContactedAt?: string
  contactNotes?: string
  guardianName?: string
  guardianPhone?: string
  isUnmatchedStudent?: boolean
}

export interface AttendanceAuditLog {
  id: string
  batchId: string
  fileName: string
  fileChecksum: string
  monthYear: string
  departmentId: string
  year: string
  section: string
  totalRecords: number
  riskCount: number
  importedAt: string
  importedBy: string
  removedAt?: string
  removedBy?: string
  retentionNote?: string
}

export type EventType = 'Workshop' | 'FDP' | 'Guest Lecture' | 'Seminar' | 'Conference' | 'Hackathon' | 'Technical Symposium'

export interface AcademicEventSection {
  id: string
  eventId: string
  departmentId: string
  year: 'I' | 'II' | 'III' | 'IV'
  semester: 'I' | 'II'
  section: 'A' | 'B' | 'C' | 'D'
  sectionParticipantsCount?: number
}

export interface AcademicEvent {
  id: string
  eventCode: string
  title: string
  eventType: EventType
  academicYear: string
  departmentId: string
  startDate: string
  endDate: string
  mode: 'Offline' | 'Online' | 'Hybrid'
  venue: string
  resourcePerson: string
  resourcePersonDesignation: string
  resourcePersonOrg: string
  totalParticipants: number
  posterUrl?: string
  brochureUrl?: string
  reportUrl?: string
  status: 'Upcoming' | 'Ongoing' | 'Completed'
  workflowStatus: 'Approved' | 'Pending Review' | 'Draft'
  description?: string
  sections: AcademicEventSection[]
}

export interface FlattenedEventSectionRow {
  rowId: string
  eventId: string
  title: string
  eventType: EventType
  academicYear: string
  departmentId: string
  departmentCode: ETDepartmentCode
  departmentName: string
  year: string
  semester: string
  section: string
  startDate: string
  endDate: string
  mode: string
  venue: string
  resourcePerson: string
  resourcePersonOrg: string
  posterUrl?: string
  status: string
  workflowStatus: string
  totalParticipants: number
  sectionParticipants?: number
}

export interface StudentProject {
  id: string
  title: string
  projectType: 'Capstone' | 'Mini Project' | 'Industry Project' | 'Research'
  departmentId: string
  academicYear: string
  year: 'III' | 'IV'
  batch: string
  guideFacultyName: string
  teamLeaderRoll: string
  teamLeaderName: string
  teamMembers: { rollNumber: string; name: string }[]
  domain: string
  abstract: string
  githubUrl?: string
  demoUrl?: string
  status: 'Proposed' | 'In Progress' | 'Completed' | 'Published'
}

export interface StudentAchievement {
  id: string
  rollNumber: string
  studentName: string
  departmentId: string
  year: string
  section: string
  category: 'Hackathon' | 'Paper Presentation' | 'Coding Contest' | 'Project Expo' | 'Sports' | 'Cultural' | 'Other'
  eventTitle: string
  organizedBy: string
  prizePosition: '1st Prize' | '2nd Prize' | '3rd Prize' | 'Winner' | 'Runner' | 'Participation' | 'Special Award'
  cashPrize?: number
  eventDate: string
  certificateUrl?: string
  verified: boolean
}

export interface StudentInternship {
  id: string
  rollNumber: string
  studentName: string
  departmentId: string
  companyName: string
  role: string
  stipendAmount?: number
  durationWeeks: number
  startDate: string
  endDate: string
  mode: 'Remote' | 'Onsite' | 'Hybrid'
  offerLetterVerified: boolean
  status: 'Ongoing' | 'Completed'
}

export interface NPTELCertification {
  id: string
  candidateType: 'Student' | 'Faculty'
  rollOrId: string
  name: string
  departmentId: string
  courseName: string
  courseDomain: string
  examSession: string // e.g. "Jul-Oct 2025"
  score: number
  certificateType: 'Elite + Gold' | 'Elite + Silver' | 'Elite' | 'Successfully Completed' | 'Topper 1%' | 'Topper 5%'
  certificateUrl?: string
}

export interface ResearchPublication {
  id: string
  title: string
  facultyAuthorNames: string[]
  departmentId: string
  journalOrConfName: string
  indexing: 'SCI' | 'Scopus' | 'UGC CARE' | 'IEEE Xplore' | 'Springer' | 'Other'
  publicationType: 'Journal' | 'Conference' | 'Book Chapter' | 'Patent'
  publicationDate: string
  volumeIssue?: string
  issnIsbn?: string
  doi?: string
  impactFactor?: number
  citationsCount: number
  paperUrl?: string
}

export interface Patent {
  id: string
  applicationNumber: string
  title: string
  inventorNames: string[]
  departmentId: string
  filingDate: string
  status: 'Filed' | 'Published' | 'FER Issued' | 'Granted'
  patentOffice: 'Indian Patent Office' | 'USPTO' | 'WIPO' | 'Australian Patent'
  publicationDate?: string
  grantDate?: string
}

export interface IndustryMoU {
  id: string
  companyName: string
  departmentId: string
  signingDate: string
  validityYears: number
  expiryDate: string
  nodalOfficerName: string
  activitiesConducted: string[]
  status: 'Active' | 'Under Renewal' | 'Expired'
  mouDocUrl?: string
}

export interface MediaGalleryItem {
  id: string
  title: string
  eventType: string
  eventDate: string
  departmentId: string
  imageUrl: string
  caption: string
  tags: string[]
}

export interface InstitutionalCircular {
  id: string
  referenceNo: string
  title: string
  issuedBy: string
  issueDate: string
  targetAudience: string
  category: 'Academic' | 'Examination' | 'Governance' | 'Events' | 'Urgent'
  pdfUrl?: string
  isPinned: boolean
}

// ═══════════════════════════════════════════════════════════════════
// COMMUNITY SERVICE PROJECTS (CSP)
// ═══════════════════════════════════════════════════════════════════
export type CSPType =
  | 'Awareness'
  | 'Survey'
  | 'Training'
  | 'Community Development'
  | 'Technology Support'
  | 'Environmental Activity'
  | 'Social Outreach'
  | 'Other'

export type CSPStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'COMPLETED'
  | 'ARCHIVED'

export interface CSPStudent {
  studentId?: string
  rollNumber: string
  studentName: string
  departmentId: string
  year: 'I' | 'II' | 'III' | 'IV'
  section: 'A' | 'B' | 'C' | 'D'
  role: 'Team Leader' | 'Member'
}

export interface CSPActivity {
  id: string
  activityDate: string
  activityTitle: string
  description: string
  location: string
  participantsCount: number
}

export interface CommunityServiceProject {
  id: string
  projectNumber: string
  projectTitle: string
  academicYear: string
  departmentId: string
  year: 'I' | 'II' | 'III' | 'IV'
  semester: 'I' | 'II'
  section: 'A' | 'B' | 'C' | 'D'
  batch: string
  projectType: CSPType
  students: CSPStudent[]
  facultyGuideName: string
  facultyCoordinatorName?: string
  villageOrLocation: string
  district: string
  partnerOrganization?: string
  startDate: string
  endDate: string
  durationDays: number
  objective: string
  activities: CSPActivity[]
  beneficiaryType: string
  beneficiaryCount: number
  outcomeImpact: string
  status: CSPStatus
  documentsCount: number
  reportUrl?: string
}

// ═══════════════════════════════════════════════════════════════════
// PLACEMENTS & RECRUITMENT DRIVES
// ═══════════════════════════════════════════════════════════════════
export interface Company {
  id: string
  name: string
  sector: string
  website?: string
  isActive: boolean
  logoUrl?: string
  hqLocation?: string
}

export type DriveType =
  | 'Campus Recruitment'
  | 'Pool Campus'
  | 'Internship Hiring'
  | 'Pre-Placement Talk'
  | 'Placement Drive'
  | 'Technical Recruitment'
  | 'Industry Interaction'
  | 'Other'

export type DriveMode = 'Offline' | 'Online' | 'Hybrid'

export type CompanyVisitStatus = 'PLANNED' | 'SCHEDULED' | 'COMPLETED' | 'POSTPONED' | 'CANCELLED'

export interface CompanyVisitRole {
  id: string
  roleName: string
  jobType: 'Full-Time' | 'Internship' | 'Internship + PPO'
  location: string
  packageLPA?: number
  stipendMonthly?: number
}

export interface CompanyVisit {
  id: string
  companyId: string
  companyName: string
  academicYear: string
  visitDate: string
  driveType: DriveType
  mode: DriveMode
  venue: string
  eligibleDepartmentIds: string[]
  eligibleCriteria?: {
    minCgpa?: number
    maxBacklogs?: number
    graduationBatch?: string
    otherCriteria?: string
  }
  roles: CompanyVisitRole[]
  rounds: string[]
  participation: {
    eligibleStudentsCount?: number
    registeredStudentsCount?: number
    attendedStudentsCount?: number
    shortlistedStudentsCount?: number
    selectedStudentsCount?: number
    offersReleasedCount?: number
  }
  placementCoordinatorName: string
  hrContactName?: string
  hrEmail?: string
  hrPhone?: string
  status: CompanyVisitStatus
  remarks?: string
}

export type PlacementOfferType =
  | 'Full-Time'
  | 'Internship + PPO'
  | 'Internship'
  | 'Graduate Trainee'
  | 'Contract'
  | 'Other'

export type PlacementOfferStatus =
  | 'SELECTED'
  | 'OFFERED'
  | 'JOINED'
  | 'DECLINED'
  | 'WITHDRAWN'
  | 'ON_HOLD'

export interface PlacementOffer {
  id: string
  studentId?: string
  rollNumber: string
  studentName: string
  departmentId: string
  year: 'IV'
  section: 'A' | 'B' | 'C' | 'D'
  batch: string
  companyId: string
  companyName: string
  companyVisitId?: string
  role: string
  packageLPA: number
  stipendMonthly?: number
  offerType: PlacementOfferType
  jobLocation: string
  offerDate: string
  joiningDate?: string
  status: PlacementOfferStatus
  isPrimaryOffer: boolean
  offerLetterUrl?: string
}


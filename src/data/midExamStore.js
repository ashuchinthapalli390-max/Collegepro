import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Storage Key
export const MID_EXAM_STORAGE_KEY = 'et_portal_mid_exam_analyses_v1';

// Canonical 60-student dataset for Cyber Crime & Digital Forensics (CCDF)
const CANONICAL_CCDF_STUDENTS = [
  // 12 Advanced Learners (>= 80% i.e. >= 24/30)
  { rollNumber: '23471A4619', assignment1: 5, mid1Saq: 8, mid1Descriptive: 14, mid1Total: 27, mid1Percentage: 90.00, classification: 'Advanced Learner', mid2Saq: 8, mid2Descriptive: 14, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4620', assignment1: 5, mid1Saq: 8, mid1Descriptive: 14, mid1Total: 27, mid1Percentage: 90.00, classification: 'Advanced Learner', mid2Saq: 8, mid2Descriptive: 13, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4628', assignment1: 5, mid1Saq: 8, mid1Descriptive: 15, mid1Total: 28, mid1Percentage: 93.33, classification: 'Advanced Learner', mid2Saq: 9, mid2Descriptive: 15, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4644', assignment1: 5, mid1Saq: 7, mid1Descriptive: 15, mid1Total: 27, mid1Percentage: 90.00, classification: 'Advanced Learner', mid2Saq: 8, mid2Descriptive: 14, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4645', assignment1: 5, mid1Saq: 7, mid1Descriptive: 14, mid1Total: 26, mid1Percentage: 86.67, classification: 'Advanced Learner', mid2Saq: 7, mid2Descriptive: 14, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4647', assignment1: 4, mid1Saq: 7, mid1Descriptive: 14, mid1Total: 25, mid1Percentage: 83.33, classification: 'Advanced Learner', mid2Saq: 8, mid2Descriptive: 13, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4649', assignment1: 5, mid1Saq: 7, mid1Descriptive: 14, mid1Total: 26, mid1Percentage: 86.67, classification: 'Advanced Learner', mid2Saq: 8, mid2Descriptive: 15, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4650', assignment1: 5, mid1Saq: 7, mid1Descriptive: 15, mid1Total: 27, mid1Percentage: 90.00, classification: 'Advanced Learner', mid2Saq: 9, mid2Descriptive: 14, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4653', assignment1: 4, mid1Saq: 6, mid1Descriptive: 15, mid1Total: 25, mid1Percentage: 83.33, classification: 'Advanced Learner', mid2Saq: 7, mid2Descriptive: 15, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '24475A4602', assignment1: 4, mid1Saq: 7, mid1Descriptive: 13, mid1Total: 24, mid1Percentage: 80.00, classification: 'Advanced Learner', mid2Saq: 8, mid2Descriptive: 13, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '24475A4605', assignment1: 4, mid1Saq: 7, mid1Descriptive: 15, mid1Total: 26, mid1Percentage: 86.67, classification: 'Advanced Learner', mid2Saq: 8, mid2Descriptive: 14, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '24475A4606', assignment1: 4, mid1Saq: 6, mid1Descriptive: 14, mid1Total: 24, mid1Percentage: 80.00, classification: 'Advanced Learner', mid2Saq: 7, mid2Descriptive: 14, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },

  // 4 Weak Learners (< 50% i.e. < 15/30)
  { rollNumber: '23471A4614', assignment1: 4, mid1Saq: 'AB', mid1Descriptive: 'AB', mid1Total: 4, mid1Percentage: 13.33, classification: 'Weak Learner', mid2Saq: 5, mid2Descriptive: 8, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: true, absenceNote: 'Absent in SAQ & Descriptive' },
  { rollNumber: '23471A4623', assignment1: 2, mid1Saq: 4, mid1Descriptive: 5, mid1Total: 11, mid1Percentage: 36.67, classification: 'Weak Learner', mid2Saq: 5, mid2Descriptive: 7, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4627', assignment1: 'AB', mid1Saq: 5, mid1Descriptive: 9, mid1Total: 14, mid1Percentage: 46.67, classification: 'Weak Learner', mid2Saq: 6, mid2Descriptive: 8, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: true, absenceNote: 'Absent in Assignment-1' },
  { rollNumber: '23471A4641', assignment1: 'AB', mid1Saq: 'AB', mid1Descriptive: 'AB', mid1Total: 0, mid1Percentage: 0.00, classification: 'Weak Learner', mid2Saq: 'AB', mid2Descriptive: 'AB', assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: true, absenceNote: 'Absent in all components' },

  // 16 Regular (70% - 79% i.e. 21 - 23.5)
  { rollNumber: '23471A4601', assignment1: 4, mid1Saq: 7, mid1Descriptive: 12, mid1Total: 23, mid1Percentage: 76.67, classification: 'Regular', mid2Saq: 7, mid2Descriptive: 12, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4603', assignment1: 5, mid1Saq: 6, mid1Descriptive: 12, mid1Total: 23, mid1Percentage: 76.67, classification: 'Regular', mid2Saq: 7, mid2Descriptive: 13, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4605', assignment1: 4, mid1Saq: 6, mid1Descriptive: 12, mid1Total: 22, mid1Percentage: 73.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 11, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4607', assignment1: 4, mid1Saq: 7, mid1Descriptive: 12, mid1Total: 23, mid1Percentage: 76.67, classification: 'Regular', mid2Saq: 8, mid2Descriptive: 12, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4610', assignment1: 4, mid1Saq: 6, mid1Descriptive: 12, mid1Total: 22, mid1Percentage: 73.33, classification: 'Regular', mid2Saq: 7, mid2Descriptive: 12, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4612', assignment1: 4, mid1Saq: 6, mid1Descriptive: 12, mid1Total: 22, mid1Percentage: 73.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 12, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4615', assignment1: 5, mid1Saq: 6, mid1Descriptive: 11, mid1Total: 22, mid1Percentage: 73.33, classification: 'Regular', mid2Saq: 7, mid2Descriptive: 12, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4617', assignment1: 4, mid1Saq: 6, mid1Descriptive: 13, mid1Total: 23, mid1Percentage: 76.67, classification: 'Regular', mid2Saq: 7, mid2Descriptive: 12, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4621', assignment1: 4, mid1Saq: 6, mid1Descriptive: 12, mid1Total: 22, mid1Percentage: 73.33, classification: 'Regular', mid2Saq: 7, mid2Descriptive: 11, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4625', assignment1: 5, mid1Saq: 6, mid1Descriptive: 12, mid1Total: 23, mid1Percentage: 76.67, classification: 'Regular', mid2Saq: 7, mid2Descriptive: 13, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4630', assignment1: 4, mid1Saq: 6, mid1Descriptive: 11, mid1Total: 21, mid1Percentage: 70.00, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 12, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4633', assignment1: 4, mid1Saq: 7, mid1Descriptive: 11, mid1Total: 22, mid1Percentage: 73.33, classification: 'Regular', mid2Saq: 7, mid2Descriptive: 12, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4636', assignment1: 4, mid1Saq: 6, mid1Descriptive: 12, mid1Total: 22, mid1Percentage: 73.33, classification: 'Regular', mid2Saq: 7, mid2Descriptive: 11, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4639', assignment1: 4, mid1Saq: 6, mid1Descriptive: 11, mid1Total: 21, mid1Percentage: 70.00, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 12, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4642', assignment1: 4, mid1Saq: 6, mid1Descriptive: 12, mid1Total: 22, mid1Percentage: 73.33, classification: 'Regular', mid2Saq: 7, mid2Descriptive: 12, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '24475A4601', assignment1: 4, mid1Saq: 6, mid1Descriptive: 12, mid1Total: 22, mid1Percentage: 73.33, classification: 'Regular', mid2Saq: 7, mid2Descriptive: 13, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },

  // 23 Regular (60% - 69% i.e. 18 - 20.5)
  { rollNumber: '23471A4602', assignment1: 4, mid1Saq: 5, mid1Descriptive: 11, mid1Total: 20, mid1Percentage: 66.67, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 11, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4604', assignment1: 4, mid1Saq: 6, mid1Descriptive: 10, mid1Total: 20, mid1Percentage: 66.67, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4606', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 11, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4608', assignment1: 4, mid1Saq: 5, mid1Descriptive: 11, mid1Total: 20, mid1Percentage: 66.67, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4609', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4611', assignment1: 4, mid1Saq: 5, mid1Descriptive: 11, mid1Total: 20, mid1Percentage: 66.67, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 11, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4613', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 5, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4616', assignment1: 4, mid1Saq: 6, mid1Descriptive: 10, mid1Total: 20, mid1Percentage: 66.67, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 11, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4618', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4622', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 5, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4624', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4626', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4629', assignment1: 4, mid1Saq: 5, mid1Descriptive: 9, mid1Total: 18, mid1Percentage: 60.00, classification: 'Regular', mid2Saq: 5, mid2Descriptive: 9, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4631', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4632', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4634', assignment1: 4, mid1Saq: 5, mid1Descriptive: 9, mid1Total: 18, mid1Percentage: 60.00, classification: 'Regular', mid2Saq: 5, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4635', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4637', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 5, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4638', assignment1: 4, mid1Saq: 5, mid1Descriptive: 9, mid1Total: 18, mid1Percentage: 60.00, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 9, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4640', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4643', assignment1: 4, mid1Saq: 5, mid1Descriptive: 11, mid1Total: 20, mid1Percentage: 66.67, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 11, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4646', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4648', assignment1: 4, mid1Saq: 5, mid1Descriptive: 10, mid1Total: 19, mid1Percentage: 63.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 10, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },

  // 5 Regular (50% - 59% i.e. 15 - 17.5)
  { rollNumber: '23471A4651', assignment1: 3, mid1Saq: 5, mid1Descriptive: 8, mid1Total: 16, mid1Percentage: 53.33, classification: 'Regular', mid2Saq: 5, mid2Descriptive: 8, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4652', assignment1: 3, mid1Saq: 5, mid1Descriptive: 9, mid1Total: 17, mid1Percentage: 56.67, classification: 'Regular', mid2Saq: 5, mid2Descriptive: 9, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '23471A4654', assignment1: 3, mid1Saq: 5, mid1Descriptive: 8, mid1Total: 16, mid1Percentage: 53.33, classification: 'Regular', mid2Saq: 5, mid2Descriptive: 8, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '24475A4603', assignment1: 3, mid1Saq: 5, mid1Descriptive: 8, mid1Total: 16, mid1Percentage: 53.33, classification: 'Regular', mid2Saq: 6, mid2Descriptive: 8, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' },
  { rollNumber: '24475A4604', assignment1: 3, mid1Saq: 5, mid1Descriptive: 8, mid1Total: 16, mid1Percentage: 53.33, classification: 'Regular', mid2Saq: 5, mid2Descriptive: 8, assignment2: null, mid2Total: null, mid2Percentage: null, isAbsentMid1: false, absenceNote: '' }
];

export const INITIAL_MID_EXAM_ANALYSES = [
  {
    id: 'mid_analysis_cys_2025_26_ccdf',
    department: 'CYS',
    departmentName: 'Cyber Security',
    academicYear: '2025-26',
    regulation: 'R23',
    batch: '2023',
    year: 'III Year',
    semester: 'II Semester',
    subjectName: 'Cyber Crime & Digital Forensics',
    subjectCode: 'R23CY3201',
    mid1Date: '2025-12-15',
    mid2Date: '2026-03-20',
    status: 'REVIEW_REQUIRED',
    mid1Status: 'COMPLETE',
    mid2Status: 'PARTIAL_DATA',
    metadataConflictNote: 'Mid-II sheet header references Semester I Mid Examination template, while canonical syllabus corresponds to III Year II Semester CCDF.',
    assignment1Max: 5,
    mid1SaqMax: 10,
    mid1DescriptiveMax: 15,
    totalMax: 30,
    studentsCount: 60,
    advancedLearnersCount: 12,
    weakLearnersCount: 4,
    mid1Average: 20.28,
    mid1Percentage: 67.61,
    distribution: {
      above80: 12,
      band70_79: 16,
      band60_69: 23,
      band50_59: 5,
      below50: 4
    },
    students: CANONICAL_CCDF_STUDENTS,
    advancedActivities: [
      {
        id: 'adv_act_1',
        date: '2026-01-10',
        topic: 'Memory Forensics & Malware Analysis with Volatility Framework',
        facultyGuide: 'Dr. S. Venkateswarlu',
        remarks: 'Seminar conducted for 12 advanced learners to develop advanced forensic triage capabilities.'
      }
    ],
    weakActivities: [
      {
        id: 'weak_act_1',
        date: '2026-01-05',
        topic: 'Digital Forensics Evidence Acquisition Fundamentals & File Carving',
        facultyGuide: 'Dr. S. Venkateswarlu',
        remarks: 'Remedial coaching on descriptive question framing and short-answer clarity.'
      }
    ],
    remedialSessions: [
      {
        id: 'rem_session_1',
        sessionDate: '2026-01-05',
        topic: 'Digital Forensics Evidence Acquisition Fundamentals & File Carving',
        facultyName: 'Dr. S. Venkateswarlu',
        remarks: 'Special remedial class conducted for students identified with Mid-I shortfalls.',
        attendance: {
          '23471A4614': 'PRESENT',
          '23471A4623': 'PRESENT',
          '23471A4627': 'PRESENT',
          '23471A4641': 'ABSENT'
        }
      },
      {
        id: 'rem_session_2',
        sessionDate: '2026-01-12',
        topic: 'Chain of Custody, Hash Verification & Write Blockers',
        facultyName: 'Dr. S. Venkateswarlu',
        remarks: 'Hands-on practice session on MD5/SHA256 evidence integrity.',
        attendance: {
          '23471A4614': 'PRESENT',
          '23471A4623': 'PRESENT',
          '23471A4627': 'PRESENT',
          '23471A4641': 'PRESENT'
        }
      }
    ],
    importHistory: [
      {
        id: 'job_ccdf_source_1',
        originalFilename: 'III-II CS R23 CCDF MID INFORMATION.xlsx',
        sha256: 'sha256_ccdf_canonical_2026',
        uploadedBy: 'Course Coordinator',
        uploadedAt: '2026-01-02T10:00:00Z',
        sheetsDetected: 12,
        rawSheetsImported: ['ASSIGNMENT-1', 'MID-1', 'MID-2 (Partial)'],
        derivedSheetsRegenerated: ['ANALYSIS-1', 'ANALYSIS -2', 'WEAK STUDENTS', 'ADVANCED LEARNERS', 'IMPROVED'],
        status: 'VERIFIED_MID1'
      }
    ],
    created_at: '2026-01-02T10:00:00.000Z',
    updated_at: '2026-01-02T10:00:00.000Z'
  }
];

// Helper: Get All Analyses with storage fallback
export function getMidExamAnalyses(filters = {}) {
  let list = [];
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(MID_EXAM_STORAGE_KEY);
      list = raw ? JSON.parse(raw) : INITIAL_MID_EXAM_ANALYSES;
    } catch {
      list = INITIAL_MID_EXAM_ANALYSES;
    }
  } else {
    list = INITIAL_MID_EXAM_ANALYSES;
  }

  if (filters.department && filters.department !== 'ALL') {
    list = list.filter(a => (a.department || '').toUpperCase() === filters.department.toUpperCase());
  }
  if (filters.academicYear && filters.academicYear !== 'ALL') {
    list = list.filter(a => a.academicYear === filters.academicYear);
  }
  if (filters.year && filters.year !== 'ALL') {
    list = list.filter(a => a.year === filters.year);
  }
  if (filters.semester && filters.semester !== 'ALL') {
    list = list.filter(a => a.semester === filters.semester);
  }

  return list;
}

// Helper: Get Single Analysis
export function getMidExamAnalysisById(id) {
  const list = getMidExamAnalyses();
  return list.find(a => a.id === id) || list[0] || null;
}

// Helper: Save Analysis
export function saveMidExamAnalysis(analysisData) {
  const current = getMidExamAnalyses();
  const existingIdx = current.findIndex(a => a.id === analysisData.id);
  
  let updated;
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...analysisData, updated_at: new Date().toISOString() };
  } else {
    updated = [
      {
        ...analysisData,
        id: analysisData.id || `mid_analysis_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      ...current
    ];
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(MID_EXAM_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated.find(a => a.id === analysisData.id) || updated[0];
}

// Helper: Score Calculation Engine
export function calculateStudentMid1(ass1Raw, saqRaw, desRaw) {
  const isAss1Absent = ass1Raw === 'AB' || ass1Raw === 'ab';
  const isSaqAbsent = saqRaw === 'AB' || saqRaw === 'ab';
  const isDesAbsent = desRaw === 'AB' || desRaw === 'ab';

  const ass1Num = isAss1Absent ? 0 : Number(ass1Raw) || 0;
  const saqNum = isSaqAbsent ? 0 : Number(saqRaw) || 0;
  const desNum = isDesAbsent ? 0 : Number(desRaw) || 0;

  const total = ass1Num + saqNum + desNum;
  const percentage = Number(((total / 30) * 100).toFixed(2));

  let classification = 'Regular';
  if (percentage >= 80) {
    classification = 'Advanced Learner';
  } else if (percentage < 50) {
    classification = 'Weak Learner';
  }

  return {
    assignment1: isAss1Absent ? 'AB' : ass1Num,
    mid1Saq: isSaqAbsent ? 'AB' : saqNum,
    mid1Descriptive: isDesAbsent ? 'AB' : desNum,
    mid1Total: total,
    mid1Percentage: percentage,
    classification,
    isAbsentMid1: isAss1Absent || isSaqAbsent || isDesAbsent
  };
}

// -------------------------------------------------------------
// 1. PDF Institutional Header Helper
// -------------------------------------------------------------
function addInstitutionalPdfHeader(doc, title, subtitle, metadata = {}) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = margin;

  // Header Banner
  doc.setFillColor(11, 25, 44);
  doc.rect(margin, y, pageWidth - (margin * 2), 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('NARASARAOPETA ENGINEERING COLLEGE (AUTONOMOUS)', pageWidth / 2, y + 7, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(212, 175, 55);
  doc.text('Approved by AICTE, Affiliated to JNTUK, Accredited with NAAC "A+" Grade & NBA', pageWidth / 2, y + 13, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text(`DEPARTMENT OF EMERGING TECHNOLOGIES — ${metadata.departmentName || 'CYBER SECURITY'}`, pageWidth / 2, y + 19, { align: 'center' });

  y += 28;

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(11, 25, 44);
  doc.text(title.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 5;

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, pageWidth / 2, y, { align: 'center' });
    y += 6;
  }

  // Course Context Box
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, pageWidth - (margin * 2), 12, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, pageWidth - (margin * 2), 12, 'S');

  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  
  const col1 = margin + 3;
  const col2 = margin + 55;
  const col3 = margin + 115;

  doc.text(`Subject: ${metadata.subjectName || 'CCDF'} (${metadata.subjectCode || 'R23CY3201'})`, col1, y + 5);
  doc.text(`Year/Sem: ${metadata.year || 'III Year'} - ${metadata.semester || 'II Sem'}`, col2, y + 5);
  doc.text(`Academic Year: ${metadata.academicYear || '2025-26'}`, col3, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.text(`Regulation: ${metadata.regulation || 'R23'} | Batch: ${metadata.batch || '2023'}`, col1, y + 9);
  doc.text(`Assessment Basis: Mid-I (30 Marks)`, col2, y + 9);
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, col3, y + 9);

  return y + 16;
}

// -------------------------------------------------------------
// 2. Remedial Attendance Sheet (Excel & PDF)
// -------------------------------------------------------------
export function exportRemedialAttendanceXLSX(analysis, { prefilled = true, sessionCount = 6 } = {}) {
  const wb = XLSX.utils.book_new();

  const weakList = prefilled ? (analysis.students || []).filter(s => s.mid1Percentage < 50) : [];

  const sessionCols = [];
  for (let i = 1; i <= sessionCount; i++) {
    sessionCols.push(`Session ${i}\nDate: _______`);
  }

  const headerRows = [
    ['NARASARAOPETA ENGINEERING COLLEGE (AUTONOMOUS)'],
    [`DEPARTMENT OF ${analysis.departmentName ? analysis.departmentName.toUpperCase() : 'CYBER SECURITY'}`],
    ['MAKEUP & REMEDIAL CLASSES ATTENDANCE FOR SLOW STUDENTS'],
    [],
    ['Subject Name:', analysis.subjectName, 'Subject Code:', analysis.subjectCode, 'Academic Year:', analysis.academicYear],
    ['Year & Semester:', `${analysis.year} ${analysis.semester}`, 'Regulation:', analysis.regulation, 'Target Threshold:', '< 50% (< 15/30)'],
    [],
    ['S.No', 'Roll Number', 'Student Name', 'Mid-I Marks (/30)', 'Percentage', ...sessionCols, 'Remarks / Status']
  ];

  const dataRows = [];
  if (prefilled && weakList.length > 0) {
    weakList.forEach((s, idx) => {
      const row = [
        idx + 1,
        s.rollNumber,
        s.studentName || '—',
        s.mid1Total,
        `${s.mid1Percentage}%`,
        ...Array(sessionCount).fill(''),
        'Weak Learner (<50%)'
      ];
      dataRows.push(row);
    });
  } else {
    // 10 blank rows for manual entry
    for (let i = 1; i <= 10; i++) {
      dataRows.push([i, '', '', '', '', ...Array(sessionCount).fill(''), '']);
    }
  }

  // Footer Signatures
  const footerRows = [
    [],
    [],
    ['Signature of Course Faculty: ____________________', '', '', '', 'Signature of Head of Department: ____________________']
  ];

  const ws = XLSX.utils.aoa_to_sheet([...headerRows, ...dataRows, ...footerRows]);
  XLSX.utils.book_append_sheet(wb, ws, 'REMEDIAL ATTENDANCE');
  XLSX.writeFile(wb, `Remedial_Attendance_${prefilled ? 'Prefilled' : 'Blank'}_${analysis.subjectCode}_${analysis.academicYear}.xlsx`);
}

export function exportRemedialAttendancePDF(analysis, { prefilled = true, sessionCount = 6 } = {}) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const startY = addInstitutionalPdfHeader(
    doc,
    'MAKEUP & REMEDIAL CLASSES ATTENDANCE FOR SLOW STUDENTS',
    'Mandatory academic intervention record for students scoring below 50% in Mid-I Examination',
    analysis
  );

  const weakList = prefilled ? (analysis.students || []).filter(s => s.mid1Percentage < 50) : [];

  const sessionCols = [];
  for (let i = 1; i <= sessionCount; i++) {
    sessionCols.push(`Sess ${i}\n__/__`);
  }

  const tableHead = [
    ['S.No', 'Roll Number', 'Student Name', 'Mid-I /30', '%', ...sessionCols, 'Remarks']
  ];

  const tableBody = [];
  if (prefilled && weakList.length > 0) {
    weakList.forEach((s, idx) => {
      tableBody.push([
        idx + 1,
        s.rollNumber,
        s.studentName || '—',
        s.mid1Total,
        `${s.mid1Percentage}%`,
        ...Array(sessionCount).fill(''),
        s.isAbsentMid1 ? 'Absent Flagged' : 'Low Score'
      ]);
    });
  } else {
    for (let i = 1; i <= 10; i++) {
      tableBody.push([i, '', '', '', '', ...Array(sessionCount).fill(''), '']);
    }
  }

  autoTable(doc, {
    startY,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2.5, halign: 'center' },
    headStyles: { fillColor: [11, 25, 44], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 28, halign: 'left', fontStyle: 'bold' },
      2: { cellWidth: 35, halign: 'left' },
      3: { cellWidth: 18 },
      4: { cellWidth: 16 }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 18;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Signature of Faculty / Course Coordinator', 18, finalY);
  doc.text('Signature of Head of Department (HOD)', 200, finalY);

  doc.save(`Remedial_Attendance_${prefilled ? 'Prefilled' : 'Blank'}_${analysis.subjectCode}.pdf`);
}

// -------------------------------------------------------------
// 3. Advanced Learners Report & Activities (Excel & PDF)
// -------------------------------------------------------------
export function exportAdvancedLearnersCSV(analysis) {
  if (!analysis || !analysis.students) return;
  const advancedList = analysis.students.filter(s => s.mid1Percentage >= 80);
  
  const headers = [
    'Academic Year', 'Department', 'Batch', 'Year', 'Semester', 'Regulation', 
    'Subject', 'Subject Code', 'Roll Number', 'Student Name', 'Assignment /5', 
    'SAQ /10', 'Descriptive /15', 'Total /30', 'Percentage (%)', 'Learner Classification'
  ];

  const rows = advancedList.map(s => [
    analysis.academicYear,
    analysis.departmentName || analysis.department,
    analysis.batch,
    analysis.year,
    analysis.semester,
    analysis.regulation,
    analysis.subjectName,
    analysis.subjectCode,
    s.rollNumber,
    s.studentName || '—',
    s.assignment1,
    s.mid1Saq,
    s.mid1Descriptive,
    s.mid1Total,
    `${s.mid1Percentage}%`,
    'Advanced Learner (≥80%)'
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Advanced_Learners_80_Percent_${analysis.subjectCode}_${analysis.academicYear}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function exportAdvancedLearnersXLSX(analysis) {
  const wb = XLSX.utils.book_new();
  const advancedList = (analysis.students || []).filter(s => s.mid1Percentage >= 80);

  const headerRows = [
    ['NARASARAOPETA ENGINEERING COLLEGE (AUTONOMOUS)'],
    [`DEPARTMENT OF ${analysis.departmentName ? analysis.departmentName.toUpperCase() : 'CYBER SECURITY'}`],
    ['ADVANCED LEARNERS PERFORMANCE REPORT (≥80%)'],
    [],
    ['Subject:', analysis.subjectName, 'Code:', analysis.subjectCode, 'AY:', analysis.academicYear],
    ['Year/Sem:', `${analysis.year} ${analysis.semester}`, 'Regulation:', analysis.regulation, 'Advanced Count:', `${advancedList.length} Students`],
    [],
    ['S.No', 'Roll Number', 'Student Name', 'Assignment (/5)', 'Mid-I SAQ (/10)', 'Mid-I DES (/15)', 'Total (/30)', 'Percentage', 'Classification']
  ];

  const dataRows = advancedList.map((s, idx) => [
    idx + 1,
    s.rollNumber,
    s.studentName || '—',
    s.assignment1,
    s.mid1Saq,
    s.mid1Descriptive,
    s.mid1Total,
    `${s.mid1Percentage}%`,
    'Advanced Learner (≥80%)'
  ]);

  const ws = XLSX.utils.aoa_to_sheet([...headerRows, ...dataRows]);
  XLSX.utils.book_append_sheet(wb, ws, 'ADVANCED LEARNERS');
  XLSX.writeFile(wb, `Advanced_Learners_80_Percent_${analysis.subjectCode}_${analysis.academicYear}.xlsx`);
}

export function exportAdvancedLearnersPDF(analysis) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const startY = addInstitutionalPdfHeader(
    doc,
    'ADVANCED LEARNERS PERFORMANCE REPORT (≥80%)',
    'Official academic record of high performers identified for advanced topics & technical seminars',
    analysis
  );

  const advancedList = (analysis.students || []).filter(s => s.mid1Percentage >= 80);

  const tableHead = [
    ['S.No', 'Roll Number', 'Student Name', 'Ass (/5)', 'SAQ (/10)', 'DES (/15)', 'Total /30', '%']
  ];

  const tableBody = advancedList.map((s, idx) => [
    idx + 1,
    s.rollNumber,
    s.studentName || '—',
    s.assignment1,
    s.mid1Saq,
    s.mid1Descriptive,
    s.mid1Total,
    `${s.mid1Percentage}%`
  ]);

  autoTable(doc, {
    startY,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
    headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 32, halign: 'left', fontStyle: 'bold' },
      2: { cellWidth: 48, halign: 'left' }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 16;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Signature of Faculty Coordinator', 18, finalY);
  doc.text('Signature of Head of Department (HOD)', 130, finalY);

  doc.save(`Advanced_Learners_80_Percent_${analysis.subjectCode}.pdf`);
}

export function exportAdvancedEvidenceXLSX(analysis) {
  const wb = XLSX.utils.book_new();

  const headerRows = [
    ['NARASARAOPETA ENGINEERING COLLEGE (AUTONOMOUS)'],
    [`DEPARTMENT OF ${analysis.departmentName ? analysis.departmentName.toUpperCase() : 'CYBER SECURITY'}`],
    ['TOPICS / ENRICHMENT ACTIVITIES FOR ADVANCED LEARNERS'],
    [],
    ['Subject:', analysis.subjectName, 'Code:', analysis.subjectCode, 'AY:', analysis.academicYear],
    ['Year/Sem:', `${analysis.year} ${analysis.semester}`, 'Regulation:', analysis.regulation, 'Learner Group:', 'Score ≥ 80%'],
    [],
    ['S.No', 'Date', 'Name of the Topic / Advanced Activity', 'Target Student Roll(s)', 'Faculty Guide / Name', 'Signature of Faculty', 'Remarks']
  ];

  const dataRows = (analysis.advancedActivities && analysis.advancedActivities.length > 0)
    ? analysis.advancedActivities.map((act, idx) => [
        idx + 1,
        act.date,
        act.topic,
        'All Advanced (12)',
        act.facultyGuide,
        '',
        act.remarks || ''
      ])
    : [
        [1, '', '', '', '', '', ''],
        [2, '', '', '', '', '', ''],
        [3, '', '', '', '', '', ''],
        [4, '', '', '', '', '', '']
      ];

  const ws = XLSX.utils.aoa_to_sheet([...headerRows, ...dataRows]);
  XLSX.utils.book_append_sheet(wb, ws, 'EVIDENCE-ADVANCED');
  XLSX.writeFile(wb, `Advanced_Learner_Activities_${analysis.subjectCode}_${analysis.academicYear}.xlsx`);
}

// -------------------------------------------------------------
// 4. Weak Learners Report & Evidence (Excel & PDF)
// -------------------------------------------------------------
export function exportWeakLearnersCSV(analysis) {
  if (!analysis || !analysis.students) return;
  const weakList = analysis.students.filter(s => s.mid1Percentage < 50);

  const headers = [
    'Academic Year', 'Department', 'Batch', 'Year', 'Semester', 'Regulation', 
    'Subject', 'Subject Code', 'Roll Number', 'Student Name', 'Assignment /5', 
    'SAQ /10', 'Descriptive /15', 'Total /30', 'Percentage (%)', 'Absence Status', 
    'Learner Classification', 'Remedial Action'
  ];

  const rows = weakList.map(s => [
    analysis.academicYear,
    analysis.departmentName || analysis.department,
    analysis.batch,
    analysis.year,
    analysis.semester,
    analysis.regulation,
    analysis.subjectName,
    analysis.subjectCode,
    s.rollNumber,
    s.studentName || '—',
    s.assignment1,
    s.mid1Saq,
    s.mid1Descriptive,
    s.mid1Total,
    `${s.mid1Percentage}%`,
    s.isAbsentMid1 ? (s.absenceNote || 'Absent') : 'Appeared',
    'Weak Learner (<50%)',
    'Scheduled for Makeup / Remedial Class'
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Weak_Learners_Under_50_Percent_${analysis.subjectCode}_${analysis.academicYear}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function exportWeakLearnersXLSX(analysis) {
  const wb = XLSX.utils.book_new();
  const weakList = (analysis.students || []).filter(s => s.mid1Percentage < 50);

  const headerRows = [
    ['NARASARAOPETA ENGINEERING COLLEGE (AUTONOMOUS)'],
    [`DEPARTMENT OF ${analysis.departmentName ? analysis.departmentName.toUpperCase() : 'CYBER SECURITY'}`],
    ['WEAK / SLOW LEARNERS PERFORMANCE REPORT (<50%)'],
    [],
    ['Subject:', analysis.subjectName, 'Code:', analysis.subjectCode, 'AY:', analysis.academicYear],
    ['Year/Sem:', `${analysis.year} ${analysis.semester}`, 'Regulation:', analysis.regulation, 'Weak Count:', `${weakList.length} Students`],
    [],
    ['S.No', 'Roll Number', 'Student Name', 'Assignment (/5)', 'Mid-I SAQ (/10)', 'Mid-I DES (/15)', 'Total (/30)', 'Percentage', 'Absence Notes', 'Remedial Action']
  ];

  const dataRows = weakList.map((s, idx) => [
    idx + 1,
    s.rollNumber,
    s.studentName || '—',
    s.assignment1,
    s.mid1Saq,
    s.mid1Descriptive,
    s.mid1Total,
    `${s.mid1Percentage}%`,
    s.absenceNote || 'Appeared',
    'Mandatory Remedial Classes'
  ]);

  const ws = XLSX.utils.aoa_to_sheet([...headerRows, ...dataRows]);
  XLSX.utils.book_append_sheet(wb, ws, 'WEAK LEARNERS');
  XLSX.writeFile(wb, `Weak_Learners_Under_50_Percent_${analysis.subjectCode}_${analysis.academicYear}.xlsx`);
}

export function exportWeakLearnersPDF(analysis) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const startY = addInstitutionalPdfHeader(
    doc,
    'WEAK / SLOW LEARNERS IDENTIFICATION REPORT (<50%)',
    'Official academic record of students requiring mandatory makeup classes and remedial monitoring',
    analysis
  );

  const weakList = (analysis.students || []).filter(s => s.mid1Percentage < 50);

  const tableHead = [
    ['S.No', 'Roll Number', 'Student Name', 'Ass (/5)', 'SAQ (/10)', 'DES (/15)', 'Total /30', '%', 'Absence Note']
  ];

  const tableBody = weakList.map((s, idx) => [
    idx + 1,
    s.rollNumber,
    s.studentName || '—',
    s.assignment1,
    s.mid1Saq,
    s.mid1Descriptive,
    s.mid1Total,
    `${s.mid1Percentage}%`,
    s.absenceNote || 'Appeared'
  ]);

  autoTable(doc, {
    startY,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
    headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 32, halign: 'left', fontStyle: 'bold' },
      2: { cellWidth: 42, halign: 'left' },
      8: { cellWidth: 38, halign: 'left' }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 16;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Signature of Remedial Coordinator', 18, finalY);
  doc.text('Signature of Head of Department (HOD)', 130, finalY);

  doc.save(`Weak_Learners_Under_50_Percent_${analysis.subjectCode}.pdf`);
}

export function exportWeakEvidenceXLSX(analysis) {
  const wb = XLSX.utils.book_new();

  const headerRows = [
    ['NARASARAOPETA ENGINEERING COLLEGE (AUTONOMOUS)'],
    [`DEPARTMENT OF ${analysis.departmentName ? analysis.departmentName.toUpperCase() : 'CYBER SECURITY'}`],
    ['TOPICS / REMEDIAL COACHING FOR SLOW / WEAK LEARNERS'],
    [],
    ['Subject:', analysis.subjectName, 'Code:', analysis.subjectCode, 'AY:', analysis.academicYear],
    ['Year/Sem:', `${analysis.year} ${analysis.semester}`, 'Regulation:', analysis.regulation, 'Target Threshold:', '< 50% (< 15/30)'],
    [],
    ['S.No', 'Date', 'Remedial Topic / Focus Area', 'Target Students', 'Faculty Guide / Name', 'Signature of Faculty', 'Remarks']
  ];

  const dataRows = (analysis.weakActivities && analysis.weakActivities.length > 0)
    ? analysis.weakActivities.map((act, idx) => [
        idx + 1,
        act.date,
        act.topic,
        'Weak Cohort (4)',
        act.facultyGuide,
        '',
        act.remarks || ''
      ])
    : [
        [1, '', '', '', '', '', ''],
        [2, '', '', '', '', '', ''],
        [3, '', '', '', '', '', ''],
        [4, '', '', '', '', '', '']
      ];

  const ws = XLSX.utils.aoa_to_sheet([...headerRows, ...dataRows]);
  XLSX.utils.book_append_sheet(wb, ws, 'EVIDENCE-WEAK');
  XLSX.writeFile(wb, `Weak_Learner_Topics_${analysis.subjectCode}_${analysis.academicYear}.xlsx`);
}

// -------------------------------------------------------------
// 5. Improvement Analysis Sheet (Excel & PDF)
// -------------------------------------------------------------
export function exportImprovementAnalysisXLSX(analysis) {
  const wb = XLSX.utils.book_new();
  const weakList = (analysis.students || []).filter(s => s.mid1Percentage < 50);

  const headerRows = [
    ['NARASARAOPETA ENGINEERING COLLEGE (AUTONOMOUS)'],
    [`DEPARTMENT OF ${analysis.departmentName ? analysis.departmentName.toUpperCase() : 'CYBER SECURITY'}`],
    ['IMPACT ANALYSIS AFTER II MID ON REMEDIAL CLASSES CONDUCTED FOR WEAK STUDENTS'],
    [],
    ['Subject:', analysis.subjectName, 'Code:', analysis.subjectCode, 'AY:', analysis.academicYear],
    ['Year/Sem:', `${analysis.year} ${analysis.semester}`, 'Regulation:', analysis.regulation, 'Intervention Cohort:', 'Mid-I Weak Students'],
    [],
    ['S.No', 'Roll Number', 'Student Name', 'Mid-I Total (/30)', 'Mid-I %', 'Mid-II Total (/30)', 'Mid-II %', 'Marks Change', 'Percentage Change', 'Remarks / Improvement Status']
  ];

  const dataRows = weakList.map((s, idx) => {
    const mid2Tot = s.mid2Total != null ? s.mid2Total : 'Pending';
    const mid2Pct = s.mid2Percentage != null ? `${s.mid2Percentage}%` : 'Pending';
    const marksDelta = s.mid2Total != null ? (s.mid2Total - s.mid1Total) : '—';
    const pctDelta = s.mid2Percentage != null ? `${(s.mid2Percentage - s.mid1Percentage).toFixed(2)}%` : '—';

    return [
      idx + 1,
      s.rollNumber,
      s.studentName || '—',
      s.mid1Total,
      `${s.mid1Percentage}%`,
      mid2Tot,
      mid2Pct,
      marksDelta,
      pctDelta,
      s.improvementRemarks || 'Remedial coaching provided'
    ];
  });

  const footerRows = [
    [],
    ['Signature of Course Faculty: ____________________', '', '', '', 'Signature of Head of Department: ____________________']
  ];

  const ws = XLSX.utils.aoa_to_sheet([...headerRows, ...dataRows, ...footerRows]);
  XLSX.utils.book_append_sheet(wb, ws, 'IMPROVEMENT ANALYSIS');
  XLSX.writeFile(wb, `Improvement_Analysis_${analysis.subjectCode}_${analysis.academicYear}.xlsx`);
}

export function exportImprovementAnalysisPDF(analysis) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const startY = addInstitutionalPdfHeader(
    doc,
    'IMPACT ANALYSIS AFTER II MID ON REMEDIAL CLASSES CONDUCTED FOR WEAK STUDENTS',
    'Comparative evaluation tracking academic improvement of the Mid-I weak cohort after remedial sessions',
    analysis
  );

  const weakList = (analysis.students || []).filter(s => s.mid1Percentage < 50);

  const tableHead = [
    ['S.No', 'Roll Number', 'Student Name', 'Mid-I /30', 'Mid-I %', 'Mid-II /30', 'Mid-II %', 'Marks Δ', '% Δ', 'Remarks']
  ];

  const tableBody = weakList.map((s, idx) => {
    const mid2Tot = s.mid2Total != null ? s.mid2Total : 'Pending';
    const mid2Pct = s.mid2Percentage != null ? `${s.mid2Percentage}%` : 'Pending';
    const marksDelta = s.mid2Total != null ? (s.mid2Total - s.mid1Total) : '—';
    const pctDelta = s.mid2Percentage != null ? `${(s.mid2Percentage - s.mid1Percentage).toFixed(2)}%` : '—';

    return [
      idx + 1,
      s.rollNumber,
      s.studentName || '—',
      s.mid1Total,
      `${s.mid1Percentage}%`,
      mid2Tot,
      mid2Pct,
      marksDelta,
      pctDelta,
      s.improvementRemarks || 'Remedial coaching provided'
    ];
  });

  autoTable(doc, {
    startY,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
    headStyles: { fillColor: [11, 25, 44], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 32, halign: 'left', fontStyle: 'bold' },
      2: { cellWidth: 45, halign: 'left' }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 16;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Signature of Faculty / Course Coordinator', 18, finalY);
  doc.text('Signature of Head of Department (HOD)', 200, finalY);

  doc.save(`Improvement_Analysis_${analysis.subjectCode}.pdf`);
}

// -------------------------------------------------------------
// 6. Consolidated Mid Analysis Reports (CSV, PDF, Full XLSX)
// -------------------------------------------------------------
export function exportConsolidatedMidCSV(analysis) {
  if (!analysis || !analysis.students) return;

  const headers = [
    'Roll Number', 'Student Name', 'Department', 'Subject Code', 'Mid-I Ass /5', 
    'Mid-I SAQ /10', 'Mid-I DES /15', 'Mid-I Total /30', 'Mid-I %', 'Mid-II SAQ /10', 
    'Mid-II DES /15', 'Mid-II Ass /5', 'Classification'
  ];

  const rows = analysis.students.map(s => [
    s.rollNumber,
    s.studentName || '—',
    analysis.department,
    analysis.subjectCode,
    s.assignment1,
    s.mid1Saq,
    s.mid1Descriptive,
    s.mid1Total,
    `${s.mid1Percentage}%`,
    s.mid2Saq != null ? s.mid2Saq : '—',
    s.mid2Descriptive != null ? s.mid2Descriptive : '—',
    s.assignment2 != null ? s.assignment2 : 'Pending',
    s.classification
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Consolidated_Mid_Analysis_${analysis.subjectCode}_${analysis.academicYear}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function exportConsolidatedMidPDF(analysis) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const startY = addInstitutionalPdfHeader(
    doc,
    'CONSOLIDATED MID EXAMINATION MARKS & LEARNER ANALYSIS',
    'Comprehensive institutional assessment ledger across Assignment-I, Mid-I and Mid-II evaluations',
    analysis
  );

  const tableHead = [
    ['S.No', 'Roll Number', 'Student Name', 'Ass-I /5', 'SAQ /10', 'DES /15', 'Mid-I /30', 'Mid-I %', 'Mid-II SAQ', 'Mid-II DES', 'Classification']
  ];

  const tableBody = (analysis.students || []).map((s, idx) => [
    idx + 1,
    s.rollNumber,
    s.studentName || '—',
    s.assignment1,
    s.mid1Saq,
    s.mid1Descriptive,
    s.mid1Total,
    `${s.mid1Percentage}%`,
    s.mid2Saq != null ? s.mid2Saq : '—',
    s.mid2Descriptive != null ? s.mid2Descriptive : '—',
    s.classification
  ]);

  autoTable(doc, {
    startY,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 2, halign: 'center' },
    headStyles: { fillColor: [11, 25, 44], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 26, halign: 'left', fontStyle: 'bold' },
      2: { cellWidth: 40, halign: 'left' }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 16;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Signature of Faculty / Course Coordinator', 18, finalY);
  doc.text('Signature of Head of Department (HOD)', 200, finalY);

  doc.save(`Consolidated_Mid_Analysis_${analysis.subjectCode}.pdf`);
}

export function exportFullAcademicWorkbookXLSX(analysis) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: INFO
  const infoData = [
    ['NARASARAOPETA ENGINEERING COLLEGE (AUTONOMOUS)'],
    ['DEPARTMENT OF EMERGING TECHNOLOGIES'],
    ['FULL ACADEMIC MID EXAMINATION ANALYSIS WORKBOOK'],
    [],
    ['METADATA FIELD', 'VALUE'],
    ['Department', analysis.departmentName || 'Cyber Security'],
    ['Department Code', analysis.department || 'CYS'],
    ['Academic Year', analysis.academicYear],
    ['Regulation', analysis.regulation],
    ['Batch', analysis.batch],
    ['Year', analysis.year],
    ['Semester', analysis.semester],
    ['Subject Name', analysis.subjectName],
    ['Subject Code', analysis.subjectCode],
    ['Total Students Analysed', analysis.studentsCount || 60],
    ['Mid-I Class Average', `${analysis.mid1Average || 20.28} / 30 (${analysis.mid1Percentage || 67.61}%)`],
    ['Advanced Learners (≥80%)', analysis.advancedLearnersCount || 12],
    ['Weak Learners (<50%)', analysis.weakLearnersCount || 4]
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(infoData), 'SUMMARY');

  // Sheet 2: STUDENT MARKS
  const marksHeaders = [
    ['S.No', 'Roll Number', 'Student Name', 'Ass-I (/5)', 'Mid-I SAQ (/10)', 'Mid-I DES (/15)', 'Mid-I Total (/30)', 'Mid-I %', 'Mid-II SAQ (/10)', 'Mid-II DES (/15)', 'Ass-II (/5)', 'Classification']
  ];
  const marksRows = (analysis.students || []).map((s, idx) => [
    idx + 1,
    s.rollNumber,
    s.studentName || '—',
    s.assignment1,
    s.mid1Saq,
    s.mid1Descriptive,
    s.mid1Total,
    `${s.mid1Percentage}%`,
    s.mid2Saq != null ? s.mid2Saq : '—',
    s.mid2Descriptive != null ? s.mid2Descriptive : '—',
    s.assignment2 != null ? s.assignment2 : 'Pending',
    s.classification
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([...marksHeaders, ...marksRows]), 'STUDENT MARKS');

  // Sheet 3: ADVANCED LEARNERS
  const advList = (analysis.students || []).filter(s => s.mid1Percentage >= 80);
  const advRows = advList.map((s, idx) => [
    idx + 1, s.rollNumber, s.studentName || '—', s.assignment1, s.mid1Saq, s.mid1Descriptive, s.mid1Total, `${s.mid1Percentage}%`, 'Advanced Learner'
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['S.No', 'Roll Number', 'Name', 'Ass-I', 'SAQ', 'DES', 'Total', '%', 'Classification'], ...advRows]), 'ADVANCED LEARNERS');

  // Sheet 4: WEAK LEARNERS
  const weakList = (analysis.students || []).filter(s => s.mid1Percentage < 50);
  const weakRows = weakList.map((s, idx) => [
    idx + 1, s.rollNumber, s.studentName || '—', s.assignment1, s.mid1Saq, s.mid1Descriptive, s.mid1Total, `${s.mid1Percentage}%`, s.absenceNote || 'Appeared', 'Remedial Scheduled'
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['S.No', 'Roll Number', 'Name', 'Ass-I', 'SAQ', 'DES', 'Total', '%', 'Absence Notes', 'Remedial Status'], ...weakRows]), 'WEAK LEARNERS');

  XLSX.writeFile(wb, `Complete_Mid_Analysis_Workbook_${analysis.subjectCode}_${analysis.academicYear}.xlsx`);
}

// -------------------------------------------------------------
// 7. Generate Blank Mid Analysis Import Template (Clean Multi-sheet)
// -------------------------------------------------------------
export function generateBlankMidTemplateXLSX() {
  const wb = XLSX.utils.book_new();

  // Sheet 1: INFO
  const infoData = [
    ['METADATA FIELD', 'VALUE / CONFIGURATION'],
    ['Department', 'CSE (Cyber Security)'],
    ['Department Code', 'CYS'],
    ['Academic Year', '2025-26'],
    ['Regulation', 'R23'],
    ['Batch', '2023'],
    ['Year', 'III Year'],
    ['Semester', 'II Semester'],
    ['Subject Name', 'Cyber Crime & Digital Forensics'],
    ['Subject Code', 'R23CY3201'],
    ['Mid-I Examination Date', '2025-12-15'],
    ['Mid-II Examination Date', '2026-03-20'],
    ['Assignment Maximum Marks', '5'],
    ['Short Answers (SAQ) Maximum Marks', '10'],
    ['Descriptive Maximum Marks', '15'],
    ['Total Mid Assessment Marks', '30']
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(infoData), 'INFO');

  // Sheet 2: ASSIGNMENT-1
  const ass1Headers = [
    ['S.No', 'H.T.NO', 'Q1 (CO1)', 'Q2 (CO1)', 'Total (/10)', 'Reduced (/5)']
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ass1Headers), 'ASSIGNMENT-1');

  // Sheet 3: MID-1
  const mid1Headers = [
    ['S.No', 'H.T.NO', 'Q1 (a)', 'Q1 (b)', 'Q2 (a)', 'Q2 (b)', 'DES Total (/30)', 'DES Reduced (/15)', 'SAQ Total (/10)']
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(mid1Headers), 'MID-1');

  // Sheet 4: ASSIGNMENT-2
  const ass2Headers = [
    ['S.No', 'H.T.NO', 'Q1 (CO3)', 'Q2 (CO4)', 'Total (/10)', 'Reduced (/5)']
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ass2Headers), 'ASSIGNMENT-2');

  // Sheet 5: MID-2
  const mid2Headers = [
    ['S.No', 'H.T.NO', 'Q1 (a)', 'Q1 (b)', 'Q2 (a)', 'Q2 (b)', 'DES Total (/30)', 'DES Reduced (/15)', 'SAQ Total (/10)']
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(mid2Headers), 'MID-2');

  XLSX.writeFile(wb, 'ET_Mid_Exam_Analysis_Blank_Template.xlsx');
}

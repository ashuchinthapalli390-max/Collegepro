import * as XLSX from 'xlsx';

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
    advancedActivities: [],
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

// Classification & Score Calculation Logic
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

// Generate Blank Mid Analysis XLSX Template (Clean, Zero Formula Errors)
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
  const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
  XLSX.utils.book_append_sheet(wb, wsInfo, 'INFO');

  // Sheet 2: ASSIGNMENT-1
  const ass1Headers = [
    ['S.No', 'H.T.NO', 'Q1 (CO1)', 'Q2 (CO1)', 'Total (/10)', 'Reduced (/5)']
  ];
  const wsAss1 = XLSX.utils.aoa_to_sheet(ass1Headers);
  XLSX.utils.book_append_sheet(wb, wsAss1, 'ASSIGNMENT-1');

  // Sheet 3: MID-1
  const mid1Headers = [
    ['S.No', 'H.T.NO', 'Q1 (a)', 'Q1 (b)', 'Q2 (a)', 'Q2 (b)', 'DES Total (/30)', 'DES Reduced (/15)', 'SAQ Total (/10)']
  ];
  const wsMid1 = XLSX.utils.aoa_to_sheet(mid1Headers);
  XLSX.utils.book_append_sheet(wb, wsMid1, 'MID-1');

  // Sheet 4: ASSIGNMENT-2
  const ass2Headers = [
    ['S.No', 'H.T.NO', 'Q1 (CO3)', 'Q2 (CO4)', 'Total (/10)', 'Reduced (/5)']
  ];
  const wsAss2 = XLSX.utils.aoa_to_sheet(ass2Headers);
  XLSX.utils.book_append_sheet(wb, wsAss2, 'ASSIGNMENT-2');

  // Sheet 5: MID-2
  const mid2Headers = [
    ['S.No', 'H.T.NO', 'Q1 (a)', 'Q1 (b)', 'Q2 (a)', 'Q2 (b)', 'DES Total (/30)', 'DES Reduced (/15)', 'SAQ Total (/10)']
  ];
  const wsMid2 = XLSX.utils.aoa_to_sheet(mid2Headers);
  XLSX.utils.book_append_sheet(wb, wsMid2, 'MID-2');

  // Generate binary and trigger browser download
  XLSX.writeFile(wb, 'ET_Mid_Exam_Analysis_Blank_Template.xlsx');
}

// Dedicated Exporter: Advanced Learners (>= 80%)
export function exportAdvancedLearnersCSV(analysis) {
  if (!analysis || !analysis.students) return;

  const advancedList = analysis.students.filter(s => s.mid1Percentage >= 80);
  
  const headers = [
    'Academic Year',
    'Department',
    'Batch',
    'Year',
    'Semester',
    'Regulation',
    'Subject',
    'Subject Code',
    'Roll Number',
    'Student Name',
    'Assignment /5',
    'SAQ /10',
    'Descriptive /15',
    'Total /30',
    'Percentage (%)',
    'Learner Classification'
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

// Dedicated Exporter: Weak Learners (< 50%)
export function exportWeakLearnersCSV(analysis) {
  if (!analysis || !analysis.students) return;

  const weakList = analysis.students.filter(s => s.mid1Percentage < 50);

  const headers = [
    'Academic Year',
    'Department',
    'Batch',
    'Year',
    'Semester',
    'Regulation',
    'Subject',
    'Subject Code',
    'Roll Number',
    'Student Name',
    'Assignment /5',
    'SAQ /10',
    'Descriptive /15',
    'Total /30',
    'Percentage (%)',
    'Absence Status',
    'Learner Classification',
    'Remedial Action'
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

// Dedicated Exporter: Consolidated Mid Analysis Report
export function exportConsolidatedMidCSV(analysis) {
  if (!analysis || !analysis.students) return;

  const headers = [
    'Roll Number',
    'Student Name',
    'Department',
    'Subject Code',
    'Mid-I Ass /5',
    'Mid-I SAQ /10',
    'Mid-I DES /15',
    'Mid-I Total /30',
    'Mid-I %',
    'Mid-II SAQ /10',
    'Mid-II DES /15',
    'Mid-II Ass /5',
    'Classification'
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

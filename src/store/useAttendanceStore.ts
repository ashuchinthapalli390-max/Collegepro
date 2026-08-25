import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AttendanceBatch, AttendanceRecord, AttendanceAuditLog, Student, ParentContactStatus } from '../types/nec'
import { DepartmentResolver } from '../utils/departmentResolver'

// Realistic ET Student Master Seed
const INITIAL_STUDENT_MASTER: Student[] = [
  // CYS Year III Section A
  { id: 'std-cys-01', rollNumber: '23CYS001', name: 'A. Sai Teja', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Dr. M. Sreenivasa Rao', guardianName: 'A. Venkata Rao', guardianPhone: '9848123401', guardianEmail: 'venkat.a@gmail.com' },
  { id: 'std-cys-02', rollNumber: '23CYS002', name: 'B. Karthik Reddy', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Dr. M. Sreenivasa Rao', guardianName: 'B. Krishna Reddy', guardianPhone: '9848123402' },
  { id: 'std-cys-03', rollNumber: '23CYS003', name: 'C. Divya Sri', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Dr. M. Sreenivasa Rao', guardianName: 'C. Subba Rao', guardianPhone: '9848123403' },
  { id: 'std-cys-04', rollNumber: '23CYS004', name: 'D. Harshavardhan', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Mrs. K. Anitha', guardianName: 'D. Ramesh', guardianPhone: '9848123404' },
  { id: 'std-cys-05', rollNumber: '23CYS005', name: 'E. Monica', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Mrs. K. Anitha', guardianName: 'E. Srinivasa Rao', guardianPhone: '9848123405' },
  { id: 'std-cys-06', rollNumber: '23CYS006', name: 'G. Akhil Kumar', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Mrs. K. Anitha', guardianName: 'G. Mohan Rao', guardianPhone: '9848123406' },
  { id: 'std-cys-07', rollNumber: '23CYS007', name: 'K. Rupa Devi', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Mr. V. Brahmaiah', guardianName: 'K. Venkateswarlu', guardianPhone: '9848123407' },
  { id: 'std-cys-08', rollNumber: '23CYS008', name: 'M. Nikhil', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Mr. V. Brahmaiah', guardianName: 'M. Nagendra', guardianPhone: '9848123408' },
  { id: 'std-cys-09', rollNumber: '23CYS009', name: 'N. Sravanthi', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Mr. V. Brahmaiah', guardianName: 'N. Prasad', guardianPhone: '9848123409' },
  { id: 'std-cys-10', rollNumber: '23CYS010', name: 'P. Charan Teja', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Mr. V. Brahmaiah', guardianName: 'P. Koteswara Rao', guardianPhone: '9848123410' },
  { id: 'std-cys-11', rollNumber: '23CYS011', name: 'R. Bhavana', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Dr. M. Sreenivasa Rao', guardianName: 'R. Rama Rao', guardianPhone: '9848123411' },
  { id: 'std-cys-12', rollNumber: '23CYS012', name: 'S. Tarun', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Dr. M. Sreenivasa Rao', guardianName: 'S. Satyanarayana', guardianPhone: '9848123412' },
  { id: 'std-cys-13', rollNumber: '23CYS013', name: 'T. Vamsi Krishna', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Mrs. K. Anitha', guardianName: 'T. Tirupathi Rao', guardianPhone: '9848123413' },
  { id: 'std-cys-14', rollNumber: '23CYS014', name: 'V. Anusha', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Mrs. K. Anitha', guardianName: 'V. Govinda Rao', guardianPhone: '9848123414' },
  { id: 'std-cys-15', rollNumber: '23CYS015', name: 'Y. Gopi Chand', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Mrs. K. Anitha', guardianName: 'Y. Sambasiva Rao', guardianPhone: '9848123415' },

  // AI Year III Section A
  { id: 'std-ai-01', rollNumber: '23AI001', name: 'A. Rohith', departmentId: 'dept-ai', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Dr. K. Lakshminarayana', guardianName: 'A. Nageswara Rao', guardianPhone: '9848123420' },
  { id: 'std-ai-02', rollNumber: '23AI002', name: 'B. Meghana', departmentId: 'dept-ai', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Dr. K. Lakshminarayana', guardianName: 'B. Suresh Kumar', guardianPhone: '9848123421' },
  { id: 'std-ai-03', rollNumber: '23AI003', name: 'C. Sandeep', departmentId: 'dept-ai', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Dr. K. Lakshminarayana', guardianName: 'C. Appa Rao', guardianPhone: '9848123422' },

  // AIML Year III Section A
  { id: 'std-aiml-01', rollNumber: '23AIML001', name: 'K. Sai Praneeth', departmentId: 'dept-aiml', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Dr. B. Venkata Rao', guardianName: 'K. Ramu', guardianPhone: '9848123430' },
  { id: 'std-aiml-02', rollNumber: '23AIML002', name: 'L. Hema Latha', departmentId: 'dept-aiml', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Dr. B. Venkata Rao', guardianName: 'L. Venkat', guardianPhone: '9848123431' },

  // DS Year III Section A
  { id: 'std-ds-01', rollNumber: '23DS001', name: 'M. Jaswanth', departmentId: 'dept-ds', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Dr. P. Siva Prasad', guardianName: 'M. Srinivasa Rao', guardianPhone: '9848123440' },
  { id: 'std-ds-02', rollNumber: '23DS002', name: 'N. Pooja Sri', departmentId: 'dept-ds', year: 'III', semester: 'I', section: 'A', batch: '2023-2027', mentorName: 'Dr. P. Siva Prasad', guardianName: 'N. Narayana', guardianPhone: '9848123441' }
]

// Initial Seed Batches: July 2026 (REPLACED) and August 2026 (ACTIVE)
const INITIAL_BATCHES: AttendanceBatch[] = [
  {
    id: 'batch-aug-2026-cys-iii-a',
    academicYear: '2026-27',
    departmentId: 'dept-cys',
    year: 'III',
    semester: 'I',
    section: 'A',
    monthYear: 'August 2026',
    fileName: 'III_CYS_A_August_2026.xlsx',
    fileChecksum: 'sha256_august_cys_3a_seed',
    totalStudents: 15,
    riskStudentsCount: 4,
    importedAt: '2026-08-20T14:30:00Z',
    importedBy: 'Dr. M. Sreenivasa Rao (HOD CYS)',
    status: 'ACTIVE'
  },
  {
    id: 'batch-jul-2026-cys-iii-a',
    academicYear: '2026-27',
    departmentId: 'dept-cys',
    year: 'III',
    semester: 'I',
    section: 'A',
    monthYear: 'July 2026',
    fileName: 'III_CYS_A_July_2026.xlsx',
    fileChecksum: 'sha256_july_cys_3a_seed',
    totalStudents: 15,
    riskStudentsCount: 5,
    importedAt: '2026-07-28T11:00:00Z',
    importedBy: 'Dr. M. Sreenivasa Rao (HOD CYS)',
    status: 'REPLACED'
  }
]

// Initial Attendance Records (August 2026)
const INITIAL_RECORDS: AttendanceRecord[] = [
  { id: 'rec-01', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS001', studentName: 'A. Sai Teja', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 98, percentage: 89.09, riskStatus: 'NORMAL', parentContactStatus: 'Pending', guardianName: 'A. Venkata Rao', guardianPhone: '9848123401' },
  { id: 'rec-02', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS002', studentName: 'B. Karthik Reddy', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 67, percentage: 60.91, riskStatus: 'RISK', parentContactStatus: 'Called', lastContactedAt: '2026-08-22', contactNotes: 'Informed father regarding low attendance (60.9%). Medical leave letter requested.', guardianName: 'B. Krishna Reddy', guardianPhone: '9848123402' },
  { id: 'rec-03', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS003', studentName: 'C. Divya Sri', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 102, percentage: 92.73, riskStatus: 'NORMAL', parentContactStatus: 'Pending', guardianName: 'C. Subba Rao', guardianPhone: '9848123403' },
  { id: 'rec-04', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS004', studentName: 'D. Harshavardhan', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 64, percentage: 58.18, riskStatus: 'RISK', parentContactStatus: 'SMS Sent', lastContactedAt: '2026-08-21', contactNotes: 'Condonation alert SMS dispatched to parent phone.', guardianName: 'D. Ramesh', guardianPhone: '9848123404' },
  { id: 'rec-05', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS005', studentName: 'E. Monica', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 88, percentage: 80.00, riskStatus: 'NORMAL', parentContactStatus: 'Pending', guardianName: 'E. Srinivasa Rao', guardianPhone: '9848123405' },
  { id: 'rec-06', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS006', studentName: 'G. Akhil Kumar', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 70, percentage: 63.64, riskStatus: 'RISK', parentContactStatus: 'Parent Met', lastContactedAt: '2026-08-23', contactNotes: 'Guardian visited campus; signed undertaking to maintain >75% from next month.', guardianName: 'G. Mohan Rao', guardianPhone: '9848123406' },
  { id: 'rec-07', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS007', studentName: 'K. Rupa Devi', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 95, percentage: 86.36, riskStatus: 'NORMAL', parentContactStatus: 'Pending', guardianName: 'K. Venkateswarlu', guardianPhone: '9848123407' },
  { id: 'rec-08', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS008', studentName: 'M. Nikhil', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 57, percentage: 51.82, riskStatus: 'RISK', parentContactStatus: 'Notice Dispatched', lastContactedAt: '2026-08-24', contactNotes: 'Formal registered letter sent regarding detention risk (<65%).', guardianName: 'M. Nagendra', guardianPhone: '9848123408' },
  { id: 'rec-09', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS009', studentName: 'N. Sravanthi', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 99, percentage: 90.00, riskStatus: 'NORMAL', parentContactStatus: 'Pending', guardianName: 'N. Prasad', guardianPhone: '9848123409' },
  { id: 'rec-10', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS010', studentName: 'P. Charan Teja', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 82, percentage: 74.55, riskStatus: 'NORMAL', parentContactStatus: 'Pending', guardianName: 'P. Koteswara Rao', guardianPhone: '9848123410' },
  { id: 'rec-11', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS011', studentName: 'R. Bhavana', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 104, percentage: 94.55, riskStatus: 'NORMAL', parentContactStatus: 'Pending', guardianName: 'R. Rama Rao', guardianPhone: '9848123411' },
  { id: 'rec-12', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS012', studentName: 'S. Tarun', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 75, percentage: 68.18, riskStatus: 'NORMAL', parentContactStatus: 'Pending', guardianName: 'S. Satyanarayana', guardianPhone: '9848123412' },
  { id: 'rec-13', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS013', studentName: 'T. Vamsi Krishna', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 91, percentage: 82.73, riskStatus: 'NORMAL', parentContactStatus: 'Pending', guardianName: 'T. Tirupathi Rao', guardianPhone: '9848123413' },
  { id: 'rec-14', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS014', studentName: 'V. Anusha', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 106, percentage: 96.36, riskStatus: 'NORMAL', parentContactStatus: 'Pending', guardianName: 'V. Govinda Rao', guardianPhone: '9848123414' },
  { id: 'rec-15', batchId: 'batch-aug-2026-cys-iii-a', rollNumber: '23CYS015', studentName: 'Y. Gopi Chand', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', classesHeld: 110, classesAttended: 85, percentage: 77.27, riskStatus: 'NORMAL', parentContactStatus: 'Pending', guardianName: 'Y. Sambasiva Rao', guardianPhone: '9848123415' }
]

const INITIAL_AUDIT_LOGS: AttendanceAuditLog[] = [
  {
    id: 'audit-01',
    batchId: 'batch-jul-2026-cys-iii-a',
    fileName: 'III_CYS_A_July_2026.xlsx',
    fileChecksum: 'sha256_july_cys_3a_seed',
    monthYear: 'July 2026',
    departmentId: 'dept-cys',
    year: 'III',
    section: 'A',
    totalRecords: 15,
    riskCount: 5,
    importedAt: '2026-07-28T11:00:00Z',
    importedBy: 'Dr. M. Sreenivasa Rao (HOD CYS)',
    retentionNote: 'Previous monthly dataset marked replaced by August 2026 import.'
  },
  {
    id: 'audit-02',
    batchId: 'batch-aug-2026-cys-iii-a',
    fileName: 'III_CYS_A_August_2026.xlsx',
    fileChecksum: 'sha256_august_cys_3a_seed',
    monthYear: 'August 2026',
    departmentId: 'dept-cys',
    year: 'III',
    section: 'A',
    totalRecords: 15,
    riskCount: 4,
    importedAt: '2026-08-20T14:30:00Z',
    importedBy: 'Dr. M. Sreenivasa Rao (HOD CYS)',
    retentionNote: 'Active current monthly dataset.'
  }
]

interface AttendanceState {
  batches: AttendanceBatch[]
  records: AttendanceRecord[]
  students: Student[]
  auditLogs: AttendanceAuditLog[]

  // Actions
  importBatch: (params: {
    fileName: string
    fileChecksum: string
    academicYear: string
    departmentId: string
    year: 'I' | 'II' | 'III' | 'IV'
    semester: 'I' | 'II'
    section: 'A' | 'B' | 'C' | 'D'
    monthYear: string
    importedBy: string
    rows: {
      rollNumber: string
      studentName?: string
      classesHeld: number
      classesAttended: number
      percentage: number
    }[]
  }) => { success: boolean; batchId: string; riskCount: number; duplicateWarning?: boolean }

  removePreviousBatch: (params: {
    batchId: string
    removeSnapshots: boolean
    removeAlerts: boolean
    retainParentContact: boolean
    removedBy: string
  }) => { success: boolean; removedCount: number }

  clearCurrentBatch: (params: {
    batchId: string
    removedBy: string
  }) => { success: boolean }

  updateParentContact: (
    recordId: string,
    status: ParentContactStatus,
    notes: string,
    contactedAt?: string
  ) => void

  getPreviousBatch: (cohort: { departmentId: string; year: string; section: string }) => AttendanceBatch | undefined
  getActiveBatch: (cohort?: { departmentId: string; year: string; section: string }) => AttendanceBatch | undefined
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      batches: INITIAL_BATCHES,
      records: INITIAL_RECORDS,
      students: INITIAL_STUDENT_MASTER,
      auditLogs: INITIAL_AUDIT_LOGS,

      importBatch: ({
        fileName,
        fileChecksum,
        academicYear,
        departmentId,
        year,
        semester,
        section,
        monthYear,
        importedBy,
        rows
      }) => {
        const state = get()

        // Check if exact file hash is already imported
        const existingChecksum = state.batches.find((b) => b.fileChecksum === fileChecksum)
        const isDuplicate = !!existingChecksum

        const batchId = `batch_${Date.now()}_${departmentId}_${year}_${section}`

        // Match with Student Master authority
        let riskCount = 0
        const newRecords: AttendanceRecord[] = rows.map((r, idx) => {
          const matchedStudent = state.students.find(
            (s) => s.rollNumber.toLowerCase() === r.rollNumber.toLowerCase()
          )

          const pct = parseFloat(r.percentage.toFixed(2))
          const isRisk = pct < 65.0 // Strictly < 65% is RISK
          if (isRisk) riskCount++

          return {
            id: `rec_${batchId}_${idx}`,
            batchId,
            rollNumber: r.rollNumber.toUpperCase(),
            studentName: matchedStudent ? matchedStudent.name : (r.studentName || `Student (${r.rollNumber})`),
            departmentId: matchedStudent ? matchedStudent.departmentId : departmentId,
            year: matchedStudent ? matchedStudent.year : year,
            semester: matchedStudent ? matchedStudent.semester : semester,
            section: matchedStudent ? matchedStudent.section : section,
            classesHeld: r.classesHeld,
            classesAttended: r.classesAttended,
            percentage: pct,
            riskStatus: isRisk ? 'RISK' : 'NORMAL',
            parentContactStatus: 'Pending',
            guardianName: matchedStudent ? matchedStudent.guardianName : undefined,
            guardianPhone: matchedStudent ? matchedStudent.guardianPhone : undefined,
            isUnmatchedStudent: !matchedStudent
          }
        })

        // Step: Mark any existing active batch for this cohort as REPLACED
        const updatedBatches = state.batches.map((b) => {
          if (
            b.departmentId === departmentId &&
            b.year === year &&
            b.section === section &&
            b.status === 'ACTIVE'
          ) {
            return { ...b, status: 'REPLACED' as const }
          }
          return b
        })

        // Create new active batch
        const newBatch: AttendanceBatch = {
          id: batchId,
          academicYear,
          departmentId,
          year,
          semester,
          section,
          monthYear,
          fileName,
          fileChecksum,
          totalStudents: newRecords.length,
          riskStudentsCount: riskCount,
          importedAt: new Date().toISOString(),
          importedBy,
          status: 'ACTIVE'
        }

        const newAuditLog: AttendanceAuditLog = {
          id: `audit_${Date.now()}`,
          batchId,
          fileName,
          fileChecksum,
          monthYear,
          departmentId,
          year,
          section,
          totalRecords: newRecords.length,
          riskCount,
          importedAt: new Date().toISOString(),
          importedBy,
          retentionNote: `New active import committed for ${monthYear}. Previous datasets marked replaced.`
        }

        set({
          batches: [newBatch, ...updatedBatches],
          records: [...newRecords, ...state.records],
          auditLogs: [newAuditLog, ...state.auditLogs]
        })

        return { success: true, batchId, riskCount, duplicateWarning: isDuplicate }
      },

      removePreviousBatch: ({
        batchId,
        removeSnapshots,
        removeAlerts,
        retainParentContact,
        removedBy
      }) => {
        const state = get()
        const targetBatch = state.batches.find((b) => b.id === batchId)
        if (!targetBatch) return { success: false, removedCount: 0 }

        // Filter records belonging to target batch
        const batchRecords = state.records.filter((r) => r.batchId === batchId)
        const recordsToKeep = state.records.filter((r) => {
          if (r.batchId !== batchId) return true
          // If retainParentContact is checked and record has contacted status, keep contact log
          if (retainParentContact && r.parentContactStatus !== 'Pending') return true
          if (!removeSnapshots && r.riskStatus === 'NORMAL') return true
          if (!removeAlerts && r.riskStatus === 'RISK') return true
          return false
        })

        const removedCount = batchRecords.length - (state.records.length - recordsToKeep.length)

        const updatedBatches = state.batches.map((b) =>
          b.id === batchId ? { ...b, status: 'ARCHIVED' as const, removedAt: new Date().toISOString(), removedBy } : b
        )

        const updatedAuditLogs = state.auditLogs.map((a) =>
          a.batchId === batchId
            ? {
                ...a,
                removedAt: new Date().toISOString(),
                removedBy,
                retentionNote: `Previous batch data cleaned up by ${removedBy}. Snapshots: ${removeSnapshots ? 'Removed' : 'Kept'}, Alerts: ${removeAlerts ? 'Removed' : 'Kept'}, Parent Contacts: ${retainParentContact ? 'Retained' : 'Cleaned'}.`
              }
            : a
        )

        set({
          batches: updatedBatches,
          records: recordsToKeep,
          auditLogs: updatedAuditLogs
        })

        return { success: true, removedCount }
      },

      clearCurrentBatch: ({ batchId, removedBy }) => {
        const state = get()
        const updatedBatches = state.batches.map((b) =>
          b.id === batchId ? { ...b, status: 'ARCHIVED' as const, removedAt: new Date().toISOString(), removedBy } : b
        )
        const recordsToKeep = state.records.filter((r) => r.batchId !== batchId)

        const updatedAuditLogs = state.auditLogs.map((a) =>
          a.batchId === batchId
            ? {
                ...a,
                removedAt: new Date().toISOString(),
                removedBy,
                retentionNote: `Active batch cleared by ${removedBy} with confirmed REMOVE verification.`
              }
            : a
        )

        set({
          batches: updatedBatches,
          records: recordsToKeep,
          auditLogs: updatedAuditLogs
        })

        return { success: true }
      },

      updateParentContact: (recordId, status, notes, contactedAt) => {
        set((state) => ({
          records: state.records.map((r) =>
            r.id === recordId
              ? {
                  ...r,
                  parentContactStatus: status,
                  contactNotes: notes,
                  lastContactedAt: contactedAt || new Date().toISOString().split('T')[0]
                }
              : r
          )
        }))
      },

      getPreviousBatch: (cohort) => {
        return get().batches.find(
          (b) =>
            b.departmentId === cohort.departmentId &&
            b.year === cohort.year &&
            b.section === cohort.section &&
            b.status === 'REPLACED'
        )
      },

      getActiveBatch: (cohort) => {
        if (!cohort) {
          return get().batches.find((b) => b.status === 'ACTIVE')
        }
        return get().batches.find(
          (b) =>
            b.departmentId === cohort.departmentId &&
            b.year === cohort.year &&
            b.section === cohort.section &&
            b.status === 'ACTIVE'
        )
      }
    }),
    {
      name: 'nec_attendance_store_v4'
    }
  )
)

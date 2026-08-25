import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BoSMeeting, BoSMember, BoSAgendaItem, BoSScheduleHistory, BoSDocument } from '../types/nec'

const INITIAL_BOS_MEETINGS: BoSMeeting[] = [
  {
    id: 'bos-cys-r23-04',
    meetingNumber: 'BOS/CYS/2026/04',
    departmentId: 'dept-cys',
    regulation: 'R23',
    academicYear: '2026-27',
    bosDate: '2026-07-12',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    meetingMode: 'Hybrid',
    venue: 'Cyber Security Seminar Hall & Microsoft Teams',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/bos-cys-04',
    meetingStatus: 'COMPLETED',
    chairman: {
      id: 'mem-chair-01',
      name: 'Dr. M. Sreenivasa Rao',
      designation: 'Professor & Head',
      department: 'CSE (Cyber Security)',
      institution: 'Narasaraopeta Engineering College (Autonomous)',
      email: 'hod.cys@nrtec.in',
      phone: '9440123456',
      category: 'Chairman',
      isManual: false
    },
    members: [
      {
        id: 'mem-cys-02',
        name: 'Dr. Ch. Satyanarayana',
        designation: 'Professor in CSE & Director of Academic Planning',
        department: 'Computer Science and Engineering',
        institution: 'JNTUK Kakinada',
        email: 'ch.satya@jntuk.edu.in',
        phone: '9848011223',
        category: 'University Nominee',
        isManual: true,
        remarks: 'JNTUK Nominee for BoS Committee'
      },
      {
        id: 'mem-cys-03',
        name: 'Dr. V. Kamakshi Prasad',
        designation: 'Professor of CSE',
        department: 'School of Information Technology',
        institution: 'JNTUH University College of Engineering',
        email: 'kamakshiprasad@jntuh.ac.in',
        category: 'Academic Expert',
        isManual: true
      },
      {
        id: 'mem-cys-04',
        name: 'Sri. K. Ramesh Kumar',
        designation: 'Principal Security Architect',
        department: 'Cyber Defense & Cloud Security Division',
        institution: 'Tata Consultancy Services (TCS), Hyderabad',
        email: 'ramesh.k@tcs.com',
        phone: '9988776655',
        category: 'Industry Expert',
        isManual: true,
        remarks: 'Industry curriculum reviewer'
      },
      {
        id: 'mem-cys-05',
        name: 'Mr. P. Sai Charan',
        designation: 'Information Security Officer',
        department: 'SOC Operations',
        institution: 'Wipro Technologies, Bengaluru',
        email: 'saicharan.p@wipro.com',
        category: 'Alumni Member',
        isManual: true
      },
      {
        id: 'mem-cys-06',
        name: 'Mrs. K. Anitha',
        designation: 'Associate Professor',
        department: 'CSE (Cyber Security)',
        institution: 'Narasaraopeta Engineering College (Autonomous)',
        email: 'anitha.k@nrtec.in',
        category: 'Internal Member',
        isManual: false
      }
    ],
    agendaItems: [
      {
        id: 'agenda-01',
        itemNo: 1,
        title: 'Opening Remarks & Approval of Previous Minutes',
        startTime: '10:00 AM',
        endTime: '10:15 AM',
        description: 'Welcome by Chairman and review of Action Taken Report of 3rd BoS meeting.',
        decisionResolution: 'Resolved to approve the action taken report of previous meeting unanimously.'
      },
      {
        id: 'agenda-02',
        itemNo: 2,
        title: 'Curriculum Structure Review for B.Tech IV Year (R23)',
        startTime: '10:15 AM',
        endTime: '11:30 AM',
        description: 'Detailed analysis of professional electives, open electives, and mandatory industry internships for Semester VII & VIII.',
        decisionResolution: 'Resolved to introduce "Cloud Security and DevSecOps" and "Zero Trust Architecture" as Professional Elective-V.'
      },
      {
        id: 'agenda-03',
        itemNo: 3,
        title: 'Detailed Syllabus Approval for Penetration Testing & Threat Hunting',
        startTime: '11:30 AM',
        endTime: '12:30 PM',
        description: 'Review of hands-on laboratory experiments using Kali Linux, Wireshark, Metasploit, and Burp Suite.',
        decisionResolution: 'Approved with minor recommendation to add container security lab tasks.'
      },
      {
        id: 'agenda-04',
        itemNo: 4,
        title: 'Skill-Oriented Courses & Industry Certification Credits',
        startTime: '12:30 PM',
        endTime: '01:00 PM',
        description: 'Credit transfer guidelines for CompTIA Security+, CEH, and Cisco CyberOps certifications.',
        decisionResolution: 'Approved 2 credits waiver for validated international cybersecurity certifications.'
      }
    ],
    postponementHistory: [],
    documents: [
      {
        id: 'doc-01',
        name: 'BoS_CYS_04_Signed_Minutes.pdf',
        type: 'Minutes',
        uploadedAt: '2026-07-13',
        uploadedBy: 'Dr. M. Sreenivasa Rao',
        sizeBytes: 1420500
      },
      {
        id: 'doc-02',
        name: 'R23_CYS_IV_Year_Syllabus_Structure.pdf',
        type: 'Curriculum Structure',
        uploadedAt: '2026-07-13',
        uploadedBy: 'Dr. M. Sreenivasa Rao',
        sizeBytes: 2840000
      }
    ],
    notes: 'Meeting successfully concluded with all members signing the resolutions.'
  },
  {
    id: 'bos-ai-r23-03',
    meetingNumber: 'BOS/AI/2026/03',
    departmentId: 'dept-ai',
    regulation: 'R23',
    academicYear: '2026-27',
    bosDate: '2026-08-15',
    startTime: '10:30 AM',
    endTime: '01:30 PM',
    meetingMode: 'Offline',
    venue: 'AI Research Center Board Room',
    meetingStatus: 'POSTPONED',
    chairman: {
      id: 'mem-chair-ai',
      name: 'Dr. K. Lakshminarayana',
      designation: 'Professor & Head',
      department: 'Artificial Intelligence',
      institution: 'Narasaraopeta Engineering College (Autonomous)',
      email: 'hod.ai@nrtec.in',
      phone: '9440234567',
      category: 'Chairman',
      isManual: false
    },
    members: [
      {
        id: 'mem-ai-02',
        name: 'Dr. O. Srinivasa Rao',
        designation: 'Professor of CSE',
        department: 'Computer Science and Engineering',
        institution: 'JNTUK University College of Engineering Vizianagaram',
        email: 'osr.cse@jntukucev.ac.in',
        category: 'University Nominee',
        isManual: true
      },
      {
        id: 'mem-ai-03',
        name: 'Dr. R. B. V. Subramaanyam',
        designation: 'Professor of CSE',
        department: 'Computer Science & Engineering',
        institution: 'National Institute of Technology (NIT), Warangal',
        email: 'rbvs66@nitw.ac.in',
        category: 'Academic Expert',
        isManual: true
      }
    ],
    agendaItems: [
      {
        id: 'agenda-ai-01',
        itemNo: 1,
        title: 'Review of R23 Artificial Intelligence Syllabus (IV Year)',
        startTime: '10:30 AM',
        endTime: '12:00 PM',
        description: 'Inclusion of Generative AI, LLM Fine-tuning, and Agentic Workflow architectures.',
        decisionResolution: 'Pending rescheduled meeting review.'
      }
    ],
    postponementHistory: [
      {
        id: 'postpone-01',
        previousDate: '2026-08-15',
        previousStartTime: '10:30 AM',
        previousEndTime: '01:30 PM',
        newDate: '2026-08-28',
        newStartTime: '11:00 AM',
        newEndTime: '02:00 PM',
        reason: 'University Nominee official emergency assignment on original schedule date.',
        changedAt: '2026-08-13T10:00:00Z',
        changedBy: 'Dr. K. Lakshminarayana'
      }
    ],
    documents: [],
    notes: 'Rescheduled to 28-Aug-2026 at 11:00 AM after formal concurrence of all committee members.'
  }
]

interface BoSState {
  meetings: BoSMeeting[]
  addMeeting: (meeting: BoSMeeting) => void
  updateMeeting: (id: string, updated: Partial<BoSMeeting>) => void
  postponeMeeting: (
    id: string,
    params: {
      newDate: string
      newStartTime: string
      newEndTime: string
      reason: string
      changedBy: string
      shiftAgendaTimes?: boolean
    }
  ) => void
  deleteMeeting: (id: string) => void
}

export const useBoSStore = create<BoSState>()(
  persist(
    (set) => ({
      meetings: INITIAL_BOS_MEETINGS,

      addMeeting: (meeting) => {
        set((state) => ({
          meetings: [meeting, ...state.meetings]
        }))
      },

      updateMeeting: (id, updated) => {
        set((state) => ({
          meetings: state.meetings.map((m) => (m.id === id ? { ...m, ...updated } : m))
        }))
      },

      postponeMeeting: (id, { newDate, newStartTime, newEndTime, reason, changedBy }) => {
        set((state) => ({
          meetings: state.meetings.map((m) => {
            if (m.id !== id) return m

            const historyEntry: BoSScheduleHistory = {
              id: `hist_${Date.now()}`,
              previousDate: m.bosDate,
              previousStartTime: m.startTime,
              previousEndTime: m.endTime,
              newDate,
              newStartTime,
              newEndTime,
              reason,
              changedAt: new Date().toISOString(),
              changedBy
            }

            return {
              ...m,
              meetingStatus: 'POSTPONED',
              bosDate: newDate,
              startTime: newStartTime,
              endTime: newEndTime,
              postponementHistory: [...(m.postponementHistory || []), historyEntry]
            }
          })
        }))
      },

      deleteMeeting: (id) => {
        set((state) => ({
          meetings: state.meetings.filter((m) => m.id !== id)
        }))
      }
    }),
    {
      name: 'nec_bos_store_v4'
    }
  )
)

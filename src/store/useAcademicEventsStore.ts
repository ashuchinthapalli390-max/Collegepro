import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AcademicEvent, AcademicEventSection, FlattenedEventSectionRow } from '../types/nec'
import { DepartmentResolver } from '../utils/departmentResolver'

const INITIAL_ACADEMIC_EVENTS: AcademicEvent[] = [
  {
    id: 'evt-cys-001',
    eventCode: 'NEC/CYS/WS/2026/01',
    title: 'Advanced Robotics & Threat Vector Simulation with AI',
    eventType: 'Workshop',
    academicYear: '2026-27',
    departmentId: 'dept-cys',
    startDate: '2026-08-18',
    endDate: '2026-08-20',
    mode: 'Offline',
    venue: 'Cyber Security Advanced Innovation Lab (Block-3, Room 304)',
    resourcePerson: 'Dr. S. K. Praveen Kumar',
    resourcePersonDesignation: 'Principal Cyber Defense Engineer',
    resourcePersonOrg: 'Qualcomm India / Cyber Security COE',
    totalParticipants: 180,
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    brochureUrl: 'https://nrtec.in/brochures/robotics_cys_2026.pdf',
    reportUrl: 'https://nrtec.in/reports/robotics_cys_2026.pdf',
    status: 'Completed',
    workflowStatus: 'Approved',
    description: 'Three-day hands-on national workshop focusing on autonomous robotics hardware vulnerabilities, firmware reverse engineering, CAN bus attacks, and AI threat mitigation.',
    sections: [
      { id: 'sec-01', eventId: 'evt-cys-001', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'A', sectionParticipantsCount: 45 },
      { id: 'sec-02', eventId: 'evt-cys-001', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'B', sectionParticipantsCount: 46 },
      { id: 'sec-03', eventId: 'evt-cys-001', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'C', sectionParticipantsCount: 44 },
      { id: 'sec-04', eventId: 'evt-cys-001', departmentId: 'dept-cys', year: 'III', semester: 'I', section: 'D', sectionParticipantsCount: 45 }
    ]
  },
  {
    id: 'evt-ai-002',
    eventCode: 'NEC/AI/FDP/2026/01',
    title: 'Generative AI & Agentic Workflow Architectures',
    eventType: 'FDP',
    academicYear: '2026-27',
    departmentId: 'dept-ai',
    startDate: '2026-08-25',
    endDate: '2026-08-29',
    mode: 'Hybrid',
    venue: 'AI Seminar Hall & Google Meet',
    resourcePerson: 'Dr. Anand Ramanathan',
    resourcePersonDesignation: 'Senior AI Research Scientist',
    resourcePersonOrg: 'Microsoft Research India',
    totalParticipants: 120,
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    status: 'Ongoing',
    workflowStatus: 'Approved',
    description: 'One-week national faculty development program on LangGraph, AutoGen, Agentic RAG, and Transformer Fine-Tuning.',
    sections: [
      { id: 'sec-05', eventId: 'evt-ai-002', departmentId: 'dept-ai', year: 'IV', semester: 'I', section: 'A' },
      { id: 'sec-06', eventId: 'evt-ai-002', departmentId: 'dept-ai', year: 'IV', semester: 'I', section: 'B' }
    ]
  },
  {
    id: 'evt-aiml-003',
    eventCode: 'NEC/AIML/GL/2026/01',
    title: 'Industry Perspectives on Deep Reinforcement Learning for Autonomous Systems',
    eventType: 'Guest Lecture',
    academicYear: '2026-27',
    departmentId: 'dept-aiml',
    startDate: '2026-09-05',
    endDate: '2026-09-05',
    mode: 'Online',
    venue: 'Microsoft Teams Virtual Auditorium',
    resourcePerson: 'Mr. V. Chandra Sekhar',
    resourcePersonDesignation: 'Lead Machine Learning Architect',
    resourcePersonOrg: 'NVIDIA Bengaluru',
    totalParticipants: 140,
    posterUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    status: 'Upcoming',
    workflowStatus: 'Approved',
    description: 'Expert guest lecture on Isaac Sim, deep Q-networks, policy gradient algorithms, and real-world deployment challenges.',
    sections: [
      { id: 'sec-07', eventId: 'evt-aiml-003', departmentId: 'dept-aiml', year: 'III', semester: 'I', section: 'A' },
      { id: 'sec-08', eventId: 'evt-aiml-003', departmentId: 'dept-aiml', year: 'III', semester: 'I', section: 'B' }
    ]
  },
  {
    id: 'evt-ds-004',
    eventCode: 'NEC/DS/WS/2026/01',
    title: 'Big Data Pipeline Engineering with Apache Spark & Snowflake',
    eventType: 'Workshop',
    academicYear: '2026-27',
    departmentId: 'dept-ds',
    startDate: '2026-09-12',
    endDate: '2026-09-14',
    mode: 'Offline',
    venue: 'Data Science Central Computing Lab',
    resourcePerson: 'Mrs. Swathi Reddy',
    resourcePersonDesignation: 'Data Platform Lead',
    resourcePersonOrg: 'Amazon Web Services (AWS)',
    totalParticipants: 130,
    posterUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    status: 'Upcoming',
    workflowStatus: 'Approved',
    description: 'Hands-on training covering PySpark distributed processing, delta lake architecture, real-time Kafka streaming, and Snowflake warehousing.',
    sections: [
      { id: 'sec-09', eventId: 'evt-ds-004', departmentId: 'dept-ds', year: 'III', semester: 'I', section: 'A' },
      { id: 'sec-10', eventId: 'evt-ds-004', departmentId: 'dept-ds', year: 'III', semester: 'I', section: 'B' }
    ]
  }
]

interface AcademicEventsState {
  events: AcademicEvent[]
  addEvent: (event: Omit<AcademicEvent, 'id' | 'eventCode'>) => string
  updateEvent: (id: string, updated: Partial<AcademicEvent>) => void
  deleteEvent: (id: string) => void
  getFlattenedSectionRows: (filters?: {
    departmentId?: string
    year?: string
    semester?: string
    section?: string
    eventType?: string
    academicYear?: string
    status?: string
  }) => FlattenedEventSectionRow[]
}

export const useAcademicEventsStore = create<AcademicEventsState>()(
  persist(
    (set, get) => ({
      events: INITIAL_ACADEMIC_EVENTS,

      addEvent: (eventData) => {
        const id = `evt_${Date.now()}`
        const dept = DepartmentResolver.getDepartmentById(eventData.departmentId)
        const eventCode = `NEC/${dept.code}/${eventData.eventType.toUpperCase().slice(0, 3)}/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`

        const newEvent: AcademicEvent = {
          ...eventData,
          id,
          eventCode,
          sections: eventData.sections.map((s, idx) => ({
            ...s,
            id: `sec_${id}_${idx}`,
            eventId: id
          }))
        }

        set((state) => ({
          events: [newEvent, ...state.events]
        }))

        return id
      },

      updateEvent: (id, updated) => {
        set((state) => ({
          events: state.events.map((e) => {
            if (e.id !== id) return e
            const merged = { ...e, ...updated }
            // If sections are updated, ensure correct eventId
            if (updated.sections) {
              merged.sections = updated.sections.map((s, idx) => ({
                ...s,
                id: s.id || `sec_${id}_${idx}`,
                eventId: id
              }))
            }
            return merged
          })
        }))
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id)
        }))
      },

      getFlattenedSectionRows: (filters) => {
        const state = get()
        const flattened: FlattenedEventSectionRow[] = []

        for (const evt of state.events) {
          const dept = DepartmentResolver.getDepartmentById(evt.departmentId)

          // If event has no audience sections defined, treat as one row
          if (!evt.sections || evt.sections.length === 0) {
            flattened.push({
              rowId: `${evt.id}_default`,
              eventId: evt.id,
              title: evt.title,
              eventType: evt.eventType,
              academicYear: evt.academicYear,
              departmentId: evt.departmentId,
              departmentCode: dept.code,
              departmentName: dept.officialName,
              year: 'All',
              semester: 'All',
              section: 'All',
              startDate: evt.startDate,
              endDate: evt.endDate,
              mode: evt.mode,
              venue: evt.venue,
              resourcePerson: evt.resourcePerson,
              resourcePersonOrg: evt.resourcePersonOrg,
              posterUrl: evt.posterUrl,
              status: evt.status,
              workflowStatus: evt.workflowStatus,
              totalParticipants: evt.totalParticipants
            })
            continue
          }

          for (const sec of evt.sections) {
            const secDept = DepartmentResolver.getDepartmentById(sec.departmentId || evt.departmentId)

            flattened.push({
              rowId: `${evt.id}_${sec.id || sec.section}`,
              eventId: evt.id,
              title: evt.title,
              eventType: evt.eventType,
              academicYear: evt.academicYear,
              departmentId: secDept.id,
              departmentCode: secDept.code,
              departmentName: secDept.officialName,
              year: sec.year,
              semester: sec.semester,
              section: sec.section,
              startDate: evt.startDate,
              endDate: evt.endDate,
              mode: evt.mode,
              venue: evt.venue,
              resourcePerson: evt.resourcePerson,
              resourcePersonOrg: evt.resourcePersonOrg,
              posterUrl: evt.posterUrl,
              status: evt.status,
              workflowStatus: evt.workflowStatus,
              totalParticipants: evt.totalParticipants,
              sectionParticipants: sec.sectionParticipantsCount
            })
          }
        }

        // Apply exact filters
        if (!filters) return flattened

        return flattened.filter((row) => {
          if (filters.departmentId && filters.departmentId !== 'ALL_ET') {
            const resolvedFilter = DepartmentResolver.resolve(filters.departmentId)
            if (resolvedFilter.success && row.departmentId !== resolvedFilter.department.id) {
              return false
            }
          }
          if (filters.year && filters.year !== 'ALL' && row.year !== filters.year) {
            return false
          }
          if (filters.semester && filters.semester !== 'ALL' && row.semester !== filters.semester) {
            return false
          }
          if (filters.section && filters.section !== 'ALL' && row.section !== filters.section) {
            return false
          }
          if (filters.eventType && filters.eventType !== 'ALL' && row.eventType !== filters.eventType) {
            return false
          }
          if (filters.academicYear && filters.academicYear !== 'ALL' && row.academicYear !== filters.academicYear) {
            return false
          }
          if (filters.status && filters.status !== 'ALL' && row.status !== filters.status) {
            return false
          }
          return true
        })
      }
    }),
    {
      name: 'nec_academic_events_v4'
    }
  )
)

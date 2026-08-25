import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CommunityServiceProject, CSPStudent, CSPActivity, CSPStatus, CSPType } from '../types/nec'
import { DepartmentResolver } from '../utils/departmentResolver'

const INITIAL_CSP_PROJECTS: CommunityServiceProject[] = [
  {
    id: 'csp-2026-01',
    projectNumber: 'CSP/2026/CYS/01',
    projectTitle: 'Cyber Safety & Digital Literacy Awareness for High School Students',
    academicYear: '2026-27',
    departmentId: 'dept-cys',
    year: 'III',
    semester: 'I',
    section: 'A',
    batch: '2024-2028',
    projectType: 'Awareness',
    students: [
      { rollNumber: '23CYS001', studentName: 'A. Sai Teja', departmentId: 'dept-cys', year: 'III', section: 'A', role: 'Team Leader' },
      { rollNumber: '23CYS002', studentName: 'B. Pavan Kumar', departmentId: 'dept-cys', year: 'III', section: 'A', role: 'Member' },
      { rollNumber: '23CYS003', studentName: 'C. Meghana', departmentId: 'dept-cys', year: 'III', section: 'A', role: 'Member' },
      { rollNumber: '23CYS004', studentName: 'D. Rajesh', departmentId: 'dept-cys', year: 'III', section: 'A', role: 'Member' }
    ],
    facultyGuideName: 'Dr. M. Sreenivasa Rao (HOD CYS)',
    facultyCoordinatorName: 'Mr. P. Siva Kumar',
    villageOrLocation: 'Zilla Parishad High School, Jonnalagadda Village',
    district: 'Palnadu District',
    partnerOrganization: 'Jonnalagadda Gram Panchayat Education Committee',
    startDate: '2026-08-01',
    endDate: '2026-08-14',
    durationDays: 14,
    objective: 'To educate rural 8th–10th grade students on online privacy, phishing defenses, safe OTP practices, and social media etiquette.',
    activities: [
      { id: 'act-01', activityDate: '2026-08-03', activityTitle: 'Preliminary Survey on Smartphone Usage', description: 'Assessed internet access patterns and baseline cyber threat awareness among 120 students.', location: 'ZPHS Jonnalagadda', participantsCount: 120 },
      { id: 'act-02', activityDate: '2026-08-08', activityTitle: 'Interactive Cybersecurity Workshop & Poster Demo', description: 'Demonstrated live mock phishing scenarios, password hygiene games, and cyber helpline (1930) cards.', location: 'ZPHS Main Auditorium', participantsCount: 145 },
      { id: 'act-03', activityDate: '2026-08-12', activityTitle: 'Parent-Teacher Cyber Safety Seminar', description: 'Educated rural parents on preventing online gaming scams and protecting digital bank accounts.', location: 'Grama Chavadi', participantsCount: 65 }
    ],
    beneficiaryType: 'Rural High School Students & Parents',
    beneficiaryCount: 330,
    outcomeImpact: 'Over 330 students and villagers trained. Distributed 200 cyber safety quick-reference booklets in Telugu.',
    status: 'COMPLETED',
    documentsCount: 4,
    reportUrl: '/documents/csp/CSP_CYS_01_Report.pdf'
  },
  {
    id: 'csp-2026-02',
    projectNumber: 'CSP/2026/AI/02',
    projectTitle: 'Crop Disease Identification & AI Mobile Assistant for Smallholder Farmers',
    academicYear: '2026-27',
    departmentId: 'dept-ai',
    year: 'III',
    semester: 'I',
    section: 'A',
    batch: '2024-2028',
    projectType: 'Technology Support',
    students: [
      { rollNumber: '23AI004', studentName: 'D. Bhavana', departmentId: 'dept-ai', year: 'III', section: 'A', role: 'Team Leader' },
      { rollNumber: '23AI005', studentName: 'E. Tarun', departmentId: 'dept-ai', year: 'III', section: 'A', role: 'Member' },
      { rollNumber: '23AI006', studentName: 'F. Yamini', departmentId: 'dept-ai', year: 'III', section: 'A', role: 'Member' }
    ],
    facultyGuideName: 'Dr. K. Lakshminarayana (HOD AI)',
    villageOrLocation: 'Rami Reddy Thota Village & Rythu Bharosa Kendram (RBK)',
    district: 'Palnadu District',
    partnerOrganization: 'Local Rythu Seva Samithi',
    startDate: '2026-08-05',
    endDate: '2026-08-18',
    durationDays: 14,
    objective: 'To deploy a lightweight offline AI computer vision app helping chilli and cotton farmers detect leaf spot and pest infestations.',
    activities: [
      { id: 'act-04', activityDate: '2026-08-07', activityTitle: 'Field Leaf Sample Collection & Imaging', description: 'Collected 450 localized disease leaf samples across 8 crop fields.', location: 'Field Survey Zone 1', participantsCount: 45 },
      { id: 'act-05', activityDate: '2026-08-15', activityTitle: 'Rythu Demonstration & App Installation Camp', description: 'Trained farmers on capturing leaf images on smartphones to get instant treatment advice in Telugu.', location: 'RBK Center', participantsCount: 78 }
    ],
    beneficiaryType: 'Local Chilli & Cotton Farmers',
    beneficiaryCount: 125,
    outcomeImpact: 'Successfully onboarded 78 farmers to the free mobile assistant, reducing response time for pest control advice.',
    status: 'COMPLETED',
    documentsCount: 3
  },
  {
    id: 'csp-2026-03',
    projectNumber: 'CSP/2026/DS/03',
    projectTitle: 'Village Ground Water Quality & Sanitation Statistical Survey',
    academicYear: '2026-27',
    departmentId: 'dept-ds',
    year: 'III',
    semester: 'I',
    section: 'A',
    batch: '2024-2028',
    projectType: 'Survey',
    students: [
      { rollNumber: '23DS009', studentName: 'G. Harish', departmentId: 'dept-ds', year: 'III', section: 'A', role: 'Team Leader' },
      { rollNumber: '23DS010', studentName: 'H. Divya', departmentId: 'dept-ds', year: 'III', section: 'A', role: 'Member' }
    ],
    facultyGuideName: 'Dr. P. Siva Prasad (HOD DS)',
    villageOrLocation: 'Petlurivaripalem Village',
    district: 'Palnadu District',
    startDate: '2026-08-10',
    endDate: '2026-08-24',
    durationDays: 15,
    objective: 'Statistical mapping of pH and TDS levels across 14 village borewells to identify contamination clusters.',
    activities: [
      { id: 'act-06', activityDate: '2026-08-12', activityTitle: 'Water Sample Collection & Testing', description: 'Measured TDS, hardness, and fluoride levels.', location: 'Petlurivaripalem North & South', participantsCount: 30 }
    ],
    beneficiaryType: 'Village Residents',
    beneficiaryCount: 850,
    outcomeImpact: 'Prepared statistical dashboard submitted to Village Sarpanch highlighting 2 unsafe borewell sources.',
    status: 'UNDER_REVIEW',
    documentsCount: 2
  }
]

interface CommunityServiceState {
  projects: CommunityServiceProject[]

  addProject: (project: Omit<CommunityServiceProject, 'id' | 'projectNumber'>) => string
  updateProject: (id: string, updates: Partial<CommunityServiceProject>) => void
  deleteProject: (id: string) => void

  getStats: (academicYear?: string, deptFilter?: string) => {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    totalStudentsParticipated: number
    totalBeneficiariesCount: number
    uniqueLocationsCount: number
  }
}

export const useCommunityServiceStore = create<CommunityServiceState>()(
  persist(
    (set, get) => ({
      projects: INITIAL_CSP_PROJECTS,

      addProject: (projectData) => {
        const id = `csp-${Date.now()}`
        const dept = DepartmentResolver.getShortName(projectData.departmentId)
        const projectNumber = `CSP/${new Date().getFullYear()}/${dept}/${get().projects.length + 1}`
        const newProject: CommunityServiceProject = {
          ...projectData,
          id,
          projectNumber
        }
        set((state) => ({ projects: [newProject, ...state.projects] }))
        return id
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id)
        }))
      },

      getStats: (academicYear, deptFilter) => {
        let list = get().projects

        if (deptFilter && deptFilter !== 'ALL_ET') {
          const resolved = DepartmentResolver.resolve(deptFilter)
          if (resolved.success) {
            list = list.filter((p) => p.departmentId === resolved.department.id)
          }
        }

        const totalProjects = list.length
        let completedProjects = 0
        let activeProjects = 0
        const studentRollSet = new Set<string>()
        const locationSet = new Set<string>()
        let totalBeneficiariesCount = 0

        list.forEach((p) => {
          if (p.status === 'COMPLETED' || p.status === 'APPROVED') completedProjects++
          else activeProjects++

          p.students.forEach((s) => studentRollSet.add(s.rollNumber))
          if (p.villageOrLocation) locationSet.add(p.villageOrLocation.toLowerCase().trim())
          totalBeneficiariesCount += p.beneficiaryCount || 0
        })

        return {
          totalProjects,
          activeProjects,
          completedProjects,
          totalStudentsParticipated: studentRollSet.size,
          totalBeneficiariesCount,
          uniqueLocationsCount: locationSet.size
        }
      }
    }),
    {
      name: 'nec_community_service_store_v1'
    }
  )
)

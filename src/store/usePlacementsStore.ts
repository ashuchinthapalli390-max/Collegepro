import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Company,
  CompanyVisit,
  PlacementOffer,
  DriveType,
  DriveMode,
  CompanyVisitStatus,
  PlacementOfferStatus,
  PlacementOfferType
} from '../types/nec'
import { DepartmentResolver } from '../utils/departmentResolver'

// Central Company Master seed
const INITIAL_COMPANIES: Company[] = [
  { id: 'comp-palo-alto', name: 'Palo Alto Networks', sector: 'Cybersecurity & Cloud', website: 'https://paloaltonetworks.com', isActive: true, hqLocation: 'Santa Clara, CA' },
  { id: 'comp-cisco', name: 'Cisco Systems', sector: 'Networking & Security', website: 'https://cisco.com', isActive: true, hqLocation: 'San Jose, CA' },
  { id: 'comp-tcs', name: 'Tata Consultancy Services (TCS)', sector: 'IT & Digital Solutions', website: 'https://tcs.com', isActive: true, hqLocation: 'Mumbai, India' },
  { id: 'comp-infosys', name: 'Infosys Limited', sector: 'Enterprise AI & Cloud', website: 'https://infosys.com', isActive: true, hqLocation: 'Bengaluru, India' },
  { id: 'comp-virtusa', name: 'Virtusa Corporation', sector: 'Digital Engineering & AI', website: 'https://virtusa.com', isActive: true, hqLocation: 'Southborough, MA' },
  { id: 'comp-cognizant', name: 'Cognizant Technology Solutions', sector: 'Digital Transformation', website: 'https://cognizant.com', isActive: true, hqLocation: 'Teaneck, NJ' },
  { id: 'comp-accenture', name: 'Accenture Solutions', sector: 'Applied Intelligence', website: 'https://accenture.com', isActive: true, hqLocation: 'Dublin, Ireland' }
]

// Seed Company Visits (Recruitment Drives)
const INITIAL_COMPANY_VISITS: CompanyVisit[] = [
  {
    id: 'visit-2026-01',
    companyId: 'comp-palo-alto',
    companyName: 'Palo Alto Networks',
    academicYear: '2026-27',
    visitDate: '2026-08-14',
    driveType: 'Campus Recruitment',
    mode: 'Hybrid',
    venue: 'NEC Central Seminar Hall & Online Labs',
    eligibleDepartmentIds: ['dept-cys'],
    eligibleCriteria: {
      minCgpa: 7.5,
      maxBacklogs: 0,
      graduationBatch: '2027',
      otherCriteria: 'Mandatory background in SOC / Threat Hunting / TCP-IP Networks'
    },
    roles: [
      { id: 'role-pa-01', roleName: 'Associate SOC Threat Analyst', jobType: 'Full-Time', location: 'Bengaluru / Hyderabad', packageLPA: 12.5 },
      { id: 'role-pa-02', roleName: 'Cloud Security Intern', jobType: 'Internship + PPO', location: 'Remote / Bengaluru', packageLPA: 9.0, stipendMonthly: 35000 }
    ],
    rounds: ['Online Aptitude & Coding', 'Technical Round 1 (SIEM & Network Forensics)', 'System Architecture & Scenario', 'HR Interaction'],
    participation: {
      eligibleStudentsCount: 68,
      registeredStudentsCount: 65,
      attendedStudentsCount: 63,
      shortlistedStudentsCount: 14,
      selectedStudentsCount: 6,
      offersReleasedCount: 6
    },
    placementCoordinatorName: 'Dr. S. Tirumala Rao (Dean Placements)',
    hrContactName: 'Ms. Radhika Menon',
    hrEmail: 'radhika.menon@paloaltonetworks.com',
    hrPhone: '9188224411',
    status: 'COMPLETED',
    remarks: 'Outstanding performance by CSE (Cyber Security) batch. 6 offers rolled out.'
  },
  {
    id: 'visit-2026-02',
    companyId: 'comp-virtusa',
    companyName: 'Virtusa Corporation',
    academicYear: '2026-27',
    visitDate: '2026-08-20',
    driveType: 'Campus Recruitment',
    mode: 'Offline',
    venue: 'NEC Campus Placement Auditorium',
    eligibleDepartmentIds: ['dept-ai', 'dept-aiml', 'dept-ds', 'dept-cys'],
    eligibleCriteria: {
      minCgpa: 6.8,
      maxBacklogs: 1,
      graduationBatch: '2027'
    },
    roles: [
      { id: 'role-vir-01', roleName: 'Associate AI Engineer', jobType: 'Full-Time', location: 'Hyderabad / Chennai', packageLPA: 7.2 },
      { id: 'role-vir-02', roleName: 'Graduate Data Science Engineer', jobType: 'Full-Time', location: 'Hyderabad', packageLPA: 6.5 }
    ],
    rounds: ['Virtual Online Assessment', 'Technical Coding Interview', 'Behavioral HR Assessment'],
    participation: {
      eligibleStudentsCount: 195,
      registeredStudentsCount: 180,
      attendedStudentsCount: 172,
      shortlistedStudentsCount: 38,
      selectedStudentsCount: 18,
      offersReleasedCount: 18
    },
    placementCoordinatorName: 'Prof. K. Srinivasa Rao',
    status: 'COMPLETED'
  },
  {
    id: 'visit-2026-03',
    companyId: 'comp-cisco',
    companyName: 'Cisco Systems',
    academicYear: '2026-27',
    visitDate: '2026-09-05',
    driveType: 'Campus Recruitment',
    mode: 'Hybrid',
    venue: 'Online Hackathon + Virtual Interview',
    eligibleDepartmentIds: ['dept-cys', 'dept-ai', 'dept-aiml'],
    eligibleCriteria: {
      minCgpa: 8.0,
      maxBacklogs: 0,
      graduationBatch: '2027'
    },
    roles: [
      { id: 'role-csc-01', roleName: 'Software Engineer - Security', jobType: 'Full-Time', location: 'Bengaluru', packageLPA: 16.0 }
    ],
    rounds: ['Online Coding Round', 'Technical Panel Interview', 'Managerial Interview', 'HR'],
    participation: {
      eligibleStudentsCount: 85,
      registeredStudentsCount: 80,
      attendedStudentsCount: 0,
      shortlistedStudentsCount: 0,
      selectedStudentsCount: 0,
      offersReleasedCount: 0
    },
    placementCoordinatorName: 'Dr. S. Tirumala Rao',
    status: 'SCHEDULED'
  }
]

// Seed Placement Offers (Student-level Outcomes)
const INITIAL_PLACEMENT_OFFERS: PlacementOffer[] = [
  {
    id: 'offer-2026-01',
    rollNumber: '23CYS001',
    studentName: 'A. Sai Teja',
    departmentId: 'dept-cys',
    year: 'IV',
    section: 'A',
    batch: '2023-2027',
    companyId: 'comp-palo-alto',
    companyName: 'Palo Alto Networks',
    companyVisitId: 'visit-2026-01',
    role: 'Associate SOC Threat Analyst',
    packageLPA: 12.5,
    offerType: 'Full-Time',
    jobLocation: 'Bengaluru',
    offerDate: '2026-08-16',
    joiningDate: '2027-07-01',
    status: 'JOINED',
    isPrimaryOffer: true
  },
  {
    id: 'offer-2026-02',
    rollNumber: '23CYS001', // Multi-offer scenario!
    studentName: 'A. Sai Teja',
    departmentId: 'dept-cys',
    year: 'IV',
    section: 'A',
    batch: '2023-2027',
    companyId: 'comp-virtusa',
    companyName: 'Virtusa Corporation',
    companyVisitId: 'visit-2026-02',
    role: 'Associate AI Engineer',
    packageLPA: 7.2,
    offerType: 'Full-Time',
    jobLocation: 'Hyderabad',
    offerDate: '2026-08-22',
    status: 'DECLINED',
    isPrimaryOffer: false
  },
  {
    id: 'offer-2026-03',
    rollNumber: '23CYS007',
    studentName: 'B. Karthik Reddy',
    departmentId: 'dept-cys',
    year: 'IV',
    section: 'A',
    batch: '2023-2027',
    companyId: 'comp-palo-alto',
    companyName: 'Palo Alto Networks',
    companyVisitId: 'visit-2026-01',
    role: 'Associate SOC Threat Analyst',
    packageLPA: 12.5,
    offerType: 'Full-Time',
    jobLocation: 'Hyderabad',
    offerDate: '2026-08-16',
    status: 'OFFERED',
    isPrimaryOffer: true
  },
  {
    id: 'offer-2026-04',
    rollNumber: '23AI004',
    studentName: 'D. Bhavana',
    departmentId: 'dept-ai',
    year: 'IV',
    section: 'A',
    batch: '2023-2027',
    companyId: 'comp-virtusa',
    companyName: 'Virtusa Corporation',
    companyVisitId: 'visit-2026-02',
    role: 'Associate AI Engineer',
    packageLPA: 7.2,
    offerType: 'Full-Time',
    jobLocation: 'Hyderabad',
    offerDate: '2026-08-22',
    status: 'SELECTED',
    isPrimaryOffer: true
  },
  {
    id: 'offer-2026-05',
    rollNumber: '23DS009',
    studentName: 'G. Harish',
    departmentId: 'dept-ds',
    year: 'IV',
    section: 'A',
    batch: '2023-2027',
    companyId: 'comp-virtusa',
    companyName: 'Virtusa Corporation',
    companyVisitId: 'visit-2026-02',
    role: 'Graduate Data Science Engineer',
    packageLPA: 6.5,
    offerType: 'Full-Time',
    jobLocation: 'Hyderabad',
    offerDate: '2026-08-22',
    status: 'OFFERED',
    isPrimaryOffer: true
  }
]

interface PlacementsState {
  companies: Company[]
  companyVisits: CompanyVisit[]
  placementOffers: PlacementOffer[]

  // Companies Master actions
  addCompany: (company: Omit<Company, 'id'>) => string
  updateCompany: (id: string, updates: Partial<Company>) => void
  getCompanyById: (id: string) => Company | undefined

  // Company Visit actions
  addCompanyVisit: (visit: Omit<CompanyVisit, 'id'>) => string
  updateCompanyVisit: (id: string, updates: Partial<CompanyVisit>) => void
  deleteCompanyVisit: (id: string) => void

  // Placement Offer actions
  addPlacementOffer: (offer: Omit<PlacementOffer, 'id'>) => string
  bulkAddPlacementOffers: (offers: Omit<PlacementOffer, 'id'>[]) => number
  updatePlacementOffer: (id: string, updates: Partial<PlacementOffer>) => void
  deletePlacementOffer: (id: string) => void

  // Computed metrics
  getStats: (academicYear?: string, deptFilter?: string) => {
    uniquePlacedStudents: number
    totalOffers: number
    recruitingCompaniesCount: number
    highestPackageLPA: number
    averagePackageLPA: number
    multipleOfferStudentsCount: number
  }
}

export const usePlacementsStore = create<PlacementsState>()(
  persist(
    (set, get) => ({
      companies: INITIAL_COMPANIES,
      companyVisits: INITIAL_COMPANY_VISITS,
      placementOffers: INITIAL_PLACEMENT_OFFERS,

      addCompany: (companyData) => {
        const id = `comp-${Date.now()}`
        const newCompany: Company = { ...companyData, id }
        set((state) => ({ companies: [newCompany, ...state.companies] }))
        return id
      },

      updateCompany: (id, updates) => {
        set((state) => ({
          companies: state.companies.map((c) => (c.id === id ? { ...c, ...updates } : c)),
          // Automatically propagate company name changes to visits and offers!
          companyVisits: updates.name
            ? state.companyVisits.map((v) => (v.companyId === id ? { ...v, companyName: updates.name! } : v))
            : state.companyVisits,
          placementOffers: updates.name
            ? state.placementOffers.map((o) => (o.companyId === id ? { ...o, companyName: updates.name! } : o))
            : state.placementOffers
        }))
      },

      getCompanyById: (id) => {
        return get().companies.find((c) => c.id === id)
      },

      addCompanyVisit: (visitData) => {
        const id = `visit-${Date.now()}`
        const newVisit: CompanyVisit = { ...visitData, id }
        set((state) => ({ companyVisits: [newVisit, ...state.companyVisits] }))
        return id
      },

      updateCompanyVisit: (id, updates) => {
        set((state) => ({
          companyVisits: state.companyVisits.map((v) => (v.id === id ? { ...v, ...updates } : v))
        }))
      },

      deleteCompanyVisit: (id) => {
        set((state) => ({
          companyVisits: state.companyVisits.filter((v) => v.id !== id)
        }))
      },

      addPlacementOffer: (offerData) => {
        const id = `offer-${Date.now()}`
        const newOffer: PlacementOffer = { ...offerData, id }
        set((state) => ({ placementOffers: [newOffer, ...state.placementOffers] }))
        return id
      },

      bulkAddPlacementOffers: (offersData) => {
        const timestamp = Date.now()
        const newOffers: PlacementOffer[] = offersData.map((data, idx) => ({
          ...data,
          id: `offer-${timestamp}-${idx}`
        }))
        set((state) => ({ placementOffers: [...newOffers, ...state.placementOffers] }))
        return newOffers.length
      },

      updatePlacementOffer: (id, updates) => {
        set((state) => ({
          placementOffers: state.placementOffers.map((o) => (o.id === id ? { ...o, ...updates } : o))
        }))
      },

      deletePlacementOffer: (id) => {
        set((state) => ({
          placementOffers: state.placementOffers.filter((o) => o.id !== id)
        }))
      },

      getStats: (academicYear, deptFilter) => {
        let offers = get().placementOffers

        if (academicYear && academicYear !== 'ALL') {
          // If academic year is given, filter matching
        }

        if (deptFilter && deptFilter !== 'ALL_ET') {
          const resolved = DepartmentResolver.resolve(deptFilter)
          if (resolved.success) {
            offers = offers.filter((o) => o.departmentId === resolved.department.id)
          }
        }

        const totalOffers = offers.length
        const rollMap = new Map<string, number>()
        const companySet = new Set<string>()
        let maxPkg = 0
        let totalPkg = 0

        offers.forEach((o) => {
          rollMap.set(o.rollNumber, (rollMap.get(o.rollNumber) || 0) + 1)
          companySet.add(o.companyId || o.companyName)
          if (o.packageLPA > maxPkg) maxPkg = o.packageLPA
          totalPkg += o.packageLPA
        })

        const uniquePlacedStudents = rollMap.size
        let multipleOfferStudentsCount = 0
        rollMap.forEach((count) => {
          if (count > 1) multipleOfferStudentsCount++
        })

        const averagePackageLPA = totalOffers > 0 ? parseFloat((totalPkg / totalOffers).toFixed(2)) : 0

        return {
          uniquePlacedStudents,
          totalOffers,
          recruitingCompaniesCount: companySet.size,
          highestPackageLPA: maxPkg,
          averagePackageLPA,
          multipleOfferStudentsCount
        }
      }
    }),
    {
      name: 'nec_placements_master_store_v1'
    }
  )
)

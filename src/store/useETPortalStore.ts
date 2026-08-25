import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Faculty,
  StudentProject,
  StudentAchievement,
  StudentInternship,
  ResearchPublication,
  Patent,
  IndustryMoU,
  MediaGalleryItem,
  InstitutionalCircular,
  NPTELCertification
} from '../types/nec'

// Authentic ET Faculty Directory Seed
const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'fac-cys-01',
    name: 'Dr. M. Sreenivasa Rao',
    departmentId: 'dept-cys',
    designation: 'Professor & Head',
    email: 'hod.cys@nrtec.in',
    phone: '9440123456',
    qualification: 'Ph.D (CSE - Cyber Security), M.Tech',
    experienceYears: 18,
    specialization: 'Network Security, Cloud Cryptography & Threat Intelligence',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-cys-02',
    name: 'Mrs. K. Anitha',
    departmentId: 'dept-cys',
    designation: 'Associate Professor',
    email: 'anitha.k@nrtec.in',
    phone: '9848112233',
    qualification: 'M.Tech (CSE), (Ph.D)',
    experienceYears: 11,
    specialization: 'Malware Analysis, Web App Security, Digital Forensics',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-cys-03',
    name: 'Mr. V. Brahmaiah',
    departmentId: 'dept-cys',
    designation: 'Assistant Professor',
    email: 'brahmaiah.v@nrtec.in',
    phone: '9848223344',
    qualification: 'M.Tech (CSE)',
    experienceYears: 7,
    specialization: 'Ethical Hacking, Penetration Testing & Blockchain Security',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-ai-01',
    name: 'Dr. K. Lakshminarayana',
    departmentId: 'dept-ai',
    designation: 'Professor & Head',
    email: 'hod.ai@nrtec.in',
    phone: '9440234567',
    qualification: 'Ph.D (AI & Robotics), M.Tech',
    experienceYears: 20,
    specialization: 'Computer Vision, Cognitive Robotics & Deep Learning',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-aiml-01',
    name: 'Dr. B. Venkata Rao',
    departmentId: 'dept-aiml',
    designation: 'Professor & Head',
    email: 'hod.aiml@nrtec.in',
    phone: '9440345678',
    qualification: 'Ph.D (Machine Learning), M.Tech',
    experienceYears: 16,
    specialization: 'Reinforcement Learning, Generative Modeling & NLP',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-ds-01',
    name: 'Dr. P. Siva Prasad',
    departmentId: 'dept-ds',
    designation: 'Professor & Head',
    email: 'hod.ds@nrtec.in',
    phone: '9440456789',
    qualification: 'Ph.D (Big Data Analytics), M.Tech',
    experienceYears: 15,
    specialization: 'Distributed Computing, Predictive Analytics & Stream Processing',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  }
]

const INITIAL_PROJECTS: StudentProject[] = [
  {
    id: 'proj-01',
    title: 'Autonomous Drone Detection & RF Jamming System using Deep Learning',
    projectType: 'Capstone',
    departmentId: 'dept-cys',
    academicYear: '2026-27',
    year: 'IV',
    batch: '2023-2027',
    guideFacultyName: 'Dr. M. Sreenivasa Rao',
    teamLeaderRoll: '23CYS001',
    teamLeaderName: 'A. Sai Teja',
    teamMembers: [
      { rollNumber: '23CYS001', name: 'A. Sai Teja' },
      { rollNumber: '23CYS003', name: 'C. Divya Sri' },
      { rollNumber: '23CYS007', name: 'K. Rupa Devi' }
    ],
    domain: 'Cyber Defense & Edge AI',
    abstract: 'Development of an automated RF signal analysis system on SDR (Software Defined Radio) coupled with YOLOv9 computer vision models for rogue UAV detection and non-kinetic mitigation.',
    githubUrl: 'https://github.com/nrtec-et/drone-rf-defense',
    demoUrl: 'https://drone-defense.nrtec.edu.in',
    status: 'In Progress'
  },
  {
    id: 'proj-02',
    title: 'Real-time Diabetic Retinopathy Grading via Self-Supervised Vision Transformers',
    projectType: 'Capstone',
    departmentId: 'dept-ai',
    academicYear: '2026-27',
    year: 'IV',
    batch: '2023-2027',
    guideFacultyName: 'Dr. K. Lakshminarayana',
    teamLeaderRoll: '23AI001',
    teamLeaderName: 'A. Rohith',
    teamMembers: [
      { rollNumber: '23AI001', name: 'A. Rohith' },
      { rollNumber: '23AI002', name: 'B. Meghana' }
    ],
    domain: 'Medical Computer Vision',
    abstract: 'Clinical fundus image analysis achieving 97.4% accuracy across five DR stages with attention explainability maps for rural diagnostic centers.',
    status: 'Completed'
  },
  {
    id: 'proj-03',
    title: 'High-Throughput Fraud Detection Engine with Graph Neural Networks',
    projectType: 'Industry Project',
    departmentId: 'dept-aiml',
    academicYear: '2026-27',
    year: 'III',
    batch: '2023-2027',
    guideFacultyName: 'Dr. B. Venkata Rao',
    teamLeaderRoll: '23AIML001',
    teamLeaderName: 'K. Sai Praneeth',
    teamMembers: [
      { rollNumber: '23AIML001', name: 'K. Sai Praneeth' },
      { rollNumber: '23AIML002', name: 'L. Hema Latha' }
    ],
    domain: 'Financial AI & GNNs',
    abstract: 'Scalable temporal graph representation learning on financial transaction streams detecting mule account rings in sub-50ms latency.',
    status: 'In Progress'
  }
]

const INITIAL_ACHIEVEMENTS: StudentAchievement[] = [
  {
    id: 'ach-01',
    rollNumber: '23CYS001',
    studentName: 'A. Sai Teja',
    departmentId: 'dept-cys',
    year: 'III',
    section: 'A',
    category: 'Hackathon',
    eventTitle: 'Smart India Hackathon (SIH 2025) Grand Finale',
    organizedBy: 'Ministry of Education & AICTE',
    prizePosition: '1st Prize',
    cashPrize: 100000,
    eventDate: '2025-12-22',
    certificateUrl: 'https://nrtec.in/certificates/sih_2025_winner.pdf',
    verified: true
  },
  {
    id: 'ach-02',
    rollNumber: '23AI002',
    studentName: 'B. Meghana',
    departmentId: 'dept-ai',
    year: 'III',
    section: 'A',
    category: 'Coding Contest',
    eventTitle: 'ACM-ICPC Asia Regional Preliminary',
    organizedBy: 'Amrita Vishwa Vidyapeetham',
    prizePosition: 'Winner',
    eventDate: '2026-01-18',
    verified: true
  }
]

const INITIAL_INTERNSHIPS: StudentInternship[] = [
  {
    id: 'int-01',
    rollNumber: '23CYS003',
    studentName: 'C. Divya Sri',
    departmentId: 'dept-cys',
    companyName: 'Palo Alto Networks',
    role: 'SOC Security Analyst Intern',
    stipendAmount: 35000,
    durationWeeks: 12,
    startDate: '2026-05-15',
    endDate: '2026-08-10',
    mode: 'Onsite',
    offerLetterVerified: true,
    status: 'Completed'
  },
  {
    id: 'int-02',
    rollNumber: '23AIML001',
    studentName: 'K. Sai Praneeth',
    departmentId: 'dept-aiml',
    companyName: 'Amazon Web Services (AWS)',
    role: 'Cloud ML Intern',
    stipendAmount: 45000,
    durationWeeks: 16,
    startDate: '2026-05-01',
    endDate: '2026-08-31',
    mode: 'Hybrid',
    offerLetterVerified: true,
    status: 'Ongoing'
  }
]

const INITIAL_PUBLICATIONS: ResearchPublication[] = [
  {
    id: 'pub-01',
    title: 'Adaptive Threat Modeling in Zero Trust Edge Networks Using Explainable Transformer Ensembles',
    facultyAuthorNames: ['Dr. M. Sreenivasa Rao', 'Mrs. K. Anitha'],
    departmentId: 'dept-cys',
    journalOrConfName: 'IEEE Transactions on Information Forensics and Security',
    indexing: 'SCI',
    publicationType: 'Journal',
    publicationDate: '2026-03-15',
    volumeIssue: 'Vol. 21, pp. 1120-1135',
    issnIsbn: '1556-6013',
    doi: '10.1109/TIFS.2026.3129845',
    impactFactor: 7.2,
    citationsCount: 14,
    paperUrl: 'https://ieeexplore.ieee.org/document/3129845'
  },
  {
    id: 'pub-02',
    title: 'Multi-Modal Vision-Language Representations for Autonomous Micro-UAV Navigation in GPS-Denied Environments',
    facultyAuthorNames: ['Dr. K. Lakshminarayana'],
    departmentId: 'dept-ai',
    journalOrConfName: 'Elsevier Pattern Recognition',
    indexing: 'SCI',
    publicationType: 'Journal',
    publicationDate: '2026-05-20',
    doi: '10.1016/j.patcog.2026.109842',
    impactFactor: 8.0,
    citationsCount: 9
  }
]

const INITIAL_PATENTS: Patent[] = [
  {
    id: 'pat-01',
    applicationNumber: '202641019842 A',
    title: 'An Intelligent Hardware Security Module with Dynamic Quantum-Resistant Key Derivation',
    inventorNames: ['Dr. M. Sreenivasa Rao', 'Mr. V. Brahmaiah', 'A. Sai Teja'],
    departmentId: 'dept-cys',
    filingDate: '2026-02-14',
    status: 'Published',
    patentOffice: 'Indian Patent Office',
    publicationDate: '2026-04-10'
  },
  {
    id: 'pat-02',
    applicationNumber: '202541088421 A',
    title: 'Automated Real-time Crop Disease Phenotyping Camera with Edge Vision AI',
    inventorNames: ['Dr. K. Lakshminarayana', 'Dr. B. Venkata Rao'],
    departmentId: 'dept-ai',
    filingDate: '2025-09-08',
    status: 'Granted',
    patentOffice: 'Indian Patent Office',
    grantDate: '2026-06-18'
  }
]

const INITIAL_MOUS: IndustryMoU[] = [
  {
    id: 'mou-01',
    companyName: 'Fortinet Cyber Security Academy',
    departmentId: 'dept-cys',
    signingDate: '2025-06-15',
    validityYears: 3,
    expiryDate: '2028-06-14',
    nodalOfficerName: 'Dr. M. Sreenivasa Rao',
    activitiesConducted: [
      'NSE-4 Network Security Certification Training (180 Students)',
      'Establishment of Fortinet Security COE Lab',
      'Faculty Hands-on Train-the-Trainer Bootcamp'
    ],
    status: 'Active'
  },
  {
    id: 'mou-02',
    companyName: 'AWS Academy & NVIDIA Deep Learning Institute',
    departmentId: 'dept-ai',
    signingDate: '2025-08-01',
    validityYears: 3,
    expiryDate: '2028-07-31',
    nodalOfficerName: 'Dr. K. Lakshminarayana',
    activitiesConducted: [
      'AWS Cloud Practitioner & ML Specialty Program',
      'NVIDIA DLI Certificate Workshop on Accelerated Computing'
    ],
    status: 'Active'
  }
]

const INITIAL_NPTEL: NPTELCertification[] = [
  {
    id: 'nptel-01',
    candidateType: 'Student',
    rollOrId: '23CYS001',
    name: 'A. Sai Teja',
    departmentId: 'dept-cys',
    courseName: 'Ethical Hacking & Information Security',
    courseDomain: 'Cyber Security & Forensics',
    examSession: 'Jul-Oct 2025',
    score: 94,
    certificateType: 'Elite + Gold'
  },
  {
    id: 'nptel-02',
    candidateType: 'Student',
    rollOrId: '23CYS003',
    name: 'C. Divya Sri',
    departmentId: 'dept-cys',
    courseName: 'Cryptography and Network Security',
    courseDomain: 'Cyber Security & Forensics',
    examSession: 'Jul-Oct 2025',
    score: 88,
    certificateType: 'Elite + Silver'
  },
  {
    id: 'nptel-03',
    candidateType: 'Faculty',
    rollOrId: 'FAC-CYS-02',
    name: 'Mrs. K. Anitha',
    departmentId: 'dept-cys',
    courseName: 'Cloud Security and Privacy',
    courseDomain: 'Cloud Computing',
    examSession: 'Jul-Oct 2025',
    score: 91,
    certificateType: 'Topper 1%'
  }
]

const INITIAL_CIRCULARS: InstitutionalCircular[] = [
  {
    id: 'circ-01',
    referenceNo: 'NEC/AUT/ET/2026/088',
    title: 'Submission of BoS Resolutions & Revised R23 IV-Year Curriculum Structure',
    issuedBy: 'Dean Academics & Principal',
    issueDate: '2026-08-10',
    targetAudience: 'HODs of AI, AIML, CYS, DS & BoS Chairpersons',
    category: 'Governance',
    isPinned: true
  },
  {
    id: 'circ-02',
    referenceNo: 'NEC/EXAM/ATT/2026/042',
    title: 'Strict Condonation Guidelines for Students Below 65% Monthly Attendance',
    issuedBy: 'Controller of Examinations',
    issueDate: '2026-08-20',
    targetAudience: 'All ET Department Faculty & Students',
    category: 'Examination',
    isPinned: true
  }
]

const INITIAL_GALLERY: MediaGalleryItem[] = [
  {
    id: 'gal-01',
    title: 'National Workshop on Threat Simulation & Reverse Engineering',
    eventType: 'Workshop',
    eventDate: '2026-08-19',
    departmentId: 'dept-cys',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    caption: 'Students practicing live malware analysis in CYS Innovation Lab.',
    tags: ['CYS', 'CyberSecurity', 'HandsOn']
  },
  {
    id: 'gal-02',
    title: 'Generative AI & Agentic Architectures FDP Inauguration',
    eventType: 'FDP',
    eventDate: '2026-08-25',
    departmentId: 'dept-ai',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    caption: 'Dignitaries lighting the lamp during the National FDP opening session.',
    tags: ['AI', 'FDP', 'Research']
  }
]

interface ETPortalState {
  faculty: Faculty[]
  projects: StudentProject[]
  achievements: StudentAchievement[]
  internships: StudentInternship[]
  publications: ResearchPublication[]
  patents: Patent[]
  mous: IndustryMoU[]
  nptel: NPTELCertification[]
  circulars: InstitutionalCircular[]
  gallery: MediaGalleryItem[]

  // Add methods
  addProject: (p: Omit<StudentProject, 'id'>) => void
  addAchievement: (a: Omit<StudentAchievement, 'id'>) => void
  addInternship: (i: Omit<StudentInternship, 'id'>) => void
  addPublication: (pub: Omit<ResearchPublication, 'id'>) => void
  addPatent: (pat: Omit<Patent, 'id'>) => void
  addMoU: (mou: Omit<IndustryMoU, 'id'>) => void
  addNPTEL: (n: Omit<NPTELCertification, 'id'>) => void
  addCircular: (c: Omit<InstitutionalCircular, 'id'>) => void
  addGalleryItem: (g: Omit<MediaGalleryItem, 'id'>) => void
}

export const useETPortalStore = create<ETPortalState>()(
  persist(
    (set) => ({
      faculty: INITIAL_FACULTY,
      projects: INITIAL_PROJECTS,
      achievements: INITIAL_ACHIEVEMENTS,
      internships: INITIAL_INTERNSHIPS,
      publications: INITIAL_PUBLICATIONS,
      patents: INITIAL_PATENTS,
      mous: INITIAL_MOUS,
      nptel: INITIAL_NPTEL,
      circulars: INITIAL_CIRCULARS,
      gallery: INITIAL_GALLERY,

      addProject: (p) => set((s) => ({ projects: [{ ...p, id: `proj_${Date.now()}` }, ...s.projects] })),
      addAchievement: (a) => set((s) => ({ achievements: [{ ...a, id: `ach_${Date.now()}` }, ...s.achievements] })),
      addInternship: (i) => set((s) => ({ internships: [{ ...i, id: `int_${Date.now()}` }, ...s.internships] })),
      addPublication: (pub) => set((s) => ({ publications: [{ ...pub, id: `pub_${Date.now()}` }, ...s.publications] })),
      addPatent: (pat) => set((s) => ({ patents: [{ ...pat, id: `pat_${Date.now()}` }, ...s.patents] })),
      addMoU: (mou) => set((s) => ({ mous: [{ ...mou, id: `mou_${Date.now()}` }, ...s.mous] })),
      addNPTEL: (n) => set((s) => ({ nptel: [{ ...n, id: `nptel_${Date.now()}` }, ...s.nptel] })),
      addCircular: (c) => set((s) => ({ circulars: [{ ...c, id: `circ_${Date.now()}` }, ...s.circulars] })),
      addGalleryItem: (g) => set((s) => ({ gallery: [{ ...g, id: `gal_${Date.now()}` }, ...s.gallery] }))
    }),
    {
      name: 'nec_et_portal_data_v4'
    }
  )
)

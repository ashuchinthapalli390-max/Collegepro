import type { Department, ETDepartmentCode } from '../types/nec'

export const CANONICAL_ET_DEPARTMENTS: Department[] = [
  {
    id: 'dept-cys',
    code: 'CYS',
    officialName: 'CSE (Cyber Security)',
    shortName: 'Cyber Security',
    aliases: [
      'cys',
      'cyber security',
      'cybersecurity',
      'cyber',
      'cse (cyber security)',
      'cse(cyber security)',
      'cse (cybersecurity)',
      'cse cyber security',
      'cse-cyber security',
      'cse(cs)',
      'cse (cs)',
      'cse cs',
      'cs - cyber security',
      'cyber security engineering',
      'cys-a',
      'cys-b',
      'cys-c',
      'cys-d',
      'dept-cys'
    ],
    hodName: 'Dr. M. Sreenivasa Rao',
    establishedYear: 2021,
    isActiveET: true,
    description: 'Specializing in Network Security, Cryptography, Ethical Hacking, Digital Forensics, and Threat Intelligence.'
  },
  {
    id: 'dept-ai',
    code: 'AI',
    officialName: 'Artificial Intelligence',
    shortName: 'AI',
    aliases: [
      'ai',
      'artificial intelligence',
      'cse (ai)',
      'cse(ai)',
      'cse ai',
      'cse-ai',
      'b.tech ai',
      'dept-ai'
    ],
    hodName: 'Dr. K. Lakshminarayana',
    establishedYear: 2020,
    isActiveET: true,
    description: 'Focusing on Computer Vision, Natural Language Processing, Cognitive Computing, and Neural Architectures.'
  },
  {
    id: 'dept-aiml',
    code: 'AIML',
    officialName: 'Artificial Intelligence & Machine Learning',
    shortName: 'AIML',
    aliases: [
      'aiml',
      'ai & ml',
      'ai&ml',
      'ai ml',
      'cse (aiml)',
      'cse(aiml)',
      'cse aiml',
      'cse-aiml',
      'cse (ai & ml)',
      'cse (ai&ml)',
      'artificial intelligence and machine learning',
      'artificial intelligence & machine learning',
      'dept-aiml'
    ],
    hodName: 'Dr. B. Venkata Rao',
    establishedYear: 2020,
    isActiveET: true,
    description: 'Mastering Deep Learning, Reinforcement Learning, Predictive Modeling, and Generative AI.'
  },
  {
    id: 'dept-ds',
    code: 'DS',
    officialName: 'CSE (Data Science)',
    shortName: 'Data Science',
    aliases: [
      'ds',
      'data science',
      'data-science',
      'cse (ds)',
      'cse(ds)',
      'cse ds',
      'cse-ds',
      'cse_ds',
      'cse (data science)',
      'cse(data science)',
      'cse data science',
      'data science engineering',
      'b.tech cse(ds)',
      'dept-ds'
    ],
    hodName: 'Dr. P. Siva Prasad',
    establishedYear: 2020,
    isActiveET: true,
    description: 'Specializing in Big Data Analytics, Statistical Computing, Business Intelligence, and Data Engineering.'
  }
]

export const NON_ET_DEPARTMENT_CODES = [
  'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'MBA', 'MCA', 'BS&H', 'CHEM', 'PHYS', 'MATHS', 'ENG'
]

export type DepartmentResolutionResult = 
  | { success: true; department: Department }
  | { success: false; reason: 'NON_ET'; rawValue: string }
  | { success: false; reason: 'UNKNOWN'; rawValue: string }

export class DepartmentResolver {
  private static cleanString(val: string): string {
    return val
      .trim()
      .toLowerCase()
      .replace(/[\s\-_]+/g, ' ')
      .replace(/[()]/g, '')
  }

  /**
   * Resolves any input alias or code into the canonical ET Department.
   * e.g. "Cyber Security", "CYS", "CSE (Cyber Security)" -> CSE (Cyber Security) (CYS)
   */
  public static resolve(input: string | undefined | null): DepartmentResolutionResult {
    if (!input || !input.trim()) {
      return { success: false, reason: 'UNKNOWN', rawValue: '' }
    }

    const raw = input.trim()
    const cleaned = this.cleanString(raw)

    // Check direct ID or code match
    for (const dept of CANONICAL_ET_DEPARTMENTS) {
      if (dept.id.toLowerCase() === raw.toLowerCase() || dept.code.toLowerCase() === raw.toLowerCase()) {
        return { success: true, department: dept }
      }
      if (this.cleanString(dept.officialName) === cleaned || this.cleanString(dept.shortName) === cleaned) {
        return { success: true, department: dept }
      }
    }

    // Check aliases
    for (const dept of CANONICAL_ET_DEPARTMENTS) {
      for (const alias of dept.aliases) {
        if (this.cleanString(alias) === cleaned || alias.toLowerCase() === raw.toLowerCase()) {
          return { success: true, department: dept }
        }
      }
    }

    // Check if it's explicitly a known non-ET department
    const upperRaw = raw.toUpperCase()
    if (NON_ET_DEPARTMENT_CODES.includes(upperRaw) || 
        upperRaw.startsWith('ECE') || 
        upperRaw.startsWith('EEE') || 
        upperRaw.startsWith('MECH') || 
        upperRaw.startsWith('CIVIL') || 
        upperRaw.startsWith('IT') ||
        (upperRaw === 'CSE' || upperRaw === 'COMPUTER SCIENCE & ENGINEERING' || upperRaw === 'COMPUTER SCIENCE AND ENGINEERING')) {
      return { success: false, reason: 'NON_ET', rawValue: raw }
    }

    return { success: false, reason: 'UNKNOWN', rawValue: raw }
  }

  /**
   * Returns canonical department by ID or code, fallback to CYS if not found
   */
  public static getDepartmentById(idOrCode: string): Department {
    const res = this.resolve(idOrCode)
    if (res.success) {
      return res.department
    }
    return CANONICAL_ET_DEPARTMENTS[0] // Default CYS
  }

  /**
   * Safe display name lookup: always derives from Department Master
   */
  public static getDisplayName(idOrCode: string): string {
    return this.getDepartmentById(idOrCode).officialName
  }

  /**
   * Safe short name lookup: "Cyber Security", "AI", "AIML", "DS"
   */
  public static getShortName(idOrCode: string): string {
    return this.getDepartmentById(idOrCode).shortName
  }

  /**
   * Check if department is in allowed ET scope
   */
  public static isAllowedET(idOrCode: string): boolean {
    return this.resolve(idOrCode).success
  }

  /**
   * Get all active ET departments for select boxes
   */
  public static getETOptions(): { value: string; label: string; code: ETDepartmentCode }[] {
    return CANONICAL_ET_DEPARTMENTS.map((d) => ({
      value: d.id,
      label: `${d.officialName} (${d.code})`,
      code: d.code
    }))
  }
}

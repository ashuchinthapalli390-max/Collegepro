export interface FeatureFlags {
  NAAC_SSR: boolean
  NBA_TIER1: boolean
  NIRF_REPOSITORY: boolean
  COMPLIANCE_EXPORTS: boolean
  NPTEL_CERTIFICATIONS: boolean
  ATTENDANCE_RISK: boolean
  BOS_MANAGEMENT: boolean
  ACADEMIC_EVENTS: boolean
  STUDENT_PROJECTS: boolean
  STUDENT_ACHIEVEMENTS: boolean
  STUDENT_INTERNSHIPS: boolean
  FACULTY_DIRECTORY: boolean
  RESEARCH_PUBLICATIONS: boolean
  PATENTS_IPR: boolean
  INDUSTRY_MOUS: boolean
  MEDIA_GALLERY: boolean
  CIRCULARS: boolean
}

export const FEATURE_FLAGS: FeatureFlags = {
  // Modules explicitly hidden per institution policy
  NAAC_SSR: false,
  NBA_TIER1: false,
  NIRF_REPOSITORY: false,
  COMPLIANCE_EXPORTS: false,

  // Modules active
  NPTEL_CERTIFICATIONS: true,
  ATTENDANCE_RISK: true,
  BOS_MANAGEMENT: true,
  ACADEMIC_EVENTS: true,
  STUDENT_PROJECTS: true,
  STUDENT_ACHIEVEMENTS: true,
  STUDENT_INTERNSHIPS: true,
  FACULTY_DIRECTORY: true,
  RESEARCH_PUBLICATIONS: true,
  PATENTS_IPR: true,
  INDUSTRY_MOUS: true,
  MEDIA_GALLERY: true,
  CIRCULARS: true,
}

export const isFeatureEnabled = (key: keyof FeatureFlags): boolean => {
  return FEATURE_FLAGS[key] ?? false
}

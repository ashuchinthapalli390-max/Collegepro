import { 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  FileSpreadsheet, 
  FileCheck2, 
  Layers,
  Plus,
  BookOpen,
  FileText,
  Lightbulb,
  Handshake,
  Trophy,
  Sparkles,
  Award,
  Search,
  UserCheck
} from 'lucide-react';

/**
 * Centralized Role Presentation & Description Mapping
 * Governs the visual presentation and scope descriptions across the NEC portal.
 */
export const ROLE_PRESENTATION = {
  SUPER_ADMIN: {
    code: 'SUPER_ADMIN',
    label: 'Super Admin Governance',
    shortLabel: 'Super Admin',
    icon: ShieldCheck,
    color: '#F1C40F',
    bg: 'rgba(212, 175, 55, 0.18)',
    border: 'rgba(212, 175, 55, 0.35)',
    description: (dept) => 'Narasaraopeta Engineering College Academic & Research Administration. You have institution-wide administrative oversight based on your assigned permissions.'
  },
  ADMIN: {
    code: 'ADMIN',
    label: 'Administration',
    shortLabel: 'Admin',
    icon: Layers,
    color: '#60A5FA',
    bg: 'rgba(96, 165, 250, 0.18)',
    border: 'rgba(96, 165, 250, 0.35)',
    description: (dept) => 'Manage authorized academic, research and administrative operations across the institution.'
  },
  HOD: {
    code: 'HOD',
    label: 'Department Leadership',
    shortLabel: 'HOD',
    icon: Building2,
    color: '#34D399',
    bg: 'rgba(52, 211, 153, 0.18)',
    border: 'rgba(52, 211, 153, 0.35)',
    description: (dept) => `Manage authorized academic, research, faculty and student-development activities for the Department of ${dept || 'Engineering'}.`
  },
  FACULTY: {
    code: 'FACULTY',
    label: 'Faculty Workspace',
    shortLabel: 'Faculty',
    icon: GraduationCap,
    color: '#A78BFA',
    bg: 'rgba(167, 139, 250, 0.18)',
    border: 'rgba(167, 139, 250, 0.35)',
    description: (dept) => `Manage your research profile, publications, achievements, memberships and assigned academic records${dept ? ` in the Department of ${dept}` : ''}.`
  },
  DATA_ENTRY: {
    code: 'DATA_ENTRY',
    label: 'Data Management',
    shortLabel: 'Data Entry',
    icon: FileSpreadsheet,
    color: '#F472B6',
    bg: 'rgba(244, 114, 182, 0.18)',
    border: 'rgba(244, 114, 182, 0.35)',
    description: (dept) => 'Manage authorized institutional records assigned to your account.'
  },
  AUDITOR: {
    code: 'AUDITOR',
    label: 'Audit & Compliance',
    shortLabel: 'Auditor',
    icon: FileCheck2,
    color: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.18)',
    border: 'rgba(56, 189, 248, 0.35)',
    description: (dept) => 'Review authorized records, evidence and audit history in read-only audit scope.'
  }
};

/**
 * Registry of Quick Actions filtered strictly by permission and role
 */
export const QUICK_ACTIONS_REGISTRY = [
  {
    id: 'create-bos',
    label: 'Create BoS Meeting',
    icon: BookOpen,
    moduleId: 'bos-meetings',
    permission: 'bos.create',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOD'],
    color: '#D4AF37'
  },
  {
    id: 'add-publication',
    label: 'Add Publication',
    icon: FileText,
    moduleId: 'publications',
    permission: 'publications.manage',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOD', 'FACULTY', 'DATA_ENTRY'],
    color: '#10B981'
  },
  {
    id: 'research-discovery',
    label: 'Research Discovery',
    icon: Sparkles,
    moduleId: 'research-discovery',
    permission: 'publications.manage',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOD', 'FACULTY'],
    color: '#F59E0B'
  },
  {
    id: 'establish-mou',
    label: 'Establish MoU',
    icon: Handshake,
    moduleId: 'mous-collaborations',
    permission: 'mous.manage',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOD'],
    color: '#8B5CF6'
  },
  {
    id: 'add-achievement',
    label: 'Add Achievement',
    icon: Trophy,
    moduleId: 'student-achievements',
    permission: 'student_data.manage',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOD', 'FACULTY', 'DATA_ENTRY'],
    color: '#EC4899'
  },
  {
    id: 'add-faculty-membership',
    label: 'Add Membership',
    icon: Award,
    moduleId: 'faculty-memberships',
    permission: 'fdp.manage',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOD', 'FACULTY'],
    color: '#06B6D4'
  },
  {
    id: 'provision-user',
    label: 'Provision User',
    icon: UserCheck,
    moduleId: 'iam-users',
    permission: 'users.create',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    color: '#6366F1'
  },
  {
    id: 'audit-reports',
    label: 'View Audit Logs',
    icon: ShieldCheck,
    moduleId: 'audit-logs',
    permission: 'audit.view',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'AUDITOR'],
    color: '#38BDF8'
  }
];

/**
 * Returns role presentation configuration for a given role code
 */
export function getRolePresentation(roleCode, department, userName) {
  const role = ROLE_PRESENTATION[roleCode] || ROLE_PRESENTATION.FACULTY;
  return {
    ...role,
    renderedDescription: role.description(department)
  };
}

/**
 * Filters quick actions available to the user based on permissions & roles
 */
export function getAuthorizedQuickActions(user, permissions = []) {
  if (!user) return [];
  const userRole = user.role || 'FACULTY';
  const userPerms = permissions.length > 0 ? permissions : (user.permissions || []);

  return QUICK_ACTIONS_REGISTRY.filter(action => {
    // If role explicitly listed
    const roleAllowed = action.allowedRoles.includes(userRole);
    // If permission matched or user is SUPER_ADMIN
    const permAllowed = userRole === 'SUPER_ADMIN' || (action.permission && userPerms.includes(action.permission));
    return roleAllowed || permAllowed;
  }).slice(0, 4); // Show top 4 most relevant actions
}

/**
 * Generates clean 2-letter uppercase initials from full name
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'NE';
  const clean = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.|Sri\.)\s+/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NE';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

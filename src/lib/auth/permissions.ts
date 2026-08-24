export const USER_ROLES = {
  SUPER_ADMIN: {
    code: 'SUPER_ADMIN',
    name: 'Super Administrator',
    description: 'Full institutional governance, security policies, user management, and overrides.',
    defaultPath: '/portal'
  },
  ADMIN: {
    code: 'ADMIN',
    name: 'College Administrator',
    description: 'Institution-wide operational control, faculty directory management, and approvals.',
    defaultPath: '/portal'
  },
  HOD: {
    code: 'HOD',
    name: 'Head of the Department',
    description: 'Departmental curriculum, BoS meeting creation, faculty publications, and student records.',
    defaultPath: '/portal'
  },
  FACULTY: {
    code: 'FACULTY',
    name: 'Faculty Member',
    description: 'Research publications, patents, student mentoring, and self profile updates.',
    defaultPath: '/portal'
  },
  DATA_ENTRY: {
    code: 'DATA_ENTRY',
    name: 'Academic Data Operator',
    description: 'Entry of publications, events, FDPs, and internships.',
    defaultPath: '/portal'
  },
  AUDITOR: {
    code: 'AUDITOR',
    name: 'Compliance & NAAC/NBA Auditor',
    description: 'Read-only access to all institutional records, reports, and audit logs.',
    defaultPath: '/portal'
  }
};

export const ALL_PERMISSIONS = [
  // User & Security Management
  { id: 'users.view', label: 'View Users Directory', category: 'IAM & Security' },
  { id: 'users.create', label: 'Provision Single User', category: 'IAM & Security' },
  { id: 'users.bulk_import', label: 'Bulk CSV User Provisioning', category: 'IAM & Security' },
  { id: 'users.suspend', label: 'Suspend / Unlock Users', category: 'IAM & Security' },
  { id: 'users.reset_password', label: 'Issue Password Reset Links', category: 'IAM & Security' },
  { id: 'sessions.revoke', label: 'Revoke Active Sessions', category: 'IAM & Security' },
  { id: 'audit.view', label: 'View Immutable Audit Trail', category: 'IAM & Security' },

  // Board of Studies (BoS) Governance
  { id: 'bos.view', label: 'View BoS Meetings & Deliberations', category: 'Board of Studies' },
  { id: 'bos.create', label: 'Create / Schedule BoS Meeting', category: 'Board of Studies' },
  { id: 'bos.edit', label: 'Edit BoS Records', category: 'Board of Studies' },
  { id: 'bos.approve', label: 'Approve BoS Minutes', category: 'Board of Studies' },
  { id: 'bos.publish', label: 'Publish BoS Records', category: 'Board of Studies' },
  { id: 'bos.archive', label: 'Archive / Restore BoS Records', category: 'Board of Studies' },
  { id: 'bos.delete', label: 'Delete / Trash Draft BoS Records', category: 'Board of Studies' },

  // Research & Madam 12 Modules
  { id: 'publications.manage', label: 'Manage Research Publications & Sync', category: 'Research & Academics' },
  { id: 'patents.manage', label: 'Manage Inventions & Patents', category: 'Research & Academics' },
  { id: 'mous.manage', label: 'Manage Industry MoUs & Expiry Alerts', category: 'Research & Academics' },
  { id: 'student_data.manage', label: 'Manage Achievements, Internships & Projects', category: 'Student Records' },
  { id: 'fdp.manage', label: 'Manage Faculty Development Programs', category: 'Faculty Affairs' },
  { id: 'reports.export', label: 'Export PDF / Excel / CSV Reports', category: 'Reports' }
];

export const ROLE_DEFAULT_PERMISSIONS = {
  SUPER_ADMIN: ALL_PERMISSIONS.map(p => p.id),
  ADMIN: [
    'users.view', 'users.create', 'users.bulk_import', 'sessions.revoke', 'audit.view',
    'bos.view', 'bos.create', 'bos.edit', 'bos.approve', 'bos.publish', 'bos.archive', 'bos.delete',
    'publications.manage', 'patents.manage', 'mous.manage', 'student_data.manage', 'fdp.manage', 'reports.export'
  ],
  HOD: [
    'bos.view', 'bos.create', 'bos.edit', 'bos.archive', 'bos.delete',
    'publications.manage', 'patents.manage', 'mous.manage', 'student_data.manage', 'fdp.manage', 'reports.export'
  ],
  FACULTY: [
    'publications.manage', 'patents.manage', 'student_data.manage', 'reports.export'
  ],
  DATA_ENTRY: [
    'publications.manage', 'patents.manage', 'student_data.manage', 'fdp.manage'
  ],
  AUDITOR: [
    'users.view', 'audit.view', 'bos.view', 'reports.export'
  ]
};

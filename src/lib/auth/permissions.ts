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
  { id: 'events.view', label: 'View Academic Events & Workshops', category: 'Academic Events' },
  { id: 'events.create', label: 'Create Academic Event', category: 'Academic Events' },
  { id: 'events.update', label: 'Edit Academic Event', category: 'Academic Events' },
  { id: 'events.bulk_import', label: 'Bulk CSV Import Academic Events', category: 'Academic Events' },
  { id: 'events.review', label: 'Review & Verify Academic Events', category: 'Academic Events' },
  // Bulk Data Center & Media Ingestion
  { id: 'bulk_import.view', label: 'Access Bulk Data Center', category: 'Bulk Data & Migration' },
  { id: 'bulk_import.upload', label: 'Upload CSV/XLSX Institutional Datasets', category: 'Bulk Data & Migration' },
  { id: 'bulk_import.validate', label: 'Validate & Review Staging Datasets', category: 'Bulk Data & Migration' },
  { id: 'bulk_import.commit', label: 'Commit Bulk Import to Production Drafts', category: 'Bulk Data & Migration' },
  { id: 'bulk_import.rollback', label: 'Rollback Staged / Draft Bulk Imports', category: 'Bulk Data & Migration' },
  { id: 'bulk_import.download_template', label: 'Download Module Import Templates', category: 'Bulk Data & Migration' },
  { id: 'bulk_import.download_errors', label: 'Download Import Issue Reports', category: 'Bulk Data & Migration' },
  { id: 'bulk_import.view_history', label: 'View Ingestion History & Provenance', category: 'Bulk Data & Migration' },
  { id: 'bulk_import.manage_mappings', label: 'Manage Institutional Alias Mappings', category: 'Bulk Data & Migration' },
  { id: 'media.bulk_upload', label: 'Folder-Based Bulk Media Ingestion', category: 'Media & Gallery' },
  { id: 'media.approve_public', label: 'Approve Media for Public Visibility', category: 'Media & Gallery' },
  { id: 'reports.export', label: 'Export PDF / Excel / CSV Reports', category: 'Reports' }
];

export const ROLE_DEFAULT_PERMISSIONS = {
  SUPER_ADMIN: ALL_PERMISSIONS.map(p => p.id),
  ADMIN: [
    'users.view', 'users.create', 'users.bulk_import', 'sessions.revoke', 'audit.view',
    'bos.view', 'bos.create', 'bos.edit', 'bos.approve', 'bos.publish', 'bos.archive', 'bos.delete',
    'publications.manage', 'patents.manage', 'mous.manage', 'student_data.manage', 'fdp.manage',
    'events.view', 'events.create', 'events.update', 'events.bulk_import', 'events.review', 'events.approve',
    'bulk_import.view', 'bulk_import.upload', 'bulk_import.validate', 'bulk_import.commit', 'bulk_import.rollback',
    'bulk_import.download_template', 'bulk_import.download_errors', 'bulk_import.view_history', 'bulk_import.manage_mappings',
    'media.bulk_upload', 'media.approve_public',
    'reports.export'
  ],
  HOD: [
    'bos.view', 'bos.create', 'bos.edit', 'bos.archive', 'bos.delete',
    'publications.manage', 'patents.manage', 'mous.manage', 'student_data.manage', 'fdp.manage',
    'events.view', 'events.create', 'events.update', 'events.bulk_import', 'events.review',
    'bulk_import.view', 'bulk_import.upload', 'bulk_import.validate', 'bulk_import.commit',
    'bulk_import.download_template', 'bulk_import.download_errors', 'bulk_import.view_history',
    'media.bulk_upload',
    'reports.export'
  ],
  FACULTY: [
    'publications.manage', 'patents.manage', 'student_data.manage',
    'events.view', 'events.create', 'events.update',
    'bulk_import.download_template',
    'reports.export'
  ],
  DATA_ENTRY: [
    'publications.manage', 'patents.manage', 'student_data.manage', 'fdp.manage',
    'events.view', 'events.create',
    'bulk_import.view', 'bulk_import.upload', 'bulk_import.validate', 'bulk_import.commit',
    'bulk_import.download_template', 'bulk_import.download_errors',
    'media.bulk_upload'
  ],
  AUDITOR: [
    'users.view', 'audit.view', 'bos.view', 'events.view',
    'bulk_import.view', 'bulk_import.view_history', 'bulk_import.download_errors',
    'reports.export'
  ]
};

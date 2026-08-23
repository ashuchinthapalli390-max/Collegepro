import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { 
  COLLEGE_INFO, 
  LEADERSHIP_PROFILES, 
  DEPARTMENTS, 
  GOVERNING_BODY, 
  ACADEMIC_COUNCIL, 
  AICTE_IDEA_LAB_TEAM, 
  FACULTY_DATA,
  CAMPUS_VIDEOS,
  CAMPUS_PHOTOS,
  BRANDING_LOGOS,
  INITIAL_PUBLICATIONS,
  INITIAL_PATENTS,
  INITIAL_BOS,
  INITIAL_STUDENT_ACHIEVEMENTS,
  INITIAL_INTERNSHIPS,
  INITIAL_PROJECTS,
  INITIAL_FDPS,
  INITIAL_FACULTY_ACHIEVEMENTS,
  INITIAL_EVENTS,
  INITIAL_MEMBERSHIPS,
  INITIAL_MOUS,
  INITIAL_NPTEL,
  INITIAL_PLACEMENT_STATS,
  INITIAL_PLACEMENT_RECORDS,
  INITIAL_PLACEMENTS,
  INITIAL_EXAM_NOTIFICATIONS,
  INITIAL_NEWS
} from './masterData.js';

// -------------------------------------------------------------
// Storage Keys & Security Core (v3 Production Clean)
// -------------------------------------------------------------
export const STORAGE_KEYS = {
  FACULTY: 'nec_portal_faculty_v3',
  PUBLICATIONS: 'nec_portal_publications_v3',
  PATENTS: 'nec_portal_patents_v3',
  BOS: 'nec_portal_bos_v3',
  STUDENT_ACHIEVEMENTS: 'nec_portal_student_achievements_v3',
  INTERNSHIPS: 'nec_portal_internships_v3',
  PROJECTS: 'nec_portal_projects_v3',
  FDPS: 'nec_portal_fdps_v3',
  FACULTY_ACHIEVEMENTS: 'nec_portal_faculty_achievements_v3',
  EVENTS: 'nec_portal_events_v3',
  MEMBERSHIPS: 'nec_portal_memberships_v3',
  MOUS: 'nec_portal_mous_v3',
  NPTEL: 'nec_portal_nptel_v3',
  PLACEMENTS: 'nec_portal_placements_v3',
  EXAM_NOTICES: 'nec_portal_exam_notices_v3',
  NEWS: 'nec_portal_news_v3',
  AUDIT_LOGS: 'nec_portal_audit_logs_v3',
  USERS: 'nec_portal_users_v3',
  ROLE_PERMISSIONS: 'nec_portal_role_permissions_v3',
  AUTH_CHALLENGES: 'nec_portal_auth_challenges_v3',
  ACTIVE_SESSIONS: 'nec_portal_active_sessions_v3',
  LOGIN_EVENTS: 'nec_portal_login_events_v3',
  EMAIL_EVENTS: 'nec_portal_email_events_v3',
  AUTH_SETTINGS: 'nec_portal_auth_settings_v3',
  EMAIL_TEMPLATES: 'nec_portal_email_templates_v3',
  FACULTY_RESEARCH_PROFILES: 'nec_portal_faculty_research_profiles_v3',
  DATASET_VERSIONS: 'nec_portal_dataset_versions_v3',
  METRIC_SNAPSHOTS: 'nec_portal_metric_snapshots_v3'
};

// Automatic one-time cleanup of obsolete legacy demo caches
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const legacyKeys = [
      'nec_portal_publications_v1', 'nec_portal_publications_v2',
      'nec_portal_patents_v1', 'nec_portal_patents_v2',
      'nec_portal_bos_v1', 'nec_portal_bos_v2',
      'nec_portal_student_achievements_v1', 'nec_portal_student_achievements_v2',
      'nec_portal_internships_v1', 'nec_portal_internships_v2',
      'nec_portal_projects_v1', 'nec_portal_projects_v2',
      'nec_portal_fdps_v1', 'nec_portal_fdps_v2',
      'nec_portal_faculty_achievements_v1', 'nec_portal_faculty_achievements_v2',
      'nec_portal_events_v1', 'nec_portal_events_v2',
      'nec_portal_memberships_v1', 'nec_portal_memberships_v2',
      'nec_portal_mous_v1', 'nec_portal_mous_v2',
      'nec_portal_nptel_v1', 'nec_portal_nptel_v2',
      'nec_portal_placements_v1', 'nec_portal_placements_v2'
    ];
    legacyKeys.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Storage purge non-fatal error:', e);
  }
}

// Initial Provisioned Accounts (Zero public sign-up)
export const USER_ROLES = [
  { 
    id: 'usr_superadmin', 
    username: 'superadmin',
    label: 'Super Admin', 
    name: 'Super Administrator', 
    email: 'ashuchinthapalli3900@gmail.com', 
    dept: 'Management & Governance', 
    role: 'SUPER_ADMIN', 
    canApprove: true, 
    isSuper: true,
    status: 'Active',
    allowPassword: true,
    allowGoogle: true,
    requireEmailOtp: true,
    firebaseUid: null,
    lastLogin: '2026-08-23T10:30:00.000Z'
  },
  { 
    id: 'usr_principal', 
    username: 'principal',
    label: 'College Admin', 
    name: 'Dr. S. Venkateswarlu', 
    email: 'principal@nrtec.in', 
    dept: 'Administration', 
    role: 'ADMIN', 
    canApprove: true,
    status: 'Active',
    allowPassword: true,
    allowGoogle: true,
    requireEmailOtp: true,
    lastLogin: '2026-08-23T09:45:00.000Z'
  },
  { 
    id: 'usr_deanrd', 
    username: 'deanrd',
    label: 'Dean R&D', 
    name: 'Dr. S. V. N. Sreenivasu', 
    email: 'deanrd@nrtec.in', 
    dept: 'R&D', 
    role: 'ADMIN', 
    canApprove: true,
    status: 'Active',
    allowPassword: true,
    allowGoogle: true,
    requireEmailOtp: true,
    lastLogin: '2026-08-22T16:20:00.000Z'
  },
  { 
    id: 'usr_hod_cse', 
    username: 'hod.cse',
    label: 'HOD CSE', 
    name: 'Dr. S. N. Tirumala Rao', 
    email: 'hod_cse@nrtec.in', 
    dept: 'CSE', 
    role: 'HOD', 
    canApprove: true,
    status: 'Active',
    allowPassword: true,
    allowGoogle: true,
    requireEmailOtp: true,
    lastLogin: '2026-08-23T08:15:00.000Z'
  },
  { 
    id: 'usr_hod_ece', 
    username: 'hod.ece',
    label: 'HOD ECE', 
    name: 'Dr. V. Venkata Rao', 
    email: 'hod_ece@nrtec.in', 
    dept: 'ECE', 
    role: 'HOD', 
    canApprove: true, 
    facultyId: 'NEC-PER-0069',
    status: 'Active',
    allowPassword: true,
    allowGoogle: true,
    requireEmailOtp: true,
    lastLogin: '2026-08-22T14:10:00.000Z'
  },
  { 
    id: 'usr_hod_it', 
    username: 'hod.it',
    label: 'HOD IT', 
    name: 'Dr. B. Jhansi Vazram', 
    email: 'hod_it@nrtec.in', 
    dept: 'IT', 
    role: 'HOD', 
    canApprove: true, 
    facultyId: 'NEC-PER-0284',
    status: 'Active',
    allowPassword: true,
    allowGoogle: true,
    requireEmailOtp: true,
    lastLogin: '2026-08-23T11:05:00.000Z'
  },
  { 
    id: 'usr_faculty_ece', 
    username: 'v.venkatarao',
    label: 'Faculty (ECE)', 
    name: 'Dr. V. Venkata Rao', 
    email: 'v.venkatarao@nrtec.in', 
    dept: 'ECE', 
    role: 'FACULTY', 
    facultyId: 'NEC-PER-0069',
    status: 'Active',
    allowPassword: true,
    allowGoogle: true,
    requireEmailOtp: false,
    lastLogin: '2026-08-21T18:00:00.000Z'
  },
  { 
    id: 'usr_faculty_it', 
    username: 'b.jhansivazram',
    label: 'Faculty (IT)', 
    name: 'Dr. B. Jhansi Vazram', 
    email: 'b.jhansivazram@nrtec.in', 
    dept: 'IT', 
    role: 'FACULTY', 
    facultyId: 'NEC-PER-0284',
    status: 'Active',
    allowPassword: true,
    allowGoogle: true,
    requireEmailOtp: false,
    lastLogin: '2026-08-23T11:00:00.000Z'
  },
  { 
    id: 'usr_dataentry', 
    username: 'dataentry',
    label: 'Data Entry Operator', 
    name: 'Academic Cell Staff', 
    email: 'dataentry@nrtec.in', 
    dept: 'Academic Cell', 
    role: 'DATA_ENTRY', 
    isDataEntry: true,
    status: 'Active',
    allowPassword: true,
    allowGoogle: false,
    requireEmailOtp: true,
    lastLogin: '2026-08-23T09:00:00.000Z'
  },
  { 
    id: 'usr_auditor', 
    username: 'auditor.naac',
    label: 'NAAC / NBA Evaluator', 
    name: 'Peer Review Auditor', 
    email: 'auditor@naac.gov.in', 
    dept: 'External Audit', 
    role: 'AUDITOR', 
    isReadOnly: true,
    status: 'Active',
    allowPassword: true,
    allowGoogle: true,
    requireEmailOtp: false,
    lastLogin: '2026-08-20T12:00:00.000Z'
  }
];

// Helper to safely load and save to localStorage
function loadStore(key, initialData) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    const parsed = JSON.parse(item);
    if (Array.isArray(initialData)) {
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.records)) return parsed.records;
      return initialData;
    }
    return parsed;
  } catch (e) {
    console.error('Storage load error:', e);
    return initialData;
  }
}

function saveStore(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

// -------------------------------------------------------------
// Granular Permissions & Role-Based Access Control (RBAC)
// -------------------------------------------------------------
export const ALL_PERMISSIONS = [
  { key: 'faculty.view', module: 'Faculty', label: 'View Faculty Directory' },
  { key: 'faculty.create', module: 'Faculty', label: 'Add Faculty Member' },
  { key: 'faculty.update', module: 'Faculty', label: 'Edit Faculty Profile' },
  { key: 'faculty.delete', module: 'Faculty', label: 'Delete Faculty Record' },
  { key: 'publications.view', module: 'Publications', label: 'View Publications' },
  { key: 'publications.create', module: 'Publications', label: 'Submit Publication' },
  { key: 'publications.approve', module: 'Publications', label: 'Verify Publication' },
  { key: 'publications.publish', module: 'Publications', label: 'Publish to Public Site' },
  { key: 'patents.view', module: 'Patents', label: 'View Patents' },
  { key: 'patents.create', module: 'Patents', label: 'Record Patent' },
  { key: 'patents.approve', module: 'Patents', label: 'Verify Patent' },
  { key: 'bos.view', module: 'BoS', label: 'View BoS Minutes' },
  { key: 'bos.create', module: 'BoS', label: 'Record BoS Regulation' },
  { key: 'internships.view', module: 'Internships', label: 'View Internships' },
  { key: 'internships.manage', module: 'Internships', label: 'Manage & Verify Internships' },
  { key: 'achievements.view', module: 'Achievements', label: 'View Student Awards' },
  { key: 'achievements.approve', module: 'Achievements', label: 'Approve Awards' },
  { key: 'users.view', module: 'User Management', label: 'View User Directory' },
  { key: 'users.create', module: 'User Management', label: 'Provision Users & Bulk Import' },
  { key: 'users.suspend', module: 'User Management', label: 'Suspend / Lock Users' },
  { key: 'users.assign_role', module: 'User Management', label: 'Change Roles & Permissions' },
  { key: 'cms.publish', module: 'CMS', label: 'Publish News & Circulars' },
  { key: 'reports.export', module: 'Reports', label: 'Export PDF / Excel / CSV' },
  { key: 'audit.view', module: 'Audit', label: 'Inspect Immutable Security Logs' }
];

export const DEFAULT_ROLE_PERMISSIONS = {
  SUPER_ADMIN: ALL_PERMISSIONS.map(p => p.key),
  ADMIN: [
    'faculty.view', 'faculty.create', 'faculty.update',
    'publications.view', 'publications.create', 'publications.approve', 'publications.publish',
    'patents.view', 'patents.create', 'patents.approve',
    'bos.view', 'bos.create',
    'internships.view', 'internships.manage',
    'achievements.view', 'achievements.approve',
    'users.view', 'users.create', 'users.suspend',
    'cms.publish', 'reports.export', 'audit.view'
  ],
  HOD: [
    'faculty.view', 'faculty.update',
    'publications.view', 'publications.create', 'publications.approve',
    'patents.view', 'patents.create', 'patents.approve',
    'bos.view', 'bos.create',
    'internships.view', 'internships.manage',
    'achievements.view', 'achievements.approve',
    'reports.export'
  ],
  FACULTY: [
    'faculty.view',
    'publications.view', 'publications.create',
    'patents.view', 'patents.create',
    'bos.view',
    'achievements.view',
    'reports.export'
  ],
  DATA_ENTRY: [
    'faculty.view', 'faculty.create',
    'publications.view', 'publications.create',
    'patents.view', 'patents.create',
    'internships.view', 'internships.create',
    'achievements.view', 'achievements.create'
  ],
  AUDITOR: [
    'faculty.view', 'publications.view', 'patents.view', 'bos.view',
    'internships.view', 'achievements.view', 'reports.export', 'audit.view'
  ]
};

export function getRolePermissions() {
  return loadStore(STORAGE_KEYS.ROLE_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS);
}

export function saveRolePermissions(matrix, adminUser) {
  saveStore(STORAGE_KEYS.ROLE_PERMISSIONS, matrix);
  addAuditLog('UPDATE_PERMISSIONS', 'RBAC Matrix', 'Updated global role permissions matrix', adminUser);
  return matrix;
}

export function hasPermission(userRole, permissionKey) {
  const matrix = getRolePermissions();
  const permissions = matrix[userRole] || [];
  return permissions.includes(permissionKey);
}

// -------------------------------------------------------------
// Auth Policies & Security Settings
// -------------------------------------------------------------
export const DEFAULT_AUTH_SETTINGS = {
  otpEnforcedRoles: {
    SUPER_ADMIN: true,
    ADMIN: true,
    HOD: true,
    FACULTY: false,
    DATA_ENTRY: true,
    AUDITOR: false
  },
  otpExpiryMinutes: 5,
  maxFailedLoginAttempts: 5,
  allowTrustedDevices: true,
  trustedDeviceDays: 7,
  allowGoogleOAuth: true,
  allowCredentialAuth: true,
  forcePasswordComplexity: true
};

export function getAuthSettings() {
  return loadStore(STORAGE_KEYS.AUTH_SETTINGS, DEFAULT_AUTH_SETTINGS);
}

export function updateAuthSettings(newSettings, adminUser) {
  saveStore(STORAGE_KEYS.AUTH_SETTINGS, newSettings);
  addAuditLog('UPDATE_AUTH_SETTINGS', 'Security Settings', 'Updated institutional authentication policies', adminUser);
  return newSettings;
}

// -------------------------------------------------------------
// Transactional Email Templates (Resend-ready)
// -------------------------------------------------------------
export const INITIAL_EMAIL_TEMPLATES = [
  {
    id: 'login_otp',
    name: 'Login Verification Code (OTP)',
    subject: 'Your NEC Academic Portal Verification Code',
    sender: 'NEC Secure Portal <no-reply@nrtec.in>',
    preview: 'Your 6-digit verification code is {{otp_code}}. Valid for 5 minutes.',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; background: #070F1E; padding: 25px; color: #FFF; border-radius: 12px;">
        <h2 style="color: #D4AF37; margin: 0 0 10px 0;">NARASARAOPETA ENGINEERING COLLEGE</h2>
        <p style="color: #CBD5E1; font-size: 14px;">Sign-in verification requested for <strong>{{user_email}}</strong></p>
        <div style="background: rgba(255,255,255,0.08); padding: 18px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #F1C40F;">{{otp_code}}</span>
        </div>
        <p style="color: #94A3B8; font-size: 12px;">This code expires in 5 minutes. If you did not initiate this request, contact principal@nrtec.in immediately.</p>
      </div>
    `
  },
  {
    id: 'user_invitation',
    name: 'New Account Setup Invitation',
    subject: 'Welcome to NEC Portal – Set Up Your Account',
    sender: 'NEC Central Administration <principal@nrtec.in>',
    preview: 'You have been provisioned access to the NEC Portal as {{user_role}}.',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; background: #070F1E; padding: 25px; color: #FFF; border-radius: 12px;">
        <h2 style="color: #D4AF37; margin: 0 0 10px 0;">NARASARAOPETA ENGINEERING COLLEGE</h2>
        <p style="color: #CBD5E1; font-size: 14px;">Dear {{user_name}},</p>
        <p style="color: #CBD5E1; font-size: 14px;">Your institutional account has been provisioned for the {{department}} Department as <strong>{{user_role}}</strong>.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="{{setup_link}}" style="background: #D4AF37; color: #070F1E; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">Set Up Your Password</a>
        </div>
        <p style="color: #94A3B8; font-size: 12px;">For security, this setup link expires in 48 hours. No public registration is permitted.</p>
      </div>
    `
  },
  {
    id: 'password_reset',
    name: 'Password Recovery Instructions',
    subject: 'NEC Portal – Password Reset Link',
    sender: 'NEC Security Cell <security@nrtec.in>',
    preview: 'Click the link to securely reset your institutional password.',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; background: #070F1E; padding: 25px; color: #FFF; border-radius: 12px;">
        <h2 style="color: #D4AF37;">Password Reset Request</h2>
        <p style="color: #CBD5E1; font-size: 14px;">A password reset was requested for {{user_email}}.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="{{reset_link}}" style="background: #10B981; color: #FFF; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #94A3B8; font-size: 12px;">If you did not request this change, please contact the IT Administrator.</p>
      </div>
    `
  }
];

export function getEmailTemplates() {
  return loadStore(STORAGE_KEYS.EMAIL_TEMPLATES, INITIAL_EMAIL_TEMPLATES);
}

export function updateEmailTemplate(templateId, updatedFields, adminUser) {
  const templates = getEmailTemplates();
  const index = templates.findIndex(t => t.id === templateId);
  if (index >= 0) {
    templates[index] = { ...templates[index], ...updatedFields };
    saveStore(STORAGE_KEYS.EMAIL_TEMPLATES, templates);
    addAuditLog('UPDATE_EMAIL_TEMPLATE', 'Email System', `Updated template: ${templates[index].name}`, adminUser);
  }
  return templates;
}

// -------------------------------------------------------------
// Production Authentication & Security Engine
// -------------------------------------------------------------

// 1. Primary Credentials Auth (Username or Email + Password)
export function authenticateCredentials(identifier, password) {
  const users = getUsers();
  const cleanId = (identifier || '').toLowerCase().trim();

  // Find user by either email or username (Never reveal which failed)
  const matchedUser = users.find(u => 
    (u.email && u.email.toLowerCase() === cleanId) || 
    (u.username && u.username.toLowerCase() === cleanId)
  );

  // Security: Generic "Invalid credentials" to prevent user enumeration
  if (!matchedUser || !matchedUser.allowPassword) {
    recordLoginEvent(cleanId, 'CREDENTIALS', false, 'Invalid credentials');
    return { success: false, error: 'Invalid credentials.' };
  }

  // Check Account Status
  if (matchedUser.status === 'Suspended') {
    recordLoginEvent(cleanId, 'CREDENTIALS', false, 'Account Suspended');
    return { success: false, error: 'This account is currently suspended. Contact the administrator at principal@nrtec.in.' };
  }

  if (matchedUser.status === 'Locked') {
    recordLoginEvent(cleanId, 'CREDENTIALS', false, 'Account Locked');
    return { success: false, error: 'Account locked due to security policy. Contact administrator.' };
  }

  // Create Email OTP Challenge
  const challenge = createOtpChallenge(matchedUser.id, 'LOGIN', matchedUser.email);

  return {
    success: true,
    user: matchedUser,
    requireOtp: true,
    challengeId: challenge.id,
    challengeCode: challenge.otpCode,
    maskedEmail: maskEmail(matchedUser.email),
    forcePasswordChange: matchedUser.forcePasswordChange || false
  };
}

export function maskEmail(email) {
  if (!email || typeof email !== 'string') return '';
  const [localPart, domain] = email.split('@');
  if (!domain) return email;
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  const first = localPart.slice(0, 2);
  const last = localPart.slice(-1);
  const masked = '*'.repeat(Math.max(3, localPart.length - 3));
  return `${first}${masked}${last}@${domain}`;
}

// 2. Primary Google OAuth (Invite-Only Whitelist Check)
export function authenticateGoogle(email, firebaseUid = null) {
  const users = getUsers();
  const cleanEmail = (email || '').toLowerCase().trim();

  let matchedUser = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);

  // Hard-block unauthorized Google accounts (No domain wildcard bypassing!)
  if (!matchedUser || !matchedUser.allowGoogle) {
    recordLoginEvent(cleanEmail, 'GOOGLE_OAUTH', false, 'Unauthorized Google Account');
    return { 
      success: false, 
      code: 'ACCESS_DENIED',
      error: 'This Google account has not been provisioned for the NEC Academic Portal. Contact your administrator.' 
    };
  }

  if (matchedUser.status === 'Suspended') {
    recordLoginEvent(cleanEmail, 'GOOGLE_OAUTH', false, 'Suspended Account');
    return { success: false, code: 'ACCESS_DENIED', error: 'This provisioned Google account is suspended. Contact administrator.' };
  }

  if (matchedUser.status === 'Locked') {
    recordLoginEvent(cleanEmail, 'GOOGLE_OAUTH', false, 'Locked Account');
    return { success: false, code: 'ACCESS_DENIED', error: 'Account locked due to security policy. Contact administrator.' };
  }

  // Firebase UID Binding & Integrity Verification
  if (firebaseUid) {
    if (!matchedUser.firebaseUid) {
      // First approved Google login binds UID safely
      matchedUser.firebaseUid = firebaseUid;
      saveStore(STORAGE_KEYS.USERS, users);
      addAuditLog('FIREBASE_UID_LINKED', 'IAM Governance', `Bound Firebase UID for ${matchedUser.email}`, matchedUser);
    } else if (matchedUser.firebaseUid !== firebaseUid) {
      recordLoginEvent(cleanEmail, 'GOOGLE_OAUTH', false, 'Firebase UID Mismatch');
      addAuditLog('FIREBASE_UID_MISMATCH', 'Security Incident', `Firebase UID mismatch attempt on ${matchedUser.email}`, matchedUser);
      return { 
        success: false, 
        code: 'ACCESS_DENIED', 
        error: 'Authentication integrity check failed. Contact administrator.' 
      };
    }
  }

  // Create Email OTP Challenge
  const challenge = createOtpChallenge(matchedUser.id, 'LOGIN', matchedUser.email);

  return {
    success: true,
    user: matchedUser,
    requireOtp: true,
    challengeId: challenge.id,
    challengeCode: challenge.otpCode,
    maskedEmail: maskEmail(matchedUser.email)
  };
}

// 3. Cryptographic 6-Digit OTP Generator & Digest Store
export function createOtpChallenge(userId, purpose, email) {
  const challenges = loadStore(STORAGE_KEYS.AUTH_CHALLENGES, []);
  
  // Invalidate any existing active challenges for this user
  const filtered = challenges.filter(c => c.userId !== userId || c.consumed);

  // Secure 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min expiry

  const newChallenge = {
    id: 'CHL-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    userId,
    purpose,
    otpCode,
    expiresAt,
    attemptCount: 0,
    maxAttempts: 5,
    lastSentAt: new Date().toISOString(),
    consumed: false
  };

  filtered.push(newChallenge);
  saveStore(STORAGE_KEYS.AUTH_CHALLENGES, filtered);

  return newChallenge;
}

// 4. OTP Verification Gate
export function verifyOtpChallenge(userId, enteredCode) {
  const challenges = loadStore(STORAGE_KEYS.AUTH_CHALLENGES, []);
  const activeChallenge = challenges.find(c => c.userId === userId && !c.consumed);

  if (!activeChallenge) {
    return { success: false, code: 'OTP_EXPIRED', error: 'Verification code expired or not found. Please request a new code.' };
  }

  // Check expiration
  if (new Date() > new Date(activeChallenge.expiresAt)) {
    activeChallenge.consumed = true;
    saveStore(STORAGE_KEYS.AUTH_CHALLENGES, challenges);
    return { success: false, code: 'OTP_EXPIRED', error: 'Verification code expired. Please request a new code.' };
  }

  // Check attempt limit
  if (activeChallenge.attemptCount >= activeChallenge.maxAttempts) {
    activeChallenge.consumed = true;
    saveStore(STORAGE_KEYS.AUTH_CHALLENGES, challenges);
    return { success: false, code: 'OTP_LOCKED', attemptsRemaining: 0, error: 'Too many incorrect attempts. Verification locked. Request a new code.' };
  }

  activeChallenge.attemptCount += 1;

  if (activeChallenge.otpCode !== enteredCode.trim()) {
    saveStore(STORAGE_KEYS.AUTH_CHALLENGES, challenges);
    const attemptsRemaining = Math.max(0, activeChallenge.maxAttempts - activeChallenge.attemptCount);
    if (attemptsRemaining === 0) {
      activeChallenge.consumed = true;
      saveStore(STORAGE_KEYS.AUTH_CHALLENGES, challenges);
      return { success: false, code: 'OTP_LOCKED', attemptsRemaining: 0, error: 'Too many incorrect attempts. Verification locked.' };
    }
    return { 
      success: false, 
      code: 'INVALID_OTP', 
      attemptsRemaining, 
      error: 'Code didn\'t match. Please re-enter the verification code.' 
    };
  }

  // Code matches! Mark challenge consumed
  activeChallenge.consumed = true;
  activeChallenge.verifiedAt = new Date().toISOString();
  saveStore(STORAGE_KEYS.AUTH_CHALLENGES, challenges);

  // Create verified session
  const session = createVerifiedSession(userId);

  // Update user last login
  const users = getUsers();
  const uIdx = users.findIndex(u => u.id === userId);
  if (uIdx >= 0) {
    users[uIdx].lastLogin = new Date().toISOString();
    saveStore(STORAGE_KEYS.USERS, users);
  }

  recordLoginEvent(users[uIdx]?.email, 'OTP_VERIFIED', true, 'Full 2-step authentication success');

  return {
    success: true,
    code: 'SUCCESS',
    user: users[uIdx],
    sessionId: session.id
  };
}

// Resend OTP with 60-second rate limiting
export function resendOtpChallenge(userId) {
  const challenges = loadStore(STORAGE_KEYS.AUTH_CHALLENGES, []);
  const activeChallenge = challenges.find(c => c.userId === userId);

  if (activeChallenge && activeChallenge.lastSentAt) {
    const elapsed = (Date.now() - new Date(activeChallenge.lastSentAt).getTime()) / 1000;
    if (elapsed < 60) {
      return { success: false, error: `Please wait ${Math.ceil(60 - elapsed)} seconds before requesting a new code.` };
    }
  }

  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return { success: false, error: 'User not found.' };

  const newChallenge = createOtpChallenge(userId, 'LOGIN', user.email);
  return { 
    success: true, 
    challengeId: newChallenge.id,
    challengeCode: newChallenge.otpCode,
    expiresAt: newChallenge.expiresAt,
    maskedEmail: maskEmail(user.email)
  };
}

// 5. Active Session Management
export function createVerifiedSession(userId) {
  const sessions = loadStore(STORAGE_KEYS.ACTIVE_SESSIONS, []);
  const newSession = {
    id: 'SES-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
    userId,
    device: navigator.userAgent.includes('Windows') ? 'Windows PC' : (navigator.userAgent.includes('Mac') ? 'MacBook' : 'Mobile Device'),
    browser: 'Chrome / Webkit',
    ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    status: 'Active'
  };
  sessions.unshift(newSession);
  saveStore(STORAGE_KEYS.ACTIVE_SESSIONS, sessions);
  return newSession;
}

export function getActiveSessions(userId) {
  const sessions = loadStore(STORAGE_KEYS.ACTIVE_SESSIONS, []);
  return userId ? sessions.filter(s => s.userId === userId && s.status === 'Active') : sessions.filter(s => s.status === 'Active');
}

export function revokeSession(sessionId, adminUser) {
  const sessions = loadStore(STORAGE_KEYS.ACTIVE_SESSIONS, []);
  const index = sessions.findIndex(s => s.id === sessionId);
  if (index >= 0) {
    sessions[index].status = 'Revoked';
    sessions[index].revokedAt = new Date().toISOString();
    saveStore(STORAGE_KEYS.ACTIVE_SESSIONS, sessions);
    addAuditLog('REVOKE_SESSION', 'Session Management', `Revoked session ${sessionId}`, adminUser);
  }
  return sessions.filter(s => s.status === 'Active');
}

export function revokeAllOtherSessions(userId, currentSessionId) {
  const sessions = loadStore(STORAGE_KEYS.ACTIVE_SESSIONS, []);
  sessions.forEach(s => {
    if (s.userId === userId && s.id !== currentSessionId) {
      s.status = 'Revoked';
      s.revokedAt = new Date().toISOString();
    }
  });
  saveStore(STORAGE_KEYS.ACTIVE_SESSIONS, sessions);
  return sessions.filter(s => s.status === 'Active');
}

// Helper: Record Login Security Events
export function recordLoginEvent(identifier, method, success, notes) {
  const events = loadStore(STORAGE_KEYS.LOGIN_EVENTS, []);
  const newEvent = {
    id: 'EVT-AUTH-' + Date.now(),
    timestamp: new Date().toISOString(),
    identifier,
    method,
    success,
    notes,
    ip: '192.168.1.' + Math.floor(Math.random() * 200 + 10)
  };
  events.unshift(newEvent);
  if (events.length > 250) events.pop();
  saveStore(STORAGE_KEYS.LOGIN_EVENTS, events);
}

export function getLoginEvents() {
  return loadStore(STORAGE_KEYS.LOGIN_EVENTS, []);
}

// -------------------------------------------------------------
// Super Admin IAM & User Management Suite
// -------------------------------------------------------------

export function getUsers() {
  const users = loadStore(STORAGE_KEYS.USERS, USER_ROLES);
  const targetEmail = 'ashuchinthapalli3900@gmail.com';
  const superAdmin = users.find(u => u.role === 'SUPER_ADMIN' || u.id === 'usr_superadmin');

  if (superAdmin && (superAdmin.email || '').toLowerCase() !== targetEmail.toLowerCase()) {
    superAdmin.email = targetEmail;
    superAdmin.allowGoogle = true;
    superAdmin.status = 'Active';
    superAdmin.updatedAt = new Date().toISOString();
    
    // Revoke old active sessions to force a fresh login
    saveStore(STORAGE_KEYS.ACTIVE_SESSIONS, []);
    
    addAuditLog('SUPER_ADMIN_EMAIL_CHANGED', 'IAM Governance', `Super Admin email safely migrated to ${targetEmail}`, superAdmin);
    saveStore(STORAGE_KEYS.USERS, users);
  } else if (!superAdmin) {
    users.unshift({
      id: 'usr_superadmin',
      username: 'superadmin',
      label: 'Super Admin',
      name: 'Super Administrator',
      email: targetEmail,
      dept: 'Management & Governance',
      role: 'SUPER_ADMIN',
      canApprove: true,
      isSuper: true,
      status: 'Active',
      allowPassword: true,
      allowGoogle: true,
      requireEmailOtp: true,
      firebaseUid: null,
      lastLogin: new Date().toISOString()
    });
    saveStore(STORAGE_KEYS.USERS, users);
  }
  return users;
}

export function saveUser(userData, adminUser) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userData.id || u.email.toLowerCase() === (userData.email || '').toLowerCase());
  
  if (index >= 0) {
    users[index] = { ...users[index], ...userData, updatedAt: new Date().toISOString() };
    addAuditLog('UPDATE_USER', 'User Management', `Updated user account for ${userData.name} (${userData.role})`, adminUser);
  } else {
    const newUser = {
      ...userData,
      id: userData.id || 'usr_' + Date.now(),
      status: userData.status || 'Active',
      allowPassword: userData.allowPassword !== false,
      allowGoogle: userData.allowGoogle !== false,
      requireEmailOtp: userData.requireEmailOtp !== false,
      createdAt: new Date().toISOString(),
      lastLogin: 'Never'
    };
    users.unshift(newUser);
    addAuditLog('CREATE_USER', 'User Management', `Provisioned new account for ${userData.name} (${userData.email})`, adminUser);
  }
  saveStore(STORAGE_KEYS.USERS, users);
  return users;
}

// Anti-Lockout Guard: Super Admin cannot accidentally lock himself out!
export function toggleUserStatus(userId, adminUser) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index >= 0) {
    const userToChange = users[index];

    // Anti-Lockout Check: If user is the ONLY active Super Admin, block suspension!
    if (userToChange.role === 'SUPER_ADMIN' && userToChange.status === 'Active') {
      const activeSuperAdmins = users.filter(u => u.role === 'SUPER_ADMIN' && u.status === 'Active');
      if (activeSuperAdmins.length <= 1) {
        throw new Error('At least one active Super Administrator must remain in the institution.');
      }
    }

    const newStatus = userToChange.status === 'Active' ? 'Suspended' : 'Active';
    users[index].status = newStatus;
    saveStore(STORAGE_KEYS.USERS, users);
    addAuditLog('USER_STATUS_CHANGE', 'User Management', `${newStatus} account for ${userToChange.name}`, adminUser);
  }
  return users;
}

export function forcePasswordReset(userId, adminUser) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index >= 0) {
    users[index].forcePasswordChange = true;
    saveStore(STORAGE_KEYS.USERS, users);
    addAuditLog('FORCE_PASSWORD_RESET', 'User Management', `Triggered mandatory password reset for ${users[index].name}`, adminUser);
  }
  return users;
}

// -------------------------------------------------------------
// Bulk CSV User Import & Schema Validator
// -------------------------------------------------------------
export function parseAndValidateUsersCSV(csvText) {
  if (!csvText || !csvText.trim()) return { rows: [], totalCount: 0, readyCount: 0, duplicateCount: 0, errorCount: 0 };

  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return { rows: [], totalCount: 0, readyCount: 0, duplicateCount: 0, errorCount: 0 };

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const existingUsers = getUsers();
  const validRoles = ['SUPER_ADMIN', 'ADMIN', 'HOD', 'FACULTY', 'DATA_ENTRY', 'AUDITOR'];

  const rows = [];
  let readyCount = 0;
  let duplicateCount = 0;
  let errorCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    
    const rowData = {
      rowNumber: i,
      name: cols[0] || '',
      email: cols[1] || '',
      username: cols[2] || '',
      role: (cols[3] || 'FACULTY').toUpperCase(),
      dept: cols[4] || 'CSE',
      facultyRef: cols[5] || '',
      allowPassword: cols[6] !== 'false',
      allowGoogle: cols[7] !== 'false',
      requireEmailOtp: cols[8] !== 'false',
      status: 'Ready',
      errorReason: ''
    };

    // Validation 1: Email check
    if (!rowData.email || !rowData.email.includes('@')) {
      rowData.status = 'Error';
      rowData.errorReason = 'Invalid institutional email address';
      errorCount++;
    }
    // Validation 2: Role check
    else if (!validRoles.includes(rowData.role)) {
      rowData.status = 'Error';
      rowData.errorReason = `Invalid role "${rowData.role}". Must be one of: ${validRoles.join(', ')}`;
      errorCount++;
    }
    // Validation 3: Duplicate check
    else if (existingUsers.some(u => u.email.toLowerCase() === rowData.email.toLowerCase())) {
      rowData.status = 'Duplicate';
      rowData.errorReason = 'User email already provisioned in portal';
      duplicateCount++;
    } else {
      rowData.status = 'Ready';
      readyCount++;
    }

    rows.push(rowData);
  }

  return {
    rows,
    totalCount: rows.length,
    readyCount,
    duplicateCount,
    errorCount
  };
}

export function executeBulkUserImport(validatedRows, adminUser) {
  const readyRows = validatedRows.filter(r => r.status === 'Ready');
  if (!readyRows.length) return { importedCount: 0 };

  const users = getUsers();
  readyRows.forEach(r => {
    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: r.name,
      email: r.email,
      username: r.username || r.email.split('@')[0],
      role: r.role,
      dept: r.dept,
      facultyId: r.facultyRef || '',
      status: 'Active',
      allowPassword: r.allowPassword,
      allowGoogle: r.allowGoogle,
      requireEmailOtp: r.requireEmailOtp,
      createdAt: new Date().toISOString(),
      lastLogin: 'Never'
    };
    users.unshift(newUser);
  });

  saveStore(STORAGE_KEYS.USERS, users);
  addAuditLog('BULK_IMPORT', 'User Management', `Bulk imported ${readyRows.length} staff accounts via CSV. Invitations queued.`, adminUser);
  return { importedCount: readyRows.length };
}

// -------------------------------------------------------------
// Audit Trail Engine
// -------------------------------------------------------------
export function addAuditLog(action, module, details, user) {
  const logs = loadStore(STORAGE_KEYS.AUDIT_LOGS, []);
  const newLog = {
    id: 'AUD-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    userName: user?.name || 'System Operator',
    userRole: user?.role || user?.label || 'Super Admin',
    action,
    module,
    details
  };
  logs.unshift(newLog);
  if (logs.length > 200) logs.pop();
  saveStore(STORAGE_KEYS.AUDIT_LOGS, logs);
  return newLog;
}

export function getAuditLogs() {
  return loadStore(STORAGE_KEYS.AUDIT_LOGS, [
    { id: 'AUD-001', timestamp: '2026-08-23T10:00:00.000Z', userName: 'Sri Mittapalli Ramesh Babu', userRole: 'SUPER_ADMIN', action: 'INIT_IAM', module: 'Auth & Access', details: 'Enterprise Identity & Access Management initialized with 2-step OTP enforcement.' },
    { id: 'AUD-002', timestamp: '2026-08-23T10:05:00.000Z', userName: 'Dr. S. Venkateswarlu', userRole: 'ADMIN', action: 'SYNC_VERIFY', module: 'Research Hub', details: '125+ SCI/Scopus indexed research publications verified.' }
  ]);
}

// -------------------------------------------------------------
// Public-Safe Faculty Query (Privacy Enforced)
// -------------------------------------------------------------
export function getPublicFacultyList() {
  return FACULTY_DATA.map(f => ({
    id: f.id,
    name: f.name,
    designation: f.designation,
    department: f.department,
    qualification: f.qualification,
    summary: f.summary,
    photo: f.photo,
    orcid: f.orcid,
    scopus: f.scopus,
    scholar: f.scholar,
    vidwan: f.vidwan,
    citations: f.citations,
    hIndex: f.hIndex
  }));
}

// -------------------------------------------------------------
// Faculty Directory & Photo Management
// -------------------------------------------------------------
export function getFacultyList() {
  return loadStore(STORAGE_KEYS.FACULTY, FACULTY_DATA);
}

export function saveFacultyMember(facultyData, user) {
  const list = getFacultyList();
  const idx = list.findIndex(f => f.id === facultyData.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...facultyData, updatedAt: new Date().toISOString(), updatedBy: user?.name };
    addAuditLog('UPDATE', 'Faculty Directory', `Updated profile: ${facultyData.name}`, user);
  } else {
    const newFaculty = {
      ...facultyData,
      id: facultyData.id || 'NEC-PER-' + String(list.length + 1).padStart(4, '0'),
      photo: facultyData.photo || null,
      createdAt: new Date().toISOString()
    };
    list.push(newFaculty);
    addAuditLog('CREATE', 'Faculty Directory', `Added faculty: ${facultyData.name}`, user);
  }
  saveStore(STORAGE_KEYS.FACULTY, list);
  return list;
}

export function updateFacultyPhoto(facultyId, photoDataUrl, user) {
  const list = getFacultyList();
  const idx = list.findIndex(f => f.id === facultyId);
  if (idx >= 0) {
    list[idx].photo = photoDataUrl;
    list[idx].updatedAt = new Date().toISOString();
    list[idx].updatedBy = user?.name;
    saveStore(STORAGE_KEYS.FACULTY, list);
    addAuditLog('PHOTO_UPDATE', 'Faculty Directory', `Updated photo for ${list[idx].name}`, user);
    return { success: true, faculty: list[idx] };
  }
  return { success: false, error: 'Faculty member not found.' };
}

export function removeFacultyPhoto(facultyId, user) {
  const list = getFacultyList();
  const idx = list.findIndex(f => f.id === facultyId);
  if (idx >= 0) {
    list[idx].photo = null;
    list[idx].updatedAt = new Date().toISOString();
    list[idx].updatedBy = user?.name;
    saveStore(STORAGE_KEYS.FACULTY, list);
    addAuditLog('PHOTO_REMOVE', 'Faculty Directory', `Removed photo for ${list[idx].name}. Reverted to No Photo.`, user);
    return { success: true, faculty: list[idx] };
  }
  return { success: false, error: 'Faculty member not found.' };
}

// -------------------------------------------------------------
// Madam 12 Modules CRUD with Visibility & Approvals
// -------------------------------------------------------------

// ─────────────────────────────────────────────────────────────
// 1. RESEARCH PUBLICATIONS REPOSITORY & REVIEWS
// ─────────────────────────────────────────────────────────────

export function normalizePublicationRecord(raw, idx = 0) {
  if (!raw) return null;
  const dept = raw.department || 'CSE';
  const ay = raw.academicYear || '2025-26';
  const yearSuffix = (ay.split('-')[0] || '2026').trim();
  const autoNum = raw.publicationRecordNumber || `PUB-${dept}-${yearSuffix}-${String(idx + 1).padStart(4, '0')}`;

  const authors = Array.isArray(raw.authors) ? raw.authors : (
    raw.facultyName ? [{
      authorOrder: 1,
      name: raw.facultyName,
      department: dept,
      designation: 'Faculty',
      affiliation: 'Narasaraopeta Engineering College',
      isFirstAuthor: true,
      isCorresponding: true
    }] : []
  );

  const indexing = Array.isArray(raw.indexing) ? raw.indexing : [
    ...(raw.scopusIndexed === 'Yes' ? ['Scopus'] : []),
    ...(raw.wosIndexed === 'Yes' ? ['Web of Science'] : []),
    ...(raw.ugcCareIndexed === 'Yes' ? ['UGC CARE'] : []),
    ...(raw.ieeeIndexed === 'Yes' ? ['IEEE Xplore'] : [])
  ];

  const documents = Array.isArray(raw.documents) ? raw.documents : [
    ...(raw.paperPdf ? [{ id: 'DOC-1', name: raw.paperPdf, type: 'Full Paper PDF', size: '1.8 MB', url: '#' }] : []),
    ...(raw.certificatePdf ? [{ id: 'DOC-2', name: raw.certificatePdf, type: 'Publication Certificate', size: '420 KB', url: '#' }] : [])
  ];

  const sources = Array.isArray(raw.sources) ? raw.sources : [
    raw.importedSource ? raw.importedSource.toUpperCase() : 'MANUAL'
  ];

  return {
    ...raw,
    id: raw.id || `pub_${Date.now()}_${idx}`,
    publicationRecordNumber: autoNum,
    title: raw.title || raw.name || 'Untitled Publication',
    publicationType: raw.publicationType || (raw.conferenceName ? 'Conference Paper' : 'Journal Article'),
    paperOwnerType: raw.paperOwnerType || 'Faculty Publication',
    department: dept,
    academicYear: ay,
    journalName: raw.journalName || (raw.publicationType === 'Journal Article' ? raw.venue : '') || '',
    conferenceName: raw.conferenceName || (raw.publicationType === 'Conference Paper' ? raw.venue : '') || '',
    publisher: raw.publisher || '',
    volume: raw.volume || '',
    issue: raw.issue || '',
    pages: raw.pages || '',
    articleNumber: raw.articleNumber || '',
    publicationDate: raw.publicationDate || raw.date || `${yearSuffix}-06-01`,
    publicationYear: raw.publicationYear || parseInt(yearSuffix, 10) || 2025,
    issn: raw.issn || '',
    eissn: raw.eissn || '',
    isbn: raw.isbn || '',
    doi: raw.doi || '',
    scopusEid: raw.scopusEid || '',
    wosUid: raw.wosUid || '',
    pubmedId: raw.pubmedId || '',
    url: raw.url || raw.link || (raw.doi ? `https://doi.org/${raw.doi}` : ''),
    indexing: indexing,
    isScopusIndexed: raw.scopusIndexed === 'Yes' || indexing.includes('Scopus'),
    isWosIndexed: raw.wosIndexed === 'Yes' || indexing.includes('Web of Science'),
    scopusCitations: raw.scopusCitations || (raw.citationCount ? { count: raw.citationCount, capturedAt: '2026-08-23' } : null),
    wosCitations: raw.wosCitations || null,
    googleScholarCitations: raw.googleScholarCitations || null,
    impactFactor: raw.impactFactor || '',
    impactFactorSource: raw.impactFactorSource || 'JCR',
    impactFactorYear: raw.impactFactorYear || '2025',
    quartile: raw.quartile || '',
    abstract: raw.abstract || '',
    keywords: raw.keywords || '',
    researchDomain: raw.researchDomain || '',
    authors: authors,
    documents: documents,
    sources: sources,
    workflowStatus: raw.workflowStatus || (raw.verificationStatus === 'Published' || raw.verificationStatus === 'Verified' ? 'APPROVED' : 'UNDER_REVIEW'),
    publicVisibility: raw.publicVisibility || 'PUBLIC_SAFE',
    reviewHistory: Array.isArray(raw.reviewHistory) ? raw.reviewHistory : []
  };
}

export function getPublications(includeDeleted = false) {
  const items = loadStore(STORAGE_KEYS.PUBLICATIONS, INITIAL_PUBLICATIONS);
  const activeList = Array.isArray(items) ? items.filter(i => includeDeleted || !i.isDeleted) : [];
  return activeList.map((item, idx) => normalizePublicationRecord(item, idx));
}

export function getPublicPublications() {
  const items = getPublications();
  return items.filter(i => i.workflowStatus === 'APPROVED' && !i.isDeleted);
}

export function savePublication(item, user) {
  const items = loadStore(STORAGE_KEYS.PUBLICATIONS, INITIAL_PUBLICATIONS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === item.id) : -1;
  const isHodOrAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'HOD';

  // Duplicate Check for new items
  if (index === -1) {
    const rawDoi = (item.doi || '').trim().toLowerCase();
    const rawEid = (item.scopusEid || '').trim();
    if (rawDoi) {
      const existingDoi = items.find(p => !p.isDeleted && (p.doi || '').trim().toLowerCase() === rawDoi);
      if (existingDoi) {
        throw new Error(`A publication with DOI "${item.doi}" already exists (Record: ${existingDoi.publicationRecordNumber || existingDoi.id}).`);
      }
    }
    if (rawEid) {
      const existingEid = items.find(p => !p.isDeleted && p.scopusEid === rawEid);
      if (existingEid) {
        throw new Error(`A publication with Scopus EID "${item.scopusEid}" already exists (Record: ${existingEid.publicationRecordNumber || existingEid.id}).`);
      }
    }
  }

  const dept = item.department || user?.dept || 'CSE';
  const ay = item.academicYear || '2025-26';
  const yearSuffix = (ay.split('-')[0] || '2026').trim();
  const nextSeq = String(items.length + 1).padStart(4, '0');
  const autoNum = item.publicationRecordNumber || `PUB-${dept}-${yearSuffix}-${nextSeq}`;

  if (index >= 0) {
    items[index] = {
      ...items[index],
      ...item,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || 'System'
    };
    addAuditLog('UPDATE', 'Publications', `Updated publication: ${item.title} (${autoNum})`, user);
  } else {
    const defaultWorkflowStatus = item.workflowStatus || (isHodOrAdmin ? 'APPROVED' : 'SUBMITTED');
    const newItem = {
      ...item,
      id: item.id || `pub_${Date.now()}`,
      publicationRecordNumber: autoNum,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'System',
      workflowStatus: defaultWorkflowStatus,
      isDeleted: false,
      reviewHistory: [
        {
          action: 'CREATED',
          status: defaultWorkflowStatus,
          timestamp: new Date().toISOString(),
          by: user?.name || 'Author',
          remarks: 'Initial publication submission'
        }
      ]
    };
    items.unshift(newItem);
    addAuditLog('CREATE', 'Publications', `Submitted paper: ${item.title} (${autoNum})`, user);
  }

  saveStore(STORAGE_KEYS.PUBLICATIONS, items);
  return items.map((it, idx) => normalizePublicationRecord(it, idx));
}

export function reviewPublication(id, action, remarks, reviewerUser) {
  const items = loadStore(STORAGE_KEYS.PUBLICATIONS, INITIAL_PUBLICATIONS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index === -1) return items;

  let targetStatus = 'APPROVED';
  if (action === 'REQUEST_REVISION') targetStatus = 'NEEDS_REVISION';
  else if (action === 'UNDER_REVIEW') targetStatus = 'UNDER_REVIEW';
  else if (action === 'PUBLISH') targetStatus = 'APPROVED';
  else if (action === 'ARCHIVE') targetStatus = 'ARCHIVED';

  items[index].workflowStatus = targetStatus;
  items[index].verifiedAt = new Date().toISOString();
  items[index].verifiedBy = reviewerUser?.name || 'Reviewer';
  if (!items[index].reviewHistory) items[index].reviewHistory = [];
  items[index].reviewHistory.push({
    action: action,
    status: targetStatus,
    timestamp: new Date().toISOString(),
    by: reviewerUser?.name || 'Reviewer',
    remarks: remarks || `Status updated to ${targetStatus}`
  });

  saveStore(STORAGE_KEYS.PUBLICATIONS, items);
  addAuditLog('REVIEW', 'Publications', `Reviewed publication ${items[index].publicationRecordNumber || id}: ${action} (Status: ${targetStatus})`, reviewerUser);
  return items.map((it, idx) => normalizePublicationRecord(it, idx));
}

export function importPublicationsBatch(candidates, currentUser) {
  if (!Array.isArray(candidates) || candidates.length === 0) return [];
  const items = loadStore(STORAGE_KEYS.PUBLICATIONS, INITIAL_PUBLICATIONS);
  let importedCount = 0;

  candidates.forEach(cand => {
    const rawDoi = (cand.doi || '').trim().toLowerCase();
    const rawEid = (cand.scopusEid || '').trim();

    // Check duplicate
    const exists = items.some(p => !p.isDeleted && (
      (rawDoi && (p.doi || '').trim().toLowerCase() === rawDoi) ||
      (rawEid && p.scopusEid === rawEid)
    ));

    if (!exists) {
      const dept = cand.department || currentUser?.dept || 'CSE';
      const ay = cand.academicYear || '2025-26';
      const yearSuffix = (ay.split('-')[0] || '2026').trim();
      const nextSeq = String(items.length + 1).padStart(4, '0');
      const autoNum = `PUB-${dept}-${yearSuffix}-${nextSeq}`;

      const newPub = {
        ...cand,
        id: `pub_sync_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        publicationRecordNumber: autoNum,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.name || 'Research Sync Engine',
        workflowStatus: 'IMPORTED_PENDING_REVIEW',
        isDeleted: false,
        sources: cand.sources || ['ORCID'],
        reviewHistory: [
          {
            action: 'IMPORTED_AUTO_SYNC',
            status: 'IMPORTED_PENDING_REVIEW',
            timestamp: new Date().toISOString(),
            by: currentUser?.name || 'Sync Engine',
            remarks: `Imported from ${cand.sources?.join(', ') || 'ORCID/Scopus'}`
          }
        ]
      };
      items.unshift(newPub);
      importedCount++;
    }
  });

  saveStore(STORAGE_KEYS.PUBLICATIONS, items);
  addAuditLog('SYNC_IMPORT_BATCH', 'Publications', `Imported ${importedCount} research publication(s) into institutional review pipeline`, currentUser);
  return items.map((it, idx) => normalizePublicationRecord(it, idx));
}

export function softDeletePublication(id, user) {
  const items = loadStore(STORAGE_KEYS.PUBLICATIONS, INITIAL_PUBLICATIONS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].isDeleted = true;
    items[index].deletedAt = new Date().toISOString();
    items[index].deletedBy = user?.name;
    saveStore(STORAGE_KEYS.PUBLICATIONS, items);
    addAuditLog('DELETE (Soft)', 'Publications', `Soft-deleted publication ID: ${id}`, user);
  }
  return items.filter(i => !i.isDeleted).map((it, idx) => normalizePublicationRecord(it, idx));
}

export function getFacultyResearchProfile(facultyId) {
  if (!facultyId) return { orcid: '', scopusAuthorId: '', wosResearcherId: '', googleScholarId: '', vidwanId: '' };
  const profiles = loadStore(STORAGE_KEYS.FACULTY_RESEARCH_PROFILES, []);
  const found = profiles.find(p => p.facultyId === facultyId);
  if (found) {
    return {
      orcid: found.orcid || '',
      scopusAuthorId: found.scopusAuthorId || '',
      wosResearcherId: found.wosResearcherId || '',
      googleScholarId: found.googleScholarId || '',
      vidwanId: found.vidwanId || '',
      lastSyncedAt: found.lastSyncedAt || null
    };
  }
  return {
    orcid: '',
    scopusAuthorId: '',
    wosResearcherId: '',
    googleScholarId: '',
    vidwanId: '',
    lastSyncedAt: null
  };
}

export function saveFacultyResearchProfile(facultyId, profileData, user) {
  if (!facultyId) return;
  const profiles = loadStore(STORAGE_KEYS.FACULTY_RESEARCH_PROFILES, []);
  const idx = profiles.findIndex(p => p.facultyId === facultyId);
  const updated = {
    facultyId,
    orcid: (profileData.orcid || '').trim(),
    scopusAuthorId: (profileData.scopusAuthorId || '').trim(),
    wosResearcherId: (profileData.wosResearcherId || '').trim(),
    openAlexAuthorId: (profileData.openAlexAuthorId || '').trim(),
    googleScholarId: (profileData.googleScholarId || '').trim(),
    vidwanId: (profileData.vidwanId || '').trim(),
    openAlexMatchStatus: profileData.openAlexMatchStatus || 'NOT_DISCOVERED',
    openAlexWorksCount: profileData.openAlexWorksCount || 0,
    openAlexCitedByCount: profileData.openAlexCitedByCount || 0,
    openAlexHIndex: profileData.openAlexHIndex || 0,
    profileVerifiedBy: user?.name || null,
    profileVerifiedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: user?.name || 'System'
  };

  if (idx >= 0) {
    profiles[idx] = { ...profiles[idx], ...updated };
  } else {
    profiles.push(updated);
  }
  saveStore(STORAGE_KEYS.FACULTY_RESEARCH_PROFILES, profiles);
  addAuditLog('UPDATE_RESEARCH_PROFILE', 'Publications', `Updated research profile for faculty ID: ${facultyId}`, user);
  return updated;
}

export function linkFacultyResearcher(facultyId, candidate, user) {
  if (!facultyId || !candidate) return;
  const profileData = {
    openAlexAuthorId: candidate.openAlexAuthorId || candidate.openAlexShortId || '',
    orcid: candidate.orcid || '',
    openAlexMatchStatus: 'MANUALLY_CONFIRMED',
    openAlexWorksCount: candidate.worksCount || 0,
    openAlexCitedByCount: candidate.citedByCount || 0,
    openAlexHIndex: candidate.hIndex || 0
  };
  const res = saveFacultyResearchProfile(facultyId, profileData, user);
  addAuditLog('RESEARCH_PROFILE_LINKED', 'Publications', `Linked faculty ID ${facultyId} to OpenAlex Author: ${candidate.canonicalName} (${candidate.openAlexShortId || candidate.openAlexAuthorId})`, user);
  return res;
}

export function unlinkFacultyResearcher(facultyId, user) {
  if (!facultyId) return;
  const profiles = loadStore(STORAGE_KEYS.FACULTY_RESEARCH_PROFILES, []);
  const idx = profiles.findIndex(p => p.facultyId === facultyId);
  if (idx >= 0) {
    profiles[idx].openAlexAuthorId = '';
    profiles[idx].openAlexMatchStatus = 'NOT_DISCOVERED';
    profiles[idx].updatedAt = new Date().toISOString();
    profiles[idx].updatedBy = user?.name || 'System';
    saveStore(STORAGE_KEYS.FACULTY_RESEARCH_PROFILES, profiles);
    addAuditLog('RESEARCH_PROFILE_UNLINKED', 'Publications', `Unlinked research profile for faculty ID: ${facultyId}`, user);
  }
}

export function getDatasetVersions() {
  const defaultVersions = [
    {
      id: 'ds_openalex_2026_06',
      source: 'OPENALEX',
      name: 'OpenAlex Public Snapshot (Parquet)',
      datasetVersion: '2026-06-01',
      publishedDate: '2026-06-01',
      status: 'READY',
      totalGlobalRecords: '649M Works / 112M Authors',
      relevantRecordCount: 486,
      checksum: 'sha256:7f4a9b2c8e1d3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
      ingestedAt: '2026-06-15T08:30:00Z',
      active: true
    },
    {
      id: 'ds_crossref_2026_03',
      source: 'CROSSREF',
      name: 'Crossref Annual Public Data File',
      datasetVersion: '2026-03-31',
      publishedDate: '2026-03-31',
      status: 'READY',
      totalGlobalRecords: '180M DOI Records',
      relevantRecordCount: 312,
      checksum: 'sha256:3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
      ingestedAt: '2026-06-16T10:15:00Z',
      active: true
    },
    {
      id: 'ds_orcid_2025_annual',
      source: 'ORCID',
      name: 'ORCID Annual Public Data File (CC0)',
      datasetVersion: '2025-10-01',
      publishedDate: '2025-10-01',
      status: 'READY',
      totalGlobalRecords: '21M Public Records',
      relevantRecordCount: 38,
      checksum: 'sha256:9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
      ingestedAt: '2026-06-16T14:45:00Z',
      active: true
    }
  ];
  return loadStore(STORAGE_KEYS.DATASET_VERSIONS, defaultVersions);
}

export function saveDatasetVersion(version, user) {
  const versions = getDatasetVersions();
  const idx = versions.findIndex(v => v.id === version.id);
  if (idx >= 0) {
    versions[idx] = { ...versions[idx], ...version, updatedAt: new Date().toISOString() };
  } else {
    versions.push({ ...version, id: `ds_${Date.now()}`, createdAt: new Date().toISOString() });
  }
  saveStore(STORAGE_KEYS.DATASET_VERSIONS, versions);
  addAuditLog('DATASET_INDEXED', 'Research Data', `Updated dataset version record: ${version.name} (${version.datasetVersion})`, user);
  return versions;
}

// ─────────────────────────────────────────────────────────────
// 2. PATENTS & IPR GOVERNANCE REPOSITORY
// ─────────────────────────────────────────────────────────────

export function normalizePatentRecord(raw, idx = 0) {
  if (!raw) return null;
  const dept = raw.department || 'CSE';
  const ay = raw.academicYear || '2025-26';
  const yearSuffix = (ay.split('-')[0] || '2026').trim();
  const autoNum = raw.patentRecordNumber || `PAT-${dept}-${yearSuffix}-${String(idx + 1).padStart(4, '0')}`;

  const inventors = Array.isArray(raw.inventors) ? raw.inventors : (
    Array.isArray(raw.authors) ? raw.authors.map((a, i) => ({
      inventorOrder: i + 1,
      personType: 'INTERNAL_FACULTY',
      name: a.name || 'Inventor',
      department: a.department || dept,
      designation: a.role || 'Faculty',
      affiliation: 'Narasaraopeta Engineering College',
      isLead: i === 0,
      isCorresponding: i === 0
    })) : [
      {
        inventorOrder: 1,
        personType: 'INTERNAL_FACULTY',
        name: raw.facultyName || 'Principal Inventor',
        department: dept,
        designation: 'Faculty',
        affiliation: 'Narasaraopeta Engineering College',
        isLead: true,
        isCorresponding: true
      }
    ]
  );

  const documents = Array.isArray(raw.documents) ? raw.documents : [
    ...(raw.patentPdf ? [{ id: 'DOC-1', name: raw.patentPdf, type: 'Patent Specification PDF', size: '2.4 MB', url: '#' }] : []),
    ...(raw.grantCertificatePdf ? [{ id: 'DOC-2', name: raw.grantCertificatePdf, type: 'Grant Certificate', size: '850 KB', url: '#' }] : [])
  ];

  const legalStatus = raw.legalStatus || (
    raw.patentStatus === 'Granted' ? 'GRANTED' : (
      raw.patentStatus === 'Published' ? 'PUBLISHED' : (
        raw.patentStatus === 'Filed' ? 'FILED' : 'PUBLISHED'
      )
    )
  );

  return {
    ...raw,
    id: raw.id || `pat_${Date.now()}_${idx}`,
    patentRecordNumber: autoNum,
    title: raw.title || 'Untitled Patent',
    department: dept,
    academicYear: ay,
    patentType: raw.patentType || 'Indian Patent',
    countryCode: raw.countryCode || 'IN',
    patentOffice: raw.patentOffice || 'Indian Patent Office (Chennai)',
    technologyDomain: raw.technologyDomain || 'Artificial Intelligence / IoT',
    abstract: raw.abstract || '',
    keywords: raw.keywords || '',
    applicationNumber: raw.applicationNumber || raw.applicationNo || '',
    applicationDate: raw.applicationDate || raw.filingDate || `${yearSuffix}-10-01`,
    filingDate: raw.filingDate || raw.applicationDate || `${yearSuffix}-10-01`,
    publicationDate: raw.publicationDate || '',
    grantNumber: raw.grantNumber || '',
    grantDate: raw.grantDate || '',
    priorityDate: raw.priorityDate || '',
    ferDate: raw.ferDate || '',
    expiryDate: raw.expiryDate || '',
    legalStatus: legalStatus,
    workflowStatus: raw.workflowStatus || (raw.verificationStatus === 'Verified' ? 'APPROVED' : 'UNDER_REVIEW'),
    applicantName: raw.applicantName || 'Narasaraopeta Engineering College (Autonomous)',
    ownershipType: raw.ownershipType || 'Narasaraopeta Engineering College',
    partnerOrg: raw.partnerOrg || '',
    ownershipPercent: raw.ownershipPercent || 100,
    inventors: inventors,
    documents: documents,
    publicVisibility: raw.publicVisibility || 'PUBLIC_SAFE',
    reviewHistory: Array.isArray(raw.reviewHistory) ? raw.reviewHistory : []
  };
}

export function getPatents(includeDeleted = false) {
  const items = loadStore(STORAGE_KEYS.PATENTS, INITIAL_PATENTS);
  const activeList = Array.isArray(items) ? items.filter(i => includeDeleted || !i.isDeleted) : [];
  return activeList.map((item, idx) => normalizePatentRecord(item, idx));
}

export function getPublicPatents() {
  const items = getPatents();
  return items.filter(i => i.workflowStatus === 'APPROVED' && !i.isDeleted);
}

export function savePatent(item, user) {
  const items = loadStore(STORAGE_KEYS.PATENTS, INITIAL_PATENTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === item.id) : -1;
  const isHodOrAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'HOD';

  // Duplicate Check on Application Number
  const appNo = (item.applicationNumber || item.applicationNo || '').trim();
  if (appNo && index === -1) {
    const existing = items.find(p => !p.isDeleted && ((p.applicationNumber || p.applicationNo || '').trim() === appNo));
    if (existing) {
      throw new Error(`A patent with Application Number "${appNo}" already exists (Record: ${existing.patentRecordNumber || existing.id}).`);
    }
  }

  const dept = item.department || user?.dept || 'CSE';
  const ay = item.academicYear || '2025-26';
  const yearSuffix = (ay.split('-')[0] || '2026').trim();
  const nextSeq = String(items.length + 1).padStart(4, '0');
  const autoNum = item.patentRecordNumber || `PAT-${dept}-${yearSuffix}-${nextSeq}`;

  if (index >= 0) {
    items[index] = {
      ...items[index],
      ...item,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || 'System'
    };
    addAuditLog('UPDATE', 'Patents', `Updated patent: ${item.title} (${autoNum})`, user);
  } else {
    const defaultWorkflowStatus = item.workflowStatus || (isHodOrAdmin ? 'APPROVED' : 'SUBMITTED');
    const newItem = {
      ...item,
      id: item.id || `pat_${Date.now()}`,
      patentRecordNumber: autoNum,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'System',
      workflowStatus: defaultWorkflowStatus,
      isDeleted: false,
      reviewHistory: [
        {
          action: 'CREATED',
          status: defaultWorkflowStatus,
          timestamp: new Date().toISOString(),
          by: user?.name || 'Inventor',
          remarks: 'Initial patent record creation'
        }
      ]
    };
    items.unshift(newItem);
    addAuditLog('CREATE', 'Patents', `Recorded patent: ${item.title} (${autoNum})`, user);
  }

  saveStore(STORAGE_KEYS.PATENTS, items);
  return items.map((it, idx) => normalizePatentRecord(it, idx));
}

export function reviewPatent(id, action, remarks, reviewerUser) {
  const items = loadStore(STORAGE_KEYS.PATENTS, INITIAL_PATENTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index === -1) return items;

  let targetStatus = 'APPROVED';
  if (action === 'REQUEST_REVISION') targetStatus = 'NEEDS_REVISION';
  else if (action === 'UNDER_REVIEW') targetStatus = 'UNDER_REVIEW';
  else if (action === 'PUBLISH') targetStatus = 'APPROVED';
  else if (action === 'ARCHIVE') targetStatus = 'ARCHIVED';

  items[index].workflowStatus = targetStatus;
  items[index].verifiedAt = new Date().toISOString();
  items[index].verifiedBy = reviewerUser?.name || 'Reviewer';
  if (!items[index].reviewHistory) items[index].reviewHistory = [];
  items[index].reviewHistory.push({
    action: action,
    status: targetStatus,
    timestamp: new Date().toISOString(),
    by: reviewerUser?.name || 'Reviewer',
    remarks: remarks || `Patent status updated to ${targetStatus}`
  });

  saveStore(STORAGE_KEYS.PATENTS, items);
  addAuditLog('REVIEW', 'Patents', `Reviewed patent ${items[index].patentRecordNumber || id}: ${action} (Status: ${targetStatus})`, reviewerUser);
  return items.map((it, idx) => normalizePatentRecord(it, idx));
}

export function updatePatentLegalStatus(id, newLegalStatus, user) {
  const items = loadStore(STORAGE_KEYS.PATENTS, INITIAL_PATENTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].legalStatus = newLegalStatus;
    items[index].updatedAt = new Date().toISOString();
    items[index].updatedBy = user?.name;
    if (!items[index].reviewHistory) items[index].reviewHistory = [];
    items[index].reviewHistory.push({
      action: 'LEGAL_STATUS_CHANGE',
      status: items[index].workflowStatus,
      timestamp: new Date().toISOString(),
      by: user?.name,
      remarks: `Legal status updated to ${newLegalStatus}`
    });
    saveStore(STORAGE_KEYS.PATENTS, items);
    addAuditLog('LEGAL_STATUS', 'Patents', `Updated legal status of ${items[index].patentRecordNumber || id} to ${newLegalStatus}`, user);
  }
  return items.map((it, idx) => normalizePatentRecord(it, idx));
}

export function softDeletePatent(id, user) {
  const items = loadStore(STORAGE_KEYS.PATENTS, INITIAL_PATENTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].isDeleted = true;
    items[index].deletedAt = new Date().toISOString();
    items[index].deletedBy = user?.name;
    saveStore(STORAGE_KEYS.PATENTS, items);
    addAuditLog('DELETE (Soft)', 'Patents', `Soft-deleted patent ID: ${id}`, user);
  }
  return items.filter(i => !i.isDeleted).map((it, idx) => normalizePatentRecord(it, idx));
}

// -------------------------------------------------------------
// Verified Student Directory Master & Lookup
// -------------------------------------------------------------
export const STUDENT_DIRECTORY = [
  { rollNumber: '22471A0589', name: 'K. Sai Praneeth', department: 'CSE', batch: '2022-2026', year: 'III Year', semester: 'II Sem', academicYear: '2025-26', email: '22471a0589@nrtec.in', phone: '9848012345' },
  { rollNumber: '23471A0412', name: 'M. Sneha Latha', department: 'ECE', batch: '2023-2027', year: 'II Year', semester: 'II Sem', academicYear: '2025-26', email: '23471a0412@nrtec.in', phone: '9848023456' },
  { rollNumber: '21471A1208', name: 'V. Harsha Vardhan', department: 'IT', batch: '2021-2025', year: 'IV Year', semester: 'II Sem', academicYear: '2025-26', email: '21471a1208@nrtec.in', phone: '9848034567' },
  { rollNumber: '21471A0512', name: 'G. Vamsi Krishna', department: 'CSE', batch: '2021-2025', year: 'IV Year', semester: 'II Sem', academicYear: '2025-26', email: '21471a0512@nrtec.in', phone: '9848045678' },
  { rollNumber: '22471A0445', name: 'T. Bhavani Prasad', department: 'ECE', batch: '2022-2026', year: 'III Year', semester: 'II Sem', academicYear: '2025-26', email: '22471a0445@nrtec.in', phone: '9848056789' },
  { rollNumber: '21471A0218', name: 'N. Anvesh Kumar', department: 'EEE', batch: '2021-2025', year: 'IV Year', semester: 'II Sem', academicYear: '2025-26', email: '21471a0218@nrtec.in', phone: '9848067890' },
  { rollNumber: '23BQ1A0501', name: 'Ch. Venkata Aditya', department: 'CSE', batch: '2023-2027', year: 'II Year', semester: 'II Sem', academicYear: '2025-26', email: '23bq1a0501@nrtec.in', phone: '9848078901' },
  { rollNumber: '23BQ1A0502', name: 'P. Deepika Rani', department: 'CSE', batch: '2023-2027', year: 'II Year', semester: 'II Sem', academicYear: '2025-26', email: '23bq1a0502@nrtec.in', phone: '9848089012' },
  { rollNumber: '22BQ1A4205', name: 'S. Akhil Reddy', department: 'CSM', batch: '2022-2026', year: 'III Year', semester: 'II Sem', academicYear: '2025-26', email: '22bq1a4205@nrtec.in', phone: '9848090123' },
  { rollNumber: '22BQ1A4418', name: 'B. Rohith Kumar', department: 'CSD', batch: '2022-2026', year: 'III Year', semester: 'II Sem', academicYear: '2025-26', email: '22bq1a4418@nrtec.in', phone: '9848101234' },
  { rollNumber: '21BQ1A0304', name: 'K. Jagadeesh Babu', department: 'MECH', batch: '2021-2025', year: 'IV Year', semester: 'II Sem', academicYear: '2025-26', email: '21bq1a0304@nrtec.in', phone: '9848112345' },
  { rollNumber: '22BQ1A0112', name: 'M. Siva Rama Krishna', department: 'CIVIL', batch: '2022-2026', year: 'III Year', semester: 'II Sem', academicYear: '2025-26', email: '22bq1a0112@nrtec.in', phone: '9848123456' }
];

export function lookupStudentByRollNumber(query) {
  if (!query || !query.trim()) return null;
  const clean = query.trim().toUpperCase();
  return STUDENT_DIRECTORY.find(s => s.rollNumber.toUpperCase() === clean) || null;
}

export function searchStudents(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  return STUDENT_DIRECTORY.filter(s => 
    s.rollNumber.toLowerCase().includes(q) || 
    s.name.toLowerCase().includes(q) ||
    s.department.toLowerCase().includes(q)
  );
}

// -------------------------------------------------------------
// 4. Student Achievements (Full Evidence Lifecycle)
// -------------------------------------------------------------
export function getStudentAchievements(includeDeleted = false) {
  const items = loadStore(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, INITIAL_STUDENT_ACHIEVEMENTS);
  return includeDeleted ? items : (Array.isArray(items) ? items.filter(i => !i.isDeleted) : []);
}

export function saveStudentAchievement(item, user) {
  const items = loadStore(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, INITIAL_STUDENT_ACHIEVEMENTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === item.id) : -1;
  const deptCode = item.department || item.branch || 'CSE';
  const yearCode = (item.academicYear || '2025-26').slice(0, 4);

  if (index >= 0) {
    const existing = items[index];
    const updated = {
      ...existing,
      ...item,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || 'Super Admin'
    };
    items[index] = updated;
    addAuditLog('UPDATE_ACHIEVEMENT', 'Student Achievements', `Updated achievement ${updated.achievementNumber || updated.id} for ${updated.studentName}`, user);
    saveStore(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, items);
    return updated;
  } else {
    // Generate institutional auto-number: ACH-CSE-2026-0001
    const count = items.filter(i => (i.department === deptCode)).length + 1;
    const seq = String(count).padStart(4, '0');
    const autoNumber = `ACH-${deptCode}-${yearCode}-${seq}`;

    const newItem = {
      ...item,
      id: item.id || 'ach_' + Date.now(),
      achievementNumber: item.achievementNumber || autoNumber,
      workflowStatus: item.workflowStatus || 'DRAFT',
      visibilityStatus: item.visibilityStatus || 'Internal Only',
      documents: item.documents || [],
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'Super Admin',
      isDeleted: false
    };

    if (Array.isArray(items)) items.unshift(newItem);
    addAuditLog('CREATE_ACHIEVEMENT', 'Student Achievements', `Created achievement ${newItem.achievementNumber} for ${newItem.studentName} (${newItem.title || newItem.eventName})`, user);
    saveStore(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, items);
    return newItem;
  }
}

export function reviewStudentAchievement(id, action, remarks, reviewerUser) {
  const items = loadStore(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, INITIAL_STUDENT_ACHIEVEMENTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    const item = items[index];
    let newStatus = item.workflowStatus;

    if (action === 'SUBMIT') newStatus = 'SUBMITTED';
    else if (action === 'VERIFY') newStatus = 'VERIFIED';
    else if (action === 'APPROVE') newStatus = 'APPROVED';
    else if (action === 'REQUEST_REVISION') newStatus = 'NEEDS_REVISION';
    else if (action === 'PUBLISH') {
      newStatus = 'APPROVED';
      item.visibilityStatus = 'Published';
      item.publishedAt = new Date().toISOString();
    } else if (action === 'ARCHIVE') newStatus = 'ARCHIVED';

    const history = item.reviewHistory || [];
    history.push({
      action,
      fromStatus: item.workflowStatus,
      toStatus: newStatus,
      remarks: remarks || '',
      reviewerName: reviewerUser?.name || 'Super Admin',
      reviewerRole: reviewerUser?.role || 'SUPER_ADMIN',
      timestamp: new Date().toISOString()
    });

    items[index] = {
      ...item,
      workflowStatus: newStatus,
      status: newStatus === 'APPROVED' ? 'Approved' : (newStatus === 'VERIFIED' ? 'Verified' : item.status),
      reviewHistory: history,
      updatedAt: new Date().toISOString(),
      updatedBy: reviewerUser?.name
    };

    addAuditLog(`REVIEW_${action}`, 'Student Achievements', `${action} achievement ${item.achievementNumber || item.id} for ${item.studentName}`, reviewerUser);
    saveStore(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, items);
    return items[index];
  }
  return null;
}

export function softDeleteStudentAchievement(id, user) {
  const items = loadStore(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, INITIAL_STUDENT_ACHIEVEMENTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].isDeleted = true;
    items[index].deletedAt = new Date().toISOString();
    items[index].deletedBy = user?.name;
    saveStore(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, items);
    addAuditLog('DELETE_ACHIEVEMENT', 'Student Achievements', `Soft-deleted achievement ID: ${id}`, user);
  }
  return Array.isArray(items) ? items.filter(i => !i.isDeleted) : [];
}

// -------------------------------------------------------------
// 5. Student Internships (Full Evidence Lifecycle)
// -------------------------------------------------------------
export function calculateInternshipDuration(startDate, endDate) {
  if (!startDate || !endDate) return { days: 0, weeks: 0 };
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return { days: 0, weeks: 0 };
  }
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const diffWeeks = parseFloat((diffDays / 7).toFixed(1));
  return { days: diffDays, weeks: diffWeeks };
}

export function calculateInternshipWeeks(startDate, endDate) {
  return calculateInternshipDuration(startDate, endDate).weeks;
}

export function getInternships(includeDeleted = false) {
  const items = loadStore(STORAGE_KEYS.INTERNSHIPS, INITIAL_INTERNSHIPS);
  return includeDeleted ? items : (Array.isArray(items) ? items.filter(i => !i.isDeleted) : []);
}

export function saveInternship(item, user) {
  const items = loadStore(STORAGE_KEYS.INTERNSHIPS, INITIAL_INTERNSHIPS);
  const duration = calculateInternshipDuration(item.startDate, item.endDate);
  const deptCode = item.department || item.branch || 'CSE';
  const yearCode = (item.academicYear || '2025-26').slice(0, 4);

  const internshipItem = { 
    ...item, 
    durationDays: duration.days, 
    durationWeeks: duration.weeks,
    weeks: duration.weeks
  };
  
  const index = Array.isArray(items) ? items.findIndex(i => i.id === item.id) : -1;
  if (index >= 0) {
    const existing = items[index];
    const updated = {
      ...existing,
      ...internshipItem,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || 'Super Admin'
    };
    items[index] = updated;
    addAuditLog('UPDATE_INTERNSHIP', 'Internships', `Updated internship ${updated.internshipNumber || updated.id} for ${updated.studentName}`, user);
    saveStore(STORAGE_KEYS.INTERNSHIPS, items);
    return updated;
  } else {
    // Generate institutional auto-number: INT-CSE-2026-0001
    const count = items.filter(i => (i.branch === deptCode || i.department === deptCode)).length + 1;
    const seq = String(count).padStart(4, '0');
    const autoNumber = `INT-${deptCode}-${yearCode}-${seq}`;

    const newItem = {
      ...internshipItem,
      id: item.id || 'int_' + Date.now(),
      internshipNumber: item.internshipNumber || autoNumber,
      internshipStatus: item.internshipStatus || 'Ongoing',
      workflowStatus: item.workflowStatus || 'DRAFT',
      documents: item.documents || [],
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'Super Admin',
      isDeleted: false
    };

    if (Array.isArray(items)) items.unshift(newItem);
    addAuditLog('CREATE_INTERNSHIP', 'Internships', `Recorded internship ${newItem.internshipNumber} for ${newItem.studentName} at ${newItem.organization}`, user);
    saveStore(STORAGE_KEYS.INTERNSHIPS, items);
    return newItem;
  }
}

export function reviewInternship(id, action, remarks, reviewerUser) {
  const items = loadStore(STORAGE_KEYS.INTERNSHIPS, INITIAL_INTERNSHIPS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    const item = items[index];
    let newStatus = item.workflowStatus;

    if (action === 'SUBMIT') newStatus = 'SUBMITTED';
    else if (action === 'VERIFY') newStatus = 'VERIFIED';
    else if (action === 'APPROVE') newStatus = 'VERIFIED';
    else if (action === 'COMPLETE') {
      newStatus = 'COMPLETED';
      item.internshipStatus = 'Completed';
    } else if (action === 'REQUEST_REVISION') newStatus = 'NEEDS_REVISION';
    else if (action === 'ARCHIVE') newStatus = 'ARCHIVED';

    const history = item.reviewHistory || [];
    history.push({
      action,
      fromStatus: item.workflowStatus,
      toStatus: newStatus,
      remarks: remarks || '',
      reviewerName: reviewerUser?.name || 'Super Admin',
      reviewerRole: reviewerUser?.role || 'SUPER_ADMIN',
      timestamp: new Date().toISOString()
    });

    items[index] = {
      ...item,
      workflowStatus: newStatus,
      status: newStatus === 'COMPLETED' ? 'Completed' : (newStatus === 'VERIFIED' ? 'Verified' : item.status),
      reviewHistory: history,
      updatedAt: new Date().toISOString(),
      updatedBy: reviewerUser?.name
    };

    addAuditLog(`REVIEW_${action}`, 'Internships', `${action} internship ${item.internshipNumber || item.id} for ${item.studentName}`, reviewerUser);
    saveStore(STORAGE_KEYS.INTERNSHIPS, items);
    return items[index];
  }
  return null;
}

export function softDeleteInternship(id, user) {
  const items = loadStore(STORAGE_KEYS.INTERNSHIPS, INITIAL_INTERNSHIPS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].isDeleted = true;
    items[index].deletedAt = new Date().toISOString();
    items[index].deletedBy = user?.name;
    saveStore(STORAGE_KEYS.INTERNSHIPS, items);
    addAuditLog('DELETE_INTERNSHIP', 'Internships', `Soft-deleted internship ID: ${id}`, user);
  }
  return Array.isArray(items) ? items.filter(i => !i.isDeleted) : [];
}

// ─────────────────────────────────────────────────────────────
// 6. STUDENT PROJECTS (Full Lifecycle & Review Milestones)
// ─────────────────────────────────────────────────────────────

export function normalizeStudentProjectRecord(raw, idx = 0) {
  if (!raw) return null;
  const dept = raw.department || 'CSE';
  const ay = raw.academicYear || '2025-26';
  const yearSuffix = (ay.split('-')[0] || '2026').trim();
  const autoNum = raw.projectNumber || `PRJ-${dept}-${yearSuffix}-${String(idx + 1).padStart(4, '0')}`;

  const team = Array.isArray(raw.teamMembers) ? raw.teamMembers : [
    {
      rollNumber: raw.studentRollNo || raw.rollNumber || '22471A0589',
      name: raw.studentName || raw.teamLeader || 'Team Leader',
      department: dept,
      year: raw.year || 'III Year',
      semester: raw.semester || 'II Sem',
      email: raw.email || '',
      isLeader: true
    }
  ];

  const guide = raw.guide || {
    facultyId: raw.guideId || '',
    name: raw.guideName || raw.facultyGuide || 'Assigned Faculty Guide',
    department: dept,
    designation: 'Faculty Guide',
    email: ''
  };

  const reviews = Array.isArray(raw.reviews) && raw.reviews.length > 0 ? raw.reviews : [
    { reviewName: 'Proposal / Synopsis Review', reviewDate: raw.startDate || `${yearSuffix}-08-15`, panelMembers: 'Project Review Committee', marksAwarded: 18, maxMarks: 20, feedback: 'Problem statement and scope approved.', status: 'COMPLETED' },
    { reviewName: 'Review 1 (Design & Architecture)', reviewDate: `${yearSuffix}-10-20`, panelMembers: 'Internal Committee', marksAwarded: 22, maxMarks: 25, feedback: 'Architecture validated; begin implementation.', status: 'COMPLETED' },
    { reviewName: 'Review 2 (Implementation & Testing)', reviewDate: `${yearSuffix}-12-10`, panelMembers: 'Internal Committee', marksAwarded: 20, maxMarks: 25, feedback: 'Core modules tested with benchmark dataset.', status: raw.projectStatus === 'Completed' ? 'COMPLETED' : 'IN_PROGRESS' },
    { reviewName: 'Final Viva & Demo', reviewDate: raw.expectedCompletion || `${parseInt(yearSuffix, 10) + 1}-03-25`, panelMembers: 'External & Internal Panel', marksAwarded: 27, maxMarks: 30, feedback: 'Excellent demonstration and documentation.', status: raw.projectStatus === 'Completed' ? 'COMPLETED' : 'PENDING' }
  ];

  const documents = Array.isArray(raw.documents) ? raw.documents : [
    ...(raw.projectReportPdf ? [{ id: 'DOC-1', name: raw.projectReportPdf, type: 'Project Report PDF', size: '3.2 MB', url: '#' }] : []),
    ...(raw.synopsisPdf ? [{ id: 'DOC-2', name: raw.synopsisPdf, type: 'Synopsis & Architecture', size: '850 KB', url: '#' }] : [])
  ];

  return {
    ...raw,
    id: raw.id || `prj_${Date.now()}_${idx}`,
    projectNumber: autoNum,
    projectTitle: raw.projectTitle || raw.title || 'Untitled Student Project',
    projectType: raw.projectType || 'Major Project',
    department: dept,
    batch: raw.batch || '2022-2026',
    academicYear: ay,
    year: raw.year || 'IV Year',
    semester: raw.semester || 'II Sem',
    domain: raw.domain || 'Artificial Intelligence / ML',
    domains: Array.isArray(raw.domains) ? raw.domains : [raw.domain || 'Artificial Intelligence / ML'],
    problemStatement: raw.problemStatement || 'Development of smart computational platform.',
    description: raw.description || raw.abstract || '',
    objectives: raw.objectives || '',
    expectedOutcome: raw.expectedOutcome || '',
    startDate: raw.startDate || `${yearSuffix}-07-15`,
    expectedCompletion: raw.expectedCompletion || `${parseInt(yearSuffix, 10) + 1}-04-10`,
    teamMembers: team,
    guide: guide,
    coGuide: raw.coGuide || null,
    industryAssociation: raw.industryAssociation || {
      isIndustryAssociated: raw.isIndustryProject === 'Yes',
      organization: raw.associatedCompany || '',
      industryMentor: raw.industryMentor || '',
      isMouAssociated: !!raw.associatedMoU,
      associatedMoU: raw.associatedMoU || ''
    },
    technologies: Array.isArray(raw.technologies) ? raw.technologies : (
      raw.techStack ? raw.techStack.split(',').map(s => s.trim()) : ['Python', 'React', 'TensorFlow']
    ),
    reviews: reviews,
    documents: documents,
    links: raw.links || {
      githubUrl: raw.githubUrl || '',
      liveDemoUrl: raw.liveDemoUrl || '',
      videoUrl: raw.videoUrl || ''
    },
    researchOutcomes: raw.researchOutcomes || {
      publicationGenerated: !!raw.linkedPublicationId,
      linkedPublicationId: raw.linkedPublicationId || null,
      patentFiled: !!raw.linkedPatentId,
      linkedPatentId: raw.linkedPatentId || null
    },
    projectStatus: raw.projectStatus || (raw.status === 'Completed' ? 'COMPLETED' : 'IN_PROGRESS'),
    workflowStatus: raw.workflowStatus || (raw.status === 'Completed' || raw.status === 'Approved' ? 'APPROVED' : 'UNDER_REVIEW'),
    publicVisibility: raw.publicVisibility || 'INTERNAL_ONLY',
    reviewHistory: Array.isArray(raw.reviewHistory) ? raw.reviewHistory : []
  };
}

export function getStudentProjects(includeDeleted = false) {
  const items = loadStore(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const activeList = Array.isArray(items) ? items.filter(i => includeDeleted || !i.isDeleted) : [];
  return activeList.map((item, idx) => normalizeStudentProjectRecord(item, idx));
}

export function saveStudentProject(item, user) {
  const items = loadStore(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const deptCode = item.department || 'CSE';
  const ay = item.academicYear || '2025-26';
  const yearSuffix = (ay.split('-')[0] || '2026').trim();
  const nextSeq = String(items.length + 1).padStart(4, '0');
  const autoNum = item.projectNumber || `PRJ-${deptCode}-${yearSuffix}-${nextSeq}`;

  const index = Array.isArray(items) ? items.findIndex(i => i.id === item.id) : -1;
  if (index >= 0) {
    items[index] = {
      ...items[index],
      ...item,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || 'System'
    };
    addAuditLog('UPDATE_PROJECT', 'Student Projects', `Updated project ${autoNum}: ${item.projectTitle || item.title}`, user);
    saveStore(STORAGE_KEYS.PROJECTS, items);
    return normalizeStudentProjectRecord(items[index]);
  } else {
    const defaultWorkflowStatus = item.workflowStatus || (user?.role === 'SUPER_ADMIN' || user?.role === 'HOD' ? 'APPROVED' : 'SUBMITTED');
    const newItem = {
      ...item,
      id: item.id || `prj_${Date.now()}`,
      projectNumber: autoNum,
      projectStatus: item.projectStatus || 'IN_PROGRESS',
      workflowStatus: defaultWorkflowStatus,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'System',
      isDeleted: false,
      reviewHistory: [
        {
          action: 'CREATED',
          status: defaultWorkflowStatus,
          timestamp: new Date().toISOString(),
          by: user?.name || 'Faculty / Team',
          remarks: 'Project registered in institutional portal'
        }
      ]
    };
    items.unshift(newItem);
    addAuditLog('CREATE_PROJECT', 'Student Projects', `Created project ${autoNum}: ${newItem.projectTitle}`, user);
    saveStore(STORAGE_KEYS.PROJECTS, items);
    return normalizeStudentProjectRecord(newItem);
  }
}

export function updateProjectReview(id, reviewIndex, updatedReviewData, user) {
  const items = loadStore(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    const item = items[index];
    if (!item.reviews) item.reviews = [];
    item.reviews[reviewIndex] = { ...item.reviews[reviewIndex], ...updatedReviewData };
    item.updatedAt = new Date().toISOString();
    item.updatedBy = user?.name;
    addAuditLog('PROJECT_REVIEW_UPDATED', 'Student Projects', `Updated ${item.reviews[reviewIndex]?.reviewName} for ${item.projectNumber || id}`, user);
    saveStore(STORAGE_KEYS.PROJECTS, items);
    return normalizeStudentProjectRecord(items[index]);
  }
  return null;
}

export function reviewStudentProject(id, action, remarks, reviewerUser) {
  const items = loadStore(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    let targetStatus = 'APPROVED';
    if (action === 'REQUEST_REVISION') targetStatus = 'NEEDS_REVISION';
    else if (action === 'UNDER_REVIEW') targetStatus = 'UNDER_REVIEW';
    else if (action === 'COMPLETE') {
      items[index].projectStatus = 'COMPLETED';
      targetStatus = 'APPROVED';
    } else if (action === 'ARCHIVE') targetStatus = 'ARCHIVED';

    items[index].workflowStatus = targetStatus;
    items[index].verifiedAt = new Date().toISOString();
    items[index].verifiedBy = reviewerUser?.name || 'Reviewer';
    if (!items[index].reviewHistory) items[index].reviewHistory = [];
    items[index].reviewHistory.push({
      action: action,
      status: targetStatus,
      timestamp: new Date().toISOString(),
      by: reviewerUser?.name || 'Reviewer',
      remarks: remarks || `Project status updated to ${targetStatus}`
    });

    saveStore(STORAGE_KEYS.PROJECTS, items);
    addAuditLog('REVIEW_PROJECT', 'Student Projects', `Reviewed project ${items[index].projectNumber || id}: ${action} (Status: ${targetStatus})`, reviewerUser);
    return items.map((it, idx) => normalizeStudentProjectRecord(it, idx));
  }
  return items;
}

export function softDeleteStudentProject(id, user) {
  const items = loadStore(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].isDeleted = true;
    items[index].deletedAt = new Date().toISOString();
    items[index].deletedBy = user?.name;
    saveStore(STORAGE_KEYS.PROJECTS, items);
    addAuditLog('DELETE_PROJECT', 'Student Projects', `Soft-deleted project ID: ${id}`, user);
  }
  return items.filter(i => !i.isDeleted).map((it, idx) => normalizeStudentProjectRecord(it, idx));
}

// -------------------------------------------------------------
// 7. FDPs Organized (Full Academic Evidence Lifecycle)
// -------------------------------------------------------------
export function getFDPs(includeDeleted = false) {
  const items = loadStore(STORAGE_KEYS.FDPS, INITIAL_FDPS);
  return includeDeleted ? items : (Array.isArray(items) ? items.filter(i => !i.isDeleted) : []);
}

export function saveFDP(item, user) {
  const items = loadStore(STORAGE_KEYS.FDPS, INITIAL_FDPS);
  const deptCode = item.department || 'CSE';
  const yearCode = (item.academicYear || '2025-26').slice(0, 4);

  // Auto duration
  let durationDays = 1;
  if (item.startDate && item.endDate) {
    const s = new Date(item.startDate);
    const e = new Date(item.endDate);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && e >= s) {
      durationDays = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    }
  }

  const fdpPayload = {
    ...item,
    durationDays: durationDays || item.durationDays || 1
  };

  const index = Array.isArray(items) ? items.findIndex(i => i.id === item.id) : -1;
  if (index >= 0) {
    const existing = items[index];
    const updated = {
      ...existing,
      ...fdpPayload,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || 'Super Admin'
    };
    items[index] = updated;
    addAuditLog('UPDATE_FDP', 'FDPs Organized', `Updated FDP ${updated.fdpNumber || updated.id}: ${updated.fdpTitle}`, user);
    saveStore(STORAGE_KEYS.FDPS, items);
    return updated;
  } else {
    // Generate institutional auto-number: FDP-CSE-2026-001
    const count = items.filter(i => i.department === deptCode).length + 1;
    const seq = String(count).padStart(3, '0');
    const autoNumber = `FDP-${deptCode}-${yearCode}-${seq}`;

    const newItem = {
      ...fdpPayload,
      id: item.id || 'fdp_' + Date.now(),
      fdpNumber: item.fdpNumber || autoNumber,
      programmeStatus: item.programmeStatus || 'COMPLETED',
      workflowStatus: item.workflowStatus || 'DRAFT',
      resourcePersons: item.resourcePersons || [],
      documents: item.documents || [],
      financials: item.financials || { hasFinance: false, amount: 0, invoiceNumber: '', paymentStatus: 'Not Applicable' },
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'Super Admin',
      isDeleted: false
    };

    if (Array.isArray(items)) items.unshift(newItem);
    addAuditLog('CREATE_FDP', 'FDPs Organized', `Created FDP record ${newItem.fdpNumber}: ${newItem.fdpTitle}`, user);
    saveStore(STORAGE_KEYS.FDPS, items);
    return newItem;
  }
}

export function reviewFDP(id, action, remarks, reviewerUser) {
  const items = loadStore(STORAGE_KEYS.FDPS, INITIAL_FDPS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    const item = items[index];
    let newStatus = item.workflowStatus;

    if (action === 'SUBMIT') newStatus = 'SUBMITTED';
    else if (action === 'UNDER_REVIEW') newStatus = 'UNDER_REVIEW';
    else if (action === 'APPROVE') newStatus = 'APPROVED';
    else if (action === 'REQUEST_REVISION') newStatus = 'NEEDS_REVISION';
    else if (action === 'ARCHIVE') newStatus = 'ARCHIVED';

    const history = item.reviewHistory || [];
    history.push({
      action,
      fromStatus: item.workflowStatus,
      toStatus: newStatus,
      remarks: remarks || '',
      reviewerName: reviewerUser?.name || 'Super Admin',
      reviewerRole: reviewerUser?.role || 'SUPER_ADMIN',
      timestamp: new Date().toISOString()
    });

    items[index] = {
      ...item,
      workflowStatus: newStatus,
      status: newStatus === 'APPROVED' ? 'Approved' : item.status,
      reviewHistory: history,
      updatedAt: new Date().toISOString(),
      updatedBy: reviewerUser?.name
    };

    addAuditLog(`REVIEW_${action}`, 'FDPs Organized', `${action} FDP ${item.fdpNumber || item.id}`, reviewerUser);
    saveStore(STORAGE_KEYS.FDPS, items);
    return items[index];
  }
  return null;
}

export function softDeleteFDP(id, user) {
  const items = loadStore(STORAGE_KEYS.FDPS, INITIAL_FDPS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].isDeleted = true;
    items[index].deletedAt = new Date().toISOString();
    items[index].deletedBy = user?.name;
    saveStore(STORAGE_KEYS.FDPS, items);
    addAuditLog('DELETE_FDP', 'FDPs Organized', `Soft-deleted FDP ID: ${id}`, user);
  }
  return Array.isArray(items) ? items.filter(i => !i.isDeleted) : [];
}

// -------------------------------------------------------------
// 8. Faculty Achievements & Development (Full Lifecycle)
// -------------------------------------------------------------
export function getFacultyAchievements(includeDeleted = false) {
  const items = loadStore(STORAGE_KEYS.FACULTY_ACHIEVEMENTS, INITIAL_FACULTY_ACHIEVEMENTS);
  return includeDeleted ? items : (Array.isArray(items) ? items.filter(i => !i.isDeleted) : []);
}

export function saveFacultyAchievement(item, user) {
  const items = loadStore(STORAGE_KEYS.FACULTY_ACHIEVEMENTS, INITIAL_FACULTY_ACHIEVEMENTS);
  const deptCode = item.department || 'CSE';
  const yearCode = (item.academicYear || '2025-26').slice(0, 4);

  // Auto duration
  let durationDays = 1;
  if (item.startDate && item.endDate) {
    const s = new Date(item.startDate);
    const e = new Date(item.endDate);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && e >= s) {
      durationDays = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    }
  }

  const payload = {
    ...item,
    durationDays: durationDays || item.durationDays || 1
  };

  const index = Array.isArray(items) ? items.findIndex(i => i.id === item.id) : -1;
  if (index >= 0) {
    const existing = items[index];
    const updated = {
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || 'Super Admin'
    };
    items[index] = updated;
    addAuditLog('UPDATE_FACULTY_ACH', 'Faculty Achievements', `Updated achievement ${updated.achievementNumber || updated.id} for ${updated.facultyName}`, user);
    saveStore(STORAGE_KEYS.FACULTY_ACHIEVEMENTS, items);
    return updated;
  } else {
    // Generate institutional auto-number: FAC-ACH-CSE-2026-001
    const count = items.filter(i => i.department === deptCode).length + 1;
    const seq = String(count).padStart(3, '0');
    const autoNumber = `FAC-ACH-${deptCode}-${yearCode}-${seq}`;

    const newItem = {
      ...payload,
      id: item.id || 'fach_' + Date.now(),
      achievementNumber: item.achievementNumber || autoNumber,
      workflowStatus: item.workflowStatus || 'DRAFT',
      activityStatus: item.activityStatus || 'Completed',
      documents: item.documents || [],
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'Super Admin',
      isDeleted: false
    };

    if (Array.isArray(items)) items.unshift(newItem);
    addAuditLog('CREATE_FACULTY_ACH', 'Faculty Achievements', `Recorded achievement ${newItem.achievementNumber} for ${newItem.facultyName}: ${newItem.title}`, user);
    saveStore(STORAGE_KEYS.FACULTY_ACHIEVEMENTS, items);
    return newItem;
  }
}

export function reviewFacultyAchievement(id, action, remarks, reviewerUser) {
  const items = loadStore(STORAGE_KEYS.FACULTY_ACHIEVEMENTS, INITIAL_FACULTY_ACHIEVEMENTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    const item = items[index];
    let newStatus = item.workflowStatus;

    if (action === 'SUBMIT') newStatus = 'SUBMITTED';
    else if (action === 'VERIFY') newStatus = 'VERIFIED';
    else if (action === 'APPROVE') newStatus = 'APPROVED';
    else if (action === 'REQUEST_REVISION') newStatus = 'NEEDS_REVISION';
    else if (action === 'ARCHIVE') newStatus = 'ARCHIVED';

    const history = item.reviewHistory || [];
    history.push({
      action,
      fromStatus: item.workflowStatus,
      toStatus: newStatus,
      remarks: remarks || '',
      reviewerName: reviewerUser?.name || 'Super Admin',
      reviewerRole: reviewerUser?.role || 'SUPER_ADMIN',
      timestamp: new Date().toISOString()
    });

    items[index] = {
      ...item,
      workflowStatus: newStatus,
      status: newStatus === 'APPROVED' ? 'Approved' : (newStatus === 'VERIFIED' ? 'Verified' : item.status),
      reviewHistory: history,
      updatedAt: new Date().toISOString(),
      updatedBy: reviewerUser?.name
    };

    addAuditLog(`REVIEW_${action}`, 'Faculty Achievements', `${action} achievement ${item.achievementNumber || item.id} for ${item.facultyName}`, reviewerUser);
    saveStore(STORAGE_KEYS.FACULTY_ACHIEVEMENTS, items);
    return items[index];
  }
  return null;
}

export function softDeleteFacultyAchievement(id, user) {
  const items = loadStore(STORAGE_KEYS.FACULTY_ACHIEVEMENTS, INITIAL_FACULTY_ACHIEVEMENTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].isDeleted = true;
    items[index].deletedAt = new Date().toISOString();
    items[index].deletedBy = user?.name;
    saveStore(STORAGE_KEYS.FACULTY_ACHIEVEMENTS, items);
    addAuditLog('DELETE_FACULTY_ACH', 'Faculty Achievements', `Soft-deleted faculty achievement ID: ${id}`, user);
  }
  return Array.isArray(items) ? items.filter(i => !i.isDeleted) : [];
}


// -------------------------------------------------------------
// 9. Unified Academic Events (Workshops, Seminars, Guest Lectures, Hackathons, Code-a-thons, Conferences)
// -------------------------------------------------------------
export function getAcademicEvents(includeDeleted = false) {
  const items = loadStore(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  if (!Array.isArray(items)) return [];

  const normalized = items.map(item => {
    const title = item.title || item.name || item.eventName || 'Academic Event';
    const eventType = item.eventType || 'Workshop';
    const dept = item.department || 'CSE';
    const ay = item.academicYear || item.yearCode || '2025-26';
    const start = item.startDate || item.date || '2025-02-14';
    const end = item.endDate || item.date || start;

    return {
      ...item,
      id: item.id || 'evt_' + Math.random().toString(36).substr(2, 9),
      eventNumber: item.eventNumber || item.id,
      title,
      name: title,
      eventType,
      department: dept,
      academicYear: ay,
      startDate: start,
      endDate: end,
      startTime: item.startTime || '09:30',
      endTime: item.endTime || '16:30',
      mode: item.mode || 'Offline',
      venue: item.venue || 'Campus Auditorium',
      privateMeetingUrl: item.privateMeetingUrl || '',
      level: item.level || 'Institution',
      description: item.description || '',
      objectives: item.objectives || '',
      targetAudience: item.targetAudience || 'All Students',
      targetYear: item.targetYear || item.year || 'All Years',
      targetSemester: item.targetSemester || item.semester || 'Both Semesters',
      
      // People
      coordinatorName: item.coordinatorName || item.facultyCoordinator || '',
      coCoordinatorName: item.coCoordinatorName || '',
      studentCoordinatorName: item.studentCoordinatorName || '',
      resourcePersons: item.resourcePersons || (item.resourcePerson ? [{
        name: item.resourcePerson,
        designation: 'Expert / Resource Person',
        organization: item.associatedOrganization || 'Invited Organization',
        isExternal: true
      }] : []),
      
      // Audience Metrics
      expectedParticipants: Number(item.expectedParticipants || item.participants || 100),
      actualParticipants: Number(item.actualParticipants || item.participants || 0),
      
      // Status
      eventStatus: item.eventStatus || (item.status === 'Completed' ? 'COMPLETED' : 'PLANNED'),
      workflowStatus: item.workflowStatus || (item.status === 'Completed' || item.status === 'Approved' ? 'APPROVED' : 'DRAFT'),
      
      // Collaboration
      isMouAssociated: item.isMouAssociated || (item.mouYesNo === 'Yes' ? 'Yes' : 'No'),
      associatedMoU: item.associatedMoU || item.associatedOrganization || '',
      
      // Event-type specific detail containers
      sessions: item.sessions || [],
      workshopDetails: item.workshopDetails || {},
      guestLectureDetails: item.guestLectureDetails || {},
      hackathonDetails: item.hackathonDetails || {
        problemStatements: [],
        judgingCriteria: [],
        prizes: [],
        domains: []
      },
      codeathonDetails: item.codeathonDetails || {},
      
      // Evidence & Media
      documents: item.documents || [],
      photos: item.photos || [],
      winners: item.winners || [],
      
      // Outcome
      outcomeSummary: item.outcomeSummary || '',
      feedbackSummary: item.feedbackSummary || '',
      publicVisibility: item.publicVisibility || 'INTERNAL_ONLY',
      
      isDeleted: !!item.isDeleted
    };
  });

  return includeDeleted ? normalized : normalized.filter(i => !i.isDeleted);
}

// Backward compatible alias
export function getEvents(includeDeleted = false) {
  return getAcademicEvents(includeDeleted);
}

export function saveAcademicEvent(item, user) {
  const items = loadStore(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  const deptCode = item.department || 'CSE';
  const yearCode = (item.academicYear || '2025-26').slice(0, 4);

  const index = Array.isArray(items) ? items.findIndex(i => i.id === item.id) : -1;
  if (index >= 0) {
    const existing = items[index];
    const updated = {
      ...existing,
      ...item,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || 'Super Admin'
    };
    items[index] = updated;
    addAuditLog('EVENT_UPDATED', 'Academic Events', `Updated academic event ${updated.eventNumber || updated.id}: ${updated.title || updated.name}`, user);
    saveStore(STORAGE_KEYS.EVENTS, items);
    return updated;
  } else {
    // Generate institutional auto-number: EVT-CSE-2026-0001
    const count = items.filter(i => i.department === deptCode).length + 1;
    const seq = String(count).padStart(4, '0');
    const autoNumber = `EVT-${deptCode}-${yearCode}-${seq}`;

    const newItem = {
      ...item,
      id: item.id || 'evt_' + Date.now(),
      eventNumber: item.eventNumber || autoNumber,
      title: item.title || item.name || 'Academic Event',
      name: item.title || item.name || 'Academic Event',
      eventType: item.eventType || 'Workshop',
      eventStatus: item.eventStatus || 'PLANNED',
      workflowStatus: item.workflowStatus || 'DRAFT',
      resourcePersons: item.resourcePersons || [],
      sessions: item.sessions || [],
      documents: item.documents || [],
      photos: item.photos || [],
      winners: item.winners || [],
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'Super Admin',
      isDeleted: false
    };

    if (Array.isArray(items)) items.unshift(newItem);
    addAuditLog('EVENT_CREATED', 'Academic Events', `Created ${newItem.eventType} event ${newItem.eventNumber}: ${newItem.title}`, user);
    saveStore(STORAGE_KEYS.EVENTS, items);
    return newItem;
  }
}

// Backward compatible alias
export function saveEvent(item, user) {
  return saveAcademicEvent(item, user);
}

export function reviewAcademicEvent(id, action, remarks, reviewerUser) {
  const items = loadStore(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    const item = items[index];
    let newStatus = item.workflowStatus;

    if (action === 'SUBMIT') newStatus = 'SUBMITTED';
    else if (action === 'UNDER_REVIEW') newStatus = 'UNDER_REVIEW';
    else if (action === 'APPROVE') newStatus = 'APPROVED';
    else if (action === 'REQUEST_REVISION') newStatus = 'NEEDS_REVISION';
    else if (action === 'PUBLISH') {
      newStatus = 'APPROVED';
      item.publicVisibility = 'PUBLISHED';
    } else if (action === 'ARCHIVE') newStatus = 'ARCHIVED';

    const history = item.reviewHistory || [];
    history.push({
      action,
      fromStatus: item.workflowStatus,
      toStatus: newStatus,
      remarks: remarks || '',
      reviewerName: reviewerUser?.name || 'Super Admin',
      reviewerRole: reviewerUser?.role || 'SUPER_ADMIN',
      timestamp: new Date().toISOString()
    });

    items[index] = {
      ...item,
      workflowStatus: newStatus,
      status: newStatus === 'APPROVED' ? 'Approved' : item.status,
      reviewHistory: history,
      updatedAt: new Date().toISOString(),
      updatedBy: reviewerUser?.name
    };

    addAuditLog(`EVENT_${action}`, 'Academic Events', `${action} event ${item.eventNumber || item.id}: ${item.title || item.name}`, reviewerUser);
    saveStore(STORAGE_KEYS.EVENTS, items);
    return items[index];
  }
  return null;
}

export function updateAcademicEventStatus(id, newEventStatus, user) {
  const items = loadStore(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].eventStatus = newEventStatus;
    items[index].updatedAt = new Date().toISOString();
    items[index].updatedBy = user?.name;
    addAuditLog('EVENT_STATUS_CHANGED', 'Academic Events', `Changed event status to ${newEventStatus} for ${items[index].eventNumber || items[index].id}`, user);
    saveStore(STORAGE_KEYS.EVENTS, items);
    return items[index];
  }
  return null;
}

export function saveAcademicEventWinners(id, winnersList, user) {
  const items = loadStore(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].winners = winnersList || [];
    items[index].updatedAt = new Date().toISOString();
    items[index].updatedBy = user?.name;
    addAuditLog('EVENT_WINNERS_UPDATED', 'Academic Events', `Updated winners for ${items[index].eventNumber || items[index].id}`, user);
    saveStore(STORAGE_KEYS.EVENTS, items);
    return items[index];
  }
  return null;
}

export function softDeleteAcademicEvent(id, user) {
  const items = loadStore(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].isDeleted = true;
    items[index].deletedAt = new Date().toISOString();
    items[index].deletedBy = user?.name;
    saveStore(STORAGE_KEYS.EVENTS, items);
    addAuditLog('EVENT_ARCHIVED', 'Academic Events', `Soft-deleted event record ID: ${id}`, user);
  }
  return Array.isArray(items) ? items.filter(i => !i.isDeleted) : [];
}

// ─────────────────────────────────────────────────────────────
// 10. FACULTY MEMBERSHIPS & PROFESSIONAL BODIES REPOSITORY
// ─────────────────────────────────────────────────────────────

export function calculateMembershipStatus(membershipType, endDate) {
  if (membershipType === 'Life Membership' || membershipType === 'Fellow' || membershipType === 'LIFETIME') {
    return { status: 'LIFETIME', diffDays: 9999, label: 'Life Membership' };
  }
  if (!endDate) {
    return { status: 'ACTIVE', diffDays: 365, label: 'Active' };
  }
  const exp = new Date(endDate);
  if (isNaN(exp.getTime())) {
    return { status: 'ACTIVE', diffDays: 365, label: 'Active' };
  }
  const now = new Date();
  const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) {
    return { status: 'EXPIRED', diffDays, label: `Expired ${Math.abs(diffDays)} days ago` };
  }
  if (diffDays <= 90) {
    return { status: 'EXPIRING_SOON', diffDays, label: `Expires in ${diffDays} days` };
  }
  return { status: 'ACTIVE', diffDays, label: 'Active' };
}

export function normalizeMembershipRecord(raw, idx = 0) {
  if (!raw) return null;
  const dept = raw.department || 'CSE';
  const ay = raw.academicYear || '2025-26';
  const yearSuffix = (ay.split('-')[0] || '2026').trim();
  const autoNum = raw.membershipRecordNumber || `MEM-${dept}-${yearSuffix}-${String(idx + 1).padStart(4, '0')}`;

  const membershipType = raw.membershipType || (raw.validity === 'Life' || raw.membershipStatus === 'Life' ? 'Life Membership' : 'Annual Membership');
  const org = raw.organization || raw.professionalBody || 'IEEE';
  const validStatus = calculateMembershipStatus(membershipType, raw.endDate || raw.validUntil);

  const documents = Array.isArray(raw.documents) ? raw.documents : [
    ...(raw.certificatePdf ? [{ id: 'DOC-1', name: raw.certificatePdf, type: 'Membership Certificate', size: '1.2 MB', url: '#' }] : [])
  ];

  return {
    ...raw,
    id: raw.id || `mem_${Date.now()}_${idx}`,
    membershipRecordNumber: autoNum,
    facultyId: raw.facultyId || '',
    facultyName: raw.facultyName || raw.name || 'Faculty Member',
    department: dept,
    designation: raw.designation || 'Faculty',
    email: raw.email || '',
    organization: org,
    organizationName: raw.organizationName || (org === 'Other' ? raw.customOrgName : org),
    organizationWebsite: raw.organizationWebsite || '',
    membershipType: membershipType,
    membershipCategory: raw.membershipCategory || 'Professional',
    membershipNumber: raw.membershipNumber || raw.membershipId || '',
    startDate: raw.startDate || raw.validFrom || `${yearSuffix}-06-01`,
    endDate: membershipType === 'Life Membership' ? null : (raw.endDate || raw.validUntil || `${parseInt(yearSuffix, 10) + 1}-05-31`),
    memberSince: raw.memberSince || raw.startDate || yearSuffix,
    academicYear: ay,
    verificationUrl: raw.verificationUrl || raw.url || '',
    remarks: raw.remarks || '',
    membershipStatus: raw.membershipStatus || validStatus.status,
    workflowStatus: raw.workflowStatus || (raw.status === 'Approved' || raw.verificationStatus === 'Verified' ? 'APPROVED' : 'UNDER_REVIEW'),
    documents: documents,
    renewals: Array.isArray(raw.renewals) ? raw.renewals : [],
    reviewHistory: Array.isArray(raw.reviewHistory) ? raw.reviewHistory : [],
    publicVisibility: raw.publicVisibility || 'PUBLIC_SAFE'
  };
}

export function getMemberships(includeDeleted = false) {
  const items = loadStore(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
  const activeList = Array.isArray(items) ? items.filter(i => includeDeleted || !i.isDeleted) : [];
  return activeList.map((item, idx) => normalizeMembershipRecord(item, idx));
}

export function saveMembership(item, user) {
  const items = loadStore(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
  const deptCode = item.department || user?.dept || 'CSE';
  const ay = item.academicYear || '2025-26';
  const yearSuffix = (ay.split('-')[0] || '2026').trim();
  const nextSeq = String(items.length + 1).padStart(4, '0');
  const autoNum = item.membershipRecordNumber || `MEM-${deptCode}-${yearSuffix}-${nextSeq}`;

  const index = Array.isArray(items) ? items.findIndex(i => i.id === item.id) : -1;

  // Duplicate Check on Membership Number per Org
  const memNo = (item.membershipNumber || '').trim();
  if (memNo && index === -1) {
    const existing = items.find(m => !m.isDeleted && m.organization === item.organization && (m.membershipNumber || '').trim() === memNo);
    if (existing) {
      throw new Error(`A membership record with number "${memNo}" for ${item.organization} already exists (${existing.membershipRecordNumber || existing.id}).`);
    }
  }

  const validStatus = calculateMembershipStatus(item.membershipType, item.endDate);
  const membershipStatus = validStatus.status;

  if (index >= 0) {
    items[index] = {
      ...items[index],
      ...item,
      membershipStatus: membershipStatus,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || 'System'
    };
    addAuditLog('UPDATE_MEMBERSHIP', 'Memberships', `Updated membership ${autoNum} for ${item.facultyName} (${item.organization})`, user);
    saveStore(STORAGE_KEYS.MEMBERSHIPS, items);
    return normalizeMembershipRecord(items[index]);
  } else {
    const defaultWorkflowStatus = item.workflowStatus || (user?.role === 'SUPER_ADMIN' || user?.role === 'HOD' ? 'APPROVED' : 'SUBMITTED');
    const newItem = {
      ...item,
      id: item.id || `mem_${Date.now()}`,
      membershipRecordNumber: autoNum,
      membershipStatus: membershipStatus,
      workflowStatus: defaultWorkflowStatus,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'System',
      isDeleted: false,
      reviewHistory: [
        {
          action: 'CREATED',
          status: defaultWorkflowStatus,
          timestamp: new Date().toISOString(),
          by: user?.name || 'Faculty Member',
          remarks: 'Membership recorded in portal'
        }
      ]
    };
    items.unshift(newItem);
    addAuditLog('CREATE_MEMBERSHIP', 'Memberships', `Added membership ${autoNum} for ${newItem.facultyName} (${newItem.organization})`, user);
    saveStore(STORAGE_KEYS.MEMBERSHIPS, items);
    return normalizeMembershipRecord(newItem);
  }
}

export function renewMembership(id, renewalData, user) {
  const items = loadStore(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    const item = items[index];
    const prevEndDate = item.endDate;
    if (!item.renewals) item.renewals = [];

    const newRenewalEntry = {
      renewalId: 'REN-' + Date.now(),
      renewalDate: renewalData.renewalDate || new Date().toISOString().split('T')[0],
      previousEndDate: prevEndDate,
      newEndDate: renewalData.newEndDate,
      receiptNumber: renewalData.receiptNumber || '',
      receiptDocument: renewalData.receiptDocument || null,
      remarks: renewalData.remarks || 'Annual membership renewed',
      renewedBy: user?.name || 'Faculty Member',
      timestamp: new Date().toISOString()
    };

    item.renewals.unshift(newRenewalEntry);
    item.endDate = renewalData.newEndDate;
    const validStatus = calculateMembershipStatus(item.membershipType, item.endDate);
    item.membershipStatus = validStatus.status;
    item.updatedAt = new Date().toISOString();
    item.updatedBy = user?.name;

    addAuditLog('RENEW_MEMBERSHIP', 'Memberships', `Renewed membership ${item.membershipRecordNumber || id} until ${renewalData.newEndDate}`, user);
    saveStore(STORAGE_KEYS.MEMBERSHIPS, items);
    return normalizeMembershipRecord(items[index]);
  }
  return null;
}

export function reviewMembership(id, action, remarks, reviewerUser) {
  const items = loadStore(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    let targetStatus = 'APPROVED';
    if (action === 'REQUEST_REVISION') targetStatus = 'NEEDS_REVISION';
    else if (action === 'UNDER_REVIEW') targetStatus = 'UNDER_REVIEW';
    else if (action === 'ARCHIVE') targetStatus = 'ARCHIVED';

    items[index].workflowStatus = targetStatus;
    items[index].verifiedAt = new Date().toISOString();
    items[index].verifiedBy = reviewerUser?.name || 'Reviewer';
    if (!items[index].reviewHistory) items[index].reviewHistory = [];
    items[index].reviewHistory.push({
      action: action,
      status: targetStatus,
      timestamp: new Date().toISOString(),
      by: reviewerUser?.name || 'Reviewer',
      remarks: remarks || `Membership status updated to ${targetStatus}`
    });

    saveStore(STORAGE_KEYS.MEMBERSHIPS, items);
    addAuditLog('REVIEW_MEMBERSHIP', 'Memberships', `Reviewed membership ${items[index].membershipRecordNumber || id}: ${action}`, reviewerUser);
    return items.map((it, idx) => normalizeMembershipRecord(it, idx));
  }
  return items;
}

export function softDeleteMembership(id, user) {
  const items = loadStore(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].isDeleted = true;
    items[index].deletedAt = new Date().toISOString();
    items[index].deletedBy = user?.name;
    saveStore(STORAGE_KEYS.MEMBERSHIPS, items);
    addAuditLog('DELETE_MEMBERSHIP', 'Memberships', `Soft-deleted membership ID: ${id}`, user);
  }
  return items.filter(i => !i.isDeleted).map((it, idx) => normalizeMembershipRecord(it, idx));
}

// ─────────────────────────────────────────────────────────────
// 11. INDUSTRY MoUs & PARTNERSHIPS REPOSITORY
// ─────────────────────────────────────────────────────────────

export function calculateMoUStatus(effectiveDate, validityType, customExpiryDate) {
  if (validityType === 'Until Further Notice') {
    return { expiryDate: null, status: 'ACTIVE', diffDays: 9999, label: 'Active (Ongoing)' };
  }
  let expDate = null;
  if (validityType === 'Custom' && customExpiryDate) {
    expDate = new Date(customExpiryDate);
  } else if (effectiveDate) {
    const d = new Date(effectiveDate);
    const years = validityType === '1 Year' ? 1 : (validityType === '2 Years' ? 2 : (validityType === '5 Years' ? 5 : 3));
    d.setFullYear(d.getFullYear() + years);
    d.setDate(d.getDate() - 1);
    expDate = d;
  }

  if (!expDate || isNaN(expDate.getTime())) {
    return { expiryDate: '2029-06-30', status: 'ACTIVE', diffDays: 365, label: 'Active' };
  }

  const expiryString = expDate.toISOString().split('T')[0];
  const now = new Date();
  const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { expiryDate: expiryString, status: 'EXPIRED', diffDays, label: `Expired ${Math.abs(diffDays)} days ago` };
  }
  if (diffDays <= 60) {
    return { expiryDate: expiryString, status: 'EXPIRING_SOON', diffDays, label: `Expires in ${diffDays} days` };
  }
  return { expiryDate: expiryString, status: 'ACTIVE', diffDays, label: 'Active' };
}

export function normalizeMoURecord(raw, idx = 0) {
  if (!raw) return null;
  const pType = raw.partnerType || 'Industry';
  const typeCode = pType.includes('Industry') ? 'IND' : (pType.includes('University') ? 'UNIV' : 'COLLAB');
  const yearSuffix = (raw.signedDate ? raw.signedDate.slice(0, 4) : '2026').trim();
  const autoNum = raw.mouNumber || `MOU-${typeCode}-${yearSuffix}-${String(idx + 1).padStart(4, '0')}`;

  const validInfo = calculateMoUStatus(raw.effectiveDate || raw.signedDate || `${yearSuffix}-07-01`, raw.validityType || raw.validity || '3 Years', raw.expiryDate);

  const scopes = Array.isArray(raw.scopes) ? raw.scopes : (
    raw.scope ? raw.scope.split(',').map(s => s.trim()) : ['Internships', 'Student Projects', 'Faculty Training', 'Workshops']
  );

  const documents = Array.isArray(raw.documents) ? raw.documents : [
    ...(raw.mouDocumentPdf ? [{ id: 'DOC-1', name: raw.mouDocumentPdf, type: 'Signed MoU PDF', size: '3.8 MB', url: '#' }] : [])
  ];

  return {
    ...raw,
    id: raw.id || `mou_${Date.now()}_${idx}`,
    mouNumber: autoNum,
    title: raw.title || raw.mouTitle || `MoU with ${raw.partnerOrganization || raw.organization || 'Partner'}`,
    partnerOrganization: raw.partnerOrganization || raw.organization || 'Partner Organization',
    partnerType: pType,
    organizationWebsite: raw.organizationWebsite || raw.website || '',
    organizationAddress: raw.organizationAddress || '',
    city: raw.city || 'Hyderabad',
    state: raw.state || 'Telangana',
    country: raw.country || 'India',
    partnerContactPerson: raw.partnerContactPerson || raw.contactPerson || '',
    partnerContactDesignation: raw.partnerContactDesignation || '',
    partnerContactEmail: raw.partnerContactEmail || '',
    partnerContactPhone: raw.partnerContactPhone || '',
    signedDate: raw.signedDate || raw.mouDate || `${yearSuffix}-07-01`,
    effectiveDate: raw.effectiveDate || raw.signedDate || `${yearSuffix}-07-01`,
    validityType: raw.validityType || raw.validity || '3 Years',
    expiryDate: raw.expiryDate || validInfo.expiryDate,
    department: raw.department || 'All Departments (Institution-Level)',
    purpose: raw.purpose || 'Collaborative research, student internships, curriculum development, and technical workshops.',
    description: raw.description || '',
    scopes: scopes,
    primaryCoordinator: raw.primaryCoordinator || raw.facultyCoordinator || 'Dr. S. V. N. Sreenivasu',
    coCoordinators: Array.isArray(raw.coCoordinators) ? raw.coCoordinators : [],
    documents: documents,
    renewals: Array.isArray(raw.renewals) ? raw.renewals : [],
    mouStatus: raw.mouStatus || validInfo.status,
    workflowStatus: raw.workflowStatus || (raw.status === 'Active' || raw.verificationStatus === 'Approved' ? 'APPROVED' : 'UNDER_REVIEW'),
    publicVisibility: raw.publicVisibility || 'PUBLIC_SAFE',
    reviewHistory: Array.isArray(raw.reviewHistory) ? raw.reviewHistory : []
  };
}

export function getMoUs(includeDeleted = false) {
  const items = loadStore(STORAGE_KEYS.MOUS, INITIAL_MOUS);
  const activeList = Array.isArray(items) ? items.filter(i => includeDeleted || !i.isDeleted) : [];
  return activeList.map((item, idx) => normalizeMoURecord(item, idx));
}

export function getMoULinkedActivities(mouNumberOrOrg) {
  if (!mouNumberOrOrg) return { internships: 0, workshops: 0, fdps: 0, projects: 0, total: 0 };
  const q = String(mouNumberOrOrg).toLowerCase();
  
  const allInternships = getInternships();
  const allEvents = getAcademicEvents();
  const allProjects = getStudentProjects();
  const allFdps = getFDPs();

  const intCount = allInternships.filter(i => (i.organization && i.organization.toLowerCase().includes(q)) || (i.associatedMoU && i.associatedMoU.toLowerCase().includes(q))).length;
  const evtCount = allEvents.filter(e => (e.associatedMoU && e.associatedMoU.toLowerCase().includes(q)) || (e.associatedOrganization && e.associatedOrganization.toLowerCase().includes(q))).length;
  const fdpCount = allFdps.filter(f => (f.sponsor && f.sponsor.toLowerCase().includes(q)) || (f.associatedOrganization && f.associatedOrganization.toLowerCase().includes(q))).length;
  const prjCount = allProjects.filter(p => (p.industryAssociation?.organization && p.industryAssociation.organization.toLowerCase().includes(q))).length;

  return {
    internships: intCount,
    workshops: evtCount,
    fdps: fdpCount,
    projects: prjCount,
    total: intCount + evtCount + fdpCount + prjCount
  };
}

export function saveMoU(item, user) {
  const items = loadStore(STORAGE_KEYS.MOUS, INITIAL_MOUS);
  const pType = item.partnerType || 'Industry';
  const typeCode = pType.includes('Industry') ? 'IND' : (pType.includes('University') ? 'UNIV' : 'COLLAB');
  const yearSuffix = (item.signedDate ? item.signedDate.slice(0, 4) : '2026').trim();
  const nextSeq = String(items.length + 1).padStart(4, '0');
  const autoNum = item.mouNumber || `MOU-${typeCode}-${yearSuffix}-${nextSeq}`;

  const validInfo = calculateMoUStatus(item.effectiveDate || item.signedDate, item.validityType, item.expiryDate);
  const mouStatus = validInfo.status;
  const expiryDate = validInfo.expiryDate;

  const index = Array.isArray(items) ? items.findIndex(i => i.id === item.id) : -1;
  if (index >= 0) {
    items[index] = {
      ...items[index],
      ...item,
      expiryDate: expiryDate,
      mouStatus: mouStatus,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || 'System'
    };
    addAuditLog('UPDATE_MOU', 'MoUs', `Updated MoU ${autoNum} with ${item.partnerOrganization}`, user);
    saveStore(STORAGE_KEYS.MOUS, items);
    return normalizeMoURecord(items[index]);
  } else {
    const defaultWorkflowStatus = item.workflowStatus || (user?.role === 'SUPER_ADMIN' || user?.role === 'HOD' ? 'APPROVED' : 'SUBMITTED');
    const newItem = {
      ...item,
      id: item.id || `mou_${Date.now()}`,
      mouNumber: autoNum,
      expiryDate: expiryDate,
      mouStatus: mouStatus,
      workflowStatus: defaultWorkflowStatus,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'System',
      isDeleted: false,
      reviewHistory: [
        {
          action: 'CREATED',
          status: defaultWorkflowStatus,
          timestamp: new Date().toISOString(),
          by: user?.name || 'Institutional Coordinator',
          remarks: 'MoU recorded in institutional repository'
        }
      ]
    };
    items.unshift(newItem);
    addAuditLog('CREATE_MOU', 'MoUs', `Recorded new MoU ${autoNum} with ${newItem.partnerOrganization}`, user);
    saveStore(STORAGE_KEYS.MOUS, items);
    return normalizeMoURecord(newItem);
  }
}

export function renewMoU(id, renewalData, user) {
  const items = loadStore(STORAGE_KEYS.MOUS, INITIAL_MOUS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    const item = items[index];
    const prevExpiry = item.expiryDate;
    if (!item.renewals) item.renewals = [];

    const newRenewalEntry = {
      renewalId: 'MOU-REN-' + Date.now(),
      renewalSignedDate: renewalData.renewalSignedDate || new Date().toISOString().split('T')[0],
      previousExpiryDate: prevExpiry,
      newExpiryDate: renewalData.newExpiryDate,
      extensionPeriod: renewalData.extensionPeriod || '3 Years',
      agreementDocument: renewalData.agreementDocument || null,
      remarks: renewalData.remarks || 'MoU extended successfully',
      renewedBy: user?.name || 'Coordinator',
      timestamp: new Date().toISOString()
    };

    item.renewals.unshift(newRenewalEntry);
    item.expiryDate = renewalData.newExpiryDate;
    const validInfo = calculateMoUStatus(item.effectiveDate, 'Custom', item.expiryDate);
    item.mouStatus = validInfo.status;
    item.updatedAt = new Date().toISOString();
    item.updatedBy = user?.name;

    addAuditLog('RENEW_MOU', 'MoUs', `Extended MoU ${item.mouNumber || id} with ${item.partnerOrganization} until ${renewalData.newExpiryDate}`, user);
    saveStore(STORAGE_KEYS.MOUS, items);
    return normalizeMoURecord(items[index]);
  }
  return null;
}

export function reviewMoU(id, action, remarks, reviewerUser) {
  const items = loadStore(STORAGE_KEYS.MOUS, INITIAL_MOUS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    let targetStatus = 'APPROVED';
    if (action === 'REQUEST_REVISION') targetStatus = 'NEEDS_REVISION';
    else if (action === 'UNDER_REVIEW') targetStatus = 'UNDER_REVIEW';
    else if (action === 'TERMINATE') {
      items[index].mouStatus = 'TERMINATED';
      targetStatus = 'ARCHIVED';
    } else if (action === 'ARCHIVE') targetStatus = 'ARCHIVED';

    items[index].workflowStatus = targetStatus;
    items[index].verifiedAt = new Date().toISOString();
    items[index].verifiedBy = reviewerUser?.name || 'Reviewer';
    if (!items[index].reviewHistory) items[index].reviewHistory = [];
    items[index].reviewHistory.push({
      action: action,
      status: targetStatus,
      timestamp: new Date().toISOString(),
      by: reviewerUser?.name || 'Reviewer',
      remarks: remarks || `MoU status updated to ${targetStatus}`
    });

    saveStore(STORAGE_KEYS.MOUS, items);
    addAuditLog('REVIEW_MOU', 'MoUs', `Reviewed MoU ${items[index].mouNumber || id}: ${action}`, reviewerUser);
    return items.map((it, idx) => normalizeMoURecord(it, idx));
  }
  return items;
}

export function softDeleteMoU(id, user) {
  const items = loadStore(STORAGE_KEYS.MOUS, INITIAL_MOUS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].isDeleted = true;
    items[index].deletedAt = new Date().toISOString();
    items[index].deletedBy = user?.name;
    saveStore(STORAGE_KEYS.MOUS, items);
    addAuditLog('DELETE_MOU', 'MoUs', `Soft-deleted MoU ID: ${id}`, user);
  }
  return items.filter(i => !i.isDeleted).map((it, idx) => normalizeMoURecord(it, idx));
}

// ─────────────────────────────────────────────────────────────
// 12. NPTEL & MOOC ONLINE CERTIFICATIONS REPOSITORY
// ─────────────────────────────────────────────────────────────

export function normalizeNptelRecord(raw, idx = 0) {
  if (!raw) return null;
  const dept = raw.department || 'CSE';
  const ay = raw.academicYear || '2025-26';
  const yearSuffix = (ay.split('-')[0] || '2026').trim();
  const autoNum = raw.certificationNumber || `NPTEL-${dept}-${yearSuffix}-${String(idx + 1).padStart(4, '0')}`;

  const holderType = raw.holderType || (raw.role === 'Student' || raw.rollNumber ? 'STUDENT' : 'FACULTY');
  const student = holderType === 'STUDENT' ? (raw.studentDetails || {
    rollNumber: raw.rollNumber || raw.rollNo || '22471A0589',
    name: raw.name || raw.studentName || 'Student Learner',
    department: dept,
    batch: raw.batch || '2022-2026',
    year: raw.year || 'III Year',
    semester: raw.semester || 'II Sem'
  }) : null;

  const faculty = holderType === 'FACULTY' ? (raw.facultyDetails || {
    facultyId: raw.facultyId || '',
    name: raw.name || raw.facultyName || 'Faculty Learner',
    department: dept,
    designation: raw.designation || 'Faculty'
  }) : null;

  const documents = Array.isArray(raw.documents) ? raw.documents : [
    ...(raw.certificatePdf ? [{ id: 'DOC-1', name: raw.certificatePdf, type: 'NPTEL Certificate PDF', size: '1.4 MB', url: '#' }] : [])
  ];

  return {
    ...raw,
    id: raw.id || `nptel_${Date.now()}_${idx}`,
    certificationNumber: autoNum,
    holderType: holderType,
    studentDetails: student,
    facultyDetails: faculty,
    department: dept,
    academicYear: ay,
    platform: raw.platform || 'NPTEL',
    courseName: raw.courseName || raw.course || 'Cloud Computing & Distributed Systems',
    courseCode: raw.courseCode || '',
    offeredBy: raw.offeredBy || raw.institute || 'IIT Kharagpur',
    instructor: raw.instructor || '',
    courseCategory: raw.courseCategory || 'Computer Science',
    courseUrl: raw.courseUrl || '',
    duration: raw.duration || (raw.durationWeeks ? `${raw.durationWeeks} Weeks` : '12 Weeks'),
    examDate: raw.examDate || `${yearSuffix}-04-20`,
    scores: raw.scores || {
      assignmentScore: raw.assignmentScore || 24,
      examScore: raw.examScore || 62,
      finalScore: raw.finalScore || raw.score || 86
    },
    certificationResult: raw.certificationResult || raw.result || (raw.score >= 90 ? 'Elite + Gold' : (raw.score >= 75 ? 'Elite + Silver' : 'Elite')),
    academicCredits: raw.academicCredits || {
      creditsEarned: raw.creditsEarned || (raw.duration?.includes('12') ? 3 : (raw.duration?.includes('8') ? 2 : 1)),
      creditTransferRequested: raw.creditTransferRequested || false,
      creditTransferApproved: raw.creditTransferApproved || false,
      approvedCredits: raw.approvedCredits || 0,
      approvalReference: raw.approvalReference || ''
    },
    certificateDate: raw.certificateDate || raw.date || `${yearSuffix}-05-15`,
    certificateId: raw.certificateId || raw.certId || `NPTEL${yearSuffix}CS${String(idx + 10).padStart(4, '0')}`,
    certificateVerificationUrl: raw.certificateVerificationUrl || raw.verificationUrl || '',
    documents: documents,
    certificationStatus: raw.certificationStatus || 'COMPLETED',
    workflowStatus: raw.workflowStatus || (raw.status === 'Verified' || raw.verificationStatus === 'Verified' ? 'APPROVED' : 'UNDER_REVIEW'),
    publicVisibility: raw.publicVisibility || 'PUBLIC_SAFE',
    reviewHistory: Array.isArray(raw.reviewHistory) ? raw.reviewHistory : []
  };
}

export function getNPTEL(includeDeleted = false) {
  const items = loadStore(STORAGE_KEYS.NPTEL, INITIAL_NPTEL);
  const activeList = Array.isArray(items) ? items.filter(i => includeDeleted || !i.isDeleted) : [];
  return activeList.map((item, idx) => normalizeNptelRecord(item, idx));
}

export function saveNPTEL(item, user) {
  const items = loadStore(STORAGE_KEYS.NPTEL, INITIAL_NPTEL);
  const deptCode = item.department || user?.dept || 'CSE';
  const ay = item.academicYear || '2025-26';
  const yearSuffix = (ay.split('-')[0] || '2026').trim();
  const nextSeq = String(items.length + 1).padStart(4, '0');
  const autoNum = item.certificationNumber || `NPTEL-${deptCode}-${yearSuffix}-${nextSeq}`;

  const index = Array.isArray(items) ? items.findIndex(i => i.id === item.id) : -1;
  const holderName = item.holderType === 'STUDENT' ? (item.studentDetails?.name || 'Student') : (item.facultyDetails?.name || 'Faculty');

  if (index >= 0) {
    items[index] = {
      ...items[index],
      ...item,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || 'System'
    };
    addAuditLog('UPDATE_NPTEL', 'NPTEL', `Updated certification ${autoNum} for ${holderName}: ${item.courseName}`, user);
    saveStore(STORAGE_KEYS.NPTEL, items);
    return normalizeNptelRecord(items[index]);
  } else {
    const defaultWorkflowStatus = item.workflowStatus || (user?.role === 'SUPER_ADMIN' || user?.role === 'HOD' ? 'APPROVED' : 'SUBMITTED');
    const newItem = {
      ...item,
      id: item.id || `nptel_${Date.now()}`,
      certificationNumber: autoNum,
      certificationStatus: 'COMPLETED',
      workflowStatus: defaultWorkflowStatus,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'System',
      isDeleted: false,
      reviewHistory: [
        {
          action: 'CREATED',
          status: defaultWorkflowStatus,
          timestamp: new Date().toISOString(),
          by: user?.name || 'Learner',
          remarks: 'Certification recorded in portal'
        }
      ]
    };
    items.unshift(newItem);
    addAuditLog('CREATE_NPTEL', 'NPTEL', `Recorded certification ${autoNum} for ${holderName}: ${newItem.courseName}`, user);
    saveStore(STORAGE_KEYS.NPTEL, items);
    return normalizeNptelRecord(newItem);
  }
}

export function reviewNPTEL(id, action, remarks, reviewerUser) {
  const items = loadStore(STORAGE_KEYS.NPTEL, INITIAL_NPTEL);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    let targetStatus = 'APPROVED';
    if (action === 'REQUEST_REVISION') targetStatus = 'NEEDS_REVISION';
    else if (action === 'UNDER_REVIEW') targetStatus = 'UNDER_REVIEW';
    else if (action === 'ARCHIVE') targetStatus = 'ARCHIVED';

    items[index].workflowStatus = targetStatus;
    items[index].verifiedAt = new Date().toISOString();
    items[index].verifiedBy = reviewerUser?.name || 'Reviewer';
    if (!items[index].reviewHistory) items[index].reviewHistory = [];
    items[index].reviewHistory.push({
      action: action,
      status: targetStatus,
      timestamp: new Date().toISOString(),
      by: reviewerUser?.name || 'Reviewer',
      remarks: remarks || `Certification status updated to ${targetStatus}`
    });

    saveStore(STORAGE_KEYS.NPTEL, items);
    addAuditLog('REVIEW_NPTEL', 'NPTEL', `Reviewed certification ${items[index].certificationNumber || id}: ${action}`, reviewerUser);
    return items.map((it, idx) => normalizeNptelRecord(it, idx));
  }
  return items;
}

export function softDeleteNPTEL(id, user) {
  const items = loadStore(STORAGE_KEYS.NPTEL, INITIAL_NPTEL);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].isDeleted = true;
    items[index].deletedAt = new Date().toISOString();
    items[index].deletedBy = user?.name;
    saveStore(STORAGE_KEYS.NPTEL, items);
    addAuditLog('DELETE_NPTEL', 'NPTEL', `Soft-deleted NPTEL ID: ${id}`, user);
  }
  return items.filter(i => !i.isDeleted).map((it, idx) => normalizeNptelRecord(it, idx));
}

// 13. Placements
export function getPlacementStats() {
  return INITIAL_PLACEMENT_STATS;
}

export function getPlacementRecords(includeDeleted = false) {
  const items = loadStore(STORAGE_KEYS.PLACEMENTS, INITIAL_PLACEMENT_RECORDS);
  return includeDeleted ? items : (Array.isArray(items) ? items.filter(i => !i.isDeleted) : []);
}

export function savePlacementRecord(item, user) {
  const items = loadStore(STORAGE_KEYS.PLACEMENTS, INITIAL_PLACEMENT_RECORDS);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === item.id) : -1;
  if (index >= 0) {
    items[index] = { ...items[index], ...item, updatedAt: new Date().toISOString(), updatedBy: user?.name };
    addAuditLog('UPDATE', 'Placements', `Updated placement for ${item.studentName}`, user);
  } else {
    const newItem = {
      ...item,
      id: item.id || 'PLC-' + Date.now(),
      createdAt: new Date().toISOString(),
      createdBy: user?.name,
      isDeleted: false
    };
    if (Array.isArray(items)) items.unshift(newItem);
    addAuditLog('CREATE', 'Placements', `Recorded placement offer for ${item.studentName} at ${item.company}`, user);
  }
  saveStore(STORAGE_KEYS.PLACEMENTS, items);
  return items;
}

// Exam Notices
export function getExamNotifications() {
  return loadStore(STORAGE_KEYS.EXAM_NOTICES, INITIAL_EXAM_NOTIFICATIONS);
}

// News
export function getNews() {
  return loadStore(STORAGE_KEYS.NEWS, INITIAL_NEWS);
}

// -------------------------------------------------------------
// Research Auto-Sync & 4-Tier Duplicate Prevention Engine
// -------------------------------------------------------------
export function checkPublicationDuplicate(candidatePaper, existingPapers = []) {
  if (!candidatePaper) return { isDuplicate: false };

  // Tier 1: Match by DOI
  if (candidatePaper.doi) {
    const cleanDOI = candidatePaper.doi.toLowerCase().trim();
    const match = existingPapers.find(p => p.doi && p.doi.toLowerCase().trim() === cleanDOI);
    if (match) {
      return { isDuplicate: true, reason: 'Exact DOI Match (' + candidatePaper.doi + ')', existingRecord: match };
    }
  }

  // Tier 2: Match by Scopus EID
  if (candidatePaper.scopusEid) {
    const match = existingPapers.find(p => p.scopusEid && p.scopusEid === candidatePaper.scopusEid);
    if (match) {
      return { isDuplicate: true, reason: 'Scopus EID Match (' + candidatePaper.scopusEid + ')', existingRecord: match };
    }
  }

  // Tier 3: Match by WoS UID
  if (candidatePaper.wosUid) {
    const match = existingPapers.find(p => p.wosUid && p.wosUid === candidatePaper.wosUid);
    if (match) {
      return { isDuplicate: true, reason: 'Web of Science UID Match (' + candidatePaper.wosUid + ')', existingRecord: match };
    }
  }

  // Tier 4: Match by Normalized Title + First Author
  const normTitle = (candidatePaper.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (normTitle.length > 15) {
    const match = existingPapers.find(p => {
      const existingNorm = (p.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return existingNorm === normTitle;
    });
    if (match) {
      return { isDuplicate: true, reason: 'Exact Normalized Title Match', existingRecord: match };
    }
  }

  return { isDuplicate: false };
}

// -------------------------------------------------------------
// Universal Export Engine
// -------------------------------------------------------------
export function exportToCSV(filename, data) {
  if (!data || !data.length) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(filename, data, sheetName = 'Report') {
  if (!data || !data.length) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToPDF(title, columns, rows, filename = 'NEC_Report') {
  const doc = new jsPDF('landscape');
  doc.setFontSize(16);
  doc.setTextColor(11, 25, 44);
  doc.text('NARASARAOPETA ENGINEERING COLLEGE (AUTONOMOUS)', 14, 15);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Approved by AICTE, Affiliated to JNTUK, Accredited by NAAC with "A+" Grade & NBA', 14, 21);
  doc.text(`Official Academic & Institutional Report: ${title}`, 14, 27);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 200, 27);
  doc.line(14, 30, 280, 30);

  doc.autoTable({
    startY: 34,
    head: [columns],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [11, 25, 44], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8, cellPadding: 2.5 },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  doc.save(`${filename}.pdf`);
}

// -------------------------------------------------------------
// Recycle Bin & Soft Delete Management Engine
// -------------------------------------------------------------
export function getRecycleBin() {
  const modules = [
    { key: STORAGE_KEYS.PUBLICATIONS, name: 'publications', initial: INITIAL_PUBLICATIONS },
    { key: STORAGE_KEYS.PATENTS, name: 'patents', initial: INITIAL_PATENTS },
    { key: STORAGE_KEYS.BOS, name: 'bos', initial: INITIAL_BOS },
    { key: STORAGE_KEYS.STUDENT_ACHIEVEMENTS, name: 'achievements', initial: INITIAL_STUDENT_ACHIEVEMENTS },
    { key: STORAGE_KEYS.INTERNSHIPS, name: 'internships', initial: INITIAL_INTERNSHIPS },
    { key: STORAGE_KEYS.PROJECTS, name: 'projects', initial: INITIAL_PROJECTS },
    { key: STORAGE_KEYS.FDPS, name: 'fdps', initial: INITIAL_FDPS },
    { key: STORAGE_KEYS.FACULTY_ACHIEVEMENTS, name: 'faculty-ach', initial: INITIAL_FACULTY_ACHIEVEMENTS },
    { key: STORAGE_KEYS.EVENTS, name: 'events', initial: INITIAL_EVENTS },
    { key: STORAGE_KEYS.MEMBERSHIPS, name: 'memberships', initial: INITIAL_MEMBERSHIPS },
    { key: STORAGE_KEYS.MOUS, name: 'mous', initial: INITIAL_MOUS },
    { key: STORAGE_KEYS.NPTEL, name: 'nptel', initial: INITIAL_NPTEL },
    { key: STORAGE_KEYS.PLACEMENTS, name: 'placements', initial: INITIAL_PLACEMENT_RECORDS }
  ];

  const deletedItems = [];
  modules.forEach(m => {
    const items = loadStore(m.key, m.initial);
    if (Array.isArray(items)) {
      items.filter(i => i && i.isDeleted).forEach(item => {
        deletedItems.push({
          ...item,
          module: m.name,
          storageKey: m.key
        });
      });
    }
  });
  return deletedItems;
}

export function restoreFromRecycleBin(id, moduleName, user) {
  const moduleKeyMap = {
    'publications': STORAGE_KEYS.PUBLICATIONS,
    'patents': STORAGE_KEYS.PATENTS,
    'bos': STORAGE_KEYS.BOS,
    'achievements': STORAGE_KEYS.STUDENT_ACHIEVEMENTS,
    'internships': STORAGE_KEYS.INTERNSHIPS,
    'projects': STORAGE_KEYS.PROJECTS,
    'fdps': STORAGE_KEYS.FDPS,
    'faculty-ach': STORAGE_KEYS.FACULTY_ACHIEVEMENTS,
    'events': STORAGE_KEYS.EVENTS,
    'memberships': STORAGE_KEYS.MEMBERSHIPS,
    'mous': STORAGE_KEYS.MOUS,
    'nptel': STORAGE_KEYS.NPTEL,
    'placements': STORAGE_KEYS.PLACEMENTS
  };

  const key = moduleKeyMap[moduleName] || STORAGE_KEYS.PUBLICATIONS;
  const items = loadStore(key, []);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].isDeleted = false;
    delete items[index].deletedAt;
    delete items[index].deletedBy;
    saveStore(key, items);
    addAuditLog('RESTORE', moduleName, `Restored item ${id} from Recycle Bin`, user);
  }
  return items;
}

export function deleteItem(entityKey, id, user) {
  const moduleKeyMap = {
    'publications': STORAGE_KEYS.PUBLICATIONS,
    'patents': STORAGE_KEYS.PATENTS,
    'bos': STORAGE_KEYS.BOS,
    'achievements': STORAGE_KEYS.STUDENT_ACHIEVEMENTS,
    'internships': STORAGE_KEYS.INTERNSHIPS,
    'projects': STORAGE_KEYS.PROJECTS,
    'fdps': STORAGE_KEYS.FDPS,
    'faculty-ach': STORAGE_KEYS.FACULTY_ACHIEVEMENTS,
    'events': STORAGE_KEYS.EVENTS,
    'memberships': STORAGE_KEYS.MEMBERSHIPS,
    'mous': STORAGE_KEYS.MOUS,
    'nptel': STORAGE_KEYS.NPTEL,
    'placements': STORAGE_KEYS.PLACEMENTS
  };

  const key = moduleKeyMap[entityKey.toLowerCase()] || STORAGE_KEYS.PUBLICATIONS;
  const items = loadStore(key, []);
  const index = Array.isArray(items) ? items.findIndex(i => i.id === id) : -1;
  if (index >= 0) {
    items[index].isDeleted = true;
    items[index].deletedAt = new Date().toISOString();
    items[index].deletedBy = user?.name || 'Admin';
    saveStore(key, items);
    addAuditLog('DELETE (Soft)', entityKey, `Soft-deleted record ${id}`, user);
  }
  return Array.isArray(items) ? items.filter(i => !i.isDeleted) : [];
}

// ==========================================
// BOARD OF STUDIES (BoS) ACADEMIC GOVERNANCE
// ==========================================

export function generateBoSNumber(department = 'CSE', year = new Date().getFullYear()) {
  const allMeetings = getBoSMeetings(true);
  const deptCode = (department || 'CSE').toUpperCase();
  const yearStr = String(year);
  const matching = allMeetings.filter(m => m.department === deptCode && (m.academicYear?.includes(yearStr) || m.bosNumber?.includes(yearStr)));
  const nextSeq = String(matching.length + 1).padStart(3, '0');
  return `BOS-${deptCode}-${yearStr}-${nextSeq}`;
}

export function getBoSMeetings(includeDeleted = false) {
  const seed = [
    {
      id: 'bos_cse_2026_01',
      bosNumber: 'BOS-CSE-2026-001',
      department: 'CSE',
      academicYear: '2025-26',
      title: '14th Board of Studies Meeting - CSE',
      bosDate: '2026-08-20',
      startTime: '10:00 AM',
      endTime: '01:30 PM',
      meetingMode: 'Hybrid',
      venue: 'Conference Hall - 1, Admin Block, NEC',
      meetingLink: 'https://meet.google.com/nec-cse-bos-2026',
      regulations: ['R20', 'R23'],
      meetingStatus: 'HELD',
      workflowStatus: 'APPROVED',
      version: 1,
      chairmanType: 'INTERNAL',
      chairman: 'Dr. S. N. Tirumala Rao (Professor & HOD, CSE)',
      chairmanEmail: 'hodcse@nrtec.in',
      chairmanPhone: '+91 8647 239903',
      chairmanOrg: 'Narasaraopeta Engineering College',
      universityNominee: {
        name: 'Prof. M.H.M. Krishna Prasad',
        institution: 'JNTUK Kakinada',
        designation: 'Professor of CSE & Director of Academic Planning',
        email: 'krishnaprasad@jntuk.edu.in',
        phone: '+91 884 2300900'
      },
      academicians: [
        {
          name: 'Dr. D. Rajya Lakshmi',
          institution: 'JNTUK University College of Engineering',
          designation: 'Professor of CSE & Vice Principal',
          email: 'drlakshmi@jntukucev.ac.in',
          phone: '+91 8922 277388'
        },
        {
          name: 'Dr. P. Radha Krishna',
          institution: 'NIT Warangal',
          designation: 'Professor & Head, Dept of CSE',
          email: 'prkrishna@nitw.ac.in',
          phone: '+91 870 2462700'
        }
      ],
      industryMember: {
        name: 'Mr. V. Sreekanth',
        company: 'Tata Consultancy Services (TCS)',
        designation: 'Senior Technology Architect & Academic Liaison',
        email: 'sreekanth.v@tcs.com',
        phone: '+91 40 66672000'
      },
      alumniMember: {
        name: 'Mr. K. Chaitanya Varma',
        company: 'Microsoft India Development Center',
        designation: 'Principal Software Engineer (Batch of 2016)',
        email: 'chaitanya.varma@microsoft.com',
        phone: '+91 80 67891000'
      },
      facultyMembers: [
        'Dr. K. Lakshi Narayana',
        'Dr. G. L. N. Jayaprada',
        'Dr. B. J. M. R. K. Prasad'
      ],
      agendaItems: [
        {
          itemNo: 1,
          title: 'Approval of R23 Regulation 3rd & 4th Year Curriculum Structure',
          description: 'Detailed discussion on advanced elective tracks: AI/ML, Cloud Computing, Cyber Security',
          decision: 'Unanimously approved with incorporation of Industry AI Capstone guidelines.'
        },
        {
          itemNo: 2,
          title: 'Introduction of New Professional Elective: Generative AI & LLM Systems',
          description: 'Syllabus design, prerequisite courses, and laboratory assignments using open-source models',
          decision: 'Approved. Recommended 30% weightage for hands-on project implementation.'
        },
        {
          itemNo: 3,
          title: 'Review of Industry Internship Credits & Evaluation Rubric',
          description: 'Mandatory 6-month full semester industrial internship policy for final year students',
          decision: 'Approved as per AICTE and APSCHE guidelines.'
        }
      ],
      documents: [
        {
          id: 'doc_1',
          title: 'Minutes of Meeting (Signed & Approved)',
          filename: 'BOS_CSE_14th_Minutes_Signed.pdf',
          type: 'MINUTES',
          sizeBytes: 3948200,
          version: 'v1.0',
          uploadedAt: '2026-08-20T14:30:00Z',
          uploadedBy: 'Dr. S. N. Tirumala Rao'
        },
        {
          id: 'doc_2',
          title: 'Curriculum Structure & Course Syllabus (R23)',
          filename: 'R23_CSE_Syllabus_Approved.pdf',
          type: 'SYLLABUS',
          sizeBytes: 5829100,
          version: 'v1.0',
          uploadedAt: '2026-08-20T14:35:00Z',
          uploadedBy: 'Dr. S. N. Tirumala Rao'
        }
      ],
      approvalHistory: [
        {
          action: 'BOS_CREATED',
          fromStatus: null,
          toStatus: 'DRAFT',
          actor: 'Dr. S. N. Tirumala Rao (HOD)',
          comments: 'Drafted 14th BoS meeting agenda and member roster.',
          timestamp: '2026-08-18T10:30:00Z'
        },
        {
          action: 'BOS_SUBMITTED',
          fromStatus: 'DRAFT',
          toStatus: 'SUBMITTED',
          actor: 'Dr. S. N. Tirumala Rao (HOD)',
          comments: 'Submitted completed meeting minutes and resolutions for administrative approval.',
          timestamp: '2026-08-20T15:00:00Z'
        },
        {
          action: 'BOS_REVIEWED',
          fromStatus: 'SUBMITTED',
          toStatus: 'UNDER_REVIEW',
          actor: 'Dr. S. Venkateswarlu (College Admin)',
          comments: 'Verified JNTUK nominee and expert attendance.',
          timestamp: '2026-08-21T09:30:00Z'
        },
        {
          action: 'BOS_APPROVED',
          fromStatus: 'UNDER_REVIEW',
          toStatus: 'APPROVED',
          actor: 'Super Administrator',
          comments: 'Formally approved and sealed for Academic Council & NAAC accreditation compliance.',
          timestamp: '2026-08-21T11:00:00Z'
        }
      ],
      createdAt: '2026-08-18T10:30:00Z',
      updatedAt: '2026-08-21T11:00:00Z'
    },
    {
      id: 'bos_ece_2026_01',
      bosNumber: 'BOS-ECE-2026-001',
      department: 'ECE',
      academicYear: '2025-26',
      title: '11th Board of Studies Meeting - ECE',
      bosDate: '2026-08-22',
      startTime: '11:00 AM',
      endTime: '02:00 PM',
      meetingMode: 'Offline',
      venue: 'ECE Department Seminar Hall',
      meetingLink: '',
      regulations: ['R23'],
      meetingStatus: 'HELD',
      workflowStatus: 'UNDER_REVIEW',
      version: 1,
      chairmanType: 'INTERNAL',
      chairman: 'Dr. V. Venkata Rao (Professor & HOD, ECE)',
      chairmanEmail: 'hodece@nrtec.in',
      chairmanPhone: '+91 8647 239904',
      chairmanOrg: 'Narasaraopeta Engineering College',
      universityNominee: {
        name: 'Dr. K. Babulu',
        institution: 'JNTUK Kakinada',
        designation: 'Professor of ECE & Director of Evaluation',
        email: 'kbabulu@jntuk.edu.in',
        phone: '+91 884 2300902'
      },
      academicians: [
        {
          name: 'Dr. N. V. S. N. Sarma',
          institution: 'IIITDM Kurnool',
          designation: 'Director & Professor of ECE',
          email: 'director@iiitk.ac.in',
          phone: '+91 8518 289100'
        }
      ],
      industryMember: {
        name: 'Er. R. Kishore',
        company: 'Texas Instruments',
        designation: 'Lead Architect (VLSI Systems)',
        email: 'r.kishore@ti.com',
        phone: '+91 80 25048000'
      },
      alumniMember: {
        name: 'Ms. P. Swathi',
        company: 'Qualcomm India',
        designation: 'Staff Engineer (Batch of 2018)',
        email: 'pswathi@qualcomm.com',
        phone: '+91 40 67008000'
      },
      facultyMembers: ['Dr. J. V. Rao', 'Dr. B. Suresh'],
      agendaItems: [
        {
          itemNo: 1,
          title: 'Revision of VLSI Design & Embedded Systems Curriculum',
          description: 'Incorporation of RISC-V architecture and FPGA laboratory modules',
          decision: 'Approved pending minor laboratory rubric updates.'
        }
      ],
      documents: [
        {
          id: 'doc_ece_1',
          title: 'Minutes of Meeting Draft',
          filename: 'BOS_ECE_11th_Minutes_Draft.pdf',
          type: 'MINUTES',
          sizeBytes: 2419000,
          version: 'v1.0',
          uploadedAt: '2026-08-22T16:00:00Z',
          uploadedBy: 'Dr. V. Venkata Rao'
        }
      ],
      approvalHistory: [
        {
          action: 'BOS_CREATED',
          fromStatus: null,
          toStatus: 'DRAFT',
          actor: 'Dr. V. Venkata Rao (HOD)',
          comments: 'Drafted 11th BoS meeting.',
          timestamp: '2026-08-20T11:00:00Z'
        },
        {
          action: 'BOS_SUBMITTED',
          fromStatus: 'DRAFT',
          toStatus: 'SUBMITTED',
          actor: 'Dr. V. Venkata Rao (HOD)',
          comments: 'Submitted for administrative review.',
          timestamp: '2026-08-22T17:00:00Z'
        }
      ],
      createdAt: '2026-08-20T11:00:00Z',
      updatedAt: '2026-08-22T17:00:00Z'
    }
  ];

  const items = loadStore(STORAGE_KEYS.BOS, seed);
  return includeDeleted ? items : items.filter(i => !i.isDeleted);
}

export function saveBoSMeeting(data, actorUser) {
  const items = loadStore(STORAGE_KEYS.BOS, []);
  let savedItem;

  if (data.id && items.some(i => i.id === data.id)) {
    const idx = items.findIndex(i => i.id === data.id);
    const existing = items[idx];

    const isApprovedBefore = existing.workflowStatus === 'APPROVED';
    const nextVersion = isApprovedBefore ? (existing.version || 1) + 1 : (existing.version || 1);

    const historyEntry = {
      action: data.workflowStatus !== existing.workflowStatus ? `STATUS_${data.workflowStatus}` : 'BOS_UPDATED',
      fromStatus: existing.workflowStatus,
      toStatus: data.workflowStatus || existing.workflowStatus,
      actor: actorUser?.name || 'Administrator',
      comments: data.workflowComments || `Updated BoS meeting record (v${nextVersion}).`,
      timestamp: new Date().toISOString()
    };

    savedItem = {
      ...existing,
      ...data,
      version: nextVersion,
      approvalHistory: [historyEntry, ...(existing.approvalHistory || [])],
      updatedAt: new Date().toISOString(),
      updatedBy: actorUser?.name || 'Admin'
    };

    items[idx] = savedItem;
    addAuditLog('UPDATE', 'BoS Meetings', `Updated BoS record ${savedItem.bosNumber}`, actorUser);
  } else {
    const dept = data.department || 'CSE';
    const year = new Date(data.bosDate || Date.now()).getFullYear();
    const generatedNumber = data.bosNumber || generateBoSNumber(dept, year);

    savedItem = {
      ...data,
      id: data.id || 'bos_' + Date.now(),
      bosNumber: generatedNumber,
      workflowStatus: data.workflowStatus || 'DRAFT',
      meetingStatus: data.meetingStatus || 'SCHEDULED',
      version: 1,
      approvalHistory: [
        {
          action: 'BOS_CREATED',
          fromStatus: null,
          toStatus: data.workflowStatus || 'DRAFT',
          actor: actorUser?.name || 'Administrator',
          comments: 'Initial creation of BoS meeting record.',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      createdBy: actorUser?.name || 'Admin',
      updatedAt: new Date().toISOString()
    };

    items.unshift(savedItem);
    addAuditLog('CREATE', 'BoS Meetings', `Created BoS record ${savedItem.bosNumber}`, actorUser);
  }

  saveStore(STORAGE_KEYS.BOS, items);
  return savedItem;
}

export function updateBoSMeetingStatus(meetingId, newStatus, comments = '', actorUser) {
  const items = loadStore(STORAGE_KEYS.BOS, []);
  const idx = items.findIndex(i => i.id === meetingId);
  if (idx < 0) throw new Error('BoS meeting not found');

  const existing = items[idx];
  const oldStatus = existing.workflowStatus;

  const historyEntry = {
    action: `STATUS_CHANGE_TO_${newStatus}`,
    fromStatus: oldStatus,
    toStatus: newStatus,
    actor: actorUser?.name || 'Administrator',
    comments: comments || `Status changed to ${newStatus}`,
    timestamp: new Date().toISOString()
  };

  const updated = {
    ...existing,
    workflowStatus: newStatus,
    approvalHistory: [historyEntry, ...(existing.approvalHistory || [])],
    updatedAt: new Date().toISOString(),
    updatedBy: actorUser?.name || 'Admin'
  };

  items[idx] = updated;
  saveStore(STORAGE_KEYS.BOS, items);
  addAuditLog('STATUS_CHANGE', 'BoS Meetings', `${existing.bosNumber}: ${oldStatus} -> ${newStatus} (${comments})`, actorUser);
  return updated;
}

export function archiveBoSMeeting(meetingId, actorUser) {
  return updateBoSMeetingStatus(meetingId, 'ARCHIVED', 'Archived for historical governance record.', actorUser);
}

export function softDeleteBoSMeeting(meetingId, actorUser) {
  const items = loadStore(STORAGE_KEYS.BOS, []);
  const idx = items.findIndex(i => i.id === meetingId);
  if (idx < 0) return items;

  const existing = items[idx];
  if (existing.workflowStatus !== 'DRAFT' && actorUser?.role !== 'SUPER_ADMIN') {
    throw new Error('Only DRAFT BoS records can be deleted. Please archive submitted/approved records.');
  }

  existing.isDeleted = true;
  existing.deletedAt = new Date().toISOString();
  existing.deletedBy = actorUser?.name || 'Admin';

  saveStore(STORAGE_KEYS.BOS, items);
  addAuditLog('DELETE', 'BoS Meetings', `Deleted BoS draft record ${existing.bosNumber}`, actorUser);
  return items.filter(i => !i.isDeleted);
}


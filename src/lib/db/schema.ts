import { 
  pgTable, 
  uuid, 
  text, 
  boolean, 
  integer, 
  timestamp, 
  pgEnum, 
  primaryKey,
  jsonb
} from 'drizzle-orm/pg-core';

// 1. Status Enums
export const portalUserStatusEnum = pgEnum('portal_user_status', [
  'PENDING_SETUP',
  'ACTIVE',
  'SUSPENDED',
  'LOCKED',
  'PASSWORD_RESET_REQUIRED',
  'ARCHIVED'
]);

export const portalSessionStateEnum = pgEnum('portal_session_state', [
  'PENDING_OTP',
  'VERIFIED',
  'REVOKED',
  'EXPIRED'
]);

export const otpStateEnum = pgEnum('otp_state', [
  'ACTIVE',
  'VERIFIED',
  'EXPIRED',
  'LOCKED',
  'SUPERSEDED'
]);

// 2. Roles & Permissions Tables
export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(), // 'SUPER_ADMIN', 'ADMIN', 'HOD', 'FACULTY', 'DATA_ENTRY', 'AUDITOR'
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const permissions = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(), // 'bos.view', 'bos.create', 'users.manage', etc.
  name: text('name').notNull(),
  category: text('category').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const rolePermissions = pgTable('role_permissions', {
  roleId: uuid('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: uuid('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' })
}, (t) => ({
  pk: primaryKey({ columns: [t.roleId, t.permissionId] })
}));

// 3. Departments Table
export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(), // 'CSE', 'ECE', 'IT', etc.
  name: text('name').notNull(),
  established: text('established'),
  hodName: text('hod_name'),
  intake: text('intake'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 4. Portal Users Table (Core Identity - Supabase PostgreSQL)
export const portalUsers = pgTable('portal_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').unique(),
  passwordHash: text('password_hash'), // Argon2id hash only
  firebaseUid: text('firebase_uid').unique(), // Linked on first verified Google sign-in
  fullName: text('full_name').notNull(),
  departmentCode: text('department_code'),
  designation: text('designation'),
  phone: text('phone'),
  photoUrl: text('photo_url'),
  
  status: portalUserStatusEnum('status').default('PENDING_SETUP').notNull(),
  
  allowPassword: boolean('allow_password').default(true).notNull(),
  allowGoogle: boolean('allow_google').default(true).notNull(),
  requireOtp: boolean('require_otp').default(true).notNull(),
  forcePasswordChange: boolean('force_password_change').default(false).notNull(),
  
  failedLoginCount: integer('failed_login_count').default(0).notNull(),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  
  createdBy: uuid('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  archivedAt: timestamp('archived_at', { withTimezone: true })
});

export const userRoles = pgTable('user_roles', {
  userId: uuid('user_id').notNull().references(() => portalUsers.id, { onDelete: 'cascade' }),
  roleId: uuid('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' })
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.roleId] })
}));

// 5. DB-Backed Cryptographic Sessions Table
export const portalSessions = pgTable('portal_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => portalUsers.id, { onDelete: 'cascade' }),
  tokenDigest: text('token_digest').notNull().unique(), // HMAC-SHA256 of session token
  authMethod: text('auth_method').notNull(), // 'PASSWORD' | 'GOOGLE'
  state: portalSessionStateEnum('state').default('PENDING_OTP').notNull(),
  rememberDevice: boolean('remember_device').default(false).notNull(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  otpVerifiedAt: timestamp('otp_verified_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true })
});

// 6. Cryptographic OTP Challenges Table
export const otpChallenges = pgTable('otp_challenges', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => portalUsers.id, { onDelete: 'cascade' }),
  sessionId: uuid('session_id').notNull().references(() => portalSessions.id, { onDelete: 'cascade' }),
  otpDigest: text('otp_digest').notNull(), // HMAC(OTP_HMAC_SECRET, challengeId + ':' + otp)
  state: otpStateEnum('state').default('ACTIVE').notNull(),
  attempts: integer('attempts').default(0).notNull(),
  maxAttempts: integer('max_attempts').default(5).notNull(),
  resendCount: integer('resend_count').default(0).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  lastSentAt: timestamp('last_sent_at', { withTimezone: true }).defaultNow().notNull(),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  consumedAt: timestamp('consumed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 7. Password Setup & Reset Tokens
export const passwordSetupTokens = pgTable('password_setup_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => portalUsers.id, { onDelete: 'cascade' }),
  tokenDigest: text('token_digest').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => portalUsers.id, { onDelete: 'cascade' }),
  tokenDigest: text('token_digest').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 8. Immutable Security & Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  action: text('action').notNull(), // 'LOGIN_SUCCESS', 'PASSWORD_CHANGED', 'BOS_APPROVED', etc.
  module: text('module').notNull(),
  details: text('details').notNull(),
  actorId: uuid('actor_id'),
  actorName: text('actor_name'),
  actorEmail: text('actor_email'),
  ipAddress: text('ip_address'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 9. Board of Studies (BoS) Meetings Table
export const bosMeetings = pgTable('bos_meetings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bosNo: text('bos_no').notNull().unique(),
  departmentCode: text('department_code').notNull(),
  regulation: text('regulation').notNull(),
  bosDate: text('bos_date').notNull(),
  startTime: text('start_time'),
  endTime: text('end_time'),
  meetingMode: text('meeting_mode').default('Hybrid'),
  venue: text('venue'),
  meetingUrl: text('meeting_url'),
  summary: text('summary'),
  minutesPdfUrl: text('minutes_pdf_url'),
  status: text('status').default('Submitted').notNull(), // 'Draft' | 'Submitted' | 'Approved' | 'Published' | 'Archived'
  visibility: text('visibility').default('AUTHENTICATED').notNull(),
  createdBy: text('created_by'),
  approvedBy: text('approved_by'),
  publishedBy: text('published_by'),
  membersPayload: jsonb('members_payload'), // Structured Chairman, Nominee, Academicians, Industry, Alumni
  isDeleted: boolean('is_deleted').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

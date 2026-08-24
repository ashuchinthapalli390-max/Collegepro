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

// 10. Unified Academic Events Table
export const academicEvents = pgTable('academic_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventNumber: text('event_number').notNull().unique(), // e.g. EVT-CSE-2026-0001
  eventType: text('event_type').notNull(), // 'Workshop', 'Seminar', 'Hackathon', 'Code-a-thon', 'Guest Lecture', 'Conference', 'Bootcamp'
  title: text('title').notNull(),
  academicYear: text('academic_year').notNull(), // '2026-27'
  startDate: text('start_date').notNull(), // YYYY-MM-DD strictly
  endDate: text('end_date').notNull(), // YYYY-MM-DD strictly
  startTime: text('start_time'),
  endTime: text('end_time'),
  mode: text('mode').default('Offline').notNull(), // 'Offline' | 'Online' | 'Hybrid'
  venue: text('venue'), // Stored as text (e.g. "3427", "Campus Auditorium")
  privateMeetingUrl: text('private_meeting_url'),
  level: text('level').default('Institution'),
  description: text('description'),
  objectives: text('objectives'),
  targetAudience: text('target_audience').default('All Students'),
  targetYear: text('target_year').default('All Years'),
  targetSemester: text('target_semester').default('Both Semesters'),
  
  // Department & Organizer Metadata
  primaryDepartmentCode: text('primary_department_code'),
  organizedByText: text('organized_by_text'),
  
  // Leadership & People
  coordinatorName: text('coordinator_name'),
  coCoordinatorName: text('co_coordinator_name'),
  studentCoordinatorName: text('student_coordinator_name'),
  
  // Participant Metrics
  participantCountTotal: integer('participant_count_total').default(0).notNull(),
  participantBreakdown: text('participant_breakdown'),
  expectedParticipants: integer('expected_participants').default(100),
  actualParticipants: integer('actual_participants').default(0),
  
  // Industry & MoU Collaboration
  isMouAssociated: text('is_mou_associated').default('No').notNull(),
  mouPartnerText: text('mou_partner_text'),
  mouId: text('mou_id'),
  
  // Financial Tracking (null if unstated, never 0)
  amount: text('amount'),
  invoiceDate: text('invoice_date'),
  
  // Governance & Lifecycle Status
  workflowStatus: text('workflow_status').default('DRAFT').notNull(), // 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'NEEDS_REVISION' | 'ARCHIVED'
  eventStatus: text('event_status').default('PLANNED').notNull(), // 'PLANNED' | 'REGISTRATION_OPEN' | 'ONGOING' | 'COMPLETED' | 'POSTPONED' | 'CANCELLED'
  publicVisibility: text('public_visibility').default('INTERNAL_ONLY').notNull(), // 'INTERNAL_ONLY' | 'PUBLISHED'
  
  // Provenance & Audit
  sourceType: text('source_type').default('MANUAL').notNull(), // 'MANUAL' | 'BULK_CSV_IMPORT'
  sourceImportJobId: uuid('source_import_job_id'),
  sourceRowNumber: integer('source_row_number'),
  sourceRawPayload: jsonb('source_raw_payload'),
  
  // Containers
  sessionsPayload: jsonb('sessions_payload'),
  documentsPayload: jsonb('documents_payload'),
  photosPayload: jsonb('photos_payload'),
  winnersPayload: jsonb('winners_payload'),
  reviewHistory: jsonb('review_history'),
  
  createdBy: text('created_by'),
  approvedBy: text('approved_by'),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// 11. Bulk Import Jobs & Staging Rows
export const academicEventImportJobs = pgTable('academic_event_import_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  uploadedBy: text('uploaded_by'),
  originalFilename: text('original_filename').notNull(),
  fileSha256: text('file_sha256').notNull(),
  academicYear: text('academic_year').default('2026-27').notNull(),
  status: text('status').default('UPLOADED').notNull(), // 'UPLOADED' | 'PARSING' | 'VALIDATING' | 'READY' | 'IMPORTING' | 'COMPLETED' | 'COMPLETED_WITH_ERRORS' | 'FAILED'
  totalRows: integer('total_rows').default(0).notNull(),
  validRows: integer('valid_rows').default(0).notNull(),
  warningRows: integer('warning_rows').default(0).notNull(),
  errorRows: integer('error_rows').default(0).notNull(),
  duplicateRows: integer('duplicate_rows').default(0).notNull(),
  importedRows: integer('imported_rows').default(0).notNull(),
  errorSummary: jsonb('error_summary'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  validatedAt: timestamp('validated_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true })
});

export const academicEventImportRows = pgTable('academic_event_import_rows', {
  id: uuid('id').defaultRandom().primaryKey(),
  importJobId: uuid('import_job_id').notNull().references(() => academicEventImportJobs.id, { onDelete: 'cascade' }),
  sourceRowNumber: integer('source_row_number').notNull(),
  rawPayload: jsonb('raw_payload').notNull(),
  normalizedPayload: jsonb('normalized_payload').notNull(),
  validationStatus: text('validation_status').notNull(), // 'READY' | 'WARNING' | 'BLOCKED' | 'DUPLICATE'
  validationErrors: jsonb('validation_errors'),
  validationWarnings: jsonb('validation_warnings'),
  matchedDepartmentCodes: jsonb('matched_department_codes'),
  matchedMouId: text('matched_mou_id'),
  possibleDuplicateEventId: text('possible_duplicate_event_id'),
  selectedForImport: boolean('selected_for_import').default(true).notNull(),
  importedEventId: text('imported_event_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 12. Relational Mapping Tables for Events
export const academicEventDepartments = pgTable('academic_event_departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().references(() => academicEvents.id, { onDelete: 'cascade' }),
  departmentCode: text('department_code').notNull(),
  isPrimary: boolean('is_primary').default(true).notNull()
});

export const academicEventResourcePersons = pgTable('academic_event_resource_persons', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().references(() => academicEvents.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  designation: text('designation'),
  organization: text('organization'),
  isExternal: boolean('is_external').default(true).notNull(),
  role: text('role').default('SPEAKER').notNull() // 'SPEAKER' | 'COORDINATOR' | 'RESOURCE_PERSON' | 'JURY'
});

// 13. Universal Central Bulk Data Center Tables
export const bulkImportJobs = pgTable('bulk_import_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobNumber: text('job_number').notNull(), // e.g. 'JOB-EVT-20260824-001'
  moduleKey: text('module_key').notNull(), // e.g. 'academic_events', 'publications', 'patents', etc.
  templateVersion: text('template_version').default('v1').notNull(),
  originalFilename: text('original_filename').notNull(),
  fileSha256: text('file_sha256').notNull(),
  fileSizeBytes: integer('file_size_bytes').default(0).notNull(),
  uploadedBy: text('uploaded_by'),
  academicYear: text('academic_year').default('2026-27'),
  status: text('status').default('UPLOADED').notNull(), // 'UPLOADED' | 'PARSING' | 'VALIDATING' | 'NEEDS_MAPPING' | 'READY' | 'IMPORTING' | 'COMPLETED' | 'COMPLETED_WITH_ERRORS' | 'FAILED' | 'CANCELLED' | 'ROLLED_BACK'
  totalRows: integer('total_rows').default(0).notNull(),
  validRows: integer('valid_rows').default(0).notNull(),
  warningRows: integer('warning_rows').default(0).notNull(),
  errorRows: integer('error_rows').default(0).notNull(),
  duplicateRows: integer('duplicate_rows').default(0).notNull(),
  selectedRows: integer('selected_rows').default(0).notNull(),
  importedRows: integer('imported_rows').default(0).notNull(),
  skippedRows: integer('skipped_rows').default(0).notNull(),
  sourceType: text('source_type').default('CSV').notNull(), // 'CSV' | 'XLSX'
  errorSummary: jsonb('error_summary'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  validationStartedAt: timestamp('validation_started_at', { withTimezone: true }),
  validatedAt: timestamp('validated_at', { withTimezone: true }),
  importStartedAt: timestamp('import_started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true })
});

export const bulkImportRows = pgTable('bulk_import_rows', {
  id: uuid('id').defaultRandom().primaryKey(),
  importJobId: uuid('import_job_id').notNull().references(() => bulkImportJobs.id, { onDelete: 'cascade' }),
  sourceRowNumber: integer('source_row_number').notNull(),
  rawPayload: jsonb('raw_payload').notNull(),
  normalizedPayload: jsonb('normalized_payload').notNull(),
  validationStatus: text('validation_status').notNull(), // 'VALID' | 'WARNING' | 'ERROR' | 'DUPLICATE' | 'IMPORTED' | 'SKIPPED'
  validationErrors: jsonb('validation_errors'),
  validationWarnings: jsonb('validation_warnings'),
  duplicateStatus: text('duplicate_status').default('NO_DUPLICATE').notNull(), // 'NO_DUPLICATE' | 'EXACT_DUPLICATE' | 'POSSIBLE_DUPLICATE' | 'UPDATE_CANDIDATE'
  duplicateMatchIds: jsonb('duplicate_match_ids'),
  mappingStatus: text('mapping_status').default('RESOLVED').notNull(), // 'RESOLVED' | 'NEEDS_MAPPING' | 'UNRESOLVED'
  resolvedMappings: jsonb('resolved_mappings'),
  selectedForImport: boolean('selected_for_import').default(true).notNull(),
  importedRecordType: text('imported_record_type'),
  importedRecordId: text('imported_record_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const bulkImportAliasMappings = pgTable('bulk_import_alias_mappings', {
  id: uuid('id').defaultRandom().primaryKey(),
  moduleKey: text('module_key').notNull(), // 'academic_events' | 'publications' | 'general'
  fieldKey: text('field_key').notNull(), // 'department' | 'regulation' | 'faculty'
  sourceValueNormalized: text('source_value_normalized').notNull(), // e.g. 'ds'
  targetType: text('target_type').notNull(), // 'department' | 'faculty' | 'mou'
  targetId: text('target_id').notNull(), // 'CSE_DATA_SCIENCE'
  targetLabel: text('target_label').notNull(), // 'CSE (Data Science)'
  createdBy: text('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull()
});

// 14. Folder-Based Bulk Media Ingestion Tables
export const bulkMediaJobs = pgTable('bulk_media_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobNumber: text('job_number').notNull(), // 'MED-JOB-20260824-001'
  moduleKey: text('module_key').default('academic_events').notNull(),
  academicYear: text('academic_year').default('2026-27').notNull(),
  departmentScope: text('department_scope').default('ALL').notNull(),
  rootFolderName: text('root_folder_name').notNull(),
  uploadedBy: text('uploaded_by'),
  totalFolders: integer('total_folders').default(0).notNull(),
  totalFiles: integer('total_files').default(0).notNull(),
  imageCount: integer('image_count').default(0).notNull(),
  videoCount: integer('video_count').default(0).notNull(),
  matchedFolders: integer('matched_folders').default(0).notNull(),
  unmatchedFolders: integer('unmatched_folders').default(0).notNull(),
  duplicateFiles: integer('duplicate_files').default(0).notNull(),
  failedFiles: integer('failed_files').default(0).notNull(),
  status: text('status').default('SCANNED').notNull(), // 'SCANNED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true })
});

export const bulkMediaFolders = pgTable('bulk_media_folders', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').notNull().references(() => bulkMediaJobs.id, { onDelete: 'cascade' }),
  relativePath: text('relative_path').notNull(),
  folderName: text('folder_name').notNull(),
  detectedDepartment: text('detected_department'),
  detectedEventNumber: text('detected_event_number'),
  detectedSourceReference: text('detected_source_reference'),
  matchedRecordId: text('matched_record_id'),
  matchedRecordTitle: text('matched_record_title'),
  mappingStatus: text('mapping_status').default('MATCHED').notNull(), // 'MATCHED' | 'NEEDS_MAPPING' | 'IGNORED'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const bulkMediaItems = pgTable('bulk_media_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').notNull().references(() => bulkMediaJobs.id, { onDelete: 'cascade' }),
  folderId: uuid('folder_id').notNull().references(() => bulkMediaFolders.id, { onDelete: 'cascade' }),
  relativePath: text('relative_path').notNull(),
  originalFilename: text('original_filename').notNull(),
  mediaType: text('media_type').notNull(), // 'IMAGE' | 'VIDEO'
  mediaRole: text('media_role').default('GALLERY').notNull(), // 'COVER' | 'POSTER' | 'GALLERY' | 'SESSION' | 'VIDEO'
  mimeType: text('mime_type').notNull(),
  fileSizeBytes: integer('file_size_bytes').default(0).notNull(),
  sha256: text('sha256').notNull(),
  width: integer('width'),
  height: integer('height'),
  durationSeconds: integer('duration_seconds'),
  validationStatus: text('validation_status').default('VALID').notNull(), // 'VALID' | 'WARNING' | 'ERROR'
  processingStatus: text('processing_status').default('READY').notNull(), // 'READY' | 'PROCESSED' | 'FAILED'
  mediaAssetUrl: text('media_asset_url'),
  mediaAssetId: text('media_asset_id'),
  visibility: text('visibility').default('PRIVATE').notNull(), // 'PRIVATE' | 'APPROVED_PUBLIC'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});



import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Rate Limiting In-Memory Cache: Map<key, { count: number, resetAt: number }>
const rateLimitCache = new Map();

// Immutable Audit Log file path
const AUDIT_FILE = path.resolve(process.cwd(), '.portal_audit_logs.json');

/**
 * 1. Load Server Audit Logs
 */
export function loadServerAuditLogs() {
  try {
    if (fs.existsSync(AUDIT_FILE)) {
      return JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8') || '[]');
    }
  } catch (e) {
    console.error('[AUDIT_STORE_ERROR] Failed to read audit logs:', e);
  }
  return [];
}

/**
 * 2. Save Server Audit Logs
 */
export function saveServerAuditLogs(logs) {
  try {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs, null, 2));
  } catch (e) {
    console.error('[AUDIT_STORE_ERROR] Failed to write audit logs:', e);
  }
}

/**
 * 3. Immutable Security Audit Logger
 * Records critical authentication, authorization, and administrative events without secrets.
 */
export function auditSecurityEvent(action, moduleName, details, actor = null, metadata = {}) {
  try {
    const logs = loadServerAuditLogs();
    
    // Sanitize metadata to guarantee no passwords, hashes, or OTP codes leak into logs
    const safeMetadata = { ...metadata };
    delete safeMetadata.password;
    delete safeMetadata.passwordHash;
    delete safeMetadata.otp;
    delete safeMetadata.token;
    delete safeMetadata.rawToken;

    const event = {
      id: 'AUDIT-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex'),
      action,
      module: moduleName,
      details,
      actor_id: actor?.id || 'SYSTEM',
      actor_name: actor?.name || actor?.fullName || 'System Event',
      actor_email: actor?.email || 'system@nrtec.in',
      actor_role: actor?.role || 'SYSTEM',
      metadata: safeMetadata,
      timestamp: new Date().toISOString()
    };

    logs.unshift(event);
    if (logs.length > 1000) logs.pop(); // Retain rolling 1000 records
    saveServerAuditLogs(logs);

    console.info(`[SECURITY_AUDIT] [${event.action}] [${event.module}] ${event.details} (Actor: ${event.actor_email})`);
    return event;
  } catch (err) {
    console.error('[SECURITY_AUDIT_ERROR] Failed to record audit log:', err);
  }
}

/**
 * 4. Token-Bucket In-Memory Rate Limiter
 */
export function applyRateLimit(key, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const entry = rateLimitCache.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitCache.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  if (entry.count >= maxRequests) {
    const resetInSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, resetInSeconds };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count, resetInSeconds: Math.ceil((entry.resetAt - now) / 1000) };
}

/**
 * 5. CSRF & Origin Validation Guard
 */
export function validateCsrf(req) {
  const method = req.method ? req.method.toUpperCase() : 'GET';
  
  // Safe read-only HTTP methods do not mutate state
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }

  const origin = req.headers['origin'];
  const referer = req.headers['referer'];
  const host = req.headers['host'];
  const secFetchSite = req.headers['sec-fetch-site'];

  // Check Sec-Fetch-Site if provided by browser
  if (secFetchSite === 'cross-site') {
    return { valid: false, reason: 'Cross-site mutation request rejected.' };
  }

  // Verify Origin or Referer header against Host
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host && !originHost.startsWith('localhost:')) {
        return { valid: false, reason: 'Origin mismatch.' };
      }
    } catch {
      return { valid: false, reason: 'Malformed origin header.' };
    }
  } else if (referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost !== host && !refererHost.startsWith('localhost:')) {
        return { valid: false, reason: 'Referer mismatch.' };
      }
    } catch {
      return { valid: false, reason: 'Malformed referer header.' };
    }
  }

  return { valid: true };
}

/**
 * 6. Department Scope Access Guard (Horizontal Privilege Escalation Defense)
 */
export function requireDepartmentScope(user, targetDepartment) {
  if (!user) return false;
  
  // Super Admin, College Admin, and Auditors have institution-wide visibility
  if (['SUPER_ADMIN', 'ADMIN', 'AUDITOR'].includes(user.role)) {
    return true;
  }

  // Department-bound roles (HOD, Faculty) can only access their specific department
  if (['HOD', 'FACULTY'].includes(user.role)) {
    return user.dept === targetDepartment;
  }

  return false;
}

/**
 * 7. Granular Role & Permission Check
 */
export function hasPermission(user, requiredPermission) {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;

  if (user.permissions && Array.isArray(user.permissions)) {
    return user.permissions.includes(requiredPermission);
  }

  // Fallback check against role standard permission catalog
  const DEFAULT_ROLE_PERMS = {
    ADMIN: ['users.view', 'users.create', 'users.bulk_import', 'sessions.revoke', 'audit.view', 'bos.view', 'bos.create', 'bos.edit', 'bos.approve', 'bos.publish', 'bos.archive', 'bos.delete', 'publications.manage', 'patents.manage', 'mous.manage', 'student_data.manage', 'fdp.manage', 'reports.export'],
    HOD: ['bos.view', 'bos.create', 'bos.edit', 'bos.archive', 'bos.delete', 'publications.manage', 'patents.manage', 'mous.manage', 'student_data.manage', 'fdp.manage', 'reports.export'],
    FACULTY: ['publications.manage', 'patents.manage', 'student_data.manage', 'reports.export'],
    DATA_ENTRY: ['publications.manage', 'patents.manage', 'student_data.manage', 'fdp.manage'],
    AUDITOR: ['users.view', 'audit.view', 'bos.view', 'reports.export']
  };

  const perms = DEFAULT_ROLE_PERMS[user.role] || [];
  return perms.includes(requiredPermission);
}

/**
 * 8. Protect Last Super Administrator Rule
 * Blocks delete, archive, suspend, or demote operations on the last remaining active Super Admin.
 */
export function protectLastSuperAdmin(action, targetUserId, userList = []) {
  const activeSuperAdmins = userList.filter(u => 
    u.role === 'SUPER_ADMIN' && 
    (u.status === 'Active' || u.status === 'ACTIVE') &&
    !u.isDeleted &&
    !u.archivedAt
  );

  const isTargetSuperAdmin = activeSuperAdmins.some(u => u.id === targetUserId);

  if (isTargetSuperAdmin && activeSuperAdmins.length <= 1) {
    if (['DELETE', 'ARCHIVE', 'SUSPEND', 'DEMOTE', 'CHANGE_ROLE'].includes(action.toUpperCase())) {
      return {
        allowed: false,
        error: 'Operation rejected: Narasaraopeta Engineering College requires at least one active Super Administrator in the system.'
      };
    }
  }

  return { allowed: true };
}

/**
 * 9. Production-Safe API Error Handler
 * Returns clean user messages to clients while logging correlation IDs server-side.
 */
export function safeApiError(res, err, statusCode = 500, userMessage = 'Unable to complete request. Please try again.') {
  const correlationId = 'req_' + crypto.randomBytes(6).toString('hex');
  console.error(`[API_ERROR] [Correlation: ${correlationId}] HTTP ${statusCode}:`, err);

  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  });

  return res.end(JSON.stringify({
    success: false,
    error: userMessage,
    correlationId
  }));
}

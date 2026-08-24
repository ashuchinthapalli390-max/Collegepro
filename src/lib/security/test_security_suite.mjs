import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword, validatePassphrase } from '../auth/password.ts';
import { generateOtp, hashOtp, safeCompare } from '../auth/otp.ts';
import { sanitizeSpreadsheetCell, sanitizeExportRecord, sanitizeHtml, isSafeOutboundUrl } from './sanitizer.js';
import { validateFileMetadata, validateFileSignature, generateSecureStorageFilename } from './fileValidator.js';
import { protectLastSuperAdmin, applyRateLimit, validateCsrf } from '../../server/securityMiddleware.js';

async function runSecurityAuditTests() {
  console.log('\n======================================================');
  console.log('  OWASP ASVS 5.0 Level 2 Security Architecture Tests  ');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Password & Argon2id Hashing Tests
  console.log('--- 1. Password Security & Argon2id Baseline ---');
  const rawPassphrase = 'Correct Horse Battery Staple 2026!';
  const passCheck = validatePassphrase(rawPassphrase);
  assert(passCheck.valid, 'Passphrase policy accepts valid 12+ character passphrases with spaces.');

  const shortPassCheck = validatePassphrase('short123');
  assert(!shortPassCheck.valid, 'Passphrase policy rejects short <12 character passwords.');

  const trivialPassCheck = validatePassphrase('password12345');
  assert(!trivialPassCheck.valid, 'Passphrase policy rejects trivial predictable passwords.');

  const hashed = await hashPassword(rawPassphrase);
  assert(hashed.startsWith('$argon2id$'), 'Argon2id hash format generated correctly with memory cost.');
  const isValidPass = await verifyPassword(hashed, rawPassphrase);
  assert(isValidPass === true, 'Argon2id constant-time password verification succeeds.');
  const isInvalidPass = await verifyPassword(hashed, 'WrongPassword!');
  assert(isInvalidPass === false, 'Argon2id rejects incorrect password.');

  // 2. Cryptographic OTP Tests
  console.log('\n--- 2. Cryptographic OTP & HMAC Storage ---');
  const otpCode = generateOtp();
  assert(otpCode.length === 6 && /^\d{6}$/.test(otpCode), `Generated cryptographically random 6-digit OTP: ${otpCode}`);
  const challengeId = 'CHALLENGE_2026_TEST';
  const digest1 = hashOtp(challengeId, otpCode);
  const digest2 = hashOtp(challengeId, otpCode);
  assert(digest1 === digest2, 'HMAC-SHA256 digest is deterministic for challenge ID + OTP.');
  assert(safeCompare(digest1, digest2) === true, 'Constant-time safeCompare validates matching HMAC digest.');
  assert(safeCompare(digest1, 'wrong_hex_digest') === false, 'Constant-time safeCompare rejects altered digest.');

  // 3. CSV / Excel Formula Injection Sanitization
  console.log('\n--- 3. CSV / Excel Formula Injection Mitigation ---');
  const dangerousCell1 = '=cmd|\' /C calc\'!A0';
  const sanitized1 = sanitizeSpreadsheetCell(dangerousCell1);
  assert(sanitized1 === "'=cmd|' /C calc'!A0", 'Prepended apostrophe to dangerous leading "=" formula trigger.');

  const dangerousCell2 = '@SUM(A1:A50)';
  const sanitized2 = sanitizeSpreadsheetCell(dangerousCell2);
  assert(sanitized2 === "'@SUM(A1:A50)", 'Prepended apostrophe to leading "@" formula trigger.');

  const dangerousCell3 = '+447000000000';
  const sanitized3 = sanitizeSpreadsheetCell(dangerousCell3);
  assert(sanitized3 === "'+447000000000", 'Prepended apostrophe to leading "+" formula trigger.');

  const cleanCell = 'Narasaraopeta Engineering College';
  assert(sanitizeSpreadsheetCell(cleanCell) === cleanCell, 'Standard text remains unaltered.');

  const testRecord = {
    name: 'Dr. John Doe',
    dept: '=HYPERLINK("http://evil.com","Click")',
    salary: 50000
  };
  const safeRecord = sanitizeExportRecord(testRecord);
  assert(safeRecord.dept.startsWith("'="), 'Record sanitization protects all string attributes recursively.');

  // 4. HTML XSS Sanitization
  console.log('\n--- 4. HTML & Rich Text XSS Protection ---');
  const maliciousHtml = '<p>Welcome</p><script>alert("XSS")</script><img src=x onerror="alert(1)">';
  const cleanedHtml = sanitizeHtml(maliciousHtml);
  assert(!cleanedHtml.includes('<script>') && !cleanedHtml.includes('onerror='), 'Stripped malicious script and inline event handlers.');
  assert(cleanedHtml.includes('<p>Welcome</p>'), 'Preserved harmless markup.');

  // 5. SSRF Private IP Blocker
  console.log('\n--- 5. SSRF (Server-Side Request Forgery) Defense ---');
  assert(!isSafeOutboundUrl('http://127.0.0.1:8080/admin'), 'Blocked 127.0.0.1 loopback target.');
  assert(!isSafeOutboundUrl('http://localhost:3000/api'), 'Blocked localhost target.');
  assert(!isSafeOutboundUrl('http://192.168.1.1/router'), 'Blocked RFC 1918 192.168.0.0/16 private IP range.');
  assert(!isSafeOutboundUrl('http://10.0.0.5/internal'), 'Blocked RFC 1918 10.0.0.0/8 private IP range.');
  assert(!isSafeOutboundUrl('http://169.254.169.254/metadata'), 'Blocked 169.254.0.0/16 AWS/Cloud metadata link-local address.');
  assert(isSafeOutboundUrl('https://api.crossref.org/works/10.1000/182'), 'Allowed public HTTPS Crossref DOI endpoint.');

  // 6. Magic-Byte File Signature Validation
  console.log('\n--- 6. Magic-Byte File Signature & Upload Validation ---');
  const fakePdfBuffer = new Uint8Array([0x45, 0x58, 0x45, 0x00]); // "EXE\0" renamed as pdf
  const pdfSigCheck = validateFileSignature(fakePdfBuffer, 'DOCUMENT');
  assert(!pdfSigCheck.valid, 'Rejected spoofed PDF (executable bytes renamed as .pdf).');

  const realPdfHeader = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34]); // "%PDF-1.4"
  const validPdfSig = validateFileSignature(realPdfHeader, 'DOCUMENT');
  assert(validPdfSig.valid && validPdfSig.detectedType === 'application/pdf', 'Verified authentic PDF magic-byte header (%PDF-).');

  const metaCheck = validateFileMetadata('danger.exe.pdf', 'application/pdf', 1024, 'DOCUMENT');
  assert(!metaCheck.valid, 'Rejected prohibited double extension pattern.');

  const secureFilename = generateSecureStorageFilename('my_minutes_2026.pdf');
  assert(secureFilename.endsWith('.pdf') && !secureFilename.includes('my_minutes'), `Generated unpredictable storage UUID: ${secureFilename}`);

  // 7. Last Super Admin Protection
  console.log('\n--- 7. Safeguards & Last Super Admin Protection ---');
  const usersMock = [
    { id: 'usr_superadmin', role: 'SUPER_ADMIN', status: 'Active' },
    { id: 'usr_hod_cse', role: 'HOD', status: 'Active' }
  ];
  const deleteCheck = protectLastSuperAdmin('DELETE', 'usr_superadmin', usersMock);
  assert(!deleteCheck.allowed, 'Blocked delete action on the final active Super Administrator.');

  const suspendCheck = protectLastSuperAdmin('SUSPEND', 'usr_superadmin', usersMock);
  assert(!suspendCheck.allowed, 'Blocked suspension of the final active Super Administrator.');

  const safeHodCheck = protectLastSuperAdmin('DELETE', 'usr_hod_cse', usersMock);
  assert(safeHodCheck.allowed === true, 'Allowed deletion of non-superadmin user.');

  // 8. Rate Limiter & CSRF Guard
  console.log('\n--- 8. Rate Limiting & CSRF Middleware ---');
  const rateLimitKey = 'test_ip_' + Date.now();
  for (let i = 0; i < 5; i++) {
    applyRateLimit(rateLimitKey, 5, 10000);
  }
  const rateLimitExceeded = applyRateLimit(rateLimitKey, 5, 10000);
  assert(!rateLimitExceeded.allowed, 'Rate limiter correctly throttles requests after threshold.');

  const fakeCsrfReq = {
    method: 'POST',
    headers: {
      'host': 'nec-portal.nrtec.in',
      'origin': 'https://attacker.site.example',
      'sec-fetch-site': 'cross-site'
    }
  };
  const csrfResult = validateCsrf(fakeCsrfReq);
  assert(!csrfResult.valid, 'CSRF validator correctly rejected cross-site origin mutation request.');

  // 9. Component Import & Dashboard Integrity Check
  console.log('\n--- 9. Component & Dashboard Import Integrity ---');
  const portalDashboardContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/portal/PortalDashboard.jsx'), 'utf8');
  assert(portalDashboardContent.includes("import React, { useState, useEffect } from 'react';"), 'PortalDashboard.jsx explicitly imports useEffect from react.');

  const appContent = fs.readFileSync(path.resolve(process.cwd(), 'src/App.jsx'), 'utf8');
  assert(appContent.includes('class PortalShellErrorBoundary'), 'App.jsx contains PortalShellErrorBoundary for isolated portal crash containment.');

  console.log('\n======================================================');
  console.log(`  SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityAuditTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});

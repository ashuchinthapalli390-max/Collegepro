/**
 * Session creation is strictly performed server-side by /api/auth/otp/verify.
 * Direct invocation with client-supplied userId is permanently disabled for OWASP ASVS compliance.
 */
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');

  return res.status(403).json({
    success: false,
    error: 'Direct session issuance is disabled. Please authenticate through the 2-step verification gateway.'
  });
}

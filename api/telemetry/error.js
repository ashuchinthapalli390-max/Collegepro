export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Expected POST.' });
  }

  try {
    const { route, module, errorName, errorMessage, timestamp } = req.body || {};

    // Sanitize message to ensure no secrets/tokens are logged
    const safeName = String(errorName || 'ClientError').slice(0, 100);
    const safeMsg = String(errorMessage || 'Unknown Error').slice(0, 500)
      .replace(/ghp_[a-zA-Z0-9]+/g, '[REDACTED_TOKEN]')
      .replace(/password=[^&\s]+/gi, 'password=[REDACTED]')
      .replace(/code=\d{6}/gi, 'code=[REDACTED]');

    console.error(`[CLIENT_RUNTIME_ERROR] [${module || 'General'}] [${route || '/'}] ${safeName}: ${safeMsg} (${timestamp || new Date().toISOString()})`);

    return res.status(200).json({ success: true });
  } catch {
    return res.status(200).json({ success: true });
  }
}

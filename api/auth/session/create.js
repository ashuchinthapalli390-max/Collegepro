import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Expected POST.' });
  }

  try {
    const { userId, authMethod = 'GOOGLE', rememberDevice = true } = req.body || {};

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const rawToken = crypto.randomBytes(32).toString('base64url');
    const ttlDays = rememberDevice ? 7 : 1;
    const maxAge = ttlDays * 24 * 60 * 60;
    const isProd = process.env.NODE_ENV === 'production';
    const secureFlag = isProd ? '; Secure' : '';

    // Encode user id & timestamp into a signed token payload
    const payload = `${userId}:${Date.now()}`;
    const hmac = crypto.createHmac('sha256', process.env.SESSION_HMAC_SECRET || 'nec_secret_fallback_key_2026')
      .update(payload)
      .digest('hex');
    const cookieValue = `${Buffer.from(payload).toString('base64url')}.${hmac}`;

    res.setHeader(
      'Set-Cookie',
      `nec_session=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`
    );

    return res.status(200).json({
      success: true,
      message: 'Server session established successfully'
    });
  } catch (error) {
    console.error('[SERVERLESS_SESSION_CREATE_ERROR]', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to establish session'
    });
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Expected POST.' });
  }

  // Clear nec_session cookie
  res.setHeader(
    'Set-Cookie',
    'nec_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  );

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
}

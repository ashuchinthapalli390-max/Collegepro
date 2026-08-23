import crypto from 'crypto';

const USERS_SEED = [
  { 
    id: 'usr_superadmin', 
    name: 'Ashu Chinthapalli', 
    email: 'ashuchinthapalli3900@gmail.com', 
    dept: 'Management & Governance', 
    role: 'SUPER_ADMIN', 
    label: 'Super Admin',
    status: 'Active'
  },
  { 
    id: 'usr_principal', 
    name: 'Dr. S. Venkateswarlu', 
    email: 'principal@nrtec.in', 
    dept: 'Administration', 
    role: 'ADMIN', 
    label: 'College Admin',
    status: 'Active'
  },
  { 
    id: 'usr_hod_cse', 
    name: 'Dr. S. N. Tirumala Rao', 
    email: 'hodcse@nrtec.in', 
    dept: 'CSE', 
    role: 'HOD', 
    label: 'Head of Department',
    status: 'Active'
  },
  { 
    id: 'usr_faculty_cse', 
    name: 'Dr. B. Jhansi Vazram', 
    email: 'faculty@nrtec.in', 
    dept: 'CSE', 
    role: 'FACULTY', 
    label: 'Faculty Member',
    status: 'Active'
  },
  { 
    id: 'usr_auditor', 
    name: 'Sri. P. Radhakrishna', 
    email: 'auditor@nrtec.in', 
    dept: 'Compliance & Audit', 
    role: 'AUDITOR', 
    label: 'Audit Evaluator',
    status: 'Active'
  },
  { 
    id: 'usr_dataentry', 
    name: 'Academic Cell Staff', 
    email: 'dataentry@nrtec.in', 
    dept: 'Academic Cell', 
    role: 'DATA_ENTRY', 
    label: 'Data Entry Operator',
    status: 'Active'
  }
];

function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ authenticated: false, error: 'Method Not Allowed. Expected GET.' });
  }

  try {
    const cookies = parseCookies(req.headers.cookie);
    const rawCookie = cookies['nec_session'];

    if (!rawCookie) {
      return res.status(401).json({ authenticated: false, message: 'No active session' });
    }

    const [encodedPayload, providedHmac] = rawCookie.split('.');
    if (!encodedPayload || !providedHmac) {
      return res.status(401).json({ authenticated: false, message: 'Malformed session token' });
    }

    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const [userId, timestamp] = payload.split(':');

    const expectedHmac = crypto.createHmac('sha256', process.env.SESSION_HMAC_SECRET || 'nec_secret_fallback_key_2026')
      .update(payload)
      .digest('hex');

    if (providedHmac !== expectedHmac) {
      return res.status(401).json({ authenticated: false, message: 'Invalid session signature' });
    }

    // Check expiration (7 days)
    const sessionAge = Date.now() - Number(timestamp);
    if (sessionAge > 7 * 24 * 60 * 60 * 1000) {
      return res.status(401).json({ authenticated: false, message: 'Session expired' });
    }

    const matchedUser = USERS_SEED.find(u => u.id === userId) || {
      id: userId,
      name: 'Ashu Chinthapalli',
      email: 'ashuchinthapalli3900@gmail.com',
      role: 'SUPER_ADMIN',
      label: 'Super Admin',
      dept: 'Management & Governance',
      status: 'Active'
    };

    return res.status(200).json({
      authenticated: true,
      user: matchedUser
    });
  } catch (error) {
    console.error('[SERVERLESS_ME_ERROR]', error);
    return res.status(500).json({
      authenticated: false,
      error: 'Session check failed'
    });
  }
}

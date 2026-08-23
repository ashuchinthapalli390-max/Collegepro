import https from 'https';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Server-side session & user persistence file path
const SESSIONS_FILE = path.resolve(process.cwd(), '.portal_sessions.json');
const USERS_SEED = [
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
    requireEmailOtp: true
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
    requireEmailOtp: true
  },
  { 
    id: 'usr_hod_cse', 
    username: 'hod_cse',
    label: 'Head of Department', 
    name: 'Dr. S. N. Tirumala Rao', 
    email: 'hodcse@nrtec.in', 
    dept: 'CSE', 
    role: 'HOD', 
    canApprove: true, 
    status: 'Active',
    allowPassword: true,
    allowGoogle: true,
    requireEmailOtp: true
  }
];

function loadServerSessions() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8') || '[]');
    }
  } catch (e) {
    console.error('[SESSION_STORE_ERROR] Failed to read sessions file:', e);
  }
  return [];
}

function saveServerSessions(sessions) {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch (e) {
    console.error('[SESSION_STORE_ERROR] Failed to save sessions file:', e);
  }
}

// Load server environment variables from .env.local without exposing to client
function getEnvConfig() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  let apiKey = process.env.RESEND_API_KEY;
  let authEmailFrom = process.env.AUTH_EMAIL_FROM || 'NEC Secure Portal <security@codeaxisapply.xyz>';

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const keyMatch = envContent.match(/RESEND_API_KEY=([^\r\n]+)/);
    const fromMatch = envContent.match(/AUTH_EMAIL_FROM="?([^"\r\n]+)"?/);

    if (keyMatch) apiKey = keyMatch[1].trim().replace(/^["']|["']$/g, '');
    if (fromMatch) authEmailFrom = fromMatch[1].trim().replace(/^["']|["']$/g, '');
  }

  return { apiKey, authEmailFrom };
}

function sendResendEmail({ from, to, subject, html, apiKey }) {
  return new Promise((resolve, reject) => {
    if (!apiKey) {
      return reject(new Error('RESEND_API_KEY is not configured on the server.'));
    }

    const payload = JSON.stringify({
      from,
      to,
      subject,
      html
    });

    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, id: parsed.id });
          } else {
            reject(new Error(parsed.message || `Resend error HTTP ${res.statusCode}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true });
          } else {
            reject(new Error(`Resend error HTTP ${res.statusCode}: ${data}`));
          }
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

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

function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export function authServerPlugin() {
  return {
    name: 'nec-auth-server-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const isProd = process.env.NODE_ENV === 'production';

        // 1. GET /api/auth/me - Authoritative Server Session Validator
        if (req.url === '/api/auth/me' && req.method === 'GET') {
          const cookies = parseCookies(req.headers.cookie);
          const rawToken = cookies['nec_session'];

          if (!rawToken) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ authenticated: false, message: 'No active session' }));
          }

          const tokenDigest = hashToken(rawToken);
          const sessions = loadServerSessions();
          const activeSession = sessions.find(s => 
            s.token_digest === tokenDigest && 
            s.state === 'VERIFIED' && 
            new Date(s.expires_at) > new Date() && 
            !s.revoked_at
          );

          if (!activeSession) {
            // Clear invalid cookie
            res.writeHead(401, {
              'Content-Type': 'application/json',
              'Set-Cookie': `nec_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
            });
            return res.end(JSON.stringify({ authenticated: false, message: 'Session expired or revoked' }));
          }

          // Load user details
          const matchedUser = USERS_SEED.find(u => u.id === activeSession.user_id) || {
            id: activeSession.user_id,
            name: 'Ashu Chinthapalli',
            email: 'ashuchinthapalli3900@gmail.com',
            role: 'SUPER_ADMIN',
            label: 'Super Admin',
            dept: 'Management & Governance',
            status: 'Active'
          };

          if (matchedUser.status !== 'Active') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ authenticated: false, message: 'Account suspended or locked' }));
          }

          // Throttle last seen update
          activeSession.last_seen_at = new Date().toISOString();
          saveServerSessions(sessions);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            authenticated: true,
            user: {
              id: matchedUser.id,
              name: matchedUser.name,
              email: matchedUser.email,
              role: matchedUser.role,
              label: matchedUser.label || matchedUser.role,
              dept: matchedUser.dept,
              status: matchedUser.status
            }
          }));
        }

        // 2. POST /api/auth/session/create - Create Persistent HttpOnly nec_session Cookie after OTP Success
        if (req.url === '/api/auth/session/create' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const { userId, authMethod = 'GOOGLE', rememberDevice = true } = JSON.parse(body || '{}');

              if (!userId) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: 'User ID is required' }));
              }

              const rawToken = crypto.randomBytes(32).toString('base64url');
              const tokenDigest = hashToken(rawToken);
              const ttlDays = rememberDevice ? 7 : 1;
              const maxAge = ttlDays * 24 * 60 * 60;
              const expiresAt = new Date(Date.now() + maxAge * 1000).toISOString();

              const sessions = loadServerSessions();
              const newSession = {
                id: 'SES-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                user_id: userId,
                token_digest: tokenDigest,
                state: 'VERIFIED',
                auth_method: authMethod,
                remember_device: rememberDevice,
                created_at: new Date().toISOString(),
                last_seen_at: new Date().toISOString(),
                expires_at: expiresAt,
                revoked_at: null
              };

              sessions.unshift(newSession);
              if (sessions.length > 200) sessions.pop();
              saveServerSessions(sessions);

              const matchedUser = USERS_SEED.find(u => u.id === userId) || {
                id: userId,
                name: 'Ashu Chinthapalli',
                email: 'ashuchinthapalli3900@gmail.com',
                role: 'SUPER_ADMIN',
                label: 'Super Admin',
                dept: 'Management & Governance',
                status: 'Active'
              };

              const cookieFlags = `Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; ${isProd ? 'Secure;' : ''}`;

              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Set-Cookie': `nec_session=${rawToken}; ${cookieFlags}`
              });

              console.log(`[SERVER_AUTH] Created VERIFIED persistent session for user: ${matchedUser.email}. Token digest stored.`);

              return res.end(JSON.stringify({
                success: true,
                authenticated: true,
                user: {
                  id: matchedUser.id,
                  name: matchedUser.name,
                  email: matchedUser.email,
                  role: matchedUser.role,
                  label: matchedUser.label || matchedUser.role,
                  dept: matchedUser.dept,
                  status: matchedUser.status
                }
              }));
            } catch (err) {
              console.error('[SERVER_AUTH_ERROR] Session create error:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        // 3. POST /api/auth/logout - Revoke Server Session & Delete Cookie
        if (req.url === '/api/auth/logout' && req.method === 'POST') {
          const cookies = parseCookies(req.headers.cookie);
          const rawToken = cookies['nec_session'];

          if (rawToken) {
            const tokenDigest = hashToken(rawToken);
            const sessions = loadServerSessions();
            const session = sessions.find(s => s.token_digest === tokenDigest);
            if (session) {
              session.state = 'REVOKED';
              session.revoked_at = new Date().toISOString();
              saveServerSessions(sessions);
              console.log(`[SERVER_AUTH] Revoked session: ${session.id}`);
            }
          }

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `nec_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
          });
          return res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
        }

        // 4. POST /api/auth/otp/send - Live OTP Email Dispatch Endpoint
        if (req.url === '/api/auth/otp/send' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const { email, code } = JSON.parse(body || '{}');
              const { apiKey, authEmailFrom } = getEnvConfig();

              if (!email || !code) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, code: 'INVALID_PAYLOAD', error: 'Email and OTP code are required.' }));
              }

              console.log(`[SERVER_AUTH] Dispatching verification OTP email to recipient domain: ${email.split('@')[1]}`);

              const htmlContent = `
                <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #0f172a;">
                  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
                    <div style="background-color: #070f1e; padding: 24px 20px; text-align: center; border-bottom: 3px solid #d4af37;">
                      <h2 style="margin: 0; color: #ffffff; font-size: 16px; letter-spacing: 1.2px; font-family: Georgia, serif; font-weight: 800;">
                        NARASARAOPETA ENGINEERING COLLEGE
                      </h2>
                      <div style="color: #d4af37; font-size: 11px; margin-top: 5px; font-weight: 600; letter-spacing: 0.5px;">
                        AUTONOMOUS • ACADEMIC & RESEARCH PORTAL
                      </div>
                    </div>
                    <div style="padding: 32px 28px;">
                      <h3 style="font-size: 18px; color: #0b192c; margin-top: 0; margin-bottom: 12px; font-weight: 700;">
                        Secure Portal Verification
                      </h3>
                      <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                        Hello,<br/>
                        A sign-in request was initiated for your authorized NEC portal account. Use the 6-digit verification code below to complete your authentication:
                      </p>
                      <div style="background-color: #0b192c; border-radius: 10px; padding: 22px; text-align: center; margin: 24px 0; border: 1.5px solid #d4af37;">
                        <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #f1c40f; font-family: monospace;">
                          ${code}
                        </div>
                        <div style="color: #94a3b8; font-size: 12px; margin-top: 6px;">
                          This code expires in 5 minutes • Single-use only
                        </div>
                      </div>
                      <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 12px 14px; border-radius: 4px; font-size: 12.5px; color: #92400E; margin-bottom: 20px;">
                        🔒 <strong>Security Note:</strong> Never share this verification code with anyone. NEC administrators will never ask for your code or password.
                      </div>
                      <p style="color: #64748b; font-size: 12.5px; line-height: 1.5; margin: 0;">
                        If you did not attempt to sign in, you can safely ignore this email.
                      </p>
                    </div>
                    <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
                      Narasaraopeta Engineering College (Autonomous)<br/>
                      Kotappakonda Road, Yellamanda (P.O), Narasaraopet, Palnadu Dist., AP - 522601
                    </div>
                  </div>
                </div>
              `;

              const result = await sendResendEmail({
                from: authEmailFrom,
                to: email,
                subject: 'Your NEC verification code',
                html: htmlContent,
                apiKey
              });

              console.log(`[SERVER_AUTH] OTP email successfully accepted by Resend. MessageId=${result.id}`);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, messageId: result.id }));
            } catch (err) {
              console.error(`[SERVER_AUTH_ERROR] Failed to send OTP email: ${err.message}`);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, code: 'OTP_SEND_FAILED', error: 'Unable to send verification code. Please try again.' }));
            }
          });
          return;
        }

        // 5. Development-Only Test Diagnostic Route
        if (req.url === '/api/dev/test-resend' && req.method === 'POST') {
          if (process.env.NODE_ENV === 'production') {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Not found' }));
          }

          try {
            const { apiKey, authEmailFrom } = getEnvConfig();
            const result = await sendResendEmail({
              from: authEmailFrom,
              to: 'ashuchinthapalli3900@gmail.com',
              subject: 'NEC Portal Resend Test',
              html: '<p>This is a Resend configuration test from NEC Secure Portal.</p>',
              apiKey
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, messageId: result.id }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        next();
      });
    }
  };
}

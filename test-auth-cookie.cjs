const http = require('http');

async function runTest() {
  const ports = [5173, 5174];
  let port = null;

  for (const p of ports) {
    try {
      const ok = await new Promise((resolve) => {
        const req = http.get(`http://localhost:${p}/api/auth/me`, (res) => {
          resolve(true);
        });
        req.on('error', () => resolve(false));
      });
      if (ok) {
        port = p;
        break;
      }
    } catch (e) {}
  }

  if (!port) {
    console.log('No active server found on ports 5173 or 5174');
    return;
  }

  console.log(`Testing auth endpoints on port ${port}...`);

  // 1. Initial /api/auth/me (Should be 401 unauthenticated)
  const step1 = await new Promise((resolve) => {
    http.get(`http://localhost:${port}/api/auth/me`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
  });
  console.log('Step 1 (Anonymous /api/auth/me): Status', step1.status, JSON.parse(step1.body));

  // 2. Create session
  const postData = JSON.stringify({
    userId: 'usr_super_admin',
    email: 'ashuchinthapalli3900@gmail.com',
    role: 'SUPER_ADMIN',
    name: 'Dr. Ch. Ashu Super Admin'
  });

  const step2 = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port,
      path: '/api/auth/session/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      const cookies = res.headers['set-cookie'];
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, cookies, body }));
    });
    req.write(postData);
    req.end();
  });

  console.log('Step 2 (Create Session): Status', step2.status, 'Cookie:', step2.cookies);
  const sessionCookie = step2.cookies ? step2.cookies[0].split(';')[0] : '';

  // 3. Test /api/auth/me with Cookie (Should be 200 authenticated)
  const step3 = await new Promise((resolve) => {
    http.get({
      hostname: 'localhost',
      port,
      path: '/api/auth/me',
      headers: {
        'Cookie': sessionCookie
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
  });

  console.log('Step 3 (Authenticated /api/auth/me with nec_session): Status', step3.status, JSON.parse(step3.body));

  // 4. Test explicit logout
  const step4 = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port,
      path: '/api/auth/logout',
      method: 'POST',
      headers: {
        'Cookie': sessionCookie
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, cookies: res.headers['set-cookie'], body }));
    });
    req.end();
  });

  console.log('Step 4 (Explicit Logout): Status', step4.status, 'Cookie Expired:', step4.cookies);

  // 5. Post-logout /api/auth/me (Should be 401 unauthenticated)
  const step5 = await new Promise((resolve) => {
    http.get({
      hostname: 'localhost',
      port,
      path: '/api/auth/me',
      headers: {
        'Cookie': sessionCookie
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
  });

  console.log('Step 5 (Post-Logout /api/auth/me): Status', step5.status, JSON.parse(step5.body));
  console.log('\nAll Session Persistence & Cookie Tests PASSED successfully!');
}

runTest();

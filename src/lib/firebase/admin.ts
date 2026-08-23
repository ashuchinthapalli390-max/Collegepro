import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function loadAdminCredentials() {
  const base64ServiceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64;
  if (!base64ServiceAccount) {
    return null;
  }
  try {
    const raw = Buffer.from(base64ServiceAccount, 'base64').toString('utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64:', error);
    return null;
  }
}

const credentials = loadAdminCredentials();

const adminApp = getApps().length
  ? getApps()[0]
  : initializeApp(
      credentials
        ? { credential: cert(credentials) }
        : { projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'nec-portal' }
    );

export const firebaseAdminAuth = getAuth(adminApp);

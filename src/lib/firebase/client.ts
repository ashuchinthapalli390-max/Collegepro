import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Support both Next.js (process.env) and Vite (import.meta.env)
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : (typeof process !== 'undefined' ? process.env : {});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAZR8HTcHLh9EGXhTI442w8fXfrsYhkOII",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nec-college-b964a.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nec-college-b964a",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nec-college-b964a.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "307846525229",
  appId: env.VITE_FIREBASE_APP_ID || env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:307846525229:web:18f0e37c709bb5271fe3a4",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-0CNT5HXV9Y"
};

// Initialize Firebase App instance singleton
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firebase Auth client instance
export const firebaseAuth = getAuth(firebaseApp);

// Google Auth Provider configured for Google Sign-In only
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

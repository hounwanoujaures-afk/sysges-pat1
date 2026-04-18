// lib/firebase.js
// ============================================================
// Configuration Firebase pour SysGeS-PAT
// Initialise Firebase App, Auth et Firestore
// ============================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Configuration Firebase (injectée via variables d'environnement Vercel)
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Évite la réinitialisation lors du hot-reload Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Services exportés
export const auth = getAuth(app);
export const db   = getFirestore(app);

// Analytics (uniquement côté client/browser)
export const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

export default app;

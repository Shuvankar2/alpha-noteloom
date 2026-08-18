// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Determine authDomain: on Vercel/custom domain use current hostname so /__/auth is same-origin via Vercel proxy
const isBrowser = typeof window !== 'undefined';
const isLocal = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const dynamicAuthDomain = isBrowser && !isLocal
  ? window.location.hostname
  : 'erp-notes-solutions.firebaseapp.com';

const firebaseConfig = {
  apiKey: "AIzaSyDpHB7q-rERKFK7Y8U__B3LBZ72BOLclTU",
  authDomain: dynamicAuthDomain,
  projectId: "erp-notes-solutions",
  storageBucket: "erp-notes-solutions.firebasestorage.app",
  messagingSenderId: "690817086461",
  appId: "1:690817086461:web:deb62720d2e3e01276df94"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((e) => console.warn("Persistence error:", e));

export const db = getFirestore(app);
export const storage = getStorage(app);

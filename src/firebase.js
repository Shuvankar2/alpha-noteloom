// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// IMPORTANT: Using the keys provided
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDpHB7q-rERKFK7Y8U__B3LBZ72BOLclTU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "erp-notes-solutions.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "erp-notes-solutions",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "erp-notes-solutions.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "690817086461",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:690817086461:web:deb62720d2e3e01276df94"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

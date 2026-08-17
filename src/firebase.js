// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// IMPORTANT: Using the keys provided
const firebaseConfig = {
  apiKey: "AIzaSyDpHB7q-rERKFK7Y8U__B3LBZ72BOLclTU",
  authDomain: "erp-notes-solutions.firebaseapp.com",
  projectId: "erp-notes-solutions",
  storageBucket: "erp-notes-solutions.firebasestorage.app",
  messagingSenderId: "690817086461",
  appId: "1:690817086461:web:deb62720d2e3e01276df94"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

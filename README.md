
Note Loom — Fullstack (Frontend + Firebase)
===========================================

This project is a combined frontend + Firebase scaffold using:
- Vite + React
- Tailwind CSS
- Framer Motion
- Firebase (Auth, Firestore, Storage)
- lucide-react icons

What you need to do:
1. Create a Firebase project at https://console.firebase.google.com/
2. Add a Web App and copy its configuration object into `src/firebase.js`
3. Enable Authentication -> Email/Password and Google provider (if you want Google Sign-In)
4. Create a Firestore database and enable read/write (for development you can start in test mode)
5. (Optional) Enable Firebase Storage if you want file upload support

Run locally:
  npm install
  npm run dev

Build:
  npm run build
  npm run preview

Notes:
- The project uses Firestore collections named: announcements, theory, subjects, labs, doubt, support, etc.
- Security: For production, set proper Firestore security rules to enforce role-based access.

Generated at: 2025-08-28T08:59:01.112752 UTC

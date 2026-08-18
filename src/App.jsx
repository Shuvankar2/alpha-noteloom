import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn,
  UserPlus,
  Shield,
  Sun,
  Moon,
  ChevronDown,
  ArrowLeft,
  Mail,
  Lock,
  School,
  ClipboardList,
  HelpCircle,
  MessageSquare,
  BookOpen,
  FlaskConical,
  Phone,
  Upload,
  Users,
  Settings,
  PenBoxIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, db } from "./firebase";

import {
  FileText,
  FileImage,
  FileVideo,
  FileArchive,
  Globe,
  File,
} from "lucide-react";

const getFileIcon = (link = "", fileName = "") => {
  const name = (fileName || link || "").toLowerCase();

  if (name.endsWith(".pdf"))
    return <FileText className="w-10 h-10 text-red-600" />;
  if (name.endsWith(".doc") || name.endsWith(".docx"))
    return <FileText className="w-10 h-10 text-blue-600" />;
  if (name.endsWith(".ppt") || name.endsWith(".pptx"))
    return <FileText className="w-10 h-10 text-orange-600" />;
  if (name.endsWith(".xls") || name.endsWith(".xlsx"))
    return <FileText className="w-10 h-10 text-green-600" />;
  if (
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png") ||
    name.endsWith(".gif")
  )
    return <FileImage className="w-10 h-10 text-purple-600" />;
  if (name.endsWith(".mp4") || name.endsWith(".avi") || name.endsWith(".mov"))
    return <FileVideo className="w-10 h-10 text-pink-600" />;
  if (name.endsWith(".zip") || name.endsWith(".rar"))
    return <FileArchive className="w-10 h-10 text-yellow-600" />;

  // Default for any unknown/website links
  return <Globe className="w-10 h-10 text-gray-600" />;
};

const DEPARTMENTS = [
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "ME",
  "CE",
  "AIML",
  "Data Science",
  "BBA",
  "MBA",
  "MCA",
  "Biotech",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Humanities",
];

function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("iem_theme") || "light"
  );
  useEffect(() => {
    localStorage.setItem("iem_theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return { theme, setTheme };
}

export default function App() {
  const { theme, setTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // onAuthStateChanged: fires on every auth state change (login, logout, token refresh).
    // Also fires once on mount if there's a persisted session (e.g. after Google popup).
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        let profile = { email: u.email, role: "Student", fullName: u.displayName || u.email };
        try {
          const snap = await getDoc(doc(db, "users", u.uid));
          if (snap.exists()) {
            profile = { ...profile, ...snap.data() };
          }
        } catch (err) {
          console.warn("Firestore profile fetch error:", err);
        }
        setCurrentUser({ uid: u.uid, ...profile });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dbe7fb] to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      <Topbar
        theme={theme}
        onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
        currentUser={currentUser}
        onSignOut={async () => {
          await signOut(auth);
          setCurrentUser(null);
          navigate("/");
        }}
      />
      <main className="max-w-6xl mx-auto px-4 pb-16">
        <Routes>
          <Route
            path="/"
            element={
              <Landing
                currentUser={currentUser}
                onLogin={() => navigate(currentUser ? "/dashboard" : "/login")}
              />
            }
          />
          <Route path="/login" element={<AuthLogin currentUser={currentUser} />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/signup/student" element={<SignupStudent currentUser={currentUser} />} />
          <Route path="/signup/faculty" element={<SignupFaculty currentUser={currentUser} />} />
          <Route path="/signup/admin" element={<SignupAdmin currentUser={currentUser} />} />
          <Route
            path="/dashboard"
            element={<DashboardPortal currentUser={currentUser} />}
          />
          <Route
            path="/dashboard/*"
            element={<DashboardPortal currentUser={currentUser} />}
          />
        </Routes>
      </main>
    </div>
  );
}

/* ---------- Topbar ---------- */
function Topbar({ theme, onToggleTheme, currentUser, onSignOut }) {
  return (
    <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[#FFF6E6]/60 dark:supports-[backdrop-filter]:bg-slate-900/60 border-b border-slate-200/40 dark:border-slate-700/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent"
        >
          Note Loom
        </Link>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          Alpha
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-80">
                {currentUser.fullName || currentUser.email} ({currentUser.role})
              </span>
              <button
                onClick={onSignOut}
                className="px-3 py-1.5 rounded-xl text-sm bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-xl text-sm bg-indigo-600 text-white"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Landing ---------- */
function Landing({ onLogin }) {
  return (
    <div className="relative overflow-hidden rounded-3xl mt-8 border border-slate-200 dark:border-slate-700 shadow-xl">
      <TileBackground />
      <div className="relative z-10 p-10 sm:p-16 lg:p-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
              Note Loom
            </span>
            .
          </h1>
          <h3 className="text-lg sm:text-xl mt-4 opacity-90">
            {" "}
            {/*Your one step platform to crack exams with*/}{" "}
            <span className="font-semibold">Exams Made Simple</span>.
          </h3>
          <button
            onClick={onLogin}
            className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow hover:scale-[1.01] transition"
          >
            <LogIn className="w-5 h-5" /> Login to Continue
          </button>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/30 dark:from-slate-950/40 dark:to-slate-900/20" />
    </div>
  );
}

function TileBackground() {
  return (
    <div className="absolute inset-0 -z-0 pointer-events-none [transform:skewY(-8deg)]">
      <div className="absolute -inset-20 opacity-70">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 animate-[scrollY_12s_linear_infinite]">
          {Array.from({ length: 6 }).map((_, row) => (
            <div key={`row-${row}`} className="contents">
              {DEPARTMENTS.map((d, i) => (
                <div
                  key={`${d}-${i}-${row}`}
                  className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/50 backdrop-blur p-4 text-center text-sm shadow"
                >
                  {d}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <style>
        {`@keyframes scrollY {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-50%); }
        }`}
      </style>
    </div>
  );
}

/* ---------- Auth Login ---------- */
function AuthLogin({ currentUser }) {
  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LogIn className="w-6 h-6" /> Login
          </h2>
          <p className="text-sm mt-1 opacity-80">
            Choose your role and enter credentials.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="mt-1 relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="youemail@email.in"
                  className="w-full px-4 py-3 pr-28 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <RoleSelect role={role} setRole={setRole} />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="mt-1 flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden relative">
                <div className="px-3 opacity-70">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-3 pr-10 bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="p-3 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 rounded-2xl bg-indigo-600 text-white shadow hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="flex justify-between items-center mt-4 text-sm">
            <Link to="/signup/student" className="underline">
              Sign up
            </Link>
            <Link to="/forgot" className="underline">
              Forgot password?
            </Link>
          </div>
          <div className="mt-3 text-xs opacity-80 space-x-3">
            <Link to="/signup/faculty" className="underline">
              Faculty Signup
            </Link>
            <Link to="/signup/admin" className="underline">
              IT Admin Signup
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur">
          <h3 className="font-semibold">Quick actions</h3>
          <p className="mt-2 text-sm opacity-80">Or sign in with Google</p>
          <GoogleSignIn currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}

function RoleSelect({ role, setRole }) {
  const [open, setOpen] = useState(false);
  const roles = ["Student", "Faculty", "IT Admin"];
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="m-1 mr-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
      >
        {role} <ChevronDown className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-2 mt-1 w-36 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg overflow-hidden z-20"
          >
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  role === r ? "font-semibold" : ""
                }`}
              >
                {r}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Google Sign In ---------- */
function GoogleSignIn({ currentUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  // Handle return from signInWithRedirect (only when user clicked the redirect link)
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (res) => {
        if (!res?.user) return;
        const u = res.user;
        try {
          const userRef = doc(db, "users", u.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              email: u.email,
              fullName: u.displayName || u.email,
              role: "Student",
              createdAt: new Date(),
            });
          }
        } catch (e) {
          console.warn("Firestore redirect profile:", e);
        }
        navigate("/dashboard", { replace: true });
      })
      .catch((err) => {
        if (err.code !== "auth/no-auth-event") {
          setErrorMsg(`Redirect sign-in error (${err.code}): ${err.message}`);
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePopup = async () => {
    setLoading(true);
    setErrorMsg("");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const res = await signInWithPopup(auth, provider);
      const u = res.user;
      let profile = { email: u.email, role: "Student", fullName: u.displayName || u.email };
      try {
        const userRef = doc(db, "users", u.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            email: u.email,
            fullName: u.displayName || u.email,
            role: "Student",
            createdAt: new Date(),
          });
        } else {
          profile = { ...profile, ...snap.data() };
        }
      } catch (docErr) {
        console.warn("Firestore profile creation warning:", docErr);
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Google popup sign-in error:", err.code, err.message);
      if (err.code === "auth/popup-blocked") {
        setErrorMsg(
          "🚫 Popup was blocked by your browser. Please allow popups for this site in your browser settings, or use the 'Sign in via Redirect' link below."
        );
      } else if (err.code === "auth/popup-closed-by-user") {
        // User intentionally closed popup — no error shown
        setErrorMsg("");
      } else if (err.code === "auth/unauthorized-domain") {
        setErrorMsg(
          "❌ Domain Unauthorized. Add '" +
            window.location.hostname +
            "' to Firebase Console → Authentication → Settings → Authorized Domains."
        );
      } else {
        setErrorMsg(`Google Sign-In Error (${err.code}): ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = async () => {
    setLoading(true);
    setErrorMsg("");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      await signInWithRedirect(auth, provider);
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <button
        type="button"
        onClick={handlePopup}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition font-medium text-sm disabled:opacity-50 cursor-pointer shadow-sm"
      >
        {loading ? (
          <span>Connecting to Google...</span>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleRedirect}
        disabled={loading}
        className="w-full text-center text-xs text-indigo-600 dark:text-indigo-400 hover:underline py-1 cursor-pointer"
      >
        Popup issues? Click here to Sign in via Redirect
      </button>

      {errorMsg && (
        <div className="mt-3 p-3 rounded-xl text-xs bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 break-words">
          {errorMsg}
        </div>
      )}
    </div>
  );
}

/* ---------- Forgot Password ---------- */
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMsg("Password reset email sent.");
    } catch (err) {
      setErr(err.message);
    }
  };
  return (
    <div className="mt-8 max-w-xl">
      <Link
        to="/login"
        className="mb-4 inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </Link>
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur">
        <h2 className="text-2xl font-bold">Reset password</h2>
        <p className="text-sm opacity-80">
          Enter your email to receive a reset link.
        </p>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="mt-1 flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden">
              <div className="px-3 opacity-70">
                <Mail className="w-4 h-4" />
              </div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="you@college.edu"
                className="w-full px-3 py-2 bg-transparent outline-none"
              />
            </div>
          </div>
          <button className="px-5 py-2 rounded-2xl bg-indigo-600 text-white">
            Send reset email
          </button>
          {msg && (
            <div className="mt-3 p-3 rounded-xl text-sm bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
              {msg}
            </div>
          )}
          {err && (
            <div className="mt-3 p-3 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
              {err}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/* ---------- Signup Student ---------- */
function SignupStudent() {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    gender: "",
    college: "",
    year: "1st",
    semester: 1,
    stream: "",
    department: DEPARTMENTS[0],
    roll: "",
    password: "",
    retype: "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const sendCode = async () => {
    // demo code behaviour: skip real email OTP; in prod use Firebase Functions or third-party
    const c = Math.floor(100000 + Math.random() * 900000).toString();
    setMsg(`Demo verification code: ${c} (enter this in the next step)`);
    // store code in localStorage keyed by email
    localStorage.setItem(`iem_verif_${form.email}`, c);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (form.password.length < 6)
      return setErr("Password must be at least 6 characters");
    if (form.password !== form.retype) return setErr("Passwords do not match");
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await setDoc(doc(db, "users", cred.user.uid), {
        email: form.email,
        fullName: form.fullName,
        role: "Student",
        college: form.college,
        gender: form.gender,
        year: form.year,
        semester: form.semester,
        stream: form.stream,
        department: form.department,
        roll: form.roll,
        createdAt: new Date(),
      });
      setMsg("Signup successful. Redirecting...");
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (err) {
      setErr(err.message);
    }
  };

  const googleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", res.user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          email: res.user.email,
          fullName: res.user.displayName,
          role: "Student",
          createdAt: new Date(),
        });
      }
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <div className="mt-8">
      <Link
        to="/login"
        className="mb-4 inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UserPlus className="w-6 h-6" /> Student Signup
        </h2>
        <form onSubmit={submit} className="mt-6 grid md:grid-cols-2 gap-4">
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <Field
            label="Full name"
            value={form.fullName}
            onChange={(v) => setForm({ ...form, fullName: v })}
          />
          <Field
            label="Gender"
            value={form.gender}
            onChange={(v) => setForm({ ...form, gender: v })}
            placeholder="Male/Female/Other"
          />
          <Field
            label="College"
            value={form.college}
            onChange={(v) => setForm({ ...form, college: v })}
          />
          <Select
            label="Year"
            options={["1st", "2nd", "3rd", "4th"]}
            value={form.year}
            onChange={(v) => setForm({ ...form, year: v })}
          />
          <Select
            label="Semester"
            options={[1, 2, 3, 4, 5, 6, 7, 8]}
            value={form.semester}
            onChange={(v) => setForm({ ...form, semester: v })}
          />
          <Field
            label="Stream"
            value={form.stream}
            onChange={(v) => setForm({ ...form, stream: v })}
          />
          <Select
            label="Department"
            options={DEPARTMENTS}
            value={form.department}
            onChange={(v) => setForm({ ...form, department: v })}
          />
          <Field
            label="Roll number"
            value={form.roll}
            onChange={(v) => setForm({ ...form, roll: v })}
          />
          <div className="md:col-span-2 flex gap-2">
            <button
              type="button"
              onClick={sendCode}
              className="px-4 py-2 rounded-2xl border"
            >
              Send verification code (demo)
            </button>
            <div className="flex-1"></div>
          </div>
          <Field
            label="Create password"
            type="password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
          />
          <Field
            label="Retype password"
            type="password"
            value={form.retype}
            onChange={(v) => setForm({ ...form, retype: v })}
          />
          <div className="md:col-span-2 flex flex-wrap gap-3 mt-2">
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-indigo-600 text-white"
            >
              Create account
            </button>
            <button
              type="button"
              onClick={googleSignup}
              className="px-5 py-3 rounded-2xl bg-white text-slate-900 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              Sign up with Google
            </button>
          </div>
        </form>
        {msg && (
          <div className="mt-4 p-3 rounded-xl text-sm bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
            {msg}
          </div>
        )}
        {err && (
          <div className="mt-2 p-3 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            {err}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Signup Faculty ---------- */
function SignupFaculty() {
  const [form, setForm] = useState({
    fullName: "",
    college: "",
    department: DEPARTMENTS[0],
    contactEmail: "",
    phone: "",
    subjects: [],
    password: "",
    retype: "",
  });
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const SUBJECTS_SAMPLE = [
    "Signals & Systems",
    "Power Electronics",
    "Control Systems",
    "DBMS",
    "OS",
    "Networks",
    "Thermodynamics",
  ];

  const toggleSubject = (s) =>
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(s)
        ? f.subjects.filter((x) => x !== s)
        : [...f.subjects, s],
    }));
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.retype) return setErr("Passwords do not match");
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.contactEmail,
        form.password
      );
      await setDoc(doc(db, "users", cred.user.uid), {
        email: form.contactEmail,
        fullName: form.fullName,
        role: "Faculty",
        college: form.college,
        department: form.department,
        subjects: form.subjects,
        phone: form.phone,
        createdAt: new Date(),
      });
      navigate("/login");
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <div className="mt-8">
      <Link
        to="/login"
        className="mb-4 inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <School className="w-6 h-6" /> Faculty Signup
        </h2>
        <form onSubmit={submit} className="mt-6 grid md:grid-cols-2 gap-4">
          <Field
            label="Full name"
            value={form.fullName}
            onChange={(v) => setForm({ ...form, fullName: v })}
          />
          <Field
            label="College"
            value={form.college}
            onChange={(v) => setForm({ ...form, college: v })}
          />
          <Select
            label="Department"
            options={DEPARTMENTS}
            value={form.department}
            onChange={(v) => setForm({ ...form, department: v })}
          />
          <Field
            label="Contact email"
            type="email"
            value={form.contactEmail}
            onChange={(v) => setForm({ ...form, contactEmail: v })}
          />
          <Field
            label="Phone number"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              Subjects (multi-select)
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUBJECTS_SAMPLE.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSubject(s)}
                  className={`px-3 py-1.5 rounded-2xl border ${
                    form.subjects.includes(s)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Field
            label="Create password"
            type="password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
          />
          <Field
            label="Retype password"
            type="password"
            value={form.retype}
            onChange={(v) => setForm({ ...form, retype: v })}
          />
          <div className="md:col-span-2">
            <button className="px-5 py-3 rounded-2xl bg-indigo-600 text-white">
              Create account
            </button>
          </div>
        </form>
        {err && (
          <div className="mt-2 p-3 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            {err}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Signup Admin ---------- */
function SignupAdmin() {
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    contactEmail: "",
    password: "",
    retype: "",
  });
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.retype) return setErr("Passwords do not match");
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.contactEmail,
        form.password
      );
      await setDoc(doc(db, "users", cred.user.uid), {
        email: form.contactEmail,
        fullName: form.fullName,
        role: "IT Admin",
        gender: form.gender,
        createdAt: new Date(),
      });
      navigate("/login");
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <div className="mt-8">
      <Link
        to="/login"
        className="mb-4 inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6" /> IT Admin Signup
        </h2>
        <form onSubmit={submit} className="mt-6 grid md:grid-cols-2 gap-4">
          <Field
            label="Full name"
            value={form.fullName}
            onChange={(v) => setForm({ ...form, fullName: v })}
          />
          <Field
            label="Gender"
            value={form.gender}
            onChange={(v) => setForm({ ...form, gender: v })}
          />
          <Field
            label="Contact email"
            type="email"
            value={form.contactEmail}
            onChange={(v) => setForm({ ...form, contactEmail: v })}
          />
          <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
            <Field
              label="Create password"
              type="password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
            />
            <Field
              label="Retype password"
              type="password"
              value={form.retype}
              onChange={(v) => setForm({ ...form, retype: v })}
            />
          </div>
          <div className="md:col-span-2">
            <button className="px-5 py-3 rounded-2xl bg-indigo-600 text-white">
              Create account
            </button>
          </div>
        </form>
        {err && (
          <div className="mt-2 p-3 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            {err}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Dashboard Portal ---------- */
function DashboardPortal({ currentUser }) {
  if (!currentUser)
    return (
      <div className="mt-8">
        <p className="opacity-80">Loading or not authenticated...</p>
      </div>
    );
  if (currentUser.role === "Student")
    return <StudentDashboard user={currentUser} />;
  if (currentUser.role === "Faculty")
    return <FacultyDashboard user={currentUser} />;
  return <AdminDashboard user={currentUser} />;
}

/* ---------- CardButton ---------- */
function CardButton({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 shadow hover:shadow-lg hover:-translate-y-0.5 transition text-left"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          {subtitle && <div className="text-xs opacity-70">{subtitle}</div>}
        </div>
      </div>
    </button>
  );
}

/* ---------- Student Dashboard ---------- */
function StudentDashboard({ user }) {
  const [active, setActive] = useState(null);
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">
        Welcome, {user.fullName || user.email}
      </h2>
      <p className="opacity-80">Student Dashboard</p>
      {!active && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <CardButton
            icon={ClipboardList}
            title="Announcement"
            subtitle="Latest updates"
            onClick={() => setActive("announce")}
          />
          <CardButton
            icon={HelpCircle}
            title="Support"
            subtitle="Get help"
            onClick={() => setActive("support")}
          />
          <CardButton
            icon={MessageSquare}
            title="Doubt"
            subtitle="Ask & discuss"
            onClick={() => setActive("doubt")}
          />
          <CardButton
            icon={BookOpen}
            title="Theory"
            subtitle="Materials by faculty"
            onClick={() => setActive("theory")}
          />
          <CardButton
            icon={FlaskConical}
            title="Labs"
            subtitle="Experiments & records"
            onClick={() => setActive("labs")}
          />
          <CardButton
            icon={PenBoxIcon}
            title="Short Notes"
            subtitle="Last minute revisions"
            onClick={() => setActive("short-notes")}
          />
          <CardButton
            icon={Phone}
            title="Contact"
            subtitle="Reach out"
            onClick={() => setActive("contact")}
          />
        </div>
      )}
      {active && (
        <ModuleView
          type={active}
          onBack={() => setActive(null)}
          role="Student"
          user={user}
        />
      )}
    </div>
  );
}

/* ---------- Faculty Dashboard ---------- */
function FacultyDashboard({ user }) {
  const [active, setActive] = useState(null);
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">
        Welcome, {user.fullName || user.email}
      </h2>
      <p className="opacity-80">Faculty Dashboard</p>
      {!active && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <CardButton
            icon={ClipboardList}
            title="Announcement"
            subtitle="Broadcast to students"
            onClick={() => setActive("announce")}
          />
          <CardButton
            icon={HelpCircle}
            title="Support"
            subtitle="Help requests"
            onClick={() => setActive("support")}
          />
          <CardButton
            icon={MessageSquare}
            title="Student Doubts"
            subtitle="Answer queries"
            onClick={() => setActive("doubt")}
          />
          <CardButton
            icon={BookOpen}
            title="Theory"
            subtitle="Materials by faculty"
            onClick={() => setActive("theory")}
          />
          <CardButton
            icon={FlaskConical}
            title="Labs"
            subtitle="Experiments & records"
            onClick={() => setActive("labs")}
          />
          <CardButton
            icon={PenBoxIcon}
            title="Short Notes"
            subtitle="Last minute revisions"
            onClick={() => setActive("short-notes")}
          />
        </div>
      )}
      {active && (
        <ModuleView
          type={active}
          onBack={() => setActive(null)}
          role="Faculty"
          user={user}
        />
      )}
    </div>
  );
}

/* ---------- Admin Dashboard ---------- */
function AdminDashboard({ user }) {
  const [active, setActive] = useState(null);
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">
        Welcome, {user.fullName || user.email}
      </h2>
      <p className="opacity-80">Admin Dashboard</p>
      {!active && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <CardButton
            icon={Users}
            title="User Management"
            subtitle="Approve/Block"
            onClick={() => setActive("users")}
          />
          <CardButton
            icon={ClipboardList}
            title="Admin Controls"
            subtitle="Global announcements"
            onClick={() => setActive("announce")}
          />
          <CardButton
            icon={Settings}
            title="Tools"
            subtitle="Maintenance"
            onClick={() => setActive("tools")}
          />
        </div>
      )}
      {active && (
        <ModuleView
          type={active}
          onBack={() => setActive(null)}
          role="IT Admin"
          user={user}
        />
      )}
    </div>
  );
}

/* ---------- ModuleView (with Firestore integration) ---------- */
function ModuleView({ type, onBack, role, user }) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    // subscribe to collection for this module
    const colRef = collection(db, `${type}`);
    const q = query(colRef, orderBy("ts", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => console.error(err)
    );
    return () => unsub();
  }, [type]);

  const canUpload =
  (role === "Faculty" &&
    (["theory", "labs", "doubt", "short-notes", "announce"].includes(type))) ||
  (role === "Student" && type === "doubt");

  const canComment =
  (role === "Student" &&
    (["theory", "labs", "doubt"].includes(type)));



  const doUpload = async () => {
    if (!text.trim() && !file) return;
    let fileUrl = "";

    if (file) {
  const formData = new FormData();

  // if file is a FileList, pick first element
  const selectedFile = file instanceof FileList ? file[0] : file;
  formData.append("file", selectedFile);

      const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");
      const res = await fetch(`${backendUrl}/upload`, {
        // 👈 backend endpoint
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("File upload failed");

      const data = await res.json();
      fileUrl = data.url; // OneDrive share link from backend
    }

    await addDoc(collection(db, type), {
      text,
      link: link || fileUrl || "",
      ts: Date.now(),
      author: user?.email || "unknown",
      fileName: file?.name || "",
    });

    setText("");
    setLink("");
    setFile(null);
  };

  return (
    <div className="mt-6">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Left Section (Items List) */}
  <div className="md:col-span-2 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 shadow">
    <h3 className="font-semibold capitalize">{type.replace("_", " ")}</h3>
    {items.length === 0 ? (
      <p className="text-sm opacity-70 mt-2">No items yet.</p>
    ) : (
      <ul className="mt-3 space-y-3">
        {items.map((it) => (
          <li
            key={it.id}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 shadow"
          >
            {/* Text/Description */}
            <div className="font-medium mb-2 break-words">{it.text}</div>

            {/* If link exists, show thumbnail card */}
            {it.link && (
              <div className="mt-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow p-3 flex items-center gap-3 hover:shadow-md transition flex-wrap">
                {/* Dynamic file icon */}
                <div className="flex-shrink-0">{getFileIcon(it.link, it.fileName)}</div>

                {/* File/link info */}
                <div className="flex-1 min-w-0 max-w-full">
                  <p className="text-sm font-semibold truncate">{it.fileName || it.text || "Resource"}</p>
                  <p className="text-xs text-gray-500 truncate">{it.link}</p>
                </div>

                {/* Open button */}
                <a
                  href={it.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex-shrink-0"
                >
                  Open
                </a>
              </div>
            )}

            {/* If file exists */}
            {it.fileName && <div className="text-xs opacity-80 mt-2">File: {it.fileName}</div>}

            {/* Timestamp + Author */}
            <div className="text-xs opacity-70 mt-1">{new Date(it.ts).toLocaleString()}</div>
            <div className="text-xs opacity-70 mt-1">By: {it.author}</div>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Right Section (Upload Form) */}
  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 shadow">
    <h4 className="font-semibold">{canUpload ? "Add / Upload" : "Post a Comment"}</h4>
    <div className="mt-3 space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={canUpload ? "Write announcement, note, or description..." : "Write your comment..."}
        className="w-full min-h-[100px] px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent resize-y"
      />
      {canUpload && (
        <>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Optional: document link (Drive, PDF, etc.)"
            className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent"
          />
          <div className="flex flex-col items-start gap-1">
  <input 
  type="file" 
  onChange={(e) => setFile(e.target.files[0])} 
/>

  {file && (
    <div className="text-xs opacity-80 break-all mt-1">
      Selected: {file.name}
    </div>
  )}
</div>

        </>
      )}
      <button
        onClick={doUpload}
        className="w-full px-4 py-2 rounded-2xl bg-indigo-600 text-white flex items-center justify-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {canUpload ? "Upload / Post" : "Comment"}
      </button>
    </div>
  </div>
</div>

    </div>
  );
}

/* ---------- UI helpers ---------- */
function Field({ label, value, onChange, type = "text", placeholder }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1 relative flex items-center">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pr-10 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
function Select({ label, options, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent"
      >
        {options.map((o, i) => (
          <option key={i} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

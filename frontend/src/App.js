import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from './api/axios';
import { ThemeProvider } from './context/ThemeContext';
import { syncTheme } from './api/themeSync';

// ─── EAGER IMPORTS (critical path — must load instantly) ──────────────────────
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import DonationPage from './pages/DonationPage';
import Overlay from './pages/Overlay';
import GoalOverlay from './pages/GoalOverlay';
import TugOfWarOverlay from './pages/TugOfWarOverlay';
import MasterOverlay from './pages/MasterOverlay';
import LiveThemeEngine from './components/LiveThemeEngine';

// ─── LAZY IMPORTS (code-split — only load when navigated to) ─────────────────
// Each of these creates a separate JS chunk, shrinking the initial bundle ~40%.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminSecurePortal = lazy(() => import('./pages/AdminSecurePortal'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// ─── BOOT SEQUENCE — Premium animated loading screen ─────────────────────────
const BootSequence = () => {
  const letters = 'DROPPAY PROTOCOL'.split('');
  return (
    <div className="fixed inset-0 bg-[#030a06] flex flex-col items-center justify-center gap-8 overflow-hidden">
      {/* Deep background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-cyan-900/15 blur-[100px] pointer-events-none" />

      {/* Central ring + logo */}
      <div className="relative flex items-center justify-center">
        {/* Outer slow pulse ring */}
        <div className="absolute w-32 h-32 rounded-full border border-emerald-500/10 animate-ping" style={{ animationDuration: '2.5s' }} />
        {/* Fast orbit ring */}
        <div className="absolute w-24 h-24 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 60%, #10B981 100%)',
            animation: 'spin 1.2s linear infinite',
            borderRadius: '50%'
          }}
        />
        {/* Inner ring border */}
        <div className="absolute w-24 h-24 rounded-full border border-white/5" />
        {/* Core logo badge */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)]">
          <span className="text-2xl font-black italic text-emerald-400 tracking-tighter">DP</span>
        </div>
      </div>

      {/* Staggered letter animation */}
      <div className="flex items-center gap-[3px]">
        {letters.map((char, i) => (
          <span
            key={i}
            className="text-[11px] font-black uppercase tracking-[0.25em] text-white/80"
            style={{
              animationName: 'fadeInUp',
              animationDuration: '0.4s',
              animationDelay: `${i * 0.04}s`,
              animationFillMode: 'both',
              opacity: 0,
              color: char === ' ' ? 'transparent' : undefined
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      {/* Scanning progress bar */}
      <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500/40 via-emerald-400 to-emerald-500/40 rounded-full"
          style={{ animation: 'scanBar 1.8s ease-in-out infinite' }}
        />
      </div>

      {/* Status text */}
      <p
        className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-500/50"
        style={{ animation: 'pulse 2s ease-in-out infinite' }}
      >
        Initializing Node...
      </p>

      {/* Keyframes injected inline */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanBar {
          0%   { width: 0%; left: 0; }
          50%  { width: 60%; left: 20%; }
          100% { width: 0%; left: 100%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};


// --- DYNAMIC INFRASTRUCTURE (Fixes Mobile Persistence) ---
// API_BASE is now handled by the centralized axios configuration in src/api/axios.js

// --- PROFESSIONAL GATE: SECURE UPLINK ---

const MissionGate = ({ children }) => {
  const [status, setStatus] = useState('loading');
  const [hasAccess, setHasAccess] = useState(false);
  const token = localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      if (!token) {
        setStatus('unauthorized');
        return;
      }
      try {
        const res = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // --- NEW: THEME SYNCHRONIZATION ---
        // Ensure backend theme preference is reflected in the frontend state
        syncTheme(res.data);

        // Checks both the new tier system and the legacy subscription status
        const isActiveTier = res.data.tier && res.data.tier !== 'none';
        const isLegacyActive = res.data.subscription?.status === 'active';

        setHasAccess(isActiveTier || isLegacyActive);
        setStatus('authorized');
      } catch (err) {
        if (err.response?.status === 429) {
          // If the rate limiter blocks the initialization check, assume the session is still active
          // rather than catastrophically logging the user out.
          setHasAccess(true);
          setStatus('authorized');
        } else {
          setStatus('unauthorized');
        }
      }
    };
    checkAccess();
  }, [token]);

  if (status === 'loading') return <BootSequence />;

  // If unauthorized, kick to login. If authorized but no sub, kick to subscription.
  if (status === 'unauthorized') return <Navigate to="/login" state={{ from: location }} replace />;
  return hasAccess ? children : <Navigate to="/subscription" replace />;
};

// --- ANIMATED ROUTE CONTROLLER ---
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    // Suspense wraps the entire route tree — lazy chunks resolve here
    <Suspense fallback={<BootSequence />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* 1. PUBLIC MARKETING & AUTH */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* 2. PUBLIC PROTOCOL LINKS */}
          <Route path="/pay/:streamerId" element={<DonationPage />} />

          {/* 3. OBS OVERLAY NODES */}
          <Route path="/overlay/:obsKey" element={<Overlay />} />
          <Route path="/goal/:streamerId" element={<GoalOverlay />} />
          <Route path="/overlay/tug-of-war/:obsKey" element={<TugOfWarOverlay />} />
          <Route path="/overlay/master/:obsKey" element={<MasterOverlay />} />

          {/* 4. USER ONBOARDING */}
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/subscribe" element={<Navigate to="/subscription" replace />} />

          {/* 5. ENTERPRISE ADMIN HUB */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/secure-portal" element={<AdminSecurePortal />} />

          {/* 6. SECURE DASHBOARD NEXUS */}
          <Route
            path="/dashboard"
            element={
              <MissionGate>
                <Dashboard />
              </MissionGate>
            }
          />

          {/* CATCH-ALL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

function AppContent() {
  const [nexusTheme, setNexusTheme] = useState(() => {
    return localStorage.getItem('nexusTheme') || 'void';
  });

  const location = useLocation();
  const isOverlay = location.pathname.includes('/overlay') || location.pathname.includes('/goal');

  // Listen for custom theme change events (fired from Dashboard)
  useEffect(() => {
    const handleThemeSync = (e) => {
      if (e.detail?.theme) {
        setNexusTheme(e.detail.theme);
      }
    };
    window.addEventListener('nexus-theme-change', handleThemeSync);

    // Apply classes to body for CSS-based themes
    const body = document.body;
    // Remove existing nexus themes but preserve light/dark
    const classes = Array.from(body.classList).filter(c => c.startsWith('theme-'));
    classes.forEach(c => body.classList.remove(c));

    if (nexusTheme !== 'void') {
      body.classList.add(`theme-${nexusTheme}`);
    }

    return () => window.removeEventListener('nexus-theme-change', handleThemeSync);
  }, [nexusTheme]);

  return (
    <div className={`min-h-screen relative overflow-hidden text-[var(--nexus-text)] selection:bg-emerald-500/30 bg-transparent`}>
      {!isOverlay && (
        <Helmet>
          <title>DropPay | The Ultimate Streamer Protocol</title>
          <meta name="description" content="Empower your stream with custom 3D alerts and optimized creator revenue." />
          <meta name="theme-color" content="#10B981" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Helmet>
      )}

      {/* GLOBAL LIVE THEME ENGINE */}
      {!isOverlay && <LiveThemeEngine currentTheme={nexusTheme} />}

      {/* MAIN APPLICATION CONTENT */}
      <div className="relative z-10 min-h-screen">
        <AnimatedRoutes />
      </div>

      {/* PROFESSIONAL NOTIFICATION LAYER */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;



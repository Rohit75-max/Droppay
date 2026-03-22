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
import LiveThemeEngine from './components/LiveThemeEngine';


// ─── LAZY IMPORTS (code-split — only load when navigated to) ─────────────────
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const DonationPage = lazy(() => import('./pages/DonationPage'));
const Overlay = lazy(() => import('./pages/Overlay'));
const GoalOverlay = lazy(() => import('./pages/GoalOverlay'));
const TugOfWarOverlay = lazy(() => import('./pages/TugOfWarOverlay'));
const MasterOverlay = lazy(() => import('./pages/MasterOverlay'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminSecurePortal = lazy(() => import('./pages/AdminSecurePortal'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// ─── ERROR BOUNDARY — catches any render crash, shows recovery UI not blank page ─
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('[DropPay] Render crash:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', fontFamily: 'sans-serif' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#10B981', letterSpacing: '-1px', fontStyle: 'italic' }}>DropPay</div>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Something went wrong. Please refresh the page.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 28px', background: '#10B981', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Refresh</button>
        </div>
      );
    }
    return this.props.children;
  }
}
// ─── MINIMAL BOOT SEQUENCE — Reusing Suspense fallback for seamless loading ───
const BootSequence = () => (
  <div className="fixed inset-0 bg-[#050505]" />
);


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
    // Use a minimal fallback — BootSequence as route fallback caused full loading screen
    // on every lazy page navigation (Dashboard, Admin, etc.)
    <Suspense fallback={<div className="fixed inset-0 bg-[#050505]" />}>
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
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 
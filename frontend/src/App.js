import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from './api/axios';
import { ThemeProvider } from './context/ThemeContext';
import { HUDProvider } from './context/HUDContext';
import { TechnicalHUD } from './components/ui/TechnicalHUD';
import { syncTheme } from './api/themeSync';
import { io } from 'socket.io-client';
import MaintenanceMode from './pages/system/Maintenance';
import { Logo } from './components/ui/Logo';

// ─── EAGER IMPORTS (critical path — must load instantly) ──────────────────────
import LiveThemeEngine from './components/dashboard/ThemeEngine';
import { TopBar } from './components/common/Loader';
import { Navbar } from './components/layout/Navbar';
import Home from './pages/public/Home';

// 🚨 GLOBAL SAFETY: AUTO-RELOAD ON CHUNK LOAD FAILURE (Fixes Vercel/Vite code-split crashes)
window.addEventListener('error', (e) => {
  if (e.message?.includes('ChunkLoadError') || e.message?.includes('Loading chunk')) {
    console.warn('⚡ [Drope] ChunkLoadError detected. Triggering hard reload...');
    window.location.reload();
  }
}, true);

// ─── LAZY IMPORTS (code-split — only load when navigated to) ─────────────────
const Login = lazy(() => import('./pages/public/Login'));
const Signup = lazy(() => import('./pages/public/Signup'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const DonationPage = lazy(() => import('./pages/public/DonationPage'));
const Overlay = lazy(() => import('./pages/overlays/Overlay'));
const GoalOverlay = lazy(() => import('./pages/overlays/Goal'));
const TugOfWarOverlay = lazy(() => import('./pages/overlays/TugOfWar'));
const MasterOverlay = lazy(() => import('./pages/overlays/Master'));
const Dashboard = lazy(() => import('./pages/creator/Dashboard'));
const AdminSecurePortal = lazy(() => import('./pages/admin/Dashboard'));
const ForgotPassword = lazy(() => import('./pages/public/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/public/ResetPassword'));
const Features = lazy(() => import('./pages/public/Features'));
const Pricing = lazy(() => import('./pages/public/Pricing'));
const Subscription = lazy(() => import('./pages/creator/Billing'));
const Blog = lazy(() => import('./pages/public/Blog'));

// ─── ERROR BOUNDARY — catches any render crash, shows recovery UI not blank page ─
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('[Drope] Render crash:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden font-sans">
          {/* Background Elements */}
          <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 via-transparent to-transparent pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center max-w-lg px-8 text-center"
          >
            <div className="mb-14 flex flex-col items-center">
              <Logo size="2rem" accentColor="#ff3b30" isLight={false} />
              <div className="flex items-center gap-2 mt-6">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-rose-500/80">System Interface Interrupt</span>
              </div>
            </div>

            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
              Interface Sync Failed
            </h2>
            
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-loose mb-12 max-w-sm">
              We encountered a non-recoverable render conflict. A clean handshake is required to restore terminal stability.
            </p>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()} 
              className="px-16 py-5 bg-white text-black font-black uppercase italic tracking-[0.3em] text-[10px] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:bg-[#afff00] transition-all"
            >
              Reload Interface
            </motion.button>
          </motion.div>

          {/* Technical Telemetry */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center opacity-30">
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-6 text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">
                <span className="flex items-center gap-2"><div className="w-1 h-1 bg-rose-500 rounded-full" /> CODE: CORE-402</span>
                <span>{'//'}</span>
                <span className="font-mono">NODE_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
              </div>
              <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}



// --- PROFESSIONAL GATE: SECURE UPLINK ---

const MissionGate = ({ children }) => {
  const [status, setStatus] = useState('loading');
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();
  // Ref: always holds the latest pathname without making it a reactive dep.
  // This lets checkAccess read the current path without re-running on every section switch.
  const pathnameRef = React.useRef(location.pathname);
  pathnameRef.current = location.pathname; // update synchronously on every render

  useEffect(() => {
    const checkAccess = async () => {
      if (!token) {
        setStatus('unauthorized');
        return;
      }
      try {
        const res = await axios.get('/api/user/profile');
        const user = res.data;

        // 1. ROLE-BASED EXTRACTION
        if (user.role === 'admin') {
          navigate('/admin/secure-portal');
          return;
        }

        syncTheme(user);

        // 2. SUBSCRIPTION HARD-LOCK (SENSE CHECK)
        // Read pathname from ref — avoids making location.pathname a reactive dependency
        const isEssentialPath = pathnameRef.current === '/subscription' || pathnameRef.current === '/dashboard';
        
        if (user.subscription?.status === 'inactive' && !isEssentialPath) {
          navigate('/subscription');
          return;
        }

        setStatus('authorized');
      } catch (err) {
        if (err.response?.status === 429) {
          setStatus('authorized');
        } else {
          setStatus('unauthorized');
        }
      }
    };
    checkAccess();
  }, [token, navigate]); // pathnameRef is a ref — not reactive, no ESLint warning

  if (status === 'loading') return <TopBar />;
  if (status === 'unauthorized') return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

// --- MASTER GATE: SECURE ADMIN CLEARANCE ---
const MasterGate = ({ children }) => {
  const [status, setStatus] = useState('loading');
  const token = localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!token) {
        setStatus('unauthorized');
        return;
      }
      try {
        const res = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Verify that the node has Admin Clearance
        if (res.data.role === 'admin') {
          setStatus('authorized');
        } else {
          setStatus('unauthorized');
        }
      } catch (err) {
        setStatus('unauthorized');
      }
    };
    checkAdminAccess();
  }, [token]);

  if (status === 'loading') return <TopBar />;
  if (status === 'unauthorized') return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return children;
};

// --- ANIMATED ROUTE CONTROLLER ---
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    // Use a minimal fallback — BootSequence as route fallback caused full loading screen
    // on every lazy page navigation (Dashboard, Admin, etc.)
    <Suspense fallback={<TopBar />}>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname.split('/')[1] || 'root'}>
          {/* 1. PUBLIC MARKETING & AUTH */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/subscription" element={
            <MissionGate>
              <Subscription />
            </MissionGate>
          } />
          <Route path="/blog" element={<Blog />} />

          {/* 2. PUBLIC PROTOCOL LINKS */}
          <Route path="/pay/:streamerId" element={<DonationPage />} />

          {/* 3. OBS OVERLAY NODES */}
          <Route path="/overlay/:obsKey" element={<Overlay />} />
          <Route path="/goal/:streamerId" element={<GoalOverlay />} />
          <Route path="/overlay/tug-of-war/:obsKey" element={<TugOfWarOverlay />} />
          <Route path="/overlay/master/:obsKey" element={<MasterOverlay />} />

          {/* 4. USER ONBOARDING (REMOVED) */}

          {/* 5. ENTERPRISE ADMIN HUB */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/secure-portal" 
            element={
              <MasterGate>
                <AdminSecurePortal />
              </MasterGate>
            } 
          />

          {/* 6. SECURE DASHBOARD NEXUS */}
          <Route
            path="/dashboard/*"
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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    axios.get('/api/user/status')
      .then(res => setIsPaused(res.data.isPaused))
      .catch(e => console.warn("Status Offline", e.message));

    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');
    socket.on('system_paused', () => setIsPaused(true));
    socket.on('system_resumed', () => setIsPaused(false));

    return () => {
      socket.off('system_paused');
      socket.off('system_resumed');
      socket.disconnect();
    };
  }, []);



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

  // Logic to hide Navbar on specific flows (Auth, Dashboard, Admin, Subscription & Overlays)
  const hideNavbarPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/dashboard', '/admin', '/subscription', '/pay'];
  const shouldHideNavbar = hideNavbarPaths.some(path => location.pathname.startsWith(path));

  // --- GLOBAL PRELOADER SYNCHRONIZATION ---
  const [isPreloading, setIsPreloading] = useState(location.pathname === '/');
  useEffect(() => {
    const handleBootComplete = () => setIsPreloading(false);
    window.addEventListener('drope-boot-complete', handleBootComplete);
    return () => window.removeEventListener('drope-boot-complete', handleBootComplete);
  }, []);

  return (
    <div className={`min-h-screen relative overflow-hidden text-[var(--nexus-text)] selection:bg-emerald-500/30 bg-transparent`}>
      {isPaused && !location.pathname.startsWith('/admin') && <MaintenanceMode />}

      {!isOverlay && (
        <Helmet>
          <title>DROPE | Supercharge Your Stream</title>
          <meta name="description" content="Empower your stream with custom 3D alerts and optimized creator revenue." />
          <meta name="theme-color" content="#10B981" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
      )}

      {/* GLOBAL LIVE THEME ENGINE */}
      {!isOverlay && <LiveThemeEngine currentTheme={nexusTheme} />}

      {/* GLOBAL NAVIGATION CONTROL */}
      {!isOverlay && !shouldHideNavbar && !isPreloading && <Navbar />}

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
      <HUDProvider>
        <ThemeProvider>
          <Router>
            <AppContent />
            <TechnicalHUD />
          </Router>
        </ThemeProvider>
      </HUDProvider>
    </ErrorBoundary>
  );
}

export default App; 
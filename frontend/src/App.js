import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

// --- PAGES ---
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SubscriptionPage from './pages/SubscriptionPage';
import DonationPage from './pages/DonationPage';
import Overlay from './pages/Overlay';
import GoalOverlay from './pages/GoalOverlay';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminSecurePortal from './pages/AdminSecurePortal';
import AdminLogin from './pages/AdminLogin';
import TugOfWarOverlay from './pages/TugOfWarOverlay';
import MasterOverlay from './pages/MasterOverlay';
import LiveThemeEngine from './components/LiveThemeEngine';

// --- DYNAMIC INFRASTRUCTURE (Fixes Mobile Persistence) ---
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001' 
  : 'https://droppay.onrender.com';

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
        const res = await axios.get(`${API_BASE}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

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

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--nexus-bg)] flex items-center justify-center text-[var(--nexus-text-muted)] font-black animate-pulse uppercase tracking-[0.3em]">
        Syncing Uplink...
      </div>
    );
  }

  // If unauthorized, kick to login. If authorized but no sub, kick to subscription.
  if (status === 'unauthorized') return <Navigate to="/login" state={{ from: location }} replace />;
  return hasAccess ? children : <Navigate to="/subscription" replace />;
};

// --- ANIMATED ROUTE CONTROLLER ---
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
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
        bench

        {/* 4. USER ONBOARDING (FIXED PATHS) */}
        {/* This matches the redirect in your Signup.jsx */}
        <Route path="/subscription" element={<SubscriptionPage />} />
        {/* Redirect alias so old /subscribe links still work */}
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

        {/* 6. GLOBAL REDIRECT PROTOCOL (CATCH-ALL) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
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
    <div className={`min-h-screen relative overflow-hidden text-[var(--nexus-text)] selection:bg-emerald-500/30 ${isOverlay ? 'bg-transparent' : (nexusTheme === 'void' ? 'bg-[var(--nexus-bg)]' : 'bg-transparent')}`}>
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
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


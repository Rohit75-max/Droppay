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
        const res = await axios.get('http://localhost:5001/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Checks both the new tier system and the legacy subscription status
        const isActiveTier = res.data.tier && res.data.tier !== 'none';
        const isLegacyActive = res.data.subscription?.status === 'active';
        
        setHasAccess(isActiveTier || isLegacyActive);
        setStatus('authorized');
      } catch (err) {
        setStatus('unauthorized');
      }
    };
    checkAccess();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-slate-500 font-black animate-pulse uppercase tracking-[0.3em]">
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

        {/* 4. USER ONBOARDING (FIXED PATHS) */}
        {/* This matches the redirect in your Signup.jsx */}
        <Route path="/subscription" element={<SubscriptionPage />} />
        {/* Redirect alias so old /subscribe links still work */}
        <Route path="/subscribe" element={<Navigate to="/subscription" replace />} />
        
        {/* 5. SECURE DASHBOARD NEXUS */}
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#050505] text-slate-100 selection:bg-emerald-500/30">
        <Helmet>
          <title>DropPay | The Ultimate Streamer Protocol</title>
          <meta name="description" content="Empower your stream with custom 3D alerts and optimized creator revenue." />
          <meta name="theme-color" content="#10B981" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Helmet>

        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
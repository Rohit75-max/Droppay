import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Pages
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

// PROFESSIONAL GATE: Handles all redirects before pages even load
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
        
        // Logical check for access
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

  if (status === 'unauthorized') return <Navigate to="/login" state={{ from: location }} replace />;
  
  // If user is logged in but has no tier, send them to subscribe
  return hasAccess ? children : <Navigate to="/subscribe" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/pay/:streamerId" element={<DonationPage />} />
        <Route path="/overlay/:obsKey" element={<Overlay />} />
        <Route path="/goal/:streamerId" element={<GoalOverlay />} />

        <Route path="/subscribe" element={<SubscriptionPage />} />
        <Route 
          path="/dashboard" 
          element={
            <MissionGate>
              <Dashboard />
            </MissionGate>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#050505] text-slate-100 selection:bg-indigo-500/30">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
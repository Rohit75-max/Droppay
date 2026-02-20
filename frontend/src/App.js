import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Pages
import Home from './pages/Home'; // NEW: Homepage added
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SubscriptionPage from './pages/SubscriptionPage'; 
import DonationPage from './pages/DonationPage';
import Overlay from './pages/Overlay';
import GoalOverlay from './pages/GoalOverlay';
import ForgotPassword from './pages/ForgotPassword'; 
import ResetPassword from './pages/ResetPassword';   

// ENHANCED: Protected Route with Subscription Check
const MissionGate = ({ children }) => {
  const [status, setStatus] = useState('loading');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const token = localStorage.getItem('token');

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
        setIsSubscribed(res.data.subscription?.status === 'active');
        setStatus('authorized');
      } catch (err) {
        setStatus('unauthorized');
      }
    };
    checkAccess();
  }, [token]);

  if (status === 'loading') return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-slate-500 font-black animate-pulse uppercase tracking-widest">Verifying Uplink...</div>;
  if (status === 'unauthorized') return <Navigate to="/login" replace />;
  
  return isSubscribed ? children : <Navigate to="/subscribe" replace />;
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="min-h-screen bg-[#050505] text-slate-100 selection:bg-indigo-500/30">
        <AnimatePresence mode="wait">
          <Routes>
            {/* 1. Public Branding & Auth Routes */}
            <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} /> 
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* 2. Public OBS/Payment Links */}
            <Route path="/pay/:streamerId" element={<DonationPage />} />
            <Route path="/overlay/:obsKey" element={<Overlay />} />
            <Route path="/goal/:streamerId" element={<GoalOverlay />} />

            {/* 3. Subscription Selection (Logged in but inactive users) */}
            <Route path="/subscribe" element={
              token ? <SubscriptionPage /> : <Navigate to="/login" />
            } />

            {/* 4. Protected Dashboard (Must be logged in AND active) */}
            <Route 
              path="/dashboard" 
              element={
                <MissionGate>
                  <Dashboard />
                </MissionGate>
              } 
            />

            {/* 5. Fallback Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
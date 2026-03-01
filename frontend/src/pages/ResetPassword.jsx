import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Lock, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams(); // Grabs the token from the URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    try {
      // Calling the reset-password endpoint we added to authRoutes
      await axios.post('/api/auth/reset-password', {
        token,
        newPassword
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      alert(err.response?.data?.msg || "Link expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#050505] text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-[2.5rem] bg-[#111] border border-white/5 shadow-2xl"
      >
        {!success ? (
          <>
            <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
              <ShieldCheck className="w-8 h-8 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">New Password</h1>
            <p className="text-slate-500 mb-8 font-medium">Create a strong password for your account.</p>

            <form onSubmit={handleReset} className="space-y-4">
              <div className="relative group">
                <Lock className="absolute left-4 top-4 text-slate-600 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-4 text-slate-600 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Password Updated</h2>
            <p className="text-slate-500">Your security has been verified. Redirecting you to login...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
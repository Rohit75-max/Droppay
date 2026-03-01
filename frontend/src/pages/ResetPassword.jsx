import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { Lock, Loader2, CheckCircle, ShieldCheck, ArrowLeft, Zap } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', {
        token,
        newPassword
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || "Link expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[550px] h-[550px] rounded-full bg-emerald-100/60 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-100/50 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[500px] rounded-[2.5rem] overflow-hidden bg-white border border-white/80 shadow-2xl"
        style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.8)' }}
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500" />

        <div className="p-6 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <Link to="/login" className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 hover:text-emerald-500 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Secure Node</span>
            </div>
          </div>

          {!success ? (
            <>
              <div className="space-y-2 mb-8">
                <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 leading-none">Reset Protocol.</h1>
                <p className="text-slate-400 text-sm font-medium">Define a new master passphrase for your creator node.</p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                    <Zap className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <p className="text-xs font-bold text-rose-600">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleReset} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Passphrase</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:border-emerald-500 outline-none transition-all text-sm font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Passphrase</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:border-emerald-500 outline-none transition-all text-sm font-bold"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs italic flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 mt-4 shadow-xl shadow-slate-200"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize New Key"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black italic uppercase text-slate-900 mb-2">Key Synchronized</h2>
              <p className="text-slate-400 text-sm font-medium">Your node security has been updated. Redirecting to auth portal...</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
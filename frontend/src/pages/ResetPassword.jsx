import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { Lock, Loader2, CheckCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';

// ─── Visual Component: Floating Shards ────────────────────────
const FloatingShard = ({ delay = 0, size = "w-24 h-24", top = "10%", left = "10%", rotate = "0deg" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.1, 0.2, 0.1],
      y: [0, -40, 0],
      rotate: [rotate, `${parseInt(rotate) + 15}deg`, rotate]
    }}
    transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, ease: "easeInOut", delay }}
    className={`absolute ${size} rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-[2px] pointer-events-none z-0`}
    style={{ top, left, rotate }}
  />
);

// ─── Visual Component: Scanline Effect ────────────────────────
const GlobalScanline = () => (
  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    <motion.div
      animate={{
        top: ['-100%', '100%'],
        opacity: [0.02, 0.05, 0.02]
      }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      className="absolute left-0 right-0 h-[40vh] bg-gradient-to-b from-transparent via-emerald-500/[0.05] to-transparent"
    />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90.1deg,rgba(255,0,0,0.02)_0%,rgba(0,255,0,0.01)_50.1%,rgba(0,0,255,0.02)_100%)] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
  </div>
);

// ─── Premium Input ────────────────────────────────────────────
const PremiumInput = ({ icon: Icon, label, value, onChange, placeholder, type = "password" }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-3">
      <label className={`flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-500 ${focused ? 'text-[#10B981]' : 'text-white/30'}`}>
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>
      <div className="relative group">
        <div className="relative">
          <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-500 ${focused ? 'text-[#10B981]' : 'text-white/20'}`} />
          <input
            type={type} value={value} onChange={onChange} required
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className={`w-full bg-black/40 border ${focused ? 'border-[#10B981]' : 'border-white/5'} rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none transition-all duration-500 backdrop-blur-md`}
          />
        </div>
      </div>
    </div>
  );
};

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
    <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden relative">
      <GlobalScanline />

      {/* Background Visuals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[-10%] left-[-5%] w-[60%] h-[70vh] bg-emerald-500/20 blur-[150px] rounded-full"
        />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60vh] bg-cyan-500/10 blur-[120px] rounded-full" />

        <FloatingShard size="w-32 h-32" top="15%" left="5%" rotate="12deg" delay={0.5} />
        <FloatingShard size="w-48 h-48" top="65%" left="85%" rotate="-15deg" delay={2} />
        <FloatingShard size="w-24 h-24" top="40%" left="15%" rotate="45deg" delay={1} />

        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[500px] rounded-[3.5rem] overflow-hidden bg-[#080808]/80 backdrop-blur-2xl border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-50" />

        <div className="p-8 sm:p-12 text-right">
          <div className="flex items-center justify-end mb-12">
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/80">Secure Session</span>
            </div>
          </div>

          {!success ? (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-2 mb-10 text-left"
              >
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-black italic tracking-tighter text-white leading-none uppercase">Reset<br /><span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-600">Password.</span></h1>
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-emerald-400/50" />
                  </motion.div>
                </div>
                <p className="text-white/20 text-[11px] font-black uppercase tracking-[0.3em] pt-2">Create your new password</p>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 overflow-hidden text-left"
                  >
                    <Zap className="w-5 h-5 text-rose-500 fill-rose-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleReset} className="space-y-8 text-left">
                <PremiumInput
                  icon={Lock}
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                />

                <PremiumInput
                  icon={Lock}
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                />

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative overflow-hidden bg-white text-black py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-[12px] italic flex items-center justify-center gap-4 transition-all duration-500 shadow-[0_20px_40px_rgba(255,255,255,0.1)] disabled:opacity-20 mt-4"
                >
                  <motion.div
                    animate={{ x: ['-250%', '250%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent skew-x-[-20deg]"
                  />
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Update Password"}
                </motion.button>
              </form>

              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-[1px] bg-white/5" />
                <span className="text-[10px] text-white/10 font-black uppercase tracking-[0.5em]">OR</span>
                <div className="flex-1 h-[1px] bg-white/5" />
              </div>

              <div className="text-center">
                <Link to="/login" className="inline-flex items-center gap-3 text-[11px] font-black text-white/30 hover:text-emerald-400 uppercase tracking-[0.3em] transition-all group italic">
                  Return to Login
                </Link>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="relative mb-10 w-24 h-24 mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                >
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-[2.5rem] border border-emerald-500/30"
                />
              </div>
              <h2 className="text-3xl font-black italic uppercase text-white mb-4 tracking-tighter">Password Updated</h2>
              <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em] italic">Your password has been successfully reset. You can now login with your new credentials.<br />Redirecting to login portal...</p>

              <motion.div
                className="mt-12 h-1 bg-white/10 rounded-full overflow-hidden w-48 mx-auto"
                initial={{ width: 0 }}
                animate={{ width: 192 }}
                transition={{ duration: 3 }}
              >
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 3 }}
                />
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
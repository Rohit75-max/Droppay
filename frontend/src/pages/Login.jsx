import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import { syncTheme } from '../api/themeSync';
import {
  Mail, Lock, Zap, Loader2, ArrowRight, ArrowLeft,
  Shield, AlertCircle, Eye, EyeOff, Users, Activity,
  TrendingUp, Globe, CheckCircle, Star
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

// API_BASE is now handled by the centralized axios configuration in src/api/axios.js

// ─── Floating Orb ─────────────────────────────────────────────
const Orb = ({ size, x, y, duration, color, delay }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ width: size, height: size, left: x, top: y, background: color, filter: 'blur(60px)' }}
    animate={{ y: [0, -25, 0], x: [0, 12, 0], scale: [1, 1.07, 1], opacity: [0.3, 0.5, 0.3] }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

// ─── Stat Card ────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10"
  >
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{label}</p>
      <p className="text-sm font-black text-white leading-none">{value}</p>
    </div>
  </motion.div>
);

// ─── Premium Input ────────────────────────────────────────────
const PremiumInput = ({ icon: Icon, label, type, name, value, onChange, placeholder, rightEl, isDark, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  const inputId = `login-${name}`;
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] transition-colors ${focused ? 'text-emerald-500' : isDark ? 'text-white/40' : 'text-slate-400'}`}>
        <Icon className="w-3 h-3" /> {label}
      </label>
      <div className="relative group">
        <motion.div
          className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 pointer-events-none"
          animate={{ opacity: focused ? 0.55 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ backgroundSize: '200% 200%' }}
        />
        <div className="relative">
          <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focused ? 'text-emerald-500' : isDark ? 'text-white/30' : 'text-slate-300'}`} />
          <input
            id={inputId}
            type={type} name={name} value={value} onChange={onChange}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder={placeholder} required
            autoComplete={autoComplete}
            className={`w-full rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:border-transparent transition-all ${isDark
              ? 'bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20'
              : 'bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-300'
              }`}
          />
          {rightEl && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Login, 2: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Pre-fill remembered email
  useEffect(() => {
    const saved = localStorage.getItem('rememberedEmail');
    if (saved) { setFormData(p => ({ ...p, email: saved })); setRememberMe(true); }
  }, []);

  const handleChange = (e) => { setError(''); setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      if (rememberMe) localStorage.setItem('rememberedEmail', formData.email.trim().toLowerCase());
      else localStorage.removeItem('rememberedEmail');

      localStorage.setItem('token', res.data.token);

      // Sync theme preference immediately after successful login
      syncTheme(res.data.user);

      setError(''); // Clear any previous error so both banners don't show at once
      setLoginSuccess(true);

      // Always go to dashboard — MissionGate will reroute to /subscription if no active plan
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      if (err.response?.status === 206) {
        setStep(2);
        setResendTimer(60);
      } else {
        setError(err.response?.data?.msg || 'Incorrect email or password. Please try again.');
      }
    } finally { setLoading(false); }
  };

  const handleOtpChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const next = [...otp]; next[index] = value; setOtp(next);
      if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && !otp[index])
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await axios.post('/api/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      setResendTimer(60);
      setError('');
    } catch (err) {
      setError('Retry protocol failed. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const combined = otp.join('');
    if (combined.length < 6) return;
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/verify-email', { email: formData.email.trim().toLowerCase(), otp: combined });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);

        // Sync theme preference immediately after successful verification
        syncTheme(res.data.user);

        setLoginSuccess(true);
        // Always go to dashboard — MissionGate handles plan routing
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) { setError(err.response?.data?.msg || 'Invalid Transmission Key.'); }
    finally { setLoading(false); }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#030a06]' : 'bg-slate-50'}`}>

      {/* Background blobs — dark or light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute top-[-20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-emerald-900/30 blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-900/20 blur-[100px]" />
          </>
        ) : (
          <>
            <div className="absolute top-[-20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-emerald-100/60 blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-100/50 blur-[100px]" />
          </>
        )}
      </div>

      {/* ── MAIN SHELL ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{ boxShadow: isDark ? '0 30px 80px -20px rgba(0,0,0,0.5)' : '0 30px 80px -20px rgba(0,0,0,0.10)' }}
        className={`relative w-full max-w-[980px] rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row border ${isDark ? 'border-white/10 bg-[#08100c]' : 'border-white/80 bg-white'}`}
      >
        {/* ── LEFT — Holographic Branding Pillar ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:w-[440px] shrink-0 bg-[#061a12] overflow-hidden flex flex-col justify-between p-6 sm:p-8 lg:p-10 min-h-[300px] lg:min-h-[660px] z-20"
        >



          {/* Floating orbs */}
          <Orb size={260} x="-60px" y="-60px" color="rgba(16,185,129,0.22)" duration={7} delay={0} />
          <Orb size={180} x="55%" y="50%" color="rgba(6,182,212,0.18)" duration={9} delay={2} />
          <Orb size={120} x="15%" y="68%" color="rgba(244,114,182,0.12)" duration={6} delay={1} />

          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          {/* Scan line sweep */}
          <motion.div
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent pointer-events-none z-10"
            animate={{ top: ['-2%', '102%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 2.5 }}
          />

          {/* Brand content */}
          <div className="relative z-20">
            {/* Back button */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="mb-6">
              <Link to="/" className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/10 text-white/50 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> Back
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
              </div>
              <div>
                <span className="text-white font-black text-xl italic tracking-tight uppercase">Drop<span className="text-emerald-400">Pay</span></span>
                <p className="text-white/30 text-[9px] uppercase tracking-[0.25em] font-bold">Creator Protocol</p>
              </div>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-4xl lg:text-5xl font-black italic text-white leading-[1] tracking-tighter mb-4">
              Your Stream.<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #10B981, #06b6d4, #f472b6)', WebkitBackgroundClip: 'text' }}>
                Your Network.
              </span><br />
              Your Pay.
            </motion.h2>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
              className="text-white/40 text-sm font-medium leading-relaxed max-w-xs mb-8">
              Sub-ms transmission. Instant bank settlements. Built for professional streamers.
            </motion.p>

            <div className="grid grid-cols-2 gap-2.5">
              <StatCard icon={Users} label="Creators" value="48,200+" color="bg-emerald-500/20 text-emerald-400" delay={0.7} />
              <StatCard icon={TrendingUp} label="Paid Out" value="₹2.4Cr+" color="bg-cyan-500/20 text-cyan-400" delay={0.8} />
              <StatCard icon={Globe} label="Regions" value="12 Live" color="bg-indigo-500/20 text-indigo-400" delay={0.9} />
              <StatCard icon={Activity} label="Uptime" value="99.98%" color="bg-rose-500/20 text-rose-400" delay={1.0} />
            </div>
          </div>

          {/* Bottom feature chips */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="relative z-20 flex flex-wrap gap-2 mt-8">
            {[
              { icon: Shield, text: 'Bank-grade SSL', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { icon: Star, text: 'Instant Payouts', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
              { icon: Zap, text: 'Sub-ms Latency', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${color}`}>
                <Icon className="w-3 h-3" /> {text}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT — Login form ── */}
        <div className={`flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-12 relative z-10 overflow-y-auto transition-colors duration-500 ${isDark ? 'bg-[#0a1410]' : 'bg-white'}`}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>

                {/* Status strip */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="flex items-center justify-between mb-10">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Creator Login</p>
                    <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-white/20' : 'text-slate-300'}`}>Authorize your streaming node</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeToggle size="sm" />
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-500 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
                      <motion.div className={`w-1.5 h-1.5 rounded-full ${loginSuccess ? 'bg-emerald-400' : 'bg-amber-400'}`}
                        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                      <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                        {loginSuccess ? 'Authorized' : loading ? 'Verifying' : 'Ready'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                  <h3 className={`text-3xl font-black italic tracking-tighter mb-1 leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>Welcome back.</h3>
                  <p className={`text-sm font-medium mb-8 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>Authorize your streaming node to access DropPay.</p>
                </motion.div>

                {/* Error banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div key="error"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3 overflow-hidden">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-rose-600 font-bold">{error}</p>
                    </motion.div>
                  )}
                  {loginSuccess && (
                    <motion.div key="success"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                      className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <p className="text-[11px] text-emerald-700 font-bold">Node authorized — Connecting to dashboard...</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <PremiumInput icon={Mail} label="Email Address" type="email" name="email"
                      value={formData.email} onChange={handleChange} placeholder="you@example.com" isDark={isDark} autoComplete="email" />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <PremiumInput icon={Lock} label="Password" type={showPassword ? 'text' : 'password'} name="password"
                      value={formData.password} onChange={handleChange} placeholder="••••••••••••••••" isDark={isDark} autoComplete="current-password"
                      rightEl={
                        <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                          className={`transition-colors ${isDark ? 'text-white/30 hover:text-emerald-400' : 'text-slate-300 hover:text-emerald-500'}`}>
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                  </motion.div>

                  {/* Remember me + forgot */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
                    className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <label className={`flex items-center gap-2 cursor-pointer transition-colors ${isDark ? 'text-white/30 hover:text-emerald-400' : 'text-slate-400 hover:text-emerald-600'}`}>
                      <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(v => !v)}
                        className="accent-emerald-500 w-3.5 h-3.5 rounded" />
                      Remember Node
                    </label>
                    <Link to="/forgot-password" className="text-emerald-500 hover:text-emerald-400 transition-colors">
                      Lost Access?
                    </Link>
                  </motion.div>

                  {/* Submit */}
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                    <motion.button type="submit" disabled={loading || loginSuccess}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.985 }}
                      className="relative w-full overflow-hidden py-4 rounded-2xl font-black uppercase tracking-widest text-[13px] flex items-center justify-center gap-3 transition-all
                                bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-emerald-500/20 shadow-xl
                                disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed">
                      <motion.div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }} />
                      {loginSuccess ? <><CheckCircle className="w-5 h-5" /> Authorized</>
                        : loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                          : <>Authorize <ArrowRight className="w-4 h-4" /></>}
                    </motion.button>
                  </motion.div>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-100'}`} />
                  <span className={`text-[9px] uppercase tracking-widest ${isDark ? 'text-white/20' : 'text-slate-300'}`}>or protocol</span>
                  <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-100'}`} />
                </div>

                <div className="grid grid-cols-1 gap-3 mb-6">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      toast.info(
                        <div className="flex items-center gap-3">
                          <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Google Auth Pending</span>
                            <span className="text-[9px] font-bold text-white/50">Awaiting Client ID integration</span>
                          </div>
                        </div>,
                        {
                          position: "top-right", autoClose: 4000, theme: isDark ? "dark" : "light",
                          style: { background: isDark ? '#061a12' : '#fff', border: isDark ? '1px solid rgba(16,185,129,0.2)' : '1px solid #e2e8f0', borderRadius: '16px' }
                        }
                      )
                    }}
                    className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl border transition-all shadow-sm group ${isDark ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/30' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-200'}`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    </div>
                    <span className={`text-[12px] font-black uppercase tracking-widest ${isDark ? 'text-white/60 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>Continue with Google</span>
                  </motion.button>
                </div>

                {/* Init new account */}
                <Link to="/signup"
                  className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all hover:border-emerald-300 hover:text-emerald-500 ${isDark ? 'border-white/10 bg-white/[0.03] text-white/40 hover:bg-emerald-500/5' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-emerald-50'}`}>
                  <Shield className="w-3.5 h-3.5" /> Initialize New Account
                </Link>

                {/* Admin portal link */}
                <div className="mt-4 text-center">
                  <Link to="/admin/login"
                    className={`text-[9px] font-black uppercase tracking-[0.35em] transition-colors hover:text-emerald-500 ${isDark ? 'text-white/20' : 'text-slate-300'}`}>
                    Secure Admin Portal →
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ── STEP 2: OTP (Inline for unverified users) ── */
              <motion.div key="otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center">

                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
                  className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-5 border border-emerald-400/20">
                  <Shield className="w-7 h-7 text-emerald-500 animate-pulse" />
                </motion.div>

                <h3 className={`text-2xl font-black italic tracking-tighter mb-1 leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>Confirm Identity.</h3>
                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Authorization code sent to your mail node:</p>
                <p className="text-emerald-600 font-black text-sm mb-6">{formData.email}</p>

                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="w-full bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-6 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-rose-600 font-bold">{error}</p>
                  </motion.div>
                )}

                {/* OTP boxes */}
                <div className="flex justify-center gap-2 mb-8">
                  {otp.map((digit, index) => (
                    <input key={index} id={`otp-${index}`} name={`otp-${index}`}
                      type="text" maxLength="1" value={digit}
                      autoComplete="one-time-code"
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={`w-10 h-13 sm:w-12 sm:h-15 text-center text-xl font-black rounded-xl border-2 transition-all outline-none
                                            bg-slate-50 text-slate-900
                                            ${digit ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 focus:border-emerald-400'}`}
                    />
                  ))}
                </div>

                <motion.button onClick={handleVerify} disabled={loading || otp.join('').length < 6}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.985 }}
                  className={`relative w-full py-4 rounded-xl font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-3 transition-all
                                    ${otp.join('').length === 6
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'
                      : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'}`}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  Verify & Continue
                </motion.button>

                <button onClick={resendOtp} disabled={loading || resendTimer > 0}
                  className={`mt-6 text-[9px] font-black uppercase transition-colors tracking-widest ${resendTimer > 0 ? 'text-slate-300' : 'text-emerald-600 hover:text-emerald-500'}`}>
                  {resendTimer > 0 ? `Retry in ${resendTimer}s` : 'Resend Code'}
                </button>

                <button onClick={() => setStep(1)}
                  className="mt-4 text-[9px] font-black uppercase text-slate-400 hover:text-slate-600 tracking-widest">
                  Back to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div >
  );
};

export default Login;
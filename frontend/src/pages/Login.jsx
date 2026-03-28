import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import { syncTheme } from '../api/themeSync';
import {
  Mail, Lock, Loader2, ArrowRight, ArrowLeft,
  Shield, AlertCircle, Eye, EyeOff, Users,
  Globe, CheckCircle, Instagram, Twitter, Apple, Play
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ComicAuthSwitch } from '../components/ComicAuthSwitch';

// ─── Stat Card (Blyss/Drope Style) ────────────────────────────
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col gap-1">
    <p className="text-[10px] uppercase tracking-[0.25em] font-black text-[#f5f4e2]/30">{label}</p>
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-[#f5f4e2]/60" />
      <p className="text-xl font-black text-[#f5f4e2] italic tracking-tighter">{value}</p>
    </div>
  </div>
);

// ─── Architectural Input (Drope/Blyss Style) ──────────────────
const ArchitecturalInput = ({ icon: Icon, label, type, name, value, onChange, placeholder, rightEl, autoComplete, light = false }) => {
  const [focused, setFocused] = useState(false);
  const inputId = `login-${name}`;
  
  const labelColor = light 
    ? (focused ? 'text-[#111111]' : 'text-[#111111]/40')
    : (focused ? 'text-[#f5f4e2]' : 'text-[#f5f4e2]/40');
  
  const borderColor = light
    ? (focused ? 'border-[#111111]' : 'border-[#111111]/10')
    : (focused ? 'border-[#f5f4e2]' : 'border-[#f5f4e2]/10');
    
  const textColor = light ? 'text-[#111111]' : 'text-[#f5f4e2]';
  const iconColor = light
    ? (focused ? 'text-[#111111]' : 'text-[#111111]/20')
    : (focused ? 'text-[#f5f4e2]' : 'text-[#f5f4e2]/20');

  return (
    <div className="space-y-3">
      <label htmlFor={inputId} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${labelColor}`}>
        {label}
      </label>
      <div className="relative group">
        <Icon className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${iconColor}`} />
        <input
          id={inputId}
          type={type} name={name} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder} required
          autoComplete={autoComplete}
          className={`w-full bg-transparent border-b-2 py-3 pl-8 pr-12 text-sm focus:outline-none transition-all ${borderColor} ${textColor} placeholder:text-[#111111]/10`}
        />
        {rightEl && <div className="absolute right-0 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT (ARCHITECTURAL / 50-50 SPLIT SYMMETRY)
// ─────────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Login, 2: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  // --- Logic Hooks (Preserved) ---
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    const checkExistingSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        syncTheme(res.data);
        const isActiveTier = res.data.tier && res.data.tier !== 'none';
        const isLegacyActive = res.data.subscription?.status === 'active';

        if (isActiveTier || isLegacyActive) {
          navigate('/dashboard');
        } else {
          navigate('/subscription');
        }
      } catch (err) {
        localStorage.removeItem('token');
      }
    };
    checkExistingSession();
  }, [navigate]);

  useEffect(() => {
    const saved = localStorage.getItem('rememberedEmail');
    if (saved) { setFormData(p => ({ ...p, email: saved })); setRememberMe(true); }
  }, []);

  // --- Handlers (Preserved) ---
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
      syncTheme(res.data.user);
      setError(''); setLoginSuccess(true);
      const landing = res.data.user.subscription?.status === 'active' ? '/dashboard' : '/subscription';
      setTimeout(() => navigate(landing), 1000);
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
      setResendTimer(60); setError('');
    } catch (err) { setError('Failed to resend verification code.'); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    const combined = otp.join('');
    if (combined.length < 6) return;
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/verify-email', { email: formData.email.trim().toLowerCase(), otp: combined });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        syncTheme(res.data.user);
        setLoginSuccess(true);
        const landing = res.data.user.subscription?.status === 'active' ? '/dashboard' : '/subscription';
        setTimeout(() => navigate(landing), 1000);
      }
    } catch (err) { setError(err.response?.data?.msg || 'Invalid verification code.'); }
    finally { setLoading(false); }
  };

  // --- Styles ---
  const georgiaFont = { fontFamily: "Georgia, serif" };
  const interFont = { fontFamily: "'Inter', sans-serif" };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full bg-[#f5f4e2] overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans arc-grain-bg">
      <style dangerouslySetInnerHTML={{ __html: `
        .arc-grain-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          z-index: 100;
        }
      `}} />

      {/* ── LEFT SECTION (50% Deep Green) ── */}
      <motion.div 
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="w-full lg:w-1/2 bg-[#064e3b] relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 z-20 min-h-[500px] lg:h-full"
      >
        <div>
          {/* Back to Home */}
          <div className="flex justify-between items-center mb-12 sm:mb-16">
            <Link to="/" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#f5f4e2]/40 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
          </div>
        </div>

        {/* Mega Anchored Text Area */}
        <div className="relative">
          {/* relcoated: Description & buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="max-w-[440px] mb-8 sm:mb-12"
          >
             <p className="text-sm font-medium text-[#f5f4e2]/60 leading-relaxed mb-6 sm:mb-8">
               Securely manage, scale, and settle your creator revenue — all in one powerful infrastructure built for speed, clarity, and control.
             </p>
             <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest text-white/60">
                  <Apple className="w-4 h-4 text-[#f5f4e2]" /> <span className="text-[#f5f4e2]">App Store</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest text-white/60">
                  <Play className="w-4 h-4 fill-[#f5f4e2] text-[#f5f4e2]" /> <span className="text-[#f5f4e2]">Google Play</span>
                </button>
             </div>
          </motion.div>

          <h1 className="text-[clamp(4rem,12vw,12rem)] font-black text-[#f5f4e2] leading-[0.85] tracking-tighter" style={interFont}>
            <span className="flex overflow-hidden whitespace-nowrap glitch-text" data-text="DROPE">
              {"DROPE".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-8 gap-8 sm:gap-4">
            <div className="flex gap-8 sm:gap-12">
               <StatCard icon={Users} label="Creators" value="48K+" />
               <StatCard icon={Globe} label="Uplink" value="18ms" />
            </div>
            <div className="flex gap-4">
              <Twitter className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
              <Instagram className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT SECTION (50% Cream Canvas - Form side) ── */}
      <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 z-30 py-10 lg:h-full">
        
        {/* LOGIN FORM (Background Integrated) */}
        <motion.div 
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120, delay: 0.2 }}
          className="w-full max-w-[420px]"
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="login" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="relative">
                {/* Floating Comic Switch on Left (Desktop) */}
                <div className="hidden lg:block absolute left-[-320px] top-4 rotate-[-1deg]">
                  <ComicAuthSwitch active="login" brandColor="#064e3b" />
                </div>
                
                {/* Mobile Tablet Centered Switch */}
                <div className="lg:hidden flex justify-center mb-16">
                  <ComicAuthSwitch active="login" brandColor="#064e3b" />
                </div>
                
                <div className="flex justify-between items-end mb-6 sm:mb-8">
                  <div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-[#111111] tracking-tighter mb-2 whitespace-nowrap" style={georgiaFont}>
                      Welcome back.
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#111111]/30">
                      Secure Authentication Enabled
                    </p>
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-500 text-[11px] font-bold flex gap-3">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </motion.div>
                )}

                {loginSuccess && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[11px] font-bold flex gap-3">
                    <CheckCircle className="w-4 h-4 shrink-0" /> Login successful — Redirecting...
                  </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8">
                  <ArchitecturalInput icon={Mail} label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="creator@uplink.io" autoComplete="email" light />
                  <ArchitecturalInput 
                    icon={Lock} 
                    label="Password" 
                    type={showPassword ? 'text' : 'password'} 
                    name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" 
                    autoComplete="current-password"
                    light
                    rightEl={
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#111111]/20 hover:text-[#111111] transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  <div className="flex flex-wrap justify-between items-center py-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                       <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-[#111111] border-[#111111] shadow-lg shadow-black/10' : 'border-[#111111]/10 group-hover:border-[#111111]/30'}`}>
                         {rememberMe && <CheckCircle className="w-4 h-4 text-white" />}
                       </div>
                       <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#111111]/40 group-hover:text-[#111111]/60 transition-colors">Remember Me</span>
                    </label>
                    <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-[#111111]/30 hover:text-[#111111] transition-colors">
                      Forgot Password?
                    </Link>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || loginSuccess}
                    className="w-full bg-[#111111] text-white py-6 font-black uppercase tracking-[0.4em] text-[13px] italic flex items-center justify-center gap-4 transition-all hover:bg-emerald-600 hover:shadow-[8px_8px_0px_#000] disabled:opacity-50 group"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 sm:mt-8 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#111111]/20 mb-4 sm:mb-6">Or Authenticate With</p>
                  <button className="w-full py-4 rounded-full bg-[#111111]/5 border border-[#111111]/10 flex items-center justify-center gap-3 hover:bg-white transition-all group">
                    <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#111111]/70 group-hover:text-[#111111]">Google</span>
                  </button>
                </div>

                <div className="mt-6 sm:mt-8 text-center pb-8 lg:pb-0">
                  <Link to="/admin/login" className="inline-block mt-6 text-[9px] font-black uppercase tracking-[0.3em] text-[#111111]/10 hover:text-[#111111] transition-all">
                    Admin Login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div key="otp" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="text-center">
                 <div className="w-16 h-16 rounded-[1.25rem] bg-[#111111]/5 border border-[#111111]/10 flex items-center justify-center mx-auto mb-8">
                   <Shield className="w-8 h-8 text-[#111111] animate-pulse" />
                 </div>
                 <h2 className="text-4xl font-bold text-[#111111] tracking-tighter mb-2 whitespace-nowrap" style={georgiaFont}>Verify Email.</h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111111]/30 mb-12">Verification code sent to {formData.email}</p>

                 {error && (
                   <div className="mb-8 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-500 text-[11px] font-bold">
                     {error}
                   </div>
                 )}

                 <div className="flex justify-center flex-wrap gap-3 mb-10">
                   {otp.map((digit, idx) => (
                     <input key={idx} id={`otp-${idx}`} type="text" maxLength="1" value={digit} onChange={e => handleOtpChange(e.target.value, idx)} onKeyDown={e => handleKeyDown(e, idx)}
                       className="w-10 sm:w-12 h-14 sm:h-16 bg-[#111111]/5 border-2 border-[#111111]/10 rounded-2xl text-center text-xl sm:text-2xl font-black text-[#111111] outline-none focus:border-[#111111] transition-all" />
                   ))}
                 </div>

                 <button onClick={handleVerify} disabled={loading || otp.join('').length < 6}
                   className="w-full py-4 rounded-full bg-[#111111] text-white font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                   {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify & Continue <CheckCircle className="w-4 h-4 text-white" /></>}
                 </button>

                 <div className="mt-8 flex flex-col gap-4 pb-8 lg:pb-0">
                   <button onClick={resendOtp} disabled={resendTimer > 0} className="text-[9px] font-black uppercase tracking-widest text-[#111111]/30 hover:text-[#111111] transition-colors">
                     {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Verification Code'}
                   </button>
                   <button onClick={() => setStep(1)} className="text-[9px] font-black uppercase tracking-widest text-[#111111]/20 hover:text-[#111111] transition-colors">
                     Back to Login
                   </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
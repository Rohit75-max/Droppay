import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axios';
import { syncTheme } from '../../api/themeSync';
import {
  Mail, Lock, ArrowLeft, Shield,
  Eye, EyeOff, Key
} from 'lucide-react';



// ─── Architectural Input ──────────────────────────────────────
const ArchitecturalInput = ({ icon: Icon, label, type, name, value, onChange, onFocusChange, placeholder, rightEl }) => {
  const [focused, setFocused] = useState(false);
  const handleFocus = () => { setFocused(true); onFocusChange?.(name); };
  const handleBlur = () => { setFocused(false); onFocusChange?.(null); };

  return (
    <div className="relative space-y-2">
      <div className="flex justify-between items-center px-1">
        <label className={`text-[8px] font-black uppercase tracking-[0.4em] transition-colors ${focused ? 'text-[#afff00]' : 'text-white/10'}`}>
          {label}
        </label>
        <Icon className={`w-3 h-3 transition-colors duration-300 ${focused ? 'text-[#afff00]' : 'text-white/5'}`} />
      </div>
      <div className="relative">
        <input
          type={type} name={name} value={value} onChange={onChange}
          onFocus={handleFocus} onBlur={handleBlur}
          placeholder={placeholder} required
          className="w-full bg-white/5 border border-white/5 py-4 px-5 text-sm focus:outline-none text-white placeholder:text-white/20 font-medium tracking-tight"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: focused ? 1 : 0 }}
          className="absolute bottom-0 left-0 w-full h-[1px] bg-[#afff00] origin-center shadow-[0_0_10px_#afff00] z-10"
        />
        {rightEl && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();

  // Auth Steps: 'login' | 'otp' | 'reset' | 'success'
  const [authStep, setAuthStep] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  // Background States
  const displayText = "IDENTIFY";

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer(p => p - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  // Handle Logic
  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      localStorage.setItem('token', res.data.token);
      syncTheme(res.data.user);
      navigate(res.data.user.subscription?.status === 'active' ? '/dashboard' : '/subscription');
    } catch (err) {
      if (err.response?.status === 206) {
        setAuthStep('otp');
        setResendTimer(60);
      } else {
        setError(err.response?.data?.msg || 'Authentication failed.');
      }
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
        syncTheme(res.data.user);
        navigate(res.data.user.subscription?.status === 'active' ? '/dashboard' : '/subscription');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  // ─── RENDER ───
  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center font-sans">

      {/* ─── UNIFIED BACKGROUND LAYER (THE SCANNER) ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Kinetic Scan Bar */}
        <motion.div
          animate={{ top: ['0%', '100%', '0%'], opacity: [0, 0.1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-[#afff00] z-0 shadow-[0_0_20px_#afff00]"
        />

        {/* The Lens Bloom */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full bg-[#afff00] blur-[150px] pointer-events-none z-0"
        />

        {/* Hero Identity Text (Desktop Background) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden lg:block opacity-[0.07] pointer-events-none select-none overflow-hidden">
          <div className="px-10 flex justify-center items-center h-full" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <h1 className="text-[16vw] font-black text-white italic leading-none tracking-tighter uppercase font-mono whitespace-nowrap pl-[0.1em]">
              {formData.email ? `@${formData.email.split('@')[0]}` : displayText}
            </h1>
          </div>
        </div>
      </div>

      {/* ─── TACTICAL INTERFACE CARD ─── */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-30 w-full max-w-[440px] px-8 sm:px-0"
      >
        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-10 sm:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            {authStep === 'login' ? (
              <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {/* Header */}
                <div className="mb-12">
                  <h2 className="text-[clamp(1.4rem,6vw,3rem)] font-black tracking-tighter font-mono text-center leading-tight whitespace-nowrap">
                    <span className="text-white">Login to </span><span className="text-[#afff00] uppercase">DROPE</span>
                  </h2>
                </div>



                {error && <div className="mb-8 p-4 bg-rose-500/10 border-l-2 border-rose-500 text-rose-500 text-[9px] font-black uppercase tracking-widest">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-8">
                  <ArchitecturalInput icon={Mail} label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="EMAIL or USERNAME" />
                  <ArchitecturalInput
                    icon={Lock} label="Password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••"
                    rightEl={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="w-4 h-4 text-white/20" /> : <Eye className="w-4 h-4 text-white/20" />}</button>}
                  />

                  <div className="flex justify-end">
                    <button onClick={() => setAuthStep('reset')} type="button" className="text-[8px] font-black uppercase tracking-widest text-white/20 hover:text-[#afff00] transition-colors">[ FORGOT PASSWORD ]</button>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full h-16 relative overflow-hidden group border border-[#afff00]/30 disabled:opacity-20 transition-opacity"
                  >
                    {/* Diagonal Top-Right to Bottom-Left Filler */}
                    <motion.div
                      variants={{
                        initial: { x: '100%', y: '-100%' },
                        hover: { x: 0, y: 0 }
                      }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 bg-[#afff00] z-0"
                      style={{
                        width: '200%',
                        height: '200%',
                        top: '-50%',
                        left: '-50%',
                        transformOrigin: 'top right',
                        clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 0 0)' // Just a rect covering the scaled area
                      }}
                    />

                    {/* Tactical Text Layer */}
                    <motion.span
                      variants={{
                        initial: { color: '#afff00' },
                        hover: { color: '#000000' }
                      }}
                      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                      className="relative z-10 flex items-center justify-center gap-3 font-black uppercase tracking-[0.6em] text-[12px]"
                    >
                      {loading ? "INITIALIZING..." : "LOGIN"}
                    </motion.span>
                  </motion.button>
                </form>

                <div className="mt-12 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Don't have an account? </span>
                  <Link to="/signup" className="text-[10px] font-black uppercase tracking-[0.4em] text-[#afff00] hover:text-white transition-colors">Sign Up</Link>
                </div>
              </motion.div>
            ) : authStep === 'otp' ? (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="mb-12">
                  <Shield className="w-12 h-12 text-[#afff00] mb-6 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-4">OTP sent to {formData.email}</p>
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-mono italic text-center">Enter OTP</h2>
                </div>

                <div className="flex justify-center gap-3 mb-12">
                  {otp.map((digit, idx) => (
                    <input key={idx} id={`otp-${idx}`} type="text" maxLength="1" value={digit}
                      onChange={e => {
                        const val = e.target.value;
                        if (/^[0-9]$/.test(val) || val === '') {
                          const next = [...otp]; next[idx] = val; setOtp(next);
                          if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={e => { if (e.key === 'Backspace' && idx > 0 && !otp[idx]) document.getElementById(`otp-${idx - 1}`)?.focus(); }}
                      className="w-12 h-16 bg-white/5 border border-white/5 text-center text-3xl font-black text-white focus:border-[#afff00] transition-all" />
                  ))}
                </div>

                <motion.button
                  onClick={handleVerify}
                  disabled={loading || otp.join('').length < 6}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full h-16 relative overflow-hidden group border border-[#afff00]/30 transition-all shadow-[0_10px_40px_rgba(175,255,0,0.1)] flex items-center justify-center gap-3 disabled:opacity-20"
                >
                  {/* Diagonal Filler */}
                  <motion.div
                    variants={{
                      initial: { x: '100%', y: '-100%' },
                      hover: { x: 0, y: 0 }
                    }}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bg-[#afff00] z-0"
                    style={{ width: '200%', height: '200%', top: '-50%', left: '-50%', transformOrigin: 'top right' }}
                  />

                  {/* Tactical Text */}
                  <motion.span
                    variants={{ initial: { color: '#afff00' }, hover: { color: '#000000' } }}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[12px]"
                  >
                    {loading ? "VERIFYING..." : "verify"}
                  </motion.span>
                </motion.button>

                <div className="mt-12 flex flex-col gap-4 text-center">
                  <button onClick={() => setResendTimer(60)} disabled={resendTimer > 0} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                    {resendTimer > 0 ? `RETRY_IN_${resendTimer}S` : 'Resend OTP'}
                  </button>
                  <button onClick={() => setAuthStep('login')} className="text-[10px] font-black uppercase tracking-widest text-[#afff00] hover:text-white transition-colors">Return</button>
                </div>
              </motion.div>
            ) : authStep === 'reset' ? (
              <motion.div key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="mb-12">
                  <Key className="w-12 h-12 text-[#afff00] mb-6" />
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-mono italic text-center">Recovery</h2>

                </div>

                <form className="space-y-8">
                  <ArchitecturalInput icon={Mail} label="Recovery Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="REGISTERED_EMAIL" />

                  <motion.button
                    type="button"
                    onClick={() => setAuthStep('otp')}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full h-16 relative overflow-hidden group border border-[#afff00]/30 transition-all flex items-center justify-center gap-3"
                  >
                    {/* Diagonal Filler */}
                    <motion.div
                      variants={{
                        initial: { x: '100%', y: '-100%' },
                        hover: { x: 0, y: 0 }
                      }}
                      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 bg-[#afff00] z-0"
                      style={{ width: '200%', height: '200%', top: '-50%', left: '-50%', transformOrigin: 'top right' }}
                    />

                    {/* Tactical Text */}
                    <motion.span
                      variants={{ initial: { color: '#afff00' }, hover: { color: '#000000' } }}
                      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                      className="relative z-10 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[12px]"
                    >
                      RESET PASSWORD
                    </motion.span>
                  </motion.button>
                </form>

                <div className="mt-12 text-center">
                  <button onClick={() => setAuthStep('login')} className="text-[10px] font-black uppercase tracking-widest text-[#afff00] hover:text-white transition-colors">BACK</button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

      </motion.div>

      {/* Background Backlink */}
      <Link to="/" className="fixed top-8 left-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-white/10 hover:text-[#afff00] transition-colors group z-[100]">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Return</span>
      </Link>

    </div>
  );
};

export default Login;

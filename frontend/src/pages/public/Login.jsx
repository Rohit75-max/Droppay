import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';
import { syncTheme } from '../../api/themeSync';
import {
  Mail, Lock, ArrowLeft,
  AlertCircle, Eye, EyeOff,
  CheckCircle, Play
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// ─── Telemetry Mini Graph ─────────────────────────────────────
const SyncGraph = () => {
  return (
    <div className="w-12 h-4 overflow-hidden relative opacity-40">
      <motion.svg
        viewBox="0 0 100 40"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0 20 Q 10 5, 20 20 T 40 20 T 60 20 T 80 20 T 100 20"
          fill="none"
          stroke="#afff00"
          strokeWidth="2"
          animate={{
            d: [
              "M0 20 Q 10 5, 20 20 T 40 20 T 60 20 T 80 20 T 100 20",
              "M0 20 Q 10 35, 20 20 T 40 20 T 60 20 T 80 20 T 100 20",
              "M0 20 Q 10 5, 20 20 T 40 20 T 60 20 T 80 20 T 100 20"
            ]
          }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.svg>
    </div>
  );
};

// ─── ScrambleText Handshake Logic ──────────────────────────────
const HandshakeText = ({ text, active, blur }) => {
  const chars = "!@#$%^&*()_+{}:<>?BCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(prev => 
        text.split("").map((char, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1/2; // High-speed cycle
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.div 
      animate={{ filter: blur ? 'blur(8px)' : 'blur(0px)', opacity: blur ? 0.3 : 1 }}
      className="relative z-10"
    >
      <h1 className="text-[clamp(3.5rem,12vw,9rem)] font-black text-white leading-[0.8] tracking-tighter uppercase font-mono italic">
        {display}
      </h1>
    </motion.div>
  );
};

// ─── Architectural Input (Tactical Underline Protocol) ─────────
const ArchitecturalInput = ({ icon: Icon, label, type, name, value, onChange, onFocusChange, placeholder, rightEl, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  const inputId = `login-${name}`;

  const handleFocus = () => { setFocused(true); onFocusChange(name); };
  const handleBlur = () => { setFocused(false); onFocusChange(null); };

  return (
    <div className="relative space-y-3">
      <div className="flex justify-between items-center px-1">
        <label htmlFor={inputId} className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors ${focused ? 'text-[#afff00]' : 'text-white/15'}`}>
          {label}
        </label>
        <Icon className={`w-3 h-3 transition-colors duration-300 ${focused ? 'text-[#afff00]' : 'text-white/10'}`} />
      </div>
      <div className="relative">
        <input
          id={inputId}
          type={type} name={name} value={value} onChange={onChange}
          onFocus={handleFocus} onBlur={handleBlur}
          placeholder={placeholder} required autoComplete={autoComplete}
          className="w-full bg-transparent py-4 px-1 text-sm focus:outline-none text-white placeholder:text-white/5 uppercase font-medium tracking-tight"
        />
        {/* Underline Infrastructure */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5" />
        <motion.div
           initial={{ scaleX: 0 }}
           animate={{ scaleX: focused ? 1 : 0 }}
           transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
           className="absolute bottom-0 left-0 w-full h-[1px] bg-[#afff00] origin-center shadow-[0_0_10px_#afff00]"
        />
        {rightEl && <div className="absolute right-0 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
    </div>
  );
};

const AeroPillToggle = ({ active }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-end mb-12 relative">
      <div className="flex p-1 bg-white/5 backdrop-blur-xl rounded-full border border-white/5 relative z-10">
        <button
          onClick={() => navigate('/login')}
          className={`px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all relative ${active === 'login' ? 'text-black' : 'text-white/20 hover:text-white'}`}
        >
          {active === 'login' && <motion.div layoutId="backlit" className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_0_20px_white]" />}
          Login
        </button>
        <button
          onClick={() => navigate('/signup')}
          className={`px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all relative ${active === 'signup' ? 'text-black' : 'text-white/20 hover:text-white'}`}
        >
          {active === 'signup' && <motion.div layoutId="backlit" className="absolute inset-0 bg-[#afff00] rounded-full -z-10 shadow-[0_0_20px_#afff00]" />}
          Signup
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT (ARCHITECTURAL / 50-50 SPLIT SYMMETRY)
// ─────────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isUplinking, setIsUplinking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  // Logic Hooks
  useEffect(() => {
    let interval;
    if (resendTimer > 0) interval = setInterval(() => setResendTimer(p => p - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } });
        syncTheme(res.data);
        navigate(res.data.subscription?.status === 'active' ? '/dashboard' : '/subscription');
      } catch (err) { localStorage.removeItem('token'); }
    };
    checkSession();
  }, [navigate]);

  // Handlers
  const handleChange = (e) => { setError(''); setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsUplinking(true); setError('');
    try {
      const res = await axios.post('/api/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      localStorage.setItem('token', res.data.token);
      syncTheme(res.data.user);
      setLoginSuccess(true);
      setTimeout(() => navigate(res.data.user.subscription?.status === 'active' ? '/dashboard' : '/subscription'), 1000);
    } catch (err) {
      if (err.response?.status === 206) { setStep(2); setResendTimer(60); }
      else setError(err.response?.data?.msg || 'Authentication failed. Check credentials.');
      setIsUplinking(false);
    }
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
    setIsUplinking(true); setError('');
    try {
      const res = await axios.post('/api/auth/verify-email', { email: formData.email.trim().toLowerCase(), otp: combined });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        syncTheme(res.data.user);
        setLoginSuccess(true);
        setTimeout(() => navigate(res.data.user.subscription?.status === 'active' ? '/dashboard' : '/subscription'), 1000);
      }
    } catch (err) { setError(err.response?.data?.msg || 'Invalid verification code.'); setIsUplinking(false); }
  };

  return (
    <div className="relative min-h-screen lg:h-screen w-full bg-[#0A0A0A] overflow-x-hidden lg:overflow-hidden flex flex-col lg:flex-row font-sans">
      <style dangerouslySetInnerHTML={{
        __html: `
        .tactical-grain::after {
          content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px; z-index: 100;
        }
      `}} />
      <div className="absolute inset-0 tactical-grain pointer-events-none" />

      {/* ── LEFT SECTION (THE DARK SCANNER) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full lg:w-1/2 h-full min-h-[60vh] lg:h-full relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 z-20 overflow-hidden bg-[#050505]"
      >
        {/* Divider Glow */}
        <div className="absolute right-0 top-0 w-[1px] h-full bg-[#afff00]/40 shadow-[0_0_15px_#afff00]" />

        {/* Kinetic Scan Bar */}
        <AnimatePresence>
          {formData.email && (
            <motion.div
              initial={{ top: '0%', opacity: 0 }}
              animate={{ top: ['0%', '100%', '0%'], opacity: 0.15 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[1px] bg-[#afff00] z-0 shadow-[0_0_15px_#afff00]"
            />
          )}
        </AnimatePresence>

        {/* The Lens Bloom */}
        <AnimatePresence>
          {formData.email && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vh] h-[70vh] rounded-full bg-[#afff00] blur-[120px] pointer-events-none z-0"
            />
          )}
        </AnimatePresence>

        <Link to="/" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors relative z-10">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        {/* Handshake Display */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <HandshakeText 
            text={formData.email ? `@${formData.email.split('@')[0]}` : "IDENTIFY"} 
            blur={focusedField === 'password'} 
          />
          
          <AnimatePresence>
            {focusedField === 'password' && (
              <motion.div
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 0.1, scale: 1 }}
                exit={{ opacity: 0, scale: 2 }}
                className="absolute left-0 right-0 text-center pointer-events-none"
              >
                <Lock className="w-[30vw] h-[30vw] mx-auto text-[#afff00]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Telemetry (Left) */}
        <div className="relative z-10 flex items-center gap-12 font-mono">
          <div className="flex flex-col">
            <span className="text-[7px] text-white/20 uppercase tracking-[0.4em] mb-1">Authorization_Node</span>
            <span className="text-[10px] text-[#afff00] tracking-widest uppercase">SY_MAINFRAME_ALPHA</span>
          </div>
        </div>

        {/* Flashbulb Overlay */}
        <AnimatePresence>
          {loginSuccess && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-[100] bg-white pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── RIGHT SECTION (THE CARBON PORT) ── */}
      <div className="w-full lg:w-1/2 min-h-screen lg:h-full relative flex flex-col justify-center p-8 sm:p-12 lg:p-24 z-30 bg-[#0a0a0a]">
        <motion.div
           animate={isUplinking ? { opacity: 0.5, y: -20, filter: 'blur(4px)' } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
           className="w-full max-w-[400px] relative z-10"
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <AeroPillToggle active="login" />
                {/* --- PRIMARY OAUTH OPTIONS --- */}
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-10 lg:mb-8">
                  <button className="w-full h-14 sm:h-16 lg:h-14 bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center gap-4 group transition-all duration-300 hover:border-red-500/60 hover:shadow-[0_0_25px_rgba(255,0,0,0.15)] active:scale-[0.98]">
                    <Play className="w-5 h-5 fill-red-500 text-red-500" />
                    <span className="font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px]">Continue with YouTube</span>
                  </button>
                  <button className="w-full h-14 sm:h-16 lg:h-14 bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center gap-4 group transition-all duration-300 hover:border-[#9146FF]/60 hover:shadow-[0_0_25px_rgba(145,70,255,0.15)] active:scale-[0.98]">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#9146FF]"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0h1.714v5.143h-1.714zm-10.286 0L3.857 7.286v10.285h3.857v2.572l2.572-2.572h3.428l4.714-4.714V4.714H6.001zm1.714 1.714h11.143v7.714l-3 3H10.286l-2.571 2.572v-2.572H7.715V6.428z" /></svg>
                    <span className="font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px]">Continue with Twitch</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6 sm:mb-10 lg:mb-8 opacity-20">
                  <div className="h-[1px] flex-1 bg-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">OR CONTINUE WITH EMAIL</span>
                  <div className="h-[1px] flex-1 bg-white" />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6 p-4 bg-rose-500/10 border-l-2 border-rose-500 text-rose-500 text-[9px] font-black uppercase tracking-[0.2em] flex gap-3 items-center">
                    <AlertCircle className="w-3.5 h-3.5" /> {error}
                  </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-10">
                  <ArchitecturalInput icon={Mail} label="IDENTIFICATION_PROTOCOL" type="email" name="email" value={formData.email} onChange={handleChange} onFocusChange={setFocusedField} placeholder="Enter identifier" autoComplete="email" />
                  <ArchitecturalInput
                    icon={Lock} label="SECURITY_AUTHORIZATION" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onFocusChange={setFocusedField} placeholder="••••••••" autoComplete="current-password"
                    rightEl={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-white/20 hover:text-[#afff00] transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
                  />

                  <div className="flex justify-between items-center -mt-6">
                    <Link to="/forgot-password" size="sm" className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-[#afff00] transition-colors">
                      [ RECOVER_ACCESS ]
                    </Link>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isUplinking || loginSuccess}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(175,255,0,0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-16 bg-[#afff00] text-black font-black uppercase tracking-[0.6em] text-[12px] transition-all disabled:opacity-20"
                  >
                    {isUplinking ? "PROCESSING..." : "AUTHORIZE_ACCESS"}
                  </motion.button>
                </form>

                <div className="mt-8 sm:mt-12 lg:mt-6 flex justify-center gap-8">
                  <Link to="/admin/login" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-white/40 transition-colors">ADMIN ACCESS</Link>
                </div>
              </motion.div>
            ) : (
              <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
                <div className="mb-8 sm:mb-12 text-left">
                  <h3 className="text-[10px] sm:text-[12px] font-black text-[#afff00] uppercase tracking-[0.5em] mb-4">Verify Your Email</h3>
                  <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">Enter Code.</h2>
                  <p className="text-[9px] sm:text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-6">Verification code sent to {formData.email}</p>
                </div>

                <div className="flex justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
                  {otp.map((digit, idx) => (
                    <input key={idx} id={`otp-${idx}`} type="text" maxLength="1" value={digit} onChange={e => handleOtpChange(e.target.value, idx)} onKeyDown={e => handleKeyDown(e, idx)}
                      className="w-10 h-14 sm:w-12 sm:h-16 bg-white/5 border-2 border-white/10 rounded-xl sm:rounded-2xl text-center text-xl sm:text-2xl font-black text-white outline-none focus:border-[#afff00] transition-all" />
                  ))}
                </div>

                <button onClick={handleVerify} disabled={isUplinking || otp.join('').length < 6}
                  className="w-full h-16 sm:h-20 bg-[#afff00] text-black font-black uppercase tracking-widest text-[12px] sm:text-[13px] flex items-center justify-center gap-3 hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-50 shadow-[0_10px_40px_rgba(175,255,0,0.2)]">
                  {isUplinking ? "VERIFYING..." : "CONFIRM IDENTITY"} <CheckCircle className="w-4 h-4" />
                </button>

                <div className="mt-8 flex flex-col gap-4">
                  <button onClick={resendOtp} disabled={resendTimer > 0 || loading} className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                    {loading ? 'Sending...' : resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code'}
                  </button>
                  <button onClick={() => setStep(1)} className="text-[9px] font-black uppercase tracking-widest text-white/10 hover:text-white transition-colors">
                    Go Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-auto pt-16 flex items-end justify-between font-mono">
          <div className="flex gap-10">
            <div className="flex flex-col gap-1">
              <span className="text-[7px] text-white/20 uppercase tracking-widest">IP_INTERNAL</span>
              <span className="text-[9px] text-white/60">[ 192.168.1.104 ]</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[7px] text-white/20 uppercase tracking-widest">Encryption</span>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#afff00] animate-pulse" />
                <span className="text-[9px] text-[#afff00]">AES_256_ACTIVE</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="text-[7px] text-white/20 uppercase tracking-widest">Sync_Rate // 128_kbps</span>
             <SyncGraph />
          </div>
        </div>

        <AnimatePresence>
          {isUplinking && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md"
            >
              <div className="w-16 h-[1px] bg-[#afff00] animate-pulse mb-8" />
              <span className="font-mono text-[9px] text-[#afff00] uppercase tracking-[0.8em] animate-pulse font-black">GRANTING_ACCESS</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loginSuccess && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-mono text-[#afff00] text-[10px] tracking-[0.5em] uppercase font-black"
              >
                &gt; TERMINAL_SESSION_OPEN // REDIRECTING...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;

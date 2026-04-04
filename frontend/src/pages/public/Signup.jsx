import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';
import {
  User, Mail, Phone, Lock, ArrowLeft, CheckCircle,
  Eye, UserPlus, Shield, AlertCircle, Hash,
  Instagram, Twitter
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

// ─── Telemetry Mini Graph ─────────────────────────────────────
const SyncGraph = () => (
  <div className="w-12 h-4 overflow-hidden relative opacity-40">
    <motion.svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
      <motion.path
        d="M0 20 Q 10 5, 20 20 T 40 20 T 60 20 T 80 20 T 100 20"
        fill="none" stroke="#afff00" strokeWidth="2"
        animate={{ d: [
          "M0 20 Q 10 5, 20 20 T 40 20 T 60 20 T 80 20 T 100 20",
          "M0 20 Q 10 35, 20 20 T 40 20 T 60 20 T 80 20 T 100 20",
          "M0 20 Q 10 5, 20 20 T 40 20 T 60 20 T 80 20 T 100 20"
        ]}}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.svg>
  </div>
);

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
      <h1 className="text-[clamp(3rem,11vw,10rem)] font-black text-white leading-[0.8] tracking-tighter uppercase font-mono italic">
        {display}
      </h1>
    </motion.div>
  );
};

// ─── Architectural Input (Tactical Underline Protocol) ─────────
const ArchitecturalInput = ({ icon: Icon, label, type, name, value, onChange, onFocusChange, placeholder, required = true, rightEl, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  const inputId = `signup-${name}`;

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
          placeholder={placeholder} required={required} autoComplete={autoComplete}
          className="w-full bg-transparent py-4 px-1 text-sm focus:outline-none text-white placeholder:text-white/5 uppercase font-medium tracking-tight"
        />
        {/* Underline Infrastructure */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5" />
        <motion.div
           initial={{ scaleX: 0 }}
           animate={{ scaleX: focused ? 1 : 0 }}
           transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
           className="absolute bottom-0 left-0 w-full h-[1px] bg-[#afff00] origin-center shadow-[0_0:10px_#afff00]"
        />
        {rightEl && <div className="absolute right-0 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
    </div>
  );
};

// ─── Terminal Progress Log ────────────────────────────────────
const LOGS = [
  "INITIALIZING_VAULT_PROTOCOLS...",
  "HANDSHAKING_WITH_EXTRACTION_NODE...",
  "VERIFYING_CREDENTIAL_PACKETS...",
  "ENCRYPTING_SOVEREIGN_ID...",
  "ACCESS_GRANTED. REDIRECTING..."
];

const TerminalLog = ({ active }) => {
  const [visibleLogs, setVisibleLogs] = useState([]);

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setVisibleLogs(prev => {
          if (prev.length < LOGS.length) return [...prev, LOGS[prev.length]];
          return prev;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setVisibleLogs([]);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-8"
        >
          <div className="w-full max-w-sm bg-[#050505] border border-white/5 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
              <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest ml-auto font-black">INITIALIZING_PROTOCOL_VAULT</span>
            </div>
            <div className="space-y-4 text-left">
              {visibleLogs.map((log, i) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`font-mono text-[9px] tracking-[0.2em] uppercase ${log.includes('GRANTED') ? 'text-[#afff00]' : 'text-white/40'}`}
                >
                  <span className="text-white/10 mr-2 font-black">&gt;</span> {log}
                </motion.p>
              ))}
              {visibleLogs.length < LOGS.length && (
                <motion.div animate={{ opacity: [1, 0, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-3 bg-[#afff00] inline-block" />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const strengthLabel = ['', 'Weak', 'Fair', 'Strong', 'Excellent'];
const strengthColor = ['', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
const strengthText = ['', 'text-rose-500', 'text-amber-500', 'text-blue-500', 'text-emerald-500'];

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT (ARCHITECTURAL / 50-50 SPLIT SYMMETRY)
// ─────────────────────────────────────────────────────────────
const Signup = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '', phone: '', password: '',
    referralCode: searchParams.get('ref') || ''
  });

  const [strength, setStrength] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // --- Logic Hooks (Preserved) ---
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    let s = 0;
    if (formData.password.length > 7) s++;
    if (/[A-Z]/.test(formData.password)) s++;
    if (/\d/.test(formData.password)) s++;
    if (/[^a-zA-Z0-9]/.test(formData.password)) s++;
    setStrength(s);
  }, [formData.password]);

  // --- Handlers (Preserved) ---
  const handleChange = (e) => {
    setError('');
    let value = e.target.value;
    if (e.target.name === 'phone') {
      value = value.replace(/\D/g, '');
      if (value.startsWith('91')) value = value.slice(2);
      if (value.length > 10) value = value.slice(0, 10);
      if (value.length > 5) value = `+91 ${value.slice(0, 5)} ${value.slice(5)}`;
      else if (value.length > 0) value = `+91 ${value}`;
    }
    setFormData({ ...formData, [e.target.name]: value });
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

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) { setError('Please accept the Terms of Service.'); return; }
    if (strength < 4) { setError('Password security rejected. Please use a stronger password.'); return; }
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/signup', { ...formData, email: formData.email.trim().toLowerCase() });
      if (res.status === 201 || res.status === 206) {
        setStep(2); // Go to OTP Step
      }
    } catch (err) { setError(err.response?.data?.msg || 'Registration failed. Please check your network connection.'); }
    finally { setLoading(false); }
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await axios.post('/api/auth/signup', { ...formData, email: formData.email.trim().toLowerCase() });
      setResendTimer(60); setError('');
    } catch (err) { setError(err.response?.data?.msg || 'Failed to resend verification code.'); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    const combined = otp.join('');
    if (combined.length < 6) return;
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/verify-email', { email: formData.email.trim().toLowerCase(), otp: combined });
      if (res.status === 200) {
        if (res.data.token) localStorage.setItem('token', res.data.token);
        setStep(3);
        setTimeout(() => { window.location.href = '/dashboard'; }, 3000);
      }
    } catch (err) { setError(err.response?.data?.msg || 'Invalid verification code.'); }
    finally { setLoading(false); }
  };

  const completion = [
    formData.fullName,
    formData.username,
    formData.email,
    formData.phone,
    formData.password,
    acceptedTerms
  ].filter(Boolean).length / 6;

  return (
    <div 
      className="relative flex flex-col lg:flex-row min-h-screen lg:h-screen w-full bg-[#0a0a0a] overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans arc-grain-bg"
    >
      <TerminalLog active={loading} />
      <style dangerouslySetInnerHTML={{ __html: `
        .arc-grain-bg::after {
          content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px; z-index: 100;
        }
      `}} />

      {/* ── LEFT SECTION (THE DARK SCANNER) ── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full lg:w-1/2 bg-[#050505] relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 z-20 min-h-[700px] lg:h-full overflow-hidden"
      >
        {/* Divider Glow */}
        <div className="absolute right-0 top-0 w-[1px] h-full bg-[#afff00]/40 shadow-[0_0_15px_#afff00]" />

        {/* Kinetic Scan Bar */}
        <AnimatePresence>
          {formData.username && (
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
          {formData.username && (
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
        <div className="relative z-10 flex-1 flex flex-col justify-center py-20">
          <HandshakeText 
            text={formData.username ? `@${formData.username}` : "PROTOCOL"} 
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

        {/* Metadata description */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-[440px] mb-12 relative z-10"
        >
           <p className="text-[10px] font-black text-[#afff00] uppercase tracking-[0.4em] mb-4">UPLINK_INFRASTRUCTURE_ACTIVE</p>
           <p className="text-xs font-medium text-white/40 leading-relaxed mb-6">
             Join 48,000+ creators scaling their networks on elite infrastructure. Automated drops, instant bank settlements, and zero friction.
           </p>
        </motion.div>

        {/* Telemetry (Bottom) */}
        <div className="relative z-10 flex flex-wrap gap-12 items-end font-mono">
          <div className="flex gap-12">
            <div className="flex flex-col gap-1">
              <span className="text-[7px] text-white/20 uppercase tracking-widest">Node_IP</span>
              <span className="text-[10px] text-white/60 font-black tracking-widest">[ 127.0.0.1 ]</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[7px] text-white/20 uppercase tracking-widest">Encryption</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#afff00] animate-pulse shadow-[0_0_10px_#afff00]" />
                <span className="text-[10px] text-[#afff00] font-black tracking-widest italic">AES-256</span>
              </div>
            </div>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-6 text-white/10">
            <Twitter className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
            <Instagram className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>

        {/* Flashbulb Overlay */}
        <AnimatePresence>
          {loading && step === 3 && (
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
      <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 z-30 bg-[#0a0a0a] min-h-screen lg:h-full overflow-y-visible">
        
        {/* SIGNUP FORM (Background Integrated) */}
        <motion.div 
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120, delay: 0.2 }}
          className="w-full max-w-[460px] relative"
        >
          {/* Thin Neon Progress Bar */}
          <div className="absolute top-[-60px] left-0 w-full h-[1px] bg-[#111111]/5 overflow-hidden">
            <motion.div 
              animate={{ width: `${completion * 100}%` }}
              className="h-full bg-[#afff00] shadow-[0_0_10px_#afff00]"
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="signup" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="relative">
                {/* Backlit Auth Switch */}
                <div className="flex justify-end mb-12 relative">
                  <div className="flex p-1 bg-white/5 backdrop-blur-xl rounded-full border border-white/5 relative z-10">
                    <button
                      onClick={() => (window.location.href = '/login')}
                      className="px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all text-white/20 hover:text-white"
                    >
                      Login
                    </button>
                    <button
                      className="px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all relative text-black"
                    >
                      <motion.div layoutId="backlit" className="absolute inset-0 bg-[#afff00] rounded-full -z-10 shadow-[0_0_20px_#afff00]" />
                      Signup
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter mb-2 font-mono uppercase italic">
                      Initialize.
                    </h2>
                    <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20">
                      Step 1 of 2: ACCESS_RECONNAISSANCE
                    </p>
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6 p-4 bg-rose-500/10 border-l-2 border-rose-500 text-rose-500 text-[9px] font-black uppercase tracking-[0.2em] flex gap-3 items-center">
                    <AlertCircle className="w-3.5 h-3.5" /> {error}
                  </motion.div>
                )}

                <form onSubmit={handleSignup} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <ArchitecturalInput icon={User} label="NAME_IDENTIFIER" type="text" name="fullName" value={formData.fullName} onChange={handleChange} onFocusChange={setFocusedField} placeholder="FIRST LAST" autoComplete="name" />
                    <ArchitecturalInput 
                      icon={Hash} 
                      label="ACCESS_HANDLE" 
                      type="text" name="username" value={formData.username} 
                      onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })} 
                      onFocusChange={setFocusedField}
                      placeholder="HANDLE" autoComplete="username" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <ArchitecturalInput icon={Mail} label="UPLINK_MAIL" type="email" name="email" value={formData.email} onChange={handleChange} onFocusChange={setFocusedField} placeholder="MAIL@NODE.IO" autoComplete="email" />
                    <ArchitecturalInput icon={Phone} label="COMM_LINE" type="text" name="phone" value={formData.phone} onChange={handleChange} onFocusChange={setFocusedField} placeholder="+91 00000 00000" autoComplete="tel" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
                    <ArchitecturalInput icon={UserPlus} label="REFERRAL_KEY" type="text" name="referralCode" value={formData.referralCode} onChange={handleChange} onFocusChange={setFocusedField} placeholder="OPTIONAL" required={false} />
                    <div className="space-y-2">
                       <ArchitecturalInput icon={Lock} label="AUTH_CREDENTIAL" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onFocusChange={setFocusedField} placeholder="MIN 8 CHARS" autoComplete="new-password"
                         rightEl={<button type="button" onClick={() => setShowPassword(!showPassword)}><Eye className={`w-4 h-4 ${showPassword ? 'text-[#afff00]' : 'text-white/20'}`} /></button>}
                       />
                       {formData.password && (
                         <div className="flex flex-col gap-1.5 pt-1 px-1">
                           <div className="flex gap-1">
                             {[1, 2, 3, 4].map(idx => (
                               <div key={idx} className={`h-[1px] flex-1 ${idx <= strength ? strengthColor[strength] : 'bg-white/5'}`} />
                             ))}
                           </div>
                           <p className={`text-[8px] font-black uppercase tracking-widest ${strengthText[strength]}`}>{strengthLabel[strength]} Security State</p>
                         </div>
                       )}
                    </div>
                  </div>

                  <div 
                    onClick={() => setAcceptedTerms(!acceptedTerms)}
                    className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex gap-4 ${acceptedTerms ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all ${acceptedTerms ? 'bg-[#afff00] border-[#afff00]' : 'border-white/10'}`}>
                      {acceptedTerms && <CheckCircle className="w-3.5 h-3.5 text-black" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#afff00] mb-1">PROTOCOLS_DECLARED</p>
                      <p className="text-[8px] font-medium text-white/30 uppercase tracking-widest leading-relaxed">I ACKNOWLEDGE THE MASTER SERVICE AGREEMENT & PRIVACY_NODE.</p>
                    </div>
                  </div>

                  <motion.button 
                    type="submit" 
                    disabled={loading}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(175,255,0,0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-16 bg-[#afff00] text-black font-black uppercase tracking-[0.6em] text-[12px] transition-all disabled:opacity-20 flex items-center justify-center gap-4"
                  >
                    {loading ? "EXECUTING_PAYLOAD..." : "ENGAGE_MAINNET"}
                  </motion.button>
                </form>

                  <div className="mt-auto pt-16 flex items-end justify-between font-mono">
                    <div className="flex gap-10">
                      <div className="flex flex-col gap-1">
                        <span className="text-[7px] text-white/20 uppercase tracking-widest">Access_Point</span>
                        <span className="text-[9px] text-white/60">[ GLOBAL_CDN_01 ]</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[7px] text-white/20 uppercase tracking-widest">Vault_Sync</span>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#afff00] animate-pulse" />
                          <span className="text-[9px] text-[#afff00]">ACTIVE</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <span className="text-[7px] text-white/20 uppercase tracking-widest">Packet_Sync // 128_kbps</span>
                       <SyncGraph />
                    </div>
                  </div>
              </motion.div>
            ) : step === 2 ? (
              <motion.div key="otp" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="text-center flex flex-col justify-center h-full">
                 <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-10">
                   <Shield className="w-10 h-10 text-[#afff00] animate-pulse" />
                 </div>
                 <h2 className="text-4xl font-black text-white tracking-tighter mb-4 font-mono uppercase italic">Verify.</h2>
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-12">SENT_TO {formData.email}</p>

                 {error && (
                   <div className="mb-8 p-4 bg-rose-500/10 border-l-2 border-rose-500 text-rose-500 text-[9px] font-black uppercase tracking-[0.2em]">
                     {error}
                   </div>
                 )}

                 <div className="flex justify-center flex-wrap gap-4 mb-12">
                   {otp.map((digit, idx) => (
                     <input key={idx} id={`otp-${idx}`} type="text" maxLength="1" value={digit} onChange={e => handleOtpChange(e.target.value, idx)} onKeyDown={e => handleKeyDown(e, idx)}
                       className="w-12 h-16 bg-white/5 border-b-2 border-white/10 text-center text-3xl font-black text-white outline-none focus:border-[#afff00] transition-all uppercase" />
                   ))}
                 </div>

                 <motion.button 
                   onClick={handleVerify} disabled={loading || otp.join('').length < 6}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="w-full h-16 bg-[#afff00] text-black font-black uppercase tracking-[0.6em] text-[12px] flex items-center justify-center gap-4 transition-all disabled:opacity-20">
                   {loading ? "VERIFYING..." : "COMMIT_ACCESS"}
                 </motion.button>

                 <div className="mt-12 flex flex-col gap-6">
                   <button onClick={resendOtp} disabled={resendTimer > 0} className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-[#afff00] transition-colors">
                     {resendTimer > 0 ? `RETRY_IN_${resendTimer}S` : 'REGENERATE_TOKEN'}
                   </button>
                   <button onClick={() => setStep(1)} className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-white transition-colors">
                     RESET_IDENTITY
                   </button>
                 </div>
              </motion.div>
            ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center h-full">
                  <div className="w-24 h-24 bg-[#afff00]/5 rounded-[2.5rem] flex items-center justify-center mb-10 border border-[#afff00]/10 relative">
                    <CheckCircle className="w-12 h-12 text-[#afff00]" />
                  </div>

                  <h3 className="text-5xl font-black italic tracking-tighter mb-4 uppercase text-white font-mono">AUTHORIZED.</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-16 text-white/20">
                    REDIRECTING_TO_IDENTITY_DASHBOARD
                  </p>

                  <div className="w-full max-w-[200px] h-[1px] bg-white/5 rounded-full overflow-hidden mb-6">
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3, ease: "linear" }} className="h-full bg-[#afff00]" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#afff00] animate-pulse">Establishing Session...</span>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
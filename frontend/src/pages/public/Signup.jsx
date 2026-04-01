import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';
import {
  User, Mail, Phone, Lock, ArrowRight, ArrowLeft, CheckCircle,
  Eye, UserPlus, Shield, AlertCircle, Loader2, Hash,
  TrendingUp, Activity, Apple, Play, Instagram, Twitter
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { ComicAuthSwitch } from '../../components/common/AuthSwitch';

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
const ArchitecturalInput = ({ icon: Icon, label, type, name, value, onChange, placeholder, required = true, rightEl, autoComplete, light = false }) => {
  const [focused, setFocused] = useState(false);
  const inputId = `signup-${name}`;

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
    <div className="space-y-2">
      <label htmlFor={inputId} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${labelColor}`}>
        {label}
      </label>
      <div className="relative group">
        <Icon className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${iconColor}`} />
        <input
          id={inputId}
          type={type} name={name} value={value} onChange={onChange} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full bg-transparent border-b-2 py-2.5 pl-8 pr-12 text-sm focus:outline-none transition-all ${borderColor} ${textColor} placeholder:text-[#111111]/10`}
        />
        {rightEl && <div className="absolute right-0 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
    </div>
  );
};

// ─── Password Strength Styles ─────────────────────────────────
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

      {/* ── LEFT SECTION (50% Black) ── */}
      <motion.div 
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="w-full lg:w-1/2 bg-[#111111] relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 z-20 min-h-[500px] lg:h-full"
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
          {/* Relocated Description & Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="max-w-[440px] mb-8 sm:mb-12"
          >
             <p className="text-xs font-medium text-[#f5f4e2]/50 leading-relaxed mb-6">
               Join 48,000+ creators scaling their networks on elite infrastructure. Automated drops, instant bank settlements, and zero friction.
             </p>
             <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 transition-all text-[9px] font-black uppercase tracking-widest text-white/50">
                  <Apple className="w-3.5 h-3.5 text-[#f5f4e2]" /> <span className="text-[#f5f4e2]">App Store</span>
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 transition-all text-[9px] font-black uppercase tracking-widest text-white/50">
                  <Play className="w-3.5 h-3.5 fill-[#f5f4e2] text-[#f5f4e2]" /> <span className="text-[#f5f4e2]">Google Play</span>
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
               <StatCard icon={TrendingUp} label="Paid Out" value="₹2.4Cr+" />
               <StatCard icon={Activity} label="Latency" value="18ms" />
            </div>
            <div className="flex gap-4">
              <Twitter className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
              <Instagram className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT SECTION (50% Cream Canvas - Form side) ── */}
      <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center p-6 sm:p-10 lg:p-14 z-30 py-10 lg:h-full overflow-y-visible">
        
        {/* SIGNUP FORM (Background Integrated) */}
        <motion.div 
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120, delay: 0.2 }}
          className="w-full max-w-[460px]"
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="signup" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="relative">
                {/* Floating Comic Switch on Left (Desktop) */}
                <div className="hidden lg:block absolute left-[-340px] top-4 rotate-[-1deg]">
                  <ComicAuthSwitch active="signup" brandColor="#111111" />
                </div>

                {/* Mobile Tablet Centered Switch */}
                <div className="lg:hidden flex justify-center mb-10">
                  <ComicAuthSwitch active="signup" brandColor="#111111" />
                </div>

                <div className="flex justify-between items-start mb-6 sm:mb-8">
                  <div>
                    <h2 className="text-4xl font-bold text-[#111111] tracking-tighter mb-1 whitespace-nowrap" style={georgiaFont}>
                      Create Account.
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.25em] font-black text-[#111111]/30">
                      Step 1 of 2: Account Registration
                    </p>
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-500 text-[10px] font-bold flex gap-3">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </motion.div>
                )}

                <form onSubmit={handleSignup} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <ArchitecturalInput icon={User} label="Full Name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="First Last" autoComplete="name" light />
                    <ArchitecturalInput 
                      icon={Hash} 
                      label="Handle" 
                      type="text" name="username" value={formData.username} 
                      onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })} 
                      placeholder="e.g. handle" autoComplete="username" 
                      light
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <ArchitecturalInput icon={Mail} label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="creator@uplink.io" autoComplete="email" light />
                    <ArchitecturalInput icon={Phone} label="Phone Number" type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" autoComplete="tel" light />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start">
                    <ArchitecturalInput icon={UserPlus} label="Referral Code" type="text" name="referralCode" value={formData.referralCode} onChange={handleChange} placeholder="Optional" required={false} light />
                    <div className="space-y-1">
                      <ArchitecturalInput icon={Lock} label="Password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Min 8 chars" autoComplete="new-password" light
                        rightEl={<button type="button" onClick={() => setShowPassword(!showPassword)}><Eye className={`w-4 h-4 ${showPassword ? 'text-[#111111]' : 'text-[#111111]/20'}`} /></button>}
                      />
                      {formData.password && (
                        <div className="flex flex-col gap-1.5 pt-1">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map(idx => (
                              <div key={idx} className={`h-[2px] flex-1 rounded-full ${idx <= strength ? strengthColor[strength] : 'bg-[#111111]/5'}`} />
                            ))}
                          </div>
                          <p className={`text-[9px] font-black uppercase tracking-widest ${strengthText[strength]}`}>{strengthLabel[strength]} Security</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div 
                    onClick={() => setAcceptedTerms(!acceptedTerms)}
                    className={`p-4 rounded-[1.5rem] border-2 transition-all cursor-pointer flex gap-4 ${acceptedTerms ? 'bg-[#111111]/5 border-[#111111] shadow-lg shadow-black/5' : 'bg-transparent border-[#111111]/5 hover:border-[#111111]/10'}`}
                  >
                    <div className={`w-5 h-5 rounded-[0.5rem] flex items-center justify-center shrink-0 border-2 transition-all ${acceptedTerms ? 'bg-[#111111] border-[#111111]' : 'border-[#111111]/20'}`}>
                      {acceptedTerms && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#111111] mb-0.5">Terms of Service</p>
                      <p className="text-[9px] font-medium text-[#111111]/40 leading-relaxed">By creating an account, you acknowledge the Drope Terms and Privacy Policy.</p>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#111111] text-white py-6 font-black uppercase tracking-[0.4em] text-[13px] italic flex items-center justify-center gap-4 transition-all hover:bg-emerald-600 hover:shadow-[8px_8px_0px_#000] disabled:opacity-50 group mt-4"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center pb-8 lg:pb-0">
                </div>
              </motion.div>
            ) : step === 2 ? (
              <motion.div key="otp" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="text-center">
                 <div className="w-20 h-20 rounded-[2rem] bg-[#111111]/5 border border-[#111111]/10 flex items-center justify-center mx-auto mb-8">
                   <Shield className="w-10 h-10 text-[#111111] animate-pulse" />
                 </div>
                 <h2 className="text-4xl font-bold text-[#111111] tracking-tighter mb-2 whitespace-nowrap" style={georgiaFont}>Verify Email.</h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111111]/30 mb-12">Verification code sent to {formData.email}</p>

                 {error && (
                   <div className="mb-8 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-500 text-[10px] font-bold">
                     {error}
                   </div>
                 )}

                 <div className="flex justify-center flex-wrap gap-3 mb-10">
                   {otp.map((digit, idx) => (
                     <input key={idx} id={`otp-${idx}`} type="text" maxLength="1" value={digit} onChange={e => handleOtpChange(e.target.value, idx)} onKeyDown={e => handleKeyDown(e, idx)}
                       className="w-10 sm:w-12 h-14 sm:h-16 bg-[#111111]/5 border-2 border-[#111111]/10 rounded-2xl text-center text-3xl font-black text-[#111111] outline-none focus:border-[#111111] transition-all" />
                   ))}
                 </div>

                 <button onClick={handleVerify} disabled={loading || otp.join('').length < 6}
                   className="w-full bg-[#111111] text-white py-6 font-black uppercase tracking-[0.4em] text-[13px] italic flex items-center justify-center gap-4 transition-all hover:bg-emerald-600 hover:shadow-[8px_8px_0px_#000] disabled:opacity-50 group">
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                     <>
                       Verify & Continue <CheckCircle className="w-5 h-5 text-emerald-400 group-hover:scale-125 transition-transform" />
                     </>
                   )}
                 </button>

                 <div className="mt-10 flex flex-col gap-5 pb-8 lg:pb-0">
                   <button onClick={resendOtp} disabled={resendTimer > 0} className="text-[10px] font-black uppercase tracking-widest text-[#111111]/20 hover:text-[#111111] transition-colors">
                     {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Verification Code'}
                   </button>
                   <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-[#111111]/10 hover:text-[#111111] transition-colors">
                     Edit account details
                   </button>
                 </div>
              </motion.div>
            ) : (
                /* ── SUCCESS REDIRECT ── */
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-8">
                  <div className="w-24 h-24 bg-emerald-500/5 rounded-[2.5rem] flex items-center justify-center mb-10 border border-emerald-400/10 relative">
                    <motion.div className="absolute inset-0 rounded-[2.5rem] border-2 border-emerald-500/50" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                  </div>

                  <h3 className="text-5xl font-black italic tracking-tighter mb-4 uppercase text-[#111111] whitespace-nowrap" style={georgiaFont}>Account Ready.</h3>
                  <p className="text-sm font-medium mb-12 max-w-[320px] text-[#111111]/40">
                    Your account has been successfully created. Redirecting to your dashboard...
                  </p>

                  <div className="w-full max-w-[300px] h-1 bg-[#111111]/5 rounded-full overflow-hidden mb-4">
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3, ease: "linear" }} className="h-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 animate-pulse">Finalizing setup...</span>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
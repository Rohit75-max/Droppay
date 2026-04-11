import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';
import {
  User, Mail, Phone, Lock, ArrowLeft, CheckCircle,
  Eye, EyeOff, UserPlus, Shield, AlertCircle, Hash
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

// ─── Architectural Input ──────────────────────────────────────
const ArchitecturalInput = ({ icon: Icon, label, type, name, value, onChange, onFocusChange, placeholder, required = true, rightEl, autoComplete }) => {
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
          placeholder={placeholder} required={required} autoComplete={autoComplete}
          className="w-full bg-white/5 border border-white/5 py-4 px-5 text-sm focus:outline-none text-white placeholder:text-white/5 uppercase font-medium tracking-tight"
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

const strengthLabel = ['', 'Weak', 'Fair', 'Strong', 'Excellent'];
const strengthColor = ['', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
const strengthText = ['', 'text-rose-500', 'text-amber-500', 'text-blue-500', 'text-emerald-500'];

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const Signup = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  // eslint-disable-next-line no-unused-vars
  const [focusedField, setFocusedField] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '', phone: '', password: '',
    referralCode: searchParams.get('ref') || ''
  });
  const [strength, setStrength] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Background display text
  const displayText = "REGISTER";

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
        setStep(2);
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
        window.location.href = '/dashboard';
      }
    } catch (err) { setError(err.response?.data?.msg || 'Invalid verification code.'); }
    finally { setLoading(false); }
  };

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
              {formData.username ? `@${formData.username}` : displayText}
            </h1>
          </div>
        </div>
      </div>

      {/* ─── TACTICAL INTERFACE CARD ─── */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-30 w-full max-w-[520px] px-8 sm:px-0 py-8"
      >
        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-10 sm:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: SIGNUP FORM ── */}
            {step === 1 ? (
              <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {/* Header */}
                <div className="mb-10">
                  <h2 className="text-[clamp(1.8rem,8vw,3rem)] font-black tracking-tighter font-mono text-center leading-tight whitespace-nowrap">
                    <span className="text-white">Signup to </span><span className="text-[#afff00] uppercase">DROPE</span>
                  </h2>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="mb-8 p-4 bg-rose-500/10 border-l-2 border-rose-500 text-rose-500 text-[9px] font-black uppercase tracking-[0.2em] flex gap-3 items-center">
                    <AlertCircle className="w-3.5 h-3.5" /> {error}
                  </motion.div>
                )}

                <form onSubmit={handleSignup} className="space-y-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                    <ArchitecturalInput icon={User} label="Full Name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} onFocusChange={setFocusedField} placeholder="FIRST LAST" autoComplete="name" />
                    <ArchitecturalInput
                      icon={Hash} label="Username" type="text" name="username" value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                      onFocusChange={setFocusedField} placeholder="HANDLE" autoComplete="username"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                    <ArchitecturalInput icon={Mail} label="Email" type="email" name="email" value={formData.email} onChange={handleChange} onFocusChange={setFocusedField} placeholder="MAIL@NODE.IO" autoComplete="email" />
                    <ArchitecturalInput icon={Phone} label="Phone" type="text" name="phone" value={formData.phone} onChange={handleChange} onFocusChange={setFocusedField} placeholder="+91 00000 00000" autoComplete="tel" />
                  </div>

                  {/* Password with strength */}
                  <div className="space-y-2">
                    <ArchitecturalInput
                      icon={Lock} label="Password" type={showPassword ? 'text' : 'password'} name="password"
                      value={formData.password} onChange={handleChange} onFocusChange={setFocusedField}
                      placeholder="MIN 8 CHARS" autoComplete="new-password"
                      rightEl={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="w-4 h-4 text-white/20" /> : <Eye className="w-4 h-4 text-white/20" />}</button>}
                    />
                    {formData.password && (
                      <div className="flex flex-col gap-1.5 pt-1 px-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map(idx => (
                            <div key={idx} className={`h-[1px] flex-1 transition-all duration-300 ${idx <= strength ? strengthColor[strength] : 'bg-white/5'}`} />
                          ))}
                        </div>
                        <p className={`text-[8px] font-black uppercase tracking-widest ${strengthText[strength]}`}>{strengthLabel[strength]} Security State</p>
                      </div>
                    )}
                  </div>

                  <ArchitecturalInput icon={UserPlus} label="Referral Code" type="text" name="referralCode" value={formData.referralCode} onChange={handleChange} onFocusChange={setFocusedField} placeholder="OPTIONAL" required={false} />

                  {/* Terms */}
                  <div onClick={() => setAcceptedTerms(!acceptedTerms)} className="py-3 px-2 transition-all cursor-pointer flex gap-4 items-center">
                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all ${acceptedTerms ? 'bg-[#afff00] border-[#afff00]' : 'border-white/10'}`}>
                      {acceptedTerms && <CheckCircle className="w-3.5 h-3.5 text-black" />}
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20">I accept the <span className="text-[#afff00]">Terms of Service</span> &amp; Privacy Policy.</p>
                  </div>

                  {/* Submit Button — matches Login's diagonal wipe */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full h-16 relative overflow-hidden group border border-[#afff00]/30 disabled:opacity-20 transition-opacity"
                  >
                    <motion.div
                      variants={{
                        initial: { x: '100%', y: '-100%' },
                        hover: { x: 0, y: 0 }
                      }}
                      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 bg-[#afff00] z-0"
                      style={{ width: '200%', height: '200%', top: '-50%', left: '-50%', transformOrigin: 'top right' }}
                    />
                    <motion.span
                      variants={{
                        initial: { color: '#afff00' },
                        hover: { color: '#000000' }
                      }}
                      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                      className="relative z-10 flex items-center justify-center gap-3 font-black uppercase tracking-[0.6em] text-[12px]"
                    >
                      {loading ? 'INITIALIZING...' : 'CREATE ACCOUNT'}
                    </motion.span>
                  </motion.button>
                </form>

                <div className="mt-10 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Already have an account? </span>
                  <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.4em] text-[#afff00] hover:text-white transition-colors">Login</Link>
                </div>
              </motion.div>

            ) : step === 2 ? (
              /* ── STEP 2: OTP ── */
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-12">
                  <Shield className="w-12 h-12 text-[#afff00] mb-6 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-4">OTP sent to {formData.email}</p>
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-mono italic text-center mt-2">Verify OTP</h2>
                </div>

                {error && <div className="mb-8 p-4 bg-rose-500/10 border-l-2 border-rose-500 text-rose-500 text-[9px] font-black uppercase tracking-widest">{error}</div>}

                <div className="flex justify-center gap-3 mb-12">
                  {otp.map((digit, idx) => (
                    <input key={idx} id={`otp-${idx}`} type="text" maxLength="1" value={digit}
                      onChange={e => handleOtpChange(e.target.value, idx)}
                      onKeyDown={e => handleKeyDown(e, idx)}
                      className="w-12 h-16 bg-white/5 border border-white/5 text-center text-3xl font-black text-white focus:border-[#afff00] transition-all outline-none" />
                  ))}
                </div>

                <motion.button
                  onClick={handleVerify}
                  disabled={loading || otp.join('').length < 6}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full h-16 relative overflow-hidden group border border-[#afff00]/30 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                >
                  <motion.div
                    variants={{ initial: { x: '100%', y: '-100%' }, hover: { x: 0, y: 0 } }}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bg-[#afff00] z-0"
                    style={{ width: '200%', height: '200%', top: '-50%', left: '-50%', transformOrigin: 'top right' }}
                  />
                  <motion.span
                    variants={{ initial: { color: '#afff00' }, hover: { color: '#000000' } }}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[12px]"
                  >
                    {loading ? 'VERIFYING...' : 'Verify Code'}
                  </motion.span>
                </motion.button>

                <div className="mt-12 flex flex-col gap-4 text-center">
                  <button onClick={resendOtp} disabled={resendTimer > 0} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                    {resendTimer > 0 ? `RETRY_IN_${resendTimer}S` : 'Resend Code'}
                  </button>
                  <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-[#afff00] hover:text-white transition-colors">Edit Details</button>
                </div>
              </motion.div>
            ) : null}

          </AnimatePresence>
        </div>


      </motion.div>

      {/* Back Link */}
      <Link to="/" className="fixed top-8 left-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-white/10 hover:text-[#afff00] transition-colors group z-[100]">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Return</span>
      </Link>
    </div>
  );
};

export default Signup;
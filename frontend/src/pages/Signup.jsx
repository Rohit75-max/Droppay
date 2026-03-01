import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import {
  User, Mail, Phone, Lock, ArrowRight, ArrowLeft, CheckCircle,
  Eye, EyeOff, UserPlus, Zap, Shield, AlertCircle, Loader2, Hash,
  Star, TrendingUp, Globe, Activity
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

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
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/[0.06] border border-white/10"
  >
    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div>
      <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold leading-none mb-0.5">{label}</p>
      <p className="text-sm font-black text-white leading-none">{value}</p>
    </div>
  </motion.div>
);

// ─── Premium Input ────────────────────────────────────────────
const PremiumInput = ({ icon: Icon, label, type, name, value, onChange, placeholder, required = true, rightEl }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] transition-colors ${focused ? 'text-emerald-600' : 'text-slate-400'}`}>
        <Icon className="w-3 h-3" /> {label}
      </label>
      <div className="relative group">
        <motion.div
          className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 pointer-events-none"
          animate={{ opacity: focused ? 0.5 : 0 }}
          transition={{ duration: 0.2 }}
        />
        <div className="relative">
          <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focused ? 'text-emerald-500' : 'text-slate-300'}`} />
          <input
            type={type} name={name} value={value} onChange={onChange} required={required}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-transparent transition-all"
          />
          {rightEl && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>}
        </div>
      </div>
    </div>
  );
};

// ─── Password Strength ────────────────────────────────────────
const strengthLabel = ['', 'Weak', 'Fair', 'Strong', 'Excellent'];
const strengthColor = ['', 'bg-rose-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500'];
const strengthText = ['', 'text-rose-400', 'text-amber-400', 'text-blue-400', 'text-emerald-500'];

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
  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '', phone: '', password: '',
    referralCode: searchParams.get('ref') || ''
  });

  const [strength, setStrength] = useState(0);
  useEffect(() => {
    let s = 0;
    if (formData.password.length > 7) s++;
    if (/[A-Z]/.test(formData.password)) s++;
    if (/\d/.test(formData.password)) s++;
    if (/[^a-zA-Z0-9]/.test(formData.password)) s++;
    setStrength(s);
  }, [formData.password]);

  const handleChange = (e) => { setError(''); setFormData({ ...formData, [e.target.name]: e.target.value }); };

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
    if (strength < 4) { setError('Security protocol rejected. Password too weak.'); return; }
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/signup', { ...formData, email: formData.email.trim().toLowerCase() });
      if (res.status === 201 || res.status === 206) setStep(2);
    } catch (err) { setError(err.response?.data?.msg || 'Identity node connection failed.'); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    const combined = otp.join('');
    if (combined.length < 6) return;
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/verify-email', { email: formData.email.trim().toLowerCase(), otp: combined });
      if (res.data.token) { localStorage.setItem('token', res.data.token); window.location.href = '/subscription'; }
    } catch (err) { setError(err.response?.data?.msg || 'Invalid Transmission Key.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[550px] h-[550px] rounded-full bg-emerald-100/60 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-100/50 blur-[100px]" />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.8)' }}
        className="relative w-full max-w-[1000px] rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row border border-white/80 bg-white"
      >
        {/* ── LEFT — Dark branded panel ── */}
        <div className="relative lg:w-[360px] shrink-0 bg-[#061a12] overflow-hidden flex flex-col justify-between p-5 sm:p-6 lg:p-8 min-h-[220px] lg:min-h-0">
          <Orb size={240} x="-50px" y="-50px" color="rgba(16,185,129,0.22)" duration={7} delay={0} />
          <Orb size={160} x="55%" y="50%" color="rgba(244,114,182,0.15)" duration={9} delay={2} />
          <Orb size={110} x="15%" y="65%" color="rgba(6,182,212,0.14)" duration={6} delay={1} />

          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <motion.div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent pointer-events-none"
            animate={{ top: ['-2%', '102%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 2.5 }} />

          {/* Content */}
          <div className="relative z-10">
            {/* Back button */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="mb-4">
              <Link to="/" className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/10 text-white/50 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> Back
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              </div>
              <div>
                <span className="text-white font-black text-lg italic tracking-tight">Drop<span className="text-emerald-400">Pay</span></span>
                <p className="text-white/30 text-[9px] uppercase tracking-[0.25em] font-bold">Creator Protocol</p>
              </div>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-3xl lg:text-4xl font-black italic text-white leading-[1] tracking-tighter mb-2">
              Launch Your<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #10B981, #f472b6, #818cf8)', WebkitBackgroundClip: 'text' }}>
                Creator Node.
              </span>
            </motion.h2>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
              className="text-white/40 text-xs font-medium leading-relaxed max-w-xs mb-4">
              Join 48,000+ streamers earning on DropPay. Sub-ms drops, instant payouts, zero friction.
            </motion.p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <StatCard icon={User} label="Creators" value="48,200+" color="bg-emerald-500/20 text-emerald-400" delay={0.7} />
              <StatCard icon={TrendingUp} label="Paid Out" value="₹2.4Cr+" color="bg-pink-500/20 text-pink-400" delay={0.8} />
              <StatCard icon={Globe} label="Regions" value="12 Live" color="bg-indigo-500/20 text-indigo-400" delay={0.9} />
              <StatCard icon={Activity} label="Avg Latency" value="18ms" color="bg-cyan-500/20 text-cyan-400" delay={1.0} />
            </div>
          </div>

          {/* Bottom chips */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="relative z-10 flex flex-wrap gap-1.5 mt-3">
            {[
              { icon: Shield, text: 'Bank-grade SSL', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { icon: Star, text: 'Instant Payouts', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
              { icon: Zap, text: 'Sub-ms Drops', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${color}`}>
                <Icon className="w-3 h-3" /> {text}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT — Form ── */}
        <div className="flex-1 flex flex-col justify-center p-6 lg:p-10 bg-white overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="signup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">New Account</p>
                    <p className="text-[10px] text-slate-300 uppercase tracking-widest">Deploy your streaming node</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50">
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                      animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Step 1 of 2</span>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                  <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 mb-1">Create account.</h3>
                  <p className="text-slate-400 text-sm font-medium mb-5">Fill in your details to initialize your node.</p>
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div key="err"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex gap-2 overflow-hidden">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-rose-600 font-bold">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form grid — 2 cols on wider right panel */}
                <form onSubmit={handleSignup} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                      <PremiumInput icon={User} label="Full Name" type="text" name="fullName"
                        value={formData.fullName} onChange={handleChange} placeholder="Your full name" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
                      <PremiumInput icon={Hash} label="Streamer ID" type="text" name="username"
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                        placeholder="unique_handle"
                        rightEl={<span className="text-[9px] font-black text-emerald-500 uppercase tracking-tight opacity-60 group-focus-within:opacity-100">Handle</span>}
                      />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                      <PremiumInput icon={Mail} label="Email" type="email" name="email"
                        value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
                      <PremiumInput icon={Phone} label="Phone" type="text" name="phone"
                        value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.78 }}>
                      <PremiumInput icon={UserPlus} label="Referral Code" type="text" name="referralCode"
                        value={formData.referralCode} onChange={handleChange} placeholder="Optional" required={false} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.82 }}>
                      <PremiumInput icon={Lock} label="Password" type={showPassword ? 'text' : 'password'} name="password"
                        value={formData.password} onChange={handleChange} placeholder="Min 8 chars"
                        rightEl={
                          <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                            className="text-slate-300 hover:text-emerald-500 transition-colors">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                      />
                      {formData.password && (
                        <div className="mt-1.5">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-slate-200'}`} />
                            ))}
                          </div>
                          <p className={`text-[9px] font-bold uppercase tracking-widest ${strengthText[strength]}`}>{strengthLabel[strength]} passphrase</p>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.88 }}>
                    <motion.button type="submit" disabled={loading}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.985 }}
                      className="relative w-full overflow-hidden py-3.5 rounded-2xl font-black uppercase tracking-widest text-[13px] flex items-center justify-center gap-3 transition-all mt-1
                                            bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                                            disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed">
                      <motion.div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }} />
                      {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Initializing...</>
                        : <>Initialize Node <ArrowRight className="w-4 h-4" /></>}
                    </motion.button>
                  </motion.div>
                </form>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[9px] text-slate-300 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
                <div className="text-center">
                  <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-[0.2em] transition-colors group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 font-mono">&gt;</span>
                    Already Authorized? Sign In
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 font-mono">&lt;</span>
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ── STEP 2: OTP ── */
              <motion.div key="otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center">

                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
                  className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-5 border border-emerald-400/20">
                  <Shield className="w-7 h-7 text-emerald-500 animate-pulse" />
                </motion.div>

                <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 mb-1">Confirm Identity.</h3>
                <p className="text-slate-400 text-sm font-medium mb-2">Authorization code sent to your mail node:</p>
                <p className="text-emerald-600 font-black text-sm mb-8">{formData.email}</p>

                <AnimatePresence>
                  {error && (
                    <motion.div key="err"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="w-full bg-rose-50 border border-rose-200 rounded-2xl p-3 flex gap-2 overflow-hidden">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-rose-600 font-bold">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* OTP boxes */}
                <div className="flex justify-center gap-2 mb-8">
                  {otp.map((digit, index) => (
                    <input key={index} id={`otp-${index}`}
                      type="text" maxLength="1" value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-2xl font-black rounded-2xl border-2 transition-all outline-none
                                            bg-slate-50 text-slate-900
                                            ${digit ? 'border-emerald-400 bg-emerald-50 shadow-[0_0_12px_rgba(16,185,129,0.15)]' : 'border-slate-200 focus:border-emerald-400 focus:bg-white'}`}
                    />
                  ))}
                </div>

                <motion.button onClick={handleVerify} disabled={loading || otp.join('').length < 6}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.985 }}
                  className={`relative w-full overflow-hidden py-4 rounded-2xl font-black uppercase tracking-widest text-[13px] flex items-center justify-center gap-3 transition-all
                                    ${otp.join('').length === 6
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                    : <><CheckCircle className="w-5 h-5" /> Verify & Activate Node</>}
                </motion.button>

                <button onClick={() => setStep(1)}
                  className="mt-5 text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-colors tracking-widest">
                  Edit Identity Details
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
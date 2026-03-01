import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Mail, Zap, Loader2, CheckCircle, AlertCircle,
  Send, ArrowLeft, Shield, Lock, Key, RefreshCw, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = `http://${window.location.hostname}:5001`;

// ─── Floating Orb ─────────────────────────────────────────────
const Orb = ({ size, x, y, duration, color, delay }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ width: size, height: size, left: x, top: y, background: color, filter: 'blur(60px)' }}
    animate={{ y: [0, -25, 0], x: [0, 12, 0], scale: [1, 1.07, 1], opacity: [0.3, 0.5, 0.3] }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

// ─── Premium Input ────────────────────────────────────────────
const PremiumInput = ({ icon: Icon, label, value, onChange, placeholder }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-2">
      <label className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] transition-colors ${focused ? 'text-emerald-600' : 'text-slate-400'}`}>
        <Icon className="w-3 h-3" /> {label}
      </label>
      <div className="relative">
        <motion.div
          className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 pointer-events-none"
          animate={{ opacity: focused ? 0.55 : 0 }}
          transition={{ duration: 0.2 }}
        />
        <div className="relative">
          <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focused ? 'text-emerald-500' : 'text-slate-300'}`} />
          <input
            type="email" value={value} onChange={onChange} required
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');


  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
      if (res.data) setSent(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'Recovery transmission failed. Node rejected email.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-100/60 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-100/50 blur-[100px]" />
      </div>

      {/* Main card */}
      <motion.div
        style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.8)' }}
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[900px] rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row border border-white/80 bg-white"
      >
        {/* ── LEFT — Dark branded panel ── */}
        <div className="relative lg:w-[360px] shrink-0 bg-[#061a12] overflow-hidden flex flex-col justify-between p-6 lg:p-8 min-h-[220px] lg:min-h-0">
          <Orb size={220} x="-50px" y="-50px" color="rgba(16,185,129,0.22)" duration={7} delay={0} />
          <Orb size={150} x="50%" y="55%" color="rgba(6,182,212,0.18)" duration={9} delay={2} />
          <Orb size={100} x="10%" y="65%" color="rgba(244,114,182,0.14)" duration={6} delay={1} />

          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <motion.div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent pointer-events-none"
            animate={{ top: ['-2%', '102%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 2.5 }} />

          {/* Content */}
          <div className="relative z-10">
            {/* Back to login */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="mb-4">
              <Link to="/login" className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/10 text-white/50 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> Back to Login
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              </div>
              <div>
                <span className="text-white font-black text-lg italic tracking-tight">Drop<span className="text-emerald-400">Pay</span></span>
                <p className="text-white/30 text-[9px] uppercase tracking-[0.25em] font-bold">Account Recovery</p>
              </div>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-3xl lg:text-4xl font-black italic text-white leading-[1] tracking-tighter mb-2">
              Recover<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #10B981, #06b6d4, #f472b6)', WebkitBackgroundClip: 'text' }}>
                Access.
              </span>
            </motion.h2>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
              className="text-white/40 text-xs font-medium leading-relaxed max-w-xs mb-6">
              Enter the email linked to your account. We'll transmit a secure reset link directly to your inbox.
            </motion.p>

            {/* How it works */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="space-y-2.5">
              {[
                { icon: Mail, text: 'Enter your registered email', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                { icon: Send, text: 'Receive a secure reset link', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                { icon: Lock, text: 'Set your new passphrase', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                { icon: CheckCircle, text: 'Regain full node access', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
              ].map(({ icon: Icon, text, color }, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.1 }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${color}`}>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[9px] font-black uppercase tracking-wider">{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom chips */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
            className="relative z-10 flex flex-wrap gap-1.5 mt-5">
            {[
              { icon: Shield, text: 'Encrypted Link', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { icon: Key, text: '15-min Expiry', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
              { icon: Globe, text: 'Geo-verified', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${color}`}>
                <Icon className="w-3 h-3" /> {text}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT — Form ── */}
        <div className="flex-1 flex flex-col justify-center p-6 lg:p-12 bg-white">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Password Recovery</p>
                    <p className="text-[10px] text-slate-300 uppercase tracking-widest">Initialize reset protocol</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50">
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                      animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ready</span>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                  <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-1">Forgot password?</h3>
                  <p className="text-slate-400 text-sm font-medium mb-8">Enter your email and we'll send a secure reset link.</p>
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div key="err"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex gap-2 overflow-hidden">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-rose-600 font-bold">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleReset} className="space-y-5">
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
                    <PremiumInput icon={Mail} label="Registered Email Address"
                      value={email}
                      onChange={e => { setError(''); setEmail(e.target.value); }}
                      placeholder="you@example.com"
                    />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
                    <motion.button type="submit" disabled={loading}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.985 }}
                      className="relative w-full overflow-hidden py-4 rounded-2xl font-black uppercase tracking-widest text-[13px] flex items-center justify-center gap-3 transition-all
                                            bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                                            disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed">
                      <motion.div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }} />
                      {loading
                        ? <><Loader2 className="w-5 h-5 animate-spin" /> Transmitting...</>
                        : <><Send className="w-4 h-4" /> Send Recovery Link</>}
                    </motion.button>
                  </motion.div>
                </form>

                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[9px] text-slate-300 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                <div className="text-center">
                  <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-[0.2em] transition-colors group">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                    Return to Login
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ── Success state ── */
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center">
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </motion.div>

                {/* Animated pulse ring */}
                <motion.div className="absolute w-20 h-20 rounded-2xl border border-emerald-400/20"
                  animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }} />

                <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-2">Check Inbox.</h3>
                <p className="text-slate-400 text-sm font-medium mb-2">Reset link transmitted to:</p>
                <p className="text-emerald-600 font-black text-sm mb-8 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200">{email}</p>

                <div className="space-y-2 w-full max-w-xs mb-8">
                  {['Check spam/junk folder', 'Link expires in 15 minutes', 'Request a new link if needed'].map((tip, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {tip}
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Link to="/login"
                    className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all
                                        bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
                    <ArrowLeft className="w-4 h-4" /> Return to Login
                  </Link>
                  <button onClick={() => { setSent(false); setEmail(''); }}
                    className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50">
                    <RefreshCw className="w-4 h-4" /> Try Another Email
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
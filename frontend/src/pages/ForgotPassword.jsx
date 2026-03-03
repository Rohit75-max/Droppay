import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import {
  Mail, Zap, Loader2, CheckCircle, AlertCircle,
  Send, ArrowLeft, Shield, Lock, Key, Globe, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
const PremiumInput = ({ icon: Icon, label, value, onChange, placeholder, type = "text" }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-3">
      <label className={`flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-500 ${focused ? 'text-emerald-400' : 'text-white/30'}`}>
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>
      <div className="relative group">
        <motion.div
          className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-emerald-500/50 pointer-events-none transition-opacity duration-500 ${focused ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="relative">
          <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-500 ${focused ? 'text-emerald-400' : 'text-white/20'}`} />
          <input
            type={type} value={value} onChange={onChange} required
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none transition-all duration-500 backdrop-blur-md"
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
      const res = await axios.post('/api/auth/forgot-password', { email });
      if (res.data) setSent(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'Recovery transmission failed. Node rejected email.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden relative">
      <GlobalScanline />

      {/* Background Visuals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[60%] h-[70vh] bg-emerald-500/20 blur-[150px] rounded-full"
        />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[60vh] bg-cyan-500/10 blur-[120px] rounded-full" />

        <FloatingShard size="w-32 h-32" top="15%" left="5%" rotate="12deg" delay={0.5} />
        <FloatingShard size="w-48 h-48" top="65%" left="85%" rotate="-15deg" delay={2} />
        <FloatingShard size="w-24 h-24" top="40%" left="75%" rotate="45deg" delay={1} />

        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[1000px] rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row border border-white/5 bg-[#080808]/80 backdrop-blur-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* ── LEFT — Cyber Panel ── */}
        <div className="relative lg:w-[400px] shrink-0 bg-[#050505] overflow-hidden flex flex-col justify-between p-8 lg:p-12 min-h-[300px] lg:min-h-0 border-r border-white/5">
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <div className="relative z-10">
            <Link to="/login" className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/5 hover:border-white/10 text-white/40 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.3em] mb-12">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Access Portal
            </Link>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative group">
                <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400" />
                <motion.div
                  animate={{ opacity: [0, 0.5, 0], scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-400 blur-lg rounded-full"
                />
              </div>
              <div>
                <span className="text-2xl font-black italic uppercase tracking-tighter">Drop<span className="text-emerald-500">Pay</span></span>
                <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-black">Node Recovery</p>
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black italic text-white leading-[0.9] tracking-tighter mb-6 uppercase flex items-center gap-4">
              Recover<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-200 via-emerald-400 to-cyan-600 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                Uplink.
              </span>
              <motion.div
                animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-emerald-400/50" />
              </motion.div>
            </h2>

            <p className="text-white/40 text-sm font-bold leading-relaxed max-w-xs mb-10 italic">
              Synchronize your master credentials. We'll transmit a secure reset vector to your registered node.
            </p>

            <div className="space-y-3">
              {[
                { icon: Mail, text: 'Identify Node Email', color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' },
                { icon: Send, text: 'Await Transmission', color: 'text-cyan-400 bg-cyan-500/5 border-cyan-500/10' },
                { icon: Lock, text: 'Re-calibrate Key', color: 'text-indigo-400 bg-indigo-500/5 border-indigo-500/10' },
              ].map(({ icon: Icon, text, color }, i) => (
                <div key={i} className={`flex items-center gap-4 px-4 py-3 rounded-2xl border ${color} opacity-60`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2 mt-auto pt-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[9px] font-black uppercase tracking-widest text-emerald-400/60">
              <Shield className="w-3.5 h-3.5" /> 256-bit Encrypted
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[9px] font-black uppercase tracking-widest text-amber-400/60">
              <Key className="w-3.5 h-3.5" /> 15m Protocol
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[9px] font-black uppercase tracking-widest text-cyan-400/60">
              <Globe className="w-3.5 h-3.5" /> Global Uplink
            </div>
          </div>
        </div>

        {/* ── RIGHT — Terminals ── */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 relative">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
                <header className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-1">Key Recovery</h3>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Initialize Reset Sequence</p>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10">
                    <motion.div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                      animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Ready</span>
                  </div>
                </header>

                <AnimatePresence>
                  {error && (
                    <motion.div key="err"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex gap-4 mb-8 overflow-hidden"
                    >
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      <p className="text-xs text-rose-400 font-black uppercase tracking-widest">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleReset} className="space-y-8">
                  <PremiumInput
                    icon={Mail}
                    label="Master Node Identity"
                    value={email}
                    onChange={e => { setError(''); setEmail(e.target.value); }}
                    placeholder="Enter registered email..."
                    type="email"
                  />

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full overflow-hidden py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-[13px] italic flex items-center justify-center gap-4 transition-all duration-500
                    bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_20px_40px_rgba(16,185,129,0.2)]
                    disabled:from-white/5 disabled:to-white/5 disabled:text-white/20 disabled:cursor-not-allowed disabled:shadow-none border border-emerald-400/20"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%]"
                      animate={{ x: loading ? ['-200%', '200%'] : '[-200%]' }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> Transmit Recovery Vector</>}
                  </motion.button>
                </form>

                <div className="flex items-center gap-4 my-10">
                  <div className="flex-1 h-[1px] bg-white/5" />
                  <span className="text-[10px] text-white/10 font-black uppercase tracking-[0.5em]">OR</span>
                  <div className="flex-1 h-[1px] bg-white/5" />
                </div>

                <div className="text-center">
                  <Link to="/login" className="inline-flex items-center gap-3 text-[11px] font-black text-white/30 hover:text-emerald-400 uppercase tracking-[0.3em] transition-all group italic">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-500" />
                    Return to Login Console
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
                <div className="relative mb-10">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative z-10"
                  >
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-[2.5rem] border border-emerald-500/30"
                  />
                </div>

                <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-4">Transmission Sent.</h3>
                <p className="text-white/40 text-sm font-bold mb-10 max-w-sm italic">
                  Synchronization vector dispatched. Check your terminal at:<br />
                  <span className="text-emerald-400 text-base mt-2 block not-italic font-black underline decoration-emerald-500/30 underline-offset-8">{email}</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                  <Link to="/login" className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all italic">
                    <ArrowLeft className="w-4 h-4" /> Login Portal
                  </Link>
                  <button onClick={() => setSent(false)} className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black uppercase tracking-widest text-[11px] hover:bg-emerald-500/20 transition-all italic">
                    Transmit Again
                  </button>
                </div>

                <p className="mt-12 text-white/10 text-[9px] font-black uppercase tracking-[0.5em]">Expected latency: &lt; 2 minutes</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
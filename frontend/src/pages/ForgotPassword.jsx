import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Mail, Zap, Loader2, CheckCircle,
  AlertCircle, MousePointer2, Send
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

// --- MOTION ARCHITECTURE ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const API_BASE = `http://${window.location.hostname}:5001`;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // --- GLOBAL THEME SYNC ---
  const [theme] = useState(() => localStorage.getItem('dropPayTheme') || 'dark');
  useEffect(() => { localStorage.setItem('dropPayTheme', theme); }, [theme]);

  // --- KINETIC BACKGROUND PHYSICS ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    setMousePos({ x: (e.clientX / window.innerWidth) - 0.5, y: (e.clientY / window.innerHeight) - 0.5 });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
      if (res.data) setSent(true);
    } catch (err) {
      setError(err.response?.data?.msg || "Recovery transmission failed. Node rejected email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`flex items-center justify-center h-screen w-full p-4 relative overflow-hidden font-sans transition-colors duration-700 selection:bg-[#10B981]/30 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-slate-50'}`}
    >
      {/* 1. KINETIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ x: mousePos.x * 60, y: mousePos.y * 60 }}
          className={`absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full transition-all duration-700 ${theme === 'dark' ? 'bg-[#10B981]/10 blur-[120px]' : 'bg-[#10B981]/5 blur-[80px]'}`}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
          <MousePointer2 className="w-64 h-64 text-[#10B981]" />
        </div>
      </div>


      {/* 3. RECOVERY PANEL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-lg p-8 sm:p-12 rounded-[3.5rem] backdrop-blur-3xl border transition-all relative z-10 ${theme === 'dark' ? 'bg-[#0a0a0a]/80 border-white/5 shadow-2xl' : 'bg-white/80 border-slate-200 shadow-xl'}`}
      >
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
              <div onClick={() => {
                if (localStorage.getItem('token')) navigate('/dashboard');
                else navigate('/');
              }} className="flex items-center gap-3 mb-6 cursor-pointer group w-fit">
                <Zap className="w-7 h-7 text-[#10B981] fill-[#10B981]" />
                <span className={`text-xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>DropPay</span>
              </div>

              <h1 className={`text-3xl sm:text-4xl font-black italic uppercase mb-1 tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Recover.</h1>
              <p className="text-slate-500 mb-8 text-[9px] font-black uppercase tracking-[0.2em]">Initialize password reset protocol.</p>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-3 py-2 rounded-xl flex items-center gap-2 mb-6 overflow-hidden">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="text-[9px] font-bold uppercase tracking-widest">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.form onSubmit={handleReset} className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
                <motion.div variants={itemVariants} className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-[#10B981] transition-colors" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Registration Email"
                    className={`w-full border rounded-xl py-4 pl-12 pr-4 outline-none text-sm font-medium italic transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#10B981]' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-[#10B981]'}`} required
                  />
                </motion.div>

                <motion.button
                  variants={itemVariants} type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#10B981] text-white py-4 rounded-xl font-black italic uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Send className="w-4 h-4" /> Send Recovery Link</>}
                </motion.button>
              </motion.form>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#10B981]/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle className="w-10 h-10 text-[#10B981]" />
              </div>
              <h2 className={`text-3xl font-black italic uppercase mb-2 tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Check Inbox.</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10 leading-relaxed">
                Reset link transmitted to:<br /><b>{email}</b>
              </p>
              <Link
                to="/login"
                className="text-[#10B981] hover:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] transition-colors"
              >
                Return to Terminal
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
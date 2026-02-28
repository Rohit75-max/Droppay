import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Mail, Lock, Zap, Loader2, ArrowRight,
  Shield, MousePointer2, AlertCircle, Eye, EyeOff, ArrowLeft
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const API_BASE = `http://${window.location.hostname}:5001`;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const [theme] = useState(() => localStorage.getItem('dropPayTheme') || 'dark');
  useEffect(() => { localStorage.setItem('dropPayTheme', theme); }, [theme]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    setMousePos({
      x: (e.clientX / window.innerWidth) - 0.5,
      y: (e.clientY / window.innerHeight) - 0.5
    });
  };

  // 1. PERSISTENCE LOAD: Pre-fill email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      // 2. PERSISTENCE SAVE: Handle "Remember Me" Handshake
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email.trim().toLowerCase());
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      localStorage.setItem('token', response.data.token);

      // RELOCATE: Move straight to the secure nexus
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.msg || "Identity node connection failed.");
    } finally { setLoading(false); }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`flex items-center justify-center min-h-screen w-full p-4 pt-20 sm:pt-4 relative overflow-hidden font-sans transition-colors duration-700 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-slate-50'}`}
    >
      {/* STICKY ESCAPE HATCH */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 left-4 sm:top-12 sm:left-12 z-50"
      >
        <Link
          to="/"
          className={`flex items-center gap-3 py-2 px-4 rounded-full border transition-all group ${theme === 'dark' ? 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-[#10B981]' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-[#10B981]'}`}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Back to Protocol</span>
        </Link>
      </motion.div>

      {/* KINETIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div animate={{ x: mousePos.x * 60, y: mousePos.y * 60 }} className={`absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full transition-all duration-700 ${theme === 'dark' ? 'bg-[#10B981]/10 blur-[120px]' : 'bg-[#10B981]/5 blur-[80px]'}`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
          <MousePointer2 className="w-64 h-64 text-[#10B981]" />
        </div>
      </div>


      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`w-full max-w-lg p-6 sm:p-10 rounded-[3rem] backdrop-blur-3xl border transition-all relative z-10 ${theme === 'dark' ? 'bg-[#0a0a0a]/80 border-white/5 shadow-2xl' : 'bg-white/80 border-slate-200 shadow-xl'}`}>
        <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => {
          if (localStorage.getItem('token')) navigate('/dashboard');
          else navigate('/');
        }}>
          <Zap className="w-7 h-7 text-[#10B981] fill-[#10B981]" />
          <span className={`text-xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>DropPay</span>
        </div>
        <h1 className={`text-3xl sm:text-4xl font-black italic uppercase mb-1 tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Welcome Back.</h1>
        <p className="text-slate-500 mb-6 text-[9px] font-black uppercase tracking-[0.2em]">Authorize your streaming node.</p>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-3 py-2.5 rounded-xl flex items-center gap-2 mb-4 overflow-hidden">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-[9px] font-bold uppercase tracking-widest">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form onSubmit={handleLogin} className="space-y-4" variants={containerVariants} initial="hidden" animate="show">
          <motion.div variants={itemVariants} className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-[#10B981] transition-colors" />
            <input
              name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address"
              className={`w-full border rounded-xl py-3.5 pl-12 pr-4 outline-none text-sm font-medium italic transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#10B981]' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-[#10B981]'}`}
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-[#10B981] transition-colors" />
            <input
              name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="Password"
              className={`w-full border rounded-xl py-3.5 pl-12 pr-12 outline-none text-sm font-medium italic transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#10B981]' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-[#10B981]'}`}
              required
            />
            <button
              type="button" onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors hover:bg-white/5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-widest">
            <label className="flex items-center gap-2 text-slate-500 cursor-pointer group">
              <input
                type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}
                className="accent-[#10B981] w-3 h-3"
              />
              <span className="group-hover:text-slate-300 transition-colors">Remember Node</span>
            </label>
            <Link to="/forgot-password" size="sm" className="text-[#10B981] hover:text-emerald-400 transition-colors">Lost Access?</Link>
          </motion.div>

          <motion.button variants={itemVariants} type="submit" disabled={loading} whileTap={{ scale: 0.98 }} className="w-full bg-[#10B981] hover:shadow-[0_0_20px_#10B981] text-white py-4 rounded-xl font-black italic uppercase tracking-widest flex items-center justify-center gap-3 transition-all mt-4">
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <>Authorize <ArrowRight className="w-4 h-4" /></>}
          </motion.button>
        </motion.form>

        <div className="mt-6 pt-5 border-t border-slate-500/10 space-y-3">
          <Link to="/signup" className={`w-full flex items-center justify-center py-3.5 rounded-xl border font-black italic uppercase tracking-widest text-[9px] gap-3 transition-all ${theme === 'dark' ? 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
            <Shield className="w-3.5 h-3.5" /> Initialize New Account
          </Link>
          <Link to="/admin/login" className="w-full flex items-center justify-center py-2 text-[8px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-[#10B981] transition-colors opacity-40 hover:opacity-100">
            Secure Admin Portal
          </Link>
        </div>
      </motion.div>
    </div >
  );
};

export default Login;
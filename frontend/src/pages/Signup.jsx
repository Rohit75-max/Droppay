import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  User, Mail, Phone, Lock, ChevronRight, CheckCircle,
  Loader2, Zap, ArrowLeft, AlertCircle, Shield, Sun, Moon,
  MousePointer2, Eye, EyeOff, UserPlus
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

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    username: '', email: '', phone: '', password: '', referralCode: ''
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('dropPayTheme') || 'dark');
  useEffect(() => { localStorage.setItem('dropPayTheme', theme); }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    setMousePos({ x: (e.clientX / window.innerWidth) - 0.5, y: (e.clientY / window.innerHeight) - 0.5 });
  };

  const [strength, setStrength] = useState(0);
  useEffect(() => {
    let score = 0;
    if (formData.password.length > 7) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/\d/.test(formData.password)) score++;
    if (/[^a-zA-Z0-9]/.test(formData.password)) score++;
    setStrength(score);
  }, [formData.password]);

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && !otp[index]) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (strength < 4) {
      setError("Security protocol rejected. Password too weak.");
      return;
    }
    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        email: formData.email.trim().toLowerCase()
      };
      const response = await axios.post('http://localhost:5001/api/auth/signup', submissionData);

      // Handle both 201 (Created) and 206 (Partial Content - Existing Unverified)
      if (response.status === 201 || response.status === 206) {
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Identity node connection failed.");
    } finally { setLoading(false); }
  };

  const handleVerify = async () => {
    const combinedOtp = otp.join('');
    if (combinedOtp.length < 6) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/auth/verify-email', {
        email: formData.email.trim().toLowerCase(),
        otp: combinedOtp
      });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/subscription';
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid Transmission Key.");
    } finally { setLoading(false); }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`flex flex-col items-center justify-start sm:justify-center min-h-screen w-full p-4 relative overflow-hidden font-sans transition-colors duration-700 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-slate-50'}`}
    >
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ x: mousePos.x * 60, y: mousePos.y * 60 }}
          className={`absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full transition-all duration-700 ${theme === 'dark' ? 'bg-[#10B981]/10 blur-[120px]' : 'bg-[#10B981]/5 blur-[80px]'}`}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
          <MousePointer2 className="w-96 h-96 text-[#10B981]" />
        </div>
      </div>

      <div className="w-full max-w-lg flex justify-between items-center mb-6 mt-4 relative z-50 px-2">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 transition-colors group text-slate-500 hover:text-[#10B981]">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Home</span>
        </button>
        <button onClick={toggleTheme} className={`p-2.5 rounded-xl border transition-all backdrop-blur-md ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white/80 hover:bg-slate-50 shadow-sm'}`}>
          {theme === 'dark' ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-lg p-6 sm:p-10 rounded-[3rem] backdrop-blur-3xl border transition-all relative z-10 ${theme === 'dark' ? 'bg-[#0a0a0a]/80 border-white/5 shadow-2xl' : 'bg-white/80 border-slate-200 shadow-xl'}`}
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="signup" exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => {
                if (localStorage.getItem('token')) navigate('/dashboard');
                else navigate('/');
              }}>
                <Zap className="w-7 h-7 text-[#10B981] fill-[#10B981]" />
                <span className={`text-xl font-black italic tracking-tighter uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>DropPay</span>
              </div>
              <h1 className={`text-3xl sm:text-4xl font-black italic uppercase mb-1 tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Create Account.</h1>
              <p className="text-slate-500 mb-6 text-[9px] font-black uppercase tracking-[0.2em]">Deploy your streaming node today.</p>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-3 py-2.5 rounded-xl flex items-center gap-2 mb-4 overflow-hidden">
                    <Shield className="w-4 h-4 shrink-0" />
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="text-[9px] font-bold uppercase tracking-widest">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.form onSubmit={handleSignup} className="space-y-3" variants={containerVariants} initial="hidden" animate="show">
                {[
                  { icon: User, name: "username", placeholder: "Display Name (Unique)", type: "text" },
                  { icon: Mail, name: "email", placeholder: "Email Address", type: "email" },
                  { icon: Phone, name: "phone", placeholder: "Phone Number", type: "text" },
                  { icon: UserPlus, name: "referralCode", placeholder: "Referral Code (Optional)", type: "text" },
                  { icon: Lock, name: "password", placeholder: "Password", type: showPassword ? "text" : "password", hasTelemetry: true, isPassword: true }
                ].map((field, i) => (
                  <motion.div key={i} variants={itemVariants} className="relative group">
                    {field.prefix ? (
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-black text-sm transition-colors group-focus-within:text-[#10B981]">{field.prefix}</span>
                    ) : (
                      <field.icon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 transition-colors group-focus-within:text-[#10B981]" />
                    )}
                    <input name={field.name} type={field.type} value={formData[field.name]} onChange={handleChange} placeholder={field.placeholder} className={`w-full border rounded-xl py-3.5 pl-12 pr-12 outline-none text-sm font-medium italic transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#10B981]' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-[#10B981]'}`} required />
                    {field.isPassword && (
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#10B981] transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                    {field.hasTelemetry && (
                      <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-200'}`}>
                        <motion.div className={`h-full ${strength < 2 ? 'bg-rose-500' : strength < 4 ? 'bg-amber-400' : 'bg-[#10B981]'}`} animate={{ width: `${(strength / 4) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 20 }} />
                      </div>
                    )}
                  </motion.div>
                ))}
                <motion.button variants={itemVariants} type="submit" disabled={loading} whileTap={{ scale: 0.98 }} className="w-full bg-[#10B981] hover:shadow-[0_0_20px_#10B981] text-white py-4 rounded-xl font-black italic uppercase tracking-widest flex items-center justify-center gap-3 transition-all mt-4">
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <>Initialize Node <ChevronRight className="w-4 h-4" /></>}
                </motion.button>
              </motion.form>
              <div className="mt-8 pt-5 border-t border-slate-500/10 text-center">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#10B981] transition-colors">Already Authorized? Sign In</Link>
              </div>
            </motion.div>
          ) : (
            <motion.div key="otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              {/* SUCCESS INDICATOR INTEGRATION */}
              <div className="w-20 h-20 bg-[#10B981]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[#10B981]/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden">
                <Shield className="w-8 h-8 text-[#10B981] animate-pulse relative z-10" />
                <CheckCircle className="absolute w-12 h-12 text-[#10B981]/5 -bottom-2 -right-2 rotate-12" />
              </div>
              <h2 className={`text-3xl font-black italic uppercase mb-2 tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Confirm Identity.</h2>
              <p className="text-slate-500 mb-10 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed max-w-[280px] mx-auto">Authorization code sent to your mail node:<br /><span className="text-[#10B981]">{formData.email}</span></p>

              <div className="flex justify-center gap-2 mb-10">
                {otp.map((digit, index) => (
                  <input key={index} id={`otp-${index}`} type="text" maxLength="1" value={digit} onChange={(e) => handleOtpChange(e.target.value, index)} onKeyDown={(e) => handleKeyDown(e, index)} className={`w-10 h-14 sm:w-14 sm:h-20 text-center text-2xl sm:text-3xl font-black rounded-2xl border transition-all outline-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#10B981] focus:bg-[#10B981]/5' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-[#10B981] focus:bg-white'} ${digit ? 'border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]' : ''}`} />
                ))}
              </div>

              <motion.button onClick={handleVerify} disabled={loading || otp.join('').length < 6} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`w-full py-5 rounded-2xl font-black italic uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${otp.join('').length === 6 ? 'bg-[#10B981] text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Verify & Activate Node"}
              </motion.button>
              <button onClick={() => setStep(1)} className="mt-8 text-[10px] font-black uppercase text-slate-500 hover:text-[#10B981] transition-colors tracking-widest">Edit Identity Details</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Signup;
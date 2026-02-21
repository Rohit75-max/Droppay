import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { User, Mail, Phone, Lock, ChevronRight, CheckCircle, Loader2, LogIn, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    username: '', email: '', phone: '', password: '', streamerId: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5001/api/auth/signup', formData);
      setStep(2); 
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/verify-otp', {
        email: formData.email,
        otp: otp
      });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#050505] relative">
      
      {/* --- BACK TO HOME BUTTON --- */}
      <button 
        onClick={() => navigate('/')} 
        className="fixed top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors group z-50"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Protocol</span>
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-[2.5rem] bg-[#111] border border-white/5 shadow-2xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="signup" exit={{ opacity: 0, x: -20 }}>
              {/* Clickable Icon to go Home */}
              <div 
                onClick={() => navigate('/')}
                className="items-center gap-3 mb-6 text-indigo-500 cursor-pointer hover:opacity-80 transition-opacity inline-flex"
              >
                <LogIn className="w-6 h-6" />
                <span className="text-sm font-bold uppercase tracking-widest">Onboarding</span>
              </div>
              
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Create Account</h1>
              <p className="text-slate-500 mb-8 font-medium">Join the next generation of streamers.</p>
              
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-4 text-slate-600 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                  <input name="username" value={formData.username} onChange={handleChange} placeholder="Full Name" className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none text-white transition-all" required />
                </div>

                <div className="relative group">
                  <span className="absolute left-4 top-4 text-slate-600 font-bold text-sm group-focus-within:text-indigo-500 transition-colors">@</span>
                  <input name="streamerId" value={formData.streamerId} onChange={handleChange} placeholder="Unique-Slug (e.g. rohit-live)" className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none text-white font-medium transition-all" required />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-4 top-4 text-slate-600 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                  <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none text-white transition-all" required />
                </div>

                <div className="relative group">
                  <Phone className="absolute left-4 top-4 text-slate-600 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none text-white transition-all" required />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-4 text-slate-600 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                  <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none text-white transition-all" required />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-600/20">
                  {loading ? <Loader2 className="animate-spin" /> : <>Get Started <ChevronRight className="w-5 h-5" /></>}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <Link to="/login" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">
                  Already have an account? Sign in
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div key="otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Verify Email</h2>
                <p className="text-slate-500 mb-8 font-medium">Enter the code sent to your inbox.</p>
                
                <input 
                  maxLength="6" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  placeholder="000000" 
                  className="w-full text-center text-4xl tracking-[1rem] bg-[#1a1a1a] border border-white/5 rounded-2xl py-5 mb-8 outline-none focus:border-green-500 text-white font-mono" 
                />
                
                <button onClick={handleVerify} disabled={loading} className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-bold transition-all mb-4 active:scale-95">
                  {loading ? "Verifying..." : "Confirm OTP"}
                </button>
                <button className="text-slate-500 text-sm hover:text-white transition-colors font-medium">Didn't get the code? Resend</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Signup;
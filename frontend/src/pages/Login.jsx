import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Mail, Lock, LogIn, Loader2, ArrowRight, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', formData);
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      alert(err.response?.data?.msg || "Invalid credentials. Please try again.");
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
        <div className="mb-10 text-center">
            {/* Clickable Icon to go Home */}
            <div 
              onClick={() => navigate('/')}
              className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 cursor-pointer hover:bg-indigo-600/20 transition-all"
            >
                <LogIn className="w-8 h-8 text-indigo-500" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Access your streamer dashboard.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-4 text-slate-600 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              name="email" 
              type="email" 
              value={formData.email}
              onChange={handleChange} 
              placeholder="Email Address" 
              className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none transition-all text-white" 
              required 
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-4 text-slate-600 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              name="password" 
              type="password" 
              onChange={handleChange} 
              placeholder="Password" 
              className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none transition-all text-white" 
              required 
            />
          </div>

          <div className="flex items-center justify-between px-2 text-sm">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded border-white/10 bg-[#1a1a1a] accent-indigo-500"
              />
              Remember Me
            </label>
            <Link to="/forgot-password" value="Lock" className="text-indigo-500 hover:text-indigo-400 font-bold transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/20 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm font-medium">
            New to DropPay? <Link to="/signup" className="text-indigo-500 hover:text-indigo-400 ml-1 font-bold">Create an account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
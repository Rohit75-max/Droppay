import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calling the backend route we added to authRoutes.js
      await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong. Check if the email is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#050505] text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-md p-8 rounded-[2.5rem] bg-[#111] border border-white/5 shadow-2xl"
      >
        {!sent ? (
          <>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Recovery</h1>
            <p className="text-slate-500 mb-8 font-medium">We'll send a secure link to reset your password.</p>
            
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-4 text-slate-600 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Email Address" 
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none transition-all" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4" /> Send Recovery Link</>}
              </button>

              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-white pt-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <Mail className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check your Inbox</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              If an account exists for <b>{email}</b>, you will receive a reset link shortly.
            </p>
            <Link to="/login" className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-bold inline-block transition-all active:scale-95">
              Return to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
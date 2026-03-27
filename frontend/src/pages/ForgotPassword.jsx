import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Loader2, Zap, Globe, Shield, CheckCircle, RefreshCcw } from 'lucide-react';
import axios from '../api/axios';
import { ComicBackLink } from '../components/ComicBackLink';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  
  // OTP States
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/forgot-password', { email: email.trim().toLowerCase() });
      setSent(true);
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.msg || 'Recovery failed. Check your network.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const next = [...otp];
      next[index] = value;
      setOtp(next);
      if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && !otp[index]) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const combined = otp.join('');
    if (combined.length < 6) return;
    
    setLoading(true);
    setError('');
    try {
      // Typically we'd verify the code here and get a temporary token or move directly to reset
      // For now, we'll navigate to reset password with the code/email in state
      // If the backend expects the code as the token, we use it as the token param
      navigate(`/reset-password/${combined}?email=${email}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid or expired recovery protocol.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email: email.trim().toLowerCase() });
      setResendTimer(60);
      setError('');
    } catch (err) {
      setError('Failed to resend protocol code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f4e2] flex flex-col lg:flex-row overflow-hidden relative selection:bg-emerald-500/30">
      
      {/* ── LEFT SECTION (50% Bold Brand Pillar) ── */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full lg:w-1/2 bg-[#064e3b] p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[400px] lg:h-auto z-20"
      >
        {/* Cinematic Background Assets */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Floating Infrastructure Assets */}
        <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-20 right-20 text-white/10 hidden lg:block">
          <Shield size={120} strokeWidth={0.5} />
        </motion.div>
        <motion.div animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 1 }} className="absolute bottom-40 left-10 text-white/10 hidden lg:block">
          <Globe size={180} strokeWidth={0.5} />
        </motion.div>

        {/* Relocated Comic Back Button */}
        <div className="relative z-30 mb-8">
           <ComicBackLink />
        </div>

        {/* Elevated Glitch Brand Footer */}
        <div className="relative z-10">
          <h1 className="text-[clamp(4rem,10vw,10rem)] font-black text-white leading-[0.85] tracking-tighter mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="flex overflow-hidden whitespace-nowrap glitch-text" data-text="DROPE">
              {"DROPE".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </h1>
          <div className="flex gap-12 text-[9px] font-black tracking-[0.4em] uppercase text-white/40">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> RELIABLE</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse " /> SECURE</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> GLOBAL</span>
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT SECTION (50% Cream Canvas - Form side) ── */}
      <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 z-30 py-10 lg:h-full">
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md relative"
        >

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <div className="flex flex-col mb-8">
                  <h2 className="text-5xl font-black tracking-tighter text-[#111111] leading-tight mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    Recovery.
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30">Enter your email to reset</p>
                </div>

                {error && (
                  <div className="bg-red-500/5 border-l-4 border-red-500 p-4 mb-8 text-[10px] font-black uppercase tracking-widest text-red-600 italic">
                    {error}
                  </div>
                )}

                <form onSubmit={handleResetRequest} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 ml-1">Account Channel</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 group-focus-within:text-black transition-colors" />
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="creator@uplink.io"
                        className="w-full bg-white border-2 border-black/5 p-5 pl-14 text-sm font-bold text-black placeholder:text-black/10 focus:border-black focus:outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#111111] text-white py-6 font-black uppercase tracking-[0.4em] text-[13px] italic flex items-center justify-center gap-4 transition-all hover:bg-emerald-600 hover:shadow-[8px_8px_0px_#000] disabled:opacity-50 group"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Request Protocol <Zap className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-center">
                 <div className="w-24 h-24 bg-emerald-500/10 border-4 border-black rounded-[2.5rem] flex items-center justify-center mb-8 shadow-[8px_8px_0px_#000]">
                   <Mail className="w-10 h-10 text-emerald-600" />
                 </div>
                 <h2 className="text-4xl font-black tracking-tighter text-[#111111] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    Sent.
                 </h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-10 text-center px-4">
                    Enter the 6-digit protocol code sent to <br/><span className="text-black">{email}</span>
                 </p>

                 {error && (
                   <div className="w-full mb-8 p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-widest text-center">
                     {error}
                   </div>
                 )}

                 {/* Tactical OTP Input */}
                 <div className="flex justify-center gap-3 mb-12">
                   {otp.map((digit, idx) => (
                      <input 
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        className="w-11 sm:w-14 h-16 sm:h-20 bg-white border-2 border-black/5 rounded-2xl text-center text-2xl font-black text-black outline-none focus:border-black transition-all shadow-sm"
                      />
                   ))}
                 </div>

                 <button 
                   onClick={handleVerifyCode}
                   disabled={loading || otp.join('').length < 6}
                   className="w-full bg-[#111111] text-white py-6 font-black uppercase tracking-[0.4em] text-[13px] italic flex items-center justify-center gap-4 transition-all hover:bg-emerald-600 hover:shadow-[8px_8px_0px_#000] disabled:opacity-50 group mb-10"
                 >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Verify & Reset <CheckCircle className="w-4 h-4 text-emerald-400 group-hover:scale-125 transition-transform" />
                      </>
                    )}
                 </button>

                 <div className="flex flex-col items-center gap-6">
                   <button 
                     onClick={resendCode}
                     disabled={resendTimer > 0 || loading}
                     className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 hover:text-black transition-colors flex items-center gap-2"
                   >
                     {resendTimer > 0 ? (
                       `Resend in ${resendTimer}S`
                     ) : (
                       <><RefreshCcw className="w-3 h-3" /> Resend Code</>
                     )}
                   </button>
                   <button onClick={() => setSent(false)} className="text-[10px] font-black uppercase tracking-[0.3em] text-black/10 hover:text-black transition-colors">
                      Wrong email? Try another channel
                   </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Technical Metadata Footer */}
          <div className="mt-20 pt-10 border-t border-black/5 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-black/20 text-center lg:text-left">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><Shield size={10} /> ENC_256</span>
              <span className="flex items-center gap-1.5"><Globe size={10} /> REMOTE_SYNC</span>
            </div>
            <span>v2.0.26 / SEC_PROTOCOL</span>
          </div>
        </motion.div>
      </div>

      {/* Global Aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      </div>
    </div>
  );
};

export default ForgotPassword;
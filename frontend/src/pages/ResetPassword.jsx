import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Loader2, Shield, Sparkles, Globe } from 'lucide-react';
import axios from '../api/axios';
import { ComicBackLink } from '../components/ComicBackLink';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/reset-password', { token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 4000);
    } catch (err) {
      setError(err.response?.data?.msg || "Link expired or invalid protocol.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f4e2] flex flex-col lg:flex-row overflow-hidden relative selection:bg-emerald-500/30">
      
      {/* ── LEFT SECTION (50% Black 'Security Lock' Pillar) ── */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full lg:w-1/2 bg-[#111111] p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[400px] lg:h-auto z-20"
      >
        {/* Cinematic Background Assets */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Floating Infrastructure Assets */}
        <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-20 right-20 text-white/5 hidden lg:block">
          <Lock size={120} strokeWidth={0.5} />
        </motion.div>
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-40 left-10 text-white/5 hidden lg:block">
          <Sparkles size={180} strokeWidth={0.5} />
        </motion.div>

        {/* Relocated Comic Back Button */}
        <div className="relative z-30 mb-8">
           <ComicBackLink text="Cancel Reset" />
        </div>

        {/* Elevated Glitch Brand Footer */}
        <div className="relative z-10">
          <h1 className="text-[clamp(4rem,10vw,10rem)] font-black text-white leading-[0.85] tracking-tighter mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="flex overflow-hidden whitespace-nowrap glitch-text" data-text="SECURE">
              {"SECURE".split("").map((letter, i) => (
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
            <span className="flex items-center gap-2">PROTOCOL_ENCRYPTED</span>
            <span className="flex items-center gap-2">VAULT_READY</span>
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT SECTION (50% Cream Canvas - Form side) ── */}
      <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 z-30 py-10 lg:h-full">
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-sm relative"
        >
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div key="form" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>

                <div className="flex flex-col mb-8">
                  <h2 className="text-5xl font-black tracking-tighter text-[#111111] leading-tight mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    Reset.
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30">Finalize new security key</p>
                </div>

                {error && (
                  <div className="bg-red-500/5 border-l-4 border-red-500 p-4 mb-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-600 italic">{error}</p>
                  </div>
                )}

                <form onSubmit={handleReset} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 ml-1">New Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 group-focus-within:text-black transition-colors" />
                      <input 
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-white border-2 border-black/5 p-5 pl-14 text-sm font-bold text-black focus:border-black focus:outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 ml-1">Confirm Identity</label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 group-focus-within:text-black transition-colors" />
                      <input 
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-white border-2 border-black/5 p-5 pl-14 text-sm font-bold text-black focus:border-black focus:outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#111111] text-white py-6 font-black uppercase tracking-[0.4em] text-[13px] italic flex items-center justify-center gap-4 transition-all hover:bg-emerald-600 hover:shadow-[8px_8px_0px_#000] disabled:opacity-50 group mt-4"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Update Protocol <Sparkles className="w-5 h-5 text-emerald-400 group-hover:scale-125 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-emerald-500/10 border-4 border-black rounded-[2rem] flex items-center justify-center mb-10 shadow-[8px_8px_0px_#000]">
                   <Shield className="w-10 h-10 text-emerald-600" />
                 </div>
                 <h2 className="text-4xl font-black tracking-tighter text-[#111111] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    Updated.
                 </h2>
                 <p className="text-sm font-bold text-black/60 mb-10 max-w-xs italic leading-relaxed">
                    Security nexus synchronized. Redirecting to login portal...
                 </p>
                 <div className="w-48 h-1 bg-black/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4 }}
                      className="h-full bg-emerald-500"
                    />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Technical Metadata Footer */}
          <div className="mt-20 pt-10 border-t border-black/5 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-black/20">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><Shield size={10} /> ENC_RSA</span>
              <span className="flex items-center gap-1.5"><Globe size={10} /> REMOTE_SYNC</span>
            </div>
            <span>v2.0.26 / RESET</span>
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

export default ResetPassword;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Circle, Triangle, Square, Pentagon, Hexagon, Shield, Zap, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from '../../api/axios';

const FeedbackStation = ({ user }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const RATING_STRATA = [
    { icon: Circle, label: "INITIATE", level: 1 },
    { icon: Triangle, label: "STABLE", level: 2 },
    { icon: Square, label: "OPTIMAL", level: 3 },
    { icon: Pentagon, label: "ADVANCED", level: 4 },
    { icon: Hexagon, label: "SUPREME", level: 5 }
  ];

  const handleSubmit = async () => {
    if (!rating || !feedback.trim()) {
      toast.warning("Incomplete protocol: Data required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/user/feedback', {
        streamerId: user?.streamerId,
        rating,
        message: feedback,
        type: 'nexus_uplink'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSubmitted(true);
    } catch (err) {
      toast.error("Uplink failure: Connection lost.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-[600px] flex flex-col items-center justify-center p-6 space-y-6"
      >
        <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-emerald-500/5"
          />
          <Shield className="w-10 h-10 text-emerald-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black italic tracking-tighter text-[#111111] uppercase">Signal Received</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Uplink_Sync_Complete // Data_Stored</p>
        </div>
        <button 
          onClick={() => { setIsSubmitted(false); setRating(0); setFeedback(''); }}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2 group"
        >
          <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
          Send New Protocol
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full min-h-[700px] relative font-sans text-[#111111] overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#111111 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="max-w-5xl mx-auto py-8 px-8 relative z-10">
        <header className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#111111]" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600">Protocol: feedback_uplink_v4.0.2</span>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter text-[#111111] uppercase leading-[0.9]">
            Share Your Light.
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Rating Strata */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Experience_Strata_Selection</label>
              <div className="flex flex-col gap-3">
                {RATING_STRATA.map((stratum) => {
                  const isActive = rating === stratum.level;
                  const Icon = stratum.icon;
                  return (
                    <motion.button
                      key={stratum.level}
                      whileHover={{ x: 6 }}
                      onClick={() => setRating(stratum.level)}
                      className={`flex items-center gap-4 p-3 border transition-all relative group overflow-hidden
                        ${isActive ? 'bg-[#111111] border-[#111111] shadow-xl shadow-emerald-500/10' : 'bg-white/50 border-black/10 hover:border-[#111111]'}`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeGlow"
                          className="absolute inset-0 bg-emerald-500/5 animate-pulse" 
                        />
                      )}
              <div className={`w-8 h-8 flex items-center justify-center border ${isActive ? 'border-emerald-500/30' : 'border-black/5'}`}>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500 scale-110' : 'text-[#111111] opacity-40'} transition-all`} />
                      </div>
                      <div className="text-left">
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isActive ? 'text-white' : 'text-[#111111]'}`}>
                          {stratum.label}
                        </p>
                        <p className={`text-[8px] font-bold uppercase opacity-40 ${isActive ? 'text-emerald-500' : 'text-slate-500'}`}>
                          0{stratum.level}_Level_Access
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6 bg-[#111111]/5 border border-black/5 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span className="text-[9px] font-black uppercase tracking-widest">End_to_End_Encryption</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic uppercase opacity-60">
                Your data is synchronized with the Nexus Core via a secure tunnel. Identity masked by default.
              </p>
            </div>
          </div>

          {/* Feedback Capture */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative group">
              <label className="absolute -top-3 left-6 px-3 bg-[#f5f4e2] text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 z-20">
                Input_Intel_Stream
              </label>
              <div className="relative overflow-hidden border-2 border-[#111111] h-[320px]">
                {/* Scanning Line */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-px bg-emerald-500/20 z-0 pointer-events-none"
                />
                
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Initiate transmission..."
                  className="w-full h-full bg-transparent p-8 text-sm font-black uppercase tracking-widest focus:outline-none resize-none relative z-10 placeholder:text-black/10 leading-relaxed custom-scrollbar"
                />

                {/* Technical Corner Ornaments */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#111111]" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#111111]" />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#111111] text-white py-6 px-8 font-black uppercase tracking-[0.6em] text-xs italic relative group overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <motion.div 
                className="absolute inset-0 bg-emerald-500/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
              />
              <span className="relative flex items-center justify-center gap-4">
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Synchronizing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-emerald-500" />
                    Transmit Signal
                  </>
                )}
              </span>
            </button>

            <div className="flex justify-between items-center opacity-30">
              <div className="text-[8px] font-black uppercase tracking-[0.4em]">LINK_STRENGTH: 99.8%</div>
              <div className="text-[8px] font-black uppercase tracking-[0.4em]">UPLINK_ENCRYPTION_V4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackStation;
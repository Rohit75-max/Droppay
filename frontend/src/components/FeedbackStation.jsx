import React from 'react';
import { motion } from 'framer-motion';
import axios from 'axios'; 
import { 
  Monitor, Star, Send, Loader2 
} from 'lucide-react';

const FeedbackStation = ({ 
  theme, 
  feedbackType = 'general', // Default value to prevent undefined errors
  setFeedbackType, 
  rating = 5,               // Default value
  setRating, 
  feedbackText = '',        // Default value
  setFeedbackText, 
  isSubmittingFeedback, 
  setIsSubmittingFeedback,
  user 
}) => {
    
  const handleSubmit = async () => {
    if (!feedbackText || feedbackText.trim().length === 0 || isSubmittingFeedback) return;

    setIsSubmittingFeedback?.(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/user/feedback', {
        streamerId: user?.streamerId,
        type: feedbackType,
        rating: rating,
        message: feedbackText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Insight Received. Node Synced.");
      setFeedbackText?.(""); 
    } catch (err) {
      alert("Uplink Failure: Could not sync with Hub.");
    } finally {
      setIsSubmittingFeedback?.(false);
    }
  };

  const getTerminalStyle = () => {
    return theme === 'dark' 
      ? 'bg-black/40 border-white/5 backdrop-blur-xl shadow-2xl' 
      : 'bg-white border-slate-200 shadow-xl';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6 font-sans pb-10 w-full px-2"
    >
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Monitor className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className={`text-xl font-black uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Feedback <span className="text-indigo-500">Station</span>
            </h3>
            <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.3em] opacity-60">Engineering Uplink</p>
          </div>
        </div>
      </div>

      <div className={`relative border rounded-[2.5rem] overflow-hidden transition-all duration-500 ${getTerminalStyle()}`}>
        <div className="p-6 md:p-10 space-y-8">
          
          {/* SIGNAL TYPE SELECTION */}
          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Signal Type</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'bug', label: 'Bug', active: 'bg-rose-500 text-white border-rose-500' },
                { id: 'feature', label: 'Feature', active: 'bg-indigo-600 text-white border-indigo-600' },
                { id: 'general', label: 'General', active: 'bg-[#10B981] text-black border-[#10B981]' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFeedbackType?.(type.id)}
                  className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${
                    feedbackType === type.id 
                    ? `${type.active} shadow-lg scale-105`
                    : `bg-transparent ${theme === 'dark' ? 'border-white/5 text-slate-500 hover:border-white/20' : 'border-slate-200 text-slate-400'}`
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* RATING SYSTEM */}
          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Experience Tier</label>
            <div className={`flex gap-4 w-fit p-3 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
              {[1, 2, 3, 4, 5].map((num) => (
                <button key={num} onClick={() => setRating?.(num)} className="transition-all hover:scale-110 active:scale-90">
                  <Star 
                    className={`w-6 h-6 transition-all ${
                      num <= (rating || 0)
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]' 
                      : theme === 'dark' ? 'text-white/5' : 'text-slate-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* TEXT TERMINAL */}
          <div className="space-y-4 w-full">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Transmission Details</label>
            <div className="relative w-full">
              <textarea 
                value={feedbackText || ""} 
                onChange={(e) => setFeedbackText?.(e.target.value)}
                placeholder="Establish communication details..." 
                className={`w-full border rounded-2xl p-5 outline-none min-h-[140px] resize-none text-sm italic font-bold transition-all ${
                  theme === 'dark' 
                  ? 'bg-black/40 border-white/5 text-slate-200 placeholder:text-slate-800 focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-indigo-500'
                }`}
              ></textarea>
            </div>
          </div>

          {/* ACTION NODE */}
          <div className="relative group/btn pt-2">
            {!isSubmittingFeedback && feedbackText?.length > 5 && (
              <div className={`absolute -inset-1 rounded-xl blur-lg opacity-30 group-hover/btn:opacity-60 transition-opacity duration-500 ${
                theme === 'dark' ? 'bg-[#10B981]' : 'bg-indigo-500'
              }`} />
            )}
            
            <button 
              disabled={isSubmittingFeedback || !feedbackText}
              onClick={handleSubmit}
              className={`w-full relative py-5 rounded-xl font-black text-xs uppercase italic tracking-widest transition-all flex items-center justify-center gap-4 shadow-xl active:scale-[0.98] disabled:opacity-20 z-10 ${
                theme === 'dark' 
                ? 'bg-white text-black hover:bg-[#10B981]' 
                : 'bg-slate-900 text-white hover:bg-indigo-600'
              }`}
            >
              {isSubmittingFeedback ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Transmitting...</>
              ) : (
                <><Send className="w-4 h-4" /> Deploy Transmission</>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedbackStation;
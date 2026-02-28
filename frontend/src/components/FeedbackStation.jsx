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
    return 'bg-[var(--nexus-panel)] border-[var(--nexus-border)] shadow-[var(--nexus-glow)] backdrop-blur-xl';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-10 font-sans pb-20 w-full px-2 pt-4"
    >
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[var(--nexus-accent)]/10 rounded-xl border border-[var(--nexus-accent)]/20">
            <Monitor className="w-5 h-5 text-[var(--nexus-accent)]" />
          </div>
          <div>
            <h3 className={`text-xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)]`}>
              <span className="text-[var(--nexus-accent)]">Station</span>
            </h3>
            <p className="text-[var(--nexus-text-muted)] text-[8px] font-black uppercase tracking-[0.3em] opacity-60">Engineering Uplink</p>
          </div>
        </div>
      </div>

      <div className={`relative border rounded-[2.5rem] overflow-hidden transition-all duration-500 nexus-card ${getTerminalStyle()}`}>
        <div className="p-6 md:p-10 space-y-8">

          {/* SIGNAL TYPE SELECTION */}
          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase text-[var(--nexus-text-muted)] tracking-[0.2em] ml-1">Signal Type</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'bug', label: 'Bug', active: 'bg-rose-500 text-white border-rose-500' },
                { id: 'feature', label: 'Feature', active: 'bg-indigo-600 text-white border-indigo-600' },
                { id: 'general', label: 'General', active: 'bg-[var(--nexus-accent)] text-black border-[var(--nexus-accent)]' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFeedbackType?.(type.id)}
                  className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${feedbackType === type.id
                    ? `${type.active} shadow-lg scale-105`
                    : `bg-transparent border-[var(--nexus-border)] text-[var(--nexus-text-muted)] hover:border-[var(--nexus-accent)]/50`
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* RATING SYSTEM */}
          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase text-[var(--nexus-text-muted)] tracking-[0.2em] ml-1">Experience Tier</label>
            <div className={`flex gap-4 w-fit p-3 rounded-2xl border bg-white/5 border-[var(--nexus-border)]`}>
              {[1, 2, 3, 4, 5].map((num) => (
                <button key={num} onClick={() => setRating?.(num)} className="transition-all hover:scale-110 active:scale-90">
                  <Star
                    className={`w-6 h-6 transition-all ${num <= (rating || 0)
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                      : 'text-[var(--nexus-text-muted)] opacity-20'
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* TEXT TERMINAL */}
          <div className="space-y-4 w-full">
            <label className="text-[9px] font-black uppercase text-[var(--nexus-text-muted)] tracking-[0.2em] ml-1">Transmission Details</label>
            <div className="relative w-full">
              <textarea
                value={feedbackText || ""}
                onChange={(e) => setFeedbackText?.(e.target.value)}
                placeholder="Establish communication details..."
                className={`w-full border rounded-2xl p-5 outline-none min-h-[140px] resize-none text-sm italic font-bold transition-all bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)] text-[var(--nexus-text)] placeholder:text-[var(--nexus-text-muted)]/30 focus:border-[var(--nexus-accent)]`}
              ></textarea>
            </div>
          </div>

          {/* ACTION NODE */}
          <div className="relative group/btn pt-2">
            {!isSubmittingFeedback && feedbackText?.length > 5 && (
              <div className={`absolute -inset-1 rounded-xl blur-lg opacity-30 group-hover/btn:opacity-60 transition-opacity duration-500 bg-[var(--nexus-accent)]`} />
            )}

            <button
              disabled={isSubmittingFeedback || !feedbackText}
              onClick={handleSubmit}
              className={`w-full relative py-5 rounded-xl font-black text-xs uppercase italic tracking-widest transition-all flex items-center justify-center gap-4 shadow-xl active:scale-[0.98] disabled:opacity-20 z-10 bg-[var(--nexus-text)] text-[var(--nexus-bg)] hover:bg-[var(--nexus-accent)] hover:text-black`}
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
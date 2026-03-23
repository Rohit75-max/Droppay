import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Star, Send, Rocket, Sparkles } from 'lucide-react';
import axios from '../api/axios';

const FeedbackStation = ({
  theme,
  feedbackType = 'general',
  setFeedbackType,
  priority = 'medium',
  setPriority,
  rating = 5,
  setRating,
  feedbackText = '',
  setFeedbackText,
  isSubmittingFeedback,
  setIsSubmittingFeedback,
  user
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const IMPROVEMENT_TAGS = [
    "DASHBOARD UI", "TRANSACTION SPEED", "WIDGET DESIGNS", "GOAL SETUP",
    "MOBILE VIEW", "PAYOUT METHODS", "SUPPORT SPEED", "SETTINGS SYNC"
  ];

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!feedbackText && selectedTags.length === 0) return;

    setIsSubmittingFeedback?.(true);
    try {
      const token = localStorage.getItem('token');
      const MessageWithTags = selectedTags.length > 0
        ? `[IMPROVEMENTS: ${selectedTags.join(', ')}] ${feedbackText || ''}`
        : feedbackText;

      await axios.post('/api/user/feedback', {
        streamerId: user?.streamerId,
        type: feedbackType,
        rating: rating,
        message: MessageWithTags
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsSubmitted(true);
      setFeedbackText?.("");
      setSelectedTags([]);
    } catch (err) {
      toast.error("Connection Error: Could not submit feedback.");
    } finally {
      setIsSubmittingFeedback?.(false);
    }
  };

  const ratingLabels = ["Terrible", "Bad", "OK", "Good", "Great!"];
  const ratingEmojis = ["😠", "🙁", "😐", "🙂", "😄"];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto mt-12 bg-[var(--nexus-panel)] rounded-[var(--nexus-radius)] p-10 md:p-14 text-center space-y-8 shadow-2xl relative border border-[var(--nexus-border)] backdrop-blur-3xl"
      >
        <div className="absolute inset-0 overflow-hidden rounded-[var(--nexus-radius)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--nexus-accent)] to-transparent" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-24 -left-24 w-64 h-64 bg-[var(--nexus-accent)] rounded-full blur-[100px]"
          />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="w-20 h-20 bg-[var(--nexus-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-[var(--nexus-accent)] animate-pulse" />
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter text-[var(--nexus-text)]">Mission Accepted!</h2>
          <p className="text-[var(--nexus-text-muted)] text-sm max-w-sm mx-auto leading-relaxed">Your feedback has been successfully uplinked to the core server. We're actively building future protocols based on your input.</p>
        </div>

        <div className="relative z-10 pt-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-[var(--nexus-accent)] mb-2">Transmission complete,</p>
          <p className="text-lg font-bold text-[var(--nexus-text)] italic">DropPay is evolving.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSubmitted(false)}
          className="relative z-10 w-full py-5 bg-[var(--nexus-accent)] text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-[var(--nexus-accent)]/20 hover:brightness-110"
        >
          Send Another Signal
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-0">
      {/* Animated Aura Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--nexus-accent)]/5 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[var(--nexus-accent)]/3 rounded-full blur-[120px]"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch pt-2 pb-6"
      >
        {/* LEFT COLUMN: RATING & BRANDING */}
        <motion.div
          variants={itemVariants}
          className="bg-[var(--nexus-panel)] backdrop-blur-3xl rounded-[var(--nexus-radius)] p-6 md:p-10 border border-[var(--nexus-border)] shadow-2xl flex flex-col justify-between overflow-hidden relative group"
        >
          {/* Subtle Glow Effect */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--nexus-accent)]/10 rounded-full blur-[80px] group-hover:bg-[var(--nexus-accent)]/20 transition-all duration-700" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="w-10 h-10 bg-[var(--nexus-accent)]/10 rounded-xl flex items-center justify-center border border-[var(--nexus-accent)]/20">
                <MessageSquare className="w-5 h-5 text-[var(--nexus-accent)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--nexus-accent)] italic">Feedback Protocol</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] opacity-50">Signal v.2.4.0</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-[var(--nexus-text)] leading-[1.05]">
                Share your <br />
                <span className="text-[var(--nexus-accent)] drop-shadow-[0_0_20px_var(--nexus-accent-glow)]">Feedback.</span>
              </h2>
              <p className="text-[var(--nexus-text-muted)] text-xs md:text-sm max-w-md font-medium leading-relaxed opacity-80">
                Your direct uplink to the development core. Help us sculpt the future of real-time streaming infrastructure.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 md:mt-12">
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] ml-2 opacity-50">Experience Rating</label>
              <div className="bg-[var(--nexus-bg)]/40 border border-[var(--nexus-border)] p-6 rounded-3xl flex justify-between items-center group/ratings">
                {[1, 2, 3, 4, 5].map((num, idx) => {
                  const isActive = rating === num;
                  return (
                    <motion.div
                      key={num}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex flex-col items-center gap-2 cursor-pointer"
                      onClick={() => setRating?.(num)}
                    >
                      <span className={`text-3xl transition-all duration-300 ${isActive ? 'scale-110 saturate-100 drop-shadow-[0_0_15px_var(--nexus-accent-glow)]' : 'opacity-30 grayscale group-hover/ratings:opacity-50 hover:!opacity-100 hover:!grayscale-0'}`}>
                        {ratingEmojis[idx]}
                      </span>
                      <span className={`text-[7px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text-muted)] opacity-30'}`}>
                        {ratingLabels[idx]}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: DETAILS & SUBMIT */}
        <motion.div
          variants={itemVariants}
          className="bg-[var(--nexus-panel)] backdrop-blur-3xl rounded-[var(--nexus-radius)] p-6 md:p-10 border border-[var(--nexus-border)] shadow-2xl flex flex-col gap-6 md:gap-8 overflow-hidden relative group"
        >
          {/* Subtle Glow Effect */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[var(--nexus-accent)]/5 rounded-full blur-[80px] group-hover:bg-[var(--nexus-accent)]/15 transition-all duration-700" />

          {/* IMPROVEMENTS GRID */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[var(--nexus-accent)]" />
              <label className="text-[9px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] opacity-60">Target Improvements</label>
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {IMPROVEMENT_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-3 rounded-xl border text-[8px] font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center text-center ${isSelected
                      ? 'bg-[var(--nexus-accent)] border-[var(--nexus-accent)] text-black shadow-xl shadow-[var(--nexus-accent)]/20 scale-[1.01]'
                      : 'bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)] text-[var(--nexus-text-muted)] hover:border-[var(--nexus-accent)]/40 hover:text-[var(--nexus-text)]'}`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TEXTAREA AREA */}
          <div className="relative z-10 flex-1 flex flex-col space-y-3">
             <div className="flex items-center gap-3">
              <Rocket className="w-4 h-4 text-[var(--nexus-accent)]" />
              <label className="text-[9px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] opacity-60">Encoded Intel</label>
            </div>
            <div className="flex-1 rounded-[var(--nexus-radius)] bg-[var(--nexus-bg)]/60 border-2 border-[var(--nexus-border)] p-5 relative group/term focus-within:border-[var(--nexus-accent)] transition-all shadow-inner overflow-hidden min-h-[140px]">
              {/* Holographic scanning effect */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[var(--nexus-accent)]/5 to-transparent h-1 w-full animate-progress-scan opacity-20" />
              
              <textarea
                value={feedbackText || ""}
                onChange={(e) => setFeedbackText?.(e.target.value)}
                placeholder="Transmission details..."
                className="relative w-full h-full bg-transparent outline-none resize-none text-[var(--nexus-text)] text-sm md:text-base placeholder:text-[var(--nexus-text-muted)]/20 font-black italic tracking-tight placeholder:italic scrollbar-hide"
              />
              
              <div className="absolute bottom-3 right-4 text-[8px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] opacity-20 italic">
                UPLINK READY...
              </div>
            </div>
          </div>

          {/* SUBMIT ACTION */}
          <div className="relative z-10">
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmittingFeedback || (!feedbackText && selectedTags.length === 0)}
              onClick={handleSubmit}
              className="w-full py-6 bg-[var(--nexus-accent)] hover:brightness-110 text-black font-black uppercase text-sm tracking-[0.2em] italic rounded-2xl transition-all disabled:opacity-30 flex items-center justify-center gap-4 shadow-2xl shadow-[var(--nexus-accent)]/20 shadow-glow"
            >
              {isSubmittingFeedback ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Star className="w-5 h-5" />
                  </motion.div>
                  Synchronizing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Transmit Feed
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FeedbackStation;
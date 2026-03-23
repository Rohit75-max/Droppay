import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
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

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto mt-12 bg-[var(--nexus-panel)] rounded-[2.5rem] p-10 md:p-14 text-center space-y-8 shadow-2xl relative border border-[var(--nexus-border)] backdrop-blur-3xl"
      >
        <div className="space-y-4">
          <h2 className="text-4xl font-serif font-black text-[var(--nexus-text)] tracking-tight">Thank you!</h2>
          <p className="text-[var(--nexus-text-muted)] text-sm max-w-sm mx-auto leading-relaxed">Your feedback is taken very seriously and we hope to see you again soon.</p>
        </div>

        <div className="pt-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-[var(--nexus-accent)] mb-2">As a thank you,</p>
          <p className="text-xl font-bold text-[var(--nexus-text)]">Support is building core values.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSubmitted(false)}
          className="w-full py-5 bg-[var(--nexus-accent)] text-[var(--nexus-bg)] font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-[var(--nexus-accent)]/20 hover:brightness-110"
        >
          Submit More Feedback
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto space-y-6 font-sans pb-10 w-full px-4 pt-4"
    >
      <div className="bg-[var(--nexus-panel)] rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-8 relative overflow-hidden border border-[var(--nexus-border)] backdrop-blur-3xl">
        <div>
          <h2 className="text-3xl font-serif font-black text-[var(--nexus-text)] tracking-tight">Share your Feedback</h2>
          <p className="text-xs font-bold text-[var(--nexus-text-muted)] mt-1">How would you rate your experience?</p>
        </div>

        {/* CUSTOM IN-CARD SLIDER (NO DOTS) */}
        <div className="relative pt-4 pb-2">
          <div className="flex justify-between items-center relative z-10 px-2">
            {[1, 2, 3, 4, 5].map((num, idx) => {
              const isActive = rating === num;
              return (
                <div key={num} className="flex flex-col items-center">
                  <span className={`text-2xl mb-2 transition-transform cursor-pointer transform duration-200 ${isActive ? 'scale-150 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'scale-100 opacity-60 hover:scale-110 hover:opacity-100'}`} onClick={() => setRating?.(num)}>
                    {ratingEmojis[idx]}
                  </span>
                  
                  <span className={`text-[9px] font-black mt-2 transition-colors ${isActive ? 'text-[var(--nexus-text)]' : 'text-[var(--nexus-text-muted)]'}`}>
                    {ratingLabels[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* IMPROVEMENTS MULTI SELECT GRID */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[var(--nexus-text)]">What could be improved?</label>
          <div className="flex flex-wrap gap-2">
            {IMPROVEMENT_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full border text-[10px] font-bold tracking-tight transition-all duration-200 ${isSelected 
                    ? 'bg-[var(--nexus-accent)] border-[var(--nexus-accent)] text-[var(--nexus-bg)] shadow-lg shadow-[var(--nexus-accent)]/20 scale-105' 
                    : 'bg-[var(--nexus-panel)] border-[var(--nexus-border)] text-[var(--nexus-text-muted)] hover:border-[var(--nexus-text)] hover:text-[var(--nexus-text)]'}`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* TEXTAREA (STANDOUT FULL BLEED) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[var(--nexus-text)]">Other Comments?</label>
          <div className="rounded-2xl bg-[var(--nexus-bg)]/40 border-2 border-[var(--nexus-border)] p-4 h-40 relative group/term focus-within:border-[var(--nexus-accent)] transition-all mx-[-1rem] md:mx-[-1.5rem] shadow-inner">
            <textarea
              value={feedbackText || ""}
              onChange={(e) => setFeedbackText?.(e.target.value)}
              placeholder="Comments..."
              className="relative w-full h-full bg-transparent outline-none resize-none text-[var(--nexus-text)] text-sm placeholder:text-[var(--nexus-text-muted)]/30 font-medium scrollbar-hide"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            disabled={isSubmittingFeedback || (!feedbackText && selectedTags.length === 0)}
            onClick={handleSubmit}
            className="px-8 py-3 bg-[var(--nexus-accent)] hover:brightness-110 text-[var(--nexus-bg)] font-black uppercase text-[10px] tracking-widest rounded-xl transition-all disabled:opacity-30 active:scale-98 shadow-lg shadow-[var(--nexus-accent)]/10"
          >
            {isSubmittingFeedback ? "Dispatching..." : "SUBMIT"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedbackStation;
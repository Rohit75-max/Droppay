import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import {
  Star, Send, Loader2, ShieldCheck,
  Zap, MessageSquare,
  CheckCircle2, Rocket, Globe, ShieldAlert
} from 'lucide-react';
import EliteCard from './EliteCard';

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
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Payload too large. Max 2MB for visual attachments.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!feedbackText || feedbackText.trim().length === 0 || isSubmittingFeedback) return;

    setIsSubmittingFeedback?.(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/user/feedback', {
        streamerId: user?.streamerId,
        type: feedbackType,
        priority: priority,
        rating: rating,
        message: feedbackText,
        attachment: selectedImage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsSubmitted(true);
      setFeedbackText?.("");
      setSelectedImage(null);
    } catch (err) {
      toast.error("Connection Error: Could not submit feedback.");
    } finally {
      setIsSubmittingFeedback?.(false);
    }
  };

  const SIGNAL_TYPES = [
    { id: 'bug', label: 'Bug Report', icon: ShieldAlert, color: 'rose' },
    { id: 'feature', label: 'Feature Request', icon: Rocket, color: 'indigo' },
    { id: 'ui', label: 'Visual Polish', icon: Zap, color: 'amber' },
    { id: 'security', label: 'Security Alert', icon: ShieldCheck, color: 'emerald' },
    { id: 'general', label: 'General Feedback', icon: Globe, color: 'slate' }
  ];

  const PRIORITIES = [
    { id: 'low', label: 'Low', active: 'bg-slate-500/20 text-slate-400 border-slate-500/30', inactive: 'bg-black/20 text-[var(--nexus-text-muted)] border-[var(--nexus-border)]' },
    { id: 'medium', label: 'Standard', active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', inactive: 'bg-black/20 text-[var(--nexus-text-muted)] border-[var(--nexus-border)]' },
    { id: 'high', label: 'Priority', active: 'bg-amber-500/20 text-amber-400 border-amber-500/30', inactive: 'bg-black/20 text-[var(--nexus-text-muted)] border-[var(--nexus-border)]' },
    { id: 'critical', label: 'Critical', active: 'bg-rose-500/20 text-rose-400 border-rose-500/30', inactive: 'bg-black/20 text-[var(--nexus-text-muted)] border-[var(--nexus-border)]' }
  ];

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto mt-20 p-12 rounded-[3rem] border bg-[var(--nexus-panel)]/40 border-[var(--nexus-border)] text-center space-y-8 shadow-2xl relative overflow-hidden backdrop-blur-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--nexus-accent)]/10 to-transparent pointer-events-none" />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <div className="w-24 h-24 rounded-full bg-[var(--nexus-accent)]/10 flex flex-col items-center justify-center mx-auto mb-8 border-2 border-[var(--nexus-accent)]/20 relative">
            <CheckCircle2 className="w-10 h-10 text-[var(--nexus-accent)] animate-bounce" />
            <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-black border border-[var(--nexus-accent)] shadow-lg shadow-[var(--nexus-accent)]/20">
              <span className="text-[7px] font-black uppercase tracking-widest text-[var(--nexus-accent)]">DropPay Sync</span>
            </div>
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)] mb-4">Feedback Received</h2>
          <p className="text-[var(--nexus-text-muted)] text-sm max-w-sm mx-auto leading-relaxed italic">Your feedback has been received. Our team will review it shortly. Thank you for helping us improve!</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setIsSubmitted(false)}
          className="px-10 py-4 bg-[var(--nexus-accent)] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg shadow-[var(--nexus-accent)]/20"
        >
          Submit More Feedback
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto space-y-4 font-sans pb-10 w-full px-4 pt-2"
    >
      {/* REFINED SINGLE FRAME */}
      <EliteCard className="p-4 md:p-7 rounded-[3rem] border bg-[var(--nexus-panel)]/40 border-[var(--nexus-border)] nexus-card shadow-2xl relative overflow-hidden backdrop-blur-3xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--nexus-accent)]/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

        {/* REFINED INTEGRATED HEADER */}
        <div className="flex items-center justify-between pb-6 border-b border-[var(--nexus-border)]/50 relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2.5 md:p-3 bg-gradient-to-br from-indigo-500/10 to-blue-600/5 rounded-xl md:rounded-2xl border border-indigo-500/10 shadow-inner">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-[var(--nexus-text)] leading-none">Feedback & Support</h3>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--nexus-accent)]/10 border border-[var(--nexus-accent)]/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--nexus-accent)] animate-pulse shadow-[0_0_8px_var(--nexus-accent)]" />
                  <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-[var(--nexus-accent)] hidden sm:block">Active</span>
                </div>
              </div>
              <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] text-[var(--nexus-text-muted)] opacity-30 md:mt-1 border-l-0 md:border-l md:pl-3 border-[var(--nexus-border)]/50">Direct Feedback v2.5</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 p-2 md:p-4">
          {/* MINI CONFIG (LEFT) */}
          <div className="lg:col-span-4 space-y-6 border-b lg:border-b-0 lg:border-r border-[var(--nexus-border)]/50 pb-6 lg:pb-0 lg:pr-8">
            {/* COMPACT PROTOCOL GRID */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-[var(--nexus-accent)] tracking-[0.3em] ml-1 opacity-70">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {SIGNAL_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isActive = feedbackType === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFeedbackType?.(type.id)}
                      className={`group relative flex items-center p-3 rounded-2xl border transition-all gap-3 overflow-hidden ${isActive
                        ? 'bg-[var(--nexus-accent)] border-[var(--nexus-accent)] shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : 'bg-white/5 border-white/5 hover:border-[var(--nexus-accent)]/30 hover:bg-white/[0.08]'
                        }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <Icon className={`w-4 h-4 transition-transform duration-500 group-hover:rotate-12 ${isActive ? 'text-black' : 'text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-text)]'}`} />
                      <span className={`text-[8px] font-black uppercase tracking-widest italic ${isActive ? 'text-black' : 'text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-text)]'}`}>
                        {type.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* TIGHT URGENCY MATRIX */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-[var(--nexus-accent)] tracking-[0.3em] ml-1 opacity-70">Priority Level</label>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITIES.map((p) => {
                  const isActive = priority === p.id;
                  return (
                    <motion.button
                      key={p.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPriority?.(p.id)}
                      className={`p-3 rounded-xl border font-black uppercase text-[8px] tracking-[0.2em] italic transition-all ${isActive
                        ? p.active + ' shadow-lg'
                        : 'bg-white/5 text-[var(--nexus-text-muted)] border-white/5 hover:bg-white/[0.08] hover:border-white/10'
                        }`}
                    >
                      {p.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* MINI RATING */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-[var(--nexus-accent)] tracking-[0.3em] opacity-70">Rating</label>
                <span className="text-[9px] font-black italic text-amber-500 tracking-widest">{rating}.0 / 5.0</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-white/10 rounded-2xl border border-[var(--nexus-border)]/50 shadow-inner relative overflow-hidden group/rating">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/[0.03] to-amber-500/0 translate-x-[-100%] group-hover/rating:translate-x-[100%] transition-transform duration-1000" />
                {[1, 2, 3, 4, 5].map((num) => (
                  <motion.button
                    key={num}
                    onClick={() => setRating?.(num)}
                    whileHover={{
                      scale: 1.4,
                      rotate: [0, -15, 15, -15, 0],
                      transition: { duration: 0.4 }
                    }}
                    whileTap={{ scale: 0.8 }}
                    className="relative z-10"
                  >
                    <Star
                      className={`w-6 h-6 transition-all duration-300 ${num <= (rating || 0)
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] scale-110'
                        : 'text-white opacity-5 hover:opacity-20'
                        }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* DISPATCH CONSOLE (RIGHT) */}
          <div className="lg:col-span-8 flex flex-col h-full space-y-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <label className="text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest">Your Message</label>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <span className="text-[6px] font-black uppercase tracking-tighter text-emerald-500">Security v4 Sync</span>
                  </div>
                </div>

                {/* IMAGE ATTACHMENT INTEGRATED */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {!selectedImage ? (
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 border border-indigo-400/30 text-white hover:bg-indigo-500 transition-all group shadow-[0_5px_15px_rgba(79,70,229,0.3)]"
                    >
                      <Rocket className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Attach Media</span>
                    </button>
                  ) : (
                    <button
                      onClick={removeImage}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-500 transition-all hover:bg-rose-500/10"
                    >
                      <Zap className="w-3 h-3" />
                      <span className="text-[7px] font-black uppercase tracking-widest">Clear Attachment</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="relative group/term h-full min-h-[220px]">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--nexus-accent)]/20 to-indigo-500/10 rounded-3xl blur-xl opacity-0 group-focus-within/term:opacity-100 transition duration-1000" />
                <div className="relative h-[320px] lg:h-full overflow-hidden rounded-[2rem] border border-white/5 group-focus-within/term:border-[var(--nexus-accent)]/30 transition-all duration-500">
                  {/* Technical Overlays */}
                  <div className="absolute inset-0 bg-white/[0.04] pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)] pointer-events-none" />

                  {/* Glass Grain effect */}
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                  <textarea
                    value={feedbackText || ""}
                    onChange={(e) => setFeedbackText?.(e.target.value)}
                    placeholder="HOW CAN WE IMPROVE? Describe your feedback or any issues you've encountered..."
                    className="relative w-full h-full p-8 outline-none resize-none text-[15px] font-medium leading-relaxed bg-white/5 text-[var(--nexus-text)] placeholder:text-[var(--nexus-text-muted)]/20 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.1em] focus:bg-white/10 transition-all scrollbar-hide italic shadow-inner"
                  ></textarea>

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/5 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/5 pointer-events-none" />
                </div>

                {/* FLOATING IMAGE PREVIEW */}
                {selectedImage && (
                  <div className="absolute bottom-4 right-4 w-24 h-24 rounded-xl border-2 border-[var(--nexus-accent)] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="relative pt-4">
              <motion.button
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmittingFeedback || !feedbackText || feedbackText.length < 10}
                onClick={handleSubmit}
                className="w-full relative py-6 rounded-[2rem] font-black text-xs uppercase italic tracking-[0.3em] transition-all flex items-center justify-center gap-5 shadow-[0_20px_40px_rgba(0,0,0,0.3)] disabled:opacity-20 z-10 bg-gradient-to-r from-[var(--nexus-accent)] via-[#34D399] to-[var(--nexus-accent)] text-black overflow-hidden group/submit"
              >
                {/* Intense Energy Shimmer */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] translate-x-[-100%] group-hover/submit:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

                <div className="absolute inset-0 opacity-0 group-hover/submit:opacity-20 bg-[radial-gradient(circle_at_center,white,transparent_70%)] transition-opacity" />

                {isSubmittingFeedback ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Sending Feedback...</>
                ) : (
                  <><Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Send Feedback</>
                )}
              </motion.button>

              {!isSubmittingFeedback && feedbackText.length < 10 && (
                <p className="text-center mt-4 text-[8px] font-black uppercase tracking-[0.5em] text-rose-500/50 flex items-center justify-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-rose-500/50 animate-pulse" />
                  Message too short
                  <span className="w-1 h-1 rounded-full bg-rose-500/50 animate-pulse" />
                </p>
              )}
            </div>
          </div>
        </div>
      </EliteCard>
    </motion.div>
  );
};

export default FeedbackStation;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import {
  Star, Send, Loader2, ShieldCheck,
  Zap, MessageSquare,
  CheckCircle2, Rocket, Globe, ShieldAlert
} from 'lucide-react';

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
        alert("Payload too large. Max 2MB for visual attachments.");
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
      alert("Uplink Failure: Could not sync with Hub.");
    } finally {
      setIsSubmittingFeedback?.(false);
    }
  };

  const SIGNAL_TYPES = [
    { id: 'bug', label: 'Bug Report', icon: ShieldAlert, color: 'rose' },
    { id: 'feature', label: 'Feature Node', icon: Rocket, color: 'indigo' },
    { id: 'ui', label: 'Visual Polish', icon: Zap, color: 'amber' },
    { id: 'security', label: 'Security Alert', icon: ShieldCheck, color: 'emerald' },
    { id: 'general', label: 'Global Intel', icon: Globe, color: 'slate' }
  ];

  const PRIORITIES = [
    { id: 'low', label: 'Low', active: 'bg-slate-100 text-slate-600 border-slate-300 shadow-sm', inactive: 'bg-slate-50/50 text-slate-400 border-slate-200' },
    { id: 'medium', label: 'Standard', active: 'bg-emerald-100 text-emerald-600 border-emerald-300 shadow-sm', inactive: 'bg-emerald-50/50 text-emerald-400 border-emerald-200' },
    { id: 'high', label: 'Priority', active: 'bg-amber-100 text-amber-600 border-amber-300 shadow-sm', inactive: 'bg-amber-50/50 text-amber-400 border-amber-200' },
    { id: 'critical', label: 'Critical', active: 'bg-rose-100 text-rose-600 border-rose-300 shadow-sm', inactive: 'bg-rose-50/50 text-rose-400 border-rose-200' }
  ];

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto mt-20 p-12 rounded-[3rem] border bg-[var(--nexus-panel)] border-[var(--nexus-border)] text-center space-y-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--nexus-accent)]/5 to-transparent pointer-events-none" />
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
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)] mb-4">Transmission Successful</h2>
          <p className="text-[var(--nexus-text-muted)] text-sm max-w-sm mx-auto leading-relaxed italic">Your signal has been integrated into the central engineering hub. Our technicians will analyze the telemetry shortly.</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setIsSubmitted(false)}
          className="px-10 py-4 bg-[var(--nexus-accent)] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg shadow-[var(--nexus-accent)]/20"
        >
          Establish New Link
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
      <div className="p-[1px] rounded-[3rem] bg-gradient-to-br from-[var(--nexus-border)] to-transparent">
        <div className="p-4 md:p-7 rounded-[2.9rem] border bg-[var(--nexus-panel)]/80 border-[var(--nexus-border)] nexus-card shadow-2xl space-y-8 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--nexus-accent)]/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

          {/* REFINED INTEGRATED HEADER */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--nexus-border)] relative z-10">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2.5 md:p-3 bg-gradient-to-br from-indigo-500/10 to-blue-600/5 rounded-xl md:rounded-2xl border border-indigo-500/10 shadow-inner">
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)] leading-none">DropPay Feedback</h3>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--nexus-accent)]/10 border border-[var(--nexus-accent)]/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--nexus-accent)] animate-pulse shadow-[0_0_8px_var(--nexus-accent)]" />
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-[var(--nexus-accent)] hidden sm:block">Active</span>
                  </div>
                </div>
                <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] text-[var(--nexus-text-muted)] opacity-30 md:mt-1 border-l-0 md:border-l md:pl-3 border-[var(--nexus-border)]">Protocol Handshake v2.5</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            {/* MINI CONFIG (LEFT) */}
            <div className="lg:col-span-4 space-y-6 border-b lg:border-b-0 lg:border-r border-[var(--nexus-border)] pb-6 lg:pb-0 lg:pr-8">
              {/* COMPACT PROTOCOL GRID */}
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase text-[var(--nexus-accent)] tracking-[0.2em] ml-1">Protocol</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {SIGNAL_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isActive = feedbackType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setFeedbackType?.(type.id)}
                        className={`group relative flex items-center p-2 rounded-xl border transition-all gap-2 ${isActive
                          ? 'bg-[var(--nexus-accent)] border-[var(--nexus-accent)] shadow-lg'
                          : 'bg-[var(--nexus-bg)]/20 border-[var(--nexus-border)] hover:border-emerald-500/20'
                          }`}
                      >
                        <Icon className={`w-3 h-3 ${isActive ? 'text-black' : 'text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-accent)]'}`} />
                        <span className={`text-[7px] font-black uppercase tracking-tighter ${isActive ? 'text-black' : 'text-[var(--nexus-text-muted)]'}`}>
                          {type.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TIGHT URGENCY MATRIX */}
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase text-[var(--nexus-accent)] tracking-[0.2em] ml-1">Urgency Matrix</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRIORITIES.map((p) => {
                    const isActive = priority === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPriority?.(p.id)}
                        className={`p-2 rounded-lg border font-black uppercase text-[7px] tracking-widest transition-all ${isActive ? p.active : p.inactive
                          }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MINI RATING */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black uppercase text-[var(--nexus-accent)] tracking-[0.2em]">Intensity Calibration</label>
                  <span className="text-[8px] font-black italic text-amber-500 uppercase">{rating}/5</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[var(--nexus-bg)]/20 rounded-xl border border-[var(--nexus-border)]">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <motion.button
                      key={num}
                      onClick={() => setRating?.(num)}
                      whileHover={{
                        scale: 1.3,
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.8 }}
                      className="transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 transition-all ${num <= (rating || 0)
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'text-[var(--nexus-text-muted)] opacity-15'
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
                    <label className="text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest">Protocol Transmission</label>
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
                        className="flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--nexus-border)] bg-[var(--nexus-bg)]/30 hover:bg-[var(--nexus-accent)]/10 hover:border-[var(--nexus-accent)]/40 transition-all group"
                      >
                        <Rocket className="w-3 h-3 text-[var(--nexus-accent)] group-hover:scale-110 transition-transform" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-accent)]">Attach Media</span>
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
                  <div className="absolute -inset-0.5 bg-[var(--nexus-accent)]/5 rounded-2xl blur-sm opacity-0 group-focus-within/term:opacity-100 transition duration-500" />
                  <textarea
                    value={feedbackText || ""}
                    onChange={(e) => setFeedbackText?.(e.target.value)}
                    placeholder="Describe technical observations, feature nodes, or structural feedback for the 2026 platform protocol."
                    className="relative w-full h-[280px] lg:h-full border border-[var(--nexus-border)] rounded-2xl p-6 outline-none resize-none text-[13px] font-medium leading-relaxed transition-all bg-[var(--nexus-bg)]/10 text-[var(--nexus-text)] placeholder:text-[var(--nexus-text-muted)]/10 focus:border-[var(--nexus-accent)]/30 focus:bg-white/5 scrollbar-hide"
                  ></textarea>

                  {/* FLOATING IMAGE PREVIEW */}
                  {selectedImage && (
                    <div className="absolute bottom-4 right-4 w-24 h-24 rounded-xl border-2 border-[var(--nexus-accent)] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                      <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="relative pt-2">
                <motion.button
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  disabled={isSubmittingFeedback || !feedbackText || feedbackText.length < 10}
                  onClick={handleSubmit}
                  className="w-full relative py-5 rounded-2xl font-black text-[10px] uppercase italic tracking-[0.25em] transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-20 z-10 bg-gradient-to-r from-[var(--nexus-accent)] to-[#34D399] text-black overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:200%_200%] animate-[shimmer_2s_infinite_linear]" />
                  {isSubmittingFeedback ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Synchronizing...</>
                  ) : (
                    <><Send className="w-3.5 h-3.5" /> Deploy Intelligence Transmission</>
                  )}
                </motion.button>

                {!isSubmittingFeedback && feedbackText.length < 10 && (
                  <p className="text-center mt-3 text-[7px] font-black uppercase tracking-[0.4em] text-rose-500/60">
                    Transmission Locked: Sync Density Required
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedbackStation;
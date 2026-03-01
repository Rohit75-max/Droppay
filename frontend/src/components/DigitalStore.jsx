import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Mic, Sparkles, Loader2, IndianRupee,
  MessageSquare, UserCircle, Volume2
} from 'lucide-react';

const SUPER_TIERS = [
  { id: 't1', minAmount: 100, color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', label: 'Silver Flash' },
  { id: 't2', minAmount: 500, color: 'from-purple-400 to-fuchsia-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', label: 'Epic Pulse' },
  { id: 't3', minAmount: 2000, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Legendary Nova' },
];

const TTS_VOICES = [
  { id: 'male', label: 'Deep Male', icon: '🗣️' },
  { id: 'female', label: 'Clear Female', icon: '👩' },
  { id: 'robot', label: 'Cyber AI', icon: '🤖' },
  { id: 'demon', label: 'Demon', icon: '😈' },
];

const DigitalStore = ({
  streamer,
  amount,
  setAmount,
  donorName,
  setDonorName,
  message,
  setMessage,
  handlePayment,
  isProcessing,
  towEvent,
  selectedSide,
  setSelectedSide
}) => {
  const [activeTab, setActiveTab] = useState('superchat');

  // Tab-specific overrides
  const [ttsVoice, setTtsVoice] = useState('female');

  // Helper to determine current Super Message tier based on input amount
  const currentTier = SUPER_TIERS.slice().reverse().find(t => Number(amount) >= t.minAmount) || SUPER_TIERS[0];

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'tts' && Number(amount) < 500) setAmount(500); // Assuming 500 min for TTS
  };

  return (
    <div className="flex-1 bg-[var(--nexus-panel)] shadow-xl backdrop-blur-2xl border border-[var(--nexus-border)] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-full nexus-card">

      {/* --- STORE NAVIGATION --- */}
      <div className="flex px-4 pt-4 border-b border-[var(--nexus-border)] overflow-x-auto scrollbar-hide shrink-0 gap-2">
        <button
          onClick={() => handleTabSwitch('superchat')}
          className={`px-4 py-3 text-xs font-black uppercase tracking-widest transition-all rounded-t-xl flex items-center gap-2 ${activeTab === 'superchat' ? 'bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)] border-b-2 border-[var(--nexus-accent)]' : 'text-[var(--nexus-text-muted)] hover:text-[var(--nexus-text)]'}`}
        >
          <Zap className="w-4 h-4" /> Super Msg
        </button>
        <button
          onClick={() => handleTabSwitch('tts')}
          className={`px-4 py-3 text-xs font-black uppercase tracking-widest transition-all rounded-t-xl flex items-center gap-2 ${activeTab === 'tts' ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Mic className="w-4 h-4" /> Premium TTS
        </button>
      </div>

      {/* --- STORE CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 flex flex-col">
        <AnimatePresence mode="wait">

          {/* =========================================
              TAB: SUPER MESSAGES
             ========================================= */}
          {activeTab === 'superchat' && (
            <motion.div key="superchat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col space-y-6 flex-1">
              {/* Tier Selector */}
              <div className="grid grid-cols-3 gap-3">
                {SUPER_TIERS.map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setAmount(tier.minAmount)}
                    className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${currentTier.id === tier.id ? `${tier.bg} ${tier.border} scale-[1.02]` : 'bg-[var(--nexus-bg)] border-[var(--nexus-border)] hover:border-[var(--nexus-accent)]/30'}`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${tier.color} flex flex-col items-center justify-center shadow-lg`}>
                      <Zap className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-[var(--nexus-text)]">₹{tier.minAmount}+</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Preview Card */}
              <div className={`p-4 rounded-2xl border ${currentTier.bg} ${currentTier.border} transition-all duration-500 flex items-start gap-4`}>
                <div className="w-10 h-10 rounded-full bg-[var(--nexus-bg)] border-2 border-[var(--nexus-border)] flex-shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest leading-none bg-clip-text text-transparent bg-gradient-to-r ${currentTier.color}`}>
                    {donorName || 'YOUR NAME'} • ₹{amount || 0}
                  </span>
                  <p className="text-slate-900 text-sm font-bold mt-1 break-words line-clamp-2">
                    {message || 'Your super message preview will appear here in high contrast styling!'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================
              TAB: PREMIUM TTS
             ========================================= */}
          {activeTab === 'tts' && (
            <motion.div key="tts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col space-y-6 flex-1">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-emerald-400 font-black uppercase text-sm flex items-center gap-2">
                    <Volume2 className="w-4 h-4" /> TTS Active
                  </h3>
                  <p className="text-emerald-700/80 text-xs mt-1">Your message will be spoken live on stream.</p>
                </div>
                <span className="text-emerald-400 font-mono font-bold">Min: ₹500</span>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-[var(--nexus-text-muted)] mb-3 block">Select Voice Profile</label>
                <div className="grid grid-cols-2 gap-3">
                  {TTS_VOICES.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setTtsVoice(v.id)}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${ttsVoice === v.id ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[var(--nexus-bg)] border-[var(--nexus-border)] text-[var(--nexus-text-muted)] hover:border-[var(--nexus-accent)]/30'}`}
                    >
                      <span className="text-xl">{v.icon}</span>
                      <span className="text-xs font-bold uppercase">{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* --- COMMON INPUT FIELDS (Fixed at bottom of store) --- */}
        <div className="mt-auto pt-6 space-y-4 border-t border-[var(--nexus-border)]">
          {/* --- TUG-OF-WAR TEAM SELECTION UI --- */}
          {towEvent && (
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--nexus-text-muted)] ml-2">Choose Your Side</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSide('A')}
                  className={`py-4 rounded-xl font-black uppercase tracking-widest text-[10px] italic border-2 transition-all ${selectedSide === 'A' ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-black/20 border-[var(--nexus-border)] text-[var(--nexus-text-muted)] hover:border-red-500/50'}`}
                >
                  {towEvent.teamAName}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSide('B')}
                  className={`py-4 rounded-xl font-black uppercase tracking-widest text-[10px] italic border-2 transition-all ${selectedSide === 'B' ? 'bg-blue-500/20 border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-black/20 border-[var(--nexus-border)] text-[var(--nexus-text-muted)] hover:border-blue-500/50'}`}
                >
                  {towEvent.teamBName}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--nexus-text-muted)] w-5 h-5" />
              <input
                placeholder="Your Name"
                value={donorName}
                onChange={e => setDonorName(e.target.value)}
                className="w-full bg-[var(--nexus-bg)] border border-[var(--nexus-border)] rounded-xl py-4 px-12 text-sm font-bold text-[var(--nexus-text)] outline-none focus:border-[var(--nexus-accent)]/50 transition-colors"
              />
            </div>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--nexus-text-muted)] w-5 h-5" />
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-[var(--nexus-bg)] border border-[var(--nexus-border)] rounded-xl py-4 px-12 text-sm font-black italic text-[var(--nexus-text)] outline-none focus:border-[var(--nexus-accent)]/50 transition-colors"
              />
            </div>
          </div>

          <div className="relative min-h-[100px]">
            <MessageSquare className="absolute left-4 top-4 text-[var(--nexus-text-muted)] w-5 h-5" />
            <textarea
              placeholder={activeTab === 'tts' ? "Enter your TTS message here..." : "Highlight your message..."}
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={200}
              className="w-full h-full min-h-[100px] bg-[var(--nexus-bg)] border border-[var(--nexus-border)] rounded-xl py-4 px-12 text-sm text-[var(--nexus-text)] outline-none resize-none focus:border-[var(--nexus-accent)]/50 transition-colors"
            />
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-5 rounded-xl text-lg text-black font-black flex items-center justify-center gap-3 uppercase italic transition shadow-lg ${activeTab === 'superchat' ? 'bg-indigo-400 hover:bg-indigo-300 shadow-indigo-500/20' :
              'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20'
              }`}
          >
            {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : (
              <>Deploy {activeTab === 'superchat' ? 'Super Msg' : 'Premium TTS'} <Sparkles className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default DigitalStore;

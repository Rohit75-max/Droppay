import React from 'react';
import { motion } from 'framer-motion';
// --- Protocol Engine ---
import { calculateTierStatus, MILESTONES } from '../protocol/tierProtocol';

import {
  Award, TrendingUp, Zap, ShieldCheck, Users, Copy,
  CheckCircle, Gift, Target, Crosshair, Sparkles, ArrowUpRight
} from 'lucide-react';

const GrowthMissions = ({
  theme, user, copyToClipboard, copiedType
}) => {
  // Activate the Engine
  const referralCount = user?.referralCount || 0;
  const status = calculateTierStatus(user?.tier || 'starter', referralCount);

  // Base URL for Local Node
  const BASE_URL = "http://localhost:3000";
  const referralLink = `${BASE_URL}/signup?ref=${user?.username}`;

  // Find the next upcoming milestone
  const nextMilestone = MILESTONES.find(m => referralCount < m.threshold);
  const progressToNext = nextMilestone ? (referralCount / nextMilestone.threshold) * 100 : 100;

  // Milestone list for the UI
  const missionPath = [
    {
      goal: 5,
      reward: `Fee Protocol (${status.tierDetails.referralFee}%)`,
      desc: "Unlock your first permanent fee reduction.",
      icon: Zap,
      unlocked: referralCount >= 5
    },
    ...MILESTONES.map(m => ({
      goal: m.threshold,
      reward: m.name,
      desc: `Unlock the ${m.name} badge and visual flair.`,
      icon: m.icon === 'Target' ? Target : m.icon === 'Crosshair' ? Crosshair : Sparkles,
      unlocked: referralCount >= m.threshold
    }))
  ];

  const getCardStyle = () => {
    return 'bg-[var(--nexus-panel)] border-[var(--nexus-border)] shadow-[var(--nexus-glow)]';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-10 font-sans pb-20 pt-4 w-full"
    >

      {/* --- HEADER & STATS --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 w-full">
        <div className="space-y-1 w-full md:w-auto">
          <h2 className={`text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-[var(--nexus-text)]`}>
            <Award className="w-8 h-8 text-[var(--nexus-accent)]" /> Missions
          </h2>
          <p className="text-[var(--nexus-text-muted)] text-[10px] font-black uppercase tracking-[0.3em]">Recruit streamers to unlock elite protocols</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">

        {/* --- MILESTONE TRACKER --- */}
        <div className={`w-full lg:col-span-8 border rounded-[2.5rem] p-8 lg:p-12 space-y-12 relative overflow-hidden transition-all nexus-card ${getCardStyle()}`}>
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] -mr-32 -mt-32 bg-[var(--nexus-accent)]/5`} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 w-full">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-black italic text-[var(--nexus-accent)] leading-none">{referralCount.toString().padStart(2, '0')}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] opacity-50">Network Size</span>
              </div>
              <h3 className="text-xs font-black uppercase italic tracking-widest text-[var(--nexus-text-muted)] flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-[var(--nexus-accent)]" /> Mission Progression
              </h3>
            </div>
            {nextMilestone && (
              <span className="text-[10px] font-black text-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 px-5 py-2 rounded-full border border-[var(--nexus-accent)]/20 uppercase italic">
                {nextMilestone.threshold - referralCount} to unlock {nextMilestone.name}
              </span>
            )}
          </div>

          {/* Progress Bar Protocol */}
          <div className="relative z-10 w-full space-y-4">
            <div className="h-4 bg-black/40 rounded-full p-1 border border-[var(--nexus-border)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[var(--nexus-accent)] to-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              />
            </div>
            <div className="flex justify-between px-1 text-[10px] font-black uppercase tracking-widest">
              <p className="text-[var(--nexus-text-muted)]">Node Syncing</p>
              <p className="text-[var(--nexus-accent)] italic">{Math.floor(progressToNext)}% Complete</p>
            </div>
          </div>

          {/* Mission Path */}
          <div className="space-y-10 relative z-10 w-full">
            {missionPath.map((m, i) => (
              <div key={i} className={`relative pl-12 border-l-2 py-2 group w-full transition-all ${m.unlocked ? 'border-[var(--nexus-accent)] opacity-100' : 'border-[var(--nexus-border)] opacity-30'}`}>
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full transition-all ${m.unlocked ? 'bg-[var(--nexus-accent)] shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-black border-2 border-[var(--nexus-border)]'}`} />
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                  <div className="space-y-1">
                    <h4 className={`text-sm font-black uppercase italic flex items-center gap-3 text-[var(--nexus-text)]`}>
                      <m.icon className={`w-4 h-4 ${m.unlocked ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text-muted)]'}`} /> {m.reward}
                    </h4>
                    <p className="text-[11px] text-[var(--nexus-text-muted)] font-bold uppercase tracking-wider italic">{m.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.unlocked && <ShieldCheck className="w-3.5 h-3.5 text-[var(--nexus-accent)]" />}
                    <p className={`text-[10px] font-black uppercase tracking-widest ${m.unlocked ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text-muted)]'}`}>THRESHOLD: {m.goal}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- REFERRAL CARD --- */}
        <div className="w-full lg:col-span-4 space-y-6">
          <div className="w-full bg-gradient-to-br from-[var(--nexus-accent)] to-[#004d00]/80 border border-[var(--nexus-accent)]/30 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-8 w-full text-black">
              <div className="p-4 bg-white/20 w-fit rounded-2xl border border-white/30 shadow-xl"><Users className="w-7 h-7 text-black" /></div>
              <div>
                <h3 className="text-2xl font-black uppercase italic text-black leading-tight">Uplink Generator</h3>
                <p className="text-black/70 text-[11px] font-bold leading-relaxed italic mt-3">When a streamer joins via your node, your commission protocol syncs to a lower percentage permanently.</p>
              </div>

              <div className="space-y-3 w-full">
                <label className="text-[9px] font-black uppercase text-black/50 tracking-[0.2em] ml-1 flex justify-between h-3">
                  Protocol Link
                  {copiedType === 'referral' && <span className="text-white">✓ SYNCED</span>}
                </label>
                <div
                  onClick={() => copyToClipboard(referralLink, 'referral')}
                  className="w-full bg-black/10 backdrop-blur-xl rounded-2xl p-5 flex items-center justify-between border border-black/10 cursor-pointer group-hover:border-black/50 transition-all shadow-inner"
                >
                  <code className="text-[11px] font-mono font-black text-black truncate pr-4 italic">
                    signup?ref={user?.username}
                  </code>
                  <div className="p-2.5 bg-black/5 rounded-xl transition-all">
                    {copiedType === 'referral' ? <CheckCircle className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => copyToClipboard(referralLink, 'referral')}
                  className="w-full py-5 bg-black text-[var(--nexus-accent)] rounded-2xl font-black uppercase italic text-[11px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                >
                  <ArrowUpRight className="w-4 h-4" /> Share Growth Node
                </button>
              </div>
            </div>
            <Users className="absolute -bottom-10 -right-10 w-56 h-56 text-black/[0.1] -rotate-12 pointer-events-none" />
          </div>

          <div className={`w-full border rounded-[2.5rem] p-7 flex items-start gap-5 transition-all ${getCardStyle()}`}>
            <div className="w-12 h-12 rounded-2xl bg-[var(--nexus-accent)]/10 flex items-center justify-center shrink-0 border border-[var(--nexus-accent)]/20 shadow-inner">
              <Gift className="w-6 h-6 text-[var(--nexus-accent)]" />
            </div>
            <div>
              <p className={`text-[11px] font-black uppercase mb-1 tracking-widest italic text-[var(--nexus-text)]`}>Strategy Tip</p>
              <p className="text-[11px] text-[var(--nexus-text-muted)] font-bold italic leading-relaxed uppercase tracking-tight">Drop your node in chat to recruit fellow creators and lower your fees.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GrowthMissions;
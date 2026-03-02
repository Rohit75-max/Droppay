import React, { useState } from 'react';
import { motion } from 'framer-motion';
// --- Protocol Engine ---
import { calculateTierStatus, MILESTONES } from '../protocol/tierProtocol';

import {
  Award, TrendingUp, Zap, ShieldCheck, Users, Copy,
  CheckCircle, Gift, Target, Crosshair, Sparkles, ArrowUpRight,
  Activity, ZapOff, Fingerprint, Cpu
} from 'lucide-react';
import EliteCard from './EliteCard';

const GrowthMissions = ({
  theme, user, copyToClipboard, copiedType
}) => {
  // --- Elite Interaction Protocol ---
  const [showTelemetry, setShowTelemetry] = useState(false);

  // Activate the Engine
  const referralCount = user?.referralCount || 0;
  const status = calculateTierStatus(user?.tier || 'starter', referralCount);

  // Base URL for Local Node
  const BASE_URL = window.location.origin;
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
    return 'bg-[var(--nexus-panel)]/40 backdrop-blur-3xl border-[var(--nexus-border)]/60 shadow-[var(--nexus-glow)]';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-8 font-sans pb-20 pt-4 w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">

        {/* --- MILESTONE TRACKER --- */}
        <EliteCard
          className={`w-full lg:col-span-8 border rounded-[3rem] p-5 lg:p-10 lg:pt-3 space-y-7 relative overflow-hidden transition-all nexus-card ${getCardStyle()}`}
        >
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--nexus-accent)]/5 via-transparent to-transparent pointer-events-none" />
          <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] -mr-40 -mt-40 bg-[var(--nexus-accent)]/10 animate-pulse`} />

          {/* INTEGRATED HEADER - ELITE */}
          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[var(--nexus-border)]/30">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-[var(--nexus-accent)]/20 to-transparent rounded-xl border border-[var(--nexus-accent)]/30 shadow-inner">
                <Award className="w-4 h-4 text-[var(--nexus-accent)]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)] leading-none">Missions</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--nexus-accent)]/10 border border-[var(--nexus-accent)]/20 text-[6px] font-black uppercase tracking-widest text-[var(--nexus-accent)]">v2.6 Protocol</span>
                </div>
                <p className="text-[var(--nexus-text-muted)] text-[7px] font-black uppercase tracking-[0.3em] mt-1 opacity-50">Recruit streamers to unlock elite protocols</p>
              </div>
            </div>
            <button
              onClick={() => setShowTelemetry(!showTelemetry)}
              className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-black/20 border border-white/5 backdrop-blur-md hover:border-[var(--nexus-accent)]/30 transition-all group"
            >
              <Activity className={`w-3 h-3 ${showTelemetry ? 'text-[var(--nexus-accent)] animate-pulse' : 'text-[var(--nexus-text-muted)] opacity-50'} transition-colors`} />
              <span className="text-[7px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-accent)]">
                {showTelemetry ? 'Protocol: Live' : 'Link Hub'}
              </span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 w-full pt-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2 -mb-2">
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-black italic text-[var(--nexus-accent)] leading-none gold-text-shimmer"
                >
                  {referralCount.toString().padStart(2, '0')}
                </motion.span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <Users className="w-2.5 h-2.5 text-[var(--nexus-accent)]" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[var(--nexus-accent)]">Network</span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] opacity-30 mt-[-2px]">Intelligence</span>
                </div>
              </div>
              <h3 className="text-[10px] font-black uppercase italic tracking-[0.2em] text-[var(--nexus-text-muted)] flex items-center gap-3 mt-3">
                <TrendingUp className="w-4 h-4 text-[var(--nexus-accent)] opacity-50" /> Progression Matrix
              </h3>
            </div>
            {nextMilestone && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-end gap-1.5"
              >
                <span className="text-[9px] font-black text-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 px-4 py-2 rounded-full border border-[var(--nexus-accent)]/20 uppercase italic transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  {nextMilestone.threshold - referralCount} to unlock {nextMilestone.name}
                </span>
                <p className="text-[6px] font-black uppercase tracking-[0.3em] text-[var(--nexus-text-muted)] opacity-30 mr-2">Synchronizing with Hub...</p>
              </motion.div>
            )}
          </div>

          {/* Progress Bar Protocol - ELITE SCANNER */}
          <div className="relative z-10 w-full space-y-4">
            <div className="relative h-5 bg-black/60 rounded-full p-1 border border-white/5 shadow-inner overflow-hidden group/progress">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-[var(--nexus-accent)]/60 via-[var(--nexus-accent)] to-emerald-400 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] relative"
              >
                {/* Scrolling Scanner Light */}
                <motion.div
                  animate={{ x: ['0%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-y-0 w-20 bg-white/20 blur-md -skew-x-12 translate-x-[-100%]"
                />
              </motion.div>
              {/* Grid Overlay for technical feel */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
            </div>
            <div className="flex justify-between px-2 text-[9px] font-black uppercase tracking-[0.3em]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--nexus-accent)] animate-pulse" />
                <p className="text-[var(--nexus-text-muted)]">Node Synchronization</p>
              </div>
              <p className="text-[var(--nexus-accent)] italic">{Math.floor(progressToNext)}% Intensity</p>
            </div>
          </div>

          {/* Mission Path - ELITE LIST */}
          <div className="space-y-6 relative z-10 w-full pt-4">
            <div className="absolute left-[7px] top-6 bottom-6 w-[1px] bg-gradient-to-b from-[var(--nexus-accent)]/50 via-[var(--nexus-border)] to-transparent" />

            {missionPath.map((m, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`relative pl-10 group w-full transition-all duration-500`}
              >
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full transition-all duration-700 z-10 ${m.unlocked ? 'bg-[var(--nexus-accent)] shadow-[0_0_20px_rgba(16,185,129,0.8)] border border-white/20' : 'bg-black border-2 border-[var(--nexus-border)]'}`} />

                <div className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-5 rounded-2xl border transition-all duration-500 hover:bg-white/[0.02] ${m.unlocked ? 'border-[var(--nexus-accent)]/30 bg-[var(--nexus-accent)]/[0.03]' : 'border-transparent opacity-40 hover:border-white/5'}`}>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <m.icon className={`w-4 h-4 ${m.unlocked ? 'text-[var(--nexus-accent)] animate-pulse' : 'text-[var(--nexus-text-muted)]'}`} />
                        {!m.unlocked && <ZapOff className="absolute -top-1 -right-1 w-2 h-2 text-rose-500 opacity-50" />}
                      </div>
                      <h4 className={`text-sm font-black uppercase italic tracking-tighter text-[var(--nexus-text)]`}>
                        {m.reward} {m.unlocked && <Gift className="w-3.5 h-3.5 text-amber-500" />}
                      </h4>
                    </div>
                    <p className="text-[9px] text-[var(--nexus-text-muted)] font-black uppercase tracking-wider italic opacity-60 ml-7">{m.desc}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-7 sm:ml-0">
                    {m.unlocked ? (
                      <span className="text-[8px] font-black uppercase text-[var(--nexus-accent)] tracking-widest flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3" /> SECURE
                      </span>
                    ) : (
                      <span className="text-[8px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest opacity-40">
                        {m.goal} NODES REQ
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </EliteCard>

        {/* --- REFERRAL CARD - ELITE SPOTLIGHT --- */}
        <div className="w-full lg:col-span-4 space-y-6">
          <EliteCard
            className="w-full bg-[#050505] border border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group spotlight-card"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-8 w-full">
              <div className="flex items-center justify-between">
                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <Fingerprint className="w-7 h-7 text-[var(--nexus-accent)]" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[var(--nexus-accent)] animate-pulse">Encryption: Active</span>
                  <span className="text-[6px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] opacity-30 mt-1">Uplink Mode: v2.6.4</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black uppercase italic text-white tracking-tighter leading-tight flex items-center gap-3">
                  Uplink <span className="text-[var(--nexus-accent)]">Generator.</span>
                </h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed italic mt-4 opacity-70">
                  Broadcast your node ID. Every recruit permanentlty recalibrates your commission protocol.
                </p>
              </div>

              <div className="space-y-4 w-full pt-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[9px] font-black uppercase text-[var(--nexus-accent)] tracking-[0.3em]">Protocol Link</label>
                  {copiedType === 'referral' && (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[8px] font-black text-white bg-emerald-500 px-2 py-0.5 rounded-full"
                    >
                      ✓ SYNCED
                    </motion.span>
                  )}
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => copyToClipboard(referralLink, 'referral')}
                  className="w-full bg-white/[0.03] backdrop-blur-xl rounded-2xl p-5 flex items-center justify-between border border-white/5 cursor-pointer group-hover:border-[var(--nexus-accent)]/40 transition-all shadow-inner relative overflow-hidden"
                >
                  <code className="text-[11px] font-mono font-black text-white truncate pr-4 italic relative z-10">
                    signup?ref={user?.username}
                  </code>
                  <div className="p-2.5 bg-white/5 rounded-xl transition-all relative z-10">
                    {copiedType === 'referral' ? <CheckCircle className="w-4 h-4 text-[var(--nexus-accent)]" /> : <Copy className="w-4 h-4 text-white opacity-40 group-hover:opacity-100" />}
                  </div>
                  {/* Subtle progress glow inside the link box */}
                  <div className="absolute left-0 bottom-0 h-[1px] bg-[var(--nexus-accent)] opacity-30 w-full" />
                </motion.div>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => copyToClipboard(referralLink, 'referral')}
                  className="w-full py-5 bg-[var(--nexus-accent)] text-black rounded-2xl font-black uppercase italic text-[11px] tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:shadow-[0_25px_50px_rgba(16,185,129,0.3)]"
                >
                  <ArrowUpRight className="w-4 h-4" /> Deploy Growth Node
                </motion.button>
              </div>
            </div>
          </EliteCard>

          {/* Strategy Tip - ELITE SIDEBAR */}
          <motion.div
            variants={itemVariants}
            whileHover={{ x: 5 }}
            className={`w-full border rounded-[2.5rem] p-6 flex items-center gap-5 transition-all bg-white/[0.02] border-white/5 hover:border-[var(--nexus-accent)]/20 shadow-xl`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--nexus-accent)]/10 flex items-center justify-center shrink-0 border border-[var(--nexus-accent)]/20 shadow-inner group-hover:rotate-12 transition-transform">
              <Cpu className="w-6 h-6 text-[var(--nexus-accent)]" />
            </div>
            <div className="flex flex-col">
              <p className={`text-[10px] font-black uppercase mb-0.5 tracking-[0.2em] italic text-[var(--nexus-accent)]`}>Strategy Tip</p>
              <p className="text-[10px] text-[var(--nexus-text-muted)] font-black italic leading-tight uppercase tracking-tight opacity-50">Broadcast your node in high-traffic chat streams for maximum downlink intensity.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default GrowthMissions;
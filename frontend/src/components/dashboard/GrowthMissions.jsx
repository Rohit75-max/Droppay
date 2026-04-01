import React from 'react';
import { motion } from 'framer-motion';
// --- Protocol Engine ---
import { calculateTierStatus, MILESTONES } from '../../protocol/tierProtocol';

import {
  Award, TrendingUp, Zap, CheckCircle, Target, Crosshair, Sparkles, ArrowUpRight,
  Activity, Fingerprint, Cpu, Copy
} from 'lucide-react';
import EliteCard from '../common/EliteCard';

const GrowthMissions = ({
  theme, user, copyToClipboard, copiedType
}) => {
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
    return 'bg-[#000000] border border-white/10 shadow-2xl';
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

        {/* --- MILESTONE TRACKER - PURE AMOLED --- */}
        <EliteCard
          className={`w-full lg:col-span-8 border rounded-[3rem] p-5 lg:p-10 lg:pt-3 space-y-7 relative overflow-hidden transition-all nexus-card ${getCardStyle()}`}
        >

          {/* CLEAN MINIMALIST HEADER */}
          <div className="relative z-10 flex items-center justify-between pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--nexus-accent)]/10 rounded-2xl border border-[var(--nexus-accent)]/20 shadow-inner">
                <Award className="w-5 h-5 text-[var(--nexus-accent)]" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase italic tracking-[0.2em] text-[var(--nexus-accent)]">Growth Engine</h2>
                <p className="text-[10px] font-bold text-[var(--nexus-text-muted)] uppercase tracking-widest mt-0.5 opacity-60">Milestone Synchronization Active</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--nexus-text-muted)]">
              <Activity className="w-3 h-3 text-[var(--nexus-accent)]" />
              Live Link v2.6
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10 w-full pt-8 pb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black italic text-[var(--nexus-text)] tracking-tighter">{referralCount.toString().padStart(2, '0')}</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--nexus-accent)] pb-1">Nodes</span>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text)]">{status?.tierDetails?.label || 'Rookie'}</h4>
                <p className="text-[8px] font-bold text-[var(--nexus-text-muted)] uppercase tracking-wider opacity-40">Current Rank</p>
              </div>
            </div>
            
            {nextMilestone && (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                  <TrendingUp className="w-3.5 h-3.5 text-[var(--nexus-accent)]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--nexus-text)]">{nextMilestone.threshold - referralCount} Left for {nextMilestone.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar Protocol - ELITE SCANNER */}
          <div className="relative z-10 w-full space-y-3 pb-8">
            <div className="h-3 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-[var(--nexus-accent)] rounded-full shadow-[0_0_20px_var(--nexus-accent-glow)] relative"
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--nexus-text-muted)] opacity-40 italic">Syncing Protocol...</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--nexus-accent)]">{Math.floor(progressToNext)}% Completed</span>
            </div>
          </div>

          {/* Mission Path - MINIMALIST LIST */}
          <div className="space-y-4 relative z-10 w-full">
            {missionPath.map((m, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`group relative flex items-center gap-6 p-4 rounded-2xl border transition-all duration-300 ${m.unlocked ? 'bg-white/[0.03] border-white/10' : 'bg-transparent border-white/5 opacity-40'}`}
              >
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${m.unlocked ? 'bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]/30 text-[var(--nexus-accent)]' : 'bg-white/5 border-white/10 text-[var(--nexus-text-muted)]'}`}>
                    <m.icon className="w-5 h-5" />
                  </div>
                  {m.unlocked && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0b] flex items-center justify-center"><CheckCircle className="w-2 h-2 text-white" /></div>}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--nexus-text)]">{m.reward}</h4>
                    {!m.unlocked && <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[var(--nexus-text-muted)] opacity-50">{m.goal} REFS</span>}
                  </div>
                  <p className="text-[9px] font-medium text-[var(--nexus-text-muted)] opacity-60 truncate mt-0.5">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </EliteCard>

        {/* --- REFERRAL CARD - MODERN ANIME AMOLED --- */}
        <div className="w-full lg:col-span-4 space-y-6">
          <EliteCard
            className="w-full bg-[#000000] border border-white/20 rounded-[2.5rem] shadow-2xl relative overflow-hidden group min-h-[480px] flex flex-col"
          >
            {/* Anime Illustration Layer with Breathing Animation */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <motion.img 
                animate={{ scale: [1.1, 1.15, 1.1], y: [0, -5, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                src="/Users/rohit/.gemini/antigravity/brain/63b071dd-e1ca-44e1-b58f-276a5c0bd13c/anime_referral_card_bg_1774159091176.png" 
                alt="Anime Background" 
                className="w-full h-full object-cover opacity-40 transition-opacity duration-700 group-hover:opacity-60"
              />
              
              {/* Energy Particles - Cyberpunk style */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: Math.random() * 400, y: 500 }}
                    animate={{ 
                      opacity: [0, 0.5, 0],
                      y: [500, -100],
                      x: `+=${Math.random() * 100 - 50}`
                    }}
                    transition={{ 
                      duration: 4 + Math.random() * 4,
                      repeat: Infinity,
                      delay: i * 1.5,
                      ease: "linear"
                    }}
                    className="absolute w-0.5 h-4 bg-[var(--nexus-accent)]/30 rounded-full blur-[1px]"
                  />
                ))}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/60" />
            </div>

            <div className="relative z-10 p-8 flex flex-col h-full flex-1">
              <div className="flex items-center justify-between mb-auto">
                <div className="w-12 h-12 rounded-2xl bg-[var(--nexus-accent)]/10 border border-[var(--nexus-accent)]/30 flex items-center justify-center backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <Fingerprint className="w-6 h-6 text-[var(--nexus-accent)] animate-pulse" />
                </div>
                <div className="text-right">
                  <span className="block text-[7px] font-black uppercase tracking-[0.4em] text-[var(--nexus-accent)]">Elite Uplink</span>
                  <span className="block text-[6px] font-bold text-white/40 uppercase tracking-widest mt-1 italic">Protocol v4.2.0</span>
                </div>
              </div>

              <div className="mt-12 space-y-2">
                <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                  Invite <br/>
                  <span className="text-[var(--nexus-accent)] drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">Circle.</span>
                </h3>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-relaxed max-w-[200px] mt-4">
                  Synchronize your community. Expand the reach of your digital empire.
                </p>
              </div>

              <div className="mt-auto space-y-4 pt-8">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[8px] font-black uppercase text-[var(--nexus-accent)] tracking-[0.3em]">Neural Uplink Target</label>
                  {copiedType === 'referral' && (
                    <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-[7px] font-black text-emerald-400 uppercase tracking-widest">
                      ✓ Signal Copied
                    </motion.span>
                  )}
                </div>

                <div 
                  onClick={() => copyToClipboard(referralLink, 'referral')}
                  className="w-full bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-[var(--nexus-accent)]/50 transition-all cursor-pointer group/link relative overflow-hidden flex items-center justify-between"
                >
                  <code className="text-[11px] font-mono font-bold text-white/80 italic truncate pr-4">
                    ref={user?.username}
                  </code>
                  <div className="shrink-0 p-2 bg-white/5 rounded-xl border border-white/10 transition-transform group-hover/link:scale-110">
                    <Copy className="w-3.5 h-3.5 text-white/40 group-hover/link:text-[var(--nexus-accent)] transition-colors" />
                  </div>
                  {/* Subtle Scanning Line */}
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }} 
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-[var(--nexus-accent)]/10 to-transparent -skew-x-12"
                  />
                </div>

                <button
                  onClick={() => copyToClipboard(referralLink, 'referral')}
                  className="w-full py-4 bg-[var(--nexus-accent)] text-black rounded-2xl font-black uppercase italic text-[11px] tracking-widest flex items-center justify-center gap-3 transition-all hover:brightness-110 shadow-[0_15px_30px_rgba(16,185,129,0.3)] group/btn"
                >
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" /> Deploy Link
                </button>
              </div>
            </div>
          </EliteCard>

          {/* Strategy Tip - MINIMALIST FOOTER */}
          <div className="w-full bg-[#000000] border border-white/10 rounded-[2rem] p-6 flex items-center gap-5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[var(--nexus-accent)]/10 flex items-center justify-center shrink-0 border border-[var(--nexus-accent)]/20 shadow-inner">
              <Cpu className="w-5 h-5 text-[var(--nexus-accent)]" />
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-accent)] mb-0.5">Community Uplink</p>
              <p className="text-[9px] text-[var(--nexus-text-muted)] font-bold uppercase tracking-tight opacity-40 leading-tight">Share your link to lower platform fees and secure your tier standing.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GrowthMissions;
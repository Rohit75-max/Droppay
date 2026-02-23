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
    return theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 shadow-xl' : 'bg-white border-slate-200 shadow-md';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-10 font-sans pb-20 pt-4 w-full"
    >
      
      {/* --- HEADER & STATS --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 w-full">
        <div className="space-y-1 w-full md:w-auto">
          <h2 className={`text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <Award className="w-8 h-8 text-[#10B981]" /> Growth Missions
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Recruit streamers to unlock elite protocols</p>
        </div>
        <div className={`border px-10 py-5 rounded-[2.5rem] transition-colors w-full md:w-auto relative overflow-hidden ${theme === 'dark' ? 'bg-black border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'}`}>
          <p className="text-[9px] font-black text-[#10B981] uppercase tracking-widest mb-1 text-center italic">Network Size</p>
          <p className={`text-4xl font-black italic text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {referralCount.toString().padStart(2, '0')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* --- MILESTONE TRACKER --- */}
        <div className={`w-full lg:col-span-8 border rounded-[2.5rem] p-8 lg:p-12 space-y-12 relative overflow-hidden transition-all ${getCardStyle()}`}>
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] -mr-32 -mt-32 ${theme === 'dark' ? 'bg-[#10B981]/5' : 'bg-indigo-600/5'}`} />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 w-full">
            <h3 className="text-xs font-black uppercase italic tracking-widest text-slate-500 flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-[#10B981]" /> Mission Progression
            </h3>
            {nextMilestone && (
              <span className="text-[10px] font-black text-[#10B981] bg-[#10B981]/10 px-5 py-2 rounded-full border border-[#10B981]/20 uppercase italic">
                {nextMilestone.threshold - referralCount} to unlock {nextMilestone.name}
              </span>
            )}
          </div>

          {/* Progress Bar Protocol */}
          <div className="relative z-10 w-full space-y-4">
             <div className="h-4 bg-black/40 rounded-full p-1 border border-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#10B981] to-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                />
             </div>
             <div className="flex justify-between px-1 text-[10px] font-black uppercase tracking-widest">
                <p className="text-slate-500">Node Syncing</p>
                <p className="text-[#10B981] italic">{Math.floor(progressToNext)}% Complete</p>
             </div>
          </div>

          {/* Mission Path */}
          <div className="space-y-10 relative z-10 w-full">
            {missionPath.map((m, i) => (
              <div key={i} className={`relative pl-12 border-l-2 py-2 group w-full transition-all ${m.unlocked ? 'border-[#10B981] opacity-100' : 'border-white/5 opacity-30'}`}>
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full transition-all ${m.unlocked ? 'bg-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-black border-2 border-white/10'}`} />
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                  <div className="space-y-1">
                    <h4 className={`text-sm font-black uppercase italic flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      <m.icon className={`w-4 h-4 ${m.unlocked ? 'text-[#10B981]' : 'text-slate-500'}`} /> {m.reward}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider italic">{m.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.unlocked && <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />}
                    <p className={`text-[10px] font-black uppercase tracking-widest ${m.unlocked ? 'text-[#10B981]' : 'text-slate-500'}`}>THRESHOLD: {m.goal}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- REFERRAL CARD --- */}
        <div className="w-full lg:col-span-4 space-y-6">
          <div className="w-full bg-gradient-to-br from-indigo-600 to-indigo-900 border border-indigo-500/30 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-8 w-full">
              <div className="p-4 bg-white/10 w-fit rounded-2xl border border-white/20 shadow-xl"><Users className="w-7 h-7 text-white" /></div>
              <div>
                 <h3 className="text-2xl font-black uppercase italic text-white leading-tight">Uplink Generator</h3>
                 <p className="text-white/60 text-[11px] font-bold leading-relaxed italic mt-3">When a streamer joins via your node, your commission protocol syncs to a lower percentage permanently.</p>
              </div>
              
              <div className="space-y-3 w-full">
                <label className="text-[9px] font-black uppercase text-white/50 tracking-[0.2em] ml-1 flex justify-between h-3">
                    Protocol Link
                    {copiedType === 'referral' && <span className="text-emerald-400">✓ SYNCED</span>}
                </label>
                <div 
                  onClick={() => copyToClipboard(referralLink, 'referral')}
                  className="w-full bg-black/40 backdrop-blur-xl rounded-2xl p-5 flex items-center justify-between border border-white/10 cursor-pointer group-hover:border-[#10B981]/50 transition-all shadow-inner"
                >
                  <code className="text-[11px] font-mono font-black text-indigo-200 truncate pr-4 italic">
                    signup?ref={user?.username}
                  </code>
                  <div className="p-2.5 bg-white/5 rounded-xl transition-all">
                    {copiedType === 'referral' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                 <button 
                  onClick={() => copyToClipboard(referralLink, 'referral')}
                  className="w-full py-5 bg-white text-indigo-900 rounded-2xl font-black uppercase italic text-[11px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                 >
                   <ArrowUpRight className="w-4 h-4" /> Share Growth Node
                 </button>
              </div>
            </div>
            <Users className="absolute -bottom-10 -right-10 w-56 h-56 text-white/[0.03] -rotate-12 pointer-events-none" />
          </div>

          <div className={`w-full border rounded-[2.5rem] p-7 flex items-start gap-5 transition-all ${getCardStyle()}`}>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-inner">
              <Gift className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className={`text-[11px] font-black uppercase mb-1 tracking-widest italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Strategy Tip</p>
              <p className="text-[11px] text-slate-500 font-bold italic leading-relaxed uppercase tracking-tight">Drop your node in chat to recruit fellow creators and lower your fees.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GrowthMissions;
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, Sparkles, Crosshair, Crown } from 'lucide-react';

const CyberGoalBar = ({ goal, tier, runnerUrl, percentage, isComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative w-full max-w-[760px] h-[84px] group mx-auto"
    >
      {/* REACTIVE GLOWING AURA */}
      <div className={`absolute -inset-1.5 rounded-full blur-xl opacity-40 transition-colors duration-1000 animate-pulse ${isComplete ? 'bg-amber-500' : 'bg-indigo-600'}`} />

      {/* MAIN PILL BODY */}
      <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.02)] flex items-center px-6 gap-6 overflow-hidden">

        {/* GLASS SWEEP REFLECTION */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[scan_4s_ease-in-out_infinite]" />

        {/* LEFT: ROTATING HUD ICON & TITLE */}
        <div className="flex items-center gap-4 w-[30%] shrink-0 relative z-10">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <div className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-1000 animate-[spin_4s_linear_infinite] ${isComplete ? 'border-amber-500/50' : 'border-indigo-500/50'}`} />
            <div className={`absolute inset-1 rounded-full border-t-2 transition-colors duration-1000 animate-[spin_2s_linear_infinite_reverse] ${isComplete ? 'border-amber-400' : 'border-purple-500'}`} />

            {isComplete ? (
              <Trophy className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            ) : tier === 'legend' ? (
              <Crown className="w-5 h-5 text-amber-400" />
            ) : (
              <Target className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            )}
          </div>

          <div className="flex flex-col min-w-0 justify-center h-full pt-1">
            <p className={`text-[9px] font-black uppercase tracking-[0.3em] leading-none mb-1.5 transition-colors duration-1000 ${isComplete ? 'text-amber-400' : 'text-indigo-400'}`}>
              {isComplete ? 'Objective Complete' : 'Network Mission'}
            </p>
            <h2 className="text-white text-sm font-black italic uppercase tracking-tighter truncate leading-none drop-shadow-md">
              {goal.title}
            </h2>
          </div>
        </div>

        {/* MIDDLE: LIQUID NEON TRACK */}
        <div className="flex-1 relative h-3 bg-[#000000] rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,1)] border border-white/5 flex items-center">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className={`h-full relative rounded-full transition-colors duration-1000 ${isComplete ? 'bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.6)]' : 'bg-gradient-to-r from-indigo-600 via-cyan-400 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.6)]'}`}
          >
            {/* Energy Core Texture */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />

            {/* THE LOTTIE RUNNER */}
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center z-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              <lottie-player src={runnerUrl} background="transparent" speed="1" loop autoplay style={{ width: '100%', height: '100%' }}></lottie-player>
            </motion.div>

            {(tier === 'pro' || tier === 'legend') && !isComplete && (
              <div className="absolute right-0 h-full w-24 bg-gradient-to-l from-white/60 to-transparent blur-[2px] pointer-events-none rounded-r-full" />
            )}
          </motion.div>
        </div>

        {/* RIGHT: SCI-FI READOUT STATS */}
        <div className="flex flex-col items-end justify-center w-[25%] shrink-0 relative z-10 pt-1">
          <div className="flex items-end gap-1.5 mb-1.5">
            <motion.span
              key={goal.currentProgress}
              initial={{ scale: 1.2, color: isComplete ? '#fde68a' : '#c7d2fe' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-lg font-black italic tracking-tighter leading-none drop-shadow-md"
            >
              ₹{goal.currentProgress.toLocaleString()}
            </motion.span>
            <span className="text-[10px] text-slate-400 font-bold mb-0.5 leading-none">/ {goal.targetAmount.toLocaleString()}</span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border backdrop-blur-md transition-colors duration-1000 ${isComplete ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'}`}>
            {isComplete ? (
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            ) : (
              <Crosshair className="w-3 h-3 text-indigo-400 animate-[spin_3s_linear_infinite]" />
            )}
            <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${isComplete ? 'text-amber-400' : 'text-indigo-300'}`}>
              {percentage.toFixed(1)}% Synced
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CyberGoalBar;
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, Sparkles, Crosshair, Crown, Star, Flame, Leaf, Activity, Skull } from 'lucide-react';

const CyberGoalBar = ({ goal, tier, runnerUrl, percentage, isComplete, goalStylePreference = 'modern' }) => {

  // ==========================================
  // 1. PREMIUM STYLE: 3D GLASS JAR
  // ==========================================
  if (goalStylePreference === 'glass_jar') {
    return (
      <div className="relative w-full max-w-2xl mx-auto py-8 px-4 flex flex-col items-center">
        <div className="flex justify-between items-end mb-3 px-2 w-full">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1 flex items-center gap-1 drop-shadow-md">
              <Target className="w-3 h-3" /> ACTIVE MISSION
            </span>
            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">{goal.title}</h2>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-white italic drop-shadow-lg">₹{goal.currentProgress.toLocaleString('en-IN')}</span>
            <span className="text-sm font-bold text-white/70 ml-1 drop-shadow-md">/ ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="relative w-full h-16 rounded-[2rem] p-1.5 overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] bg-white/10 border border-white/30 backdrop-blur-xl z-10">
          <div className="absolute top-1 left-4 right-4 h-3 rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none z-30" />
          <div className="absolute inset-0 bg-black/40 shadow-[inset_0_4px_15px_rgba(0,0,0,0.6)] -z-10 rounded-[2rem]" />
          <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ type: "spring", bounce: 0.2, duration: 2 }} className="relative h-full rounded-[1.5rem] bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.5)] overflow-hidden flex justify-end items-center pr-4">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-30 mix-blend-overlay pointer-events-none" />
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/60 to-transparent" />
            <span className="text-emerald-950 font-black italic text-lg z-10 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">{percentage.toFixed(0)}%</span>
          </motion.div>
          <div className="absolute bottom-0 left-2 right-2 h-4 rounded-full bg-gradient-to-t from-white/10 to-transparent pointer-events-none z-30 shadow-[inset_0_-2px_4px_rgba(255,255,255,0.2)]" />
        </div>
        <motion.div animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -bottom-10 -left-6 w-32 h-32 z-40 drop-shadow-2xl pointer-events-none">
          <lottie-player src={runnerUrl} background="transparent" speed="1" loop autoplay style={{ width: '100%', height: '100%' }}></lottie-player>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // 2. NEW STYLE: ARC REACTOR (HORIZONTAL)
  // ==========================================
  if (goalStylePreference === 'arc_reactor_horizontal') {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-full max-w-sm mx-auto py-4 flex items-center justify-center gap-6 bg-[#050505]/90 p-6 rounded-[3rem] border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] backdrop-blur-2xl">
        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
          <svg className="transform -rotate-90 w-32 h-32 absolute inset-0">
            <circle cx="64" cy="64" r={radius} stroke="rgba(6, 182, 212, 0.1)" strokeWidth="8" fill="none" />
            <motion.circle cx="64" cy="64" r={radius} stroke="#06b6d4" strokeWidth="8" fill="none" strokeDasharray={circumference} animate={{ strokeDashoffset }} transition={{ duration: 1.5, ease: "easeInOut" }} strokeLinecap="round" className="drop-shadow-[0_0_15px_#06b6d4]" />
          </svg>
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[spin_4s_linear_infinite] m-3 border-dashed" />
          <div className="flex flex-col items-center justify-center z-10 animate-pulse">
            <span className="text-cyan-400 font-black text-xl drop-shadow-[0_0_8px_#06b6d4]">{percentage.toFixed(0)}%</span>
            <span className="text-[8px] text-cyan-500/70 font-mono tracking-widest">SYNC</span>
          </div>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-3 h-3 text-cyan-500 animate-pulse" />
            <span className="text-[10px] text-cyan-500 font-black tracking-widest uppercase">Reactor Core</span>
          </div>
          <h2 className="text-white font-black italic text-lg truncate drop-shadow-md mb-1">{goal.title}</h2>
          <div className="text-cyan-300 font-black text-2xl drop-shadow-[0_0_10px_rgba(6,182,212,0.6)] leading-none mb-1">
            ₹{goal.currentProgress.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-cyan-500/60 font-bold uppercase tracking-widest">Goal: ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. NEW STYLE: ARC REACTOR (CIRCULAR)
  // ==========================================
  if (goalStylePreference === 'arc_reactor_circular') {
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-64 h-64 mx-auto flex flex-col items-center justify-center bg-[#050505]/90 rounded-full border-[4px] border-cyan-900/50 shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-2xl p-4 my-6">
        <div className="absolute inset-4 rounded-full border-[2px] border-cyan-500/20 border-dashed animate-[spin_10s_linear_infinite]" />
        <div className="absolute inset-8 rounded-full border-[1px] border-cyan-400/30 border-dotted animate-[spin_15s_linear_infinite_reverse]" />
        <svg className="transform -rotate-90 w-full h-full absolute inset-0">
          <circle cx="128" cy="128" r={radius} stroke="rgba(6, 182, 212, 0.1)" strokeWidth="12" fill="none" />
          <motion.circle cx="128" cy="128" r={radius} stroke="#06b6d4" strokeWidth="12" fill="none" strokeDasharray={circumference} animate={{ strokeDashoffset }} transition={{ duration: 1.5, ease: "easeInOut" }} strokeLinecap="round" className="drop-shadow-[0_0_15px_#06b6d4]" />
        </svg>
        <div className="relative z-10 flex flex-col items-center justify-center animate-pulse text-center">
          <Activity className="w-6 h-6 text-cyan-400 mb-1" />
          <span className="text-cyan-300 font-black text-4xl drop-shadow-[0_0_10px_#06b6d4] leading-none mb-1">{percentage.toFixed(0)}%</span>
          <span className="text-white text-sm font-bold tracking-widest">₹{goal.currentProgress.toLocaleString('en-IN')}</span>
          <span className="text-cyan-600 text-[10px] font-mono mt-1 uppercase tracking-widest max-w-[120px] truncate">{goal.title}</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 4. NEW STYLE: BOSS FIGHT (Reverse Health Bar)
  // ==========================================
  if (goalStylePreference === 'boss_fight') {
    const bossHP = Math.max(100 - percentage, 0);

    return (
      <motion.div animate={!isComplete ? { x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 1, 0] } : {}} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="relative w-full max-w-[760px] mx-auto py-6">
        <div className="bg-[#1a0505] p-5 border-[6px] border-[#3f0f0f] shadow-[8px_8px_0_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="flex justify-between items-end mb-3 relative z-10">
            <div className="flex items-center gap-3">
              <Skull className={`w-8 h-8 ${isComplete ? 'text-slate-700' : 'text-red-500 animate-pulse drop-shadow-[0_0_10px_red]'}`} />
              <div className="flex flex-col">
                <span className="text-red-500 font-black text-[10px] tracking-[0.3em] uppercase">Raid Boss</span>
                <h2 className="text-white font-black text-xl tracking-wider uppercase drop-shadow-[2px_2px_0_#000]" style={{ fontFamily: '"Press Start 2P", monospace' }}>
                  {isComplete ? 'BOSS DEFEATED!' : goal.title}
                </h2>
              </div>
            </div>
            <span className="text-red-500 font-black text-xl drop-shadow-[2px_2px_0_#000]">
              HP: {isComplete ? '0' : `₹${(goal.targetAmount - goal.currentProgress).toLocaleString('en-IN')}`}
            </span>
          </div>
          <div className="relative h-10 bg-black border-[4px] border-[#3f0f0f] p-1 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)]">
            <motion.div initial={{ width: "100%" }} animate={{ width: `${bossHP}%` }} className={`h-full ${isComplete ? 'bg-transparent' : 'bg-red-600'} shadow-[inset_0_-4px_0_rgba(0,0,0,0.4)]`}>
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </motion.div>
            {!isComplete && (
              <motion.div animate={{ x: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 0.5 }} className="absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-16 z-50 transform -scale-x-100" style={{ left: `${bossHP}%` }}>
                <lottie-player src={runnerUrl} background="transparent" speed="2" loop autoplay style={{ width: '100%', height: '100%' }}></lottie-player>
              </motion.div>
            )}
          </div>
          {isComplete && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 backdrop-blur-sm">
              <span className="text-yellow-400 font-black text-5xl tracking-widest animate-bounce drop-shadow-[4px_4px_0_#b45309]">VICTORY</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // 5. NEW STYLE: PLASMA BATTERY (Vertical)
  // ==========================================
  if (goalStylePreference === 'plasma_battery') {
    return (
      <div className="relative h-[400px] w-full max-w-[200px] mx-auto flex flex-col items-center justify-end py-10 my-6">
        <div className="absolute top-0 text-center w-64 z-20 bg-black/80 border border-[#39ff14]/30 rounded-xl p-3 shadow-[0_0_20px_rgba(57,255,20,0.2)] backdrop-blur-md">
          <h2 className="text-[#39ff14] font-black tracking-widest uppercase text-[10px] truncate mb-1">{goal.title}</h2>
          <div className="text-white font-black text-xl drop-shadow-[0_0_5px_#39ff14]">₹{goal.currentProgress.toLocaleString('en-IN')}</div>
          <div className="text-slate-400 text-[10px] font-bold">/ ₹{goal.targetAmount.toLocaleString('en-IN')}</div>
        </div>
        <div className="relative w-28 h-[280px] bg-[#020a05] border-[4px] border-slate-800 rounded-t-[3rem] rounded-b-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(0,0,0,0.8)]">
          <div className="absolute top-2 left-2 right-12 bottom-2 bg-gradient-to-r from-white/10 to-transparent rounded-t-[2.5rem] rounded-b-2xl pointer-events-none z-30" />
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white/10 to-transparent z-30" />
          <motion.div initial={{ height: 0 }} animate={{ height: `${percentage}%` }} transition={{ duration: 2, ease: "circOut" }} className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-emerald-600 via-[#39ff14] to-[#86efac] shadow-[0_0_40px_#39ff14] z-10 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-60 animate-[scanline_3s_linear_infinite]" style={{ animationDirection: 'reverse' }} />
            <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute top-0 w-full h-4 bg-white/40 blur-[2px]" />
          </motion.div>
        </div>
        <motion.div animate={{ y: [-2, 2, -2] }} className="absolute left-1/2 -translate-x-1/2 w-16 h-16 z-50 drop-shadow-[0_0_15px_#39ff14] transition-all duration-1000 ease-out" style={{ bottom: `calc(40px + ${percentage * 2.8}px)` }}>
          <lottie-player src={runnerUrl} background="transparent" speed="1" loop autoplay style={{ width: '100%', height: '100%' }}></lottie-player>
        </motion.div>
        <div className="absolute bottom-2 w-36 h-10 bg-slate-900 border-2 border-slate-700 rounded-xl flex items-center justify-center shadow-2xl z-40">
          <span className="text-[#39ff14] font-black text-xl drop-shadow-[0_0_10px_#39ff14]">{percentage.toFixed(0)}%</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 6. NEW STYLE: PIXEL COIN STACK (ROW)
  // ==========================================
  if (goalStylePreference === 'pixel_coin_row') {
    const totalBlocks = 20;
    const filledBlocks = Math.min(Math.floor((percentage / 100) * totalBlocks), totalBlocks);

    return (
      <div className="relative w-full max-w-[760px] mx-auto bg-[#2b2b2b] p-5 sm:p-6 border-[6px] border-black shadow-[12px_12px_0_rgba(0,0,0,1)] my-6">
        <div className="flex justify-between items-end mb-4">
          <div className="flex flex-col">
            <span className="text-[#FBBF24] font-black uppercase tracking-widest text-[10px] sm:text-xs drop-shadow-[2px_2px_0_#000]">Vault Objective</span>
            <span className="text-white font-black text-lg sm:text-2xl uppercase tracking-tighter drop-shadow-[2px_2px_0_#000]">{goal.title}</span>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-white font-black text-xl sm:text-3xl drop-shadow-[3px_3px_0_#000]">₹{goal.currentProgress.toLocaleString('en-IN')}</span>
            <span className="text-slate-400 font-bold text-[10px]">TARGET: ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2 h-10 sm:h-12 w-full p-1 bg-black border-2 border-[#1a1a1a]">
          {Array.from({ length: totalBlocks }).map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05, type: "spring" }} className={`flex-1 border-[3px] ${i < filledBlocks ? 'bg-[#FBBF24] border-t-[#FEF3C7] border-l-[#FEF3C7] border-b-[#B45309] border-r-[#B45309]' : 'bg-[#1a1a1a] border-[#2b2b2b]'} shadow-sm relative`}>
              {i < filledBlocks && <div className="absolute top-0 left-0 w-2 h-2 bg-white/40" />}
            </motion.div>
          ))}
        </div>
        <div className="absolute -top-6 left-6 bg-[#FBBF24] border-4 border-black px-4 py-1 rotate-[-3deg] shadow-[4px_4px_0_#000] z-20">
          <span className="text-black font-black uppercase text-sm">{percentage.toFixed(0)}% BUILT</span>
        </div>
        {isComplete && (
          <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute -top-10 -right-6 z-30">
            <Trophy className="w-16 h-16 text-[#FBBF24] drop-shadow-[4px_4px_0_#000]" />
          </motion.div>
        )}
      </div>
    );
  }

  // ==========================================
  // 7. NEW STYLE: PIXEL COIN STACK (VAULT/GRID)
  // ==========================================
  if (goalStylePreference === 'pixel_coin_vault') {
    const cols = 10;
    const rows = 4;
    const totalBlocks = cols * rows;
    const filledBlocks = Math.min(Math.floor((percentage / 100) * totalBlocks), totalBlocks);

    return (
      <div className="relative w-full max-w-[340px] mx-auto bg-[#2b2b2b] p-6 border-[6px] border-black shadow-[12px_12px_0_rgba(0,0,0,1)] my-6 flex flex-col items-center">
        <div className="flex flex-col items-center mb-5 text-center w-full">
          <span className="text-[#FBBF24] font-black uppercase tracking-widest text-[10px] drop-shadow-[2px_2px_0_#000]">Vault Objective: {goal.title}</span>
          <div className="text-white font-black text-3xl drop-shadow-[3px_3px_0_#000] mt-1">₹{goal.currentProgress.toLocaleString('en-IN')}</div>
          <span className="text-slate-400 font-bold text-[10px] mt-1">TARGET: ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className="grid grid-cols-10 gap-1 w-full bg-black p-2 border-[4px] border-[#1a1a1a] transform rotate-180">
          {Array.from({ length: totalBlocks }).map((_, i) => {
            const isFilled = i < filledBlocks;
            return (
              <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02, type: "spring" }} className={`w-full aspect-square border-[2px] transform rotate-180 ${isFilled ? 'bg-[#FBBF24] border-t-[#FEF3C7] border-l-[#FEF3C7] border-b-[#B45309] border-r-[#B45309]' : 'bg-[#1a1a1a] border-[#2b2b2b]'}`}>
                {isFilled && <div className="absolute top-0 left-0 w-1 h-1 bg-white/60" />}
              </motion.div>
            );
          })}
        </div>
        <div className="absolute -top-5 -right-5 bg-[#FBBF24] border-[4px] border-black px-4 py-1 rotate-[5deg] shadow-[4px_4px_0_#000] z-20">
          <span className="text-black font-black uppercase text-sm tracking-widest">{percentage.toFixed(0)}%</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 8. PREMIUM STYLE: GTA HEIST
  // ==========================================
  if (goalStylePreference === 'gta') {
    return (
      <motion.div initial={{ opacity: 0, y: -40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="relative w-full max-w-[760px] h-[84px] group mx-auto my-6">
        <style>{`@keyframes policeSirenBar { 0%, 100% { box-shadow: 0 0 40px rgba(255,0,0,0.5), inset 0 0 20px rgba(255,0,0,0.2); border-color: #ef4444; } 50% { box-shadow: 0 0 40px rgba(59,130,246,0.6), inset 0 0 20px rgba(59,130,246,0.3); border-color: #3b82f6; } }`}</style>
        <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl rounded-xl border-[3px] border-[#FFD700] flex items-center px-4 sm:px-6 gap-3 sm:gap-6 overflow-hidden animate-[policeSirenBar_2s_infinite]">
          <div className="flex items-center gap-2 sm:gap-4 w-auto sm:w-[30%] shrink-0 relative z-10">
            <Star className="w-8 h-8 sm:w-10 sm:h-10 fill-[#FFD700] text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
            <div className="flex flex-col min-w-0 justify-center h-full pt-1">
              <p className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-none mb-1 sm:mb-1.5 text-[#FFD700]">{isComplete ? 'Heist Passed' : 'Active Heist'}</p>
              <h2 className="text-white text-[12px] sm:text-[15px] font-black italic uppercase tracking-tighter truncate leading-none drop-shadow-md">HEIST TAKE</h2>
            </div>
          </div>
          <div className="flex-1 relative h-4 bg-black rounded-sm border-2 border-white/20 flex items-center overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full relative bg-gradient-to-r from-green-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center z-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                <lottie-player src={runnerUrl} background="transparent" speed="1" loop autoplay style={{ width: '100%', height: '100%' }}></lottie-player>
              </motion.div>
            </motion.div>
          </div>
          <div className="flex flex-col items-end justify-center w-auto sm:w-[25%] shrink-0 relative z-10 pt-1">
            <div className="flex items-end gap-1 mb-1 sm:mb-1.5">
              <span className="text-sm sm:text-lg font-black italic tracking-tighter leading-none text-white drop-shadow-[2px_2px_0_#000]">₹{goal.currentProgress.toLocaleString()}</span>
              <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold mb-0.5 leading-none">/ {goal.targetAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded border border-[#FFD700]/50 bg-black/60 shadow-[0_0_10px_rgba(255,215,0,0.2)]">
              <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest leading-none text-[#FFD700]">{percentage.toFixed(0)}% SECURED</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // 9. PREMIUM STYLE: BGMI TACTICAL
  // ==========================================
  if (goalStylePreference === 'bgmi') {
    return (
      <motion.div initial={{ opacity: 0, y: -40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="relative w-full max-w-[760px] h-[84px] group mx-auto my-6">
        <div className="absolute inset-0 bg-[#151716] rounded-lg border-[3px] border-[#F97316] shadow-[0_0_40px_rgba(249,115,22,0.3)] flex items-center px-4 sm:px-6 gap-3 sm:gap-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[repeating-linear-gradient(45deg,#F97316,#F97316_10px,#000_10px,#000_20px)] opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
            <div className="w-[800px] h-[800px] rounded-full border border-[#F97316] flex items-center justify-center">
              <div className="absolute w-1/2 h-1/2 origin-bottom-right bg-gradient-to-tr from-[#F97316]/40 to-transparent animate-[spin_4s_linear_infinite]" />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-auto sm:w-[30%] shrink-0 relative z-10">
            <Target className="w-8 h-8 sm:w-10 sm:h-10 text-[#F97316] animate-pulse" />
            <div className="flex flex-col min-w-0 justify-center h-full pt-1">
              <p className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-none mb-1 sm:mb-1.5 text-[#F97316]/70">{isComplete ? 'Airdrop Secured' : 'Incoming Drop'}</p>
              <h2 className="text-white text-[12px] sm:text-[15px] font-black italic uppercase tracking-widest truncate leading-none drop-shadow-md">AIRDROP LOOT</h2>
            </div>
          </div>
          <div className="flex-1 relative h-4 bg-blue-900/40 rounded-sm border-2 border-slate-700 flex items-center overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full relative bg-[#F97316] shadow-[0_0_15px_rgba(249,115,22,0.5)] overflow-hidden">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_20px)]" />
              <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center z-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                <lottie-player src={runnerUrl} background="transparent" speed="1" loop autoplay style={{ width: '100%', height: '100%' }}></lottie-player>
              </motion.div>
            </motion.div>
          </div>
          <div className="flex flex-col items-end justify-center w-auto sm:w-[25%] shrink-0 relative z-10 pt-1">
            <div className="flex items-end gap-1 mb-1 sm:mb-1.5">
              <span className="text-sm sm:text-lg font-black italic tracking-tighter leading-none text-[#F97316] drop-shadow-md">₹{goal.currentProgress.toLocaleString()}</span>
              <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold mb-0.5 leading-none">/ {goal.targetAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded bg-black/60 border-l-2 border-[#F97316]">
              <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest leading-none text-[#F97316]">{percentage.toFixed(0)}% LOOTED</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // 10. PREMIUM STYLE: CLASH OF CLANS
  // ==========================================
  if (goalStylePreference === 'coc') {
    return (
      <motion.div initial={{ opacity: 0, y: -40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="relative w-full max-w-[760px] h-[84px] group mx-auto my-6">
        <div className="absolute inset-0 bg-[#451A03] rounded-sm border-[4px] border-[#FBBF24] shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.8)] flex items-center px-4 sm:px-6 gap-3 sm:gap-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay" />
          {[1, 2, 3].map((i) => (<motion.div key={i} animate={{ y: [-10, -40], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 + i, delay: i * 0.5 }} className="absolute bottom-0 w-2 h-2 bg-[#A855F7] rounded-full blur-[1px] shadow-[0_0_8px_#A855F7]" style={{ left: `${15 * i + 10}%` }} />))}
          <div className="flex items-center gap-2 sm:gap-4 w-auto sm:w-[30%] shrink-0 relative z-10">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 fill-[#FBBF24] text-[#854D0E] drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]" />
            <div className="flex flex-col min-w-0 justify-center h-full pt-1">
              <p className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-none mb-1 sm:mb-1.5 text-[#FBBF24]/70">{isComplete ? 'Village Destroyed' : 'Active Raid'}</p>
              <h2 className="text-white text-[12px] sm:text-[15px] font-black uppercase tracking-wider truncate leading-none drop-shadow-[2px_2px_0_#000]">{goal.title}</h2>
            </div>
          </div>
          <div className="flex-1 relative h-5 bg-[#291002] rounded-full border-2 border-[#1C0A01] flex items-center overflow-hidden shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)]">
            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full relative bg-gradient-to-b from-[#FCD34D] via-[#F59E0B] to-[#D97706] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]">
              <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center z-50 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                <lottie-player src={runnerUrl} background="transparent" speed="1" loop autoplay style={{ width: '100%', height: '100%' }}></lottie-player>
              </motion.div>
            </motion.div>
          </div>
          <div className="flex flex-col items-end justify-center w-auto sm:w-[25%] shrink-0 relative z-10 pt-1">
            <div className="flex items-end gap-1 mb-1 sm:mb-1.5">
              <span className="text-sm sm:text-lg font-black tracking-widest leading-none text-[#FBBF24] drop-shadow-[2px_2px_0_#000]">₹{goal.currentProgress.toLocaleString()}</span>
              <span className="text-[8px] sm:text-[10px] text-[#FBBF24]/50 font-bold mb-0.5 leading-none">/ {goal.targetAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-sm bg-[#291002] border border-[#1C0A01] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
              <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest leading-none text-white drop-shadow-[1px_1px_0_#000]">{percentage.toFixed(0)}% STOLEN</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // 11. PREMIUM STYLE: AVATAR
  // ==========================================
  if (goalStylePreference === 'avatar') {
    return (
      <motion.div initial={{ opacity: 0, y: -40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="relative w-full max-w-[760px] h-[84px] group mx-auto my-6">
        <div className="absolute inset-0 bg-[#040D14] rounded-[2rem] border border-[#06B6D4]/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] flex items-center px-4 sm:px-6 gap-3 sm:gap-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#06B6D4]/10 via-transparent to-[#8B5CF6]/10" />
          {[1, 2, 3, 4, 5].map((i) => (<motion.div key={i} animate={{ y: ['100%', '-100%'], x: Math.sin(i) * 10, opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 3 + i, ease: "linear" }} className="absolute bottom-0 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#22d3ee,0_0_2px_white]" style={{ left: `${15 * i + 10}%` }} />))}
          <div className="flex items-center gap-2 sm:gap-4 w-auto sm:w-[30%] shrink-0 relative z-10">
            <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-[#22D3EE] animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <div className="flex flex-col min-w-0 justify-center h-full pt-1">
              <p className="text-[7px] sm:text-[9px] font-medium tracking-[0.3em] leading-none mb-1 sm:mb-1.5 text-[#22D3EE]/70">{isComplete ? 'Eywa Has Heard You' : 'Sacred Connection'}</p>
              <h2 className="text-white text-[12px] sm:text-[15px] font-light tracking-[0.2em] truncate leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">{goal.title}</h2>
            </div>
          </div>
          <div className="flex-1 relative h-2 bg-[#081C29] rounded-full border border-[#06B6D4]/20 flex items-center overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full relative bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] shadow-[0_0_20px_rgba(6,182,212,0.8)]">
              <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center z-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                <lottie-player src={runnerUrl} background="transparent" speed="1" loop autoplay style={{ width: '100%', height: '100%' }}></lottie-player>
              </motion.div>
            </motion.div>
          </div>
          <div className="flex flex-col items-end justify-center w-auto sm:w-[25%] shrink-0 relative z-10 pt-1">
            <div className="flex items-end gap-1 mb-1 sm:mb-1.5">
              <span className="text-sm sm:text-lg font-light tracking-widest leading-none text-[#22D3EE] drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">₹{goal.currentProgress.toLocaleString()}</span>
              <span className="text-[8px] sm:text-[10px] text-[#22D3EE]/50 font-medium mb-0.5 leading-none">/ {goal.targetAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30">
              <span className="text-[7px] sm:text-[9px] font-medium tracking-[0.2em] leading-none text-[#22D3EE]">{percentage.toFixed(0)}% BONDED</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // 12. PREMIUM STYLE: GODZILLA
  // ==========================================
  if (goalStylePreference === 'godzilla') {
    return (
      <motion.div initial={{ opacity: 0, y: -40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="relative w-full max-w-[760px] h-[84px] group mx-auto my-6">
        <style>{`@keyframes atomicBreathBar { 0% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } @keyframes titanShake { 0%, 100% { transform: translateY(0); } 10%, 30%, 50%, 70%, 90% { transform: translateY(-2px); } 20%, 40%, 60%, 80% { transform: translateY(2px); } }`}</style>
        <div className="absolute inset-0 bg-[#020617] rounded-sm border-y-[4px] border-[#0EA5E9] shadow-[0_0_40px_rgba(14,165,233,0.3)] flex items-center px-4 sm:px-6 gap-3 sm:gap-6 overflow-hidden animate-[titanShake_4s_ease-in-out_infinite]">
          <div className="absolute inset-0 bg-[#0EA5E9]/5 animate-pulse" />
          <div className="flex items-center gap-2 sm:gap-4 w-auto sm:w-[30%] shrink-0 relative z-10">
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-[#38BDF8] animate-pulse drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]" />
            <div className="flex flex-col min-w-0 justify-center h-full pt-1">
              <p className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-none mb-1 sm:mb-1.5 text-white bg-red-600 px-1 py-0.5 inline-block w-max">{isComplete ? 'CRITICAL MASS' : 'TITAN DETECTED'}</p>
              <h2 className="text-white text-[12px] sm:text-[15px] font-black italic uppercase tracking-tighter truncate leading-none drop-shadow-[0_0_10px_rgba(14,165,233,0.8)] text-[#38BDF8]">{goal.title}</h2>
            </div>
          </div>
          <div className="flex-1 relative h-6 bg-black rounded-sm border-2 border-slate-800 flex items-center overflow-hidden skew-x-[-12deg]">
            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full relative bg-gradient-to-r from-transparent via-[#38BDF8] to-white bg-[length:200%_100%] animate-[atomicBreathBar_2s_linear_infinite] shadow-[0_0_20px_rgba(56,189,248,0.8)]">
              <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center z-50 skew-x-[12deg] drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                <lottie-player src={runnerUrl} background="transparent" speed="1" loop autoplay style={{ width: '100%', height: '100%' }}></lottie-player>
              </motion.div>
            </motion.div>
          </div>
          <div className="flex flex-col items-end justify-center w-auto sm:w-[25%] shrink-0 relative z-10 pt-1">
            <div className="flex items-end gap-1 mb-1 sm:mb-1.5">
              <span className="text-sm sm:text-lg font-black italic tracking-tighter leading-none text-[#38BDF8] drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]">₹{goal.currentProgress.toLocaleString()}</span>
              <span className="text-[8px] sm:text-[10px] text-slate-500 font-bold mb-0.5 leading-none">/ {goal.targetAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-sm bg-[#0EA5E9]/20 border-l-2 border-[#38BDF8]">
              <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest leading-none text-white">RADS: {percentage.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // 13. DEFAULT STYLE: MODERN CYBER PILL
  // ==========================================
  return (
    <motion.div
      initial={{ opacity: 0, y: -40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative w-full max-w-[760px] h-[84px] group mx-auto"
    >
      <div className={`absolute -inset-1.5 rounded-full blur-xl opacity-40 transition-colors duration-1000 animate-pulse ${isComplete ? 'bg-amber-500' : 'bg-indigo-600'}`} />
      <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.02)] flex items-center px-4 sm:px-6 gap-3 sm:gap-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[scan_4s_ease-in-out_infinite]" />
        <div className="flex items-center gap-2 sm:gap-4 w-auto sm:w-[30%] shrink-0 relative z-10">
          <div className="relative w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
            <div className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-1000 animate-[spin_4s_linear_infinite] ${isComplete ? 'border-amber-500/50' : 'border-indigo-500/50'}`} />
            <div className={`absolute inset-1 rounded-full border-t-2 transition-colors duration-1000 animate-[spin_2s_linear_infinite_reverse] ${isComplete ? 'border-amber-400' : 'border-purple-500'}`} />
            {isComplete ? (<Trophy className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />) : tier === 'legend' ? (<Crown className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-400" />) : (<Target className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />)}
          </div>
          <div className="flex flex-col min-w-0 justify-center h-full pt-1">
            <p className={`text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-none mb-1 sm:mb-1.5 transition-colors duration-1000 ${isComplete ? 'text-amber-400' : 'text-indigo-400'}`}>{isComplete ? 'Objective Complete' : 'Network Mission'}</p>
            <h2 className="text-white text-[10px] sm:text-sm font-black italic uppercase tracking-tighter truncate leading-none drop-shadow-md">{goal.title}</h2>
          </div>
        </div>
        <div className="flex-1 relative h-3 bg-[#000000] rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,1)] border border-white/5 flex items-center">
          <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1.5, ease: "circOut" }} className={`h-full relative rounded-full transition-colors duration-1000 ${isComplete ? 'bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.6)]' : 'bg-gradient-to-r from-indigo-600 via-cyan-400 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.6)]'}`}>
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
            <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center z-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              <lottie-player src={runnerUrl} background="transparent" speed="1" loop autoplay style={{ width: '100%', height: '100%' }}></lottie-player>
            </motion.div>
            {(tier === 'pro' || tier === 'legend') && !isComplete && (<div className="absolute right-0 h-full w-24 bg-gradient-to-l from-white/60 to-transparent blur-[2px] pointer-events-none rounded-r-full" />)}
            {!isComplete && <div className="absolute right-0 top-0 bottom-0 w-1.5 sm:w-2 rounded-full goal-spark opacity-0 transition-opacity duration-1000" style={{ opacity: percentage > 5 ? 1 : 0 }} />}
          </motion.div>
        </div>
        <div className="flex flex-col items-end justify-center w-auto sm:w-[25%] shrink-0 relative z-10 pt-1">
          <div className="flex items-end gap-1 mb-1 sm:mb-1.5">
            <motion.span key={goal.currentProgress} initial={{ scale: 1.2, color: isComplete ? '#fde68a' : '#c7d2fe' }} animate={{ scale: 1, color: '#ffffff' }} className="text-sm sm:text-lg font-black italic tracking-tighter leading-none drop-shadow-md">₹{goal.currentProgress.toLocaleString()}</motion.span>
            <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold mb-0.5 leading-none">/ {goal.targetAmount.toLocaleString()}</span>
          </div>
          <div className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md border backdrop-blur-md transition-colors duration-1000 ${isComplete ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'}`}>
            {isComplete ? (<Sparkles className="w-2.5 h-2.5 sm:w-3 h-3 text-amber-400 animate-pulse" />) : (<Crosshair className="w-2.5 h-2.5 sm:w-3 h-3 text-indigo-400 animate-[spin_3s_linear_infinite]" />)}
            <span className={`text-[7px] sm:text-[9px] font-black uppercase tracking-widest leading-none ${isComplete ? 'text-amber-400' : 'text-indigo-300'}`}>{percentage.toFixed(0)}% Synced</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CyberGoalBar;
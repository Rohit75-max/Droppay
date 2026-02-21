import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Trophy, Sparkles, Crosshair, Crown } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player'; 
import axios from 'axios';
import io from 'socket.io-client';

// GLOBAL RUNNER PROTOCOL
const runnerMap = {
  star: 'https://lottie.host/246e382d-1144-48f1-8fbd-7ebc24f2b1d3/gYtH5RkIfL.json',
  car: 'https://lottie.host/23c683ee-c0a4-443b-ab5e-b9b596255d64/vN43wP2rRk.json',
  rocket: 'https://lottie.host/b0dc5e70-2216-43dd-b883-fa4c038d1033/D1d51tK2rO.json',
  fire: 'https://lottie.host/c02f7415-3733-4f51-b8ef-f15599026402/1A5Xz2P99Q.json'
};

const GoalOverlay = () => {
  const { streamerId } = useParams();
  const [goal, setGoal] = useState({ title: "Establishing Uplink...", currentProgress: 0, targetAmount: 100 });
  const [tier, setTier] = useState('starter');
  const [runnerUrl, setRunnerUrl] = useState(runnerMap.star); 
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/payment/goal/${streamerId}`);
        const data = res.data;
        const settings = data.goalSettings || data.goal || data;
        
        setGoal({
          title: settings.title || "Active Objective",
          currentProgress: settings.currentProgress || 0,
          targetAmount: settings.targetAmount || 100
        });
        
        setTier(data.tier || 'starter');
        setIsActive(settings.isActive ?? true);
        
        const rType = settings.runnerType || 'star';
        if (rType === 'custom' && settings.customRunnerUrl) {
          setRunnerUrl(settings.customRunnerUrl);
        } else {
          setRunnerUrl(runnerMap[rType] || runnerMap.star);
        }
      } catch (err) {
        console.error("Overlay Sync Failed", err);
      }
    };

    fetchInitialData();

    const socket = io('http://localhost:5001');
    socket.emit('join-room', streamerId); 

    socket.on('goal-update', (updatedGoal) => {
      if (updatedGoal.runnerType) {
         const newUrl = updatedGoal.runnerType === 'custom' 
            ? updatedGoal.customRunnerUrl 
            : (runnerMap[updatedGoal.runnerType] || runnerMap.star);
         setRunnerUrl(newUrl);
      }
      setGoal(updatedGoal);
      if (updatedGoal.isActive !== undefined) setIsActive(updatedGoal.isActive);
    });

    return () => socket.disconnect();
  }, [streamerId]);

  const percentage = Math.min((goal.currentProgress / goal.targetAmount) * 100, 100);
  const isComplete = percentage >= 100;

  if (!isActive) return null;

  return (
    <div className="w-screen h-screen flex items-start justify-center bg-transparent pointer-events-none p-8 font-sans">
      
      {/* THE CYBER-GLASS HUD CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative w-[760px] h-[84px] group"
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
              {/* Spinning Cyber Ring */}
              <div className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-1000 animate-[spin_4s_linear_infinite] ${isComplete ? 'border-amber-500/50' : 'border-indigo-500/50'}`} />
              <div className={`absolute inset-1 rounded-full border-t-2 transition-colors duration-1000 animate-[spin_2s_linear_infinite_reverse] ${isComplete ? 'border-amber-400' : 'border-purple-500'}`} />
              
              {/* Core Icon */}
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
              
              {/* THE LOTTIE RUNNER (Sits on the tip) */}
              <motion.div 
                animate={{ y: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center z-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              >
                <Player
                  key={runnerUrl} 
                  autoplay
                  loop
                  src={runnerUrl}
                  style={{ height: '100%', width: '100%' }}
                />
              </motion.div>

              {/* Engine Exhaust Trail */}
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

      {/* GLOBAL KEYFRAMES FOR GLASS SWEEP */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan { 
          0% { transform: translateX(-100%) skewX(-15deg); } 
          50% { transform: translateX(200%) skewX(-15deg); } 
          100% { transform: translateX(200%) skewX(-15deg); } 
        }
      `}} />
    </div>
  );
};

export default GoalOverlay;
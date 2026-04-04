"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowUpRight, Activity } from 'lucide-react';

export const StreamEngineDemo = () => {
  const [state, setState] = useState('idle'); // idle -> intro -> alert -> payout

  useEffect(() => {
    // Phase 1: Intro — slide in $50 notification from the right after 1.2s
    const introTimer = setTimeout(() => setState('intro'), 1200);

    // Phase 2: Hand off to the repeating VSM cycle after 4.5s
    const cycleStart = setTimeout(() => {
      const timer = setInterval(() => {
        setState(prev => {
          if (prev === 'idle' || prev === 'intro') return 'alert';
          if (prev === 'alert') return 'payout';
          return 'idle';
        });
      }, 3500);
      return () => clearInterval(timer);
    }, 4500);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(cycleStart);
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl bg-[#0A0A0A] group">
      {/* 1. THE "STREAM" BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80" 
          alt="Live Stream"
          className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
        
        {/* HUD Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">LIVE // 4.2k VIEWERS</span>
        </div>
      </div>

      {/* 2. THE VISUAL STATE MACHINE LAYERS */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          {state === 'alert' && (
            <motion.div
              key="alert"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_0_50px_rgba(175,255,0,0.2)] flex flex-col items-center text-center max-w-[90%]"
            >
              <div className="w-8 h-8 md:w-12 md:h-12 bg-[#afff00] rounded-full flex items-center justify-center mb-2 md:mb-4 shadow-[0_0_20px_#afff00]">
                <Zap className="w-4 h-4 md:w-6 md:h-6 text-black" />
              </div>
              <h3 className="text-[#afff00] font-black text-[8px] md:text-xs uppercase tracking-[0.3em] mb-1">New Support!</h3>
              <p className="text-white font-black text-lg md:text-2xl uppercase tracking-tighter">ALEX tipped <span className="text-[#afff00]">$50</span></p>
              <p className="text-white/40 text-[8px] md:text-[10px] font-mono mt-1 md:mt-2 italic">"Absolute legend!"</p>
            </motion.div>
          )}

          {/* INTRO PHASE + PAYOUT PHASE — $50.00 slides from right */}
          {(state === 'intro' || state === 'payout') && (
            <motion.div
              key={state === 'intro' ? 'intro-payout' : 'payout'}
              initial={{ x: state === 'intro' ? 200 : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={state === 'intro'
                ? { type: 'spring', stiffness: 180, damping: 20, delay: 0 }
                : { type: 'spring', stiffness: 220, damping: 24 }
              }
              className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 bg-[#afff00] p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center justify-between shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 md:w-5 md:h-5 text-[#afff00]" />
                </div>
                <div>
                  <p className="text-black font-black text-[8px] md:text-xs uppercase tracking-tight leading-none">Balance Updated</p>
                  <p className="text-black/60 text-[7px] md:text-[10px] font-bold uppercase tracking-widest mt-0.5">Instant Withdrawal</p>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-black font-black text-base md:text-xl">$50.00</span>
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-black/40" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. TACTICAL BORDER DECOR */}
      <div className="absolute top-0 left-0 w-24 h-[1px] bg-white/20" />
      <div className="absolute top-0 left-0 w-[1px] h-24 bg-white/20" />
      <div className="absolute bottom-0 right-0 w-24 h-[1px] bg-white/20" />
      <div className="absolute bottom-0 right-0 w-[1px] h-24 bg-white/20" />
    </div>
  );
};

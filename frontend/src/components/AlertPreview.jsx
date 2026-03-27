import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Trophy, ShieldAlert, Crown, Heart, Leaf, Crosshair, Activity, Target, Star } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
// VITAL: Preserving your CDN helper
import { getOptimizedImage } from '../protocol/cdnHelper';
import PremiumAlertPreview from './PremiumAlertPreview'; // ADDED: Elite Alert Engine

const globalLottieMap = {
  zap: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json',
  cyber: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json',
  royal: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/lottie.json',
  hype_zap: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json',
  fire_rocket: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json',
  diamond_gem: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f48e/lottie.json',
  coins: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1fa99/lottie.json',
  super_heart: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/lottie.json'
};

/**
 * ALERT PREVIEW: The "Drope" Visual Engine
 * Optimized for multi-variant support and universal scaling.
 * NEW: Compact, tightened heights applied to all cards.
 */
const AlertPreview = React.memo(({
  donorName,
  amount,
  message,
  sticker,
  variant = 'zap',
  theme = 'dark',
  customAvatar,
  tier = 'starter',
  stylePreference = 'modern',
  hideSticker = false
}) => {

  const isComic = stylePreference === 'comic';
  const isPlayful = stylePreference === 'playful';
  const isPixel = stylePreference === 'pixel';
  const isKawaii = stylePreference === 'kawaii';
  const isCyberHud = stylePreference === 'cyberhud';
  const isBgmi = stylePreference === 'bgmi';
  const isGta = stylePreference === 'gta';
  const isCoc = stylePreference === 'coc';
  const isAvatar = stylePreference === 'avatar';
  const isGodzilla = stylePreference === 'godzilla';

  // Premium / Elite Styles Check
  const premiumAlertStyles = [
    'subway_dash', 'orbital_strike', 'loot_crate', 'neon_billboard', 'celestial_blessing',
    'gacha_pull', 'arcade_ko', 'paranormal_tape', 'holo_tcg', 'beat_drop', 'mainframe_breach',
    'dragon_hoard', 'casino_jackpot', 'mecha_assembly', 'hyperdrive_warp', 'dimensional_rift',
    'abyssal_kraken', 'pharaoh_tomb', 'cybernetic_brain', 'celestial_zodiac'
  ];
  const isPremiumAlert = premiumAlertStyles.includes(stylePreference);

  const isModern = !isComic && !isPlayful && !isPixel && !isKawaii && !isCyberHud && !isBgmi && !isGta && !isCoc && !isAvatar && !isGodzilla && !isPremiumAlert;

  // Intercept and Route to the Premium Alert Engine if an elite style is active
  if (isPremiumAlert) {
    return (
      <PremiumAlertPreview
        donorName={donorName}
        amount={amount}
        message={message}
        customAvatar={customAvatar}
        stylePreference={stylePreference}
        hideSticker={hideSticker}
      />
    );
  }

  const getVariantStyles = (activeTier, v) => {
    const isDark = theme === 'dark';

    // 1. YOUR ORIGINAL CONFIG (Kept 100% Intact)
    const modernConfig = {
      starter: { bg: isDark ? 'bg-emerald-950/90' : 'bg-emerald-50/95', border: 'border-emerald-500/40', text: 'text-emerald-500', glow: 'shadow-[0_0_60px_rgba(16,185,129,0.25)]', accentIcon: <Zap className="w-4 h-4" /> },
      pro: { bg: isDark ? 'bg-indigo-950/90' : 'bg-indigo-50/95', border: 'border-indigo-500/40', text: 'text-indigo-500', glow: 'shadow-[0_0_60px_rgba(99,102,241,0.25)]', accentIcon: <Sparkles className="w-4 h-4" /> },
      legend: { bg: isDark ? 'bg-amber-950/90' : 'bg-amber-50/95', border: 'border-amber-400', text: 'text-amber-500', glow: 'shadow-[0_0_60px_rgba(251,191,36,0.35)]', accentIcon: <Crown className="w-4 h-4" /> },
      secure: { bg: isDark ? 'bg-slate-900/90' : 'bg-slate-100/95', border: 'border-slate-500/40', text: 'text-slate-400', glow: 'shadow-[0_0_60px_rgba(100,116,139,0.25)]', accentIcon: <ShieldAlert className="w-4 h-4" /> }
    };

    const activeModern = modernConfig[activeTier?.toLowerCase()] || modernConfig.starter;

    // 2. STYLE OVERRIDES
    if (isComic) {
      return { bg: 'bg-[#FFDE00]', border: 'border-[6px] border-black', text: 'text-black', glow: 'shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]', accentIcon: <Zap className="w-4 h-4 fill-black" />, pattern: 'radial-gradient(black 1.5px, transparent 0)' };
    }
    if (isPlayful) {
      return { bg: 'bg-gradient-to-r from-[#FF5F6D] via-[#FFC371] to-[#FF5F6D] bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]', border: 'border-[4px] border-white', text: 'text-white', glow: 'shadow-2xl shadow-red-500/20', accentIcon: <Sparkles className="w-4 h-4 fill-yellow-300" /> };
    }
    if (isPixel) {
      return { bg: 'bg-[#5CACEE]', border: 'border-[8px] border-[#8B5A2B] outline outline-[4px] outline-black outline-offset-[-12px]', text: 'text-white font-mono uppercase', glow: 'shadow-[12px_12px_0px_0px_rgba(0,0,0,0.8)]', accentIcon: <span className="text-xl leading-none">🪙</span> };
    }
    if (isKawaii) {
      return { bg: 'bg-[#FFF0F3]', border: 'border-[4px] border-[#C26D7D]', text: 'text-[#C26D7D]', glow: 'shadow-[10px_10px_0px_0px_rgba(240,168,181,0.6)]', accentIcon: <Heart className="w-4 h-4 fill-current" />, pattern: 'linear-gradient(rgba(194,109,125,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(194,109,125,0.1) 1px, transparent 1px)' };
    }
    if (isCyberHud) {
      return { bg: 'bg-[#051008]', border: 'border-[2px] border-[#39ff14]', text: 'text-[#39ff14] font-mono uppercase tracking-widest', glow: 'shadow-[0_0_30px_rgba(57,255,20,0.3),inset_0_0_20px_rgba(57,255,20,0.1)]', accentIcon: <Activity className="w-5 h-5 animate-pulse text-[#39ff14]" />, pattern: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57,255,20,0.05) 2px, rgba(57,255,20,0.05) 4px)' };
    }
    if (isBgmi) {
      return { bg: 'bg-[#151716]', border: 'border-[3px] border-[#F97316]', text: 'text-[#F97316] font-mono uppercase tracking-widest', glow: 'shadow-[0_0_40px_rgba(249,115,22,0.3)]', accentIcon: <Target className="w-5 h-5 animate-pulse text-[#F97316]" />, pattern: 'repeating-linear-gradient(45deg, rgba(249, 115, 22, 0.05) 0px, rgba(249, 115, 22, 0.05) 2px, transparent 2px, transparent 8px)' };
    }
    if (isGta) {
      return { bg: 'bg-black/90 backdrop-blur-xl', border: 'border-[4px] border-[#FFD700]', text: 'text-[#FFD700] font-black uppercase tracking-tighter', glow: 'animate-[policeSiren_2s_infinite]', accentIcon: <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />, pattern: 'none' };
    }
    if (isCoc) {
      return { bg: 'bg-[#4A2E15]', border: 'border-[6px] border-[#FBBF24]', text: 'text-[#FBBF24] font-black uppercase tracking-wide', glow: 'shadow-[inset_0_0_30px_rgba(0,0,0,0.8),0_10px_20px_rgba(0,0,0,0.5)]', accentIcon: <Trophy className="w-5 h-5 fill-[#FBBF24] text-[#854D0E]" />, pattern: 'none' };
    }
    if (isAvatar) {
      return { bg: 'bg-[#040D14]', border: 'border-[2px] border-[#06B6D4]', text: 'text-[#22D3EE] font-medium tracking-widest', glow: 'shadow-[0_0_40px_rgba(6,182,212,0.4),inset_0_0_20px_rgba(6,182,212,0.2)]', accentIcon: <Leaf className="w-5 h-5 text-[#22D3EE] animate-pulse" />, pattern: 'none' };
    }
    if (isGodzilla) {
      return { bg: 'bg-[#000000]', border: 'border-[4px] border-[#0EA5E9]', text: 'text-[#38BDF8] font-black uppercase tracking-tighter', glow: 'shadow-[0_0_50px_rgba(14,165,233,0.6)]', accentIcon: <Activity className="w-6 h-6 text-[#38BDF8] animate-pulse" />, pattern: 'none' };
    }

    return activeModern;
  };

  const s = getVariantStyles(tier, variant);
  const lottieUrl = sticker?.startsWith('http') ? sticker : (sticker ? (globalLottieMap[sticker] || globalLottieMap.hype_zap) : globalLottieMap[variant]);

  const pixelTextShadow = "[text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000,3px_3px_0_#000,0_4px_0_#000]";
  const gtaTextShadow = "[text-shadow:2px_2px_0_#000,4px_4px_0_rgba(0,0,0,0.5)]";
  const cocTextShadow = "[text-shadow:2px_2px_0_#451A03,0_4px_0_#451A03]";
  const avatarTextShadow = "[text-shadow:0_0_15px_#06B6D4]";
  const godzillaTextShadow = "[text-shadow:0_0_20px_#0EA5E9,0_0_5px_#0EA5E9]";

  return (
    <div className="relative flex flex-col sm:flex-row items-center justify-between w-full mx-auto py-6 group gap-4 px-4 sm:px-8">

      {/* GLOBAL KEYFRAMES */}
      <style>{`
        @keyframes gradient { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        @keyframes radar { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes policeSiren { 0%, 100% { box-shadow: 0 0 30px rgba(255,0,0,0.4), inset 0 0 20px rgba(255,0,0,0.2); border-color: #ef4444; } 50% { box-shadow: 0 0 30px rgba(59,130,246,0.5), inset 0 0 20px rgba(59,130,246,0.3); border-color: #3b82f6; } }
        @keyframes atomicBreath { 0% { background-position: 100% 50%; opacity: 0.3; } 50% { opacity: 0.7; } 100% { background-position: 0% 50%; opacity: 0.3; } }
      `}</style>

      {/* 1. KINETIC LOTTIE NODE */}
      {!hideSticker && (
        <motion.div
          animate={{ y: [-10, 10, -10], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-24 h-24 sm:w-28 sm:h-28 z-20 mb-[-30px] drop-shadow-2xl"
        >
          <Player autoplay loop src={lottieUrl} style={{ height: '100%', width: '100%' }} />
        </motion.div>
      )}

      {/* 2. MAIN ALERT BODY (HEIGHT FIXED & MODERN LAYOUT RESTORED) */}
      <div
        className={`relative z-10 w-full transition-all duration-500 min-h-[130px] sm:min-h-[150px] flex justify-between ${isPixel || isBgmi || isGta || isGodzilla || isAvatar || isCoc ? 'overflow-hidden' : ''}
          ${isModern ? 'flex-row border-2 backdrop-blur-3xl rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 sm:px-8 items-center gap-4 sm:gap-6 w-full max-w-none' : 'flex-col justify-center items-center max-w-md mx-auto w-full'}
          ${isComic ? 'rounded-none rotate-[-1deg] p-6 text-center mt-4' : ''}
          ${isPlayful ? 'rounded-[2.5rem] p-6 text-center mt-4' : ''}
          ${isPixel ? 'rounded-none p-6 text-left mt-4' : ''}
          ${isKawaii ? 'rounded-[2rem] p-0 mt-4 overflow-visible' : ''}
          ${isCyberHud ? 'rounded-none p-6 text-center mt-4 overflow-hidden relative' : ''}
          ${isBgmi ? 'rounded-lg p-6 text-left mt-4' : ''}
          ${isGta ? 'rounded-xl px-6 pb-6 pt-14 text-left mt-4' : ''}
          ${isCoc ? 'rounded-xl p-6 text-center mt-4' : ''}
          ${isAvatar ? 'rounded-[3rem] p-6 text-center mt-4' : ''}
          ${isGodzilla ? 'rounded-none p-6 text-center mt-4 border-x-0' : ''}
          ${s.bg} ${s.border} ${s.glow}`}
        style={{
          ...(isComic && { backgroundImage: s.pattern, backgroundSize: '14px 14px' }),
          ...(isKawaii && { backgroundImage: s.pattern, backgroundSize: '12px 12px' }),
          ...(isCyberHud && { clipPath: 'polygon(5% 0, 95% 0, 100% 20%, 100% 80%, 95% 100%, 5% 100%, 0 80%, 0 20%)', backgroundImage: s.pattern }),
          ...(isBgmi && { backgroundImage: s.pattern })
        }}
      >

        {/* --- EXISTING OVERLAYS (BGMI, GTA, CYBERHUD, KAWAII, PIXEL) --- */}
        {isBgmi && (
          <>
            <div className="absolute top-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#F97316,#F97316_10px,#000_10px,#000_20px)] border-b-2 border-[#F97316]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-0">
              <div className="w-64 h-64 rounded-full border border-[#F97316] flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-[#F97316]/50" />
                <div className="absolute w-full h-[1px] bg-[#F97316]" />
                <div className="absolute h-full w-[1px] bg-[#F97316]" />
                <div className="absolute w-1/2 h-1/2 origin-bottom-right bg-gradient-to-tr from-[#F97316]/40 to-transparent animate-[radar_3s_linear_infinite]" />
              </div>
            </div>
            <div className="absolute bottom-2 left-4 text-[8px] font-mono text-[#F97316]/60">ZONE: SAFE</div>
            <div className="absolute bottom-2 right-4 text-[8px] font-mono text-[#F97316]/60">ALIVE: 1</div>
          </>
        )}

        {isGta && (
          <div className="absolute top-4 w-full flex justify-center gap-1 z-10">
            {[1, 2, 3, 4, 5].map((star, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.2, type: "spring", stiffness: 300 }}>
                <Star className="w-7 h-7 fill-[#FFD700] text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
              </motion.div>
            ))}
          </div>
        )}

        {isCyberHud && (
          <>
            <div className="absolute inset-0 w-full h-[10%] bg-gradient-to-b from-transparent via-[#39ff14]/20 to-transparent animate-[scanline_3s_linear_infinite] pointer-events-none z-0" />
            <div className="absolute top-0 left-10 w-16 h-1 bg-[#39ff14]" />
            <div className="absolute bottom-0 right-10 w-24 h-1 bg-[#39ff14]" />
            <Crosshair className="absolute top-4 left-4 w-6 h-6 text-[#39ff14]/50 animate-pulse" />
            <Crosshair className="absolute bottom-4 right-4 w-6 h-6 text-[#39ff14]/50 animate-pulse" />
            <div className="absolute top-2 right-6 text-[8px] text-[#39ff14]/70 font-mono text-right flex flex-col">
              <span>SYS.SEC // OK</span>
              <span>NODE: ACTIVE</span>
            </div>
          </>
        )}

        {isKawaii && (
          <>
            <div className="w-full bg-[#F0A8B5] px-5 py-3 flex items-center justify-between border-b-[4px] border-[#C26D7D] rounded-t-[1.75rem]">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#C26D7D]" />
                <span className="text-[#C26D7D] font-black text-sm tracking-widest lowercase">new transmission...</span>
              </div>
              <div className="flex gap-1.5"><div className="w-4 h-4 rounded-full border-[3px] border-white" /><div className="w-6 h-4 rounded-full border-[3px] border-white" /></div>
            </div>
            <motion.div animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} className="absolute -top-6 -right-6 z-50">
              <Heart className="w-10 h-10 text-[#C26D7D] fill-[#F0A8B5]" strokeWidth={2.5} />
            </motion.div>
            <motion.div animate={{ y: [0, -6, 0], rotate: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-6 -left-8 z-50">
              <Heart className="w-8 h-8 text-[#C26D7D] fill-[#F0A8B5]" strokeWidth={2.5} />
            </motion.div>
            <Leaf className="absolute bottom-2 left-3 w-8 h-8 text-[#C26D7D] fill-[#A8E6CF] -rotate-45" strokeWidth={2} />
            <Leaf className="absolute bottom-2 right-3 w-8 h-8 text-[#C26D7D] fill-[#A8E6CF] rotate-45 transform scale-x-[-1]" strokeWidth={2} />
            <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-10 bg-[#F0A8B5] border-[3px] border-[#C26D7D] rounded-lg rounded-tr-none flex items-end justify-center pb-1"><div className="absolute -top-3 right-0 w-6 h-4 bg-[#F0A8B5] border-[3px] border-b-0 border-[#C26D7D] rounded-t-md" /><div className="w-4 h-1.5 bg-white rounded-full border border-[#C26D7D]" /></div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#F0A8B5] border-[4px] border-[#C26D7D] rotate-45 rounded-lg flex items-center justify-center z-50 shadow-md"><Heart className="w-4 h-4 text-white fill-white -rotate-45" /></div>
          </>
        )}

        {isPixel && (
          <div className="absolute inset-0 pointer-events-none -z-10 bg-[#5CACEE]">
            <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="absolute top-6 right-8 w-14 h-14 bg-[#FFEB3B] border-[4px] border-black" />
            <motion.div animate={{ x: [-150, 500] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="absolute top-10 left-0 opacity-80">
              <div className="w-20 h-10 bg-white border-[4px] border-black" />
              <div className="absolute top-[-12px] left-[-15px] w-12 h-8 bg-white border-[4px] border-black border-b-0" />
            </motion.div>
            <motion.div animate={{ x: [-100, 500] }} transition={{ repeat: Infinity, duration: 12, ease: "linear", delay: 2 }} className="absolute top-24 left-0 scale-75 opacity-90">
              <div className="w-16 h-8 bg-white border-[3px] border-black" />
              <div className="absolute top-[-10px] left-[20px] w-10 h-6 bg-white border-[3px] border-black border-b-0" />
            </motion.div>
            <div className="absolute bottom-0 left-0 w-full h-12 bg-[#4CAF50] border-t-[4px] border-black flex items-start overflow-hidden">
              <div className="w-full h-4 bg-[#388E3C] border-b-[4px] border-black/20" />
            </div>
          </div>
        )}

        {/* --- NEW OVERLAYS (COC, AVATAR, GODZILLA) --- */}
        {isCoc && (
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Wooden Texture Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
            {/* Floating Elixir Drops */}
            {[1, 2, 3].map((i) => (
              <motion.div key={i} animate={{ y: [-10, -40], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 + i, delay: i * 0.5 }} className="absolute bottom-4 left-1/4 w-3 h-3 bg-purple-500 rounded-full blur-[2px] shadow-[0_0_10px_#a855f7]" style={{ left: `${20 * i}%` }} />
            ))}
          </div>
        )}

        {isAvatar && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Drifting Wood Sprites */}
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div key={i} animate={{ y: ['100%', '-100%'], x: Math.sin(i) * 20, opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 4 + i, ease: "linear" }} className="absolute bottom-0 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_#22d3ee,0_0_5px_white]" style={{ left: `${15 * i + 10}%` }} />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#06b6d4]/10 to-transparent" />
          </div>
        )}

        {isGodzilla && (
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Atomic Breath Gradient Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0EA5E9]/40 to-transparent bg-[length:200%_100%] animate-[atomicBreath_3s_linear_infinite]" />
            <div className="absolute bottom-0 w-full h-2 bg-[#0EA5E9] shadow-[0_0_20px_#0EA5E9]" />
          </div>
        )}

        {/* COMIC/PLAYFUL FLOATING AMOUNT BADGE */}
        {(isComic || isPlayful) && (
          <motion.div
            animate={isPlayful ? { y: [-4, 4, -4], rotate: [2, 0, 2] } : {}}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className={`absolute -top-6 -left-4 sm:-left-8 px-6 py-2 z-50
            ${isComic ? 'bg-cyan-400 border-[4px] border-black -rotate-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : ''}
            ${isPlayful ? 'bg-[#6366F1] border-[3px] border-white rounded-full shadow-lg -rotate-3' : ''}
          `}>
            <span className={`text-2xl sm:text-3xl font-[1000] italic tracking-tighter ${isComic ? 'text-black' : 'text-white'}`}>
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </motion.div>
        )}

        {/* OPTIMIZED AVATAR (Restored for Modern) */}
        {customAvatar && !isPixel && !isCyberHud && !isBgmi && !isGta && !isGodzilla && !isCoc && !isAvatar && (
          <div className={`shrink-0 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-110
            ${isModern ? 'w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border border-white/10' : ''}
            ${isComic ? 'w-16 h-16 mb-2 border-[4px] border-black rounded-none rotate-3' : ''}
            ${isPlayful ? 'w-16 h-16 mb-2 border-4 border-white rounded-full' : ''}
            ${isKawaii ? 'w-14 h-14 mt-4 mb-2 border-[3px] border-[#C26D7D] rounded-full z-10' : ''}
          `}>
            <img src={getOptimizedImage(customAvatar, 200)} alt="Donor" className="w-full h-full object-cover" />
          </div>
        )}

        {/* TEXT CONTENT CONTAINER */}
        <motion.div
          animate={isGodzilla ? { x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 1, 0] } : {}}
          transition={isGodzilla ? { repeat: Infinity, duration: 1.5, ease: "linear" } : {}}
          className={`flex-1 min-w-0 z-10 w-full ${(!isModern && !isCyberHud && !isBgmi && !isPixel && !isGta && !isGodzilla && !isCoc && !isAvatar) ? 'flex flex-col items-center justify-center text-center' : 'text-left'} ${isKawaii ? 'p-6 pt-2 pb-10' : ''} ${isCoc || isAvatar || isGodzilla ? 'text-center flex flex-col items-center' : ''}`}
        >

          {isModern && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 w-full gap-2">
              <h4 className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] ${s.text}`}>
                {variant === 'royal' ? 'Legendary Alert' : 'New Alert'}
              </h4>
              {/* Move badge to absolute right if needed, or rely on justify-between above - going with absolute for true corner positioning as requested */}
            </div>
          )}

          {isCyberHud && (
            <div className="flex justify-between items-center w-full mb-3 border-b-2 border-[#39ff14]/30 pb-2 relative z-40">
              <span className={`text-[10px] sm:text-xs ${s.text} flex items-center gap-2`}><ShieldAlert className="w-3 h-3" /> SECURE PAYMENT RECEIVED</span>
              <span className={`text-lg sm:text-xl font-black ${s.text} bg-[#39ff14]/10 px-2 py-0.5`}>₹{amount.toLocaleString('en-IN')}</span>
            </div>
          )}

          {isBgmi && (
            <div className="flex justify-between items-center w-full mb-3 border-b-2 border-[#F97316]/50 pb-2 relative z-40">
              <span className={`text-[10px] sm:text-xs ${s.text} flex items-center gap-2 bg-[#F97316]/20 px-2 py-1`}><Target className="w-3 h-3" /> AIRDROP SECURED</span>
              <span className={`text-lg sm:text-xl font-black ${s.text}`}>₹{amount.toLocaleString('en-IN')}</span>
            </div>
          )}

          {isCoc && (
            <div className="mb-2 relative z-40 flex flex-col items-center justify-center">
              <span className={`text-[10px] sm:text-sm ${s.text} ${cocTextShadow} mb-1`}><Trophy className="w-3 h-3 sm:w-4 sm:h-4 inline-block mb-1" /> RAID SUCCESSFUL!</span>
              <span className={`text-xl sm:text-3xl font-black ${s.text} ${cocTextShadow} bg-[#FBBF24]/20 px-3 py-1 rounded-sm border-y-2 border-[#FBBF24]`}>LOOT: ₹{amount.toLocaleString('en-IN')}</span>
            </div>
          )}

          {isAvatar && (
            <div className="mb-2 relative z-40 flex flex-col items-center justify-center">
              <span className={`text-[10px] sm:text-xs tracking-[0.3em] ${s.text} ${avatarTextShadow} opacity-80 mb-1 sm:mb-2`}>TSAHÌK BLESSING</span>
              <span className={`text-3xl sm:text-4xl font-light ${s.text} ${avatarTextShadow}`}>₹{amount.toLocaleString('en-IN')}</span>
            </div>
          )}

          {isGodzilla && (
            <div className="mb-2 relative z-40 flex flex-col items-center justify-center">
              <span className={`text-[10px] sm:text-xs font-black bg-red-600 text-white px-2 py-0.5 mb-1 sm:mb-2 animate-pulse`}>WARNING: TITAN DETECTED</span>
              <span className={`text-2xl sm:text-4xl font-black italic ${s.text} ${godzillaTextShadow}`}>RADIATION: ₹{amount.toLocaleString('en-IN')}</span>
            </div>
          )}

          {isGta && (
            <div className="flex justify-between items-center w-full mb-3 border-b-2 border-[#FFD700]/50 pb-2 relative z-40">
              <span className={`text-[10px] sm:text-xs ${s.text} flex items-center gap-2 bg-[#FFD700]/20 px-2 py-1 rounded`}><Star className="w-3 h-3 fill-[#FFD700]" /> MISSION PASSED</span>
              <span className={`text-lg sm:text-xl font-black ${s.text} ${gtaTextShadow}`}>RESPECT +{amount.toLocaleString('en-IN')}</span>
            </div>
          )}

          {isPixel && (
            <div className="flex justify-between items-center w-full mb-3 border-b-[3px] border-black pb-2 relative z-40 bg-white/10 px-2 py-1">
              <span className={`text-[10px] sm:text-xs ${s.text} flex items-center gap-1.5 bg-[#FFDE00] text-black px-2 py-1 border-2 border-black`}><Heart className="w-3 h-3 fill-red-500 text-black stroke-[2px]" /> LVL UP+</span>
              <span className={`text-lg sm:text-xl font-black ${s.text} tracking-widest ${pixelTextShadow}`}>₹{amount.toLocaleString('en-IN')}</span>
            </div>
          )}

          {isKawaii && (
            <div className={`flex items-center gap-2 bg-white border-[3px] border-[#C26D7D] px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-2 shadow-sm ${!customAvatar ? 'mt-4' : ''}`}>
              {s.accentIcon} <span className="text-lg sm:text-xl font-black tracking-tighter text-[#C26D7D]">₹{amount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <h2 className={`font-black truncate leading-tight z-10 relative
            ${isModern ? `text-lg italic uppercase sm:text-2xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'}` : ''}
            ${(isComic || isPlayful) ? 'text-3xl sm:text-4xl uppercase tracking-tighter italic' : ''}
            ${isComic ? 'text-black drop-shadow-[3px_3px_0px_white]' : ''}
            ${isPlayful ? 'text-white drop-shadow-md' : ''}
            ${isPixel ? `text-lg sm:text-xl mt-2 uppercase tracking-widest ${s.text} ${pixelTextShadow}` : ''}
            ${isKawaii ? 'text-xl sm:text-2xl lowercase tracking-wider text-[#C26D7D] bg-white/60 px-3 rounded-xl' : ''}
            ${isCyberHud ? `text-2xl sm:text-3xl ${s.text} mt-2` : ''}
            ${isBgmi ? `text-2xl sm:text-3xl ${s.text} mt-2` : ''}
            ${isGta ? `text-xl sm:text-2xl text-white mt-2 font-bold drop-shadow-md` : ''}
            ${isCoc ? `text-xl sm:text-2xl text-white mt-2 ${cocTextShadow}` : ''}
            ${isAvatar ? `text-xl sm:text-2xl text-white mt-2 ${avatarTextShadow}` : ''}
            ${isGodzilla ? `text-2xl sm:text-3xl text-white mt-2 italic ${godzillaTextShadow}` : ''}
          `}>
            {isPixel ? `From: ${donorName}` : (isBgmi ? `OP: ${donorName}` : isCoc ? `CHIEF ${donorName}` : isAvatar ? `MATE: ${donorName}` : isGodzilla ? `KAIJU: ${donorName}` : donorName)}
          </h2>

          {(isComic || isPlayful) && (
            <span className={`text-lg sm:text-xl font-black italic uppercase tracking-tighter block mb-1 sm:mb-2 ${isComic ? 'text-black' : 'text-white/90'}`}>
              {isComic ? 'JUST DONATED!' : 'SENT LOVE!'}
            </span>
          )}



          <p className={`line-clamp-2 mt-1 z-10 relative
            ${isModern ? `text-[10px] italic sm:text-xs font-medium opacity-70 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}` : ''}
            ${isComic ? 'text-[10px] sm:text-sm font-black bg-white px-2 py-0.5 border-2 border-black text-black italic inline-block' : ''}
            ${isPlayful ? 'text-[10px] sm:text-sm font-bold text-white/90 italic' : ''}
            ${isPixel ? `text-[10px] sm:text-xs mt-1 sm:mt-2 bg-black/60 px-2 py-1 border-2 border-white max-w-[90%] ${s.text}` : ''}
            ${isKawaii ? 'text-[10px] sm:text-sm font-bold text-[#A85165] mt-1' : ''}
            ${isCyberHud ? `text-[10px] sm:text-sm mt-2 border-l-2 border-[#39ff14] pl-2 sm:pl-3 ${s.text} opacity-80 font-mono` : ''}
            ${isBgmi ? `text-[10px] sm:text-sm mt-2 bg-black/50 p-1.5 sm:p-2 border-l-4 border-[#F97316] ${s.text}` : ''}
            ${isGta ? `text-[10px] sm:text-sm mt-1 sm:mt-2 font-bold text-white italic bg-black/60 px-3 py-1 sm:px-4 sm:py-2 rounded-lg border border-white/20` : ''}
            ${isCoc ? `text-[10px] sm:text-sm mt-1 sm:mt-2 font-bold text-white/90 italic bg-black/40 px-3 py-1 rounded border border-[#FBBF24]/50` : ''}
            ${isAvatar ? `text-xs sm:text-sm mt-1 sm:mt-2 text-[#22D3EE] italic opacity-90` : ''}
            ${isGodzilla ? `text-[10px] sm:text-sm mt-1 sm:mt-2 font-bold text-white italic bg-[#0EA5E9]/10 px-3 py-1 border-l-4 border-[#0EA5E9]` : ''}
          `}>
            "{isCyberHud ? `> NOTIFICATION: ${message || "Donation received."}` : (isBgmi ? `COMMS: ${message || "Donation received."}` : (message || "Sending donation..."))}"
          </p>

          {isPixel && (
            <div className="w-full h-3 sm:h-4 bg-black border-2 border-white mt-3 p-[2px] z-10 shadow-lg">
              <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full bg-[#FFDE00]" />
            </div>
          )}
        </motion.div>

        {isModern && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 pointer-events-none">
            <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl font-black italic text-sm sm:text-lg border flex items-center gap-2 shadow-xl transition-colors ${theme === 'dark' ? 'bg-black/40 backdrop-blur-md border-white/10 text-white' : 'bg-white/40 backdrop-blur-md border-black/10 text-black'}`}>
              {s.accentIcon} ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {isModern && (
          <div className="absolute -inset-2 pointer-events-none overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] w-full">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-full h-full relative">
              <Sparkles className={`absolute top-2 right-12 w-5 h-5 opacity-20 ${s.text}`} />
              <Trophy className={`absolute bottom-2 left-12 w-5 h-5 opacity-20 ${s.text}`} />
            </motion.div>
          </div>
        )}

        {(isComic || isPlayful) && (
          <>
            <motion.div animate={isPlayful ? { y: [-6, 6, -6], rotate: [-12, -20, -12] } : {}} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }} className="absolute -top-2 -right-4 z-40">
              <Zap className={`w-8 h-8 sm:w-10 sm:h-10 ${isComic ? 'fill-yellow-400 stroke-black stroke-2 -rotate-12' : 'fill-cyan-400 text-cyan-400'}`} />
            </motion.div>
            <motion.div animate={isPlayful ? { y: [6, -6, -6], rotate: [12, 20, 12] } : {}} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -bottom-4 -right-2 z-40">
              <Zap className={`w-6 h-6 sm:w-8 sm:h-8 ${isComic ? 'fill-orange-500 stroke-black stroke-2 rotate-12' : 'fill-yellow-300 text-yellow-300'}`} />
            </motion.div>
          </>
        )}
      </div>

      {isModern && (
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 blur-[40px] rounded-full -z-10 opacity-50 ${s.text.replace('text', 'bg')}`} />
      )}
    </div>
  );
});

export default AlertPreview;
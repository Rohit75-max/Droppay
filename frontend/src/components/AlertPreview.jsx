import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Trophy, ShieldAlert, Crown } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
// VITAL: Preserving your CDN helper
import { getOptimizedImage } from '../protocol/cdnHelper';

const globalLottieMap = {
  zap: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json',
  cyber: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json',
  royal: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/lottie.json',
  hype_zap: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json'
};

/**
 * ALERT PREVIEW: The "DropPay" Visual Engine
 * Optimized for multi-variant support and universal scaling.
 * Goal Bar removed (Moved to Features Page per roadmap).
 * NEW: Added stylePreference ('modern', 'comic', 'playful') natively.
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
  stylePreference = 'modern' // Safely defaults to your original design
}) => {

  const isComic = stylePreference === 'comic';
  const isPlayful = stylePreference === 'playful';
  const isModern = !isComic && !isPlayful;

  const getVariantStyles = (activeTier, v) => {
    const isDark = theme === 'dark';

    // 1. YOUR ORIGINAL CONFIG (Kept 100% Intact)
    const modernConfig = {
      starter: {
        bg: isDark ? 'bg-emerald-950/90' : 'bg-emerald-50/95',
        border: 'border-emerald-500/40',
        text: 'text-emerald-500',
        glow: 'shadow-[0_0_60px_rgba(16,185,129,0.25)]',
        accentIcon: <Zap className="w-4 h-4" />
      },
      pro: {
        bg: isDark ? 'bg-indigo-950/90' : 'bg-indigo-50/95',
        border: 'border-indigo-500/40',
        text: 'text-indigo-500',
        glow: 'shadow-[0_0_60px_rgba(99,102,241,0.25)]',
        accentIcon: <Sparkles className="w-4 h-4" />
      },
      legend: {
        bg: isDark ? 'bg-amber-950/90' : 'bg-amber-50/95',
        border: 'border-amber-400',
        text: 'text-amber-500',
        glow: 'shadow-[0_0_60px_rgba(251,191,36,0.35)]',
        accentIcon: <Crown className="w-4 h-4" />
      },
      secure: {
        bg: isDark ? 'bg-slate-900/90' : 'bg-slate-100/95',
        border: 'border-slate-500/40',
        text: 'text-slate-400',
        glow: 'shadow-[0_0_60px_rgba(100,116,139,0.25)]',
        accentIcon: <ShieldAlert className="w-4 h-4" />
      }
    };

    const activeModern = modernConfig[activeTier?.toLowerCase()] || modernConfig.starter;

    // 2. NEW STYLE OVERRIDES (Only apply if selected)
    if (isComic) {
      return {
        bg: 'bg-[#FFDE00]',
        border: 'border-[6px] border-black',
        text: 'text-black',
        glow: 'shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]',
        accentIcon: <Zap className="w-4 h-4 fill-black" />,
        pattern: 'radial-gradient(black 1.5px, transparent 0)'
      };
    }

    if (isPlayful) {
      return {
        bg: 'bg-gradient-to-r from-[#FF5F6D] to-[#FFC371]',
        border: 'border-[4px] border-white',
        text: 'text-white',
        glow: 'shadow-2xl shadow-red-500/20',
        accentIcon: <Sparkles className="w-4 h-4 fill-yellow-300" />
      };
    }

    return activeModern;
  };

  const s = getVariantStyles(tier, variant);

  // Phase 7 URL Pipeline: Interpret direct lottie.json links or fallback to local maps
  const lottieUrl = sticker?.startsWith('http')
    ? sticker
    : (sticker ? (globalLottieMap[sticker] || globalLottieMap.hype_zap) : globalLottieMap[variant]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-[95%] sm:max-w-md mx-auto py-6 group">

      {/* 1. KINETIC LOTTIE NODE (Preserved exactly as is) */}
      <motion.div
        animate={{ y: [-10, 10, -10], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="w-24 h-24 sm:w-32 sm:h-32 z-20 mb-[-30px] sm:mb-[-40px] drop-shadow-2xl"
      >
        <Player autoplay loop src={lottieUrl} style={{ height: '100%', width: '100%' }} />
      </motion.div>

      {/* 2. MAIN ALERT BODY (Classes adapt safely based on style) */}
      <div
        className={`relative z-10 w-full transition-all duration-500 
          ${isModern ? 'border-2 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 flex items-center gap-4 sm:gap-6' : ''}
          ${isComic ? 'rounded-none rotate-[-1deg] flex flex-col items-center p-8 text-center mt-4' : ''}
          ${isPlayful ? 'rounded-[2.5rem] flex flex-col items-center p-8 text-center mt-4' : ''}
          ${s.bg} ${s.border} ${s.glow}`}
        style={isComic ? { backgroundImage: s.pattern, backgroundSize: '14px 14px' } : {}}
      >

        {/* COMIC/PLAYFUL FLOATING AMOUNT BADGE */}
        {!isModern && (
          <div className={`absolute -top-6 px-6 py-2 z-40
            ${isComic ? 'bg-cyan-400 border-[4px] border-black -rotate-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : ''}
            ${isPlayful ? 'bg-[#6366F1] border-[3px] border-white rounded-full shadow-lg rotate-2' : ''}
          `}>
            <span className={`text-3xl font-[1000] italic tracking-tighter ${isComic ? 'text-black' : 'text-white'}`}>
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* OPTIMIZED AVATAR (Preserved exactly as is) */}
        {customAvatar && (
          <div className={`shrink-0 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-110
            ${isModern ? 'w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl border border-white/10' : 'w-20 h-20 mb-4'}
            ${isComic ? 'border-[4px] border-black rounded-none rotate-3' : ''}
            ${isPlayful ? 'border-4 border-white rounded-full' : ''}
          `}>
            <img
              src={getOptimizedImage(customAvatar, 200)}
              alt="Donor"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* TEXT CONTENT CONTAINER */}
        <div className={`flex-1 min-w-0 ${!isModern ? 'flex flex-col items-center' : ''}`}>

          {/* ORIGINAL MODERN HEADER ROW */}
          {isModern && (
            <div className="flex justify-between items-center mb-1.5 sm:mb-2">
              <h4 className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] ${s.text}`}>
                {variant === 'royal' ? 'Legendary Transmission' : 'New Transmission'}
              </h4>
              <span className={`px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-xl font-black italic text-xs sm:text-sm border flex items-center gap-2 transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/5 text-black'}`}>
                {s.accentIcon} ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {/* DONOR NAME */}
          <h2 className={`font-black italic uppercase truncate leading-tight 
            ${isModern ? `text-xl sm:text-3xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'}` : 'text-4xl tracking-tighter'}
            ${isComic ? 'text-black drop-shadow-[3px_3px_0px_white]' : ''}
            ${isPlayful ? 'text-white drop-shadow-md' : ''}
          `}>
            {donorName}
          </h2>

          {/* COMIC/PLAYFUL SUBTITLE OVERRIDE */}
          {!isModern && (
            <span className={`text-xl font-black italic uppercase tracking-tighter block mb-2 ${isComic ? 'text-black' : 'text-white/90'}`}>
              {isComic ? 'JUST DONATED!' : 'SENT LOVE!'}
            </span>
          )}

          {/* MESSAGE */}
          <p className={`italic line-clamp-2 mt-1
            ${isModern ? `text-[10px] sm:text-xs font-medium opacity-70 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}` : ''}
            ${isComic ? 'text-sm font-black bg-white px-3 border-2 border-black text-black' : ''}
            ${isPlayful ? 'text-sm font-bold text-white/90' : ''}
          `}>
            "{message || "Deploying support to the network..."}"
          </p>
        </div>

        {/* AMBIENT DECORATION (Preserved exactly, visible only in Modern) */}
        {isModern && (
          <div className="absolute -inset-2 pointer-events-none overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-full h-full relative"
            >
              <Sparkles className={`absolute top-2 right-12 w-5 h-5 opacity-20 ${s.text}`} />
              <Trophy className={`absolute bottom-2 left-12 w-5 h-5 opacity-20 ${s.text}`} />
            </motion.div>
          </div>
        )}

        {/* EXTRA DECORATION FOR COMIC/PLAYFUL */}
        {!isModern && (
          <>
            <Zap className={`absolute -top-2 -left-4 w-10 h-10 ${isComic ? 'fill-yellow-400 stroke-black stroke-2' : 'fill-cyan-400 text-cyan-400'} -rotate-12`} />
            <Zap className={`absolute -bottom-4 -right-2 w-8 h-8 ${isComic ? 'fill-orange-500 stroke-black stroke-2' : 'fill-yellow-300 text-yellow-300'} rotate-12`} />
          </>
        )}
      </div>

      {/* SUBTLE FLOOR GLOW (Preserved exactly, visible only in Modern) */}
      {isModern && (
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 blur-[40px] rounded-full -z-10 opacity-50 ${s.text.replace('text', 'bg')}`} />
      )}
    </div>
  );
});

export default AlertPreview;
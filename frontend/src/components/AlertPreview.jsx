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
 */
const AlertPreview = React.memo(({ 
  donorName, 
  amount, 
  message, 
  sticker, 
  variant = 'zap', 
  theme = 'dark',   
  customAvatar 
}) => {
  
  const getVariantStyles = (v) => {
    const isDark = theme === 'dark';
    
    const config = {
      zap: {
        bg: isDark ? 'bg-emerald-950/90' : 'bg-emerald-50/95',
        border: 'border-emerald-500/40',
        text: 'text-emerald-500',
        glow: 'shadow-[0_0_60px_rgba(16,185,129,0.25)]',
        accentIcon: <Zap className="w-4 h-4" />
      },
      cyber: {
        bg: isDark ? 'bg-[#064E3B]/90' : 'bg-emerald-100/95',
        border: 'border-emerald-400/40',
        text: 'text-emerald-400',
        glow: 'shadow-[0_0_60px_rgba(16,185,129,0.35)]',
        accentIcon: <ShieldAlert className="w-4 h-4" />
      },
      royal: {
        bg: isDark ? 'bg-amber-950/90' : 'bg-amber-50/95',
        border: 'border-amber-400',
        text: 'text-amber-500',
        glow: 'shadow-[0_0_60px_rgba(251,191,36,0.35)]',
        accentIcon: <Crown className="w-4 h-4" />
      }
    };

    return config[v] || config.zap;
  };

  const s = getVariantStyles(variant);
  // Use sticker if provided, otherwise fallback to variant-specific lottie
  const lottieUrl = sticker ? (globalLottieMap[sticker] || globalLottieMap.hype_zap) : globalLottieMap[variant];

  return (
    <div className="relative flex flex-col items-center w-full max-w-[95%] sm:max-w-md mx-auto py-6 group">
      
      {/* 1. KINETIC LOTTIE NODE */}
      <motion.div 
        animate={{ y: [-10, 10, -10], scale: [1, 1.05, 1] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
        className="w-24 h-24 sm:w-32 sm:h-32 z-20 mb-[-30px] sm:mb-[-40px] drop-shadow-2xl"
      >
        <Player autoplay loop src={lottieUrl} style={{ height: '100%', width: '100%' }} />
      </motion.div>

      {/* 2. MAIN ALERT BODY */}
      <div className={`relative z-10 w-full border-2 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 flex items-center gap-4 sm:gap-6 transition-all duration-500 ${s.bg} ${s.border} ${s.glow}`}>
        
        {/* OPTIMIZED AVATAR */}
        {customAvatar && (
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shrink-0 shadow-2xl">
            <img 
              src={getOptimizedImage(customAvatar, 200)} 
              alt="Donor" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1.5 sm:mb-2">
            <h4 className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] ${s.text}`}>
              {variant === 'royal' ? 'Legendary Transmission' : 'New Transmission'}
            </h4>
            <span className={`px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-xl font-black italic text-xs sm:text-sm border flex items-center gap-2 transition-colors ${
              theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/5 text-black'
            }`}>
              {s.accentIcon} ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
          
          <h2 className={`text-xl sm:text-3xl font-black italic uppercase truncate leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {donorName}
          </h2>
          
          <p className={`text-[10px] sm:text-xs italic font-medium opacity-70 line-clamp-2 mt-1 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            "{message || "Deploying support to the network..."}"
          </p>
        </div>

        {/* AMBIENT DECORATION */}
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
      </div>

      {/* SUBTLE FLOOR GLOW */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 blur-[40px] rounded-full -z-10 opacity-50 ${s.text.replace('text', 'bg')}`} />
    </div>
  );
});

export default AlertPreview;
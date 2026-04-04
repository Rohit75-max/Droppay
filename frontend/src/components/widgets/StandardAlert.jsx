import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Zap } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';

const LOTTIE_STICKER_MAP = {
    hype_zap: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json',
    fire_rocket: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json',
    super_heart: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/lottie.json',
    alien_visit: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f47d/lottie.json',
    driving_car: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f697/lottie.json',
    football_goal: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26bd/lottie.json',
    flying_bird: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f426/lottie.json',
    gold_trophy: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/lottie.json',
    diamond_gem: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f48e/lottie.json',
};

/**
 * StandardAlert: The "Free Tier" diagnostic pill.
 * Performance-optimized, holographic, and 1:1 with the dashboard's "Recent Drops" row.
 */
export const StandardAlert = ({ donorName, amount, message, sticker = 'hype_zap', isSandbox = false }) => {
    const lottieUrl = LOTTIE_STICKER_MAP[sticker] || LOTTIE_STICKER_MAP['hype_zap'];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className={`group/card relative overflow-hidden flex items-center justify-between px-6 py-3 rounded-2xl border transition-all duration-300 nexus-card w-[320px] ${isSandbox ? 'bg-transparent border-transparent' : 'bg-[#0A0A0A] border-white/10 hover:border-[#afff00]/60'}`}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#afff00]/0 via-[#afff00]/5 to-[#afff00]/0 -translate-x-full group-hover/card:animate-[shimmer_2s_infinite]" />
            
            {/* Accent Border */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#afff00] opacity-30 group-hover/card:opacity-100 transition-opacity" />

            <div className="flex items-center gap-4 relative z-10 w-full">
                <div className="flex-shrink-0 w-10 h-10 group-hover/card:scale-110 transition-transform flex items-center justify-center drop-shadow-[0_0_10px_rgba(175,255,0,0.2)]">
                    <Player
                        autoplay
                        loop
                        src={lottieUrl}
                        style={{ width: '40px', height: '40px' }}
                    />
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#afff00] truncate">
                            {donorName}
                        </span>
                        <div className="flex items-center gap-0.5 text-white font-mono font-black text-xs">
                            <IndianRupee className="w-3 h-3 text-[#afff00]" />
                            {amount}
                        </div>
                    </div>
                    {message && (
                        <p className="text-[10px] text-zinc-500 italic truncate mt-0.5 font-medium">
                            "{message}"
                        </p>
                    )}
                </div>

                <div className="flex-shrink-0 ml-2">
                    <Zap className="w-3 h-3 text-[#afff00] opacity-20 group-hover/card:opacity-100 transition-opacity animate-pulse" />
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </motion.div>
    );
};

export default StandardAlert;

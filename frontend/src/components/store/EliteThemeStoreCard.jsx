import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Play, CheckCircle2 } from 'lucide-react';

/**
 * ELITE THEME STORE CARD
 * A premium product card for the DropPay Store that previews live animations.
 */
const EliteThemeStoreCard = ({
    title = "Neon Overdrive",
    description = "Infinite 3D scrolling grid with pulsing synthwave sun.",
    price = "₹10,000",
    themeId = "live_synthwave",
    videoPreviewUrl = "https://cdn.pixabay.com/video/2023/10/22/185987-876805847_large.mp4", // Swap with actual preview MP4s
    isOwned = false,
    isActive = false,
    onUnlock = () => { },
    onEquip = () => { }
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -5 }}
            className={`relative w-full rounded-2xl p-1 overflow-hidden transition-all duration-300 ${isOwned ? 'bg-slate-800' : 'bg-gradient-to-b from-amber-500/50 to-amber-900/50 shadow-[0_10px_30px_rgba(245,158,11,0.2)]'}`}
        >
            {/* The Inner Card Content */}
            <div className="relative w-full h-full bg-[#0a0a0a] rounded-xl overflow-hidden flex flex-col z-10">

                {/* TOP: The Visual Preview Window */}
                <div className="relative w-full h-48 bg-black border-b border-slate-800 overflow-hidden flex items-center justify-center">

                    {/* Placeholder Image (Shows when not hovering) */}
                    <div className={`absolute inset-0 bg-slate-900 transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                        {/* You would put a static screenshot of the theme here */}
                        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,#1e293b_0%,#0f172a_100%)] flex items-center justify-center">
                            <Play className="w-12 h-12 text-white/20" />
                        </div>
                    </div>

                    {/* Auto-playing Video Preview (Fades in on hover) */}
                    <video
                        autoPlay loop muted playsInline
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <source src={videoPreviewUrl} type="video/mp4" />
                    </video>

                    {/* Premium Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm flex items-center gap-1 shadow-lg">
                            <Crown className="w-3 h-3" /> Elite Tier
                        </span>
                        <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm shadow-lg">
                            Live FX
                        </span>
                    </div>
                </div>

                {/* BOTTOM: Details & Buy Button */}
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-white font-black text-xl italic tracking-tight">{title}</h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed flex-1">
                        {description}
                    </p>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                        {/* Price or Ownership Status */}
                        <div>
                            {isOwned ? (
                                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" /> Purchased
                                </span>
                            ) : (
                                <span className="text-amber-400 font-mono font-black text-xl drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                                    {price}
                                </span>
                            )}
                        </div>

                        {/* Call to Action Button */}
                        {isOwned ? (
                            <button
                                onClick={onEquip}
                                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${isActive ? 'bg-slate-800 text-slate-400 cursor-default' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'}`}
                            >
                                {isActive ? 'Active' : 'Equip Theme'}
                            </button>
                        ) : (
                            <button
                                onClick={onUnlock}
                                className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest px-6 py-2 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105"
                            >
                                Unlock
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Glowing Border Animation (Runs behind the inner card) */}
            {!isOwned && (
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(245,158,11,1)_360deg)] animate-[spin_4s_linear_infinite] z-0" />
            )}
        </motion.div>
    );
};

export default EliteThemeStoreCard;
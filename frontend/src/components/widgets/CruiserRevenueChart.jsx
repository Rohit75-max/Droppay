import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Zap } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';

const CruiserRevenueChart = ({ chartData, theme = 'dark' }) => {
    const data = chartData && chartData.length > 0
        ? chartData.map((val, i) => ({ label: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i] || `D${i + 1}`, value: val }))
        : [
            { label: 'MON', value: 4500 },
            { label: 'TUE', value: 8200 },
            { label: 'WED', value: 3100 },
            { label: 'THU', value: 12500 },
            { label: 'FRI', value: 9800 },
            { label: 'SAT', value: 15400 },
            { label: 'SUN', value: 18900 },
        ];

    const maxValue = Math.max(...data.map(d => d.value)) || 1;
    const initialTotalRevenue = data.reduce((sum, d) => sum + d.value, 0);

    const [localRevenue] = useState(initialTotalRevenue);

    return (
        <div className="relative w-full h-[400px] overflow-hidden font-mono flex flex-col group rounded-2xl transition-all duration-1000 border bg-[var(--nexus-panel)] border-[var(--nexus-border)] shadow-[var(--nexus-glow)]">

            {/* --- TOP: HOLOGRAPHIC REVENUE CHART --- */}
            <div className="relative z-20 h-[55%] w-full p-6 flex flex-col justify-between transition-all duration-1000 bg-[var(--nexus-panel)] overflow-hidden">

                {/* Day/Night Celestial Bodies (Lottie Stickers) */}
                <AnimatePresence mode="wait">
                    {theme === 'light' && (
                        <motion.div
                            key="sun"
                            initial={{ y: 200, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 200, opacity: 0 }}
                            transition={{ duration: 1.5, type: 'spring' }}
                            className="absolute right-12 top-9 w-24 h-24 z-0 opacity-80 pointer-events-none"
                        >
                            <Player
                                autoplay
                                loop
                                src="https://lottie.host/6770281b-85f0-4573-b09e-ed8f63548972/0A6m0R7O9W.json"
                                style={{ height: '100%', width: '100%' }}
                            />
                            {/* Subtle Glow Underlying */}
                            <div className="absolute inset-0 bg-yellow-400/10 blur-[40px] rounded-full -z-10" />
                        </motion.div>
                    )}
                    {theme === 'dark' && (
                        <motion.div
                            key="moon"
                            initial={{ y: 200, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 200, opacity: 0 }}
                            transition={{ duration: 1.5, type: 'spring' }}
                            className="absolute right-12 top-9 w-20 h-20 z-0 opacity-40 pointer-events-none"
                        >
                            <Player
                                autoplay
                                loop
                                src="https://lottie.host/21156821-654a-4e20-80a5-f09c7359bb08/CByV9jCqR4.json"
                                style={{ height: '100%', width: '100%' }}
                            />
                            {/* Celestial Glow */}
                            <div className="absolute inset-0 bg-indigo-500/10 blur-[50px] rounded-full -z-10" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1 opacity-80 transition-all duration-1000 text-[var(--nexus-text-muted)]">
                            <Zap className="w-3 h-3 fill-[var(--nexus-accent)] text-[var(--nexus-accent)]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Cruiser Earnings Matrix</span>
                        </div>
                        <div className="flex items-center font-black text-4xl tracking-tighter transition-all duration-1000 text-[var(--nexus-text)]">
                            <IndianRupee className="w-6 h-6 mr-1 text-[var(--nexus-accent)]" />
                            <motion.span
                                key={localRevenue}
                                initial={{ scale: 1.5, color: 'var(--nexus-accent)' }}
                                animate={{ scale: 1, color: 'var(--nexus-text)' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                            >
                                {localRevenue.toLocaleString()}
                            </motion.span>
                        </div>
                    </div>
                </div>

                {/* The Chart Bars */}
                <div className="flex-1 flex items-end justify-between gap-3 px-2 z-10 relative">
                    {data.map((item, index) => {
                        const heightPercentage = (item.value / maxValue) * 100;
                        return (
                            <div key={item.label} className="flex flex-col items-center flex-1 h-full justify-end">
                                <div className="w-full rounded-t-sm flex justify-center items-end h-[85%] relative overflow-hidden backdrop-blur-sm transition-all duration-1000 border-b bg-[var(--nexus-bg)]/50 border-[var(--nexus-border)]">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${heightPercentage}%` }}
                                        transition={{ duration: 1.5, delay: index * 0.1, type: "spring", stiffness: 50 }}
                                        className="w-full relative transition-all duration-1000 bg-gradient-to-t from-[var(--nexus-accent)]/20 via-[var(--nexus-accent)]/60 to-[var(--nexus-accent)] shadow-[0_0_20px_rgba(0,0,0,0.2)]"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/40 drop-shadow-[0_0_5px_white]" />
                                    </motion.div>
                                </div>
                                <span className="text-[8px] font-black mt-3 tracking-[0.2em] transition-all duration-1000 text-[var(--nexus-text-muted)]">{item.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- BOTTOM: SIDE-SCROLLING ROAD & CAR --- */}
            <div className={`relative z-10 flex-1 w-full overflow-hidden transition-colors duration-1000 ${theme === 'light' ? 'bg-gradient-to-b from-sky-400 via-indigo-200 to-slate-800' : 'bg-[#020205]'}`}>

                {/* Re-engineered Modern City Skyline (More Variety & Active Windows) */}
                <div className="absolute inset-x-0 bottom-6 h-32 opacity-25 pointer-events-none overflow-hidden z-0">
                    <motion.div
                        animate={{ x: [0, -600] }}
                        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                        className="flex gap-2 w-[300%]"
                    >
                        {[...Array(15)].map((_, i) => {
                            const heights = ['h-24', 'h-28', 'h-16', 'h-32', 'h-20'];
                            const widths = ['w-12', 'w-16', 'w-10', 'w-20', 'w-14'];
                            const h = heights[i % heights.length];
                            const w = widths[i % widths.length];
                            return (
                                <div key={i} className="flex items-end gap-1">
                                    <div className={`${w} ${h} bg-slate-900/80 rounded-t-md relative border-t border-x border-white/5`}>
                                        {/* Randomized Window Glows */}
                                        <div className={`absolute top-2 left-2 w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? 'bg-yellow-400/40 shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'bg-transparent'}`} />
                                        <div className={`absolute top-6 left-5 w-1 h-1 rounded-full ${i % 4 === 0 ? 'bg-blue-400/30' : 'bg-transparent'}`} />
                                        <div className={`absolute top-4 right-3 w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-amber-400/20' : 'bg-transparent'}`} />
                                    </div>
                                    {i % 5 === 0 && <div className="w-1 h-10 bg-slate-950/90 rounded-t-full self-end mx-1" />}
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                <div className={`absolute top-0 w-full h-[1px] transition-colors duration-1000 ${theme === 'light' ? 'bg-amber-400 shadow-[0_0_20px_#fbbf24]' : 'bg-[var(--nexus-accent)] shadow-[0_0_15px_var(--nexus-accent)]'}`} />

                {/* Dynamic Lighting / Passing Streetlights */}
                <motion.div
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className={`absolute top-0 w-48 h-full skew-x-[45deg] z-10 transition-colors duration-1000 ${theme === 'light' ? 'bg-gradient-to-r from-transparent via-amber-200/20 to-transparent' : 'bg-gradient-to-r from-transparent via-[var(--nexus-accent)]/5 to-transparent'}`}
                />

                {/* The Road Lines (Moving infinitely left) */}
                <div className={`absolute bottom-6 w-[200%] h-1 opacity-40 transition-colors duration-1000 z-10 ${theme === 'light' ? 'bg-[repeating-linear-gradient(90deg,#1e1b4b_0px,#1e1b4b_40px,transparent_40px,transparent_100px)] shadow-[0_0_8px_#312e81]' : 'bg-[repeating-linear-gradient(90deg,white_0px,white_40px,transparent_40px,transparent_100px)] shadow-[0_0_12px_rgba(255,255,255,0.3)]'}`}
                    style={{ animation: 'scrollRoad 0.6s linear infinite' }}
                />

                <style>{`@keyframes scrollRoad { 0% { transform: translateX(0); } 100% { transform: translateX(-100px); } }`}</style>
                <motion.div
                    animate={{ y: [0, -3, 0, -1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
                    className="absolute bottom-10 left-16 z-40 drop-shadow-[0_15px_30px_rgba(255,255,255,0.1)]"
                >
                    {/* Headlight Beam (Golden Amber) */}
                    <div className="absolute top-5 left-28 w-[450px] h-16 bg-gradient-to-r from-yellow-400/40 via-amber-500/10 to-transparent skew-y-3 blur-xl origin-left pointer-events-none" />
                    <div className="absolute top-6 left-28 w-[300px] h-8 bg-gradient-to-r from-yellow-200/50 via-amber-400/20 to-transparent skew-y-2 blur-md origin-left pointer-events-none" />

                    {/* Car Body Architecture (Glowing Red Edition) */}
                    <div className="relative w-36 h-11 bg-gradient-to-r from-red-700 via-red-500 to-red-900 rounded-lg border-t border-red-400/60 border-b-2 border-b-black/40 shadow-[0_0_30px_rgba(239,68,68,0.4),inset_0_2px_10px_rgba(255,255,255,0.3)]">

                        {/* Red HUD Underglow */}
                        <div className="absolute -bottom-2 inset-x-4 h-4 bg-red-600/40 blur-xl rounded-full animate-pulse" />

                        {/* Metallic Body Line Detailing */}
                        <div className="absolute top-4 left-0 w-full h-[2px] bg-red-950/20" />
                        <div className="absolute top-6 left-0 w-full h-[1px] bg-white/20" />

                        {/* Rear Spoiler */}
                        <div className="absolute -top-3 -left-2 w-8 h-4 bg-slate-900 border-t border-r border-indigo-400/50 skew-x-[-30deg] rounded-tl-sm flex items-end justify-end p-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_red]" />
                        </div>

                        {/* Aggressive Windshield/Cabin */}
                        <div className="absolute -top-5 left-10 w-16 h-6 bg-[var(--nexus-bg)]/80 border-t-2 border-r-2 border-l border-white/20 rounded-t-sm skew-x-[35deg] shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]" />

                        {/* Front Bumper / Grille */}
                        <div className="absolute top-1 -right-2 w-4 h-9 bg-slate-800 rounded-r-lg border-r-2 border-white/40 flex flex-col justify-around py-1 px-0.5">
                            <div className="w-full h-0.5 bg-black/50" />
                            <div className="w-full h-0.5 bg-black/50" />
                        </div>

                        {/* Headlight Lamp (Golden) */}
                        <div className="absolute top-4 -right-1.5 w-3 h-2 bg-yellow-400 rounded-full shadow-[0_0_30px_#facc15]" />

                        {/* Taillight Strip */}
                        <div className="absolute top-3 -left-1 w-2 h-4 bg-red-600 rounded-l-md shadow-[0_0_20px_#ef4444]" />

                        {/* Wheels - Rear (Red Glow Rims) */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.3, ease: "linear" }}
                            className="absolute -bottom-4 left-4 w-8 h-8 rounded-full border-[3px] border-slate-900 bg-black flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        >
                            <div className="w-5 h-5 rounded-full border border-red-400/40 bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-black rounded-sm rotate-45" />
                            </div>
                        </motion.div>

                        {/* Wheels - Front (Red Glow Rims) */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.3, ease: "linear" }}
                            className="absolute -bottom-4 right-4 w-8 h-8 rounded-full border-[3px] border-slate-900 bg-black flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        >
                            <div className="w-5 h-5 rounded-full border border-red-400/40 bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-black rounded-sm rotate-45" />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CruiserRevenueChart;

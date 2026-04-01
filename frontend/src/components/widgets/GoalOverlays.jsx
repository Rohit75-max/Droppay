import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Zap, Fingerprint, Flame, Orbit, Activity, Crosshair } from 'lucide-react';

/**
 * ELITE TIER GOAL OVERLAYS (₹2000+)
 * Highly animated, non-horizontal, structurally unique stream widgets.
 * Features 8 completely unique geometric & thematic structures.
 */
const PremiumGoalOverlays = ({ goal, percentage, isComplete }) => {
    const stylePreference = goal.stylePreference || 'black_hole';

    // ==========================================
    // 1. THE BLACK HOLE (Cosmic Vortex)
    // ==========================================
    if (stylePreference === 'black_hole') {
        return (
            <div className="relative w-[300px] h-[300px] mx-auto flex items-center justify-center p-8 mt-8">
                <style>{`
          @keyframes spin-slow { 100% { transform: rotate(360deg); } }
          @keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
          @keyframes pulse-core { 0%, 100% { transform: scale(1); box-shadow: 0 0 40px #8b5cf6, inset 0 0 20px #000; } 50% { transform: scale(1.05); box-shadow: 0 0 80px #c084fc, inset 0 0 10px #000; } }
        `}</style>

                <div className="absolute inset-0 rounded-full border-[2px] border-purple-500/20 bg-[conic-gradient(from_0deg,transparent,rgba(139,92,246,0.3),transparent)] animate-[spin-slow_4s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-fuchsia-500/40 bg-[conic-gradient(from_0deg,transparent,rgba(192,132,252,0.5),transparent)] animate-[spin-reverse_3s_linear_infinite]" />

                {[...Array(6)].map((_, i) => (
                    <motion.div key={i} animate={{ rotate: 360, scale: [1, 0.5, 1], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 + i, ease: "linear" }} className="absolute inset-0 origin-center">
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff] mt-2 ml-1/2 blur-[1px]" />
                    </motion.div>
                ))}

                <div
                    className="relative z-10 w-40 h-40 bg-black rounded-full flex flex-col items-center justify-center border-4 border-purple-600 animate-[pulse-core_2s_ease-in-out_infinite]"
                    style={{ transform: `scale(${1 + (percentage / 200)})` }}
                >
                    <Orbit className="w-6 h-6 text-purple-400 mb-1 opacity-50 animate-spin" />
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)] leading-none mb-1">
                        {percentage.toFixed(0)}%
                    </span>
                    <span className="text-purple-300 text-[10px] font-bold tracking-[0.3em] uppercase drop-shadow-md">Mass Gathered</span>
                </div>

                <div className="absolute -bottom-8 bg-black/80 border border-purple-500/30 px-4 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                    <span className="text-white font-mono text-xs font-bold">
                        ₹{goal.currentProgress.toLocaleString('en-IN')} <span className="text-purple-500">/ ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                    </span>
                </div>
            </div>
        );
    }

    // ==========================================
    // 2. THE HEX CORE (Alien/Server Hive)
    // ==========================================
    if (stylePreference === 'hex_core') {
        const totalHexes = 14;
        const activeHexes = Math.floor((percentage / 100) * totalHexes);

        return (
            <div className="relative w-[340px] mx-auto py-8 flex flex-col items-center mt-6">
                <div className="flex flex-col items-center mb-6 z-20">
                    <span className="text-[#39ff14] text-[10px] font-mono tracking-[0.4em] uppercase mb-1 drop-shadow-[0_0_8px_#39ff14]">System Core</span>
                    <h2 className="text-2xl font-black text-white tracking-widest uppercase drop-shadow-[2px_2px_0_#000]">{goal.title}</h2>
                    <span className="text-white font-mono text-lg mt-1 bg-[#051005] px-3 py-0.5 border border-[#39ff14]/50 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                        ₹{goal.currentProgress.toLocaleString('en-IN')} <span className="text-[#39ff14]">/ {goal.targetAmount.toLocaleString('en-IN')}</span>
                    </span>
                </div>

                <div className="flex flex-wrap justify-center gap-[-10px] w-64 mx-auto relative perspective-1000">
                    {[...Array(totalHexes)].map((_, i) => {
                        const isActive = i < activeHexes;
                        return (
                            <motion.div key={i} initial={{ rotateY: 0 }} animate={{ rotateY: isActive ? 180 : 0, scale: isActive ? 1.05 : 1 }} transition={{ duration: 0.8, type: "spring" }} className="w-12 h-12 -mx-1 -my-2 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
                                <Hexagon className={`absolute w-full h-full text-slate-800 fill-slate-950 transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'}`} strokeWidth={1} />
                                <div className={`absolute inset-0 flex items-center justify-center transform rotateY-180 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                    <Hexagon className="w-full h-full text-[#39ff14] fill-[#0a2e12] drop-shadow-[0_0_15px_#39ff14]" strokeWidth={2} />
                                    <Fingerprint className="absolute w-4 h-4 text-[#39ff14] opacity-50" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-8 text-center bg-black/90 border-t-2 border-b-2 border-[#39ff14] py-2 px-8 w-full shadow-[0_0_30px_rgba(57,255,20,0.15)]">
                    <span className="text-[#39ff14] font-black text-2xl tracking-[0.2em]">{percentage.toFixed(0)}% ONLINE</span>
                </div>
            </div>
        );
    }

    // ==========================================
    // 3. RUNE MONOLITH (Dark Fantasy Pillar)
    // ==========================================
    if (stylePreference === 'rune_monolith') {
        const totalRunes = 5;
        const litRunes = Math.floor((percentage / 100) * totalRunes);
        const runeIcons = ['ᛗ', 'ᛟ', 'ᚫ', 'ᛋ', 'ᛉ'];

        return (
            <div className="relative w-[250px] h-[450px] mx-auto flex items-end justify-center py-6 mt-4">
                {[...Array(10)].map((_, i) => (
                    <motion.div key={i} animate={{ y: [0, -400], x: Math.sin(i) * 30, opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 3 + Math.random() * 3, ease: "linear", delay: Math.random() * 2 }} className="absolute bottom-10 w-2 h-2 bg-orange-500 rounded-full blur-[2px] shadow-[0_0_10px_orange]" style={{ left: `${20 + Math.random() * 60}%` }} />
                ))}

                <div className="relative w-24 h-[350px] bg-[#1a1c23] border-x-[4px] border-t-[8px] border-slate-900 rounded-t-lg shadow-[20px_0_30px_rgba(0,0,0,0.8),-20px_0_30px_rgba(0,0,0,0.8)] flex flex-col justify-between items-center py-6 z-10 clip-path-[polygon(10%_0,90%_0,100%_100%,0_100%)]">
                    <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] mix-blend-overlay pointer-events-none" />
                    {runeIcons.map((rune, index) => {
                        const rIndex = totalRunes - 1 - index;
                        const isLit = rIndex < litRunes;
                        return (
                            <motion.div key={index} animate={isLit ? { scale: [1, 1.1, 1], textShadow: ["0 0 10px #f97316", "0 0 30px #ef4444", "0 0 10px #f97316"] } : {}} transition={{ repeat: Infinity, duration: 2 }} className={`text-3xl font-black transition-colors duration-1000 z-20 ${isLit ? 'text-orange-400' : 'text-slate-800'}`}>
                                {rune}
                            </motion.div>
                        );
                    })}
                </div>

                <div className="absolute top-0 w-[120%] text-center z-20 bg-black/80 border border-orange-500/30 p-4 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-md">
                    <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1 animate-bounce" />
                    <h2 className="text-white font-black uppercase tracking-widest text-sm mb-1 text-shadow-md">{goal.title}</h2>
                    <div className="text-orange-400 font-black text-2xl drop-shadow-[0_0_10px_#f97316]">₹{goal.currentProgress.toLocaleString('en-IN')}</div>
                    <div className="text-slate-500 text-[10px] font-bold tracking-widest mt-1 uppercase">Sacrifice: ₹{goal.targetAmount.toLocaleString('en-IN')}</div>
                </div>

                {isComplete && (
                    <motion.div initial={{ height: 0 }} animate={{ height: '100%' }} transition={{ duration: 1 }} className="absolute bottom-0 w-8 bg-white shadow-[0_0_60px_#fff,0_0_100px_#f97316] z-0 blur-[2px]" />
                )}
            </div>
        );
    }

    // ==========================================
    // 4. HOLOGRAM GLITCH (Cyberpunk Terminal)
    // ==========================================
    if (stylePreference === 'hologram_glitch') {
        return (
            <div className="relative w-full max-w-[400px] h-[280px] mx-auto mt-10 perspective-1000 flex items-center justify-center group">
                <style>{`
          @keyframes holoGlitch { 0%, 100% { transform: translate(0) rotateX(15deg) rotateY(-15deg); } 2% { transform: translate(-2px, 2px) rotateX(15deg) rotateY(-15deg); } 4% { transform: translate(2px, -2px) rotateX(15deg) rotateY(-15deg); filter: hue-rotate(90deg); } 6% { transform: translate(0) rotateX(15deg) rotateY(-15deg); filter: hue-rotate(0deg); } }
          @keyframes scanlineDown { 0% { top: -10%; } 100% { top: 110%; } }
        `}</style>

                <div className="relative w-[300px] h-[200px] bg-cyan-950/40 border border-cyan-400/50 shadow-[0_0_40px_rgba(34,211,238,0.2),inset_0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-sm animate-[holoGlitch_4s_infinite] overflow-hidden flex flex-col p-6">
                    <div className="absolute left-0 w-full h-[15%] bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent animate-[scanlineDown_2s_linear_infinite] pointer-events-none z-20" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:10px_10px] opacity-30 pointer-events-none" />

                    <div className="flex justify-between items-start mb-auto z-10">
                        <div>
                            <span className="block text-cyan-300 text-[8px] font-mono tracking-widest uppercase">Target_Obj</span>
                            <h2 className="text-white font-black text-xl uppercase tracking-tighter mix-blend-screen drop-shadow-[2px_2px_0_#06b6d4]">{goal.title}</h2>
                        </div>
                        <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
                    </div>

                    <div className="w-full flex items-end gap-1 h-16 mt-4 z-10 border-b border-cyan-500/30 pb-1">
                        {[...Array(15)].map((_, i) => {
                            const barTarget = (i + 1) * (100 / 15);
                            const isFilled = percentage >= barTarget;
                            return (
                                <div key={i} className={`flex-1 transition-all duration-500 ease-out ${isFilled ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-cyan-900/40'}`} style={{ height: `${20 + Math.random() * 80}%` }} />
                            );
                        })}
                    </div>

                    <div className="flex justify-between items-end mt-2 z-10">
                        <div className="flex flex-col">
                            <span className="text-cyan-500 text-[8px] font-mono uppercase">Acquired</span>
                            <span className="text-2xl font-black text-white drop-shadow-[0_0_8px_#22d3ee]">₹{goal.currentProgress.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-cyan-300 font-black text-3xl leading-none">{percentage.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-10 w-48 h-12 bg-cyan-500/10 rounded-[100%] blur-[10px] transform rotateX-[60deg] shadow-[0_0_50px_rgba(34,211,238,0.5)]" />
            </div>
        );
    }

    // ==========================================
    // 5. THE ALCHEMIST FLASK (RPG/Fantasy)
    // ==========================================
    if (stylePreference === 'alchemist_flask') {
        // Color shifts dynamically based on percentage: Poison Green -> Arcane Purple -> Golden Elixir
        const liquidColor = percentage < 50 ? '#22c55e' : (percentage < 100 ? '#a855f7' : '#eab308');
        const glowColor = percentage < 50 ? 'rgba(34,197,94,0.6)' : (percentage < 100 ? 'rgba(168,85,247,0.6)' : 'rgba(234,179,8,0.8)');

        return (
            <div className="relative w-[300px] h-[340px] mx-auto flex flex-col items-center justify-end py-4 mt-8">
                <style>{`
          @keyframes float-bubble { 0% { transform: translateY(0) scale(1); opacity: 0.8; } 100% { transform: translateY(-150px) scale(1.5); opacity: 0; } }
          @keyframes liquid-wave { 0%, 100% { border-radius: 40% 60% 50% 50% / 40% 50% 60% 50%; } 50% { border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%; } }
        `}</style>

                {/* Hanging Wooden Tag */}
                <div className="absolute top-4 -right-4 bg-[#5c3a21] border-2 border-[#3b2313] p-3 rounded-sm shadow-xl rotate-[6deg] z-30">
                    <div className="absolute -top-2 left-1/2 w-2 h-2 bg-black rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
                    <span className="block text-[#facc15] font-serif text-[10px] uppercase tracking-widest text-center mb-1 border-b border-[#3b2313] pb-1">Quest Log</span>
                    <h2 className="text-white font-bold text-sm text-center drop-shadow-md">{goal.title}</h2>
                    <div className="text-[#facc15] font-black text-lg text-center mt-1">₹{goal.currentProgress.toLocaleString()}</div>
                </div>

                {/* Flask Neck */}
                <div className="relative w-12 h-16 bg-white/10 border-x-4 border-t-4 border-white/30 backdrop-blur-md rounded-t-lg z-20 shadow-[inset_0_10px_20px_rgba(255,255,255,0.2)]">
                    <div className="absolute -left-2 -right-2 top-2 h-3 bg-[#3b2313] rounded-full shadow-md" /> {/* Cork/Rope */}
                </div>

                {/* Flask Body */}
                <div className="relative w-48 h-48 bg-white/5 border-4 border-white/30 rounded-full backdrop-blur-sm z-10 flex flex-col justify-end overflow-hidden shadow-[inset_0_-20px_40px_rgba(255,255,255,0.1),0_20px_40px_rgba(0,0,0,0.5)] -mt-4">

                    {/* Glass Glare */}
                    <div className="absolute top-4 left-4 w-12 h-20 bg-white/20 rounded-full blur-[2px] rotate-[-30deg] pointer-events-none z-30" />

                    {/* Dynamic Liquid */}
                    <motion.div
                        className="w-[120%] -ml-[10%] relative z-10 transition-colors duration-1000 animate-[liquid-wave_4s_ease-in-out_infinite]"
                        initial={{ height: 0 }}
                        animate={{ height: `${percentage}%`, backgroundColor: liquidColor, boxShadow: `0 -10px 30px ${glowColor}` }}
                        transition={{ type: "spring", bounce: 0.1 }}
                    >
                        {/* Bubbles */}
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="absolute w-3 h-3 bg-white/40 rounded-full animate-[float-bubble_2s_infinite]" style={{ left: `${10 + Math.random() * 80}%`, animationDelay: `${Math.random() * 2}s` }} />
                        ))}
                    </motion.div>

                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <span className="text-white font-black text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mix-blend-overlay">{percentage.toFixed(0)}%</span>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // 6. REDLINE DASH (Racing/Sim Speedometer)
    // ==========================================
    if (stylePreference === 'redline_dash') {
        const isRedline = percentage >= 85;
        const rotation = (percentage / 100) * 180 - 90; // Sweeps from -90deg (Left) to +90deg (Right)

        return (
            <div className={`relative w-[340px] h-[180px] mx-auto mt-8 flex flex-col items-center overflow-hidden bg-gradient-to-t from-slate-900 to-transparent rounded-t-full border-t-4 border-x-4 ${isRedline ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)] animate-[pulse-core_0.5s_infinite]' : 'border-slate-700'}`}>
                <style>{`
          @keyframes dash-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
        `}</style>

                {/* Dashboard Arc */}
                <div className="absolute bottom-0 w-[300px] h-[150px] rounded-t-full border-[15px] border-slate-800" />
                <div className={`absolute bottom-0 w-[300px] h-[150px] rounded-t-full border-[15px] transition-colors duration-500 ${isRedline ? 'border-red-500' : 'border-cyan-400'}`} style={{ clipPath: `polygon(0 100%, 100% 100%, 100% ${100 - percentage}%, 0 ${100 - percentage}%)` }} />

                {/* Tick Marks */}
                {[...Array(11)].map((_, i) => (
                    <div key={i} className="absolute bottom-0 w-1 h-[140px] origin-bottom transform" style={{ rotate: `${(i * 18) - 90}deg` }}>
                        <div className={`w-full h-4 ${i >= 8 ? 'bg-red-500' : 'bg-white/30'}`} />
                    </div>
                ))}

                {/* The Needle */}
                <motion.div
                    className={`absolute bottom-0 w-2 h-[120px] bg-red-500 origin-bottom rounded-t-full shadow-[0_0_15px_red] z-20 ${isRedline ? 'animate-[dash-shake_0.1s_infinite]' : ''}`}
                    animate={{ rotate: rotation }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                />

                {/* Center Hub & Stats */}
                <div className="absolute bottom-0 w-40 h-20 bg-slate-950 rounded-t-full border-t-4 border-slate-700 flex flex-col items-center justify-end pb-2 z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.8)]">
                    <span className={`font-black text-3xl leading-none mb-1 ${isRedline ? 'text-red-500 drop-shadow-[0_0_10px_red]' : 'text-white'}`}>
                        {percentage.toFixed(0)}<span className="text-sm">RPM</span>
                    </span>
                    <span className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">{goal.title}</span>
                </div>

                {/* Floating Data Window */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-4 py-1 rounded shadow-lg backdrop-blur-md z-10">
                    <span className="text-white font-mono text-sm font-bold">₹{goal.currentProgress.toLocaleString()} <span className="text-slate-500 text-xs">/ {goal.targetAmount}</span></span>
                </div>
            </div>
        );
    }

    // ==========================================
    // 7. LOOT DISPENSER (Cozy/Gachapon Theme)
    // ==========================================
    if (stylePreference === 'loot_dispenser') {
        const numBalls = Math.min(Math.floor(percentage / 2), 50); // 1 ball per 2%
        const ballColors = ['bg-pink-400', 'bg-sky-400', 'bg-yellow-300', 'bg-emerald-400', 'bg-purple-400'];

        return (
            <div className="relative w-[220px] mx-auto mt-6 flex flex-col items-center">

                {/* Title Float */}
                <div className="bg-white border-4 border-pink-400 rounded-full px-4 py-1 mb-4 shadow-md z-20 rotate-[-2deg]">
                    <span className="text-pink-500 font-black uppercase tracking-wider text-sm">{goal.title}</span>
                </div>

                {/* Glass Dome */}
                <div className="relative w-48 h-48 bg-sky-50/40 border-[6px] border-white rounded-t-[3rem] overflow-hidden flex flex-wrap-reverse content-start justify-center p-3 gap-1 shadow-[inset_0_10px_20px_rgba(255,255,255,0.8)] backdrop-blur-sm z-10">
                    <div className="absolute top-2 left-4 w-10 h-20 bg-white/40 rounded-full blur-[2px] rotate-[-20deg] pointer-events-none" />

                    {/* Physical Loot Balls Stacking */}
                    {[...Array(numBalls)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -200, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.5, delay: i * 0.05 }}
                            className={`w-8 h-8 rounded-full border-2 border-white/50 shadow-inner ${ballColors[i % ballColors.length]} relative`}
                        >
                            <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full" />
                        </motion.div>
                    ))}
                </div>

                {/* Dispenser Base */}
                <div className="relative w-56 h-32 bg-pink-500 rounded-b-2xl border-[6px] border-pink-600 flex flex-col items-center justify-start pt-4 shadow-xl z-20 -mt-2">
                    {/* Output Chute & Dial */}
                    <div className="flex w-full px-6 justify-between items-center">
                        <div className="flex flex-col items-center">
                            <span className="text-white font-black text-2xl drop-shadow-md leading-none">{percentage.toFixed(0)}%</span>
                            <span className="text-pink-200 font-bold text-[10px] uppercase tracking-widest">Filled</span>
                        </div>

                        {/* The Twisty Dial */}
                        <motion.div animate={isComplete ? { rotate: [0, 360] } : {}} transition={{ duration: 0.5 }} className="w-12 h-12 bg-slate-200 rounded-full border-4 border-slate-300 flex items-center justify-center shadow-inner">
                            <div className="w-2 h-8 bg-slate-400 rounded-full" />
                        </motion.div>

                        <div className="flex flex-col items-center">
                            <span className="text-white font-black text-sm drop-shadow-md">₹{goal.currentProgress.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* The Prize Drop Area */}
                    <div className="absolute bottom-2 w-16 h-10 bg-pink-700 rounded-md shadow-[inset_0_5px_10px_rgba(0,0,0,0.5)]" />
                </div>
            </div>
        );
    }

    // ==========================================
    // 8. MECHA LENS (Sci-Fi / Terminator Eye)
    // ==========================================
    if (stylePreference === 'mecha_lens') {
        // The iris opens as percentage increases. 0% = fully closed (scale 0.1), 100% = fully open (scale 1)
        const irisScale = Math.max(0.1, percentage / 100);

        return (
            <div className="relative w-[320px] mx-auto mt-8 flex items-center justify-center gap-6 p-6 bg-slate-900/80 border-l-4 border-red-500 rounded-r-[4rem] shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl clip-path-[polygon(0_0,100%_10%,100%_90%,0_100%)]">

                {/* The Robotic Eye Housing */}
                <div className="relative w-32 h-32 bg-slate-950 rounded-full border-[6px] border-slate-800 shadow-[inset_0_0_30px_#000,0_0_20px_rgba(239,68,68,0.2)] flex items-center justify-center shrink-0">

                    {/* Mechanical Iris Rings */}
                    <div className="absolute inset-2 rounded-full border border-slate-700 border-dashed animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-4 rounded-full border-2 border-slate-800 animate-[spin_8s_linear_infinite_reverse]" />

                    {/* The Glowing Red Pupil */}
                    <motion.div
                        className="w-full h-full bg-red-500 rounded-full flex items-center justify-center relative overflow-hidden"
                        animate={{ scale: irisScale }}
                        transition={{ type: "spring", stiffness: 40 }}
                        style={{ boxShadow: `0 0 ${20 + (percentage / 2)}px red, inset 0 0 20px #7f1d1d` }}
                    >
                        <Crosshair className="w-10 h-10 text-white/50 animate-pulse absolute" />

                        {/* Scanning Laser */}
                        <motion.div
                            animate={{ y: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute w-full h-1 bg-white shadow-[0_0_10px_#fff]"
                        />
                    </motion.div>

                    {/* Shutter Blades overlay (purely decorative overlay over the pupil) */}
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_10deg,rgba(15,23,42,0.8)_40deg,transparent_50deg,rgba(15,23,42,0.8)_80deg,transparent_90deg)] pointer-events-none rounded-full" />
                </div>

                {/* HUD Data Readout */}
                <div className="flex flex-col flex-1 min-w-0 z-10">
                    <div className="flex items-center gap-2 mb-2 border-b border-red-500/30 pb-1">
                        <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                        <span className="text-[10px] text-red-500 font-mono tracking-widest uppercase">Target Lock</span>
                    </div>
                    <h2 className="text-white font-black uppercase tracking-tighter text-xl truncate mb-1 text-shadow-md">{goal.title}</h2>

                    <div className="flex items-end gap-2 mb-1">
                        <span className="text-red-400 font-black text-2xl font-mono leading-none drop-shadow-[0_0_8px_red]">
                            ₹{goal.currentProgress.toLocaleString('en-IN')}
                        </span>
                    </div>

                    <div className="w-full bg-slate-800 h-1 mt-1">
                        <motion.div className="h-full bg-red-500 shadow-[0_0_10px_red]" initial={{ width: 0 }} animate={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 text-right block w-full">{percentage.toFixed(0)}% Acquired</span>
                </div>
            </div>
        );
    }

    return null;
};

export default PremiumGoalOverlays;
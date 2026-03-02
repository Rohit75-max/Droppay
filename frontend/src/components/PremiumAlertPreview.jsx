import React from 'react';
import { motion } from 'framer-motion';
// All 22 unique icons required for all 20 styles
import { Target, Zap, RadioReceiver, Feather, Box, Activity, FastForward, PaintBucket, Star, Sparkles, Hexagon, Eye, Sun, Shield, Globe, Flame, Cpu, Rocket, Swords, Camera, Music, Terminal, Trophy } from 'lucide-react';
import { getOptimizedImage } from '../protocol/cdnHelper'; // Ensure path is correct

/**
 * PREMIUM ALERT PREVIEW: The "Elite / Whale Tier" Engine
 * Features 20 Ultra-Premium cinematic alerts worth ₹2000 - ₹12000+
 */
const PremiumAlertPreview = React.memo(({
    donorName = "Anonymous",
    amount = 0,
    message = "Supporting the stream!",
    customAvatar,
    stylePreference = 'subway_dash'
}) => {

    // ==========================================
    // 1. SUBWAY DASH (Infinite Runner) 
    // ==========================================
    if (stylePreference === 'subway_dash') {
        return (
            <div className="relative w-full max-w-xl mx-auto h-[420px] flex flex-col items-center justify-center overflow-hidden bg-[#1e293b] rounded-3xl border-8 border-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
                <style>{`
                  @keyframes rush-wall { 0% { background-position: 0 0; } 100% { background-position: -1000px 0; } }
                  @keyframes coin-spin { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
                  @keyframes hover-board { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
                `}</style>

                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/brick-wall.png')] animate-[rush-wall_2s_linear_infinite]" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:200%_100%] animate-[rush-wall_0.5s_linear_infinite]" />

                <div className="absolute top-4 w-full px-6 flex justify-between items-start z-30">
                    <div className="flex flex-col">
                        <span className="text-white font-black text-sm uppercase tracking-widest drop-shadow-[2px_2px_0_#000] italic">High Score</span>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.5 }} className="text-amber-400 font-black text-3xl drop-shadow-[3px_3px_0_#b45309] flex items-center gap-2">
                            <div className="w-6 h-6 bg-yellow-400 rounded-full border-[3px] border-yellow-600 shadow-[inset_0_0_10px_rgba(255,255,255,0.8)] animate-[coin-spin_1s_linear_infinite] flex items-center justify-center">
                                <span className="text-yellow-700 text-[10px] font-black">₹</span>
                            </div>
                            {amount.toLocaleString('en-IN')}
                        </motion.div>
                    </div>

                    <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.8 }} className="bg-sky-500 border-4 border-white px-3 py-1 rounded-xl shadow-[4px_4px_0_#000] transform rotate-3 flex items-center gap-1.5">
                        <FastForward className="w-5 h-5 text-white animate-pulse" />
                        <span className="text-white font-black text-xl italic">x{amount > 1000 ? '100' : '10'} MULTIPLIER!</span>
                    </motion.div>
                </div>

                <div className="relative z-20 w-full flex flex-col items-center justify-center mt-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5, delay: 0.2 }} className="absolute w-64 h-32 bg-pink-500 rounded-full blur-[40px] opacity-60 mix-blend-screen" />
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5, delay: 0.3 }} className="absolute w-48 h-48 bg-cyan-400 rounded-full blur-[40px] opacity-60 mix-blend-screen -ml-20" />
                    <motion.h2 initial={{ scale: 2, opacity: 0, rotate: -10 }} animate={{ scale: 1, opacity: 1, rotate: -5 }} transition={{ type: "spring", bounce: 0.6, duration: 0.8 }} className="text-white font-black text-6xl uppercase tracking-tighter italic z-10 text-center" style={{ WebkitTextStroke: '2px black', textShadow: '4px 4px 0px #ec4899, 8px 8px 0px #000' }}>
                        {donorName}
                    </motion.h2>
                    <span className="bg-black text-white font-black px-4 py-1 text-sm uppercase tracking-widest mt-2 border-2 border-white transform rotate-2 z-10">Joined the Run!</span>
                </div>

                <motion.div className="absolute bottom-8 w-[80%] h-24 z-30 animate-[hover-board_3s_ease-in-out_infinite]">
                    <div className="w-full h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-400 rounded-full border-[6px] border-white shadow-[0_10px_30px_rgba(56,189,248,0.6),inset_0_5px_15px_rgba(255,255,255,0.8)] flex items-center justify-center px-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(0,0,0,0.1)_20px,rgba(0,0,0,0.1)_40px)]" />
                        <div className="absolute left-2 w-4 h-12 bg-white rounded-full blur-[4px] shadow-[0_0_20px_#fff]" />
                        <div className="absolute right-2 w-4 h-12 bg-white rounded-full blur-[4px] shadow-[0_0_20px_#fff]" />
                        <p className="text-slate-900 font-black text-lg italic text-center z-10 drop-shadow-[1px_1px_0_#fff] line-clamp-2">"{message}"</p>
                    </div>
                </motion.div>

                {[...Array(5)].map((_, i) => (
                    <motion.div key={i} initial={{ y: 200, x: (i - 2) * 50, scale: 0 }} animate={{ y: -100, x: (i - 2) * 100, scale: 1, opacity: [1, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} className="absolute bottom-0 z-40">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full border-[4px] border-yellow-600 shadow-[0_10px_15px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.9)] animate-[coin-spin_0.8s_linear_infinite] flex items-center justify-center"><Star className="w-4 h-4 text-yellow-600 fill-yellow-600" /></div>
                    </motion.div>
                ))}
            </div>
        );
    }

    // ==========================================
    // 2. ORBITAL STRIKE
    // ==========================================
    if (stylePreference === 'orbital_strike') {
        return (
            <div className="relative w-full max-w-lg mx-auto h-[400px] flex items-center justify-center overflow-visible">
                <motion.div initial={{ height: 0, opacity: 1 }} animate={{ height: ['0%', '150%', '0%'], opacity: [1, 1, 0] }} transition={{ duration: 1.5, ease: "easeIn" }} className="absolute top-[-200px] w-8 bg-cyan-300 shadow-[0_0_60px_#22d3ee,0_0_100px_#fff] z-0 blur-[2px]" />
                <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.5, type: "spring", stiffness: 100 }} className="relative z-10 bg-[#020817]/90 border border-cyan-500/50 p-8 rounded-full shadow-[0_0_50px_rgba(6,182,212,0.3)] backdrop-blur-xl flex flex-col items-center justify-center w-[320px] h-[320px]">
                    <div className="absolute inset-2 rounded-full border-[3px] border-cyan-400/30 border-dashed animate-[spin_6s_linear_infinite]" />
                    <div className="absolute inset-6 rounded-full border border-cyan-300/20 animate-[spin_4s_linear_infinite_reverse]" />
                    <Target className="w-10 h-10 text-cyan-400 mb-2 animate-pulse drop-shadow-[0_0_10px_#22d3ee]" />
                    <span className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-1 flex items-center gap-1.5 justify-center"><Zap className="w-3 h-3 text-cyan-400" /> Payload Secured</span>
                    <h2 className="text-white font-black text-3xl uppercase tracking-tighter drop-shadow-[0_0_10px_#22d3ee] mb-1 text-center truncate w-full px-8">{donorName}</h2>
                    <div className="bg-cyan-950/60 border border-cyan-400 px-4 py-1 mb-3">
                        <span className="text-cyan-300 font-black text-2xl font-mono">₹{amount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-cyan-100/70 text-xs italic text-center px-6 line-clamp-2">"{message}"</p>
                </motion.div>
            </div>
        );
    }

    // ==========================================
    // 3. LOOT CRATE
    // ==========================================
    if (stylePreference === 'loot_crate') {
        return (
            <div className="relative w-full max-w-md mx-auto h-[350px] flex items-end justify-center py-10">
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 2, 1.5], opacity: [0, 1, 0.8] }} transition={{ delay: 1, duration: 2 }} className="absolute bottom-10 w-64 h-64 bg-yellow-500 rounded-full blur-[60px] z-0" />
                <motion.div initial={{ y: -300, scale: 0.5 }} animate={{ y: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.6, duration: 1 }} className="relative z-10 w-full bg-[#292524] border-[6px] border-[#1c1917] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                    <div className="absolute top-0 left-0 w-full h-3 bg-[repeating-linear-gradient(45deg,#eab308,#eab308_10px,#000_10px,#000_20px)] border-b-2 border-black" />
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: -60, opacity: 1 }} transition={{ delay: 1.2, type: "spring" }} className="absolute -top-32 left-1/2 -translate-x-1/2 w-[120%] flex flex-col items-center">
                        <span className="text-yellow-400 font-black text-6xl drop-shadow-[0_5px_0_#854d0e] tracking-tighter italic">₹{amount.toLocaleString('en-IN')}</span>
                        <div className="bg-black/80 px-6 py-2 border-2 border-yellow-500 mt-2 rounded flex items-center gap-3">
                            <Box className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-white font-bold text-xl uppercase tracking-widest">{donorName}</h2>
                        </div>
                    </motion.div>
                    <div className="mt-8 text-center bg-[#1c1917] p-4 border border-[#44403c] rounded-sm">
                        <p className="text-yellow-500/80 font-mono text-sm line-clamp-2"> {message}</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ==========================================
    // 4. NEON BILLBOARD
    // ==========================================
    if (stylePreference === 'neon_billboard') {
        return (
            <div className="relative w-full max-w-lg mx-auto h-[350px] flex items-center justify-center perspective-1000">
                <style>{`
          @keyframes flicker { 0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; } 20%, 24%, 55% { opacity: 0.4; text-shadow: none; box-shadow: none; } }
          @keyframes swing { 0% { transform: rotateX(20deg) rotateY(-15deg) rotateZ(5deg); } 50% { transform: rotateX(15deg) rotateY(-10deg) rotateZ(2deg); } 100% { transform: rotateX(20deg) rotateY(-15deg) rotateZ(5deg); } }
        `}</style>
                <div className="absolute top-[-50px] left-[20%] w-1 h-[100px] bg-[repeating-linear-gradient(0deg,#333,#333_5px,#111_5px,#111_10px)] z-0" />
                <div className="absolute top-[-50px] right-[20%] w-1 h-[100px] bg-[repeating-linear-gradient(0deg,#333,#333_5px,#111_5px,#111_10px)] z-0" />
                <div className="relative z-10 w-full bg-[#0a0a0a] border-[4px] border-[#e11d48] p-8 animate-[swing_6s_ease-in-out_infinite,flicker_4s_infinite] shadow-[0_0_50px_rgba(225,29,72,0.4),inset_0_0_20px_rgba(225,29,72,0.2)]">
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(225,29,72,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-50" />
                    <div className="flex items-start gap-6 relative z-10">
                        {customAvatar && (
                            <div className="w-24 h-24 shrink-0 border-4 border-white rounded-none shadow-[4px_4px_0_#e11d48]">
                                <img src={getOptimizedImage(customAvatar, 200)} alt="Donor" className="w-full h-full object-cover filter contrast-125 saturate-150" />
                            </div>
                        )}
                        <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <RadioReceiver className="w-5 h-5 text-[#fde047]" />
                                <span className="text-[#fde047] font-black uppercase tracking-widest text-xs flex items-center gap-2">Signal Intercepted <PaintBucket className="w-3 h-3 text-[#e11d48]" /></span>
                            </div>
                            <h2 className="text-white font-black text-4xl uppercase tracking-tighter drop-shadow-[0_0_10px_#fff] mb-2 leading-none">{donorName}</h2>
                            <span className="text-[#e11d48] font-black text-3xl drop-shadow-[0_0_15px_#e11d48]">₹{amount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    <div className="mt-4 bg-[#171717] border-l-4 border-[#fde047] p-3">
                        <p className="text-white/80 font-mono text-sm uppercase">"{message}"</p>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // 5. CELESTIAL BLESSING
    // ==========================================
    if (stylePreference === 'celestial_blessing') {
        return (
            <div className="relative w-full max-w-lg mx-auto h-[400px] flex flex-col items-center justify-center">
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute inset-0 bg-[radial-gradient(circle,rgba(253,224,71,0.3)_0%,transparent_70%)] z-0" />
                {[...Array(8)].map((_, i) => (
                    <motion.div key={i} initial={{ y: -100, opacity: 0, rotate: 0 }} animate={{ y: 400, opacity: [0, 1, 0], rotate: 360 }} transition={{ repeat: Infinity, duration: 4 + Math.random() * 3, delay: i * 0.5 }} className="absolute z-0" style={{ left: `${10 + Math.random() * 80}%` }}>
                        <Feather className="w-6 h-6 text-yellow-200/60" />
                    </motion.div>
                ))}
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: "easeOut" }} className="relative z-10 flex flex-col items-center text-center">
                    {customAvatar && (
                        <div className="relative mb-6">
                            <div className="absolute -inset-4 border-2 border-yellow-300/50 rounded-full animate-[spin_10s_linear_infinite]" />
                            <div className="w-28 h-28 rounded-full overflow-hidden border-[4px] border-white shadow-[0_0_40px_rgba(253,224,71,0.6)]">
                                <img src={getOptimizedImage(customAvatar, 200)} alt="Donor" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    )}
                    <h4 className="text-yellow-400 font-serif italic text-sm tracking-widest mb-2 drop-shadow-md flex items-center gap-2 justify-center"><Activity className="w-4 h-4 text-white/50" /> Divine Intervention</h4>
                    <h2 className="text-white font-black text-5xl tracking-tighter drop-shadow-[0_5px_15px_rgba(253,224,71,0.5)] mb-2">{donorName}</h2>
                    <span className="text-yellow-300 font-black text-3xl bg-white/10 px-8 py-2 rounded-full border border-yellow-300/30 backdrop-blur-md shadow-lg mb-4">₹{amount.toLocaleString('en-IN')}</span>
                    <p className="text-white/90 font-medium italic max-w-[80%] text-lg drop-shadow-md">"{message}"</p>
                </motion.div>
            </div>
        );
    }

    // ==========================================
    // 6. GACHA PULL
    // ==========================================
    if (stylePreference === 'gacha_pull') {
        const rarity = amount >= 5000 ? 'SSR' : amount >= 2000 ? 'SR' : 'R';
        const colorClass = rarity === 'SSR' ? 'text-rose-500' : rarity === 'SR' ? 'text-amber-500' : 'text-sky-500';

        return (
            <div className="relative w-full max-w-lg mx-auto h-[400px] flex flex-col items-center justify-center overflow-hidden bg-[#050505] rounded-[3rem] border-4 border-white/10 shadow-2xl">
                <style>{`
          @keyframes gacha-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes rainbow-dash { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        `}</style>
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: [0, 4, 0], opacity: [1, 1, 0] }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute inset-0 bg-white z-50 pointer-events-none" />

                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <motion.div animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-gradient-to-t from-pink-500/20 via-purple-500/10 to-transparent" />

                <div className="relative z-10 w-full flex flex-col items-center">
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-col items-center">
                        <div className="flex gap-1 mb-2">
                            {[...Array(rarity === 'SSR' ? 5 : rarity === 'SR' ? 4 : 3)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 fill-current ${colorClass} animate-bounce`} style={{ animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                        <h3 className={`text-6xl font-black italic tracking-tighter ${colorClass} drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-[rainbow-dash_3s_linear_infinite]`}>{rarity} UNLOCKED</h3>
                    </motion.div>

                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6, delay: 1.2 }} className="mt-6 flex flex-col items-center bg-white p-1 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        <div className="bg-black rounded-xl px-10 py-5 flex flex-col items-center border-2 border-white/10">
                            <h2 className="text-white font-black text-3xl uppercase tracking-widest">{donorName}</h2>
                            <span className={`text-2xl font-mono font-black mt-2 ${colorClass}`}>+ ₹{amount.toLocaleString('en-IN')}</span>
                        </div>
                    </motion.div>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-6 px-12 text-center text-slate-400 font-medium italic text-sm">
                        "{message}"
                    </motion.p>
                </div>
            </div>
        );
    }

    // ==========================================
    // 7. ARCADE K.O.
    // ==========================================
    if (stylePreference === 'arcade_ko') {
        return (
            <div className="relative w-full max-w-xl mx-auto h-[350px] flex items-center justify-center overflow-hidden bg-black rounded-2xl border-4 border-[#333] shadow-[0_0_40px_rgba(0,0,0,1)]">
                <style>{`
          @keyframes screen-flicker { 0% { opacity: 0.97; } 5% { opacity: 0.95; } 10% { opacity: 0.9; } 15% { opacity: 0.95; } 30% { opacity: 0.98; } 100% { opacity: 1; } }
          @keyframes scanline { 0% { top: -100%; } 100% { top: 100%; } }
        `}</style>
                <div className="absolute inset-0 bg-[#1a0b16] opacity-40 animate-[screen-flicker_0.1s_infinite]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-40" />
                <div className="absolute left-0 w-full h-[100px] bg-white/5 z-30 animate-[scanline_8s_linear_infinite]" />

                <div className="absolute top-6 w-full px-10 flex justify-between items-center z-10 font-mono">
                    <div className="flex flex-col items-start">
                        <span className="text-red-500 text-[10px] font-black uppercase">P1: {donorName.slice(0, 10)}</span>
                        <div className="w-32 h-3 bg-slate-800 border border-slate-600">
                            <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-yellow-400 to-green-500 shadow-[0_0_10px_#4ade80]" />
                        </div>
                    </div>
                    <div className="text-amber-400 font-black text-3xl">99</div>
                    <div className="flex flex-col items-end">
                        <span className="text-sky-500 text-[10px] font-black uppercase">CPU: SYSTEM</span>
                        <div className="w-32 h-3 bg-slate-800 border border-slate-600">
                            <motion.div initial={{ width: "100%" }} animate={{ width: "5%" }} transition={{ duration: 0.5, delay: 0.5 }} className="h-full bg-red-600" />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-center mt-10">
                    <motion.div initial={{ scale: 5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.4, delay: 0.5 }} className="relative">
                        <h2 className="text-red-600 font-black text-8xl italic uppercase tracking-tighter drop-shadow-[5px_5px_0_#fff]">K.O.</h2>
                        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 1, duration: 0.2 }} className="absolute inset-0 bg-white z-50" />
                    </motion.div>
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}>
                        <span className="text-white font-black text-2xl uppercase tracking-widest bg-blue-600 px-4 py-1 skew-x-[-12deg] shadow-[4px_4px_0_#000]">NEW RECORD: ₹{amount}</span>
                    </motion.div>
                </div>
            </div>
        );
    }

    // ==========================================
    // 8. PARANORMAL TAPE
    // ==========================================
    if (stylePreference === 'paranormal_tape') {
        return (
            <div className="relative w-full max-w-lg mx-auto h-[400px] flex items-center justify-center overflow-hidden bg-[#0a0a0a] grayscale contrast-150">
                <style>{`
          @keyframes vhs-tracking { 0% { transform: translateY(0); } 10% { transform: translateY(-2px); } 20% { transform: translateY(2px); } 100% { transform: translateY(0); } }
          @keyframes eerie-glow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
          @keyframes text-glitch { 0% { transform: translate(0); text-shadow: 2px 0 red, -2px 0 blue; } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(-2px, -2px); text-shadow: -2px 0 red, 2px 0 blue; } 60% { transform: translate(2px, 2px); } 80% { transform: translate(2px, -2px); } 100% { transform: translate(0); } }
        `}</style>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')] opacity-30 z-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1 z-10 animate-[vhs-tracking_0.2s_linear_infinite]" />

                <div className="absolute top-4 left-6 z-30 font-mono text-white/50 text-xs flex flex-col gap-1">
                    <span className="flex items-center gap-2">PLAY ► <Camera className="w-3 h-3 text-white/30" /></span>
                    <span>00:00:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}</span>
                    <span className="text-red-500/50 animate-pulse">● REC</span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="absolute -inset-20 bg-emerald-900/10 blur-[100px] rounded-full animate-[eerie-glow_4s_infinite]" />

                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }} className="flex flex-col items-center">
                        <span className="text-white/40 font-mono text-[10px] tracking-[0.5em] mb-4">ENTITY DETECTED</span>
                        <h2 className="text-white font-mono text-5xl font-black tracking-tighter uppercase animate-[text-glitch_0.3s_linear_infinite]">{donorName}</h2>
                        <div className="h-[2px] w-48 bg-white/20 my-6" />
                        <span className="text-white/60 font-mono text-3xl font-bold">VAL: ₹{amount}</span>
                    </motion.div>

                    <div className="mt-8 max-w-[280px] text-center italic opacity-70">
                        <p className="text-white font-mono text-xs leading-relaxed">"{message}"</p>
                    </div>
                </div>

                <div className="absolute bottom-4 right-6 z-30 font-mono text-white/20 text-[10px]">
                    LN: 402 // FR: {Math.floor(Math.random() * 9999)}
                </div>
            </div>
        );
    }

    // ==========================================
    // 9. HOLO TCG
    // ==========================================
    if (stylePreference === 'holo_tcg') {
        const isUltraRare = amount >= 5000;
        return (
            <div className="relative w-full max-w-[320px] sm:max-w-sm mx-auto aspect-[3/4] max-h-[85vh] flex items-center justify-center perspective-1000">
                <style>{`
          @keyframes holo-shimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          @keyframes card-tilt { 0% { transform: rotateY(-10deg) rotateX(5deg); } 50% { transform: rotateY(10deg) rotateX(-5deg); } 100% { transform: rotateY(-10deg) rotateX(5deg); } }
        `}</style>

                <motion.div
                    initial={{ y: 400, rotateZ: 20, opacity: 0 }}
                    animate={{ y: 0, rotateZ: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 1 }}
                    className="relative w-full h-full bg-slate-900 border-[8px] border-amber-600 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-[card-tilt_6s_ease-in-out_infinite]"
                >
                    <div className="absolute inset-0 opacity-40 bg-[linear-gradient(45deg,#ff0000_16.6%,#ff7f00_16.6%,#ff7f00_33.3%,#ffff00_33.3%,#ffff00_50%,#00ff00_50%,#00ff00_66.6%,#0000ff_66.6%,#0000ff_83.3%,#4b0082_83.3%)] bg-[length:400%_400%] animate-[holo-shimmer_5s_linear_infinite] mix-blend-color-dodge z-10" />

                    <div className="relative z-20 h-full p-6 flex flex-col">
                        <div className="flex justify-between items-center bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
                            <h2 className="text-white font-black text-xl tracking-tight leading-none truncate pr-2 uppercase italic">{donorName}</h2>
                            <div className="flex items-center gap-1 shrink-0">
                                <span className="text-white/60 font-bold text-[8px]">HP</span>
                                <span className="text-white font-black text-lg">{amount}</span>
                            </div>
                        </div>

                        <div className="mt-4 flex-1 bg-black/40 rounded-xl border-4 border-amber-600/50 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-30" />
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}>
                                <Star className={`w-24 h-24 ${isUltraRare ? 'text-amber-400 fill-amber-400' : 'text-slate-400 fill-slate-400'} drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]`} />
                            </motion.div>
                            <div className="absolute bottom-2 left-3 bg-red-600 px-2 py-0.5 rounded italic font-black text-[9px] text-white">BASIC DONO</div>
                        </div>

                        <div className="mt-4 bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-white font-black text-sm italic uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> SUPPORTER BLAST
                                </span>
                                <span className="text-white font-bold text-xs">80+</span>
                            </div>
                            <p className="text-white/70 text-[10px] leading-relaxed italic border-t border-white/10 pt-2 mt-1">
                                "{message}"
                            </p>
                        </div>

                        <div className="mt-auto flex justify-between items-end border-t border-amber-600/30 pt-4">
                            <div className="flex flex-col">
                                <span className="text-white/40 text-[7px] font-bold uppercase">Artist: DropPay Engine</span>
                                <span className="text-white/40 text-[7px] font-bold uppercase">No. 042/1000 ★</span>
                            </div>
                            <div className="w-8 h-8 rounded-full border-2 border-amber-600/50 flex items-center justify-center">
                                <div className="w-4 h-4 bg-amber-600 rounded-full" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ==========================================
    // 10. BEAT DROP
    // ==========================================
    if (stylePreference === 'beat_drop') {
        return (
            <div className="relative w-full max-w-lg mx-auto h-[350px] flex flex-col items-center justify-center overflow-hidden bg-black rounded-3xl border-4 border-white/5 shadow-2xl">
                <style>{`
          @keyframes bar-pulse { 0%, 100% { height: 20%; } 50% { height: 80%; } }
          @keyframes disc-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes glow-pulse { 0%, 100% { filter: brightness(1) blur(20px); } 50% { filter: brightness(1.5) blur(30px); } }
        `}</style>

                <div className="absolute inset-0 bg-indigo-600/10 animate-[glow-pulse_2s_infinite]" />

                <div className="absolute inset-0 flex items-end justify-center gap-1 px-4 opacity-30">
                    {[...Array(40)].map((_, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 animate-[bar-pulse_var(--d)_ease-in-out_infinite]" style={{ '--d': `${0.5 + Math.random() * 1.5}s`, animationDelay: `${i * 0.05}s` }} />
                    ))}
                </div>

                <div className="relative z-10 w-full flex flex-col items-center px-8">
                    <motion.div initial={{ scale: 0, rotate: -200 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5, duration: 1 }} className="mb-6 relative">
                        <div className="w-32 h-32 rounded-full border-[6px] border-white/20 flex items-center justify-center animate-[disc-spin_3s_linear_infinite] shadow-[0_0_30px_rgba(99,102,241,0.4)] bg-[#111]">
                            <div className="w-28 h-28 rounded-full border border-white/10 flex items-center justify-center relative">
                                <div className="w-10 h-10 rounded-full border-4 border-indigo-500 bg-black flex items-center justify-center">
                                    <Music className="w-4 h-4 text-indigo-400" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-pink-500 text-white font-black text-[10px] px-2 py-1 rounded shadow-lg transform rotate-12">LIVE MIX</div>
                    </motion.div>

                    <h2 className="text-white font-black text-4xl uppercase tracking-widest text-center mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{donorName}</h2>
                    <div className="bg-white text-black font-black px-6 py-2 rounded-full text-2xl tracking-tighter mb-4 shadow-[0_0_20px_#fff]">₹{amount}</div>

                    <p className="text-indigo-200 text-sm font-medium italic text-center line-clamp-2">
                        "{message}"
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================
    // 11. MAINFRAME BREACH
    // ==========================================
    if (stylePreference === 'mainframe_breach') {
        return (
            <div className="relative w-full max-w-lg mx-auto h-[400px] flex flex-col items-center justify-center overflow-hidden bg-[#000800] rounded-xl border-2 border-green-500/30">
                <style>{`
          @keyframes matrix-rain { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
          @keyframes cursor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
          @keyframes border-glitch { 0%, 100% { border-color: rgba(34,197,94,0.3); } 50% { border-color: rgba(34,197,94,0.8); } }
        `}</style>

                <div className="absolute inset-0 flex justify-around opacity-20 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="text-green-500 font-mono text-[8px] whitespace-nowrap animate-[matrix-rain_var(--d)_linear_infinite]" style={{ '--d': `${5 + Math.random() * 10}s`, animationDelay: `${Math.random() * 5}s` }}>
                            {Array(50).fill(0).map(() => String.fromCharCode(33 + Math.random() * 93)).join('<br/>')}
                        </div>
                    ))}
                </div>

                <div className="relative z-10 w-full px-12 font-mono">
                    <div className="bg-black/80 border border-green-500/50 p-6 shadow-[0_0_30px_rgba(34,197,94,0.2)] animate-[border-glitch_2s_infinite]">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <Terminal className="w-3 h-3" /> Connection: SECURE // Node: {Math.floor(Math.random() * 9999)}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="text-green-500/60 text-xs tracking-tighter block">&gt; TARGET_IDENTIFIED:</span>
                                <h2 className="text-green-400 text-4xl font-black uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                                    {donorName}<span className="inline-block w-4 h-8 bg-green-500 ml-1 mb-[-4px] animate-[cursor-blink_1s_infinite]" />
                                </h2>
                            </div>

                            <div>
                                <span className="text-green-500/60 text-xs tracking-tighter block">&gt; DATA_PAYLOAD_RECEIVED:</span>
                                <span className="text-white text-2xl font-black font-mono">₹{amount.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="pt-4 border-t border-green-500/20">
                                <span className="text-green-500/60 text-[10px] block mb-1">&gt; MESSAGE_DECRYPTED:</span>
                                <p className="text-green-300 text-xs leading-relaxed italic truncate">"{message}"</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-2 w-full text-center">
                    <span className="text-green-900 font-mono text-[8px] uppercase tracking-[1em]">SYSTEM_STABLE_V4.2.0</span>
                </div>
            </div>
        );
    }

    // ==========================================
    // 12. DRAGON'S HOARD (Dark Fantasy) - [₹7,999]
    // ==========================================
    if (stylePreference === 'dragon_hoard') {
        return (
            <div className="relative w-full max-w-2xl mx-auto h-[450px] flex items-center justify-center overflow-hidden bg-[#050101] rounded-xl border border-red-900/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
                <style>{`
                  @keyframes fire-breath { 0% { transform: translateX(-100%) scale(1); opacity: 0; } 50% { opacity: 1; transform: translateX(0) scale(1.5); } 100% { transform: translateX(100%) scale(2); opacity: 0; } }
                  @keyframes eye-glow { 0%, 100% { box-shadow: 0 0 40px #f97316, inset 0 0 40px #f97316; } 50% { box-shadow: 0 0 80px #ef4444, inset 0 0 80px #ef4444; } }
                `}</style>

                <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }} className="absolute z-0 w-64 h-32 bg-orange-600 rounded-[100%] flex items-center justify-center overflow-hidden animate-[eye-glow_3s_infinite]" style={{ clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)' }}>
                    <motion.div animate={{ scaleX: [1, 0.8, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="w-6 h-full bg-black rounded-[100%]" />
                </motion.div>

                <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-60">
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.8)_0%,transparent_70%)] animate-[fire-breath_2s_ease-in_forwards]" />
                </div>

                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 1 }} className="relative z-20 flex flex-col items-center mt-20">
                    <div className="flex gap-4 mb-2">
                        <Swords className="w-8 h-8 text-red-700 -rotate-12 drop-shadow-[0_0_10px_#ef4444]" />
                        <Flame className="w-12 h-12 text-yellow-500 animate-pulse drop-shadow-[0_0_15px_#eab308]" />
                        <Swords className="w-8 h-8 text-red-700 rotate-[102deg] scale-x-[-1] drop-shadow-[0_0_10px_#ef4444]" />
                    </div>
                    <h2 className="text-white font-serif font-black text-5xl uppercase tracking-widest drop-shadow-[0_5px_10px_#7f1d1d] text-center" style={{ textShadow: '0 0 20px red' }}>
                        {donorName}
                    </h2>
                    <div className="mt-4 bg-gradient-to-r from-yellow-900 via-yellow-600 to-yellow-900 px-12 py-2 border-y-4 border-yellow-400 shadow-[0_10px_30px_rgba(234,179,8,0.4)]">
                        <span className="text-black font-black text-4xl drop-shadow-[1px_1px_0_#fff]">
                            ₹{amount.toLocaleString('en-IN')}
                        </span>
                    </div>
                    <span className="text-orange-300 font-serif italic text-lg mt-4 drop-shadow-[0_2px_4px_#000]">
                        "The Hoard Grows..."
                    </span>
                </motion.div>
            </div>
        );
    }

    // ==========================================
    // 13. CASINO JACKPOT (Working Slot Machine) - [₹9,999]
    // ==========================================
    if (stylePreference === 'casino_jackpot') {
        return (
            <div className="relative w-full max-w-lg mx-auto h-[400px] flex flex-col items-center justify-center py-6">
                <style>{`
                  @keyframes marquee { 0%, 100% { border-color: #fde047; box-shadow: 0 0 20px #fde047; } 50% { border-color: #ef4444; box-shadow: 0 0 20px #ef4444; } }
                  @keyframes coin-fountain { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-300px) scale(1.5); opacity: 0; } }
                `}</style>

                <div className="relative w-full max-w-[400px] bg-red-900 border-[8px] border-yellow-400 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-[marquee_0.5s_infinite]">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-yellow-400 border-4 border-red-700 px-8 py-2 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-20">
                        <span className="text-red-700 font-black text-2xl uppercase tracking-widest">Jackpot!</span>
                    </div>

                    <div className="w-full h-32 bg-white rounded-lg border-[6px] border-slate-800 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-between px-4 overflow-hidden relative">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="w-24 h-full relative overflow-hidden bg-slate-100 border-x-2 border-slate-300">
                                <motion.div initial={{ y: 0 }} animate={{ y: -1000 }} transition={{ ease: "linear", duration: 1.5 + (i * 0.5), type: "tween" }} className="absolute top-0 w-full flex flex-col items-center text-6xl">
                                    {[...Array(10)].map((_, j) => <div key={j} className="h-32 flex items-center justify-center">🍒</div>)}
                                    <div className="h-32 flex items-center justify-center text-red-600 font-black">7</div>
                                </motion.div>
                            </div>
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                    </div>

                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring", bounce: 0.6 }} className="mt-6 text-center bg-black p-4 rounded-xl border-4 border-yellow-400">
                        <h2 className="text-white font-black text-xl uppercase tracking-widest mb-1">{donorName}</h2>
                        <span className="text-yellow-400 font-black text-5xl drop-shadow-[0_0_15px_#facc15]">
                            ₹{amount.toLocaleString('en-IN')}
                        </span>
                    </motion.div>
                </div>

                {[...Array(15)].map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="absolute bottom-0 z-30">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full border-[3px] border-yellow-600 animate-[coin-fountain_1s_ease-out_infinite]" style={{ animationDelay: `${Math.random()}s`, left: `${20 + Math.random() * 60}%` }}>
                            <span className="flex items-center justify-center h-full text-[10px] font-black text-yellow-700">₹</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    // ==========================================
    // 14. MECHA ASSEMBLY (Sci-Fi Armor) - [₹6,999]
    // ==========================================
    if (stylePreference === 'mecha_assembly') {
        return (
            <div className="relative w-full max-w-lg mx-auto h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-slate-900 bg-[linear-gradient(rgba(56,189,248,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

                <motion.div initial={{ y: -300 }} animate={{ y: 0 }} transition={{ type: "spring", bounce: 0.3, duration: 1 }} className="absolute top-0 w-[80%] h-[50%] bg-slate-800 border-b-[8px] border-cyan-500 z-10 clip-path-[polygon(0_0,100%_0,80%_100%,20%_100%)] shadow-[0_20px_30px_rgba(0,0,0,0.8)]" />
                <motion.div initial={{ y: 300 }} animate={{ y: 0 }} transition={{ type: "spring", bounce: 0.3, duration: 1, delay: 0.2 }} className="absolute bottom-0 w-[80%] h-[50%] bg-slate-800 border-t-[8px] border-cyan-500 z-10 clip-path-[polygon(20%_0,80%_0,100%_100%,0_100%)] shadow-[0_-20px_30px_rgba(0,0,0,0.8)]" />

                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 1.2, type: "spring", stiffness: 100 }} className="relative z-20 w-48 h-48 bg-slate-950 rounded-full border-[10px] border-slate-700 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.8),inset_0_0_30px_rgba(6,182,212,0.5)]">
                    <div className="absolute inset-2 rounded-full border-[4px] border-cyan-400 border-dashed animate-[spin_3s_linear_infinite]" />
                    <Cpu className="w-8 h-8 text-cyan-300 mb-1 animate-pulse" />
                    <h2 className="text-white font-black uppercase text-xl truncate w-full text-center px-4 drop-shadow-[0_0_5px_#22d3ee]">{donorName}</h2>
                    <span className="text-cyan-400 font-black text-3xl font-mono drop-shadow-[0_0_10px_#22d3ee]">₹{amount}</span>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }} className="absolute bottom-10 z-30 bg-cyan-950/80 border border-cyan-400 px-6 py-2 backdrop-blur-md rounded shadow-[0_0_15px_#22d3ee]">
                    <p className="text-cyan-100 font-mono text-sm uppercase tracking-widest">"{message}"</p>
                </motion.div>
            </div>
        );
    }

    // ==========================================
    // 15. HYPERDRIVE WARP (Space Simulator) - [₹5,999]
    // ==========================================
    if (stylePreference === 'hyperdrive_warp') {
        return (
            <div className="relative w-full max-w-lg mx-auto h-[350px] flex items-center justify-center bg-black overflow-hidden border-4 border-slate-800 rounded-2xl perspective-1000">
                <style>{`
                  @keyframes warp-speed { 0% { transform: scale(1); opacity: 0; } 50% { opacity: 1; } 100% { transform: scale(5); opacity: 0; } }
                `}</style>

                <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle,transparent_20%,#fff_21%,transparent_22%,#fff_30%,transparent_31%)] animate-[warp-speed_1s_ease-in_infinite]" style={{ animationDelay: `${i * 0.3}s` }} />
                    ))}
                </div>

                <motion.div initial={{ scale: 0, rotateX: -60 }} animate={{ scale: 1, rotateX: 0 }} transition={{ type: "spring", bounce: 0.5, duration: 1.5 }} className="relative z-10 w-[85%] bg-sky-950/60 border-2 border-sky-400 rounded-3xl p-6 backdrop-blur-md shadow-[0_0_40px_rgba(56,189,248,0.4),inset_0_0_20px_rgba(56,189,248,0.2)] flex flex-col items-center" style={{ transformStyle: "preserve-3d" }}>
                    <div className="absolute top-2 left-4 flex gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-mono text-sky-300 uppercase tracking-widest">Incoming Comm</span>
                    </div>
                    <Rocket className="w-10 h-10 text-sky-400 mb-2 mt-4" />
                    <h2 className="text-white font-black text-3xl uppercase tracking-widest drop-shadow-[0_0_10px_#38bdf8]">
                        {donorName}
                    </h2>
                    <div className="w-full h-1 bg-sky-900 my-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-[100%] bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
                    </div>
                    <span className="text-sky-300 font-mono font-black text-4xl mb-2">
                        ₹{amount.toLocaleString()}
                    </span>
                    <div className="bg-black/50 w-full p-2 text-center border border-sky-500/30 rounded">
                        <span className="text-sky-100 font-mono text-xs uppercase">"{message}"</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ==========================================
    // 16. DIMENSIONAL RIFT (Magic/Multiverse) - [₹11,999]
    // ==========================================
    if (stylePreference === 'dimensional_rift') {
        return (
            <div className="relative w-full max-w-xl mx-auto h-[450px] bg-[#03000a] overflow-hidden flex items-center justify-center rounded-2xl border border-purple-900/30 shadow-[0_0_60px_rgba(0,0,0,1)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(168,85,247,0.2)_0%,transparent_60%)]" />

                <div className="absolute inset-4 bg-amber-900/50 shadow-[0_0_100px_#f59e0b] blur-[2px]" style={{ clipPath: 'polygon(50% 0%, 65% 20%, 55% 40%, 80% 60%, 50% 100%, 30% 70%, 45% 50%, 20% 30%)' }} />

                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute z-10 w-[350px] h-[350px] border-[6px] border-fuchsia-500 border-dashed rounded-full shadow-[0_0_80px_#d946ef,inset_0_0_80px_#d946ef] flex items-center justify-center">
                    <div className="w-[85%] h-[85%] border-[2px] border-purple-300 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
                    <Hexagon className="absolute w-[70%] h-[70%] text-fuchsia-500/30 animate-pulse" />
                </motion.div>

                {[...Array(8)].map((_, i) => (
                    <motion.div key={i} animate={{ y: [-20, 20, -20], x: [-10, 10, -10], rotate: [0, 90, 180] }} transition={{ repeat: Infinity, duration: 4 + i, ease: "easeInOut" }} className="absolute z-20 w-10 h-16 bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_0_20px_#fff]" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', left: `${10 + (i * 10)}%`, top: `${15 + (i * 10)}%` }} />
                ))}

                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, type: "spring", bounce: 0.6 }} className="relative z-30 flex flex-col items-center bg-black/80 p-8 rounded-full border-2 border-fuchsia-500 shadow-[0_0_50px_#000] backdrop-blur-xl">
                    <Sparkles className="w-12 h-12 text-fuchsia-400 mb-2 animate-pulse" />
                    <h2 className="text-white font-serif font-black text-4xl uppercase tracking-widest drop-shadow-[0_0_15px_#d946ef]">{donorName}</h2>
                    <span className="text-fuchsia-400 font-black text-5xl drop-shadow-[0_4px_10px_#000] mt-2">₹{amount.toLocaleString('en-IN')}</span>
                    <p className="text-fuchsia-200/90 italic text-sm mt-3 max-w-[250px] text-center">"{message}"</p>
                </motion.div>
            </div>
        );
    }

    // ==========================================
    // 17. ABYSSAL KRAKEN (Lovecraft/Deep Sea) - [₹8,999]
    // ==========================================
    if (stylePreference === 'abyssal_kraken') {
        return (
            <div className="relative w-full max-w-xl mx-auto h-[450px] bg-[#010b14] border-[6px] border-teal-900 rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
                <div className="absolute inset-0 bg-gradient-to-b from-teal-900/30 via-cyan-950/80 to-[#01060a] z-0" />

                {[...Array(20)].map((_, i) => (
                    <motion.div key={i} animate={{ y: ['100%', '-500%'], x: Math.sin(i) * 30 }} transition={{ repeat: Infinity, duration: 2 + Math.random() * 5, ease: "linear" }} className="absolute bottom-0 w-4 h-4 bg-teal-300/20 rounded-full border border-teal-200/40 shadow-[0_0_15px_#2dd4bf] z-10" style={{ left: `${Math.random() * 100}%` }} />
                ))}

                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="relative z-20 w-72 h-72 bg-[radial-gradient(circle,rgba(45,212,191,0.5)_0%,transparent_70%)] rounded-full flex flex-col items-center justify-center border border-teal-500/40 shadow-[0_0_100px_rgba(20,184,166,0.6),inset_0_0_50px_rgba(20,184,166,0.5)] backdrop-blur-md">
                    <Eye className="w-10 h-10 text-teal-300 mb-2 opacity-60 animate-pulse" />
                    <h2 className="text-teal-50 font-black text-3xl uppercase tracking-widest drop-shadow-[0_0_10px_#2dd4bf] mb-1 text-center">{donorName}</h2>
                    <span className="text-teal-400 font-black text-5xl drop-shadow-[0_0_20px_#0d9488]">₹{amount.toLocaleString('en-IN')}</span>
                    <div className="mt-4 bg-cyan-950/90 px-6 py-2 border-l-4 border-teal-400 rounded-r-lg shadow-lg text-center max-w-[80%]">
                        <p className="text-teal-100/90 text-sm italic truncate">"{message}"</p>
                    </div>
                </motion.div>

                <motion.div animate={{ rotate: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }} className="absolute -bottom-16 -left-12 w-48 h-72 bg-[#021c22] rounded-full border-r-[12px] border-teal-800 z-30 shadow-[10px_0_30px_rgba(0,0,0,0.8)]" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
                <motion.div animate={{ rotate: [8, -8, 8] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute -top-16 -right-12 w-40 h-72 bg-[#021c22] rounded-full border-l-[12px] border-teal-800 z-30 shadow-[-10px_0_30px_rgba(0,0,0,0.8)]" style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }} />
            </div>
        );
    }

    // ==========================================
    // 18. PHARAOH'S TOMB (Ancient Egypt) - [₹9,999]
    // ==========================================
    if (stylePreference === 'pharaoh_tomb') {
        return (
            <div className="relative w-full max-w-xl mx-auto h-[480px] bg-[#1a1511] flex items-center justify-center p-6 border-[10px] border-[#3a2c1d] shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-hidden rounded-lg">
                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')] mix-blend-overlay" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(250,204,21,0.7)_0%,transparent_80%)] shadow-[inset_0_0_120px_#000] z-0" />

                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center mt-8">
                    <Sun className="w-20 h-20 text-yellow-400 mb-6 animate-[spin_12s_linear_infinite] drop-shadow-[0_0_30px_#facc15]" />
                    <h2 className="text-yellow-500 font-serif font-black text-5xl uppercase tracking-[0.3em] drop-shadow-[3px_3px_0_#451a03] mb-4">{donorName}</h2>
                    <div className="bg-[#2d1204] px-10 py-3 border-y-[6px] border-yellow-500 mb-6 shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
                        <span className="text-yellow-400 font-black text-4xl tracking-widest">₹{amount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-yellow-200/80 font-serif text-lg px-8 italic bg-black/40 py-2 rounded-lg border border-yellow-900/50">"{message}"</p>
                </div>

                <motion.div initial={{ y: 0 }} animate={{ y: 600 }} transition={{ delay: 0.8, duration: 2.5, ease: "circIn" }} className="absolute inset-0 z-20 bg-[#2d2419] border-[16px] border-[#1a1511] flex flex-col items-center justify-center shadow-[0_40px_60px_#000]">
                    <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />
                    <Shield className="w-32 h-32 text-[#facc15] opacity-20 mb-6" />
                    <span className="text-[#facc15] font-black text-3xl tracking-[0.6em] opacity-40 uppercase">UNSEALING</span>
                </motion.div>

                {[...Array(30)].map((_, i) => (
                    <motion.div key={i} initial={{ y: -50, opacity: 0 }} animate={{ y: 500, opacity: [0, 1, 0] }} transition={{ delay: 0.8 + Math.random() * 1.5, duration: 2.5, repeat: 1 }} className="absolute z-30 w-1.5 h-1.5 bg-yellow-600 rounded-full blur-[1px]" style={{ left: `${Math.random() * 100}%` }} />
                ))}
            </div>
        );
    }

    // ==========================================
    // 19. CYBERNETIC BRAIN (Matrix / AI Vibe) - [₹10,499]
    // ==========================================
    if (stylePreference === 'cybernetic_brain') {
        return (
            <div className="relative w-full max-w-xl mx-auto h-[480px] flex items-center justify-center p-8 bg-[#020202] rounded-3xl border-2 border-[#111] shadow-[0_0_80px_rgba(0,0,0,1)]">
                <style>{`
                  @keyframes flash-zap { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
                  @keyframes brain-pulse { 0%, 100% { transform: scale(1); box-shadow: 0 0 30px #39ff14; } 50% { transform: scale(1.05); box-shadow: 0 0 80px #39ff14; } }
                `}</style>

                <div className="relative w-72 h-[350px] bg-green-950/20 border-x-[6px] border-t-[6px] border-slate-800 rounded-t-[4rem] shadow-[inset_0_0_80px_rgba(57,255,20,0.15)] flex flex-col items-center justify-center overflow-hidden z-10">
                    <motion.div initial={{ top: '100%' }} animate={{ top: '20%' }} transition={{ duration: 2, ease: "easeInOut" }} className="absolute bottom-0 w-full h-full bg-gradient-to-t from-[#39ff14]/30 to-transparent border-t-2 border-[#39ff14]/60 z-0" />

                    <div className="absolute top-6 left-6 w-16 h-72 bg-white/5 rounded-full blur-[4px] z-30 pointer-events-none transform rotate-[-5deg]" />

                    <div className="relative z-20 w-40 h-40 bg-slate-950 rounded-full border-[6px] border-[#39ff14] animate-[brain-pulse_1.5s_infinite] flex items-center justify-center overflow-hidden shadow-[inset_0_0_30px_#39ff14]">
                        <div className="absolute inset-0 opacity-60 bg-[url('https://www.transparenttextures.com/patterns/microbial-mat.png')] mix-blend-screen" />
                        <Activity className="w-16 h-16 text-[#39ff14] opacity-80" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm p-3 text-center">
                            <span className="text-[#39ff14] font-black text-xs uppercase tracking-[0.3em] mb-1">Subject</span>
                            <span className="text-white font-black text-lg uppercase truncate w-full leading-tight">{donorName}</span>
                        </div>
                    </div>

                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`absolute w-full h-1 bg-[#39ff14] shadow-[0_0_15px_#39ff14] transform rotate-${Math.random() * 180} z-10 opacity-0 animate-[flash-zap_0.15s_infinite]`} style={{ top: `${20 + Math.random() * 60}%`, animationDelay: `${Math.random() * 2}s` }} />
                    ))}
                </div>

                <div className="absolute bottom-6 w-96 h-16 bg-[#0a0f0a] border-[4px] border-[#39ff14] rounded-2xl flex items-center justify-center z-20 shadow-[0_20px_50px_#000,0_0_30px_rgba(57,255,20,0.3)] px-6">
                    <div className="flex flex-col w-full text-center">
                        <span className="text-[#39ff14] font-mono font-black text-3xl tracking-widest leading-none drop-shadow-[0_0_10px_#39ff14]">₹{amount.toLocaleString('en-IN')}</span>
                    </div>
                </div>
                <div className="absolute bottom-2 z-30 bg-black px-4 py-1 rounded border border-[#39ff14]/30">
                    <span className="text-[#39ff14]/80 font-mono text-[10px] uppercase truncate max-w-[250px] inline-block">MSG: {message}</span>
                </div>
            </div>
        );
    }

    // ==========================================
    // 20. CELESTIAL ZODIAC (Astrolabe) - [₹12,000]
    // ==========================================
    if (stylePreference === 'celestial_zodiac') {
        return (
            <div className="relative w-full max-w-xl mx-auto h-[480px] bg-[#050510] flex items-center justify-center overflow-hidden border-2 border-indigo-900/50 shadow-[0_30px_80px_#000] rounded-3xl perspective-1000">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(79,70,229,0.3)_0%,transparent_80%)]" />

                <div className="relative w-[350px] h-[350px] flex items-center justify-center z-10" style={{ transformStyle: 'preserve-3d' }}>

                    <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute w-full h-full border-[3px] border-amber-300/40 rounded-full flex items-center justify-start">
                        <div className="w-4 h-4 bg-amber-200 rounded-full shadow-[0_0_20px_#fde047]" />
                    </motion.div>

                    <motion.div animate={{ rotateX: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute w-[80%] h-[80%] border-[5px] border-amber-400/60 rounded-full flex items-start justify-center" style={{ transformStyle: 'preserve-3d' }}>
                        <div className="w-5 h-5 bg-amber-400 rounded-full shadow-[0_0_25px_#facc15]" />
                    </motion.div>

                    <motion.div animate={{ rotateY: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute w-[60%] h-[60%] border-[8px] border-amber-500 rounded-full flex items-end justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)]" style={{ transformStyle: 'preserve-3d' }}>
                        <div className="w-6 h-6 bg-yellow-500 rounded-full shadow-[0_0_35px_#eab308]" />
                    </motion.div>

                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 1 }} className="absolute w-48 h-48 bg-indigo-950/90 rounded-full border-[6px] border-amber-300 flex flex-col items-center justify-center z-20 shadow-[0_0_100px_rgba(253,224,71,0.8)] backdrop-blur-xl">
                        <Globe className="w-10 h-10 text-amber-200 mb-2 opacity-90 animate-pulse" />
                        <h2 className="text-amber-50 font-serif font-black text-2xl uppercase tracking-widest text-center truncate px-6 w-full drop-shadow-[0_2px_4px_#000]">{donorName}</h2>
                        <div className="w-full bg-amber-900/80 py-2 my-2 border-y-2 border-amber-400">
                            <span className="text-yellow-300 font-black text-3xl drop-shadow-[0_0_15px_#facc15]">₹{amount.toLocaleString('en-IN')}</span>
                        </div>
                        <span className="text-indigo-200 text-[9px] font-mono uppercase tracking-[0.4em]">Cosmic Alignment</span>
                    </motion.div>
                </div>

                <svg className="absolute inset-0 w-full h-full z-0 opacity-30 pointer-events-none">
                    <line x1="15%" y1="25%" x2="35%" y2="75%" stroke="#eab308" strokeWidth="1.5" />
                    <line x1="35%" y1="75%" x2="75%" y2="45%" stroke="#eab308" strokeWidth="1.5" />
                    <line x1="75%" y1="45%" x2="85%" y2="15%" stroke="#eab308" strokeWidth="1.5" />
                    <circle cx="15%" cy="25%" r="4" fill="#fde047" />
                    <circle cx="35%" cy="75%" r="4" fill="#fde047" />
                    <circle cx="75%" cy="45%" r="4" fill="#fde047" />
                    <circle cx="85%" cy="15%" r="4" fill="#fde047" />
                </svg>
            </div>
        );
    }

    // ==========================================
    // 21. PLINKO DROP (Elite Triangle Arcade) - [₹12,000 TIER]
    // ==========================================
    if (stylePreference === 'plinko_drop') {
        // --- 1. CONFIGURATION (Edit prizes here) ---
        const buckets = [
            { label: 'Pushups x10', color: 'text-slate-500' },
            { label: 'VIP BADGE', color: 'text-emerald-400' },
            { label: 'JACKPOT x2', color: 'text-yellow-400', glow: true }, // The winning bucket
            { label: 'Sing a Song', color: 'text-cyan-400' },
            { label: 'No Prize', color: 'text-red-500' }
        ];

        // --- 2. ADVANCED PHYSICS SIMULATION KEYFRAMES ---
        // Suspenseful, chaotic path bouncing off pegs, then hitting Jackpot
        const coinPathX = [0, -40, 60, -80, 20, -100, 30, -50, 0, 0];
        const coinPathY = [0, 40, 80, 120, 160, 200, 240, 280, 320, 340];
        const coinRotate = [0, 180, -180, 360, -360, 720, -720, 1080, 1440, 0];

        // Pegs layout (Pyramid/Triangle formation)
        const totalRows = 8;

        return (
            <div className="relative w-full max-w-lg mx-auto h-[400px] flex items-center justify-center overflow-hidden bg-[#020617] rounded-b-3xl shadow-[0_30px_60px_rgba(0,0,0,1)] perspective-1000">

                {/* GLOBAL KEYFRAMES & STYLES (Scope to this style only) */}
                <style>{`
                  @keyframes neon-peg { 0%, 100% { box-shadow: 0 0 5px #facc15; } 50% { box-shadow: 0 0 15px #facc15, 0 0 20px #fff; } }
                  @keyframes laser-grid { 0% { background-position: 0 0; } 100% { background-position: 0 1000px; } }
                `}</style>

                {/* Background Atmosphere: Scrolling Laser Grid */}
                <div className="absolute inset-0 bg-[#020617] bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30 animate-[laser-grid_10s_linear_infinite]" />

                {/* 1. Main Triangle Container (The Plinko Board) */}
                <div className="relative w-full h-[350px] bg-slate-900 border-[10px] border-slate-800" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black/80" />

                    {/* Interior Glowing Edges */}
                    <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(34,211,238,0.3)] pointer-events-none z-10" />

                    {/* Pegs Generation (Pyramid shape) */}
                    <div className="absolute inset-0 flex flex-col pt-16 z-10 px-6">
                        {Array.from({ length: totalRows }).map((_, rowIndex) => {
                            const pegsInRow = rowIndex + 2; // Rows increase by 1 peg
                            const stagger = rowIndex % 2 === 0;

                            return (
                                <div key={rowIndex} className={`flex justify-center gap-6 ${stagger ? 'pl-8' : 'pr-8'} mb-6`}>
                                    {Array.from({ length: pegsInRow }).map((_, pegIndex) => (
                                        <motion.div
                                            key={`${rowIndex}-${pegIndex}`}
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 + Math.random(), delay: Math.random() }}
                                            className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-white animate-[neon-peg_2s_infinite]"
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Top Spawner Hook */}
                <div className="absolute top-0 w-40 h-10 bg-slate-800 border-b-4 border-cyan-500 rounded-b-xl z-20 flex items-center justify-center shadow-lg transform translate-y-[-50%]">
                    <span className="text-cyan-300 font-mono font-black text-[10px] tracking-widest uppercase flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> INCOMING COIN
                    </span>
                </div>

                {/* 3. The Dropping Coin ( suspenseful physics ) */}
                <motion.div
                    initial={{ y: 0, x: 0 }}
                    animate={{ y: coinPathY, x: coinPathX, rotate: coinRotate }}
                    transition={{ duration: 3.5, ease: "linear" }} // Increased duration for suspense
                    className="absolute top-[-10px] z-30 w-16 h-16 rounded-full overflow-hidden flex items-center justify-center border-[6px] border-yellow-400 bg-slate-950 shadow-[0_0_50px_rgba(250,204,21,0.6)] backdrop-blur-sm transform-style-3d"
                >
                    <div className="absolute inset-0 border-[6px] border-dashed border-white opacity-40 rounded-full animate-[spin_5s_linear_infinite]" />
                    {customAvatar ? (
                        <img src={getOptimizedImage(customAvatar, 200)} alt="Donor" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-yellow-400 font-black text-3xl font-mono">₹</span>
                    )}
                </motion.div>

                {/* 4. Bottom Prize Buckets (Aligned to triangle base) */}
                <div className="absolute bottom-0 w-[96%] h-24 flex z-20 rounded-t-xl overflow-hidden border-t-8 border-slate-700">
                    {buckets.map((bucket, index) => (
                        <div key={index} className={`flex-1 border-r-2 border-slate-800 last:border-r-0 flex flex-col items-center justify-end pb-3 text-center px-1 ${bucket.glow ? 'bg-yellow-950/40 shadow-[inset_0_-30px_60px_rgba(234,179,8,0.5)]' : 'bg-slate-950'}`}>
                            <span className={`font-black text-[9px] uppercase tracking-widest ${bucket.color}`}>{bucket.label}</span>
                            {bucket.glow && <div className="absolute bottom-1 w-12 h-1 bg-yellow-400 rounded-full blur-[4px] animate-pulse" />}
                        </div>
                    ))}
                </div>

                {/* 5. Winner Reveal Banner (Appears with delay) */}
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 3.8, type: "spring", bounce: 0.6 }}
                    className="absolute bottom-28 w-[90%] bg-black/90 p-4 rounded-2xl border-4 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.6)] z-40 text-center"
                >
                    <Sparkles className="absolute top-2 right-2 w-5 h-5 text-yellow-400 opacity-50" />
                    <h4 className="text-slate-400 text-[10px] uppercase font-mono tracking-widest mb-1 flex items-center gap-1 justify-center">
                        <Trophy className="w-3 h-3 text-yellow-500" /> SUPPORTER DEPOSIT ACCEPTED
                    </h4>
                    <h2 className="text-white font-serif font-black text-4xl uppercase tracking-tighter drop-shadow-[0_0_10px_#fff] leading-tight">{donorName}</h2>
                    <div className="bg-yellow-950 px-8 py-2 border-y-2 border-yellow-500 my-2 shadow-inner">
                        <span className="text-yellow-300 font-black text-4xl font-mono">₹{amount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-yellow-100 italic text-sm line-clamp-2 px-6">"{message}"</p>
                </motion.div>
            </div>
        );
    }

    return null;
});

export default PremiumAlertPreview;
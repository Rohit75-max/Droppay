import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Heart, Zap } from 'lucide-react';

// --- Simulated live donation alerts for the OBS-style badge ---
const LIVE_ALERTS = [
    { user: 'NightOwl_Dev', amount: '$25.00', msg: 'Keep grinding! 🔥', platform: 'twitch', color: '#9146FF' },
    { user: 'xSakura99', amount: '$50.00', msg: 'First drop! Let\'s go!', platform: 'youtube', color: '#FF0000' },
    { user: 'CodeWithKai', amount: '$10.00', msg: 'Love the stream ❤️', platform: 'kick', color: '#53FC18' },
    { user: 'StreamFan42', amount: '$100.00', msg: 'HYPE HYPE HYPE 🚀', platform: 'twitch', color: '#9146FF' },
];

const PlatformDot = ({ color }) => (
    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
);

const AlertBadge = () => {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIdx(p => (p + 1) % LIVE_ALERTS.length), 3200);
        return () => clearInterval(t);
    }, []);

    const alert = LIVE_ALERTS[idx];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute -bottom-6 -left-6 md:-left-12 z-20 hidden md:block"
        >
            {/* OBS-style alert card */}
            <div className="bg-zinc-900/95 border border-white/10 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl w-72">
                {/* Header bar */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-400">live alert</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#afff00]/10 border border-[#afff00]/20 px-2 py-0.5 rounded-full">
                        <Zap className="w-2.5 h-2.5 text-[#afff00]" />
                        <span className="font-mono text-[7px] text-[#afff00] uppercase tracking-widest">instant</span>
                    </div>
                </div>

                {/* Alert content — cycles through donors */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.35 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <Heart className="w-4 h-4 text-rose-400" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <PlatformDot color={alert.color} />
                                <span className="font-sans font-black text-xs text-white truncate">{alert.user}</span>
                                <span className="font-mono text-[10px] text-[#afff00] font-bold ml-auto shrink-0">{alert.amount}</span>
                            </div>
                            <span className="font-mono text-[9px] text-zinc-400 truncate">{alert.msg}</span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress bar */}
                <div className="mt-3 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        key={idx}
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 3.2, ease: 'linear' }}
                        className="h-full bg-[#afff00]/60 rounded-full"
                    />
                </div>
            </div>
        </motion.div>
    );
};

const Hero = () => {
    return (
        <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-32 pb-20 px-[clamp(1.5rem,5vw,4rem)] overflow-hidden bg-black text-white">
            {/* Background Blueprint Grid */}
            <div className="absolute inset-0 blueprint-grid opacity-[0.05] pointer-events-none z-0" />

            {/* Soft Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[30vh] bg-[#afff00]/10 blur-[120px] pointer-events-none z-0" />

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                {/* --- LEFT: COPY & CTAS --- */}
                <div className="flex-1 flex flex-col items-start text-left z-20">

                    {/* Live status pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 shadow-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#afff00] relative">
                            <span className="animate-ping absolute inset-0 rounded-full bg-[#afff00] opacity-50"></span>
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/80">For Streamers & Developers</span>
                    </motion.div>

                    {/* Main headline — creator-first messaging */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="font-sans font-black text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.95] uppercase tracking-tighter mb-6 relative"
                    >
                        They Donate.<br />
                        <span className="text-[#afff00] drop-shadow-[0_0_15px_rgba(175,255,0,0.3)]">
                            You Know.
                        </span>
                        <br />
                        Instantly.
                    </motion.h1>

                    {/* Sub copy — hits all 3 differentiators */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="font-mono text-[clamp(10px,1.2vw,14px)] leading-[1.8] tracking-[0.1em] text-zinc-400 max-w-lg mb-10"
                    >
                        Real-time stream alerts the moment your audience pays.
                        The lowest commission on the market — and setup takes under 5 minutes.
                    </motion.p>

                    {/* Key proof stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                        className="flex items-center gap-8 mb-10"
                    >
                        {[
                            { label: 'Commission', value: '2.5%', note: 'market low' },
                            { label: 'Alert Speed', value: '<1s', note: 'on stream' },
                            { label: 'Setup Time', value: '5 min', note: 'go live fast' },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="font-sans font-black text-[clamp(1.3rem,2.5vw,2rem)] text-white tracking-tighter">{stat.value}</span>
                                <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">{stat.label}</span>
                                <span className="font-mono text-[7px] text-[#afff00]/70 tracking-wider">{stat.note}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
                    >
                        <Link
                            to="/signup"
                            id="hero-cta-primary"
                            className="w-full sm:w-auto group relative px-10 py-5 bg-[#afff00] text-black font-black uppercase text-[12px] tracking-[0.2em] overflow-hidden rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] shadow-[0_0_20px_rgba(175,255,0,0.2)] active:scale-95 transition-all"
                        >
                            <span className="relative z-10">Start Earning Free</span>
                            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <button
                            id="hero-cta-secondary"
                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto group px-10 py-5 bg-transparent border border-white/10 hover:border-white/30 hover:bg-white/[0.03] text-white font-bold uppercase text-[12px] tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 transition-colors active:scale-95"
                        >
                            <Play className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                            See How It Works
                        </button>
                    </motion.div>
                </div>

                {/* --- RIGHT: ANIMATED PAYMENT TERMINAL MOCKUP --- */}
                <motion.div
                    initial={{ opacity: 0, x: 50, rotateY: 15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ perspective: 1200 }}
                    className="flex-1 w-full relative mt-16 lg:mt-0 z-10"
                >
                    <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#0A0A0A]/80 border border-white/10 shadow-[0_0_80px_rgba(175,255,0,0.06)] backdrop-blur-2xl overflow-hidden flex flex-col group">

                        {/* Mockup Header */}
                        <div className="h-12 border-b border-white/10 flex items-center px-5 gap-2.5 bg-gradient-to-b from-white/[0.04] to-transparent">
                            <div className="w-3 h-3 rounded-full border border-white/20 bg-white/5 group-hover:bg-rose-500/20 transition-colors" />
                            <div className="w-3 h-3 rounded-full border border-white/20 bg-white/5 group-hover:bg-amber-500/20 transition-colors" />
                            <div className="w-3 h-3 rounded-full border border-white/20 bg-white/5 group-hover:bg-emerald-500/20 transition-colors" />
                            <div className="ml-4 font-mono text-[9px] text-zinc-500 uppercase tracking-[0.2em]">Droppay_Terminal.live</div>
                            <div className="ml-auto flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="font-mono text-[7px] text-emerald-400 uppercase tracking-widest">live</span>
                            </div>
                        </div>

                        {/* Mockup Content Grid */}
                        <div className="flex-1 p-6 grid grid-cols-2 gap-5 pointer-events-none">

                            {/* Revenue card */}
                            <div className="col-span-2 rounded-xl border border-[#afff00]/30 bg-[#afff00]/5 p-5 flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#afff00]/10 blur-3xl rounded-full" />
                                <div className="relative z-10">
                                    <span className="font-mono text-[9px] text-[#afff00] uppercase tracking-widest block mb-1">Tonight's Earnings</span>
                                    <span className="font-sans font-black text-4xl lg:text-5xl text-white tracking-tighter block">$1,842.50</span>
                                    <span className="font-mono text-[8px] text-zinc-500 mt-1 block">+$124.00 last 5 min</span>
                                </div>
                                <div className="mt-4 flex items-end gap-1.5 h-12 opacity-80 relative z-10">
                                    {[0.3, 0.5, 0.4, 0.7, 0.6, 0.9, 1].map((val, i) => (
                                        <div key={i} className="flex-1 bg-gradient-to-t from-[#afff00] to-[#afff00]/70 rounded-t-sm" style={{ height: `${val * 100}%` }} />
                                    ))}
                                </div>
                            </div>

                            {/* Alert queue */}
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col gap-2">
                                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Alert Queue</span>
                                {[
                                    { user: 'NightOwl', amt: '$25', color: '#9146FF' },
                                    { user: 'CodeKai', amt: '$10', color: '#53FC18' },
                                    { user: 'xSakura', amt: '$50', color: '#FF0000' },
                                ].map((a, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.color }} />
                                        <span className="font-mono text-[8px] text-zinc-400 flex-1 truncate">{a.user}</span>
                                        <span className="font-mono text-[8px] text-[#afff00]">{a.amt}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Commission card */}
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between">
                                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Commission</span>
                                <div className="flex flex-col mt-auto">
                                    <span className="font-sans font-black text-2xl text-white tracking-tighter">2.5%</span>
                                    <span className="font-mono text-[7px] text-[#afff00] tracking-wider mt-0.5">Market Low ✓</span>
                                    <span className="font-mono text-[7px] text-zinc-600 mt-1">vs 2.9% industry avg</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OBS-style live alert badge */}
                    <AlertBadge />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

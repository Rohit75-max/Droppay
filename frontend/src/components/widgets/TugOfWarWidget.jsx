import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Timer, Zap, Flame } from 'lucide-react';

/**
 * TUG-OF-WAR (Wallet Voting Widget)
 * Ultra-Premium OBS Overlay. Pits two options against each other to trigger bidding wars.
 */
const TugOfWarWidget = ({
    title = "WHERE SHOULD I DROP?",
    timeRemaining = "04:59",
    teamA = { name: "POCHINKI", color: "from-red-600 to-red-400", shadow: "shadow-[0_0_20px_rgba(220,38,38,0.6)]", amount: 15200 },
    teamB = { name: "MILITARY BASE", color: "from-blue-600 to-blue-400", shadow: "shadow-[0_0_20px_rgba(37,99,235,0.6)]", amount: 8400 },
    lastStrike = null // { name: "GamerXYZ", amount: 500, side: "A" }
}) => {

    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setPulse(p => !p), 2000);
        return () => clearInterval(interval);
    }, []);

    // Calculate the percentage of the rope Team A controls (Team B gets the rest)
    const totalAmount = (teamA.amount || 0) + (teamB.amount || 0);
    // Default to 50% if no one has donated yet to keep the bar perfectly centered
    const percentA = totalAmount === 0 ? 50 : (teamA.amount / totalAmount) * 100;

    return (
        <div className="w-full max-w-4xl mx-auto p-6 font-sans">

            {/* 1. Header & Timer */}
            <div className="flex justify-between items-end mb-4 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0a0a0a] border border-slate-700 flex items-center justify-center shadow-[4px_4px_0_#000]" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%, 0 20%)' }}>
                        <Swords className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                        <h2 className="text-white font-black text-2xl uppercase tracking-widest italic drop-shadow-[2px_2px_0_#000]">
                            {title}
                        </h2>
                        <span className="text-slate-400 font-bold text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
                            <motion.div animate={{ opacity: pulse ? 1 : 0.4 }} className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Live Wallet Voting
                        </span>
                    </div>
                </div>

                {/* Urgency Timer */}
                <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/50 px-4 py-2 shadow-[0_0_15px_rgba(220,38,38,0.3)]" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)' }}>
                    <Timer className="w-4 h-4 text-red-500 animate-pulse" />
                    <span className="text-red-100 font-mono font-black text-xl tracking-tighter">{timeRemaining}</span>
                </div>
            </div>

            {/* 2. The Main Tug-of-War Bar Container */}
            <div className="relative w-full h-16 bg-[#050505] border-[3px] border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-1 flex" style={{ clipPath: 'polygon(2% 0, 98% 0, 100% 50%, 98% 100%, 2% 100%, 0 50%)' }}>

                {/* Background Grid Texture */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

                {/* TEAM A FILL (Left Side) */}
                <motion.div
                    initial={{ width: '50%' }}
                    animate={{ width: `${percentA}%` }}
                    transition={{ type: "spring", bounce: 0.4, duration: 1 }}
                    className={`h-full bg-gradient-to-r ${teamA.color || 'from-red-600 to-red-400'} ${teamA.shadow || ''} relative flex items-center justify-start px-4 overflow-hidden`}
                >
                    <span className="text-white font-black text-2xl italic tracking-tighter drop-shadow-[2px_2px_0_#000] z-10">{teamA.name}</span>
                    <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 translate-x-full animate-[pulse_2s_infinite]" />
                </motion.div>

                {/* TEAM B FILL (Right Side) */}
                <motion.div
                    initial={{ width: '50%' }}
                    animate={{ width: `${100 - percentA}%` }}
                    transition={{ type: "spring", bounce: 0.4, duration: 1 }}
                    className={`h-full bg-gradient-to-l ${teamB.color || 'from-blue-600 to-blue-400'} ${teamB.shadow || ''} relative flex items-center justify-end px-4 overflow-hidden`}
                >
                    <span className="text-white font-black text-2xl italic tracking-tighter drop-shadow-[2px_2px_0_#000] z-10">{teamB.name}</span>
                </motion.div>

                {/* THE "KNOT" (The glowing center divider that slides) */}
                <motion.div
                    initial={{ left: '50%' }}
                    animate={{ left: `${percentA}%` }}
                    transition={{ type: "spring", bounce: 0.4, duration: 1 }}
                    className="absolute top-[-10px] bottom-[-10px] w-4 bg-white shadow-[0_0_30px_#fff,0_0_10px_#fff] z-20 flex items-center justify-center transform -translate-x-1/2 -skew-x-12 border-x-2 border-slate-900"
                >
                    <div className="w-1 h-8 bg-black/30" />
                </motion.div>
            </div>

            {/* 3. Stats & Recent Pull Alert */}
            <div className="flex justify-between items-start mt-4 px-2">
                {/* Team A Total */}
                <div className="flex flex-col items-start gap-1">
                    <span className="text-red-400 font-mono font-black text-3xl drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">₹{(teamA.amount || 0).toLocaleString()}</span>
                    {percentA > 60 && <Flame className="w-4 h-4 text-red-500 animate-bounce" />}
                </div>

                {/* Live Action Feed (Pops up when someone donates) */}
                <AnimatePresence mode="wait">
                    {lastStrike && lastStrike.name && (
                        <motion.div
                            key={lastStrike.name + lastStrike.amount}
                            initial={{ y: 20, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="flex flex-col items-center bg-[#0a0a0a]/80 backdrop-blur-md border border-slate-700 px-6 py-2 shadow-[0_10px_20px_#000]"
                            style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}
                        >
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-yellow-400" /> Massive Pull! <Flame className="w-3 h-3 text-orange-500" />
                            </span>
                            <div className="text-white text-sm font-black italic">
                                <span className={lastStrike.side === 'A' ? 'text-red-400' : 'text-blue-400'}>{lastStrike.name}</span> dropped ₹{lastStrike.amount} for {lastStrike.side === 'A' ? teamA.name : teamB.name}!
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Team B Total */}
                <div className="flex flex-col items-end gap-1">
                    <span className="text-blue-400 font-mono font-black text-3xl drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]">₹{(teamB.amount || 0).toLocaleString()}</span>
                    {percentA < 40 && <Flame className="w-4 h-4 text-blue-500 animate-bounce" />}
                </div>
            </div>
        </div>
    );
};

export default TugOfWarWidget;

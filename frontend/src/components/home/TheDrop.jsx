import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap, GitMerge } from 'lucide-react';

// Stream-style donation feed — real product language
const STREAM_FEED = [
    { user: 'NightOwl_Dev', platform: 'Twitch', amount: '$25.00', msg: '🔥 Keep grinding!', time: '0s ago', platformColor: '#9146FF' },
    { user: 'xSakura99', platform: 'YouTube', amount: '$50.00', msg: 'First drop lets go!', time: '12s ago', platformColor: '#FF0000' },
    { user: 'CodeWithKai', platform: 'Kick', amount: '$10.00', msg: '❤️ Love the stream', time: '31s ago', platformColor: '#53FC18' },
    { user: 'StreamFan42', platform: 'Twitch', amount: '$100.00', msg: '🚀 HYPE HYPE HYPE', time: '58s ago', platformColor: '#9146FF' },
    { user: 'PixelRaider', platform: 'YouTube', amount: '$15.00', msg: 'Best stream ever!', time: '1m ago', platformColor: '#FF0000' },
];

const FeedRow = ({ donor, isNew }) => (
    <motion.div
        initial={isNew ? { opacity: 0, x: 16, backgroundColor: 'rgba(175,255,0,0.07)' } : { opacity: 1 }}
        animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(0,0,0,0)' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
    >
        <div className="flex items-center gap-3">
            {/* Platform indicator dot */}
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: donor.platformColor }} />
            <div className="flex flex-col">
                <span className="font-sans font-black text-sm text-white tracking-tight">{donor.user}</span>
                <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">{donor.platform}</span>
            </div>
        </div>

        <div className="flex items-center gap-5">
            <span className="hidden md:block font-mono text-[9px] text-zinc-600 italic truncate max-w-[140px]">"{donor.msg}"</span>
            <span className="font-mono text-[10px] font-black text-[#afff00]">{donor.amount}</span>
            <span className="font-mono text-[8px] text-zinc-600">{donor.time}</span>
        </div>
    </motion.div>
);

export const TheDrop = () => {
    const [feed, setFeed] = useState(STREAM_FEED);
    const [newIdx, setNewIdx] = useState(null);

    // Simulate live donations coming in
    useEffect(() => {
        const simulateDonations = [
            { user: 'DragonSlayer_X', platform: 'Twitch', amount: '$75.00', msg: '💜 PogChamp!', time: 'just now', platformColor: '#9146FF' },
            { user: 'MidnightCoder', platform: 'Kick', amount: '$20.00', msg: 'W stream fr fr', time: 'just now', platformColor: '#53FC18' },
        ];

        let i = 0;
        const t = setInterval(() => {
            const newDonor = simulateDonations[i % simulateDonations.length];
            i++;
            setFeed(prev => {
                const updated = [newDonor, ...prev.slice(0, 4)];
                setNewIdx(0);
                return updated;
            });
        }, 4000);

        return () => clearInterval(t);
    }, []);

    return (
        <section
            id="how-it-works"
            className="bg-black text-white px-[clamp(1.5rem,5vw,4rem)] py-24 md:py-32 relative z-30 overflow-hidden flex flex-col"
        >
            {/* Standard Boundary Line */}
            <div className="w-full border-t border-white/10 absolute top-0 left-0 right-0 z-20" />

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

                {/* --- LEFT: COPY --- */}
                <div className="flex-1 max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#afff00] mb-6 block">Zero Delay</span>
                        <h2 className="font-sans font-black text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.05] uppercase tracking-tighter mb-6">
                            Alert fires<br />
                            <span className="text-zinc-500">before they refresh.</span>
                        </h2>
                        <p className="font-mono text-[clamp(11px,1.2vw,14px)] leading-relaxed tracking-wider text-zinc-400 mb-10">
                            The moment a payment clears, Droppay fires an instant alert to your OBS overlay.
                            No refresh, no delay, no middle-man. Your stream keeps rolling — your audience stays engaged.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Bell className="w-4 h-4 text-[#afff00]" />
                                </div>
                                <div>
                                    <h4 className="font-sans font-black text-sm uppercase tracking-tight text-white mb-1">Instant OBS Alert</h4>
                                    <p className="font-mono text-[9px] text-zinc-500">Fires to your overlay in under one second.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <GitMerge className="w-4 h-4 text-[#afff00]" />
                                </div>
                                <div>
                                    <h4 className="font-sans font-black text-sm uppercase tracking-tight text-white mb-1">Any Platform</h4>
                                    <p className="font-mono text-[9px] text-zinc-500">Twitch, YouTube, Kick — one dashboard.</p>
                                </div>
                            </div>
                        </div>

                        {/* Instant payout callout */}
                        <div className="mt-10 flex items-center gap-3 p-4 rounded-xl border border-[#afff00]/20 bg-[#afff00]/5">
                            <Zap className="w-4 h-4 text-[#afff00] shrink-0" />
                            <p className="font-mono text-[10px] text-zinc-300 leading-relaxed">
                                <span className="text-[#afff00] font-bold">Instant payouts</span> — no more T+3 holds.
                                Money lands in your account the same session.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* --- RIGHT: LIVE STREAM DONATION FEED --- */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="flex-1 w-full relative"
                >
                    <div className="absolute inset-0 bg-[#afff00]/5 blur-3xl rounded-full" />

                    <div className="relative w-full rounded-2xl border border-white/10 bg-[#111] overflow-hidden flex flex-col shadow-2xl">

                        {/* Terminal header */}
                        <div className="h-12 border-b border-white/10 bg-white/[0.02] flex items-center justify-between px-6">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">Live Donation Feed</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-[#afff00]/10 border border-[#afff00]/20 px-2 py-1 rounded-full">
                                <Bell className="w-2.5 h-2.5 text-[#afff00]" />
                                <span className="font-mono text-[7px] text-[#afff00] uppercase tracking-widest">alerts on</span>
                            </div>
                        </div>

                        {/* Column headers */}
                        <div className="px-6 py-2 flex items-center justify-between border-b border-white/5">
                            <span className="font-mono text-[7px] uppercase tracking-widest text-zinc-600">donor / platform</span>
                            <div className="flex items-center gap-5">
                                <span className="hidden md:block font-mono text-[7px] uppercase tracking-widest text-zinc-600">message</span>
                                <span className="font-mono text-[7px] uppercase tracking-widest text-zinc-600">amount</span>
                                <span className="font-mono text-[7px] uppercase tracking-widest text-zinc-600">time</span>
                            </div>
                        </div>

                        {/* Feed rows */}
                        <div className="flex-1 flex flex-col divide-y divide-white/5">
                            <AnimatePresence initial={false}>
                                {feed.map((donor, idx) => (
                                    <FeedRow key={`${donor.user}-${idx}`} donor={donor} isNew={idx === newIdx} />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="h-10 border-t border-white/5 bg-white/[0.01] flex items-center justify-between px-6">
                            <span className="font-mono text-[7px] text-zinc-600 uppercase tracking-widest">Processing via Droppay</span>
                            <span className="font-mono text-[7px] text-[#afff00] uppercase tracking-widest">2.5% commission only</span>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* Tactical Glow (Bottom) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[20vh] bg-[#afff00]/5 blur-[120px] pointer-events-none" />
        </section>
    );
};

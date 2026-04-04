import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Send, ShieldCheck } from 'lucide-react';

const CHAT_GHOSTS = [
    { user: "StreamKing", msg: "Drope is insane!", type: "hype" },
    { user: "PogChamp99", msg: "W in the chat", type: "system" },
    { user: "NightOwl", msg: "Zero fees? massive W", type: "hype" },
    { user: "CreatorPro", msg: "Payout received instantly 🚀", type: "success" },
    { user: "GamerGirl", msg: "This UI is fire", type: "system" },
    { user: "DropeBot", msg: "/claim triggered", type: "bot" },
];

const SOCIAL_PROOF = [
    "📌 OVERRIDE ALERT: Over $50,000 processed instantly today.",
    "📌 SYSTEM STATUS: 1,420 streamers currently live with Drope.",
    "📌 NETWORK STATS: Sub-12ms global localized latency.",
    "📌 SECURITY: $0.00 chargeback loss for all partners this week."
];

export const HypeChatFooter = ({ scrollContainerRef }) => {
    const [isClaiming, setIsClaiming] = useState(false);
    const [statsIndex, setStatsIndex] = useState(0);
    const [claimText, setClaimText] = useState("");
    const navigate = useNavigate();
    const footerRef = useRef(null);

    // Scroll progress for the giant marquee (synced to the footer's presence)
    const { scrollYProgress } = useScroll({
        target: footerRef,
        container: scrollContainerRef,
        offset: ["start end", "end end"]
    });

    const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

    // Cycle social proof alerts
    useEffect(() => {
        const interval = setInterval(() => {
            setStatsIndex((prev) => (prev + 1) % SOCIAL_PROOF.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleClaim = (e) => {
        e.preventDefault();
        if (!claimText.trim()) return;
        
        setIsClaiming(true);
        // Morph duration matched to navigate
        setTimeout(() => {
            // Optional: Pass the name as a query param
            navigate(`/register?claim=${encodeURIComponent(claimText)}`);
        }, 800);
    };

    return (
        <footer 
            ref={footerRef}
            className="relative bg-[#0A0A0A] border-t border-white/5 pt-32 pb-10 overflow-hidden flex flex-col items-center justify-between min-h-screen"
        >
            {/* LAYER 1: THE SPATIAL CHAT BACKGROUND (SCROLLING UP) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] select-none flex flex-col gap-8 py-10">
                <motion.div 
                    animate={{ y: [0, -1000] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="flex flex-col gap-12 w-full px-12"
                >
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/10" />
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-black uppercase tracking-widest text-[#afff00]">
                                    {CHAT_GHOSTS[i % CHAT_GHOSTS.length].user}
                                </span>
                                <span className="text-xl font-bold text-white uppercase tracking-tight">
                                    {CHAT_GHOSTS[i % CHAT_GHOSTS.length].msg}
                                </span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* LAYER 2: PINNED SUPERCHAT (LIVE ALERTS) */}
            <div className="relative z-20 w-fit mx-auto px-6 mb-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={statsIndex}
                        initial={{ y: -20, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-[#afff00]/10 border border-[#afff00]/30 backdrop-blur-3xl px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_40px_rgba(175,255,0,0.1)]"
                    >
                        <ShieldCheck className="w-4 h-4 text-[#afff00]" />
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#afff00]">
                            {SOCIAL_PROOF[statsIndex]}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* LAYER 3: INTERACTIVE CTA (THE HYPE CHAT INPUT) */}
            <div className="relative z-30 w-full max-w-2xl px-6 text-center">
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-white mb-10 leading-none">
                    Start Your <br />
                    <span className="text-[#afff00] italic">Drope Era.</span>
                </h2>

                <form onSubmit={handleClaim} className="relative flex items-center justify-center">
                    <motion.div
                        initial={false}
                        animate={{ 
                            width: isClaiming ? "64px" : "100%",
                            borderRadius: isClaiming ? "50%" : "2rem"
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="h-16 md:h-20 bg-white/[0.03] border border-white/10 backdrop-blur-3xl flex items-center justify-center overflow-hidden shadow-2xl relative"
                    >
                        {!isClaiming ? (
                            <div className="w-full flex items-center px-6 md:px-10 gap-4">
                                <span className="text-[#afff00] text-xl md:text-2xl font-black mb-1">&gt;</span>
                                <input 
                                    type="text" 
                                    value={claimText}
                                    onChange={(e) => setClaimText(e.target.value.toLowerCase())}
                                    placeholder="Type /claim to reserve your link..."
                                    className="flex-1 bg-transparent border-none outline-none text-white text-base md:text-xl font-bold placeholder:text-white/20 uppercase tracking-tight"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1, x: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="submit"
                                    className="w-10 h-10 md:w-12 md:h-12 bg-[#afff00] text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(175,255,0,0.3)] cursor-pointer"
                                >
                                    <Send className="w-4 h-4 md:w-5 md:h-5" />
                                </motion.button>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.5, rotate: 0 }} 
                                animate={{ opacity: 1, scale: 1, rotate: 360 }} 
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-8 h-8 md:w-10 md:h-10 border-4 border-[#afff00]/30 border-t-[#afff00] rounded-full" 
                            />
                        )}
                    </motion.div>
                </form>

                <p className="mt-8 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/30">
                    Trusted by 2,400+ Creators Globally.
                </p>
            </div>

            {/* LAYER 4: MARQUEE ANCHOR (SCROLL-SYNCED) */}
            <div className="w-full mt-20 md:mt-24">
                <div className="w-full overflow-hidden flex relative">
                   <motion.div
                        style={{ x: marqueeX }}
                        className="flex whitespace-nowrap items-center w-fit"
                    >
                        {Array(12).fill("drope.in").map((text, i) => (
                            <div key={i} className="flex items-center">
                                <span className="text-[100px] md:text-[240px] font-black uppercase tracking-tighter text-white/5 leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                                    {text}
                                </span>
                                <div className="w-[3vw] h-[3vw] max-w-[20px] max-h-[20px] bg-white opacity-[0.03] rounded-full mx-10 md:mx-20" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Traditional Links Context (Hidden slightly for cleaner vibe) */}
            <div className="w-full grid grid-cols-3 gap-10 px-12 md:px-24 mb-10 opacity-20 hover:opacity-100 transition-opacity duration-700">
                {[
                    { label: "Core", links: ["Features", "Network", "Nodes"] },
                    { label: "Security", links: ["TLS 1.3", "AES-256", "VPC"] },
                    { label: "Legal", links: ["Privacy", "Terms", "SLA"] }
                ].map((group, i) => (
                    <div key={i} className="flex flex-col gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#afff00]">{group.label}</span>
                        {group.links.map(link => (
                            <span key={link} className="text-[11px] font-bold uppercase text-white/40 cursor-pointer">{link}</span>
                        ))}
                    </div>
                ))}
            </div>
        </footer>
    );
};

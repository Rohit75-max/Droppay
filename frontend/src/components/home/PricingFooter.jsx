import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// --- SUB-COMPONENT: SCRAMBLE MACHINE ---
// Fixed Jitter Bug: Uses tabular-nums and width-locking parent.
const ScrambleText = ({ text, theme = 'dark' }) => {
    const [display, setDisplay] = useState(text);
    const [isScrambling, setIsScrambling] = useState(false);
    const containerRef = useRef(null);
    const [fixedWidth, setFixedWidth] = useState(null);
    
    const chars = "0123456789$.,";

    useEffect(() => {
        if (containerRef.current && !fixedWidth) {
            setFixedWidth(containerRef.current.offsetWidth);
        }
    }, [text, fixedWidth]);

    const handleScramble = () => {
        if (isScrambling) return;
        setIsScrambling(true);
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(
                text.split("").map((char, index) => {
                    if (index < iteration) return text[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );
            if (iteration >= text.length) {
                clearInterval(interval);
                setIsScrambling(false);
                setDisplay(text);
            }
            iteration += 1 / 3;
        }, 30);
    };

    return (
        <span 
            ref={containerRef}
            onMouseEnter={handleScramble}
            style={{ 
                width: fixedWidth ? `${fixedWidth}px` : 'auto',
                display: 'inline-block',
                fontVariantNumeric: 'tabular-nums' 
            }}
            className="cursor-default select-none"
        >
            {display}
        </span>
    );
};

// --- SUB-COMPONENT: MAGNETIC CTA ---
const MagneticButton = ({ children, onClick }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
    const buttonRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!window.matchMedia('(pointer: fine)').matches) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        // 40px capture radius outside physical boundaries
        if (distance < (width / 2 + 40)) {
            // 20% Pull Factor
            mouseX.set(distanceX * 0.2);
            mouseY.set(distanceY * 0.2);
        } else {
            mouseX.set(0);
            mouseY.set(0);
        }
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            className="relative"
        >
            <motion.button
                onClick={onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-5 md:px-12 md:py-8 bg-white overflow-hidden rounded-full shadow-2xl flex items-center gap-4 transition-all duration-500"
            >
                {/* Neon Wipe Overlay */}
                <div className="absolute inset-0 bg-[#afff00] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-[0.22,1,0.36,1]" />
                
                <span className="relative z-10 text-black font-black uppercase tracking-widest text-sm transition-colors duration-500">
                    Claim Your Link
                </span>
                
                <div className="relative z-10 flex items-center overflow-hidden h-6 w-8 border-l border-black/10 pl-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="arrow"
                            initial={{ x: 0 }}
                            whileHover={{ x: 40 }}
                            transition={{ duration: 0.3 }}
                            className="flex"
                        >
                            <ChevronRight className="w-6 h-6 shrink-0" />
                        </motion.div>
                    </AnimatePresence>
                    {/* Portal Entry Arrow */}
                    <div className="absolute left-[-40px] group-hover:left-[16px] transition-all duration-300 delay-100 pl-4">
                        <ChevronRight className="w-6 h-6" />
                    </div>
                </div>
                
                {/* Glow Bloom */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[0_0_60px_rgba(175,255,0,0.5)] transition-opacity duration-500" />
            </motion.button>
        </motion.div>
    );
};

// --- 3. SYSTEM HUD SUB-COMPONENT (DESKTOP ONLY) ---
const SystemHUD = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="hidden lg:flex flex-col items-end gap-6 text-right font-mono"
        >
            {/* Live Revenue Counter */}
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-white/20 uppercase tracking-[0.3em] mb-1">Total Revenue Synced.</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-[#afff00] text-xs">₹</span>
                    <motion.span 
                        className="text-2xl text-white font-black tabular-nums tracking-tighter"
                        animate={{ opacity: [1, 0.8, 1] }}
                        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                    >
                        12,450,231
                    </motion.span>
                </div>
            </div>

            {/* Network Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 border-t border-white/5 pt-4">
                {[
                    { label: 'Uplinks', val: '8,402', color: 'text-white' },
                    { label: 'Latency', val: '12ms', color: 'text-[#afff00]' },
                    { label: 'Uptime', val: '99.9%', color: 'text-white' },
                    { label: 'Region', val: 'AX-400', color: 'text-white/40' }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-end">
                        <span className="text-[8px] text-white/20 uppercase tracking-widest">{stat.label}</span>
                        <span className={`text-[11px] font-bold ${stat.color}`}>{stat.val}</span>
                    </div>
                ))}
            </div>

            {/* Live Status Pulse */}
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-sm border border-white/5 backdrop-blur-md">
                <div className="relative">
                    <div className="w-1.5 h-1.5 bg-[#afff00] rounded-full" />
                    <div className="absolute inset-0 w-1.5 h-1.5 bg-[#afff00] rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-[9px] text-white font-black uppercase tracking-[0.2em]">Global_Edge.ACTIVE</span>
            </div>
        </motion.div>
    );
};

export const PricingFooter = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const spotlightX = useMotionValue(0);
    const spotlightY = useMotionValue(0);
    const spotlightActive = useMotionValue(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scrollVelocity = useVelocity(scrollYProgress);
    const smoothVelocity = useSpring(scrollVelocity, { stiffness: 100, damping: 30 });
    const velocityFactor = useTransform(smoothVelocity, [-1, 0, 1], [-500, 0, 500]);
    
    const baseOffset = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const xOffset = useTransform([baseOffset, velocityFactor], ([base, vel]) => {
        return `calc(${base} + ${vel}px)`;
    });

    const handleMouseMove = (e) => {
        if (!window.matchMedia('(pointer: fine)').matches) return;
        const rect = containerRef.current.getBoundingClientRect();
        spotlightX.set(e.clientX - rect.left);
        spotlightY.set(e.clientY - rect.top);
        spotlightActive.set(1);
    };

    return (
        <footer 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => spotlightActive.set(0)}
            className="bg-[#0A0A0A] text-white pt-28 md:pt-24 pb-0 px-0 flex flex-col border-t border-white/5 overflow-hidden w-full relative min-h-[100dvh] lg:h-screen justify-between cursor-none"
        >
            {/* 1. REACTIVE CANVAS: SPOTLIGHT & EGGS */}
            <motion.div 
                className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
                style={{ 
                    background: useTransform(
                        [spotlightX, spotlightY, spotlightActive],
                        ([x, y, active]) => `radial-gradient(1000px circle at ${x}px ${y}px, rgba(175,255,0,0.08) 0%, transparent ${active * 100}%)`
                    )
                }}
            >
                {/* Easter Egg Revenue Grid */}
                <div className="absolute inset-0 opacity-[0.03] grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-12 p-12 select-none pointer-events-none">
                    {Array(48).fill(null).map((_, i) => (
                        <span key={i} className="text-[10px] font-black font-mono text-white/50 tracking-tighter">
                            ${(Math.random() * 10000 + 400).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    ))}
                </div>
            </motion.div>

            {/* Custom Mouse Follower Spotlight (Subtle) */}
            <motion.div
                className="fixed w-[20vw] h-[20vw] bg-[#afff00]/10 blur-[120px] rounded-full pointer-events-none z-50 mix-blend-screen hidden md:block"
                style={{
                    x: useSpring(spotlightX, { stiffness: 300, damping: 40 }),
                    y: useSpring(spotlightY, { stiffness: 300, damping: 40 }),
                    opacity: spotlightActive
                }}
            />

            <div className="px-6 md:px-12 lg:px-16 w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-16 mb-4 md:mb-12 relative z-10">
                <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
                    <h2 className="text-[clamp(2.5rem,11vw,4rem)] md:text-7xl font-black tracking-tighter uppercase leading-[0.85] md:leading-[0.8] mb-6 md:mb-8">
                        Own Your <br />
                        <span className="font-serif italic text-[#afff00] normal-case tracking-tight">
                            <ScrambleText text="Revenue." />
                        </span>
                    </h2>
                    <p className="text-[13px] md:text-xl font-medium text-white/60 leading-relaxed max-w-xl mx-auto md:mx-0">
                        Built for creators who treat their streams like a business. Whether you are hitting Affiliate or pulling 10k viewers, we provide the ultimate engine to scale your income.
                    </p>
                </div>

                {/* Right Side: Tactical System HUD */}
                <SystemHUD />
            </div>

            {/* Bottom Group Section */}
            <div className="flex flex-col w-full justify-end relative z-10">
                <div className="px-6 md:px-12 lg:px-16 pt-0 pb-4 md:pb-8 flex flex-col items-center md:items-start gap-6 md:gap-10">
                    {/* Unified Button Placement (Now Bottom Aligned) */}
                    <div className="flex mb-2 md:mb-6">
                        <MagneticButton onClick={() => navigate('/signup')} />
                    </div>

                    {/* Desktop Policy Links */}
                    <div className="hidden md:flex flex-wrap gap-8">
                        {['Billing Policy', 'Privacy Policy', 'Service SLA', 'Legal Notice'].map(s => (
                            <span key={s} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-[#afff00] cursor-pointer transition-colors underline-offset-4 hover:underline">{s}</span>
                        ))}
                    </div>
                    {/* Mobile Policy Links Refined */}
                    <div className="flex md:hidden flex-col w-full gap-5">
                       <div className="flex justify-center gap-6">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-[#afff00] cursor-pointer transition-colors">Billing Policy</span>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-[#afff00] cursor-pointer transition-colors">Privacy Policy</span>
                       </div>
                       <div className="flex justify-between w-full">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-[#afff00] cursor-pointer transition-colors">Service SLA</span>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-[#afff00] cursor-pointer transition-colors">Legal Notice</span>
                       </div>
                    </div>
                </div>

                {/* Massive Brand Marquee - Linked to Velocity */}
                <div className="w-full overflow-hidden flex relative pt-0 pb-0 mt-auto">
                    <motion.div
                        style={{ x: xOffset }}
                        className="flex whitespace-nowrap items-center w-fit py-2 md:py-4"
                    >
                        {Array(8).fill("drope.in").map((text, i) => (
                            <div key={i} className="flex items-center">
                                <span className="text-[72px] md:text-[140px] font-black uppercase tracking-tighter text-white opacity-[0.03] hover:opacity-100 transition-opacity duration-700 cursor-default" style={{ fontFamily: 'Georgia, serif' }}>
                                    {text}
                                </span>
                                <div className="w-[1vw] h-[1vw] max-w-[15px] max-h-[15px] bg-white/10 rounded-full mx-4 md:mx-12" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

export default PricingFooter;

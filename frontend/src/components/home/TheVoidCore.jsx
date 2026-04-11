import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- GEOMETRIC RINGS IN THE THEATER ---
const Ring = ({ index, title, text, subtext, progress, color = "#afff00" }) => {
    // Scroll progress stops: 0, 0.33, 0.66, 1
    let inputScale, inputOpacity;
    let outputScale = [0.4, 1, 3.5];
    let outputOpacity = [0, 1, 1, 0];
    let outputBlur = [20, 0, 0, 30];

    if (index === 0) {
        // Ring 1 (Ingestion) fades in quickly, peaks at 0.25
        inputScale = [0.1, 0.25, 0.4];
        inputOpacity = [0.1, 0.25, 0.35, 0.4];
    } else if (index === 1) {
        // Ring 2 (Engine) peaks at 0.5
        inputScale = [0.35, 0.5, 0.65];
        inputOpacity = [0.35, 0.5, 0.6, 0.65];
    } else if (index === 2) {
        // Ring 3 (Broadcast) peaks at 0.75, then blurs out by 0.9
        inputScale = [0.6, 0.75, 0.9];
        inputOpacity = [0.6, 0.75, 0.85, 0.9];
    }

    const scale = useTransform(progress, inputScale, outputScale);
    const opacity = useTransform(progress, inputOpacity, outputOpacity);
    const blur = useTransform(progress, inputOpacity, outputBlur);
    const filter = useTransform(blur, v => `blur(${v}px)`);

    return (
        <motion.div 
            style={{ scale, opacity, filter }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
            <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex items-center justify-center">
                {/* Visual Ring */}
                <div 
                    className="absolute inset-0 rounded-full"
                    style={{ 
                        border: `1px solid ${color}30`,
                        boxShadow: `0 0 40px ${color}10, inset 0 0 40px ${color}10`,
                        backdropFilter: 'blur(2px)'
                    }}
                />
                
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-8 rounded-full"
                    style={{ border: `1px dashed ${color}30` }}
                />

                {/* Content */}
                <div className="relative z-10 text-center max-w-[280px] md:max-w-[400px] flex flex-col items-center gap-4">
                    <span className="font-mono text-[9px] md:text-[11px] px-3 py-1 bg-[#afff00]/10 border border-[#afff00]/30 rounded-sm uppercase tracking-[0.2em]" style={{ color }}>
                        {text}
                    </span>
                    <h3 className="font-heading text-[clamp(1.5rem,4vw,3.5rem)] leading-none uppercase tracking-tighter text-white">
                        {title}
                    </h3>
                    <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-zinc-500 leading-relaxed">
                        {subtext}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export const TheVoidCore = ({ containerRef }) => {
    // --- LIVE HUD TIMER ---
    const [uptime, setUptime] = useState("00:00:00:00");
    useEffect(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const ms = Math.floor((elapsed % 1000) / 10).toString().padStart(2, '0');
            const s = Math.floor((elapsed / 1000) % 60).toString().padStart(2, '0');
            const m = Math.floor((elapsed / (1000 * 60)) % 60).toString().padStart(2, '0');
            const h = Math.floor((elapsed / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
            setUptime(`${h}:${m}:${s}:${ms}`);
        }, 40);
        return () => clearInterval(interval);
    }, []);

    // Target the entire 500dvh transparent layer
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        container: containerRef, // Pass the main scroll container
        offset: ["start start", "end end"]
    });

    // Fade the header out as we scroll to the first ring
    const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const headerScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.8]);

    // Final Climax Text (Flies in as Ring 3 blurs out)
    const climaxLeftX = useTransform(scrollYProgress, [0.85, 1.0], ["-100vw", "0vw"]);
    const climaxRightX = useTransform(scrollYProgress, [0.85, 1.0], ["100vw", "0vw"]);
    const climaxOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

    return (
        <section ref={sectionRef} className="relative w-full h-[500dvh] bg-black no-snap-section">
            
            {/* ── 1. THE STICKY VISUAL THEATER ── */}
            <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center pointer-events-none">
                
                {/* Deep Background */}
                <div className="absolute inset-0 blueprint-grid opacity-[0.03] scale-150 rotate-6" />
                <motion.div 
                    style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.1, 0.4]) }}
                    className="absolute w-[60vh] h-[60vh] rounded-full bg-[#afff00] blur-[150px] opacity-20 pointer-events-none"
                />

                {/* ── Main Header (Visible at start) ── */}
                <motion.div 
                    style={{ opacity: headerOpacity, scale: headerScale }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10"
                >
                    <span className="font-mono text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-[#afff00]/60 mb-8">
                        CORE_SYSTEMS_ONLINE
                    </span>
                    <h2 className="font-heading text-[clamp(2.5rem,8vw,11vw)] leading-[0.85] uppercase tracking-tighter text-white mb-6">
                        THE ENGINE<br/>OF THE ELITE.
                    </h2>
                    <p className="font-mono text-[10px] md:text-[12px] uppercase tracking-[0.3em] text-zinc-500 max-w-md mx-auto leading-relaxed">
                        Stop using tools built for the 1%.<br/>Use the engine built for the 100%.
                    </p>
                </motion.div>

                {/* ── Ring Layers ── */}
                <Ring 
                    index={0}
                    title="THE INGESTION LAYER"
                    text="0.01s ADAPTIVE INTAKE"
                    subtext="Every fan, every currency, every platform. One unified entry point for your global revenue."
                    progress={scrollYProgress}
                />
                
                <Ring 
                    index={1}
                    title="THE SETTLEMENT ENGINE"
                    text="LIQUID CLEARING"
                    subtext="No 30-day holds. No pending status. Our settlement layer clears funds the millisecond the transaction is verified."
                    progress={scrollYProgress}
                />
                
                <Ring 
                    index={2}
                    title="THE BROADCAST BRIDGE"
                    text="SPATIAL SYNC"
                    subtext="Your stream and your bank account are now the same heartbeat. Real-time alerts, real-time payouts."
                    progress={scrollYProgress}
                    mainContainerRef={containerRef}
                />

                {/* ── Final Text Climax (Entering Next Section) ── */}
                <motion.div 
                    style={{ opacity: climaxOpacity }}
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4"
                >
                    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16">
                        {/* Left Side: Plan Name */}
                        <motion.div 
                            style={{ x: climaxLeftX }}
                            className="flex flex-col items-center md:items-end text-center md:text-right"
                        >
                            <h2 className="font-heading text-[clamp(3rem,8vw,10vw)] leading-[0.8] uppercase tracking-tighter text-white">
                                ELITE
                            </h2>
                            <span className="font-mono text-[10px] md:text-[12px] uppercase tracking-[0.4em] text-zinc-500 mt-2 md:mt-4">
                                Full System Unlocked.
                            </span>
                        </motion.div>
                        
                        {/* Right Side: Subscription Pricing & Details */}
                        <motion.div 
                            style={{ x: climaxRightX }}
                            className="flex flex-col items-center md:items-start text-center md:text-left bg-black/40 backdrop-blur-xl border border-[#afff00]/30 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(175,255,0,0.05)]"
                        >
                            <h2 className="font-heading text-[clamp(2.5rem,6vw,8vw)] leading-[0.8] uppercase tracking-tighter text-[#afff00]">
                                $19<span className="text-[clamp(1rem,2vw,3vw)] text-white">/MO</span>
                            </h2>
                            <ul className="font-mono text-[9px] md:text-[11px] text-white space-y-3 uppercase tracking-widest mt-6">
                                <li className="flex items-center justify-center md:justify-start gap-3">
                                    <span className="w-2 h-2 bg-[#afff00] rounded-sm transform rotate-45" /> 
                                    0% Platform Fees
                                </li>
                                <li className="flex items-center justify-center md:justify-start gap-3">
                                    <span className="w-2 h-2 bg-[#afff00] rounded-sm transform rotate-45" /> 
                                    Custom Visual Engine
                                </li>
                                <li className="flex items-center justify-center md:justify-start gap-3">
                                    <span className="w-2 h-2 bg-[#afff00] rounded-sm transform rotate-45" /> 
                                    Priority Sub-10ms Routing
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </motion.div>

                {/* ── HUD Decor ── */}
                <div className="absolute top-12 left-12 w-8 h-8 border-t border-l border-[#afff00]/30 hidden md:block" />
                <div className="absolute bottom-12 right-12 w-8 h-8 border-b border-r border-[#afff00]/30 hidden md:block" />

                {/* --- TRANSPLANTED TACTICAL HUD CARDS --- */}
                {/* HUD Left: System Timer */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="absolute left-4 top-24 md:left-[clamp(1.5rem,5vw,4rem)] md:top-1/2 md:-translate-y-1/2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-3 rounded-lg flex flex-col gap-1 w-[160px] md:w-[200px] pointer-events-auto z-50 md:z-auto"
                >
                    <span className="font-mono text-[9px] uppercase text-zinc-500 tracking-widest">System Uptime</span>
                    <span className="font-mono text-[14px] text-white tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#afff00] animate-pulse" />
                        {uptime}
                    </span>
                    <span className="font-mono text-[8px] text-[#afff00] mt-1">99.99% INTEGRITY</span>
                </motion.div>

                {/* HUD Right: Liquidity Meter */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="absolute right-4 bottom-[15vh] md:right-[clamp(1.5rem,5vw,4rem)] md:top-1/2 md:-translate-y-1/2 md:bottom-auto bg-black/40 backdrop-blur-md border border-white/10 px-4 py-3 rounded-lg flex flex-col items-end gap-2 w-[160px] md:w-[200px] pointer-events-auto z-50 md:z-auto"
                >
                    <span className="font-mono text-[9px] uppercase text-zinc-500 tracking-widest">Global Liquidity</span>
                    <div className="w-full flex items-end justify-between gap-2 h-6 mt-1">
                        {[0.4, 0.7, 0.5, 0.9, 0.6, 1.0].map((h, i) => (
                            <motion.div 
                                key={i}
                                animate={{ height: [`${h * 10}%`, `${h * 100}%`, `${h * 40}%`] }}
                                transition={{ duration: 1.5 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                                className="w-full bg-[#afff00]"
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ── 2. THE INVISIBLE SNAP TRACK (5 STOPS) ── */}
            {/* These empty divs provide the "friction" that the CSS scroll-snap engine needs */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="h-[100dvh] w-full snap-start snap-always" />
                <div className="h-[100dvh] w-full snap-start snap-always" />
                <div className="h-[100dvh] w-full snap-start snap-always" />
                <div className="h-[100dvh] w-full snap-start snap-always" />
                <div className="h-[100dvh] w-full snap-start snap-always" />
            </div>

        </section>
    );
};

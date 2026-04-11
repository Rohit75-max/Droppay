import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useMotionTemplate } from 'framer-motion';

const Hero = () => {
    // Engine Modes: 'LENS', 'KINETIC', 'BREACH', null (Normal)
    const [activeMode, setActiveMode] = useState(null);
    const [isHoveringText, setIsHoveringText] = useState(false);
    const [hoveredLetterIndex, setHoveredLetterIndex] = useState(null);
    const containerRef = useRef(null);

    const brandName = "DROPE".split("");

    // Responsive Lens Calibration
    const [lensSize, setLensSize] = useState(220);
    useEffect(() => {
        const handleResize = () => setLensSize(typeof window !== 'undefined' && window.innerWidth > 768 ? 320 : 220);
        handleResize(); // Initial measurement
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- SPATIAL MOUSE TRACKING ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const maskX = useMotionValue(0);
    const maskY = useMotionValue(0);
    const textWrapperRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);

        // Separate coordinate tracking specifically for the tight bounding box of the Mask Overlay
        if (textWrapperRef.current) {
            const textRect = textWrapperRef.current.getBoundingClientRect();
            maskX.set(e.clientX - textRect.left);
            maskY.set(e.clientY - textRect.top);
        }
    };


    // Dynamic Lens Blooming Physics
    const maskRadius = useSpring(0, { damping: 30, stiffness: 300 });
    useEffect(() => {
        if (activeMode === 'LENS') {
            maskRadius.set(isHoveringText ? (lensSize / 2) : 12);
        } else {
            maskRadius.set(0);
        }
    }, [isHoveringText, activeMode, maskRadius, lensSize]);
    
    const displayMouseX = useTransform(mouseX, Math.round);
    const displayMouseY = useTransform(mouseY, Math.round);

    // CSS Mask Templates for True X-Ray Engine (1:1 instant tracking)
    const layerBMask = useMotionTemplate`radial-gradient(circle ${maskRadius}px at ${maskX}px ${maskY}px, black ${maskRadius}px, transparent ${maskRadius}px)`;
    const layerAMask = useMotionTemplate`radial-gradient(circle ${maskRadius}px at ${maskX}px ${maskY}px, transparent ${maskRadius}px, black ${maskRadius}px)`;

    return (
        <section 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            data-navbar-theme="dark" 
            className={`home-section-panel relative flex flex-col justify-end p-[clamp(1.5rem,5vw,4rem)] pb-0 md:pb-[3vh] transition-all duration-300 ${
                activeMode === 'BREACH' ? 'border-[4px] border-red-500/30' : ''
            } ${activeMode === 'LENS' ? 'cursor-none' : ''}`}
        >
            {/* --- THE COMMAND CANVAS BACKGROUND --- */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 pointer-events-none z-0"
            >
                {/* 1px Grey Grid */}
                <div className="absolute inset-0 blueprint-grid opacity-10" />
            </motion.div>

            {/* --- BREACH MODE SHARDS --- */}
            <AnimatePresence>
                {activeMode === 'BREACH' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-0 pointer-events-none"
                    >
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={`shard-${i}`}
                                initial={{ x: "-10vw", y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), opacity: 0 }}
                                animate={{ x: "110vw", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 0.5 + Math.random() * 1.5, repeat: Infinity, ease: "linear", delay: Math.random() * 2 }}
                                className="absolute h-[2px] w-24 bg-red-500/80 blur-[1px]"
                                style={{ transform: 'skewX(-45deg)' }}
                            />
                        ))}
                        <div className="absolute inset-0 bg-red-900/5 mix-blend-color-burn" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- LENS CURSOR --- */}
            {activeMode === 'LENS' && (
                <motion.div
                    style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
                    animate={{ 
                        width: isHoveringText ? lensSize : 24, 
                        height: isHoveringText ? lensSize : 24,
                        opacity: isHoveringText ? 1 : 0.6
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute top-0 left-0 rounded-full border border-[#afff00]/40 z-50 pointer-events-none flex flex-col items-center justify-center bg-[#afff00]/5"
                >
                    {/* The Inner Target reticle - Only visible when expanded */}
                    <div className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center ${isHoveringText ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Targeting Brackets */}
                        <div className="absolute top-4 left-4 w-3 h-3 border-t-[1.5px] border-l-[1.5px] border-[#afff00]" />
                        <div className="absolute top-4 right-4 w-3 h-3 border-t-[1.5px] border-r-[1.5px] border-[#afff00]" />
                        <div className="absolute bottom-4 left-4 w-3 h-3 border-b-[1.5px] border-l-[1.5px] border-[#afff00]" />
                        <div className="absolute bottom-4 right-4 w-3 h-3 border-b-[1.5px] border-r-[1.5px] border-[#afff00]" />

                        {/* Crosshairs */}
                        <div className="w-[1px] h-full absolute bg-[#afff00]/20" />
                        <div className="w-full h-[1px] absolute bg-[#afff00]/20" />
                        
                        {/* Live Coordinate Feed */}
                        <div className="absolute -right-24 top-1/2 -translate-y-1/2 font-mono text-[9px] text-[#afff00] tracking-widest flex flex-col gap-1.5 opacity-80">
                            <div className="flex items-center gap-1"><span>X:</span> <motion.span>{displayMouseX}</motion.span></div>
                            <div className="flex items-center gap-1"><span>Y:</span> <motion.span>{displayMouseY}</motion.span></div>
                            <span className="text-white/50 mt-1">LENS_ACTV</span>
                        </div>
                    </div>
                    
                    {/* Always visible solid dot core */}
                    <div className="absolute w-1 h-1 bg-[#afff00] rounded-full shadow-[0_0_10px_#afff00]" />
                </motion.div>
            )}

            {/* --- MULTI-LAYER MASSIVE BACKGROUND TEXT --- */}
            <div className="w-full relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-0 md:gap-6" style={{ perspective: 1500 }}>
                
                {/* The Dual-Layer Canvas Wrapper */}
                <div 
                    ref={textWrapperRef} 
                    className="relative inline-block w-full"
                    onMouseEnter={() => setIsHoveringText(true)}
                    onMouseLeave={() => setIsHoveringText(false)}
                >
                    {/* LAYER A: The Surface */}
                    <motion.div
                        className="relative z-10 block"
                        style={{
                            WebkitMaskImage: layerAMask,
                            maskImage: layerAMask,
                        }}
                    >
                        <motion.h1
                            initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex font-sans font-black text-[clamp(4rem,13vw,11rem)] leading-none uppercase tracking-tighter py-12"
                        >
                            {brandName.map((letter, i) => (
                                <motion.span 
                                    key={i} 
                                    className="relative inline-block px-[1vw] -mx-[1vw] text-white drop-shadow-2xl"
                                    animate={{ 
                                        y: hoveredLetterIndex === i ? (i % 2 === 0 ? -24 : 24) : 0,
                                        rotateZ: hoveredLetterIndex === i ? (i % 2 === 0 ? -4 : 4) : 0
                                    }}
                                    style={{
                                        WebkitTextStroke: activeMode === 'BREACH' ? "1.5px #FF2D00" : "0px transparent",
                                        filter: activeMode === 'BREACH' ? "drop-shadow(0 0 10px rgba(255, 45, 0, 0.3))" : "none"
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    onMouseEnter={() => setHoveredLetterIndex(i)}
                                    onMouseLeave={() => setHoveredLetterIndex(null)}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </motion.h1>
                    </motion.div>

                    {/* LAYER B: The Hidden Blueprint Overlay */}
                    <motion.div 
                        className="absolute inset-0 pointer-events-none z-20 flex"
                        style={{
                            WebkitMaskImage: layerBMask,
                            maskImage: layerBMask,
                            opacity: activeMode === 'LENS' ? 1 : 0
                        }}
                    >
                        <h1 className="flex font-sans font-black text-[clamp(4rem,13vw,11rem)] leading-none uppercase tracking-tighter py-12">
                            {brandName.map((letter, i) => (
                                <motion.span 
                                    key={`wire-${i}`} 
                                    className="relative inline-block px-[1vw] -mx-[1vw] text-transparent"
                                    style={{ WebkitTextStroke: "1px #afff00" }}
                                    animate={{ 
                                        y: hoveredLetterIndex === i ? (i % 2 === 0 ? -24 : 24) : 0,
                                        rotateZ: hoveredLetterIndex === i ? (i % 2 === 0 ? -4 : 4) : 0
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    {letter}

                                    {/* Secret Data Tags scattered within the letters */}
                                    {i === 1 && <span className="absolute -top-8 left-10 font-mono text-[9px] text-[#afff00] tracking-widest" style={{ WebkitTextStroke: '0px' }}>LATENCY_0.01ms</span>}
                                    {i === 2 && <span className="absolute bottom-8 right-10 font-mono text-[9px] text-[#afff00] tracking-widest" style={{ WebkitTextStroke: '0px' }}>SECURE_TUNNEL</span>}
                                    {i === 4 && <span className="absolute -top-4 -right-12 font-mono text-[9px] text-[#afff00] tracking-widest" style={{ WebkitTextStroke: '0px' }}>SETTLEMENT_v2</span>}
                                </motion.span>
                            ))}
                        </h1>
                    </motion.div>
                </div>

                {/* --- ENGINE MODE SELECTORS --- */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="absolute bottom-6 md:bottom-8 right-0 flex flex-row md:flex-col gap-4 justify-end items-end z-50"
                >
                    {[
                        { id: 'LENS', color: '#afff00' },
                        { id: 'BREACH', color: '#FF2D00' }
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setActiveMode(activeMode === mode.id ? null : mode.id)}
                            className="group relative flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 w-[100px] justify-end"
                            style={{ color: activeMode === mode.id ? mode.color : 'rgba(255,255,255,0.4)' }}
                        >
                            <span className="group-hover:tracking-[0.3em] transition-all duration-300">
                                {mode.id}
                            </span>
                            <span className="relative flex h-2 w-2 shrink-0">
                                {activeMode === mode.id && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: mode.color }} />
                                )}
                                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: activeMode === mode.id ? mode.color : 'rgba(255,255,255,0.2)' }} />
                            </span>
                        </button>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

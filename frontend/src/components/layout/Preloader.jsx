import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../ui/Logo';

export const Preloader = ({ onComplete }) => {
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        // 1. Percentage counter (0 to 100 over ~1.8s)
        const interval = setInterval(() => {
            setPercent((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Trigger completion after a tiny beat so 100% is visible
                    setTimeout(() => onComplete?.(), 400);
                    return 100;
                }
                // Random increments for a more 'technical' feel
                const increment = Math.floor(Math.random() * 4) + 1;
                return Math.min(prev + increment, 100);
            });
        }, 45);

        return () => {
            clearInterval(interval);
        };
    }, [onComplete]);

    return (
        <div className="preloader fixed inset-0 z-[1000] overflow-hidden pointer-events-none">

            {/* ── BACKGROUND LAYER (SLIDES UP) ── */}
            <motion.div
                initial={{ y: 0 }}
                exit={{
                    y: "100%",
                    transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] }
                }}
                className="absolute inset-0 bg-black flex flex-col items-center justify-center p-[clamp(1.5rem,5vw,4rem)]"
            >
                {/* TACTICAL BRACKETS */}
                {/* Top Left */}
                <motion.div
                    initial={{ opacity: 0, x: -20, y: -20 }}
                    animate={{ opacity: [0, 1, 0.4, 1], x: 0, y: 0 }}
                    className="absolute top-10 left-10 w-12 h-12 border-t-2 border-l-2 border-white/30"
                />
                {/* Top Right */}
                <motion.div
                    initial={{ opacity: 0, x: 20, y: -20 }}
                    animate={{ opacity: [0, 1, 0.4, 1], x: 0, y: 0 }}
                    className="absolute top-10 right-10 w-12 h-12 border-t-2 border-r-2 border-white/30"
                />
                {/* Bottom Left */}
                <motion.div
                    initial={{ opacity: 0, x: -20, y: 20 }}
                    animate={{ opacity: [0, 1, 0.4, 1], x: 0, y: 0 }}
                    className="absolute bottom-10 left-10 w-12 h-12 border-b-2 border-l-2 border-white/30"
                />
                {/* Bottom Right */}
                <motion.div
                    initial={{ opacity: 0, x: 20, y: 20 }}
                    animate={{ opacity: [0, 1, 0.4, 1], x: 0, y: 0 }}
                    className="absolute bottom-10 right-10 w-12 h-12 border-b-2 border-r-2 border-white/30"
                />

                {/* SEARCHING_NODES (Internal logic still runs, but UI is clean) */}
                <div className="relative flex flex-col items-center gap-6 mt-[40px]">
                </div>

                {/* SCANLINES OVERLAY */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #FFF 1px, #FFF 2px)',
                        backgroundSize: '100% 4px'
                    }}
                />
            </motion.div>

            {/* ── LOGO LAYER (FIXED COORDINATES) ── */}
            {/* This layer MUST stay in the DOM during exit so framer-motion can hand off the layoutId */}
            <motion.div 
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <div className="relative">
                    <Logo
                        size="clamp(2.5rem,15vw,10rem)"
                        interactive={false}
                        layoutId="main-logo"
                        className="relative z-20"
                    />

                    {/* ── Chromatic Corruption Glitch (Fades out before 100%) ── */}
                    <motion.div
                        animate={{ opacity: percent > 92 ? 0 : 1 }}
                        className="absolute inset-0 pointer-events-none overflow-hidden"
                        style={{ mixBlendMode: 'color-dodge' }}
                    >
                        {/* RED LAYER (High Frequency Jump) */}
                        <motion.div
                            animate={{
                                x: [-1, 2, -2, 4, 0],
                                skewX: [0, -10, 10, -5, 0],
                                clipPath: [
                                    'inset(80% 0 0% 0)',
                                    'inset(10% 0 80% 0)',
                                    'inset(45% 0 45% 0)',
                                    'inset(0% 0 90% 0)',
                                    'inset(50% 0 10% 0)',
                                ]
                            }}
                            transition={{ repeat: Infinity, duration: 0.1, ease: "linear" }}
                            className="absolute inset-0 font-sans font-black text-[clamp(2.5rem,15vw,10rem)] text-[#FF0000] uppercase tracking-tighter leading-none opacity-60"
                        >
                            DROPE
                        </motion.div>

                        {/* CYAN LAYER (Slower Shift) */}
                        <motion.div
                            animate={{
                                x: [1, -3, 2, -1, 0],
                                skewX: [0, 5, -5, 2, 0],
                                clipPath: [
                                    'inset(20% 0 60% 0)',
                                    'inset(60% 0 20% 0)',
                                    'inset(0% 0 0% 0)',
                                    'inset(30% 0 50% 0)',
                                    'inset(70% 0 10% 0)',
                                ]
                            }}
                            transition={{ repeat: Infinity, duration: 0.15, ease: "linear" }}
                            className="absolute inset-0 font-sans font-black text-[clamp(2.5rem,15vw,10rem)] text-[#00FFFF] uppercase tracking-tighter leading-none opacity-60"
                        >
                            DROPE
                        </motion.div>

                        {/* WHITE OVERLAY (Ghosting) */}
                        <motion.div
                            animate={{
                                opacity: [0, 0.2, 0, 0.4, 0],
                                scaleY: [1, 1.1, 0.9, 1.2, 1],
                            }}
                            transition={{ repeat: Infinity, duration: 0.08 }}
                            className="absolute inset-0 font-sans font-black text-[clamp(2.5rem,15vw,10rem)] text-white uppercase tracking-tighter leading-none"
                        >
                            DROPE
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

        </div>
    );
};

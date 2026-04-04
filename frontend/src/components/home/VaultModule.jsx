import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { Shield } from 'lucide-react';

const DataTag = ({ label, x, y, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.8 }}
        style={{ left: x, top: y }}
        className="absolute z-20 flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full"
    >
        <div className="w-1 h-1 bg-[#afff00] rounded-full animate-pulse" />
        <span className="font-mono text-[8px] tracking-[0.3em] text-white uppercase whitespace-nowrap">{label}</span>
    </motion.div>
);

const HexColumn = ({ x, radarRadius }) => {
    const [content, setContent] = useState([]);
    const columnRef = useRef(null);

    useEffect(() => {
        const hex = '0123456789ABCDEF';
        setContent(Array.from({ length: 15 }, () => hex[Math.floor(Math.random() * 16)]));

        const interval = setInterval(() => {
            setContent(prev => {
                const next = [...prev];
                next[Math.floor(Math.random() * next.length)] = hex[Math.floor(Math.random() * 16)];
                return next;
            });
        }, 1000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            ref={columnRef}
            className="absolute top-0 flex flex-col items-center font-mono text-[10px] space-y-4"
            style={{ left: `${x}%` }}
        >
            {content.map((char, i) => {
                // Glow logic: if radar is passing over this area
                // Simulating glow based on vertical position and radar progress
                return (
                    <motion.span
                        key={i}
                        animate={{
                            color: ['#333', '#fff', '#333'],
                            textShadow: ['none', '0 0 10px #fff', 'none']
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: (x / 100) * 2 + (i / 15) * 1.5 // Staggered by position
                        }}
                        className="transition-colors duration-500"
                    >
                        {char}
                    </motion.span>
                );
            })}
        </div>
    );
};

export const VaultModule = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const tiltX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), { stiffness: 100, damping: 30 });
    const tiltY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), { stiffness: 100, damping: 30 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full h-full flex items-center justify-center relative overflow-hidden bg-transparent perspective-1000"
        >
            {/* ── VERTICAL BIT-STREAM BACKGROUND ── */}
            <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none opacity-20">
                {Array.from({ length: 12 }).map((_, i) => (
                    <HexColumn key={i} x={(i + 1) * 8} />
                ))}
            </div>

            {/* ── THE RADAR SWEEP ── */}
            <motion.div
                animate={{
                    scale: [0, 4],
                    opacity: [0, 0.5, 0]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
            >
                <div className="w-[400px] h-[400px] border border-[#afff00]/40 rounded-full shadow-[0_0_50px_rgba(175,255,0,0.2)]" />
            </motion.div>

            {/* ── HARDWARE DATA-TAGS ── */}
            <DataTag label="[ ANTI_FRAUD_ENGINE ]" x="15%" y="20%" delay={0.5} />
            <DataTag label="[ 3D_SECURE_v3 ]" x="70%" y="25%" delay={0.7} />
            <DataTag label="[ NON-CUSTODIAL_SETTLEMENT ]" x="40%" y="75%" delay={0.9} />

            {/* ── AERO-GLASS SHIELD ── */}
            <motion.div
                style={{ rotateX: tiltX, rotateY: tiltY }}
                className="relative z-10 flex flex-col items-center"
            >
                <motion.div
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="w-96 h-96 relative flex items-center justify-center transform-style-3d overflow-visible"
                >
                    {/* The Disc */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[20px] rounded-full border border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.05),inset_0_0_40px_rgba(255,255,255,0.02)] flex items-center justify-center group">
                        {/* Neon Glow Outer Rim */}
                        <div className="absolute inset-[-2px] border border-[#afff00]/30 rounded-full pointer-events-none shadow-[0_0_20px_rgba(175,255,0,0.2)]" />

                        {/* THE ICON */}
                        <div className="relative">
                            <Shield className="w-24 h-24 text-white hover:text-[#afff00] transition-colors duration-500" strokeWidth={0.5} />

                            {/* Inner Scanning Bar */}
                            <motion.div
                                animate={{ y: [-40, 40, -40] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute left-1/2 -translate-x-1/2 w-12 h-[1px] bg-[#afff00]/40 shadow-[0_0_10px_#afff00]"
                            />
                        </div>

                        {/* Hidden Lens Reveal Component */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                            <div className="text-center">
                                <p className="font-mono text-[10px] text-[#afff00] tracking-[0.5em] font-black">AES_256_ACTIVE</p>
                                <div className="flex justify-center mt-2 gap-1">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className="w-[1px] h-2 bg-[#afff00]" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Hardware Details */}
                        <div className="absolute top-1/4 right-1/4 flex gap-1 opacity-20">
                            <div className="w-1 h-3 bg-white" />
                            <div className="w-1 h-2 bg-white" />
                        </div>
                    </div>
                </motion.div>

                {/* BRUTALIST HEADING */}
                <div className="mt-16 text-center transform-none">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="font-black italic text-[clamp(1.4rem,4.5vw,7vw)] uppercase leading-none text-white tracking-[0.1em] md:tracking-[0.25em] overflow-hidden whitespace-nowrap"
                    >
                        ENCRYPTION<span className="text-[#afff00]">_</span>LAYER
                    </motion.h2>
                </div>
            </motion.div>

            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-radial-gradient from-[#afff00]/05 to-transparent pointer-events-none opacity-20" />
        </div>
    );
};

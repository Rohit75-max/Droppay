import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TERMINAL_LINES = [
    { id: 'L1', content: 'INSTANT ALERTS', speed: 0.05, delay: 0.2, accent: true },
    { id: 'L2', content: 'CUSTOM OVERLAYS', speed: 0.08, delay: 1.2, accent: false, hasPreview: true },
    { id: 'L3', content: 'INSTANT PAYOUTS', speed: 0.04, delay: 2.2, accent: true },
    { id: 'L4', content: 'YOUR CONTROL', speed: 0.1, delay: 3.2, accent: false },
];

const TypewriterText = ({ text, speed, onComplete }) => {
    const [displayText, setDisplayText] = useState('');
    const [isGlitching, setIsGlitching] = useState(true);
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    useEffect(() => {
        if (isGlitching) {
            let glitchCount = 0;
            const glitchInterval = setInterval(() => {
                const randomStr = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                setDisplayText(randomStr);
                glitchCount++;
                if (glitchCount > 5) {
                    clearInterval(glitchInterval);
                    setIsGlitching(false);
                    setDisplayText('');
                }
            }, 50);
            return () => clearInterval(glitchInterval);
        } else {
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    setDisplayText((prev) => text.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(typingInterval);
                    if (onComplete) onComplete();
                }
            }, speed * 1000);
            return () => clearInterval(typingInterval);
        }
    }, [isGlitching, text, speed, onComplete]);

    return <span>{displayText}</span>;
};

const TerminalLine = ({ line, isSystemActive }) => {
    const [isComplete, setIsComplete] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: line.delay }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex items-center justify-center py-6 border-b border-white/5 cursor-pointer"
        >
            {/* Lead Indicator */}
            <span className={`font-mono text-xl mr-4 transition-colors duration-300 ${isHovered && isComplete ? 'text-[#afff00]' : 'text-zinc-600'}`}>
                {isHovered && isComplete ? '●' : '>_'}
            </span>

            {/* Typewriter Text */}
            <h3 className={`font-heading text-[clamp(2rem,5vw,4vw)] leading-none uppercase transition-all duration-300 ${line.accent ? 'text-[#afff00]' : 'text-white'} ${isHovered ? 'italic pl-4' : ''}`}>
                <TypewriterText
                    text={line.content}
                    speed={line.speed}
                    onComplete={() => setIsComplete(true)}
                />

                {/* Block Cursor */}
                {!isComplete && (
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.4, repeat: Infinity }}
                        className="inline-block w-[0.6em] h-[1em] bg-white align-middle ml-2"
                    />
                )}
            </h3>

            {/* Preview Window (Specific for L2) */}
            <AnimatePresence>
                {line.hasPreview && isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 10 }}
                        className="absolute left-[110%] top-1/2 -translate-y-1/2 w-64 aspect-video bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg overflow-hidden shadow-2xl z-50 p-2 pointer-events-none"
                    >
                        <div className="w-full h-full border border-[#afff00]/30 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&w=400&q=80')] bg-cover bg-center opacity-40 grayscale" />
                            <div className="absolute top-2 left-2 flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-[8px] font-mono text-white/50">LIVE_HUD_V2.0</span>
                            </div>
                            <div className="absolute bottom-2 right-2 flex flex-col items-end">
                                <div className="w-12 h-1 bg-[#afff00]/20 mb-1" />
                                <div className="w-8 h-1 bg-[#afff00]/20" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const TerminalModule = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent px-[clamp(1.5rem,5vw,4rem)]">
            {/* ── BACKGROUND 3D WIREFRAME ── */}
            <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[50vw] aspect-square pointer-events-none opacity-10">
                <motion.svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="2 2" />
                    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.2" />
                    <path d="M50 2 L50 98 M2 50 L98 50" stroke="currentColor" strokeWidth="0.1" />
                    <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.2" transform="rotate(45 50 50)" />
                    {Array.from({ length: 8 }).map((_, i) => (
                        <line
                            key={i}
                            x1="50" y1="50"
                            x2={50 + 40 * Math.cos(i * Math.PI / 4)}
                            y2={50 + 40 * Math.sin(i * Math.PI / 4)}
                            stroke="currentColor"
                            strokeWidth="0.1"
                        />
                    ))}
                </motion.svg>
            </div>

            {/* ── TERMINAL LIST ── */}
            <div className="relative z-10 w-full max-w-4xl pt-20 flex flex-col items-center">
                <header className="mb-12 flex flex-col items-center text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.5 }}
                        className="font-mono text-[10px] tracking-[0.4em] text-[#afff00] uppercase block mb-2"
                    >

                    </motion.span>
                    <h2 className="text-[12vw] font-black italic tracking-tighter uppercase leading-[0.85] text-white">
                        TERMINAL
                    </h2>
                </header>

                <div className="flex flex-col w-full max-w-3xl">
                    {TERMINAL_LINES.map((line) => (
                        <TerminalLine key={line.id} line={line} />
                    ))}
                </div>
            </div>
        </div>
    );
};

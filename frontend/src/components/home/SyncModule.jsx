import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// DIAGNOSTIC SERVICE: Reactor Core Synchronized.

// ── TACTICAL HUD METADATA COMPONENTS ──
const LiveTimer = () => {
    const [ms, setMs] = useState(0);
    useEffect(() => {
        let frame;
        const update = () => {
            setMs(Date.now() % 1000);
            frame = requestAnimationFrame(update);
        };
        frame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frame);
    }, []);
    return <span>{ms.toString().padStart(3, '0')}ms</span>;
};

const SineWave = () => (
    <div className="w-12 h-4 overflow-hidden opacity-50">
        <motion.svg width="48" height="16" viewBox="0 0 48 16" className="text-[#afff00]">
            <motion.path
                d="M0 8 Q 6 0, 12 8 T 24 8 T 36 8 T 48 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                animate={{ x: [-24, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </motion.svg>
    </div>
);

const BatteryIcon = () => (
    <div className="relative w-8 h-4 border border-[#afff00]/40 p-[1px] flex gap-[1px]">
        {[1, 2, 3, 4].map(i => (
            <motion.div 
                key={i}
                animate={{ opacity: [1, 0.4, 1] }} 
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="flex-1 h-full bg-[#afff00]" 
            />
        ))}
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-2 bg-[#afff00]/40" />
    </div>
);

const CornerTag = ({ label, value, corner, metadata }) => {
    const posMap = {
        'tl': 'top-12 left-12',
        'tr': 'top-12 right-12 text-right',
        'bl': 'bottom-24 left-12',
        'br': 'bottom-24 right-12 text-right',
    };
    return (
        <motion.div
            initial={{ opacity: 0, x: corner.includes('l') ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: { tl: 0.2, tr: 0.4, bl: 0.6, br: 0.8 }[corner], duration: 1 }}
            className={`absolute ${posMap[corner]} z-20 flex flex-col gap-1`}
        >
            <span className="font-mono text-[8px] text-[#afff00]/40 tracking-[0.3em] uppercase">{label}</span>
            <div className={`flex items-center gap-3 ${corner.includes('r') ? 'flex-row-reverse' : ''}`}>
                <motion.div
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() }}
                    className="w-1.5 h-1.5 rounded-full bg-[#afff00] shadow-[0_0_8px_#afff00]"
                />
                <span className="font-mono text-[10px] text-white tracking-widest uppercase font-bold">{value}</span>
            </div>
            <div className="mt-1 font-mono text-[7px] text-zinc-500 opacity-60 tracking-wider">
                {metadata}
            </div>
        </motion.div>
    );
};

// ── VORTEX & RADAR SWEEP ENGINE ──
const VortexBackground = ({ isHovered, mouseX, mouseY }) => {
    return (
        <div className="absolute inset-0 overflow-visible pointer-events-none">
            {/* Magnetic Grid Warping Grid */}
            <motion.div
                style={{
                    perspective: 1000,
                    rotateX: mouseY * 0.1,
                    rotateY: mouseX * 0.1,
                    scale: 1.05
                }}
                className="absolute inset-0 bg-[linear-gradient(rgba(175,255,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(175,255,0,0.06)_1px,transparent_1px)] bg-[size:100px_100px] transition-transform duration-300 ease-out"
            />

            {/* Radar Scanning Beam */}
            <motion.svg
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-full h-full opacity-20"
                viewBox="0 0 100 100"
            >
                <defs>
                    <radialGradient id="scanGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#afff00" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#afff00" stopOpacity="0" />
                    </radialGradient>
                </defs>
                <path d="M 50 50 L 50 0 A 50 50 0 0 1 65 5 Z" fill="url(#scanGradient)" />
                <line x1="50" y1="50" x2="50" y2="0" stroke="#afff00" strokeWidth="0.5" shadow-glow="true" />
            </motion.svg>

            {/* Rotating Orbital Tiers */}
            {[600, 900, 1200].map((size, i) => (
                <motion.div
                    key={i}
                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                    transition={{ duration: 30 + i * 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ scale: 1 + (mouseX + mouseY) * 0.00005 }}
                >
                    <div
                        className="rounded-full border border-[#afff00]/5 flex items-center justify-center"
                        style={{ width: size, height: size, borderStyle: 'solid' }}
                    >
                        {/* Smaller detail rings */}
                        <div className="w-[95%] h-[95%] rounded-full border border-[#afff00]/3 border-dashed" />
                    </div>
                </motion.div>
            ))}

            {/* Reactor Core Glow */}
            <motion.div
                animate={{ 
                    scale: isHovered ? [1.1, 1.3, 1.1] : [1, 1.1, 1],
                    opacity: isHovered ? [0.1, 0.3, 0.1] : [0.05, 0.15, 0.05]
                }}
                transition={{ duration: isHovered ? 1.5 : 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <div className="w-[800px] h-[800px] rounded-full bg-[#afff00] blur-[150px]" />
            </motion.div>
        </div>
    );
};


// ── MAIN SYNC MODULE (The Reactor) ──
export const SyncModule = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const x = (clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const y = (clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        setMousePos({ x, y });
    };

    const handleLaunch = () => {
        setIsLaunching(true);
        setTimeout(() => {
            const footer = document.querySelector('footer');
            footer?.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => setIsLaunching(false), 1000);
        }, 1500);
    };

    return (
        <div 
            onMouseMove={handleMouseMove}
            className="w-full h-full flex items-center justify-center relative overflow-hidden bg-transparent"
        >
            {/* ── FULL SCREEN FLASH OVERLAY ── */}
            <AnimatePresence>
                {isLaunching && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-white pointer-events-none"
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 25 }}
                            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-black rounded-full mix-blend-difference"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── VORTEX BACKGROUND ── */}
            <VortexBackground isHovered={isHovered} mouseX={mousePos.x} mouseY={mousePos.y} />

            {/* ── TACTICAL HUD COORDS (The Corners) ── */}
            <CornerTag label="Status" value="Optimized" corner="tl" metadata={<LiveTimer />} />
            <CornerTag label="Network" value="Active" corner="tr" metadata={<SineWave />} />
            <CornerTag label="Bridge" value="Established" corner="bl" metadata={<span>0xDEADBEEF</span>} />
            <CornerTag label="Capacity" value="100%" corner="br" metadata={<BatteryIcon />} />

            {/* ── CENTRAL LAUNCHPAD (The Power Cell) ── */}
            <div className="relative z-10 flex flex-col items-center gap-16">
                <motion.div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleLaunch}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="relative cursor-pointer group"
                >
                    {/* Reactor Core Glass Border */}
                    <div className="absolute inset-[-12px] bg-white/5 backdrop-blur-xl border border-[#afff00]/30 rounded-[2px] transition-all duration-500 group-hover:border-[#afff00] group-hover:shadow-[0_0_40px_rgba(175,255,0,0.3)]" />
                    
                    {/* Depth Gradient Ring */}
                    <div className="absolute inset-[2px] border border-white/10 rounded-[1px] pointer-events-none" />

                    {/* Internal Power Core (Hidden Pulse) */}
                    <motion.div 
                        animate={isHovered ? { opacity: [0.1, 0.4, 0.1], scale: [1, 1.1, 1] } : { opacity: 0.05 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-[#afff00] blur-3xl pointer-events-none"
                    />

                    {/* Main Reactor Slab */}
                    <div className="relative bg-white/10 border border-white/20 px-24 py-12 overflow-hidden backdrop-blur-md">
                        {/* Radioactive Sheen */}
                        <motion.div
                            animate={{ x: ['-200%', '300%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-y-0 w-[40%] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none skew-x-[-15deg]"
                        />

                        {/* Content: Reactor Status */}
                        <div className="relative z-10 flex items-center justify-center min-w-[320px]">
                            <motion.span 
                                animate={isHovered ? {
                                    x: [0, -1, 1, -1, 1, 0],
                                    y: [0, 1, -1, 1, -1, 0]
                                } : {}}
                                transition={{ duration: 0.1, repeat: Infinity }}
                                className="text-white font-black text-[clamp(3rem,8vw,7rem)] italic tracking-tighter uppercase leading-none mix-blend-difference"
                            >
                                GO LIVE
                            </motion.span>
                        </div>
                    </div>

                    {/* Bottom Status Bar */}
                    <motion.div 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#afff00] origin-left shadow-[0_0_15px_#afff00]"
                    />
                </motion.div>

                {/* Tactical HUD Meta text */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 0.6 : 0.2 }}
                    className="font-mono text-[9px] text-white tracking-[0.4em] uppercase"
                >
                    Initiation Sequence Ready // Core_Temp: Optimal
                </motion.p>
            </div>
        </div>
    );
};

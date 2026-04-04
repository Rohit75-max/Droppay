import React, { useState, useEffect, useMemo } from 'react';
import { motion, useSpring, useTransform, useVelocity, useMotionValue } from 'framer-motion';
import { Activity } from 'lucide-react';

// ── WARP PACKET: A single data-packet flying through the pipe ──
const WarpPacket = ({ delay, yOffset, scrollVelocity, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const metadata = useMemo(() => {
        const labels = ['TX_SECURE', 'ID_772', 'SETTLED', 'BLOCK_0x4F', 'NITRO_PAY'];
        return labels[index % labels.length];
    }, [index]);

    // Physics: scaleX stretches as scroll velocity increases (warp streaks)
    const dynamicScaleX = useTransform(scrollVelocity, [-1500, 0, 1500], [5, 1, 5]);
    const dynamicBlur = useTransform(scrollVelocity, [-1500, 0, 1500], [4, 0, 4]);
    const blurFilter = useTransform(dynamicBlur, b => `blur(${b}px)`);

    return (
        <div
            className="absolute h-[3px] flex items-center"
            style={{ top: `${yOffset}%`, left: `${(delay * 50) % 100}%`, width: '40px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                animate={{ x: [0, 1200] }}
                transition={{
                    duration: 2 + (index % 3) * 0.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay,
                }}
                style={{ scaleX: dynamicScaleX, filter: blurFilter }}
                className="w-full h-full bg-[#afff00] rounded-full shadow-[0_0_15px_#afff00]"
            />
            {/* Metadata Tooltip */}
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -20 }}
                    className="absolute z-50 bg-black/80 backdrop-blur-md border border-[#afff00]/30 px-2 py-1 rounded pointer-events-none"
                >
                    <span className="font-mono text-[7px] text-[#afff00] tracking-widest uppercase whitespace-nowrap">
                        {metadata}
                    </span>
                </motion.div>
            )}
        </div>
    );
};

// ── GAUGE: Hardware diagnostic display ──
const Gauge = ({ label, value, type }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (type !== 'counter') return;
        const interval = setInterval(() => {
            setCount(prev => (prev + Math.floor(Math.random() * 100)) % 999999);
        }, 50);
        return () => clearInterval(interval);
    }, [type]);

    return (
        <div className="flex flex-col items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl w-44">
            <div className="relative w-full h-24 flex items-center justify-center overflow-hidden">
                {type === 'needle' && (
                    <div className="relative w-20 h-20">
                        <svg viewBox="0 0 80 80" className="w-full h-full rotate-[-90deg]">
                            <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                            <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(175,255,0,0.4)" strokeWidth="2" strokeDasharray="100 140" />
                        </svg>
                        <motion.div
                            animate={{ rotate: [-20, 40, -10, 30, -25, 35] }}
                            transition={{ duration: 0.15, repeat: Infinity, repeatType: "mirror" }}
                            className="absolute bottom-1/2 left-1/2 w-[2px] h-9 bg-[#afff00] origin-bottom -translate-x-1/2 shadow-[0_0_10px_#afff00]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-[#afff00]" />
                        </div>
                    </div>
                )}
                {type === 'heartbeat' && (
                    <svg viewBox="0 0 120 48" className="w-full h-12">
                        <motion.path
                            d="M0 24 L15 24 L20 10 L30 38 L35 24 L65 24 L70 4 L80 44 L85 24 L120 24"
                            fill="none"
                            stroke="#afff00"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: [0, 1, 1, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                        />
                    </svg>
                )}
                {type === 'counter' && (
                    <span className="font-mono text-xl text-white font-black tracking-tighter tabular-nums">
                        {count.toLocaleString()}
                    </span>
                )}
            </div>
            <div className="text-center">
                <span className="font-mono text-[8px] text-[#afff00] tracking-[0.2em] mb-1 block uppercase">{label}</span>
                <span className="font-mono text-[9px] text-zinc-500 uppercase">{value}</span>
            </div>
        </div>
    );
};

// ── MAIN ENGINE MODULE ──
export const EngineModule = ({ scrollProgress }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const scrollVelocity = useVelocity(scrollProgress);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 200 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const parallaxX = useTransform(mouseX, [-0.5, 0.5], ['-50px', '50px']);

    return (
        <div
            onMouseMove={handleMouseMove}
            className="w-full h-full flex flex-col items-center justify-center relative overflow-visible bg-transparent"
        >
            {/* ── STARFIELD BACKGROUND: Horizontal speed lines ── */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-[200%] left-[-50%]"
                        style={{ x: parallaxX, top: `${i * 5}%`, opacity: 0.05 + (i % 5) * 0.04 }}
                    />
                ))}
            </div>

            {/* ── VELOCITY NODE HEADING ── */}
            <div className="relative z-10 mb-10 text-center">
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative overflow inline-block"
                >
                    <h2 className="text-[clamp(3rem,8vw,8vw)] font-black italic tracking-tighter uppercase leading-none text-white [transform:skewX(-10deg)]">
                        <span className="text-[#afff00]">STREAMS_</span>VELOCITY
                    </h2>
                    {/* Sheen scan */}
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                        className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#afff00]/20 to-transparent pointer-events-none"
                    />
                </motion.div>

            </div>

            {/* ── THE AERO-GLASS PIPELINE ── */}
            <div className="relative w-[120%] h-36 flex items-center justify-center mb-14 group">
                {/* Outer ambient glow */}
                <div className="absolute inset-x-0 h-28 bg-[#afff00]/5 blur-[60px] rounded-full pointer-events-none" />

                {/* Glass Cylinder */}
                <div className="absolute inset-x-0 h-24 bg-white/[0.04] backdrop-blur-2xl border-y border-white/10 overflow-hidden">
                    {/* Top shine */}
                    <div className="absolute inset-x-0 top-0 h-[15%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    {/* Bottom shadow */}
                    <div className="absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                    {/* Centre laser axis */}
                    <div className="absolute inset-x-0 top-1/2 h-px bg-[#afff00]/30 shadow-[0_0_15px_#afff00]" />

                    {/* Warp Packets */}
                    <div className="relative w-full h-full">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <WarpPacket
                                key={i}
                                index={i}
                                delay={i * 0.15}
                                yOffset={15 + (i % 7) * 12}
                                scrollVelocity={smoothVelocity}
                            />
                        ))}
                    </div>
                </div>

                {/* Cap fades — hide overflow at edges */}
                <div className="absolute left-0 w-32 h-28 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 w-32 h-28 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />
            </div>

            {/* ── GAUGE CLUSTER ── */}
            <div className="relative z-10 flex gap-8">
                <Gauge label="Settlement" value="< 10ms" type="needle" />
                <Gauge label="Latency" value="Zero_Drop" type="heartbeat" />
                <Gauge label="Throughput" value="Unlimited" type="counter" />
            </div>

            {/* Activity Icon (bottom decoration) */}
            <div className="absolute bottom-8 left-10 flex items-center gap-2 opacity-20">
                <Activity className="w-4 h-4 text-[#afff00]" />
                <span className="font-mono text-[8px] text-zinc-500 tracking-widest">ENGINE_OK</span>
            </div>
        </div>
    );
};

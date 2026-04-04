import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { LootCard } from './LootCard';

// ── Hardcoded Scatter Positions (Ensures physics stability across re-renders) ──
const LOOT_CLUSTER = [
    // --- Premium Alerts (Cinematic Showcase) ---
    { id: 'p2', type: 'premium_alert', stylePreference: 'orbital_strike', name: 'PHANTOM_UNIT', amount: '5,500', message: 'Orbital drop incoming. Stay tactical.', initialPos: { x: 120, y: -140, rotate: 6 }, zIndex: 4 },
    { id: 'p3', type: 'premium_alert', stylePreference: 'mainframe_breach', name: 'WHALE_PROTOCOL', amount: '25,000', message: 'Full system breach. Accessing sovereign funds.', initialPos: { x: 0, y: -10, rotate: 1 }, zIndex: 20 },
    { id: 'p4', type: 'premium_alert', stylePreference: 'neon_billboard', name: 'CITY_LIGHTS', amount: '2,000', message: 'Ad revenue spike detected.', initialPos: { x: -240, y: 40, rotate: -10 }, zIndex: 3 },

    // --- Goal Bars (Mission Trackers) ---
    { id: 'g2', type: 'goal_bar', goalStyle: 'arc_reactor_horizontal', name: 'CORE_SYNC', currentProgress: 420, targetAmount: 1000, initialPos: { x: -180, y: 140, rotate: -5 }, zIndex: 7 },
    { id: 'g3', type: 'goal_bar', goalStyle: 'boss_fight', name: 'RAID_BOSS_AXEL', currentProgress: 12000, targetAmount: 20000, initialPos: { x: 40, y: 180, rotate: 2 }, zIndex: 8 },

    // --- Free Alerts replaced with Gaming Icons ---
    { id: 'f1', type: 'premium_alert', stylePreference: 'respect_plus', name: 'GROVE_STREET', amount: '5,000', message: 'Mission Passed!', initialPos: { x: -60, y: -160, rotate: 12 }, zIndex: 10 },
    { id: 'f2', type: 'premium_alert', stylePreference: 'bgmi_tactical', name: 'BGMI_PRO', amount: '1,500', message: 'Winner Winner!', initialPos: { x: 260, y: -180, rotate: -8 }, zIndex: 2 },
];

export const TheDrop = () => {
    const sandboxRef = useRef(null);
    const [activeCardId, setActiveCardId] = useState(null);

    return (
        <section data-navbar-theme="dark" className="home-section-panel bg-black text-white px-[clamp(1.5rem,5vw,4rem)] pt-0 pb-0 relative z-30 overflow-hidden flex flex-col">
            {/* 70px Navbar Protection & Spacer */}
            <div className="h-[70px] w-full shrink-0 relative z-20" />

            {/* Standard Boundary Line */}
            <div className="w-full border-t border-white/10 relative z-20" />

            {/* Header Layer */}
            <div className="relative z-10 md:pt-10 pt-14 w-full max-w-[1400px] mx-auto pointer-events-none flex flex-col items-center text-center">
                <div className="max-w-4xl flex flex-col items-center">
                    <motion.h2
                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                        viewport={{ once: true }}
                        className="font-heading text-[clamp(2.2rem,11vw,14vw)] leading-[0.85] uppercase tracking-tighter"
                    >
                        Loot <span className="text-[#afff00] italic font-light">&</span> Lore<span className="text-[#afff00]">.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="font-mono text-[clamp(9px,1.1vw,12px)] uppercase tracking-[0.2em] text-zinc-500 mt-4 leading-relaxed max-w-md pointer-events-auto"
                    >
                        Interact with your revenue. A digital sandbox where your alerts live as high-fidelity physical objects. Drag, drop, and conquer.
                    </motion.p>
                </div>

                <div className="flex flex-col items-center gap-2 mt-8 pointer-events-auto">
                    <span className="font-mono text-[9px] text-[#afff00] tracking-[0.3em] uppercase">PHYSICS_ENGINE_ACTIVE</span>
                    <div className="w-16 h-[1px] bg-[#afff00]/30 shadow-[0_0_10px_#afff00]" />
                </div>
            </div>

            {/* ── THE KINETIC SANDBOX ── */}
            <div
                ref={sandboxRef}
                className="flex-1 w-full relative z-10 -mt-[10vh]" // Negative margin pulls sandbox up into header space gracefully
            >
                {/* Background Grid */}
                <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />

                {LOOT_CLUSTER.map((item) => {
                    const isDimmed = activeCardId !== null && activeCardId !== item.id;
                    return (
                        <LootCard
                            key={item.id}
                            item={item}
                            containerRef={sandboxRef}
                            isDimmed={isDimmed}
                            onHover={(id) => setActiveCardId(id)}
                            onHoverEnd={() => setActiveCardId(null)}
                        />
                    );
                })}
            </div>

            {/* Tactical Glow (Bottom) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[20vh] bg-[#afff00]/5 blur-[100px] pointer-events-none" />
        </section>
    );
};

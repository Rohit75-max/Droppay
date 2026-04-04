import React, { useRef } from "react";
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import { TerminalModule } from "./TerminalModule";
import { VaultModule } from "./VaultModule";
import { EngineModule } from "./EngineModule";
import { SyncModule } from "./SyncModule";

const ModuleWrapper = ({ children, index, scrollYProgress }) => {
    // Each module occupies 0.25 of the total scroll
    const start = index * 0.25;
    const end = (index + 1) * 0.25;
    const mid = (start + end) / 2;

    // Entry: Scale up from 0.5 to 1.0
    const scale = useTransform(scrollYProgress, [start - 0.1, start, mid], [0.8, 1, 1]);
    // Blur Exit / De-rez: 
    const blur = useTransform(scrollYProgress, [mid, end, end + 0.1], [0, 0, 10]);
    const opacity = useTransform(scrollYProgress, [start - 0.1, start, end, end + 0.1], [0, 1, 1, 0]);

    return (
        <motion.div 
            style={{ 
                scale, 
                opacity,
                filter: useTransform(blur, (b) => `blur(${b}px)`)
            }}
            className="min-w-full h-full p-[clamp(1.5rem,5vw,4rem)] flex flex-col justify-center overflow-visible"
        >
            {children}
        </motion.div>
    );
};

export const HorizontalGallery = ({ containerRef }) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        container: containerRef,
        offset: ["start start", "end end"]
    });

    // --- SCROLL MAPPING ---
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-300%"]);
    const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]);
    const progress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

    const modules = [
        { id: 'terminal', Component: TerminalModule, heading: 'TERMINAL' },
        { id: 'vault', Component: VaultModule, heading: 'VAULT' },
        { id: 'engine', Component: EngineModule, heading: 'ENGINE' },
        { id: 'sync', Component: SyncModule, heading: 'SYNC' },
    ];

    return (
        <section 
            ref={targetRef} 
            data-navbar-theme="dark" 
            className="relative h-[400vh] bg-[#050505] overflow-visible snap-start scroll-snap-stop-always"
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
                {/* ── BACKGROUND LAYER: PARALLAX HEADINGS ── */}
                <motion.div 
                    style={{ x: bgX }}
                    className="absolute inset-0 flex pointer-events-none opacity-[0.03] select-none"
                >
                    {modules.map((m) => (
                        <div key={m.id} className="min-w-full h-full flex items-center justify-center">
                            <span className="text-[30vw] font-black italic tracking-tighter uppercase whitespace-nowrap">
                                {m.heading}
                            </span>
                        </div>
                    ))}
                </motion.div>

                {/* ── FOREGROUND LAYER: THE MODULE TRACK ── */}
                <motion.div 
                    style={{ x }}
                    className="flex-1 w-full flex h-full"
                >
                    {modules.map((m, i) => (
                        <ModuleWrapper key={m.id} index={i} scrollYProgress={scrollYProgress}>
                            <m.Component scrollProgress={scrollYProgress} />
                        </ModuleWrapper>
                    ))}
                </motion.div>

                {/* ── INTERACTIVE FOOTER UI ── */}
                <div className="absolute bottom-0 left-0 w-full px-10 pb-6 flex flex-col gap-4 z-50">
                    <div className="w-full h-[2px] bg-white/5 relative overflow-hidden">
                        <motion.div 
                            style={{ scaleX: progress, transformOrigin: 'left' }}
                            className="absolute inset-0 bg-[#afff00] shadow-[0_0_10px_#afff00]"
                        />
                    </div>
                    
                    <div className="flex justify-center items-center text-[8px] font-mono tracking-[0.4em] uppercase text-zinc-600">
                        <div className="flex gap-10">
                            {modules.map((m, i) => (
                                <span key={m.id} className="transition-colors duration-300">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useHUD } from "../../context/HUDContext";
import { DroppModeOverlay } from "../ui/DroppModeOverlay";
import { DodgeGameOverlay } from "../ui/DodgeGameOverlay";
import { SpaceShooterGame } from "../ui/SpaceShooterGame";
import { ZombieShooterGame } from "../ui/ZombieShooterGame";

const Hero = () => {
    const [droppMode, setDroppMode] = useState(false);
    const [dodgeMode, setDodgeMode] = useState(false);
    const [spaceMode, setSpaceMode] = useState(false);
    const [zombieMode, setZombieMode] = useState(false);
    const { showHUD, hideHUD } = useHUD();
    const brandName = "DROPE".split("");

    const containerVars = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            }
        }
    };

    const letterVars = {
        initial: { y: "110%" },
        animate: {
            y: "0%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        }
    };

    return (
        <section data-navbar-theme="dark" className="home-section-panel justify-end p-[clamp(1.5rem,5vw,4rem)] pb-[8vh]">
            <div className="w-full border-t border-white/10 pt-10">

                {/* Staggered Text Container */}
                <motion.h1
                    variants={containerVars}
                    initial="initial"
                    animate="animate"
                    className="flex font-sans font-black text-[clamp(3rem,12vw,10rem)] leading-[0.85] uppercase tracking-tight"
                    style={{ perspective: 1000 }} // Added perspective for 3D flip effect
                >
                    {brandName.map((letter, i) => (
                        // The bounding-box fix wrapper (prevents clipped italics/thick right edges)
                        <span key={i} className="overflow-hidden relative inline-block px-[2vw] -mx-[2vw]">

                            {/* Page-Load Stagger Element */}
                            <motion.span variants={letterVars} className="inline-block transform-origin-bottom">

                                {/* Interactive Hover Element */}
                                <motion.span
                                    initial="rest"
                                    whileHover="hover"
                                    className="relative flex items-center justify-center cursor-default"
                                >
                                    {/* Default Letter (Fades/Flips out to the left) */}
                                    <motion.span
                                        variants={{
                                            rest: { rotateY: 0, x: "0%", opacity: 1 },
                                            hover: { rotateY: -90, x: "-50%", opacity: 0 }
                                        }}
                                        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                                        className="inline-block origin-left text-white"
                                    >
                                        {letter}
                                    </motion.span>

                                    {/* Incoming Hover Letter (Flips in from the right) */}
                                    <motion.span
                                        variants={{
                                            rest: { rotateY: 90, x: "50%", opacity: 0 },
                                            hover: { rotateY: 0, x: "0%", opacity: 1 }
                                        }}
                                        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                                        className="absolute inset-0 flex items-center justify-center text-[#FF2D00] origin-right pointer-events-none"
                                        aria-hidden="true"
                                    >
                                        {letter}
                                    </motion.span>
                                </motion.span>

                            </motion.span>
                        </span>
                    ))}
                </motion.h1>

                {/* Final Metadata Fade */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                    className="flex flex-wrap gap-x-5 gap-y-4 justify-between items-end mt-6 font-mono text-[10px] uppercase text-zinc-500"
                >
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                        {/* PAINT game */}
                        <button
                            onClick={() => setDroppMode(true)}
                            onMouseEnter={() => showHUD("LAUNCH: PAINT")}
                            onMouseLeave={hideHUD}
                            className="group relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF2D00] hover:text-white transition-colors duration-300"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D00] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF2D00]" />
                            </span>
                            <span className="group-hover:tracking-[0.35em] transition-all duration-300">Paint</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">↗</span>
                        </button>

                        <span className="font-mono text-[10px] text-zinc-700">/</span>

                        {/* SPACE SHOOTER game */}
                        <button
                            onClick={() => setSpaceMode(true)}
                            onMouseEnter={() => showHUD("LAUNCH: SPACE")}
                            onMouseLeave={hideHUD}
                            className="group relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#00BFFF]/60 hover:text-[#00BFFF] transition-colors duration-300"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BFFF] opacity-50" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BFFF]/60" />
                            </span>
                            <span className="group-hover:tracking-[0.35em] transition-all duration-300">Space</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">↗</span>
                        </button>

                        <span className="font-mono text-[10px] text-zinc-700">/</span>

                        {/* ZOMBIE SHOOTER game */}
                        <button
                            onClick={() => setZombieMode(true)}
                            onMouseEnter={() => showHUD("LAUNCH: ZOMBIES")}
                            onMouseLeave={hideHUD}
                            className="group relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4AFF4A]/60 hover:text-[#4AFF4A] transition-colors duration-300"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4AFF4A] opacity-50" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4AFF4A]/60" />
                            </span>
                            <span className="group-hover:tracking-[0.35em] transition-all duration-300">Zombie</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">↗</span>
                        </button>

                        <span className="font-mono text-[10px] text-zinc-700">/</span>

                        <button
                            onClick={() => setDodgeMode(true)}
                            onMouseEnter={() => showHUD("LAUNCH: DODGE")}
                            onMouseLeave={hideHUD}
                            className="group relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors duration-300"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-500 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500" />
                            </span>
                            <span className="group-hover:tracking-[0.35em] transition-all duration-300">Dodge</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">↗</span>
                        </button>
                    </div>
                </motion.div>

            </div>

            {/* Game Overlays */}
            <DroppModeOverlay isOpen={droppMode} onClose={() => setDroppMode(false)} />
            <DodgeGameOverlay isOpen={dodgeMode} onClose={() => setDodgeMode(false)} />
            <SpaceShooterGame isOpen={spaceMode} onClose={() => setSpaceMode(false)} />
            <ZombieShooterGame isOpen={zombieMode} onClose={() => setZombieMode(false)} />
        </section>
    );
};

export default Hero;

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HypeChatFooter } from '../../components/features/HypeChatFooter';

import { StreamEngineDemo } from '../../components/features/StreamEngineDemo';
import { FeaturePillars } from '../../components/features/FeaturePillars';
import { CreatorStack } from '../../components/features/CreatorStack';


const Features = () => {
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.classList.add('marketing-root-body-lock');
        return () => {
            document.body.classList.remove('marketing-root-body-lock');
        };
    }, []);

    return (
        <div className="marketing-root no-snap-container bg-white overflow-x-hidden">
            <motion.main
                ref={scrollContainerRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="home-scroll-container no-snap-container text-[#0A0A0A] selection:bg-[#afff00] selection:text-black"
            >
                {/* --- HERO: THE STREAMER'S ENGINE --- */}
                <section data-navbar-theme="dark" className="home-section-panel flex flex-col justify-center px-[clamp(1rem,5vw,4rem)] pt-24 md:pt-[100px] pb-10 relative overflow-hidden bg-[#0A0A0A] text-white min-h-dvh md:h-dvh">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.02] md:opacity-[0.05] select-none">
                        <span className="text-[40vw] font-black leading-none uppercase tracking-tighter text-white">STREAM</span>
                    </div>

                    <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-20">
                        {/* LEFT SIDE: THE PITCH */}
                        <div className="flex-1 max-w-2xl text-center lg:text-left">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {/* SEO Optimization: Hidden H1 for Search Discoverability */}
                                <h1 className="absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0 clip-[rect(0,0,0,0)]">
                                    Streamer Donations YouTube Live Alerts Drope.in Features
                                </h1>

                                <h1 className="text-[9vw] md:text-[6vw] lg:text-[5.5vw] font-black tracking-tighter leading-[0.95] md:leading-[0.9] uppercase mb-6 md:mb-8 text-white">
                                    MONETIZE <br />
                                    YOUR STREAM <br />
                                    <span className="text-[#afff00] italic font-serif normal-case tracking-tight">On your terms.</span>
                                </h1>
                                <p className="text-base md:text-xl font-medium leading-relaxed opacity-80 mb-8 md:mb-12 max-w-lg mx-auto lg:ml-0 text-white">
                                    Never wait for payday again. Drope gives you flawless on-screen alerts and instant access to your funds, with the lowest fees in the game.
                                </p>

                                <motion.button
                                    initial={{ scale: 0.85, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 260,
                                        damping: 16,
                                        delay: 0.8
                                    }}
                                    whileHover={{ scale: 1.06 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="bg-[#afff00] text-black px-10 py-5 rounded-full font-black tracking-widest text-xs md:text-sm shadow-[0_20px_40px_rgba(175,255,0,0.2)] hover:bg-white transition-colors mx-auto lg:ml-0"
                                >
                                    $ claim your DROPE page
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* RIGHT SIDE: THE DEMO (VSM) */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex-1 w-full mt-4 lg:mt-0"
                        >
                            <StreamEngineDemo />
                        </motion.div>
                    </div>

                    {/* Vertical Marquee Tag */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 origin-right pr-20 hidden lg:block">
                        <span className="text-[14px] font-black uppercase tracking-[1em] opacity-10 whitespace-nowrap">
                            DROPE
                        </span>
                    </div>
                </section>

                {/* --- SECTION 02: THE THREE PILLARS BENTO --- */}
                <FeaturePillars />

                {/* --- SECTION 03: THE CREATOR STACK (SPLIT-SCREEN) --- */}
                <CreatorStack scrollContainerRef={scrollContainerRef} />
                <HypeChatFooter scrollContainerRef={scrollContainerRef} />
            </motion.main>
        </div>
    );
};

export default Features;

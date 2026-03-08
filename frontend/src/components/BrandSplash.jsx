import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const BrandSplash = () => {
    return (
        <div className="fixed inset-0 bg-[#020604] flex flex-col items-center justify-center overflow-hidden z-[9999]">
            {/* Background Ambience Layer */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.15, scale: 1.2 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-500/20 blur-[120px]"
                />
            </div>

            <div className="relative flex items-center gap-4 z-10">
                {/* The Zap Icon Reveal */}
                <motion.div
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        duration: 0.8
                    }}
                    className="relative"
                >
                    <Zap className="w-16 h-16 text-[#10B981] fill-[#10B981] drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]" />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        className="absolute inset-0 bg-white/20 blur-md rounded-full"
                    />
                </motion.div>

                {/* The Text Reveal with Light Sweep */}
                <div className="relative pt-2 pb-2 pr-4"> {/* Added pr-4 to prevent 'y' clipping */}
                    {/* Main Text Container sliding up */}
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 25,
                            delay: 0.1
                        }}
                        className="flex items-center relative"
                    >
                        <span className="text-6xl font-black italic tracking-tighter text-white drop-shadow-2xl">
                            Drop<span className="text-[#10B981]">Pay</span>
                        </span>

                        {/* Cinematic Light Sweep constrained exactly to the text dimensions */}
                        <div className="absolute inset-0 overflow-hidden mix-blend-overlay pointer-events-none rounded-lg">
                            <motion.div
                                initial={{ x: "-150%" }}
                                animate={{ x: "200%" }}
                                transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
                                className="absolute inset-0 w-3/4 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[20deg]"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BrandSplash;

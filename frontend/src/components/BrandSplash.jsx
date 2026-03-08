import React from 'react';
import { motion } from 'framer-motion';

const BrandSplash = () => {
    return (
        <div className="fixed inset-0 bg-[#020604] flex flex-col items-center justify-center overflow-hidden z-[9999]">
            {/* Background Ambience Layer */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.15, scale: 1.2 }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-[120px]"
                />
            </div>

            <div className="relative flex items-center justify-center z-10 w-full h-32">

                {/* The "D" (Slides left slightly) */}
                <motion.span
                    initial={{ x: 35, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{
                        opacity: { duration: 0.4, delay: 0.2 },
                        scale: { duration: 0.4, delay: 0.2 },
                        x: { type: "spring", stiffness: 100, damping: 20, delay: 1.0 } // The Slide
                    }}
                    className="text-6xl font-black italic tracking-tighter text-white drop-shadow-2xl absolute left-1/2 -translate-x-full ml-[-20px]"
                >
                    D
                </motion.span>

                {/* The "rop" (Fades in as D and P separate) */}
                <motion.span
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.2 }}
                    className="text-6xl font-black italic tracking-tighter text-white drop-shadow-2xl absolute left-1/2 ml-[-24px]"
                >
                    rop
                </motion.span>

                {/* The "P" (Slides right slightly, colored green) */}
                <motion.span
                    initial={{ x: -65, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{
                        opacity: { duration: 0.4, delay: 0.2 },
                        scale: { duration: 0.4, delay: 0.2 },
                        x: { type: "spring", stiffness: 100, damping: 20, delay: 1.0 } // The Slide
                    }}
                    className="text-6xl font-black italic tracking-tighter text-[#10B981] drop-shadow-[0_0_20px_rgba(16,185,129,0.5)] absolute left-1/2 ml-[64px]"
                >
                    P
                </motion.span>

                {/* The "ay" (Fades in after P) */}
                <motion.span
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.25 }}
                    className="text-6xl font-black italic tracking-tighter text-[#10B981] drop-shadow-[0_0_20px_rgba(16,185,129,0.5)] absolute left-1/2 ml-[96px]"
                >
                    ay
                </motion.span>


                {/* Cinematic Light Sweep / Flare over the whole text at the end */}
                <motion.div
                    initial={{ x: "-150%", opacity: 0 }}
                    animate={{ x: "200%", opacity: [0, 0.5, 0] }}
                    transition={{ duration: 1.0, delay: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-32 bg-gradient-to-r from-transparent via-white to-transparent skew-x-[-20deg] mix-blend-overlay pointer-events-none"
                    style={{ filter: 'blur(2px)' }}
                />

            </div>
        </div>
    );
};

export default BrandSplash;

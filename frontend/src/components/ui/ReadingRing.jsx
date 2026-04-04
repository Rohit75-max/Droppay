import React from 'react';
import { motion, useScroll } from 'framer-motion';

const ReadingRing = () => {
    const { scrollYProgress } = useScroll();
    
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-12 right-12 z-[100] pointer-events-none hidden md:block"
        >
            <div className="relative flex items-center justify-center w-20 h-20">
                {/* Aero-Glass Foundation */}
                <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl" />
                
                {/* Tactical SVG Ring */}
                <svg className="w-16 h-16 transform -rotate-90">
                    {/* Background Track */}
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        className="text-white/10"
                    />
                    {/* Active Progress */}
                    <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#afff00"
                        strokeWidth="2"
                        fill="transparent"
                        strokeDasharray="175.93" // 2 * PI * 28
                        style={{ pathLength: scrollYProgress }}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_#afff00]"
                    />
                </svg>

                {/* Progress Value Percentage */}
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black font-mono text-white/40">READ_DEPTH</span>
                    <motion.span className="text-[14px] font-black font-mono text-[#afff00]">
                        {/* Placeholder for animated percentage logic if needed */}
                        %
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
};

export default ReadingRing;

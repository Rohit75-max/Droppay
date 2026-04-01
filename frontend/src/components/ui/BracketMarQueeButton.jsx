import React from 'react';
import { motion } from 'framer-motion';

export const BracketMarqueeButton = ({
    children,
    marqueeText,
    onClick,
    className = "font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF2D00]"
}) => {
    const mText = marqueeText || (typeof children === 'string' ? children : "ACTIVATE");

    return (
        <motion.button
            onClick={onClick}
            initial="rest"
            whileHover="hover"
            className={`relative cursor-pointer flex items-center justify-center min-w-[80px] h-[30px] ${className}`}
            style={{ perspective: 1000 }}
        >
            {/* 1. Original Text (3D text flix/flip out) */}
            <motion.span
                variants={{
                    rest: { y: 0, opacity: 1, rotateX: 0 },
                    hover: { y: -15, opacity: 0, rotateX: 90 }
                }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                className="block relative z-10 origin-bottom"
            >
                {children}
            </motion.span>
 
            {/* 2. Brackets & Marquee Container */}
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-1 w-full">
                {/* Left Bracket */}
                <motion.span
                    variants={{
                        rest: { opacity: 0, x: 10 },
                        hover: { opacity: 1, x: 0 }
                    }}
                    transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                >
                    [
                </motion.span>
 
                {/* Center Marquee Window */}
                <motion.div
                    variants={{
                        rest: { opacity: 0 },
                        hover: { opacity: 1 }
                    }}
                    transition={{ duration: 0.3, delay: 0.1, ease: "linear" }}
                    className="flex-1 overflow-hidden mx-1 relative flex items-center h-full"
                    style={{
                        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
                    }}
                >
                    <motion.div
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
                        className="whitespace-nowrap flex w-max items-center h-full"
                    >
                        {/* Box 1 */}
                        <div className="flex gap-0 pr-0">
                            <span className="tracking-tighter">{mText}</span>
                            <span className="tracking-tighter">{mText}</span>
                            <span className="tracking-tighter">{mText}</span>
                        </div>
                        {/* Box 2 (Identical Clone for Loop) */}
                        <div className="flex gap-0 pr-0">
                            <span className="tracking-tighter">{mText}</span>
                            <span className="tracking-tighter">{mText}</span>
                            <span className="tracking-tighter">{mText}</span>
                        </div>
                    </motion.div>
                </motion.div>
 
                {/* Right Bracket */}
                <motion.span
                    variants={{
                        rest: { opacity: 0, x: -10 },
                        hover: { opacity: 1, x: 0 }
                    }}
                    transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                >
                    ]
                </motion.span>
            </div>
        </motion.button>
    );
};

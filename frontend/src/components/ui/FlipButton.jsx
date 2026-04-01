import React from 'react';
import { motion } from 'framer-motion';

export const FlipButton = ({
    children,
    hoverText,
    hoverMarquee,
    onClick,
    className = "",
    width = "120px",
    height = "40px",
    isLight = false
}) => {
    return (
        <motion.button
            onClick={onClick}
            initial="rest"
            whileHover="hover"
            className={`relative pointer-events-auto font-sans text-xs uppercase font-black tracking-tight ${className}`}
            style={{ perspective: 1000, width, height }}
        >
            {/* Front Face (Static - Fully Transparent) */}
            <motion.div
                variants={{
                    rest: { y: "0%", rotateX: 0, opacity: 1, z: 0 },
                    hover: { y: "-50%", rotateX: 90, opacity: 0, z: -30 }
                }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className={`absolute inset-0 flex items-center justify-center bg-transparent transition-colors duration-300 ${isLight ? "text-black" : "text-white"}`}
            >
                {children}
            </motion.div>
 
            {/* Bottom/Back Face (Hover - High Contrast Opposite) */}
            <motion.div
                variants={{
                    rest: { y: "50%", rotateX: -90, opacity: 0, z: -30 },
                    hover: { y: "0%", rotateX: 0, opacity: 1, z: 0 }
                }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className={`absolute inset-0 flex items-center justify-center rounded-sm transition-colors duration-300 overflow-hidden ${isLight ? "bg-black text-white" : "bg-white text-black"}`}
            >
                {hoverMarquee ? (
                    <motion.div 
                        className="w-full h-full flex items-center"
                        style={{
                            WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                            maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
                        }}
                    >
                        <motion.div
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
                            className="whitespace-nowrap flex w-max gap-4"
                        >
                            {[1, 2, 3, 4].map((n) => (
                                <span key={n} className="px-2">{hoverMarquee}</span>
                            ))}
                        </motion.div>
                    </motion.div>
                ) : (
                    hoverText || children
                )}
            </motion.div>
        </motion.button>
    );
};

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useHUD } from '../../context/HUDContext';

export const TechnicalHUD = ({ isLight = false }) => {
    const { hudMessage } = useHUD();
    
    // 1. Cursor Tracking Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 2. Smart Boundary States
    const [flipX, setFlipX] = useState(false);
    const [flipY, setFlipY] = useState(false);

    // Smooth spring physics for that "Technical Drag" feel
    const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
    const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Edge Detection Logic
            // If we are within 300px of the right edge, flip the HUD to the left
            setFlipX(e.clientX > window.innerWidth - 300);
            
            // If we are within 100px of the top edge (Navbar), flip the HUD below
            setFlipY(e.clientY < 100);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <motion.div
                style={{
                    x: springX,
                    y: springY,
                }}
                className="absolute"
            >
                <AnimatePresence mode="wait">
                    {hudMessage && (
                        <motion.div
                            key={hudMessage}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1,
                                // Offset dynamically based on screen edges
                                x: flipX ? -20 : 20,
                                y: flipY ? 20 : -45, // Default is "above" cursor (-45), flips to "below" cursor (20)
                                translateX: flipX ? "-100%" : "0.5rem"
                            }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                            className={`flex items-center gap-3 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-2xl ${
                                isLight 
                                ? 'bg-white/80 border-black/10 text-black shadow-black/5' 
                                : 'bg-black/60 border-white/10 text-white shadow-black/20'
                            }`}
                        >
                            {/* Scanning Status Dot */}
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D00] opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF2D00]" />
                            </span>

                            {/* Technical Label */}
                            <span className="font-mono text-[9px] uppercase tracking-[0.25em] whitespace-nowrap">
                                [ {hudMessage} ]
                            </span>

                            {/* Corner Tech Accent */}
                            <div className={`w-1 h-1 border-r border-t ${isLight ? 'border-black/30' : 'border-white/30'}`} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

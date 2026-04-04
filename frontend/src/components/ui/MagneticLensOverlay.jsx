import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const MagneticLensOverlay = ({ isActive, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // High-performance motion values for exact cursor tracking
  const cursorX = useMotionValue(-500);
  const cursorY = useMotionValue(-500);

  // Buttery-smooth springs (Heavy damping for "fluid" feel)
  const springConfig = { damping: 40, stiffness: 200, mass: 0.8 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // We only attach styles on mouse move to optimize performance
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    if (isActive) {
      document.body.style.cursor = 'none';
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    } else {
      document.body.style.cursor = 'auto';
      setIsVisible(false);
    }

    return () => {
      document.body.style.cursor = 'auto';
      document.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible, isActive]);

  if (!isActive) return null;

  // Hidden on mobile using sm:block since touch events lack complex hover states
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden sm:block overflow-hidden transition-opacity duration-700"
         style={{ opacity: isVisible ? 1 : 0 }}>
         
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        className="absolute top-0 left-0 -ml-[150px] -mt-[150px] w-[300px] h-[300px] rounded-full will-change-transform"
      >
        {/* Tactical X-Ray Lens */}
        <div className="w-full h-full rounded-full relative overflow-hidden group"
          style={{
            // The magic optical effect: Crisp inversion, zero blur. 
            // Inverts lightness but maintains original hue (so red stays red, black becomes white).
            backdropFilter: 'invert(100%) hue-rotate(180deg) brightness(1.1) contrast(1.2)',
            WebkitBackdropFilter: 'invert(100%) hue-rotate(180deg) brightness(1.1) contrast(1.2)',
            // Sharp tactical edge ring
            boxShadow: 'inset 0 0 0 1px rgba(255, 45, 0, 0.3), inset 0 0 20px rgba(255, 45, 0, 0.1), 0 0 30px rgba(0,0,0,0.1)',
          }}
        >
          {/* High-Contrast Tactical Markings (Optical Grid) */}
          <div className="absolute inset-0 rounded-full border-[1px] border-[#FF2D00] opacity-40 scale-[0.9]" />
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#FF2D00] opacity-20" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#FF2D00] opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-[#FF2D00] opacity-80 mix-blend-screen shadow-[0_0_12px_#FF2D00]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px] rounded-full border border-[#FF2D00] opacity-20 mix-blend-screen" />

          {/* Glitch / Scanline effect traversing the lens */}
          <motion.div 
            animate={{ y: ["0%", "300px"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF2D00] to-transparent opacity-40 shadow-[0_0_15px_#FF2D00]"
          />
        </div>
      </motion.div>

      {/* Exit Button */}
      <div className="absolute bottom-8 right-[clamp(1.5rem,5vw,4rem)] flex items-center gap-4 pointer-events-auto z-10">
          <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF2D00] hover:text-white transition-colors duration-200 border border-[#FF2D00]/40 hover:border-white/40 px-3 py-1.5 backdrop-blur-md bg-black/50"
          >
              [ × EXIT SCANNER ]
          </motion.button>
      </div>

    </div>
  );
};

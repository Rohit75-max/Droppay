import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DashboardPreloader — Premium letter-drop + fly-to-navbar animation
 *
 * Phase 1 (0–0.8s) : Letters D R O P E drop one-by-one from top to center
 * Phase 2 (0.8–1.4s): All letters settle — brief hold
 * Phase 3 (1.4–2.0s): Whole word scales down and flies to top-left (navbar)
 * Phase 4 (2.0s+)   : Background fades out, dashboard appears
 */

const LETTERS = ['D', 'R', 'O', 'P', 'E'];

// Spring drop config for each letter
const dropVariants = {
  hidden: { y: '-110vh', opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      y: {
        delay: i * 0.09,
        duration: 0.65,
        ease: [0.34, 1.4, 0.64, 1], // Springy overshoot
      },
      opacity: {
        delay: i * 0.09,
        duration: 0.25,
      },
    },
  }),
};

export const DashboardPreloader = () => {
  const [phase, setPhase] = useState('dropping'); // 'dropping' | 'flying' | 'done'

  useEffect(() => {
    // After letters fully land → start fly-to-navbar
    const flyTimer = setTimeout(() => setPhase('flying'), 1300);
    // After fly animation → unmount preloader
    const doneTimer = setTimeout(() => setPhase('done'), 2100);

    return () => {
      clearTimeout(flyTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="dashboard-preloader"
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ background: 'var(--nexus-bg, #050505)' }}
        animate={phase === 'flying' ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.55, delay: phase === 'flying' ? 0.45 : 0, ease: 'easeInOut' }}
      >
        {/* Subtle radial accent glow behind text */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: '60vw',
            height: '60vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--nexus-accent, #10B981) 0%, transparent 70%)',
            opacity: 0.04,
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.07, 0.04] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        />

        {/* ── LETTER GROUP ── */}
        <motion.div
          className="flex items-baseline select-none"
          animate={
            phase === 'flying'
              ? {
                  // Scale down to navbar logo size ~0.12-0.15 and fly to top-left
                  scale: 0.12,
                  x: 'calc(-50vw + 80px)',
                  y: 'calc(-50vh + 36px)',
                  opacity: 0,
                }
              : { scale: 1, x: 0, y: 0, opacity: 1 }
          }
          transition={
            phase === 'flying'
              ? {
                  duration: 0.65,
                  ease: [0.55, 0, 0.1, 1], // Aggressive ease-out for the "snap to navbar" feel
                }
              : {}
          }
          style={{ transformOrigin: 'center center' }}
        >
          {LETTERS.map((letter, i) => (
            <motion.span
              key={letter + i}
              custom={i}
              variants={dropVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(4.5rem, 14vw, 9rem)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: 'var(--nexus-text, #ffffff)',
                display: 'inline-block',
              }}
            >
              {letter}
            </motion.span>
          ))}

        </motion.div>

        {/* Bottom progress sweep line */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px]"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.3, ease: 'linear' }}
          style={{ background: 'var(--nexus-accent, #10B981)', opacity: 0.6 }}
        />

        {/* Corner detail — top left */}
        <div
          className="absolute top-8 left-8 text-[8px] font-black uppercase tracking-[0.5em] opacity-10"
          style={{ color: 'var(--nexus-text, #fff)', fontFamily: 'monospace' }}
        >
          NEXUS_AUTH_SYNC
        </div>

        {/* Corner detail — bottom right */}
        <div
          className="absolute bottom-8 right-8 text-[8px] font-black uppercase tracking-[0.4em] opacity-10"
          style={{ color: 'var(--nexus-text, #fff)', fontFamily: 'monospace' }}
        >
          v4.2_STABLE
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DashboardPreloader;

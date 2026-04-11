import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * TopBar — Vercel/Stripe-style thin loading bar at top of screen.
 * Use this for full-page/auth loading states.
 */
export const TopBar = () => {
  const [width, setWidth] = useState(15);

  useEffect(() => {
    // Simulate natural progress — fast at first, slows down near 90%
    const steps = [
      { target: 40, delay: 100 },
      { target: 65, delay: 400 },
      { target: 82, delay: 900 },
      { target: 90, delay: 1800 },
    ];

    const timers = steps.map(({ target, delay }) =>
      setTimeout(() => setWidth(target), delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--nexus-bg,#050505)]">
      {/* Thin top progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] z-[10000]"
        style={{
          background: 'var(--nexus-accent, #afff00)',
          boxShadow: '0 0 8px var(--nexus-accent, #afff00)',
          width: `${width}%`,
        }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
};

/**
 * InlineLoader — Small spinner with optional label.
 * Replaces spinners inside tables, buttons, drawers.
 * Usage: <InlineLoader text="LOADING_DATA" />
 */
export const InlineLoader = ({ text, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative w-4 h-4">
      <div className="absolute inset-0 border border-black/5 rounded-full" />
      <div className="absolute inset-0 border border-t-[var(--nexus-accent,#afff00)] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[var(--nexus-accent,#afff00)] rounded-full opacity-60" />
    </div>
    {text && (
      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--nexus-text-muted,#666)]">
        {text}
      </span>
    )}
  </div>
);

export default TopBar;

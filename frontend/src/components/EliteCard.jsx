import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

/**
 * EliteCard: A premium, mouse-tracking glow card component.
 * Inspired by the 2026 Elite Subscription design.
 */
const EliteCard = ({ children, className = '', glowColor = 'var(--nexus-accent-glow)', disableHover = false, ...props }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        if (disableHover) return;
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            className={`relative group overflow-hidden transition-all duration-500 ${className}`}
            {...props}
        >
            {/* Dynamic Hover Glow Layer */}
            {!disableHover && (
                <motion.div
                    className="cursor-glow-layer pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${glowColor},
              transparent 80%
            )
          `,
                }}
                />
            )}

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none z-0" />

            {/* Content Layer */}
            <div className="relative z-10 h-full flex flex-col">
                {children}
            </div>
        </motion.div>
    );
};

export default EliteCard;

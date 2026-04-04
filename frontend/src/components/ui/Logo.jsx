import React from 'react';
import { motion } from 'framer-motion';

const LETTERS = "DROPE".split("");

export const Logo = ({ size = "2rem", interactive = true, accentColor = "#afff00", layoutId, className = "", isLight = false }) => {
    return (
        <motion.div
            layoutId={layoutId}
            transition={{
                duration: 1.1,
                ease: [0.76, 0, 0.24, 1]
            }}
            className={`flex font-sans font-black uppercase leading-none tracking-tighter select-none ${className}`}
            style={{ fontSize: size, perspective: 600 }}
        >
            {LETTERS.map((letter, i) => (
                <motion.span
                    key={i}
                    className="inline-block relative"
                    style={{ 
                        WebkitTextStroke: isLight ? `1px ${accentColor === '#afff00' ? '#000' : accentColor}` : `1px ${accentColor}`,
                        color: 'transparent',
                        textShadow: !isLight ? `0 0 10px ${accentColor}33` : 'none'
                    }}
                    {...(interactive ? {
                        whileHover: { 
                            y: -4, 
                            scale: 1.1, 
                            color: accentColor,
                            WebkitTextStroke: `1px ${accentColor}`,
                            textShadow: `0 0 30px ${accentColor}80` 
                        },
                        transition: { 
                            type: "spring", 
                            stiffness: 450, 
                            damping: 15 
                        }
                    } : {})}
                >
                    {letter}
                </motion.span>
            ))}
        </motion.div>
    );
};

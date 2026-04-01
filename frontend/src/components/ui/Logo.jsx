import React from 'react';
import { motion } from 'framer-motion';

const LETTERS = "DROPE".split("");

const containerVars = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const letterDropVars = {
    initial: { y: "110%" },
    animate: {
        y: "0%",
        transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
};

export const Logo = ({ size = "2rem", interactive = true, accentColor = "#FF2D00", layoutId, className = "", isLight = false }) => {
    return (
        <motion.div
            variants={containerVars}
            initial="initial"
            animate="animate"
            layoutId={layoutId}
            transition={{
                duration: 1.1,
                ease: [0.76, 0, 0.24, 1]
            }}
            className={`flex font-sans font-black uppercase leading-none tracking-tight select-none ${className}`}
            style={{ fontSize: size, perspective: 600 }}
        >
            {LETTERS.map((letter, i) => (
                // overflow-hidden clips the reveal animation to the letter box
                // px + negative mx prevents thick letterforms from clipping on the sides
                <span key={i} className="overflow-hidden inline-block px-[0.04em] -mx-[0.04em]">
                    <motion.span variants={letterDropVars} className="inline-block">
                        {interactive ? (
                            <motion.span
                                initial="rest"
                                whileHover="hover"
                                className="relative flex cursor-default"
                            >
                                {/* Default white letter — flips out to the left */}
                                <motion.span
                                    variants={{
                                        rest: { rotateY: 0, x: "0%", opacity: 1 },
                                        hover: { rotateY: -90, x: "-50%", opacity: 0 },
                                    }}
                                    transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                                    className="inline-block origin-left"
                                >
                                    {letter}
                                </motion.span>

                                {/* Hover orange letter — flips in from the right */}
                                <motion.span
                                    variants={{
                                        rest: { rotateY: 90, x: "50%", opacity: 0 },
                                        hover: { rotateY: 0, x: "0%", opacity: 1 },
                                    }}
                                    transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                                    style={{ color: accentColor }}
                                    className="absolute inset-0 flex items-center justify-center origin-right pointer-events-none"
                                    aria-hidden="true"
                                >
                                    {letter}
                                </motion.span>
                            </motion.span>
                        ) : (
                            <span className="inline-block">{letter}</span>
                        )}
                    </motion.span>
                </span>
            ))}
        </motion.div>
    );
};

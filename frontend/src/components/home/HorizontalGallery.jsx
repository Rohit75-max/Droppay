import React, { useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";

export const HorizontalGallery = ({ containerRef }) => {
    const targetRef = useRef(null);

    // Track scroll relative to the custom main scrolling container
    const { scrollYProgress } = useScroll({
        target: targetRef,
        container: containerRef,
        offset: ["start start", "end end"]
    });

    // Slide 2 overlaps Slide 1
    const x2 = useTransform(scrollYProgress, [0, 0.25], ["100%", "0%"]);
    // Slide 3 overlaps Slide 2
    const x3 = useTransform(scrollYProgress, [0.25, 0.5], ["100%", "0%"]);
    // Slide 4 overlaps Slide 3
    const x4 = useTransform(scrollYProgress, [0.5, 0.75], ["100%", "0%"]);

    const xTransforms = [null, x2, x3, x4];

    return (
        <section 
            ref={targetRef} 
            data-navbar-theme="light"
            className="relative h-[400vh] bg-white snap-start [scroll-snap-stop:always]"
        >
            <div data-navbar-theme="light" className="sticky top-0 h-screen w-full overflow-hidden">
                {[
                    { title: "Unified", label: "004 // 01" },
                    { title: "Secure",  label: "004 // 02" },
                    { title: "Fast",    label: "004 // 03" },
                    { title: "Ready",   label: "004 // 04" }
                ].map((slide, i) => {
                    const zClasses = ["z-[41]", "z-[42]", "z-[43]", "z-[44]"];
                    const bgClass = i % 2 !== 0 ? 'bg-zinc-50' : 'bg-white';

                    return (
                        <motion.div
                            key={i}
                            style={i > 0 ? { x: xTransforms[i] || "0%" } : {}}
                            className={`absolute inset-0 flex flex-col justify-start px-[clamp(1.5rem,5vw,4rem)] pt-0 ${bgClass} ${zClasses[i]}`}
                        >
                            <div className="h-[70px] w-full shrink-0" />
                            <div className="w-full border-t border-black/10 pt-5">
                                <span className="font-mono text-[10px] uppercase mb-4 text-[#FF2D00] block tracking-widest">
                                    {slide.label}
                                </span>
                                <h3 className={`font-heading text-[clamp(3.5rem,15vw,20vw)] leading-[0.8] uppercase tracking-tighter text-black ${i !== 0 ? 'italic' : ''}`}>
                                    {slide.title}<span className="text-[#FF2D00]">.</span>
                                </h3>
                            </div>
                            <div className="flex-grow" />
                            <div className="h-[70px] w-full shrink-0" />
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};


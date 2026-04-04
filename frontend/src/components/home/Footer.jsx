import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useVelocity, useSpring, useAnimationFrame, useMotionValue } from 'framer-motion';
import { ScrambleText } from '../ui/ScrambleText';

// --- MASSIVE BACKGROUND MARQUEE ---
const VelocityMarquee = () => {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

    const directionFactor = useRef(-1);

    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * 0.005 * delta;

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        
        let newX = baseX.get() + moveBy;
        if (newX <= -50) newX += 50;
        else if (newX > 0) newX -= 50;
        
        baseX.set(newX);
    });

    const x = useTransform(baseX, v => `${v}%`);

    return (
        <div className="absolute inset-x-0 top-1/2 -translate-y-[60%] flex items-center overflow-hidden opacity-[0.08] z-0 pointer-events-none select-none">
            <motion.div 
                className="flex font-heading uppercase tracking-tighter font-black w-max leading-none" 
                style={{ x, WebkitTextStroke: "2px rgba(255, 255, 255, 1)", color: "transparent", fontSize: '20vw' }}
            >
                <span className="block pr-12 whitespace-nowrap">OWN THE FLOW // 0% FEES // INSTANT SETTLEMENT //</span>
                <span className="block pr-12 whitespace-nowrap">OWN THE FLOW // 0% FEES // INSTANT SETTLEMENT //</span>
                <span className="block pr-12 whitespace-nowrap">OWN THE FLOW // 0% FEES // INSTANT SETTLEMENT //</span>
                <span className="block pr-12 whitespace-nowrap">OWN THE FLOW // 0% FEES // INSTANT SETTLEMENT //</span>
            </motion.div>
        </div>
    );
};


function NewsletterWidget() {
    const [state, setState] = useState('idle');
    const [email, setEmail] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [isDecrypted, setIsDecrypted] = useState(false);
    const [placeholder, setPlaceholder] = useState('');

    const inputRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (state !== 'open') return;
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setState('idle');
                setEmail('');
                setPlaceholder('');
                setIsDecrypted(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [state]);

    const handleOpen = () => {
        setState('open');
        setTimeout(() => inputRef.current?.focus(), 400);
        
        let i = 0;
        const txt = 'ENTER_SECURE_PAYLOAD...';
        setPlaceholder('');
        const interval = setInterval(() => {
            setPlaceholder(txt.slice(0, i + 1));
            i++;
            if (i >= txt.length) clearInterval(interval);
        }, 40);
    };

    const handleHoverEnd = () => {
        setIsHovered(false);
        setIsDecrypted(false);
    };

    return (
        <div ref={wrapperRef} className="relative overflow-hidden h-[55px] min-w-[240px]">
            <AnimatePresence mode="wait">
                {state === 'idle' ? (
                    <motion.button
                        key="idle"
                        initial={{ y: 0 }}
                        exit={{ y: -60, transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } }}
                        onClick={handleOpen}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={handleHoverEnd}
                        className="w-full h-full font-mono text-[11px] uppercase tracking-[0.25em] border border-white/30 text-white relative flex items-center justify-center group outline-none bg-transparent overflow-hidden"
                    >
                        {/* Neon Bloom Background */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 0.2 : 0 }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_center,#afff00_0%,transparent_70%)] pointer-events-none"
                        />

                        {/* Scanning Laser */}
                        {isDecrypted && isHovered && (
                            <motion.div 
                                initial={{ left: "-10%" }}
                                animate={{ left: "110%" }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 bottom-0 w-[1px] bg-[#afff00] shadow-[0_0_10px_#afff00] z-20 pointer-events-none"
                            />
                        )}

                        <div className="relative z-10 flex items-center justify-center w-full">
                            <motion.span 
                                animate={{ x: isHovered ? -12 : 0 }} 
                                transition={{ type: "spring", stiffness: 400, damping: 20 }} 
                                className="text-[#afff00] font-black mr-2"
                            >
                                [
                            </motion.span>
                            
                            <ScrambleText 
                                text="NEWSLETTER" 
                                isHovered={isHovered} 
                                onComplete={() => setIsDecrypted(true)}
                            />
                            
                            <motion.span 
                                animate={{ x: isHovered ? 12 : 0 }} 
                                transition={{ type: "spring", stiffness: 400, damping: 20 }} 
                                className="text-[#afff00] font-black ml-2"
                            >
                                ]
                            </motion.span>
                        </div>
                    </motion.button>
                ) : (
                    <motion.div
                        key="open"
                        initial={{ y: 60 }}
                        animate={{ y: 0 }}
                        exit={{ y: 60 }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        className="w-full h-full flex items-center border border-[#afff00]/50 bg-black/80 relative"
                    >
                        <input
                            ref={inputRef}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && setState('idle')}
                            placeholder={placeholder}
                            className="bg-transparent outline-none font-mono text-[11px] text-[#afff00] uppercase px-4 w-full placeholder:text-zinc-700 tracking-widest h-full"
                        />
                        <motion.button
                            whileHover="hover"
                            onClick={() => setState('idle')}
                            className="h-full px-6 flex items-center justify-center text-[#afff00] border-l border-[#afff00]/30 hover:bg-[#afff00]/10 transition-colors"
                        >
                            <motion.span
                                variants={{
                                    hover: { x: [0, 5, 0], transition: { repeat: Infinity, duration: 0.6 } }
                                }}
                                className="text-xl font-bold"
                            >
                                →
                            </motion.span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- MAGNETIC ICON ---
const MagneticIcon = ({ children }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouse = (e) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = left + width / 2;
        const middleY = top + height / 2;
        const offsetX = clientX - middleX;
        const offsetY = clientY - middleY;
        
        setPosition({ x: offsetX * 0.4, y: offsetY * 0.4 });
        setIsHovered(true);
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <div 
            className="relative p-6 -m-6 flex items-center justify-center cursor-pointer" 
            onMouseMove={handleMouse} 
            onMouseLeave={reset}
        >
            <motion.button
                ref={ref}
                animate={{ 
                    x: position.x, 
                    y: position.y, 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
                className={`transition-colors duration-300 ${isHovered ? 'text-[#afff00]' : 'text-white'}`}
            >
                {children}
            </motion.button>
        </div>
    );
};

export const Footer = () => {
    return (
        <motion.footer 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            data-navbar-theme="dark" 
            className="home-section-panel bg-[#030303] relative overflow-hidden min-h-[90vh] flex flex-col justify-end border-t border-white/5"
        >
            {/* === VELOCITY MARQUEE LAYER === (BACKGROUND) */}
            <VelocityMarquee />

            <div className="w-full h-full flex flex-col justify-end px-[clamp(1.5rem,5vw,4rem)] pb-12 relative z-10 pointer-events-auto">
                
                {/* === CALL TO ACTION & NEWSLETTER === */}
                <div className="w-full flex flex-col lg:flex-row gap-16 justify-between items-start lg:items-end mb-16">
                    <div className="max-w-xl">
                        <div className="relative mb-10">
                            <div className="flex flex-col space-y-[-0.25em]">
                                {/* LINE 1: OWN YOUR */}
                                <h2 className="font-heading text-white text-[clamp(3.5rem,9vw,10vw)] uppercase leading-none tracking-tighter italic flex overflow-hidden">
                                    {"OWN YOUR".split("").map((char, i) => (
                                        <motion.span
                                            key={i}
                                            whileHover={{ y: -12, color: "#afff00" }}
                                            variants={{
                                                hidden: { y: -60, opacity: 0 },
                                                visible: { 
                                                    y: 0, 
                                                    opacity: 1,
                                                    transition: { 
                                                        duration: 0.8, 
                                                        delay: i * 0.04,
                                                        ease: [0.16, 1, 0.3, 1] 
                                                    } 
                                                }
                                            }}
                                            className={`${char === " " ? "mr-6" : ""} ${i >= 4 ? "text-[#afff00]" : "text-white"} cursor-default`}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </h2>

                                {/* LINE 2: REVENUE */}
                                <h2 className="font-heading text-white text-[clamp(3.5rem,9vw,10vw)] uppercase leading-none tracking-tighter italic flex overflow-hidden">
                                    {"REVENUE".split("").map((char, i) => (
                                        <motion.span
                                            key={i}
                                            whileHover={{ y: -12, color: "#afff00" }}
                                            variants={{
                                                hidden: { y: 60, opacity: 0 },
                                                visible: { 
                                                    y: 0, 
                                                    opacity: 1,
                                                    transition: { 
                                                        duration: 0.8, 
                                                        delay: 0.4 + (i * 0.04),
                                                        ease: [0.16, 1, 0.3, 1] 
                                                    } 
                                                }
                                            }}
                                            className="cursor-default"
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </h2>
                            </div>
                            
                            <div className="relative w-full mt-4 h-[2px]">
                                <motion.div 
                                    variants={{
                                        hidden: { scaleX: 0 },
                                        visible: { 
                                            scaleX: 1,
                                            transition: { delay: 1.4, duration: 0.8, ease: "easeInOut" }
                                        }
                                    }}
                                    className="absolute inset-0 bg-[#afff00] origin-left shadow-[0_0_20px_rgba(175,255,0,1)]"
                                />
                                {/* Glow Sweep */}
                                <motion.div 
                                    variants={{
                                        hidden: { left: "0%", opacity: 0 },
                                        visible: { 
                                            left: "100%", 
                                            opacity: [0, 1, 0],
                                            transition: { delay: 1.4, duration: 1, ease: "easeInOut" } 
                                        }
                                    }}
                                    className="absolute top-[-6px] bottom-[-6px] w-32 bg-[#afff00] blur-xl z-10 pointer-events-none"
                                />
                            </div>
                        </div>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
                            className="font-mono text-zinc-400 text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed max-w-[400px]"
                        >
                            Get exclusive access to underground brand drops, unreleased features, and high-fidelity intel before anyone else.
                        </motion.p>
                    </div>

                    {/* VSM Context Widget */}
                    <div className="mb-4 lg:mb-0">
                        <NewsletterWidget />
                    </div>
                </div>

                {/* === FOOTER META === */}
                <div className="flex flex-row justify-between items-end border-t border-white/10 pt-8 mt-2">
                    <div className="font-mono text-[clamp(8px,1vw,10px)] space-y-1 uppercase text-zinc-500 tracking-widest">
                        <p className="hover:text-white transition-colors cursor-crosshair">Protocol_Location: India</p>
                        <p className="hover:text-white transition-colors cursor-crosshair">DROPE © {new Date().getFullYear()}</p>
                    </div>

                    {/* MAGNETIC SOCIAL LINKS */}
                    <div className="flex gap-6 md:gap-10 items-center justify-end">
                        <MagneticIcon>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
                            </svg>
                        </MagneticIcon>
                        
                        <MagneticIcon>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </MagneticIcon>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

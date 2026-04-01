import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

function NewsletterWidget() {
    const [state, setState] = useState('idle');
    const [email, setEmail] = useState('');
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);

    // Collapse back to idle when clicking outside
    useEffect(() => {
        if (state !== 'open') return;
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setState('idle');
                setEmail('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [state]);

    const handleOpen = () => {
        setState('open');
        setTimeout(() => inputRef.current?.focus(), 300);
    };

    const handleSubmit = () => {
        if (!email) return;
        setState('submitted');
    };

    return (
        <motion.div ref={wrapperRef} layout className="flex items-center">
            <AnimatePresence mode="wait">

                {/* STATE 1: Idle — compact button */}
                {state === 'idle' && (
                    <motion.button
                        key="idle"
                        layout
                        initial="rest"
                        whileHover="hover"
                        animate="rest"
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                        onClick={handleOpen}
                        className="font-mono text-[10px] uppercase tracking-[0.25em] border border-white/30 px-6 py-3 text-white hover:border-[#FF2D00] hover:text-[#FF2D00] transition-colors duration-300 min-w-[160px] h-[45px] overflow-hidden relative flex items-center justify-center"
                    >
                        {/* Original Text - Flips up */}
                        <motion.span
                            variants={{
                                rest: { y: 0, opacity: 1 },
                                hover: { y: -20, opacity: 0 }
                            }}
                            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                            className="block"
                        >
                            [ Newsletter ]
                        </motion.span>

                        {/* Marquee Text - Scrolls in */}
                        <motion.div
                            variants={{
                                rest: { opacity: 0, y: 20 },
                                hover: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                            className="absolute inset-0 flex items-center justify-center overflow-hidden"
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
                                    <span key={n} className="px-2">NEWSLETTER // JOIN THE DROP</span>
                                ))}
                            </motion.div>
                        </motion.div>
                    </motion.button>
                )}

                {/* STATE 2: Open — expanded input */}
                {state === 'open' && (
                    <motion.div
                        key="open"
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                        className="flex items-center border-b border-white/30 group relative"
                    >
                        <motion.input
                            ref={inputRef}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '240px', opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="YOUR EMAIL"
                            className="bg-transparent outline-none font-mono text-[10px] text-white uppercase px-2 py-3 placeholder:text-zinc-600 tracking-widest"
                        />
                        <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.25 }}
                            onClick={handleSubmit}
                            className="font-mono text-[10px] uppercase tracking-[0.25em] text-white hover:text-[#FF2D00] transition-colors duration-300 px-4 py-3 whitespace-nowrap"
                        >
                            Submit →
                        </motion.button>
                        {/* Animated underline */}
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#FF2D00] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </motion.div>
                )}

                {/* STATE 3: Submitted — confirmation */}
                {state === 'submitted' && (
                    <motion.span
                        key="submitted"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                        className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#FF2D00]"
                    >
                        [ Subscribed ✓ ]
                    </motion.span>
                )}

            </AnimatePresence>
        </motion.div>
    );
}

export const Footer = () => {
    const footerRef = useRef(null);

    // Track scroll against the window — footer is in normal document flow
    const { scrollYProgress } = useScroll({
        target: footerRef,
        offset: ["start end", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-5%", "0%"]);
 
    return (
        <footer ref={footerRef} data-navbar-theme="dark" className="home-section-panel bg-black relative overflow-hidden min-h-screen flex flex-col justify-end">
            <motion.div
                style={{ y }}
                className="w-full h-fit flex flex-col justify-end px-[clamp(1.5rem,5vw,4rem)] pb-10"
            >
                {/* === NEWSLETTER SECTION === */}
                <div className="w-full flex flex-col md:flex-row gap-12 justify-between items-start md:items-end mb-12">
                    <div className="max-w-xl">
                        <h3 className="font-heading text-white text-[clamp(2.5rem,6vw,4rem)] uppercase leading-[0.9] tracking-tighter mb-4">
                            Join the Drop.
                        </h3>
                        <p className="font-mono text-white text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                            Get exclusive access to underground<br />
                            brand drops, unreleased features,<br />
                            and high-fidelity intel before<br />
                            anyone else.
                        </p>
                    </div>

                    {/* Animated Newsletter Widget */}
                    <NewsletterWidget />
                </div>



                {/* === FOOTER META === */}
                <div className="flex justify-between items-end border-t border-white/10 pt-8 mt-12">
                    <div className="font-mono text-[clamp(8px,1vw,10px)] space-y-2 uppercase text-white tracking-widest">
                        <p>India</p>
                        <p>DROPE © 2026</p>
                    </div>
                    <div className="flex gap-6 items-center">
                        {/* X (Twitter) */}
                        <button type="button" aria-label="X (Twitter)" className="text-white hover:text-[#FF2D00] transition-colors duration-300">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
                            </svg>
                        </button>
                        {/* Instagram */}
                        <button type="button" aria-label="Instagram" className="text-white hover:text-[#FF2D00] transition-colors duration-300">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </button>
                        {/* GitHub */}
                        <button type="button" aria-label="GitHub" className="text-white hover:text-[#FF2D00] transition-colors duration-300">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
};

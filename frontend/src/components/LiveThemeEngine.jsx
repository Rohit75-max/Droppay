import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ELITE LIVE THEME ENGINE
 * Bulletproofed: Auto-maps store IDs, handles video loading safely, and supports Store Previews.
 */
const LiveThemeEngine = ({ currentTheme, isPreview = false }) => {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isNightTime, setIsNightTime] = useState(false);

    // 1. THE ID TRANSLATOR (Fixes the blank screen issue in the store)
    const themeDictionary = {
        'th1': 'live_synthwave',
        'th2': 'live_dragon',
        'th3': 'live_cyber',
        // Safe fallbacks
        'live_synthwave': 'live_synthwave',
        'live_dragon': 'live_dragon',
        'live_cyber': 'live_cyber',
        'live_space': 'live_space',
        'live_erangel': 'live_erangel'
    };

    // Automatically translate 'th1' to 'live_synthwave'
    const activeTheme = themeDictionary[currentTheme] || currentTheme;

    // Handle smooth loading transitions and time-sync logic
    useEffect(() => {
        // Calculate Day/Night for Sky Sanctuary (live_kawaii)
        const currentHour = new Date().getHours();
        setIsNightTime(currentHour >= 19 || currentHour <= 6);

        // Handle the Loading Spinner
        const videoBasedThemes = ['live_space', 'live_erangel', 'live_cyber'];

        if (videoBasedThemes.includes(activeTheme)) {
            setIsVideoLoaded(false);

            // SAFETY NET: Force video loaded after 3 seconds just in case the URL gets blocked
            const fallbackTimer = setTimeout(() => setIsVideoLoaded(true), 3000);
            return () => clearTimeout(fallbackTimer);
        } else {
            // CSS Themes load instantly
            setIsVideoLoaded(true);
        }
    }, [activeTheme]);

    // If it's a standard free theme (or undefined), don't render the engine at all
    if (!activeTheme?.startsWith('live_')) return null;

    return (
        <div className={`${isPreview ? 'absolute' : 'fixed'} inset-0 z-0 pointer-events-none overflow-hidden bg-black`}>

            {/* ========================================== */}
            {/* 1. ZERO-GRAVITY (Space/Sci-Fi)             */}
            {/* ========================================== */}
            {activeTheme === 'live_space' && (
                <>
                    {/* Cinematic Earth/Space Video Loop */}
                    <video
                        autoPlay loop muted playsInline
                        onLoadedData={() => setIsVideoLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 mix-blend-screen ${isVideoLoaded ? 'opacity-60' : 'opacity-0'}`}
                    >
                        {/* Highly Stable Fallback Video URL */}
                        <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" type="video/mp4" />
                    </video>
                    {/* Blue Atmospheric Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-80" />
                    {/* Floating CSS Stardust */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[spin_200s_linear_infinite] opacity-30" />
                </>
            )}

            {/* ========================================== */}
            {/* 2. ERANGEL RED-ZONE (Tactical Warzone)     */}
            {/* ========================================== */}
            {activeTheme === 'live_erangel' && (
                <>
                    {/* Battlefield Smoke/Fire Video Loop */}
                    <video
                        autoPlay loop muted playsInline
                        onLoadedData={() => setIsVideoLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 mix-blend-luminosity ${isVideoLoaded ? 'opacity-40' : 'opacity-0'}`}
                    >
                        {/* Highly Stable Fallback Video URL */}
                        <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/mp4" />
                    </video>
                    {/* The "Red Zone" Pulsing Vignette */}
                    <motion.div
                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(220,38,38,0.8)_100%)]"
                    />
                    {/* Falling Ash / Cinders (Simulated with repeating gradient dots) */}
                    <motion.div
                        animate={{ y: [0, 1000] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[100%] left-0 w-full h-[200%] bg-[radial-gradient(#f97316_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"
                    />
                </>
            )}

            {/* ========================================== */}
            {/* 3. HACKER's TERMINAL (Cyber OS Pro)        */}
            {/* ========================================== */}
            {activeTheme === 'live_cyber' && (
                <>
                    {/* Matrix Digital Rain Video Loop */}
                    <video
                        autoPlay loop muted playsInline
                        onLoadedData={() => setIsVideoLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 mix-blend-screen ${isVideoLoaded ? 'opacity-30' : 'opacity-0'}`}
                    >
                        {/* Highly Stable Fallback Video URL */}
                        <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" type="video/mp4" />
                    </video>
                    {/* Scanline CRT Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />
                    {/* Heavy Dark Vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000500_90%)]" />
                </>
            )}

            {/* ========================================== */}
            {/* 4. NEON OVERDRIVE (80s Synthwave)          */}
            {/* ========================================== */}
            {activeTheme === 'live_synthwave' && (
                <div className="absolute inset-0 bg-[#02000d] overflow-hidden">
                    {/* Glowing Sun */}
                    <motion.div
                        animate={{ scale: [1, 1.02, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-b from-[#ff00aa] to-[#ffaa00] blur-[2px] shadow-[0_0_100px_#ff00aa]"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%, 0 55%, 100% 55%, 100% 65%, 0 65%, 0 72%, 100% 72%, 100% 82%, 0 82%, 0 95%, 100% 95%, 100% 100%, 0 100%)' }}
                    />
                    {/* Infinite 3D Scrolling Grid */}
                    <div className="absolute bottom-0 w-[200%] h-[60%] -left-[50%] bg-[#02000d]" style={{ perspective: '600px' }}>
                        <div className="w-full h-[200%] absolute bottom-0 synthwave-grid-anim border-t-2 border-[#00ffff] shadow-[0_-5px_30px_#00ffff]" style={{ transform: 'rotateX(75deg)' }}>
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_48%,#ff00aa_50%,transparent_52%),linear-gradient(90deg,transparent_48%,#00ffff_50%,transparent_52%)] bg-[size:60px_60px]" />
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================== */}
            {/* 5. SKY SANCTUARY (VTuber Parallax)         */}
            {/* ========================================== */}
            {activeTheme === 'live_kawaii' && (
                <div className={`absolute inset-0 overflow-hidden transition-colors duration-2000 ${isNightTime ? 'bg-gradient-to-b from-[#0f172a] to-[#1e1b4b]' : 'bg-gradient-to-b from-[#a1c4fd] to-[#c2e9fb]'}`}>
                    {/* Dynamic Sun or Moon */}
                    <div
                        className={`absolute top-20 right-32 w-32 h-32 rounded-full blur-[2px] transition-all duration-2000 ${isNightTime ? 'bg-slate-200 shadow-[0_0_80px_#e2e8f0] shadow-inner' : 'bg-white shadow-[0_0_80px_#fff]'}`}
                        style={isNightTime ? { clipPath: 'circle(70% at 30% 50%)' } : {}}
                    />
                    {/* Cloud Layers */}
                    <motion.div
                        animate={{ x: [0, -2000] }}
                        transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
                        className="absolute top-[10%] left-0 w-[300%] h-64 bg-[url('https://www.transparenttextures.com/patterns/clouds.png')] opacity-40 bg-[size:auto_100%]"
                    />
                    <motion.div
                        animate={{ x: [0, -2000] }}
                        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
                        className="absolute top-[30%] left-0 w-[300%] h-96 bg-[url('https://www.transparenttextures.com/patterns/clouds.png')] opacity-60 bg-[size:auto_100%] scale-150"
                    />
                    <motion.div
                        animate={{ x: [0, -2000] }}
                        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[300%] h-[500px] bg-[url('https://www.transparenttextures.com/patterns/clouds.png')] opacity-80 bg-[size:auto_100%] scale-[2] blur-sm"
                    />
                </div>
            )}

            {/* ========================================== */}
            {/* 6. THE DRAGON'S HOARD (Fantasy/RPG)        */}
            {/* ========================================== */}
            {activeTheme === 'live_dragon' && (
                <div className="absolute inset-0 bg-[#060402] overflow-hidden">

                    {/* Deep ember radial from bottom — atmospheric heat */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_100%,rgba(251,191,36,0.08)_0%,transparent_70%)]" />

                    {/* Slow-pulsing amber haze — the dragon's breath */}
                    <motion.div
                        animate={{ opacity: [0.04, 0.12, 0.04], scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none"
                    />

                    {/* Outer Rune Ring — slow clockwise orbit */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 240, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-amber-500/8 pointer-events-none"
                    >
                        {/* Rune notch marks on the outer ring */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                            <div
                                key={deg}
                                className="absolute w-3 h-1 bg-amber-500/20 rounded-full"
                                style={{ top: '50%', left: '50%', transformOrigin: '-448px 0', transform: `rotate(${deg}deg) translateX(-448px)` }}
                            />
                        ))}
                    </motion.div>

                    {/* Middle Rune Ring — counter-clockwise */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 160, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-dashed border-amber-400/6 pointer-events-none"
                    />

                    {/* Inner Rune Sigil — rotating square diamond */}
                    <motion.div
                        animate={{ rotate: 360, opacity: [0.04, 0.1, 0.04] }}
                        transition={{ rotate: { repeat: Infinity, duration: 120, ease: "linear" }, opacity: { repeat: Infinity, duration: 10, ease: "easeInOut" } }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-amber-500/10 rotate-45 pointer-events-none"
                    />

                    {/* Floating ember sparks — dispersed, no grid pattern */}
                    {[
                        { x: '15%', delay: 0, dur: 14 },
                        { x: '30%', delay: 3, dur: 18 },
                        { x: '50%', delay: 6, dur: 12 },
                        { x: '65%', delay: 1.5, dur: 20 },
                        { x: '80%', delay: 4, dur: 16 },
                        { x: '42%', delay: 8, dur: 22 },
                        { x: '72%', delay: 2, dur: 11 },
                    ].map((spark, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: '110%', opacity: 0 }}
                            animate={{ y: '-20%', opacity: [0, 0.6, 0] }}
                            transition={{ repeat: Infinity, duration: spark.dur, delay: spark.delay, ease: "easeOut" }}
                            className="absolute bottom-0 w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]"
                            style={{ left: spark.x }}
                        />
                    ))}
                </div>
            )}


            {/* ========================================== */}
            {/* Premium Loading Overlay                    */}
            {/* ========================================== */}
            <AnimatePresence>
                {!isVideoLoaded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black flex items-center justify-center z-50"
                    >
                        <div className="w-8 h-8 border-2 border-[var(--nexus-accent)] border-t-transparent rounded-full animate-spin opacity-50" />
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default LiveThemeEngine;
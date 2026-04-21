import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useHUD } from '../../context/HUDContext';
import { Logo } from '../ui/Logo';
import { ScrambleText } from '../ui/ScrambleText';

export const Navbar = ({ showLogo = true }) => {
  const { showHUD, hideHUD } = useHUD();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-navbar-theme]');

      // Pinpoint the section perfectly underneath the Navbar's vertical center (approx 35px down)
      // Scanning the array in reverse ensures we hit the most nested/topmost visible DOM element first
      const activeSection = Array.from(sections).reverse().find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 35 && rect.bottom > 35;
      });

      if (activeSection) {
        setIsLight(activeSection.getAttribute('data-navbar-theme') === 'light');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Also listen to the main container just in case it becomes a scroll container in the future
    const container = document.querySelector('.home-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const navLinks = [
    { title: "Feature", path: "/features", hud: "EXPLORE PROTOCOLS" },
    { title: "Pricing", path: "/pricing", hud: "ROUTING & PRICING" },
    { title: "Core", path: "/blog", hud: "CORE ACCESS" }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[120] h-[70px] flex items-center justify-between px-[clamp(1.5rem,5vw,4rem)] pointer-events-none transition-all duration-500 bg-transparent">
        {/* 1. LOGO WITH SHARED ELEMENT TRANSITION */}
        <div className="pointer-events-none transition-colors duration-300 flex-1 flex justify-start">
          {showLogo && (
            <Link
              to="/"
              onClick={() => { setIsMenuOpen(false); hideHUD(); }}
              className="block relative z-[110] pointer-events-auto"
            >
              <Logo
                size="1.1rem"
                layoutId="main-logo"
                className={isLight ? (isMenuOpen ? 'text-white' : 'text-black') : 'text-white'}
                accentColor="#afff00"
                isLight={isLight && !isMenuOpen}
              />
            </Link>
          )}
        </div>

        {/* 2. CENTER NAV LINKS (Perfect Calibration) */}
        <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 pointer-events-auto z-[130]">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={hideHUD}
            >
              <span className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[#afff00] ${isLight ? 'text-black' : 'text-white'}`}>
                {link.title}
              </span>
            </Link>
          ))}
        </div>

        {/* 3. RIGHT CTAS & TOGGLE */}
        <div className="flex-1 flex justify-end items-center gap-3 md:gap-8 pointer-events-none relative z-[111]">
          <div className="hidden sm:flex items-center gap-3 md:gap-8 pointer-events-auto">
            <Link to="/signup" onClick={() => { setIsMenuOpen(false); hideHUD(); }}>
              <span className={`px-4 py-1.5 border ${isLight ? (isMenuOpen ? 'border-white/20' : 'border-black/20') : 'border-white/20'} rounded-full font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#afff00] hover:border-[#afff00] hover:text-black ${isLight ? 'text-black' : 'text-white'}`}>
                Join
              </span>
            </Link>

            <Link
              to="/login"
              onClick={() => { setIsMenuOpen(false); hideHUD(); }}
              onMouseEnter={() => showHUD("WELCOME BACK")}
              onMouseLeave={hideHUD}
              className="transition-all duration-300"
            >
              <span className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[#afff00] ${isLight ? 'text-black' : 'text-white'}`}>
                Login
              </span>
            </Link>
          </div>

          {/* Tactical Hamburger Toggle (Only for small phones) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col gap-1.5 p-2 sm:hidden group pointer-events-auto relative h-10 w-10 items-center justify-center"
            aria-label="Toggle Menu"
          >
            {/* Top Line -> Slides Right */}
            <motion.div
              animate={isMenuOpen ? { x: 40, opacity: 0 } : { x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`absolute top-[12px] w-5 h-[1.5px] bg-[#afff00]`}
            />

            {/* Middle Line A -> Rotates 45 */}
            <motion.div
              animate={isMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`absolute top-[19px] w-5 h-[1.5px] bg-[#afff00]`}
            />

            {/* Middle Line B -> Rotates -45 */}
            <motion.div
              animate={isMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`absolute top-[19px] w-5 h-[1.5px] bg-[#afff00]`}
            />

            {/* Bottom Line -> Slides Left */}
            <motion.div
              animate={isMenuOpen ? { x: -40, opacity: 0 } : { x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`absolute top-[26px] w-5 h-[1.5px] bg-[#afff00]`}
            />
          </button>
        </div>
      </nav>

      {/* 3. TACTICAL OVERLAY MENU (Mobile Only) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: {
                clipPath: "circle(150% at calc(100% - 3rem) 35px)",
                transition: { type: "spring", stiffness: 20, restDelta: 2 }
              },
              closed: {
                clipPath: "circle(0% at calc(100% - 3rem) 35px)",
                transition: { type: "spring", stiffness: 400, damping: 40 }
              }
            }}
            className="fixed inset-0 z-[105] bg-black/90 backdrop-blur-xl flex flex-col sm:hidden overflow-hidden"
          >
            {/* Background HUD Decor */}
            <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />

            {/* Corner HUD Brackets */}
            <div className="absolute inset-0 pointer-events-none p-6">
              {[
                { t: 0, l: 0, r: 'auto', b: 'auto', border: 'border-t border-l' },
                { t: 0, l: 'auto', r: 0, b: 'auto', border: 'border-t border-r' },
                { t: 'auto', l: 0, r: 'auto', b: 0, border: 'border-b border-l' },
                { t: 'auto', l: 'auto', r: 0, b: 0, border: 'border-b border-r' },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute w-8 h-8 ${pos.border} border-[#afff00]/40`}
                  style={{ top: pos.t, left: pos.l, right: pos.r, bottom: pos.b }}
                />
              ))}
            </div>

            {/* Menu Sections */}
            <div className="flex-1 flex flex-col justify-between pt-32 pb-10 px-[clamp(1.5rem,5vw,4rem)] relative z-10">
              {/* Primary Links */}
              <div className="flex flex-col gap-6 lg:gap-8 justify-center">
                {navLinks.map((link, i) => (
                  <MobileNavItem
                    key={link.path}
                    link={link}
                    index={i}
                    onClose={() => setIsMenuOpen(false)}
                  />
                ))}
              </div>

              {/* BOTTOM CTAS: LOGIN & JOIN SIDE BY SIDE */}
              <div className="flex gap-12 pt-20 border-t border-white/5 justify-center">
                {[
                  { title: "Join", path: "/signup" },
                  { title: "Login", path: "/login" }
                ].map((link, i) => (
                  <MobileNavItem
                    key={link.path}
                    link={link}
                    index={i + navLinks.length}
                    onClose={() => setIsMenuOpen(false)}
                    isCTA
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- INTERNAL MOBILE NAV ITEM ---
const MobileNavItem = ({ link, index, onClose, isCTA = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{
        opacity: [0, 1, 0.8, 1], // Flicker effect
        x: 0
      }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        times: [0, 0.2, 0.4, 1]
      }}
    >
      <Link
        to={link.path}
        onClick={onClose}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative inline-block overflow-hidden"
      >
        {/* Horizontal Neon Laser Sweep */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0, originX: 1 }}
              className="absolute bottom-[20%] left-0 right-0 h-[2px] bg-[#afff00] z-0 shadow-[0_0_10px_#afff00]"
            />
          )}
        </AnimatePresence>

        <span className={`relative z-10 font-heading uppercase leading-none transition-colors duration-300 ${isCTA ? 'text-[10vw]' : 'text-[12vw]'} ${isHovered ? 'text-white' : 'text-white/80'}`}>
          <ScrambleText
            text={link.title}
            isHovered={isHovered}
            className={isHovered ? "text-[#afff00]" : ""}
          />
        </span>
      </Link>
    </motion.div>
  );
};

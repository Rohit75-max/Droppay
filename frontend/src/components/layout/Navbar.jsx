import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useHUD } from '../../context/HUDContext';
import { FlipButton } from '../ui/FlipButton';
import { BracketMarqueeButton as RollingButton } from '../ui/BracketMarQueeButton';
import { Logo } from '../ui/Logo';

export const Navbar = ({ showLogo = true }) => {
  const { showHUD, hideHUD } = useHUD();
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const container = document.querySelector('.home-scroll-container') || document.documentElement;
    if (!container) return;

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

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] h-[70px] flex items-center justify-between px-[clamp(1.5rem,5vw,4rem)] pointer-events-none transition-all duration-500 bg-transparent">
      {/* 1. LOGO WITH SHARED ELEMENT TRANSITION */}
      <div className="pointer-events-auto transition-colors duration-300">
        <AnimatePresence>
          {showLogo && (
            <Link 
              to="/" 
              onClick={hideHUD}
              onMouseEnter={() => showHUD("DROPE MAIN-FRAME")} 
              onMouseLeave={hideHUD}
              className="block"
            >
              <Logo 
                size="1.1rem" 
                layoutId="main-logo" 
                className={isLight ? 'text-black' : 'text-white'}
                accentColor="#FF2D00"
                isLight={isLight}
              />
            </Link>
          )}
        </AnimatePresence>
      </div>

      {/* 2. NAV LINKS & CTAS */}
      <div className="flex items-center gap-4 md:gap-8 pointer-events-auto">
        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-8 mr-4">
          <Link to="/features" onClick={hideHUD} onMouseEnter={() => showHUD("EXPLORE PROTOCOLS")} onMouseLeave={hideHUD}>
            <span className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[#FF2D00] ${isLight ? 'text-black' : 'text-white'}`}>
              Features
            </span>
          </Link>
          <Link to="/pricing" onClick={hideHUD} onMouseEnter={() => showHUD("ACCESS PLANS")} onMouseLeave={hideHUD}>
            <span className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[#FF2D00] ${isLight ? 'text-black' : 'text-white'}`}>
              Pricing
            </span>
          </Link>
          <Link to="/blog" onClick={hideHUD} onMouseEnter={() => showHUD("LATEST INTEL")} onMouseLeave={hideHUD}>
            <span className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[#FF2D00] ${isLight ? 'text-black' : 'text-white'}`}>
              Blog
            </span>
          </Link>
        </div>

        <Link to="/login" onClick={hideHUD} onMouseEnter={() => showHUD("WELCOME BACK")} onMouseLeave={hideHUD}>
          <RollingButton
            strikethrough={false}
            className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[#FF2D00] ${isLight ? 'text-black' : 'text-white'}`}
          >
            Login
          </RollingButton>
        </Link>

        <Link to="/signup" onClick={hideHUD} className="block">
          <FlipButton 
            width="80px" 
            height="30px" 
            isLight={isLight}
            hoverMarquee="// JOIN THE DROPE //"
            className="font-mono text-[10px] tracking-[0.2em]"
          >
            Join
          </FlipButton>
        </Link>
      </div>
    </nav>
  );
};

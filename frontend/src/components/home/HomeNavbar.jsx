import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomeNavbar = ({ scaleX }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Scroll Lock System ---
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="arc-grain-bg fixed top-0 left-0 right-0 z-[100]"
        style={{ position: 'fixed', background: 'var(--arc-blue)' }}>
        {/* Scroll progress line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] origin-left z-[110]"
          style={{ scaleX, background: 'rgba(255,255,255,0.5)' }}
        />
        <div className="w-full px-6 md:px-12 lg:px-16 py-3 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl font-black tracking-tight" style={{ fontFamily: 'Georgia, serif', color: 'var(--arc-cream)' }}>
              drope.in
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {['Features', 'Pricing', 'Blog'].map((item) => (
              <button key={item}
                onClick={() => navigate(`/${item.toLowerCase()}`)}
                className="nav-link-arc cursor-pointer border-none bg-transparent"
              >
                {item}
            </button>
            ))}
            <button onClick={() => navigate('/login')}
              className="text-[9px] font-black uppercase tracking-[0.25em] px-5 py-2 rounded-full border border-white/30 text-white/90 hover:bg-white/10 transition-all">
              Login
            </button>
          </div>
          <div className="flex items-center md:hidden">
            <button aria-label="Toggle Mobile Menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
        {/* Arc scalloped wave at bottom of nav */}
        <div style={{ position: 'absolute', bottom: -17, left: 0, width: '100%', zIndex: 6, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 36" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: 18 }}>
            <path d="M0,0 L0,18 C60,28 120,36 180,30 C240,24 300,8 360,4 C420,0 480,12 540,22 C600,32 660,36 720,30 C780,24 840,12 900,6 C960,0 1020,6 1080,16 C1140,26 1200,32 1260,30 C1320,28 1380,20 1440,16 L1440,0 Z"
              fill="var(--arc-blue)" />
          </svg>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '100vh' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[52px] left-0 right-0 z-[102] bg-[var(--arc-blue)]"
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '100vh' }}
              exit={{ height: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[52px] left-0 right-0 z-[103]"
              style={{ background: 'linear-gradient(180deg, var(--arc-blue) 0%, #00D166 100%)' }}
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'calc(100vh - 52px)' }}
              exit={{ height: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[52px] left-0 right-0 z-[105] overflow-hidden bg-[var(--arc-blue)] shadow-2xl"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              <div className="h-full px-10 py-16 flex flex-col justify-between items-start relative z-10">
                <div className="flex flex-col gap-4 mt-2 w-full">
                  {[
                    { label: 'Features', path: '/features' },
                    { label: 'Pricing', path: '/pricing' },
                    { label: 'Blog', path: '/blog' }
                  ].map((item, idx) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + idx * 0.08, duration: 0.4, ease: "easeOut" }}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className="group flex items-center justify-between w-full px-6 py-5 rounded-2xl border-none bg-transparent hover:bg-white/5 transition-all cursor-pointer text-left"
                    >
                      <span className="text-2xl md:text-3xl font-black uppercase tracking-[0.1em] text-white/70 group-hover:text-white transition-all">
                        {item.label}
                      </span>
                      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-[#00D166] group-hover:translate-x-3 transition-all duration-300" />
                    </motion.button>
                  ))}
                </div>
                <div className="w-full flex flex-col items-start gap-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    className="flex flex-row w-full gap-3"
                  >
                    <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                      className="flex-1 py-5 rounded-2xl border border-white/10 text-white/80 font-black uppercase tracking-widest hover:bg-white/5 transition-all text-[9px]">
                      Login
                    </button>
                    <button onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}
                      className="flex-1 py-5 rounded-2xl bg-white text-[#111111] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.03] active:scale-95 transition-all text-[9px]">
                      Join Now →
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomeNavbar;

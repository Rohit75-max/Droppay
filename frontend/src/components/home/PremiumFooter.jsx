import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Twitter, Instagram } from 'lucide-react';

const footerWords = ["in", "pay", "alert"];

const PremiumFooter = () => {
  const [footerWordIdx, setFooterWordIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFooterWordIdx((prev) => (prev + 1) % footerWords.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer id="footer" className="relative min-h-[100svh] flex flex-col justify-between pb-12 pt-[calc(var(--nav-height)+2rem)]" style={{ background: 'var(--arc-cream)' }}>
      {/* Scalloped Grid Banner centered in remaining space */}
      <div className="flex-1 w-full flex flex-col justify-center">
        <div className="max-w-[1200px] w-full mx-auto px-6 mb-16 mt-8">
          <div className="relative bg-[#FF4F21] rounded-[2.5rem] p-12 md:p-24 overflow-hidden border-4 border-slate-900 shadow-2xl shadow-[#FF4F21]/15 flex flex-col items-center justify-center text-center">
            {/* Scalloped top border inside frame */}
            <div className="absolute top-0 left-0 right-0 overflow-hidden line-height-0" style={{ transform: 'translateY(-1px)' }}>
              <svg viewBox="0 0 1200 24" fill="var(--arc-cream)" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,0 L1200,0 L1200,12 C1150,2 1100,22 1050,12 C1000,2 950,22 900,12 C850,2 800,22 750,12 C700,2 650,22 600,12 C550,2 500,22 450,12 C400,2 350,22 300,12 C250,2 200,22 150,12 C100,2 50,22 0,12 Z" />
              </svg>
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '48px 48px' }} />

            {/* Stickers / Props */}
            <div className="absolute top-12 left-6 md:left-16 transform -rotate-12 bg-[#22C55E] var(--arc-text-dark) px-3 py-1.5 font-bold border-2 border-slate-900 rounded-xl text-[10px] uppercase shadow-[4px_4px_0px_#000] z-10">
              onboard <br /> Yourself
            </div>

            <div className="absolute bottom-12 right-6 md:right-16 transform rotate-12 bg-[#111111] text-white px-4 py-2 font-bold border-2 border-slate-900 rounded-2xl text-xs uppercase shadow-[4px_4px_0px_#000] z-10 flex items-center gap-1">
              JUMP IN <Sparkles className="w-3.5 h-3.5 fill-white" />
            </div>

            {/* Main CTA: Newsletter Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); alert("Successfully subscribed to the newsletter!"); e.target.reset(); }}
              className="relative z-20 flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl mx-auto justify-center"
            >
              <input
                type="email"
                placeholder="Enter your email_"
                required
                className="w-full flex-1 bg-white var(--arc-text-dark) border-4 border-slate-900 px-6 py-4 rounded-3xl text-xl md:text-2xl font-bold placeholder:text-slate-400 focus:outline-none focus:translate-x-1 focus:translate-y-1 shadow-[8px_8px_0px_#000] focus:shadow-[4px_4px_0px_#000] transition-all"
              />
              <button
                type="submit"
                className="whitespace-nowrap bg-[#FFCA28] var(--arc-text-dark) border-4 border-slate-900 px-6 py-3 rounded-3xl text-2xl md:text-3xl font-black italic shadow-[8px_8px_0px_#000] active:translate-x-2 active:translate-y-2 active:shadow-[0px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all flex items-center gap-3">
                <span className="uppercase tracking-tighter">JOIN</span> <ChevronRight className="w-6 h-6 stroke-[3]" />
              </button>
            </form>

            {/* Scalloped bottom border inside frame */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden line-height-0" style={{ transform: 'rotate(180deg) translateY(-1px)' }}>
              <svg viewBox="0 0 1200 24" fill="var(--arc-cream)" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,0 L1200,0 L1200,12 C1150,2 1100,22 1050,12 C1000,2 950,22 900,12 C850,2 800,22 750,12 C700,2 650,22 600,12 C550,2 500,22 450,12 C400,2 350,22 300,12 C250,2 200,22 150,12 C100,2 50,22 0,12 Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Massive Infinite "LET'S TALK" Marquee */}
      <div className="w-full overflow-hidden flex relative z-10 py-4 md:py-8 mt-4 md:mt-8 pointer-events-none select-none border-b-4 border-slate-900/10 mb-8">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          className="flex whitespace-nowrap items-center w-fit"
        >
          {Array(8).fill("LET'S TALK").map((text, i) => (
            <div key={i} className="flex items-center">
              <span className="text-[70px] sm:text-[90px] md:text-[100px] lg:text-[120px] xl:text-[140px] font-black uppercase tracking-tighter text-[#131318] leading-[0.8]">
                {text}
              </span>
              <div className="w-[3vw] h-[3vw] max-w-[24px] max-h-[24px] bg-[#131318] rounded-full mx-8 md:mx-12" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom branding row */}
      <div className="w-full px-6 md:px-12 lg:px-16 flex flex-col md:flex-row justify-between items-center sm:items-end gap-6 text-center md:text-left z-20 relative">
        <div className="flex flex-col gap-1 items-center md:items-start h-[1.2em]">
          <div className="flex items-center">
            <span className="text-4xl md:text-6xl font-black tracking-tight var(--arc-text-dark)" style={{ fontFamily: 'Georgia, serif' }}>drope.</span>
            <div className="relative inline-flex items-center text-left min-w-[1.5em] md:min-w-[2em]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={footerWords[footerWordIdx]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-4xl md:text-6xl font-black tracking-tight var(--arc-text-dark)"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {footerWords[footerWordIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 max-w-sm">
          <p className="text-slate-600 font-bold text-xs md:text-sm leading-relaxed text-center md:text-right">
            From continuous streaming at Shake Shack to enterprise units. There’s something for everyone.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-all">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 text-center md:text-right">@ 2026 drope.in all rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default PremiumFooter;

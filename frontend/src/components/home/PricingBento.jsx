import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TIERS } from '../../constants/tiers';
import { ArrowRight, Shield, Zap, Globe, Cpu } from 'lucide-react';

export const SimplePricingBento = () => {
  const navigate = useNavigate();
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [billing, setBilling] = useState('monthly');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const comicFont = { fontFamily: '"Comic Sans MS", "Comic Sans", cursive' };

  const handleCardClick = (e, idx) => {
    e.stopPropagation();
    if (selectedIdx !== idx) {
      setSelectedIdx(idx);
    }
  };

  // 3:4:5 ratio constants
  const UNIT = 55;
  
  const boxConfigs = [
    { 
      tier: "Starter",
      width: 3 * UNIT,
      expandedWidth: 450,
      priceMonthly: 999,
      price6Month: 5095,
      priceYearly: 9590,
      top: 120,
      left: 0,
      fixedCorner: "TL",
      activeBg: "#1e1e1e",
      activeText: "text-black",
      fee: "15%",
      commission: "2.0%",
      benefits: ["Basic Analytics", "24/7 Support", "Secure Vault"],
      // Definition for blueprint lines [side, offsetProperty, baseValue, expandValue]
      extensions: [
        { side: 'top', type: 'h', prop: 'left', base: -20, grow: -80 },
        { side: 'top', type: 'h', prop: 'right', base: -20, grow: -20 },
        { side: 'left', type: 'v', prop: 'top', base: -40, grow: -80 },
        { side: 'left', type: 'v', prop: 'bottom', base: -20, grow: -20 },
        { side: 'bottom', type: 'h', prop: 'left', base: -40, grow: -100 }
      ]
    },
    { 
      tier: "Pro",
      width: 4 * UNIT,
      expandedWidth: 500,
      priceMonthly: 1999,
      price6Month: 10195,
      priceYearly: 19190,
      top: 20,
      left: 3 * UNIT,
      fixedCorner: "TL",
      activeBg: "#3139fb",
      activeText: "text-white",
      fee: "10%",
      commission: "2.0%",
      benefits: ["Everything in Starter +", "Advanced Insights", "Priority Support", "Custom Branding"],
      extensions: [
        { side: 'top', type: 'h', prop: 'right', base: -40, grow: -120 },
        { side: 'right', type: 'v', prop: 'top', base: -20, grow: -60 },
        { side: 'right', type: 'v', prop: 'bottom', base: -20, grow: -40 }
      ]
    },
    { 
      tier: "Legend",
      width: 5 * UNIT,
      expandedWidth: 550,
      priceMonthly: 2999,
      price6Month: 15295,
      priceYearly: 28790,
      top: 110,
      left: 7 * UNIT,
      fixedCorner: "TR",
      activeBg: "#fbbf24",
      activeText: "text-black",
      fee: "5%",
      commission: "2.0%",
      benefits: ["Everything in Pro +", "Dedicated Manager", "Full API Access", "Unlimited Scale"],
      extensions: [
        { side: 'right', type: 'v', prop: 'top', base: -20, grow: -100 },
        { side: 'right', type: 'v', prop: 'bottom', base: -60, grow: -150 },
        { side: 'bottom', type: 'h', prop: 'right', base: -60, grow: -120 },
        { side: 'bottom', type: 'h', prop: 'left', base: -20, grow: -40 }
      ]
    }
  ];

  const isDarkSection = true;
  const textColor = 'text-white';

  return (
    <motion.section 
      id="pricing"
      style={{ backgroundColor: '#0A0A0A' }}
      className="relative w-full h-full flex flex-col items-center overflow-hidden select-none transition-colors px-6 pt-[calc(var(--nav-height)+1rem)] pb-4 lg:min-h-screen lg:justify-center"
      onClick={() => setSelectedIdx(null)}
    >
      {/* Header Integrated for Full-Section Color Shift */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1280px] mx-auto text-center mb-8 relative z-20"
      >
        <h2 className={`text-[clamp(2.2rem,5vw,4.5rem)] font-black mb-2 transition-colors duration-500 tracking-tighter uppercase leading-[0.9] text-white`}>
          Choose your <br className="md:hidden" />
          <span className={`font-serif italic normal-case tracking-tight text-[#afff00]`}>Subscription.</span>
        </h2>

        {/* Minimalist Billing Toggle */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-4 md:gap-8">
           <button 
             onClick={(e) => { e.stopPropagation(); setBilling('monthly'); }}
             className={`text-[10px] font-black uppercase tracking-widest transition-all ${textColor} ${billing === 'monthly' ? 'underline underline-offset-8 text-[#afff00]' : 'opacity-60 hover:opacity-100'}`}
           >
             Monthly
           </button>
           
           <div className={`hidden md:block w-1 h-1 rounded-full bg-white/20`} />
           
           <button 
             onClick={(e) => { e.stopPropagation(); setBilling('6month'); }}
             className={`text-[10px] font-black uppercase tracking-widest transition-all ${textColor} ${billing === '6month' ? 'underline underline-offset-8 text-[#afff00]' : 'opacity-60 hover:opacity-100'}`}
           >
             6 Months
           </button>
           
           <div className={`hidden md:block w-1 h-1 rounded-full bg-white/20`} />
           
           <button 
             onClick={(e) => { e.stopPropagation(); setBilling('yearly'); }}
             className={`text-[10px] font-black uppercase tracking-widest transition-all ${textColor} ${billing === 'yearly' ? 'underline underline-offset-8 text-[#afff00]' : 'opacity-60 hover:opacity-100'}`}
           >
             Yearly
           </button>

           <AnimatePresence mode="wait">
             {billing !== 'monthly' && (
               <motion.span 
                 key={billing}
                 initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                 animate={{ opacity: 1, scale: 1, rotate: -3 }}
                 exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                 className="text-[9px] bg-[#afff00] text-black px-2 py-1 rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] font-black inline-block ml-2 pointer-events-none"
               >
                 SAVE {billing === '6month' ? '15%' : '20%'}
               </motion.span>
             )}
           </AnimatePresence>
        </div>
      </motion.div>

      {/* Backdrop (Invisible but clickable to deselect) */}
      <div className="absolute inset-0 z-0" />

      {/* --- BLUEPRINT BACKGROUND FX LAYER --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
        {/* 1. Dynamic Reactive Spotlight */}
        <motion.div 
          animate={{ 
            opacity: selectedIdx !== null ? 0.4 : 0.15,
            scale: selectedIdx !== null ? 1.5 : 1,
            background: selectedIdx === 1 
              ? 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' 
              : selectedIdx === 2
              ? 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)'
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] z-0 blur-[100px]"
        />

        {/* 2. Technical Blueprint Grid Pattern (Reactive) */}
        <motion.div 
          animate={{ 
            opacity: selectedIdx === 1 ? 0.08 : 0.04,
            backgroundImage: selectedIdx === 1
              ? `linear-gradient(#fff 1.5px, transparent 1.5px), linear-gradient(90deg, #fff 1.5px, transparent 1.5px)`
              : `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`
          }}
          className="absolute inset-0 z-0" 
          style={{ 
            backgroundSize: '40px 40px'
          }}
        />

        {/* 3. Parallax Floating Assets (Reactive) */}
        {[
          { Icon: Shield, top: '15%', left: '10%', rotate: 15, delay: 0, scale: 1.2 },
          { Icon: Zap, bottom: '20%', right: '5%', rotate: -15, delay: 1, scale: 0.8 },
          { Icon: Globe, top: '60%', left: '5%', rotate: 10, delay: 0.5, scale: 1.5 },
          { Icon: Cpu, top: '10%', right: '15%', rotate: -10, delay: 2, scale: 1 },
        ].map((asset, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: selectedIdx === 1 ? 0.12 : 0.08,
              y: [0, -40, 0],
              rotate: asset.rotate,
              color: selectedIdx === 1 ? '#ffffff' : '#000000'
            }}
            transition={{ 
              y: { duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: asset.delay },
              opacity: { duration: 1, delay: 1 }
            }}
            style={{ 
              position: 'absolute', 
              top: asset.top, 
              left: asset.left, 
              right: asset.right, 
              bottom: asset.bottom,
              transform: `scale(${asset.scale})`
            }}
            className="pointer-events-none"
          >
            <asset.Icon className="w-24 h-24 stroke-[0.5]" />
          </motion.div>
        ))}

        {/* Technical Diagonal Drafting Lines (Reactive) */}
        <motion.div 
          animate={{ opacity: selectedIdx === 1 ? 0.06 : 0.03 }}
          className="absolute inset-0 z-0"
        >
           <div className={`absolute top-0 left-1/4 w-px h-full ${selectedIdx === 1 ? 'bg-white' : 'bg-black'} -rotate-45 transform origin-top`} />
           <div className={`absolute top-0 right-1/4 w-px h-full ${selectedIdx === 1 ? 'bg-white' : 'bg-black'} rotate-45 transform origin-top`} />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`relative max-w-full mx-auto z-10 mt-2 outline-none ${
          isMobile 
            ? `w-[360px] ${selectedIdx !== null ? 'h-[420px]' : 'h-[340px]'} scale-[0.90] origin-top transition-all duration-300` 
            : 'w-[750px] h-[580px] scale-[0.65] sm:scale-[0.85] md:scale-[0.95] lg:scale-100 origin-top xl:origin-center md:mt-0'
        }`}
      >
        {TIERS.map((tier, idx) => {
          const config = boxConfigs[idx];
          const isSelected = selectedIdx === idx;
          
          let leftPos = config.left;
          let currentWidth = config.width;
          let currentTop = config.top;
          let unselectedHeight = config.width;

          // Mobile Overrides for responsive interlocking grid shape
          if (isMobile) {
            unselectedHeight = 140;
            if (idx === 0) { // Starter (Left)
              currentWidth = 150; leftPos = 10; currentTop = 80;
            } else if (idx === 1) { // Pro (Top Right)
              currentWidth = 150; leftPos = 170; currentTop = 0;
            } else if (idx === 2) { // Legend (Bottom Right)
              currentWidth = 150; leftPos = 170; currentTop = 150;
            }

            if (isSelected) {
              currentWidth = 320;
              leftPos = 20; 
              currentTop = -10; 
            }
          } else {
             // Desktop Expansion Logic
             if (isSelected) {
               currentWidth = config.expandedWidth;
               if (config.fixedCorner === "TR") {
                   leftPos = config.left - (config.expandedWidth - config.width);
               }
             }
          }

          return (
            <motion.div 
              key={tier.tier}
              layout
              animate={{ 
                width: currentWidth,
                left: leftPos,
                top: currentTop,
                zIndex: isSelected ? 50 : 10,
                height: isSelected ? (isMobile ? 420 : 380) : unselectedHeight,
                backgroundColor: isSelected ? config.activeBg : '#111111',
                borderColor: isSelected ? (config.tier === 'Pro' ? '#fff' : '#000') : '#222'
              }}
              transition={{ type: "spring", stiffness: 300, damping: isMobile ? 25 : 30 }}
              onClick={(e) => handleCardClick(e, idx)}
              style={{ position: 'absolute' }}
              className={`p-6 md:p-10 flex flex-col justify-between cursor-pointer border-2 shadow-sm
                         ${isSelected ? 'ring-1 ring-black/10' : ''}
                         overflow-hidden group`}
            >
              {/* Animated Blueprint Lines */}
              <div className="absolute inset-0 pointer-events-none">
                {config.extensions.map((line, lIdx) => (
                  <motion.div
                    key={lIdx}
                    animate={{ 
                      [line.prop]: isSelected ? line.grow : line.base,
                      backgroundColor: (isSelected && config.tier === 'Pro') ? 'rgba(255,255,255,0.4)' : 'rgba(175,255,0,0.2)'
                    }}
                    className={`absolute ${line.side}-0 ${line.type === 'h' ? 'h-px' : 'w-px'}`}
                    style={{
                      // For 'h' line on 'top', we need to anchor it correctly
                      [line.side]: 0
                    }}
                  />
                ))}
              </div>

              {/* Expanded Content: Commission & Benefits */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 flex flex-col pt-2 relative z-10"
                  >
                    {/* Blueprint Commission "Stamp" */}
                    <div className="flex flex-col gap-1 mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 border-2 font-black text-[10px] uppercase tracking-tighter shadow-[2px_2px_0px_#000] rotate-[-2deg]
                                        ${config.tier === 'Pro' ? 'border-white text-white' : 'border-black text-black'}`}>
                          Fee
                        </div>
                        <span className={`text-4xl font-bold italic tracking-tighter ${config.tier === 'Pro' ? 'text-white' : 'text-black'}`} style={comicFont}>
                          {config.fee}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-60 ml-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${config.tier === 'Pro' ? 'text-white' : 'text-black'}`} style={comicFont}>
                          + {config.commission} Transaction Fee
                        </span>
                      </div>
                    </div>

                    {/* Architectural Feature List */}
                    <div className="space-y-2">
                       {config.benefits.map((benefit, bIdx) => (
                         <div key={bIdx} className="flex items-center gap-2 group">
                           <div className={`w-1 h-1 rounded-full ${config.tier === 'Pro' ? 'bg-white/40' : 'bg-black/20'}`} />
                           <span className={`text-[11px] font-bold uppercase tracking-widest ${config.tier === 'Pro' ? 'text-white/70' : 'text-black/60'} group-hover:translate-x-1 transition-transform`} style={comicFont}>
                             {benefit}
                           </span>
                         </div>
                       ))}
                    </div>
                    
                    <div className={`mt-6 italic text-[9px] font-bold uppercase tracking-widest ${config.tier === 'Pro' ? 'text-white/40' : 'text-black/30'}`} style={comicFont}>
                      * 7-Day Free Trial included.
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              {!isSelected && (
                <div className="flex-1 flex flex-col pt-0 mt-[-15px]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`px-2 py-1 border-2 border-black font-black text-[9px] uppercase tracking-tighter shadow-[2px_2px_0px_#000] rotate-[-4deg] bg-white transition-opacity group-hover:opacity-100 opacity-60`}>
                      Trial
                    </div>
                    <span className="text-xl font-black italic tracking-tighter opacity-80 uppercase whitespace-nowrap" style={comicFont}>
                      7-Day
                    </span>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.1em] opacity-40 leading-relaxed max-w-[170px] mb-auto text-white" style={comicFont}>
                    {tier.tagline}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-end pointer-events-none">
                <div className="flex flex-col">
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${isSelected && config.tier === 'Pro' ? 'text-white/40' : 'text-black/30'}`} 
                        style={comicFont}
                      >
                        {tier.tagline}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  <motion.h3 layout className={`${isSelected ? 'text-6xl' : 'text-xl'} font-bold tracking-tighter ${isSelected ? config.activeText : 'text-black'} leading-none mb-2`} style={comicFont}>
                    {tier.tier}.
                  </motion.h3>
                  
                   <div className="flex items-baseline gap-2">
                    <span 
                      className={`${isSelected ? 'text-4xl md:text-5xl' : 'text-xl'} font-bold tracking-tight ${isSelected ? config.activeText : 'text-white'} italic transition-all`} 
                      style={comicFont}
                    >
                      ₹{isSelected 
                        ? (billing === 'monthly' ? config.priceMonthly : billing === '6month' ? config.price6Month : config.priceYearly) 
                        : config.priceMonthly}
                    </span>
                    <span 
                      className={`text-[10px] font-black uppercase tracking-widest ${isSelected && config.tier === 'Pro' ? 'text-white/40' : 'text-white/30'}`} 
                      style={comicFont}
                    >
                      {isSelected && billing !== 'monthly' ? 'total' : '/mo'}
                    </span>
                  </div>
                </div>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/pricing');
                        }}
                        className={`w-20 h-20 rounded-full flex items-center justify-center p-4 shadow-xl pointer-events-auto cursor-pointer hover:scale-110 active:scale-95 transition-all ${config.tier === 'Pro' ? 'bg-white text-[#3139fb]' : 'bg-black text-white'}`}
                      >
                        <ArrowRight className="w-10 h-10" />
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.section>
  );
};

export default SimplePricingBento;

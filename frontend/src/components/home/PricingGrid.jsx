import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TIERS } from '../constants/tiers';

export const PricingGrid = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState('yearly');
  const [selectedIdx, setSelectedIdx] = useState(1);
  const [direction, setDirection] = useState(0);
  const comicFont = { fontFamily: '"Comic Sans MS", "Comic Sans", cursive' };

  // Sync with bento prices
  const getCalculatedPrice = (tier) => {
    const base = tier.price; // 999, 1999, 2999
    if (billing === 'monthly') return base;
    if (billing === '6month') return Math.round(base * 6 * 0.85);
    return Math.round(base * 12 * 0.80);
  };

  const handleSelect = (idx) => {
    setDirection(idx > selectedIdx ? 1 : -1);
    setSelectedIdx(idx);
  };

  const activeTier = TIERS[selectedIdx];

  return (
    <div className="w-full px-6 md:px-20 lg:px-40">
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-16 relative z-30">
           <button 
             onClick={() => setBilling('monthly')}
             className={`text-[10px] font-black uppercase tracking-widest transition-all ${billing === 'monthly' ? 'underline underline-offset-8 text-black' : 'opacity-30 hover:opacity-100 text-black'}`}
           >
             Monthly
           </button>
           
           <div className="hidden md:block w-1 h-1 rounded-full bg-black/20" />
           
           <button 
             onClick={() => setBilling('6month')}
             className={`text-[10px] font-black uppercase tracking-widest transition-all ${billing === '6month' ? 'underline underline-offset-8 text-black' : 'opacity-30 hover:opacity-100 text-black'}`}
           >
             6 Months
           </button>

           <div className="hidden md:block w-1 h-1 rounded-full bg-black/20" />
           
           <button 
             onClick={() => setBilling('yearly')}
             className={`text-[10px] font-black uppercase tracking-widest transition-all ${billing === 'yearly' ? 'underline underline-offset-8 text-black' : 'opacity-30 hover:opacity-100 text-black'}`}
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

      <div className="max-w-[1000px] mx-auto bg-white/40 backdrop-blur-md rounded-[3.5rem] border border-black/5 overflow-hidden shadow-2xl shadow-black/5">
        {/* Canva-style Sleek Switcher */}
        <div className="bg-white border-b border-black/5 p-4 flex justify-center">
          <div className="bg-black/5 p-1 rounded-full flex items-center relative">
            {TIERS.map((t, i) => (
              <button
                key={t.tier}
                onClick={() => handleSelect(i)}
                className={`relative px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 z-10 ${
                  selectedIdx === i ? 'text-white' : 'text-black/40 hover:text-black'
                }`}
              >
                {t.tier}
                {selectedIdx === i && (
                  <motion.div
                    layoutId="active-pill-bg"
                    className="absolute inset-0 bg-[#111111] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sliding Details Area */}
        <div className={`relative min-h-[460px] p-10 md:p-14 overflow-hidden transition-colors duration-500 ${selectedIdx === 1 ? 'bg-[#3139fb] text-white' : selectedIdx === 2 ? 'bg-[#fbbf24] text-black' : 'bg-[#e5e5e5] text-black'}`}>
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
          
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={selectedIdx}
              custom={direction}
              initial={(d) => ({ opacity: 0, x: d * 50 })}
              animate={{ opacity: 1, x: 0 }}
              exit={(d) => ({ opacity: 0, x: d * -50 })}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-10 flex flex-col h-full"
            >
              <div className="flex flex-col mb-6">
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${selectedIdx === 1 ? 'text-white/40' : 'text-black/40'}`}>Subscription System</span>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 ${selectedIdx === 1 ? 'text-emerald-400' : 'text-black'}`} style={comicFont}>{activeTier.tagline}</span>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-xl font-bold ${selectedIdx === 1 ? 'opacity-30' : 'opacity-20'}`} style={comicFont}>₹</span>
                      <h4 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-none" style={{ ...comicFont, fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}>
                        {getCalculatedPrice(activeTier).toLocaleString('en-IN')}
                      </h4>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${selectedIdx === 1 ? 'opacity-40' : selectedIdx === 2 ? 'opacity-30' : 'opacity-40'}`} style={comicFont}>{billing === 'monthly' ? '/month' : 'total'}</span>
                    </div>
                    {billing !== 'monthly' && <p className={`text-[10px] font-bold mt-2 italic ${selectedIdx === 1 ? 'text-white/30' : selectedIdx === 2 ? 'text-black/30' : 'text-black/50'}`} style={comicFont}>Billed {billing === '6month' ? 'semi-annually' : 'annually'} (Save {billing === '6month' ? '15%' : '20%'})</p>}
                  </div>
                  
                  <div className="flex flex-col gap-1 items-start md:items-end">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${selectedIdx === 1 ? 'text-white/40' : selectedIdx === 2 ? 'text-black/40' : 'text-black/60'}`}>Platform Fee</span>
                    <div className="flex items-center gap-2">
                       <span className={`text-2xl md:text-4xl font-black ${selectedIdx === 1 ? 'text-emerald-400' : 'text-black'}`} style={comicFont}>{activeTier.fee}</span>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${selectedIdx === 1 ? 'text-white/30' : selectedIdx === 2 ? 'text-black/30' : 'text-black/50'}`} style={comicFont}>+ 2.0% Trans. Fee</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-12 mb-8">
                  {activeTier.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <div className={`w-1 h-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-transform group-hover:scale-150 ${selectedIdx === 1 ? 'bg-emerald-500' : 'bg-black'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${selectedIdx === 1 ? 'text-white/70 group-hover:text-white' : 'text-black/70 group-hover:text-black'}`}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`mt-auto flex flex-col md:flex-row items-center justify-between gap-8 pt-6 border-t ${selectedIdx === 1 ? 'border-white/5' : 'border-black/5'}`}>
                <p className={`text-[10px] font-bold max-w-sm italic ${selectedIdx === 1 ? 'text-white/30' : 'text-black/30'}`}>
                  *Full Access. 7-Day Free Trial on all features. Cancel anytime.
                </p>
                <button 
                  onClick={() => navigate('/login')}
                  className={`w-full md:w-auto px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group ${selectedIdx === 1 ? 'bg-white text-[#111111] shadow-[0_20px_60px_rgba(255,255,255,0.1)]' : 'bg-[#111111] text-white shadow-[0_20px_60px_rgba(0,0,0,0.1)]'}`}
                >
                  Get Started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

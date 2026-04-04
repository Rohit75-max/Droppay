import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Crown, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TIERS_DATA = [
  {
    id: 'starter',
    name: 'Starter',
    price: 5,
    fee: 0.15,
    tagline: 'Rising Stars',
    icon: Zap,
    color: 'rgba(255, 255, 255, 0.4)',
    accent: '#888'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 10,
    fee: 0.10,
    tagline: 'The Sweet Spot',
    icon: Shield,
    color: '#afff00',
    accent: '#afff00',
    recommended: true
  },
  {
    id: 'legend',
    name: 'Legend',
    price: 15,
    fee: 0.05,
    tagline: 'Zero Compromise',
    icon: Crown,
    color: '#fbbf24',
    accent: '#fbbf24'
  }
];

const GlassCard = ({ tier, revenue, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const takeHome = revenue * (1 - tier.fee);
  const totalFees = revenue * tier.fee;

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ 
        scale: isActive ? 1.05 : 1,
        borderColor: isHovered || isActive ? tier.accent : 'rgba(255, 255, 255, 0.1)',
        y: isHovered ? -10 : 0
      }}
      className={`relative p-6 rounded-[2rem] border-2 backdrop-blur-3xl bg-white/[0.03] flex flex-col justify-between min-h-[380px] transition-all duration-500 overflow-hidden ${isActive ? 'z-20 border-[#afff00]' : 'z-10'}`}
    >
      {/* Border Trace Animation on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
             <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <motion.rect
                 x="0" y="0" width="100" height="100"
                 rx="10" ry="10"
                 fill="none"
                 stroke={tier.accent}
                 strokeWidth="2"
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 0.8, ease: "easeInOut" }}
               />
             </svg>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isActive ? 'bg-black text-[#afff00] border-[#afff00]' : 'bg-white/5 border-white/10 text-white/40'}`}>
            <tier.icon className="w-6 h-6" />
          </div>
          {tier.recommended && (
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#afff00] text-black px-3 py-1 rounded-full shadow-[0_0_20px_rgba(175,255,0,0.3)]">Recommended</span>
          )}
        </div>

        <h3 className="text-3xl font-black tracking-tighter uppercase text-white mb-0.5 leading-none">{tier.name}.</h3>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">{tier.tagline}</p>

        <div className="space-y-6">
          <div>
            <span className="block text-[10px] font-black uppercase tracking-widest text-[#afff00] mb-2">Total Take-Home Pay</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black italic tracking-tighter text-white">
                ₹{Math.floor(takeHome).toLocaleString('en-IN')}
              </span>
              <span className="text-white/20 text-[10px] font-bold">/mo</span>
            </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Drope Fee</span>
              <span className="text-lg font-bold text-white tracking-widest italic">{(tier.fee * 100).toFixed(0)}%</span>
            </div>
            <div>
              <span className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Fee Total</span>
              <span className="text-lg font-bold text-white/60 tracking-widest italic">₹{Math.floor(totalFees).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/signup')}
        className={`relative z-10 w-full mt-6 py-3.5 rounded-xl font-black uppercase italic text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${isActive ? 'bg-[#afff00] text-black shadow-[0_20px_40px_rgba(175,255,0,0.15)]' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'}`}
      >
        [ Start Your 7-Day Unlock ] <ArrowRight className="w-4 h-4" />
      </button>

      {/* Holographic Grain Layer */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </motion.div>
  );
};

export const RevenueMatrix = () => {
  const [revenue, setRevenue] = useState(50000);
  
  // Decide active tier based on revenue (INR thresholds)
  // Pro recommended for mid levels, Legend for high volume (e.g. > 1.5 Lakhs)
  const activeTierIndex = revenue < 30000 ? 0 : (revenue < 150000 ? 1 : 2);

  return (
    <section data-navbar-theme="dark" className="min-h-screen bg-[#0A0A0A] relative flex flex-col items-center justify-center py-16 md:py-20 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#afff0005,transparent_70%)] z-0" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-white text-[8vw] md:text-[4vw] font-black tracking-tighter uppercase leading-[0.8] mb-4">
            Transparent <br /> <span className="text-[#afff00]">Revenue Matrix.</span>
          </h2>
          <div className="flex flex-col items-center gap-4">
             <p className="text-white/40 text-[10px] md:text-sm font-black uppercase tracking-[0.4em] max-w-xl mx-auto">Calculate your take-home pay instantly.</p>
             <div className="w-24 h-[2px] bg-[#afff00]/30" />
          </div>
        </div>

        {/* ELASTIC REVENUE SLIDER */}
        <div className="max-w-3xl mx-auto mb-12 w-full group">
          <div className="flex justify-between items-end mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#afff00]/60 italic transition-all group-hover:text-[#afff00]">Monthly Tips Estimate (INR)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black italic tracking-tighter text-white">₹{revenue.toLocaleString('en-IN')}</span>
              <span className="text-white/10 text-xl font-black uppercase tracking-widest">INR</span>
            </div>
          </div>
          
          <div className="relative h-20 flex items-center justify-center">
            <input 
              type="range"
              min="1000"
              max="1000000"
              step="1000"
              value={revenue}
              onChange={(e) => setRevenue(parseInt(e.target.value))}
              className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer border border-white/10 shadow-inner group-hover:bg-[#afff00]/10 transition-colors"
            />
            {/* Custom Thumb Style Helper (pure CSS in index.css would be better but we can use slider-thumb-selector logic) */}
            <style>{`
              input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                height: 32px;
                width: 32px;
                border-radius: 50%;
                background: #afff00;
                cursor: pointer;
                box-shadow: 0 0 20px rgba(175, 255, 0, 0.4);
                border: 2px solid white;
              }
              input[type=range]::-moz-range-thumb {
                height: 32px;
                width: 32px;
                border-radius: 50%;
                background: #afff00;
                cursor: pointer;
                box-shadow: 0 0 20px rgba(175, 255, 0, 0.4);
                border: 2px solid white;
              }
            `}</style>
          </div>
        </div>

        {/* GLASS MATRIX TIER WRAPPER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
           {TIERS_DATA.map((tier, idx) => (
             <GlassCard 
               key={tier.id} 
               tier={tier} 
               revenue={revenue} 
               isActive={idx === activeTierIndex}
             />
           ))}
        </div>

        {/* GROWTH PROTOCOL BANNER */}
        <div className="mt-20 flex flex-col items-center">
           <motion.div 
             whileHover={{ scale: 1.02 }}
             className="w-full max-w-4xl p-1 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-[2rem]"
           >
             <div className="bg-black/80 backdrop-blur-3xl p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#afff00]/10 border border-[#afff00]/20 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-[#afff00]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none mb-1">Growth Strategy Activated.</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Scale your revenue and unlock lower platform fees automatically.</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#afff00] mb-1">Upcoming Milestone</span>
                    <span className="text-xl font-bold text-white tracking-widest italic">3.5% Custom Fee</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-40">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
             </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
};

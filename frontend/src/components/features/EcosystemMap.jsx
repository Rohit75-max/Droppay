import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Zap, Shield, Globe, Landmark } from 'lucide-react';

const Node = ({ icon: Icon, title, copy, position, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, type: 'spring', stiffness: 100 }}
    className={`absolute ${position} group flex flex-col items-center md:items-start text-center md:text-left max-w-[180px] md:max-w-[240px] z-20`}
  >
    <div className="w-10 h-10 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-3 group-hover:border-[#afff00]/50 group-hover:bg-[#afff00]/5 shadow-xl transition-all duration-500">
      <Icon className="w-5 h-5 md:w-7 md:h-7 text-white group-hover:text-[#afff00] transition-colors" />
    </div>
    <h4 className="text-[#afff00] font-black text-xs md:text-sm uppercase tracking-widest mb-1 md:mb-2">{title}</h4>
    <p className="text-white/40 text-[10px] md:text-xs leading-relaxed font-medium">{copy}</p>
  </motion.div>
);

const ConnectionLine = ({ d, delay = 0 }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" fill="none">
    <motion.path
      d={d}
      stroke="url(#lineGradient)"
      strokeWidth="2"
      strokeDasharray="10 10"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 0.2 }}
      viewport={{ once: true }}
      transition={{ duration: 2, delay, ease: "easeInOut" }}
    />
    <motion.circle
      r="3"
      fill="#afff00"
      initial={{ offset: 0 }}
      animate={{ 
        offset: [0, 1] 
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        ease: "linear",
        delay 
      }}
    >
      <animateMotion
        path={d}
        begin="0s"
        dur="3s"
        repeatCount="indefinite"
      />
    </motion.circle>
    <defs>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#afff00" stopOpacity="0" />
        <stop offset="50%" stopColor="#afff00" stopOpacity="1" />
        <stop offset="100%" stopColor="#afff00" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export const EcosystemMap = () => {
  return (
    <section 
      data-navbar-theme="dark" 
      className="home-section-panel relative bg-[#0A0A0A] overflow-hidden flex flex-col items-center justify-center px-6 py-20 md:py-0"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(175,255,0,0.05),transparent_70%)]" />

      <div className="relative z-30 text-center mb-12 md:mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-7xl font-black tracking-tighter uppercase text-white mb-2 md:mb-4"
        >
          PLUG INTO <span className="text-[#afff00]">EVERYTHING.</span>
        </motion.h2>
      </div>

      {/* The Ecosystem Map Container */}
      <div className="relative w-full max-w-5xl aspect-square md:aspect-[16/9] flex items-center justify-center">
        
        {/* CENTERPIECE */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', damping: 12 }}
          className="relative z-30 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-black border-2 border-[#afff00]/30 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_80px_rgba(175,255,0,0.15)] group"
        >
          <div className="absolute inset-2 border border-[#afff00]/10 rounded-[2rem] animate-pulse" />
          <Share2 className="w-10 h-10 md:w-16 md:h-16 text-[#afff00] group-hover:scale-110 transition-transform duration-500" />
          
          {/* Label under center */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#afff00] opacity-50">Drope Node</span>
          </div>
        </motion.div>

        {/* NODES & CONNECTIONS */}
        
        {/* Top Left: The Universal Bridge */}
        <Node 
          icon={Globe}
          title="The Universal Bridge"
          copy="Native hooks for OBS, Streamlabs, Twitch, and YouTube. Paste your Drope URL and you're live."
          position="top-4 left-4 md:top-10 md:left-10"
          delay={0.2}
        />
        <ConnectionLine d="M 120,120 Q 250,150 440,240" delay={0.1} />

        {/* Top Right: Micro-Latency */}
        <Node 
          icon={Zap}
          title="Micro-Latency"
          copy="From the viewer’s wallet to your on-screen alert in under 100 milliseconds."
          position="top-4 right-4 md:top-10 md:right-10"
          delay={0.4}
        />
        <ConnectionLine d="M 880,120 Q 750,150 560,240" delay={0.3} />

        {/* Bottom Left: Chargeback Shield */}
        <Node 
          icon={Shield}
          title="Chargeback Shield"
          copy="Bank-grade security protecting you from fraudulent tips and malicious chargebacks."
          position="bottom-4 left-4 md:bottom-10 md:left-10"
          delay={0.6}
        />
        <ConnectionLine d="M 120,400 Q 250,370 440,280" delay={0.5} />

        {/* Bottom Right: Zero Dropped Hype */}
        <Node 
          icon={Landmark}
          title="Zero Dropped Hype"
          copy="Redundant global servers ensure your alerts trigger flawlessly. Screen lights up every time."
          position="bottom-4 right-4 md:bottom-10 md:right-10"
          delay={0.8}
        />
        <ConnectionLine d="M 880,400 Q 750,370 560,280" delay={0.7} />

        {/* Interactive Overlay for Viewers (Mobile fallback) */}
        <div className="absolute inset-0 pointer-events-none md:hidden flex flex-col justify-between p-4">
           {/* Space holder for floating nodes on mobile */}
        </div>

      </div>


    </section>
  );
};

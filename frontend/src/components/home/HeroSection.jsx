import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [isSynced, setIsSynced] = useState(false);

  // Heartbeat Monitor
  useEffect(() => {
    const syncTimer = setInterval(() => setIsSynced(prev => !prev), 3500);
    return () => clearInterval(syncTimer);
  }, []);

  return (
    <section id="hero" className="relative h-full w-full flex flex-col justify-center pt-[calc(var(--nav-height)+2rem)] px-6 overflow-hidden" style={{ background: 'var(--arc-cream)' }}>
      <div className="max-w-[1400px] w-full mx-auto flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[clamp(0.6rem,1.5vw,0.75rem)] font-black uppercase tracking-widest mb-10 border"
          style={{ background: 'rgba(17,17,17,0.06)', color: '#111111', borderColor: 'rgba(17,17,17,0.12)' }}
        >
          <Globe className={`w-3.5 h-3.5 ${isSynced ? 'animate-pulse' : ''}`} /> 100% Creator Dedicated
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="arc-hero-text text-[clamp(3.5rem,8vw,7rem)] font-bold mb-6 leading-[1.0] tracking-tight"
        >
          <span className="glitch-text" data-text="Supercharge">Supercharge</span> <br />
          <span style={{ color: '#111111' }}>Your </span>
          <span className="hollow-stream-text" data-text="STREAM.">STREAM.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="text-[#4a4a68] text-[clamp(1.1rem,2.5vw,1.4rem)] font-medium max-w-2xl mb-12 leading-relaxed"
        >
          A high-growth monetization buffer with instant settlements and uncompromised scalability.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <button onClick={() => navigate('/signup')} className="arc-pill-btn arc-pill-btn-primary">
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="arc-pill-btn border border-[#111111]/20 text-[#111111] hover:bg-[#111111]/5">
            Learn More
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

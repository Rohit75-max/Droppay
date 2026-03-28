import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Globe, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturesSection = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  const featureStyles = [
    {
      title: "Cinematic Alerts",
      desc: "Studio-grade 3D assets that react to your stream in real-time.",
      icon: Sparkles,
      bg: "#e0f2fe", // Soft Blue
      accent: "#0ea5e9"
    },
    {
      title: "Direct Payouts",
      desc: "No more waiting. High-frequency revenue settlement for every drop.",
      icon: ArrowRight,
      bg: "#dcfce7", // Soft Green
      accent: "#22c55e"
    },
    {
      title: "Global Mesh",
      desc: "Edge-computed overlays for sub-10ms latency world-wide.",
      icon: Globe,
      bg: "#ffedd5", // Soft Orange
      accent: "#f97316"
    },
    {
      title: "Core Intelligence",
      desc: "Deep-learning analysis of your audience engagement in real-time.",
      icon: Shield,
      bg: "#fef9c3", // Soft Gold
      accent: "#eab308"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % featureStyles.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featureStyles.length]);

  return (
    <motion.section
      id="features"
      animate={{ backgroundColor: featureStyles[activeFeature].bg }}
      transition={{ duration: 0.8 }}
      className="relative min-h-[100svh] w-full flex flex-col py-10 px-6 overflow-hidden transition-colors arc-grain-bg"
    >
      <motion.div
        className="max-w-[1280px] mx-auto w-full flex-1 flex flex-col"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex-1 flex flex-col items-center justify-between text-center pt-[calc(var(--nav-height)+1rem)] pb-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl flex flex-col items-center"
          >
            <h2 className="arc-hero-text text-3xl md:text-5xl font-black mb-2 leading-[1.1] tracking-tighter" style={{ color: 'var(--arc-text-dark)' }}>
              Built for <br className="hidden md:block" />
              <span style={{ color: '#111111' }}>New Era.</span>
            </h2>
            <p className="text-[#4a4a68] text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mt-2">
              Core Infrastructure & Intelligence
            </p>
          </motion.div>

          {/* 
            --- YOUR CUSTOM MIDDLE SPACE ---
            Absorbing all room.
          */}
          <div className="flex-1 w-full min-h-[300px] flex items-center justify-center relative mt-6 mb-8 text-black/10 text-sm font-bold border-2 border-dashed border-black/5 rounded-3xl">
            [ Central Canvas Area for Graphic Content ]
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => navigate('/features')}
            className="group flex items-center gap-3 px-10 py-5 bg-[#111111] text-white rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs hover:scale-105 transition-all shadow-2xl shadow-black/20"
          >
            Explore Full Suite <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>


      </motion.div>
    </motion.section>
  );
};

export default FeaturesSection;

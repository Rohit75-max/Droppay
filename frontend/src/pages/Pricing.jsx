import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown, ArrowRight,
} from 'lucide-react';

import { SimplePricingBento } from '../components/SimplePricingBento';
import { PlanComparisonBento } from '../components/PlanComparisonBento';

const footerWords = ["in", "pay", "alert"];

const Pricing = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [hideLogo, setHideLogo] = useState(false);
  const [footerWordIdx, setFooterWordIdx] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setInterval(() => {
      setFooterWordIdx((prev) => (prev + 1) % footerWords.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      // High-precision trigger matching the blog page
      if (scrollY + windowHeight > fullHeight - 500) {
        setHideLogo(true);
      } else {
        setHideLogo(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqs = [
    { q: "What is the 5 referral rule?", a: "Once you achieve 5 successful network referrals, your platform fees permanently drop (e.g., Legend Tier moves from 5% to just 3% commission)." },
    { q: "Can I upgrade anytime?", a: "Yes. Upgrades happen in real-time. If you move from Starter to Legend, your previous credits are applied to the new tier credits immediately." },
    { q: "What is the Live Engine?", a: "Our Live Engine units render your overlays and process alerts with zero latency. Higher tiers get priority routing on our global edge network." }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-x-hidden selection:bg-emerald-500/30 font-sans"
      style={{ background: '#f5f4e2', color: '#111111' }}
    >
      {/* Navbar Overlay */}
      <nav className="fixed top-0 left-0 right-0 h-24 flex items-center justify-between px-6 md:px-12 z-50">
        <button onClick={() => navigate('/')} className="group flex items-center gap-3 font-black uppercase tracking-widest text-[10px] text-black">
          <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all backdrop-blur-md">
            <ArrowLeft className="w-3 h-3" />
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">Return</span>
        </button>
        
        <motion.div 
          animate={{ 
            opacity: hideLogo ? 0 : 1, 
            y: hideLogo ? -10 : 0,
            pointerEvents: hideLogo ? 'none' : 'auto'
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="text-4xl font-black tracking-tighter cursor-pointer text-black" 
          style={{ fontFamily: 'Georgia, serif' }}
          onClick={() => navigate('/')}
        >
          drope.
        </motion.div>

        <div className="flex items-center gap-8">
           <button onClick={() => navigate('/signup')} className="px-6 py-2 border-2 border-black/20 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all">Join</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-6 text-center">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full border border-black/10 text-[9px] font-black uppercase tracking-[0.4em] mb-10 opacity-60">Choose your Plan</div>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.9]" style={{ fontFamily: 'Georgia, serif' }}>Simple <br /><span className="italic">Pricing.</span></h1>
          <p className="max-w-xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-16">Flexible plans for creators of all sizes. Professional features, no hidden platform fees.</p>
        </motion.div>
      </section>

      {/* Integrated Pricing Bento */}
      <SimplePricingBento />

      {/* Feature Matrix (Bento Redesign) */}
      <section className="py-24 px-6 bg-white border-y border-black/5">
        <div className="max-w-[1200px] mx-auto mb-16 text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>Plan Comparison.</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Deep architecture differences</p>
        </div>
        <PlanComparisonBento />
        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-16 max-w-lg mx-auto leading-relaxed italic">
          *Taxes and extra referral rewards are calculated at checkout based on your region and history.
        </p>
      </section>

      {/* FAQ Area */}
      <section className="py-32 px-6">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>F.A.Q.</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-black/5 pb-6">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-sm font-black uppercase tracking-tight">{faq.q}</span>
                  <div className={`p-2 rounded-full border border-black/5 group-hover:bg-black group-hover:text-white transition-all ${openFaq === i ? 'rotate-180 bg-black text-white' : ''}`}>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-slate-500 text-sm leading-relaxed max-w-lg">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Bottom Section: CTA + Footer */}
      <div className="min-h-screen flex flex-col bg-white overflow-hidden">
        {/* Final CTA */}
        <section className="flex-grow flex flex-col justify-center px-6 text-center bg-[#111111] text-white relative py-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9]" style={{ fontFamily: 'Georgia, serif' }}>
              Choose Your <br />
              <span className="italic">Destination.</span>
            </h2>
            <button 
              onClick={() => navigate('/signup')}
              className="group flex items-center gap-4 px-12 py-6 bg-white text-[#111111] rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] mx-auto border-none"
            >
              Create My Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </section>

        {/* Footer Branding Area */}
        <footer className="py-16 px-6 text-center border-t border-black/5">
          <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-8">
            <div className="h-[1.2em] flex items-center justify-center">
            <span className="text-4xl md:text-6xl font-black tracking-tight cursor-default text-black" style={{ fontFamily: 'Georgia, serif' }}>drope.</span>
            <div className="relative inline-flex items-center text-left min-w-[1.5em] md:min-w-[2em]">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={footerWords[footerWordIdx]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-4xl md:text-6xl font-black tracking-tight cursor-default text-black" 
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {footerWords[footerWordIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">@ 2026 drope.in all rights reserved</p>
            <div className="flex gap-10">
              {['Billing Policy', 'Privacy Policy', 'Service SLA'].map(s => (
                <span key={s} className="text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer hover:text-emerald-500 transition-colors">{s}</span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default Pricing;

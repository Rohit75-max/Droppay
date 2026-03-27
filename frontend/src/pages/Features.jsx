import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Sparkles, ArrowRight, 
  Globe, Shield, Zap, 
  Terminal, Activity
} from 'lucide-react';

const FeatureAct = ({ title, subtitle, desc, icon: Icon, reversed = false, children }) => (
  <section className="py-32 px-6 border-b border-black/5 overflow-hidden">
    <div className={`max-w-[1280px] mx-auto flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 md:gap-24`}>
      <motion.div 
        initial={{ opacity: 0, x: reversed ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex-1 text-left"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] text-white text-[8px] font-black uppercase tracking-[0.2em] mb-8">
          <Icon className="w-3 h-3" />
          <span>Platform Module</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
          {title}.
        </h2>
        <p className="text-[#4a4a68] text-xs font-black uppercase tracking-[0.3em] mb-6 opacity-60">
          {subtitle}
        </p>
        <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-lg">
          {desc}
        </p>
        {children}
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex-1 w-full"
      >
        <div className="aspect-square rounded-[3rem] bg-white border border-black/5 shadow-2xl shadow-black/5 relative overflow-hidden flex items-center justify-center">
          {/* Abstract Visual Placeholder */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <Icon className="w-32 h-32 text-[#111111]/10" />
          <div className="absolute bottom-10 left-10 right-10">
            <div className="p-6 rounded-2xl bg-[#111111] text-white/90 text-[10px] font-mono tracking-tighter border border-white/10 shadow-2xl">
              <div className="flex gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
              <code className="block opacity-60 font-mono text-[8px]">system.init_engine_v4()</code>
              <code className="block text-emerald-400 font-mono text-[8px]">...engine.online: true</code>
              <code className="block text-blue-400 font-mono text-[8px]">...syncing_network_state: 100%</code>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const footerWords = ["in", "pay", "alert"];

const Features = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [hideLogo, setHideLogo] = useState(false);
  const [footerWordIdx, setFooterWordIdx] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setInterval(() => {
      setFooterWordIdx((prev) => (prev + 1) % footerWords.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      if (scrollY + windowHeight > fullHeight - 500) {
        setHideLogo(true);
      } else {
        setHideLogo(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative selection:bg-emerald-500/30 font-sans"
      style={{ background: '#f5f4e2', color: '#111111' }}
    >
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#111111] z-[100] origin-left" style={{ scaleX }} />

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
      <header className="h-screen flex flex-col items-center justify-center p-6 text-center border-b border-black/5 relative overflow-hidden">
        {/* Subtle Mesh Background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative z-10"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-black/10 text-[9px] font-black uppercase tracking-[0.4em] mb-10 opacity-60">
            System Infrastructure v2.1
          </div>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.9]" style={{ fontFamily: 'Georgia, serif' }}>
            Precision <br />
            <span className="italic">Engineering.</span>
          </h1>
          <p className="max-w-xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-12">
            The next generation of creator tools, built with mission-critical integrity and cinematic depth.
          </p>

        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20"
        >
          <div className="w-px h-12 bg-[#111111]" />
        </motion.div>
      </header>

      {/* Feature Act I: Alert Engine */}
      <FeatureAct 
        title="Cinematic Assets" 
        subtitle="STAGESIDE VISUALS" 
        desc="Studio-grade 3D assets that react to your stream in real-time. Not just overlays—immersive environments that respond to your community's touch."
        icon={Sparkles}
      >
        <div className="grid grid-cols-2 gap-4">
          {['Dynamic Lighting', '3D Motion', 'Sync Effects', 'Custom Shaders'].map((tag) => (
            <div key={tag} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              {tag}
            </div>
          ))}
        </div>
      </FeatureAct>

      {/* Feature Act II: Revenue Architecture */}
      <FeatureAct 
        title="Revenue Engine" 
        subtitle="FINANCIAL SYSTEM" 
        desc="Direct settlement for every digital drop. Our infrastructure ensures bank-grade integrity with zero-latency revenue reporting."
        icon={Shield}
        reversed
      >
        <div className="p-8 rounded-3xl bg-white border border-black/5 shadow-xl">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold tracking-tighter">0.0%</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Platform Fee</span>
          </div>
          <p className="text-slate-500 text-[10px] leading-relaxed">
            Our network is designed for creators first. No hidden percentages, just pure performance.
          </p>
        </div>
      </FeatureAct>

      {/* Feature Act III: Global Mesh */}
      <FeatureAct 
        title="Global Mesh" 
        subtitle="EDGE COMPUTING" 
        desc="Every overlay is rendered at the edge, ensuring sub-10ms response times globally. No lags, no delays—just pure synchronization across every continent."
        icon={Globe}
      >
        <div className="flex flex-col gap-4">
          <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '99.2%' }}
              className="h-full bg-emerald-500"
            />
          </div>
          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
            <span>Global Latency</span>
            <span className="text-black">9.2ms Average</span>
          </div>
        </div>
      </FeatureAct>

      {/* Bento Grid Features */}
      <section className="py-32 px-6">
        <div className="max-w-[1280px] mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>The Full Architecture.</h2>
          <p className="text-[#4a4a68] text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-60">Complete technical capability</p>
        </div>

        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          {/* Main Bento Piece */}
          <div className="md:col-span-2 md:row-span-2 p-12 bg-[#111111] text-white rounded-[3rem] relative overflow-hidden flex flex-col justify-end group">
            <div className="absolute top-12 left-12">
              <Terminal className="w-12 h-12 text-emerald-400 opacity-50 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-4xl font-black mb-4 tracking-tighter">Developer First.</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-8">
              Open APIs and Webhooks to build your own custom interactions. Total control over your digital identity.
            </p>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl font-mono text-[10px] border border-white/10">
              <span className="text-emerald-400">$</span> drope init --template=cinematic
            </div>
          </div>

          <div className="md:col-span-1 p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-xl flex flex-col justify-between group">
            <Shield className="w-8 h-8 text-blue-500 group-hover:rotate-12 transition-transform" />
            <div>
              <h4 className="font-black text-sm uppercase tracking-tight mb-2">TLS Secured</h4>
              <p className="text-[11px] text-slate-500 leading-tight">Bank-grade encryption for every data byte.</p>
            </div>
          </div>

          <div className="md:col-span-1 p-8 bg-[#FF4F21] text-white rounded-[2.5rem] flex flex-col justify-between group">
            <Zap className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-black text-sm uppercase tracking-tight mb-2">Fast Settlement</h4>
              <p className="text-[11px] text-white/80 leading-tight">Instant payouts world-wide.</p>
            </div>
          </div>

          <div className="md:col-span-2 p-8 bg-[#EFEECC] rounded-[2.5rem] border border-black/5 flex items-center gap-10">
            <div className="w-24 h-24 rounded-full border-4 border-black/5 flex items-center justify-center p-4">
              <Activity className="w-12 h-12 text-black/20" />
            </div>
            <div>
              <h4 className="font-black text-lg uppercase tracking-tighter mb-2">Real-time Analytics</h4>
              <p className="text-[11px] text-slate-600 leading-tight max-w-[200px]">Live data streams integrated into your dashboard seamlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs Bento Redesign */}
      <section className="py-32 px-6 bg-white border-t border-black/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>System Integrity.</h2>
            <p className="text-[#4a4a68] text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-60">Technical Specifications</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[500px]">
            {/* Edge Latency - Large Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-1 p-10 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex flex-col justify-between group"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2 text-emerald-600">Performance</span>
                  <h4 className="text-2xl font-bold tracking-tight text-emerald-900" style={{ fontFamily: 'Georgia, serif' }}>Edge Latency.</h4>
                </div>
                <Zap className="w-6 h-6 text-emerald-400 opacity-50" />
              </div>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black tracking-tighter text-emerald-700 italic" style={{ fontFamily: 'Georgia, serif' }}>10ms</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 pb-2">Global Average</span>
              </div>
            </motion.div>

            {/* Uptime SLA - Small Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-1 md:row-span-1 p-10 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex flex-col justify-between group"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2 text-blue-600">Reliability</span>
                <h4 className="text-xl font-bold tracking-tight text-blue-900" style={{ fontFamily: 'Georgia, serif' }}>Uptime SLA.</h4>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-blue-700 italic" style={{ fontFamily: 'Georgia, serif' }}>99.99%</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-blue-600/60">Enterprise Grade</span>
              </div>
            </motion.div>

            {/* Infrastructure - Tall Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1 md:row-span-2 p-10 bg-[#111111] text-white rounded-[2.5rem] border border-black flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Backbone</span>
                  <h4 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Infrastructure.</h4>
                </div>
                <div className="mt-12 group-hover:translate-y-[-10px] transition-transform">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
                        <span className="text-[10px] font-mono text-emerald-400">Live Engine v4</span>
                    </div>
                  <p className="text-[11px] text-white/50 leading-relaxed font-medium">Distributed high-speed processing clusters across 12 node regions.</p>
                </div>
              </div>
            </motion.div>

            {/* Encryption - Small Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-1 md:row-span-1 p-10 bg-white rounded-[2.5rem] border border-black/5 shadow-xl flex flex-col justify-between group"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Security</span>
                <h4 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Encryption.</h4>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight italic" style={{ fontFamily: 'Georgia, serif' }}>AES-256 / TLS 1.3</span>
                <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Mission Critical</span>
              </div>
            </motion.div>

            {/* Integrity - Wide Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 md:row-span-1 p-10 bg-[#EFEECC] rounded-[2.5rem] border border-black/5 flex items-center justify-between group"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Integrity</span>
                <h4 className="text-3xl font-bold tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>Distributed Sync.</h4>
                <p className="text-slate-600 text-[10px] font-medium mt-2 max-w-[200px]">Real-time state verification across the entire global mesh.</p>
              </div>
              <div className="w-20 h-20 rounded-full border border-black/10 flex items-center justify-center relative">
                <div className="absolute inset-0 animate-spin-slow border-t border-black/20 rounded-full" />
                <Shield className="w-8 h-8 text-black/40" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final Bottom Section: CTA + Footer */}
      <div className="min-h-screen flex flex-col bg-white overflow-hidden">
        {/* Final CTA */}
        <section className="flex-grow flex flex-col justify-center px-6 text-center bg-[#f5f4e2] relative py-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9]" style={{ fontFamily: 'Georgia, serif' }}>
              Ready to <br />
              Join the Network?
            </h2>
            <button 
              onClick={() => navigate('/signup')}
              className="group flex items-center gap-4 px-12 py-6 bg-[#111111] text-white rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] mx-auto border-none"
            >
              Join Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
              {['Twitter', 'Instagram', 'Github'].map(s => (
                <span key={s} className="text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer hover:text-emerald-500 transition-colors">{s}</span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default Features;

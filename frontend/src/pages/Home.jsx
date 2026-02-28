import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Mail, ChevronRight,
  Play, Wand2, Sparkles, Trophy, Globe, Layers, Cpu, Radio,
  ArrowRight, Menu, X, Banknote, Landmark, Rocket,
  Instagram, Twitter, Target, CheckCircle2, Monitor, Smartphone, PlaySquare, Heart, Github, Linkedin, Layout, User, Shield, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Protocol Imports ---
import AlertPreview from '../components/AlertPreview';
import SocketModal from '../components/SocketModal';
import { getOptimizedImage } from '../protocol/cdnHelper';
import DonationTicker from '../components/widgets/DonationTicker';
import CruiserRevenueChart from '../components/widgets/CruiserRevenueChart';

const Home = () => {
  const navigate = useNavigate();

  // --- UNIFIED GLOBAL THEME PROTOCOL ---
  const [theme] = useState(() => {
    return localStorage.getItem('dropPayTheme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('dropPayTheme', theme);
  }, [theme]);


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('streamers');
  const [activeAlert, setActiveAlert] = useState(0);
  const [isSynced, setIsSynced] = useState(true);
  const [pricingCard, setPricingCard] = useState(1); // 0=starter,1=pro,2=legend
  const [pricingDir, setPricingDir] = useState(0);  // slide direction

  // --- KINETIC FLIGHT STATES ---
  const [showPreview, setShowPreview] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  // --- SOCKET MODAL STATE ---
  const [isSocketModalOpen, setIsSocketModalOpen] = useState(false);

  // --- HERO DEMO GOAL STATE (For top ticker and preview) ---
  const [goalAmount, setGoalAmount] = useState(75000);
  const goalTarget = 100000;

  // --- STABLE DEFINITION ---
  const alertVariants = useMemo(() => ['zap', 'cyber', 'royal'], []);
  const [calcAmount, setCalcAmount] = useState(10000);

  const [demoDrops, setDemoDrops] = useState([]);

  // --- Kinetic Connection: Flight Path & Reset Logic ---
  const triggerDemo = useCallback(() => {
    setShowPreview(false);
    setIsFlying(false);

    setTimeout(() => {
      setIsFlying(true);

      const stickerId = alertVariants[activeAlert] === 'zap' ? 'hype_zap' : alertVariants[activeAlert] === 'cyber' ? 'fire_rocket' : 'diamond_gem';

      setTimeout(() => {
        setIsFlying(false);
        setActiveAlert(prev => (prev + 1) % alertVariants.length);
        setShowPreview(true);

        // Update Goal
        setGoalAmount(prev => Math.min(prev + calcAmount, goalTarget));

        // Push to Ticker
        const newDrop = {
          id: Date.now(),
          donorName: activeAlert === 2 ? "Royal Supporter" : activeAlert === 1 ? "Cyber Streamer" : "Zap Node",
          amount: calcAmount,
          sticker: stickerId,
          timestamp: new Date().toISOString()
        };
        setDemoDrops(prev => [newDrop, ...prev].slice(0, 5));

        setTimeout(() => {
          setShowPreview(false);
        }, 5000);
      }, 800);
    }, 50);
  }, [alertVariants, activeAlert, calcAmount, goalTarget]);


  // --- Heartbeat Protocol ---
  useEffect(() => {
    const syncTimer = setInterval(() => setIsSynced(prev => !prev), 2000);
    return () => clearInterval(syncTimer);
  }, []);

  const streamerCut = useMemo(() => (calcAmount * 0.95).toLocaleString('en-IN'), [calcAmount]);
  const platformFee = useMemo(() => (calcAmount * 0.05).toLocaleString('en-IN'), [calcAmount]);



  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    setMousePos({ x: (e.clientX / window.innerWidth) - 0.5, y: (e.clientY / window.innerHeight) - 0.5 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`min-h-screen font-sans selection:bg-[#10B981]/30 transition-colors duration-700 overflow-x-hidden ${theme === 'dark' ? 'bg-[#050505] text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .nexus-feature-card {
          background: rgba(10, 10, 11, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .legacy-tier-card:hover {
          border-color: #F59E0B;
          box-shadow: 0 0 30px rgba(245, 158, 11, 0.15);
        }

        .supernova-glow {
          box-shadow: 0 0 60px rgba(16, 185, 129, 0.6), 0 0 100px rgba(245, 158, 11, 0.4);
          border-color: #F59E0B !important;
        }

        .gold-spark {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #F59E0B;
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-nexus-preview {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 1rem;
          padding: 1.25rem;
          border-radius: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .mini-supporter-pill {
          height: 22px;
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          margin-bottom: 8px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .racer-container {
          position: relative;
          width: 100%;
          height: 120px; /* Height of the SVG viewBox */
          margin-top: 4rem;
          border-radius: 9999px; /* Full rounded */
          overflow: hidden;
          background: rgba(0,0,0,0.3);
        }

        .nexus-vehicle {
          position: absolute;
          offset-path: path("M 0 60 L 200 60 C 250 60 280 110 350 110 S 450 10 550 10 S 700 60 750 60 L 1000 60");
          offset-anchor: center;
          top: 0;
          left: 0;
          width: 0; /* Vehicle size handled by inner div */
          height: 0; /* Vehicle size handled by inner div */
        }
      `}} />


      {/* 0. NAVIGATION / MOBILE MENU */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="relative">
              <Zap className="w-8 h-8 text-[#10B981] fill-[#10B981] group-hover:scale-110 transition-transform" />
              <Shield className="absolute -top-1 -right-1 w-4 h-4 text-emerald-500 opacity-50" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter">DropPay</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#10B981] transition-colors">Features</a>
            <a href="#payouts" className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#10B981] transition-colors">Economics</a>
            <button onClick={() => navigate('/login')} className="text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-all">Login</button>
            <button onClick={() => navigate('/signup')} className="text-[10px] font-black uppercase tracking-[0.3em] bg-[#10B981] text-white px-8 py-3 rounded-full hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2">
              Join <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white relative z-[110]">
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </nav>

      {/* TICKER BELOW NAV */}
      <div className="relative pt-[72px] z-90 bg-black/20">
        <DonationTicker recentDrops={demoDrops} goalPercentage={(goalAmount / goalTarget) * 100} />
      </div>

      {/* MOBILE MENU SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[104]"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[85vw] max-w-[340px] z-[105] flex flex-col overflow-hidden"
              style={{ background: 'linear-gradient(160deg, rgba(7,20,14,0.98) 0%, rgba(5,5,10,0.99) 100%)', borderLeft: '1px solid rgba(16,185,129,0.15)' }}
            >
              {/* Inner glow */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-[#10B981]/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-20 left-0 w-40 h-40 bg-blue-500/6 blur-[60px] rounded-full pointer-events-none" />

              {/* Header row */}
              <div className="flex items-center justify-between px-7 pt-8 pb-6 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-[#10B981] fill-[#10B981]" />
                  <span className="text-white font-black italic tracking-tighter text-lg">DropPay</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Nav links */}
              <div className="flex flex-col gap-1 px-4 pt-6 flex-1">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'Economics', href: '#payouts' },
                  { label: 'Pricing', href: '#pricing' },
                  { label: 'Community', href: '#features' },
                ].map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1, type: 'spring', stiffness: 280, damping: 24 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.04] active:bg-white/[0.07] transition-all group"
                  >
                    <span className="font-black italic uppercase tracking-tight text-xl">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200" />
                  </motion.a>
                ))}

                <div className="my-4 border-t border-white/[0.06]" />

                {/* Status badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mx-4 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#10B981]/5 border border-[#10B981]/15"
                >
                  <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">All Systems Online</p>
                    <p className="text-[9px] text-slate-500 font-medium mt-0.5">99.9% Uptime — Live</p>
                  </div>
                </motion.div>

                {/* Social icons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 mx-4 mt-4"
                >
                  {[Twitter, Instagram, Github, Linkedin].map((Icon, i) => (
                    <button key={i} className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-slate-400 hover:text-[#10B981] hover:bg-[#10B981]/10 transition-all">
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </motion.div>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 24 }}
                className="flex flex-col gap-3 p-6 border-t border-white/[0.06]"
              >
                <button
                  onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                  className="w-full py-4 rounded-2xl border border-white/10 bg-white/[0.04] font-black uppercase italic text-sm tracking-widest text-white hover:bg-white/[0.08] transition-all"
                >
                  Login
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}
                  className="w-full py-4 rounded-2xl bg-[#10B981] text-white font-black uppercase italic text-sm tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_45px_rgba(16,185,129,0.5)] transition-all"
                >
                  Join Now →
                </motion.button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ x: mousePos.x * 60, y: mousePos.y * 60 }}
          className={`absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full transition-all duration-700 ${theme === 'dark' ? 'bg-[#10B981]/10 blur-[120px]' : 'bg-[#10B981]/5 blur-[80px]'
            }`}
        />
      </div>

      {/* --- KINETIC FLIGHT PATHS --- */}
      <AnimatePresence>
        {isFlying && (
          <>
            {/* MOBILE ARC */}
            <motion.div
              initial={{ scale: 0, top: "45%", left: "50%", x: "-50%", y: "-50%", rotate: -45 }}
              animate={{
                scale: [0, 1.5, 1.5, 0],
                top: ["45%", "25%", "80%"],
                rotate: [-45, 90, 180]
              }}
              transition={{ duration: 0.8, times: [0, 0.4, 1], ease: "easeInOut" }}
              className="fixed z-[300] pointer-events-none text-[#10B981] md:hidden"
            >
              <Rocket className="w-12 h-12 fill-current shadow-[0_0_30px_#10B981]" />
            </motion.div>

            {/* DESKTOP ARC */}
            <motion.div
              initial={{ scale: 0, top: "60%", left: "25%", x: "-50%", y: "-50%", rotate: 0 }}
              animate={{
                scale: [0, 1.5, 1.5, 0],
                top: ["60%", "30%", "50%"],
                left: ["25%", "50%", "75%"],
                rotate: [0, 45, 90]
              }}
              transition={{ duration: 0.8, times: [0, 0.4, 1], ease: "easeInOut" }}
              className="fixed z-[300] pointer-events-none text-[#10B981] hidden md:block"
            >
              <Rocket className="w-12 h-12 fill-current shadow-[0_0_30px_#10B981]" />
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* --- HERO SECTION --- */}
      <section className="relative pt-10 pb-32 px-6">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-7">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border ${theme === 'dark' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-emerald-50 text-emerald-600'}`}>
              <Globe className={`w-3 h-3 ${isSynced ? 'opacity-100 scale-125' : 'opacity-30 scale-100'} transition-all duration-700`} /> Node Sync Active
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-8">
              Monetize <br /> <span className="text-[#10B981]">Influence.</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl mb-12 italic leading-relaxed">
              Sub-ms transmission latency. Instant bank settlements. Built for professional creators.
            </p>
            <div className="flex flex-wrap gap-6 relative">
              <button onClick={() => navigate('/signup')} className="bg-[#10B981] text-white px-10 py-5 rounded-2xl font-black uppercase italic text-sm shadow-2xl flex items-center gap-3 active:scale-95 transition-all">
                <Play className="w-4 h-4 fill-white" /> Start Hub
              </button>

              <div className="relative group">
                <button
                  onClick={triggerDemo}
                  className={`px-10 py-5 rounded-2xl font-black uppercase italic text-sm transition-all flex items-center gap-3 active:scale-95 border ${theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-100 shadow-sm'
                    }`}
                >
                  <Sparkles className="w-4 h-4 text-[#10B981]" /> {getOptimizedImage('Inject Demo')}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            {/* MINI-NEXUS PREVIEW — placed directly on the page */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className={`relative min-h-[480px] flex flex-col overflow-hidden rounded-[2.5rem] border ${theme === 'dark' ? 'bg-white/[0.03] border-white/[0.08] backdrop-blur-xl' : 'bg-white/60 border-white/70 backdrop-blur-xl shadow-xl'}`}
            >
              <div className="flex-1 flex flex-col p-5 gap-4">

                {/* Top bar — streamer identity */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                  <div className="w-9 h-9 rounded-full bg-[#10B981] p-0.5 shrink-0">
                    <div className={`w-full h-full rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                      <User className="w-4 h-4 text-[#10B981]" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] font-black italic tracking-tighter leading-none truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>@dev-gamer</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#10B981] mt-0.5">Verified Pro</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#10B981] shrink-0 animate-pulse" />
                </div>

                {/* Mini-Nexus grid — sidebar + alert area */}
                <div className="hero-nexus-preview flex-1">

                  {/* Left: Top Fans sidebar */}
                  <div className="flex flex-col gap-2 pt-1">
                    <p className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Top Fans</p>
                    {[
                      { rank: 1, color: '#F59E0B' },
                      { rank: 2, color: '#94A3B8' },
                      { rank: 3, color: '#CD7F32' },
                    ].map(({ rank, color }) => (
                      <div key={rank} className="flex items-center gap-1.5">
                        <span style={{ color, fontSize: '8px', fontWeight: 900 }}>#{rank}</span>
                        <div className="mini-supporter-pill flex-1" />
                      </div>
                    ))}
                  </div>

                  {/* Right: Alert preview area */}
                  <div className="flex flex-col gap-2 min-w-0">
                    <AnimatePresence mode="wait">
                      {!showPreview && (
                        <motion.div
                          key="awaiting"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className={`h-full flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/[0.03] border-white/[0.05]' : 'bg-black/[0.03] border-black/[0.06]'}`}
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-[#10B981]/20 blur-xl rounded-full animate-pulse" />
                            <Radio className="w-8 h-8 relative z-10 text-[#10B981]" />
                          </div>
                          <p className={`text-sm font-black italic uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Awaiting Drop</p>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 text-center leading-relaxed">Broadcast Nexus live.<br />Inject Demo to start.</p>
                        </motion.div>
                      )}
                      {showPreview && (
                        <motion.div
                          key="alert"
                          initial={{ opacity: 0, scale: 0.92, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.92, y: -10 }}
                          className="w-full"
                        >
                          <AlertPreview
                            variant={alertVariants[activeAlert]}
                            tier={activeAlert === 2 ? 'legend' : activeAlert === 1 ? 'pro' : 'starter'}
                            donorName={activeAlert === 2 ? 'Royal Supporter' : activeAlert === 1 ? 'Cyber Streamer' : 'Zap Node'}
                            amount={calcAmount}
                            message="Atomic split verified! 🚀"
                            theme={theme}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Bottom stat bar */}
                <div className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.03] border-black/[0.05]'}`}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#10B981]">Live</span>
                  </div>
                  <div className="h-3 w-px bg-white/10" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">75% goal funded</span>
                  <div className="ml-auto flex items-center gap-1 text-[#10B981]">
                    <BarChart3 className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* SUPERNOVA SPARKS */}
              {/* SUPERNOVA SPARKS (omitted for static preview) */}

            </motion.div>
          </div>
        </div>
      </section>

      {/* --- ELITE FOUR FEATURES GRID --- */}
      <section className="py-16 px-6 bg-gradient-to-b from-transparent via-[#10B981]/5 to-transparent">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="mb-10">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">Elite <span className="text-[#10B981]">Nexus.</span></h2>
            <p className="text-slate-500 font-medium italic text-sm max-w-2xl">Refined architecture for high-concurrency streaming nodes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* 1. STOREFRONT NEXUS */}
            <motion.div
              whileHover={{ y: -4 }}
              className="nexus-feature-card rounded-2xl p-6 lg:p-8 relative overflow-hidden group cursor-default"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Layout className="w-20 h-20 text-[#10B981]" />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-4 text-[#10B981] border border-[#10B981]/20">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Storefront Nexus.</h3>
                <p className="text-slate-500 font-medium italic text-sm max-w-sm mb-4 lead-relaxed">
                  Identity-first architecture with custom sidebars and sub-ms responsiveness across all device nodes.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#10B981]">Mobile Optimized</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity-First</div>
                </div>
              </div>
            </motion.div>

            {/* 2. THEME CONTROL HUB */}
            <motion.div
              whileHover={{ y: -4 }}
              className="nexus-feature-card rounded-2xl p-6 lg:p-8 relative overflow-hidden group cursor-default legacy-tier-card"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wand2 className="w-20 h-20 text-amber-500" />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 text-amber-500 border border-amber-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2 text-amber-500">Theme Control.</h3>
                <p className="text-slate-500 font-medium italic text-sm max-w-sm mb-4 lead-relaxed">
                  Deploy Nebula, Aero, and Midnight Obsidian styles with real-time hover-glow and glassmorphism.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest text-amber-500">Super-High UHD</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">Live Inject</div>
                </div>
              </div>
            </motion.div>

            {/* 3. BROADCAST TICKER */}
            <motion.div
              whileHover={{ y: -4 }}
              className="nexus-feature-card rounded-2xl p-6 lg:p-8 relative overflow-hidden group cursor-default"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Radio className="w-20 h-20 text-[#10B981]" />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-4 text-[#10B981] border border-[#10B981]/20">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Broadcast Ticker.</h3>
                <p className="text-slate-500 font-medium italic text-sm max-w-sm mb-4 lead-relaxed">
                  Professional non-repeating Lottie sticker feed. Single-pass logic for zero-clutter transmission.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#10B981]">Lottie Native</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">No Buffering</div>
                </div>
              </div>
            </motion.div>

            {/* 4. MISSION DYNAMICS */}
            <motion.div
              whileHover={{ y: -4 }}
              className="nexus-feature-card rounded-2xl p-6 lg:p-8 relative overflow-hidden group cursor-default"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy className="w-20 h-20 text-[#10B981]" />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-4 text-[#10B981] border border-[#10B981]/20">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Mission Dynamics.</h3>
                <p className="text-slate-500 font-medium italic text-sm max-w-sm mb-4 lead-relaxed">
                  Interactive goal bars with supernova celebration effects. Real-time funding updates.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#10B981]">Auto Celebration</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">Supernova Inject</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- GHOST SHELL PREVIEW (REVENUE HUD PLACEHOLDER) --- */}
      <section id="features" className="pt-20 pb-4 md:py-20 px-6 max-w-[1440px] mx-auto w-full">
        <div
          className="nexus-glass-preview-shell w-full rounded-[3.5rem] mb-20 p-6 md:p-10 flex flex-col justify-center items-center"
          style={{
            minHeight: '400px',
            background: 'rgba(15, 23, 42, 0.2)',
            backdropFilter: 'blur(35px)',
            WebkitBackdropFilter: 'blur(35px)',
            border: '0.5px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="w-full max-w-5xl">
            <CruiserRevenueChart isDemo={true} theme={theme} />
          </div>
        </div>

        {/* --- PROTOCOL NODES (TABBED SECTION) --- */}
        <motion.div
          className="mb-20 md:mb-0"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center mb-16 px-6">
            <h2 className={`text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Protocol Architecture</h2>
            <div className={`p-2 rounded-2xl flex border ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-white shadow-md border-slate-100'}`}>
              {[
                { id: 'streamers', label: 'Engine', icon: <Cpu className="w-4 h-4" /> },
                { id: 'developers', label: 'Nodes', icon: <Monitor className="w-4 h-4" /> },
                { id: 'community', label: 'Social', icon: <Heart className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-3 rounded-xl font-black uppercase italic text-[10px] tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id
                    ? 'bg-[#10B981] text-white shadow-lg'
                    : 'text-slate-500 hover:text-[#10B981]'
                    }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-10 md:p-20 rounded-[4rem] border ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white shadow-2xl'}`}
            >
              {activeTab === 'streamers' && (
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 text-[#10B981] font-black uppercase text-xs tracking-widest">
                      <BarChart3 className="w-6 h-6" /> Yield Optimization
                    </div>
                    <h3 className="text-4xl md:text-6xl font-black italic uppercase leading-none tracking-tighter">Maximize <br /> Every Drop</h3>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">Our proprietary Razorpay Route integration ensures your revenue clears T+2 settlements with zero manual intervention.</p>
                    <div className="flex gap-4">
                      <Smartphone className="w-8 h-8 text-slate-700" />
                      <Monitor className="w-8 h-8 text-[#10B981]" />
                      <PlaySquare className="w-8 h-8 text-slate-700" />
                    </div>
                  </div>
                  <div className="relative group overflow-hidden rounded-3xl border border-white/10 aspect-video bg-black flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-transparent" />
                    <Play className="w-16 h-16 text-[#10B981] fill-[#10B981]" />
                  </div>
                </div>
              )}
              {activeTab === 'developers' && (
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div className="order-2 md:order-1 relative group overflow-hidden rounded-3xl border border-white/10 aspect-video bg-black flex items-center justify-center">
                    <pre className="text-emerald-500 text-[10px] p-6 w-full font-mono italic">
                      {`{
  "node": "drop_nexus_04",
  "status": "synchronized",
  "latency": "0.4ms",
  "protocol": "TCP/HYPER"
}`}
                    </pre>
                  </div>
                  <div className="order-1 md:order-2 space-y-8">
                    <div className="flex items-center gap-4 text-[#10B981] font-black uppercase text-xs tracking-widest">
                      <Shield className="w-6 h-6" /> Secure Architecture
                    </div>
                    <h3 className="text-4xl md:text-6xl font-black italic uppercase leading-none tracking-tighter">API First <br /> Mentality</h3>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">Websocket clusters with automatic failover. Your alerts never go offline, even under extreme concurrent loads.</p>
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center gap-1">
                        <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                        <span className="text-[8px] font-black uppercase text-slate-600">Verified</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                        <span className="text-[8px] font-black uppercase text-slate-600">Encrypted</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'community' && (
                <div className="text-center max-w-2xl mx-auto space-y-8">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Heart className="w-10 h-10 text-emerald-500 fill-emerald-500/20" />
                    </div>
                  </div>
                  <h3 className="text-5xl font-black italic uppercase tracking-tighter">Join the Collective</h3>
                  <p className="text-slate-500 font-medium text-lg">Connect with thousands of pro creators in our encrypted Discord node. Share overlays, scripts, and growth strategies.</p>
                  <div className="flex justify-center gap-8 pt-6">
                    <Github className="w-6 h-6 hover:text-[#10B981] transition-colors cursor-pointer" />
                    <Linkedin className="w-6 h-6 hover:text-[#10B981] transition-colors cursor-pointer" />
                    <Twitter className="w-6 h-6 hover:text-[#10B981] transition-colors cursor-pointer" />
                  </div>

                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Removed Generic Grid */}
      </section>

      {/* --- ECONOMIC CALCULATOR (LIVE) --- */}
      <section id="payouts" className="pt-0 pb-16 md:pt-12 md:pb-24 px-6">
        <div className={`simulator-glow-card max-w-4xl mx-auto p-8 sm:p-12 rounded-[3rem] relative overflow-hidden transition-all ${theme === 'dark' ? '' : 'bg-white !border-slate-200 !shadow-2xl'}`}>

          {/* Multi-color glow orbs */}
          <motion.div animate={{ opacity: [0.06, 0.14, 0.06] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 -right-24 w-80 h-80 bg-[#10B981] blur-[100px] rounded-full pointer-events-none" />
          <motion.div animate={{ opacity: [0.04, 0.09, 0.04] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500 blur-[100px] rounded-full pointer-events-none" />
          <motion.div animate={{ opacity: [0.03, 0.07, 0.03] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-1/2 -right-10 w-48 h-48 bg-violet-500 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-8">

            {/* Header */}
            <div className="flex items-center gap-5">
              <motion.div
                animate={{ boxShadow: ['0 0 0px rgba(16,185,129,0)', '0 0 20px rgba(16,185,129,0.4)', '0 0 0px rgba(16,185,129,0)'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="p-3.5 bg-[#10B981]/10 rounded-2xl text-[#10B981] border border-[#10B981]/20"
              >
                <Landmark className="w-7 h-7" />
              </motion.div>
              <div>
                <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Payout Simulator</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0"
                  />
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#10B981]">Live Economic Protocol</p>
                </div>
              </div>
            </div>

            {/* Quick-pick presets */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 self-center mr-1">Quick Pick:</span>
              {[100, 500, 1000, 5000, 10000, 50000].map(preset => (
                <motion.button
                  key={preset}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setCalcAmount(preset)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${calcAmount === preset
                    ? 'bg-[#10B981] text-white border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-slate-400 hover:border-[#10B981]/40 hover:text-[#10B981]'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-[#10B981]/40 hover:text-[#10B981]'
                    }`}
                >
                  ₹{preset >= 1000 ? `${preset / 1000}K` : preset}
                </motion.button>
              ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">

              {/* INPUT SIDE */}
              <div className="lg:col-span-7 space-y-4">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-[#10B981]" /> Donation Amount (INR)
                </label>
                <div className="relative group">
                  {/* Glow ring that pulses on focus */}
                  <motion.div
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -inset-1 bg-[#10B981]/20 rounded-[2.5rem] blur-md pointer-events-none"
                  />
                  <input
                    type="number"
                    value={calcAmount}
                    onChange={e => setCalcAmount(Number(e.target.value))}
                    className={`relative w-full border rounded-[2rem] px-8 py-6 text-5xl font-black italic outline-none transition-all focus:border-[#10B981] focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)] ${theme === 'dark'
                      ? 'bg-black/50 border-white/10 text-[#10B981]'
                      : 'bg-slate-50 border-slate-200 text-[#10B981]'}`}
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black italic opacity-20">INR</span>
                </div>

                {/* Live split bar */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <span className="text-[#10B981]">Your Split 95%</span>
                    <span>Node Fee 5%</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '95%' }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                    />
                  </div>
                </div>
              </div>

              {/* RESULTS SIDE */}
              <div className="lg:col-span-5 space-y-3">

                {/* Streamer cut — animated */}
                <motion.div
                  key={streamerCut}
                  initial={{ scale: 0.96, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`p-6 rounded-2xl border relative overflow-hidden ${theme === 'dark' ? 'bg-[#10B981]/5 border-[#10B981]/25' : 'bg-emerald-50 border-emerald-200'}`}
                >
                  <motion.div
                    animate={{ opacity: [0, 0.15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-[#10B981] pointer-events-none"
                  />
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#10B981] mb-1">Your Split (95%)</p>
                  <motion.p
                    key={streamerCut}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`text-4xl font-black italic drop-shadow-[0_0_20px_rgba(16,185,129,0.5)] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                  >
                    ₹{streamerCut.toLocaleString('en-IN')}
                  </motion.p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-1 h-1 rounded-full bg-[#10B981]" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#10B981]">Instant Settlement</span>
                  </div>
                </motion.div>

                {/* Platform fee */}
                <motion.div
                  key={platformFee}
                  initial={{ scale: 0.97, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}
                >
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Node Fee (5%)</p>
                  <motion.p
                    key={platformFee}
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-xl font-black italic text-slate-500"
                  >
                    ₹{platformFee.toLocaleString('en-IN')}
                  </motion.p>
                </motion.div>

                {/* Settlement info chip */}
                <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/[0.02] border-white/5 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <Zap className="w-3 h-3 text-[#10B981] shrink-0" />
                  T+2 Bank Settlement · Razorpay Route
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-16 md:py-20 px-6">
        <div className="max-w-[1440px] mx-auto 2xl:max-w-[1600px]">
          {/* Header */}
          <div className="text-center mb-10 md:mb-12">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 border ${theme === 'dark' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
              <Zap className="w-3 h-3" /> Subscription Tiers
            </div>
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Transparent <span className="text-[#10B981]">Pricing.</span>
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base max-w-xl mx-auto italic">
              Every plan includes real-time alerts, OBS overlays, and instant settlements.
            </p>
          </div>

          {/* ── MOBILE CAROUSEL (hidden on md+) ── */}
          {(() => {
            const pricingCards = [
              {
                id: 'starter',
                label: 'Core Node — Starter',
                price: '₹699', sub: 'Entry-level node for new creators.',
                icon: <Zap className="w-5 h-5 text-slate-400" />,
                iconBg: 'bg-slate-500/10',
                labelColor: 'text-slate-500',
                cardClass: theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200',
                features: ['85% Revenue Split (15% Fee)', 'Real-time OBS Alerts', 'Custom Donation Page', 'Lottie Sticker Packs', 'Goal Bar Overlays', 'Weekly Payouts'],
                featureColor: theme === 'dark' ? 'text-slate-400' : 'text-slate-600',
                checkColor: 'text-[#10B981]',
                btnClass: theme === 'dark' ? 'border border-white/10 text-white hover:bg-white/5' : 'border border-slate-200 text-slate-700',
                btnLabel: 'Activate Starter Node',
              },
              {
                id: 'pro', label: 'Elite Mesh — Pro',
                price: '₹1,499', sub: 'Best for growing creators & streamers.',
                icon: <Rocket className="w-5 h-5 text-[#10B981]" />,
                iconBg: 'bg-[#10B981]/15',
                labelColor: 'text-[#10B981]',
                badge: 'Most Popular',
                cardClass: 'border-[#10B981]/50 bg-gradient-to-b from-[#10B981]/10 to-transparent shadow-[0_0_40px_rgba(16,185,129,0.15)]',
                features: ['90% Revenue Split (10% Fee)', 'Everything in Starter', 'Priority Alert Delivery', '20+ Premium Alert Styles', '48hr Payout Processing', 'Priority Support'],
                featureColor: theme === 'dark' ? 'text-slate-300' : 'text-slate-700',
                checkColor: 'text-[#10B981]',
                btnClass: 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/30',
                btnLabel: 'Deploy Elite Node',
              },
              {
                id: 'legend', label: 'Legendary Uplink — Legend',
                price: '₹2,499', sub: 'For professional creators at the top.',
                icon: <Trophy className="w-5 h-5 text-amber-400" />,
                iconBg: 'bg-amber-500/15',
                labelColor: 'text-amber-500',
                cardClass: theme === 'dark' ? 'bg-[#0a0808]/60 border-amber-500/25' : 'bg-amber-50 border-amber-200',
                features: ['95% Revenue Split (5% Fee)', 'Everything in Pro', 'Dedicated WebSocket Node', 'Unlimited Premium Styles', 'Instant Payouts', 'Dedicated Account Manager'],
                featureColor: theme === 'dark' ? 'text-slate-300' : 'text-slate-700',
                checkColor: 'text-amber-400',
                btnClass: 'bg-amber-500 text-black shadow-lg shadow-amber-500/25',
                btnLabel: 'Go Legendary',
              },
            ];
            const goCard = (newIdx) => { setPricingDir(newIdx > pricingCard ? 1 : -1); setPricingCard(newIdx); };
            return (
              <div className="md:hidden">
                <div className="relative overflow-visible px-2 pt-6 pb-2" style={{ minHeight: 520 }}>
                  <AnimatePresence mode="wait" custom={pricingDir}>
                    {pricingCards.map((card, i) => i === pricingCard && (
                      <motion.div
                        key={card.id}
                        custom={pricingDir}
                        initial={{ opacity: 0, x: pricingDir * 60, scale: 0.97 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: pricingDir * -60, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                        className={`relative rounded-3xl border p-7 flex flex-col ${card.cardClass}`}
                      >
                        {card.badge && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-[#10B981] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#10B981]/30">
                            {card.badge}
                          </div>
                        )}
                        <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-4 ${card.badge ? 'mt-3' : ''}`}>
                          {card.icon}
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${card.labelColor}`}>{card.label}</p>
                        <div className="flex items-end gap-2 mb-1">
                          <span className={`text-5xl font-black italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{card.price}</span>
                          <span className="text-slate-500 font-bold mb-1.5">/mo</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-5">{card.sub}</p>
                        <ul className="space-y-2.5 mb-6">
                          {card.features.map(f => (
                            <li key={f} className="flex items-center gap-3 text-sm">
                              <CheckCircle2 className={`w-4 h-4 ${card.checkColor} shrink-0`} />
                              <span className={card.featureColor}>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <button onClick={() => navigate('/subscription')}
                          className={`w-full py-4 rounded-2xl font-black uppercase italic text-sm tracking-widest transition-all ${card.btnClass}`}>
                          {card.btnLabel}
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button onClick={() => goCard(Math.max(0, pricingCard - 1))}
                    disabled={pricingCard === 0}
                    className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-25 transition-all">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <div className="flex gap-2">
                    {pricingCards.map((c, i) => (
                      <button key={c.id} onClick={() => goCard(i)}
                        className={`rounded-full transition-all duration-300 ${i === pricingCard
                          ? (i === 1 ? 'w-6 h-2.5 bg-[#10B981]' : i === 2 ? 'w-6 h-2.5 bg-amber-400' : 'w-6 h-2.5 bg-slate-400')
                          : 'w-2.5 h-2.5 bg-white/15 hover:bg-white/30'
                          }`} />
                    ))}
                  </div>
                  <button onClick={() => goCard(Math.min(pricingCards.length - 1, pricingCard + 1))}
                    disabled={pricingCard === pricingCards.length - 1}
                    className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-25 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2 justify-center mt-4">
                  {pricingCards.map((c, i) => (
                    <button key={c.id} onClick={() => goCard(i)}
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${i === pricingCard
                        ? (i === 1 ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30' : i === 2 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'bg-white/10 text-white border border-white/15')
                        : 'text-slate-600 hover:text-slate-400'
                        }`}>
                      {i === 0 ? 'Starter' : i === 1 ? 'Pro' : 'Legend'}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ── DESKTOP GRID (hidden below md) ── */}

          {/* ── DESKTOP HORIZONTAL STACK (hidden below md) ── */}
          <div className="hidden md:flex flex-col gap-5 max-w-5xl mx-auto">

            {/* ── STARTER ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              whileHover={{ scale: 1.01 }}
              className={`relative rounded-3xl border p-6 flex items-center gap-6 transition-all ${theme === 'dark' ? 'bg-white/[0.03] border-white/10 hover:border-[#10B981]/30' : 'bg-white border-slate-200 shadow-sm hover:border-[#10B981]/40'
                }`}
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-500/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-slate-400" />
              </div>

              <div className="flex-grow flex items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Core Node</p>
                  <h3 className={`text-2xl font-black italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Starter</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">Free forever. Great for beginners.</p>
                </div>

                <div className="flex-1 bg-black/10 rounded-xl p-3 mx-4 hidden lg:block">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}><CheckCircle2 className="w-3 h-3 text-[#10B981]" /> 85% Split (15% Fee)</span>
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}><CheckCircle2 className="w-3 h-3 text-[#10B981]" /> T+2 Bank Settlement</span>
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}><CheckCircle2 className="w-3 h-3 text-[#10B981]" /> Real-time OBS Alerts</span>
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}><CheckCircle2 className="w-3 h-3 text-[#10B981]" /> Weekly Payouts</span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-3 flex-shrink-0 min-w-[140px]">
                  <div className="flex items-end gap-1.5">
                    <span className={`text-4xl font-black italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹699</span>
                    <span className="text-slate-500 font-bold mb-1">/mo</span>
                  </div>
                  <button onClick={() => navigate('/subscription')}
                    className={`px-5 py-2.5 rounded-xl font-black uppercase italic text-[11px] tracking-widest transition-all border ${theme === 'dark' ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                    Deploy
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ── PRO (HIGHLIGHTED) ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="relative rounded-3xl border border-[#10B981]/50 p-6 flex items-center gap-6 bg-gradient-to-r from-[#10B981]/10 via-[#10B981]/5 to-transparent shadow-[0_0_40px_rgba(16,185,129,0.12)]"
            >
              <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1 rounded-full bg-[#10B981] text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#10B981]/30">
                Most Popular
              </div>

              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#10B981]/15 flex items-center justify-center">
                <Rocket className="w-8 h-8 text-[#10B981]" />
              </div>

              <div className="flex-grow flex items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#10B981] mb-0.5">Elite Mesh</p>
                  <h3 className={`text-2xl font-black italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Pro</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">Volume creators & streamers.</p>
                </div>

                <div className="flex-1 bg-black/10 rounded-xl p-3 mx-4 hidden lg:block">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><CheckCircle2 className="w-3 h-3 text-[#10B981]" /> 90% Split (10% Fee)</span>
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><CheckCircle2 className="w-3 h-3 text-[#10B981]" /> Priority Alert Delivery</span>
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><CheckCircle2 className="w-3 h-3 text-[#10B981]" /> 20+ Premium Styles</span>
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><CheckCircle2 className="w-3 h-3 text-[#10B981]" /> 48hr Fast Payouts</span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-3 flex-shrink-0 min-w-[140px]">
                  <div className="flex items-end gap-1.5">
                    <span className={`text-4xl font-black italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹1,499</span>
                    <span className="text-slate-500 font-bold mb-1">/mo</span>
                  </div>
                  <button onClick={() => navigate('/subscription')}
                    className="px-5 py-2.5 rounded-xl font-black uppercase italic text-[11px] tracking-widest transition-all bg-[#10B981] text-white hover:bg-emerald-400 shadow-lg shadow-[#10B981]/30 hover:shadow-[#10B981]/50">
                    Deploy
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ── LEGEND ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.01 }}
              className={`relative rounded-3xl border p-6 flex items-center gap-6 overflow-hidden transition-all legacy-tier-card ${theme === 'dark' ? 'bg-[#0a0808]/60 border-amber-500/25 hover:border-amber-500/50' : 'bg-amber-50 border-amber-200 shadow-sm'
                }`}
            >
              <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-500/10 via-transparent to-transparent pointer-events-none" />

              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-amber-500/15 flex items-center justify-center relative z-10">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>

              <div className="flex-grow flex items-center justify-between gap-6 relative z-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-0.5">Legendary Uplink</p>
                  <h3 className={`text-2xl font-black italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Legend</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">Professional bespoke node.</p>
                </div>

                <div className="flex-1 bg-black/10 rounded-xl p-3 mx-4 hidden lg:block">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><CheckCircle2 className="w-3 h-3 text-amber-400" /> 95% Split (5% Fee)</span>
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><CheckCircle2 className="w-3 h-3 text-amber-400" /> Dedicated WebSocket</span>
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><CheckCircle2 className="w-3 h-3 text-amber-400" /> Unlimited Premium</span>
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><CheckCircle2 className="w-3 h-3 text-amber-400" /> Instant Processing</span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-3 flex-shrink-0 min-w-[140px]">
                  <div className="flex items-end gap-1.5">
                    <span className={`text-4xl font-black italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹2,499</span>
                    <span className="text-slate-500 font-bold mb-1">/mo</span>
                  </div>
                  <button onClick={() => navigate('/subscription')}
                    className="px-5 py-2.5 rounded-xl font-black uppercase italic text-[11px] tracking-widest transition-all relative z-10 bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/25">
                    Deploy
                  </button>
                </div>
              </div>
            </motion.div>
          </div>


          {/* Bottom note */}
          <p className="text-center text-slate-600 text-sm font-medium mt-10">
            All plans include a <span className="text-[#10B981] font-bold">7-day free trial</span>. Cancel anytime. Billed via Razorpay.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className={`relative overflow-hidden p-10 sm:p-16 rounded-[4rem] border transition-all flex flex-col md:flex-row items-center justify-between gap-10 ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#10B981]/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'bg-emerald-50 border-emerald-200 shadow-xl'}`}>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#10B981]/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981]">Core Engineers Online</span>
              </div>
              <h2 className={`text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Need Custom <span className="text-[#10B981]">Architecture?</span>
              </h2>
              <p className="text-slate-500 font-medium italic max-w-xl mx-auto md:mx-0">
                Enterprise transaction limits, custom protocol integrations, or dedicated mesh clusters. Open a direct socket with our architecture team.
              </p>
            </div>
            <div className="relative z-10 shrink-0 w-full md:w-auto">
              {/* TRIGGER MODAL */}
              <button
                onClick={() => setIsSocketModalOpen(true)}
                className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black uppercase italic tracking-widest text-sm transition-all flex items-center justify-center gap-3 border ${theme === 'dark' ? 'bg-white/5 border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981]/10' : 'bg-white border-[#10B981]/30 text-[#10B981] hover:bg-emerald-50 shadow-md'}`}>
                <Radio className="w-5 h-5" /> Open Socket
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* --- FOOTER --- */}
      <footer className={`border-t transition-colors duration-500 ${theme === 'dark' ? 'border-white/[0.06] bg-[#050505]' : 'border-slate-100 bg-white'}`}>

        {/* TOP FOOTER — 4 columns */}
        <div className="max-w-[1440px] mx-auto px-6 pt-16 pb-12 grid grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-10">

          {/* BRAND COLUMN — full width on mobile, 2 cols on desktop */}
          <div className="col-span-3 md:col-span-2 flex flex-col gap-5">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => {
              if (localStorage.getItem('token')) navigate('/dashboard');
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
              <Zap className="w-7 h-7 text-[#10B981] fill-[#10B981]" />
              <span className={`text-xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>DropPay</span>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
              The professional-grade monetisation engine for creators, streamers, and live broadcasters. Instant settlements. Zero latency.
            </p>
            {/* Social links */}
            <div className="flex gap-4 mt-1">
              {[
                { icon: <Twitter className="w-4 h-4" />, label: 'Twitter' },
                { icon: <Instagram className="w-4 h-4" />, label: 'Instagram' },
                { icon: <Github className="w-4 h-4" />, label: 'GitHub' },
                { icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn' },
                { icon: <Mail className="w-4 h-4" />, label: 'Email' },
              ].map(({ icon, label }) => (
                <button key={label} aria-label={label} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:text-[#10B981] ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:bg-[#10B981]/10' : 'bg-slate-100 text-slate-500 hover:bg-emerald-50'}`}>
                  {icon}
                </button>
              ))}
            </div>
            {/* Status badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit border text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-[#10B981]/5 border-[#10B981]/20 text-[#10B981]' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              All Systems Operational
            </div>
          </div>

          {/* PRODUCT COLUMN */}
          <div className="flex flex-col gap-4">
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Product</p>
            {['Features', 'Economics', 'Dashboard', 'Overlays', 'Alert Engine', 'Payout Simulator'].map(item => (
              <button key={item} onClick={() => item === 'Dashboard' ? navigate('/dashboard') : null}
                className="text-slate-500 hover:text-[#10B981] text-sm font-medium text-left transition-colors">
                {item}
              </button>
            ))}
          </div>

          {/* PLATFORM COLUMN */}
          <div className="flex flex-col gap-4">
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Platform</p>
            {['Pricing', 'Changelog', 'Status Page', 'API Docs', 'Community', 'Open Source'].map(item => (
              <button key={item}
                onClick={() => item === 'Pricing' ? document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }) : null}
                className="text-slate-500 hover:text-[#10B981] text-sm font-medium text-left transition-colors">
                {item}
              </button>
            ))}
          </div>

          {/* COMPANY COLUMN */}
          <div className="flex flex-col gap-4">
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Company</p>
            {['About', 'Blog', 'Careers', 'Press Kit', 'Contact', 'Security'].map(item => (
              <button key={item} onClick={() => item === 'Contact' ? setIsSocketModalOpen(true) : null}
                className="text-slate-500 hover:text-[#10B981] text-sm font-medium text-left transition-colors">
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className={`max-w-[1440px] mx-auto px-6 ${theme === 'dark' ? 'border-t border-white/[0.05]' : 'border-t border-slate-100'}`} />

        {/* BOTTOM BAR */}
        <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-[11px] font-medium">
            © 2026 DropPay Technologies. All rights reserved. Built in India 🇮🇳
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'].map(item => (
              <button key={item} className="text-slate-500 hover:text-[#10B981] text-[11px] font-medium transition-colors whitespace-nowrap">
                {item}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* --- TECHNICAL SOCKET MODAL (GIANT-TIER) --- */}
      <SocketModal
        isOpen={isSocketModalOpen}
        onClose={() => setIsSocketModalOpen(false)}
        theme={theme}
      />
    </div >
  );
};

export default Home;
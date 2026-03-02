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

const Home = () => {
  const navigate = useNavigate();

  // --- UNIFIED GLOBAL THEME PROTOCOL ---
  const theme = useMemo(() => {
    return localStorage.getItem('dropPayTheme') || 'light';
  }, []);

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
  const [showPreview, setShowPreview] = useState(true);
  const [isFlying, setIsFlying] = useState(false);

  // --- SOCKET MODAL STATE ---
  const [isSocketModalOpen, setIsSocketModalOpen] = useState(false);

  // --- HERO DEMO GOAL STATE (For top ticker and preview) ---
  const [goalAmount, setGoalAmount] = useState(75000);
  const goalTarget = 100000;

  // --- STABLE DEFINITION ---
  const alertVariants = useMemo(() => ['pixel', 'gta', 'bgmi'], []);
  const [calcAmount, setCalcAmount] = useState(10000);

  const INITIAL_DEMO_DROPS = [
    { id: 1, donorName: "Pixel Miner", amount: 5000, sticker: "coins", message: "Pixel loot verified! 🪙" },
    { id: 2, donorName: "Wasted Legend", amount: 10000, sticker: "diamond_gem", message: "Respect +100 earned! 💎" },
    { id: 3, donorName: "Airdrop King", amount: 25000, sticker: "fire_rocket", message: "Supplies inbound! 🪂" },
    { id: 4, donorName: "Retro Gamer", amount: 2000, sticker: "coins", message: "Level up!" },
    { id: 5, donorName: "Street Champ", amount: 7500, sticker: "super_heart", message: "GG WP!" },
  ];

  const [demoDrops, setDemoDrops] = useState(INITIAL_DEMO_DROPS);

  // --- Kinetic Connection: Flight Path & Reset Logic ---
  const triggerDemo = useCallback(() => {
    // Keep preview visible, but show flight animation
    setIsFlying(true);

    const stickerId = alertVariants[activeAlert] === 'pixel' ? 'coins' : alertVariants[activeAlert] === 'gta' ? 'diamond_gem' : 'fire_rocket';

    setTimeout(() => {
      setIsFlying(false);
      // SWITCH STYLE ON IMPACT
      setActiveAlert(prev => (prev + 1) % alertVariants.length);

      // Update Goal
      setGoalAmount(prev => Math.min(prev + calcAmount, goalTarget));

      // Push to Ticker
      const newDrop = {
        id: Date.now(),
        donorName: activeAlert === 2 ? "Airdrop King" : activeAlert === 1 ? "Wasted Legend" : "Pixel Miner",
        amount: calcAmount,
        sticker: stickerId,
        timestamp: new Date().toISOString()
      };
      setDemoDrops(prev => [newDrop, ...prev].slice(0, 5));
    }, 800);
  }, [alertVariants, activeAlert, calcAmount, goalTarget]);


  // --- Heartbeat Protocol ---
  useEffect(() => {
    const syncTimer = setInterval(() => setIsSynced(prev => !prev), 2000);

    // AUTO-DEMO HEARTBEAT: Triggers a "perfect" demo drop every 15 seconds
    const demoHeartbeat = setInterval(() => {
      triggerDemo();
    }, 15000);

    return () => {
      clearInterval(syncTimer);
      clearInterval(demoHeartbeat);
    };
  }, [triggerDemo]);

  const streamerCut = useMemo(() => (calcAmount * 0.95).toLocaleString('en-IN'), [calcAmount]);
  const platformFee = useMemo(() => (calcAmount * 0.05).toLocaleString('en-IN'), [calcAmount]);



  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    setMousePos({ x: (e.clientX / window.innerWidth) - 0.5, y: (e.clientY / window.innerHeight) - 0.5 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`min-h-screen font-sans selection:bg-[#10B981]/30 transition-colors duration-700 overflow-x-hidden ${theme} ${theme === 'dark' ? 'bg-[#050505] text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .nexus-feature-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .nexus-feature-card-dark {
          background: rgba(10, 10, 11, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .nexus-feature-card-light {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .nexus-amber-card:hover {
          border-color: #F59E0B;
          box-shadow: 0 0 30px rgba(245, 158, 11, 0.15);
        }

        .nexus-cyan-card:hover {
          border-color: #22D3EE;
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.15);
        }

        .nexus-indigo-card:hover {
          border-color: #818CF8;
          box-shadow: 0 0 30px rgba(129, 140, 248, 0.15);
        }

        .nexus-rose-card:hover {
          border-color: #FB7185;
          box-shadow: 0 0 30px rgba(251, 113, 133, 0.15);
        }

        .supernova-glow {
          box-shadow: 0 0 60px rgba(16, 185, 129, 0.6), 0 0 100px rgba(245, 158, 11, 0.4);
          border-color: #F59E0B !important;
        }

        .simulator-card-dark {
          background: linear-gradient(rgba(7, 13, 10, 0.95), rgba(7, 13, 10, 0.95)) padding-box,
                      conic-gradient(from var(--angle), #10B981, #3b82f6, #8b5cf6, #f59e0b, #10B981) border-box !important;
        }

        .simulator-card-light {
          background: linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)) padding-box,
                      conic-gradient(from var(--angle), #10B981, #3b82f6, #8b5cf6, #f59e0b, #10B981) border-box !important;
          backdrop-filter: blur(20px);
        }

        .gold-spark {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #F59E0B;
          border-radius: 50%;
          pointer-events: none;
        }

        .premium-footer-link {
          position: relative;
          color: #94a3b8;
          transition: color 0.3s ease;
        }

        .premium-footer-link:hover {
          color: #10B981;
        }

        .premium-footer-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -2px;
          left: 0;
          background: #10B981;
          transition: width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .premium-footer-link:hover::after {
          width: 100%;
        }

        .social-btn-premium {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .social-btn-premium:hover {
          transform: translateY(-4px) scale(1.1);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.1) !important;
          color: #10B981 !important;
        }

        @keyframes aurora-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes hero-glitch {
          0%, 90%, 100% { clip-path: none; transform: none; }
          91% { clip-path: inset(20% 0 60% 0); transform: translate(-3px, 0); }
          92% { clip-path: inset(60% 0 20% 0); transform: translate(3px, 0); }
          93% { clip-path: none; transform: none; }
          96% { clip-path: inset(40% 0 40% 0); transform: translate(2px, 0); }
          97% { clip-path: none; transform: none; }
        }

        .hero-title-main {
          position: relative;
          color: ${theme === 'dark' ? 'white' : '#0f172a'};
          filter: drop-shadow(0 0 15px rgba(16, 185, 129, ${theme === 'dark' ? '0.1' : '0.05'}));
        }

        .hero-title-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 30%,
            rgba(255, 255, 255, ${theme === 'dark' ? '0.2' : '0.4'}) 45%,
            rgba(255, 255, 255, ${theme === 'dark' ? '0.4' : '0.8'}) 50%,
            rgba(255, 255, 255, ${theme === 'dark' ? '0.2' : '0.4'}) 55%,
            transparent 70%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: title-shine 4s infinite linear;
        }

        .hero-shimmer-text {
          background: linear-gradient(
            to right,
            #818cf8, 
            #06b6d4, 
            #10B981, 
            #34d399,
            #818cf8
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: liquid-flow 5s linear infinite;
          filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.15));
        }

        @keyframes title-shine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes liquid-flow {
          to { background-position: 200% center; }
        }

        /* Opposite phase — starts midway through the same gradient cycle */
        .hero-shimmer-text-alt {
          background: linear-gradient(
            270deg,
            #10B981,
            #06b6d4,
            #818cf8,
            #f472b6,
            #34d399,
            #10B981
          );
          background-size: 400% 400%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: aurora-shift 6s ease infinite, hero-glitch 9s steps(1) infinite;
          animation-delay: -3s, -4.5s;
        }

        .hero-stroke-text {
          -webkit-text-stroke: 2px #10B981;
        }

        .hero-nexus-preview {
          display: grid;
          grid-template-columns: 70px 1fr;
          gap: 1rem;
          padding: 1.25rem;
          border-radius: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          align-items: stretch;
          min-height: 220px;
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

        .premium-nav-glass {
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
        }

        .nav-link-liquid {
          position: relative;
          padding: 0.5rem 0;
        }

        .nav-link-liquid::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: #10B981;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          transform: translateX(-50%);
          opacity: 0;
        }

        .nav-link-liquid:hover::after {
          width: 100%;
          opacity: 1;
        }

        .ticker-sheen {
          position: relative;
          overflow: hidden;
        }

        .ticker-sheen::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: skewX(-25deg);
          animation: sheen-swipe 8s infinite ease-in-out;
        }

        @keyframes sheen-swipe {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
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
      <nav className={`fixed top-0 left-0 right-0 z-[100] premium-nav-glass border-b transition-all duration-700 ${theme === 'dark'
        ? 'bg-black/40 border-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
        : 'bg-white/60 border-black/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.05)]'
        }`}>
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="relative">
              <Zap className="w-8 h-8 text-[#10B981] fill-[#10B981] group-hover:scale-110 transition-transform" />
              <Shield className="absolute -top-1 -right-1 w-4 h-4 text-emerald-500 opacity-50" />
            </div>
            <span className={`text-2xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Drop<span className="text-[#10B981]">Pay</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Features', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`nav-link-liquid text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-300 ${theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                {item}
              </a>
            ))}
            <button
              onClick={() => navigate('/login')}
              className={`text-[10px] font-black uppercase tracking-[0.3em] px-7 py-2.5 border rounded-full transition-all duration-300 ${theme === 'dark'
                ? 'border-white/10 text-white/80 hover:bg-white/5 hover:border-white/20'
                : 'border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                }`}
            >
              Login
            </button>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/signup')}
              className="text-[10px] font-black uppercase tracking-[0.3em] bg-[#10B981] text-white px-9 py-3.5 rounded-full shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.6)] transition-all flex items-center gap-2 group"
            >
              Join <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden relative z-[110] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </nav>

      {/* TICKER BELOW NAV */}
      <div className={`relative pt-[64px] md:pt-[72px] z-90 border-b ticker-sheen transition-all duration-700 ${theme === 'dark' ? 'bg-black/10 border-white/[0.02]' : 'bg-slate-100/30 border-black/[0.02]'
        }`}>
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
              className={`fixed top-0 right-0 h-full w-[85vw] max-w-[340px] z-[105] flex flex-col overflow-hidden border-l transition-colors duration-500 ${theme === 'dark'
                ? 'bg-gradient-to-br from-[#07140e]/98 to-[#05050a]/99 border-[#10B981]/15'
                : 'bg-white border-slate-200'
                }`}
            >
              {/* Inner glow */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-[#10B981]/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-20 left-0 w-40 h-40 bg-blue-500/6 blur-[60px] rounded-full pointer-events-none" />

              {/* Header row */}
              <div className={`flex items-center justify-between px-7 pt-8 pb-6 border-b ${theme === 'dark' ? 'border-white/[0.06]' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-[#10B981] fill-[#10B981]" />
                  <span className={`font-black italic tracking-tighter text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Drop<span className="text-[#10B981]">Pay</span>
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Nav links */}
              <div className="flex flex-col gap-1 px-4 pt-6 flex-1">
                {[
                  { label: 'Features', href: '#features' },
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
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${theme === 'dark' ? 'text-white/80 hover:text-white hover:bg-white/[0.04]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
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
                  className={`w-full py-4 rounded-2xl border font-black uppercase italic text-sm tracking-widest transition-all ${theme === 'dark' ? 'border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]' : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'
                    }`}
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
        <motion.div
          animate={{ x: -mousePos.x * 40, y: -mousePos.y * 40 }}
          className={`absolute top-[10%] right-[-5%] w-[40%] h-[40%] rounded-full transition-all duration-1000 delay-100 ${theme === 'dark' ? 'bg-indigo-500/10 blur-[140px]' : 'bg-indigo-500/5 blur-[100px]'
            }`}
        />
        <motion.div
          animate={{ x: mousePos.x * 30, y: -mousePos.y * 50 }}
          className={`absolute bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full transition-all duration-1000 delay-200 ${theme === 'dark' ? 'bg-violet-500/10 blur-[160px]' : 'bg-violet-500/5 blur-[120px]'
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
      <section className="relative pt-10 pb-32 px-6 overflow-hidden">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-6 md:mb-8 border ${theme === 'dark' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-emerald-50 text-emerald-600'}`}>
              <Globe className={`w-3 h-3 ${isSynced ? 'opacity-100 scale-125' : 'opacity-30 scale-100'} transition-all duration-700`} /> Node Sync Active
            </div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-8"
            >
              <motion.span
                initial={{ opacity: 0, y: 40, skewY: 3 }}
                animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="block text-3xl md:text-6xl leading-tight hero-title-main"
                style={{ letterSpacing: '-0.02em' }}
              >
                Monetize
                <span className="hero-title-shine">Monetize</span>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="block text-5xl md:text-8xl hero-shimmer-text leading-[0.9]"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 900,
                  letterSpacing: '-0.04em'
                }}
              >
                Influence.
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
              className="text-slate-500 text-base md:text-lg font-medium max-w-xl mb-10 md:mb-12 italic leading-relaxed"
            >
              Instant bank settlements. Built for professional creators.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 relative mb-12">
              <button onClick={() => navigate('/signup')} className="w-full sm:w-auto bg-[#10B981] text-white px-10 py-5 rounded-2xl font-black uppercase italic text-sm shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                <Play className="w-4 h-4 fill-white" /> Start Hub
              </button>

              <div className="relative group w-full sm:w-auto">
                <button
                  onClick={triggerDemo}
                  className={`w-full sm:w-auto px-10 py-5 rounded-2xl font-black uppercase italic text-sm transition-all flex items-center justify-center gap-3 active:scale-95 border ${theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-100 shadow-sm'
                    }`}
                >
                  <Sparkles className="w-4 h-4 text-[#10B981]" /> Inject Demo
                </button>
              </div>
            </div>

            {/* VALUE PROPS - Fills empty space */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-white/5"
            >
              {[
                { icon: Zap, label: "Sub-ms Latency", desc: "Edge-node delivery" },
                { icon: Shield, label: "0% Chargebacks", desc: "Razorpay Protected" },
                { icon: Landmark, label: "T+2 Payouts", desc: "Automated settlements" }
              ].map((prop, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <prop.icon className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className={`text-[11px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/80' : 'text-slate-900/80'}`}>{prop.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium italic">{prop.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="lg:col-span-6 relative mt-12 lg:mt-0">
            {/* MINI-NEXUS PREVIEW — placed directly on the page */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className={`relative min-h-[420px] md:min-h-[480px] flex flex-col overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border ${theme === 'dark' ? 'bg-white/[0.03] border-white/[0.08] backdrop-blur-xl' : 'bg-white/60 border-white/70 backdrop-blur-xl shadow-xl'}`}
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
                    <p className={`text-[12px] font-black italic tracking-tighter leading-none truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}></p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#10B981] mt-0.5">Verified Pro</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#10B981] shrink-0 animate-pulse" />
                </div>

                {/* Mini-Nexus grid — sidebar + alert area */}
                <div
                  className="flex-1 rounded-2xl"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '70px 1fr',
                    gap: '1rem',
                    padding: '1.25rem',
                    borderRadius: '1.5rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    alignItems: 'stretch',
                    minHeight: '220px',
                  }}
                >

                  {/* Left: Top Fans sidebar */}
                  <div className="flex flex-col gap-3 pt-1">
                    <p className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Top Fans</p>
                    {[
                      { rank: 1, color: '#F59E0B' },
                      { rank: 2, color: '#94A3B8' },
                      { rank: 3, color: '#CD7F32' },
                    ].map(({ rank, color }) => (
                      <div key={rank} className="flex items-center">
                        <span style={{ color, fontSize: '9px', fontWeight: 900 }}>#{rank}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right: Alert preview area */}
                  <div className="flex flex-col gap-2 min-w-0 h-full">
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
                            stylePreference={alertVariants[activeAlert]}
                            donorName={activeAlert === 2 ? 'Apex Shooter' : activeAlert === 1 ? 'Street Legend' : 'Retro Gamer'}
                            amount={calcAmount}
                            message={
                              activeAlert === 2 ? "Airdrop secured! 🪂" :
                                activeAlert === 1 ? "Respect +100 verified!" :
                                  "Pixel loot collected! 🪙"
                            }
                            theme={theme}
                            sticker={
                              activeAlert === 2 ? 'fire_rocket' :
                                activeAlert === 1 ? 'diamond_gem' :
                                  'coins'
                            }
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
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="mb-8 md:mb-10">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">Elite <span className="text-[#10B981]">Nexus.</span></h2>
            <p className="text-slate-500 font-medium italic text-xs md:text-sm max-w-2xl leading-relaxed">Refined architecture for high-concurrency streaming nodes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* 1. STOREFRONT NEXUS */}
            <motion.div
              whileHover={{ y: -4 }}
              className={`nexus-feature-card rounded-2xl p-6 lg:p-8 relative overflow-hidden group cursor-default nexus-cyan-card ${theme === 'dark' ? 'nexus-feature-card-dark' : 'nexus-feature-card-light'
                }`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Layout className="w-20 h-20 text-cyan-400" />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-4 text-cyan-400 border border-cyan-400/20">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Storefront Nexus.</h3>
                <p className="text-slate-500 font-medium italic text-sm max-w-sm mb-4 lead-relaxed">
                  Identity-first architecture with custom sidebars and sub-ms responsiveness across all device nodes.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <div className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-black uppercase tracking-widest text-cyan-400">Mobile Optimized</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity-First</div>
                </div>
              </div>
            </motion.div>

            {/* 2. THEME CONTROL HUB */}
            <motion.div
              whileHover={{ y: -4 }}
              className={`nexus-feature-card rounded-2xl p-6 lg:p-8 relative overflow-hidden group cursor-default nexus-indigo-card ${theme === 'dark' ? 'nexus-feature-card-dark' : 'nexus-feature-card-light'
                }`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wand2 className="w-20 h-20 text-indigo-400" />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-indigo-400/10 flex items-center justify-center mb-4 text-indigo-400 border border-indigo-400/20">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Theme Control.</h3>
                <p className="text-slate-500 font-medium italic text-sm max-w-sm mb-4 lead-relaxed">
                  Deploy Nebula, Aero, and Midnight Obsidian styles with real-time hover-glow and glassmorphism.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <div className="px-3 py-1 rounded-full bg-indigo-400/10 border border-indigo-400/20 text-[10px] font-black uppercase tracking-widest text-indigo-400">Super-High UHD</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">Live Inject</div>
                </div>
              </div>
            </motion.div>

            {/* 3. BROADCAST TICKER */}
            <motion.div
              whileHover={{ y: -4 }}
              className={`nexus-feature-card rounded-2xl p-6 lg:p-8 relative overflow-hidden group cursor-default nexus-rose-card ${theme === 'dark' ? 'nexus-feature-card-dark' : 'nexus-feature-card-light'
                }`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Radio className="w-20 h-20 text-rose-400" />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-rose-400/10 flex items-center justify-center mb-4 text-rose-400 border border-rose-400/20">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Broadcast Ticker.</h3>
                <p className="text-slate-500 font-medium italic text-sm max-w-sm mb-4 lead-relaxed">
                  Professional non-repeating Lottie sticker feed. Single-pass logic for zero-clutter transmission.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <div className="px-3 py-1 rounded-full bg-rose-400/10 border border-rose-400/20 text-[10px] font-black uppercase tracking-widest text-rose-400">Lottie Native</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">No Buffering</div>
                </div>
              </div>
            </motion.div>

            {/* 4. MISSION DYNAMICS */}
            <motion.div
              whileHover={{ y: -4 }}
              className={`nexus-feature-card rounded-2xl p-6 lg:p-8 relative overflow-hidden group cursor-default nexus-amber-card ${theme === 'dark' ? 'nexus-feature-card-dark' : 'nexus-feature-card-light'
                }`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy className="w-20 h-20 text-amber-500" />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 text-amber-500 border border-amber-500/20">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Mission Dynamics.</h3>
                <p className="text-slate-500 font-medium italic text-sm max-w-sm mb-4 lead-relaxed">
                  Interactive goal bars with supernova celebration effects. Real-time funding updates.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest text-amber-500">Auto Celebration</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">Supernova Inject</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- PROTOCOL NODES (TABBED SECTION) --- */}
      <section id="features" className="pt-2 pb-4 md:pt-4 md:pb-20 px-6 max-w-[1280px] mx-auto w-full">
        <motion.div
          className="mb-20 md:mb-0"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center mb-10 px-0 md:px-6">
            <h2 className={`text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Protocol Architecture</h2>
            <div className={`p-1.5 md:p-2 rounded-2xl flex flex-wrap justify-center md:flex-nowrap border ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-white shadow-md border-slate-100'}`}>
              {[
                { id: 'streamers', label: 'Engine', icon: <Cpu className="w-4 h-4" /> },
                { id: 'developers', label: 'Nodes', icon: <Monitor className="w-4 h-4" /> },
                { id: 'community', label: 'Social', icon: <Heart className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 md:px-8 py-2.5 md:py-3 rounded-xl font-black uppercase italic text-[9px] md:text-[10px] tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id
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
              className="py-0"
            >
              {activeTab === 'streamers' && (
                <div className="relative overflow-hidden rounded-[3rem] p-8 md:p-16 border transition-all duration-700 bg-opacity-20 backdrop-blur-3xl group">
                  {/* Internal Glow Orbs */}
                  <motion.div
                    animate={{
                      x: [0, 25, 0],
                      y: [0, -25, 0],
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -right-20 w-64 h-64 bg-[#10B981]/10 blur-[80px] rounded-full pointer-events-none"
                  />

                  <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6 md:space-y-8"
                    >
                      <div className="inline-flex items-center gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] font-black uppercase text-[9px] md:text-[10px] tracking-widest">
                        <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Yield Optimization
                      </div>
                      <h3 className={`text-3xl md:text-6xl font-black italic uppercase leading-[1] md:leading-[0.9] tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Maximize <br /> <span className="text-[#10B981]">Every Drop</span>
                      </h3>
                      <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed max-w-md">
                        Our proprietary Razorpay Route integration ensures your revenue clears T+2 settlements with zero manual intervention.
                      </p>
                      <div className="flex gap-4 md:gap-6 items-center pt-2">
                        <div className="p-2.5 md:p-3 rounded-2xl bg-white/5 border border-white/10">
                          <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                        </div>
                        <div className="p-2.5 md:p-3 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/30">
                          <Monitor className="w-5 h-5 md:w-6 md:h-6 text-[#10B981]" />
                        </div>
                        <div className="p-2.5 md:p-3 rounded-2xl bg-white/5 border border-white/10">
                          <PlaySquare className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative p-8 rounded-[2rem] border overflow-hidden transition-all duration-500 shadow-2xl ${theme === 'dark' ? 'border-white/10 bg-black/40 shadow-[0_0_50px_rgba(16,185,129,0.1)]' : 'border-slate-200 bg-white shadow-emerald-500/10'}`}
                    >
                      <div className="relative z-10 space-y-6">
                        {/* Header & Status */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#10B981]/10 rounded-xl text-[#10B981] border border-[#10B981]/20">
                              <Landmark className="w-5 h-5" />
                            </div>
                            <span className={`text-sm font-black italic uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Payout Simulator</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-[#10B981]">Live Node</span>
                          </div>
                        </div>

                        {/* Input Area */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                              <Banknote className="w-3.5 h-3.5 text-[#10B981]" /> Donation Amount (INR)
                            </label>
                            <div className="flex gap-1.5">
                              {[1000, 10000, 50000].map(preset => (
                                <button
                                  key={preset}
                                  onClick={() => setCalcAmount(preset)}
                                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase transition-all border ${calcAmount === preset ? 'bg-[#10B981] text-white border-[#10B981]' : 'bg-white/5 border-white/10 text-slate-400'}`}
                                >
                                  ₹{preset / 1000}K
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              value={calcAmount}
                              onChange={e => setCalcAmount(Number(e.target.value))}
                              className={`w-full border rounded-xl px-4 py-3 text-3xl font-black italic outline-none transition-all focus:border-[#10B981] ${theme === 'dark' ? 'bg-black/50 border-white/10 text-[#10B981]' : 'bg-slate-50 border-slate-200 text-[#10B981]'}`}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black italic opacity-20">INR</span>
                          </div>
                        </div>

                        {/* Results Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#10B981]/5 border-[#10B981]/20' : 'bg-emerald-50 border-emerald-100'}`}>
                            <p className="text-[8px] font-black uppercase tracking-widest text-[#10B981] mb-1">Your Split (95%)</p>
                            <p className={`text-xl font-black italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{streamerCut}</p>
                          </div>
                          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Node Fee (5%)</p>
                            <p className="text-xl font-black italic text-slate-400">₹{platformFee}</p>
                          </div>
                        </div>

                        {/* Split Bar */}
                        <div className="space-y-1.5">
                          <div className={`h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '95%' }}
                              className="h-full bg-gradient-to-r from-emerald-500 to-[#10B981]"
                            />
                          </div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 text-center">Settlement protocol: Razorpay Route T+2</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
              {activeTab === 'developers' && (
                <div className="relative overflow-hidden rounded-[3rem] p-8 md:p-16 border transition-all duration-700 bg-opacity-20 backdrop-blur-3xl group">
                  {/* Internal Glow Orbs */}
                  <motion.div
                    animate={{
                      x: [0, -25, 0],
                      y: [0, 25, 0],
                    }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"
                  />

                  <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`order-2 md:order-1 relative group aspect-video rounded-2xl border overflow-hidden flex flex-col shadow-2xl ${theme === 'dark' ? 'border-white/10 bg-[#0d0d0d]' : 'border-slate-200 bg-[#1e1e1e]'}`}
                    >
                      {/* IDE HEADER */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">drop_nexus_protocol.json</div>
                        <div className="w-10" />
                      </div>

                      <div className="flex-1 p-6 font-mono text-xs leading-relaxed">
                        <div className="flex gap-4">
                          <span className="text-slate-600 select-none">01</span>
                          <span className="text-blue-400">{"{"}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-slate-600 select-none">02</span>
                          <span className="pl-4 text-slate-300">"node"</span>: <span className="text-emerald-400">"drop_nexus_04"</span>,
                        </div>
                        <div className="flex gap-4">
                          <span className="text-slate-600 select-none">03</span>
                          <span className="pl-4 text-slate-300">"status"</span>: <span className="text-emerald-400">"synchronized"</span>,
                        </div>
                        <div className="flex gap-4">
                          <span className="text-slate-600 select-none">04</span>
                          <span className="pl-4 text-slate-300">"latency"</span>: <span className="text-emerald-400">"0.4ms"</span>,
                        </div>
                        <div className="flex gap-4">
                          <span className="text-slate-600 select-none">05</span>
                          <span className="pl-4 text-slate-300">"protocol"</span>: <span className="text-emerald-400">"TCP/HYPER"</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-slate-600 select-none">06</span>
                          <span className="text-blue-400">{"}"}</span>
                        </div>
                        <motion.div
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-4 bg-[#10B981] ml-8 mt-2"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="order-1 md:order-2 space-y-8"
                    >
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black uppercase text-[10px] tracking-widest">
                        <Shield className="w-4 h-4" /> Secure Architecture
                      </div>
                      <h3 className={`text-4xl md:text-6xl font-black italic uppercase leading-[0.9] tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        API First <br /> <span className="text-blue-400">Mentality</span>
                      </h3>
                      <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
                        Websocket clusters with automatic failover. Your alerts never go offline, even under extreme concurrent loads.
                      </p>
                      <div className="flex gap-8">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Verified</span>
                          </div>
                          <div className="h-1 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 1.5, delay: 0.5 }}
                              className="h-full bg-emerald-500"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                              <CheckCircle2 className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Encrypted</span>
                          </div>
                          <div className="h-1 w-full bg-blue-500/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 1.5, delay: 0.7 }}
                              className="h-full bg-blue-400"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
              {activeTab === 'community' && (
                <div className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 text-center max-w-3xl mx-auto border transition-all duration-700 bg-opacity-20 backdrop-blur-3xl group">
                  {/* Internal Glow Orbs */}
                  <motion.div
                    animate={{
                      x: [0, 30, 0],
                      y: [0, -30, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -right-20 w-48 h-48 bg-[#10B981]/10 blur-[60px] rounded-full pointer-events-none"
                  />
                  <motion.div
                    animate={{
                      x: [0, -40, 0],
                      y: [0, 40, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-20 -left-20 w-56 h-56 bg-indigo-500/10 blur-[70px] rounded-full pointer-events-none"
                  />

                  <div className="relative z-10 space-y-10">
                    <div className="flex justify-center -space-x-3">
                      {[
                        getOptimizedImage('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'),
                        getOptimizedImage('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'),
                        getOptimizedImage('https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop')
                      ].map((src, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.1, zIndex: 20 }}
                          className="w-12 h-12 rounded-full border-2 border-[#10B981]/30 overflow-hidden shadow-xl"
                        >
                          <img src={src} alt="Top Contributor" className="w-full h-full object-cover" />
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10B981] to-emerald-400 p-0.5 shadow-xl shadow-emerald-500/20"
                      >
                        <div className={`w-full h-full rounded-[0.9rem] flex items-center justify-center ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                          <Heart className="w-7 h-7 text-[#10B981] fill-[#10B981]/20" />
                        </div>
                      </motion.div>
                    </div>

                    <div className="space-y-3">
                      <h3 className={`text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-blue-500">Collective</span>
                      </h3>
                      <p className="text-slate-500 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                        Connect with 5,000+ top-tier creators in our encrypted Discord node. Share premium assets and hyper-growth strategies.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 bg-[#10B981] hover:bg-emerald-400 text-white rounded-xl font-black uppercase italic tracking-widest text-xs flex items-center gap-2.5 shadow-xl shadow-emerald-500/30 transition-all"
                      >
                        <Zap className="w-4 h-4 fill-white" /> Connect Node
                      </motion.button>

                      <div className="flex gap-5 items-center px-6 py-3.5 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
                        {[
                          { icon: <Twitter className="w-4 h-4" />, label: 'Twitter' },
                          { icon: <Github className="w-4 h-4" />, label: 'Github' },
                          { icon: <Linkedin className="w-4 h-4" />, label: 'Linkedin' }
                        ].map(({ icon, label }) => (
                          <motion.button
                            key={label}
                            whileHover={{ scale: 1.2, color: '#10B981' }}
                            className="text-slate-400 transition-colors"
                          >
                            {icon}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap justify-center gap-x-10 gap-y-3 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <span className="text-[8px] font-black uppercase tracking-widest">Enterprise Encrypted</span>
                      <span className="text-[8px] font-black uppercase tracking-widest">24/7 Node Support</span>
                      <span className="text-[8px] font-black uppercase tracking-widest">Global Mesh Access</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Removed Generic Grid */}
      </section>



      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-16 md:py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
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

                <div className={`flex-1 rounded-xl p-3 mx-4 hidden lg:block ${theme === 'dark' ? 'bg-black/10' : 'bg-slate-50'}`}>
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

                <div className={`flex-1 rounded-xl p-3 mx-4 hidden lg:block ${theme === 'dark' ? 'bg-black/10' : 'bg-[#10B981]/5'}`}>
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

                <div className={`flex-1 rounded-xl p-3 mx-4 hidden lg:block ${theme === 'dark' ? 'bg-black/10' : 'bg-amber-500/5'}`}>
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
        <div className="max-w-[1280px] mx-auto">
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


      {/* --- WORLD-CLASS PREMIUM FOOTER --- */}
      <footer className={`relative border-t overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'border-white/[0.06] bg-[#050505]' : 'border-slate-100 bg-white'}`}>

        {/* Glow Orbs — Glassmorphism background */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#10B981]/[0.03] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/[0.02] blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-6 pt-20 pb-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">

            {/* BRAND & MISSION HUB */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="md:col-span-4 space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-[#10B981] fill-[#10B981]" />
                  </div>
                  <span className={`text-2xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Drop<span className="text-[#10B981]">Pay</span>
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">
                  The professional-grade monetisation engine for creators, streamers, and live broadcasters. Built for high-frequency nodes and zero-latency transmission.
                </p>
              </div>

              {/* Social Grid */}
              <div className="flex gap-3">
                {[
                  { icon: <Twitter className="w-4 h-4" />, label: 'Twitter' },
                  { icon: <Instagram className="w-4 h-4" />, label: 'Instagram' },
                  { icon: <Github className="w-4 h-4" />, label: 'GitHub' },
                  { icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn' },
                  { icon: <Mail className="w-4 h-4" />, label: 'Email' }
                ].map(({ icon, label }) => (
                  <button key={label} aria-label={label}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center social-btn-premium border ${theme === 'dark' ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    {icon}
                  </button>
                ))}
              </div>

              {/* Status Indicator */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-[#10B981]/5 border-[#10B981]/20 text-[#10B981]' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                </span>
                All Systems Operational
              </motion.div>
            </motion.div>

            {/* NAVIGATION LINKS GRID */}
            <div className="md:col-span-5 grid grid-cols-3 gap-x-4 gap-y-10 sm:gap-8">
              {/* Product */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="space-y-6">
                <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Product</p>
                <div className="flex flex-col gap-4">
                  {['Features', 'Pricing', 'Dashboard', 'Overlays', 'Alert Engine', 'Simulator'].map(item => (
                    <button key={item} className="premium-footer-link text-sm font-medium text-left w-fit">{item}</button>
                  ))}
                </div>
              </motion.div>

              {/* Platform */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="space-y-6">
                <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Platform</p>
                <div className="flex flex-col gap-4">
                  {['Pricing', 'Changelog', 'Status', 'API Docs', 'Community', 'Open Source'].map(item => (
                    <button key={item} className="premium-footer-link text-sm font-medium text-left w-fit">{item}</button>
                  ))}
                </div>
              </motion.div>

              {/* Company */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="space-y-6">
                <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Company</p>
                <div className="flex flex-col gap-4">
                  {['About', 'Blog', 'Careers', 'Press Kit', 'Contact', 'Security'].map(item => (
                    <button key={item} className="premium-footer-link text-sm font-medium text-left w-fit">{item}</button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* NEWSLETTER HUB */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="md:col-span-3 space-y-6"
            >
              <div className="space-y-2">
                <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Stay Synced</p>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  Join 5,000+ creators getting weekly node updates.
                </p>
              </div>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter email node..."
                  className={`w-full px-5 py-4 rounded-2xl text-xs font-bold outline-none border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 focus:border-[#10B981]/50 text-white' : 'bg-slate-50 border-slate-200 focus:border-[#10B981]/50 text-slate-900'}`}
                />
                <button className="absolute right-2 top-2 bottom-2 px-4 bg-[#10B981] hover:bg-emerald-400 text-white rounded-xl transition-all group-hover:scale-105 active:scale-95 shadow-lg shadow-[#10B981]/20">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-slate-600 font-medium italic">
                By syncing, you agree to our encrypted protocol terms.
              </p>
            </motion.div>
          </div>

          {/* GRADIENT DIVIDER */}
          <div className={`h-px w-full my-12 bg-gradient-to-r from-transparent ${theme === 'dark' ? 'via-white/5' : 'via-slate-200'} to-transparent`} />

          {/* BOTTOM BAR */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <p className="text-slate-600 text-[11px] font-bold tracking-tight">
                © 2026 DROPPAY TECHNOLOGIES. ALL RIGHTS RESERVED.
              </p>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] text-slate-600 font-black uppercase tracking-widest">
                BUILT IN INDIA 🇮🇳
              </div>
            </div>
            <div className="flex items-center gap-8">
              {['Privacy', 'Terms', 'Refunds'].map(item => (
                <button key={item} className="premium-footer-link text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap">
                  {item}
                </button>
              ))}
            </div>
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
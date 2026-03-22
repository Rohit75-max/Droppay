import React, { useState, useMemo, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Zap, ChevronRight,
  Play, Wand2, Sparkles, Trophy, Globe, Layers, Cpu, Radio,
  ArrowRight, Menu, X, Banknote, Landmark, Rocket,
  Instagram, Twitter, Target, CheckCircle2, Monitor, Smartphone, PlaySquare, Heart, Github, Linkedin, Layout, User, Shield, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// NOTE: react-toastify CSS is already imported in App.js — do NOT import again here
import SocketModal from '../components/SocketModal';
import { getOptimizedImage } from '../protocol/cdnHelper';
import DonationTicker from '../components/widgets/DonationTicker';

import { Player } from '@lottiefiles/react-lottie-player';

// --- Lazy-loaded heavy components (deferred ~74KB from initial bundle) ---
const AlertPreview = lazy(() => import('../components/AlertPreview'));

const premiumFeaturesData = [
  {
    id: "storefronts",
    title: "Custom Storefronts.",
    desc: "Showcase your brand with stunning custom profiles and lightning-fast checkout experiences across all devices.",
    tags: ["Mobile Optimized", "Brand-First"],
    accent: "#22d3ee",
    accentRgb: "34,211,238",
    iconBgClass: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
    bgIconClass: "text-cyan-400",
    tag1Class: "bg-cyan-400/10 border-cyan-400/20 text-cyan-400",
    stat: "12K+",
    statLabel: "Active Stores",
    Icon: Monitor,
    BgIcon: Layout,
  },
  {
    id: "themes",
    title: "Dynamic Themes.",
    desc: "Immerse your supporters in breathtaking visual experiences with our premium, fully interactive dynamic themes.",
    tags: ["4K Assets", "Live Previews"],
    accent: "#a78bfa",
    accentRgb: "167,139,250",
    iconBgClass: "bg-violet-400/10 text-violet-400 border-violet-400/20",
    bgIconClass: "text-violet-400",
    tag1Class: "bg-violet-400/10 border-violet-400/20 text-violet-400",
    stat: "50+",
    statLabel: "Premium Templates",
    Icon: Layers,
    BgIcon: Wand2,
  },
  {
    id: "ticker",
    title: "Donation Ticker.",
    desc: "Keep your broadcast clean and engaging with ultra-smooth, non-repetitive high-fidelity fan alerts.",
    tags: ["Smooth Animations", "Zero Lag"],
    accent: "#fb7185",
    accentRgb: "251,113,133",
    iconBgClass: "bg-rose-400/10 text-rose-400 border-rose-400/20",
    bgIconClass: "text-rose-400",
    tag1Class: "bg-rose-400/10 border-rose-400/20 text-rose-400",
    stat: "99.9%",
    statLabel: "Uptime SLA",
    Icon: Radio,
    BgIcon: Radio,
  },
  {
    id: "targets",
    title: "Engagement Targets.",
    desc: "Drive massive audience engagement with visually explosive, real-time interactive funding goals.",
    tags: ["Instant Alerts", "Goal Tracking"],
    accent: "#fbbf24",
    accentRgb: "251,191,36",
    iconBgClass: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    bgIconClass: "text-amber-400",
    tag1Class: "bg-amber-400/10 border-amber-400/20 text-amber-400",
    stat: "2.4M",
    statLabel: "Goals Completed",
    Icon: Target,
    BgIcon: Trophy,
  }
];

const PremiumFeatureCard = ({ feat, index }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-2xl p-5 lg:p-6 flex flex-col overflow-hidden cursor-default group"
      style={{
        background: isHovered
          ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(${feat.accentRgb},0.15) 0%, #0C1014 60%, #0C1014 100%)`
          : '#0C1014',
        border: `1px solid ${isHovered ? `rgba(${feat.accentRgb},0.35)` : 'rgba(255,255,255,0.08)'}`,
        boxShadow: isHovered ? `0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(${feat.accentRgb},0.1)` : '0 10px 25px rgba(0,0,0,0.2)',
        transition: 'background 0.05s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Noise grain overlay for premium texture */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '128px 128px' }} />

      {/* Stat badge top-right */}
      <div className="absolute top-4 right-4 text-right">
        <div className="text-lg font-black italic" style={{ color: feat.accent }}>{feat.stat}</div>
        <div className="text-[8px] font-black uppercase tracking-widest text-white/30">{feat.statLabel}</div>
      </div>

      {/* Bg watermark icon */}
      <div className="absolute bottom-0 right-0 p-3 opacity-[0.06] pointer-events-none">
        <feat.BgIcon className="w-20 h-20" style={{ color: feat.accent }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full">
        <motion.div
          animate={isHovered ? { y: -4, scale: 1.08 } : { y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 border shrink-0 ${feat.iconBgClass}`}
          style={{ boxShadow: isHovered ? `0 8px 24px rgba(${feat.accentRgb},0.4)` : 'none' }}
        >
          <feat.Icon className="w-5 h-5" />
        </motion.div>

        <h3 className="text-lg lg:text-xl font-black italic uppercase tracking-tighter mb-2 text-white">
          {feat.title}
        </h3>
        <p className="text-white/40 font-medium text-xs mb-5 leading-relaxed line-clamp-3">
          {feat.desc}
        </p>

        <div className="flex gap-1.5 flex-col items-start mt-auto pointer-events-none">
          <div className={`px-2 lg:px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${feat.tag1Class}`}>{feat.tags[0]}</div>
          <div className="px-2 lg:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/30">{feat.tags[1]}</div>
        </div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        animate={{ scaleX: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
        style={{ background: `linear-gradient(90deg, transparent, ${feat.accent}, transparent)` }}
      />
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });


  // --- UNIFIED GLOBAL THEME PROTOCOL (now from ThemeContext) ---
  const theme = 'dark';


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('streamers');
  const [activeAlert, setActiveAlert] = useState(0);
  const [isSynced, setIsSynced] = useState(true);
  const [pricingCard, setPricingCard] = useState(1); // 0=starter,1=pro,2=legend
  const [pricingDir, setPricingDir] = useState(0);  // slide direction

  // --- KINETIC FLIGHT STATES ---
  const [showPreview] = useState(true);
  const [isFlying, setIsFlying] = useState(false);

  // --- NEWSLETTER STATE ---
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const resp = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await resp.json();
      if (resp.ok) {
        toast.success(data.msg || "Uplink Established!");
        setEmail('');
      } else {
        toast.error(data.msg || "Sync Failed.");
      }
    } catch (err) {
      toast.error("Transmission Failure.");
    } finally {
      setSubscribing(false);
    }
  };

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
    }, 600); // Reduced delay since animation string is shorter
  }, [alertVariants, activeAlert, calcAmount, goalTarget]);


  // --- Heartbeat Protocol (reduced from 2s to 3.5s to ease main thread) ---
  useEffect(() => {
    const syncTimer = setInterval(() => setIsSynced(prev => !prev), 3500);

    return () => {
      clearInterval(syncTimer);
    };
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
      className={`min-h-screen font-sans selection:bg-[#10B981]/30 transition-all duration-700 overflow-x-hidden relative ${theme} ${theme === 'dark' ? 'bg-[#020403] text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
    >
      {/* Immersive Moving Background */}
      <div className="ambient-background fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`ambient-orb w-[600px] h-[600px] bg-[#10B981] ${theme === 'dark' ? 'opacity-[0.08]' : 'opacity-[0.12]'} -top-[10%] -left-[10%]`} style={{ animationDelay: '0s' }} />
        <div className={`ambient-orb w-[500px] h-[500px] bg-[#3b82f6] ${theme === 'dark' ? 'opacity-[0.05]' : 'opacity-[0.1]'} top-[20%] -right-[5%]`} style={{ animationDelay: '-5s' }} />
        <div className={`ambient-orb w-[700px] h-[700px] bg-[#8b5cf6] ${theme === 'dark' ? 'opacity-[0.03]' : 'opacity-[0.05]'} bottom-[-10%] left-[20%]`} style={{ animationDelay: '-10s' }} />
        <div className={`ambient-orb w-[400px] h-[400px] bg-[#f59e0b] ${theme === 'dark' ? 'opacity-[0.04]' : 'opacity-[0.1]'} top-[60%] left-[-10%]`} style={{ animationDelay: '-15s' }} />
      </div>
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


        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(10px, -15px); }
          66% { transform: translate(-15px, 10px); }
        }

        .glass-orb {
          position: absolute;
          filter: blur(40px);
          opacity: 0.15;
          pointer-events: none;
          z-index: 1;
          animation: float-orb 15s ease-in-out infinite;
        }

        @keyframes ambient-drift {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 40px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .ambient-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          opacity: 0.4;
        }

        .ambient-orb {
          position: absolute;
          filter: blur(140px);
          border-radius: 50%;
          animation: ambient-drift 25s ease-in-out infinite;
        }

        @media (max-width: 1024px) {
          .ambient-orb {
            animation: none;
            filter: blur(80px);
          }
        }

        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes rotate {
          to { --angle: 360deg; }
        }

        .holo-border {
          --angle: 0deg;
          background: linear-gradient(var(--theme-bg, #0a0a0b), var(--theme-bg, #0a0a0b)) padding-box,
                      conic-gradient(from var(--angle), #10B981, #22d3ee, #818cf8, #fb7185, #10B981) border-box !important;
          border: 2px solid transparent !important;
          animation: rotate 4s linear infinite;
        }

        .simulator-card-premium {
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
        }

        .simulator-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px -12px rgba(16, 185, 129, 0.25);
        }

        .input-glow:focus-within {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
          border-color: #10B981 !important;
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
        {/* THIN SCROLL PROGRESS LINE */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-[#10B981] origin-left z-[110]"
          style={{ scaleX }}
        />

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

          <div className="flex items-center gap-3 md:hidden">

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`relative z-[110] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
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
                    <p className="text-[9px] text-slate-300 font-medium mt-0.5">99.9% Uptime — Live</p>
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
                scale: [0, 1.2, 1.2, 0], // Reduced max scale from 1.8 to 1.2
                top: ["45%", "25%", "80%"],
                rotate: [-45, 90, 180]
              }}
              transition={{ duration: 0.6, times: [0, 0.4, 1], ease: "easeInOut" }} // Reduced duration 0.8 -> 0.6
              className="fixed z-[300] pointer-events-none md:hidden flex flex-col items-center justify-center transform-gpu"
            >
              <div className="relative">
                {/* Smaller container */}
                <div className="w-12 h-12 drop-shadow-[0_10px_20px_rgba(16,185,129,0.5)] relative z-10">
                  <Player autoplay loop src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json" style={{ height: '100%', width: '100%', transform: 'scale(1.1)' }} />
                </div>
                {/* Engine Thrust - scaled down */}
                <motion.div
                  animate={{ height: ["0px", "60px", "0px"], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, times: [0, 0.4, 1] }}
                  className="absolute top-[80%] left-1/2 -translate-x-1/2 w-6 bg-gradient-to-b from-orange-400 via-red-500 to-transparent blur-md rounded-full origin-top z-0"
                />
                <motion.div
                  animate={{ height: ["0px", "35px", "0px"], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, times: [0, 0.4, 1] }}
                  className="absolute top-[80%] left-1/2 -translate-x-1/2 w-2 bg-gradient-to-b from-yellow-100 via-yellow-300 to-transparent blur-[2px] rounded-full origin-top z-10"
                />
              </div>
            </motion.div>

            {/* DESKTOP ARC */}
            <motion.div
              initial={{ scale: 0, top: "60%", left: "25%", x: "-50%", y: "-50%", rotate: 0 }}
              animate={{
                scale: [0, 1.3, 1.3, 0], // Reduced from 2.0 to 1.3
                top: ["60%", "30%", "50%"],
                left: ["25%", "50%", "75%"],
                rotate: [0, 45, 90]
              }}
              transition={{ duration: 0.6, times: [0, 0.4, 1], ease: "easeInOut" }} // Reduced duration
              className="fixed z-[300] pointer-events-none hidden md:flex flex-col items-center justify-center transform-gpu"
            >
              <div className="relative">
                {/* Speed rings / Shockwaves - scaled and sped up */}
                <motion.div
                  animate={{ scale: [0.5, 1.2], opacity: [0.3, 0] }}
                  transition={{ duration: 0.3, repeat: 2, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 border-2 border-cyan-400 rounded-full z-0"
                />
                <motion.div
                  animate={{ scale: [0.2, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 0.3, repeat: 2, delay: 0.15, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white rounded-full z-0"
                />

                {/* The 3D Rocket - smaller container */}
                <div className="w-16 h-16 drop-shadow-[0_15px_30px_rgba(34,211,238,0.5)] relative z-20">
                  <Player autoplay loop src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json" style={{ height: '100%', width: '100%', transform: 'scale(1.15)' }} />
                </div>

                {/* Hyperdrive Plasma Thrust Trail - shortened */}
                <motion.div
                  animate={{ height: ["0px", "120px", "0px"], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, times: [0, 0.4, 1] }}
                  className="absolute top-[75%] left-1/2 -translate-x-1/2 w-8 bg-gradient-to-b from-cyan-400 via-blue-600 to-transparent blur-lg rounded-full origin-top z-10"
                />
                <motion.div
                  animate={{ height: ["0px", "80px", "0px"], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, times: [0, 0.4, 1] }}
                  className="absolute top-[75%] left-1/2 -translate-x-1/2 w-3 bg-gradient-to-b from-white via-cyan-200 to-transparent blur-md rounded-full origin-top z-10"
                />
                <motion.div
                  animate={{ height: ["0px", "50px", "0px"], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, times: [0, 0.4, 1] }}
                  className="absolute top-[75%] left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-white to-transparent blur-[1px] rounded-full origin-top z-10"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* --- HERO SECTION --- */}
      <section className="relative pt-8 pb-14 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          <div className="lg:col-span-7">
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
                style={{ letterSpacing: '0.12em', paddingLeft: '0.12em' }}
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
              Instant global settlements. Engineered for world-class creators.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 relative mb-12">
              <button onClick={() => navigate('/signup')} className="w-full sm:w-auto bg-[#10B981] text-white px-10 py-5 rounded-2xl font-black uppercase italic text-sm shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                <Play className="w-4 h-4 fill-white" /> Get Started
              </button>

              <div className="relative group w-full sm:w-auto">
                <button
                  onClick={triggerDemo}
                  className={`w-full sm:w-auto px-10 py-5 rounded-2xl font-black uppercase italic text-sm transition-all flex items-center justify-center gap-3 active:scale-95 border ${theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-100 shadow-sm'
                    }`}
                >
                  <Sparkles className="w-4 h-4 text-[#10B981]" /> Watch Demo
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
                { icon: Zap, label: "Lightning Fast", desc: "Global CDN delivery" },
                { icon: Shield, label: "0% Chargebacks", desc: "Razorpay Protected" },
                { icon: Landmark, label: "T+2 Payouts", desc: "Automated settlements" }
              ].map((prop, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <prop.icon className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className={`text-[11px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/80' : 'text-slate-900/80'}`}>{prop.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-medium italic">{prop.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative mt-8 lg:mt-0 lg:ml-auto w-full max-w-xl">
            {/* MINI-NEXUS PREVIEW — placed directly on the page */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`relative flex flex-col overflow-hidden rounded-[2rem] md:rounded-[3rem] border ${theme === 'dark'
                ? 'bg-[#050505]/40 border-white/10 backdrop-blur-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]'
                : 'bg-white/40 border-white/60 backdrop-blur-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]'
                }`}
            >
              {/* Background Orbs for Depth */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="glass-orb w-48 h-48 bg-[#10B981] top-[-10%] right-[-10%]" style={{ animationDelay: '0s' }} />
                <div className="glass-orb w-64 h-64 bg-[#3b82f6] bottom-[-20%] left-[-10%]" style={{ animationDelay: '-5s' }} />
                <div className="glass-orb w-40 h-40 bg-[#8b5cf6] top-[20%] left-[10%]" style={{ animationDelay: '-10s' }} />
              </div>

              <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-5 gap-3 sm:gap-4 relative z-10">

                {/* Top bar — streamer identity */}
                <div className={`flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl sm:rounded-3xl border transition-all duration-500 ${theme === 'dark' ? 'bg-white/[0.04] border-white/10 shadow-lg' : 'bg-white/80 border-white/90 shadow-sm'}`}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[#10B981]/40 blur-md rounded-full group-hover:blur-lg transition-all" />
                    <div className="w-10 h-10 rounded-full bg-[#10B981] p-[1.5px] shrink-0 relative z-10">
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                        <User className="w-5 h-5 text-[#10B981]" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-black italic tracking-tighter leading-none truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Astra_Cruiser</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Shield className="w-2.5 h-2.5 text-[#10B981]" />
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#10B981]">Verified Pro</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 animate-pulse" />
                    <span className="text-[9px] font-bold text-[#10B981] uppercase tracking-tighter">Live</span>
                  </div>
                </div>

                {/* Mini-Nexus grid — sidebar + alert area */}
                <div
                  className={`flex-1 rounded-[1.5rem] transition-all duration-700 ${theme === 'dark' ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.04]'}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '1.25rem',
                    border: '1px solid',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    alignItems: 'stretch',
                  }}
                >

                  {/* Left: Top Fans sidebar with modern design */}
                  <div className={`flex flex-col gap-4 pt-1 border-r border-white/5 ${window.innerWidth < 768 ? 'pr-2' : 'pr-4'}`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Trophy className="w-3 h-3 text-[#F59E0B]" />
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Top Fan</p>
                    </div>
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
                          <p className={`text-sm font-black italic uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Awaiting Support</p>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 text-center leading-relaxed">Stream is live.<br />Watch Demo to start.</p>
                        </motion.div>
                      )}
                      {showPreview && (
                        <motion.div
                          key="alert"
                          initial={{ opacity: 0, scale: 0.92, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.92, y: -10 }}
                          className="w-full flex items-center justify-center overflow-hidden h-[160px] sm:h-[240px] relative"
                        >
                          <div className="w-[320px] sm:w-full flex items-center justify-center h-full transform scale-[0.55] min-[400px]:scale-[0.65] sm:scale-[0.7] md:scale-[0.75] lg:scale-[0.8] origin-center absolute sm:relative">
                            <Suspense fallback={<div className="h-[150px] w-full rounded-3xl bg-white/5 animate-pulse" />}>
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
                                hideSticker={true}
                              />
                            </Suspense>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Bottom stat bar — hidden on mobile */}
                <div className={`hidden sm:flex items-center gap-4 px-5 py-3 rounded-2xl border transition-all duration-500 ${theme === 'dark' ? 'bg-white/[0.03] border-white/10 shadow-lg' : 'bg-white/90 border-white/90 shadow-sm'}`}>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#10B981]/40 blur-sm rounded-full animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-[#10B981] relative z-10" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981]">Live</span>
                  </div>
                  <div className="h-4 w-[1px] bg-white/10" />
                  <div className="flex items-center gap-2">
                    <Target className="w-3 h-3 text-slate-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-500">75% Goal funded</span>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-[#10B981]">
                    <div className="flex flex-col items-end">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map(i => <div key={i} className={`w-0.5 rounded-full bg-[#10B981] ${i === 4 ? 'h-3' : i === 3 ? 'h-2' : i === 2 ? 'h-1.5' : 'h-2.5'}`} />)}
                      </div>
                    </div>
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
      <section className="pt-10 pb-12 md:py-16 px-6 bg-gradient-to-b from-transparent via-[#10B981]/5 to-transparent">
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="mb-8 md:mb-10">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">Premium <span className="text-[#10B981]">Features.</span></h2>
            <p className="text-slate-300 font-medium italic text-xs md:text-sm max-w-2xl leading-relaxed">Enterprise-grade infrastructure designed to seamlessly handle massive global audiences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 relative">
            {premiumFeaturesData.map((feat, index) => (
              <PremiumFeatureCard key={feat.id} feat={feat} index={index} />
            ))}
          </div>


        </div>
      </section>

      {/* --- PROTOCOL NODES (TABBED SECTION) --- */}
      <section id="features" className="pt-4 pb-4 md:pt-4 md:pb-20 px-6 max-w-[1280px] mx-auto w-full">
        <motion.div
          className="mb-12 md:mb-0"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center mb-10 px-0 md:px-6">
            <div className={`p-1.5 md:p-2 rounded-2xl flex flex-wrap justify-center md:flex-nowrap border ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-white shadow-md border-slate-100'}`}>
              {[
                { id: 'streamers', label: 'Platform', icon: <Cpu className="w-4 h-4" /> },
                { id: 'developers', label: 'Developers', icon: <Monitor className="w-4 h-4" /> },
                { id: 'community', label: 'Community', icon: <Heart className="w-4 h-4" /> }
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
                <div className="relative overflow-hidden p-0 sm:p-2 md:p-4 lg:p-6 transition-all duration-700 group flex flex-col justify-center min-h-[480px] w-full">
                  {/* Internal Glow Orbs */}
                  <motion.div
                    animate={{
                      x: [0, 25, 0],
                      y: [0, -25, 0],
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -right-20 w-64 h-64 bg-[#10B981]/10 blur-[80px] rounded-full pointer-events-none"
                  />

                  <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6 md:space-y-8"
                    >
                      <div className="inline-flex items-center gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] font-black uppercase text-[9px] md:text-[10px] tracking-widest">
                        <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Revenue Optimization
                      </div>
                      <h3 className={`text-3xl md:text-6xl font-black italic uppercase leading-[1] md:leading-[0.9] tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Maximize <br /> <span className="text-[#10B981]">Every Drop</span>
                      </h3>
                      <p className="text-slate-300 font-medium text-base md:text-lg leading-relaxed max-w-md">
                        Our enterprise-grade global payment infrastructure ensures your revenue hits your bank automatically, anywhere in the world.
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
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className={`relative p-5 sm:p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl transition-all duration-700 simulator-card-premium ${theme === 'dark' ? 'holo-border' : 'bg-white/60 border-white/80 backdrop-blur-3xl'
                        }`}
                      style={{ '--theme-bg': theme === 'dark' ? '#050505' : '#ffffff' }}
                    >
                      {/* Background Orbs for Simulator */}
                      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
                        <div className="glass-orb w-48 h-48 bg-[#10B981] top-[-10%] right-[-10%]" style={{ animationDelay: '0s' }} />
                        <div className="glass-orb w-64 h-64 bg-[#3b82f6] bottom-[-20%] left-[-10%]" style={{ animationDelay: '-5s' }} />
                      </div>

                      <div className="relative z-10 space-y-4 sm:space-y-5 md:space-y-6">
                        {/* Header & Status */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="relative group">
                              <div className="absolute inset-0 bg-[#10B981]/30 blur-md rounded-2xl group-hover:blur-lg transition-all" />
                              <div className="p-3 bg-white/5 backdrop-blur-xl rounded-2xl text-[#10B981] border border-white/10 relative z-10 shadow-lg">
                                <Landmark className="w-6 h-6" />
                              </div>
                            </div>
                            <div>
                              <span className={`text-sm font-black italic uppercase tracking-tighter block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Payout Simulator</span>
                              <p className="hidden sm:block text-[10px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5">Real-time Earnings Calculator</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                            <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-[#10B981]" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#10B981]">System Active</span>
                          </div>
                        </div>

                        {/* Input Area */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-start gap-2 flex-wrap">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2.5">
                              <Banknote className="w-4 h-4 text-[#10B981]" /> Revenue Calculator
                            </label>
                            <div className="flex gap-1.5 flex-wrap">
                              {[1000, 10000, 50000].map(preset => (
                                <button
                                  key={preset}
                                  onClick={() => setCalcAmount(preset)}
                                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all border ${calcAmount === preset
                                    ? 'bg-[#10B981] text-white border-[#10B981] shadow-[0_4px_12px_rgba(16,185,129,0.3)]'
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-[#10B981]/40'
                                    }`}
                                >
                                  ₹{preset / 1000}K
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className={`relative rounded-2xl border transition-all duration-300 input-glow overflow-hidden ${theme === 'dark' ? 'bg-black/60 border-white/10' : 'bg-slate-50/80 border-slate-200'
                            }`}>
                            <input
                              type="number"
                              value={calcAmount}
                              onChange={e => setCalcAmount(Number(e.target.value))}
                              className={`w-full bg-transparent px-4 py-2 sm:py-3 text-xl sm:text-2xl font-black italic outline-none ${theme === 'dark' ? 'text-[#10B981]' : 'text-[#10B981]'
                                }`}
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              <div className="h-6 w-px bg-white/10 mx-2" />
                              <span className="text-sm font-black italic opacity-30 text-[#10B981]">INR</span>
                            </div>
                          </div>
                        </div>

                        {/* Results Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className={`p-3 sm:p-4 rounded-2xl border transition-all duration-500 overflow-hidden relative group ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-emerald-50/50 border-emerald-100'
                            }`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">Your Split (95%)</p>
                                <Sparkles className="w-3.5 h-3.5 text-[#10B981] opacity-50" />
                              </div>
                              <p className={`text-2xl font-black italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{streamerCut}</p>
                            </div>
                          </div>
                          <div className={`p-3 sm:p-4 rounded-2xl border transition-all duration-500 group ${theme === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-100'
                            }`}>
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Platform Fee (5%)</p>
                              <Shield className="w-3.5 h-3.5 text-slate-500/50" />
                            </div>
                            <p className="text-2xl font-black italic text-slate-400">₹{platformFee}</p>
                          </div>
                        </div>

                        {/* Split Bar — hidden on mobile to save space */}
                        <div className="hidden sm:block space-y-3 pt-2">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>Payout Ratio</span>
                            <span className="text-[#10B981]">95% To You</span>
                          </div>
                          <div className={`h-2.5 rounded-full overflow-hidden p-0.5 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: '95%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, ease: "circOut" }}
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-[#10B981] to-cyan-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            />
                          </div>
                          <p className="text-[9px] font-medium text-center text-slate-500 uppercase tracking-[0.25em] opacity-60">Processing Partner: Razorpay (T+2)</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
              {activeTab === 'developers' && (
                <div className="relative overflow-hidden p-0 sm:p-2 md:p-4 lg:p-6 transition-all duration-700 group flex flex-col justify-center min-h-[480px] w-full">
                  {/* Internal Glow Orbs */}
                  <motion.div
                    animate={{
                      x: [0, -25, 0],
                      y: [0, 25, 0],
                    }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"
                  />

                  <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
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
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">api_response.json</div>
                        <div className="w-10" />
                      </div>

                      <div className="flex-1 p-6 font-mono text-xs leading-relaxed">
                        <div className="flex gap-4">
                          <span className="text-slate-600 select-none">01</span>
                          <span className="text-blue-400">{"{"}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-slate-600 select-none">02</span>
                          <span className="pl-4 text-slate-300">"server"</span>: <span className="text-emerald-400">"asia-south1"</span>,
                        </div>
                        <div className="flex gap-4">
                          <span className="text-slate-600 select-none">03</span>
                          <span className="pl-4 text-slate-300">"status"</span>: <span className="text-emerald-400">"connected"</span>,
                        </div>
                        <div className="flex gap-4">
                          <span className="text-slate-600 select-none">04</span>
                          <span className="pl-4 text-slate-300">"latency"</span>: <span className="text-emerald-400">"0.4ms"</span>,
                        </div>
                        <div className="flex gap-4">
                          <span className="text-slate-600 select-none">05</span>
                          <span className="pl-4 text-slate-300">"protocol"</span>: <span className="text-emerald-400">"WebSocket"</span>
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
                        <Shield className="w-4 h-4" /> Developer First
                      </div>
                      <h3 className={`text-4xl md:text-6xl font-black italic uppercase leading-[0.9] tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        API First <br /> <span className="text-blue-400">Architecture</span>
                      </h3>
                      <p className="text-slate-300 font-medium text-lg leading-relaxed max-w-md">
                        Robust Webhooks and WebSocket APIs with automatic failover. Built for high concurrency and scale.
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
                <div className="relative overflow-hidden p-0 sm:p-2 md:p-4 lg:p-6 text-center transition-all duration-700 group flex flex-col justify-center min-h-[480px] w-full">
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

                  <div className="relative z-10 space-y-6 sm:space-y-8 max-w-3xl mx-auto w-full">
                    <div className="flex justify-center -space-x-3">
                      {[
                        getOptimizedImage('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'),
                        getOptimizedImage('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'),
                        getOptimizedImage('https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop')
                      ].map((src, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.1, zIndex: 20 }}
                          className="w-10 h-10 rounded-full border-2 border-[#10B981]/30 overflow-hidden shadow-xl"
                        >
                          <img src={src} alt="Top Contributor" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-emerald-400 p-0.5 shadow-xl shadow-emerald-500/20"
                      >
                        <div className={`w-full h-full rounded-[0.9rem] flex items-center justify-center ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                          <Heart className="w-7 h-7 text-[#10B981] fill-[#10B981]/20" />
                        </div>
                      </motion.div>
                    </div>

                    <div className="space-y-3">
                      <h3 className={`text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-blue-500">Community</span>
                      </h3>
                      <p className="text-slate-300 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                        Connect with 5,000+ top-tier creators in our exclusive Discord server. Share resources, collaborate, and grow together.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-8 py-4 bg-[#10B981] hover:bg-emerald-400 text-white rounded-xl font-black uppercase italic tracking-widest text-xs flex items-center gap-2.5 shadow-xl shadow-emerald-500/30 transition-all"
                      >
                        <Zap className="w-4 h-4 fill-white" /> Join Community
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
                      <span className="text-[8px] font-black uppercase tracking-widest">Enterprise Security</span>
                      <span className="text-[8px] font-black uppercase tracking-widest">24/7 Priority Support</span>
                      <span className="text-[8px] font-black uppercase tracking-widest">Global Edge Network</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

      </section>



      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="pt-12 pb-14 md:py-16 px-6 text-center">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-12">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 border ${theme === 'dark' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
              <Zap className="w-3 h-3" /> Subscription Tiers
            </div>
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Transparent <span className="text-[#10B981]">Pricing.</span>
            </h2>
            <p className="text-slate-300 font-medium text-sm md:text-base max-w-xl mx-auto italic">
              Every plan includes real-time alerts, OBS overlays, and instant settlements.
            </p>
          </div>

          {/* ── MOBILE CAROUSEL (hidden on md+) ── */}
          {(() => {
            const pricingCards = [
              {
                id: 'starter', label: 'Starter',
                price: '₹699', sub: 'Perfect for new creators getting started.',
                accent: '#94a3b8', accentRgb: '148,163,184',
                icon: <Zap className="w-5 h-5 text-slate-400" />,
                iconBg: 'bg-slate-500/10',
                features: ['85% Revenue Split', 'Real-time OBS Alerts', 'Custom Donation Page', 'Goal Bar Overlays', 'Weekly Payouts'],
                checkColor: 'text-[#10B981]',
                btnClass: 'border border-white/10 text-white hover:bg-white/5',
                btnLabel: 'Start Free Trial',
              },
              {
              id: 'pro', label: 'Pro',
                price: '₹1,499', sub: 'For growing creators & streamers.',
                accent: '#10B981', accentRgb: '16,185,129',
                icon: <Rocket className="w-5 h-5 text-[#10B981]" />,
                iconBg: 'bg-[#10B981]/15',
                badge: 'Most Popular',
                features: ['90% Revenue Split', 'Priority Alert Delivery', '20+ Premium Styles', '48hr Payouts', 'Priority Support'],
                checkColor: 'text-[#10B981]',
                btnClass: 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/30 hover:bg-emerald-400',
                btnLabel: 'Get Started',
              },
              {
                id: 'legend', label: 'Legend',
                price: '₹2,499', sub: 'For pro creators at the top.',
                accent: '#f59e0b', accentRgb: '245,158,11',
                icon: <Trophy className="w-5 h-5 text-amber-400" />,
                iconBg: 'bg-amber-500/15',
                features: ['95% Revenue Split', 'Dedicated Server', 'Unlimited Styles', 'Instant Payouts', 'Account Manager'],
                checkColor: 'text-amber-400',
                btnClass: 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 hover:bg-amber-400',
                btnLabel: 'Get Started',
              },
            ];
            const goCard = (newIdx) => { setPricingDir(newIdx > pricingCard ? 1 : -1); setPricingCard(newIdx); };
            return (
              <div className="md:hidden">
                {/* Modern segmented pill tab switcher */}
                <div className="flex justify-center mb-6">
                  <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
                    {pricingCards.map((c, i) => (
                      <button
                        key={c.id}
                        onClick={() => goCard(i)}
                        className="relative px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300"
                        style={{
                          color: i === pricingCard ? '#fff' : 'rgba(255,255,255,0.35)',
                        }}
                      >
                        {i === pricingCard && (
                          <motion.div
                            layoutId="pricing-pill"
                            className="absolute inset-0 rounded-xl"
                            style={{ background: `rgba(${pricingCards[i].accentRgb},0.2)`, border: `1px solid rgba(${pricingCards[i].accentRgb},0.35)` }}
                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                          />
                        )}
                        <span className="relative z-10">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cards */}
                <div className="relative overflow-visible px-2" style={{ minHeight: 440 }}>
                  <AnimatePresence mode="wait" custom={pricingDir}>
                    {pricingCards.map((card, i) => i === pricingCard && (
                      <motion.div
                        key={card.id}
                        custom={pricingDir}
                        initial={{ opacity: 0, x: pricingDir * 50, scale: 0.97 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: pricingDir * -50, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="relative rounded-3xl p-6 flex flex-col overflow-hidden"
                        style={{
                          background: `radial-gradient(ellipse at top left, rgba(${card.accentRgb},0.12) 0%, rgba(255,255,255,0.02) 60%)`,
                          border: `1px solid rgba(${card.accentRgb},0.25)`,
                          boxShadow: `0 0 40px rgba(${card.accentRgb},0.08)`,
                        }}
                      >
                        {card.badge && (
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-lg"
                            style={{ background: card.accent, boxShadow: `0 4px 16px rgba(${card.accentRgb},0.4)` }}>
                            {card.badge}
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-5 mt-2">
                          <div className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center`}>
                            {card.icon}
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black italic text-white">{card.price}</div>
                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">/month</div>
                          </div>
                        </div>

                        <p className="text-xs font-medium text-white/40 mb-5 leading-relaxed">{card.sub}</p>

                        <ul className="space-y-2.5 mb-6">
                          {card.features.map(f => (
                            <li key={f} className="flex items-center gap-2.5 text-sm">
                              <CheckCircle2 className={`w-4 h-4 ${card.checkColor} shrink-0`} />
                              <span className="text-white/70 font-medium">{f}</span>
                            </li>
                          ))}
                        </ul>

                        <button onClick={() => navigate('/signup')}
                          className={`w-full py-3.5 rounded-2xl font-black uppercase italic text-sm tracking-widest transition-all mt-auto ${card.btnClass}`}>
                          {card.btnLabel}
                        </button>

                        {/* Bottom glow line */}
                        <div className="absolute bottom-0 left-8 right-8 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${card.accentRgb},0.5), transparent)` }} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
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
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Basic Tier</p>
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
                  <button onClick={() => navigate('/signup')}
                    className={`px-5 py-2.5 rounded-xl font-black uppercase italic text-[11px] tracking-widest transition-all border ${theme === 'dark' ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                    Start Trial
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
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#10B981] mb-0.5">Growth Tier</p>
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
                  <button onClick={() => navigate('/signup')}
                    className="px-5 py-2.5 rounded-xl font-black uppercase italic text-[11px] tracking-widest transition-all bg-[#10B981] text-white hover:bg-emerald-400 shadow-lg shadow-[#10B981]/30 hover:shadow-[#10B981]/50">
                    Get Started
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
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-0.5">Premium Tier</p>
                  <h3 className={`text-2xl font-black italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Legend</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">Professional bespoke plan.</p>
                </div>

                <div className={`flex-1 rounded-xl p-3 mx-4 hidden lg:block ${theme === 'dark' ? 'bg-black/10' : 'bg-amber-500/5'}`}>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><CheckCircle2 className="w-3 h-3 text-amber-400" /> 95% Split (5% Fee)</span>
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><CheckCircle2 className="w-3 h-3 text-amber-400" /> Dedicated Server</span>
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><CheckCircle2 className="w-3 h-3 text-amber-400" /> Unlimited Premium</span>
                    <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><CheckCircle2 className="w-3 h-3 text-amber-400" /> Instant Processing</span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-3 flex-shrink-0 min-w-[140px]">
                  <div className="flex items-end gap-1.5">
                    <span className={`text-4xl font-black italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹2,499</span>
                    <span className="text-slate-500 font-bold mb-1">/mo</span>
                  </div>
                  <button onClick={() => navigate('/signup')}
                    className="px-5 py-2.5 rounded-xl font-black uppercase italic text-[11px] tracking-widest transition-all relative z-10 bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/25">
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          </div>


          {/* Bottom note */}
          <p className="text-center text-slate-600 text-sm font-medium mt-4">
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
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981]">Enterprise Team Online</span>
              </div>
              <h2 className={`text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Need a Custom <span className="text-[#10B981]">Solution?</span>
              </h2>
              <p className="text-slate-300 font-medium italic max-w-xl mx-auto md:mx-0 text-sm md:text-base">
                Need higher transaction limits, custom features, or a dedicated account manager? Get in touch with our enterprise team.
              </p>
            </div>
            <div className="relative z-10 shrink-0 w-full md:w-auto">
              {/* TRIGGER MODAL */}
              <button
                onClick={() => setIsSocketModalOpen(true)}
                className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black uppercase italic tracking-widest text-sm transition-all flex items-center justify-center gap-3 border ${theme === 'dark' ? 'bg-white/5 border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981]/10' : 'bg-white border-[#10B981]/30 text-[#10B981] hover:bg-emerald-50 shadow-md'}`}>
                <Radio className="w-5 h-5" /> Get Started
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* --- WORLD-CLASS PREMIUM PROTOCOL FOOTER --- */}
      <footer id="footer" className={`relative border-t overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'border-white/[0.08] bg-[#050505]/80 backdrop-blur-3xl' : 'border-slate-100 bg-white/80 backdrop-blur-3xl'}`}>

        {/* Dynamic Glow Orbs - Aero-Glass Signature */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#10B981]/[0.1] blur-[140px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.1] blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="max-w-[1440px] mx-auto px-6 pt-16 md:pt-24 pb-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

            {/* BRAND & MISSION HUB */}
            <div className="lg:col-span-4 space-y-12">
              <div className="space-y-8">
                <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] p-[2px] transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${theme === 'dark' ? 'bg-[#0a0a0b]' : 'bg-white'}`}>
                      <Zap className="w-7 h-7 text-[#10B981] fill-[#10B981] group-hover:animate-pulse" />
                    </div>
                  </div>
                  <span className={`text-3xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'} group-hover:text-[#10B981] transition-colors`}>
                    Drop<span className="text-[#10B981] drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">Pay</span>
                  </span>
                </div>
                <p className="text-slate-300 text-sm font-bold italic leading-[1.8] max-w-sm">
                  Empowering the innovative creators. DropPay delivers a seamless monetization ecosystem to scale your revenue, elevate fan experiences, and manage global payouts instantly.
                </p>
              </div>

              {/* Enhanced Social Channels */}
              <div className="flex gap-4">
                {[
                  { Icon: Twitter, hoverClass: theme === 'dark' ? 'hover:border-[#1DA1F2]/60 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/5 hover:shadow-[0_0_20px_rgba(29,161,242,0.2)]' : 'hover:border-[#1DA1F2]/60 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/5 hover:shadow-[0_0_20px_rgba(29,161,242,0.1)]' },
                  { Icon: Instagram, hoverClass: theme === 'dark' ? 'hover:border-[#E1306C]/60 hover:text-[#E1306C] hover:bg-[#E1306C]/5 hover:shadow-[0_0_20px_rgba(225,48,108,0.2)]' : 'hover:border-[#E1306C]/60 hover:text-[#E1306C] hover:bg-[#E1306C]/5 hover:shadow-[0_0_20px_rgba(225,48,108,0.1)]' },
                  { Icon: Github, hoverClass: theme === 'dark' ? 'hover:border-white/60 hover:text-white hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'hover:border-slate-900/60 hover:text-slate-900 hover:bg-slate-900/5 hover:shadow-[0_0_20px_rgba(15,23,42,0.1)]' },
                  { Icon: Linkedin, hoverClass: theme === 'dark' ? 'hover:border-[#0A66C2]/60 hover:text-[#0A66C2] hover:bg-[#0A66C2]/5 hover:shadow-[0_0_20px_rgba(10,102,194,0.2)]' : 'hover:border-[#0A66C2]/60 hover:text-[#0A66C2] hover:bg-[#0A66C2]/5 hover:shadow-[0_0_20px_rgba(10,102,194,0.1)]' }
                ].map(({ Icon, hoverClass }, i) => (
                  <button key={i} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border relative group shadow-sm ${theme === 'dark'
                    ? 'bg-white/5 border-white/5 text-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                    } ${hoverClass}`}>
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* NAV MATRIX - Responsive 3-col on all screens */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10 md:gap-10">
              <div className="space-y-5 sm:space-y-8">
                <div className={`text-sm sm:text-xl font-black italic uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-1 sm:gap-2`}>
                  Product <div className="h-[2px] w-4 sm:w-8 bg-[#10B981]/40" />
                </div>
                <div className="flex flex-col gap-3 sm:gap-6">
                  {['Features', 'Pricing', 'Dashboard', 'Overlays'].map(item => (
                    <button key={item} className="group flex items-center gap-1 sm:gap-2 text-slate-500 hover:text-[#10B981] text-[10px] sm:text-[13px] font-black uppercase tracking-widest transition-all text-left">
                      <span className="w-0 group-hover:w-2 h-[2px] bg-[#10B981] transition-all shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-5 sm:space-y-8">
                <div className={`text-sm sm:text-xl font-black italic uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-1 sm:gap-2`}>
                  Resources <div className="h-[2px] w-4 sm:w-8 bg-[#10B981]/40" />
                </div>
                <div className="flex flex-col gap-3 sm:gap-6">
                  {['API Docs', 'Status', 'Security', 'Changelog'].map(item => (
                    <button key={item} className="group flex items-center gap-1 sm:gap-2 text-slate-500 hover:text-[#10B981] text-[10px] sm:text-[13px] font-black uppercase tracking-widest transition-all text-left">
                      <span className="w-0 group-hover:w-2 h-[2px] bg-[#10B981] transition-all shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-5 sm:space-y-8">
                <div className={`text-sm sm:text-xl font-black italic uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-1 sm:gap-2`}>
                  Legal <div className="h-[2px] w-4 sm:w-8 bg-[#10B981]/40" />
                </div>
                <div className="flex flex-col gap-3 sm:gap-6">
                  {['Privacy', 'Terms', 'Refunds', 'Contact'].map(item => (
                    <button key={item} className="group flex items-center gap-1 sm:gap-2 text-slate-500 hover:text-[#10B981] text-[10px] sm:text-[13px] font-black uppercase tracking-widest transition-all text-left">
                      <span className="w-0 group-hover:w-2 h-[2px] bg-[#10B981] transition-all shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* NEWSLETTER NODE - World-Class CTA */}
            <div className="lg:col-span-3 space-y-10">
              <div className="space-y-4 text-center lg:text-left">
                <p className={`text-xl font-black italic uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Stay Updated</p>
                <p className="text-slate-300 text-sm font-bold italic leading-relaxed">
                  Join 5,000+ creators getting weekly product updates.
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="relative group/form w-full overflow-hidden">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="ENTER_EMAIL..."
                  className={`w-full pl-5 sm:pl-8 pr-[110px] sm:pr-[140px] py-4 sm:py-5 rounded-[2rem] text-[9px] sm:text-[10px] font-black uppercase tracking-widest italic outline-none border transition-all duration-500 ${theme === 'dark'
                    ? 'bg-white/5 border-white/5 focus:border-[#10B981]/60 text-white shadow-inner focus:shadow-[0_0_30px_rgba(16,185,129,0.1)]'
                    : 'bg-white border-slate-200 focus:border-[#10B981]/60 text-slate-900 shadow-sm'
                    }`}
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className={`absolute right-2 top-2 bottom-2 px-4 sm:px-6 rounded-[1.4rem] transition-all duration-500 flex items-center justify-center font-black uppercase italic tracking-widest text-[8px] sm:text-[9px] ${subscribing
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-br from-[#10B981] to-[#059669] text-white shadow-xl shadow-[#10B981]/25 hover:shadow-[#10B981]/40 hover:scale-[1.03] active:scale-95'
                    }`}
                >
                  {subscribing ? <Cpu className="w-4 h-4 animate-spin" /> : <>Join Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></>}
                </button>
              </form>

            </div>
          </div>

          {/* DIVIDER - Cybernetic Line */}
          <div className="relative mt-6 md:mt-10 mb-6 md:mb-8">
            <div className={`h-px w-full ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-200 to-transparent'}`} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#10B981] blur-md opacity-50" />
          </div>

          {/* SYSTEM STATUS BAR (SOCKET BAR) */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-10">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-12 w-full lg:w-auto">
              <p className="text-slate-600 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-80 italic text-center md:text-left leading-relaxed">
                © 2026 DROPPAY .
                <br className="md:hidden" /> ALL RIGHTS RESERVED.
              </p>

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
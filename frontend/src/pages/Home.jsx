import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  Globe, 
  ArrowRight, 
  Sparkles, 
  Shield,
  Menu, 
  X, 
  ChevronRight,
  Twitter,
  Instagram
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SimplePricingBento } from '../components/SimplePricingBento';

// ─────────────────────────────────────────────
// Arc.net-style refined page logic
// ─────────────────────────────────────────────


// --- Lazy-loaded heavy components (deferred ~74KB from initial bundle) ---


const customerTestimonials = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Technical Architect",
    content: "Drope's API is a breath of fresh air. The documentation is pristine and the integration was seamless. Highly recommended for any serious creator.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    bg: "#fef9c3", // Light Yellow
    text: "#0f766e", // Teal/Green
    rotate: -3
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Content Strategist",
    content: "The real-time analytics and automated payouts have completely transformed our workflow. It's the most professional platform I've used in years.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    bg: "#dbeafe", // Light Blue
    text: "#1d4ed8", // Blue
    rotate: 2
  },
  {
    id: 3,
    name: "Marcus Thorne",
    role: "Infrastructure Engineer",
    content: "Security was our top priority. Drope's mission-critical approach to data integrity and fraud protection gave us the confidence to scale globally.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    bg: "#ffedd5", // Light Orange/Peach
    text: "#c2410c", // Dark Orange
    rotate: -1
  }
];

const footerWords = ["in", "pay", "alert"];

const Home = () => {


  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });


  // --- UNIFIED GLOBAL THEME SYSTEM ---


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
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
    }, 8000); // Slower 8s interval for ambient feel
    return () => clearInterval(timer);
  }, [featureStyles.length]);
  const [footerWordIdx, setFooterWordIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFooterWordIdx((prev) => (prev + 1) % footerWords.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // --- KINETIC FLIGHT STATES ---

  // --- STABLE DEFINITION ---

  // --- Heartbeat Monitor (reduced from 2s to 3.5s to ease main thread) ---
  useEffect(() => {
    const syncTimer = setInterval(() => setIsSynced(prev => !prev), 3500);

    return () => {
      clearInterval(syncTimer);
    };
  }, []);

  // --- Scroll Lock System ---
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);



  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="min-h-screen font-sans overflow-x-hidden relative"
      style={{ background: 'var(--arc-cream)', color: 'var(--arc-text-dark)' }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        /* ── ARC.NET HOMEPAGE TOKENS ── */
        :root {
          --arc-blue: #111111;
          --arc-cream: #f5f4e2;
          --arc-cream-alt: #f5f4e2;
          --arc-text-dark: #111111;
        }

        .arc-grain-bg {
          position: relative;
          overflow: hidden;
        }
        .arc-grain-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.13;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          z-index: 2;
        }

        .arc-hero-text {
          font-family: Georgia, 'Times New Roman', serif;
          color: var(--arc-text-dark);
        }

        .arc-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 2rem;
          border-radius: 9999px;
          font-weight: 800;
          font-size: 0.875rem;
          letter-spacing: 0.04em;
          transition: all 0.2s cubic-bezier(0.23,1,0.32,1);
          cursor: pointer;
        }

        .arc-pill-btn-primary {
          background: var(--arc-text-dark);
          color: #fff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .arc-pill-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        }

        .arc-testimonial-card {
          background: white;
          border: 1px solid rgba(17,17,17,0.12);
          border-radius: 1.5rem;
          padding: 2rem;
          transition: all 0.3s ease;
        }
        .arc-testimonial-card:hover {
          border-color: rgba(17,17,17,0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(17,17,17,0.08);
        }

        .arc-nav-glass {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }

        .premium-footer-link {
          position: relative;
          color: rgba(17,17,17,0.7);
          transition: color 0.3s ease;
        }
        .premium-footer-link:hover { color: #111111; }
        .premium-footer-link::after {
          content: '';
          position: absolute;
          width: 0; height: 1px;
          bottom: -2px; left: 0;
          background: #111111;
          transition: width 0.3s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .premium-footer-link:hover::after { width: 100%; }

        @keyframes arc-ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .arc-ticker-track {
          display: flex;
          animation: arc-ticker-scroll 30s linear infinite;
          width: max-content;
        }
        .input-glow:focus-within {
          box-shadow: 0 0 20px rgba(17,17,17,0.15);
          border-color: #111111 !important;
        }

        .nav-link-arc {
          position: relative;
          padding: 0.5rem 0;
          color: rgba(255,255,255,0.8);
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          transition: color 0.2s;
        }
        .nav-link-arc:hover { color: #fff; }
        .nav-link-arc::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          width: 0; height: 2px;
          background: rgba(255,255,255,0.6);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link-arc:hover::after { width: 100%; }

        .ticker-sheen { position: relative; overflow: hidden; }
        .ticker-sheen::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent);
          transform: skewX(-25deg);
          animation: sheen-swipe 8s infinite ease-in-out;
        }
        @keyframes sheen-swipe {
          0%   { left: -100%; }
          20%  { left: 200%; }
          100% { left: 200%; }
        }

        .hollow-stream-text {
          color: transparent;
          -webkit-text-stroke: 2px #111111;
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          letter-spacing: -0.05em;
          text-transform: uppercase;
          line-height: 0.9;
          display: inline-block;
          position: relative;
        }

        /* Doubling effect for 'BACKBONE' vibe */
        .hollow-stream-text::after {
          content: attr(data-text);
          position: absolute;
          left: 4px;
          top: 4px;
          color: transparent;
          -webkit-text-stroke: 1px rgba(17,17,17,0.3);
          z-index: -1;
        }
        `}} />

      <nav className="arc-grain-bg fixed top-0 left-0 right-0 z-[100]"
        style={{ position: 'fixed', background: 'var(--arc-blue)', paddingBottom: 12 }}>
        {/* Scroll progress line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[3px] origin-left z-[110]"
          style={{ scaleX, background: 'rgba(255,255,255,0.5)' }}
        />
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-4xl font-black tracking-tight" style={{ fontFamily: 'Georgia, serif', color: 'var(--arc-cream)' }}>
              drope.
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {['Features', 'Pricing', 'Blog'].map((item) => (
              <button key={item} 
                onClick={() => navigate(`/${item.toLowerCase()}`)} 
                className="nav-link-arc cursor-pointer border-none bg-transparent"
              >
                {item}
              </button>
            ))}
            <button onClick={() => navigate('/login')}
              className="text-[10px] font-black uppercase tracking-[0.25em] px-6 py-2.5 rounded-full border border-white/30 text-white/90 hover:bg-white/10 transition-all">
              Login
            </button>
          </div>
          <div className="flex items-center md:hidden">
            <button aria-label="Toggle Mobile Menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
        {/* Arc scalloped wave at bottom of nav */}
        <div style={{ position: 'absolute', bottom: -35, left: 0, width: '100%', zIndex: 6, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 36" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: 36 }}>
            <path d="M0,0 L0,18 C60,28 120,36 180,30 C240,24 300,8 360,4 C420,0 480,12 540,22 C600,32 660,36 720,30 C780,24 840,12 900,6 C960,0 1020,6 1080,16 C1140,26 1200,32 1260,30 C1320,28 1380,20 1440,16 L1440,0 Z"
              fill="var(--arc-blue)" />
          </svg>
        </div>
      </nav>



      {/* MOBILE MENU SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[104]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[80vw] max-w-[320px] z-[105] flex flex-col"
              style={{ background: 'var(--arc-blue)' }}>
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
                <span className="font-black text-2xl text-white" style={{ fontFamily: 'Georgia, serif' }}>drope.</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-1 px-4 pt-6 flex-1">
                {[{ label: 'Features', path: '/features' }, { label: 'Pricing', path: '/pricing' }, { label: 'Blog', path: '/blog' }].map((item, i) => (
                  <motion.button key={item.label}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                    onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                    className="flex items-center justify-between px-4 py-4 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer border-none bg-transparent w-full">
                    <span className="font-black uppercase tracking-wide text-lg">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </motion.button>
                ))}
              </div>
              <div className="flex flex-col gap-3 p-6 border-t border-white/10">
                <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                  className="w-full py-3.5 rounded-full border border-white/30 text-white font-black uppercase tracking-widest text-sm">
                  Login
                </button>
                <button onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}
                  className="w-full py-3.5 rounded-full bg-white text-[#111111] font-black uppercase tracking-widest text-sm">
                  Join Now →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>





      {/* --- HERO SECTION --- (Arc Cream Style) */}
      <section id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center pt-36 px-6 overflow-hidden" style={{ background: 'var(--arc-cream)' }}>
        <div className="max-w-[1400px] w-full mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border"
            style={{ background: 'rgba(17,17,17,0.06)', color: '#111111', borderColor: 'rgba(17,17,17,0.12)' }}
          >
            <Globe className={`w-3.5 h-3.5 ${isSynced ? 'animate-pulse' : ''}`} /> 100% Creator Dedicated
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="arc-hero-text text-[clamp(2.8rem,7vw,5.5rem)] font-bold mb-6 leading-[1.05] tracking-tight"
          >
            <span className="glitch-text" data-text="Supercharge">Supercharge</span> <br />
            <span style={{ color: '#111111' }}>Your </span>
            <span className="hollow-stream-text" data-text="STREAM.">STREAM.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="text-[#4a4a68] text-lg md:text-xl font-medium max-w-xl mb-12 leading-relaxed"
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




      {/* --- ELITE FOUR FEATURES GRID --- (Arc Cream Style) */}
      <section className="py-0 px-6" style={{ background: 'var(--arc-cream)' }}>
        <div className="max-w-[1280px] mx-auto w-full">
          {/* Section Cleared for Future Redesign */}
        </div>
      </section>

      {/* --- PLATFORM ENGINES (TABBED) --- (Arc Cream Style) */}
      <motion.section 
        id="features" 
        animate={{ backgroundColor: featureStyles[activeFeature].bg }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 relative overflow-hidden transition-colors arc-grain-bg"
      >
        <motion.div
          className="max-w-[1280px] mx-auto w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl text-left"
            >
              <h2 className="arc-hero-text text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--arc-text-dark)' }}>
                Built for the <span style={{ color: '#111111' }}>New Era.</span>
              </h2>
              <p className="text-[#4a4a68] text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-60">
                Core Infrastructure & Intelligence
              </p>
            </motion.div>
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => navigate('/features')}
              className="group flex items-center gap-3 px-8 py-4 bg-[#111111] text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-black/10"
            >
              Explore Full Suite <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          <div className="relative min-h-[400px] overflow-visible mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex items-center justify-center p-0 overflow-visible"
              >
                    {/* Pure Background color slide */}
              </motion.div>
            </AnimatePresence>

          </div>
        </motion.div>
      </motion.section>








      {/* --- CUSTOMER CARDS SECTION --- (Arc Cream Style) */}
      <section id="customers" className="py-20 px-6" style={{ background: 'var(--arc-cream-alt)' }}>
        <div className="max-w-[1280px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="arc-hero-text text-4xl md:text-6xl font-bold mb-4" style={{ color: 'var(--arc-text-dark)' }}>
              Testimonials
            </h2>
            <p className="text-[#4a4a68] text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-60">
              Trusted by <span style={{ color: '#111111' }}>Industry Leaders.</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start">
            {customerTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30, rotate: testimonial.rotate }}
                whileInView={{ opacity: 1, y: 0, rotate: testimonial.rotate }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * testimonial.id }}
                whileHover={{ y: -8, rotate: testimonial.rotate + 2, scale: 1.02 }}
                className="relative p-6 aspect-[4/3] rounded-none border-4 border-slate-900 shadow-[8px_8px_0px_#000] transition-all flex flex-col justify-between"
                style={{ background: testimonial.bg }}
              >
                {/* Visual Flair */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Sparkles className="w-8 h-8" style={{ color: testimonial.text }} />
                </div>

                <p className="text-lg md:text-xl font-bold font-serif italic leading-relaxed text-left" style={{ color: testimonial.text }}>
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3 self-end border-t-2 border-slate-900/10 pt-4 w-full justify-end">
                  <div className="text-right">
                    <h4 className="text-[10px] font-black uppercase tracking-tight" style={{ color: testimonial.text }}>
                      {testimonial.name}
                    </h4>
                    <p className="text-[8px] font-bold uppercase tracking-widest opacity-60" style={{ color: testimonial.text }}>
                      {testimonial.role}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-900 shadow-[2px_2px_0px_#000]">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* --- PRICING SECTION --- (New Bento Unit) */}
      <SimplePricingBento />

      {/* --- BITESIZED PREMIUM FOOTER --- */}
      <footer id="footer" className="relative pb-16 pt-8" style={{ background: 'var(--arc-cream)' }}>

        {/* Scalloped Grid Banner */}
        <div className="max-w-[1200px] mx-auto px-6 mb-16">
          <div className="relative bg-[#FF4F21] rounded-[2.5rem] p-12 md:p-24 overflow-hidden border-4 border-slate-900 shadow-2xl shadow-[#FF4F21]/15 flex flex-col items-center justify-center text-center">
            {/* Scalloped top border inside frame */}
            <div className="absolute top-0 left-0 right-0 overflow-hidden line-height-0" style={{ transform: 'translateY(-1px)' }}>
              <svg viewBox="0 0 1200 24" fill="var(--arc-cream)" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,0 L1200,0 L1200,12 C1150,2 1100,22 1050,12 C1000,2 950,22 900,12 C850,2 800,22 750,12 C700,2 650,22 600,12 C550,2 500,22 450,12 C400,2 350,22 300,12 C250,2 200,22 150,12 C100,2 50,22 0,12 Z" />
              </svg>
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '48px 48px' }} />

            {/* Stickers / Props */}
            <div className="absolute top-12 left-6 md:left-16 transform -rotate-12 bg-[#22C55E] var(--arc-text-dark) px-3 py-1.5 font-bold border-2 border-slate-900 rounded-xl text-[10px] uppercase shadow-[4px_4px_0px_#000] z-10">
              RESERVE <br /> Your Seat
            </div>

            <div className="absolute bottom-12 right-6 md:right-16 transform rotate-12 bg-[#111111] text-white px-4 py-2 font-bold border-2 border-slate-900 rounded-2xl text-xs uppercase shadow-[4px_4px_0px_#000] z-10 flex items-center gap-1">
              SALE! <Sparkles className="w-3.5 h-3.5 fill-white" />
            </div>

            {/* Main CTA: Newsletter Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); alert("Successfully subscribed to the newsletter!"); e.target.reset(); }}
              className="relative z-20 flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl mx-auto justify-center"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full flex-1 bg-white var(--arc-text-dark) border-4 border-slate-900 px-6 py-5 rounded-3xl text-xl md:text-2xl font-bold placeholder:text-slate-400 focus:outline-none focus:translate-x-1 focus:translate-y-1 shadow-[8px_8px_0px_#000] focus:shadow-[4px_4px_0px_#000] transition-all"
              />
              <button
                type="submit"
                className="whitespace-nowrap bg-[#FFCA28] var(--arc-text-dark) border-4 border-slate-900 px-8 py-5 rounded-3xl text-2xl md:text-3xl font-black italic shadow-[8px_8px_0px_#000] active:translate-x-2 active:translate-y-2 active:shadow-[0px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all flex items-center gap-3">
                <span className="uppercase tracking-tighter">JOIN</span> <ChevronRight className="w-6 h-6 stroke-[3]" />
              </button>
            </form>

            {/* Scalloped bottom border inside frame */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden line-height-0" style={{ transform: 'rotate(180deg) translateY(-1px)' }}>
              <svg viewBox="0 0 1200 24" fill="var(--arc-cream)" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,0 L1200,0 L1200,12 C1150,2 1100,22 1050,12 C1000,2 950,22 900,12 C850,2 800,22 750,12 C700,2 650,22 600,12 C550,2 500,22 450,12 C400,2 350,22 300,12 C250,2 200,22 150,12 C100,2 50,22 0,12 Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom branding row */}
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center sm:items-end gap-6 text-center md:text-left">
          <div className="flex flex-col gap-1 items-center md:items-start h-[1.2em]">
            <div className="flex items-center">
              <span className="text-4xl md:text-6xl font-black tracking-tight var(--arc-text-dark)" style={{ fontFamily: 'Georgia, serif' }}>drope.</span>
              <div className="relative inline-flex items-center text-left min-w-[1.5em] md:min-w-[2em]">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={footerWords[footerWordIdx]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-4xl md:text-6xl font-black tracking-tight var(--arc-text-dark)" 
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {footerWords[footerWordIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">@ 2026 drope.in all rights reserved</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 max-w-sm">
            <p className="text-slate-600 font-bold text-xs md:text-sm leading-relaxed text-center md:text-right">
              From continuous streaming at Shake Shack to enterprise units. There’s something for everyone.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>

    </motion.main >
  );
};

export default Home;
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { 
  Zap, ShieldCheck, TrendingUp, MessageSquare, Mail, ChevronRight,
  Play, Wand2, Sparkles, Trophy, Globe, Layers, Cpu, Radio, 
  ArrowRight, Menu, X, MousePointer2, Banknote, Landmark, Rocket, 
  Sun, Moon, Instagram, Twitter, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Protocol Imports ---
import AlertPreview from '../components/AlertPreview';
import SocketModal from '../components/SocketModal'; // IMPORT NEW COMPONENT
import { getOptimizedImage } from '../protocol/cdnHelper';

const Home = () => {
  const navigate = useNavigate();
  
  // --- UNIFIED GLOBAL THEME PROTOCOL ---
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dropPayTheme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('dropPayTheme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme(prev => prev === 'dark' ? 'light' : 'dark'), []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeAlert, setActiveAlert] = useState(0); 
  const [isSynced, setIsSynced] = useState(true);
  
  // --- KINETIC FLIGHT STATES ---
  const [showPreview, setShowPreview] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [hasClickedDemo, setHasClickedDemo] = useState(false);

  // --- SOCKET MODAL STATE ---
  const [isSocketModalOpen, setIsSocketModalOpen] = useState(false);
  
  // --- REAL GOAL BAR LOGIC ---
  const [goalAmount, setGoalAmount] = useState(75000);
  const goalTarget = 100000;
  const currentProgress = Math.min((goalAmount / goalTarget) * 100, 100);

  // --- STABLE DEFINITION ---
  const alertVariants = useMemo(() => ['zap', 'cyber', 'royal'], []);
  const [calcAmount, setCalcAmount] = useState(10000);

  // --- Kinetic Connection: Flight Path & Reset Logic ---
  const triggerDemo = useCallback(() => {
    setShowPreview(false);
    setIsFlying(false);

    setTimeout(() => {
      setHasClickedDemo(true);
      setIsFlying(true); 

      setTimeout(() => {
        setIsFlying(false); 
        setActiveAlert(prev => (prev + 1) % alertVariants.length); 
        setShowPreview(true); 
        setGoalAmount(prev => Math.min(prev + calcAmount, goalTarget)); 

        setTimeout(() => {
          setShowPreview(false);
        }, 5000);
      }, 800);
    }, 50);
  }, [alertVariants.length, calcAmount]);


  // --- Heartbeat Protocol ---
  useEffect(() => {
    const syncTimer = setInterval(() => setIsSynced(prev => !prev), 2000);
    return () => clearInterval(syncTimer);
  }, []);

  const streamerCut = useMemo(() => (calcAmount * 0.95).toLocaleString('en-IN'), [calcAmount]);
  const platformFee = useMemo(() => (calcAmount * 0.05).toLocaleString('en-IN'), [calcAmount]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 400]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    setMousePos({ x: (e.clientX / window.innerWidth) - 0.5, y: (e.clientY / window.innerHeight) - 0.5 });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`min-h-screen font-sans selection:bg-[#10B981]/30 transition-colors duration-700 overflow-x-hidden ${
        theme === 'dark' ? 'bg-[#050505] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-[#10B981] z-[120] origin-left" />

      {/* 1. KINETIC BACKGROUND */}
      <motion.div style={{ y: backgroundY }} className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ x: mousePos.x * 60, y: mousePos.y * 60 }}
          className={`absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full transition-all duration-700 ${
            theme === 'dark' ? 'bg-[#10B981]/10 blur-[120px]' : 'bg-[#10B981]/5 blur-[80px]'
          }`} 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
          <MousePointer2 className="w-64 h-64 text-[#10B981]" />
        </div>
      </motion.div>

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

      {/* --- NAVIGATION HUB --- */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] border-b backdrop-blur-2xl transition-all ${
        theme === 'dark' ? 'bg-[#050505]/80 border-white/5' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer z-[110]" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <Zap className={`w-8 h-8 text-[#10B981] fill-[#10B981]`} />
            <span className="text-2xl font-black italic tracking-tighter">DropPay</span>
          </div>

          <div className="hidden lg:flex items-center gap-12 z-[110]">
            {['Features', 'Payouts', 'Help'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-[#10B981] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6 z-[110]">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl border border-white/10">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button onClick={() => navigate('/login')} className="hidden sm:flex bg-[#10B981] text-white px-8 py-3 rounded-xl font-black uppercase italic text-[10px] items-center gap-2 transition-all active:scale-95 hover:bg-emerald-400">
              Login <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-[#10B981] transition-transform active:scale-90">
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* --- MOBILE SIDEBAR --- */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-12 ${
                theme === 'dark' ? 'bg-[#050505]' : 'bg-slate-50'
              }`}
            >
              <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-4 text-[#10B981] transition-transform active:scale-90">
                <X className="w-10 h-10" />
              </button>

              <div className="flex flex-col items-center gap-10 text-center">
                {['Features', 'Payouts', 'Help'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className={`text-5xl font-black italic uppercase tracking-tighter hover:text-[#10B981] transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {item}
                  </a>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 w-3/4 max-w-xs">
                <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="w-full bg-[#10B981] text-white py-5 rounded-2xl font-black uppercase italic tracking-widest text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3">
                  Login <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-32 px-6">
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
                  className={`px-10 py-5 rounded-2xl font-black uppercase italic text-sm transition-all flex items-center gap-3 active:scale-95 border ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                      : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-100 shadow-sm'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#10B981]" /> {getOptimizedImage('Inject Demo')}
                </button>
                {!hasClickedDemo && (
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
                    <span className="text-[9px] font-black uppercase text-[#10B981] tracking-[0.3em] whitespace-nowrap">Click to Test</span>
                    <ChevronRight className="w-4 h-4 text-[#10B981] rotate-90" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className={`rounded-[4rem] p-4 sm:p-10 border-[10px] shadow-2xl transition-all ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#111]' : 'bg-slate-200/50 border-white'}`}>
              <div className="min-h-[300px] flex items-center justify-center relative">
                <AnimatePresence mode="wait">
                  {!showPreview && (
                    <motion.div 
                      key="awaiting"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-center flex flex-col items-center justify-center"
                    >
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-[#10B981]/20 blur-xl rounded-full animate-pulse" />
                        <Radio className="w-16 h-16 relative z-10 text-[#10B981]" />
                      </div>
                      <h3 className={`text-2xl font-black italic uppercase mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Awaiting Drop</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inject Demo to initialize transmission</p>
                    </motion.div>
                  )}

                  {showPreview && (
                    <motion.div 
                      key="alert" 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                      animate={{ opacity: 1, scale: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.9, y: -20 }} 
                      className="w-full"
                    >
                      <AlertPreview 
                        variant={alertVariants[activeAlert]}
                        donorName={activeAlert === 2 ? "Royal Supporter" : activeAlert === 1 ? "Cyber Streamer" : "Zap Node"}
                        amount={calcAmount}
                        message="Atomic split verified! 🚀"
                        theme={theme}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES & GOAL --- */}
      <section id="features" className="py-20 px-6 max-w-[1440px] mx-auto">
        <div className={`relative overflow-hidden p-8 sm:p-12 rounded-[3rem] border transition-all mb-12 ${
          theme === 'dark' 
            ? 'bg-[#0a0a0a] border-[#10B981]/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]' 
            : 'bg-white border-emerald-300 shadow-2xl'
        }`}>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#10B981]/15 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className={`text-3xl sm:text-4xl font-black italic uppercase tracking-tighter flex items-center gap-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <Target className="text-[#10B981] w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" /> 
                Dream PC Setup
              </h2>
              <p className="text-[#10B981] text-[10px] font-black uppercase tracking-[0.3em] mt-2">Live Node Funding Status</p>
            </div>
            <div className={`flex flex-col sm:items-end px-6 py-4 rounded-3xl border ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
              <span className="text-[#10B981] font-black text-2xl drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                ₹{goalAmount.toLocaleString('en-IN')} <span className="text-sm text-slate-500 drop-shadow-none">/ ₹{goalTarget.toLocaleString('en-IN')}</span>
              </span>
              <span className={`text-[11px] font-black uppercase tracking-widest mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>
                {currentProgress.toFixed(1)}% Funded
              </span>
            </div>
          </div>
          <div className={`relative h-6 sm:h-8 rounded-full overflow-visible p-1 border shadow-inner ${theme === 'dark' ? 'bg-black/60 border-white/10' : 'bg-slate-200 border-slate-300'}`}>
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${currentProgress}%` }} transition={{ type: "spring", stiffness: 40, damping: 15 }}
              className="relative h-full bg-gradient-to-r from-[#064E3B] to-[#10B981] rounded-full shadow-[0_0_20px_#10B981]"
            >
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/40 to-transparent blur-md rounded-full pointer-events-none" />
              <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-12 h-12 bg-[#050505] border-2 border-[#10B981] rounded-full flex items-center justify-center shadow-[0_0_30px_#10B981,inset_0_0_10px_#10B981] z-20">
                <Rocket className="w-5 h-5 text-[#10B981] fill-[#10B981] rotate-45 animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Wand2, title: "Alert Studio" },
            { icon: Trophy, title: "Hall of Fame" },
            { icon: Layers, title: "Atomic Stack" },
            { icon: Radio, title: "Redis Mesh" },
            { icon: Cpu, title: "Logic Protocol" },
            { icon: TrendingUp, title: "Growth Engine" },
            { icon: ShieldCheck, title: "Fraud Shield" },
            { icon: MessageSquare, title: "Community Hub" }
          ].map((feat, i) => (
            <div key={i} className={`p-10 rounded-[3.5rem] border ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white shadow-lg'}`}>
              <div className="w-14 h-14 rounded-2xl bg-[#10B981]/10 flex items-center justify-center mb-8 text-[#10B981]"><feat.icon className="w-6 h-6" /></div>
              <h3 className="text-xl font-black uppercase italic mb-2">{feat.title}</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">Node Verified</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- ECONOMIC CALCULATOR (FIXED UHD) --- */}
      <section id="payouts" className="py-32 px-6">
        <div className={`max-w-4xl mx-auto border backdrop-blur-3xl p-8 sm:p-14 rounded-[4rem] relative overflow-hidden transition-all ${
          theme === 'dark' ? 'bg-[#0a0a0a]/80 border-[#10B981]/20 shadow-2xl' : 'bg-white border-slate-200 shadow-2xl'
        }`}>
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 pointer-events-none">
            <Landmark className={`w-64 h-64 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} />
          </div>

          <div className="relative z-10 space-y-12">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-[#10B981]/10 rounded-[1.5rem] text-[#10B981] border border-[#10B981]/20">
                <Landmark className="w-8 h-8" />
              </div>
              <div>
                <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Payout Simulator</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981] mt-1">Real-Time Economic Protocol</p>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-7 space-y-6">
                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3 ml-2">
                  <Banknote className="w-4 h-4 text-[#10B981]" /> Donation Amount (INR)
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#10B981]/5 blur-2xl rounded-3xl group-focus-within:bg-[#10B981]/10 transition-all" />
                  <input 
                    type="number" 
                    value={calcAmount} 
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className={`relative w-full border rounded-[2.5rem] p-8 text-5xl font-black italic outline-none transition-all ${
                      theme === 'dark' 
                        ? 'bg-black/40 border-white/10 text-[#10B981] focus:border-[#10B981] shadow-inner' 
                        : 'bg-slate-100/50 border-slate-200 text-[#10B981] focus:border-[#10B981] shadow-inner'
                    }`}
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black italic opacity-20">INR</span>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-5">
                <div className={`p-8 rounded-[2.5rem] border transition-all ${
                  theme === 'dark' ? 'bg-[#10B981]/5 border-[#10B981]/20' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#10B981] mb-2">Your Split (95%)</p>
                  <p className={`text-4xl font-black italic drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{streamerCut}</p>
                </div>
                
                <div className={`p-6 rounded-[2rem] border transition-all opacity-60 ${
                  theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Node Fee (5%)</p>
                  <p className="text-xl font-black italic text-slate-500">₹{platformFee}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NETWORK COMMAND --- */}
      <section id="help" className="py-40 px-6">
        <div className="max-w-[1440px] mx-auto text-center">
          <h2 className={`text-5xl font-black italic uppercase mb-20 tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>The Network Command.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <MessageSquare className="w-8 h-8" />, name: "Discord", status: "4k+ Streamers" },
              { icon: <Twitter className="w-8 h-8" />, name: "X Protocol", status: "Sub-ms Engagement" },
              { icon: <Instagram className="w-8 h-8" />, name: "Visual Node", status: "4K Content Mesh" }
            ].map((node, i) => (
              <div key={i} className={`p-12 rounded-[3.5rem] border transition-all cursor-pointer ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 hover:border-[#10B981]/30' : 'bg-white shadow-xl hover:border-[#10B981]/30'}`}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 mx-auto bg-[#10B981]/10 text-[#10B981]">{node.icon}</div>
                <h3 className={`text-2xl font-black uppercase italic mb-2 tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{node.name}</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{node.status}</p>
                <ChevronRight className="mt-8 w-4 h-4 text-[#10B981] mx-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONNECT TO ENGINEER NODE --- */}
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
      <footer className="py-24 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-slate-600">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-[#10B981] fill-[#10B981]" />
            <span className="text-2xl font-black italic tracking-tighter">DropPay</span>
          </div>
          <div className="flex items-center gap-6">
             <Mail className="w-5 h-5 cursor-pointer hover:text-[#10B981] transition-colors" />
             <Instagram className="w-5 h-5 cursor-pointer hover:text-[#10B981] transition-colors" />
             <Twitter className="w-5 h-5 cursor-pointer hover:text-[#10B981] transition-colors" />
             <Rocket className="w-5 h-5 cursor-pointer hover:text-[#10B981] transition-colors" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em]">© 2026 Core Engineering.</p>
        </div>
      </footer>

      {/* --- TECHNICAL SOCKET MODAL (GIANT-TIER) --- */}
      <SocketModal 
        isOpen={isSocketModalOpen} 
        onClose={() => setIsSocketModalOpen(false)} 
        theme={theme} 
      />
    </div>
  );
};

export default Home;
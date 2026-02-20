import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, ShieldCheck, TrendingUp, 
  MessageSquare, Mail, ChevronRight,
  Play, Wand2, Sparkles, Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  const features = [
    { icon: Wand2, title: "Alert Studio", desc: "Craft legendary 4K alerts with custom TTS and physics." },
    { icon: ShieldCheck, title: "Secure Payouts", desc: "Direct bank settlements via Razorpay Route protocols." },
    { icon: TrendingUp, title: "Growth Missions", desc: "Lower your fees by recruiting your streamer network." },
    { icon: Zap, title: "Real-time Hub", desc: "Sub-second latency between payment and stream alert." }
  ];

  const triggerPreview = () => {
    setShowPreview(true);
    setTimeout(() => setShowPreview(false), 6000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* --- NAVIGATION BAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <Zap className="w-8 h-8 text-indigo-500 fill-indigo-500" />
            <span className="text-2xl font-black italic tracking-tighter uppercase">DropPay</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#help" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">Help</a>
            <a href="#contact" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white">Login</button>
            <button onClick={() => navigate('/signup')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black uppercase italic text-[10px] shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all">Start Dropping</button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 inline-block">The New Gold Standard</span>
            <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85] mb-8">
              Monetize Your <br /> 
              <span className="text-indigo-500">Influence</span> Instantly.
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl mb-12 italic">
              Custom alerts, instant bank settlements, and growth tools designed for the next generation of professional streamers.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/signup')} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase italic text-sm shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 transition-all flex items-center gap-3">
                <Play className="w-4 h-4 fill-white" /> Launch Hub
              </button>
              <button onClick={triggerPreview} className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase italic text-sm hover:bg-white/10 transition-all flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Live Demo
              </button>
            </div>
          </motion.div>

          {/* LIVE PREVIEW WINDOW */}
          <div className="relative">
            <div className="bg-[#0a0a0a] rounded-[3rem] border-[10px] border-[#111] overflow-hidden shadow-2xl h-[450px] relative flex flex-col">
                <div className="p-4 bg-[#111] border-b border-white/5 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Monitor v1.0</span>
                </div>
                
                <div className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px]">
                    <AnimatePresence>
                        {showPreview ? (
                            <motion.div 
                                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: -20 }}
                                className="relative z-10 w-full max-w-md bg-amber-950/90 border-2 border-amber-400 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_0_60px_rgba(251,191,36,0.3)] flex items-center gap-6"
                            >
                                <div className="text-7xl drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">👑</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-2xl font-black italic uppercase tracking-tighter text-amber-400">Legendary Donor</h4>
                                        <span className="bg-amber-400 text-black px-3 py-1 rounded-lg font-black italic text-sm">₹5,000</span>
                                    </div>
                                    <p className="text-white text-xs italic font-medium leading-relaxed">"Setting up my new stream with DropPay! This alert is fire! 🔥"</p>
                                </div>
                                {/* Particle Simulation */}
                                <div className="absolute -inset-4 pointer-events-none">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-full h-full">
                                        <Sparkles className="absolute top-0 right-0 w-6 h-6 text-amber-400 animate-pulse" />
                                        <Trophy className="absolute bottom-0 left-0 w-6 h-6 text-amber-400 animate-pulse" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center space-y-4 opacity-20 group cursor-pointer" onClick={triggerPreview}>
                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-white flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                    <Play className="w-6 h-6 fill-white" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Preview</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {/* Ambient Background Glow */}
            <div className="absolute -inset-10 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-32 px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] hover:border-indigo-500/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-colors">
                <feat.icon className="w-6 h-6 text-indigo-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-black uppercase italic mb-4 tracking-tighter">{feat.title}</h3>
              <p className="text-slate-500 leading-relaxed italic font-medium text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- HELP / FAQ SECTION --- */}
      <section id="help" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black italic uppercase mb-4">Knowledge Protocol</h2>
            <p className="text-slate-500 font-medium">Common inquiries about the DropPay ecosystem.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "How do I add the overlay to OBS?", a: "Copy your unique OBS Key from the Control Center and add it as a 'Browser Source' in OBS Studio. Set width to 1920 and height to 1080." },
              { q: "What is the platform commission?", a: "We take a standard 7% fee to cover processing and server maintenance. Legend tier members can lower this via missions." },
              { q: "How long until I receive my money?", a: "Settlements are processed via Razorpay Route and typically reach your bank in T+2 business days." }
            ].map((faq, i) => (
              <details key={i} className="group bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 cursor-pointer">
                <summary className="flex justify-between items-center font-black uppercase italic text-xs tracking-widest list-none">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-indigo-500 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-6 text-slate-500 text-sm font-medium leading-relaxed italic border-t border-white/5 pt-6">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT / SUPPORT SECTION --- */}
      <section id="contact" className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto bg-indigo-600 rounded-[4rem] p-12 lg:p-24 overflow-hidden relative shadow-[0_0_100px_rgba(99,102,241,0.2)] text-center md:text-left">
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black italic uppercase leading-[0.9] mb-8 text-white">Need Human <br /> Assistance?</h2>
              <p className="text-indigo-100 font-medium mb-12 text-lg italic">Our engineering core is available 24/7 for account emergencies and protocol errors.</p>
              <div className="inline-flex items-center gap-4 bg-black/20 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
                <Mail className="w-6 h-6 text-white" />
                <div>
                  <p className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">Email Hub</p>
                  <p className="text-sm font-bold">support@droppay.com</p>
                </div>
              </div>
            </div>
            <div className="bg-black/10 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem]">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-3"><MessageSquare className="w-4 h-4" /> Quick Transmission</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Streamer ID" className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-xs outline-none focus:border-white transition-all text-white font-bold" />
                <textarea placeholder="How can we help?" className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-xs outline-none focus:border-white h-32 resize-none transition-all text-white font-bold"></textarea>
                <button className="w-full bg-white text-indigo-600 py-5 rounded-2xl font-black uppercase italic text-xs shadow-xl hover:bg-slate-100 transition-all">Send Insight</button>
              </form>
            </div>
          </div>
          <Zap className="absolute -bottom-20 -right-20 w-96 h-96 text-white/5 -rotate-12 pointer-events-none" />
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-indigo-500 fill-indigo-500" />
            <span className="text-xl font-black italic uppercase tracking-tighter">DropPay</span>
          </div>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 DropPay Core Engineering. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <button onClick={() => {}} className="text-slate-500 hover:text-white transition-colors underline text-[10px] font-black uppercase tracking-widest">Privacy</button>
            <button onClick={() => {}} className="text-slate-500 hover:text-white transition-colors underline text-[10px] font-black uppercase tracking-widest">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
import React from 'react';
import { motion } from 'framer-motion';
import {
  Search, Zap, Wallet, ShieldAlert, Activity,
  ChevronRight, Mail as MailIcon
} from 'lucide-react';
import EliteCard from '../common/EliteCard';

const HelpCenter = ({ theme }) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const faqItems = [
    { q: "How do settlements work?", a: "Revenue is auto-settled via our secure payout systems. Standard clearing time is T+2 business days. You can track individual tips in your Dashboard Summary." },
    { q: "How do I unlock lower platform fees?", a: "Our system operates on a 15/10/5 system. You can lower your fee by reaching 5 successful referrals in the 'Referrals & Rewards' section." },
    { q: "Why is my OBS Alert source offline?", a: "Check your OBS Key in the Settings. Ensure the browser source URL is correct and that OBS has 'Refresh browser when scene becomes active' enabled." },
    { q: "Can I use custom Lottie animations?", a: "Yes. Pro and Legend tier members can use custom JSON URLs for alerts via the Sticker Management in the Settings." }
  ];

  const filteredFaqs = faqItems.filter(item =>
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto font-sans pb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 md:px-8 pt-4" style={{ color: 'var(--nexus-text)' }}>
      
      <div className="grid grid-cols-12 gap-6 items-stretch relative z-10">
        
        {/* LEFT COLUMN: BRANDING & NAVIGATION (4/12) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* BRANDING HUB */}
          <div className="space-y-4">
            <header className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="w-6 h-[2.5px] bg-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600">Protocol: support_hub_v2.0.1</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-[0.9]" style={{ color: 'var(--nexus-text)' }}>
                Drope <br/> Support_
              </h1>
            </header>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] italic" style={{ color: 'var(--nexus-text-muted)' }}>
              Official Intelligence & Technical Documentation
            </p>
          </div>

          {/* SEARCH MODULE */}
          <div className="relative group/search">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-emerald-600 z-20">
              <Search className="w-4 h-4 group-focus-within/search:scale-110 transition-transform" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search_intel..."
              className="w-full border-2 rounded-xl py-4 pl-12 pr-10 text-xs focus:border-emerald-500/30 outline-none transition-all font-black shadow-sm"
              style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)', color: 'var(--nexus-text)' }}
            />
          </div>

          {/* CATEGORY TILES (Compact) */}
          <div className="space-y-3 pr-2">
            <div className="flex items-center gap-2 px-1 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: 'var(--nexus-text)' }}>Categories</span>
              <div className="h-[1px] flex-1" style={{ background: 'var(--nexus-border)' }} />
            </div>
            {[
              { icon: Zap, title: "Streaming Setup", subtitle: "OBS & Overlays" },
              { icon: Wallet, title: "Payout & Finance", subtitle: "Billing" },
              { icon: ShieldAlert, title: "Security", subtitle: "Keys & MFA" }
            ].map((item, i) => (
              <EliteCard
                key={i}
                className="relative p-4 rounded-xl border transition-all cursor-pointer group flex items-center gap-4 overflow-hidden shadow-sm mb-3"
                style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center border group-hover:border-emerald-500 transition-colors shrink-0" style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)' }}>
                  <item.icon className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[7px] font-black uppercase tracking-widest text-emerald-600 italic leading-none">{item.subtitle}</span>
                  <h4 className="font-black text-xs uppercase italic tracking-tight leading-none" style={{ color: 'var(--nexus-text)' }}>{item.title}</h4>
                </div>
              </EliteCard>
            ))}

            {/* QUICK_CONNECT CTA */}
            <button 
              className="w-full mt-4 py-5 px-6 rounded-xl font-black uppercase italic text-[9px] tracking-[0.3em] shadow-lg transition-all flex items-center justify-center gap-2 mb-4"
              style={{ background: 'var(--nexus-text)', color: (theme === 'light' ? 'white' : 'black') }}
            >
              <MailIcon className="w-3.5 h-3.5" />
              Direct_Support
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: KNOWLEDGE STREAM (8/12) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col border rounded-[2rem] shadow-sm nexus-card overflow-hidden" style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)' }}>
          
          <div className="p-6 border-b flex items-center justify-between" style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)' }}>
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter" style={{ color: 'var(--nexus-text)' }}>Knowledge_Stream</h3>
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-700">
              {filteredFaqs.length} DATA_POINTS FOUND
            </div>
          </div>

          <div className="p-6 space-y-4 bg-transparent relative">
            {/* Blueprint Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(var(--nexus-text) 0.5px, transparent 0.5px)`, backgroundSize: '20px 20px' }} />

            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <details key={idx} className="group outline-none border-none w-full appearance-none">
                  <summary className="flex justify-between items-center p-4 cursor-pointer list-none rounded-xl border hover:border-emerald-500/30 transition-all group-open:rounded-b-none group-open:border-b-0 shadow-sm relative overflow-hidden"
                    style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded border flex items-center justify-center text-[9px] font-black text-emerald-600 group-open:bg-emerald-500 group-open:text-white transition-all"
                        style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)' }}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-[11px] font-black uppercase italic" style={{ color: 'var(--nexus-text)' }}>{faq.q}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-600/30 group-open:rotate-90 transition-transform" />
                  </summary>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden border-x border-b rounded-b-xl"
                    style={{ background: 'rgba(0,0,0,0.05)', borderColor: 'var(--nexus-border)' }}
                  >
                    <div className="p-5 text-[10px] leading-relaxed font-bold uppercase tracking-tight italic border-t" style={{ color: 'var(--nexus-text-muted)', borderColor: 'var(--nexus-border)' }}>
                      <div className="pl-4 border-l-2 border-emerald-500/30">
                        {faq.a}
                      </div>
                    </div>
                  </motion.div>
                </details>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40">
                <ShieldAlert className="w-12 h-12 text-rose-500" />
                <p className="text-[10px] font-black uppercase tracking-widest">ERROR: NO_MATCH_FOUND</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t text-center" style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)' }}>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40" style={{ color: 'var(--nexus-text-muted)' }}>
              Authorized personnel only / All sessions encrypted
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpCenter;
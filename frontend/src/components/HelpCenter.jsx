import React from 'react';
import { motion } from 'framer-motion';
import {
  Search, Zap, Wallet, ShieldAlert,
  MessageSquare, ChevronRight, Mail as MailIcon
} from 'lucide-react';

const HelpCenter = ({ theme }) => {
  const faqItems = [
    { q: "How do settlements work?", a: "Revenue is auto-settled via Razorpay Route protocols. Standard clearing time is T+2 business days. You can track individual drops in your Nexus Summary." },
    { q: "How do I unlock lower platform fees?", a: "The Protocol operates on a 15/10/5 system. You can lower your fee by hitting 5 successful referrals in the 'Growth Missions' section." },
    { q: "Why is my OBS Alert node offline?", a: "Check your OBS Key in the Control Center. Ensure the browser source URL is correct and that OBS has 'Refresh browser when scene becomes active' enabled." },
    { q: "Can I use custom Lottie animations?", a: "Yes. Pro and Legend tier members can inject custom JSON URLs for alerts via the Partner Pack Studio in the Control Center." }
  ];

  return (
    <div className="max-w-[1500px] mx-auto space-y-16 font-sans pb-20 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 md:px-8">

      {/* --- HERO SECTION (CANVA INSPIRED) --- */}
      <div className="relative w-full py-20 px-4 md:px-8 overflow-hidden rounded-[4rem]">
        {/* Large, Atmospheric Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-[var(--nexus-accent)]/10 via-purple-500/5 to-emerald-500/10 blur-[150px] rounded-full opacity-60" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-10">
          <div className="space-y-4 text-pretty">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)] leading-[1.1] md:leading-none"
            >
              How can we <span className="text-[var(--nexus-accent)]">Help?</span>
            </motion.h2>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[var(--nexus-text-muted)] italic opacity-40">
              Nexus Protocol Intelligence & Support Hub
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto w-full group/search px-4"
          >
            <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-[var(--nexus-accent)] z-20">
              <Search className="w-5 h-5 group-focus-within/search:scale-110 transition-transform" />
            </div>
            <input
              type="text"
              placeholder="Search library, missions, or OBS diagnostics..."
              className="w-full bg-[var(--nexus-panel)]/40 backdrop-blur-2xl border-2 border-[var(--nexus-border)] rounded-2xl py-4 md:py-5 pl-14 md:pl-16 pr-8 text-sm md:text-base text-[var(--nexus-text)] focus:border-[var(--nexus-accent)] focus:bg-[var(--nexus-bg)]/80 focus:shadow-[0_0_40px_rgba(var(--nexus-accent-rgb),0.15)] focus:scale-[1.01] outline-none transition-all font-bold placeholder:text-[var(--nexus-text-muted)] placeholder:font-medium shadow-xl hover:bg-[var(--nexus-panel)]/60"
            />
            {/* Subtle glow ring that only shows on focus */}
            <div className="absolute inset-[-4px] rounded-[1.2rem] bg-[var(--nexus-accent)]/10 opacity-0 group-focus-within/search:opacity-100 blur-md transition-opacity pointer-events-none -z-10 mx-4" />
          </motion.div>

          {/* Quick Links / Badges below search */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6 px-4">
            {['OBS Setup', 'Payouts', 'referrals', 'Alerts'].map(chip => (
              <button key={chip} className="px-4 md:px-5 py-2 rounded-full bg-[var(--nexus-panel)] border border-[var(--nexus-border)] text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] hover:border-[var(--nexus-accent)] hover:text-[var(--nexus-accent)] transition-all">
                #{chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID (DASHBOARD STYLE FOR WIDE SCREENS) --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">

        {/* MAIN COLUMN (LEFT) - FAQ CONTENT */}
        <div className="xl:col-span-8 space-y-12">
          {/* --- KNOWLEDGE HUB (FAQ) --- */}
          <div className="space-y-8 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 border-l-4 border-[var(--nexus-accent)] pl-6">
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)]">Knowledge Hub</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--nexus-accent)] opacity-60 italic">Platform protocols & architecture</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--nexus-panel)] border border-[var(--nexus-border)] text-[9px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)]">
                <MessageSquare className="w-3 h-3 text-[var(--nexus-accent)]" /> {faqItems.length} Core Modules
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
              {faqItems.map((faq, idx) => (
                <details key={idx} className="group outline-none border-none w-full appearance-none">
                  <summary className="flex justify-between items-center p-6 md:p-8 cursor-pointer list-none rounded-3xl border border-[var(--nexus-border)] bg-[var(--nexus-panel)] hover:border-[var(--nexus-accent)]/40 transition-all outline-none group-open:rounded-b-none group-open:border-b-0 group-open:bg-[var(--nexus-bg)]/20 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full border border-[var(--nexus-border)] flex items-center justify-center text-[10px] font-black text-[var(--nexus-accent)] group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-black uppercase italic pr-4 text-[var(--nexus-text)] group-hover:text-[var(--nexus-accent)] transition-colors">{faq.q}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[var(--nexus-bg)] border border-[var(--nexus-border)] flex items-center justify-center group-hover:bg-[var(--nexus-accent)] group-hover:text-black transition-all">
                      <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                    </div>
                  </summary>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-8 md:px-12 pb-8 md:pb-10 pt-2 text-xs text-[var(--nexus-text-muted)] leading-relaxed font-medium bg-[var(--nexus-panel)] border-x border-b border-[var(--nexus-border)] rounded-b-3xl shadow-[inset_0_20px_40px_rgba(0,0,0,0.1)]"
                  >
                    <div className="max-w-4xl p-6 rounded-2xl bg-[var(--nexus-bg)]/30 border border-[var(--nexus-border)]/50 italic leading-loose">
                      {faq.a}
                    </div>
                  </motion.div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR (RIGHT) - SERVICE TILES & CTA */}
        <div className="xl:col-span-4 space-y-12">

          {/* Section Header for Sidebar */}
          <div className="space-y-4">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)] px-4">Support Nodes</h3>

            <div className="grid grid-cols-1 gap-6 w-full px-2">
              {[
                { icon: Zap, title: "Engine Integration", subtitle: "OBS & Overlays", desc: "Sync browser sources and 3D alert nodes." },
                { icon: Wallet, title: "Settlement Portal", subtitle: "Finance & Payouts", desc: "Manage treasury and settlement cycles." },
                { icon: ShieldAlert, title: "Security Core", subtitle: "Keys & Encryption", desc: "Audit keys and secure account metadata." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="relative p-8 rounded-[2.5rem] border border-[var(--nexus-border)] bg-[var(--nexus-panel)] hover:border-[var(--nexus-accent)]/30 hover:shadow-2xl transition-all cursor-pointer group flex flex-col items-start text-left overflow-hidden shadow-sm"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                    <item.icon className="w-20 h-20" />
                  </div>

                  <div className="w-12 h-12 bg-[var(--nexus-bg)] rounded-xl flex items-center justify-center mb-6 border border-[var(--nexus-border)] group-hover:border-[var(--nexus-accent)] shadow-inner transition-colors">
                    <item.icon className="w-5 h-5 text-[var(--nexus-accent)] group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--nexus-accent)] opacity-70 italic">{item.subtitle}</span>
                    <h4 className="font-black text-base uppercase italic tracking-tight text-[var(--nexus-text)]">{item.title}</h4>
                    <p className="text-[10px] text-[var(--nexus-text-muted)] leading-relaxed font-medium opacity-80">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* --- GLOBAL ACCESS CTA (SIDEBAR VERSION) --- */}
          <div className="relative w-full p-1 rounded-[3rem] bg-gradient-to-br from-[var(--nexus-accent)] to-emerald-400 shadow-[0_20px_40px_rgba(var(--nexus-accent-rgb),0.2)]">
            <div className="w-full bg-[var(--nexus-bg)] rounded-[2.8rem] p-8 md:p-10 flex flex-col items-center text-center gap-8 overflow-hidden relative">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--nexus-accent)] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--nexus-accent)]">Direct Access Active</span>
                </div>
                <h4 className="text-2xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)] leading-tight">
                  Need More <span className="text-[var(--nexus-accent)]">Help?</span>
                </h4>
                <p className="text-[10px] text-[var(--nexus-text-muted)] font-bold uppercase tracking-widest opacity-60 leading-relaxed max-w-[200px] mx-auto">
                  Priority tokens active for Pro & Legend protocols.
                </p>
              </div>

              <button className="relative z-10 w-full bg-[var(--nexus-accent)] text-black py-4 rounded-xl font-black uppercase italic text-[10px] shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 group">
                <MailIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                ConnectSupport
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
import React from 'react';
import { motion } from 'framer-motion';
import {
  Search, Zap, Wallet, ShieldAlert,
  MessageSquare, ChevronRight, Mail as MailIcon
} from 'lucide-react';
import EliteCard from './EliteCard';

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
    <div className="max-w-6xl mx-auto space-y-12 font-sans pb-20 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 md:px-8 pt-4">

      {/* --- HERO SECTION (REFINED) --- */}
      <div className="relative w-full py-16 px-4 md:px-8 overflow-hidden rounded-[var(--nexus-radius)]">
        {/* Large, Atmospheric Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-[var(--nexus-accent)]/10 via-purple-500/5 to-emerald-500/10 blur-[120px] rounded-full opacity-60" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 text-pretty">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)] leading-[1.1] md:leading-none"
            >
              DropPay <span className="text-[var(--nexus-accent)]">Support.</span>
            </motion.h2>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[var(--nexus-accent)] italic opacity-60">
              Official Support & Documentation
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-xl mx-auto w-full group/search px-4"
          >
            <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-[var(--nexus-accent)] z-20">
              <Search className="w-4 h-4 group-focus-within/search:scale-110 transition-transform" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers or setup help..."
              className="w-full bg-[var(--nexus-panel)]/40 backdrop-blur-2xl border-2 border-[var(--nexus-border)] rounded-2xl py-3.5 md:py-4 pl-12 md:pl-14 pr-12 text-sm text-[var(--nexus-text)] focus:border-[var(--nexus-accent)] focus:bg-[var(--nexus-bg)]/80 focus:shadow-[0_10px_30px_rgba(var(--nexus-accent-rgb),0.1)] outline-none transition-all font-bold placeholder:text-[var(--nexus-text-muted)] placeholder:font-medium shadow-lg hover:bg-[var(--nexus-panel)]/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-[var(--nexus-text-muted)] hover:text-[var(--nexus-accent)] transition-colors"
              >
                <ShieldAlert className="w-4 h-4 rotate-45" />
              </button>
            )}
            {/* Subtle glow ring that only shows on focus */}
            <div className="absolute inset-[-3px] rounded-[1.2rem] bg-[var(--nexus-accent)]/10 opacity-0 group-focus-within/search:opacity-100 blur-md transition-opacity pointer-events-none -z-10 mx-4" />
          </motion.div>
        </div>
      </div>

      {/* --- CONTENT GRID (DASHBOARD STYLE) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* MAIN COLUMN (LEFT) - FAQ CONTENT */}
        <div className="lg:col-span-8 space-y-10">
          {/* --- KNOWLEDGE HUB (FAQ) --- */}
          <EliteCard className="space-y-6 w-full p-8 rounded-[var(--nexus-radius)] bg-[var(--nexus-panel)]/40 border-[var(--nexus-border)] shadow-xl nexus-card">
            <div className="flex flex-row items-center justify-between gap-4 px-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-[var(--nexus-accent)] rounded-full" />
                <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)]">Knowledge Base</h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--nexus-bg)]/40 border border-[var(--nexus-border)] text-[8px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)]">
                <MessageSquare className="w-2.5 h-2.5 text-[var(--nexus-accent)]" /> {filteredFaqs.length} Articles Found
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => (
                  <details key={idx} className="group outline-none border-none w-full appearance-none">
                    <summary className="flex justify-between items-center p-5 cursor-pointer list-none rounded-2xl border border-[var(--nexus-border)] bg-[var(--nexus-bg)]/40 hover:border-[var(--nexus-accent)]/40 hover:scale-[1.01] transition-all outline-none group-open:rounded-b-none group-open:border-b-0 group-open:bg-[var(--nexus-accent)]/5 shadow-sm relative overflow-hidden">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg border border-[var(--nexus-border)] flex items-center justify-center text-[9px] font-black text-[var(--nexus-accent)] group-hover:bg-[var(--nexus-accent)] group-hover:text-black transition-all">
                          {idx + 1}
                        </div>
                        <span className="text-[10px] font-black uppercase italic pr-2 text-[var(--nexus-text)] leading-tight">{faq.q}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-[var(--nexus-text-muted)] group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-6 pb-6 pt-2 text-[10px] text-[var(--nexus-text-muted)] leading-relaxed font-medium bg-[var(--nexus-bg)]/40 border-x border-b border-[var(--nexus-border)] rounded-b-2xl shadow-inner italic"
                    >
                      <div className="p-4 rounded-xl bg-black/20 border border-[var(--nexus-border)]/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  </details>
                ))
              ) : (
                <div className="py-12 text-center space-y-4 bg-[var(--nexus-panel)]/50 rounded-[2rem] border border-dashed border-[var(--nexus-border)]">
                  <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-6 h-6 text-rose-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase italic text-[var(--nexus-text)]">No results found</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-[var(--nexus-text-muted)] opacity-60">Try different keywords</p>
                  </div>
                </div>
              )}
            </div>
          </EliteCard>

          {/* --- GLOBAL ACCESS CTA --- */}
          <EliteCard className="relative w-full p-8 md:p-10 flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-8 overflow-hidden rounded-[var(--nexus-radius)] bg-[var(--nexus-bg)]/60 backdrop-blur-xl border border-[var(--nexus-border)]">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--nexus-accent)] animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--nexus-accent)]">Support Online</span>
              </div>
              <h4 className="text-2xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)] leading-tight">
                Need More <span className="text-[var(--nexus-accent)]">Assistance?</span>
              </h4>
              <p className="text-[10px] text-[var(--nexus-text-muted)] font-bold uppercase tracking-widest opacity-50 leading-relaxed max-w-sm">
                Priority support is available for Pro & Legend members. Our team is ready to assist you.
              </p>
            </div>

            <button className="relative z-10 min-w-[200px] bg-[var(--nexus-accent)] text-black py-4 px-8 rounded-xl font-black uppercase italic text-[10px] shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 group">
              <MailIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Connect to Support
            </button>
          </EliteCard>
        </div>

        {/* SIDEBAR (RIGHT) - SERVICE TILES & CTA */}
        <div className="lg:col-span-4 space-y-10">

          {/* Section Header for Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-1 h-4 bg-[var(--nexus-accent)]/40 rounded-full" />
              <h3 className="text-lg font-black uppercase italic tracking-tighter text-[var(--nexus-text)]">Support Categories</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full px-1">
              {[
                { icon: Zap, title: "Streaming Setup", subtitle: "OBS & Overlays", desc: "Sync browser sources and alert elements." },
                { icon: Wallet, title: "Payout & Finance", subtitle: "Billing & Earnings", desc: "Manage your wallet and settlement history." },
                { icon: ShieldAlert, title: "Account Security", subtitle: "Keys & Verification", desc: "Secure your account and manage access keys." }
              ].map((item, i) => (
                <EliteCard
                  key={i}
                  className="relative p-6 rounded-[var(--nexus-radius)] border border-[var(--nexus-border)] bg-[var(--nexus-panel)]/40 hover:border-[var(--nexus-accent)]/30 transition-all cursor-pointer group flex items-start text-left overflow-hidden shadow-sm"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                    <item.icon className="w-16 h-16" />
                  </div>

                  <div className="w-10 h-10 bg-[var(--nexus-bg)] rounded-xl flex items-center justify-center mb-0 mr-4 border border-[var(--nexus-border)] group-hover:border-[var(--nexus-accent)] shadow-inner transition-colors shrink-0">
                    <item.icon className="w-4 h-4 text-[var(--nexus-accent)] group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[var(--nexus-accent)] opacity-70 italic">{item.subtitle}</span>
                    <h4 className="font-black text-sm uppercase italic tracking-tight text-[var(--nexus-text)] leading-none">{item.title}</h4>
                    <p className="text-[9px] text-[var(--nexus-text-muted)] leading-relaxed font-medium opacity-70 line-clamp-2">{item.desc}</p>
                  </div>
                </EliteCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
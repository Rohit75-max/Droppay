import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Zap, Wallet, ShieldAlert, 
  MessageSquare, ChevronRight, Mail as MailIcon 
} from 'lucide-react';

const HelpCenter = ({ theme }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 font-sans pb-20 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- SEARCH HEADER --- */}
      <div className="text-center space-y-4 w-full">
        <h2 className={`text-4xl font-black uppercase italic tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Knowledge Hub</h2>
        <p className="text-slate-500 text-sm italic font-medium">Protocol documentation and system diagnostics for your stream.</p>
        
        <div className="relative max-w-xl mx-auto mt-8 w-full">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search for 'OBS Setup', 'Withdrawals'..." 
            className={`w-full border-2 rounded-2xl py-4 pl-12 pr-6 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all shadow-2xl font-bold ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}
          />
        </div>
      </div>

      {/* --- CATEGORY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {[
          { icon: Zap, title: "OBS Integration", desc: "Sync browser sources, 3D alert nodes, and custom goal bars.", color: "text-indigo-500" },
          { icon: Wallet, title: "Payout Systems", desc: "Understanding Razorpay Route settlements and banking links.", color: "text-green-500" },
          { icon: ShieldAlert, title: "Security Protocol", desc: "Managing streaming keys and secure encrypted account data.", color: "text-red-500" }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5, scale: 1.02 }} 
            className={`w-full p-8 rounded-[2.5rem] border shadow-xl transition-all cursor-pointer group ${theme === 'dark' ? 'bg-[#111] border-white/5 hover:bg-white/[0.02]' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
          >
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
              <item.icon className={`w-6 h-6 ${item.color} group-hover:text-white transition-colors`} />
            </div>
            <h4 className={`font-black text-xs uppercase italic tracking-wider mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* --- FAQ ACCORDION --- */}
      <div className={`w-full border rounded-[3rem] overflow-hidden shadow-2xl transition-colors ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
        <div className={`p-8 border-b ${theme === 'dark' ? 'border-white/5 bg-[#111]/30' : 'border-slate-200 bg-white/50'}`}>
          <h3 className="text-xs font-black uppercase italic tracking-widest flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <MessageSquare className="w-4 h-4 text-indigo-500" /> Frequently Asked Questions
          </h3>
        </div>
        
        <div className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-200'} w-full`}>
          {[
            { q: "How do settlements work?", a: "Revenue is auto-settled via Razorpay Route protocols. Standard clearing time is T+2 business days. You can track individual drops in your Nexus Summary." },
            { q: "How do I unlock lower platform fees?", a: "The Protocol operates on a 15/10/5 system. You can lower your fee by hitting 5 successful referrals in the 'Growth Missions' section." },
            { q: "Why is my OBS Alert node offline?", a: "Check your OBS Key in the Control Center. Ensure the browser source URL is correct and that OBS has 'Refresh browser when scene becomes active' enabled." },
            { q: "Can I use custom Lottie animations?", a: "Yes. Pro and Legend tier members can inject custom JSON URLs for alerts via the Partner Pack Studio in the Control Center." }
          ].map((faq, idx) => (
            <details key={idx} className="group outline-none border-none w-full">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none hover:bg-black/5 dark:hover:bg-white/[0.02] transition-all outline-none">
                <span className={`text-[11px] font-black uppercase italic pr-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{faq.q}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-open:rotate-90 transition-transform shrink-0" />
              </summary>
              <div className="px-8 pb-6 text-[11px] text-slate-500 leading-relaxed italic max-w-3xl">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* --- FOOTER CTA --- */}
      <div className={`w-full rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-6 border ${theme === 'dark' ? 'bg-[#111] border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : 'bg-indigo-50 border-indigo-100 shadow-xl'}`}>
        <div className="space-y-1 text-center md:text-left">
          <h4 className={`font-black text-lg uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Direct Engineer Access</h4>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-300/70 font-bold uppercase tracking-widest">Priority response active for Legend Tier Protocols.</p>
        </div>
        <button className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-black uppercase italic text-[11px] shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
          <MailIcon className="w-4 h-4" /> Contact Support Node
        </button>
      </div>
    </div>
  );
};

export default HelpCenter;
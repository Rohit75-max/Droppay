import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Clock, Globe, Activity } from 'lucide-react';

export const PlanComparisonBento = () => {
  const comparisonData = [
    { name: "Global Mesh", starter: "15%", pro: "10%", legend: "5%", icon: Globe, span: "md:col-span-2", color: "bg-white", label: "Network Economics" },
    { name: "Strategic Growth", starter: "12%", pro: "7%", legend: "3%", icon: Zap, span: "md:col-span-1", color: "bg-[#EFEECC]", label: "Referral Bonus" },
    { name: "Liquidity Cycle", starter: "Weekly", pro: "48 Hr", legend: "Instant", icon: Clock, span: "md:col-span-1", color: "bg-[#111111] text-white", label: "Settlement Rate" },
    { name: "Service Integrity", starter: "Email", pro: "Chat", legend: "24/7", icon: Shield, span: "md:col-span-2", color: "bg-white", label: "Support Tier" },
    { name: "Volume Throughput", starter: "₹50k/mo", pro: "₹2.5L/mo", legend: "∞", icon: Activity, span: "md:col-span-2", color: "bg-[#f5f4e2]", label: "Transaction Limit" },
  ];

  return (
    <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      {comparisonData.map((item, idx) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={`${item.span} p-10 rounded-[2.5rem] border-4 border-slate-900 shadow-[12px_12px_0px_#000] flex flex-col justify-between group overflow-hidden relative ${item.color}`}
        >
          {/* Internal Blueprint Styling */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
          
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div className="flex flex-col">
              <span className={`text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-3`}>{item.label}</span>
              <h4 className="text-2xl md:text-3xl font-black tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>{item.name}.</h4>
            </div>
            {item.icon && (
               <div className={`p-3 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_#000] rotate-3 bg-white/20`}>
                 <item.icon className="w-6 h-6" />
               </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6 items-end relative z-10">
            {[
              { label: "Starter", value: item.starter, delay: 0.1 },
              { label: "Pro", value: item.pro, delay: 0.2, accent: true },
              { label: "Legend", value: item.legend, delay: 0.3 }
            ].map((col, cIdx) => (
              <motion.div 
                key={cIdx} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx * 0.1) + col.delay, duration: 0.5 }}
                className="flex flex-col gap-2"
              >
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{col.label}</span>
                <span className={`text-lg md:text-2xl font-black tracking-tighter italic ${col.accent ? (item.color.includes('text-white') ? 'text-[#afff00]' : 'text-[#3139fb]') : ''}`} style={{ fontFamily: 'Georgia, serif' }}>
                  {col.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

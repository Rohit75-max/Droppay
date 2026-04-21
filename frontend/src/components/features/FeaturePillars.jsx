import React from 'react';
// import { motion } from 'framer-motion';
import { GitMerge, ShieldCheck, Database } from 'lucide-react';

export const FeaturePillars = () => {
    return (
        <section className="bg-black text-white px-[clamp(1.5rem,5vw,4rem)] py-24 md:py-32 relative z-20 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#afff00]/30 to-transparent" />
            
            <div className="max-w-7xl mx-auto w-full">
                <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8 w-full">
                    <div className="max-w-2xl">
                        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#afff00] mb-4 block">Core Engine</span>
                        <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black tracking-tighter uppercase leading-none text-white">
                            Engineered For <span className="text-zinc-600">Reliability.</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    
                    {/* Pillar 1 */}
                    <div className="group relative bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors p-8 rounded-2xl overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#afff00]/5 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#afff00]/10 transition-colors" />
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:-translate-y-1 transition-transform">
                            <GitMerge className="w-5 h-5 text-[#afff00]" />
                        </div>
                        <h3 className="text-xl font-black uppercase text-white mb-3 tracking-tight">Algorithmic Routing</h3>
                        <p className="text-xs font-mono text-zinc-400 tracking-wide leading-relaxed">
                            Dynamic routing logic switches between alternative gateways in milliseconds to protect conversion rates during upstream downtime.
                        </p>
                    </div>

                    {/* Pillar 2 */}
                    <div className="group relative bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors p-8 rounded-2xl overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors" />
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:-translate-y-1 transition-transform">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-black uppercase text-white mb-3 tracking-tight">Active Fraud Shield</h3>
                        <p className="text-xs font-mono text-zinc-400 tracking-wide leading-relaxed">
                            Machine learning telemetry evaluates 150+ signals per transaction in real-time, aggressively isolating malicious actors before authorization.
                        </p>
                    </div>

                    {/* Pillar 3 */}
                    <div className="group relative bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors p-8 rounded-2xl overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors" />
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:-translate-y-1 transition-transform">
                            <Database className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-black uppercase text-white mb-3 tracking-tight">Instant Ledger</h3>
                        <p className="text-xs font-mono text-zinc-400 tracking-wide leading-relaxed">
                            Abandon T+3 clearing delays. Our proprietary settlement ledger ensures your funds are cleared and accessible the moment the API verifies them.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

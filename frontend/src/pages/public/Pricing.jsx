import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Footer } from '../../components/home/Footer';
import { ArrowRight, Workflow, ShieldCheck, Zap, Check } from 'lucide-react';

const Pricing = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#0A0A0A] text-white overflow-x-hidden min-h-screen">
            <main className="w-full relative z-10">
                {/* --- HERO: MULTI-PARTY SETTLEMENT ROUTING --- */}
                <section className="flex flex-col justify-center px-[clamp(1rem,5vw,4rem)] pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden bg-[#0A0A0A] text-white min-h-[90vh]">
                    
                    {/* Background Grid */}
                    <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[50vh] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

                    <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">
                        {/* LEFT SIDE: THE PITCH */}
                        <div className="flex-1 max-w-2xl text-left">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-400 mb-6 block flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Routing Subsystem
                                </span>
                                <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black tracking-tighter leading-[0.95] uppercase mb-8 text-white">
                                    MULTI-PARTY<br/>
                                    <span className="text-zinc-500">SETTLEMENTS.</span>
                                </h1>
                                <p className="text-sm md:text-lg font-mono leading-[1.8] tracking-wide text-zinc-400 mb-10 max-w-lg">
                                    Automate complex payment flows. Take a platform fee and split the remainder instantly across verified vendors, partners, and creators worldwide.
                                </p>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <button
                                        onClick={() => {
                                            document.getElementById('subscription-tiers').scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="group relative px-8 py-4 bg-[#afff00] text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                                    >
                                        View Pricing
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* RIGHT SIDE: CSS FLOW VISUALIZER */}
                        <div className="flex-1 w-full max-w-md lg:max-w-none ml-auto relative">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="w-full aspect-square md:aspect-[4/3] bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative flex flex-col justify-between"
                            >
                                {/* Inlet Node */}
                                <div className="self-center bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-2 relative z-10 w-48 shadow-xl">
                                    <span className="font-mono text-[10px] uppercase text-zinc-500 tracking-widest">Master Payment</span>
                                    <span className="font-black text-2xl text-white">$10,000.00</span>
                                </div>

                                {/* Flow Lines */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    {/* Main Line down */}
                                    <div className="absolute top-[20%] w-[2px] h-[30%] bg-gradient-to-b from-white/20 to-transparent flex flex-col items-center">
                                        <motion.div 
                                            animate={{ y: [0, 80, 0], opacity: [0, 1, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-1.5 h-6 bg-[#afff00] rounded-full shadow-[0_0_10px_#afff00]"
                                        />
                                    </div>
                                    {/* Horizontal Split */}
                                    <div className="absolute top-[50%] w-[60%] h-[2px] bg-white/10 flex justify-between items-center">
                                         <div className="w-2 h-2 rounded-full bg-[#afff00]" />
                                         <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    </div>
                                    {/* Sub-lines down */}
                                    <div className="absolute top-[50%] left-[20%] w-[2px] h-[30%] bg-white/10" />
                                    <div className="absolute top-[50%] right-[20%] w-[2px] h-[30%] bg-white/10" />
                                </div>

                                {/* Outlet Nodes */}
                                <div className="flex justify-between w-full relative z-10 mt-auto">
                                    <div className="bg-[#afff00]/10 border border-[#afff00]/30 p-4 rounded-2xl flex flex-col items-center gap-2 w-[45%] backdrop-blur-md">
                                        <span className="font-mono text-[9px] uppercase text-[#afff00] tracking-widest text-center">Vendor A (80%)</span>
                                        <span className="font-black text-xl text-white">$8,000.00</span>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl flex flex-col items-center gap-2 w-[45%] backdrop-blur-md">
                                        <span className="font-mono text-[9px] uppercase text-blue-400 tracking-widest text-center">Platform Fee (20%)</span>
                                        <span className="font-black text-xl text-white">$2,000.00</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* --- 3-PILLAR BENTO GRID --- */}
                <section className="px-[clamp(1.5rem,5vw,4rem)] py-24 md:py-32 relative z-20 border-t border-white/5 bg-[#0A0A0A]">
                    <div className="max-w-7xl mx-auto w-full">
                        <header className="mb-16 md:text-center max-w-2xl mx-auto">
                            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black tracking-tighter uppercase leading-none text-white mb-6">
                                The Routing <span className="text-zinc-600">Mechanics.</span>
                            </h2>
                            <p className="text-xs md:text-sm font-mono tracking-wide leading-relaxed text-zinc-400">
                                Programmatically dictate how funds flow across your ecosystem without touching a bank API or holding compliance risk.
                            </p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#111] border border-white/5 p-8 rounded-3xl flex flex-col group hover:border-[#afff00]/30 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shrink-0 group-hover:-translate-y-1 transition-transform">
                                    <Workflow className="w-5 h-5 text-[#afff00]" />
                                </div>
                                <h3 className="text-xl font-black uppercase text-white mb-3">Dynamic Commissions</h3>
                                <p className="text-[11px] font-mono leading-relaxed text-zinc-400 mt-auto">
                                    Define customized flat fees or percentage rates per vendor. Deduct your platform take-rate autonomously before the payout clears.
                                </p>
                            </motion.div>

                            {/* Card 2 */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-[#111] border border-white/5 p-8 rounded-3xl flex flex-col group hover:border-emerald-500/30 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shrink-0 group-hover:-translate-y-1 transition-transform">
                                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-black uppercase text-white mb-3">Compliant Onboarding</h3>
                                <p className="text-[11px] font-mono leading-relaxed text-zinc-400 mt-auto">
                                    We handle the KYC, KYB, and AML checks for every connected account. We take liability so your marketplace can scale risk-free.
                                </p>
                            </motion.div>

                            {/* Card 3 */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-[#111] border border-white/5 p-8 rounded-3xl flex flex-col group hover:border-blue-500/30 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shrink-0 group-hover:-translate-y-1 transition-transform">
                                    <Zap className="w-5 h-5 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-black uppercase text-white mb-3">Synchronous Webhooks</h3>
                                <p className="text-[11px] font-mono leading-relaxed text-zinc-400 mt-auto">
                                    Bind your infrastructure directly to our router. Receive granular lifecycle updates for every partial settlement event executed.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* --- SUBSCRIPTION TIERS --- */}
                <section id="subscription-tiers" className="px-[clamp(1.5rem,5vw,4rem)] py-24 md:py-32 relative z-20 border-t border-white/5 bg-black">
                    <div className="max-w-7xl mx-auto w-full">
                        <header className="mb-16 md:text-center max-w-2xl mx-auto text-center">
                            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500 mb-4 block">Pricing Logic</span>
                            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black tracking-tighter uppercase leading-none text-white mb-6">
                                Scale Without <br className="hidden md:inline" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">Compromise.</span>
                            </h2>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                            
                            {/* TIER 1: CORE */}
                            <div className="bg-[#0A0A0A] border border-white/10 hover:border-white/20 p-8 rounded-3xl flex flex-col transition-colors">
                                <h3 className="text-2xl font-black uppercase text-white mb-2">Core</h3>
                                <p className="text-xs font-mono text-zinc-400 mb-8 min-h-[40px]">Essential multi-party routing for independent creators and agile startups.</p>
                                <div className="mb-8">
                                    <span className="text-5xl font-black">$0</span>
                                    <span className="text-sm font-mono text-zinc-500"> /mo</span>
                                </div>
                                <ul className="space-y-4 mb-10 flex-1">
                                    {['2.9% + 30¢ processing fee', 'Standard 48hr payouts', 'Basic Webhook access', 'Email Support'].map((ft, i) => (
                                        <li key={i} className="flex flex-row items-start gap-3">
                                            <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                                            <span className="text-sm text-zinc-300 font-mono">{ft}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-4 border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                                    Start Free
                                </button>
                            </div>

                            {/* TIER 2: GROWTH (ACCENTED) */}
                            <div className="bg-[#111] border border-[#afff00] p-8 rounded-3xl flex flex-col relative transform md:-translate-y-4 shadow-2xl">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#afff00] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                    Most Popular
                                </div>
                                <h3 className="text-2xl font-black uppercase text-white mb-2">Growth</h3>
                                <p className="text-xs font-mono text-zinc-400 mb-8 min-h-[40px]">Advanced routing parameters with discounted processing rates.</p>
                                <div className="mb-8">
                                    <span className="text-5xl font-black text-[#afff00]">$49</span>
                                    <span className="text-sm font-mono text-zinc-500"> /mo</span>
                                </div>
                                <ul className="space-y-4 mb-10 flex-1">
                                    {['2.5% + 20¢ processing fee', 'Instant Settlement SDK', 'Automated KYC/KYB', 'Priority Node Execution', '24/7 Slack Connect'].map((ft, i) => (
                                        <li key={i} className="flex flex-row items-start gap-3">
                                            <Check className="w-4 h-4 text-[#afff00] shrink-0 mt-0.5" />
                                            <span className="text-sm text-zinc-300 font-mono">{ft}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-4 bg-[#afff00] text-black rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
                                    Upgrade to Growth
                                </button>
                            </div>

                            {/* TIER 3: ENTERPRISE */}
                            <div className="bg-[#0A0A0A] border border-white/10 hover:border-white/20 p-8 rounded-3xl flex flex-col transition-colors">
                                <h3 className="text-2xl font-black uppercase text-white mb-2">Enterprise</h3>
                                <p className="text-xs font-mono text-zinc-400 mb-8 min-h-[40px]">Custom logic engines handling 100k+ transactions per month.</p>
                                <div className="mb-8 mt-2">
                                    <span className="text-4xl font-black">Custom</span>
                                </div>
                                <ul className="space-y-4 mb-10 flex-1">
                                    {['Negotiated volume discounts', 'Custom Ledger rules', 'Dedicated Routing Node', 'White-glove SLA', 'Dedicated Engineer'].map((ft, i) => (
                                        <li key={i} className="flex flex-row items-start gap-3">
                                            <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                                            <span className="text-sm text-zinc-300 font-mono">{ft}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-4 border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                                    Contact Sales
                                </button>
                            </div>

                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
};

export default Pricing;

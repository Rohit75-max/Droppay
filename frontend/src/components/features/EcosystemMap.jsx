import React from 'react';
// import { motion } from 'framer-motion';

export const EcosystemMap = () => {
    return (
        <section className="bg-black text-white px-[clamp(1.5rem,5vw,4rem)] py-24 md:py-32 relative z-20 overflow-hidden">
            <div className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center">
                
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#afff00] mb-4 block">Global Connectivity</span>
                <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tighter uppercase leading-none text-white mb-6">
                    Local Access. Global Reach.
                </h2>
                <p className="text-sm md:text-base font-mono text-zinc-400 tracking-wide leading-relaxed max-w-2xl mb-16">
                    Connect to entirely new demographics with instant support for 150+ currencies and deep integrations with local alternative payment methods (APMs).
                </p>

                {/* Simulated World Map Points */}
                <div className="relative w-full max-w-4xl aspect-[2/1] border border-white/5 bg-[#0A0A0A] rounded-3xl overflow-hidden flex items-center justify-center">
                    
                    {/* Background Grid */}
                    <div className="absolute inset-0 blueprint-grid opacity-[0.05] pointer-events-none" />

                    {/* Nodes Map */}
                    <div className="absolute inset-0 p-8 md:p-16 flex flex-wrap content-between justify-between opacity-50">
                        {/* Arbitrary data points for map structure */}
                        <div className="w-full flex justify-between">
                            <span className="w-1.5 h-1.5 bg-[#afff00] rounded-full shadow-[0_0_10px_#afff00] animate-pulse" />
                            <span className="w-3 h-3 bg-white/20 rounded-full" />
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse" />
                        </div>
                        <div className="w-full flex justify-around pl-12">
                            <span className="w-2 h-2 bg-white/30 rounded-full" />
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981] animate-pulse" />
                        </div>
                        <div className="w-full flex justify-between pr-24">
                            <span className="w-1.5 h-1.5 bg-[#afff00] rounded-full shadow-[0_0_10px_#afff00] animate-pulse" />
                            <span className="w-2 h-2 bg-white/10 rounded-full" />
                        </div>
                    </div>

                    {/* Overlay Box */}
                    <div className="relative z-10 bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-8 shadow-2xl">
                        <div className="flex flex-col text-left">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Supported Regions</span>
                            <span className="font-black text-3xl text-white">150+</span>
                        </div>
                        <div className="w-[1px] h-12 bg-white/10" />
                        <div className="flex flex-col text-left">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Payment Methods</span>
                            <span className="font-black text-3xl text-[#afff00]">200+</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

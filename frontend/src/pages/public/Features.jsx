import React, { useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import HomeNavbar from '../../components/home/HomeNavbar';
import FeaturesFooter from '../../components/home/FeaturesFooter';
import { 
  Globe, Shield, Zap, 
  Terminal, Activity, Cpu
} from 'lucide-react';

const Features = () => {
    const { scrollYProgress } = useScroll();
    
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Parallax values for editorial feel
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

    return (
        <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#f5f0e8] text-[#1a1a2e] selection:bg-[#3d44f5] selection:text-white h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
        >
            <HomeNavbar scaleX={scaleX} />

            {/* --- HERO: MASSIVE EDITORIAL TYPOGRAPHY --- */}
            <section className="h-screen flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-20 pt-[70px] relative overflow-hidden snap-start">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.03] select-none">
                    <span className="text-[40vw] font-black leading-none uppercase tracking-tighter">DESIGN</span>
                </div>

                <div className="relative z-10 max-w-full">
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mb-8 block opacity-40">
                            System Infrastructure v2.1
                        </span>
                        <h1 className="text-[12vw] md:text-[10vw] font-black tracking-tighter leading-[0.85] uppercase mb-12">
                            Precision <br />
                            <span className="text-[#3d44f5] italic font-serif normal-case tracking-tight">Engineering.</span>
                        </h1>
                    </motion.div>

                    <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="max-w-md text-lg md:text-xl font-medium leading-tight opacity-70"
                        >
                            We build the next generation of financial tools 
                            with mission-critical integrity and cinematic depth.
                        </motion.p>
                        
                        <motion.div 
                            style={{ rotate }}
                            className="hidden md:block w-32 h-32 border-2 border-[#1a1a2e]/10 rounded-full flex items-center justify-center relative"
                        >
                            <div className="absolute inset-2 border border-dashed border-[#1a1a2e]/20 rounded-full animate-spin-slow" />
                            <Cpu className="w-8 h-8 opacity-20" />
                        </motion.div>
                    </div>
                </div>

                {/* Vertical Marquee Tag */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 origin-right pr-20 hidden lg:block">
                    <span className="text-[14px] font-black uppercase tracking-[1em] opacity-10 whitespace-nowrap">
                        HIGH FIDELITY PROTOCOL — 2026
                    </span>
                </div>
            </section>
            {/* --- FEATURE ARC 02: GLOBAL ARCHITECTURE --- */}
            <section className="min-h-screen md:h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 pt-[70px] bg-[#1a1a2e] text-white snap-start py-10 md:py-16">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16 mb-12 md:mb-16 lg:mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="max-w-2xl text-center lg:text-left"
                    >
                        <span className="text-[#afff00] text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] mb-4 md:mb-6 block">Global Backbone</span>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-4 md:mb-6">
                            Revenue <br /> Architecture.
                        </h2>
                        <p className="text-white/60 text-base md:text-lg leading-relaxed">
                            Bank-grade financial rails wrapped in a cinematic interface. 
                            Direct settlement with zero-platform fees on every drop.
                        </p>
                    </motion.div>
                    
                    <div className="flex-1 flex justify-center">
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, 0]
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-80 h-80 relative"
                        >
                            <div className="absolute inset-0 border-4 border-[#afff00]/20 rounded-[4rem] rotate-12" />
                            <div className="absolute inset-0 border-4 border-white/10 rounded-[4rem] -rotate-6" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Shield className="w-32 h-32 text-[#afff00]" />
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Zap, label: "Instant Settle", desc: "Real-time revenue attribution with zero latency." },
                        { icon: Globe, label: "Edge Mesh", desc: "Global distribution across 18 high-performance node regions." },
                        { icon: Activity, label: "Live Telemetry", desc: "Deep packet inspection for every single transaction event." }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 md:p-8 lg:p-10 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] hover:bg-white/10 transition-colors group"
                        >
                            <item.icon className="w-8 h-8 md:w-9 lg:w-10 mb-4 md:mb-6 lg:mb-8 text-[#afff00] group-hover:scale-110 transition-transform" />
                            <h4 className="text-lg md:text-xl font-black uppercase tracking-tight mb-2 md:mb-4">{item.label}</h4>
                            <p className="text-white/40 text-[11px] md:text-xs lg:text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

             {/* --- SYSTEM INTEGRITY BENTO: THE OVERARCHING GRID --- */}
             <section className="min-h-screen md:h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 pt-[70px] snap-start py-8 md:py-10 text-[#1a1a2e]">
                <div className="text-center mb-6 md:mb-8 lg:mb-10">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-2">System Integrity.</h2>
                    <p className="text-[#3d44f5] font-serif italic text-lg md:text-xl">The complete technical architecture.</p>
                </div>

                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 min-h-0 md:max-h-[450px] lg:max-h-[550px]">
                    <div className="md:col-span-2 md:row-span-2 bg-white border border-[#1a1a2e]/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 lg:p-10 flex flex-col justify-between group shadow-xl overflow-hidden">
                        <Terminal className="w-10 h-10 md:w-12 md:h-12 text-[#3d44f5]" />
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 mb-4 block">Developer Layer</span>
                             <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-2 md:mb-4">Open <br /> Protocol.</h3>
                             <p className="text-base md:text-lg opacity-60 leading-tight max-w-sm mb-6 lg:mb-10">
                                Total control over your digital identity with open APIs, webhooks, 
                                and low-level system integrations.
                            </p>
                            <div className="p-6 bg-[#1a1a2e] rounded-3xl text-white font-mono text-xs">
                                <span className="text-[#afff00]">$</span> drope init --template=cinematic
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1 bg-[#afff00] rounded-[2rem] md:rounded-[2.5rem] p-6 lg:p-8 flex flex-col justify-between hover:rotate-2 transition-transform cursor-pointer">
                        <Zap className="w-6 h-6 md:w-8 md:h-8" />
                        <div>
                            <h4 className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none">High Velocity.</h4>
                            <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-tight opacity-60 mt-2 md:mt-4">10ms Global Average</p>
                        </div>
                    </div>

                    <div className="md:col-span-1 bg-[#3d44f5] text-white rounded-[2rem] md:rounded-[2.5rem] p-6 lg:p-8 flex flex-col justify-between hover:-rotate-2 transition-transform cursor-pointer">
                        <Shield className="w-6 h-6 md:w-8 md:h-8" />
                        <div>
                            <h4 className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none">Fortified.</h4>
                            <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-tight opacity-60 mt-2 md:mt-4">AES-256 System Wide</p>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-[#f5f0e8] border border-[#1a1a2e]/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex items-center justify-between">
                        <div className="max-w-xs">
                            <h4 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tighter uppercase mb-2 md:mb-3">Uptime SLA.</h4>
                            <p className="opacity-60 text-[10px] md:text-[11px] lg:text-sm leading-tight">Enterprise-grade reliability with guaranteed 99.99% system availability globally.</p>
                        </div>
                        <div className="text-3xl md:text-4xl lg:text-6xl font-serif italic text-[#3d44f5]">99.9</div>
                    </div>
                </div>
            </section>

            <FeaturesFooter />
        </motion.main>
    );
};

export default Features;

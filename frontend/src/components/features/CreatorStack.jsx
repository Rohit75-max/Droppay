import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Share2, Zap, Shield, MousePointer2, CheckCircle2, Monitor } from 'lucide-react';

const NarrativeBlock = ({ heading, copy, isMobile, visual }) => (
  <div className={`flex flex-col justify-center min-h-screen px-6 md:px-12 lg:px-24 ${isMobile ? 'py-12 md:py-20 gap-10' : ''}`}>
    <div>
        <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: "-20%" }}
            className="text-3xl md:text-6xl font-black tracking-tighter uppercase text-white mb-6"
        >
            {heading}
        </motion.h3>
        <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-20%" }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-sm md:text-xl leading-relaxed max-w-md font-medium"
        >
            {copy}
        </motion.p>
    </div>
    {isMobile && visual}
  </div>
);

// Statless Sub-Components for the Visual Canvas
const StateOBS = ({ opacity, scale }) => (
    <motion.div style={{ opacity, scale }} className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <div className="w-full h-64 bg-black border-2 border-white/10 rounded-2xl relative overflow-hidden shadow-2xl">
            <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500/50" /><div className="w-2 h-2 rounded-full bg-yellow-500/50" /><div className="w-2 h-2 rounded-full bg-green-500/50" />
               <span className="text-[8px] font-mono text-white/20 ml-2 uppercase tracking-widest leading-none">obs_studio_pro</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
                <div className="h-4 w-1/3 bg-white/5 rounded-full" /><div className="h-4 w-1/2 bg-white/5 rounded-full" />
                <div className="h-12 w-full border-2 border-dashed border-[#afff00]/30 rounded-xl flex items-center justify-center bg-[#afff00]/5 group">
                    <span className="text-[9px] font-black text-[#afff00]/40 uppercase tracking-widest">Paste Webhook URL Here</span>
                </div>
            </div>
        </div>
        <motion.div animate={{ x: [100, 0], y: [100, 0], scale: [0.8, 1], rotate: [10, 0] }} transition={{ duration: 1.2, delay: 0.5, ease: "circOut" }}
            className="absolute bottom-16 right-16 bg-[#afff00] text-black px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-20"
        >
            <Share2 className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">drope.cc/live/rohit</span><MousePointer2 className="w-5 h-5 absolute -right-3 -bottom-3 text-white drop-shadow-lg" />
        </motion.div>
        <div className="absolute top-10 right-10 opacity-10 rotate-12"><Monitor className="w-24 h-24 text-white" /></div>
    </motion.div>
);

const StateZap = ({ opacity, scale }) => (
    <motion.div style={{ opacity, scale }} className="absolute inset-0 flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
             {[...Array(8)].map((_, i) => (
                 <motion.div key={i} initial={{ x: -800 }} animate={{ x: 800 }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
                     className="absolute h-[1px] w-64 bg-[#afff00]" style={{ top: `${15 + i * 10}%` }}
                 />
             ))}
        </div>
        <div className="relative z-10 text-center">
            <Zap className="w-24 h-24 text-[#afff00] mx-auto mb-6 drop-shadow-[0_0_40px_#afff00]" />
            <h4 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">Hype<br /><span className="text-[#afff00]">Synced.</span></h4>
            <div className="mt-8 px-6 py-3 bg-[#afff00]/10 rounded-full border border-[#afff00]/30 backdrop-blur-xl">
                 <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#afff00]">Edge Network // &lt; 80MS</span>
            </div>
        </div>
    </motion.div>
);

const StateShield = ({ opacity, scale, y }) => (
    <motion.div style={{ opacity, scale, y }} className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <div className="relative">
            <motion.div animate={{ rotateY: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity }} className="relative z-10 w-48 h-64 bg-white/5 border-2 border-white/20 rounded-[3.5rem] backdrop-blur-3xl flex flex-col items-center justify-center shadow-2xl p-6">
                <Shield className="w-28 h-28 text-[#afff00] mb-6 drop-shadow-[0_0_50px_rgba(175,255,0,0.4)]" />
                <div className="text-center"><span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2 block">System Rank</span><span className="text-2xl font-black text-[#afff00] tracking-tighter uppercase">Vault Tier</span></div>
            </motion.div>
            <div className="absolute inset-0 bg-[#afff00]/10 blur-[120px] -z-10 rounded-full animate-pulse" />
        </div>
        <motion.div initial={{ opacity: 0, scale: 2 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: 'spring' }} className="absolute bottom-10 right-10 bg-black border-2 border-[#afff00] text-[#afff00] px-8 py-5 rounded-2xl rotate-12 flex items-center gap-4 shadow-2xl z-20">
            <CheckCircle2 className="w-8 h-8" /><div className="flex flex-col"><span className="text-[10px] font-black uppercase tracking-widest opacity-50">Identity</span><span className="text-lg font-black uppercase tracking-tighter italic">Verified</span></div>
        </motion.div>
    </motion.div>
);

export const CreatorStack = ({ scrollContainerRef }) => {
    const targetRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        container: scrollContainerRef,
        offset: ["start start", "end end"]
    });

    // --- REFINED INTERPOLATION RANGES ---
    const opacityOBS = useTransform(scrollYProgress, [0, 0.28, 0.35], [1, 1, 0]);
    const scaleOBS = useTransform(scrollYProgress, [0, 0.28, 0.35], [1, 1, 0.85]);

    const opacityZap = useTransform(scrollYProgress, [0.3, 0.38, 0.62, 0.7], [0, 1, 1, 0]);
    const scaleZap = useTransform(scrollYProgress, [0.3, 0.38, 0.62, 0.7], [0.85, 1, 1, 0.85]);

    const opacityShield = useTransform(scrollYProgress, [0.65, 0.75, 1], [0, 1, 1]);
    const scaleShield = useTransform(scrollYProgress, [0.65, 0.75, 1], [0.85, 1, 1]);
    const yShield = useTransform(scrollYProgress, [0.65, 0.75], [80, 0]);

    return (
        <section ref={targetRef} className={`relative bg-[#0A0A0A] no-snap-section z-10 ${isMobile ? '' : 'h-[300vh]'}`}>
            {!isMobile ? (
                <div className="flex flex-col lg:flex-row items-start justify-start w-full relative">
                    {/* Left Column Narrative */}
                    <div className="w-full lg:w-1/2 relative bg-[#0A0A0A] z-20">
                        <NarrativeBlock heading="ZERO-FRICTION SETUP." copy="No coding. No complex APIs. Just copy your Drope Webhook URL, paste it into OBS as a browser source, and you are live. We bridge your audience to your bank in 60 seconds." />
                        <NarrativeBlock heading="HYPER-SYNCED ALERTS." copy="Powered by edge-network routing. The exact millisecond a viewer hits send, your stream lights up. 99.99% global uptime means you never miss a donation." />
                        <NarrativeBlock heading="BULLETPROOF REVENUE." copy="Stop stressing over chargeback scams. Drope utilizes bank-grade transaction shielding to protect your account. Focus on your content; we’ll guard the vault." />
                    </div>
                    
                    {/* Sticky Visual Canvas */}
                    <div className="sticky top-0 h-screen w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-20 bg-[#0A0A0A] lg:bg-transparent z-40 overflow-hidden">
                        <div className="relative w-full aspect-square max-w-lg lg:max-w-xl bg-white/[0.02] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(175,255,0,0.05)] backdrop-blur-3xl flex items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#afff0008,transparent_70%)]" />
                            <StateOBS opacity={opacityOBS} scale={scaleOBS} />
                            <StateZap opacity={opacityZap} scale={scaleZap} />
                            <StateShield opacity={opacityShield} scale={scaleShield} y={yShield} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col">
                    <NarrativeBlock isMobile heading="ZERO-FRICTION SETUP." copy="No coding. No complex APIs." 
                        visual={<div className="w-full aspect-square relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden flex items-center justify-center"><StateOBS opacity={1} scale={1} /></div>} 
                    />
                    <NarrativeBlock isMobile heading="HYPER-SYNCED ALERTS." copy="Direct edge-network routing." 
                        visual={<div className="w-full aspect-square relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden flex items-center justify-center"><StateZap opacity={1} scale={1} /></div>} 
                    />
                    <NarrativeBlock isMobile heading="BULLETPROOF REVENUE." copy="Transaction shielding vault." 
                        visual={<div className="w-full aspect-square relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden flex items-center justify-center"><StateShield opacity={1} scale={1} y={0} /></div>} 
                    />
                </div>
            )}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
    );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Zap, Trophy, ArrowRight } from 'lucide-react';

const CATEGORIES = [
    { id: 'all', label: 'ALL_UPDATES', icon: Layers },
    { id: 'platform', label: 'PLATFORM_V2', icon: Zap },
    { id: 'growth', label: 'GROWTH_STRAT', icon: Trophy }
];

const PATCH_NOTES = [
    {
        id: 'pn-1',
        category: 'platform',
        title: 'PROTOCOL_V2: REAL_TIME_LIQUIDITY',
        excerpt: "Our core settlement engine has been overhauled with the new Nitro-Loom protocol, reducing payout latency to sub-100ms. Creators now receive drops instantly across all unified payment rails.",
        date: 'MAR_28_2026',
        staticImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop',
        previewVideo: 'https://cdn.pixabay.com/vimeo/329124434/abstract-liquid-animation-low-poly-mesh-21829.mp4?width=1280&hash=8f813353457a44fef2b4b455b5d15a519213bc5e'
    },
    {
        id: 'pn-2',
        category: 'growth',
        title: 'DROPE_MULTIPLIER: RETENTION_ENGINE',
        excerpt: "Introducing the standard-grade 'Retention Loom'. New mission-based missions allow you to reward long-term viewers with automated shard-drops and tactical tier unlocks.",
        date: 'MAR_25_2026',
        staticImage: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
        previewVideo: 'https://cdn.pixabay.com/vimeo/328960241/data-stream-binary-code-matrix-digital-technology-21558.mp4?width=1280&hash=8f4e6e6a17b8f9e6a1d8a9b2b4b4b4b4b4b4b4b4'
    },
    {
        id: 'pn-3',
        category: 'platform',
        title: 'AERO_GLASS_UI: PERFORMANCE_BOOST',
        excerpt: "Global rollout of the high-fidelity Aero-Glass render system. Experience sub-zero UI lag and intensified visual state machines across the entire Droppay dashboard ecosystem.",
        date: 'MAR_20_2026',
        staticImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2070&auto=format&fit=crop',
        previewVideo: 'https://cdn.pixabay.com/vimeo/197368735/aurora-borealis-northern-lights-night-sky-stars-6537.mp4?width=1280&hash=8f4e6e6a17b8f9e6a1d8a9b2b4b4b4b4b4b4b4b4'
    }
];

const PatchNotesCard = ({ note }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.article
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative bg-[#0A0A0A] border-2 border-white/5 hover:border-[#afff00]/40 transition-all duration-700 p-1 flex flex-col md:flex-row gap-6 mb-12"
        >
            {/* Hover-to-Play Media Container */}
            <div className="relative w-full md:w-80 aspect-video md:aspect-[4/3] overflow-hidden bg-black shrink-0">
                <AnimatePresence mode="wait">
                    {/* Placeholder Logic: Switching from Image to Video Loop */}
                    {!isHovered ? (
                        <motion.img
                            key="static"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            src={note.staticImage}
                            className="w-full h-full object-cover grayscale brightness-50"
                            alt={note.title}
                        />
                    ) : (
                        <motion.video
                            key="video"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            src={note.previewVideo}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    )}
                </AnimatePresence>

                {/* Tactical HUD Overlay (Only on entry/idle) */}
                {!isHovered && (
                    <div className="absolute inset-0 z-10 p-4 flex flex-col justify-between pointer-events-none">
                        <span className="text-[9px] font-black font-mono text-[#afff00] tracking-widest opacity-60">ID: {note.id}</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#afff00] animate-pulse" />
                            <span className="text-[9px] font-black font-mono text-white/40 tracking-widest uppercase">READY_FOR_PREVIEW</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Sidebar Overlaying the Body */}
            <div className="p-6 flex flex-col justify-center gap-4">
                <div className="flex items-baseline gap-4">
                    <span className="text-[10px] font-black font-mono text-[#afff00] uppercase tracking-[0.3em]">{note.category}</span>
                    <span className="text-[10px] font-black font-mono text-white/20 uppercase tracking-[0.3em]">{note.date}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-[#afff00] transition-colors">
                    {note.title}
                </h3>
                <p className="text-sm font-medium text-white/40 leading-relaxed max-w-xl">
                    {note.excerpt}
                </p>
                <div className="pt-4">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-[#afff00] transition-colors group/btn">
                        READ_FULL_LOGS <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.article>
    );
};

export const PatchNotesHub = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredNotes = activeFilter === 'all' 
        ? PATCH_NOTES 
        : PATCH_NOTES.filter(n => n.category === activeFilter);

    return (
        <section className="relative py-24 px-6 md:px-12 lg:px-16 bg-black border-t border-white/5">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* 1. THE COMMAND CENTER (Sticky Sidebar - 25%) */}
                <div className="lg:col-span-3">
                    <div className="sticky top-24 space-y-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-[2px] bg-[#afff00]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">COMMAND_CENTER</span>
                            </div>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                                PATCH <br /> <span className="text-[#afff00]">NOTES.</span>
                            </h2>
                        </div>

                        {/* Aero-Glass Toggle Pills */}
                        <div className="flex flex-col gap-3">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveFilter(cat.id)}
                                    className={`relative group px-6 py-4 rounded-sm flex items-center gap-4 transition-all duration-300 border ${
                                        activeFilter === cat.id 
                                            ? 'bg-[#afff00]/10 border-[#afff00]/40 shadow-[0_0_20px_rgba(175,255,0,0.1)]' 
                                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <cat.icon className={`w-4 h-4 ${activeFilter === cat.id ? 'text-[#afff00]' : 'text-white/40'}`} />
                                    <span className={`text-[10px] font-black font-mono tracking-widest ${
                                        activeFilter === cat.id ? 'text-[#afff00]' : 'text-white/40'
                                    }`}>
                                        {cat.label}
                                    </span>
                                    {activeFilter === cat.id && (
                                        <motion.div 
                                            layoutId="pill-glow" 
                                            className="absolute inset-0 rounded-sm border-2 border-[#afff00] opacity-40"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="pt-12 border-t border-white/5 space-y-4">
                            <span className="text-[8px] font-black font-mono text-white/20 tracking-tighter block uppercase">SYSTEM_METRICS</span>
                            <div className="flex justify-between text-[8px] font-black font-mono text-white/40 uppercase">
                                <span>TOTAL_LOGS</span>
                                <span>124_NODES</span>
                            </div>
                            <div className="h-1 bg-white/5 overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    className="h-full bg-[#afff00] shadow-[0_0_10px_#afff00]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. THE MAIN FEED (75%) */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="popLayout">
                        {filteredNotes.map((note) => (
                            <PatchNotesCard key={note.id} note={note} />
                        ))}
                    </AnimatePresence>
                    
                    {/* Infinite Scroll Tactical Placeholder */}
                    <div className="pt-24 flex items-center justify-center">
                        <button className="px-16 py-6 border-2 border-white/5 bg-white/2 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:bg-[#afff00] hover:text-black hover:border-[#afff00] transition-all duration-500">
                            FETCH_LEGACY_LOGS(0xFF)
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

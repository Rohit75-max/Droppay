import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Plus, Minus, ArrowRight, Shield, Zap, Globe, Cpu } from 'lucide-react';

import HomeNavbar from '../components/home/HomeNavbar';
import PricingFooter from '../components/home/PricingFooter';

// --- DATA: SUBSCRIPTION LAYERS ---
const TIERS = [
    {
        tier: "Starter",
        price: 999,
        tagline: "For New Creators",
        fee: "15%",
        features: ["15% Commission Rate", "Weekly Payouts", "Secure Transactions", "Priority Processing", "Standard Support"]
    },
    {
        tier: "Pro",
        price: 1999,
        tagline: "For Growing Professionals",
        fee: "10%",
        features: ["10% Commission Rate", "48hr Settlements", "Advanced Security", "High-Speed Processing", "Priority Support"]
    },
    {
        tier: "Legend",
        price: 2999,
        tagline: "For Agencies & Studios",
        fee: "5%",
        features: ["5% Commission Rate*", "Instant Payouts", "Enterprise Security", "Ultra-Low Latency", "24/7 Dedicated Support"]
    }
];


// --- ANIMATION VARIANTS ---
const charVariants = {
    hidden: { y: '100%', rotateZ: 10, opacity: 0 },
    visible: i => ({
        y: 0,
        rotateZ: 0,
        opacity: 1,
        transition: {
            delay: i * 0.02,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
        }
    })
};

const StaggerText = ({ text, className, style }) => {
    return (
        <div className={`flex ${className}`} style={style}>
            {text.split("").map((char, i) => (
                <span key={i} className="inline-block overflow-hidden pb-2">
                    <motion.span
                        custom={i}
                        variants={charVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                </span>
            ))}
        </div>
    );
};


const FAQItem = ({ question, answer, isOpen, onClick }) => (
    <div className="border-b border-black/10 py-10 last:border-none">
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between text-left group"
        >
            <span className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none group-hover:text-[#3d44f5] transition-colors font-serif">
                {question}
            </span>
            <div className={`transition-transform duration-500 w-12 h-12 rounded-full border border-black/10 flex items-center justify-center ${isOpen ? 'rotate-180 bg-[#0b2e2b] text-white' : ''}`}>
                {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                >
                    <p className="pt-8 text-xl opacity-60 leading-relaxed max-w-2xl">
                        {answer}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// --- COMPONENT: LOCAL BENTO ENGINE (1:1 MIRROR OF HOMEPAGE) ---
const LocalPricingBento = () => {
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [billing, setBilling] = useState('monthly');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const comicFont = { fontFamily: '"Comic Sans MS", "Comic Sans", cursive' };

    const handleCardClick = (e, idx) => {
        e.stopPropagation();
        if (selectedIdx !== idx) {
            setSelectedIdx(idx);
        }
    };

    const UNIT = 70;
    const boxConfigs = [
        {
            tier: "Starter",
            width: 3 * UNIT,
            expandedWidth: 450,
            priceMonthly: 999,
            price6Month: 5095,
            priceYearly: 9590,
            top: 180,
            left: 0,
            fixedCorner: "TL",
            activeBg: "#e5e5e5",
            activeText: "text-black",
            fee: "15%",
            commission: "2.0%",
            benefits: ["Basic Analytics", "24/7 Support", "Secure Vault"],
            extensions: [
                { side: 'top', type: 'h', prop: 'left', base: -20, grow: -80 },
                { side: 'top', type: 'h', prop: 'right', base: -20, grow: -20 },
                { side: 'left', type: 'v', prop: 'top', base: -40, grow: -80 },
                { side: 'left', type: 'v', prop: 'bottom', base: -20, grow: -20 },
                { side: 'bottom', type: 'h', prop: 'left', base: -40, grow: -100 }
            ]
        },
        {
            tier: "Pro",
            width: 4 * UNIT,
            expandedWidth: 500,
            priceMonthly: 1999,
            price6Month: 10195,
            priceYearly: 19190,
            top: 40,
            left: 3 * UNIT,
            fixedCorner: "TL",
            activeBg: "#3139fb",
            activeText: "text-white",
            fee: "10%",
            commission: "2.0%",
            benefits: ["Everything in Starter +", "Advanced Insights", "Priority Support", "Custom Branding"],
            extensions: [
                { side: 'top', type: 'h', prop: 'right', base: -40, grow: -120 },
                { side: 'right', type: 'v', prop: 'top', base: -20, grow: -60 },
                { side: 'right', type: 'v', prop: 'bottom', base: -20, grow: -40 }
            ]
        },
        {
            tier: "Legend",
            width: 5 * UNIT,
            expandedWidth: 550,
            priceMonthly: 2999,
            price6Month: 15295,
            priceYearly: 28790,
            top: 170,
            left: 7 * UNIT,
            fixedCorner: "TR",
            activeBg: "#fbbf24",
            activeText: "text-black",
            fee: "5%",
            commission: "2.0%",
            benefits: ["Everything in Pro +", "Dedicated Manager", "Full API Access", "Unlimited Scale"],
            extensions: [
                { side: 'right', type: 'v', prop: 'top', base: -20, grow: -100 },
                { side: 'right', type: 'v', prop: 'bottom', base: -60, grow: -150 },
                { side: 'bottom', type: 'h', prop: 'right', base: -60, grow: -120 },
                { side: 'bottom', type: 'h', prop: 'left', base: -20, grow: -40 }
            ]
        }
    ];

    const getSectionBg = () => {
        if (selectedIdx === null) return 'var(--arc-cream)';
        if (selectedIdx === 1) return '#4a51fb';
        if (selectedIdx === 2) return '#fef3c7';
        return boxConfigs[selectedIdx].activeBg;
    };

    const isDarkSection = selectedIdx === 1;
    const textColor = isDarkSection ? 'text-white' : 'text-[#111111]';

    return (
        <motion.section
            animate={{ backgroundColor: getSectionBg() }}
            transition={{ duration: 0.8 }}
            className="relative w-full flex flex-col items-center overflow-hidden select-none transition-colors px-6 py-8"
            onClick={() => setSelectedIdx(null)}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[1280px] mx-auto text-center mb-8 relative z-20"
            >
                <div className="mt-10 flex flex-wrap justify-center items-center gap-4 md:gap-8">
                    <button
                        onClick={(e) => { e.stopPropagation(); setBilling('monthly'); }}
                        className={`text-[10px] font-black uppercase tracking-widest transition-all ${textColor} ${billing === 'monthly' ? 'underline underline-offset-8 text-[#10b981]' : 'opacity-60 hover:opacity-100'}`}
                    >
                        Monthly
                    </button>
                    <div className={`hidden md:block w-1 h-1 rounded-full ${isDarkSection ? 'bg-white/20' : 'bg-black/20'}`} />
                    <button
                        onClick={(e) => { e.stopPropagation(); setBilling('6month'); }}
                        className={`text-[10px] font-black uppercase tracking-widest transition-all ${textColor} ${billing === '6month' ? 'underline underline-offset-8 text-[#10b981]' : 'opacity-60 hover:opacity-100'}`}
                    >
                        6 Months
                    </button>
                    <div className={`hidden md:block w-1 h-1 rounded-full ${isDarkSection ? 'bg-white/20' : 'bg-black/20'}`} />
                    <button
                        onClick={(e) => { e.stopPropagation(); setBilling('yearly'); }}
                        className={`text-[10px] font-black uppercase tracking-widest transition-all ${textColor} ${billing === 'yearly' ? 'underline underline-offset-8 text-[#10b981]' : 'opacity-60 hover:opacity-100'}`}
                    >
                        Yearly
                    </button>
                    <AnimatePresence mode="wait">
                        {billing !== 'monthly' && (
                            <motion.span
                                key={billing}
                                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                                className="text-[9px] bg-[#afff00] text-black px-2 py-1 rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] font-black inline-block ml-2 pointer-events-none"
                            >
                                SAVE {billing === '6month' ? '15%' : '20%'}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
                <motion.div
                    animate={{
                        opacity: selectedIdx !== null ? 0.4 : 0.15,
                        scale: selectedIdx !== null ? 1.5 : 1,
                        background: selectedIdx === 1
                            ? 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)'
                            : selectedIdx === 2
                                ? 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)'
                                : 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)'
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] z-0 blur-[100px]"
                />
                {/* Technical Blueprint Grid Pattern (Reactive) */}
                <motion.div
                    animate={{
                        opacity: selectedIdx === 1 ? 0.08 : 0.04,
                        backgroundImage: selectedIdx === 1
                            ? `linear-gradient(#fff 1.5px, transparent 1.5px), linear-gradient(90deg, #fff 1.5px, transparent 1.5px)`
                            : `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`
                    }}
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundSize: '40px 40px'
                    }}
                />
                {[
                    { Icon: Shield, top: '15%', left: '10%', rotate: 15, delay: 0, scale: 1.2 },
                    { Icon: Zap, bottom: '20%', right: '5%', rotate: -15, delay: 1, scale: 0.8 },
                    { Icon: Globe, top: '60%', left: '5%', rotate: 10, delay: 0.5, scale: 1.5 },
                    { Icon: Cpu, top: '10%', right: '15%', rotate: -10, delay: 2, scale: 1 },
                ].map((asset, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: selectedIdx === 1 ? 0.12 : 0.08,
                            y: [0, -40, 0],
                            rotate: asset.rotate,
                            color: selectedIdx === 1 ? '#ffffff' : '#000000'
                        }}
                        transition={{
                            y: { duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: asset.delay },
                            opacity: { duration: 1, delay: 1 }
                        }}
                        style={{
                            position: 'absolute', top: asset.top, left: asset.left,
                            right: asset.right, bottom: asset.bottom,
                            transform: `scale(${asset.scale})`
                        }}
                        className="pointer-events-none"
                    >
                        <asset.Icon className="w-24 h-24 stroke-[0.5]" />
                    </motion.div>
                ))}
                <motion.div
                    animate={{ opacity: selectedIdx === 1 ? 0.06 : 0.03 }}
                    className="absolute inset-0 z-0"
                >
                    <div className={`absolute top-0 left-1/4 w-px h-full ${selectedIdx === 1 ? 'bg-white' : 'bg-black'} -rotate-45 transform origin-top`} />
                    <div className={`absolute top-0 right-1/4 w-px h-full ${selectedIdx === 1 ? 'bg-white' : 'bg-black'} rotate-45 transform origin-top`} />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`relative max-w-full mx-auto z-10 mt-4 outline-none ${isMobile
                    ? `w-[360px] ${selectedIdx !== null ? 'h-[460px]' : 'h-[380px]'} scale-[0.90] origin-top transition-all duration-300`
                    : 'w-[840px] h-[640px] scale-[0.60] sm:scale-[0.80] md:scale-[0.90] lg:scale-100 origin-top lg:origin-center md:mt-2'
                    }`}
            >
                {TIERS.map((tier, idx) => {
                    const config = boxConfigs[idx];
                    const isSelected = selectedIdx === idx;
                    let leftPos = config.left;
                    let currentWidth = config.width;
                    let currentTop = config.top;
                    let unselectedHeight = config.width;

                    if (isMobile) {
                        unselectedHeight = 160;
                        if (idx === 0) { currentWidth = 160; leftPos = 10; currentTop = 100; }
                        else if (idx === 1) { currentWidth = 160; leftPos = 180; currentTop = 0; }
                        else if (idx === 2) { currentWidth = 160; leftPos = 180; currentTop = 170; }
                        if (isSelected) { currentWidth = 340; leftPos = 10; currentTop = -20; }
                    } else if (isSelected) {
                        currentWidth = config.expandedWidth;
                        if (config.fixedCorner === "TR") {
                            leftPos = config.left - (config.expandedWidth - config.width);
                        }
                    }

                    return (
                        <motion.div
                            key={tier.tier}
                            layout
                            animate={{
                                width: currentWidth,
                                left: leftPos,
                                top: currentTop,
                                zIndex: isSelected ? 50 : 10,
                                height: isSelected ? (isMobile ? 460 : 420) : unselectedHeight,
                                backgroundColor: isSelected ? config.activeBg : 'var(--arc-cream-alt)',
                                borderColor: isSelected ? (config.tier === 'Pro' ? '#fff' : '#000') : config.activeBg
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: isMobile ? 25 : 30 }}
                            onClick={(e) => handleCardClick(e, idx)}
                            className={`absolute p-6 md:p-10 flex flex-col justify-between cursor-pointer border-2 shadow-sm
                         ${isSelected ? 'ring-1 ring-black/10' : ''}
                         overflow-hidden group`}
                        >
                            <div className="absolute inset-0 pointer-events-none">
                                {config.extensions.map((line, lIdx) => (
                                    <motion.div
                                        key={lIdx}
                                        animate={{
                                            [line.prop]: isSelected ? line.grow : line.base,
                                            backgroundColor: (isSelected && config.tier === 'Pro') ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)'
                                        }}
                                        className={`absolute ${line.side}-0 ${line.type === 'h' ? 'h-px' : 'w-px'}`}
                                        style={{ [line.side]: 0 }}
                                    />
                                ))}
                            </div>

                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex-1 flex flex-col pt-2 relative z-10"
                                    >
                                        <div className="flex flex-col gap-1 mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`px-2 py-1 border-2 font-black text-[10px] uppercase tracking-tighter shadow-[2px_2px_0px_#000] rotate-[-2deg]
                                        ${config.tier === 'Pro' ? 'border-white text-white' : 'border-black text-black'}`}>
                                                    Fee
                                                </div>
                                                <span className={`text-4xl font-bold italic tracking-tighter ${config.tier === 'Pro' ? 'text-white' : 'text-black'}`} style={comicFont}>
                                                    {config.fee}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {config.benefits.map((benefit, bIdx) => (
                                                <div key={bIdx} className="flex items-center gap-2 group">
                                                    <div className={`w-1 h-1 rounded-full ${config.tier === 'Pro' ? 'bg-white/40' : 'bg-black/20'}`} />
                                                    <span className={`text-[11px] font-bold uppercase tracking-widest ${config.tier === 'Pro' ? 'text-white/70' : 'text-black/60'} group-hover:translate-x-1 transition-transform`} style={comicFont}>
                                                        {benefit}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!isSelected && (
                                <div className="flex-1 flex flex-col pt-0 mt-[-15px]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`px-2 py-1 border-2 border-black font-black text-[9px] uppercase tracking-tighter shadow-[2px_2px_0px_#000] rotate-[-4deg] bg-white opacity-60`}>
                                            Trial
                                        </div>
                                        <span className="text-xl font-black italic tracking-tighter opacity-80 uppercase whitespace-nowrap" style={comicFont}>
                                            7-Day
                                        </span>
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.1em] opacity-40 leading-relaxed max-w-[170px] mb-auto" style={comicFont}>
                                        {tier.tagline}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between items-end pointer-events-none">
                                <div className="flex flex-col">
                                    <motion.h3 layout className={`${isSelected ? 'text-6xl' : 'text-xl'} font-bold tracking-tighter ${isSelected ? config.activeText : 'text-black'} leading-none mb-2`} style={comicFont}>
                                        {tier.tier}.
                                    </motion.h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`${isSelected ? 'text-4xl md:text-5xl' : 'text-xl'} font-bold tracking-tight ${isSelected ? config.activeText : 'text-black'} italic transition-all`} style={comicFont}>
                                            ₹{isSelected ? (billing === 'monthly' ? config.priceMonthly : billing === '6month' ? config.price6Month : config.priceYearly) : config.priceMonthly}
                                        </span>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                            className={`w-20 h-20 rounded-full flex items-center justify-center p-4 shadow-xl pointer-events-auto cursor-pointer hover:scale-110 active:scale-95 transition-all ${config.tier === 'Pro' ? 'bg-white text-[#3139fb]' : 'bg-black text-white'}`}
                                        >
                                            <ArrowRight className="w-10 h-10" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )
                })}
            </motion.div>
        </motion.section>
    );
};

const Pricing = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        { q: "Revenue Splits?", a: "Droppay takes zero platform fees. Only standard 1-3.5% transaction fees apply depending on your tier. We settle directly to your connected bank/wallet." },
        { q: "Can I Scale Up?", a: "Upgrade anytime. Our edge network automatically adjusts your priority routing to ensure zero latency as your audience grows." },
        { q: "What about VAT?", a: "Tax handling is automated. We calculate region-specific obligations at checkout so you don't have to manage international compliance." }
    ];

    return (
        <motion.main
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0b2e2b] text-[#1a1a2e] selection:bg-[#afff00] selection:text-black relative"
            style={{ fontFamily: 'Inter, sans-serif' }}
        >
            <HomeNavbar />

            {/* --- HERO: STICKY TOP LAYER --- */}
            <section className="sticky top-[var(--nav-height)] h-screen-fit bg-[#f2f0e8] z-30 flex flex-col justify-center px-6 md:px-12 lg:px-16 overflow-hidden">
                
                {/* --- TECHNICAL BACKGROUND FX layer --- */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                    <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
                    <div className="absolute top-0 left-[10%] w-px h-full bg-black" />
                    <div className="absolute top-[20%] left-0 w-full h-px bg-black" />
                </div>

                {/* --- CORNER TECHNICAL STAMPS --- */}
                <div className="absolute top-12 left-12 hidden lg:block pointer-events-none">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">DR / 8.2.1-75</span>
                </div>
                <div className="absolute bottom-12 right-12 hidden lg:block pointer-events-none">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">SETTLEMENT_LAYER_V.2</span>
                </div>

                <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="max-w-[90vw] mx-auto text-center md:text-left relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="cursor-default"
                    >
                        <StaggerText
                            text="SIMPLE."
                            className="text-[15vw] md:text-[12vw] font-black tracking-tighter uppercase leading-[0.8] mb-4"
                        />
                    </motion.div>
                    
                    <div className="flex flex-col md:flex-row items-baseline gap-4 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="cursor-default"
                        >
                            <StaggerText
                                text="TRANSPARENT."
                                className="text-[13vw] md:text-[10.5vw] font-black tracking-tighter uppercase leading-[0.8] whitespace-nowrap"
                            />
                        </motion.div>
                        <motion.span 
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, delay: 0.6, type: "spring" }}
                            className="text-4xl md:text-6xl font-serif italic text-[#10b981] tracking-tight"
                        >
                            Choice.
                        </motion.span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 0.7, y: 0 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="max-w-xl text-xl md:text-2xl font-medium leading-tight tracking-[-0.02em]"
                        >
                            Professional infrastructure for digital architects.
                            Choose your settlement layer and scale with precision.
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="hidden md:block"
                        >
                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-black/10 flex items-center justify-center animate-spin-slow">
                                <span className="text-[10px] font-black text-black/20 uppercase tracking-widest px-4 text-center">Scroll To Discover</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* --- BENTO: THE REVEALED LAYER --- */}
            <section className="relative z-10 pt-32 pb-10 bg-[#065f46]">
                <div className="text-center mb-10">
                    <h2 className="text-white text-[8vw] md:text-[4vw] font-black tracking-tighter uppercase leading-[0.9]">
                        Choose your Subscription
                    </h2>
                </div>

                <div className="relative z-10 w-full overflow-hidden">
                    <LocalPricingBento />
                </div>
            </section>


            {/* --- FAQ: TORN REVEAL BACK TO LIGHT --- */}
            <section className="relative z-20 py-20 bg-[#f2f0e8] px-6 md:px-12 lg:px-16 overflow-hidden">

                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-8 mb-32">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Clarification.</h2>
                        <div className="flex-1 h-px bg-black/10" />
                    </div>

                    <div className="space-y-2">
                        {faqs.map((faq, i) => (
                            <FAQItem
                                key={i}
                                question={faq.q}
                                answer={faq.a}
                                isOpen={openFaq === i}
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-full mt-32">
                    <PricingFooter />
                </div>
            </section>
        </motion.main>
    );
};

export default Pricing;

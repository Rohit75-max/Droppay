import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Zap, Globe, BarChart2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
    {
        icon: Bell,
        title: 'Instant Stream Alerts',
        desc: 'Fires to your OBS overlay the moment a payment lands — complete with donor name, amount, and message. Under one second, every time.',
        accent: '#afff00',
        tag: 'Core Feature',
    },
    {
        icon: Zap,
        title: 'Direct Payouts',
        desc: 'No more 48-hour holds. Earnings from every stream session settle to your account instantly — not next week.',
        accent: '#60a5fa',
        tag: 'Fan Favourite',
    },
    {
        icon: Globe,
        title: 'Global Payments',
        desc: 'Accept donations from 150+ countries. Viewers pay in their currency, you receive in yours. Zero friction on either side.',
        accent: '#f472b6',
        tag: 'Worldwide',
    },
    {
        icon: BarChart2,
        title: 'Real-Time Analytics',
        desc: 'See who is donating, when engagement spikes, and which content earns the most — all updated live during your stream.',
        accent: '#34d399',
        tag: 'Live Data',
    },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const FeaturesSection = () => {
    const navigate = useNavigate();

    return (
        <section id="features" className="relative bg-[#0A0A0A] text-white px-[clamp(1.5rem,5vw,4rem)] py-24 md:py-32 border-t border-white/5 overflow-hidden">

            {/* Subtle grid bg */}
            <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 max-w-2xl"
                >
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#afff00] mb-4 block">Platform Capabilities</span>
                    <h2 className="font-sans font-black text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.0] uppercase tracking-tighter text-white mb-4">
                        Everything a Streamer<br />
                        <span className="text-zinc-500">Actually Needs.</span>
                    </h2>
                    <p className="font-mono text-[clamp(10px,1.2vw,13px)] leading-relaxed tracking-wider text-zinc-500">
                        Built by creators, for creators. Every feature is designed around one question: will this make your stream better?
                    </p>
                </motion.div>

                {/* Feature cards grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14"
                >
                    {FEATURES.map((feat) => {
                        const Icon = feat.icon;
                        return (
                            <motion.div
                                key={feat.title}
                                variants={cardVariants}
                                className="group relative bg-[#111] border border-white/5 hover:border-white/15 rounded-2xl p-7 flex flex-col gap-5 transition-colors overflow-hidden"
                            >
                                {/* Glow on hover */}
                                <div
                                    className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                                    style={{ background: feat.accent }}
                                />

                                {/* Icon */}
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:-translate-y-1 duration-300"
                                    style={{ borderColor: `${feat.accent}30`, background: `${feat.accent}10` }}
                                >
                                    <Icon className="w-5 h-5" style={{ color: feat.accent }} />
                                </div>

                                {/* Tag */}
                                <span
                                    className="font-mono text-[7px] uppercase tracking-widest w-fit px-2 py-0.5 rounded-full border"
                                    style={{ color: feat.accent, borderColor: `${feat.accent}30`, background: `${feat.accent}10` }}
                                >
                                    {feat.tag}
                                </span>

                                {/* Content */}
                                <div className="flex flex-col gap-2 flex-1">
                                    <h3 className="font-sans font-black text-base uppercase tracking-tight text-white">
                                        {feat.title}
                                    </h3>
                                    <p className="font-mono text-[10px] leading-relaxed text-zinc-500">
                                        {feat.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex justify-center"
                >
                    <button
                        onClick={() => navigate('/features')}
                        className="group flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 hover:border-white/25 text-white rounded-full font-black uppercase tracking-widest text-[clamp(0.6rem,1.2vw,0.75rem)] hover:scale-105 transition-all"
                    >
                        Explore Full Platform
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesSection;

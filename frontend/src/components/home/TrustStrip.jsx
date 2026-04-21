import React from 'react';
import { motion } from 'framer-motion';

// Platform logos/icons as inline SVG for zero external dependency
const PLATFORMS = [
    {
        name: 'Twitch',
        color: '#9146FF',
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
            </svg>
        )
    },
    {
        name: 'YouTube',
        color: '#FF0000',
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
            </svg>
        )
    },
    {
        name: 'Kick',
        color: '#53FC18',
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M2 2h5v9l5-9h5l-6 10 6 10h-5l-5-9v9H2z" />
            </svg>
        )
    },
    {
        name: 'Discord',
        color: '#5865F2',
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.112 18.1.12 18.12a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
        )
    },
    {
        name: 'OBS Studio',
        color: '#302E3D',
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="5" />
            </svg>
        )
    },
    {
        name: 'Streamlabs',
        color: '#80F5D2',
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-7h2v5h-2v-5zm0-4h2v2h-2V9z" />
            </svg>
        )
    },
];

const STATS = [
    { value: '12,000+', label: 'Active Streamers' },
    { value: '$4.2M+', label: 'Paid Out This Month' },
    { value: '< 1s', label: 'Average Alert Speed' },
    { value: '2.5%', label: 'Industry-Low Commission' },
];

export const TrustStrip = () => {
    return (
        <section className="bg-[#0A0A0A] border-t border-white/5 border-b border-white/5 py-12 px-[clamp(1.5rem,5vw,4rem)] overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Social proof headline */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">
                        Trusted by creators streaming on
                    </p>
                </motion.div>

                {/* Platform logos row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="flex items-center justify-center flex-wrap gap-8 mb-14"
                >
                    {PLATFORMS.map((platform, i) => (
                        <motion.div
                            key={platform.name}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.07 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/15 transition-colors group"
                        >
                            <span style={{ color: platform.color }} className="opacity-70 group-hover:opacity-100 transition-opacity">
                                {platform.svg}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                {platform.name}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-white/[0.015]"
                        >
                            <span className="font-sans font-black text-[clamp(1.8rem,3vw,2.5rem)] text-white tracking-tighter mb-1">
                                {stat.value}
                            </span>
                            <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const COMPETITORS = [
    {
        name: 'Streamlabs Tips',
        rate: '2.9%',
        instant: false,
        obsAlert: false,
        multiPlatform: false,
        color: '#80F5D2',
        highlight: false,
    },
    {
        name: 'StreamElements',
        rate: '2.9%',
        instant: false,
        obsAlert: true,
        multiPlatform: false,
        color: '#FFA500',
        highlight: false,
    },
    {
        name: 'Ko-fi',
        rate: '0% (3% payment fee)',
        instant: false,
        obsAlert: false,
        multiPlatform: false,
        color: '#FF5F5F',
        highlight: false,
    },
    {
        name: 'Droppay',
        rate: '2.5%',
        instant: true,
        obsAlert: true,
        multiPlatform: true,
        color: '#afff00',
        highlight: true,
    },
];

const Tick = ({ val }) =>
    val ? (
        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
    ) : (
        <X className="w-4 h-4 text-zinc-700 mx-auto" />
    );

export const CommissionStrip = () => {
    return (
        <section className="bg-black text-white px-[clamp(1.5rem,5vw,4rem)] py-24 md:py-32 relative overflow-hidden border-t border-white/5">

            {/* Top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[15vh] bg-[#afff00]/5 blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-14 text-center"
                >
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#afff00] mb-4 block">Why Droppay</span>
                    <h2 className="font-sans font-black text-[clamp(2rem,4.5vw,4rem)] leading-[1.0] uppercase tracking-tighter text-white mb-4">
                        We Cost Less.<br />
                        <span className="text-zinc-500">We Move Faster.</span>
                    </h2>
                    <p className="font-mono text-[clamp(10px,1.2vw,13px)] tracking-wider text-zinc-500 max-w-lg mx-auto">
                        Side-by-side comparison. No fluff, no fine print.
                    </p>
                </motion.div>

                {/* Comparison table */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="w-full overflow-x-auto"
                >
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-4 pr-6 font-mono text-[9px] uppercase tracking-widest text-zinc-500">Platform</th>
                                <th className="py-4 px-4 font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-center">Commission</th>
                                <th className="py-4 px-4 font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-center">Instant Payout</th>
                                <th className="py-4 px-4 font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-center">OBS Alert</th>
                                <th className="py-4 px-4 font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-center">Multi-Platform</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMPETITORS.map((c, i) => (
                                <motion.tr
                                    key={c.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.08 }}
                                    className={`border-b transition-colors ${
                                        c.highlight
                                            ? 'border-[#afff00]/20 bg-[#afff00]/[0.04]'
                                            : 'border-white/5 hover:bg-white/[0.02]'
                                    }`}
                                >
                                    <td className="py-5 pr-6">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ background: c.color }}
                                            />
                                            <span className={`font-sans font-black text-sm tracking-tight ${c.highlight ? 'text-white' : 'text-zinc-400'}`}>
                                                {c.name}
                                            </span>
                                            {c.highlight && (
                                                <span className="bg-[#afff00] text-black text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                                                    Best
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                        <span className={`font-mono text-sm font-black ${c.highlight ? 'text-[#afff00]' : 'text-zinc-500'}`}>
                                            {c.rate}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4 text-center"><Tick val={c.instant} /></td>
                                    <td className="py-5 px-4 text-center"><Tick val={c.obsAlert} /></td>
                                    <td className="py-5 px-4 text-center"><Tick val={c.multiPlatform} /></td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5"
                >
                    <Link
                        to="/signup"
                        id="commission-strip-cta"
                        className="group px-10 py-5 bg-[#afff00] text-black font-black uppercase text-[12px] tracking-[0.2em] rounded-xl flex items-center gap-3 hover:scale-[1.02] shadow-[0_0_20px_rgba(175,255,0,0.15)] active:scale-95 transition-all"
                    >
                        Start Free — 2.5% Only
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/pricing"
                        className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors underline underline-offset-4"
                    >
                        View full pricing →
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

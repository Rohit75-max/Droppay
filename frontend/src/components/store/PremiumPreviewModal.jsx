import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Zap, Lock, Sparkles, Activity, Target, Wallet } from 'lucide-react';
import PremiumAlertPreview from '../PremiumAlertPreview';
import PremiumGoalOverlays from '../PremiumGoalOverlays';
import CyberGoalBar from '../CyberGoalBar';
import LiveThemeEngine from '../LiveThemeEngine';
import CruiserRevenueChart from '../widgets/CruiserRevenueChart';

const PREMIUM_GOAL_STYLES = [
    'black_hole', 'hex_core', 'rune_monolith', 'hologram_glitch',
    'alchemist_flask', 'redline_dash', 'loot_dispenser', 'mecha_lens'
];

const PremiumPreviewModal = ({ isOpen, onClose, item, onUnlock, theme }) => {
    if (!isOpen || !item) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-6xl h-[85vh] bg-[var(--nexus-panel)] border border-[var(--nexus-border)] flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                    style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-[var(--nexus-accent)] text-white transition-colors border border-[var(--nexus-border)] shadow-lg">
                        <X className="w-6 h-6" />
                    </button>

                    <div className={`w-full md:w-2/3 h-1/2 md:h-full relative border-r border-[var(--nexus-border)] flex items-center justify-center overflow-hidden ${theme === 'light' ? 'bg-slate-50' : 'bg-[#050505]'
                        }`}>
                        {item.category === 'themes' && (
                            <div className="absolute inset-0">
                                <LiveThemeEngine currentTheme={item.id} isPreview={true} />
                                <div className="relative z-10 w-full h-full p-8 flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <div className="w-1/4 h-64 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg" />
                                        <div className="flex-1 h-[500px] bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {item.category === 'alerts' && (
                            <div className={`w-full h-full relative flex flex-col items-center justify-center ${theme === 'light' ? 'bg-slate-50' : 'bg-[#050505]'}`}>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.05)_0%,transparent_70%)] pointer-events-none" />
                                <div className="relative z-10 w-full transform scale-75 md:scale-90 lg:scale-100 flex items-center justify-center">
                                    <PremiumAlertPreview
                                        donorName="Elite Donor"
                                        amount={parseInt(item.price.replace('₹', '')) || 2000}
                                        message="This is a live preview of the asset in action!"
                                        stylePreference={item.id}
                                    />
                                </div>
                            </div>
                        )}

                        {item.category === 'goals' && (
                            <div className={`w-full h-full relative flex flex-col items-center justify-center py-10 ${theme === 'light' ? 'bg-slate-50' : 'bg-[#050505]'}`}>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
                                <div className="relative z-10 w-full transform scale-90 md:scale-100">
                                    {PREMIUM_GOAL_STYLES.includes(item.id) ? (
                                        <PremiumGoalOverlays
                                            goal={{
                                                title: item.name,
                                                targetAmount: parseInt(item.price.replace('₹', '')) || 5000,
                                                currentProgress: (parseInt(item.price.replace('₹', '')) || 5000) * 0.75,
                                                stylePreference: item.id
                                            }}
                                            percentage={75}
                                            isComplete={false}
                                        />
                                    ) : (
                                        <CyberGoalBar
                                            goal={{
                                                title: item.name,
                                                targetAmount: parseInt(item.price.replace('₹', '')) || 5000,
                                                currentProgress: (parseInt(item.price.replace('₹', '')) || 5000) * 0.75
                                            }}
                                            percentage={75}
                                            isComplete={false}
                                            goalStylePreference={item.id}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {item.category === 'widgets' && (
                            <div className={`w-full h-full relative flex flex-col items-center justify-center overflow-hidden ${theme === 'light' ? 'bg-slate-50' : 'bg-[#050505]'}`}>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
                                <div className="relative z-10 w-full">
                                    {item.id === 'wd4' ? (
                                        <div className="transform scale-[0.65] origin-center">
                                            <CruiserRevenueChart />
                                        </div>
                                    ) : (
                                        PREMIUM_GOAL_STYLES.includes(item.id) ? (
                                            <PremiumGoalOverlays
                                                goal={{
                                                    title: item.name,
                                                    targetAmount: parseInt(item.price.replace('₹', '')) || 5000,
                                                    currentProgress: (parseInt(item.price.replace('₹', '')) || 5000) * 0.75,
                                                    stylePreference: item.id
                                                }}
                                                percentage={75}
                                                isComplete={false}
                                            />
                                        ) : (
                                            <CyberGoalBar
                                                goal={{
                                                    title: item.name,
                                                    targetAmount: parseInt(item.price.replace('₹', '')) || 5000,
                                                    currentProgress: (parseInt(item.price.replace('₹', '')) || 5000) * 0.75
                                                }}
                                                percentage={75}
                                                isComplete={false}
                                                goalStylePreference={item.id}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-1/3 h-1/2 md:h-full p-5 sm:p-8 flex flex-col relative bg-[var(--nexus-panel)]">
                        <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] border border-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)] flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Broadcast Tech
                                </span>
                                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] border ${theme === 'light' ? 'border-slate-200 bg-slate-100 text-slate-500' : 'border-[var(--nexus-border)] bg-black/20 text-white/50'
                                    }`}>
                                    SECURED
                                </span>
                            </div>

                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)] leading-none mb-2 group-hover:text-[var(--nexus-accent)] transition-colors">
                                {item.name}
                            </h2>
                            <p className="text-[var(--nexus-text-muted)] text-[10px] font-black uppercase tracking-widest mb-8 opacity-40">
                                Global Environment Module
                            </p>
                            <p className="text-[var(--nexus-text-muted)] text-sm leading-relaxed mb-8 max-w-sm">
                                {item.desc || item.description} Engineered with zero-lag CSS and Framer Motion for a seamless broadcast experience.
                            </p>

                            <div className="space-y-6 mb-12">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[var(--nexus-accent)]/10 rounded-xl">
                                        <Activity className="w-5 h-5 text-[var(--nexus-accent)]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text)]">Live Synchronization</span>
                                        <span className="text-[10px] font-bold text-[var(--nexus-text-muted)] opacity-60">Instant deployment to your stream environment.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[var(--nexus-accent)]/10 rounded-xl">
                                        <ShieldCheck className="w-5 h-5 text-[var(--nexus-accent)]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text)]">Elite Authorization</span>
                                        <span className="text-[10px] font-bold text-[var(--nexus-text-muted)] opacity-60">Verified high-performance broadcast module.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[var(--nexus-accent)]/10 rounded-xl">
                                        <Target className="w-5 h-5 text-[var(--nexus-accent)]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text)]">Dynamic Targeting</span>
                                        <span className="text-[10px] font-bold text-[var(--nexus-text-muted)] opacity-60">Optimized for high-engagement viewer interactions.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[var(--nexus-accent)]/10 rounded-xl">
                                        <Lock className="w-5 h-5 text-[var(--nexus-accent)]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text)]">Secure Licensing</span>
                                        <span className="text-[10px] font-bold text-[var(--nexus-text-muted)] opacity-60">Permanent unlock tied to your broadcast node.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* UNIVERSAL RESPONSIVE FOOTER */}
                        <div className="mt-auto pt-4 border-t border-[var(--nexus-border)]">
                            {/* Price row: side-by-side on mobile to save vertical space */}
                            <div className="flex flex-row items-center justify-between mb-3 sm:flex-col sm:items-start sm:gap-1 sm:mb-5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)]">Market Price</span>
                                    <span className="text-xl sm:text-3xl font-black text-[var(--nexus-text)]">
                                        {item.isOwned ? 'SECURED' : item.price}
                                    </span>
                                </div>
                                {/* Wallet icon — compact on mobile, bigger on desktop */}
                                <div className="p-2 sm:p-4 bg-emerald-500/10 rounded-xl sm:rounded-2xl border border-emerald-500/20">
                                    <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                                </div>
                            </div>
                            {/* CTA — slimmer on mobile */}
                            <button
                                onClick={() => {
                                    onUnlock(item);
                                    onClose();
                                }}
                                className="w-full py-3 sm:py-5 bg-[var(--nexus-accent)] hover:brightness-110 text-black font-black text-sm sm:text-lg uppercase tracking-[0.2em] italic flex items-center justify-center gap-3 shadow-[0_0_30px_var(--nexus-accent)] transition-all active:scale-95"
                                style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
                            >
                                Acquire Asset <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PremiumPreviewModal;

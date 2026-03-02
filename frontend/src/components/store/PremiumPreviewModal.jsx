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

    const isLight = theme === 'light' || document.documentElement.classList.contains('light');

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8 backdrop-blur-xl ${isLight ? 'bg-white/80' : 'bg-black/90'}`}
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
                    <button onClick={onClose} className={`absolute top-4 right-4 z-50 p-2 transition-colors border shadow-lg ${isLight ? 'bg-white/80 hover:bg-emerald-500 hover:text-white border-emerald-100 text-emerald-900' : 'bg-black/50 hover:bg-[var(--nexus-accent)] text-white border-[var(--nexus-border)]'}`}>
                        <X className="w-6 h-6" />
                    </button>

                    <div className="w-full md:w-2/3 h-1/2 md:h-full relative border-r flex items-center justify-center overflow-hidden bg-[#050505] border-[var(--nexus-border)] p-4 sm:p-12">
                        {/* Dynamic Scaling Wrapper: Ensures content always fits the available area */}
                        <div className="w-full h-full flex items-center justify-center relative overflow-hidden" style={{ containerType: 'size' }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full h-full flex items-center justify-center"
                                style={{
                                    // Scale based on container size to ensure containment (Base size 450x600)
                                    scale: 'min(1, min(calc(100cqw / 450), calc(100cqh / 600)))',
                                    transformOrigin: 'center center'
                                }}
                            >
                                {item.category === 'themes' && (
                                    <div className="absolute inset-0">
                                        <LiveThemeEngine currentTheme={item.id} isPreview={true} theme="dark" />
                                        <div className="relative z-10 w-full h-full p-8 flex flex-col gap-4">
                                            <div className="flex gap-4">
                                                <div className={`w-1/4 h-64 backdrop-blur-md border rounded-lg ${isLight ? 'bg-white/40 border-emerald-200/50' : 'bg-white/5 border-white/10'}`} />
                                                <div className={`flex-1 h-[500px] backdrop-blur-lg border rounded-xl ${isLight ? 'bg-white/40 border-emerald-200/50' : 'bg-white/5 border-white/20'}`} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {item.category === 'alerts' && (
                                    <div className="w-full flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.05)_0%,transparent_70%)] pointer-events-none" />
                                        <PremiumAlertPreview
                                            donorName="Elite Donor"
                                            amount={parseInt(item.price.replace('₹', '')) || 2000}
                                            message="This is a live preview of the asset in action!"
                                            stylePreference={item.id}
                                        />
                                    </div>
                                )}

                                {item.category === 'goals' && (
                                    <div className="w-full flex flex-col items-center justify-center py-10">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
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
                                )}

                                {item.category === 'widgets' && (
                                    <div className="w-full flex flex-col items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
                                        {item.id === 'wd4' ? (
                                            <div className="transform scale-[1.2]">
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
                                )}
                            </motion.div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 h-1/2 md:h-full p-5 sm:p-8 flex flex-col relative bg-[var(--nexus-panel)]">
                        <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-1 ${isLight ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600' : 'border-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)]'}`}>
                                    <Sparkles className="w-3 h-3" /> Broadcast Tech
                                </span>
                                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] border ${isLight ? 'border-emerald-100 bg-emerald-50 text-emerald-700/50' : 'border-[var(--nexus-border)] bg-black/20 text-white/50'
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
                                {[
                                    { icon: Activity, label: 'Live Synchronization', desc: 'Instant deployment to your stream environment.' },
                                    { icon: ShieldCheck, label: 'Elite Authorization', desc: 'Verified high-performance broadcast module.' },
                                    { icon: Target, label: 'Dynamic Targeting', desc: 'Optimized for high-engagement viewer interactions.' },
                                    { icon: Lock, label: 'Secure Licensing', desc: 'Permanent unlock tied to your broadcast node.' }
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${isLight ? 'bg-emerald-100 text-emerald-600' : 'bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)]'}`}>
                                            <feature.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-emerald-950' : 'text-[var(--nexus-text)]'}`}>{feature.label}</span>
                                            <span className={`text-[10px] font-bold opacity-60 ${isLight ? 'text-emerald-800' : 'text-[var(--nexus-text-muted)]'}`}>{feature.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* UNIVERSAL RESPONSIVE FOOTER */}
                        <div className="mt-auto pt-4 border-t border-[var(--nexus-border)]">
                            <div className="flex flex-row items-center justify-between mb-3 md:flex-col md:items-start md:gap-1 md:mb-5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)]">Market Price</span>
                                    <span className="text-xl md:text-3xl font-black text-[var(--nexus-text)]">
                                        {item.isOwned ? 'SECURED' : item.price}
                                    </span>
                                </div>
                                <div className="p-2 md:p-4 bg-emerald-500/10 rounded-xl md:rounded-2xl border border-emerald-500/20">
                                    <Wallet className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    onUnlock(item);
                                    onClose();
                                }}
                                className="w-full py-3.5 md:py-5 bg-[var(--nexus-accent)] hover:brightness-110 text-black font-black text-sm md:text-lg uppercase tracking-[0.2em] italic flex items-center justify-center gap-3 shadow-[0_0_30px_var(--nexus-accent)] transition-all active:scale-95"
                                style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
                            >
                                Acquire Asset <Zap className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PremiumPreviewModal;

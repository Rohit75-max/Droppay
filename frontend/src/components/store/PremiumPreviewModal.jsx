import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Zap, Lock, Sparkles, Activity, Target, Wallet, User, Trophy, Crown, MessageSquare, Gift } from 'lucide-react';
import PremiumAlertPreview from '../PremiumAlertPreview';
import PremiumGoalOverlays from '../PremiumGoalOverlays';
import CyberGoalBar from '../CyberGoalBar';
import LiveThemeEngine from '../LiveThemeEngine';

const PREMIUM_GOAL_STYLES = [
    'black_hole', 'hex_core', 'rune_monolith', 'hologram_glitch',
    'alchemist_flask', 'redline_dash', 'loot_dispenser', 'mecha_lens'
];

const PremiumPreviewModal = ({ isOpen, onClose, item, onUnlock, theme, user }) => {
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
                    className="relative w-full max-w-6xl h-[85vh] bg-[#020403] border border-white/10 flex flex-col md:flex-row overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
                    style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}
                >
                    <button onClick={onClose} className={`absolute top-6 right-6 z-50 p-2.5 transition-all duration-300 rounded-full border shadow-2xl group/close ${isLight ? 'bg-white/80 hover:bg-emerald-500 hover:text-white border-emerald-100 text-emerald-900' : 'bg-black/40 hover:bg-red-500/20 text-white/50 hover:text-red-400 border-white/5 hover:border-red-500/30 backdrop-blur-md'}`}>
                        <X className="w-6 h-6" />
                    </button>

                    <div className="w-full md:w-2/3 h-1/2 md:h-full relative border-r flex items-center justify-center overflow-hidden bg-[#050505] border-[var(--nexus-border)] p-4 sm:p-12">
                        {/* Dynamic Scaling Wrapper: Ensures content always fits the available area */}
                        <div className="w-full h-full flex items-center justify-center relative overflow-hidden" style={{ containerType: 'size' }}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-[800px] h-[800px] flex items-center justify-center shrink-0 origin-center"
                                style={{
                                    // Scale based on parent's 100cqw/cqh to ensure containment
                                    transform: 'scale(min(1, min(calc(100cqw / 800), calc(100cqh / 800))))',
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
                                            donorName={user?.fullName || user?.username || 'Elite Donor'}
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
                                    <div className="w-full h-full flex items-center justify-center p-8">
                                        {item.id === 'user_profile' && (
                                            <div className="flex flex-col items-center justify-center gap-10 scale-[1.5]">
                                                <div className="relative">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                                                        transition={{ repeat: Infinity, duration: 4 }}
                                                        className="absolute -inset-12 rounded-full bg-blue-500/20 blur-2xl"
                                                    />
                                                    <div className="w-32 h-32 rounded-full border-4 border-blue-500/30 p-2 bg-black/40 relative z-10 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                                        <User className="w-16 h-16 text-blue-400" />
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-black flex items-center justify-center shadow-lg">
                                                        <ShieldCheck className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                                <div className="space-y-3 text-center">
                                                    <div className="h-3 w-40 bg-blue-500/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            animate={{ x: [-160, 160] }}
                                                            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                                                            className="h-full w-20 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                                                        />
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 opacity-60">Status: Verified Creator</p>
                                                </div>
                                            </div>
                                        )}
                                        {item.id === 'wallet_balance' && (
                                            <div className="flex flex-col items-center justify-center gap-6 scale-[1.4]">
                                                <div className="flex items-center gap-3 bg-emerald-500/10 px-5 py-2 rounded-full border border-emerald-500/20 shadow-inner">
                                                    <Wallet className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 pb-0.5">Revenue</span>
                                                </div>
                                                <div className="text-7xl font-black italic text-emerald-400 flex items-center gap-3 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                                    <span className="text-4xl opacity-50">₹</span>
                                                    <motion.span
                                                        animate={{ scale: [1, 1.05, 1], y: [0, -2, 0] }}
                                                        transition={{ repeat: Infinity, duration: 4 }}
                                                    >
                                                        12,450
                                                    </motion.span>
                                                </div>
                                                <div className="w-64 h-2 bg-emerald-500/10 rounded-full overflow-hidden mt-4 relative">
                                                    <motion.div
                                                        animate={{ width: ["0%", "92%", "0%"] }}
                                                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                                        className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {item.id === 'elite_nexus' && (
                                            <div className="w-full max-w-lg flex flex-col gap-8 scale-[1.2]">
                                                <div className="flex items-center justify-between px-6 py-3 bg-indigo-500/10 border-l-4 border-indigo-500 shadow-inner">
                                                    <div className="flex items-center gap-3">
                                                        <Trophy className="w-5 h-5 text-indigo-400" />
                                                        <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Elite Supporter Node</span>
                                                    </div>
                                                    <Sparkles className="w-4 h-4 text-indigo-400/50 animate-pulse" />
                                                </div>
                                                <div className="flex gap-6 overflow-hidden px-4 justify-center">
                                                    <motion.div
                                                        animate={{ y: [0, -5, 0] }}
                                                        transition={{ repeat: Infinity, duration: 3 }}
                                                        className="shrink-0 w-16 h-16 rounded-2xl border-2 border-indigo-500/30 bg-black/40 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                                                    >
                                                        <MessageSquare className="w-8 h-8 text-indigo-400" />
                                                    </motion.div>
                                                    <motion.div
                                                        animate={{ y: [0, -5, 0] }}
                                                        transition={{ repeat: Infinity, duration: 3, delay: 0.3 }}
                                                        className="shrink-0 w-16 h-16 rounded-2xl border-2 border-indigo-500/30 bg-black/40 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                                                    >
                                                        <Gift className="w-8 h-8 text-indigo-400" />
                                                    </motion.div>
                                                    {[1, 2].map(i => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ y: [0, -5, 0] }}
                                                            transition={{ repeat: Infinity, duration: 3, delay: 0.6 + i * 0.2 }}
                                                            className="shrink-0 w-16 h-16 rounded-2xl border-2 border-indigo-500/30 bg-black/40 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 animate-pulse border border-indigo-500/20" />
                                                        </motion.div>
                                                    ))}
                                                    <div className="shrink-0 w-16 h-16 rounded-2xl border-2 border-dashed border-amber-500/30 bg-black/40 flex items-center justify-center">
                                                        <Crown className="w-10 h-10 text-amber-500/20" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-2 w-full bg-indigo-500/10 rounded-full relative overflow-hidden">
                                                        <motion.div
                                                            animate={{ x: [-100, 500] }}
                                                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                                            className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-[10px] font-bold text-indigo-400/40 uppercase tracking-widest">
                                                        <span>Live Activity...</span>
                                                        <span>8.4 GB/s</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 h-1/2 md:h-full p-8 sm:p-10 flex flex-col relative bg-[#020403]/95 backdrop-blur-3xl">
                        {/* Ambient Glow behind info */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--nexus-accent)]/5 blur-[80px] rounded-full pointer-events-none" />
                        <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-1 ${isLight ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600' : 'border-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)]'}`}>
                                    <Sparkles className="w-3 h-3" /> Live Stream Asset
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
                                {item.category === 'themes' ? 'Premium Theme Skin'
                                    : item.category === 'alerts' ? 'Live Alert Style'
                                    : item.category === 'goals' ? 'Goal Tracker Design'
                                    : item.category === 'widgets' ? 'Interactive Tool'
                                    : 'Stream Asset'}
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
                        <div className="mt-auto pt-8 border-t border-white/5">
                            <div className="flex flex-row items-center justify-between mb-4 md:flex-col md:items-start md:gap-2 md:mb-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Purchase Price</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-black text-[var(--nexus-accent)] italic">₹</span>
                                        <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">
                                            {item.isOwned ? 'SECURED' : (parseInt(item.price.replace(/[^0-9]/g, '')) || 0).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                                <div className="hidden md:flex p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 shadow-inner">
                                    <Wallet className="w-8 h-8 text-emerald-500/40" />
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    onUnlock(item);
                                    onClose();
                                }}
                                className="w-full py-5 md:py-6 bg-[var(--nexus-accent)] hover:brightness-110 text-black font-black text-sm md:text-xl uppercase tracking-[0.3em] italic flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98] group/buy"
                                style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
                            >
                                <span className="relative z-10">Unlock This Now</span>
                                <Zap className="w-5 h-5 md:w-6 md:h-6 relative z-10 group-hover/buy:animate-pulse" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PremiumPreviewModal;

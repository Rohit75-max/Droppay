import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Wrench, ShoppingBag, Mailbox, Target, LogOut, Shield, Zap, User, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileBottomNav = ({ activeSection, setActiveSection, onLogout, user, theme }) => {
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const navigate = useNavigate();

    const navItems = [
        { id: 'dashboard', label: 'Nexus', icon: LayoutGrid },
        { id: 'accounts', label: 'Identity', icon: User },
        { id: 'settings', label: 'Control', icon: Wrench },
        { id: 'store', label: 'Store', icon: ShoppingBag },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full z-[150] flex flex-col items-center">

            {/* THE EXPANDED CONTROL MENU ("Admin Portal", "Logout") */}
            <AnimatePresence>
                {isMenuExpanded && (
                    <>
                        {/* High-end glassmorphism backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuExpanded(false)}
                            className="fixed inset-0 z-[-1] bg-[var(--nexus-bg)]/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="w-[92%] max-w-sm mb-6 p-6 rounded-[2.5rem] border flex flex-col gap-4 relative overflow-hidden bg-[var(--nexus-panel)] border-[var(--nexus-border)] shadow-[0_0_60px_rgba(0,0,0,0.3)]"
                        >
                            {/* Top animated glow bar */}
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--nexus-accent)] to-transparent opacity-60" />
                            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-[var(--nexus-accent)] blur-[2px] animate-pulse opacity-40" />

                            <div className="flex items-center justify-between gap-4 mb-2">
                                <h2 className="text-xl font-black italic tracking-tighter uppercase text-[var(--nexus-text)]">Protocol Controls</h2>
                                <button onClick={() => setIsMenuExpanded(false)} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border text-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]/30 hover:bg-[var(--nexus-accent)]/20 transition-colors">Close</button>
                            </div>

                            <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto custom-scrollbar pr-1">
                                {/* Actions Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => { setActiveSection('growth'); setIsMenuExpanded(false); }}
                                        className={`flex flex-col items-center text-center gap-2 p-5 rounded-3xl transition-all border group relative overflow-hidden ${activeSection === 'growth'
                                            ? 'bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]/40 shadow-[0_0_20px_rgba(0,0,0,0.15)]'
                                            : 'bg-[var(--nexus-bg)]/60 border-[var(--nexus-border)] hover:border-[var(--nexus-accent)]/30 hover:bg-[var(--nexus-accent)]/5'
                                            }`}
                                    >
                                        <div className={`p-3.5 rounded-2xl transition-transform group-hover:scale-110 ${activeSection === 'growth' ? 'bg-[var(--nexus-accent)] text-[var(--nexus-bg)]' : 'bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)]'}`}>
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[11px] font-black uppercase italic tracking-tight ${activeSection === 'growth' ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text)]'}`}>Growth</span>
                                            <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--nexus-text-muted)]">Missions</span>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => { setActiveSection('feedback'); setIsMenuExpanded(false); }}
                                        className={`flex flex-col items-center text-center gap-2 p-5 rounded-3xl transition-all border group relative overflow-hidden ${activeSection === 'feedback'
                                            ? 'bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]/40 shadow-[0_0_20px_rgba(0,0,0,0.15)]'
                                            : 'bg-[var(--nexus-bg)]/60 border-[var(--nexus-border)] hover:border-[var(--nexus-accent)]/30 hover:bg-[var(--nexus-accent)]/5'
                                            }`}
                                    >
                                        <div className={`p-3.5 rounded-2xl transition-transform group-hover:scale-110 ${activeSection === 'feedback' ? 'bg-[var(--nexus-accent)] text-[var(--nexus-bg)]' : 'bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)]'}`}>
                                            <Mailbox className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[11px] font-black uppercase italic tracking-tight ${activeSection === 'feedback' ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text)]'}`}>Signal</span>
                                            <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--nexus-text-muted)]">Feedback</span>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => { setActiveSection('help'); setIsMenuExpanded(false); }}
                                        className={`flex flex-col items-center text-center gap-2 p-5 rounded-3xl transition-all border group relative overflow-hidden ${activeSection === 'help'
                                            ? 'bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]/40 shadow-[0_0_20px_rgba(0,0,0,0.15)]'
                                            : 'bg-[var(--nexus-bg)]/60 border-[var(--nexus-border)] hover:border-[var(--nexus-accent)]/30 hover:bg-[var(--nexus-accent)]/5'
                                            }`}
                                    >
                                        <div className={`p-3.5 rounded-2xl transition-transform group-hover:scale-110 ${activeSection === 'help' ? 'bg-[var(--nexus-accent)] text-[var(--nexus-bg)]' : 'bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)]'}`}>
                                            <HelpCircle className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[11px] font-black uppercase italic tracking-tight ${activeSection === 'help' ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text)]'}`}>Support</span>
                                            <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--nexus-text-muted)]">Help Desk</span>
                                        </div>
                                    </button>

                                    {user?.role === 'admin' && (
                                        <button
                                            onClick={() => { navigate('/admin/secure-portal'); setIsMenuExpanded(false); }}
                                            className="flex flex-col items-center text-center gap-2 p-5 rounded-3xl bg-[var(--nexus-accent)]/5 hover:bg-[var(--nexus-accent)]/10 border border-[var(--nexus-accent)]/20 hover:border-[var(--nexus-accent)]/40 transition-all group"
                                        >
                                            <div className="p-3.5 rounded-2xl bg-[var(--nexus-accent)]/10 border border-[var(--nexus-accent)]/30 group-hover:scale-110 transition-transform">
                                                <Shield className="w-5 h-5 text-[var(--nexus-accent)]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black uppercase italic tracking-tight text-[var(--nexus-accent)]">Admin</span>
                                                <span className="text-[8px] text-[var(--nexus-text-muted)] uppercase font-bold tracking-widest">Master Node</span>
                                            </div>
                                        </button>
                                    )}
                                </div>

                                {/* Destructive Action */}
                                <button
                                    onClick={() => { setIsMenuExpanded(false); onLogout(); }}
                                    className="flex items-center gap-4 bg-rose-950/30 hover:bg-rose-900/40 p-5 rounded-[2rem] border border-rose-500/20 hover:border-rose-500/40 transition-all group mt-2"
                                >
                                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 group-hover:scale-110 transition-transform">
                                        <LogOut className="w-5 h-5 text-rose-500" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-black uppercase italic tracking-tight text-rose-400 glow:text-rose-500/50">Exit Protocol</span>
                                        <span className="text-[9px] text-rose-500/60 uppercase font-bold tracking-widest">Terminate Session</span>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* THE MAIN BOTTOM NAV BAR WITH BRAND BUTTON */}
            <div className="w-full h-20 bg-[var(--nexus-panel)] backdrop-blur-3xl border-t border-[var(--nexus-border)] px-4 flex items-center justify-between pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.1)] transition-colors duration-500">

                {/* Left Nav Items */}
                <div className="flex justify-around flex-1 items-center">
                    {navItems.slice(0, 2).map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setActiveSection(item.id); setIsMenuExpanded(false); }}
                                className={`flex flex-col items-center gap-1.5 transition-all group relative`}
                            >
                                <item.icon className={`w-5 h-5 transition-colors ${isActive
                                    ? 'text-[var(--nexus-accent)] drop-shadow-[0_0_8px_var(--nexus-accent)]'
                                    : 'text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-text)]'
                                    }`} />
                                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isActive
                                    ? 'text-[var(--nexus-accent)]'
                                    : 'text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-text)]'
                                    }`}>{item.label}</span>
                                {isActive && (
                                    <motion.div layoutId="navGlow" className={`absolute -top-4 w-8 h-1 rounded-full blur-[2px] bg-[var(--nexus-accent)] opacity-70`} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* THE CENTRAL BRAND BUTTON */}
                <div className="relative -mt-10 px-4 z-10">
                    <motion.button
                        onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                        animate={isMenuExpanded ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                        whileTap={{ scale: 0.9 }}
                        className={`relative flex items-center justify-center h-16 w-16 rounded-[1.25rem] border-[3px] transition-all bg-[var(--nexus-panel)] ${isMenuExpanded
                            ? 'border-[var(--nexus-text)] shadow-[0_10px_30px_rgba(6,182,212,0.4)]'
                            : 'border-[var(--nexus-accent)] shadow-[0_10px_20px_var(--nexus-accent-transparent,rgba(0,0,0,0.2))]'
                            }`}
                    >
                        <Zap className={`w-8 h-8 fill-current ${isMenuExpanded ? 'text-[var(--nexus-text)]' : 'text-[var(--nexus-accent)]'}`} />
                        <div className={`absolute inset-0 rounded-[1.1rem] border-4 transition-colors ${isMenuExpanded ? 'border-[var(--nexus-accent)]/30 animate-pulse' : 'border-[var(--nexus-accent)]/20'}`} />
                    </motion.button>
                </div>

                {/* Right Nav Items */}
                <div className="flex justify-around flex-1 items-center">
                    {navItems.slice(2, 4).map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setActiveSection(item.id); setIsMenuExpanded(false); }}
                                className={`flex flex-col items-center gap-1.5 transition-all group relative`}
                            >
                                <item.icon className={`w-5 h-5 transition-colors ${isActive
                                    ? 'text-[var(--nexus-accent)] drop-shadow-[0_0_8px_var(--nexus-accent)]'
                                    : 'text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-text)]'
                                    }`} />
                                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isActive
                                    ? 'text-[var(--nexus-accent)]'
                                    : 'text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-text)]'
                                    }`}>{item.label}</span>
                                {isActive && (
                                    <motion.div layoutId="navGlow" className={`absolute -top-4 w-8 h-1 rounded-full blur-[2px] bg-[var(--nexus-accent)] opacity-70`} />
                                )}
                            </button>
                        );
                    })}
                </div>

            </div>

            {/* Global mobile space below footer for notched devices */}
            <div className="w-full h-[env(safe-area-inset-bottom,0px)] bg-[var(--nexus-panel)]" />
        </div>
    );
};

export default MobileBottomNav;

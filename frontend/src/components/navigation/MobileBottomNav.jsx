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
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="w-[90%] max-w-sm mb-4 bg-[var(--nexus-panel)] backdrop-blur-3xl p-6 rounded-3xl border border-[var(--nexus-border)] shadow-[0_-20px_60px_rgba(0,0,0,0.6)] flex flex-col gap-4 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-xl font-black italic tracking-tighter uppercase text-[var(--nexus-text)]">Protocol Controls</h2>
                            <button onClick={() => setIsMenuExpanded(false)} className="text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">Close</button>
                        </div>

                        <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
                            {/* Actions Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => { setActiveSection('growth'); setIsMenuExpanded(false); }}
                                    className={`flex flex-col items-center text-center gap-2 p-4 rounded-3xl transition-all border ${activeSection === 'growth' ? 'bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]/30' : 'bg-[var(--nexus-bg)]/50 border-[var(--nexus-border)] hover:bg-[var(--nexus-accent)]/5 hover:border-[var(--nexus-accent)]/20'} group relative overflow-hidden`}
                                >
                                    <div className={`p-3 rounded-2xl ${activeSection === 'growth' ? 'bg-[var(--nexus-accent)] text-black' : 'bg-[var(--nexus-panel)] border border-[var(--nexus-border)] text-[var(--nexus-accent)]'}`}>
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[11px] font-black uppercase italic tracking-tight ${activeSection === 'growth' ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text)]'}`}>Growth</span>
                                        <span className="text-[8px] opacity-40 uppercase font-bold tracking-widest">Missions</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => { setActiveSection('feedback'); setIsMenuExpanded(false); }}
                                    className={`flex flex-col items-center text-center gap-2 p-4 rounded-3xl transition-all border ${activeSection === 'feedback' ? 'bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]/30' : 'bg-[var(--nexus-bg)]/50 border-[var(--nexus-border)] hover:bg-[var(--nexus-accent)]/5 hover:border-[var(--nexus-accent)]/20'} group relative overflow-hidden`}
                                >
                                    <div className={`p-3 rounded-2xl ${activeSection === 'feedback' ? 'bg-[var(--nexus-accent)] text-black' : 'bg-[var(--nexus-panel)] border border-[var(--nexus-border)] text-[var(--nexus-accent)]'}`}>
                                        <Mailbox className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[11px] font-black uppercase italic tracking-tight ${activeSection === 'feedback' ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text)]'}`}>Signal</span>
                                        <span className="text-[8px] opacity-40 uppercase font-bold tracking-widest">Feedback</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => { setActiveSection('help'); setIsMenuExpanded(false); }}
                                    className={`flex flex-col items-center text-center gap-2 p-4 rounded-3xl transition-all border ${activeSection === 'help' ? 'bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]/30' : 'bg-[var(--nexus-bg)]/50 border-[var(--nexus-border)] hover:bg-[var(--nexus-accent)]/5 hover:border-[var(--nexus-accent)]/20'} group relative overflow-hidden`}
                                >
                                    <div className={`p-3 rounded-2xl ${activeSection === 'help' ? 'bg-[var(--nexus-accent)] text-black' : 'bg-[var(--nexus-panel)] border border-[var(--nexus-border)] text-[var(--nexus-accent)]'}`}>
                                        <HelpCircle className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[11px] font-black uppercase italic tracking-tight ${activeSection === 'help' ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text)]'}`}>Support</span>
                                        <span className="text-[8px] opacity-40 uppercase font-bold tracking-widest">Help Desk</span>
                                    </div>
                                </button>

                                {user?.role === 'admin' && (
                                    <button
                                        onClick={() => { navigate('/admin/secure-portal'); setIsMenuExpanded(false); }}
                                        className="flex flex-col items-center text-center gap-2 p-4 rounded-3xl bg-[#10B981]/5 hover:bg-[#10B981]/10 border border-[#10B981]/20 transition-all group"
                                    >
                                        <div className="p-3 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 group-hover:scale-110 transition-transform">
                                            <Shield className="w-5 h-5 text-[#10B981]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black uppercase italic tracking-tight text-[#10B981]">Admin</span>
                                            <span className="text-[8px] text-[#10B981]/50 uppercase font-bold tracking-widest">Master Node</span>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* Destructive Action */}
                            <button
                                onClick={() => { setIsMenuExpanded(false); onLogout(); }}
                                className="flex items-center gap-4 bg-rose-500/5 hover:bg-rose-500/10 p-4 rounded-2xl border border-rose-500/10 transition-all group mt-1"
                            >
                                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 group-hover:scale-110 transition-transform">
                                    <LogOut className="w-5 h-5 text-rose-500" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-black uppercase italic tracking-tight text-rose-500">Exit Protocol</span>
                                    <span className="text-[9px] text-rose-500/40 uppercase font-bold">Terminate Session</span>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* THE MAIN BOTTOM NAV BAR WITH BRAND BUTTON */}
            <div className="w-full h-20 bg-[var(--nexus-panel)] backdrop-blur-2xl border-t border-[var(--nexus-border)] px-4 flex items-center justify-between pb-safe shadow-xl transition-colors duration-500">

                {/* Left Nav Items */}
                <div className="flex justify-around flex-1 items-center">
                    {navItems.slice(0, 2).map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setActiveSection(item.id); setIsMenuExpanded(false); }}
                                className={`flex flex-col items-center gap-1 transition-all group relative`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-[var(--nexus-accent)]' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-[var(--nexus-accent)]' : 'text-slate-600 group-hover:text-slate-400'}`}>{item.label}</span>
                                {isActive && (
                                    <motion.div layoutId="navGlow" className="absolute -top-3 w-6 h-1 bg-[var(--nexus-accent)] rounded-full blur-[2px]" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* THE CENTRAL BRAND BUTTON */}
                <div className="relative -mt-10 px-4">
                    <motion.button
                        onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                        animate={isMenuExpanded ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                        whileTap={{ scale: 0.9 }}
                        className={`relative flex items-center justify-center h-14 w-14 rounded-2xl border-[3px] shadow-[0_10px_20px_rgba(16,185,129,0.3)] transition-all bg-[var(--nexus-panel)] ${isMenuExpanded ? 'border-[var(--nexus-text)] brightness-110' : 'border-[var(--nexus-accent)]'}`}
                    >
                        <Zap className={`w-7 h-7 ${isMenuExpanded ? 'text-[var(--nexus-text)]' : 'text-[var(--nexus-accent)]'} fill-current`} />
                        <div className={`absolute inset-0 rounded-2xl animate-pulse border-4 transition-colors ${isMenuExpanded ? 'border-[var(--nexus-text)]/20' : 'border-[var(--nexus-accent)]/20'}`} />
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
                                className={`flex flex-col items-center gap-1 transition-all group relative`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-[var(--nexus-accent)]' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-[var(--nexus-accent)]' : 'text-slate-600 group-hover:text-slate-400'}`}>{item.label}</span>
                                {isActive && (
                                    <motion.div layoutId="navGlow" className="absolute -top-3 w-6 h-1 bg-[var(--nexus-accent)] rounded-full blur-[2px]" />
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

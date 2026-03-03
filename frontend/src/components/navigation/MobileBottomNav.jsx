import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Wrench, ShoppingBag, Mailbox, Target, LogOut, Shield, Zap, User, HelpCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileBottomNav = ({ activeSection, setActiveSection, onLogout, user, theme, isMenuExpanded, setIsMenuExpanded }) => {
    const navigate = useNavigate();

    const navItems = [
        { id: 'dashboard', label: 'Nexus', icon: LayoutGrid, color: '#2DD4BF' },
        { id: 'accounts', label: 'Identity', icon: User, color: '#60A5FA' },
        { id: 'settings', label: 'Control', icon: Wrench, color: '#FBBF24' },
        { id: 'store', label: 'Store', icon: ShoppingBag, color: '#A78BFA' },
    ];

    return (
        <div className="fixed inset-x-0 bottom-0 z-[150] flex flex-col items-center pointer-events-none md:hidden">
            {/* Pointer events enabled only for interactive parts */}
            <div className="pointer-events-auto flex flex-col items-center w-full">

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
                                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 40, scale: 0.9 }}
                                transition={{ type: "spring", damping: 20, stiffness: 600 }}
                                className="w-[94%] max-w-sm mb-4 p-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative z-10"
                            >
                                <div className="w-full h-full p-4 rounded-[2.4rem] bg-[var(--nexus-panel)]/80 backdrop-blur-3xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
                                    {/* Atmospheric background beam */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/5 blur-[60px] rounded-full pointer-events-none" />

                                    <div className="flex items-center justify-between gap-4 relative z-10">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--nexus-accent)] opacity-60 mb-0.5">Uplink Interface</span>
                                            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-[var(--nexus-text)] leading-none">Protocol Controls</h2>
                                        </div>
                                        <button
                                            onClick={() => setIsMenuExpanded(false)}
                                            className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-white/20 transition-all active:scale-90"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1 relative z-10">
                                        {/* Actions Grid */}
                                        <div className="grid grid-cols-2 gap-2.5">
                                            {[
                                                { id: 'growth', label: 'Growth', sub: 'Missions', icon: Target, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)' },
                                                { id: 'feedback', label: 'Signal', sub: 'Feedback', icon: Mailbox, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' },
                                                { id: 'help', label: 'Support', sub: 'Help Desk', icon: HelpCircle, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' },
                                                { id: 'admin', label: 'Admin', sub: 'Master Node', icon: Shield, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)', adminOnly: true },
                                            ].map((node) => {
                                                if (node.adminOnly && user?.role !== 'admin') return null;
                                                const isActive = activeSection === node.id;
                                                return (
                                                    <motion.button
                                                        key={node.id}
                                                        whileHover={{ scale: 1.02, y: -4 }}
                                                        whileTap={{ scale: 0.96 }}
                                                        onClick={() => {
                                                            if (node.id === 'admin') navigate('/admin/secure-portal');
                                                            else setActiveSection(node.id);
                                                            setIsMenuExpanded(false);
                                                        }}
                                                        style={{
                                                            background: isActive ? node.bg : 'rgba(255, 255, 255, 0.03)',
                                                            borderColor: isActive ? node.border : 'rgba(255, 255, 255, 0.05)',
                                                            boxShadow: isActive ? `0 10px 40px ${node.color}15` : 'none'
                                                        }}
                                                        className="flex flex-col items-center text-center gap-2 p-3.5 rounded-[1.5rem] transition-all border group relative overflow-hidden"
                                                    >
                                                        {/* Dynamic Hover Glow */}
                                                        <div
                                                            className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500"
                                                            style={{ background: `radial-gradient(circle at center, ${node.color}, transparent 70%)` }}
                                                        />

                                                        <div
                                                            style={{
                                                                background: isActive ? node.color : 'rgba(255, 255, 255, 0.05)',
                                                                color: isActive ? '#000' : node.color,
                                                                boxShadow: isActive ? `0 0 20px ${node.color}66` : 'none'
                                                            }}
                                                            className="h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                                                        >
                                                            <node.icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex flex-col relative z-10 transition-transform duration-300 group-hover:translate-y-[-1px]">
                                                            <span
                                                                style={{ color: isActive ? node.color : 'var(--nexus-text)' }}
                                                                className="text-[11px] font-black uppercase italic tracking-tight transition-colors opacity-90"
                                                            >
                                                                {node.label}
                                                            </span>
                                                            <span className="text-[8px] uppercase font-black tracking-[0.2em] text-[var(--nexus-text)] opacity-30">{node.sub}</span>
                                                        </div>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>

                                        {/* Destructive Action */}
                                        <motion.button
                                            whileHover={{ scale: 1.01, x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => { setIsMenuExpanded(false); onLogout(); }}
                                            className="flex items-center gap-3 p-3.5 rounded-[1.5rem] border border-rose-500/10 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all group mt-1 relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/5 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform shadow-inner">
                                                <LogOut className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col text-left relative z-10">
                                                <span className="text-xs font-black uppercase italic tracking-tight text-rose-400">Exit Protocol</span>
                                                <span className="text-[8px] text-rose-500/40 uppercase font-black tracking-[0.2em]">Terminate Session</span>
                                            </div>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* THE MAIN BOTTOM NAV BAR WITH BRAND BUTTON */}
                <div className="w-full bg-[var(--nexus-panel)]/60 backdrop-blur-[24px] border-t border-[var(--nexus-border)]/50 px-4 flex items-center justify-between shadow-[0_-20px_40px_rgba(0,0,0,0.4)] transition-all duration-700" style={{ height: '64px', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>

                    {/* Left Nav Items */}
                    <div className="flex justify-around flex-1 items-center">
                        {navItems.slice(0, 2).map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveSection(item.id); setIsMenuExpanded(false); }}
                                    style={{ background: isActive ? `${item.color}15` : '' }}
                                    className={`flex flex-col items-center gap-1.5 transition-all group relative px-4 py-2 rounded-2xl`}
                                >
                                    <item.icon
                                        style={{
                                            color: isActive ? item.color : '',
                                            filter: isActive ? `drop-shadow(0 0 12px ${item.color}80)` : ''
                                        }}
                                        className={`w-5 h-5 transition-all duration-500 ${isActive
                                            ? 'scale-110'
                                            : 'text-[var(--nexus-text-muted)] opacity-30 group-hover:opacity-60'
                                            }`} />
                                    <span
                                        style={{ color: isActive ? item.color : '' }}
                                        className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isActive
                                            ? 'opacity-100'
                                            : 'text-[var(--nexus-text-muted)] opacity-0 group-hover:opacity-40 translate-y-1 group-hover:translate-y-0'
                                            }`}>{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="navGlow"
                                            style={{ backgroundColor: item.color }}
                                            className="absolute -top-4 w-10 h-1 rounded-full blur-[4px] opacity-60"
                                            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* THE CENTRAL BRAND BUTTON */}
                    <div className="relative -mt-10 px-4 z-10">
                        <motion.button
                            onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                            animate={isMenuExpanded ? { scale: 1.1, rotate: 180 } : { scale: 1, rotate: 0 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", damping: 12, stiffness: 200 }}
                            className={`relative flex items-center justify-center h-16 w-16 rounded-[1.7rem] border-2 transition-all backdrop-blur-3xl overflow-hidden group/zap ${isMenuExpanded
                                ? 'bg-white border-white text-black shadow-[0_15px_40px_rgba(255,255,255,0.3)]'
                                : 'bg-white/5 border-white/10 text-white shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-white/20'
                                }`}
                        >
                            {isMenuExpanded ? (
                                <X className="w-7 h-7" />
                            ) : (
                                <Zap className="w-7 h-7 fill-current" />
                            )}
                            <div className={`absolute inset-0 rounded-[1.5rem] border-4 transition-all duration-700 ${isMenuExpanded ? 'border-white/10 animate-pulse' : 'border-white/0 group-hover/zap:border-white/5'}`} />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover/zap:opacity-100 transition-opacity" />
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
                                    style={{ background: isActive ? `${item.color}15` : '' }}
                                    className={`flex flex-col items-center gap-1.5 transition-all group relative px-4 py-2 rounded-2xl`}
                                >
                                    <item.icon
                                        style={{
                                            color: isActive ? item.color : '',
                                            filter: isActive ? `drop-shadow(0 0 12px ${item.color}80)` : ''
                                        }}
                                        className={`w-5 h-5 transition-all duration-500 ${isActive
                                            ? 'scale-110'
                                            : 'text-[var(--nexus-text-muted)] opacity-30 group-hover:opacity-60'
                                            }`} />
                                    <span
                                        style={{ color: isActive ? item.color : '' }}
                                        className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isActive
                                            ? 'opacity-100'
                                            : 'text-[var(--nexus-text-muted)] opacity-0 group-hover:opacity-40 translate-y-1 group-hover:translate-y-0'
                                            }`}>{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="navGlow"
                                            style={{ backgroundColor: item.color }}
                                            className="absolute -top-4 w-10 h-1 rounded-full blur-[4px] opacity-60"
                                            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                </div>

                {/* Global mobile space below footer — handled inline above via paddingBottom */}
            </div>
        </div>
    );
};

export default MobileBottomNav;

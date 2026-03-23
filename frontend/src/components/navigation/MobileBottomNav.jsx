import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Wrench, Mailbox, Target, LogOut, Shield, Zap, User, HelpCircle, X, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileBottomNav = ({ activeSection, setActiveSection, onLogout, user, theme, isMenuExpanded, setIsMenuExpanded }) => {
    const navigate = useNavigate();

    const mainNavItems = [
        { id: 'summary', label: 'Dashboard', icon: LayoutDashboard, color: '#2DD4BF' },
        { id: 'control', label: 'Settings', icon: Wrench, color: '#FBBF24' },
    ];

    const secondaryNavItems = [
        { id: 'store', label: 'Store', icon: ShoppingBag, color: '#A78BFA' },
        { id: 'profile', label: 'Profile', icon: User, color: '#60A5FA' },
    ];

    const quickActionItems = [
        { id: 'growth', label: 'Growth', icon: Target, color: '#2DD4BF' },
        { id: 'help', label: 'Help', icon: HelpCircle, color: '#60A5FA' },
        { id: 'feedback', label: 'Feedback', icon: Mailbox, color: '#A78BFA' },
        ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin', icon: Shield, color: '#8B5CF6' }] : []),
        { id: 'logout', label: 'Logout', icon: LogOut, color: '#F43F5E' },
    ];

    return (
        <div className="fixed inset-x-0 bottom-4 z-[300] flex flex-col items-center pointer-events-none md:hidden">
            <div className="pointer-events-auto relative flex flex-col items-center w-[92%] max-w-md">
                
                {/* FLOATING QUICK ACTIONS MENU (The "Vertical Stack") */}
                <AnimatePresence>
                    {isMenuExpanded && (
                        <>
                            {/* Backdrop - More immersive full-screen blur */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMenuExpanded(false)}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1] pointer-events-auto"
                            />

                             <motion.div
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                                variants={{
                                    show: { 
                                        transition: { staggerChildren: 0.05, delayChildren: 0.05 } 
                                    },
                                    hidden: { 
                                        transition: { staggerChildren: 0, when: "afterChildren" } 
                                    }
                                }}
                                className="fixed bottom-[4.8rem] left-1/2 -translate-x-1/2 bg-[#020403]/95 backdrop-blur-2xl rounded-[2.5rem] p-3 flex flex-col gap-2 shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/5 w-[240px] z-[200] ring-1 ring-white/10"
                            >
                                {/* Immersive header */}
                                <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Quick Actions</span>
                                    <button 
                                        onClick={() => setIsMenuExpanded(false)}
                                        className="p-1.5 -mr-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all active:scale-95"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {quickActionItems.map((item) => (
                                    <motion.button
                                        key={item.id}
                                        variants={{
                                            show: { opacity: 1, x: 0, scale: 1 },
                                            hidden: { opacity: 0, x: -10, scale: 0.95 }
                                        }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => {
                                            if (item.id === 'logout') onLogout();
                                            else if (item.id === 'admin') navigate('/admin/secure-portal');
                                            else setActiveSection(item.id);
                                            setIsMenuExpanded(false);
                                        }}
                                        className="flex items-center gap-4 px-4 py-2.5 rounded-2xl transition-all relative group/btn w-full"
                                    >
                                        <div 
                                            className="absolute inset-0 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-all duration-300"
                                            style={{ backgroundColor: `${item.color}15` }}
                                        />
                                        <div 
                                            className="w-10 h-10 rounded-xl flex items-center justify-center relative z-10 shrink-0"
                                            style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}30` }}
                                        >
                                            <item.icon 
                                                className="w-5 h-5" 
                                                style={{ 
                                                    color: item.color,
                                                    filter: `drop-shadow(0 0 8px ${item.color}40)`
                                                }} 
                                            />
                                        </div>
                                        <div className="flex flex-col items-start relative z-10">
                                            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: item.color }}>
                                                {item.label}
                                            </span>
                                            <span className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">
                                                Access {item.label.toLowerCase()} hub
                                            </span>
                                        </div>
                                    </motion.button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* MAIN FLOATING DOCK */}
                <div className="w-auto min-w-[320px] h-16 bg-[#0c0c0e]/95 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center gap-10 px-8 relative overflow-hidden">
                    
                    {/* Glossy Overlay for the bar */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Left Items */}
                    <div className="flex items-center gap-7">
                        {mainNavItems.map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveSection(item.id); setIsMenuExpanded(false); }}
                                    className="flex flex-col items-center group relative px-1"
                                >
                                    <item.icon
                                        style={{ 
                                            color: isActive ? item.color : '',
                                            filter: isActive ? `drop-shadow(0 0 10px ${item.color}B0)` : ''
                                        }}
                                        className={`w-5.5 h-5.5 transition-all duration-300 ${isActive
                                            ? 'scale-110'
                                            : 'text-white/30 group-hover:text-white/60 group-hover:scale-105'
                                            }`} />
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            style={{ backgroundColor: item.color }}
                                            className="absolute -bottom-3 w-1 h-1 rounded-full shadow-[0_0_12px_currentColor]"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Central Brand Logo / Trigger */}
                    <motion.button
                        onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className={`h-11 w-11 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 ${
                            isMenuExpanded 
                            ? 'bg-white text-[var(--nexus-accent)] shadow-[0_0_25px_rgba(255,255,255,0.4)]' 
                            : 'bg-gradient-to-br from-[var(--nexus-accent)] to-[var(--nexus-accent-dark,var(--nexus-accent))] text-white shadow-[0_0_20px_rgba(0,0,0,0.3)]'
                        }`}
                    >
                        {isMenuExpanded ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Zap 
                                className="w-5 h-5 fill-current" 
                                style={{ 
                                    filter: `drop-shadow(0 0 8px var(--nexus-accent))` 
                                }} 
                            />
                        )}
                        
                        {!isMenuExpanded && (
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-[var(--nexus-accent)] rounded-full blur-md -z-10"
                            />
                        )}
                    </motion.button>

                    {/* Right Items */}
                    <div className="flex items-center gap-7">
                        {secondaryNavItems.map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveSection(item.id); setIsMenuExpanded(false); }}
                                    className="flex flex-col items-center group relative px-1"
                                >
                                    <item.icon
                                        style={{ 
                                            color: isActive ? item.color : '',
                                            filter: isActive ? `drop-shadow(0 0 10px ${item.color}B0)` : ''
                                        }}
                                        className={`w-5.5 h-5.5 transition-all duration-300 ${isActive
                                            ? 'scale-110'
                                            : 'text-white/30 group-hover:text-white/60 group-hover:scale-105'
                                            }`} />
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            style={{ backgroundColor: item.color }}
                                            className="absolute -bottom-3 w-1 h-1 rounded-full shadow-[0_0_12px_currentColor]"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileBottomNav;

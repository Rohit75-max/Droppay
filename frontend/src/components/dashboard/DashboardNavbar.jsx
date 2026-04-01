import React, { useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Gamepad2,
  BarChart3,
  ShoppingBag,
  DollarSign,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  LogOut,
  Zap,
  User,
  Sun,
  Moon,
  Copy,
  Settings,
  Activity,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';


const navItems = [
  { label: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard },
  { label: 'CONTROL', href: '/dashboard/control', icon: Gamepad2 },
  { label: 'METRICS', href: '/dashboard/metrics', icon: BarChart3 },
  { label: 'STORE', href: '/dashboard/store', icon: ShoppingBag },
  { label: 'EARNINGS', href: '/dashboard/earnings', icon: DollarSign },
  { label: 'GROWTH', href: '/dashboard/growth', icon: Activity },
  { label: 'HELP', href: '/dashboard/help', icon: HelpCircle },
  { label: 'FEEDBACK', href: '/dashboard/feedback', icon: MessageSquare },
];

export default function DashboardNavbar({ user, isProfileOpen, setIsProfileOpen, setActiveSection, handleLogoClick }) {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef(null);
  const [isQuickLinksExpanded, setIsQuickLinksExpanded] = React.useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsProfileOpen]);

  const handleCopy = (linkLabel, value) => {
    navigator.clipboard.writeText(value);
    toast.success(`${linkLabel} Copied!`);
  };

  const quickLinks = [
    { label: 'Donation Page', value: `${window.location.origin}/pay/${user?.username || 'user'}` },
    { label: 'Overlay Link', value: `${window.location.origin}/overlay/${user?.obsKey || 'key'}` },
    { label: 'Goal Link', value: `${window.location.origin}/goal/${user?.username || 'user'}` },
    { label: 'Master Link', value: `${window.location.origin}/overlay/master/${user?.obsKey || 'key'}` }
  ];

  return (
    <header
      className="flex fixed top-0 right-0 left-0 h-[70px] z-[60] items-center justify-between px-4 md:px-8 transition-all duration-500"
      style={{
        background: 'var(--nexus-panel)',
        borderBottom: '1px solid var(--nexus-border)'
      }}
    >

      {/* LEFT: Brand Logo Anchor */}
      <Link to="/dashboard" className="flex items-center gap-2 group pointer-events-auto shrink-0">
        <Logo 
          size="1.2rem" 
          accentColor="#FF2D00" 
          className={theme === 'light' ? 'text-black' : 'text-white'} 
          isLight={theme === 'light'}
        />
      </Link>

      {/* CENTER: DESKTOP NAVIGATION (Restored for iPad with optimized spacing) */}
      <nav className="hidden md:flex items-center gap-3 md:gap-4 lg:gap-8 flex-1 justify-center px-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} to={item.href} className="relative group px-1">
              <motion.div
                whileHover={{ y: -1 }}
                className={`flex items-center gap-2 py-2 transition-colors duration-300`}
                style={{ color: active ? 'var(--nexus-text)' : 'var(--nexus-text-muted)' }}
              >
                <Icon size={14} strokeWidth={active ? 2.5 : 1.5} className={active ? 'text-theme-accent' : ''} />
                <span className={`font-mono text-[9px] lg:text-[10px] uppercase tracking-[0.2em] font-black`}>
                  {item.label}
                </span>

                {/* Active Indicator */}
                {active && (
                  <div className="absolute bottom-0 left-1 right-1 h-[2px] bg-theme-accent rounded-full" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* RIGHT: Actions & User Identity */}
      <div className="flex items-center gap-4 md:gap-8 relative" ref={dropdownRef}>

        {/* MODE TOGGLE (Neural Switch) */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-105"
          style={{ borderColor: 'var(--nexus-border)', color: 'var(--nexus-text-muted)', background: 'var(--nexus-panel)' }}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>


        {/* ACTIONS & USER IDENTITY */}
        <div className="flex items-center gap-1 md:gap-2">

          {/* PROFILE TOGGLE */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 group transition-all"
          >
            <div className="text-right hidden md:block">
              <p className="font-mono text-[9px] md:text-[10px] uppercase font-black tracking-wider group-hover:text-[var(--nexus-accent)] transition-colors leading-none mb-1" style={{ color: 'var(--nexus-text)' }}>
                {user?.fullName || 'CREATOR NODE'}
              </p>
              <p className="font-mono text-[7px] md:text-[8px] uppercase tracking-[0.2em] font-medium leading-none" style={{ color: 'var(--nexus-accent)' }}>PRO</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-[11px] md:text-[12px] group-hover:scale-105 transition-transform border-[1.5px] overflow-hidden" 
                 style={{ background: 'var(--nexus-panel)', color: 'var(--nexus-text)', borderColor: 'var(--nexus-border)' }}>
              <span className={isProfileOpen ? 'hidden' : 'block'}>
                {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'RK'}
              </span>
              <motion.div
                animate={{ rotate: isProfileOpen ? 180 : 0 }}
                className={isProfileOpen ? 'block' : 'hidden'}
              >
                <ChevronRight size={14} className="rotate-90" />
              </motion.div>
            </div>
          </button>
        </div>

        {/* HIGH-FIDELITY PROFILE DROPDOWN */}
        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-[72px] right-2 w-[280px] shadow-2xl rounded-2xl z-[100] overflow-hidden border"
              style={{ 
                background: 'var(--nexus-panel)', 
                borderColor: 'var(--nexus-border)',
                opacity: 1, /* Ensure 100% solidness */
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
              }}
            >
              {/* HEADER: Identity Reveal */}
              <div className="p-8 pb-6 flex flex-col items-center border-b" style={{ borderColor: 'var(--nexus-border)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-xl border-4"
                     style={{ background: 'var(--nexus-panel)', color: 'var(--nexus-text)', borderColor: 'var(--nexus-border)' }}>
                   {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'RK'}
                </div>
                <h3 className="font-sans font-black text-sm uppercase tracking-tight" style={{ color: 'var(--nexus-text)' }}>
                  {user?.fullName || 'CREATOR NODE'}
                </h3>
                <p className="font-mono text-[9px] uppercase tracking-widest mt-1" style={{ color: 'var(--nexus-text-muted)' }}>
                  {user?.streamerId ? `@${user.streamerId}` : 'ID: @SECURE_NODE'}
                </p>
              </div>

              {/* TELEMETRY: Node Stats Grid */}
              <div className="grid grid-cols-2 border-b" style={{ borderColor: 'var(--nexus-border)' }}>
                <div className="p-4 border-r text-center" style={{ borderColor: 'var(--nexus-border)' }}>
                  <p className="font-mono text-[7px] uppercase tracking-widest mb-1" style={{ color: 'var(--nexus-text-muted)' }}>Balance</p>
                  <p className="font-sans font-black text-xs uppercase" style={{ color: 'var(--nexus-text)' }}>
                    ₹{(Number(user?.walletBalance) || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-4 text-center">
                  <p className="font-mono text-[7px] uppercase tracking-widest mb-1" style={{ color: 'var(--nexus-text-muted)' }}>Node_Tier</p>
                  <div className="flex items-center justify-center gap-1">
                    <Zap size={8} style={{ color: 'var(--nexus-accent)' }} fill="currentColor" />
                    <p className="font-sans font-black text-xs uppercase italic" style={{ color: 'var(--nexus-text)' }}>
                      {user?.subscription?.plan || 'STARTER'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTIONS: Tactical Menu */}
              <div className="p-1 space-y-1">
                {/* Tactical Action Button (Expandable Toggle) */}
                <div className="p-3 border-b border-[var(--nexus-border)]/50">
                  <button
                    onClick={() => setIsQuickLinksExpanded(!isQuickLinksExpanded)}
                    className="mx-auto block w-full py-2.5 rounded-none bg-[#111111] text-white text-[10px] font-black uppercase italic tracking-[0.3em] flex flex-row items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] shadow-lg"
                  >
                    <Zap className={`w-3 h-3 ${isQuickLinksExpanded ? 'text-amber-500' : 'text-[var(--nexus-accent)]'}`} />
                    {isQuickLinksExpanded ? 'Hide Links' : 'Quick Links'}
                    {isQuickLinksExpanded ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
                  </button>

                  <AnimatePresence>
                    {isQuickLinksExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 space-y-2">
                          {quickLinks.map((link, idx) => (
                            <div key={idx} className="p-2 border border-white/5 bg-white/[0.02] flex items-center justify-between group">
                              <div className="flex flex-col min-w-0">
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-0.5">{link.label}</span>
                                <span className="text-[9px] font-mono font-bold text-white/60 truncate pr-2">
                                  {link.value.replace(/^https?:\/\//, '')}
                                </span>
                              </div>
                              <button
                                onClick={() => handleCopy(link.label, link.value)}
                                className="p-1.5 hover:bg-white hover:text-black transition-all border border-transparent hover:border-white active:scale-95 text-white/40"
                                title="Copy Link"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                   to="/dashboard/profile"
                   onClick={() => { setIsProfileOpen(false); setActiveSection('profile'); }}
                   className="flex items-center justify-between p-3 px-4 rounded-xl transition-colors group border border-transparent hover:border-[var(--nexus-border)]"
                   style={{ color: 'var(--nexus-text)' }}
                 >
                   <div className="flex items-center gap-3">
                     <User size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                     <span className="font-mono text-[10px] uppercase font-bold tracking-wide">Profile</span>
                   </div>
                   <ChevronRight size={12} className="opacity-30 group-hover:translate-x-0.5 transition-all" />
                 </Link>

                 <button
                   onClick={() => { setIsProfileOpen(false); setActiveSection('settings'); }}
                   className="flex items-center justify-between p-3 px-4 rounded-xl transition-colors group border border-transparent hover:border-[var(--nexus-border)]"
                   style={{ color: 'var(--nexus-text)' }}
                 >
                   <div className="flex items-center gap-3">
                     <Settings size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                     <span className="font-mono text-[10px] uppercase font-bold tracking-wide">Settings</span>
                   </div>
                   <ChevronRight size={12} className="opacity-30 group-hover:translate-x-0.5 transition-all" />
                 </button>

                <div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--nexus-border)' }}>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}
                    className="w-full flex items-center gap-3 p-3 px-4 rounded-xl text-rose-500 hover:bg-rose-500/5 transition-colors group"
                  >
                    <LogOut size={14} className="transition-colors" />
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wide">De-authenticate</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
}

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { List } from 'react-window';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import {
    Users, Activity, ShieldAlert, ChevronLeft, ChevronRight,
    Search, ShieldOff, ArrowUpRight, Zap, Star,
    Wallet, TrendingUp, Landmark, CheckCircle2,
    DollarSign, LogOut, Menu,

    AlertTriangle, RefreshCw, Shield, ChevronDown,
    X, User as UserIcon, Monitor, Settings, CreditCard, Paintbrush, Cpu,
    Download, LineChart
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const PremiumSmallLoader = ({ text, className = "" }) => (
    <div className={`flex items-center gap-3 ${className}`}>
        <div className="relative">
            <div className="w-4 h-4 border border-black/5 rounded-full" />
            <div className="absolute inset-0 w-4 h-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent border rounded-full animate-spin" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
        </div>
        {text && <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#111111]">{text}</span>}
    </div>
);


// API_BASE is now handled by the centralized axios configuration in src/api/axios.js

// ─── Confirmation Modal ────────────────────────────────────────
const ConfirmModal = ({ open, title, message, confirmLabel, confirmColor = 'bg-rose-500', onConfirm, onCancel }) => (
    <AnimatePresence>
        {open && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/40">
                <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ duration: 0.3 }}
                    className="bg-white border border-black/10 w-full max-w-md p-8 shadow-2xl rounded-none relative">
                    
                    {/* Tactical Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/20" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black/20" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black/20" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/20" />

                    <h2 className="text-xl font-black text-[#111111] tracking-tighter uppercase mb-4 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-rose-500/50" />
                        {title}
                    </h2>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed mb-10 tracking-tight">
                        {message}
                    </p>
                    <div className="flex gap-4">
                        <button onClick={onCancel} className="flex-1 py-4 bg-black/5 hover:bg-black/10 text-[#111111] text-[10px] font-black uppercase tracking-[0.2em] border border-black/10 transition-all">
                            ABORT_ACTION
                        </button>
                        <button onClick={onConfirm} className={`flex-1 py-4 text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] ${confirmColor}`}>
                            {confirmLabel}
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// ─── KPI Card ─────────────────────────────────────────────────
const KpiCard = React.memo(({ icon: Icon, label, value, sub, accent, delay, details, detailsRender }) => {
    const [expanded, setExpanded] = useState(false);

    // Dynamic 'Admin Panel' stealth styles
    const bgClass = expanded
        ? 'bg-white border-emerald-500/30 shadow-[0_20px_40px_rgba(0,0,0,0.1)] scale-[1.02] z-10 ring-1 ring-emerald-500/20'
        : `${accent?.bg || 'bg-white/40'} border-black/5 hover:border-emerald-500/20 hover:bg-white/60`;


    return (
        <motion.div style={{ willChange: 'transform' }} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setExpanded(!expanded)}
            className={`cursor-pointer relative overflow-hidden rounded-none border border-black/5 p-6 transition-all duration-300 ease-out origin-top group ${bgClass}`}>

            {/* Tactical Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle, #111111 0.5px, transparent 0.5px)', backgroundSize: '12px 12px' }} />

            {/* Technical Border Accents */}
            <div className="absolute top-0 left-0 w-2 h-[1px] bg-emerald-500/50" />
            <div className="absolute top-0 left-0 w-[1px] h-2 bg-emerald-500/50" />
            <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-emerald-500/50" />
            <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-emerald-500/50" />

            <motion.div layout className="flex items-start justify-between mb-5 relative">
                <div className="w-10 h-10 rounded-none bg-black/5 border border-black/5 flex items-center justify-center transition-all duration-300 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:scale-110 transition-transform" />
                </div>
                {sub && (
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-black/5 border border-black/10 text-slate-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                        {sub}
                    </span>
                )}
            </motion.div>

            <motion.p layout className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1 transition-colors duration-300 group-hover:text-emerald-500/60">
                {label}
            </motion.p>
            <motion.p layout className={`text-4xl font-black tracking-tighter transition-colors duration-300 font-sans ${accent?.value || 'text-[#111111]'} group-hover:text-emerald-500`}>
                {value}
            </motion.p>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden border-t border-black/5 pt-4"
                    >
                        {detailsRender ? detailsRender() : (
                            <p className="text-xs font-semibold leading-relaxed text-slate-400">
                                {details}
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

// ─── Avatar ───────────────────────────────────────────────────
const Avatar = ({ name, isBanned }) => {
    const initials = (name || '?').slice(0, 2).toUpperCase();
    return (
        <div className={`w-10 h-10 rounded-none border flex items-center justify-center text-[11px] font-black tracking-tighter transition-all ${isBanned ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'}`}>
            {initials}
        </div>
    );
};

// ─── Status Dot ───────────────────────────────────────────────
const StatusDot = ({ active }) => (
    <div className={`w-2 h-2 rounded-none border shadow-[0_0_8px_rgba(0,0,0,1)] ${active ? 'bg-emerald-500 border-emerald-500/50 shadow-emerald-500/50' : 'bg-rose-500 border-rose-500/50 shadow-rose-500/50'}`} />
);

// ─── Tier Badge ───────────────────────────────────────────────
// Tier labels mapping
const tierLabels = { legend: 'Legend (95%)', pro: 'Pro (90%)', starter: 'Starter (85%)', none: 'Ghost' };

// ─── Deep User Profile Drawer ──────────────────────────────────
const UserDetailDrawer = ({ userId, isOpen, onClose, context = 'directory' }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [txTab, setTxTab] = useState('donations'); // 'donations' | 'expenses'

    useEffect(() => {
        if (!isOpen || !userId) return;
        setLoading(true);
        axios.get(`/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => setUser(res.data))
            .catch(err => console.error("Failed to load user details", err))
            .finally(() => setLoading(false));
    }, [userId, isOpen]);

    // Format date helper
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : 'Never';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-white/40" />

                    {/* Drawer */}
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-0 right-0 h-full w-full max-w-xl bg-white border-l border-black/10 z-[101] flex flex-col shadow-xl">

                        {loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <PremiumSmallLoader text="RETRIEVING_USER_DATA" />
                            </div>

                        ) : user ? (
                            <>
                                {/* Drawer Header */}
                                <div className="px-8 py-8 border-b border-black/5 bg-black/5 flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-none border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-sans font-black text-xs tracking-tighter shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                            {user.username.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-[#111111] tracking-tighter uppercase mb-0.5">
                                                {user.username}
                                                {user.role === 'admin' && <Star className="inline w-3.5 h-3.5 text-amber-500 fill-amber-500 ml-2 -translate-y-0.5" />}
                                            </h2>
                                            <p className="text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase">ENTITY_UID: <span className="text-slate-400 font-mono tracking-normal">{user._id}</span></p>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="p-3 bg-black/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-all border border-black/5 hover:border-rose-500/20">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Drawer Scrollable Content */}
                                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                                    {/* System Status Banner */}
                                    {user.security?.accountStatus?.isBanned && (
                                        <div className="bg-rose-500/5 border-l-4 border-rose-500 p-6 flex items-start gap-4 text-rose-500 group relative overflow-hidden">
                                            <div className="absolute inset-0 bg-rose-500/5 animate-pulse-slow" />
                                            <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5 relative z-10" />
                                            <div className="relative z-10">
                                                <h4 className="text-sm font-black uppercase tracking-tighter mb-1">NODE_SUSPENDED</h4>
                                                <p className="text-[11px] font-medium tracking-tight text-rose-500/60 uppercase">Critical restriction protocol engaged. Administrative intervention required.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* 1. Identity & Contact */}
                                    <section>
                                        <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6">
                                            <div className="w-4 h-[1px] bg-slate-800" />
                                            IDENTITY_CORE
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-black/5 p-6 border border-black/5 flex items-start gap-5 relative overflow-hidden group">
                                                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500/50 transition-all duration-300" />
                                                <div className="w-12 h-12 rounded-none bg-[#111111]/10 border border-black/5 flex items-center justify-center text-slate-500 font-black text-xl shrink-0 font-sans tracking-tighter">
                                                    {(user.fullName || user.username || '?').slice(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">LEGAL_FULL_ALIAS</p>
                                                    <p className="text-sm font-black text-[#111111] tracking-tight">{user.fullName || 'NOT_DECLARED'}</p>
                                                    <p className="text-[10px] text-emerald-500 font-black tracking-widest mt-1 lowercase">@{user.username}</p>
                                                </div>
                                            </div>

                                            <div className="bg-black/5 p-6 border border-black/5 flex flex-col justify-center space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">COMMS_EMAIL</p>
                                                        <p className="text-sm font-black text-[#111111] tracking-tight font-mono">{user.email || 'N/A'}</p>
                                                    </div>
                                                    {user.isEmailVerified ? <div className="w-2 h-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> : <div className="w-2 h-2 bg-rose-500" />}
                                                </div>
                                                <div className="pt-4 border-t border-black/5">
                                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">COMMS_PHONE</p>
                                                    <p className="text-sm font-black text-[#111111] tracking-tight font-mono">{user.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* 2. Financial Metrics */}
                                    <section>
                                        <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6">
                                            <div className="w-4 h-[1px] bg-slate-800" />
                                            FINANCIAL_TELEMETRY
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                                            <div className="bg-black/5 border border-black/5 p-6 group hover:bg-emerald-500/5 transition-all outline outline-0 hover:outline-1 outline-emerald-500/30">
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">LIFETIME_TPV</p>
                                                <p className="text-2xl font-black text-[#111111] tracking-tighter">₹{(user.financialMetrics?.totalLifetimeEarnings || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="bg-black/5 border border-black/5 p-6 group">
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">SETTLED</p>
                                                <p className="text-2xl font-black text-slate-500 tracking-tighter">₹{(user.financialMetrics?.totalSettled || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="bg-black/5 border border-black/5 p-6 group">
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">LIABILITY</p>
                                                <p className="text-2xl font-black text-rose-500 tracking-tighter">₹{(user.financialMetrics?.pendingPayouts || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="mt-1 bg-black/5 border border-black/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">GATEWAY_ACCOUNT_LINK</p>
                                                <p className="text-[11px] font-black text-[#111111] tracking-widest uppercase">{user.razorpayAccountId || 'NOT_CONNECTED'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">ONBOARD_MANIFEST</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500" />
                                                    <p className="text-[11px] font-black text-emerald-500 tracking-widest uppercase">{user.payoutSettings?.onboardingStatus}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {context !== 'finance' && (
                                        <>
                                            {/* 3. Drope Dashboard Preferences */}
                                            <section>
                                                <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6">
                                                    <div className="w-4 h-[1px] bg-slate-800" />
                                                    NEXUS_PREFERENCES
                                                </h3>
                                                <div className="grid grid-cols-2 gap-px bg-black/5 border border-black/5 overflow-hidden">
                                                    <div className="bg-white p-6">
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">EQUIPPED_THEME</p>
                                                        <p className="text-sm font-black text-[#111111] tracking-tight uppercase">{user.nexusTheme?.replace('-', '_')} <span className="text-slate-600 font-bold">({user.nexusThemeMode.toUpperCase()})</span></p>
                                                    </div>
                                                    <div className="bg-white p-6">
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">PREMIUM_VAULT</p>
                                                        <p className="text-sm font-black text-emerald-500 tracking-tight">{user.unlockedNexusThemes?.length || 0} UNLOCKED</p>
                                                    </div>
                                                    <div className="bg-white p-6 col-span-2">
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4">WIDGET_CLEARANCE</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(user.ownedWidgets?.length > 0) ? user.ownedWidgets.map((w, i) => (
                                                                <span key={i} className="px-3 py-1 bg-black/5 border border-black/5 text-[9px] font-black tracking-widest text-slate-500 uppercase">
                                                                    {w.replace(/-/g, '_')}
                                                                </span>
                                                            )) : <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest">ZERO_ASSETS_DETECTED</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* 4. Streamer Overlay Settings */}
                                            <section>
                                                <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6">
                                                    <div className="w-4 h-[1px] bg-slate-800" />
                                                    VISUAL_ASSET_MANIFEST
                                                </h3>
                                                <div className="bg-black/5 border border-black/5 space-y-px">
                                                    {[
                                                        { label: 'ALERT_STYLE', value: user.overlaySettings?.stylePreference, color: 'text-emerald-500' },
                                                        { label: 'GOAL_PROTOCOL', value: user.goalSettings?.stylePreference, color: 'text-amber-500' },
                                                        { label: 'TTS_ENGINE', value: user.overlaySettings?.ttsEnabled ? `${user.overlaySettings?.ttsVoice} (MIN ₹${user.overlaySettings?.ttsMinAmount})` : 'DISABLED', color: 'text-[#111111]' },
                                                        { label: 'ACTIVE_STICKER_GEN', value: user.overlaySettings?.activeStickerSet, color: 'text-slate-600' }
                                                    ].map((item, idx) => (
                                                        <div key={idx} className="bg-white px-6 py-4 flex justify-between items-center group">
                                                            <span className="text-[10px] text-slate-600 font-black tracking-widest uppercase">{item.label}</span>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${item.color || 'text-[#111111]'}`}>{item.value?.replace(/_/g, ' ') || 'N/A'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            {/* 5. Security & Auth */}
                                            <section>
                                                <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6">
                                                    <div className="w-4 h-[1px] bg-slate-800" />
                                                    TEMPORAL_LOGS
                                                </h3>
                                                <div className="bg-black/5 border border-black/5 p-6 grid grid-cols-2 gap-8">
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">NODE_INITIATION</p>
                                                        <p className="text-[11px] font-mono text-slate-600 uppercase tracking-tighter">{formatDate(user.createdAt)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">LAST_SYNC_EVENT</p>
                                                        <p className="text-[11px] font-mono text-slate-600 uppercase tracking-tighter">{formatDate(user.security?.lastLogin)}</p>
                                                    </div>
                                                    <div className="col-span-2 pt-4 border-t border-black/5">
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">ORIGIN_IP_ADR</p>
                                                        <p className="text-[11px] font-mono text-emerald-600 uppercase tracking-widest">{user.security?.lastLoginIP || 'HIDDEN_OR_UNKNOWN'}</p>
                                                    </div>
                                                </div>
                                            </section>
                                        </>
                                    )}

                                    {context === 'finance' && (
                                        <section>
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                                                    <div className="w-4 h-[1px] bg-slate-800" />
                                                    TRANSACTION_LEDGER
                                                </h3>
                                                <div className="flex bg-black/5 p-1 border border-black/10">
                                                    {[['donations', 'INFLOW'], ['expenses', 'OUTFLOW']].map(([tab, lbl]) => (
                                                        <button key={tab} onClick={() => setTxTab(tab)}
                                                            className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all
                                                            ${txTab === tab ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'text-slate-500 hover:text-slate-800'}`}>
                                                            {lbl}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {(() => {
                                                    const filteredTransactions = (user.recentTransactions || []).filter(tx => {
                                                        const isStore = tx.donorName === 'SYSTEM_DEBIT';
                                                        const isWithdrawal = tx.donorName === 'WITHDRAWAL' || tx.donorName === 'SETTLEMENT';
                                                        const isExpense = isStore || isWithdrawal;
                                                        return txTab === 'donations' ? !isExpense : isExpense;
                                                    });

                                                    if (filteredTransactions.length === 0) {
                                                        return (
                                                            <div className="text-center py-10 border border-dashed border-black/10 bg-black/5">
                                                                <p className="text-xs font-bold text-slate-500">No {txTab} found.</p>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <List
                                                            height={Math.min(350, filteredTransactions.length * 85)}
                                                            rowCount={filteredTransactions.length}
                                                            rowHeight={85}
                                                            rowProps={{ filteredTransactions, formatDate, txTab }}
                                                            rowComponent={({ index, style, filteredTransactions, formatDate, txTab }) => {
                                                                const tx = filteredTransactions[index];
                                                                if (!tx) return null;
                                                                const isDebit = tx.amount < 0;
                                                                const isStore = tx.donorName === 'SYSTEM_DEBIT';
                                                                const isWithdrawal = tx.donorName === 'WITHDRAWAL' || tx.donorName === 'SETTLEMENT';

                                                                let title = tx.donorName;
                                                                if (isStore) title = "Store Purchase";
                                                                if (isWithdrawal) title = "Bank Withdrawal";

                                                                let statusColor = "text-slate-400";
                                                                if (tx.status === 'completed') statusColor = "text-emerald-500";
                                                                else if (tx.status === 'pending') statusColor = "text-amber-500";
                                                                else if (tx.status === 'failed' || tx.status === 'cancelled') statusColor = "text-rose-500";

                                                                return (
                                                                    <div style={style} className="pr-2 pb-1">
                                                                        <div className="bg-black/5 border border-black/5 p-5 flex items-center justify-between h-full relative group hover:border-black/10 transition-all">
                                                                            <div className="flex items-center gap-4">
                                                                                <div className={`w-1 h-8 ${isDebit ? 'bg-rose-500' : 'bg-emerald-500'} opacity-40 group-hover:opacity-100 transition-opacity`} />
                                                                                <div>
                                                                                    <div className="flex items-center gap-3">
                                                                                        <p className="text-xs font-black text-[#111111] uppercase tracking-tight">{title}</p>
                                                                                        {isStore && <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400">#ASSET</span>}
                                                                                        {isWithdrawal && <span className="text-[8px] font-black uppercase tracking-[0.2em] text-sky-400">#PAYOUT</span>}
                                                                                        {!isStore && !isWithdrawal && <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500">#INFLOW</span>}
                                                                                    </div>
                                                                                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight line-clamp-1">{tx.message || 'SYSTEM_LOG_ENTRY'}</p>
                                                                                    <p className="text-[9px] font-mono text-slate-600 mt-1 uppercase">{formatDate(tx.createdAt)}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right shrink-0">
                                                                                <p className={`text-sm font-black tracking-tighter ${isDebit ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                                                    {isDebit ? '-' : '+'}₹{Math.abs(tx.amount || 0).toLocaleString()}
                                                                                </p>
                                                                                <p className={`text-[8px] font-black uppercase tracking-[0.2em] mt-1 ${statusColor}`}>
                                                                                    {tx.status}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }}
                                                            className="custom-scrollbar"
                                                        />
                                                    );
                                                })()}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                                <button onClick={onClose} className="absolute top-8 right-8 p-3 text-slate-500 hover:bg-black/5 hover:text-[#111111] transition-all border border-transparent hover:border-black/10 uppercase font-black text-[10px] tracking-widest">
                                    [CLOSE_DRAWER]
                                </button>
                                <div className="w-16 h-16 bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20">
                                    <AlertTriangle className="w-8 h-8 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]" />
                                </div>
                                <h3 className="text-sm font-black text-[#111111] tracking-widest uppercase">ACCOUNT_NOT_FOUND</h3>
                                <p className="text-[10px] text-slate-600 font-black mt-3 mb-8 text-center max-w-[280px] uppercase tracking-widest leading-relaxed">
                                    NODE_UNREACHABLE_OR_DELETED_FROM_SECURE_REGISTRY
                                </p>
                                <button onClick={onClose} className="px-8 py-3 bg-emerald-500 text-black hover:bg-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                                    RETURN_TO_BASE
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const AdminSecurePortal = () => {
    const navigate = useNavigate();

    // — State —
    const [metrics, setMetrics] = useState({
        totalUsers: 0, activeSubscriptions: 0, lifetimeSubscribers: 0, totalVolume: 0,
        totalUnsettledDebt: 0, platformCommission: 0, platformSubscriptions: 0, platformPayouts: 0
    });
    const [activeSection, setActiveSection] = useState('directory');
    const [payoutQueue, setPayoutQueue] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalNodes, setTotalNodes] = useState(0);

    // — Analytics & Ledger State —
    const [timeSeries, setTimeSeries] = useState({ revenueTrends: [], userGrowth: [] });
    const [searchTerm, setSearchTerm] = useState('');

    // — Debounce Search —
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchTerm);
            setPage(1);
        }, 500); 
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const [transactions, setTransactions] = useState([]);
    const [txPage, setTxPage] = useState(1);
    const [txTotalPages, setTxTotalPages] = useState(1);
    const [txTotalDocs, setTxTotalDocs] = useState(0);
    const [txFilters, setTxFilters] = useState({ status: 'all', type: 'all', search: '' });

    // — Mediation State —
    const [disputes, setDisputes] = useState([]);

    const [clock, setClock] = useState(new Date());
    const [modal, setModal] = useState(null); // { title, message, onConfirm, confirmLabel, confirmColor }
    const [refreshing, setRefreshing] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [drawerContext, setDrawerContext] = useState('directory');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [adminProfile, setAdminProfile] = useState(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const fileInputRef = useRef(null);

    // — V5 SCALING UPGRADE STATES —
    const [auditLogs, setAuditLogs] = useState([]);
    const [logsPage, setLogsPage] = useState(1);
    const [totalLogsPages, setTotalLogsPages] = useState(1);
    const [systemHealth, setSystemHealth] = useState(null);

    // — NEW: GLOBAL STATES —
    const [globalConfig, setGlobalConfig] = useState({
        defaultCommissionRate: 10,
        minWithdrawalThreshold: 500,
        maintenanceMode: false
    });
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [broadcastLevel, setBroadcastLevel] = useState('Standard');
    const [activityLogs, setActivityLogs] = useState([]);

    // — Live clock —
    useEffect(() => {
        const t = setInterval(() => setClock(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    // — Auth header helper —
    const authHeader = useCallback(() => ({ Authorization: `Bearer ${localStorage.getItem('token')}` }), []);

    // — Fetch functions —
    const fetchMetrics = useCallback(async () => {
        try {
            const res = await axios.get('/api/admin/metrics', { headers: authHeader() });
            setMetrics(res.data);
        } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 401) navigate('/dashboard');
        }
    }, [navigate, authHeader]);

    const fetchNodes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `/api/admin/users?page=${page}&limit=20&search=${search}&role=${roleFilter}`,
                { headers: authHeader() }
            );
            setNodes(res.data.nodes);
            setTotalPages(res.data.totalPages);
            setTotalNodes(res.data.totalNodes);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [page, search, roleFilter, authHeader]);

    const fetchPayoutQueue = useCallback(async () => {
        try {
            const res = await axios.get('/api/admin/payouts', { headers: authHeader() });
            setPayoutQueue(res.data);
        } catch (err) { console.error(err); }
    }, [authHeader]);

    const fetchTimeSeries = useCallback(async () => {
        try {
            const res = await axios.get('/api/admin/metrics/timeseries', { headers: authHeader() });
            setTimeSeries(res.data);
        } catch (err) { console.error(err); }
    }, [authHeader]);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const { status, type, search } = txFilters;
            const res = await axios.get(
                `/api/admin/transactions?page=${txPage}&limit=20&status=${status}&type=${type}&search=${search}`,
                { headers: authHeader() }
            );
            setTransactions(res.data.transactions);
            setTxTotalPages(res.data.totalPages);
            setTxTotalDocs(res.data.totalTransactions);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [txPage, txFilters, authHeader]);

    const fetchGlobalConfig = useCallback(async () => {
        try {
            const res = await axios.get('/api/admin/config', {
                headers: authHeader()
            });
            setGlobalConfig(res.data);
        } catch (err) {
            console.error("Config fetch error:", err);
        }
    }, [authHeader]);

    const updateGlobalConfig = async (updates) => {
        try {
            const res = await axios.patch('/api/admin/config',
                { platformSettings: updates },
                { headers: authHeader() }
            );
            setGlobalConfig(res.data.settings);
            toast.success("Platform Settings Updated", {
                style: { background: '#050505', color: '#10b981', border: '1px solid #10b98120' }
            });
        } catch (err) {
            toast.error("Calibration Failed");
        }
    };

    const dispatchBroadcast = async () => {
        if (!broadcastMsg) return;
        try {
            await axios.post('/api/admin/broadcast',
                { message: broadcastMsg, level: broadcastLevel.toLowerCase() },
                { headers: authHeader() }
            );
            setBroadcastMsg('');
            toast.success("Broadcast Dispatched", {
                icon: '⚡',
                style: { background: '#050505', color: '#10b981', border: '1px solid #10b98120' }
            });
            addActivityLog(`Broadcast Dispatched: ${broadcastMsg.substring(0, 20)}...`, 'broadcast');
        } catch (err) {
            toast.error("Transmission Interrupted");
        }
    };

    const fetchAdminProfile = useCallback(async () => {
        try {
            const res = await axios.get('/api/admin/profile', { headers: authHeader() });
            setAdminProfile(res.data);
        } catch (err) {
            console.error("Admin Profile Fetch error:", err);
        }
    }, [authHeader]);

    const fetchAuditLogs = useCallback(async (p = 1) => {
        try {
            const res = await axios.get(`/api/admin/logs?page=${p}`, { headers: authHeader() });
            setAuditLogs(res.data.logs || []);
            setTotalLogsPages(res.data.totalPages || 1);
            setLogsPage(res.data.currentPage || 1);
        } catch (err) {
            console.error("Audit Logs fetch error:", err);
            toast.error('Security Logs Retrieval Failed');
        }
    }, [authHeader]);

    const fetchDisputes = useCallback(async () => {
        try {
            const res = await axios.get('/api/admin/disputes', { headers: authHeader() });
            setDisputes(res.data || []);
        } catch (err) { console.error('Active Mediations Offline'); }
    }, [authHeader]);

    const fetchSystemHealth = useCallback(async () => {
        try {
            const res = await axios.get('/api/admin/health', { headers: authHeader() });
            setSystemHealth(res.data);
        } catch (err) { console.error('System Status Data Offline'); }
    }, [authHeader]);

    const handleTogglePause = async () => {
        const action = systemHealth?.isPaused ? 'RESUME all payouts?' : 'FREEZE all payouts and orders?';
        if (!window.confirm(`Are you sure you want to ${action}`)) return;

        try {
            await axios.put('/api/admin/toggle-pause', {}, { headers: authHeader() });
            toast.success(systemHealth?.isPaused ? "System Resumed" : "System Frozen", {
                icon: systemHealth?.isPaused ? '✅' : '🚨',
                style: { background: '#050505', color: '#10b981', border: '1px solid #10b98120' }
            });
            fetchSystemHealth(); // Refresh immediately
        } catch (err) {
            toast.error("Circuit Breaker Override Failed");
        }
    };

    const updateAdminProfileData = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            await axios.patch('/api/admin/profile', {
                fullName: adminProfile.fullName,
                adminProfile: adminProfile.adminProfile
            }, { headers: authHeader() });
            toast.success("Admin Profile Updated", {
                style: { background: '#050505', color: '#10b981', border: '1px solid #10b98120' }
            });
            addActivityLog(`Admin Profile Updated`, 'security');
        } catch (err) {
            toast.error("Synchronization Failed");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const res = await axios.post('/api/admin/profile/avatar', formData, {
                headers: {
                    ...authHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            setAdminProfile(prev => ({
                ...prev,
                adminProfile: {
                    ...prev.adminProfile,
                    avatar: res.data.avatarUrl
                }
            }));
            toast.success("Profile Picture Updated", {
                style: { background: '#050505', color: '#10b981', border: '1px solid #10b98120' }
            });
            addActivityLog(`Admin Avatar Updated`, 'security');
        } catch (err) {
            toast.error("Avatar Synchronization Failed");
        }
    };

    const addActivityLog = (message, type = 'info') => {
        const newEvent = {
            id: Date.now(),
            message,
            type,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setActivityLogs(prev => [newEvent, ...prev].slice(0, 20));
    };

    const fetchAllData = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([
            fetchMetrics(),
            fetchNodes(),
            fetchPayoutQueue(),
            fetchGlobalConfig(),
            fetchAdminProfile(),
            fetchAuditLogs(),
            fetchSystemHealth(),
            fetchTimeSeries(),
            activeSection === 'ledger' ? fetchTransactions() : Promise.resolve(),
            activeSection === 'disputes' ? fetchDisputes() : Promise.resolve()
        ]);
        setRefreshing(false);
        setLoading(false);
    }, [fetchMetrics, fetchNodes, fetchPayoutQueue, fetchGlobalConfig, fetchAdminProfile, fetchAuditLogs, fetchSystemHealth, fetchTimeSeries, fetchTransactions, fetchDisputes, activeSection]);

    useEffect(() => {
        fetchAllData();
        const metricsInterval = setInterval(fetchMetrics, 15000);      // KPIs refresh every 15s
        const healthInterval = setInterval(fetchSystemHealth, 10000);   // System Status every 10s
        const logsInterval = setInterval(() => fetchAuditLogs(logsPage), 30000); // Audit Logs every 30s
        return () => {
            clearInterval(metricsInterval);
            clearInterval(healthInterval);
            clearInterval(logsInterval);
        };
    }, [fetchAllData, fetchMetrics, fetchSystemHealth, fetchAuditLogs, logsPage]);

    const refreshAll = async () => {
        setRefreshing(true);
        const tasks = [fetchMetrics(), fetchTimeSeries()];
        if (activeSection === 'directory') tasks.push(fetchNodes());
        else if (activeSection === 'finance') tasks.push(fetchPayoutQueue());
        else if (activeSection === 'security') tasks.push(fetchAuditLogs(logsPage));
        else if (activeSection === 'health') tasks.push(fetchSystemHealth());
        else if (activeSection === 'config') tasks.push(fetchGlobalConfig());
        else if (activeSection === 'admin_profile') tasks.push(fetchAdminProfile());
        else if (activeSection === 'ledger') tasks.push(fetchTransactions());
        else if (activeSection === 'disputes') tasks.push(fetchDisputes());
        await Promise.all(tasks);
        setRefreshing(false);
    };

    // — Confirm modal helper —
    const confirm = (config) => setModal(config);
    const closeModal = () => setModal(null);

    // — Moderation actions (all preserved) —
    const toggleBan = (id, isBanned) => {
        confirm({
            title: isBanned ? 'Reinstate Node' : 'Suspend Node',
            message: isBanned
                ? 'This will restore full account access. The user will be able to log in immediately.'
                : 'This will immediately terminate all live connections and block access. Proceed?',
            confirmLabel: isBanned ? 'Reinstate' : 'Suspend',
            confirmColor: isBanned ? 'bg-emerald-500' : 'bg-rose-500',
            onConfirm: async () => {
                closeModal();
                try {
                    await axios.patch(`/api/admin/users/${id}/ban`, {}, { headers: authHeader() });
                    fetchNodes();
                } catch (err) { toast.error(err.response?.data?.msg || 'Moderation override failed.'); }
            }
        });
    };

    const overrideTier = async (id, targetTier) => {
        confirm({
            title: 'Override Tier',
            message: `Escalate this node to ${tierLabels[targetTier] || targetTier}? This affects their commission rate immediately.`,
            confirmLabel: 'Override',
            confirmColor: 'bg-amber-500',
            onConfirm: async () => {
                closeModal();
                try {
                    await axios.patch(`/api/admin/users/${id}/tier`, { targetTier }, { headers: authHeader() });
                    fetchNodes();
                } catch (err) { toast.error('Tier Override Failed'); }
            }
        });
    };

    const overrideRole = async (id, targetRole) => {
        confirm({
            title: 'Update Access Role',
            message: `Grant ${targetRole.toUpperCase()} clearance to this node? ${targetRole === 'admin' ? 'Admin access gives full portal control.' : 'This will revoke admin privileges.'}`,
            confirmLabel: 'Confirm',
            confirmColor: targetRole === 'admin' ? 'bg-amber-500' : 'bg-slate-700',
            onConfirm: async () => {
                closeModal();
                try {
                    await axios.patch(`/api/admin/users/${id}/role`, { targetRole }, { headers: authHeader() });
                    fetchNodes();
                } catch (err) { toast.error(err.response?.data?.msg || 'Access Role Override Failed'); }
            }
        });
    };

    const executeSettlement = (id, amount) => {
        confirm({
            title: 'Execute Settlement',
            message: `Mark ₹${amount.toLocaleString()} as officially SETTLED for this node? This action is irreversible.`,
            confirmLabel: 'Execute',
            confirmColor: 'bg-emerald-600',
            onConfirm: async () => {
                closeModal();
                try {
                    await axios.post(`/api/admin/payouts/${id}/settle`, {}, { headers: authHeader() });
                    fetchPayoutQueue();
                    fetchMetrics();
                } catch (err) { toast.error('Settlement execution failed.'); }
            }
        });
    };

    const rejectSettlement = (id, amount) => {
        confirm({
            title: 'Reject Settlement',
            message: `Reject the ₹${amount.toLocaleString()} payout request and refund it to their standard wallet?`,
            confirmLabel: 'Reject',
            confirmColor: 'bg-rose-600',
            onConfirm: async () => {
                closeModal();
                try {
                    await axios.post(`/api/admin/payouts/${id}/reject`, {}, { headers: authHeader() });
                    fetchPayoutQueue();
                    fetchMetrics();
                } catch (err) { toast.error('Settlement rejection failed.'); }
            }
        });
    };

    const authorizeRefund = async (id) => {
        confirm({
            title: 'Authorize Refund',
            message: 'Claw back the net amount from the Creator and mark this as refunded?',
            confirmLabel: 'Issue Refund',
            confirmColor: 'bg-rose-600',
            onConfirm: async () => {
                closeModal();
                try {
                    await axios.post(`/api/admin/disputes/${id}/resolve`, {}, { headers: authHeader() });
                    toast.success('Refund Authorized.', { style: { background: '#050505', color: '#10b981', border: '1px solid #10b98120' }});
                    fetchDisputes();
                    if(activeSection === 'ledger') fetchTransactions();
                } catch (err) { toast.error('Failed to issue refund.'); }
            }
        });
    };

    const dismissDispute = async (id) => {
        confirm({
            title: 'Dismiss Case',
            message: "Reject this dispute? The funds will remain secured in the creator's account.",
            confirmLabel: 'Dismiss',
            confirmColor: 'bg-emerald-600',
            onConfirm: async () => {
                closeModal();
                try {
                    await axios.post(`/api/admin/disputes/${id}/reject`, {}, { headers: authHeader() });
                    toast.success('Dispute Dismissed.', { style: { background: '#050505', color: '#10b981', border: '1px solid #10b98120' }});
                    fetchDisputes();
                } catch (err) { toast.error('Failed to dismiss dispute.'); }
            }
        });
    };

    const downloadCSV = () => {
        if (!transactions || transactions.length === 0) {
            toast.warning("No transactions to export in current view.", { icon: '⚠️', style: { background: '#050505', color: '#f59e0b', border: '1px solid #f59e0b20' }});
            return;
        }
        
        const headers = ["ID,Date,Type,User/Donor,Message,Amount,Status,Platform Fee,Gateway"];
        const rows = transactions.map(tx => {
            return `"${tx._id}","${new Date(tx.createdAt).toISOString()}","${tx.type}","${(tx.donorName || '').replace(/"/g, '""')}","${(tx.message || '').replace(/"/g, '""')}","${tx.amount}","${tx.status}","${tx.platformFee}","${tx.metadata?.gateway || ''}"`;
        });
        
        const csvContent = headers.concat(rows).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `drope_ledger_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Ledger Exported Successfully", {
            icon: '📄',
            style: { background: '#050505', color: '#10b981', border: '1px solid #10b98120' }
        });
    };

    // — Navigation Configuration —
    const navItems = useMemo(() => [
        { id: 'directory', icon: Users, label: 'User Directory' },
        { id: 'finance', icon: DollarSign, label: 'Financial Dashboard' },
        { id: 'ledger', icon: CreditCard, label: 'Global Ledger' },
        { id: 'disputes', icon: AlertTriangle, label: 'Resolution Center' },
        { id: 'broadcast', icon: ShieldAlert, label: 'System Announcements' },
        { id: 'config', icon: Settings, label: 'Global Config' },
        { id: 'security', icon: Shield, label: 'Security Audits' },
        { id: 'health', icon: Activity, label: 'System Status' },
        { id: 'admin_profile', icon: UserIcon, label: 'Admin Profile' },
    ], []);

    // — KPI cards data —
    const kpiCards = useMemo(() => [
        {
            icon: Users, label: 'Total Accounts', delay: 0.05,
            value: (metrics.totalUsers || 0).toLocaleString(),
            sub: 'All Time',
            details: 'Total registered user accounts across the platform. Includes both normal users and system admins.',
            accent: { bg: 'bg-black/5', border: 'border-black/10', icon: 'bg-black/5 text-slate-500', value: 'text-[#111111]', chip: 'bg-black/5 text-slate-500' }
        },
        {
            icon: ArrowUpRight, label: 'Creator Gross (TPV)', delay: 0.10,
            value: `₹${(metrics.totalVolume || 0).toLocaleString()}`,
            sub: 'Lifetime',
            details: 'Total Payment Volume. The gross amount collectively processed by all creators across the platform.',
            accent: { bg: 'bg-black/5', border: 'border-black/10', icon: 'bg-black/5 text-slate-500', value: 'text-[#111111]', chip: 'bg-black/5 text-slate-500' }
        },
        {
            icon: TrendingUp, label: 'Platform Commission', delay: 0.15,
            value: `₹${(metrics.platformCommission || 0).toLocaleString()}`,
            sub: 'Retained',
            details: 'Total net commission captured and retained natively by Drope from all historic transactions.',
            accent: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'bg-emerald-500/20 text-emerald-600', value: 'text-emerald-600', chip: 'bg-emerald-500/20 text-emerald-500' }
        },
        {
            icon: Activity, label: 'Active Subscriptions', delay: 0.20,
            value: (metrics.activeSubscriptions || 0).toLocaleString(),
            sub: 'Live',
            details: 'Total number of live, active fans currently subscribed to content creators on the platform.',
            accent: { bg: 'bg-black/5', border: 'border-black/10', icon: 'bg-indigo-500/20 text-indigo-600', value: 'text-[#111111]', chip: 'bg-indigo-500/10 text-indigo-500' }
        },
        {
            icon: Landmark, label: 'Subscription MRR', delay: 0.25,
            value: `₹${(metrics.platformSubscriptions || 0).toLocaleString()}`,
            sub: 'Revenue',
            detailsRender: () => (
                <div className="bg-indigo-500/5 border border-black/10 mt-2 p-4">
                    <table className="w-full text-left text-[11px]">
                        <tbody>
                            <tr className="border-b border-indigo-500/10">
                                <td className="py-2.5 px-3 font-bold text-slate-500 uppercase tracking-widest">Active Subscriptions</td>
                                <td className="py-2.5 px-3 text-right font-black text-indigo-600">{(metrics.activeSubscriptions || 0).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 px-3 font-bold text-slate-500 uppercase tracking-widest">Lifetime Subscribers</td>
                                <td className="py-2.5 px-3 text-right font-black text-indigo-600">{(metrics.lifetimeSubscribers || 0).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ),
            accent: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: 'bg-indigo-500/20 text-indigo-600', value: 'text-indigo-600', chip: 'bg-indigo-500/20 text-indigo-500' }
        },
        {
            icon: Wallet, label: 'Unsettled Liability', delay: 0.30,
            value: `₹${(metrics.totalUnsettledDebt || 0).toLocaleString()}`,
            sub: `Settled ₹${(metrics.platformPayouts || 0).toLocaleString()}`,
            details: 'Total cumulated platform debt sitting in creator wallets currently awaiting final manual settlement.',
            accent: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: 'bg-rose-500/20 text-rose-600', value: 'text-rose-600', chip: 'bg-rose-500/20 text-rose-500' }
        },
    ], [metrics]);

    return (
        <div className="flex min-h-screen bg-[#f5f4e2] font-sans relative text-[#111111] overflow-hidden">
            {/* Blueprint Grid Overlay */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
                style={{ backgroundImage: 'linear-gradient(#000000 1px, transparent 1px), linear-gradient(90deg, #000000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/[0.03] blur-[120px]" />
            </div>

            {/* ── CONFIRMATION MODAL ── */}
            <ConfirmModal
                open={!!modal}
                title={modal?.title}
                message={modal?.message}
                confirmLabel={modal?.confirmLabel}
                confirmColor={modal?.confirmColor}
                onConfirm={modal?.onConfirm}
                onCancel={closeModal}
            />

            {/* ── USER DETAIL DRAWER ── */}
            <AnimatePresence>
                <UserDetailDrawer
                    userId={selectedUserId}
                    isOpen={!!selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                    context={drawerContext}
                />
            </AnimatePresence>
            {/* ── MOBILE OVERLAY ── */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-white/40 z-40 lg:hidden" />
                )}
            </AnimatePresence>

            {/* ── SIDEBAR (Stealth Glass Theme) ── */}
            <aside className={`fixed top-0 left-0 h-full w-64 lg:w-56 bg-white border-r border-black/10 flex flex-col z-50 shrink-0 transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Logo */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 bg-black/5">
                    <div className="flex items-center gap-3">

                        <div className="flex flex-col">
                            <span className="text-[#111111] font-black text-xl tracking-tighter leading-none mb-0.5">drope.in</span>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                <span className="text-emerald-600 text-[8px] font-black tracking-[0.3em] uppercase">ADMIN_NEXUS</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-500 p-1 hover:text-[#111111] transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-0 space-y-px">
                    {navItems.map(({ id, icon: Icon, label }) => (
                        <button key={id} onClick={() => { setActiveSection(id); setMobileMenuOpen(false); }}

                            className={`w-full flex items-center gap-4 px-6 py-3.5 transition-all duration-300 group relative
                            ${activeSection === id
                                    ? 'bg-black/5 text-emerald-600 border-l-4 border-emerald-500'
                                    : 'text-slate-500 hover:text-[#111111] hover:bg-black/5 border-l-4 border-transparent'}`}>

                            <Icon className={`w-4 h-4 shrink-0 transition-colors ${activeSection === id ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-600'}`} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
                            {activeSection === id && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-px bg-emerald-500/20" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Exit */}
                <div className="p-4 border-t border-black/10 bg-black/5">
                    <button onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/admin/login');
                    }}
                        className="w-full flex items-center gap-4 px-6 py-4 text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/5 transition-all group border border-transparent">
                        <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">DE-AUTHORIZE</span>
                    </button>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col lg:ml-56 h-screen w-full transition-all overflow-hidden bg-transparent">

                {/* Top header */}
                <header className="shrink-0 z-30 bg-white border-b border-black/10 px-4 md:px-8 h-[70px] flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-1.5 -ml-1.5 text-slate-600 hover:bg-black/5 rounded-none transition-colors border border-black/10">
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                            <div className="w-1.5 h-6 bg-emerald-500/40" />
                            <span className="text-[#111111] font-black">
                                {activeSection.replace(/_/g, ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Live clock */}
                        <div className="hidden md:flex items-center gap-4 px-5 py-2.5 bg-black/5 border border-black/10 text-[11px] font-mono text-emerald-400">
                            <div className="w-2 h-2 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse" />
                            {clock.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                        {/* Refresh */}
                        <button onClick={refreshAll}
                            className="p-3 bg-black/5 border border-black/10 text-slate-400 hover:bg-emerald-500 hover:text-black transition-all">
                            {refreshing ? <PremiumSmallLoader /> : <RefreshCw className="w-4 h-4" />}
                        </button>

                        {/* Admin badge */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500">
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">ADMIN_PRIMARY</span>
                        </div>
                    </div>
                </header >

                {/* Page content */}
                <main className="flex-1 px-4 py-6 md:p-6 w-full max-w-[100vw] overflow-y-auto overflow-x-hidden custom-scrollbar pb-24">

                    {/* KPI Grid - Only visible in Directory and Finance for high-level telemetry context */}
                    {(activeSection === 'directory' || activeSection === 'finance') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                            {kpiCards.map((card, i) => <KpiCard key={i} {...card} />)}
                        </div>
                    )}

                    {/* Section content */}
                    <AnimatePresence mode="wait">
                        {activeSection === 'directory' ? (
                            <motion.div key="directory"
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white border border-black/10 shadow-xl overflow-hidden">

                                {/* User Growth Trend */}
                                <div className="bg-white border-b border-black/5 p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#111111]" />
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-[#111111] font-black tracking-tighter flex items-center gap-3 text-lg">
                                                <Users className="w-5 h-5 text-[#111111]" />
                                                INFRASTRUCTURE_GROWTH_MATRIX

                                            </h3>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">
                                                30-Day Platform Node Registration Delta
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-48 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={timeSeries.userGrowth}>
                                                <XAxis dataKey="date" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                                <RechartsTooltip 
                                                    cursor={{fill: '#ffffff0a'}}
                                                    contentStyle={{ backgroundColor: '#0c0c0e', border: '1px solid #1e293b', borderRadius: '12px' }}
                                                    itemStyle={{ color: '#10b981', fontWeight: 900 }}
                                                    labelStyle={{ color: '#64748b', fontSize: '12px', fontWeight: 900, mb: 4 }}
                                                />
                                                <Bar dataKey="nodes" fill="#10b981" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Table toolbar */}
                                <div className="px-8 py-8 border-b border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 bg-white">

                                    <div>
                                        <h2 className="text-xl font-black text-[#111111] tracking-tighter uppercase">Node Directory</h2>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">
                                            <span className="text-emerald-500 font-mono">{totalNodes.toLocaleString()}</span> TOTAL_AUTHORIZED_NODES
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                                        {/* Search */}
                                        <div className="relative w-full sm:flex-1 sm:w-80 group">
                                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                                            <input type="text" placeholder="QUERY_UID_ALIAS_OR_EMAIL..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                className="w-full pl-14 pr-6 py-4 text-[11px] font-black bg-black/5 border border-black/10 rounded-none text-[#111111] placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/30 focus:bg-white transition-all uppercase tracking-widest" />
                                        </div>
                                        {/* Role filter pills */}
                                        <div className="flex bg-black/5 rounded-none p-1 w-full sm:w-auto border border-black/10">
                                            {[['all', 'ALL_NODES'], ['admin', 'MASTER'], ['user', 'STANDARD']].map(([val, lbl]) => (
                                                <button key={val}
                                                    onClick={() => { setRoleFilter(val); setPage(1); }}
                                                    className={`flex-1 sm:flex-none px-6 py-3 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap
                                                    ${roleFilter === val ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'text-slate-500 hover:text-slate-800'}`}>
                                                    {lbl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                <div className="border border-black/10 min-w-[1000px] bg-white shadow-xl">
                                        {/* Header */}
                                        <div className="grid grid-cols-[22%_22%_18%_14%_12%_12%] text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 bg-white/40 px-8 py-6 border-b border-black/5 items-center">
                                            <div>User Profile</div>
                                            <div>Contact Info</div>
                                            <div>Account Standing</div>
                                            <div>Aggregated TPV</div>
                                            <div>Tier Override</div>
                                            <div className="text-right">Access Role</div>
                                        </div>

                                        {/* Body */}
                                        {loading ? (
                                            <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
                                                <PremiumSmallLoader text="SCANNING_ACTIVE_NODES" />

                                            </div>
                                        ) : nodes.length === 0 ? (
                                            <div className="py-24 text-center">
                                                <ShieldOff className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                                <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">No Accounts Found</p>
                                            </div>
                                        ) : (
                                            <List
                                                height={Math.min(500, nodes.length * 80)}
                                                rowCount={nodes.length}
                                                rowHeight={80}
                                                rowProps={{ nodes, setSelectedUserId, setDrawerContext, Avatar, StatusDot }}
                                                rowComponent={({ index, style, nodes, setSelectedUserId, setDrawerContext, Avatar, StatusDot }) => {
                                                    const node = nodes[index];
                                                    if (!node) return null;
                                                    const isBanned = node.security?.accountStatus?.isBanned;

                                                    return (
                                                        <div
                                                            style={{ ...style, display: 'grid' }}
                                                            onClick={() => {
                                                                setSelectedUserId(node._id);
                                                                setDrawerContext('directory');
                                                            }}
                                                            className={`grid grid-cols-[22%_22%_18%_14%_12%_12%] px-8 items-center border-b border-black/5 hover:bg-black/5 transition-all cursor-pointer group text-sm ${isBanned ? 'bg-rose-500/10' : ''}`}
                                                        >
                                                            {/* User Profile */}
                                                            <div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="relative">
                                                                        <Avatar name={node.username} isBanned={isBanned} />
                                                                        <div className="absolute -bottom-1 -right-1">
                                                                            <StatusDot active={!isBanned} />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="font-black text-[#111111] text-[13px] tracking-tight group-hover:text-emerald-600 transition-colors">{node.username}</span>
                                                                            {node.role === 'admin' && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                                                                        </div>
                                                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">ID: {node.streamerId}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Contact Info */}
                                                            <div>
                                                                <span className="text-slate-400 font-black text-[11px] tracking-wider truncate block max-w-[170px]">{node.email}</span>
                                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block">Referred {node.referralCount || 0} Users</span>
                                                            </div>

                                                            {/* Account Standing */}
                                                            <div>
                                                                <div className="flex flex-col gap-1.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-16 h-1 bg-black/10 rounded-none overflow-hidden border border-black/5">
                                                                            <motion.div
                                                                                initial={{ width: 0 }}
                                                                                animate={{ width: `${node.trustScore || 100}%` }}
                                                                                className={`h-full ${node.trustScore < 40 ? 'bg-rose-500' : node.trustScore < 75 ? 'bg-amber-500' : 'bg-emerald-500'} shadow-[0_0_8px_rgba(16,185,129,0.2)]`}
                                                                            />
                                                                        </div>
                                                                        <span className="text-[10px] font-black text-slate-500 font-mono tracking-tighter">{node.trustScore || 100}%</span>
                                                                    </div>
                                                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${node.nodeStatus === 'flagged' ? 'text-rose-500' : node.nodeStatus === 'under_review' ? 'text-amber-500' : node.nodeStatus === 'verified' ? 'text-emerald-500' : 'text-slate-600'}`}>
                                                                        {node.nodeStatus || 'STANDARD_OPS'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Aggregated TPV */}
                                                            <div>
                                                                <span className="font-black font-mono text-emerald-400 text-[13px] drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                                                                    ₹{(node.financialMetrics?.totalLifetimeEarnings || 0).toLocaleString()}
                                                                </span>
                                                            </div>

                                                            {/* Tier Override */}
                                                            <div onClick={e => e.stopPropagation()}>
                                                                <div className="relative inline-flex items-center">
                                                                    <select
                                                                        value={node.tier || 'none'}
                                                                        onChange={e => overrideTier(node._id, e.target.value)}
                                                                        className={`appearance-none pl-3 pr-8 py-2 rounded-none text-[10px] font-black uppercase tracking-widest border cursor-pointer outline-none transition-all ${node.tier === 'legend' ? 'bg-amber-500 text-black border-amber-500' : node.tier === 'pro' ? 'bg-indigo-500 text-black border-indigo-500' : node.tier === 'starter' ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-transparent text-slate-500 border-black/10 hover:border-black/20'}`}

                                                                    >
                                                                        <option value="none">UNASSIGNED</option>
                                                                        <option value="starter">STARTER</option>
                                                                        <option value="pro">PRO</option>
                                                                        <option value="legend">LEGEND</option>
                                                                    </select>
                                                                    <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${node.tier && node.tier !== 'none' ? 'text-black' : 'text-slate-600'}`} />
                                                                </div>
                                                            </div>

                                                            {/* Access Role / Status */}
                                                            <div className="text-right flex items-center justify-end gap-3" onClick={e => e.stopPropagation()}>
                                                                <div className="relative inline-flex items-center">
                                                                    <select
                                                                        value={node.role || 'user'}
                                                                        onChange={e => overrideRole(node._id, e.target.value)}
                                                                        className={`appearance-none pl-3 pr-8 py-2 rounded-none text-[10px] font-black uppercase tracking-widest border cursor-pointer outline-none transition-all ${node.role === 'admin' ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-transparent text-slate-500 border-black/10 hover:border-black/20'}`}

                                                                    >
                                                                        <option value="user">USER_ACCESS</option>
                                                                        <option value="admin">ADMIN_CLEARANCE</option>
                                                                    </select>
                                                                    <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${node.role === 'admin' ? 'text-black' : 'text-slate-600'}`} />
                                                                </div>
                                                                <button
                                                                    onClick={() => toggleBan(node._id, isBanned)}
                                                                    className={`p-2 rounded-xl transition-all border ${isBanned ? 'bg-black/5 text-slate-500 border-black/10 hover:border-emerald-500/50 hover:text-emerald-400' : 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-black'}`}
                                                                >
                                                                    {isBanned ? <ShieldOff className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                                className="custom-scrollbar"
                                            />
                                        )}
                                    </div>

                                </div>

                                {/* Pagination */}
                                <div className="px-6 py-6 border-t border-black/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                        User Directory Page <span className="text-slate-400">{page}</span> of <span className="text-slate-400">{totalPages}</span>
                                    </span>
                                    <div className="flex items-center gap-6">
                                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                            className="p-3 border border-black/10 text-slate-600 hover:bg-black/5 hover:text-white disabled:opacity-20 transition-all">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                                if (p < 1 || p > totalPages) return null;
                                                return (
                                                    <button key={p} onClick={() => setPage(p)}
                                                        className={`w-10 h-10 text-[10px] font-black transition-all border
                                                        ${p === page ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-slate-600 border-black/10 hover:border-black/20 hover:text-slate-300'}`}>
                                                        {String(p).padStart(2, '0')}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={totalPages === 0 || page === totalPages}
                                            className="p-3 border border-black/10 text-slate-600 hover:bg-black/5 hover:text-white disabled:opacity-20 transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeSection === 'finance' ? (
                            /* ── FINANCIAL DASHBOARD ── */
                            <motion.div key="finance"
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.3 }}>

                                {/* Summary bar */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                                    <div className="bg-white border border-rose-500/20 p-8 shadow-[0_0_30px_rgba(244,63,94,0.05)]">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 border-l-2 border-rose-500 pl-4">TOTAL_UNSETTLED_LIABILITIES</p>
                                        <p className="text-5xl font-black text-rose-500 font-mono tracking-tighter drop-shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                                            ₹{(metrics.totalUnsettledDebt || 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-emerald-500/20 p-8 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 border-l-2 border-emerald-500 pl-4">AGGREGATE_LIFETIME_SETTLEMENTS</p>
                                        <p className="text-5xl font-black text-emerald-500 font-mono tracking-tighter drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">₹{(metrics.platformPayouts || 0).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Revenue Trend Graph */}
                                <div className="bg-white border border-black/10 p-10 mb-10 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-[#111111] font-black tracking-tight flex items-center gap-2">
                                                <LineChart className="w-4 h-4 text-emerald-400" />
                                                30-Day Gross Volume Trend
                                            </h3>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">
                                                Total Daily Platform Deposits
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={timeSeries.revenueTrends}>
                                                <defs>
                                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="date" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                                <RechartsTooltip 
                                                    contentStyle={{ backgroundColor: '#0c0c0e', border: '1px solid #1e293b', borderRadius: '12px' }}
                                                    itemStyle={{ color: '#10b981', fontWeight: 900 }}
                                                    labelStyle={{ color: '#64748b', fontSize: '12px', fontWeight: 900, mb: 4 }}
                                                />
                                                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-white border border-black/10 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                        <div className="text-[8px] font-black text-slate-700 uppercase tracking-widest">MODULE_ID: FIN_SETTLE_01</div>
                                    </div>
                                    <div className="px-8 py-10 border-b border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                        <div>
                                            <h2 className="text-2xl font-black text-[#111111] tracking-tighter uppercase">SETTLEMENT_QUEUE</h2>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                                <span className="text-rose-500">{payoutQueue.length}</span> NODES_AWAITING_LIQUIDITY_PROTOCOL
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 px-6 py-3 bg-rose-500/5 border border-rose-500/20">
                                            <div className="w-2 h-2 bg-rose-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">MAX_PRIORITY_QUEUE</span>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm min-w-[700px]">
                                            <thead className="bg-black/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-black/10">
                                                <tr>
                                                    <th className="px-8 py-5">User Account</th>
                                                    <th className="px-8 py-5">Tier Override</th>
                                                    <th className="px-8 py-5 text-emerald-400">Total Settled</th>
                                                    <th className="px-8 py-5 text-rose-400">Pending Settlement</th>
                                                    <th className="px-8 py-5 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payoutQueue.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="py-32 text-center relative overflow-hidden">
                                                            <div className="absolute inset-0 bg-emerald-500/[0.02] -skew-y-12 translate-y-20" />
                                                            <div className="w-16 h-16 bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                                                                <CheckCircle2 className="w-8 h-8 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
                                                            </div>
                                                            <h3 className="text-[#111111] font-black text-xl uppercase tracking-tighter">LIABILITIES_CLEARED</h3>
                                                            <p className="text-slate-600 text-[10px] uppercase font-black tracking-[0.3em] mt-3">ZERO_PENDING_SETTLEMENTS_DETECTED</p>
                                                        </td>
                                                    </tr>
                                                ) : payoutQueue.slice(0, 20).map(node => (
                                                    <tr key={node._id}
                                                        onClick={() => {
                                                            setSelectedUserId(node._id);
                                                            setDrawerContext('finance');
                                                        }}
                                                        className="border-b border-black/10 hover:bg-black/5 transition-all cursor-pointer group">
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <Avatar name={node.username} isBanned={false} />
                                                                <div>
                                                                    <span className="font-black text-white text-[13px] tracking-tight group-hover:text-emerald-400 transition-colors">{node.username}</span>
                                                                    <br />
                                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">ID: {node.streamerId}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <span className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] border ${node.tier === 'legend' ? 'bg-amber-500 text-black border-amber-500' : node.tier === 'pro' ? 'bg-indigo-500 text-black border-indigo-500' : node.tier === 'starter' ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-transparent text-slate-700 border-black/10'}`}>
                                                                {node.tier || 'NO_TIER'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-5 font-black font-mono text-emerald-500/60 text-[13px]">
                                                            ₹{(node.financialMetrics?.totalSettled || 0).toLocaleString()}
                                                        </td>
                                                        <td className="px-8 py-5 font-black font-mono text-rose-500 text-[16px] drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                                                            ₹{(node.financialMetrics?.pendingPayouts || 0).toLocaleString()}
                                                        </td>
                                                        <td className="px-8 py-5 text-right flex gap-3 justify-end items-center">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    rejectSettlement(node._id, node.financialMetrics?.pendingPayouts || 0);
                                                                }}
                                                                className="px-6 py-3 bg-black/5 hover:bg-rose-500/20 text-slate-600 hover:text-rose-500 text-[9px] font-black uppercase tracking-[0.3em] border border-black/5 hover:border-rose-500/30 transition-all">
                                                                REJECT
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    executeSettlement(node._id, node.financialMetrics?.pendingPayouts || 0);
                                                                }}
                                                                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                                                                AUTHORIZE
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeSection === 'ledger' ? (
                            /* ── GLOBAL LEDGER ── */
                            <motion.div key="ledger"
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white border border-black/10 shadow-2xl relative overflow-hidden">
                                
                                <div className="px-8 py-10 border-b border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-[#111111] tracking-tighter uppercase">TRANSACTION_LEDGER</h2>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">
                                            <span className="text-emerald-500 font-mono tracking-normal">{txTotalDocs.toLocaleString()}</span> HISTORICAL_RECORD_ENTRIES
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                                        {/* Filters */}
                                        <div className="relative">
                                            <select value={txFilters.type} onChange={e => { setTxFilters(f => ({...f, type: e.target.value})); setTxPage(1); }} 
                                                className="appearance-none pl-4 pr-10 py-3 bg-black/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 border border-black/10 outline-none hover:border-black/20 transition-all focus:border-emerald-500/50">
                                                <option value="all">ALL_TYPES</option>
                                                <option value="deposit">DEPOSITS</option>
                                                <option value="withdrawal">WITHDRAWALS</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-700 pointer-events-none" />
                                        </div>
                                        
                                        <div className="relative">
                                            <select value={txFilters.status} onChange={e => { setTxFilters(f => ({...f, status: e.target.value})); setTxPage(1); }} 
                                                className="appearance-none pl-4 pr-10 py-3 bg-black/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 border border-black/10 outline-none hover:border-black/20 transition-all focus:border-emerald-500/50">
                                                <option value="all">ALL_STATES</option>
                                                <option value="success">SUCCESS</option>
                                                <option value="pending">PENDING</option>
                                                <option value="failed">FAILED</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-700 pointer-events-none" />
                                        </div>
                                        
                                        <div className="relative w-full sm:flex-1 sm:w-72 group">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                                            <input type="text" placeholder="QUERY_ENTITY_OR_UID..."
                                                value={txFilters.search}
                                                onChange={e => { setTxFilters(f => ({...f, search: e.target.value})); setTxPage(1); }}
                                                className="w-full pl-12 pr-6 py-3 bg-black/5 border border-black/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#111111] placeholder:text-slate-400 outline-none focus:border-emerald-500/50 transition-all" />
                                        </div>
                                        
                                        <button onClick={downloadCSV}
                                            className="px-6 py-3 bg-black/5 hover:bg-emerald-500 hover:text-black text-emerald-500 text-[9px] font-black uppercase tracking-[0.3em] border border-black/5 hover:border-emerald-500/30 transition-all flex items-center gap-3">
                                            <Download className="w-3.5 h-3.5" /> EXPORT_CSV
                                        </button>
                                    </div>
                                </div>
 Riverside, CA                                
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm min-w-[900px]">
                                        <thead className="bg-black/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-black/10">
                                            <tr>
                                                <th className="px-8 py-5">Tx Signature</th>
                                                <th className="px-8 py-5">Origin/Destination</th>
                                                <th className="px-8 py-5">Transfer Type</th>
                                                <th className="px-8 py-5 text-right">Gross Value</th>
                                                <th className="px-8 py-5 text-center">Final State</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black/5">
                                            {loading ? (
                                                <tr><td colSpan="5" className="py-24 text-center"><PremiumSmallLoader className="justify-center" text="FETCHING_ACTIVE_DISPUTES" /></td></tr>

                                            ) : transactions.length === 0 ? (
                                                <tr><td colSpan="5" className="py-24 text-center text-slate-500 font-black uppercase text-[10px] tracking-widest">No matching logs found on ledger</td></tr>
                                            ) : transactions.map(tx => (
                                                <tr key={tx._id} className="hover:bg-black/5 transition-all group border-b border-black/10">
                                                    <td className="px-8 py-6">
                                                        <span className="font-mono text-[10px] text-[#111111] group-hover:text-emerald-600 block truncate max-w-[150px] transition-colors uppercase">TX_{tx._id.slice(-8)}</span>
                                                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1 block font-mono">{new Date(tx.createdAt).toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="font-black text-[12px] text-slate-300 block uppercase tracking-tight">{tx.donorName || 'SYSTEM_NODE'}</span>
                                                        {tx.message && <span className="text-[10px] text-slate-600 truncate max-w-[200px] block font-black uppercase tracking-tighter mt-1">"{tx.message}"</span>}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] border ${tx.type === 'deposit' ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-indigo-500 text-black border-indigo-500'}`}>
                                                            {tx.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className={`font-black text-sm tracking-tighter ${tx.type === 'deposit' ? 'text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'text-slate-400'}`}>
                                                            {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className={`w-1.5 h-1.5 ${tx.status === 'success' ? 'bg-emerald-500' : tx.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${tx.status === 'success' ? 'text-emerald-500' : tx.status === 'pending' ? 'text-amber-500' : 'text-rose-500'}`}>
                                                                {tx.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-8 py-8 border-t border-black/5 flex items-center justify-between bg-black/5">
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                                        LEDGER_SYMMETRY <span className="text-slate-400">{txPage} / {txTotalPages}</span>
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => setTxPage(p => Math.max(1, p - 1))} disabled={txPage === 1}
                                            className="px-4 py-2 bg-black/5 border border-black/10 text-slate-600 hover:bg-black/10 hover:text-[#111111] disabled:opacity-10 transition-all font-black uppercase text-[10px] tracking-widest">PREV_BLOCK</button>
                                        <button onClick={() => setTxPage(p => Math.min(txTotalPages, p + 1))} disabled={txPage === txTotalPages}
                                            className="px-4 py-2 bg-black/5 border border-black/10 text-slate-600 hover:bg-black/10 hover:text-[#111111] disabled:opacity-10 transition-all font-black uppercase text-[10px] tracking-widest">NEXT_BLOCK</button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeSection === 'disputes' ? (
                            /* ── RESOLUTION CENTER ── */
                            <motion.div key="disputes"
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white border border-black/10 shadow-2xl relative overflow-hidden group">
                                <div className="px-8 py-10 border-b border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-[#111111] tracking-tighter uppercase">RESOLUTION_CENTER</h2>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">
                                            <span className="text-rose-500 font-mono tracking-normal">{disputes.length}</span> ACTIVE_MEDIATION_PROTOCOLS
                                        </p>
                                    </div>
                                    <button onClick={fetchDisputes} className="px-6 py-3 bg-black/5 hover:bg-black/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] border border-black/5 transition-all flex items-center gap-3">
                                        {refreshing ? <PremiumSmallLoader /> : <RefreshCw className="w-3.5 h-3.5" />} SYNC_CASES

                                    </button>
                                </div>
 Riverside, CA                                
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm min-w-[900px]">
                                        <thead className="bg-black/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-black/10">
                                            <tr>
                                                <th className="px-8 py-5">Tx Signature</th>
                                                <th className="px-8 py-5">Creator Node</th>
                                                <th className="px-8 py-5">Dispute Reason</th>
                                                <th className="px-8 py-5 text-right">Value At Risk</th>
                                                <th className="px-8 py-5 text-center">Mediation Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black/5">
                                            {loading || refreshing ? (
                                                <tr><td colSpan="5" className="py-24 text-center"><PremiumSmallLoader className="justify-center" text="RETRIEVING_TRANSMISSION_HISTORY" /></td></tr>

                                            ) : disputes.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="py-32 text-center relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-emerald-500/[0.02] -skew-y-12 translate-y-20" />
                                                        <div className="w-16 h-16 bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                                                            <CheckCircle2 className="w-8 h-8 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
                                                        </div>
                                                        <h3 className="text-[#111111] font-black text-xl uppercase tracking-tighter">ZERO_DISPUTES_DETECTED</h3>
                                                        <p className="text-slate-600 text-[10px] uppercase font-black tracking-[0.3em] mt-3">SYSTEM_OPERATING_AT_NOMINAL_CAPACITY</p>
                                                    </td>
                                                </tr>
                                            ) : disputes.map(tx => (
                                                <tr key={tx._id} className="hover:bg-black/5 transition-all group border-b border-black/5">
                                                    <td className="px-8 py-6">
                                                        <span className="font-mono text-[10px] text-[#111111] group-hover:text-amber-600 block truncate max-w-[150px] transition-colors uppercase">TX_{tx._id.slice(-8)}</span>
                                                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1 block font-mono">{new Date(tx.createdAt).toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar name={tx.userId?.username} isBanned={false} />
                                                            <div>
                                                                <span className="font-black text-[12px] text-slate-300 block uppercase tracking-tight">{tx.userId?.username || 'Unknown'}</span>
                                                                <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest block mt-0.5">{tx.userId?.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="px-3 py-1 bg-rose-500 text-black text-[8px] font-black uppercase tracking-[0.2em] border border-rose-500 block w-max mb-2">
                                                            FLAGGED_ENTRY
                                                        </span>
                                                        <span className="text-[10px] text-slate-600 block max-w-[200px] truncate font-black uppercase tracking-tighter">"{tx.dispute?.reason || 'NO_REASON_STATED'}"</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className="font-black text-sm text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                                                            ₹{tx.amount?.toLocaleString()}
                                                        </span>
                                                        <span className="text-[9px] text-slate-600 block font-mono font-black mt-1">NET: ₹{tx.netAmount?.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex gap-2 justify-center items-center">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); authorizeRefund(tx._id); }}
                                                                className="px-4 py-2.5 bg-rose-500 text-black border border-rose-500 text-[9px] font-black uppercase tracking-[0.3em] transition-all hover:bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                                                                REFUND
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); dismissDispute(tx._id); }}
                                                                className="px-4 py-2.5 bg-black/5 hover:bg-emerald-500 hover:text-black text-emerald-500 border border-black/5 hover:border-emerald-500 text-[9px] font-black uppercase tracking-[0.3em] transition-all">
                                                                DISMISS
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        ) : activeSection === 'broadcast' ? (
                            /* ── BROADCAST CENTER ── */
                            <motion.div key="broadcast"
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                                className="max-w-4xl mx-auto space-y-8">
                                <div className="bg-white border border-black/10 p-10 relative overflow-hidden group shadow-2xl">
                                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Zap className="w-40 h-40 text-emerald-500" />
                                    </div>
                                    <h2 className="text-3xl font-black text-[#111111] tracking-tighter uppercase mb-2">SYSTEM_BROADCAST_CENTER</h2>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-12">DISPATCH_MAX_PRIORITY_ALERTS_TO_RECURSIVE_NODES</p>

                                    <div className="space-y-10 relative">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-4">TRANSMISSION_PAYLOAD</label>
                                            <textarea
                                                value={broadcastMsg}
                                                onChange={e => setBroadcastMsg(e.target.value)}
                                                className="w-full bg-white border border-black/10 rounded-none p-8 text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 transition-all min-h-[200px] resize-none text-[13px] font-black uppercase tracking-widest leading-relaxed"
                                                placeholder="ENTER_PAYLOAD_CONTENT_FOR_RECURSIVE_DISPATCH..."
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-8">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-4">PRIORITY_CLEARANCE_LEVEL</label>
                                                <div className="flex bg-white border border-black/10">
                                                    {['Standard', 'Advisory', 'Critical'].map(lvl => (
                                                        <button
                                                            key={lvl}
                                                            onClick={() => setBroadcastLevel(lvl)}
                                                            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${broadcastLevel === lvl ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-slate-600 hover:text-slate-400'}`}>
                                                            {lvl}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={dispatchBroadcast}
                                            disabled={!broadcastMsg}
                                            className={`w-full py-6 font-black uppercase tracking-[0.4em] text-[11px] transition-all flex items-center justify-center gap-4 border
                                            ${broadcastMsg ? 'bg-emerald-500 hover:bg-emerald-400 text-black border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'bg-transparent text-slate-800 border-black/5 cursor-not-allowed'}`}>
                                            <Zap className={`w-4 h-4 ${broadcastMsg ? 'fill-black' : 'fill-slate-900'}`} /> EXECUTE_TRANSMISSION
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeSection === 'security' ? (
                            /* ── SECURITY NEXUS (Audit Logs) ── */
                            <motion.div key="security"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                                className="space-y-6">
                                <div className="bg-white border border-black/10 p-10 relative overflow-hidden shadow-2xl">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10 mb-12">
                                        <div>
                                            <h2 className="text-3xl font-black text-[#111111] tracking-tighter uppercase flex items-center gap-5">
                                                <div className="w-12 h-12 bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                    <Shield className="w-6 h-6 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                                </div>
                                                SECURITY_NEXUS
                                            </h2>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-3 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-emerald-500" />
                                                IMMUTABLE_ADMINISTRATIVE_ACTION_LOGS
                                            </p>
                                        </div>
                                        <button onClick={() => fetchAuditLogs(logsPage)} className="p-4 bg-black/5 hover:bg-black/10 transition-all border border-black/5 hover:border-black/20">
                                            {refreshing ? <PremiumSmallLoader /> : <RefreshCw className="w-4 h-4 text-emerald-500" />}

                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-black/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-black/10">
                                                <tr>
                                                    <th className="px-6 py-4">Timestamp</th>
                                                    <th className="px-6 py-4">Administrator</th>
                                                    <th className="px-6 py-4">Activity</th>
                                                    <th className="px-6 py-4">Target User</th>
                                                    <th className="px-6 py-4">Event Details</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-black/10">
                                                {auditLogs.slice(0, 20).map(log => (
                                                    <tr key={log._id} className="hover:bg-black/5 transition-all group border-b border-black/10">
                                                        <td className="px-6 py-6 text-[10px] font-black text-slate-600 font-mono tracking-tighter">
                                                            {new Date(log.timestamp).toLocaleString('en-IN', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).toUpperCase()}
                                                        </td>
                                                        <td className="px-6 py-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-emerald-500 text-black flex items-center justify-center text-[11px] font-black border border-emerald-500">
                                                                    {log.adminUsername?.slice(0, 1).toUpperCase()}
                                                                </div>
                                                                <span className="text-[12px] font-black text-[#111111] uppercase tracking-tight">{log.adminUsername}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-6">
                                                            <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border ${log.level === 'critical' ? 'bg-rose-500 text-black border-rose-500' :
                                                                log.level === 'warning' ? 'bg-amber-500 text-black border-amber-500' :
                                                                    'bg-emerald-500 text-black border-emerald-500'
                                                                }`}>
                                                                {log.action}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-6 font-mono">
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter shadow-[0_0_10px_rgba(255,255,255,0.05)]">{log.targetName || 'SYSTEM_NODE'}</span>
                                                        </td>
                                                        <td className="px-6 py-6 text-[10px] text-slate-600 font-bold uppercase tracking-tight">
                                                            {log.details || '—'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="mt-12 flex items-center justify-center gap-6">
                                        <button 
                                            disabled={logsPage <= 1}
                                            onClick={() => fetchAuditLogs(logsPage - 1)}
                                            className="p-4 bg-white border border-black/10 disabled:opacity-20 hover:bg-black/5 transition-all text-slate-600">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] px-8 py-3 bg-black/5 border border-black/10">
                                            ID_PAGE_{String(logsPage).padStart(3, '0')} / {String(totalLogsPages).padStart(3, '0')}
                                        </span>
                                        <button 
                                            disabled={logsPage >= totalLogsPages}
                                            onClick={() => fetchAuditLogs(logsPage + 1)}
                                            className="p-4 bg-black/5 border border-black/10 disabled:opacity-20 hover:bg-black/10 transition-all text-slate-600">

                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeSection === 'health' ? (
                            /* ── SYSTEM HEALTH (Infrastructure Vitals) ── */
                            <motion.div key="health"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                                className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Uptime and Node Info */}
                                    <div className="col-span-1 md:col-span-2 bg-white border border-black/10 p-10 relative overflow-hidden group shadow-2xl">
                                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Activity className="w-40 h-40 text-indigo-500" />
                                        </div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-8 flex items-center gap-3">
                                            <Cpu className="w-4 h-4" /> CORE_INFRASTRUCTURE_METRICS
                                        </h3>
                                        <div className="grid grid-cols-2 gap-10 relative">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">SYSTEM_UPTIME</p>
                                                <p className="text-4xl font-black text-[#111111] font-mono tracking-tighter">{Math.floor((systemHealth?.uptime || 0) / 3600)}H {Math.floor(((systemHealth?.uptime || 0) % 3600) / 60)}M</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">CPU_COMPUTE_LOAD</p>
                                                <p className="text-4xl font-black text-emerald-500 font-mono tracking-tighter shadow-glow-sm">{systemHealth?.cpuLoad || 0}%</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">MEMORY_PIPELINE_RSS</p>
                                                <p className="text-[14px] font-black text-slate-400 font-mono uppercase tracking-tighter">{Math.floor((systemHealth?.memoryUsage?.rss || 0) / 1024 / 1024)}MB / 2048MB</p>
                                                <div className="w-full h-1 bg-black/5 mt-4 overflow-hidden border border-black/5">
                                                    <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]" style={{ width: `${Math.min(100, (systemHealth?.memoryUsage?.rss || 0) / 1024 / 1024 / 20.48)}%` }} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">NODE_ENV_DESCRIPTOR</p>
                                                <p className="text-[14px] font-black text-indigo-400 font-mono uppercase tracking-tighter">{systemHealth?.nodeVersion} | {systemHealth?.platform?.toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DB & Relay Connections */}
                                    <div className="bg-white border border-black/10 p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-10 flex items-center gap-3">
                                            <RefreshCw className="w-4 h-4" /> SYNCHRONOUS_RELAYS
                                        </h3>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'DATABASE_CONN', val: systemHealth?.dbConnection },
                                                { label: 'PAYOUT_ENGINE', val: systemHealth?.payoutEngine },
                                                { label: 'BROADCAST_HUB', val: systemHealth?.broadcastRelay }
                                            ].map((relay, i) => (
                                                <div key={i} className="flex items-center justify-between p-5 bg-black/5 border border-black/10 group hover:border-emerald-500/30 transition-all">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">{relay.label}</span>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{relay.val || 'ONLINE'}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ── FINANCIAL ENGINE STATUS (Replicated high-tech grid) ── */}
                                <div className="bg-white border border-black/10 p-10 relative overflow-hidden group shadow-2xl">
                                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Wallet className="w-40 h-40 text-emerald-500" />
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-10 flex items-center gap-3">
                                        <Landmark className="w-4 h-4" /> FINANCIAL_ENGINE_MATRIX
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative border-b border-black/5 pb-10">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">PLATFORM_GROSS_REVENUE</p>
                                            <p className="text-4xl font-black text-[#111111] font-mono tracking-tighter">₹{((systemHealth?.financialMatrix?.totalRevenue || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 1 })}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">PENDING_SETTLEMENT_DEBT</p>
                                            <p className="text-4xl font-black text-rose-500 font-mono tracking-tighter">₹{((systemHealth?.financialMatrix?.pendingLiability || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 1 })}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-2">SYSTEM_SESSION_LOAD</p>
                                            <p className="text-4xl font-black text-cyan-400 font-mono tracking-tighter">{systemHealth?.financialMatrix?.activeDrops || 0}</p>
                                        </div>
                                    </div>

                                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 ${systemHealth?.isPaused ? 'bg-rose-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'}`} />
                                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">
                                                SYSTEM_FLOW: {systemHealth?.isPaused ? <span className="text-rose-500">HALTED_LOCKED</span> : <span className="text-emerald-500">OPERATIONAL_NOMINAL</span>}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={handleTogglePause}
                                            className={`px-10 py-5 font-black uppercase tracking-[0.4em] text-[10px] transition-all border
                                            ${systemHealth?.isPaused 
                                                ? 'bg-emerald-500 text-black border-emerald-500 hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                                                : 'bg-rose-500 text-black border-rose-500 hover:bg-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]'}`}>
                                            {systemHealth?.isPaused ? 'RESUME_SYSTEM_FLOW' : 'EXECUTE_PAUSE_COMMAND'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeSection === 'admin_profile' ? (
                            /* ── ADMIN PROFILE SECTION ── */
                            <motion.div key="admin_profile"
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                                className="max-w-4xl mx-auto">
                                {!adminProfile ? (
                                    <div className="py-24 text-center">
                                        <PremiumSmallLoader text="LOADING_SYSTEM_CONFIG" className="justify-center py-12" />

                                        <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Synchronizing Identity Matrix...</p>
                                    </div>
                                ) : (
                                    <form onSubmit={updateAdminProfileData} className="space-y-8">
                                        <div className="bg-white border border-black/10 p-8 md:p-12 relative overflow-hidden group shadow-2xl">
                                            {/* Immersive Background Glow */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none" />
                                            
                                            {/* Profile Header */}
                                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-12 relative z-10">
                                                <div className="relative group/avatar">
                                                    <motion.div
                                                        whileHover={{ scale: 1.02 }}
                                                        onClick={() => fileInputRef.current.click()}
                                                        className="w-32 h-32 md:w-40 md:h-40 bg-black/5 border border-black/10 flex items-center justify-center text-4xl md:text-5xl font-black text-emerald-600 overflow-hidden relative cursor-pointer shadow-2xl group transition-all">
                                                        {adminProfile.adminProfile?.avatar ? (
                                                            <img src={adminProfile.adminProfile.avatar} alt="Admin" className="w-full h-full object-cover" />
                                                        ) : (
                                                            (adminProfile.fullName || adminProfile.username || '?').slice(0, 1).toUpperCase()
                                                        )}
                                                        <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Paintbrush className="w-8 h-8 text-emerald-400" />
                                                        </div>
                                                        {/* Static Border Accent */}
                                                        <div className="absolute inset-0 border border-emerald-500/20 pointer-events-none" />
                                                    </motion.div>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleAvatarUpload}
                                                        className="hidden"
                                                        accept="image/*"
                                                    />
                                                    <div className="absolute -bottom-2 -right-2 md:bottom-2 md:right-2 w-10 h-10 bg-emerald-500 border-2 border-black flex items-center justify-center shadow-2xl">
                                                        <Shield className="w-5 h-5 text-black" />
                                                    </div>
                                                </div>
                                                <div className="text-center md:text-left flex-1 space-y-4">
                                                    <div>
                                                        <h2 className="text-3xl md:text-4xl font-black text-[#111111] tracking-tighter flex flex-col md:flex-row items-center gap-4 mb-2">
                                                            {adminProfile.fullName || adminProfile.username}
                                                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] bg-emerald-500/20 text-emerald-400 px-4 py-1 border border-emerald-500/30">PRIMARY_OPERATOR</span>
                                                        </h2>
                                                        <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                                                            <div className="flex items-center gap-1.5">
                                                                <Monitor className="w-3.5 h-3.5 text-emerald-500/50" />
                                                                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">ACCESS_LVL_{adminProfile.adminProfile?.accessLevel || 1}</span>
                                                            </div>
                                                            <div className="w-1.5 h-1.5 bg-black/10" />
                                                            <div className="flex items-center gap-1.5">
                                                                <Activity className="w-3 h-3 text-blue-500/50" />
                                                                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Status: Active</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
                                                        <div className="group/badge relative">
                                                            <div className="px-4 py-2 bg-black/5 border border-black/10 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover/badge:border-emerald-500/30 group-hover/badge:text-white transition-all">
                                                                {adminProfile.email}
                                                            </div>
                                                        </div>
                                                        <div className="px-4 py-2 bg-black/5 border border-black/10 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                                                            NODE_ID: {adminProfile.streamerId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                                                {/* Identity Fields */}
                                                <div className="space-y-10 bg-white border border-black/10 p-8 md:p-10 shadow-2xl relative overflow-hidden">
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-10 flex items-center justify-between">
                                                        <span className="flex items-center gap-3">
                                                            <UserIcon className="w-4 h-4" /> IDENTITY_MATRIX
                                                        </span>
                                                        <span className="text-[9px] bg-emerald-500/20 px-3 py-1 border border-emerald-500/30">VERIFIED</span>
                                                    </h3>
                                                    <div className="space-y-6">
                                                        <div className="relative group/input">
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2 px-1 group-focus-within/input:text-emerald-500 transition-colors">Legal Operational Name</label>
                                                            <input type="text"
                                                                value={adminProfile.fullName || ''}
                                                                onChange={e => setAdminProfile({ ...adminProfile, fullName: e.target.value })}
                                                                className="w-full bg-black/5 border border-black/10 px-6 py-4 text-sm text-[#111111] focus:outline-none focus:border-emerald-500/50 transition-all font-black uppercase tracking-widest placeholder:text-slate-500 shadow-inner"
                                                                placeholder="IDENTITY_KEY_REQUIRED"
                                                            />
                                                        </div>
                                                        <div className="relative group/input">
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2 px-1 group-focus-within/input:text-emerald-500 transition-colors">Official Security Title</label>
                                                            <input type="text"
                                                                value={adminProfile.adminProfile?.title || ''}
                                                                onChange={e => setAdminProfile({
                                                                    ...adminProfile,
                                                                    adminProfile: { ...adminProfile.adminProfile, title: e.target.value }
                                                                })}
                                                                className="w-full bg-black/5 border border-black/10 px-6 py-4 text-sm text-[#111111] focus:outline-none focus:border-emerald-500/50 transition-all font-black uppercase tracking-widest placeholder:text-slate-500 shadow-inner"
                                                                placeholder="ROLE_DESCRIPTOR_REQUIRED"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Operational Fields */}
                                                <div className="space-y-10 bg-white border border-black/10 p-8 md:p-10 shadow-2xl relative overflow-hidden">
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-10 flex items-center justify-between">
                                                        <span className="flex items-center gap-3">
                                                            <Shield className="w-4 h-4" /> COMMAND_OPERATIONS
                                                        </span>
                                                        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20">
                                                            <div className="w-1.5 h-1.5 bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                                                            <span className="text-[9px] text-indigo-600 font-black uppercase tracking-widest">SYNCING</span>
                                                        </div>
                                                    </h3>
                                                    <div className="space-y-6">
                                                        <div className="relative group/input">
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2 px-1 group-focus-within/input:text-indigo-400 transition-colors">Assigned Department</label>
                                                            <input type="text"
                                                                value={adminProfile.adminProfile?.department || ''}
                                                                onChange={e => setAdminProfile({
                                                                    ...adminProfile,
                                                                    adminProfile: { ...adminProfile.adminProfile, department: e.target.value }
                                                                })}
                                                                className="w-full bg-black/5 border border-black/10 px-6 py-4 text-sm text-[#111111] focus:outline-none focus:border-indigo-500/50 transition-all font-black uppercase tracking-widest placeholder:text-slate-500 shadow-inner"
                                                                placeholder="UNIT_DESIGNATOR_REQUIRED"
                                                            />
                                                        </div>
                                                        <div className="relative group/input">
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2 px-1 group-focus-within/input:text-indigo-400 transition-colors">Operational Identity Briefing</label>
                                                            <textarea
                                                                value={adminProfile.adminProfile?.bio || ''}
                                                                onChange={e => setAdminProfile({
                                                                    ...adminProfile,
                                                                    adminProfile: { ...adminProfile.adminProfile, bio: e.target.value }
                                                                })}
                                                                className="w-full bg-black/5 border border-black/10 px-6 py-4 text-sm text-[#111111] focus:outline-none focus:border-indigo-500/50 transition-all font-black uppercase tracking-widest min-h-[140px] resize-none placeholder:text-slate-500 shadow-inner leading-relaxed"
                                                                placeholder="OPERATIONAL_IDENTITY_BRIEFING_INPUT"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-12 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
                                                <div className="flex items-center gap-6 text-slate-600 bg-black/5 p-6 border border-black/10">
                                                    <div className="w-12 h-12 bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20">
                                                        <ShieldAlert className="w-6 h-6 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]" />
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-loose">IDENTITY_KEY_IMMUTABLE_ON_COMMIT. ALL_REVISIONS_LOGGED_IN <span className="text-rose-500">SECURE_AUDIT_NEXUS</span>.</p>
                                                </div>
                                                <motion.button
                                                    type="submit"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    disabled={isSavingProfile}
                                                    className="w-full sm:w-auto px-16 py-5 bg-emerald-500 text-black disabled:opacity-50 font-black uppercase tracking-[0.4em] text-[11px] transition-all shadow-[0_0_40px_rgba(16,185,129,0.25)] hover:bg-emerald-400 flex items-center justify-center gap-4">
                                                    {isSavingProfile ? <PremiumSmallLoader /> : <CheckCircle2 className="w-5 h-5" />}

                                                    SYNCHRONIZE_IDENTITY
                                                </motion.button>
                                            </div>
                                        </div>

                                        {/* Security Logs Component */}
                                        <div className="bg-white/40 border border-black/10 p-10 relative overflow-hidden group shadow-2xl">

                                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 blur-[120px] pointer-events-none" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10 flex items-center gap-3 relative z-10">
                                                <Activity className="w-5 h-5 text-indigo-400" /> AUTHORIZED_ACTIVITY_STREAM
                                            </h3>
                                            <div className="space-y-4 relative z-10">
                                                {activityLogs.filter(ev => ev.type === 'security' || ev.type === 'broadcast').slice(0, 5).map(ev => (
                                                    <div key={ev.id} className="flex items-center justify-between py-5 border-b border-black/5 hover:bg-black/[0.02] px-6 -mx-6 transition-all group">
                                                        <div className="flex items-center gap-5">
                                                            <div className={`w-2 h-2 shadow-[0_0_10px_rgba(0,0,0,1)] ${ev.type === 'security' ? 'bg-indigo-500 shadow-indigo-500/50' : 'bg-amber-500 shadow-amber-500/50'}`} />
                                                            <span className="text-[11px] font-black text-slate-400 tracking-[0.05em] uppercase group-hover:text-black transition-colors">{ev.message}</span>

                                                        </div>
                                                        <span className="text-[9px] font-mono text-slate-700 bg-black/5 px-3 py-1 border border-black/10 tracking-tighter"> {ev.time}</span>
                                                    </div>
                                                ))}
                                                {activityLogs.length === 0 && (
                                                    <div className="text-center py-10">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 animate-pulse">Session active — monitoring system events...</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </motion.div>
                        ) : (
                            /* ── GLOBAL CONFIG ── */
                            <motion.div key="config"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-white border border-black/10 p-10 shadow-2xl">
                                        <h3 className="text-[11px] font-black text-[#111111] uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                                            <Settings className="w-5 h-5 text-emerald-500" />
                                            PLATFORM_CALIBRATION_MATRIX
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 block px-1">COMMISSION_RATE_GLOBAL_FIXED</label>
                                                <input
                                                    type="number"
                                                    value={globalConfig.defaultCommissionRate}
                                                    onChange={e => setGlobalConfig({ ...globalConfig, defaultCommissionRate: parseFloat(e.target.value) || 0 })}
                                                    className="w-full bg-[#f5f4e2] border border-black/10 px-6 py-4 text-sm text-[#111111] font-mono focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 block px-1">MIN_WITHDRAWAL_THRESHOLD_INR</label>
                                                <input
                                                    type="number"
                                                    value={globalConfig.minWithdrawalThreshold}
                                                    onChange={e => setGlobalConfig({ ...globalConfig, minWithdrawalThreshold: parseFloat(e.target.value) || 0 })}
                                                    className="w-full bg-[#f5f4e2] border border-black/10 px-6 py-4 text-sm text-[#111111] font-mono focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateGlobalConfig({ defaultCommissionRate: globalConfig.defaultCommissionRate, minWithdrawalThreshold: globalConfig.minWithdrawalThreshold })}
                                            className="mt-10 px-12 py-5 bg-emerald-500 text-black font-black uppercase tracking-[0.4em] text-[10px] transition-all hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                            SYNCHRONIZE_CALIBRATION_COMMIT
                                        </button>
                                    </div>

                                    <div className="bg-white border border-black/10 p-10 shadow-2xl">
                                        <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-rose-500" />
                                            SYSTEM_INTEGRITY_PROTOCOLS
                                        </h3>
                                        <div className="flex items-center justify-between p-8 bg-black/5 border border-rose-500/20">
                                            <div>
                                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">MAINTENANCE_PROTOCOL_HALT</p>
                                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.1em] mt-1">LOCK_ALL_SETTLEMENTS_AND_PUBLIC_NODES</p>
                                            </div>
                                            <div
                                                onClick={() => updateGlobalConfig({ maintenanceMode: !globalConfig.maintenanceMode })}
                                                className={`w-16 h-8 p-1 cursor-pointer transition-all border ${globalConfig.maintenanceMode ? 'bg-rose-500 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'bg-black/10 border-black/10'}`}>
                                                <div className={`w-6 h-6 bg-white transition-transform duration-300 ${globalConfig.maintenanceMode ? 'translate-x-8' : 'translate-x-0'}`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 bg-white border border-black/10 p-10 shadow-2xl">
                                    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                                        <Activity className="w-4 h-4 text-emerald-500" />
                                        LIVE_EVENT_TRANSMISSIONS
                                    </h3>
                                    <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-3">
                                        {activityLogs.length === 0 ? (
                                            <div className="py-24 text-center">
                                                <Activity className="w-12 h-12 text-slate-800 mx-auto mb-5 animate-pulse" />
                                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">AWAITING_SIGNAL_LOCK...</p>
                                            </div>
                                        ) : activityLogs.slice(0, 20).map(ev => (
                                            <div key={ev.id} className={`bg-black/5 border-l-4 p-5 transition-all hover:bg-white/40 ${ev.type === 'broadcast' ? 'border-amber-500' : 'border-emerald-500'}`}>
                                                <p className={`text-[9px] font-black uppercase tracking-[0.3em] ${ev.type === 'broadcast' ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                    [{ev.type.toUpperCase()}_LOG]
                                                </p>
                                                <p className="text-[11px] font-black text-slate-400 mt-2 uppercase tracking-wide leading-relaxed">{ev.message}</p>
                                                <p className="text-[9px] text-slate-600 font-mono mt-2 tracking-tighter">{ev.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* Status bar */}
                <footer className="shrink-0 border-t border-black/10 bg-white px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20">
                            <div className="w-2 h-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">SYSTEM_NOMINAL</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Active Matrix:</span>
                            <span className="text-[9px] font-mono text-slate-600">{totalNodes.toLocaleString()} Accounts Restricted</span>
                        </div>
                        <div className="h-4 w-px bg-black/5" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">drope.in Admin Panel v4.1.0</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};


export default AdminSecurePortal;

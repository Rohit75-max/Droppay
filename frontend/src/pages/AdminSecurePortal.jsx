import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Users, Activity, ShieldAlert, ChevronLeft, ChevronRight,
    Search, ShieldOff, ArrowUpRight, Zap, Star,
    Wallet, TrendingUp, Landmark, CheckCircle2,
    LayoutDashboard, DollarSign, LogOut, Menu,
    AlertTriangle, RefreshCw, Clock, Shield, ChevronDown,
    X, User as UserIcon, Monitor, Settings, CreditCard, Paintbrush
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = `http://${window.location.hostname}:5001`;

// ─── Confirmation Modal ────────────────────────────────────────
const ConfirmModal = ({ open, title, message, confirmLabel, confirmColor = 'bg-rose-500', onConfirm, onCancel }) => (
    <AnimatePresence>
        {open && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-sm p-6">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{message}</p>
                    <div className="flex gap-3">
                        <button onClick={onCancel}
                            className="flex-1 py-2.5 rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                            Cancel
                        </button>
                        <button onClick={onConfirm}
                            className={`flex-1 py-2.5 rounded-2xl font-black uppercase tracking-widest text-xs text-white transition-all ${confirmColor}`}>
                            {confirmLabel}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

// ─── KPI Card ─────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, sub, accent, delay, details, detailsRender }) => {
    const [expanded, setExpanded] = useState(false);

    // Dynamic 'lite 2026' styles
    const bgClass = expanded
        ? 'bg-white border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] scale-[1.02] z-10 ring-1 ring-slate-100'
        : `${accent.bg} ${accent.border} hover:shadow-sm`;

    return (
        <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setExpanded(!expanded)}
            className={`cursor-pointer relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ease-out origin-top ${bgClass}`}>

            <motion.div layout className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300 ${accent.icon}`}>
                    <Icon className="w-4 h-4" />
                </div>
                {sub && (
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full transition-colors duration-300 ${accent.chip}`}>
                        {sub}
                    </span>
                )}
            </motion.div>

            <motion.p layout className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 transition-colors duration-300">
                {label}
            </motion.p>
            <motion.p layout className={`text-3xl font-black tracking-tight transition-colors duration-300 ${accent.value}`}>
                {value}
            </motion.p>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden border-t border-slate-100/80 pt-4"
                    >
                        {detailsRender ? detailsRender() : (
                            <p className="text-xs font-medium leading-relaxed text-slate-500">
                                {details}
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── Avatar ───────────────────────────────────────────────────
const Avatar = ({ name, isBanned }) => {
    const initials = (name || '?').slice(0, 2).toUpperCase();
    return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0
            ${isBanned ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-700'}`}>
            {initials}
        </div>
    );
};

// ─── Status Dot ───────────────────────────────────────────────
const StatusDot = ({ active }) => (
    <span className={`inline-block w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
);

// ─── Tier Badge ───────────────────────────────────────────────
const tierStyles = {
    legend: 'bg-amber-50 text-amber-600 border-amber-200',
    pro: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    starter: 'bg-blue-50 text-blue-600 border-blue-200',
    none: 'bg-slate-100 text-slate-400 border-slate-200',
};
const tierLabels = { legend: 'Legend (95%)', pro: 'Pro (90%)', starter: 'Starter (85%)', none: 'Ghost' };

// ─── Deep User Profile Drawer ──────────────────────────────────
const UserDetailDrawer = ({ userId, isOpen, onClose, context = 'directory' }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [txTab, setTxTab] = useState('donations'); // 'donations' | 'expenses'

    useEffect(() => {
        if (!isOpen || !userId) return;
        setLoading(true);
        axios.get(`${API_BASE}/api/admin/users/${userId}`, {
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
                        className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm" />

                    {/* Drawer */}
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-[101] border-l border-slate-200 flex flex-col overflow-hidden">

                        {loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                <RefreshCw className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
                                <p className="text-xs font-black uppercase tracking-widest">Loading Telemetry...</p>
                            </div>
                        ) : user ? (
                            <>
                                {/* Drawer Header */}
                                <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-4">
                                        <Avatar name={user.username} isBanned={user.security?.accountStatus?.isBanned} />
                                        <div>
                                            <h2 className="text-lg font-black text-slate-900 leading-none">
                                                {user.username}
                                                {user.role === 'admin' && <Star className="inline w-3.5 h-3.5 text-amber-400 fill-amber-400 ml-1.5 -translate-y-0.5" />}
                                            </h2>
                                            <p className="text-[10px] text-slate-500 font-mono mt-1">@{user.streamerId} • {user._id}</p>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Drawer Scrollable Content */}
                                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                                    {/* System Status Banner */}
                                    {user.security?.accountStatus?.isBanned && (
                                        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-600">
                                            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-black mb-1">Account Suspended</h4>
                                                <p className="text-xs font-medium">This node is currently blocked from all platform services.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* 1. Identity & Contact */}
                                    <section>
                                        <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                                            <UserIcon className="w-3.5 h-3.5" /> Personal Identity
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-black text-lg shrink-0">
                                                    {(user.fullName || user.username || '?').slice(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Full Profile Name</p>
                                                    <p className="text-sm font-bold text-slate-900">{user.fullName || 'Not Provided'}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">@{user.username}</p>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-center">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Email Address</p>
                                                        <p className="text-sm font-bold text-slate-800 break-all">{user.email || 'N/A'}</p>
                                                    </div>
                                                    {user.isEmailVerified ? <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase">Verified</span> : <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase">Unverified</span>}
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Phone Number</p>
                                                        <p className="text-sm font-bold text-slate-800 break-all">{user.phone || 'N/A'}</p>
                                                    </div>
                                                    {user.isPhoneVerified ? <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase">Verified</span> : <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase">Unverified</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* 2. Financial Metrics */}
                                    <section>
                                        <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                                            <CreditCard className="w-3.5 h-3.5" /> Financial Nexus
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="bg-slate-900 text-white rounded-2xl p-4">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Lifetime TPV</p>
                                                <p className="text-xl font-mono font-black text-emerald-400">₹{(user.financialMetrics?.totalLifetimeEarnings || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="border border-slate-200 rounded-2xl p-4 hover:border-emerald-300 transition-colors">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Settled</p>
                                                <p className="text-lg font-mono font-black text-slate-800">₹{(user.financialMetrics?.totalSettled || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="border border-slate-200 rounded-2xl p-4 hover:border-rose-300 transition-colors">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Unsettled Debt</p>
                                                <p className="text-lg font-mono font-black text-rose-500">₹{(user.financialMetrics?.pendingPayouts || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Razorpay Linkage</p>
                                                <p className="text-xs font-mono font-medium text-slate-700 mt-1">{user.razorpayAccountId || 'Unlinked'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Onboarding</p>
                                                <p className="text-xs font-black uppercase tracking-widest text-slate-700 mt-1">{user.payoutSettings?.onboardingStatus}</p>
                                            </div>
                                        </div>
                                    </section>

                                    {context !== 'finance' && (
                                        <>
                                            {/* 3. DropPay Dashboard Preferences */}
                                            <section>
                                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                                                    <Monitor className="w-3.5 h-3.5" /> Workspace Configuration
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Equipped Theme</p>
                                                        <p className="text-sm font-bold text-slate-800 capitalize">{user.nexusTheme?.replace('-', ' ')} <span className="text-slate-400 font-normal">({user.nexusThemeMode})</span></p>
                                                    </div>
                                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Owned Premium Themes</p>
                                                        <p className="text-sm font-bold text-indigo-600">{user.unlockedNexusThemes?.length || 0} Owned</p>
                                                    </div>
                                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 col-span-2">
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Premium Widgets Unlocked</p>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {(user.ownedWidgets?.length > 0) ? user.ownedWidgets.map((w, i) => (
                                                                <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 capitalize">
                                                                    {w.replace('-', ' ')}
                                                                </span>
                                                            )) : <span className="text-xs text-slate-400 italic">No premium widgets.</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* 4. Streamer Overlay Settings */}
                                            <section>
                                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                                                    <Paintbrush className="w-3.5 h-3.5" /> Studio Overlay Data
                                                </h3>
                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                                                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                                        <span className="text-xs text-slate-600 font-bold">Alert Style</span>
                                                        <span className="text-xs font-black uppercase tracking-widest text-indigo-600">{user.overlaySettings?.stylePreference?.replace(/_/g, ' ')}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                                        <span className="text-xs text-slate-600 font-bold">Goal Bar Style</span>
                                                        <span className="text-xs font-black uppercase tracking-widest text-amber-500">{user.goalSettings?.stylePreference?.replace(/_/g, ' ')}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                                        <span className="text-xs text-slate-600 font-bold">TTS Voice Engine</span>
                                                        <span className="text-xs font-bold text-slate-800 capitalize">
                                                            {user.overlaySettings?.ttsEnabled ? `${user.overlaySettings?.ttsVoice} (Min ₹${user.overlaySettings?.ttsMinAmount})` : 'Disabled'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-slate-600 font-bold">Equipped Sticker Gen</span>
                                                        <span className="text-xs font-black uppercase tracking-widest text-slate-800">{user.overlaySettings?.activeStickerSet}</span>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* 5. Security & Auth */}
                                            <section>
                                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                                                    <Settings className="w-3.5 h-3.5" /> Security Logs
                                                </h3>
                                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                    <div className="mb-3">
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Account Created</p>
                                                        <p className="text-xs font-mono mt-0.5">{formatDate(user.createdAt)}</p>
                                                    </div>
                                                    <div className="mb-3">
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Last Login Time</p>
                                                        <p className="text-xs font-mono mt-0.5">{formatDate(user.security?.lastLogin)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Last Login IP</p>
                                                        <p className="text-xs font-mono mt-0.5">{user.security?.lastLoginIP || 'Unknown'}</p>
                                                    </div>
                                                </div>
                                            </section>
                                        </>
                                    )}

                                    {context === 'finance' && (
                                        <section>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    <Wallet className="w-3.5 h-3.5" /> Recent Transactions
                                                </h3>
                                                <div className="flex bg-slate-100 p-0.5 rounded-lg">
                                                    <button
                                                        onClick={() => setTxTab('donations')}
                                                        className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${txTab === 'donations' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                                            }`}>
                                                        Donations
                                                    </button>
                                                    <button
                                                        onClick={() => setTxTab('expenses')}
                                                        className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${txTab === 'expenses' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                                            }`}>
                                                        Payouts/Assets
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {user.recentTransactions && user.recentTransactions.length > 0 ? (
                                                    user.recentTransactions
                                                        .filter(tx => {
                                                            const isStore = tx.donorName === 'SYSTEM_DEBIT';
                                                            const isWithdrawal = tx.donorName === 'WITHDRAWAL' || tx.donorName === 'SETTLEMENT';
                                                            const isExpense = isStore || isWithdrawal;

                                                            if (txTab === 'donations') return !isExpense;
                                                            return isExpense;
                                                        })
                                                        .map((tx, idx) => {
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
                                                                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <p className="text-sm font-bold text-slate-900">{title}</p>
                                                                            {isStore && <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-600 text-[8px] font-black uppercase tracking-widest">Asset</span>}
                                                                            {isWithdrawal && <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-600 text-[8px] font-black uppercase tracking-widest">Payout</span>}
                                                                            {!isStore && !isWithdrawal && <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase tracking-widest">Tip</span>}
                                                                        </div>
                                                                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{tx.message}</p>
                                                                        <p className="text-[9px] font-mono text-slate-400 mt-0.5">{formatDate(tx.createdAt)}</p>
                                                                    </div>
                                                                    <div className="text-right shrink-0">
                                                                        <p className={`text-sm font-black font-mono ${isDebit ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                                            {isDebit ? '-' : '+'}₹{Math.abs(tx.amount || 0).toLocaleString()}
                                                                        </p>
                                                                        <p className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${statusColor}`}>
                                                                            {tx.status}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                ) : (
                                                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                                                        <p className="text-xs font-bold text-slate-400">No {txTab} found.</p>
                                                    </div>
                                                )}

                                                {/* Fallback empty state if filter yields zero results but array isn't empty */}
                                                {(user.recentTransactions && user.recentTransactions.length > 0 &&
                                                    user.recentTransactions.filter(tx => {
                                                        const isExpense = tx.donorName === 'SYSTEM_DEBIT' || tx.donorName === 'WITHDRAWAL' || tx.donorName === 'SETTLEMENT';
                                                        return txTab === 'donations' ? !isExpense : isExpense;
                                                    }).length === 0) && (
                                                        <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                                                            <p className="text-xs font-bold text-slate-400">No {txTab} found.</p>
                                                        </div>
                                                    )}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                                <button onClick={onClose} className="absolute top-6 right-8 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
                                    <AlertTriangle className="w-8 h-8 text-rose-400" />
                                </div>
                                <h3 className="text-base font-black text-slate-900 tracking-tight">Node Not Found</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1 mb-6 text-center max-w-[250px]">
                                    We couldn't retrieve telemetrics for this node. They may have been fully purged from the system.
                                </p>
                                <button onClick={onClose} className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-y-[1px]">
                                    Go Back
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
    const [clock, setClock] = useState(new Date());
    const [modal, setModal] = useState(null); // { title, message, onConfirm, confirmLabel, confirmColor }
    const [refreshing, setRefreshing] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [drawerContext, setDrawerContext] = useState('directory');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // — Live clock —
    useEffect(() => {
        const t = setInterval(() => setClock(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    // — Auth header helper —
    const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

    // — Fetch functions —
    const fetchMetrics = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/admin/metrics`, { headers: authHeader() });
            setMetrics(res.data);
        } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 401) navigate('/dashboard');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    const fetchNodes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${API_BASE}/api/admin/users?page=${page}&limit=20&search=${search}&role=${roleFilter}`,
                { headers: authHeader() }
            );
            setNodes(res.data.nodes);
            setTotalPages(res.data.totalPages);
            setTotalNodes(res.data.totalNodes);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search, roleFilter]);

    const fetchPayoutQueue = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/admin/payouts`, { headers: authHeader() });
            setPayoutQueue(res.data);
        } catch (err) { console.error(err); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchMetrics();
        if (activeSection === 'directory') fetchNodes();
        if (activeSection === 'finance') fetchPayoutQueue();
    }, [fetchMetrics, fetchNodes, fetchPayoutQueue, activeSection]);

    const refreshAll = async () => {
        setRefreshing(true);
        await Promise.all([fetchMetrics(), activeSection === 'directory' ? fetchNodes() : fetchPayoutQueue()]);
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
                    await axios.patch(`${API_BASE}/api/admin/users/${id}/ban`, {}, { headers: authHeader() });
                    fetchNodes();
                } catch (err) { alert(err.response?.data?.msg || 'Moderation override failed.'); }
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
                    await axios.patch(`${API_BASE}/api/admin/users/${id}/tier`, { targetTier }, { headers: authHeader() });
                    fetchNodes();
                } catch (err) { alert('Tier Override Failed'); }
            }
        });
    };

    const overrideRole = async (id, targetRole) => {
        confirm({
            title: 'Override Clearance',
            message: `Grant ${targetRole.toUpperCase()} clearance to this node? ${targetRole === 'admin' ? 'Admin access gives full portal control.' : 'This will revoke admin privileges.'}`,
            confirmLabel: 'Confirm',
            confirmColor: targetRole === 'admin' ? 'bg-amber-500' : 'bg-slate-700',
            onConfirm: async () => {
                closeModal();
                try {
                    await axios.patch(`${API_BASE}/api/admin/users/${id}/role`, { targetRole }, { headers: authHeader() });
                    fetchNodes();
                } catch (err) { alert(err.response?.data?.msg || 'Clearance Override Failed'); }
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
                    await axios.post(`${API_BASE}/api/admin/payouts/${id}/settle`, {}, { headers: authHeader() });
                    fetchPayoutQueue();
                    fetchMetrics();
                } catch (err) { alert('Settlement execution failed.'); }
            }
        });
    };

    // — Sidebar nav items —
    const navItems = [
        { id: 'directory', icon: Users, label: 'Users' },
        { id: 'finance', icon: DollarSign, label: 'Finance' },
    ];

    // — KPI cards data —
    const kpiCards = [
        {
            icon: Users, label: 'Total Nodes', delay: 0.05,
            value: (metrics.totalUsers || 0).toLocaleString(),
            sub: 'All Time',
            details: 'Total registered user accounts across the platform. Includes both normal users and system admins.',
            accent: { bg: 'bg-white', border: 'border-slate-200', icon: 'bg-slate-100 text-slate-600', value: 'text-slate-900', chip: 'bg-slate-100 text-slate-500' }
        },
        {
            icon: ArrowUpRight, label: 'Creator Gross (TPV)', delay: 0.10,
            value: `₹${(metrics.totalVolume || 0).toLocaleString()}`,
            sub: 'Lifetime',
            details: 'Total Payment Volume. The gross amount collectively processed by all creators across the platform.',
            accent: { bg: 'bg-white', border: 'border-slate-200', icon: 'bg-slate-100 text-slate-600', value: 'text-slate-900', chip: 'bg-slate-100 text-slate-500' }
        },
        {
            icon: TrendingUp, label: 'Platform Commission', delay: 0.15,
            value: `₹${(metrics.platformCommission || 0).toLocaleString()}`,
            sub: 'Retained',
            details: 'Total net commission captured and retained natively by DropPay from all historic transactions.',
            accent: { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'bg-emerald-100 text-emerald-700', value: 'text-emerald-700', chip: 'bg-emerald-100 text-emerald-600' }
        },
        {
            icon: Activity, label: 'Active Subscriptions', delay: 0.20,
            value: (metrics.activeSubscriptions || 0).toLocaleString(),
            sub: 'Live',
            details: 'Total number of live, active fans currently subscribed to content creators on the platform.',
            accent: { bg: 'bg-white', border: 'border-slate-200', icon: 'bg-blue-100 text-blue-600', value: 'text-slate-900', chip: 'bg-blue-50 text-blue-500' }
        },
        {
            icon: Landmark, label: 'Subscription MRR', delay: 0.25,
            value: `₹${(metrics.platformSubscriptions || 0).toLocaleString()}`,
            sub: 'Revenue',
            detailsRender: () => (
                <div className="bg-blue-50/50 rounded-xl border border-blue-100/50 overflow-hidden mt-1">
                    <table className="w-full text-left text-[11px]">
                        <tbody>
                            <tr className="border-b border-blue-100/50">
                                <td className="py-2.5 px-3 font-bold text-slate-500 uppercase tracking-widest">Active Subscriptions</td>
                                <td className="py-2.5 px-3 text-right font-black text-blue-600">{(metrics.activeSubscriptions || 0).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 px-3 font-bold text-slate-500 uppercase tracking-widest">Lifetime Subscribers</td>
                                <td className="py-2.5 px-3 text-right font-black text-blue-600">{(metrics.lifetimeSubscribers || 0).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ),
            accent: { bg: 'bg-blue-50', border: 'border-blue-100', icon: 'bg-blue-100 text-blue-700', value: 'text-blue-700', chip: 'bg-blue-100 text-blue-600' }
        },
        {
            icon: Wallet, label: 'Unsettled Liability', delay: 0.30,
            value: `₹${(metrics.totalUnsettledDebt || 0).toLocaleString()}`,
            sub: `Settled ₹${(metrics.platformPayouts || 0).toLocaleString()}`,
            details: 'Total cumulated platform debt sitting in creator wallets currently awaiting final manual settlement.',
            accent: { bg: 'bg-rose-50', border: 'border-rose-100', icon: 'bg-rose-100 text-rose-600', value: 'text-rose-600', chip: 'bg-rose-100 text-rose-500' }
        },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans relative">

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
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" />
                )}
            </AnimatePresence>

            {/* ── SIDEBAR (Platform Commission Green Theme) ── */}
            <aside className={`fixed top-0 left-0 h-full w-64 lg:w-56 bg-emerald-50 border-r border-emerald-100 flex flex-col z-50 shrink-0 transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Logo */}
                <div className="flex items-center justify-between px-5 py-6 border-b border-emerald-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                        </div>
                        <div>
                            <span className="text-emerald-950 font-black text-lg tracking-tight">Drop<span className="text-emerald-600">Pay</span></span>
                            <p className="text-emerald-700 text-[8px] uppercase tracking-[0.2em] font-bold mt-0.5">Admin Portal</p>
                        </div>
                    </div>
                    <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-emerald-700 p-1 hover:text-emerald-900 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    <div className="px-3 pb-3">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700">Management Systems</p>
                    </div>
                    {navItems.map(({ id, icon: Icon, label }) => (
                        <button key={id} onClick={() => { setActiveSection(id); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group
                            ${activeSection === id
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'text-emerald-700/80 hover:text-emerald-900 hover:bg-emerald-100/50'}`}>
                            <Icon className={`w-4 h-4 shrink-0 transition-colors ${activeSection === id ? 'text-emerald-700' : 'text-emerald-600/60 group-hover:text-emerald-800'}`} />
                            <span className="text-xs font-bold tracking-wide">{label}</span>
                        </button>
                    ))}
                </nav>

                {/* Exit */}
                <div className="p-4 border-t border-emerald-100">
                    <button onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-rose-700/80 hover:text-rose-800 hover:bg-rose-100 transition-all group border border-transparent">
                        <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold tracking-wide">Exit Portal</span>
                    </button>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col lg:ml-56 h-screen w-full transition-all overflow-hidden bg-slate-50">

                {/* Top header */}
                <header className="shrink-0 z-30 bg-emerald-50/80 backdrop-blur-xl border-b border-emerald-100 px-4 md:px-6 h-[60px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-1.5 -ml-1.5 text-emerald-600 hover:bg-emerald-100/80 rounded-lg transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600/60">
                            <LayoutDashboard className="hidden sm:block w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-emerald-300">/</span>
                            <span className="text-emerald-950 capitalize">
                                {activeSection === 'directory' ? 'User Directory' : 'Financial Nexus'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Live clock */}
                        <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-emerald-600/60 transition-all">
                            <Clock className="w-3 h-3" />
                            {clock.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                        {/* Refresh */}
                        <button onClick={refreshAll}
                            className="p-2 rounded-xl bg-emerald-100/50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300 transition-all duration-300 shadow-sm">
                            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                        {/* Admin badge */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 shadow-sm">
                            <Shield className="w-3 h-3 text-amber-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">Admin</span>
                        </div>
                    </div>
                </header >

                {/* Page content */}
                < main className="flex-1 px-4 py-6 md:p-6 w-full max-w-[100vw] overflow-y-auto overflow-x-hidden custom-scrollbar pb-24" >

                    {/* KPI Grid */}
                    < div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6" >
                        {kpiCards.map((card, i) => <KpiCard key={i} {...card} />)}
                    </div >

                    {/* Section content */}
                    < AnimatePresence mode="wait" >
                        {activeSection === 'directory' ? (
                            <motion.div key="directory"
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                                {/* Table toolbar */}
                                <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-base font-black text-slate-900 tracking-tight">User Directory</h2>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                            {totalNodes.toLocaleString()} total records
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                                        {/* Search */}
                                        <div className="relative w-full sm:flex-1 sm:w-64">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                                            <input type="text" placeholder="Search user, ID, or email..."
                                                value={search}
                                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                                                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 transition-all" />
                                        </div>
                                        {/* Role filter pills */}
                                        <div className="flex bg-slate-100 rounded-xl p-0.5 w-full sm:w-auto overflow-x-auto custom-scrollbar">
                                            {[['all', 'All'], ['admin', 'Admins'], ['user', 'Users']].map(([val, lbl]) => (
                                                <button key={val}
                                                    onClick={() => { setRoleFilter(val); setPage(1); }}
                                                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                                                    ${roleFilter === val ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                                    {lbl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm min-w-[800px]">
                                        <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-3">User</th>
                                                <th className="px-6 py-3">Contact</th>
                                                <th className="px-6 py-3">Lifetime TPV</th>
                                                <th className="px-6 py-3">Tier</th>
                                                <th className="px-6 py-3">Role</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                Array.from({ length: 8 }).map((_, i) => (
                                                    <tr key={i} className="border-b border-slate-50">
                                                        {Array.from({ length: 6 }).map((_, j) => (
                                                            <td key={j} className="px-6 py-4">
                                                                <div className="h-3.5 bg-slate-100 rounded-full animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            ) : nodes.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="py-16 text-center text-slate-400 text-sm font-bold">
                                                        No users match your filters.
                                                    </td>
                                                </tr>
                                            ) : nodes.map(node => {
                                                const isBanned = node.security?.accountStatus?.isBanned;
                                                return (
                                                    <tr key={node._id}
                                                        onClick={() => {
                                                            setSelectedUserId(node._id);
                                                            setDrawerContext('directory');
                                                        }}
                                                        className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer
                                                        ${isBanned ? 'bg-rose-50/40' : ''}`}>

                                                        {/* User */}
                                                        <td className="px-6 py-3.5">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar name={node.username} isBanned={isBanned} />
                                                                <div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="font-bold text-slate-900 text-[13px]">{node.username}</span>
                                                                        {node.role === 'admin' && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                                                                        <StatusDot active={!isBanned} />
                                                                    </div>
                                                                    <span className="text-[10px] text-slate-400 font-mono">@{node.streamerId}</span>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Contact */}
                                                        <td className="px-6 py-3.5">
                                                            <span className="text-slate-700 font-medium text-[12px]">{node.email}</span>
                                                            <br />
                                                            <span className="text-[10px] text-slate-400">Refs: {node.referralCount || 0}</span>
                                                        </td>

                                                        {/* TPV */}
                                                        <td className="px-6 py-3.5">
                                                            <span className="font-black font-mono text-emerald-600 text-[13px]">
                                                                ₹{(node.financialMetrics?.totalLifetimeEarnings || 0).toLocaleString()}
                                                            </span>
                                                        </td>

                                                        {/* Tier */}
                                                        <td className="px-6 py-3.5">
                                                            <div className="relative inline-flex items-center">
                                                                <select
                                                                    value={node.tier || 'none'}
                                                                    onChange={e => overrideTier(node._id, e.target.value)}
                                                                    className={`appearance-none pl-2.5 pr-7 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer outline-none transition-all
                                                                    ${tierStyles[node.tier || 'none']}`}
                                                                >
                                                                    <option value="none">Ghost</option>
                                                                    <option value="starter">Starter (85%)</option>
                                                                    <option value="pro">Pro (90%)</option>
                                                                    <option value="legend">Legend (95%)</option>
                                                                </select>
                                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                                                            </div>
                                                        </td>

                                                        {/* Role */}
                                                        <td className="px-6 py-3.5">
                                                            <div className="relative inline-flex items-center">
                                                                <select
                                                                    value={node.role || 'user'}
                                                                    onChange={e => overrideRole(node._id, e.target.value)}
                                                                    className={`appearance-none pl-2.5 pr-7 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer outline-none transition-all
                                                                    ${node.role === 'admin'
                                                                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                                                                            : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                                                                >
                                                                    <option value="user">User</option>
                                                                    <option value="admin">Admin</option>
                                                                </select>
                                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                                                            </div>
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="px-6 py-3.5 text-right">
                                                            <button
                                                                onClick={() => toggleBan(node._id, isBanned)}
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                                                ${isBanned
                                                                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                                        : 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-100'}`}>
                                                                {isBanned ? <><ShieldOff className="w-3 h-3" /> Reinstate</>
                                                                    : <><ShieldAlert className="w-3 h-3" /> Suspend</>}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Page {page} of {totalPages}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                            return (
                                                <button key={p} onClick={() => setPage(p)}
                                                    className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all
                                                    ${p === page ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                                                    {p}
                                                </button>
                                            );
                                        })}
                                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                        ) : (
                            /* ── FINANCIAL NEXUS ── */
                            <motion.div key="finance"
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.3 }}>

                                {/* Summary bar */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 mb-1">Total Unsettled Debt</p>
                                        <p className="text-2xl font-black text-rose-600 font-mono tracking-tight">
                                            ₹{payoutQueue.reduce((sum, n) => sum + (n.financialMetrics?.pendingPayouts || 0), 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1">Lifetime Settled</p>
                                        <p className="text-2xl font-black text-emerald-600">₹{metrics.platformPayouts.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-base font-black text-slate-900 tracking-tight">Settlement Queue</h2>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                                {payoutQueue.length} nodes awaiting settlement
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-rose-500">Pending Action</span>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm min-w-[700px]">
                                            <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                                <tr>
                                                    <th className="px-6 py-3">Node</th>
                                                    <th className="px-6 py-3">Tier</th>
                                                    <th className="px-6 py-3 text-emerald-600">Total Settled</th>
                                                    <th className="px-6 py-3 text-rose-500">Pending Payout</th>
                                                    <th className="px-6 py-3 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payoutQueue.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="py-16 text-center">
                                                            <CheckCircle2 className="w-10 h-10 text-emerald-300 mx-auto mb-3" />
                                                            <p className="text-slate-400 font-bold text-sm">All nodes are settled. No pending payouts.</p>
                                                        </td>
                                                    </tr>
                                                ) : payoutQueue.map(node => (
                                                    <tr key={node._id}
                                                        onClick={() => {
                                                            console.log("[ADMIN FRONTEND] Clicking Node in finance queue. Received _id:", node._id);
                                                            setSelectedUserId(node._id);
                                                            setDrawerContext('finance');
                                                        }}
                                                        className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar name={node.username} isBanned={false} />
                                                                <div>
                                                                    <span className="font-bold text-slate-900 text-[13px]">{node.username}</span>
                                                                    <br />
                                                                    <span className="text-[10px] text-slate-400 font-mono">@{node.streamerId}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${tierStyles[node.tier || 'none']}`}>
                                                                {node.tier || 'Ghost'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 font-black font-mono text-emerald-600 text-[13px]">
                                                            ₹{(node.financialMetrics?.totalSettled || 0).toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 font-black font-mono text-rose-500 text-[15px]">
                                                            ₹{(node.financialMetrics?.pendingPayouts || 0).toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    executeSettlement(node._id, node.financialMetrics?.pendingPayouts || 0);
                                                                }}
                                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-sm shadow-emerald-200">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> Settle
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence >
                </main >

                {/* Status bar */}
                < footer className="shrink-0 border-t border-slate-200 bg-white px-6 py-2 flex items-center justify-between" >
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Operational</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[9px] font-mono text-slate-300">
                            {clock.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                            {totalNodes} Nodes · {payoutQueue.length} Pending
                        </span>
                    </div>
                </footer >
            </div >
        </div >
    );
};

export default AdminSecurePortal;

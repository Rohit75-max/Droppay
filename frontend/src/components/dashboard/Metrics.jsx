import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Activity, Trophy, UserCircle, Target, Zap } from 'lucide-react';

const history = [
    { id: '#P-902', date: '30 Mar 2026', amount: '₹1,200', type: 'UPI_DIRECT', status: 'SETTLED' },
    { id: '#P-901', date: '28 Mar 2026', amount: '₹840', type: 'BANK_TRSF', status: 'SETTLED' },
    { id: '#P-900', date: '25 Mar 2026', amount: '₹2,100', type: 'UPI_DIRECT', status: 'PENDING' },
    { id: '#P-899', date: '22 Mar 2026', amount: '₹560', type: 'UPI_DIRECT', status: 'SETTLED' },
    { id: '#P-898', date: '20 Mar 2026', amount: '₹3,400', type: 'BANK_TRSF', status: 'SETTLED' },
];

const revenueChartData = [
    { month: 'OCT', val: 45 },
    { month: 'NOV', val: 62 },
    { month: 'DEC', val: 58 },
    { month: 'JAN', val: 84 },
    { month: 'FEB', val: 76 },
    { month: 'MAR', val: 92 },
];

export function MetricsPulse({ user, topDonors = [], recentDrops = [], nexusTheme = 'void', theme = 'dark' }) {
    
    // Formatting Helpers
    const formatCurrency = (amt) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt || 0);

    const getTimeAgo = (dateInput) => {
        if (!dateInput) return '';
        const now = new Date();
        const past = new Date(dateInput);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    // Calculate core metrics safely
    const totalEarnings = user?.financialMetrics?.totalEarnings || 0;
    const monthlyNet = user?.financialMetrics?.monthlyNetEarnings || 0;
    const totalDrops = user?.financialMetrics?.totalTips || 0;
    
    // Maximum donor amount for relative progress bar scaling
    const maxDonorAmount = topDonors[0]?.amount || 1; 

    // Dynamic Top Grid
    const coreMetrics = [
        { label: 'Total Revenue', value: formatCurrency(totalEarnings), trend: 'LIFETIME', detail: 'Gross Volume', icon: Wallet, color: 'text-emerald-500' },
        { label: 'Monthly Net', value: formatCurrency(monthlyNet), trend: '30D CYCLE', detail: 'Net Yield', icon: TrendingUp, color: 'text-blue-500' },
        { label: 'System Drops', value: totalDrops, trend: 'ALL TIME', detail: 'Signal Count', icon: Activity, color: 'text-fuchsia-500' },
        { label: 'Apex Supporter', value: topDonors[0]?.senderName || 'N/A', trend: topDonors[0] ? formatCurrency(topDonors[0]?.amount) : 'NO DATA', detail: 'Rank 1', icon: Trophy, color: 'text-amber-500' },
        { label: 'Projected Protocol Yield', value: formatCurrency(monthlyNet * 1.15), trend: 'ESTIMATE', detail: '+15% MoM', icon: Zap, color: 'text-rose-500' },
    ];

    return (
        <div className="px-4 md:px-8 py-8 md:py-12 pb-24 space-y-4 md:space-y-8 text-[var(--nexus-text)]">

            {/* ── METRIC GRID ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {coreMetrics.map((metric, idx) => {
                    const IconBox = metric.icon;
                    return (
                        <div key={idx} className="nexus-card p-6 md:p-8 shadow-sm group transition-all h-full flex flex-col justify-between relative overflow-hidden">
                            {/* Subtle background glow effect on hover */}
                            <div className={`absolute -right-6 -top-6 w-24 h-24 ${metric.color.replace('text-', 'bg-')} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none`} />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-text)] transition-colors">
                                        {metric.label}
                                    </p>
                                    <IconBox className={`w-4 h-4 ${metric.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                                </div>
                                <h3 className={`font-sans font-black text-2xl md:text-3xl uppercase tracking-tighter mb-4 ${nexusTheme === 'neon_relic' ? 'relic-text-glow' : ''}`}>
                                    {metric.value}
                                </h3>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-[var(--nexus-border)] relative z-10">
                                <span className={`font-mono text-[10px] font-black uppercase tracking-tight ${metric.color}`}>
                                    {metric.trend}
                                </span>
                                <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-widest text-[var(--nexus-text-muted)]">
                                    {metric.detail}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                {/* ── RECENT TELEMETRY (Recent Drops) ── */}
                <section>
                    <div className="nexus-card shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="px-6 md:px-8 py-5 flex items-center justify-between border-b border-[var(--nexus-border)] bg-[var(--nexus-bg)]/30 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--nexus-text)]">
                                    Live Signal Ingress
                                </p>
                            </div>
                            <Activity className="w-3 h-3 text-[var(--nexus-text-muted)]" />
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
                            {recentDrops.length > 0 ? (
                                recentDrops.slice(0, 6).map((drop, i) => (
                                    <div key={drop._id || i}
                                        className="px-6 md:px-8 py-5 flex items-center justify-between group transition-colors border-b border-[var(--nexus-border)] last:border-0 hover:bg-[var(--nexus-bg)]"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-[11px] font-black shrink-0 border border-[var(--nexus-border)] bg-[var(--nexus-panel)] text-[var(--nexus-text)]">
                                                {drop.senderName?.substring(0, 2).toUpperCase() || 'AN'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-sans font-black text-sm uppercase tracking-tight truncate text-[var(--nexus-text)]">
                                                    {drop.senderName || 'Anonymous'} <span className="text-[var(--nexus-text-muted)] mx-2">{"//"}</span> <span className="text-[var(--nexus-accent)] drop-shadow-[0_0_8px_var(--nexus-accent-glow)]">{formatCurrency(drop.amount)}</span>
                                                </p>
                                                <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--nexus-text-muted)] mt-0.5 truncate">
                                                    {drop.message ? `"${drop.message}"` : 'NO MESSAGE ATTACHED'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 text-right ml-4">
                                            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--nexus-text-muted)] block relative">
                                                {getTimeAgo(drop.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center flex flex-col items-center justify-center h-full opacity-60">
                                    <Target className="w-10 h-10 text-[var(--nexus-text-muted)] mb-4" />
                                    <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--nexus-text-muted)]">Awaiting incoming signals</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── LOYALTY INDEX (Top Supporters) ── */}
                <section>
                    <div className="nexus-card shadow-sm overflow-hidden h-full flex flex-col relative z-0">
                        {/* Elite Supporter Backdrop Element */}
                        <div className="absolute top-0 right-0 -m-32 w-64 h-64 bg-[var(--nexus-accent)] opacity-[0.03] rounded-full blur-[80px] pointer-events-none -z-10" />

                        <div className="px-6 md:px-8 py-5 flex items-center justify-between border-b border-[var(--nexus-border)] bg-[var(--nexus-bg)]/30 backdrop-blur-md">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--nexus-text)]">
                                Patron Stature Index
                            </p>
                            <Trophy className="w-3 h-3 text-[var(--nexus-accent)]" />
                        </div>

                        <div className="p-6 md:p-8 space-y-6 flex-1 flex flex-col">
                            {topDonors.length > 0 ? (
                                topDonors.slice(0, 5).map((donor, idx) => {
                                    const rawPercentage = (donor.amount / maxDonorAmount) * 100;
                                    const percentage = isNaN(rawPercentage) ? 1 : Math.min(100, Math.max(1, rawPercentage));
                                    const isTop = idx === 0;
                                    
                                    return (
                                        <div key={donor._id || idx} className="space-y-3 group">
                                            <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest font-black items-end">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-4 h-4 flex items-center justify-center rounded bg-[var(--nexus-panel)] border ${isTop ? 'border-[var(--nexus-accent)] text-[var(--nexus-accent)]' : 'border-[var(--nexus-border)] text-[var(--nexus-text-muted)]'} text-[8px]`}>
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-[var(--nexus-text)] group-hover:text-[var(--nexus-accent)] transition-colors">
                                                        {donor.senderName}
                                                    </span>
                                                </div>
                                                <span className={`${isTop ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text-muted)]'}`}>
                                                    {formatCurrency(donor.amount)}
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full overflow-hidden bg-[var(--nexus-bg)] border border-[var(--nexus-border)]">
                                                <motion.div 
                                                    initial={{ width: 0 }} 
                                                    animate={{ width: `${percentage}%` }} 
                                                    transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }} 
                                                    className={`h-full rounded-full ${isTop ? 'bg-[var(--nexus-accent)] shadow-[0_0_10px_var(--nexus-accent-glow)]' : 'bg-[var(--nexus-text-muted)]/50'}`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-10 text-center flex flex-col items-center justify-center h-full opacity-60">
                                    <UserCircle className="w-10 h-10 text-[var(--nexus-text-muted)] mb-4" />
                                    <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--nexus-text-muted)]">No supporter data registered</p>
                                </div>
                            )}

                            {/* Node Summary Panel */}
                            {topDonors.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-[var(--nexus-border)] flex items-center justify-between">
                                    <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--nexus-text-muted)]">
                                        Total Active Nodes
                                    </p>
                                    <p className="font-mono text-sm font-black text-[var(--nexus-text)]">
                                        {topDonors.length}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* ── YIELD ANALYTICS & SETTLEMENT LOGS ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                {/* ── REVENUE PERFORMANCE ── */}
                <section>
                    <div className="nexus-card shadow-sm overflow-hidden h-full flex flex-col pt-5">
                        <div className="px-6 md:px-8 flex items-center justify-between mb-8">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--nexus-text)]">
                                Revenue Performance
                            </p>
                            <TrendingUp className="w-3 h-3 text-[var(--nexus-text-muted)]" />
                        </div>
                        <div className="flex-1 px-6 md:px-8 pb-8 flex items-end justify-between h-[200px]">
                            {revenueChartData.map((d) => (
                                <div key={d.month} className="flex flex-col items-center gap-3 group h-full">
                                    <div
                                        className="relative w-8 md:w-10 rounded-xl overflow-hidden flex-1 flex items-end border bg-[var(--nexus-bg)] border-[var(--nexus-border)]"
                                    >
                                        <div
                                            style={{ height: `${d.val}%` }}
                                            className="w-full bg-[var(--nexus-accent)] transition-all duration-700 ease-out shadow-[0_0_15px_var(--nexus-accent-glow)] group-hover:brightness-125"
                                        />
                                    </div>
                                    <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.15em] font-black text-[var(--nexus-text-muted)]">
                                        {d.month}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── SETTLEMENT LOGS ── */}
                <section>
                    <div className="nexus-card shadow-sm overflow-hidden h-full flex flex-col pt-5">
                        <div className="px-6 md:px-8 flex items-center justify-between mb-2">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--nexus-text)]">
                                Settlement Logs
                            </p>
                            <UserCircle className="w-3 h-3 text-[var(--nexus-text-muted)]" />
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar">
                            {history.map((pay, i) => (
                                <div key={pay.id} className="px-6 md:px-8 py-4 flex items-center justify-between border-b border-[var(--nexus-border)] last:border-0 hover:bg-[var(--nexus-bg)] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] italic shrink-0 border border-[var(--nexus-border)] bg-[var(--nexus-panel)] text-[var(--nexus-text)]">
                                            RK
                                        </div>
                                        <div>
                                            <h4 className="font-sans text-[12px] font-black uppercase tracking-tighter text-[var(--nexus-text)]">
                                                {pay.amount} · {pay.type}
                                            </h4>
                                            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--nexus-text-muted)] mt-0.5">
                                                {pay.date} {"//"} ID_{pay.id}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`font-mono text-[8px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${pay.status === 'SETTLED' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10'}`}>
                                        {pay.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MetricsPulse;
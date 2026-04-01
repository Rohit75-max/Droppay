import React from 'react';
import { motion } from 'framer-motion';

const alertMetrics = [
{ label: 'Alert Triggered', value: '14,204', trend: '+18.2%', detail: 'Last 30 Days' },
{ label: 'Avg Latency', value: '42ms', trend: '-4ms', detail: 'Region: Asia-1' },
{ label: 'Unique Fans', value: '5,810', trend: '+12.4%', detail: 'New Nodes Active' },
{ label: 'Uptime Pulse', value: '99.9%', trend: 'OPTIMAL', detail: '0 Downtime' },
];

const recentActivity = [
{ id: 'ACT-01', user: 'Rohit75', type: 'DONATION', val: '₹500', time: '2m ago' },
{ id: 'ACT-02', user: 'Zarcero', type: 'DROP_SYNC', val: 'NIKE_AIR', time: '15m ago' },
{ id: 'ACT-03', user: 'AlphaStream', type: 'ALERT_SKIN', val: 'CYBER_RED', time: '1h ago' },
{ id: 'ACT-04', user: 'GamerX', type: 'DONATION', val: '₹200', time: '3h ago' },
{ id: 'ACT-05', user: 'NeoOps', type: 'MEMBER_JOIN', val: 'TIER_1', time: '5h ago' },
];

const trafficSources = [
{ label: 'YouTube Live', val: 65, color: '#FF0000' },
{ label: 'Twitch Direct', val: 24, color: '#9146FF' },
{ label: 'X / Twitter', val: 8, color: '#000000' },
{ label: 'Instagram', val: 3, color: '#E4405F' },
];

export function MetricsPulse() {
return (
<div className="text-zinc-900 dark:text-white px-4 md:px-8 py-8 md:py-12 pb-24 space-y-4 md:space-y-8">

    {/* ── METRIC GRID ── */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {alertMetrics.map((metric) => (
        <div key={metric.label}
            className="bg-theme-panel hud-panel border border-zinc-900/40 dark:border-white/20 p-6 md:p-8 rounded-[calc(var(--theme-radius)*0.8)] shadow-sm group hover:border-theme-accent/30 transition-all h-full flex flex-col justify-between">
            <div>
                <p
                    className="font-mono text-[8px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5 md:mb-2 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                    {metric.label}</p>
                <h3
                    className="font-sans font-black text-2xl md:text-3xl text-zinc-900 dark:text-white uppercase tracking-tighter mb-4 md:mb-6">
                    {metric.value}</h3>
            </div>
            <div className="flex items-center justify-between border-t border-theme-border/50 pt-4 md:pt-6">
                <span
                    className="font-mono text-[9px] md:text-[10px] text-theme-accent font-black uppercase tracking-tight">{metric.trend}</span>
                <span
                    className="font-mono text-[8px] md:text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{metric.detail}</span>
            </div>
        </div>
        ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">

        {/* ── RECENT ACTIVITY LOG ── */}
        <section>
            <div
                className="bg-theme-panel hud-panel border border-zinc-900/40 dark:border-white/20 rounded-[calc(var(--theme-radius)*0.8)] shadow-sm overflow-hidden h-full flex flex-col">
                <div
                    className="px-6 md:px-10 py-5 border-b border-theme-accent flex items-center bg-black/5 dark:bg-white/5">
                    <p
                        className="font-mono text-[10px] text-zinc-900 dark:text-white uppercase tracking-[0.2em] font-medium">
                        02 // REAL-TIME ACTIVITY</p>
                </div>

                <div className="flex-1 overflow-x-auto min-w-0">
                    {recentActivity.map((act) => (
                    <div key={act.id}
                        className="px-6 md:px-10 py-6 border-b border-theme-border/50 flex items-center justify-between group hover:bg-theme-surface transition-colors min-w-0">
                        <div className="flex items-center gap-4 md:gap-6 min-w-0">
                            <div
                                className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 font-mono text-[10px] uppercase font-black shrink-0 border-2 border-theme-panel shadow-md italic">
                                RK
                            </div>
                            <div className="min-w-0">
                                <p
                                    className="font-sans font-black text-xs text-zinc-900 dark:text-white uppercase tracking-tight truncate">
                                    {act.type} {"//"} {act.user} {"//"} <span className="text-theme-accent">{act.val}</span>
                                </p>
                                <p className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">{act.id} ·
                                    {act.time}</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-theme-accent block animate-pulse" />
                        </div>
                    </div>
                    ))}
                </div>

                <div className="p-8 border-t border-theme-border/50 bg-black/5 dark:bg-white/5">
                    <button
                        className="w-full py-4 font-mono text-[9px] text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em] hover:text-zinc-900 dark:hover:text-white transition-colors">
                        View Full Activity History
                    </button>
                </div>
            </div>
        </section>

        {/* ── TRAFFIC SOURCE TELEMETRY ── */}
        <section>
            <div
                className="bg-theme-panel hud-panel border border-zinc-900/40 dark:border-white/20 rounded-[calc(var(--theme-radius)*0.8)] shadow-sm overflow-hidden h-full flex flex-col">
                <div
                    className="px-6 md:px-10 py-5 border-b border-theme-accent flex items-center bg-black/5 dark:bg-white/5">
                    <p
                        className="font-mono text-[10px] text-zinc-900 dark:text-white uppercase tracking-[0.2em] font-medium">
                        03 // TRAFFIC ORIGINS</p>
                </div>

                <div className="p-6 md:p-10 space-y-6 md:space-y-8 h-full flex flex-col justify-center">
                    {trafficSources.map((source) => (
                    <div key={source.label} className="space-y-3">
                        <div
                            className="flex justify-between font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-black text-zinc-900 dark:text-white">
                            <span>{source.label}</span>
                            <span>{source.val}%</span>
                        </div>
                        <div
                            className="h-2 w-full bg-theme-surface rounded-full overflow-hidden border border-theme-border/50">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${source.val}%` }} transition={{
                                duration: 1, ease: 'easeOut' }} style={{ backgroundColor: source.color }}
                                className="h-full rounded-full drop-shadow-md" />
                        </div>
                    </div>
                    ))}

                    <div
                        className="mt-8 md:mt-12 p-6 md:p-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[calc(var(--theme-radius)*0.6)] relative overflow-hidden group border border-theme-border/50">
                        <div
                            className="absolute top-0 right-0 p-4 font-mono text-[8px] text-zinc-600 dark:text-zinc-400 uppercase tracking-widest group-hover:text-zinc-400 dark:group-hover:text-zinc-600 transition-colors">
                            Insights_Node</div>
                        <h4 className="font-sans font-black text-lg md:text-xl uppercase tracking-tighter mb-2 md:mb-4">
                            Peak Traffic Detected</h4>
                        <p
                            className="font-mono text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-relaxed">
                            System identified a surge from <span
                                className="text-white dark:text-zinc-900 font-bold">YouTube Live</span> between 19:00 -
                            21:00 UTC. Consider enabling higher-tier alert processing for next cycle.</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>
);
}
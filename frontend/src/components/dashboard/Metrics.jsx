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
{ label: 'X / Twitter', val: 8, color: 'var(--nexus-text)' },
{ label: 'Instagram', val: 3, color: '#E4405F' },
];

export function MetricsPulse() {
return (
<div className="px-4 md:px-8 py-8 md:py-12 pb-24 space-y-4 md:space-y-8" style={{ color: 'var(--nexus-text)' }}>

    {/* ── METRIC GRID ── */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {alertMetrics.map((metric) => (
        <div key={metric.label}
            className="nexus-card p-6 md:p-8 shadow-sm group transition-all h-full flex flex-col justify-between"
            style={{ background: 'var(--nexus-panel)', border: '1px solid var(--nexus-border)', borderRadius: 'var(--nexus-radius)' }}>
            <div>
                <p className="font-mono text-[8px] uppercase tracking-widest mb-1.5 md:mb-2 transition-colors"
                    style={{ color: 'var(--nexus-text-muted)' }}>
                    {metric.label}</p>
                <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tighter mb-4 md:mb-6"
                    style={{ color: 'var(--nexus-text)' }}>
                    {metric.value}</h3>
            </div>
            <div className="flex items-center justify-between pt-4 md:pt-6"
                style={{ borderTop: '1px solid var(--nexus-border)' }}>
                <span className="font-mono text-[9px] md:text-[10px] font-black uppercase tracking-tight"
                    style={{ color: 'var(--nexus-accent)' }}>{metric.trend}</span>
                <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-widest"
                    style={{ color: 'var(--nexus-text-muted)' }}>{metric.detail}</span>
            </div>
        </div>
        ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">

        {/* ── RECENT ACTIVITY LOG ── */}
        <section>
            <div className="nexus-card shadow-sm overflow-hidden h-full flex flex-col"
                style={{ background: 'var(--nexus-panel)', border: '1px solid var(--nexus-border)', borderRadius: 'var(--nexus-radius)' }}>
                <div className="px-6 md:px-10 py-5 flex items-center"
                    style={{ borderBottom: '1px solid var(--nexus-accent)', background: 'rgba(var(--nexus-text-rgb, 255,255,255), 0.03)' }}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium"
                        style={{ color: 'var(--nexus-text)' }}>
                        02 // REAL-TIME ACTIVITY</p>
                </div>

                <div className="flex-1 overflow-x-auto min-w-0">
                    {recentActivity.map((act) => (
                    <div key={act.id}
                        className="px-6 md:px-10 py-6 flex items-center justify-between group transition-colors min-w-0"
                        style={{ borderBottom: '1px solid var(--nexus-border)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--nexus-bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div className="flex items-center gap-4 md:gap-6 min-w-0">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-mono text-[10px] uppercase font-black shrink-0 shadow-md italic"
                                style={{ background: 'var(--nexus-text)', color: 'var(--nexus-panel)', border: '2px solid var(--nexus-border)' }}>
                                RK
                            </div>
                            <div className="min-w-0">
                                <p className="font-sans font-black text-xs uppercase tracking-tight truncate"
                                    style={{ color: 'var(--nexus-text)' }}>
                                    {act.type} {"//"} {act.user} {"//"} <span style={{ color: 'var(--nexus-accent)' }}>{act.val}</span>
                                </p>
                                <p className="font-mono text-[8px] uppercase tracking-widest"
                                    style={{ color: 'var(--nexus-text-muted)' }}>{act.id} · {act.time}</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full block animate-pulse"
                                style={{ background: 'var(--nexus-accent)' }} />
                        </div>
                    </div>
                    ))}
                </div>

                <div className="p-8" style={{ borderTop: '1px solid var(--nexus-border)', background: 'rgba(var(--nexus-text-rgb, 255,255,255), 0.02)' }}>
                    <button className="w-full py-4 font-mono text-[9px] uppercase tracking-[0.3em] transition-colors"
                        style={{ color: 'var(--nexus-text-muted)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--nexus-text)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--nexus-text-muted)'}>
                        View Full Activity History
                    </button>
                </div>
            </div>
        </section>

        {/* ── TRAFFIC SOURCE TELEMETRY ── */}
        <section>
            <div className="nexus-card shadow-sm overflow-hidden h-full flex flex-col"
                style={{ background: 'var(--nexus-panel)', border: '1px solid var(--nexus-border)', borderRadius: 'var(--nexus-radius)' }}>
                <div className="px-6 md:px-10 py-5 flex items-center"
                    style={{ borderBottom: '1px solid var(--nexus-accent)', background: 'rgba(var(--nexus-text-rgb, 255,255,255), 0.03)' }}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium"
                        style={{ color: 'var(--nexus-text)' }}>
                        03 // TRAFFIC ORIGINS</p>
                </div>

                <div className="p-6 md:p-10 space-y-6 md:space-y-8 h-full flex flex-col justify-center">
                    {trafficSources.map((source) => (
                    <div key={source.label} className="space-y-3">
                        <div className="flex justify-between font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-black"
                            style={{ color: 'var(--nexus-text)' }}>
                            <span>{source.label}</span>
                            <span>{source.val}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full overflow-hidden"
                            style={{ background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${source.val}%` }} transition={{
                                duration: 1, ease: 'easeOut' }} style={{ backgroundColor: source.color }}
                                className="h-full rounded-full drop-shadow-md" />
                        </div>
                    </div>
                    ))}

                    <div className="mt-8 md:mt-12 p-6 md:p-10 relative overflow-hidden group"
                        style={{ background: 'var(--nexus-text)', color: 'var(--nexus-panel)', borderRadius: 'var(--nexus-radius)', border: '1px solid var(--nexus-border)' }}>
                        <div className="absolute top-0 right-0 p-4 font-mono text-[8px] uppercase tracking-widest transition-colors"
                            style={{ color: 'var(--nexus-panel)', opacity: 0.4 }}>
                            Insights_Node</div>
                        <h4 className="font-sans font-black text-lg md:text-xl uppercase tracking-tighter mb-2 md:mb-4">
                            Peak Traffic Detected</h4>
                        <p className="font-mono text-[9px] uppercase tracking-widest leading-relaxed"
                            style={{ color: 'var(--nexus-panel)', opacity: 0.6 }}>
                            System identified a surge from <span style={{ opacity: 1, fontWeight: 900 }}>YouTube Live</span> between 19:00 -
                            21:00 UTC. Consider enabling higher-tier alert processing for next cycle.</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>
);
}
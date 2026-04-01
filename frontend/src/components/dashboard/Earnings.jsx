import React from 'react';

const stats = [
    { label: 'Total Earnings', value: '₹42,390', trend: '+12.4%' },
    { label: 'Settled Amount', value: '₹38,100', trend: '90.2%' },
    { label: 'Pending Node', value: '₹4,290', trend: 'In Queue' },
    { label: 'Avg / Drop', value: '₹1,540', trend: '+5.1%' },
];

const history = [
    { id: '#P-902', date: '30 Mar 2026', amount: '₹1,200', type: 'UPI_DIRECT', status: 'SETTLED' },
    { id: '#P-901', date: '28 Mar 2026', amount: '₹840', type: 'BANK_TRSF', status: 'SETTLED' },
    { id: '#P-900', date: '25 Mar 2026', amount: '₹2,100', type: 'UPI_DIRECT', status: 'PENDING' },
    { id: '#P-899', date: '22 Mar 2026', amount: '₹560', type: 'UPI_DIRECT', status: 'SETTLED' },
    { id: '#P-898', date: '20 Mar 2026', amount: '₹3,400', type: 'BANK_TRSF', status: 'SETTLED' },
];

const chartData = [
    { month: 'OCT', val: 45 },
    { month: 'NOV', val: 62 },
    { month: 'DEC', val: 58 },
    { month: 'JAN', val: 84 },
    { month: 'FEB', val: 76 },
    { month: 'MAR', val: 92 },
];

export function EarningsIntel() {
    return (
        <div className="py-8 pb-24 space-y-5" style={{ color: 'var(--nexus-text)' }}>

            {/* ── 01 REVENUE PERFORMANCE ── */}
            <section>
                <div
                    className="rounded-2xl overflow-hidden flex flex-col border"
                    style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)' }}
                >
                    {/* Header row with accent border */}
                    <div
                        className="px-6 md:px-10 py-5 flex items-center border-b"
                        style={{
                            borderColor: 'var(--nexus-accent)',
                            background: 'color-mix(in srgb, var(--nexus-accent) 5%, transparent)'
                        }}
                    >
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--nexus-text)' }}>
                            01 // REVENUE PERFORMANCE
                        </p>
                    </div>

                    <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-10">
                        {/* Bar Chart */}
                        <div className="flex-1 flex items-end justify-between h-[180px] md:h-[220px] px-2 mb-4 md:mb-0">
                            {chartData.map((d) => (
                                <div key={d.month} className="flex flex-col items-center gap-3 group h-full">
                                    <div
                                        className="relative w-9 md:w-11 rounded-lg overflow-hidden flex-1 flex items-end border"
                                        style={{
                                            background: 'color-mix(in srgb, var(--nexus-bg) 70%, transparent)',
                                            borderColor: 'color-mix(in srgb, var(--nexus-border) 60%, transparent)'
                                        }}
                                    >
                                        <div
                                            style={{ height: `${d.val}%`, background: 'var(--nexus-accent)', transition: 'height 0.5s ease' }}
                                            className="w-full"
                                        />
                                    </div>
                                    <span
                                        className="font-mono text-[8px] md:text-[10px] uppercase tracking-[0.15em] font-black"
                                        style={{ color: 'var(--nexus-text-muted)' }}
                                    >
                                        {d.month}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Stat Cards */}
                        <div className="w-full md:w-[300px] grid grid-cols-2 gap-3">
                            {stats.map((s) => (
                                <div
                                    key={s.label}
                                    className="p-4 md:p-5 rounded-xl border transition-all duration-200"
                                    style={{
                                        background: 'color-mix(in srgb, var(--nexus-bg) 60%, transparent)',
                                        borderColor: 'var(--nexus-border)'
                                    }}
                                >
                                    <p className="font-mono text-[8px] uppercase tracking-widest mb-2" style={{ color: 'var(--nexus-text-muted)' }}>
                                        {s.label}
                                    </p>
                                    <div className="flex items-baseline gap-2 flex-wrap">
                                        <span className="font-sans font-black text-base md:text-lg uppercase tracking-tight" style={{ color: 'var(--nexus-text)' }}>
                                            {s.value}
                                        </span>
                                        <span className="font-mono text-[8px] uppercase font-bold" style={{ color: 'var(--nexus-accent)' }}>
                                            {s.trend}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 02 PAYOUT HISTORY ── */}
            <section>
                <div
                    className="rounded-2xl overflow-hidden flex flex-col border"
                    style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)' }}
                >
                    <div
                        className="px-6 md:px-10 py-5 flex items-center border-b"
                        style={{
                            borderColor: 'var(--nexus-accent)',
                            background: 'color-mix(in srgb, var(--nexus-accent) 5%, transparent)'
                        }}
                    >
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--nexus-text)' }}>
                            02 // PAYOUT HISTORY
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="min-w-[580px]">
                            {history.map((pay, i) => (
                                <div
                                    key={pay.id}
                                    className="px-6 md:px-10 py-5 flex items-center justify-between border-b transition-all duration-200"
                                    style={{ borderColor: i === history.length - 1 ? 'transparent' : 'var(--nexus-border)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--nexus-accent) 5%, transparent)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div className="flex items-center gap-5 md:gap-8">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] italic shrink-0 border-2"
                                            style={{
                                                background: 'var(--nexus-text)',
                                                color: 'var(--nexus-panel)',
                                                borderColor: 'var(--nexus-border)'
                                            }}
                                        >
                                            RK
                                        </div>
                                        <div>
                                            <h4 className="font-mono text-[11px] font-black uppercase tracking-tighter mb-1" style={{ color: 'var(--nexus-text)' }}>
                                                {pay.amount} · {pay.type}
                                            </h4>
                                            <p className="font-mono text-[8px] uppercase tracking-[0.2em]" style={{ color: 'var(--nexus-text-muted)' }}>
                                                {pay.date} {"//"} ID_{pay.id}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`font-mono text-[8px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${
                                            pay.status === 'SETTLED'
                                                ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
                                                : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                                        }`}
                                    >
                                        {pay.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

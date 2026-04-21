import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bell, Zap, Globe2, Shield, BarChart2, Code2, Workflow,
  ArrowRight, CheckCircle, Copy, CheckCircle2, Terminal,
  TrendingUp, Users, Lock
} from 'lucide-react';
import { Footer } from '../../components/home/Footer';

// ─────────────────────────────────────────
// SECTION 1: HERO
// ─────────────────────────────────────────
const FeaturesHero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section ref={ref} className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-20 px-[clamp(1.5rem,5vw,4rem)] overflow-hidden bg-black text-white text-center">
      <div className="absolute inset-0 blueprint-grid opacity-[0.04] pointer-events-none z-0" />
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[50vh] bg-[#afff00]/8 blur-[150px]" />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#afff00] animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/70">Platform Capabilities</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-black text-[clamp(3rem,8vw,7rem)] leading-[0.92] uppercase tracking-tighter mb-8"
        >
          Built For<br />
          <span className="text-[#afff00] drop-shadow-[0_0_30px_rgba(175,255,0,0.35)]">Streamers.</span><br />
          <span className="text-zinc-600">Loved By Devs.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-mono text-[clamp(11px,1.4vw,15px)] leading-[1.8] tracking-wider text-zinc-400 max-w-2xl mb-12"
        >
          Instant OBS alerts. Lowest commission. Real-time settlements. One SDK.
          Everything you need to monetise your stream without friction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            to="/signup"
            id="features-hero-cta"
            className="group px-10 py-5 bg-[#afff00] text-black font-black uppercase text-[12px] tracking-[0.2em] rounded-xl flex items-center gap-3 hover:scale-[1.03] shadow-[0_0_30px_rgba(175,255,0,0.2)] active:scale-95 transition-all"
          >
            Start Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/pricing"
            className="group px-10 py-5 border border-white/10 hover:border-white/25 text-white font-bold uppercase text-[12px] tracking-[0.2em] rounded-xl flex items-center gap-3 transition-all"
          >
            View Pricing
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────
// SECTION 2: CORE FEATURE DEEP DIVES (Tabbed)
// ─────────────────────────────────────────
const FEATURE_TABS = [
  {
    id: 'alerts',
    icon: Bell,
    label: 'Live Alerts',
    accent: '#afff00',
    headline: 'OBS Overlay Fires in Under 1 Second',
    desc: 'The moment a payment clears, Droppay fires a customisable alert to your OBS overlay — with donor name, amount, currency, and message. Your stream reacts before your viewer even sees the "thank you" page.',
    bullets: [
      'Custom sound & animation per tier',
      'Works with OBS, Streamlabs, XSplit',
      'Multi-platform: Twitch, YouTube, Kick',
      'Queue manager for bulk donations',
    ],
    visual: <AlertVisual />,
  },
  {
    id: 'payouts',
    icon: Zap,
    label: 'Instant Payouts',
    accent: '#60a5fa',
    headline: 'Money Lands the Same Session',
    desc: 'Forget T+2 holds. Droppay settles your earnings in real-time — no waiting for end-of-day bank runs. Every donation processes, routes, and clears while you\'re still live.',
    bullets: [
      'Same-session settlement',
      'Supports UPI, bank transfer, wallets',
      'Zero holding period',
      'Instant confirmation webhook',
    ],
    visual: <PayoutVisual />,
  },
  {
    id: 'global',
    icon: Globe2,
    label: 'Global Payments',
    accent: '#f472b6',
    headline: 'Accept From 150+ Countries',
    desc: 'Your viewer in Brazil, Japan, or Germany pays in their local currency. You receive in yours. Droppay auto-converts at live interbank rates — no FX headaches, no extra setup.',
    bullets: [
      '150+ countries supported',
      'Auto FX conversion at live rates',
      '200+ local payment methods',
      'Regional compliance handled',
    ],
    visual: <GlobalVisual />,
  },
  {
    id: 'analytics',
    icon: BarChart2,
    label: 'Analytics',
    accent: '#34d399',
    headline: 'Know Exactly What Drives Your Revenue',
    desc: 'Live engagement heatmaps, per-stream revenue tracking, top supporter leaderboards, and payout forecasts — all updating in real-time while you play.',
    bullets: [
      'Revenue by stream session',
      'Top supporter leaderboard',
      'Peak engagement time mapping',
      'Exportable CSV reports',
    ],
    visual: <AnalyticsVisual />,
  },
];

// Visual sub-components for each tab
function AlertVisual() {
  const alerts = [
    { user: 'NightOwl_Dev', amount: '$25', msg: '🔥 Let\'s go!', color: '#9146FF' },
    { user: 'xSakura99', amount: '$50', msg: 'First timer!', color: '#FF0000' },
    { user: 'CodeWithKai', amount: '$10', msg: '❤️ Amazing', color: '#53FC18' },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % alerts.length), 2500);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      {/* OBS window frame */}
      <div className="rounded-xl border border-white/10 bg-[#111] overflow-hidden">
        <div className="h-8 bg-[#0a0a0a] border-b border-white/5 flex items-center px-3 gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500/70" />
          <div className="w-2 h-2 rounded-full bg-amber-500/70" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
          <span className="font-mono text-[8px] text-zinc-600 ml-2 uppercase tracking-widest">OBS Studio — Live</span>
          <span className="ml-auto flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-mono text-[7px] text-rose-400">REC</span>
          </span>
        </div>
        <div className="p-4 bg-zinc-900 min-h-[120px] flex items-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-black/80 border border-white/10 backdrop-blur-md"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: `${alerts[idx].color}20`, border: `1px solid ${alerts[idx].color}40` }}>
                💰
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: alerts[idx].color }} />
                  <span className="font-sans font-black text-xs text-white">{alerts[idx].user}</span>
                  <span className="font-mono text-[10px] text-[#afff00] ml-auto font-black">{alerts[idx].amount}</span>
                </div>
                <p className="font-mono text-[9px] text-zinc-400 mt-0.5 truncate">{alerts[idx].msg}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        {alerts.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === idx ? 'w-6 bg-[#afff00]' : 'w-2 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
}

function PayoutVisual() {
  const [triggered, setTriggered] = useState(false);
  const [step, setStep] = useState(0);

  const runFlow = () => {
    setTriggered(true);
    setStep(0);
    const timings = [600, 1200, 2000];
    timings.forEach((t, i) => setTimeout(() => setStep(i + 1), t));
    setTimeout(() => { setTriggered(false); setStep(0); }, 4000);
  };

  const steps = [
    { label: 'Payment received', done: step >= 1 },
    { label: 'Routing verified', done: step >= 2 },
    { label: 'Funds settled ✓', done: step >= 3 },
  ];

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <div className="rounded-xl border border-white/10 bg-[#111] p-5 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Payout Flow</span>
          <span className={`font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${step === 3 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-white/10 text-zinc-600'}`}>
            {step === 3 ? 'Settled' : 'Pending'}
          </span>
        </div>
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <motion.div
              animate={{ borderColor: s.done ? '#34d399' : 'rgba(255,255,255,0.1)', backgroundColor: s.done ? '#34d39920' : 'transparent' }}
              className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors"
            >
              {s.done && <CheckCircle className="w-3 h-3 text-emerald-400" />}
            </motion.div>
            <span className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${s.done ? 'text-white' : 'text-zinc-600'}`}>{s.label}</span>
            {i === 2 && s.done && <span className="ml-auto font-black text-emerald-400 text-sm">+$50.00</span>}
          </div>
        ))}
      </div>
      <button
        onClick={runFlow}
        disabled={triggered}
        className="w-full py-3 bg-[#60a5fa]/10 border border-[#60a5fa]/30 text-[#60a5fa] font-mono text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#60a5fa]/20 transition-all disabled:opacity-40"
      >
        {triggered ? 'Processing…' : '▶ Simulate Payout'}
      </button>
    </div>
  );
}

function GlobalVisual() {
  const nodes = [
    { label: 'IN', x: '25%', y: '55%', color: '#afff00' },
    { label: 'US', x: '20%', y: '35%', color: '#60a5fa' },
    { label: 'EU', x: '52%', y: '28%', color: '#f472b6' },
    { label: 'SG', x: '76%', y: '58%', color: '#34d399' },
    { label: 'BR', x: '32%', y: '72%', color: '#fb923c' },
    { label: 'JP', x: '82%', y: '38%', color: '#a78bfa' },
  ];
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative w-full aspect-video rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-[0.04] pointer-events-none" />
        {nodes.map((n, i) => (
          <motion.div
            key={n.label}
            className="absolute flex flex-col items-center gap-1"
            style={{ left: n.x, top: n.y, transform: 'translate(-50%,-50%)' }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
          >
            <motion.div
              animate={{ boxShadow: [`0 0 0px ${n.color}`, `0 0 12px ${n.color}60`, `0 0 0px ${n.color}`] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              className="w-3 h-3 rounded-full"
              style={{ background: n.color }}
            />
            <span className="font-mono text-[7px] uppercase tracking-widest" style={{ color: n.color }}>{n.label}</span>
          </motion.div>
        ))}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans font-black text-xl text-white">150+</span>
            <span className="font-mono text-[7px] text-zinc-600 uppercase tracking-widest">Countries</span>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col">
            <span className="font-sans font-black text-xl text-[#f472b6]">200+</span>
            <span className="font-mono text-[7px] text-zinc-600 uppercase tracking-widest">Pay Methods</span>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col">
            <span className="font-sans font-black text-xl text-[#34d399]">Live</span>
            <span className="font-mono text-[7px] text-zinc-600 uppercase tracking-widest">FX Rates</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsVisual() {
  const bars = [0.4, 0.6, 0.5, 0.8, 0.7, 0.95, 1, 0.85, 0.9, 0.75, 0.6, 0.8];
  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      <div className="rounded-xl border border-white/10 bg-[#111] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block mb-1">Tonight's Revenue</span>
            <span className="font-sans font-black text-2xl text-white">$1,842.50</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="font-mono text-[8px] text-emerald-400">+24%</span>
          </div>
        </div>
        <div className="flex items-end gap-1 h-16">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-[#34d399] to-[#34d399]/60"
              initial={{ height: 0 }}
              whileInView={{ height: `${h * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-mono text-[7px] text-zinc-700">12 AM</span>
          <span className="font-mono text-[7px] text-zinc-700">Now</span>
        </div>
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-zinc-500" />
            <span className="font-mono text-[9px] text-zinc-400">248 unique donors</span>
          </div>
          <span className="font-mono text-[9px] text-[#34d399]">Top: xSakura — $100</span>
        </div>
      </div>
    </div>
  );
}

const FeatureTabSection = () => {
  const [active, setActive] = useState(0);
  const tab = FEATURE_TABS[active];
  const AccentIcon = tab.icon;

  return (
    <section className="bg-[#050505] text-white px-[clamp(1.5rem,5vw,4rem)] py-24 md:py-32 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#afff00] mb-4 block">Core Features</span>
          <h2 className="font-black text-[clamp(2.2rem,5vw,4rem)] uppercase tracking-tighter leading-[0.95] text-white">
            Every Tool <span className="text-zinc-600">You Need.</span>
          </h2>
        </motion.div>

        {/* Tab pills */}
        <div className="flex flex-wrap gap-3 mb-14">
          {FEATURE_TABS.map((t, i) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-[9px] uppercase tracking-widest border transition-all duration-300"
                style={{
                  borderColor: active === i ? `${t.accent}50` : 'rgba(255,255,255,0.08)',
                  background: active === i ? `${t.accent}12` : 'transparent',
                  color: active === i ? t.accent : 'rgba(255,255,255,0.4)',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left: text */}
            <div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center border mb-6"
                style={{ borderColor: `${tab.accent}30`, background: `${tab.accent}10` }}
              >
                <AccentIcon className="w-5 h-5" style={{ color: tab.accent }} />
              </div>
              <h3 className="font-black text-[clamp(1.6rem,3vw,2.5rem)] uppercase tracking-tighter text-white leading-tight mb-5">
                {tab.headline}
              </h3>
              <p className="font-mono text-[12px] leading-[1.9] tracking-wider text-zinc-400 mb-8 max-w-lg">
                {tab.desc}
              </p>
              <ul className="space-y-3">
                {tab.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: tab.accent }} />
                    <span className="font-mono text-[11px] text-zinc-300 uppercase tracking-wider">{b}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right: visual */}
            <div className="flex items-center justify-center">
              {tab.visual}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};


const DeveloperSection = () => {
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState([
    { uid: '1', method: 'POST', endpoint: '/v1/alerts/fire', status: 200, ms: 11 },
    { uid: '2', method: 'GET', endpoint: '/v1/streams/status', status: 200, ms: 7 },
    { uid: '3', method: 'POST', endpoint: '/v1/payouts/settle', status: 201, ms: 18 },
  ]);

  useEffect(() => {
    const endpoints = ['/v1/alerts/fire', '/v1/webhooks/events', '/v1/payouts/settle', '/v1/streams/donors'];
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [{
          uid: `log-${Date.now()}`,
          method: Math.random() > 0.4 ? 'POST' : 'GET',
          endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
          status: 200,
          ms: Math.floor(Math.random() * 25) + 5,
        }, ...prev.slice(0, 3)];
        return next;
      });
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const copy = () => {
    navigator.clipboard.writeText('npm install @droppay/node-sdk');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-black text-white px-[clamp(1.5rem,5vw,4rem)] py-24 md:py-32 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">

        {/* Left copy */}
        <div className="flex-1 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#afff00] mb-4 block">Developer Integration</span>
            <h2 className="font-black text-[clamp(2.2rem,4.5vw,3.8rem)] uppercase tracking-tighter leading-[0.95] text-white mb-6">
              One SDK.<br /><span className="text-zinc-600">Full Control.</span>
            </h2>
            <p className="font-mono text-[12px] leading-[1.9] tracking-wider text-zinc-400 mb-8">
              Drop-in Node SDK, full REST API, and granular webhooks. Integrate Droppay into your stack in under 10 minutes — and trigger stream alerts from your own backend.
            </p>
            <div className="space-y-5">
              {[
                { icon: Code2, label: 'REST API', desc: 'Full programmatic access to all resources', color: '#afff00' },
                { icon: Workflow, label: 'Webhooks', desc: 'Sub-40ms event delivery on every lifecycle', color: '#60a5fa' },
                { icon: Terminal, label: 'Node SDK', desc: 'Type-safe client with built-in retry logic', color: '#f472b6' },
                { icon: Lock, label: 'Zero-Trust Auth', desc: 'Signed requests, IP whitelisting, scope controls', color: '#34d399' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg border flex items-center justify-center shrink-0" style={{ borderColor: `${item.color}25`, background: `${item.color}10` }}>
                      <Icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div>
                      <h4 className="font-sans font-black text-sm uppercase tracking-tight text-white mb-0.5">{item.label}</h4>
                      <p className="font-mono text-[9px] text-zinc-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right: code terminal */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] overflow-hidden shadow-2xl">
            {/* Window bar */}
            <div className="h-10 bg-[#111] border-b border-white/5 flex items-center px-4 gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              <div className="flex items-center gap-1.5 ml-3">
                <Terminal className="w-3 h-3 text-zinc-600" />
                <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">droppay_sdk.js</span>
              </div>
              <button onClick={copy} className="ml-auto p-1.5 rounded hover:bg-white/5 transition-colors">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#afff00]" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
              </button>
            </div>

            {/* Code */}
            <pre className="p-6 font-mono text-[10px] leading-[1.9] overflow-x-auto whitespace-pre text-zinc-300">
              <span className="text-zinc-600">{'// 1. Install'}</span>{'\n'}
              <span className="text-[#afff00]">$</span>{' npm install @droppay/node-sdk\n\n'}
              <span className="text-zinc-600">{'// 2. Initialize'}</span>{'\n'}
              <span className="text-blue-400">import</span>{' { Droppay } '}
              <span className="text-blue-400">from</span>{' '}
              <span className="text-amber-300">'@droppay/node-sdk'</span>{'\n'}
              <span className="text-blue-400">const</span>{' dp = '}
              <span className="text-blue-400">new</span>{' '}
              <span className="text-emerald-300">Droppay</span>
              {'({ apiKey: '}
              <span className="text-amber-300">'sk_live_...'</span>
              {' });\n\n'}
              <span className="text-zinc-600">{'// 3. Fire alert on donation'}</span>{'\n'}
              {'dp.alerts.'}
              <span className="text-emerald-300">fire</span>
              {'({\n  streamId: '}
              <span className="text-amber-300">'stream_abc123'</span>
              {',\n  donor: '}
              <span className="text-amber-300">'xSakura99'</span>
              {',\n  amount: '}
              <span className="text-amber-400">5000</span>
              {',\n  message: '}
              <span className="text-amber-300">'Let\'s go! 🔥'</span>
              {',\n});\n'}
            </pre>

            {/* Live log */}
            <div className="border-t border-white/5 px-6 py-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Live Telemetry</span>
              </div>
              <div className="space-y-1.5">
                <AnimatePresence initial={false}>
                  {logs.map(log => (
                    <motion.div
                      key={log.uid}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-4 font-mono text-[9px]"
                    >
                      <span className={log.method === 'POST' ? 'text-blue-400' : 'text-purple-400'}>{log.method}</span>
                      <span className="text-zinc-400 flex-1 truncate">{log.endpoint}</span>
                      <span className="text-emerald-400">{log.status}</span>
                      <span className="text-zinc-600">{log.ms}ms</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────
// SECTION 4: SECURITY & COMPLIANCE
// ─────────────────────────────────────────
const SECURITY_ITEMS = [
  { icon: Shield, title: 'Zero-Trust Auth', desc: 'Every API call is HMAC-signed. IP whitelisting and scope-limited keys prevent overprivileged access.', color: '#34d399' },
  { icon: Lock, title: 'PCI-DSS Level 1', desc: 'Droppay is fully PCI-DSS Level 1 certified. Card data never touches your server — or ours.', color: '#60a5fa' },
  { icon: Shield, title: 'ML Fraud Engine', desc: '150+ signals evaluated per transaction in real-time. Suspicious patterns are flagged before authorization.', color: '#f472b6' },
  { icon: CheckCircle, title: 'Instant KYC/AML', desc: 'Automated identity verification and AML screening built into every payout — no manual compliance burden.', color: '#afff00' },
];

const SecuritySection = () => (
  <section className="bg-[#050505] text-white px-[clamp(1.5rem,5vw,4rem)] py-24 md:py-32 border-t border-white/5">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        {/* Left */}
        <div className="flex-1 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#afff00] mb-4 block">Security</span>
            <h2 className="font-black text-[clamp(2.2rem,4.5vw,3.8rem)] uppercase tracking-tighter leading-[0.95] text-white mb-6">
              Military-Grade.<br /><span className="text-zinc-600">Streamer-Simple.</span>
            </h2>
            <p className="font-mono text-[12px] leading-[1.9] tracking-wider text-zinc-400">
              Enterprise-level compliance under the hood — zero config on your end. You focus on the stream. We handle the shield.
            </p>
          </motion.div>
        </div>

        {/* Right: 4 cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SECURITY_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-[#0c0c0c] border border-white/5 hover:border-white/10 p-6 rounded-2xl flex flex-col gap-4 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{ borderColor: `${item.color}25`, background: `${item.color}10` }}
                >
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div>
                  <h4 className="font-sans font-black text-sm uppercase tracking-tight text-white mb-2">{item.title}</h4>
                  <p className="font-mono text-[9px] leading-relaxed text-zinc-500">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────
// SECTION 5: FINAL CTA
// ─────────────────────────────────────────
const FeaturesCTA = () => (
  <section className="bg-black text-white px-[clamp(1.5rem,5vw,4rem)] py-24 border-t border-white/5 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] bg-[#afff00]/5 blur-[120px] rounded-full" />
    </div>
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#afff00] mb-6 block">Ready to go live?</span>
        <h2 className="font-black text-[clamp(2.5rem,6vw,5rem)] uppercase tracking-tighter leading-[0.95] text-white mb-6">
          5 Minutes to<br />
          <span className="text-[#afff00]">Your First Alert.</span>
        </h2>
        <p className="font-mono text-[12px] leading-[1.8] tracking-wider text-zinc-400 max-w-xl mx-auto mb-12">
          Sign up free. Connect your stream. Set your commission widget. Go live. That's it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            to="/signup"
            id="features-bottom-cta"
            className="group px-12 py-5 bg-[#afff00] text-black font-black uppercase text-[12px] tracking-[0.2em] rounded-xl flex items-center gap-3 hover:scale-[1.03] shadow-[0_0_40px_rgba(175,255,0,0.2)] active:scale-95 transition-all"
          >
            Start Earning Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/pricing"
            className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors underline underline-offset-4"
          >
            Compare Plans →
          </Link>
        </div>
        <p className="font-mono text-[9px] text-zinc-600 mt-6 uppercase tracking-widest">
          Free plan · 2.5% on growth · No setup fee
        </p>
      </motion.div>
    </div>
  </section>
);

// ─────────────────────────────────────────
// PAGE ASSEMBLY
// ─────────────────────────────────────────
const Features = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-black text-white overflow-x-hidden min-h-screen">
      <main ref={scrollRef} className="w-full relative z-10">
        {/* 1. Hero */}
        <FeaturesHero />

        {/* 2. Tabbed feature deep-dives */}
        <FeatureTabSection />

        {/* 3. Developer API block */}
        <DeveloperSection />

        {/* 4. Security & compliance */}
        <SecuritySection />

        {/* 5. Final CTA */}
        <FeaturesCTA />

        {/* 6. Footer (shared with homepage) */}
        <Footer containerRef={scrollRef} />
      </main>
    </div>
  );
};

export default Features;

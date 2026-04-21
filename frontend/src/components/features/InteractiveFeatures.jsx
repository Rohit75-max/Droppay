import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Shield, Zap, Workflow, Bell } from 'lucide-react';

// ─────────────────────────────────────────
// ANIMATED NETWORK GLOBE (Card 1 Visual)
// ─────────────────────────────────────────
const GlobeVisual = () => {
  const nodes = [
    { x: 20, y: 30, label: 'IN', delay: 0 },
    { x: 75, y: 20, label: 'US', delay: 0.3 },
    { x: 85, y: 60, label: 'EU', delay: 0.6 },
    { x: 50, y: 75, label: 'SG', delay: 0.9 },
    { x: 15, y: 65, label: 'BR', delay: 1.2 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Connection lines */}
        {nodes.map((n, i) =>
          nodes.slice(i + 1).map((m, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={n.x} y1={n.y} x2={m.x} y2={m.y}
              stroke="#afff00" strokeWidth="0.3" strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: n.delay }}
            />
          ))
        )}
      </svg>
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute flex flex-col items-center"
          style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%,-50%)' }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: node.delay }}
        >
          <div className="w-2 h-2 rounded-full bg-[#afff00] shadow-[0_0_8px_#afff00]" />
          <span className="font-mono text-[6px] text-[#afff00]/70 mt-1 tracking-widest">{node.label}</span>
        </motion.div>
      ))}
      {/* Animated packet travelling */}
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_white]"
        animate={{
          left: ['20%', '75%', '85%', '50%', '15%', '20%'],
          top: ['30%', '20%', '60%', '75%', '65%', '30%'],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

const WEBHOOK_EVENTS = ['payment.created', 'alert.fired', 'payout.settled', 'stream.active'];

const WebhookVisual = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % WEBHOOK_EVENTS.length), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1.5 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {WEBHOOK_EVENTS.slice(0, 3).map((ev, i) => (
          <motion.div
            key={`${ev}-${active}`}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: i === 0 ? 1 : 0.4, x: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? 'bg-[#afff00] shadow-[0_0_6px_#afff00]' : 'bg-zinc-700'}`} />
            <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest truncate">{ev}</span>
            {i === 0 && <span className="font-mono text-[7px] text-[#afff00] ml-auto shrink-0">38ms</span>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────
// SHIELD RADAR (Card 3 — Security)
// ─────────────────────────────────────────
const ShieldRadar = () => {
  const rings = [1, 2, 3];
  return (
    <div className="relative w-full h-32 flex items-center justify-center mb-4">
      {rings.map((r) => (
        <motion.div
          key={r}
          className="absolute rounded-full border border-emerald-500/20"
          style={{ width: `${r * 28}%`, height: `${r * 28}%` }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: r * 0.4 }}
        />
      ))}
      {/* Rotating sweep line */}
      <motion.div
        className="absolute w-[42%] h-[1px] origin-left"
        style={{
          left: '50%', top: '50%',
          background: 'linear-gradient(to right, #34d399, transparent)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399] z-10" />
      {/* Random threat blips */}
      {[{ x: 30, y: 20 }, { x: 65, y: 70 }].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-rose-500"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.9 }}
        />
      ))}
    </div>
  );
};

const ALERT_STEPS = [
  { label: 'Viewer pays', icon: '💳', color: '#9146FF' },
  { label: 'Droppay routes', icon: '⚡', color: '#afff00' },
  { label: 'Alert fires', icon: '🔔', color: '#f472b6' },
  { label: 'You get paid', icon: '💰', color: '#34d399' },
];

const AlertFlowDemo = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep(p => (p + 1) % ALERT_STEPS.length), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-0 w-full">
      {ALERT_STEPS.map((s, i) => (
        <React.Fragment key={i}>
          <motion.div
            animate={{
              scale: i === step ? 1.08 : 1,
              opacity: i <= step ? 1 : 0.3,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex flex-col items-center gap-1.5 flex-1"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base border transition-all"
              style={{
                borderColor: i === step ? `${s.color}60` : 'rgba(255,255,255,0.05)',
                background: i === step ? `${s.color}15` : 'rgba(255,255,255,0.02)',
                boxShadow: i === step ? `0 0 15px ${s.color}30` : 'none',
              }}
            >
              {s.icon}
            </div>
            <span className="font-mono text-[7px] text-zinc-500 uppercase tracking-widest text-center leading-tight">
              {s.label}
            </span>
          </motion.div>
          {i < ALERT_STEPS.length - 1 && (
            <motion.div
              className="h-[1px] flex-1 mx-1"
              animate={{ background: i < step ? '#afff00' : 'rgba(255,255,255,0.07)' }}
              transition={{ duration: 0.4 }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export const InteractiveFeatures = React.forwardRef(({ disableTheme, ...props }, ref) => {
  return (
    <section
      id="capabilities"
      ref={ref}
      {...(!disableTheme ? { 'data-navbar-theme': 'dark' } : {})}
      className="bg-[#050505] text-white flex flex-col justify-center py-24 md:py-32 px-[clamp(1.5rem,5vw,4rem)] relative z-20 overflow-hidden border-t border-white/5"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-[#afff00]/[0.025] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col">
        {/* Header */}
        <header className="mb-16 flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#afff00] mb-4 block"
          >
            Platform Architecture
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(2.2rem,6vw,4.5rem)] font-black tracking-tighter uppercase leading-[0.95] text-white"
          >
            Built to Run <span className="text-[#afff00]">Live.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-mono text-[clamp(10px,1.2vw,13px)] text-zinc-500 tracking-wider max-w-lg mt-4"
          >
            Every layer of Droppay is engineered for zero-latency. Here's what's running under the hood.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: '80px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-[1px] bg-gradient-to-r from-[#afff00] to-transparent mt-8"
          />
        </header>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[260px] md:auto-rows-[280px]">

          {/* CARD 1: Global Routing — Large, Live Globe */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2 lg:col-span-2 rounded-3xl bg-[#0C0C0C] border border-white/5 relative overflow-hidden group p-8 flex flex-col justify-between hover:border-[#afff00]/20 transition-all duration-500"
          >
            <GlobeVisual />
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#afff00]/5 blur-[50px] group-hover:bg-[#afff00]/10 transition-colors duration-700 rounded-full -mr-16 -mt-16 pointer-events-none" />
            <div className="w-11 h-11 rounded-xl bg-[#afff00]/10 border border-[#afff00]/20 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500">
              <Globe2 className="w-5 h-5 text-[#afff00]" />
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-white mb-2">Global Routing</h3>
              <p className="font-mono text-[11px] leading-relaxed tracking-wide text-zinc-400 max-w-xs">
                Live payment routing across 150+ countries. Local gateways, highest approval rates, zero extra config.
              </p>
            </div>
          </motion.div>

          {/* CARD 2: Real-Time Webhooks — live event log */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="col-span-1 md:col-span-1 lg:col-span-2 rounded-3xl bg-[#0C0C0C] border border-white/5 relative overflow-hidden group p-8 flex flex-col justify-between hover:border-white/10 transition-all duration-500"
          >
            <WebhookVisual />
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative z-10 mb-4 group-hover:scale-110 transition-transform duration-500">
              <Workflow className="w-5 h-5 text-white/80" />
            </div>
            <div className="relative z-10">
              <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-white mb-2">Real-Time Webhooks</h3>
              <p className="font-mono text-[11px] leading-relaxed tracking-wide text-zinc-400">
                Events fire in under 40ms. Your system stays perfectly in sync with every payment lifecycle.
              </p>
            </div>
          </motion.div>

          {/* CARD 3: Security Shield — Radar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="col-span-1 md:col-span-2 lg:col-span-1 md:row-span-2 rounded-3xl bg-[#0C0C0C] border border-emerald-500/10 relative overflow-hidden group p-8 flex flex-col hover:border-emerald-500/25 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative z-10 mb-6 group-hover:rotate-12 transition-transform duration-500">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <ShieldRadar />
              {/* Threat counter */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="font-sans font-black text-xl text-white">0</span>
                  <span className="font-mono text-[7px] text-zinc-600 uppercase tracking-widest">Breaches</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-sans font-black text-xl text-emerald-400">Active</span>
                  <span className="font-mono text-[7px] text-zinc-600 uppercase tracking-widest">Shield</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-auto">
              <h3 className="font-sans font-black text-xl uppercase tracking-tight text-white mb-2">Zero-Trust Shield</h3>
              <p className="font-mono text-[10px] leading-relaxed tracking-wide text-zinc-400">
                Military-grade telemetry isolates fraud before it hits your ledger.
              </p>
            </div>
          </motion.div>

          {/* CARD 4: Instant Payouts */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="col-span-1 md:col-span-1 lg:col-span-1 rounded-3xl bg-[#0C0C0C] border border-amber-500/10 relative overflow-hidden group p-8 flex flex-col justify-between hover:border-amber-500/25 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center relative z-10 group-hover:-translate-y-1 transition-transform duration-500">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            {/* Speed indicator */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.04, 1], boxShadow: ['0 0 0px #f59e0b', '0 0 20px #f59e0b50', '0 0 0px #f59e0b'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center"
              >
                <span className="font-sans font-black text-xl text-amber-400">⚡</span>
              </motion.div>
              <span className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest mt-3">same session</span>
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="font-sans font-black text-xl uppercase tracking-tight text-white mb-2">Instant Payouts</h3>
              <p className="font-mono text-[10px] leading-relaxed tracking-wide text-zinc-400">
                Funds hit your bank the same session. No holds, no waiting.
              </p>
            </div>
          </motion.div>

          {/* CARD 5: Alert Flow — full width accent */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="col-span-1 md:col-span-3 lg:col-span-2 rounded-3xl bg-gradient-to-br from-[#afff00] to-[#8fd600] border border-[#afff00] relative overflow-hidden group p-8 flex flex-col justify-between shadow-[0_0_60px_rgba(175,255,0,0.08)] hover:shadow-[0_0_80px_rgba(175,255,0,0.15)] transition-all duration-500"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex items-start gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-black/15 border border-black/10 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-black mb-1">Live Alert Engine</h3>
                <p className="font-mono text-[11px] leading-relaxed tracking-wide text-black/60">
                  Payment → OBS alert in under 1 second. Every stream, every time.
                </p>
              </div>
            </div>
            <div className="relative z-10">
              <AlertFlowDemo />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
});

InteractiveFeatures.displayName = 'InteractiveFeatures';

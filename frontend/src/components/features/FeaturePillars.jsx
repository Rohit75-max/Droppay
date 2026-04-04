import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, ArrowRight } from 'lucide-react';

// ─────────────────────────────────────────────
// Card 1: SUPERALERT ENGINE — 3D Alert Demo
// ─────────────────────────────────────────────
const SuperalertCard = () => {
  const [triggered, setTriggered] = useState(false);

  return (
    <motion.div
      className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col justify-between overflow-hidden cursor-pointer group md:h-full"
      onHoverStart={() => setTriggered(true)}
      onHoverEnd={() => setTriggered(false)}
      onTapStart={() => setTriggered(true)}
      onTap={() => setTimeout(() => setTriggered(false), 1800)}
      whileHover={{ borderColor: 'rgba(175,255,0,0.3)', boxShadow: '0 0 30px rgba(175,255,0,0.05)' }}
    >
      {/* Background grid glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_0%,#afff00,transparent_70%)] pointer-events-none" />

      {/* Headline + Icon inline */}
      <div className="relative z-10 mt-auto">
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <motion.div
            animate={triggered ? { rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-[#afff00] shrink-0" />
          </motion.div>
          <h3 className="text-lg md:text-3xl font-black uppercase tracking-tighter text-white leading-none">
            SUB-SECOND SUPERALERTS.
          </h3>
        </div>
        <p className="text-white/50 text-[10px] md:text-sm leading-relaxed">
          Your chat moves fast; your alerts should too. Trigger high-fidelity animations the exact millisecond a donation drops.
        </p>
      </div>

      {/* VSM: The Floating Alert Demo */}
      <AnimatePresence>
        {triggered && (
          <motion.div
            key="alert-bubble"
            initial={{ scale: 0.5, opacity: 0, y: 20, rotateX: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="absolute top-6 right-6 bg-[#afff00] text-black rounded-2xl px-4 py-3 shadow-[0_0_30px_rgba(175,255,0,0.5)] z-20"
            style={{ transformPerspective: 600 }}
          >
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">New Support!</p>
            <p className="text-sm font-black uppercase tracking-tight leading-tight">
              🔥 JAY tipped <span className="text-lg">$20</span>
            </p>
            <motion.div
              className="absolute -bottom-1 left-4 w-3 h-3 bg-[#afff00] rotate-45"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle state: latency marker */}
      {!triggered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-6 right-6 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 z-10"
        >
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#afff00] rounded-full shadow-[0_0_6px_#afff00]"
          />
          <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">
            Hover to fire
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Card 2: KEEP YOUR MONEY — Earnings Toggle
// ─────────────────────────────────────────────
const EarningsCard = () => {
  const [isDrope, setIsDrope] = useState(false);
  const TWITCH_KEEP = 35;
  const DROPE_KEEP = 92;
  const amount = 100;
  const keep = isDrope ? DROPE_KEEP : TWITCH_KEEP;
  const lost = amount - keep;

  return (
    <motion.div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col justify-between overflow-hidden md:h-full">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_100%,#afff00,transparent_70%)] pointer-events-none" />

      {/* Headline + Toggle inline */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg md:text-3xl font-black uppercase tracking-tighter text-white leading-none">
            FAIR PLAY<br />COMMISSIONS.
          </h3>
          {/* Toggle — right of heading */}
          <button
            onClick={() => setIsDrope(!isDrope)}
            className={`relative w-14 h-7 shrink-0 rounded-full transition-all duration-300 border mt-1 ${isDrope ? 'bg-[#afff00] border-[#afff00]' : 'bg-white/10 border-white/20'}`}
          >
            <motion.div
              animate={{ x: isDrope ? 28 : 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`absolute top-1 w-5 h-5 rounded-full shadow-md ${isDrope ? 'bg-black' : 'bg-white'}`}
            />
          </button>
        </div>
        <p className="text-white/50 text-[10px] leading-relaxed mb-3">
          Stop giving up 30% to the platform. See the math.
        </p>

        {/* Platform label */}
        <div className="flex items-center gap-2 mb-3">
          <motion.span
            key={isDrope ? 'drope' : 'twitch'}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${isDrope ? 'bg-[#afff00] text-black' : 'bg-white/10 text-white'}`}
          >
            {isDrope ? 'DROPE' : 'Twitch/YouTube'}
          </motion.span>
          <span className="text-white/30 text-[10px]">on $100 in tips</span>
        </div>

        {/* Earnings bar — glows on hover */}
        <motion.div
          className="relative h-8 bg-white/5 rounded-full overflow-hidden border border-white/10"
          whileHover={{ boxShadow: isDrope ? '0 0 20px rgba(175,255,0,0.4)' : 'none' }}
        >
          <motion.div
            animate={{ width: `${keep}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className={`absolute left-0 top-0 h-full rounded-full ${isDrope ? 'bg-[#afff00]' : 'bg-white/30'}`}
          />
          <div className="absolute inset-0 flex items-center justify-between px-3">
            <motion.span
              key={keep}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`text-xs font-black ${isDrope ? 'text-black' : 'text-white'}`}
            >
              You keep ${keep}
            </motion.span>
            <span className="text-white/40 text-[10px]">Platform: ${lost}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Card 3: INSTANT CASH RAILS — Settle Bar
// ─────────────────────────────────────────────
const InstantCashCard = () => {
  const [settling, setSettling] = useState(false);
  const [settled, setSettled] = useState(false);

  const handleSettle = () => {
    if (settled) { setSettled(false); setSettling(false); return; }
    setSettling(true);
    setTimeout(() => { setSettled(true); setSettling(false); }, 1800);
  };

  return (
    <motion.div className="relative bg-[#afff00] rounded-3xl p-8 md:p-10 flex flex-col justify-between overflow-hidden md:h-full">
      {/* Subtle radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(0,0,0,0.08),transparent_60%)] pointer-events-none" />

      {/* Top row: Heading left, Icon right */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black leading-none">
          INSTANT<br />LIQUIDITY.
        </h3>
        <CheckCircle2 className="w-8 h-8 text-black/40 shrink-0 mt-0.5" />
      </div>

      {/* Body */}
      <div className="relative z-10 mt-3">
        <p className="text-black/60 text-[10px] leading-relaxed mb-4">
          The stream ends, and the money is in your bank. No 30-day holds. No minimum thresholds.
        </p>

        {/* VSM Progress Bar */}
        <div className="relative h-10 bg-black/10 rounded-full overflow-hidden mb-3">
          <motion.div
            animate={{ width: settled ? '100%' : settling ? '85%' : '0%' }}
            transition={settling ? { duration: 1.6, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
            className="absolute left-0 top-0 h-full bg-black rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {settled ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#afff00]" />
                  <span className="text-[#afff00] text-xs font-black uppercase tracking-widest">Funds Settled</span>
                </motion.div>
              ) : (
                <motion.span
                  key="idle"
                  exit={{ opacity: 0 }}
                  className={`text-xs font-black uppercase tracking-widest ${settling ? 'text-[#afff00]' : 'text-black/60'}`}
                >
                  {settling ? 'Settling...' : 'Tap to withdraw'}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Single CTA */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ backgroundColor: '#000', color: '#afff00' }}
          onClick={handleSettle}
          disabled={settling}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-black/20 font-black text-xs uppercase tracking-widest text-black transition-all"
        >
          {settled ? 'Reset Demo' : 'Withdraw Now'}
          {!settled && <ArrowRight className="w-3.5 h-3.5" />}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Main Section Export
// ─────────────────────────────────────────────
export const FeaturePillars = () => {
  return (
    <section
      data-navbar-theme="dark"
      className="features-pillars-section bg-[#0A0A0A] px-[clamp(1rem,5vw,4rem)] py-20 md:py-32 flex flex-col justify-center overflow-y-auto md:overflow-hidden"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 md:mb-16 pt-10 md:pt-0"
      >
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white leading-tight text-center md:text-left">
          Built for <span className="text-[#afff00] italic font-serif normal-case">streamers.</span>
        </h2>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 pb-8 md:pb-0 md:flex-1 md:max-h-[65vh]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0 }}
        >
          <SuperalertCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <EarningsCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <InstantCashCard />
        </motion.div>
      </div>
    </section>
  );
};

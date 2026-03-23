import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import {
  X, ArrowRight, Loader2, CheckCircle, Clock,
  Rocket, Crown, Sparkles, Cpu, Award,
  Zap, Shield, ShieldCheck, Activity, BarChart3, HardDrive,
  Infinity as InfinityIcon, Star, Trophy
} from 'lucide-react';
import axios from '../api/axios';

// ─── Tier Hierarchy ───────────────────────────────────────────
const TIER_RANK = { starter: 0, pro: 1, legend: 2 };

// ─── All Plans Definition ─────────────────────────────────────
const ALL_PLANS = [
  {
    id: 'starter',
    name: 'Starter Tier',
    price: 999,
    fee: '15%',
    icon: Zap,
    accentColor: 'slate',
    glow: 'shadow-slate-500/20',
    border: 'border-slate-500/30',
    badge: 'Standard Entry',
    bIcon: Star,
    tagline: 'Get started with the basics',
    features: [
      { icon: CheckCircle, text: '15% Revenue Split' },
      { icon: Clock, text: 'Weekly Payout Cycle' },
      { icon: Shield, text: 'Standard Encryption' },
    ],
    specs: [
      { icon: Activity, label: 'Latency', value: '45ms' },
      { icon: BarChart3, label: 'Analytics', value: 'Basic' },
      { icon: HardDrive, label: 'Storage', value: '5GB' },
      { icon: Shield, label: 'Security', value: 'Standard' },
    ],
    upgradePerks: [],
  },
  {
    id: 'pro',
    name: 'Pro Tier',
    price: 1999,
    fee: '10%',
    icon: Cpu,
    accentColor: 'emerald',
    glow: 'shadow-emerald-500/30',
    border: 'border-emerald-500/30',
    badge: 'Most Popular',
    bIcon: Rocket,
    tagline: 'Supercharge your creator income',
    features: [
      { icon: CheckCircle, text: '10% Revenue Split' },
      { icon: Clock, text: '48hr Payout Terminal' },
      { icon: ShieldCheck, text: 'Advanced Encryption' },
      { icon: Zap, text: 'Priority Connection' },
    ],
    specs: [
      { icon: Activity, label: 'Latency', value: '18ms' },
      { icon: BarChart3, label: 'Analytics', value: 'Advanced' },
      { icon: HardDrive, label: 'Storage', value: '25GB' },
      { icon: Shield, label: 'Security', value: 'Advanced' },
    ],
    upgradePerks: {
      starter: ['Save 5% on every payout', 'Payouts in 48hrs instead of weekly', 'Advanced analytics dashboard', '5× more storage (25GB)'],
    },
  },
  {
    id: 'legend',
    name: 'Legend Tier',
    price: 2999,
    fee: '5%',
    icon: Award,
    accentColor: 'amber',
    glow: 'shadow-amber-500/30',
    border: 'border-amber-400/30',
    badge: 'VIP Priority',
    bIcon: Crown,
    tagline: 'The absolute pinnacle of creator monetization',
    features: [
      { icon: CheckCircle, text: '5% Revenue Split' },
      { icon: Clock, text: 'Instant Settlement' },
      { icon: ShieldCheck, text: 'Military Grade Security' },
      { icon: Rocket, text: 'Dedicated Infrastructure' },
    ],
    specs: [
      { icon: Activity, label: 'Latency', value: 'Sub-ms' },
      { icon: InfinityIcon, label: 'Capacity', value: 'Unlimited' },
      { icon: HardDrive, label: 'Storage', value: 'Unlimited' },
      { icon: Shield, label: 'Security', value: 'Military' },
    ],
    upgradePerks: {
      starter: ['Save 10% on every payout', 'Instant settlements — no waiting', 'Unlimited storage & bandwidth', 'Military-grade security layer', 'Dedicated infrastructure'],
      pro:     ['Save an extra 5% on every payout', 'Upgrade from 48hr to instant payouts', 'Unlimited storage (was 25GB)', 'Dedicated infrastructure for you only'],
    },
  },
];

// ─── Accent Color Utility ─────────────────────────────────────
const accentMap = {
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    fill: 'fill-emerald-500',
    btn: 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20',
    ring: 'ring-emerald-500/30',
    glow: 'rgba(16,185,129,0.15)',
    bar: 'via-emerald-500',
    perkBg: 'bg-emerald-500/10',
    perkBorder: 'border-emerald-500/20',
    perkText: 'text-emerald-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-400/30',
    text: 'text-amber-400',
    fill: 'fill-amber-500',
    btn: 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20',
    ring: 'ring-amber-500/30',
    glow: 'rgba(251,191,36,0.15)',
    bar: 'via-amber-500',
    perkBg: 'bg-amber-500/10',
    perkBorder: 'border-amber-400/20',
    perkText: 'text-amber-400',
  },
  slate: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-400',
    fill: 'fill-slate-500',
    btn: 'bg-slate-500 hover:bg-slate-400 shadow-slate-500/20',
    ring: 'ring-slate-500/30',
    glow: 'rgba(100,116,139,0.15)',
    bar: 'via-slate-500',
    perkBg: 'bg-slate-500/10',
    perkBorder: 'border-slate-500/20',
    perkText: 'text-slate-400',
  },
};

// ─── Upgrade Plan Card ────────────────────────────────────────
const UpgradePlanCard = ({ plan, currentTier, isSelected, isLoading, billingCycle, onSelect, onSubscribe }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const ac = accentMap[plan.accentColor];

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const getPriceData = () => {
    const original = plan.price * billingCycle;
    let discounted = original;
    if (billingCycle === 6) discounted = Math.round(original * 0.85);
    if (billingCycle === 12) discounted = Math.round(original * 0.70);
    return { original, discounted };
  };

  const { discounted } = getPriceData();
  const perks = plan.upgradePerks?.[currentTier] || plan.features.map(f => f.text);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onClick={onSelect}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group cursor-pointer rounded-2xl p-5 flex flex-col transition-all duration-500 overflow-hidden border
        ${isSelected
          ? `bg-[#080808] ${ac.border} ring-2 ${ac.ring} shadow-2xl scale-[1.02]`
          : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:scale-[1.01]'
        }`}
    >
      {/* Popular badge */}
      {plan.id === 'pro' && (
        <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl rounded-tr-2xl bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest">
          Most Popular
        </div>
      )}

      {/* Hover glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, ${ac.glow}, transparent 80%)`,
        }}
      />

      {/* Glossy top bar */}
      {isSelected && (
        <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent ${ac.bar} to-transparent`} />
      )}

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl border transition-all duration-500 ${isSelected ? `${ac.bg} ${ac.border}` : 'bg-white/5 border-white/10'}`}>
            <plan.icon className={`w-5 h-5 ${isSelected ? ac.text : 'text-white/30'}`} />
          </div>
          <div className="text-right">
            <div className={`text-2xl font-black italic tracking-tighter ${isSelected ? 'text-white' : 'text-white/60'}`}>
              ₹{discounted.toLocaleString('en-IN')}
            </div>
            <div className="text-[8px] font-black uppercase tracking-widest text-white/20">/ lifecycle</div>
          </div>
        </div>

        <h3 className={`text-base font-black italic uppercase tracking-tighter mb-1 ${isSelected ? 'text-white' : 'text-white/40'}`}>
          {plan.name}
        </h3>
        <p className={`text-[9px] font-bold uppercase tracking-wider mb-4 ${isSelected ? ac.text : 'text-white/20'}`}>
          {plan.tagline}
        </p>

        {/* What you gain */}
        <div className={`space-y-2 mb-4 p-3 rounded-xl border transition-all duration-500 ${isSelected ? `${ac.perkBg} ${ac.perkBorder}` : 'bg-transparent border-transparent'}`}>
          {isSelected && (
            <p className={`text-[8px] font-black uppercase tracking-widest mb-2 ${ac.text} opacity-70`}>
              ✦ What you gain
            </p>
          )}
          {perks.map((perk, i) => (
            <div key={i} className={`flex items-center gap-2 transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-25'}`}>
              <div className={`w-1 h-1 rounded-full shrink-0 ${isSelected ? ac.text.replace('text-', 'bg-') : 'bg-white/20'}`} />
              <span className={`text-[9px] font-bold uppercase tracking-wide ${isSelected ? 'text-white/90' : 'text-white/50'}`}>
                {typeof perk === 'string' ? perk : perk.text}
              </span>
            </div>
          ))}
        </div>

        {/* Fee badge */}
        <div className={`flex items-center gap-2 mb-5 px-3 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest w-fit transition-all duration-500 ${isSelected ? `${ac.bg} ${ac.border} ${ac.text}` : 'bg-white/5 border-white/5 text-white/20'}`}>
          <Zap className="w-3 h-3" />
          {plan.fee} Revenue Split
        </div>

        {/* CTA */}
        <button
          onClick={(e) => { e.stopPropagation(); onSubscribe(plan.id); }}
          disabled={isLoading}
          className={`w-full py-3.5 rounded-xl font-black uppercase italic text-[10px] tracking-[0.25em] transition-all duration-300 flex justify-center items-center gap-2 border-2 border-transparent mt-auto
            ${isSelected
              ? `${ac.btn} text-black shadow-lg`
              : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/60'
            }`}
        >
          {isLoading
            ? <Loader2 className="animate-spin w-5 h-5" />
            : <>Upgrade Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
          }
        </button>
      </div>
    </motion.div>
  );
};

// ─── Main Modal Component ─────────────────────────────────────
const UpgradeModal = ({ isOpen, onClose, user }) => {
  const [billingCycle, setBillingCycle] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');

  const currentTier = user?.tier || 'starter';
  const currentRank = TIER_RANK[currentTier] ?? 0;

  // Plans strictly higher than current tier
  const upgradablePlans = ALL_PLANS.filter(p => TIER_RANK[p.id] > currentRank);

  // Auto-select the first (lowest) upgradable plan on open
  useEffect(() => {
    if (isOpen && upgradablePlans.length > 0) {
      setSelectedPlan(upgradablePlans[0].id);
      setError('');
    }
  }, [isOpen, currentTier]); // eslint-disable-line react-hooks/exhaustive-deps

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubscribe = async (planId) => {
    setLoadingPlan(planId);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const subRes = await axios.post(
        '/api/payment/create-subscription',
        { planId, billingCycle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: 'rzp_test_SHrX3upgmJ6sGL',
        subscription_id: subRes.data.id,
        name: 'DropPay Terminal',
        description: `Upgrading to ${planId.toUpperCase()} Tier`,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              '/api/payment/verify-subscription',
              {
                plan: planId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (verifyRes.data.status === 'success') {
              window.location.href = '/dashboard';
            } else {
              setLoadingPlan(null);
            }
          } catch (err) {
            setLoadingPlan(null);
            setError(err.response?.data?.msg || 'Verification Failed. Please try again.');
          }
        },
        prefill: { name: user?.username, email: user?.email },
        theme: { color: planId === 'legend' ? '#fbbf24' : '#10B981' },
        modal: { ondismiss: () => setLoadingPlan(null) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.msg || 'Payment gateway unreachable. Please try again.');
      setLoadingPlan(null);
    }
  };

  const tierLabel = { starter: 'Starter', pro: 'Pro', legend: 'Legend' };
  const tierAccent = { starter: 'text-slate-400', pro: 'text-emerald-400', legend: 'text-amber-400' };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.93, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.93, y: 30, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#060606] border border-white/10 rounded-3xl shadow-2xl flex flex-col no-scrollbar"
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-t-3xl" />

            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4 bg-[#060606]/95 backdrop-blur-xl border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <Trophy className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-base font-black italic uppercase tracking-tighter text-white">
                    Upgrade Your Plan
                  </h2>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-0.5">
                    Current:{' '}
                    <span className={`${tierAccent[currentTier]} font-black`}>
                      {tierLabel[currentTier]} Tier
                    </span>
                    {' '}— Select a higher tier below
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-6">

              {/* Legend is max */}
              {upgradablePlans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Crown className="w-10 h-10 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">
                      You've Reached the Top
                    </h3>
                    <p className="text-sm text-white/40 font-bold max-w-xs mx-auto">
                      You're already on the <span className="text-amber-400">Legend Tier</span> — the highest plan we offer. Enjoy every benefit!
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-8 py-3.5 rounded-xl font-black uppercase italic text-[11px] tracking-widest bg-amber-500 text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Billing Cycle Switcher */}
                  <div className="flex items-center justify-center">
                    <div className="flex p-1 rounded-2xl bg-black/60 border border-white/10 shadow-inner gap-1">
                      {[
                        { m: 1, label: 'Monthly' },
                        { m: 6, label: '6 Months', disc: 'Save 15%' },
                        { m: 12, label: 'Yearly', disc: 'Save 30%' },
                      ].map((item) => (
                        <button
                          key={item.m}
                          onClick={() => setBillingCycle(item.m)}
                          className={`relative flex flex-col items-center px-4 py-2 rounded-xl text-[8.5px] font-black uppercase tracking-[0.15em] transition-all duration-300
                            ${billingCycle === item.m
                              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                              : 'text-white/30 hover:text-white/60'
                            }`}
                        >
                          <span>{item.label}</span>
                          {item.disc && (
                            <span className={`text-[7px] mt-0.5 italic ${billingCycle === item.m ? 'text-white/80' : 'text-indigo-400/50'}`}>
                              {item.disc}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Plan Cards */}
                  <div className={`grid gap-4 ${upgradablePlans.length === 1 ? 'grid-cols-1 max-w-sm mx-auto w-full' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {upgradablePlans.map((plan) => (
                      <UpgradePlanCard
                        key={plan.id}
                        plan={plan}
                        currentTier={currentTier}
                        isSelected={selectedPlan === plan.id}
                        isLoading={loadingPlan === plan.id}
                        billingCycle={billingCycle}
                        onSelect={() => setSelectedPlan(plan.id)}
                        onSubscribe={handleSubscribe}
                      />
                    ))}
                  </div>

                  {/* Footer note */}
                  <div className="flex items-center justify-center gap-2 opacity-30 pt-2">
                    <Sparkles className="w-3 h-3 text-white" />
                    <p className="text-[8px] font-black uppercase tracking-widest text-white">
                      Secure checkout powered by Razorpay — cancel anytime
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;

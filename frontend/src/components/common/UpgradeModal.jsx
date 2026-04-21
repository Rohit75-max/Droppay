import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import {
  X, ArrowRight, Loader2, CheckCircle, Clock,
  Rocket, Crown, Sparkles, Cpu, Award,
  Zap, Shield, ShieldCheck, Activity, BarChart3, HardDrive,
  Infinity as InfinityIcon, Star, Trophy
} from 'lucide-react';
import axios from '../../api/axios';
import { Logo } from '../ui/Logo';

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
    glow: 'rgba(100,116,139,0.15)',
    tagline: 'Get started with the basics',
    features: [
      { text: '15% Revenue Split' },
      { text: 'Weekly Payout Cycle' },
      { text: 'Standard Encryption' },
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
    glow: 'rgba(16,185,129,0.25)',
    badge: 'High Throughput',
    tagline: 'Supercharge your creator income',
    features: [
      { text: '10% Revenue Split' },
      { text: '48hr Payout Terminal' },
      { text: 'Advanced Encryption' },
      { text: 'Priority Connection' },
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
    glow: 'rgba(251,191,36,0.3)',
    badge: 'Ultra Low Latency',
    tagline: 'The absolute pinnacle of creator monetization',
    features: [
      { text: '5% Revenue Split' },
      { text: 'Instant Settlement' },
      { text: 'Military Grade Security' },
      { text: 'Dedicated Infrastructure' },
    ],
    upgradePerks: {
      starter: ['Save 10% on every payout', 'Instant settlements — no waiting', 'Unlimited storage & bandwidth', 'Military-grade security layer', 'Dedicated infrastructure'],
      pro:     ['Save an extra 5% on every payout', 'Upgrade from 48hr to instant payouts', 'Unlimited storage (was 25GB)', 'Dedicated infrastructure for you only'],
    },
  },
];

const accentMap = {
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-[#10B981]',
    btn: 'bg-[#10B981] text-black hover:bg-[#12d192] shadow-[0_0_30px_rgba(16,185,129,0.3)]',
    ring: 'ring-emerald-500/30',
    bar: 'via-[#10B981]',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-400/30',
    text: 'text-amber-400',
    btn: 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]',
    ring: 'ring-amber-500/30',
    bar: 'via-amber-500',
  },
  slate: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-400',
    btn: 'bg-slate-800 text-white hover:bg-slate-700 shadow-[0_0_30px_rgba(100,116,139,0.1)]',
    ring: 'ring-slate-500/30',
    bar: 'via-slate-500',
  },
};

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
    return { discounted };
  };

  const { discounted } = getPriceData();
  const perks = plan.upgradePerks?.[currentTier] || plan.features.map(f => f.text);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group cursor-pointer rounded-[2.5rem] p-8 flex flex-col transition-all duration-500 overflow-hidden border-2
        ${isSelected
          ? `bg-[#0a0a0a] ${ac.border} shadow-[0_40px_80px_rgba(0,0,0,0.6)] scale-[1.03] z-10`
          : 'bg-[#060606] border-white/5 hover:border-white/10 hover:bg-[#080808]'
        }`}
    >
      {/* Popular badge */}
      {plan.id === 'pro' && (
        <div className="absolute top-6 right-0 px-4 py-1.5 rounded-l-full bg-[#10B981] text-black text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
          Most Popular
        </div>
      )}

      {/* Hover glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${plan.glow}, transparent 80%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-700 ${isSelected ? `${ac.bg} ${ac.border} rotate-6 shadow-xl` : 'bg-white/5 border-white/10'}`}>
            <plan.icon className={`w-7 h-7 ${isSelected ? ac.text : 'text-white/20'}`} />
          </div>
          <div>
            <h3 className={`text-xl font-black italic uppercase tracking-tighter leading-none ${isSelected ? 'text-white' : 'text-white/40'}`}>
              {plan.name}
            </h3>
            <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isSelected ? ac.text : 'text-white/20'}`}>
              {plan.tagline}
            </p>
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-8">
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black italic tracking-tighter text-white">₹{discounted.toLocaleString('en-IN')}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">/ Lifecycle</span>
            </div>
            <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${isSelected ? `${ac.bg} ${ac.border} ${ac.text}` : 'bg-white/5 border-white/5 text-white/20'}`}>
                <Zap className="w-3 h-3" />
                {plan.fee} Node Revenue Split
            </div>
        </div>

        {/* Feature List */}
        <div className={`space-y-3 mb-10 p-5 rounded-3xl border transition-all duration-700 ${isSelected ? 'bg-black/40 border-white/10' : 'border-transparent'}`}>
          {perks.map((perk, i) => (
            <div key={i} className={`flex items-start gap-3 transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? ac.text.replace('text-', 'bg-') : 'bg-white/20'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wide leading-relaxed ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                {typeof perk === 'string' ? perk : perk.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={(e) => { e.stopPropagation(); onSubscribe(plan.id); }}
          disabled={isLoading}
          className={`w-full py-5 rounded-2xl font-black uppercase italic text-[11px] tracking-[0.3em] transition-all duration-300 flex justify-center items-center gap-3 mt-auto
            ${isSelected
              ? ac.btn
              : 'bg-white/5 text-white/20 hover:bg-white/10 hover:text-white/40 border border-white/5'
            }`}
        >
          {isLoading
            ? <Loader2 className="animate-spin w-5 h-5" />
            : <>Deploy {plan.id} Tier <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
          }
        </button>
      </div>
    </motion.div>
  );
};

const UpgradeModal = ({ isOpen, onClose, user }) => {
  const [billingCycle, setBillingCycle] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');

  const currentTier = user?.tier || 'starter';
  const currentRank = TIER_RANK[currentTier] ?? 0;
  const upgradablePlans = ALL_PLANS.filter(p => TIER_RANK[p.id] > currentRank);

  useEffect(() => {
    if (isOpen && upgradablePlans.length > 0) {
      setSelectedPlan(upgradablePlans[0].id);
      setError('');
    }
  }, [isOpen, currentTier]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubscribe = async (planId) => {
    setLoadingPlan(planId);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const subRes = await axios.post('/api/payment/create-subscription', { planId, billingCycle }, { headers: { Authorization: `Bearer ${token}` } });
      const options = {
        key: 'rzp_test_SHrX3upgmJ6sGL',
        subscription_id: subRes.data.id,
        name: 'Drope Terminal',
        description: `AUTHENTICATING ${planId.toUpperCase()} HANDSHAKE`,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post('/api/payment/verify-subscription', {
                plan: planId,
                billingCycle: billingCycle,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
            }, { headers: { Authorization: `Bearer ${token}` } });
            if (verifyRes.data.status === 'success') window.location.href = '/dashboard';
            else setLoadingPlan(null);
          } catch (err) {
            setLoadingPlan(null);
            setError(err.response?.data?.msg || 'Neural verification failed.');
          }
        },
        prefill: { name: user?.username, email: user?.email },
        theme: { color: '#111111' },
        modal: { ondismiss: () => setLoadingPlan(null) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.msg || 'Security uplink disconnected. Try again.');
      setLoadingPlan(null);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* Grainy Texture */}
          <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />

          <motion.div
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
            className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden bg-[#0a0a0b] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col"
          >
            {/* Glossy Header */}
            <div className="flex items-center justify-between p-10 pb-6">
                <div className="flex flex-col gap-6">
                    <Logo size="1.2rem" accentColor="#10B981" />
                    <div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none mb-2">Terminal Expansion</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Current Node:</span>
                            <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-white/5 border border-white/10 ${currentTier === 'legend' ? 'text-amber-500' : currentTier === 'pro' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {currentTier} tier
                            </span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="w-14 h-14 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center group relative overflow-hidden">
                    <div className="absolute inset-0 bg-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <X className="w-6 h-6 text-white/50 group-hover:text-white transition-colors relative z-10" />
                </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-10 pb-10">
                {upgradablePlans.length === 0 ? (
                    <div className="py-20 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-[2rem] bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(251,191,36,0.15)]">
                            <Crown className="w-12 h-12 text-amber-500 animate-pulse" />
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-3">Peak Performance Reached</h3>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 max-w-sm mb-10">You are currently operating on the highest throughput tier available.</p>
                        <button onClick={onClose} className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase italic text-[11px] tracking-widest hover:bg-emerald-500 transition-all shadow-xl">Close Terminal</button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Billing Switcher */}
                        <div className="flex justify-center">
                            <div className="p-1 rounded-2xl bg-black border border-white/5 shadow-inner flex gap-1">
                                {[
                                    { m: 1, label: 'Monthly' },
                                    { m: 6, label: '6 Months', prk: '-15%' },
                                    { m: 12, label: 'Yearly', prk: '-30%' }
                                ].map((tab) => (
                                    <button 
                                        key={tab.m}
                                        onClick={() => setBillingCycle(tab.m)}
                                        className={`relative px-6 py-3 rounded-xl transition-all duration-500 group ${billingCycle === tab.m ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                                            {tab.prk && <span className={`text-[7px] font-black tracking-widest mt-0.5 ${billingCycle === tab.m ? 'text-emerald-600' : 'text-emerald-500 opacity-60'}`}>{tab.prk} OFF</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Error Handling */}
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[9px] font-black uppercase tracking-[0.3em] text-center italic animate-pulse">
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Plan Grid */}
                        <div className={`grid gap-8 ${upgradablePlans.length === 1 ? 'max-w-md mx-auto grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
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

                        <div className="flex flex-col items-center gap-4 py-8 opacity-30 group cursor-default">
                            <div className="flex items-center gap-6">
                                <div className="h-px w-20 bg-gradient-to-r from-transparent to-white/50" />
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-4 h-4 text-white group-hover:text-emerald-500 transition-colors" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Neural Secure Handshake Active</span>
                                </div>
                                <div className="h-px w-20 bg-gradient-to-l from-transparent to-white/50" />
                            </div>
                            <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/50">SECURE CHECKOUT BY RAZORPAY • CANCEL ANYTIME</p>
                        </div>
                    </div>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default UpgradeModal;

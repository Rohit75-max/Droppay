import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import {
  CheckCircle, Clock,
  Rocket, Crown, Sparkles, Loader2,
  ArrowRight, ShieldCheck, Cpu, Database, Activity, Target, Award,
  Zap, Star, Shield, Globe, HardDrive, BarChart3, Infinity as InfinityIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

// ─── Visual Component: Floating Shards ────────────────────────
const FloatingShard = ({ delay = 0, size = "w-24 h-24", top = "10%", left = "10%", rotate = "0deg" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.1, 0.2, 0.1],
      y: [0, -40, 0],
      rotate: [rotate, `${parseInt(rotate) + 15}deg`, rotate]
    }}
    transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, ease: "easeInOut", delay }}
    className={`absolute ${size} rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-[2px] pointer-events-none z-0`}
    style={{ top, left, rotate }}
  />
);

// ─── Visual Component: Scanline Effect ────────────────────────
const GlobalScanline = () => (
  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    <motion.div
      animate={{
        top: ['-100%', '100%'],
        opacity: [0.02, 0.05, 0.02]
      }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      className="absolute left-0 right-0 h-[40vh] bg-gradient-to-b from-transparent via-emerald-500/[0.05] to-transparent"
    />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90.1deg,rgba(255,0,0,0.02)_0%,rgba(0,255,0,0.01)_50.1%,rgba(0,0,255,0.02)_100%)] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
  </div>
);

// ─── Plan Card Component ──────────────────────────────────────
const PlanCard = ({ plan, index, isActive, isThisLoading, discounted, onClick, onSubscribe }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const getAccentColor = () => {
    if (plan.id === 'legend') return 'amber';
    if (plan.id === 'starter') return 'slate';
    return 'emerald';
  };

  const accent = getAccentColor();

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group cursor-pointer rounded-[2.5rem] md:rounded-[3.5rem] p-5 sm:p-8 md:p-10 flex flex-col transition-all duration-700 overflow-hidden border
      ${plan.popular ? 'ring-2 ring-emerald-500/30' : ''}
      ${plan.id === 'legend' ? 'md:col-span-2 lg:col-span-1' : ''}
      ${isActive
          ? `bg-[#080808] ${plan.border} shadow-[0_30px_60px_-12px_rgba(0,0,0,1),var(--tw-shadow-colored)] ${plan.glow} scale-[1.03] md:scale-[1.04]`
          : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:scale-[1.01]'}`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute top-8 right-[-32px] rotate-45 bg-emerald-500 text-white text-[9px] font-black py-1.5 px-10 shadow-[0_4px_12px_rgba(16,185,129,0.3)] tracking-[0.2em] uppercase z-20 overflow-hidden">
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
          />
          Most Popular
        </div>
      )}
      {/* Dynamic Hover Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              700px circle at ${mouseX}px ${mouseY}px,
              ${plan.id === 'legend' ? 'rgba(251, 191, 36, 0.15)' : plan.id === 'starter' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(16, 185, 129, 0.15)'},
              transparent 80%
            )
          `,
        }}
      />

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

      {/* Badge */}
      <div className={`absolute -top-1 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-6 py-2.5 rounded-b-3xl font-black uppercase tracking-[0.3em] text-[8.5px] shadow-2xl border-x border-b transition-all duration-700
      ${isActive
          ? `bg-${accent === 'emerald' ? 'emerald-500' : accent === 'amber' ? 'amber-500' : 'slate-500'} text-white border-${accent === 'emerald' ? 'emerald-400' : accent === 'amber' ? 'amber-400' : 'slate-400'}/30`
          : 'bg-white/5 text-white/30 border-white/10'}`}>
        <plan.bIcon className="w-3.5 h-3.5" /> {plan.badge}
      </div>

      <div className="relative z-10 pt-4">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-10 transition-all duration-700 ${isActive ? `bg-${accent === 'emerald' ? 'emerald-500' : accent === 'amber' ? 'amber-500' : 'slate-500'}/20 border border-${accent === 'emerald' ? 'emerald-500' : accent === 'amber' ? 'amber-500' : 'slate-500'}/30 shadow-2xl shadow-${accent === 'emerald' ? 'emerald-500' : accent === 'amber' ? 'amber-500' : 'slate-500'}/20 animate-pulse` : 'bg-white/5 border border-white/10'}`}>
          <plan.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${isActive ? `text-${accent === 'emerald' ? 'emerald-400' : accent === 'amber' ? 'amber-400' : 'slate-400'}` : 'text-white/20'}`} />
        </div>

        <h3 className={`text-xl sm:text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-1.5 transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/40'}`}>
          {plan.name}
        </h3>

        <div className="flex items-baseline gap-2 mb-10">
          <span className={`text-3xl sm:text-5xl md:text-6xl font-black italic tracking-tighter ${isActive ? 'text-white text-shadow-glow' : 'text-white/60'}`}>
            ₹{discounted.toLocaleString('en-IN')}
          </span>
          <span className="text-white/20 text-[9px] sm:text-[11px] font-black uppercase tracking-widest italic">/ lifecycle</span>
        </div>

        <div className={`space-y-4 mb-8 transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-20'}`}>
          {plan.features.map((feature, i) => (
            <div key={i} className={`flex items-center gap-4 transition-all duration-700 ${isActive ? 'text-white/90 translate-x-1' : ''}`}>
              <feature.icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isActive ? `text-${accent === 'emerald' ? 'emerald-500' : accent === 'amber' ? 'amber-500' : 'slate-500'}` : 'text-white/10'}`} />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em]">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Technical Specifications Grid */}
        <div className={`grid grid-cols-2 gap-3 mb-10 p-4 sm:p-5 rounded-3xl border transition-all duration-700 ${isActive ? 'bg-white/[0.03] border-white/10 opacity-100' : 'bg-transparent border-transparent opacity-0 translate-y-4'}`}>
          {plan.specs.map((spec, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 opacity-40">
                <spec.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="text-[8px] font-black uppercase tracking-widest">{spec.label}</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-white/80 tracking-tight italic">{spec.value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onSubscribe(plan.id); }}
          disabled={isThisLoading}
          className={`group/btn relative w-full py-5 sm:py-6 rounded-[2.5rem] font-black uppercase italic text-[11px] sm:text-[13px] tracking-[0.3em] sm:tracking-[0.4em] transition-all duration-500 flex justify-center items-center gap-4 overflow-hidden border-2
            ${isActive
              ? `bg-${accent === 'emerald' ? 'emerald-500' : accent === 'amber' ? 'amber-500' : 'slate-500'} text-white border-transparent shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),var(--tw-shadow-colored)] ${plan.glow}`
              : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20 hover:shadow-2xl hover:shadow-white/5'}`}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out"
            style={{ skewX: '-20deg' }}
          />
          {isThisLoading ? <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6" /> : <>Select Plan <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-2 transition-transform duration-500" /></>}
        </button>
      </div>
    </motion.div>
  );
};

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/signup'); return; }

    const fetchUserStatus = async () => {
      try {
        const res = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserProfile(res.data);
      } catch (err) { console.error("Identity sync failed"); }
    };
    fetchUserStatus();

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const getPriceData = (base) => {
    const original = base * billingCycle;
    let discounted = original;
    if (billingCycle === 6) discounted = Math.round(original * 0.85);
    if (billingCycle === 12) discounted = Math.round(original * 0.70);
    return { original, discounted, savings: original - discounted };
  };

  const handleSubscribe = async (planId) => {
    setLoadingPlan(planId);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const subRes = await axios.post('/api/payment/create-subscription',
        { planId, billingCycle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_SHrX3upgmJ6sGL",
        subscription_id: subRes.data.id,
        name: "DropPay Terminal",
        description: `Activating ${planId.toUpperCase()} Plan`,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post('/api/payment/verify-subscription', {
              plan: planId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (verifyRes.data.status === 'success') {
              window.location.href = '/dashboard';
            } else {
              setLoadingPlan(null);
            }
          } catch (err) {
            setLoadingPlan(null);
            setError(err.response?.data?.msg || "Verification Failed: Payment protocol timeout.");
          }
        },
        prefill: { name: userProfile?.username, email: userProfile?.email },
        theme: { color: planId === 'legend' ? "#fbbf24" : "#10B981" },
        modal: {
          ondismiss: () => setLoadingPlan(null)
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.msg || "Service Unavailable: Payment gateway unreachable.");
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter Tier',
      price: 999,
      fee: '15%',
      icon: <Zap className="w-6 h-6 text-slate-400" />,
      color: 'text-slate-400',
      glow: 'shadow-slate-500/20',
      border: 'border-slate-500/30',
      info: 'Weekly Payouts',
      badge: 'Standard Entry',
      bIcon: Target,
      features: [
        { icon: CheckCircle, text: '15% Revenue Split' },
        { icon: Clock, text: 'Weekly Payout Cycle' },
        { icon: Shield, text: 'Standard Encryption' },
        { icon: Globe, text: 'Shared Infrastructure' }
      ],
      specs: [
        { icon: Activity, label: 'Latent Ops', value: '45ms' },
        { icon: BarChart3, label: 'Analytics', value: 'Basic' },
        { icon: HardDrive, label: 'Storage', value: '5GB' },
        { icon: Shield, label: 'Sec-Layer', value: 'Standard' }
      ]
    },
    {
      id: 'pro',
      name: 'Pro Tier',
      price: 1999,
      fee: '10%',
      icon: Cpu,
      color: 'text-[#10B981]',
      glow: 'shadow-emerald-500/30',
      border: 'border-emerald-500/30',
      info: '48hr Payouts',
      popular: true,
      badge: 'Most Popular',
      bIcon: Rocket,
      features: [
        { icon: CheckCircle, text: '10% Revenue Split' },
        { icon: Clock, text: '48hr Payout Terminal' },
        { icon: ShieldCheck, text: 'Advanced Encryption' },
        { icon: Zap, text: 'Priority Connection' }
      ],
      specs: [
        { icon: Activity, label: 'Latent Ops', value: '18ms' },
        { icon: BarChart3, label: 'Analytics', value: 'Advanced' },
        { icon: HardDrive, label: 'Storage', value: '25GB' },
        { icon: Shield, label: 'Sec-Layer', value: 'Advanced' }
      ]
    },
    {
      id: 'legend',
      name: 'Legend Tier',
      price: 2999,
      fee: '5%',
      icon: <Award className="w-6 h-6 text-amber-500" />,
      color: 'text-amber-400',
      glow: 'shadow-amber-500/30',
      border: 'border-amber-400/30',
      info: 'Instant Payouts',
      badge: 'VIP Priority',
      bIcon: Crown,
      features: [
        { icon: CheckCircle, text: '5% Revenue Split' },
        { icon: Clock, text: 'Instant Settlement' },
        { icon: ShieldCheck, text: 'Military Grade Sec' },
        { icon: Rocket, text: 'Dedicated Infrastructure' }
      ],
      specs: [
        { icon: Activity, label: 'Latent Ops', value: 'Sub-ms' },
        { icon: InfinityIcon, label: 'Capacity', value: 'Unlimited' },
        { icon: HardDrive, label: 'Storage', value: 'Unlimited' },
        { icon: Shield, label: 'Sec-Layer', value: 'Military' }
      ]
    }
  ];

  const getAccentColor = () => {
    if (selectedPlan === 'legend') return 'amber';
    if (selectedPlan === 'starter') return 'slate';
    return 'emerald';
  };

  const accent = getAccentColor();

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans flex flex-col relative overflow-hidden">

      {/* Visual Flourishes: Ambient Light Beams */}
      <GlobalScanline />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: selectedPlan === 'legend' ? '15%' : selectedPlan === 'starter' ? '-15%' : '0%',
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          className={`absolute top-[-20%] left-1/2 -translate-x-1/2 w-[150%] h-[80vh] blur-[180px] transition-all duration-1000
            ${selectedPlan === 'legend' ? 'bg-amber-500/30' : selectedPlan === 'starter' ? 'bg-slate-500/20' : 'bg-emerald-500/30'}`}
        />

        {/* Floating Ecosystem Shards */}
        <FloatingShard size="w-32 h-32" top="15%" left="5%" rotate="12deg" delay={0.5} />
        <FloatingShard size="w-48 h-48" top="60%" left="85%" rotate="-15deg" delay={2} />
        <FloatingShard size="w-20 h-20" top="40%" left="75%" rotate="45deg" delay={1} />
        <FloatingShard size="w-40 h-40" top="80%" left="15%" rotate="-10deg" delay={3} />

        {/* Global Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      </div>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-8 md:px-20 overflow-y-auto no-scrollbar relative z-10 pb-24 pt-20 md:pt-12">
        <div className="absolute top-6 left-4 sm:top-12 sm:left-8 md:left-20">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-[9.5px] sm:text-[11px] font-black uppercase tracking-widest text-white/50 hover:text-white"
          >
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>

        <header className="text-center flex flex-col items-center mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 sm:gap-5 mb-10 md:mb-12 w-full"
          >
            <div className={`transition-all duration-1000 ${accent === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.15)]' : accent === 'slate' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20 shadow-[0_0_40px_rgba(100,116,139,0.15)]' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.15)]'} px-4 py-3 md:px-10 md:py-3.5 rounded-2xl text-[9px] sm:text-[12px] font-black uppercase tracking-[0.3em] sm:tracking-[0.6em] border flex items-center gap-3 sm:gap-4 backdrop-blur-xl group`}>
              <div className="relative">
                <Zap className={`w-4 h-4 sm:w-6 sm:h-6 ${accent === 'amber' ? 'fill-amber-500' : accent === 'slate' ? 'fill-slate-500' : 'fill-emerald-500'}`} />
                <motion.div
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-1 bg-current blur-sm rounded-full opacity-20"
                />
              </div>
              <span className="relative z-10">7-Day Trial Active</span>
              <div className="h-4 w-[1px] bg-white/10" />
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 animate-spin-slow text-white/40" />
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-amber-500 font-mono text-[9px] md:text-[11px] font-black bg-black/40 border border-amber-500/30 px-5 py-3 md:px-8 md:py-3 rounded-2xl tracking-[0.2em] sm:tracking-[0.3em] uppercase shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 animate-pulse mr-1" />
              Special Offer Ends In: <span className="text-white ml-1">{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-black italic uppercase mb-8 md:mb-12 leading-[0.85] tracking-tighter"
          >
            Secure <span className={`text-transparent bg-clip-text bg-gradient-to-br transition-all duration-1000 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] ${selectedPlan === 'legend' ? 'from-amber-200 via-amber-400 to-amber-600' : selectedPlan === 'starter' ? 'from-slate-200 via-slate-400 to-slate-600' : 'from-emerald-200 via-emerald-400 to-emerald-600'}`}>
              Your Plan.
            </span>
          </motion.h1>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 backdrop-blur-md"
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Physical Switcher - Overhauled for Responsiveness */}
          <div className="relative p-1.5 md:p-3 rounded-[3rem] md:rounded-[4rem] bg-black/60 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex gap-1 sm:gap-2 overflow-hidden backdrop-blur-2xl w-full sm:w-auto group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
            {[
              { m: 1, label: 'Monthly', color: 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' },
              { m: 6, label: '6 Months', disc: 'Optimize 15%', color: 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' },
              { m: 12, label: 'Yearly', disc: 'Optimize 30%', color: 'bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)]' }
            ].map((item) => (
              <button
                key={item.m}
                onClick={() => setBillingCycle(item.m)}
                className={`relative z-10 flex-1 sm:flex-none px-3 sm:px-12 py-3 sm:py-6 rounded-[2.5rem] md:rounded-[3.5rem] text-[8px] sm:text-[12px] font-black uppercase tracking-[0.2em] sm:tracking-[0.35em] transition-all duration-700 flex flex-col items-center sm:min-w-[160px] md:min-w-[240px]
                    ${billingCycle === item.m ? 'text-white' : 'text-white/20 hover:text-white/50'}`}
              >
                {billingCycle === item.m && (
                  <motion.div
                    layoutId="activeCycle"
                    className={`absolute inset-0 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/20 ${item.color}`}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
                  />
                )}
                <span className="relative z-10 italic">
                  {item.label}
                </span>
                {item.disc && (
                  <span className={`relative z-10 text-[6px] sm:text-[10px] mt-0.5 sm:mt-1 font-black italic tracking-widest ${billingCycle === item.m ? 'text-white/90' : 'text-emerald-500/60'}`}>
                    {item.disc}
                  </span>
                )}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 w-full mx-auto max-w-8xl px-2 sm:px-6">
          <AnimatePresence mode="popLayout">
            {plans.map((plan, index) => {
              const { discounted } = getPriceData(plan.price);
              const isActive = selectedPlan === plan.id;
              const isThisLoading = loadingPlan === plan.id;

              return (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  index={index}
                  isActive={isActive}
                  isThisLoading={isThisLoading}
                  discounted={discounted}
                  onClick={() => setSelectedPlan(plan.id)}
                  onSubscribe={handleSubscribe}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Enterprise / Custom Section */}
        <section className="mt-40 mb-20 w-full max-w-7xl mx-auto px-4 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative p-8 md:p-16 rounded-[3.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">Enterprise <span className="text-white/40">Custom Solutions</span></h2>
              </div>
              <p className="text-white/40 text-sm md:text-lg font-bold leading-relaxed mb-10 max-w-xl">
                Require unique infrastructure, custom payout settings, or high-volume enterprise support? Our team builds dedicated solutions for established creator networks.
              </p>
              <div className="flex flex-wrap gap-10 opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Dedicated Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Custom Payout API</span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">SLA Guarantee</span>
                </div>
              </div>
            </div>

            <button className="relative px-12 py-6 rounded-[2.5rem] bg-white text-black font-black uppercase italic text-sm tracking-[0.3em] overflow-hidden hover:scale-105 transition-transform duration-500 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
              <span className="relative z-10">Contact Sales</span>
              <motion.div
                animate={{ x: ['-250%', '250%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent skew-x-[-20deg]"
              />
            </button>
          </motion.div>
        </section>

        <footer className="mt-40 text-center pb-20">
          <div className="flex flex-col items-center gap-16">
            <div className="h-[1px] w-full max-w-4xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 opacity-30 hover:opacity-100 transition-opacity duration-700">
              {[
                { icon: Shield, text: 'Advanced Encryption', sub: 'Secure Infrastructure' },
                { icon: Zap, text: 'Instant Payouts', sub: 'Real-time Ledger Sync' },
                { icon: Activity, text: '99.9% Uptime SLA', sub: 'Global Reliability' },
                { icon: Star, text: 'Elite Priority Support', sub: '24/7 Technical Support' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-4 group transition-all duration-500">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 group-hover:scale-110 transition-all duration-500">
                    <item.icon className="w-6 h-6 group-hover:text-emerald-400 transition-all" />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] font-mono mb-1">{item.text}</p>
                    <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-white/10 text-[9px] font-black uppercase tracking-[0.5em] italic">
              Powered by DropPay Creator Infrastructure v4.0.2-final
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(255,255,255,0.3);
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SubscriptionPage;
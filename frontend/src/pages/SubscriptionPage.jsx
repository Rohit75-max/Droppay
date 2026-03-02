import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import {
  Gift, CheckCircle, Clock,
  Rocket, Crown, Sparkles, Loader2,
  ArrowRight, ShieldCheck, Cpu, Database, Activity, Target,
  Zap, Star, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

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
      className={`relative group cursor-pointer rounded-[3.5rem] p-8 md:p-10 flex flex-col transition-all duration-700 overflow-hidden border
      ${plan.id === 'legend' ? 'md:col-span-2 lg:col-span-1' : ''}
      ${isActive
          ? `bg-[#080808] ${plan.border} shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5),var(--tw-shadow-colored)] ${plan.glow} scale-[1.03]`
          : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:scale-[1.01]'}`}
    >
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
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-all duration-700 ${isActive ? `bg-${accent === 'emerald' ? 'emerald-500' : accent === 'amber' ? 'amber-500' : 'slate-500'}/20 border border-${accent === 'emerald' ? 'emerald-500' : accent === 'amber' ? 'amber-500' : 'slate-500'}/30 shadow-2xl shadow-${accent === 'emerald' ? 'emerald-500' : accent === 'amber' ? 'amber-500' : 'slate-500'}/20 animate-pulse` : 'bg-white/5 border border-white/10'}`}>
          <plan.icon className={`w-8 h-8 ${isActive ? `text-${accent === 'emerald' ? 'emerald-400' : accent === 'amber' ? 'amber-400' : 'slate-400'}` : 'text-white/20'}`} />
        </div>

        <h3 className={`text-3xl font-black italic uppercase tracking-tighter mb-1.5 transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/40'}`}>
          {plan.name}
        </h3>

        <div className="flex items-baseline gap-2.5 mb-10">
          <span className={`text-5xl md:text-6xl font-black italic tracking-tighter ${isActive ? 'text-white text-shadow-glow' : 'text-white/60'}`}>
            ₹{discounted.toLocaleString('en-IN')}
          </span>
          <span className="text-white/20 text-[11px] font-black uppercase tracking-widest italic">/ lifecycle</span>
        </div>

        <div className="space-y-6 mb-12">
          {[
            { icon: CheckCircle, text: `${plan.fee} Revenue Split` },
            { icon: Clock, text: plan.info },
            { icon: ShieldCheck, text: 'Enterprise Alert Node' },
            { icon: Zap, text: 'Sub-ms Hyperdrive' }
          ].map((feature, i) => (
            <div key={i} className={`flex items-center gap-5 transition-all duration-700 ${isActive ? 'text-white/90 translate-x-1' : 'text-white/20'}`}>
              <feature.icon className={`w-5.5 h-5.5 shrink-0 ${isActive ? `text-${accent === 'emerald' ? 'emerald-500' : accent === 'amber' ? 'amber-500' : 'slate-500'}` : 'text-white/10'}`} />
              <span className="text-[12px] font-black uppercase tracking-[0.2em]">{feature.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onSubscribe(plan.id); }}
          disabled={isThisLoading}
          className={`group/btn relative w-full py-5.5 rounded-[2rem] font-black uppercase italic text-[12px] tracking-[0.35em] transition-all duration-500 flex justify-center items-center gap-4 overflow-hidden border-2
            ${isActive
              ? `bg-${accent === 'emerald' ? 'emerald-500' : accent === 'amber' ? 'amber-500' : 'slate-500'} text-white border-transparent shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5),var(--tw-shadow-colored)] ${plan.glow}`
              : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20 hover:shadow-xl hover:shadow-white/5'}`}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-20"
            animate={{ x: ['-250%', '250%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
          />
          {isThisLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <>Initialize Uplink <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-500" /></>}
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
        description: `Activating ${planId.toUpperCase()} Node`,
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
            alert("Verification Failed.");
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
      alert("Deployment Node Offline.");
      setLoadingPlan(null);
    }
  };

  const plans = [
    { id: 'starter', name: 'Core Node', price: 699, fee: '15%', icon: Database, color: 'text-slate-400', glow: 'shadow-slate-500/20', border: 'border-slate-500/30', info: 'Weekly Payouts', badge: 'Standard Entry', bIcon: Target },
    { id: 'pro', name: 'Elite Mesh', price: 1499, fee: '10%', icon: Cpu, color: 'text-[#10B981]', glow: 'shadow-emerald-500/30', border: 'border-emerald-500/30', info: '48hr Payouts', popular: true, badge: 'Peak Performance', bIcon: Rocket },
    { id: 'legend', name: 'Legendary Uplink', price: 2499, fee: '5%', icon: ShieldCheck, color: 'text-amber-400', glow: 'shadow-amber-500/30', border: 'border-amber-400/30', info: 'Instant Payouts', badge: 'VIP Priority', bIcon: Crown }
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
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: selectedPlan === 'legend' ? '15%' : selectedPlan === 'starter' ? '-15%' : '0%',
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
          className={`absolute top-[-15%] left-1/2 -translate-x-1/2 w-[140%] h-[70vh] blur-[160px] transition-all duration-1000
            ${selectedPlan === 'legend' ? 'bg-amber-500/40' : selectedPlan === 'starter' ? 'bg-slate-500/30' : 'bg-emerald-500/40'}`}
        />

        {/* Dynamic Scanline Effect */}
        <motion.div
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent z-20"
        />

        {/* Global Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      </div>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-8 md:px-20 overflow-y-auto no-scrollbar relative z-10 pb-24 pt-12">

        <header className="text-center flex flex-col items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 mb-10"
          >
            <div className="bg-emerald-500/10 text-emerald-400 px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.45em] border border-emerald-500/20 flex items-center gap-4 shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-md">
              <Zap className="w-5 h-5 fill-emerald-500" /> <Sparkles className="w-5 h-5 animate-spin-slow" /> 7-Day Trial Protocol Active
            </div>

            <div className="flex items-center gap-4 text-amber-500 font-mono text-[10px] font-black bg-amber-500/10 px-6 py-2.5 rounded-2xl border border-amber-500/20 tracking-[0.25em] uppercase shadow-lg backdrop-blur-sm">
              <Activity className="w-5 h-5 animate-pulse" />
              Node Activation Window: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black italic uppercase mb-12 leading-[0.85] tracking-tighter"
          >
            Secure <span className={`text-transparent bg-clip-text bg-gradient-to-br transition-all duration-1000 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] ${selectedPlan === 'legend' ? 'from-amber-200 via-amber-400 to-amber-600' : selectedPlan === 'starter' ? 'from-slate-200 via-slate-400 to-slate-600' : 'from-emerald-200 via-emerald-400 to-emerald-600'}`}>
              Your Uplink.
            </span>
          </motion.h1>

          {/* Premium Physical Switcher */}
          <div className="relative p-2.5 rounded-[4rem] bg-white/[0.03] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex gap-3 overflow-hidden backdrop-blur-2xl">
            {[
              { m: 1, label: 'Monthly', color: 'bg-emerald-500 shadow-emerald-500/40' },
              { m: 6, label: '6 Months', disc: 'Optimize 15%', color: 'bg-emerald-500 shadow-emerald-500/40' },
              { m: 12, label: 'Yearly', disc: 'Optimize 30%', color: 'bg-amber-500 shadow-amber-500/40' }
            ].map((item) => (
              <button
                key={item.m}
                onClick={() => setBillingCycle(item.m)}
                className={`relative z-10 px-10 py-5 rounded-[3rem] text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-700 flex flex-col items-center min-w-[150px] md:min-w-[210px]
                    ${billingCycle === item.m ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                {billingCycle === item.m && (
                  <motion.div
                    layoutId="activeCycle"
                    className={`absolute inset-0 rounded-[3rem] shadow-[0_10px_30px_rgba(0,0,0,0.3)] ${item.color}`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
                {item.disc && <span className={`relative z-10 text-[9px] mt-1.5 font-black italic ${billingCycle === item.m ? 'opacity-90' : 'text-emerald-500'}`}>{item.disc}</span>}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full mx-auto max-w-8xl px-6">
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

        <footer className="mt-32 text-center">
          <div className="flex flex-wrap justify-center gap-16 opacity-20 hover:opacity-100 transition-opacity duration-700">
            {[
              { icon: Shield, text: 'Quantum SSL' },
              { icon: Zap, text: 'Instant Settlement' },
              { icon: Activity, text: 'Realtime Hub: 99.9%' },
              { icon: Star, text: 'Elite Support' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-help transition-all duration-500">
                <item.icon className="w-6 h-6 group-hover:text-emerald-400 group-hover:scale-125 transition-all" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] font-mono">{item.text}</span>
              </div>
            ))}
          </div>
        </footer>
      </main>

      <style jsx>{`
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
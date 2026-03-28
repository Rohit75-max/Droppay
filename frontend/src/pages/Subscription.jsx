import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Cpu, Award, 
  CheckCircle, ArrowRight, Loader2, ShieldCheck, 
  Activity, 
  Lock, CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

// --- DATA: SUBSCRIPTION LAYERS (Mirrored from UpgradeModal) ---
const ALL_PLANS = [
  {
    id: 'starter',
    name: 'Starter Tier',
    price: 999,
    fee: '15%',
    icon: Zap,
    accentColor: 'slate',
    tagline: 'Get started with the basics',
    features: [
      '15% Revenue Split',
      'Weekly Payout Cycle',
      'Standard Encryption',
      'Basic Analytics'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Tier',
    price: 1999,
    fee: '10%',
    icon: Cpu,
    accentColor: 'emerald',
    badge: 'Recommended',
    tagline: 'Supercharge your creator income',
    features: [
      '10% Revenue Split',
      '48hr Payout Terminal',
      'Advanced Encryption',
      'Priority Connection',
      '25GB Managed Storage'
    ]
  },
  {
    id: 'legend',
    name: 'Legend Tier',
    price: 2999,
    fee: '5%',
    icon: Award,
    accentColor: 'amber',
    badge: 'Ultimate Power',
    tagline: 'The absolute pinnacle of creator monetization',
    features: [
      '5% Revenue Split',
      'Instant Settlement',
      'Military Grade Security',
      'Dedicated Infrastructure',
      'Unlimited Throughput'
    ]
  }
];

const accentMap = {
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    btn: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-400/30',
    text: 'text-amber-400',
    btn: 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20',
  },
  slate: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-400',
    btn: 'bg-slate-500 hover:bg-slate-400 text-white shadow-slate-500/20',
  },
};

const Subscription = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // --- IDENTITY HANDSHAKE: Ensure user is logged in but inactive ---
  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      const res = await axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data);
      
      // --- ADMIN EXTRACTION: Officials do not subscribe ---
      if (res.data.role === 'admin') {
        navigate('/admin/secure-portal');
        return;
      }

      // If already active, zip them to dashboard
      if (res.data.subscription?.status === 'active') {
        navigate('/dashboard');
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error("Auth Failure", err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
    
    // Load Razorpay
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    }
  }, [fetchProfile]);

  const handleSubscribe = async (planId) => {
    setIsProcessing(true);
    setError('');
    const token = localStorage.getItem('token');
    
    try {
      const subRes = await axios.post(
        '/api/payment/create-subscription',
        { planId, billingCycle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: 'rzp_test_SHrX3upgmJ6sGL', // Test Key
        subscription_id: subRes.data.id,
        name: 'Drope.in Master Node',
        description: `Activating ${planId.toUpperCase()} Tier`,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              '/api/payment/verify-subscription',
              {
                plan: planId,
                billingCycle: billingCycle,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (verifyRes.data.status === 'success') {
              navigate('/dashboard');
            } else {
              setIsProcessing(false);
              setError("Payment verification failed. Please try again.");
            }
          } catch (err) {
            setIsProcessing(false);
            setError(err.response?.data?.msg || "Verification failed.");
          }
        },
        prefill: {
          name: user?.username,
          email: user?.email
        },
        theme: {
          color: planId === 'legend' ? '#fbbf24' : '#10B981',
        },
        modal: {
          ondismiss: () => setIsProcessing(false)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.msg || "Master Node unreachable. Try again.");
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#060606] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin opacity-40" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060606] text-white selection:bg-emerald-500 selection:text-black font-sans relative overflow-hidden pb-20">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
      </div>

      {/* --- HEADER: MINIMALIST LOGO --- */}
      <header className="px-8 py-8 md:px-16 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
            <span className="text-3xl font-black tracking-tighter italic" style={{ fontFamily: 'Georgia, serif' }}>drope.</span>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        </div>
        
        <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Authenticated User</span>
                <span className="text-xs font-bold text-emerald-400/80">{user?.username}</span>
            </div>
            <button 
                onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                className="px-4 py-2 border border-white/5 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
                Logout
            </button>
        </div>
      </header>

      {/* --- MAIN PORTAL: THE CHOICE --- */}
      <main className="max-w-7xl mx-auto px-6 pt-10 md:pt-20 relative z-10">
        <div className="text-center mb-16 md:mb-24">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none">
                    Activate Your Node.
                </h1>
                <p className="text-base md:text-xl font-bold uppercase tracking-[0.3em] text-white/30 max-w-2xl mx-auto">
                    Select your settlement layer to begin scaling with precision.
                </p>
            </motion.div>

            {/* Billing Cycle Bridge */}
            <div className="mt-12 flex justify-center">
                <div className="flex p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-3xl gap-1">
                    {[
                        { m: 1, label: 'Monthly' },
                        { m: 6, label: '6 Months', save: '15%' },
                        { m: 12, label: 'Yearly', save: '30%' }
                    ].map((item) => (
                        <button
                            key={item.m}
                            onClick={() => setBillingCycle(item.m)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === item.m ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white/60'}`}
                        >
                            {item.label}
                            {item.save && <span className="ml-2 opacity-50 italic">(-{item.save})</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* --- THE TIERS: THE ENGINE --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ALL_PLANS.map((plan, idx) => {
                const isSelected = selectedPlan === plan.id;
                const ac = accentMap[plan.accentColor];
                
                return (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`relative group cursor-pointer p-8 rounded-[2.5rem] flex flex-col transition-all duration-700 overflow-hidden border-2
                            ${isSelected 
                                ? `bg-[#0c0c0c] ${ac.border} shadow-2xl scale-[1.02]` 
                                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:scale-[1.01]'}`}
                    >
                        {/* Highlights */}
                        {plan.badge && (
                            <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-2xl text-[9px] font-black uppercase tracking-widest ${isSelected ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/40'}`}>
                                {plan.badge}
                            </div>
                        )}

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-8">
                                <div className={`p-4 rounded-2xl border transition-all duration-500 ${isSelected ? `${ac.bg} ${ac.border}` : 'bg-white/5 border-white/10'}`}>
                                    <plan.icon className={`w-8 h-8 ${isSelected ? ac.text : 'text-white/20'}`} />
                                </div>
                                <div className="text-right">
                                    <div className={`text-4xl font-black italic tracking-tighter ${isSelected ? 'text-white' : 'text-white/40'}`}>
                                        ₹{(plan.price * billingCycle * (billingCycle === 12 ? 0.7 : billingCycle === 6 ? 0.85 : 1)).toLocaleString('en-IN')}
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-20">Cycle Total</div>
                                </div>
                            </div>

                            <h3 className={`text-2xl font-black italic uppercase tracking-tighter mb-2 ${isSelected ? 'text-white' : 'text-white/40'}`}>
                                {plan.name}
                            </h3>
                            <p className="text-xs font-bold text-white/30 uppercase tracking-wide mb-10 leading-relaxed">
                                {plan.tagline}
                            </p>

                            <div className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className={`flex items-center gap-3 transition-all duration-500 ${isSelected ? 'opacity-100' : 'opacity-30'}`}>
                                        <CheckCircle className={`w-4 h-4 ${isSelected ? 'text-emerald-500' : 'text-white/20'}`} />
                                        <span className="text-xs font-bold uppercase tracking-widest text-white/80">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA ACTION */}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleSubscribe(plan.id); }}
                                disabled={isProcessing}
                                className={`w-full py-5 rounded-2xl font-black uppercase italic text-[11px] tracking-[0.3em] transition-all duration-500 flex justify-center items-center gap-2 group/btn
                                    ${isSelected 
                                        ? `${ac.btn} scale-100` 
                                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                            >
                                {isProcessing && selectedPlan === plan.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isSelected ? 'Initialize Node' : 'Select Tier'}
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                );
            })}
        </div>

        {/* --- ERROR FEEDBACK --- */}
        <AnimatePresence>
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center font-black uppercase tracking-widest text-xs"
                >
                    {error}
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- TRUST LAYER: SECURITY --- */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-12 opacity-20 border-t border-white/5 pt-12">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">AES-256 Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">99.9% Uptime Verified</span>
                </div>
                <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Compliant</span>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <CreditCard className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Powered by Razorpay</span>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Subscription;

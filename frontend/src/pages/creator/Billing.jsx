import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Cpu, Award, 
  CheckCircle, ArrowRight, Loader2, ShieldCheck, 
  Activity, 
  Lock, CreditCard
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axios';
import { Logo } from '../../components/ui/Logo';

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
    bg: 'bg-[#afff00]/10',
    border: 'border-[#afff00]/30',
    text: 'text-[#afff00]',
    btn: 'bg-[#afff00] hover:bg-[#c6ff00] text-black shadow-[#afff00]/20',
  },
  amber: {
    bg: 'bg-white/5',
    border: 'border-[#afff00]/40',
    text: 'text-[#afff00]',
    pulse: true,
    btn: 'bg-[#afff00] hover:bg-[#c6ff00] text-black shadow-[#afff00]/30',
  },
  slate: {
    bg: 'bg-white/5',
    border: 'border-white/10',
    text: 'text-white/60',
    btn: 'bg-white/10 hover:bg-white/20 text-white shadow-white/10',
  },
};

const Subscription = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [expandedPlanId, setExpandedPlanId] = useState(null);
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
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#afff00] selection:text-black font-sans relative overflow-hidden pb-20">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(#afff00_1px,transparent_1px)] [background-size:24px_24px] opacity-10" 
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#afff00]/5 to-transparent opacity-20" />
      </div>

      {/* --- HEADER: MINIMALIST LOGO --- */}
      <header className="px-8 py-8 md:px-16 flex justify-between items-center relative z-20">
        <Link to="/" className="group">
            <Logo size="2.2rem" accentColor="#afff00" className="hover:opacity-80 transition-opacity" />
        </Link>
        
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-1.5 h-1.5 bg-[#afff00] rounded-full animate-pulse shadow-[0_0_10px_#afff00]" />
                <span className="text-[10px] font-bold text-white tracking-widest">{user?.username}</span>
            </div>
            <button 
                onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                className="px-5 py-2.5 border border-white/5 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all hover:text-[#afff00] active:scale-95"
            >
                Disconnect
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
                <motion.h1 
                  className="text-6xl md:text-8xl lg:text-[10vw] font-black italic tracking-tighter uppercase mb-6 leading-[0.8] text-white flex flex-wrap justify-center gap-x-[0.5em]"
                >
                  {(user?.subscription?.status === 'inactive' ? 'ACTIVATE YOUR ENGINE' : 'ACTIVATE YOUR NODE').split(" ").map((word, wIdx) => (
                    <span key={wIdx} className="flex whitespace-nowrap">
                      {word.split("").map((char, cIdx) => (
                        <motion.span
                          key={cIdx}
                          whileHover={{ 
                            scale: 1.2, 
                            y: -15, 
                            color: '#afff00',
                            textShadow: '0 0 30px rgba(175,255,0,0.5)' 
                          }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 400, 
                            damping: 10 
                          }}
                          className="inline-block cursor-default select-none"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </span>
                  ))}
                </motion.h1>
                <p className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-white/30 max-w-2xl mx-auto leading-loose">
                    {user?.subscription?.status === 'inactive' 
                      ? 'Select a settlement tier to unlock real-time alerts and instant liquidity for your stream.' 
                      : 'Sync with a settlement layer to begin scaling with tactical precision.'}
                </p>

                {/* --- TRIAL COUNTDOWN WIDGET --- */}
                {user?.subscription?.isTrial && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="mt-8 inline-flex flex-col items-center gap-2 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-md"
                   >
                     <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Trial Protocol Active</span>
                     </div>
                     <div className="text-2xl font-mono font-black tracking-widest text-white">
                        {Math.ceil(user.subscription.trialRemainingMs / (1000 * 60 * 60 * 24))} DAYS REMAINING
                     </div>
                   </motion.div>
                )}
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
                            className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === item.m ? 'bg-[#afff00] text-black shadow-[0_0_30px_rgba(175,255,0,0.2)]' : 'text-white/40 hover:text-white/60'}`}
                        >
                            {item.label}
                            {item.save && <span className="ml-2 font-black italic opacity-60">(-{item.save})</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* --- THE TIERS: THE ENGINE --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {ALL_PLANS.map((plan, idx) => {
                const isSelected = selectedPlan === plan.id;
                const ac = accentMap[plan.accentColor];
                
                return (
                    <motion.div
                        key={plan.id}
                        layoutId={`card-${plan.id}`}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => { setSelectedPlan(plan.id); setExpandedPlanId(plan.id); }}
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
                                <div className={`p-4 rounded-xl border transition-all duration-700 ${isSelected ? `${ac.bg} ${ac.border} shadow-[0_0_20px_rgba(175,255,0,0.1)]` : 'bg-white/5 border-white/10'}`}>
                                    <plan.icon className={`w-10 h-10 transition-all duration-700 ${isSelected ? ac.text : 'text-white/20'}`} />
                                </div>
                                <div className="text-right">
                                    <div className={`text-4xl font-black italic tracking-tighter transition-colors ${isSelected ? 'text-white' : 'text-white/40'}`}>
                                        ₹{Math.round(plan.price * billingCycle * (billingCycle === 12 ? 0.7 : billingCycle === 6 ? 0.85 : 1)).toLocaleString('en-IN')}
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
                                    <div key={fIdx} className={`flex items-center gap-3 transition-opacity duration-700 ${isSelected ? 'opacity-100' : 'opacity-20'}`}>
                                        <CheckCircle className={`w-4 h-4 ${isSelected ? 'text-[#afff00]' : 'text-white/20'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA ACTION */}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleSubscribe(plan.id); }}
                                disabled={isProcessing}
                                className={`w-full py-4.5 rounded-xl font-black uppercase italic text-[10px] tracking-[0.3em] transition-all duration-700 flex justify-center items-center gap-2 group/btn
                                    ${isSelected 
                                        ? `${ac.btn} scale-100` 
                                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white border border-white/10'}`}
                            >
                                {isProcessing && selectedPlan === plan.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {plan.id === 'legend' ? 'INITIALIZE NODE' : 'SELECT TIER'}
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {/* LEGEND BREATHING PULSE FX */}
                        {ac.pulse && isSelected && (
                            <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.1, 0.4, 0.1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 pointer-events-none rounded-[2.5rem] border-2 border-[#afff00]" />
                        )}
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
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-12 opacity-40 border-t border-white/10 pt-12">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#afff00]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">AES-256 Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#afff00]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">High-Speed Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#afff00]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">PCI-DSS Secure</span>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <CreditCard className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Powered by Razorpay</span>
            </div>
        </div>
      </main>

      {/* --- EXPANSION HUB: ACTIVATION TERMINAL --- */}
      <AnimatePresence>
        {expandedPlanId && (() => {
            const plan = ALL_PLANS.find(p => p.id === expandedPlanId);
            const ac = accentMap[plan.accentColor];
            return (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setExpandedPlanId(null)}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl cursor-zoom-out"
                    />
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div 
                            layoutId={`card-${expandedPlanId}`}
                            className={`relative z-[120] w-full max-w-2xl bg-[#0c0c0c] border-2 ${ac.border} rounded-[3rem] p-8 sm:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto`}
                        >
                        <button 
                            onClick={() => setExpandedPlanId(null)}
                            className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors p-2"
                        >
                            <ArrowRight className="w-6 h-6 rotate-180" />
                        </button>

                        <div className="flex flex-col md:flex-row gap-12 items-start h-full">
                            <div className="flex-1 space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className={`p-6 rounded-2xl border ${ac.bg} ${ac.border} shadow-[0_0_40px_rgba(175,255,0,0.1)]`}>
                                        <plan.icon className={`w-12 h-12 ${ac.text}`} />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter text-white leading-none mb-2">{plan.name}</h2>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${ac.text}`}>Secure Settlement Mode</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {plan.features.map((feature, fIdx) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + (fIdx * 0.05) }}
                                            key={fIdx} 
                                            className="flex items-center gap-4"
                                        >
                                            <CheckCircle className="w-5 h-5 text-[#afff00]" />
                                            <span className="text-sm font-bold uppercase tracking-widest text-white/80">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full md:w-[300px] flex flex-col justify-between self-stretch bg-white/5 rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <CreditCard className="w-24 h-24" />
                                </div>
                                
                                <div className="mb-12">
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 block mb-4">Total Amount Due</span>
                                    <div className="text-5xl font-black italic tracking-tighter text-white">
                                        ₹{Math.round(plan.price * billingCycle * (billingCycle === 12 ? 0.7 : billingCycle === 6 ? 0.85 : 1)).toLocaleString('en-IN')}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80 mt-2 block">All protocols secure</span>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => handleSubscribe(plan.id)}
                                        disabled={isProcessing}
                                        className="w-full py-6 rounded-2xl bg-[#afff00] text-black font-black uppercase italic text-[12px] tracking-[0.4em] shadow-[0_20px_60px_rgba(175,255,0,0.2)] hover:bg-[#c6ff00] transition-all hover:translate-y-[-4px] active:translate-y-0"
                                    >
                                        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'PROCEED TO UPLINK'}
                                    </button>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-center text-white/20">Secure handshake with Razorpay</p>
                                </div>
                            </div>
                        </div>

                        {/* Background Detail */}
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#afff00]/5 blur-[100px] pointer-events-none" />
                    </motion.div>
                </div>
                </>
            );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default Subscription;

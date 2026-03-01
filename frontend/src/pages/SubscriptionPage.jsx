import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift, CheckCircle, Clock,
  Rocket, Crown, Sparkles, Loader2,
  ArrowRight, ShieldCheck, Cpu, Database, Activity, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

// API_BASE is now handled by the centralized axios configuration in src/api/axios.js

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  const theme = localStorage.getItem('dropPayTheme') || 'dark';

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

  // --- UPDATED HANDSHAKE LOGIC ---
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
          ondismiss: () => setLoadingPlan(null) // FIX: Kills loading spinner on cancel
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
    { id: 'starter', name: 'Core Node', price: 699, fee: '15%', icon: Database, color: 'text-slate-400', glow: 'shadow-slate-500/10', border: 'border-slate-500/20', info: 'Weekly Payouts', badge: 'Standard Entry', bIcon: Target },
    { id: 'pro', name: 'Elite Mesh', price: 1499, fee: '10%', icon: Cpu, color: 'text-[#10B981]', glow: 'shadow-[#10B981]/20', border: 'border-[#10B981]/30', info: '48hr Payouts', popular: true, badge: 'Peak Performance', bIcon: Rocket },
    { id: 'legend', name: 'Legendary Uplink', price: 2499, fee: '5%', icon: ShieldCheck, color: 'text-amber-400', glow: 'shadow-amber-400/20', border: 'border-amber-400/30', info: 'Instant Payouts', badge: 'VIP Priority', bIcon: Crown }
  ];

  return (
    <div className={`h-screen transition-colors duration-700 font-sans flex flex-col relative overflow-hidden ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>

      <div className={`absolute top-[-20%] left-1/2 -translate-x-1/2 w-full h-[60vh] blur-[140px] pointer-events-none transition-all duration-1000 
        ${selectedPlan === 'legend' ? 'bg-amber-400/10' : selectedPlan === 'starter' ? 'bg-slate-400/10' : 'bg-[#10B981]/15'}`}
      />


      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 overflow-y-auto no-scrollbar relative z-10 pb-8">

        <header className="text-center flex flex-col items-center mt-1 md:mt-2">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-1.5 mb-3">
            <div className="bg-[#10B981]/10 text-[#10B981] px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-[#10B981]/20 flex items-center gap-2">
              <Gift className="w-3.5 h-3.5" /> <Sparkles className="w-3.5 h-3.5" /> 7-Day Trial Socket Enabled
            </div>
            <div className="flex items-center gap-2 text-amber-500 font-mono text-[8px] font-black bg-amber-500/5 px-3 py-1 rounded-xl border border-amber-500/10 tracking-widest uppercase">
              <Activity className="w-3 h-3 animate-pulse" />
              Expiry: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </motion.div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black italic uppercase mb-5 leading-none tracking-tighter">
            Activate <span className={selectedPlan === 'legend' ? 'text-amber-400' : selectedPlan === 'starter' ? 'text-slate-400' : 'text-[#10B981]'}>Your Node.</span>
          </h1>

          <div className={`p-1 rounded-[2rem] border flex gap-1 transition-all mb-6 ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'}`}>
            {[
              { m: 1, label: 'Monthly', color: 'bg-[#10B981]' },
              { m: 6, label: '6 Months', disc: '15% Off', color: 'bg-[#10B981]' },
              { m: 12, label: 'Yearly', disc: '30% Off', color: 'bg-amber-500' }
            ].map((item) => (
              <button key={item.m} onClick={() => setBillingCycle(item.m)}
                className={`px-5 py-2.5 md:px-9 md:py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all flex flex-col items-center min-w-[95px] md:min-w-[145px] ${billingCycle === item.m ? `${item.color} text-white shadow-lg scale-[1.05]` : 'text-slate-500 hover:text-white'}`}
              >
                {item.label}
                {item.disc && <span className={`text-[7px] mt-0.5 font-bold ${billingCycle === item.m ? 'text-white' : 'text-emerald-500'}`}>{item.disc}</span>}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            {plans.map((plan, index) => {
              const { discounted } = getPriceData(plan.price);
              const isActive = selectedPlan === plan.id;
              const isThisLoading = loadingPlan === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative border cursor-pointer rounded-[2.5rem] p-7 md:p-8 flex flex-col transition-all duration-500 group
                  ${plan.id === 'legend' ? 'md:col-span-2 lg:col-span-1' : ''}
                  ${isActive ? `bg-[#0a0a0a] ${plan.border} shadow-2xl ${plan.glow} scale-[1.02]` : 'bg-[#0a0a0a]/50 border-white/5 hover:border-white/10'}`}
                >
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full font-black uppercase tracking-[0.3em] text-[7.5px] shadow-xl border transition-all 
                  ${isActive ? `${plan.id === 'legend' ? 'bg-amber-400 text-black' : plan.id === 'starter' ? 'bg-slate-400 text-black' : 'bg-[#10B981] text-white'} border-transparent` : 'bg-[#0a0a0a] text-slate-500 border-white/10'}`}>
                    <plan.bIcon className="w-2.5 h-2.5" /> {plan.badge}
                  </div>

                  <plan.icon className={`w-9 h-9 md:w-10 md:h-10 ${isActive ? (plan.id === 'legend' ? 'text-amber-400' : plan.id === 'starter' ? 'text-slate-400' : 'text-[#10B981]') : 'text-slate-600'} mb-5 md:mb-6 transition-colors duration-500`} />
                  <h3 className={`text-xl font-black italic uppercase mb-1 ${isActive ? 'text-white' : 'text-slate-500'}`}>{plan.name}</h3>

                  <div className="mb-6">
                    <span className="text-3xl md:text-4xl font-black italic">₹{discounted.toLocaleString('en-IN')}</span>
                  </div>

                  <ul className="space-y-3.5 md:space-y-4 mb-8 flex-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <li className={`flex items-center gap-3.5 transition-colors ${isActive ? 'text-white' : ''}`}><CheckCircle className={`w-4 h-4 ${plan.id === 'legend' ? 'text-amber-400' : plan.id === 'starter' ? 'text-slate-400' : 'text-[#10B981]'}`} /> {plan.fee} Revenue Split</li>
                    <li className={`flex items-center gap-3.5 transition-colors ${isActive ? 'text-white' : ''}`}><Clock className={`w-4 h-4 ${plan.id === 'legend' ? 'text-amber-400' : plan.id === 'starter' ? 'text-slate-400' : 'text-[#10B981]'}`} /> {plan.info}</li>
                    <li className={`flex items-center gap-3.5 transition-colors ${isActive ? 'text-white' : ''}`}><ShieldCheck className={`w-4 h-4 ${plan.id === 'legend' ? 'text-amber-400' : plan.id === 'starter' ? 'text-slate-400' : 'text-[#10B981]'}`} /> Enterprise Alert Node</li>
                  </ul>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleSubscribe(plan.id); }}
                    disabled={loadingPlan !== null}
                    className={`w-full py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-[0.3em] transition-all flex justify-center items-center gap-3 ${isThisLoading
                      ? 'bg-slate-800 text-slate-500'
                      : isActive ? (plan.id === 'legend' ? 'bg-amber-400 text-black' : plan.id === 'starter' ? 'bg-slate-400 text-black' : 'bg-[#10B981] text-white') : 'bg-white text-black hover:bg-slate-200'
                      }`}
                  >
                    {isThisLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <>Deploy Node <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPage;
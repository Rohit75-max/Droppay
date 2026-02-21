import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Gift, CheckCircle, Clock, 
  Rocket, Crown, Sparkles, LogOut, Loader2, Timer, TrendingDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState(1);
  const [loadingPlan, setLoadingPlan] = useState(null); // UPDATED: Tracks specific plan loading
  const [userStatus, setUserStatus] = useState(null); 
  const [userProfile, setUserProfile] = useState(null);
  
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserStatus(res.data.subscription?.status);
        setUserProfile(res.data);
      } catch (err) { console.error("Status sync failed"); }
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getPriceData = (base) => {
    const original = base * billingCycle;
    let discounted = original;
    let savings = 0;

    if (billingCycle === 6) {
      discounted = Math.round(original * 0.85);
      savings = original - discounted;
    }
    if (billingCycle === 12) {
      discounted = Math.round(original * 0.70);
      savings = original - discounted;
    }

    return { original, discounted, savings };
  };

  /**
   * RECURRING AUTOPAY LOGIC
   * Automatically triggers Tier upgrade on backend upon success
   */
  const handleSubscribe = async (planId) => {
    setLoadingPlan(planId); // SET WHICH PLAN IS LOADING
    const token = localStorage.getItem('token');

    try {
      // 1. Create Recurring Subscription ID
      const subRes = await axios.post('http://localhost:5001/api/payment/create-subscription', 
        { planId, billingCycle }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_SHrX3upgmJ6sGL", 
        subscription_id: subRes.data.id,
        name: "DropPay Mission",
        description: `Recurring ${planId} Plan Deployment`,
        handler: async (response) => {
          try {
            // 2. Verify Subscription & Backend Tier Update
            const verifyRes = await axios.post('http://localhost:5001/api/payment/verify-subscription', {
              plan: planId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (verifyRes.data.status === 'success') {
              // 3. SUCCESS REDIRECT
              window.location.href = '/dashboard';
            }
          } catch (err) {
            console.error("Verification Error:", err);
            alert("Autopay Verification Failed. If payment was cut, contact support.");
            setLoadingPlan(null); // Reset on error
          }
        },
        prefill: {
          name: userProfile?.username || "",
          email: userProfile?.email || ""
        },
        theme: { color: "#4F46E5" },
        modal: {
          ondismiss: function() {
            setLoadingPlan(null); // RESET LOADING IF USER CLOSES POPUP
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Setup Error:", err);
      alert("Autopay Setup Failed. Ensure Plan IDs are correct in server .env");
      setLoadingPlan(null); // Reset on error
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center p-6 lg:px-12 relative z-10">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-indigo-500 fill-indigo-500" />
          <span className="text-xl font-black italic tracking-tighter uppercase">DropPay</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-400 font-black uppercase text-[10px] transition-all">
          <LogOut className="w-4 h-4" /> Exit System
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 pb-12 relative z-10">
        <header className="text-center mb-10 w-full">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-green-500/20 flex items-center gap-2">
              <Gift className="w-3 h-3" /> 7-Day Free Trial Included
            </div>
            <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-bold bg-amber-500/5 px-3 py-1 rounded-lg border border-amber-500/10">
              <Timer className="w-3 h-3" />
              <span>OFFER EXPIRES IN: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black italic tracking-tighter uppercase mb-8 leading-tight px-4">Deploy Your Mission</h1>
          
          <div className="flex justify-center w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="bg-[#111] p-1.5 rounded-2xl border border-white/5 flex gap-1 min-w-max">
              {[
                { m: 1, label: 'Monthly', disc: null },
                { m: 6, label: '6 Months', disc: 'Save 15%' },
                { m: 12, label: 'Yearly', disc: 'Save 30%' }
              ].map((item) => (
                <button key={item.m} onClick={() => setBillingCycle(item.m)} 
                  className={`px-6 sm:px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex flex-col items-center ${billingCycle === item.m ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {item.label} 
                  {item.disc && <span className={`text-[8px] mt-0.5 ${billingCycle === item.m ? "text-indigo-200" : "text-green-500"}`}>{item.disc}</span>}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full items-stretch max-w-6xl">
          {[
            { id: 'starter', name: 'Starter', price: 699, fee: '15%', icon: Sparkles, color: 'text-slate-400', info: 'Weekly Payouts' },
            { id: 'pro', name: 'Pro Elite', price: 1499, fee: '10%', icon: Rocket, color: 'text-indigo-400', info: '48hr Payouts', popular: true },
            { id: 'legend', name: 'Legend', price: 2499, fee: '5%', icon: Crown, color: 'text-amber-400', info: 'Instant Payouts' }
          ].map((plan) => {
            const isTrialUsed = plan.id === 'starter' && userStatus === 'expired';
            const { original, discounted, savings } = getPriceData(plan.price);
            
            // Check if THIS specific button is loading
            const isThisLoading = loadingPlan === plan.id;
            // Check if ANY button is loading
            const isAnyLoading = loadingPlan !== null;

            return (
              <motion.div key={plan.id} whileHover={{ y: -8 }} className={`relative bg-[#0a0a0a] border ${plan.popular ? 'border-indigo-500 shadow-[0_0_60px_rgba(99,102,241,0.15)]' : 'border-white/5'} rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 flex flex-col ${isTrialUsed ? 'opacity-40 grayscale' : ''}`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-[9px] px-6 py-1.5 rounded-full font-black uppercase tracking-widest shadow-lg min-w-max">Commander's Choice</div>}
                
                <plan.icon className={`w-10 h-10 ${plan.color} mb-8`} />
                <h3 className="text-xl font-black italic uppercase text-white mb-2">{plan.name}</h3>
                
                <div className="mb-8">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-4xl font-black italic text-white">₹{discounted}</span>
                    {billingCycle > 1 && plan.price > 0 && (
                      <span className="text-slate-600 line-through text-lg font-bold">₹{original}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{billingCycle > 1 ? `${billingCycle} Months Access` : '/ Month'}</span>
                    {savings > 0 && (
                      <span className="bg-green-500/10 text-green-500 text-[9px] px-2 py-0.5 rounded font-black uppercase flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" /> Save ₹{savings}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 sm:space-y-5 mb-10 flex-1 text-[12px] font-bold text-slate-400">
                  <li className="flex items-center gap-4"><CheckCircle className="w-4 h-4 text-green-500" /> {plan.fee} Creator Fee</li>
                  <li className="flex items-center gap-4"><Clock className="w-4 h-4 text-indigo-500" /> {plan.info}</li>
                  <li className="flex items-center gap-4"><CheckCircle className="w-4 h-4 text-indigo-500" /> All Core Features</li>
                </ul>

                <button 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isAnyLoading || isTrialUsed}
                  className={`w-full py-4 sm:py-5 rounded-2xl font-black uppercase italic text-[11px] transition-all active:scale-95 shadow-xl flex justify-center items-center gap-2 ${
                    isTrialUsed 
                    ? 'bg-red-500/10 text-red-500 cursor-not-allowed border border-red-500/20' 
                    : isAnyLoading && !isThisLoading // Grey out other buttons
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : plan.id === 'starter' ? 'bg-white text-black hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  {isThisLoading ? (
                    <><Loader2 className="animate-spin w-4 h-4" /> Deploying...</>
                  ) : isTrialUsed ? (
                    'Mission Locked'
                  ) : (
                    'Deploy Plan'
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPage;
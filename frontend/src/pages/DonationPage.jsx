import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import {
  Send, ShieldCheck, Zap, IndianRupee, MessageSquare, Loader2, Sparkles,
  CheckCircle, Award, Trophy, User, Crown, Smile, Volume2, Lock, Target, UserCircle, Gift
} from 'lucide-react';

// --- MODULAR IMPORT ---
import AlertPreview from '../components/AlertPreview';
import CyberGoalBar from '../components/CyberGoalBar';
import PremiumGoalOverlays from '../components/PremiumGoalOverlays';
import DigitalStore from '../components/DigitalStore';

const PREMIUM_GOAL_STYLES = [
  'black_hole', 'hex_core', 'rune_monolith', 'hologram_glitch',
  'alchemist_flask', 'redline_dash', 'loot_dispenser', 'mecha_lens'
];

const globalStickers = [
  { id: 'hype_zap', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json', price: 20, color: 'from-yellow-400 to-orange-500', sound: '/sounds/zap.mp3' },
  { id: 'fire_rocket', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json', price: 50, color: 'from-orange-500 to-red-600', sound: '/sounds/fire.mp3' },
  { id: 'super_heart', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/lottie.json', price: 100, color: 'from-pink-500 to-rose-600', sound: '/sounds/love.mp3' },
  { id: 'alien_visit', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f47d/lottie.json', price: 150, color: 'from-green-400 to-emerald-500', sound: '/sounds/zap.mp3' },
  { id: 'driving_car', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f697/lottie.json', price: 200, color: 'from-blue-400 to-indigo-500', sound: '/sounds/rocket.mp3' },
  { id: 'football_goal', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26bd/lottie.json', price: 250, color: 'from-gray-400 to-slate-500', sound: '/sounds/fire.mp3' },
  { id: 'flying_bird', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f426/lottie.json', price: 300, color: 'from-sky-400 to-blue-500', sound: '/sounds/magic.mp3' },
  { id: 'gold_trophy', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/lottie.json', price: 500, color: 'from-amber-400 to-yellow-600', sound: '/sounds/king.mp3' },
  { id: 'party_popper', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/lottie.json', price: 1000, color: 'from-indigo-500 to-purple-600', sound: '/sounds/rocket.mp3' },
  { id: 'diamond_gem', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f48e/lottie.json', price: 5000, color: 'from-cyan-400 to-blue-500', sound: '/sounds/magic.mp3' },
];

const runnerMap = {
  star: 'https://lottie.host/246e382d-1144-48f1-8fbd-7ebc24f2b1d3/gYtH5RkIfL.json',
  car: 'https://lottie.host/23c683ee-c0a4-443b-ab5e-b9b596255d64/vN43wP2rRk.json',
  rocket: 'https://lottie.host/b0dc5e70-2216-43dd-b883-fa4c038d1033/D1d51tK2rO.json',
  fire: 'https://lottie.host/c02f7415-3733-4f51-b8ef-f15599026402/1A5Xz2P99Q.json'
};

const DonationPage = () => {
  const { streamerId } = useParams();
  const navigate = useNavigate();
  const [streamer, setStreamer] = useState(null);
  const [topDonors, setTopDonors] = useState([]);
  const [amount, setAmount] = useState(20);
  const [selectedSticker, setSelectedSticker] = useState('https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json');
  const [activeTab, setActiveTab] = useState('global');
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [playingSound, setPlayingSound] = useState(null);

  // New State for Top-Level Toggle
  const [storeMode, setStoreMode] = useState('classic'); // 'classic' or 'premium'

  const [goal, setGoal] = useState({ title: "Loading...", currentProgress: 0, targetAmount: 100 });
  const [isGoalActive, setIsGoalActive] = useState(false);
  const [runnerUrl, setRunnerUrl] = useState(runnerMap.star);

  const quickEmotes = ['💀', '😂', '🔥', '🐐', '💯', 'W', 'L', '🤡', '👽', '👀', '💖'];

  useEffect(() => {
    (async () => {
      try {
        const [s, t, g] = await Promise.all([
          axios.get(`http://localhost:5001/api/user/public/${streamerId}`),
          axios.get(`http://localhost:5001/api/payment/top/${streamerId}`),
          axios.get(`http://localhost:5001/api/payment/goal/${streamerId}`).catch(() => ({ data: null }))
        ]);
        setStreamer(s.data);
        setTopDonors(t.data.slice(0, 3));
        if (g.data) {
          const settings = g.data.goalSettings || g.data.goal || g.data;
          setGoal({ title: settings.title || "Active Objective", currentProgress: settings.currentProgress || 0, targetAmount: settings.targetAmount || 100, stylePreference: settings.stylePreference || 'modern' });
          setIsGoalActive(settings.isActive ?? false);
          const rType = settings.runnerType || 'star';
          setRunnerUrl(rType === 'custom' ? settings.customRunnerUrl : (runnerMap[rType] || runnerMap.star));
        }
      } catch {
        setStreamer({ username: streamerId.toUpperCase(), streamerId, tier: 'none' });
      } finally { setLoading(false); }
    })();
  }, [streamerId]);

  useEffect(() => {
    const socket = io('http://localhost:5001');
    socket.emit('join-room', streamerId);
    socket.on('goal-update', (updatedGoal) => {
      setGoal(prev => ({ ...prev, ...updatedGoal }));
      if (updatedGoal.isActive !== undefined) setIsGoalActive(updatedGoal.isActive);
      if (updatedGoal.runnerType) {
        setRunnerUrl(updatedGoal.runnerType === 'custom' ? updatedGoal.customRunnerUrl : (runnerMap[updatedGoal.runnerType] || runnerMap.star));
      }
    });

    socket.on('settings-update', (updatedSettings) => {
      setStreamer(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          overlaySettings: { ...prev.overlaySettings, ...updatedSettings }
        };
      });
    });

    socket.on('new-drop', (data) => {
      if (data.isTest) return; // Ignore Test Signals on public tracking

      setTopDonors(prev => {
        const updated = [...prev];
        const existingIdx = updated.findIndex(d => d._id?.toLowerCase() === data.donorName?.toLowerCase());

        if (existingIdx >= 0) {
          const currentTotal = updated[existingIdx].totalAmount || updated[existingIdx].total || 0;
          updated[existingIdx].totalAmount = currentTotal + Number(data.amount);
        } else {
          updated.push({ _id: data.donorName, totalAmount: Number(data.amount) });
        }

        return updated.sort((a, b) => {
          const totalA = a.totalAmount || a.total || 0;
          const totalB = b.totalAmount || b.total || 0;
          return totalB - totalA;
        }).slice(0, 10);
      });
    });

    return () => socket.disconnect();
  }, [streamerId]);

  const playSoundPreview = (e, id, path) => {
    e.stopPropagation(); setPlayingSound(id);
    new Audio(path).play().catch(() => { });
    setTimeout(() => setPlayingSound(null), 2000);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!window.Razorpay) {
      alert("Error: Razorpay SDK failed to load. Please disable your adblocker or check your internet connection.");
      return;
    }
    setIsProcessing(true);
    try {
      const { data } = await axios.post('http://localhost:5001/api/payment/create-order', {
        streamerId, amount: Number(amount), donorName: donorName || 'Anonymous', message, sticker: selectedSticker
      });
      new window.Razorpay({
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_SHrX3upgmJ6sGL",
        amount: data.amount, currency: "INR", name: "DropPay Protocol", order_id: data.id,
        handler: async (res) => {
          try {
            await axios.post('http://localhost:5001/api/payment/verify', { ...res, streamerId, donorName: donorName || 'Anonymous', message, sticker: selectedSticker, amount: Number(amount) });
            setIsSuccess(true);
          } catch (err) {
            console.error("Webhook Verification Error:", err);
            alert(err.response?.data?.msg || "Payment was captured but verification failed. Streamer Not Found.");
          } finally {
            setIsProcessing(false);
          }
        }, modal: { ondismiss: () => setIsProcessing(false) }
      }).open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert(err.response?.data?.msg || "Payment encountered an unexpected failure.");
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-[#10B981]"><Loader2 className="animate-spin w-12 h-12" /></div>;

  const isLegend = streamer?.tier === 'legend';
  const hasCustomPack = streamer?.tier === 'pro' || streamer?.tier === 'legend'; // VARIABLE NOW USED BELOW
  const goalPercentage = Math.min((goal.currentProgress / goal.targetAmount) * 100, 100);
  const currentTier = amount >= 2000 ? 'legendary' : amount >= 500 ? 'epic' : 'standard';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative flex flex-col pb-12">
      {/* --- DONATION NEXUS NAVBAR --- */}
      <header className="px-6 py-4 md:px-12 md:py-6 flex justify-between items-center z-40 bg-white border-b border-slate-200 shadow-sm mb-6 md:mb-10 w-full">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
          <Zap className="w-6 h-6 text-[#10B981] fill-[#10B981]" />
          <span className="text-xl md:text-2xl font-black italic text-slate-900 tracking-tighter">DropPay</span>
        </div>
        <h1 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter leading-none text-slate-900">
          Donation <span className="text-[#10B981]">Nexus.</span>
        </h1>
      </header>
      <main className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col z-10 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full items-start">

          {/* LEFT COLUMN: 50% */}
          <div className="lg:col-span-1 flex flex-col h-full space-y-6 lg:space-y-8 min-h-0">
            {/* TOP ROW: ACCOUNT & SUPPORTERS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch shrink-0">

              {/* ACCOUNT CARD */}
              <div className={`relative overflow-hidden border ${isLegend ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-slate-200'} backdrop-blur-2xl rounded-[2rem] lg:rounded-[2.5rem] p-6 text-center flex flex-col items-center justify-center shadow-2xl min-h-[180px] lg:min-h-[220px]`}>
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-full p-1 mb-4 ${isLegend ? 'bg-amber-500' : 'bg-[#10B981]'} z-10`}>
                  <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center border-4 border-[#111]">
                    <User className="w-6 h-6 lg:w-8 lg:h-8 text-slate-600" />
                  </div>
                </div>
                {streamer?.tier && streamer.tier !== 'none' && (
                  <div className={`relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-3 lg:mb-4 text-[8px] lg:text-[9px] font-black uppercase italic ${isLegend ? 'text-amber-500 border-amber-500/30' : 'text-[#10B981] border-[#10B981]/30'} bg-slate-50`}>
                    <Crown className="w-3 h-3" /> {streamer.tier} Verified
                  </div>
                )}
                <p className="relative z-10 text-base lg:text-lg font-mono font-black mb-1 lg:mb-3">@{streamer?.streamerId}</p>
              </div>

              {/* TOP SUPPORTERS CARD */}
              <div className="relative overflow-hidden border border-slate-200 bg-white backdrop-blur-2xl rounded-[2rem] lg:rounded-[2.5rem] p-6 shadow-xl flex flex-col min-h-[180px] lg:min-h-[220px]">
                <div className="relative z-10 flex items-center gap-3 mb-4 lg:mb-5">
                  <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-[#10B981]" />
                  <h3 className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-slate-900 italic">Top Supporters <Award className="inline w-3 h-3 ml-1" /></h3>
                </div>
                <div className="relative z-10 space-y-2 lg:space-y-3 flex-1 flex flex-col justify-center">
                  {topDonors.length > 0 ? topDonors.slice(0, 3).map((d, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 lg:p-3 rounded-xl lg:rounded-2xl border bg-white border-slate-200">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg lg:rounded-xl flex items-center justify-center font-black text-[9px] lg:text-[10px] bg-slate-100 text-slate-900">#{i + 1}</div>
                      <p className="font-black text-[9px] lg:text-[10px] uppercase truncate text-slate-900 max-w-[80px] lg:max-w-[120px]">{d._id}</p>
                      <p className="font-black text-[10px] lg:text-xs italic ml-auto text-[#10B981]">₹{d.totalAmount || d.total}</p>
                    </div>
                  )) : (
                    <div className="text-center py-6 opacity-30 italic text-[10px] font-bold uppercase tracking-widest">Awaiting First Drop...</div>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM AREA: ACTIVE GOAL BAR (Minimal Container) */}
            <div className="flex-1 min-h-0 relative overflow-visible flex flex-col justify-center py-4">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              {isGoalActive ? (
                <div className="relative z-10 w-full flex items-center justify-center">
                  {PREMIUM_GOAL_STYLES.includes(goal.stylePreference) ? (
                    <PremiumGoalOverlays
                      goal={goal}
                      percentage={goalPercentage}
                      isComplete={goal.currentProgress >= goal.targetAmount}
                    />
                  ) : (
                    <CyberGoalBar
                      goal={goal}
                      tier={streamer?.tier || 'starter'}
                      runnerUrl={runnerUrl}
                      percentage={goalPercentage}
                      isComplete={goal.currentProgress >= goal.targetAmount}
                      goalStylePreference={goal.stylePreference || streamer?.goalSettings?.stylePreference || 'modern'}
                    />
                  )}
                </div>
              ) : (
                <div className="relative z-10 text-center flex flex-col items-center justify-center opacity-40">
                  <Target className="w-12 h-12 lg:w-16 lg:h-16 mb-4 text-slate-600" />
                  <p className="text-xs lg:text-sm font-black uppercase tracking-widest text-slate-500">No Active Mission</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: 50% (PREVIEW + FORM) */}
          <div className="lg:col-span-1 flex flex-col h-full min-h-0 space-y-6 lg:space-y-8">

            {/* COMPACT ALERT PREVIEW (Only show in Classic Mode for now to save space, or keep it small) */}
            {storeMode === 'classic' && (
              <div className="shrink-0 bg-slate-50 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-200 p-4 lg:p-6 lg:pb-8 flex flex-col items-center justify-center relative min-h-[160px] lg:min-h-[200px]">
                <p className="absolute top-4 lg:top-5 left-0 w-full text-[10px] font-black uppercase tracking-[0.2em] mb-0 text-center italic text-slate-500 z-10">Live Preview</p>

                <div className="w-full flex justify-center items-center mt-6 lg:mt-8 pointer-events-none">
                  <div className="scale-[0.6] sm:scale-[0.7] lg:scale-[0.8] origin-center flex justify-center w-full">
                    <AlertPreview theme='light' donorName={donorName || 'Donor'} amount={Number(amount) || 0} message={message || 'Message...'} sticker={selectedSticker} tier={streamer?.tier || 'starter'} stylePreference={streamer?.overlaySettings?.stylePreference || 'modern'} />
                  </div>
                </div>
              </div>
            )}

            {/* TOP LEVEL TOGGLE */}
            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shrink-0">
              <button
                onClick={() => setStoreMode('classic')}
                className={`flex-1 py-3 lg:py-4 rounded-xl text-xs lg:text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${storeMode === 'classic' ? 'bg-[#10B981] text-black shadow-lg shadow-[#10B981]/20' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <Zap className="w-4 h-4" /> Classic Drop
              </button>
              <button
                onClick={() => setStoreMode('premium')}
                className={`flex-1 py-3 lg:py-4 rounded-xl text-xs lg:text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${storeMode === 'premium' ? 'bg-indigo-500 text-slate-900 shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <Sparkles className="w-4 h-4" /> Premium Store
              </button>
            </div>

            {/* CONDITIONAL RENDER: CLASSIC FORM OR DIGITAL STORE */}
            {storeMode === 'classic' ? (
              <motion.div layout className="flex-1 bg-white border border-slate-200 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-7 shadow-2xl relative lg:overflow-y-auto lg:scrollbar-hide flex flex-col">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <form key="form" onSubmit={handlePayment} className="space-y-6">
                      <div className="flex gap-4 border-b border-slate-200 pb-2">
                        <button type="button" onClick={() => setActiveTab('global')} className={`pb-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'global' ? 'border-b-2 border-[#10B981] text-[#10B981]' : 'text-slate-500'}`}>Global Pack</button>

                        {/* FIXED: hasCustomPack USED TO SHOW LOCK ICON */}
                        <button type="button" onClick={() => setActiveTab('partner')} className={`pb-2 text-[10px] sm:text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'partner' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-slate-500'}`}>
                          Partner Pack {!hasCustomPack && <Lock className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="min-h-[140px]">
                        <div className="grid grid-cols-5 gap-1.5">
                          {activeTab === 'global' ? (
                            globalStickers.map(s => (
                              <div key={s.id} onClick={() => { setSelectedSticker(s.url); setAmount(s.price); }} className={`relative py-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center ${selectedSticker === s.url ? 'bg-[#10B981]/10 border-[#10B981]' : 'bg-white border-slate-200'}`}>
                                <button type="button" onClick={(e) => playSoundPreview(e, s.id, s.sound)} className={`absolute top-1 right-1 p-0.5 rounded-full ${playingSound === s.id ? 'bg-[#10B981] text-black' : 'text-slate-500'}`}><Volume2 className="w-2 h-2" /></button>
                                <Player autoplay loop src={s.url} style={{ height: '40px', width: '40px' }} />
                                <span className="text-[8px] font-black mt-1">₹{s.price}</span>
                              </div>
                            ))
                          ) : (
                            /* FIXED: hasCustomPack USED TO RENDER GRID OR LOCK MESSAGE */
                            hasCustomPack ? (
                              streamer?.partnerPack?.map((s, idx) => (
                                <div key={idx} onClick={() => { setSelectedSticker(s.lottieUrl); setAmount(s.minAmount); }} className={`relative py-2.5 rounded-xl border-2 cursor-pointer flex flex-col items-center ${selectedSticker === s.lottieUrl ? 'bg-amber-500/10 border-amber-500' : 'bg-white border-slate-200'}`}>
                                  <Sparkles className="absolute top-1 right-1 w-2.5 h-2.5 text-amber-500" />
                                  <Player autoplay loop src={s.lottieUrl} style={{ height: '40px', width: '40px' }} />
                                  <span className="text-[8px] font-black mt-1">₹{s.minAmount}</span>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-5 h-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl opacity-40">
                                <Lock className="w-5 h-5 mb-1" />
                                <p className="text-[8px] font-black uppercase">Reach Pro Node Tier</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col space-y-4 lg:space-y-5">
                        <div className="grid grid-cols-2 gap-4 shrink-0">
                          <div className="relative">
                            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
                            <input placeholder="Name" value={donorName} className="w-full bg-white border border-slate-200 rounded-xl py-3 lg:py-5 px-12 text-xs lg:text-sm font-bold text-slate-900 outline-none focus:border-[#10B981]/50 transition-colors" onChange={e => setDonorName(e.target.value)} />
                          </div>
                          <div className="relative">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
                            <input type="number" value={amount} className="w-full bg-white border border-slate-200 rounded-xl py-3 lg:py-5 px-12 text-xs lg:text-sm font-black italic text-slate-900 outline-none focus:border-[#10B981]/50 transition-colors" onChange={e => setAmount(e.target.value)} />
                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[7px] lg:text-[8px] font-black uppercase tracking-widest pointer-events-none hidden sm:block ${currentTier === 'legendary' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                              currentTier === 'epic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                'bg-white/5 text-slate-600 border border-slate-200'
                              }`}>
                              {currentTier} Drop
                            </div>
                          </div>
                        </div>
                        <div className="relative flex-1 flex flex-col min-h-[100px] lg:min-h-[120px]">
                          <MessageSquare className="absolute left-4 top-4 text-slate-600 w-5 h-5" />
                          <textarea placeholder="Message..." maxLength={100} value={message} className="w-full h-full flex-1 bg-white border border-slate-200 rounded-xl py-4 lg:py-6 px-12 text-xs lg:text-sm text-slate-900 outline-none resize-none focus:border-[#10B981]/50 transition-colors" onChange={e => setMessage(e.target.value)} />
                          <div className="absolute bottom-3 left-12 right-4 flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                            <Smile className="w-4 h-4 text-slate-600 mr-2 shrink-0" />
                            {quickEmotes.map(e => (
                              <button key={e} type="button" onClick={() => setMessage(p => (p + e).slice(0, 100))} className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-slate-100 text-xs hover:border hover:border-slate-300 transition-all">{e}</button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 pt-2 lg:pt-4 space-y-2 mt-auto">
                        <button type="submit" disabled={isProcessing} className="w-full bg-[#10B981] py-4 lg:py-5 rounded-xl lg:rounded-2xl text-sm lg:text-lg text-black font-black flex items-center justify-center gap-3 uppercase italic transition hover:bg-emerald-400 shadow-lg shadow-[#10B981]/20">
                          {isProcessing ? <Loader2 className="animate-spin w-4 h-4 lg:w-5 lg:h-5" /> : <>Execute Drop <Zap className="w-4 h-4 lg:w-5 lg:h-5" /> <Send className="w-4 h-4 lg:w-5 lg:h-5" /></>}
                        </button>

                        <div className="flex items-center justify-center gap-4 text-slate-600 text-[6px] lg:text-[7px] font-black uppercase pt-1">
                          <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Secure Node</div>
                          <div className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> <Gift className="w-3 h-3" /> Razorpay Verified</div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-black italic uppercase">Drop Confirmed!</h2>
                      <button onClick={() => setIsSuccess(false)} className="mt-8 bg-white/5 border border-slate-200 px-8 py-4 rounded-xl text-xs font-black uppercase">
                        Send Another
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col min-h-0">
                <DigitalStore
                  streamer={streamer}
                  amount={amount}
                  setAmount={setAmount}
                  donorName={donorName}
                  setDonorName={setDonorName}
                  message={message}
                  setMessage={setMessage}
                  handlePayment={handlePayment}
                  isProcessing={isProcessing}
                />
              </motion.div>
            )}
          </div>

        </div>
      </main >
      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />
    </div >
  );
};

export default DonationPage;
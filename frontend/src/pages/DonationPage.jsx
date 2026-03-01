import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import {
  Send, ShieldCheck, Zap, IndianRupee, MessageSquare, Loader2, Sparkles,
  CheckCircle, Crown, Smile, Volume2, Lock, Target, UserCircle, Gift
} from 'lucide-react';

// --- MODULAR IMPORT ---
import AlertPreview from '../components/AlertPreview';
import CyberGoalBar from '../components/CyberGoalBar';
import PremiumGoalOverlays from '../components/PremiumGoalOverlays';
import DigitalStore from '../components/DigitalStore';
import TopSupporterWidget from '../components/widgets/TopSupporterWidget';
import DonationTicker from '../components/widgets/DonationTicker';
// Assuming we already have VerticalGoalBar somewhere or we adapt CyberGoalBar


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

// API_BASE is now handled by the centralized axios configuration in src/api/axios.js

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
  const [recentDrops, setRecentDrops] = useState([]); // For Ticker


  // New State for Top-Level Toggle
  const [storeMode, setStoreMode] = useState('classic'); // 'classic' or 'premium'

  const [goal, setGoal] = useState({ title: "Loading...", currentProgress: 0, targetAmount: 100 });
  const [isGoalActive, setIsGoalActive] = useState(false);
  const [runnerUrl, setRunnerUrl] = useState(runnerMap.star);

  // Tug-of-War State
  const [towEvent, setTowEvent] = useState(null);
  const [selectedSide, setSelectedSide] = useState(null);

  const quickEmotes = ['💀', '😂', '🔥', '🐐', '💯', 'W', 'L', '🤡', '👽', '👀', '💖'];

  useEffect(() => {
    (async () => {
      try {
        const [s, t, g, r] = await Promise.all([
          axios.get(`/api/user/public/${streamerId}`),
          axios.get(`/api/payment/top/${streamerId}`),
          axios.get(`/api/payment/goal/${streamerId}`).catch(() => ({ data: null })),
          axios.get(`/api/payment/recent/${streamerId}`).catch(() => ({ data: [] }))
        ]);
        // FORCE LIGHT GLASSMORPHISM THEME FOR DONATION PAGE
        if (s.data) {
          s.data.nexusTheme = 'aero';
          s.data.nexusThemeMode = 'light';
        }

        setStreamer(s.data);
        setTopDonors(t.data.slice(0, 5)); // Get top 5 for vertical list
        if (r.data && Array.isArray(r.data)) setRecentDrops(r.data.slice(0, 10)); // Max 10 for ticker


        // --- THEME PERSISTENCE ENGINE ---
        const theme = s.data.nexusTheme || 'void';
        const mode = s.data.nexusThemeMode || 'dark';

        // 1. Apply Classes to HTML/Body for global variable support
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(mode);

        const body = document.body;
        // Clean up previous themes
        body.className = body.className.replace(/theme-\S+/g, '').trim();
        if (theme !== 'void') {
          body.classList.add(`theme-${theme}`);
        }

        if (g.data) {
          const settings = g.data.goalSettings || g.data.goal || g.data;
          setGoal({ title: settings.title || "Active Objective", currentProgress: settings.currentProgress || 0, targetAmount: settings.targetAmount || 100, stylePreference: settings.stylePreference || 'modern' });
          setIsGoalActive(settings.isActive ?? false);
          const rType = settings.runnerType || 'star';
          setRunnerUrl(rType === 'custom' ? settings.customRunnerUrl : (runnerMap[rType] || runnerMap.star));
        }

        // Fetch active Tug-of-War event
        const towRes = await axios.get(`/api/tug-of-war/active/${streamerId}`).catch(() => ({ data: null }));
        if (towRes.data) setTowEvent(towRes.data);
      } catch {
        setStreamer({ username: streamerId.toUpperCase(), streamerId, tier: 'none' });
      } finally { setLoading(false); }
    })();

    // Clean up theme classes on unmount to avoid pollution
    return () => {
      document.documentElement.classList.remove('dark', 'light');
      document.body.className = document.body.className.replace(/theme-\S+/g, '').trim();
    };
  }, [streamerId]);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');
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
        }).slice(0, 5); // Keep Top 5
      });

      // Update Ticker
      setRecentDrops(prev => {
        const newDrops = [data, ...prev];
        return newDrops.slice(0, 10);
      });
    });


    socket.on('tug-of-war-start', (newEvent) => {
      setTowEvent(newEvent);
    });

    socket.on('tug-of-war-stop', () => {
      setTowEvent(null);
      setSelectedSide(null);
    });

    socket.on('tug-of-war-update', (updatedEvent) => {
      setTowEvent(updatedEvent);
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
      const { data } = await axios.post('/api/payment/create-order', {
        streamerId, amount: Number(amount), donorName: donorName || 'Anonymous', message, sticker: selectedSticker
      });
      new window.Razorpay({
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_SHrX3upgmJ6sGL",
        amount: data.amount, currency: "INR", name: "DropPay Protocol", order_id: data.id,
        handler: async (res) => {
          try {
            await axios.post('/api/payment/verify', {
              ...res,
              streamerId,
              donorName: donorName || 'Anonymous',
              message: message || `Dropped INR ${amount}`,
              sticker: selectedSticker,
              amount: Number(amount),
              tugOfWarSide: selectedSide
            });
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
    <div className={`min-h-screen bg-[var(--nexus-bg)] text-[var(--nexus-text)] font-sans relative flex flex-col theme-${streamer?.nexusTheme || 'void'} ${streamer?.nexusThemeMode || 'dark'} donation-page-root`}>
      <div className="obsidian-drift-bg" />
      <style dangerouslySetInnerHTML={{
        __html: `
        body { background-color: var(--nexus-bg); color: var(--nexus-text); transition: background-color 0.5s ease; }
        .hide-scroll::-webkit-scrollbar { display: none; }
      `}} />

      {/* --- FIXED TOP BAR --- */}
      <div className="fixed top-0 left-0 w-full z-50 flex flex-col">
        {/* --- DONATION NEXUS NAVBAR --- */}
        <header className="px-6 py-4 md:px-8 shrink-0 flex justify-between items-center bg-[var(--nexus-panel)] border-b border-[var(--nexus-border)] shadow-sm w-full">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
            <Zap className="w-6 h-6 text-[var(--nexus-accent)] fill-[var(--nexus-accent)]" />
            <span className="text-xl md:text-2xl font-black italic text-[var(--nexus-text)] tracking-tighter">DropPay</span>
          </div>
          <h1 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter leading-none text-[var(--nexus-text)]">
            Donation <span className="text-[var(--nexus-accent)]">Nexus.</span>
          </h1>
        </header>

        {/* --- DONATION TICKER --- */}
        <DonationTicker recentDrops={recentDrops} goalPercentage={goalPercentage} />
      </div>

      {/* --- MAIN BODY WRAPPER (Fixed Sidebar + Scrolling Center) --- */}
      <main className="flex-1 flex flex-col lg:flex-row w-full relative z-10 lg:overflow-hidden pt-[104px] sm:pt-[112px]">

        {/* --- LEFT SIDEBAR (Hall of Fame & Vertical Goal) --- */}
        <aside className="w-full relative h-auto lg:w-80 lg:fixed lg:bottom-0 lg:top-[112px] lg:left-0 flex flex-col border-r border-[var(--nexus-border)] bg-[var(--nexus-panel)]/50 backdrop-blur-md lg:overflow-y-auto hide-scroll z-40 shrink-0">
          <div className="p-6 flex flex-col space-y-6">
            {/* ACCOUNT CARD */}
            <div className={`relative overflow-hidden border ${isLegend ? 'bg-amber-500/10 border-amber-500/30' : 'bg-[var(--nexus-panel)] border-[var(--nexus-border)]'} backdrop-blur-2xl rounded-3xl p-6 text-center flex flex-col items-center justify-center shadow-lg nexus-card shrink-0 liquid-gold-border`}>
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              <div className={`relative w-16 h-16 rounded-full p-1 mb-3 ${isLegend ? 'bg-amber-500' : 'bg-[var(--nexus-accent)]'} z-10`}>
                <div className="w-full h-full rounded-full bg-[var(--nexus-panel)] flex items-center justify-center border-2 border-[#111] relative overflow-hidden">
                  {streamer?.avatar ? (
                    <img src={streamer.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-8 h-8 text-[var(--nexus-text-muted)]" />
                  )}
                </div>
              </div>
              {streamer?.tier && streamer.tier !== 'none' && (
                <div className={`relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-2 text-[8px] font-black uppercase italic ${isLegend ? 'text-amber-500 border-amber-500/30' : 'text-[var(--nexus-accent)] border-[var(--nexus-accent)]/30'} bg-[var(--nexus-bg)]`}>
                  <Crown className="w-3 h-3" /> {streamer.tier} Verified
                </div>
              )}
              <h3 className="relative z-10 text-lg font-black italic uppercase tracking-tighter text-[var(--nexus-text)] mt-1">
                {streamer?.fullName || streamer?.username?.toUpperCase()}
              </h3>
              <p className="relative z-10 text-[10px] font-mono font-bold text-[var(--nexus-accent)] opacity-60">@{streamer?.username}</p>
            </div>

            {/* TOP SUPPORTERS LIST */}
            <div className="shrink-0 relative z-20">
              <TopSupporterWidget
                topSupporters={topDonors.map(d => ({
                  name: d._id,
                  amount: d.totalAmount || d.total || 0,
                  avatar: d.avatar || null
                })).sort((a, b) => b.amount - a.amount)}
                stylePreference="classic_chart" // Forced to vertical list mode
              />
            </div>

            {/* VERTICAL GOAL BAR */}
            <div className="shrink-0 relative z-20 border-t border-[var(--nexus-border)] pt-6 mt-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--nexus-text-muted)] mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--nexus-accent)]" /> Active Mission
              </h3>
              {/* Fallback to CyberGoalBar if SquareGoalBar is too large or not built for vertical yet */}
              {isGoalActive ? (
                <div className="w-full transform scale-90 origin-top">
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
                <div className="w-full h-24 border-2 border-dashed border-[var(--nexus-border)] rounded-2xl flex flex-col items-center justify-center opacity-40">
                  <Target className="w-6 h-6 mb-2" />
                  <span className="text-[10px] font-bold uppercase">No Active Mission</span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* --- CENTER SECTION (Infinite Action Form) --- */}
        <section className="flex-1 lg:ml-80 h-full overflow-y-auto hide-scroll p-4 md:p-8 flex flex-col relative z-20 items-center">

          <div className="w-full max-w-2xl flex flex-col space-y-6">

            {/* PINNED HEADER: Alert Preview */}
            {storeMode === 'classic' && (
              <div className={`shrink-0 bg-[var(--nexus-bg)] rounded-[2rem] border border-[var(--nexus-border)] p-4 flex flex-col items-center justify-center relative min-h-[160px] shadow-sm nexus-card overflow-hidden liquid-gold-border`}>
                <p className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-[0.2em] italic text-[var(--nexus-text-muted)] z-10 flex items-center gap-2"><Zap className="w-3 h-3 text-[var(--nexus-accent)]" /> Live Preview</p>
                <div className="w-full flex justify-center items-center mt-4 pointer-events-none">
                  <div className="scale-[0.6] sm:scale-[0.7] origin-center flex justify-center w-full">
                    <AlertPreview theme={streamer?.nexusThemeMode || 'dark'} donorName={donorName || 'Donor'} amount={Number(amount) || 0} message={message || 'Message...'} sticker={selectedSticker} tier={streamer?.tier || 'starter'} stylePreference={streamer?.overlaySettings?.stylePreference || 'modern'} />
                  </div>
                </div>
              </div>
            )}

            {/* TOP LEVEL TOGGLE */}
            <div className="flex bg-[var(--nexus-panel)] p-1.5 rounded-2xl border border-[var(--nexus-border)] shrink-0">
              <button
                onClick={() => setStoreMode('classic')}
                className={`flex-1 py-3 lg:py-4 rounded-xl text-xs lg:text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${storeMode === 'classic' ? 'bg-[var(--nexus-accent)] text-black shadow-lg shadow-[var(--nexus-accent)]/20' : 'text-[var(--nexus-text-muted)] hover:text-[var(--nexus-text)]'}`}
              >
                <Zap className="w-4 h-4" /> Classic Drop
              </button>
              <button
                onClick={() => setStoreMode('premium')}
                className={`flex-1 py-3 lg:py-4 rounded-xl text-xs lg:text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${storeMode === 'premium' ? 'bg-indigo-500 text-slate-900 shadow-lg shadow-indigo-500/20' : 'text-[var(--nexus-text-muted)] hover:text-[var(--nexus-text)]'}`}
              >
                <Sparkles className="w-4 h-4" /> Premium Store
              </button>
            </div>

            {/* CONDITIONAL RENDER: CLASSIC FORM OR DIGITAL STORE */}
            {storeMode === 'classic' ? (
              <motion.div layout className="flex-1 bg-[var(--nexus-panel)] border border-[var(--nexus-border)] rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-7 shadow-2xl relative lg:overflow-y-auto lg:scrollbar-hide flex flex-col nexus-card">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <form key="form" onSubmit={handlePayment} className="space-y-6">
                      <div className="flex gap-4 border-b border-[var(--nexus-border)] pb-2">
                        <button type="button" onClick={() => setActiveTab('global')} className={`pb-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'global' ? 'border-b-2 border-[var(--nexus-accent)] text-[var(--nexus-accent)]' : 'text-[var(--nexus-text-muted)]'}`}>Global Pack</button>

                        {/* FIXED: hasCustomPack USED TO SHOW LOCK ICON */}
                        <button type="button" onClick={() => setActiveTab('partner')} className={`pb-2 text-[10px] sm:text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'partner' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-[var(--nexus-text-muted)]'}`}>
                          Partner Pack {!hasCustomPack && <Lock className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="min-h-[140px]">
                        <div className="grid grid-cols-5 gap-1.5">
                          {activeTab === 'global' ? (
                            globalStickers.map(s => (
                              <div key={s.id} onClick={() => { setSelectedSticker(s.url); setAmount(s.price); }} className={`relative py-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center ${selectedSticker === s.url ? 'bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]' : 'bg-[var(--nexus-panel)] border-[var(--nexus-border)]'}`}>
                                <button type="button" onClick={(e) => playSoundPreview(e, s.id, s.sound)} className={`absolute top-1 right-1 p-0.5 rounded-full ${playingSound === s.id ? 'bg-[var(--nexus-accent)] text-black' : 'text-[var(--nexus-text-muted)]'}`}><Volume2 className="w-2 h-2" /></button>
                                <Player autoplay loop src={s.url} style={{ height: '40px', width: '40px' }} />
                                <span className="text-[8px] font-black mt-1 text-[var(--nexus-text)]">₹{s.price}</span>
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

                      {/* --- TUG-OF-WAR TEAM SELECTION UI --- */}
                      {towEvent && (
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--nexus-text-muted)] ml-2">Choose Your Side</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setSelectedSide('A')}
                              className={`py-4 rounded-xl font-black uppercase tracking-widest text-[10px] italic border-2 transition-all ${selectedSide === 'A' ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-black/20 border-[var(--nexus-border)] text-[var(--nexus-text-muted)] hover:border-red-500/50'}`}
                            >
                              {towEvent.teamAName}
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedSide('B')}
                              className={`py-4 rounded-xl font-black uppercase tracking-widest text-[10px] italic border-2 transition-all ${selectedSide === 'B' ? 'bg-blue-500/20 border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-black/20 border-[var(--nexus-border)] text-[var(--nexus-text-muted)] hover:border-blue-500/50'}`}
                            >
                              {towEvent.teamBName}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex-1 flex flex-col space-y-4 lg:space-y-5">
                        bench
                        <div className="grid grid-cols-2 gap-4 shrink-0">
                          <div className="relative">
                            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--nexus-text-muted)] w-5 h-5" />
                            <input placeholder="Name" value={donorName} className="w-full bg-[var(--nexus-panel)] border border-[var(--nexus-border)] rounded-xl py-3 lg:py-5 px-12 text-xs lg:text-sm font-bold text-[var(--nexus-text)] outline-none focus:border-[var(--nexus-accent)]/50 transition-colors" onChange={e => setDonorName(e.target.value)} />
                          </div>
                          <div className="relative">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--nexus-text-muted)] w-5 h-5" />
                            <input type="number" value={amount} className="w-full bg-[var(--nexus-panel)] border border-[var(--nexus-border)] rounded-xl py-3 lg:py-5 px-12 text-xs lg:text-sm font-black italic text-[var(--nexus-text)] outline-none focus:border-[var(--nexus-accent)]/50 transition-colors" onChange={e => setAmount(e.target.value)} />
                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[7px] lg:text-[8px] font-black uppercase tracking-widest pointer-events-none hidden sm:block ${currentTier === 'legendary' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                              currentTier === 'epic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                'bg-[var(--nexus-bg)] text-[var(--nexus-text-muted)] border border-[var(--nexus-border)]'
                              }`}>
                              {currentTier} Drop
                            </div>
                          </div>
                        </div>
                        <div className="relative flex-1 flex flex-col min-h-[100px] lg:min-h-[120px]">
                          <MessageSquare className="absolute left-4 top-4 text-[var(--nexus-text-muted)] w-5 h-5" />
                          <textarea placeholder="Message..." maxLength={100} value={message} className="w-full h-full flex-1 bg-[var(--nexus-panel)] border border-[var(--nexus-border)] rounded-xl py-4 lg:py-6 px-12 text-xs lg:text-sm text-[var(--nexus-text)] outline-none resize-none focus:border-[var(--nexus-accent)]/50 transition-colors" onChange={e => setMessage(e.target.value)} />
                          <div className="absolute bottom-3 left-12 right-4 flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                            <Smile className="w-4 h-4 text-[var(--nexus-text-muted)] mr-2 shrink-0" />
                            {quickEmotes.map(e => (
                              <button key={e} type="button" onClick={() => setMessage(p => (p + e).slice(0, 100))} className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-[var(--nexus-bg)] text-[var(--nexus-text)] text-xs hover:border hover:border-[var(--nexus-border)] transition-all">{e}</button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 pt-2 lg:pt-4 space-y-2 mt-auto">
                        <button type="submit" disabled={isProcessing} className="w-full bg-[var(--nexus-accent)] py-4 lg:py-5 rounded-xl lg:rounded-2xl text-sm lg:text-lg text-black font-black flex items-center justify-center gap-3 uppercase italic transition hover:brightness-110 shadow-lg shadow-[var(--nexus-accent)]/20">
                          {isProcessing ? <Loader2 className="animate-spin w-4 h-4 lg:w-5 lg:h-5" /> : <>Execute Drop <Zap className="w-4 h-4 lg:w-5 lg:h-5" /> <Send className="w-4 h-4 lg:w-5 lg:h-5" /></>}
                        </button>

                        <div className="flex items-center justify-center gap-4 text-[var(--nexus-text-muted)] text-[6px] lg:text-[7px] font-black uppercase pt-1">
                          <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Secure Node</div>
                          <div className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> <Gift className="w-3 h-3" /> Razorpay Verified</div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-[var(--nexus-accent)] mx-auto mb-4" />
                      <h2 className="text-2xl font-black italic uppercase text-[var(--nexus-text)]">Drop Confirmed!</h2>
                      <button onClick={() => setIsSuccess(false)} className="mt-8 bg-[var(--nexus-panel)] border border-[var(--nexus-border)] px-8 py-4 rounded-xl text-xs font-black uppercase text-[var(--nexus-text)] hover:border-[var(--nexus-accent)]/50 transition-colors">
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
                  towEvent={towEvent}
                  selectedSide={selectedSide}
                  setSelectedSide={setSelectedSide}
                />
              </motion.div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};



export default DonationPage;
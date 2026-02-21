import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player'; 
import { 
  Send, ShieldCheck, Zap, IndianRupee, MessageSquare, Loader2, Sparkles, 
  CheckCircle, Award, Trophy, User, Crown, Smile, Volume2, Lock, Target, Crosshair, UserCircle, Gift
} from 'lucide-react'; 

// GLOBAL LOTTIE PACK
const globalStickers = [
  { id: 'hype_zap', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json', price: 20, color: 'from-yellow-400 to-orange-500', sound: '/sounds/zap.mp3' },
  { id: 'fire_rocket', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json', price: 50, color: 'from-orange-500 to-red-600', sound: '/sounds/fire.mp3' },
  { id: 'super_heart', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/lottie.json', price: 100, color: 'from-pink-500 to-rose-600', sound: '/sounds/love.mp3' },
  { id: 'gold_trophy', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/lottie.json', price: 500, color: 'from-amber-400 to-yellow-600', sound: '/sounds/king.mp3' },
  { id: 'party_popper', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/lottie.json', price: 1000, color: 'from-indigo-500 to-purple-600', sound: '/sounds/rocket.mp3' },
];

// GOAL RUNNER PROTOCOL
const runnerMap = {
  star: 'https://lottie.host/246e382d-1144-48f1-8fbd-7ebc24f2b1d3/gYtH5RkIfL.json',
  car: 'https://lottie.host/23c683ee-c0a4-443b-ab5e-b9b596255d64/vN43wP2rRk.json',
  rocket: 'https://lottie.host/b0dc5e70-2216-43dd-b883-fa4c038d1033/D1d51tK2rO.json',
  fire: 'https://lottie.host/c02f7415-3733-4f51-b8ef-f15599026402/1A5Xz2P99Q.json'
};

const DonationPage = () => {
  const { streamerId } = useParams();
  const [streamer, setStreamer] = useState(null);
  const [topDonors, setTopDonors] = useState([]); 
  const [amount, setAmount] = useState(20);
  const [selectedSticker, setSelectedSticker] = useState('hype_zap');
  const [activeTab, setActiveTab] = useState('global'); 
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [playingSound, setPlayingSound] = useState(null);

  // --- GOAL STATE ---
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
          setGoal({ title: settings.title || "Active Objective", currentProgress: settings.currentProgress || 0, targetAmount: settings.targetAmount || 100 });
          setIsGoalActive(settings.isActive ?? false);
          const rType = settings.runnerType || 'star';
          if (rType === 'custom' && settings.customRunnerUrl) setRunnerUrl(settings.customRunnerUrl);
          else setRunnerUrl(runnerMap[rType] || runnerMap.star);
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
      setGoal(updatedGoal);
      if (updatedGoal.isActive !== undefined) setIsGoalActive(updatedGoal.isActive);
      if (updatedGoal.runnerType) {
         const newUrl = updatedGoal.runnerType === 'custom' ? updatedGoal.customRunnerUrl : (runnerMap[updatedGoal.runnerType] || runnerMap.star);
         setRunnerUrl(newUrl);
      }
    });
    return () => socket.disconnect();
  }, [streamerId]);

  const playSoundPreview = (e, id, path) => {
    e.stopPropagation(); setPlayingSound(id);
    new Audio(path).play().catch(() => {});
    setTimeout(() => setPlayingSound(null), 2000);
  };

  const handlePayment = async (e) => {
    e.preventDefault(); if (!window.Razorpay) return;
    setIsProcessing(true);
    try {
      const { data } = await axios.post('http://localhost:5001/api/payment/create-order', { 
        streamerId, amount: Number(amount), donorName: donorName || 'Anonymous', message, sticker: selectedSticker 
      });
      new window.Razorpay({
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_SHrX3upgmJ6sGL", 
        amount: data.amount, currency: "INR", name: "DropPay Protocol", order_id: data.id,
        handler: async (res) => {
          await axios.post('http://localhost:5001/api/payment/verify', { ...res, streamerId, donorName: donorName || 'Anonymous', message, sticker: selectedSticker, amount: Number(amount) });
          setIsSuccess(true); setIsProcessing(false);
        }, modal: { ondismiss: () => setIsProcessing(false) }
      }).open();
    } catch { setIsProcessing(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-indigo-500"><Loader2 className="animate-spin" /></div>;

  const currentSticker = globalStickers.find(s => s.id === selectedSticker);
  const isLegend = streamer?.tier === 'legend';
  const hasCustomPack = streamer?.tier === 'pro' || streamer?.tier === 'legend';
  const tierColor = isLegend ? 'text-amber-500' : streamer?.tier === 'pro' ? 'text-indigo-400' : 'text-slate-500';
  const tierBg = isLegend ? 'bg-amber-500/10 border-amber-500/30' : streamer?.tier === 'pro' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/10';
  const goalPercentage = Math.min((goal.currentProgress / goal.targetAmount) * 100, 100);
  const isComplete = goalPercentage >= 100;

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#050505] text-slate-100 font-sans relative flex flex-col px-4 md:px-8">
      <header className="absolute top-0 left-0 w-full p-4 lg:p-6 z-50 flex items-center gap-2">
        <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500" />
        <span className="text-lg font-black italic text-white uppercase tracking-tighter">DropPay</span>
      </header>

      <main className="max-w-[1400px] mx-auto pt-20 lg:pt-24 pb-4 lg:pb-8 w-full h-full flex flex-col z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full flex-1 min-h-0 items-stretch">
          
          {/* COLUMN 1: ACCOUNT CARD */}
          <div className="lg:col-span-3 flex flex-col justify-center h-full">
            <div className={`relative overflow-hidden border ${tierBg} backdrop-blur-2xl rounded-[2.5rem] p-6 text-center flex flex-col items-center shadow-2xl group`}>
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
              <div className={`absolute -inset-full top-0 bg-gradient-to-r from-transparent ${isLegend ? 'via-amber-500/10' : 'via-indigo-500/10'} to-transparent transform -skew-x-12 animate-[shimmer_8s_infinite_linear]`} />
              <div className={`relative w-20 h-20 rounded-full p-1 mb-4 ${isLegend ? 'bg-gradient-to-br from-amber-400 to-orange-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'} z-10`}>
                <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center border-4 border-[#111] overflow-hidden relative">
                  <User className="w-8 h-8 text-slate-400" />
                  {isLegend && <div className="absolute inset-0 border-2 border-amber-500/50 rounded-full animate-pulse" />}
                </div>
              </div>
              {streamer?.tier && streamer.tier !== 'none' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 text-[9px] font-black uppercase italic ${isLegend ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'}`}>
                  {isLegend ? <Crown className="w-3 h-3 fill-amber-500 animate-[spin_10s_linear_infinite]" /> : <Zap className="w-3 h-3 fill-indigo-400" />} {streamer.tier} Protocol Verified
                </motion.div>
              )}
              <p className={`relative z-10 text-lg font-mono font-black mb-3 ${isLegend ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]' : 'text-indigo-400'}`}>@{streamer?.streamerId}</p>
              <p className="relative z-10 text-[10px] text-slate-400 italic leading-relaxed">"{streamer?.bio || 'Support the stream and trigger custom alerts.'}"</p>
            </div>
          </div>

          {/* COLUMN 2: MISSION & HALL OF FAME */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center h-full gap-6">
            <AnimatePresence>
              {isGoalActive && (
                <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.9 }} className="relative w-full h-[72px] group z-20">
                  <div className={`absolute -inset-1 rounded-full blur-md opacity-30 transition-colors duration-1000 animate-pulse ${isComplete ? 'bg-amber-500' : 'bg-indigo-600'}`} />
                  <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.02)] flex items-center px-4 gap-3 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[scan_4s_ease-in-out_infinite]" />
                    <div className="flex items-center gap-3 w-auto shrink-0 relative z-10">
                      <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                        <div className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-1000 animate-[spin_4s_linear_infinite] ${isComplete ? 'border-amber-500/50' : 'border-indigo-500/50'}`} />
                        <div className={`absolute inset-0.5 rounded-full border-t-2 transition-colors duration-1000 animate-[spin_2s_linear_infinite_reverse] ${isComplete ? 'border-amber-400' : 'border-purple-500'}`} />
                        {isComplete ? <Trophy className="w-4 h-4 text-amber-400" /> : isLegend ? <Crown className="w-4 h-4 text-amber-400" /> : <Target className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <div className="flex flex-col min-w-0 justify-center h-full pt-0.5">
                        <p className={`text-[8px] font-black uppercase tracking-[0.2em] leading-none mb-1 ${isComplete ? 'text-amber-400' : 'text-indigo-400'}`}>{isComplete ? 'Objective Complete' : 'Mission Active'}</p>
                        <h2 className="text-white text-xs font-black italic uppercase tracking-tighter truncate leading-none max-w-[120px]">{goal.title}</h2>
                      </div>
                    </div>
                    <div className="flex-1 relative h-2 bg-[#000000] rounded-full shadow-[inset_0_1px_5px_rgba(0,0,0,1)] border border-white/5 flex items-center">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${goalPercentage}%` }} transition={{ duration: 1.5, ease: "circOut" }} className={`h-full relative rounded-full transition-colors duration-1000 ${isComplete ? 'bg-gradient-to-r from-amber-600 to-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-gradient-to-r from-indigo-600 via-cyan-400 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.5)]'}`}>
                        <motion.div animate={{ y: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center z-50"><Player key={runnerUrl} autoplay loop src={runnerUrl} style={{ height: '100%', width: '100%' }} /></motion.div>
                      </motion.div>
                    </div>
                    <div className="flex flex-col items-end justify-center w-auto shrink-0 relative z-10 pt-0.5">
                      <div className="flex items-end gap-1 mb-0.5"><motion.span key={goal.currentProgress} className="text-sm font-black italic text-white">₹{goal.currentProgress.toLocaleString()}</motion.span><span className="text-[9px] text-slate-400 font-bold mb-px leading-none">/ {goal.targetAmount.toLocaleString()}</span></div>
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border backdrop-blur-md ${isComplete ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'}`}>{isComplete ? <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" /> : <Crosshair className="w-2.5 h-2.5 text-indigo-400 animate-[spin_3s_linear_infinite]" />}<span className={`text-[8px] font-black uppercase tracking-widest ${isComplete ? 'text-amber-400' : 'text-indigo-300'}`}>{goalPercentage.toFixed(1)}%</span></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative overflow-hidden border border-white/5 bg-[#111]/80 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-xl">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/hexapteron.png')] mix-blend-overlay" />
               <div className="relative z-10 flex items-center gap-3 mb-5"><Trophy className={`w-5 h-5 ${isLegend ? 'text-amber-400' : 'text-indigo-400'}`} /><h3 className="text-xs font-black uppercase tracking-widest text-white italic">Hall of Fame</h3></div>
               <div className="relative z-10 space-y-3">
                {topDonors.length ? topDonors.map((d, i) => (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${i === 0 ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]' : 'bg-[#0a0a0a] border-white/5'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] ${i === 0 ? 'bg-amber-400 text-black shadow-amber-400/20 relative overflow-hidden' : i === 1 ? 'bg-slate-300 text-black' : 'bg-orange-600 text-white'}`}>
                      <span className="relative z-10">#{i + 1}</span>
                      {i === 0 && <div className="absolute inset-0 bg-white/30 animate-[shimmer_3s_infinite_linear] -skew-x-12" />}
                    </div>
                    <div className="flex-1 min-w-0"><p className={`font-black text-[10px] uppercase truncate tracking-tight ${i === 0 ? 'text-amber-400' : 'text-white'}`}>{d._id}</p><p className="text-[8px] font-bold text-slate-500 uppercase">{i === 0 ? 'Current Legend' : 'Elite Donor'}</p></div>
                    <p className={`font-black text-xs italic ${i === 0 ? 'text-amber-400' : 'text-indigo-400'}`}>₹{d.total}</p>
                  </motion.div>
                )) : <p className="text-[10px] text-slate-600 text-center py-4 uppercase font-black italic">No legends yet.</p>}
              </div>
            </div>
          </div>

          {/* COLUMN 3: DONATION FORM */}
          <div className="lg:col-span-4 xl:col-span-5 flex flex-col h-full min-h-0">
            <div className="shrink-0 mb-4 bg-[#050505]/95">
              <p className={`text-[9px] font-black uppercase tracking-widest mb-2 text-center italic ${tierColor}`}>{isLegend ? 'Legendary Alert Preview' : 'Live Monitor Protocol'}</p>
              <motion.div layout className={`p-[2px] rounded-2xl bg-gradient-to-r ${currentSticker?.color} ${isLegend ? 'animate-pulse shadow-xl' : 'shadow-md'}`}>
                <div className="bg-[#0a0a0a] rounded-[15px] p-3 flex items-center gap-3">
                  <div className="w-12 h-12"><Player autoplay loop src={currentSticker?.url} /></div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1"><span className="font-black text-xs italic uppercase text-white truncate">{donorName || 'Your Name'}</span><span className="font-black text-[9px] px-2 py-0.5 rounded bg-white/10 text-white">₹{amount || 0}</span></div>
                    <p className="text-slate-400 text-[10px] italic truncate">{message || 'Your custom message will appear here...'}</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div layout className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-7 lg:p-8 shadow-2xl relative overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form key="form" onSubmit={handlePayment} className="space-y-6 group">
                    <div className="space-y-4">
                      <div className="flex gap-4 border-b border-white/5">
                        <button type="button" onClick={() => setActiveTab('global')} className={`pb-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'global' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-slate-500'}`}>Global Pack</button>
                        <button type="button" onClick={() => setActiveTab('partner')} className={`pb-1.5 text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'partner' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-slate-500'}`}>
                          Partner Pack {!hasCustomPack && <Lock className="w-2.5 h-2.5" />}
                        </button>
                      </div>
                      <div className="min-h-[90px] relative">
                        <AnimatePresence mode="wait">
                          {activeTab === 'global' ? (
                            <motion.div key="global" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-5 gap-1.5">
                              {globalStickers.map(s => (
                                <div key={s.id} onClick={() => { setSelectedSticker(s.id); setAmount(s.price); }} className={`relative py-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center ${selectedSticker === s.id ? 'bg-indigo-500/10 border-indigo-500 scale-[1.02]' : 'bg-[#111] border-white/5 hover:border-white/20'}`}>
                                  <button type="button" onClick={(e) => playSoundPreview(e, s.id, s.sound)} className={`absolute top-1 right-1 p-0.5 rounded-full ${playingSound === s.id ? 'bg-indigo-500 text-white animate-pulse' : 'bg-black/40 text-slate-400'}`}><Volume2 className="w-2 h-2"/></button>
                                  <Player autoplay loop src={s.url} style={{ height: '40px', width: '40px' }} />
                                  <span className={`text-[8px] font-black mt-1 ${selectedSticker === s.id ? 'text-indigo-400' : 'text-slate-500'}`}>₹{s.price}</span>
                                </div>
                              ))}
                            </motion.div>
                          ) : (
                            <motion.div key="partner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl py-4 min-h-[90px]">
                              {hasCustomPack ? (
                                <div className="text-center">
                                  <Sparkles className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                                  <p className="text-[9px] font-black uppercase text-indigo-400">Partner Pack Active</p>
                                </div>
                              ) : (
                                <div className="text-center px-4">
                                  <Lock className="w-5 h-5 text-slate-700 mx-auto mb-1" />
                                  <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest leading-relaxed">
                                    Reach <span className="text-indigo-400">PRO</span> or <span className="text-amber-500">LEGEND</span> tier!
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2 mb-1 opacity-70">
                         <Gift className="w-3.5 h-3.5 text-indigo-500" /> Select Visual Protocol
                      </label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative">
                           <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5"/>
                           <input placeholder="Enter Name" value={donorName} className="w-full bg-[#111] border border-white/5 rounded-xl py-5 px-12 text-base font-bold text-white outline-none focus:border-indigo-500 transition-colors" onChange={e => setDonorName(e.target.value)}/>
                        </div>
                        <div className="relative">
                           <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5"/>
                           <input type="number" value={amount} className="w-full bg-[#111] border border-white/5 rounded-xl py-5 px-12 font-black italic text-white text-base outline-none focus:border-indigo-500 transition-colors" onChange={e => setAmount(e.target.value)}/>
                        </div>
                      </div>

                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-6 text-slate-600 w-5 h-5"/>
                        <textarea placeholder="Write a message..." maxLength={100} value={message} className="w-full bg-[#111] border border-white/5 rounded-2xl py-6 px-12 text-base font-medium text-white min-h-[140px] outline-none focus:border-indigo-500 resize-none transition-colors" onChange={e => setMessage(e.target.value)}/>
                        <div className="absolute bottom-5 left-12 right-5 mt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                          <Smile className="w-4 h-4 text-slate-600 mr-2 shrink-0" />
                          {quickEmotes.map(e => (
                            <button key={e} type="button" onClick={() => setMessage(p => (p + e).slice(0, 100))} className="w-7 h-7 rounded-md bg-[#1a1a1a] border border-white/5 hover:border-indigo-500 shrink-0 text-xs transition-colors">
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button disabled={isProcessing} className="w-full bg-indigo-600 py-5 rounded-2xl text-lg font-black flex items-center justify-center gap-3 uppercase italic transition hover:bg-indigo-500 disabled:opacity-50 shadow-lg shadow-indigo-600/20 active:scale-95">
                      {isProcessing ? <Loader2 className="animate-spin" /> : <>Execute Drop <Zap className="w-4 h-4 fill-white" /> <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></>}
                    </button>
                    
                    <div className="flex items-center justify-center gap-4 text-slate-600 opacity-50 text-[7px] font-black uppercase tracking-widest pt-1">
                      <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> 256-Bit Encrypted</div>
                      <div className="flex items-center gap-1.5"><Award className="w-3 h-3" /> Razorpay Secured</div>
                    </div>
                  </motion.form>
                ) : (
                  <div className="text-center py-12"><CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" /><h2 className="text-2xl font-black italic uppercase tracking-tighter">Drop Confirmed!</h2><button onClick={() => setIsSuccess(false)} className="mt-8 bg-white/5 border border-white/10 px-8 py-4 rounded-xl text-xs font-black uppercase hover:bg-white/10 transition-colors">Send Another</button></div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { 
          0% { transform: translateX(-100%) skewX(-15deg); } 
          50% { transform: translateX(200%) skewX(-15deg); } 
          100% { transform: translateX(200%) skewX(-15deg); } 
        }
        @keyframes shimmer {
          from { transform: translateX(-100%) skewX(-12deg); }
          to { transform: translateX(200%) skewX(-12deg); }
        }
      `}} />
    </div>
  );
};

export default DonationPage;
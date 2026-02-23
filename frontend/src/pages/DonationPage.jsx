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

// --- MODULAR IMPORT ---
import AlertPreview from '../components/AlertPreview';

const globalStickers = [
  { id: 'hype_zap', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json', price: 20, color: 'from-yellow-400 to-orange-500', sound: '/sounds/zap.mp3' },
  { id: 'fire_rocket', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json', price: 50, color: 'from-orange-500 to-red-600', sound: '/sounds/fire.mp3' },
  { id: 'super_heart', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/lottie.json', price: 100, color: 'from-pink-500 to-rose-600', sound: '/sounds/love.mp3' },
  { id: 'gold_trophy', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/lottie.json', price: 500, color: 'from-amber-400 to-yellow-600', sound: '/sounds/king.mp3' },
  { id: 'party_popper', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/lottie.json', price: 1000, color: 'from-indigo-500 to-purple-600', sound: '/sounds/rocket.mp3' },
];

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
      setGoal(updatedGoal);
      if (updatedGoal.isActive !== undefined) setIsGoalActive(updatedGoal.isActive);
      if (updatedGoal.runnerType) {
         setRunnerUrl(updatedGoal.runnerType === 'custom' ? updatedGoal.customRunnerUrl : (runnerMap[updatedGoal.runnerType] || runnerMap.star));
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

  const isLegend = streamer?.tier === 'legend';
  const hasCustomPack = streamer?.tier === 'pro' || streamer?.tier === 'legend'; // VARIABLE NOW USED BELOW
  const goalPercentage = Math.min((goal.currentProgress / goal.targetAmount) * 100, 100);
  const currentTier = amount >= 2000 ? 'legendary' : amount >= 500 ? 'epic' : 'standard';

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#050505] text-slate-100 font-sans relative flex flex-col px-4 md:px-8">
      <header className="absolute top-0 left-0 w-full p-4 lg:p-6 z-50 flex items-center gap-2">
        <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500" />
        <span className="text-lg font-black italic text-white uppercase tracking-tighter">DropPay</span>
      </header>

      <main className="max-w-[1400px] mx-auto pt-20 lg:pt-24 pb-4 lg:pb-8 w-full h-full flex flex-col z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full flex-1 min-h-0 items-stretch">
          
          {/* COLUMN 1 */}
          <div className="lg:col-span-3 flex flex-col justify-center h-full">
            <div className={`relative overflow-hidden border ${isLegend ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'} backdrop-blur-2xl rounded-[2.5rem] p-6 text-center flex flex-col items-center shadow-2xl`}>
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              <div className={`relative w-20 h-20 rounded-full p-1 mb-4 ${isLegend ? 'bg-amber-500' : 'bg-indigo-500'} z-10`}><div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center border-4 border-[#111]"><User className="w-8 h-8 text-slate-400" /></div></div>
              {streamer?.tier && streamer.tier !== 'none' && (
                <div className={`relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 text-[9px] font-black uppercase italic ${isLegend ? 'text-amber-500 border-amber-500/30' : 'text-indigo-400 border-indigo-500/30'}`}><Crown className="w-3 h-3" /> {streamer.tier} Verified</div>
              )}
              <p className="relative z-10 text-lg font-mono font-black mb-3">@{streamer?.streamerId}</p>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center h-full gap-6">
            {isGoalActive && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full h-[72px] z-20">
                <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-2xl rounded-full border border-white/10 flex items-center px-4 gap-3 overflow-hidden">
                  <div className="flex items-center gap-3 w-auto shrink-0 relative z-10">
                    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                      <div className="absolute inset-0 rounded-full border border-dashed animate-[spin_4s_linear_infinite] border-indigo-500/50" />
                      <Target className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="flex flex-col min-w-0 pt-0.5">
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400"><Crosshair className="inline w-2 h-2 mr-1" /> Active Mission</p>
                      <h2 className="text-white text-xs font-black italic uppercase truncate max-w-[120px]">{goal.title}</h2>
                    </div>
                  </div>
                  <div className="flex-1 relative h-2 bg-[#000000] rounded-full border border-white/5"><motion.div initial={{ width: 0 }} animate={{ width: `${goalPercentage}%` }} className="h-full relative rounded-full bg-indigo-600"><div className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-10 h-10"><Player autoplay loop src={runnerUrl} /></div></motion.div></div>
                </div>
              </motion.div>
            )}
            <div className="relative overflow-hidden border border-white/5 bg-[#111]/80 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-xl">
               <div className="relative z-10 flex items-center gap-3 mb-5"><Trophy className="w-5 h-5 text-indigo-400" /><h3 className="text-xs font-black uppercase tracking-widest text-white italic">Hall of Fame <Award className="inline w-3 h-3 ml-1" /></h3></div>
               <div className="relative z-10 space-y-3">
                {topDonors.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border bg-[#0a0a0a] border-white/5"><div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] bg-[#1a1a1a] text-white">#{i + 1}</div><p className="font-black text-[10px] uppercase truncate text-white">{d._id}</p><p className="font-black text-xs italic ml-auto text-indigo-400">₹{d.total}</p></div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 3 */}
          <div className="lg:col-span-4 xl:col-span-5 flex flex-col h-full min-h-0">
            <div className="shrink-0 mb-4 bg-[#050505]/95">
              <p className="text-[9px] font-black uppercase tracking-widest mb-2 text-center italic text-indigo-400">Alert Preview</p>
              <div className="scale-[0.8] origin-top mt-[-10px] mb-[-40px]">
                <AlertPreview donorName={donorName || 'Donor'} amount={Number(amount) || 0} message={message || 'Message...'} sticker={selectedSticker} tier={currentTier} />
              </div>
            </div>
            
            <motion.div layout className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-7 shadow-2xl relative overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <form key="form" onSubmit={handlePayment} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex gap-4 border-b border-white/5">
                        <button type="button" onClick={() => setActiveTab('global')} className={`pb-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'global' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-slate-500'}`}>Global Pack</button>
                        {/* FIXED: hasCustomPack USED TO SHOW LOCK ICON */}
                        <button type="button" onClick={() => setActiveTab('partner')} className={`pb-1.5 text-[9px] font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'partner' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-slate-500'}`}>
                          Partner Pack {!hasCustomPack && <Lock className="w-2.5 h-2.5" />}
                        </button>
                      </div>
                      <div className="min-h-[90px]">
                        <div className="grid grid-cols-5 gap-1.5">
                          {activeTab === 'global' ? (
                            globalStickers.map(s => (
                              <div key={s.id} onClick={() => { setSelectedSticker(s.id); setAmount(s.price); }} className={`relative py-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center ${selectedSticker === s.id ? 'bg-indigo-500/10 border-indigo-500' : 'bg-[#111] border-white/5'}`}>
                                <button type="button" onClick={(e) => playSoundPreview(e, s.id, s.sound)} className={`absolute top-1 right-1 p-0.5 rounded-full ${playingSound === s.id ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}><Volume2 className="w-2 h-2"/></button>
                                <Player autoplay loop src={s.url} style={{ height: '40px', width: '40px' }} />
                                <span className="text-[8px] font-black mt-1">₹{s.price}</span>
                              </div>
                            ))
                          ) : (
                            /* FIXED: hasCustomPack USED TO RENDER GRID OR LOCK MESSAGE */
                            hasCustomPack ? (
                              streamer?.partnerPack?.map((s, idx) => (
                                <div key={idx} onClick={() => { setSelectedSticker(s.lottieUrl); setAmount(s.minAmount); }} className={`relative py-2.5 rounded-xl border-2 cursor-pointer flex flex-col items-center ${selectedSticker === s.lottieUrl ? 'bg-amber-500/10 border-amber-500' : 'bg-[#111] border-white/5'}`}>
                                  <Sparkles className="absolute top-1 right-1 w-2.5 h-2.5 text-amber-500" />
                                  <Player autoplay loop src={s.lottieUrl} style={{ height: '40px', width: '40px' }} />
                                  <span className="text-[8px] font-black mt-1">₹{s.minAmount}</span>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-5 h-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl opacity-40">
                                <Lock className="w-5 h-5 mb-1" />
                                <p className="text-[8px] font-black uppercase">Reach Pro Node Tier</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative"><UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5"/><input placeholder="Name" value={donorName} className="w-full bg-[#111] border border-white/5 rounded-xl py-5 px-12 font-bold text-white outline-none" onChange={e => setDonorName(e.target.value)}/></div>
                        <div className="relative"><IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5"/><input type="number" value={amount} className="w-full bg-[#111] border border-white/5 rounded-xl py-5 px-12 font-black italic text-white outline-none" onChange={e => setAmount(e.target.value)}/></div>
                      </div>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-6 text-slate-600 w-5 h-5"/>
                        <textarea placeholder="Message..." maxLength={100} value={message} className="w-full bg-[#111] border border-white/5 rounded-2xl py-6 px-12 text-white min-h-[140px] outline-none resize-none" onChange={e => setMessage(e.target.value)}/>
                        <div className="absolute bottom-5 left-12 right-5 flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                          <Smile className="w-4 h-4 text-slate-600 mr-2 shrink-0" />
                          {quickEmotes.map(e => (
                            <button key={e} type="button" onClick={() => setMessage(p => (p + e).slice(0, 100))} className="w-7 h-7 rounded-md bg-[#1a1a1a] text-xs hover:border-indigo-500">{e}</button> 
                          ))}
                        </div>
                      </div>
                    </div>

                    <button disabled={isProcessing} className="w-full bg-indigo-600 py-5 rounded-2xl text-lg font-black flex items-center justify-center gap-3 uppercase italic transition hover:bg-indigo-500 shadow-lg shadow-indigo-600/20">
                      {isProcessing ? <Loader2 className="animate-spin w-3 h-3" /> : <>Execute Drop <Zap className="w-4 h-4" /> <Send className="w-4 h-4" /></>}
                    </button>
                    
                    <div className="flex items-center justify-center gap-4 text-slate-600 text-[7px] font-black uppercase pt-1">
                      <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Secure Node</div>
                      <div className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> <Gift className="w-3 h-3" /> Razorpay Verified</div>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12"><CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" /><h2 className="text-2xl font-black italic uppercase">Drop Confirmed!</h2><button onClick={() => setIsSuccess(false)} className="mt-8 bg-white/5 border border-white/10 px-8 py-4 rounded-xl text-xs font-black uppercase">Send Another</button></div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />
    </div>
  );
};

export default DonationPage;
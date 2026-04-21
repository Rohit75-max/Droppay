import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { Logo } from '../../components/ui/Logo';
import {
  ShieldCheck, IndianRupee, MessageSquare, Loader2,
  CheckCircle, UserCircle, ArrowRight, Lock, Building
} from 'lucide-react';

const globalStickers = [
  { id: 'hype_zap', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json', price: 20 },
  { id: 'fire_rocket', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json', price: 50 },
  { id: 'super_heart', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/lottie.json', price: 100 },
  { id: 'alien_visit', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f47d/lottie.json', price: 150 },
  { id: 'driving_car', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f697/lottie.json', price: 200 },
];
const quickEmotes = ['💀', '😂', '🔥', '🐐', '💯', 'W', 'L', '🤡', '👽', '👀', '💖'];

const DonationPage = () => {
  const { streamerId } = useParams();
  const navigate = useNavigate();
  const [streamer, setStreamer] = useState(null);
  
  // Payment Form State
  const [amount, setAmount] = useState(100);
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json');
  
  // App State
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [socketInstance, setSocketInstance] = useState(null); 

  useEffect(() => {
    (async () => {
      try {
        const [s] = await Promise.all([
          axios.get(`/api/user/public/${streamerId}`)
        ]);
        
        // Force Enterprise Light/Glassmorphism for Checkout Nodes
        if (s.data) {
          s.data.nexusTheme = 'aero';
          s.data.nexusThemeMode = 'light';
        }

        setStreamer(s.data);

        // Theme Persistence Engine
        const theme = s.data?.nexusTheme || 'void';
        const mode = s.data?.nexusThemeMode || 'dark';

        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(mode);

        const body = document.body;
        body.className = body.className.replace(/theme-\S+/g, '').trim();
        if (theme !== 'void') {
          body.classList.add(`theme-${theme}`);
        }

      } catch {
        setStreamer({ username: streamerId.toUpperCase(), streamerId, tier: 'none' });
      } finally { setLoading(false); }
    })();

    return () => {
      document.documentElement.classList.remove('dark', 'light');
      document.body.className = document.body.className.replace(/theme-\S+/g, '').trim();
    };
  }, [streamerId]);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');
    setSocketInstance(socket);
    socket.emit('join-room', streamerId);
    return () => socket.disconnect();
  }, [streamerId]);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      toast.error("Error: Razorpay SDK failed to load. Please check your connection.");
      return;
    }
    if (!socketInstance?.id) {
      toast.error("System Error: Secure connection not established yet.");
      return;
    }

    setIsProcessing(true);
    try {
      await axios.post('/api/payment/create-order', {
        streamerId,
        amount: Number(amount),
        donorName: donorName || 'Client',
        message,
        sticker: selectedSticker,
        clientId: socketInstance.id
      });

      socketInstance.once('payment-order-ready', (payload) => {
        new window.Razorpay({
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_SHrX3upgmJ6sGL",
          amount: payload.order.amount, currency: "INR", name: "Droppay Settlement", order_id: payload.order.id,
          handler: async (res) => {
            try {
              await axios.post('/api/payment/verify', {
                ...res,
                streamerId,
                donorName: donorName || 'Client',
                message: message || `Invoice Payment: INR ${amount}`,
                amount: Number(amount),
                sticker: selectedSticker
              });
              setIsSuccess(true);
            } catch (err) {
              console.error("Webhook Verification Error:", err);
              toast.error(err.response?.data?.msg || "Payment was captured but verification failed.");
            } finally {
              setIsProcessing(false);
            }
          }, modal: { ondismiss: () => setIsProcessing(false) }
        }).open();
      });

      socketInstance.once('payment_failed', (payload) => {
        toast.error(payload.msg || "Transaction Queue failed.");
        setIsProcessing(false);
      });

    } catch (err) {
      console.error("Payment Error:", err);
      toast.error(err.response?.data?.msg || "Payment encountered an unexpected background failure.");
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-emerald-500"><Loader2 className="animate-spin w-12 h-12" /></div>;

  return (
    <div className={`min-h-screen bg-[var(--nexus-bg)] text-[var(--nexus-text)] font-sans relative flex flex-col theme-${streamer?.nexusTheme || 'void'} ${streamer?.nexusThemeMode || 'light'} donation-page-root`}>
      <style dangerouslySetInnerHTML={{
        __html: `
        body { background-color: var(--nexus-bg); color: var(--nexus-text); transition: background-color 0.5s ease; }
      `}} />

      {/* --- ENTERPRISE HEADER --- */}
      <header className="px-6 py-4 md:px-8 shrink-0 flex justify-between items-center bg-[var(--nexus-panel)] border-b border-[var(--nexus-border)] shadow-sm w-full absolute top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
          <Logo size="1.2rem" isLight={true} className="text-black" accentColor="#000000" />
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)]">
          <Lock className="w-3 h-3" /> Secure Checkout
        </div>
      </header>

      {/* --- MAIN PAYMENT TERMINAL --- */}
      <main className="flex-1 w-full flex items-center justify-center p-4 py-20 mt-16 md:mt-0 relative z-10 overflow-y-auto hide-scroll">
        
        <div className="w-full max-w-4xl flex flex-col md:flex-row bg-[var(--nexus-panel)] border border-[var(--nexus-border)] rounded-3xl overflow-hidden shadow-2xl my-auto">
          
          {/* LEFT: VENDOR DETAILS */}
          <div className="md:w-5/12 bg-black text-white p-6 md:p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 blueprint-grid pointer-events-none" />
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#afff00]/20 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 mb-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest mb-10 shadow-sm">
                <ShieldCheck className="w-3 h-3" /> Verified Node
              </span>

              <div className="flex flex-col gap-4">
                {streamer?.avatar ? (
                  <img src={streamer.avatar} alt="Vendor Avatar" className="w-20 h-20 rounded-2xl border-2 border-white/10 object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl border-2 border-white/10 bg-white/5 flex items-center justify-center">
                    <Building className="w-8 h-8 text-white/40" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-white leading-none mb-1">
                    {streamer?.fullName || streamer?.username?.toUpperCase()}
                  </h2>
                  <p className="text-sm font-mono text-zinc-500">@{streamer?.username}</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 space-y-4">
              <p className="text-[10px] font-mono text-zinc-400 leading-relaxed uppercase tracking-widest border-t border-white/10 pt-6">
                You are executing a secure transaction. Funds route instantly.
              </p>
            </div>
          </div>

          {/* RIGHT: INVOICE / PAYMENT TERMINAL */}
          <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-center bg-[var(--nexus-bg)] relative">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form key="payment-form" onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="flex flex-col h-full justify-center space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  
                  <div className="mb-[-10px]">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] mb-3">Attach Display Sticker (Optional)</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 hide-scroll scrollbar-none">
                      {globalStickers.map(s => (
                        <div key={s.id} onClick={() => { setSelectedSticker(s.url); setAmount(s.price); }} className={`shrink-0 relative w-16 h-16 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center ${selectedSticker === s.url ? 'bg-black/5 border-black/80' : 'bg-white border-slate-200'}`}>
                          <Player autoplay loop src={s.url} style={{ height: '32px', width: '32px' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] mb-3">Transfer Amount (INR)</h3>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 w-5 h-5" />
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={amount} 
                        className="w-full bg-white border-2 border-[var(--nexus-border)] rounded-2xl py-4 px-12 text-2xl font-black text-black outline-none focus:border-black transition-colors shadow-sm" 
                        onChange={e => setAmount(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] mb-2 ml-1">Client Name</h3>
                      <div className="relative">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--nexus-text-muted)] w-4 h-4" />
                        <input 
                          required
                          placeholder="Organization or Individual" 
                          value={donorName} 
                          className="w-full bg-white border border-[var(--nexus-border)] rounded-xl py-4 px-12 text-sm font-medium text-black outline-none focus:border-black transition-colors" 
                          onChange={e => setDonorName(e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] mb-2 ml-1">Reference / Invoice ID</h3>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 text-[var(--nexus-text-muted)] w-4 h-4" />
                        <textarea 
                          placeholder="Optional details regarding this settlement..." 
                          maxLength={200} 
                          value={message} 
                          className="w-full bg-white border border-[var(--nexus-border)] rounded-xl py-4 px-12 text-sm text-black outline-none resize-none focus:border-black transition-colors min-h-[100px]" 
                          onChange={e => setMessage(e.target.value)} 
                        />
                        <div className="absolute bottom-2 right-4 left-10 flex gap-1.5 overflow-x-auto hide-scroll pb-1">
                          {quickEmotes.map(e => (
                            <button type="button" key={e} onClick={() => setMessage(p => (p + e).slice(0, 200))} className="w-6 h-6 shrink-0 bg-black/5 rounded-md text-xs hover:bg-black/10 transition-colors flex items-center justify-center">
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" disabled={isProcessing} className="w-full bg-black text-white hover:bg-[#afff00] hover:text-black py-5 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-colors shadow-lg disabled:opacity-50 disabled:pointer-events-none group">
                      {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : <>Process Payment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-4 text-[9px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)]">
                      <ShieldCheck className="w-3 h-3" /> PCI DSS Compliant
                    </div>
                  </div>

                </motion.form>
              ) : (
                <motion.div key="success-receipt" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-2">Settlement Confirmed</h2>
                  <p className="text-sm font-mono text-[var(--nexus-text-muted)] mb-8 max-w-sm">
                    INR {amount} has been successfully verified and routed to {streamer?.fullName || streamer?.username}. 
                  </p>
                  <button onClick={() => { setIsSuccess(false); setAmount(100); setMessage(''); }} className="bg-black text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black/80 transition-colors">
                    New Transaction
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

    </div>
  );
};

export default DonationPage;
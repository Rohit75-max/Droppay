import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, ShieldCheck, Zap, IndianRupee, MessageSquare, 
  Loader2, Sparkles, CheckCircle, Smile, Gift, Award, UserCircle 
} from 'lucide-react';

const DonationPage = () => {
  const { streamerId } = useParams();
  const [streamer, setStreamer] = useState(null);
  const [amount, setAmount] = useState(20);
  const [selectedSticker, setSelectedSticker] = useState('zap');
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const stickers = [
    { id: 'zap', emoji: '⚡', label: 'Zap', price: 20, color: 'from-yellow-400 to-orange-500' },
    { id: 'fire', emoji: '🔥', label: 'Hot', price: 50, color: 'from-orange-500 to-red-600' },
    { id: 'heart', emoji: '💖', label: 'Love', price: 100, color: 'from-pink-500 to-rose-600' },
    { id: 'crown', emoji: '👑', label: 'King', price: 500, color: 'from-amber-400 to-yellow-600' },
    { id: 'rocket', emoji: '🚀', label: 'Launch', price: 1000, color: 'from-indigo-500 to-purple-600' },
  ];

  useEffect(() => {
    const fetchStreamer = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/user/public/${streamerId}`);
        setStreamer(res.data);
      } catch (err) {
        console.error("Streamer not found");
      } finally {
        setLoading(false);
      }
    };
    fetchStreamer();
  }, [streamerId]);

  const currentSticker = stickers.find(s => s.id === selectedSticker);

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    
    if (!window.Razorpay) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        return;
    }

    if (!amount || amount < 1) {
        alert("Please enter a valid amount.");
        return;
    }

    setIsProcessing(true);
    
    try {
      // 1. Create Order on Backend
      const { data } = await axios.post('http://localhost:5001/api/payment/create-order', {
        streamerId,
        amount: Number(amount), // Ensure number type
        donorName: donorName || 'Anonymous',
        message,
        sticker: selectedSticker
      });

      // 2. Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_SHrX3upgmJ6sGL", 
        amount: data.amount,
        currency: "INR",
        name: "DropPay",
        description: `Sticker Drop for ${streamer?.username}`,
        order_id: data.id,
        handler: async (response) => {
          // 3. Verify Payment
          try {
            await axios.post('http://localhost:5001/api/payment/verify', {
              ...response,
              streamerId,
              donorName: donorName || 'Anonymous',
              message,
              sticker: selectedSticker,
              amount: Number(amount) // Send back the amount for verification/database
            });
            setIsSuccess(true);
          } catch (err) {
            alert("Payment verification failed. If money was deducted, please contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: { 
            name: donorName || 'Anonymous'
        },
        theme: { color: "#6366f1" },
        modal: {
            ondismiss: () => setIsProcessing(false)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment initialization failed. Is the backend running?");
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-indigo-500"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center selection:bg-indigo-500/30 pb-12">
      
      {/* Sticky Preview */}
      <div className="sticky top-0 z-50 w-full bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 p-4 lg:relative lg:bg-transparent lg:border-none lg:pt-12">
        <div className="max-w-xl mx-auto">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-3 text-center lg:hidden italic">Live Preview</p>
            <motion.div 
                layout
                className={`w-full bg-gradient-to-r ${currentSticker?.color} p-[2px] rounded-3xl shadow-[0_0_30px_rgba(99,102,241,0.2)]`}
            >
                <div className="bg-[#0a0a0a] rounded-[1.4rem] p-4 flex items-center gap-4">
                    <div className="text-4xl">{currentSticker?.emoji}</div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-black text-sm italic truncate text-white">{donorName || 'Your Name'}</span>
                            <span className="font-black text-indigo-400">₹{amount || 0}</span>
                        </div>
                        <p className="text-slate-400 text-xs font-medium truncate italic">
                            {message || 'Your message will appear here...'}
                        </p>
                    </div>
                    <Sparkles className="w-5 h-5 text-white/20" />
                </div>
            </motion.div>
        </div>
      </div>

      <div className="w-full max-w-xl px-4 mt-8 space-y-6">
        {/* Desktop Branding */}
        <div className="text-center hidden lg:block mb-8">
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Support {streamer?.username}</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-2 flex items-center justify-center gap-2">
                <Smile className="w-3 h-3 text-indigo-400" /> Premium Drop Experience
            </p>
        </div>

        {/* Sticker Selection */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-6 text-indigo-400">
            <Gift className="w-5 h-5 fill-indigo-500/10" />
            <h3 className="font-black italic uppercase tracking-widest text-[10px]">Select Your Drop</h3>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {stickers.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => { setSelectedSticker(s.id); setAmount(s.price); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border ${selectedSticker === s.id ? 'bg-indigo-600 border-indigo-500 scale-105 shadow-lg shadow-indigo-600/20' : 'bg-[#111] border-white/5 hover:border-white/20'}`}
              >
                <span className="text-2xl lg:text-3xl">{s.emoji}</span>
                <span className={`text-[9px] font-black ${selectedSticker === s.id ? 'text-white' : 'text-slate-500'}`}>₹{s.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <motion.div layout className="bg-[#0a0a0a] border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                key="form" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handlePayment} 
                className="space-y-6 relative z-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <UserCircle className="absolute left-5 top-5 text-slate-600 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      placeholder="Your Name" 
                      maxLength={20}
                      value={donorName}
                      className="w-full bg-[#111] border border-white/5 rounded-2xl py-5 px-14 focus:border-indigo-500 outline-none text-white font-bold"
                      onChange={(e) => setDonorName(e.target.value)}
                    />
                  </div>
                  <div className="relative group">
                    <IndianRupee className="absolute left-5 top-5 text-slate-600 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="number" 
                      value={amount}
                      className="w-full bg-[#111] border border-white/5 rounded-2xl py-5 px-14 focus:border-indigo-500 outline-none text-white font-black italic text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative group">
                  <MessageSquare className="absolute left-5 top-5 text-slate-600 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                  <textarea 
                    placeholder="Type your message..." 
                    maxLength={100}
                    value={message}
                    className="w-full bg-[#111] border border-white/5 rounded-[2rem] py-5 px-14 focus:border-indigo-500 outline-none text-white min-h-[120px] resize-none font-medium italic"
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button 
                  disabled={isProcessing}
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-indigo-600/30 group uppercase italic disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : (
                    <>Confirm Drop <Zap className="w-5 h-5 fill-white" /> <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Drop Confirmed!</h2>
                <p className="text-slate-500 font-medium italic mt-2">Your support has been sent to the stream.</p>
                <button onClick={() => { setIsSuccess(false); setAmount(20); setMessage(''); setDonorName(''); }} className="mt-8 text-indigo-400 font-bold uppercase text-[10px] tracking-widest hover:text-indigo-300 transition-colors">Send Another Drop</button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>

        <div className="flex items-center justify-center gap-6 text-slate-600 pt-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ShieldCheck className="w-4 h-4 text-indigo-500" /> Secure Checkout</div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Award className="w-4 h-4 text-purple-500" /> Verified Partner</div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
// --- Protocol Engine ---
import { calculateTierStatus } from '../protocol/tierProtocol';

import {
  User, Zap,
  Mail as MailIcon, Phone, Landmark,
  ShieldCheck as ShieldCheckIcon, CreditCard, Loader2, ChevronRight, Trophy,
  Target, Crosshair, Sparkles, ArrowRight, ShieldAlert, CheckCircle2, AlertCircle,
  Globe, Copy, Check
} from 'lucide-react';
import EliteCard from './EliteCard';

const AccountsHub = React.memo(({
  theme, user, saveContactUpdate,
  handleBankLink, isLinkingBank, setActiveSection, fetchProfileData,
  copyToClipboard, copiedType
}) => {
  const fileInputRef = React.useRef(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const BASE_URL = window.location.origin;
  const [isEditingEmail, setIsEditingEmail] = React.useState(false);
  const [emailInput, setEmailInput] = React.useState(user?.email || '');
  const [isEditingPhone, setIsEditingPhone] = React.useState(false);
  const [phoneInput, setPhoneInput] = React.useState(user?.phone || '');
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);

  // --- INDEPENDENT VERIFICATION ENGINE STATES ---
  const [showVerifyModal, setShowVerifyModal] = React.useState(false);
  const [verifyType, setVerifyType] = React.useState(null); // 'email' | 'phone'
  const [otpInput, setOtpInput] = React.useState('');
  const [isRequestingOtp, setIsRequestingOtp] = React.useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false);

  // --- BANKING NODE STATES ---
  const [showBankModal, setShowBankModal] = React.useState(false);
  const [bankLinkType, setBankLinkType] = React.useState('bank_account'); // 'bank_account' | 'vpa'
  const [bankForm, setBankForm] = React.useState({ name: '', account_number: '', ifsc: '', vpa: '' });
  const [bankOtpMode, setBankOtpMode] = React.useState(false);
  const [bankOtpInput, setBankOtpInput] = React.useState('');
  const [isProcessingBank, setIsProcessingBank] = React.useState(false);

  const requestVerification = async (type) => {
    setIsRequestingOtp(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/user/request-verification', { type }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVerifyType(type);
      setOtpInput('');
      setShowVerifyModal(true);
    } catch (err) {
      toast.error(err.response?.data?.msg || `Failed to transmit verification code.`);
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const submitVerification = async () => {
    setIsVerifyingOtp(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/user/confirm-verification', { type: verifyType, otp: otpInput }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (typeof fetchProfileData === 'function') await fetchProfileData();
      setShowVerifyModal(false);
      toast.success(`${verifyType === 'email' ? 'Email' : 'Phone'} Verified Successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Invalid Verification Code.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const status = calculateTierStatus(user?.tier || 'starter', user?.referralCount || 0);

  const cardStyle = useMemo(() =>
    'bg-[#070707] border border-white/10 text-[var(--nexus-text)] shadow-[var(--nexus-glow)] nexus-card',
    []);
  const inputStyle = useMemo(() =>
    'bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)] text-[var(--nexus-text)] focus:border-[var(--nexus-accent)] transition-all outline-none',
    []);
  const getCardStyle = () => cardStyle;
  const getInputStyle = () => inputStyle;

  const initiateBankLink = async () => {
    if (!bankForm.name) return toast.error("Account Holder Name is required.");
    if (bankLinkType === 'bank_account' && (!bankForm.account_number || !bankForm.ifsc)) {
      return toast.error("Complete all banking fields.");
    }
    if (bankLinkType === 'vpa' && !bankForm.vpa) {
      return toast.error("Enter your UPI ID.");
    }

    setIsProcessingBank(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/user/request-verification', { type: 'phone' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBankOtpMode(true);
      setBankOtpInput('');
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to initiate security verification.");
    } finally {
      setIsProcessingBank(false);
    }
  };

  const confirmBankLink = async () => {
    if (bankOtpInput.length !== 6) return toast.error("Enter valid 6-digit code.");
    setIsProcessingBank(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/user/add-bank-account', {
        ...bankForm,
        otp: bankOtpInput
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (typeof fetchProfileData === 'function') await fetchProfileData();
      setShowBankModal(false);
      setBankOtpMode(false);
      toast.success("Banking details linked successfully.");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Verification Failed. Try again.");
    } finally {
      setIsProcessingBank(false);
    }
  };
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Basic Validation
    if (file.size > 2 * 1024 * 1024) return toast.error("File size exceeds 2MB limit.");
    if (!file.type.startsWith('image/')) return toast.error("Only image files are permitted.");

    setIsUploadingAvatar(true);
    try {
      // 2. Transcode to Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result;

          // 3. Transmit to Nexus API
          const token = localStorage.getItem('token');
          await axios.post('/api/user/update-profile', { avatar: base64String }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          // 4. Refresh Node State
          if (typeof fetchProfileData === 'function') await fetchProfileData();
          toast.success("Profile photo updated successfully!");
        } catch (err) {
          console.error("Avatar Update Error:", err);
          toast.error(err.response?.data?.msg || "Failed to update profile photo.");
        } finally {
          setIsUploadingAvatar(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Avatar Transcode Error:", err);
      toast.error("Failed to process image file.");
      setIsUploadingAvatar(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-10 font-sans pb-20 pt-4 w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">

        {/* --- LEFT COLUMN --- */}
        <div className="w-full lg:col-span-8 flex flex-col gap-8">
          
          {/* USER PROFILE CARD */}
          <EliteCard
            className={`w-full flex flex-col border rounded-[2rem] p-5 md:p-7 relative transition-all overflow-hidden ${getCardStyle()}`}
          >

            <div className="flex flex-col md:flex-row gap-8 w-full relative z-10 min-h-full">
              {/* Compact Avatar & Primary Identity */}
              <div className="flex flex-row md:flex-col items-center md:items-start shrink-0 gap-6 md:gap-4 w-full md:w-auto px-1">
                {/* Tier Frame Ring */}
                <div className={`relative group/avatar flex items-center justify-center`}>
                  <div className={`p-[3px] rounded-[1.6rem] ${
                    user.tier === 'legend' 
                      ? 'bg-gradient-to-br from-amber-400 via-yellow-300 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.6)]' 
                      : user.tier === 'pro' 
                        ? 'bg-gradient-to-br from-indigo-500 via-purple-400 to-blue-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                        : 'bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  }`}>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-28 h-28 md:w-40 md:h-40 rounded-[1.4rem] flex items-center justify-center overflow-hidden transition-all bg-[var(--nexus-bg)] relative cursor-pointer"
                    >
                    {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" />
                    ) : (
                      <User className="w-12 h-12 md:w-16 md:h-16 text-[var(--nexus-text-muted)] opacity-20" />
                    )}

                    {/* OVERLAY: CHANGE PHOTO */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      {isUploadingAvatar ? (
                        <Loader2 className="w-6 h-6 text-[var(--nexus-accent)] animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 text-[var(--nexus-accent)]" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-white">Change Photo</span>
                        </>
                      )}
                    </div>

                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      className="hidden"
                      accept="image/*"
                    />
                    </div>
                  </div>
                  
                  {status.badge && (
                    <div className="absolute top-2 right-[20%] md:-top-2 md:-right-2 p-2 rounded-xl border bg-black border-white/10 shadow-xl flex items-center gap-1.5 translate-y-1">
                      {status.badge.icon === 'Target' && <Target className="w-3 h-3 text-cyan-400" />}
                      {status.badge.icon === 'Crosshair' && <Crosshair className="w-3 h-3 text-indigo-400" />}
                      {status.badge.icon === 'Sparkles' && <Sparkles className="w-3 h-3 text-amber-400" />}
                      <span className="text-[8px] font-black uppercase italic text-[var(--nexus-accent)]">{status.badge.name}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <h2 className="text-2xl md:text-xl font-black italic tracking-tighter text-[var(--nexus-text)]">{user.fullName || user.username}</h2>
                  <p className="text-xs md:text-[10px] font-mono font-bold text-[var(--nexus-accent)] opacity-60">@{user.username}</p>
                </div>
              </div>

              {/* Refined Data Metadata Stack */}
              <div className="flex-1 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-1.5">
                        <MailIcon className="w-3 h-3 text-[var(--nexus-text-muted)] opacity-50" />
                        <label className="text-[9px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest">Email Address</label>
                      </div>
                      {!isEditingEmail && <button onClick={() => { setEmailInput(user.email || ''); setIsEditingEmail(true); }} className="text-[8px] font-bold uppercase text-[var(--nexus-accent)] opacity-60 hover:opacity-100 italic">Update</button>}
                    </div>
                    {isEditingEmail ? (
                      <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                          <input
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            type="email"
                            autoComplete="email"
                            className={`flex-1 min-w-0 rounded-xl p-3 text-xs font-bold text-white bg-black/40 border border-white/10 focus:border-[var(--nexus-accent)] outline-none transition-all placeholder:text-white/30`}
                            placeholder="official@email.com"
                          />
                          <button
                            disabled={isSendingOtp}
                            onClick={async () => {
                              const trimmed = emailInput.trim().toLowerCase();
                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                              if (!emailRegex.test(trimmed)) { toast.error('Please enter a valid email address.'); return; }
                              if (trimmed === user.email) { toast.error('This is already your current email.'); return; }
                              setIsSendingOtp(true);
                              const success = await saveContactUpdate('email', trimmed);
                              setIsSendingOtp(false);
                              if (success) setIsEditingEmail(false);
                            }}
                            className="px-4 py-3 shrink-0 bg-[var(--nexus-accent)] text-black font-black uppercase text-[9px] rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 min-w-[64px] justify-center disabled:opacity-60"
                          >
                            {isSendingOtp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Send OTP'}
                          </button>
                        </div>
                        <button onClick={() => setIsEditingEmail(false)} className="text-[9px] text-slate-500 hover:text-slate-300 transition-colors font-semibold pl-1">Cancel</button>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <span className="text-xs font-bold truncate opacity-80">{user.email}</span>
                        {user.isEmailVerified ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <button onClick={() => requestVerification('email')} disabled={isRequestingOtp} className="text-amber-500 hover:text-amber-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Phone Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[var(--nexus-text-muted)] opacity-50" />
                        <label className="text-[9px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest">Mobile Number</label>
                      </div>
                      {!isEditingPhone && <button onClick={() => { setPhoneInput(user.phone || ''); setIsEditingPhone(true); }} className="text-[8px] font-bold uppercase text-[var(--nexus-accent)] opacity-60 hover:opacity-100 italic">Update</button>}
                    </div>
                    {isEditingPhone ? (
                      <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                          <input
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            className={`flex-1 min-w-0 rounded-xl p-3 text-xs font-bold text-white bg-black/40 border border-white/10 focus:border-[var(--nexus-accent)] outline-none transition-all placeholder:text-white/30`}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                          />
                          <button
                            disabled={isSendingOtp}
                            onClick={async () => {
                              const trimmed = phoneInput.trim();
                              if (!/^[6-9]\d{9}$/.test(trimmed)) { toast.error('Please enter a valid 10-digit Indian mobile number.'); return; }
                              if (trimmed === user.phone) { toast.error('This is already your current mobile number.'); return; }
                              setIsSendingOtp(true);
                              const success = await saveContactUpdate('phone', trimmed);
                              setIsSendingOtp(false);
                              if (success) setIsEditingPhone(false);
                            }}
                            className="px-4 py-3 shrink-0 bg-[var(--nexus-accent)] text-black font-black uppercase text-[9px] rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 min-w-[64px] justify-center disabled:opacity-60"
                          >
                            {isSendingOtp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Send OTP'}
                          </button>
                        </div>
                        <button onClick={() => setIsEditingPhone(false)} className="text-[9px] text-slate-500 hover:text-slate-300 transition-colors font-semibold pl-1">Cancel</button>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <span className="text-xs font-bold opacity-80">{user.phone || "No Link"}</span>
                        {user.isPhoneVerified ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : user.phone && (
                          <button onClick={() => requestVerification('phone')} disabled={isRequestingOtp} className="text-amber-500 hover:text-amber-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </EliteCard>

          {/* STREAMS & OVERLAYS CARD (Enhanced & Space-Efficient) */}
          <EliteCard
            className={`w-full flex flex-col border rounded-[2.5rem] p-6 lg:p-8 relative transition-all ${getCardStyle()}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)] border border-[var(--nexus-accent)]/20 shadow-inner`}>
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase italic tracking-widest text-[var(--nexus-text)]">Active Streams</h3>
                  <p className="text-[8px] font-bold text-[var(--nexus-text-muted)] uppercase tracking-wider">Operational Source Nodes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)]">Live Signal Ready</span>
              </div>
            </div>

            {/* Compact 2x2 Grid for Link Sources */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* MASTER OVERLAY */}
              <div 
                onClick={() => copyToClipboard(`${BASE_URL}/overlay/master/${user?.obsKey}`, 'master')}
                className="group relative p-4 rounded-2xl border bg-indigo-500/[0.03] border-indigo-500/20 hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300">Master Source</span>
                  </div>
                  {copiedType === 'master' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-indigo-400/50 group-hover:text-indigo-400 transition-colors" />}
                </div>
                <p className="text-[10px] font-mono text-indigo-100/40 truncate">...{user?.obsKey?.slice(-12)}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/[0.02] pointer-events-none" />
              </div>

              {/* LIVE ALERTS */}
              <div 
                onClick={() => copyToClipboard(`${BASE_URL}/overlay/${user?.obsKey}`, 'obs')}
                className="group relative p-4 rounded-2xl border bg-[var(--nexus-accent)]/[0.03] border-[var(--nexus-accent)]/20 hover:border-[var(--nexus-accent)]/50 transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[var(--nexus-accent)]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--nexus-text)]">Alert Node</span>
                  </div>
                  {copiedType === 'obs' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[var(--nexus-accent)]/50 group-hover:text-[var(--nexus-accent)] transition-colors" />}
                </div>
                <p className="text-[10px] font-mono text-[var(--nexus-accent)]/40 truncate">...{user?.obsKey?.slice(-12)}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--nexus-accent)]/0 to-[var(--nexus-accent)]/[0.02] pointer-events-none" />
              </div>

              {/* STREAM GOAL */}
              <div 
                onClick={() => copyToClipboard(`${BASE_URL}/goal/${user?.username}`, 'goal')}
                className="group relative p-4 rounded-2xl border bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">Mission Hub</span>
                  </div>
                  {copiedType === 'goal' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-500/50 group-hover:text-amber-500 transition-colors" />}
                </div>
                <p className="text-[10px] font-mono text-amber-500/40 truncate">/{user?.username}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/[0.02] pointer-events-none" />
              </div>

              {/* DONATION PAGE */}
              <div 
                onClick={() => copyToClipboard(`${BASE_URL}/pay/${user?.username}`, 'pay')}
                className="group relative p-4 rounded-2xl border bg-rose-500/[0.03] border-rose-500/20 hover:border-rose-500/50 transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-rose-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-400">Payment Page</span>
                  </div>
                  {copiedType === 'pay' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-rose-500/50 group-hover:text-rose-500 transition-colors" />}
                </div>
                <p className="text-[10px] font-mono text-rose-500/40 truncate">/pay/{user?.username}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-rose-500/[0.02] pointer-events-none" />
              </div>
            </div>
            
            {/* Soft Branding/Note */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center">
              <p className="text-[8px] font-bold text-[var(--nexus-text-muted)] uppercase tracking-[0.2em] opacity-40 italic">Global Deployment Keys Optimized for OBS & Streamlabs</p>
            </div>
          </EliteCard>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="w-full lg:col-span-4 flex flex-col gap-8">
          {/* PAYOUT SETTINGS CARD */}
          <EliteCard
            glowColor="rgba(245, 158, 11, 0.15)"
            className={`w-full flex flex-col border rounded-[2.5rem] p-8 shadow-2xl relative transition-all ${getCardStyle()}`}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3.5 bg-amber-500/10 rounded-2xl text-amber-500 border border-amber-500/20"><Landmark className="w-7 h-7" /></div>
              <div>
                <h3 className="text-sm font-black uppercase italic tracking-widest text-[var(--nexus-text)]">Payout Settings</h3>
                <p className="text-[8px] font-black text-[var(--nexus-text-muted)] uppercase tracking-widest">Automatic Settlements</p>
              </div>
            </div>

            <div className="space-y-8 flex-1 z-10 w-full">
              {(user.razorpayFundAccountId || user.razorpayAccountId) && user.payoutSettings?.bankDetailsLinked ? (
                <div className="p-6 rounded-[2rem] border flex items-center gap-5 bg-emerald-500/10 border-emerald-500/20 shadow-inner">
                  <ShieldCheckIcon className="w-7 h-7 text-emerald-500" />
                  <div className="min-w-0">
                    <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Bank Linked</span>
                    <p className="text-xs font-mono font-bold text-[var(--nexus-text-muted)] mt-1 truncate">{user.razorpayFundAccountId || user.razorpayAccountId}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 w-full">
                  <div className={`p-6 rounded-[2rem] border-2 border-dashed bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)]`}>
                    <CreditCard className="w-5 h-5 text-amber-500 mb-4" />
                    <p className="text-[11px] text-[var(--nexus-text-muted)] font-bold uppercase leading-tight italic">Link your bank account to start receiving payouts.</p>
                  </div>

                  {!user.isPhoneVerified && (
                    <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500 flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">Verification Required: Verify your phone number to enable payout settings.</p>
                    </div>
                  )}

                  <button
                    onClick={() => { setBankOtpMode(false); setBankLinkType('bank_account'); setShowBankModal(true); setBankForm({ name: '', account_number: '', ifsc: '', vpa: '' }); }}
                    disabled={!user.isPhoneVerified}
                    className={`w-full py-5 rounded-2xl font-black uppercase italic text-[11px] transition-all flex items-center justify-center gap-3 ${user.isPhoneVerified ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20' : 'bg-[var(--nexus-text-muted)]/10 text-[var(--nexus-text-muted)] cursor-not-allowed border border-[var(--nexus-border)]'}`}
                  >
                    Link Bank Account <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </EliteCard>

          {/* GROWTH LINK */}
          <div onClick={() => setActiveSection('growth')} className={`w-full shrink-0 rounded-[2rem] p-6 flex items-center justify-between transition-all cursor-pointer group border bg-[#0a0a0a] border-[var(--nexus-border)] hover:border-indigo-500/30 shadow-[var(--nexus-glow)]`}>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-inner"><Trophy className="w-6 h-6" /></div>
              <p className="text-[11px] font-black uppercase italic text-[var(--nexus-text-muted)] group-hover:text-indigo-500 transition-colors tracking-widest">Upgrade Tier</p>
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-500 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>

      {/* OTP VERIFICATION MODAL */}
      <AnimatePresence>
        {showVerifyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`w-full max-w-md p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden bg-[var(--nexus-panel)] border-[var(--nexus-border)]`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500/20 shadow-inner">
                  <ShieldAlert className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Identity Verification</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-1">{verifyType === 'email' ? 'Email Verification' : 'Phone Verification'}</p>
                </div>
                <p className={`text-sm italic text-[var(--nexus-text-muted)]`}>
                  Enter the 6-digit code sent to your {verifyType}.
                </p>
                <div className="w-full space-y-4 pt-4">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className={`w-full text-center text-3xl tracking-[0.5em] font-black p-4 rounded-2xl outline-none border transition-all bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)] text-[var(--nexus-text)] focus:border-emerald-500 shadow-inner`}
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setShowVerifyModal(false)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-colors border bg-[var(--nexus-accent)]/5 text-[var(--nexus-text-muted)] border-[var(--nexus-border)] hover:bg-[var(--nexus-accent)]/10`}>Cancel</button>
                    <button onClick={submitVerification} disabled={isVerifyingOtp || otpInput.length !== 6} className="flex-[2] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-emerald-500 text-black hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                      {isVerifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BANKING MODAL */}
      <AnimatePresence>
        {showBankModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`w-full max-w-md p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden bg-[var(--nexus-panel)] border-[var(--nexus-border)]`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border-2 border-amber-500/20 shadow-inner">
                  <Landmark className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Secure Payouts</h3>
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mt-1">Link Bank Account</p>
                </div>

                {!bankOtpMode ? (
                  <div className="w-full space-y-4">
                    <div className="flex p-1 rounded-xl bg-[var(--nexus-bg)]/40 border border-[var(--nexus-border)] mb-4 shadow-inner">
                      <button onClick={() => setBankLinkType('bank_account')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${bankLinkType === 'bank_account' ? 'bg-amber-500 text-black' : 'text-[var(--nexus-text-muted)] hover:text-[var(--nexus-text)]'}`}>Bank Account</button>
                      <button onClick={() => setBankLinkType('vpa')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${bankLinkType === 'vpa' ? 'bg-amber-500 text-black' : 'text-[var(--nexus-text-muted)] hover:text-[var(--nexus-text)]'}`}>UPI ID</button>
                    </div>

                    <div className="space-y-3 text-left">
                      <div>
                        <label className="text-[9px] font-black uppercase text-amber-500 tracking-widest mb-1 block">Account Holder Name</label>
                        <input value={bankForm.name} onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })} placeholder="Full Legal Name" className={`w-full rounded-2xl p-4 text-sm font-bold border-2 transition-all ${getInputStyle()}`} />
                      </div>
                      {bankLinkType === 'bank_account' ? (
                        <>
                          <div>
                            <label className="text-[9px] font-black uppercase text-amber-500 tracking-widest mb-1 block">Account Number</label>
                            <input value={bankForm.account_number} onChange={(e) => setBankForm({ ...bankForm, account_number: e.target.value })} placeholder="0000000000" className={`w-full rounded-2xl p-4 text-sm font-bold font-mono border-2 transition-all ${getInputStyle()}`} />
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase text-amber-500 tracking-widest mb-1 block">IFSC Code</label>
                            <input value={bankForm.ifsc} onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })} placeholder="IFSC0001234" className={`w-full rounded-2xl p-4 text-sm font-bold font-mono border-2 transition-all ${getInputStyle()}`} />
                          </div>
                        </>
                      ) : (
                        <div>
                          <label className="text-[9px] font-black uppercase text-amber-500 tracking-widest mb-1 block">UPI ID</label>
                          <input value={bankForm.vpa} onChange={(e) => setBankForm({ ...bankForm, vpa: e.target.value.toLowerCase() })} placeholder="username@bank" className={`w-full rounded-2xl p-4 text-sm font-bold font-mono border-2 transition-all ${getInputStyle()}`} />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={() => setShowBankModal(false)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-colors border bg-[var(--nexus-accent)]/5 text-[var(--nexus-text-muted)] border-[var(--nexus-border)] hover:bg-[var(--nexus-accent)]/10`}>Back</button>
                      <button onClick={initiateBankLink} disabled={isProcessingBank} className="flex-[2] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-amber-500 text-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
                        {isProcessingBank ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <p className={`text-sm italic text-[var(--nexus-text-muted)]`}>Enter the code sent to your phone.</p>
                    <input type="text" maxLength={6} value={bankOtpInput} onChange={(e) => setBankOtpInput(e.target.value.replace(/\D/g, ''))} placeholder="000000" className={`w-full text-center text-3xl tracking-[0.5em] font-black p-4 rounded-2xl outline-none border transition-all bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)] text-[var(--nexus-text)] focus:border-emerald-500 shadow-inner mt-4`} />
                    <div className="flex gap-3 pt-4">
                      <button onClick={() => setBankOtpMode(false)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-colors border bg-[var(--nexus-accent)]/5 text-[var(--nexus-text-muted)] border-[var(--nexus-border)] hover:bg-[var(--nexus-accent)]/10`}>Back</button>
                      <button onClick={confirmBankLink} disabled={isProcessingBank || bankOtpInput.length !== 6} className="flex-[2] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-emerald-500 text-black hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                        {isProcessingBank ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default AccountsHub;
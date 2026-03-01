import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
// --- Protocol Engine ---
import { calculateTierStatus } from '../protocol/tierProtocol';

import {
  User, UploadCloud, Edit3, Save, BadgeCheck, Crown, Zap, ShieldCheck,
  UserCircle, Hash, Mail as MailIcon, Phone, MessageSquare, Landmark,
  ShieldCheck as ShieldCheckIcon, CreditCard, Loader2, ChevronRight, Trophy,
  Target, Crosshair, Sparkles, ArrowRight, ShieldAlert, CheckCircle2, AlertCircle,
  Globe, Copy, Check
} from 'lucide-react';

const AccountsHub = ({
  theme, user, isEditing, setIsEditing, editForm, setEditForm,
  profilePreview, handleImageChange, saveProfileUpdates, saveContactUpdate, fileInputRef,
  handleBankLink, isLinkingBank, setActiveSection, fetchProfileData,
  copyToClipboard, copiedType
}) => {
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
      await axios.post('http://localhost:5001/api/user/request-verification', { type }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVerifyType(type);
      setOtpInput('');
      setShowVerifyModal(true);
    } catch (err) {
      alert(err.response?.data?.msg || `Failed to transmit ${type} key.`);
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const submitVerification = async () => {
    setIsVerifyingOtp(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/user/confirm-verification', { type: verifyType, otp: otpInput }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (typeof fetchProfileData === 'function') await fetchProfileData();
      setShowVerifyModal(false);
      alert(`${verifyType === 'email' ? 'Email' : 'Phone'} Verified Successfully!`);
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid Authorization Key.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const status = calculateTierStatus(user?.tier || 'starter', user?.referralCount || 0);

  const getCardStyle = () => {
    return 'bg-[var(--nexus-panel)] border-[var(--nexus-border)] text-[var(--nexus-text)] shadow-[var(--nexus-glow)] nexus-card';
  };

  const getInputStyle = () => {
    return 'bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)] text-[var(--nexus-text)] focus:border-[var(--nexus-accent)] transition-all outline-none';
  };

  const initiateBankLink = async () => {
    if (!bankForm.name) return alert("Account Holder Name is required.");

    if (bankLinkType === 'bank_account' && (!bankForm.account_number || !bankForm.ifsc)) {
      return alert("Complete all banking fields.");
    }

    if (bankLinkType === 'vpa' && !bankForm.vpa) {
      return alert("Enter your UPI ID.");
    }

    setIsProcessingBank(true);
    try {
      const token = localStorage.getItem('token');
      // Request an OTP to the user's phone for high-security action
      await axios.post('http://localhost:5001/api/user/request-verification', { type: 'phone' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBankOtpMode(true);
      setBankOtpInput('');
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to initiate banking security protocol.");
    } finally {
      setIsProcessingBank(false);
    }
  };

  const confirmBankLink = async () => {
    if (bankOtpInput.length !== 6) return alert("Enter valid 6-digit key.");
    setIsProcessingBank(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/user/add-bank-account', {
        ...bankForm,
        otp: bankOtpInput
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (typeof fetchProfileData === 'function') await fetchProfileData();
      setShowBankModal(false);
      setBankOtpMode(false);
      alert("Banking details verified and securely linked.");
    } catch (err) {
      alert(err.response?.data?.msg || "Verification Failed. Try again.");
    } finally {
      setIsProcessingBank(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-10 font-sans pb-20 pt-4 w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">

        {/* --- LEFT COLUMN (Hub & Handshake) --- */}
        <div className="w-full lg:col-span-8 flex flex-col gap-8">
          {/* --- IDENTITY HUB (LEGEND STATUS REFACTOR) --- */}
          <div className={`w-full flex flex-col border rounded-[2.5rem] p-6 lg:p-8 relative transition-all overflow-hidden ${getCardStyle()}`}>

            {/* Header Block */}
            <div className="flex justify-between items-start mb-10 w-full relative z-10">
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-2 bg-[var(--nexus-accent)]/10 border border-[var(--nexus-accent)]/20 text-[var(--nexus-accent)] rounded-xl text-[9px] font-black uppercase flex items-center gap-2">
                  <BadgeCheck className="w-3 h-3" /> Verified Node
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${user.tier === 'legend' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : user.tier === 'pro' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)] text-[var(--nexus-text-muted)]'}`}>
                  {user.tier === 'legend' && <Crown className="w-3.5 h-3.5 fill-amber-500" />}
                  {user.tier === 'pro' && <Zap className="w-3.5 h-3.5 fill-indigo-400" />}
                  {user.tier === 'starter' && <ShieldCheck className="w-3.5 h-3.5" />}
                  <span className="text-[9px] font-black uppercase italic tracking-widest">{status.tierDetails.label}</span>
                </div>
              </div>
              <button
                onClick={() => isEditing ? saveProfileUpdates() : setIsEditing(true)}
                className={`flex items-center justify-center gap-3 px-6 py-3 rounded-[var(--nexus-radius)] text-[10px] font-black uppercase tracking-widest transition-all border nexus-btn ${isEditing ? 'bg-[var(--nexus-accent)] text-black border-[var(--nexus-accent)]' : 'bg-[var(--nexus-panel)] text-[var(--nexus-text)] border-[var(--nexus-border)] hover:bg-[var(--nexus-accent)] hover:text-black hover:border-[var(--nexus-accent)]'}`}
              >
                {isEditing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
              </button>
            </div>

            {/* Core Split Content */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full relative z-10">

              {/* Left Side: Avatar & Name */}
              <div className="flex flex-col items-center md:items-start shrink-0 space-y-6">
                <div className="relative group/avatar shrink-0">
                  <div className={`w-36 h-36 md:w-48 md:h-48 rounded-[var(--nexus-radius)] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all group-hover/avatar:border-[var(--nexus-accent)] bg-[var(--nexus-bg)] border-[var(--nexus-border)]`}>
                    {profilePreview ? (
                      <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className={`w-14 h-14 md:w-20 md:h-20 text-[var(--nexus-text-muted)] opacity-30`} />
                    )}
                    <button onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/70 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
                      <UploadCloud className="w-8 h-8 text-[var(--nexus-accent)] mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Upload</span>
                    </button>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />

                  {status.badge && (
                    <div className={`absolute -bottom-3 -right-3 p-3 rounded-2xl border bg-black shadow-2xl flex items-center gap-2 border-[var(--nexus-border)] ${status.badge.flair}`}>
                      {status.badge.icon === 'Target' && <Target className="w-4 h-4 text-cyan-400" />}
                      {status.badge.icon === 'Crosshair' && <Crosshair className="w-4 h-4 text-indigo-400" />}
                      {status.badge.icon === 'Sparkles' && <Sparkles className="w-4 h-4 text-amber-400" />}
                      <span className={`text-[10px] font-black uppercase italic tracking-widest text-[var(--nexus-accent)]`}>
                        {status.badge.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 w-full">
                  {isEditing ? (
                    <div className="space-y-3 w-full">
                      <div>
                        <label className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest mb-1.5"><UserCircle className="w-3 h-3" /> Full Name</label>
                        <input value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} placeholder="Full Name (Display)" className={`w-full rounded-2xl p-4 text-center text-sm font-bold outline-none border-2 transition-all ${getInputStyle()}`} />
                      </div>
                      <div>
                        <label className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest mb-1.5"><Hash className="w-3 h-3" /> Unique Handle</label>
                        <input value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value.toLowerCase().replace(/\s+/g, '') })} placeholder="Unique Handle (Username)" className={`w-full rounded-2xl p-4 text-center text-sm font-mono font-bold outline-none border-2 transition-all ${getInputStyle()}`} />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <label className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest mb-1.5"><UserCircle className="w-3 h-3" /> Display Name</label>
                      <p className={`text-xl font-black italic tracking-tighter text-[var(--nexus-text)]`}>{user.fullName || user.username}</p>
                      <p className="text-[10px] font-mono font-bold text-[var(--nexus-accent)] opacity-60 mt-1">@{user.username}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-[var(--nexus-accent)]/10 border border-[var(--nexus-accent)]/20 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-[var(--nexus-accent)] animate-pulse" />
                    <p className="text-[var(--nexus-accent)] text-[9px] font-black uppercase tracking-[0.2em]">Identity Synchronized</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Data Stack */}
              <div className="flex-1 space-y-5 w-full min-w-0">

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest ml-1"><Hash className="w-3.5 h-3.5" /> Identity Hash (Handle)</label>
                  <div className={`w-full rounded-[var(--nexus-radius)] p-4 border bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)]`}>
                    <p className="text-sm font-mono font-bold text-[var(--nexus-accent)]">@{user.username}</p>
                  </div>
                </div>

                {/* Email Block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest ml-1"><MailIcon className="w-3.5 h-3.5" /> Email</label>
                    {!isEditingEmail && (
                      <button onClick={() => { setIsEditingEmail(true); setEmailInput(user.email || ''); }} className={`text-[9px] font-black uppercase tracking-widest hover:text-[var(--nexus-accent)] transition-colors text-[var(--nexus-text-muted)]`}>
                        Edit
                      </button>
                    )}
                  </div>
                  {isEditingEmail ? (
                    <div className="flex gap-2">
                      <input value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className={`w-full rounded-2xl p-4 text-sm font-bold outline-none border-2 transition-all ${getInputStyle()}`} />
                      <button disabled={isSendingOtp} onClick={async () => { setIsSendingOtp(true); const success = await saveContactUpdate('email', emailInput); setIsSendingOtp(false); if (success) setIsEditingEmail(false); }} className="px-5 rounded-[var(--nexus-radius)] bg-[var(--nexus-accent)] text-black font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2 nexus-btn">
                        {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                      </button>
                    </div>
                  ) : (
                    <div className={`w-full rounded-2xl p-4 border flex items-center justify-between transition-all bg-[var(--nexus-panel)] border-[var(--nexus-border)]`}>
                      <p className={`text-sm font-bold truncate pr-4 text-[var(--nexus-text)]`}>{user.email}</p>
                      {user.isEmailVerified ? (
                        <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]/20 text-[var(--nexus-accent)]`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                        </div>
                      ) : (
                        <button onClick={() => requestVerification('email')} disabled={isRequestingOtp} className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all nexus-btn bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black`}>
                          {isRequestingOtp && verifyType === 'email' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertCircle className="w-3.5 h-3.5" />}
                          <span className="text-[9px] font-black uppercase tracking-widest">{isRequestingOtp && verifyType === 'email' ? 'Gen...' : 'Verify'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Contact Number Block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest ml-1"><Phone className="w-3.5 h-3.5" /> Contact Number</label>
                    {!isEditingPhone && (
                      <button onClick={() => { setIsEditingPhone(true); setPhoneInput(user.phone || ''); }} className={`text-[9px] font-black uppercase tracking-widest hover:text-[var(--nexus-accent)] transition-colors text-[var(--nexus-text-muted)]`}>
                        Edit
                      </button>
                    )}
                  </div>
                  {isEditingPhone ? (
                    <div className="flex gap-2">
                      <input value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} className={`w-full rounded-2xl p-4 text-sm font-bold outline-none border-2 transition-all ${getInputStyle()}`} />
                      <button disabled={isSendingOtp} onClick={async () => { setIsSendingOtp(true); const success = await saveContactUpdate('phone', phoneInput); setIsSendingOtp(false); if (success) setIsEditingPhone(false); }} className="px-5 rounded-[var(--nexus-radius)] bg-[var(--nexus-accent)] text-black font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2 nexus-btn">
                        {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                      </button>
                    </div>
                  ) : (
                    <div className={`w-full rounded-2xl p-4 border flex items-center justify-between transition-all bg-[var(--nexus-panel)] border-[var(--nexus-border)]`}>
                      <p className={`text-sm font-bold truncate pr-4 text-[var(--nexus-text)]`}>{user.phone || "No contact linked"}</p>
                      {user.phone && (
                        user.isPhoneVerified ? (
                          <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]/20 text-[var(--nexus-accent)]`}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                          </div>
                        ) : (
                          <button onClick={() => requestVerification('phone')} disabled={isRequestingOtp} className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all nexus-btn bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black`}>
                            {isRequestingOtp && verifyType === 'phone' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            <span className="text-[9px] font-black uppercase tracking-widest">{isRequestingOtp && verifyType === 'phone' ? 'Gen...' : 'Verify'}</span>
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Bio Block */}
                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest ml-1"><MessageSquare className="w-3.5 h-3.5" /> Bio</label>
                  {isEditing ? (
                    <textarea value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} className={`w-full rounded-2xl p-4 text-sm font-bold outline-none border-2 transition-all resize-none min-h-[90px] ${getInputStyle()}`} />
                  ) : (
                    <div className={`w-full rounded-2xl p-4 border bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)]`}>
                      <p className={`text-sm font-medium italic text-[var(--nexus-text-muted)]`}>"{user.bio || 'Signal established.'}"</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
          {/* --- IDENTITY HANDSHAKE (MODULAR CARD) --- */}
          <div className={`w-full flex flex-col border rounded-[2.5rem] p-8 lg:p-10 relative transition-all ${getCardStyle()}`}>
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-[var(--nexus-radius)] bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)]`}>
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black uppercase italic tracking-widest text-[var(--nexus-text)]">Identity Handshake</h3>
            </div>

            <div className="space-y-6">
              {/* 1. ALERT SOURCE */}
              <div className="flex flex-col gap-3 group">
                <label className="text-[9px] font-black uppercase text-[var(--nexus-text-muted)] tracking-[0.2em] flex justify-between h-3">
                  Live Alert Source
                  {copiedType === 'obs' && <span className="text-[var(--nexus-accent)] animate-pulse">✓ COPIED</span>}
                </label>
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => copyToClipboard(`${BASE_URL}/overlay/${user?.obsKey}`, 'obs')}
                    className={`flex-1 cursor-pointer p-4 rounded-[var(--nexus-radius)] border transition-all bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)] hover:border-[var(--nexus-accent)]`}
                  >
                    <input readOnly value={`${BASE_URL}/overlay/${user?.obsKey}`} className="w-full bg-transparent border-none outline-none text-[10px] font-mono text-[var(--nexus-accent)] truncate pointer-events-none" />
                  </div>
                  <button onClick={() => copyToClipboard(`${BASE_URL}/overlay/${user?.obsKey}`, 'obs')} className={`p-4 rounded-[var(--nexus-radius)] transition-all shadow-md nexus-btn bg-[var(--nexus-accent)] text-black hover:brightness-110`}>
                    {copiedType === 'obs' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2. GOAL SOURCE */}
              <div className="flex flex-col gap-3 group">
                <label className="text-[9px] font-black uppercase text-[var(--nexus-text-muted)] tracking-[0.2em] flex justify-between h-3">
                  Mission Goal Source
                  {copiedType === 'goal' && <span className="text-amber-500 animate-pulse">✓ COPIED</span>}
                </label>
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => copyToClipboard(`${BASE_URL}/goal/${user?.username}`, 'goal')}
                    className={`flex-1 cursor-pointer p-4 rounded-2xl border transition-all bg-[var(--nexus-panel)] border-[var(--nexus-border)] hover:border-amber-500 shadow-inner`}
                  >
                    <input readOnly value={`${BASE_URL}/goal/${user?.username}`} className="w-full bg-transparent border-none outline-none text-[10px] font-mono text-amber-500 truncate pointer-events-none" />
                  </div>
                  <button onClick={() => copyToClipboard(`${BASE_URL}/goal/${user?.username}`, 'goal')} className={`p-4 rounded-[var(--nexus-radius)] transition-all shadow-md nexus-btn bg-amber-500 text-black hover:bg-amber-400`}>
                    {copiedType === 'goal' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 3. DONATION PAGE */}
              <div className="flex flex-col gap-3 group">
                <label className="text-[9px] font-black uppercase text-[var(--nexus-text-muted)] tracking-[0.2em] flex justify-between h-3">
                  Public Node (Payment Page)
                  {copiedType === 'pay' && <span className="text-[var(--nexus-accent)] animate-pulse">✓ COPIED</span>}
                </label>
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => copyToClipboard(`${BASE_URL}/pay/${user?.username}`, 'pay')}
                    className={`flex-1 cursor-pointer p-4 rounded-[var(--nexus-radius)] border transition-all bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)] hover:border-[var(--nexus-accent)]`}
                  >
                    <input readOnly value={`${BASE_URL}/pay/${user?.username}`} className="w-full bg-transparent border-none outline-none text-[10px] font-mono text-[var(--nexus-accent)] truncate pointer-events-none" />
                  </div>
                  <button onClick={() => copyToClipboard(`${BASE_URL}/pay/${user?.username}`, 'pay')} className={`p-4 rounded-[var(--nexus-radius)] transition-all shadow-md nexus-btn bg-[var(--nexus-accent)] text-black hover:brightness-110`}>
                    {copiedType === 'pay' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 4. MASTER OBS OVERLAY */}
              <div className="flex flex-col gap-3 group">
                <label className="text-[9px] font-black uppercase text-[var(--nexus-text-muted)] tracking-[0.2em] flex justify-between h-3">
                  Master OBS Overlay (All-In-One)
                  {copiedType === 'master' && <span className="text-indigo-400 animate-pulse">✓ COPIED</span>}
                </label>
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => copyToClipboard(`${BASE_URL}/overlay/master/${user?.obsKey}`, 'master')}
                    className={`flex-1 cursor-pointer p-4 rounded-[var(--nexus-radius)] border transition-all bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)] hover:border-indigo-500 shadow-inner`}
                  >
                    <input readOnly value={`${BASE_URL}/overlay/master/${user?.obsKey}`} className="w-full bg-transparent border-none outline-none text-[10px] font-mono text-indigo-500 truncate pointer-events-none" />
                  </div>
                  <button onClick={() => copyToClipboard(`${BASE_URL}/overlay/master/${user?.obsKey}`, 'master')} className={`p-4 rounded-[var(--nexus-radius)] transition-all shadow-md nexus-btn bg-indigo-500 text-black hover:bg-indigo-400`}>
                    {copiedType === 'master' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BANKING NODE --- */}
        <div className="w-full lg:col-span-4 flex flex-col gap-8">
          <div className={`w-full flex flex-col border rounded-[2.5rem] p-8 shadow-2xl relative transition-all ${getCardStyle()}`}>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3.5 bg-indigo-500/10 rounded-2xl text-indigo-500 border border-indigo-500/20"><Landmark className="w-7 h-7" /></div>
              <div>
                <h3 className={`text-sm font-black uppercase italic tracking-widest text-[var(--nexus-text)]`}>Banking Node</h3>
                <p className="text-[8px] font-black text-[var(--nexus-text-muted)] uppercase tracking-widest">Protocol v2.45</p>
              </div>
            </div>

            <div className="space-y-8 flex-1 z-10 w-full">
              {(user.razorpayFundAccountId || user.razorpayAccountId) && user.payoutSettings?.bankDetailsLinked ? (
                <div className="space-y-6 w-full">
                  <div className={`p-6 rounded-[2rem] border flex items-center gap-5 bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]/20 shadow-inner`}>
                    <ShieldCheckIcon className="w-7 h-7 text-[#10B981]" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase text-[#10B981] tracking-widest">Node Secured</p>
                      <p className="text-xs font-mono font-bold text-[var(--nexus-text-muted)] mt-1 truncate">{user.razorpayFundAccountId || user.razorpayAccountId}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 w-full">
                  <div className={`p-6 rounded-[2rem] border-2 border-dashed bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)]`}>
                    <CreditCard className="w-5 h-5 text-indigo-500 mb-4" />
                    <p className="text-[11px] text-[var(--nexus-text-muted)] font-bold uppercase leading-tight italic">Initialize bank node for Split-Payment protocol.</p>
                  </div>

                  {!user.isPhoneVerified && (
                    <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500 flex items-start gap-3">
                      <ShieldCheckIcon className="w-6 h-6 shrink-0" />
                      <p className="text-[10px] font-black uppercase tracking-widest mt-1">Action Required: Verify Contact Number in Identity Hub to unlock Banking Engine.</p>
                    </div>
                  )}

                  <button
                    onClick={() => { setBankOtpMode(false); setBankLinkType('bank_account'); setShowBankModal(true); setBankForm({ name: '', account_number: '', ifsc: '', vpa: '' }); }}
                    disabled={!user.isPhoneVerified}
                    className={`w-full py-5 rounded-2xl font-black uppercase italic text-[11px] transition-all flex items-center justify-center gap-3 ${user.isPhoneVerified ? 'bg-[var(--nexus-text)] text-[var(--nexus-bg)] hover:bg-[var(--nexus-accent)] hover:text-black' : 'bg-[var(--nexus-text-muted)]/10 text-[var(--nexus-text-muted)] cursor-not-allowed border border-[var(--nexus-border)] shadow-inner'}`}
                  >
                    Onboard Node <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div onClick={() => setActiveSection('growth')} className={`w-full shrink-0 rounded-[2rem] p-6 flex items-center justify-between transition-all cursor-pointer group border bg-[var(--nexus-panel)] border-[var(--nexus-border)] hover:border-indigo-500/30 shadow-[var(--nexus-glow)]`}>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-inner"><Trophy className="w-6 h-6" /></div>
              <p className="text-[11px] font-black uppercase italic text-[var(--nexus-text-muted)] group-hover:text-indigo-500 transition-colors tracking-widest">Upgrade Tier</p>
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-500 group-hover:translate-x-2 transition-transform" />
          </div>
        </div >
      </div >

      {/* INDEPENDENT OTP VERIFICATION MODAL */}
      <AnimatePresence>
        {showVerifyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`w-full max-w-md p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden bg-[var(--nexus-panel)] border-[var(--nexus-border)]`}>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10B981] to-transparent" />

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center border-2 border-[#10B981]/20 shadow-inner">
                  <ShieldAlert className="w-8 h-8 text-[#10B981]" />
                </div>

                <div>
                  <h3 className={`text-2xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)]`}>Node Verification</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#10B981] mt-1">{verifyType === 'email' ? 'Email Endpoint' : 'Mobile Endpoint'}</p>
                </div>

                <p className={`text-sm italic text-[var(--nexus-text-muted)]`}>
                  We've transmitted a 6-digit cryptographic key to your {verifyType === 'email' ? 'email' : 'phone'}. Enter it below to irrevocably secure this node.
                </p>

                <div className="w-full space-y-4 pt-4">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className={`w-full text-center text-3xl tracking-[0.5em] font-black p-4 rounded-2xl outline-none border transition-all bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)] text-[var(--nexus-text)] focus:border-[#10B981] shadow-inner`}
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowVerifyModal(false)}
                      className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-colors border shadow-sm bg-[var(--nexus-accent)]/5 text-[var(--nexus-text-muted)] border-[var(--nexus-border)] hover:bg-[var(--nexus-accent)]/10`}
                    >
                      Abort
                    </button>
                    <button
                      onClick={submitVerification}
                      disabled={isVerifyingOtp || otpInput.length !== 6}
                      className="flex-[2] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-[#10B981] text-black hover:bg-[#0fa672] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/20"
                    >
                      {isVerifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authorize Node'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECURE BANKING MODAL */}
      <AnimatePresence>
        {showBankModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`w-full max-w-md p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden bg-[var(--nexus-panel)] border-[var(--nexus-border)]`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10B981] to-transparent" />

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center border-2 border-indigo-500/20 shadow-inner">
                  <Landmark className="w-8 h-8 text-indigo-500" />
                </div>

                <div>
                  <h3 className={`text-2xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)]`}>Secure Vault</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#10B981] mt-1">{bankOtpMode ? 'OTP Authorization' : 'Link Payout Destination'}</p>
                </div>

                {!bankOtpMode ? (
                  <div className="w-full space-y-4">
                    <p className={`text-sm italic text-[var(--nexus-text-muted)] mb-4`}>Deploy your withdrawal coordinates securely.</p>

                    {/* TYPE TOGGLE */}
                    <div className="flex p-1 rounded-xl bg-[var(--nexus-bg)]/40 border border-[var(--nexus-border)] mb-4 shadow-inner">
                      <button
                        onClick={() => setBankLinkType('bank_account')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${bankLinkType === 'bank_account' ? 'bg-indigo-500 text-white shadow-md' : 'text-[var(--nexus-text-muted)] hover:text-[var(--nexus-text)]'}`}
                      >
                        Bank Account
                      </button>
                      <button
                        onClick={() => setBankLinkType('vpa')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${bankLinkType === 'vpa' ? 'bg-indigo-500 text-white shadow-md' : 'text-[var(--nexus-text-muted)] hover:text-[var(--nexus-text)]'}`}
                      >
                        UPI ID (VPA)
                      </button>
                    </div>

                    <div className="space-y-3 text-left">
                      <div>
                        <label className="text-[9px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest ml-1 mb-1 block">Account Holder Name</label>
                        <input value={bankForm.name} onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })} placeholder="John Doe" className={`w-full rounded-2xl p-4 text-sm font-bold border-2 transition-all ${getInputStyle()}`} />
                      </div>

                      {bankLinkType === 'bank_account' ? (
                        <>
                          <div>
                            <label className="text-[9px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest ml-1 mb-1 block">Account Number</label>
                            <input value={bankForm.account_number} onChange={(e) => setBankForm({ ...bankForm, account_number: e.target.value })} placeholder="000000000000" className={`w-full rounded-2xl p-4 text-sm font-bold font-mono tracking-widest border-2 transition-all ${getInputStyle()}`} />
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest ml-1 mb-1 block">IFSC Code</label>
                            <input value={bankForm.ifsc} onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })} placeholder="HDFC0001234" className={`w-full rounded-2xl p-4 text-sm font-bold font-mono tracking-widest uppercase border-2 transition-all ${getInputStyle()}`} />
                          </div>
                        </>
                      ) : (
                        <div>
                          <label className="text-[9px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest ml-1 mb-1 block">UPI ID (VPA)</label>
                          <input value={bankForm.vpa} onChange={(e) => setBankForm({ ...bankForm, vpa: e.target.value.toLowerCase() })} placeholder="username@bank" className={`w-full rounded-2xl p-4 text-sm font-bold font-mono tracking-widest lowercase border-2 transition-all ${getInputStyle()}`} />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button onClick={() => setShowBankModal(false)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-colors border shadow-sm bg-[var(--nexus-accent)]/5 text-[var(--nexus-text-muted)] border-[var(--nexus-border)] hover:bg-[var(--nexus-accent)]/10`}>Abort</button>
                      <button onClick={initiateBankLink} disabled={isProcessingBank} className="flex-[2] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-indigo-500 text-white hover:bg-indigo-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                        {isProcessingBank ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Key'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <p className={`text-sm italic text-[var(--nexus-text-muted)]`}>We've transmitted a 6-digit cryptographic key to your verified phone.</p>
                    <input type="text" maxLength={6} value={bankOtpInput} onChange={(e) => setBankOtpInput(e.target.value.replace(/\D/g, ''))} placeholder="000000" className={`w-full text-center text-3xl tracking-[0.5em] font-black p-4 rounded-2xl outline-none border transition-all bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)] text-[var(--nexus-text)] focus:border-[#10B981] shadow-inner mt-4`} />

                    <div className="flex gap-3 pt-4">
                      <button onClick={() => setBankOtpMode(false)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-colors border shadow-sm bg-[var(--nexus-accent)]/5 text-[var(--nexus-text-muted)] border-[var(--nexus-border)] hover:bg-[var(--nexus-accent)]/10`}>Back</button>
                      <button onClick={confirmBankLink} disabled={isProcessingBank || bankOtpInput.length !== 6} className="flex-[2] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-[#10B981] text-black hover:bg-[#0fa672] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/20">
                        {isProcessingBank ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authorize Link'}
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
};

export default AccountsHub;
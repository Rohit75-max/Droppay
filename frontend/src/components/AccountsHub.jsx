import React from 'react';
import { motion } from 'framer-motion';
// --- Protocol Engine ---
import { calculateTierStatus } from '../protocol/tierProtocol';

import { 
  User, UploadCloud, Edit3, Save, BadgeCheck, Crown, Zap, ShieldCheck, 
  UserCircle, Hash, Mail as MailIcon, Phone, MessageSquare, Landmark, 
  ShieldCheck as ShieldCheckIcon, CreditCard, Loader2, ChevronRight, Trophy,
  Target, Crosshair, Sparkles, ArrowRight
} from 'lucide-react';

const AccountsHub = ({ 
  theme, user, isEditing, setIsEditing, editForm, setEditForm, 
  profilePreview, handleImageChange, saveProfileUpdates, fileInputRef,
  handleBankLink, isLinkingBank, setActiveSection 
}) => {
  
  const status = calculateTierStatus(user?.tier || 'starter', user?.referralCount || 0);

  const getCardStyle = () => {
    return theme === 'dark' 
      ? 'bg-[#0a0a0a]/80 border-white/5 shadow-xl' 
      : 'bg-white border-slate-200 shadow-md';
  };

  const getInputStyle = () => {
    return theme === 'dark'
      ? 'bg-black/40 border-white/5 text-white focus:border-[#10B981]'
      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#10B981]';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8 font-sans pb-20 w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* --- IDENTITY HUB --- */}
        <div className={`w-full lg:col-span-8 border rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden transition-all ${getCardStyle()}`}>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            
            {/* Avatar Protocol */}
            <div className="relative group/avatar shrink-0">
              <div className={`w-36 h-36 rounded-[2.5rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all group-hover/avatar:border-[#10B981] ${theme === 'dark' ? 'bg-black border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className={`w-14 h-14 ${theme === 'dark' ? 'text-white/20' : 'text-slate-300'}`} />
                )}
                <button onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/70 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
                  <UploadCloud className="w-6 h-6 text-[#10B981] mb-1" />
                  <span className="text-[8px] font-black uppercase text-white">Upload</span>
                </button>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
              
              {status.badge && (
                <div className={`absolute -bottom-2 -right-2 p-2 rounded-2xl border bg-black shadow-2xl flex items-center gap-2 border-white/10 ${status.badge.flair}`}>
                   {status.badge.icon === 'Target' && <Target className="w-3.5 h-3.5 text-cyan-400" />}
                   {status.badge.icon === 'Crosshair' && <Crosshair className="w-3.5 h-3.5 text-indigo-400" />}
                   {status.badge.icon === 'Sparkles' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                   <span className={`text-[8px] font-black uppercase italic tracking-widest ${status.badge.color}`}>
                     {status.badge.name}
                   </span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-6 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className={`text-4xl font-black uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user.username}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Identity Synchronized</p>
                  </div>
                </div>
                <button 
                  onClick={() => isEditing ? saveProfileUpdates() : setIsEditing(true)} 
                  className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${isEditing ? 'bg-[#10B981] text-black border-[#10B981]' : theme === 'dark' ? 'bg-white/5 text-white border-white/10 hover:bg-white hover:text-black' : 'bg-slate-900 text-white border-slate-900 hover:bg-[#10B981] hover:border-[#10B981]'}`}
                >
                  {isEditing ? <><Save className="w-4 h-4" /> Save Node</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-2 bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] rounded-xl text-[9px] font-black uppercase flex items-center gap-2">
                  <BadgeCheck className="w-3 h-3" /> Verified Node
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${user.tier === 'legend' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : user.tier === 'pro' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-500/10 border-white/10 text-slate-400'}`}>
                  {user.tier === 'legend' && <Crown className="w-3.5 h-3.5 fill-amber-500" />}
                  {user.tier === 'pro' && <Zap className="w-3.5 h-3.5 fill-indigo-400" />}
                  {user.tier === 'starter' && <ShieldCheck className="w-3.5 h-3.5" />}
                  <span className="text-[9px] font-black uppercase italic tracking-widest">{status.tierDetails.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Identity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5 relative z-10 w-full">
            <div className="space-y-3 w-full">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1"><UserCircle className="w-3.5 h-3.5" /> Full Name</label>
              {isEditing ? (
                <input value={editForm.username} onChange={(e) => setEditForm({...editForm, username: e.target.value})} className={`w-full rounded-2xl p-5 text-sm font-bold outline-none border-2 transition-all ${getInputStyle()}`} />
              ) : (
                <div className={`w-full rounded-2xl p-5 border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <p className={`text-sm font-black italic ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{user.username}</p>
                </div>
              )}
            </div>

            <div className="space-y-3 w-full">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1"><Hash className="w-3.5 h-3.5" /> Streamer ID</label>
              {isEditing ? (
                <input value={editForm.streamerId} onChange={(e) => setEditForm({...editForm, streamerId: e.target.value})} className={`w-full rounded-2xl p-5 text-sm font-mono font-bold outline-none border-2 transition-all ${getInputStyle()}`} />
              ) : (
                <div className={`w-full rounded-2xl p-5 border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <p className="text-sm font-mono font-bold text-[#10B981]">@{user.streamerId}</p>
                </div>
              )}
            </div>

            <div className="space-y-3 w-full">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1"><MailIcon className="w-3.5 h-3.5" /> Email</label>
              <div className={`w-full rounded-2xl p-5 border opacity-50 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-sm font-bold text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3 w-full">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1"><Phone className="w-3.5 h-3.5" /> Contact Number</label>
              {isEditing ? (
                <input value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className={`w-full rounded-2xl p-5 text-sm font-bold outline-none border-2 transition-all ${getInputStyle()}`} />
              ) : (
                <div className={`w-full rounded-2xl p-5 border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <p className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{user.phone || "No contact linked"}</p>
                </div>
              )}
            </div>

            <div className="space-y-3 w-full md:col-span-2 mt-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1"><MessageSquare className="w-3.5 h-3.5" /> Bio</label>
              {isEditing ? (
                <textarea value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} className={`w-full rounded-2xl p-5 text-sm font-bold outline-none border-2 transition-all resize-none min-h-[100px] ${getInputStyle()}`} />
              ) : (
                <div className={`w-full rounded-2xl p-5 border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <p className={`text-sm font-medium italic ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>"{user.bio || 'Signal established.'}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- BANKING NODE --- */}
        <div className="w-full lg:col-span-4 space-y-6">
          <div className={`w-full border rounded-[2.5rem] p-8 shadow-2xl flex flex-col relative overflow-hidden transition-all ${getCardStyle()}`}>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3.5 bg-indigo-500/10 rounded-2xl text-indigo-500 border border-indigo-500/20"><Landmark className="w-7 h-7" /></div>
              <div>
                <h3 className={`text-sm font-black uppercase italic tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Banking Node</h3>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Protocol v2.45</p>
              </div>
            </div>

            <div className="space-y-8 flex-1 z-10 w-full">
              {user.razorpayAccountId && user.payoutSettings?.bankDetailsLinked ? (
                <div className="space-y-6 w-full">
                  <div className={`p-6 rounded-[2rem] border flex items-center gap-5 ${theme === 'dark' ? 'bg-[#10B981]/5 border-[#10B981]/20' : 'bg-green-50 border-green-100'}`}>
                    <ShieldCheckIcon className="w-7 h-7 text-[#10B981]" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase text-[#10B981] tracking-widest">Node Secured</p>
                      <p className="text-xs font-mono font-bold text-slate-500 mt-1 truncate">{user.razorpayAccountId}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 w-full">
                  <div className={`p-6 rounded-[2rem] border-2 border-dashed ${theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <CreditCard className="w-5 h-5 text-indigo-500 mb-4" />
                    <p className="text-[11px] text-slate-500 font-bold uppercase leading-tight italic">Initialize bank node for Split-Payment protocol.</p>
                  </div>
                  <button onClick={handleBankLink} disabled={isLinkingBank} className={`w-full py-5 rounded-2xl font-black uppercase italic text-[11px] transition-all flex items-center justify-center gap-3 ${theme === 'dark' ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-[#10B981]'}`}>
                    {isLinkingBank ? <Loader2 className="animate-spin w-5 h-5" /> : <>Onboard Node <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div onClick={() => setActiveSection('growth')} className={`w-full rounded-[2rem] p-6 flex items-center justify-between transition-all cursor-pointer group border ${theme === 'dark' ? 'bg-black/40 border-white/5 hover:border-indigo-500/30' : 'bg-slate-50 border-slate-200 hover:border-indigo-500'}`}>
             <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-inner"><Trophy className="w-6 h-6" /></div>
                <p className="text-[11px] font-black uppercase italic text-slate-500 group-hover:text-indigo-500 transition-colors tracking-widest">Upgrade Tier</p>
             </div>
             <ChevronRight className="w-5 h-5 text-indigo-500 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountsHub;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Globe, Target, Save, 
  Trash2, Plus, Copy, Check, Rocket, 
  Monitor, Volume2, Play, Activity, Layout
} from 'lucide-react';

import AlertPreview from './AlertPreview'; 

const ControlCenter = ({ 
  theme, user, goalForm, setGoalForm, updateGoalSettings, // The primary prop handshake
  isUpdatingGoal, alertConfig, setAlertConfig, saveAlertSettings, 
  isSavingAlerts, partnerStickers, addStickerSlot, 
  removeStickerSlot, savePartnerPack, isSavingStickers, isTierEligible,
  copyToClipboard, copiedType 
}) => {

  const [activeTab, setActiveTab] = useState('overlay');
  const [isPreviewActive, setIsPreviewActive] = useState(false);

  // BASE URL for local environment
  const BASE_URL = "http://localhost:3000";

  const getStudioStyle = () => {
    return theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 shadow-xl' : 'bg-white border-slate-200 shadow-md';
  };

  const triggerLocalPreview = () => {
    setIsPreviewActive(true);
    setTimeout(() => setIsPreviewActive(false), 4500); 
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
      
      {/* --- LEFT COLUMN --- */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* NAV TABS */}
        <div className={`flex p-1.5 rounded-2xl border ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
          {['overlay', 'mission', 'stickers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                ? 'bg-[#10B981] text-black shadow-lg' 
                : 'text-slate-500 hover:text-[#10B981]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {activeTab === 'overlay' && (
            <div className={`p-8 md:p-10 rounded-[2.5rem] border transition-all ${getStudioStyle()}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-emerald-50 text-emerald-600'}`}>
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black uppercase italic tracking-widest">Identity Handshake</h3>
              </div>

              <div className="space-y-8">
                {/* 1. ALERT SOURCE */}
                <div className="flex flex-col gap-3 group">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] flex justify-between h-3">
                    Live Alert Source 
                    {copiedType === 'obs' && <span className="text-[#10B981] animate-pulse">✓ COPIED</span>}
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                        onClick={() => copyToClipboard(`${BASE_URL}/overlay/${user?.username}`, 'obs')}
                        className={`flex-1 cursor-pointer p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-black/40 border-white/5 hover:border-[#10B981]' : 'bg-slate-50 border-slate-200 hover:border-[#10B981]'}`}
                    >
                        <input readOnly value={`${BASE_URL}/overlay/${user?.username}`} className="w-full bg-transparent border-none outline-none text-[10px] font-mono text-[#10B981] truncate pointer-events-none" />
                    </div>
                    <button onClick={() => copyToClipboard(`${BASE_URL}/overlay/${user?.username}`, 'obs')} className={`p-4 rounded-2xl transition-all shadow-md ${theme === 'dark' ? 'bg-[#10B981] text-black hover:bg-emerald-400' : 'bg-slate-900 text-white hover:bg-[#10B981]'}`}>
                        {copiedType === 'obs' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 2. GOAL SOURCE */}
                <div className="flex flex-col gap-3 group">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] flex justify-between h-3">
                    Mission Goal Source
                    {copiedType === 'goal' && <span className="text-amber-500 animate-pulse">✓ COPIED</span>}
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                        onClick={() => copyToClipboard(`${BASE_URL}/goal-overlay/${user?.username}`, 'goal')}
                        className={`flex-1 cursor-pointer p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-black/40 border-white/5 hover:border-amber-500' : 'bg-slate-50 border-slate-200 hover:border-amber-500'}`}
                    >
                        <input readOnly value={`${BASE_URL}/goal-overlay/${user?.username}`} className="w-full bg-transparent border-none outline-none text-[10px] font-mono text-amber-500 truncate pointer-events-none" />
                    </div>
                    <button onClick={() => copyToClipboard(`${BASE_URL}/goal-overlay/${user?.username}`, 'goal')} className={`p-4 rounded-2xl transition-all shadow-md ${theme === 'dark' ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-slate-900 text-white hover:bg-amber-500'}`}>
                        {copiedType === 'goal' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 3. DONATION PAGE */}
                <div className="flex flex-col gap-3 group">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] flex justify-between h-3">
                    Public Node (Payment Page)
                    {copiedType === 'pay' && <span className="text-[#10B981] animate-pulse">✓ COPIED</span>}
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                        onClick={() => copyToClipboard(`${BASE_URL}/pay/${user?.username}`, 'pay')}
                        className={`flex-1 cursor-pointer p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-black/40 border-white/5 hover:border-[#10B981]' : 'bg-slate-50 border-slate-200 hover:border-[#10B981]'}`}
                    >
                        <input readOnly value={`${BASE_URL}/pay/${user?.username}`} className="w-full bg-transparent border-none outline-none text-[10px] font-mono text-[#10B981] truncate pointer-events-none" />
                    </div>
                    <button onClick={() => copyToClipboard(`${BASE_URL}/pay/${user?.username}`, 'pay')} className={`p-4 rounded-2xl transition-all shadow-md ${theme === 'dark' ? 'bg-[#10B981] text-black hover:bg-emerald-400' : 'bg-slate-900 text-white hover:bg-[#10B981]'}`}>
                        {copiedType === 'pay' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mission' && (
            <div className={`p-8 md:p-10 rounded-[2.5rem] border transition-all ${getStudioStyle()}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
                  <Target className="w-5 h-5" /> 
                </div>
                <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-400">Mission Calibration</h3>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Title</label>
                    <input value={goalForm.title} onChange={(e) => setGoalForm({...goalForm, title: e.target.value})} className={`w-full p-5 rounded-2xl border outline-none font-black italic transition-all ${theme === 'dark' ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Target (₹)</label>
                    <input type="number" value={goalForm.targetAmount} onChange={(e) => setGoalForm({...goalForm, targetAmount: e.target.value})} className={`w-full p-5 rounded-2xl border outline-none font-black italic transition-all ${theme === 'dark' ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                  </div>
                </div>

                <div className={`flex items-center justify-between p-5 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                        <Layout className="w-4 h-4 text-amber-500" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Goal Bar Visibility</span>
                    </div>
                    <button onClick={() => setGoalForm({...goalForm, showOnDashboard: !goalForm.showOnDashboard})} className={`w-12 h-6 rounded-full relative transition-all ${goalForm.showOnDashboard ? 'bg-amber-500' : 'bg-slate-600'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${goalForm.showOnDashboard ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                {/* CRASH-PROOF BUTTON TRIGGER */}
                <button 
                  onClick={() => {
                    if (typeof updateGoalSettings === 'function') {
                      updateGoalSettings();
                    } else {
                      console.error("Nexus Error: updateGoalSettings prop is missing from Dashboard.jsx");
                      alert("Prop Handshake Failed: Please ensure updateGoalSettings is passed from Dashboard.");
                    }
                  }} 
                  disabled={isUpdatingGoal} 
                  className="w-full py-5 bg-amber-500 text-black rounded-2xl font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg hover:bg-amber-400"
                >
                  {isUpdatingGoal ? <Activity className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} Deploy Mission
                </button>
              </div>
            </div>
          )}

          {activeTab === 'stickers' && (
            <div className={`p-8 md:p-10 rounded-[2.5rem] border transition-all ${getStudioStyle()}`}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Rocket className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-400">Partner Pack</h3>
                </div>
              </div>
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${!isTierEligible ? 'opacity-20 grayscale pointer-events-none' : ''}`}>
                {partnerStickers?.map((sticker, idx) => (
                  <div key={idx} className={`relative p-6 rounded-[2rem] border flex flex-col items-center gap-4 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-4xl">{sticker.emoji || '💎'}</span>
                    <button onClick={() => removeStickerSlot(idx)} className="absolute -top-2 -right-2 p-2 bg-rose-500 text-white rounded-full"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                <button onClick={addStickerSlot} className={`p-6 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-3 ${theme === 'dark' ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                  <Plus className="w-8 h-8" /><span className="text-[9px] font-black uppercase tracking-widest">Add Signal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- RIGHT COLUMN --- */}
      <div className="lg:col-span-5 space-y-6">
        <div className={`p-8 rounded-[2.5rem] border sticky top-12 transition-all ${getStudioStyle()}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-[#10B981]" />
              <h3 className="text-xs font-black uppercase italic tracking-widest text-slate-400">Alert Studio</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-lg italic">
              <Activity className="w-3 h-3 animate-pulse" /> LIVE CALIBRATION
            </div>
          </div>

          <div className={`aspect-video rounded-[2rem] relative overflow-hidden border mb-8 flex items-center justify-center ${theme === 'dark' ? 'bg-[#050505] border-white/5 shadow-inner' : 'bg-slate-100 border-slate-200'}`}>
            <AnimatePresence>
              {isPreviewActive ? (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 0.65, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="w-full h-full flex items-center justify-center origin-center">
                  <AlertPreview donorName="DropPay Tester" amount={500} message="Studio Handshake Active!" sticker="zap" variant="zap" theme={theme} />
                </motion.div>
              ) : (
                <div className="text-center opacity-20"><Zap className="w-10 h-10 mx-auto mb-2" /><p className="text-[9px] font-black uppercase tracking-[0.2em]">Studio Idle</p></div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Volume2 className="w-3.5 h-3.5" /> Signal Volume</span><span className="text-[10px] font-black text-[#10B981]">80%</span></div>
              <input type="range" className="w-full accent-[#10B981] cursor-pointer opacity-80" />
            </div>
            <button onClick={triggerLocalPreview} className={`w-full py-4 rounded-xl border-2 border-dashed font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${theme === 'dark' ? 'border-white/10 text-slate-400 hover:border-[#10B981]' : 'border-slate-200 text-slate-500 hover:border-[#10B981]'}`}>
              <Play className="w-3.5 h-3.5 fill-current" /> Emulate Signal
            </button>
          </div>
        </div>
        <div className={`p-7 rounded-[2rem] border flex items-start gap-4 transition-all ${theme === 'dark' ? 'bg-[#10B981]/5 border-[#10B981]/10' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
          <Activity className="w-5 h-5 text-[#10B981] shrink-0" />
          <p className="text-[10px] leading-relaxed text-slate-500 font-bold uppercase tracking-wider italic">Identity Nodes are hardcoded to your unique production username.</p>
        </div>
      </div>
    </div>
  );
};

export default ControlCenter;
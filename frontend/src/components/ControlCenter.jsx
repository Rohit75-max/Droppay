import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Globe, Target, Save,
  Trash2, Plus, Copy, Check, Rocket,
  Monitor, Volume2, Activity, Layout, Palette, Sparkles, Crown, Gamepad2, Heart,
  Flame, Leaf, Skull, Battery, Coins, Trophy, Star
} from 'lucide-react';

import AlertPreview from './AlertPreview';
import CyberGoalBar from './CyberGoalBar';
import PremiumGoalOverlays from './PremiumGoalOverlays';

const PREMIUM_GOAL_STYLES = [
  'black_hole', 'hex_core', 'rune_monolith', 'hologram_glitch',
  'alchemist_flask', 'redline_dash', 'loot_dispenser', 'mecha_lens'
];

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

  // --- NEW STYLE SWITCHER LOGIC ---
  const currentStyle = alertConfig?.stylePreference || 'modern';
  const handleStyleSwitch = (newStyle) => {
    if (currentStyle === newStyle) return;
    const updatedConfig = { ...alertConfig, stylePreference: newStyle };
    setAlertConfig(updatedConfig); // Instant UI update
    saveAlertSettings(updatedConfig); // Push to your database
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-10 pb-12 pt-4 relative z-10">

      {/* --- TOP NAV TABS (CENTERED) --- */}
      <div className="flex justify-center relative z-20">
        <div className={`inline-flex p-1.5 rounded-3xl border shadow-sm backdrop-blur-md ${theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-white/80 border-slate-200'}`}>
          {['overlay', 'mission', 'stickers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                ? 'bg-[#10B981] text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : (theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                }`}
            >
              <div className="flex items-center gap-2">
                {tab === 'overlay' && <Layout className="w-4 h-4" />}
                {tab === 'mission' && <Target className="w-4 h-4" />}
                {tab === 'stickers' && <Rocket className="w-4 h-4" />}
                {tab}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* --- TAB CONTENT AREA --- */}
      <div className="w-full relative z-10">
        <AnimatePresence mode="wait">

          {/* 1. OVERLAY TAB (THE UNIFIED MASTER BOX) */}
          {activeTab === 'overlay' && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }}
              className={`p-8 md:p-10 rounded-[3rem] border transition-all ${getStudioStyle()}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                {/* LEFT COLUMN: AESTHETICS & TTS */}
                <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
                  {/* ALERT AESTHETICS CARD */}
                  <div className={`p-6 md:p-10 lg:p-12 rounded-[2.5rem] border transition-all ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-emerald-50 text-emerald-600'}`}>
                          <Palette className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-widest">Alert Aesthetics</h3>
                      </div>
                      {isSavingAlerts && <Activity className="w-5 h-5 animate-spin text-[#10B981]" />}
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 italic leading-relaxed mb-6">Choose your live visual template. This instantly updates your OBS software and Donation page.</p>

                    <div className={`grid grid-cols-2 lg:grid-cols-3 gap-4 border-t border-b py-6 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                      <button onClick={() => handleStyleSwitch('modern')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden ${currentStyle === 'modern' ? 'border-[#10B981] bg-[#10B981]/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : (theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300')}`}>
                        <Sparkles className={`w-8 h-8 ${currentStyle === 'modern' ? 'text-[#10B981]' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${currentStyle === 'modern' ? 'text-[#10B981]' : 'text-slate-400'}`}>Modern</span>
                        {currentStyle === 'modern' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#10B981]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('comic')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden ${currentStyle === 'comic' ? 'border-black bg-[#FFDE00] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : (theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300')}`}>
                        <Zap className={`w-8 h-8 ${currentStyle === 'comic' ? 'text-black fill-black' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${currentStyle === 'comic' ? 'text-black' : 'text-slate-400'}`}>Comic</span>
                        {currentStyle === 'comic' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-black" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('playful')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden ${currentStyle === 'playful' ? 'border-[#FF5F6D] bg-[#FF5F6D]/10 shadow-[0_0_15px_rgba(255,95,109,0.15)]' : (theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300')}`}>
                        <Crown className={`w-8 h-8 ${currentStyle === 'playful' ? 'text-[#FF5F6D] fill-[#FF5F6D]' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${currentStyle === 'playful' ? 'text-[#FF5F6D]' : 'text-slate-400'}`}>Playful</span>
                        {currentStyle === 'playful' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#FF5F6D]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('pixel')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden ${currentStyle === 'pixel' ? 'border-[#4CAF50] bg-[#4CAF50]/10 shadow-[0_0_15px_rgba(76,175,80,0.15)]' : (theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300')}`}>
                        <Gamepad2 className={`w-8 h-8 ${currentStyle === 'pixel' ? 'text-[#4CAF50]' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${currentStyle === 'pixel' ? 'text-[#4CAF50]' : 'text-slate-400'}`}>Pixel</span>
                        {currentStyle === 'pixel' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#4CAF50]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('kawaii')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden ${currentStyle === 'kawaii' ? 'border-[#C26D7D] bg-[#C26D7D]/10 shadow-[0_0_15px_rgba(194,109,125,0.15)]' : (theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300')}`}>
                        <Heart className={`w-8 h-8 ${currentStyle === 'kawaii' ? 'text-[#C26D7D] fill-[#C26D7D]' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${currentStyle === 'kawaii' ? 'text-[#C26D7D]' : 'text-slate-400'}`}>Kawaii</span>
                        {currentStyle === 'kawaii' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#C26D7D]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('cyberhud')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden ${currentStyle === 'cyberhud' ? 'border-[#39ff14] bg-[#39ff14]/10 shadow-[0_0_20px_rgba(57,255,20,0.25)]' : (theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300')}`}>
                        <Activity className={`w-8 h-8 ${currentStyle === 'cyberhud' ? 'text-[#39ff14] animate-pulse' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-mono uppercase tracking-widest ${currentStyle === 'cyberhud' ? 'text-[#39ff14]' : 'text-slate-400'}`}>Cyber HUD</span>
                        {currentStyle === 'cyberhud' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#39ff14]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('bgmi')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden ${currentStyle === 'bgmi' ? 'border-[#F97316] bg-[#F97316]/10 shadow-[0_0_20px_rgba(249,115,22,0.25)]' : (theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300')}`}>
                        <Target className={`w-8 h-8 ${currentStyle === 'bgmi' ? 'text-[#F97316] animate-pulse' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-mono uppercase tracking-widest ${currentStyle === 'bgmi' ? 'text-[#F97316]' : 'text-slate-400'}`}>Airdrop</span>
                        {currentStyle === 'bgmi' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#F97316]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('gta')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden ${currentStyle === 'gta' ? 'border-[#FFD700] bg-black/80 shadow-[0_0_20px_rgba(255,215,0,0.25)]' : (theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300')}`}>
                        <Star className={`w-8 h-8 ${currentStyle === 'gta' ? 'text-[#FFD700] fill-[#FFD700]' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${currentStyle === 'gta' ? 'text-[#FFD700]' : 'text-slate-400'}`}>Respect +</span>
                        {currentStyle === 'gta' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#FFD700]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('coc')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden ${currentStyle === 'coc' ? 'border-[#FBBF24] bg-[#451A03] shadow-[0_0_20px_rgba(251,191,36,0.25)]' : (theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300')}`}>
                        <Trophy className={`w-8 h-8 ${currentStyle === 'coc' ? 'text-[#FBBF24] fill-[#FBBF24]' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-wider ${currentStyle === 'coc' ? 'text-[#FBBF24]' : 'text-slate-400'}`}>Raid</span>
                        {currentStyle === 'coc' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#FBBF24]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('avatar')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-[3rem] border-2 transition-all overflow-hidden ${currentStyle === 'avatar' ? 'border-[#06B6D4] bg-[#040D14] shadow-[0_0_20px_rgba(6,182,212,0.25)]' : (theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300')}`}>
                        <Leaf className={`w-8 h-8 ${currentStyle === 'avatar' ? 'text-[#22D3EE] animate-pulse' : 'text-slate-400'}`} />
                        <span className={`text-[10px] uppercase font-light tracking-[0.3em] ${currentStyle === 'avatar' ? 'text-[#22D3EE]' : 'text-slate-400'}`}>Pandora</span>
                        {currentStyle === 'avatar' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#22D3EE]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('godzilla')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-none border-2 transition-all overflow-hidden ${currentStyle === 'godzilla' ? 'border-x-0 border-y-[4px] border-[#0EA5E9] bg-black shadow-[0_0_30px_rgba(14,165,233,0.3)]' : (theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300')}`}>
                        <Activity className={`w-8 h-8 ${currentStyle === 'godzilla' ? 'text-[#38BDF8] animate-pulse' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-black uppercase italic tracking-tighter ${currentStyle === 'godzilla' ? 'text-[#38BDF8]' : 'text-slate-400'}`}>Titan</span>
                        {currentStyle === 'godzilla' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#38BDF8]" /></div>}
                      </button>
                    </div>
                  </div>

                  {/* NEW: TTS SETTING CARD */}
                  <div className={`p-6 md:p-10 lg:p-12 rounded-[2rem] border transition-all space-y-8 ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-black uppercase italic tracking-widest">TTS Settings</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">Signal Volume</span>
                        <span className="text-[10px] font-black text-[#10B981]">{alertConfig?.volume || 50}%</span>
                      </div>
                      <input type="range"
                        min="0" max="100"
                        value={alertConfig?.volume || 50}
                        onChange={(e) => setAlertConfig({ ...alertConfig, volume: parseInt(e.target.value) })}
                        onMouseUp={() => saveAlertSettings({ ...alertConfig, volume: parseInt(alertConfig.volume || 50) })}
                        onTouchEnd={() => saveAlertSettings({ ...alertConfig, volume: parseInt(alertConfig.volume || 50) })}
                        className="w-full h-2 rounded-full appearance-none bg-slate-200 outline-none
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#10B981] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                        dark:bg-slate-800"
                      />
                    </div>

                    <div
                      className={`p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all flex justify-between items-center ${alertConfig?.ttsEnabled ? 'border-[#10B981] bg-[#10B981]/10 shadow-[0_0_20px_rgba(16,185,129,0.10)]' : (theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300')}`}
                      onClick={() => {
                        const newState = !alertConfig?.ttsEnabled;
                        setAlertConfig({ ...alertConfig, ttsEnabled: newState });
                        saveAlertSettings({ ...alertConfig, ttsEnabled: newState });
                      }}
                    >
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${alertConfig?.ttsEnabled ? 'text-[#10B981]' : 'text-slate-500'}`}>Text-To-Speech {alertConfig?.ttsEnabled && <Activity className="w-3 h-3 animate-pulse" />}</span>
                        <span className="text-[9px] font-bold text-slate-500 italic leading-relaxed">Incoming donor messages read aloud.</span>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative transition-all ${alertConfig?.ttsEnabled ? 'bg-[#10B981]' : 'bg-slate-600'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${alertConfig?.ttsEnabled ? 'left-7' : 'left-1'}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: ALERT STUDIO */}
                <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                  <div className={`p-6 md:p-10 lg:p-12 rounded-[2rem] border transition-all flex flex-col h-full justify-between shadow-2xl ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200'}`}>
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <Monitor className="w-5 h-5 text-[#10B981]" />
                          <h3 className="text-sm font-black uppercase italic tracking-widest text-[#10B981]">Alert Studio</h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-lg italic border border-[#10B981]/20">
                          <Activity className="w-3 h-3 animate-pulse" /> LIVE CALIBRATION
                        </div>
                      </div>

                      <div className={`w-full rounded-3xl relative overflow-hidden border mb-8 flex items-center justify-center min-h-[300px] sm:min-h-[400px] ${theme === 'dark' ? 'bg-[#050505] border-white/5 shadow-inner' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
                        <AnimatePresence>
                          {isPreviewActive ? (
                            <motion.div
                              key="alert-preview-active"
                              initial={{ scale: 0.4, opacity: 0 }}
                              animate={{ scale: 0.8, opacity: 1 }}
                              exit={{ scale: 0.4, opacity: 0 }}
                              className="w-full h-full flex items-center justify-center origin-center transform scale-75 sm:scale-90 md:scale-100 lg:scale-110 transition-transform duration-500"
                            >
                              <AlertPreview
                                donorName="DropPay Tester"
                                amount={500}
                                message="Studio Handshake Active!"
                                sticker="zap"
                                variant="zap"
                                theme={theme}
                                tier={user?.tier || 'starter'}
                                stylePreference={currentStyle}
                              />
                            </motion.div>
                          ) : (
                            <div key="alert-preview-idle" className="text-center opacity-20"><Zap className="w-10 h-10 mx-auto mb-2" /><p className="text-[9px] font-black uppercase tracking-[0.2em]">Studio Idle</p></div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button onClick={triggerLocalPreview} className={`w-full py-4 rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'border-white/10 text-slate-400 hover:text-white hover:border-[#10B981] hover:bg-[#10B981]/10' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:border-[#10B981] hover:bg-[#10B981]/5'}`}>
                        <Monitor className="w-3.5 h-3.5" /> Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. MISSION TAB */}
          {activeTab === 'mission' && (
            <motion.div key="mission" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} className="w-full">
              <div className={`p-8 md:p-10 rounded-[3rem] border transition-all ${getStudioStyle()}`}>

                {/* NEW TOP ROW: Calibration (Left) + Theme Bar (Right) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-12">

                  {/* LEFT: MISSION CALIBRATION */}
                  <div className={`xl:col-span-5 p-6 md:p-10 lg:p-12 rounded-[2rem] border transition-all ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
                        <Target className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-black uppercase italic tracking-widest text-[#d97706] dark:text-amber-500">Mission Calibration</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Title</label>
                        <input value={goalForm.title} onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })} className={`w-full p-4 rounded-2xl border-2 outline-none font-black italic transition-all ${theme === 'dark' ? 'bg-black/40 border-white/5 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500'}`} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Target (₹)</label>
                        <input type="number" value={goalForm.targetAmount} onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })} className={`w-full p-4 rounded-2xl border-2 outline-none font-black italic transition-all ${theme === 'dark' ? 'bg-black/40 border-white/5 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500'}`} />
                      </div>

                      <div className={`flex items-center justify-between p-5 rounded-2xl border-2 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-amber-500" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Dashboard Visibility</span>
                        </div>
                        <button onClick={() => setGoalForm({ ...goalForm, showOnDashboard: !goalForm.showOnDashboard })} className={`w-12 h-6 rounded-full relative transition-all shadow-inner ${goalForm.showOnDashboard ? 'bg-amber-500' : 'bg-slate-600'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${goalForm.showOnDashboard ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>

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
                        className="w-full py-4 bg-amber-500 text-black rounded-2xl font-black uppercase italic tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 shadow-lg hover:bg-amber-400 hover:scale-[1.02]"
                      >
                        {isUpdatingGoal ? <Activity className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} Deploy Engine
                      </button>
                    </div>
                  </div>

                  {/* RIGHT: GOAL THEME BAR (Horizontal Scroll) */}
                  <div className={`xl:col-span-7 p-6 md:p-10 lg:p-12 rounded-[2rem] border transition-all flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Palette className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-black uppercase italic tracking-widest text-indigo-600 dark:text-indigo-400">Goal Bar Theme</h3>
                    </div>

                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide flex-1 items-center">
                      {[
                        { id: 'modern', label: 'Cyber Pill', icon: <Zap className="w-5 h-5" /> },
                        { id: 'glass_jar', label: 'Glass Jar', icon: <Activity className="w-5 h-5" /> },
                        { id: 'arc_reactor_horizontal', label: 'Arc (H)', icon: <Activity className="w-5 h-5" /> },
                        { id: 'arc_reactor_circular', label: 'Arc (C)', icon: <Activity className="w-5 h-5" /> },
                        { id: 'pixel_coin_vault', label: 'Pixel Vault', icon: <Coins className="w-5 h-5" /> },
                        { id: 'boss_fight', label: 'Raid Boss', icon: <Skull className="w-5 h-5" /> },
                        { id: 'plasma_battery', label: 'Plasma Tube', icon: <Battery className="w-5 h-5" /> },
                        { id: 'gta', label: 'Heist', icon: <Star className="w-5 h-5" /> },
                        { id: 'bgmi', label: 'Airdrop', icon: <Target className="w-5 h-5" /> },
                        { id: 'coc', label: 'Village Raid', icon: <Trophy className="w-5 h-5" /> },
                        { id: 'avatar', label: 'Pandora', icon: <Leaf className="w-5 h-5" /> },
                        { id: 'godzilla', label: 'Atomic Titan', icon: <Flame className="w-5 h-5" /> },
                        // Append Unlocked Premium Styles
                        ...(user?.goalSettings?.unlockedPremiumStyles || []).map(id => ({
                          id,
                          label: id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                          icon: <Sparkles className="w-5 h-5 text-amber-500" />
                        }))
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => {
                            const updatedGoalForm = { ...goalForm, stylePreference: style.id };
                            setGoalForm(updatedGoalForm);
                            if (typeof updateGoalSettings === 'function') {
                              updateGoalSettings(updatedGoalForm);
                            }
                          }}
                          className={`shrink-0 snap-start flex flex-col items-center justify-center min-w-[120px] aspect-square rounded-[2rem] border-[3px] transition-all gap-3 group ${goalForm.stylePreference === style.id
                            ? 'border-amber-500 bg-amber-500/10 scale-[1.05] shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                            : (theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/20' : 'border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-slate-100')
                            }`}
                        >
                          <div className={`p-3 rounded-2xl transition-colors ${goalForm.stylePreference === style.id ? 'bg-amber-500 text-black' : 'bg-slate-500/10 text-slate-500 group-hover:text-amber-500'}`}>
                            {style.icon}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-tighter ${goalForm.stylePreference === style.id ? 'text-amber-500' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                            {style.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BOTTOM ROW: GOAL BAR STUDIO PREVIEW (Full Width) */}
                <div className="w-full">
                  <div className={`p-6 md:p-10 lg:p-12 rounded-[2rem] mx-auto border transition-all flex flex-col shadow-2xl ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200'}`}>

                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-amber-500" />
                        <h3 className="text-sm font-black uppercase italic tracking-widest text-amber-500">Goal Bar Studio Previews</h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg italic border border-amber-500/20">
                        <Activity className="w-3 h-3 animate-pulse" /> LIVE SYNC
                      </div>
                    </div>

                    <div className={`w-full rounded-[2rem] relative overflow-hidden border mb-8 flex items-center justify-center min-h-[400px] sm:min-h-[450px] ${theme === 'dark' ? 'bg-[#050505] border-white/5 shadow-inner' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={goalForm.stylePreference}
                          initial={{ scale: 0.7, opacity: 0, y: 20 }}
                          animate={{ scale: 0.9, opacity: 1, y: 0 }}
                          exit={{ scale: 0.7, opacity: 0, y: -20 }}
                          className="w-full flex items-center justify-center origin-center transition-transform hover:scale-[0.95] duration-500"
                        >
                          {PREMIUM_GOAL_STYLES.includes(goalForm.stylePreference) ? (
                            <PremiumGoalOverlays
                              goal={{
                                title: goalForm.title || 'Support the Stream',
                                targetAmount: Number(goalForm.targetAmount) || 1000,
                                currentProgress: (Number(goalForm.targetAmount) || 1000) * 0.65,
                                stylePreference: goalForm.stylePreference
                              }}
                              percentage={65}
                              isComplete={false}
                            />
                          ) : (
                            <CyberGoalBar
                              goal={{
                                title: goalForm.title || 'Support the Stream',
                                targetAmount: Number(goalForm.targetAmount) || 1000,
                                currentProgress: (Number(goalForm.targetAmount) || 1000) * 0.65
                              }}
                              tier={user?.tier || 'starter'}
                              percentage={65}
                              isComplete={false}
                              goalStylePreference={goalForm.stylePreference || 'modern'}
                            />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="flex gap-4">
                      {/* Live Preview / Copy Link */}
                      <button onClick={() => copyToClipboard(`${BASE_URL}/goal/${user?.username}`, 'goal')} className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${theme === 'dark' ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20' : 'bg-slate-900 text-white hover:bg-amber-500'} hover:scale-[1.02]`}>
                        <Copy className="w-5 h-5 fill-current" /> GoalOverlay Source URL
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* 3. STICKERS TAB */}
          {activeTab === 'stickers' && (
            <motion.div key="stickers" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} className="w-full max-w-4xl mx-auto">
              <div className={`p-8 md:p-12 rounded-[3rem] border transition-all shadow-xl ${getStudioStyle()}`}>
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                      <Rocket className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-black uppercase italic tracking-widest text-indigo-500">Partner Pack</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customize your stream's signature stickers.</p>
                    </div>
                  </div>
                </div>
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${!isTierEligible ? 'opacity-20 grayscale pointer-events-none' : ''}`}>
                  {partnerStickers?.map((sticker, idx) => (
                    <div key={idx} className={`relative p-8 rounded-[2rem] border-2 flex flex-col items-center gap-4 ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 hover:border-indigo-500/50' : 'bg-white border-slate-100 shadow-sm hover:border-indigo-500/50 hover:shadow-md'} transition-all`}>
                      <span className="text-5xl drop-shadow-xl">{sticker.emoji || '💎'}</span>
                      <button onClick={() => removeStickerSlot(idx)} className="absolute -top-3 -right-3 p-2.5 bg-rose-500 text-white rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={addStickerSlot} className={`p-8 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all ${theme === 'dark' ? 'border-white/10 text-slate-500 hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/5' : 'border-slate-300 text-slate-400 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-500/5'}`}>
                    <Plus className="w-10 h-10" /><span className="text-[10px] font-black uppercase tracking-widest">Add Signal</span>
                  </button>
                </div>
                <div className="mt-10">
                  <button onClick={savePartnerPack} disabled={isSavingStickers} className={`w-full py-5 rounded-3xl font-black uppercase italic tracking-widest text-[11px] shadow-lg flex items-center justify-center gap-3 transition-all ${theme === 'dark' ? 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-indigo-500/20' : 'bg-slate-900 text-white hover:bg-indigo-500'} hover:scale-[1.01]`}>
                    {isSavingStickers ? <Activity className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Partner Pack
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default ControlCenter;
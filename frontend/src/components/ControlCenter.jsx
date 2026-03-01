import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Globe, Target, Save,
  Trash2, Plus, Copy, Check, Rocket,
  Monitor, Volume2, Activity, Layout, Palette, Sparkles, Crown, Gamepad2, Heart,
  Flame, Leaf, Skull, Battery, Coins, Trophy, Star, Music, Cloud, Gem
} from 'lucide-react';

import AlertPreview from './AlertPreview';
import CyberGoalBar from './CyberGoalBar';
import PremiumGoalOverlays from './PremiumGoalOverlays';
import TugOfWarControl from './widgets/TugOfWarControl';

const PREMIUM_GOAL_STYLES = [
  'black_hole', 'hex_core', 'rune_monolith', 'hologram_glitch',
  'alchemist_flask', 'redline_dash', 'loot_dispenser', 'mecha_lens'
];

const ControlCenter = ({
  theme, user, goalForm, setGoalForm, updateGoalSettings,
  isUpdatingGoal, alertConfig, setAlertConfig, saveAlertSettings,
  nexusTheme, saveNexusTheme,
  isSavingAlerts, partnerStickers, addStickerSlot,
  removeStickerSlot, savePartnerPack, isSavingStickers, isTierEligible,
  copyToClipboard, copiedType, triggerTestSignal, setActiveSection
}) => {

  const [activeTab, setActiveTab] = useState('overlay');
  const [hoveredTheme, setHoveredTheme] = useState(null);

  // BASE URL for local environment
  const BASE_URL = "http://localhost:3000";

  const getStudioStyle = () => {
    return 'bg-[var(--nexus-panel)] border-[var(--nexus-border)] text-[var(--nexus-text)] shadow-[var(--nexus-glow)] theme-card';
  };

  // --- NEW STYLE SWITCHER LOGIC ---
  const currentStyle = alertConfig?.stylePreference || 'modern';
  const handleStyleSwitch = (newStyle, key = 'stylePreference') => {
    if (alertConfig?.[key] === newStyle) return;
    const updatedConfig = { ...alertConfig, [key]: newStyle };
    setAlertConfig(updatedConfig); // Instant UI update
    saveAlertSettings(updatedConfig); // Push to your database
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 pb-20 pt-4 relative z-10">

      {/* --- TOP NAV TABS — Overlapping Card Stack, Centered Desktop / Scrollable Mobile --- */}
      <div
        className="w-full overflow-x-auto relative z-20 flex justify-center"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex items-center min-w-max py-4 gap-1">
          {['overlay', 'mission', 'nexus', 'stickers', 'widgets'].map((tab, idx) => {
            const isActive = activeTab === tab;
            return (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative flex items-center gap-2 px-5 md:px-7 py-3 rounded-2xl
                  text-[10px] font-black uppercase tracking-widest transition-all duration-300
                  ${isActive ? 'text-[var(--nexus-bg)]' : 'text-[var(--nexus-text-muted)] hover:text-[var(--nexus-text)]'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSubTab"
                    className="absolute inset-0 bg-[var(--nexus-accent)] rounded-2xl shadow-[var(--nexus-glow)] z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-2">
                  {tab === 'overlay' && <Layout className="w-4 h-4 shrink-0" />}
                  {tab === 'mission' && <Target className="w-4 h-4 shrink-0" />}
                  {tab === 'nexus' && <Sparkles className="w-4 h-4 shrink-0" />}
                  {tab === 'stickers' && <Rocket className="w-4 h-4 shrink-0" />}
                  {tab === 'widgets' && <Trophy className="w-4 h-4 shrink-0" />}
                  <span className="hidden sm:inline whitespace-nowrap">
                    {tab === 'nexus' ? 'NEXUS' : tab}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* --- TAB CONTENT AREA --- */}
      <div className="w-full relative z-10">
        <AnimatePresence mode="wait">

          {/* 1. OVERLAY TAB (THE UNIFIED MASTER BOX) */}
          {activeTab === 'overlay' && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                {/* LEFT COLUMN: AESTHETICS & TTS */}
                <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
                  {/* ALERT AESTHETICS CARD */}
                  <div className={`p-6 md:p-10 lg:p-12 rounded-[2.5rem] border transition-all ${getStudioStyle()}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)]`}>
                          <Palette className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-widest">Alert Aesthetics</h3>
                      </div>
                      {isSavingAlerts && <Activity className="w-5 h-5 animate-spin text-[var(--nexus-accent)]" />}
                    </div>
                    <p className="text-[11px] font-bold text-[var(--nexus-text-muted)] italic leading-relaxed mb-6">Choose your live visual template. This instantly updates your OBS software and Donation page.</p>

                    <div className={`grid grid-cols-2 lg:grid-cols-3 gap-4 border-t border-b py-6 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                      <button onClick={() => handleStyleSwitch('modern')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden border-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 hover:bg-[var(--nexus-accent)]/20 ${currentStyle === 'modern' ? 'shadow-[var(--nexus-glow)] scale-[1.05]' : ''}`}>
                        <Sparkles className={`w-8 h-8 text-[var(--nexus-accent)]`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest text-[var(--nexus-accent)]`}>Modern</span>
                        {currentStyle === 'modern' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[var(--nexus-accent)]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('comic')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden border-black bg-[#FFDE00] hover:bg-[#ffe533] ${currentStyle === 'comic' ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-[1.05]' : ''}`}>
                        <Zap className={`w-8 h-8 text-black fill-black`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest text-black`}>Comic</span>
                        {currentStyle === 'comic' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-black" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('playful')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden border-[#FF5F6D] bg-[#FF5F6D]/10 hover:bg-[#FF5F6D]/20 ${currentStyle === 'playful' ? 'shadow-[0_0_15px_rgba(255,95,109,0.3)] scale-[1.05]' : ''}`}>
                        <Crown className={`w-8 h-8 text-[#FF5F6D] fill-[#FF5F6D]`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest text-[#FF5F6D]`}>Playful</span>
                        {currentStyle === 'playful' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#FF5F6D]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('pixel')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden border-[#4CAF50] bg-[#4CAF50]/10 hover:bg-[#4CAF50]/20 ${currentStyle === 'pixel' ? 'shadow-[0_0_15px_rgba(76,175,80,0.3)] scale-[1.05]' : ''}`}>
                        <Gamepad2 className={`w-8 h-8 text-[#4CAF50]`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest text-[#4CAF50]`}>Pixel</span>
                        {currentStyle === 'pixel' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#4CAF50]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('kawaii')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden border-[#C26D7D] bg-[#C26D7D]/10 hover:bg-[#C26D7D]/20 ${currentStyle === 'kawaii' ? 'shadow-[0_0_15px_rgba(194,109,125,0.3)] scale-[1.05]' : ''}`}>
                        <Heart className={`w-8 h-8 text-[#C26D7D] fill-[#C26D7D]`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest text-[#C26D7D]`}>Kawaii</span>
                        {currentStyle === 'kawaii' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#C26D7D]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('cyberhud')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden border-[#39ff14] bg-[#39ff14]/10 hover:bg-[#39ff14]/20 ${currentStyle === 'cyberhud' ? 'shadow-[0_0_20px_rgba(57,255,20,0.4)] scale-[1.05]' : ''}`}>
                        <Activity className={`w-8 h-8 text-[#39ff14] animate-pulse`} />
                        <span className={`text-[10px] font-mono uppercase tracking-widest text-[#39ff14]`}>Cyber HUD</span>
                        {currentStyle === 'cyberhud' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#39ff14]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('bgmi')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden border-[#F97316] bg-[#F97316]/10 hover:bg-[#F97316]/20 ${currentStyle === 'bgmi' ? 'shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-[1.05]' : ''}`}>
                        <Target className={`w-8 h-8 text-[#F97316] animate-pulse`} />
                        <span className={`text-[10px] font-mono uppercase tracking-widest text-[#F97316]`}>Airdrop</span>
                        {currentStyle === 'bgmi' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#F97316]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('gta')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden border-[#FFD700] bg-black hover:bg-black/90 ${currentStyle === 'gta' ? 'shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-[1.05]' : ''}`}>
                        <Star className={`w-8 h-8 text-[#FFD700] fill-[#FFD700]`} />
                        <span className={`text-[10px] font-black uppercase tracking-tighter text-[#FFD700]`}>Respect +</span>
                        {currentStyle === 'gta' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#FFD700]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('coc')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden border-[#FBBF24] bg-[#451A03] hover:bg-[#572205] ${currentStyle === 'coc' ? 'shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-[1.05]' : ''}`}>
                        <Trophy className={`w-8 h-8 text-[#FBBF24] fill-[#FBBF24]`} />
                        <span className={`text-[10px] font-black uppercase tracking-wider text-[#FBBF24]`}>Raid</span>
                        {currentStyle === 'coc' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#FBBF24]" /></div>}
                      </button>
                      <button onClick={() => handleStyleSwitch('avatar')} className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-[3rem] border-2 transition-all overflow-hidden border-[#06B6D4] bg-[#040D14] hover:bg-[#061826] ${currentStyle === 'avatar' ? 'shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.05]' : ''}`}>
                        <Leaf className={`w-8 h-8 text-[#22D3EE] animate-pulse`} />
                        <span className={`text-[10px] uppercase font-light tracking-[0.3em] text-[#22D3EE]`}>Pandora</span>
                        {currentStyle === 'avatar' && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[#22D3EE]" /></div>}
                      </button>
                      {/* Append Unlocked Premium Alerts */}
                      {(user?.overlaySettings?.unlockedPremiumAlerts || []).map(styleId => (
                        <button
                          key={styleId}
                          onClick={() => handleStyleSwitch(styleId)}
                          className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all overflow-hidden ${currentStyle === styleId ? 'border-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 shadow-[var(--nexus-glow)]' : 'border-[var(--nexus-border)] bg-[var(--nexus-panel)] hover:border-[var(--nexus-accent)]/40'}`}
                        >
                          <Sparkles className={`w-8 h-8 ${currentStyle === styleId ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text-muted)]'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${currentStyle === styleId ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text-muted)]'}`}>
                            {styleId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </span>
                          {currentStyle === styleId && <div className="absolute top-4 right-4"><Check className="w-4 h-4 text-[var(--nexus-accent)]" /></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* NEW: TTS SETTING CARD */}
                  <div className={`p-6 md:p-10 lg:p-12 rounded-[2rem] border transition-all space-y-8 ${getStudioStyle()}`}>
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`p-3 rounded-2xl bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)]`}>
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-black uppercase italic tracking-widest">Signal TTS Settings</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest flex items-center gap-2">Signal Volume</span>
                        <span className="text-[10px] font-black text-[var(--nexus-accent)]">{alertConfig?.volume || 50}%</span>
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
                      className={`p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all flex justify-between items-center ${alertConfig?.ttsEnabled ? 'border-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 shadow-[var(--nexus-glow)]' : 'border-[var(--nexus-border)] bg-[var(--nexus-panel)] opacity-60 hover:opacity-100'}`}
                      onClick={() => {
                        const newState = !alertConfig?.ttsEnabled;
                        setAlertConfig({ ...alertConfig, ttsEnabled: newState });
                        saveAlertSettings({ ...alertConfig, ttsEnabled: newState });
                      }}
                    >
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${alertConfig?.ttsEnabled ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text-muted)]'}`}>Text-To-Speech {alertConfig?.ttsEnabled && <Activity className="w-3 h-3 animate-pulse" />}</span>
                        <span className="text-[9px] font-bold text-[var(--nexus-text-muted)] italic leading-relaxed">Incoming donor messages read aloud.</span>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative transition-all ${alertConfig?.ttsEnabled ? 'bg-[var(--nexus-accent)]' : 'bg-[var(--nexus-panel)]'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${alertConfig?.ttsEnabled ? 'left-7' : 'left-1'}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: ALERT STUDIO */}
                <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                  <div className={`p-6 md:p-10 lg:p-12 rounded-[2rem] border transition-all flex flex-col h-full justify-between shadow-2xl ${getStudioStyle()}`}>
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <Monitor className="w-5 h-5 text-[var(--nexus-accent)]" />
                          <h3 className="text-sm font-black uppercase italic tracking-widest text-[var(--nexus-accent)]">Alert Studio</h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 px-3 py-1 rounded-lg italic border border-[var(--nexus-accent)]/20">
                          <Activity className="w-3 h-3 animate-pulse" /> LIVE CALIBRATION
                        </div>
                      </div>

                      <div className={`w-full rounded-3xl relative overflow-hidden border mb-8 flex items-center justify-center min-h-[300px] sm:min-h-[400px] bg-transparent border-[var(--nexus-border)]`}>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`alert-preview-${currentStyle}`}
                            initial={{ scale: 0.6, opacity: 0, y: 10 }}
                            animate={{ scale: 0.8, opacity: 1, y: 0 }}
                            exit={{ scale: 0.6, opacity: 0, y: -10 }}
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
                              hideSticker={true}
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-8">
                      <div className="flex gap-3">
                        <button
                          onClick={() => triggerTestSignal('zap')}
                          className="w-full py-4 rounded-2xl bg-[var(--nexus-accent)] text-black font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 hover:brightness-110 shadow-lg"
                        >
                          <Zap className="w-3.5 h-3.5" /> Simulate Signal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. MISSION TAB */}
          {activeTab === 'mission' && (
            <motion.div
              key="mission"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <div className="w-full">

                {/* NEW TOP ROW: Calibration (Left) + Theme Bar (Right) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-12">

                  {/* LEFT: MISSION CALIBRATION */}
                  <div className={`xl:col-span-5 relative p-8 md:p-10 lg:p-12 rounded-[2.5rem] border bg-[var(--nexus-panel)] overflow-hidden shadow-2xl transition-all ${getStudioStyle()}`}>
                    {/* Background glow effect */}
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-10">
                        <div className={`p-4 rounded-3xl bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)] text-amber-500`}>
                          <Target className="w-6 h-6 animate-[pulse_3s_ease-in-out_infinite]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black uppercase italic tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">Mission Calibration</h3>
                          <p className="text-[10px] font-bold text-[var(--nexus-text-muted)] uppercase tracking-widest mt-1">Configure your primary objective.</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3 group">
                          <label className="text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest flex items-center gap-2 ml-1 transition-colors group-hover:text-amber-500/70"><Gamepad2 className="w-3 h-3" /> Active Title</label>
                          <div className="relative">
                            <input
                              value={goalForm.title}
                              onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                              className={`w-full p-5 rounded-2xl border-2 outline-none font-black italic transition-all bg-[var(--nexus-panel)] border-[var(--nexus-border)] text-[var(--nexus-text)] focus:border-amber-500/50 focus:bg-amber-500/5 focus:shadow-[0_0_20px_rgba(245,158,11,0.1)] placeholder:text-[var(--nexus-text-muted)]`}
                              placeholder="e.g. PC Upgrade Fund"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                              <Sparkles className="w-4 h-4 text-amber-500" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 group">
                          <label className="text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest flex items-center gap-2 ml-1 transition-colors group-hover:text-amber-500/70"><Coins className="w-3 h-3" /> Target (₹)</label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-[var(--nexus-text-muted)]">₹</span>
                            <input
                              type="number"
                              value={goalForm.targetAmount}
                              onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                              className={`w-full p-5 pl-10 rounded-2xl border-2 outline-none font-black italic transition-all bg-[var(--nexus-panel)] border-[var(--nexus-border)] text-[var(--nexus-text)] focus:border-amber-500/50 focus:bg-amber-500/5 focus:shadow-[0_0_20px_rgba(245,158,11,0.1)] placeholder:text-[var(--nexus-text-muted)] text-xl`}
                              placeholder="10000"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                              <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
                            </div>
                          </div>
                        </div>

                        <div className={`mt-8 mb-6 relative overflow-hidden flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer ${goalForm.showOnDashboard ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'bg-[var(--nexus-panel)] border-[var(--nexus-border)] hover:border-amber-500/20'}`}
                          onClick={() => setGoalForm({ ...goalForm, showOnDashboard: !goalForm.showOnDashboard })}>
                          {goalForm.showOnDashboard && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 translate-x-[-100%] animate-[shimmer_2s_infinite]" />}
                          <div className="flex items-center gap-4 relative z-10">
                            <div className={`p-2 rounded-xl ${goalForm.showOnDashboard ? 'bg-amber-500/20 text-amber-500' : 'bg-[var(--nexus-border)] text-[var(--nexus-text-muted)]'}`}>
                              <Globe className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-[11px] font-black uppercase tracking-wider ${goalForm.showOnDashboard ? 'text-amber-500' : 'text-[var(--nexus-text-muted)]'}`}>Dashboard Visibility</span>
                              <span className="text-[9px] font-bold text-[var(--nexus-text-muted)] italic">Show live progress on Streamer ID page.</span>
                            </div>
                          </div>
                          <button className={`w-14 h-7 rounded-full relative transition-all duration-300 shadow-inner z-10 ${goalForm.showOnDashboard ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-slate-700'}`}>
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${goalForm.showOnDashboard ? 'translate-x-8' : 'translate-x-1'}`} />
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
                          className="group relative w-full py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-black rounded-[1.5rem] font-black uppercase italic tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500 ease-in-out" />
                          {isUpdatingGoal ? <Activity className="animate-spin w-5 h-5 relative z-10" /> : <Rocket className="w-5 h-5 relative z-10 group-hover:animate-bounce" />}
                          <span className="relative z-10">Deploy Engine</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: GOAL THEME BAR (Horizontal Scroll) */}
                  <div className={`xl:col-span-7 p-6 md:p-10 lg:p-12 rounded-[2rem] border transition-all flex flex-col ${getStudioStyle()}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-2xl bg-indigo-500/10 text-indigo-500`}>
                        <Palette className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-black uppercase italic tracking-widest text-indigo-500">Goal Bar Theme</h3>
                    </div>

                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 px-2 py-4 scrollbar-hide [&::-webkit-scrollbar]:hidden flex-1 items-center" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                      {[
                        { id: 'modern', label: 'Cyber Pill', icon: <Zap className="w-5 h-5" />, color: '6, 182, 212' },
                        { id: 'glass_jar', label: 'Glass Jar', icon: <Activity className="w-5 h-5" />, color: '56, 189, 248' },
                        { id: 'arc_reactor_horizontal', label: 'Arc (H)', icon: <Activity className="w-5 h-5" />, color: '245, 158, 11' },
                        { id: 'arc_reactor_circular', label: 'Arc (C)', icon: <Activity className="w-5 h-5" />, color: '251, 191, 36' },
                        { id: 'pixel_coin_vault', label: 'Pixel Vault', icon: <Coins className="w-5 h-5" />, color: '34, 197, 94' },
                        { id: 'boss_fight', label: 'Raid Boss', icon: <Skull className="w-5 h-5" />, color: '239, 68, 68' },
                        { id: 'plasma_battery', label: 'Plasma Tube', icon: <Battery className="w-5 h-5" />, color: '217, 70, 239' },
                        { id: 'gta', label: 'Heist', icon: <Star className="w-5 h-5" />, color: '255, 215, 0' },
                        { id: 'bgmi', label: 'Airdrop', icon: <Target className="w-5 h-5" />, color: '249, 115, 22' },
                        { id: 'coc', label: 'Village Raid', icon: <Trophy className="w-5 h-5" />, color: '251, 191, 36' },
                        { id: 'avatar', label: 'Pandora', icon: <Leaf className="w-5 h-5" />, color: '6, 182, 212' },
                        { id: 'godzilla', label: 'Atomic Titan', icon: <Flame className="w-5 h-5" />, color: '0, 191, 255' },
                        // Append Unlocked Premium Styles
                        ...(user?.goalSettings?.unlockedPremiumStyles || []).map(id => ({
                          id,
                          label: id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                          icon: <Sparkles className="w-5 h-5" />,
                          color: '139, 92, 246'
                        }))
                      ].map((style) => {
                        const isSelected = goalForm.stylePreference === style.id;
                        return (
                          <button
                            key={style.id}
                            onClick={() => {
                              const updatedGoalForm = { ...goalForm, stylePreference: style.id };
                              setGoalForm(updatedGoalForm);
                              if (typeof updateGoalSettings === 'function') {
                                updateGoalSettings(updatedGoalForm);
                              }
                            }}
                            className={`relative shrink-0 snap-start flex flex-col items-center justify-center min-w-[120px] aspect-square rounded-[2rem] border-[3px] transition-all gap-3 group overflow-hidden ${isSelected ? 'scale-[1.05]' : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'}`}
                            style={{
                              borderColor: `rgba(${style.color}, ${isSelected ? '1' : '0.3'})`,
                              backgroundColor: `rgba(${style.color}, 0.1)`,
                              boxShadow: isSelected ? `0 0 25px rgba(${style.color}, 0.6)` : 'none'
                            }}
                          >
                            <div className="p-3 rounded-2xl transition-colors relative z-10" style={{ backgroundColor: `rgba(${style.color}, 0.2)` }}>
                              <div style={{ color: `rgb(${style.color})` }}>
                                {style.icon}
                              </div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tighter relative z-10" style={{ color: `rgb(${style.color})` }}>
                              {style.label}
                            </span>
                            {isSelected && <div className="absolute top-4 right-4 z-20"><Check className="w-4 h-4" style={{ color: `rgb(${style.color})` }} /></div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* BOTTOM ROW: GOAL BAR STUDIO PREVIEW (Full Width) */}
                <div className="w-full">
                  <div className={`p-6 md:p-10 lg:p-12 rounded-[2rem] mx-auto border transition-all flex flex-col shadow-2xl ${getStudioStyle()}`}>

                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-amber-500" />
                        <h3 className="text-sm font-black uppercase italic tracking-widest text-amber-500">Goal Bar Studio Previews</h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg italic border border-amber-500/20">
                        <Activity className="w-3 h-3 animate-pulse" /> LIVE SYNC
                      </div>
                    </div>

                    <div className={`w-full rounded-[2rem] relative overflow-hidden border mb-8 flex items-center justify-center min-h-[400px] sm:min-h-[450px] bg-transparent border-[var(--nexus-border)]`}>
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

          {/* 3. NEXUS TAB (THEME SWITCHER) */}
          {activeTab === 'nexus' && (
            <motion.div
              key="nexus"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <div className="w-full">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                  <div className="px-6 py-2 rounded-full bg-[var(--nexus-accent)]/10 border border-[var(--nexus-accent)]/20">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--nexus-accent)]">Theme</span><p className="max-w-xl text-sm italic text-[var(--nexus-text-muted)]">Transform your control center into a thematic cockpit. Choose an interface style that matches your stream identity.</p>
                  </div>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 p-4 -m-4 pb-8 scrollbar-hide [&::-webkit-scrollbar]:hidden items-stretch" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                  {[
                    { id: 'void', label: 'VOID (DEFAULT)', desc: 'Pitch black, neon accents.', icon: <Layout className="w-6 h-6" />, color: '#10B981', premium: false },
                    { id: 'aero', label: 'AERO (GLASS)', desc: 'Frosted glass, macOS vibe.', icon: <Sparkles className="w-6 h-6" />, color: '#38bdf8', premium: false },
                    { id: 'aero-light', label: 'AERO LIGHT', desc: 'Bright frosted glass, macOS vibe.', icon: <Sparkles className="w-6 h-6" />, color: '#ec4899', premium: false },
                    { id: 'nebula-void', label: 'NEBULA VOID', desc: 'Deep obsidian, violet highlights.', icon: <Layout className="w-6 h-6" />, color: '#8B5CF6', premium: false },
                    { id: 'alabaster-pulse', label: 'ALABASTER PULSE', desc: 'Professional, bright tech-style.', icon: <Zap className="w-6 h-6" />, color: '#3B82F6', premium: false },
                    { id: 'kawaii', label: 'KAWAII DESK', desc: 'Pastel pink, cute bounce.', icon: <Heart className="w-6 h-6" />, color: '#fb7185', premium: false },
                    { id: 'arcade', label: 'ARCADE', desc: 'Retro 8-bit, purple neon.', icon: <Gamepad2 className="w-6 h-6" />, color: '#facc15', premium: false },
                    { id: 'bgmi', label: 'BGMI / TACTICAL', desc: 'Desert camo, angled armor.', icon: <Target className="w-6 h-6" />, color: '#F97316', premium: false },
                    { id: 'live_space', label: 'ZERO-GRAVITY', desc: 'Cinematic Orbit (4K Video).', icon: <Globe className="w-6 h-6" />, color: '#6366f1', premium: true },
                    { id: 'live_erangel', label: 'RED-ZONE', desc: 'Tactical Warzone (4K Video).', icon: <Skull className="w-6 h-6" />, color: '#ef4444', premium: true },
                    { id: 'live_cyber', label: 'HACKER OS', desc: 'Digital Rain (4K Video).', icon: <Activity className="w-6 h-6" />, color: '#39ff14', premium: true },
                    { id: 'live_synthwave', label: 'NEON OVERDRIVE', desc: '80s Retro (3D Grid).', icon: <Music className="w-6 h-6" />, color: '#ff00aa', premium: true },
                    { id: 'live_kawaii', label: 'SKY SANCTUARY', desc: 'Day/Night (Parallax).', icon: <Cloud className="w-6 h-6" />, color: '#a1c4fd', premium: true },
                    { id: 'live_dragon', label: 'DRAGON HOARD', desc: 'Mystic Runes (Ember).', icon: <Gem className="w-6 h-6" />, color: '#fbbf24', premium: true },
                    { id: 'midnight-obsidian', label: 'KINETIC OBSIDIAN', desc: 'Liquid gold accents, dark drift.', icon: <Layout className="w-6 h-6" />, color: '#F59E0B', premium: false },
                  ].filter(t => !t.premium || (user?.unlockedNexusThemes || []).includes(t.id)).map((t) => {
                    const isSelected = nexusTheme === t.id;
                    const isHovered = hoveredTheme === t.id;

                    return (
                      <button
                        key={t.id}
                        onClick={() => saveNexusTheme(t.id)}
                        onMouseEnter={() => setHoveredTheme(t.id)}
                        onMouseLeave={() => setHoveredTheme(null)}
                        className={`group shrink-0 snap-center relative flex flex-col p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-500 z-10 w-[240px] md:w-[280px] text-left
                          ${isSelected
                            ? 'scale-[1.02]'
                            : 'opacity-80 hover:opacity-100'
                          }`}
                        style={{
                          borderColor: isSelected || isHovered ? t.color : `${t.color}40`, // 40 is hex for 25% opacity
                          backgroundColor: `${t.color}0a`, // 0a is very faint background
                          boxShadow: isSelected || isHovered ? `0 0 30px ${t.color}60` : 'none',
                          transform: isHovered && !isSelected ? 'scale(1.02)' : ''
                        }}
                      >
                        {/* OWNED premium badge */}
                        {t.premium && (
                          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20">
                            <Crown className="w-3 h-3 text-yellow-500" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-yellow-600">Owned</span>
                          </div>
                        )}

                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-all duration-500 relative z-10"
                          style={{
                            backgroundColor: isSelected || isHovered ? t.color : `${t.color}20`,
                            color: isSelected || isHovered ? '#fff' : t.color,
                            boxShadow: isSelected || isHovered ? `0 0 15px ${t.color}80` : 'none'
                          }}
                        >
                          {t.icon}
                        </div>

                        <div className="flex flex-col text-left gap-1 relative z-10 mt-auto">
                          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest" style={{ color: t.color }}>{t.label}</span>
                          <p className="text-[8px] md:text-[9px] font-bold italic leading-relaxed opacity-80" style={{ color: t.color }}>{t.desc}</p>
                        </div>

                        {isSelected && (
                          <div className="absolute top-6 right-6 z-20">
                            <Check className="w-5 h-5 animate-pulse" style={{ color: t.color }} />
                          </div>
                        )}

                        {/* Owned premium glow shimmer */}
                        {t.premium && <div className="absolute inset-0 rounded-[2rem] pointer-events-none ring-1 ring-yellow-400/10 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Prompt to visit store if user has no premium themes */}
                {(user?.unlockedNexusThemes || []).length === 0 && (
                  <div className="mt-10 flex flex-col items-center gap-3 text-center py-8 border border-dashed border-white/10 rounded-3xl">
                    <Crown className="w-8 h-8 text-yellow-400 opacity-50" />
                    <p className="text-sm font-black uppercase italic tracking-wider text-[var(--nexus-text-muted)]">No Premium Environments Unlocked</p>
                    <p className="text-[10px] text-[var(--nexus-text-muted)] opacity-60 max-w-xs">Head to the <button onClick={() => setActiveSection && setActiveSection('store')} className="text-[var(--nexus-accent)] font-bold hover:underline transition-colors px-1 py-0.5 rounded hover:bg-[var(--nexus-accent)]/10">Store</button> tab to browse and purchase elite live themes for your dashboard.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 4. STICKERS TAB */}
          {activeTab === 'stickers' && (
            <motion.div
              key="stickers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="w-full">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                      <Rocket className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-black uppercase italic tracking-widest text-indigo-500">Partner Pack</h3>
                      <p className="text-[10px] font-bold text-[var(--nexus-text-muted)] uppercase tracking-widest">Customize your stream's signature stickers.</p>
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
                  <button onClick={addStickerSlot} className={`p-8 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all border-[var(--nexus-border)] text-[var(--nexus-text-muted)] hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/5`}>
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

          {/* 5. WIDGETS TAB */}
          {activeTab === 'widgets' && (
            <motion.div
              key="widgets"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-6xl mx-auto space-y-8"
            >
              {/* TOP SUPPORTER WIDGET SETTINGS */}
              <div className={`p-8 md:p-12 rounded-[2.5rem] border transition-all ${getStudioStyle()}`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)]">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">Top Supporter Widget</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)]">Select the visual aesthetic for your leaderboard.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'royal_throne', label: '3D Royal Throne', desc: 'Premium podium with gold/silver accents and crown animations.', icon: <Crown className="w-6 h-6" /> },
                    { id: 'classic_chart', label: 'Modern Glass Chart', desc: 'Clean, transparent list with elegant progress tracking.', icon: <Layout className="w-6 h-6" /> },
                    { id: 'arcade_scores', label: 'Retro Arcade Scores', desc: 'Classic 8-bit high score board with neon pulse effects.', icon: <Gamepad2 className="w-6 h-6" /> }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleStyleSwitch(style.id, 'leaderboardStyle')}
                      className={`group relative flex flex-col p-8 rounded-[2.5rem] border-2 transition-all duration-500 hover:scale-[1.02] shadow-lg
                        ${(alertConfig?.leaderboardStyle || 'royal_throne') === style.id
                          ? 'border-[var(--nexus-accent)] bg-[var(--nexus-panel)] shadow-[var(--nexus-glow)]'
                          : 'border-[var(--nexus-border)] bg-[var(--nexus-panel)] hover:border-[var(--nexus-accent)]/50 hover:shadow-xl'
                        }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${(alertConfig?.leaderboardStyle || 'royal_throne') === style.id
                        ? 'bg-[var(--nexus-accent)] text-black shadow-lg'
                        : 'bg-[var(--nexus-panel)] text-[var(--nexus-text-muted)] group-hover:bg-[var(--nexus-accent)]/20 group-hover:text-[var(--nexus-accent)]'
                        }`}>
                        {style.icon}
                      </div>
                      <div className="flex flex-col text-left gap-2">
                        <span className={`text-[11px] font-black uppercase tracking-widest ${(alertConfig?.leaderboardStyle || 'royal_throne') === style.id
                          ? 'text-[var(--nexus-accent)]'
                          : 'text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-text)]'
                          }`}>
                          {style.label}
                        </span>
                        <p className="text-[9px] font-bold italic text-[var(--nexus-text-muted)] opacity-60 leading-relaxed">
                          {style.desc}
                        </p>
                      </div>
                      {(alertConfig?.leaderboardStyle || 'royal_throne') === style.id && (
                        <div className="absolute top-6 right-6 text-[var(--nexus-accent)]">
                          <Check className="w-5 h-5 animate-bounce" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* TUG-OF-WAR CONTROL CENTER INTEGRATION */}
                <div className="mt-12">
                  <TugOfWarControl streamerId={user?.streamerId} theme={theme} nexusTheme={nexusTheme} />
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div >
  );
};

export default ControlCenter;
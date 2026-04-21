import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Globe, Target, Save,
  Trash2, Plus, Check, Rocket,
  Monitor, Volume2, Activity, Layout, Palette, Sparkles, Crown, Gamepad2, Heart,
  Flame, Leaf, Skull, Battery, Coins, Trophy, Star, Music, Cloud, Gem, ChevronLeft, ChevronRight
} from 'lucide-react';

import AlertPreview from './AlertPreview';
import CyberGoalBar from '../widgets/GoalBar';
import PremiumGoalOverlays from '../widgets/GoalOverlays';
import TugOfWarControl from './TugOfWarControl';
import { Player } from '@lottiefiles/react-lottie-player';

const PREMIUM_GOAL_STYLES = [
  'black_hole', 'hex_core', 'rune_monolith', 'hologram_glitch',
  'alchemist_flask', 'redline_dash', 'loot_dispenser', 'mecha_lens'
];

const ControlCenter = ({
  theme, user, goalForm, setGoalForm, updateGoalSettings,
  isUpdatingGoal, alertConfig, setAlertConfig, saveAlertSettings,
  nexusTheme, saveNexusTheme,
  isSavingAlerts, partnerStickers, addStickerSlot,
  removeStickerSlot, savePartnerPack, updatePartnerPack, isSavingStickers, isTierEligible,
  copyToClipboard, copiedType, triggerTestSignal, setActiveSection
}) => {

  const [activeTab, setActiveTab] = useState('overlay');
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const [editingStickerIdx, setEditingStickerIdx] = useState(null);
  const [tempStickerData, setTempStickerData] = useState(null);
  const jsonInputRef = useRef(null);
  const nexusScrollRef = useRef(null);
  const goalScrollRef = useRef(null);

  // BASE URL for local environment

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

  const handleScroll = (ref, offset) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 pb-20 pt-0 relative z-10">

      {/* --- TACTICAL TAB HEADER --- */}
      <div className="w-full flex items-center justify-start border-b border-[var(--nexus-border)] mb-10 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-8 md:gap-12 px-6 md:px-10">
          {['overlay', 'mission', 'nexus', 'stickers', 'widgets'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  relative py-5 transition-all duration-300 group whitespace-nowrap
                  text-[11px] font-black uppercase tracking-[0.25em]
                  ${isActive 
                    ? (theme === 'light' ? 'text-black' : 'text-white') 
                    : (theme === 'light' ? 'text-slate-400 hover:text-slate-900' : 'text-slate-500 hover:text-white')}
                `}
              >
                <div className="flex items-center gap-3">
                  {tab === 'overlay' && 'ALERT'}
                  {tab === 'mission' && 'GOAL'}
                  {tab === 'nexus' && 'THEME'}
                  {tab === 'stickers' && 'STICKERS'}
                  {tab === 'widgets' && 'WIDGETS'}
                </div>
                
                {isActive && (
                  <motion.div
                    layoutId="activeSubTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--nexus-accent)] shadow-[0_0_15px_var(--nexus-accent-glow)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
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

                {/* LEFT COLUMN: AESTHETICS */}
                <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
                  <div className={`p-6 md:p-8 rounded-[2rem] border transition-all ${getStudioStyle()}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <h2 className="text-3xl font-black italic tracking-tighter text-[var(--nexus-text)]">NOTIFICATIONS</h2>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--nexus-text-muted)] opacity-50 mt-1">Configure real-time visual alerts</p>
                        </div>
                      </div>
                      {isSavingAlerts && <Activity className="w-5 h-5 animate-spin text-[var(--nexus-accent)]" />}
                    </div>
                    <p className="text-[10px] font-bold text-[var(--nexus-text-muted)] italic leading-relaxed mb-4">Choose your live visual template. This instantly updates your OBS software and Donation page.</p>

                    <div className={`grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 border-t border-b py-5 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStyleSwitch('modern')}
                        className={`relative flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all overflow-hidden border-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 hover:bg-[var(--nexus-accent)]/20 ${currentStyle === 'modern' ? 'shadow-[var(--nexus-glow)] bg-[var(--nexus-accent)]/20' : ''}`}
                      >
                        <Sparkles className={`w-5 h-5 md:w-6 md:h-6 text-[var(--nexus-accent)]`} />
                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[var(--nexus-accent)]`}>Modern</span>
                        {currentStyle === 'modern' && <div className="absolute top-2 right-2"><Check className="w-3 h-3 text-[var(--nexus-accent)]" /></div>}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStyleSwitch('comic')}
                        className={`relative flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all overflow-hidden border-black bg-[#FFDE00] hover:bg-[#ffe533] ${currentStyle === 'comic' ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : ''}`}
                      >
                        <Zap className={`w-5 h-5 md:w-6 md:h-6 text-black fill-black`} />
                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest text-black`}>Comic</span>
                        {currentStyle === 'comic' && <div className="absolute top-2 right-2"><Check className="w-3 h-3 text-black" /></div>}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStyleSwitch('playful')}
                        className={`relative flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all overflow-hidden border-[#FF5F6D] bg-[#FF5F6D]/10 hover:bg-[#FF5F6D]/20 ${currentStyle === 'playful' ? 'shadow-[0_0_15px_rgba(255,95,109,0.3)] bg-[#FF5F6D]/20' : ''}`}
                      >
                        <Crown className={`w-5 h-5 md:w-6 md:h-6 text-[#FF5F6D] fill-[#FF5F6D]`} />
                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#FF5F6D]`}>Playful</span>
                        {currentStyle === 'playful' && <div className="absolute top-2 right-2"><Check className="w-3 h-3 text-[#FF5F6D]" /></div>}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStyleSwitch('pixel')}
                        className={`relative flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all overflow-hidden border-[#4CAF50] bg-[#4CAF50]/10 hover:bg-[#4CAF50]/20 ${currentStyle === 'pixel' ? 'shadow-[0_0_15px_rgba(76,175,80,0.3)] bg-[#4CAF50]/20' : ''}`}
                      >
                        <Gamepad2 className={`w-5 h-5 md:w-6 md:h-6 text-[#4CAF50]`} />
                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#4CAF50]`}>Pixel</span>
                        {currentStyle === 'pixel' && <div className="absolute top-2 right-2"><Check className="w-3 h-3 text-[#4CAF50]" /></div>}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStyleSwitch('kawaii')}
                        className={`relative flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all overflow-hidden border-[#C26D7D] bg-[#C26D7D]/10 hover:bg-[#C26D7D]/20 ${currentStyle === 'kawaii' ? 'shadow-[0_0_15px_rgba(194,109,125,0.3)] bg-[#C26D7D]/20' : ''}`}
                      >
                        <Heart className={`w-5 h-5 md:w-6 md:h-6 text-[#C26D7D] fill-[#C26D7D]`} />
                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#C26D7D]`}>Kawaii</span>
                        {currentStyle === 'kawaii' && <div className="absolute top-2 right-2"><Check className="w-3 h-3 text-[#C26D7D]" /></div>}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStyleSwitch('cyberhud')}
                        className={`relative flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all overflow-hidden border-[#39ff14] bg-[#39ff14]/10 hover:bg-[#39ff14]/20 ${currentStyle === 'cyberhud' ? 'shadow-[0_0_20px_rgba(57,255,20,0.4)] bg-[#39ff14]/20' : ''}`}
                      >
                        <Activity className={`w-5 h-5 md:w-6 md:h-6 text-[#39ff14] animate-pulse`} />
                        <span className={`text-[8px] md:text-[9px] font-mono uppercase tracking-widest text-[#39ff14]`}>Digital HUD</span>
                        {currentStyle === 'cyberhud' && <div className="absolute top-2 right-2"><Check className="w-3 h-3 text-[#39ff14]" /></div>}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStyleSwitch('bgmi')}
                        className={`relative flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all overflow-hidden border-[#F97316] bg-[#F97316]/10 hover:bg-[#F97316]/20 ${currentStyle === 'bgmi' ? 'shadow-[0_0_20px_rgba(249,115,22,0.4)] bg-[#F97316]/20' : ''}`}
                      >
                        <Target className={`w-5 h-5 md:w-6 md:h-6 text-[#F97316] animate-pulse`} />
                        <span className={`text-[8px] md:text-[9px] font-mono uppercase tracking-widest text-[#F97316]`}>Airdrop</span>
                        {currentStyle === 'bgmi' && <div className="absolute top-2 right-2"><Check className="w-3 h-3 text-[#F97316]" /></div>}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStyleSwitch('gta')}
                        className={`relative flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all overflow-hidden border-[#FFD700] bg-black hover:bg-black/90 ${currentStyle === 'gta' ? 'shadow-[0_0_20px_rgba(255,215,0,0.4)] opacity-100' : ''}`}
                      >
                        <Star className={`w-5 h-5 md:w-6 md:h-6 text-[#FFD700] fill-[#FFD700]`} />
                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-tighter text-[#FFD700]`}>Respect +</span>
                        {currentStyle === 'gta' && <div className="absolute top-2 right-2"><Check className="w-3 h-3 text-[#FFD700]" /></div>}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStyleSwitch('coc')}
                        className={`relative flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all overflow-hidden border-[#FBBF24] bg-[#451A03] hover:bg-[#572205] ${currentStyle === 'coc' ? 'shadow-[0_0_20px_rgba(251,191,36,0.4)]' : ''}`}
                      >
                        <Trophy className={`w-5 h-5 md:w-6 md:h-6 text-[#FBBF24] fill-[#FBBF24]`} />
                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-wider text-[#FBBF24]`}>Raid</span>
                        {currentStyle === 'coc' && <div className="absolute top-2 right-2"><Check className="w-3 h-3 text-[#FBBF24]" /></div>}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStyleSwitch('avatar')}
                        className={`relative flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all overflow-hidden border-[#06B6D4] bg-[#040D14] hover:bg-[#061826] ${currentStyle === 'avatar' ? 'shadow-[0_0_20px_rgba(6,182,212,0.4)]' : ''}`}
                      >
                        <Leaf className={`w-5 h-5 md:w-6 md:h-6 text-[#22D3EE] animate-pulse`} />
                        <span className={`text-[8px] md:text-[9px] uppercase font-light tracking-[0.3em] text-[#22D3EE]`}>Pandora</span>
                        {currentStyle === 'avatar' && <div className="absolute top-2 right-2"><Check className="w-3 h-3 text-[#22D3EE]" /></div>}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: STUDIO + TTS */}
                <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                  <div className={`p-6 md:p-8 rounded-[2rem] border transition-all flex flex-col h-full justify-between shadow-2xl ${getStudioStyle()}`}>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Palette className="w-5 h-5 text-[var(--nexus-accent)]" />
                          <h3 className="text-sm font-black italic flex items-center gap-2 text-[var(--nexus-text)] uppercase tracking-tight">Notification Style</h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 px-3 py-1 rounded-lg italic border border-[var(--nexus-accent)]/20">
                          <Activity className="w-3 h-3 animate-pulse" /> PREVIEW
                        </div>
                      </div>

                      <div className={`w-full rounded-2xl relative overflow-hidden border mb-4 flex items-center justify-center min-h-[200px] sm:min-h-[280px] bg-transparent border-[var(--nexus-border)]`}>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`alert-preview-${currentStyle}`}
                            initial={{ scale: 0.5, opacity: 0, y: 10 }}
                            animate={{ scale: 0.75, opacity: 1, y: 0 }}
                            exit={{ scale: 0.5, opacity: 0, y: -10 }}
                            className="w-full h-full flex items-center justify-center origin-center transform transition-transform duration-500"
                          >
                            <AlertPreview
                              donorName="Drope Tester"
                              amount={500}
                              message="Preview Status: Active"
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

                    <div className="flex flex-col gap-4">
                      <button
                        onClick={() => triggerTestSignal('zap')}
                        className="w-full py-4 rounded-2xl bg-[var(--nexus-accent)] text-black font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 hover:brightness-110 shadow-lg"
                      >
                        <Zap className="w-3.5 h-3.5" /> Simulate Alert
                      </button>
                    </div>
                  </div>

                  {/* TTS SETTING CARD */}
                  <div className={`p-6 md:p-8 rounded-[2rem] border transition-all space-y-4 ${getStudioStyle()}`}>
                    <div className="flex items-center gap-4 mb-1">
                      <div className={`p-3 rounded-2xl bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)]`}>
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <h3 className="text-xs font-black uppercase italic tracking-widest">Alert Audio Settings</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest flex items-center gap-2">Alert Volume</span>
                          <span className="text-[10px] font-black text-[var(--nexus-accent)]">{alertConfig?.volume || 50}%</span>
                        </div>
                        <input type="range"
                          min="0" max="100"
                          value={alertConfig?.volume || 50}
                          onChange={(e) => setAlertConfig({ ...alertConfig, volume: parseInt(e.target.value) })}
                          onMouseUp={() => saveAlertSettings({ ...alertConfig, volume: parseInt(alertConfig.volume || 50) })}
                          onTouchEnd={() => saveAlertSettings({ ...alertConfig, volume: parseInt(alertConfig.volume || 50) })}
                          className="w-full h-1.5 rounded-full appearance-none bg-slate-200 outline-none
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#10B981] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                          dark:bg-slate-800"
                        />
                      </div>

                      <div
                        className={`p-4 rounded-[1.5rem] border-2 cursor-pointer transition-all flex justify-between items-center ${alertConfig?.ttsEnabled ? 'border-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 shadow-[var(--nexus-glow)]' : 'border-[var(--nexus-border)] bg-[var(--nexus-panel)] opacity-60 hover:opacity-100'}`}
                        onClick={() => {
                          const newState = !alertConfig?.ttsEnabled;
                          setAlertConfig({ ...alertConfig, ttsEnabled: newState });
                          saveAlertSettings({ ...alertConfig, ttsEnabled: newState });
                        }}
                      >
                        <span className={`text-[9px] font-black uppercase tracking-widest ${alertConfig?.ttsEnabled ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text-muted)]'}`}>Text-To-Speech</span>
                        <div className={`w-10 h-5 rounded-full relative transition-all ${alertConfig?.ttsEnabled ? 'bg-[var(--nexus-accent)]' : 'bg-[var(--nexus-panel)]'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all ${alertConfig?.ttsEnabled ? 'left-5.5' : 'left-0.5'}`} />
                        </div>
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
                {/* TOP ROW: Calibration + Preview (Stacked Vertical) */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8 items-stretch">
                  {/* LEFT: MISSION CALIBRATION */}
                  <div className={`w-full lg:w-[45%] relative p-6 md:p-8 rounded-[2rem] border bg-[var(--nexus-panel)] overflow-hidden shadow-2xl transition-all ${getStudioStyle()}`}>
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--nexus-border)] pb-8">
                        <div className="flex items-center gap-4">
                          <div className="p-3.5 bg-[var(--nexus-accent)]/10 rounded-[1.5rem] border border-[var(--nexus-accent)]/20 shadow-inner">
                            <Target className="w-8 h-8 text-[var(--nexus-accent)]" />
                          </div>
                          <div className="flex flex-col">
                            <h2 className="text-xl font-black italic tracking-tighter text-[var(--nexus-text)]">DONATION GOALS</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--nexus-text-muted)] opacity-60 mt-1">Configure your active donation goal</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-6 w-full">
                        {/* ACTIVE TITLE */}
                        <div className="w-full space-y-2 group">
                          <label className="text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest flex items-center gap-2 ml-1">
                            <Gamepad2 className="w-3.5 h-3.5" /> Active Title
                          </label>
                          <input
                            value={goalForm.title}
                            onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                            className={`w-full p-4 rounded-xl border outline-none font-black italic transition-all text-sm shadow-sm focus:border-[var(--nexus-accent)] ${
                              theme === 'light'
                                ? 'bg-white border-slate-200 text-slate-900 focus:bg-slate-50'
                                : 'bg-[#0a0a0a] border-white/10 text-white focus:bg-[#111]'
                            }`}
                            placeholder="e.g. PC Upgrade Fund"
                          />
                        </div>

                        {/* TARGET AMOUNT */}
                        <div className="w-full space-y-2 group">
                          <label className="text-[10px] font-black uppercase text-[var(--nexus-text-muted)] tracking-widest flex items-center gap-2 ml-1">
                            <Coins className="w-3.5 h-3.5" /> Target (₹)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-gray-500 mt-0.5">₹</span>
                            <input
                              type="number"
                              value={goalForm.targetAmount}
                              onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                              className={`w-full p-4 pl-10 rounded-xl border outline-none font-black italic transition-all text-base shadow-sm focus:border-[var(--nexus-accent)] ${
                                theme === 'light'
                                  ? 'bg-white border-slate-200 text-slate-900 focus:bg-slate-50'
                                  : 'bg-[#0a0a0a] border-white/10 text-white focus:bg-[#111]'
                              }`}
                              placeholder="5000"
                            />
                          </div>
                        </div>

                        {/* VISIBILITY & SAVE */}
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer min-w-[100px] h-[58px] shadow-sm ${theme === 'light' ? 'bg-white' : 'bg-[#0a0a0a]'} ${goalForm.isActive ? 'border-[var(--nexus-accent)]' : (theme === 'light' ? 'border-slate-200' : 'border-white/10')}`}
                            onClick={() => {
                              const updated = { ...goalForm, isActive: !goalForm.isActive };
                              setGoalForm(updated);
                              if (updateGoalSettings) updateGoalSettings(updated);
                            }}
                          >
                            <span className={`text-[8px] font-black uppercase tracking-widest mb-1.5 ${goalForm.isActive ? 'text-[var(--nexus-accent)]' : (theme === 'light' ? 'text-slate-400' : 'text-gray-500')}`}>Visibility</span>
                            <div className={`w-8 h-4 rounded-full relative transition-all duration-300 shadow-inner ${goalForm.isActive ? 'bg-[var(--nexus-accent)]' : (theme === 'light' ? 'bg-slate-200' : 'bg-gray-700')}`}>
                              <div className={`absolute top-[2px] w-3 h-3 bg-white rounded-full shadow-md transition-all duration-300 ${goalForm.isActive ? 'left-[18px]' : 'left-[2px]'}`} />
                            </div>
                          </div>

                          <button
                            onClick={() => updateGoalSettings && updateGoalSettings({ ...goalForm, resetProgress: true })}
                            disabled={isUpdatingGoal}
                            className="h-[58px] px-8 bg-[var(--nexus-accent)] text-black rounded-xl font-black uppercase italic tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-lg shadow-[var(--nexus-accent)]/20 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                          >
                            {isUpdatingGoal ? <Activity className="animate-spin w-4 h-4" /> : <Rocket className="w-4 h-4" />}
                            <span>Set Goal</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: TUG-OF-WAR CONTROL CENTER INTEGRATION */}
                  <div className="w-full lg:w-[55%]">
                    <TugOfWarControl streamerId={user?.streamerId} theme={theme} nexusTheme={nexusTheme} />
                  </div>
                </div>

                {/* BOTTOM: STUDIO PREVIEW (FULL WIDTH) */}
                <div className={`w-full p-6 md:p-8 rounded-[2rem] border transition-all flex flex-col shadow-2xl justify-between mb-8 ${getStudioStyle()}`}>
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Monitor className="w-4 h-4 text-[var(--nexus-accent)]" />
                          <h3 className="text-xs font-black uppercase italic tracking-widest text-[var(--nexus-accent)]">Goal Bar Preview</h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10 px-3 py-1 rounded-lg italic border border-[var(--nexus-accent)]/20">
                          <Activity className="w-3 h-3 animate-pulse" /> LIVE SYNC
                        </div>
                      </div>

                      <div className={`w-full rounded-2xl relative overflow-hidden border mb-6 flex items-center justify-center min-h-[220px] sm:min-h-[260px] bg-transparent border-[var(--nexus-border)]`}>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={goalForm.stylePreference}
                            initial={{ scale: 0.6, opacity: 0, y: 10 }}
                            animate={{ scale: 0.75, opacity: 1, y: 0 }}
                            exit={{ scale: 0.6, opacity: 0, y: -10 }}
                            className="w-full flex items-center justify-center origin-center"
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
                    </div>

                  </div>

                {/* BOTTOM: GOAL THEME BAR (Full Width) */}
                <div className={`p-6 md:p-8 rounded-[2rem] border transition-all flex flex-col ${getStudioStyle()}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500`}>
                      <Palette className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-black uppercase italic tracking-widest text-indigo-500">Goal Bar Theme</h3>
                  </div>

                  <div className="relative group/scroll">
                    {/* Directional Controllers */}
                    <button 
                      onClick={() => handleScroll(goalScrollRef, -240)}
                      className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-indigo-400 opacity-0 group-hover/scroll:opacity-100 transition-all hover:bg-black hover:scale-110 shadow-[0_0_15px_rgba(99,102,241,0.3)] hidden md:flex"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleScroll(goalScrollRef, 240)}
                      className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-indigo-400 opacity-0 group-hover/scroll:opacity-100 transition-all hover:bg-black hover:scale-110 shadow-[0_0_15px_rgba(99,102,241,0.3)] hidden md:flex"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div 
                      ref={goalScrollRef}
                      className="flex overflow-x-auto snap-x snap-mandatory gap-3 px-1 py-4 laser-scroll items-center"
                    >
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
                      ...(user?.goalSettings?.unlockedPremiumStyles || []).map(id => ({
                        id,
                        label: id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                        icon: <Sparkles className="w-5 h-5" />,
                        color: '139, 92, 246'
                      }))
                    ].map((style) => {
                      const isSelected = goalForm.stylePreference === style.id;
                      return (
                        <motion.button
                          key={style.id}
                          whileHover={{ scale: 1.05, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const updatedGoalForm = { ...goalForm, stylePreference: style.id };
                            setGoalForm(updatedGoalForm);
                            if (typeof updateGoalSettings === 'function') {
                              updateGoalSettings(updatedGoalForm);
                            }
                          }}
                          className={`relative shrink-0 snap-start flex flex-col items-center justify-center min-w-[100px] aspect-square rounded-[1.5rem] border-[2px] transition-all gap-2 group overflow-hidden ${isSelected ? 'scale-[1.02]' : 'opacity-80 hover:opacity-100'}`}
                          style={{
                            borderColor: `rgba(${style.color}, ${isSelected ? '1' : '0.3'})`,
                            backgroundColor: `rgba(${style.color}, 0.1)`,
                            boxShadow: isSelected ? `0 0 20px rgba(${style.color}, 0.5)` : 'none'
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
                        </motion.button>
                      );
                    })}
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-white/5 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-[var(--nexus-accent)]/10 rounded-[1.5rem] border border-[var(--nexus-accent)]/20 shadow-inner">
                      <Layout className="w-8 h-8 text-[var(--nexus-accent)]" />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-3xl font-black italic tracking-tighter text-[var(--nexus-text)] uppercase">Appearance</h2>
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--nexus-text-muted)] opacity-60 mt-1">Select a theme to apply globally</p>
                    </div>
                  </div>

                  {/* Dark / Light Compact Toggle Chip */}
                  <div className="inline-flex items-center bg-[var(--nexus-panel)] border border-[var(--nexus-border)] rounded-full p-0.5 gap-0 shrink-0">
                     <button
                        onClick={() => {
                          const event = new CustomEvent('nexus-theme-change', { detail: { mode: 'dark' } });
                          window.dispatchEvent(event);
                          localStorage.setItem('dropeThemeSet', 'true');
                          localStorage.setItem('dropeTheme', 'dark');
                        }}
                        title="Dark Mode"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black tracking-widest text-[9px] uppercase transition-all duration-200 ${theme === 'dark' ? 'bg-[var(--nexus-accent)] text-white shadow-md' : 'text-[var(--nexus-text-muted)] hover:text-[var(--nexus-text)]'}`}
                     >
                       <Monitor className="w-3 h-3" /> Dark
                     </button>
                     <button
                        onClick={() => {
                          const event = new CustomEvent('nexus-theme-change', { detail: { mode: 'light' } });
                          window.dispatchEvent(event);
                          localStorage.setItem('dropeThemeSet', 'true');
                          localStorage.setItem('dropeTheme', 'light');
                        }}
                        title="Light Mode"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black tracking-widest text-[9px] uppercase transition-all duration-200 ${theme === 'light' ? 'bg-[var(--nexus-accent)] text-white shadow-md' : 'text-[var(--nexus-text-muted)] hover:text-[var(--nexus-text)]'}`}
                     >
                       <Zap className="w-3 h-3" /> Light
                     </button>
                  </div>
                </div>

                <div>
                  <div 
                    ref={nexusScrollRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                  >
                  {[
                    // SYSTEM ENVIRONMENTS
                    { id: 'void',           label: 'Default',       desc: 'Dark base · Emerald',    icon: <Layout className="w-6 h-6" />,   color: '#10B981', premium: false },
                    { id: 'aero',           label: 'Aero',          desc: 'Glass · Dark',           icon: <Sparkles className="w-6 h-6" />, color: '#38bdf8', premium: false },
                    { id: 'aero-light',     label: 'Aero Light',    desc: 'Glass · Light',          icon: <Sparkles className="w-6 h-6" />, color: '#ec4899', premium: false },
                    { id: 'nebula-void',    label: 'Nebula',        desc: 'Deep space · Violet',    icon: <Globe className="w-6 h-6" />,    color: '#8B5CF6', premium: false },
                    { id: 'alabaster-pulse',label: 'Alabaster',     desc: 'Clean light · Blue',     icon: <Zap className="w-6 h-6" />,      color: '#3B82F6', premium: false },
                    { id: 'kawaii',         label: 'Kawaii',        desc: 'Soft pink · Rounded',    icon: <Heart className="w-6 h-6" />,    color: '#fb7185', premium: false },
                    { id: 'arcade',         label: 'Arcade',        desc: 'Retro · Neon yellow',    icon: <Gamepad2 className="w-6 h-6" />, color: '#facc15', premium: false },
                    { id: 'bgmi',           label: 'Tactical',      desc: 'Military · Sharp edges', icon: <Target className="w-6 h-6" />,   color: '#F97316', premium: false },
                    { id: 'live_space',     label: 'Zero Gravity',  desc: 'Cinematic orbit · 4K',   icon: <Globe className="w-6 h-6" />,    color: '#6366f1', premium: true },
                    { id: 'live_erangel',   label: 'Warzone',       desc: 'Battlefield · 4K',       icon: <Skull className="w-6 h-6" />,    color: '#ef4444', premium: true },
                    { id: 'live_cyber',     label: 'Hacker',        desc: 'Digital rain · Matrix',  icon: <Activity className="w-6 h-6" />, color: '#39ff14', premium: true },
                    { id: 'live_synthwave', label: 'Synthwave',     desc: 'Retro 80s · Neon grid',  icon: <Music className="w-6 h-6" />,    color: '#ff00aa', premium: true },
                    { id: 'live_kawaii',    label: 'Sky Parallax',  desc: 'Day to night · Live',    icon: <Cloud className="w-6 h-6" />,    color: '#a1c4fd', premium: true },
                    { id: 'live_dragon',    label: 'Dragon',        desc: 'Mystic ember · Fantasy', icon: <Gem className="w-6 h-6" />,      color: '#fbbf24', premium: true },
                    { id: 'uplink',         label: 'Uplink',        desc: 'Layered glass · Dark',   icon: <Zap className="w-6 h-6" />,      color: '#10B981', premium: false },
                    { id: 'monolith',       label: 'Monolith',      desc: 'Solid opaque · Minimal', icon: <Layout className="w-6 h-6" />,   color: '#10B981', premium: false },
                    { id: 'neon_relic',     label: 'Neon Relic',    desc: 'Brutalist · Cyan',       icon: <Flame className="w-6 h-6" />,    color: '#00ffff', premium: true },

                    // COLOR VARIANTS
                    { id: 'emerald', label: 'Emerald', desc: '#10b981', icon: <Leaf className="w-6 h-6" />,     color: '#10b981', premium: false },
                    { id: 'sky',     label: 'Sky',     desc: '#38bdf8', icon: <Cloud className="w-6 h-6" />,    color: '#38bdf8', premium: false },
                    { id: 'violet',  label: 'Violet',  desc: '#8b5cf6', icon: <Sparkles className="w-6 h-6" />, color: '#8b5cf6', premium: false },
                    { id: 'rose',    label: 'Rose',    desc: '#f43f5e', icon: <Heart className="w-6 h-6" />,    color: '#f43f5e', premium: false },
                    { id: 'orange',  label: 'Orange',  desc: '#f97316', icon: <Flame className="w-6 h-6" />,    color: '#f97316', premium: false },
                    { id: 'amber',   label: 'Amber',   desc: '#f59e0b', icon: <Star className="w-6 h-6" />,     color: '#f59e0b', premium: false },
                    { id: 'cyan',    label: 'Cyan',    desc: '#06b6d4', icon: <Activity className="w-6 h-6" />, color: '#06b6d4', premium: false },
                    { id: 'fuchsia', label: 'Fuchsia', desc: '#d946ef', icon: <Zap className="w-6 h-6" />,      color: '#d946ef', premium: false },
                    { id: 'zinc',    label: 'Zinc',    desc: '#a1a1aa', icon: <Layout className="w-6 h-6" />,   color: '#a1a1aa', premium: false },

                  ].filter(t => !t.premium || (user?.unlockedNexusThemes || []).includes(t.id)).map((t) => {
                    const isSelected = nexusTheme === t.id;
                    const isHovered = hoveredTheme === t.id;

                    return (
                      <motion.button
                        key={t.id}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => saveNexusTheme(t.id)}
                        onMouseEnter={() => setHoveredTheme(t.id)}
                        onMouseLeave={() => setHoveredTheme(null)}
                        className={`group relative flex items-center gap-4 w-full px-5 py-4 rounded-2xl border transition-all duration-150 text-left overflow-hidden cursor-pointer
                          ${isSelected
                            ? 'border-[var(--nexus-accent)]'
                            : 'border-[var(--nexus-border)]'
                          }`}
                        style={{
                          backgroundColor: isSelected
                            ? `${t.color}12`
                            : isHovered
                            ? `${t.color}16`
                            : 'var(--nexus-panel)',
                          borderColor: isSelected || isHovered ? t.color : undefined,
                          boxShadow: isSelected
                            ? `0 0 0 1px ${t.color}40, inset 0 0 30px ${t.color}08`
                            : isHovered
                            ? `0 4px 20px ${t.color}30`
                            : 'none',
                        }}
                      >
                        {/* Left accent bar — grows on hover */}
                        <div
                          className="absolute left-0 top-0 bottom-0 transition-all duration-150 rounded-l-2xl"
                          style={{
                            width: isSelected ? '4px' : isHovered ? '3px' : '0px',
                            backgroundColor: t.color,
                            boxShadow: isHovered || isSelected ? `0 0 8px ${t.color}` : 'none',
                          }}
                        />

                        {/* Background color wash sweeping in from the right */}
                        <div
                          className="absolute inset-0 pointer-events-none transition-all duration-200"
                          style={{
                            background: isHovered && !isSelected
                              ? `linear-gradient(to left, ${t.color}20, transparent 60%)`
                              : 'transparent',
                          }}
                        />

                        {/* Icon — fills with color on hover */}
                        <div
                          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-150 z-10"
                          style={{
                            backgroundColor: isSelected || isHovered ? t.color : 'var(--nexus-bg)',
                            borderColor: isSelected || isHovered ? t.color : 'var(--nexus-border)',
                            color: isSelected || isHovered ? '#fff' : t.color,
                            boxShadow: isSelected || isHovered ? `0 0 12px ${t.color}80` : 'none',
                          }}
                        >
                          {t.icon}
                        </div>

                        {/* Text — glows in theme color on hover */}
                        <div className="flex flex-col flex-1 min-w-0 z-10">
                          <span
                            className="text-[12px] font-black uppercase tracking-[0.1em] truncate transition-colors duration-150"
                            style={{ color: isSelected || isHovered ? t.color : 'var(--nexus-text)' }}
                          >{t.label}</span>
                          <span
                            className="text-[9px] font-mono tracking-widest uppercase mt-0.5 truncate transition-colors duration-150"
                            style={{ color: isHovered ? `${t.color}cc` : 'var(--nexus-text-muted)', opacity: isHovered ? 1 : 0.7 }}
                          >{t.desc}</span>
                        </div>

                        {/* Right badges */}
                        <div className="shrink-0 flex items-center gap-2 z-10">
                          {t.premium && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                              <Crown className="w-3 h-3 text-yellow-500" />
                              <span className="text-[7px] font-black uppercase tracking-widest text-yellow-600">Pro</span>
                            </div>
                          )}
                          {isSelected ? (
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: t.color }}
                            >
                              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                            </div>
                          ) : isHovered ? (
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-150"
                              style={{ borderColor: t.color, color: t.color }}
                            >
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </div>
                          ) : null}
                        </div>

                        {/* Decorative corner shard — theme color accent */}
                        <div
                          className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none transition-all duration-200"
                          style={{
                            background: isHovered || isSelected
                              ? `linear-gradient(135deg, transparent 50%, ${t.color}25 100%)`
                              : 'transparent',
                          }}
                        />
                      </motion.button>
                  );
                })}
              </div>
            </div>

                {/* Prompt to visit store if user has no premium themes */}
                {(user?.unlockedNexusThemes || []).length === 0 && (
                  <div className="mt-10 flex flex-col items-center gap-3 text-center py-8 border border-dashed border-white/10 rounded-3xl">
                    <Crown className="w-8 h-8 text-yellow-400 opacity-50" />
                    <p className="text-sm font-black uppercase italic tracking-wider text-[var(--nexus-text-muted)]">No Premium Environments Unlocked</p>
                    <p className="text-[10px] text-[var(--nexus-text-muted)] opacity-60 max-w-xs">Head to the <button onClick={() => setActiveSection && setActiveSection('store')} className="text-[var(--nexus-accent)] font-bold hover:underline transition-colors px-1 py-0.5 rounded hover:bg-[var(--nexus-accent)]/10">Store</button> tab to browse and purchase elite live themes for your dashboard.</p>
                  </div>
                )}

                {/* End of Unified Matrix. The Color Spectrum grid is officially retired and merged heavily into the main deck. */}
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
                    <div className="flex flex-col">
                      <h2 className="text-3xl font-black italic tracking-tighter text-[var(--nexus-text)]">PARTNER PACK</h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--nexus-text-muted)] opacity-50 mt-1">Architect your stream's signature visual signals.</p>
                    </div>
                  </div>
                </div>

                <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 ${!isTierEligible ? 'opacity-20 grayscale pointer-events-none' : ''}`}>
                  {partnerStickers?.map((sticker, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -5 }}
                      onClick={() => {
                        setEditingStickerIdx(idx);
                        setTempStickerData({ ...sticker });
                      }}
                      className={`group relative p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 flex flex-col items-center justify-center gap-4 ${theme === 'dark'
                        ? 'bg-[#0a0a0a] border-white/5 hover:border-[var(--nexus-accent)]/40 shadow-xl'
                        : 'bg-white border-slate-100 shadow-lg hover:border-[var(--nexus-accent)]/40'
                        }`}
                    >
                      <div className="w-20 h-20 flex items-center justify-center">
                        {sticker.lottieUrl ? (
                          <Player
                            autoplay
                            loop
                            src={sticker.lottieUrl}
                            style={{ height: '100%', width: '100%' }}
                          />
                        ) : (
                          <span className="text-5xl drop-shadow-2xl">{sticker.emoji || '💎'}</span>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black uppercase italic tracking-widest text-[var(--nexus-accent)]">₹{sticker.minAmount || 0}</span>
                        <span className="text-[8px] font-black uppercase tracking-tighter text-[var(--nexus-text-muted)] opacity-30">Threshold</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeStickerSlot(idx);
                        }}
                        className="absolute -top-3 -right-3 p-2.5 bg-rose-500 text-white rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setEditingStickerIdx(-1);
                      setTempStickerData({ emoji: '✨', lottieUrl: '', minAmount: 100 });
                    }}
                    className="p-8 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all border-[var(--nexus-border)] text-[var(--nexus-text-muted)] hover:border-[var(--nexus-accent)] hover:text-[var(--nexus-accent)]/80 hover:bg-[var(--nexus-accent)]/5 min-h-[160px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-[var(--nexus-border)]/5 flex items-center justify-center">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest">Add Sticker</span>
                  </motion.button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={savePartnerPack}
                    disabled={isSavingStickers || !isTierEligible}
                    className={`flex-1 py-5 rounded-[1.5rem] font-black uppercase italic tracking-[0.2em] text-[11px] shadow-2xl flex items-center justify-center gap-3 transition-all ${theme === 'dark'
                      ? 'bg-[var(--nexus-accent)] text-black hover:brightness-110 shadow-[var(--nexus-accent)]/20'
                      : 'bg-slate-900 text-white hover:bg-[var(--nexus-accent)]'
                      } disabled:opacity-30 hover:scale-[1.01]`}
                  >
                    {isSavingStickers ? <Activity className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                  </button>
                </div>
              </div>

              {/* STICKER EDIT MODAL - ELITE INTERFACE */}
              <AnimatePresence>
                {editingStickerIdx !== null && tempStickerData && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setEditingStickerIdx(null)}
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      className={`relative w-full max-w-md p-8 rounded-[2.5rem] border-2 shadow-2xl z-10 ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-100'
                        }`}
                    >
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)]">
                          <Rocket className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xl font-black uppercase italic tracking-tighter">Signal Calibration</h4>
                          <p className="text-[8px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] opacity-50">Configure signature Lottie asset</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Preview Area */}
                        <div className={`w-full aspect-square rounded-[2rem] flex items-center justify-center overflow-hidden border ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-100'
                          }`}>
                          {tempStickerData.lottieUrl ? (
                            <Player
                              autoplay
                              loop
                              src={tempStickerData.lottieUrl}
                              style={{ height: '240px', width: '240px' }}
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-3 opacity-20">
                              <Rocket className="w-12 h-12" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Awaiting Uplink</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5 text-left">
                            <label className="text-[9px] font-black uppercase text-indigo-500 tracking-widest ml-2">Lottie JSON Endpoint / Upload</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={tempStickerData.lottieUrl || ''}
                                onChange={(e) => setTempStickerData({ ...tempStickerData, lottieUrl: e.target.value })}
                                placeholder="https://lottie.host/..."
                                className={`flex-1 p-4 rounded-2xl text-[11px] font-black tracking-wider transition-all border outline-none ${theme === 'dark'
                                  ? 'bg-black/60 border-white/5 focus:border-[var(--nexus-accent)]/50 text-white'
                                  : 'bg-white border-slate-100 focus:border-[var(--nexus-accent)]/50 text-slate-900'
                                  }`}
                              />
                              <input
                                type="file"
                                ref={jsonInputRef}
                                className="hidden"
                                accept=".json"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      try {
                                        // Verify if it's valid JSON
                                        JSON.parse(event.target.result);
                                        setTempStickerData({ ...tempStickerData, lottieUrl: event.target.result });
                                      } catch (e) {
                                        toast.error("Invalid Lottie JSON file");
                                      }
                                    };
                                    reader.readAsText(file);
                                  }
                                }}
                              />
                              <button
                                onClick={() => jsonInputRef.current?.click()}
                                className={`px-4 rounded-2xl border transition-all flex items-center justify-center hover:bg-[var(--nexus-accent)] hover:text-black ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-slate-50 border-slate-100 text-slate-600'
                                  }`}
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-indigo-500 tracking-widest ml-2">Min Amount (₹)</label>
                              <input
                                type="number"
                                value={tempStickerData.minAmount || ''}
                                onChange={(e) => setTempStickerData({ ...tempStickerData, minAmount: Number(e.target.value) })}
                                className={`w-full p-4 rounded-2xl text-[11px] font-black tracking-wider transition-all border outline-none ${theme === 'dark'
                                  ? 'bg-black/60 border-white/5 focus:border-indigo-500/50 text-white'
                                  : 'bg-white border-slate-100 focus:border-indigo-500/50 text-slate-900'
                                  }`}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-indigo-500 tracking-widest ml-2">Alt Emoji</label>
                              <input
                                type="text"
                                value={tempStickerData.emoji || ''}
                                onChange={(e) => setTempStickerData({ ...tempStickerData, emoji: e.target.value })}
                                placeholder="💎"
                                className={`w-full p-4 rounded-2xl text-[14px] font-black text-center transition-all border outline-none ${theme === 'dark'
                                  ? 'bg-black/60 border-white/5 focus:border-indigo-500/50 text-white'
                                  : 'bg-white border-slate-100 focus:border-indigo-500/50 text-slate-900'
                                  }`}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => setEditingStickerIdx(null)}
                            className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (updatePartnerPack) {
                                if (editingStickerIdx === -1) {
                                  updatePartnerPack([...partnerStickers, tempStickerData]);
                                } else {
                                  const newStickers = [...partnerStickers];
                                  newStickers[editingStickerIdx] = tempStickerData;
                                  updatePartnerPack(newStickers);
                                }
                              }
                              setEditingStickerIdx(null);
                            }}
                            className="flex-1 py-4 bg-[var(--nexus-accent)] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 shadow-xl shadow-[var(--nexus-accent)]/20 transition-all hover:scale-[1.02]"
                          >
                            Save Config
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
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
              <div className={`p-6 md:p-8 rounded-[2rem] border transition-all ${getStudioStyle()}`}>
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
                    <motion.button
                      key={style.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStyleSwitch(style.id, 'leaderboardStyle')}
                      className={`group relative flex flex-row items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-500 shadow-lg
                  ${(alertConfig?.leaderboardStyle || 'royal_throne') === style.id
                          ? 'border-[var(--nexus-accent)] bg-[var(--nexus-panel)] shadow-[var(--nexus-glow)]'
                          : 'border-[var(--nexus-border)] bg-[var(--nexus-panel)] hover:border-[var(--nexus-accent)]/50 hover:shadow-xl'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${(alertConfig?.leaderboardStyle || 'royal_throne') === style.id
                        ? 'bg-[var(--nexus-accent)] text-black shadow-lg'
                        : 'bg-[var(--nexus-panel)] text-[var(--nexus-text-muted)] group-hover:bg-[var(--nexus-accent)]/20 group-hover:text-[var(--nexus-accent)]'
                        }`}>
                        {style.icon}
                      </div>
                      <div className="flex flex-col text-left gap-0.5">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${(alertConfig?.leaderboardStyle || 'royal_throne') === style.id
                          ? 'text-[var(--nexus-accent)]'
                          : 'text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-text)]'
                          }`}>
                          {style.label}
                        </span>
                        <p className="text-[8px] font-bold italic text-[var(--nexus-text-muted)] opacity-60 leading-relaxed">
                          {style.desc}
                        </p>
                      </div>
                      {(alertConfig?.leaderboardStyle || 'royal_throne') === style.id && (
                        <div className="absolute top-5 right-5 text-[var(--nexus-accent)]">
                          <Check className="w-5 h-5 animate-bounce" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div >
  );
};

const areEqual = (prev, next) => (
  prev.goalForm === next.goalForm &&
  prev.alertConfig === next.alertConfig &&
  prev.nexusTheme === next.nexusTheme &&
  prev.partnerStickers === next.partnerStickers &&
  prev.isUpdatingGoal === next.isUpdatingGoal &&
  prev.isSavingStickers === next.isSavingStickers &&
  prev.copiedType === next.copiedType &&
  prev.theme === next.theme &&
  prev.user?._id === next.user?._id &&
  prev.user?.tier === next.user?.tier
);

export default React.memo(ControlCenter, areEqual);
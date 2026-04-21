import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { List } from 'react-window';
import { InView } from 'react-intersection-observer';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Player } from '@lottiefiles/react-lottie-player';

// Global API & Protocol Nodes
import axios from '../../api/axios';

// Component Widgets
import CyberGoalBar from '../widgets/GoalBar';
import PremiumGoalOverlays from '../widgets/GoalOverlays';
import TopSupporterWidget from '../widgets/TopSupporterWidget';
import EliteCard from '../common/EliteCard';

import {
  Wallet, BarChart3, Target, TrendingUp, Loader2, Zap, Send, ShieldCheck, IndianRupee, Sparkles,
  CheckCircle, Trophy, User, Crown, UserCircle, AlertCircle
} from 'lucide-react';

const PREMIUM_GOAL_STYLES = [
  'black_hole', 'hex_core', 'rune_monolith', 'hologram_glitch',
  'alchemist_flask', 'redline_dash', 'loot_dispenser', 'mecha_lens'
];

const LOTTIE_STICKER_MAP = {
  // Legacy IDs
  zap: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json',
  fire: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/lottie.json',
  heart: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f496/lottie.json',
  crown: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f451/lottie.json',
  rocket: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json',
  party_popper: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/lottie.json',
  star: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/lottie.json',
  diamond: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f48e/lottie.json',
  gold_bar: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f237/lottie.json',
  coins: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1fa99/lottie.json',
  trophy: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/lottie.json',

  // New Synchronized IDs
  hype_zap: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json',
  fire_rocket: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json',
  super_heart: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/lottie.json',
  alien_visit: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f47d/lottie.json',
  driving_car: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f697/lottie.json',
  football_goal: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26bd/lottie.json',
  flying_bird: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f426/lottie.json',
  gold_trophy: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/lottie.json',
  diamond_gem: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f48e/lottie.json',
};

const runnerMap = {
  star: LOTTIE_STICKER_MAP.star,
  rocket: LOTTIE_STICKER_MAP.rocket,
  fire: LOTTIE_STICKER_MAP.fire,
  car: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f697/lottie.json'
};

const Summary = ({
  theme, user, chartData, timeRange, setTimeRange,
  topDonors, recentDrops, handleWithdrawRequest,
  isProcessingWithdraw, getProgressPercentage,
  nexusTheme, setShowWithdrawModal
}) => {

  const getChartDataWithDates = () => {
    return chartData.map((val, index) => {
      const daysAgo = chartData.length - 1 - index;
      const d = new Date();
      let label = '';
      if (timeRange === '1Y') {
        d.setMonth(d.getMonth() - daysAgo);
        label = d.toLocaleString('en-US', { month: 'short' });
      } else {
        d.setDate(d.getDate() - daysAgo);
        label = d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
      }
      return {
        name: label,
        value: val,
        fullDate: d.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
      };
    });
  };

  const formattedChartData = getChartDataWithDates();
  const periodTotal = chartData.reduce((a, b) => a + b, 0);
  
  const midPoint = Math.floor(chartData.length / 2);
  const firstHalfTotal = chartData.slice(0, midPoint).reduce((a, b) => a + b, 0);
  const secondHalfTotal = chartData.slice(midPoint).reduce((a, b) => a + b, 0);
  
  let gainPercent = 0;
  if (firstHalfTotal === 0 && secondHalfTotal > 0) gainPercent = 100;
  else if (firstHalfTotal > 0) gainPercent = ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100;
  const isPositiveGain = gainPercent >= 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md text-[#111111] p-3 rounded-xl shadow-2xl border border-black/5 pointer-events-none z-50">
          <p className="text-[10px] text-slate-400 mb-1 font-mono uppercase tracking-widest">{payload[0].payload.fullDate}</p>
          <p className="text-sm font-black flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            {payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  const stickerFallback = {
    zap: '⚡', fire: '🔥', heart: '💖', crown: '👑', rocket: '🚀',
    party_popper: '🎉', star: '⭐', diamond: '💎', gold_bar: '🪙',
    hype_zap: '⚡', fire_rocket: '🚀', super_heart: '💖', alien_visit: '👽',
    driving_car: '🚗', football_goal: '⚽', flying_bird: '🐦', gold_trophy: '🏆',
    diamond_gem: '💎'
  };

  const getCardStyle = () => {
    if (nexusTheme === 'neon_relic') return 'relic-surface font-mono text-white';
    return 'bg-[var(--nexus-panel)] border-[var(--nexus-border)] text-[var(--nexus-text)] shadow-[var(--nexus-glow)] nexus-card';
  };

  const handleReportIssue = async (drop) => {
    if (drop.isTest) {
        toast.info("Test protocol deposits cannot be mediated.", { style: { background: '#050505', color: '#3b82f6', border: '1px solid #3b82f620' }});
        return;
    }
    const reason = window.prompt("State the reason for mediation (e.g., Suspicious Node, Chargeback Risk):");
    if (!reason || !reason.trim()) return;
    
    try {
        await axios.post(`/api/user/transactions/${drop._id}/dispute`, { reason }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success("Flagged for Admin Mediation", { style: { background: '#050505', color: '#10b981', border: '1px solid #10b98120' }});
    } catch (err) {
        toast.error(err.response?.data?.msg || "Mediation protocol failed.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl mx-auto pt-4">

      {/* LEFT COLUMN: ANALYTICS & PROGRESS */}
      <div className="col-span-1 lg:col-span-8 space-y-6">

        {/* TOP ROW: NEURAL PROFILE & ATOMIC BALANCE (AERO-GLASS PROTOCOL) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* WIDGET 1: NEURAL PROFILE (IDENTITY NODE) */}
          {user?.ownedWidgets?.includes('user_profile') ? (
            <div className="md:col-span-4" style={{ perspective: '1000px' }}>
              <div className="aero-widget scanner-active w-full h-full min-h-[240px] relative border-[var(--nexus-border)] border overflow-hidden p-6 flex flex-col items-center justify-center group"
                style={{
                  backdropFilter: 'blur(35px) saturate(200%)',
                  clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                  background: 'rgba(255, 255, 255, 0.05)'
                }}>
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#3b82f6] animation-delay-200"></div>
                  <div className="absolute -inset-4 rounded-full border border-[#3b82f6]/30 animate-[spin_8s_linear_infinite]"></div>
                  <div className="w-24 h-24 rounded-full border-2 border-[#3b82f6]/50 p-1 flex items-center justify-center relative z-10 bg-[var(--nexus-bg)] shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center bg-[#3b82f6]/10 text-[#3b82f6] text-4xl font-black italic border border-[#3b82f6]/30 shadow-inner">
                        {user.fullName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-black tracking-widest text-[var(--nexus-text)] truncate w-full text-center hover:text-[#3b82f6] transition-colors">{user.username}</h3>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-4 text-center w-full">
                  <p className="font-mono text-[10px] tracking-widest text-[#3b82f6] drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]"><ShieldCheck className="w-3 h-3 inline mr-1" />STATUS: VERIFIED</p>
                  <p className="font-mono text-[8px] text-[var(--nexus-text-muted)] mt-1 flex items-center justify-center gap-1"><User className="w-2.5 h-2.5 opacity-50" /> ID: USER-{user.streamerId?.slice(-6).toUpperCase() || 'CORE'}</p>
                </div>
              </div>
            </div>
          ) : (
            <EliteCard
              whileHover={{ scale: 1.01, z: 10 }}
              className={`md:col-span-4 flex flex-col items-stretch border relative overflow-hidden h-[240px] transition-all duration-700 ${nexusTheme === 'neon_relic' ? 'rounded-none relic-surface' : 'rounded-[var(--nexus-radius)]'} nexus-card`}
            >
              {/* Profile Image Section (Top 72%) */}
              <div className="w-full h-[72%] relative overflow-hidden group/avatar flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover/avatar:grayscale-0 transition-all duration-1000 scale-105 group-hover/avatar:scale-100"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--nexus-accent)]/20 to-[#070707] text-[var(--nexus-text)] text-4xl font-black italic tracking-tighter">
                    {user.fullName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Visual Overlays (Removed profile shadow for cleaner layout) */}                
                {nexusTheme === 'neon_relic' && (
                  <>
                    <div className="plasma-leak-cyan top-0 left-0 -mt-2 -ml-2 opacity-40"></div>
                    <div className="holo-sticker top-2 left-4 rotate-[-5deg] z-20 scale-50 origin-top-left">ID: RELIC</div>
                  </>
                )}
                
                {/* User ID Overlay (Top Right) */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-20 bg-black/40 backdrop-blur-xl px-2 py-1 rounded-full border border-white/5">
                  <User className="w-2 h-2 text-[var(--nexus-accent)] opacity-80" />
                  <span className="text-[7px] font-mono text-white/90 tracking-widest uppercase">
                    ID-{user.streamerId?.slice(-6).toUpperCase() || 'CORE'}
                  </span>
                </div>
              </div>

              {/* Identity Details Section (Bottom 28%) */}
              <div className={`w-full h-[28%] p-3 flex flex-col justify-center items-center relative z-20 flex-shrink-0 border-t`}>
                <div className="space-y-1 w-full text-center">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className={`text-xl font-black uppercase italic tracking-tighter leading-none ${nexusTheme === 'neon_relic' ? 'font-mono text-cyan-400 relic-text-glow' : 'text-[var(--nexus-text)]'}`}>
                        {user.fullName || user.username}
                      </h3>
                      {user.tier === 'legend' && <Crown className="w-4 h-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />}
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--nexus-accent)] block">
                      {user.tier || 'Starter'}
                    </p>
                  </div>
                </div>
              </div>
            </EliteCard>
          )}

          {/* WIDGET 2: WALLET BALANCE (REVENUE SUMMARY) */}
          {user?.activeRevenueWidget === 'wallet_balance' ? (
            <div className="md:col-span-8" style={{ perspective: '1000px' }}>
              <div className="aero-widget border border-[var(--nexus-border)] w-full h-[240px] relative overflow-hidden p-6 md:p-8 flex flex-col justify-between group"
                style={{ backdropFilter: 'blur(35px) saturate(200%)', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--nexus-radius)' }}>

                {/* Liquid Mesh Gradient */}
                <div className="liquid-mesh-glow absolute inset-0 opacity-20 pointer-events-none transition-transform duration-[3s] group-hover:scale-125 group-hover:rotate-3" style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, rgba(59, 130, 246, 0.6), transparent 70%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.4), transparent 50%)' }}></div>
                {/* Static Noise Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1 sm:gap-2 bg-[#3b82f6]/10 px-2 sm:px-3 py-1.5 rounded-full border border-[#3b82f6]/20 backdrop-blur-md shrink-0">
                    <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-[#3b82f6]" />
                    <span className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest sm:tracking-[0.3em] text-[#3b82f6] whitespace-nowrap">Current Balance</span>
                  </div>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    disabled={isProcessingWithdraw || (Number(user.walletBalance) || 0) < 1000}
                    className={`px-3 sm:px-6 py-2.5 text-[8px] sm:text-[10px] uppercase font-black tracking-widest rounded-full transition-all duration-300 border backdrop-blur-lg shrink-0 ${(Number(user.walletBalance) || 0) >= 1000 ? 'bg-[#3b82f6] border-[#3b82f6] text-white hover:brightness-110 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-105' : 'bg-[var(--nexus-panel)] border-[var(--nexus-border)] text-[var(--nexus-text-muted)] cursor-not-allowed opacity-50'}`}
                  >
                    {isProcessingWithdraw ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Withdraw <span className="hidden sm:inline">Funds</span> <Send className="w-3 h-3 inline ml-1 opacity-80" /></>}
                  </button>
                </div>

                <div className="relative z-10 mt-1 mb-1 flex items-center gap-2 group-hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-500">
                  <div className="overflow-hidden h-[60px] relative w-full flex items-center">
                    <AnimatePresence mode="popLayout">
                      <motion.h2
                        key={user.walletBalance}
                        initial={{ y: 50, opacity: 0, rotateX: -90 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: -50, opacity: 0, rotateX: 90 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className={`text-4xl md:text-5xl font-black italic tracking-tighter absolute ${nexusTheme === 'neon_relic' ? 'relic-text-glow' : 'text-[var(--nexus-text)]'}`}
                      >
                        ₹{user.walletBalance?.toLocaleString('en-IN') || '0.00'}
                      </motion.h2>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="relative z-10 flex justify-center items-end mt-auto origin-center transform transition-transform group-hover:scale-[1.02]">
                  <div className="flex flex-col text-center">
                    <span className="text-[7px] md:text-[8px] uppercase font-black tracking-widest text-[var(--nexus-text-muted)] mb-1">Monthly Net <TrendingUp className="w-3 h-3 inline ml-1 text-[var(--nexus-accent)]" /></span>
                    <span className="text-base md:text-xl font-mono font-bold text-[var(--nexus-text)] drop-shadow-md">₹{user.financialMetrics?.monthlyNetEarnings?.toLocaleString('en-IN') || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EliteCard disableHover={true} className={`md:col-span-8 flex flex-col justify-center p-6 sm:p-8 rounded-[var(--nexus-radius)] border relative overflow-hidden h-[240px] transition-all duration-500 nexus-card`}
            >
              {nexusTheme === 'neon_relic' && (
                <>
                  <div className="plasma-leak-cyan top-0 right-0 -mt-2 -mr-2"></div>
                  <div className="plasma-leak-magenta bottom-0 left-0 -mb-2 -ml-2"></div>
                  <div className="holo-sticker top-6 right-8">ACCOUNT SECURE</div>
                </>
              )}
              {/* Visual Accent Backdrops */}
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-[var(--nexus-accent)]/20 rounded-full blur-[80px] opacity-40 pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[var(--nexus-accent)]/10 rounded-full blur-[80px] opacity-30 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-2 bg-[var(--nexus-panel)]/40 px-2 sm:px-3 py-1.5 rounded-full border border-[var(--nexus-accent)]/20 backdrop-blur-md shrink-0">
                  <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--nexus-accent)]" />
                  <h3 className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest sm:tracking-[0.3em] text-[var(--nexus-accent)] whitespace-nowrap">Current Balance</h3>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={isProcessingWithdraw || (Number(user.walletBalance) || 0) < 1000}
                  className={`px-3 sm:px-6 py-2.5 rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border shrink-0 ${(Number(user.walletBalance) || 0) >= 1000 ? 'bg-[var(--nexus-accent)] text-slate-900 border-[var(--nexus-accent)] hover:brightness-110 shadow-[0_0_20px_var(--nexus-accent-glow)] scale-105' : 'bg-[var(--nexus-panel)] border-[var(--nexus-border)] text-[var(--nexus-text-muted)] cursor-not-allowed opacity-50'}`}
                >
                  {isProcessingWithdraw ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Withdraw <span className="hidden sm:inline">Funds</span> <Send className="w-3 h-3 opacity-80" /></>}
                </button>
              </div>

              <div className="flex items-baseline gap-3 mb-6 relative z-10">
                <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter ${nexusTheme === 'neon_relic' ? 'relic-text-glow' : 'text-[var(--nexus-text)]'}`}>
                  ₹{user.walletBalance?.toLocaleString('en-IN') || '0.00'}
                </h2>
              </div>

              <div className="flex justify-center items-end mt-auto relative z-10">
                <div className="flex flex-col text-center">
                  <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] opacity-60 mb-1">Monthly Net <TrendingUp className="w-3 h-3 inline ml-1 text-[var(--nexus-accent)]" /></span>
                  <span className="text-base sm:text-lg font-mono font-bold text-[var(--nexus-text)] drop-shadow-md">₹{user.financialMetrics?.monthlyNetEarnings?.toLocaleString('en-IN') || '0'}</span>
                </div>
              </div>
            </EliteCard>
          )}
        </div>

        {/* ANALYTICS DATA STREAM (Revenue Chart) */}
        <EliteCard
          className={`group border p-0 relative transition-all duration-500 overflow-hidden ${nexusTheme === 'neon_relic' ? 'rounded-none relic-surface flex flex-col' : 'rounded-[var(--nexus-radius)] flex flex-col'} nexus-card`}
        >
          {nexusTheme === 'neon_relic' && (
            <>
              <div className="plasma-leak-cyan top-0 right-0 -mt-2 -mr-2"></div>
              <div className="plasma-leak-magenta bottom-0 left-0 -mb-2 -ml-2"></div>
              <div className="holo-sticker bottom-6 right-8 rotate-[5deg] z-0">TELEMETRY</div>
            </>
          )}

          {/* Top Info Area */}
          <div className="p-6 md:p-8 relative z-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <h3 className="text-sm md:text-base font-black text-[var(--nexus-text)] tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-[var(--nexus-accent)] opacity-80" />
                Total revenue
                <Sparkles className="w-3 h-3 text-[var(--nexus-accent)] ml-1" />
              </h3>
              <div className="flex bg-[var(--nexus-panel)] rounded-xl border border-[var(--nexus-border)] shadow-sm p-1">
                {['7D', '1M', '1Y'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`relative px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors duration-300 ${
                      timeRange === range ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text-muted)] hover:text-[var(--nexus-text)]'
                    }`}
                  >
                    {timeRange === range && (
                      <motion.div
                        layoutId="activeTimeRange"
                        className="absolute inset-0 bg-[var(--nexus-bg)] rounded-lg shadow-[0_0_15px_rgba(var(--nexus-accent-rgb),0.2)] border border-[var(--nexus-border)] z-0"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">
                      {range === '7D' ? 'Weekly' : range === '1M' ? 'Monthly' : 'Yearly'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4 mt-2 mb-1">
              <div className="flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={timeRange}
                    initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center"
                  >
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-[var(--nexus-text)] flex items-center">
                      <IndianRupee className="w-7 h-7 md:w-8 md:h-8 -mr-1 text-[var(--nexus-accent)]" strokeWidth={3} />
                      {periodTotal.toLocaleString('en-IN')}
                    </h2>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.div 
                key={`${timeRange}-gain`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-black flex items-center gap-1.5 border backdrop-blur-md shadow-lg ${
                  isPositiveGain 
                    ? 'bg-green-500/10 text-green-500 border-green-500/30 shadow-green-500/5' 
                    : 'bg-red-500/10 text-red-500 border-red-500/20 border-red-500/30'
                }`}
              >
                <TrendingUp className={`w-3 h-3 ${!isPositiveGain && 'rotate-180'}`} strokeWidth={3} />
                {Math.abs(gainPercent).toFixed(2)}%
              </motion.div>
            </div>

            <p className="text-[10px] md:text-xs text-[var(--nexus-text-muted)] font-medium">
              {isPositiveGain ? 'Gained' : 'Lost'} <IndianRupee className="w-2.5 h-2.5 inline-block -mt-0.5"/>{Math.abs(secondHalfTotal - firstHalfTotal).toLocaleString('en-IN')} in the latter half of this period
            </p>
          </div>

          {/* Recharts Area */}
          <div className="w-full h-[140px] md:h-[180px] mt-auto relative z-10 px-2 sm:px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--nexus-accent)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--nexus-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--nexus-border)" opacity={0.4} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--nexus-text-muted)', fontSize: 10, fontWeight: 500 }}
                  dy={10}
                  minTickGap={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--nexus-text-muted)', fontSize: 10, fontWeight: 500 }}
                  tickFormatter={(val) => val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}
                  dx={-10}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: 'var(--nexus-accent)', strokeWidth: 1.5, strokeDasharray: '4 4' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#111111" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 6, fill: "#ffffff", stroke: "#111111", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* BGMI Bottom tech-HUD details */}
          {nexusTheme === 'bgmi' && (
            <div className="mt-auto px-6 pb-4 flex justify-between items-center relative z-20">
              <span className="bg-[var(--nexus-accent)] text-[var(--nexus-panel)] px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">Analytics Node: Active</span>
              <span className="text-[var(--nexus-text-muted)] font-mono text-[10px]">SEC-77</span>
            </div>
          )}

          <BarChart3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-[0.03] pointer-events-none transition-colors text-[var(--nexus-accent)] z-0" />
        </EliteCard>

        {/* MISSION STATUS (Goal Bar) */}
        {user.goalSettings?.isActive !== false && (
          <div className="w-full flex justify-center items-center pt-2 pb-6 relative z-10">
            {PREMIUM_GOAL_STYLES.includes(user.goalSettings?.stylePreference) ? (
              <PremiumGoalOverlays
                goal={{
                  title: user.goalSettings?.title || "Active Goal",
                  currentProgress: user.goalSettings?.currentProgress || 0,
                  targetAmount: user.goalSettings?.targetAmount || 100,
                  stylePreference: user.goalSettings?.stylePreference
                }}
                percentage={getProgressPercentage()}
                isComplete={getProgressPercentage() >= 100}
              />
            ) : (
              <CyberGoalBar
                goal={{ title: user.goalSettings?.title || "Active Goal", currentProgress: user.goalSettings?.currentProgress || 0, targetAmount: user.goalSettings?.targetAmount || 100 }}
                tier={user.tier || 'starter'}
                runnerUrl={
                  user.goalSettings?.runnerType === 'custom'
                    ? user.goalSettings?.customRunnerUrl
                    : (runnerMap[user.goalSettings?.runnerType] || runnerMap.star)
                }
                percentage={getProgressPercentage()}
                isComplete={getProgressPercentage() >= 100}
                goalStylePreference={user.goalSettings?.stylePreference || 'modern'}
              />
            )}
          </div>
        )}

      </div>

      {/* RIGHT COLUMN: RECENT SIGNAL & HALL OF FAME */}
      <div className="col-span-1 lg:col-span-4 space-y-6">

        {/* WIDGET 3: TOP SUPPORTERS (COMMUNITY HUB) */}
        {user?.ownedWidgets?.includes('elite_nexus') ? (
          <div style={{ perspective: '1000px' }} className="mb-4">
            <div className="aero-widget border border-[var(--nexus-border)] h-[330px] py-5 relative overflow-hidden"
              style={{ backdropFilter: 'blur(35px) saturate(200%)', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--nexus-radius)' }}>
              <h3 className="text-[10px] px-5 font-black uppercase tracking-widest text-[#3b82f6] mb-4 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"><Crown className="w-3 h-3" /> <Trophy className="w-3 h-3" /> Top Supporters</h3>

              <div className="flex overflow-hidden relative w-full h-12">
                <div className="flex animate-[ticker-loop_25s_linear_infinite] w-max gap-4 px-4 items-center hover:[animation-play-state:paused]">
                  {topDonors?.length > 0 ? (
                    [...topDonors, ...topDonors, ...topDonors].map((donor, idx) => {
                      const isTop = idx === 0 || (idx >= topDonors?.length && (idx % topDonors?.length) === 0);
                      return (
                        <div key={idx} className="group relative flex items-center shrink-0 cursor-pointer h-10" style={{ transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                          <div className={`h-10 rounded-full flex items-center justify-center border transition-all duration-400 w-10 overflow-hidden group-hover:w-[160px] group-hover:justify-start group-hover:px-2 bg-black/40 ${isTop ? 'border-[#3b82f6] shadow-[0_0_20px_#3b82f6]' : 'border-[#3b82f6]/30 shadow-[0_0_8px_rgba(59,130,246,0.4)]'}`}>
                            <div className="shrink-0 w-6 h-6 flex items-center justify-center bg-[var(--nexus-panel)] rounded-full">
                              {donor.avatar ? <img src={donor.avatar} className="w-full h-full rounded-full" alt="DP" /> : <span className="text-sm">{isTop ? '🎇' : '🔹'}</span>}
                            </div>
                            <div className="hidden group-hover:flex items-center gap-2 ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex-1">
                              <span className="text-[10px] font-black tracking-widest text-white truncate">{donor.name || donor._id || 'Anonymous'}</span>
                              <CheckCircle className="w-3 h-3 text-[#3b82f6] shrink-0 ml-auto" />
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="w-full h-full flex items-center justify-center px-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6]/50 italic">
                      Awaiting connections
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 w-full">
            <TopSupporterWidget
              topSupporters={topDonors.map(d => ({
                name: d.name || d._id,
                amount: d.totalAmount || d.amount || d.total || 0,
                avatar: d.avatar || null
              })).sort((a, b) => b.amount - a.amount)}
              stylePreference={user?.overlaySettings?.leaderboardStyle || 'classic_chart'}
            />
          </div>
        )}

        {/* ACTIVITY SIGNAL FEED */}
        {/* ACTIVITY SIGNAL FEED */}
        <EliteCard
          className={`group border p-0 transition-all duration-500 h-[380px] flex flex-col relative overflow-hidden ${nexusTheme === 'neon_relic' ? 'rounded-none relic-surface' : 'rounded-[var(--nexus-radius)]'} ${getCardStyle()}`}
        >
          {nexusTheme === 'neon_relic' && (
            <>
              <div className="plasma-leak-cyan top-0 right-0 -mt-2 -mr-2"></div>
              <div className="plasma-leak-magenta bottom-0 left-0 -mb-2 -ml-2"></div>
              <div className="holo-sticker top-6 right-8 rotate-[-10deg]">COMM LINK</div>
            </>
          )}
          {/* BGMI Specific HUD Elements */}
          {nexusTheme === 'bgmi' && (
            <div className="absolute top-0 left-0 w-1/3 h-1 bg-[var(--nexus-accent)] z-30" />
          )}

          {/* HEADER STRIP */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--nexus-border)] bg-[var(--nexus-panel)]/50 backdrop-blur-md relative z-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-md shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Live Feed</span>
              </div>
              <h3 className={`text-[11px] font-black italic uppercase tracking-tighter transition-colors ${nexusTheme === 'neon_relic' ? 'text-white' : 'text-[var(--nexus-text)]'}`}>
                Recent Tips
              </h3>
            </div>
            {recentDrops.length > 0 && (
              <span className="text-[10px] font-mono font-bold text-[var(--nexus-text-muted)] bg-[var(--nexus-bg)] px-2 py-0.5 rounded border border-[var(--nexus-border)]">
                x{recentDrops.length}
              </span>
            )}
          </div>

          <div className="space-y-3 overflow-y-auto p-4 custom-scrollbar flex-1 relative z-10 w-full">
            {recentDrops.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                {nexusTheme === 'neon_relic' ? (
                  <div className="relative w-32 h-32 border-2 border-slate-700 bg-[#1a1a1a] overflow-hidden flex items-center justify-center" style={{ imageRendering: 'pixelated' }}>
                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#555 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
                    <motion.div animate={{ top: ['-20%', '120%'] }} transition={{ duration: 2, ease: "linear", repeat: Infinity }} className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10" style={{ clipPath: 'polygon(0 0, 10% 100%, 20% 0, 30% 100%, 40% 0, 50% 100%, 60% 0, 70% 100%, 80% 0, 90% 100%, 100% 0)' }} />
                    <div className="relative z-20 px-2 py-1 bg-black border border-pink-500 text-pink-500 text-[10px] font-mono font-bold animate-pulse shadow-[0_0_10px_rgba(255,0,255,0.5)]">SCANNING</div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[var(--nexus-accent)]/20 animate-ping" />
                    <div className="relative w-12 h-12 rounded-full border border-[var(--nexus-accent)]/30 flex items-center justify-center bg-[var(--nexus-accent)]/5">
                      <Target className="w-5 h-5 text-[var(--nexus-accent)] animate-pulse" />
                    </div>
                  </div>
                )}
                <div className="space-y-1 mt-2">
                  <p className={`text-xs font-black uppercase tracking-widest ${nexusTheme === 'neon_relic' ? 'text-pink-500 font-mono' : 'text-[var(--nexus-text-muted)]'}`}>Awaiting Signals</p>
                  <p className={`text-[9px] font-bold italic tracking-tighter animate-pulse ${nexusTheme === 'neon_relic' ? 'text-emerald-500 font-mono drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]' : 'text-[var(--nexus-accent)] opacity-70'}`}>No contributions yet...</p>
                </div>
              </div>
            ) : (
              <List
                height={260}
                rowCount={recentDrops.length}
                rowHeight={88}
                rowProps={{ recentDrops, LOTTIE_STICKER_MAP, stickerFallback, nexusTheme }}
                rowComponent={({ index, style, recentDrops, LOTTIE_STICKER_MAP, stickerFallback, nexusTheme }) => {
                  const drop = recentDrops[index];
                  if (!drop) return null;
                  
                  const amount = Number(drop.amount) || 0;
                  let tierColor = 'bg-emerald-500';
                  let textTierColor = 'text-emerald-600 dark:text-emerald-400';
                  let bgTierColor = 'bg-emerald-500/5';
                  if (amount >= 1000) {
                    tierColor = 'bg-rose-500';
                    textTierColor = 'text-rose-600 dark:text-rose-400';
                    bgTierColor = 'bg-rose-500/5';
                  } else if (amount >= 500) {
                    tierColor = 'bg-amber-500';
                    textTierColor = 'text-amber-600 dark:text-amber-400';
                    bgTierColor = 'bg-amber-500/5';
                  }

                  const timeAgo = (() => {
                    if (!drop.createdAt) return 'Just now';
                    const diffMins = Math.round((new Date() - new Date(drop.createdAt)) / 60000);
                    if (diffMins < 1) return 'Just now';
                    if (diffMins < 60) return `${diffMins}m ago`;
                    const diffHours = Math.floor(diffMins / 60);
                    if (diffHours < 24) return `${diffHours}h ago`;
                    return `${Math.floor(diffHours / 24)}d ago`;
                  })();

                  return (
                    <div style={style} className="pr-2 pb-3">
                      <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
                        whileHover={{ x: 6, scale: 1.01 }}
                        className={`group/card relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${bgTierColor} border-[var(--nexus-border)] hover:border-[var(--nexus-text-muted)] dark:hover:border-white/20 shadow-sm hover:shadow-md h-full`}
                      >
                        {/* Status Accent Line */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${tierColor} opacity-70 group-hover/card:opacity-100 transition-opacity`} />
                        <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-${tierColor.split('-')[1]}-500/5 to-transparent -translate-x-full group-hover/card:animate-[shimmer_2s_infinite]`} />

                        {/* Left: Sticker & User Info */}
                        <div className="flex items-center gap-4 relative z-10 w-full overflow-hidden ml-1">
                          <div className={`flex-shrink-0 w-11 h-11 rounded-full ${nexusTheme === 'neon_relic' ? 'bg-[#111111] border border-slate-700' : 'bg-white dark:bg-black/40 border border-[var(--nexus-border)]'} flex items-center justify-center shadow-sm relative group-hover/card:scale-110 transition-transform duration-300`}>
                            <div className={`absolute inset-0 rounded-full ${tierColor} opacity-20 blur-md group-hover/card:opacity-40 transition-opacity`} />
                            {((drop.sticker && LOTTIE_STICKER_MAP[drop.sticker]) || (typeof drop.sticker === 'string' && drop.sticker.startsWith('http')) || drop.stickerUrl) ? (
                              <InView triggerOnce>
                                {({ inView, ref }) => (
                                  <div ref={ref} className="w-8 h-8 flex items-center justify-center relative z-10">
                                    {inView ? (
                                      <Player
                                        autoplay
                                        loop
                                        src={LOTTIE_STICKER_MAP[drop.sticker] || drop.sticker || drop.stickerUrl}
                                        style={{ width: '100%', height: '100%' }}
                                      />
                                    ) : (
                                      <span className="text-xl">{stickerFallback[drop.sticker] || '💎'}</span>
                                    )}
                                  </div>
                                )}
                              </InView>
                            ) : (
                              <span className="text-xl relative z-10">{stickerFallback[drop.sticker] || '💎'}</span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className={`font-black italic text-xs uppercase truncate ${nexusTheme === 'neon_relic' ? 'text-white' : 'text-[var(--nexus-text)]'} flex items-center gap-1.5`}>
                                <UserCircle className={`w-3.5 h-3.5 ${textTierColor}`} />
                                {drop.donorName}
                              </p>
                              {drop.isTest && (
                                <span className="px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[7px] rounded-sm uppercase font-black tracking-widest leading-none">Test</span>
                              )}
                            </div>
                            <p className="text-[10px] text-[var(--nexus-text-muted)] truncate italic font-bold max-w-[180px]">
                              "{drop.message}"
                            </p>
                          </div>
                        </div>

                        {/* Right: Amount & Controls */}
                        <div className="flex flex-col items-end gap-1 shrink-0 relative z-10">
                          <div className="flex items-center gap-3">
                            <AnimatePresence mode="popLayout">
                              <motion.p
                                key={drop.amount}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className={`font-black italic text-base md:text-lg tracking-tighter ${textTierColor} drop-shadow-sm flex items-center`}
                              >
                                ₹{drop.amount}
                              </motion.p>
                            </AnimatePresence>
                          </div>
                          
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-mono text-[var(--nexus-text-muted)] opacity-80">
                                {timeAgo}
                             </span>
                             <button
                               onClick={(e) => { e.stopPropagation(); handleReportIssue(drop); }}
                               title="Report Issue"
                               className="opacity-0 group-hover/card:opacity-100 p-1 rounded-md hover:bg-rose-500/10 text-[var(--nexus-text-muted)] hover:text-rose-500 transition-all duration-300 -mr-1"
                             >
                                <AlertCircle className="w-3.5 h-3.5" />
                             </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                }}
                className="custom-scrollbar"
              />
            )}
          </div>

          {/* BACKGROUND TEXTURE */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

          {/* BGMI Bottom tech-HUD details */}
          {nexusTheme === 'bgmi' && (
            <div className="mt-auto p-3 border-t border-[var(--nexus-border)] flex justify-between items-center relative z-20 bg-[var(--nexus-panel)]/50 backdrop-blur-md">
              <span className="bg-[var(--nexus-accent)] text-[var(--nexus-panel)] px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
                Signal Listeners
              </span>
              <span className="text-[var(--nexus-text-muted)] font-mono text-[10px]">
                Tactical-V2
              </span>
            </div>
          )}
        </EliteCard>
      </div>
    </div>
  );
};

export default React.memo(Summary);
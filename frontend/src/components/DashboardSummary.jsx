import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, BarChart3, Target, TrendingUp, Loader2, Zap, Activity, Send, ShieldCheck, IndianRupee, MessageSquare, Sparkles,
  CheckCircle, Award, Trophy, User, Crown, Smile, Volume2, Lock, UserCircle, Gift
} from 'lucide-react';
import CyberGoalBar from './CyberGoalBar';
import PremiumGoalOverlays from './PremiumGoalOverlays';
import { Player } from '@lottiefiles/react-lottie-player';
import TopSupporterWidget from './widgets/TopSupporterWidget';
import EliteCard from './EliteCard';

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

const DashboardSummary = ({
  theme, user, chartData, timeRange, setTimeRange,
  topDonors, recentDrops, handleWithdrawRequest,
  isProcessingWithdraw, getProgressPercentage,
  nexusTheme, setShowWithdrawModal
}) => {

  const stickerFallback = {
    zap: '⚡', fire: '🔥', heart: '💖', crown: '👑', rocket: '🚀',
    party_popper: '🎉', star: '⭐', diamond: '💎', gold_bar: '🪙',
    hype_zap: '⚡', fire_rocket: '🚀', super_heart: '💖', alien_visit: '👽',
    driving_car: '🚗', football_goal: '⚽', flying_bird: '🐦', gold_trophy: '🏆',
    diamond_gem: '💎'
  };

  const getCardStyle = () => {
    return 'bg-[var(--nexus-panel)] border-[var(--nexus-border)] text-[var(--nexus-text)] shadow-[var(--nexus-glow)] nexus-card';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl mx-auto pt-4">

      {/* LEFT COLUMN: TELEMETRY & PROGRESS */}
      <div className="col-span-1 lg:col-span-8 space-y-6">

        {/* TOP ROW: NEURAL PROFILE & ATOMIC BALANCE (AERO-GLASS PROTOCOL) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* WIDGET 1: NEURAL PROFILE (IDENTITY NODE) */}
          {user?.ownedWidgets?.includes('neural_profile') ? (
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
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-black tracking-widest text-[var(--nexus-text)] truncate w-full text-center hover:text-[#3b82f6] transition-colors">{user.username}</h3>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-4 text-center w-full">
                  <p className="font-mono text-[10px] tracking-widest text-[#3b82f6] drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]"><ShieldCheck className="w-3 h-3 inline mr-1" />NODE STATUS: SECURE</p>
                  <p className="font-mono text-[8px] text-[var(--nexus-text-muted)] mt-1 flex items-center justify-center gap-1"><User className="w-2.5 h-2.5 opacity-50" /> ID: DROP-{user.streamerId?.slice(-6).toUpperCase() || 'NODE'}</p>
                </div>
              </div>
            </div>
          ) : (
            <EliteCard
              whileHover={{ rotateY: 10, rotateX: 5, z: 50 }}
              style={{ perspective: '1200px' }}
              className={`md:col-span-4 flex flex-col items-center justify-center p-8 rounded-[3rem] border relative overflow-hidden h-full min-h-[280px] transition-all duration-700 ${getCardStyle()}`}
            >
              {/* Vertical Scanning Beam */}
              <motion.div
                animate={{
                  top: ['-10%', '110%'],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--nexus-accent)] to-transparent z-20 pointer-events-none blur-[1px]"
              />

              {/* Status Indicator (Top Right) */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[var(--nexus-text-muted)] opacity-50">Online</span>
              </div>

              {/* Avatar / Identity Node */}
              <div className="relative mb-6 group/avatar">
                {/* Breathing Glow */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -inset-4 rounded-full bg-[var(--nexus-accent)]/10 blur-xl"
                />

                <div className="w-24 h-24 rounded-full border-2 border-[var(--nexus-accent)]/40 p-1.5 relative z-10 bg-black/40 backdrop-blur-md shadow-[0_0_20px_var(--nexus-accent-glow)] flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-full h-full rounded-full object-cover grayscale-[0.3] group-hover/avatar:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--nexus-accent)]/20 to-transparent text-[var(--nexus-text)] text-4xl font-black italic tracking-tighter">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Identity Details */}
              <div className="text-center relative z-10 space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)] drop-shadow-md">
                    {user.fullName || user.username}
                  </h3>
                  {user.tier === 'legend' && <Crown className="w-4 h-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />}
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--nexus-accent)] mb-2">
                    {user.tier || 'Starter'} Unit
                  </p>

                  <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                    <User className="w-3 h-3 text-[var(--nexus-text-muted)]" />
                    <span className="text-[9px] font-mono font-bold tracking-widest text-[var(--nexus-text-muted)]">
                      NODE-{user.streamerId?.slice(-6).toUpperCase() || 'CORE'}
                    </span>
                  </div>
                </div>
              </div>
            </EliteCard>
          )}

          {/* WIDGET 2: ATOMIC BALANCE (REVENUE NODE) */}
          {user?.activeRevenueWidget === 'atomic_balance' ? (
            <div className="md:col-span-8" style={{ perspective: '1000px' }}>
              <div className="aero-widget border border-[var(--nexus-border)] w-full h-full min-h-[240px] relative overflow-hidden p-7 md:p-10 flex flex-col justify-between group"
                style={{ backdropFilter: 'blur(35px) saturate(200%)', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2.5rem' }}>

                {/* Liquid Mesh Gradient */}
                <div className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-[3s] group-hover:scale-125 group-hover:rotate-3" style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, rgba(59, 130, 246, 0.6), transparent 70%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.4), transparent 50%)' }}></div>
                {/* Static Noise Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-[#3b82f6]/10 px-3 py-1.5 rounded-full border border-[#3b82f6]/20 backdrop-blur-md">
                    <Wallet className="w-4 h-4 text-[#3b82f6]" />
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#3b82f6]">Atomic Balance <Send className="w-3 h-3 inline ml-1" /></span>
                  </div>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    disabled={isProcessingWithdraw || user.walletBalance < 1000}
                    className={`px-6 py-2.5 text-[10px] uppercase font-black tracking-widest rounded-full transition-all duration-300 border backdrop-blur-lg ${user.walletBalance >= 1000 ? 'bg-[#3b82f6]/20 border-[#3b82f6]/50 text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:scale-105' : 'bg-[var(--nexus-panel)] border-[var(--nexus-border)] text-[var(--nexus-text-muted)] cursor-not-allowed opacity-50'}`}
                  >
                    {isProcessingWithdraw ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Liquidate'}
                  </button>
                </div>

                <div className="relative z-10 mt-6 mb-2 flex items-center gap-4 group-hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-500">
                  <div style={{ perspective: '500px' }}>
                    <span className="text-4xl md:text-5xl text-[#3b82f6] inline-block animate-[spin_3s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>₹</span>
                  </div>
                  <div className="overflow-hidden h-[70px] relative w-full">
                    <AnimatePresence mode="popLayout">
                      <motion.h2
                        key={user.walletBalance}
                        initial={{ y: 50, opacity: 0, rotateX: -90 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: -50, opacity: 0, rotateX: 90 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="text-5xl md:text-7xl font-black italic tracking-tighter text-[var(--nexus-text)] absolute"
                      >
                        {user.walletBalance?.toLocaleString('en-IN') || '0.00'}
                      </motion.h2>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="relative z-10 flex gap-6 mt-auto origin-left transform transition-transform group-hover:scale-105">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase font-black tracking-widest text-[#3b82f6] mb-1 opacity-80">Pending Settlement</span>
                    <span className="text-lg md:text-xl font-mono font-bold text-[var(--nexus-text)] drop-shadow-md">₹{user.financialMetrics?.pendingPayouts?.toLocaleString('en-IN') || '0'}</span>
                  </div>
                  <div className="w-px h-8 bg-[#3b82f6]/20 mx-2 hidden sm:block"></div>
                  <div className="flex flex-col hidden sm:flex">
                    <span className="text-[8px] uppercase font-black tracking-widest text-[var(--nexus-text-muted)] mb-1">Total Mined <TrendingUp className="w-3 h-3 inline ml-1 text-[var(--nexus-accent)]" /></span>
                    <span className="text-lg md:text-xl font-mono font-bold text-[var(--nexus-text-muted)]">₹{user.financialMetrics?.totalSettled?.toLocaleString('en-IN') || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EliteCard className={`md:col-span-8 flex flex-col justify-center p-6 sm:p-8 rounded-[2.5rem] border relative overflow-hidden h-full min-h-[240px] transition-all duration-500 ${getCardStyle()}`}>
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 rounded-[1rem] bg-[var(--nexus-accent)]/10 border border-[var(--nexus-accent)]/20">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--nexus-accent)]" />
                  </div>
                  <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] italic">Node Balance</h3>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={isProcessingWithdraw || user.walletBalance < 1000}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border ${user.walletBalance >= 1000 ? 'bg-[var(--nexus-accent)] text-[var(--nexus-panel)] border-[var(--nexus-accent)] hover:brightness-110 shadow-[0_0_15px_var(--nexus-accent)]' : 'bg-[var(--nexus-panel)] border-[var(--nexus-border)] text-[var(--nexus-text-muted)] cursor-not-allowed opacity-50'}`}
                >
                  {isProcessingWithdraw ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Withdraw'}
                </button>
              </div>
              <div className="flex items-baseline gap-2 mb-8 relative z-10">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter text-[var(--nexus-accent)]">₹</span>
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black italic tracking-tighter text-[var(--nexus-text)]">
                  {user.walletBalance?.toLocaleString('en-IN') || '0.00'}
                </h2>
              </div>
              <div className="flex gap-4 sm:gap-6 mt-auto">
                <div className="flex flex-col">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] opacity-60">Pending</span>
                  <span className="text-sm sm:text-lg font-mono font-bold text-[var(--nexus-text)] mt-1">₹{user.financialMetrics?.pendingPayouts?.toLocaleString('en-IN') || '0'}</span>
                </div>
                <div className="w-px h-8 bg-[var(--nexus-border)] mx-1 sm:mx-2 hidden sm:block"></div>
                <div className="flex flex-col hidden sm:flex">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] opacity-60">Total Mined</span>
                  <span className="text-sm sm:text-lg font-mono font-bold text-[var(--nexus-text-muted)] mt-1">₹{user.financialMetrics?.totalSettled?.toLocaleString('en-IN') || '0'}</span>
                </div>
              </div>
            </EliteCard>
          )}
        </div>

        {/* MISSION STATUS */}
        {user.goalSettings?.isActive !== false && (
          <div className="flex justify-center w-full mt-2 mb-6">
            {PREMIUM_GOAL_STYLES.includes(user.goalSettings?.stylePreference) ? (
              <PremiumGoalOverlays
                goal={{
                  title: user.goalSettings?.title || "Active Objective",
                  currentProgress: user.goalSettings?.currentProgress || 0,
                  targetAmount: user.goalSettings?.targetAmount || 100,
                  stylePreference: user.goalSettings?.stylePreference
                }}
                percentage={getProgressPercentage()}
                isComplete={getProgressPercentage() >= 100}
              />
            ) : (
              <CyberGoalBar
                goal={{ title: user.goalSettings?.title || "Active Objective", currentProgress: user.goalSettings?.currentProgress || 0, targetAmount: user.goalSettings?.targetAmount || 100 }}
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

        {/* ANALYTICS DATA STREAM */}
        <EliteCard
          className={`group border rounded-[2.5rem] p-7 md:p-10 relative transition-all duration-500 overflow-hidden ${getCardStyle()}`}
        >
          {/* BGMI Specific HUD Elements */}
          {nexusTheme === 'bgmi' && (
            <div className="absolute top-0 left-0 w-1/3 h-1 bg-[var(--nexus-accent)] z-30" />
          )}


          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-10 relative z-20">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-[var(--nexus-radius)] border transition-colors bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]/20`}>
                <Zap className={`w-5 h-5 text-[var(--nexus-accent)]`} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--nexus-text-muted)] italic flex items-center gap-2">DropPay Telemetry <Sparkles className="w-3 h-3 text-[var(--nexus-accent)]" /></h3>
                <span className="text-[7px] font-bold text-[var(--nexus-accent)] uppercase animate-pulse flex items-center gap-1"><CheckCircle className="w-2 h-2" /> Live Analytics Engine</span>
              </div>
            </div>
            <div className={`w-full sm:w-auto flex p-1 rounded-[var(--nexus-radius)] border backdrop-blur-xl bg-[var(--nexus-panel)] border-[var(--nexus-border)] shadow-inner`}>
              {['7D', '1M', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-[var(--nexus-radius)] text-[9px] md:text-[10px] font-black transition-all duration-300 nexus-btn ${timeRange === range ? 'bg-[var(--nexus-accent)] text-black shadow-lg' : 'text-[var(--nexus-text-muted)] hover:text-[var(--nexus-accent)]'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full flex items-end justify-between gap-1 md:gap-2 px-1 md:px-6 mt-8 relative z-10 bottom-0">
            {chartData.map((val, i) => {
              const maxVal = Math.max(...chartData) || 1;
              const percentage = Math.max((val / maxVal) * 100, 4);
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-3 group/bar h-full">
                  <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-10 bg-[var(--nexus-bg)] text-[var(--nexus-text)] text-[10px] font-black px-3 py-1.5 rounded-lg border border-[var(--nexus-border)] pointer-events-none z-50 shadow-2xl backdrop-blur-lg flex items-center justify-center">
                    <IndianRupee className="w-2.5 h-2.5 inline-block -mt-0.5" />{val.toLocaleString('en-IN')}
                  </div>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${percentage}%`, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 40, damping: 15, delay: i * 0.05 }}
                    className="w-full max-w-[32px] md:max-w-[40px] rounded-t-[0.75rem] md:rounded-t-[1rem] transition-all duration-300 relative overflow-hidden flex flex-col justify-end group-hover/bar:scale-x-110 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    style={{
                      background: `linear-gradient(to top, var(--nexus-accent), transparent)`,
                      opacity: percentage > 80 ? 0.8 : 0.4,
                      border: `1px solid var(--nexus-accent)`,
                      borderBottom: 'none'
                    }}
                  >
                    <div className="absolute top-0 w-full h-[2px] bg-white/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                  <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-colors text-[var(--nexus-text-muted)] group-hover/bar:text-[var(--nexus-accent)]`}>
                    {timeRange === '7D' ? `D${i + 1}` : `P${i + 1}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* BGMI Bottom tech-HUD details */}
          {nexusTheme === 'bgmi' && (
            <div className="mt-8 pt-3 border-t border-[var(--nexus-border)] flex justify-between items-center relative z-20">
              <span className="bg-[var(--nexus-accent)] text-[var(--nexus-panel)] px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">Analytics Node: Active</span>
              <span className="text-[var(--nexus-text-muted)] font-mono text-[10px]">SEC-77</span>
            </div>
          )}

          <BarChart3 className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-[0.03] pointer-events-none transition-colors text-[var(--nexus-accent)]`} />
        </EliteCard>

      </div>

      {/* RIGHT COLUMN: RECENT SIGNAL & HALL OF FAME */}
      <div className="col-span-1 lg:col-span-4 space-y-6">

        {/* WIDGET 3: ELITE NEXUS SUPPORTERS (SOCIAL NODE) */}
        {user?.ownedWidgets?.includes('elite_nexus') ? (
          <div style={{ perspective: '1000px' }} className="mb-6">
            <div className="aero-widget border border-[var(--nexus-border)] py-5 relative overflow-hidden"
              style={{ backdropFilter: 'blur(35px) saturate(200%)', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2rem' }}>
              <h3 className="text-[10px] px-5 font-black uppercase tracking-widest text-[#3b82f6] mb-4 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"><Crown className="w-3 h-3" /> <Trophy className="w-3 h-3" /> Elite Nexus</h3>

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
        <EliteCard
          className={`group border rounded-[2.5rem] p-7 transition-all duration-500 h-[385px] flex flex-col ${getCardStyle()}`}
        >
          {/* BGMI Specific HUD Elements */}
          {nexusTheme === 'bgmi' && (
            <div className="absolute top-0 left-0 w-1/3 h-1 bg-[var(--nexus-accent)] z-30" />
          )}

          <h3 className="text-[11px] font-black italic mb-8 uppercase flex items-center gap-3 text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-accent)] transition-colors relative z-20">
            <Activity className="w-4 h-4" /> Recent Drop <Volume2 className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
          </h3>
          <div className="space-y-4 overflow-y-auto pr-3 custom-scrollbar flex-1 relative">
            {recentDrops.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[var(--nexus-accent)]/20 animate-ping" />
                  <div className="relative w-12 h-12 rounded-full border border-[var(--nexus-accent)]/30 flex items-center justify-center bg-[var(--nexus-accent)]/5">
                    <Target className="w-5 h-5 text-[var(--nexus-accent)] animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className={`text-xs font-black uppercase tracking-widest text-[var(--nexus-text-muted)]`}>Feed Offline</p>
                  <p className={`text-[9px] font-bold italic tracking-tighter animate-pulse text-[var(--nexus-accent)]/70`}>Signal waiting for uplink...</p>
                </div>
              </div>
            ) : (
              recentDrops.map((drop, i) => (
                <motion.div
                  key={drop.id || i}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  whileHover={{ x: 4, scale: 1.02 }}
                  className={`group/card relative overflow-hidden flex items-center justify-between p-4 rounded-[var(--nexus-radius)] border transition-all duration-300 bg-[var(--nexus-panel)] border-[var(--nexus-border)] hover:border-[var(--nexus-accent)]/60 nexus-card`}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[var(--nexus-accent)]/0 via-[var(--nexus-accent)]/10 to-[var(--nexus-accent)]/0 -translate-x-full group-hover/card:animate-[shimmer_2s_infinite]`} />

                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--nexus-accent)] opacity-0 group-hover/card:opacity-100 transition-opacity" />

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="flex-shrink-0 w-10 h-10 group-hover/card:scale-110 transition-transform flex items-center justify-center drop-shadow-md overflow-hidden">
                      {(LOTTIE_STICKER_MAP[drop.sticker] || (typeof drop.sticker === 'string' && drop.sticker.startsWith('http')) || drop.stickerUrl) ? (
                        <Player
                          autoplay
                          loop
                          src={LOTTIE_STICKER_MAP[drop.sticker] || drop.sticker || drop.stickerUrl}
                          style={{ width: '40px', height: '40px' }}
                        />
                      ) : (
                        <span className="text-2xl">{stickerFallback[drop.sticker] || '💎'}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black italic text-[11px] uppercase truncate group-hover/card:text-[var(--nexus-accent)] transition-colors flex items-center gap-1">
                        <UserCircle className="w-2.5 h-2.5 opacity-50" /> {drop.donorName}
                        {drop.isTest && <span className="ml-2 px-1 py-0.5 bg-rose-500 text-white text-[6px] rounded uppercase font-bold">Simulator</span>}
                      </p>
                      <p className="text-[9px] text-slate-500 truncate italic font-medium flex items-center gap-1">
                        <MessageSquare className="w-2.5 h-2.5 opacity-30" /> "{drop.message}"
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="font-black text-[var(--nexus-accent)] italic text-xs shrink-0 tracking-tighter relative z-10 flex items-center gap-1">
                      <Gift className="w-2.5 h-2.5" /> ₹{drop.amount}
                    </p>
                    <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <Smile className="w-2.5 h-2.5 text-[var(--nexus-accent)]" />
                      <Lock className="w-2.5 h-2.5 text-slate-600" />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* BGMI Bottom tech-HUD details */}
          {nexusTheme === 'bgmi' && (
            <div className="mt-auto pt-3 border-t border-[var(--nexus-border)] flex justify-between items-center relative z-20">
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

export default React.memo(DashboardSummary);
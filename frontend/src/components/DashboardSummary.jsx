import React from 'react';
import { motion } from 'framer-motion';
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

        {/* REVENUE BALANCE NODE  */}
        <EliteCard
          className={`group relative border rounded-[2.5rem] p-7 md:p-10 transition-all duration-500 ${getCardStyle()}`}
        >
          {/* BGMI Specific HUD Elements */}
          {nexusTheme === 'bgmi' && (
            <div className="absolute top-0 left-0 w-1/3 h-1 bg-[var(--nexus-accent)] z-30" />
          )}

          <div className="flex flex-col md:flex-row md:justify-between md:items-center relative z-20 gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-[var(--nexus-accent)]" />
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--nexus-accent)]">DropPay Wallet</span>
                <ShieldCheck className="w-3 h-3 text-[var(--nexus-accent)]" />
              </div>
              <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter transition-colors duration-500 text-[var(--nexus-text)] group-hover:text-[var(--nexus-accent)] flex items-center gap-3 gold-text-shimmer flex-wrap`}>
                <span className="text-xl sm:text-2xl md:text-3xl text-[var(--nexus-text-muted)] not-italic opacity-40"><IndianRupee /></span>
                {user.walletBalance?.toLocaleString('en-IN') || '0.00'}
              </h2>

              {/* PAYOUT LIFECYCLE TELEMETRY */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4">
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-black tracking-widest text-[var(--nexus-accent)] mb-1">Processing to Bank</span>
                  <span className={`text-base md:text-lg font-mono font-bold text-[var(--nexus-text)]`}>
                    ₹{user.financialMetrics?.pendingPayouts?.toLocaleString('en-IN') || '0'}
                  </span>
                </div>
                <div className={`hidden sm:block w-px h-8 bg-[var(--nexus-border)]`}></div>
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-black tracking-widest text-[var(--nexus-text-muted)] mb-1 flex items-center gap-1"><User className="w-2 h-2" /> Total Lifetime Settled</span>
                  <span className={`text-base md:text-lg font-mono font-bold text-[var(--nexus-text-muted)]`}>
                    ₹{user.financialMetrics?.totalSettled?.toLocaleString('en-IN') || '0'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch md:items-end gap-4">
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={isProcessingWithdraw || user.walletBalance < 1000}
                className={`w-full md:w-auto px-8 py-4 rounded-[var(--nexus-radius)] text-[11px] font-black uppercase italic tracking-widest transition-all duration-300 nexus-btn flex items-center justify-center gap-2 ${user.walletBalance >= 1000
                  ? 'bg-[var(--nexus-accent)] text-black shadow-lg hover:brightness-110'
                  : 'bg-[var(--nexus-panel)] text-[var(--nexus-text-muted)] opacity-50 cursor-not-allowed'
                  }`}
              >
                {isProcessingWithdraw ? <Loader2 className="animate-spin w-5 h-5" /> : <><Send className="w-4 h-4" /> Withdraw Funds</>}
              </button>
            </div>
          </div>

          {/* BGMI Bottom tech-HUD details */}
          {nexusTheme === 'bgmi' && (
            <div className="mt-6 pt-3 border-t border-[var(--nexus-border)] flex justify-between items-center relative z-20">
              <span className="bg-[var(--nexus-accent)] text-[var(--nexus-panel)] px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
                Match Status: Active
              </span>
              <span className="text-[var(--nexus-text-muted)] font-mono text-[10px]">
                ID: DROP-{user.streamerId?.slice(-6).toUpperCase() || 'NODE'}
              </span>
            </div>
          )}

          <TrendingUp className={`absolute -bottom-10 -right-10 w-48 h-48 rotate-12 pointer-events-none transition-all duration-700 text-[var(--nexus-accent)] opacity-[0.05] group-hover:opacity-[0.08]`} />
        </EliteCard>

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
                  <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-10 bg-[var(--nexus-bg)] text-[var(--nexus-text)] text-[10px] font-black px-3 py-1.5 rounded-lg border border-[var(--nexus-border)] pointer-events-none z-50 shadow-2xl backdrop-blur-lg">
                    ₹{val.toLocaleString('en-IN')}
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

        {/* LEADERBOARD */}
        <div className="h-[340px] flex flex-col">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] flex items-center gap-2">Global Rankings <Crown className="w-3 h-3 text-amber-500 opacity-50" /> <Award className="w-3 h-3 text-amber-500 opacity-50" /></span>
          </div>
          <TopSupporterWidget
            topSupporters={topDonors.map(d => ({
              name: d._id,
              amount: d.totalAmount || d.total || 0,
              avatar: d.avatar || null
            })).sort((a, b) => b.amount - a.amount)}
            stylePreference={user.overlaySettings?.leaderboardStyle || 'royal_throne'}
          />
        </div>

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
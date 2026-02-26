import React from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, BarChart3, Target, Trophy, TrendingUp, Loader2, Zap, Activity
} from 'lucide-react';
import CyberGoalBar from './CyberGoalBar';
import PremiumGoalOverlays from './PremiumGoalOverlays';

const PREMIUM_GOAL_STYLES = [
  'black_hole', 'hex_core', 'rune_monolith', 'hologram_glitch',
  'alchemist_flask', 'redline_dash', 'loot_dispenser', 'mecha_lens'
];

const runnerMap = {
  star: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/lottie.json',
  car: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f697/lottie.json',
  rocket: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json',
  fire: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/lottie.json'
};

const DashboardSummary = ({
  theme, user, chartData, timeRange, setTimeRange,
  topDonors, recentDrops, handleWithdrawRequest,
  isProcessingWithdraw, getProgressPercentage
}) => {

  const stickerMap = {
    zap: '⚡', fire: '🔥', heart: '💖', crown: '👑', rocket: '🚀',
    party_popper: '🎉', star: '⭐', diamond: '💎', gold_bar: '🪙'
  };

  const getCardStyle = () => {
    if (theme === 'dark') {
      return 'bg-[#0a0a0a]/80 border-white/5 hover:border-[#10B981]/60 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)]';
    }
    return 'bg-white border-slate-200 hover:border-[#10B981] hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)] shadow-sm';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl mx-auto pt-4">

      {/* LEFT COLUMN: TELEMETRY & PROGRESS */}
      <div className="col-span-1 lg:col-span-8 space-y-6">

        {/* REVENUE BALANCE NODE - HOVER FIXED */}
        <motion.div
          whileHover={{ y: -2, scale: 1.01 }} // REDUCED VERTICAL LIFT TO PREVENT CLIPPING
          className={`group relative border rounded-[2.5rem] p-7 md:p-10 overflow-hidden transition-all duration-500 ${getCardStyle()}`}
        >
          <div className="flex justify-between items-center relative z-20">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-[#10B981]" />
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-500">Node Balance</span>
              </div>
              <h2 className={`text-5xl md:text-6xl font-black italic tracking-tighter transition-colors duration-500 
                ${theme === 'dark' ? 'text-white group-hover:text-[#10B981]' : 'text-slate-900 group-hover:text-[#10B981]'}`}>
                ₹{user.walletBalance?.toLocaleString('en-IN') || '0.00'}
              </h2>

              {/* PHASE 7: NEW PAYOUT LIFECYCLE TELEMETRY */}
              <div className="flex items-center gap-6 mt-4">
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-black tracking-widest text-[#10B981] mb-1">Processing to Bank</span>
                  <span className={`text-lg font-mono font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    ₹{user.financialMetrics?.pendingPayouts?.toLocaleString('en-IN') || '0'}
                  </span>
                </div>
                <div className={`w-px h-8 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-black tracking-widest text-slate-500 mb-1">Total Lifetime Settled</span>
                  <span className={`text-lg font-mono font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    ₹{user.financialMetrics?.totalSettled?.toLocaleString('en-IN') || '0'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <button
                onClick={handleWithdrawRequest}
                disabled={isProcessingWithdraw || user.walletBalance < 100}
                className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-widest transition-all duration-300 ${user.walletBalance >= 100
                  ? 'bg-[#10B981] text-black shadow-lg hover:bg-[#0da673]'
                  : theme === 'dark' ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
              >
                {isProcessingWithdraw ? <Loader2 className="animate-spin w-5 h-5" /> : 'Withdraw Funds'}
              </button>
            </div>
          </div>
          <TrendingUp className={`absolute -bottom-10 -right-10 w-48 h-48 rotate-12 pointer-events-none transition-all duration-700 ${theme === 'dark' ? 'text-[#10B981]/5 group-hover:text-[#10B981]/10' : 'text-slate-100 group-hover:text-emerald-50'}`} />
        </motion.div>

        {/* MISSION STATUS - WITH VISIBILITY PROTOCOL */}
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
        <motion.div
          whileHover={{ y: -2 }}
          className={`group border rounded-[2.5rem] p-7 md:p-10 relative transition-all duration-500 overflow-hidden ${getCardStyle()}`}
        >
          <div className="flex justify-between items-center mb-10 relative z-20">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-[#10B981]/10 border-[#10B981]/20' : 'bg-emerald-50 border-emerald-100'}`}>
                <Zap className={`w-5 h-5 ${theme === 'dark' ? 'text-[#10B981]' : 'text-emerald-600'}`} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Revenue Telemetry</h3>
                <span className="text-[7px] font-bold text-[#10B981] uppercase animate-pulse">Live Signal Processing</span>
              </div>
            </div>
            <div className={`flex p-1.5 rounded-2xl border backdrop-blur-xl ${theme === 'dark' ? 'bg-black/60 border-white/10' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
              {['7D', '1M', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all duration-300 ${timeRange === range ? (theme === 'dark' ? 'bg-white text-black shadow-xl scale-105' : 'bg-[#10B981] text-white shadow-lg') : (theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-[#10B981]')}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full flex items-end justify-between gap-2 px-6 mt-8 relative z-10 bottom-0">
            {chartData.map((val, i) => {
              const maxVal = Math.max(...chartData) || 1;
              const percentage = Math.max((val / maxVal) * 100, 4); // Min 4% height to show it exists

              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-3 group/bar h-full">
                  {/* Floating Tooltip visible only on Hover */}
                  <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-10 bg-black/80 backdrop-blur text-white text-[10px] font-black px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none z-50 shadow-2xl">
                    ₹{val.toLocaleString('en-IN')}
                  </div>

                  {/* The Dynamic Bar */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${percentage}%`, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 40, damping: 15, delay: i * 0.05 }}
                    className="w-full max-w-[40px] rounded-t-[1rem] transition-all duration-300 relative overflow-hidden flex flex-col justify-end group-hover/bar:scale-x-110 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    style={{
                      background: theme === 'dark'
                        ? `linear-gradient(to top, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, ${percentage > 80 ? '0.8' : '0.4'}))`
                        : `linear-gradient(to top, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, ${percentage > 80 ? '0.6' : '0.3'}))`,
                      border: `1px solid rgba(16, 185, 129, ${theme === 'dark' ? '0.3' : '0.1'})`,
                      borderBottom: 'none'
                    }}
                  >
                    {/* Inner glowing pulse effect on the bar */}
                    <div className="absolute top-0 w-full h-[2px] bg-white/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300" />
                  </motion.div>

                  {/* Date Label */}
                  <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-slate-500 group-hover/bar:text-[#10B981]' : 'text-slate-400 group-hover/bar:text-emerald-600'}`}>
                    {timeRange === '7D' ? `D${i + 1}` : `P${i + 1}`}
                  </span>
                </div>
              );
            })}
          </div>

          <BarChart3 className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-[0.03] pointer-events-none transition-colors ${theme === 'dark' ? 'text-[#10B981]' : 'text-slate-900'}`} />
        </motion.div>


      </div>

      {/* RIGHT COLUMN: RECENT SIGNAL & HALL OF FAME */}
      <div className="col-span-1 lg:col-span-4 space-y-6">

        {/* LEADERBOARD */}
        <div className={`border rounded-[2.5rem] p-7 transition-all duration-500 h-[340px] flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0a]/80 border-white/5 hover:border-amber-400/40 hover:shadow-[0_0_40px_rgba(251,191,36,0.1)]' : 'bg-white border-slate-200 hover:shadow-xl hover:border-amber-400/50 shadow-sm'}`}>
          <h3 className="text-[11px] font-black italic mb-8 uppercase flex items-center gap-3"><Trophy className="w-4 h-4 text-amber-400" /> Top Supporters</h3>
          <div className="space-y-5 overflow-y-auto pr-3 custom-scrollbar flex-1">
            {topDonors.map((donor, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black italic text-xs transition-all duration-300 ${idx === 0 ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)] scale-110' : theme === 'dark' ? 'bg-white/5 text-slate-500' : 'bg-slate-50 text-slate-400 group-hover:text-slate-900'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="font-black text-[11px] uppercase truncate tracking-tight">{donor._id}</p>
                    <p className="font-black text-[#10B981] italic text-[11px]">₹{donor.totalAmount || donor.total}</p>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                    <motion.div initial={{ width: 0 }} animate={{ width: topDonors[0]?.totalAmount > 0 ? `${((donor.totalAmount || donor.total) / (topDonors[0].totalAmount || topDonors[0].total)) * 100}%` : '0%' }} className="h-full bg-[#10B981]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVITY SIGNAL FEED */}
        <div className={`group border rounded-[2.5rem] p-7 transition-all duration-500 h-[385px] flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0a]/80 border-white/5 hover:border-[#10B981]/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-[#10B981]/50'}`}>
          <h3 className="text-[11px] font-black italic mb-8 uppercase flex items-center gap-3 text-slate-500 group-hover:text-[#10B981] transition-colors"><Activity className="w-4 h-4" /> Recent Drop</h3>
          <div className="space-y-4 overflow-y-auto pr-3 custom-scrollbar flex-1 relative">
            {recentDrops.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#10B981]/20 animate-ping" />
                  <div className="relative w-12 h-12 rounded-full border border-[#10B981]/30 flex items-center justify-center bg-[#10B981]/5">
                    <Target className="w-5 h-5 text-[#10B981] animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Listening</p>
                  <p className={`text-[9px] font-bold italic tracking-tighter animate-pulse ${theme === 'dark' ? 'text-[#10B981]/70' : 'text-emerald-600/70'}`}>Waiting for drops...</p>
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
                  className={`group/card relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-[#10B981]/60' : 'bg-slate-50 border-slate-100 hover:border-[#10B981]/40 hover:bg-white shadow-sm'}`}
                >
                  {/* Live Animated Shimmer Background */}
                  <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${theme === 'dark' ? 'from-[#10B981]/0 via-[#10B981]/10 to-[#10B981]/0' : 'from-[#10B981]/0 via-[#10B981]/5 to-[#10B981]/0'} -translate-x-full group-hover/card:animate-[shimmer_2s_infinite]`} />

                  {/* Left Accent Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#10B981] opacity-0 group-hover/card:opacity-100 transition-opacity" />

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="flex-shrink-0 w-10 h-10 group-hover/card:scale-110 transition-transform flex items-center justify-center drop-shadow-md">
                      {drop.stickerUrl ? (
                        <lottie-player
                          src={drop.stickerUrl}
                          background="transparent"
                          speed="1"
                          loop
                          autoplay
                          style={{ width: '100%', height: '100%' }}
                        ></lottie-player>
                      ) : (
                        <span className="text-2xl">{stickerMap[drop.sticker] || '💎'}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black italic text-[11px] uppercase truncate group-hover/card:text-[#10B981] transition-colors">{drop.donorName}</p>
                      <p className="text-[9px] text-slate-500 truncate italic font-medium">"{drop.message}"</p>
                    </div>
                  </div>
                  <p className="font-black text-[#10B981] italic text-xs shrink-0 tracking-tighter relative z-10">₹{drop.amount}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
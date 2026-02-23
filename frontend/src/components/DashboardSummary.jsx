import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, BarChart3, Target, Trophy, TrendingUp, Loader2, Zap, Activity, Play
} from 'lucide-react';

const DashboardSummary = ({ 
  theme, user, chartData, timeRange, setTimeRange, 
  topDonors, recentDrops, handleWithdrawRequest, 
  isProcessingWithdraw, getProgressPercentage,
  triggerTestDrop, isTesting // CONTEXTUAL PROPS FOR TEST SIGNAL
}) => {

  const stickerMap = { 
    zap: '⚡', fire: '🔥', heart: '💖', crown: '👑', rocket: '🚀',
    party_popper: '🎉', star: '⭐', diamond: '💎', gold_bar: '🪙'
  };

  const tierColor = user?.tier === 'legend' ? '#fbbf24' : user?.tier === 'pro' ? '#10B981' : '#94a3b8';

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
            </div>
            
            <div className="flex flex-col items-end gap-4">
              {/* CONTEXTUAL TEST SIGNAL BUTTON */}
              <button 
                onClick={triggerTestDrop} 
                disabled={isTesting}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black italic text-[9px] tracking-widest transition-all ${
                  theme === 'dark' ? 'bg-white text-black hover:bg-[#10B981]' : 'bg-slate-900 text-white hover:bg-[#10B981]'
                }`}
              >
                {isTesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />} TEST SIGNAL
              </button>

              <button 
                onClick={handleWithdrawRequest} 
                disabled={isProcessingWithdraw || user.walletBalance < 100} 
                className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-widest transition-all duration-300 ${
                  user.walletBalance >= 100 
                  ? 'bg-[#10B981] text-black shadow-lg hover:bg-[#0da673]' 
                  : theme === 'dark' ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isProcessingWithdraw ? <Loader2 className="animate-spin w-5 h-5" /> : 'Settle Node'}
              </button>
            </div>
          </div>
          <TrendingUp className={`absolute -bottom-10 -right-10 w-48 h-48 rotate-12 pointer-events-none transition-all duration-700 ${theme === 'dark' ? 'text-[#10B981]/5 group-hover:text-[#10B981]/10' : 'text-slate-100 group-hover:text-emerald-50'}`} />
        </motion.div>

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
          
          <div className="h-48 w-full flex items-end justify-between gap-3 px-4 relative z-10">
            {chartData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar max-w-[45px]">
                <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: `${Math.max((val / (Math.max(...chartData) || 1)) * 100, 8)}%` }} 
                  className="w-full rounded-t-2xl transition-all duration-500 relative overflow-hidden"
                  style={{ 
                    backgroundColor: theme === 'dark' ? `${tierColor}30` : `${tierColor}20`, 
                    border: `1px solid ${tierColor}${theme === 'dark' ? '40' : '20'}`,
                  }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                </motion.div>
                <span className={`text-[8px] font-black uppercase tracking-tighter transition-colors ${theme === 'dark' ? 'text-slate-600 group-hover/bar:text-[#10B981]' : 'text-slate-400 group-hover/bar:text-emerald-600'}`}>
                  {timeRange === '7D' ? `DAY ${i+1}` : `P${i+1}`}
                </span>
              </div>
            ))}
          </div>

          <BarChart3 className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-[0.03] pointer-events-none transition-colors ${theme === 'dark' ? 'text-[#10B981]' : 'text-slate-900'}`} />
        </motion.div>

        {/* MISSION STATUS - WITH VISIBILITY PROTOCOL */}
        {user.goalSettings?.showOnDashboard && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className={`border rounded-[2.5rem] p-7 md:p-10 transition-all duration-500 ${getCardStyle()}`}
          >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3"><Target className="w-5 h-5 text-amber-500" /><h3 className="text-xs font-black uppercase text-slate-500 tracking-widest italic">Active Protocol</h3></div>
                <span className="text-xs font-black italic text-amber-500">{getProgressPercentage().toFixed(1)}% SYNCHRONIZED</span>
            </div>
            <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <span className={`text-sm font-black uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user.goalSettings?.title}</span> 
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest">₹{user.goalSettings?.currentProgress} / ₹{user.goalSettings?.targetAmount}</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden p-[1px] ${theme === 'dark' ? 'bg-white/5 border border-white/5' : 'bg-slate-100 border border-slate-200 shadow-inner'}`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }} 
                    className="h-full bg-gradient-to-r from-[#10B981] to-amber-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] rounded-full" 
                  />
                </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* RIGHT COLUMN: RECENT SIGNAL & HALL OF FAME */}
      <div className="col-span-1 lg:col-span-4 space-y-6">
        
        {/* LEADERBOARD */}
        <div className={`border rounded-[2.5rem] p-7 transition-all duration-500 h-[340px] flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0a]/80 border-white/5 hover:border-amber-400/40 hover:shadow-[0_0_40px_rgba(251,191,36,0.1)]' : 'bg-white border-slate-200 hover:shadow-xl hover:border-amber-400/50 shadow-sm'}`}>
            <h3 className="text-[11px] font-black italic mb-8 uppercase flex items-center gap-3"><Trophy className="w-4 h-4 text-amber-400" /> Elite Nodes</h3>
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
            <h3 className="text-[11px] font-black italic mb-8 uppercase flex items-center gap-3 text-slate-500 group-hover:text-[#10B981] transition-colors"><Activity className="w-4 h-4" /> Live Signal</h3>
            <div className="space-y-4 overflow-y-auto pr-3 custom-scrollbar flex-1">
                {recentDrops.map((drop, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 4 }}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-[#10B981]/60' : 'bg-slate-50 border-slate-100 hover:border-[#10B981]/40 hover:bg-white shadow-sm'}`}
                    >
                        <div className="flex items-center gap-4">
                          <div className="text-xl drop-shadow-md">{stickerMap[drop.sticker] || '💎'}</div>
                          <div className="min-w-0">
                            <p className="font-black italic text-[11px] uppercase truncate">{drop.donorName}</p>
                            <p className="text-[9px] text-slate-500 truncate italic font-medium">"{drop.message}"</p>
                          </div>
                        </div>
                        <p className="font-black text-[#10B981] italic text-xs shrink-0 tracking-tighter">₹{drop.amount}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
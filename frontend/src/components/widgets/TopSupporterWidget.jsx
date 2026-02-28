import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal, Trophy, Award, Zap, Star, Flame } from 'lucide-react';
// import { getOptimizedImage } from '../../protocol/cdnHelper'; // No longer needed


/**
 * MASTER TOP SUPPORTER WIDGET
 * Place this on the Dashboard, Donation Page, and OBS.
 * It automatically changes style based on `stylePreference`.
 */
const TopSupporterWidget = ({ topSupporters = [], stylePreference = 'royal_throne' }) => {

    // Ensure we have data
    const firstPlace = topSupporters[0];
    const secondPlace = topSupporters[1];
    const thirdPlace = topSupporters[2];

    if (!firstPlace) return <div className="text-slate-500 text-sm font-medium w-full text-center py-4">No supporters yet...</div>;

    // ==========================================
    // STYLE 1: THE ROYAL THRONE (3D Podium)
    // ==========================================
    if (stylePreference === 'royal_throne') {
        return (
            <div className="w-full bg-[#0b0f19] rounded-2xl border border-slate-800 p-6 flex flex-col items-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.15)_0%,transparent_70%)] pointer-events-none" />
                <h3 className="text-white font-black uppercase tracking-[0.3em] text-sm mb-12 drop-shadow-md flex items-center gap-2 relative z-10">
                    <Crown className="w-5 h-5 text-yellow-400" /> The Royal Throne <Award className="w-4 h-4 text-yellow-400/50" />
                </h3>

                <div className="flex items-end justify-center gap-2 sm:gap-6 w-full h-[250px] relative z-10">
                    {/* 2ND PLACE */}
                    {secondPlace && (
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center pb-4">
                            <div className="w-14 h-14 rounded-full border-4 border-slate-300 bg-slate-800 mb-3 shadow-[0_0_15px_rgba(203,213,225,0.4)] overflow-hidden flex items-center justify-center">
                                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                    <Star className="w-6 h-6 text-slate-300 drop-shadow-md" />
                                </motion.div>
                            </div>
                            <div className="w-20 sm:w-24 h-24 bg-gradient-to-t from-slate-900 to-slate-700 border-t-4 border-slate-300 rounded-t-lg flex flex-col items-center pt-2 shadow-inner relative">
                                <Medal className="w-5 h-5 text-slate-300 absolute -top-3 bg-[#0b0f19] rounded-full" />
                                <span className="text-white font-bold text-xs truncate w-full text-center px-1">{secondPlace.name}</span>
                                <span className="text-slate-300 font-mono text-[10px] mt-1">₹{secondPlace.amount.toLocaleString()}</span>
                            </div>
                        </motion.div>
                    )}

                    {/* 1ST PLACE - THE KING */}
                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="flex flex-col items-center z-20">
                        <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="relative mb-4">
                            <motion.div animate={{ rotateY: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-[0_0_15px_#facc15] z-30">
                                <Crown className="w-10 h-10 fill-yellow-400" />
                            </motion.div>
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[6px] border-yellow-400 bg-yellow-900/40 shadow-[0_0_30px_rgba(250,204,21,0.6)] overflow-hidden relative z-20 flex items-center justify-center">
                                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                    <Flame className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,1)]" fill="currentColor" />
                                </motion.div>
                            </div>
                        </motion.div>
                        <div className="w-28 sm:w-32 h-36 bg-gradient-to-t from-yellow-900 via-yellow-700 to-yellow-500 border-t-[6px] border-yellow-300 rounded-t-xl flex flex-col items-center pt-3 shadow-[0_10px_30px_#000,inset_0_5px_15px_rgba(255,255,255,0.4)] relative">
                            <span className="bg-black/50 px-3 py-0.5 rounded-full text-yellow-300 font-black text-[10px] tracking-widest mb-1 shadow-inner">#1 LEADER</span>
                            <span className="text-white font-black text-sm truncate w-full text-center px-2 drop-shadow-md">{firstPlace.name}</span>
                            <span className="text-yellow-100 font-black text-lg font-mono mt-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">₹{firstPlace.amount.toLocaleString()}</span>
                        </div>
                    </motion.div>

                    {/* 3RD PLACE */}
                    {thirdPlace && (
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col items-center pb-4">
                            <div className="w-12 h-12 rounded-full border-4 border-amber-600 bg-slate-800 mb-3 shadow-[0_0_15px_rgba(217,119,6,0.4)] overflow-hidden flex items-center justify-center">
                                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}>
                                    <Zap className="w-5 h-5 text-amber-500 drop-shadow-md" />
                                </motion.div>
                            </div>
                            <div className="w-20 sm:w-24 h-16 bg-gradient-to-t from-amber-950 to-amber-800 border-t-4 border-amber-600 rounded-t-lg flex flex-col items-center pt-2 shadow-inner relative">
                                <Medal className="w-4 h-4 text-amber-500 absolute -top-3 bg-[#0b0f19] rounded-full" />
                                <span className="text-white font-bold text-xs truncate w-full text-center px-1">{thirdPlace.name}</span>
                                <span className="text-amber-300 font-mono text-[9px] mt-1">₹{thirdPlace.amount.toLocaleString()}</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        );
    }

    // ==========================================
    // STYLE 2: CLASSIC CHART (Clean, Glassmorphic List)
    // ==========================================
    if (stylePreference === 'classic_chart') {
        return (
            <div className="w-full bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex flex-col shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <h3 className="text-white font-bold tracking-wide flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-indigo-400" /> Top Supporters <Award className="w-4 h-4 text-indigo-400/50" />
                    </h3>
                    <span className="text-slate-400 text-xs font-mono">All-Time</span>
                </div>

                <div className="flex flex-col gap-3">
                    {topSupporters.slice(0, 5).map((supporter, index) => (
                        <motion.div
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center justify-between p-3 rounded-xl border ${index === 0 ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-black/40 border-white/5'}`}
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="font-black text-xl w-6 text-center shrink-0" style={{ color: index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : index === 2 ? '#d97706' : '#475569' }}>
                                    #{index + 1}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-800/80 overflow-hidden border-2 border-white/10 shrink-0 flex items-center justify-center">
                                    {index === 0 ? (
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                            <Flame className="w-5 h-5 text-yellow-400 drop-shadow-md" fill="currentColor" />
                                        </motion.div>
                                    ) : index === 1 ? (
                                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                            <Star className="w-5 h-5 text-slate-300 drop-shadow-md" />
                                        </motion.div>
                                    ) : index === 2 ? (
                                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                                            <Zap className="w-5 h-5 text-amber-500 drop-shadow-md" />
                                        </motion.div>
                                    ) : (
                                        <Zap className="w-4 h-4 text-slate-500" />
                                    )}
                                </div>
                                <span className={`font-bold truncate ${index === 0 ? 'text-white' : 'text-slate-300'}`}>{supporter.name}</span>
                            </div>
                            <span className={`font-mono font-black shrink-0 ml-4 ${index === 0 ? 'text-indigo-300' : 'text-slate-400'}`}>
                                ₹{supporter.amount.toLocaleString()}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    // ==========================================
    // STYLE 3: ARCADE HIGH SCORES (Retro 8-Bit)
    // ==========================================
    if (stylePreference === 'arcade_scores') {
        return (
            <div className="w-full bg-[#0a0a0a] rounded-xl border-[4px] border-[#333] p-6 font-mono relative overflow-hidden">
                {/* CRT Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

                <h3 className="text-red-500 font-black text-2xl uppercase text-center mb-6 animate-pulse drop-shadow-[0_0_10px_red]">
                    High Scores
                </h3>

                <div className="flex flex-col gap-4 relative z-20 px-2">
                    <div className="flex justify-between text-slate-600 text-xs font-bold border-b-2 border-[#333] pb-2 mb-2">
                        <span className="w-12">RANK</span>
                        <span className="text-left flex-1 ml-4">PLAYER</span>
                        <span className="text-right">SCORE</span>
                    </div>

                    {topSupporters.slice(0, 5).map((supporter, index) => (
                        <div key={index} className="flex justify-between items-center text-lg uppercase">
                            <span className={`w-12 ${index === 0 ? 'text-yellow-400' : 'text-slate-500'}`}>
                                {index + 1}{index === 0 ? 'ST' : index === 1 ? 'ND' : index === 2 ? 'RD' : 'TH'}
                            </span>
                            <span className={`text-left flex-1 ml-4 truncate ${index === 0 ? 'text-white drop-shadow-[0_0_5px_#fff]' : 'text-sky-400'}`}>
                                {supporter.name.slice(0, 12)}
                            </span>
                            <span className={`text-right ${index === 0 ? 'text-green-400 drop-shadow-[0_0_5px_#4ade80]' : 'text-slate-400'}`}>
                                {supporter.amount}
                            </span>
                        </div>
                    ))}

                    <div className="mt-6 text-center">
                        <span className="text-yellow-400 text-xs animate-pulse">INSERT COIN TO JOIN</span>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback if somehow a weird style string is passed
    return null;
};

export default TopSupporterWidget;
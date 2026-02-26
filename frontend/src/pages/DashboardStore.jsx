import React, { useState } from 'react';
import axios from 'axios';
import { Hexagon, Sparkles, AlertTriangle, Loader2, IndianRupee, Store, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumAlertPreview from '../components/PremiumAlertPreview';
import PremiumGoalOverlays from '../components/PremiumGoalOverlays';


const PREMIUM_GOALS = [
    { id: 'black_hole', name: 'Black Hole', theme: 'Cosmic Vortex', basePrice: 2000, color: 'text-purple-400' },
    { id: 'hex_core', name: 'Hex Core', theme: 'Alien Server', basePrice: 2000, color: 'text-green-400' },
    { id: 'rune_monolith', name: 'Rune Monolith', theme: 'Dark Fantasy', basePrice: 2000, color: 'text-orange-400' },
    { id: 'hologram_glitch', name: 'Hologram Glitch', theme: 'Cyberpunk', basePrice: 2000, color: 'text-cyan-400' },
    { id: 'alchemist_flask', name: 'Alchemist Flask', theme: 'RPG Potion', basePrice: 2000, color: 'text-yellow-400' },
    { id: 'redline_dash', name: 'Redline Dash', theme: 'Speedometer', basePrice: 2000, color: 'text-red-400' },
    { id: 'loot_dispenser', name: 'Loot Dispenser', theme: 'Gachapon', basePrice: 2000, color: 'text-pink-400' },
    { id: 'mecha_lens', name: 'Mecha Lens', theme: 'Terminator Eye', basePrice: 2000, color: 'text-rose-500' },
];

const PREMIUM_ALERTS = [
    { id: 'subway_dash', name: 'Subway Dash', theme: 'Infinite Runner', basePrice: 2000, color: 'text-pink-500' },
    { id: 'orbital_strike', name: 'Orbital Strike', theme: 'Sci-Fi Laser', basePrice: 2000, color: 'text-cyan-400' },
    { id: 'loot_crate', name: 'Loot Crate', theme: 'RPG Drop', basePrice: 2000, color: 'text-yellow-500' },
    { id: 'neon_billboard', name: 'Neon Billboard', theme: 'Cyberpunk Isom.', basePrice: 2000, color: 'text-rose-500' },
    { id: 'celestial_blessing', name: 'Celestial', theme: 'Ethereal Fantasy', basePrice: 2000, color: 'text-yellow-300' },
    { id: 'gacha_pull', name: 'Gacha Pull', theme: 'Anime Gacha', basePrice: 2000, color: 'text-purple-400' },
    { id: 'arcade_ko', name: 'Arcade K.O.', theme: 'Fighting Game', basePrice: 2000, color: 'text-red-500' },
    { id: 'paranormal_tape', name: 'Paranormal', theme: 'VHS Horror', basePrice: 2000, color: 'text-slate-400' },
    { id: 'holo_tcg', name: 'Holo TCG', theme: 'Trading Card', basePrice: 2000, color: 'text-emerald-400' },
    { id: 'beat_drop', name: 'Beat Drop', theme: 'DJ Equalizer', basePrice: 2000, color: 'text-indigo-400' },
    { id: 'mainframe_breach', name: 'Mainframe', theme: 'Hacker Terminal', basePrice: 2000, color: 'text-green-500' },
    { id: 'dragon_hoard', name: 'Dragon Hoard', theme: 'Dark Fantasy', basePrice: 7999, color: 'text-red-600' },
    { id: 'casino_jackpot', name: 'Casino Jackpot', theme: 'Slot Machine', basePrice: 9999, color: 'text-yellow-400' },
    { id: 'mecha_assembly', name: 'Mecha Assembly', theme: 'Sci-Fi Armor', basePrice: 6999, color: 'text-cyan-300' },
    { id: 'hyperdrive_warp', name: 'Hyperdrive', theme: 'Space Sim', basePrice: 5999, color: 'text-sky-400' },
    { id: 'dimensional_rift', name: 'Dimension Rift', theme: 'Magic Portal', basePrice: 11999, color: 'text-fuchsia-400' },
    { id: 'abyssal_kraken', name: 'Abyssal Kraken', theme: 'Deep Sea', basePrice: 8999, color: 'text-teal-400' },
    { id: 'pharaoh_tomb', name: 'Pharaoh Tomb', theme: 'Ancient Egypt', basePrice: 9999, color: 'text-yellow-500' },
    { id: 'cybernetic_brain', name: 'Cyber Brain', theme: 'Matrix / AI', basePrice: 10499, color: 'text-green-400' },
    { id: 'celestial_zodiac', name: 'Celestial Zodiac', theme: 'Astrolabe', basePrice: 12000, color: 'text-amber-300' },
];

const DashboardStore = ({ theme, user, setUser }) => {
    const [storeTab, setStoreTab] = useState('goals'); // 'goals' or 'alerts'
    const [selectedGoalStyle, setSelectedGoalStyle] = useState('black_hole');
    const [selectedAlertStyle, setSelectedAlertStyle] = useState('subway_dash');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Local helpers to check if unlocked
    const isGoalUnlocked = (id) => user?.goalSettings?.unlockedPremiumStyles?.includes(id);
    const isAlertUnlocked = (id) => user?.overlaySettings?.unlockedPremiumAlerts?.includes(id);

    const handlePurchase = async () => {
        setIsProcessing(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const token = localStorage.getItem('token');
            const endpoint = storeTab === 'goals' ? '/buy-premium-style' : '/buy-premium-alert';
            const payload = { styleId: storeTab === 'goals' ? selectedGoalStyle : selectedAlertStyle };

            const res = await axios.post(
                `http://localhost:5001/api/user${endpoint}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (storeTab === 'goals') {
                setUser(prev => ({ ...prev, walletBalance: res.data.walletBalance, goalSettings: res.data.goalSettings }));
                setSuccessMsg(`Successfully unlocked & equipped: ${PREMIUM_GOALS.find(g => g.id === selectedGoalStyle).name}!`);
            } else {
                setUser(prev => ({ ...prev, walletBalance: res.data.walletBalance, overlaySettings: res.data.overlaySettings }));
                setSuccessMsg(`Successfully unlocked & equipped: ${PREMIUM_ALERTS.find(g => g.id === selectedAlertStyle).name}!`);
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.msg || 'Transaction Failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const activeList = storeTab === 'goals' ? PREMIUM_GOALS : PREMIUM_ALERTS;
    const activeSelectedId = storeTab === 'goals' ? selectedGoalStyle : selectedAlertStyle;
    const selectedItem = activeList.find(g => g.id === activeSelectedId);

    const alreadyOwned = storeTab === 'goals' ? isGoalUnlocked(activeSelectedId) : isAlertUnlocked(activeSelectedId);

    // Dynamic Theme Classes
    const cardBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white/70 backdrop-blur-xl shadow-lg';
    const borderClass = theme === 'dark' ? 'border-white/5' : 'border-slate-200';
    const textMuted = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
    const subHeaderBg = theme === 'dark' ? 'bg-[#111]' : 'bg-slate-100';

    return (
        <div className="space-y-6 max-w-4xl pb-20">

            {/* HEADER ROW */}
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${cardBg} border ${borderClass} p-6 rounded-2xl relative overflow-hidden transition-all duration-500`}>
                {/* Decorative Grid */}
                <div className={`absolute inset-0 bg-[linear-gradient(${theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}_1px,transparent_1px),linear-gradient(90deg,${theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-30`} />

                <div className="relative z-10">
                    <h2 className="text-2xl font-black uppercase tracking-widest text-amber-500 flex items-center gap-3">
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Store className="w-7 h-7" /></motion.div>
                        Creator Upgrades
                    </h2>
                    <p className={`${textMuted} text-sm mt-1 font-medium`}>Unlock massive 3D widgets to accelerate your stream growth.</p>
                </div>

                <div className={`${subHeaderBg} border ${borderClass} px-5 py-3 rounded-xl flex items-center gap-4 relative z-10 shrink-0 shadow-sm`}>
                    <div className="flex flex-col">
                        <span className={`text-[10px] uppercase font-bold tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Available Liquidity</span>
                        <span className="text-xl font-black text-emerald-500 flex items-center">
                            <IndianRupee className="w-4 h-4 mr-1" /> {user?.walletBalance || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* ERROR/SUCCESS ALERTS */}
            <AnimatePresence>
                {errorMsg && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />
                        <p className="text-red-400 font-bold text-sm uppercase tracking-wider">{errorMsg}</p>
                    </motion.div>
                )}
                {successMsg && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-emerald-500/10 border border-emerald-500/50 p-4 rounded-xl flex items-center gap-3">
                        <Sparkles className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                        <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider">{successMsg}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TOGGLE TABS */}
            <div className={`flex ${subHeaderBg} p-1 rounded-xl border ${borderClass} w-fit shadow-inner`}>
                <button
                    onClick={() => setStoreTab('goals')}
                    className={`px-6 py-2 rounded-lg font-black uppercase text-sm tracking-widest transition-all ${storeTab === 'goals' ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' : `${textMuted} hover:text-amber-500`}`}
                >
                    Elite Goals
                </button>
                <button
                    onClick={() => setStoreTab('alerts')}
                    className={`px-6 py-2 rounded-lg font-black uppercase text-sm tracking-widest transition-all ${storeTab === 'alerts' ? 'bg-sky-500 text-black shadow-[0_0_15px_rgba(14,165,233,0.4)]' : `${textMuted} hover:text-sky-500`}`}
                >
                    Elite Alerts
                </button>
            </div>

            {/* STORE GRID */}
            <div className="grid lg:grid-cols-2 gap-8">

                {/* LEFT COMPONENT: Catalog */}
                <div className="space-y-4">
                    <h3 className={`text-sm font-black uppercase tracking-widest pl-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {storeTab === 'goals' ? 'Elite Goal Overlays' : 'Elite Alert Overlays'}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {activeList.map(item => {
                            const owned = storeTab === 'goals' ? isGoalUnlocked(item.id) : isAlertUnlocked(item.id);
                            const isSelected = activeSelectedId === item.id;

                            // Color scheme based on tab for selection styling
                            const activeBorderColor = storeTab === 'goals' ? 'border-amber-500' : 'border-sky-500';
                            const activeBgColor = storeTab === 'goals' ? 'bg-amber-500/10' : 'bg-sky-500/10';
                            const activeShadowColor = storeTab === 'goals' ? 'shadow-amber-500/10' : 'shadow-sky-500/10';

                            return (
                                <motion.button
                                    key={item.id}
                                    whileHover={{ scale: 1.05, translateY: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        if (storeTab === 'goals') setSelectedGoalStyle(item.id);
                                        else setSelectedAlertStyle(item.id);
                                        setErrorMsg(''); setSuccessMsg('');
                                    }}
                                    className={`relative p-4 rounded-xl border flex flex-col items-start gap-2 transition-all ${isSelected ? `${activeBgColor} ${activeBorderColor} z-10 shadow-2xl ${activeShadowColor}` :
                                        `${theme === 'dark' ? 'bg-[#0f0f0f] border-white/5 hover:border-white/20 hover:bg-[#151515]' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`
                                        }`}
                                >
                                    <div className="flex justify-between w-full items-start">
                                        <Hexagon className={`w-5 h-5 ${owned ? 'text-emerald-500' : 'text-slate-600'}`} />
                                        {owned && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase border border-emerald-500/30">Owned</span>}
                                    </div>
                                    <div className="text-left mt-2">
                                        <span className={`text-sm font-black uppercase block ${item.color}`}>{item.name}</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{item.theme}</span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT COMPONENT: Action Panel */}
                <div className={`${cardBg} border ${borderClass} rounded-3xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden min-h-[480px] shadow-2xl sticky top-6 transition-all duration-500`}>
                    {/* Abstract Background Glow based on selected item */}
                    <div className={`absolute -inset-20 bg-gradient-to-tr ${selectedItem.color.replace('text-', 'from-')} to-transparent opacity-[0.08] blur-3xl pointer-events-none transition-all duration-700`} />

                    <div className="w-full relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-6 opacity-60">
                            <Monitor className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Live Stream Preview</span>
                        </div>

                        {/* PREVIEW CONTAINER */}
                        <div className={`w-full ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-900/5'} rounded-2xl border ${borderClass} p-4 py-12 flex items-center justify-center mb-6 overflow-hidden min-h-[160px] shadow-inner`}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedItem.id}
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 0.75, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="origin-center w-full flex items-center justify-center"
                                >
                                    {storeTab === 'goals' ? (
                                        <div className="scale-75 sm:scale-90">
                                            <PremiumGoalOverlays
                                                goal={{
                                                    title: 'ELITE PERFORMANCE',
                                                    targetAmount: 50000,
                                                    currentProgress: 32500,
                                                    stylePreference: selectedItem.id
                                                }}
                                                percentage={65}
                                                isComplete={false}
                                            />
                                        </div>
                                    ) : (
                                        <div className="scale-110">
                                            <PremiumAlertPreview
                                                donorName="LEGEND_USER"
                                                amount={2000}
                                                message="Activating Elite Sequence..."
                                                sticker="zap"
                                                stylePreference={selectedItem.id}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <h4 className={`text-2xl font-black uppercase tracking-widest ${selectedItem.color} drop-shadow-sm`}>
                            {selectedItem.name}
                        </h4>
                        <p className={`${textMuted} text-[11px] font-medium leading-relaxed mt-2 mx-auto max-w-[280px]`}>
                            Sequences a massive 3D <strong>{selectedItem.theme}</strong> {storeTab === 'goals' ? 'module' : 'animation'} into your node matrix.
                        </p>
                    </div>

                    <div className="w-full relative z-10 mt-6">
                        <div className="mb-6">
                            <span className={`text-4xl font-black font-mono tracking-tighter flex items-center justify-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                <IndianRupee className={`w-8 h-8 mr-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-300'}`} />
                                {selectedItem.basePrice}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-widest block mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Deduction Authorization Required</span>
                        </div>


                        <motion.button
                            whileHover={!alreadyOwned && !isProcessing ? { scale: 1.02, translateY: -2 } : {}}
                            whileTap={!alreadyOwned && !isProcessing ? { scale: 0.98 } : {}}
                            onClick={handlePurchase}
                            disabled={isProcessing}
                            className={`w-full py-5 rounded-xl text-lg font-black flex items-center justify-center gap-3 uppercase italic transition shadow-xl relative z-10 ${alreadyOwned
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed border-slate-700/50'
                                : storeTab === 'goals'
                                    ? 'bg-amber-400 text-black hover:bg-amber-300 shadow-amber-500/20'
                                    : 'bg-sky-400 text-black hover:bg-sky-300 shadow-sky-500/20'
                                }`}
                        >
                            {isProcessing ? <Loader2 className="animate-spin w-5 h-5 text-black" /> : (
                                alreadyOwned ? (
                                    <>ALREADY SECURED</>
                                ) : (
                                    <>AUTHORIZE PURCHASE <Sparkles className="w-5 h-5 text-black" /></>
                                )
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStore;

import React, { useState } from 'react';
import axios from '../api/axios';
import { Hexagon, Sparkles, AlertTriangle, Loader2, IndianRupee, Store, Monitor, Play, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumStorefront from '../components/store/PremiumStorefront';

const ELITE_THEMES = [
    {
        id: 'live_space',
        title: "Zero-Gravity",
        description: "Cinematic Earth orbit with atmospheric blue glow and floating stardust.",
        price: "₹10,000",
        videoPreviewUrl: "https://cdn.pixabay.com/video/2020/04/17/36425-410884849_large.mp4"
    },
    {
        id: 'live_erangel',
        title: "Red-Zone",
        description: "Tactical warzone with battlefield smoke and pulsing red vignettes.",
        price: "₹10,000",
        videoPreviewUrl: "https://cdn.pixabay.com/video/2021/08/25/86278-592882191_large.mp4"
    },
    {
        id: 'live_cyber',
        title: "Hacker OS",
        description: "Digital rain with scanline CRT overlays and heavy dark vignettes.",
        price: "₹10,000",
        videoPreviewUrl: "https://cdn.pixabay.com/video/2023/10/22/185987-876805847_large.mp4"
    },
    {
        id: 'live_synthwave',
        title: "Neon Overdrive",
        description: "Infinite 3D scrolling grid with pulsing synthwave sun.",
        price: "₹10,000",
        videoPreviewUrl: "https://cdn.pixabay.com/video/2023/10/22/185987-876805847_large.mp4"
    },
    {
        id: 'live_kawaii',
        title: "Sky Sanctuary",
        description: "Dynamic Day/Night cycle with VTuber parallax cloud layers.",
        price: "₹10,000",
        videoPreviewUrl: "https://cdn.pixabay.com/video/2020/04/17/36425-410884849_large.mp4"
    },
    {
        id: 'live_dragon',
        title: "Dragon Hoard",
        description: "Mystic runes and gold embers with an obsidian glass finish.",
        price: "₹10,000",
        videoPreviewUrl: "https://cdn.pixabay.com/video/2021/08/25/86278-592882191_large.mp4"
    }
];


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
    { id: 'plinko_drop', name: 'Plinko Drop', theme: 'Arcade Physics', basePrice: 8999, color: 'text-indigo-400' },
];

const PREMIUM_WIDGETS = [
    { id: 'wd4', name: 'Midnight Cruiser Matrix', theme: 'Holographic Revenue Chart', basePrice: 12000, color: 'text-indigo-400' },
];

const DashboardStore = ({ theme, user, setUser }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Load Razorpay Script
    React.useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const handleWalletPayment = (price) => {
        const priceNum = typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, '')) : price;
        if (user.walletBalance >= priceNum) {
            // Instant wallet deduction
            setUser(prev => ({ ...prev, walletBalance: prev.walletBalance - priceNum }));
            return true;
        }
        return false;
    };

    const handleBuyTheme = async (themeId) => {
        setIsProcessing(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `/api/user/buy-nexus-theme`,
                { themeId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUser(prev => ({ ...prev, walletBalance: res.data.walletBalance, nexusTheme: res.data.nexusTheme, unlockedNexusThemes: res.data.unlockedNexusThemes }));
            setSuccessMsg(`Elite Environment Synchronized: ${ELITE_THEMES.find(t => t.id === themeId).title}!`);
            localStorage.setItem('nexusTheme', res.data.nexusTheme);
            window.dispatchEvent(new CustomEvent('nexus-theme-change', { detail: { theme: res.data.nexusTheme } }));
        } catch (err) {
            setErrorMsg(err.response?.data?.msg || 'Transaction Failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEquipTheme = async (themeId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                '/api/user/update-profile',
                { nexusTheme: themeId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(prev => ({ ...prev, nexusTheme: res.data.nexusTheme }));
            setSuccessMsg(`Theme Switched to ${ELITE_THEMES.find(t => t.id === themeId).title}!`);
            localStorage.setItem('nexusTheme', res.data.nexusTheme);
            window.dispatchEvent(new CustomEvent('nexus-theme-change', { detail: { theme: res.data.nexusTheme } }));
        } catch (err) {
            setErrorMsg("Failed to switch environment.");
        }
    };

    const handleBuyWidget = async (widgetId) => {
        setIsProcessing(true);
        setErrorMsg('');
        setSuccessMsg('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                '/api/user/buy-widget',
                { widgetId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(prev => ({ ...prev, walletBalance: res.data.walletBalance, ownedWidgets: res.data.ownedWidgets, activeRevenueWidget: res.data.activeRevenueWidget }));
            setSuccessMsg(`Widget deployed: ${PREMIUM_WIDGETS.find(w => w.id === widgetId).name}!`);
        } catch (err) {
            setErrorMsg(err.response?.data?.msg || 'Widget Transaction Failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEquipWidget = async (widgetId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                '/api/user/equip-widget',
                { widgetId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(prev => ({ ...prev, activeRevenueWidget: res.data.activeRevenueWidget }));
            setSuccessMsg(`Widget equipped!`);
        } catch (err) {
            setErrorMsg('Failed to equip widget.');
        }
    };

    const handlePurchase = async (type, styleId) => {
        setIsProcessing(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const token = localStorage.getItem('token');
            const endpoint = type === 'goals' ? '/buy-premium-style' : '/buy-premium-alert';
            const payload = { styleId };

            const res = await axios.post(
                `/api/user${endpoint}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (type === 'goals') {
                setUser(prev => ({ ...prev, walletBalance: res.data.walletBalance, goalSettings: res.data.goalSettings }));
                setSuccessMsg(`Successfully unlocked & equipped: ${PREMIUM_GOALS.find(g => g.id === styleId).name}!`);
            } else {
                setUser(prev => ({ ...prev, walletBalance: res.data.walletBalance, overlaySettings: res.data.overlaySettings }));
                setSuccessMsg(`Successfully unlocked & equipped: ${PREMIUM_ALERTS.find(g => g.id === styleId).name}!`);
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.msg || 'Transaction Failed');
        } finally {
            setIsProcessing(false);
        }
    };

    // --- RAZORPAY INTEGRATION API CALLS ---
    const createStoreOrder = async (category, itemId) => {
        const token = localStorage.getItem('token');
        const res = await axios.post(
            '/api/user/create-store-order',
            { category, itemId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    };

    const verifyStorePayment = async (paymentData, category, itemId) => {
        setIsProcessing(true);
        setErrorMsg('');
        setSuccessMsg('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                '/api/user/verify-store-payment',
                { ...paymentData, category, itemId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Dynamically update user state based on the backend response
            setUser(prev => ({
                ...prev,
                walletBalance: res.data.walletBalance,
                nexusTheme: res.data.nexusTheme || prev.nexusTheme,
                unlockedNexusThemes: res.data.unlockedNexusThemes || prev.unlockedNexusThemes,
                goalSettings: res.data.goalSettings || prev.goalSettings,
                overlaySettings: res.data.overlaySettings || prev.overlaySettings,
                ownedWidgets: res.data.ownedWidgets || prev.ownedWidgets,
                activeRevenueWidget: res.data.activeRevenueWidget || prev.activeRevenueWidget
            }));

            setSuccessMsg(res.data.msg);

            // Dispatch event for theme change if applicable
            if (category === 'themes' && res.data.nexusTheme) {
                localStorage.setItem('nexusTheme', res.data.nexusTheme);
                window.dispatchEvent(new CustomEvent('nexus-theme-change', { detail: { theme: res.data.nexusTheme } }));
            }

            return true;
        } catch (err) {
            setErrorMsg(err.response?.data?.msg || 'Payment Verification Failed');
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-10 max-w-[1600px] pb-20 w-full px-4 mx-auto font-sans">

            {/* HEADER ROW - INTEGRATED WITH WALLET BALANCE */}
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border p-6 rounded-2xl relative overflow-hidden transition-all duration-500 theme-card ${theme === 'light' ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-[var(--nexus-panel)] border-[var(--nexus-border)] shadow-[var(--nexus-glow)]'}`}>


                <div className="relative z-10 flex items-center gap-4">
                    <div className={`relative p-3 rounded-xl border group ${theme === 'light' ? 'bg-emerald-100/50 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                        <Store className={`w-6 h-6 relative z-10 ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-500'}`} />
                        <Hexagon className={`absolute inset-0 w-full h-full opacity-20 scale-150 group-hover:rotate-90 transition-all duration-700 ${theme === 'light' ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        <Crown className={`absolute -top-2 -right-2 w-4 h-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-500'}`} />
                    </div>
                    <div>
                        <h2 className={`text-xl font-black uppercase tracking-widest flex items-center gap-3 ${theme === 'light' ? 'text-emerald-950' : 'text-[var(--nexus-text)]'}`}>
                            <Monitor className={`w-5 h-5 opacity-40 shrink-0 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-500'}`} />
                            Marketplace Hub
                        </h2>
                        <p className={`text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-2 ${theme === 'light' ? 'text-emerald-800' : 'text-[var(--nexus-text-muted)]'}`}>
                            <Play className="w-3 h-3 text-emerald-500" /> Authorize Node Upgrades
                        </p>
                    </div>
                </div>

                <div className={`border px-6 py-4 rounded-2xl flex items-center gap-4 relative z-10 shrink-0 shadow-inner backdrop-blur-md group/balance ${theme === 'light' ? 'bg-white/80 border-emerald-100 shadow-emerald-900/5' : 'bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)]'}`}>
                    <Loader2 className={`absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 opacity-20 animate-spin-slow pointer-events-none ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-500'}`} />
                    <div className="flex flex-col">
                        <span className={`text-[10px] uppercase font-bold tracking-[0.2em] opacity-70 ${theme === 'light' ? 'text-emerald-900/60' : 'text-[var(--nexus-text-muted)]'}`}>Node Balance</span>
                        <span className={`text-2xl font-black flex items-center ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-500'}`}>
                            <IndianRupee className={`w-5 h-5 mr-1 ${theme === 'light' ? 'text-emerald-600/70' : ''}`} /> {user?.walletBalance || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* ERROR/SUCCESS ALERTS */}
            <AnimatePresence>
                {errorMsg && (
                    <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />
                        <p className="text-red-400 font-bold text-xs uppercase tracking-wider">{errorMsg}</p>
                    </motion.div>
                )}
                {successMsg && (
                    <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} className="bg-emerald-500/10 border border-emerald-500/50 p-4 rounded-xl flex items-center gap-3">
                        <Sparkles className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                        <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider">{successMsg}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* THE SLIDING STOREFRONT ENGINE */}
            <PremiumStorefront
                user={user}
                setUser={setUser}
                eliteThemes={ELITE_THEMES}
                premiumGoals={PREMIUM_GOALS}
                premiumAlerts={PREMIUM_ALERTS}
                premiumWidgets={PREMIUM_WIDGETS}
                handleBuyTheme={handleBuyTheme}
                handleEquipTheme={handleEquipTheme}
                handlePurchase={handlePurchase}
                handleBuyWidget={handleBuyWidget}
                handleEquipWidget={handleEquipWidget}
                handleWalletPayment={handleWalletPayment}
                createStoreOrder={createStoreOrder}
                verifyStorePayment={verifyStorePayment}
                isProcessing={isProcessing}
                theme={theme}
            />
        </div>
    );
};

export default DashboardStore;

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
    Paintbrush, Target, BellRing, LayoutTemplate, Loader2,
    ArrowUpRight, ShoppingCart, Zap, ShieldCheck, Package,
    Wallet, User, Trophy, Crown, MessageSquare, Gift
} from 'lucide-react';
import LiveThemeEngine from '../LiveThemeEngine';
import PremiumPreviewModal from './PremiumPreviewModal';
import PremiumAlertPreview from '../PremiumAlertPreview';
import PremiumGoalOverlays from '../PremiumGoalOverlays';
import CyberGoalBar from '../CyberGoalBar';
import PaymentChoiceModal from './PaymentChoiceModal';
import DeploymentAnimation from './DeploymentAnimation';

const PREMIUM_GOAL_STYLES = [
    'black_hole', 'hex_core', 'rune_monolith', 'hologram_glitch',
    'alchemist_flask', 'redline_dash', 'loot_dispenser', 'mecha_lens'
];

// The 4 Elite Categories with Kinetic Animation Hooks
const STORE_CATEGORIES = [
    {
        id: 'themes',
        label: 'Nexus',
        icon: (active) => <Paintbrush className={`w-4 h-4 transition-transform duration-500 ${active ? 'rotate-12 scale-125' : 'group-hover:rotate-[-12deg]'}`} />
    },
    {
        id: 'goals',
        label: 'Goals',
        icon: (active) => <Target className={`w-4 h-4 transition-all duration-700 ${active ? 'rotate-180 scale-125' : 'group-hover:rotate-90'}`} />
    },
    {
        id: 'alerts',
        label: 'Alerts',
        icon: (active) => <BellRing className={`w-4 h-4 transition-all duration-300 ${active ? 'scale-125 animate-bounce' : 'group-hover:skew-x-12'}`} />
    },
    {
        id: 'widgets',
        label: 'Widgets',
        icon: (active) => <LayoutTemplate className={`w-4 h-4 transition-all duration-500 ${active ? 'scale-125 rotate-[360deg]' : 'group-hover:translate-y-[-2px]'}`} />
    },
    {
        id: 'owned',
        label: 'Owned',
        icon: (active) => <Package className={`w-4 h-4 transition-all duration-500 ${active ? 'scale-125 animate-pulse' : 'group-hover:rotate-12'}`} />
    }
];

// --- PREMIUM STORE CARD COMPONENT ---
const PremiumStoreCard = ({ item, theme, activeTab, onClick, onPurchase, isProcessing, user }) => {
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 50, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 50, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const isLight = theme === 'light';

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX, rotateY, transformStyle: "preserve-3d",
                perspective: 1000,
                clipPath: 'polygon(0 0, 92% 0, 100% 8%, 100% 100%, 8% 100%, 0 92%)'
            }}
            onClick={onClick}
            className={`group relative bg-[var(--nexus-panel)] border flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] cursor-pointer ${item.isActive
                ? 'border-[var(--nexus-accent)] shadow-[0_0_20px_var(--nexus-accent-glow)]'
                : 'border-[var(--nexus-border)] hover:border-[var(--nexus-accent)]/50'
                }`}
        >
            {/* Subtle Tech Pattern Layer */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

            {/* Premium Glow Aura */}
            <div className={`absolute -inset-20 bg-[var(--nexus-accent)]/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none`} />

            {/* Holographic Glint (Optimized) */}
            <motion.div
                animate={{
                    left: ["-150%", "150%"],
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-full h-full pointer-events-none skew-x-12 z-10"
            />

            {/* Diagonal Tech Texture */}
            <div className={`absolute inset-0 opacity-[0.03] ${isLight ? 'bg-[var(--nexus-accent)]' : 'bg-white'} pointer-events-none`} style={{ backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent_5px,currentColor_5px,currentColor_10px)' }} />

            {/* Premium Category Badge */}
            <div className="absolute top-3 left-3 z-30 pointer-events-none flex gap-2">
                <div className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest border transition-colors duration-300 ${item.isActive ? 'bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)] text-[var(--nexus-accent)]' :
                    (isLight ? 'bg-white/80 border-[var(--nexus-border)] text-[var(--nexus-text)]' : 'bg-black/80 border-[var(--nexus-border)] text-white')
                    }`}>
                    {item.isActive ? 'ACTIVE' : (activeTab === 'owned' ? item.type : item.badge)}
                </div>
                {(item.id.includes('h') || item.price?.includes('10,000') || item.isElite) && (
                    <div className="px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest bg-[var(--nexus-accent)]/10 border border-[var(--nexus-accent)]/30 text-[var(--nexus-accent)] flex items-center gap-1">
                        <Zap className="w-2 h-2" /> Elite
                    </div>
                )}
            </div>

            {/* Main Interactive Preview Container */}
            <div className="w-full h-52 border-b relative flex items-center justify-center overflow-hidden bg-[#050505] border-white/5 group-hover:border-[var(--nexus-accent)]/30 transition-colors duration-700">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,#000_100%)]" />

                <motion.div
                    style={{ translateZ: 50 }}
                    className="absolute inset-x-0 inset-y-0 flex items-center justify-center pointer-events-none"
                    initial={false}
                >
                    <motion.div 
                        className="w-[600px] h-[450px] flex items-center justify-center shrink-0 origin-center"
                        style={{
                            scale: 0.35,
                        }}
                        animate={{
                            scale: item.category === 'themes' ? 0.5 : 0.4
                        }}
                        whileHover={{
                            scale: item.category === 'themes' ? 0.55 : 0.45
                        }}
                    >
                    {item.category === 'themes' && (
                        <div className="absolute inset-0 w-[400%] h-[400%] -translate-x-[37.5%] -translate-y-[37.5%] scale-[0.2] sm:scale-[0.25] transition-transform duration-700 group-hover:scale-[0.3]">
                            <LiveThemeEngine currentTheme={item.id} isPreview={true} />
                        </div>
                    )}

                    {item.category === 'widgets' && (
                        <div className="w-full h-full flex items-center justify-center p-4">
                            {item.id === 'user_profile' && (
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="relative">
                                        <div className="absolute -inset-4 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
                                        <div className="w-16 h-16 rounded-full border-2 border-blue-500/50 p-1 bg-black/40 relative z-10 flex items-center justify-center">
                                            <User className="w-8 h-8 text-blue-400" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center">
                                            <ShieldCheck className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                    <div className="h-2 w-20 bg-blue-500/20 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ x: [-80, 80] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            className="h-full w-10 bg-blue-400"
                                        />
                                    </div>
                                </div>
                            )}
                            {item.id === 'wallet_balance' && (
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                        <Wallet className="w-3 h-3 text-emerald-400" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Balance</span>
                                    </div>
                                    <div className="text-4xl font-black italic text-emerald-400 flex items-center gap-1">
                                        <span className="text-2xl opacity-50">₹</span>
                                        <motion.span
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ repeat: Infinity, duration: 3 }}
                                        >
                                            9,999
                                        </motion.span>
                                    </div>
                                    <div className="w-full h-1 bg-emerald-500/10 rounded-full overflow-hidden mt-2">
                                        <motion.div
                                            animate={{ width: ["0%", "80%", "0%"] }}
                                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                            className="h-full bg-emerald-400"
                                        />
                                    </div>
                                </div>
                            )}
                            {item.id === 'elite_nexus' && (
                                <div className="w-full flex flex-col gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border-l-2 border-indigo-500">
                                        <Trophy className="w-3 h-3 text-indigo-400" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Top Supporters</span>
                                    </div>
                                    <div className="flex gap-2 overflow-hidden px-2">
                                        <div className="shrink-0 w-8 h-8 rounded-full border border-indigo-500/30 bg-black/40 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                                            <MessageSquare className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <div className="shrink-0 w-8 h-8 rounded-full border border-indigo-500/30 bg-black/40 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                                            <Gift className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <div className="shrink-0 w-8 h-8 rounded-full border border-indigo-500/30 bg-black/40 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                                            <div className="w-4 h-4 rounded-full bg-indigo-500/20 animate-pulse" />
                                        </div>
                                        <div className="shrink-0 w-8 h-8 rounded-full border border-indigo-500/30 bg-black/40 flex items-center justify-center opacity-50">
                                            <Crown className="w-4 h-4 text-amber-500/40" />
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-indigo-500/10 rounded-full" />
                                </div>
                            )}
                        </div>
                    )}

                    {item.category === 'alerts' && (
                        <PremiumAlertPreview
                            donorName={user?.fullName || user?.username || 'Preview'}
                            amount={parseInt(item.price?.replace('₹', '')) || 2000}
                            stylePreference={item.id}
                        />
                    )}

                    {item.category === 'goals' && (
                        PREMIUM_GOAL_STYLES.includes(item.id) ? (
                            <PremiumGoalOverlays
                                goal={{ targetAmount: 1000, currentProgress: 650, title: item.name, stylePreference: item.id }}
                                percentage={65}
                            />
                        ) : (
                            <CyberGoalBar
                                goal={{ targetAmount: 1000, currentProgress: 650, title: item.name }}
                                percentage={65}
                                goalStylePreference={item.id}
                            />
                        )
                    )}
                </motion.div>
            </motion.div>

                {/* Cyber Scanner Overlay on Hover */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--nexus-accent)] opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_linear_infinite] shadow-[0_0_15px_var(--nexus-accent)]" />
            </div>

            {/* Info Section */}
            <div className={`p-6 flex flex-col flex-1 relative z-10 transition-colors duration-500 ${isLight ? 'bg-white' : 'bg-gradient-to-b from-transparent to-[#020403]/80 backdrop-blur-md'}`} style={{ translateZ: 30 }}>
                <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-black text-xl uppercase tracking-tighter italic transition-colors group-hover:text-[var(--nexus-accent)] ${isLight ? 'text-slate-900' : 'text-[var(--nexus-text)]'}`}>
                        {item.name}
                    </h3>
                    <ArrowUpRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-[var(--nexus-accent)]`} />
                </div>

                <p className={`text-[11px] mb-8 flex-1 line-clamp-3 leading-relaxed tracking-wide ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400 font-medium'}`}>
                    {item.desc}
                </p>

                <div className={`flex items-center justify-between mt-auto border-t pt-5 border-white/5 group-hover:border-[var(--nexus-accent)]/20 transition-colors`}>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-[var(--nexus-text-muted)] font-bold">Current Price</span>
                        <span className={`font-mono font-black text-xl ${isLight ? 'text-slate-900' : 'text-[var(--nexus-text)] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]'}`}>
                            {item.isOwned ? 'SECURED' : item.price}
                        </span>
                    </div>

                    <button
                        onClick={(e) => onPurchase(e, item)}
                        disabled={isProcessing}
                        className={`font-black text-xs uppercase tracking-widest px-5 py-3 transition-all flex items-center gap-2 ${item.isOwned
                            ? (item.isActive ? (isLight ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-800 text-slate-500 cursor-not-allowed') : 'bg-[var(--nexus-accent)] text-black hover:brightness-110 shadow-lg shadow-[var(--nexus-accent)]/20')
                            : 'bg-[var(--nexus-accent)] text-black hover:brightness-125 shadow-[0_0_15px_var(--nexus-accent)]'
                            }`}
                        style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)' }}
                    >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                                {item.isOwned ? (item.isActive ? <ShieldCheck className="w-4 h-4" /> : 'EQUIP') : <ShoppingCart className="w-4 h-4" />}
                                {item.isOwned ? (item.isActive ? 'ACTIVE' : '') : 'UNLOCK'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const PremiumStorefront = ({
    user,
    setUser,
    eliteThemes,
    premiumGoals,
    premiumAlerts,
    premiumWidgets,
    handleBuyTheme,
    handleEquipTheme,
    handlePurchase,
    handleBuyWidget,
    handleEquipWidget,
    handleWalletPayment,
    createStoreOrder,
    verifyStorePayment,
    isProcessing,
    theme
}) => {
    const [activeTab, setActiveTab] = useState('themes');
    const [previewItem, setPreviewItem] = useState(null);

    // Data Mapping - Convert different formats into a unified Storefront Item format
    const getInventoryItems = () => {
        const themes = eliteThemes.map(t => ({
            ...t, id: t.id, name: t.title, desc: t.description, price: t.price,
            badge: user?.unlockedNexusThemes?.includes(t.id) ? 'SECURED' : 'THEME',
            category: 'themes', type: 'Theme', isElite: true,
            isOwned: user?.unlockedNexusThemes?.includes(t.id),
            isActive: user?.nexusTheme === t.id
        }));

        const goals = premiumGoals.map(g => ({
            ...g, id: g.id, name: g.name, desc: `${g.theme} Style Module.`, price: `₹${g.basePrice}`,
            badge: user?.goalSettings?.unlockedPremiumStyles?.includes(g.id) ? 'SECURED' : 'GOAL',
            category: 'goals', type: 'Goal',
            isOwned: user?.goalSettings?.unlockedPremiumStyles?.includes(g.id),
            isActive: user?.goalSettings?.stylePreference === g.id
        }));

        const alerts = premiumAlerts.map(a => ({
            ...a, id: a.id, name: a.name, desc: `${a.theme} Style Module.`, price: `₹${a.basePrice}`,
            badge: user?.overlaySettings?.unlockedPremiumAlerts?.includes(a.id) ? 'SECURED' : 'ALERT',
            category: 'alerts', type: 'Alert',
            isOwned: user?.overlaySettings?.unlockedPremiumAlerts?.includes(a.id),
            isActive: user?.overlaySettings?.stylePreference === a.id
        }));

        const widgets = (premiumWidgets || []).map(w => ({
            ...w, id: w.id, name: w.name, desc: `${w.theme} Dashboard Widget.`, price: `₹${w.basePrice}`,
            badge: (user?.ownedWidgets || []).includes(w.id) ? 'SECURED' : 'WIDGET',
            category: 'widgets', type: 'Widget',
            isOwned: (user?.ownedWidgets || []).includes(w.id),
            isActive: user?.activeRevenueWidget === w.id
        }));

        if (activeTab === 'themes') return themes;
        if (activeTab === 'goals') return goals;
        if (activeTab === 'alerts') return alerts;
        if (activeTab === 'widgets') return widgets;
        if (activeTab === 'owned') {
            return [...themes, ...goals, ...alerts, ...widgets].filter(item => item.isOwned);
        }
        return [];
    };

    const items = getInventoryItems();

    // Click Handlers
    const handlePreviewClick = (item) => {
        setPreviewItem(item);
    };

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedItemForPayment, setSelectedItemForPayment] = useState(null);
    const [isDeploying, setIsDeploying] = useState(false);

    const handleDirectBuy = (e, item) => {
        if (e) e.stopPropagation();
        if (item.isOwned) {
            if (item.isActive) return;
            if (item.category === 'themes') handleEquipTheme(item.id);
            else if (item.category === 'widgets') handleEquipWidget(item.id);
            else handlePurchase(item.category, item.id);
            return;
        }

        // Show payment choice modal for new purchases
        setSelectedItemForPayment(item);
        setShowPaymentModal(true);
    };

    const handlePaymentSelection = (method) => {
        setShowPaymentModal(false);
        if (method === 'wallet') {
            const priceNum = parseInt(selectedItemForPayment.price.replace(/[^0-9]/g, '')) || 0;

            // Real-time wallet deduction (instant UI feedback)
            if (handleWalletPayment(priceNum)) {
                // Trigger deployment animation
                setIsDeploying(true);

                // Process the actual purchase (server-side)
                if (selectedItemForPayment.category === 'themes') handleBuyTheme(selectedItemForPayment.id);
                else if (selectedItemForPayment.category === 'widgets') handleBuyWidget(selectedItemForPayment.id);
                else handlePurchase(selectedItemForPayment.category, selectedItemForPayment.id);
            }
        } else {
            // Razorpay logic
            handleRazorpayPayment(selectedItemForPayment);
        }
    };

    const handleRazorpayPayment = async (item) => {
        try {
            // 1. Create order on backend
            const orderData = await createStoreOrder(item.category, item.id);

            if (!orderData || !orderData.orderId) {
                console.error("Order creation failed");
                return;
            }

            // 2. Initialize Razorpay
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "DropPay Marketplace",
                description: `Unlock ${item.name}`,
                order_id: orderData.orderId,
                handler: async function (response) {
                    // 3. Verify on backend
                    const success = await verifyStorePayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    }, item.category, item.id);

                    if (success) {
                        setIsDeploying(true);
                    }
                },
                theme: {
                    color: "#10B981"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                console.error("Razorpay Payment Failed:", response.error);
            });
            rzp.open();
        } catch (error) {
            console.error("Error launching Razorpay:", error);
        }
    };

    return (
        <div className="w-full flex flex-col h-full font-sans max-w-[1600px] mx-auto">

            {/* --- STORE TABS (NEURAL UPLINK) --- */}
            <div className="mb-8 relative">
                {/* Holographic Scan Line (Animates on Switch) */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab + "_scan"}
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="absolute bottom-0 h-[3px] w-[300px] bg-gradient-to-r from-transparent via-[var(--nexus-accent)] to-transparent blur-md z-20 pointer-events-none hidden md:block"
                        style={{ boxShadow: `0 0 30px var(--nexus-accent-glow)` }}
                    />
                </AnimatePresence>

                {/* Sliding Tab Navigation */}
                <div className={`flex gap-6 border-b overflow-x-auto scrollbar-hide perspective-1000 border-white/5`}>
                    {STORE_CATEGORIES.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveTab(category.id)}
                            className={`group relative px-6 py-5 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-500 flex-shrink-0 ${activeTab === category.id
                                ? 'text-white'
                                : (theme === 'light' ? 'text-slate-900/40 hover:text-slate-900' : 'text-slate-500 hover:text-slate-300')
                                }`}
                        >
                            {/* Kinetic Icon */}
                            <div className={`relative p-2 rounded-xl border transition-all duration-500 ${activeTab === category.id ? 'bg-[var(--nexus-accent)]/10 border-[var(--nexus-accent)]/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-transparent group-hover:border-white/10'}`}>
                                {category.icon(activeTab === category.id)}
                                {activeTab === category.id && (
                                    <motion.div
                                        layoutId="icon_ping"
                                        className="absolute -inset-1 rounded-full border border-[var(--nexus-accent)] opacity-30"
                                        animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
                                        transition={{ repeat: Infinity, duration: 2.5 }}
                                    />
                                )}
                            </div>

                            <span className="relative z-10 transition-transform group-hover:translate-x-1">{category.label}</span>

                            {/* Active Tab Glowing Underline */}
                            {activeTab === category.id && (
                                <motion.div
                                    layoutId="activeStoreTab"
                                    className={`absolute bottom-0 left-0 w-full h-[4px] z-10 bg-gradient-to-r from-transparent via-[var(--nexus-accent)] to-transparent shadow-[0_0_20px_var(--nexus-accent-glow)]`}
                                >
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-white rounded-full blur-[2px] -translate-y-1/2 shadow-[0_0_10px_#fff]" />
                                </motion.div>
                            )}

                            {/* Hover Ghost Underline */}
                            <div className={`absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${theme === 'light' ? 'bg-emerald-200' : 'bg-white/10'}`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* --- SLIDING CONTENT GRID --- */}
            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20, skewX: -5 }}
                        animate={{ opacity: 1, y: 0, skewX: 0 }}
                        exit={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
                        transition={{
                            duration: 0.4,
                            ease: [0.19, 1, 0.22, 1]
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20"
                    >
                        {items.length > 0 ? items.map((item) => (
                            <PremiumStoreCard
                                key={item.id}
                                item={item}
                                theme={theme}
                                activeTab={activeTab}
                                onClick={() => handlePreviewClick(item)}
                                onPurchase={handleDirectBuy}
                                isProcessing={isProcessing}
                                user={user}
                            />
                        )) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
                                <LayoutTemplate className="w-12 h-12 text-[var(--nexus-text-muted)] opacity-20" />
                                <h3 className="text-xl font-black uppercase italic text-[var(--nexus-text-muted)]">New Gear Under Construction</h3>
                                <p className="text-xs text-[var(--nexus-text-muted)] opacity-50 max-w-xs">New tech is being forged in the lab. Check back soon for more broadcast modules.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Render the Preview Modal */}
            <PremiumPreviewModal
                isOpen={!!previewItem}
                item={previewItem}
                onClose={() => setPreviewItem(null)}
                onUnlock={(item) => handleDirectBuy(null, item)}
                theme={theme}
                user={user}
            />

            {/* Payment Choice Modal */}
            <PaymentChoiceModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSelect={handlePaymentSelection}
                balance={user?.walletBalance || 0}
                price={selectedItemForPayment?.price || '0'}
                itemName={selectedItemForPayment?.name || ''}
                theme={theme}
            />

            {/* Deployment Animation Overlay */}
            <AnimatePresence>
                {isDeploying && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95">
                        <DeploymentAnimation
                            onComplete={() => setIsDeploying(false)}
                            theme={theme}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PremiumStorefront;
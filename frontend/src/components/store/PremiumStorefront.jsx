import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paintbrush, Target, BellRing, LayoutTemplate, Sparkles, Loader2 } from 'lucide-react';
import LiveThemeEngine from '../LiveThemeEngine';
import CruiserRevenueChart from '../widgets/CruiserRevenueChart';
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

// The 4 Elite Categories
const STORE_CATEGORIES = [
    { id: 'themes', label: 'Nexus', icon: <Paintbrush className="w-4 h-4" /> },
    { id: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <BellRing className="w-4 h-4" /> },
    { id: 'widgets', label: 'Widgets', icon: <LayoutTemplate className="w-4 h-4" /> }
];

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
    isProcessing,
    theme
}) => {
    const [activeTab, setActiveTab] = useState('themes');
    const [previewItem, setPreviewItem] = useState(null);

    // Data Mapping - Convert different formats into a unified Storefront Item format
    const getInventoryItems = () => {
        if (activeTab === 'themes') {
            return eliteThemes.map(t => ({
                ...t,
                id: t.id,
                name: t.title,
                desc: t.description,
                price: t.price,
                badge: user?.unlockedNexusThemes?.includes(t.id) ? 'SECURED' : 'THEME',
                color: 'text-[var(--nexus-accent)]',
                category: 'themes',
                type: 'themes',
                isOwned: user?.unlockedNexusThemes?.includes(t.id),
                isActive: user?.nexusTheme === t.id
            }));
        }
        if (activeTab === 'goals') {
            return premiumGoals.map(g => ({
                ...g,
                id: g.id,
                name: g.name,
                desc: `${g.theme} Style Module.`,
                price: `₹${g.basePrice}`,
                badge: user?.goalSettings?.unlockedPremiumStyles?.includes(g.id) ? 'SECURED' : 'GOAL',
                color: g.color || 'text-emerald-500',
                category: 'goals',
                type: 'goals',
                isOwned: user?.goalSettings?.unlockedPremiumStyles?.includes(g.id)
            }));
        }
        if (activeTab === 'alerts') {
            return premiumAlerts.map(a => ({
                ...a,
                id: a.id,
                name: a.name,
                desc: `${a.theme} Style Module.`,
                price: `₹${a.basePrice}`,
                badge: user?.overlaySettings?.unlockedPremiumAlerts?.includes(a.id) ? 'SECURED' : 'ALERT',
                color: a.color || 'text-rose-500',
                category: 'alerts',
                type: 'alerts',
                isOwned: user?.overlaySettings?.unlockedPremiumAlerts?.includes(a.id)
            }));
        }
        if (activeTab === 'widgets' && premiumWidgets) {
            return premiumWidgets.map(w => ({
                ...w,
                id: w.id,
                name: w.name,
                desc: `${w.theme} Dashboard Widget.`,
                price: `₹${w.basePrice}`,
                badge: (user?.ownedWidgets || []).includes(w.id) ? 'SECURED' : 'WIDGET',
                color: w.color || 'text-indigo-400',
                category: 'widgets',
                type: 'widgets',
                isOwned: (user?.ownedWidgets || []).includes(w.id),
                isActive: user?.activeRevenueWidget === w.id
            }));
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

    const handleRazorpayPayment = (item) => {
        const priceNum = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
        const options = {
            key: "rzp_test_your_key", // Should come from config
            amount: priceNum * 100,
            currency: "INR",
            name: "DropPay Marketplace",
            description: `Unlock ${item.name}`,
            handler: function (response) {
                // Success!
                setIsDeploying(true);
                if (item.category === 'themes') handleBuyTheme(item.id);
                else if (item.category === 'widgets') handleBuyWidget(item.id);
                else handlePurchase(item.category, item.id);
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div className="w-full flex flex-col h-full font-sans max-w-[1600px] mx-auto">

            {/* --- STORE TABS --- */}
            <div className="mb-8">
                {/* Sliding Tab Navigation */}
                <div className="flex gap-2 border-b border-[var(--nexus-border)] overflow-x-auto scrollbar-hide">
                    {STORE_CATEGORIES.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveTab(category.id)}
                            className={`relative px-6 py-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === category.id ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text-muted)] hover:text-[var(--nexus-text)]'}`}
                        >
                            {category.icon}
                            {category.label}
                            {/* Active Tab Glowing Underline */}
                            {activeTab === category.id && (
                                <motion.div
                                    layoutId="activeStoreTab"
                                    className="absolute bottom-0 left-0 w-full h-1 bg-[var(--nexus-accent)] shadow-[0_0_10px_var(--nexus-accent)]"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- SLIDING CONTENT GRID --- */}
            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.95, rotateY: 15, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.95, rotateY: -15, filter: 'blur(10px)' }}
                        transition={{
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                            opacity: { duration: 0.3 }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20"
                    >
                        {items.length > 0 ? items.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handlePreviewClick(item)}
                                className={`group relative bg-[var(--nexus-panel)] border flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.8)] cursor-pointer ${item.isActive ? 'border-[var(--nexus-accent)]' : 'border-[var(--nexus-border)] hover:border-[var(--nexus-accent)]'}`}
                                style={{ clipPath: 'polygon(0 0, 92% 0, 100% 8%, 100% 100%, 8% 100%, 0 92%)' }}
                            >
                                {/* Diagonal Tech Texture */}
                                <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#fff_5px,#fff_10px)] pointer-events-none" />

                                {/* Top Image/Preview Block */}
                                <div className="w-full h-48 bg-black border-b border-[var(--nexus-border)] relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e293b_0%,#000_100%)] opacity-50" />

                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none transform scale-[0.4] md:scale-[0.45]">
                                        {item.category === 'themes' && (
                                            <div className="absolute inset-0 w-[400%] h-[400%] -translate-x-[37.5%] -translate-y-[37.5%] scale-[0.25]">
                                                <LiveThemeEngine currentTheme={item.id} isPreview={true} />
                                            </div>
                                        )}

                                        {item.category === 'widgets' && (
                                            <div className="w-full h-full flex items-center justify-center transform scale-[1.5]">
                                                {item.id === 'wd4' && <CruiserRevenueChart />}
                                            </div>
                                        )}

                                        {item.category === 'alerts' && (
                                            <PremiumAlertPreview
                                                donorName="PREVIEW"
                                                amount={parseInt(item.price.replace('₹', '')) || 2000}
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
                                    </div>

                                    {!item.videoPreviewUrl && item.category === 'themes' && (
                                        <div className="w-20 h-20 border border-slate-700 transform rotate-45 flex items-center justify-center opacity-50 group-hover:scale-110 group-hover:border-[var(--nexus-accent)] transition-all duration-500 z-10">
                                            <Sparkles className={`w-8 h-8 transform -rotate-45 ${item.color}`} />
                                        </div>
                                    )}

                                    <span className={`absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-[var(--nexus-border)] text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 z-10 ${item.isActive ? 'border-[var(--nexus-accent)] text-[var(--nexus-accent)]' : ''}`}>
                                        {item.isActive ? 'ACTIVE' : item.badge}
                                    </span>

                                </div>

                                {/* Details & Action */}
                                <div className="p-5 flex flex-col flex-1 relative z-10 bg-gradient-to-t from-[var(--nexus-panel)] to-transparent">
                                    <h3 className="text-[var(--nexus-text)] font-black text-xl uppercase tracking-tighter italic mb-2 group-hover:text-[var(--nexus-accent)] transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-[var(--nexus-text-muted)] text-xs mb-6 flex-1 line-clamp-2">
                                        {item.desc}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto border-t border-[var(--nexus-border)] pt-4">
                                        <span className="text-[var(--nexus-text)] font-mono font-black text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                            {item.isOwned ? 'SECURED' : item.price}
                                        </span>
                                        <button
                                            onClick={(e) => handleDirectBuy(e, item)}
                                            disabled={isProcessing}
                                            className={`font-black text-xs uppercase tracking-widest px-5 py-3 transition-all shadow-[0_0_15px_var(--nexus-accent)] ${item.isOwned ? (item.isActive ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-500') : 'bg-[var(--nexus-accent)] text-black hover:brightness-125'}`}
                                            style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)' }}
                                        >
                                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : (item.isOwned ? (item.isActive ? 'ACTIVE' : 'EQUIP') : 'UNLOCK')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
                                <LayoutTemplate className="w-12 h-12 text-[var(--nexus-text-muted)] opacity-20" />
                                <h3 className="text-xl font-black uppercase italic text-[var(--nexus-text-muted)]">Arsenal Expansion in Progress</h3>
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
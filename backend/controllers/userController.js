const User = require('../models/User');
const Drop = require('../models/Drop');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.requestWithdrawal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ msg: "Security Alert: Identity Node Not Found in the registry." });

        const MIN_WITHDRAWAL = 1000;

        if (user.walletBalance < MIN_WITHDRAWAL) {
            return res.status(400).json({ msg: `Insufficient Liquidity. Minimum node balance required for payout is ₹${MIN_WITHDRAWAL}.` });
        }

        if (!amount || isNaN(amount) || amount < MIN_WITHDRAWAL) {
            return res.status(400).json({ msg: `Invalid Amount. Minimum withdrawal is ₹${MIN_WITHDRAWAL}.` });
        }

        if (amount > user.walletBalance) {
            return res.status(400).json({ msg: "Withdrawal exceeds available balance." });
        }

        // Secure state transfer: Deduct requested amount & move to pending lock
        user.walletBalance -= amount;
        user.financialMetrics.pendingPayouts += amount;

        await user.save();

        // Create a Pending Ledger Entry for the user to track
        await Drop.create({
            streamerId: user.streamerId,
            donorName: "WITHDRAWAL",
            amount: -amount,
            message: "Payout Request Pending Approval",
            sticker: 'zap',
            status: 'pending'
        });

        res.status(200).json({
            msg: `Withdrawal of ₹${amount} initiated successfully.`,
            walletBalance: user.walletBalance,
            pendingPayouts: user.financialMetrics.pendingPayouts
        });

    } catch (err) {
        console.error("Payout Request Error:", err);
        res.status(500).json({ msg: "System Error: Failed to Dispatch Payout Request. Node connection unstable." });
    }
};

exports.purchasePremiumStyle = async (req, res) => {
    try {
        const { styleId, targetAmount } = req.body;
        const PRICE = 2000; // Hardcoded elite tier price

        if (!styleId) return res.status(400).json({ msg: "Style ID required" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Check if already unlocked
        if (user.goalSettings.unlockedPremiumStyles.includes(styleId)) {
            // Even if unlocked, if they just clicked it, let's equip it.
            user.goalSettings.stylePreference = styleId;
            if (targetAmount) user.goalSettings.targetAmount = targetAmount;
            await user.save();

            // Emit socket update
            const io = req.app.get('io');
            if (io) io.to(user.streamerId).emit('goal-update', user.goalSettings);

            return res.status(200).json({ msg: "Style Equipped!", goalSettings: user.goalSettings });
        }

        // Check balance
        if (user.walletBalance < PRICE) {
            return res.status(400).json({ msg: `Insufficient Wallet Balance. ₹${PRICE} required to sequence this node.` });
        }

        // Deduct Balance and Add to Unlocked
        user.walletBalance -= PRICE;
        user.goalSettings.unlockedPremiumStyles.push(styleId);

        // Auto-Equip it immediately
        user.goalSettings.stylePreference = styleId;
        if (targetAmount) user.goalSettings.targetAmount = targetAmount;

        await user.save();

        // Create a Drop record for the ledger (System Debit)
        await Drop.create({
            streamerId: user.streamerId,
            donorName: "SYSTEM_DEBIT",
            amount: -PRICE,
            message: `Purchased Elite Goal Override: [${styleId.toUpperCase()}]`,
            sticker: 'zap',
            status: 'completed',
            razorpayPaymentId: 'internal_wallet_txn',
            razorpayOrderId: 'internal_wallet_txn'
        });

        // Emit Socket Update to live browser sources
        const io = req.app.get('io');
        if (io) {
            io.to(user.streamerId).emit('goal-update', user.goalSettings);
            if (user.obsKey) io.to(user.obsKey).emit('goal-update', user.goalSettings);
        }

        res.status(200).json({
            msg: "Elite Sequence Unlocked & Equipped!",
            walletBalance: user.walletBalance,
            goalSettings: user.goalSettings
        });

    } catch (err) {
        console.error("Purchase Style Error:", err);
        res.status(500).json({ msg: "System Error: Style calibration failed. Database handshake incomplete." });
    }
};

const PREMIUM_ALERT_PRICES = {
    // New High-End Styles
    dragon_hoard: 7999,
    casino_jackpot: 9999,
    mecha_assembly: 6999,
    hyperdrive_warp: 5999,
    dimensional_rift: 11999,
    abyssal_kraken: 8999,
    pharaoh_tomb: 9999,
    cybernetic_brain: 10499,
    celestial_zodiac: 12000,
    // Legacy Premium Styles default to 2000 if not listed
};

exports.purchasePremiumAlert = async (req, res) => {
    try {
        const { styleId } = req.body;
        const basePrice = 2000;
        const PRICE = PREMIUM_ALERT_PRICES[styleId] || basePrice;

        if (!styleId) return res.status(400).json({ msg: "Style ID required" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Initialize array if missing from older schemas
        if (!user.overlaySettings.unlockedPremiumAlerts) {
            user.overlaySettings.unlockedPremiumAlerts = [];
        }

        // Check if already unlocked
        if (user.overlaySettings.unlockedPremiumAlerts.includes(styleId)) {
            // Even if unlocked, equip it immediately
            user.overlaySettings.stylePreference = styleId;
            await user.save();

            // Emit socket update for overlays
            const io = req.app.get('io');
            if (io) {
                if (user.streamerId) io.to(user.streamerId).emit('settings-update', user.overlaySettings);
                if (user.obsKey) io.to(user.obsKey).emit('settings-update', user.overlaySettings);
            }

            return res.status(200).json({ msg: "Alert Style Equipped!", overlaySettings: user.overlaySettings });
        }

        // Check balance
        if (user.walletBalance < PRICE) {
            return res.status(400).json({ msg: `Insufficient Wallet Balance. ₹${PRICE} required to sequence this node.` });
        }

        // Deduct Balance and Add to Unlocked
        user.walletBalance -= PRICE;
        user.overlaySettings.unlockedPremiumAlerts.push(styleId);

        // Auto-Equip it immediately
        user.overlaySettings.stylePreference = styleId;

        await user.save();

        // Create a Drop record for the ledger (System Debit)
        await Drop.create({
            streamerId: user.streamerId,
            donorName: "SYSTEM_DEBIT",
            amount: -PRICE,
            message: `Purchased Elite Alert Override: [${styleId.toUpperCase()}]`,
            sticker: 'zap',
            status: 'completed',
            razorpayPaymentId: 'internal_wallet_txn_alert',
            razorpayOrderId: 'internal_wallet_txn_alert'
        });

        // Emit Socket Update to live browser sources
        const io = req.app.get('io');
        if (io) {
            if (user.streamerId) io.to(user.streamerId).emit('settings-update', user.overlaySettings);
            if (user.obsKey) io.to(user.obsKey).emit('settings-update', user.overlaySettings);
        }

        res.status(200).json({
            msg: "Elite Alert Sequence Unlocked & Equipped!",
            walletBalance: user.walletBalance,
            overlaySettings: user.overlaySettings
        });

    } catch (err) {
        console.error("Purchase Alert Error:", err);
        res.status(500).json({ msg: "System Error: Alert calibration failed. Database handshake incomplete." });
    }
};

exports.purchaseNexusTheme = async (req, res) => {
    try {
        const { themeId } = req.body;
        const PRICE = 10000;

        if (!themeId) return res.status(400).json({ msg: "Theme ID required" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Initialize array if missing
        if (!user.unlockedNexusThemes) {
            user.unlockedNexusThemes = [];
        }

        // Check if already unlocked
        if (user.unlockedNexusThemes.includes(themeId)) {
            user.nexusTheme = themeId;
            await user.save();
            return res.status(200).json({ msg: "Theme Equipped!", nexusTheme: user.nexusTheme });
        }

        // Check balance
        if (user.walletBalance < PRICE) {
            return res.status(400).json({ msg: `Insufficient Wallet Balance. ₹${PRICE} required to unlock this environment.` });
        }

        // Deduct & Unlock
        user.walletBalance -= PRICE;
        user.unlockedNexusThemes.push(themeId);
        user.nexusTheme = themeId; // Auto-Equip

        await user.save();

        // Ledger Entry
        await Drop.create({
            streamerId: user.streamerId,
            donorName: "SYSTEM_DEBIT",
            amount: -PRICE,
            message: `Purchased Elite Workspace Theme: [${themeId.toUpperCase()}]`,
            sticker: 'zap',
            status: 'completed',
            razorpayPaymentId: 'internal_wallet_txn_theme',
            razorpayOrderId: 'internal_wallet_txn_theme'
        });

        res.status(200).json({
            msg: "Elite Environment Synchronized & Active!",
            walletBalance: user.walletBalance,
            nexusTheme: user.nexusTheme,
            unlockedNexusThemes: user.unlockedNexusThemes
        });

    } catch (err) {
        console.error("Purchase Theme Error:", err);
        res.status(500).json({ msg: "System Error: Environment synthesis failed. Node unresponsive." });
    }
};

// ==================== WIDGET PURCHASE ====================
const WIDGET_CATALOG = {
    wd4: { name: 'Midnight Cruiser Matrix', price: 12000 },
    neural_profile: { name: 'Neural Profile (Identity Node)', price: 1500 },
    atomic_balance: { name: 'Atomic Balance (Revenue Node)', price: 2000 },
    elite_nexus: { name: 'Elite Nexus (Social Node)', price: 2500 }
};

exports.purchaseWidget = async (req, res) => {
    try {
        const { widgetId } = req.body;
        const catalog = WIDGET_CATALOG[widgetId];
        if (!catalog) return res.status(400).json({ msg: "Unknown widget ID." });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found." });

        if (!user.ownedWidgets) user.ownedWidgets = [];

        // Already owned — just equip
        if (user.ownedWidgets.includes(widgetId)) {
            user.activeRevenueWidget = widgetId;
            await user.save();
            return res.status(200).json({
                msg: "Widget already owned — equipped!",
                ownedWidgets: user.ownedWidgets,
                activeRevenueWidget: user.activeRevenueWidget
            });
        }

        if (user.walletBalance < catalog.price) {
            return res.status(400).json({ msg: `Insufficient Liquidity. ₹${catalog.price} required to sequence this widget.` });
        }

        user.walletBalance -= catalog.price;
        user.ownedWidgets.push(widgetId);
        user.activeRevenueWidget = widgetId; // Auto-equip on purchase
        await user.save();

        await Drop.create({
            streamerId: user.streamerId,
            donorName: "SYSTEM_DEBIT",
            amount: -catalog.price,
            message: `Purchased Widget: [${catalog.name.toUpperCase()}]`,
            sticker: 'zap',
            status: 'completed',
            razorpayPaymentId: 'internal_wallet_txn_widget',
            razorpayOrderId: 'internal_wallet_txn_widget'
        });

        res.status(200).json({
            msg: `${catalog.name} activated!`,
            walletBalance: user.walletBalance,
            ownedWidgets: user.ownedWidgets,
            activeRevenueWidget: user.activeRevenueWidget
        });
    } catch (err) {
        console.error("Purchase Widget Error:", err);
        res.status(500).json({ msg: "Widget deployment failed." });
    }
};

// ==================== WIDGET EQUIP ====================
exports.equipWidget = async (req, res) => {
    try {
        const { widgetId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found." });

        const ownedWidgets = user.ownedWidgets || [];
        if (widgetId !== 'default' && !ownedWidgets.includes(widgetId)) {
            return res.status(403).json({ msg: "Widget not owned." });
        }

        user.activeRevenueWidget = widgetId;
        await user.save();

        res.status(200).json({
            msg: `Widget equipped: ${widgetId}`,
            activeRevenueWidget: user.activeRevenueWidget
        });
    } catch (err) {
        console.error("Equip Widget Error:", err);
        res.status(500).json({ msg: "Equip failed." });
    }
};

// ==================== UNIVERSAL EQUIP ASSET ====================
exports.equipAsset = async (req, res) => {
    try {
        const { category, assetId } = req.body;
        if (!category || !assetId) return res.status(400).json({ msg: "category and assetId required." });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found." });

        let responsePayload = {};

        switch (category) {
            case 'theme': {
                const owned = user.unlockedNexusThemes || [];
                if (assetId !== 'void' && assetId !== 'aero' && assetId !== 'obsidian_monolith' && assetId !== 'kawaii' && assetId !== 'arcade' && assetId !== 'bgmi' && !owned.includes(assetId)) {
                    return res.status(403).json({ msg: "Theme not owned." });
                }
                user.nexusTheme = assetId;
                await user.save();
                responsePayload = { category: 'theme', equipped: user.nexusTheme, nexusTheme: user.nexusTheme };
                break;
            }
            case 'alert': {
                const ownedAlerts = user.overlaySettings?.unlockedPremiumAlerts || [];
                const freeAlerts = ['modern', 'comic', 'playful', 'pixel', 'kawaii', 'cyberhud', 'bgmi', 'gta', 'coc', 'avatar', 'godzilla', 'default'];
                if (!freeAlerts.includes(assetId) && !ownedAlerts.includes(assetId)) {
                    return res.status(403).json({ msg: "Alert not owned." });
                }
                user.overlaySettings.stylePreference = assetId;
                await user.save();
                responsePayload = { category: 'alert', equipped: assetId, overlaySettings: user.overlaySettings };
                break;
            }
            case 'goal': {
                const ownedGoals = user.goalSettings?.unlockedPremiumStyles || [];
                const freeGoals = ['modern', 'glass_jar', 'gta', 'coc', 'bgmi', 'avatar', 'godzilla', 'arc_reactor_horizontal', 'arc_reactor_circular', 'boss_fight', 'plasma_battery', 'pixel_coin_row', 'pixel_coin_vault', 'default'];
                if (!freeGoals.includes(assetId) && !ownedGoals.includes(assetId)) {
                    return res.status(403).json({ msg: "Goal style not owned." });
                }
                user.goalSettings.stylePreference = assetId;
                await user.save();
                responsePayload = { category: 'goal', equipped: assetId, goalSettings: user.goalSettings };
                break;
            }
            case 'widget': {
                const ownedWidgets = user.ownedWidgets || [];
                if (assetId !== 'default' && !ownedWidgets.includes(assetId)) {
                    return res.status(403).json({ msg: "Widget not owned." });
                }
                user.activeRevenueWidget = assetId;
                await user.save();
                responsePayload = { category: 'widget', equipped: assetId, activeRevenueWidget: assetId };
                break;
            }
            default:
                return res.status(400).json({ msg: `Unknown category: ${category}` });
        }

        res.status(200).json({ msg: `Equipped successfully!`, ...responsePayload });

    } catch (err) {
        console.error("Universal Equip Error:", err);
        res.status(500).json({ msg: "Equip failed." });
    }
};

// ==================== STORE RAZORPAY INTEGRATION ====================

// Helper to get item price
const getStoreItemPrice = (category, itemId) => {
    switch (category) {
        case 'themes':
            return 10000;
        case 'goals':
            return 2000;
        case 'alerts':
            return PREMIUM_ALERT_PRICES[itemId] || 2000;
        case 'widgets':
            return WIDGET_CATALOG[itemId]?.price || 12000;
        default:
            return 0;
    }
};

exports.createStoreOrder = async (req, res) => {
    try {
        const { category, itemId } = req.body;
        if (!category || !itemId) return res.status(400).json({ msg: "Category and itemId required" });

        const price = getStoreItemPrice(category, itemId);
        if (price <= 0) return res.status(400).json({ msg: "Invalid item" });

        const options = {
            amount: price * 100, // Amount in paise
            currency: "INR",
            receipt: `rcpt_store_${Date.now()}_${itemId}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({
            orderId: order.id,
            amount: options.amount,
            currency: options.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Create Store Order Error:", error);
        res.status(500).json({ msg: "Order generation failed." });
    }
};

exports.verifyStorePayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, category, itemId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ status: "failed", msg: "Invalid Security Token" });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "Node Not Found" });

        const price = getStoreItemPrice(category, itemId);
        let itemName = itemId.toUpperCase();

        // 1. Grant the item based on category
        switch (category) {
            case 'themes':
                if (!user.unlockedNexusThemes) user.unlockedNexusThemes = [];
                if (!user.unlockedNexusThemes.includes(itemId)) {
                    user.unlockedNexusThemes.push(itemId);
                }
                user.nexusTheme = itemId;
                break;
            case 'goals':
                if (!user.goalSettings.unlockedPremiumStyles.includes(itemId)) {
                    user.goalSettings.unlockedPremiumStyles.push(itemId);
                }
                user.goalSettings.stylePreference = itemId;
                break;
            case 'alerts':
                if (!user.overlaySettings.unlockedPremiumAlerts) user.overlaySettings.unlockedPremiumAlerts = [];
                if (!user.overlaySettings.unlockedPremiumAlerts.includes(itemId)) {
                    user.overlaySettings.unlockedPremiumAlerts.push(itemId);
                }
                user.overlaySettings.stylePreference = itemId;
                break;
            case 'widgets':
                if (!user.ownedWidgets) user.ownedWidgets = [];
                if (!user.ownedWidgets.includes(itemId)) {
                    user.ownedWidgets.push(itemId);
                }
                user.activeRevenueWidget = itemId;
                itemName = WIDGET_CATALOG[itemId]?.name || itemName;
                break;
            default:
                return res.status(400).json({ msg: "Unknown Category" });
        }

        await user.save();

        // 2. Add Ledger Entry
        await Drop.create({
            streamerId: user.streamerId,
            donorName: "SYSTEM_DEBIT",
            amount: -price,
            message: `Purchased [${category}] ${itemName} via Razorpay`,
            sticker: 'zap',
            status: 'completed',
            razorpayPaymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id
        });

        // 3. Emit sockets for live updates
        const io = req.app.get('io');
        if (io) {
            if (category === 'goals') {
                io.to(user.streamerId).emit('goal-update', user.goalSettings);
                if (user.obsKey) io.to(user.obsKey).emit('goal-update', user.goalSettings);
            } else if (category === 'alerts') {
                if (user.streamerId) io.to(user.streamerId).emit('settings-update', user.overlaySettings);
                if (user.obsKey) io.to(user.obsKey).emit('settings-update', user.overlaySettings);
            }
        }

        // 4. Return the updated user structures needed by the frontend
        res.status(200).json({
            msg: "Asset Unlocked & Equipped!",
            walletBalance: user.walletBalance,
            nexusTheme: user.nexusTheme,
            unlockedNexusThemes: user.unlockedNexusThemes,
            goalSettings: user.goalSettings,
            overlaySettings: user.overlaySettings,
            ownedWidgets: user.ownedWidgets,
            activeRevenueWidget: user.activeRevenueWidget
        });

    } catch (err) {
        console.error("Verify Store Payment Error:", err);
        res.status(500).json({ msg: "Payment Verification Failed." });
    }
};

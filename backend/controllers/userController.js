const User = require('../models/User');

exports.requestWithdrawal = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ msg: "Node Not Found" });

        if (user.walletBalance < 100) {
            return res.status(400).json({ msg: "Insufficient Liquidity. Minimum withdrawal is ₹100." });
        }

        const payoutAmount = user.walletBalance;

        // Secure state transfer: Deduct balance & move to pending lock
        user.walletBalance = 0;
        user.financialMetrics.pendingPayouts += payoutAmount;

        await user.save();
        res.status(200).json({ msg: `Withdrawal of ₹${payoutAmount} requested successfully.` });

    } catch (err) {
        console.error("Payout Request Error:", err);
        res.status(500).json({ msg: "Failed to Dispatch Payout Request" });
    }
};

const Drop = require('../models/Drop');

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
        res.status(500).json({ msg: "System override failed." });
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
        res.status(500).json({ msg: "System override failed." });
    }
};

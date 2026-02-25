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

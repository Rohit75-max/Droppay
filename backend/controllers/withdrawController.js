const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Razorpay = require('razorpay');

// Isolate RazorpayX instance
const rzpX = new Razorpay({
    key_id: process.env.RAZORPAYX_KEY_ID || process.env.RAZORPAY_KEY_ID || 'dummy_key',
    key_secret: process.env.RAZORPAYX_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

/**
 * Handle Single Request Instant Withdrawals with Transaction Logging
 * @route POST /api/user/payouts/withdraw
 */
exports.requestWithdrawal = async (req, res) => {
    const redisClient = require('../config/redisClient');
    const isPaused = await redisClient.get('DROPPAY_GLOBAL_PAUSE');

    if (isPaused === 'true') {
        return res.status(503).json({ msg: "Service Temporarily Paused. Circuit Breaker is ACTIVE." });
    }

    const { amount } = req.body; // In Paise
    const userId = req.user.id;

    if (!amount || amount <= 0) {
        return res.status(400).json({ msg: "Invalid withdrawal amount." });
    }

    try {
        // 1. Lock Balance Check + Deduct in ONE Atomic operation (Prevents Double-Clicks)
        const user = await User.findOneAndUpdate(
            { 
                _id: userId, 
                'financialMetrics.pendingPayouts': { $gte: Number(amount) } 
            },
            { 
                $inc: { 'financialMetrics.pendingPayouts': -Number(amount) } 
            },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ msg: "Insufficient balance or transaction already processing." });
        }

        if (!user.razorpayFundAccountId) {
            // Rollback Balance if beneficiary is not configured
            await User.findByIdAndUpdate(userId, { $inc: { 'financialMetrics.pendingPayouts': Number(amount) } });
            return res.status(400).json({ msg: "No registered Fund Account found. Please update banking specs." });
        }

        // 2. Fire RazorpayX Disbursal
        try {
            const payout = await rzpX.payouts.create({
                account_number: process.env.RAZORPAYX_NODAL_ACCOUNT,
                amount: Number(amount),
                currency: "INR",
                mode: "IMPS",
                purpose: "payout",
                fund_account_id: user.razorpayFundAccountId,
                queue_if_low_balance: true
            });

            // 3. Log Payout Transaction Node
            await Transaction.create({
                userId: userId,
                type: 'withdrawal',
                amount: Number(amount),
                gatewayFee: 0,
                platformFee: 0,
                netAmount: Number(amount),
                referenceId: payout.id,
                status: 'success'
            });

            await User.findByIdAndUpdate(userId, { $inc: { 'financialMetrics.totalSettled': Number(amount) } });
            return res.json({ status: 'success', msg: "Payout initiated successfully.", payoutId: payout.id });

        } catch (rzpErr) {
            // 4. Automatic Rollback: Restore balance if Razorpay rejects the node Action
            await User.findByIdAndUpdate(userId, { $inc: { 'financialMetrics.pendingPayouts': Number(amount) } });
            return res.status(500).json({ msg: `Payment Gateway Error: ${rzpErr.message}` });
        }

    } catch (err) {
        return res.status(500).json({ msg: "System Exception: Concurrency Lock breakdown." });
    }
};

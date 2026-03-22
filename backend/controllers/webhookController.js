const crypto = require('crypto');
const User = require('../models/User');

/**
 * WEBHOOK LISTENER: RazorpayX Callbacks
 */
exports.handleRazorpayXWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        const webhookSecret = process.env.RAZORPAYX_WEBHOOK_SECRET || 'fallback_secret';

        // 1. Verify Webhook Signature (Security Shield)
        const generatedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (generatedSignature !== signature) {
            console.warn("⚠️ [RazorpayX Webhook] Signature Mismatch Rejected.");
            // Return 200 is sometimes recommended to avoid retry storms if config is merely testing
            return res.status(200).send("Signature Failed but OK"); 
        }

        const { event, payload } = req.body;
        console.log(`📥 [RazorpayX Webhook] Processing Event: ${event}`);

        // 2. Event Routing
        if (event === 'fund_account.validated') {
            const fundAccountId = payload.fund_account.entity.id;
            const validationStatus = payload.fund_account.entity.validation?.status; // 'success' / 'failed'

            const user = await User.findOne({ razorpayFundAccountId: fundAccountId });
            if (!user) return res.status(200).send("User not found");

            if (validationStatus === 'success') {
                user.payoutSettings.bankVerificationStatus = 'verified';
                user.payoutSettings.onboardingStatus = 'active';

                // Send WebSocket Refresh To Layout
                const io = req.app.get('io');
                if (io) {
                    io.to(user.obsKey).emit('bank_verified', { status: 'verified' });
                }

                await user.save();
                console.log(`✅ [RazorpayX Webhook] Bank Verified: Streamer ${user.username}`);
            }
        }

        res.status(200).send("OK");

    } catch (err) {
        console.error("Critical Webhook Pipeline Crash:", err.message);
        res.status(200).send("Crash OK"); // Keep 200 to avoid Razorpay blocking endpoints
    }
};

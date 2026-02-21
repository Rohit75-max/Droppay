const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth'); 
const User = require('../models/User'); // Added to fetch settings directly

/**
 * DEBUGGING 
 */
console.log("Checking Controller Exports:", {
    createOrder: typeof paymentController.createOrder,
    verifyPayment: typeof paymentController.verifyPayment,
    testDrop: typeof paymentController.testDrop,
    getGoal: typeof paymentController.getGoal,
    getRecent: typeof paymentController.getRecentDrops,
    getTop: typeof paymentController.getTopDonors,
    getAnalytics: typeof paymentController.getAnalytics,
    createPayoutAccount: typeof paymentController.createPayoutAccount,
    handleWithdraw: typeof paymentController.handleWithdrawRequest,
    subscribe: typeof paymentController.subscribe,
    createSubscription: typeof paymentController.createSubscription,
    verifySubscription: typeof paymentController.verifySubscription,
    handleWebhook: typeof paymentController.handleWebhook
}); 

// --- SUBSCRIPTION MISSIONS ---
router.post('/subscribe', auth, paymentController.subscribe);
router.post('/create-subscription', auth, paymentController.createSubscription);
router.post('/verify-subscription', auth, paymentController.verifySubscription);
router.post('/webhook', paymentController.handleWebhook);

// --- PAYMENT & ALERTS ---
router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);
router.post('/test-drop', paymentController.testDrop);

// --- GOAL & ANALYTICS ---
router.get('/goal/:streamerId', paymentController.getGoal);
router.get('/recent/:streamerId', paymentController.getRecentDrops);
router.get('/top/:streamerId', paymentController.getTopDonors);
router.get('/analytics/:streamerId', paymentController.getAnalytics);
router.get('/transactions/:streamerId', paymentController.getTransactions);

// --- PROFESSIONAL BANKING & SETTLEMENT ---
router.post('/create-payout-account', auth, paymentController.createPayoutAccount);
router.post('/withdraw', auth, paymentController.handleWithdrawRequest); 

// --- NEW: PUBLIC OVERLAY SETTINGS FETCH ---
// This allows the OBS Overlay to get colors/TTS without being logged in
router.get('/overlay-settings/:obsKey', async (req, res) => {
    try {
        const user = await User.findOne({ obsKey: req.params.obsKey }).select('overlaySettings');
        if (!user) return res.status(404).json({ msg: 'Invalid OBS Key' });
        res.json(user.overlaySettings);
    } catch (err) {
        console.error("Fetch Overlay Settings Error:", err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
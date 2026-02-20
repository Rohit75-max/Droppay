const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth'); 

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
    // NEW Autopay Exports
    createSubscription: typeof paymentController.createSubscription,
    verifySubscription: typeof paymentController.verifySubscription,
    handleWebhook: typeof paymentController.handleWebhook
}); 

// --- SUBSCRIPTION MISSIONS ---

/**
 * Route: POST /api/payment/subscribe
 * Handles legacy/starter 7-day trials.
 */
router.post('/subscribe', auth, paymentController.subscribe);

/**
 * AUTOPAY ROUTES (Recurring Billing)
 */
router.post('/create-subscription', auth, paymentController.createSubscription);
router.post('/verify-subscription', auth, paymentController.verifySubscription);

/**
 * RAZORPAY WEBHOOK (Critical for Autopay Renewals)
 * Note: No 'auth' middleware because Razorpay servers call this.
 */
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

module.exports = router;
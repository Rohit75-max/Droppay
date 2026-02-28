const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { globalLimiter, donationLimiter } = require('../middleware/rateLimiter');

// --- EXEMPT ROUTES (Bypass Limiters Entirely) ---
router.post('/test-drop', paymentController.testDrop);

// --- 1. DONATION ENGINE (High-Volume Throttling) ---
router.post('/create-order', donationLimiter, paymentController.createOrder);
router.post('/verify', donationLimiter, paymentController.verifyPayment);

// --- 2. DATA STREAMS (Standard Traffic Throttling) ---
router.get('/goal/:streamerId', globalLimiter, paymentController.getGoal);
router.get('/recent/:streamerId', globalLimiter, paymentController.getRecentDrops);
router.get('/top/:streamerId', globalLimiter, paymentController.getTopDonors);
router.get('/analytics/:streamerId', globalLimiter, paymentController.getAnalytics);
router.get('/transactions/:streamerId', globalLimiter, paymentController.getTransactions);

const auth = require('../middleware/auth');

// SUBSCRIPTION STUBS
router.post('/subscribe', paymentController.subscribe);
router.post('/create-subscription', auth, paymentController.createSubscription);
router.post('/verify-subscription', auth, paymentController.verifySubscription);
router.post('/webhook', paymentController.handleWebhook);

// BANKING STUBS
router.post('/create-payout-account', paymentController.createPayoutAccount);
router.post('/withdraw', paymentController.handleWithdrawRequest);

// OVERLAY SETTINGS
router.get('/overlay-settings/:obsKey', paymentController.getOverlaySettings || ((req, res) => res.json({})));
router.get('/goal-by-key/:obsKey', paymentController.getGoalByKey);

module.exports = router;
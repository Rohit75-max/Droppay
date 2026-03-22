const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { globalLimiter, donationLimiter, strictLimiter } = require('../middleware/rateLimiter');
const cacheData = require('../middleware/cache');

// --- EXEMPT ROUTES (Bypass Limiters Entirely) ---
router.post('/test-drop', paymentController.testDrop);

// --- 1. DONATION ENGINE (High-Volume Throttling) ---
router.post('/create-order', donationLimiter, paymentController.createOrder);
router.post('/verify', donationLimiter, paymentController.verifyPayment);

// --- 2. DATA STREAMS (Standard Traffic Throttling + Redis RAM Caching) ---
router.get('/goal/:streamerId', globalLimiter, cacheData(30), paymentController.getGoal);
router.get('/recent/:streamerId', globalLimiter, cacheData(30), paymentController.getRecentDrops);
router.get('/top/:streamerId', globalLimiter, cacheData(60), paymentController.getTopDonors);
router.get('/analytics/:streamerId', globalLimiter, cacheData(300), paymentController.getAnalytics); // Aggregations cached for 5 minutes
router.get('/transactions/:streamerId', globalLimiter, cacheData(60), paymentController.getTransactions);

const auth = require('../middleware/auth');

// SUBSCRIPTION STUBS
router.post('/subscribe', paymentController.subscribe);
router.post('/create-subscription', auth, paymentController.createSubscription);
router.post('/verify-subscription', auth, paymentController.verifySubscription);
router.post('/webhook', paymentController.handleWebhook);

// BANKING STUBS
router.post('/create-payout-account', strictLimiter, paymentController.createPayoutAccount);
router.post('/withdraw', strictLimiter, paymentController.handleWithdrawRequest);

// OVERLAY SETTINGS
router.get('/overlay-settings/:obsKey', paymentController.getOverlaySettings || ((req, res) => res.json({})));
router.get('/goal-by-key/:obsKey', paymentController.getGoalByKey);

module.exports = router;
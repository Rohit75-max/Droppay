const express = require('express');
const router = express.Router();
const { handleRazorpayXWebhook } = require('../controllers/webhookController');

// @route   POST api/webhooks/razorpayx
router.post('/razorpayx', express.json(), handleRazorpayXWebhook);

module.exports = router;

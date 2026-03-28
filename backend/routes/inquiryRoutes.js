const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { globalLimiter } = require('../middleware/rateLimiter');

// --- INQUIRY BRIDGE (Public Uplink) ---
router.post('/send', globalLimiter, inquiryController.sendInquiry);

module.exports = router;

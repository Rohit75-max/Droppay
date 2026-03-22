const express = require('express');
const router = express.Router();
const { verifyBank } = require('../controllers/onboardingController');
const auth = require('../middleware/auth');

// @route   POST api/onboarding/verify-bank
router.post('/verify-bank', auth, verifyBank);

module.exports = router;

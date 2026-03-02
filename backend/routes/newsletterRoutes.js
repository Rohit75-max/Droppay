const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

// @route   POST api/newsletter/subscribe
// @desc    Uplink email to newsletter node
router.post('/subscribe', newsletterController.subscribe);

module.exports = router;

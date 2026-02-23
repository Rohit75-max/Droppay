const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const User = require('../models/User');
const { createOnboardingLink } = require('../controllers/onboardingController');

// @route   POST api/user/link-bank
router.post('/link-bank', auth, createOnboardingLink);

// @route   GET api/user/profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// FIXED: Changed PUT to POST to match Dashboard.jsx handshake
// @route   POST api/user/update-goal
router.post('/update-goal', auth, async (req, res) => {
    try {
        const { title, targetAmount, showOnDashboard } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { 
                "goalSettings.title": title, 
                "goalSettings.targetAmount": Number(targetAmount),
                "goalSettings.showOnDashboard": showOnDashboard 
            }},
            { new: true }
        ).select('-password');
        res.json(user.goalSettings);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// FIXED: Added missing Feedback Handshake for the Station
// @route   POST api/user/feedback
router.post('/feedback', auth, async (req, res) => {
    try {
        const { type, rating, message } = req.body;
        console.log(`📩 Signal Received from ${req.user.id}: [${type}] ${rating} Stars - ${message}`);
        // Logic to save to a Feedback collection could go here
        res.json({ msg: 'Insight Synchronized' });
    } catch (err) {
        res.status(500).json({ msg: 'Uplink Failure' });
    }
});

// @route   POST api/user/update-profile
router.post('/update-profile', auth, async (req, res) => {
    try {
        const { username, bio, streamerId } = req.body;
        // Verify username is not taken if changing
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { username, bio, streamerId } },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET api/user/public/:streamerId
router.get('/public/:streamerId', async (req, res) => {
    try {
        const user = await User.findOne({ streamerId: req.params.streamerId })
            .select('username streamerId bio tier partnerPack goalSettings'); 
        if (!user) return res.status(404).json({ msg: 'Streamer not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
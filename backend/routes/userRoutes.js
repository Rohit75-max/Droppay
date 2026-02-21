const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const User = require('../models/User');
const { createOnboardingLink } = require('../controllers/onboardingController');

// ============================================================
// TEMPORARY ADMIN BACKDOOR - DELETE AFTER USE
// ============================================================
router.get('/force-activate/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOneAndUpdate(
            { email: email },
            { $set: { tier: 'starter' } },
            { new: true }
        );
        if (!user) return res.status(404).send("User not found in database.");
        res.send(`🚀 SUCCESS: Account ${email} is now set to STARTER tier. Refresh your dashboard!`);
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});
// ============================================================

// @route   POST api/user/link-bank
// @desc    Start Razorpay account linking
router.post('/link-bank', auth, createOnboardingLink);

// @route   GET api/user/profile
// @desc    Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error("Profile Route Error:", err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT api/user/update-goal
// @desc    Update or Reset the donation goal settings
router.put('/update-goal', auth, async (req, res) => {
    try {
        const { title, targetAmount, resetProgress } = req.body;

        if (!title || targetAmount === undefined) {
            return res.status(400).json({ msg: 'Please provide both title and target amount' });
        }

        const updateData = {
            "goalSettings.title": title,
            "goalSettings.targetAmount": Number(targetAmount)
        };

        if (resetProgress === true) {
            updateData["goalSettings.currentProgress"] = 0;
            console.log(`♻️ Progress reset triggered for user ID: ${req.user.id}`);
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json(user.goalSettings);
    } catch (err) {
        console.error("Update Goal Error:", err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- ALERT STUDIO SYNC ROUTES ---

// @route   PUT api/user/update-overlay
// @desc    Save Alert Studio settings to DB
router.put('/update-overlay', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { overlaySettings: req.body } },
            { new: true }
        ).select('overlaySettings');

        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user.overlaySettings);
    } catch (err) {
        console.error("Update Overlay Error:", err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET api/user/overlay-settings/:obsKey
// @desc    Fetch settings for the OBS Overlay page (Public)
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

// @route   PUT api/user/update-profile
// @desc    Update Identity Hub info (including bio)
router.put('/update-profile', auth, async (req, res) => {
    try {
        const { username, phone, streamerId, bio } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { username, phone, streamerId, bio } },
            { new: true }
        ).select('-password');
        
        res.json(user);
    } catch (err) {
        console.error("Update Profile Error:", err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// ============================================================
// NEW: PARTNER STICKER PROTOCOL ROUTE
// ============================================================
// @route   PUT api/user/update-stickers
// @desc    Save Partner Pack stickers (PRO/LEGEND only)
router.put('/update-stickers', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Security Check: Block Starter/None tiers from using custom stickers
        if (user.tier === 'starter' || user.tier === 'none') {
            return res.status(403).json({ msg: 'Upgrade to PRO or LEGEND to unlock Partner Stickers.' });
        }

        // Limit: Max 10 stickers to keep database performance high
        if (req.body.length > 10) {
            return res.status(400).json({ msg: 'Partner Pack is limited to 10 stickers.' });
        }

        user.partnerPack = req.body;
        await user.save();
        
        res.json(user.partnerPack);
    } catch (err) {
        console.error("Update Stickers Error:", err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// ============================================================
// PUBLIC PROFILE FOR DONATION PAGE
// ============================================================
// @route   GET api/user/public/:streamerId
// @desc    Get public profile (safely exposing Tier and PartnerPack)
router.get('/public/:streamerId', async (req, res) => {
    try {
        const user = await User.findOne({ streamerId: req.params.streamerId })
            .select('username streamerId bio tier partnerPack'); 
            
        if (!user) return res.status(404).json({ msg: 'Streamer not found' });
        
        res.json(user);
    } catch (err) {
        console.error("Public Profile Error:", err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
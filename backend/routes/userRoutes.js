const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const User = require('../models/User');
const { createOnboardingLink } = require('../controllers/onboardingController');

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

        // 1. Prepare the update object
        const updateData = {
            "goalSettings.title": title,
            "goalSettings.targetAmount": Number(targetAmount)
        };

        // 2. If resetProgress is true, set the current progress to 0
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

module.exports = router;
const express = require('express');
const router = express.Router();
const TugOfWarEvent = require('../models/TugOfWarEvent');
const User = require('../models/User');
const auth = require('../middleware/auth');
const towController = require('../controllers/tugOfWarController');

// @route   POST api/tug-of-war/start
router.post('/start', auth, towController.startEvent);

// @route   POST api/tug-of-war/stop
router.post('/stop', auth, towController.stopEvent);

// GET active tug-of-war event for a streamer
router.get('/active/:streamerId', async (req, res) => {
    try {
        const { streamerId } = req.params;
        const event = await TugOfWarEvent.findOne({
            streamerId: streamerId,
            isActive: true,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        if (!event) {
            return res.status(404).json({ msg: 'No active Tug-of-War event found.' });
        }

        res.json(event);
    } catch (err) {
        console.error('Error fetching active Tug-of-War event:', err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// GET active tug-of-war event by obsKey
router.get('/overlay/:obsKey', async (req, res) => {
    try {
        const { obsKey } = req.params;
        const user = await User.findOne({ obsKey }).select('streamerId');
        if (!user) return res.status(404).json({ msg: 'Invalid OBS Key' });

        const event = await TugOfWarEvent.findOne({
            streamerId: user.streamerId,
            isActive: true,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        if (!event) {
            return res.status(404).json({ msg: 'No active Tug-of-War event found.' });
        }

        res.json(event);
    } catch (err) {
        console.error('Error fetching overlay Tug-of-War event:', err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

module.exports = router;

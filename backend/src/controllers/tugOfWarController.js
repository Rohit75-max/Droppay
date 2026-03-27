const TugOfWarEvent = require('../models/TugOfWarEvent');

exports.startEvent = async (req, res) => {
    try {
        const { title, teamAName, teamBName, durationMinutes } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ msg: 'Unauthenticated Request' });
        }

        const User = require('../models/User');
        const user = await User.findById(req.user.id).select('obsKey streamerId');

        if (!user || !user.streamerId) {
            return res.status(404).json({ msg: 'Streamer Node Not Found or Incomplete' });
        }

        const streamerId = user.streamerId;

        // Deactivate any existing active events for this streamer
        await TugOfWarEvent.updateMany(
            { streamerId, isActive: true },
            { $set: { isActive: false } }
        );

        const expiresAt = new Date(Date.now() + (durationMinutes || 5) * 60000);

        const newEvent = await TugOfWarEvent.create({
            streamerId,
            title: title || "New Battle",
            teamAName: teamAName || "Team A",
            teamBName: teamBName || "Team B",
            expiresAt,
            isActive: true,
            teamAAmount: 0,
            teamBAmount: 0
        });

        const io = req.app.get('io');

        if (io) {
            if (user.obsKey) io.to(user.obsKey).emit('tug-of-war-start', newEvent);
            io.to(user.streamerId).emit('tug-of-war-start', newEvent);
        }

        res.json(newEvent);
    } catch (err) {
        console.error('Error starting Tug-of-War event:', err.message);
        res.status(500).json({ msg: 'Server Error', details: err.message });
    }
};

exports.stopEvent = async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id).select('obsKey streamerId');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const streamerId = user.streamerId;
        const activeEvent = await TugOfWarEvent.findOneAndUpdate(
            { streamerId, isActive: true },
            { $set: { isActive: false } },
            { new: true }
        );

        if (activeEvent) {
            const io = req.app.get('io');

            if (io) {
                if (user.obsKey) io.to(user.obsKey).emit('tug-of-war-stop', { eventId: activeEvent._id });
                io.to(user.streamerId).emit('tug-of-war-stop', { eventId: activeEvent._id });
            }
        }

        res.json({ msg: 'Event stopped successfully' });
    } catch (err) {
        console.error('Error stopping Tug-of-War event:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

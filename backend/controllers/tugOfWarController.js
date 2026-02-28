const TugOfWarEvent = require('../models/TugOfWarEvent');

exports.startEvent = async (req, res) => {
    try {
        const { title, teamAName, teamBName, durationMinutes } = req.body;
        const streamerId = req.user.streamerId;

        // Deactivate any existing active events for this streamer
        await TugOfWarEvent.updateMany(
            { streamerId, isActive: true },
            { $set: { isActive: false } }
        );

        const expiresAt = new Date(Date.now() + durationMinutes * 60000);

        const newEvent = await TugOfWarEvent.create({
            streamerId,
            title,
            teamAName,
            teamBName,
            expiresAt,
            isActive: true,
            teamAAmount: 0,
            teamBAmount: 0
        });

        const io = req.app.get('io');
        const User = require('../models/User');
        const user = await User.findById(req.user.id).select('obsKey streamerId');

        if (io) {
            if (user.obsKey) io.to(user.obsKey).emit('tug-of-war-start', newEvent);
            io.to(user.streamerId).emit('tug-of-war-start', newEvent);
        }

        res.json(newEvent);
    } catch (err) {
        console.error('Error starting Tug-of-War event:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.stopEvent = async (req, res) => {
    try {
        const streamerId = req.user.streamerId;
        const activeEvent = await TugOfWarEvent.findOneAndUpdate(
            { streamerId, isActive: true },
            { $set: { isActive: false } },
            { new: true }
        );

        if (activeEvent) {
            const io = req.app.get('io');
            const User = require('../models/User');
            const user = await User.findById(req.user.id).select('obsKey streamerId');

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

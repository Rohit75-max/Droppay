const mongoose = require('mongoose');

const TugOfWarEventSchema = new mongoose.Schema({
    streamerId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
    teamAName: { type: String, required: true },
    teamAAmount: { type: Number, default: 0 },
    teamBName: { type: String, required: true },
    teamBAmount: { type: Number, default: 0 },
    lastStrike: {
        name: String,
        amount: Number,
        side: { type: String, enum: ['A', 'B'] },
        timestamp: { type: Date, default: Date.now }
    }
}, { timestamps: true });

module.exports = mongoose.model('TugOfWarEvent', TugOfWarEventSchema);

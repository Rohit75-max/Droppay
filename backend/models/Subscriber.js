const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

// ADDED: Index for fast querying by subscription date mapping (e.g. for marketing blasts)
SubscriberSchema.index({ subscribedAt: -1 });

module.exports = mongoose.model('Subscriber', SubscriberSchema);

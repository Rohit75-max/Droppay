const mongoose = require('mongoose');

const FailedJobSchema = new mongoose.Schema({
    jobId: String,
    queueName: String,
    payload: mongoose.Schema.Types.Mixed,
    errorLog: String,
    failedAt: { type: Date, default: Date.now },
    isResolved: { type: Boolean, default: false }
});

module.exports = mongoose.model('FailedJob', FailedJobSchema);

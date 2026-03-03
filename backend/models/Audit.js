const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adminUsername: { type: String, required: true },
    action: { type: String, required: true }, // e.g., 'SETTLEMENT_EXECUTION', 'ROLE_OVERRIDE', 'BAN_NODE'
    targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The user affected
    targetName: { type: String },
    details: { type: String },
    level: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now }
});

// Index for fast retrieval in the Security Nexus
AuditSchema.index({ timestamp: -1 });
AuditSchema.index({ adminId: 1, timestamp: -1 });

module.exports = mongoose.model('Audit', AuditSchema);

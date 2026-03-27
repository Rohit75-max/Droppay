const mongoose = require('mongoose');

const GlobalConfigSchema = new mongoose.Schema({
    configKey: {
        type: String,
        required: true,
        unique: true,
        default: 'MAIN_CONFIG'
    },
    platformSettings: {
        defaultCommissionRate: { type: Number, default: 10 },
        minWithdrawalThreshold: { type: Number, default: 500 },
        maintenanceMode: { type: Boolean, default: false },
        broadcastMessage: { type: String, default: '' },
        lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
}, { timestamps: true });

// Ensure we only ever have one config record
GlobalConfigSchema.statics.getOrCreate = async function () {
    let config = await this.findOne({ configKey: 'MAIN_CONFIG' });
    if (!config) {
        config = await this.create({ configKey: 'MAIN_CONFIG' });
    }
    return config;
};

module.exports = mongoose.model('GlobalConfig', GlobalConfigSchema);

const mongoose = require('mongoose');

const PlatformMetricsSchema = new mongoose.Schema({
    singletonId: {
        type: String,
        default: 'MASTER_LEDGER',
        unique: true
    },
    totalCommissionRevenue: {
        type: Number,
        default: 0
    },
    totalSubscriptionRevenue: {
        type: Number,
        default: 0
    },
    totalPayoutsSettled: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Static method to easily retrieve or initialize the singleton
PlatformMetricsSchema.statics.getLedger = async function () {
    let ledger = await this.findOne({ singletonId: 'MASTER_LEDGER' });
    if (!ledger) {
        ledger = await this.create({ singletonId: 'MASTER_LEDGER' });
    }
    return ledger;
};

module.exports = mongoose.model('PlatformMetrics', PlatformMetricsSchema);

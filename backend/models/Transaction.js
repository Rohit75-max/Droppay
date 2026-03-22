const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['deposit', 'withdrawal'], required: true, index: true },
    amount: { type: Number, required: true }, // Gross amount in Paise
    gatewayFee: { type: Number, default: 0 }, // 2% Razorpay aggregator fee
    platformFee: { type: Number, default: 0 }, // 5/10/15% Cut
    netAmount: { type: Number, required: true }, // Net balance increase/decrease
    referenceId: { type: String, required: true, unique: true, index: true }, // Razorpay pay_id or payout_id
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'success' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);

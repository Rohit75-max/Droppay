const mongoose = require('mongoose');

/**
 * DROP SCHEMA: The Financial Ledger for Donations
 * Improvised for high-concurrency (50k+ users) with Compound Indexing.
 */
const DropSchema = new mongoose.Schema({
  streamerId: {
    type: String,
    required: true,
    index: true // Core lookup for streamer-specific data
  },
  donorName: {
    type: String,
    default: 'Anonymous',
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    trim: true,
    maxLength: 280 // Limit to prevent DB bloat at scale
  },
  sticker: {
    type: String,
    default: 'zap'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
    index: true // Essential for filtering valid transactions
  },
  // Technical metadata for Split Payments / Razorpay Route
  razorpayPaymentId: {
    type: String,
    sparse: true
  },
  razorpayOrderId: {
    type: String,
    sparse: true
  },
  isTest: {
    type: Boolean,
    default: false,
    index: true // Useful for filtering out test data in analytics if needed
  }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt
});

/**
 * GIANT-TIER COMPOUND INDEXES
 * 1. Hall of Fame Index: Speeds up "Top Donors" by pre-sorting streamerId, status, and amount.
 * 2. History Index: Speeds up "Recent Drops" by pre-sorting streamerId, status, and time.
 */
DropSchema.index({ streamerId: 1, status: 1, amount: -1 });
DropSchema.index({ streamerId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Drop', DropSchema);
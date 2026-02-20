const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  phone: { type: String, required: true, trim: true },
  password: { type: String },

  streamerId: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  }, 
  
  obsKey: { 
    type: String, 
    unique: true, 
    default: () => uuidv4() 
  },

  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  otp: {
    code: String,
    expiresAt: Date
  },

  subscription: {
    plan: { 
      type: String, 
      enum: ['none', 'starter', 'pro', 'legend'], 
      default: 'none' 
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    expiryDate: { type: Date }
  },

  // --- NEW: FINANCIALS & SETTLEMENT HUB ---
  walletBalance: { type: Number, default: 0 }, // Tracks total verified earnings
  
  razorpayAccountId: { type: String, default: null }, // Unique ID from Razorpay Route
  
  payoutSettings: {
    onboardingStatus: { 
      type: String, 
      enum: ['none', 'pending', 'active'], 
      default: 'none' 
    },
    lastSettlementDate: { type: Date },
    bankDetailsLinked: { type: Boolean, default: false }
  },

  overlaySettings: {
    volume: { type: Number, default: 50 },
    activeStickerSet: { type: String, default: 'classic' },
    isPanicMode: { type: Boolean, default: false },
    // NEW: Alert Customization placeholders for Feature #2
    customGifUrl: { type: String, default: null },
    customSoundUrl: { type: String, default: null }
  },

  goalSettings: {
    title: { type: String, default: "New Stream Equipment" },
    targetAmount: { type: Number, default: 5000 },
    currentProgress: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },

  googleId: { type: String, unique: true, sparse: true }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
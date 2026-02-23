const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    index: true // ADDED: Fast login lookups
  },
  phone: { type: String, required: true, trim: true },
  password: { type: String },

  streamerId: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    index: true // ADDED: Critical for the /pay/:streamerId page
  },
  bio: {
    type: String,
    default: "Support the stream, trigger custom on-screen alerts, and join the Hall of Fame.",
    maxLength: 150
  }, 
  
  tier: { 
    type: String, 
    enum: ['none', 'starter', 'pro', 'legend'], 
    default: 'none',
    index: true // ADDED: Filtering users by tier for marketing/admin
  },

  obsKey: { 
    type: String, 
    unique: true, 
    default: () => uuidv4(),
    index: true // ADDED: Vital for 50k OBS browser source connections
  },

  // ... (verified/otp/subscription fields remain same) ...
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  otp: {
    code: String,
    expiresAt: Date
  },

  subscription: {
    plan: { 
      type: String, 
      enum: ['none','starter', 'pro', 'legend'], 
      default: 'none' 
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    expiryDate: { type: Date }
  },

  walletBalance: { type: Number, default: 0 }, 
  
  razorpayAccountId: { type: String, default: null, index: true }, // ADDED: Fast payout lookups
  
  // ... (payout/overlay/goal settings remain same) ...
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
    customGifUrl: { type: String, default: null },
    customSoundUrl: { type: String, default: null },
    
    primaryColor: { type: String, default: '#6366f1' },
    fontFamily: { type: String, default: 'Orbitron' },
    animationType: { type: String, default: 'slide-left' },
    alertDuration: { type: Number, default: 7 },
    
    ttsEnabled: { type: Boolean, default: false },
    ttsMinAmount: { type: Number, default: 500 },
    ttsVoice: { type: String, default: 'female' }
  },

  goalSettings: {
    title: { type: String, default: "New Stream Equipment" },
    targetAmount: { type: Number, default: 5000 },
    currentProgress: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },

  partnerPack: [
    {
      stickerId: { type: String, default: () => `stk_${Date.now()}` },
      name: { type: String, trim: true },
      lottieUrl: { type: String, required: true },
      minAmount: { type: Number, default: 100 },
      isActive: { type: Boolean, default: true }
    }
  ],

  googleId: { type: String, unique: true, sparse: true }

}, { timestamps: true });

// --- ADVANCED COMPOUND INDEXES FOR 50K SCALE ---

// 1. Fast lookup for the Overlay (find user by obsKey + check if panic mode is off)
UserSchema.index({ obsKey: 1, "overlaySettings.isPanicMode": 1 });

// 2. Fast lookup for Payout Engine (active accounts that need settlement)
UserSchema.index({ "payoutSettings.onboardingStatus": 1, walletBalance: -1 });

module.exports = mongoose.model('User', UserSchema);
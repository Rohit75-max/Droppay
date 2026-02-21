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
  bio: {
    type: String,
    default: "Support the stream, trigger custom on-screen alerts, and join the Hall of Fame.",
    maxLength: 150
  }, 
  
  tier: { 
    type: String, 
    enum: ['none', 'starter', 'pro', 'legend'], 
    default: 'none' 
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
      enum: ['none','starter', 'pro', 'legend'], 
      default: 'none' 
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    expiryDate: { type: Date }
  },

  walletBalance: { type: Number, default: 0 }, 
  
  razorpayAccountId: { type: String, default: null }, 
  
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

  // --- NEW: PARTNER STICKER PROTOCOL ---
  // Only accessible for PRO and LEGEND tiers
  partnerPack: [
    {
      stickerId: { type: String, default: () => `stk_${Date.now()}` },
      name: { type: String, trim: true },
      lottieUrl: { type: String, required: true },
      minAmount: { type: Number, default: 100 },
      isActive: { type: Boolean, default: true }
    }
  ],
  // -------------------------------------

  googleId: { type: String, unique: true, sparse: true }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
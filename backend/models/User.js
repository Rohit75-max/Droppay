const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user',
    index: true // ADDED: Fast lookup for system administrators
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true // ADDED: Fast login lookups
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true // ADDED: Fast lookup for duplicate conflict checks
  },
  password: { type: String },

  streamerId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true // ADDED: Critical for the /pay/:streamerId page
  },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Tracks who invited them

  bio: {
    type: String,
    default: "Support the stream, trigger custom on-screen alerts, and join the Hall of Fame.",
    maxLength: 150
  },
  avatar: { type: String },

  // ENTERPRISE UPGRADES: Deep Telemetry & Metrics
  security: {
    lastLogin: { type: Date },
    lastLoginIP: { type: String },
    accountStatus: {
      isBanned: { type: Boolean, default: false },
      banReason: { type: String }
    }
  },
  financialMetrics: {
    totalLifetimeEarnings: { type: Number, default: 0 },
    totalSettled: {
      type: Number,
      default: 0
    },
    pendingPayouts: {
      type: Number,
      default: 0
    }
  },
  socialLinks: {
    twitter: { type: String, default: null },
    youtube: { type: String, default: null },
    instagram: { type: String, default: null },
    discord: { type: String, default: null }
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

  // ADDED: Transient vault to hold profile updates during OTP authorization
  pendingProfileUpdate: {
    email: String,
    phone: String,
    expireAt: Date
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
    stylePreference: { type: String, enum: ['modern', 'comic', 'playful'], default: 'modern' },
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
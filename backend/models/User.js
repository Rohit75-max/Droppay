const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
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
  referralCount: {
    type: Number,
    default: 0,
    index: true // ADDED: Fast lookup for tier upgrades and leaderboard queries
  },

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
  walletBalance: {
    type: Number,
    default: 0,
    index: true // ADDED: Critical for balance lookups and store purchases
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

  nexusTheme: { type: String, enum: ['void', 'cyber', 'aero', 'kawaii', 'arcade', 'bgmi', 'live_space', 'live_erangel', 'live_cyber', 'live_synthwave', 'live_kawaii', 'live_dragon', 'aero-light', 'nebula-void', 'alabaster-pulse', 'midnight-obsidian', 'kawaii-desk', 'bgmi-tactical', 'uplink'], default: 'void', index: true }, // ADDED: Fast bulk theme lookups at 50k+ scale
  nexusThemeMode: { type: String, enum: ['dark', 'light'], default: 'dark' },
  unlockedNexusThemes: [{ type: String }], // ADDED: Tracks Elite workspace themes purchased from Store
  ownedWidgets: [{ type: String }], // ADDED: Tracks premium dashboard widgets purchased from Store
  activeRevenueWidget: { type: String, default: 'default' }, // ADDED: Currently equipped revenue chart widget

  razorpayAccountId: { type: String, default: null, index: true }, // Legacy Route ID
  razorpayContactId: { type: String, default: null }, // ADDED: Direct Payouts Contact ID
  razorpayFundAccountId: { type: String, default: null }, // ADDED: Direct Payouts Fund Account ID
  bankDetails: {
    account_holder_name: { type: String, default: null },
    account_number_encrypted: { type: String, default: null },
    ifsc_encrypted: { type: String, default: null },
    masked_account: { type: String, default: null } // e.g., ****4321 for display
  },

  // ... (payout/overlay/goal settings remain same) ...
  payoutSettings: {
    onboardingStatus: {
      type: String,
      enum: ['none', 'pending', 'active'],
      default: 'none'
    },
    lastSettlementDate: { type: Date },
    bankDetailsLinked: { type: Boolean, default: false },
    bankVerificationStatus: { 
      type: String, 
      enum: ['none', 'pending', 'verified', 'rejected'], 
      default: 'none' 
    }
  },

  overlaySettings: {
    stylePreference: {
      type: String,
      enum: ['modern', 'comic', 'playful', 'pixel', 'kawaii', 'cyberhud', 'bgmi', 'gta', 'coc', 'avatar', 'godzilla', 'subway_dash', 'orbital_strike', 'loot_crate', 'neon_billboard', 'celestial_blessing', 'gacha_pull', 'arcade_ko', 'paranormal_tape', 'holo_tcg', 'beat_drop', 'mainframe_breach', 'dragon_hoard', 'casino_jackpot', 'mecha_assembly', 'hyperdrive_warp', 'dimensional_rift', 'abyssal_kraken', 'pharaoh_tomb', 'cybernetic_brain', 'celestial_zodiac'],
      default: 'modern'
    },
    unlockedPremiumAlerts: [{ type: String }], // ADDED: Tracks Elite alerts purchased from Dashboard Store
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
    ttsVoice: { type: String, default: 'female' },
    leaderboardStyle: { type: String, default: 'royal_throne' }
  },

  goalSettings: {
    title: { type: String, default: "New Stream Equipment" },
    targetAmount: { type: Number, default: 5000 },
    currentProgress: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    stylePreference: { type: String, enum: ['modern', 'glass_jar', 'gta', 'coc', 'bgmi', 'avatar', 'godzilla', 'arc_reactor_horizontal', 'arc_reactor_circular', 'boss_fight', 'plasma_battery', 'pixel_coin_row', 'pixel_coin_vault', 'black_hole', 'hex_core', 'rune_monolith', 'hologram_glitch', 'alchemist_flask', 'redline_dash', 'loot_dispenser', 'mecha_lens'], default: 'glass_jar' },
    unlockedPremiumStyles: [{ type: String }] // ADDED: Tracks Elite overlays purchased from Dashboard Store
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

  adminProfile: {
    title: { type: String, default: 'Protocol Administrator' },
    bio: { type: String, default: 'Secure Authority over the Drope Nexus.' },
    department: { type: String, default: 'Security Operations' },
    accessLevel: { type: Number, default: 1 }, // 1: Standard Admin, 2: Super Admin
    avatar: { type: String, default: null }
  },

  // --- V5 SCALING UPGRADE ---
  trustScore: { type: Number, default: 100, min: 0, max: 100 },
  nodeStatus: {
    type: String,
    enum: ['standard', 'verified', 'under_review', 'flagged'],
    default: 'standard'
  },
  lastKnownIp: { type: String },
  performanceMetrics: {
    totalLogins: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },

  googleId: { type: String, unique: true, sparse: true }

}, { timestamps: true });

// --- ADVANCED COMPOUND INDEXES FOR 50K SCALE ---

// 1. Fast lookup for the Overlay (find user by obsKey + check if panic mode is off)
UserSchema.index({ obsKey: 1, "overlaySettings.isPanicMode": 1 });

// 2. Fast lookup for Payout Engine (active accounts that need settlement)
// FIXED: Replaced non-existent walletBalance with financialMetrics.pendingPayouts
UserSchema.index({ "payoutSettings.onboardingStatus": 1, "financialMetrics.pendingPayouts": -1 });

// 3. Fast lookup for Active Subscriptions
UserSchema.index({ "subscription.status": 1 });

module.exports = mongoose.model('User', UserSchema);
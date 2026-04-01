const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { addBankAccount } = require('../controllers/onboardingController');
const { purchasePremiumStyle, purchasePremiumAlert, purchaseNexusTheme, purchaseWidget, equipWidget, equipAsset, createStoreOrder, verifyStorePayment, getWithdrawals, cancelWithdrawal, openDispute } = require('../controllers/userController');
const { requestWithdrawal } = require('../controllers/withdrawController');
const { cacheProfile, invalidateProfileCache } = require('../middleware/profileCache');
// @route   GET api/user/status
// @desc    Retrieve Global Circuit Breaker State (Public Status check)
router.get('/status', async (req, res) => {
    try {
        const redisClient = require('../config/redisClient');
        const isPaused = await redisClient.get('DROPE_GLOBAL_PAUSE');
        res.status(200).json({ isPaused: isPaused === 'true' });
    } catch (err) {
        res.status(500).json({ msg: "Failed to read system status." });
    }
});

// @route   POST api/user/add-bank-account
router.post('/add-bank-account', auth, addBankAccount);

// @route   POST api/user/withdraw
// @desc    Process autonomous node payout requests
router.post('/withdraw', auth, requestWithdrawal);

// @route   GET api/user/withdrawals
router.get('/withdrawals', auth, getWithdrawals);

// @route   POST api/user/cancel-withdrawal
router.post('/cancel-withdrawal', auth, cancelWithdrawal);

// @route   POST api/user/transactions/:id/dispute
// @desc    Flag a transaction for admin mediation
router.post('/transactions/:id/dispute', auth, async (req, res) => {
    req.body.transactionId = req.params.id; // Inject param into body
    return openDispute(req, res);
});

// @route   POST api/user/buy-premium-style
// @desc    Purchase Elite Goal overlay using Wallet Balance
router.post('/buy-premium-style', auth, purchasePremiumStyle);

// @route   POST api/user/buy-premium-alert
// @desc    Purchase Premium Alert overlay using Wallet Balance
router.post('/buy-premium-alert', auth, purchasePremiumAlert);

// @route   POST api/user/buy-nexus-theme
// @desc    Purchase Elite Nexus Theme using Wallet Balance
router.post('/buy-nexus-theme', auth, purchaseNexusTheme);

// @route   POST api/user/buy-widget
// @desc    Purchase a premium dashboard widget using Wallet Balance
router.post('/buy-widget', auth, purchaseWidget);

// @route   POST api/user/equip-widget
// @desc    Equip an owned widget as the active revenue chart
router.post('/equip-widget', auth, equipWidget);

// @route   POST api/user/equip-asset
// @desc    Universal equip handler for all asset categories
router.post('/equip-asset', auth, equipAsset);

// @route   POST api/user/create-store-order
// @desc    Initialize a Razorpay order for store items
router.post('/create-store-order', auth, createStoreOrder);

// @route   POST api/user/verify-store-payment
// @desc    Verify Razorpay secure checkout and grant asset
router.post('/verify-store-payment', auth, verifyStorePayment);

// @route   GET api/user/profile
// PERF: cacheProfile checks Redis first (30s TTL). Cache HIT = zero MongoDB queries.
// PERF: Cache-Control prevents redundant DB hits when Dashboard mounts.
// private: user-specific data (no CDN caching).
// max-age=30: browser reuses this for 30s without a new request.
// stale-while-revalidate=60: serve stale cache while fetching fresh in background.
const Drop = require('../models/Drop');

router.get('/profile', auth, cacheProfile, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(401).json({ msg: 'Session invalid: user entry not found. Please log in again.' });
        
        // Calculate 30-day net earnings
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const monthlyStats = await Drop.aggregate([
            {
                $match: {
                    streamerId: user.streamerId,
                    status: 'completed',
                    amount: { $gt: 0 },
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    totalGross: { $sum: "$amount" }
                }
            }
        ]);
        
        const totalGrossMonth = monthlyStats.length > 0 ? monthlyStats[0].totalGross : 0;
        const platformCut = user.tier === 'legend' ? 0.05 : user.tier === 'pro' ? 0.10 : 0.15;
        const netMultiplier = 1 - 0.02 - platformCut;
        const monthlyNetEarnings = Math.round(totalGrossMonth * netMultiplier);

        const userObj = user.toObject();
        
        // --- IRONCLAD SUBSCRIPTION SENTINEL ---
        const now = new Date();
        const isTrialActive = user.subscription?.trialEndsAt && new Date(user.subscription.trialEndsAt) > now;
        
        // Paid status: Must be 'active' AND not expired
        const isPaidActive = user.subscription?.status === 'active' && 
                           user.subscription?.expiryDate && 
                           new Date(user.subscription.expiryDate) > now;

        // Dynamic Status Override: Force 'inactive' if both trial and paid periods are over
        const dynamicStatus = (isTrialActive || isPaidActive) ? 'active' : 'inactive';
        
        userObj.subscription.status = dynamicStatus;
        userObj.subscription.trialRemainingMs = isTrialActive ? (new Date(user.subscription.trialEndsAt) - now) : 0;
        userObj.subscription.isTrial = isTrialActive && !isPaidActive;

        userObj.financialMetrics = userObj.financialMetrics || {};
        userObj.financialMetrics.monthlyNetEarnings = monthlyNetEarnings;

        res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.json(userObj);
    } catch (err) {
        console.error("Profile Fetch Error:", err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// FIXED: Changed PUT to POST to match Dashboard.jsx handshake
// @route   POST api/user/update-goal
router.post('/update-goal', auth, async (req, res) => {
    try {
        const { title, targetAmount, isActive, stylePreference, resetProgress } = req.body;
        
        const updateFields = {
            "goalSettings.title": title,
            "goalSettings.targetAmount": Number(targetAmount),
            "goalSettings.isActive": isActive,
            "goalSettings.stylePreference": stylePreference
        };
        
        if (resetProgress) {
            updateFields["goalSettings.currentProgress"] = 0;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true }
        ).select('-password');
        
        await invalidateProfileCache(req.user.id);

        const authIo = req.app.get('io');
        if (authIo && user) {
            authIo.to(user.streamerId).emit('goal-update', user.goalSettings);
        }

        res.json(user ? user.goalSettings : {});
    } catch (err) {
        console.error("Goal update error:", err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// FIXED: Added missing Feedback Handshake for the Station
// @route   POST api/user/feedback
router.post('/feedback', auth, async (req, res) => {
    try {
        const { type, rating, message } = req.body;
        console.log(`📩 Signal Received from ${req.user.id}: [${type}] ${rating} Stars - ${message}`);
        // Logic to save to a Feedback collection could go here
        res.json({ msg: 'Insight Synchronized' });
    } catch (err) {
        res.status(500).json({ msg: 'Uplink Failure' });
    }
});

const nodemailer = require('nodemailer');

// --- REUSABLE TRANSPORTER SOCKET (Profile Sec) ---
const createTransporter = () => {
    return nodemailer.createTransport({
        // service: 'gmail', // Disable service shortcut
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        family: 4, // FORCE IPv4 to prevent ENETUNREACH IPv6 routing errors
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: false }
    });
};

// @route   POST api/user/update-profile
router.post('/update-profile', auth, async (req, res) => {
    try {
        const { fullName, username, bio, email, phone, avatar, nexusTheme, nexusThemeMode } = req.body;
        const user = await User.findById(req.user.id);

        let requiresOTP = false;
        const cleanEmail = email?.trim().toLowerCase();
        const cleanPhone = phone?.trim();

        // 1. Detect if sensitive communication nodes changed
        if (cleanEmail && cleanEmail !== user.email) requiresOTP = true;
        if (cleanPhone && cleanPhone !== user.phone) requiresOTP = true;

        if (requiresOTP) {
            // Uniqueness Verification Array
            const conflict = await User.findOne({
                $or: [{ email: cleanEmail }, { phone: cleanPhone }],
                _id: { $ne: user._id }
            });

            if (conflict) {
                return res.status(400).json({ msg: "Identity Conflict: Phone or Email is already registered to another node." });
            }

            // Generate Authorization Key
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

            user.pendingProfileUpdate = {
                email: cleanEmail || user.email,
                phone: cleanPhone || user.phone,
                expireAt: Date.now() + 600000 // 10 minutes
            };

            user.otp = { code: otpCode, expiresAt: Date.now() + 600000 };

            // Only update non-sensitive fields instantly
            if (fullName) user.fullName = fullName;
            if (username) {
                const oldStreamerId = user.streamerId;
                const newStreamerId = username.trim().toLowerCase().replace(/\s+/g, '');
                user.username = newStreamerId;
                user.streamerId = newStreamerId;

                // Sync all existing drop records to the new identity node
                if (oldStreamerId && oldStreamerId !== newStreamerId) {
                    await Drop.updateMany({ streamerId: oldStreamerId }, { $set: { streamerId: newStreamerId } });
                }
            }
            if (bio) user.bio = bio;
            if (avatar) user.avatar = avatar;
            if (nexusTheme) user.nexusTheme = nexusTheme;
            if (nexusThemeMode) user.nexusThemeMode = nexusThemeMode;

            await user.save();

            // Fire warning to CURRENT secure email
            const transporter = createTransporter();
            await transporter.sendMail({
                from: `"Drope Security" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: "Security Alert: Profile Migration",
                html: `
                    <div style="background:#050505; color:white; padding:30px; border-radius:15px; font-family:sans-serif; border: 1px solid #10B981;">
                        <h1 style="color:#10B981; font-style:italic;">Drope Security</h1>
                        <p style="text-transform:uppercase; letter-spacing:2px; font-size:10px; color:#888;">Identity Migration Authorization Key:</p>
                        <h2 style="font-size:38px; letter-spacing:8px; color:#10B981; margin: 20px 0;">${otpCode}</h2>
                        <p style="font-size:10px; color:#444;">This key expires in 10 minutes. If you did not request this, secure your account immediately.</p>
                    </div>`
            });

            // 206 triggers the OTP modal on frontend
            return res.status(206).json({ msg: "Security lock engaged. OTP transmitted to active mail node.", email: user.email });
        }

        // 2. Direct Instant Update (No sensitive fields altered)
        if (fullName) user.fullName = fullName;
        if (username) {
            const oldStreamerId = user.streamerId;
            const newStreamerId = username.trim().toLowerCase().replace(/\s+/g, '');
            user.username = newStreamerId;
            user.streamerId = newStreamerId;

            // Sync all existing drop records to the new identity node
            if (oldStreamerId && oldStreamerId !== newStreamerId) {
                await Drop.updateMany({ streamerId: oldStreamerId }, { $set: { streamerId: newStreamerId } });
            }
        }
        if (bio) user.bio = bio;
        if (avatar) user.avatar = avatar;
        if (nexusTheme) user.nexusTheme = nexusTheme;
        if (nexusThemeMode) user.nexusThemeMode = nexusThemeMode;

        // Single-key style backward compatibility
        if (req.body.alertStyle) user.overlaySettings.alertStyle = req.body.alertStyle;

        // Omni-Setting Bundle Support
        if (req.body.overlaySettings) {
            user.overlaySettings = { ...user.overlaySettings.toObject(), ...req.body.overlaySettings };
        }

        // Partner Pack Synchronization
        if (req.body.partnerPack) {
            user.partnerPack = req.body.partnerPack;
        }

        await user.save();

        // FIRING WEBSOCKETS TO FORCE OBS COMPONENT RERENDERS
        const io = req.app.get('io');
        if (io && req.body.overlaySettings) {
            if (user.obsKey) io.to(user.obsKey).emit('settings-update', user.overlaySettings);
            if (user.streamerId) io.to(user.streamerId).emit('settings-update', user.overlaySettings);
        }

        res.status(200).json(user);

    } catch (err) {
        console.error("Profile Update Error:", err);
        res.status(500).json({ msg: 'Database Synchronization Error.' });
    }
});

// @route   POST api/user/verify-profile-update
router.post('/verify-profile-update', auth, async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.otp || user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired authorization key." });
        }

        if (user.pendingProfileUpdate) {
            // If phone changed, mark the new one as verified.
            if (user.pendingProfileUpdate.phone !== user.phone) {
                user.isPhoneVerified = true;
            }
            user.email = user.pendingProfileUpdate.email;
            user.phone = user.pendingProfileUpdate.phone;
        }

        // Security Wipe
        user.otp = undefined;
        user.pendingProfileUpdate = undefined;
        await user.save();

        res.status(200).json(user);
    } catch (err) {
        console.error("Verify Update Error:", err);
        res.status(500).json({ msg: 'Security Handshake Failed.' });
    }
});

// @route   GET api/user/public/:streamerId
router.get('/public/:streamerId', async (req, res) => {
    try {
        // Use regex for robust case-insensitive matching
        const safeQuery = { $regex: new RegExp(`^${(req.params.streamerId || '').replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}$`, 'i') };
        const user = await User.findOne({ $or: [{ streamerId: safeQuery }, { username: safeQuery }] })
            .select('username streamerId bio avatar tier partnerPack goalSettings overlaySettings nexusTheme nexusThemeMode');
        if (!user) return res.status(404).json({ msg: 'Streamer not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
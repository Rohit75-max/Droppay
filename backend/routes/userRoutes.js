const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { createOnboardingLink } = require('../controllers/onboardingController');
const { requestWithdrawal, purchasePremiumStyle, purchasePremiumAlert, purchaseNexusTheme, purchaseWidget, equipWidget, equipAsset } = require('../controllers/userController');
// @route   POST api/user/link-bank
router.post('/link-bank', auth, createOnboardingLink);

// @route   POST api/user/withdraw
// @desc    Process autonomous node payout requests
router.post('/withdraw', auth, requestWithdrawal);

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

// @route   GET api/user/profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// FIXED: Changed PUT to POST to match Dashboard.jsx handshake
// @route   POST api/user/update-goal
router.post('/update-goal', auth, async (req, res) => {
    try {
        const { title, targetAmount, showOnDashboard, stylePreference } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    "goalSettings.title": title,
                    "goalSettings.targetAmount": Number(targetAmount),
                    "goalSettings.showOnDashboard": showOnDashboard,
                    "goalSettings.stylePreference": stylePreference
                }
            },
            { returnDocument: 'after' }
        ).select('-password');
        const authIo = req.app.get('io');
        if (authIo) {
            authIo.to(user.streamerId).emit('goal-update', user.goalSettings);
        }

        res.json(user.goalSettings);
    } catch (err) {
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
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
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
                user.username = username.trim().toLowerCase().replace(/\s+/g, '');
                user.streamerId = user.username;
            }
            if (bio) user.bio = bio;
            if (avatar) user.avatar = avatar;
            if (nexusTheme) user.nexusTheme = nexusTheme;
            if (nexusThemeMode) user.nexusThemeMode = nexusThemeMode;

            await user.save();

            // Fire warning to CURRENT secure email
            const transporter = createTransporter();
            await transporter.sendMail({
                from: `"DropPay Security" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: "Security Alert: Profile Migration",
                html: `
                    <div style="background:#050505; color:white; padding:30px; border-radius:15px; font-family:sans-serif; border: 1px solid #10B981;">
                        <h1 style="color:#10B981; font-style:italic;">DropPay Security</h1>
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
            user.username = username.trim().toLowerCase().replace(/\s+/g, '');
            user.streamerId = user.username;
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
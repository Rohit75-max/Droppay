const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { invalidateProfileCache } = require('../middleware/profileCache');

// --- VAULT-GRADE SECURITY REGEX (1 Upper, 1 Number, 1 Special, 8+ Total) ---
const securityRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

// --- UTIL: NoSQL REGEX SANITIZER ---
const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// --- REUSABLE TRANSPORTER SOCKET ---
const createTransporter = () => {
    return nodemailer.createTransport({
        // service: 'gmail', // Disable service shortcut to use custom host/port reliably
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        family: 4, // FORCE IPv4 to prevent ENETUNREACH 2607:f8b0... errors on hosting providers
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: false }
    });
};

// HELPER: Professional Email Dispatch
const sendOTPEmail = async (email, otpCode) => {
    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"Drope Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your Drope Account",
        html: `
            <div style="background:#050505; color:white; padding:30px; border-radius:15px; font-family:sans-serif; border: 1px solid #10B981;">
                <h1 style="color:#10B981; font-style:italic;">Drope Activation</h1>
                <p style="text-transform:uppercase; letter-spacing:2px; font-size:10px; color:#888;">Identity Verification Key:</p>
                <h2 style="font-size:38px; letter-spacing:8px; color:#10B981; margin: 20px 0;">${otpCode}</h2>
                <p style="font-size:10px; color:#444;">This key expires in 10 minutes.</p>
            </div>`
    });
};

// 1. SIGNUP: Hardened with Identity Conflict Protocol
exports.signup = async (req, res) => {
    try {
        const { fullName, username, phone, password, referralCode } = req.body;
        const email = req.body.email.trim().toLowerCase();

        // Username is the Primary Identity Key
        const cleanHandle = username.trim().toLowerCase().replace(/\s+/g, '');
        const cleanStreamerId = cleanHandle; // Synced

        // Check for specific Identity Conflicts
        const userByUsername = await User.findOne({ username: cleanHandle, isEmailVerified: true });
        if (userByUsername) return res.status(400).json({ msg: `Identity Conflict: Username '${username}' is already claimed by another node.` });

        const userByPhone = await User.findOne({ phone: phone.trim(), isEmailVerified: true });
        if (userByPhone) return res.status(400).json({ msg: "Identity Conflict: Phone Number already registered to an active profile." });

        if (!securityRegex.test(password)) {
            return res.status(400).json({ msg: "Security Protocol: Password too weak." });
        }

        let user = await User.findOne({ email });
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ENHANCED FLOW: Resend OTP for existing unverified nodes
        if (user && !user.isEmailVerified) {
            user.username = username;
            user.phone = phone;
            user.streamerId = cleanStreamerId;
            user.password = hashedPassword;

            // Fix Mongoose Nested Object Persistence
            if (!user.otp) user.otp = {};
            user.otp.code = otpCode;
            user.otp.expiresAt = Date.now() + 600000;
            user.markModified('otp');

            await user.save();
            await sendOTPEmail(email, otpCode);
            // Return 206 to signal the frontend to jump to the OTP screen
            return res.status(206).json({ msg: "Identity Node exists but unverified. Re-transmitting OTP." });
        } else if (user && user.isEmailVerified) {
            return res.status(400).json({ msg: "Identity Conflict: Node already active." });
        } else {
            // Enterprise Feature: Process Referral Networking
            let referrer = null;
            if (referralCode) {
                const cleanRef = referralCode.trim();
                referrer = await User.findOne({
                    $or: [
                        { streamerId: cleanRef.toLowerCase() },
                        { username: new RegExp(`^${escapeRegex(cleanRef)}$`, 'i') }
                    ]
                });
                console.log(`[REFERRAL] Code: "${cleanRef}" → Referrer found: ${referrer ? referrer.username : 'NONE'}`);
            }

            user = new User({
                fullName, username: cleanHandle, email, phone, streamerId: cleanStreamerId,
                password: hashedPassword, isEmailVerified: false,
                otp: { code: otpCode, expiresAt: Date.now() + 600000 },
                referredBy: referrer ? referrer._id : undefined
            });
            await user.save();
        }

        await sendOTPEmail(email, otpCode);
        res.status(201).json({ msg: "Identity Node saved. OTP transmitted." });
    } catch (err) {
        console.error("SIGNUP CRASH LOG:", err);
        res.status(500).json({ msg: err.message || "Signup Transmission Error." });
    }
};

// 2. VERIFY: Matches /verify-email in authRoutes.js
exports.verifyEmail = async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const { otp } = req.body;
        const user = await User.findOne({ email });

        console.log("--- OTP DEBUG LOG ---");
        console.log("Email Searched:", email);
        console.log("User Found:", !!user);
        console.log("Frontend OTP Received:", otp, typeof otp);
        if (user) {
            console.log("Backend DB OTP:", user.otp?.code, typeof user.otp?.code);
            console.log("Backend DB Expiry:", user.otp?.expiresAt, "Current Time:", new Date());
        }

        if (!user || user.otp?.code !== otp || user.otp?.expiresAt < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired transmission key." });
        }

        user.isEmailVerified = true;
        user.otp = undefined;
        await user.save();

        // Enterprise Feature: Credit the Recruiter upon successful activation!
        if (user.referredBy) {
            // Increment referral count atomically
            const updatedReferrer = await User.findByIdAndUpdate(
                user.referredBy,
                { $inc: { referralCount: 1 } },
                { new: true }  // Return updated doc to check tier threshold
            );

            // Auto-upgrade tier based on referral milestones
            if (updatedReferrer) {
                let newTier = updatedReferrer.tier;
                const count = updatedReferrer.referralCount;
                if (count >= 50 && newTier !== 'legend') newTier = 'legend';
                else if (count >= 10 && newTier !== 'legend' && newTier !== 'pro') newTier = 'pro';
                else if (count >= 1 && newTier === 'none') newTier = 'starter';

                if (newTier !== updatedReferrer.tier) {
                    await User.findByIdAndUpdate(user.referredBy, { tier: newTier });
                }

                // Bust Redis cache so referrer sees updated count immediately
                await invalidateProfileCache(user.referredBy.toString());
            }
        }

        const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '24h' });
        // --- ADDED FOR LIVE PRODUCTION ---
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,      // Required for HTTPS
            sameSite: 'none',  // Required for cross-site
            maxAge: 24 * 60 * 60 * 1000
        });

        // --- IRONCLAD SUBSCRIPTION SENTINEL (Handshake Upgrade) ---
        const TRIAL_MS = 7 * 24 * 60 * 60 * 1000;
        const now = new Date();
        const accountAge = now - user.createdAt;
        const isTrialActive = accountAge < TRIAL_MS;
        const isPaidActive = user.subscription?.status === 'active' && 
                           user.subscription?.expiryDate && 
                           new Date(user.subscription.expiryDate) > now;

        const dynamicStatus = (isTrialActive || isPaidActive) ? 'active' : 'inactive';

        res.status(200).json({
            token,
            user: {
                username: user.username,
                subscription: {
                    ...user.subscription.toObject(),
                    status: dynamicStatus,
                    isTrial: isTrialActive && !isPaidActive,
                    trialRemainingMs: Math.max(0, TRIAL_MS - accountAge)
                }
            }
        });
    } catch (err) {
        console.error("VERIFY OTP ERROR:", err);
        res.status(500).json({ msg: "Activation Handshake Error: Identity verification sequence failed." });
    }
};

// 3. LOGIN
exports.login = async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const { password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.password) return res.status(400).json({ msg: "Authentication Failed: Identity Node not found." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Authentication Failed: Password protocol mismatch." });

        // ENHANCED: If not verified, trigger OTP re-transmission and signal frontend (206)
        if (!user.isEmailVerified) {
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            if (!user.otp) user.otp = {};
            user.otp.code = otpCode;
            user.otp.expiresAt = Date.now() + 600000;
            user.markModified('otp');
            await user.save();
            await sendOTPEmail(email, otpCode);

            return res.status(206).json({
                msg: "Identity Node exists but unverified. Re-transmitting OTP.",
                email: user.email
            });
        }

        // FORTIFIED: Restrict Admins from using the public login surface
        if (user.role === 'admin') {
            return res.status(403).json({ msg: "Security Protocol Violation: Master Nodes must authenticate via the Secure Admin Portal." });
        }

        // Enterprise Upgrades: Log Auditable Access Telemetry
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        await User.findByIdAndUpdate(user._id, {
            'security.lastLogin': new Date(),
            'security.lastLoginIP': ip
        });

        const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // --- ADDED FOR LIVE PRODUCTION ---
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,      // Required for HTTPS (Render/Vercel)
            sameSite: 'none',  // Required for cross-site communication
            maxAge: 24 * 60 * 60 * 1000
        });
        // --- IRONCLAD SUBSCRIPTION SENTINEL (Handshake Upgrade) ---
        const TRIAL_MS = 7 * 24 * 60 * 60 * 1000;
        const now = new Date();
        const accountAge = now - user.createdAt;
        const isTrialActive = accountAge < TRIAL_MS;
        const isPaidActive = user.subscription?.status === 'active' && 
                           user.subscription?.expiryDate && 
                           new Date(user.subscription.expiryDate) > now;

        const dynamicStatus = (isTrialActive || isPaidActive) ? 'active' : 'inactive';

        res.json({
            token,
            user: {
                username: user.username,
                subscription: {
                    ...user.subscription.toObject(),
                    status: dynamicStatus,
                    isTrial: isTrialActive && !isPaidActive,
                    trialRemainingMs: Math.max(0, TRIAL_MS - accountAge)
                }
            }
        });
    } catch (err) {
        console.error("LOGIN CRASH LOG:", err);
        res.status(500).json({ msg: "Login Node Error.", error: err.message });
    }
};

// 3.5 ADMIN LOGIN (Exclusive Route)
exports.adminLogin = async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const { password } = req.body;
        
        // ENTERPRISE SEC: Target the dedicated ADMIN collection
        const admin = await Admin.findOne({ email });

        if (!admin || !admin.isActive) {
            return res.status(400).json({ msg: "Admin Authentication Failed. Node inactive or not found." });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: "Admin Authentication Failed. Invalid Key." });

        // Security Telemetry
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        admin.lastLogin = new Date();
        admin.lastLoginIP = ip;
        await admin.save();

        const token = jwt.sign({ user: { id: admin._id } }, process.env.JWT_SECRET, { expiresIn: '12h' });

        // --- ADDED FOR LIVE PRODUCTION ---
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 12 * 60 * 60 * 1000
        });

        res.json({ token, user: { username: admin.username, role: admin.role } });
    } catch (err) {
        console.error("ADMIN LOGIN CRASH LOG:", err);
        res.status(500).json({ msg: "Admin Portal Error.", error: err.message });
    }
};

// 4. FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "Identity Node Not Found." });

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"Drope Security" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Reset Your Access Key",
            html: `<p>Access Recovery Initialized. Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });

        res.json({ msg: "Reset link transmitted." });
    } catch (err) {
        res.status(500).json({ msg: "Node Rejected Email Handshake." });
    }
};

// 5. RESET PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!securityRegex.test(newPassword)) return res.status(400).json({ msg: "Weak Password." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
        res.json({ msg: "Access Key updated successfully." });
    } catch (err) {
        res.status(400).json({ msg: "Security link expired or invalid." });
    }
};
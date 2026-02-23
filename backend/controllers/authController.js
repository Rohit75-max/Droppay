const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// --- VAULT-GRADE SECURITY REGEX (1 Upper, 1 Number, 1 Special, 8+ Total) ---
const securityRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

// --- REUSABLE TRANSPORTER SOCKET ---
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

// HELPER: Professional Email Dispatch
const sendOTPEmail = async (email, otpCode) => {
    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"DropPay Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your DropPay Account",
        html: `
            <div style="background:#050505; color:white; padding:30px; border-radius:15px; font-family:sans-serif; border: 1px solid #10B981;">
                <h1 style="color:#10B981; font-style:italic;">DropPay Activation</h1>
                <p style="text-transform:uppercase; letter-spacing:2px; font-size:10px; color:#888;">Identity Verification Key:</p>
                <h2 style="font-size:38px; letter-spacing:8px; color:#10B981; margin: 20px 0;">${otpCode}</h2>
                <p style="font-size:10px; color:#444;">This key expires in 10 minutes.</p>
            </div>`
    });
};

// 1. SIGNUP: Hardened with Identity Conflict Protocol
exports.signup = async (req, res) => {
    try {
        const { username, phone, password, streamerId } = req.body;
        const email = req.body.email.trim().toLowerCase();
        const cleanStreamerId = streamerId.trim().toLowerCase();

        // Check for Identity Conflicts
        const identityConflict = await User.findOne({ 
            $or: [{ username }, { streamerId: cleanStreamerId }],
            isEmailVerified: true 
        });

        if (identityConflict) {
            return res.status(400).json({ msg: "Identity Conflict: Name or Link already claimed." });
        }

        if (!securityRegex.test(password)) {
            return res.status(400).json({ msg: "Security Protocol: Password too weak." });
        }

        let user = await User.findOne({ email });
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user && !user.isEmailVerified) {
            user.username = username;
            user.phone = phone;
            user.streamerId = cleanStreamerId;
            user.password = hashedPassword;
            user.otp = { code: otpCode, expiresAt: Date.now() + 600000 };
            await user.save();
        } else if (user && user.isEmailVerified) {
            return res.status(400).json({ msg: "Identity Conflict: Node already active." });
        } else {
            user = new User({
                username, email, phone, streamerId: cleanStreamerId,
                password: hashedPassword, isEmailVerified: false,
                otp: { code: otpCode, expiresAt: Date.now() + 600000 }
            });
            await user.save();
        }

        await sendOTPEmail(email, otpCode);
        res.status(201).json({ msg: "Identity Node saved. OTP transmitted." });
    } catch (err) {
        res.status(500).json({ msg: "Signup Transmission Error." });
    }
};

// 2. VERIFY: Matches /verify-email in authRoutes.js
exports.verifyEmail = async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const { otp } = req.body; 
        const user = await User.findOne({ email });

        if (!user || user.otp?.code !== otp || user.otp?.expiresAt < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired transmission key." });
        }

        user.isEmailVerified = true;
        user.otp = undefined;
        await user.save();

        const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ token, user: { username: user.username } });
    } catch (err) {
        res.status(500).json({ msg: "Activation Handshake Error." });
    }
};

// 3. LOGIN
exports.login = async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const { password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.password) return res.status(400).json({ msg: "Authentication Failed." });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Authentication Failed." });
        if (!user.isEmailVerified) return res.status(401).json({ msg: "Verify email node." });

        const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { username: user.username } });
    } catch (err) {
        res.status(500).json({ msg: "Login Node Error." });
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
            from: `"DropPay Security" <${process.env.EMAIL_USER}>`,
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
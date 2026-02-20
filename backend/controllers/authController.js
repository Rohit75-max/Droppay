const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// 1. SIGNUP: Create account & send OTP
exports.signup = async (req, res) => {
    try {
        const { username, email, phone, password, streamerId } = req.body;

        let userExists = await User.findOne({ $or: [{ email }, { phone }, { streamerId }] });
        if (userExists) {
            return res.status(400).json({ msg: "Email, Phone, or Unique-Slug already in use." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            username,
            email,
            phone,
            streamerId,
            password: hashedPassword,
            otp: { code: otpCode, expiresAt: Date.now() + 600000 }
        });

        await user.save();
        await sendOTPEmail(email, otpCode);

        res.status(201).json({ msg: "Registration successful. OTP sent to your email." });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ msg: err.message || "Server Error" });
    }
};

// 2. VERIFY: Confirm OTP and activate account
exports.verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body; 
        const user = await User.findOne({ email });

        if (!user || !user.otp || user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        user.isEmailVerified = true;
        user.otp = undefined; 
        await user.save();

        const payload = { user: { id: user.id, plan: user.subscription.plan } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({ 
            msg: "Email verified!", 
            token,
            user: { username: user.username, plan: user.subscription.plan }
        });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// 3. LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });
        if (!user.isEmailVerified) return res.status(401).json({ msg: "Please verify email." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        const payload = { user: { id: user.id, plan: user.subscription.plan } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { username: user.username, plan: user.subscription.plan } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// 4. FORGOT PASSWORD: Send Reset Link
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User with this email does not exist." });

        // Generate a 15-minute secure token
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
            from: `"DropPay Security" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset Your DropPay Password",
            html: `<h3>Password Reset Request</h3>
                   <p>Click the link below to reset your password. It expires in 15 minutes.</p>
                   <a href="${resetLink}">${resetLink}</a>`
        });

        res.json({ msg: "Reset link sent to your email." });
    } catch (err) {
        res.status(500).json({ msg: "Error sending recovery email." });
    }
};

// 5. RESET PASSWORD: Update Database
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        // Verify the reset token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
        res.json({ msg: "Password successfully updated! You can now log in." });
    } catch (err) {
        res.status(400).json({ msg: "Invalid or expired reset link." });
    }
};

// HELPER: Gmail Transporter
async function sendOTPEmail(email, code) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
        from: `"DropPay Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your DropPay Account",
        text: `Your DropPay verification code is: ${code}.`
    });
}
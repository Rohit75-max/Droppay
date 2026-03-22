const razorpay = require('../config/razorpay');
const User = require('../models/User');
const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = crypto.createHash('sha256').update(String(process.env.RAZORPAY_KEY_SECRET || 'secret')).digest('base64').substring(0, 32);

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

const stringSimilarity = require('string-similarity');
const axios = require('axios');

/**
 * UPLINK: SECURE BANKING NODE INITIALIZATION
 * Directly collects and links a Razorpay Fund Account for immediate Payout routing.
 */
exports.addBankAccount = async (req, res) => {
    try {
        const { type = 'bank_account', name, ifsc, account_number, vpa, otp } = req.body;

        if (!name || !otp) {
            return res.status(400).json({ msg: "Incomplete details or missing authorization key." });
        }

        if (type === 'bank_account' && (!ifsc || !account_number)) {
            return res.status(400).json({ msg: "Bank account details missing." });
        }

        if (type === 'vpa' && !vpa) {
            return res.status(400).json({ msg: "UPI ID missing." });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ msg: "Authentication required." });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User Node Not Found" });

        // --- 1. OTP VERIFICATION (Security Gateway) ---
        if (!user.otp || user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired authorization key." });
        }

        // --- 2. CONTACT CREATION ---
        let contactId = user.razorpayContactId;

        if (!contactId) {
            try {
                const contact = await razorpay.customers.create({
                    name: user.fullName || user.username,
                    email: user.email,
                    contact: user.phone || "9999999999",
                    reference_id: user._id.toString(),
                    notes: { username: user.username }
                });
                contactId = contact.id;
                user.razorpayContactId = contactId;
                await user.save();
            } catch (err) {
                console.error("Contact Creation Failed:", err);
                return res.status(500).json({ msg: "Banking Uplink Failed (Contact)." });
            }
        }

        // --- 3. FUND ACCOUNT CREATION ---
        try {
            const fundAccountPayload = {
                contact_id: contactId,
                account_type: type
            };

            if (type === 'bank_account') {
                fundAccountPayload.bank_account = { name, ifsc, account_number };
            } else if (type === 'vpa') {
                fundAccountPayload.vpa = { address: vpa };
            }

            const fundAccount = await razorpay.fundAccount.create(fundAccountPayload);

            // --- 4. ATOMIC SYNC ---
            user.razorpayFundAccountId = fundAccount.id;
            user.payoutSettings = {
                ...user.payoutSettings,
                onboardingStatus: 'active',
                bankDetailsLinked: true
            };

            // 🔒 SAVE ENCRYPTED BANK PARTICULARS
            if (type === 'bank_account') {
                user.bankDetails = {
                    account_holder_name: name,
                    account_number_encrypted: encrypt(account_number),
                    ifsc_encrypted: encrypt(ifsc),
                    masked_account: `****${account_number.slice(-4)}`
                };
            } else if (type === 'vpa') {
                user.bankDetails = {
                    account_holder_name: name,
                    masked_account: vpa
                };
            }

            // Wipe the OTP securely
            user.otp = undefined;
            await user.save();

            res.status(200).json({
                status: "success",
                msg: "Banking Node Authenticated & Secured.",
                fundAccountId: fundAccount.id
            });

        } catch (fundErr) {
            console.error("Fund Account Creation Failed:", fundErr);
            return res.status(400).json({
                msg: fundErr.error?.description || "Failed to link banking details. Verify IFSC and Account Number."
            });
        }
    } catch (error) {
        console.error("Critical Banking Node Failure:", error.message);
        res.status(500).json({
            msg: "Internal Server Fault. Re-attempt linkage."
        });
    }
};

exports.verifyBank = async (req, res) => {
    try {
        const { type = 'bank_account', name, ifsc, account_number, vpa, otp } = req.body;

        if (!name || (!account_number && !vpa)) {
            return res.status(400).json({ msg: "Incomplete details or missing authorization key." });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ msg: "Authentication required." });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User Node Not Found" });

        // --- 1. CONTACT CREATION (Implicit) ---
        let contactId = user.razorpayContactId;
        if (!contactId) {
            try {
                const contact = await razorpay.customers.create({
                    name: user.fullName || user.username,
                    email: user.email,
                    contact: user.phone || "9999999999",
                    reference_id: user._id.toString(),
                });
                contactId = contact.id;
                user.razorpayContactId = contactId;
                await user.save();
            } catch (err) {
                console.error("Contact Creation Failed on Verify:", err);
                return res.status(500).json({ msg: "Form Setup Failed (Contact)." });
            }
        }

        // --- 2. RAZORPAYX PENNY DROP (Fund Account Validation) ---
        let registeredName = "";
        let validationStatus = "failed";

        try {
            const authHeader = `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`;
            const fundPayload = {
                account_type: type,
                fund_account: {
                    account_type: type,
                    [type]: type === 'bank_account' ? { name, ifsc, account_number } : { address: vpa }
                }
            };

            const response = await axios.post(
                'https://api.razorpay.com/v1/fund_accounts/validations',
                fundPayload,
                { headers: { Authorization: authHeader } }
            );

            registeredName = response.data.results?.registered_name || "";
            validationStatus = response.data.status; 

        } catch (pennyErr) {
            console.error("Penny Drop API Failure:", pennyErr.response?.data || pennyErr.message);
            return res.status(400).json({ msg: "Fund validation triggered failure. verify numbers nodes." });
        }

        // --- 3. FUZZY MATCH LOGIC ---
        const targetName = (user.fullName || user.username).toLowerCase();
        const score = stringSimilarity.compareTwoStrings(registeredName.toLowerCase(), targetName);
        const threshold = 0.85;

        const isVerified = score >= threshold;

        // --- 4. FUND ACCOUNT CREATION FOR VERIFIED NODES ---
        let fundAccountId = null;
        if (isVerified) {
            try {
                const fundAcc = await razorpay.fundAccount.create({
                    contact_id: contactId,
                    account_type: type,
                    [type]: type === 'bank_account' ? { name, ifsc, account_number } : { address: vpa }
                });
                fundAccountId = fundAcc.id;
                user.razorpayFundAccountId = fundAccountId;
            } catch (fAccErr) {
                console.error("Fund Creation post-verify failure:", fAccErr);
            }
        }

        // --- 5. SECURE STATE COMMIT ---
        user.payoutSettings = {
            ...user.payoutSettings,
            bankDetailsLinked: true,
            onboardingStatus: isVerified ? 'active' : 'pending',
            bankVerificationStatus: isVerified ? 'verified' : 'pending' 
        };

        if (isVerified) {
            if (type === 'bank_account') {
                user.bankDetails = {
                    account_holder_name: name,
                    account_number_encrypted: encrypt(account_number),
                    ifsc_encrypted: encrypt(ifsc),
                    masked_account: `****${account_number.slice(-4)}`
                };
            } else {
                user.bankDetails = { account_holder_name: name, masked_account: vpa };
            }
        } else {
            user.bankDetails = {
                account_holder_name: name,
                masked_account: type === 'bank_account' ? `****${account_number.slice(-4)}` : vpa
            };
        }

        await user.save();

        res.status(200).json({
            status: isVerified ? 'verified' : 'pending',
            similarity: score,
            registeredName,
            msg: isVerified 
                ? "Penny Drop Success! Account Bound." 
                : "Fuzzy Mismatch. Account sent to Pending Admin Review."
        });

    } catch (err) {
        console.error("Critical Penny Drop Failure:", err);
        res.status(500).json({ msg: "Internal Verification Fault." });
    }
};
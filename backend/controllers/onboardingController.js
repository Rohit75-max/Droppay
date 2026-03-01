const razorpay = require('../config/razorpay');
const User = require('../models/User');

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
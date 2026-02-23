const razorpay = require('../config/razorpay');
const User = require('../models/User');

/**
 * UPLINK: CREATOR BANKING INITIALIZATION
 * Synchronizes the streamer with the Razorpay Route ecosystem.
 */
exports.createOnboardingLink = async (req, res) => {
    try {
        // Fetch user with specific banking fields to prevent data leakage
        const user = await User.findById(req.user.id).select('email username razorpayAccountId payoutSettings');

        if (!user) return res.status(404).json({ msg: "User Node Not Found" });

        // --- 1. IDEMPOTENCY CHECK ---
        // Prevents duplicate account creation if the user already has a Razorpay ID.
        if (user.razorpayAccountId) {
            try {
                const existingLink = await razorpay.stakeholders.createOnboardingLink(user.razorpayAccountId, {
                    return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?onboarding=success`
                });
                return res.json({ url: existingLink.url });
            } catch (linkErr) {
                console.error("Existing Account Link Generation Failure:", linkErr.message);
                // If link generation fails but account exists, we attempt to re-sync below.
            }
        }

        // --- 2. ACCOUNT DEPLOYMENT ---
        // Creating the Route-Linked account placeholder.
        const account = await razorpay.accounts.create({
            email: user.email,
            name: user.username,
            type: "route", 
            reference_id: user._id.toString(),
            legal_business_name: user.username,
            customer_facing_business_name: `${user.username} on DropPay`,
            profile: { 
                category: "entertainment", 
                subcategory: "video_streaming",
                description: "Digital content creator and streamer services."
            }
        });

        // --- 3. ATOMIC SYNC (Logic Hardened for User.js) ---
        // Log the account ID and update status to 'pending' to match UserSchema enum.
        user.razorpayAccountId = account.id;
        user.payoutSettings = { 
            ...user.payoutSettings, 
            onboardingStatus: 'pending' 
        };
        await user.save();

        // --- 4. HOSTED ONBOARDING LINK ---
        // Generate the secure link to the Razorpay-hosted KYC terminal.
        const onboardingLink = await razorpay.stakeholders.createOnboardingLink(account.id, {
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?onboarding=success`
        });

        res.status(200).json({ 
            status: "success",
            url: onboardingLink.url,
            accountId: account.id 
        });
        
    } catch (error) {
        console.error("Critical Onboarding Node Failure:", error.message);
        res.status(500).json({ 
            msg: "Banking Uplink Failed. Verify profile details and re-attempt." 
        });
    }
};
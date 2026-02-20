const razorpay = require('../config/razorpay');
const User = require('../models/User');

exports.createOnboardingLink = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // 1. Check if user already has a Razorpay account
        // This prevents creating duplicate linked accounts in your dashboard
        if (user.razorpayAccountId) {
            const existingLink = await razorpay.stakeholders.createOnboardingLink(user.razorpayAccountId, {
                return_url: `http://localhost:3000/dashboard?onboarding=success`
            });
            return res.json({ url: existingLink.url });
        }

        // 2. Create the Linked Account placeholder on Razorpay
        const account = await razorpay.accounts.create({
            email: user.email,
            name: user.username,
            type: "route", // Required for split payments
            reference_id: user._id.toString(), // Ties MongoDB ID to Razorpay
            legal_business_name: user.username,
            customer_facing_business_name: "DropPay Streamer",
            profile: { 
                category: "entertainment", 
                subcategory: "video_streaming" 
            }
        });

        // 3. Save the new Account ID to your database
        user.razorpayAccountId = account.id;
        await user.save();

        // 4. Generate the official Hosted Onboarding Link
        const onboardingLink = await razorpay.stakeholders.createOnboardingLink(account.id, {
            return_url: `http://localhost:3000/dashboard?onboarding=success`
        });

        res.json({ url: onboardingLink.url });
        
    } catch (error) {
        console.error("Onboarding Error:", error);
        res.status(500).json({ 
            msg: "Could not generate onboarding link. Please try again later." 
        });
    }
};
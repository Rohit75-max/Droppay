const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User'); 
const Drop = require('../models/Drop'); 
const moment = require('moment'); 

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * 1. CREATE RECURRING SUBSCRIPTION
 * Logic: Creates a Razorpay Subscription ID for Autopay.
 */
exports.createSubscription = async (req, res) => {
    try {
        const { planId, billingCycle } = req.body;
        const planMap = {
            'starter': process.env.RAZORPAY_PLAN_STARTER_ID, 
            'pro': process.env.RAZORPAY_PLAN_PRO_ID, 
            'legend': process.env.RAZORPAY_PLAN_LEGEND_ID
        };

        const subscription = await razorpay.subscriptions.create({
            plan_id: planMap[planId],
            total_count: billingCycle === 12 ? 1 : (billingCycle === 6 ? 1 : 12),
            quantity: 1,
            customer_notify: 1,
            notes: { userId: req.user.id, planType: planId }
        });
        res.status(200).json(subscription);
    } catch (error) {
        console.error("Subscription Error:", error);
        res.status(500).json({ msg: "Failed to initialize autopay mission" });
    }
};

/**
 * 2. VERIFY RECURRING SUBSCRIPTION
 * Logic: Verifies initial payment and AUTOMATICALLY activates the Tier.
 */
exports.verifySubscription = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, plan } = req.body;
        const body = razorpay_payment_id + "|" + razorpay_subscription_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ status: "failed", msg: "Invalid signature" });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Update Subscription Details
        user.subscription.plan = plan;
        user.subscription.status = 'active';
        user.subscription.razorpaySubscriptionId = razorpay_subscription_id;
        
        // --- AUTOMATIC TIER ACTIVATION ---
        user.tier = plan; 
        
        // Expiry = 7 Days Trial + 1 month cycle
        user.subscription.expiryDate = moment().add(7, 'days').add(1, 'month').toDate();
        
        await user.save();
        res.json({ status: "success", msg: "Autopay mission active", tier: user.tier });
    } catch (error) {
        console.error("Verify Subscription Error:", error);
        res.status(500).json({ msg: "Activation failed" });
    }
};

/**
 * 3. RAZORPAY WEBHOOK LISTENER
 * Automatically manages Tiers based on recurring charge success/failure.
 */
exports.handleWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers["x-razorpay-signature"];
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (expectedSignature !== signature) {
            return res.status(400).send('Invalid Signature');
        }

        const event = req.body.event;
        const subscription = req.body.payload.subscription.entity;

        // When a recurring payment is successful
        if (event === 'subscription.charged') {
            const user = await User.findOne({ "subscription.razorpaySubscriptionId": subscription.id });
            if (user) {
                user.subscription.status = 'active';
                user.tier = user.subscription.plan; // Ensure Tier is active
                user.subscription.expiryDate = moment(user.subscription.expiryDate).add(1, 'month').toDate();
                await user.save();
            }
        }

        // When a subscription is cancelled or payment fails multiple times
        if (event === 'subscription.halted' || event === 'subscription.cancelled') {
            const user = await User.findOne({ "subscription.razorpaySubscriptionId": subscription.id });
            if (user) {
                user.subscription.status = 'expired';
                user.tier = 'none'; // Lock the Dashboard
                await user.save();
            }
        }
        res.status(200).send('ok');
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).send();
    }
};

/**
 * 4. SUBSCRIBE TO MISSION (LEGACY/MANUAL)
 */
exports.subscribe = async (req, res) => {
    try {
        const { plan, months } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        if (plan === 'starter') {
            if (user.subscription.expiryDate) {
                return res.status(403).json({ status: "failed", msg: "Trial already used." });
            }
            user.subscription.plan = 'starter';
            user.tier = 'starter'; // Set Tier
            user.subscription.status = 'active';
            user.subscription.expiryDate = moment().add(7, 'days').toDate();
            await user.save();
            return res.status(200).json({ status: "success", msg: "Starter mission deployed" });
        }

        user.subscription.plan = plan;
        user.tier = plan; // Set Tier for Pro/Legend
        user.subscription.status = 'active';
        let expiry = moment().add(months, 'months');
        if (!user.subscription.expiryDate) expiry.add(7, 'days');
        user.subscription.expiryDate = expiry.toDate();
        await user.save();
        res.status(200).json({ status: "success", tier: user.tier });
    } catch (error) {
        res.status(500).json({ msg: "Mission deployment failed" });
    }
};

/**
 * 5. DAILY EXPIRY CHECKER
 * Updated to lock the Tier when the time runs out.
 */
exports.checkExpirations = async () => {
    try {
        const now = new Date();
        const result = await User.updateMany(
            { "subscription.status": "active", "subscription.expiryDate": { $lt: now } },
            { $set: { "subscription.status": "expired", "tier": "none" } }
        );
        if (result.modifiedCount > 0) {
            console.log(`[System]: ${result.modifiedCount} missions locked. Tiers reset to none.`);
        }
    } catch (err) { console.error("Expiry check error:", err); }
};

/**
 * 6. VERIFY DONATION & DYNAMIC REVENUE SPLIT
 * Logic: Uses the subscription plan to determine the creator's cut.
 */
exports.verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, razorpay_payment_id, razorpay_signature,
            streamerId, donorName, message, sticker, amount 
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            const streamer = await User.findOne({ streamerId });
            if (!streamer) return res.status(404).json({ msg: "Streamer not found" });

            // Percentage based on active subscription
            let creatorPercent = 0.85; 
            if (streamer.subscription.plan === 'pro') creatorPercent = 0.90; 
            if (streamer.subscription.plan === 'legend') creatorPercent = 0.95; 

            const creatorShare = Number(amount) * creatorPercent;

            const dropData = await Drop.create({
                streamerId, donorName: donorName || "Anonymous", amount: Number(amount), 
                message: message || "", sticker: sticker || "zap", status: "completed"
            });

            streamer.goalSettings.currentProgress += Number(amount);
            streamer.walletBalance += creatorShare;
            await streamer.save();

            const io = req.app.get('io');
            if (io) {
                io.to(streamer.obsKey).emit('new-drop', { donorName, amount, message, sticker });
                io.to(streamer.obsKey).emit('goal-update', streamer.goalSettings);
            }
                
            if (streamer.razorpayAccountId && streamer.payoutSettings.bankDetailsLinked) {
                try {
                    await razorpay.payments.transfer(razorpay_payment_id, {
                        transfers: [{
                            account: streamer.razorpayAccountId,
                            amount: Math.round(creatorShare * 100),
                            currency: "INR",
                            notes: { drop_id: dropData._id.toString() },
                            on_hold: false
                        }]
                    });
                } catch (routeErr) { console.error("Split Failed:", routeErr); }
            }
            res.status(200).json({ status: "success", drop: dropData });
        } else {
            res.status(400).json({ status: "failed", msg: "Invalid Signature" });
        }
    } catch (error) { res.status(500).json({ msg: "Payment verification failed" }); }
};

/**
 * 7. OPERATIONAL ROUTES (UNTOUCHED)
 */
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: Math.round(Number(amount) * 100), 
            currency: "INR", receipt: `rcpt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) { res.status(500).json({ msg: "Order failed" }); }
};

exports.createPayoutAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });
        if (!user.razorpayAccountId) {
            user.payoutSettings.onboardingStatus = 'pending';
            user.payoutSettings.bankDetailsLinked = false;
            await user.save();
            return res.json({ msg: "KYC required", onboardingUrl: "https://dashboard.razorpay.com/signin" });
        }
        res.json({ msg: "Account active", accountId: user.razorpayAccountId });
    } catch (error) { res.status(500).json({ msg: "Payout system offline" }); }
};

exports.handleWithdrawRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.walletBalance < 100) return res.status(400).json({ msg: "Min ₹100 required" });
        user.walletBalance = 0;
        await user.save();
        res.json({ status: "success", msg: "Withdrawal processed" });
    } catch (error) { res.status(500).json({ msg: "Withdrawal failed" }); }
};

exports.getAnalytics = async (req, res) => {
    try {
        const { streamerId } = req.params;
        const { range } = req.query; 
        let startDate = moment().subtract(6, 'days').startOf('day').toDate();
        if (range === '1Y') startDate = moment().subtract(1, 'year').startOf('month').toDate();
        if (range === '1M') startDate = moment().subtract(30, 'days').startOf('day').toDate();
        const stats = await Drop.aggregate([
            { $match: { streamerId, status: 'completed', createdAt: { $gte: startDate } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: "$amount" } }},
            { $sort: { "_id": 1 } }
        ]);
        res.json({ points: stats.map(s => s.total) });
    } catch (error) { res.status(500).send(); }
};

exports.getTopDonors = async (req, res) => {
    try {
        const topDonors = await Drop.aggregate([
            { $match: { streamerId: req.params.streamerId, status: 'completed' } },
            { $group: { _id: "$donorName", total: { $sum: "$amount" } } },
            { $sort: { total: -1 } }, { $limit: 5 }
        ]);
        res.json(topDonors);
    } catch (err) { res.status(500).send(); }
};

exports.getRecentDrops = async (req, res) => {
    try {
        const drops = await Drop.find({ streamerId: req.params.streamerId }).sort({ createdAt: -1 }).limit(10);
        res.json(drops);
    } catch (err) { res.status(500).send(); }
};

/**
 * UPDATED GET GOAL: Ensures Tier data explicitly hits the frontend.
 */
exports.getGoal = async (req, res) => {
    try {
        const user = await User.findOne({ streamerId: req.params.streamerId })
            .select('goalSettings tier username bio streamerId'); 

        if (!user) return res.status(404).json({ msg: "Not found" });
        
        // Structure the response exactly as DonationPage expects
        res.status(200).json({
            ...user.goalSettings.toObject(), // Keeps goal bar working
            tier: user.tier || 'none',
            username: user.username,
            bio: user.bio,
            streamerId: user.streamerId
        });
    } catch (error) { 
        console.error("Get Goal Error:", error);
        res.status(500).send(); 
    }
};

exports.testDrop = async (req, res) => {
    try {
        const { streamerId, donorName, amount, message, sticker } = req.body;
        const streamer = await User.findOne({ streamerId });
        const io = req.app.get('io');
        if (io) {
            io.to(streamer.obsKey).emit('new-drop', { donorName, amount, message, sticker });
            return res.status(200).json({ status: "success" });
        }
        res.status(500).json({ msg: "Socket error" });
    } catch (error) { res.status(500).json({ msg: "Error" }); }
};

exports.getTransactions = async (req, res) => {
    try {
        const history = await Drop.find({ streamerId: req.params.streamerId, status: 'completed' }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) { res.status(500).send(); }
};
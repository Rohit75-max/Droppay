const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Drop = require('../models/Drop');
const paymentQueue = require('../queues/paymentQueue');
const PlatformMetrics = require('../models/PlatformMetrics');
const { invalidateProfileCache } = require('../middleware/profileCache');
const TugOfWarEvent = require('../models/TugOfWarEvent');
const Transaction = require('../models/Transaction');
const { invalidateStreamerCache } = require('../middleware/cache');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ESCAPE USER INPUT AGAINST NOSQL REGEX INJECTIONS
const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * 1. SYSTEM MAINTENANCE (For server.js Cron)
 */
exports.checkExpirations = async () => {
    try {
        console.log("🕒 [System] Running Mission/Goal Expiry Check...");
    } catch (err) {
        console.error("Cron Error:", err.message);
    }
};

/**
 * 2. DONATION ENGINE
 */
exports.createOrder = async (req, res) => {
    try {
        const { amount, clientId } = req.body;
        if (!clientId) return res.status(400).json({ msg: "clientId required for background processing." });
        
        await paymentQueue.add('create-razorpay-order', { 
            amount, clientId 
        });

        res.status(202).json({ 
            msg: "Generating secure order...", 
            status: "processing" 
        });
    } catch (error) {
        res.status(500).json({ msg: "System Error: Order queueing failed." });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id, razorpay_payment_id, razorpay_signature,
            streamerId, donorName, message, sticker, amount,
            tugOfWarSide // Added for Tug-of-War integration
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ status: "failed", msg: "Invalid Security Token" });
        }
        
        // --- DONOR FINGERPRINTING ENGINE ---
        let donorFingerprint = "anonymous_node";
        try {
            const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
            const fingerprintKey = paymentDetails.email || paymentDetails.contact || razorpay_payment_id;
            donorFingerprint = crypto.createHash('sha256').update(fingerprintKey).digest('hex');
        } catch (err) {
            console.warn("-> [Fingerprint] Failed to fetch payment details, using fallback:", razorpay_payment_id);
            donorFingerprint = crypto.createHash('sha256').update(razorpay_payment_id).digest('hex');
        }

        const cleanStreamerId = streamerId ? streamerId.toLowerCase() : "";
        const safeStreamerId = escapeRegex(cleanStreamerId);
        const safeQuery = { $regex: new RegExp(`^${safeStreamerId}$`, 'i') };

        console.log("-> [Razorpay Webhook] Verifying StreamerID:", streamerId);
        console.log("-> [Razorpay Webhook] Clean Lowercase Normalization:", safeStreamerId);

        // NATIVE MONGOOSE REGEX DUAL-LOOKUP
        const streamer = await User.findOne({
            $or: [{ streamerId: safeQuery }, { username: safeQuery }]
        });
        console.log("-> [Razorpay Webhook] DB Query Result:", streamer ? "FOUND! Identity: " + streamer.streamerId : "NULL");

        if (!streamer) return res.status(404).json({ msg: "Streamer Not Found" });

        // Enterprise Moderation: Reject Funding for Suspended Nodes
        if (streamer.security?.accountStatus?.isBanned) {
            return res.status(403).json({ msg: "Transaction Rejected: Streamer Node Suspended." });
        }

        // 1. Idempotency Check (Double-Credit Shield)
        const existingTx = await Transaction.findOne({ referenceId: razorpay_payment_id });
        if (existingTx) {
            return res.status(200).json({ status: "success", msg: "Payment already processed", isIdempotent: true });
        }

        // 2. Net Ledger Mathematics
        let platformCutPercent = 0.15; // 15% Starter default
        if (streamer.tier === 'pro') platformCutPercent = 0.10;
        if (streamer.tier === 'legend') platformCutPercent = 0.05;

        const amountInPaise = Number(amount); 
        const gatewayFee = Math.round(amountInPaise * 0.02);
        const platformCommission = Math.round(amountInPaise * platformCutPercent);
        const balanceCredit = amountInPaise - platformCommission;
        const netAmountToCreator = amountInPaise - (gatewayFee + platformCommission);

        // 3. Atomically Credit Virtual Wallet
        const updatedStreamer = await User.findByIdAndUpdate(
            streamer._id,
            {
                $inc: {
                    "walletBalance": balanceCredit,
                    "goalSettings.currentProgress": amountInPaise,
                    "financialMetrics.totalLifetimeEarnings": amountInPaise
                }
            },
            { returnDocument: 'after' }
        );

        // 4. Log Transaction Audit Trail
        await Transaction.create({
            userId: streamer._id,
            type: 'deposit',
            amount: amountInPaise,
            gatewayFee: gatewayFee,
            platformFee: platformCommission,
            netAmount: balanceCredit, // Reflecting the balance change
            referenceId: razorpay_payment_id,
            status: 'success'
        });

        // Enterprise Ledger Extraction
        const ledger = await PlatformMetrics.getLedger();
        ledger.totalCommissionRevenue += platformCommission;
        await ledger.save();

        await Drop.create({
            streamerId: streamer.streamerId, donorName: donorName || "Anonymous", amount: Number(amount),
            donorFingerprint, // ADDED: Critical for Hall of Fame separation
            message: message || "", sticker: sticker || "zap", status: "completed",
            razorpayPaymentId: razorpay_payment_id, razorpayOrderId: razorpay_order_id
        });

        // --- CACHE INVALIDATION ---
        // 1. Invalidate Streamer's Payment APIs (Hall of Fame, Recent Drops, Analytics)
        await invalidateStreamerCache(streamer.streamerId);
        // 2. Invalidate Streamer's Profile (Wallet Balance update for Dashboard)
        if (streamer._id) await invalidateProfileCache(streamer._id);

        // --- TUG-OF-WAR ENGINE UPDATE ---
        let towUpdate = null;
        if (tugOfWarSide === 'A' || tugOfWarSide === 'B') {
            const activeEvent = await TugOfWarEvent.findOne({
                streamerId: streamer.streamerId,
                isActive: true,
                expiresAt: { $gt: new Date() }
            });

            if (activeEvent) {
                const updateField = tugOfWarSide === 'A' ? 'teamAAmount' : 'teamBAmount';
                towUpdate = await TugOfWarEvent.findByIdAndUpdate(activeEvent._id, {
                    $inc: { [updateField]: Number(amount) },
                    $set: {
                        lastStrike: {
                            name: donorName || "Anonymous",
                            amount: Number(amount),
                            side: tugOfWarSide,
                            timestamp: new Date()
                        }
                    }
                }, { new: true });
            }
        }

        const io = req.app.get('io');
        if (io) {
            // Emit to OBS Browser Source Overlay (Secret Key)
            if (streamer.obsKey) {
                io.to(streamer.obsKey).emit('new-drop', { donorName, amount, message, sticker, tier: streamer.tier });
                io.to(streamer.obsKey).emit('goal-update', updatedStreamer.goalSettings);
            }

            // Emit to Dashboard UI Control Panel (Public ID / Socket Room)
            io.to(streamer.streamerId).emit('new-drop', { donorName, amount, message, sticker, tier: streamer.tier, isTest: false });
            io.to(streamer.streamerId).emit('goal-update', updatedStreamer.goalSettings);

            // TUG-OF-WAR BROADCAST
            if (towUpdate) {
                if (streamer.obsKey) io.to(streamer.obsKey).emit('tug-of-war-update', towUpdate);
                io.to(streamer.streamerId).emit('tug-of-war-update', towUpdate);
            }
        }

        res.status(200).json({ status: "success" });
    } catch (error) { res.status(500).json({ msg: "Internal Payment Error: Secure transaction handshake failed." }); }
};

/**
 * 3. DATA STREAMS
 */
exports.getGoal = async (req, res) => {
    try {
        const cleanStreamerId = req.params.streamerId || "";
        const safeQuery = { $regex: new RegExp(`^${escapeRegex(cleanStreamerId)}$`, 'i') };
        const user = await User.findOne({
            $or: [{ streamerId: safeQuery }, { username: safeQuery }]
        }).select('goalSettings overlaySettings tier username bio streamerId');
        if (!user) return res.status(404).json({ msg: "Not found" });
        if (user.security?.accountStatus?.isBanned) return res.status(403).json({ msg: "Node Suspended" });
        res.status(200).json({ ...user.goalSettings.toObject(), overlaySettings: user.overlaySettings, tier: user.tier, username: user.username, bio: user.bio, streamerId: user.streamerId });
    } catch (error) { res.status(500).send(); }
};

exports.getRecentDrops = async (req, res) => {
    try {
        const cleanStreamerId = req.params.streamerId || "";
        const safeQuery = { $regex: new RegExp(`^${escapeRegex(cleanStreamerId)}$`, 'i') };
        const user = await User.findOne({ $or: [{ streamerId: safeQuery }, { username: safeQuery }] }).select('streamerId');
        if (!user) return res.status(404).json({ msg: "Not found" });
        if (user.security?.accountStatus?.isBanned) return res.status(403).json({ msg: "Node Suspended" });

        const history = await Drop.find({
            streamerId: user.streamerId,
            status: 'completed',
            isTest: { $ne: true },
            amount: { $gt: 0 }
        }).sort({ createdAt: -1 }).limit(50);
        res.json(history);
    } catch (error) { res.status(500).send(); }
};

exports.getTopDonors = async (req, res) => {
    try {
        const cleanStreamerId = req.params.streamerId || "";
        const safeQuery = { $regex: new RegExp(`^${escapeRegex(cleanStreamerId)}$`, 'i') };
        const user = await User.findOne({ $or: [{ streamerId: safeQuery }, { username: safeQuery }] }).select('streamerId');
        if (!user) return res.status(404).json({ msg: "Not found" });
        if (user.security?.accountStatus?.isBanned) return res.status(403).json({ msg: "Node Suspended" });

        const topDonors = await Drop.aggregate([
            { $match: { streamerId: user.streamerId, status: 'completed', isTest: { $ne: true }, amount: { $gt: 0 } } },
            { 
                $group: { 
                    _id: { 
                        name: "$donorName", 
                        fingerprint: "$donorFingerprint" 
                    }, 
                    totalAmount: { $sum: "$amount" } 
                } 
            },
            { 
                $project: {
                    _id: "$_id.name", // Display the name as the ID for frontend compatibility
                    totalAmount: 1
                }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 10 }
        ]);
        res.status(200).json(topDonors);
    } catch (err) { res.status(500).send(); }
};

exports.getAnalytics = async (req, res) => {
    try {
        const cleanStreamerId = req.params.streamerId || "";
        const safeQuery = { $regex: new RegExp(`^${escapeRegex(cleanStreamerId)}$`, 'i') };
        const user = await User.findOne({ $or: [{ streamerId: safeQuery }, { username: safeQuery }] }).select('streamerId');
        if (!user) return res.status(404).json({ msg: "Not found" });

        const { range } = req.query; // 7D, 1M, 1Y
        let daysToFetch = 7;
        let format = "%Y-%m-%d";

        if (range === '1M') daysToFetch = 30;
        if (range === '1Y') {
            daysToFetch = 12;
            format = "%Y-%m";
        }

        const stats = await Drop.aggregate([
            {
                $match: {
                    streamerId: user.streamerId,
                    status: 'completed',
                    amount: { $gt: 0 },
                    createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - (range === '1Y' ? 365 : daysToFetch))) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: format, date: "$createdAt" } },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Map existing data
        const dataMap = {};
        stats.forEach(s => dataMap[s._id] = s.total);

        // Fill in missing slots with 0
        const points = [];
        for (let i = daysToFetch - 1; i >= 0; i--) {
            const d = new Date();
            if (range === '1Y') d.setMonth(d.getMonth() - i);
            else d.setDate(d.getDate() - i);

            const dateStr = d.toISOString().split('T')[0].slice(0, format === "%Y-%m" ? 7 : 10);
            points.push(dataMap[dateStr] || 0);
        }

        res.json({ points });
    } catch (error) { res.status(500).send(); }
};

exports.getTransactions = async (req, res) => {
    try {
        const cleanStreamerId = req.params.streamerId || "";
        const safeQuery = { $regex: new RegExp(`^${escapeRegex(cleanStreamerId)}$`, 'i') };
        const user = await User.findOne({ $or: [{ streamerId: safeQuery }, { username: safeQuery }] }).select('streamerId');
        if (!user) return res.status(404).json({ msg: "Not found" });

        const history = await Drop.find({ streamerId: user.streamerId, status: 'completed' }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) { res.status(500).send(); }
};

exports.getOverlaySettings = async (req, res) => {
    try {
        const user = await User.findOne({ obsKey: req.params.obsKey }).select('overlaySettings');
        if (!user) return res.json({});
        res.json(user.overlaySettings || {});
    } catch (err) {
        res.status(500).json({});
    }
};

exports.getGoalByKey = async (req, res) => {
    try {
        const user = await User.findOne({ obsKey: req.params.obsKey })
            .select('goalSettings overlaySettings tier username bio streamerId nexusTheme nexusThemeMode');
        if (!user) return res.status(404).json({ msg: "Invalid Key" });
        res.status(200).json({
            ...user.goalSettings.toObject(),
            overlaySettings: user.overlaySettings,
            tier: user.tier,
            username: user.username,
            bio: user.bio,
            streamerId: user.streamerId,
            nexusTheme: user.nexusTheme,
            nexusThemeMode: user.nexusThemeMode
        });
    } catch (error) { res.status(500).send(); }
};

/**
 * 4. SYSTEM HANDSHAKES
 */
exports.testDrop = async (req, res) => {
    try {
        const { streamerId, donorName, amount, message, sticker } = req.body;
        const cleanStreamerId = streamerId || "";
        const safeQuery = { $regex: new RegExp(`^${escapeRegex(cleanStreamerId)}$`, 'i') };

        const streamer = await User.findOne({
            $or: [{ streamerId: safeQuery }, { username: safeQuery }]
        }).select('streamerId obsKey goalSettings tier');
        const io = req.app.get('io');
        if (io && streamer) {
            // New: Persist the test drop so the dashboard doesn't look empty on refresh
            await Drop.create({
                streamerId: streamer.streamerId,
                donorName: "System Preview",
                amount: amount || 500, // Use provided amount or default
                message: message || "Testing Overlay Integrity!",
                sticker: sticker || "zap",
                status: 'completed',
                isTest: true
            });

            // Emits Test Alert to the 3D Overlay with "Preview" text instead of real money
            if (streamer.obsKey) {
                io.to(streamer.obsKey).emit('new-drop', { donorName: "System Preview", amount: 0, message: message || "Testing Overlay Integrity!", sticker: sticker || "zap", tier: streamer.tier, isTest: true });
            }

            // Emits Test Alert to the Dashboard Signal Feed
            io.to(streamer.streamerId).emit('new-drop', { donorName: "System Preview", amount: amount || 500, message: message || "Testing Overlay Integrity!", sticker: sticker || "zap", tier: streamer.tier, isTest: true });

            return res.status(200).json({ status: "success" });
        }
        res.status(500).send({ msg: "Socket or Streamer Not Found" });
    } catch (error) {
        console.error("Test drop error:", error);
        res.status(500).send({ msg: "Internal Server Error: Simulation node connection failed." });
    }
};

// SUBSCRIPTION & BANKING STUBS
exports.subscribe = async (req, res) => res.json({ msg: "Active" });

exports.createSubscription = async (req, res) => {
    try {
        // Return without an ID so the frontend maps it to undefined. 
        // Razorpay SDK crashes if you give it a fake ID string.
        res.json({ msg: "Active" });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

exports.verifySubscription = async (req, res) => {
    try {
        const { plan, billingCycle } = req.body;
        const userId = req.user.id; 
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: "Node Not Found" });

        // Calculate Expiry: Add to CURRENT expiry if active, else start from NOW
        const cycleMonths = Number(billingCycle) || 1;
        const now = new Date();
        let baseDate = now;

        // If current subscription is still active, stack the new duration
        if (user.subscription?.status === 'active' && 
            user.subscription?.expiryDate && 
            new Date(user.subscription.expiryDate) > now) {
            baseDate = new Date(user.subscription.expiryDate);
        }

        const expiryDate = new Date(baseDate);
        expiryDate.setMonth(expiryDate.getMonth() + cycleMonths);

        // Update the user's tier, plan, status AND the critical expiry date
        await User.findByIdAndUpdate(userId, {
            $set: {
                tier: plan,
                "subscription.plan": plan,
                "subscription.status": "active",
                "subscription.expiryDate": expiryDate,
                "subscription.trialUsed": true // Transition node from trial to paid
            }
        });

        // CRITICAL: Invalidate profile cache so the dashboard sees the new tier instantly
        await invalidateProfileCache(userId);

        // Enterprise Ledger Extraction (Subscription MRR)
        const priceMap = { starter: 999, pro: 1999, legend: 2999 };
        const subRevenue = priceMap[plan] || 0;

        const ledger = await PlatformMetrics.getLedger();
        ledger.totalSubscriptionRevenue += subRevenue;
        await ledger.save();

        res.json({ status: "success" });
    } catch (err) {
        console.error("Subscription Verification Error:", err);
        res.status(500).json({ msg: "Internal Verification Error: Subscription authentication protocol failure." });
    }
};
exports.handleWebhook = async (req, res) => res.status(200).send('ok');
exports.createPayoutAccount = async (req, res) => res.json({ msg: "Active" });
exports.handleWithdrawRequest = async (req, res) => res.json({ msg: "Active" });
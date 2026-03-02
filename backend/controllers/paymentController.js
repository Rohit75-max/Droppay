const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Drop = require('../models/Drop');
const PlatformMetrics = require('../models/PlatformMetrics');
const TugOfWarEvent = require('../models/TugOfWarEvent');

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
        const { amount } = req.body;
        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ msg: "Order generation failed." });
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

        let creatorPercent = 0.85;
        if (streamer.tier === 'pro') creatorPercent = 0.90;
        if (streamer.tier === 'legend') creatorPercent = 0.95;

        const creatorShare = Number(amount) * creatorPercent;
        const platformCut = Number(amount) - creatorShare;

        const updatedStreamer = await User.findByIdAndUpdate(
            streamer._id,
            {
                $inc: {
                    "walletBalance": creatorShare,
                    "goalSettings.currentProgress": Number(amount),
                    "financialMetrics.totalLifetimeEarnings": Number(amount)
                }
            },
            { returnDocument: 'after' }
        );

        // Enterprise Ledger Extraction
        const ledger = await PlatformMetrics.getLedger();
        ledger.totalCommissionRevenue += platformCut;
        await ledger.save();

        await Drop.create({
            streamerId: streamer.streamerId, donorName: donorName || "Anonymous", amount: Number(amount),
            message: message || "", sticker: sticker || "zap", status: "completed",
            razorpayPaymentId: razorpay_payment_id, razorpayOrderId: razorpay_order_id
        });

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
    } catch (error) { res.status(500).json({ msg: "Internal Payment Error" }); }
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
            $or: [{ status: 'completed' }, { isTest: true }]
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
            { $match: { streamerId: user.streamerId, $or: [{ status: 'completed' }, { isTest: true }] } },
            { $group: { _id: "$donorName", totalAmount: { $sum: "$amount" } } },
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
        res.status(500).send({ msg: "Internal Server Error" });
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
        const { plan, razorpay_payment_id } = req.body;
        const userId = req.user.id; // from auth middleware

        // Update the user's tier and subscription status
        await User.findByIdAndUpdate(userId, {
            $set: {
                tier: plan,
                "subscription.plan": plan,
                "subscription.status": "active"
            }
        });

        // Enterprise Ledger Extraction (Subscription MRR)
        const priceMap = { starter: 699, pro: 1499, legend: 2499 };
        const subRevenue = priceMap[plan] || 0;

        const ledger = await PlatformMetrics.getLedger();
        ledger.totalSubscriptionRevenue += subRevenue;
        await ledger.save();

        res.json({ status: "success" });
    } catch (err) {
        console.error("Subscription Verification Error:", err);
        res.status(500).json({ msg: "Internal Verification Error" });
    }
};
exports.handleWebhook = async (req, res) => res.status(200).send('ok');
exports.createPayoutAccount = async (req, res) => res.json({ msg: "Active" });
exports.handleWithdrawRequest = async (req, res) => res.json({ msg: "Active" });
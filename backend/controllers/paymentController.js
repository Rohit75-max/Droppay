const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User'); 
const Drop = require('../models/Drop'); 

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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
            streamerId, donorName, message, sticker, amount 
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ status: "failed", msg: "Invalid Security Token" });
        }

        const streamer = await User.findOne({ streamerId });
        if (!streamer) return res.status(404).json({ msg: "Streamer Not Found" });

        let creatorPercent = 0.85; 
        if (streamer.tier === 'pro') creatorPercent = 0.90; 
        if (streamer.tier === 'legend') creatorPercent = 0.95; 

        const creatorShare = Number(amount) * creatorPercent;

        const updatedStreamer = await User.findOneAndUpdate(
            { streamerId },
            { $inc: { "walletBalance": creatorShare, "goalSettings.currentProgress": Number(amount) } },
            { new: true }
        );

        await Drop.create({
            streamerId, donorName: donorName || "Anonymous", amount: Number(amount), 
            message: message || "", sticker: sticker || "zap", status: "completed",
            razorpayPaymentId: razorpay_payment_id, razorpayOrderId: razorpay_order_id
        });

        const io = req.app.get('io');
        if (io && streamer.obsKey) {
            io.to(streamer.obsKey).emit('new-drop', { donorName, amount, message, sticker });
            io.to(streamer.obsKey).emit('goal-update', updatedStreamer.goalSettings);
        }

        res.status(200).json({ status: "success" });
    } catch (error) { res.status(500).json({ msg: "Internal Payment Error" }); }
};

/**
 * 3. DATA STREAMS
 */
exports.getGoal = async (req, res) => {
    try {
        const user = await User.findOne({ streamerId: req.params.streamerId }).select('goalSettings tier username bio streamerId'); 
        if (!user) return res.status(404).json({ msg: "Not found" });
        res.status(200).json({ ...user.goalSettings.toObject(), tier: user.tier, username: user.username, bio: user.bio, streamerId: user.streamerId });
    } catch (error) { res.status(500).send(); }
};

exports.getRecentDrops = async (req, res) => {
    try {
        const history = await Drop.find({ streamerId: req.params.streamerId, status: 'completed' }).sort({ createdAt: -1 }).limit(50);
        res.json(history);
    } catch (error) { res.status(500).send(); }
};

exports.getTopDonors = async (req, res) => {
    try {
        const topDonors = await Drop.aggregate([
            { $match: { streamerId: req.params.streamerId, status: 'completed' } },
            { $group: { _id: "$donorName", totalAmount: { $sum: "$amount" } } },
            { $sort: { totalAmount: -1 } }, 
            { $limit: 10 } 
        ]);
        res.status(200).json(topDonors);
    } catch (err) { res.status(500).send(); }
};

exports.getAnalytics = async (req, res) => {
    try {
        const stats = await Drop.aggregate([
            { $match: { streamerId: req.params.streamerId, status: 'completed' } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: "$amount" } }},
            { $sort: { "_id": 1 } }
        ]);
        res.json({ points: stats.map(s => s.total) });
    } catch (error) { res.status(500).send(); }
};

exports.getTransactions = async (req, res) => {
    try {
        const history = await Drop.find({ streamerId: req.params.streamerId, status: 'completed' }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) { res.status(500).send(); }
};

/**
 * 4. SYSTEM HANDSHAKES
 */
exports.testDrop = async (req, res) => {
    try {
        const { streamerId, donorName, amount, message, sticker } = req.body;
        const streamer = await User.findOne({ streamerId }).select('obsKey');
        const io = req.app.get('io');
        if (io && streamer?.obsKey) {
            io.to(streamer.obsKey).emit('new-drop', { donorName, amount, message, sticker });
            return res.status(200).json({ status: "success" });
        }
        res.status(500).send();
    } catch (error) { res.status(500).send(); }
};

// SUBSCRIPTION & BANKING STUBS
exports.subscribe = async (req, res) => res.json({ msg: "Active" });
exports.createSubscription = async (req, res) => res.json({ msg: "Active" });
exports.verifySubscription = async (req, res) => res.json({ msg: "Active" });
exports.handleWebhook = async (req, res) => res.status(200).send('ok');
exports.createPayoutAccount = async (req, res) => res.json({ msg: "Active" });
exports.handleWithdrawRequest = async (req, res) => res.json({ msg: "Active" });
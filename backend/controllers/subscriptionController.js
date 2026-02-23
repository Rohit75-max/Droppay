const razorpay = require('../config/razorpay');
const User = require('../models/User');
const crypto = require('crypto');

/**
 * NODE INITIALIZATION
 * Creates the recurring subscription object.
 */
exports.createSubscription = async (req, res) => {
    const { planId } = req.body; 

    const planMapping = {
        starter: process.env.RAZORPAY_PLAN_STARTER_ID,
        pro: process.env.RAZORPAY_PLAN_PRO_ID,
        legend: process.env.RAZORPAY_PLAN_LEGEND_ID
    };

    try {
        const targetPlan = planMapping[planId];
        if (!targetPlan) return res.status(400).json({ msg: "Node Tier Not Found" });

        const options = {
            plan_id: targetPlan,
            customer_notify: 1,
            total_count: 12, // 1 Year of Autopay
            quantity: 1,
            notes: { userId: req.user.id, planType: planId }
        };

        const subscription = await razorpay.subscriptions.create(options);
        
        await User.findByIdAndUpdate(req.user.id, {
            "subscription.razorpaySubscriptionId": subscription.id,
            "subscription.status": "pending"
        });

        res.json(subscription);
    } catch (error) {
        res.status(500).json({ msg: "Deployment Hub Offline" });
    }
};

/**
 * INSTANT HANDSHAKE (FRONTEND VERIFY)
 */
exports.verifySubscription = async (req, res) => {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, plan } = req.body;

    try {
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_payment_id + "|" + razorpay_subscription_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ msg: 'Security Handshake Invalid' });
        }

        await User.findByIdAndUpdate(req.user.id, {
            tier: plan,
            "subscription.status": "active",
            "subscription.plan": plan
        });

        res.json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ msg: "Activation Error" });
    }
};

/**
 * THE 24/7 AUTOPAY WEBHOOK (THE GHOST ENGINE)
 * Handles monthly renewals and payment failures automatically.
 */
exports.handleWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    try {
        // 1. Authenticate Razorpay Request
        const body = JSON.stringify(req.body);
        const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");

        if (expectedSignature !== signature) return res.status(400).send('Unauthorized Node');

        const { event, payload } = req.body;
        const subId = payload.subscription.entity.id;

        // 2. Logic: Subscription Renewed (Autopay Success)
        if (event === 'subscription.charged') {
            await User.findOneAndUpdate(
                { "subscription.razorpaySubscriptionId": subId },
                { 
                  $set: { 
                    "subscription.status": "active", 
                    tier: payload.subscription.entity.notes.planType 
                  } 
                }
            );
        }

        // 3. Logic: Subscription Failed/Cancelled
        if (['subscription.halted', 'subscription.cancelled', 'subscription.expired'].includes(event)) {
            await User.findOneAndUpdate(
                { "subscription.razorpaySubscriptionId": subId },
                { $set: { "subscription.status": "expired", tier: "none" } }
            );
        }

        res.status(200).send('ACK'); // Acknowledge to Razorpay
    } catch (err) {
        console.error("Webhook Node Error:", err);
        res.status(500).send();
    }
};
const razorpay = require('../config/razorpay');
const User = require('../models/User');

exports.createSubscription = async (req, res) => {
    const { planType } = req.body; // 'pro' or 'legend'
    
    // Define prices (in Paise: 100 Paise = 1 INR)
    const prices = {
        pro: 399900,   // ₹3,999
        legend: 499900 // ₹4,999
    };

    try {
        const options = {
            amount: prices[planType],
            currency: "INR",
            receipt: `receipt_${req.user.id}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send("Error creating subscription order");
    }
};
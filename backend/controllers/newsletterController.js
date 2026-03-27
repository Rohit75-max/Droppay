const Subscriber = require('../models/Subscriber');

exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ msg: 'Email is required node.' });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: 'Invalid email orbit format.' });
        }

        // Check if already exists
        const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
        if (existingSubscriber) {
            return res.status(400).json({ msg: 'This node is already synced to our updates.' });
        }

        const newSubscriber = new Subscriber({
            email: email.toLowerCase()
        });

        await newSubscriber.save();

        res.status(201).json({ msg: 'Uplink established. You are now synced!' });
    } catch (err) {
        console.error('Newsletter Subscription Error:', err);
        res.status(500).json({ msg: 'Uplink failure. Please try again later.' });
    }
};

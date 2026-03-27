require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/droppay';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

async function generate() {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB for Seeding");

    const tokens = [];
    for (let i = 1; i <= 100; i++) {
        const username = `stress_user_${i}`;
        let user = await User.findOne({ username });

        if (!user) {
            user = await User.create({
                username,
                email: `${username}@test.com`,
                password: 'password123',
                fullName: `Stress User ${i}`,
                phone: `99887766${String(i).padStart(2, '0')}`,
                streamerId: `str_${i}`,
                obsKey: `obs_${i}`,
                subscription: { status: 'active', tier: 'premium' },
                financialMetrics: { pendingPayouts: 300000 }, // 3000 INR balance for withdrawal tests
                razorpayFundAccountId: `fa_stress_${i}`
            });
        }

        const token = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET, { expiresIn: '1d' });
        tokens.push(`${token},${user._id}`);
    }

    fs.writeFileSync(path.join(__dirname, 'tokens.csv'), `token,userId\n` + tokens.join('\n'));
    console.log("✅ Created tokens.csv with 100 authenticated endpoints.");
    process.exit(0);
}

generate().catch(console.error);

const mongoose = require('mongoose');
const User = require('../models/User');
const Admin = require('../models/Admin');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📡 Connected to Neural Mesh for Migration...');

        const email = 'whisky4477@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ Error: Master Node [whisky4477@gmail.com] not found in User collection.');
            process.exit(1);
        }

        console.log(`🔍 Found Master Node: ${user.username}. Initiating Transcendence...`);

        // Check if Admin already exists
        let admin = await Admin.findOne({ email });
        if (admin) {
            console.log('⚠️ Warning: Admin node already exists. Re-syncing credentials...');
        } else {
            admin = new Admin({
                username: user.username,
                email: user.email,
                password: user.password, // Transfer hashed password
                role: 'superadmin', // Upgrade to Superadmin
                isActive: true
            });
        }

        await admin.save();
        console.log('✅ Admin Node Successfully Established in dedicated registry.');

        // Delete from User collection to enforce separation
        await User.deleteOne({ _id: user._id });
        console.log('🗑️ Legacy User Node purged. Separation complete.');

        console.log('🚀 Phase 2: Identity Reconciliation Complete.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration Critical Failure:', err.message);
        process.exit(1);
    }
}

migrate();

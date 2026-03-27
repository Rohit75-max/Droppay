const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("📡 Connected to MongoDB...");

        const email = process.argv[2];
        const password = process.argv[3] || 'Admin@123'; // Default password if not provided

        if (!email) {
            console.log("\n❌ ERROR: Please provide an email.");
            console.log("👉 Usage: node createAdmin.js <email> [password]\n");
            process.exit(1);
        }

        const cleanEmail = email.trim().toLowerCase();
        const username = cleanEmail.split('@')[0];

        let admin = await Admin.findOne({ email: cleanEmail });

        if (admin) {
            console.log(`\n♻️  Admin node [${cleanEmail}] already exists. Updating password...`);
            admin.password = password;
        } else {
            console.log(`\n✨ Creating new Admin node [${cleanEmail}]...`);
            admin = new Admin({
                username,
                email: cleanEmail,
                password,
                role: 'superadmin'
            });
        }

        await admin.save();
        console.log(`\n✅ SUCCESS: Admin [${cleanEmail}] is now active!`);
        console.log(`🔑 Password: ${password}`);
        console.log("👉 Login at: http://localhost:3001/login\n");
        
        process.exit(0);
    } catch (err) {
        console.error("\n❌ Database operation failed:", err);
        process.exit(1);
    }
};

createAdmin();

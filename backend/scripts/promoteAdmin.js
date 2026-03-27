const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');

const promoteAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const targetCriteria = process.argv[2];
        if (!targetCriteria) {
            console.log("\n❌ ERROR: Please provide an email or streamerID.");
            console.log("👉 Usage: node promoteAdmin.js <email_or_username>\n");
            process.exit(1);
        }

        const cleanTarget = targetCriteria.trim().toLowerCase();

        const user = await User.findOneAndUpdate(
            { $or: [{ email: cleanTarget }, { streamerId: cleanTarget }] },
            { role: 'admin' },
            { returnDocument: 'after' }
        );

        if (user) {
            console.log(`\n✅ SUCCESS: Identity Node [${user.username}] has been granted ADMIN clearance!`);
            console.log("👉 You can now access: http://localhost:3000/admin/secure-portal\n");
        } else {
            console.log(`\n❌ ERROR: No node found matching '${cleanTarget}'.\n`);
        }
        process.exit(0);
    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
};

promoteAdmin();

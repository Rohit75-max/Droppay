require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction'); 
const { createClient } = require('redis');

const MONGO_URI = process.env.MONGO_URI;

async function purge() {
    if (!MONGO_URI) {
        console.error("❌ MONGO_URI is missing from .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for purging...");

        // 1. Delete ALL records in the Transaction Collection 
        // (Clearing stress items while preserving the schema and indexes)
        const txDelete = await Transaction.deleteMany({});
        console.log(`✅ Deleted ${txDelete.deletedCount} Transaction records.`);

        // 2. Delete ALL mock users (stress_user_*)
        const userDelete = await User.deleteMany({ username: /^stress_user_/ });
        console.log(`✅ Deleted ${userDelete.deletedCount} Mock User records.`);

        // 3. Reset financialMetrics for remaining Non-Admin users
        const userUpdate = await User.updateMany(
            { role: { $ne: 'admin' }, username: { $not: /^stress_user_/ } },
            { 
                $set: { 
                    "financialMetrics.pendingPayouts": 0, 
                    "financialMetrics.totalLifetimeEarnings": 0, 
                    "financialMetrics.totalSettled": 0,
                    "payoutSettings.bankDetailsLinked": false,
                    "payoutSettings.bankVerificationStatus": "none"
                } 
            }
        );
        console.log(`✅ Reset FinancialMetrics for ${userUpdate.modifiedCount} Non-Admin users.`);

        // 4. Reset Redis Flags
        console.log("Attempting to flush Redis Pause flags...");
        const redisClient = createClient({
            url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
        });

        redisClient.on('error', (err) => {}); // Quiet error handler for fallback
        
        try {
            await redisClient.connect();
            if (redisClient.isOpen) {
                await redisClient.del('DROPE_GLOBAL_PAUSE');
                console.log("✅ Cleared DROPE_GLOBAL_PAUSE flag from Redis.");
                await redisClient.quit();
            }
        } catch (rErr) {
            console.log("⚠️ Redis connection failed. Flush manual if needed: `redis-cli del DROPE_GLOBAL_PAUSE`.");
        }

        console.log("\n💥 PROJECT FINANCIAL RESET COMPLETE.");
        process.exit(0);

    } catch (err) {
        console.error("Critical Purge failure:", err.message);
        process.exit(1);
    }
}

purge();

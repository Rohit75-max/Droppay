require('dotenv').config();
const mongoose = require('mongoose');

// Dynamic Scheme Lookups
const User = require('./models/User');
const Transaction = require('./models/Transaction');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/droppay';

async function validate() {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB for Audit...");

    // 1. Fetch exact object IDs of the stress test users Node
    const mockUsers = await User.find({ username: /^stress_user_/ }).select('_id');
    const mockUserIds = mockUsers.map(u => u._id);

    // 2. Sum of all mock User Balances
    const userAgg = await User.aggregate([
        { $match: { _id: { $in: mockUserIds } } },
        { $group: { _id: null, total: { $sum: "$financialMetrics.pendingPayouts" } } }
    ]);

    // 3. Sum of Net Amounts from successful Transaction logs of mock users node
    const txAgg = await Transaction.aggregate([
        { $match: { status: 'success', userId: { $in: mockUserIds } } },
        { 
            $group: { 
                _id: null, 
                totalDeposits: { 
                    $sum: { $cond: [{ $eq: ["$type", "deposit"] }, "$netAmount", 0] } 
                },
                totalWithdrawals: { 
                    $sum: { $cond: [{ $eq: ["$type", "withdrawal"] }, "$netAmount", 0] } 
                }
            } 
        }
    ]);

    const totalUserBalance = userAgg.length > 0 ? userAgg[0].total : 0;
    const deposits = txAgg.length > 0 ? txAgg[0].totalDeposits : 0;
    const withdrawals = txAgg.length > 0 ? txAgg[0].totalWithdrawals : 0;

    // We created 100 mock users with 300,000 Paise (₹3000) each = 30,000,000 Paise Node
    const seedOffset = mockUsers.length * 300000;

    const expectedBalance = deposits - withdrawals;
    const adjustedTotalBalance = totalUserBalance - seedOffset;

    console.log("\n📊 ISOLATED LEDGER AUDIT REPORT:");
    console.log(`- Filtered Mock Users: ${mockUsers.length}`);
    console.log(`- Total Mock Balances (Gross): ₹${(totalUserBalance / 100).toFixed(2)}`);
    console.log(`- Total Starting Seed Offset: ₹${(seedOffset / 100).toFixed(2)}`);
    console.log(`- Adjusted Mock balance: ₹${(adjustedTotalBalance / 100).toFixed(2)}`);
    console.log(`- Expected (Deposits - Withdrawals): ₹${(expectedBalance / 100).toFixed(2)}`);

    const difference = Math.abs(adjustedTotalBalance - expectedBalance);
    if (difference > 1) { 
        console.error(`\n❌ LEDGER DISCREPANCY DETECTED! Drift: ₹${(difference / 100).toFixed(2)}`);
        process.exit(1);
    } else {
        console.log("\n✅ LEDGER ISOLATED CONSISTENT! Zero-concurrency leaks found on mock endpoints node simulation.");
        process.exit(0);
    }
}

validate().catch(console.error);

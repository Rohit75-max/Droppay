const User = require('../models/User');
const Drop = require('../models/Drop');
const PlatformMetrics = require('../models/PlatformMetrics');
const GlobalConfig = require('../models/GlobalConfig');

// --- 1. ENTERPRISE NODE AGGREGATOR (With Cursor Pagination) ---
exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const search = req.query.search || '';
        const roleFilter = req.query.role || 'all';

        let query = {};
        if (search) {
            query = {
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                    { streamerId: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        if (roleFilter !== 'all') {
            query.role = roleFilter;
        }

        const totalNodes = await User.countDocuments(query);
        const users = await User.find(query)
            .select('username email streamerId tier role referralCount walletBalance security.lastLogin security.accountStatus.isBanned financialMetrics.totalLifetimeEarnings')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            nodes: users,
            totalPages: Math.ceil(totalNodes / limit),
            currentPage: page,
            totalNodes
        });
    } catch (err) {
        console.error("Admin DB Pull Error:", err);
        res.status(500).json({ msg: "Node Synchronization Failed." });
    }
};

// --- 1.5. DEEP NODE INSPECTION (Fetch specific user by ID) ---
exports.getUserDetails = async (req, res) => {
    try {
        console.log("[ADMIN API] Fetching details for Node ID:", req.params.id);
        if (!req.params.id || req.params.id === 'undefined') {
            return res.status(400).json({ msg: "Invalid Node ID provided to API." });
        }
        const user = await User.findById(req.params.id).lean();
        if (!user) {
            console.log("[ADMIN API] Node Not Found in Database:", req.params.id);
            return res.status(404).json({ msg: "Node Not Found." });
        }

        // Append Recent Transactions for Finance Contexts (INCLUDING pending/failed withdrawals)
        const recentTransactions = await Drop.find({ streamerId: user.streamerId })
            .sort({ createdAt: -1 })
            .limit(8)
            .lean()
            .select('donorName amount message status createdAt');

        user.recentTransactions = recentTransactions || [];

        res.status(200).json(user);
    } catch (err) {
        console.error("[ADMIN API] Deep Node Fetch Error:", err);
        res.status(500).json({ msg: "Failed to fetch node details." });
    }
};

// --- 2. MODERATION HAMMER (Suspend / Reinstate) ---
exports.toggleBan = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ msg: "Node Not Found." });
        if (user.role === 'admin') return res.status(403).json({ msg: "Cannot suspend Master Nodes." });

        user.security.accountStatus.isBanned = !user.security.accountStatus.isBanned;

        // Auto-Sever Live Connections upon ban
        if (user.security.accountStatus.isBanned) {
            user.security.accountStatus.banReason = "Admin Intervention - T&C Violation";
            const io = req.app.get('io');
            if (io) {
                io.to(user.streamerId).emit('node-terminated', { msg: "ACCOUNT SUSPENDED." });
                if (user.obsKey) io.to(user.obsKey).emit('node-terminated', { msg: "ACCOUNT SUSPENDED." });
            }
        } else {
            user.security.accountStatus.banReason = "";
        }

        await user.save();
        res.status(200).json({ msg: `Node ${user.security.accountStatus.isBanned ? 'Suspended' : 'Reinstated'}.`, status: user.security.accountStatus.isBanned });
    } catch (err) {
        res.status(500).json({ msg: "Moderation Override Failed." });
    }
};

// --- 3. TIER OVERRIDE (Manual Promotions) ---
exports.updateTier = async (req, res) => {
    try {
        const { id } = req.params;
        const { targetTier } = req.body;

        const validTiers = ['none', 'starter', 'pro', 'legend'];
        if (!validTiers.includes(targetTier)) return res.status(400).json({ msg: "Invalid Tier Classification." });

        const user = await User.findByIdAndUpdate(id, { tier: targetTier }, { returnDocument: 'after' });
        res.status(200).json({ msg: "Tier Override Successful", tier: user.tier });
    } catch (err) {
        res.status(500).json({ msg: "Override Failed." });
    }
};

// --- 4. SYSTEM CLEARANCE (Make Admin) ---
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { targetRole } = req.body;

        if (!['user', 'admin'].includes(targetRole)) return res.status(400).json({ msg: "Invalid Clearance Code." });

        if (req.user.id === id && targetRole === 'user') {
            return res.status(403).json({ msg: "You cannot demote your own Master Node." });
        }

        const user = await User.findByIdAndUpdate(id, { role: targetRole }, { returnDocument: 'after' });
        res.status(200).json({ msg: `Node Clearance Updated to ${targetRole.toUpperCase()}`, role: user.role });
    } catch (err) {
        res.status(500).json({ msg: "Clearance Override Failed." });
    }
};

// --- 5. GLOBAL SYSTEM TELEMETRY (Economy Nexus) ---
exports.getSystemMetrics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        // Count active subscriptions specifically
        const activeSubscriptions = await User.countDocuments({ "subscription.status": "active" });

        // Count ANY user who has a plan other than 'none' to represent lifetime/all-time subscribers
        const lifetimeSubscribers = await User.countDocuments({ "subscription.plan": { $ne: "none" } });

        const tpvData = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalVolume: { $sum: "$financialMetrics.totalLifetimeEarnings" },
                    walletDebt: { $sum: "$walletBalance" },
                    pendingDebt: { $sum: "$financialMetrics.pendingPayouts" },
                    totalSettledDebt: { $sum: "$financialMetrics.totalSettled" }
                }
            }
        ]);

        const totalVolume = tpvData.length > 0 ? tpvData[0].totalVolume : 0;
        const walletDebt = tpvData.length > 0 ? tpvData[0].walletDebt : 0;
        const pendingDebt = tpvData.length > 0 ? (tpvData[0].pendingDebt || 0) : 0;
        const totalUnsettledDebt = walletDebt + pendingDebt;
        const totalSettledDebt = tpvData.length > 0 ? tpvData[0].totalSettledDebt : 0;

        // Dynamic Mathematical Deduction of DropPay's All-Time Retained Earnings (Historical Integrity)
        // Platform Cut = Gross Volume - (Streamer Liabilities + Settled Streamer Debt)
        const dynamicCommission = totalVolume - (totalUnsettledDebt + totalSettledDebt);

        const ledger = await PlatformMetrics.getLedger();

        res.status(200).json({
            totalUsers,
            activeSubscriptions,
            lifetimeSubscribers, // Included in the payload
            totalVolume,
            totalUnsettledDebt,
            platformCommission: Math.max(0, dynamicCommission),
            platformSubscriptions: ledger.totalSubscriptionRevenue,
            platformPayouts: totalSettledDebt
        });
    } catch (err) {
        res.status(500).json({ msg: "Telemetry Compilation Failed." });
    }
};

// --- 6. SETTLEMENT QUEUE (Pending Payouts) ---
exports.getPayoutQueue = async (req, res) => {
    try {
        const queue = await User.find({ "financialMetrics.pendingPayouts": { $gt: 0 } })
            .select('username email streamerId tier walletBalance financialMetrics.totalSettled financialMetrics.pendingPayouts')
            .sort({ "financialMetrics.pendingPayouts": -1 });
        res.status(200).json(queue);
    } catch (err) {
        res.status(500).json({ msg: "Failed to load settlement matrix." });
    }
};

exports.executeSettlement = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user || user.financialMetrics.pendingPayouts <= 0) return res.status(400).json({ msg: "No pending payout requested to settle." });

        const payoutAmount = user.financialMetrics.pendingPayouts;

        user.financialMetrics.totalSettled += payoutAmount;
        user.financialMetrics.pendingPayouts = 0;
        await user.save();

        const ledger = await PlatformMetrics.getLedger();
        ledger.totalPayoutsSettled += payoutAmount;
        await ledger.save();

        // Transition pending withdrawal drops to completed
        await Drop.updateMany(
            { streamerId: user.streamerId, donorName: "WITHDRAWAL", status: 'pending' },
            { $set: { status: 'completed', message: "Payout Successfully Settled to Bank" } }
        );

        res.status(200).json({ msg: "Settlement Executed Successfully.", settledAmount: payoutAmount });
    } catch (err) {
        res.status(500).json({ msg: "Settlement Execution Failed." });
    }
};

// --- 7. GLOBAL CONFIGURATION & BROADCAST ENGINE ---

exports.getGlobalConfig = async (req, res) => {
    try {
        const config = await GlobalConfig.getOrCreate();
        res.status(200).json(config.platformSettings);
    } catch (err) {
        res.status(500).json({ msg: "Failed to retrieve platform settings." });
    }
};

exports.updateGlobalConfig = async (req, res) => {
    try {
        const { platformSettings } = req.body;
        const config = await GlobalConfig.getOrCreate();

        config.platformSettings = {
            ...config.platformSettings,
            ...platformSettings,
            lastUpdatedBy: req.user._id || req.user.id
        };

        await config.save();
        res.status(200).json({ msg: "Platform variables updated.", settings: config.platformSettings });
    } catch (err) {
        res.status(500).json({ msg: "Failed to update platform variables." });
    }
};

exports.dispatchBroadcast = async (req, res) => {
    try {
        const { message, level = 'info' } = req.body;
        if (!message) return res.status(400).json({ msg: "Broadcast packet empty." });

        const io = req.app.get('io');
        if (io) {
            io.emit('system_broadcast', {
                message,
                level,
                timestamp: new Date(),
                sender: 'DropPay Command Center'
            });

            // Update the global config with the last broadcast
            const config = await GlobalConfig.getOrCreate();
            config.platformSettings.broadcastMessage = message;
            await config.save();

            res.status(200).json({ msg: "Broadcast dispatched to all active nodes." });
        } else {
            res.status(500).json({ msg: "Socket uplink offline." });
        }
    } catch (err) {
        res.status(500).json({ msg: "Broadcast dispatch failed." });
    }
};

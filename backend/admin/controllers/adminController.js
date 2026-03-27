const mongoose = require('mongoose');
const os = require('os');
const User = require('../../models/User');
const Drop = require('../../models/Drop');
const PlatformMetrics = require('../../models/PlatformMetrics');
const GlobalConfig = require('../../models/GlobalConfig');
const { logAudit } = require('../../utils/auditLogger');
const Audit = require('../../models/Audit');
const Admin = require('../../models/Admin');

// --- 1. NODE AGGREGATOR ---
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
            .select('username email streamerId tier role referralCount walletBalance security.lastLogin security.accountStatus.isBanned financialMetrics.totalLifetimeEarnings trustScore nodeStatus lastKnownIp')
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
        res.status(500).json({ msg: "Node Synchronization Failed." });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        if (!req.params.id || req.params.id === 'undefined') {
            return res.status(400).json({ msg: "Invalid Node ID." });
        }
        const user = await User.findById(req.params.id).lean();
        if (!user) return res.status(404).json({ msg: "Node Not Found." });

        const recentTransactions = await Drop.find({ streamerId: user.streamerId })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()
            .select('donorName amount message status createdAt');

        user.recentTransactions = recentTransactions || [];
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch node details." });
    }
};

// --- 2. MODERATION ---
exports.toggleBan = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ msg: "Node Not Found." });

        user.security.accountStatus.isBanned = !user.security.accountStatus.isBanned;
        if (user.security.accountStatus.isBanned) {
            user.security.accountStatus.banReason = "Administrative Intervention";
        } else {
            user.security.accountStatus.banReason = "";
        }

        await user.save();

        await logAudit({
            adminId: req.admin.id,
            adminUsername: req.adminRecord.username,
            action: user.security.accountStatus.isBanned ? 'BAN_NODE' : 'UNBAN_NODE',
            targetId: user._id,
            targetName: user.username,
            details: user.security.accountStatus.isBanned ? 'Node suspended' : 'Node reinstated',
            level: user.security.accountStatus.isBanned ? 'warning' : 'info',
            ipAddress: req.ip
        });

        res.status(200).json({ msg: `Status Updated.`, isBanned: user.security.accountStatus.isBanned });
    } catch (err) {
        res.status(500).json({ msg: "Moderation Override Failed." });
    }
};

// --- 3. CONFIG & BROADCAST ---
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
        config.platformSettings = { ...config.platformSettings, ...platformSettings, lastUpdatedBy: req.admin.id };
        await config.save();

        await logAudit({
            adminId: req.admin.id,
            adminUsername: req.adminRecord.username,
            action: 'GLOBAL_CONFIG_UPDATE',
            details: `Platform synchronized: ${Object.keys(platformSettings).join(', ')}`,
            level: 'warning',
            ipAddress: req.ip
        });

        res.status(200).json({ msg: "Settings updated.", settings: config.platformSettings });
    } catch (err) {
        res.status(500).json({ msg: "Update Failed." });
    }
};

// --- 4. TELEMETRY ---
exports.getSystemMetrics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeSubscriptions = await User.countDocuments({ "subscription.status": "active" });
        
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

        const metrics = tpvData[0] || { totalVolume: 0, walletDebt: 0, pendingDebt: 0, totalSettledDebt: 0 };
        
        res.status(200).json({
            totalUsers,
            activeSubscriptions,
            totalVolume: metrics.totalVolume,
            totalLiability: metrics.walletDebt + metrics.pendingDebt,
            totalSettled: metrics.totalSettledDebt
        });
    } catch (err) {
        res.status(500).json({ msg: "Telemetry Compilation Failed." });
    }
};

exports.getAuditLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const totalLogs = await Audit.countDocuments();
        const logs = await Audit.find().sort({ timestamp: -1 }).skip((page - 1) * limit).limit(limit);
        res.status(200).json({ logs, totalPages: Math.ceil(totalLogs / limit), currentPage: page });
    } catch (err) {
        res.status(500).json({ msg: "Logs Offline." });
    }
};

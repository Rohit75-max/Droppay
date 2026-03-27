const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
    getUsers, getUserDetails, toggleBan, updateTier, getSystemMetrics, getTimeSeriesMetrics,
    updateRole, getPayoutQueue, executeSettlement, rejectSettlement,
    getGlobalConfig, updateGlobalConfig, dispatchBroadcast,
    getAdminProfile, updateAdminProfile, uploadAdminAvatar,
    getAuditLogs, getSystemHealth, getFinancialStats, getTransactionsLog,
    toggleGlobalPause, getDisputes, resolveDispute, rejectDispute
} = require('../controllers/adminController');
const upload = require('../middleware/uploadMiddleware');

// All routes here are strictly shielded by `adminAuth`
router.use(adminAuth);

// @route   GET api/admin/users
// @desc    Fetch paginated node telemetry
router.get('/users', getUsers);

// @route   GET api/admin/users/:id
// @desc    Fetch deep telemetry for a specific Node
router.get('/users/:id', getUserDetails);

// @route   PATCH api/admin/users/:id/ban
// @desc    Suspend or Reinstate Identity Node
router.patch('/users/:id/ban', toggleBan);

// @route   PATCH api/admin/users/:id/tier
// @desc    Override Node Tier
router.patch('/users/:id/tier', updateTier);

// @route   PATCH api/admin/users/:id/role
// @desc    Override Node System Clearance
router.patch('/users/:id/role', updateRole);

// @route   GET api/admin/metrics
// @desc    Global TPV and Node count Aggregator
router.get('/metrics', getSystemMetrics);

// @route   GET api/admin/metrics/timeseries
// @desc    30-Day Aggregation for Data Visualizations
router.get('/metrics/timeseries', getTimeSeriesMetrics);

// @route   GET api/admin/payouts
// @desc    Get nodes pending settlement
router.get('/payouts', getPayoutQueue);

// @route   POST api/admin/payouts/:id/settle
// @desc    Execute node payout clearing active wallet debt
router.post('/payouts/:id/settle', executeSettlement);

// @route   POST api/admin/payouts/:id/reject
// @desc    Reject node payout and refund to wallet
router.post('/payouts/:id/reject', rejectSettlement);

// --- GLOBAL SYSTEMS ---

// @route   GET api/admin/config
// @desc    Retrieve platform-wide variables
router.get('/config', getGlobalConfig);

// @route   PATCH api/admin/config
// @desc    Update platform-wide variables
router.patch('/config', updateGlobalConfig);

// @route   POST api/admin/broadcast
// @desc    Dispatch system-wide alert packets
router.post('/broadcast', dispatchBroadcast);

// --- ADMIN SELF PROFILE ---

// @route   GET api/admin/profile
// @desc    Fetch self-profile data for logged in admin
router.get('/profile', getAdminProfile);

// @route   PATCH api/admin/profile
// @desc    Synchronize self-profile data
router.patch('/profile', updateAdminProfile);

// @route   POST api/admin/profile/avatar
// @desc    Upload individual admin identity avatar
router.post('/profile/avatar', upload.single('avatar'), uploadAdminAvatar);

// --- V5 SCALING UPGRADE ---

// @route   GET api/admin/logs
// @desc    Retrieve security and audit packets
router.get('/logs', getAuditLogs);

// @route   GET api/admin/health
// @desc    Monitor system infrastructure vitals
router.get('/health', getSystemHealth);

// @route   POST api/admin/referrals/backfill
// @desc    Recompute referralCount for ALL users from scratch (one-time migration fix)
router.post('/referrals/backfill', async (req, res) => {
    try {
        const User = require('../models/User');

        // Get every user that was referred by someone and is verified
        const referredUsers = await User.find({
            referredBy: { $exists: true, $ne: null },
            isEmailVerified: true
        }).select('referredBy');

        // Tally counts per referrer
        const countMap = {};
        for (const u of referredUsers) {
            const key = u.referredBy.toString();
            countMap[key] = (countMap[key] || 0) + 1;
        }

        // Bulk-update each referrer
        const ops = Object.entries(countMap).map(([id, count]) =>
            User.findByIdAndUpdate(id, { referralCount: count })
        );
        await Promise.all(ops);

        // Zero out anyone not in the map (no verified referrals)
        await User.updateMany(
            { _id: { $nin: Object.keys(countMap).map(id => require('mongoose').Types.ObjectId.createFromHexString(id)) } },
            { $set: { referralCount: 0 } }
        );

        res.json({
            msg: `✅ Backfill complete. Recomputed ${Object.keys(countMap).length} referrer(s).`,
            breakdown: countMap
        });
    } catch (err) {
        console.error('Backfill error:', err);
        res.status(500).json({ msg: err.message });
    }
});

// --- 10. FINANCIAL HEALTH & AUDITS ---

// @route   GET api/admin/stats
// @desc    Calculate Gross TPV, Net Revenue, and Pending Liability
router.get('/stats', getFinancialStats);

// @route   GET api/admin/transactions
// @desc    Retrieve auditing snapshots with pagination bounds
router.get('/transactions', getTransactionsLog);

// --- 11. RESOLUTION CENTER ---

// @route   GET api/admin/disputes
// @desc    Retrieve all active mediation cases
router.get('/disputes', getDisputes);

// @route   POST api/admin/disputes/:id/resolve
// @desc    Authorize a refund and clawback funds
router.post('/disputes/:id/resolve', resolveDispute);

// @route   POST api/admin/disputes/:id/reject
// @desc    Close a dispute as invalid
router.post('/disputes/:id/reject', rejectDispute);

// @route   PUT api/admin/toggle-pause
// @desc    System Panic Button (Circuit Breaker Switch)
router.put('/toggle-pause', toggleGlobalPause);

module.exports = router;

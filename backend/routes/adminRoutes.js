const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { getUsers, toggleBan, updateTier, getSystemMetrics, updateRole, getPayoutQueue, executeSettlement } = require('../controllers/adminController');

// All routes here are strictly shielded by `adminAuth`
router.use(adminAuth);

// @route   GET api/admin/users
// @desc    Fetch paginated node telemetry
router.get('/users', getUsers);

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

// @route   GET api/admin/payouts
// @desc    Get nodes pending settlement
router.get('/payouts', getPayoutQueue);

// @route   POST api/admin/payouts/:id/settle
// @desc    Execute node payout clearing active wallet debt
router.post('/payouts/:id/settle', executeSettlement);

module.exports = router;

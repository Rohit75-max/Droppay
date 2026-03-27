const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
    getUsers, getUserDetails, toggleBan,
    getGlobalConfig, updateGlobalConfig,
    getSystemMetrics, getAuditLogs
} = require('../controllers/adminController');

router.use(adminAuth);

router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id/ban', toggleBan);
router.get('/config', getGlobalConfig);
router.patch('/config', updateGlobalConfig);
router.get('/metrics', getSystemMetrics);
router.get('/logs', getAuditLogs);

module.exports = router;

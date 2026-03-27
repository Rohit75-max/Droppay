const Audit = require('../models/Audit');

/**
 * Log a system-wide audit event for security and compliance.
 * @param {Object} params - Audit parameters
 * @param {string} params.adminId - ID of the admin performing the action
 * @param {string} params.adminUsername - Username of the admin
 * @param {string} params.action - Type of action (e.g., 'SETTLE_PAYOUT')
 * @param {string} [params.targetId] - ID of the affected user/node
 * @param {string} [params.targetName] - Name of the affected node
 * @param {string} [params.details] - Human-readable details of the action
 * @param {string} [params.level] - 'info', 'warning', 'critical'
 * @param {string} [params.ipAddress] - IP of the admin
 */
const logAudit = async ({ adminId, adminUsername, action, targetId, targetName, details, level = 'info', ipAddress }) => {
    try {
        const auditEntry = new Audit({
            adminId,
            adminUsername,
            action,
            targetId,
            targetName,
            details,
            level,
            ipAddress
        });
        await auditEntry.save();
    } catch (err) {
        console.error('Audit Logging Failed:', err);
    }
};

module.exports = { logAudit };

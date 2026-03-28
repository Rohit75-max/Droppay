const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async function (req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No internal token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        // ENTERPRISE SEC: Strict Admin Registry Lookup
        // We now verify against the dedicated Admin collection
        const admin = await Admin.findById(req.user.id).select('role isActive');
        if (!admin || !admin.isActive) {
            return res.status(403).json({ msg: 'Clearance Rejected: Node lacks Administrative Rights or is deactivated.' });
        }

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

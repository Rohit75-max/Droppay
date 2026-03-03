const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No internal token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        // ENTERPRISE SEC: Strict RBAC Lookup
        const user = await User.findById(req.user.id).select('role');
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ msg: 'Clearance Rejected: Node lacks Administrative Rights.' });
        }

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

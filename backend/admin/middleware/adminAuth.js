const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');

module.exports = async function (req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No administrator token, access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded.admin;

        const admin = await Admin.findById(req.admin.id).select('-password');
        if (!admin || !admin.isActive) {
            return res.status(403).json({ msg: 'Forbidden: Admin access revoked or non-existent.' });
        }

        req.adminRecord = admin;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

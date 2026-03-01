const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Check for token in multiple headers for maximum compatibility
    let token = req.header('Authorization') || req.header('x-auth-token');

    // 2. If using standard 'Bearer <token>' format, strip the prefix
    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    // 3. Check if no token exists
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 4. Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user object (id and plan) to the request
        // Fortified: Supports both { user: { id } } and top-level { id } structures
        req.user = decoded.user || { id: decoded.id };

        if (!req.user || !req.user.id) {
            return res.status(401).json({ msg: 'Token logic failure: Identity not found.' });
        }

        next();
    } catch (err) {
        console.error("JWT Auth Error:", err.message);
        res.status(401).json({ msg: 'Token is not valid or has expired' });
    }
};
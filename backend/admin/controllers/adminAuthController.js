const Admin = require('../../models/Admin');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        admin.lastLogin = new Date();
        admin.lastLoginIP = req.ip;
        await admin.save();

        const payload = { admin: { id: admin.id, role: admin.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        res.json(admin);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

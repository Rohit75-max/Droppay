const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/adminAuthController');
const adminAuth = require('../middleware/adminAuth');

router.post('/login', login);
router.get('/profile', adminAuth, getProfile);

module.exports = router;

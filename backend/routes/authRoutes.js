const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
// Added forgotPassword and resetPassword to the import
const { 
    signup, 
    verifyEmail, 
    login, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/authController');

// --- 1. Manual Auth Routes ---
router.post('/signup', signup); 
router.post('/verify-otp', verifyEmail); 
router.post('/login', login);

// New: Password Recovery Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- 2. Google OAuth Routes ---
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', session: false }), 
    (req, res) => {
        const payload = { 
            user: { 
                id: req.user.id, 
                plan: req.user.subscription.plan 
            } 
        };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }, 
            (err, token) => {
                if (err) throw err;
                res.redirect(`http://localhost:3000/dashboard?token=${token}`);
            }
        );
    }
);

module.exports = router;
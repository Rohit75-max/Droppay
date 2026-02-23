const rateLimit = require('express-rate-limit');

/**
 * GLOBAL LIMITER
 * Prevents general spam across all routes.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { msg: "Too many requests from this IP. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * AUTH & PAYMENT LIMITER (STRICT)
 * Prevents brute-force logins and payment spam.
 */
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 10 attempts per hour
  message: { msg: "Security Alert: Too many attempts. Please wait an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { globalLimiter, strictLimiter };
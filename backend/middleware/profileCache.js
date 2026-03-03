/**
 * ─── ANTIGRAVITY: REDIS PROFILE CACHE MIDDLEWARE ────────────────────────────
 * Caches GET /api/user/profile in Redis for 30 seconds per user.
 * On a cache HIT  → responds instantly without touching MongoDB.
 * On a cache MISS → fetches from MongoDB, stores result, then responds.
 * On Redis errors → silently falls through to MongoDB (safe degradation).
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { createClient } = require('redis');

const CACHE_TTL = 30; // seconds

let redisClient = null;
let redisReady = false;

// Lazily connect once and reuse the connection
const getClient = async () => {
    if (redisClient && redisReady) return redisClient;
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
            socket: { reconnectStrategy: false, connectTimeout: 1000 }
        });
        redisClient.on('error', () => { redisReady = false; });
        redisClient.on('ready', () => { redisReady = true; });
        await redisClient.connect();
        redisReady = true;
    } catch {
        redisReady = false;
    }
    return redisClient;
};

/**
 * cacheProfile(req, res, next)
 * Drop this before any route handler that returns user profile data.
 * Cache key = "profile:<userId>" — scoped per user, never cross-contaminated.
 */
const cacheProfile = async (req, res, next) => {
    // Only cache for authenticated requests with a user ID
    if (!req.user?.id) return next();

    const cacheKey = `profile:${req.user.id}`;

    try {
        const client = await getClient();
        if (!redisReady) return next(); // Redis unavailable → fall through

        const cached = await client.get(cacheKey);
        if (cached) {
            // Cache HIT: respond immediately, skip MongoDB
            res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.set('X-Cache', 'HIT');
            return res.json(JSON.parse(cached));
        }

        // Cache MISS: intercept res.json to store result before sending
        const originalJson = res.json.bind(res);
        res.json = (data) => {
            // Store in Redis asynchronously — don't block the response
            client.setEx(cacheKey, CACHE_TTL, JSON.stringify(data)).catch(() => { });
            res.set('X-Cache', 'MISS');
            return originalJson(data);
        };
    } catch {
        // Silent degradation — never break the user experience
    }

    next();
};

/**
 * invalidateProfileCache(userId)
 * Call this after any profile mutation (update-profile, update-goal, etc.)
 * so the next GET returns fresh data instead of stale cache.
 */
const invalidateProfileCache = async (userId) => {
    if (!userId) return;
    try {
        const client = await getClient();
        if (redisReady) await client.del(`profile:${userId}`);
    } catch {
        // Silent — cache miss is safer than a thrown error
    }
};

module.exports = { cacheProfile, invalidateProfileCache };

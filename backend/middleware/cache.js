const redisClient = require('../config/redisClient');

/**
 * Universal Cache Middleware
 * Securely transparent: Uses Redis if online, otherwise completely bypasses itself.
 * @param {number} duration - Cache TTL (Time To Live) in seconds 
 */
const cacheData = (duration) => {
    return async (req, res, next) => {
        // If Redis is offline or disconnected, immediately bypass cache
        if (!redisClient.isReady) {
            return next();
        }

        const key = `__express__${req.originalUrl || req.url}`;

        try {
            const cachedBody = await redisClient.get(key);
            if (cachedBody) {
                // Cache HIT! Serve blazing fast RAM data (0ms DB latency)
                return res.json(JSON.parse(cachedBody));
            } else {
                // Cache MISS! We intercept the controller's res.json() call
                const originalJson = res.json.bind(res);
                
                res.json = (body) => {
                    // Save the computed data to Redis in the background (Non-blocking)
                    redisClient.setEx(key, duration, JSON.stringify(body)).catch(err => {
                        console.error("Redis Pipeline Set Error:", err.message);
                    });
                    
                    // Return the data to the user normally
                    originalJson(body);
                };
                
                // Proceed to Controller
                next();
            }
        } catch (err) {
            console.error("Cache Middleware Exception:", err.message);
            next(); // Safely Fallback to MongoDB if Redis crashes unexpectedly
        }
    };
};

module.exports = cacheData;

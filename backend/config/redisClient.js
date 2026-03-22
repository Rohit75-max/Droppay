const redis = require('redis');

// Create Redis Client (Connects to live URI or falls back to local dev server)
const redisClient = redis.createClient({
    url: process.env.REDIS_URI || 'redis://localhost:6379'
});

// Event Listeners for reliability tracking
redisClient.on('error', (err) => console.log('⚠️ Redis Client Error / Offline:', err.message));
redisClient.on('connect', () => console.log('✅ Redis Connected: Caching Active'));

// Connect asynchronously (We don't await blocking here so the Node app still boots perfectly even if Redis is completely down)
(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Redis connection failed on startup. Falling back to direct DB queries.');
    }
})();

module.exports = redisClient;

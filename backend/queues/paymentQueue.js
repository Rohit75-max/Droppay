const { Queue } = require('bullmq');

// Initialize the queue to connect directly to the existing Redis instance
const paymentQueue = new Queue('RazorpayOrderQueue', {
    connection: {
        url: process.env.REDIS_URI || 'redis://127.0.0.1:6379'
    },
    defaultJobOptions: {
        attempts: 3, // Auto-retry up to 3 times
        backoff: {
            type: 'exponential', // 2s -> 4s -> 8s
            delay: 2000 
        },
        removeOnComplete: true, // Keep Redis RAM clean
        removeOnFail: false // Keep failed jobs in Redis memory temporarily for the DLQ parser
    }
});

// Silence connection error spam for local environments without Redis
paymentQueue.on('error', () => { });

module.exports = paymentQueue;

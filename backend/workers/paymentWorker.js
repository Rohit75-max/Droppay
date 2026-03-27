const { Worker } = require('bullmq');
const Razorpay = require('razorpay');
const FailedJob = require('../models/FailedJob');

// Isolate Razorpay instance in the worker thread
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.startPaymentWorker = (io) => {
    const worker = new Worker('RazorpayOrderQueue', async (job, token) => {
        const redisClient = require('../config/redisClient');
        const isPaused = await redisClient.get('DROPE_GLOBAL_PAUSE');

        if (isPaused === 'true') {
            console.log(`[Circuit Breaker] Job ${job.id} paused. Delaying 5min.`);
            await job.moveToDelayed(Date.now() + 300000, token);
            return { paused: true };
        }

        const { amount, clientId } = job.data;
        
        // 1. Perform the external network wait asynchronously via Redis
        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: `rcpt_${job.id}_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);

        // 2. Emit the exact payload back to the explicit browser requesting it
        if (io && clientId) {
            io.to(clientId).emit('payment-order-ready', {
                status: 'success',
                order: order
            });
        }

        return { success: true, orderId: order.id };
    }, {
        connection: { url: process.env.REDIS_URI || 'redis://127.0.0.1:6379' },
        concurrency: 50, // Handle up to 50 jobs concurrently
        limiter: {
            max: 5,        // Max 5 jobs
            duration: 1000 // In 1 second window to prevent resumed thundering herds
        }
    });

    // 3. Dead Letter Queue & Final Socket Failure Emit
    worker.on('failed', async (job, err) => {
        // If we exhausted all exponential backoff retries:
        if (job.attemptsMade === job.opts.attempts) {
            console.error(`🚨 [DLQ Triggered] Job ${job.id} definitively failed. Logging to DB.`);
            
            try {
                // Enterprise requirement: Log to Database
                await FailedJob.create({
                    jobId: job.id,
                    queueName: 'RazorpayOrderQueue',
                    payload: job.data,
                    errorLog: err.message
                });
            } catch (dbErr) {
                console.error("Failed to write to DLQ DB:", dbErr.message);
            }

            // Emit Failure Socket Error to the React Frontend
            if (io && job.data.clientId) {
                io.to(job.data.clientId).emit('payment_failed', { 
                    status: 'error',
                    msg: 'Razorpay system unreachable after 3 attempts. Please try again later.' 
                });
            }
        } else {
            console.warn(`⏳ Job ${job.id} failed (Attempt ${job.attemptsMade}). Retrying exponentially...`);
        }
    });

    // Silence background connection error spam for local environments without Redis
    worker.on('error', () => { });

    console.log('✅ Background Worker Active: Monitoring RazorpayOrderQueue');
    return worker;
};

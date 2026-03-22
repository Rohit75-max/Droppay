require('dotenv').config(); // MUST BE LINE 1
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

const { globalLimiter, strictLimiter } = require('./middleware/rateLimiter');
const { startPaymentWorker } = require('./workers/paymentWorker');
const connectDB = require('./config/db');
const cors = require('cors');
const cron = require('node-cron');
const paymentController = require('./controllers/paymentController');

const app = express();
const server = http.createServer(app);
const cookieParser = require('cookie-parser');

// 1. SOCKET ENGINE (Logic Preserved)
const setupSockets = async () => {
    const ioOptions = {
        cors: {
            origin: function (origin, callback) { callback(null, true); },
            methods: ["GET", "POST"],
            credentials: true // Added to keep sockets synced with your new login
        },
        transports: ['websocket', 'polling']
    };
    let io;
    try {
        const pubClient = createClient({
            url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
            socket: { reconnectStrategy: false, connectTimeout: 1000 }
        });
        const subClient = pubClient.duplicate();

        // Silence background connection error spam for local dev without causing crashes
        pubClient.on('error', () => {});
        subClient.on('error', () => {});

        await Promise.all([pubClient.connect(), subClient.connect()]);
        io = new Server(server, ioOptions);
        io.adapter(createAdapter(pubClient, subClient));
    } catch (err) {
        io = new Server(server, ioOptions);
    }
    app.set('io', io);
    io.on('connection', (socket) => {
        socket.on('join-overlay', (obsKey) => socket.join(obsKey));
        socket.on('join-room', (roomId) => socket.join(roomId));
    });
};

// 2. CONNECT DATABASE
connectDB();

// 3. MIDDLEWARE
app.use(cors({
    origin: function (origin, callback) { callback(null, true); },
    credentials: true, // MUST BE TRUE to allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// ─── ANTIGRAVITY: GZIP COMPRESSION ─────────────────────────────────────────
// Compresses all API responses (JSON, static files) by 60-80%.
// Threshold: only compress payloads > 1KB to avoid CPU overhead on tiny pings.
const compression = require('compression');
app.use(compression({ threshold: 1024 }));
// ────────────────────────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' })); // CRITICAL: Enables parsing of JSON request bodies up to 10MB for base64 images
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// 4. PROTECTION SYNC (Fixed Path Mismatch)
// Added /signup to the strict limiter to prevent the "Connection Failed" loop
app.post('/api/auth/login', strictLimiter);
app.post('/api/auth/signup', strictLimiter); // SYNCED WITH FRONTEND

// 5. ROUTE MOUNTING
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/onboarding', require('./routes/onboardingRoutes'));
app.use('/api/webhooks', require('./routes/webhookRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/tug-of-war', require('./routes/tugOfWarRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));

// ─── KEEP-ALIVE: Health + Ping endpoints ────────────────────────────────────
// Ping these from cron-job.org every 5-10 min to prevent Render cold starts.
// GET /health → detailed status, GET /ping → minimal (fastest response)
app.get('/health', (req, res) => res.json({
    status: 'ONLINE',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'DropPay API'
}));
app.get('/ping', (req, res) => res.send('pong'));
// ─────────────────────────────────────────────────────────────────────────────

// 6. MISSION CHECKER
cron.schedule('0 0 * * *', () => {
    paymentController.checkExpirations();
});

const PORT = process.env.PORT || 5001;

setupSockets().then(() => {
    startPaymentWorker(app.get('io'));
    
    server.listen(PORT, () => {
        console.log(`🚀 System Green: Server on http://localhost:${PORT}`);
    });
});
require('dotenv').config(); // MUST BE LINE 1
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

const { globalLimiter, strictLimiter } = require('./middleware/rateLimiter');
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
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true // Added to keep sockets synced with your new login
        },
        transports: ['websocket', 'polling']
    };
    let io;
    try {
        const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://127.0.0.1:6379' });
        const subClient = pubClient.duplicate();
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
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // MUST BE TRUE to allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(express.json()); // CRITICAL: Enables parsing of JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. PROTECTION SYNC (Fixed Path Mismatch)
// Added /signup to the strict limiter to prevent the "Connection Failed" loop
app.post('/api/auth/login', strictLimiter);
app.post('/api/auth/signup', strictLimiter); // SYNCED WITH FRONTEND

// 5. ROUTE MOUNTING
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/tug-of-war', require('./routes/tugOfWarRoutes'));

// 6. MISSION CHECKER
cron.schedule('0 0 * * *', () => {
    paymentController.checkExpirations();
});

const PORT = process.env.PORT || 5001;

setupSockets().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 System Green: Server on http://localhost:${PORT}`);
    });
});
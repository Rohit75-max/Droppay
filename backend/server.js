require('dotenv').config();
const express = require('express');
const http = require('http'); 
const { Server } = require('socket.io'); 
const connectDB = require('./config/db');
const cors = require('cors');
const cron = require('node-cron'); 
const paymentController = require('./controllers/paymentController'); 

const app = express();
const server = http.createServer(app); 

// 1. Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
});

// 2. Database Connection
connectDB();

// 3. Middleware Setup
app.use(cors()); 

/**
 * CRITICAL: Webhook Raw Body Handling
 * Razorpay needs the raw body to verify signatures.
 * This ensures express.json() doesn't corrupt the data before verification.
 */
app.use(express.json({
    verify: (req, res, buf) => {
        if (req.originalUrl.includes('/webhook')) {
            req.rawBody = buf.toString();
        }
    }
}));

app.use(express.urlencoded({ extended: true })); 

// Fix: Name this 'io' so the controller can find it with req.app.get('io')
app.set('io', io);

// 4. Socket Handler Logic
io.on('connection', (socket) => {
    console.log('⚡ New Connection:', socket.id);

    socket.on('join-overlay', (obsKey) => {
        socket.join(obsKey);
        console.log(`📡 Overlay joined private room: ${obsKey}`);
    });

    socket.on('disconnect', () => {
        console.log('❌ User Disconnected');
    });
});

/**
 * 5. AUTOMATED MISSION CHECKER (CRITICAL)
 * Runs every night at 00:00 (Midnight).
 */
cron.schedule('0 0 * * *', () => {
    console.log('--- SYSTEM: Running Daily Mission Expiry Check ---');
    paymentController.checkExpirations();
});

// 6. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

app.get('/', (req, res) => {
    res.send('DropPay API is running. Systems Green.');
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
    console.error('💥 Global Error:', err.stack);
    res.status(500).json({ msg: 'Something went wrong on the server.' });
});

// 8. Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`🚀 Server & Socket running on http://localhost:${PORT}`);
});
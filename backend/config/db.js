const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Professional Configuration for scalability
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true, // Automatically builds indexes (great for streamerId uniqueness)
      maxPoolSize: 100, // Handle up to 100 simultaneous connections
      minPoolSize: 10,  // Keep 10 connections always warm
      serverSelectionTimeoutMS: 5000, // Fail fast after 5s if DB is unreachable
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Database Connection Error: ${err.message}`);
    
    // In production, you might want to retry instead of immediate exit
    setTimeout(connectDB, 5000); 
  }
};

// Handle unexpected connection drops after initial start
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB Disconnected. Attempting to reconnect...');
});

// Professional Shutdown: Close Mongoose connection if the Node process ends
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB Connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
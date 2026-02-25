require('dotenv').config();
const mongoose = require('mongoose');

// Connect using the URI from .env
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
}).then(async () => {
  console.log("Connected to MongoDB Atlas.");
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({}).project({ username: 1, email: 1, streamerId: 1 }).toArray();
  console.log("--- USERS IN DB ---");
  users.forEach(u => console.log(`StreamerID: '${u.streamerId}' | Username: '${u.username}' | Email: '${u.email}'`));
  console.log("-------------------");
  process.exit(0);
}).catch(err => {
  console.error("DB Connection Failed:", err);
  process.exit(1);
});

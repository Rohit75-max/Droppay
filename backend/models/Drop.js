const mongoose = require('mongoose');

const DropSchema = new mongoose.Schema({
  streamerId: {
    type: String,
    required: true,
    index: true // Makes searching for a specific streamer's drops faster
  },
  donorName: {
    type: String,
    default: 'Anonymous'
  },
  amount: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    trim: true
  },
  sticker: {
    type: String,
    default: 'zap'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Drop', DropSchema);
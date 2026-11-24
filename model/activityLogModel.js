const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  description: { type: String, required: true },
  ip_address: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
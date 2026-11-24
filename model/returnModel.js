const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  loan: { type: mongoose.Schema.ObjectId, ref: 'Loan', required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  return_date: { type: Date, default: Date.now },
  condition_on_return: { type: String, enum: ['baik', 'rusak ringan', 'rusak berat'], default: 'baik' },
  notes: { type: String },
  archived: { type: Boolean, default: false },
  created_by: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updated_by: { type: mongoose.Schema.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Return', returnSchema);
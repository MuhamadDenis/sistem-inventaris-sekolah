const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  item: { type: mongoose.Schema.ObjectId, ref: 'Item', required: true },
  // Snapshot data barang untuk arsip
  item_snapshot: {
    name: String,
    category_name: String
  },
  quantity: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'returned'], default: 'pending' },
  archived: { type: Boolean, default: false },
  created_by: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updated_by: { type: mongoose.Schema.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Loan', loanSchema);
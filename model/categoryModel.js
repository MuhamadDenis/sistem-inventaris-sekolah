const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Nama kategori wajib diisi'], unique: true },
  description: { type: String },
  archived: { type: Boolean, default: false },
  created_by: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updated_by: { type: mongoose.Schema.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
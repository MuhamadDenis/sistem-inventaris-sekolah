const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Nama barang wajib diisi'] },
  category: { type: mongoose.Schema.ObjectId, ref: 'Category', required: [true, 'Barang harus memiliki kategori'] },
  stock: { type: Number, required: [true, 'Stok wajib diisi'], min: 0 },
  condition: { type: String, enum: ['baik', 'rusak ringan', 'rusak berat'], default: 'baik' },
  archived: { type: Boolean, default: false },
  created_by: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updated_by: { type: mongoose.Schema.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
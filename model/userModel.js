const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Nama wajib diisi'] },
  email: { type: String, required: [true, 'Email wajib diisi'], unique: true, lowercase: true },
  password: { type: String, required: [true, 'Password wajib diisi'], minlength: 6, select: false },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  archived: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Hashing password sebelum disimpan (tanpa parameter & pemanggilan next)
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Method untuk mencocokkan password saat login
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const connectDB = require('../config/db');
const Item = require('../model/itemModel');
const User = require('../model/userModel');
const bcrypt = require('bcryptjs');

// Set timeout global 25 detik
jest.setTimeout(25000);

// Hubungkan database sebelum seluruh test dijalankan di file ini
beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe('Skenario Peminjaman (Loan Test)', () => {
  test('Gagal meminjam jika stok tidak mencukupi (Stok Habis)', async () => {
    // 1. Buat user dummy langsung ke collection (bypass middleware bcrypt yang lambat)
    const uniqueEmail = `user_${Date.now()}@test.com`;
    const hashedPassword = await bcrypt.hash('password123', 6);
    
    await User.collection.insertOne({
      name: 'Test User',
      email: uniqueEmail,
      password: hashedPassword,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    });

    // 2. Login untuk mendapatkan token
    const resLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: uniqueEmail, password: 'password123' });
    
    const token = resLogin.body.token;

    // 3. Buat item dengan stok tipis (1 unit) menggunakan enum 'baik' yang valid
    const item = await Item.create({
      name: 'Projector Test',
      stock: 1,
      condition: 'baik', 
      category: new mongoose.Types.ObjectId()
    });
    const itemId = item._id;

    // 4. Coba pinjam melebihi stok (5 unit)
    const res = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${token}`)
      .send({ item_id: itemId, quantity: 5 });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
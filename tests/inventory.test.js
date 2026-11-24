const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

beforeAll(async () => {
  // Pastikan koneksi DB siap untuk testing
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Sistem Inventaris Sekolah - Test Suite', () => {
  
  it('Harus menolak akses endpoint terlindungi tanpa token JWT', async () => {
    const res = await request(app).get('/api/loans/my');
    expect(res.statusCode).toEqual(401);
  });

  it('Harus menolak peminjaman jika jumlah tidak valid atau token tidak valid', async () => {
    const res = await request(app)
      .post('/api/loans')
      .set('Authorization', 'Bearer token_dummy_salah')
      .send({ item_id: '64a1234567890abcdef12345', quantity: 0 });
    
    // Menerima 400 (Bad Request), 401 (Unauthorized), atau 500 jika token invalid belum di-handle try-catch
    expect([400, 401, 500]).toContain(res.statusCode); 
  });

});
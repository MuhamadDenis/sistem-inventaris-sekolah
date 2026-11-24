const express = require('express');
const returnController = require('../controller/returnController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Return (Pengembalian)
 *   description: Manajemen Pengembalian Barang
 */

/**
 * @swagger
 * /api/returns:
 *   get:
 *     summary: Daftar semua pengembalian (Admin)
 *     tags: [Return (Pengembalian)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan seluruh daftar pengembalian
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Akses ditolak (Hanya untuk Admin)
 *   post:
 *     summary: Mengajukan pengembalian barang berdasarkan loan (User)
 *     tags: [Return (Pengembalian)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loanId
 *             properties:
 *               loanId:
 *                 type: string
 *                 description: ID Peminjaman yang akan dikembalikan
 *                 example: "64a1234567890abcdef12345"
 *     responses:
 *       201:
 *         description: Pengajuan pengembalian berhasil dibuat
 *       400:
 *         description: Data tidak valid atau loan sudah dikembalikan
 *       401:
 *         description: Tidak terautentikasi
 */
router.route('/')
  .get(protect, restrictTo('admin'), returnController.getAllReturnsAdmin)
  .post(protect, returnController.createReturn);

/**
 * @swagger
 * /api/returns/my:
 *   get:
 *     summary: Riwayat pengembalian milik sendiri (User)
 *     tags: [Return (Pengembalian)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar riwayat pengembalian
 *       401:
 *         description: Tidak terautentikasi
 */
router.route('/my')
  .get(protect, returnController.getMyReturns);

/**
 * @swagger
 * /api/returns/{id}/verify:
 *   patch:
 *     summary: Memverifikasi pengembalian & menambah stok kembali (Admin)
 *     tags: [Return (Pengembalian)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Return / Pengembalian
 *     responses:
 *       200:
 *         description: Pengembalian berhasil diverifikasi dan stok dikembalikan
 *       400:
 *         description: Gagal verifikasi atau data tidak ditemukan
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Akses ditolak (Hanya untuk Admin)
 */
router.route('/:id/verify')
  .patch(protect, restrictTo('admin'), returnController.verifyReturn);

module.exports = router;
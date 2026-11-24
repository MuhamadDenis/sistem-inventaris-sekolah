const express = require('express');
const loanController = require('../controller/loanController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Loan (Peminjaman)
 *   description: Manajemen Peminjaman Barang
 */

/**
 * @swagger
 * /api/loans/my:
 *   get:
 *     summary: Riwayat peminjaman milik sendiri (User)
 *     tags: [Loan (Peminjaman)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar peminjaman
 *       401:
 *         description: Tidak terautentikasi
 */
router.route('/my')
  .get(protect, loanController.getMyLoans);

/**
 * @swagger
 * /api/loans/my/{id}:
 *   get:
 *     summary: Detail peminjaman milik sendiri (User)
 *     tags: [Loan (Peminjaman)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Peminjaman
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan detail peminjaman
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Peminjaman tidak ditemukan
 */
router.route('/my/:id')
  .get(protect, loanController.getMyLoanById);

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Daftar semua peminjaman (Admin)
 *     tags: [Loan (Peminjaman)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data peminjaman
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Akses ditolak (Hanya Admin)
 *   post:
 *     summary: Mengajukan peminjaman barang (User)
 *     tags: [Loan (Peminjaman)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - item_id
 *               - quantity
 *             properties:
 *               item_id:
 *                 type: string
 *                 example: "64a1234567890abcdef12345"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Peminjaman berhasil dicatat
 *       400:
 *         description: Data tidak valid atau stok habis
 *       401:
 *         description: Tidak terautentikasi
 */
router.route('/')
  .get(protect, restrictTo('admin'), loanController.getAllLoans)
  .post(protect, loanController.createLoan);

/**
 * @swagger
 * /api/loans/{id}:
 *   get:
 *     summary: Detail peminjaman mana pun (Admin)
 *     tags: [Loan (Peminjaman)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Peminjaman
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan detail peminjaman
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Akses ditolak (Hanya Admin)
 *       404:
 *         description: Peminjaman tidak ditemukan
 */
router.route('/:id')
  .get(protect, restrictTo('admin'), loanController.getLoanById);

/**
 * @swagger
 * /api/loans/{id}/status:
 *   patch:
 *     summary: Memverifikasi / menolak peminjaman (Admin)
 *     tags: [Loan (Peminjaman)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Peminjaman
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected, borrowed]
 *                 example: "approved"
 *     responses:
 *       200:
 *         description: Status peminjaman berhasil diperbarui
 *       400:
 *         description: Status tidak valid atau stok tidak mencukupi
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Akses ditolak (Hanya Admin)
 *       404:
 *         description: Peminjaman tidak ditemukan
 */
router.route('/:id/status')
  .patch(protect, restrictTo('admin'), loanController.updateLoanStatus);

/**
 * @swagger
 * /api/loans/{id}/return:
 *   patch:
 *     summary: Pengembalian barang pinjaman (User / Admin)
 *     tags: [Loan (Peminjaman)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Peminjaman
 *     responses:
 *       200:
 *         description: Barang berhasil dikembalikan dan stok diperbarui
 *       400:
 *         description: Peminjaman belum disetujui atau sudah dikembalikan
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Data peminjaman tidak ditemukan
 */
router.route('/:id/return')
  .patch(protect, loanController.returnLoan);

module.exports = router;
const express = require('express');
const categoryController = require('../controller/categoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manajemen Kategori Barang Inventaris
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Mendapatkan daftar seluruh kategori barang
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar kategori
 *   post:
 *     summary: Menambahkan kategori baru (Khusus Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nama kategori barang
 *     responses:
 *       201:
 *         description: Kategori berhasil ditambahkan
 *       401:
 *         description: Tidak terautentikasi (Token tidak ada atau tidak valid)
 *       403:
 *         description: Akses ditolak (Hanya untuk Admin)
 */
router.route('/')
  .get(categoryController.getAllCategories)
  .post(protect, restrictTo('admin'), categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Mendapatkan detail kategori berdasarkan ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Kategori
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan detail kategori
 *       404:
 *         description: Kategori tidak ditemukan
 *   put:
 *     summary: Memperbarui kategori (Khusus Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Kategori
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nama kategori baru
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Akses ditolak (Hanya untuk Admin)
 *       404:
 *         description: Kategori tidak ditemukan
 *   delete:
 *     summary: Menghapus / mengarsipkan kategori (Khusus Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Kategori
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus / diarsipkan
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Akses ditolak (Hanya untuk Admin)
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.route('/:id')
  .get(categoryController.getCategoryById)
  .put(protect, restrictTo('admin'), categoryController.updateCategory)
  .delete(protect, restrictTo('admin'), categoryController.deleteCategory);

module.exports = router;
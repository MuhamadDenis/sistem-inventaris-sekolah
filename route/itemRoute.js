const express = require('express');
const itemController = require('../controller/itemController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { validateItemCreate } = require('../validator/inventoryValidator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Item (Barang)
 *   description: Manajemen Data Barang Inventaris
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Daftar barang + filter, sort, search, pagination
 *     tags: [Item (Barang)]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan nama atau deskripsi barang
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter berdasarkan ID kategori
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: [baik, rusak_ringan, rusak_berat]
 *         description: Filter berdasarkan kondisi barang
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Pengurutan data (contoh name, -stock, createdAt)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Batas jumlah data per halaman
 *     responses:
 *       200:
 *         description: Berhasil mengambil data daftar barang
 *       500:
 *         description: Kesalahan pada server
 *   post:
 *     summary: Membuat barang baru (Khusus Admin)
 *     tags: [Item (Barang)]
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
 *               - category
 *               - stock
 *               - condition
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Laptop Asus ROG"
 *               category:
 *                 type: string
 *                 example: "64a1234567890abcdef12345"
 *               stock:
 *                 type: integer
 *                 example: 10
 *               condition:
 *                 type: string
 *                 enum: [good, minor_damage, major_damage]
 *                 example: "good"
 *     responses:
 *       201:
 *         description: Barang berhasil ditambahkan
 *       401:
 *         description: Unauthorized (Token tidak ada atau tidak valid)
 *       403:
 *         description: Forbidden (Bukan Admin)
 */
router.route('/')
  .get(itemController.getAllItems)
  .post(protect, restrictTo('admin'), validateItemCreate, validate, itemController.createItem);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Detail barang
 *     tags: [Item (Barang)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Barang
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan detail barang
 *       404:
 *         description: Barang tidak ditemukan
 *   put:
 *     summary: Memperbarui barang (Khusus Admin)
 *     tags: [Item (Barang)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Barang
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               stock:
 *                 type: integer
 *               condition:
 *                 type: string
 *                 enum: [good, minor_damage, major_damage]
 *     responses:
 *       200:
 *         description: Barang berhasil diperbarui
 *       404:
 *         description: Barang tidak ditemukan
 *   delete:
 *     summary: Menghapus / soft delete barang (Khusus Admin)
 *     tags: [Item (Barang)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Barang
 *     responses:
 *       200:
 *         description: Barang berhasil diarsip/dihapus
 *       404:
 *         description: Barang tidak ditemukan
 */
router.route('/:id')
  .get(itemController.getItemById) // Memastikan endpoint GET detail barang ikut terdaftar dengan benar
  .put(protect, restrictTo('admin'), itemController.updateItem)
  .delete(protect, restrictTo('admin'), itemController.deleteItem);

module.exports = router;
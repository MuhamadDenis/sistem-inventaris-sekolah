const express = require('express');
const authController = require('../controller/authController');
const { protect } = require('../middleware/authMiddleware'); // Pastikan path middleware auth kamu sudah benar

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Manajemen Autentikasi Pengguna
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi user baru (default role user)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Data tidak valid atau email sudah terdaftar
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login, mengembalikan JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil dan mengembalikan token JWT
 *       401:
 *         description: Email atau password salah
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Profil user yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil profil user
 *       401:
 *         description: Tidak terautentikasi / Token tidak valid
 */
// Diaktifkan kembali dengan menyertakan middleware protect dan fungsi getMe
router.get('/me', protect, authController.getMe);

module.exports = router;
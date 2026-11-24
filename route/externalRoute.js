const express = require('express');
const externalController = require('../controller/externalController');
const verifyApiKey = require('../middleware/apiKeyMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: External Callback
 *   description: Integrasi Sistem Eksternal & Callback Aktivitas (API Key)
 */

/**
 * @swagger
 * /api/external/activity:
 *   post:
 *     summary: Callback dari sistem eksternal sekolah untuk mencatat aktivitas
 *     tags: [External Callback]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: API Key khusus untuk verifikasi sistem eksternal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - activityType
 *               - description
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID user terkait aktivitas
 *               activityType:
 *                 type: string
 *                 description: Jenis atau tipe aktivitas yang dicatat
 *               description:
 *                 type: string
 *                 description: Keterangan detail aktivitas
 *     responses:
 *       201:
 *         description: Activity log dari sistem eksternal berhasil dicatat
 *       401:
 *         description: API Key tidak ditemukan
 *       403:
 *         description: API Key tidak valid
 *       400:
 *         description: Data request tidak valid
 */
router.post('/activity', verifyApiKey, externalController.logExternalActivity);

module.exports = router;
const express = require('express');
const activityLogController = require('../controller/activityLogController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Activity Log
 *   description: Pencatatan Aktivitas Sistem
 */

/**
 * @swagger
 * /api/activity-logs:
 *   get:
 *     summary: Daftar seluruh activity log (Admin)
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil seluruh daftar activity log
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Akses ditolak (Hanya Admin)
 */
router.route('/')
  .get(protect, restrictTo('admin'), activityLogController.getAllActivityLogs);

/**
 * @swagger
 * /api/activity-logs/my:
 *   get:
 *     summary: Activity log milik sendiri (User)
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil activity log milik sendiri
 *       401:
 *         description: Tidak terautentikasi
 */
router.route('/my')
  .get(protect, activityLogController.getMyActivityLogs);

module.exports = router;
const ActivityLog = require('../model/activityLogModel');
const catchAsync = require('../util/catchAsync');

// 1. Daftar seluruh activity log dengan Filter (Admin)
exports.getAllActivityLogs = catchAsync(async (req, res, next) => {
  const queryObj = {};

  // Filter berdasarkan tipe aktivitas (action)
  if (req.query.action) {
    queryObj.action = req.query.action;
  }

  // Filter berdasarkan rentang tanggal (created_at / createdAt)
  if (req.query.startDate || req.query.endDate) {
    queryObj.createdAt = {};
    if (req.query.startDate) {
      queryObj.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      // Set sampai akhir hari
      const endDate = new Date(req.query.endDate);
      endDate.setHours(23, 59, 59, 999);
      queryObj.createdAt.$lte = endDate;
    }
  }

  const logs = await ActivityLog.find(queryObj)
    .populate('user', 'name email')
    .sort('-createdAt');
  
  res.status(200).json({
    success: true,
    results: logs.length,
    data: logs
  });
});

// 2. Activity log milik sendiri dengan Filter (User)
exports.getMyActivityLogs = catchAsync(async (req, res, next) => {
  const queryObj = { user: req.user._id };

  if (req.query.action) {
    queryObj.action = req.query.action;
  }

  if (req.query.startDate || req.query.endDate) {
    queryObj.createdAt = {};
    if (req.query.startDate) {
      queryObj.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      endDate.setHours(23, 59, 59, 999);
      queryObj.createdAt.$lte = endDate;
    }
  }

  const logs = await ActivityLog.find(queryObj).sort('-createdAt');
  
  res.status(200).json({
    success: true,
    results: logs.length,
    data: logs
  });
});
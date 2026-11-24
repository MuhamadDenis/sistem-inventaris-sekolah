const ActivityLog = require('../model/activityLogModel');
const catchAsync = require('../util/catchAsync');

exports.logExternalActivity = catchAsync(async (req, res, next) => {
  const { action, description, system_source } = req.body;

  const newLog = await ActivityLog.create({
    action: action || 'EXTERNAL_ACTION',
    description: description || 'Aktivitas dari sistem eksternal sekolah',
    ip_address: req.ip,
    notes: `Sumber Sistem: ${system_source || 'Unknown'}`
  });

  res.status(201).json({
    success: true,
    message: 'Aktivitas eksternal berhasil dicatat',
    data: newLog
  });
});
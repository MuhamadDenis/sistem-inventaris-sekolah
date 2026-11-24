const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');

// Middleware untuk memverifikasi token JWT
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1. Cek header authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Tidak terotorisasi, tidak ada token yang dikirim.', 401));
  }

  // 2. Verifikasi token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Cek apakah user masih ada di database
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('Pemilik token ini sudah tidak ada.', 401));
  }

  // Masukkan data user ke objek request
  req.user = currentUser;
  next();
});

// Middleware untuk batasan role (admin / user)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Anda tidak memiliki izin untuk melakukan aksi ini.', 403));
    }
    next();
  };
};
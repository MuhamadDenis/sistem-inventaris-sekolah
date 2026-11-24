const morgan = require('morgan');
const AppError = require('../util/AppError');

// 1. Logger menggunakan morgan (bisa di-setup atau pakai format standard)
exports.requestLogger = morgan('dev');

// 2. Middleware untuk menangani route yang tidak ditemukan (notFound)
exports.notFoundHandler = (req, res, next) => {
  next(new AppError(`Tidak dapat menemukan ${req.originalUrl} di server ini!`, 404));
};

// 3. Global Error Handler Middleware
exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
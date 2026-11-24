const User = require('../model/userModel');
const ActivityLog = require('../model/activityLogModel');
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');
const jwt = require('jsonwebtoken');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

// Register User Baru
exports.register = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || 'user'
  });

  const token = signToken(newUser._id);

  // Catat Activity Log
  await ActivityLog.create({
    user: newUser._id,
    action: 'REGISTER',
    description: `User ${newUser.email} berhasil mendaftarkan akun baru.`,
    ip_address: req.ip
  });

  res.status(201).json({
    success: true,
    token,
    data: {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    }
  });
});

// Login User
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Cek apakah email dan password diisi
  if (!email || !password) {
    return next(new AppError('Harap masukkan email dan password!', 400));
  }

  // 2. Cari user dan ambil password-nya (karena di schema di-select: false)
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email atau password salah!', 401));
  }

  // 3. Jika valid, buat token
  const token = signToken(user._id);

  // Catat Activity Log Login
  await ActivityLog.create({
    user: user._id,
    action: 'LOGIN',
    description: `User ${user.email} berhasil masuk ke sistem.`,
    ip_address: req.ip
  });

  res.status(200).json({
    success: true,
    token,
    message: 'Login berhasil'
  });
});

// Ambil Profil User yang Sedang Login (/api/auth/me)
exports.getMe = catchAsync(async (req, res, next) => {
  // req.user didapatkan dari middleware 'protect' setelah verifikasi token JWT
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    return next(new AppError('User tidak ditemukan', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});
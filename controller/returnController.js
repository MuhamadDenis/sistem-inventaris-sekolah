const Return = require('../model/returnModel');
const Loan = require('../model/loanModel');
const Item = require('../model/itemModel');
const ActivityLog = require('../model/activityLogModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');

// 1. User mengajukan pengembalian barang
exports.createReturn = catchAsync(async (req, res, next) => {
  const { loan_id, notes } = req.body;

  const loan = await Loan.findById(loan_id);
  if (!loan || loan.archived) {
    return next(new AppError('Data peminjaman tidak ditemukan', 404));
  }

  // Pastikan loan milik user yang sedang login dan statusnya approved
  if (loan.user.toString() !== req.user._id.toString()) {
    return next(new AppError('Anda tidak memiliki hak atas peminjaman ini', 403));
  }

  if (loan.status !== 'approved') {
    return next(new AppError('Hanya peminjaman yang disetujui yang dapat dikembalikan', 400));
  }

  // Cek apakah sudah pernah diajukan return sebelumnya
  const existingReturn = await Return.findOne({ loan: loan_id, archived: false });
  if (existingReturn) {
    return next(new AppError('Pengajuan pengembalian untuk peminjaman ini sudah pernah dibuat', 400));
  }

  const newReturn = await Return.create({
    loan: loan._id,
    user: req.user._id,
    notes,
    status: 'pending',
    created_by: req.user._id,
    updated_by: req.user._id
  });

  await ActivityLog.create({
    user: req.user._id,
    action: 'CREATE_RETURN',
    description: `User mengajukan pengembalian untuk peminjaman ID: ${loan._id}`,
    ip_address: req.ip
  });

  res.status(201).json({
    success: true,
    message: 'Pengajuan pengembalian berhasil dikirim, menunggu verifikasi admin.',
    data: newReturn
  });
});

// 2. User melihat riwayat pengembalian miliknya sendiri
exports.getMyReturns = catchAsync(async (req, res, next) => {
  const returns = await Return.find({ user: req.user._id, archived: false }).populate({
    path: 'loan',
    populate: { path: 'item', select: 'name' }
  });
  res.status(200).json({ success: true, results: returns.length, data: returns });
});

// 3. Admin melihat seluruh daftar pengembalian
exports.getAllReturnsAdmin = catchAsync(async (req, res, next) => {
  const returns = await Return.find({ archived: false }).populate('user', 'name email').populate('loan');
  res.status(200).json({ success: true, results: returns.length, data: returns });
});

// 4. Admin verifikasi pengembalian (menambah stok kembali & mengubah status loan jadi returned)
exports.verifyReturn = catchAsync(async (req, res, next) => {
  const returnRecord = await Return.findById(req.params.id).populate('loan');
  if (!returnRecord || returnRecord.archived) {
    return next(new AppError('Data pengembalian tidak ditemukan', 404));
  }

  if (returnRecord.status === 'approved') {
    return next(new AppError('Pengembalian ini sudah diverifikasi sebelumnya', 400));
  }

  const loan = await Loan.findById(returnRecord.loan._id);
  const item = await Item.findById(loan.item);

  if (item) {
    // Tambahkan kembali stok barang
    item.stock += loan.quantity;
    await item.save();
  }

  // Ubah status return menjadi approved
  returnRecord.status = 'approved';
  returnRecord.updated_by = req.user._id;
  returnRecord.updated_at = Date.now();
  await returnRecord.save();

  // Ubah status loan menjadi returned
  loan.status = 'returned';
  loan.updated_by = req.user._id;
  loan.updated_at = Date.now();
  await loan.save();

  await ActivityLog.create({
    user: req.user._id,
    action: 'VERIFY_RETURN',
    description: `Admin menyetujui pengembalian barang. Stok bertambah sejumlah ${loan.quantity}`,
    ip_address: req.ip
  });

  res.status(200).json({
    success: true,
    message: 'Pengembalian berhasil diverifikasi dan stok telah dikembalikan.',
    data: returnRecord
  });
});
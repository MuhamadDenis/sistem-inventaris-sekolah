const Loan = require('../model/loanModel');
const Item = require('../model/itemModel');
const ActivityLog = require('../model/activityLogModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');

// 1. Mengajukan peminjaman barang (User)
exports.createLoan = catchAsync(async (req, res, next) => {
  const { item_id, quantity } = req.body;

  const item = await Item.findById(item_id);
  if (!item || item.archived) {
    return next(new AppError('Barang tidak ditemukan', 404));
  }

  if (item.stock < quantity) {
    return next(new AppError('Stok barang tidak mencukupi', 400));
  }

  const newLoan = await Loan.create({
    item: item_id,
    user: req.user._id,
    quantity,
    status: 'pending',
    created_by: req.user._id,
    updated_by: req.user._id
  });

  await ActivityLog.create({
    user: req.user._id,
    action: 'CREATE_LOAN',
    description: `User mengajukan peminjaman barang: ${item.name} (${quantity} unit)`,
    ip_address: req.ip
  });

  res.status(201).json({ success: true, data: newLoan });
});

// 2. Riwayat peminjaman milik sendiri (User)
exports.getMyLoans = catchAsync(async (req, res, next) => {
  const loans = await Loan.find({ user: req.user._id }).populate('item', 'name condition');
  res.status(200).json({ success: true, results: loans.length, data: loans });
});

// 3. Detail peminjaman milik sendiri (User)
exports.getMyLoanById = catchAsync(async (req, res, next) => {
  const loan = await Loan.findOne({ _id: req.params.id, user: req.user._id }).populate('item', 'name condition');
  if (!loan) {
    return next(new AppError('Peminjaman tidak ditemukan', 404));
  }
  res.status(200).json({ success: true, data: loan });
});

// 4. Daftar semua peminjaman (Admin)
exports.getAllLoans = catchAsync(async (req, res, next) => {
  const loans = await Loan.find().populate('user', 'name email').populate('item', 'name');
  res.status(200).json({ success: true, results: loans.length, data: loans });
});

// 5. Detail peminjaman mana pun (Admin)
exports.getLoanById = catchAsync(async (req, res, next) => {
  const loan = await Loan.findById(req.params.id).populate('user', 'name email').populate('item', 'name');
  if (!loan) {
    return next(new AppError('Peminjaman tidak ditemukan', 404));
  }
  res.status(200).json({ success: true, data: loan });
});

// 6. Memverifikasi / menolak peminjaman (Admin)
exports.updateLoanStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body; // approved / rejected / borrowed
  const loan = await Loan.findById(req.params.id);

  if (!loan) {
    return next(new AppError('Peminjaman tidak ditemukan', 404));
  }

  // Jika disetujui, kurangi stok barang
  if (status === 'approved' && loan.status === 'pending') {
    const item = await Item.findById(loan.item);
    if (item.stock < loan.quantity) {
      return next(new AppError('Stok barang tidak cukup untuk menyetujui peminjaman ini', 400));
    }
    item.stock -= loan.quantity;
    await item.save();
  }

  loan.status = status;
  loan.updated_by = req.user._id;
  loan.updated_at = Date.now();
  await loan.save();

  await ActivityLog.create({
    user: req.user._id,
    action: 'UPDATE_LOAN_STATUS',
    description: `Admin mengubah status peminjaman ID ${loan._id} menjadi ${status}`,
    ip_address: req.ip
  });

  res.status(200).json({ success: true, data: loan });
});

// 7. Mengajukan / Memproses Pengembalian Barang (User / Admin)
exports.returnLoan = catchAsync(async (req, res, next) => {
  const loan = await Loan.findById(req.params.id);

  if (!loan) {
    return next(new AppError('Data peminjaman tidak ditemukan', 404));
  }

  if (loan.status !== 'approved' && loan.status !== 'borrowed') {
    return next(new AppError('Peminjaman ini belum disetujui atau sudah dikembalikan', 400));
  }

  // Kembalikan stok barang ke database
  const item = await Item.findById(loan.item);
  if (item) {
    item.stock += loan.quantity;
    await item.save();
  }

  loan.status = 'returned';
  loan.updated_by = req.user._id;
  loan.updated_at = Date.now();
  await loan.save();

  await ActivityLog.create({
    user: req.user._id,
    action: 'RETURN_LOAN',
    description: `Pengembalian barang untuk peminjaman ID ${loan._id}`,
    ip_address: req.ip
  });

  res.status(200).json({
    success: true,
    message: 'Barang berhasil dikembalikan dan stok diperbarui',
    data: loan
  });
});
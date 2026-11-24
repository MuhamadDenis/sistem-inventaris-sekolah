const Item = require('../model/itemModel');
const ActivityLog = require('../model/activityLogModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');

// Read (Dapat diakses publik dengan Pagination, Filtering, Sorting, & Search)
exports.getAllItems = catchAsync(async (req, res, next) => {
  // 1. Filtering dasar
  const queryObj = { ...req.query, archived: false };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach(el => delete queryObj[el]);

  let query = Item.find(queryObj);

  // 2. Search (berdasarkan nama barang, case-insensitive)
  if (req.query.search) {
    query = query.find({ name: { $regex: req.query.search, $options: 'i' } });
  }

  // 3. Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-created_at'); // Default sorting: terbaru
  }

  // 4. Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit).populate('category', 'name');

  const items = await query;
  const totalItems = await Item.countDocuments({ archived: false });

  res.status(200).json({
    success: true,
    results: items.length,
    pagination: {
      page,
      limit,
      total: totalItems,
      totalPages: Math.ceil(totalItems / limit)
    },
    data: items
  });
});

// Mendapatkan detail barang berdasarkan ID
exports.getItemById = catchAsync(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category', 'name');

  if (!item || item.archived) {
    return next(new AppError('Barang tidak ditemukan', 404));
  }

  res.status(200).json({
    success: true,
    data: item
  });
});

// Create (Khusus Admin + Activity Log)
exports.createItem = catchAsync(async (req, res, next) => {
  console.log('DATA REQ.BODY DARI SWAGGER:', req.body);

  // Validasi manual tambahan untuk memastikan field condition valid jika dikirim
  if (req.body.condition && !['baik', 'rusak ringan', 'rusak berat'].includes(req.body.condition)) {
    return next(new AppError("Kondisi barang harus bernilai: 'baik', 'rusak ringan', atau 'rusak berat'", 400));
  }

  const newItem = await Item.create({
    ...req.body,
    created_by: req.user._id,
    updated_by: req.user._id
  });

  await ActivityLog.create({
    user: req.user._id,
    action: 'CREATE_ITEM',
    description: `Admin menambahkan barang baru: ${newItem.name}`,
    ip_address: req.ip
  });

  res.status(201).json({ success: true, data: newItem });
});

// Update (Khusus Admin + Activity Log)
exports.updateItem = catchAsync(async (req, res, next) => {
  if (req.body.condition && !['baik', 'rusak ringan', 'rusak berat'].includes(req.body.condition)) {
    return next(new AppError("Kondisi barang harus bernilai: 'baik', 'rusak ringan', atau 'rusak berat'", 400));
  }

  req.body.updated_by = req.user._id;
  req.body.updated_at = Date.now();

  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedItem) {
    return next(new AppError('Barang tidak ditemukan', 404));
  }

  await ActivityLog.create({
    user: req.user._id,
    action: 'UPDATE_ITEM',
    description: `Admin memperbarui data barang: ${updatedItem.name}`,
    ip_address: req.ip
  });

  res.status(200).json({ success: true, data: updatedItem });
});

// Delete / Soft Delete (Khusus Admin + Activity Log)
exports.deleteItem = catchAsync(async (req, res, next) => {
  const item = await Item.findByIdAndUpdate(req.params.id, { archived: true }, { new: true });

  if (!item) {
    return next(new AppError('Barang tidak ditemukan', 404));
  }

  await ActivityLog.create({
    user: req.user._id,
    action: 'DELETE_ITEM',
    description: `Admin menghapus (arsip) barang: ${item.name}`,
    ip_address: req.ip
  });

  res.status(200).json({ success: true, data: null });
});
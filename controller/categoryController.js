const Category = require('../model/categoryModel'); // Sesuaikan dengan path model kamu
const catchAsync = require('../util/catchAsync');   // Jika pakai catchAsync
const AppError = require('../util/AppError');

// 1. Mendapatkan semua kategori
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ archived: false });
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories }
  });
});

// 2. Mendapatkan detail kategori berdasarkan ID
exports.getCategoryById = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError('Kategori tidak ditemukan', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { category }
  });
});

// 3. Membuat kategori baru
exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { category: newCategory }
  });
});

// 4. Memperbarui kategori
exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!category) {
    return next(new AppError('Kategori tidak ditemukan', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { category }
  });
});

// 5. Menghapus / Mengarsipkan kategori
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { archived: true }, { new: true });
  if (!category) {
    return next(new AppError('Kategori tidak ditemukan', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Kategori berhasil diarsipkan',
    data: null
  });
});
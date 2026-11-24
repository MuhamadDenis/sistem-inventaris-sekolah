const { body } = require('express-validator');

exports.validateItemCreate = [
  body('name').notEmpty().withMessage('Nama barang wajib diisi'),
  body('category').notEmpty().withMessage('Kategori wajib diisi'),
  body('stock').isInt({ min: 0 }).withMessage('Stok harus berupa angka positif'),
  body('condition').isIn(['baik', 'rusak_ringan', 'rusak_berat']).withMessage('Kondisi tidak valid')
];
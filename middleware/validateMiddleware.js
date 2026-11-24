const { validationResult } = require('express-validator');
const AppError = require('../util/AppError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new AppError(`Validasi gagal: ${errorMessages}`, 400));
  }
  next();
};

module.exports = validate;
const AppError = require('../util/AppError');

const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.EXTERNAL_API_KEY || 'sekolah-inventaris-secret-key';

  if (!apiKey || apiKey !== validApiKey) {
    return next(new AppError('Akses ditolak: API Key tidak valid atau tidak disertakan', 401));
  }

  next();
};

module.exports = verifyApiKey;
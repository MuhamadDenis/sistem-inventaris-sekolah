const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Terhubung: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error Koneksi MongoDB: ${error.message}`);
    // Jangan gunakan process.exit(1) saat mode test agar Jest tidak crash
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

module.exports = connectDB;
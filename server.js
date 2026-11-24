require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

// Import rute secara berurutan dari Auth hingga External Callback
const authRouter = require('./route/authRoute');
const categoryRouter = require('./route/categoryRoute');
const itemRouter = require('./route/itemRoute');
const loanRouter = require('./route/loanRoute');
const returnRouter = require('./route/returnRoute');
const activityLogRouter = require('./route/activityLogRoute');
const externalRouter = require('./route/externalRoute');

const { requestLogger, notFoundHandler, globalErrorHandler } = require('./middleware/basicMiddleware');
const swaggerDocs = require('./swagger');

const app = express();

app.use(express.json());
app.use(requestLogger);

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Pendaftaran rute secara berurutan sesuai spesifikasi
app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/items', itemRouter);
app.use('/api/loans', loanRouter);
app.use('/api/returns', returnRouter);
app.use('/api/activity-logs', activityLogRouter);
app.use('/api/external', externalRouter);

// Dokumentasi Swagger UI
swaggerDocs(app);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
}

module.exports = app;
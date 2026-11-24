const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistem Inventaris Sekolah',
      version: '1.0.0',
      description: 'Dokumentasi Backend API untuk Sistem Inventaris Sekolah',
    },
    servers: [
      {
        url: 'https://sistem-inventaris-sekolah-orpin.vercel.app',
        description: 'Production Server (Vercel)',
      },
      {
        url: 'http://localhost:5000',
        description: 'Development Server (Local)',
      },
    ],
  },
  apis: ['./route/*.js', './controller/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  // Gunakan serve dan setup dalam satu jalur rute eksplisit
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
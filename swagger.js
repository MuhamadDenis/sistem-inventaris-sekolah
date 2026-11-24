const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Inventaris Sekolah',
      version: '1.0.0',
      description: 'Dokumentasi Backend Sistem Inventaris Sekolah (Production Stage 2)',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Masukkan token JWT Anda dengan format: Bearer <token>',
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'Masukkan API Key untuk sistem eksternal',
        },
      },
    },
  },
  // Urutan file route disusun agar tampil berurutan dari Auth di atas hingga External Callback di bawah
  apis: [
    './route/authRoute.js',
    './route/categoryRoute.js',
    './route/itemRoute.js',
    './route/loanRoute.js',
    './route/returnRoute.js',
    './route/activityLogRoute.js', // Pastikan file route activity log ini ada
    './route/externalRoute.js'
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger Docs tersedia di http://localhost:5000/api-docs');
};

module.exports = swaggerDocs;
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
    ],
  },
  apis: ['./route/*.js', './controller/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  // Opsi tambahan menggunakan CDN agar aset CSS/JS Swagger UI tidak 404/putih di Vercel
  const swaggerUiOptions = {
    customSiteTitle: 'api docs - inventaris sekolah',
    customCss: '.swagger-ui .topbar { display: none }',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = swaggerDocs;
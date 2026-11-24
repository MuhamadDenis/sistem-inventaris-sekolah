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
  // Tambahkan opsi kustom agar Swagger UI memuat aset dengan benar di Vercel
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'API Docs - Inventaris Sekolah',
      customCss: '.swagger-ui .topbar { display: none }', // Menyembunyikan topbar bawaan swagger jika perlu
    })
  );

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = swaggerDocs;